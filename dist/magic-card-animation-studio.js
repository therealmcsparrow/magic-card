(()=>{"use strict";var e={3706(e,t,i){i.d(t,["eo",0,"mc-path-canvas"])},3682(e,t,i){const n={colour:"color",centre:"center",grey:"gray",metre:"meter",customis:"customiz",behaviour:"behavior",favourite:"favorite",maximis:"maximiz",minimis:"minimiz",organis:"organiz"};i.d(t,["A",0,e=>e.toLowerCase().replace(/colour|centre|grey|metre|customis|behaviour|favourite|maximis|minimis|organis/g,e=>n[e])])},201(e,t,i){var n=i(4753);const{t:s,tc:a,tx:r,m:o,locale:l,ready:c}=(0,n._H)("labels",()=>i.e(249).then(()=>i(2657)));i.d(t,["G",0,c,"H",0,l,"t",0,s])},4753(e,t,i){var n=i(2016);const s=["en-GB","en-US","nl"];let a,r=0;const o={},l=e=>o[e]||=(console.debug("[i18n] "+e),1),c=e=>(0,n.ZV)(a,e),d=/\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}/,p=/\{((?:[^{}]|\{[^{}]*\})*)\}/,h=(e,t,i)=>e.split(d).flatMap((e,n)=>{if(!(1&n))return void 0===i?e:e.replace(/#/g,c(i));const a=/^\s*(\w+)\s*(?:,\s*(\w+)\s*,([^]*))?$/.exec(e);if(!a)throw 0;const o=t[a[1]];if(void 0===o&&l("missing "+a[1]),!a[2])return"object"==typeof o?[o]:void 0===o?"":"number"==typeof o?c(o):o;const d=a[3].split(p),u="plural"==a[2],m=e=>d[d.findIndex((t,i)=>!(1&i)&&t.trim()==e)+1||-1],g=m("="+o)??m(u?new Intl.PluralRules(s[r]).select(+o):String(o))??m("other");if(void 0===g)throw 0;return h(g,t,u?+o:void 0)}).filter(String),u=(e,t)=>{const i=[],n=e=>i[e]||=t()[e].split("|");let a;const o=(i,s="",o=r)=>{if(!t())return l("not ready "+e),"";const c="number"==typeof i?i:(a||=new Map(n(0).map((e,t)=>[e,t]))).get(s?s+""+i:i)??-1;return c<0?(l("unknown "+i),String(i)):o&&n(o)[c]||(n(0)[c]??"").slice(s?s.length+1:0)},c=(e,t={},i)=>{try{return h(o(e,i),t)}catch{return l("malformed "+e),[o(e,i,0)]}};return{ns:e,locale:()=>s[r],t:(e,t)=>c(e,t).join(""),tc:(e,t,i)=>c(t,i,e).join(""),tx:(e,t)=>c(e,t),m:e=>e}};i.d(t,["Zc",0,e=>{a=e;const t=(e=>{const t=/^(nl|en)(-(gb|au|nz|ie|za|in))?\b/.exec((e||"").toLowerCase());return t?"nl"==t[1]?"nl":t[3]?"en-GB":"en-US":"en-GB"})(e?.locale?.language||e?.language||globalThis.navigator?.language);return r=s.indexOf(t),t},"_H",0,(e,t)=>{let i,n;return{...u(e,()=>i),ready:()=>n||=t().then(e=>(i=e.default,!0),()=>(n=void 0,!1))}},"my",0,(e,t)=>u(e,()=>t)])},1474(e,t,i){i.d(t,{a:()=>a,dI:()=>o});var n=i(9489),s=i(201);function a(e,t,i,a,o={}){const l=(0,n.WP)(t).slice(0,64).map((e,t)=>({id:`part-${t+1}`,name:(0,s.t)(349,{n:t+1}),from:[e.index]})),c=o.embed?function(e){const t=(t,i)=>e.evenodd?.[t]?.includes(i)?' fill-rule="evenodd"':"",i=[...(e.secondary??[]).map((e,i)=>`<path class="mc-accent" d="${r(e)}"${t("accent",i)}/>`),...e.paths.map((e,i)=>`<path d="${r(e)}"${t("paths",i)}/>`),...(e.strokes??[]).map(e=>`<path${e.accent?' class="mc-accent"':""} d="${r(e.d)}" fill="none" stroke="currentColor" stroke-width="${e.width}"${e.cap?` stroke-linecap="${r(e.cap)}"`:""}${e.join?` stroke-linejoin="${r(e.join)}"`:""}/>`)],n=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(e.viewBox||"0 0 24 24")}">${i.join("")}</svg>`;return("undefined"!=typeof TextEncoder?(new TextEncoder).encode(n).length:n.length)>32768?void 0:n}(t):void 0;return{id:i,name:a,kind:"keyframes",duration:2,easing:"ease-in-out",iterations:"infinite",target:"icon",origin:"center",version:1,keyframes:[{at:0,opacity:1}],rig:c?{svg:c,parts:l}:{icon:e,parts:l}}}const r=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");function o(e,t="center"){const[i,n,s,a]=e,r=/left/.test(t)?0:/right/.test(t)?1:.5,o=/top/.test(t)?0:/bottom/.test(t)?1:.5,l=e=>Math.round(100*e)/100;return[l(i+s*r),l(n+a*o)]}i.d(t,["jo",0,(e,t)=>(0,n.Zg)(t.map(t=>e[t]?.bbox).filter(e=>!!e))])},5084(e,t,i){i.d(t,{Cq:()=>b,Z3:()=>x,ar:()=>A,di:()=>j});var n=i(9489),s=i(1474);const a=(e,t,i,n,s,a)=>({id:e,label:t,min:i,max:n,step:s,default:a}),r=(e=100)=>({...a("share",169,10,100,5,e),unit:"%"}),o=()=>({...a("delay",135,0,90,5,0),unit:"%"}),l=()=>a("intensity",259,.25,3,.25,1),c=()=>a("direction",140,-1,1,2,1),d=(e=100)=>[r(e),o(),l(),c()],p=e=>Math.round(1e3*e)/1e3||0,h=(e,t,i="ease-in-out")=>({t:e,k:{transform:{rotate:p(t)},easing:i}}),u=(e,t,i={},n="ease-in-out")=>{const s={};for(const[e,i]of Object.entries(t))s[e]=p(i);return{t:e,k:{transform:s,...i,easing:n}}},m=(e,t)=>e.map(([e,i])=>h(e,t*i)),g=[{id:"swing",name:473,icon:"mdi:metronome",pivot:"top",help:476,params:d(),gen:({intensity:e,direction:t})=>m([[0,0],[.15,1],[.4,-.8],[.6,.5],[.8,-.25],[1,0]],14*e*t)},{id:"ring",name:390,icon:"mdi:bell-ring-outline",pivot:"top",help:394,params:d(70),gen:({intensity:e,direction:t})=>m([[0,0],[.08,1],[.18,-.95],[.28,.85],[.38,-.72],[.48,.58],[.58,-.44],[.68,.3],[.78,-.16],[.88,.06],[1,0]],16*e*t)},{id:"spin",name:446,icon:"mdi:rotate-right",pivot:"center",help:528,params:[r(),o(),a("intensity",527,1,5,1,1),c()],gen:({intensity:e,direction:t})=>[h(0,0,"linear"),h(1,360*Math.max(1,Math.round(e))*t,"linear")]},{id:"pulse",name:369,icon:"mdi:heart-pulse",pivot:"center",help:231,params:d(),gen:({intensity:e,direction:t})=>[u(0,{scale:1}),u(.5,{scale:1+.15*e*t}),u(1,{scale:1})]},{id:"bounce",name:88,icon:"mdi:debug-step-over",pivot:"bottom",help:454,params:d(),gen:({intensity:e,direction:t})=>{const i=-3*e*t;return[u(0,{y:0,scale_x:1,scale_y:1},{},"ease-out"),u(.12,{y:0,scale_x:1.08,scale_y:.9},{},"ease-out"),u(.45,{y:i,scale_x:.96,scale_y:1.06},{},"ease-in"),u(.75,{y:0,scale_x:1.06,scale_y:.92},{},"ease-out"),u(.88,{y:0,scale_x:.98,scale_y:1.02}),u(1,{y:0,scale_x:1,scale_y:1})]}},{id:"shake",name:417,icon:"mdi:vibrate",help:420,params:d(60),gen:({intensity:e,direction:t})=>{const i=1.2*e*t;return[0,-1,1,-1,1,-.6,.6,-.3,.3,0].map((e,t,n)=>u(t/(n.length-1),{x:i*e}))}},{id:"wobble",name:557,icon:"mdi:rotate-3d-variant",pivot:"bottom",help:397,params:d(),gen:({intensity:e,direction:t})=>m([[0,0],[.15,-1],[.3,.75],[.45,-.5],[.6,.3],[.75,-.15],[1,0]],8*e*t)},{id:"blink",name:65,icon:"mdi:eye-outline",help:66,params:[r(),o(),l()],gen:({intensity:e})=>{const t=p(Math.max(0,1-.9*e));return[1,t,1,t,1,1].map((e,t)=>({t:[0,.1,.2,.3,.4,1][t],k:{opacity:e,easing:"linear"}}))}},{id:"fade",name:183,icon:"mdi:circle-opacity",help:185,params:[r(),o(),l()],gen:({intensity:e})=>[{t:0,k:{opacity:1,easing:"ease-in-out"}},{t:.5,k:{opacity:p(Math.max(0,1-.8*e)),easing:"ease-in-out"}},{t:1,k:{opacity:1,easing:"ease-in-out"}}]},...[["slide-up",430,313,"mdi:arrow-up","y",-1],["slide-down",427,310,"mdi:arrow-down","y",1],["slide-left",428,311,"mdi:arrow-left","x",-1],["slide-right",429,312,"mdi:arrow-right","x",1]].map(([e,t,i,n,s,a])=>({id:e,name:t,icon:n,help:i,params:d(),gen:({intensity:e,direction:t})=>{const i=3*e*t*a;return[u(0,{[s]:0}),u(.4,{[s]:i}),u(.6,{[s]:i}),u(1,{[s]:0})]}})),{id:"draw-on",name:160,icon:"mdi:draw",draws:!0,help:161,params:[r(60),o(),c()],gen:({direction:e})=>[{t:0,k:{draw:e>0?0:1,easing:"ease-in-out"}},{t:1,k:{draw:e>0?1:0,easing:"ease-in-out"}}]},{id:"draw-loop",name:159,icon:"mdi:draw-pen",draws:!0,help:162,params:[r(),o()],gen:()=>[{t:0,k:{draw:0,easing:"ease-in-out"}},{t:.45,k:{draw:1,easing:"ease-in-out"}},{t:.7,k:{draw:1,easing:"ease-in-out"}},{t:1,k:{draw:0,easing:"ease-in-out"}}]},{id:"pop",name:360,icon:"mdi:star-four-points-outline",pivot:"center",help:361,params:[r(50),o(),l()],gen:({intensity:e})=>[u(0,{scale:0},{opacity:0},"ease-out"),u(.6,{scale:1+.2*e},{opacity:1},"ease-in-out"),u(1,{scale:1},{opacity:1})]},{id:"float",name:206,icon:"mdi:waves-arrow-up",help:163,params:d(),gen:({intensity:e,direction:t})=>[u(0,{y:0}),u(.5,{y:-1.5*e*t}),u(1,{y:0})]},{id:"flicker",name:203,icon:"mdi:fire",pivot:"bottom",help:204,params:[r(),o(),l()],gen:({intensity:e})=>[[0,1,1,0],[.12,1.08,.85,2],[.25,.96,1,-1.5],[.4,1.1,.9,1],[.55,.97,1,-2],[.7,1.06,.85,1.5],[.85,.98,1,-.5],[1,1,1,0]].map(([t,i,n,s])=>u(t,{scale_y:1+(i-1)*e,skew_x:s*e},{opacity:p(1-(1-n)*Math.min(e,1))}))},{id:"wave",name:547,icon:"mdi:wifi",pivot:"center",help:284,params:d(),gen:({intensity:e})=>{const t=p(Math.max(0,1-.7*Math.min(e,1.4))),i=p(1-.08*e);return[u(0,{scale:i},{opacity:t}),u(.35,{scale:1+.04*e},{opacity:1}),u(.7,{scale:i},{opacity:t}),u(1,{scale:i},{opacity:t})]}}],f=g.map(({gen:e,...t})=>t),v=new Map(g.map(e=>[e.id,e]));function b(e,t={}){const i=v.get(e),n={};for(const e of i?.params??[]){const i=t[e.id];n[e.id]="number"==typeof i&&Number.isFinite(i)?Math.min(e.max,Math.max(e.min,i)):e.default}return n}const y=e=>Math.round(100*e)/100;function x(e,t={}){const i=b(e,t),n=i.delay??0;return w(e,i,n,Math.min(100,n+(i.share??100)))}function w(e,t,i,n){const s=v.get(e);return s?function(e,t,i){const n=i-t,s=e=>{const t={...e};return delete t.easing,t},a=[],r=e=>{const t=a.findIndex(t=>t.at===e.at);t>=0?a[t]={...a[t],...e}:a.push(e)};t>0&&r({at:0,...s(e[0].k)});for(const i of e)r({at:y(t+i.t*n),...i.k});return i<100&&r({at:100,...s(e[e.length-1].k)}),a.sort((e,t)=>e.at-t.at)}(s.gen({intensity:t.intensity??1,direction:(t.direction??1)<0?-1:1}),i,Math.max(n,i+1)):[]}const _=e=>/^(part|group|shape):/.test(e),k=e=>e.slice(e.indexOf(":")+1);function $(e,t){const i=k(t);return t.startsWith("part:")?!!e?.parts.some(e=>e.id===i):t.startsWith("group:")?!!e?.groups?.some(e=>e.id===i):t.startsWith("shape:")?!!e?.shapes?.some(e=>e.id===i):["element","icon","name","state","background"].includes(t)}function M(e,t,i){const n=[...e.tracks??[]],s=n.findIndex(e=>e.target===t);if(s<0&&n.length>=24)return;const a=s>=0?{...n[s],keyframes:i}:{target:t,keyframes:i};return s>=0?n[s]=a:n.push(a),{...e,tracks:n}}function S(e,t,i,a){if(!(i&&a&&e.rig&&_(t)))return e;const r=function(e,t,i){const a=e.rig,r=k(t);if(t.startsWith("shape:")){const e=a?.shapes?.find(e=>e.id===r);return e?(0,n.hd)(e.d):void 0}const o=t.startsWith("group:")?a?.groups?.find(e=>e.id===r)?.parts??[]:[r];return(0,s.jo)(i,o.flatMap(e=>a?.parts.find(t=>t.id===e)?.from??[]))}(e,t,a);if(!r)return e;const[o,l]=(0,s.dI)(r,i),c=`${o}px ${l}px`;return{...e,tracks:(e.tracks??[]).map(e=>e.target===t?{...e,origin:c}:e)}}function C(e,t,i,n){const s=v.get("wave").pivot;return function(e,t){const i=b("wave",e),n=i.delay,s=Math.max(1,Math.min(i.share,100-n)),a=t>1?.6*s:s,r=t>1?(s-a)/(t-1):0;return Array.from({length:t},(e,t)=>[n+t*r,n+t*r+a])}(i,t.length).reduce((e,[a,r],o)=>{const l=M(e,t[o],w("wave",i,a,r));return l?S(l,t[o],s,n.pieces):e},e)}function A(e,t,i,n,s={}){if(t.length<2||"wave"!==i)return t.reduce((e,t)=>function(e,t,i,n,s={}){const a=v.get(i);if(!a||"keyframes"!==e.kind||!$(e.rig,t))return e;if(a.draws&&!_(t))return e;const r=b(i,n);if("wave"===i&&t.startsWith("group:")){let i=e.rig?.groups?.find(e=>e.id===k(t))?.parts??[];r.direction<0&&(i=[...i].reverse());const n={...e,tracks:(e.tracks??[]).filter(e=>e.target!==t)};return n.tracks.length||delete n.tracks,C(n,i.map(e=>`part:${e}`),r,s)}const o=M(e,t,x(i,r));return o?S(o,t,a.pivot,s.pieces):e}(e,t,i,n,s),e);const a=b(i,n),r=(a.direction<0?[...t].reverse():t).filter(t=>$(e.rig,t));return C(e,r,a,s)}function j(e,t){const i=(e.tracks??[]).flatMap(e=>e.target!==t?[e]:e.path?[{...e,keyframes:[]}]:[]),n={...e,tracks:i};return i.length||delete n.tracks,n}i.d(t,["tP",0,f])},9489(e,t,i){i.d(t,{WP:()=>p,Zg:()=>h,hd:()=>u});var n=i(1771);function s(e){const t=e.length?[e[0][0]]:[];for(const[i,n,s,a]of e)for(let e=1;e<=8;e++){const r=e/8,o=1-r,l=o*o*o,c=3*o*o*r,d=3*o*r*r,p=r*r*r;t.push([l*i[0]+c*n[0]+d*s[0]+p*a[0],l*i[1]+c*n[1]+d*s[1]+p*a[1]])}return t}function a(e){let t=0;for(let i=0;i<e.length;i++){const[n,s]=e[i],[a,r]=e[(i+1)%e.length];t+=n*r-a*s}return t/2}function r(e){if(!e.length)return[0,0,0,0];let t=1/0,i=1/0,n=-1/0,s=-1/0;for(const[a,r]of e)a<t&&(t=a),r<i&&(i=r),a>n&&(n=a),r>s&&(s=r);const a=e=>+e.toFixed(3);return[a(t),a(i),a(n-t),a(s-i)]}function o(e,t){let i=!1;for(let n=0,s=t.length-1;n<t.length;s=n++){const[a,r]=t[n],[o,l]=t[s];r>e[1]!=l>e[1]&&e[0]<(o-a)*(e[1]-r)/(l-r)+a&&(i=!i)}return i}function l(e,t){if(!((e,t,i=.001)=>e[0]>=t[0]-i&&e[1]>=t[1]-i&&e[0]+e[2]<=t[0]+t[2]+i&&e[1]+e[3]<=t[1]+t[3]+i)(t.box,e.box))return!1;const i=t.poly,n=Math.max(1,Math.floor(i.length/16));let s=0,a=0;for(let t=0;t<i.length;t+=n)s++,o(i[t],e.poly)&&a++;return s>0&&a/s>=.6}const c=1e-6,d=(e,t)=>({index:e,d:(0,n.ER)(t),bbox:r(t.flatMap(s))});function p(e){const t=[],i=e=>t.push({...e,index:t.length}),o=(t,i)=>!!e.evenodd?.[t]?.includes(i),p=e=>e?{evenodd:!0}:{},h=e=>(0,n.Mj)(e).filter(e=>Math.abs(a(s(e)))>c);if((e.secondary??[]).forEach((e,t)=>{const n=h(e);n.length&&i({...d(0,n),secondary:!0,...p(o("accent",t))})}),1===e.paths.length){const t=o("paths",0);for(const o of function(e,t=!1){const i=(0,n.Mj)(e).map(e=>{const t=s(e);return{cubics:e,poly:t,area:a(t),box:r(t)}}).filter(e=>Math.abs(e.area)>c),o=i.map((e,t)=>t),d=i.map((e,t)=>t).sort((e,t)=>Math.abs(i[t].area)-Math.abs(i[e].area)||e-t);d.forEach((e,n)=>{let s=-1,a=0,r=0;for(let t=0;t<n;t++){const n=d[t];Math.abs(i[n].area)<=Math.abs(i[e].area)||l(i[n],i[e])&&(a+=Math.sign(i[n].area),r++,(s<0||Math.abs(i[n].area)<Math.abs(i[s].area))&&(s=n))}const c=t?r%2==1:0!==a&&a+Math.sign(i[e].area)===0;s>=0&&c&&(o[e]=o[s])});const p=new Map;return o.forEach((e,t)=>{const i=p.get(e);i?i.push(t):p.set(e,[t])}),[...p.values()].sort((e,t)=>e[0]-t[0]).map(e=>e.map(e=>i[e].cubics))}(e.paths[0],t))i({...d(0,o),...p(t)})}else e.paths.forEach((e,t)=>{const n=h(e);n.length&&i({...d(0,n),...p(o("paths",t))})});for(const t of e.strokes??[]){const e=(0,n.Mj)(t.d);e.length&&i({...d(0,e),stroke:{width:t.width,...t.cap?{cap:t.cap}:{},...t.join?{join:t.join}:{}},...t.accent?{secondary:!0}:{}})}return t}function h(e){if(!e.length)return;const t=Math.min(...e.map(e=>e[0])),i=Math.min(...e.map(e=>e[1])),n=Math.max(...e.map(e=>e[0]+e[2])),s=Math.max(...e.map(e=>e[1]+e[3])),a=e=>+e.toFixed(3);return[a(t),a(i),a(n-t),a(s-i)]}function u(e){return r((0,n.Mj)(e).flatMap(s))}},1771(e,t,i){i.d(t,{Bq:()=>v,ER:()=>x,Rr:()=>p,fs:()=>f,uD:()=>m});const n=1e-6,s=(e,t)=>Math.abs(e[0]-t[0])<n&&Math.abs(e[1]-t[1])<n,a=(e,t,i)=>e+(t-e)*i,r=(e,t,i)=>[a(e[0],t[0],i),a(e[1],t[1],i)],o=(e,t,i)=>({c1:[e[0]+2/3*(t[0]-e[0]),e[1]+2/3*(t[1]-e[1])],c2:[i[0]+2/3*(t[0]-i[0]),i[1]+2/3*(t[1]-i[1])],to:i}),l=/[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/y;class c{constructor(e){this.d=e,this.i=0}skip(){for(;this.i<this.d.length&&/[\s,]/.test(this.d[this.i]);)this.i++}done(){return this.skip(),this.i>=this.d.length}command(){this.skip();const e=this.d[this.i];if(e&&/[MmLlHhVvCcSsQqTtAaZz]/.test(e))return this.i++,e}hasNumber(){return this.skip(),/[-+.\d]/.test(this.d[this.i]??"")}number(){this.skip(),l.lastIndex=this.i;const e=l.exec(this.d);if(!e)throw new Error(`Bad path number at ${this.i}`);return this.i+=e[0].length,Number(e[0])}flag(){this.skip();const e=this.d[this.i];if("0"!==e&&"1"!==e)throw new Error(`Bad arc flag at ${this.i}`);return this.i++,"1"===e?1:0}}function d(e,t,i,a,r,o,l){if(s(e,l))return[];if(t=Math.abs(t),i=Math.abs(i),t<n||i<n)return[{to:l}];const c=a*Math.PI/180,d=Math.cos(c),p=Math.sin(c),h=(e[0]-l[0])/2,u=(e[1]-l[1])/2,m=d*h+p*u,g=-p*h+d*u,f=m*m/(t*t)+g*g/(i*i);if(f>1){const e=Math.sqrt(f);t*=e,i*=e}const v=t*t*i*i-t*t*g*g-i*i*m*m,b=t*t*g*g+i*i*m*m;let y=Math.sqrt(Math.max(0,v/b));r===o&&(y=-y);const x=y*t*g/i,w=-y*i*m/t,_=d*x-p*w+(e[0]+l[0])/2,k=p*x+d*w+(e[1]+l[1])/2,$=(e,t,i,n)=>Math.atan2(e*n-t*i,e*i+t*n),M=(m-x)/t,S=(g-w)/i,C=(-m-x)/t,A=(-g-w)/i,j=$(1,0,M,S);let z=$(M,S,C,A);!o&&z>0?z-=2*Math.PI:o&&z<0&&(z+=2*Math.PI);const q=Math.max(1,Math.ceil(Math.abs(z)/(Math.PI/2)-1e-9)),E=z/q,L=4/3*Math.tan(E/4),P=e=>[_+t*Math.cos(e)*d-i*Math.sin(e)*p,k+t*Math.cos(e)*p+i*Math.sin(e)*d],H=e=>[-t*Math.sin(e)*d-i*Math.cos(e)*p,-t*Math.sin(e)*p+i*Math.cos(e)*d],V=[];let D=e;for(let e=0;e<q;e++){const t=j+e*E,i=t+E,n=e===q-1?l:P(i),s=H(t),a=H(i);V.push({c1:[D[0]+L*s[0],D[1]+L*s[1]],c2:[n[0]-L*a[0],n[1]-L*a[1]],to:n}),D=n}return V}function p(e){const t=new c(e),i=[];let n,a,r,l,p=[0,0],h=[0,0];const u=e=>{n||(n={start:p,segs:[],closed:!1},i.push(n),h=p),n.segs.push(e)};try{for(;!t.done();){const e=t.command();if(e)l=e;else{if(!l||!t.hasNumber())break;"M"===l?l="L":"m"===l&&(l="l")}const i=l===l.toLowerCase(),c=i?p[0]:0,m=i?p[1]:0,g=()=>[t.number()+c,t.number()+m];let f,v,b;switch(l.toUpperCase()){case"M":p=g(),h=p,n=void 0;break;case"L":u({to:b=g()});break;case"H":u({to:b=[t.number()+c,p[1]]});break;case"V":u({to:b=[p[0],t.number()+m]});break;case"C":{const e=g();f=g(),u({c1:e,c2:f,to:b=g()});break}case"S":{const e=a?[2*p[0]-a[0],2*p[1]-a[1]]:p;f=g(),u({c1:e,c2:f,to:b=g()});break}case"Q":v=g(),u(o(p,v,b=g()));break;case"T":v=r?[2*p[0]-r[0],2*p[1]-r[1]]:p,u(o(p,v,b=g()));break;case"A":{const e=t.number(),i=t.number(),n=t.number(),s=t.flag(),a=t.flag();b=g(),d(p,e,i,n,s,a,b).forEach(u);break}case"Z":n&&n.segs.length&&(s(p,h)||n.segs.push({to:h}),n.closed=!0),p=h,n=void 0,l=void 0}b&&(p=b),a=f,r=v}}catch{}return i.filter(e=>e.segs.length>0)}const h=e=>{const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)},u=e=>`${h(e[0])} ${h(e[1])}`;function m(e){return e.map(e=>{const t=e.segs.slice(),i=t[t.length-1];return e.closed&&i&&!i.c1&&s(i.to,e.start)&&t.length>1&&t.pop(),[`M${u(e.start)}`,...t.map(e=>e.c1&&e.c2?`C${u(e.c1)} ${u(e.c2)} ${u(e.to)}`:`L${u(e.to)}`),...e.closed?["Z"]:[]].join(" ")}).join(" ")}function g(e,t,i){const n=1-i;return t.c1&&t.c2?[n*n*n*e[0]+3*n*n*i*t.c1[0]+3*n*i*i*t.c2[0]+i*i*i*t.to[0],n*n*n*e[1]+3*n*n*i*t.c1[1]+3*n*i*i*t.c2[1]+i*i*i*t.to[1]]:[e[0]+(t.to[0]-e[0])*i,e[1]+(t.to[1]-e[1])*i]}function f(e,t){const[i,n,s,a]=e,o=r(i,n,t),l=r(n,s,t),c=r(s,a,t),d=r(o,l,t),p=r(l,c,t),h=r(d,p,t);return[[i,o,d,h],[h,p,c,a]]}function v(e,t=12){const i=[e.start];let n=e.start;for(const s of e.segs){if(s.c1)for(let e=1;e<t;e++)i.push(g(n,s,e/t));i.push(s.to),n=s.to}return i.length>1&&s(i[i.length-1],e.start)&&i.pop(),i}const b=(e,t)=>Math.hypot(e[0]-t[0],e[1]-t[1]),y=e=>{const t=Math.round(1e3*e)/1e3;return String(Object.is(t,-0)?0:t)};function x(e){return e.map(e=>{if(!e.length)return"";const t=e=>`${y(e[0])} ${y(e[1])}`,i=e.map(e=>`C${t(e[1])} ${t(e[2])} ${t(e[3])}`).join("");return`M${t(e[0][0])}${i}${(e=>e.length>1&&s(e[0][0],e[e.length-1][3]))(e)?"Z":""}`}).join("")}i.d(t,["Mj",0,e=>p(e).map(e=>{let t=e.start;return e.segs.map(e=>{const i=((e,t)=>t.c1&&t.c2?[e,t.c1,t.c2,t.to]:((e,t)=>[e,r(e,t,1/3),r(e,t,2/3),t])(e,t.to))(t,e);return t=e.to,i})}),"Mo",0,(e,t)=>{const i=1-t;return[i*i*i*e[0][0]+3*i*i*t*e[1][0]+3*i*t*t*e[2][0]+t*t*t*e[3][0],i*i*i*e[0][1]+3*i*i*t*e[1][1]+3*i*t*t*e[2][1]+t*t*t*e[3][1]]},"Wv",0,(e,t,i)=>{const n=i[0]-t[0],s=i[1]-t[1],a=n*n+s*s;if(a<1e-9)return b(e,t);const r=Math.max(0,Math.min(1,((e[0]-t[0])*n+(e[1]-t[1])*s)/a));return b(e,[t[0]+n*r,t[1]+s*r])},"xg",0,b])},8164(e,t,i){i.r(t),i.d(t,{append:()=>_,bounds:()=>L,fmtNum:()=>p,fromEdit:()=>f,insertAt:()=>w,isSmooth:()=>v,moveAnchor:()=>$,nearestOnPath:()=>y,remove:()=>k,reverse:()=>z,segment:()=>g,segmentCount:()=>m,setClosed:()=>q,setHandle:()=>M,setKind:()=>S,smoothAll:()=>A,toEdit:()=>u,toggleSmooth:()=>j,transform:()=>E});var n=i(1771);const s=1e-4,a=(e,t,i=s)=>Math.abs(e[0]-t[0])<i&&Math.abs(e[1]-t[1])<i,r=(e,t,i)=>[e[0]+(t[0]-e[0])*i,e[1]+(t[1]-e[1])*i],o=e=>[e.x,e.y],l=e=>e?[e[0],e[1]]:void 0,c=e=>{const t={x:e.x,y:e.y,in:l(e.in),out:l(e.out)};return e.kind&&(t.kind=e.kind),t},d=e=>({anchors:e.anchors.map(c),closed:e.closed});function p(e){const t=Math.round(100*e)/100;return String(Object.is(t,-0)?0:t)}const h=e=>{const t=Math.max(s,.001*Math.hypot(e[3][0]-e[0][0],e[3][1]-e[0][1]));return a(e[1],r(e[0],e[3],1/3),t)&&a(e[2],r(e[0],e[3],2/3),t)};function u(e){const t=[{x:e.start[0],y:e.start[1]}];let i=e.start;for(const n of e.segs){const e=t[t.length-1],s={x:n.to[0],y:n.to[1]};n.c1&&n.c2&&!h([i,n.c1,n.c2,n.to])&&(a(n.c1,i)||(e.out=[n.c1[0],n.c1[1]]),a(n.c2,n.to)||(s.in=[n.c2[0],n.c2[1]])),t.push(s),i=n.to}const n=e.closed&&e.segs.length>0;if(n&&t.length>1){const e=t.pop();t[0].in=e.in}return{anchors:t,closed:n&&t.length>1}}function m(e){const t=e.anchors.length;return t<2?0:e.closed?t:t-1}function g(e,t){const i=e.anchors[t],n=e.anchors[(t+1)%e.anchors.length];return[o(i),i.out??o(i),n.in??o(n),o(n)]}function f(e){const t=e.anchors[0],i=Array.from({length:m(e)},(t,i)=>{const n=g(e,i);return((e,t)=>!e.anchors[t].out&&!e.anchors[(t+1)%e.anchors.length].in)(e,i)?{to:n[3]}:{c1:n[1],c2:n[2],to:n[3]}});return{start:t?o(t):[0,0],segs:i,closed:e.closed&&e.anchors.length>1}}function v(e){if(!e.in||!e.out)return!1;const t=e.in[0]-e.x,i=e.in[1]-e.y,n=e.out[0]-e.x,a=e.out[1]-e.y,r=Math.hypot(t,i),o=Math.hypot(n,a);return!(r<s||o<s)&&-(t*n+i*a)/(r*o)>.9995}const b=(e,t)=>{const i=1-t,n=i*i*i,s=3*i*i*t,a=3*i*t*t,r=t*t*t;return[n*e[0][0]+s*e[1][0]+a*e[2][0]+r*e[3][0],n*e[0][1]+s*e[1][1]+a*e[2][1]+r*e[3][1]]};function y(e,t,i=[1,1]){const n=m(e);if(!n)return;const s=e=>Math.hypot((e[0]-t[0])*i[0],(e[1]-t[1])*i[1]);let a;for(let t=0;t<n;t++){const i=g(e,t),n=32;let r=0,o=1/0;for(let e=0;e<=n;e++){const t=s(b(i,e/n));t<o&&(o=t,r=e/n)}let l=1/n;for(let e=0;e<12;e++){l/=2;for(const e of[r-l,r+l]){if(e<0||e>1)continue;const t=s(b(i,e));t<o&&(o=t,r=e)}}(!a||o<a.dist)&&(a={seg:t,t:r,point:b(i,r),dist:o})}return a}const x=e=>e.anchors.length<100;function w(e,t,i){const s=d(e),l=s.anchors.length;if(t<0||t>=m(s)||!x(s))return{path:s,index:-1};const c=s.anchors[t],p=s.anchors[(t+1)%l],h=Math.min(1,Math.max(0,i));if(!c.out&&!p.in){const e=r(o(c),o(p),h);return s.anchors.splice(t+1,0,{x:e[0],y:e[1]}),{path:s,index:t+1}}const[u,f]=(0,n.fs)(g(s,t),h);c.out=a(u[1],u[0])?void 0:u[1],p.in=a(f[2],f[3])?void 0:f[2];const v={x:u[3][0],y:u[3][1],in:a(u[2],u[3])?void 0:u[2],out:a(f[1],f[0])?void 0:f[1]};return s.anchors.splice(t+1,0,v),{path:s,index:t+1}}function _(e,t,i=!1){const n=d(e);if(!x(n))return{path:n,index:-1};const s={x:t[0],y:t[1]};return i?(n.anchors.unshift(s),{path:n,index:0}):(n.anchors.push(s),{path:n,index:n.anchors.length-1})}function k(e,t){const i=d(e);return t<0||t>=i.anchors.length||(i.anchors.splice(t,1),i.anchors.length<2&&(i.closed=!1)),i}function $(e,t,i,n){const s=d(e),a=s.anchors[t];if(!a)return s;const r=i-a.x,o=n-a.y;return a.x=i,a.y=n,a.in&&(a.in=[a.in[0]+r,a.in[1]+o]),a.out&&(a.out=[a.out[0]+r,a.out[1]+o]),s}function M(e,t,i,n,s){const r=d(e),l=r.anchors[t];if(!l)return r;const c=s??(e=>e.kind??(v(e)?"smooth":"corner"))(l),p=a(n,o(l))?void 0:[n[0],n[1]];l[i]=p;const h="in"===i?"out":"in";if("symmetric"===c)l[h]=p?[2*l.x-p[0],2*l.y-p[1]]:void 0;else if("smooth"===c&&p&&l[h]){const e=Math.hypot(l[h][0]-l.x,l[h][1]-l.y),t=Math.hypot(l.x-p[0],l.y-p[1]);l[h]=[l.x+(l.x-p[0])/t*e,l.y+(l.y-p[1])/t*e]}return r}function S(e,t,i){const n=d(e),s=n.anchors[t];return s?(s.kind=i,"corner"!==i&&s.in&&s.out?M(n,t,"in",s.in,i):n):n}function C(e,t,i){const n=t.anchors[i],a=function(e,t){const i=e.anchors.length;if(i<2)return;const n=e.anchors[t],a=t>0?e.anchors[t-1]:e.closed?e.anchors[i-1]:n,r=t<i-1?e.anchors[t+1]:e.closed?e.anchors[0]:n,o=(r.x-a.x)/6,l=(r.y-a.y)/6;return Math.hypot(o,l)<s?void 0:[o,l]}(e,i);a&&(n.in=e.closed||i>0?[n.x-a[0],n.y-a[1]]:void 0,n.out=e.closed||i<e.anchors.length-1?[n.x+a[0],n.y+a[1]]:void 0)}function A(e){const t=d(e);for(let i=0;i<t.anchors.length;i++)C(e,t,i);return t}function j(e,t){const i=d(e),n=i.anchors[t];return n?(n.in||n.out?(n.in=void 0,n.out=void 0):C(e,i,t),i):i}function z(e){const t=e.anchors.map(e=>{const t={x:e.x,y:e.y,in:l(e.out),out:l(e.in)};return e.kind&&(t.kind=e.kind),t}).reverse();return e.closed&&t.length&&t.unshift(t.pop()),{anchors:t,closed:e.closed}}function q(e,t){const i=d(e);return i.closed=t&&i.anchors.length>1,!i.closed&&i.anchors.length&&(i.anchors[0].in=void 0,i.anchors[i.anchors.length-1].out=void 0),i}function E(e,t){const i=(e,i)=>[t[0]*e+t[2]*i+t[4],t[1]*e+t[3]*i+t[5]],n=e=>e?i(e[0],e[1]):void 0;return{anchors:e.anchors.map(e=>{const[t,s]=i(e.x,e.y),a={x:t,y:s,in:n(e.in),out:n(e.out)};return e.kind&&(a.kind=e.kind),a}),closed:e.closed}}function L(e){const t=[];for(const i of e.anchors)t.push(o(i)),i.in&&t.push(i.in),i.out&&t.push(i.out);if(!t.length)return;const i=t.map(e=>e[0]),n=t.map(e=>e[1]),s=Math.min(...i),a=Math.min(...n);return{x:s,y:a,w:Math.max(...i)-s,h:Math.max(...n)-a}}i.d(t,["MAX_ANCHORS",0,100,"canAdd",0,x,"copyAnchor",0,c,"copyPath",0,d,"serialize",0,e=>e.anchors.length?(0,n.uD)([f(e)]):"","snap",0,(e,t)=>t>0?Math.round(e/t)*t:e,"straightenAll",0,e=>({anchors:e.anchors.map(e=>({x:e.x,y:e.y})),closed:e.closed}),"translate",0,(e,t,i)=>E(e,[1,0,0,1,t,i])])},3910(e,t,i){i.d(t,{I:()=>o,M7:()=>l,dp:()=>c,wn:()=>r});const n=/[\\<>]|\/\/|\/\*|javascript:|vbscript:|data:|expression\s*\(|@import/i,s=e=>32===e||e>=9&&e<=13||160===e||5760===e||e>=8192&&e<=8202||8232===e||8233===e||8239===e||8287===e||12288===e||65279===e,a=e=>e>=65&&e<=90||e>=97&&e<=122;function r(e,t){for(let i=e.indexOf("(");i>=0;i=e.indexOf("(",i+1)){let n=i;for(;n>0&&s(e.charCodeAt(n-1));)n--;let r=n;for(;r>0&&(a(e.charCodeAt(r-1))||45===e.charCodeAt(r-1));)r--;if(r===n||!t.includes(e.slice(r,n).toLowerCase()))return!1}return!0}function o(e,t){return Object.prototype.hasOwnProperty.call(e.kinds,t)?e.kinds[t]:e.fallback}function l(e,t,i){if(void 0!==i.maxValueChars&&t.length>i.maxValueChars)return;const s=t.trim();if(!function(e,t){if(n.test(e))return!0;if(!t.denyExtra.length)return!1;const i=e.toLowerCase();return t.denyExtra.some(e=>i.includes(e))}(s,i)){if("transform"===e)return r(s,i.transformFunctions)?t:void 0;if(r(s.replace(/url\(\s*(['"]?)#[\w.:-]+\1\s*\)/gi,""),i.colourFunctions))return"id"===e?/^[\w.:-]+$/.test(s)?s:void 0:"class"===e?function(e,t){const i=e.split(/\s+/).filter(e=>t.test(e));return i.length?i.join(" "):void 0}(s,/^[\w-]+$/):t}}function c(e){return"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length}const d=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");i.d(t,["X1",0,d,"dc",0,e=>d(e).replace(/"/g,"&quot;")])},1235(e,t,i){i.d(t,{t:()=>s});const n="2026.10.12-beta.11";function s(e,t){if(t?.BUILD===n)return t;console.warn(`Magic Card was updated, reload the page (magic-card.js ${n}, ${e} ${String(t?.BUILD)}).`)}i.d(t,["Q",0,n])},2016(e,t,i){function n(e,t,i=1){const n={maximumFractionDigits:i};"none"===e?.locale?.number_format&&(n.useGrouping=!1);try{return new Intl.NumberFormat(function(e){switch(e?.locale?.number_format){case"comma_decimal":return"en-US";case"decimal_comma":return"de";case"space_comma":return"fr";case"system":return;default:return function(e){return e?.locale?.language||e?.language||void 0}(e)}}(e),n).format(t)}catch{return String(t)}}i.d(t,{ZV:()=>n})},6505(e,t,i){i.d(t,["E",0,e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)}])},5694(e,t,i){i.d(t,{M:()=>r});var n=i(842);const s={attribute:!0,type:String,converter:n.W3,reflect:!1,hasChanged:n.Ec},a=(e=s,t,i)=>{const{kind:n,metadata:a}=i;let r=globalThis.litPropertyMetadata.get(a);if(void 0===r&&globalThis.litPropertyMetadata.set(a,r=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),r.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const s=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,s,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];t.call(this,i),this.requestUpdate(n,s,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function r(e){return(t,i)=>"object"==typeof i?a(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}},4290(e,t,i){i.d(t,{w:()=>s});var n=i(5694);function s(e){return(0,n.M)({...e,state:!0,attribute:!1})}},842(e,t,i){i.d(t,{mN:()=>S,AH:()=>c,W3:()=>k,Ec:()=>$,iz:()=>l});const n=globalThis,s=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a=Symbol(),r=new WeakMap;class o{constructor(e,t,i){if(this._$cssResult$=!0,i!==a)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(s&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}}const l=e=>new o("string"==typeof e?e:e+"",void 0,a),c=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new o(i,e,a)},d=(e,t)=>{if(s)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),s=n.litNonce;void 0!==s&&t.setAttribute("nonce",s),t.textContent=i.cssText,e.appendChild(t)}},p=s?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return l(t)})(e):e,{is:h,defineProperty:u,getOwnPropertyDescriptor:m,getOwnPropertyNames:g,getOwnPropertySymbols:f,getPrototypeOf:v}=Object,b=globalThis,y=b.trustedTypes,x=y?y.emptyScript:"",w=b.reactiveElementPolyfillSupport,_=(e,t)=>e,k={toAttribute(e,t){switch(t){case Boolean:e=e?x:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},$=(e,t)=>!h(e,t),M={attribute:!0,type:String,converter:k,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),b.litPropertyMetadata??=new WeakMap;class S extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=M){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&u(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:s}=m(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const a=n?.call(this);s?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??M}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=v(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...g(e),...f(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(p(e))}else void 0!==e&&t.push(p(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return d(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:k).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:k;this._$Em=n;const a=s.fromAttribute(t,e.type);this[n]=a??this._$Ej?.get(n)??a,this._$Em=null}}requestUpdate(e,t,i,n=!1,s){if(void 0!==e){const a=this.constructor;if(!1===n&&(s=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??$)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:s},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==s||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[_("elementProperties")]=new Map,S[_("finalized")]=new Map,w?.({ReactiveElement:S}),(b.reactiveElementVersions??=[]).push("2.1.2")},7804(e,t,i){i.d(t,{WL:()=>n});class n{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}i.d(t,["OA",0,{ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},"u$",0,e=>(...t)=>({_$litDirective$:e,values:t})])},6752(e,t,i){const n=globalThis,s=e=>e,a=n.trustedTypes,r=a?a.createPolicy("lit-html",{createHTML:e=>e}):void 0,o="$lit$",l=`lit$${Math.random().toFixed(9).slice(2)}$`,c="?"+l,d=`<${c}>`,p=document,h=()=>p.createComment(""),u=e=>null===e||"object"!=typeof e&&"function"!=typeof e,m=Array.isArray,g=e=>m(e)||"function"==typeof e?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,b=/-->/g,y=/>/g,x=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),w=/'/g,_=/"/g,k=/^(?:script|style|textarea|title)$/i,$=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),M=$(1),S=$(2),C=$(3),A=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),z=new WeakMap,q=p.createTreeWalker(p,129);function E(e,t){if(!m(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==r?r.createHTML(t):t}const L=(e,t)=>{const i=e.length-1,n=[];let s,a=2===t?"<svg>":3===t?"<math>":"",r=v;for(let t=0;t<i;t++){const i=e[t];let c,p,h=-1,u=0;for(;u<i.length&&(r.lastIndex=u,p=r.exec(i),null!==p);)u=r.lastIndex,r===v?"!--"===p[1]?r=b:void 0!==p[1]?r=y:void 0!==p[2]?(k.test(p[2])&&(s=RegExp("</"+p[2],"g")),r=x):void 0!==p[3]&&(r=x):r===x?">"===p[0]?(r=s??v,h=-1):void 0===p[1]?h=-2:(h=r.lastIndex-p[2].length,c=p[1],r=void 0===p[3]?x:'"'===p[3]?_:w):r===_||r===w?r=x:r===b||r===y?r=v:(r=x,s=void 0);const m=r===x&&e[t+1].startsWith("/>")?" ":"";a+=r===v?i+d:h>=0?(n.push(c),i.slice(0,h)+o+i.slice(h)+l+m):i+l+(-2===h?t:m)}return[E(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class P{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let s=0,r=0;const d=e.length-1,p=this.parts,[u,m]=L(e,t);if(this.el=P.createElement(u,i),q.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=q.nextNode())&&p.length<d;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(o)){const t=m[r++],i=n.getAttribute(e).split(l),a=/([.?@])?(.*)/.exec(t);p.push({type:1,index:s,name:a[2],strings:i,ctor:"."===a[1]?O:"?"===a[1]?R:"@"===a[1]?N:T}),n.removeAttribute(e)}else e.startsWith(l)&&(p.push({type:6,index:s}),n.removeAttribute(e));if(k.test(n.tagName)){const e=n.textContent.split(l),t=e.length-1;if(t>0){n.textContent=a?a.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],h()),q.nextNode(),p.push({type:2,index:++s});n.append(e[t],h())}}}else if(8===n.nodeType)if(n.data===c)p.push({type:2,index:s});else{let e=-1;for(;-1!==(e=n.data.indexOf(l,e+1));)p.push({type:7,index:s}),e+=l.length-1}s++}}static createElement(e,t){const i=p.createElement("template");return i.innerHTML=e,i}}function H(e,t,i=e,n){if(t===A)return t;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const a=u(t)?void 0:t._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),void 0===a?s=void 0:(s=new a(e),s._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(t=H(e,s._$AS(e,t.values),s,n)),t}class V{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??p).importNode(t,!0);q.currentNode=n;let s=q.nextNode(),a=0,r=0,o=i[0];for(;void 0!==o;){if(a===o.index){let t;2===o.type?t=new D(s,s.nextSibling,this,e):1===o.type?t=new o.ctor(s,o.name,o.strings,this,e):6===o.type&&(t=new F(s,this,e)),this._$AV.push(t),o=i[++r]}a!==o?.index&&(s=q.nextNode(),a++)}return q.currentNode=p,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class D{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=H(this,e,t),u(e)?e===j||null==e||""===e?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==A&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):g(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&u(this._$AH)?this._$AA.nextSibling.data=e:this.T(p.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=P.createElement(E(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new V(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=z.get(e.strings);return void 0===t&&z.set(e.strings,t=new P(e)),t}k(e){m(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const s of e)n===t.length?t.push(i=new D(this.O(h()),this.O(h()),this,this.options)):i=t[n],i._$AI(s),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=s(e).nextSibling;s(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class T{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,s){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(e,t=this,i,n){const s=this.strings;let a=!1;if(void 0===s)e=H(this,e,t,0),a=!u(e)||e!==this._$AH&&e!==A,a&&(this._$AH=e);else{const n=e;let r,o;for(e=s[0],r=0;r<s.length-1;r++)o=H(this,n[i+r],t,r),o===A&&(o=this._$AH[r]),a||=!u(o)||o!==this._$AH[r],o===j?e=j:e!==j&&(e+=(o??"")+s[r+1]),this._$AH[r]=o}a&&!n&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class O extends T{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class R extends T{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class N extends T{constructor(e,t,i,n,s){super(e,t,i,n,s),this.type=5}_$AI(e,t=this){if((e=H(this,e,t,0)??j)===A)return;const i=this._$AH,n=e===j&&i!==j||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==j&&(i===j||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class F{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){H(this,e)}}const B={M:o,P:l,A:c,C:1,L,R:V,D:g,V:H,I:D,H:T,N:R,U:N,B:O,F},I=n.litHtmlPolyfillSupport;I?.(P,D),(n.litHtmlVersions??=[]).push("3.3.3"),i.d(t,["JW",0,S,"XX",0,(e,t,i)=>{const n=i?.renderBefore??t;let s=n._$litPart$;if(void 0===s){const e=i?.renderBefore??null;n._$litPart$=s=new D(t.insertBefore(h(),e),e,void 0,i??{})}return s._$AI(e),s},"c0",0,A,"ej",0,C,"ge",0,B,"qy",0,M,"s6",0,j])},5707(e,t,i){i.d(t,{EM:()=>n.E,MZ:()=>s.M,wk:()=>a.w});var n=i(6505),s=i(5694),a=i(4290)},2618(e,t,i){i.d(t,{WF:()=>r,AH:()=>n.AH,qy:()=>s.qy,s6:()=>s.s6,JW:()=>s.JW,iz:()=>n.iz});var n=i(842),s=i(6752);const a=globalThis;class r extends n.mN{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=(0,s.XX)(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return s.c0}}r._$litElement$=!0,r.finalized=!0,a.litElementHydrateSupport?.({LitElement:r});const o=a.litElementPolyfillSupport;o?.({LitElement:r}),(a.litElementVersions??=[]).push("4.2.2")}};const t={};function i(n){const s=t[n];if(void 0!==s)return s.exports;const a=t[n]={exports:{}};return e[n](a,a.exports,i),a.exports}if(i.m=e,i.d=(e,t)=>{if(Array.isArray(t))for(var n=0;n<t.length;){var s=t[n++],a=t[n++],r=0===a?{enumerable:!0,value:t[n++]}:{enumerable:!0,get:a};i.o(e,s)||Object.defineProperty(e,s,r)}else for(var s in t)i.o(t,s)&&!i.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},i.f={},i.e=e=>{const t=[];return i.f.j(e,t),Promise.all(t)},i.u=e=>"magic-card-"+{249:"i18n-labels",334:"icon-library",342:"i18n-icons",417:"svg-css",494:"preset-catalogue",575:"path-canvas"}[e]+"."+{249:"bd532f02",334:"907cb790",342:"af267976",417:"9487454e",494:"1a9bcedc",575:"1ebc4775"}[e]+".js",i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.r=e=>{Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.p="",(()=>{const e={126:0,885:0},t=t=>{let{__webpack_esm_ids__:n,__webpack_esm_modules__:s,__webpack_esm_runtime__:a}=t;var r,o,l=0;for(r in s)i.o(s,r)&&(i.m[r]=s[r]);for(a&&a(i);l<n.length;l++)o=n[l],i.o(e,o)&&e[o]&&e[o][0](),e[o]=0};i.f.j=(n,s)=>{let a=i.o(e,n)?e[n]:void 0;if(0!==a)if(a)s.push(a[1]);else{let r=import(i.p+i.u(n)).then(t,t=>{throw 0!==e[n]&&(e[n]=void 0),t});r=Promise.race([r,new Promise(t=>a=e[n]=[t])]),s.push(a[1]=r)}}})(),"undefined"!=typeof location){const e=function(e,t){try{const i=new URL(e);return i.protocol===t.protocol&&i.host===t.host?new URL(".",i).href:""}catch{return""}}(import.meta.url,location);e&&(i.p=e)}var n=i(2618),s=i(5707);const a=n.AH`:host{display:contents;font-family:var(--mc-font,inherit)}*,*::before,*::after{box-sizing:border-box}`,r=n.AH`
  ${a}
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
`,o=n.AH`dialog{padding:0;border:0;border-radius:var(--mc-radius-xl,16px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-dialog,0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1));width:min(480px,calc(100vw - 32px));max-height:min(80vh,720px);overflow:hidden}dialog[open]{display:flex}dialog::backdrop{background:var(--mc-scrim,rgba(0,0,0,.38))}dialog.size-s{width:min(420px,calc(100vw - 32px))}dialog.size-m{width:min(480px,calc(100vw - 32px))}dialog.size-l{width:min(640px,calc(100vw - 32px))}dialog.size-xl{width:min(880px,calc(100vw - 32px))}.panel{display:grid;grid-template-rows:auto minmax(0,1fr) auto;width:100%;max-height:inherit}dialog.placed .panel{height:100%}.header{display:flex;align-items:center;gap:8px;padding:12px 12px 12px 20px;border-bottom:1px solid var(--mc-divider,rgba(0,0,0,.12))}.title{flex:1;min-width:0;margin:0;font-size:1rem;font-weight:500}.tool{display:inline-grid;place-items:center;width:32px;height:32px;padding:0;border:0;border-radius:var(--mc-radius,8px);background:transparent;color:var(--mc-text-2,#5f6368);cursor:pointer}.tool:hover{background:var(--mc-surface-2,#f2f3f5);color:var(--mc-text,#212121)}.tool:focus-visible{outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:1px}.tool:disabled{opacity:.45;cursor:not-allowed;background:transparent} .header.movable{padding-inline-start:8px;cursor:grab;touch-action:none;user-select:none}.header.movable:active{cursor:grabbing}.move{cursor:inherit;touch-action:none}.resize{position:absolute;inset-block-end:0;inset-inline-end:0;width:32px;height:32px;z-index:1;cursor:nwse-resize;touch-action:none;border-radius:var(--mc-radius,8px) 0 var(--mc-radius-xl,16px) 0}dialog.rtl .resize{cursor:nesw-resize;border-radius:0 var(--mc-radius,8px) 0 var(--mc-radius-xl,16px)}dialog.rtl .resize svg{transform:scaleX(-1)}.panel.sizable .footer{padding-inline-end:40px}.panel.sizable:not(.has-footer) .body{padding-bottom:36px}.body{min-height:0;padding:16px 20px;overflow:auto;overscroll-behavior:contain}.footer{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--mc-divider,rgba(0,0,0,.12))}.footer[hidden]{display:none} @media (max-width:599px){dialog.sheet{width:100vw;max-width:100vw;margin:auto 0 0;max-height:60vh;border-radius:var(--mc-radius-xl,16px) var(--mc-radius-xl,16px) 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}}@media (pointer:coarse){.tool{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}.panel.sizable .footer{padding-inline-end:52px}}@media (prefers-reduced-motion:reduce){*{transition-duration:0s !important;animation-duration:0s !important}}`,l=n.AH`${a}${o}`,c=n.AH`
  ${a}
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
`,d={select:"M6 3l12 8-5.5 1.3L10 18z",node:"M5 19L19 5M3 17h4v4H3zM17 3h4v4h-4z",pen:"M4 20l1-5L16 4l4 4L9 19zM14 6l4 4",rect:"M4 6h16v12H4z",ellipse:"M4 12a8 6 0 1 0 16 0a8 6 0 1 0-16 0",line:"M5 19L19 5",polygon:"M12 3l2.5 6.5H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z",free:"M3 15c3-8 6 4 9-3s6-3 9 0",knife:"M4 20l6-6M9 11l8-8 4 4-8 8z",hand:"M8 13V6a1.5 1.5 0 0 1 3 0v5m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-3a1.5 1.5 0 0 1 3 0v6c0 4-2 6-5 6s-4-1-6-4l-2-4a1.5 1.5 0 0 1 2.5-1.5L8 14",undo:"M4 9h10a5 5 0 0 1 0 10H8M4 9l4-4M4 9l4 4",redo:"M20 9H10a5 5 0 0 0 0 10h6M20 9l-4-4M20 9l-4 4",eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9.5a2.5 2.5 0 1 0 .01 0z",eyeOff:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM3 3l18 18",lock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",unlock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 7.5-1.5",plus:"M12 5v14M5 12h14",minus:"M5 12h14",fit:"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",grid:"M4 4h16v16H4zM4 12h16M12 4v16",snap:"M6 4v8a6 6 0 0 0 12 0V4h-4v8a2 2 0 0 1-4 0V4z",up:"M12 19V5M6 11l6-6 6 6",down:"M12 5v14M6 13l6 6 6-6",left:"M19 12H5M11 6l-6 6 6 6",right:"M5 12h14M13 6l6 6-6 6",back:"M15 5l-7 7 7 7",close:"M6 6l12 12M18 6L6 18",help:"M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.5",file:"M6 3h8l4 4v14H6zM14 3v4h4",paste:"M9 4h6v3H9zM7 5H5v16h14V5h-2",blank:"M4 4h16v16H4z",iconpick:"M12 3l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.4l6-.9z",library:"M5 4h4v16H5zM11 4h4v16h-4zM17 6l3 .8-3.5 13-3-.8",group:"M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 9h6v6H9z",copy:"M8 8h12v12H8zM4 16V4h12",trash:"M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",rotL:"M5 12a7 7 0 1 0 2-5M5 4v4h4",rotR:"M19 12a7 7 0 1 1-2-5M19 4v4h-4",rot90L:"M19 20v-8a5 5 0 0 0-5-5H5M9 3L5 7l4 4",rot90R:"M5 20v-8a5 5 0 0 1 5-5h9M15 3l4 4-4 4",ungroup:"M4 4h6v6H4zM14 14h6v6h-6zM14 10l6-6M15 4h5v5",maximize:"M5 5h14v14H5z",restore:"M8 8h11v11H8zM5 15V5h10",resizeCorner:"M19 9L9 19M19 14l-5 5",grip:"M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",flipH:"M12 3v18M8 7L3 12l5 5zM16 7l5 5-5 5z",flipV:"M3 12h18M7 8l5-5 5 5zM7 16l5 5 5-5z",link:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",save:"M5 4h12l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6",check:"M5 12.5l4.5 4.5L19 7",alignL:"M4 3v18M8 7h12M8 14h8",alignC:"M12 3v18M5 7h14M8 14h8",alignR:"M20 3v18M4 7h12M12 14h8",alignT:"M3 4h18M7 8v12M14 8v8",alignM:"M3 12h18M7 5v14M14 8v8",alignB:"M3 20h18M7 4v12M14 8v8",distH:"M4 3v18M20 3v18M10 8h4v8h-4z",distV:"M3 4h18M3 20h18M8 10h8v4H8z",toFront:"M12 19V6M6 11l6-6 6 6M5 3h14",toBack:"M12 5v13M6 13l6 6 6-6M5 21h14"},p={arrowLeft:"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",check:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",undo:"M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",redo:"M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z",helpCircle:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",dotsVertical:"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",palette:"M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 10c0-3.9-4.5-7-10-7Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z",add:"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",delete:"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",contentCopy:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",eyeOn:"M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z",alertCircle:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",information:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",dotsHorizontal:"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z",restart:"M12,5V1L7,6L12,11V7A6,6 0 0,1 18,13A6,6 0 0,1 12,19A6,6 0 0,1 6,13H4A8,8 0 0,0 12,21A8,8 0 0,0 20,13A8,8 0 0,0 12,5Z",cursorDefault:"M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z",vectorPolylineEdit:"M2 3V9H4.95L6.95 15H6V21H12V16.41L17.41 11H22V5H16V9.57L10.59 15H9.06L7.06 9H8V3H2M4 5H6V7H4V5M18 7H20V9H18V7M21.15 13C21 13 20.87 13.05 20.76 13.16L19.75 14.18L21.82 16.25L22.84 15.24C23.05 15.03 23.05 14.67 22.84 14.46L21.54 13.16C21.43 13.05 21.29 13 21.15 13M19.15 14.76L13 20.91V23H15.09L21.23 16.84L19.15 14.76M8 17H10V19H8V17Z",pen:"M20.71,7.04C20.37,7.38 20.04,7.71 20.03,8.04C20,8.36 20.34,8.69 20.66,9C21.14,9.5 21.61,9.95 21.59,10.44C21.57,10.93 21.06,11.44 20.55,11.94L16.42,16.08L15,14.66L19.25,10.42L18.29,9.46L16.87,10.87L13.12,7.12L16.96,3.29C17.35,2.9 18,2.9 18.37,3.29L20.71,5.63C21.1,6 21.1,6.65 20.71,7.04M3,17.25L12.56,7.68L16.31,11.43L6.75,21H3V17.25Z",rectangleOutline:"M4,6V19H20V6H4M18,17H6V8H18V17Z",ellipseOutline:"M12,6C16.41,6 20,8.69 20,12C20,15.31 16.41,18 12,18C7.59,18 4,15.31 4,12C4,8.69 7.59,6 12,6M12,4C6.5,4 2,7.58 2,12C2,16.42 6.5,20 12,20C17.5,20 22,16.42 22,12C22,7.58 17.5,4 12,4Z",vectorLine:"M15,3V7.59L7.59,15H3V21H9V16.42L16.42,9H21V3M17,5H19V7H17M5,17H7V19H5",vectorPolygon:"M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17",draw:"M9.75 20.85C11.53 20.15 11.14 18.22 10.24 17C9.35 15.75 8.12 14.89 6.88 14.06C6 13.5 5.19 12.8 4.54 12C4.26 11.67 3.69 11.06 4.27 10.94C4.86 10.82 5.88 11.4 6.4 11.62C7.31 12 8.21 12.44 9.05 12.96L10.06 11.26C8.5 10.23 6.5 9.32 4.64 9.05C3.58 8.89 2.46 9.11 2.1 10.26C1.78 11.25 2.29 12.25 2.87 13.03C4.24 14.86 6.37 15.74 7.96 17.32C8.3 17.65 8.71 18.04 8.91 18.5C9.12 18.94 9.07 18.97 8.6 18.97C7.36 18.97 5.81 18 4.8 17.36L3.79 19.06C5.32 20 7.88 21.47 9.75 20.85M20.84 5.25C21.06 5.03 21.06 4.67 20.84 4.46L19.54 3.16C19.33 2.95 18.97 2.95 18.76 3.16L17.74 4.18L19.82 6.26M11 10.92V13H13.08L19.23 6.85L17.15 4.77L11 10.92Z",contentCut:"M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z",handBackLeftOutline:"M3 16C3 20.42 6.58 24 11 24C14.43 24 17.5 21.91 18.77 18.73L21.33 12.3C21.58 11.66 21.56 10.92 21.18 10.35C20.69 9.61 19.82 9.29 19 9.5L18.22 9.73C17.76 9.85 17.34 10.08 17 10.39V4.5C17 3.12 15.88 2 14.5 2C14.31 2 14.13 2 13.96 2.06C13.75 .89 12.73 0 11.5 0C10.44 0 9.54 .66 9.17 1.59C8.96 1.53 8.73 1.5 8.5 1.5C7.12 1.5 6 2.62 6 4V4.55C5.84 4.5 5.67 4.5 5.5 4.5C4.12 4.5 3 5.62 3 7V16M5 7C5 6.72 5.22 6.5 5.5 6.5S6 6.72 6 7V12H8V4C8 3.72 8.22 3.5 8.5 3.5S9 3.72 9 4V12H11V2.5C11 2.22 11.22 2 11.5 2S12 2.22 12 2.5V12H14V4.5C14 4.22 14.22 4 14.5 4S15 4.22 15 4.5V15H17L18 12.5C18.15 12.05 18.5 11.71 19 11.59L19.5 11.45L16.91 18C15.95 20.41 13.61 22 11 22C7.69 22 5 19.31 5 16V7Z",eyeOffOutline:"M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",lock:"M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",lockOpenVariant:"M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",minus:"M19,13H5V11H19V13Z",fitToScreenOutline:"M17 4H20C21.1 4 22 4.9 22 6V8H20V6H17V4M4 8V6H7V4H4C2.9 4 2 4.9 2 6V8H4M20 16V18H17V20H20C21.1 20 22 19.1 22 18V16H20M7 18H4V16H2V18C2 19.1 2.9 20 4 20H7V18M16 10V14H8V10H16M18 8H6V16H18V8Z",grid:"M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2Z",magnet:"M3,7V13A9,9 0 0,0 12,22A9,9 0 0,0 21,13V7H17V13A5,5 0 0,1 12,18A5,5 0 0,1 7,13V7M17,5H21V2H17M3,5H7V2H3",arrowUp:"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",arrowDown:"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",arrowRight:"M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z",chevronRight:"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",swapVertical:"M9,3L5,7H8V14H10V7H13M16,17V10H14V17H11L15,21L19,17H16Z",fileOutline:"M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z",contentPaste:"M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z",folderOpenOutline:"M6.1,10L4,18V8H21A2,2 0 0,0 19,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H19C19.9,20 20.7,19.4 20.9,18.5L23.2,10H6.1M19,18H6L7.6,12H20.6L19,18Z",shapeOutline:"M11,13.5V21.5H3V13.5H11M9,15.5H5V19.5H9V15.5M12,2L17.5,11H6.5L12,2M12,5.86L10.08,9H13.92L12,5.86M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13M17.5,15A2.5,2.5 0 0,0 15,17.5A2.5,2.5 0 0,0 17.5,20A2.5,2.5 0 0,0 20,17.5A2.5,2.5 0 0,0 17.5,15Z",bookshelf:"M9 3V18H12V3H9M12 5L16 18L19 17L15 4L12 5M5 5V18H8V5H5M3 19V21H21V19H3Z",group:"M1,1V5H2V19H1V23H5V22H19V23H23V19H22V5H23V1H19V2H5V1M5,4H19V5H20V19H19V20H5V19H4V5H5M6,6V14H9V18H18V9H14V6M8,8H12V12H8M14,11H16V16H11V14H14",ungroup:"M2,2H6V3H13V2H17V6H16V9H18V8H22V12H21V18H22V22H18V21H12V22H8V18H9V16H6V17H2V13H3V6H2V2M18,12V11H16V13H17V17H13V16H11V18H12V19H18V18H19V12H18M13,6V5H6V6H5V13H6V14H9V12H8V8H12V9H14V6H13M12,12H11V14H13V13H14V11H12V12Z",rotateLeft:"M13,4.07V1L8.45,5.55L13,10V6.09C15.84,6.57 18,9.03 18,12C18,14.97 15.84,17.43 13,17.91V19.93C16.95,19.44 20,16.08 20,12C20,7.92 16.95,4.56 13,4.07M7.1,18.32C8.26,19.22 9.61,19.76 11,19.93V17.9C10.13,17.75 9.29,17.41 8.54,16.87L7.1,18.32M6.09,13H4.07C4.24,14.39 4.79,15.73 5.69,16.89L7.1,15.47C6.58,14.72 6.23,13.88 6.09,13M7.11,8.53L5.7,7.11C4.8,8.27 4.24,9.61 4.07,11H6.09C6.23,10.13 6.58,9.28 7.11,8.53Z",rotateRight:"M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12C4,16.08 7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12C6,9.03 8.16,6.57 11,6.09V10L15.55,5.55Z",rotateLeftVariant:"M4,2H7A2,2 0 0,1 9,4V20A2,2 0 0,1 7,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M20,15A2,2 0 0,1 22,17V20A2,2 0 0,1 20,22H11V15H20M14,4A8,8 0 0,1 22,12L21.94,13H19.92L20,12A6,6 0 0,0 14,6V9L10,5L14,1V4Z",rotateRightVariant:"M10,4V1L14,5L10,9V6A6,6 0 0,0 4,12L4.08,13H2.06L2,12A8,8 0 0,1 10,4M17,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H17A2,2 0 0,1 15,20V4A2,2 0 0,1 17,2M4,15H13V22H4A2,2 0 0,1 2,20V17A2,2 0 0,1 4,15Z",flipHorizontal:"M15 21H17V19H15M19 9H21V7H19M3 5V19C3 20.1 3.9 21 5 21H9V19H5V5H9V3H5C3.9 3 3 3.9 3 5M19 3V5H21C21 3.9 20.1 3 19 3M11 23H13V1H11M19 17H21V15H19M15 5H17V3H15M19 13H21V11H19M19 21C20.1 21 21 20.1 21 19H19Z",flipVertical:"M3 15V17H5V15M15 19V21H17V19M19 3H5C3.9 3 3 3.9 3 5V9H5V5H19V9H21V5C21 3.9 20.1 3 19 3M21 19H19V21C20.1 21 21 20.1 21 19M1 11V13H23V11M7 19V21H9V19M19 15V17H21V15M11 19V21H13V19M3 19C3 20.1 3.9 21 5 21V19Z",arrangeBringToFront:"M2,2H11V6H9V4H4V9H6V11H2V2M22,13V22H13V18H15V20H20V15H18V13H22M8,8H16V16H8V8Z",arrangeBringForward:"M2,2H16V16H2V2M22,8V22H8V18H10V20H20V10H18V8H22Z",arrangeSendBackward:"M2,2H16V16H2V2M22,8V22H8V18H18V8H22M4,4V14H14V4H4Z",arrangeSendToBack:"M2,2H11V11H2V2M9,4H4V9H9V4M22,13V22H13V13H22M15,20H20V15H15V20M16,8V11H13V8H16M11,16H8V13H11V16Z",dragVertical:"M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z",squareOutline:"M3,3H21V21H3V3M5,5V19H19V5H5Z",selectAll:"M9,9H15V15H9M7,17H17V7H7M15,5H17V3H15M15,21H17V19H15M19,17H21V15H19M19,9H21V7H19M19,21A2,2 0 0,0 21,19H19M19,13H21V11H19M11,21H13V19H11M9,3H7V5H9M3,17H5V15H3M5,21V19H3A2,2 0 0,0 5,21M19,3V5H21A2,2 0 0,0 19,3M13,3H11V5H13M3,9H5V7H3M7,21H9V19H7M3,13H5V11H3M3,5H5V3A2,2 0 0,0 3,5Z"},h=e=>Object.prototype.hasOwnProperty.call(p,e),u=(e,t=20)=>h(e)?n.qy`<svg class="gl" viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${p[e]} fill="currentColor"></path></svg>`:n.qy`<svg class="gl" viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${d[e]} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,m=e=>Object.prototype.hasOwnProperty.call(d,e)||h(e);function g(e,t,i="start"){const n=window.innerWidth||document.documentElement.clientWidth||0,s=window.innerHeight||document.documentElement.clientHeight||0;e.style.maxHeight="";const a=e.offsetWidth,r=e.offsetHeight,o=s-t.bottom-4-8,l=t.top-4-8,c=s>0&&r>o&&l>o,d=c?l:o;s>0&&r>d&&(e.style.maxHeight=`${Math.max(120,d)}px`);const p=Math.min(r,s>0?Math.max(120,d):r),h=c?Math.max(8,t.top-4-p):t.bottom+4;let u="end"===i?t.right-a:t.left;return n>0&&(u=Math.min(u,n-a-8)),u=Math.max(8,u),Object.assign(e.style,{top:`${Math.round(h)}px`,left:`${Math.round(u)}px`,right:"auto",bottom:"auto"}),e.dataset.placement=c?"top":"bottom",c?"top":"bottom"}function f(e,t,i=0){const n=e.getBoundingClientRect(),s=(e,t,n)=>{let s=e+i;return s+t>n-8&&(s=e-i-t),Math.max(8,Math.min(s,n-8-t))},a=[s(t[0],n.width,window.innerWidth),s(t[1],n.height,window.innerHeight)];return Object.assign(e.style,{left:`${a[0]}px`,top:`${a[1]}px`,right:"auto",bottom:"auto"}),a}function v(e){if("undefined"!=typeof HTMLElement&&"function"==typeof HTMLElement.prototype.showPopover)try{e.matches(":popover-open")||e.showPopover()}catch{}}var b=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class y extends n.WF{constructor(){super(...arguments),this.items=[],this.label="",this.align="start",this.touch=!1,this._open=!1,this._sub=-1,this._outside=e=>{const t=e.composedPath();if(!t.includes(this))return this.anchor&&t.includes(this.anchor)?this.close("outside"):void this.close("outside")},this._key=e=>{const t=this.list();if(!t)return;const i=[...t.querySelectorAll("[role^=menuitem]")],n=i.indexOf(e.composedPath()[0]),s=this.entries(),a=i.length,r=e=>i[(e+a)%a]?.focus(),o=e.key;let l=!0;if("ArrowDown"===o)r(n+1);else if("ArrowUp"===o)r(n<0?a-1:n-1);else if("Home"===o)r(0);else if("End"===o)r(a-1);else if("Enter"===o||" "===o)this.pick(n,i[n]);else if("ArrowRight"===o)this._sub<0&&s[n]?.items&&this.openSub(n,i[n]);else if("ArrowLeft"===o||"Escape"===o)if(this._sub>=0){const e=this._sub;this._sub=-1,this.updateComplete.then(()=>this.focusIn(this.list(),e))}else"Escape"===o&&this.close("escape");else if("Tab"===o)l=!1,this.close("tab");else if(1!==o.length||e.ctrlKey||e.metaKey||e.altKey)l=!1;else{const e=s.map((e,t)=>(n+1+t)%a).find(e=>s[e].label.toLowerCase().startsWith(o.toLowerCase()));void 0!==e&&r(e)}l&&(e.preventDefault(),e.stopPropagation())}}get open(){return this._open}show(){this._open=!0,this._sub=-1,document.addEventListener("pointerdown",this._outside,!0),this.updateComplete.then(()=>{this.placeMain(),this.focusIn(this.list(),this.firstFree(this.items))})}close(e="escape"){this._open&&(this._open=!1,this._sub=-1,document.removeEventListener("pointerdown",this._outside,!0),this.dispatchEvent(new CustomEvent("mc-menu-close",{detail:{reason:e},bubbles:!0,composed:!0})),"pick"!==e&&(this.opener??this.anchor)?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0)}updated(e){for(const e of this.renderRoot.querySelectorAll(".menu[popover]"))v(e)}placeMain(){const e=this.renderRoot.querySelector(".menu");e&&(v(e),this.anchor?g(e,this.anchor.getBoundingClientRect(),this.align):f(e,this.at??[0,0],this.touch?8:0))}list(){return this.renderRoot.querySelector(this._sub>=0?".sub":".menu")}firstFree(e){return Math.max(0,e.findIndex(e=>!e.reason))}focusIn(e,t){e?.querySelectorAll("[role^=menuitem]")[t]?.focus({preventScroll:!0})}entries(){return this._sub>=0?this.items[this._sub]?.items??[]:this.items}openSub(e,t){const i=this.items[e];i?.items?.length&&!i.reason&&(this._sub=e,this._subRow=t,this.updateComplete.then(()=>{const e=this.renderRoot.querySelector(".sub");if(e){v(e);const i=t.getBoundingClientRect(),n=e.getBoundingClientRect().width;f(e,[i.right+n+8<=window.innerWidth?i.right:Math.max(8,i.left-n),i.top])}this.focusIn(this.list(),this.firstFree(i.items??[]))}))}pick(e,t){const i=this.entries()[e];if(i&&!i.reason){if(i.items)return this.openSub(e,t);this.dispatchEvent(new CustomEvent("mc-menu-pick",{detail:{id:i.id},bubbles:!0,composed:!0})),this.close("pick")}}mark(e){return e.glyph&&m(e.glyph)?n.qy`<span class="glyph">${u(e.glyph,18)}</span>`:e.icon?n.qy`<span class="glyph"><ha-icon icon=${e.icon}></ha-icon></span>`:n.s6}row(e,t){const i=!!e.items,s=void 0===e.checked?"menuitem":"menuitemcheckbox";return n.qy`${e.separatorBefore?n.qy`<div class="sep" role="separator"></div>`:n.s6}<div class="item ${e.danger?"danger":""}" role=${s} tabindex="-1" aria-checked=${void 0===e.checked?n.s6:String(e.checked)} aria-disabled=${e.reason?"true":n.s6} aria-description=${e.reason??e.sub??n.s6} aria-keyshortcuts=${e.keys??n.s6} aria-haspopup=${i?"menu":n.s6} aria-expanded=${i?String(this._sub===t):n.s6} @click=${e=>this.pick(t,e.currentTarget)} > ${this.mark(e)}<span class="label">${e.label}</span>${e.keys?n.qy`<span class="keys">${e.keys}</span>`:n.s6}${i?"›":n.s6}${e.reason?n.qy`<span class="why">${e.reason}</span>`:n.s6}${e.sub?n.qy`<span class="sub-line">${e.sub}</span>`:n.s6}</div>`}render(){if(!this._open)return n.s6;const e=this.items[this._sub];return n.qy`<div class="menu" role="menu" aria-label=${this.label} popover="manual" style=${`max-height:${window.innerHeight-16}px`} @keydown=${this._key}> ${this.items.map((e,t)=>this.row(e,t))}</div>${e?.items?n.qy`<div class="sub menu" role="menu" aria-label=${e.label} popover="manual" @keydown=${this._key}>${e.items.map((e,t)=>this.row(e,t))}</div>`:n.s6}`}}y.uiKitRevision=5,y.styles=r,b([(0,s.MZ)({attribute:!1})],y.prototype,"items",void 0),b([(0,s.MZ)()],y.prototype,"label",void 0),b([(0,s.MZ)({attribute:!1})],y.prototype,"at",void 0),b([(0,s.MZ)({attribute:!1})],y.prototype,"anchor",void 0),b([(0,s.MZ)()],y.prototype,"align",void 0),b([(0,s.MZ)({type:Boolean})],y.prototype,"touch",void 0),b([(0,s.MZ)({attribute:!1})],y.prototype,"opener",void 0),b([(0,s.wk)()],y.prototype,"_open",void 0),b([(0,s.wk)()],y.prototype,"_sub",void 0);var x=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class w extends n.WF{constructor(){super(...arguments),this.label="",this.align="start",this._open=!1,this._outside=e=>{const t=e.composedPath();t.includes(this)||this.anchor&&t.includes(this.anchor)||this.close("outside")},this._resize=()=>this.close("outside"),this._key=e=>{"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this.close("escape"))},this._focusout=e=>{const t=e.relatedTarget;!t||this.contains(t)||this.renderRoot.contains(t)||t===this.anchor||this.close("tab")}}get open(){return this._open}show(){this._open||(this._open=!0,document.addEventListener("pointerdown",this._outside,!0),window.addEventListener("resize",this._resize),this.updateComplete.then(()=>{const e=this.panel();e&&(v(e),this.anchor&&g(e,this.anchor.getBoundingClientRect(),this.align))}))}close(e="action"){this._open&&(this._open=!1,document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize),this.dispatchEvent(new CustomEvent("mc-popover-close",{detail:{reason:e},bubbles:!0,composed:!0})),"outside"!==e&&"tab"!==e&&this.anchor?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize)}panel(){return this.renderRoot.querySelector(".panel")}render(){return this._open?n.qy`<div class="panel" part="panel" role="group" aria-label=${this.label} popover="manual" @keydown=${this._key} @focusout=${this._focusout}><slot></slot></div>`:n.s6}}w.uiKitRevision=5,w.styles=c,x([(0,s.MZ)({attribute:!1})],w.prototype,"anchor",void 0),x([(0,s.MZ)()],w.prototype,"label",void 0),x([(0,s.MZ)()],w.prototype,"align",void 0),x([(0,s.wk)()],w.prototype,"_open",void 0);const _=[420,480,640,880];function k(e,t,i){const n=Math.min(Math.max(e.w,320),t-32);return{w:n,h:Math.min(Math.max(e.h,240),i-32),x:Math.min(Math.max(e.x,48-n),t-48),y:Math.min(Math.max(e.y,0),i-48)}}const $=(e,t,i)=>({...e,x:(t-e.w)/2,y:(i-e.h)/2});var M=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const S=["centre","end","start"],C='button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';class A extends n.WF{constructor(){super(...arguments),this.heading="",this.closeLabel="",this.variant="dialog",this.dismissible=!0,this.movable=!1,this.resizable=!1,this.maximizable=!1,this.maximized=!1,this.moveLabel="",this.resizeLabel="",this.maximizeLabel="",this.restoreLabel="",this._open=!1,this._hasFooter=!1,this._r=null,this._compact=!1,this._rtl=!1,this._drag=null,this._dock=0,this._downScrim=null,this._id=`mc-ui-win-${Math.random().toString(36).slice(2,8)}`,this._isCompact=()=>"function"==typeof matchMedia&&matchMedia("(max-width: 599px)").matches,this._vw=()=>document.documentElement.clientWidth||window.innerWidth,this._vh=()=>window.innerHeight,this._free=()=>"alert"!==this.variant&&!("sheet"===this.variant&&this._compact),this._viewport=()=>{this._compact=this._isCompact(),this._r&&(this._r=k(this._r,this._vw(),this._vh()))},this._cancel=e=>{e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape")},this._key=e=>{if("Tab"===e.key)return this._tab(e);"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape"))},this._press=e=>{this._downScrim=e.target===e.currentTarget},this._click=e=>{const t=this._downScrim;this._downScrim=null,e.target===e.currentTarget&&!1!==t&&this.dismissible&&"alert"!==this.variant&&this.close("scrim")},this._footer=e=>{this._hasFooter=e.target.assignedNodes().length>0},this._moved=e=>{const t=this._drag;if(!t||e.pointerId!==t.id)return;const i=e.clientX-t.sx,n=e.clientY-t.sy;if(!t.moved&&Math.hypot(i,n)<4)return;t.moved=!0,this._dock=0;const s=t.r0;if("move"===t.mode)return this._set({...s,x:s.x+i,y:s.y+n});const a=this._rtl,r=k({...s,w:s.w+(a?-i:i),h:s.h+n},this._vw(),this._vh());this._set({...r,x:a?s.x+s.w-r.w:s.x})},this._released=e=>{const t=this._drag;t&&e.pointerId===t.id&&(this._drag=null,"pointercancel"===e.type?this._r=t.was:!t.moved&&t.grip&&("move"===t.mode?this._dockNext():this._stepWidth()))}}get open(){return this._open}dlg(){return this.renderRoot.querySelector("dialog")}show(){this._open||(this._open=!0,this._hasFooter=!!this.querySelector(':scope > [slot="footer"]'),this._compact=this._isCompact(),this._rtl="rtl"===getComputedStyle(this).direction,window.addEventListener("resize",this._viewport),(this.movable&&!this.moveLabel||this.resizable&&!this.resizeLabel||this.maximizable&&!this.maximizeLabel)&&console.debug("[magic-card] <mc-ui-window> needs moveLabel, resizeLabel and maximizeLabel"),this.updateComplete.then(()=>{const e=this.dlg();if(e){if("function"==typeof e.showModal)try{e.showModal()}catch{e.setAttribute("open","")}else e.setAttribute("open","");this.focusFirst()}}))}close(e="action"){if(!this._open)return;this._open=!1,this._forget();const t=this.dlg();t?.open&&"function"==typeof t.close?t.close():t?.removeAttribute("open"),this.dispatchEvent(new CustomEvent("mc-window-close",{detail:{reason:e},bubbles:!0,composed:!0}));const i=this.opener;i?.isConnected&&i.focus({preventScroll:!0})}disconnectedCallback(){if(super.disconnectedCallback(),this._open){this._open=!1,this._forget();const e=this.dlg();e?.open&&"function"==typeof e.close&&e.close()}}_forget(){window.removeEventListener("resize",this._viewport),this._r=null,this._drag=null,this._dock=0,this.maximized=!1}focusFirst(){const e=(this.initialFocus?this.querySelector(`#${CSS.escape(this.initialFocus)}`):null)??this.querySelector(C);(e??this.renderRoot.querySelector(".close"))?.focus({preventScroll:!0})}_now(){return this._r??this._measure()}_measure(){const e=this.dlg()?.getBoundingClientRect();return{x:e?.left??0,y:e?.top??0,w:e?.width??0,h:e?.height??0}}_set(e){this._r=k(e,this._vw(),this._vh())}_abort(){const e=this._drag;return!!e&&(this._drag=null,this._r=e.was,!0)}_tab(e){if(e.defaultPrevented)return;const t=[],i=e=>{if(e instanceof HTMLElement&&!e.hasAttribute("hidden")){if(e instanceof HTMLSlotElement)return e.assignedNodes({flatten:!0}).forEach(i);e.matches(C)&&t.push(e),(e.shadowRoot??e).childNodes.forEach(i)}};this.renderRoot.childNodes.forEach(i);const n=t.indexOf(e.composedPath()[0]),s=e.shiftKey?0===n?t[t.length-1]:void 0:n===t.length-1?t[0]:void 0;s&&(e.preventDefault(),s.focus({preventScroll:!0}))}_begin(e,t,i){if(!(this.maximized||"mouse"===e.pointerType&&0!==e.button)&&(i||!e.composedPath()[0]?.closest?.('button, input, select, textarea, a, [role="button"]'))){this._drag={mode:t,id:e.pointerId,sx:e.clientX,sy:e.clientY,r0:this._now(),was:this._r,grip:i,moved:!1};try{e.target.setPointerCapture?.(e.pointerId)}catch{}}}_dockNext(){this.maximized||(this._dock=(this._dock+1)%S.length,this._set(function(e,t,i,n,s){if("centre"===t)return $(e,n,s);const a="end"===t!==i;return{...e,x:a?n-e.w-16:16}}(this._now(),S[this._dock],this._rtl,this._vw(),this._vh())))}_stepWidth(){this.maximized||this._set(function(e,t){const i=_.find(t=>t>e.w+1)??_[0];return{...e,w:Math.min(i,t-32)}}(this._now(),this._vw()))}_grip(e,t){const i=function(e,t){const i=t?64:16;switch(e){case"ArrowLeft":return[-i,0];case"ArrowRight":return[i,0];case"ArrowUp":return[0,-i];case"ArrowDown":return[0,i];default:return null}}(t.key,t.shiftKey);if(this.maximized||!i&&"Home"!==t.key)return;t.preventDefault(),t.stopPropagation();const n=this._now();if(this._dock=0,!i){if("move"===e)return this._set($(n,this._vw(),this._vh()));const t=this.dlg(),i=t?.getAttribute("style")??null;t?.removeAttribute("style");const s=this._measure();if(null!==i&&t?.setAttribute("style",i),!this._r)return;return this._set({...n,w:s.w,h:s.h})}if("move"===e)return this._set({...n,x:n.x+i[0],y:n.y+i[1]});const s=this._rtl,a=k({...n,w:n.w+(s?-i[0]:i[0]),h:n.h+i[1]},this._vw(),this._vh());this._set({...a,x:s?n.x+n.w-a.w:n.x})}_style(){const e=this.maximized?{x:16,y:16,w:this._vw()-32,h:this._vh()-32}:this._r;return e?`inset:auto;margin:0;max-width:none;max-height:none;left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px`:""}render(){if(!this._open)return n.s6;const e="alert"===this.variant,t=this._free(),i=t&&this.movable,s=t&&this.resizable&&!this.maximized,a=t&&this.maximizable;return n.qy`<dialog class="${this.variant} size-${this.size??(e?"s":"picker"===this.variant?"l":"m")}${this._rtl?" rtl":""}${this.maximized||this._r?" placed":""}" style=${this._style()} role=${e?"alertdialog":"dialog"} aria-labelledby="${this._id}-t" @cancel=${this._cancel} @keydown=${this._key} @pointerdown=${this._press} @click=${this._click} @pointermove=${this._moved} @pointerup=${this._released} @pointercancel=${this._released} > <div class="panel${s?" sizable":""}${this._hasFooter?" has-footer":""}" part="panel"> <div class="header${i?" movable":""}" part="header" @pointerdown=${e=>i&&this._begin(e,"move",!1)}> ${i?n.qy`<button type="button" class="tool move" part="move" aria-label=${this.moveLabel} title=${this.moveLabel} ?disabled=${this.maximized} @pointerdown=${e=>this._begin(e,"move",!0)} @keydown=${e=>this._grip("move",e)} @click=${e=>0===e.detail&&this._dockNext()}>${u("grip",20)}</button>`:n.s6}<h2 class="title" id="${this._id}-t" part="title">${this.heading}</h2><slot name="header-actions"></slot> ${a?n.qy`<button type="button" class="tool maximize" part="maximize" aria-pressed=${this.maximized?"true":"false"} aria-label=${this.maximized?this.restoreLabel:this.maximizeLabel} title=${this.maximized?this.restoreLabel:this.maximizeLabel} @click=${()=>this.maximized=!this.maximized}>${u(this.maximized?"restore":"maximize",20)}</button>`:n.s6} <button type="button" class="tool close" part="close" aria-label=${this.closeLabel} title=${this.closeLabel} @click=${()=>this.close("close-button")}>${u("close",20)}</button></div><div class="body" part="body"><slot></slot></div><div class="footer" part="footer" ?hidden=${!this._hasFooter}><slot name="footer" @slotchange=${this._footer}></slot></div></div>${s?n.qy`<button type="button" class="tool resize" part="resize" aria-label=${this.resizeLabel} title=${this.resizeLabel} @pointerdown=${e=>this._begin(e,"size",!0)} @keydown=${e=>this._grip("size",e)} @click=${e=>0===e.detail&&this._stepWidth()}>${u("resizeCorner",20)}</button>`:n.s6}</dialog>`}}A.uiKitRevision=5,A.styles=l,M([(0,s.MZ)()],A.prototype,"heading",void 0),M([(0,s.MZ)()],A.prototype,"closeLabel",void 0),M([(0,s.MZ)()],A.prototype,"variant",void 0),M([(0,s.MZ)({reflect:!0})],A.prototype,"size",void 0),M([(0,s.MZ)()],A.prototype,"initialFocus",void 0),M([(0,s.MZ)({attribute:!1})],A.prototype,"opener",void 0),M([(0,s.MZ)({type:Boolean})],A.prototype,"dismissible",void 0),M([(0,s.MZ)({type:Boolean})],A.prototype,"movable",void 0),M([(0,s.MZ)({type:Boolean})],A.prototype,"resizable",void 0),M([(0,s.MZ)({type:Boolean})],A.prototype,"maximizable",void 0),M([(0,s.MZ)({type:Boolean,reflect:!0})],A.prototype,"maximized",void 0),M([(0,s.MZ)()],A.prototype,"moveLabel",void 0),M([(0,s.MZ)()],A.prototype,"resizeLabel",void 0),M([(0,s.MZ)()],A.prototype,"maximizeLabel",void 0),M([(0,s.MZ)()],A.prototype,"restoreLabel",void 0),M([(0,s.wk)()],A.prototype,"_open",void 0),M([(0,s.wk)()],A.prototype,"_hasFooter",void 0),M([(0,s.wk)()],A.prototype,"_r",void 0),M([(0,s.wk)()],A.prototype,"_compact",void 0),M([(0,s.wk)()],A.prototype,"_rtl",void 0),function(e){for(const[t,i]of e){const e=customElements.get(t);e?(e.uiKitRevision??0)<5&&console.debug(`[magic-card] ${t} is defined by an older ui-kit (revision ${e.uiKitRevision??0}); keeping it`):customElements.define(t,i)}}([["mc-ui-window",A],["mc-ui-menu",y],["mc-ui-popover",w]]);var j=i(6752),z=i(7804);const{I:q}=j.ge,E=e=>void 0===e.strings,L={},P=(0,z.u$)(class extends z.WL{constructor(e){if(super(e),e.type!==z.OA.PROPERTY&&e.type!==z.OA.ATTRIBUTE&&e.type!==z.OA.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!E(e))throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t===j.c0||t===j.s6)return t;const i=e.element,n=e.name;if(e.type===z.OA.PROPERTY){if(t===i[n])return j.c0}else if(e.type===z.OA.BOOLEAN_ATTRIBUTE){if(!!t===i.hasAttribute(n))return j.c0}else if(e.type===z.OA.ATTRIBUTE&&i.getAttribute(n)===t+"")return j.c0;return((e,t=L)=>{e._$AH=t})(e),t}}),H=Symbol.for(""),V=e=>{if(e?.r===H)return e?._$litStatic$},D=new Map,T=e=>(t,...i)=>{const n=i.length;let s,a;const r=[],o=[];let l,c=0,d=!1;for(;c<n;){for(l=t[c];c<n&&void 0!==(a=i[c],s=V(a));)l+=s+t[++c],d=!0;c!==n&&o.push(a),r.push(l),c++}if(c===n&&r.push(t[n]),d){const e=r.join("$$lit$$");void 0===(t=D.get(e))&&(r.raw=r,D.set(e,t=r)),i=o}return e(t,...i)},O=T(j.qy);T(j.JW),T(j.ej);var R=i(4753),N=i(201);const F=e=>e.channels.includes("glow")||e.channels.includes("fx")||!!e.colour,B=[{id:"linear",label:287,css:"linear"},{id:"ease",label:172,css:"ease"},{id:"ease-in",label:173,css:"ease-in"},{id:"ease-out",label:175,css:"ease-out"},{id:"ease-in-out",label:174,css:"ease-in-out"},{id:"spring",label:450,css:"cubic-bezier(0.34, 1.56, 0.64, 1)"},{id:"smooth",label:434,css:"cubic-bezier(0.45, 0, 0.55, 1)"},{id:"snap",label:435,css:"cubic-bezier(0.7, 0, 0.3, 1)"}],I=(e,t=1080)=>({label:e,unit:"deg",min:0,max:t}),Z=(e,t=100)=>({label:e,unit:"%",min:0,max:t}),K=(e,t=60)=>({label:e,unit:"px",min:0,max:t}),W=(e=350,t=12)=>({label:e,unit:"",min:1,max:t}),U=W();function G(e,t,i){const{direction:n="normal",iterations:s="infinite",...a}=i.extra||{};return{id:e,name:t,group:i.group,channels:i.channels,defaults:{duration:`${i.duration}s`,delay:"0s",easing:i.easing??"ease-in-out",iterations:s,direction:n,intensity:i.intensity[1]},intensity:i.intensity[0],...a}}const Y={iconKeyframes:!0},J=[G("breathe",94,{group:"Glow & pulse",channels:["scale","opacity"],duration:3.2,intensity:[Z(408,50),4]}),G("glow-pulse",222,{group:"Glow & pulse",channels:["glow"],duration:2,intensity:[K(223),16],extra:Y}),G("halo-ripple",233,{group:"Glow & pulse",channels:["glow"],duration:1.8,easing:"ease-out",intensity:[K(391),14],extra:Y}),G("aura",34,{group:"Glow & pulse",channels:["glow"],duration:4,intensity:[K(223),24],extra:Y}),G("heartbeat",235,{group:"Glow & pulse",channels:["scale"],duration:1.4,intensity:[Z(408,50),12]}),G("spin",446,{group:"Motion",channels:["rotate"],duration:2,easing:"linear",intensity:[I(398),360]}),G("fast-spin",187,{group:"Motion",channels:["rotate"],duration:.6,easing:"linear",intensity:[I(398),360]}),G("sway",472,{group:"Motion",channels:["rotate"],duration:2.4,intensity:[I(21,90),6]}),G("wobble",557,{group:"Motion",channels:["translate","rotate"],duration:1.2,intensity:[K(154),6]}),G("shake-alert",418,{group:"Motion",channels:["translate"],duration:2,intensity:[K(154),4]}),G("rumble",406,{group:"Motion",channels:["translate"],duration:.3,easing:"linear",intensity:[K(154,10),1]}),G("float",206,{group:"Motion",channels:["translate"],duration:3,intensity:[K(154),6]}),G("flame-flicker",194,{group:"Weather & device",channels:["scale","rotate","filter"],duration:1.2,intensity:[Z(203,30),5],extra:{origin:"50% 100%",colour:!0}}),G("steam-rise",461,{group:"Weather & device",channels:["fx"],duration:3,easing:"ease-out",intensity:[U,4],extra:{particles:"count"}}),G("bubbles",97,{group:"Weather & device",channels:["fx"],duration:3.5,easing:"ease-in",intensity:[U,6],extra:{particles:"count"}}),G("snow-fall",437,{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[U,6],extra:{particles:"count"}}),G("rain-fall",375,{group:"Weather & device",channels:["fx"],duration:.9,easing:"linear",intensity:[U,6],extra:{particles:"count"}}),G("liquid-wave",288,{group:"Weather & device",channels:["fx"],duration:6,easing:"linear",intensity:[Z(188),40],extra:{particles:2}}),G("storm-flash",463,{group:"Weather & device",channels:["fx"],duration:5,easing:"linear",intensity:[Z(96),75],extra:{particles:1,front:!0}}),G("shine-sweep",423,{group:"Light & colour",channels:["fx"],duration:3,intensity:[Z(422),45],extra:{particles:1,front:!0}}),G("bounce",88,{group:"Playful",channels:["translate","scale"],duration:1.6,easing:"ease",intensity:[K(237),10],extra:{origin:"50% 100%"}}),G("jello",264,{group:"Playful",channels:["scale"],duration:1.8,easing:"ease",intensity:[Z(452,50),12]}),G("rubber-band",405,{group:"Playful",channels:["scale"],duration:1.6,easing:"ease",intensity:[Z(466,50),25]}),G("tada",502,{group:"Playful",channels:["scale","rotate"],duration:2,easing:"ease",intensity:[I(21,45),3]}),G("swing",473,{group:"Playful",channels:["rotate"],duration:2,easing:"ease-in-out",intensity:[I(21,90),15],extra:{origin:"50% 0"}}),G("flip",205,{group:"Playful",channels:["rotate"],duration:2.4,easing:"smooth",intensity:[I(398),360]}),G("pop",360,{group:"Playful",channels:["scale"],duration:1.8,easing:"ease-out",intensity:[Z(408,50),18]}),G("head-shake",234,{group:"Playful",channels:["translate","rotate"],duration:1.6,easing:"ease-in-out",intensity:[K(154,30),6]}),G("blink",65,{group:"Light & colour",channels:["opacity"],duration:1,easing:"linear",intensity:[Z(139),85]}),G("neon-flicker",315,{group:"Light & colour",channels:["opacity","filter"],duration:3,easing:"linear",intensity:[K(223,30),8],extra:{colour:!0}}),G("rainbow-hue",376,{group:"Light & colour",channels:["filter"],duration:6,easing:"linear",intensity:[I(241,720),360]}),G("glitch",219,{group:"Light & colour",channels:["translate","filter"],duration:2.5,easing:"linear",intensity:[K(327,20),3],extra:{colour:!0}}),G("fade-pulse",184,{group:"Light & colour",channels:["opacity"],duration:2.4,intensity:[Z(183),60]}),G("ping",353,{group:"Rings & sweeps",channels:["fx"],duration:2,easing:"ease-out",intensity:[Z(391,200),90],extra:{particles:1}}),G("ripple-rings",395,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"ease-out",intensity:[W(392,6),3],extra:{particles:"count"}}),G("radar-sweep",372,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[I(62,180),70],extra:{particles:1}}),G("conic-border-spin",122,{group:"Rings & sweeps",channels:["fx"],duration:3,easing:"linear",intensity:[K(82,12),2],extra:{particles:1}}),G("breathing-border",95,{group:"Rings & sweeps",channels:["glow"],duration:3,intensity:[K(82,12),2],extra:Y}),G("fireflies",191,{group:"Scenes",channels:["fx"],duration:6,intensity:[U,8],extra:{particles:"count"}}),G("confetti",121,{group:"Scenes",channels:["fx"],duration:3.5,easing:"linear",intensity:[U,10],extra:{particles:"count"}}),G("falling-leaves",186,{group:"Scenes",channels:["fx"],duration:7,easing:"linear",intensity:[U,5],extra:{particles:"count"}}),G("lightning",283,{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[Z(96),90],extra:{particles:1,front:!0}}),G("ocean-waves",326,{group:"Scenes",channels:["fx"],duration:4,easing:"linear",intensity:[Z(548),35],extra:{particles:3}}),G("sun-rays",470,{group:"Scenes",channels:["fx"],duration:24,easing:"linear",intensity:[I(379,30),6],extra:{particles:1}}),G("heat-shimmer",236,{group:"Scenes",channels:["translate","filter"],duration:1.2,easing:"ease-in-out",intensity:[K(465,10),2]}),G("wind-lines",554,{group:"Scenes",channels:["fx"],duration:2.2,intensity:[U,5],extra:{particles:"count"}}),G("drip",164,{group:"Scenes",channels:["fx"],duration:2.4,easing:"ease-in",intensity:[U,3],extra:{particles:"count"}}),G("equalizer-bars",181,{group:"Scenes",channels:["fx"],duration:.9,intensity:[W(60),5],extra:{particles:"count",direction:"alternate"}}),G("charging-stripes",104,{group:"Scenes",channels:["fx"],duration:1,easing:"linear",intensity:[Z(467),100],extra:{particles:1}}),G("orbit-dots",332,{group:"Scenes",channels:["fx"],duration:2.4,easing:"linear",intensity:[W(156,8),3],extra:{particles:"count"}}),G("typing-dots",530,{group:"Scenes",channels:["fx"],duration:1.2,intensity:[K(88,20),4],extra:{particles:3}}),G("pendulum",352,{group:"Motion",channels:["rotate"],duration:2.4,intensity:[I(21,90),20],extra:{origin:"50% 0",direction:"alternate"}}),G("orbit",331,{group:"Motion",channels:["translate"],duration:4,easing:"linear",intensity:[K(373,40),6]}),G("coin-spin",113,{group:"Motion",channels:["rotate"],duration:3,easing:"linear",intensity:[I(398),360]}),G("rotate-3d",3,{group:"Motion",channels:["rotate"],duration:3,intensity:[I(516,180),25],extra:{direction:"alternate"}}),G("squash-stretch",453,{group:"Motion",channels:["scale","translate"],duration:1.4,intensity:[Z(452,50),14],extra:{origin:"50% 100%"}}),G("wiggle",553,{group:"Motion",channels:["rotate"],duration:2.5,intensity:[I(21,45),8]}),G("shadow-lift",416,{group:"Motion",channels:["translate","glow"],duration:3,intensity:[K(279,20),4],extra:Y}),G("holographic-shimmer",239,{group:"Light & colour",channels:["fx"],duration:5,easing:"linear",intensity:[Z(465),35],extra:{particles:1,front:!0}}),G("scanline",409,{group:"Light & colour",channels:["fx"],duration:3,easing:"linear",intensity:[Z(96),50],extra:{particles:1,front:!0}}),G("twinkle",529,{group:"Light & colour",channels:["fx"],duration:2.4,intensity:[U,6],extra:{particles:"count",front:!0}}),G("spotlight",449,{group:"Light & colour",channels:["fx"],duration:7,intensity:[Z(96),45],extra:{particles:1}}),G("border-snake",78,{group:"Borders",channels:["fx"],duration:3,easing:"linear",intensity:[K(552,12),3],extra:{ring:"snake"}}),G("neon-border",314,{group:"Borders",channels:["glow"],duration:2.4,intensity:[K(223,30),10],extra:Y}),G("power-flow",364,{group:"Borders",channels:["fx"],duration:4,easing:"linear",intensity:[K(155,12),5],extra:{ring:"dots"}}),G("marching-ants",299,{group:"Borders",channels:["fx"],duration:20,easing:"linear",intensity:[K(552,12),2],extra:{ring:"dashes"}}),G("aurora",35,{group:"Backgrounds",channels:["fx"],duration:12,intensity:[Z(220),55],extra:{particles:3}}),G("lava-lamp",274,{group:"Backgrounds",channels:["fx"],duration:9,intensity:[U,5],extra:{particles:"count",direction:"alternate"}}),G("plasma-gradient",354,{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[Z(465),70],extra:{particles:1}}),G("gradient-flow",226,{group:"Backgrounds",channels:["fx"],duration:8,easing:"linear",intensity:[Z(465),60],extra:{particles:1,direction:"alternate"}}),G("color-cycle-bg",116,{group:"Backgrounds",channels:["fx"],duration:10,easing:"linear",intensity:[Z(465),35],extra:{particles:1}}),G("starfield",455,{group:"Backgrounds",channels:["fx"],duration:3.5,intensity:[U,12],extra:{particles:"count"}}),G("meteor-shower",305,{group:"Backgrounds",channels:["fx"],duration:3,easing:"ease-in",intensity:[U,4],extra:{particles:"count"}}),G("bokeh",68,{group:"Backgrounds",channels:["fx"],duration:8,intensity:[U,7],extra:{particles:"count",direction:"alternate"}}),G("matrix-rain",302,{group:"Backgrounds",channels:["fx"],duration:2.4,easing:"linear",intensity:[W(464),10],extra:{particles:"count"}}),G("smoke",433,{group:"Backgrounds",channels:["fx"],duration:6,easing:"ease-out",intensity:[U,5],extra:{particles:"count"}}),G("clouds-drift",111,{group:"Backgrounds",channels:["fx"],duration:30,easing:"linear",intensity:[W(110,6),3],extra:{particles:"count"}}),G("water-ripple",546,{group:"Backgrounds",channels:["fx"],duration:4,easing:"ease-out",intensity:[W(396,8),3],extra:{particles:"count"}}),G("fireworks",192,{group:"Backgrounds",channels:["fx"],duration:2.2,easing:"ease-out",intensity:[W(445),10],extra:{particles:"count"}}),...[["winter",556,"winter"],["spring",450,"spring"],["summer",469,"summer"],["autumn",40,"autumn"],["christmas",105,"christmas"],["new_year",316,"new_year"],["valentine",536,"valentine"],["easter",176,"easter"],["halloween",232,"halloween"],["weather",294,"weather"],["daynight",132,"daynight"],["snow",438,"snow"],["rain",377,"rain"],["storm",514,"storm"],["sun",471,"sun"],["clouds",112,"clouds"],["fog",208,"fog"],["wind",555,"wind"],["night",318,"night"],["dusk",171,"dusk"]].map(([e,t,i])=>G(e,t,{group:"Seasonal",channels:["fx"],duration:1,easing:"linear",intensity:[Z(137),50],extra:{seasonal:i}})),G("tap-ripple",503,{group:"Interaction",channels:["fx"],duration:.6,easing:"ease-out",intensity:[Z(96),35],extra:{particles:1,front:!0,trigger:"tap",iterations:1}}),G("press",368,{group:"Interaction",channels:["scale"],duration:.3,easing:"ease-out",intensity:[Z(138,30),6],extra:{trigger:"tap",iterations:1}})],X=["Glow & pulse","Motion","Playful","Light & colour","Rings & sweeps","Borders","Weather & device","Scenes","Backgrounds","Seasonal","Interaction"].filter(e=>J.some(t=>t.group===e)),Q={"Glow & pulse":221,Motion:308,Playful:356,"Light & colour":281,"Rings & sweeps":393,Borders:84,"Weather & device":550,Scenes:410,Backgrounds:51,Seasonal:412,Interaction:260},ee=new Map(J.map(e=>[e.id,e])),te=e=>e?ee.get(e):void 0,ie={breathe:"0%,100%{scale:1;opacity:1}50%{scale:calc(1 + $i / 100);opacity:.78}","glow-pulse":"0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 calc($i * 1px) calc($i * .19px) $c}","glow-pulse-icon":"0%,100%{filter:drop-shadow(0 0 0 transparent)}50%{filter:drop-shadow(0 0 calc($i * .375px) $c)}","halo-ripple":"0%{box-shadow:0 0 0 0 $c}100%{box-shadow:0 0 0 calc($i * 1px) transparent}","halo-ripple-icon":"0%{filter:drop-shadow(0 0 0 $c)}100%{filter:drop-shadow(0 0 calc($i * .7px) transparent)}",aura:"0%,100%{box-shadow:0 0 calc($i * .42px) calc($i * .04px) color-mix(in srgb,$c 60%,transparent),inset 0 0 calc($i * .42px) color-mix(in srgb,$c 24%,transparent)}50%{box-shadow:0 0 calc($i * 1px) calc($i * .25px) $c,inset 0 0 calc($i * .75px) color-mix(in srgb,$c 48%,transparent)}","aura-icon":"0%,100%{filter:drop-shadow(0 0 calc($i * .125px) color-mix(in srgb,$c 50%,transparent))}50%{filter:drop-shadow(0 0 calc($i * .42px) $c)}",heartbeat:"0%,70%,100%{scale:1}14%{scale:calc(1 + $i / 100)}28%{scale:1}42%{scale:calc(1 + $i / 150)}",spin:"from{rotate:0deg}to{rotate:calc($i * 1deg)}","fast-spin":"from{rotate:0deg}to{rotate:calc($i * 1deg)}",sway:"0%,100%{rotate:calc($i * -1deg)}50%{rotate:calc($i * 1deg)}",wobble:"0%,100%{translate:0 0;rotate:0deg}15%{translate:calc($i * -1px) 0;rotate:calc($i * -.66deg)}30%{translate:calc($i * .83px) 0;rotate:calc($i * .5deg)}45%{translate:calc($i * -.66px) 0;rotate:calc($i * -.33deg)}60%{translate:calc($i * .33px) 0;rotate:calc($i * .17deg)}75%{translate:calc($i * -.17px) 0;rotate:calc($i * -.08deg)}","shake-alert":"0%,50%,100%{translate:0 0}5%,15%,25%,35%,45%{translate:calc($i * -1px) 0}10%,20%,30%,40%{translate:calc($i * 1px) 0}",rumble:"0%,100%{translate:0 0}25%{translate:calc($i * 1px) calc($i * -1px)}50%{translate:calc($i * -1px) calc($i * 1px)}75%{translate:calc($i * 1px) calc($i * 1px)}",float:"0%,100%{translate:0 0}50%{translate:0 calc($i * -1px)}","flame-flicker":"0%,100%{scale:1 1;rotate:0deg;filter:drop-shadow(0 0 2px $c) brightness(1)}25%{scale:calc(1 - $i * .004) calc(1 + $i / 100);rotate:calc($i * .3deg);filter:drop-shadow(0 -1px 6px $c) brightness(1.15)}50%{scale:calc(1 + $i * .004) calc(1 - $i * .006);rotate:calc($i * -.2deg);filter:drop-shadow(0 0 3px $c) brightness(.95)}75%{scale:calc(1 - $i * .002) calc(1 + $i * .008);rotate:calc($i * -.4deg);filter:drop-shadow(0 -1px 5px $c) brightness(1.1)}","steam-rise":"0%{translate:0 0;scale:.5;opacity:0}25%{opacity:1}100%{translate:0 -100cqh;scale:1.7;opacity:0}",bubbles:"0%{translate:0 0;opacity:0}10%{opacity:1}50%{translate:4px -55cqh}90%{opacity:.8}100%{translate:-3px calc(-100cqh - 12px);opacity:0}","snow-fall":"0%{translate:0 0;opacity:0}10%{opacity:1}50%{translate:6px 50cqh}100%{translate:-2px calc(100cqh + 12px);opacity:.7}","rain-fall":"0%{translate:0 0;opacity:0}10%{opacity:1}100%{translate:0 calc(100cqh + 24px);opacity:.6}","liquid-wave":"from{rotate:0deg}to{rotate:360deg}","storm-flash":"0%,88%,100%{opacity:0}90%{opacity:calc($i / 100)}91.5%{opacity:.1}93.5%{opacity:calc($i / 125)}96%{opacity:0}","shine-sweep":"0%{translate:-100% 0}60%,100%{translate:100cqw 0}",blink:"0%,45%,100%{opacity:1}50%,95%{opacity:calc(1 - $i / 100)}","neon-flicker":"0%,17%,23%,26%,52%,58%,100%{opacity:1;filter:drop-shadow(0 0 calc($i * 1px) $c) brightness(1.1)}20%,25%,55%{opacity:.45;filter:drop-shadow(0 0 0 transparent) brightness(.8)}24%{opacity:.8;filter:drop-shadow(0 0 calc($i * .4px) $c) brightness(1)}","rainbow-hue":"from{filter:hue-rotate(0deg)}to{filter:hue-rotate(calc($i * 1deg))}",glitch:"0%,86%,100%{translate:0 0;filter:none}88%{translate:calc($i * -1px) 0;filter:drop-shadow(calc($i * .7px) 0 0 $c) drop-shadow(calc($i * -.7px) 0 0 color-mix(in srgb,$c 35%,#00e5ff))}90%{translate:calc($i * 1px) calc($i * .3px);filter:drop-shadow(calc($i * -.7px) 0 0 $c) hue-rotate(40deg)}92%{translate:calc($i * -.5px) 0;filter:drop-shadow(calc($i * .4px) 0 0 color-mix(in srgb,$c 35%,#ff1744))}94%{translate:0 0;filter:none}","fade-pulse":"0%,100%{opacity:1}50%{opacity:calc(1 - $i / 100)}",bounce:"0%,20%,53%,100%{translate:0 0;scale:1 1}40%,43%{translate:0 calc($i * -1px);scale:.96 1.06}70%{translate:0 calc($i * -.5px);scale:.98 1.03}80%{translate:0 0;scale:1.04 .96}90%{translate:0 calc($i * -.12px);scale:1 1}",jello:"0%,10%,60%,100%{scale:1 1}18%{scale:calc(1 + $i / 100) calc(1 - $i / 100)}26%{scale:calc(1 - $i / 100) calc(1 + $i / 100)}34%{scale:calc(1 + $i / 200) calc(1 - $i / 200)}42%{scale:calc(1 - $i / 400) calc(1 + $i / 400)}50%{scale:calc(1 + $i / 800) calc(1 - $i / 800)}","rubber-band":"0%,55%,100%{scale:1 1}15%{scale:calc(1 + $i / 100) calc(1 - $i / 100)}20%{scale:calc(1 - $i / 100) calc(1 + $i / 100)}25%{scale:calc(1 + $i / 160) calc(1 - $i / 160)}33%{scale:calc(1 - $i / 500) calc(1 + $i / 500)}42%{scale:calc(1 + $i / 500) calc(1 - $i / 500)}",tada:"0%,50%,100%{scale:1;rotate:0deg}5%,10%{scale:.9;rotate:calc($i * -1deg)}15%,25%,35%,45%{scale:1.1;rotate:calc($i * 1deg)}20%,30%,40%{scale:1.1;rotate:calc($i * -1deg)}",swing:"0%,60%,100%{rotate:0deg}12%{rotate:calc($i * 1deg)}24%{rotate:calc($i * -.66deg)}36%{rotate:calc($i * .33deg)}48%{rotate:calc($i * -.2deg)}",flip:"0%,10%{rotate:y 0deg}60%,100%{rotate:y calc($i * 1deg)}",pop:"0%,40%,100%{scale:1}10%{scale:calc(1 + $i / 100)}20%{scale:calc(1 - $i / 400)}30%{scale:calc(1 + $i / 600)}","head-shake":"0%,50%,100%{translate:0 0;rotate:0deg}6.5%{translate:calc($i * -1px) 0;rotate:calc($i * -1deg)}18.5%{translate:calc($i * .8px) 0;rotate:calc($i * .8deg)}31.5%{translate:calc($i * -.5px) 0;rotate:calc($i * -.5deg)}43.5%{translate:calc($i * .3px) 0;rotate:calc($i * .3deg)}"},ne="animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",se={ping:"0%{scale:.15;opacity:1}80%,100%{scale:1;opacity:0}","ripple-rings":"0%{scale:.1;opacity:1}100%{scale:1;opacity:0}","radar-sweep":"from{rotate:0deg}to{rotate:360deg}","conic-border-spin":"from{rotate:0deg}to{rotate:360deg}","breathing-border":"0%,100%{box-shadow:inset 0 0 0 calc($i * 1px) color-mix(in srgb,$c 30%,transparent),0 0 0 0 transparent}50%{box-shadow:inset 0 0 0 calc($i * 1px) $c,0 0 calc($i * 4px) color-mix(in srgb,$c 35%,transparent)}","breathing-border-icon":"0%,100%{filter:drop-shadow(0 0 calc($i * .5px) color-mix(in srgb,$c 40%,transparent))}50%{filter:drop-shadow(0 0 calc($i * 1.5px) $c)}",fireflies:"0%{translate:0 0;opacity:0}20%{opacity:1}40%{translate:10px -8px}60%{opacity:.3}75%{translate:-6px -14px;opacity:1}100%{translate:4px -22px;opacity:0}",confetti:"0%{translate:0 0;rotate:0deg;opacity:1}25%{translate:8px 25cqh;rotate:160deg}50%{translate:-6px 50cqh;rotate:300deg}75%{translate:6px 75cqh;rotate:420deg}100%{translate:0 calc(100cqh + 14px);rotate:540deg;opacity:1}","falling-leaves":"0%{translate:0 0;rotate:0deg;opacity:0}10%{opacity:1}30%{translate:14px 30cqh;rotate:60deg}55%{translate:-8px 55cqh;rotate:-20deg}80%{translate:12px 80cqh;rotate:80deg}100%{translate:0 calc(100cqh + 16px);rotate:20deg;opacity:.8}",lightning:"0%,89%,100%{opacity:0}90%{opacity:calc($i / 100)}91.5%{opacity:.15}93%{opacity:calc($i / 100)}96%{opacity:0}","ocean-waves":"from{translate:0 0}to{translate:-40px 0}","sun-rays":"from{rotate:0deg}to{rotate:360deg}","heat-shimmer":"0%,100%{translate:0 0;filter:blur(0)}25%{translate:calc($i * .5px) calc($i * -.5px);filter:blur(calc($i * .3px))}50%{translate:calc($i * -.5px) 0;filter:blur(0)}75%{translate:0 calc($i * .5px);filter:blur(calc($i * .2px))}","wind-lines":"0%{translate:0 0;opacity:0}15%{opacity:1}85%{opacity:.8}100%{translate:calc(100cqw + 100%) 0;opacity:0}",drip:"0%{translate:0 0;scale:.4 .2;opacity:0}15%{scale:1 1;opacity:1}35%{translate:0 2px;scale:.9 1.25}45%{translate:0 4px;scale:1 1}100%{translate:0 calc(100cqh + 12px);scale:.9 1.3;opacity:.7}","equalizer-bars":"0%{scale:1 .15}30%{scale:1 .8}60%{scale:1 .35}100%{scale:1 1}","charging-stripes":"from{translate:0 0}to{translate:28.2843px 0}","orbit-dots":"from{rotate:0deg}to{rotate:360deg}","typing-dots":"0%,60%,100%{translate:0 0;opacity:.35}30%{translate:0 calc($i * -1px);opacity:1}"},ae={ping:"left:50%;top:50%;width:calc($i * 1cqmin);aspect-ratio:1;translate:-50% -50%;border:2px solid $c;border-radius:50%;box-sizing:border-box;","ripple-rings":` left:50%;top:50%;width:110cqmin;aspect-ratio:1;translate:-50% -50%;border:1.5px solid $c;border-radius:50%;box-sizing:border-box;${ne}`,"radar-sweep":"left:50%;top:50%;width:150cqmax;aspect-ratio:1;translate:-50% -50%;border-radius:50%;opacity:1;background:conic-gradient(from 0deg,transparent 0deg calc(360deg - $i * 1deg),$c 360deg);","conic-border-spin":"left:50%;top:50%;width:150cqmax;aspect-ratio:1;translate:-50% -50%;opacity:1;background:conic-gradient(from 0deg,transparent 0% 55%,$c 80%,transparent 100%);",fireflies:"top:calc(12% + var(--mc-anim-phase) * 72%);width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:$c;box-shadow:0 0 6px 2px $c;",confetti:"top:-10px;width:6px;height:10px;border-radius:1px;background:$c;","confetti|:nth-child(3n + 2)":"background:color-mix(in srgb,$c 40%,#ffeb3b);","confetti|:nth-child(3n)":"width:8px;height:6px;background:color-mix(in srgb,$c 40%,#e91e63);","falling-leaves":"top:-14px;width:10px;height:10px;border-radius:0 80% 0 80%;background:$c;","falling-leaves|:nth-child(even)":"background:color-mix(in srgb,$c 75%,#7cb342);",lightning:"left:50%;top:0;width:32cqmin;height:100%;translate:-50% 0;background:color-mix(in srgb,$c 40%,#fff);clip-path:polygon(58% 0,22% 56%,46% 56%,32% 100%,80% 40%,56% 40%,72% 0);","ocean-waves":"left:0;bottom:0;width:calc(100% + 40px);height:calc($i * 1%);opacity:1;background:radial-gradient(22px 12px at 20px 0,transparent 98%,color-mix(in srgb,$c 45%,transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(2)":"height:calc($i * .75%);animation-direction:reverse;animation-duration:calc(var(--mc-fx-dur) * 1.5);background:radial-gradient(22px 10px at 20px 0,transparent 98%,color-mix(in srgb,$c 70%,transparent) 100%) 0 0 / 40px 100% repeat-x;","ocean-waves|:nth-child(3)":"height:calc($i * .5%);animation-duration:calc(var(--mc-fx-dur) * .7);background:radial-gradient(22px 8px at 20px 0,transparent 98%,$c 100%) 0 0 / 40px 100% repeat-x;","sun-rays":"left:50%;top:50%;width:170cqmax;aspect-ratio:1;translate:-50% -50%;opacity:1;background:repeating-conic-gradient(from 0deg,$c 0deg calc($i * 1deg),transparent calc($i * 1deg) calc($i * 3deg));mask:radial-gradient(closest-side,#000 15%,transparent 70%);","wind-lines":"left:-35%;top:calc(10% + var(--mc-anim-phase) * 80%);width:35%;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,$c);",drip:"top:-4px;width:6px;height:9px;margin-left:-3px;transform-origin:50% 0;border-radius:50% 50% 50% 50% / 40% 40% 60% 60%;background:$c;","equalizer-bars":"left:calc(10% + var(--mc-anim-k) * 80%);bottom:0;width:max(3px,5%);height:70%;opacity:1;border-radius:2px 2px 0 0;transform-origin:50% 100%;background:$c;","charging-stripes":"top:0;bottom:0;left:-28.2843px;width:calc(100% + 28.2843px);opacity:1;background:repeating-linear-gradient(-45deg,color-mix(in srgb,$c calc($i * 1%),transparent) 0 10px,transparent 10px 20px);","orbit-dots":` left:50%;top:calc(50% - 38cqmin);width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;opacity:1;background:$c;transform-origin:3px calc(3px + 38cqmin);${ne}`,"typing-dots":"left:calc(50% - 12px + var(--mc-anim-k) * 36px);top:50%;width:6px;height:6px;margin:-3px 0 0 -3px;border-radius:50%;background:$c;animation-delay:calc(var(--mc-fx-delay,0s) - (1 - var(--mc-anim-k)) * var(--mc-fx-dur,1s) * .5);"},re={pendulum:"from{rotate:calc($i * -1deg)}to{rotate:calc($i * 1deg)}",orbit:"0%,100%{translate:calc($i * 1px) 0}12.5%{translate:calc($i * .707px) calc($i * .707px)}25%{translate:0 calc($i * 1px)}37.5%{translate:calc($i * -.707px) calc($i * .707px)}50%{translate:calc($i * -1px) 0}62.5%{translate:calc($i * -.707px) calc($i * -.707px)}75%{translate:0 calc($i * -1px)}87.5%{translate:calc($i * .707px) calc($i * -.707px)}","coin-spin":"from{rotate:y 0deg}to{rotate:y calc($i * 1deg)}","rotate-3d":"from{rotate:1 1 0 calc($i * -1deg)}to{rotate:1 1 0 calc($i * 1deg)}","squash-stretch":"0%,100%{scale:1 1;translate:0 0}15%{scale:calc(1 + $i / 100) calc(1 - $i / 100);translate:0 0}45%{scale:calc(1 - $i / 200) calc(1 + $i / 150);translate:0 calc($i * -.8px)}70%{scale:1 1;translate:0 calc($i * -.4px)}85%{scale:calc(1 + $i / 160) calc(1 - $i / 160);translate:0 0}",wiggle:"0%,40%,100%{rotate:0deg}5%{rotate:calc($i * 1deg)}10%{rotate:calc($i * -1deg)}15%{rotate:calc($i * .8deg)}20%{rotate:calc($i * -.6deg)}25%{rotate:calc($i * .4deg)}30%{rotate:calc($i * -.2deg)}","shadow-lift":"0%,100%{translate:0 0;box-shadow:0 1px 2px color-mix(in srgb,$c 20%,rgba(0,0,0,.2))}50%{translate:0 calc($i * -1px);box-shadow:0 calc($i * 2.5px) calc($i * 4px) color-mix(in srgb,$c 25%,rgba(0,0,0,.3))}","shadow-lift-icon":"0%,100%{translate:0 0;filter:drop-shadow(0 1px 1px color-mix(in srgb,$c 20%,rgba(0,0,0,.2)))}50%{translate:0 calc($i * -1px);filter:drop-shadow(0 calc($i * 1.5px) calc($i * 1px) color-mix(in srgb,$c 25%,rgba(0,0,0,.3)))}","holographic-shimmer":"from{translate:0 0;filter:hue-rotate(0deg)}to{translate:-50% 0;filter:hue-rotate(360deg)}",scanline:"from{translate:0 -100%}to{translate:0 100cqh}",twinkle:"0%,100%{scale:0;rotate:0deg;opacity:0}50%{scale:1;rotate:90deg;opacity:1}",spotlight:"0%,100%{translate:-30cqw -10cqh}33%{translate:25cqw 15cqh}66%{translate:10cqw -20cqh}","neon-border":"0%,100%{box-shadow:0 0 0 1px $c,0 0 calc($i * .6px) color-mix(in srgb,$c 70%,transparent),inset 0 0 calc($i * .5px) color-mix(in srgb,$c 45%,transparent)}50%{box-shadow:0 0 0 1.5px $c,0 0 calc($i * 1.4px) $c,inset 0 0 calc($i * .9px) color-mix(in srgb,$c 60%,transparent)}","neon-border-icon":"0%,100%{filter:drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * .3px) color-mix(in srgb,$c 70%,transparent))}50%{filter:drop-shadow(0 0 1px $c) drop-shadow(0 0 calc($i * .7px) $c)}","color-cycle-bg":"from{filter:hue-rotate(0deg)}to{filter:hue-rotate(360deg)}",aurora:"0%,100%{translate:-12% 0;rotate:-8deg;scale:1 1;opacity:calc($i / 100)}50%{translate:12% 6%;rotate:6deg;scale:1.15 .85;opacity:calc($i / 160)}","lava-lamp":"0%{translate:0 0;scale:1 1;opacity:.9}50%{translate:6px -45cqh;scale:1.25 .85}100%{translate:-4px -85cqh;scale:.85 1.15;opacity:.9}","plasma-gradient":"0%{rotate:0deg;scale:1}50%{rotate:180deg;scale:1.25}100%{rotate:360deg;scale:1}","gradient-flow":"from{translate:0 0}to{translate:-66.667% 0}",starfield:"0%,100%{opacity:.15;scale:.6}50%{opacity:1;scale:1}","meteor-shower":"0%{translate:0 0;opacity:0}6%{opacity:1}40%,100%{translate:-60cqw 60cqh;opacity:0}",bokeh:"0%{translate:0 0;scale:.8;opacity:.15}50%{opacity:.55}100%{translate:10px -16px;scale:1.15;opacity:.25}","matrix-rain":"0%{translate:0 -100%;opacity:0}10%{opacity:1}100%{translate:0 calc(100cqh + 100%);opacity:.6}",smoke:"0%{translate:0 0;scale:.4;opacity:0}20%{opacity:.5}100%{translate:18px -90cqh;scale:2.6;opacity:0}","clouds-drift":"from{translate:0 0;opacity:.9}to{translate:calc(100cqw + 100%) 0;opacity:.9}","water-ripple":"0%{scale:.05;opacity:.9}100%{scale:1;opacity:0}",fireworks:"0%{transform:rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) scale(1);opacity:1}70%{opacity:1}100%{transform:rotate(calc(var(--mc-anim-k) * 360deg)) translateY(-38cqmin) scale(.3);opacity:0}","tap-ripple":"0%{scale:0;opacity:calc($i / 100)}100%{scale:1;opacity:0}",press:"0%,100%{scale:1}40%{scale:calc(1 - $i / 100)}"};function oe(e,t){const i=ie[e]??se[e]??re[e];if(void 0===i)return;const n=te(e.replace(/-icon$/,"")),s=t??n?.defaults.intensity??1;return i.replace(/\$i/g,String(s)).replace(/\$c/g,"var(--mc-anim-c)")}function le(e){const t=[];for(const i of e.matchAll(/([^{}]+)\{([^{}]*)\}/g)){const e=i[1].split(",").map(e=>e.trim().toLowerCase()).map(e=>"from"===e?0:"to"===e?100:parseFloat(e)).filter(e=>Number.isFinite(e)),n=[];for(const e of i[2].split(";")){const t=e.indexOf(":");if(t<0)continue;const i=e.slice(0,t).trim().toLowerCase(),s=e.slice(t+1).trim().replace(/\s+/g," ");i&&s&&n.push([i,s])}e.length&&n.length&&t.push({offsets:e,decls:n})}return t}const ce=e=>"animation-timing-function"===e?"easing":e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase());var de=i(1771);const pe=e=>{if(e&&"object"==typeof e){for(const t of Object.values(e))pe(t);Object.freeze(e)}return e},he=pe(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix"]),ue=pe(["matrix","translate","scale","rotate","skewx","skewy"]),me=pe({maxStyleAttrChars:2e3,maxStyleBlocks:16,maxCssChars:32768,maxRules:512,maxDeclarations:64,maxSelectors:32,maxClassTokens:32,maxBracketDepth:8,maxPaintChars:200,maxValueChars:64,maxDashValues:32,maxColourFunctionDepth:2,maxHrefHops:8,maxStopsPerGradient:256,maxStopClones:1024}),ge=(...e)=>({kind:"keyword",keywords:pe(e)}),fe=pe({fill:{kind:"paint"},stroke:{kind:"paint"},"stop-color":{kind:"stop-paint"},opacity:{kind:"alpha"},"fill-opacity":{kind:"alpha"},"stroke-opacity":{kind:"alpha"},"stop-opacity":{kind:"alpha"},"stroke-width":{kind:"width"},"stroke-miterlimit":{kind:"miterlimit"},"stroke-dashoffset":{kind:"offset"},"stroke-dasharray":{kind:"dasharray"},"stroke-linecap":ge("butt","round","square"),"stroke-linejoin":ge("miter","round","bevel","arcs","miter-clip"),"fill-rule":ge("nonzero","evenodd"),"clip-rule":ge("nonzero","evenodd"),"paint-order":{kind:"paint-order"},"vector-effect":ge("none","non-scaling-stroke")}),ve=32768,be=pe({name:"icon",elements:pe(["svg","g","path","circle","ellipse","rect","line","polyline","polygon","defs","linearGradient","radialGradient","stop","clipPath","mask","title"]),kinds:pe(Object.fromEntries(["d","cx","cy","r","rx","ry","x","y","x1","y1","x2","y2","width","height","points","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","opacity","fill-opacity","stroke-opacity","transform","viewBox","id","class","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","clip-path","mask","fill-rule","clip-rule"].map(e=>{return[e,(t=e,"transform"===t||"gradientTransform"===t?"transform":"id"===t?"id":"class"===t?"class":"value")];var t}))),colourFunctions:he,transformFunctions:ue,paintVar:!1,maxValueChars:ve,denyExtra:pe([]),limits:pe({maxNodes:ve,maxDepth:64}),css:pe({properties:fe,limits:me,maxWrittenBytes:32768})});var ye=i(3910);const xe=e=>String(+e.toFixed(3)),we=e=>{if(null==e||/%/.test(e))return;const t=parseFloat(e);return Number.isFinite(t)?t:void 0},_e=[1,0,0,1,0,0],ke=(e,t)=>[e[0]*t[0]+e[2]*t[1],e[1]*t[0]+e[3]*t[1],e[0]*t[2]+e[2]*t[3],e[1]*t[2]+e[3]*t[3],e[0]*t[4]+e[2]*t[5]+e[4],e[1]*t[4]+e[3]*t[5]+e[5]];function $e(e){let t=_e;if(!e)return t;for(const[,i,n]of e.matchAll(/(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)/g)){const e=n.split(/[\s,]+/).filter(Boolean).map(Number);if(e.some(e=>!Number.isFinite(e)))continue;let s=_e;switch(i){case"matrix":6===e.length&&(s=e);break;case"translate":s=[1,0,0,1,e[0]??0,e[1]??0];break;case"scale":s=[e[0]??1,0,0,e[1]??e[0]??1,0,0];break;case"rotate":{const t=(e[0]??0)*Math.PI/180,[i,n]=[e[1]??0,e[2]??0],a=[Math.cos(t),Math.sin(t),-Math.sin(t),Math.cos(t),0,0];s=ke(ke([1,0,0,1,i,n],a),[1,0,0,1,-i,-n]);break}case"skewX":s=[1,0,Math.tan((e[0]??0)*Math.PI/180),1,0,0];break;case"skewY":s=[1,Math.tan((e[0]??0)*Math.PI/180),0,1,0,0]}t=ke(t,s)}return t}function Me(e,t){const i=t=>we(e.getAttribute(t));switch(t){case"path":{const t=e.getAttribute("d")?.trim();return t||void 0}case"circle":case"ellipse":{const e=i("cx")??0,n=i("cy")??0,s="circle"===t?i("r"):i("rx")??i("ry"),a="circle"===t?s:i("ry")??i("rx");if(!s||!a||s<=0||a<=0)return;const r=`A${xe(s)} ${xe(a)} 0 1 0`;return`M${xe(e-s)} ${xe(n)}${r} ${xe(e+s)} ${xe(n)}${r} ${xe(e-s)} ${xe(n)}Z`}case"rect":{const e=i("x")??0,t=i("y")??0,n=i("width"),s=i("height");if(!n||!s||n<=0||s<=0)return;let a=i("rx")??i("ry")??0,r=i("ry")??i("rx")??0;if(a=Math.min(Math.max(a,0),n/2),r=Math.min(Math.max(r,0),s/2),!a||!r)return`M${xe(e)} ${xe(t)}H${xe(e+n)}V${xe(t+s)}H${xe(e)}Z`;const o=`A${xe(a)} ${xe(r)} 0 0 1`;return`M${xe(e+a)} ${xe(t)}H${xe(e+n-a)}${o} ${xe(e+n)} ${xe(t+r)}V${xe(t+s-r)}${o} ${xe(e+n-a)} ${xe(t+s)}H${xe(e+a)}${o} ${xe(e)} ${xe(t+s-r)}V${xe(t+r)}${o} ${xe(e+a)} ${xe(t)}Z`}case"line":return`M${xe(i("x1")??0)} ${xe(i("y1")??0)}L${xe(i("x2")??0)} ${xe(i("y2")??0)}`;case"polyline":case"polygon":{const i=function(e){const t=(e??"").trim().split(/[\s,]+/).filter(Boolean).map(Number),i=[];for(let e=0;e+1<t.length;e+=2)Number.isFinite(t[e])&&Number.isFinite(t[e+1])&&i.push([t[e],t[e+1]]);return i}(e.getAttribute("points"));if(i.length<2)return;return`M${i.map(([e,t])=>`${xe(e)} ${xe(t)}`).join("L")}${"polygon"===t?"Z":""}`}}}const Se=32768,Ce="0 0 24 24",Ae=e=>new Map(e.map(e=>[e.toLowerCase(),e])),je=Ae(be.elements),ze=Ae(Object.keys(be.kinds)),qe=new Set(["path","circle","ellipse","rect","line","polyline","polygon"]),Ee=new Set(["defs","clipPath","mask","linearGradient","radialGradient"]);function Le(e,t){const i=(0,ye.I)(be,e);return i?(0,ye.M7)(i,t,be):void 0}const Pe=new Set(["own","painted","accented","body","dim","fill","liquid","wave","paint","draw","dev","glow-copy","flame-glow","ring","snow","primary","secondary","duo","duo-body","duo-line","old","morph-in"]),He=e=>"mc-accent"!==e&&(Pe.has(e)||/^(mc-|dev-|xfade-)/.test(e))?`u-${e}`:e,Ve="The SVG is too complex.",De=e=>({markup:"",viewBox:Ce,paths:[],accentPaths:[],strokes:[],error:e}),Te={fill:!0,stroke:!1,width:1},Oe=/^(none|transparent)$/i;function Re(e,t){const i=t=>{const i=e.getAttribute(t);return null===i?void 0:Le(t,i)?.trim()},n=i("fill"),s=i("stroke"),a=we(i("stroke-width")),r=i("stroke-linecap"),o=i("stroke-linejoin"),l=i("fill-rule");return{evenodd:void 0===l?t.evenodd:"evenodd"===l,fill:void 0===n?t.fill:!Oe.test(n),stroke:void 0===s?t.stroke:!Oe.test(s),width:void 0!==a&&a>=0?a:t.width,cap:r&&/^(butt|round|square)$/.test(r)?r:t.cap,join:o&&/^(miter|round|bevel|arcs|miter-clip)$/.test(o)?o:t.join}}function Ne(e,t={}){const i="string"==typeof e?e:"";if((0,ye.dp)(i)>Se)return De("The SVG is larger than 32 KB.");const n=function(e){if("undefined"==typeof DOMParser)return;const t=new DOMParser;try{const i=t.parseFromString(e,"image/svg+xml"),n=i.documentElement;if(n&&"svg"===n.localName&&!i.getElementsByTagName("parsererror").length)return{root:n,via:"xml",doc:i}}catch{}try{const i=t.parseFromString(e,"text/html"),n=i.getElementsByTagName("*");for(let e=0;e<n.length;e++)if("svg"===n[e].localName.toLowerCase())return{root:n[e],via:"html",doc:i}}catch{}}(i)?.root;if(!n)return De("No <svg> element found.");const s=function(e){const t=(e.getAttribute("viewBox")??e.getAttribute("viewbox")??"").trim().split(/[\s,]+/).map(Number);if(4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0)return t.map(xe).join(" ");const i=we(e.getAttribute("width")),n=we(e.getAttribute("height"));return i&&n&&i>0&&n>0?`0 0 ${xe(i)} ${xe(n)}`:Ce}(n);if(t.css)try{if("ok"!==t.css(n,be).status)return De(Ve)}catch{return De(Ve)}const a=[],r=[],o=[],l={},c=(e,t,i=[])=>{let n="",s="";for(const i of[...e.attributes]){const e=ze.get(i.name.toLowerCase());if(!e||i.name.includes(":"))continue;if(t&&("viewBox"===e||"width"===e||"height"===e))continue;const a=Le(e,i.value);void 0!==a&&("class"===e?s=a.split(" ").map(He).join(" "):n+=` ${e}="${(0,ye.dc)(a)}"`)}const a=[s,...i].filter(Boolean).join(" ");return a?` class="${(0,ye.dc)(a)}"${n}`:n};let d=!1;const p=(e,t,i,n,s,h)=>{if(h>64||d)return d=!0,"";const u=je.get(e.localName.toLowerCase());if(!u||"svg"===u)return"";if("title"===u)return`<title>${(0,ye.X1)(e.textContent??"")}</title>`;const m=ke(t,$e(Le("transform",e.getAttribute("transform")??"")??null)),g=n||(e.getAttribute("class")??"").split(/\s+/).includes("mc-accent"),f=i&&!Ee.has(u),v=Re(e,s),b=[];if(f&&qe.has(u)){const t=Me(e,u);if(t){const e=function(e,t){if((e=>e.every((e,t)=>Math.abs(e-_e[t])<1e-9))(t))return e;const i=e=>[t[0]*e[0]+t[2]*e[1]+t[4],t[1]*e[0]+t[3]*e[1]+t[5]];return(0,de.ER)((0,de.Mj)(e).map(e=>e.map(e=>e.map(i))))}(t,m);if(v.fill&&"line"!==u){const t=g?r:a;v.evenodd&&(g?l.accent??=[]:l.paths??=[]).push(t.length),t.push(e),b.push("mc-f")}if(v.stroke&&v.width>0){const t=+(v.width*Math.sqrt(Math.abs(m[0]*m[3]-m[1]*m[2]))).toFixed(3);o.push({d:e,width:t,...v.cap?{cap:v.cap}:{},...v.join?{join:v.join}:{},...g?{accent:!0}:{}}),b.push("mc-s")}}}const y=[...e.children].map(e=>p(e,m,f,g,v,h+1)).join("");return`<${u}${c(e,!1,b)}>${y}</${u}>`},h=$e(Le("transform",n.getAttribute("transform")??"")??null),u=Re(n,Te),m=[...n.children].map(e=>p(e,h,!0,!1,u,1)).join("");return d?De(Ve):a.length||r.length||o.length?{markup:`<svg viewBox="${s}"${c(n,!0)}>${m}</svg>`,viewBox:s,paths:a,accentPaths:r,strokes:o,...l.paths||l.accent?{evenodd:l}:{}}:De("The SVG has no shapes to draw.")}const Fe=["x","y","scale","scale_x","scale_y","rotate","skew","opacity","color","background","shadow","blur","radius","filter","draw","stroke"];function Be(e){const t=e=>Array.isArray(e)&&e.length>0,i=e.rig;return t(e.tracks)||t(e.clips)||t(e.bindings)||!!i&&"object"==typeof i&&(t(i.parts)||t(i.shapes))}const Ie={epoch:0,failedSims:new Set},Ze="custom:",Ke=e=>"string"==typeof e&&e.startsWith(Ze),We=e=>e.slice(7).trim(),Ue=["keyframes","particles","path","sequence"],Ge=["fall","rise","drift","burst","orbit","spiral"],Ye=65536,Je=60,Xe=12,Qe=8192,et=/^[a-z0-9][a-z0-9_-]{0,63}$/,tt={count:12,direction:"fall",speed:1,size:[6,12],colors:[],spin:0,fade:!0,spread:100,gravity:0,layer:"back"},it=["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"],nt={color:new Set(it),background:new Set([...it,"linear-gradient","radial-gradient","conic-gradient","repeating-linear-gradient","repeating-radial-gradient","repeating-conic-gradient"]),shadow:new Set(it),filter:new Set([...it,"blur","brightness","contrast","drop-shadow","grayscale","hue-rotate","invert","opacity","saturate","sepia"])};function st(e,t){if("string"!=typeof e)return;const i=e.trim();if(!i||i.length>600||!/^[#\w\s(),.%+*/-]+$/.test(i)||i.includes("/*")||i.includes("*/"))return;let n=0;for(const e of i)if("("===e)n++;else if(")"===e&&--n<0)return;if(0!==n)return;const s=i.match(/\(/g)?.length??0,a=[...i.matchAll(/([a-z-]+)\s*\(/gi)];return a.length!==s||a.some(e=>!nt[t].has(e[1].toLowerCase()))||[...i.matchAll(/var\(\s*([^,)\s]*)/gi)].some(e=>!/^--[\w-]+$/.test(e[1]))?void 0:i}const at=/^(?:(?:left|right|top|bottom|center|-?\d*\.?\d+(?:px|%|em|rem)?)\s*){1,3}$/,rt=/^[MmLlHhVvCcSsQqTtAaZz0-9eE\s,.+-]+$/,ot=/^[a-z0-9_-]+:[a-z0-9_-]+$/i,lt=["normal","reverse","alternate","alternate-reverse"];function ct(e){if("string"!=typeof e)return!1;const t=e.trim();return B.some(e=>e.id===t)||/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(t)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(t)}const dt=new Set(J.filter(e=>!e.channels.includes("fx")).map(e=>e.id)),pt=new Set(J.filter(e=>e.channels.includes("fx")).map(e=>e.id)),ht=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;class ut{constructor(){this.errors=[]}err(e,t){this.errors.push({path:e,message:t})}num(e,t,i,n,s,a,r=!1){const o=e[t];if(null==o||""===o)return void 0===a?void 0:a;const l="string"==typeof o?Number(o):o;return"number"==typeof l&&Number.isFinite(l)?r&&!Number.isInteger(l)?this.err(i,"Must be a whole number."):l<n||l>s?this.err(i,`Must be between ${n} and ${s}.`):l:this.err(i,"Must be a number.")}bool(e,t,i,n){const s=e[t];return null==s?n:"boolean"!=typeof s?this.err(i,"Must be true or false.")??n:s}oneOf(e,t,i,n,s){const a=e[t];return null==a||""===a?s:n.includes(a)?a:this.err(i,`Must be one of: ${n.join(", ")}.`)}css(e,t,i,n){const s=e[t];if(null!=s&&""!==s)return st(s,n)??this.err(i,"color"===n?"Not a valid colour.":`Not an allowed ${n} value.`)}obj(e,t){return!e||"object"!=typeof e||Array.isArray(e)?this.err(t,"Must be an object."):e}list(e,t,i,n=0){return Array.isArray(e)?e.length<n?this.err(t,1===n?"Needs at least one entry.":`Needs at least ${n} entries.`):e.length>i?this.err(t,`At most ${i} entries.`):e:this.err(t,"Must be a list.")}}function mt(e,t,i,n=!1,s=!1){const a=e.obj(t,i);if(!a)return;const r=e.num(a,"at",`${i}.at`,0,100);void 0===a.at&&e.err(`${i}.at`,"Required.");const o={at:r??0};if(void 0!==a.transform){const t=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s={},a=(t,a,r)=>{const o=e.num(n,t,`${i}.${t}`,a,r);void 0!==o&&(s[t]=o)};if(a("x",-1e4,1e4),a("y",-1e4,1e4),a("scale",0,100),a("scale_x",-100,100),a("scale_y",-100,100),a("rotate",-36e3,36e3),a("skew_x",-89,89),a("skew_y",-89,89),void 0!==n.axis){const t=n.axis;!Array.isArray(t)||3!==t.length||t.some(e=>"number"!=typeof e||!Number.isFinite(e))||t.every(e=>0===e)?e.err(`${i}.axis`,"Must be three numbers [x, y, z], not all 0."):s.axis=[t[0],t[1],t[2]]}return s}(e,a.transform,`${i}.transform`);t&&Object.keys(t).length&&(o.transform=t)}const l=e.num(a,"opacity",`${i}.opacity`,0,1);void 0!==l&&(o.opacity=l);const c=e.css(a,"color",`${i}.color`,"color");c&&(o.color=c);const d=e.css(a,"background",`${i}.background`,"background");d&&(o.background=d);const p=e.css(a,"shadow",`${i}.shadow`,"shadow");p&&(o.shadow=p);const h=e.css(a,"filter",`${i}.filter`,"filter");h&&(o.filter=h);const u=e.num(a,"blur",`${i}.blur`,0,200);void 0!==u&&(o.blur=u);const m=e.num(a,"radius",`${i}.radius`,0,1e3);void 0!==m&&(o.radius=m),void 0!==a.easing&&""!==a.easing&&(ct(a.easing)?o.easing=a.easing.trim():e.err(`${i}.easing`,"Not a valid easing."));const g=s?new ut:e,f=g.css(a,"stroke",`${i}.stroke`,"color");if(f&&(o.stroke=f),void 0!==a.draw&&null!==a.draw&&""!==a.draw)if(n){const e=g.num(a,"draw",`${i}.draw`,0,1);void 0!==e&&(o.draw=e)}else g.err(`${i}.draw`,"Draw-on is only for icon parts and shapes.");if(void 0!==a.easings&&null!==a.easings){const e=g.obj(a.easings,`${i}.easings`),t={};for(const[n,s]of Object.entries(e??{}))Fe.includes(n)?ct(s)?t[n]=s.trim():g.err(`${i}.easings.${n}`,"Not a valid easing."):g.err(`${i}.easings.${n}`,"Not a timeline lane.");Object.keys(t).length&&(o.easings=t)}return o}function gt(e,t,i,n){const s=e.num(t,"count",`${i}.count`,1,Je,n.count,!0)??n.count;let a=[...n.size];if(void 0!==t.size){const n=t.size;"number"==typeof n&&n>0&&n<=200?a=[n,n]:Array.isArray(n)&&2===n.length&&n.every(e=>"number"==typeof e&&e>0&&e<=200)&&n[0]<=n[1]?a=[n[0],n[1]]:e.err(`${i}.size`,"Must be [min, max] px between 1 and 200, min ≤ max.")}const r=[];if(void 0!==t.colors){const n=e.list(t.colors,`${i}.colors`,Xe);n?.forEach((t,n)=>{const s=st(t,"color");s?r.push(s):e.err(`${i}.colors[${n}]`,"Not a valid colour.")})}const o=void 0!==t.shape&&null!==t.shape?function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["icon","emoji","svg"].filter(e=>void 0!==n[e]&&""!==n[e]);if(1!==s.length)return e.err(i,"Set one of icon, emoji or svg.");const a=s[0],r=n[a];if("string"!=typeof r)return e.err(`${i}.${a}`,"Must be text.");if("icon"===a)return ot.test(r.trim())?{icon:r.trim()}:e.err(`${i}.icon`,"Must be an icon id like mdi:star.");if("emoji"===a){const t=r.trim();return t&&[...t].length<=8&&!/[<>&"'\\{};]/.test(t)?{emoji:t}:e.err(`${i}.emoji`,"Must be up to 8 characters (an emoji or a symbol).")}if(ht(r)>Se)return e.err(`${i}.svg`,"The SVG is larger than 32 KB.");if(!/<svg[\s>]/i.test(r))return e.err(`${i}.svg`,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=Ne(r);if(t.error)return e.err(`${i}.svg`,t.error)}return{svg:r}}(e,t.shape,`${i}.shape`):void 0;return{...o?{shape:o}:{},count:s,size:a,colors:r}}const ft=["rig","tracks","clips","bindings"];let vt;function bt(e,t={}){const i=new ut,n=i.obj(e,"");if(!n)return{ok:!1,errors:i.errors};let s;try{s=JSON.stringify(n)}catch{return{ok:!1,errors:[{path:"",message:"Not serialisable."}]}}if(ht(s)>Ye)return{ok:!1,errors:[{path:"",message:"The animation is larger than 64 KB."}]};const a="string"==typeof n.id?n.id.trim():"";et.test(a)||i.err("id","Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).");const r="string"==typeof n.name?n.name.trim():"";r?r.length>80&&i.err("name","At most 80 characters."):i.err("name","Required."),void 0!==n.version&&1!==n.version&&i.err("version","Unsupported version (expected 1).");const o=i.oneOf(n,"kind","kind",Ue);n.kind||i.err("kind","Required.");const l={id:a,name:r,kind:o??"keyframes",duration:i.num(n,"duration","duration",.05,600,1)??1,easing:"ease-in-out",iterations:"infinite",target:i.oneOf(n,"target","target",["element","icon"],"element")??"element",origin:"center",version:1};if(void 0!==n.easing&&""!==n.easing&&(ct(n.easing)?l.easing=n.easing.trim():i.err("easing","Not a valid easing.")),void 0!==n.iterations&&"infinite"!==n.iterations){const e=i.num(n,"iterations","iterations",.01,1e3);void 0!==e&&(l.iterations=e)}const c=i.oneOf(n,"direction","direction",lt);switch(c&&"normal"!==c&&(l.direction=c),void 0!==n.origin&&""!==n.origin&&("string"==typeof n.origin&&at.test(n.origin.trim())?l.origin=n.origin.trim():i.err("origin",'Use keywords, lengths or percentages, e.g. "50% 100%".')),o){case"keyframes":{const e=Array.isArray(n.tracks)&&n.tracks.length>0,s=void 0===n.keyframes?e?[]:i.err("keyframes","Required."):i.list(n.keyframes,"keyframes",40,e?0:1),a="lenient"===t.v2,r=(s??[]).map((e,t)=>mt(i,e,`keyframes[${t}]`,!1,a)).filter(e=>!!e);l.keyframes=r.sort((e,t)=>e.at-t.at);break}case"particles":void 0===n.particles?i.err("particles","Required."):l.particles=function(e,t,i,n){const s=e.obj(t,i);if(!s)return;const a=tt,r={...gt(e,s,i,a),direction:e.oneOf(s,"direction",`${i}.direction`,Ge,a.direction)??a.direction,speed:e.num(s,"speed",`${i}.speed`,.1,10,a.speed)??a.speed,spin:e.num(s,"spin",`${i}.spin`,-3600,3600,a.spin)??a.spin,fade:e.bool(s,"fade",`${i}.fade`,a.fade),spread:e.num(s,"spread",`${i}.spread`,0,100,a.spread)??a.spread,gravity:e.num(s,"gravity",`${i}.gravity`,-1,1,a.gravity)??a.gravity,layer:e.oneOf(s,"layer",`${i}.layer`,["back","front"],a.layer)??a.layer};if(void 0!==s.preset&&""!==s.preset){"string"==typeof s.preset&&pt.has(s.preset)?r.preset=s.preset:e.err(`${i}.preset`,"Must be a particle, ring or scene preset.");const t=e.num(s,"intensity",`${i}.intensity`,-1e5,1e5);void 0!==t&&(r.intensity=t)}if(void 0!==s.sim&&null!==s.sim&&(n?new ut:e).obj(s.sim,`${i}.sim`))if(Ie.simValidator){const t=Ie.simValidator(s.sim,n?"lenient":"strict",{count:r.count,layer:r.layer});n||e.errors.push(...t.errors),!t.sim||!n&&t.errors.length||(r.sim=t.sim)}else r.sim=s.sim;return r}(i,n.particles,"particles","lenient"===t.v2);break;case"path":void 0===n.path?i.err("path","Required."):l.path=function(e,t,i){const n=e.obj(t,i);if(!n)return;let s="";"string"==typeof n.d&&n.d.trim()?n.d.length>Qe?e.err(`${i}.d`,"At most 8192 characters."):rt.test(n.d)&&/^\s*[Mm]/.test(n.d)?(0,de.Mj)(n.d).some(e=>e.length)?s=n.d.trim().replace(/\s+/g," "):e.err(`${i}.d`,"The path draws nothing."):e.err(`${i}.d`,"Not valid path data (it must start with M)."):e.err(`${i}.d`,"Required.");const a={d:s,units:e.oneOf(n,"units",`${i}.units`,["percent","px"],"px")??"px",follow_rotation:e.bool(n,"follow_rotation",`${i}.follow_rotation`,!1),subject:e.oneOf(n,"subject",`${i}.subject`,["element","icon","particles"],"element")??"element"};if(void 0!==n.particles&&null!==n.particles){const t=e.obj(n.particles,`${i}.particles`);t&&(a.particles=gt(e,t,`${i}.particles`,{...tt,count:3}))}return a}(i,n.path,"path");break;case"sequence":{l.steps=void 0===n.steps?(i.err("steps","Required."),[]):function(e,t,i,n){const s=e.list(t,i,20,1);if(!s)return[];const a=[];return s.forEach((t,s)=>{const r=`${i}[${s}]`,o=e.obj(t,r);if(!o)return;const l="string"==typeof o.animation?o.animation.trim():"";l?Ke(l)?We(l)===n?e.err(`${r}.animation`,"A sequence cannot play itself."):et.test(We(l))||e.err(`${r}.animation`,"Not a valid animation id."):dt.has(l)||e.err(`${r}.animation`,"Must be a motion preset or a custom keyframes / path animation."):e.err(`${r}.animation`,"Required.");const c={animation:l,delay:e.num(o,"delay",`${r}.delay`,0,600,0)??0,repeat:e.num(o,"repeat",`${r}.repeat`,1,100,1,!0)??1},d=e.num(o,"duration",`${r}.duration`,.05,600);void 0!==d&&(c.duration=d),a.push(c)}),a}(i,n.steps,"steps",a),l.loop=i.bool(n,"loop","loop",!0);const e=void 0===n.stagger||null===n.stagger?{}:i.obj(n.stagger,"stagger");e&&(l.stagger={children:i.bool(e,"children","stagger.children",!1),delay:i.num(e,"delay","stagger.delay",0,10,.1)??.1});break}}if(o)if(vt)"lenient"===t.v2?Object.assign(l,vt(n,new ut)):Object.assign(l,vt(n,i));else for(const e of ft)void 0===n[e]||null===n[e]||"clips"!==e&&"keyframes"!==o||(l[e]=n[e]);return i.errors.length?{ok:!1,errors:i.errors}:{ok:!0,doc:l,errors:[]}}function yt(e){const t=e.replace(/calc\(/g,"(").replace(/(\d)(px|deg|%)/g,"$1");let i=0;const n=()=>{for(;" "===t[i];)i++;return t[i]},s=()=>{const a=n();if("("===a){i++;const t=r();if(")"!==n())throw new Error(`Expected ) in "${e}"`);return i++,t}if("-"===a||"+"===a){i++;const e=s();return"-"===a?-e:e}const o=/^\d*\.?\d+(?:e[-+]?\d+)?/i.exec(t.slice(i));if(!o)throw new Error(`Not a number in "${e}"`);return i+=o[0].length,Number(o[0])},a=()=>{let e=s();for(let t=n();"*"===t||"/"===t;t=n()){i++;const n=s();e="*"===t?e*n:e/n}return e},r=()=>{let e=a();for(let t=n();"+"===t||"-"===t;t=n()){i++;const n=a();e="+"===t?e+n:e-n}return e},o=r();if(void 0!==n())throw new Error(`Unexpected "${t.slice(i)}" in "${e}"`);return+o.toFixed(4)}function xt(e){const t=[];let i=0,n="";for(const s of e.trim())"("===s&&i++,")"===s&&i--," "===s&&0===i?(n&&t.push(n),n=""):n+=s;return n&&t.push(n),t}const wt={x:[1,0,0],y:[0,1,0]};function _t(e,t,i,n){const s=e.transform??={};switch(t){case"translate":{const[e,t="0"]=xt(i);return s.x=yt(e),void(s.y=yt(t))}case"scale":{const e=xt(i).map(yt);return void(1===e.length?s.scale=e[0]:(s.scale_x=e[0],s.scale_y=e[1]))}case"rotate":{const e=xt(i);return s.rotate=yt(e[e.length-1]),void(2===e.length&&wt[e[0]]?s.axis=wt[e[0]]:4===e.length&&(s.axis=[yt(e[0]),yt(e[1]),yt(e[2])]))}case"opacity":return void(e.opacity=yt(i));case"filter":return void(e.filter=i);case"box-shadow":return void(e.shadow=i)}throw new Error(`Preset ${n}: cannot convert "${t}"`)}function kt(e){const t=oe(e);if(void 0===t)throw new Error(`Preset ${e} has no keyframes`);const i=new Map;for(const n of le(t))for(const t of n.offsets){const s=i.get(t)??{at:t};for(const[t,i]of n.decls)_t(s,t,i,e);i.set(t,s)}return[...i.values()].map(e=>e.transform&&!Object.keys(e.transform).length?(({transform:e,...t})=>t)(e):e).sort((e,t)=>e.at-t.at)}const $t=e=>`${e.toLowerCase().replace(/[^a-z0-9_-]/g,"-")}-custom`.slice(0,64);function Mt(e,t=$t(e),i){const n=te(e);if(!n)return;const s=n.defaults,a={id:t,name:i??(0,N.t)(n.name),kind:"keyframes",duration:parseFloat(s.duration),easing:s.easing,iterations:s.iterations,..."normal"!==s.direction?{direction:s.direction}:{},target:"element",origin:n.origin??"center",version:1};return n.channels.includes("fx")?{...a,kind:"particles",particles:{...tt,size:[...tt.size],colors:[],..."count"===n.particles?{count:Math.max(1,Math.round(s.intensity))}:{},layer:n.front?"front":"back",preset:n.id,intensity:s.intensity}}:{...a,keyframes:kt(n.id)}}var St=i(3682),Ct=Symbol("NOT_RESOLVED");function At(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function jt(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function zt(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var qt=At("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),Et=["","~","null","Null","NULL"],Lt=At("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Et.indexOf(e)?null:Ct,identify:e=>null===e,represent:()=>"null"}),Pt=At("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:Ct,identify:e=>null===e,represent:()=>"null"}),Ht=["","~","null","Null","NULL"],Vt=At("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==Ht.indexOf(e)?null:Ct,identify:e=>null===e,represent:()=>"null"}),Dt=["true","True","TRUE"],Tt=["false","False","FALSE"],Ot=At("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==Dt.indexOf(e)||-1===Tt.indexOf(e)&&Ct,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Rt=["true"],Nt=["false"],Ft=At("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==Rt.indexOf(e)||-1===Nt.indexOf(e)&&Ct,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Bt=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],It=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],Zt=At("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==Bt.indexOf(e)||-1===It.indexOf(e)&&Ct,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),Kt=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Wt=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Ut=At("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!Wt.test(e))return Ct}else if(!Kt.test(e))return Ct;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:Ct},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Gt=new RegExp("^-?(?:0|[1-9][0-9]*)$"),Yt=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),Jt=At("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!Yt.test(e))return Ct}else if(!Gt.test(e))return Ct;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:Ct},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),Xt=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$"),Qt=At("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!Xt.test(e))return Ct;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:Ct},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),ei=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ti=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ii=At("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!ei.test(e))return Ct;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const n=i*parseFloat(t);return Number.isFinite(n)||ti.test(e)?n:Ct},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),ni=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),si=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),ai=At("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!si.test(e))return Ct;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const n=i*parseFloat(t);return Number.isFinite(n)?n:Ct}if(!ni.test(e))return Ct;const i=Number(e);return Number.isFinite(i)?i:Ct},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),ri=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),oi=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),li=At("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!ri.test(e))return Ct;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let n=0;if(t.includes(":")){for(const e of t.split(":"))n=60*n+Number(e);n*=i}else n=i*parseFloat(t);return Number.isFinite(n)||oi.test(e)?n:Ct},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),ci=At("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":Ct,identify:()=>!1}),di=/^[A-Za-z0-9+/]*={0,2}$/,pi=At("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!di.test(t))return Ct;const i=atob(t),n=new Uint8Array(i.length);for(let e=0;e<i.length;e++)n[e]=i.charCodeAt(e);return n},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),hi=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),ui=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function mi(e,t,i,n=0,s=0,a=0,r=0){const o=new Date(Date.UTC(e,t,i,n,s,a,r));return o.setUTCFullYear(e,t,i),o}var gi=At("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=hi.exec(e);if(null===t&&(t=ui.exec(e)),null===t)return Ct;const i=+t[1],n=+t[2]-1,s=+t[3];if(!t[4]){const e=mi(i,n,s);return e.getUTCFullYear()!==i||e.getUTCMonth()!==n||e.getUTCDate()!==s?Ct:e}const a=+t[4],r=+t[5],o=+t[6];let l=0;if(a>23||r>59||o>59)return Ct;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";l=+e}const c=mi(i,n,s,a,r,o,l);if(c.getUTCFullYear()!==i||c.getUTCMonth()!==n||c.getUTCDate()!==s)return Ct;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return Ct;const n=6e4*(60*e+i);c.setTime(c.getTime()-("-"===t[9]?-n:n))}return c},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),fi=jt("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function vi(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}var bi=jt("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!vi(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),yi=jt("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,n=Object.keys(i);return 1!==n.length?"cannot resolve a pairs item":(e.push([n[0],i[n[0]]]),"")},identify:()=>!1}),xi=zt("tag:yaml.org,2002:map",{create:()=>({}),identify:vi,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const n=String(t);return"__proto__"===n?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),wi=zt("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null}),_i=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let n=0;n<t.length;n++){const s=t[n];if(s.nodeKind===i.nodeKind&&s.tagName===i.tagName&&s.matchByTagPrefix===i.matchByTagPrefix){e=n;break}}t[e]=i}return t}(e),i=[],n={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},s={scalar:[],sequence:[],mapping:[]};for(const e of t){if("scalar"===e.nodeKind&&e.implicit){if(e.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(e)}switch(e.nodeKind){case"scalar":e.matchByTagPrefix?s.scalar.push(e):n.scalar[e.tagName]=e;break;case"sequence":e.matchByTagPrefix?s.sequence.push(e):n.sequence[e.tagName]=e;break;case"mapping":e.matchByTagPrefix?s.mapping.push(e):n.mapping[e.tagName]=e}}const a=i.filter(e=>null===e.implicitFirstChars),r=new Set;for(const e of i)if(null!==e.implicitFirstChars)for(const t of e.implicitFirstChars)r.add(t);const o=new Map;for(const e of r)o.set(e,i.filter(t=>null===t.implicitFirstChars||-1!==t.implicitFirstChars.indexOf(e)));const l=n.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=o,this.implicitScalarAnyFirstChar=a,this.defaultScalarTag=l,this.defaultSequenceTag=n.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=n.mapping["tag:yaml.org,2002:map"],this.exact=n,this.prefix=s}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const t of this.prefix.scalar)if(e.startsWith(t.tagName))return t}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const t of this.prefix.sequence)if(e.startsWith(t.tagName))return t}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const t of this.prefix.mapping)if(e.startsWith(t.tagName))return t}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const i of t){const t=i.resolve(e,!1,i.tagName);if(t!==Ct)return{value:t,tag:i}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},ki=new _i([qt,fi,xi]),$i=(new _i([...ki.tags,Pt,Ft,Jt,ai]),new _i([...ki.tags,Lt,Ot,Ut,ii]));new _i([...ki.tags,Vt,Zt,Qt,li,gi,ci,pi,bi,yi,wi]).withTags({...Qt,resolve:(e,t,i)=>{const n=Qt.resolve(e,t,i);return n===Ct?Ut.resolve(e,t,i):n}},{...li,resolve:(e,t,i)=>{const n=li.resolve(e,t,i);return n===Ct?ii.resolve(e,t,i):n}});function Mi(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}zt("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||vi(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const e of Object.keys(i))t.set(e,i[e]);return t}}),zt("tag:yaml.org,2002:map",{create:()=>({}),identify:vi,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const n=Mi(t);return null===n?"nested arrays are not supported inside keys":("__proto__"===n?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,"")},has:(e,t)=>{const i=Mi(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}});Error;function Si(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var Ci=new Array(256),Ai=new Array(256);for(let e=0;e<256;e++)Ci[e]=Si(e)?1:0,Ai[e]=Si(e);Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"});Object.prototype.hasOwnProperty;var ji=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,zi=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`;new RegExp(`^(?:${ji})*$`),new RegExp(`^(?:${zi})+$`),new RegExp(`^(?:!(?:${ji})*|${zi}(?:${ji})*)$`);function qi(e,t){return!!(e&1<<t)}Symbol("INVALID"),Symbol("visit:break"),Symbol("visit:skip");var Ei={applyQuoteFlowKeysOption:function(e){e.presenterOptions.quoteFlowKeys&&e.isKey&&e.flowOnly&&1===e.style&&(e.style=3)},doubleQuoteForInvisibles:function(e){1===e.style&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=3)},doubleQuoteWhitespaceOnly:function(e){1===e.style&&/^\s+$/.test(e.node.value)&&(e.style=3)},applyForceQuotesOption:function(e){e.presenterOptions.forceQuotes&&(e.isKey||1!==e.style||e.node.tag===e.presenterOptions.schema.defaultScalarTag.tagName&&(e.style=e.node.value.includes("\n")?3:Li(e)))},tryLongOrMultilineAsBlock:function(e){if(1!==e.style||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!qi(e.allowedStylesMask,4))return void(i&&(e.style=3));const n=e.presenterOptions.lineWidth;if(-1===n)return void(i&&(e.style=4));const s=Math.max(Math.min(n,40),n-e.shiftOfContent);let a=0,r=!1;for(;a<=t.length;){let e=t.length;const i=t.indexOf("\n",a);-1!==i&&(e=i);const n=t.slice(a,e);if(n.length>s&&" "!==n[0]&&/ [^ \t]/.test(n)&&(r=!0),-1===i)break;a=i+1}r?e.style=5:i&&(e.style=4)},quoteInvalidPlain:function(e){1!==e.style||qi(e.allowedStylesMask,1)||(e.style=Li(e))},fallbackToDoubleQuoted:function(e){qi(e.allowedStylesMask,e.style)||(e.style=3)}};function Li(e){return"single"===e.presenterOptions.quoteStyle&&qi(e.allowedStylesMask,2)?2:3}var Pi="[ \\t]",Hi="(?:(?!(?:[\\n\\r]|\\uFEFF))[\\x09\\x0A\\x0D\\x20-\\x7E\\x85\\xA0-\\uD7FF\\uE000-\\uFFFD\\u{10000}-\\u{10FFFF}])",Vi=`(?:(?!${Pi})${Hi})`,Di="[\\x09\\x20-\\uD7FF\\uE000-\\uFFFF\\u{10000}-\\u{10FFFF}]",Ti="[-?:,\\[\\]{}#&*!|>'\"%@`]",Oi=`(?:(?![,\\[\\]{}])${Vi})`,Ri=`(?:(?:(?![:#])${Vi})|:(?=${Vi}))#*`,Ni=`(?:(?:(?![:#])${Oi})|:(?=${Oi}))#*`,Fi=`(?:${Pi}*${Ri})*`,Bi=`(?:${Pi}*${Ni})*`,Ii=`(?:(?:(?!${Ti})${Vi})|[?:-](?=${Vi}))#*${Fi}`,Zi=`(?:(?:(?!${Ti})${Vi})|[?:-](?=${Oi}))#*${Bi}`,Ki=Ii,Wi=Zi,Ui=`${Zi}(?:\\n+${Ni}${Bi})*`;new RegExp(`^(?:${Ii}(?:\\n+${Ri}${Fi})*)$`,"u"),new RegExp(`^(?:${Ui})$`,"u"),new RegExp(`^(?:${Ki})$`,"u"),new RegExp(`^(?:${Wi})$`,"u"),new RegExp(`^(?:${Di})*$`,"u"),new RegExp(`^(?:${Di}|\\n)*$`,"u"),new RegExp(`^(?:${Hi}|\\n)*$`,"u");Object.keys(Ei).map(e=>Reflect.get(Ei,e));$i.withTags(ci);const Gi=64,Yi=48,Ji=/^[a-z0-9][a-z0-9_-]{0,31}$/,Xi=["element","icon","name","state","background"],Qi=["rotate","x","y","scale","opacity","draw","color_mix","speed","rotate_speed"],en=["cut","crossfade","finish"],tn=/^[a-z0-9_][a-z0-9_.-]{0,63}$/i;function nn(e,t,i,n){return Array.isArray(t)?t.length>n?e.err(`${i}[${n}]`,`At most ${n} entries.`):t:e.err(i,"Must be a list.")}function sn(e,t,i,n){const s="string"==typeof t.id?t.id.trim():"";return Ji.test(s)?n.has(s)?e.err(`${i}.id`,`Duplicate id "${s}".`):(n.add(s),s):e.err(`${i}.id`,"Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).")}function an(e,t,i,n){if(void 0===t.name||null===t.name||""===t.name)return n;if("string"!=typeof t.name||!t.name.trim())return e.err(`${i}.name`,"Must be text.")??n;const s=t.name.trim();return s.length>80?e.err(`${i}.name`,"At most 80 characters.")??n:s}function rn(e,t,i){if(null!=t)return!Array.isArray(t)||2!==t.length||t.some(e=>"number"!=typeof e||!Number.isFinite(e)||Math.abs(e)>1e4)?e.err(i,"Must be two numbers [x, y]."):[t[0],t[1]]}function on(e,t,i){return"string"==typeof t&&t.trim()?t.length>Qe?e.err(i,"At most 8192 characters."):rt.test(t)&&/^\s*[Mm]/.test(t)?(0,de.Mj)(t).some(e=>e.length)?t.trim().replace(/\s+/g," "):e.err(i,"The path draws nothing."):e.err(i,"Not valid path data (it must start with M)."):e.err(i,"Required.")}function ln(e,t,i,n){if("string"!=typeof t||!t.trim())return e.err(i,"Must be SVG markup.");if(("undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length)>Se)return e.err(i,"The SVG is larger than 32 KB.");const s=n&&!/^\s*<svg[\s>]/i.test(t)?`<svg viewBox="0 0 24 24">${t}</svg>`:t;if(!/<svg[\s>]/i.test(s))return e.err(i,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=Ne(s);if(t.error)return e.err(i,t.error)}return t}function cn(e,t,i,n){const s=function(e){if("string"!=typeof e)return;if(Xi.includes(e))return{kind:e};const t=/^(part|group|shape):(.+)$/.exec(e);return t&&Ji.test(t[2])?{kind:t[1],id:t[2]}:void 0}(t);if(!s)return e.err(i,"Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.");if(void 0!==s.id){const t="part"===s.kind?n?.parts:"group"===s.kind?n?.groups:n?.shapes;if(!t?.some(e=>e.id===s.id))return e.err(i,`No ${s.kind} "${s.id}" in the rig.`)}return t}function dn(e,t){const i={},n=t=>void 0!==e[t]&&null!==e[t],s="keyframes"===e.kind;let a;return s&&n("rig")&&(a=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s={parts:[]},a=void 0!==n.icon&&null!==n.icon&&""!==n.icon,r=void 0!==n.svg&&null!==n.svg&&""!==n.svg;if(a&&r&&e.err(i,"Set icon or svg, not both."),a&&("string"==typeof n.icon&&ot.test(n.icon.trim())?s.icon=n.icon.trim():e.err(`${i}.icon`,"Must be an icon id like mdi:bell.")),r){const t=ln(e,n.svg,`${i}.svg`,!1);t&&(s.svg=t)}const o=new Set,l=void 0===n.parts?[]:nn(e,n.parts,`${i}.parts`,Gi);if(l?.forEach((t,n)=>{const a=`${i}.parts[${n}]`,r=e.obj(t,a);if(!r)return;const l=sn(e,r,a,o);if(!l)return;const c={id:l,name:an(e,r,a,l)},d=void 0!==r.from&&null!==r.from;if(d===(void 0!==r.svg&&null!==r.svg&&""!==r.svg))return void e.err(a,"Set one of from or svg.");if(d){const t=e.list(r.from,`${a}.from`,256,1),i=[];t?.forEach((t,n)=>{"number"==typeof t&&Number.isInteger(t)&&t>=0&&t<=4095?i.push(t):e.err(`${a}.from[${n}]`,"Must be a subpath index (a whole number from 0).")}),c.from=i}else{const t=ln(e,r.svg,`${a}.svg`,!0);t&&(c.svg=t)}const p=rn(e,r.origin,`${a}.origin`);p&&(c.origin=p),s.parts.push(c)}),void 0!==n.groups&&null!==n.groups){const t=new Set(s.parts.map(e=>e.id)),a=[];nn(e,n.groups,`${i}.groups`,16)?.forEach((n,s)=>{const r=`${i}.groups[${s}]`,l=e.obj(n,r);if(!l)return;const c=sn(e,l,r,o);if(!c)return;const d=[];e.list(l.parts,`${r}.parts`,Gi,1)?.forEach((i,n)=>{"string"==typeof i&&t.has(i)?d.includes(i)||d.push(i):e.err(`${r}.parts[${n}]`,"Not a part of this rig.")});const p={id:c,name:an(e,l,r,c),parts:d},h=rn(e,l.origin,`${r}.origin`);h&&(p.origin=h),d.length&&a.push(p)}),s.groups=a}if(void 0!==n.shapes&&null!==n.shapes){const t=[];nn(e,n.shapes,`${i}.shapes`,Yi)?.forEach((n,s)=>{const a=`${i}.shapes[${s}]`,r=e.obj(n,a);if(!r)return;const l=sn(e,r,a,o);if(!l)return;const c=on(e,r.d,`${a}.d`),d={id:l,name:an(e,r,a,l),d:c??"",layer:"over"},p=e.css(r,"fill",`${a}.fill`,"color");p&&(d.fill=p);const h=e.css(r,"stroke",`${a}.stroke`,"color");h&&(d.stroke=h);const u=e.num(r,"stroke_width",`${a}.stroke_width`,0,100);void 0!==u&&(d.stroke_width=u);const m=e.oneOf(r,"linecap",`${a}.linecap`,["round","butt","square"]);m&&(d.linecap=m),d.layer=e.oneOf(r,"layer",`${a}.layer`,["over","under"],"over")??"over";const g=rn(e,r.origin,`${a}.origin`);g&&(d.origin=g),c&&t.push(d)}),s.shapes=t}return s}(t,e.rig,"rig"),a&&(i.rig=a)),s&&n("tracks")&&(i.tracks=function(e,t,i){const n=[],s=new Set;return nn(e,t,"tracks",24)?.forEach((t,a)=>{const r=`tracks[${a}]`,o=e.obj(t,r);if(!o)return;let l=cn(e,o.target,`${r}.target`,i);l&&s.has(l)&&(l=e.err(`${r}.target`,"Another track already animates this target.")),l&&s.add(l);const c=!!l&&/^(part|group|shape):/.test(l),d=((void 0===o.keyframes?[]:nn(e,o.keyframes,`${r}.keyframes`,40))??[]).map((t,i)=>mt(e,t,`${r}.keyframes[${i}]`,c)).filter(e=>!!e).sort((e,t)=>e.at-t.at),p={target:l??"element",keyframes:d};if(void 0!==o.origin&&""!==o.origin&&("string"==typeof o.origin&&at.test(o.origin.trim())?p.origin=o.origin.trim():e.err(`${r}.origin`,'Use keywords, lengths or percentages, e.g. "50% 100%".')),void 0!==o.path&&null!==o.path){const t=e.obj(o.path,`${r}.path`);if(t){const i=on(e,t.d,`${r}.path.d`);i&&(p.path={d:i,...void 0!==t.follow_rotation?{follow_rotation:e.bool(t,"follow_rotation",`${r}.path.follow_rotation`,!1)}:{}})}}l&&n.push(p)}),n}(t,e.tracks,a)),n("clips")&&(i.clips=function(e,t,i){const n=[],s=new Set(J.map(e=>e.id));return nn(e,t,"clips",12)?.forEach((t,a)=>{const r=`clips[${a}]`,o=e.obj(t,r);if(!o)return;const l=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["state","state_not","entity_on","above","below"].filter(e=>void 0!==n[e]&&null!==n[e]);if(1!==s.length)return e.err(i,"Set one of state, state_not, entity_on, above or below.");const a=s[0],r=n[a];if("state"===a||"state_not"===a){const t="boolean"==typeof r?r?"on":"off":"string"==typeof r||"number"==typeof r?String(r).trim():"";return!t||t.length>255?e.err(`${i}.${a}`,"Must be a state (text)."):"state"===a?{state:t}:{state_not:t}}if("entity_on"===a)return"boolean"==typeof r?{entity_on:r}:e.err(`${i}.entity_on`,"Must be true or false.");const o=e.num(n,a,`${i}.${a}`,-1e9,1e9);return void 0===o?void 0:"above"===a?{above:o}:{below:o}}(e,o.when,`${r}.when`),c="string"==typeof o.animation?o.animation.trim():"";let d=!0;if(c)if(Ke(c)){const t=We(c);t===i?d=!!e.err(`${r}.animation`,"A clip cannot play its own document (use self)."):et.test(t)||(d=!!e.err(`${r}.animation`,"Not a valid animation id."))}else"self"===c||"none"===c||s.has(c)||(d=!!e.err(`${r}.animation`,"Must be self, none, a preset or custom:<id>."));else d=!!e.err(`${r}.animation`,"Required.");const p=e.oneOf(o,"transition",`${r}.transition`,en);l&&d&&n.push({when:l,animation:c,...p?{transition:p}:{}})}),n}(t,e.clips,"string"==typeof e.id?e.id.trim():"")),s&&n("bindings")&&(i.bindings=function(e,t,i){const n=[];return nn(e,t,"bindings",8)?.forEach((t,s)=>{const a=`bindings[${s}]`,r=e.obj(t,a);if(!r)return;const o=cn(e,r.target,`${a}.target`,i),l=e.oneOf(r,"property",`${a}.property`,Qi);void 0===r.property&&e.err(`${a}.property`,"Required.");const c=e.obj(r.input,`${a}.input`);let d,p;if(c){const t=e.num(c,"min",`${a}.input.min`,-1e9,1e9,0),i=e.num(c,"max",`${a}.input.max`,-1e9,1e9,100);void 0!==t&&void 0!==i&&t===i?e.err(`${a}.input.max`,"Must differ from min."):void 0!==t&&void 0!==i&&(d={min:t,max:i}),void 0!==c.attribute&&null!==c.attribute&&""!==c.attribute&&("string"==typeof c.attribute&&tn.test(c.attribute.trim())?d=d&&{attribute:c.attribute.trim(),...d}:(e.err(`${a}.input.attribute`,"Must be an attribute name."),d=void 0))}const h=r.output;if(Array.isArray(h)&&2===h.length)if("color_mix"===l){const t=st(h[0],"color"),i=st(h[1],"color");t&&i?p=[t,i]:e.err(`${a}.output`,"color_mix needs two colours.")}else h.every(e=>"number"==typeof e&&Number.isFinite(e)&&Math.abs(e)<=1e6)?p=[h[0],h[1]]:e.err(`${a}.output`,"Must be two numbers (colours only for color_mix).");else e.err(`${a}.output`,"Must be a pair [from, to].");const u=e.num(r,"smoothing",`${a}.smoothing`,0,10);o&&l&&d&&p&&n.push({target:o,property:l,input:d,output:p,...void 0!==u?{smoothing:u}:{}})}),n}(t,e.bindings,a)),i}vt=dn;const pn=e=>+e.toFixed(4);function hn(e){let t=5381;for(let i=0;i<e.length;i++)t=(t<<5)+t+e.charCodeAt(i)|0;return(t>>>0).toString(36)}const un=e=>`mcc-${e.id}-${hn(JSON.stringify(e))}`,mn=(e,t)=>`--mcc-${e}-${t}`;function gn(e){return B.find(t=>t.id===e)?.css??e??"ease"}const fn=e=>({len:(t,i)=>0===t?`0${i}`:`calc(${pn(t)}${i} * var(${mn(e,"i")}, 1))`,scale:t=>1===t?"1":`calc(1 + ${pn(t-1)} * var(${mn(e,"i")}, 1))`,color:t=>((e,t)=>t?e.replace(/var\(\s*--mc-anim-c\s*\)/g,(e=>`color-mix(in srgb, var(${mn(e,"c")}, var(--mc-anim-c)) calc(var(${mn(e,"s")}, 1) * 100%), transparent)`)(t)):e)(t,e)}),vn=(e=1)=>({len:(t,i)=>`${pn(t*e)}${i}`,scale:t=>String(pn(1+(t-1)*e)),color:e=>e});function bn(e,t){const i=[],n=e.transform;if(n){if(void 0===n.x&&void 0===n.y||i.push(["translate",`${t.len(n.x??0,"px")} ${t.len(n.y??0,"px")}`]),void 0!==n.scale||void 0!==n.scale_x||void 0!==n.scale_y){const e=n.scale??1,s=e*(n.scale_x??1),a=e*(n.scale_y??1);i.push(["scale",s===a?t.scale(s):`${t.scale(s)} ${t.scale(a)}`])}void 0!==n.rotate&&i.push(["rotate",`${n.axis?`${n.axis.join(" ")} `:""}${t.len(n.rotate,"deg")}`]),void 0===n.skew_x&&void 0===n.skew_y||i.push(["transform",`skew(${t.len(n.skew_x??0,"deg")}, ${t.len(n.skew_y??0,"deg")})`])}if(void 0!==e.opacity&&i.push(["opacity",String(e.opacity)]),e.color&&i.push(["color",t.color(e.color)]),e.background&&i.push(["background",t.color(e.background)]),e.shadow&&i.push(["box-shadow",t.color(e.shadow)]),void 0!==e.filter||void 0!==e.blur){const n=[e.filter&&"none"!==e.filter?t.color(e.filter):"",void 0!==e.blur?`blur(${t.len(e.blur,"px")})`:""].filter(Boolean).join(" ");i.push(["filter",n||"none"])}return void 0!==e.radius&&i.push(["border-radius",`${e.radius}px`]),void 0!==e.draw&&i.push(["stroke-dashoffset",String(pn(1-e.draw))]),e.stroke&&i.push(["stroke",t.color(e.stroke)]),e.easing&&i.push(["animation-timing-function",gn(e.easing)]),i}const yn=(e,t)=>`  ${e} { ${t.map(([e,t])=>`${e}: ${t};`).join(" ")} }`,xn=(e,t)=>`@keyframes ${e} {\n${t.join("\n")}\n}`,wn={translate:["x","y"],scale:["scale","scale_x","scale_y"],rotate:["rotate"],transform:["skew"],opacity:["opacity"],color:["color"],background:["background"],"box-shadow":["shadow"],filter:["filter","blur"],"border-radius":["radius"],"stroke-dashoffset":["draw"],stroke:["stroke"]};function _n(e,t,i){const n=t.map(e=>bn(e,i)),s=Object.keys(wn).filter(e=>t.some(t=>wn[e].some(e=>void 0!==t.easings?.[e]))),a=xn(e,t.map((e,t)=>yn(`${pn(e.at)}%`,n[t].filter(([e])=>!s.includes(e)))));if(!s.length)return{css:a,lanes:[]};const r=[],o=[a];for(const i of s){const s=`${e}-l${wn[i][0]}`,a=[];t.forEach((e,t)=>{const s=n[t].filter(([e])=>e===i);if(!s.length)return;const r=wn[i].map(t=>e.easings?.[t]).find(e=>void 0!==e)??e.easing;a.push(yn(`${pn(e.at)}%`,r?[...s,["animation-timing-function",gn(r)]]:s))}),a.length&&(r.push(s),o.push(xn(s,a)))}return{css:o.join("\n"),lanes:r}}const kn=e=>"animation-timing-function"===e?"easing":e.replace(/-([a-z])/g,(e,t)=>t.toUpperCase());const $n=(e,t)=>{const i=1-t,n=i*i*i,s=3*i*i*t,a=3*i*t*t,r=t*t*t;return[n*e[0][0]+s*e[1][0]+a*e[2][0]+r*e[3][0],n*e[0][1]+s*e[1][1]+a*e[2][1]+r*e[3][1]]};function Mn(e,t=48){const i=(0,de.Mj)(e).flat();if(!i.length)return[];const n=[i[0][0]];for(const e of i)for(let t=1;t<=16;t++)n.push($n(e,t/16));const s=[0];for(let e=1;e<n.length;e++)s.push(s[e-1]+Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]));const a=s[s.length-1],r=e=>{if(0===a)return n[0];let t=1;for(;t<s.length-1&&s[t]<e;)t++;const i=s[t]-s[t-1]||1,r=Math.min(1,Math.max(0,(e-s[t-1])/i));return[n[t-1][0]+(n[t][0]-n[t-1][0])*r,n[t-1][1]+(n[t][1]-n[t-1][1])*r]},o=[];let l;const c=a/(4*t)||.001;for(let e=0;e<=t;e++){const i=a*e/t,n=r(i),s=r(Math.max(0,i-c)),d=r(Math.min(a,i+c));let p=180*Math.atan2(d[1]-s[1],d[0]-s[0])/Math.PI;if(void 0!==l){for(;p-l>180;)p-=360;for(;p-l<-180;)p+=360}l=p,o.push({t:e/t,x:n[0],y:n[1],angle:p})}return o}function Sn(e,t,i){return Mn(e.d).map(n=>{const s=[["translate",`${t.len(pn(n.x),i[0])} ${t.len(pn(n.y),i[1])}`]];return e.follow_rotation&&s.push(["rotate",`${pn(n.angle)}deg`]),[pn(100*n.t),s]})}const Cn=.618034,An=e=>e-Math.floor(e);function jn(e){const t=e.replace(/^<svg\b(?![^>]*\bxmlns=)/,'<svg xmlns="http://www.w3.org/2000/svg"');return`url("data:image/svg+xml,${encodeURIComponent(t)}")`}function zn(e,t){if(!e)return"border-radius: 50%; background: currentColor;";if("svg"in e){const i=t(e.svg);if(!i)return"border-radius: 50%; background: currentColor;";const n=jn(i);return`background: currentColor; -webkit-mask: ${n} center / contain no-repeat; mask: ${n} center / contain no-repeat;`}return""}const qn=e=>e&&"icon"in e?{icon:e.icon}:e&&"emoji"in e?{text:e.emoji}:void 0;function En(e,t=100){const i=e.count;return Array.from({length:i},(n,s)=>{const a=(An(s*Cn)-.5)*(60/i),r=Math.min(96,Math.max(4,(s+.5)/i*100+a)),o=50+t/100*(r-50),l=e.size[0]+(e.size[1]-e.size[0])*An(.381966*s+.25),c=e.colors.length?e.colors[s%e.colors.length]:"",d=[`--mcc-sz: ${pn(l)}px`,"--mcc-sp: "+(s%2?-1:1),`--mcc-dx: ${pn(16*(2*An(.7548*s)-1))}`,c&&`--mcc-pc: ${c}`].filter(Boolean).join("; ");return{x:pn(o),phase:pn(An(s*Cn)),k:i>1?pn(s/i):0,style:d}})}const Ln=(e,t)=>`.mc-anim-fx[data-fx="${e}"] { opacity: var(${mn(t,"s")}, 1); }\n.mc-anim-fx[data-fx="${e}"] > i { width: var(--mcc-sz); height: var(--mcc-sz); margin-left: calc(var(--mcc-sz) / -2); color: var(--mcc-pc, var(${mn(t,"c")}, var(--mc-anim-c))); display: flex; align-items: center; justify-content: center; font-size: var(--mcc-sz); line-height: 1; font-style: normal; --mdc-icon-size: var(--mcc-sz);`;function Pn(e,t,i,n){const s=i.fade?0:1,a=`calc(var(--mcc-sp, 1) * ${pn(i.spin)}deg)`,r=i.gravity,o=`${pn(i.spread/2)}cqmin`,l=r>0?" animation-timing-function: cubic-bezier(0.5, 0, 1, 1);":r<0?" animation-timing-function: cubic-bezier(0, 0, 0.5, 1);":"";let c,d;switch(i.direction){case"fall":case"rise":{const e="fall"===i.direction?"":"-";c="fall"===i.direction?"top: calc(var(--mcc-sz) * -1);":"top: 100%;",d=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${s};${l} }`,"  10%, 90% { opacity: 1; }",`  100% { translate: calc(var(--mcc-dx, 0) * 1px) calc(${e}100cqh ${e?"-":"+"} var(--mcc-sz) * 2); rotate: ${a}; opacity: ${s}; }`];break}case"drift":c="left: calc(var(--mcc-sz) * -1); top: var(--mc-anim-x); margin-left: 0; margin-top: calc(var(--mcc-sz) / -2);",d=[`  0% { translate: 0 0; rotate: 0deg; opacity: ${s}; }`,"  10%, 90% { opacity: 1; }",`  50% { translate: calc(50cqw + var(--mcc-sz)) calc(var(--mcc-dx, 0) * 1px + ${pn(15*r)}cqh); }`,`  100% { translate: calc(100cqw + var(--mcc-sz) * 2) ${pn(30*r)}cqh; rotate: ${a}; opacity: ${s}; }`];break;case"burst":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",d=["  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); translate: 0 0; opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${o} * -1)) rotate(${a}); translate: 0 ${pn(30*r)}cqh; opacity: ${s}; }`];break;case"orbit":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: var(--mc-fx-delay, 0s);",d=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(calc(${o} * -1)) rotate(0deg); opacity: 1; }`,i.fade?"  50% { opacity: 0.35; }":"",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 360deg)) translateY(calc(${o} * -1)) rotate(${a}); opacity: 1; }`].filter(Boolean);break;case"spiral":c="left: 50%; top: 50%; margin-top: calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s));",d=[`  0% { transform: rotate(calc(var(--mc-anim-k) * 360deg)) translateY(0) rotate(0deg); opacity: ${s}; }`,"  20%, 80% { opacity: 1; }",`  100% { transform: rotate(calc(var(--mc-anim-k) * 360deg + 720deg)) translateY(calc(${o} * -1)) rotate(${a}); opacity: ${s}; }`]}return`${Ln(e,t)} ${c} ${zn(i.shape,n)} }\n${xn(e,d)}`}function Hn(e,t,i,n,s){const a=fn(t),r=i.follow_rotation?"auto":"0deg",o=e=>xn(e,Sn(i,a,"px"===i.units?["px","px"]:["cqw","cqh"]).map(([e,t])=>yn(`${e}%`,[...t,["opacity","1"]]))),l=`${Ln(e,t)} left: 0; top: 0; margin: calc(var(--mcc-sz) / -2) 0 0 calc(var(--mcc-sz) / -2); animation-delay: calc(var(--mc-fx-delay, 0s) - var(--mc-anim-k) * var(--mc-fx-dur, 1s)); ${zn(n.shape,s)} }`;if("px"!==i.units)return`${l}\n${o(e)}`;const c='offset-path: path("M0 0 L1 1")';return[l,`@supports (${c}) {`,`  .mc-anim-fx[data-fx="${e}"] > i { offset-path: path("${i.d}"); offset-rotate: ${r}; offset-anchor: center; margin: 0; }`,`  @keyframes ${e} { from { offset-distance: 0%; opacity: 1; } to { offset-distance: 100%; opacity: 1; } }`,"}",`@supports not (${c}) {`,o(e),"}"].join("\n")}function Vn(e,t){const i=[],n=[];let s=0;const a="icon"===e.target;return(e.steps??[]).forEach((e,r)=>{let o,l,c,d=e.duration;if(Ke(e.animation)){const i=t?.(We(e.animation));i&&("keyframes"===i.kind||"path"===i.kind&&"particles"!==i.path?.subject)&&(o=function(e,t=1){if("path"===e.kind&&e.path)return Sn(i=e.path,vn(t),"px"===i.units?["px","px"]:["%","%"]).map(([e,t])=>({...Object.fromEntries(t.map(([e,t])=>[kn(e),t])),offset:pn(e/100)}));var i;if("keyframes"!==e.kind||!e.keyframes)return[];const n=new Map;for(const i of e.keyframes){const e=n.get(i.at)??{};for(const[n,s]of bn(i,vn(t)))e[kn(n)]=s;n.set(i.at,e)}return[...n.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>({...t,offset:pn(e/100)}))}(i),d??=i.duration,l=gn(i.easing),c=i.origin)}else{const t=te(e.animation);o=t&&!t.channels.includes("fx")?function(e,t={}){const i=te(e);if(!i)return;const n=oe(t.icon&&i.iconKeyframes?`${e}-icon`:e,t.intensity);return void 0===n?void 0:function(e){const t=new Map;for(const i of e)for(const e of i.offsets){const n=t.get(e)??{};for(const[e,t]of i.decls)n[ce(e)]=t;t.set(e,n)}return[...t.entries()].sort((e,t)=>e[0]-t[0]).map(([e,t])=>({...t,offset:+(e/100).toFixed(4)}))}(le(n))}(t.id,{icon:a}):void 0,t&&(d??=parseFloat(t.defaults.duration),l=gn(t.defaults.easing),c=t.origin)}if(!o?.length||!d)return void n.push(r);const p=s+e.delay;i.push({start:pn(p),duration:d,iterations:e.repeat,easing:l??"ease",frames:o,...c&&"center"!==c?{origin:c}:{}}),s=p+d*e.repeat}),{steps:i,total:pn(s),loop:!1!==e.loop,target:e.target,...e.stagger?.children?{stagger:e.stagger.delay}:{},skipped:n}}const Dn=new WeakMap;function Tn(e,t={}){const i=!t.reducedMotion&&(e=>"particles"===e.kind&&!!e.particles?.sim&&!e.particles.preset)(e);let n=i&&function(e){if(Ie.failedSims.has(e.id))return;Rn!==Ie.epoch&&(On=new WeakMap,Rn=Ie.epoch);let t=On.get(e);const i=e.particles;try{const n=Ie.particles&&!t&&Ie.checkSim?.(i.sim,"lenient",{count:i.count,layer:i.layer}).sim;if(n){const s={...i,sim:n},a=e.duration/i.speed,r=Ie.particles(e.id,s,a,{aspect:0}),o=r.other;On.set(e,t={kind:"particles",name:r.name,css:o?`${r.css}\n${o.css}`:r.css,layer:{front:r.front,particles:r.slots,speed:i.speed},sim:{docId:e.id,spec:s,period:a},...o?{split:{name:o.name,layer:{front:o.front,particles:o.slots,speed:i.speed},sim:{docId:e.id,spec:s,period:a,part:1}}}:{}})}}catch{Ie.failedSims.add(e.id)}return t}(e)||function(e,t){if(t.reducedMotion)return{kind:e.kind,name:"",css:"",reduced:!0,..."sequence"===e.kind?{schedule:{steps:[],total:0,loop:!1,target:e.target,skipped:[]}}:{}};if("sequence"===e.kind)return{kind:"sequence",name:un(e),css:"",schedule:Vn(e,t.lookup)};const i=Dn.get(e);if(i)return i;const n=un(e),s=e=>Ne(e).markup;let a;switch(e.kind){case"keyframes":{const{css:t,lanes:i}=_n(n,e.keyframes??[],fn(e.id));a={kind:"keyframes",name:n,css:t,motion:{target:e.target,origin:e.origin},...i.length?{lanes:i}:{}};break}case"particles":{const t=e.particles;if(t.preset){a={kind:"particles",name:"",css:"",preset:{id:t.preset,...void 0!==t.intensity?{intensity:t.intensity}:{}}};break}a={kind:"particles",name:n,css:Pn(n,e.id,t,s),layer:{front:"front"===t.layer,particles:En(t,t.spread),speed:t.speed,...qn(t.shape)?{symbol:qn(t.shape)}:{}}};break}case"path":{const t=e.path;if("particles"===t.subject){const i=t.particles??{count:3,size:[8,8],colors:[]};a={kind:"path",name:n,css:Hn(n,e.id,t,i,s),layer:{front:!1,particles:En(i),speed:1,...qn(i.shape)?{symbol:qn(i.shape)}:{}}};break}const i=Sn(t,fn(e.id),"px"===t.units?["px","px"]:["%","%"]).map(([e,t])=>yn(`${e}%`,t));a={kind:"path",name:n,css:xn(n,i),motion:{target:"icon"===t.subject?"icon":"element",origin:e.origin}};break}}return Dn.set(e,a),a}(e,t);return i&&!Ie.particles&&(n={...n,needsParticles:!0}),Ie.v2&&Be(e)?{...n,v2:Ie.v2(e,t)}:n}let On=new WeakMap,Rn=0;const Nn=new WeakMap,Fn=new WeakMap;function Bn(e){let t=Fn.get(e);if(!t){const i={...e};delete i.rig,delete i.tracks,delete i.clips,delete i.bindings,t={...i,...dn(e,new ut)},Fn.set(e,t)}return t}function In(e,t={}){if(t.reducedMotion||!Array.isArray(e.tracks)||!e.tracks.length)return[];let i=Nn.get(e);return i||Nn.set(e,i=function(e,t){const i=fn(e.id);return(e.tracks??[]).map((e,n)=>{const s=`${t}-t${n}`,a=[],r=[];if(e.keyframes.length){const t=_n(s,e.keyframes,i);a.push(t.css),r.push(...t.lanes)}if(e.path){const t=e.keyframes.length?`${s}-path`:s,n={d:e.path.d,units:"px",follow_rotation:!!e.path.follow_rotation,subject:"element"};a.push(xn(t,Sn(n,i,["px","px"]).map(([e,t])=>yn(`${e}%`,t)))),t!==s&&r.push(t)}return{target:e.target,name:s,css:a.join("\n"),...e.origin?{origin:e.origin}:{},...r.length?{lanes:r}:{}}})}(Bn(e),un(e))),i}Ie.v2=function(e,t={}){const i=Bn(e),n=In(e,t),s=[],a=i.clips?.filter((i,n)=>{if(!Ke(i.animation))return!0;const a=t.lookup?.(We(i.animation));return!(a===e||a&&Array.isArray(a.clips)&&a.clips.length)||(s.push(n),!1)});return{tracks:n,...i.rig?{rig:i.rig}:{},...a?{clips:a}:{},...i.bindings?{bindings:i.bindings}:{},...s.length?{skipped:s}:{}}};const{t:Zn,tc:Kn,tx:Wn,m:Un,locale:Gn}=(0,R.my)("anim-studio",["\"{name}\" has changes that are not saved yet.|\"{name}\" has changes that were not saved last time.|% of size|(prefers-reduced-motion: reduce)|, large|, no icon|, {count} skipped|. Text, icons and background of the card.|0 pulls down, 90 left, 180 up, 270 right.|0 stops on impact, 1 bounces back at full speed.|30 fps|; {skipped} skipped (not for this target or lane)|A baked loop keeps lifetimes inside one loop.|A clip cannot play its own document (use self).|A looping SVG file of the animation|A looping SVG file of the baked particles|A rig has at most {groups} groups.|A sequence cannot play itself.|A sequence has at most {steps} steps.|A sequence lasts as long as its steps. Cards can still scale it with their Duration.|A sequence needs at least one step|About {percent}% of particles|Add a keyframe at the playhead|Add a property to {target}|Add a shape to mix shapes. Each one gets a weight.|Add a {name} keyframe at the playhead|Add as shapes|Add colour|Add emitter|Add keyframe|Add motion path|Add point|Add property|Add property to {target} at the playhead ({at})|Add shape|Add state|Add step|Add the animations to play one after another.|Add the drawing as shapes over the icon, or use it as the icon itself.|Add value binding|Add {lane} keyframe|Add {name} keyframe at the playhead|Adds random swirls to the motion.|Alarm panel|All|All domains|All layers shown|All layers shown. Locks kept.|All particles|Already at the bottom|Already at the top|Also at {at}|Alt+ArrowDown|Alt+ArrowUp|Alt+Down|Alt+Up|Alternate|Alternate reverse|An open line is drawn by its stroke.|Anchor points|Angle|Angle (deg)|Animate an icon's parts|Animated SVG|Animated SVG copied|Animation|Animation colour|Animation settings (Esc)|Animation studio|Another track already animates this target.|Arc|Arrow keys move the cursor, Enter places points, Escape cancels.|Arrows move the keyframe, Alt and arrows go to the next one, Delete removes it.|At end of life|At most {cLIPS_MAX} states.|At most {colours} colours|At most {count} shapes fit in a rig.|At most {emitters} emitters.|At most {mAX_SHAPES} shapes|At most {max} animations.|At most {max} bindings per animation.|At most {max} characters.|At most {max} entries.|At most {max} particles over all emitters.|At most {shapes} shapes fit in a rig.|At most {steps} steps|At most {tracks} animated targets.|At the playhead: {filter}|At the playhead: {text}|At {at} · {secs} s|Attribute|Attribute names use letters, digits, _ . and - (no spaces).|Attribute names use letters, digits, _ . and -.|Background|Baked loop|Baking…|Based on a built-in {kind}|Behind the content|Between {min} and {max}; empty uses {intensity}. Timing and colour come from the animation settings.|Binary sensor|Binding added: {property}.|Binding deleted.|Binding {n}|Black in an <img>, the text colour inline.|Blank keyframes|Blank particles|Blank path|Blank sequence|Blends from the first colour to the second.|Blur|Blur has its own lane and is added to this list.|Bottom|Bottom left|Bottom right|Bounce|Brighten|Bring forward|Bring over the icon|Bring shape forward|Bring shape over the icon|Bring {name} forward|Bring {name} over the icon|Browsers play its CSS keyframes.|Browsers play its CSS keyframes; the SMIL copy plays where CSS animation is missing.|Build one from scratch or customise one of the presets. Saved animations appear in every card's animation picker, under My animations.|Burst|Button|Calendar|Camera|Cancel|Cannot play|Card|Card YAML copied: paste it into a module|Card YAML to copy|Card content|Card content. Text, icons and background of the card.|Card parts|Card theme|Cards that use it stop playing it, unless they embed a copy.|Cards use it as|Ceiling|Centre|Change count|Change fill|Change point type|Change speed|Change spread|Change stroke|Change weight|Changes the last stroke too. The dotted line is what you drew.|Child colour|Child particles|Child particles of {name}|Child shape|Children burst out from the point where they spawn.|Children cannot have children of their own.|Choose a preset|Choose an .svg file.|Choose another|Choose file|Circle|Clear path|Clear search|Click a part to animate it on the timeline. Shift or Ctrl adds to the selection; double-click or F2 renames. H hides, S solos, L locks (preview only).|Click a shape to select it, drag to move it.|Click or drag over shapes to delete them.|Click the stage to add a point, click the line to insert one.|Click to add points, drag for curves. Click the first point to close, or choose Finish path.|Click to add the next point|Click to place the first point|Climate|Close|Close path|Closed|Closed path|Collapse|Collapse {name}|Collide with|Collisions|Colour|Colour mix|Colour {i}|Colour {n}|Colour {n}: entity colour|Colour {n}: {colour}|Colour: currentColor|Colours|Common emoji|Complete at|Contains a link.|Contains an element that runs or fetches.|Contains an event handler.|Contains an external reference.|Content box|Convert the preset to custom particles to export it.|Convert to custom particles|Copies icon: svg and the SVG as card YAML|Copy|Copy (Ctrl+C)|Copy SVG|Copy failed: select the text below and copy it|Copy keyframes|Copy keyframes first|Corner radius|Corner radius (icon units)|Couldn't load the drawing tools.|Count|Count per spawn|Cover|Crossfade|Ctrl + wheel zooms|Ctrl+G|Ctrl+Shift+G|Cursor at x {x}, y {y}. Press Enter to add a point.|Cursor at x {x}, y {y}. Press Enter to finish.|Cursor at x {x}, y {y}. Press Enter to start.|Curved|Custom|Custom axis ({axis})|Custom curve|Custom state|Customise a preset|Customise a preset…|Customise one of {count}|Cut|Cycle|Dark card|Default|Default ({inherited})|Delay|Delay between children|Delay counts from the end of the previous step. Empty duration uses the animation's own ({seconds} s).|Delay counts from the end of the previous step. Empty duration uses the animation's own.|Delete|Delete \"{name}\"?|Delete (Del)|Delete binding|Delete binding {n}|Delete handle|Delete keyframe|Delete keyframes|Delete point|Delete points|Delete shape|Delete state|Delete state {i}|Delete step|Delete step {i}|Delete {count} keyframes|Delete {name}|Deleted \"{name}\".|Deleting failed: {message}|Detail|Device tracker|Direction|Discard|Domain|Doorbell|Dot|Double-click a point to make it smooth or a corner.|Download .svg|Download started|Drag|Drag any of them on the timeline, or use the arrow keys, to move them together.|Drag points and handles.|Drag to draw a line.|Drag to draw. Shift: circle, Alt: from the centre.|Drag to draw. Shift: square, Alt: from the centre.|Drag to move (snaps; Shift: free, Alt: duplicate). Ctrl-click adds a key, Shift-click selects a range. Arrows move, Alt and arrows go to the next key, Delete removes.|Drag to reorder (Alt+Up / Alt+Down)|Drag to resize the stage (double-click: reset)|Drag, or press Alt+Up or Alt+Down, to move the step.|Draw|Draw freely; the stroke is smoothed when you let go.|Draw motion path|Draw off|Draw on|Draw on the stage where the shape travels, starting where it rests.|Draw the path the selected part travels, starting where it rests.|Draw-on is only for icon parts and shapes.|Drawing|Drawing cancelled.|Drawing tools|Drawn|Draws the line on (a battery or level).|Drift|Drive {name} from the entity’s value: rotation speed from a fan’s percentage, a fill from a battery level.|Drop an .svg file here|Drop shadow|Drop the .svg to import it|Duplicate|Duplicate emitter|Duplicate id \"{id}\".|Duplicate {count, plural, one {keyframe} other {keyframes}}|Duplicate {name}|Duplicated as \"{name}\".|Duplicating failed: {message}|Duration|Each particle picks a speed in this range, measured in % of the card's shorter side per second. At 100, a particle crosses a square card in one second.|Each particle turns the way it picks, left or right.|Easing|Easing to the next keyframe|Easing value|Edit the keyframe's easing|Effect presets cannot play as a state: plays nothing.|Effects with their own layer cannot play in a sequence. This step is skipped.|Element|Ellipse|Emitter name|Emitters|Emoji|Emoji or symbol|Empty keyframe|Empty reads the state. For example percentage (fan) or brightness (light).|End handle|End solo|Enter an emoji or a symbol.|Entity colour|Entity is off|Entity is on|Entity value|Erase|Erase shape|Erase shapes|Event|Expand|Expand {name}|Explode and fall|Export|Export all|Export animations|Export {name}|Fade in and out|Fade out and back in (0.2 s)|Fades in with the value.|Fall|Fan|Figure 8|Fill|Fill colour|Filter|Filter presets|Finish cycle|Finish path|Fireflies|Fit the cycle|Fit the whole cycle|Fix the marked fields first.|Flat|Flat (Z)|Flip over (X)|Flip sideways (Y)|Floor|Flow|Follow a drawn path|Follow a path|Follow rotation|Follow the path|Forward|Fountain|Freehand|From|From a preset|From colour|From{unit}|Front door|Glow|Got it|Gravity|Gravity direction|Gravity {strength} {direction}|Greyscale|Grid|Group|Group of {count, plural, one {# part} other {# parts}}|Group pivot|Group removed|Grouped {count} parts|Groups removed|Grows with the value.|Has errors|Heart|Hide and solo are unavailable: the particle preview could not be built.|Hide in preview|Hide in preview (not saved)|Hide in preview: the layer rests at its normal value|Hide {noun} ({keys})|Hide, solo and lock only change this preview.|Highest {noun}|Hue shift|Humidifier|Icon|Icon and emoji particles export as dots.|Icon animation|Icon animation…|Icon moves only the module's icon. Cards can override it.|Icon parts|Icon parts on the stage|Icon to split|Icon {percent}%|Icons, emoji or shapes that fall, rise or burst|Import|Import SVG|Import animations|Import shape|Import shapes|Imported {count, plural, one {# animation} other {# animations}}.|In front of the content|In front: particles draw over text and icons. They never block clicks.|In-out|Infinite|Inspector|Inspector panel|It is used by {count, plural, one {# card} other {# cards}}; they stop playing it, unless they embed a copy.|It turns with the direction it travels.|Keep editing|Keyframe|Keyframe inspector|Keyframe timeline|Keyframe tools|Keyframes|Keys|Kind|Largest|Largest size|Lawn mower|Layer|Layer actions|Layer actions, {name}|Layer name|Layers|Layers hidden in the preview|Layers panel|Left|Left edge|Let the current cycle end first|Library|Lifetime (s)|Lift|Light|Light card|Line|Line ends|Live simulation|Live simulation exports as its baked loop.|Live simulation runs on every dashboard that shows this card and uses more CPU, especially on wall tablets. Animated SVG export plays the baked loop instead.|Living room|Loading icon library…|Loading the {kind} editor…|Loading…|Lock|Locked|Locked. Unlock to edit.|Look|Loop|Loop off|Loop on|Loop speed (×)|Loops|Lowest {noun}|Magic Card is not loaded on this page|Max|Maximise|Media player|Merge parts|Min|Min and max must differ.|Min must not be above max.|Mixed|Mode|More presets could not load. The built-in presets still work.|More smoothing: fewer points and a calmer line.|More smoothing: fewer points and a calmer line. The dotted line is what you drew.|Motion|Motion path|Motion path. Click to add points, drag to move them.|Motion path: select a part or shape first|Motion removed|Move X|Move Y|Move away from the start first.|Move down|Move down (drawn underneath)|Move down (plays later)|Move emitter behind the content|Move emitter down|Move emitter in front of the content|Move emitter up|Move handle|Move keyframe|Move path|Move path point|Move pivot|Move point|Move points|Move state {i} down|Move state {i} up|Move step|Move step {i}|Move the element instead|Move the icon instead|Move up|Move up (drawn on top)|Move up (plays earlier)|Move window|Move {count, plural, one {keyframe} other {keyframes}}|Move {name} down|Move {name} down (drawn underneath)|Move {name} down (plays later)|Move {name} up (drawn on top)|Move {name} up (plays earlier)|Move {name} {where}|Move {where}|Move, scale, turn and colour on a timeline|Moved down: drawn underneath|Moved up: drawn on top|Movement|Moves|Moves along: {subject}|Moves sideways.|Moves the part along a curve, from its rest position. Drag the points on the stage.|Moves up or down.|Moving {target}.|Must be 1-16 of a-z, 0-9 and -, and unique.|Must be SVG markup.|Must be [min, max] px between 1 and 200, min ≤ max.|Must be [min, max].|Must be a list.|Must be a motion preset or a custom keyframes / path animation.|Must be a number.|Must be a pair [from, to].|Must be a particle, ring or scene preset.|Must be a state (text).|Must be a subpath index (a whole number from 0).|Must be a whole number.|Must be an attribute name.|Must be an icon id like mdi:bell.|Must be an icon id like mdi:star.|Must be an object.|Must be between 0 and 100%.|Must be between {min} and {max} {unit}.|Must be between {min} and {max}.|Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.|Must be one of: {options}.|Must be self, none, a preset or custom:<id>.|Must be text of at most 40 characters.|Must be text.|Must be three numbers [x, y, z], not all 0.|Must be true or false.|Must be two numbers (colours only for color_mix).|Must be two numbers [x, y].|Must be up to 8 characters (an emoji or a symbol).|Must differ from min.|My animations|Name|Name of {name}|Needs at least one entry.|Needs at least {min} entries.|Negative blows the rain to the left, positive to the right. It sets the gravity direction.|New|New animation|New keyframes|New particles|New path|New sequence|New shapes|Next keyframe|No <svg> element found.|No animation|No animation matches “{query}”.|No animations found.|No animations match \"{query}\".|No animations match.|No animations yet|No colours: particles use the animation colour.|No free particles left. Lower a count to add an emitter.|No gravity|No icon animations match \"{query}\".|No keyframes yet: use Add property, or double-click its lane.|No keys yet. Add keys on the timeline to rotate, move, scale, fade or colour this part.|No motion path yet. Draw one on the stage.|No presets match \"{query}\".|No properties animate yet. Use Add property, or double-click a lane.|No shapes yet: pick a drawing tool.|No steps yet|No steps yet. Add a clip to start the sequence.|No {kind} \"{id}\" in the rig.|None|None set: the particles take the animation colour.|Normal|Not a part of this rig.|Not a timeline lane.|Not a valid animation id.|Not a valid colour.|Not a valid easing.|Not an allowed shadow: x y blur spread colour.|Not an allowed {kind} value.|Not changed: {big}|Not found|Not found in My animations. This step is skipped.|Not imported: {list}.|Not in your animations: plays nothing until it is saved there.|Not on this tile|Not renamed: {message}|Not serialisable.|Not used|Not valid YAML.|Not valid path data (it must start with M).|Nothing|Nothing (stop)|Nothing is drawn.|Nothing pasted: those properties do not fit here|Nothing plays yet.|Nothing to export yet.|Nothing to set here yet.|Number|Off|On|On collision|On means active for its domain (open, home, playing...).|One click animates the selection; fine-tune the keys on the timeline.|Onion skin|Onion skin: mark the keyframes around the playhead|Only for the trigger time.|Only keyframe animations export as an animated SVG.|Only this property. Default follows the keyframe's easing (the animation easing).|Only this property. Default follows the keyframe's easing.|Opacity|Opacity (%)|Open|Open a particles animation to design its particles.|Open path|Or start from the icon library|Orbit|Origin|Output|Over the icon|Own SVG|Own child colour|Own timeline|Paint|Part|Part actions|Part of {pieces} shapes|Part pivot|Part presets|Part {i}|Part {n}|Particle and sequence animations cannot play as a state.|Particle icon|Particle layers|Particle preset|Particle speed (% of short side/s)|Particles|Particles along a path cannot play in a sequence. This step is skipped.|Particles appear and vanish softly.|Particles play on the whole element.|Particles take the colours in turn. Pick one to change it.|Particles travel the path one after another, over the whole element.|Particles {n}|Parts merged|Paste at the playhead into {target} (Ctrl+V)|Paste keyframes at the playhead|Paste or load some YAML first.|Paste the markup of an <svg>.|Path|Path layers|Path layers (no stacking order)|Paths and shapes only: scripts, styles and links are removed. The shape is filled with the particle colour.|Pause (Space)|Pause preview|Pen|Pen. Click to add points, click the first point to close.|Person|Physics|Pick an animation for this step.|Pick an icon, or type an id like mdi:bell-ring.|Pivot|Pivot of {name}|Pivot on the group's box|Pivot on the part's box|Pivot: {position}|Pixels|Placement|Plant|Play|Play (Space)|Play animations one after another|Play on a row's columns or a column's modules one after another.|Play order|Play preview|Play something else per entity state: a light that glows when on and rests when off. The entity is the module’s, or the one set on the animation in the card.|Playback|Playback speed|Playhead|Plays|Plays on tap|Plays this animation faster or slower.|Point {count} placed. Enter again on the same spot finishes the stroke.|Points are in % of the moving element, so the path scales with it.|Points are in pixels, the same at every size.|Points jump to the icon’s and other shapes’ points nearby.|Points land on whole icon units. Hold Shift to place freely.|Points snap to a 10 px grid. Hold {key} to place freely.|Points snap to a 5% grid. Hold {key} to place freely.|Position|Position in the cycle|Preset|Preset pivot|Preset pivot of {name}|Preview|Preview entity|Preview hides {count, plural, one {# layer} other {# layers}}|Preview state|Preview tile|Preview value|Preview with reduced motion|Previous keyframe|Property|Property keys get their own easing; whole keyframes set the keyframe's easing.|Radius|Rain|Rectangle|Redo (Ctrl+Y)|Redraw|Reduced motion|Reduced motion is on, so the preview stays still.|Reload page|Reloading the page discards changes that are not saved. Reload anyway?|Remove|Remove colour|Remove colour {i}|Remove colour {n}|Remove draw-on|Remove emitter|Remove fill|Remove from this keyframe|Remove motion|Remove motion path|Remove shape|Remove shape {n}|Remove stroke|Remove this part's animation|Remove {name} from this keyframe|Rename|Rename group|Rename part|Rename {name}|Renamed|Renamed to \"{clean}\".|Renaming failed: {message}|Repeat|Repeat count|Replace the path with a {name}|Replace with…|Replace {count} parts|Required.|Reset pivot|Reset to group pivot|Reset to part pivot|Resize window|Restore size|Restore unsaved changes|Restore unsaved changes?|Reverse|Reverse direction|Right|Right edge|Ring|Ring preset|Rise|Rotate|Rotation|Rotation speed|Round|Ruler in percent of the cycle or in seconds|Ruler in percent; show seconds|Ruler in seconds; show percent|SMIL fallback|SVG|SVG copied|SVG shape|SVG to copy|Save|Save (Ctrl+S)|Save as animated SVG|Save as icon|Save your changes?|Saved \"{name}\".|Saving failed.|Saving…|Scale|Scale X|Scale Y|Scene preset|Schedule|Search animations|Search icons|Search presets|Search the icon library|Seasonal scene|Seconds|Seed|Seed {seed} · spin {span}|Select|Select a part or shape first.|Select a part or shape, then draw its motion path.|Select every {name} keyframe (Shift adds)|Select two or more parts to group them.|Send backward|Send shape backward|Send shape under the icon|Send under the icon|Send {name} backward|Send {name} under the icon|Sensor|Sequence|Sequence steps|Sequence steps (plays first to last)|Sequences that play it skip that step: {names}.|Set icon or svg, not both.|Set one of builtin, icon, emoji or svg.|Set one of from or svg.|Set one of icon, emoji or svg.|Set one of state, state_not, entity_on, above or below.|Shadow|Shadow and glow|Shadow colour|Shadow presets|Shadow {name}|Shape|Shape mix|Shape over the icon|Shape points. Drag a point to move it.|Shape under the icon|Shape {n}|Shape {n}: {shape}|Shape {n}: {shape}, weight {weight}|Shapes over the icon|Shapes under the icon|Shortcut: {keys}|Show all|Show all hidden layers|Show in preview|Show {noun} ({keys})|Shuffle|Shuffle: new random paths|Simulation|Siren|Size|Size (px)|Skew|Skew X|Skew Y|Slows particles down over time.|Smallest|Smallest size|Smooth|Smooth all|Smoothing|Smoothing (s)|Snap grid|Snap to keyframes, the playhead and the grid (hold Shift to drag freely)|Snapping|Solo in preview|Solo in preview (hides the others, not saved)|Solo on|Some panels are hidden, as you left them. Use the arrows on the edges to show them.|Spaced evenly along the path, 1 to {particles}.|Spark|Spawn|Spawn child particles|Spawns {seconds} s after birth (set in YAML).|Speed|Speed (% of short side/s)|Spin per loop (deg)|Spins continuously, faster as the value rises (a fan).|Spiral|Split again|Split and start|Split back into shapes|Split icon|Split into {count, plural, one {# part} other {# parts}}|Split into {count, plural, one {# part} other {# parts}} (the first {parts})|Split into {count} parts|Split the icon to animate its shapes one by one: a bell's clapper, a fan's blades.|Splitting again replaces the parts, their groups and their keys.|Splitting…|Spread|Spread across|Spread down|Square|Stage height|Stagger children|Stagger off|Stagger on|Star|Start|Start again after the last step.|Start delay (s)|Start from a template|Start from an icon|Start handle|Started at x {x}, y {y}. Move the cursor and press Enter to finish. Escape cancels.|Starts at|State|State is|State is not|State is not {state_not}|State is {state}|State moved to position {to}.|State {count} added: {when}.|State {i}|State {i} deleted.|States|States (clips) are not exported: the file plays the animation’s own timeline.|Step animation|Step moved to position {to} of {count}.|Step moved to position {to} of {n}.|Step {count} added: {name}.|Step {index} deleted.|Step {index} is skipped|Step {index}: {from} to {to}|Step {i}|Step {i} is locked. Unlock it in Layers.|Steps|Steps jump between values; there is no curve to edit.|Stop drawing|Straight|Straighten all|Streak|Stroke|Stroke colour|Stroke width (icon units)|Sun|Swaps the preset for your own particles: shape, movement, size and colours become editable.|Swirl|Switch|Switch at once|Tap|Target|Text|Text and icon colour|That animation has states of its own: the card skips this state.|That layer is locked. Unlock it in Layers.|The SMIL fallback plays the animation forwards only.|The SVG draws nothing.|The SVG has no shapes to draw.|The SVG has too many shapes; at most {room} fit.|The SVG is larger than 32 KB.|The SVG is too complex.|The YAML is too large to import (over 1 MB).|The animation is larger than {size} KB.|The animation is not valid: {message}|The animation library is not connected.|The animation would be larger than {max} KB ({size} KB).|The animation's easing ({easingLabel})|The animation's keyframes move the element.|The animation's keyframes move the icon.|The animation's keyframes move the module's icon.|The animation's keyframes move the whole element.|The box of the card's icon or of its text.|The colour is not a valid CSS colour: the file uses currentColor.|The drawing tools are not loaded yet.|The drawing tools are ready.|The drawing tools on this page are from another Magic Card version. Reload the page to draw here.|The entity colour button uses the animation colour (the card entry's colour, else the entity's).|The entity’s value drives {name}. Preview it with the value slider on the stage.|The file could not be read.|The file is {size} KB, larger than 256 KB.|The file loops: the repeat count is not exported.|The first state that matches plays; with no match (or an unavailable entity) the own timeline plays. The entity is the module’s, or the one set on the animation in the card.|The icon at rest, without animation. Ids stay on each part and shape.|The icon has no shapes to export.|The icon has {count} shapes: the first {parts} became parts (the most a rig holds), the rest stay at rest.|The icon is split into its parts. Select a part, then give it a preset: swing, spin, draw on and more.|The icon library could not be loaded. Check your connection, then try again.|The import and export tool could not be loaded. Reload the page and try again.|The layers panel is hidden, as you collapsed it before. Use the arrow on the edge to show it.|The library holds at most {cap} animations: only {fit} more fit, {skipped} were not imported.|The library is full ({cap} animations): nothing was imported.|The line draws in over the cycle.|The look changes a little.|The loop hit the size limit, so the file shows fewer particles.|The module's icon moves along the path.|The motion runs back to the start along the path.|The new animation \"{name}\" was not saved last time.|The outline draws in over the cycle, then the shape fills.|The outline is traced, then the part fills in.|The particle engine is not loaded yet.|The parts come from the document's own SVG, one part per shape.|The path draws nothing.|The path has the most points it can hold.|The point it scales and turns around.|The point the group rotates and scales around, in icon units. Drag it on the stage.|The point the part rotates and scales around, in icon units. Drag it on the stage.|The point the preset turns this group around, in icon units. It wins over the group's own pivot. Drag it on the stage.|The point the preset turns this part around, in icon units. It wins over the part's own pivot. Drag it on the stage.|The preset becomes your own animation to edit: motion presets as keyframes, particle and ring presets with their settings.|The preview is scaled to fit the stage|The preview plays on a real magic-card. Load magic-card.js (your dashboard resource) before the animation studio.|The rig holds the most shapes it can (48).|The same seed gives the same loop every time.|The selected keyframes use different easings; a choice here sets all of them.|The shape as a mask|The shape turns with the direction it travels.|The studio works out every particle's path once and plays it as a loop. Light on dashboards.|The timeline also animates the draw here: while it plays, it wins over this binding.|The timeline also animates the opacity here: while it plays, its opacity wins over this binding.|The timeline also animates this colour: while it plays, its colour wins over this binding.|The timeline skews this target: while it plays, the skew replaces this binding’s movement.|The whole element moves along the path from where it rests.|The {noun} panel is hidden, as you left it. Use the arrow on the edge to show it.|These apply to every emitter. Placement is set per emitter.|They replace the preset's look.|This animation|This animation already has 24 animated targets: remove one to add a preset.|This animation has {tracks} animated targets, the most it can hold. Remove one to animate this part.|This card plays engine {engine}; update Magic Card to play this animation.|This icon could not be loaded. Check the icon id, or try again when Home Assistant is reachable.|This icon has no shapes to animate.|This icon has no shapes to split.|This is the lane's last key: no segment follows it, so its easing has no effect.|This is the last keyframe: no segment follows it, so its easing has no effect.|This keyframe sets no property. Add one with Add property.|This loop hit the size limit, so it shows fewer particles. Lower the count or the child particles.|This loop is large, so it takes longer to load on wall tablets. Lower the count or the child particles.|This part has its own draw keys on the timeline.|This preset could not be opened: {message}|This preset is not available in this version of Magic Card.|Timeline|Timeline view|Timer|Timing|To|To colour|Tool: {tool}|Top|Top left|Top right|To{unit}|Tracks (combined, no order)|Tracks of card parts (name, state, background) are not exported.|Transition|Triangle|Trimmed|Try again|Turbulence|Turn|Turn collider off|Turn collider on|Turn fade off|Turn fade on|Turn on a collider first.|Turn the subject to face the direction of travel.|Turn with the path|Turns to an angle (a needle or a dial).|Unavailable|Under the icon|Undo (Ctrl+Z)|Unexpected element <{element}>.|Ungroup|Units|Unknown preset|Unknown preset. This step is skipped.|Unknown preset: plays nothing.|Unlock|Unlocked|Unsaved changes|Unsupported version (expected 1).|Untitled animation|Up to {parentsLeft} for this emitter. All emitters share {parents} particles.|Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).|Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).|Use Own timeline to play this animation.|Use a colour or a gradient.|Use a preset name, cubic-bezier(x1, y1, x2, y2) or steps(n).|Use an icon id like mdi:bell-ring.|Use as icon|Use baked loop|Use currentColor|Use filter functions like brightness(1.2) hue-rotate(30deg); url() is not allowed.|Use in card|Use keywords, lengths or percentages, e.g. \"50% 100%\".|Use live simulation|Use the parent's colours|Use up to 8 characters.|Use {emoji}|Used by {count, plural, one {# card} other {# cards}}|Vacuum|Value|Value above|Value above {above}|Value below|Value below {below}|Value bindings|Value bindings are not exported: the file plays at the drawn values.|Valve|Variation|Wave|Weather|Weight|What moves|What to save|When|Whole keyframe|Wind angle (deg)|With reduced motion the card shows its still state: this animation does not play.|X|Y|Zigzag|Zone|Zoom in|Zoom in (Ctrl +)|Zoom out|Zoom out (Ctrl -)|Zoomed to the icon while you edit its parts or draw|after {seconds}|after {seconds} s|animated|at end of life|at {angle}°|behind the content|child size|child speed|color_mix needs two colours.|custom:{id}|down|down left|down right|drag {value}|drawing area|draws on|emoji|hidden because another layer is soloed|hidden because {name} is hidden|hidden in the preview|in front of the content|inspector|keyframe|keyframe track|keyframe tracks of {name}|layers|left|lifetime|live|locked|locked because the layer it belongs to is locked|loops|my animations|not on the {tile} tile|not valid|on|on collision|opacity|over the icon|plays once|right|selected|speed|spin|start delay|state|step {i} of {count}|step {i} of {count}, {problem}|the background|the element|the icon|the name|the state|turbulence {value}|under the icon|units|unknown error|up|up left|up right|{animation} (unknown)|{below} hidden|{below} hidden below|{count, plural, one {# dot} other {# dots}}|{count, plural, one {# icon} other {# icons}}|{count, plural, one {# keyframe} other {# keyframes}}|{count, plural, one {# keyframe} other {# keyframes}} copied|{count, plural, one {# keyframe} other {# keyframes}} deleted|{count, plural, one {# keyframe} other {# keyframes}} pasted at {at}{skipped}|{count, plural, one {# keyframe} other {# keyframes}} selected.|{count, plural, one {# key} other {# keys}}|{count, plural, one {# key} other {# keys}} on the timeline. Rotate, move, scale, fade and colour this part there.|{count, plural, one {# particle} other {# particles}} · {flow}|{count, plural, one {# point} other {# points}}|{count, plural, one {# shape} other {# shapes}}|{count, plural, one {# shape} other {# shapes}}, scaled into the icon|{count, plural, one {# step} other {# steps}}|{count, plural, one {# {shape}} other {# {shape}s}} {trigger}|{count, plural, one {{names} is not on the {tile} tile. Switch the preview tile to Card to see it.} other {{names} are not on the {tile} tile. Switch the preview tile to Card to see them.}}|{count} keyframes|{count} of {colours}|{count} parts|{count} shapes|{count} targets|{count} targets selected: a preset plays on each (Wave: one after another).|{from} to {to}{unit}|{id} (not found)|{id}: the library is full|{kb} of 32 KB|{key} moves one handle alone.|{key} removes it.|{kind} cannot play in a sequence. This step is skipped.|{label} (the animation moves it)|{label} (the animation moves it) · not on the {tile} tile|{label} at {at}|{label} at {at} · {value}|{label} easing to the next key|{label} is not on the {tile} tile|{label} lane|{label} preset|{label} tool. {hint}|{label} · not on the {tile} tile|{lane} keyframe|{list}, bounce {bounce}|{min}–{max} px|{names} share this curve.|{name} (copy {n})|{name} (copy)|{name} added, {count} points.|{name} added.|{name} animation|{name} copy|{name} hidden in the preview|{name} is locked. Unlock it in Layers.|{name} is now step {to} of {count}|{name} is now {where}.|{name} keyframes|{name} locked|{name} moved behind the content|{name} moved in front of the content|{name} moved {direction}|{name} moved {direction}, position {position} of {count}|{name} moved {where}|{name} no longer soloed|{name} settings|{name} shown in the preview|{name} soloed in the preview|{name} unlocked|{name}, behind the content|{name}, in front of the content|{name}: {count, plural, one {# key} other {# keys}}|{now} of {total} seconds|{panels} hidden|{panels} shown|{particles} particles · {emitters} emitters|{pct} % of the input range|{pct}, {seconds} seconds|{preset} on {targets}|{seconds} s loop|{size} KB|{size} icon units|{steps}, {total} per cycle, {loop}{skipped}.|{target} keyframe|{target} {lane} keyframe|{target} · at {at} · {secs} s|{where} · {from} to {to}","\"{name}\" has changes that are not saved yet.|\"{name}\" has changes that were not saved last time.|% of size|(prefers-reduced-motion: reduce)|, large|, no icon|, {count} skipped|. Text, icons and background of the card.|0 pulls down, 90 left, 180 up, 270 right.|0 stops on impact, 1 bounces back at full speed.|30 fps|; {skipped} skipped (not for this target or lane)|A baked loop keeps lifetimes inside one loop.|A clip cannot play its own document (use self).|A looping SVG file of the animation|A looping SVG file of the baked particles|A rig has at most {groups} groups.|A sequence cannot play itself.|A sequence has at most {steps} steps.|A sequence lasts as long as its steps. Cards can still scale it with their Duration.|A sequence needs at least one step|About {percent}% of particles|Add a keyframe at the playhead|Add a property to {target}|Add a shape to mix shapes. Each one gets a weight.|Add a {name} keyframe at the playhead|Add as shapes|Add color|Add emitter|Add keyframe|Add motion path|Add point|Add property|Add property to {target} at the playhead ({at})|Add shape|Add state|Add step|Add the animations to play one after another.|Add the drawing as shapes over the icon, or use it as the icon itself.|Add value binding|Add {lane} keyframe|Add {name} keyframe at the playhead|Adds random swirls to the motion.|Alarm panel|All|All domains|All layers shown|All layers shown. Locks kept.|All particles|Already at the bottom|Already at the top|Also at {at}|Alt+ArrowDown|Alt+ArrowUp|Alt+Down|Alt+Up|Alternate|Alternate reverse|An open line is drawn by its stroke.|Anchor points|Angle|Angle (deg)|Animate an icon's parts|Animated SVG|Animated SVG copied|Animation|Animation color|Animation settings (Esc)|Animation studio|Another track already animates this target.|Arc|Arrow keys move the cursor, Enter places points, Escape cancels.|Arrows move the keyframe, Alt and arrows go to the next one, Delete removes it.|At end of life|At most {cLIPS_MAX} states.|At most {colours} colors|At most {count} shapes fit in a rig.|At most {emitters} emitters.|At most {mAX_SHAPES} shapes|At most {max} animations.|At most {max} bindings per animation.|At most {max} characters.|At most {max} entries.|At most {max} particles over all emitters.|At most {shapes} shapes fit in a rig.|At most {steps} steps|At most {tracks} animated targets.|At the playhead: {filter}|At the playhead: {text}|At {at} · {secs} s|Attribute|Attribute names use letters, digits, _ . and - (no spaces).|Attribute names use letters, digits, _ . and -.|Background|Baked loop|Baking…|Based on a built-in {kind}|Behind the content|Between {min} and {max}; empty uses {intensity}. Timing and color come from the animation settings.|Binary sensor|Binding added: {property}.|Binding deleted.|Binding {n}|Black in an <img>, the text color inline.|Blank keyframes|Blank particles|Blank path|Blank sequence|Blends from the first color to the second.|Blur|Blur has its own lane and is added to this list.|Bottom|Bottom left|Bottom right|Bounce|Brighten|Bring forward|Bring over the icon|Bring shape forward|Bring shape over the icon|Bring {name} forward|Bring {name} over the icon|Browsers play its CSS keyframes.|Browsers play its CSS keyframes; the SMIL copy plays where CSS animation is missing.|Build one from scratch or customize one of the presets. Saved animations appear in every card's animation picker, under My animations.|Burst|Button|Calendar|Camera|Cancel|Cannot play|Card|Card YAML copied: paste it into a module|Card YAML to copy|Card content|Card content. Text, icons and background of the card.|Card parts|Card theme|Cards that use it stop playing it, unless they embed a copy.|Cards use it as|Ceiling|Center|Change count|Change fill|Change point type|Change speed|Change spread|Change stroke|Change weight|Changes the last stroke too. The dotted line is what you drew.|Child color|Child particles|Child particles of {name}|Child shape|Children burst out from the point where they spawn.|Children cannot have children of their own.|Choose a preset|Choose an .svg file.|Choose another|Choose file|Circle|Clear path|Clear search|Click a part to animate it on the timeline. Shift or Ctrl adds to the selection; double-click or F2 renames. H hides, S solos, L locks (preview only).|Click a shape to select it, drag to move it.|Click or drag over shapes to delete them.|Click the stage to add a point, click the line to insert one.|Click to add points, drag for curves. Click the first point to close, or choose Finish path.|Click to add the next point|Click to place the first point|Climate|Close|Close path|Closed|Closed path|Collapse|Collapse {name}|Collide with|Collisions|Color|Color mix|Color {i}|Color {n}|Color {n}: entity color|Color {n}: {colour}|Color: currentColor|Colors|Common emoji|Complete at|Contains a link.|Contains an element that runs or fetches.|Contains an event handler.|Contains an external reference.|Content box|Convert the preset to custom particles to export it.|Convert to custom particles|Copies icon: svg and the SVG as card YAML|Copy|Copy (Ctrl+C)|Copy SVG|Copy failed: select the text below and copy it|Copy keyframes|Copy keyframes first|Corner radius|Corner radius (icon units)|Couldn't load the drawing tools.|Count|Count per spawn|Cover|Crossfade|Ctrl + wheel zooms|Ctrl+G|Ctrl+Shift+G|Cursor at x {x}, y {y}. Press Enter to add a point.|Cursor at x {x}, y {y}. Press Enter to finish.|Cursor at x {x}, y {y}. Press Enter to start.|Curved|Custom|Custom axis ({axis})|Custom curve|Custom state|Customize a preset|Customize a preset…|Customize one of {count}|Cut|Cycle|Dark card|Default|Default ({inherited})|Delay|Delay between children|Delay counts from the end of the previous step. Empty duration uses the animation's own ({seconds} s).|Delay counts from the end of the previous step. Empty duration uses the animation's own.|Delete|Delete \"{name}\"?|Delete (Del)|Delete binding|Delete binding {n}|Delete handle|Delete keyframe|Delete keyframes|Delete point|Delete points|Delete shape|Delete state|Delete state {i}|Delete step|Delete step {i}|Delete {count} keyframes|Delete {name}|Deleted \"{name}\".|Deleting failed: {message}|Detail|Device tracker|Direction|Discard|Domain|Doorbell|Dot|Double-click a point to make it smooth or a corner.|Download .svg|Download started|Drag|Drag any of them on the timeline, or use the arrow keys, to move them together.|Drag points and handles.|Drag to draw a line.|Drag to draw. Shift: circle, Alt: from the center.|Drag to draw. Shift: square, Alt: from the center.|Drag to move (snaps; Shift: free, Alt: duplicate). Ctrl-click adds a key, Shift-click selects a range. Arrows move, Alt and arrows go to the next key, Delete removes.|Drag to reorder (Alt+Up / Alt+Down)|Drag to resize the stage (double-click: reset)|Drag, or press Alt+Up or Alt+Down, to move the step.|Draw|Draw freely; the stroke is smoothed when you let go.|Draw motion path|Draw off|Draw on|Draw on the stage where the shape travels, starting where it rests.|Draw the path the selected part travels, starting where it rests.|Draw-on is only for icon parts and shapes.|Drawing|Drawing canceled.|Drawing tools|Drawn|Draws the line on (a battery or level).|Drift|Drive {name} from the entity’s value: rotation speed from a fan’s percentage, a fill from a battery level.|Drop an .svg file here|Drop shadow|Drop the .svg to import it|Duplicate|Duplicate emitter|Duplicate id \"{id}\".|Duplicate {count, plural, one {keyframe} other {keyframes}}|Duplicate {name}|Duplicated as \"{name}\".|Duplicating failed: {message}|Duration|Each particle picks a speed in this range, measured in % of the card's shorter side per second. At 100, a particle crosses a square card in one second.|Each particle turns the way it picks, left or right.|Easing|Easing to the next keyframe|Easing value|Edit the keyframe's easing|Effect presets cannot play as a state: plays nothing.|Effects with their own layer cannot play in a sequence. This step is skipped.|Element|Ellipse|Emitter name|Emitters|Emoji|Emoji or symbol|Empty keyframe|Empty reads the state. For example percentage (fan) or brightness (light).|End handle|End solo|Enter an emoji or a symbol.|Entity color|Entity is off|Entity is on|Entity value|Erase|Erase shape|Erase shapes|Event|Expand|Expand {name}|Explode and fall|Export|Export all|Export animations|Export {name}|Fade in and out|Fade out and back in (0.2 s)|Fades in with the value.|Fall|Fan|Figure 8|Fill|Fill color|Filter|Filter presets|Finish cycle|Finish path|Fireflies|Fit the cycle|Fit the whole cycle|Fix the marked fields first.|Flat|Flat (Z)|Flip over (X)|Flip sideways (Y)|Floor|Flow|Follow a drawn path|Follow a path|Follow rotation|Follow the path|Forward|Fountain|Freehand|From|From a preset|From color|From{unit}|Front door|Glow|Got it|Gravity|Gravity direction|Gravity {strength} {direction}|Grayscale|Grid|Group|Group of {count, plural, one {# part} other {# parts}}|Group pivot|Group removed|Grouped {count} parts|Groups removed|Grows with the value.|Has errors|Heart|Hide and solo are unavailable: the particle preview could not be built.|Hide in preview|Hide in preview (not saved)|Hide in preview: the layer rests at its normal value|Hide {noun} ({keys})|Hide, solo and lock only change this preview.|Highest {noun}|Hue shift|Humidifier|Icon|Icon and emoji particles export as dots.|Icon animation|Icon animation…|Icon moves only the module's icon. Cards can override it.|Icon parts|Icon parts on the stage|Icon to split|Icon {percent}%|Icons, emoji or shapes that fall, rise or burst|Import|Import SVG|Import animations|Import shape|Import shapes|Imported {count, plural, one {# animation} other {# animations}}.|In front of the content|In front: particles draw over text and icons. They never block clicks.|In-out|Infinite|Inspector|Inspector panel|It is used by {count, plural, one {# card} other {# cards}}; they stop playing it, unless they embed a copy.|It turns with the direction it travels.|Keep editing|Keyframe|Keyframe inspector|Keyframe timeline|Keyframe tools|Keyframes|Keys|Kind|Largest|Largest size|Lawn mower|Layer|Layer actions|Layer actions, {name}|Layer name|Layers|Layers hidden in the preview|Layers panel|Left|Left edge|Let the current cycle end first|Library|Lifetime (s)|Lift|Light|Light card|Line|Line ends|Live simulation|Live simulation exports as its baked loop.|Live simulation runs on every dashboard that shows this card and uses more CPU, especially on wall tablets. Animated SVG export plays the baked loop instead.|Living room|Loading icon library…|Loading the {kind} editor…|Loading…|Lock|Locked|Locked. Unlock to edit.|Look|Loop|Loop off|Loop on|Loop speed (×)|Loops|Lowest {noun}|Magic Card is not loaded on this page|Max|Maximize|Media player|Merge parts|Min|Min and max must differ.|Min must not be above max.|Mixed|Mode|More presets could not load. The built-in presets still work.|More smoothing: fewer points and a calmer line.|More smoothing: fewer points and a calmer line. The dotted line is what you drew.|Motion|Motion path|Motion path. Click to add points, drag to move them.|Motion path: select a part or shape first|Motion removed|Move X|Move Y|Move away from the start first.|Move down|Move down (drawn underneath)|Move down (plays later)|Move emitter behind the content|Move emitter down|Move emitter in front of the content|Move emitter up|Move handle|Move keyframe|Move path|Move path point|Move pivot|Move point|Move points|Move state {i} down|Move state {i} up|Move step|Move step {i}|Move the element instead|Move the icon instead|Move up|Move up (drawn on top)|Move up (plays earlier)|Move window|Move {count, plural, one {keyframe} other {keyframes}}|Move {name} down|Move {name} down (drawn underneath)|Move {name} down (plays later)|Move {name} up (drawn on top)|Move {name} up (plays earlier)|Move {name} {where}|Move {where}|Move, scale, turn and color on a timeline|Moved down: drawn underneath|Moved up: drawn on top|Movement|Moves|Moves along: {subject}|Moves sideways.|Moves the part along a curve, from its rest position. Drag the points on the stage.|Moves up or down.|Moving {target}.|Must be 1-16 of a-z, 0-9 and -, and unique.|Must be SVG markup.|Must be [min, max] px between 1 and 200, min ≤ max.|Must be [min, max].|Must be a list.|Must be a motion preset or a custom keyframes / path animation.|Must be a number.|Must be a pair [from, to].|Must be a particle, ring or scene preset.|Must be a state (text).|Must be a subpath index (a whole number from 0).|Must be a whole number.|Must be an attribute name.|Must be an icon id like mdi:bell.|Must be an icon id like mdi:star.|Must be an object.|Must be between 0 and 100%.|Must be between {min} and {max} {unit}.|Must be between {min} and {max}.|Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.|Must be one of: {options}.|Must be self, none, a preset or custom:<id>.|Must be text of at most 40 characters.|Must be text.|Must be three numbers [x, y, z], not all 0.|Must be true or false.|Must be two numbers (colors only for color_mix).|Must be two numbers [x, y].|Must be up to 8 characters (an emoji or a symbol).|Must differ from min.|My animations|Name|Name of {name}|Needs at least one entry.|Needs at least {min} entries.|Negative blows the rain to the left, positive to the right. It sets the gravity direction.|New|New animation|New keyframes|New particles|New path|New sequence|New shapes|Next keyframe|No <svg> element found.|No animation|No animation matches “{query}”.|No animations found.|No animations match \"{query}\".|No animations match.|No animations yet|No colors: particles use the animation color.|No free particles left. Lower a count to add an emitter.|No gravity|No icon animations match \"{query}\".|No keyframes yet: use Add property, or double-click its lane.|No keys yet. Add keys on the timeline to rotate, move, scale, fade or color this part.|No motion path yet. Draw one on the stage.|No presets match \"{query}\".|No properties animate yet. Use Add property, or double-click a lane.|No shapes yet: pick a drawing tool.|No steps yet|No steps yet. Add a clip to start the sequence.|No {kind} \"{id}\" in the rig.|None|None set: the particles take the animation color.|Normal|Not a part of this rig.|Not a timeline lane.|Not a valid animation id.|Not a valid color.|Not a valid easing.|Not an allowed shadow: x y blur spread color.|Not an allowed {kind} value.|Not changed: {big}|Not found|Not found in My animations. This step is skipped.|Not imported: {list}.|Not in your animations: plays nothing until it is saved there.|Not on this tile|Not renamed: {message}|Not serialisable.|Not used|Not valid YAML.|Not valid path data (it must start with M).|Nothing|Nothing (stop)|Nothing is drawn.|Nothing pasted: those properties do not fit here|Nothing plays yet.|Nothing to export yet.|Nothing to set here yet.|Number|Off|On|On collision|On means active for its domain (open, home, playing...).|One click animates the selection; fine-tune the keys on the timeline.|Onion skin|Onion skin: mark the keyframes around the playhead|Only for the trigger time.|Only keyframe animations export as an animated SVG.|Only this property. Default follows the keyframe's easing (the animation easing).|Only this property. Default follows the keyframe's easing.|Opacity|Opacity (%)|Open|Open a particles animation to design its particles.|Open path|Or start from the icon library|Orbit|Origin|Output|Over the icon|Own SVG|Own child color|Own timeline|Paint|Part|Part actions|Part of {pieces} shapes|Part pivot|Part presets|Part {i}|Part {n}|Particle and sequence animations cannot play as a state.|Particle icon|Particle layers|Particle preset|Particle speed (% of short side/s)|Particles|Particles along a path cannot play in a sequence. This step is skipped.|Particles appear and vanish softly.|Particles play on the whole element.|Particles take the colors in turn. Pick one to change it.|Particles travel the path one after another, over the whole element.|Particles {n}|Parts merged|Paste at the playhead into {target} (Ctrl+V)|Paste keyframes at the playhead|Paste or load some YAML first.|Paste the markup of an <svg>.|Path|Path layers|Path layers (no stacking order)|Paths and shapes only: scripts, styles and links are removed. The shape is filled with the particle color.|Pause (Space)|Pause preview|Pen|Pen. Click to add points, click the first point to close.|Person|Physics|Pick an animation for this step.|Pick an icon, or type an id like mdi:bell-ring.|Pivot|Pivot of {name}|Pivot on the group's box|Pivot on the part's box|Pivot: {position}|Pixels|Placement|Plant|Play|Play (Space)|Play animations one after another|Play on a row's columns or a column's modules one after another.|Play order|Play preview|Play something else per entity state: a light that glows when on and rests when off. The entity is the module’s, or the one set on the animation in the card.|Playback|Playback speed|Playhead|Plays|Plays on tap|Plays this animation faster or slower.|Point {count} placed. Enter again on the same spot finishes the stroke.|Points are in % of the moving element, so the path scales with it.|Points are in pixels, the same at every size.|Points jump to the icon’s and other shapes’ points nearby.|Points land on whole icon units. Hold Shift to place freely.|Points snap to a 10 px grid. Hold {key} to place freely.|Points snap to a 5% grid. Hold {key} to place freely.|Position|Position in the cycle|Preset|Preset pivot|Preset pivot of {name}|Preview|Preview entity|Preview hides {count, plural, one {# layer} other {# layers}}|Preview state|Preview tile|Preview value|Preview with reduced motion|Previous keyframe|Property|Property keys get their own easing; whole keyframes set the keyframe's easing.|Radius|Rain|Rectangle|Redo (Ctrl+Y)|Redraw|Reduced motion|Reduced motion is on, so the preview stays still.|Reload page|Reloading the page discards changes that are not saved. Reload anyway?|Remove|Remove color|Remove color {i}|Remove color {n}|Remove draw-on|Remove emitter|Remove fill|Remove from this keyframe|Remove motion|Remove motion path|Remove shape|Remove shape {n}|Remove stroke|Remove this part's animation|Remove {name} from this keyframe|Rename|Rename group|Rename part|Rename {name}|Renamed|Renamed to \"{clean}\".|Renaming failed: {message}|Repeat|Repeat count|Replace the path with a {name}|Replace with…|Replace {count} parts|Required.|Reset pivot|Reset to group pivot|Reset to part pivot|Resize window|Restore size|Restore unsaved changes|Restore unsaved changes?|Reverse|Reverse direction|Right|Right edge|Ring|Ring preset|Rise|Rotate|Rotation|Rotation speed|Round|Ruler in percent of the cycle or in seconds|Ruler in percent; show seconds|Ruler in seconds; show percent|SMIL fallback|SVG|SVG copied|SVG shape|SVG to copy|Save|Save (Ctrl+S)|Save as animated SVG|Save as icon|Save your changes?|Saved \"{name}\".|Saving failed.|Saving…|Scale|Scale X|Scale Y|Scene preset|Schedule|Search animations|Search icons|Search presets|Search the icon library|Seasonal scene|Seconds|Seed|Seed {seed} · spin {span}|Select|Select a part or shape first.|Select a part or shape, then draw its motion path.|Select every {name} keyframe (Shift adds)|Select two or more parts to group them.|Send backward|Send shape backward|Send shape under the icon|Send under the icon|Send {name} backward|Send {name} under the icon|Sensor|Sequence|Sequence steps|Sequence steps (plays first to last)|Sequences that play it skip that step: {names}.|Set icon or svg, not both.|Set one of builtin, icon, emoji or svg.|Set one of from or svg.|Set one of icon, emoji or svg.|Set one of state, state_not, entity_on, above or below.|Shadow|Shadow and glow|Shadow color|Shadow presets|Shadow {name}|Shape|Shape mix|Shape over the icon|Shape points. Drag a point to move it.|Shape under the icon|Shape {n}|Shape {n}: {shape}|Shape {n}: {shape}, weight {weight}|Shapes over the icon|Shapes under the icon|Shortcut: {keys}|Show all|Show all hidden layers|Show in preview|Show {noun} ({keys})|Shuffle|Shuffle: new random paths|Simulation|Siren|Size|Size (px)|Skew|Skew X|Skew Y|Slows particles down over time.|Smallest|Smallest size|Smooth|Smooth all|Smoothing|Smoothing (s)|Snap grid|Snap to keyframes, the playhead and the grid (hold Shift to drag freely)|Snapping|Solo in preview|Solo in preview (hides the others, not saved)|Solo on|Some panels are hidden, as you left them. Use the arrows on the edges to show them.|Spaced evenly along the path, 1 to {particles}.|Spark|Spawn|Spawn child particles|Spawns {seconds} s after birth (set in YAML).|Speed|Speed (% of short side/s)|Spin per loop (deg)|Spins continuously, faster as the value rises (a fan).|Spiral|Split again|Split and start|Split back into shapes|Split icon|Split into {count, plural, one {# part} other {# parts}}|Split into {count, plural, one {# part} other {# parts}} (the first {parts})|Split into {count} parts|Split the icon to animate its shapes one by one: a bell's clapper, a fan's blades.|Splitting again replaces the parts, their groups and their keys.|Splitting…|Spread|Spread across|Spread down|Square|Stage height|Stagger children|Stagger off|Stagger on|Star|Start|Start again after the last step.|Start delay (s)|Start from a template|Start from an icon|Start handle|Started at x {x}, y {y}. Move the cursor and press Enter to finish. Escape cancels.|Starts at|State|State is|State is not|State is not {state_not}|State is {state}|State moved to position {to}.|State {count} added: {when}.|State {i}|State {i} deleted.|States|States (clips) are not exported: the file plays the animation’s own timeline.|Step animation|Step moved to position {to} of {count}.|Step moved to position {to} of {n}.|Step {count} added: {name}.|Step {index} deleted.|Step {index} is skipped|Step {index}: {from} to {to}|Step {i}|Step {i} is locked. Unlock it in Layers.|Steps|Steps jump between values; there is no curve to edit.|Stop drawing|Straight|Straighten all|Streak|Stroke|Stroke color|Stroke width (icon units)|Sun|Swaps the preset for your own particles: shape, movement, size and colors become editable.|Swirl|Switch|Switch at once|Tap|Target|Text|Text and icon color|That animation has states of its own: the card skips this state.|That layer is locked. Unlock it in Layers.|The SMIL fallback plays the animation forwards only.|The SVG draws nothing.|The SVG has no shapes to draw.|The SVG has too many shapes; at most {room} fit.|The SVG is larger than 32 KB.|The SVG is too complex.|The YAML is too large to import (over 1 MB).|The animation is larger than {size} KB.|The animation is not valid: {message}|The animation library is not connected.|The animation would be larger than {max} KB ({size} KB).|The animation's easing ({easingLabel})|The animation's keyframes move the element.|The animation's keyframes move the icon.|The animation's keyframes move the module's icon.|The animation's keyframes move the whole element.|The box of the card's icon or of its text.|The color is not a valid CSS color: the file uses currentColor.|The drawing tools are not loaded yet.|The drawing tools are ready.|The drawing tools on this page are from another Magic Card version. Reload the page to draw here.|The entity color button uses the animation color (the card entry's color, else the entity's).|The entity’s value drives {name}. Preview it with the value slider on the stage.|The file could not be read.|The file is {size} KB, larger than 256 KB.|The file loops: the repeat count is not exported.|The first state that matches plays; with no match (or an unavailable entity) the own timeline plays. The entity is the module’s, or the one set on the animation in the card.|The icon at rest, without animation. Ids stay on each part and shape.|The icon has no shapes to export.|The icon has {count} shapes: the first {parts} became parts (the most a rig holds), the rest stay at rest.|The icon is split into its parts. Select a part, then give it a preset: swing, spin, draw on and more.|The icon library could not be loaded. Check your connection, then try again.|The import and export tool could not be loaded. Reload the page and try again.|The layers panel is hidden, as you collapsed it before. Use the arrow on the edge to show it.|The library holds at most {cap} animations: only {fit} more fit, {skipped} were not imported.|The library is full ({cap} animations): nothing was imported.|The line draws in over the cycle.|The look changes a little.|The loop hit the size limit, so the file shows fewer particles.|The module's icon moves along the path.|The motion runs back to the start along the path.|The new animation \"{name}\" was not saved last time.|The outline draws in over the cycle, then the shape fills.|The outline is traced, then the part fills in.|The particle engine is not loaded yet.|The parts come from the document's own SVG, one part per shape.|The path draws nothing.|The path has the most points it can hold.|The point it scales and turns around.|The point the group rotates and scales around, in icon units. Drag it on the stage.|The point the part rotates and scales around, in icon units. Drag it on the stage.|The point the preset turns this group around, in icon units. It wins over the group's own pivot. Drag it on the stage.|The point the preset turns this part around, in icon units. It wins over the part's own pivot. Drag it on the stage.|The preset becomes your own animation to edit: motion presets as keyframes, particle and ring presets with their settings.|The preview is scaled to fit the stage|The preview plays on a real magic-card. Load magic-card.js (your dashboard resource) before the animation studio.|The rig holds the most shapes it can (48).|The same seed gives the same loop every time.|The selected keyframes use different easings; a choice here sets all of them.|The shape as a mask|The shape turns with the direction it travels.|The studio works out every particle's path once and plays it as a loop. Light on dashboards.|The timeline also animates the draw here: while it plays, it wins over this binding.|The timeline also animates the opacity here: while it plays, its opacity wins over this binding.|The timeline also animates this color: while it plays, its color wins over this binding.|The timeline skews this target: while it plays, the skew replaces this binding’s movement.|The whole element moves along the path from where it rests.|The {noun} panel is hidden, as you left it. Use the arrow on the edge to show it.|These apply to every emitter. Placement is set per emitter.|They replace the preset's look.|This animation|This animation already has 24 animated targets: remove one to add a preset.|This animation has {tracks} animated targets, the most it can hold. Remove one to animate this part.|This card plays engine {engine}; update Magic Card to play this animation.|This icon could not be loaded. Check the icon id, or try again when Home Assistant is reachable.|This icon has no shapes to animate.|This icon has no shapes to split.|This is the lane's last key: no segment follows it, so its easing has no effect.|This is the last keyframe: no segment follows it, so its easing has no effect.|This keyframe sets no property. Add one with Add property.|This loop hit the size limit, so it shows fewer particles. Lower the count or the child particles.|This loop is large, so it takes longer to load on wall tablets. Lower the count or the child particles.|This part has its own draw keys on the timeline.|This preset could not be opened: {message}|This preset is not available in this version of Magic Card.|Timeline|Timeline view|Timer|Timing|To|To color|Tool: {tool}|Top|Top left|Top right|To{unit}|Tracks (combined, no order)|Tracks of card parts (name, state, background) are not exported.|Transition|Triangle|Trimmed|Try again|Turbulence|Turn|Turn collider off|Turn collider on|Turn fade off|Turn fade on|Turn on a collider first.|Turn the subject to face the direction of travel.|Turn with the path|Turns to an angle (a needle or a dial).|Unavailable|Under the icon|Undo (Ctrl+Z)|Unexpected element <{element}>.|Ungroup|Units|Unknown preset|Unknown preset. This step is skipped.|Unknown preset: plays nothing.|Unlock|Unlocked|Unsaved changes|Unsupported version (expected 1).|Untitled animation|Up to {parentsLeft} for this emitter. All emitters share {parents} particles.|Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).|Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).|Use Own timeline to play this animation.|Use a color or a gradient.|Use a preset name, cubic-bezier(x1, y1, x2, y2) or steps(n).|Use an icon id like mdi:bell-ring.|Use as icon|Use baked loop|Use currentColor|Use filter functions like brightness(1.2) hue-rotate(30deg); url() is not allowed.|Use in card|Use keywords, lengths or percentages, e.g. \"50% 100%\".|Use live simulation|Use the parent's colors|Use up to 8 characters.|Use {emoji}|Used by {count, plural, one {# card} other {# cards}}|Vacuum|Value|Value above|Value above {above}|Value below|Value below {below}|Value bindings|Value bindings are not exported: the file plays at the drawn values.|Valve|Variation|Wave|Weather|Weight|What moves|What to save|When|Whole keyframe|Wind angle (deg)|With reduced motion the card shows its still state: this animation does not play.|X|Y|Zigzag|Zone|Zoom in|Zoom in (Ctrl +)|Zoom out|Zoom out (Ctrl -)|Zoomed to the icon while you edit its parts or draw|after {seconds}|after {seconds} s|animated|at end of life|at {angle}°|behind the content|child size|child speed|color_mix needs two colors.|custom:{id}|down|down left|down right|drag {value}|drawing area|draws on|emoji|hidden because another layer is soloed|hidden because {name} is hidden|hidden in the preview|in front of the content|inspector|keyframe|keyframe track|keyframe tracks of {name}|layers|left|lifetime|live|locked|locked because the layer it belongs to is locked|loops|my animations|not on the {tile} tile|not valid|on|on collision|opacity|over the icon|plays once|right|selected|speed|spin|start delay|state|step {i} of {count}|step {i} of {count}, {problem}|the background|the element|the icon|the name|the state|turbulence {value}|under the icon|units|unknown error|up|up left|up right|{animation} (unknown)|{below} hidden|{below} hidden below|{count, plural, one {# dot} other {# dots}}|{count, plural, one {# icon} other {# icons}}|{count, plural, one {# keyframe} other {# keyframes}}|{count, plural, one {# keyframe} other {# keyframes}} copied|{count, plural, one {# keyframe} other {# keyframes}} deleted|{count, plural, one {# keyframe} other {# keyframes}} pasted at {at}{skipped}|{count, plural, one {# keyframe} other {# keyframes}} selected.|{count, plural, one {# key} other {# keys}}|{count, plural, one {# key} other {# keys}} on the timeline. Rotate, move, scale, fade and color this part there.|{count, plural, one {# particle} other {# particles}} · {flow}|{count, plural, one {# point} other {# points}}|{count, plural, one {# shape} other {# shapes}}|{count, plural, one {# shape} other {# shapes}}, scaled into the icon|{count, plural, one {# step} other {# steps}}|{count, plural, one {# {shape}} other {# {shape}s}} {trigger}|{count, plural, one {{names} is not on the {tile} tile. Switch the preview tile to Card to see it.} other {{names} are not on the {tile} tile. Switch the preview tile to Card to see them.}}|{count} keyframes|{count} of {colours}|{count} parts|{count} shapes|{count} targets|{count} targets selected: a preset plays on each (Wave: one after another).|{from} to {to}{unit}|{id} (not found)|{id}: the library is full|{kb} of 32 KB|{key} moves one handle alone.|{key} removes it.|{kind} cannot play in a sequence. This step is skipped.|{label} (the animation moves it)|{label} (the animation moves it) · not on the {tile} tile|{label} at {at}|{label} at {at} · {value}|{label} easing to the next key|{label} is not on the {tile} tile|{label} lane|{label} preset|{label} tool. {hint}|{label} · not on the {tile} tile|{lane} keyframe|{list}, bounce {bounce}|{min}–{max} px|{names} share this curve.|{name} (copy {n})|{name} (copy)|{name} added, {count} points.|{name} added.|{name} animation|{name} copy|{name} hidden in the preview|{name} is locked. Unlock it in Layers.|{name} is now step {to} of {count}|{name} is now {where}.|{name} keyframes|{name} locked|{name} moved behind the content|{name} moved in front of the content|{name} moved {direction}|{name} moved {direction}, position {position} of {count}|{name} moved {where}|{name} no longer soloed|{name} settings|{name} shown in the preview|{name} soloed in the preview|{name} unlocked|{name}, behind the content|{name}, in front of the content|{name}: {count, plural, one {# key} other {# keys}}|{now} of {total} seconds|{panels} hidden|{panels} shown|{particles} particles · {emitters} emitters|{pct} % of the input range|{pct}, {seconds} seconds|{preset} on {targets}|{seconds} s loop|{size} KB|{size} icon units|{steps}, {total} per cycle, {loop}{skipped}.|{target} keyframe|{target} {lane} keyframe|{target} · at {at} · {secs} s|{where} · {from} to {to}",'"{name}" heeft wijzigingen die nog niet zijn opgeslagen.|"{name}" had de vorige keer wijzigingen die niet zijn opgeslagen.|% van de grootte|(prefers-reduced-motion: reduce)|, groot|, geen pictogram|, {count} overgeslagen|. Tekst, pictogrammen en achtergrond van de kaart.|0 trekt omlaag, 90 naar links, 180 omhoog, 270 naar rechts.|0 stopt bij de botsing, 1 kaatst terug op volle snelheid.|30 fps|; {skipped} overgeslagen (niet voor dit doel of deze baan)|Een ingebakken lus houdt levensduren binnen één lus.|Een clip kan zijn eigen document niet afspelen (gebruik self).|Een SVG-bestand van de animatie dat zich herhaalt|Een SVG-bestand van de ingebakken deeltjes dat zich herhaalt|Een rig heeft hooguit {groups} groepen.|Een reeks kan zichzelf niet afspelen.|Een reeks heeft hooguit {steps} stappen.|Een reeks duurt zo lang als haar stappen. Kaarten kunnen haar nog schalen met hun Duur.|Een reeks heeft minstens één stap nodig|Ongeveer {percent}% van de deeltjes|Een keyframe toevoegen op de afspeelkop|Een eigenschap toevoegen aan {target}|Voeg een vorm toe om vormen te mengen. Elke vorm krijgt een gewicht.|Een {name}-keyframe toevoegen op de afspeelkop|Toevoegen als vormen|Kleur toevoegen|Emitter toevoegen|Keyframe toevoegen|Bewegingspad toevoegen|Punt toevoegen|Eigenschap toevoegen|Eigenschap toevoegen aan {target} op de afspeelkop ({at})|Vorm toevoegen|Status toevoegen|Stap toevoegen|Voeg de animaties toe die na elkaar worden afgespeeld.|Voeg de tekening toe als vormen over het pictogram, of gebruik haar als het pictogram zelf.|Waardekoppeling toevoegen|{lane}-keyframe toevoegen|{name}-keyframe toevoegen op de afspeelkop|Voegt willekeurige wervelingen toe aan de beweging.|Alarmpaneel|Alle|Alle domeinen|Alle lagen getoond|Alle lagen getoond. Vergrendelingen blijven behouden.|Alle deeltjes|Staat al onderaan|Staat al bovenaan|Ook op {at}|Alt+pijl-omlaag|Alt+pijl-omhoog|Alt+omlaag|Alt+omhoog|Afwisselend|Afwisselend omgekeerd|Een open lijn wordt getekend met haar lijn.|Ankerpunten|Hoek|Hoek (gr.)|De onderdelen van een pictogram animeren|Geanimeerde SVG|Geanimeerde SVG gekopieerd|Animatie|Animatiekleur|Animatie-instellingen (Esc)|Animatiestudio|Een andere track animeert dit doel al.|Boog|Met de pijltjestoetsen verplaats je de cursor, Enter zet punten, Escape annuleert.|Pijltjes verplaatsen het keyframe, Alt en pijltjes gaan naar het volgende, Delete verwijdert het.|Aan het einde van de levensduur|Hooguit {cLIPS_MAX} statussen.|Hooguit {colours} kleuren|Hooguit {count} vormen passen in een rig.|Hooguit {emitters} emitters.|Hooguit {mAX_SHAPES} vormen|Hooguit {max} animaties.|Hooguit {max} koppelingen per animatie.|Hooguit {max} tekens.|Hooguit {max} items.|Hooguit {max} deeltjes over alle emitters.|Hooguit {shapes} vormen passen in een rig.|Hooguit {steps} stappen|Hooguit {tracks} geanimeerde doelen.|Op de afspeelkop: {filter}|Op de afspeelkop: {text}|Op {at} · {secs} s|Attribuut|Attribuutnamen gebruiken letters, cijfers, _ . en - (geen spaties).|Attribuutnamen gebruiken letters, cijfers, _ . en -.|Achtergrond|Ingebakken lus|Bezig met inbakken…|Gebaseerd op een ingebouwde {kind}|Achter de inhoud|Tussen {min} en {max}; leeg gebruikt {intensity}. Timing en kleur komen uit de animatie-instellingen.|Binaire sensor|Koppeling toegevoegd: {property}.|Koppeling verwijderd.|Koppeling {n}|Zwart in een <img>, de tekstkleur inline.|Lege keyframes|Lege deeltjes|Leeg pad|Lege reeks|Vloeit van de eerste kleur naar de tweede.|Vervagen|Vervaging heeft een eigen baan en wordt aan deze lijst toegevoegd.|Onder|Linksonder|Rechtsonder|Stuiteren|Verhelderen|Naar voren halen|Over het pictogram halen|Vorm naar voren halen|Vorm over het pictogram halen|{name} naar voren halen|{name} over het pictogram halen|Browsers spelen de CSS-keyframes af.|Browsers spelen de CSS-keyframes af; de SMIL-kopie speelt waar CSS-animatie ontbreekt.|Bouw er een vanaf nul of pas een van de voorinstellingen aan. Opgeslagen animaties staan in de animatiekiezer van elke kaart, onder Mijn animaties.|Uitbarsting|Knop|Agenda|Camera|Annuleren|Kan niet afspelen|Kaart|Kaart-YAML gekopieerd: plak hem in een module|Kaart-YAML om te kopiëren|Kaartinhoud|Kaartinhoud. Tekst, pictogrammen en achtergrond van de kaart.|Kaartonderdelen|Kaartthema|Kaarten die hem gebruiken, spelen hem niet meer af, tenzij ze een kopie insluiten.|Kaarten gebruiken hem als|Plafond|Midden|Aantal wijzigen|Vulling wijzigen|Puntsoort wijzigen|Snelheid wijzigen|Spreiding wijzigen|Lijn wijzigen|Gewicht wijzigen|Wijzigt ook de laatste lijn. De stippellijn is wat je tekende.|Kleur van kind|Kinddeeltjes|Kinddeeltjes van {name}|Kindvorm|Kinderen barsten uit vanaf het punt waar ze ontstaan.|Kinderen kunnen geen eigen kinderen hebben.|Kies een voorinstelling|Kies een .svg-bestand.|Kies een andere|Bestand kiezen|Cirkel|Pad wissen|Zoekopdracht wissen|Klik op een onderdeel om het op de tijdlijn te animeren. Shift of Ctrl voegt toe aan de selectie; dubbelklik of F2 hernoemt. H verbergt, S solo, L vergrendelt (alleen voorbeeld).|Klik op een vorm om hem te selecteren, sleep om hem te verplaatsen.|Klik of sleep over vormen om ze te verwijderen.|Klik op het canvas om een punt toe te voegen, klik op de lijn om er een in te voegen.|Klik om punten toe te voegen, sleep voor bochten. Klik op het eerste punt om te sluiten, of kies Pad afronden.|Klik om het volgende punt toe te voegen|Klik om het eerste punt te plaatsen|Klimaat|Sluiten|Pad sluiten|Gesloten|Gesloten pad|Samenvoegen|{name} inklappen|Botsen met|Botsingen|Kleur|Kleurmenging|Kleur {i}|Kleur {n}|Kleur {n}: entiteitskleur|Kleur {n}: {colour}|Kleur: currentColor|Kleuren|Veelgebruikte emoji|Klaar op|Bevat een link.|Bevat een element dat iets uitvoert of ophaalt.|Bevat een gebeurtenis-handler.|Bevat een externe verwijzing.|Inhoudsvak|Zet het voorinstel om naar eigen deeltjes om het te exporteren.|Omzetten naar eigen deeltjes|Kopieert pictogram: svg en de SVG als kaart-YAML|Kopiëren|Kopiëren (Ctrl+C)|SVG kopiëren|Kopiëren mislukt: selecteer de tekst hieronder en kopieer hem|Keyframes kopiëren|Kopieer eerst keyframes|Hoekstraal|Hoekradius (pictogrameenheden)|De tekengereedschappen konden niet worden geladen.|Aantal|Aantal per keer|Bedekkend|Overvloeien|Ctrl + scrollwiel zoomt|Ctrl+G|Ctrl+Shift+G|Cursor op x {x}, y {y}. Druk op Enter om een punt toe te voegen.|Cursor op x {x}, y {y}. Druk op Enter om af te ronden.|Cursor op x {x}, y {y}. Druk op Enter om te beginnen.|Gebogen|Aangepast|Eigen as ({axis})|Eigen curve|Eigen status|Een voorinstelling aanpassen|Een voorinstelling aanpassen…|Een van de {count} aanpassen|Knippen|Cyclus|Donkere kaart|Standaard|Standaard ({inherited})|Vertraging|Vertraging tussen kinderen|De vertraging telt vanaf het einde van de vorige stap. Een lege duur gebruikt die van de animatie zelf ({seconds} s).|De vertraging telt vanaf het einde van de vorige stap. Een lege duur gebruikt die van de animatie zelf.|Verwijderen|"{name}" verwijderen?|Verwijderen (Del)|Koppeling verwijderen|Koppeling {n} verwijderen|Handvat verwijderen|Keyframe verwijderen|Keyframes verwijderen|Punt verwijderen|Punten verwijderen|Vorm verwijderen|Status verwijderen|Status {i} verwijderen|Stap verwijderen|Stap {i} verwijderen|{count} keyframes verwijderen|{name} verwijderen|"{name}" verwijderd.|Verwijderen mislukt: {message}|Detail|Apparaattracker|Richting|Verwerpen|Domein|Deurbel|Stip|Dubbelklik op een punt om het glad of een hoekpunt te maken.|.svg downloaden|Download gestart|Slepen|Sleep een ervan op de tijdlijn, of gebruik de pijltjestoetsen, om ze samen te verplaatsen.|Sleep punten en handvatten.|Sleep om een lijn te tekenen.|Sleep om te tekenen. Shift: cirkel, Alt: vanuit het midden.|Sleep om te tekenen. Shift: vierkant, Alt: vanuit het midden.|Sleep om te verplaatsen (klikt vast; Shift: vrij, Alt: dupliceren). Ctrl-klik voegt een key toe, Shift-klik selecteert een bereik. Pijltjes verplaatsen, Alt en pijltjes gaan naar de volgende key, Delete verwijdert.|Sleep om te herschikken (Alt+omhoog / Alt+omlaag)|Sleep om het canvas te vergroten of verkleinen (dubbelklik: herstellen)|Sleep, of druk op Alt+omhoog of Alt+omlaag, om de stap te verplaatsen.|Tekenen|Teken vrij; de lijn wordt gladgestreken als je loslaat.|Bewegingspad tekenen|Tekenen uit|Tekenen aan|Teken op het canvas waar de vorm langs gaat, beginnend waar hij rust.|Teken het pad dat het geselecteerde onderdeel volgt, beginnend waar het rust.|Tekenen is alleen voor pictogramonderdelen en vormen.|Tekening|Tekenen geannuleerd.|Tekengereedschap|Getekend|Tekent de lijn bij (een batterij of niveau).|Drift|Stuur {name} aan met de waarde van de entiteit: draaisnelheid vanuit het percentage van een ventilator, een vulling vanuit een batterijniveau.|Zet hier een .svg-bestand neer|Slagschaduw|Laat de .svg los om te importeren|Dupliceren|Emitter dupliceren|Dubbele id "{id}".|{count, plural, one {Keyframe} other {Keyframes}} dupliceren|{name} dupliceren|Gedupliceerd als "{name}".|Dupliceren mislukt: {message}|Duur|Elk deeltje kiest een snelheid in dit bereik, gemeten in % van de kortste zijde van de kaart per seconde. Bij 100 steekt een deeltje een vierkante kaart in één seconde over.|Elk deeltje draait de kant die het kiest, naar links of rechts.|Versnelling|Versoepeling naar het volgende keyframe|Versoepelingswaarde|De versoepeling van het keyframe bewerken|Effectvoorinstellingen kunnen niet als status afspelen: speelt niets.|Effecten met een eigen laag kunnen niet in een reeks afspelen. Deze stap wordt overgeslagen.|Element|Ellips|Naam van emitter|Emitters|Emoji|Emoji of symbool|Leeg keyframe|Leeg leest de status. Bijvoorbeeld percentage (ventilator) of helderheid (lamp).|Eindhandvat|Solo beëindigen|Voer een emoji of symbool in.|Entiteitskleur|Entiteit is uit|Entiteit is aan|Entiteitswaarde|Wissen|Vorm wissen|Vormen wissen|Gebeurtenis|Uitvouwen|{name} uitklappen|Ontploffen en vallen|Exporteren|Alles exporteren|Animaties exporteren|{name} exporteren|In- en uitfaden|Uitfaden en weer infaden (0,2 s)|Fadet in met de waarde.|Vallen|Ventilator|Acht|Vullen|Vulkleur|Filter|Voorinstellingen filteren|Cyclus afmaken|Pad afronden|Vuurvliegjes|Cyclus passend maken|De hele cyclus passend maken|Herstel eerst de gemarkeerde velden.|Plat|Plat (Z)|Omslaan (X)|Zijwaarts kantelen (Y)|Vloer|Stroom|Een getekend pad volgen|Een pad volgen|Rotatie volgen|Het pad volgen|Eén naar voren|Fontein|Uit de vrije hand|Van|Van een voorinstelling|Van kleur|Van{unit}|Voordeur|Gloed|Begrepen|Zwaartekracht|Richting van de zwaartekracht|Zwaartekracht {strength} {direction}|Grijstinten|Raster|Groep|Groep van {count, plural, one {# onderdeel} other {# onderdelen}}|Draaipunt van groep|Groep verwijderd|{count} onderdelen gegroepeerd|Groepen verwijderd|Groeit met de waarde.|Bevat fouten|Hart|Verbergen en solo zijn niet beschikbaar: het deeltjesvoorbeeld kon niet worden opgebouwd.|Verbergen in voorbeeld|Verbergen in voorbeeld (niet opgeslagen)|Verbergen in voorbeeld: de laag blijft op zijn normale waarde|Verberg {noun} ({keys})|Verbergen, solo en vergrendelen werken alleen in dit voorbeeld.|Hoogste {noun}|Tintverschuiving|Luchtbevochtiger|Pictogram|Pictogram- en emoji-deeltjes worden als stippen geëxporteerd.|Pictogramanimatie|Pictogramanimatie…|Pictogram beweegt alleen het pictogram van de module. Kaarten kunnen het overschrijven.|Pictogramonderdelen|Pictogramonderdelen op het canvas|Pictogram om te splitsen|Pictogram {percent}%|Pictogrammen, emoji of vormen die vallen, stijgen of uitbarsten|Importeren|SVG importeren|Animaties importeren|Vorm importeren|Vormen importeren|{count, plural, one {# animatie} other {# animaties}} geïmporteerd.|Voor de inhoud|Ervoor: deeltjes worden over tekst en pictogrammen getekend. Ze blokkeren nooit klikken.|In-uit|Oneindig|Inspecteur|Inspectorpaneel|Wordt gebruikt door {count, plural, one {# kaart} other {# kaarten}}; die spelen hem niet meer af, tenzij ze een kopie insluiten.|Draait mee met de richting waarin het beweegt.|Verder bewerken|Keyframe|Keyframe-inspecteur|Keyframe-tijdlijn|Keyframe-gereedschap|Keyframes|Keys|Soort|Grootste|Grootste afmeting|Grasmaaier|Laag|Laagacties|Laagacties, {name}|Laagnaam|Lagen|Lagen verborgen in het voorbeeld|Lagenpaneel|Links|Linkerrand|Laat eerst de huidige cyclus eindigen|Bibliotheek|Levensduur (s)|Optillen|Licht|Lichte kaart|Lijn|Lijneinden|Live simulatie|Live simulatie wordt als zijn ingebakken lus geëxporteerd.|Live simulatie draait op elk dashboard dat deze kaart toont en gebruikt meer processor, vooral op wandtablets. De export als geanimeerde SVG speelt in plaats daarvan de ingebakken lus af.|Woonkamer|Pictogrambibliotheek laden…|De {kind}-editor laden…|Laden…|Vergrendelen|Vergrendeld|Vergrendeld. Ontgrendel om te bewerken.|Uiterlijk|Herhalen|Lus uit|Lus aan|Lussnelheid (×)|Lussen|Laagste {noun}|Magic Card is niet geladen op deze pagina|Max|Maximaliseren|Mediaspeler|Onderdelen samenvoegen|Min|Min en max moeten verschillen.|Min mag niet boven max liggen.|Gemengd|Modus|Meer voorinstellingen konden niet laden. De ingebouwde voorinstellingen werken nog.|Meer afvlakken: minder punten en een rustiger lijn.|Meer afvlakken: minder punten en een rustiger lijn. De stippellijn is wat je tekende.|Beweging|Bewegingspad|Bewegingspad. Klik om punten toe te voegen, sleep om ze te verplaatsen.|Bewegingspad: selecteer eerst een onderdeel of vorm|Beweging verwijderd|X verplaatsen|Y verplaatsen|Ga eerst weg van het beginpunt.|Omlaag|Omlaag verplaatsen (eronder getekend)|Omlaag verplaatsen (speelt later)|Emitter achter de inhoud zetten|Emitter omlaag verplaatsen|Emitter voor de inhoud zetten|Emitter omhoog verplaatsen|Handvat verplaatsen|Keyframe verplaatsen|Pad verplaatsen|Padpunt verplaatsen|Draaipunt verplaatsen|Punt verplaatsen|Punten verplaatsen|Status {i} omlaag verplaatsen|Status {i} omhoog verplaatsen|Stap verplaatsen|Stap {i} verplaatsen|Verplaats in plaats daarvan het element|Verplaats in plaats daarvan het pictogram|Omhoog|Omhoog verplaatsen (bovenop getekend)|Omhoog verplaatsen (speelt eerder)|Venster verplaatsen|{count, plural, one {Keyframe} other {Keyframes}} verplaatsen|{name} omlaag verplaatsen|{name} omlaag verplaatsen (eronder getekend)|{name} omlaag verplaatsen (speelt later)|{name} omhoog verplaatsen (bovenop getekend)|{name} omhoog verplaatsen (speelt eerder)|{name} {where} verplaatsen|{where} verplaatsen|Verplaats, schaal, draai en kleur op een tijdlijn|Omlaag verplaatst: eronder getekend|Omhoog verplaatst: bovenop getekend|Beweging|Bewegingen|Beweegt mee met: {subject}|Beweegt zijwaarts.|Beweegt het onderdeel langs een curve, vanaf zijn rustpositie. Sleep de punten op het canvas.|Beweegt omhoog of omlaag.|{target} verplaatsen.|Moet 1-16 tekens uit a-z, 0-9 en - zijn, en uniek.|Moet SVG-opmaak zijn.|Moet [min, max] px zijn tussen 1 en 200, min ≤ max.|Moet [min, max] zijn.|Moet een lijst zijn.|Moet een bewegingsvoorinstelling of een eigen keyframes- of padanimatie zijn.|Moet een getal zijn.|Moet een paar [van, naar] zijn.|Moet een deeltjes-, ring- of scènevoorinstelling zijn.|Moet een status (tekst) zijn.|Moet een subpad-index zijn (een geheel getal vanaf 0).|Moet een geheel getal zijn.|Moet een attribuutnaam zijn.|Moet een pictogram-id zijn zoals mdi:bell.|Moet een pictogram-id zijn zoals mdi:star.|Moet een object zijn.|Moet tussen 0 en 100% liggen.|Moet tussen {min} en {max} {unit} liggen.|Moet tussen {min} en {max} liggen.|Moet element, icon, name, state, background, part:<id>, group:<id> of shape:<id> zijn.|Moet een van deze zijn: {options}.|Moet self, none, een voorinstelling of custom:<id> zijn.|Moet tekst van hooguit 40 tekens zijn.|Moet tekst zijn.|Moet drie getallen [x, y, z] zijn, niet allemaal 0.|Moet waar of onwaar zijn.|Moet twee getallen zijn (kleuren alleen voor color_mix).|Moet twee getallen [x, y] zijn.|Moet hooguit 8 tekens zijn (een emoji of een symbool).|Moet afwijken van min.|Mijn animaties|Naam|Naam van {name}|Heeft minstens één item nodig.|Heeft minstens {min} items nodig.|Negatief blaast de regen naar links, positief naar rechts. Het bepaalt de richting van de zwaartekracht.|Nieuw|Nieuwe animatie|Nieuwe keyframes|Nieuwe deeltjes|Nieuw pad|Nieuwe reeks|Nieuwe vormen|Volgend keyframe|Geen <svg>-element gevonden.|Geen animatie|Geen animatie komt overeen met “{query}”.|Geen animaties gevonden.|Geen animaties komen overeen met "{query}".|Geen animaties komen overeen.|Nog geen animaties|Geen kleuren: deeltjes gebruiken de animatiekleur.|Geen vrije deeltjes meer. Verlaag een aantal om een emitter toe te voegen.|Geen zwaartekracht|Geen pictogramanimaties komen overeen met "{query}".|Nog geen keyframes: gebruik Eigenschap toevoegen, of dubbelklik op de baan.|Nog geen keys. Voeg keys toe op de tijdlijn om dit onderdeel te draaien, verplaatsen, schalen, te laten vervagen of te kleuren.|Nog geen bewegingspad. Teken er een op het canvas.|Geen voorinstellingen komen overeen met "{query}".|Nog geen eigenschappen geanimeerd. Gebruik Eigenschap toevoegen, of dubbelklik op een baan.|Nog geen vormen: kies een tekengereedschap.|Nog geen stappen|Nog geen stappen. Voeg een clip toe om de reeks te beginnen.|Geen {kind} "{id}" in de rig.|Geen|Niet ingesteld: de deeltjes nemen de animatiekleur.|Normaal|Geen onderdeel van deze rig.|Geen tijdlijnbaan.|Geen geldige animatie-id.|Geen geldige kleur.|Geen geldige versoepeling.|Geen toegestane schaduw: x y vervaging spreiding kleur.|Geen toegestane {kind}-waarde.|Niet gewijzigd: {big}|Niet gevonden|Niet gevonden in Mijn animaties. Deze stap wordt overgeslagen.|Niet geïmporteerd: {list}.|Niet in je animaties: speelt niets tot hij daar is opgeslagen.|Niet op deze tegel|Niet hernoemd: {message}|Niet te serialiseren.|Niet gebruikt|Geen geldige YAML.|Geen geldige paddata (moet met M beginnen).|Niets|Niets (stoppen)|Er wordt niets getekend.|Niets geplakt: die eigenschappen passen hier niet|Er speelt nog niets.|Er is nog niets om te exporteren.|Hier valt nog niets in te stellen.|Getal|Uit|Aan|Bij botsing|Aan betekent actief voor het domein (open, thuis, speelt...).|Eén klik animeert de selectie; stem de keys af op de tijdlijn.|Onion skin|Onion skin: markeer de keyframes rond de afspeelkop|Alleen voor het activeringsmoment.|Alleen keyframe-animaties exporteren als geanimeerde SVG.|Alleen deze eigenschap. Standaard volgt de versoepeling van het keyframe (de animatieversoepeling).|Alleen deze eigenschap. Standaard volgt de versoepeling van het keyframe.|Dekking|Dekking (%)|Openen|Open een deeltjesanimatie om de deeltjes te ontwerpen.|Pad openen|Of begin met de pictogrambibliotheek|Baan|Oorsprong|Uitvoer|Over het pictogram|Eigen SVG|Eigen kinderkleur|Eigen tijdlijn|Verf|Onderdeel|Onderdeelacties|Deel van {pieces} vormen|Draaipunt van onderdeel|Onderdeelvoorinstellingen|Onderdeel {i}|Onderdeel {n}|Deeltjes- en reeksanimaties kunnen niet als status afspelen.|Deeltjespictogram|Deeltjeslagen|Deeltjesvoorinstelling|Deeltjessnelheid (% van korte zijde/s)|Deeltjes|Deeltjes langs een pad kunnen niet in een reeks afspelen. Deze stap wordt overgeslagen.|Deeltjes verschijnen en verdwijnen zacht.|Deeltjes spelen op het hele element.|Deeltjes nemen om beurten de kleuren. Kies er een om hem te wijzigen.|Deeltjes volgen het pad na elkaar, over het hele element.|Deeltjes {n}|Onderdelen samengevoegd|Plakken op de afspeelkop in {target} (Ctrl+V)|Keyframes plakken op de afspeelkop|Plak eerst YAML of laad het.|Plak de opmaak van een <svg>.|Pad|Padlagen|Padlagen (geen stapelvolgorde)|Alleen paden en vormen: scripts, stijlen en links worden verwijderd. De vorm wordt gevuld met de deeltjeskleur.|Pauzeren (spatie)|Voorbeeld pauzeren|Pen|Pen. Klik om punten toe te voegen, klik op het eerste punt om te sluiten.|Persoon|Fysica|Kies een animatie voor deze stap.|Kies een pictogram, of typ een id zoals mdi:bell-ring.|Draaipunt|Draaipunt van {name}|Draaipunt op het vak van de groep|Draaipunt op het vak van het onderdeel|Draaipunt: {position}|Pixels|Plaatsing|Plant|Afspelen|Afspelen (spatie)|Animaties na elkaar afspelen|Speel de kolommen van een rij of de modules van een kolom na elkaar af.|Afspeelvolgorde|Voorbeeld afspelen|Speel per status van de entiteit iets anders af: een lamp die gloeit als hij aan is en rust als hij uit is. De entiteit is die van de module, of die welke op de animatie in de kaart is ingesteld.|Afspelen|Afspeelsnelheid|Afspeelkop|Speelt|Speelt bij tikken|Speelt deze animatie sneller of langzamer af.|Punt {count} geplaatst. Nogmaals Enter op dezelfde plek rondt de lijn af.|Punten staan in % van het bewegende element, dus het pad schaalt mee.|Punten staan in pixels, bij elke grootte hetzelfde.|Punten springen naar nabije punten van het pictogram en andere vormen.|Punten komen op hele pictogrameenheden. Houd Shift ingedrukt om vrij te plaatsen.|Punten klikken vast op een raster van 10 px. Houd {key} ingedrukt om vrij te plaatsen.|Punten klikken vast op een raster van 5%. Houd {key} ingedrukt om vrij te plaatsen.|Positie|Positie in de cyclus|Voorinstelling|Draaipunt van voorinstelling|Draaipunt van voorinstelling van {name}|Voorbeeld|Voorbeeldentiteit|Voorbeeld verbergt {count, plural, one {# laag} other {# lagen}}|Voorbeeldstatus|Voorbeeldtegel|Voorbeeldwaarde|Voorbeeld met verminderde beweging|Vorig keyframe|Eigenschap|Eigenschapskeys krijgen hun eigen versoepeling; hele keyframes bepalen de versoepeling van het keyframe.|Straal|Regen|Rechthoek|Opnieuw (Ctrl+Y)|Opnieuw tekenen|Verminderde beweging|Verminderde beweging staat aan, dus het voorbeeld blijft stil.|Pagina opnieuw laden|Door de pagina te herladen gaan wijzigingen verloren die niet zijn opgeslagen. Toch herladen?|Verwijderen|Kleur verwijderen|Kleur {i} verwijderen|Kleur {n} verwijderen|Intekenen verwijderen|Emitter verwijderen|Vulling verwijderen|Uit dit keyframe verwijderen|Beweging verwijderen|Bewegingspad verwijderen|Vorm verwijderen|Vorm {n} verwijderen|Lijn verwijderen|De animatie van dit onderdeel verwijderen|{name} uit dit keyframe verwijderen|Hernoemen|Groep hernoemen|Onderdeel hernoemen|{name} hernoemen|Hernoemd|Hernoemd naar "{clean}".|Hernoemen mislukt: {message}|Herhalen|Aantal herhalingen|Het pad vervangen door een {name}|Vervangen door…|{count} onderdelen vervangen|Verplicht.|Draaipunt herstellen|Herstellen naar draaipunt van groep|Herstellen naar draaipunt van onderdeel|Venstergrootte wijzigen|Oorspronkelijke grootte|Niet-opgeslagen wijzigingen herstellen|Niet-opgeslagen wijzigingen herstellen?|Omgekeerd|Richting omkeren|Rechts|Rechterrand|Ring|Ringvoorinstelling|Stijgen|Draaien|Rotatie|Draaisnelheid|Rond|Liniaal in procenten van de cyclus of in seconden|Liniaal in procenten; toon seconden|Liniaal in seconden; toon procenten|SMIL-terugval|SVG|SVG gekopieerd|SVG-vorm|SVG om te kopiëren|Opslaan|Opslaan (Ctrl+S)|Opslaan als geanimeerde SVG|Opslaan als pictogram|Je wijzigingen opslaan?|"{name}" opgeslagen.|Opslaan mislukt.|Opslaan…|Schaal|Schaal X|Schaal Y|Scènevoorinstelling|Schema|Animaties zoeken|Pictogrammen zoeken|Voorinstellingen zoeken|De pictogrambibliotheek doorzoeken|Seizoensscène|Seconden|Startwaarde|Seed {seed} · draai {span}|Kiezen|Selecteer eerst een onderdeel of vorm.|Selecteer een onderdeel of vorm en teken dan zijn bewegingspad.|Alle {name}-keyframes selecteren (Shift voegt toe)|Selecteer twee of meer onderdelen om ze te groeperen.|Naar achteren sturen|Vorm naar achteren sturen|Vorm onder het pictogram sturen|Onder het pictogram sturen|{name} naar achteren sturen|{name} onder het pictogram sturen|Sensor|Reeks|Reeksstappen|Reeksstappen (speelt van eerste naar laatste)|Reeksen die hem afspelen, slaan die stap over: {names}.|Stel icon of svg in, niet beide.|Stel een van builtin, icon, emoji of svg in.|Stel een van from of svg in.|Stel een van icon, emoji of svg in.|Stel een van state, state_not, entity_on, above of below in.|Schaduw|Schaduw en gloed|Schaduwkleur|Schaduwvoorinstellingen|Schaduw {name}|Vorm|Vormmix|Vorm over het pictogram|Punten van de vorm. Sleep een punt om het te verplaatsen.|Vorm onder het pictogram|Vorm {n}|Vorm {n}: {shape}|Vorm {n}: {shape}, gewicht {weight}|Vormen over het pictogram|Vormen onder het pictogram|Sneltoets: {keys}|Alles tonen|Alle verborgen lagen tonen|Tonen in voorbeeld|Toon {noun} ({keys})|Willekeurig|Willekeurig: nieuwe willekeurige paden|Simulatie|Sirene|Grootte|Grootte (px)|Scheeftrekken|Scheeftrekken X|Scheeftrekken Y|Vertraagt deeltjes in de loop van de tijd.|Kleinste|Kleinste afmeting|Vloeiend|Alles afvlakken|Afvlakking|Afvlakking (s)|Magnetisch raster|Vastklikken op keyframes, de afspeelkop en het raster (houd Shift ingedrukt om vrij te slepen)|Vastklikken|Solo in voorbeeld|Solo in voorbeeld (verbergt de rest, niet opgeslagen)|Solo aan|Een paar panelen zijn verborgen, zoals je ze had achtergelaten. Gebruik de pijlen aan de randen om ze te tonen.|Gelijkmatig verdeeld langs het pad, 1 tot {particles}.|Vonk|Ontstaan|Kinddeeltjes laten ontstaan|Ontstaat {seconds} s na de geboorte (in te stellen in YAML).|Snelheid|Snelheid (% van korte zijde/s)|Draaiing per lus (gr.)|Draait continu, sneller naarmate de waarde stijgt (een ventilator).|Spiraal|Opnieuw splitsen|Splitsen en beginnen|Terug splitsen in vormen|Pictogram splitsen|Splitsen in {count, plural, one {# onderdeel} other {# onderdelen}}|Splitsen in {count, plural, one {# onderdeel} other {# onderdelen}} (de eerste {parts})|Gesplitst in {count} onderdelen|Splits het pictogram om zijn vormen een voor een te animeren: de klepel van een bel, de bladen van een ventilator.|Opnieuw splitsen vervangt de onderdelen, hun groepen en hun keys.|Bezig met splitsen…|Spreiding|Verspreid over|Verspreid omlaag|Vierkant|Hoogte van het canvas|Kinderen gespreid|Spreiding uit|Spreiding aan|Ster|Begin|Begin opnieuw na de laatste stap.|Startvertraging (s)|Beginnen met een sjabloon|Beginnen met een pictogram|Beginhandvat|Begonnen bij x {x}, y {y}. Verplaats de cursor en druk op Enter om af te ronden. Escape annuleert.|Begint op|Status|Status is|Status is niet|Status is niet {state_not}|Status is {state}|Status verplaatst naar positie {to}.|Status {count} toegevoegd: {when}.|Status {i}|Status {i} verwijderd.|Statussen|Statussen (clips) worden niet geëxporteerd: het bestand speelt de eigen tijdlijn van de animatie.|Stapanimatie|Stap verplaatst naar positie {to} van {count}.|Stap verplaatst naar positie {to} van {n}.|Stap {count} toegevoegd: {name}.|Stap {index} verwijderd.|Stap {index} wordt overgeslagen|Stap {index}: {from} tot {to}|Stap {i}|Stap {i} is vergrendeld. Ontgrendel hem in Lagen.|Stappen|Stappen springen tussen waarden; er is geen curve om te bewerken.|Stoppen met tekenen|Recht|Alles recht maken|Streep|Lijn|Lijnkleur|Lijndikte (pictogrameenheden)|Zon|Vervangt het voorinstel door je eigen deeltjes: vorm, beweging, grootte en kleuren worden bewerkbaar.|Wervel|Schakelaar|Direct wisselen|Tikken|Doel|Tekst|Tekst- en pictogramkleur|Die animatie heeft eigen statussen: de kaart slaat deze status over.|Die laag is vergrendeld. Ontgrendel hem in Lagen.|De SMIL-terugval speelt de animatie alleen vooruit af.|De SVG tekent niets.|De SVG heeft geen vormen om te tekenen.|De SVG heeft te veel vormen; er passen er maximaal {room}.|De SVG is groter dan 32 KB.|De SVG is te complex.|De YAML is te groot om te importeren (meer dan 1 MB).|De animatie is groter dan {size} KB.|De animatie is niet geldig: {message}|De animatiebibliotheek is niet verbonden.|De animatie zou groter worden dan {max} KB ({size} KB).|De versoepeling van de animatie ({easingLabel})|De keyframes van de animatie verplaatsen het element.|De keyframes van de animatie verplaatsen het pictogram.|De keyframes van de animatie verplaatsen het pictogram van de module.|De keyframes van de animatie verplaatsen het hele element.|Het vak van het pictogram of van de tekst van de kaart.|De kleur is geen geldige CSS-kleur: het bestand gebruikt currentColor.|De tekengereedschappen zijn nog niet geladen.|De tekengereedschappen zijn klaar.|De tekengereedschappen op deze pagina komen uit een andere versie van Magic Card. Laad de pagina opnieuw om hier te tekenen.|De entiteitskleurknop gebruikt de animatiekleur (de kleur van het kaartitem, anders die van de entiteit).|De waarde van de entiteit stuurt {name} aan. Bekijk het met de waardeschuif op het canvas.|Het bestand kon niet worden gelezen.|Het bestand is {size} KB, groter dan 256 KB.|Het bestand loopt in een lus: het aantal herhalingen wordt niet geëxporteerd.|De eerste status die past, speelt; zonder match (of bij een niet-beschikbare entiteit) speelt de eigen tijdlijn. De entiteit is die van de module, of die welke op de animatie in de kaart is ingesteld.|Het pictogram in rust, zonder animatie. Id\'s blijven op elk onderdeel en elke vorm staan.|Het pictogram heeft geen vormen om te exporteren.|Het pictogram heeft {count} vormen: de eerste {parts} werden onderdelen (het meeste wat een rig aankan), de rest blijft in rust.|Het pictogram is gesplitst in zijn onderdelen. Selecteer een onderdeel en geef het een voorinstelling: slingeren, draaien, intekenen en meer.|De pictogrambibliotheek kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.|Het import- en exportgereedschap kon niet worden geladen. Laad de pagina opnieuw en probeer het nog eens.|Het paneel lagen is verborgen, zoals je het eerder had ingeklapt. Gebruik de pijl aan de rand om het te tonen.|De bibliotheek bevat hooguit {cap} animaties: er passen nog maar {fit}, {skipped} zijn niet geïmporteerd.|De bibliotheek is vol ({cap} animaties): er is niets geïmporteerd.|De lijn wordt in de loop van de cyclus ingetekend.|Het uiterlijk verandert een beetje.|De lus haalde de groottelimiet, dus het bestand toont minder deeltjes.|Het pictogram van de module beweegt langs het pad.|De beweging loopt langs het pad terug naar het begin.|De nieuwe animatie "{name}" is de vorige keer niet opgeslagen.|De omtrek wordt in de loop van de cyclus ingetekend, daarna wordt de vorm gevuld.|De omtrek wordt gevolgd, daarna wordt het onderdeel gevuld.|De deeltjesengine is nog niet geladen.|De onderdelen komen uit de eigen SVG van het document, een onderdeel per vorm.|Het pad tekent niets.|Het pad heeft het maximale aantal punten.|Het punt waaromheen het schaalt en draait.|Het punt waaromheen de groep draait en schaalt, in pictogrameenheden. Sleep het op het canvas.|Het punt waaromheen het onderdeel draait en schaalt, in pictogrameenheden. Sleep het op het canvas.|Het punt waaromheen het voorinstel deze groep draait, in pictogrameenheden. Het gaat voor het eigen draaipunt van de groep. Sleep het op het canvas.|Het punt waaromheen het voorinstel dit onderdeel draait, in pictogrameenheden. Het gaat voor het eigen draaipunt van het onderdeel. Sleep het op het canvas.|Het voorinstel wordt je eigen animatie om te bewerken: bewegingsvoorinstellingen als keyframes, deeltjes- en ringvoorinstellingen met hun instellingen.|Het voorbeeld is geschaald om op het canvas te passen|Het voorbeeld speelt op een echte magic-card. Laad magic-card.js (je dashboardbron) vóór de animatiestudio.|De rig bevat het maximale aantal vormen (48).|Dezelfde seed geeft elke keer dezelfde lus.|De geselecteerde keyframes gebruiken verschillende versoepelingen; een keuze hier stelt ze allemaal in.|De vorm als masker|De vorm draait mee met de richting waarin hij beweegt.|De studio berekent het pad van elk deeltje eenmaal en speelt het af als lus. Licht voor dashboards.|De tijdlijn animeert hier ook het intekenen: terwijl hij speelt, gaat hij voor deze koppeling.|De tijdlijn animeert hier ook de dekking: terwijl hij speelt, gaat zijn dekking voor deze koppeling.|De tijdlijn animeert deze kleur ook: terwijl hij speelt, gaat zijn kleur voor deze koppeling.|De tijdlijn trekt dit doel scheef: terwijl hij speelt, vervangt het scheeftrekken de beweging van deze koppeling.|Het hele element beweegt langs het pad vanaf waar het rust.|Het paneel {noun} is verborgen, zoals je het had achtergelaten. Gebruik de pijl aan de rand om het te tonen.|Deze gelden voor elke emitter. Plaatsing wordt per emitter ingesteld.|Ze vervangen het uiterlijk van het voorinstel.|Deze animatie|Deze animatie heeft al 24 geanimeerde doelen: verwijder er een om een voorinstelling toe te voegen.|Deze animatie heeft {tracks} geanimeerde doelen, het maximum. Verwijder er een om dit onderdeel te animeren.|Deze kaart speelt engine {engine}; werk Magic Card bij om deze animatie af te spelen.|Dit pictogram kon niet worden geladen. Controleer de pictogram-id, of probeer het opnieuw als Home Assistant bereikbaar is.|Dit pictogram heeft geen vormen om te animeren.|Dit pictogram heeft geen vormen om te splitsen.|Dit is de laatste key van de baan: er volgt geen segment, dus de versoepeling heeft geen effect.|Dit is het laatste keyframe: er volgt geen segment, dus de versoepeling heeft geen effect.|Dit keyframe stelt geen eigenschap in. Voeg er een toe met Eigenschap toevoegen.|Deze lus haalde de groottelimiet, dus hij toont minder deeltjes. Verlaag het aantal of de kinddeeltjes.|Deze lus is groot en laadt daarom trager op wandtablets. Verlaag het aantal of de kinddeeltjes.|Dit onderdeel heeft eigen intekenkeys op de tijdlijn.|Deze voorinstelling kon niet worden geopend: {message}|Deze voorinstelling is niet beschikbaar in deze versie van Magic Card.|Tijdlijn|Tijdlijnweergave|Timer|Timing|Tot|Naar kleur|Gereedschap: {tool}|Boven|Linksboven|Rechtsboven|Naar{unit}|Tracks (gecombineerd, geen volgorde)|Tracks van kaartonderdelen (naam, status, achtergrond) worden niet geëxporteerd.|Overgang|Driehoek|Bijgesneden|Opnieuw proberen|Turbulentie|Draaien|Botser uitzetten|Botser aanzetten|Vervagen uitzetten|Vervagen aanzetten|Zet eerst een botser aan.|Draai het onderwerp in de reisrichting.|Meedraaien met het pad|Draait naar een hoek (een naald of een wijzerplaat).|Niet beschikbaar|Onder het pictogram|Ongedaan maken (Ctrl+Z)|Onverwacht element <{element}>.|Groep opheffen|Eenheden|Onbekende voorinstelling|Onbekende voorinstelling. Deze stap wordt overgeslagen.|Onbekende voorinstelling: speelt niets.|Ontgrendelen|Ontgrendeld|Niet-opgeslagen wijzigingen|Niet-ondersteunde versie (verwacht 1).|Naamloze animatie|Tot {parentsLeft} voor deze emitter. Alle emitters delen {parents} deeltjes.|Gebruik 1-32 kleine letters, cijfers, - of _ (beginnend met een letter of cijfer).|Gebruik 1-64 kleine letters, cijfers, - of _ (beginnend met een letter of cijfer).|Gebruik Eigen tijdlijn om deze animatie af te spelen.|Gebruik een kleur of een kleurverloop.|Gebruik een voorinstellingsnaam, cubic-bezier(x1, y1, x2, y2) of steps(n).|Gebruik een pictogram-id zoals mdi:bell-ring.|Gebruiken als pictogram|Ingebakken lus gebruiken|currentColor gebruiken|Gebruik filterfuncties zoals brightness(1.2) hue-rotate(30deg); url() is niet toegestaan.|Gebruiken in kaart|Gebruik trefwoorden, lengtes of percentages, bijv. "50% 100%".|Live simulatie gebruiken|De kleuren van de ouder gebruiken|Gebruik hooguit 8 tekens.|{emoji} gebruiken|Gebruikt door {count, plural, one {# kaart} other {# kaarten}}|Stofzuiger|Waarde|Waarde boven|Waarde boven {above}|Waarde onder|Waarde onder {below}|Waardekoppelingen|Waardekoppelingen worden niet geëxporteerd: het bestand speelt af op de getekende waarden.|Klep|Variatie|Golf|Weer|Gewicht|Wat beweegt|Wat opslaan|Wanneer|Heel keyframe|Windhoek (gr.)|Bij verminderde beweging toont de kaart zijn stilstaande staat: deze animatie speelt niet.|X|Y|Zigzag|Zone|Inzoomen|Inzoomen (Ctrl +)|Uitzoomen|Uitzoomen (Ctrl -)|Ingezoomd op het pictogram terwijl je zijn onderdelen bewerkt of tekent|na {seconds}|na {seconds} s|geanimeerd|aan het einde van de levensduur|op {angle}°|achter de inhoud|kindgrootte|kindsnelheid|color_mix heeft twee kleuren nodig.|custom:{id}|omlaag|linksonder|rechtsonder|sleep {value}|tekengebied|tekent in|emoji|verborgen omdat een andere laag solo staat|verborgen omdat {name} verborgen is|verborgen in het voorbeeld|voor de inhoud|inspector|keyframe|keyframe-track|keyframe-tracks van {name}|lagen|links|levensduur|live|vergrendeld|vergrendeld omdat de laag waartoe hij behoort vergrendeld is|lussen|mijn animaties|niet op de tegel {tile}|ongeldig|aan|bij botsing|dekking|over het pictogram|speelt eenmaal|rechts|geselecteerd|snelheid|draaiing|startvertraging|status|stap {i} van {count}|stap {i} van {count}, {problem}|de achtergrond|het element|het pictogram|de naam|de status|turbulentie {value}|onder het pictogram|eenheden|onbekende fout|omhoog|linksboven|rechtsboven|{animation} (onbekend)|{below} verborgen|{below} hieronder verborgen|{count, plural, one {# stip} other {# stippen}}|{count, plural, one {# pictogram} other {# pictogrammen}}|{count, plural, one {# keyframe} other {# keyframes}}|{count, plural, one {# keyframe} other {# keyframes}} gekopieerd|{count, plural, one {# keyframe} other {# keyframes}} verwijderd|{count, plural, one {# keyframe} other {# keyframes}} geplakt op {at}{skipped}|{count, plural, one {# keyframe} other {# keyframes}} geselecteerd.|{count, plural, one {# key} other {# keys}}|{count, plural, one {# key} other {# keys}} op de tijdlijn. Draai, verplaats, schaal, fade en kleur dit onderdeel daar.|{count, plural, one {# deeltje} other {# deeltjes}} · {flow}|{count, plural, one {# punt} other {# punten}}|{count, plural, one {# vorm} other {# vormen}}|{count, plural, one {# vorm} other {# vormen}}, geschaald in het pictogram|{count, plural, one {# stap} other {# stappen}}|{count, plural, one {# {shape}} other {# {shape}}} {trigger}|{count, plural, one {{names} staat niet op de tegel {tile}. Schakel de voorbeeldtegel naar Kaart om het te zien.} other {{names} staan niet op de tegel {tile}. Schakel de voorbeeldtegel naar Kaart om ze te zien.}}|{count} keyframes|{count} van {colours}|{count} onderdelen|{count} vormen|{count} doelen|{count} doelen geselecteerd: op elk speelt een voorinstelling (Golf: na elkaar).|{from} tot {to}{unit}|{id} (niet gevonden)|{id}: de bibliotheek is vol|{kb} van 32 KB|{key} verplaatst één handvat afzonderlijk.|{key} verwijdert het.|{kind} kan niet in een reeks afspelen. Deze stap wordt overgeslagen.|{label} (de animatie beweegt het)|{label} (de animatie beweegt het) · niet op de tegel {tile}|{label} op {at}|{label} op {at} · {value}|{label} versoepeling naar de volgende key|{label} staat niet op de tegel {tile}|Baan {label}|Voorinstelling {label}|Gereedschap {label}. {hint}|{label} · niet op de tegel {tile}|{lane}-keyframe|{list}, stuiter {bounce}|{min}–{max} px|{names} delen deze curve.|{name} (kopie {n})|{name} (kopie)|{name} toegevoegd, {count} punten.|{name} toegevoegd.|Animatie {name}|{name} kopie|{name} verborgen in het voorbeeld|{name} is vergrendeld. Ontgrendel hem in Lagen.|{name} is nu stap {to} van {count}|{name} staat nu {where}.|Keyframes van {name}|{name} vergrendeld|{name} achter de inhoud gezet|{name} voor de inhoud gezet|{name} {direction} verplaatst|{name} {direction} verplaatst, positie {position} van {count}|{name} {where} verplaatst|{name} staat niet meer solo|Instellingen van {name}|{name} getoond in het voorbeeld|{name} solo in het voorbeeld|{name} ontgrendeld|{name}, achter de inhoud|{name}, voor de inhoud|{name}: {count, plural, one {# key} other {# keys}}|{now} van {total} seconden|{panels} verborgen|{panels} getoond|{particles} deeltjes · {emitters} emitters|{pct} % van het invoerbereik|{pct}, {seconds} seconden|{preset} op {targets}|Lus van {seconds} s|{size} KB|{size} pictogrameenheden|{steps}, {total} per cyclus, {loop}{skipped}.|{target}-keyframe|{target} {lane}-keyframe|{target} · op {at} · {secs} s|{where} · {from} tot {to}']),Yn=e=>e.length<2?e[0]??"":new Intl.ListFormat(Gn(),{style:"long",type:"conjunction"}).format(e),Jn="sensor.mc_studio_living_room",Xn=[{id:"icon",label:391,icon:"mdi:bell-ring-outline",targets:["element","icon"]},{id:"button",label:126,icon:"mdi:gesture-tap-button",targets:["element","icon","name"]},{id:"text",label:941,icon:"mdi:format-text",targets:["element","name"]},{id:"card",label:131,icon:"mdi:card-text-outline",targets:["element","icon","name","state","background"],entities:{[Jn]:{state:"21.5",attributes:{friendly_name:446,unit_of_measurement:"°C",device_class:"temperature",state_class:"measurement"}}}}],Qn=e=>Xn.find(t=>t.id===e)??Xn[0];function es(e,t,i,n){const s={text_align:"center",...n?{animations:n}:{}};switch(e){case"icon":return{id:t,type:"icon",icon:"mdi:bell-ring",size:i?"36px":"64px",design:s};case"button":return{id:t,type:"button",label:Zn(257),icon:"mdi:bell",design:s};case"text":return{id:t,type:"text",text:Zn(365),design:{...s,font_size:i?"18px":"28px",font_weight:"500"}};case"card":return{id:t,type:"info",entity:Jn,icon:"mdi:thermometer",show_icon:!0,show_name:!0,show_state:!0,design:{...s,text_align:"left",background_color:"var(--secondary-background-color, #f2f3f5)",border_radius:"12px",padding:i?"8px 10px":"14px 18px"}}}}function ts(e,t){const i=Qn(e).entities;if(!i)return t;let n=is.get(t);n||is.set(t,n=new Map);const s=n.get(e);if(s)return s;const a={};for(const[e,t]of Object.entries(i)){const i=t.attributes.friendly_name;a[e]={entity_id:e,state:t.state,attributes:void 0===i?t.attributes:{...t.attributes,friendly_name:Zn(i)},last_changed:"",last_updated:"",context:{id:""}}}const r={...t,states:{...a,...t.states??{}}};return n.set(e,r),r}const is=new WeakMap,ns={"A clip cannot play its own document (use self).":()=>Zn(13),"A sequence cannot play itself.":()=>Zn(17),"Another track already animates this target.":()=>Zn(69),"Children cannot have children of their own.":()=>Zn(155),"color_mix needs two colours.":()=>Zn(1125),"Draw-on is only for icon parts and shapes.":()=>Zn(279),"Min must not be above max.":()=>Zn(467),"Must be [min, max] px between 1 and 200, min ≤ max.":()=>Zn(525),"Must be [min, max].":()=>Zn(526),"Must be 1-16 of a-z, 0-9 and -, and unique.":()=>Zn(523),"Must be a list.":()=>Zn(527),"Must be a motion preset or a custom keyframes / path animation.":()=>Zn(528),"Must be a number.":()=>Zn(529),"Must be a pair [from, to].":()=>Zn(530),"Must be a particle, ring or scene preset.":()=>Zn(531),"Must be a state (text).":()=>Zn(532),"Must be a subpath index (a whole number from 0).":()=>Zn(533),"Must be a whole number.":()=>Zn(534),"Must be an attribute name.":()=>Zn(535),"Must be an icon id like mdi:bell.":()=>Zn(536),"Must be an icon id like mdi:star.":()=>Zn(537),"Must be an object.":()=>Zn(538),"Must be element, icon, name, state, background, part:<id>, group:<id> or shape:<id>.":()=>Zn(542),"Must be self, none, a preset or custom:<id>.":()=>Zn(544),"Must be SVG markup.":()=>Zn(524),"Must be text of at most 40 characters.":()=>Zn(545),"Must be text.":()=>Zn(546),"Must be three numbers [x, y, z], not all 0.":()=>Zn(547),"Must be true or false.":()=>Zn(548),"Must be two numbers (colours only for color_mix).":()=>Zn(549),"Must be two numbers [x, y].":()=>Zn(550),"Must be up to 8 characters (an emoji or a symbol).":()=>Zn(551),"Must differ from min.":()=>Zn(552),"Needs at least one entry.":()=>Zn(556),"No <svg> element found.":()=>Zn(567),"Not a part of this rig.":()=>Zn(590),"Not a timeline lane.":()=>Zn(591),"Not a valid animation id.":()=>Zn(592),"Not a valid colour.":()=>Zn(593),"Not a valid easing.":()=>Zn(594),"Not serialisable.":()=>Zn(604),"Not valid path data (it must start with M).":()=>Zn(607),"Only for the trigger time.":()=>Zn(623),"Required.":()=>Zn(756),"Set icon or svg, not both.":()=>Zn(820),"Set one of builtin, icon, emoji or svg.":()=>Zn(821),"Set one of from or svg.":()=>Zn(822),"Set one of icon, emoji or svg.":()=>Zn(823),"Set one of state, state_not, entity_on, above or below.":()=>Zn(824),"The path draws nothing.":()=>Zn(991),"The SVG draws nothing.":()=>Zn(946),"The SVG has no shapes to draw.":()=>Zn(947),"The SVG is larger than 32 KB.":()=>Zn(949),"The SVG is too complex.":()=>Zn(950),"Unsupported version (expected 1).":()=>Zn(1069),"Use 1-32 lowercase letters, digits, - or _ (starting with a letter or digit).":()=>Zn(1072),"Use 1-64 lowercase letters, digits, - or _ (starting with a letter or digit).":()=>Zn(1073),'Use keywords, lengths or percentages, e.g. "50% 100%".':()=>Zn(1083)},ss=[[/^At most (\d+) animations\.$/,e=>Zn(79,{max:+e[1]})],[/^At most (\d+) characters\.$/,e=>Zn(81,{max:+e[1]})],[/^At most (\d+) entries\.$/,e=>Zn(82,{max:+e[1]})],[/^At most (\d+) particles over all emitters\.$/,e=>Zn(83,{max:+e[1]})],[/^Duplicate id "(.*)"\.$/,e=>Zn(292,{id:e[1]})],[/^Must be between (\S+) and (\S+)\.$/,e=>Zn(541,{min:e[1],max:e[2]})],[/^Must be one of: (.+)\.$/,e=>Zn(543,{options:e[1]})],[/^Needs at least (\d+) entries\.$/,e=>Zn(557,{min:+e[1]})],[/^No (\w+) "(.*)" in the rig\.$/,e=>Zn(586,{kind:e[1],id:e[2]})],[/^Not an allowed (\w+) value\.$/,e=>Zn(596,{kind:e[1]})],[/^The animation is larger than (\d+) KB\.$/,e=>Zn(952,{size:+e[1]})],[/^The SVG has too many shapes; at most (\d+) fit\.$/,e=>Zn(948,{room:+e[1]})],[/^This card plays engine (\d+); update Magic Card to play this animation\.$/,e=>Zn(1018,{engine:+e[1]})]];function as(e){const t=ns[e];if(t)return t();for(const[t,i]of ss){const n=t.exec(e);if(n)return i(n)}return e}const rs={keyframes:420,particles:653,path:665,sequence:816},os={keyframes:"mdi:vector-polyline",particles:"mdi:shimmer",path:"mdi:vector-curve",sequence:"mdi:format-list-numbered"};class ls{constructor(e,t=600,i=100){this.current=e,this._mergeMs=t,this._limit=i,this._past=[],this._future=[],this._lastAt=0}push(e,t,i=Date.now()){void 0!==t&&t===this._lastKey&&i-this._lastAt<this._mergeMs&&this._past.length>0||(this._past.push(this.current),this._past.length>this._limit&&this._past.shift()),this.current=e,this._future=[],this._lastKey=t,this._lastAt=i}replace(e){this.current=e,this._future=[]}revert(){const e=this._past.pop();void 0!==e&&(this.current=e,this._lastKey=void 0)}canUndo(){return this._past.length>0}canRedo(){return this._future.length>0}undo(){const e=this._past.pop();if(void 0!==e)return this._future.push(this.current),this.current=e,this._lastKey=void 0,e}redo(){const e=this._future.pop();if(void 0!==e)return this._past.push(this.current),this.current=e,this._lastKey=void 0,e}reset(e){this.current=e,this._past=[],this._future=[],this._lastKey=void 0}}function cs(e,t){const i=e.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48)||"animation";if(!t(i))return i;for(let e=2;;e++){const n=`${i.slice(0,60)}-${e}`;if(!t(n))return n}}function ds(e,t){const i=Zn(1224,{name:e});if(!t.has(i))return i.slice(0,80);for(let i=2;;i++){const n=Zn(1223,{name:e,n:i});if(!t.has(n))return n.slice(0,80)}}function ps(e){return(e.steps??[]).filter(e=>e.animation.startsWith(Ze)).map(e=>e.animation.slice(7))}function hs(e,t,i){const n=i.as??"studio-preview",s={...e,id:n},a=i.still?[]:[{id:"preview",preset:Ze+n,...i.entity?{entity:i.entity}:{}}],r=(e=>"particles"===e.kind||"path"===e.kind&&"particles"===e.path?.subject||"sequence"===e.kind&&!!e.stagger?.children)(e),o="sequence"===e.kind&&!!e.stagger?.children,l=!r&&a.length?a:void 0,c={type:"custom:magic-card",rows:[{id:"r",layout:o?"1-1-1":"1",columns:(o?["a","b","c"]:["a"]).map(e=>({id:`c${e}`,vertical_align:"center",modules:[es(i.tile,`m${e}`,!!i.thumb,l)]})),design:{min_height:i.thumb?"112px":"icon"!==i.tile||r?"240px":"144px",border_radius:"12px",...r&&a.length?{animations:a}:{}}}]},d=new Map([[n,s]]);return function(e,t){const i=new Map((n=e.custom_animations,Array.isArray(n)?n.filter(e=>!!e&&"object"==typeof e):n&&"object"==typeof n?Object.entries(n).filter(([,e])=>!!e&&"object"==typeof e).map(([e,t])=>({id:e,...t})):[]).map(e=>[String(e.id),e]));var n;const s=new Map,a=[],r=function(e){const t=new Set,i=e=>{if(Array.isArray(e))e.forEach(i);else if(e&&"object"==typeof e)for(const[n,s]of Object.entries(e))if("custom_animations"!==n)if("preset"===n&&Ke(s)){const e=We(s);e&&t.add(e)}else s&&"object"==typeof s&&i(s)};return i(e),[...t]}(e);for(;r.length;){const e=r.shift();if(s.has(e)||a.includes(e))continue;const n=t(e)??i.get(e);if(!n){a.push(e);continue}s.set(e,n);const o=n.steps;for(const e of Array.isArray(o)?o:[])"string"==typeof e?.animation&&e.animation.startsWith(Ze)&&r.push(We(e.animation))}if(!s.size)return{config:e,embedded:[],missing:a};const o=[...s.keys()];for(const[e,t]of i)s.has(e)||s.set(e,t);return{config:{...e,custom_animations:[...s.values()]},embedded:o,missing:a}}(c,e=>d.get(e)??t(e)).config}function us(e,t){const i=new Map,n=e=>{if(!i.has(e.id)){i.set(e.id,e);for(const i of ps(e)){const e=t.get(i);e&&n(e)}}};return e.forEach(n),[...i.values()].map(e=>{const{id:t,name:i,...n}=JSON.parse(JSON.stringify(e));return{id:t,name:i,data:n}})}const ms=n.AH`:host{--mc-accent:var(--primary-color,#03a9f4);--mc-accent-ink:color-mix(in srgb,var(--primary-color,#03a9f4) 60%,var(--primary-text-color,#212121)); --mc-accent-fill:color-mix(in srgb,var(--primary-color,#03a9f4) 70%,#000);--mc-on-accent:#fff;--mc-accent-tint:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,transparent);--mc-surface:var(--card-background-color,#fff);--mc-surface-2:var(--secondary-background-color,#f2f3f5);--mc-ground:var(--primary-background-color,#fafafa);--mc-text:var(--primary-text-color,#212121);--mc-text-2:var(--secondary-text-color,#5f6368);--mc-divider:var(--divider-color,rgba(0,0,0,.12)); --mc-field-border:var(--secondary-text-color,#727272);--mc-warn-ink:color-mix(in srgb,var(--warning-color,#ff9800) 45%,var(--primary-text-color,#212121));--mc-warn-tint:color-mix(in srgb,var(--warning-color,#ff9800) 12%,transparent);--mc-error-ink:color-mix(in srgb,var(--error-color,#db4437) 75%,var(--primary-text-color,#212121));--mc-success:var(--success-color,#43a047); --mc-sel-module:var(--mc-accent);--mc-sel-module-fill:var(--mc-accent-fill);--mc-sel-module-ink:var(--mc-accent-ink);--mc-sel-module-tint:var(--mc-accent-tint);--mc-sel-col:color-mix(in srgb,var(--success-color,#43a047) 85%,var(--primary-text-color,#212121));--mc-sel-col-fill:color-mix(in srgb,var(--success-color,#43a047) 70%,#000);--mc-sel-col-ink:color-mix(in srgb,var(--success-color,#43a047) 60%,var(--primary-text-color,#212121));--mc-sel-col-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-sel-row:color-mix(in srgb,var(--warning-color,#ff9800) 70%,var(--primary-text-color,#212121));--mc-sel-row-fill:color-mix(in srgb,var(--warning-color,#ff9800) 55%,#000);--mc-sel-row-ink:var(--mc-warn-ink);--mc-sel-row-tint:var(--mc-warn-tint);--mc-sel-card:var(--mc-text-2);--mc-sel-card-fill:color-mix(in srgb,var(--secondary-text-color,#5f6368) 70%,#000);--mc-sel-card-ink:color-mix(in srgb,var(--secondary-text-color,#5f6368) 60%,var(--primary-text-color,#212121));--mc-sel-card-tint:color-mix(in srgb,var(--secondary-text-color,#5f6368) 12%,transparent);--mc-canvas:color-mix(in srgb,var(--primary-text-color,#212121) 6%,var(--primary-background-color,#fafafa));--mc-canvas-dot:color-mix(in srgb,var(--primary-text-color,#212121) 16%,transparent);--mc-shadow-float:0 8px 24px rgba(0,0,0,.16),0 2px 6px rgba(0,0,0,.08);--mc-mono:'Roboto Mono',ui-monospace,SFMono-Regular,Consolas,monospace;--mc-radius:8px;--mc-radius-lg:12px; --mc-hit:40px;--mc-font:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif));--mc-focus:var(--mc-accent);--mc-error-tint:color-mix(in srgb,var(--error-color,#db4437) 12%,transparent);--mc-error-fill:color-mix(in srgb,var(--error-color,#db4437) 75%,#000);--mc-success-ink:color-mix(in srgb,var(--success-color,#43a047) 55%,var(--primary-text-color,#212121));--mc-success-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-scrim:rgba(0,0,0,.38);font-family:inherit;color:var(--mc-text);caret-color:var(--mc-accent)}@supports (color:color-mix(in srgb,red 50%,blue)){:host{--mc-field-border:color-mix(in srgb,var(--primary-text-color,#212121) 50%,transparent);--mc-focus:color-mix(in srgb,var(--mc-accent) 80%,var(--mc-text))}}@media (pointer:coarse){:host{--mc-hit:44px}}`,gs=n.AH`*,*::before,*::after{box-sizing:border-box}::selection{background:var(--mc-accent-tint);color:var(--mc-text)}  .k-module{--k:var(--mc-sel-module);--k-fill:var(--mc-sel-module-fill);--k-ink:var(--mc-sel-module-ink);--k-tint:var(--mc-sel-module-tint)}.k-column{--k:var(--mc-sel-col);--k-fill:var(--mc-sel-col-fill);--k-ink:var(--mc-sel-col-ink);--k-tint:var(--mc-sel-col-tint)}.k-row{--k:var(--mc-sel-row);--k-fill:var(--mc-sel-row-fill);--k-ink:var(--mc-sel-row-ink);--k-tint:var(--mc-sel-row-tint)}.k-card{--k:var(--mc-sel-card);--k-fill:var(--mc-sel-card-fill);--k-ink:var(--mc-sel-card-ink);--k-tint:var(--mc-sel-card-tint)}*{scrollbar-width:thin;scrollbar-color:var(--mc-field-border) transparent}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--mc-divider);border-radius:9999px;border:2px solid transparent;background-clip:padding-box}::-webkit-scrollbar-thumb:hover{background-color:var(--mc-field-border)}button,input,select,textarea{font:inherit;color:inherit}button{cursor:pointer}:focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px}.mono{font-family:var(--mc-mono);font-size:.8125rem}[hidden]{display:none !important}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap} .seg{display:inline-flex;align-items:stretch;gap:2px;padding:3px;background:var(--mc-surface-2);border:1px solid var(--mc-divider);border-radius:10px;max-width:100%;overflow-x:auto;scrollbar-width:none}.seg::-webkit-scrollbar{display:none}.seg.full{display:flex;width:100%}.seg.full>button{flex:1 0 auto;justify-content:center}.seg>button{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px;border:0;border-radius:7px;background:transparent;white-space:nowrap;font-size:.8125rem;font-weight:500;color:var(--mc-text-2);transition:background-color .15s ease-out,color .15s ease-out}.seg>button ha-icon{--mdc-icon-size:18px}.seg>button:hover{color:var(--mc-text);background:color-mix(in srgb,var(--mc-surface) 55%,transparent)}.seg>button[aria-selected='true'],.seg>button[aria-checked='true'],.seg>button.active{background:var(--mc-surface);color:var(--mc-accent-ink);box-shadow:0 0 0 1px var(--mc-divider),0 1px 2px rgba(0,0,0,.08)}.seg>button:focus-visible{outline-offset:-2px} .layout-glyph{display:inline-grid;gap:2px;width:28px;height:14px;flex:none}.layout-glyph i{display:block;min-width:2px;border-radius:2px;background:currentColor;opacity:.45}.seg>button[aria-checked='true'] .layout-glyph i{opacity:.85} .chip{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 10px;border-radius:9999px;border:1px solid var(--mc-divider);background:var(--mc-surface);font-size:.75rem;font-weight:500;line-height:1;color:var(--mc-text-2);white-space:nowrap}.chip ha-icon{--mdc-icon-size:14px}button.chip{min-height:28px}button.chip:hover{border-color:var(--mc-field-border);color:var(--mc-text)}.chip.is-accent{color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent);background:var(--mc-accent-tint)}.chip.is-warn{color:var(--mc-warn-ink);border-color:color-mix(in srgb,var(--mc-warn-ink) 40%,transparent);background:var(--mc-warn-tint)}.chip.is-count{min-height:20px;padding:0 8px} .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 16px;border-radius:var(--mc-radius);border:1px solid transparent;font-size:.875rem;font-weight:500;white-space:nowrap;transition:background-color .15s ease-out,border-color .15s ease-out,box-shadow .15s ease-out}.btn ha-icon{--mdc-icon-size:18px}.btn-primary{background:var(--mc-accent-fill);color:var(--mc-on-accent)}.btn-primary:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-primary:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn-secondary{background:var(--mc-surface);border-color:var(--mc-field-border);color:var(--mc-text)}.btn-secondary:hover{background:var(--mc-surface-2)}.btn-text{background:transparent;color:var(--mc-accent-ink);padding:0 12px}.btn-text:hover{background:var(--mc-accent-tint)}.btn-sm{min-height:32px;padding:0 12px;font-size:.8125rem}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.icon-btn{display:inline-grid;place-items:center;width:40px;height:40px;flex:none;padding:0;border:0;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text-2);--mdc-icon-size:20px}.icon-btn:hover:not(:disabled){background:var(--mc-surface-2);color:var(--mc-text)}.icon-btn.sm{width:32px;height:32px;--mdc-icon-size:18px}.icon-btn.danger:hover:not(:disabled){color:var(--mc-error-ink)} .field{display:grid;gap:6px;min-width:0}.field-head{display:flex;align-items:center;gap:8px;min-height:24px}.field-head label,.field-head .lbl{font-size:.8125rem;font-weight:500;color:var(--mc-text);flex:1;min-width:0} .field-reset{margin:-4px -6px -4px 0}.help{margin:0;font-size:.75rem;color:var(--mc-text-2)}.help.error{color:var(--mc-error-ink)}.help.lead{font-size:.875rem}.input{width:100%;min-height:40px;margin:0;padding:8px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font-size:.875rem;font-weight:400;line-height:1.4;transition:border-color .15s ease-out,box-shadow .15s ease-out}.input::placeholder{color:var(--mc-text-2);opacity:1}.input:hover{border-color:var(--mc-text-2)}.input:focus{outline:none;border-color:var(--mc-focus);box-shadow:0 0 0 1px var(--mc-focus)}.input:disabled{background:var(--mc-surface-2);color:var(--mc-text-2);cursor:not-allowed} .input[aria-invalid='true']{border-color:var(--mc-error-ink)}.input[aria-invalid='true']:focus{box-shadow:0 0 0 1px var(--mc-error-ink)}textarea.input{resize:vertical;min-height:88px;line-height:1.5;font-family:var(--mc-mono);font-size:.8125rem}.input.mono{font-family:var(--mc-mono);font-size:.8125rem}.with-icon{position:relative}.with-icon>ha-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);--mdc-icon-size:18px;color:var(--mc-text-2);pointer-events:none}.with-icon>.input{padding-left:40px} .with-action>.input{padding-right:44px}.with-icon>.field-action{position:absolute;right:4px;top:50%;transform:translateY(-50%)}.with-icon + .entity-meta{margin:6px 0 0}.select{position:relative;display:block;min-width:0}.select select{appearance:none;-webkit-appearance:none;padding-right:36px;cursor:pointer}.select>ha-icon{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mc-text-2);--mdc-icon-size:18px}.unit{display:flex;min-width:0}.unit>.input{flex:1 1 auto;min-width:7ch;border-radius:var(--mc-radius) 0 0 var(--mc-radius)}.unit>.select{flex:none;width:76px}.unit>.select select{border-radius:0 var(--mc-radius) var(--mc-radius) 0;margin-left:-1px;padding-left:10px}.unit>.input:focus,.unit>.select select:focus{position:relative;z-index:1}.color{display:flex;gap:8px;align-items:center;min-width:0}.color .input{flex:1;min-width:0}.swatch{flex:none;width:40px;height:40px;padding:0;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:none;cursor:pointer}.box-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.box-side{display:grid;gap:4px;min-width:0}.box-side-label{display:flex;align-items:center;gap:4px;font-size:.75rem;color:var(--mc-text-2);--mdc-icon-size:16px}.box-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}.box-foot .select{width:96px}.switch-row{display:flex;align-items:center;gap:12px;min-height:40px}.switch-row .txt{flex:1;min-width:0;font-size:.8125rem;font-weight:500}.switch-row .txt .help{margin-top:2px;font-weight:400}.switch{position:relative;flex:none;width:40px;height:24px;border-radius:9999px;border:0;padding:0;background:var(--mc-field-border);transition:background-color .15s ease-out}.switch::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s ease-out;box-shadow:0 1px 2px rgba(0,0,0,.3)}.switch[aria-checked='true']{background:var(--mc-accent-fill)}.switch[aria-checked='true']::after{transform:translateX(16px)}.switch:disabled{opacity:.45;cursor:not-allowed}.sync{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 6px;border:0;border-radius:6px;background:transparent;color:var(--mc-text-2);font-size:.75rem;font-weight:500;white-space:nowrap;--mdc-icon-size:16px}.sync:hover{background:var(--mc-surface-2);color:var(--mc-text)}.sync.is-over{color:var(--mc-warn-ink)}.sync.is-over:hover{background:var(--mc-warn-tint);color:var(--mc-warn-ink)}.entity-meta{display:flex;align-items:center;gap:6px;font-size:.75rem;color:var(--mc-text-2)}.entity-meta .dot,.dot{width:8px;height:8px;border-radius:50%;background:var(--mc-success);flex:none} .group{display:grid;gap:16px}.group + .group{padding-top:20px;border-top:1px solid var(--mc-divider)}.group-head{display:flex;align-items:center;gap:8px;--mdc-icon-size:18px}.group-head>ha-icon{color:var(--mc-text-2)}.group-head h3{margin:0;font-size:.875rem;font-weight:500;flex:1}.cond{border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);padding:12px;display:grid;gap:12px}.cond-head{display:flex;align-items:center;gap:8px}.cond-head .n{font-size:.8125rem;font-weight:500;flex:1;min-width:0}.cond-head .n .sub{color:var(--mc-text-2);font-weight:400} .range-list{display:grid;gap:12px}.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:16px 12px}.empty{display:grid;justify-items:center;text-align:center;gap:8px;padding:24px 16px;border:1px dashed var(--mc-divider);border-radius:var(--mc-radius-lg)}.empty>ha-icon{--mdc-icon-size:28px;color:var(--mc-text-2)}.empty strong{font-weight:500}.empty p{margin:0;color:var(--mc-text-2);font-size:.8125rem;max-width:32ch}.sectors{display:grid;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);overflow:hidden}.sector + .sector{border-top:1px solid var(--mc-divider)}.sector-btn{width:100%;display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 12px;border:0;background:transparent;text-align:left}.sector-btn:hover{background:var(--mc-surface-2)}.sector-btn:focus-visible{outline-offset:-2px}.sector-btn>ha-icon:first-child{--mdc-icon-size:18px;color:var(--mc-text-2)}.sector-btn .nm{flex:1;min-width:0;font-weight:500}.sector-btn .chev{--mdc-icon-size:20px;color:var(--mc-text-2);transition:transform .15s ease-out}.sector-btn[aria-expanded='true'] .chev{transform:rotate(180deg)}.sector-body{padding:4px 12px 16px;display:grid;gap:16px}.no-results{color:var(--mc-text-2);font-size:.8125rem;padding:12px} .menu{position:absolute;z-index:30;min-width:240px;padding:6px;border-radius:var(--mc-radius-lg);background:var(--mc-surface);border:1px solid var(--mc-divider);box-shadow:var(--mc-shadow-float);display:grid} .menu[popover]{position:fixed;inset:auto;margin:0;color:var(--mc-text);overflow:auto;overscroll-behavior:contain;box-sizing:border-box}.menu button{display:flex;align-items:center;gap:12px;min-height:40px;padding:0 12px;border:0;border-radius:var(--mc-radius);background:transparent;text-align:left}.menu button:hover,.menu button:focus-visible{background:var(--mc-surface-2);outline:none}.menu button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-2px}.menu button:disabled{opacity:.45;cursor:not-allowed;background:transparent}.menu button.danger,.menu button.danger ha-icon{color:var(--mc-error-ink)}.menu button ha-icon{--mdc-icon-size:18px;color:var(--mc-text-2)}.menu .menu-note{font-size:.75rem;color:var(--mc-text-2);padding:6px 12px 8px}.menu hr{border:0;border-top:1px solid var(--mc-divider);margin:4px 0}@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:0s !important;animation-duration:0s !important}}`,fs=n.AH`:host{--mc-hit-sm:32px;--mc-hit-xs:24px;--mc-radius-tag:6px;--mc-radius-seg:10px;--mc-radius-xl:16px;--mc-ease:.15s ease-out;--mc-shadow-dialog:0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1)}@media (pointer:coarse){:host{--mc-hit-sm:44px;--mc-hit-xs:44px}}`,vs=n.AH`svg.gl{display:block;flex:none}.btn-danger{background:var(--mc-error-fill);color:var(--mc-on-accent)}.btn-danger:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-danger:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent)}.icon-btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink)} .btn[aria-disabled='true'],.icon-btn[aria-disabled='true']{opacity:.45;cursor:not-allowed;box-shadow:none} .icon-btn.xs{width:var(--mc-hit-xs,24px);height:var(--mc-hit-xs,24px);border-radius:var(--mc-radius-tag,6px);gap:0;--mdc-icon-size:16px}@media (pointer:coarse){.icon-btn.xs{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}}`,bs=[ms,gs,n.AH`.topbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;min-height:56px;padding:8px 16px;background:var(--mc-surface);border-bottom:1px solid var(--mc-divider);position:relative;z-index:6}.topbar .title{min-width:0;margin:0;font-size:1rem;font-weight:500;overflow-wrap:anywhere}.topbar .name{width:180px;max-width:40vw;min-width:0}.topbar .spacer{flex:1}`,n.AH`
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
  `],ys={keyframes:{tag:"mc-anim-keyframes-editor",place:"panel",title:1030},particles:{tag:"mc-anim-particles-editor",place:"inspector",title:653},path:{tag:"mc-anim-path-editor",place:"inspector",title:665},sequence:{tag:"mc-anim-sequence-editor",place:"inspector",title:925}},xs="mc-anim-path-host",ws=e=>"undefined"!=typeof customElements&&!!customElements.get(e),_s={kind:"none"},ks=[];function $s(e){const t=ks.findIndex(t=>t.tag===e.tag&&t.place===e.place);t>=0?ks[t]=e:ks.push(e)}function Ms(e,t,i){return ks.map((e,t)=>({p:e,i:t})).filter(({p:n})=>{if(n.place!==e)return!1;try{return n.when(t,i)}catch{return!1}}).sort((e,t)=>e.p.order-t.p.order||e.i-t.i).map(({p:e})=>e)}const Ss="var(--mc-anim-c)",Cs=[{id:"x",label:478,group:"Transform",icon:"mdi:arrow-left-right",kind:"number",def:{transform:{x:0}}},{id:"y",label:479,group:"Transform",icon:"mdi:arrow-up-down",kind:"number",def:{transform:{y:0}}},{id:"scale",label:791,group:"Transform",icon:"mdi:resize",kind:"number",def:{transform:{scale:1}}},{id:"scale_x",label:792,group:"Transform",icon:"mdi:arrow-expand-horizontal",kind:"number",def:{transform:{scale_x:1}}},{id:"scale_y",label:793,group:"Transform",icon:"mdi:arrow-expand-vertical",kind:"number",def:{transform:{scale_y:1}}},{id:"rotate",label:771,group:"Transform",icon:"mdi:rotate-right",kind:"number",def:{transform:{rotate:0}}},{id:"skew",label:851,group:"Transform",icon:"mdi:vector-polygon",kind:"number",def:{transform:{skew_x:0,skew_y:0}}},{id:"opacity",label:627,group:"Appearance",icon:"mdi:circle-opacity",kind:"number",def:{opacity:1}},{id:"color",label:179,group:"Appearance",icon:"mdi:format-color-text",kind:"css",def:{color:Ss}},{id:"background",label:93,group:"Appearance",icon:"mdi:format-color-fill",kind:"css",def:{background:`color-mix(in srgb, ${Ss} 20%, transparent)`}},{id:"shadow",label:826,group:"Appearance",icon:"mdi:box-shadow",kind:"css",def:{shadow:`0 0 16px 2px ${Ss}`}},{id:"blur",label:109,group:"Appearance",icon:"mdi:blur",kind:"number",def:{blur:0}},{id:"radius",label:203,group:"Appearance",icon:"mdi:rounded-corner",kind:"number",def:{radius:0}},{id:"filter",label:340,group:"Appearance",icon:"mdi:auto-fix",kind:"css",def:{filter:"brightness(1.2)"}}],As=[{id:"draw",label:276,group:"Appearance",icon:"mdi:draw",kind:"number",def:{draw:1},rig:!0},{id:"stroke",label:932,group:"Appearance",icon:"mdi:border-color",kind:"css",def:{stroke:Ss},rig:!0}],js=[...Cs,...As],zs=Object.fromEntries(js.map(e=>[e.id,e])),qs=e=>!!e&&/^(part|group|shape):/.test(e),Es=e=>Zn(zs[e].label),Ls=e=>qs(e)?js:Cs,Ps=[["x","y"],["scale","scale_x","scale_y"],["filter","blur"]],Hs=e=>Ps.find(t=>t.includes(e))??[e],Vs={x:["x"],y:["y"],scale:["scale"],scale_x:["scale_x"],scale_y:["scale_y"],rotate:["rotate","axis"],skew:["skew_x","skew_y"]};function Ds(e,t){if("*"===t)return!0;const i=Vs[t];return i?"rotate"===t?void 0!==e.transform?.rotate:i.some(t=>void 0!==e.transform?.[t]):void 0!==e[t]}const Ts=e=>js.every(t=>!Ds(e,t.id));function Os(e,t){const i=Vs[t];if(i){const t={};for(const n of i){const i=e.transform?.[n];void 0!==i&&(t[n]=Array.isArray(i)?[...i]:i)}return{transform:t}}const n=e[t];return void 0===n?{}:{[t]:n}}function Rs(e,t){const i={...e};for(const[n,s]of Object.entries(t))"transform"===n?i.transform={...e.transform??{},...s}:i[n]=s;return i.transform&&!Object.keys(i.transform).length&&delete i.transform,i}function Ns(e,t){const i={...e};if(i.easings&&void 0!==i.easings[t]){const e={...i.easings};delete e[t],Object.keys(e).length?i.easings=e:delete i.easings}const n=Vs[t];if(n){if(i.transform){const e={...i.transform};for(const t of n)delete e[t];Object.keys(e).length?i.transform=e:delete i.transform}}else delete i[t];return i}const Fs=e=>js.filter(t=>e.some(e=>Ds(e,t.id))).map(e=>e.id),Bs=e=>`${e.lane}@${e.at}`;function Is(e){const t=e.lastIndexOf("@");return{lane:e.slice(0,t),at:Number(e.slice(t+1))}}function Zs(e,t){return[...new Set(e.filter(e=>Ds(e,t)).map(e=>e.at))].sort((e,t)=>e-t)}const Ks=(e,t)=>e.some(e=>e.at===t.at&&Ds(e,t.lane));function Ws(e,t,i){return e.filter(e=>e.at===i&&Ds(e,t)).reduce((e,i)=>Rs(e,Os(i,t)),{})}function Us(e,t){let i;for(const n of e)n.at===t&&n.easing&&(i=n.easing);return i}function Gs(e,t,i){let n;for(const s of e)s.at===i&&s.easings?.[t]&&(n=s.easings[t]);return n}function Ys(e,t,i,n){const s=Hs(t),a=e.map((e,t)=>e.at===i&&s.some(t=>Ds(e,t))?t:-1).filter(e=>e>=0);return a.length?e.map((e,t)=>{if(e.at!==i)return e;const r={...e.easings??{}};for(const e of s)delete r[e];if(n&&a.includes(t))for(const t of s)Ds(e,t)&&(r[t]=n);const o={...e};return Object.keys(r).length?o.easings=r:delete o.easings,o}):e}const Js=e=>e.map((e,t)=>[e,t]).sort((e,t)=>e[0].at-t[0].at||e[1]-t[1]).map(([e])=>e),Xs=e=>Math.min(100,Math.max(0,Math.round(100*e)/100));function Qs(e,t,i,n,s){const a=s&&Object.keys(s).length?{...s}:void 0,r=e.map(e=>e.at).lastIndexOf(t);if(r<0)return[...e,{at:t,...Rs({},i),...n?{easing:n}:{},...a?{easings:a}:{}}];const o=[...e];return o[r]=Rs(o[r],i),n&&!o[r].easing&&(o[r]={...o[r],easing:n}),a&&(o[r]={...o[r],easings:{...o[r].easings??{},...a}}),o}function ea(e,t){if("*"===t.lane)return e.filter(e=>e.at!==t.at);const i=t.lane;return e.flatMap(e=>{if(e.at!==t.at||!Ds(e,i))return[e];const n=Ns(e,i);return Ts(n)?[]:[n]})}function ta(e,t,i){const n={};for(const s of e)if(s.at===t&&s.easings)for(const[e,t]of Object.entries(s.easings))void 0===t||i&&!i.includes(e)||(n[e]=t);return Object.keys(n).length?n:void 0}function ia(e,t){if(!Ks(e,t))return;if("*"===t.lane){const i=e.filter(e=>e.at===t.at);return{key:t,frag:i.reduce((e,t)=>Rs(e,function(e){return js.reduce((t,i)=>Ds(e,i.id)?Rs(t,Os(e,i.id)):t,{})}(t)),{}),easing:Us(e,t.at),easings:ta(e,t.at)}}const i=e.filter(e=>e.at===t.at).every(e=>js.every(i=>i.id===t.lane||!Ds(e,i.id)));return{key:t,frag:Ws(e,t.lane,t.at),easing:i?Us(e,t.at):void 0,easings:ta(e,t.at,[t.lane])}}function na(e){const t=new Set(e.filter(e=>"*"===e.lane).map(e=>e.at)),i=new Set;return e.filter(e=>{const n=Bs(e);return!(i.has(n)||"*"!==e.lane&&t.has(e.at)||(i.add(n),0))})}function sa(e,t){if(!e.length)return 0;const i=Math.min(...e.map(e=>e.at)),n=Math.max(...e.map(e=>e.at));return Math.min(100-n,Math.max(-i,t))}function aa(e,t,i,n=!1){const s=na(t).filter(t=>Ks(e,t)),a=sa(s,i);if(!s.length||0===a&&!n)return{keyframes:e,selection:s};const r=s.map(t=>ia(e,t)).filter(Boolean);let o=e;if(!n)for(const e of r)o=ea(o,e.key);const l=[];for(const e of[...r].sort((e,t)=>("*"===e.key.lane?0:1)-("*"===t.key.lane?0:1))){const t=Xs(e.key.at+a);o=Qs(o,t,e.frag,e.easing,e.easings),l.push({lane:e.key.lane,at:t})}return{keyframes:Js(o),selection:l}}function ra(e,t){let i=e;for(const e of na(t))i=ea(i,e);return i}const oa=(e,t,i)=>e+(t-e)*i,la=(e,t=4)=>Math.round(e*10**t)/10**t;function ca(e,t,i,n="ease"){const s=Zs(e,t);if(!s.length)return;if(s.includes(i))return Ws(e,t,i);const a=s.find(e=>e>i),r=[...s].reverse().find(e=>e<i);if(void 0===r)return Ws(e,t,a);if(void 0===a)return Ws(e,t,r);const o=(i-r)/(a-r),l=function(e,t){const i=e?.match(/^steps\(\s*(\d+)\s*(?:,\s*([a-z-]+)\s*)?\)$/);if(i){const e=Math.max(1,Number(i[1])),n="start"===i[2]||"jump-start"===i[2];return Math.min(1,(n?Math.ceil(t*e):Math.floor(t*e))/e)}return function([e,t,i,n],s){if(s<=0)return 0;if(s>=1)return 1;const a=t=>3*e*t*(1-t)**2+3*i*t**2*(1-t)+t**3,r=e=>3*t*e*(1-e)**2+3*n*e**2*(1-e)+e**3,o=t=>3*e*(1-t)**2+6*(i-e)*t*(1-t)+3*(1-i)*t**2;let l=s;for(let e=0;e<8;e++){const e=a(l)-s;if(Math.abs(e)<1e-6)return r(l);const t=o(l);if(Math.abs(t)<1e-6)break;l-=e/t}let c=0,d=1;l=s;for(let e=0;e<40;e++){const e=a(l);if(Math.abs(e-s)<1e-6)break;e<s?c=l:d=l,l=(c+d)/2}return r(l)}(Fa(e)??[0,0,1,1],t)}(((e,t,i)=>Gs(e,t,i)??Us(e,i))(e,t,r)??n,o);return function(e){const t={...e};for(const e of["opacity","blur","radius","draw"])void 0!==t[e]&&(t[e]=la(t[e],"opacity"===e||"draw"===e?3:2));if(t.transform){const e={...t.transform};for(const[t,i]of Object.entries(e))"number"==typeof i&&(e[t]=la(i,t.startsWith("scale")?3:2));t.transform=e}return t}(function(e,t,i){const n={},s=["opacity","blur","radius","draw"];for(const a of s){const s=e[a],r=t[a];void 0===s&&void 0===r||(n[a]=oa(s??r,r??s,i))}if(e.transform||t.transform){const s=e.transform??{},a=t.transform??{},r={};for(const e of["x","y","scale","scale_x","scale_y","rotate","skew_x","skew_y"]){const t=s[e],n=a[e];void 0===t&&void 0===n||(r[e]=oa(t??n,n??t,i))}const o=s.axis??a.axis;o&&(r.axis=[...o]),n.transform=r}for(const s of["color","background","shadow","filter","stroke"]){const a=i<1?e[s]??t[s]:t[s]??e[s];void 0!==a&&(n[s]=a)}return n}(Ws(e,t,r),Ws(e,t,a),l))}function da(e,t,i){return e.map(e=>{if(e.at!==t)return e;const n={...e};return i?n.easing=i:delete n.easing,n})}function pa(e,t){const i=na(t).filter(t=>Ks(e,t));if(!i.length)return;const n=Math.min(...i.map(e=>e.at));return{items:i.map(t=>{const i=ia(e,t);return{lane:t.lane,dt:t.at-n,frag:ha(i.frag),easing:i.easing,...i.easings?{easings:{...i.easings}}:{}}})}}const ha=e=>JSON.parse(JSON.stringify(e));function ua(e,t,i){let n=e;const s=[],a=[...t.items].sort((e,t)=>("*"===e.lane?0:1)-("*"===t.lane?0:1));for(const e of a){const t=Xs(i+e.dt);n=Qs(n,t,ha(e.frag),e.easing,e.easings),s.push({lane:e.lane,at:t})}return{keyframes:Js(n),selection:s}}let ma;const ga=new Set,fa=()=>ma;function va(e){ma=e;for(const e of ga)e()}const ba={x:e=>({transform:{x:e}}),y:e=>({transform:{y:e}}),scale:e=>({transform:{scale:e}}),scale_x:e=>({transform:{scale_x:e}}),scale_y:e=>({transform:{scale_y:e}}),rotate:e=>({transform:{rotate:e}}),skew:e=>({transform:{skew_x:e,skew_y:0}}),opacity:e=>({opacity:Math.min(1,Math.max(0,e))}),blur:e=>({blur:Math.max(0,e)}),radius:e=>({radius:Math.max(0,e)}),draw:e=>({draw:Math.min(1,Math.max(0,e))})},ya=["color","background","stroke"];function xa(e,t,i){if(e===t)return ha(i);const n=e=>["x","y"].includes(e)?"move":["scale","scale_x","scale_y"].includes(e)?"scale":["opacity","draw"].includes(e)?"unit":["blur","radius"].includes(e)?"px":e;if(ba[e]&&ba[t]&&n(e)===n(t)){const n=function(e,t){const i=t.transform??{};switch(e){case"x":case"y":case"scale":case"scale_x":case"scale_y":case"rotate":return i[e];case"skew":return i.skew_x;default:{const i=t[e];return"number"==typeof i?i:void 0}}}(e,i);return void 0===n?void 0:ba[t](n)}if(ya.includes(e)&&ya.includes(t)){const n=i[e];return"string"==typeof n?{[t]:n}:void 0}}const wa={element:{label:306,icon:"mdi:card-outline"},icon:{label:391,icon:"mdi:emoticon-outline"},name:{label:554,icon:"mdi:format-text"},state:{label:905,icon:"mdi:information-outline"},background:{label:93,icon:"mdi:texture-box"}};function _a(e,t){if(wa[t])return Zn(wa[t].label);const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return t;const n="part"===i[1]?e.rig?.parts:"group"===i[1]?e.rig?.groups:e.rig?.shapes;return n?.find(e=>e.id===i[2])?.name??i[2]}const ka=e=>wa[e]?.icon??(e.startsWith("group:")?"mdi:group":e.startsWith("shape:")?"mdi:vector-square":"mdi:puzzle-outline"),$a=e=>"icon"===e.target?"icon":"element";function Ma(e){const t=[{target:$a(e),keyframes:e.keyframes??[],main:!0}];for(const i of e.tracks??[])t.some(e=>e.target===i.target)||t.push({target:i.target,keyframes:i.keyframes??[],main:!1});return t}function Sa(e,t){return t===$a(e)?e.keyframes??[]:e.tracks?.find(e=>e.target===t)?.keyframes??[]}function Ca(e,t,i){if(t===$a(e))return{...e,keyframes:i};const n=[...e.tracks??[]],s=n.findIndex(e=>e.target===t);if(s>=0){const e={...n[s],keyframes:i};i.length||e.path||e.origin?n[s]=e:n.splice(s,1)}else i.length&&n.push({target:t,keyframes:i});const a={...e};return n.length?a.tracks=n:delete a.tracks,a}const Aa=(e,t)=>e.target===t?Bs(e):`${e.target}/${Bs(e)}`;function ja(e,t){const i=e.indexOf("/");return{target:i>=0?e.slice(0,i):t,...Is(i>=0?e.slice(i+1):e)}}const za=(e,t)=>Ks(Sa(e,t.target),t);function qa(e){const t=new Map;for(const i of e){const e=t.get(i.target)??[];e.push({lane:i.lane,at:i.at}),t.set(i.target,e)}return t}function Ea(e,t,i,n=!1){const s=t.filter(t=>za(e,t)),a=sa(s,i);if(!s.length||0===a&&!n)return{doc:e,selection:s};let r=e;const o=[];for(const[e,t]of qa(s)){const i=aa(Sa(r,e),t,a,n);r=Ca(r,e,i.keyframes),o.push(...i.selection.map(t=>({...t,target:e})))}return{doc:r,selection:o}}function La(e,t){let i=e;for(const[e,n]of qa(t))i=Ca(i,e,ra(Sa(i,e),n));return i}function Pa(e,t){const i=t.filter(t=>za(e,t));if(!i.length)return;const n=Math.min(...i.map(e=>e.at)),s=[];for(const[t,a]of qa(i)){const i=pa(Sa(e,t),a),r=Math.min(...a.map(e=>e.at));for(const e of i?.items??[])s.push({...e,dt:e.dt+r-n,target:t})}return{items:s}}const Ha=[{id:"pct1",label:"1%"},{id:"pct5",label:"5%"},{id:"s01",label:"0.1 s"},{id:"fps30",label:10}],Va=[1,1.5,2,3,4,6,8,10],Da=e=>Math.min(10,Math.max(1,Math.round(100*e)/100));function Ta(e,t){return t>0?Va.find(t=>t>e+.001)??10:[...Va].reverse().find(t=>t<e-.001)??1}const Oa=[1,2,2.5,5];function Ra(e){const t=10**Math.floor(Math.log10(e));for(const i of[...Oa,10])if(i*t>=e-1e-9)return i*t;return 10*t}const Na={linear:[0,0,1,1],ease:[.25,.1,.25,1],"ease-in":[.42,0,1,1],"ease-out":[0,0,.58,1],"ease-in-out":[.42,0,.58,1]};function Fa(e){if(!e)return;const t=e.trim(),i=B.find(e=>e.id===t)?.css??t;if(Na[i])return[...Na[i]];const n=i.match(/^cubic-bezier\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/);if(!n)return;const s=n.slice(1).map(Number);return s.every(Number.isFinite)?s:void 0}const Ba=B.map(e=>({id:e.id,label:e.label,bezier:Fa(e.id)})),Ia=e=>Math.round(100*e)/100;function Za(e){const t=e=>Ia(Math.min(1,Math.max(0,e))),i=e=>Ia(Math.min(2,Math.max(-1,e)));return[t(e[0]),i(e[1]),t(e[2]),i(e[3])]}function Ka(e){const t=Za(e),i=Ba.find(e=>e.bezier.every((e,i)=>Math.abs(e-t[i])<.005));return i?i.id:`cubic-bezier(${t.join(", ")})`}const Wa=/^color-mix\(in srgb, var\(--mc-anim-c\) (\d+(?:\.\d+)?)%, transparent\)$/;function Ua(e){if(!e)return"";const t=e.trim();if(/^var\(\s*--mc-anim-c\s*\)$/.test(t))return"entity";const i=t.match(Wa);return i?`entity ${i[1]}%`:t}function Ga(e){const t=e.trim().match(/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/i);return t?void 0===t[1]||Number(t[1])>=100?Ss:`color-mix(in srgb, ${Ss} ${Number(t[1])}%, transparent)`:e.trim()}const Ya=e=>`${e.x}px ${e.y}px ${e.blur}px ${e.spread}px ${e.color}`,Ja=[{id:"glow",label:366,value:`0px 0px 16px 2px ${Ss}`},{id:"drop",label:288,value:"0px 6px 16px 0px rgba(0, 0, 0, 0.3)"},{id:"lift",label:438,value:"0px 14px 28px -6px rgba(0, 0, 0, 0.35)"},{id:"none",label:587,value:"none"}],Xa=[{id:"bright",label:115,value:"brightness(1.3)"},{id:"hue",label:389,value:"hue-rotate(90deg)"},{id:"gray",label:371,value:"grayscale(1)"},{id:"glow",label:366,value:`drop-shadow(0 0 6px ${Ss})`},{id:"none",label:587,value:"none"}],Qa=(e,t)=>"none"===e.trim()?"shadow"===t||"filter"===t:void 0!==st(e,t),er=["top left","top","top right","left","center","right","bottom left","bottom","bottom right"],tr=[1038,1037,1039,433,141,766,112,111,113],ir=(e,t=2)=>String(la(e,t));function nr(e,t){if(!t)return"";const i=t.transform??{};switch(e){case"x":return void 0===i.x?"":`${ir(i.x,1)} px`;case"y":return void 0===i.y?"":`${ir(i.y,1)} px`;case"scale":case"scale_x":case"scale_y":{const t=i[e];return void 0===t?"":`${ir(100*t,1)}%`}case"rotate":return void 0===i.rotate?"":`${ir(i.rotate,1)}°`;case"skew":return`${ir(i.skew_x??0,1)}° ${ir(i.skew_y??0,1)}°`;case"opacity":return void 0===t.opacity?"":`${ir(100*t.opacity,0)}%`;case"blur":return void 0===t.blur?"":`${ir(t.blur,1)} px`;case"radius":return void 0===t.radius?"":`${ir(t.radius,1)} px`;case"draw":return void 0===t.draw?"":`${ir(100*t.draw,0)}%`;default:{const i=t[e];return void 0===i?"":Ua(i).startsWith("entity")?Zn(66):i}}}const sr=e=>{const t=e?B.find(t=>t.id===e)?.label:void 0;return void 0!==t?(0,N.t)(t):e?e.startsWith("steps")?Zn(925):Zn(219):Zn(227)};var ar=i(8164);function rr(e){const t=e?(0,de.Rr)(e)[0]:void 0;if(t)return(0,ar.toEdit)(t);const i=String.raw`([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)`,n=new RegExp(String.raw`^\s*[Mm]\s*${i}[\s,]*${i}`).exec(e||"");return{anchors:n?[{x:Number(n[1]),y:Number(n[2])}]:[],closed:!1}}const or=ar.serialize,lr=ar.bounds,cr=ar.reverse,dr=ar.translate,pr=new Map;function hr(e,t){let i=pr.get(e);if(i||(i=e?Mn(e,200):[],pr.size>32&&pr.clear(),pr.set(e,i)),!i.length)return;const n=Math.min(1,Math.max(0,Number.isFinite(t)?t:0))*(i.length-1),s=Math.min(i.length-2,Math.floor(n));if(s<0)return i[0];const a=i[s],r=i[s+1],o=n-s;return{t:a.t+(r.t-a.t)*o,x:a.x+(r.x-a.x)*o,y:a.y+(r.y-a.y)*o,angle:a.angle+(r.angle-a.angle)*o}}const ur=[{id:"circle",label:160},{id:"figure-8",label:337},{id:"wave",label:1099},{id:"bounce",label:114},{id:"zigzag",label:1110},{id:"spiral",label:877}];function mr(e,t,i,n,s,a){const r=(n-i)/s,o=[],l=a?s:s+1;for(let n=0;n<l;n++){const s=i+n*r,[c,d]=e(s),[p,h]=t(s),u=[p*r/3,h*r/3];o.push({x:c,y:d,in:a||n>0?[c-u[0],d-u[1]]:void 0,out:a||n<l-1?[c+u[0],d+u[1]]:void 0})}return{anchors:o,closed:a}}function gr(e,t=[0,0],i=40){const[n,s]=t,a=i/40,r=2*Math.PI;let o;switch(e){case"circle":{const e=30*a;o=mr(t=>[n+e*Math.cos(t),s+e*Math.sin(t)],t=>[-e*Math.sin(t),e*Math.cos(t)],0,r,8,!0);break}case"figure-8":{const e=36*a,t=56*a;o=mr(i=>[n+e*Math.sin(i),s+t*Math.sin(i)*Math.cos(i)],i=>[e*Math.cos(i),t*Math.cos(2*i)],0,r,8,!0);break}case"wave":{const e=80*a,t=20*a,i=2,l=r*i/e;o=mr(i=>[n-e/2+i,s-t*Math.sin(l*i)],e=>[1,-t*l*Math.cos(l*e)],0,e,4*i,!1);break}case"bounce":{const e=s+20*a,t=[40,25,12].map(e=>e*a),i=[34,26,20].map(e=>e*a);let r=n-40*a;const l=[{x:r,y:e}];t.forEach((t,n)=>{const s=r+i[n],a=[r+i[n]/2,e-2*t];l[l.length-1].out=[r+2/3*(a[0]-r),e+2/3*(a[1]-e)],l.push({x:s,y:e,in:[s+2/3*(a[0]-s),e+2/3*(a[1]-e)]}),r=s}),o={anchors:l,closed:!1};break}case"zigzag":{const e=[],t=6;for(let i=0;i<=t;i++)e.push({x:n-40*a+80*a*i/t,y:s+(i%2?-15:15)*a});o={anchors:e,closed:!1};break}case"spiral":{const e=2.5,t=r*e,i=40*a/t;o=mr(e=>[n+i*e*Math.cos(e),s+i*e*Math.sin(e)],e=>[i*(Math.cos(e)-e*Math.sin(e)),i*(Math.sin(e)+e*Math.cos(e))],0,t,4*e,!1);break}}return or(o)}const fr=e=>"particles"===e.subject&&"percent"===e.units?[50,50]:[0,0],vr=e=>Math.round(100*e)/100,br=e=>`${(0,ar.fmtNum)(e[0])} ${(0,ar.fmtNum)(e[1])}`,yr=e=>e.length>1&&(0,de.xg)(e[0][0],e[e.length-1][3])<1e-6;function xr(e,t){return function(e){const t=[];for(const i of e){if(!i.length)continue;const e=yr(i);t.push(`M${br(i[0][0])}`),i.forEach((n,s)=>{(0,de.Wv)(n[1],n[0],n[3])<1e-4&&(0,de.Wv)(n[2],n[0],n[3])<1e-4?e&&s===i.length-1||t.push(`L${br(n[3])}`):t.push(`C${br(n[1])} ${br(n[2])} ${br(n[3])}`)}),e&&t.push("Z")}return t.join(" ")}((0,de.Mj)(e).map(e=>e.map(e=>e.map(t))))}const wr=(e,t,i)=>xr(e,e=>[e[0]+t,e[1]+i]);function _r(e){const t=[];for(const i of(0,de.Mj)(e))i.length&&(t.push([i[0][0][0],i[0][0][1]]),i.forEach((e,n)=>{n===i.length-1&&yr(i)||t.push([e[3][0],e[3][1]])}));return t.map(e=>[vr(e[0]),vr(e[1])])}function kr(e,t=12){return(0,de.Mj)(e).map(e=>{const i=e.length?[e[0][0]]:[];for(const n of e)for(let e=1;e<=t;e++)i.push((0,de.Mo)(n,e/t));return i})}function $r(e){let t=1/0,i=1/0,n=-1/0,s=-1/0;for(const a of kr(e,16))for(const e of a)t=Math.min(t,e[0]),i=Math.min(i,e[1]),n=Math.max(n,e[0]),s=Math.max(s,e[1]);return Number.isFinite(t)?{x:t,y:i,w:n-t,h:s-i}:void 0}function Mr(e){const t=(e??"").trim().split(/[\s,]+/).map(Number);return 4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0?t:[0,0,24,24]}function Sr(e,t){const[i,n,s,a]=Mr(e),[r,o,l,c]=Mr(t),d=Math.min(l/s,c/a);return{k:d,dx:r+(l-s*d)/2-i*d,dy:o+(c-a*d)/2-n*d}}const Cr=/^(none|transparent)$/i,Ar=e=>e.fill?!Cr.test(e.fill):!e.stroke,jr=e=>!!e.stroke&&!Cr.test(e.stroke);function zr(e,t){let i=!1;for(let n=0,s=e.length-1;n<e.length;s=n++){const[a,r]=e[n],[o,l]=e[s];r>t[1]!=l>t[1]&&t[0]<(o-a)*(t[1]-r)/(l-r||1e-9)+a&&(i=!i)}return i}const qr=e=>[...e.filter(e=>"under"===e.layer),...e.filter(e=>"under"!==e.layer)];function Er(e,t){let i=1/0;for(const n of kr(e))for(let e=1;e<n.length;e++)i=Math.min(i,(0,de.Wv)(t,n[e-1],n[e]));return i}function Lr(e,t,i){const n=qr(e);for(let e=n.length-1;e>=0;e--){const s=n[e],a=kr(s.d);if(Ar(s)){let e=!1;for(const i of a)zr(i,t)&&(e=!e);if(e)return s.id}const r=(jr(s)?(s.stroke_width??1)/2:0)+i;if(Er(s.d,t)<=r)return s.id}}const Pr=/^[a-z0-9][a-z0-9_-]{0,24}$/;function Hr(e,t="shape"){const i=new Set(e.map(e=>"string"==typeof e?e:e.id)),n=Pr.test(t)?t:"shape";let s=1;for(;i.has(`${n}-${s}`);)s++;return`${n}-${s}`}function Vr(e){const t=JSON.stringify(e),i="undefined"!=typeof TextEncoder?(new TextEncoder).encode(t).length:t.length;return i>Ye?Zn(955,{max:Math.round(64),size:Math.ceil(i/1024)}):void 0}const Dr=e=>e.rig?.shapes??[],Tr=e=>[...(e.rig?.parts??[]).map(e=>e.id),...(e.rig?.groups??[]).map(e=>e.id),...Dr(e).map(e=>e.id)];function Or(e,t){const i=Dr(e);if(i.length>=Yi||Tr(e).includes(t.id))return;const n=e.rig??{parts:[]};return{...e,rig:{...n,parts:n.parts??[],shapes:[...i,t]}}}function Rr(e,t,i){if(!e.rig?.shapes)return e;const n=e.rig.shapes.map(e=>{if(e.id!==t)return e;const n={...e,...i};for(const e of Object.keys(n))void 0===n[e]&&delete n[e];return n});return{...e,rig:{...e.rig,shapes:n}}}function Nr(e,t,i){const n=[...Dr(e)],s=n.findIndex(e=>e.id===t);if(s<0||!e.rig)return e;const[a]=n.splice(s,1);return n.splice(Math.max(0,Math.min(n.length,i)),0,a),{...e,rig:{...e.rig,shapes:n}}}function Fr(e,t,i){const n=Dr(e),s=n.findIndex(e=>e.id===t);if(s<0||!e.rig)return e;const a="under"===n[s].layer?"under":"over",r=e=>("under"===e.layer?"under":"over")===a,o=[...n],[l]=o.splice(s,1);let c=-1;if("up"===i)c=n.findIndex((e,t)=>t>s&&r(e));else for(let e=s-1;e>=0;e--)if(r(n[e])){c=e;break}if(c>=0)return o.splice(c,0,l),{...e,rig:{...e.rig,shapes:o}};if("over"===a==("up"===i))return e;const d={...l,layer:"over"===a?"under":"over"};if("over"===d.layer){const e=o.findIndex(e=>"under"!==e.layer);o.splice(e<0?s:e,0,d)}else{let e=-1;o.forEach((t,i)=>{"under"===t.layer&&(e=i)}),o.splice(e<0?s:e+1,0,d)}return{...e,rig:{...e.rig,shapes:o}}}function Br(e,t){if(!e.rig?.shapes)return e;const i=`shape:${t}`,n={...e,rig:{...e.rig,shapes:e.rig.shapes.filter(e=>e.id!==t)}};return e.tracks&&(n.tracks=e.tracks.filter(e=>e.target!==i)),e.bindings&&(n.bindings=e.bindings.filter(e=>e.target!==i)),n}const Ir=(e,t)=>e.tracks?.find(e=>e.target===t);function Zr(e,t,i){const n=e.tracks??[],s=n.findIndex(e=>e.target===i);return t?s<0?n.length>=24?void 0:{...e,tracks:[...n,t]}:{...e,tracks:n.map((e,i)=>i===s?t:e)}:s<0?e:{...e,tracks:n.filter((e,t)=>t!==s)}}const Kr=(e,t)=>!!Ir(e,t)?.keyframes.some(e=>void 0!==e.draw);function Wr(e,t,i,n){const s=Ir(e,t);if(!i){if(!s?.path)return e;const i={...s};return delete i.path,Zr(e,i.keyframes.length?i:void 0,t)}const a=(0,de.Mj)(i)[0]?.[0]?.[0];return a?Zr(e,{...s??{target:t,keyframes:[]},target:t,path:{d:wr(i,-a[0],-a[1]),...n?{follow_rotation:!0}:{}}},t):e}const Ur={target:["hide","solo","lock"],part:["hide","solo","lock"],group:["hide","solo","lock"],shape:["hide","solo","lock"],lane:["hide","solo","lock"],emitter:["hide","solo","lock"],children:["hide","solo","lock"],pshape:[],content:[],path:["lock"],subject:["lock"],step:["hide","solo","lock"]},Gr={hidden:[],solo:[],locked:[],open:[]},Yr=["icon","name","state","background"];function Jr(e){const t="particles"===e.kind?e.particles?.sim:void 0;if(!t)return[];const i=t.emitters??[];return[t.id??"main",...i.map((e,t)=>e.id??`e${t+1}`)]}function Xr(e){const t=[];"keyframes"===e.kind&&t.push([$a(e),e.keyframes??[]]);for(const i of e.tracks??[])t.push([i.target,i.keyframes]);return t}function Qr(e,t){return Fs(Xr(e).filter(([e])=>e===t).flatMap(([,e])=>e))}function eo(e,t,i){return Zs(Xr(e).filter(([e])=>e===t).flatMap(([,e])=>e),i)}function to(e){const t=new Map;if("keyframes"===e.kind){for(const e of Yr)t.set(`target:${e}`,"targets");for(const i of e.rig?.parts??[])t.set(`part:${i.id}`,"parts");for(const i of e.rig?.groups??[])t.set(`group:${i.id}`,"parts");for(const i of e.rig?.shapes??[])t.set(`shape:${i.id}`,"under"===i.layer?"under":"over");for(const[i,n]of Xr(e))for(const e of Fs(n))t.set(`lane:${i}|${e}`,"lanes")}const i="particles"===e.kind?e.particles?.sim:void 0;if(i){const n=Jr(e),s=[i.children,...(i.emitters??[]).map(e=>e.children)];n.forEach((e,i)=>{t.set(`emitter:${e}`,"emitters"),s[i]&&t.set(`children:${e}`,"emitters")})}else"particles"===e.kind&&e.particles&&t.set("emitter:main","emitters");return"sequence"===e.kind&&(e.steps??[]).forEach((e,i)=>t.set(`step:${i}`,"steps")),t}const io="parents:";function no(e,t){const i=to(e),n=new Set(t.hidden.filter(e=>i.has(e))),s=new Set(t.solo.filter(e=>i.has(e)));if(!s.size)return n;const a=new Set([...s].map(e=>i.get(e))),r=new Map;for(const t of e.rig?.groups??[])for(const e of t.parts)r.has(e)||r.set(e,t.id);for(const[e,t]of i){if(!a.has(t)||s.has(e))continue;const[i,...o]=e.split(":"),l=o.join(":");if("parts"===t){if("group"===i||s.has(`group:${r.get(l)}`))continue}else if("emitters"===t){const t=l;if("children"===i){if(s.has(`emitter:${t}`))continue}else if(s.has(`children:${t}`)&&!n.has(e)){n.add(`${io}${t}`);continue}}n.add(e)}return n}function so(e,t){const[i,...n]=t.split(":"),s=n.join(":");if("part"===i){const t=e.rig?.groups?.find(e=>e.parts.includes(s));return t?`group:${t.id}`:void 0}if("children"===i)return`emitter:${s}`;if("lane"===i){const e=t.slice(5,t.lastIndexOf("|"));return/^(part|group|shape):/.test(e)?e:`target:${e}`}}const ao={hide:"hidden",solo:"solo",lock:"locked"},ro=(e,t,i)=>{for(let n=i,s=0;n&&s<4;n=so(e,n),s++)if(t.locked.includes(n))return!0;return!1},oo={rotate:"rotate",rotate_speed:"rotate",x:"x",y:"y",scale:"scale",opacity:"opacity",draw:"draw",color_mix:"color"};function lo(e,t){return e.map(e=>t.reduce(Ns,e)).filter(e=>!Ts(e))}function co(e){const t=e=>/^(part|group|shape):/.test(e)?e:`target:${e}`;return"keys"===e.kind?(e.keys??[]).map(e=>"*"===e.lane?t(e.target):`lane:${e.target}|${e.lane}`):(e.targets?.length?e.targets:e.target?[e.target]:[]).map(t)}function po(e,t,i){return t.locked.length>0&&co(i).some(i=>ro(e,t,i))}function ho(e,t,i){return uo(e,e=>e===t?i:t<i?e>t&&e<=i?e-1:e:e>=i&&e<t?e+1:e)}function uo(e,t){const i=e=>{let i=!1;const n=[];for(const s of e){const e=/^step:(\d+)$/.exec(s);if(!e){n.push(s);continue}const a=t(Number(e[1]));a!==Number(e[1])&&(i=!0),a>=0&&n.push(`step:${a}`)}return i?n:e},n={hidden:i(e.hidden),solo:i(e.solo),locked:i(e.locked),open:i(e.open)};return n.hidden===e.hidden&&n.solo===e.solo&&n.locked===e.locked&&n.open===e.open?e:n}const mo=n.AH`
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
`;function go(e,t,i){return n.qy`<div class="lock-banner" role="status"><ha-icon icon="mdi:lock-outline"></ha-icon><span class="txt">${Zn(452)}</span><button type="button" class="btn btn-text btn-sm unlock" @click=${n=>{const s=function(e,t,i){const n=new Set;for(const s of i)for(let i=s,a=0;i&&a<4;i=so(e,i),a++)t.locked.includes(i)&&n.add(i);return n.size?{...t,locked:t.locked.filter(e=>!n.has(e))}:t}(e,t,i);n.currentTarget.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:s,announce:Zn(1067)},bubbles:!0,composed:!0}))}}>${Zn(1066)}</button></div>`}const fo={fall:"fall",rise:"rise",drift:"drift",burst:"burst",orbit:"orbit",spiral:"spiral",fountain:"rise",explode:"burst",wave:"drift",vortex:"spiral",zigzag:"fall",rain:"fall",wander:"drift"},vo=["circle","square","triangle","star","heart","ring","line","spark"],bo={parents:60,childrenPerParent:8,elements:160,shapes:6,emitters:4,parts:2,stopsPerElement:32,warnBytes:65536,maxBytes:131072,dt:1/60,geometryVariants:4},yo={aspect:2};function xo(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,1|e),e^=e+Math.imul(e^e>>>7,61|e),((e^e>>>14)>>>0)/4294967296}}const wo=(e,t)=>{let i=Math.imul(e>>>0^Math.imul(t,2654435761),2246822507);return i^=i>>>13,i=Math.imul(i,3266489909),(i^i>>>16)>>>0};function _o(e,[t,i]){const n=Math.min(t,i),s=Math.max(t,i),a=e();return s===n?n:n+a*(s-n)}const ko=Math.PI/180;function $o(e){const t=e.angle*ko;return{x:-Math.sin(t)*e.strength,y:Math.cos(t)*e.strength}}const Mo=e=>e*e*(3-2*e),So=(e,t,i)=>e+(t-e)*i;function Co(e,t,i,n){const s=Math.floor(t),a=Math.floor(i),r=Math.floor(n),o=Mo(t-s),l=Mo(i-a),c=Mo(n-r),d=(t,i,n)=>function(e,t,i,n){let s=e^Math.imul(t,668265261)^Math.imul(i,374761393)^Math.imul(n,2654435761);return s=Math.imul(s^s>>>15,2246822507),s=Math.imul(s^s>>>13,3266489909),((s^s>>>16)>>>0)/4294967296}(e,s+t,a+i,r+n),p=So(So(d(0,0,0),d(1,0,0),o),So(d(0,1,0),d(1,1,0),o),l),h=So(So(d(0,0,1),d(1,0,1),o),So(d(0,1,1),d(1,1,1),o),l);return 2*So(p,h,c)-1}const Ao=2*Math.PI,jo=Math.PI/180,zo=(e,t,i)=>t/2+(e()-.5)*t*(Math.max(0,i)/100),qo=e=>Math.max(5,e.spread/2),Eo=(e,t)=>{e.x=t.W/2,e.y=t.H/2},Lo=(e,t,i,n)=>{n.x+=3*(t-e.vx),n.y+=3*(i-e.vy)},Po=(e,t)=>{const i=e.x-t.W/2,n=e.y-t.H/2,s=Math.hypot(i,n)||1e-6,a=i/s,r=n/s;return{r:s,ux:a,uy:r,tx:-r*e.dir,ty:a*e.dir}},Ho=(e,t)=>{const i=t*jo;e.vx=Math.sin(i)*e.speed,e.vy=-Math.cos(i)*e.speed},Vo=e=>Math.max(.1,e.lifeMean/4),Do={persistent:!1,spawn(e,t,i,n){e.x=zo(t,i.W,i.spread),e.y=-n,e.vx=0,e.vy=e.speed}},To={fall:Do,rise:{persistent:!1,spawn(e,t,i,n){e.x=zo(t,i.W,i.spread),e.y=i.H+n,e.vx=0,e.vy=-e.speed}},drift:{persistent:!1,spawn(e,t,i,n){e.x=-n,e.y=zo(t,i.H,i.spread),e.vx=e.speed,e.vy=0}},burst:{persistent:!1,spawn(e,t,i){Eo(e,i),Ho(e,360*t())}},orbit:{persistent:!0,spawn(e,t,i){const n=t()*Ao,s=qo(i);e.x=i.W/2+Math.cos(n)*s,e.y=i.H/2+Math.sin(n)*s;const a=Po(e,i);e.vx=a.tx*e.speed,e.vy=a.ty*e.speed},accel(e,t,i){const n=Po(e,t),s=2*(qo(t)-n.r);Lo(e,n.tx*e.speed+n.ux*s,n.ty*e.speed+n.uy*s,i)}},spiral:{persistent:!1,spawn(e,t,i){const n=t()*Ao;e.x=i.W/2+Math.cos(n),e.y=i.H/2+Math.sin(n);const s=Po(e,i);e.vx=(.6*s.ux+s.tx)*e.speed,e.vy=(.6*s.uy+s.ty)*e.speed},accel(e,t,i){const n=Po(e,t);Lo(e,(.6*n.ux+n.tx)*e.speed,(.6*n.uy+n.ty)*e.speed,i)}},fountain:{persistent:!1,spawn(e,t,i,n){e.x=i.W/2+(t()-.5)*i.W*(Math.max(0,i.spread)/100)*.25,e.y=i.H+n,Ho(e,40*(t()-.5))},fall:e=>2*e.vMean/Math.max(.1,e.lifeMean)},explode:{persistent:!1,spawn(e,t,i){Eo(e,i),Ho(e,150*(t()-.5))},fall:e=>1.5*e.vMean/Math.max(.1,e.lifeMean)},wave:{persistent:!1,spawn(e,t,i,n){const s=t()*Ao,a=2*Ao/Math.max(.2,i.lifeMean);e.baseY=zo(t,i.H,i.spread),e.x=-n,e.y=e.baseY+8*Math.sin(s),e.vx=e.speed,e.vy=8*a*Math.cos(s)},accel(e,t,i){const n=2*Ao/Math.max(.2,t.lifeMean);i.y+=-n*n*(e.y-e.baseY)}},vortex:{persistent:!1,spawn(e,t,i){const n=t()*Ao,s=Math.max(10,i.spread/2);e.x=i.W/2+Math.cos(n)*s,e.y=i.H/2+Math.sin(n)*s;const a=Po(e,i);e.vx=a.tx*e.speed,e.vy=a.ty*e.speed},accel(e,t,i){const n=Po(e,t),s=n.r>2?.4:0;Lo(e,(n.tx-n.ux*s)*e.speed,(n.ty-n.uy*s)*e.speed,i)}},zigzag:{persistent:!1,spawn(e,t,i,n){Do.spawn(e,t,i,n);const s=Vo(i);e.baseX=e.x,e.vx=24*-e.dir/s},accel(e,t,i){const n=Vo(t),s=Math.floor(e.age/n)%2==0?1:-1;i.x+=s*e.dir*48/(n*n)}},rain:{persistent:!1,align:!0,spawn(e,t,i,n){e.x=t()*i.W*(.2+Math.max(0,i.spread)/100)-.1*i.W,e.y=-n,e.vx=0,e.vy=e.speed}},wander:{persistent:!0,spawn(e,t,i){e.x=zo(t,i.W,i.spread),e.y=zo(t,i.H,i.spread),e.baseX=e.x,e.baseY=e.y,Ho(e,360*t())},accel(e,t,i){const n=Co(625341585^t.noiseSeed,e.x/20,e.y/20,.4*e.age)*Ao;Lo(e,Math.cos(n)*e.speed+.8*(e.baseX-e.x),Math.sin(n)*e.speed+.8*(e.baseY-e.y),i)}}},Oo=bo.dt,Ro=2*Oo,No={builtin:"circle"},Fo=e=>({age:e.age,x:e.x,y:e.y,vx:e.vx,vy:e.vy}),Bo=([e,t])=>(e+t)/2,Io=(e,t)=>Math.min(Math.max(e,Ro),Math.max(Ro,Math.min(20,t-Ro)));function Zo(e,t,i){const n=e.sim,s=i.aspect>0?i.aspect:2,a=s>=1?100*s:100,r=s>=1?100:100/s,o=To[n.flow]??To.fall,l=wo(n.seed,3),c={W:a,H:r,spread:e.spread,vMean:Math.abs(Bo(n.ranges.speed)),lifeMean:Io(Bo(n.ranges.lifetime),t),noiseSeed:l},d=function(e,t,i,n){const s=t.content,a="none"!==e.content&&s&&s.w>0&&s.h>0?{x0:s.x/100*i,y0:s.y/100*n,x1:(s.x+s.w)/100*i,y1:(s.y+s.h)/100*n}:void 0;return{floor:e.floor,ceiling:e.ceiling,left:e.left,right:e.right,...a?{content:a}:{}}}(n.colliders,i,a,r),p=((e,t)=>({x:e.x+t.x,y:e.y+t.y}))($o(n.physics.gravity),{x:0,y:o.fall?.(c)??0});return{spec:e,sim:n,period:t,W:a,H:r,flow:o,ctx:c,physics:n.physics,colliders:d,...d.content?{content:d.content}:{},gravity:p,rest:(h=p,2+2*Math.hypot(h.x,h.y)*Oo),noiseSeed:l};var h}const Ko=(e,t)=>{const i=function(e,t){const i=e();let n=0;for(const e of t)n+=e>0?e:0;if(!(n>0))return 0;let s=0;const a=i*n;for(let e=0;e<t.length;e++)if(s+=t[e]>0?t[e]:0,a<s)return e;for(let e=t.length-1;e>=0;e--)if(t[e]>0)return e;return 0}(e,t.map(e=>e.weight));return t.length?t[i].shape:No},Wo=e=>e/2/120*100;function Uo(e,t,i){const{sim:n,spec:s,period:a}=e,r=Ko(t,n.shapes),o=_o(t,s.size),l=_o(t,n.ranges.speed),c=_o(t,n.ranges.spin),d=t()<.5?-c:c,p=_o(t,n.ranges.delay),h=_o(t,n.ranges.lifetime),u=_o(t,n.ranges.opacity),m=t()<.5?-1:1,g=Wo(o),f=e.flow.persistent&&a<=20,v={index:i,x:0,y:0,vx:0,vy:0,age:0,speed:l,dir:m,baseX:0,baseY:0,birth:a>0?(Math.max(0,p)%a+a)%a:0,life:f?a:Io(h,a),spin:d,peak:u,size:o,radius:g,shape:r,...s.colors.length?{color:s.colors[i%s.colors.length]}:{},persistent:f,physics:e.physics,gravity:e.gravity,flow:e.flow};return e.flow.spawn(v,t,e.ctx,g),v}function Go(e,t,i,n){if(e.persistent)return i?.675+.325*Math.cos(t/n*Math.PI*2):1;const s=i?.1*e.life:Oo;return Math.max(0,Math.min(1,t/s,(e.life-t)/s))}function Yo(e,t){let i=t.spin*t.age;return t.flow?.align&&(t.vx||t.vy)&&(i+=180*Math.atan2(-t.vx,t.vy)/Math.PI),{age:t.age,x:t.x,y:t.y,rotate:i,opacity:t.peak*Go(t,t.age,e.spec.fade,e.period),scale:1}}function Jo(e,t,i){const n={x:t.gravity.x,y:t.gravity.y},s=function(e,t,i,n){if(!(t.strength>0))return{x:0,y:0};const s=Math.max(1,t.scale),a=.6*n;return{x:Co(e,i.x/s,i.y/s,a)*t.strength,y:Co(1540483477^e,i.x/s,i.y/s,a+17)*t.strength}}(e.noiseSeed,t.physics.turbulence,t,t.age);n.x+=s.x,n.y+=s.y,t.flow?.accel?.(t,e.ctx,n);const a=((e,t)=>e>0?Math.exp(-e*t):1)(t.physics.drag,i);return t.vx=(t.vx+n.x*i)*a,t.vy=(t.vy+n.y*i)*a,t.x+=t.vx*i,t.y+=t.vy*i,t.age+=i,function(e,t,i,n,s,a,r,o){let l;const c=(t,i,n,s)=>{e.x=n,e.y=s;const c=e.vx*t+e.vy*i;if(c>=0)return;const d=e.vx-c*t,p=e.vy-c*i,h=Math.sqrt(Math.max(0,a));let u=-c*a;u<r&&(u=0),e.vx=d*h+u*t,e.vy=p*h+u*i,-c>=r&&!l&&(l={age:o,x:n,y:s,nx:t,ny:i,speed:-c})};s.floor&&e.y>n-t&&c(0,-1,e.x,n-t),s.ceiling&&e.y<t&&c(0,1,e.x,t),s.left&&e.x<t&&c(1,0,t,e.y),s.right&&e.x>i-t&&c(-1,0,i-t,e.y);const d=s.content;if(d&&e.x>d.x0-t&&e.x<d.x1+t&&e.y>d.y0-t&&e.y<d.y1+t){const i=e.x-(d.x0-t),n=d.x1+t-e.x,s=e.y-(d.y0-t),a=d.y1+t-e.y,r=Math.min(i,n,s,a);r===s?c(0,-1,e.x,d.y0-t):r===a?c(0,1,e.x,d.y1+t):r===i?c(-1,0,d.x0-t,e.y):c(1,0,d.x1+t,e.y)}return l}(t,t.radius,e.W,e.H,e.colliders,t.physics.bounce,e.rest,t.age)}function Xo(e,t,i){const n=[Yo(e,t)],s=[];let a=void 0!==i&&i<=0?Fo(t):void 0;const r=t.x,o=t.y,l=Math.ceil(t.life/Oo-1e-9);for(let c=0;c<l;c++){const d=Math.min(Oo,t.life-t.age);if(d<=1e-12)break;const p=Jo(e,t,d);c===l-1&&(t.age=t.life),p&&s.push({...p,vx:t.vx,vy:t.vy}),void 0!==i&&!a&&t.age>=i-1e-9&&(a=Fo(t));const h=Yo(e,t);if(t.persistent){const e=Math.max(0,Math.min(1,(t.age-.85*t.life)/(.15*t.life))),i=e*e*(3-2*e);h.x+=(r-h.x)*i,h.y+=(o-h.y)*i}n.push(h)}const c=n[n.length-1];return{samples:n,hits:s,...a?{at:a}:{},end:{...Fo(t),x:c.x,y:c.y}}}const Qo=Math.PI/180,el=e=>e?Math.max(0,Math.min(bo.childrenPerParent,Math.floor(e.count))):0;function tl(e,t){return"collision"===e.trigger?t.hits[0]:"time"===e.trigger?t.at:t.end}function il(e,t,i,n,s,a){const r=el(t),{physics:o,gravity:l}=function(e,t){const i=t.physics??{},n={...e.physics,...i},s=e.gravity.y-$o(e.physics.gravity).y,a=$o(n.gravity);return{physics:n,gravity:{x:a.x,y:a.y+s}}}(e,t),c=Math.hypot(n.vx,n.vy),d=void 0!==n.nx&&void 0!==n.ny?Math.atan2(n.nx,-n.ny):c>1e-9?Math.atan2(n.vx,-n.vy):0,p=Math.max(0,Math.min(360,t.cone))*Qo,h=[];for(let c=0;c<r;c++){const r=Ko(s,t.shapes),u=_o(s,t.size),m=_o(s,t.ranges.speed),g=_o(s,t.ranges.spin),f=s()<.5?-g:g,v=Io(_o(s,t.ranges.lifetime),e.period),b=_o(s,t.ranges.opacity),y=d+(s()-.5)*p;if(c>=a)continue;const x=t.colors.length?t.colors[c%t.colors.length]:i.color;h.push({index:c,x:n.x,y:n.y,vx:Math.sin(y)*m+n.vx*t.inherit,vy:-Math.cos(y)*m+n.vy*t.inherit,age:0,speed:m,dir:1,baseX:n.x,baseY:n.y,birth:((i.birth+n.age)%e.period+e.period)%e.period,life:v,spin:f,peak:b,size:u,radius:Wo(u),shape:r,...void 0!==x?{color:x}:{},persistent:!1,physics:o,gravity:l})}return h}function nl(e,t,i){const n=t.t-e.t,s=n>0?(i.t-e.t)/n:0,a=i=>e[i]+(t[i]-e[i])*s;return Math.max(Math.abs(i.x-a("x")),Math.abs(i.y-a("y")),Math.abs(i.rotate-a("rotate"))/3.6,100*Math.abs(i.opacity-a("opacity")),100*Math.abs(i.scale-a("scale")))}function sl(e){const t=e.length,i=new Float64Array(t);if(!t)return i;i[0]=1/0,i[t-1]=1/0;for(let n=1;n<t-1;n++)e[n].keep&&(i[n]=1/0);const n=[];for(let e=0;e<t;e++)i[e]===1/0&&n.push(e);const s=[];for(let e=0;e+1<n.length;e++)s.push([n[e],n[e+1],1/0]);for(;s.length;){const[t,n,a]=s.pop();if(n-t<2)continue;let r=-1,o=t+1;for(let i=t+1;i<n;i++){const s=nl(e[t],e[n],e[i]);s>r&&(r=s,o=i)}const l=Math.min(r,a);i[o]=l,s.push([t,o,l],[o,n,l])}return i}function al(e,t,i,n){let s=0;for(let e=0;e<t.length;e++)t[e]>i&&s++;let a=i;if(s>n){const s=Array.from(t).sort((e,t)=>t-e);if(a=Math.max(i,s[n-1]===1/0?1/0:s[n]),a===1/0)return e.filter((e,i)=>t[i]===1/0).slice(0,n)}return e.filter((e,i)=>t[i]>a)}const rl=e=>e.reduce((e,t)=>e+t,0);function ol(e){const t=[e,...(e.sim.emitters??[]).slice(0,bo.emitters-1).map(t=>((e,t)=>({...e,count:t.count,size:t.size,colors:t.colors,fade:t.fade,spread:t.spread,layer:t.layer??e.layer,sim:{...e.sim,seed:t.seed,flow:t.flow,shapes:t.shapes,ranges:t.ranges,physics:t.physics,children:t.children}}))(e,t))];let i=bo.parents;const n=t.map(e=>{const t=Math.min(Math.max(0,Math.floor(e.count)),i);return i-=t,t}),s=t.map((e,t)=>n[t]*el(e.sim.children)),a=bo.elements-rl(n);let r=s;if(rl(s)>a){const e=rl(n.filter((e,t)=>s[t]));r=s.map((t,i)=>t&&Math.min(t,Math.floor(a*n[i]/e)));let t=a-rl(r);r=r.map((e,i)=>e<s[i]&&t-- >0?e+1:e)}const o="front"!==e.layer,l=t.map((e,t)=>({spec:e,n:n[t],m:r[t],at:0,front:"front"===e.layer,index:t})),c=e=>e.front===o,d=[...l.filter(e=>!c(e)),...l.filter(c)];let p=0;d.forEach(e=>{e.at=p,p+=e.n+e.m});const h=d.findIndex(c);return{plans:d,cut:h<0?d.length:h,pool:p}}const ll=e=>e.cut<e.plans.length?e.plans[e.cut].at:e.pool,cl=bo,dl=[.5,1,2,4,8,16,32],pl=(e,t)=>{const i=10**t,n=Math.round(e*i)/i;return 0===n?0:n},hl=(e,t,i)=>Math.min(i,Math.max(t,e));function ul(e){const t=Number.isFinite(e.aspect)&&e.aspect>0?e.aspect:2,i=hl(Math.round(4*t)/4,.25,8),n=e.content;if(!n||![n.x,n.y,n.w,n.h].every(Number.isFinite))return{aspect:i};const s=e=>hl(5*Math.round(e/5),0,100);return{aspect:i,content:{x:s(n.x),y:s(n.y),w:s(n.w),h:s(n.h)}}}function ml(e){return`${(e=>pl(100*e,3))(e.t)}%{translate:${e.x}cqw ${e.y}cqh;rotate:${e.rotate}deg;opacity:${e.opacity}${1!==e.scale?`;scale:${e.scale}`:""}}`}const gl=e=>e.reduce((e,t)=>e+ml(t).length,160);function fl(e,t,i){const n=e.period,s=i.map(e=>({...e,tau:t.birth+e.age}));let a;if(t.persistent?s[s.length-1]={...s[0],tau:t.birth+n}:(s[0].keep=!0,s[s.length-1].keep=!0,s.push({...s[0],tau:t.birth+n,keep:!0})),t.birth<=0)a=s;else{let e=s.findIndex(e=>e.tau>=n);e<1&&(e=1);const t=s[e].tau===n?{...s[e],keep:!0}:((e,t,i)=>{const n=t.tau>e.tau?(i-e.tau)/(t.tau-e.tau):0,s=i=>e[i]+(t[i]-e[i])*n;return{tau:i,age:s("age"),x:s("x"),y:s("y"),rotate:s("rotate"),opacity:s("opacity"),scale:s("scale"),keep:!0}})(s[e-1],s[e],n),i=s.slice(0,e),r=s.slice(s[e].tau===n?e+1:e,-1).map(e=>({...e,tau:e.tau-n}));a=[{...t,tau:0},...r,...i,{...t,tau:n}]}const r=t.persistent?360*Math.round(t.spin*n/360):0,o=a.map(i=>({t:i.tau/n,x:i.x/e.W*100,y:i.y/e.H*100,rotate:t.persistent?r*i.tau/n:i.rotate,opacity:i.opacity,scale:i.scale,...i.keep?{keep:!0}:{}}));return o[0].t=0,o[o.length-1].t=1,o}function vl(e){const t=[];return e.forEach((i,n)=>{const s=n===e.length-1?1:pl(i.t,5),a={t:s,x:pl(i.x,2),y:pl(i.y,2),rotate:pl(i.rotate,1),opacity:pl(hl(i.opacity,0,1),3),scale:pl(i.scale,3)},r=t[t.length-1];r&&r.t>=s?(n===e.length-1||i.keep)&&(t[t.length-1]=a):t.push(a)}),t}function bl(e){const t=e.period>0&&Number.isFinite(e.period)?e.period:1,i=ul(e.geometry),n=ol(e.spec),s=[],a={elements:0,stops:0,bytes:0,capped:!1,warn:!1};let r=0;n.plans.forEach((e,o)=>{o===n.cut&&(r=s.length);const l=function(e,t,i,n){const s=e.spec,a=s.sim,r=Zo(s,t,i),o=e.n;let l=Math.floor(s.count)>o;const c=a.children,d=el(c),p=xo(a.seed),h=[],u=[];for(let e=0;e<o;e++){const t=Uo(r,p,e),i=Xo(r,t,"time"===c?.trigger?c.at??0:void 0);u.push(i);const n=fl(r,t,i.samples);h.push({p:t,raw:n,rank:sl(n)})}const m=[];if(c&&d>0){const t=h.map((e,t)=>tl(c,u[t])?t:-1).filter(e=>e>=0),i=e.m,n=t.length?Math.floor(i/t.length):0,s=t.length?i%t.length:0;t.length*d>i&&(l=!0);const o=xo(wo(a.seed,2));t.forEach((e,t)=>{const i=Math.min(d,n+(t<s?1:0)),a=tl(c,u[e]);for(const t of il(r,c,h[e].p,a,o,i)){const i=fl(r,t,Xo(r,t).samples);m.push({p:t,raw:i,rank:sl(i),parent:e})}})}let g=d,f=[],v=0;for(;;){const e=[...h,...m.filter(e=>e.p.index<g)];for(const t of dl){f=[],v=0;const i=new Map;if(e.forEach((e,n)=>{void 0===e.parent&&i.set(e.p.index,n);const s=vl(al(e.raw,e.rank,t,cl.stopsPerElement));v+=gl(s),f.push({slot:n,...void 0!==e.parent?{parent:i.get(e.parent)}:{},shape:{...e.p.shape},size:pl(e.p.size,2),...void 0!==e.p.color?{color:e.p.color}:{},stops:s})}),v<=n)break;l=!0}if(v<=n||0===g)break;g=Math.floor(g/2)}for(;v>n&&f.length;){const e=f.pop();v-=gl(e.stops),l=!0}const b=f.reduce((e,t)=>e+t.stops.length,0);return{engine:1,period:t,geometry:i,elements:f,stats:{elements:f.length,stops:b,bytes:v,capped:l,warn:v>cl.warnBytes}}}(e,t,i,n.plans[1]?Math.floor(cl.maxBytes*(e.n+e.m)/n.pool):cl.maxBytes);l.elements.forEach(t=>s.push({...t,slot:t.slot+e.at,...void 0!==t.parent?{parent:t.parent+e.at}:{}})),a.stops+=l.stats.stops,a.bytes+=l.stats.bytes,a.capped||=l.stats.capped}),a.elements=s.length,a.warn=a.bytes>cl.warnBytes;const o=n.plans[n.cut];return{engine:1,period:t,geometry:i,elements:s,stats:a,...o?{parts:{element:r,slot:o.at,front:o.front}}:{}}}const yl=(e,t,i)=>`mcc-${e}-${hn(JSON.stringify([t,i]))}`,xl=(e,t)=>`${e}-g${function(e){const t=e.content;return`${Math.round(4*e.aspect)}${t?`c${t.x}_${t.y}_${t.w}_${t.h}`:""}`}(t)}`;function wl(e){const t=e.shape,i={x:0,phase:0,k:0,style:""};return"builtin"in t?i.shape=t.builtin:"icon"in t?i.symbol={icon:t.icon}:"emoji"in t&&(i.symbol={text:t.emoji}),i}function _l(e,t){if(!e.length)return{t,x:0,y:0,rotate:0,scale:1,opacity:0};const i=e.findIndex(e=>e.t>=t);if(i<=0)return{...e[0===i?0:e.length-1],t};const n=e[i-1],s=e[i],a=s.t>n.t?(t-n.t)/(s.t-n.t):0,r=e=>n[e]+(s[e]-n[e])*a;return{t,x:r("x"),y:r("y"),rotate:r("rotate"),scale:r("scale"),opacity:r("opacity")}}function kl(e,t,i,n,s=e=>e){const a=`.mc-anim-fx[data-fx="${e}"]`,r=`mcp${hn(e)}-`,o=[`${a}{opacity:var(${mn(t,"s")},1)}`,`${a}>i{left:0;top:0;width:var(--mcc-sz);height:var(--mcc-sz);margin:calc(var(--mcc-sz)/-2) 0 0 calc(var(--mcc-sz)/-2);color:var(--mcc-pc,var(${mn(t,"c")},var(--mc-anim-c)));display:flex;align-items:center;justify-content:center;font-size:var(--mcc-sz);line-height:1;font-style:normal;--mdc-icon-size:var(--mcc-sz);${n?"animation-timing-function:linear":"animation:none"}}`],l=new Map;return i.forEach((e,t)=>{const i=s(t);"svg"in e.shape&&l.set(e.shape.svg,[...l.get(e.shape.svg)??[],i]);const c=n?`animation-name:${r}${i};`:"",d=e.color?st(e.color,"color"):void 0;var p;o.push(`${a}>i:nth-child(${i+1}){${c}--mcc-sz:${p=e.size,Math.round(100*p)/100||0}px${d?`;--mcc-pc:${d}`:""}}`),n&&o.push(`@keyframes ${r}${i}{${n(t)}}`)}),l.forEach((e,t)=>{const i=Ne(t).markup,n=i?`-webkit-mask:${jn(i)} center/contain no-repeat;mask:${jn(i)} center/contain no-repeat`:"border-radius:50%";o.push(`${a}>i:is(${e.map(e=>`:nth-child(${e+1})`).join(",")}){background:currentColor;${n}}`)}),o.join("\n")}function $l(e,t,i,n,s=0,a=e.elements.length,r=0){const o=e.elements.slice(s,a),l=o.map(e=>n?.[e.slot]??(e=>({shape:e.shape,size:e.size,...void 0!==e.color?{color:e.color}:{}}))(e));return{css:kl(t,i,l,e=>o[e].stops.map(ml).join(""),n?e=>o[e].slot-r:void 0),slots:(n??l).map(wl)}}const Ml={circle:{d:"M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z"},square:{d:"M5 5h14v14H5z"},triangle:{d:"M12 4l8 15H4z"},star:{d:"M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"},heart:{d:"M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"},ring:{d:"M12 5.5a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z",stroke:3},line:{d:"M6 19L18 5",stroke:3},spark:{d:"M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"}};function Sl(e){const t=Ml[e];return t.stroke?`<path d="${t.d}" fill="none" stroke="currentColor" stroke-width="${t.stroke}" stroke-linecap="round"/>`:`<path d="${t.d}"/>`}const Cl=[".mc-anim-fx>i[data-s]{background:currentColor}",'.mc-anim-fx>i[data-s="circle"]{border-radius:50%}','.mc-anim-fx>i[data-s="square"]{border-radius:0}',...vo.filter(e=>"circle"!==e&&"square"!==e).map(e=>`.mc-anim-fx>i[data-s="${e}"]{${(e=>{const t=jn(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${Sl(e)}</svg>`);return`-webkit-mask:${t} center/contain no-repeat;mask:${t} center/contain no-repeat`})(e)}}`)].join("\n"),Al=e=>String(Math.round(100*e)/100||0),jl=e=>String(Math.round(1e3*e)/1e3||0),zl=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");function ql(e){const t=void 0!==e?st(e,"color"):void 0;return t&&!/var\(/i.test(t)?t:void 0}const El=(e,t)=>`transform:translate(${Al(e.x)}px,${Al(e.y)}px) rotate(${Al(e.rotate)}deg) scale(${jl(e.scale*t)});opacity:${jl(e.opacity)}`,Ll="particles.sim",Pl=[...Ge,"fountain","explode","wave","vortex","zigzag","rain","wander"],Hl=["death","collision","time"],Vl=["none","icon","text"],Dl=[0,1e3],Tl=[-3600,3600],Ol=[0,6e3],Rl=[.01,600],Nl=[0,1],Fl=[.001,1e3],Bl=[-360,360],Il=[0,1e3],Zl=[0,20],Kl=[0,1e3],Wl=[.1,1e3],Ul=[0,1],Gl=[0,600],Yl=[.1,200],Jl=[0,360],Xl=[0,1],Ql={speed:[20,40],spin:[0,0],delay:[0,2],lifetime:[2,2],opacity:[1,1]},ec={gravity:{angle:0,strength:0},drag:0,turbulence:{strength:0,scale:20},bounce:.5},tc={floor:!1,ceiling:!1,left:!1,right:!1,content:"none"},ic=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function nc(e,t,i,n,s,a,r){const o=t[i];if(null==o)return[...a];if(!Array.isArray(o)||2!==o.length||!o.every(e=>"number"==typeof e&&Number.isFinite(e)))return e.err(n,"Must be [min, max]."),[...a];let[l,c]=o;if(l>c&&(r||e.err(n,"Min must not be above max."),[l,c]=[c,l]),l<s[0]||c>s[1]){if(e.err(n,`Must be between ${s[0]} and ${s[1]}.`),!r)return[...a];l=Math.min(s[1],Math.max(s[0],l)),c=Math.min(s[1],Math.max(s[0],c))}return[l,c]}const sc=(e,t,i,n,s,a,r=!1)=>e.num(t,i,n,s[0],s[1],a,r)??a;function ac(e,t,i){if(null==t)return[];const n=e.list(t,i,bo.shapes),s=[];return n?.forEach((t,n)=>{const a=e.obj(t,`${i}[${n}]`);if(!a)return;const r=function(e,t,i){const n=e.obj(t,i);if(!n)return;const s=["builtin","icon","emoji","svg"].filter(e=>void 0!==n[e]&&""!==n[e]);if(1!==s.length)return e.err(i,"Set one of builtin, icon, emoji or svg.");const a=s[0],r=n[a];if("string"!=typeof r)return e.err(`${i}.${a}`,"Must be text.");if("builtin"===a)return vo.includes(r)?{builtin:r}:e.err(`${i}.builtin`,`Must be one of: ${vo.join(", ")}.`);if("icon"===a)return ot.test(r.trim())?{icon:r.trim()}:e.err(`${i}.icon`,"Must be an icon id like mdi:star.");if("emoji"===a){const t=r.trim();return t&&[...t].length<=8&&!/[<>&"'\\{};]/.test(t)?{emoji:t}:e.err(`${i}.emoji`,"Must be up to 8 characters (an emoji or a symbol).")}if(o=r,("undefined"!=typeof TextEncoder?(new TextEncoder).encode(o).length:o.length)>Se)return e.err(`${i}.svg`,"The SVG is larger than 32 KB.");var o;if(!/<svg[\s>]/i.test(r))return e.err(`${i}.svg`,"No <svg> element found.");if("undefined"!=typeof DOMParser){const t=Ne(r);if(t.error)return e.err(`${i}.svg`,t.error)}return{svg:r}}(e,a.shape,`${i}[${n}].shape`),o=e.num(a,"weight",`${i}[${n}].weight`,Fl[0],Fl[1],1);r&&void 0!==o&&s.push({shape:r,weight:o})}),s}function rc(e,t,i){if(null==t)return[];const n=[];return e.list(t,i,Xe)?.forEach((t,s)=>{const a=st(t,"color");a?n.push(a):e.err(`${i}[${s}]`,"Not a valid colour.")}),n}function oc(e,t,i,n,s){if(null==t)return s?{}:{...n};const a=e.obj(t,i);if(!a)return s?{}:{...n};const r={},o=e=>!s||void 0!==a[e]&&null!==a[e];if(o("gravity")){const t=ic(a.gravity)?a.gravity:e.obj(a.gravity??{},`${i}.gravity`)??{};r.gravity={angle:sc(e,t,"angle",`${i}.gravity.angle`,Bl,n.gravity.angle),strength:sc(e,t,"strength",`${i}.gravity.strength`,Il,n.gravity.strength)}}if(o("drag")&&(r.drag=sc(e,a,"drag",`${i}.drag`,Zl,n.drag)),o("turbulence")){const t=ic(a.turbulence)?a.turbulence:e.obj(a.turbulence??{},`${i}.turbulence`)??{};r.turbulence={strength:sc(e,t,"strength",`${i}.turbulence.strength`,Kl,n.turbulence.strength),scale:sc(e,t,"scale",`${i}.turbulence.scale`,Wl,n.turbulence.scale)}}return o("bounce")&&(r.bounce=sc(e,a,"bounce",`${i}.bounce`,Ul,n.bounce)),r}function lc(e,t,i){if(null==t)return{...tc};const n=e.obj(t,i);return n?{floor:e.bool(n,"floor",`${i}.floor`,!1),ceiling:e.bool(n,"ceiling",`${i}.ceiling`,!1),left:e.bool(n,"left",`${i}.left`,!1),right:e.bool(n,"right",`${i}.right`,!1),content:e.oneOf(n,"content",`${i}.content`,Vl,"none")??"none"}:{...tc}}function cc(e,t,i,n){const s=e.obj(t,i);if(!s)return;const a=e.errors.length;void 0!==s.children&&null!==s.children&&e.err(`${i}.children`,"Children cannot have children of their own.");const r=e.oneOf(s,"trigger",`${i}.trigger`,Hl);r||void 0!==s.trigger||e.err(`${i}.trigger`,"Required.");const o=ic(s.ranges)?s.ranges:e.obj(s.ranges??{},`${i}.ranges`)??{},l={trigger:r??"death",count:sc(e,s,"count",`${i}.count`,[1,bo.childrenPerParent],3,!0),shapes:ac(e,s.shapes,`${i}.shapes`),size:nc(e,s,"size",`${i}.size`,Yl,[4,6],n),colors:rc(e,s.colors,`${i}.colors`),ranges:{speed:nc(e,o,"speed",`${i}.ranges.speed`,Dl,[20,40],n),lifetime:nc(e,o,"lifetime",`${i}.ranges.lifetime`,Rl,[.5,1],n),opacity:nc(e,o,"opacity",`${i}.ranges.opacity`,Nl,[1,1],n),spin:nc(e,o,"spin",`${i}.ranges.spin`,Tl,[0,0],n)},cone:sc(e,s,"cone",`${i}.cone`,Jl,360),inherit:sc(e,s,"inherit",`${i}.inherit`,Xl,0)};"time"===l.trigger?l.at=sc(e,s,"at",`${i}.at`,Gl,.5):void 0===s.at||null===s.at||n||e.err(`${i}.at`,"Only for the trigger time.");const c=oc(e,s.physics,`${i}.physics`,ec,!0);return Object.keys(c).length&&(l.physics=c),n&&e.errors.length>a?void 0:l}const dc=/^[a-z0-9-]{1,16}$/;function pc(e,t,i,n,s){const a=ic(t.ranges)?t.ranges:e.obj(t.ranges??{},`${i}.ranges`)??{},r=Ql;return{seed:sc(e,t,"seed",`${i}.seed`,[0,4294967295],0,!0)>>>0,flow:s,shapes:ac(e,t.shapes,`${i}.shapes`),ranges:{speed:nc(e,a,"speed",`${i}.ranges.speed`,Dl,r.speed,n),spin:nc(e,a,"spin",`${i}.ranges.spin`,Tl,r.spin,n),delay:nc(e,a,"delay",`${i}.ranges.delay`,Ol,r.delay,n),lifetime:nc(e,a,"lifetime",`${i}.ranges.lifetime`,Rl,r.lifetime,n),opacity:nc(e,a,"opacity",`${i}.ranges.opacity`,Nl,r.opacity,n)},physics:oc(e,t.physics,`${i}.physics`,ec,!1)}}function hc(e,t,i,n,s,a){const r="string"==typeof t.id&&dc.test(t.id)&&!n.has(t.id)?t.id:"";r?n.add(r):(s||null!=t.id)&&e.err(`${i}.id`,"Must be 1-16 of a-z, 0-9 and -, and unique.");const o="string"==typeof t.name?t.name.trim():void 0;return(void 0===o?null!=t.name:o.length>40&&!a)&&e.err(`${i}.name`,"Must be text of at most 40 characters."),{id:r,name:o?.slice(0,40)||void 0}}function uc(e,t,i){const n="lenient"===t,s=new ut,a=s.obj(e,Ll);if(!a)return{errors:s.errors};if(1!==a.engine&&(s.err(`${Ll}.engine`,void 0===a.engine?"Required.":"This card plays engine 1; update Magic Card to play this animation."),n))return{errors:s.errors};const r=s.oneOf(a,"flow",`${Ll}.flow`,Pl);if(!r&&(void 0===a.flow&&s.err(`${Ll}.flow`,"Required."),n))return{errors:s.errors};const o={engine:1,mode:s.oneOf(a,"mode",`${Ll}.mode`,["baked","live"],"baked")??"baked",...pc(s,a,Ll,n,r??"fall"),colliders:lc(s,a.colliders,`${Ll}.colliders`)};if(void 0!==a.children&&null!==a.children){const e=cc(s,a.children,`${Ll}.children`,n);e&&(o.children=e)}if(void 0!==a.emitters&&null!==a.emitters){const e=hc(s,a,Ll,new Set,!1,n),t=function(e,t,i,n,s){const a=`${Ll}.emitters`,r=bo.emitters-1,o=new Set(n?[n]:[]),l=[];e.list(t,a,i?1/0:r)?.slice(0,r).forEach((t,n)=>{const s=`${a}[${n}]`,r=e.obj(t,s);if(!r)return;const{id:c,name:d}=hc(e,r,s,o,!0,i),p=e.oneOf(r,"layer",`${s}.layer`,["front","back"]),h=e.errors.length,u=e.oneOf(r,"flow",`${s}.flow`,Pl);u||e.err(`${s}.flow`,"Required.");const m={id:c,...d&&{name:d},...p&&{layer:p},count:sc(e,r,"count",`${s}.count`,[1,bo.parents],10,!0),size:nc(e,r,"size",`${s}.size`,Yl,[6,10],i),colors:rc(e,r.colors,`${s}.colors`),fade:e.bool(r,"fade",`${s}.fade`,!0),spread:sc(e,r,"spread",`${s}.spread`,[0,100],100),...pc(e,r,s,i,u??"fall")},g=e.errors.length===h,f=null==r.children?void 0:cc(e,r.children,`${s}.children`,i);f&&(m.children=f),i&&!g||l.push(m)});let c=s+l.reduce((e,t)=>e+t.count,0)-bo.parents;if(c>0){e.err(a,`At most ${bo.parents} particles over all emitters.`);for(let e=l.length;i&&c>0&&e--;){const t=Math.min(c,l[e].count);l[e].count-=t,c-=t}}const d=l.filter(e=>e.count>0),p=new Set(n?[n]:[]);d.forEach(e=>e.id&&!p.has(e.id)?p.add(e.id):e.id="");let h=0;return d.forEach(e=>{if(!e.id){for(;p.has("e"+ ++h););p.add(e.id=`e${h}`)}}),d}(s,a.emitters,n,e.id,i?Math.max(0,Math.floor(i.count)):1);t.length&&Object.assign(o,e.id&&{id:e.id},e.name&&{name:e.name},{emitters:t})}return{sim:o,errors:s.errors}}const mc=(e,t)=>{const i=e._$AN;if(void 0===i)return!1;for(const e of i)e._$AO?.(t,!1),mc(e,t);return!0},gc=e=>{let t,i;do{if(void 0===(t=e._$AM))break;i=t._$AN,i.delete(e),e=t}while(0===i?.size)},fc=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),yc(t)}};function vc(e){void 0!==this._$AN?(gc(this),this._$AM=e,fc(this)):this._$AM=e}function bc(e,t=!1,i=0){const n=this._$AH,s=this._$AN;if(void 0!==s&&0!==s.size)if(t)if(Array.isArray(n))for(let e=i;e<n.length;e++)mc(n[e],!1),gc(n[e]);else null!=n&&(mc(n,!1),gc(n));else mc(this,e)}const yc=e=>{e.type==z.OA.CHILD&&(e._$AP??=bc,e._$AQ??=vc)};class xc extends z.WL{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),fc(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(mc(this,e),gc(this))}setValue(e){if(E(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}let wc;const _c=new WeakMap,kc=new Set,$c=new WeakMap,Mc=new WeakSet,Sc=new WeakSet,Cc=new WeakSet;function Ac(e,t){for(let i=e;i;i=i.parentNode instanceof ShadowRoot?i.parentNode.host:i.parentNode)if(t?i===t:Cc.has(i))return!0;return!1}function jc(e,t){const i=t&&(Mc.has(e)||!Ac(e));e.toggleAttribute("offscreen",!i),_c.get(e)?.(i)}function zc(e,t=!0,i=!0){const n=function(){if(!wc&&"undefined"!=typeof IntersectionObserver){wc=new IntersectionObserver(e=>{for(const t of e)$c.set(t.target,t.isIntersecting),jc(t.target,t.isIntersecting)});const[e,t]=[wc.observe.bind(wc),wc.unobserve.bind(wc)];wc.observe=t=>{kc.add(t),e(t)},wc.unobserve=e=>{kc.delete(e),$c.delete(e),t(e)}}return wc}();return!!n&&(t?Mc.delete(e):Mc.add(e),i?Sc.delete(e):Sc.add(e),n.observe(e),!0)}function qc(e){wc?.unobserve(e),e.removeAttribute("offscreen")}(0,z.u$)(class extends xc{constructor(e){if(super(e),this._counted=!0,e.type!==z.OA.ELEMENT)throw new Error("pauseOffscreen() is an element directive")}render(e){return n.s6}update(e,[t]){const i=!1!==t?.counted;var s;return e.element!==this._el?(this._unwatch(),this._el=e.element,this._counted=i,this.isConnected&&zc(this._el,!0,i)&&(s=this._el,queueMicrotask(()=>Ac(s)&&jc(s,!1)))):i!==this._counted&&(this._counted=i,this.isConnected&&zc(this._el,!0,i)),n.s6}_unwatch(){this._el&&qc(this._el)}disconnected(){this._unwatch()}reconnected(){this._el&&zc(this._el,!0,this._counted)}});const Ec=bo.dt,Lc=Math.ceil(.1/Ec)+1,Pc=e=>Math.round(100*e)/100;function Hc(e,t,i){const n=Zo(e,t,yo),s=i?i.n:Math.min(Math.max(0,Math.floor(e.count)),bo.parents),a=xo(e.sim.seed),r=[];for(let e=0;e<s;e++){const t=Uo(n,a,e);r.push({shape:t.shape,size:Pc(t.size),...void 0!==t.color?{color:t.color}:{}})}const o=e.sim.children,l=el(o),c=i?i.m:o&&s?Math.min(s*l,bo.elements-s):0,d=xo(wo(e.sim.seed,5));for(let e=0;e<c;e++){const t=Ko(d,o.shapes),i=_o(d,o.size),n=o.colors.length?o.colors[e%o.colors.length]:r[Math.floor(e/Math.max(1,l))%s].color;r.push({shape:t,size:Pc(i),...void 0!==n?{color:n}:{}})}return{parents:s,children:c,looks:r}}const Vc=(e,t)=>e.plans.map(e=>Hc(e.spec,t,e));function Dc(e,t,i){const n=1e-6;return t.ny<0&&t.y>=e.H-i-n?"floor":t.ny>0&&t.y<=i+n?"ceiling":t.nx>0&&t.x<=i+n?"left":t.nx<0&&t.x>=e.W-i-n?"right":"content"}const Tc=e=>({age:e.age,x:e.x,y:e.y,vx:e.vx,vy:e.vy});class Oc{constructor(e,t,i,n=Hc(e,t)){this.faces=new Set,this.slots=[],this.world=Zo(e,t,i),this.layout=n,this.rng=xo(e.sim.seed),this.crng=xo(wo(e.sim.seed,2));for(let e=0;e<n.parents;e++){const t=this.spawn(e);this.slots.push({next:t,wait:t.birth,fired:!1})}this.kids=new Array(n.children).fill(void 0)}spawn(e){const t=Uo(this.world,this.rng,e);return t.size=this.layout.looks[e].size,t.radius=Wo(t.size),t.persistent&&(t.life=1/0),t}emit(e,t,i){e.fired=!0;const n=this.world.sim.children;if(!n)return;const s=[];for(let e=0;e<this.kids.length&&s.length<el(n);e++)this.kids[e]||s.push(e);il(this.world,n,t,i,this.crng,s.length).forEach((e,t)=>{e.size=this.layout.looks[this.layout.parents+s[t]].size,e.radius=Wo(e.size),this.kids[s[t]]=e})}step(){const e=this.world,t=e.sim.children;this.slots.forEach((i,n)=>{if(!i.p){if(i.wait-=Ec,i.wait>1e-9)return;i.p=i.next,i.fired=!1}const s=i.p,a=Jo(e,s,Ec);a&&(this.faces.add(Dc(e,a,s.radius)),"collision"!==t?.trigger||i.fired||this.emit(i,s,{...a,vx:s.vx,vy:s.vy})),"time"===t?.trigger&&!i.fired&&s.age>=(t.at??0)-1e-9&&this.emit(i,s,Tc(s)),s.age>=s.life-1e-9&&("death"!==t?.trigger||i.fired||this.emit(i,s,Tc(s)),i.p=void 0,i.next=this.spawn(n),i.wait=i.next.birth)}),this.kids.forEach((t,i)=>{if(!t)return;const n=Jo(e,t,Ec);n&&this.faces.add(Dc(e,n,t.radius)),t.age>=t.life-1e-9&&(this.kids[i]=void 0)})}frame(){const e=this.world,t=t=>{if(!t)return;const i=Yo(e,t);return{x:i.x/e.W*100,y:i.y/e.H*100,rotate:i.rotate,opacity:i.opacity,scale:i.scale}};return[...this.slots.map(e=>t(e.p)),...this.kids.map(t)]}}const Rc=["translate","rotate","scale","opacity","animation"],Nc=(e,t)=>{const i=10**t;return Math.round(e*i)/i||0};function Fc(e,t,i=!1){const n=e.children;for(let e=0;e<n.length;e++){const s=n[e].style;i&&s.setProperty("animation","none");const a=t[e];!a||a.opacity<=0?"0"!==s.getPropertyValue("opacity")&&s.setProperty("opacity","0"):(s.setProperty("translate",`${Nc(a.x,2)}cqw ${Nc(a.y,2)}cqh`),s.setProperty("rotate",`${Nc(a.rotate,1)}deg`),s.setProperty("opacity",String(Nc(a.opacity,3))),1!==a.scale?s.setProperty("scale",String(Nc(a.scale,3))):s.removeProperty("scale"))}}function Bc(e){for(const t of e.children)for(const e of Rc)t.style.removeProperty(e)}const Ic=new Map;let Zc=0,Kc=0,Wc=!1;const Uc=()=>"undefined"==typeof document||"hidden"!==document.visibilityState,Gc=()=>{for(const e of Ic.values())if(e.on)return!0;return!1};function Yc(){Zc&&"function"==typeof cancelAnimationFrame&&cancelAnimationFrame(Zc),Zc=0,Kc=0}function Jc(){!Zc&&Uc()&&Gc()&&"function"==typeof requestAnimationFrame&&(Zc=requestAnimationFrame(Xc))}function Xc(e){Zc=0;const t=Kc?Math.min(.1,Math.max(0,(e-Kc)/1e3)):Ec;Kc=e;for(const e of[...Ic.values()])if(e.el.isConnected){if(e.on){e.acc+=t;for(let t=0;e.acc>=Ec-1e-9&&t<Lc;t++){for(const t of e.sims)t.step();e.acc-=Ec}Fc(e.el,e.sims.flatMap(e=>e.frame()))}}else td(e.el);Gc()&&Uc()?Zc=requestAnimationFrame(Xc):Kc=0}function Qc(){Uc()?Jc():Yc()}function ed(e,t,i,n){const s=ol(e),a=Vc(s,t);return s.plans.flatMap((e,r)=>r>=s.cut==!!n?[new Oc(e.spec,t,i,a[r])]:[])}function td(e){var t;Ic.delete(e)&&(t=e,_c.delete(t),qc(t),Bc(e),Gc()||Yc())}const id=new Map;function nd(e,t,i,n,s,a){const r=ol(t),o=((e,t)=>Vc(e,t).flatMap(e=>e.looks))(r,i),l=t=>{const i=s?xl(t?n+"o":n,s):`${t?n+"o":n}-g0`,l=((e,t)=>[t.slice(0,ll(e)),t.slice(ll(e))])(r,o)[t],c=a?$l(a,i,e,o,t?a.parts.element:0,t?void 0:a.parts?.element,t?a.parts.slot:0).css:function(e,t,i){return{css:kl(t,i,e),slots:e.map(wl)}}(l,i,e).css;return{name:i,css:c,slots:l.map(wl)}},c=l(0),d=r.cut<r.plans.length?l(1):void 0,p="front"===t.layer,h=!!s&&!a&&r.plans.some(e=>Math.floor(e.spec.count)>e.n||e.m<e.n*el(e.spec.sim.children)),u=a?a.stats:{elements:o.length,stops:0,bytes:c.css.length+(d?.css.length??0),capped:h,warn:!1},m=ll(r),g=r.plans.map((e,t)=>({index:e.index,part:t<r.cut?0:1,first:e.at-(t<r.cut?0:m),parents:e.n,children:e.m})).sort((e,t)=>e.index-t.index);return{compiled:{mode:t.sim.mode,...c,front:p,...d?{other:{...d,front:!p}}:{},emitterSlots:g,stats:u},...a?{loop:a}:{},plan:r,still:[]}}function sd(e,t,i,n){const s=ul(n),a=yl(e,t,i),r=xl(a,s);let o=id.get(a);const l=o?.get(r);if(o&&l)return o.delete(r),o.set(r,l),id.delete(a),id.set(a,o),l;const c=nd(e,t,i,a,s,"live"===t.sim.mode?void 0:bl({spec:t,period:i,geometry:s}));if(!o)for(o=new Map,id.set(a,o);id.size>32;)id.delete(id.keys().next().value);for(o.set(r,c);o.size>bo.geometryVariants;)o.delete(o.keys().next().value);return c}const ad=new WeakSet;let rd=!1;var od;od=uc,Ie.simValidator=od;const ld={version:"1.2.0",validateSim:uc,bake:bl,bakedCss:$l,bakedSvg:function(e,t){const i=Number.isFinite(t.width)&&t.width>0?Math.round(t.width):200,n=Number.isFinite(t.height)&&t.height>0?Math.round(t.height):100,s=e.period>0&&Number.isFinite(e.period)?e.period:1,a=`p${hn(JSON.stringify([e.period,e.geometry,e.elements.length,e.stats.bytes]))}`,r=void 0!==t.background?ql(t.background):void 0,o=new Map,l=`<svg xmlns="http://www.w3.org/2000/svg" width="${i}" height="${n}" viewBox="0 0 ${i} ${n}" fill="currentColor" color="#03a9f4">`,c=r?`<path d="M0 0H${i}V${n}H0z" fill="${zl(r)}"/>`:"";let d=l.length+c.length+64;const p=[],h=[],u=[],m=e=>({...e,x:e.x/100*i,y:e.y/100*n}),g=e.elements.map((e,t)=>t);return e.parts&&!e.parts.front&&g.push(...g.splice(0,e.parts.element)),g.forEach(t=>{const i=e.elements[t],n=(e=>{const t=JSON.stringify(e);let i=o.get(t);return i||o.set(t,i=function(e){const t=(e,t,i,n,s)=>({markup:`<g transform="translate(${jl(-(t+n/2))} ${jl(-(i+s/2))})">${e}</g>`,grid:Math.max(n,s)||24});if("builtin"in e)return t(Sl(e.builtin),0,0,24,24);if("svg"in e){const i=Ne(e.svg);if(!i.error){const e=new Set(i.evenodd?.paths??[]),n=new Set(i.evenodd?.accent??[]),s=[...i.paths.map((t,i)=>`<path d="${zl(t)}"${e.has(i)?' fill-rule="evenodd"':""}/>`),...i.accentPaths.map((e,t)=>`<path d="${zl(e)}"${n.has(t)?' fill-rule="evenodd"':""}/>`),...i.strokes.map(e=>`<path d="${zl(e.d)}" fill="none" stroke="currentColor" stroke-width="${jl(e.width)}"${e.cap?` stroke-linecap="${zl(e.cap)}"`:""}${e.join?` stroke-linejoin="${zl(e.join)}"`:""}/>`)].join(""),[a,r,o,l]=i.viewBox.split(/[\s,]+/).map(Number);if(s.length<=2048&&[a,r,o,l].every(Number.isFinite)&&o>0&&l>0)return t(s,a,r,o,l)}}return t('<path d="M12 5a7 7 0 1 0 0 14a7 7 0 1 0 0-14z"/>',0,0,24,24)}(e)),i})(i.shape),s=ql(i.color),r=`<g class="${a}e${t}"${s?` color="${zl(s)}"`:""}>${n.markup}</g>`;if(d+r.length>31744)return;d+=r.length,p.push(r);const l=i.size/n.grid;h.push(`.${a}e${t}{${El(m(_l(i.stops,.5)),l)}}`);const c=i.stops.map(e=>`${jl(100*e.t)}%{${El(m(e),l)}}`).join("");u.push(`.${a} .${a}e${t}{animation-name:${a}a${t}}@keyframes ${a}a${t}{${c}}`)}),[l,`<style>${[`.${a}>g{transform-box:view-box;transform-origin:0 0}`,...h,`@media (prefers-reduced-motion:no-preference){.${a}>g{animation-duration:${jl(s)}s;animation-timing-function:linear;animation-iteration-count:infinite}`,...u,"}"].join("\n")}</style>`,c,`<g class="${a}">`,...p,"</g>","</svg>"].join("\n")},apply:function(e,t){try{const{spec:i,period:n,docId:s}=t;if(!i?.sim)throw new Error("the animation has no particle simulation");t.useCss("mcp-shapes",Cl);const a=function(e,t){const i=e.getBoundingClientRect();if(!(i.width>0&&i.height>0))return;const n={aspect:i.width/i.height};if("none"!==t.spec.sim.colliders.content){const e=t.content?.()?.getBoundingClientRect();e&&e.width>0&&e.height>0&&(n.content={x:(e.left-i.left)/i.width*100,y:(e.top-i.top)/i.height*100,w:e.width/i.width*100,h:e.height/i.height*100})}return ul(n)}(e,t),r=a??yo,o=sd(s,i,n,r),l=t.part?1:0,c=l?o.compiled.other:o.compiled;if(e.getAttribute("data-fx")!==c.name&&(t.useCss(c.name,c.css),e.setAttribute("data-fx",c.name)),t.reducedMotion)return td(e),Fc(e,function(e,t,i,n,s){if(e.still[s])return e.still[s];const a=[],r=e.loop;if(r){const e=r.parts?.element??r.elements.length;r.elements.slice(s?e:0,s?void 0:e).forEach(e=>a[e.slot-(s?r.parts.slot:0)]=_l(e.stops,.5))}else{const e=ed(t,i,n,s),r=Math.round(Math.min(.5*i,3)/bo.dt);for(const t of e)for(let e=0;e<r;e++)t.step();a.push(...e.flatMap(e=>e.frame()))}return e.still[s]=a}(o,i,n,r,l),!0),void ad.add(e);ad.delete(e)&&Bc(e),"live"===i.sim.mode?function(e,t,i,n,s,a=0){if(Ic.get(e)?.key===s)return;td(e),Wc||"undefined"==typeof document||(document.addEventListener("visibilitychange",Qc),Wc=!0);const r=ed(t,i,n,a),o={el:e,sims:r,key:s,on:!1,acc:0};var l,c;Ic.set(e,o),l=e,c=t=>{Ic.get(e)===o&&(o.on=t,t?Jc():Gc()||Yc())},_c.set(l,c),zc(l,!0,!0)||(o.on=!0,Jc())}(e,i,n,r,c.name,l):td(e)}catch(e){rd||(rd=!0,console.warn("Magic Card: a particle layer could not be set up; it plays its simple version.",e))}},release:function(e){td(e),ad.delete(e)&&Bc(e)}},cd=function(e,t,i,n){return n.aspect>0?sd(e,t,i,n).compiled:nd(e,t,i,yl(e,t,i)).compiled},dd=new WeakMap;function pd(e){const t="particles"===e.kind?e.particles:void 0;if(!t?.sim)return;if(dd.has(t))return dd.get(t);let i;try{const n=uc(t.sim,"lenient").sim;if(n){const s={...t,sim:n},a=cd(e.id,s,e.duration/t.speed,{aspect:0}),r=Jr({...e,particles:{...t,sim:n}});a.emitterSlots&&(i={base:a.name.replace(/-g\w+$/,""),emitterSlots:a.emitterSlots,ids:r})}}catch{i=void 0}return dd.set(t,i),i}function hd(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e&&e!==document.body?e:null}function ud(e,t,i){const s="alert"===e.variant;return n.qy`<mc-ui-window
    variant=${e.variant??"sheet"}
    size=${e.size??n.s6}
    heading=${e.heading}
    closeLabel=${Zn(171)}
    ?movable=${!s}
    ?resizable=${!s}
    ?maximizable=${!s}
    moveLabel=${Zn(504)}
    resizeLabel=${Zn(760)}
    maximizeLabel=${Zn(462)}
    restoreLabel=${Zn(761)}
    initialFocus=${e.initialFocus??n.s6}
    .dismissible=${e.dismissible??!s}
    @mc-window-close=${t=>{t.stopPropagation(),e.onClose()}}
  >
    ${t}${i?n.qy`<div slot="footer" class="foot">${i}</div>`:n.s6}
  </mc-ui-window>`}const md=new WeakMap;function gd(e,t=18){return e.glyph&&m(e.glyph)?u(e.glyph,t):e.icon?n.qy`<ha-icon icon=${e.icon}></ha-icon>`:n.s6}(0,z.u$)(class extends xc{render(e){return j.s6}update(e,[t]){const i=t!==this.G;return i&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),j.s6}rt(e){if(void 0!==this.G)if(this.isConnected||(e=void 0),"function"==typeof this.G){const t=this.ht??globalThis;let i=md.get(t);void 0===i&&(i=new WeakMap,md.set(t,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,e),void 0!==e&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return"function"==typeof this.G?md.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});const fd=n.AH`.lip{position:absolute;z-index:var(--mc-lip-z,4);top:var(--mc-lip-top,50%);transform:translateY(-50%);box-sizing:border-box;display:grid;place-items:center;width:28px;height:72px;margin:0;padding:0;border:1px solid var(--mc-text-2);background:var(--mc-surface);color:var(--mc-text-2);font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:left var(--mc-lip-ms,200ms) ease,right var(--mc-lip-ms,200ms) ease}.lip svg{width:18px;height:18px;pointer-events:none}.lip[aria-expanded='false']{border-color:var(--mc-text-2);background:var(--mc-accent-fill);color:var(--mc-on-accent)} .lip[data-side='start']{left:var(--mc-lip-at-start,0);inset-inline-start:var(--mc-lip-at-start,0);border-left-width:0;border-radius:0 8px 8px 0}.lip[data-side='start'][data-dir='rtl']{left:auto;right:var(--mc-lip-at-start,0);border-left-width:1px;border-right-width:0;border-radius:8px 0 0 8px}.lip[data-side='end']{right:var(--mc-lip-at-end,0);inset-inline-end:var(--mc-lip-at-end,0);border-right-width:0;border-radius:8px 0 0 8px}.lip[data-side='end'][data-dir='rtl']{right:auto;left:var(--mc-lip-at-end,0);border-right-width:1px;border-left-width:0;border-radius:0 8px 8px 0} .lip[data-side='start'][aria-expanded='true'] svg,.lip[data-side='end'][aria-expanded='false'] svg{transform:scaleX(-1)}.lip[data-side='start'][aria-expanded='true'][data-dir='rtl'] svg,.lip[data-side='end'][aria-expanded='false'][data-dir='rtl'] svg{transform:none}.lip[data-side='start'][aria-expanded='false'][data-dir='rtl'] svg,.lip[data-side='end'][aria-expanded='true'][data-dir='rtl'] svg{transform:scaleX(-1)} .lip:focus{outline:2px solid var(--mc-focus);outline-offset:-3px}.lip:focus:not(:focus-visible){outline:none}.lip:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-3px}.lip[aria-expanded='false']:focus{outline:2px solid var(--mc-on-accent);outline-offset:-4px}.lip[aria-expanded='false']:focus:not(:focus-visible){outline:none}.lip[aria-expanded='false']:focus-visible{outline:2px solid var(--mc-on-accent);outline-offset:-4px}@media (hover:hover){.lip:hover{background:var(--mc-surface-2);border-color:var(--mc-text);color:var(--mc-text)}.lip[aria-expanded='false']:hover{background:var(--mc-accent-fill);border-color:var(--mc-text-2);color:var(--mc-on-accent);box-shadow:inset 0 0 0 100vmax rgba(0,0,0,.15)}}.lip:active{background:var(--mc-accent-tint);color:var(--mc-accent-ink)}.lip[aria-expanded='false']:active{background:var(--mc-accent-fill);color:var(--mc-on-accent);box-shadow:inset 0 0 0 100vmax rgba(0,0,0,.15)} @media (pointer:coarse){.lip::after{content:'';position:absolute;top:50%;height:72px;transform:translateY(-50%)}.lip[data-side='start']::after{left:100%;width:17px}.lip[data-side='end']::after{right:100%;width:17px}.lip[data-side='start'][data-dir='rtl']::after{left:auto;right:100%}.lip[data-side='end'][data-dir='rtl']::after{right:auto;left:100%}.lip[aria-expanded='false']::after{width:calc(17px + var(--mc-lip-pull,0px))} .lip[aria-expanded='false'][data-side='start']{left:calc(var(--mc-lip-at-start,0px) + var(--mc-lip-edge-gap,0px))}.lip[aria-expanded='false'][data-side='end']{right:calc(var(--mc-lip-at-end,0px) + var(--mc-lip-edge-gap,0px))}.lip[aria-expanded='false'][data-side='start'][data-dir='rtl']{left:auto;right:calc(var(--mc-lip-at-start,0px) + var(--mc-lip-edge-gap,0px))}.lip[aria-expanded='false'][data-side='end'][data-dir='rtl']{right:auto;left:calc(var(--mc-lip-at-end,0px) + var(--mc-lip-edge-gap,0px))}} [data-lip]{transition:transform var(--mc-lip-ms,200ms) ease,visibility 0s linear 0s}[data-lip='hidden']{visibility:hidden;pointer-events:none;transform:translateX(var(--mc-lip-off,0px));transition:transform var(--mc-lip-ms,200ms) ease,visibility 0s linear var(--mc-lip-ms,200ms)}[data-lip='hidden'][data-dir='rtl']{transform:translateX(calc(-1 * var(--mc-lip-off,0px)))}@media (prefers-reduced-motion:reduce){[data-lip],[data-lip='hidden'],.lip{transition:none}} .lip-hint{position:absolute;z-index:var(--mc-lip-z,4);top:var(--mc-lip-top,50%);transform:translateY(-50%);box-sizing:border-box;width:max-content;max-width:min(260px,var(--mc-lip-hint-max,260px));padding:12px;border:1px solid var(--mc-text-2);border-radius:var(--mc-radius,8px);background:var(--mc-surface);color:var(--mc-text);box-shadow:var(--mc-shadow-float);font-size:.8125rem;line-height:1.4;animation:lip-hint-in 160ms ease-out;transition:left var(--mc-lip-ms,200ms) ease,right var(--mc-lip-ms,200ms) ease}.lip-hint p{margin:0 0 8px}.lip-hint .lip-hint-keys{color:var(--mc-text-2)}@media (hover:none){.lip-hint .lip-hint-keys{display:none}}.lip-hint button{min-height:var(--mc-hit,40px);padding:0 12px;border:1px solid var(--mc-text-2);border-radius:var(--mc-radius,8px);background:var(--mc-surface);color:var(--mc-text);font:inherit;cursor:pointer}.lip-hint button:focus{outline:2px solid var(--mc-focus);outline-offset:2px}.lip-hint button:focus:not(:focus-visible){outline:none}.lip-hint button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px}@media (pointer:coarse){.lip-hint button{min-height:44px}} .lip-hint::before{content:'';position:absolute;top:50%;width:10px;height:10px;margin-top:-5px;border:1px solid var(--mc-text-2);background:var(--mc-surface)}.lip-hint[data-side='start']{left:calc(var(--mc-lip-at-start,0px) + 36px);inset-inline-start:calc(var(--mc-lip-at-start,0px) + 36px)}.lip-hint[data-side='start']::before{left:-6px;border-width:0 0 1px 1px;transform:rotate(45deg)}.lip-hint[data-side='end']{right:calc(var(--mc-lip-at-end,0px) + 36px);inset-inline-end:calc(var(--mc-lip-at-end,0px) + 36px)}.lip-hint[data-side='end']::before{right:-6px;border-width:1px 1px 0 0;transform:rotate(45deg)}.lip-hint[data-side='start'][data-dir='rtl']{left:auto;right:calc(var(--mc-lip-at-start,0px) + 36px)}.lip-hint[data-side='start'][data-dir='rtl']::before{left:auto;right:-6px;border-width:1px 1px 0 0}.lip-hint[data-side='end'][data-dir='rtl']{right:auto;left:calc(var(--mc-lip-at-end,0px) + 36px)}.lip-hint[data-side='end'][data-dir='rtl']::before{right:auto;left:-6px;border-width:0 0 1px 1px}@keyframes lip-hint-in{from{opacity:0}to{opacity:1}}@media (prefers-reduced-motion:reduce){.lip-hint{animation:none;transition:none}} .lip-status{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap}`,vd="mc-panels:",bd="mc-panels-hint:",yd="data-mc-lips",xd={"card-studio":["layers","inspector"],"anim-studio":["layers","inspector"],"svg-editor":["side","inspector"],"shape-studio":["side","inspector"],"theme-editor":["variables"]},wd=n.JW`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;function _d(){try{return window.localStorage??null}catch{return null}}class kd{constructor(e,t){this.host=e,this.dir="ltr",this.restoredFrom="none",this.hidden=new Set,this.cols={},this._suspended=!1,this.remembered=null,this.hintDone=!1,this.statusText="",this.frame=0,this.onKeydown=e=>{this.handleKey(e)},this.editor=t.editor,this.panels=t.panels,this.strings=t.strings,this.keys=t.keys??"host",this.fallback=t.fallback,e.addController(this)}hostConnected(){this.host.setAttribute(yd,""),"host"===this.keys&&this.host.addEventListener("keydown",this.onKeydown,{capture:!0}),this.restore()}hostDisconnected(){this.host.removeAttribute(yd),this.host.removeEventListener("keydown",this.onKeydown,{capture:!0}),this.frame&&cancelAnimationFrame(this.frame),this.frame=0}restore(){this.remembered=null,this.readDir(),this.readMemory(),this.hintDone=this.readFlag(),this.host.requestUpdate()}setPanels(e,t){this.panels=e,this.strings=t,this.readDir(),this.host.requestUpdate()}columns(e){const t=new Set([...Object.keys(this.cols),...Object.keys(e)]);let i=!0;for(const n of t)Boolean(this.cols[n])!==Boolean(e[n])&&(i=!1);i||(this.cols={...e},this.host.requestUpdate())}get suspended(){return this._suspended}set suspended(e){e!==this._suspended&&(this._suspended=e,this.host.requestUpdate())}state(e){return!this._suspended&&this.cols[e]&&this.panels.some(t=>t.id===e)?this.hidden.has(e)?"hidden":"shown":"off"}isHidden(e){return"hidden"===this.state(e)}get active(){return!this._suspended&&this.panels.some(e=>this.cols[e.id])}toggle(e){this.remembered=null,this.apply([e],"shown"===this.state(e),"api")}show(e){this.remembered=null,this.apply([e],!1,"api")}hide(e){this.remembered=null,this.apply([e],!0,"api")}toggleAll(){const e=this.panels.map(e=>e.id).filter(e=>"off"!==this.state(e));if(!e.length)return!1;const t=e.filter(e=>!this.hidden.has(e));let i,n;if(t.length)this.remembered=t,i=t,n=!0;else{const t=(this.remembered??[]).filter(t=>e.includes(t));i=t.length?t:e,n=!1,this.remembered=null}return!!this.apply(i,n,"key")&&(this.announce(i,n),!0)}async reveal(e){"hidden"===this.state(e)&&(this.remembered=null,this.apply([e],!1,"reveal"),await this.host.updateComplete)}handleKey(e){if(e.defaultPrevented||!function(e){return(e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&!e.getModifierState?.("AltGraph")&&("\\"===e.key||"Backslash"===e.code)&&!e.repeat&&!e.isComposing}(e))return!1;const t=e.composedPath(),i=t.indexOf(this.host);for(let e=0;e<(i<0?t.length:i);e++){const i=t[e];if(i instanceof Element&&i.hasAttribute(yd))return!1}return e.preventDefault(),this.toggleAll(),!0}apply(e,t,i){const n=this.panels.map(e=>e.id).filter(i=>e.includes(i)&&"off"!==this.state(i)&&this.hidden.has(i)!==t);if(!n.length)return!1;const s=this.root()?.activeElement,a=t?n.filter(e=>{const t=this.panelEl(e);return!!t&&!!s&&t.contains(s)}):[];for(const e of n)t?this.hidden.add(e):this.hidden.delete(e);return t||this.dismissHint(),this.writeMemory(),this.host.requestUpdate(),a.length&&this.host.updateComplete.then(()=>this.lipEl(a[0])?.focus()),this.host.dispatchEvent(new CustomEvent("mc-panels-change",{detail:{editor:this.editor,hidden:this.panels.map(e=>e.id).filter(e=>this.hidden.has(e)),cause:i}})),!0}announce(e,t){const i=this.panels.filter(t=>e.includes(t.id)).map(e=>e.noun),n=t?this.strings.hidden:this.strings.shown,s=this.strings.locale;let a;try{const e=new Intl.ListFormat(s,{type:"conjunction"}).format(i),t=n.replace("{panels}",()=>e);a=t.charAt(0).toLocaleUpperCase(s)+t.slice(1)}catch{const e=n.replace("{panels}",()=>i.join(", "));a=e.charAt(0).toUpperCase()+e.slice(1)}this.statusText="",this.host.requestUpdate(),this.frame&&cancelAnimationFrame(this.frame),this.frame=requestAnimationFrame(()=>{this.frame=0,this.statusText=a,this.host.requestUpdate()})}readDir(){try{this.dir="rtl"===getComputedStyle(this.host).direction?"rtl":"ltr"}catch{this.dir="ltr"}}allowed(e){const t=new Set(xd[this.editor]),i=new Set;for(const n of e)"string"==typeof n&&t.has(n)&&i.add(n);return i}readMemory(){let e;this.hidden=new Set,this.restoredFrom="none";try{const t=_d();if(!t)return;e=t.getItem(vd+this.editor)}catch{return}if(null===e){let e;try{e=this.fallback?.()??null}catch{e=null}const t=this.allowed(e??[]);return void(t.size&&(this.hidden=t,this.restoredFrom="fallback",this.writeMemory()))}if("string"!=typeof e||e.length>64)return;const t=this.allowed(e.split(","));t.size&&(this.hidden=t,this.restoredFrom="stored")}writeMemory(){try{const e=_d();if(!e)return;const t=vd+this.editor,i=xd[this.editor].filter(e=>this.hidden.has(e));i.length?e.setItem(t,i.join(",")):e.removeItem(t)}catch{}}readFlag(){try{return"1"===_d()?.getItem(bd+this.editor)}catch{return!1}}hintPanel(){if(!this.hintDone&&"none"!==this.restoredFrom)return this.panels.find(e=>"hidden"===this.state(e.id))}dismissHint(){if(!this.hintDone){this.hintDone=!0;try{_d()?.setItem(bd+this.editor,"1")}catch{}}}closeHint(e){const t=this.root(),i=t?.getElementById(`${e.controls}-hint`),n=!!i&&!!t?.activeElement&&i.contains(t.activeElement);this.dismissHint(),this.host.requestUpdate(),n&&this.lipEl(e.id)?.focus()}onLipKey(e,t){"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this.closeHint(t))}hintTemplate(e){const t=this.panels.filter(e=>"hidden"===this.state(e.id)),i=this.strings,s="fallback"===this.restoredFrom?i.hintMigrated:1===t.length?i.hintOne.replace("{noun}",()=>t[0].noun):i.hintMany;return n.qy`<div class="lip-hint" id="${e.controls}-hint" data-side=${e.side} data-dir=${this.dir} @keydown=${t=>{"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),this.closeHint(e))}}> <p>${s}</p><p class="lip-hint-keys">${i.hintShortcut}</p><button type="button" @click=${()=>this.closeHint(e)}>${i.gotIt}</button></div>`}lip(e){const t=this.panels.find(t=>t.id===e);if(!t)return n.s6;const i=this.state(e);if("off"===i)return n.s6;const s="hidden"===i,a=this.hintPanel()?.id===e;return n.qy`<button type="button" class="lip" data-side=${t.side} data-dir=${this.dir} aria-expanded=${s?"false":"true"} aria-controls=${t.controls} aria-label=${t.name} title=${s?t.showLabel:t.hideLabel} aria-describedby=${(e=>e??j.s6)(a?`${t.controls}-hint`:void 0)} @click=${t=>{t.currentTarget?.focus(),this.remembered=null,this.apply([e],"shown"===this.state(e),"lip")}} @keydown=${a?e=>this.onLipKey(e,t):n.s6} >${wd}</button>${a?this.hintTemplate(t):n.s6}`}status(){return n.qy`<div class="lip-status" role="status" aria-live="polite" aria-atomic="true">${this.statusText}</div>`}root(){return this.host.renderRoot??this.host.shadowRoot}panelEl(e){const t=this.panels.find(t=>t.id===e);return t?this.root()?.getElementById(t.controls)??null:null}lipEl(e){const t=this.panels.find(t=>t.id===e);if(!t)return null;for(const e of Array.from(this.root()?.querySelectorAll(".lip")??[]))if(e.getAttribute("aria-controls")===t.controls)return e;return null}}class $d{constructor(e,t){this.host=e,this.onChange=t,this.width=0,this.watched=[],e.addController(this)}hostDisconnected(){this.observer?.disconnect(),this.observer=void 0,this.watched=[]}watch(e,...t){const i=[e,...t].filter(e=>!!e);if((i.length!==this.watched.length||i.some((e,t)=>e!==this.watched[t]))&&(this.observer?.disconnect(),this.watched=i,"undefined"!=typeof ResizeObserver)){this.observer=new ResizeObserver(()=>this.measure(e));for(const e of i)this.observer.observe(e)}this.measure(e)}measure(e){const t=e?function(e){let t;try{const i=getComputedStyle(e);t=(parseFloat(i.borderLeftWidth)||0)+(parseFloat(i.borderRightWidth)||0)}catch{t=0}return Math.max(0,Math.round(e.offsetWidth-e.clientWidth-t))}(e):0;t!==this.width&&(this.width=t,this.onChange?.(t),this.host.requestUpdate())}}const Md={horizontal:["ArrowLeft","ArrowRight","Home","End"],vertical:["ArrowUp","ArrowDown","Home","End"],both:["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"]};class Sd{constructor(e){this.opts=e,this.onKeydown=e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.currentTarget,i=Array.from(t.querySelectorAll(this.opts.items)),n=i.indexOf(e.composedPath().find(e=>i.includes(e))),s=function(e,t,i,n="horizontal",s=!0){if(!Md[n].includes(e)||!i.length)return-1;const a=i.length,r=e=>e>=0&&e<a&&!i[e].disabled,o=(e,t)=>{for(let i=1;i<=a;i++){let n=e+t*i;if(s)n=(n+2*a)%a;else if(n<0||n>=a)return e;if(r(n))return n}return e};if("Home"===e)return r(0)?0:o(0,1);if("End"===e)return r(a-1)?a-1:o(a-1,-1);const l="ArrowLeft"===e||"ArrowUp"===e;return o(t<0?l?0:-1:t,l?-1:1)}(e.key,n,i.map(e=>({disabled:e.hasAttribute("disabled")})),this.opts.orientation,this.opts.wrap);s<0||(e.preventDefault(),e.stopPropagation(),this.focus(i,s),this.opts.onMove?.(i[s],s))}}focus(e,t){e.forEach((e,i)=>e.setAttribute("tabindex",i===t?"0":"-1")),e[t]?.focus()}}function Cd(e){const t="tablist"===e.role,i=new Sd({items:"[data-val]",orientation:"horizontal",onMove:t=>{const i=t.dataset.val;i!==e.value&&e.onChange(i)}});return n.qy`<div class="seg${e.full?" full":""}" role=${e.role} aria-label=${e.label} @keydown=${i.onKeydown}> ${e.items.map(i=>{const s=i.value===e.value,a=!!i.disabledReason;return n.qy`<button type="button" role=${t?"tab":"radio"} data-val=${i.value} aria-selected=${t?String(s):n.s6} aria-checked=${t?n.s6:String(s)} aria-disabled=${a?"true":n.s6} tabindex=${s?"0":"-1"} @click=${()=>{a||e.onChange(i.value)}} >${gd(i)}${i.label}</button>`})}</div>`}const Ad="{opacity:0!important}",jd=e=>`"${e.replace(/[\\"]/g,"\\$&").replace(/\n/g,"\\a ")}"`,zd=e=>`.mc-module-wrapper[data-mc-run] [data-mc-part=${jd(e)}]:not(.mc-module-wrapper[data-mc-run] .mc-module-wrapper [data-mc-part])`,qd="data-mc-stage-hide";class Ed{constructor(){this._css={icon:"",card:""},this._sheets={},this._text=new WeakMap}set(e,t){this._css=t,this.attach(e)}attach(e){if(e){this._into(e,"card");for(const t of e.querySelectorAll(".mc-anim-icon"))t.shadowRoot&&this._into(t.shadowRoot,"icon")}}_into(e,t){const i=this._css[t];if("undefined"!=typeof CSSStyleSheet&&"replaceSync"in CSSStyleSheet.prototype&&"undefined"!=typeof ShadowRoot&&"adoptedStyleSheets"in ShadowRoot.prototype){let n=this._sheets[t];return n||(n=new CSSStyleSheet,this._sheets[t]=n,n.replaceSync(i)),this._text.get(n)!==i&&(n.replaceSync(i),this._text.set(n,i)),void(e.adoptedStyleSheets.includes(n)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,n]))}let n=[...e.children].find(e=>"STYLE"===e.tagName&&e.hasAttribute(qd));n||(n=document.createElement("style"),n.setAttribute(qd,""),e.appendChild(n)),n.textContent!==i&&(n.textContent=i)}}const Ld="light.mc_studio_preview",Pd=e=>(e?.clips?.length??0)>0||(e?.bindings?.length??0)>0,Hd={state:"on",value:.6,attributes:{}},Vd=e=>Math.round(1e3*e)/1e3,Dd=(e,t)=>Vd(e.input.min+(e.input.max-e.input.min)*Math.min(1,Math.max(0,t)));function Td(e){const t=e?.bindings??[],i=t.find(e=>!e.input.attribute),n=(e?.clips??[]).some(e=>"above"in e.when||"below"in e.when);return{value:t.length>0||n,numericState:!!i||n,...i?{stateRange:[i.input.min,i.input.max]}:{}}}function Od(e,t){const i={};for(const n of e?.bindings??[])n.input.attribute&&!(n.input.attribute in i)&&(i[n.input.attribute]=Dd(n,t));return i}function Rd(e){const t=new Date(0).toISOString();return{entity_id:Ld,state:e.state??Hd.state,attributes:{friendly_name:Zn(710),...e.attributes??{}},last_changed:t,last_updated:t,context:{id:"mc-studio-preview",parent_id:null,user_id:null}}}function Nd(e){return"state"in e?Zn(909,{state:e.state}):"state_not"in e?Zn(908,{state_not:e.state_not}):"entity_on"in e?e.entity_on?Zn(319):Zn(318):"above"in e?Zn(1092,{above:e.above}):Zn(1094,{below:e.below})}var Fd=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Bd=[{id:"light",label:440,icon:"mdi:white-balance-sunny"},{id:"dark",label:226,icon:"mdi:weather-night"}],Id=[.25,.5,1,1.5,2],Zd=Ld,Kd=(e,t)=>!!t||Pd(e);function Wd(e,t,i,n,s=1){return i>0&&n>0&&e>0&&t>0?Math.max(.2,Math.min(s,e/i,t/n)):1}const Ud={light:"--card-background-color:#ffffff;--primary-background-color:#fafafa;--secondary-background-color:#f2f3f5;--primary-text-color:#212121;--secondary-text-color:#5f6368;--divider-color:rgba(0,0,0,.12);--state-icon-color:#44739e;color-scheme:light",dark:"--card-background-color:#1c1c1c;--primary-background-color:#111111;--secondary-background-color:#282a2d;--primary-text-color:#e1e1e1;--secondary-text-color:#9b9b9b;--divider-color:rgba(225,225,225,.12);--state-icon-color:#9fbcd9;color-scheme:dark"};function Gd(e){return{states:{},entities:{},language:"en",locale:{language:"en",number_format:"language",time_format:"language"},themes:{themes:{},darkMode:e},callWS:async()=>({}),callService:async()=>{}}}class Yd extends n.WF{constructor(){super(...arguments),this.lookup=()=>{},this.tile="icon",this.zoomIcon=!1,this.layerView=Gr,this.hiddenLayers=0,this.theme="light",this.reduced=!1,this.speed=1,this.playing=!0,this._t=0,this._k=1,this._fh=0,this._raf=0,this._last=0,this._lastTimeEvent=0,this._sentTime=-1,this._themeSet=!1,this._sheets=new Ed,this._attachQueued=!1,this._rates=new WeakMap,this._drives=!1,this._canvasOn=!1,this._onCanvasSlot=e=>{this._canvasOn=e.target.assignedElements().length>0},this._loop=()=>{if(!this.isConnected)return;const e=performance.now();if(this.playing&&this._last){const t=this.cycle;this._t=(this._t+(e-this._last)/1e3*this.speed)%t,this._emitTime()}this._last=e,this._raf=requestAnimationFrame(this._loop)}}connectedCallback(){if(super.connectedCallback(),!this._themeSet){this._themeSet=!0;const e=this.hass?.themes?.darkMode;this.theme=e??function(e){const t=/rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(e).color||"");if(!t)return!1;const[i,n,s]=t.slice(1).map(Number);return.2126*i+.7152*n+.0722*s>140}(this)?"dark":"light"}customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate()),this._poll=setInterval(()=>this._sync(),250),this._loop(),this.hasUpdated&&this._observeFrame()}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=void 0,this._mo?.disconnect(),this._mo=this._moRoot=void 0,cancelAnimationFrame(this._raf),this._raf=0,this._poll&&clearInterval(this._poll),this._poll=void 0}get card(){return this._card}get cycle(){return this.doc?function(e,t){if("sequence"===e.kind){const i=Tn(e,{lookup:t}).schedule?.total??0;return i>0?i:1}const i="particles"!==e.kind||e.particles?.preset?1:e.particles?.speed||1;return Math.max(.05,e.duration/i)}(this.doc,this.lookup):1}get scale(){return this._k}togglePlay(){this.playing?this.pause():this.play()}play(){this.playing=!0;for(const e of this._anims())this._rate(e),e.play()}pause(){this.playing=!1;for(const e of this._anims())e.pause()}seek(e){this.playing=!1,this._t=Math.min(this.cycle,Math.max(0,e));for(const e of this._anims())e.pause(),e.currentTime=1e3*this._t;this._emitTime(!0)}_emitTime(e=!1){const t=performance.now(),i=Math.min(1,Math.max(0,this._t/this.cycle));!e&&(t-this._lastTimeEvent<33||i===this._sentTime)||(this._lastTimeEvent=t,this._sentTime=i,this.dispatchEvent(new CustomEvent("stage-time",{detail:{time:i}})))}_observeFrame(){const e=this.shadowRoot?.querySelector(".frame"),t=this.shadowRoot?.querySelector(".area");e&&t&&!this._ro&&"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(()=>this._fit()),this._ro.observe(e),this._ro.observe(t))}_fit(){const e=this.shadowRoot?.querySelector(".frame"),t=this.shadowRoot?.querySelector(".area");if(!e||!t)return;const i=e.offsetHeight,n=this.zoomIcon?this._iconBox(e):void 0;let s,a;if(n&&t.clientWidth>0&&t.clientHeight>0){const e=function(e,t,i){const n=Math.round(1e3*Wd(e-32,t-32,i.width+40,i.height+40,4))/1e3;return{k:n,x:Math.round(e/2-(i.x+i.width/2)*n),y:Math.round(t/2-(i.y+i.height/2)*n)}}(t.clientWidth,t.clientHeight,n);s=e.k,a={x:e.x,y:e.y}}else s=Math.round(1e3*Wd(t.clientWidth-32,t.clientHeight-32,e.offsetWidth,i,1))/1e3;s!==this._k&&(this._k=s),i!==this._fh&&(this._fh=i),a?.x===this._off?.x&&a?.y===this._off?.y||(this._off=a),this.isUpdatePending?this.updateComplete.then(()=>this._emitRect()):this._emitRect()}_emitRect(){const e=this.shadowRoot?.querySelector(".frame");e&&this.dispatchEvent(new CustomEvent("stage-rect",{detail:this._rectDetail(e)}))}_rectDetail(e){const t=this._subjectRect(e),i=this._screenRect(e),n=this._iconViewBox();return{width:e.offsetWidth,height:e.offsetHeight,scale:this._k,...t?{subject:t}:{},...n?{viewBox:n}:{},...i?{screen:i}:{}}}_screenRect(e){const t=this.shadowRoot?.querySelector(".area");if(!t)return;const i=t.getBoundingClientRect(),n=e.getBoundingClientRect(),s=e=>Math.round(100*e)/100;return{left:s(n.left-i.left),top:s(n.top-i.top),width:s(n.width),height:s(n.height)}}_iconViewBox(){const e=this._card?.shadowRoot?.querySelector(".mc-anim-icon"),t="MC-SVG-ICON"===e?.tagName?e.shadowRoot?.querySelector("svg")?.getAttribute("viewBox"):null,i=t?.trim().split(/[\s,]+/).map(Number);return i&&4===i.length&&i.every(Number.isFinite)?i:void 0}_subjectRect(e){const t=this._card?.shadowRoot;if(!t||!this.doc)return;const i=this.subjectTarget,n="name"===i||"state"===i||"background"===i?t.querySelector(`[data-mc-part="${i}"]`):null,s=i?"icon"===i||/^(part|group|shape):/.test(i):"path"===this.doc.kind?"icon"===this.doc.path?.subject:"icon"===this.doc.target,a=n??(s?t.querySelector(".mc-anim-icon"):null)??t.querySelector(".mc-module-wrapper");return this._boxOf(a,e)}_iconBox(e){return this._boxOf(this._card?.shadowRoot?.querySelector(".mc-anim-icon")??null,e)}_boxOf(e,t){const i=e?.offsetParent;if(!e||!i||!e.offsetWidth)return;const n=t.getBoundingClientRect(),s=i.getBoundingClientRect(),a=this._k||1;return{x:Math.round((s.left-n.left)/a+i.clientLeft+e.offsetLeft),y:Math.round((s.top-n.top)/a+i.clientTop+e.offsetTop),width:e.offsetWidth,height:e.offsetHeight}}setSpeed(e){this.speed=e;for(const e of this._anims())this._rate(e)}_rate(e){const t=this._rates.get(e),i=t&&e.playbackRate===t.set?t.base:e.playbackRate,n=i*this.speed;e.playbackRate!==n&&(e.playbackRate=n),this._rates.set(e,{base:i,set:e.playbackRate})}_anims(){return function(e){const t=new Set,i=e=>{for(const i of e.getAnimations?.()??[])t.add(i);for(const t of e.querySelectorAll("*"))t.shadowRoot&&i(t.shadowRoot)};return e&&i(e),[...t]}(this._card?.shadowRoot)}_sync(){for(const e of this._anims())this._rate(e),this.playing||"running"!==e.playState||(e.pause(),e.currentTime=1e3*this._t)}_previewHass(){const e=this.hass,t=this._hassFor,i=Kd(this.doc,this.preview)?(n=this.preview)?function(e,t){return{state:t.state??e.state,value:t.value??e.value,attributes:t.attributes??e.attributes}}(Hd,n):Hd:void 0;var n;if(t&&t.src===e&&t.theme===this.theme&&t.tile===this.tile&&JSON.stringify(t.sim)===JSON.stringify(i))return t.value;const s="dark"===this.theme,a=e?{...e,themes:{...e.themes??{},darkMode:s}}:Gd(s),r=ts(this.tile,a),o=i?function(e,t){const i=e.states??{};return{...e,states:{...i,[Ld]:Rd(t)}}}(r,i):r;return this._hassFor={src:e,theme:this.theme,tile:this.tile,sim:i,value:o},o}willUpdate(e){if(!customElements.get("magic-card")||!this.doc)return;this._card||(this._card=document.createElement("magic-card"));const t=Kd(this.doc,this.preview),i=t!==this._drives;if(this._drives=t,e.has("doc")||e.has("tile")||e.has("reduced")||e.has("lookup")||i||!this._card.shadowRoot)try{this._card.setConfig(hs(this.doc,this.lookup,{tile:this.tile,still:this.reduced,...t?{entity:Zd}:{}}))}catch(e){console.warn("Magic Card studio: preview failed",e)}if(e.has("hass")||e.has("theme")||e.has("preview")||e.has("tile")||e.has("doc")||!this._card.hass){const e=this._previewHass();e!==this._card.hass&&(this._card.hass=e)}}firstUpdated(){this._observeFrame()}_applyHide(){const e=this._card?.shadowRoot;e&&this.doc&&(this._sheets.set(e,((e,t,i)=>{const n=[],s=[],a=no(e,t);for(const t of a){const a=t.indexOf(":"),r=t.slice(0,a),o=t.slice(a+1);"part"===r?n.push(`[data-p=${jd(o)}]${Ad}`):"group"===r?n.push(`[data-g=${jd(o)}]${Ad}`):"shape"===r?n.push(`[data-s=${jd(o)}]${Ad}`):"emitter"!==r||i||e.particles?.sim?"target"===r&&("background"===o?s.push(".mc-module-wrapper{background:none!important}",`[data-mc-gen-bg]${Ad}`):"element"!==o&&s.push(`${zd(o)}${Ad}`)):s.push(`.mc-anim-fx${Ad}`)}return i&&s.push(...function(e,t){const i=[];return t.ids.forEach((n,s)=>{const a=t.emitterSlots.find(e=>e.index===s);if(!a)return;const r=`.mc-anim-fx[data-fx^=${jd(`${t.base}${a.part?"o":""}-g`)}]>i`,o=(e,t)=>{t>=e&&i.push(`${r}:nth-child(n+${e}):nth-child(-n+${t})${Ad}`)};e.has(`emitter:${n}`)?o(a.first+1,a.first+a.parents+a.children):(e.has(`${io}${n}`)&&o(a.first+1,a.first+a.parents),e.has(`children:${n}`)&&o(a.first+a.parents+1,a.first+a.parents+a.children))}),i}(a,i)),{icon:n.join("\n"),card:s.join("\n")}})(this.doc,this.layerView,this.stageParticles)),this._moRoot!==e&&(this._mo?.disconnect(),this._moRoot=e,this._mo=new MutationObserver(()=>{this._attachQueued||(this._attachQueued=!0,queueMicrotask(()=>{this._attachQueued=!1,this._sheets.attach(this._card?.shadowRoot)}))}),this._mo.observe(e,{childList:!0,subtree:!0})))}_showAll(){const e={...this.layerView,hidden:[],solo:[]};this.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:e,announce:this.layerView.locked.length?Zn(47):Zn(46)},bubbles:!0,composed:!0}))}updated(e){(e.has("doc")||e.has("layerView")||e.has("stageParticles")||e.has("tile")||e.has("reduced")||!this._moRoot)&&(this._applyHide(),this._card?.updateComplete?.then(()=>this._applyHide())),e.has("subjectTarget")&&requestAnimationFrame(()=>this._emitRect()),e.has("zoomIcon")&&requestAnimationFrame(()=>this._fit()),(e.has("doc")||e.has("tile")||e.has("reduced")||e.has("preview"))&&this._card?.updateComplete?.then(()=>{this._sync(),requestAnimationFrame(()=>this._fit())})}_pickTile(e){e!==this.tile&&(this.tile=e,this.dispatchEvent(new CustomEvent("stage-tile",{detail:{tile:e},bubbles:!0,composed:!0})))}_seg(e,t,i,s,a){return n.qy`<div class="seg ${a}" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=t.findIndex(e=>e.id===i),a={ArrowRight:(n+1)%t.length,ArrowLeft:(n-1+t.length)%t.length,Home:0,End:t.length-1}[e.key];if(void 0===a)return;e.preventDefault(),s(t[a].id);const r=e.currentTarget;this.updateComplete.then(()=>r.querySelector('[aria-checked="true"]')?.focus())}}>
      ${t.map(e=>{const t=e.id===i;return n.qy`<button
          type="button"
          role="radio"
          aria-checked=${t?"true":"false"}
          tabindex=${t?"0":"-1"}
          title=${Zn(e.label)}
          @click=${()=>s(e.id)}
        >
          <ha-icon icon=${e.icon}></ha-icon><span class="lbl">${Zn(e.label)}</span>
        </button>`})}
    </div>`}_missing(){return n.qy`<div class="missing" role="status">
      <ha-icon icon="mdi:card-off-outline"></ha-icon>
      <strong>${Zn(460)}</strong>
      <p>${Zn(1e3)}</p>
    </div>`}render(){const e=this.cycle,t=Math.min(this._t,e),i=!!customElements.get("magic-card"),s=this._k,a=this._off,r=a?"":`width: ${Math.round(360*s)}px; height: ${this._fh?`${Math.round(this._fh*s)}px`:"auto"}`,o=a?`translate(${a.x}px, ${a.y}px) `:"";return n.qy`
      <div class="canvas">
        <div class="dock dock-top">
          ${this.hiddenLayers>0||this.layerView.solo.length>0?n.qy`<div class="hide-chip" role="group" aria-label=${Zn(431)}>
                <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                <span>${this.hiddenLayers>0?Zn(712,{count:this.hiddenLayers}):Zn(866)}</span>
                <button type="button" class="show-all" aria-label=${Zn(842)} @click=${()=>this._showAll()}>${Zn(841)}</button>
              </div>`:n.s6}
          <slot name="top"></slot>
        </div>
        <div class="area ${this._canvasOn?"canvas-on":""}">
        <div class="fit ${a?"zoomed":""}" style=${r}>
          <div class="frame" style="${Ud[this.theme]};width:${360}px;transform:${o}scale(${s})" data-theme=${this.theme}>
            ${i&&this._card?this._card:this._missing()}
            <div class="overlay"><slot name="overlay"></slot></div>
          </div>
        </div>
        <div class="canvas-layer"><slot name="canvas" @slotchange=${this._onCanvasSlot}></slot></div>
        ${this.reduced&&i?n.qy`<p class="note">${Zn(1107)}</p>`:n.s6}
        ${a?n.qy`<span class="zoom-tag" title=${Zn(1116)}>${Zn(399,{percent:Math.round(100*s)})}</span>`:Math.abs(s-1)>.005?n.qy`<span class="zoom-tag" title=${Zn(999)}>${Math.round(100*s)}%</span>`:n.s6}
        </div>
        <div class="dock dock-bottom"><slot name="bottom"></slot></div>
      </div>
      <div class="transport">
        <button
          type="button"
          class="icon-btn sm play"
          aria-label=${this.playing?Zn(669):Zn(686)}
          title=${this.playing?Zn(669):Zn(686)}
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
          aria-label=${Zn(706)}
          aria-valuetext=${Zn(1248,{now:t.toFixed(2),total:e.toFixed(2)})}
          .value=${String(t)}
          ?disabled=${this.reduced||!i}
          @input=${e=>this.seek(Number(e.target.value))}
        />
        <span class="time mono" aria-hidden="true">${t.toFixed(2)} / ${e.toFixed(2)} s</span>
        <label class="speed">
          <span class="sr-only">${Zn(873)}</span>
          <div class="select">
            <select class="input" aria-label=${Zn(873)} @change=${e=>this.setSpeed(Number(e.target.value))}>
              ${Id.map(e=>n.qy`<option value=${e} ?selected=${e===this.speed}>${e}×</option>`)}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
        </label>
        <span class="view">
          ${this._seg(Zn(714),Xn,this.tile,e=>this._pickTile(e),"tiles")}
          ${this._seg(Zn(137),Bd,this.theme,e=>this.theme=e,"themes")}
          <button
            type="button"
            class="toggle reduced"
            aria-pressed=${this.reduced?"true":"false"}
            aria-label=${Zn(725)}
            title=${Zn(716)}
            @click=${()=>this.reduced=!this.reduced}
          >
            <ha-icon icon="mdi:motion-pause-outline"></ha-icon>
          </button>
        </span>
      </div>
    `}}Yd.styles=[ms,gs,n.AH`
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
    `],Fd([(0,s.MZ)({attribute:!1})],Yd.prototype,"doc",void 0),Fd([(0,s.MZ)({attribute:!1})],Yd.prototype,"lookup",void 0),Fd([(0,s.MZ)({attribute:!1})],Yd.prototype,"hass",void 0),Fd([(0,s.MZ)({attribute:!1})],Yd.prototype,"tile",void 0),Fd([(0,s.MZ)({attribute:!1})],Yd.prototype,"preview",void 0),Fd([(0,s.MZ)({attribute:!1})],Yd.prototype,"subjectTarget",void 0),Fd([(0,s.MZ)({type:Boolean})],Yd.prototype,"zoomIcon",void 0),Fd([(0,s.MZ)({attribute:!1})],Yd.prototype,"layerView",void 0),Fd([(0,s.MZ)({attribute:!1})],Yd.prototype,"stageParticles",void 0),Fd([(0,s.MZ)({type:Number})],Yd.prototype,"hiddenLayers",void 0),Fd([(0,s.wk)()],Yd.prototype,"theme",void 0),Fd([(0,s.wk)()],Yd.prototype,"reduced",void 0),Fd([(0,s.wk)()],Yd.prototype,"speed",void 0),Fd([(0,s.wk)()],Yd.prototype,"playing",void 0),Fd([(0,s.wk)()],Yd.prototype,"_t",void 0),Fd([(0,s.wk)()],Yd.prototype,"_k",void 0),Fd([(0,s.wk)()],Yd.prototype,"_fh",void 0),Fd([(0,s.wk)()],Yd.prototype,"_off",void 0),Fd([(0,s.wk)()],Yd.prototype,"_canvasOn",void 0);var Jd=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Xd={"Glow & pulse":"mdi:lightbulb-on-outline",Motion:"mdi:rotate-right",Playful:"mdi:emoticon-happy-outline","Light & colour":"mdi:palette-outline","Rings & sweeps":"mdi:radar",Borders:"mdi:border-outside","Weather & device":"mdi:weather-partly-rainy",Scenes:"mdi:image-filter-hdr",Backgrounds:"mdi:gradient-horizontal",Seasonal:"mdi:pine-tree",Interaction:"mdi:gesture-tap","Fire & heat":"mdi:fire",Cleaning:"mdi:broom",Christmas:"mdi:pine-tree",Halloween:"mdi:halloween",Valentine:"mdi:heart-outline","Home automation":"mdi:home-automation"};let Qd,ep;const tp=e=>e in Q?(0,N.t)(Q[e]):e,ip=e=>"builtin"===e.kind?e.id:`cat:${e.entry.id}`,np=e=>"builtin"===e.kind?e.group:e.entry.group,sp=[...X,...["Fire & heat","Cleaning","Christmas","Halloween","Valentine","Home automation","Light & colour"].filter(e=>!X.includes(e))],ap=new Map,rp=new WeakMap;function op(e){if("catalogue"===e.kind){if(rp.has(e.entry))return rp.get(e.entry);let t;try{t=e.entry.build()}catch{t=void 0}return rp.set(e.entry,t),t}if(ap.has(e.id))return ap.get(e.id);let t=Mt(e.id);return t&&e.tap&&(t={...t,iterations:"infinite"}),ap.set(e.id,t),t}class lp extends n.WF{constructor(){super(...arguments),this.play=!1,this.lookup=()=>{},this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0,this._card=void 0}willUpdate(e){const t=this.source?op(this.source):void 0;if(!(this._visible&&t&&this.source&&customElements.get("magic-card")))return void(this._card=void 0);const i=!this._card;if(i&&(this._card=document.createElement("magic-card")),i||e.has("source")||e.has("play")||e.has("lookup"))try{const e=hs(t,this.lookup,{tile:"card",thumb:!0,as:(n=ip(this.source),`pt-${n.toLowerCase().replace(/[^a-z0-9_-]/g,"-")}`.slice(0,64)),still:!this.play}),i="catalogue"===this.source.kind?this.source.entry.icon:void 0;i&&function(e,t){const i=e.rows??[];for(const e of i)for(const i of e.columns??[])for(const e of i.modules??[])"icon"in e&&(e.icon=t)}(e,i),this._card.setConfig(e)}catch{return void(this._card=void 0)}var n;(i||e.has("hass"))&&(this._card.hass=ts("card",this.hass??Gd(!1)))}render(){const e=this.source?Xd[np(this.source)]??"mdi:animation-outline":"mdi:animation-outline";return n.qy`<div class="box">${this._card?n.qy`<div class="scale">${this._card}</div>`:n.qy`<ha-icon icon=${e}></ha-icon>`}</div>`}}lp.styles=[ms,n.AH`
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
    `],Jd([(0,s.MZ)({attribute:!1})],lp.prototype,"source",void 0),Jd([(0,s.MZ)({type:Boolean})],lp.prototype,"play",void 0),Jd([(0,s.MZ)({attribute:!1})],lp.prototype,"hass",void 0),Jd([(0,s.MZ)({attribute:!1})],lp.prototype,"lookup",void 0),Jd([(0,s.wk)()],lp.prototype,"_visible",void 0);class cp extends n.WF{constructor(){super(...arguments),this.sources=[],this.query="",this.lookup=()=>{},this.notice="",this._active=new Set,this._previewing=new Set,this._reduced=!1,this._timers=new Map,this._onMq=()=>{this._reduced=!!this._mq?.matches}}connectedCallback(){super.connectedCallback(),this._mq="function"==typeof window.matchMedia?window.matchMedia(Zn(3)):void 0,this._reduced=!!this._mq?.matches,this._mq?.addEventListener?.("change",this._onMq)}disconnectedCallback(){super.disconnectedCallback(),this._mq?.removeEventListener?.("change",this._onMq),this._mq=void 0;for(const e of this._timers.values())clearTimeout(e);this._timers.clear()}_set(e,t,i){const n=this[e];if(n.has(t)===i)return;const s=new Set(n);i?s.add(t):s.delete(t),this[e]=s}_preview(e,t){clearTimeout(this._timers.get(t)),this._set("_previewing",t,!0),this._timers.set(t,setTimeout(()=>{this._timers.delete(t),this._set("_previewing",t,!1)},function(e){const t="number"==typeof e?.duration?e.duration:2;return Math.min(8e3,Math.max(2500,Math.round(1e3*t)))}(op(e))))}_pick(e){this.dispatchEvent(new CustomEvent("preset-pick",{detail:{source:e},bubbles:!0,composed:!0}))}_tile(e){const t=ip(e),i=(e=>"builtin"===e.kind?e.name:e.entry.name)(e),s=(e=>"builtin"===e.kind?e.tap||e.heavy:!!e.entry.heavy)(e),a=(e=>"builtin"===e.kind&&e.tap)(e),r=!this._reduced&&(!s||this._active.has(t)||this._previewing.has(t));return n.qy`<li class="pt-cell">
      <button
        type="button"
        class="pt"
        data-preset=${t}
        title=${i}
        aria-description=${a?Zn(696):n.s6}
        @click=${()=>this._pick(e)}
        @pointerenter=${()=>this._set("_active",t,!0)}
        @pointerleave=${()=>this._set("_active",t,!1)}
        @focus=${()=>this._set("_active",t,!0)}
        @blur=${()=>this._set("_active",t,!1)}
      >
        <mc-preset-thumb aria-hidden="true" .source=${e} .play=${r} .hass=${this.hass} .lookup=${this.lookup}></mc-preset-thumb>
        <span class="nm">${i}</span>
        ${a?n.qy`<span class="chip is-count" aria-hidden="true">${Zn(939)}</span>`:n.s6}
      </button>
      ${s&&!this._reduced?n.qy`<button type="button" class="pt-play" tabindex="-1" aria-hidden="true" title=${Zn(710)} @click=${()=>this._preview(e,t)}>
            <ha-icon icon="mdi:play"></ha-icon>
          </button>`:n.s6}
    </li>`}render(){const e=function(e,t){const i=(0,St.A)(t).split(/\s+/).filter(Boolean),n=e=>{if(!i.length)return!0;const t=(0,St.A)("builtin"===e.kind?`${e.name} ${e.id} ${e.group} ${tp(e.group)}`:`${e.entry.name} ${e.entry.id} ${e.entry.group} ${e.entry.tags.join(" ")}`);return i.every(e=>t.includes(e))},s=new Map;for(const t of e){if(!n(t))continue;const e=np(t),i=s.get(e);i?i.push(t):s.set(e,[t])}return sp.filter(e=>s.has(e)).map(e=>({group:e,tiles:s.get(e)}))}(this.sources,this.query.trim());return n.qy`
      ${e.length?e.map(e=>n.qy`<section class="pg" role="group" aria-label=${tp(e.group)}>
              <h3>${tp(e.group)} <span class="chip is-count">${e.tiles.length}</span></h3>
              <ul class="grid" role="list">
                ${e.tiles.map(e=>this._tile(e))}
              </ul>
            </section>`):n.qy`<div class="no-results">
            <p>${Zn(581,{query:this.query})}</p>
            <button type="button" class="btn btn-text btn-sm no-results-clear" @click=${()=>this.dispatchEvent(new CustomEvent("preset-clear-search",{bubbles:!0,composed:!0}))}>
              ${Zn(162)}
            </button>
          </div>`}
      <p class="notice" role="status" ?hidden=${!this.notice}>${this.notice}</p>
    `}}cp.styles=[ms,gs,n.AH`
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
    `],Jd([(0,s.MZ)({attribute:!1})],cp.prototype,"sources",void 0),Jd([(0,s.MZ)()],cp.prototype,"query",void 0),Jd([(0,s.MZ)({attribute:!1})],cp.prototype,"hass",void 0),Jd([(0,s.MZ)({attribute:!1})],cp.prototype,"lookup",void 0),Jd([(0,s.MZ)()],cp.prototype,"notice",void 0),Jd([(0,s.wk)()],cp.prototype,"_active",void 0),Jd([(0,s.wk)()],cp.prototype,"_previewing",void 0),Jd([(0,s.wk)()],cp.prototype,"_reduced",void 0);var dp=i(1235);let pp;var hp=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const up=e=>e?`mc-anim-draft:${e}`:"mc-anim-draft-new";function mp(e){try{const t=JSON.parse(sessionStorage.getItem(e)??"null");return t&&"object"==typeof t&&"string"==typeof t.id&&"string"==typeof t.name&&Ue.includes(t.kind)?t:void 0}catch{return}}function gp(e,t){try{const i=t?JSON.stringify(t):"";i&&i.length<=65536?sessionStorage.setItem(e,i):sessionStorage.removeItem(e)}catch{}}const fp=[{value:"normal",label:589},{value:"reverse",label:764},{value:"alternate",label:56},{value:"alternate-reverse",label:57}],vp={"mc-anim-states-panel":"mdi:state-machine","mc-anim-key-inspector":"mdi:key-variant","mc-anim-part-inspector":"mdi:vector-square","mc-anim-shape-inspector":"mdi:draw","mc-anim-bindings-panel":"mdi:link-variant","mc-anim-targets-layers":"mdi:card-text-outline","mc-anim-parts-layers":"mdi:vector-square","mc-anim-shapes-layers":"mdi:shape-outline","mc-anim-shapes-under-layers":"mdi:shape-outline","mc-anim-particles-layers":"mdi:shimmer","mc-anim-path-layers":"mdi:vector-curve","mc-anim-steps-layers":"mdi:format-list-numbered","mc-anim-part-presets":"mdi:auto-fix"},bp="mc-anim-parts-layers",yp=new Set(["mc-anim-keyframes-editor","mc-anim-sequence-editor",xs]),xp="var(--primary-color, #03a9f4)",wp=["infinite","1","2","3","5"],_p=["center","top","bottom","left","right","top left","top right","bottom left","bottom right"],kp={keyframes:561,particles:562,path:563,sequence:564},$p={keyframes:104,particles:105,path:106,sequence:107},Mp={keyframes:513,particles:400,path:354,sequence:687},Sp=["name","duration","easing","iterations","direction","target","origin"];function Cp(e){const t=e.composedPath()[0];return t instanceof HTMLElement&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable)}const Ap={message:954},jp=e=>{const t=e??{},i=Array.isArray(t.errors)?t.errors.filter(e=>e&&"string"==typeof e.message):[];return{message:"string"==typeof t.message&&t.message?t.message:Zn(789),errors:i}},zp="mcas-split",qp="mcas-sections",Ep="mcas-layers";function Lp(){return/Mac|iPhone|iPad/.test(navigator.platform||"")?"⌘\\":"Ctrl+\\"}function Pp(){const e=Lp();return[{id:"layers",side:"start",controls:"layers",name:Zn(432),noun:Zn(1142),hideLabel:Zn(386,{noun:Zn(1142),keys:e}),showLabel:Zn(844,{noun:Zn(1142),keys:e})},{id:"inspector",side:"end",controls:"inspector",name:Zn(412),noun:Zn(1138),hideLabel:Zn(386,{noun:Zn(1138),keys:e}),showLabel:Zn(844,{noun:Zn(1138),keys:e})}]}function Hp(e){return{locale:e,hidden:Zn(1249,{panels:"{panels}"}),shown:Zn(1250,{panels:"{panels}"}),hintOne:Zn(1012,{noun:"{noun}"}),hintMany:Zn(867),hintMigrated:Zn(978),hintShortcut:Zn(840,{keys:Lp()}),gotIt:Zn(367)}}function Vp(e){try{return localStorage.getItem(e)}catch{return null}}function Dp(e,t){try{void 0===t?localStorage.removeItem(e):localStorage.setItem(e,t)}catch{}}const Tp=e=>Math.min(.8,Math.max(.15,e)),Op=e=>"keyframes"===e.kind||"sequence"===e.kind;function Rp(e){if(!e)return"none";const t=e.keys?.[0];return`${e.kind}|${"keys"===e.kind?`${t?.target}|${t?.lane}|${1===e.keys?.length?1:"n"}`:e.target??e.tool??""}`}let Np="loading";const Fp=(0,N.G)().then(e=>Np=e?"ready":"failed");class Bp extends n.WF{constructor(){super(...arguments),this.standalone=!1,this._docs=new Map,this._view="library",this._query="",this._kind="all",this._menu=!1,this._menuClosedAt=0,this._saved=null,this._errors=[],this._saveError="",this._busy=!1,this._status="",this._presetQuery="",this._catalogueFailed=!1,this._labels=Np,this._customRepeat=!1,this._selection=_s,this._tile="icon",this._split=function(){const e=Number(Vp(zp));return null!==Vp(zp)&&Number.isFinite(e)&&e>0?Tp(e):.4}(),this._lips=new kd(this,{editor:"anim-studio",panels:Pp(),strings:Hp("en"),fallback:()=>{const e=Vp(Ep);if(null===e)return null;try{localStorage.removeItem(Ep)}catch{}return"rail"===e?["layers"]:null}}),this._lipLocale="en",this._lipSig="",this._bar=new $d(this),this._width=0,this._height=0,this._userSplit=null!==Vp(zp),this._inspOpen=!1,this._collapsed=function(){try{const e=JSON.parse(Vp(qp)??"[]");return new Set(Array.isArray(e)?e.filter(e=>"string"==typeof e):[])}catch{return new Set}}(),this._editorRequested=!1,this._history=new ls(void 0),this._pointer=!1,this._onPointer=()=>{this._pointer=!0},this._lookup=e=>this._docs.get(e),this._onBeforeUnload=e=>{this._keepDraft(),this.dirty&&(e.preventDefault(),e.returnValue="")},this._taken=e=>this._docs.has(e)||this._doc?.id===e,this._time=0,this._libraryObj={},this._gesture=!1,this._layerViews=new Map,this._emitter={index:0,all:!1},this._onEmitter=e=>{e.stopPropagation();const{index:t,all:i}=e.detail??{};Number.isInteger(t)&&t>=0&&(t!==this._emitter.index||!!i!==this._emitter.all)&&(this._emitter={index:t,all:!!i})},this._onLayerView=e=>{const{view:t,announce:i}=e.detail;e.stopPropagation();const n=this._doc?.id;if(n){if(t!==this._layerViews.get(n)&&t!==this._viewOf(this._doc)){const e=new Map(this._layerViews);e.set(n,t),this._layerViews=e}i&&this._say(i)}},this._onKeydown=e=>{if(this._pointer=!1,e.defaultPrevented||this._dialog)return;const t=e.key.toLowerCase(),i=(e.ctrlKey||e.metaKey)&&!e.altKey;if("editor"!==this._view)"/"!==e.key||i||Cp(e)||(e.preventDefault(),this.shadowRoot?.querySelector(".search input")?.focus());else{if(i&&"s"===t)return e.preventDefault(),void this.save();if(i&&("z"===t||"y"===t)){if(Cp(e))return;return e.preventDefault(),void("y"===t||e.shiftKey?this.redo():this.undo())}if(" "===e.key&&!i&&!Cp(e)){const t=e.composedPath()[0];if(t instanceof HTMLElement&&/^(BUTTON|A)$/.test(t.tagName))return;return e.preventDefault(),void this._stage()?.togglePlay()}if("Escape"===e.key&&!Cp(e))if(this._inspOpen&&this._slideOver)e.preventDefault(),this._inspOpen=!1,this._focusSel=".insp-toggle";else if("none"!==this._selection.kind){e.preventDefault();const t=this.shadowRoot?.querySelector("aside.inspector"),i=this.shadowRoot?.activeElement,n=!!t&&!!i&&(t===i||t.contains(i));this._setSelection(_s),!n&&i||(this._focusSel="aside.inspector")}}},this._onSelection=e=>{e.stopPropagation();const t=e.detail?.selection;var i;(i=t)&&"object"==typeof i&&["none","keys","target","tool"].includes(i.kind)&&this._setSelection(t)},this._onDocChange=e=>{e.stopPropagation();const{doc:t,label:i,transient:n}=e.detail??{};if(!t||!this._doc)return;const s=Vr(t);if(s)n||(this._endGesture(),this._say(Zn(597,{big:s})),this._doc={...this._doc});else{if(n)this._gesture?this._history.replace(t):(this._gestureBase=this._doc,this._history.push(t)),this._gesture=!0;else if(this._gesture){const e=this._gestureBase;!e||t!==e&&JSON.stringify(t)!==JSON.stringify(e)?this._history.replace(t):this._history.revert(),this._endGesture()}else this._history.push(t,`editor:${i??""}`);this._doc=t,this._check(),this._pruneSelection()}},this._onStageRect=e=>{const{width:t,height:i,subject:n}=e.detail??{};if(!Number.isFinite(t)||!Number.isFinite(i))return;this._stageRect&&this._stageRect.width===t&&this._stageRect.height===i||(this._stageRect={width:t,height:i}),JSON.stringify(n)!==JSON.stringify(this._subjectRect)&&(this._subjectRect=n);const{scale:s,viewBox:a,screen:r}=e.detail??{},o={rect:{width:t,height:i},scale:Number.isFinite(s)&&s>0?s:1,...n?{subject:n}:{},...Array.isArray(a)&&4===a.length?{viewBox:a}:{},...r&&[r.left,r.top,r.width,r.height].every(Number.isFinite)?{screen:{left:r.left,top:r.top,width:r.width,height:r.height}}:{}};JSON.stringify(o)!==JSON.stringify(this._stageInfo)&&(this._stageInfo=o)},this._onPreviewChange=e=>{e.stopPropagation();const t=e.detail;if(!t||"object"!=typeof t)return;const i={...this._preview??{}};"string"==typeof t.state&&(i.state=t.state),"number"==typeof t.value&&Number.isFinite(t.value)&&(i.value=t.value),t.attributes&&"object"==typeof t.attributes&&(i.attributes={...t.attributes}),this._preview=Object.keys(i).length?i:void 0},this._onSeek=e=>{e.stopPropagation();const t=Number(e.detail?.time),i=this._stage();i&&Number.isFinite(t)&&i.seek(Math.min(1,Math.max(0,t))*i.cycle)},this._onSplitDown=e=>{if(0===e.button){e.preventDefault(),this._splitDrag={pointerId:e.pointerId};try{e.currentTarget.setPointerCapture?.(e.pointerId)}catch{}}},this._onSplitMove=e=>{if(!this._splitDrag||e.pointerId!==this._splitDrag.pointerId)return;const t=this._splitAt(e.clientY);void 0!==t&&this._setSplit(t,!1)},this._onSplitUp=e=>{this._splitDrag&&e.pointerId===this._splitDrag.pointerId&&(this._splitDrag=void 0,this._setSplit(this._split,!0))},this._onSplitKey=e=>{const t=e.shiftKey?.1:.05,i={ArrowUp:this._split-t,ArrowDown:this._split+t,Home:0,End:1};void 0!==i[e.key]&&(e.preventDefault(),this._setSplit(i[e.key],!0))},this._closeDialog=()=>{const e=this.shadowRoot?.querySelector("mc-ui-window");e?.open?e.close("action"):this._dialog=void 0}}willUpdate(e){e.has("hass")&&((0,R.Zc)(this.hass),window.MagicCard?.setLocale?.(this.hass)),this.lang!==Gn()&&(this.lang=Gn());const t=Gn();t!==this._lipLocale&&(this._lipLocale=t,this._lips.setPanels(Pp(),Hp(t)));const i="editor"===this._view&&!!this._doc;if(this._lips.columns({layers:i,inspector:i&&!this._slideOver}),e.has("library")&&(this._docs=function(e){if(!e||"object"!=typeof e)return new Map;const t=Array.isArray(e)?e:(n=e,Array.isArray(n)?n:n&&"object"==typeof n?Object.entries(n).map(([e,t])=>t&&"object"==typeof t&&!("id"in t)&&et.test(e)?{id:e,...t}:t):[]),i=new Map;var n;for(const e of t){const t=bt(e);t.ok&&!i.has(t.doc.id)&&i.set(t.doc.id,t.doc)}return i}(this.library)),(e.has("library")||e.has("_docs"))&&(this._lookup=e=>this._docs.get(e),this._libraryObj=Object.fromEntries(this._docs)),e.has("library")){const e=this._doc&&this._saved?this._docs.get(this._saved.id):void 0;e&&!this.dirty&&JSON.stringify(e)!==JSON.stringify(this._saved)&&(this._saved=e,this._doc=e,this._playable=e,this._history.reset(e))}if(e.has("selectedId")){const e=this.selectedId||void 0;e?this._doc?.id!==e&&(this._wantId=e):("editor"===this._view&&!this.dirty&&this._saved&&this._closeEditor(!1),this._wantId=void 0)}if(this._wantId&&this._docs.has(this._wantId)){const e=this._docs.get(this._wantId);this._wantId=void 0,this.dirty||this._openDoc(e,!1,!1)}}updated(e){const t=e.get("_doc"),i=this._lipsChanged();if(e.has("_height")||e.has("_width")||i||e.has("_view")||e.has("_doc")&&t?.id!==this._doc?.id?this._autoSplit():e.has("_doc")&&this._autoSplit(!0),e.has("_inspOpen")&&this._inspOpen&&this._slideOver&&(this._focusSel??="aside.inspector"),e.has("_doc")&&this._doc&&t&&t.id===this._doc.id&&(this._doc.rig?.shapes?.length??0)>(t.rig?.shapes?.length??0)){const e=this._doc.rig?.shapes??[],t=e[e.length-1].id;this._revealShape(t)}if((i||e.has("_view")||e.has("_width")||e.has("_height")||e.has("_split")||e.has("_stageRect")||e.has("_doc"))&&this._placeLips(),e.has("_selection")&&Rp(e.get("_selection"))!==Rp(this._selection)){const e=this.shadowRoot?.querySelector("aside.inspector");e&&(e.scrollTop=0)}if(this._focusSel){const e=this.shadowRoot?.querySelector(this._focusSel);e&&(e.focus(),e instanceof HTMLInputElement&&e.select()),this._focusSel=void 0}const n=this._menu?this.shadowRoot?.querySelector("mc-ui-menu.new-menu"):void 0;n&&!n.open&&(n.anchor=this.shadowRoot?.querySelector(".new-btn")??void 0,n.show());const s=this.shadowRoot?.querySelector("mc-ui-window");if(s&&!s.open){const e=hd();e?.isConnected&&e!==document.body&&(this._opener=e),s.opener=this._opener,s.show();const t=s.querySelector("mc-anim-icon-start");t&&s.updateComplete.then(()=>setTimeout(()=>t.focusStart?.(),0));const i=s.querySelector("mc-transfer-panel");i&&s.updateComplete.then(()=>i.focusHeading?.())}else if(!s&&e.has("_dialog")&&e.get("_dialog")&&this._opener?.isConnected){const e=hd();e&&e!==document.body||this._opener.focus({preventScroll:!0}),this._opener=void 0}}_lipsChanged(){const e=`${this._lips.state("layers")}${this._lips.state("inspector")}`,t=e!==this._lipSig;return this._lipSig=e,t}_placeLips(){const e=this.shadowRoot,t=e?.querySelector(".workspace"),i=e?.querySelector("mcas-stage");if(this._bar.watch(i??null,t??null),!t||!i)return;const n=t.getBoundingClientRect(),s=i.getBoundingClientRect();if(!n.height||!s.height)return;const a=s.top-n.top+s.height/2,r=Math.round(Math.min(Math.max(a,44),Math.max(44,n.height-44)));r!==this._lipTop&&(this._lipTop=r)}_lipTokens(){const e=this._lips,t=e.isHidden("layers")?"0px":"var(--layers-w)",i=e.isHidden("inspector")?"0px":"var(--insp-w)",n=void 0===this._lipTop?"":`; --mc-lip-top: ${this._lipTop}px`;return`--mc-lip-at-start: ${t}; --mc-lip-at-end: calc(${i} + ${this._bar.width}px)${n}`}connectedCallback(){super.connectedCallback(),Fp.then(()=>this._labels=Np),this.addEventListener("keydown",this._onKeydown),this.addEventListener("pointerdown",this._onPointer),window.addEventListener("beforeunload",this._onBeforeUnload);const e=this._doc||this._dialog?void 0:mp(up());e&&(this._dialog={type:"restore",draft:e,isNew:!0}),!this._editorRequested&&window.MagicCard?.loadEditor&&(this._editorRequested=!0,window.MagicCard.loadEditor());for(const e of[...Object.values(ys).map(e=>e.tag),xs,...ks.map(e=>e.tag)])ws(e)||customElements.whenDefined(e).then(()=>this.requestUpdate());"undefined"==typeof ResizeObserver||this._ro||(this._ro=new ResizeObserver(e=>{const t=Math.round(e[0]?.contentRect.width??0),i=Math.round(e[0]?.contentRect.height??0);t&&t!==this._width&&(this._width=t),i&&i!==this._height&&(this._height=i)}),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this._onKeydown),this.removeEventListener("pointerdown",this._onPointer),window.removeEventListener("beforeunload",this._onBeforeUnload),this._ro?.disconnect(),this._ro=void 0,this._keepDraft()}_keepDraft(){this._doc&&"restore"!==this._dialog?.type&&gp(up(this._saved?.id),this.dirty?this._doc:void 0)}get dirty(){const e=this._doc;if(!e)return!1;const t=this._dirtyFor;if(t&&t.doc===e&&t.saved===this._saved)return t.value;const i=!this._saved||JSON.stringify(e)!==JSON.stringify(this._saved);return this._dirtyFor={doc:e,saved:this._saved,value:i},i}get docs(){return[...this._docs.values()].sort((e,t)=>e.name.localeCompare(t.name))}async _emit(e,t,i=!0){const n={...t};if(this.dispatchEvent(new CustomEvent(e,{detail:n,bubbles:!0,composed:!0})),n.result)return await n.result;if(i&&!this.standalone)throw Ap}_store(e){const t=new Map(this._docs);t.set(e.id,e),this._docs=t}_say(e){this._status="",this.updateComplete.then(()=>this._status=e),clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>this._status="",4e3)}_stored(e,t){const i=e?.animation??e,n=i?bt(i):void 0;return n?.ok?n.doc:t}_select(e){this._emit("mc-anim-select",{id:e},!1)}_new(e){this._menu=!1;const t=new Set(this.docs.map(e=>e.name)),i=Zn(kp[e]);let n=i;for(let e=2;t.has(n);e++)n=`${i} ${e}`;this._guard(()=>this._openDoc(function(e,t,i="New animation"){const n={id:t,name:i,kind:e,duration:2,easing:"ease-in-out",iterations:"infinite",target:"element",origin:"center",version:1};switch(e){case"keyframes":return{...n,keyframes:[{at:0,transform:{scale:1}},{at:50,transform:{scale:1.1}},{at:100,transform:{scale:1}}]};case"particles":return{...n,duration:4,easing:"linear",particles:{...tt,size:[...tt.size],colors:[]}};case"path":return{...n,duration:3,easing:"linear",path:{d:"M0 0 C 20 -30 40 30 60 0 S 20 -10 0 0",units:"px",follow_rotation:!1,subject:"element"}};case"sequence":return{...n,steps:[{animation:"pop",delay:0,repeat:1},{animation:"wiggle",delay:.2,repeat:1}],loop:!0,stagger:{children:!1,delay:.15}}}}(e,cs(n,this._taken),n),!0))}_openIconStart(){this._menu=!1,this._dialog={type:"icon"}}_startIcon(e){e.stopPropagation();const{doc:t,from:i}=e.detail??{};if(!t)return;this._dialog=void 0;const n=new Set(this.docs.map(e=>e.name));let s=t.name;for(let e=2;n.has(s);e++)s=`${t.name} ${e}`;const a={...t,id:cs(t.id,this._taken),name:s};this._guard(()=>{this._openDoc(a,!0);const e=a.rig?.parts[0]?.id;"icon"===i&&e&&(this._selection={kind:"target",target:`part:${e}`,targets:[`part:${e}`]})})}_openPresets(){this._presetQuery="",this._dialog={type:"presets"},this._catalogue||(this._catalogueFailed=!1,(pp??=i.e(494).then(()=>i(298)).then(e=>(0,dp.t)("magic-card-preset-catalogue.js",e),e=>{pp=void 0,console.warn("Magic Card: preset catalogue not loaded",e)}),pp).then(e=>{e?this._catalogue=e.CATALOGUE:this._catalogueFailed=!0}))}_pickPreset(e){e.stopPropagation();const t=(e.detail??{}).source;if(!t)return;if("builtin"===t.kind)return this._customise(t.id);let i;try{i=structuredClone(t.entry.build())}catch(e){return void this._say(Zn(1028,{message:jp(e).message}))}const n={...i,id:cs($t(t.entry.id),this._taken)};this._dialog=void 0,this._guard(()=>this._openDoc(n,!0))}_presetSources(){return this._sourcesFor&&this._sourcesFor.catalogue===this._catalogue||(this._sourcesFor={catalogue:this._catalogue,list:[...(Qd&&ep===(0,N.H)()||(ep=(0,N.H)(),Qd=J.map(e=>({kind:"builtin",id:e.id,name:(0,N.t)(e.name),group:e.group,tap:"tap"===e.trigger,heavy:"Seasonal"===e.group||!!e.seasonal}))),Qd),...(this._catalogue??[]).map(e=>({kind:"catalogue",entry:e}))]}),this._sourcesFor.list}async _clearPresetSearch(){this._presetQuery="",await this.updateComplete,this.shadowRoot?.querySelector("input.preset-search")?.focus()}_customise(e){const t=Mt(e,cs($t(e),this._taken));t&&(this._dialog=void 0,this._guard(()=>this._openDoc(t,!0)))}async _duplicate(e){const t={...structuredClone(e),id:cs(`${e.id}-copy`,this._taken),name:ds(e.name,new Set(this.docs.map(e=>e.name)))};try{const e=await this._emit("mc-anim-duplicate",{animation:t});this._store(this._stored(e,t)),this._say(Zn(295,{name:t.name}))}catch(e){this._say(Zn(296,{message:jp(e).message}))}}async _rename(e,t){if(this._renaming!==e.id)return;this._renaming=void 0;const i=t.trim();if(!i||i===e.name)return;const n=bt({...e,name:i});if(n.ok)try{const e=await this._emit("mc-anim-save",{animation:n.doc});this._store(this._stored(e,n.doc)),this._say(Zn(749,{clean:i}))}catch(e){this._say(Zn(750,{message:jp(e).message}))}else this._say(Zn(603,{message:as(n.errors[0].message)}))}_askDelete(e){const t=this.usage?this.usage[e.id]??0:void 0,i=(n=e.id,s=this._docs.values(),[...s].filter(e=>"sequence"===e.kind&&e.id!==n&&ps(e).includes(n)));var n,s;0!==t||i.length?this._dialog={type:"delete",doc:e,uses:t,sequences:i}:this._delete(e)}async _delete(e){this._dialog=void 0;try{await this._emit("mc-anim-delete",{id:e.id});const t=new Map(this._docs);t.delete(e.id),this._docs=t,this._say(Zn(250,{name:e.name}))}catch(e){this._say(Zn(251,{message:jp(e).message}))}}async _transferChunk(){try{const e=window.MagicCard;if(!e?.loadEditor||!e.loadTransfer||!await e.loadEditor())return;return await e.loadTransfer()}catch{return}}async _openTransfer(e){await this._transferChunk()?this._dialog=e:this._say(Zn(977))}_export(e){this._openTransfer({type:"export",items:us(e,this._docs)})}async _onImport(e){e.stopPropagation();const{docs:t,errors:i}=function(e,t){const i=[],n=[];for(const s of e){const e=bt({...s.data,id:s.id,name:s.name});e.ok?i.length>=Math.max(0,t)?n.push(Zn(1204,{id:s.id})):i.push(e.doc):n.push(`${s.id}: ${e.errors[0]?as(e.errors[0].message):Zn(1151)}`)}return{docs:i,errors:n}}(e.detail.items,200-this._docs.size),n=[...i];let s=0;for(const e of t)try{const t=await this._emit("mc-anim-save",{animation:e});this._store(this._stored(t,e)),s++}catch(t){n.push(`${e.id}: ${jp(t).message}`)}const a=Zn(406,{count:s});this._say(n.length?`${a} ${Zn(600,{list:n.slice(0,4).join("; ")})}`:a),n.length||(this._dialog=void 0)}_guard(e){"editor"===this._view&&this.dirty?this._dialog={type:"discard",then:e}:e()}_openDoc(e,t,i=!0){this._doc=e,this._emitter={index:0,all:!1},this._saved=t?null:e,this._history.reset(e),this._errors=[],this._saveError="",this._customRepeat=!1,this._playable=e,this._endGesture(),this._time=0,this._selection=_s,this._preview=void 0,this._inspOpen=!1,this._view="editor",this._pointer||(this._focusSel=".back"),i&&!t&&this._select(e.id);const n=t?void 0:mp(up(e.id));n&&JSON.stringify(n)!==JSON.stringify(e)?this._dialog={type:"restore",draft:n,isNew:!1}:n&&gp(up(e.id))}_restoreDraft(e,t){this._dialog=void 0,t?this._openDoc(this._taken(e.id)?{...e,id:cs(e.id,this._taken)}:e,!0):this._doc?.id===e.id&&this._apply(e)}_closeEditor(e=!0){const t=!!this._doc;this._view="library",this._doc=void 0,this._selection=_s,this._preview=void 0,this._saved=null,this._history.reset(void 0),this._errors=[],this._saveError="",e&&t&&this._select(null)}_back(){this._guard(()=>this._closeEditor())}_set(e,t){if(!this._doc)return;const i={...this._doc,...e};for(const[t,n]of Object.entries(e))void 0===n&&delete i[t];this._apply(i,t)}_apply(e,t){this._endGesture(),this._history.push(e,t),this._doc=e,this._check(),this._pruneSelection()}_endGesture(){this._gesture=!1,this._gestureBase=void 0}_viewOf(e){return function(e,t){const i=to(e),n=e=>!/^(target|part|group|shape|lane|emitter|children|step):/.test(e)||i.has(e)||"target:element"===e,s=e=>e.every(n)?e:e.filter(n),a=s(t.hidden),r=s(t.solo),o=s(t.locked),l=s(t.open);return a===t.hidden&&r===t.solo&&o===t.locked&&l===t.open?t:{hidden:a,solo:r,locked:o,open:l}}(e,this._layerViews.get(e.id)??Gr)}_previewDoc(e,t){const i=this._previewMemo;if(i&&i.base===e&&i.view===t)return i.out;const n=((e,t)=>{const i=no(e,t),n=new Map,s=new Set;for(const e of i)if(e.startsWith("lane:")){const t=e.lastIndexOf("|"),i=e.slice(5,t);n.set(i,[...n.get(i)??[],e.slice(t+1)])}else e.startsWith("step:")&&s.add(Number(e.slice(5)));if(!n.size&&!s.size)return e;const a={...e};return s.size&&(a.steps=(e.steps??[]).filter((e,t)=>!s.has(t))),n.size&&(e.keyframes&&n.has($a(e))&&(a.keyframes=lo(e.keyframes,n.get($a(e)))),e.tracks&&(a.tracks=e.tracks.flatMap(e=>{const t=n.get(e.target);if(!t)return[e];const i=lo(e.keyframes,t);return i.length||e.path?[{...e,keyframes:i}]:[]})),e.bindings&&(a.bindings=e.bindings.filter(e=>!n.get(e.target)?.some(t=>oo[e.property]===t)))),a})(e,t);return this._previewMemo={base:e,view:t,out:n},n}_check(){const e=this._doc?bt(this._doc):void 0;this._errors=e&&!e.ok?e.errors:[],e?.ok&&(this._playable=e.doc)}undo(){this._endGesture();const e=this._history.undo();e&&(this._doc=e,this._check(),this._pruneSelection())}redo(){this._endGesture();const e=this._history.redo();e&&(this._doc=e,this._check(),this._pruneSelection())}_pruneSelection(){const e=this._doc,t=this._selection;if(!e||"none"===t.kind)return;const i=t=>{const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return!0;const n="part"===i[1]?e.rig?.parts:"group"===i[1]?e.rig?.groups:e.rig?.shapes;return!!n?.some(e=>e.id===i[2])};if("tool"===t.kind)return void(t.target&&!i(t.target)&&(this._selection={kind:"tool",tool:t.tool}));if("keys"===t.kind){const i=(t.keys??[]).filter(t=>za(e,{target:t.target,lane:t.lane,at:t.at}));if(i.length===(t.keys??[]).length)return;if(!i.length)return void(this._selection=_s);const n=[...new Set(i.map(e=>e.target))];return void(this._selection={kind:"keys",keys:i,targets:n,target:t.target&&n.includes(t.target)?t.target:i[i.length-1].target})}const n=(t.targets??(t.target?[t.target]:[])).filter(i);n.length?n.length===(t.targets?.length??1)&&t.target&&i(t.target)||(this._selection={kind:"target",target:t.target&&i(t.target)?t.target:n[0],targets:n}):this._selection=_s}async save(){if(!this._doc||this._busy)return!1;const e=bt(this._doc);if(!e.ok)return this._errors=e.errors,this._saveError=Zn(347),!1;this._busy=!0,this._saveError="";const t=JSON.stringify(this._doc);try{const i=await this._emit("mc-anim-save",{animation:e.doc}),n=this._stored(i,e.doc),s=!this._saved;this._store(n),this._saved=n,gp(up(n.id)),s&&gp(up());const a=JSON.stringify(this._doc);return a===t&&JSON.stringify(n)!==a?this._apply(n):this._check(),this._say(Zn(788,{name:n.name})),s&&this._select(n.id),!0}catch(e){const t=jp(e);return this._errors=t.errors,this._saveError=t.message,!1}finally{this._busy=!1}}_stage(){return this.shadowRoot?.querySelector("mcas-stage")??null}_renderNewMenu(){const e=[...Ue.map(e=>({id:`kind:${e}`,label:Zn($p[e]),sub:Zn(Mp[e]),icon:os[e]})),{id:"preset",label:Zn(222),icon:"mdi:auto-fix",separatorBefore:!0},{id:"icon",label:Zn(394),icon:"mdi:motion-play-outline"}];return n.qy`<mc-ui-menu
      class="new-menu"
      .items=${e}
      label=${Zn(560)}
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
        <ha-icon icon="mdi:plus"></ha-icon>${Zn(560)}<ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${this._menu?this._renderNewMenu():n.s6}
    </div>`}_usedBy(e){if(!this.usage)return n.s6;const t=this.usage[e]??0;return n.qy`<span class="used ${t?"":"none"}">${t?Zn(1088,{count:t}):Zn(605)}</span>`}_renderRow(e){const t=this._renaming===e.id,i=t=>{this._rename(e,t.target.value)};return n.qy`
      <li class="lib-row" data-id=${e.id}>
        <mcas-thumb .doc=${e} .lookup=${this._lookup} .hass=${this.hass}></mcas-thumb>
        ${t?n.qy`<div class="name-cell">
                <input
                  class="input rename"
                  aria-label=${Zn(555,{name:e.name})}
                  maxlength="80"
                  .value=${e.name}
                  @keydown=${t=>{"Enter"===t.key&&i(t),"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),this._renaming=void 0,this._focusSel=`.lib-row[data-id="${e.id}"] .rename-btn`)}}
                  @blur=${i}
                />
              </div>`:n.qy`<button type="button" class="open name-cell" @click=${()=>this._guard(()=>this._openDoc(e,!1))}>
                <span class="nm">${e.name}</span>
                <span class="id mono">${Zn(1126,{id:e.id})}</span>
              </button>`}
        <span class="chip kind"><ha-icon icon=${os[e.kind]}></ha-icon>${Zn(rs[e.kind])}</span>
        ${this._usedBy(e.id)}
        <span class="acts">
          <button type="button" class="icon-btn sm" title=${Zn(290)} aria-label=${Zn(294,{name:e.name})} @click=${()=>this._duplicate(e)}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm rename-btn"
            title=${Zn(744)}
            aria-label=${Zn(747,{name:e.name})}
            @click=${()=>{this._renaming=e.id,this._focusSel=".rename"}}
          >
            <ha-icon icon="mdi:rename-outline"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm"
            title=${Zn(328)}
            aria-label=${Zn(331,{name:e.name})}
            @click=${()=>this._export([e])}
          >
            <ha-icon icon="mdi:export-variant"></ha-icon>
          </button>
          <button type="button" class="icon-btn sm danger" title=${Zn(233)} aria-label=${Zn(249,{name:e.name})} @click=${()=>this._askDelete(e)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </span>
      </li>
    `}_renderEmpty(){return n.qy`<div class="empty lib-empty">
      <ha-icon icon="mdi:animation-play-outline"></ha-icon>
      <strong>${Zn(573)}</strong>
      <p>${Zn(124)}</p>
      <div class="starters">
        ${Ue.map(e=>n.qy`<button type="button" class="starter" @click=${()=>this._new(e)}>
              <ha-icon icon=${os[e]}></ha-icon><span class="mi-t">${Zn(rs[e])}</span><span class="mi-s">${Zn(Mp[e])}</span>
            </button>`)}
        <button
          type="button"
          class="starter"
          @click=${()=>this._openPresets()}
        >
          <ha-icon icon="mdi:auto-fix"></ha-icon><span class="mi-t">${Zn(362)}</span><span class="mi-s">${Zn(223,{count:J.length})}</span>
        </button>
        <button type="button" class="starter" data-kind="icon" @click=${()=>this._openIconStart()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon><span class="mi-t">${Zn(393)}</span><span class="mi-s">${Zn(62)}</span>
        </button>
      </div>
    </div>`}_renderLibrary(){const e=this.docs,t=[{id:"all",label:Zn(44)},...Ue.map(e=>({id:e,label:Zn(rs[e])}))],i=function(e,t){const i=t.toLowerCase().split(/\s+/).filter(Boolean);return i.length?e.filter(e=>{const t=(0,St.A)(`${e.name} ${e.id} ${e.kind} ${Zn(rs[e.kind])}`);return i.every(e=>t.includes(e))}):e}(e,this._query).filter(e=>"all"===this._kind||e.kind===this._kind);return n.qy`
      <header class="topbar">
        <div class="grp title">
          <ha-icon class="title-icon" icon="mdi:animation-play-outline"></ha-icon>
          <h1>${Zn(68)}</h1>
          <span class="chip is-count">${e.length}</span>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            @click=${()=>{this._openTransfer({type:"import"})}}
          >
            <ha-icon icon="mdi:import"></ha-icon>${Zn(401)}
          </button>
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            ?disabled=${!e.length}
            @click=${()=>this._export(e)}
          >
            <ha-icon icon="mdi:export-variant"></ha-icon>${Zn(329)}
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
                        placeholder=${Zn(796)}
                        aria-label=${Zn(796)}
                        aria-keyshortcuts="/"
                        .value=${P(this._query)}
                        @input=${e=>this._query=e.target.value}
                      />
                    </div>
                    <div class="kinds">${Cd({role:"radiogroup",label:Zn(422),value:this._kind,items:t.map(e=>({value:e.id,label:e.label})),onChange:e=>this._kind=e})}</div>
                  </div>
                  ${i.length?n.qy`<ul class="lib-list ${this.usage?"has-usage":""}" aria-label=${Zn(553)}>
                          ${i.map(e=>this._renderRow(e))}
                        </ul>`:n.qy`<p class="no-results">${this._query?Zn(571,{query:this._query}):Zn(572)}</p>`}
                `:this._renderEmpty()}
        </div>
      </main>
    `}_fieldErrors(e){const t=this._errors.filter(t=>t.path===e);return t.length?n.qy`${t.map(t=>n.qy`<p class="help error" id="err-${e}">${as(t.message)}</p>`)}`:n.s6}_field(e,t,i,s,a){return n.qy`<div class="field">
      <div class="field-head"><label for=${t}>${e}</label></div>
      ${i} ${a?n.qy`<p class="help">${a}</p>`:n.s6} ${s?this._fieldErrors(s):n.s6}
    </div>`}_selectEl(e,t,i,s){return n.qy`<div class="select">
      <select class="input" id=${e} @change=${e=>s(e.target.value)}>
        ${i.map(e=>n.qy`<option value=${e.value} ?selected=${e.value===t}>${e.label}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`}get _compact(){return this._width>0&&this._width<1100&&!this._slideOver}get _slideOver(){return this._width>0&&this._width<900}_setSelection(e){this._selection=e,this._slideOver&&"keys"===e.kind&&(this._inspOpen=!0)}_toggleSection(e){const t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t,Dp(qp,JSON.stringify([...t]))}_section(e,t,i,s,a={}){const r=a.errors||!this._collapsed.has(e);return n.qy`<section class="sec ${a.cls??""}" data-sec=${e}>
      ${function(e){const t=4===e.level,i=gd(e,18);if(!e.collapsible){const s=n.qy`${i}${t?n.qy`<h4>${e.title}</h4>`:n.qy`<h3>${e.title}</h3>`}`;return n.qy`<div class="group-head">${s}</div>`}const s=n.qy`<button type="button" class="sector-btn" aria-expanded=${String(!!e.expanded)} @click=${()=>e.onToggle?.()}> ${i}<span class="nm">${e.title}</span><span class="chev">${u("chevronDown",20)}</span> </button>`;return t?n.qy`<h4 class="sector-head">${s}</h4>`:n.qy`<h3 class="sector-head">${s}</h3>`}({title:t,icon:i,collapsible:!0,expanded:r,onToggle:()=>this._toggleSection(e)})}
      ${a.errors?n.qy`<span class="sec-err" role="img" aria-label=${Zn(380)}></span>`:n.s6}
      <div class="sec-body" id="secb-${e}" ?hidden=${!r}>${r?s:n.s6}</div>
    </section>`}_hasErrors(e){return this._errors.some(t=>e.includes(t.path))}_renderErrors(){const e=this._errors.filter(e=>!Sp.includes(e.path));return this._saveError||e.length?n.qy`<div class="errors" role="alert">
          ${this._saveError?n.qy`<strong>${this._saveError}</strong>`:n.s6}
          ${e.length?n.qy`<ul>
                  ${e.map(e=>n.qy`<li><span class="mono">${e.path||"animation"}</span> ${as(e.message)}</li>`)}
                </ul>`:n.s6}
        </div>`:n.s6}_renderForm(e){const t=B.map(e=>({value:e.id,label:(0,N.t)(e.label)}));B.some(t=>t.id===e.easing)||t.push({value:e.easing,label:e.easing});const i=String(e.iterations),s=this._customRepeat||!wp.includes(i),a=[...wp.map(e=>({value:e,label:"infinite"===e?Zn(410):e})),{value:"custom",label:Zn(217)}],r="keyframes"===e.kind||"sequence"===e.kind,o=this._field(Zn(554),"f-name",n.qy`<input
        class="input"
        id="f-name"
        maxlength="80"
        .value=${P(e.name)}
        aria-invalid=${this._errors.some(e=>"name"===e.path)?"true":"false"}
        @input=${e=>this._set({name:e.target.value},"name")}
      />`,"name",n.qy`${Zn(139)} <span class="mono ref">${Zn(1126,{id:e.id})}</span>`),l=n.qy`
      ${"sequence"===e.kind?n.qy`<p class="help">${Zn(19)}</p>`:this._field(Zn(297),"f-duration",n.qy`<div class="suffix">
                <input
                  class="input"
                  id="f-duration"
                  type="number"
                  inputmode="decimal"
                  min="0.05"
                  max="600"
                  step="any"
                  .value=${P(String(e.duration))}
                  @input=${e=>{const t=e.target.value;""!==t&&Number.isFinite(Number(t))&&this._set({duration:Number(t)},"duration")}}
                />
                <span aria-hidden="true">s</span>
              </div>`,"duration")}
      <div class="two">
        ${this._field(Zn(300),"f-easing",this._selectEl("f-easing",e.easing,t,e=>this._set({easing:e},"easing")),"easing")}
        ${this._field(Zn(751),"f-repeat",this._selectEl("f-repeat",s?"custom":i,a,t=>{if("custom"===t)return this._customRepeat=!0,void("infinite"===e.iterations&&this._set({iterations:10},"iterations"));this._customRepeat=!1,this._set({iterations:"infinite"===t?"infinite":Number(t)},"iterations")}),"iterations")}
      </div>
      ${s?this._field(Zn(752),"f-count",n.qy`<input
                class="input"
                id="f-count"
                type="number"
                min="1"
                step="1"
                .value=${P("number"==typeof e.iterations?String(e.iterations):"")}
                @input=${e=>{const t=Number(e.target.value);Number.isFinite(t)&&t>0&&this._set({iterations:t},"count")}}
              />`):n.s6}
      ${this._field(Zn(254),"f-dir",this._selectEl("f-dir",e.direction??"normal",(c=fp,c.map(e=>({...e,label:Zn(e.label)}))),e=>this._set({direction:"normal"===e?void 0:e},"direction")),"direction")}
    `;var c;return n.qy`
      ${this._section("anim",Zn(65),os[e.kind],o,{errors:this._hasErrors(["name"])})}
      ${this._section("timing",Zn(1033),"mdi:timer-outline",l,{errors:this._hasErrors(["duration","easing","iterations","direction"])})}
      ${r?this._section("moves",Zn(1102),"mdi:cursor-move",this._renderMoves(e),{errors:this._hasErrors(["target","origin"])}):n.s6}
    `}_renderMoves(e){const t=_p.map(e=>({value:e,label:er.includes(e)?Zn(tr[er.indexOf(e)]):e.charAt(0).toUpperCase()+e.slice(1)}));_p.includes(e.origin)||t.push({value:e.origin,label:e.origin});const i="icon"===e.target?"icon":"element";return n.qy`
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-target">${Zn(940)}</span></div>
        <div class="seg full target" role="radiogroup" aria-labelledby="l-target" @keydown=${e=>{["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key)&&(e.preventDefault(),this._set({target:"icon"===i?"element":"icon"},"target"),this._focusSel='.target [aria-checked="true"]')}}>
          ${["element","icon"].map(e=>{const t=e===i;return n.qy`<button
              type="button"
              role="radio"
              aria-checked=${t?"true":"false"}
              tabindex=${t?"0":"-1"}
              @click=${()=>this._set({target:e},"target")}
            >
              ${Zn("element"===e?306:391)}
            </button>`})}
        </div>
        <p class="help">${Zn(395)}</p>
        ${this._fieldErrors("target")}
      </div>
      ${"keyframes"===e.kind?this._field(Zn(634),"f-origin",this._selectEl("f-origin",e.origin,t,e=>this._set({origin:e},"origin")),"origin",Zn(993)):n.s6}
    `}_editorEl(e,t,i={}){const s=(e=>({_$litStatic$:e,r:H}))(e);return i.panel?O`<${s}
        class=${i.cls??"panel"}
        slot=${i.slot??n.s6}
        .doc=${t}
        .hass=${this.hass}
        .library=${this._libraryObj}
        .time=${yp.has(e)?this._time:0}
        .disabled=${this._busy||!!i.inspector&&po(t,this._viewOf(t),this._selection)}
        .selection=${this._selection}
        .tile=${this._tile}
        .stage=${this._stageInfo}
        .layerView=${this._viewOf(t)}
        .density=${this._width>0&&this._width<1e3?"compact":"full"}
        .emitter=${this._emitter.index}
        .all=${this._emitter.all}
        .stageRect=${i.stageRect}
        .subjectRect=${i.subjectRect}
        .entityColor=${xp}
        @doc-change=${this._onDocChange}
        @seek=${this._onSeek}
        @selection-change=${this._onSelection}
      ></${s}>`:O`<${s}
      class=${i.cls??"kind-editor"}
      slot=${i.slot??n.s6}
      .doc=${t}
      .hass=${this.hass}
      .library=${this._libraryObj}
      .time=${yp.has(e)?this._time:0}
      .disabled=${this._busy||e===xs&&this._viewOf(t).locked.includes("path")}
      .studioSelection=${this._selection}
      .layerView=${this._viewOf(t)}
      .emitter=${this._emitter.index}
      .all=${this._emitter.all}
      .tile=${this._tile}
      .stage=${this._stageInfo}
      .stageRect=${i.stageRect}
      .subjectRect=${i.subjectRect}
      .entityColor=${xp}
      @doc-change=${this._onDocChange}
      @seek=${this._onSeek}
      @selection-change=${this._onSelection}
    ></${s}>`}_panels(e,t,i={}){return Ms(e,t,this._selection).filter(e=>ws(e.tag)).map(e=>this._editorEl(e.tag,t,{cls:`panel panel-${e.place}`,panel:!0,...i,..."stage-tool"===e.place&&e.dock&&"overlay"!==e.dock?{slot:e.dock}:{}}))}_renderKindSlot(e){const t=ys[e.kind],i=ws(t.tag)?this._editorEl(t.tag,e):n.qy`<p class="help">${Zn(448,{kind:Zn(t.title).toLowerCase()})}</p>`;return"inspector"===t.place?n.qy`<div class="kind-slot place-inspector" data-kind=${e.kind}>${this._section(`kind-${e.kind}`,Zn(t.title),os[e.kind],i)}</div>`:n.qy`<section class="kind-slot place-panel" aria-label=${Zn(t.title)} data-kind=${e.kind}>${i} ${this._panels("timeline",e)}</section>`}_setSplit(e,t){this._split=this._clampSplitPx(Tp(Math.round(1e3*e)/1e3)),this._userSplit=!0,t&&Dp(zp,String(this._split))}_clampSplitPx(e){const t=this.shadowRoot?.querySelector(".center")?.getBoundingClientRect().height??0;if(t<=0)return e;const i=Math.min(.45,160/t);return Math.round(1e3*Math.min(1-i,Math.max(i,e)))/1e3}_splitAt(e){const t=this.shadowRoot?.querySelector(".center")?.getBoundingClientRect();if(t&&!(t.height<=0))return(e-t.top)/t.height}_resetSplit(){Dp(zp,void 0),this._userSplit=!1,this._split=.4,this._autoSplit()}_autoSplit(e=!1){const t=this._doc;if(this._userSplit||!t||"editor"!==this._view||"panel"!==ys[t.kind].place)return;const i=this.shadowRoot?.querySelector(".center"),n=i?.getBoundingClientRect().height??0;if(n<=0)return;const s=this.shadowRoot?.querySelector(".kind-slot.place-panel .kind-editor"),a=s?.getBoundingClientRect().width||i?.getBoundingClientRect().width||0,r=function(e,t,i=!1){const n=Ma(e).filter(e=>e.main||e.keyframes.length),s=n.reduce((e,t)=>e+Fs(t.keyframes).length,0),a=Math.max(0,...n.map(e=>Zs(e.keyframes,"*").length)),r=i?187+49*a+(a?0:44):146+41*n.length+35*s+(s?0:44),o=Math.max(160,Math.min(.6*t,r));return Math.round(1e3*Tp((t-9-o)/t))/1e3}(t,n,a>0&&a<480);(e?r<this._split-.002:Math.abs(r-this._split)>.002)&&(this._split=r)}async _revealShape(e){await this.updateComplete;const t=this.shadowRoot?.querySelector("nav.layers"),i=[...t?.querySelectorAll("mc-anim-shapes-layers, mc-anim-shapes-under-layers")??[]];await Promise.all(i.map(e=>e.updateComplete));const n=i.find(t=>t.shadowRoot?.querySelector(`li[data-id="${e}"]`))??i[0],s=n?.shadowRoot?.querySelector(`li[data-id="${e}"]`);s?.scrollIntoView?.({block:"nearest"})}_layerTargets(e){const t=["element","icon"];for(const i of e.tracks??[])t.includes(i.target)||t.push(i.target);return t}_renderLayerList(e){if("particles"===e.kind)return n.qy`<p class="help layers-note">${Zn(656)}</p>`;const t=Xn.find(e=>e.id===this._tile),i=this._selection;return n.qy`<ul class="layer-list" role="list">
      ${this._layerTargets(e).map(s=>{const a=!("target"!==i.kind&&"keys"!==i.kind||i.target!==s&&!i.targets?.includes(s)),r=!!t&&"element"!==s&&!t.targets.includes(s),o=_a(e,s),l=(t=>t===e.target&&"keyframes"===e.kind?e.keyframes?.length??0:e.tracks?.find(e=>e.target===t)?.keyframes.length??0)(s),c=s===e.target,d=c&&r?Zn(1210,{label:o,tile:Zn(t.label).toLowerCase()}):c?Zn(1209,{label:o}):r?Zn(1218,{label:o,tile:Zn(t.label).toLowerCase()}):o;return n.qy`<li>
          <button
            type="button"
            class="layer ${r?"off":""}"
            data-target=${s}
            aria-pressed=${a?"true":"false"}
            title=${d}
            @click=${e=>this._pickLayer(s,e.ctrlKey||e.metaKey||e.shiftKey)}
          >
            <ha-icon icon=${ka(s)}></ha-icon>
            <span class="layer-name">${o}</span> ${c&&Op(e)?n.qy`<span class="chip is-accent layer-main">${Zn(517)}</span>`:n.s6}
            ${l?n.qy`<span class="layer-count" title=${Zn(1182,{count:l})}>${l}</span>`:n.s6}
          </button>
        </li>`})}
    </ul>`}_pickLayer(e,t){const i=this._selection,n="target"===i.kind||"keys"===i.kind?i.targets??(i.target?[i.target]:[]):[];if(!t){const t=1===n.length&&n[0]===e&&"target"===i.kind;return void this._setSelection(t?_s:{kind:"target",target:e,targets:[e]})}const s=n.includes(e),a=s?n.filter(t=>t!==e):[...n,e];a.length?this._setSelection({kind:"target",target:s?i.target&&a.includes(i.target)?i.target:a[0]:e,targets:a}):this._setSelection(_s)}_renderLayers(e){const t=Ms("layers",e,this._selection).filter(e=>ws(e.tag)).map(t=>n.qy`<section class="layer-group" data-panel=${t.tag} aria-label=${Zn(t.title)} tabindex="-1">
          <h3 class="layer-head">${Zn(t.title)}</h3>
          ${this._editorEl(t.tag,e,{cls:"panel panel-layers",panel:!0})}
        </section>`),i=this._lips;return n.qy`<nav class="layers" id="layers" aria-label=${Zn(432)} ?inert=${i.isHidden("layers")} data-lip=${i.state("layers")} data-dir=${i.dir}>
      <div class="layers-head">
        <h2>${Zn(430)}</h2>
      </div>
      <div class="layers-body">${t.length?n.qy`${t}<p class="help layers-help">${Zn(387)}</p>`:this._renderLayerList(e)}</div>
    </nav>
    ${i.lip("layers")}`}_renderContext(e){const t=this._selection,i=t.keys?.length??0,s="keys"===t.kind?`${Zn(1182,{count:i})}${t.target?` · ${_a(e,t.target)}`:""}`:"target"===t.kind&&t.target?(t.targets?.length??0)>1?Zn(1200,{count:t.targets.length}):_a(e,t.target):"tool"===t.kind?Zn(1036,{tool:t.tool??""}):"";return n.qy`<div class="ctx">
      <button type="button" class="btn btn-text btn-sm ctx-back" title=${Zn(67)} @click=${()=>this._setSelection(_s)}>
        <ha-icon icon="mdi:arrow-left"></ha-icon>${Zn(65)}
      </button>
      <span class="ctx-what">${s}</span>
    </div>`}_renderFallback(e){const t=this._selection;if("target"===t.kind&&("element"===t.target||"icon"===t.target)&&Op(e)){const i=t.target===e.target;return this._section("target",_a(e,t.target),ka(t.target),n.qy`<p class="help">
            ${i?"icon"===t.target?Zn(959):Zn(960):"icon"===e.target?Zn(958):Zn(957)}
          </p>
          ${i?n.s6:n.qy`<button
                  type="button"
                  class="btn btn-secondary btn-sm make-main"
                  @click=${()=>this._set({target:t.target},"target")}
                >
                  <ha-icon icon="mdi:target"></ha-icon>${"icon"===t.target?Zn(500):Zn(499)}
                </button>`}
          ${"keyframes"===e.kind&&i?this._renderMoves(e):n.s6}`)}const i=t.keys?.length??0;return n.qy`<p class="help ctx-note">${"keys"===t.kind?Zn(1186,{count:i}):Zn(614)}</p>`}_renderInspector(e){const t=this._selection,i="inspector"===ys[e.kind].place?this._renderKindSlot(e):n.s6;if("none"===t.kind){const s=Ms("inspector",e,t).filter(e=>ws(e.tag)).map(t=>this._section(`panel-${t.tag}`,Zn(t.title),vp[t.tag]??"mdi:puzzle-outline",this._editorEl(t.tag,e,{cls:"panel panel-inspector",panel:!0})));return n.qy`${this._renderErrors()} ${i} ${this._renderForm(e)} ${s}`}const s=Ms("inspector",e,t).filter(e=>ws(e.tag)).map(t=>this._section(`panel-${t.tag}`,Zn(t.title),vp[t.tag]??"mdi:puzzle-outline",this._editorEl(t.tag,e,{cls:"panel panel-inspector",panel:!0,inspector:!0}))),a=this._viewOf(e),r=po(e,a,t)?go(e,a,co(t)):n.s6,o="target"!==t.kind||"element"!==t.target&&"icon"!==t.target||!Op(e)?n.s6:this._renderFallback(e),l="target"===t.kind&&"icon"===t.target&&"keyframes"===e.kind&&!e.rig?.parts?.length&&ws(bp)?this._section("split-icon",Zn(396),vp[bp],this._editorEl(bp,e,{cls:"panel panel-inspector",panel:!0})):n.s6,c=s.length?s:o===n.s6&&l===n.s6?this._renderFallback(e):n.s6;return n.qy`${r} ${this._renderContext(e)} ${this._renderErrors()} ${o} ${l} ${c}`}_zoomIcon(e){const t=this._selection;return"keyframes"===e.kind&&("tool"===t.kind||("target"===t.kind||"keys"===t.kind)&&!!t.target&&/^(part|group|shape):/.test(t.target))}_renderEditor(e){const t=this.dirty,i="panel"===ys[e.kind].place,s=this._slideOver,a=this._lips,r=this._viewOf(e),o=this._playable??e,l=function(e,t){const i=no(e,t);let n=0;for(const t of i){if(t.startsWith(io))continue;const s=so(e,t);s&&i.has(s)||n++}return n}(o,r);return n.qy`
      <header class="topbar">
        <div class="grp">
          <button type="button" class="btn btn-secondary btn-sm back" @click=${()=>this._back()}><ha-icon icon="mdi:arrow-left"></ha-icon>${Zn(436)}</button>
          <span class="vr" aria-hidden="true"></span>
          <div class="title">
            <strong class="doc-name">${e.name.trim()||Zn(1070)}</strong>
            <span class="chip kind"><ha-icon icon=${os[e.kind]}></ha-icon>${Zn(rs[e.kind])}</span>
            ${this._saved?t?n.qy`<span class="chip is-warn">${Zn(1068)}</span>`:n.s6:n.qy`<span class="chip is-accent">${Zn(559)}</span>`}
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <button
            type="button"
            class="icon-btn"
            aria-label=${Zn(1059)}
            title=${Zn(1059)}
            ?disabled=${!this._history.canUndo()}
            @click=${()=>this.undo()}
          >
            <ha-icon icon="mdi:undo"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn"
            aria-label=${Zn(723)}
            title=${Zn(723)}
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
                  aria-label=${Zn(411)}
                  title=${Zn(411)}
                  @click=${()=>this._inspOpen=!this._inspOpen}
                >
                  <ha-icon icon="mdi:tune-variant"></ha-icon>
                </button>`:n.s6}
          <button
            type="button"
            class="btn btn-primary btn-sm save"
            ?disabled=${this._busy||!t&&!!this._saved}
            title=${Zn(784)}
            @click=${()=>this.save()}
          >
            <ha-icon icon=${this._busy?"mdi:progress-upload":"mdi:content-save-outline"}></ha-icon>${this._busy?Zn(790):Zn(783)}
          </button>
        </div>
      </header>
      <div
        @preview-change=${this._onPreviewChange}
        @layer-view-change=${this._onLayerView}
        @emitter-change=${this._onEmitter}
        style=${this._lipTokens()}
        class="workspace ${a.isHidden("layers")?"no-layers":""} ${a.isHidden("inspector")?"no-inspector":""} ${this._compact?"compact":""} ${this._width>0&&this._width<1e3?"dense":""} ${s?"slide":""} ${s&&this._inspOpen?"insp-open":""}"
      >
        ${this._renderLayers(e)}
        <div class="center ${i?"with-panel":""}" style="--split: ${this._split}">
          <mcas-stage
            .doc=${this._previewDoc(o,r)}
            .layerView=${r}
            .hiddenLayers=${l}
            .stageParticles=${l?pd(o):void 0}
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
            ${"path"===e.kind&&ws(xs)?this._editorEl(xs,e,{slot:"canvas",stageRect:this._stageRect,subjectRect:this._subjectRect}):n.s6}
            ${this._panels("stage-tool",e,{slot:"overlay",stageRect:this._stageRect,subjectRect:this._subjectRect})}
          </mcas-stage>
          ${i?n.qy`<div
                    class="splitter"
                    role="separator"
                    tabindex="0"
                    aria-orientation="horizontal"
                    aria-label=${Zn(892)}
                    aria-valuemin="15"
                    aria-valuemax="80"
                    aria-valuenow=${Math.round(100*this._split)}
                    title=${Zn(270)}
                    @pointerdown=${this._onSplitDown}
                    @pointermove=${this._onSplitMove}
                    @pointerup=${this._onSplitUp}
                    @pointercancel=${this._onSplitUp}
                    @keydown=${this._onSplitKey}
                    @dblclick=${()=>this._resetSplit()}
                  ></div>
                  ${this._renderKindSlot(e)}`:n.s6}
        </div>
        ${a.lip("inspector")}
        <aside class="inspector" id="inspector" tabindex="-1" ?inert=${a.isHidden("inspector")} data-lip=${a.state("inspector")} data-dir=${a.dir} aria-label=${Zn(412)}>
          ${this._renderInspector(e)}
        </aside>
        ${s&&this._inspOpen?n.qy`<div class="insp-scrim" @click=${()=>this._inspOpen=!1}></div>`:n.s6}
      </div>
    `}_renderDialog(){const e=this._dialog;if(!e)return n.s6;const t=()=>{this._dialog===e&&(this._dialog=void 0)};switch(e.type){case"delete":{const{doc:i,uses:s,sequences:a}=e,r=[];return void 0===s?r.push(Zn(138)):s&&r.push(Zn(413,{count:s})),a.length&&r.push(Zn(819,{names:a.map(e=>e.name).join(", ")})),ud({heading:Zn(234,{name:i.name}),variant:"alert",initialFocus:"dlg-safe",onClose:t},n.qy`<div class="dlg">${r.map(e=>n.qy`<p>${e}</p>`)}</div>`,n.qy`<button type="button" class="btn btn-secondary btn-sm" id="dlg-safe" @click=${this._closeDialog}>${Zn(129)}</button>
            <button type="button" class="btn btn-danger btn-sm confirm-delete" @click=${()=>this._delete(i)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>${Zn(233)}
            </button>`)}case"discard":return ud({heading:Zn(787),variant:"alert",initialFocus:"dlg-safe",onClose:t},n.qy`<div class="dlg"><p>${Zn(0,{name:this._doc?.name||Zn(1015)})}</p></div>`,n.qy`<button type="button" class="btn btn-secondary btn-sm" id="dlg-safe" @click=${this._closeDialog}>${Zn(415)}</button>
            <button
              type="button"
              class="btn btn-secondary btn-sm discard"
              @click=${()=>{this._dialog=void 0,gp(up(this._saved?.id)),this._saved=this._doc??null,e.then()}}
            >
              ${Zn(255)}
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click=${async()=>{this._dialog=void 0,await this.save()&&e.then()}}
            >
              ${Zn(783)}
            </button>`);case"restore":return ud({heading:Zn(763),variant:"alert",initialFocus:"restore-draft",onClose:t},n.qy`<div class="dlg">
            <p>${e.isNew?Zn(986,{name:e.draft.name}):Zn(1,{name:e.draft.name})}</p>
          </div>`,n.qy`<button
              type="button"
              class="btn btn-secondary btn-sm discard-draft"
              @click=${()=>{this._dialog=void 0,gp(up(e.isNew?void 0:e.draft.id))}}
            >
              ${Zn(255)}
            </button>
            <button type="button" class="btn btn-primary btn-sm restore-draft" id="restore-draft" @click=${()=>this._restoreDraft(e.draft,e.isNew)}>
              ${Zn(762)}
            </button>`);case"export":case"import":return ud({heading:"export"===e.type?Zn(330):Zn(403),size:"l",dismissible:!1,onClose:t},n.qy`<mc-transfer-panel
            host="animation-studio"
            .mode=${e.type}
            .exportItems=${"export"===e.type?{kind:"animation",items:e.items}:void 0}
            .taken=${(e,t)=>this._taken(t)}
            @mc-transfer-import=${e=>{this._onImport(e)}}
            @mc-transfer-close=${this._closeDialog}
          ></mc-transfer-panel>`);case"icon":return ud({heading:Zn(393),size:"l",onClose:t},n.qy`<div class="dlg">
            ${ws("mc-anim-icon-start")?n.qy`<mc-anim-icon-start class="icon-start" .hass=${this.hass} .lookup=${this._lookup} @icon-start=${e=>this._startIcon(e)}></mc-anim-icon-start>`:n.qy`<p class="help">${Zn(449)}</p>`}
          </div>`,n.qy`<button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>${Zn(129)}</button>`);case"presets":return ud({heading:Zn(221),size:"xl",initialFocus:"preset-search",onClose:t},n.qy`<div class="dlg">
            <p class="help">${Zn(998)}</p>
            <div class="with-icon">
              <ha-icon icon="mdi:magnify"></ha-icon>
              <input
                class="input preset-search"
                id="preset-search"
                type="search"
                placeholder=${Zn(798)}
                aria-label=${Zn(798)}
                .value=${P(this._presetQuery)}
                @input=${e=>this._presetQuery=e.target.value}
              />
            </div>
            <mc-preset-grid
              class="preset-list"
              .sources=${this._presetSources()}
              .query=${this._presetQuery}
              .hass=${this.hass}
              .lookup=${this._lookup}
              .notice=${this._catalogueFailed?Zn(470):""}
              @preset-pick=${e=>this._pickPreset(e)}
              @preset-clear-search=${()=>{this._clearPresetSearch()}}
            ></mc-preset-grid>
          </div>`,n.qy`<button type="button" class="btn btn-secondary btn-sm" @click=${this._closeDialog}>${Zn(129)}</button>`)}}render(){if("ready"!==this._labels)return n.qy`<div class="shell" role="status">${"failed"===this._labels?"The studio texts (magic-card-i18n-labels.js) could not be loaded. Reload the page.":n.s6}</div>`;const e="editor"===this._view?this._doc:void 0;return n.qy`
      <div class="shell" data-view=${e?"editor":"library"}>${e?this._renderEditor(e):this._renderLibrary()}</div>
      ${this._renderDialog()}
      <div class="sr-only" role="status" aria-live="polite">${this._status}</div>
      ${this._lips.status()}
      ${this._status?n.qy`<div class="toast" aria-hidden="true">${this._status}</div>`:n.s6}
    `}}Bp.styles=[...bs,fd,mo],hp([(0,s.MZ)({attribute:!1})],Bp.prototype,"hass",void 0),hp([(0,s.MZ)({attribute:!1})],Bp.prototype,"library",void 0),hp([(0,s.MZ)({attribute:!1})],Bp.prototype,"selectedId",void 0),hp([(0,s.MZ)({attribute:!1})],Bp.prototype,"usage",void 0),hp([(0,s.MZ)({type:Boolean})],Bp.prototype,"standalone",void 0),hp([(0,s.wk)()],Bp.prototype,"_docs",void 0),hp([(0,s.wk)()],Bp.prototype,"_view",void 0),hp([(0,s.wk)()],Bp.prototype,"_query",void 0),hp([(0,s.wk)()],Bp.prototype,"_kind",void 0),hp([(0,s.wk)()],Bp.prototype,"_menu",void 0),hp([(0,s.wk)()],Bp.prototype,"_renaming",void 0),hp([(0,s.wk)()],Bp.prototype,"_dialog",void 0),hp([(0,s.wk)()],Bp.prototype,"_doc",void 0),hp([(0,s.wk)()],Bp.prototype,"_saved",void 0),hp([(0,s.wk)()],Bp.prototype,"_errors",void 0),hp([(0,s.wk)()],Bp.prototype,"_saveError",void 0),hp([(0,s.wk)()],Bp.prototype,"_busy",void 0),hp([(0,s.wk)()],Bp.prototype,"_status",void 0),hp([(0,s.wk)()],Bp.prototype,"_presetQuery",void 0),hp([(0,s.wk)()],Bp.prototype,"_catalogue",void 0),hp([(0,s.wk)()],Bp.prototype,"_catalogueFailed",void 0),hp([(0,s.wk)()],Bp.prototype,"_labels",void 0),hp([(0,s.wk)()],Bp.prototype,"_customRepeat",void 0),hp([(0,s.wk)()],Bp.prototype,"_selection",void 0),hp([(0,s.wk)()],Bp.prototype,"_tile",void 0),hp([(0,s.wk)()],Bp.prototype,"_split",void 0),hp([(0,s.wk)()],Bp.prototype,"_lipTop",void 0),hp([(0,s.wk)()],Bp.prototype,"_width",void 0),hp([(0,s.wk)()],Bp.prototype,"_height",void 0),hp([(0,s.wk)()],Bp.prototype,"_inspOpen",void 0),hp([(0,s.wk)()],Bp.prototype,"_collapsed",void 0),hp([(0,s.wk)()],Bp.prototype,"_time",void 0),hp([(0,s.wk)()],Bp.prototype,"_stageRect",void 0),hp([(0,s.wk)()],Bp.prototype,"_subjectRect",void 0),hp([(0,s.wk)()],Bp.prototype,"_stageInfo",void 0),hp([(0,s.wk)()],Bp.prototype,"_preview",void 0),hp([(0,s.wk)()],Bp.prototype,"_layerViews",void 0),hp([(0,s.wk)()],Bp.prototype,"_emitter",void 0),hp([(0,s.wk)()],Bp.prototype,"_playable",void 0);var Ip=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class Zp extends n.WF{constructor(){super(...arguments),this.lookup=()=>{},this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0}willUpdate(e){if(!this._visible||!this.doc||!customElements.get("magic-card"))return void(this._card=void 0);const t=!this._card;if(t&&(this._card=document.createElement("magic-card")),t||e.has("doc")||e.has("lookup"))try{this._card.setConfig(hs(this.doc,this.lookup,{tile:"icon",thumb:!0,as:this.doc.id}))}catch{return void(this._card=void 0)}(t||e.has("hass"))&&(this._card.hass=this.hass??Gd(!1))}render(){const e=this.doc?os[this.doc.kind]:"mdi:animation-outline";return n.qy`<div class="box" aria-hidden="true">
      ${this._card?n.qy`<div class="scale">${this._card}</div>`:n.qy`<ha-icon icon=${e}></ha-icon>`}
    </div>`}}Zp.styles=[ms,n.AH`
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
    `],Ip([(0,s.MZ)({attribute:!1})],Zp.prototype,"doc",void 0),Ip([(0,s.MZ)({attribute:!1})],Zp.prototype,"lookup",void 0),Ip([(0,s.MZ)({attribute:!1})],Zp.prototype,"hass",void 0),Ip([(0,s.wk)()],Zp.prototype,"_visible",void 0);const Kp=(0,n.iz)(":is(.mc-field, .mc-act-field, .mc-cond-field) :is(input, select, textarea):not([type='checkbox']):not([type='color']):not([type='range']):not([type='radio'])"),Wp=[ms,gs,n.AH`
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
  ${Kp},
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
  ${Kp}::placeholder,
  .mc-input-field.mc-input-field::placeholder {
    color: var(--mc-text-2);
    opacity: 1;
  }
  ${Kp}:hover,
  .mc-input-field.mc-input-field:hover {
    border-color: var(--mc-text-2);
  }
  ${Kp}:focus,
  .mc-input-field.mc-input-field:focus {
    outline: none;
    border-color: var(--mc-focus);
    box-shadow: 0 0 0 1px var(--mc-focus);
  }
  ${Kp}:disabled {
    background: var(--mc-surface-2);
    color: var(--mc-text-2);
    cursor: not-allowed;
  }
  ${Kp}.mono {
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }
  /* selects: .select look (bare selects get the chevron as a background image) */
  ${Kp}:is(select):not([multiple]):not([size]) {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 36px;
    cursor: pointer;
  }
  ${Kp}:is(select):not(.input):not([multiple]):not([size]) {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%238b919a' d='M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42Z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 18px 18px;
  }
  /* textareas: textarea.input */
  ${Kp}:is(textarea) {
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
`,n.AH`:host .seg>button:is([aria-checked=true],[aria-selected=true],[aria-pressed=true]){font-weight:700;box-shadow:inset 0 -3px 0 var(--mc-accent-ink)}`];var Up=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Gp=168,Yp=140,Jp=e=>14+e*Yp,Xp=e=>14+(1.5-e)/2*Yp,Qp=(e,t=Jp,i=Xp)=>`M${t(0)} ${i(0)} C${t(e[0])} ${i(e[1])} ${t(e[2])} ${i(e[3])} ${t(1)} ${i(1)}`,eh={"ease-in-out":409};let th=class extends n.WF{constructor(){super(...arguments),this.inherited="ease",this.disabled=!1,this.label="",this._textError=""}willUpdate(e){e.has("value")&&(this._textError="")}get _bezier(){return this._drag?.bezier??Fa(this.value||this.inherited)}_emit(e,t=!1){this.dispatchEvent(new CustomEvent("easing-change",{bubbles:!0,composed:!0,detail:t?{value:e,transient:t}:{value:e}}))}_fromPointer(e){const t=this.renderRoot.querySelector(".plot").getBoundingClientRect(),i=t.width/Gp||1;return[((e.clientX-t.left)/i-14)/Yp,1.5-((e.clientY-t.top)/i-14)/Yp*2]}_down(e,t){if(this.disabled||0!==e.button)return;const i=this._bezier??[0,0,1,1];e.preventDefault(),e.currentTarget.focus(),e.currentTarget.setPointerCapture?.(e.pointerId),this._drag={handle:t,bezier:[...i]}}_move(e){if(!this._drag)return;const[t,i]=this._fromPointer(e),n=[...this._drag.bezier];n[2*this._drag.handle]=t,n[2*this._drag.handle+1]=i,this._drag={...this._drag,bezier:Za(n)},this._emit(Ka(this._drag.bezier),!0)}_up(){if(!this._drag)return;const e=Ka(this._drag.bezier);this._drag=void 0,this._emit(e)}_key(e,t){const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(!i||this.disabled)return;e.preventDefault(),e.stopPropagation();const n=e.shiftKey?.1:.01,s=[...this._bezier??[0,0,1,1]];s[2*t]+=i[0]*n,s[2*t+1]+=i[1]*n,this._emit(Ka(Za(s)))}_num(e,t){const i=Number(t),n=[...this._bezier??[0,0,1,1]];""!==t.trim()&&Number.isFinite(i)?(n[e]=i,this._emit(Ka(Za(n)))):this.requestUpdate()}_text(e){const t=e.value.trim();if(!t)return void(this.value&&this._emit(void 0));if(t===(this.value??""))return;if(!ct(t))return void(this._textError=Zn(1076));this._textError="";const i=Fa(t);this._emit(i&&t.startsWith("cubic-bezier")?Ka(i):t)}render(){const e=this._bezier,t=this._drag?Ka(this._drag.bezier):this.value,i=Ba.map(e=>e.id),s=t?i.includes(t)?t:"custom":"",a=t?Fa(t)?`cubic-bezier(${Fa(t).join(",")})`:t:e?`cubic-bezier(${e.join(",")})`:"linear";return n.qy`
      <div class="presets" role="radiogroup" aria-label=${Zn(1216,{label:this.label||Zn(300)})}>
        ${[{id:"",label:Zn(227),bezier:Fa(this.inherited)},...Ba.map(e=>({...e,label:(0,N.t)(e.label)}))].map(e=>n.qy`<button
            type="button"
            class="preset"
            role="radio"
            data-easing=${e.id||"default"}
            aria-checked=${s===e.id?"true":"false"}
            title=${e.id?e.label:Zn(956,{easingLabel:sr(this.inherited).toLowerCase()})}
            ?disabled=${this.disabled}
            @click=${()=>this._emit(e.id||void 0)}
          >
            ${function(e){return n.qy`<svg class="glyph" viewBox="0 0 ${22} ${22}" aria-hidden="true">
    ${e?n.JW`<path d=${Qp(e,e=>3+16*e,e=>19-16*e*.82-2)}></path>`:n.JW`<path d="M3 ${17} H${19}" stroke-dasharray="2 2.5"></path>`}
  </svg>`}(e.bezier)}<span>${void 0!==eh[e.id]?Zn(eh[e.id]):e.label}</span>
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
            <svg viewBox="0 0 ${Gp} ${Gp}" aria-hidden="true">
              <g class="grid">
                <rect x=${Jp(0)} y=${Xp(1)} width=${Yp} height=${Xp(0)-Xp(1)} rx="2"></rect>
                ${[.25,.5,.75].map(e=>n.JW`<line x1=${Jp(e)} x2=${Jp(e)} y1=${Xp(1)} y2=${Xp(0)}></line><line x1=${Jp(0)} x2=${Jp(1)} y1=${Xp(e)} y2=${Xp(e)}></line>`)}
              </g>
              <path class="diag" d="M${Jp(0)} ${Xp(0)} L${Jp(1)} ${Xp(1)}"></path>
              ${e?n.JW`<line class="arm" x1=${Jp(0)} y1=${Xp(0)} x2=${Jp(e[0])} y2=${Xp(e[1])}></line>
                  <line class="arm" x1=${Jp(1)} y1=${Xp(1)} x2=${Jp(e[2])} y2=${Xp(e[3])}></line>
                  <path class="curve" d=${Qp(e)}></path>`:n.s6}
              <circle class="end" cx=${Jp(0)} cy=${Xp(0)} r="3.5"></circle>
              <circle class="end" cx=${Jp(1)} cy=${Xp(1)} r="3.5"></circle>
            </svg>
            ${e?[0,1].map(t=>n.qy`<button
                    type="button"
                    class="knob ${this._drag?.handle===t?"dragging":""}"
                    data-handle=${t}
                    style="left: ${Jp(e[2*t])/Gp*100}%; top: ${Xp(e[2*t+1])/Gp*100}%"
                    role="slider"
                    aria-label=${Zn(0===t?902:314)}
                    aria-valuemin="-1"
                    aria-valuemax="2"
                    aria-valuenow=${e[2*t+1]}
                    aria-valuetext=${`x ${e[2*t]}, y ${e[2*t+1]}`}
                    ?disabled=${this.disabled}
                    @pointerdown=${e=>this._down(e,t)}
                    @keydown=${e=>this._key(e,t)}
                  ></button>`):n.qy`<p class="steps-note">${t?.startsWith("steps")?Zn(926):""}</p>`}
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
              <label for="bz-text">${Zn(302)}</label>
              <input
                class="input mono"
                id="bz-text"
                type="text"
                spellcheck="false"
                autocomplete="off"
                placeholder=${Zn(228,{inherited:this.inherited})}
                aria-invalid=${this._textError?"true":"false"}
                aria-describedby=${this._textError?"bz-err":n.s6}
                .value=${t??""}
                ?disabled=${this.disabled}
                @change=${e=>this._text(e.target)}
                @keydown=${e=>"Enter"===e.key&&this._text(e.target)}
              />
              ${this._textError?n.qy`<p class="help error" id="bz-err">${this._textError}</p>`:n.s6}
            </div>
            <div class="preview" aria-hidden="true" style="--ease: ${a}"><i></i></div>
          </div>
        </div>
      </div>
    `}};th.styles=[Wp,n.AH`
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
        grid-template-columns: ${Gp}px minmax(0, 1fr);
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
        width: ${Gp}px;
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
    `],Up([(0,s.MZ)({type:String})],th.prototype,"value",void 0),Up([(0,s.MZ)({type:String})],th.prototype,"inherited",void 0),Up([(0,s.MZ)({type:Boolean})],th.prototype,"disabled",void 0),Up([(0,s.MZ)({type:String})],th.prototype,"label",void 0),Up([(0,s.wk)()],th.prototype,"_drag",void 0),Up([(0,s.wk)()],th.prototype,"_textError",void 0),th=Up([(0,s.EM)("mc-anim-bezier-editor")],th);var ih=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const nh=(e,t,i,n)=>e<t||e>i?Zn(540,{min:t,max:i,unit:n}):void 0,sh=(e,t)=>({...e,transform:{...e.transform??{},...t}}),ah=e=>void 0===e?void 0:Math.round(1e5*e)/1e3,rh=e=>{return(t=e,Math.round(10*t)/10)+"%";var t},oh={x:[{key:"x",label:1108,unit:"px",get:e=>e.transform?.x,set:(e,t)=>nh(t,-1e4,1e4,"px")??sh(e,{x:t})}],y:[{key:"y",label:1109,unit:"px",get:e=>e.transform?.y,set:(e,t)=>nh(t,-1e4,1e4,"px")??sh(e,{y:t})}],scale:[{key:"scale",label:791,unit:"%",get:e=>ah(e.transform?.scale),set:(e,t)=>nh(t,0,1e4,"%")??sh(e,{scale:t/100})}],scale_x:[{key:"scale_x",label:792,unit:"%",get:e=>ah(e.transform?.scale_x),set:(e,t)=>nh(t,-1e4,1e4,"%")??sh(e,{scale_x:t/100})}],scale_y:[{key:"scale_y",label:793,unit:"%",get:e=>ah(e.transform?.scale_y),set:(e,t)=>nh(t,-1e4,1e4,"%")??sh(e,{scale_y:t/100})}],rotate:[{key:"rotate",label:60,unit:"deg",get:e=>e.transform?.rotate,set:(e,t)=>nh(t,-36e3,36e3,"deg")??sh(e,{rotate:t})}],skew:[{key:"skew_x",label:852,unit:"deg",get:e=>e.transform?.skew_x??0,set:(e,t)=>nh(t,-89,89,"deg")??sh(e,{skew_x:t})},{key:"skew_y",label:853,unit:"deg",get:e=>e.transform?.skew_y??0,set:(e,t)=>nh(t,-89,89,"deg")??sh(e,{skew_y:t})}],opacity:[{key:"opacity",label:627,unit:"%",get:e=>ah(e.opacity),set:(e,t)=>nh(t,0,100,"%")??{...e,opacity:Math.round(10*t)/1e3}}],blur:[{key:"blur",label:109,unit:"px",get:e=>e.blur,set:(e,t)=>nh(t,0,200,"px")??{...e,blur:t}}],radius:[{key:"radius",label:720,unit:"px",get:e=>e.radius,set:(e,t)=>nh(t,0,1e3,"px")??{...e,radius:t}}],draw:[{key:"draw",label:283,unit:"%",get:e=>ah(e.draw),set:(e,t)=>nh(t,0,100,"%")??{...e,draw:Math.round(10*t)/1e3}}]},lh=[{id:"z",label:349},{id:"y",label:351,axis:[0,1,0]},{id:"x",label:350,axis:[1,0,0]}];let ch=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.entityColor="var(--primary-color, #03a9f4)",this._errors={}}willUpdate(e){e.has("doc")&&(this._draft=void 0),e.has("selection")&&(this._errors={})}get _view(){return this._draft??this.doc}get _keys(){const e=this._view;return e&&"keys"===this.selection?.kind?(this.selection.keys??[]).map(e=>({target:e.target,lane:e.lane,at:e.at})).filter(t=>za(e,t)):[]}_emit(e,t,i=!1){this.disabled||(this._draft=i?e:void 0,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}})))}_select(e){const t=this._view?$a(this._view):"element",i=e.length?{kind:"keys",target:e[e.length-1].target,targets:[...new Set(e.map(e=>e.target))],keys:e.map(e=>({target:e.target,lane:e.lane,at:e.at,id:Aa(e,t)}))}:{kind:"none"};this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:i}}))}_editTrack(e,t){const i=this.doc;return Ca(i,e,t(Sa(i,e)))}_setFragment(e,t,i,n,s){this.doc&&this._emit(this._editTrack(e,e=>function(e,t,i,n){let s=!1;const a=e.map(e=>{if(e.at!==i||!Ds(e,t))return e;s=!0;const a=Rs(Ns(e,t),n);return e.easings?{...a,easings:e.easings}:a});return s?a:Js(Qs(e,i,n))}(e,t,i,n)),s)}_ownEasing(e){const t=Sa(this._view,e.target);return"*"===e.lane?Us(t,e.at):Gs(t,e.lane,e.at)}_setEasing(e,t,i){if(!this.doc)return;let n=this.doc;for(const i of e){const e=Sa(n,i.target);n=Ca(n,i.target,"*"===i.lane?da(e,i.at,t):Ys(e,i.lane,i.at,t))}this._emit(n,"Change easing",i)}_delete(e){this.doc&&e.length&&(this._emit(La(this.doc,e),"Delete "+(1===e.length?"keyframe":"keyframes")),this._select([]))}_copy(e){const t=this.doc?Pa(this.doc,e):void 0;t&&va(t)}_moveTo(e,t){if(!this.doc)return;const i=Ea(this.doc,[e],t-e.at);this._emit(i.doc,"Move keyframe"),this._select(i.selection)}render(){const e=this._keys;return this._view&&e.length?(this._last=n.qy`<section class="insp" aria-label=${Zn(417)}>${e.length>1?this._renderMany(e):this._renderOne(e[0])}</section>`,this._last):"keys"===this.selection?.kind&&this.selection.keys?.length&&this._last?this._last:n.qy``}_easingEditor(e,t,i,s){return n.qy`<mc-anim-bezier-editor
      .value=${s}
      .inherited=${t}
      ?disabled=${this.disabled||i}
      @easing-change=${t=>this._setEasing(e,t.detail.value,!!t.detail.transient)}
    ></mc-anim-bezier-editor>`}_renderMany(e){const t=this._view,i=[...new Set(e.map(e=>e.at))].sort((e,t)=>e-t),s=[...new Set(e.map(e=>e.target))],a=new Set(e.map(e=>this._ownEasing(e)??"")),r=1===a.size&&[...a][0]||void 0,o=new Set(e.map(e=>e.lane)),l=s.length>1?Zn(1200,{count:s.length}):_a(t,s[0]);return n.qy`
      <div class="insp-head">
        <span class="tile"><ha-icon icon="mdi:selection-multiple"></ha-icon></span>
        <div class="insp-title">
          <b>${Zn(1196,{count:e.length})}</b>
          <span>${Zn(1262,{where:l,from:rh(i[0]),to:rh(i[i.length-1])})}</span>
        </div>
      </div>
      <p class="note">${Zn(263)}</p>
      <div class="foot-actions">
        <button type="button" class="btn btn-text btn-sm" data-act="copy" @click=${()=>this._copy(e)}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${Zn(197)}
        </button>
        <button type="button" class="btn btn-text btn-sm danger-text" data-act="delete" @click=${()=>this._delete(e)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${Zn(248,{count:e.length})}
        </button>
      </div>
      <div class="sub">
        <div class="sub-head"><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${Zn(301)}</span></div>
        ${a.size>1?n.qy`<p class="note">${Zn(1003)}</p>`:n.s6}
        ${o.size>1||!o.has("*")?n.qy`<p class="note">${Zn(719)}</p>`:n.s6}
        ${this._easingEditor(e,t.easing,!1,r)}
      </div>
    `}_renderOne(e){const t=this._view,i=Sa(t,e.target),s="*"===e.lane?Fs(i.filter(t=>t.at===e.at)):[e.lane],a="*"===e.lane?void 0:zs[e.lane],r="*"===e.lane?[]:Fs(i.filter(t=>t.at===e.at)).filter(t=>t!==e.lane),o=Zs(i,e.lane).every(t=>t<=e.at),l=(t.duration*e.at/100).toFixed(2),c=(t.tracks?.length??0)>0||e.target!==$a(t)?_a(t,e.target):"";return n.qy`
      <div class="insp-head">
        <span class="tile"><ha-icon icon=${a?.icon??ka(e.target)}></ha-icon></span>
        <div class="insp-title">
          <b>${Zn(a?a.label:416)}</b>
          <span>${c?Zn(1261,{target:c,at:rh(e.at),secs:l}):Zn(89,{at:rh(e.at),secs:l})}</span>
        </div>
        <button
          type="button"
          class="icon-btn sm danger"
          data-act="delete"
          aria-label=${Zn(239)}
          title=${Zn(239)}
          @click=${()=>this._delete([e])}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="kf-at">${Zn(705)}</label></div>
        <div class="at-field">
          <mc-unit-field
            inputId="kf-at"
            .label=${Zn(705)}
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
      ${s.length?s.map(t=>this._renderLaneFields(e.target,t,e.at,"*"===e.lane)):n.qy`<p class="note">${Zn(1024)}</p>`}
      ${r.length?n.qy`<div class="field">
              <div class="field-head"><span class="lbl">${Zn(51,{at:rh(e.at)})}</span></div>
              <div class="chips">
                ${r.map(t=>n.qy`<button type="button" class="chip" data-lane=${t} @click=${()=>this._select([{target:e.target,lane:t,at:e.at}])}>
                      <ha-icon icon=${zs[t].icon}></ha-icon>${Es(t)}
                    </button>`)}
                <button type="button" class="chip" data-lane="*" @click=${()=>this._select([{target:e.target,lane:"*",at:e.at}])}>
                  <ha-icon icon="mdi:key-variant"></ha-icon>${Zn(1105)}
                </button>
              </div>
            </div>`:n.s6}
      ${this._renderEasing(e,i,o)}
    `}_renderEasing(e,t,i){const s=this._view,a=Us(t,e.at);if("*"===e.lane)return n.qy`<div class="sub" data-easing="keyframe">
        <div class="sub-head"><ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${Zn(301)}</span></div>
        ${i?n.qy`<p class="note">${Zn(1023)}</p>`:n.s6}
        ${this._easingEditor([e],s.easing,i,a)}
      </div>`;const r=e.lane,o=Hs(r).filter(e=>e!==r),l=o.length?Yn(o.map(e=>Es(e))):"";return n.qy`<div class="sub" data-easing="lane">
      <div class="sub-head">
        <ha-icon icon="mdi:chart-bell-curve-cumulative"></ha-icon><span class="grow">${Zn(1213,{label:Es(r)})}</span>
      </div>
      ${i?n.qy`<p class="note">${Zn(1022)}</p>`:n.qy`<p class="note">
              ${Zn(a?626:625)}${l?` ${Zn(1222,{names:l})}`:""}
            </p>`}
      ${this._easingEditor([e],a??s.easing,i,Gs(t,r,e.at))}
      ${Ds(t.find(t=>t.at===e.at)??{at:0},r)?n.qy`<div class="ease-of">
              <button type="button" class="btn btn-text btn-sm" data-act="whole" @click=${()=>this._select([{target:e.target,lane:"*",at:e.at}])}>
                <ha-icon icon="mdi:key-variant"></ha-icon>${Zn(303)}
              </button>
            </div>`:n.s6}
    </div>`}_onAt(e,t){e.stopPropagation();const i=parseFloat(String(e.detail.value));if(!Number.isFinite(i)||i<0||i>100)return this._errors={...this._errors,at:Zn(539)},void e.target.revert?.();this._errors={...this._errors,at:""},i!==t.at&&this._moveTo(t,Math.round(100*i)/100)}_renderLaneFields(e,t,i,s){const a=zs[t],r=Ws(Sa(this._view,e),t,i),o=this._laneBody(e,t,i,r,s);return s?n.qy`<div class="sub" data-lane=${t}>
      <div class="sub-head">
        <ha-icon icon=${a.icon}></ha-icon><span class="grow">${Zn(a.label)}</span>
        <button
          type="button"
          class="icon-btn sm danger"
          aria-label=${Zn(743,{name:Zn(a.label).toLowerCase()})}
          title=${Zn(736)}
          @click=${()=>this._emit(this._editTrack(e,e=>ra(e,[{lane:t,at:i}])),`Remove ${t}`)}
        >
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${o}
    </div>`:n.qy`<div class="fields" data-lane=${t}>${o}</div>`}_laneBody(e,t,i,s,a=!1){const r=oh[t];return r?n.qy`
        <div class="pair">${r.map(n=>this._numField(e,t,i,s,n,a&&1===r.length))}</div>
        ${"rotate"===t?this._axisField(e,i,s):n.s6}
      `:"color"===t||"background"===t||"stroke"===t?this._colorField(e,t,i,s):"shadow"===t?this._shadowField(e,i,s):this._filterField(e,i,s)}_numField(e,t,i,s,a,r=!1){const o=a.get(s),l=`kf-${t}-${a.key}`,c=this._errors[l];return n.qy`<div class="field">
      ${r?n.s6:n.qy`<div class="field-head"><label for=${l}>${Zn(a.label)}</label></div>`}
      <mc-unit-field
        .inputId=${l}
        .label=${Zn(a.label)}
        .value=${void 0===o?"":`${o}${a.unit}`}
        .units=${[a.unit]}
        noCustom
        ?disabled=${this.disabled}
        @value-changed=${n=>{n.stopPropagation();const s=n.target,r=parseFloat(String(n.detail.value));if(!Number.isFinite(r))return void s.revert?.();const o=a.set(Ws(Sa(this._view,e),t,i),r);if("string"==typeof o)return this._errors={...this._errors,[l]:o},void s.revert?.();this._errors={...this._errors,[l]:""},this._setFragment(e,t,i,o,`Change ${t}`)}}
      ></mc-unit-field>
      ${c?n.qy`<p class="help error">${c}</p>`:n.s6}
    </div>`}_axisField(e,t,i){const s=i.transform?.axis,a=s?lh.find(e=>e.axis&&e.axis.every((e,t)=>e===s[t]))?.id??"custom":"z";return n.qy`<div class="field">
      <div class="field-head"><label for="kf-axis">${Zn(1048)}</label></div>
      <div class="select">
        <select
          class="input"
          id="kf-axis"
          ?disabled=${this.disabled}
          @change=${i=>{const n=lh.find(e=>e.id===i.target.value);if(!n)return;const s={...Ws(Sa(this._view,e),"rotate",t).transform??{}};n.axis?s.axis=[...n.axis]:delete s.axis,this._setFragment(e,"rotate",t,{transform:s},"Change turn axis")}}
        >
          ${lh.map(e=>n.qy`<option value=${e.id} ?selected=${a===e.id}>${Zn(e.label)}</option>`)}
          ${"custom"===a?n.qy`<option value="custom" selected>${Zn(218,{axis:s.join(", ")})}</option>`:n.s6}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`}_colorField(e,t,i,s){const a=`kf-${t}`,r=s[t],o=Zn("color"===t?942:"stroke"===t?932:93),l="background"===t?"background":"color";return n.qy`<div class="field">
      <div class="field-head"><span class="lbl">${o}</span></div>
      <mc-color-picker
        .value=${Ua(r)}
        .label=${o}
        allowEntity
        .entityColor=${this.entityColor}
        @value-changed=${n=>{n.stopPropagation();let s=Ga(String(n.detail.value??""));if(!s){if(!Ua(r).startsWith("entity"))return;s="var(--primary-color)"}Qa(s,l)?(this._errors={...this._errors,[a]:""},s!==r&&this._setFragment(e,t,i,{[t]:s},`Change ${o.toLowerCase()}`)):this._errors={...this._errors,[a]:Zn("color"===l?593:1075)}}}
      ></mc-color-picker>
      ${this._errors[a]?n.qy`<p class="help error">${this._errors[a]}</p>`:n.qy`<p class="help">${Zn(966)}</p>`}
    </div>`}_shadowField(e,t,i){const s=i.shadow??"",a=function(e){if(!e)return;const t=e.trim().match(/^(-?\d*\.?\d+)(?:px)?\s+(-?\d*\.?\d+)(?:px)?(?:\s+(\d*\.?\d+)(?:px)?)?(?:\s+(-?\d*\.?\d+)(?:px)?)?\s+(.+)$/);return t&&!/,(?![^(]*\))/.test(t[5])?{x:Number(t[1]),y:Number(t[2]),blur:Number(t[3]??0),spread:Number(t[4]??0),color:t[5].trim()}:void 0}(s),r=this._errors["kf-shadow"],o=i=>{Qa(i,"shadow")?(this._errors={...this._errors,"kf-shadow":""},i!==s&&this._setFragment(e,"shadow",t,{shadow:i},"Change shadow")):this._errors={...this._errors,"kf-shadow":Zn(595)}},l=(e,t)=>n.qy`<div class="field">
        <div class="field-head"><label for=${`kf-sh-${e}`}>${t}</label></div>
        <mc-unit-field
          .inputId=${`kf-sh-${e}`}
          .label=${Zn(829,{name:t.toLowerCase()})}
          .value=${`${a[e]}px`}
          .units=${["px"]}
          noCustom
          compact
          @value-changed=${t=>{t.stopPropagation();const i=parseFloat(String(t.detail.value));if(!Number.isFinite(i)||"blur"===e&&i<0)return t.target.revert?.();o(Ya({...a,[e]:i}))}}
        ></mc-unit-field>
      </div>`;return n.qy`
      <div class="chips" role="group" aria-label=${Zn(828)}>
        ${Ja.map(e=>n.qy`<button type="button" class="chip" aria-pressed=${s===e.value?"true":"false"} @click=${()=>o(e.value)}>${Zn(e.label)}</button>`)}
      </div>
      ${a?n.qy`<div class="quad">${l("x","X")} ${l("y","Y")} ${l("blur",Zn(109))} ${l("spread",Zn(888))}</div>
              <div class="field">
                <div class="field-head"><span class="lbl">${Zn(827)}</span></div>
                <mc-color-picker
                  .value=${Ua(a.color)}
                  .label=${Zn(827)}
                  allowEntity
                  .entityColor=${this.entityColor}
                  @value-changed=${e=>{e.stopPropagation();const t=Ga(String(e.detail.value??""))||"rgba(0, 0, 0, 0.3)";o(Ya({...a,color:t}))}}
                ></mc-color-picker>
              </div>`:n.qy`<div class="field">
              <div class="field-head"><label for="kf-shadow">${Zn(825)}</label></div>
              <input
                class="input mono"
                id="kf-shadow"
                type="text"
                spellcheck="false"
                .value=${s}
                @change=${e=>o(e.target.value.trim())}
              />
            </div>`}
      ${r?n.qy`<p class="help error">${r}</p>`:n.s6}
    `}_filterField(e,t,i){const s=i.filter??"",a=this._errors["kf-filter"],r=i=>{Qa(i,"filter")?(this._errors={...this._errors,"kf-filter":""},i!==s&&this._setFragment(e,"filter",t,{filter:i},"Change filter")):this._errors={...this._errors,"kf-filter":Zn(1081)}};return n.qy`
      <div class="chips" role="group" aria-label=${Zn(341)}>
        ${Xa.map(e=>n.qy`<button type="button" class="chip" aria-pressed=${s===e.value?"true":"false"} @click=${()=>r(e.value)}>${Zn(e.label)}</button>`)}
      </div>
      <div class="field">
        <div class="field-head"><label for="kf-filter">${Zn(340)}</label></div>
        <input
          class="input mono"
          id="kf-filter"
          type="text"
          spellcheck="false"
          autocomplete="off"
          aria-invalid=${a?"true":"false"}
          .value=${s}
          @change=${e=>r(e.target.value.trim())}
        />
        ${a?n.qy`<p class="help error">${a}</p>`:n.qy`<p class="help">${Zn(110)}</p>`}
      </div>
    `}};ch.styles=[Wp,n.AH`
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
    `],ih([(0,s.MZ)({attribute:!1})],ch.prototype,"doc",void 0),ih([(0,s.MZ)({attribute:!1})],ch.prototype,"hass",void 0),ih([(0,s.MZ)({attribute:!1})],ch.prototype,"library",void 0),ih([(0,s.MZ)({type:Number})],ch.prototype,"time",void 0),ih([(0,s.MZ)({type:Boolean,reflect:!0})],ch.prototype,"disabled",void 0),ih([(0,s.MZ)({attribute:!1})],ch.prototype,"selection",void 0),ih([(0,s.MZ)({attribute:!1})],ch.prototype,"tile",void 0),ih([(0,s.MZ)({attribute:!1})],ch.prototype,"stage",void 0),ih([(0,s.MZ)({type:String})],ch.prototype,"entityColor",void 0),ih([(0,s.wk)()],ch.prototype,"_errors",void 0),ih([(0,s.wk)()],ch.prototype,"_draft",void 0),ch=ih([(0,s.EM)("mc-anim-key-inspector")],ch),$s({tag:"mc-anim-key-inspector",place:"inspector",when:(e,t)=>"keyframes"===e.kind&&"keys"===t.kind&&!!t.keys?.length,title:416,order:0});var dh=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const ph=e=>Math.round(10*e)/10,hh=e=>`${ph(e)}%`;let uh=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.onionSkin=!1,this.layout="auto",this.entityColor="var(--primary-color, #03a9f4)",this._keys=[],this._width=0,this._viewW=0,this._menuOpen=!1,this._status="",this._zoom=1,this._unit="pct",this._snap=!0,this._grid="pct1",this._collapsed=new Set,this._laneFocus=new Map,this._selFrame=0,this._menuClosedAt=0,this._onTouchMove=e=>{"band"===this._drag?.kind&&"touch"===this._drag.pointerType&&e.preventDefault()},this._pxCache=0,this._onPointerMove=e=>{const t=this._hold;t&&e.pointerId===t.pointerId&&Math.hypot(e.clientX-t.x,e.clientY-t.y)>8&&this._cancelHold();const i=this._drag;if(!i||e.pointerId!==i.pointerId)return;if("seek"===i.kind)return void this._seek(this._atFromX(e.clientX));if("band"===i.kind){const t=this.renderRoot.querySelector(".lanes").getBoundingClientRect(),n=e.clientX-t.left,s=e.clientY-t.top;if(!i.moved&&Math.hypot(n-i.x0,s-i.y0)<3)return;i.moved=!0,this._band={x0:i.x0,y0:i.y0,x1:n,y1:s};const a=this._main,r=i.baseSel??[];return void this._select([...r,...this._keysInBand(i.centres).filter(e=>!r.some(t=>Aa(t,a)===Aa(e,a)))],!0)}const n=e.clientX-i.x0;if(!i.moved&&Math.abs(n)<3)return;i.moved=!0;const s=this._pxCache||this._pxPerPct(),a=this._snapAt(i.grab.at+n/s,e.shiftKey,i.duplicate?[]:i.sel,i.snaps,s);if(i.lastTarget===a)return;i.lastTarget=a;const r=Ea(i.base,i.sel,a-i.grab.at,i.duplicate),o=i.sel.length;i.label=i.duplicate?Zn(293,{count:o}):Zn(505,{count:o}),this._draft=r.doc,this._select(r.selection,!0);const l=r.selection[i.sel.findIndex(e=>Aa(e,this._main)===Aa(i.grab,this._main))];l&&this._laneFocus.set(`${l.target}|${l.lane}`,l.at),(r.doc!==i.base||i.emitted)&&(i.emitted=!0,this._emit(this._draft,i.label,!0),this._selFrame||(this._selFrame=requestAnimationFrame(()=>{this._selFrame=0,"keys"===this._drag?.kind&&this._emitSelection()})))},this._onPointerUp=e=>{const t=this._hold;if(t&&e.pointerId===t.pointerId)return this._cancelHold(),void("pointerup"!==e.type||t.additive||(this._lastTarget=t.target,this._select([])));const i=this._drag;if(i&&e.pointerId===i.pointerId){if(this._drag=void 0,this._pxCache=0,cancelAnimationFrame(this._selFrame),this._selFrame=0,"band"===i.kind)return this._band=void 0,void(i.moved||i.additive?this._emitSelection():(i.target&&(this._lastTarget=i.target),this._select([])));if("keys"===i.kind){if(i.moved&&this._draft&&i.emitted){const e=this._draft,t=this._keys.find(e=>e.target===i.grab.target&&e.lane===i.grab.lane);return t&&(this._pendingFocus=Aa(t,this._main)),this._emit(e,i.label??Zn(489)),this._emitSelection(),this._draft=e,void(this.doc===e&&(this._draft=void 0))}this._draft=void 0,!i.additive&&i.wasSelected&&this._select([i.clickKey])}}},this._onWheel=e=>{!e.ctrlKey&&!e.metaKey||this._narrow||(e.preventDefault(),this._setZoom(this._zoom*Math.exp(.002*-e.deltaY),e.clientX))}}get onion(){const e=Zs(this._kfsOf(this._active),"*"),t=100*this.time;return{prev:[...e].reverse().find(e=>e<t-.001),next:e.find(e=>e>t+.001)}}get selection(){return this._keys.map(e=>Aa(e,this._main))}set selection(e){this._select(e.map(e=>ja(e,this._main)))}get zoom(){return this._zoom}set zoom(e){this._zoom=Da(e)}connectedCallback(){var e;super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._ro=new ResizeObserver(e=>{const t=Math.round(e[0]?.contentRect.width??0);t&&t!==this._width&&(this._width=t)}),this._ro.observe(this)),this._unsubClip=(e=()=>this.requestUpdate(),ga.add(e),()=>ga.delete(e)),this.addEventListener("touchmove",this._onTouchMove,{passive:!1})}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect(),this._ro=void 0,this._bodyRo?.disconnect(),this._bodyRo=void 0,this._unsubClip?.(),this.removeEventListener("touchmove",this._onTouchMove),this._cancelHold(),cancelAnimationFrame(this._selFrame)}get _view(){return this._draft??this.doc}get _main(){return this._view?$a(this._view):"element"}_kfsOf(e){return this._view?Sa(this._view,e):[]}get _narrow(){return"narrow"===this.layout||"auto"===this.layout&&this._width>0&&this._width<480}get _active(){const e=this.studioSelection;return(!e||"target"!==e.kind&&"keys"!==e.kind?void 0:e.target)??this._keys[this._keys.length-1]?.target??this._lastTarget??this._main}_groups(){const e=this._view;if(!e)return[];const t=Ma(e),i=this.studioSelection,n=new Set([...i?.targets??[],...i?.target?[i.target]:[],...this._keys.map(e=>e.target)]),s=t.filter(e=>e.main||e.keyframes.length||n.has(e.target));for(const e of n)s.some(t=>t.target===e)||s.push({target:e,keyframes:[],main:!1});return s}_rows(){const e=[];for(const t of this._groups())if(e.push({target:t.target,lane:"*"}),!this._narrow&&!this._collapsed.has(t.target))for(const i of Fs(t.keyframes))e.push({target:t.target,lane:i});return e}willUpdate(e){if(e.has("doc")){this._drag||(this._draft=void 0);const e=this._view,t=e?this._keys.filter(t=>za(e,t)):[];t.length!==this._keys.length&&this._select(t)}e.has("studioSelection")&&this._adopt()}_adopt(){const e=this.studioSelection,t=this._view;if(e&&t)if("keys"===e.kind&&e.keys){const i=e.keys.map(e=>({target:e.target,lane:e.lane,at:e.at})).filter(e=>za(t,e)),n=this._main;i.map(e=>Aa(e,n)).join()!==this.selection.join()&&(this._keys=i)}else this._keys.length&&(this._keys=[])}updated(){const e=this._menuOpen?this.renderRoot.querySelector("mc-ui-menu.add-menu"):null;if(e&&!e.open&&(e.anchor=this.renderRoot.querySelector(".add-btn")??void 0,e.show()),this._pendingFocus){const e=this.renderRoot.querySelector(`.key[data-key="${CSS.escape(this._pendingFocus)}"]`);this._pendingFocus=void 0,e?.focus()}const t=this.renderRoot.querySelector(".tl-body");if(t&&!this._bodyRo&&"undefined"!=typeof ResizeObserver&&(this._bodyRo=new ResizeObserver(()=>{const e=this.renderRoot.querySelector(".tl-body")?.clientWidth??0;e&&e!==this._viewW&&(this._viewW=e)}),this._bodyRo.observe(t)),this._zoomAnchor&&t){const{at:e,clientX:i}=this._zoomAnchor;this._zoomAnchor=void 0;const n=this._trackRect();n&&(t.scrollLeft+=n.left+12+e/100*(n.width-24)-i)}}_emit(e,t,i=!1){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_select(e,t=!1){const i=this._main,n=new Set,s=e.filter(e=>{const t=Aa(e,i);return!n.has(t)&&(n.add(t),!0)}),a=s.map(e=>Aa(e,i)).join()!==this.selection.join();this._keys=s,s.length&&(this._lastTarget=s[s.length-1].target),a&&!t&&this._emitSelection()}_emitSelection(){const e=this._main,t=this._keys,i=[...new Set(t.map(e=>e.target))],n=t.length?{kind:"keys",target:t[t.length-1].target,targets:i,keys:t.map(t=>({target:t.target,lane:t.lane,at:t.at,id:Aa(t,e)}))}:{kind:"none"};!t.length&&this.studioSelection&&"keys"!==this.studioSelection.kind||this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:n}}))}_isLocked(e){const t=this.layerView,i=this.doc;return!(!i||!t?.locked.length)&&("*"!==e.lane?ro(i,t,`lane:${e.target}|${e.lane}`):ro(i,t,/^(part|group|shape):/.test(e.target)?e.target:`target:${e.target}`)||Qr(i,e.target).some(n=>ro(i,t,`lane:${e.target}|${n}`)))}_refuseLocked(e){const t=e.find(e=>this._isLocked(e));if(!t||!this._view)return!1;const i=_a(this._view,t.target);return this._announce(Zn(1230,{name:"*"===t.lane?i:`${i} ${zs[t.lane]?Es(t.lane).toLowerCase():t.lane}`})),!0}_commit(e,t,i){this.doc&&!this.disabled&&(this._emit(e,t),i&&this._select(i))}_seek(e){const t=Math.min(1,Math.max(0,e/100));this.dispatchEvent(new CustomEvent("seek",{bubbles:!0,composed:!0,detail:{time:t}}))}_announce(e){this._status="",this.updateComplete.then(()=>this._status=e)}_isSel(e){return this._keys.some(t=>t.target===e.target&&t.lane===e.lane&&t.at===e.at)}_trackRect(){return this.renderRoot.querySelector(".track, .ruler-track")?.getBoundingClientRect()}_atFromX(e){const t=this._trackRect();return!t||t.width<=24?0:(e-t.left-12)/(t.width-24)*100}_pxPerPct(){const e=this._trackRect();return e&&e.width>24?(e.width-24)/100:6}_snapTargets(e=[]){const t=this._main,i=new Set(e.map(e=>Aa(e,t))),n=new Set([100*this.time]);for(const e of this._groups())for(const s of["*",...Fs(e.keyframes)])for(const a of Zs(e.keyframes,s))i.has(Aa({target:e.target,lane:s,at:a},t))||n.add(a);return[...n]}_snapAt(e,t,i=[],n=this._snapTargets(i),s=this._pxPerPct()){return function(e,t){const i=e=>Math.min(100,Math.max(0,e));if(t.free)return i(Math.round(10*e)/10);let n;for(const i of t.targets??[])Math.abs(i-e)<=(t.threshold??0)&&(void 0===n||Math.abs(i-e)<Math.abs(n-e))&&(n=i);if(void 0!==n)return i(n);const s=function(e,t){const i=t>0?t:1;switch(e){case"pct5":return 5;case"s01":return.1/i*100;case"fps30":return 1/30/i*100;default:return 1}}(t.grid,t.duration);return i(Math.round(Math.round(e/s)*s*100)/100)}(e,{free:t||!this._snap,grid:this._grid,duration:this._view?.duration??1,targets:n,threshold:6/s})}_range(e,t){const i=this._rows(),n=i.findIndex(t=>t.target===e.target&&t.lane===e.lane),s=i.findIndex(e=>e.target===t.target&&e.lane===t.lane);if(n<0||s<0)return[t];const[a,r]=[Math.min(e.at,t.at),Math.max(e.at,t.at)],o=[];for(const e of i.slice(Math.min(n,s),Math.max(n,s)+1))for(const t of Zs(this._kfsOf(e.target),e.lane))t>=a&&t<=r&&o.push({target:e.target,lane:e.lane,at:t});return o}_onKeyDown(e,t){if(this.disabled||0!==e.button||!this.doc)return;e.preventDefault(),e.stopPropagation(),e.currentTarget.focus();const i=this._isSel(t),n=e.ctrlKey||e.metaKey;if(e.shiftKey&&this._anchor)this._select(n?[...this._keys,...this._range(this._anchor,t)]:this._range(this._anchor,t));else if(n){if(this._select(i?this._keys.filter(e=>Aa(e,this._main)!==Aa(t,this._main)):[...this._keys,t]),i)return}else i||this._select([t]),this._anchor=t;this._laneFocus.set(`${t.target}|${t.lane}`,t.at),this._refuseLocked(this._keys)||(this._drag={kind:"keys",pointerId:e.pointerId,x0:e.clientX,y0:e.clientY,moved:!1,base:this.doc,grab:t,sel:[...this._keys],duplicate:e.altKey,clickKey:t,wasSelected:i,additive:e.shiftKey||n,snaps:this._snapTargets(e.altKey?[]:this._keys)},this._pxCache=this._pxPerPct(),this._capture(e))}_cancelHold(){this._hold&&clearTimeout(this._hold.timer),this._hold=void 0}_onTrackDown(e,t){if(this.disabled||0!==e.button)return;const i=e.shiftKey||e.ctrlKey||e.metaKey;if("touch"===e.pointerType){this._cancelHold();const{pointerId:n,clientX:s,clientY:a}=e;return void(this._hold={pointerId:n,x:s,y:a,target:t,additive:i,timer:setTimeout(()=>{this._hold=void 0,this._startBand(n,s,a,t,i,"touch")},400)})}this._startBand(e.pointerId,e.clientX,e.clientY,t,i,e.pointerType)}_startBand(e,t,i,n,s,a){const r=this.renderRoot.querySelector(".lanes");if(!r)return;const o=r.getBoundingClientRect(),l=this._main,c=[...this.renderRoot.querySelectorAll(".lanes .key")].map(e=>{const t=e.getBoundingClientRect();return{key:ja(e.dataset.key,l),x:t.left+t.width/2-o.left,y:t.top+t.height/2-o.top}});this._drag={kind:"band",pointerId:e,x0:t-o.left,y0:i-o.top,moved:!1,baseSel:s?[...this._keys]:[],additive:s,target:n,pointerType:a,centres:c};try{r.setPointerCapture?.(e)}catch{}}_capture(e){const t=this.renderRoot.querySelector(".lanes");try{(t??e.currentTarget).setPointerCapture?.(e.pointerId)}catch{}}_keysInBand(e=[]){const t=this._band;if(!t)return[];const[i,n]=[Math.min(t.x0,t.x1),Math.max(t.x0,t.x1)],[s,a]=[Math.min(t.y0,t.y1),Math.max(t.y0,t.y1)];return e.filter(e=>e.x>=i&&e.x<=n&&e.y>=s&&e.y<=a).map(e=>e.key)}_onRulerDown(e){if(0===e.button){e.preventDefault(),this._drag={kind:"seek",pointerId:e.pointerId,x0:e.clientX,y0:e.clientY,moved:!1};try{e.currentTarget.setPointerCapture?.(e.pointerId)}catch{}this._seek(this._atFromX(e.clientX))}}_onRulerKey(e){const t=100*this.time,i=e.shiftKey?10:1,n={ArrowLeft:t-i,ArrowDown:t-i,ArrowRight:t+i,ArrowUp:t+i,Home:0,End:100,PageUp:t+10,PageDown:t-10};e.key in n&&(e.preventDefault(),this._seek(ph(n[e.key])))}_jump(e){const t=this.onion,i=e<0?t.prev:t.next;void 0!==i&&this._seek(i)}_setZoom(e,t){const i=Da(e);if(i===this._zoom)return;const n=this._trackRect(),s=void 0!==t?this._atFromX(t):100*this.time,a=t??(n?n.left+12+s/100*(n.width-24):0);this._zoomAnchor={at:s,clientX:a},this._zoom=i}_onKeyKeydown(e,t){if(this.disabled||!this._view)return;const i=e.ctrlKey||e.metaKey,n=this._main;if(!("ArrowLeft"!==e.key&&"ArrowRight"!==e.key||e.altKey||i)){e.preventDefault(),this._isSel(t)||this._select([t]);const i=this._keys;if(this._refuseLocked(i))return;const s=Ea(this._view,i,("ArrowLeft"===e.key?-1:1)*(e.shiftKey?10:1));if(s.doc===this._view)return;const a=i.findIndex(e=>Aa(e,n)===Aa(t,n)),r=s.selection[a]??s.selection[0];return r&&(this._pendingFocus=Aa(r,n),this._laneFocus.set(`${r.target}|${r.lane}`,r.at)),void this._commit(s.doc,"Move "+(1===i.length?"keyframe":"keyframes"),s.selection)}if("ArrowLeft"===e.key||"ArrowRight"===e.key||"Home"===e.key||"End"===e.key){e.preventDefault();const i=Zs(this._kfsOf(t.target),t.lane),n=i.indexOf(t.at),s="Home"===e.key?0:"End"===e.key?i.length-1:n+("ArrowLeft"===e.key?-1:1);return void(s>=0&&s<i.length&&this._focusKey({target:t.target,lane:t.lane,at:i[s]},e.shiftKey))}if("ArrowUp"===e.key||"ArrowDown"===e.key){e.preventDefault();const i=this._rows(),n=i.findIndex(e=>e.target===t.target&&e.lane===t.lane)+("ArrowUp"===e.key?-1:1);if(n<0||n>=i.length)return;const s=Zs(this._kfsOf(i[n].target),i[n].lane),a=s.reduce((e,i)=>Math.abs(i-t.at)<Math.abs(e-t.at)?i:e,s[0]);return void(void 0!==a&&this._focusKey({...i[n],at:a},e.shiftKey))}if("Delete"===e.key||"Backspace"===e.key)return e.preventDefault(),this._isSel(t)||this._select([t]),void this._delete();if(" "===e.key||"Enter"===e.key){e.preventDefault();const s=e.shiftKey||i;this._select(s?this._isSel(t)?this._keys.filter(e=>Aa(e,n)!==Aa(t,n)):[...this._keys,t]:[t]),s||(this._anchor=t)}}_onTimelineKeydown(e){if(this.disabled)return;const t=e.ctrlKey||e.metaKey,i=e.composedPath()[0]?.tagName;if("INPUT"===i||"TEXTAREA"===i||"SELECT"===i)return;const n=e.key.toLowerCase();if(t&&"c"===n)e.preventDefault(),this._copy();else if(t&&"v"===n)e.preventDefault(),this._paste();else if(t&&"a"===n){e.preventDefault();const t=[];for(const e of this._rows())for(const i of Zs(this._kfsOf(e.target),e.lane))this._narrow&&"*"!==e.lane||t.push({...e,at:i});this._select(t)}else!t||"="!==n&&"+"!==n&&"-"!==n?"Escape"===e.key&&this._keys.length&&(e.preventDefault(),e.stopPropagation(),this._select([])):(e.preventDefault(),this._setZoom(Ta(this._zoom,"-"===n?-1:1)))}_focusKey(e,t=!1){this._select(t&&!this._isSel(e)?[...this._keys,e]:t?this._keys:[e]),t||(this._anchor=e),this._laneFocus.set(`${e.target}|${e.lane}`,e.at),this._pendingFocus=Aa(e,this._main),this.requestUpdate()}_add(e,t,i){const n=this._view;if(!this.doc||!n||this.disabled)return;if(this._refuseLocked([{target:e,lane:t}]))return;const s=ph(Math.min(100,Math.max(0,i))),a=Sa(n,e),r="*"===t?function(e,t,i){const n=Xs(t);let s=e;for(const t of Fs(e))s=Qs(s,n,ca(e,t,n,i));return e.some(e=>e.at===n)||s!==e||(s=[...e,{at:n}]),{keyframes:Js(s),selection:[{lane:"*",at:n}]}}(a,s,n.easing):function(e,t,i,n){const s=Xs(i),a=ca(e,t,s,n)??zs[t].def;return{keyframes:Js(Qs(e,s,a)),selection:[{lane:t,at:s}]}}(a,t,s,n.easing),o=r.selection.map(t=>({...t,target:e}));this._pendingFocus=Aa(o[0],this._main),this._laneFocus.set(`${e}|${t}`,o[0].at),this._anchor=o[0],this._collapsed.delete(e),this._commit(Ca(n,e,r.keyframes),"*"===t?Zn(29):Zn(40,{lane:Es(t).toLowerCase()}),o)}_onTrackDblClick(e,t,i){e.target.closest(".key")||this._add(t,i,this._snapAt(this._atFromX(e.clientX),e.shiftKey))}_addLane(e){this._menuOpen=!1,this._add(this._active,e,100*this.time)}_delete(){const e=this._keys.length,t=this._view;e&&t&&!this._refuseLocked(this._keys)&&(this._commit(La(t,this._keys),"Delete "+(1===e?"keyframe":"keyframes"),[]),this._announce(Zn(1184,{count:e})))}_copy(){const e=this._view,t=e?Pa(e,this._keys):void 0;t&&(va(t),this._announce(Zn(1183,{count:t.items.length})))}_paste(){const e=fa(),t=this._view;if(!e||!t||!this.doc)return;const i=new Set(e.items.map(e=>e.target??this._main)),n=1===new Set(this._keys.map(e=>`${e.target}|${e.lane}`)).size&&"*"!==this._keys[0].lane?this._keys[0]:void 0,s=i.size>1?{}:n?{target:n.target,lane:n.lane}:{target:this._active},a=function(e,t,i,n={}){const s=$a(e),a=new Set(t.items.map(e=>e.lane)),r=!n.lane||1!==a.size||a.has("*")||a.has(n.lane)?void 0:{from:[...a][0],to:n.lane},o=new Map;let l=0;for(const e of t.items){const t=n.target??e.target??s;let i=e;if(r){const t=xa(r.from,r.to,e.frag);if(!t){l++;continue}i={...e,lane:r.to,frag:t,easings:e.easings?.[r.from]?{[r.to]:e.easings[r.from]}:void 0}}if("*"!==i.lane&&!Ls(t).some(e=>e.id===i.lane)){l++;continue}if("*"===i.lane&&!qs(t)&&(void 0!==i.frag.draw||void 0!==i.frag.stroke)){const e={...i.frag};delete e.draw,delete e.stroke,i={...i,frag:e}}const a=o.get(t)??[];a.push(i),o.set(t,a)}let c=e;const d=[];for(const[e,t]of o){const n=ua(Sa(c,e),{items:t},i);c=Ca(c,e,n.keyframes),d.push(...n.selection.map(t=>({...t,target:e})))}return{doc:c,selection:d,skipped:l}}(t,e,ph(100*this.time),s);if(!a.selection.length)return void this._announce(Zn(611));if(this._refuseLocked(a.selection))return;this._commit(a.doc,"Paste "+(1===a.selection.length?"keyframe":"keyframes"),a.selection);const r=a.skipped?Zn(11,{skipped:a.skipped}):"";this._announce(Zn(1185,{count:a.selection.length,at:hh(100*this.time),skipped:r}))}_selectLane(e,t,i){const n=Zs(this._kfsOf(e),t).map(i=>({target:e,lane:t,at:i}));this._lastTarget=e,this._select(i?[...this._keys.filter(i=>!(i.target===e&&i.lane===t)),...n]:n)}_toggleGroup(e){const t=new Set(this._collapsed);t.has(e)?t.delete(e):t.add(e),this._collapsed=t}render(){if(!this._view)return n.qy``;const e=this._narrow;return n.qy`
      <div class="shell" @keydown=${this._onTimelineKeydown}>
        ${this._renderBar(e)} ${e?this._renderNarrow():this._renderTimeline()}
        <div class="sr-only" role="status" aria-live="polite">${this._status}</div>
      </div>
    `}_renderAddMenu(e,t,i){const s=e.map((t,i)=>({id:t.id,label:Zn(t.label),icon:t.icon,separatorBefore:i>0&&e[i-1].group!==t.group}));return n.qy`<mc-ui-menu
      class="add-menu"
      .items=${s}
      label=${Zn(33,{target:_a(this._view,t),at:hh(i)})}
      @mc-menu-pick=${e=>{e.stopPropagation(),this._addLane(e.detail.id)}}
      @mc-menu-close=${e=>{e.stopPropagation(),"outside"===e.detail.reason&&(this._menuClosedAt=Date.now()),this._menuOpen=!1}}
    ></mc-ui-menu>`}_renderBar(e){const t=100*this.time,i=(this._view.duration*this.time).toFixed(2),s=this.onion,a=this._active,r=new Set(Fs(this._kfsOf(a))),o=Ls(a).filter(e=>!r.has(e.id)),l=fa();return n.qy`
      <div class="bar">
        <div class="readout" role="group" aria-label=${Zn(694)}>
          <button
            type="button"
            class="icon-btn sm"
            aria-label=${Zn(717)}
            title=${Zn(717)}
            ?disabled=${void 0===s.prev}
            @click=${()=>this._jump(-1)}
          >
            <ha-icon icon="mdi:skip-previous"></ha-icon>
          </button>
          <span class="now">${hh(t)} <small>${i} s</small></span>
          <button
            type="button"
            class="icon-btn sm"
            aria-label=${Zn(566)}
            title=${Zn(566)}
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
          title=${Zn(23,{target:_a(this._view,a)})}
          ?disabled=${this.disabled||!o.length}
          @click=${()=>{this._menuOpen?this._menuOpen=!1:Date.now()-this._menuClosedAt>400&&(this._menuOpen=!0)}}
        >
          <ha-icon icon="mdi:plus"></ha-icon><span class="lbl">${Zn(e?718:32)}</span>
        </button>
        ${this._menuOpen?this._renderAddMenu(o,a,t):n.s6}
        <span class="spacer"></span>
        <div class="tools" role="toolbar" aria-label=${Zn(419)}>
          <button
            type="button"
            class="icon-btn sm"
            data-act="copy"
            aria-label=${Zn(201)}
            title=${Zn(198)}
            ?disabled=${!this._keys.length}
            @click=${this._copy}
          >
            <ha-icon icon="mdi:content-copy"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm"
            data-act="paste"
            aria-label=${Zn(662)}
            title=${l?Zn(661,{target:_a(this._view,a)}):Zn(202)}
            ?disabled=${!l||this.disabled}
            @click=${this._paste}
          >
            <ha-icon icon="mdi:content-paste"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm danger"
            data-act="delete"
            aria-label=${Zn(240)}
            title=${Zn(235)}
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
            aria-label=${Zn(621)}
            title=${Zn(622)}
            @click=${()=>this.onionSkin=!this.onionSkin}
          >
            <ha-icon icon="mdi:layers-triple-outline"></ha-icon>
          </button>
        </div>
      </div>
    `}_renderRuler(){const e=Math.min(1,Math.max(0,this.time)),t=this.onionSkin?this.onion:{},i=this._narrow,s=this._pxPerPct(),a=function(e,t,i){const n=t>0?t:1,s=64/(e>0?e:6),a=e=>String(Math.round(1e3*e)/1e3);let r,o;"s"===i?(r=Ra(s/100*n)/n*100,o=e=>`${a(e/100*n)} s`):(r=Math.min(50,Ra(s)),o=e=>`${a(e)}%`);const l=Math.abs(r/Ra(r/5)-5)<.01?5:4,c=r/l,d=[],p=[];for(let e=0;e*c<=100.000001&&e<2e3;e++){const t=Math.round(e*c*1e3)/1e3;e%l===0?d.push(t):p.push(t)}return{major:d,minor:p,label:o}}(i?Math.min(s,2.5):s,this._view.duration,this._unit),r=a.major.filter(t=>Math.abs(t-100*e)*s>34);return n.qy`
      <div class="ruler">
        <div class="ruler-head">${i?"":"s"===this._unit?Zn(801):Zn(225)}</div>
        <div
          class="ruler-track"
          role="slider"
          tabindex="0"
          aria-label=${Zn(694)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow=${ph(100*e)}
          aria-valuetext=${Zn(1253,{pct:hh(100*e),seconds:(this._view.duration*e).toFixed(2)})}
          @pointerdown=${this._onRulerDown}
          @pointermove=${this._onPointerMove}
          @pointerup=${this._onPointerUp}
          @pointercancel=${this._onPointerUp}
          @keydown=${this._onRulerKey}
        >
          ${a.minor.map(e=>n.qy`<i class="tick" style="--at: ${e/100}"></i>`)}
          ${a.major.map(e=>n.qy`<i class="tick major" style="--at: ${e/100}"></i>`)}
          ${r.map(e=>n.qy`<span class="tick-label ${0===e?"first":e>=99.999?"last":""}" style="--at: ${e/100}">${a.label(e)}</span>`)}
          ${void 0!==t.prev?n.qy`<i class="ghost" style="--at: ${t.prev/100}"></i>`:n.s6}
          ${void 0!==t.next?n.qy`<i class="ghost" style="--at: ${t.next/100}"></i>`:n.s6}
          <span class="ph-tag" style="--t: ${e}">${"s"===this._unit?`${(this._view.duration*e).toFixed(2)} s`:hh(100*e)}</span>
        </div>
      </div>
    `}_overlays(){const e=Math.min(1,Math.max(0,this.time)),t=this.onionSkin?this.onion:{},i=t.prev??(void 0!==t.next?100*e:void 0),s=t.next??(void 0!==t.prev?100*e:void 0);return n.qy`
      ${this.onionSkin&&void 0!==i&&void 0!==s?n.qy`<div class="onion-band" style="--a: ${i/100}; --b: ${s/100}" aria-hidden="true"></div>`:n.s6}
      <div class="ph-line" style="--t: ${e}" aria-hidden="true"></div>
    `}_laneTab(e,t,i){const n=this._laneFocus.get(`${e}|${t}`);return void 0!==n&&i.includes(n)?n:this._keys.find(n=>n.target===e&&n.lane===t&&i.includes(n.at))?.at??i[0]}_renderKeys(e,t,i){const s=e.keyframes,a=e.target,r=this._main,o=this._laneTab(a,t,i),l=this.onionSkin&&a===this._active?this.onion:{},c=a===r&&1===this._groups().length?"":`${_a(this._view,a)} `,d="*"===t?c?Zn(1259,{target:c.trim()}):Zn(1139):c?Zn(1260,{target:c.trim(),lane:Es(t).toLowerCase()}):Zn(1219,{lane:Es(t).toLowerCase()}),p=d.charAt(0).toUpperCase()+d.slice(1),h=i.slice(0,-1).map((e,r)=>{const o=i[r+1],l=this._isSel({target:a,lane:t,at:e})&&this._isSel({target:a,lane:t,at:o});if("*"!==t)return n.qy`<i class="span ${l?"sel":""} ${Gs(s,t,e)?"own":""}" style="--a: ${e/100}; --b: ${o/100}"></i>`;const c=Fa(Us(s,e)??this._view.easing),d=c?`M0 20 C${100*c[0]} ${20-16*c[1]} ${100*c[2]} ${20-16*c[3]} 100 4`:"M0 20 L100 4";return n.qy`<i class="span ${l?"sel":""}" style="--a: ${e/100}; --b: ${o/100}">
        <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
          ${n.JW`<path class="area" d="${d} L100 24 L0 24 Z"></path><path d=${d}></path>`}
        </svg>
      </i>`});return[...h,...i.map(e=>{const i={target:a,lane:t,at:e},c=this._isSel(i),d="*"===t?this._kfLanesText(s,e):nr(t,Ws(s,t,e)),h=this._isLocked(i);return n.qy`<button
        type="button"
        class="key ${c?"sel":""} ${h?"locked":""} ${e===l.prev||e===l.next?"onion":""} ${"keys"===this._drag?.kind&&c?"dragging":""}"
        style="--at: ${e/100}"
        data-key=${Aa(i,r)}
        data-lane=${t}
        data-target=${a}
        data-at=${e}
        role="slider"
        tabindex=${e===o?"0":"-1"}
        aria-label=${p}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${e}
        aria-valuetext=${[hh(e),d,c?Zn(1158):"",h?Zn(1146):""].filter(Boolean).join(", ")}
        aria-describedby="kf-help"
        title=${d?Zn(1212,{label:p,at:hh(e),value:d}):Zn(1211,{label:p,at:hh(e)})}
        @pointerdown=${e=>this._onKeyDown(e,i)}
        @keydown=${e=>this._onKeyKeydown(e,i)}
        @focus=${()=>this._laneFocus.set(`${a}|${t}`,e)}
        @dblclick=${e=>e.stopPropagation()}
      ></button>`})]}_kfLanesText(e,t){return Fs(e.filter(e=>e.at===t)).map(e=>Es(e)).join(", ")}_renderGroupHead(e,t){const i=Zs(e.keyframes,"*"),s=_a(this._view,e.target),a=!this._collapsed.has(e.target),r=e.target===this._active&&!t;return n.qy`
      <div
        class="row lane summary ${r?"target-active":""} ${this._keys.some(t=>t.target===e.target&&"*"===t.lane)?"active":""}"
        data-lane="*"
        data-target=${e.target}
        role="group"
        aria-label=${Zn(1233,{name:s})}
      >
        <div class="head">
          <button
            type="button"
            class="icon-btn sm collapse"
            aria-expanded=${a?"true":"false"}
            aria-label=${Zn(a?176:326,{name:s})}
            title=${Zn(a?175:325)}
            @click=${()=>this._toggleGroup(e.target)}
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            type="button"
            class="lane-name"
            title=${Zn(807,{name:s.toLowerCase()})}
            @click=${t=>this._selectLane(e.target,"*",t.shiftKey||t.ctrlKey||t.metaKey)}
          >
            <ha-icon icon=${ka(e.target)}></ha-icon>
            <span class="nm">${s}</span>
          </button>
          <button
            type="button"
            class="icon-btn sm lane-add"
            aria-label=${Zn(25,{name:s.toLowerCase()})}
            title=${Zn(22)}
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
    `}_renderLane(e,t){const i=e.keyframes,s=Zs(i,t),a=zs[t],r=nr(a.id,ca(i,a.id,100*this.time,this._view.easing)),o=this._keys.some(i=>i.target===e.target&&i.lane===t);return n.qy`
      <div class="row lane sub ${o?"active":""}" data-lane=${t} data-target=${e.target} role="group" aria-label=${Zn(1215,{label:Zn(a.label)})}>
        <div class="head">
          <button
            type="button"
            class="lane-name"
            title=${Zn(807,{name:Zn(a.label).toLowerCase()})}
            @click=${i=>this._selectLane(e.target,t,i.shiftKey||i.ctrlKey||i.metaKey)}
          >
            <ha-icon icon=${a.icon}></ha-icon>
            <span class="nm">${Zn(a.label)}</span>
            ${r?this._laneValue(i,a.id,r):n.s6}
          </button>
          <button
            type="button"
            class="icon-btn sm lane-add"
            aria-label=${Zn(41,{name:Zn(a.label).toLowerCase()})}
            title=${Zn(22)}
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
    `}_laneValue(e,t,i){const s=ca(e,t,100*this.time,this._view.easing)??{},a=(e,t="")=>n.qy`<span class="val" title=${Zn(88,{text:i})}><i class="sw" style="background: ${e};${t}"></i></span>`,r=e=>e.replace(/var\(--mc-anim-c\)/g,this.entityColor);return"color"===t&&s.color?a(r(s.color)):"background"===t&&s.background?a(r(s.background)):"stroke"===t&&s.stroke?a(r(s.stroke)):"shadow"===t&&s.shadow?a("var(--mc-surface)",`box-shadow: ${"none"===s.shadow?"none":r(s.shadow).replace(/(\d+(?:\.\d+)?)px/g,(e,t)=>`${Math.min(4,Number(t)/4)}px`)}`):"filter"===t&&s.filter?n.qy`<span class="val" title=${Zn(87,{filter:s.filter})}>${s.filter.match(/^[a-z-]+/)?.[0]??s.filter}</span>`:n.qy`<span class="val" title=${Zn(88,{text:i})}>${i}</span>`}_trackWidth(){if(this._zoom<=1||!this._viewW)return;const e=this._narrow?44:216;return`${Math.round(Math.max(100,this._viewW-e)*this._zoom)}px`}_renderTimeline(){const e=this._groups(),t=1===e.length,i=[];for(const s of e){if(i.push(this._renderGroupHead(s,t)),this._collapsed.has(s.target))continue;const e=Fs(s.keyframes);for(const t of e)i.push(this._renderLane(s,t));e.length||s.main||i.push(n.qy`<div class="empty-group">${Zn(578)}</div>`)}const s=this._band,a=this._trackWidth(),r=e.every(e=>!Fs(e.keyframes).length);return n.qy`
      <div class="tl" role="group" aria-label=${Zn(418)}>
        <div class="tl-body" @wheel=${this._onWheel}>
          <div class="tl-content" style=${a?`--tw: ${a}`:""}>
            ${this._renderRuler()}
            <div class="lanes" @pointermove=${this._onPointerMove} @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
              ${i}
              ${s?n.qy`<div
                      class="band"
                      style="left: ${Math.min(s.x0,s.x1)}px; top: ${Math.min(s.y0,s.y1)}px; width: ${Math.abs(s.x1-s.x0)}px; height: ${Math.abs(s.y1-s.y0)}px"
                    ></div>`:n.s6}
            </div>
            ${r?n.qy`<div class="empty-lanes"><ha-icon icon="mdi:information-outline"></ha-icon>${Zn(582)}</div>`:n.s6}
            ${this._overlays()}
          </div>
        </div>
        ${this._renderFoot()}
        <span class="sr-only" id="kf-help">
          ${Zn(268)}
        </span>
      </div>
    `}_renderFoot(){const e=this._zoom;return n.qy`<div class="tl-foot" role="toolbar" aria-label=${Zn(1031)}>
      <button
        type="button"
        class="icon-btn sm"
        data-act="snap"
        aria-pressed=${this._snap?"true":"false"}
        aria-label=${Zn(863)}
        title=${Zn(862)}
        @click=${()=>this._snap=!this._snap}
      >
        <ha-icon icon="mdi:magnet"></ha-icon>
      </button>
      <label class="grid-select">
        <span class="sr-only">${Zn(861)}</span>
        <div class="select">
          <select
            class="input"
            data-act="grid"
            aria-label=${Zn(861)}
            ?disabled=${!this._snap}
            @change=${e=>this._grid=e.target.value}
          >
            ${Ha.map(e=>n.qy`<option value=${e.id} ?selected=${e.id===this._grid}>${Zn(e.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </label>
      <button
        type="button"
        class="unit-btn"
        data-act="units"
        aria-label=${"s"===this._unit?Zn(777):Zn(776)}
        title=${Zn(775)}
        @click=${()=>this._unit="s"===this._unit?"pct":"s"}
      >
        ${"s"===this._unit?"s":"%"}
      </button>
      <span class="spacer"></span>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-out"
        aria-label=${Zn(1114)}
        title=${Zn(1115)}
        ?disabled=${e<=1}
        @click=${()=>this._setZoom(Ta(e,-1))}
      >
        <ha-icon icon="mdi:magnify-minus-outline"></ha-icon>
      </button>
      <span class="zoom-pct" aria-live="polite" title=${Zn(210)}>${Math.round(100*e)}%</span>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-in"
        aria-label=${Zn(1112)}
        title=${Zn(1113)}
        ?disabled=${e>=10}
        @click=${()=>this._setZoom(Ta(e,1))}
      >
        <ha-icon icon="mdi:magnify-plus-outline"></ha-icon>
      </button>
      <button
        type="button"
        class="icon-btn sm"
        data-act="zoom-fit"
        aria-label=${Zn(345)}
        title=${Zn(346)}
        ?disabled=${e<=1}
        @click=${()=>this._setZoom(1)}
      >
        <ha-icon icon="mdi:arrow-expand-horizontal"></ha-icon>
      </button>
    </div>`}_renderNarrow(){const e=this._active,t=this._kfsOf(e),i={target:e,keyframes:t,main:e===this._main},s=Zs(t,"*");return n.qy`
      <div class="tl narrow" role="group" aria-label=${Zn(418)}>
        <div class="tl-body">
          <div class="tl-content">
            ${this._renderRuler()}
            <div class="lanes" @pointermove=${this._onPointerMove} @pointerup=${this._onPointerUp} @pointercancel=${this._onPointerUp}>
              ${this._renderGroupHead(i,!0)}
            </div>
            ${this._overlays()}
          </div>
          <ul class="kf-list" aria-label=${Zn(420)}>
            ${s.map(i=>{const s={target:e,lane:"*",at:i},a=this._isSel(s),r=this._kfLanesText(t,i),o=Us(t,i),l=Fs(t.filter(e=>e.at===i)).map(e=>nr(e,Ws(t,e,i))).filter(Boolean).join(" · ");return n.qy`<li>
                <button
                  type="button"
                  class="kf-row"
                  data-at=${i}
                  aria-pressed=${a?"true":"false"}
                  @click=${t=>{const n=t.shiftKey||t.ctrlKey||t.metaKey;this._select(n?a?this._keys.filter(t=>!(t.target===e&&"*"===t.lane&&t.at===i)):[...this._keys,s]:[s])}}
                >
                  <span class="at">${hh(i)}</span>
                  <span class="props">${r||Zn(312)}${l?n.qy`<small>${l}</small>`:n.s6}</span>
                  <span class="ease">${sr(o)}</span>
                </button>
              </li>`})}
          </ul>
        </div>
        <span class="sr-only" id="kf-help">${Zn(72)}</span>
      </div>
    `}};uh.styles=[Wp,n.AH`
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
    `],dh([(0,s.MZ)({attribute:!1})],uh.prototype,"doc",void 0),dh([(0,s.MZ)({attribute:!1})],uh.prototype,"hass",void 0),dh([(0,s.MZ)({attribute:!1})],uh.prototype,"library",void 0),dh([(0,s.MZ)({type:Number})],uh.prototype,"time",void 0),dh([(0,s.MZ)({type:Boolean,reflect:!0})],uh.prototype,"disabled",void 0),dh([(0,s.MZ)({attribute:!1})],uh.prototype,"layerView",void 0),dh([(0,s.MZ)({type:Boolean,reflect:!0,attribute:"onion-skin"})],uh.prototype,"onionSkin",void 0),dh([(0,s.MZ)({type:String})],uh.prototype,"layout",void 0),dh([(0,s.MZ)({type:String})],uh.prototype,"entityColor",void 0),dh([(0,s.MZ)({attribute:!1})],uh.prototype,"studioSelection",void 0),dh([(0,s.wk)()],uh.prototype,"_keys",void 0),dh([(0,s.wk)()],uh.prototype,"_draft",void 0),dh([(0,s.wk)()],uh.prototype,"_band",void 0),dh([(0,s.wk)()],uh.prototype,"_width",void 0),dh([(0,s.wk)()],uh.prototype,"_viewW",void 0),dh([(0,s.wk)()],uh.prototype,"_menuOpen",void 0),dh([(0,s.wk)()],uh.prototype,"_status",void 0),dh([(0,s.wk)()],uh.prototype,"_zoom",void 0),dh([(0,s.wk)()],uh.prototype,"_unit",void 0),dh([(0,s.wk)()],uh.prototype,"_snap",void 0),dh([(0,s.wk)()],uh.prototype,"_grid",void 0),dh([(0,s.wk)()],uh.prototype,"_collapsed",void 0),dh([(0,s.wk)()],uh.prototype,"_lastTarget",void 0),uh=dh([(0,s.EM)("mc-anim-keyframes-editor")],uh);const mh={...ie,...se,...re},gh={"steam-rise":"bottom:-12px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:$c;filter:blur(5px);",bubbles:"bottom:-10px;width:8px;height:8px;margin-left:-4px;border-radius:50%;border:1.5px solid $c;background:color-mix(in srgb,$c 22%,transparent);","bubbles|:nth-child(even)":"width:5px;height:5px;","snow-fall":"top:-8px;width:5px;height:5px;border-radius:50%;background:$c;","rain-fall":"top:-18px;width:2px;height:14px;border-radius:1px;background:linear-gradient(transparent,$c);","liquid-wave":"left:-50%;top:calc(100% - $i * 1%);width:200%;aspect-ratio:1;border-radius:42%;background:color-mix(in srgb,$c 50%,transparent);opacity:1;","liquid-wave|:nth-child(2)":"top:calc(100% - $i * .9%);border-radius:38%;background:$c;animation-direction:reverse;","storm-flash":"inset:0;background:color-mix(in srgb,$c 35%,rgba(255,255,255,.55));","shine-sweep":"top:0;bottom:0;left:0;width:45%;opacity:1;background:linear-gradient(100deg,transparent 0%,color-mix(in srgb,var(--mca-shine-sweep-c,#fff) calc($i * 1%),transparent) 50%,transparent 100%);",...ae,"holographic-shimmer":"left:0;top:0;width:400%;height:100%;opacity:calc($i / 100);background:linear-gradient(115deg,transparent 20%,color-mix(in srgb,$c 55%,#ff80ab) 35%,color-mix(in srgb,$c 55%,#80d8ff) 50%,color-mix(in srgb,$c 55%,#ccff90) 65%,transparent 80%) 0 0 / 50% 100% repeat-x;",scanline:"left:0;top:0;width:100%;height:14%;opacity:calc($i / 100);background:linear-gradient(transparent,color-mix(in srgb,$c 45%,transparent) 70%,$c 96%,transparent);",twinkle:"top:calc(8% + var(--mc-anim-phase) * 80%);width:10px;height:10px;margin:-5px 0 0 -5px;background:$c;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);",spotlight:"left:50%;top:50%;width:70cqmin;aspect-ratio:1;margin:-35cqmin 0 0 -35cqmin;opacity:calc($i / 100);border-radius:50%;background:radial-gradient(circle,$c,transparent 65%);","color-cycle-bg":"left:0;top:0;width:100%;height:100%;opacity:calc($i / 100);background:$c;",aurora:"left:-25%;top:calc(-10% + var(--mc-anim-k) * 40%);width:150%;height:55%;background:radial-gradient(ellipse 30% 50% at 32% 50%,$c,color-mix(in srgb,$c 45%,transparent) 45%,transparent),radial-gradient(ellipse 30% 50% at 62% 50%,color-mix(in srgb,$c 50%,#00e5ff),color-mix(in srgb,color-mix(in srgb,$c 50%,#00e5ff) 45%,transparent) 45%,transparent);","aurora|:nth-child(2)":"animation-duration:calc(var(--mc-fx-dur) * 1.4);animation-direction:reverse;background:radial-gradient(ellipse 30% 50% at 37% 50%,color-mix(in srgb,$c 50%,#76ff03),color-mix(in srgb,color-mix(in srgb,$c 50%,#76ff03) 45%,transparent) 45%,transparent),radial-gradient(ellipse 30% 50% at 68% 50%,$c,color-mix(in srgb,$c 45%,transparent) 45%,transparent);","aurora|:nth-child(3)":"animation-duration:calc(var(--mc-fx-dur) * .8);background:radial-gradient(ellipse 38% 50% at 42% 50%,color-mix(in srgb,$c 50%,#e040fb),color-mix(in srgb,color-mix(in srgb,$c 50%,#e040fb) 45%,transparent) 45%,transparent);","lava-lamp":"bottom:-12%;width:calc(14cqmin + var(--mc-anim-phase) * 16cqmin);aspect-ratio:1;margin-left:-10cqmin;border-radius:50%;background:radial-gradient(circle at 35% 35%,color-mix(in srgb,$c 55%,#fff),$c 70%);filter:blur(2px);","plasma-gradient":"left:50%;top:50%;width:160cqmax;aspect-ratio:1;margin:-80cqmax 0 0 -80cqmax;opacity:calc($i / 100);background:radial-gradient(circle at 30% 30%,$c,color-mix(in srgb,$c 55%,transparent) 22%,color-mix(in srgb,$c 15%,transparent) 38%,transparent 52%),radial-gradient(circle at 70% 40%,color-mix(in srgb,$c 40%,#ff4081),color-mix(in srgb,color-mix(in srgb,$c 40%,#ff4081) 55%,transparent) 22%,color-mix(in srgb,color-mix(in srgb,$c 40%,#ff4081) 15%,transparent) 38%,transparent 52%),radial-gradient(circle at 45% 75%,color-mix(in srgb,$c 40%,#00e5ff),color-mix(in srgb,color-mix(in srgb,$c 40%,#00e5ff) 55%,transparent) 22%,color-mix(in srgb,color-mix(in srgb,$c 40%,#00e5ff) 15%,transparent) 38%,transparent 52%);","gradient-flow":"left:0;top:0;width:300%;height:100%;opacity:calc($i / 100);background:linear-gradient(110deg,$c,color-mix(in srgb,$c 40%,#ff4081),color-mix(in srgb,$c 40%,#00e5ff),$c);",starfield:"top:calc(6% + var(--mc-anim-phase) * 86%);width:3px;height:3px;margin:-1.5px 0 0 -1.5px;border-radius:50%;background:$c;box-shadow:0 0 4px 1px color-mix(in srgb,$c 60%,transparent);","starfield|:nth-child(3n)":"width:2px;height:2px;","meteor-shower":"top:calc(-10% + var(--mc-anim-phase) * 30%);left:calc(30% + var(--mc-anim-x) * .8);width:22%;height:2px;rotate:-45deg;transform-origin:0 50%;border-radius:2px;background:linear-gradient(90deg,$c,transparent);",bokeh:"top:calc(10% + var(--mc-anim-phase) * 75%);width:calc(10cqmin + var(--mc-anim-k) * 18cqmin);aspect-ratio:1;margin:-10cqmin 0 0 -10cqmin;border-radius:50%;filter:blur(1px);background:radial-gradient(circle,color-mix(in srgb,$c 70%,transparent),color-mix(in srgb,$c 25%,transparent) 60%,transparent 72%);","matrix-rain":"top:0;width:2px;height:calc(20% + var(--mc-anim-phase) * 25%);border-radius:1px;background:linear-gradient(transparent,color-mix(in srgb,$c 60%,transparent) 70%,$c);","matrix-rain|:nth-child(odd)":"width:3px;background:repeating-linear-gradient(transparent 0 3px,$c 3px 6px);-webkit-mask:linear-gradient(transparent,#000);mask:linear-gradient(transparent,#000);",smoke:"bottom:-20px;width:26px;height:26px;margin-left:-13px;border-radius:50%;background:color-mix(in srgb,$c 70%,#9e9e9e);filter:blur(8px);","clouds-drift":"left:-40%;top:calc(5% + var(--mc-anim-phase) * 55%);width:38%;aspect-ratio:2.4;filter:blur(1.5px);background:radial-gradient(ellipse 35% 45% at 30% 60%,$c 60%,transparent 62%),radial-gradient(ellipse 30% 55% at 55% 45%,$c 60%,transparent 62%),radial-gradient(ellipse 28% 40% at 75% 62%,$c 60%,transparent 62%);","water-ripple":"top:calc(25% + var(--mc-anim-phase) * 50%);width:60cqmin;aspect-ratio:2.2;margin:-13.6cqmin 0 0 -30cqmin;border:2px solid $c;border-radius:50%;box-sizing:border-box;box-shadow:0 0 0 3px color-mix(in srgb,$c 25%,transparent);",fireworks:"left:50%;top:45%;width:4px;height:4px;margin:-2px 0 0 -2px;border-radius:50%;background:$c;box-shadow:0 0 6px 1px $c;animation-delay:var(--mc-fx-delay,0s);","fireworks|:nth-child(even)":"background:color-mix(in srgb,$c 50%,#ffeb3b);box-shadow:0 0 6px 1px color-mix(in srgb,$c 50%,#ffeb3b);","tap-ripple":"left:var(--mc-tap-x,50%);top:var(--mc-tap-y,50%);width:290cqmax;aspect-ratio:1;margin:-145cqmax 0 0 -145cqmax;border-radius:50%;background:radial-gradient(circle,$c 0,color-mix(in srgb,$c 55%,transparent) 40%,transparent 70%);"},fh={"conic-border-spin":"padding:calc($i * 1px);box-sizing:border-box;background:color-mix(in srgb,$c 18%,transparent);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);"};function vh(e,t,i=!1){const n=te(t),s=`var(--mca-${t}-c, var(--mc-anim-c))`;return e.replace(/\$i/g,`var(--mca-${t}-i, ${n?.defaults.intensity??1})`).replace(/\$c/g,i?`color-mix(in srgb, ${s} calc(var(--mca-${t}-s, 1) * 100%), transparent)`:s)}const bh=n.AH`[data-mc-anim],[data-mc-anim-fx]{--mc-anim-c:var(--mc-anim-color,var(--mc-design-color,var(--primary-color,#03a9f4)))}[data-mc-anim~='module']{animation:var(--mc-anim-m);transform-origin:var(--mc-anim-om,center)} [data-mc-anim~='icon'] .mc-anim-icon{display:inline-block;animation:var(--mc-anim-i);transform-origin:var(--mc-anim-oi,center)} [data-mc-anim~='label'] [data-mc-part='name']{display:inline-block;animation:var(--mc-anim-n);transform-origin:var(--mc-anim-on,center)} [data-mc-anim~='icon']:not(:has(.mc-anim-icon)){animation:var(--mc-anim-mi);transform-origin:var(--mc-anim-om,var(--mc-anim-oi,center))} [data-mc-anim-fx]{position:relative;isolation:isolate}.mc-anim-fx{position:absolute;inset:0;z-index:-1;overflow:hidden;pointer-events:none;border-radius:inherit;container-type:size}.mc-anim-fx[data-front]{z-index:auto}.mc-anim-fx>i{position:absolute;display:block;left:var(--mc-anim-x,50%);opacity:0;will-change:translate,scale,rotate,opacity;animation:var(--mc-fx-anim);animation-delay:calc(var(--mc-fx-delay,0s) - var(--mc-anim-phase,0) * var(--mc-fx-dur,1s))} [data-mc-tap][data-mc-tapped]{animation:var(--mc-anim-m,none),var(--mc-anim-t);transform-origin:var(--mc-anim-om,center)} .mc-anim-fx[data-tap]:not([data-tapped]),.mc-anim-ring[data-tap]:not([data-tapped]){display:none}`,yh=n.AH`@media (prefers-reduced-motion:reduce){[data-mc-anim],[data-mc-anim] .mc-anim-icon,[data-mc-anim~='label'] [data-mc-part='name'],[data-mc-tap],.mc-anim-fx>i{animation:none !important}.mc-anim-fx:not([data-p]),.mc-anim-ring{display:none}}`,xh=(0,n.iz)(bh.cssText+[...Object.entries(mh).map(([e,t])=>`@keyframes mc-anim-${e} {${vh(t,e.replace(/-icon$/,""),!0)}\n}`),...J.filter(e=>void 0!==e.particles).map(e=>`.mc-anim-fx[data-fx="${e.id}"] {\n  opacity: var(--mca-${e.id}-s, 1);\n}`),...Object.entries(fh).map(([e,t])=>`.mc-anim-fx[data-fx="${e}"] {${vh(t,e)}\n}`),...Object.entries(gh).map(([e,t])=>{const[i,n=""]=e.split("|");return`.mc-anim-fx[data-fx="${i}"] > i${n} {${vh(t,i)}\n}`})].join("\n")+yh.cssText),wh=new Set(["off","unavailable","unknown","idle","standby"]),_h=new Set(["alarm_control_panel","alert","automation","binary_sensor","calendar","camera","climate","cover","device_tracker","fan","group","humidifier","input_boolean","lawn_mower","light","lock","media_player","person","plant","remote","schedule","script","siren","sun","switch","timer","update","vacuum","valve","water_heater"]);function kh(e){if(!e)return!1;const t=e.entity_id.split(".")[0],i=e.state;if(wh.has(i))return!1;switch(t){case"alarm_control_panel":return"disarmed"!==i;case"cover":case"valve":return"closed"!==i;case"device_tracker":case"person":return"not_home"!==i;case"lock":return"locked"!==i;case"vacuum":return!["docked","paused","returning"].includes(i);case"lawn_mower":return["mowing","error"].includes(i);case"plant":return"problem"===i;case"timer":return"active"===i;case"camera":return"streaming"===i;case"sun":return"above_horizon"===i;default:return!0}}function $h(e,t){if(!e||!Object.prototype.hasOwnProperty.call(e,t))return;const i=e[t];if(!Array.isArray(i))return;const n=[i[0],i[1],i[2]];return"hs_color"===t&&n.slice(0,2).every(Number.isFinite)?function(e,t){const i=Math.max(0,Math.min(100,t))/100,n=t=>{const n=(t+e/60)%6;return 1-i*Math.max(0,Math.min(n,4-n,1))};return[n(5),n(3),n(1)].map(e=>Math.round(255*e))}((n[0]%360+360)%360,n[1]):n.every(Number.isFinite)?n.map(e=>Math.max(0,Math.min(255,Math.round(e)))):void 0}const Mh=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/;function Sh(e){if("string"!=typeof e)return;const t=e.trim().match(Mh);return t?{opacity:void 0===t[1]?100:Math.min(100,Number(t[1]))}:void 0}function Ch(e){return void 0!==Sh(e)}function Ah(e){const t=Sh(e);if(!t)return;const i="var(--mc-entity-color, currentColor)";return t.opacity>=100?i:`color-mix(in srgb, ${i} ${t.opacity}%, transparent)`}const jh=e=>e.replace(/_/g,"-"),zh={margin:["top","right","bottom","left"].map(e=>({key:`margin_${e}`,cssProperty:`margin-${e}`})),padding:["top","right","bottom","left"].map(e=>({key:`padding_${e}`,cssProperty:`padding-${e}`})),border_radius:["top_left","top_right","bottom_right","bottom_left"].map(e=>({key:`border_${e}_radius`,cssProperty:`border-${e.replace("_","-")}-radius`}))},qh="margin:p padding:p width:p height:p min_width:p min_height:p max_width:p max_height:p box_sizing border border_top border_right border_bottom border_left border_width:p border_style border_color:c border_radius:p outline outline_width:p outline_style outline_color:c outline_offset:p box_shadow position top:p right:p bottom:p left:p inset:p display visibility opacity z_index overflow overflow_x overflow_y float clear cursor pointer_events font_family font_size:p font_weight font_style font_variant color:c text_align text_decoration text_transform text_indent:p text_overflow text_shadow line_height letter_spacing:p word_spacing:p white_space word_break overflow_wrap background background_color:c background_image:i background_position background_size background_repeat background_attachment background_clip background_origin backdrop_filter flex_direction flex_wrap justify_content align_items align_content gap:p row_gap:p column_gap:p flex flex_grow flex_shrink flex_basis:p align_self order grid_template_columns grid_template_rows grid_template_areas grid_auto_columns grid_auto_rows grid_auto_flow grid_column grid_row grid_area transition transition_property transition_duration:s transition_timing_function transition_delay:s transform transform_origin animation_name animation_duration:s animation_timing_function animation_delay:s animation_iteration_count animation_direction animation_fill_mode animation_play_state filter list_style list_style_type list_style_position list_style_image border_collapse border_spacing:p table_layout caption_side".split(" ").map(e=>{const[t,i=""]=e.split(":");return{key:t,flag:i}}),Eh=[...qh.filter(e=>"c"===e.flag).map(e=>e.key),"icon_color","icon_background","label_color","state_color"];new Set(qh.filter(e=>"i"===e.flag).map(e=>e.key)),Object.fromEntries(qh.filter(e=>"p"===e.flag||"s"===e.flag).flatMap(e=>{const t="s"===e.flag?"s":"px";return[[e.key,t],...(zh[e.key]||[]).map(e=>[e.key,t])]}));new Map;const Lh=e=>"string"==typeof e&&""!==e.trim()?e.trim():void 0;function Ph(e){if("number"==typeof e&&Number.isFinite(e)&&e>=0)return+e.toFixed(3)+"s";const t=Lh(e);if(!t)return;const i=t.length<=64?/^(?:\d+(?:\.\d+)?|\.\d+)(m?s)?$/.exec(t):null;return i?i[1]?t:+(+t).toFixed(3)+"s":void 0}const Hh=new Set(["rgb","rgba","hsl","hsla","hwb","lab","lch","oklab","oklch","color","color-mix","var","light-dark","calc","min","max","clamp"]);function Vh(e){const t=Lh(e);if(!t||t.length>256||!/^[#\w\s(),.%+*/-]+$/.test(t)||t.includes("/*")||t.includes("*/"))return;let i=0;for(const e of t)if("("===e)i++;else if(")"===e&&--i<0)return;if(0!==i)return;const n=t.match(/\(/g)?.length??0,s=[...t.matchAll(/([a-z-]+)\s*\(/gi)];return s.length!==n||s.some(e=>!Hh.has(e[1].toLowerCase()))?void 0:t}const Dh=/^(\d+(?:\.\d+)?|\.\d+)(%)?$/;new Map([["blur",/^(\d+(?:\.\d+)?|\.\d+)(px|em|rem)?$/],["hue-rotate",/^(-?(?:\d+(?:\.\d+)?|\.\d+))(deg|grad|rad|turn)$/],...["brightness","contrast","grayscale","invert","opacity","saturate","sepia"].map(e=>[e,Dh])]),new Map,new Map,new Map([["left",["2/1/4/2",3]],["right",["2/4/4/5",2]],["above",["1/2/2/4",1]],["below",["4/2/5/4",0]]]),new Set(["start","center","end"]),function(){const e={};for(const{key:t}of qh){e[t]=jh(t);for(const i of zh[t]||[])e[i.key]=i.cssProperty}}();const Th=/(?<![\w-])entity(?: \d+(?:\.\d+)?%)?(?![\w-])/g;function Oh(e){const t="string"==typeof e&&e.length<=256?e.replace(Th,e=>Ah(e)??e):e;return t===e?void 0:t}function Rh(e,t,i){const n=Lh(e.trigger_entity);switch(n&&(t=i?.[n]),e.trigger){case"entity_on":return kh(t);case"state":{const i=(e.state||"").trim();return!!i&&!!t&&t.state===i}default:return!0}}new Set(["border","border_top","border_right","border_bottom","border_left","border_width","border_style","border_color","box_shadow"]),new Set(["none","hidden","solid","dashed","dotted","double","groove","ridge","inset","outset"]);const Nh={snowy:"snow","snowy-rainy":"snow",rainy:"rain",pouring:"rain",hail:"rain",lightning:"storm","lightning-rainy":"storm",sunny:"sun","clear-night":"night",cloudy:"clouds",partlycloudy:"clouds",fog:"fog",windy:"wind","windy-variant":"wind"};const Fh=new Map;const Bh=new Set;function Ih(e,t,i){t&&i&&Fh.get(e)?.name!==t&&(Fh.set(e,{name:t,css:i}),function(){const e=[...Fh.values()].map(e=>e.css).join("\n");for(const t of Bh)t.isConnected?t.textContent=e:Bh.delete(t)}())}const Zh=new Map,Kh={slow:1.6,normal:1,fast:.6},Wh=["normal","reverse","alternate","alternate-reverse"],Uh=e=>e.endsWith("ms")?parseFloat(e)/1e3:parseFloat(e);function Gh(e){const t=Lh(e);if(!t)return;const i=B.find(e=>e.id===t);return i?i.css:/^cubic-bezier\(\s*-?[\d.]+\s*(,\s*-?[\d.]+\s*){3}\)$/.test(t)||/^steps\(\s*\d+\s*(,\s*(start|end|jump-start|jump-end|jump-none|jump-both)\s*)?\)$/.test(t)?t:void 0}function Yh(e){if("infinite"===e)return"infinite";const t="string"==typeof e?Number(e):e;return"number"==typeof t&&Number.isFinite(t)&&t>0?String(+t.toFixed(2)):void 0}function Jh(e,t){const i="string"==typeof t?Number(t):t;return"number"==typeof i&&Number.isFinite(i)?Math.min(e.intensity.max,Math.max(e.intensity.min,i)):e.defaults.intensity}function Xh(e){const t="string"==typeof e&&""!==e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?Math.min(100,Math.max(0,t)):void 0}const Qh=(e,t)=>t&&"icon"===e.target,eu=(e,t)=>t&&"label"===e.target;function tu(e,t,i,n){if("weather"===e.seasonal){const e=Lh(t.trigger_entity),a=e?.startsWith("weather.")?n?.[e]:i;return a?.entity_id?.startsWith("weather.")&&(s=a.state)?Nh[s]:void 0}var s;if("daynight"===e.seasonal){const e=n?.["sun.sun"],t=e?.attributes?.elevation;return function(e,t){if("below_horizon"===e||"above_horizon"===e)return"number"==typeof t&&Number.isFinite(t)&&Math.abs(t)<=6?"dusk":"below_horizon"===e?"night":void 0}(e?.state,"number"==typeof t?t:"string"==typeof t&&""!==t.trim()?Number(t):void 0)}return e.seasonal}const iu=.618034;function nu(e){return Array.from({length:e},(t,i)=>{const n=60/e*(i*iu%1-.5);return{x:+Math.min(96,Math.max(4,(i+.5)/e*100+n)).toFixed(1),phase:+(i*iu%1).toFixed(3),k:e>1?+(i/e).toFixed(3):0}})}function su(e,t,i={}){e=function(e){if(!e)return e;const t=e;let i;for(const e of Eh){const n=Oh(t[e]);n&&((i??={...t})[e]=n)}return Array.isArray(t.animations)&&t.animations.some(e=>Ch(e?.color))&&((i??={...t}).animations=t.animations.map(e=>Ch(e?.color)?{...e,color:Ah(e.color)}:e)),i??e}(e);const n=!1!==i.allowIcon,s={m:[],i:[],mi:[],t:[],n:[]},a=[],r={},o=[],l=[],c=[],d={need:!1,p:!1};for(let p of function(e){if(!e)return[];if(Array.isArray(e.animations))return e.animations.filter(e=>!!e&&"object"==typeof e&&!!Lh(e.preset)).map((e,t)=>Lh(e.id)?e:{...e,id:`anim-${t}`});const t=Lh(e.animation_preset);if(!t)return[];const i=te(t),n={id:"legacy",preset:t};if(e.animation_target&&(n.target=e.animation_target),e.animation_trigger&&(n.trigger=e.animation_trigger),e.animation_state&&(n.state=e.animation_state),e.animation_color&&(n.color=e.animation_color),!i)return[n];const s=function(e){if(e.seasonal)return{intensity:e.defaults.intensity};const{duration:t,delay:i,easing:n,iterations:s,direction:a,intensity:r}=e.defaults;return{duration:t,delay:i,easing:n,iterations:s,direction:a,intensity:r,...F(e)?{strength:100}:{}}}(i),a=Kh[e.animation_speed||"normal"]??1;return[{...n,...s,duration:+(Uh(s.duration)*a).toFixed(3)+"s"}]}(e)){if(Ke(p.preset)){const e=i.custom?.(We(p.preset));if(!e||!Rh(p,t,i.states))continue;const h=au(e,p,{lists:s,vars:a,origins:r,fx:o,seq:l,v2:c,allowIcon:n,runtime:d,custom:i.custom,stateObj:t,states:i.states});if(!h)continue;p=h}const e=te(p.preset);if(!e||!Rh(p,t,i.states))continue;const h=e.defaults,u=Ph(p.duration)??h.duration,m=Ph(p.delay)??h.delay,g="tap"===p.trigger;let f=Yh(p.iterations)??Yh(h.iterations);g&&"infinite"===f&&(f="1");const v=`${Gh(p.easing)??Gh(h.easing)} ${m} ${f} ${Wh.includes(p.direction)?p.direction:h.direction}`,b=`${u} ${v}`,y=[`--mca-${e.id}-i: ${Jh(e,p.intensity)}`],x=Vh(p.color);x&&y.push(`--mca-${e.id}-c: ${x}`);const w=F(e)?Xh(p.strength):void 0;if(void 0!==w&&100!==w&&y.push(`--mca-${e.id}-s: ${+(w/100).toFixed(3)}`),e.seasonal){const n=tu(e,p,t,i.states);if(!n)continue;o.push({preset:e.id,front:!1,style:void 0!==w&&100!==w?"opacity: "+ +(w/100).toFixed(3):"",particles:[],seasonal:{scenes:[n],intensity:Jh(e,p.intensity)/100,decorations:!1!==p.decorations}});continue}if(e.ring){o.push({preset:e.id,front:!0,style:y.join("; "),particles:[],...g?{tap:g}:{},ring:ru(e,p,u,v,w)});continue}if(void 0!==e.particles){const t="count"===e.particles?Math.min(12,Math.round(Jh(e,p.intensity))):e.particles;o.push({preset:e.id,front:!!e.front,style:[`--mc-fx-anim: mc-anim-${e.id} ${b}`,`--mc-fx-dur: ${u}`,`--mc-fx-delay: ${m}`,...y].join("; "),particles:nu(Math.max(1,t)),...g?{tap:g}:{}});continue}if(a.push(...y),g){s.t.push(`mc-anim-${e.id} ${b}`),e.origin&&!r.m&&(r.m=e.origin);continue}if(eu(p,n)){s.n.push(`mc-anim-${e.id} ${b}`),e.origin&&!r.n&&(r.n=e.origin);continue}const _=Qh(p,n);s.mi.push(`mc-anim-${e.id} ${b}`),_?(s.i.push(`mc-anim-${e.id}${e.iconKeyframes?"-icon":""} ${b}`),e.origin&&!r.i&&(r.i=e.origin)):(s.m.push(`mc-anim-${e.id} ${b}`),e.origin&&!r.m&&(r.m=e.origin))}if(!(s.mi.length||s.n.length||s.t.length||o.length||l.length||d.need))return;const p=[];s.m.length&&p.push(`--mc-anim-m: ${s.m.join(", ")}`),s.t.length&&p.push(`--mc-anim-t: ${s.t.join(", ")}`),s.i.length&&p.push(`--mc-anim-i: ${s.i.join(", ")}`,`--mc-anim-mi: ${s.mi.join(", ")}`),s.n.length&&p.push(`--mc-anim-n: ${s.n.join(", ")}`),r.m&&p.push(`--mc-anim-om: ${r.m}`),r.i&&p.push(`--mc-anim-oi: ${r.i}`),r.n&&p.push(`--mc-anim-on: ${r.n}`),p.push(...function(e){const t=new Map;for(const i of e){const e=i.slice(0,i.indexOf(":"));t.delete(e),t.set(e,i)}return[...t.values()]}(a));const h=Vh(e?.color)??Vh(function(e){if(!e)return;const t=e.entity_id.split(".")[0];if(!_h.has(t))return;if(!kh(e))return`var(--state-${t}-inactive-color, var(--state-inactive-color, var(--disabled-text-color)))`;const i=function(e){const t=$h(e,"rgb_color")||$h(e,"hs_color");return t?`rgb(${t.join(", ")})`:void 0}(e.attributes||{});return i||`var(--state-${t}-${e.state.replace(/[^a-z0-9_-]/gi,"_")}-color, var(--state-${t}-active-color, var(--state-active-color, var(--primary-color))))`}(t));h&&p.push(`--mc-anim-color: ${h}`);const u=[s.m.length?"module":"",s.i.length?"icon":"",s.n.length?"label":""].filter(Boolean).join(" ");return{...u?{targets:u}:{},style:p.join("; "),fx:o,...s.t.length?{tap:!0}:{},...l.length?{seq:l.join(" ")}:{},...d.need?{needsRuntime:!0}:{},...d.p?{needsParticles:!0}:{},...c.length?{v2:c,run:[...new Set(c.map(e=>e.run))].join(" ")}:{}}}function au(e,t,i){const n=Tn(e,{lookup:i.custom}),s=Yh(e.iterations)??"infinite",a="tap"===t.trigger,r=Ph(t.duration)??`${e.duration}s`,o=Ph(t.delay)??"0s";let l=Yh(t.iterations)??s;a&&"infinite"===l&&(l="1");const c=Wh.includes(t.direction)?t.direction:e.direction??"normal",d=`${Gh(t.easing)??Gh(e.easing)??"ease"} ${o} ${l} ${c}`,p=eu(t,i.allowIcon),h=i.allowIcon&&("icon"===t.target||!t.target&&"icon"===n.motion?.target);let u;if(Be(e)&&(i.runtime.need=!0,n.v2)){const s="string"==typeof t.entity&&t.entity?t.entity:void 0,a=s?i.states?.[s]:i.stateObj,o=s??i.stateObj?.entity_id,l=n.name||un(e),c={};u=c.clip?.animation,i.v2.push({run:l,docId:e.id,v2:u?{...n.v2,tracks:[]}:n.v2,timing:`${r} ${d}`,icon:h,...o?{entityId:o}:{},...a?{stateObj:a}:{},hints:c})}if(u){if("none"===u)return;const n={...t,preset:u,target:h?"icon":t.target};for(const e of["duration","delay","easing","iterations","direction"])delete n[e];if(!Ke(u))return n;const s=i.custom?.(We(u));return s&&s!==e?au(s,n,i):void 0}if(n.preset)return{...t,preset:n.preset.id,intensity:t.intensity??n.preset.intensity,duration:t.duration??`${e.duration}s`,easing:t.easing??e.easing,iterations:t.iterations??("infinite"===s?"infinite":Number(s)),direction:t.direction??e.direction};if(n.schedule){const e=n.schedule,s=Ph(t.duration),a=s&&e.total>0?Uh(s)/e.total:1,r="number"==typeof t.iterations&&t.iterations>0?Math.round(t.iterations):void 0;return void(e.steps.length&&i.seq.push(function(e){const t=`s${hn(JSON.stringify(e))}`;return Zh.set(t,e),Zh.size>64&&Zh.delete(Zh.keys().next().value),t}({...e,delay:Uh(o),scale:a,...r?{cycles:r}:{},...p?{target:"label"}:{}})))}const m=[],g="number"==typeof t.intensity&&Number.isFinite(t.intensity)?t.intensity:void 0;void 0!==g&&100!==g&&m.push(`${mn(e.id,"i")}: ${+(g/100).toFixed(3)}`);const f=Vh(t.color);f&&m.push(`${mn(e.id,"c")}: ${f}`);const v=Xh(t.strength);if(void 0!==v&&100!==v&&m.push(`${mn(e.id,"s")}: ${+(v/100).toFixed(3)}`),Ih(e.id,n.name,n.css),n.layer){(n.sim||n.needsParticles)&&(i.runtime.p=!0);const e=+(Uh(r)/n.layer.speed).toFixed(3)+"s";for(const[t,s,r]of[[n.name,n.layer,n.sim],...n.split?[[n.split.name,n.split.layer,n.split.sim]]:[]])i.fx.push({preset:t,front:s.front,style:[`--mc-fx-anim: ${t} ${e} ${d}`,`--mc-fx-dur: ${e}`,`--mc-fx-delay: ${o}`,...m].join("; "),particles:s.particles,...s.symbol?{symbol:s.symbol}:{},sim:r,...a?{tap:a}:{}});return}if(!n.motion)return;const b=[n.name,...n.lanes??[]].map(e=>`${e} ${r} ${d}`).join(", "),y="center"!==n.motion.origin?n.motion.origin:void 0;return i.vars.push(...m),a?(i.lists.t.push(b),void(y&&!i.origins.m&&(i.origins.m=y))):p?(i.lists.n.push(b),void(y&&!i.origins.n&&(i.origins.n=y))):(i.lists.mi.push(b),void(h?(i.lists.i.push(b),y&&!i.origins.i&&(i.origins.i=y)):(i.lists.m.push(b),y&&!i.origins.m&&(i.origins.m=y))))}function ru(e,t,i,n,s){return{mode:"animated",fill:1,animation:e.ring,color:Vh(t.color)??"var(--mc-anim-c)",width:Jh(e,t.intensity),linecap:"dashes"===e.ring?"butt":"round",glow:0,position:"inside",start:"top",direction:"cw",length:25,speed:i,transition:"1s",timing:n,...void 0!==s&&100!==s?{opacity:+(s/100).toFixed(3)}:{}}}const ou=["❤️","💖","⭐","✨","❄️","💧","🔥","🍂","🌸","🎉","🎈","🫧","☁️","⚡","🌙","🦋"],lu={icon:{icon:"mdi:star"},emoji:{emoji:"✨"},svg:{svg:'<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>'}},cu=/^[a-z0-9_-]+:[a-z0-9_-]+$/i;function du(e){const t=e.trim();return t?[...t].length>8?Zn(1086):/[<>&"'\\{};]/.test(t)?"These characters are not allowed: < > & \" ' \\ { } ;":void 0:Zn(316)}function pu(e){if(!e.trim())return Zn(664);if(!/<svg[\s>]/i.test(e))return Zn(567);const t=Ne(e);return t.error?as(t.error):t.paths.length||t.strokes.length||t.accentPaths.length?void 0:Zn(946)}const hu=Ah("entity"),uu=/^color-mix\(in srgb, var\(--mc-entity-color, currentColor\) (\d+(?:\.\d+)?)%, transparent\)$/;function mu(e){const t=e.trim();if(t)return Sh(t)?Ah(t):st(t,"color")}function gu(e){if(e===hu)return"entity";const t=uu.exec(e);return t?`entity ${t[1]}%`:e}const fu=(e,t,i)=>Math.min(i,Math.max(t,e)),vu=(e,t)=>+(Math.round(e/t)*t).toFixed(4),bu={count:{min:1,max:Je,step:1},speed:{min:.1,max:10,step:.1},size:{min:1,max:200,step:1},spin:{min:-3600,max:3600,step:15},spread:{min:0,max:100,step:5},gravity:{min:-1,max:1,step:.1}};function yu(e,t){const i="number"==typeof t?t:"string"==typeof t&&""!==t.trim()?parseFloat(t):NaN;if(!Number.isFinite(i))return;const n=bu[e],s=fu(i,n.min,n.max);return"count"===e?Math.round(s):"gravity"===e||"speed"===e?vu(s,.01):+s.toFixed(2)}function xu(e,t){const i={...e.particles??tt,...t};for(const e of Object.keys(i))void 0===i[e]&&delete i[e];return{...e,particles:i}}const wu=e=>e.particles?.preset?te(e.particles.preset):void 0;function _u(e){return e.ring?Zn(769):e.seasonal?Zn(800):"count"===e.particles?Zn(651):Zn(794)}const ku={"snow-fall":{direction:"fall",size:[4,8],colors:["#ffffff"],spin:0},"rain-fall":{direction:"fall",size:[2,4],speed:2,colors:["#90caf9"],gravity:.6,fade:!1},bubbles:{direction:"rise",size:[6,14],colors:[]},"steam-rise":{direction:"rise",size:[10,18],spread:60},confetti:{direction:"fall",size:[5,9],spin:360,colors:["#ef4444","#eab308","#22c55e","#3b82f6","#ec4899"]},"falling-leaves":{direction:"fall",shape:{icon:"mdi:leaf"},size:[10,16],spin:180,colors:["#f97316","#eab308","#a16207"]},fireflies:{direction:"drift",size:[3,6],colors:["#fde047"]},twinkle:{direction:"drift",shape:{emoji:"✨"},size:[8,14],layer:"front",speed:.5},"orbit-dots":{direction:"orbit",size:[6,8],spread:70,fade:!1},starfield:{direction:"fall",size:[2,4],colors:["#ffffff"],speed:1.5},"meteor-shower":{direction:"fall",size:[3,5],gravity:.6,colors:["#ffffff"]},bokeh:{direction:"drift",size:[16,32],speed:.4},smoke:{direction:"rise",size:[16,28],spread:70,speed:.6},"clouds-drift":{direction:"drift",shape:{icon:"mdi:cloud"},size:[24,40],colors:["#ffffff"],speed:.3},fireworks:{direction:"burst",size:[4,6],spread:80,colors:["#ef4444","#eab308","#3b82f6"]},"ripple-rings":{direction:"burst",size:[8,12],spread:90},"water-ripple":{direction:"burst",size:[8,12],spread:90},"wind-lines":{direction:"drift",size:[3,5],speed:1.5},drip:{direction:"fall",size:[4,7],gravity:.8,colors:["#4fc3f7"]}},$u=["fall","rise","drift","burst","orbit","spiral","fountain","explode","wave","vortex","zigzag","rain","wander"],Mu={fall:335,rise:770,drift:285,burst:125,orbit:633,spiral:877,fountain:359,explode:327,wave:1099,vortex:936,zigzag:1110,rain:721,wander:344},Su=new Set(Ge),Cu=new Set(["burst","orbit","spiral","explode","vortex"]),Au=[{id:"circle",label:160},{id:"square",label:891},{id:"triangle",label:1044},{id:"star",label:896},{id:"heart",label:381},{id:"ring",label:768},{id:"line",label:930},{id:"spark",label:869},{id:"icon",label:391,icon:"mdi:star-outline"},{id:"emoji",label:310,icon:"mdi:emoticon-outline"},{id:"svg",label:"SVG",icon:"mdi:svg"}],ju=new Set(vo),zu=e=>ju.has(e),qu=e=>"builtin"in e?e.builtin:(e=>e?"icon"in e?"icon":"emoji"in e?"emoji":"svg":"dot")(e),Eu=e=>{const t=Au.find(t=>t.id===qu(e));return Zn(t?t.label:830)},Lu=Math.min(4,bo.shapes),Pu=200,Hu={pspeed:{min:0,max:500,step:5},spin:{min:-3600,max:3600,step:15},delay:{min:0,max:60,step:.1},lifetime:{min:.1,max:60,step:.1},opacity:{min:0,max:100,step:5},seed:{min:0,max:4294967295,step:1},weight:{min:1,max:10,step:1},childCount:{min:1,max:bo.childrenPerParent,step:1},childSize:{min:1,max:200,step:1},childLife:{min:.1,max:10,step:.1},angle:{min:0,max:359,step:1},wind:{min:-60,max:60,step:5},unit:{min:0,max:1,step:.05}},Vu=new Set(["seed","weight","childCount","childSize","angle","opacity","spin","wind"]);function Du(e,t){let i="number"==typeof t?t:"string"==typeof t&&""!==t.trim()?parseFloat(t):NaN;if(!Number.isFinite(i))return;"angle"===e&&(i=(Math.round(i)%360+360)%360);const n=Hu[e],s=fu(i,n.min,n.max);return Vu.has(e)?Math.round(s):vu(s,.01)}const Tu=e=>e[0]>e[1]?[e[1],e[0]]:[e[0],e[1]],Ou=e=>e.duration/(e.particles?.speed||1);function Ru(e,t=Math.random){for(let i=0;i<8;i++){const i=Math.floor(4294967296*t())>>>0;if(i!==e)return i}return(e??0)+1>>>0}const Nu=e=>+e.toFixed(2);function Fu(e,t){const i=e.particles??tt,n=Ou(e),s=Nu((Cu.has(i.direction)?Math.max(10,i.spread):100)/n),a=Nu(i.spin/n);return{engine:1,mode:"baked",seed:t>>>0,flow:i.direction,shapes:i.shape?[{shape:i.shape,weight:1}]:[],ranges:{speed:[s,s],spin:[a,a],delay:[0,Nu(n)],lifetime:[Nu(n),Nu(n)],opacity:[1,1]},physics:{gravity:{angle:i.gravity<0?180:0,strength:Nu(Math.abs(i.gravity)*Pu)},drag:0,turbulence:{strength:0,scale:25},bounce:.5},colliders:{floor:!1,ceiling:!1,left:!1,right:!1,content:"none"}}}const Bu=(e,t)=>e.particles?.sim??Fu(e,t),Iu=e=>!!e.particles?.sim;function Zu(e){const t=e.strength/Pu*Math.cos(e.angle*Math.PI/180);return fu(Math.round(100*t)/100,-1,1)||0}function Ku(e,t){const i=t.shapes.find(e=>!("builtin"in e.shape))?.shape,n=fu(Math.round(t.ranges.spin[1]*Ou(e)),bu.spin.min,bu.spin.max),s=xu(e,{sim:t,direction:fo[t.flow],gravity:Zu(t.physics.gravity),spin:n});return i?s.particles.shape=i:delete s.particles.shape,s}const Wu=(e,t,i)=>Ku(e,i(Bu(e,t)));const Uu=e=>e.shapes.length?e.shapes:[{shape:{builtin:"circle"},weight:1}];function Gu(e,t){if(!Iu(e)){const t=e.particles?.spin??0;return[t,t]}const i=Ou(e);return[Math.round(t.ranges.spin[0]*i),Math.round(t.ranges.spin[1]*i)]}function Yu(e,t,i,n){const s=Nu(fu(n,0,1));return!Iu(e)&&(0===i||180===i&&s>0)?xu(e,{gravity:180===i?-s:s}):Wu(e,t,e=>({...e,physics:{...e.physics,gravity:{angle:i,strength:Nu(s*Pu)}}}))}const Ju=(e,t,i)=>Wu(e,t,e=>({...e,seed:Ru(e.seed,i)}));function Xu(e,t){const i=e.reduce((e,t)=>e+t.weight,0);return i>0?5*Math.round((e[t]?.weight??0)/i*20):0}function Qu(e){const t=new Set(e.map(e=>qu(e.shape)));return{builtin:["star","heart","circle","spark","square","triangle","ring","line"].find(e=>!t.has(e))??"circle"}}const em=e=>e.floor||e.ceiling||e.left||e.right||"none"!==e.content;function tm(e){return{trigger:em(e.colliders)?"collision":"death",count:6,shapes:[{shape:{builtin:"spark"},weight:1}],size:[2,4],colors:[],ranges:{speed:[30,60],lifetime:[.6,.6],opacity:[1,1],spin:[0,0]},cone:360,inherit:.2}}const im=[{angle:0,name:1127,icon:"mdi:arrow-down"},{angle:45,name:1128,icon:"mdi:arrow-bottom-left"},{angle:90,name:1143,icon:"mdi:arrow-left"},{angle:135,name:1175,icon:"mdi:arrow-top-left"},{angle:180,name:1174,icon:"mdi:arrow-up"},{angle:225,name:1176,icon:"mdi:arrow-top-right"},{angle:270,name:1157,icon:"mdi:arrow-right"},{angle:315,name:1129,icon:"mdi:arrow-bottom-right"}],nm=e=>{const t=im.find(t=>t.angle===e);return t?Zn(t.name):Zn(1121,{angle:e})},sm=e=>String(+e.toFixed(2)),am=(e,t="")=>e[0]===e[1]?`${sm(e[0])}${t}`:Zn(1202,{from:sm(e[0]),to:sm(e[1]),unit:t}),rm=[{id:"floor",label:352},{id:"ceiling",label:140},{id:"left",label:434},{id:"right",label:767},{id:"content",label:193}],om=(e,t)=>"content"===t?"none"!==e.content:e[t];let lm;const cm=()=>lm;function dm(e,t=0){const i="particles"===e.kind?e.particles:void 0;if(i&&!i.preset)return{...i,sim:i.sim??Fu(e,t)}}const pm=e=>1+(e.particles?.sim?.emitters?.length??0);function hm(e){return(e.particles?.count??tt.count)+(e.particles?.sim?.emitters??[]).reduce((e,t)=>e+t.count,0)}const um=e=>Math.max(0,bo.parents-hm(e)),mm=e=>pm(e)<bo.emitters&&um(e)>=1,gm=(e,t)=>e.layer??t;function fm(e,t){const i=e.particles??tt,n=Bu(e,t);return[{id:n.id??"",...void 0!==n.name?{name:n.name}:{},layer:i.layer,seed:n.seed,count:i.count,size:[i.size[0],i.size[1]],colors:[...i.colors],fade:i.fade,spread:i.spread,flow:n.flow,shapes:n.shapes,ranges:n.ranges,physics:n.physics,...n.children?{children:n.children}:{}},...(n.emitters??[]).map(e=>({...e,layer:gm(e,i.layer)}))]}function vm(e,t,i){const n=Bu(e,t),[s,...a]=i,r={...n,seed:s.seed,flow:s.flow,shapes:s.shapes,ranges:s.ranges,physics:s.physics};if(s.children?r.children=s.children:delete r.children,delete r.id,delete r.name,delete r.emitters,i.length>1){const e=new Set,t=i.map(t=>t.id&&!e.has(t.id)?(e.add(t.id),t.id):"").map(t=>{if(t)return t;let i=1;for(;e.has(`e${i}`);)i++;return e.add(`e${i}`),`e${i}`});r.id=t[0],s.name&&(r.name=s.name),r.emitters=a.map((e,i)=>{const{layer:n,name:a,...r}=e;return{...r,id:t[i+1],...a?{name:a}:{},...n!==s.layer?{layer:n}:{}}})}return Ku(xu(e,{count:s.count,size:s.size,colors:s.colors,fade:s.fade,spread:s.spread,layer:s.layer}),r)}const bm=(e,t)=>Number.isInteger(t)&&t>=0&&t<pm(e);function ym(e,t,i,n){if(!bm(e,i)||pm(e)<2)return e;const s=(e=>e.trim().slice(0,40).trim())(n),a=e.particles.sim;if((0===i?a.name:a.emitters[i-1].name)===(s||void 0))return e;const r=fm(e,t);return s?r[i].name=s:delete r[i].name,vm(e,t,r)}function xm(e,t){const i=e.particles??tt;return t<=0?i.layer:gm(i.sim?.emitters?.[t-1]??{},i.layer)}function wm(e,t,i){if(i<=0||i>=pm(e))return e;const n=fm(e,t)[i],s={...Bu(e,t),seed:n.seed,flow:n.flow,shapes:n.shapes,ranges:n.ranges,physics:n.physics};return delete s.id,delete s.name,delete s.emitters,delete s.children,n.children&&(s.children=n.children),Ku(xu(e,{count:n.count,size:n.size,colors:n.colors,fade:n.fade,spread:n.spread,layer:n.layer}),s)}function _m(e,t,i,n){const s=wm(e,t,i);if(s===e)return n(e);const a=n(s);if(a===s)return e;const r=a.particles,o=r.sim,l=e.particles.sim,c=l.emitters.map((t,n)=>{if(n!==i-1)return t;const s={...t};return delete s.children,{...s,seed:o.seed,flow:o.flow,shapes:o.shapes,ranges:o.ranges,physics:o.physics,count:Math.max(1,Math.min(r.count,t.count+um(e))),size:r.size,colors:r.colors,fade:r.fade,spread:r.spread,...o.children?{children:o.children}:{}}});return xu(e,{speed:r.speed,sim:{...l,mode:o.mode,colliders:o.colliders,emitters:c}})}function km(e,t,i){const n=fm(e,t),s=n[i];if(s?.name)return s.name;if(n.length<2)return Zn(653);const a=/^e(\d+)$/.exec(s?.id??""),r=a?Number(a[1]):i+1;return r>1?Zn(659,{n:r}):Zn(653)}class $m extends z.WL{constructor(e){if(super(e),this.it=j.s6,e.type!==z.OA.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===j.s6||null==e)return this._t=void 0,this.it=e;if(e===j.c0)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}$m.directiveName="unsafeHTML",$m.resultType=1,(0,z.u$)($m);class Mm extends $m{}Mm.directiveName="unsafeSVG",Mm.resultType=2;const Sm=(0,z.u$)(Mm),Cm=Object.freeze({kind:"svg",extensions:Object.freeze([".svg"]),mimeTypes:Object.freeze(["image/svg+xml"])}),Am=Object.freeze({types:Object.freeze([Object.freeze({...Cm,maxBytes:32768})])});Object.freeze({types:Object.freeze([Object.freeze({...Cm,maxBytes:8388608})])});const jm=1048576,zm=["path","circle","ellipse","rect","line","polyline","polygon"],qm=/^(none|transparent)$/i,Em=/^(currentcolor|inherit|black|#0{3}|#0{6})$/i,Lm=e=>Object.is(e,-0)?"-0":String(e);const Pm=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Hm=/^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/+-]*\))$/i,Vm=/^(butt|round|square)$/,Dm=/^(miter|round|bevel|arcs|miter-clip)$/;function Tm(e){if(!e)return;const t=e.trim();return/^entity\b/i.test(t)||/var\(/i.test(t)||/^currentcolor$/i.test(t)?"currentColor":Hm.test(t)?t:"currentColor"}function Om(e){const t=Ar(e)?Tm(e.fill)??"currentColor":"none";let i=` id="${Pm(e.id)}" class="shape" d="${Pm(e.d)}" fill="${Pm(t)}"`;return jr(e)&&(i+=` stroke="${Pm(Tm(e.stroke)??"currentColor")}" stroke-width="${e.stroke_width??1}"`,e.linecap&&(i+=` stroke-linecap="${e.linecap}"`),i+=' stroke-linejoin="round"'),`<path${i}/>`}function Rm(e,t){const i=Ne(/^\s*<svg[\s>]/i.test(e)?e:`<svg viewBox="${t}">${e}</svg>`);return i.error?"":i.markup.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,"")}function Nm(e){const t=e.accent?"mc-accent":"";if(!e.stroke)return e.evenodd?{cls:t,attrs:' fill="currentColor" fill-rule="evenodd"',key:`e${t}`}:{cls:t,attrs:' fill="currentColor"',key:`f${t}`};let i=` fill="none" stroke="currentColor" stroke-width="${+e.stroke.width.toFixed(3)}"`;return e.stroke.cap&&Vm.test(e.stroke.cap)&&(i+=` stroke-linecap="${e.stroke.cap}"`),e.stroke.join&&Dm.test(e.stroke.join)&&(i+=` stroke-linejoin="${e.stroke.join}"`),{cls:t,attrs:i,key:`s${t}${i}`}}function Fm(e,t,i){const n=new Map;for(const t of e){const e=Nm(t),i=n.get(e.key)??{paint:e,d:[]};i.d.push(t.d),n.set(e.key,i)}const s=t?` id="${Pm(t)}"`:"",a=[...n.values()],r=(e,t)=>{const n=[t?i:"",e.paint.cls].filter(Boolean).join(" ");return`<path${t?s:""}${n?` class="${n}"`:""} d="${Pm(e.d.join(" "))}"${e.paint.attrs}/>`};return 1===a.length?r(a[0],!0):`<g${s} class="${i}">${a.map(e=>r(e,!1)).join("")}</g>`}const Bm={not_svg:"No <svg> element found.",empty:"The SVG has no shapes to draw.",too_detailed:"A shape in the SVG is too detailed (over 8192 characters of path data).",too_many:"The SVG has too many shapes; at most {room} fit."};function Im(e){const t=$r(e);return!t||function(e){let t=0;for(const i of kr(e)){let e=0;for(let t=0,n=i.length-1;t<i.length;n=t++)e+=(i[n][0]+i[t][0])*(i[n][1]-i[t][1]);t+=Math.abs(e)/2}return t}(e)<.001*Math.max(t.w,t.h)}function Zm(e){if(void 0===e)return;const t=e.trim();return/^(none|transparent)$/i.test(t)?"none":st(t,"color")&&!/url\(/i.test(t)?t:"currentColor"}function Km(e){return e?.svg?Mr(Ne(e.svg).viewBox).join(" "):"0 0 24 24"}var Wm=i(9489);function Um(e){const t=/^(part|group|shape):([a-z0-9][a-z0-9_-]{0,31})$/.exec(e);if(t)return`[data-${"part"===t[1]?"p":"group"===t[1]?"g":"s"}="${t[2]}"]`}const Gm=e=>e.css.includes("stroke-dashoffset");function Ym(e){const t=new Map;for(const i of e.css.matchAll(/(-?[\d.]+)% \{([^}]*)\}/g)){const e=/stroke-dashoffset: (-?[\d.]+)/.exec(i[2]);e&&t.set(Number(i[1]),Number(e[1])<=.001?1:0)}const i=[...t].sort((e,t)=>e[0]-t[0]),n=[];return i.forEach(([e,t],s)=>{const a=i[s-1];a&&a[1]!==t&&n.push([+(a[0]+(e-a[0])*(t?.75:.25)).toFixed(2),0]),n.push([e,t])}),n}function Jm(e){const t=Ym(e);if(!t.length)return"";const i=t.map(([e,t])=>`  ${e}% { fill-opacity: ${t}; }`);return`@keyframes ${e.name}-fill {\n${i.join("\n")}\n}`}function Xm(e){const t=Ym(e);if(!t.length)return"";const i=t.map(([e,t])=>`  ${e}% { stroke-opacity: ${1-t}; }`);return`@keyframes ${e.name}-outline {\n${i.join("\n")}\n}`}const Qm=[".rig { color: var(--mc-rig-paint, var(--icon-primary-color, currentColor)); }",".rig .primary { fill: var(--mc-rig-fill, currentColor); }",".rig .outlines { stroke-opacity: 0; }",".rig [data-p], .rig [data-g], .rig [data-s] { transform-box: view-box; }",".rig .drawn { stroke-dasharray: 1; stroke-linecap: round; stroke-linejoin: round; }",".rig .outlines .drawn { stroke-linecap: butt; stroke-dasharray: 0.999 2; }","@media (prefers-reduced-motion: reduce) { .rig, .rig * { animation: none !important; } }"].join("\n");function eg(e,t,i={}){const n=[Qm];if(i.still)return n.join("\n");const s=i.timing||"1s ease 0s infinite normal",a=new Set([...t.parts.map(e=>`part:${e.id}`),...(t.groups??[]).map(e=>`group:${e.id}`),...(t.shapes??[]).map(e=>`shape:${e.id}`)]);for(const t of e){const e=Um(t.target);if(!e||!a.has(t.target)||!t.css)continue;const i=[t.name,...t.lanes??[]];n.push(t.css);const r=e=>`${e} ${s}`;if(Gm(t)){const s=Jm(t);s&&(n.push(s,Xm(t)),i.push(`${t.name}-fill`),n.push(`.rig ${e} .outlines { animation: ${r(`${t.name}-outline`)}; }`)),n.push(`.rig ${e} { stroke: currentColor; }`,`.rig ${e} .primary, .rig ${e} .secondary { stroke: none; }`)}t.origin&&n.push(`.rig ${e} { transform-origin: ${t.origin} !important; }`),n.push(`.rig ${e} { animation: ${i.map(r).join(", ")}; }`)}return n.join("\n")}const tg=e=>String(+e.toFixed(3)),ig=e=>[e[0]+e[2]/2,e[1]+e[3]/2],ng=e=>`transform-origin: ${tg(e[0])}px ${tg(e[1])}px`,sg=e=>(0,de.Mj)(e).map(e=>(0,de.ER)([e])),ag=new Map;function rg(e,t){const i=`${t}|${e}`;let n=ag.get(i);if(void 0===n){const s=Ne(`<svg viewBox="${t}">${e}</svg>`);n=s.error?null:{markup:s.markup.replace(/^<svg[^>]*>/,"").replace(/<\/svg>$/,""),box:(0,Wm.Zg)([...s.paths,...s.accentPaths,...s.strokes.map(e=>e.d)].map(Wm.hd)),outlines:[...s.paths,...s.accentPaths,...s.strokes.map(e=>e.d)].flatMap(sg)},ag.size>100&&ag.clear(),ag.set(i,n)}return n??void 0}function og(e,t,i="0 0 24 24"){return e.svg?rg(e.svg,i)?.box:(0,Wm.Zg)((e.from??[]).map(e=>t[e]?.bbox).filter(e=>!!e))}function lg(e,t,i="0 0 24 24"){const n=new Map,s=new Map;for(const a of e.parts){const e=og(a,t,i);e&&s.set(a.id,e);const r=a.origin??(e?ig(e):void 0);r&&n.set(`part:${a.id}`,r)}for(const t of e.groups??[]){const e=(0,Wm.Zg)(t.parts.map(e=>s.get(e)).filter(e=>!!e)),i=t.origin??(e?ig(e):void 0);i&&n.set(`group:${t.id}`,i)}for(const t of e.shapes??[])n.set(`shape:${t.id}`,t.origin??ig((0,Wm.hd)(t.d)));return n}const cg=e=>{if(!e)return;const t=/^entity(?:\s+(\d+(?:\.\d+)?)%)?$/.exec(e.trim());if(t){const e=void 0===t[1]?100:Math.min(100,Number(t[1]));return e>=100?"var(--mc-entity-color, currentColor)":`color-mix(in srgb, var(--mc-entity-color, currentColor) ${e}%, transparent)`}return st(e,"color")},dg=e=>Object.entries(e).filter(([,e])=>void 0!==e&&!1!==e&&""!==e).map(([e,t])=>` ${e}="${(e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"))(t)}"`).join("");new WeakMap,new Map,new Map,new WeakMap;const pg=/^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\d\s.,%/+-]*\))$/i;function hg(e){if(!e)return;const t=e.trim();return/^entity\b/i.test(t)||/var\(/i.test(t)||/^currentcolor$/i.test(t)?"currentColor":pg.test(t)?t:"currentColor"}const ug=e=>e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),mg=e=>String(+e.toFixed(4)),gg=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;function fg(e,t){const i=(e??"center").trim().split(/\s+/),n=(e,i)=>{const n=t[2+i],s=t[i];if(!e||"center"===e)return s+n/2;if("left"===e||"top"===e)return s;if("right"===e||"bottom"===e)return s+n;const a=parseFloat(e);return Number.isFinite(a)?e.endsWith("%")?s+n*a/100:s+a:s+n/2};let[s,a]=i;return"top"!==s&&"bottom"!==s&&("left"!==a&&"right"!==a||"center"!==s)||([s,a]=[a,s]),[n(s,0),n(a??"center",1)]}const vg={linear:[0,0,1,1],ease:[.25,.1,.25,1],"ease-in":[.42,0,1,1],"ease-out":[0,0,.58,1],"ease-in-out":[.42,0,.58,1]};function bg(e){const t=(B.find(t=>t.id===e)?.css??e??"ease").trim();if(/^steps\(/.test(t))return"steps";if(vg[t])return vg[t];const i=/^cubic-bezier\(([^)]*)\)$/.exec(t);if(i){const e=i[1].split(",").map(e=>Math.min(1,Math.max(0,Number(e))));if(4===e.length&&e.every(Number.isFinite))return e}return vg.ease}const yg={translate:"x",rotate:"rotate",scale:"scale",skewX:"skew",skewY:"skew",opacity:"opacity",color:"color",stroke:"stroke",draw:"draw"};function xg(e,t){const i=e.transform;switch(t){case"translate":return!i||void 0===i.x&&void 0===i.y?void 0:[i.x??0,i.y??0];case"rotate":return void 0!==i?.rotate?[i.rotate]:void 0;case"scale":if(!i||void 0===i.scale&&void 0===i.scale_x&&void 0===i.scale_y)return;return[(i.scale??1)*(i.scale_x??1),(i.scale??1)*(i.scale_y??1)];case"skewX":return!i||void 0===i.skew_x&&void 0===i.skew_y?void 0:[i.skew_x??0];case"skewY":return!i||void 0===i.skew_x&&void 0===i.skew_y?void 0:[i.skew_y??0];case"opacity":return void 0!==e.opacity?[e.opacity]:void 0;case"color":return e.color?hg(e.color)??"currentColor":void 0;case"stroke":return e.stroke?hg(e.stroke)??"currentColor":void 0;case"draw":return void 0!==e.draw?[1-e.draw]:void 0}}const wg=e=>"string"==typeof e?e:e.map(mg).join(" ");function _g(e){const t=e.easings.map(bg),i=` keyTimes="${e.times.map(mg).join(";")}"`;return t.some(e=>"steps"===e)?` calcMode="discrete"${i}`:` calcMode="spline"${i} keySplines="${t.map(e=>e.map(mg).join(" ")).join(";")}"`}const kg=e=>` dur="${mg(e)}s" repeatCount="indefinite" begin="0s"`;function $g(e,t,i,n){return`<animateTransform attributeName="transform" type="${e}" additive="sum" values="${t.values.map(e=>n(e)).join(";")}"${_g(t)}${kg(i)}/>`}function Mg(e,t,i){return`<animate attributeName="${e}" values="${t.values.map(wg).join(";")}"${_g(t)}${kg(i)}/>`}function Sg(e,t,i,n,s){const a=[],r=t=>function(e,t,i){const n=e.filter(e=>void 0!==xg(e,t));if(!n.length)return;const s=[],a=[],r=[],o=(e,t,i)=>{const n=Math.min(1,Math.max(0,e/100));if(s.length&&n<=s[s.length-1])return a[a.length-1]=t,void(r[r.length-1]=i);s.push(n),a.push(t),r.push(i)};n[0].at>0&&o(0,xg(n[0],t),"linear");for(const e of n)o(e.at,xg(e,t),e.easings?.[yg[t]]??e.easing??i);return s[s.length-1]<1&&o(100,a[a.length-1],"linear"),1===s.length&&(s.push(1),a.push(a[0]),r.push("linear")),r.pop(),{times:s,values:a,easings:r}}(e,t,n),o=r("translate"),l=[r("rotate"),r("scale"),r("skewX"),r("skewY")],c=l.some(Boolean),[d,p]=c?t:[0,0];if(s){const e=Mn(s.d,32);if(e.length){const t={times:e.map(e=>e.t),values:e.map(e=>[e.x,e.y]),easings:e.slice(1).map(()=>"linear")};a.push($g("translate",t,i,e=>`${mg(e[0])} ${mg(e[1])}`))}}o?a.push($g("translate",o,i,e=>`${mg(e[0]+d)} ${mg(e[1]+p)}`)):c&&a.push($g("translate",{times:[0,1],values:[[d,p],[d,p]],easings:["linear"]},i,e=>`${mg(e[0])} ${mg(e[1])}`));const[h,u,m,g]=l;h&&a.push($g("rotate",h,i,e=>mg(e[0]))),u&&a.push($g("scale",u,i,e=>`${mg(e[0])} ${mg(e[1])}`)),m&&a.push($g("skewX",m,i,e=>mg(e[0]))),g&&a.push($g("skewY",g,i,e=>mg(e[0]))),c&&a.push($g("translate",{times:[0,1],values:[[-d,-p],[-d,-p]],easings:["linear"]},i,e=>`${mg(e[0])} ${mg(e[1])}`));const f=r("opacity");f&&a.push(Mg("opacity",f,i));const v=r("color");v&&a.push(Mg("color",v,i));const b=r("stroke");b&&a.push(Mg("stroke",b,i));const y=r("draw");if(y){a.push(Mg("stroke-dashoffset",y,i));const e=function(e){const t=e.times.map((t,i)=>[t,e.values[i][0]<=.001?1:0]),i=[],n=[];return t.forEach(([e,s],a)=>{const r=t[a-1];if(r&&r[1]!==s){const t=r[0]+(e-r[0])*(s?.75:.25);t>i[i.length-1]&&(i.push(t),n.push([0]))}(!i.length||e>i[i.length-1])&&(i.push(e),n.push([s]))}),{times:i,values:n,easings:i.slice(1).map(()=>"linear")}}(y);a.push(Mg("fill-opacity",e,i)),a.push(Mg("stroke-opacity",{...e,values:e.values.map(e=>[1-e[0]])},i))}return a.join("")}function Cg(e,t,i){const n=/^(part|group|shape):(.+)$/.exec(t);if(!n||!i)return e;const s="part"===n[1]?"data-p":"group"===n[1]?"data-g":"data-s",a=new RegExp(`(<(g|path) ${s}="${n[2]}"[^>]*>)`);return e.replace(a,e=>`${e}${i}`)}function Ag(e,t){const i=function(e,t){const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return;const n="part"===i[1]?"data-p":"group"===i[1]?"data-g":"data-s",s=new RegExp(`<(g|path) ${n}="${i[2]}"[^>]*>`).exec(e);if(!s)return;if("path"===s[1])return[s.index,e.indexOf("</path>",s.index)+7];const a=/<g\b[^>]*>|<\/g>/g;a.lastIndex=s.index+s[0].length;let r=1;for(let t=a.exec(e);t;t=a.exec(e))if(r+="</g>"===t[0]?-1:1,!r)return[s.index,t.index+4]}(e,t);if(!i)return e;const n=e.slice(i[0],i[1]).replace(/ class="(primary|secondary)"/g,' class="$1" stroke="none"');return e.slice(0,i[0])+n+e.slice(i[1])}function jg(e){const t=e=>{const t={...e};return delete t.at,delete t.easing,delete t.easings,JSON.stringify(t)};return e.every(i=>t(i)===t(e[0]))}const zg=new Set(["name","state","background"]);function qg(e,t,i={}){const n=[],s=bt(e,{v2:"lenient"});if(!s.ok)return{svg:"",warnings:[Zn(953,{message:s.errors[0]?.message??Zn(1173)})]};const a=s.doc;if("keyframes"!==a.kind)return{svg:"",warnings:[Zn(624)]};a.clips?.length&&n.push(Zn(915)),a.bindings?.length&&n.push(Zn(1096)),"infinite"!==a.iterations&&n.push(Zn(970)),a.tracks?.some(e=>zg.has(e.target))&&n.push(Zn(1042));const r=!1!==i.smil;r&&a.direction&&"normal"!==a.direction&&n.push(Zn(945)),r&&[...a.keyframes??[],...(a.tracks??[]).flatMap(e=>e.keyframes)].some(e=>e.transform?.axis)&&n.push("3D turns play flat in the SMIL fallback.");const o=t.viewBox||"0 0 24 24",l=function(e){const[t,i,n,s]=e.split(/[\s,]+/).map(Number);return[t,i,n,s].every(Number.isFinite)&&n>0&&s>0?[t,i,n,s]:[0,0,24,24]}(o),c=(0,Wm.WP)(t),d=a.rig??{parts:[]},p=In(a),h=function(e){return new Set(e.filter(e=>Um(e.target)&&Gm(e)).map(e=>e.target))}(p);let u=function(e,t,i={}){const n=i.viewBox??"0 0 24 24",s=function(e){const[t,i,n,s]=e.split(/[\s,]+/).map(Number);return[t,i,n,s].every(Number.isFinite)&&n>0&&s>0?[t,i,n,s]:[0,0,24,24]}(n),a=i.drawn??new Set,r=lg(e,t,n),o=tg(s[2]/24*1.2),l=new Set(e.parts.flatMap(e=>e.from??[])),c=new Map;for(const t of e.groups??[])for(const e of t.parts)c.has(e)||c.set(e,t.id);const d=(e,t=!1)=>e.stroke?(t?sg(e.d):[e.d]).map(i=>`<path${dg({class:t&&"drawn",d:i,fill:"none",stroke:"currentColor","stroke-width":tg(e.stroke.width),"stroke-linecap":e.stroke.cap,"stroke-linejoin":e.stroke.join,pathLength:t&&"1"})}></path>`).join(""):`<path${dg({class:e.secondary?"secondary":"primary",d:e.d,"fill-rule":e.evenodd&&"evenodd"})}></path>`,p=e=>e.length?`<g class="outlines">${e.map(e=>`<path${dg({class:"drawn",d:e,fill:"none",pathLength:"1","stroke-width":o})}></path>`).join("")}</g>`:"";let h=!1;const u=(e,i)=>{const s=i||a.has(`part:${e.id}`),o=r.get(`part:${e.id}`),l=`<g${dg({"data-p":e.id,style:o&&ng(o)})}>`;if(e.svg){const t=rg(e.svg,n);return t?(h=!0,`${l}${t.markup}${s?p(t.outlines):""}</g>`):""}const c=(e.from??[]).map(e=>t[e]).filter(e=>!!e);if(!c.length)return"";h=!0;const u=c.filter(e=>!e.stroke);return`${l}${c.map(e=>d(e,s)).join("")}${s?p(u.flatMap(e=>sg(e.d))):""}</g>`},m=new Set;let g="";for(const t of e.parts){const i=c.get(t.id);if(!i){g+=u(t,!1);continue}if(m.has(i))continue;m.add(i);const n=a.has(`group:${i}`),s=e.parts.filter(e=>c.get(e.id)===i).map(e=>u(e,n)).join(""),o=r.get(`group:${i}`);g+=`<g${dg({"data-g":i,style:o&&ng(o)})}>${s}</g>`}const f=e.shapes??[],v=e=>f.filter(t=>t.layer===e).map(e=>function(e,t,i){const n=cg(e.fill)??(e.stroke?"none":"currentColor"),s=cg(e.stroke),a=[`fill: ${n}`,s?`stroke: ${s}`:"",t?ng(t):""].filter(Boolean).join("; ");return`<path${dg({"data-s":e.id,class:i&&"drawn",d:e.d,pathLength:i&&"1","stroke-width":e.stroke_width??(i||s?1:void 0),"stroke-linecap":e.linecap,style:a})}></path>`}(e,r.get(`shape:${e.id}`),a.has(`shape:${e.id}`))).join("");if(!h&&!f.length)return;const b=t.filter(e=>!l.has(e.index)).map(e=>d(e)).join("");return`<g class="rig">${v("under")}${b}${g}${v("over")}</g>`}(d,c,{viewBox:o,drawn:h});if(u||(u=`<g class="rig">${c.map(e=>`<path class="${e.secondary?"secondary":"primary"}" d="${ug(e.d)}"${e.evenodd?' fill-rule="evenodd"':""}></path>`).join("")}</g>`),!c.length&&!d.shapes?.length)return{svg:"",warnings:[...n,Zn(973)]};const m=a.duration,g=`${mg(m)}s ${gn(a.easing)} 0s infinite ${a.direction??"normal"}`,f=i.color?st(i.color,"color"):void 0;i.color&&!f&&n.push(Zn(962));const v=f?hg(f)??"currentColor":void 0,b=`mc-a-${hn(`${u}|${JSON.stringify(a)}|${r}|${f??""}`)}`,y=un(a),x=fn(a.id),w=a.origin||"center",_=[],k=(e,t,i,n)=>{if(jg(i))return;const s=_n(t,i,x);_.push(s.css,`.${b} .mc-css .${e} { transform-box: view-box; transform-origin: ${n??w}; animation: ${[t,...s.lanes].map(e=>`${e} ${g}`).join(", ")}; }`)},$=a.tracks?.find(e=>"element"===e.target),M=a.tracks?.find(e=>"icon"===e.target);k("mc-el",`${y}-el`,a.keyframes??[]),k("mc-et",`${y}-et`,$?.keyframes??[],$?.origin),k("mc-it",`${y}-it`,M?.keyframes??[],M?.origin);const S=[`.${b} { --mc-anim-c: ${f??"currentColor"};${f?` color: ${f};`:""} }`,...r?[`.${b} .mc-css { visibility: visible; }`,`.${b} .mc-smil { display: none; }`]:[],(A=eg(p,d,{timing:g}),A.replace(/(^|[\s,{])\.rig\b/g,`$1.${b} .mc-css .rig`)),..._,..._.length?[`@media (prefers-reduced-motion: reduce) { .${b} .mc-el, .${b} .mc-et, .${b} .mc-it { animation: none !important; } }`]:[]].join("\n"),C=[];var A,j;if(C.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ug(l.join(" "))}" class="mc-anim ${b}"${v?` color="${ug(v)}"`:""}>`),C.push(`<title>${ug(a.name)}</title>`),C.push(`<style>\n${S}\n</style>`),C.push(`<g class="mc-css"${r?' visibility="hidden"':""}>${j=u,`<g class="mc-el"><g class="mc-et"><g class="mc-it">${j}</g></g></g>`}</g>`),r){let e=u.replace(/ style="([^"]*)"/g,(e,t)=>t.split(";").map(e=>e.trim()).filter(Boolean).map(e=>{const[t,...i]=e.split(":"),n=t.trim(),s=i.join(":").trim();return"fill"===n||"stroke"===n?` ${n}="${ug("none"===s?"none":hg(s)??"currentColor")}"`:""}).join("")).replace(/ class="drawn"/g,' class="drawn" stroke-dasharray="1" stroke-linecap="round" stroke-linejoin="round"').replace(/<g class="outlines">[\s\S]*?<\/g>/g,e=>e.replace(/stroke-linecap="round"/g,'stroke-linecap="butt"').replace(/stroke-dasharray="1"/g,'stroke-dasharray="0.999 2"')).replace(/<g class="outlines">/g,'<g class="outlines" stroke="currentColor">').replace(/<g class="rig">/,'<g class="rig" fill="currentColor">');const t=lg(d,c,o),i=[0,0,l[2],l[3]];for(const n of a.tracks??[])/^(part|group|shape):/.test(n.target)&&(h.has(n.target)&&(e=Ag(e,n.target)),e=Cg(e,n.target,Sg(n.keyframes,n.origin?fg(n.origin,i):t.get(n.target)??fg("center",l),m,a.easing,n.path)));const n=fg(w,l),s=(e,t,i)=>{const n=e&&!jg(e)?Sg(e,t,m,a.easing):"";return n?`<g>${n}${i}</g>`:i};e=s(M?.keyframes,M?.origin?fg(M.origin,l):n,e),e=s($?.keyframes,$?.origin?fg($.origin,l):n,e),e=s(a.keyframes,n,e),C.push(`<g class="mc-smil">${e}</g>`)}C.push("</svg>");const z=C.join("\n");return gg(z)>262144&&n.push(Zn(969,{size:Math.round(gg(z)/1024)})),{svg:z,warnings:n}}const Eg=new Set(["svg","g","path","title","style","animate","animatetransform"]);var Lg=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Pg=e=>Zn(1256,{size:(e/1024).toFixed(e<10240?1:0)}),Hg=e=>(new TextEncoder).encode(e).length;function Vg(e,t,i="image/svg+xml"){const n=URL.createObjectURL(new Blob([e],{type:i})),s=document.createElement("a");s.href=n,s.download=t,s.rel="noopener",document.body.appendChild(s),s.click(),s.remove(),setTimeout(()=>URL.revokeObjectURL(n),1e3)}async function Dg(e){const t=await async function(e,t){const i=function(e,t){const i=e.name.lastIndexOf("."),n=e.name.slice(i<0?e.name.length:i).toLowerCase(),s=t.types.find(e=>e.extensions.includes(n))??t.types.find(t=>t.mimeTypes.includes(e.type))??(t.other&&{kind:"other",...t.other});return s?e.size>s.maxBytes?{code:"too_large",maxBytes:s.maxBytes}:s:{code:"wrong_type"}}(e,t);if("code"in i)return{ok:!1,...i};try{return{ok:!0,text:await e.text(),kind:i.kind,bytes:e.size,name:e.name}}catch{return{ok:!1,code:"unreadable"}}}(e,Am);return t.ok?{text:t.text}:{error:"too_large"===t.code?Zn(949):"wrong_type"===t.code?Zn(157):Zn(968)}}let Tg=class extends n.WF{constructor(){super(...arguments),this.pieces=[],this.viewBox="0 0 24 24",this.disabled=!1,this._open=!1,this._mode="export",this._format="still",this._smil=!0,this._color="",this._text="",this._fileName="",this._status="",this._error="",this._over=!1,this._textSeq=0}openExport(e=!1){this._mode="export",this._format=e||this._isParticles?"animated":"still",this._manual=void 0,this._status="",this._error="",this._show()}openImport(e="",t=""){this._mode="import",this._text="",this._take(e),this._fileName=t,this._status="",this._error="",this._show()}close(){const e=this.renderRoot.querySelector("mc-ui-window");e?.open?e.close("action"):this._open=!1}get open(){return this._open}get _isParticles(){return"particles"===this.doc?.kind}get exportText(){return this._export().text}_export(){const e=this._exportMemo;if(e&&e.doc===this.doc&&e.pieces===this.pieces&&e.viewBox===this.viewBox)return e;const t=this.doc?.rig??{parts:[]},i=function(e,t,i={}){const n=i.viewBox??Km(e),s=new Map(t.map(e=>[e.index,e])),a=new Set,r=[],o=qr(e.shapes??[]);for(const e of o)"under"===e.layer&&r.push(Om(e));const l=[];for(const t of e.parts??[])if(t.svg){const e=Rm(t.svg,n);e&&l.push(`<g id="${Pm(t.id)}" class="part" fill="currentColor">${e}</g>`)}else if(t.from?.length){const e=t.from.map(e=>(a.add(e),s.get(e))).filter(e=>!!e);e.length&&l.push(Fm(e,t.id,"part"))}const c=t.filter(e=>!a.has(e.index));c.length&&r.push(Fm(c,void 0,"base")),r.push(...l);for(const e of o)"under"!==e.layer&&r.push(Om(e));return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${Pm(n)}">\n${r.map(e=>`  ${e}`).join("\n")}\n</svg>`}(t,this.pieces,{viewBox:t.svg?void 0:this.viewBox}),n=(r=a=i,("undefined"!=typeof TextEncoder?(new TextEncoder).encode(r).length:r.length)>Se?"The SVG is larger than 32 KB.":/<path|<g/.test(a)?Ne(a).error:"Nothing to save yet: draw a shape or use an icon."),s=n?"":Ne(i).markup;var a,r;return this._exportMemo={doc:this.doc,pieces:this.pieces,viewBox:this.viewBox,text:i,error:n,clean:s},this._exportMemo}_animated(){const e=this._animMemo;if(e&&e.doc===this.doc&&e.pieces===this.pieces&&e.viewBox===this.viewBox&&e.smil===this._smil&&e.color===this._color)return e;const t=this.doc?this._isParticles?function(e){const t=lm;if(!t)return{svg:"",warnings:[Zn(989)]};const i=dm(e);if(!i)return{svg:"",warnings:[Zn(194)]};const n=t.bake({spec:i,period:Ou(e),geometry:yo}),s=[];return"live"===i.sim.mode&&s.push(Zn(444)),n.elements.some(e=>"icon"in e.shape||"emoji"in e.shape)&&s.push(Zn(392)),n.stats.capped&&s.push(Zn(983)),{svg:t.bakedSvg(n,{width:200,height:Math.round(200/yo.aspect)}),warnings:s}}(this.doc):qg(this.doc,function(e,t="0 0 24 24"){const i=e=>!(!e.accent&&!e.secondary),n=e.filter(e=>!e.stroke&&!i(e)),s=e.filter(e=>!e.stroke&&i(e)),a=e.filter(e=>e.stroke),r=e=>e.map((e,t)=>e.evenodd?t:-1).filter(e=>e>=0),o={paths:r(n),accent:r(s)};return{paths:n.map(e=>e.d),viewBox:t,...s.length?{secondary:s.map(e=>e.d)}:{},...a.length?{strokes:a.map(e=>({d:e.d,width:e.stroke.width,...e.stroke.cap?{cap:e.stroke.cap}:{},...e.stroke.join?{join:e.stroke.join}:{},...i(e)?{accent:!0}:{}}))}:{},...o.paths.length||o.accent.length?{evenodd:o}:{}}}(this.pieces,this.viewBox),{smil:this._smil,...this._color?{color:this._color}:{}}):{svg:"",warnings:[]},i=t.svg?function(e){if(/<script|<foreignobject|<iframe|<image|<use|<!entity|<!doctype/i.test(e))return Zn(190);if(/\son[a-z]+\s*=/i.test(e))return Zn(191);if(/\shref\s*=|xlink:/i.test(e))return Zn(189);if(/url\(\s*['"]?(?!#)/i.test(e)||/@import|javascript:|expression\s*\(/i.test(e))return Zn(192);for(const t of e.matchAll(/<([a-zA-Z][\w-]*)/g))if(!Eg.has(t[1].toLowerCase()))return Zn(1060,{element:t[1]});let t=e.replace(/<style>[\s\S]*?<\/style>/g,"").replace(/<animate(Transform)?\b[^>]*\/>/g,"");gg(t)>Se&&t.includes('<g class="mc-smil">')&&(t=`${t.slice(0,t.indexOf('<g class="mc-smil">'))}</svg>`);const i=Ne(t);return i.error?i.error:i.paths.length||i.strokes.length||i.accentPaths.length?void 0:Zn(610)}(t.svg):t.warnings[0]??Zn(613),n=t.svg?t.warnings:t.warnings.slice(1),s="function"==typeof getComputedStyle?getComputedStyle(this).getPropertyValue("--state-icon-color").trim():"",a=/^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i.test(s)?s:"#44739e",r=this._color?t.svg:t.svg.replace('class="mc-anim ',`color="${a}" class="mc-anim `),o=t.svg&&!i?`data:image/svg+xml;charset=utf-8,${encodeURIComponent(r)}`:"";return this._animMemo={doc:this.doc,pieces:this.pieces,viewBox:this.viewBox,smil:this._smil,color:this._color,text:t.svg,warnings:n,error:i,url:o},this._animMemo}_ready(){return this._cssLoad??=(async()=>{let e;try{const t=await Promise.race([i.e(417).then(()=>i(8844)),new Promise(t=>{e=setTimeout(t,1e4,void 0)})]);return t?"2026.10.12-beta.11"!==t.BUILD?void console.warn("Magic Card was updated, reload the page (magic-card-svg-css.js)"):t.resolveCss:void console.warn("Magic Card: magic-card-svg-css.js did not load")}catch{return void console.warn("Magic Card: magic-card-svg-css.js did not load")}finally{clearTimeout(e)}})().then(e=>{this._css=e})}_take(e){const t=++this._textSeq,i=()=>{t===this._textSeq&&(this._text=e)};if(!e)return i(),Promise.resolve();const n=this._ready().then(i);return this._taking=n,n}async getUpdateComplete(){return await this._taking,super.getUpdateComplete()}_sourceError(){return this._srcMemo?.text!==this._text&&(this._srcMemo={text:this._text,error:Ne(this._text,{css:this._css}).error}),this._srcMemo.error}async _copy(e,t,i){const n=await async function(e,t){try{if(navigator.clipboard?.writeText)return await navigator.clipboard.writeText(e),!0}catch{}try{const i=document.createElement("textarea");i.value=e,i.setAttribute("readonly",""),i.style.cssText="position:fixed;left:-9999px;top:0;opacity:0",(t??document.body).appendChild(i),i.select();const n=document.execCommand("copy");return i.remove(),n}catch{return!1}}(e,this.renderRoot.querySelector("mc-ui-window"));n?(this._manual=void 0,this._status=i):(this._manual={label:t,text:e},this._status=Zn(200))}async _show(){const e=hd()??void 0;this._open=!0,await this.updateComplete;const t=this.renderRoot.querySelector("mc-ui-window");t&&!t.open&&(t.opener=e,t.show())}updated(e){if(e.has("_manual")&&this._manual){const e=this.renderRoot.querySelector("textarea.manual");e?.focus(),e?.select()}if(e.has("_status")&&this._status){const e=this._status;setTimeout(()=>{this._status===e&&(this._status="")},2500)}}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_imported(){if(!this._text||!this.doc)return;const e=this._importMemo;if(e&&e.text===this._text&&e.doc===this.doc&&e.viewBox===this.viewBox)return e.r;const t=Yi-(this.doc.rig?.shapes?.length??0),i=function(e,t,i=[],n=48,s){const a=Ne(e,{css:s});if(a.error)return{error:a.error};const r=Sr(a.viewBox,t),o=function(e,t){const i="undefined"==typeof DOMParser?void 0:(new DOMParser).parseFromString(e,"image/svg+xml").documentElement;if(!i||"svg"!==i.localName)return{ok:!1,error:"not_svg"};const n=Math.min(t.maxShapes??1e4,1e4),s=Math.min(t.maxPathChars??jm,jm),a={transforms:!1,colours:!1,opacity:!1,mergedGroups:!1},r=[],o=[];let l,c=0;const d=e=>(void 0!==t.paint?.(e)||qm.test(e)||Em.test(e)||(a.colours=!0),e),p=(e,t)=>{const i=t=>e.getAttribute(t)?.trim(),n={...t},s=i("fill");void 0!==s&&(n.fill=d(s));const r=i("stroke");void 0!==r&&(n.stroke=d(r));const o=parseFloat(i("stroke-width")??"");Number.isFinite(o)&&o>=0&&(n.width=o);const l=i("stroke-linecap");"butt"!==l&&"round"!==l&&"square"!==l||(n.cap=l);const c=i("stroke-linejoin");"miter"!==c&&"round"!==c&&"bevel"!==c||(n.join=c);const p=i("fill-rule");"evenodd"!==p&&"nonzero"!==p||(n.evenodd="evenodd"===p),(i("class")??"").split(/\s+/).includes("mc-accent")&&(n.accent=!0),(i("opacity")||i("fill-opacity")||i("stroke-opacity"))&&(a.opacity=!0);const h=parseFloat(i("opacity")??"");return Number.isFinite(h)&&(n.opacity=(n.opacity??1)*Math.min(Math.max(h,0),1)),n},h=(e,i,d,u,m)=>{const g=e.localName.toLowerCase(),f=zm.find(e=>e===g);if(l||!f&&"g"!==g&&"svg"!==g)return;const v=e.getAttribute("transform");v&&(a.transforms=!0);const b=v?ke(i,$e(v)):i,y=p(e,d);if("g"===g){let i=u,n=m;if(t.keepGroups)if(m<4){const t=e.getAttribute("id");o.push({...void 0===u?{}:{parent:u},...t?{id:t}:{}}),i=o.length-1,n++}else a.mergedGroups=!0;for(const t of e.children)h(t,b,y,i,n);return}if(!f)return;const x=Me(e,g);if(!x)return;if(r.length>=n)return void(l="too_many");const w=function(e,t){const i=e=>`${Lm(t[0]*e[0]+t[2]*e[1]+t[4])} ${Lm(t[1]*e[0]+t[3]*e[1]+t[5])}`;return(0,de.Rr)(e).map(e=>`M${i(e.start)}${e.segs.map(e=>e.c1&&e.c2?`C${i(e.c1)} ${i(e.c2)} ${i(e.to)}`:`L${i(e.to)}`).join("")}${e.closed?"Z":""}`).join("")}(x,b);if(!w)return;if(c+=w.length,c>s)return void(l="too_detailed");const _=e.getAttribute("id"),k={from:f,d:w,fill:y.fill,stroke:y.stroke,strokeWidth:y.width*Math.sqrt(Math.abs(b[0]*b[3]-b[1]*b[2])),cap:y.cap,join:y.join,evenodd:y.evenodd,opacity:y.opacity,accent:y.accent,group:u,..._?{id:_}:{}};r.push(t.each?t.each(e,k):k)},u=$e(i.getAttribute("transform"));i.getAttribute("transform")&&(a.transforms=!0);const m=t.matrix?ke(t.matrix,u):u,g=p(i,{width:1,accent:!1});for(const e of i.children)h(e,m,g,void 0,0);return l?{ok:!1,error:l}:r.length?{ok:!0,shapes:r,groups:o,viewBox:t.viewBox,notes:a}:{ok:!1,error:"empty"}}(a.markup,{viewBox:t,keepGroups:!1,maxShapes:n,maxPathChars:Math.min(n*Qe,jm),matrix:[r.k,0,0,r.k,r.dx,r.dy]});if(!o.ok)return{error:Bm[o.error].replace("{room}",String(n))};const l=new Set(i),c=[];for(const e of o.shapes){const t=xr(e.d,e=>e);if(t.length>Qe)return{error:Bm.too_detailed};if(!t)continue;const i=e.id??"",n=Ji.test(i)&&!l.has(i)?i:Hr([...l],"shape");l.add(n);const s={id:n,name:i&&Ji.test(i)?i:`Shape ${c.length+1}`,d:t,layer:"over"},a="line"===e.from?"none":Zm(e.fill)??"currentColor",o=Zm(e.stroke),d=e.strokeWidth??1;o&&"none"!==o?(s.stroke=o,s.stroke_width=Math.round(1e3*d)/1e3,"round"!==e.cap&&"butt"!==e.cap&&"square"!==e.cap||(s.linecap=e.cap),"none"!==a&&(s.fill=a)):"none"===a||Im(t)?(s.stroke="currentColor",s.stroke_width=Math.round(1e3*Math.max(r.k,.05))/1e3):s.fill=a,c.push(s)}return c}(this._text,this.viewBox,Tr(this.doc),t,this._css);return this._importMemo={text:this._text,doc:this.doc,viewBox:this.viewBox,r:i},i}async _pick(e){const t=e.target,i=t.files?.[0];t.value="",i&&await this._takeFile(i)}async _takeFile(e){const t=await Dg(e);if("error"in t)return this._error=as(t.error),void this._take("");this._error="",this._fileName=e.name,await this._take(t.text)}_drop(e){e.preventDefault(),this._over=!1;const t=e.dataTransfer?.files?.[0];t&&this._takeFile(t)}_addShapes(e){if(!this.doc)return;let t=this.doc;for(const i of e)t=t&&Or(t,i);if(!t)return void(this._error=Zn(84,{shapes:Yi}));const i=Vr(t);i?this._error=i:(this._emit(t,1===e.length?Zn(404):Zn(405)),this.close())}_useAsIcon(){if(!this.doc)return;const e=function(e,t,i,n){const s=Ne(t,{css:n});if(s.error)return{error:s.error};const a=e.rig??{parts:[]},r=Mr(i??Km(a)).join(" "),o=Mr(s.viewBox).join(" "),l=Sr(r,o),c=r===o,d=e=>{return e.origin?{...e,origin:(t=e.origin,t&&!c?[Math.round(100*(t[0]*l.k+l.dx))/100,Math.round(100*(t[1]*l.k+l.dy))/100]:t)}:e;var t},p=e=>String(Math.round(1e4*e)/1e4),h=(a.parts??[]).filter(e=>!e.from).map(e=>d(c||!e.svg?e:{...e,svg:`<g transform="matrix(${p(l.k)} 0 0 ${p(l.k)} ${p(l.dx)} ${p(l.dy)})">${e.svg}</g>`})),u=a.shapes?.map(e=>c?e:d({...e,d:xr(e.d,e=>[e[0]*l.k+l.dx,e[1]*l.k+l.dy]),...void 0!==e.stroke_width?{stroke_width:Math.round(e.stroke_width*l.k*1e3)/1e3}:{}})),m=new Set(h.map(e=>e.id)),g=(a.groups??[]).map(e=>d({...e,parts:e.parts.filter(e=>m.has(e))})).filter(e=>e.parts.length),f=new Set([...(a.parts??[]).filter(e=>!m.has(e.id)).map(e=>`part:${e.id}`),...(a.groups??[]).filter(e=>!g.some(t=>t.id===e.id)).map(e=>`group:${e.id}`)]),v={...a,svg:s.markup,parts:h,...a.groups?{groups:g}:{},...u?{shapes:u}:{}};delete v.icon;const b={...e,rig:v};return e.tracks&&(b.tracks=e.tracks.filter(e=>!f.has(e.target)).map(e=>e.path&&!c&&/^(part|group|shape):/.test(e.target)?{...e,path:{...e.path,d:xr(e.path.d,e=>[e[0]*l.k,e[1]*l.k])}}:e)),e.bindings&&(b.bindings=e.bindings.filter(e=>!f.has(e.target))),b}(this.doc,this._text,this.viewBox,this._css);if("error"in e)return void(this._error=as(e.error));const t=Vr(e);t?this._error=t:(this._emit(e,"Use SVG as icon"),this.close())}_shapesPreview(e,t){return n.qy`<svg viewBox=${t} aria-hidden="true">
      ${qr(e).map(e=>n.JW`<path d=${e.d} fill=${Ar(e)?e.fill&&!/^entity|var\(/.test(e.fill)?e.fill:"currentColor":"none"}
            stroke=${jr(e)?/^entity|var\(/.test(e.stroke)?"currentColor":e.stroke:"none"}
            stroke-width=${e.stroke_width??1} stroke-linecap=${e.linecap??"butt"} stroke-linejoin="round"></path>`)}
    </svg>`}_renderFormat(){const e=[["still",Zn(391),"mdi:image-outline"],["animated",Zn(63),"mdi:motion-play-outline"]];return n.qy`<div class="format">${Cd({role:"radiogroup",label:Zn(1103),full:!0,value:this._format,items:e.map(([e,t,i])=>({value:e,label:t,icon:i})),onChange:e=>{this._format=e,this._status="",this._manual=void 0}})}</div>`}_renderManual(){return this._manual?n.qy`<div class="field">
          <div class="field-head"><label for="svg-manual">${this._manual.label}</label></div>
          <textarea id="svg-manual" class="code manual" readonly .value=${this._manual.text} @focus=${e=>e.target.select()}></textarea>
        </div>`:n.s6}_renderAnimated(){const{text:e,warnings:t,error:i,url:s}=this._animated(),a=Hg(e);return n.qy`
      <div class="body">
        ${this._isParticles?n.s6:this._renderFormat()}
        <div class="top">
          <div class="preview">${s?n.qy`<img class="anim" src=${s} alt="" />`:n.qy`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
          <div class="facts">
            <span>${this._isParticles?Zn(15):Zn(14)}</span>
            <span class="muted">${Pg(a)}${a>262144?Zn(4):""}</span>
            ${this._isParticles?n.qy`<span class="muted">${Zn(122)}</span>`:n.qy`<span class="muted">${Zn(123)}</span>
            <div class="color-row">
              <label class="check">
                <input type="color" class="color" .value=${this._color||"#03a9f4"} @input=${e=>this._color=e.target.value} />
                ${this._color?n.qy`${Zn(179)} <span class="mono">${this._color}</span>`:Zn(185)}
              </label>
              ${this._color?n.qy`<button type="button" class="btn btn-text btn-sm color-reset" @click=${()=>this._color=""}>${Zn(1080)}</button>`:n.qy`<span class="muted">${Zn(103)}</span>`}
            </div>
            <label class="check">
              <input type="checkbox" class="smil" .checked=${this._smil} @change=${e=>this._smil=e.target.checked} />
              ${Zn(778)}
            </label>
            `}
            ${t.length?n.qy`<ul class="warn">${t.map(e=>n.qy`<li>${e}</li>`)}</ul>`:n.s6}
            ${i?n.qy`<p class="error" role="alert">${i}</p>`:n.s6}
          </div>
        </div>
        <div class="field">
          <div class="field-head"><label for="svg-anim-code">${Zn(63)}</label></div>
          <textarea id="svg-anim-code" class="code" readonly .value=${e}></textarea>
        </div>
        ${this._renderManual()}
      </div>
      <div slot="footer" class="foot">
        <p class="status grow" role="status" aria-live="polite">${this._status}</p>
        <button type="button" class="btn btn-secondary copy" ?disabled=${!!i} @click=${()=>this._copy(e,Zn(782),Zn(64))}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${Zn(199)}
        </button>
        <button
          type="button"
          class="btn btn-primary download"
          ?disabled=${!!i}
          @click=${()=>{Vg(e,`${(this.doc?.name??""??"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"icon"}-animated.svg`),this._status=Zn(261)}}
        >
          <ha-icon icon="mdi:tray-arrow-down"></ha-icon>${Zn(260)}
        </button>
      </div>
    `}_renderExport(){if("animated"===this._format)return this._renderAnimated();const{text:e,error:t,clean:i}=this._export(),s=Hg(e),a=this.doc?.rig?.parts?.length??0,r=this.doc?.rig?.shapes?.length??0,o=Math.min(100,s/Se*100);return n.qy`
      <div class="body">
        ${this._renderFormat()}
        <div class="top">
          <div class="preview">${i?Sm(i):n.qy`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
          <div class="facts">
            <span>${a} ${1===a?"part":"parts"}, ${r} ${1===r?"shape":"shapes"}${this.pieces.length?"":Zn(5)}</span>
            <span class="muted">${Zn(1205,{kb:Pg(s)})}</span>
            <div class="meter ${s>Se?"over":""}" role="meter" aria-label=${Zn(849)} aria-valuemin="0" aria-valuemax=${Se} aria-valuenow=${s}>
              <i style="width:${o}%"></i>
            </div>
            <span class="muted">${Zn(972)}</span>
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
        <button type="button" class="btn btn-secondary copy" ?disabled=${!!t} @click=${()=>this._copy(e,Zn(782),Zn(780))}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${Zn(199)}
        </button>
        <button type="button" class="btn btn-secondary download" ?disabled=${!!t} @click=${()=>{Vg(e,`${(this.doc?.name??""??"").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60)||"icon"}.svg`),this._status=Zn(261)}}>
          <ha-icon icon="mdi:tray-arrow-down"></ha-icon>${Zn(260)}
        </button>
        <button
          type="button"
          class="btn btn-primary use"
          ?disabled=${!!t}
          title=${Zn(196)}
          @click=${()=>this._copy(`icon: svg\nsvg: |\n${e.replace(/\r\n?/g,"\n").trim().split("\n").map(e=>`  ${e}`).join("\n")}\n`,Zn(133),Zn(132))}
        >
          <ha-icon icon="mdi:card-text-outline"></ha-icon>${Zn(1082)}
        </button>
      </div>
    `}_renderImport(){const e=this._imported(),t=e&&!("error"in e)?e:void 0,i=this._error||(e&&"error"in e?as(e.error):"");return n.qy`
      <div class="body">
        ${this._text?n.qy`<div class="top">
              <div class="preview">${t?this._shapesPreview(t,this.viewBox):n.qy`<ha-icon icon="mdi:image-off-outline"></ha-icon>`}</div>
              <div class="facts">
                <span>${this._fileName||"SVG"}</span>
                ${t?n.qy`<span class="muted">${Zn(1192,{count:t.length})}</span>`:n.s6}
                <span class="muted">${Zn(38)}</span>
                ${i?n.qy`<p class="error" role="alert">${i}</p>`:n.s6}
              </div>
            </div>`:n.qy`<div
              class="drop ${this._over?"over":""}"
              @dragover=${e=>{e.preventDefault(),this._over=!0}}
              @dragleave=${()=>this._over=!1}
              @drop=${e=>this._drop(e)}
            >
              <ha-icon icon="mdi:file-upload-outline"></ha-icon>
              <span>${Zn(287)}</span>
              <label class="btn btn-secondary">
                ${Zn(159)}
                <input type="file" accept=".svg,image/svg+xml" class="sr-only" @change=${e=>this._pick(e)} />
              </label>
              ${i?n.qy`<p class="error" role="alert">${i}</p>`:n.s6}
            </div>`}
      </div>
      <div slot="footer" class="foot">
        ${this._text?n.qy`<button type="button" class="btn btn-text again" @click=${()=>{this._take("")}}>${Zn(158)}</button><span class="grow"></span>`:n.qy`<span class="grow"></span>`}
        <button type="button" class="btn btn-secondary use-icon" ?disabled=${!this._text||!!this._sourceError()} @click=${()=>this._useAsIcon()}>
          <ha-icon icon="mdi:star-four-points-outline"></ha-icon>${Zn(1078)}
        </button>
        <button type="button" class="btn btn-primary add" ?disabled=${!t} @click=${()=>t&&this._addShapes(t)}>
          <ha-icon icon="mdi:shape-plus-outline"></ha-icon>${Zn(26)}
        </button>
      </div>
    `}render(){return this._open?ud({heading:"import"===this._mode?Zn(402):this._isParticles?Zn(63):Zn(786),size:"m",onClose:()=>{this._open=!1,this._status=""}},"export"===this._mode?this._renderExport():this._renderImport()):n.s6}};Tg.styles=[Wp,n.AH`
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
    `],Lg([(0,s.MZ)({attribute:!1})],Tg.prototype,"doc",void 0),Lg([(0,s.MZ)({attribute:!1})],Tg.prototype,"pieces",void 0),Lg([(0,s.MZ)({type:String})],Tg.prototype,"viewBox",void 0),Lg([(0,s.MZ)({type:Boolean})],Tg.prototype,"disabled",void 0),Lg([(0,s.wk)()],Tg.prototype,"_open",void 0),Lg([(0,s.wk)()],Tg.prototype,"_mode",void 0),Lg([(0,s.wk)()],Tg.prototype,"_format",void 0),Lg([(0,s.wk)()],Tg.prototype,"_smil",void 0),Lg([(0,s.wk)()],Tg.prototype,"_color",void 0),Lg([(0,s.wk)()],Tg.prototype,"_text",void 0),Lg([(0,s.wk)()],Tg.prototype,"_fileName",void 0),Lg([(0,s.wk)()],Tg.prototype,"_status",void 0),Lg([(0,s.wk)()],Tg.prototype,"_error",void 0),Lg([(0,s.wk)()],Tg.prototype,"_over",void 0),Lg([(0,s.wk)()],Tg.prototype,"_manual",void 0),Tg=Lg([(0,s.EM)("mc-anim-svg-dialog")],Tg);var Og=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Rg={circle:n.JW`<circle cx="12" cy="12" r="7"></circle>`,square:n.JW`<rect x="5" y="5" width="14" height="14" rx="1.5"></rect>`,triangle:n.JW`<path d="M12 4l8 15H4z"></path>`,star:n.JW`<path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"></path>`,heart:n.JW`<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"></path>`,ring:n.JW`<circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="3"></circle>`,line:n.JW`<path d="M6 19L18 5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>`,spark:n.JW`<path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z"></path>`};function Ng(e){return zu(e)?n.qy`<svg class="glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${Rg[e]}</svg>`:n.qy`<ha-icon class="glyph" icon=${Au.find(t=>t.id===e).icon}></ha-icon>`}const Fg=["#ef4444","#eab308","#22c55e","#3b82f6","#ec4899","#ffffff","#f97316","#8b5cf6"];let Bg=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.emitter=0,this._shapes={},this._color=-1,this._chip=0,this._paused=!1,this._open={},this._baking=!1,this.all=!1,this._live="",this._seed=Ru(),this._bakeMs=0,this._bakeToken=0,this._applied=[],this._liveCss=new Map,this._previewCss="",this._shuffle=()=>{if(!this.doc)return;const e=this._multi&&this.all;let t=this.doc;for(let i=e?0:this._em;i<(e?pm(this.doc):this._em+1);i++)t=_m(t,this._seed,i,e=>Ju(e,this._seed));this._emit(t,"Shuffle")},this._openExport=()=>{this.renderRoot.querySelector("mc-anim-svg-dialog")?.openExport(!0)},this._convert=()=>{this.doc&&(this._emit(function(e){const t=e.particles??tt,i=wu(e),n=(i&&ku[i.id])??{},s="count"===i?.particles?t.intensity??i.defaults.intensity:void 0,a=void 0!==s&&Number.isFinite(s)?fu(Math.round(s),1,Je):tt.count,{preset:r,intensity:o,...l}=t,c={...tt,...l,...n,count:a,size:[...n.size??l.size??tt.size],colors:[...n.colors??l.colors??[]]};return c.shape||delete c.shape,{...e,particles:c}}(this.doc),"Convert to custom particles"),this._focus('.mode-seg [aria-checked="true"]'))},this._addEmitter=()=>{if(!this.doc)return;const e=function(e,t){if(!mm(e))return e;const i=fm(e,t),n=structuredClone(i[0]);return delete n.name,n.id="",n.seed=Ru(i[0].seed,void 0),n.count=Math.min(10,i[0].count,um(e)),vm(e,t,[...i,n])}(this.doc,this._seed);e!==this.doc&&(this._emit(e,"Add emitter"),this._select(pm(e)-1),this._focus('.em-tabs [aria-selected="true"]'))},this._dupEmitter=()=>{if(!this.doc)return;const e=function(e,t,i){if(!bm(e,i)||!mm(e))return e;const n=fm(e,t),s=structuredClone(n[i]);return s.id="",s.seed=Ru(n[i].seed,void 0),s.count=Math.min(n[i].count,um(e)),s.name&&(s.name=Zn(1228,{name:s.name}).slice(0,40).trim()),n.splice(i+1,0,s),vm(e,t,n)}(this.doc,this._seed,this._em);e!==this.doc&&(this._emit(e,"Duplicate emitter"),this._select(this._em+1),this._focus('.em-tabs [aria-selected="true"]'))},this._removeEmitter=()=>{if(!this.doc)return;const e=this._em,t=function(e,t,i){if(!bm(e,i)||pm(e)<2)return e;const n=fm(e,t);return n.splice(i,1),vm(e,t,n)}(this.doc,this._seed,e);t!==this.doc&&(this._emit(t,"Remove emitter"),this._select(Math.max(0,e-1)),this._focus('.em-tabs [aria-selected="true"]'))},this._onFocusOut=e=>{const t=e.target;this._pending&&["f-svg","f-emoji","f-grav","f-drag","f-turb","f-bounce"].includes(t.id)&&this._settle()}}_emit(e,t,i=!1){if(this.disabled||e===this.doc)return;this._pending=i?{doc:e,label:t}:void 0;const n=i?{doc:e,label:t,transient:!0}:{doc:e,label:t};this.dispatchEvent(new CustomEvent("doc-change",{detail:n,bubbles:!0,composed:!0}))}_settle(){if(this._pending){const{doc:e,label:t}=this._pending;if(this._pending=void 0,this.disabled)return;this.dispatchEvent(new CustomEvent("doc-change",{detail:{doc:e,label:t},bubbles:!0,composed:!0}))}}get _em(){return this.doc?Math.max(0,Math.min(Math.trunc(this.emitter)||0,pm(this.doc)-1)):0}get _vdoc(){const e=this.doc,t=this._em;return this._viewKey?.doc===e&&this._viewKey.em===t||(this._viewKey={doc:e,em:t,view:wm(e,this._seed,t)}),this._viewKey.view}get _p(){return"particles"===this.doc?.kind?this._vdoc.particles:void 0}get _sim(){return Bu(this._vdoc,this._seed)}_on(e){return _m(this.doc,this._seed,this._em,e)}_patch(e,t,i=!1){this.doc&&this._emit(this._on(t=>xu(t,e)),t,i)}_editSim(e,t,i=!1){this.doc&&this._emit(this._on(t=>Wu(t,this._seed,e)),t,i)}_editAll(e,t,i=!1){if(!this.doc)return;let n=this.doc;for(let t=0;t<pm(n);t++)n=_m(n,this._seed,t,t=>Wu(t,this._seed,e));this._emit(n,t,i)}_select(e,t=!1){this.emitter=e,this.all=t,this.dispatchEvent(new CustomEvent("emitter-change",{detail:{index:e,all:t},bubbles:!0,composed:!0}))}get _multi(){return!!this.doc&&pm(this.doc)>1}_name(e){return this._multi?km(this.doc,this._seed,e):Zn(653)}willUpdate(e){if(e.has("emitter")&&void 0!==e.get("emitter")&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._color=-1,this._chip=0,this._live=""),e.has("doc")){const t=e.get("doc");if(t&&t.id!==this.doc?.id&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._shapes={},this._color=-1,this._chip=0,this._seed=Ru(),this._stats=void 0,this.all=!1,this._live=""),this._p&&!this._p.preset){for(const e of this._sim.shapes)"builtin"in e.shape||(this._shapes={...this._shapes,[qu(e.shape)]:e.shape});const e=Uu(this._sim).length;this._chip>=e&&(this._chip=e-1)}const i=this._p?.colors.length??0;this._color>=i&&(this._color=i-1)}}_preview(){const e=this.doc,t=this._p;if(!e||!t)return{css:""};if(t.preset)return{anim:su({animations:[{id:"pv",preset:t.preset,intensity:t.intensity,duration:`${e.duration}s`,easing:e.easing,iterations:"infinite",direction:e.direction}]}),css:""};const i=Tn(e);if(!i.layer||!i.name)return{css:""};const n=+(e.duration/i.layer.speed).toFixed(3),s=[[i.name,i.layer],...i.split?[[i.split.name,i.split.layer]]:[]].map(([t,i])=>({preset:t,front:i.front,style:`--mc-fx-anim: ${t} ${n}s ${gn(e.easing)} 0s infinite ${e.direction??"normal"}; --mc-fx-dur: ${n}s; --mc-fx-delay: 0s`,particles:i.particles,...i.symbol?{symbol:i.symbol}:{}}));return{css:i.css,anim:{style:"",fx:s}}}updated(e){const t=this.renderRoot.querySelector("style[data-pv]");t&&t.textContent!==this._previewCss&&(t.textContent=this._previewCss),e.has("doc")&&this._scheduleBake(),this._applyModule()}disconnectedCallback(){super.disconnectedCallback(),this._release(),this._bakeToken++}_scheduleBake(){const e=cm(),t=this.doc&&this._p?.sim&&!this._p.preset?dm(this.doc):void 0,i=++this._bakeToken;if(!e||!t)return this._stats=void 0,void(this._baking=!1);this._bakeMs>150&&(this._baking=!0);const n=this.doc;setTimeout(()=>{if(i!==this._bakeToken)return;const s=performance.now();try{this._stats=e.bake({spec:t,period:Ou(n),geometry:yo}).stats}catch{this._stats=void 0}this._bakeMs=performance.now()-s,this._baking=!1},0)}_applyModule(){const e=cm(),t=this.doc&&this._p?.sim&&!this._p.preset?dm(this.doc):void 0,i=[...this.renderRoot.querySelectorAll(".stage .mc-anim-fx")];if(this._applied.some((e,t)=>e!==i[t])&&this._release(),!e||!t||!i.length||this._paused&&"live"===t.sim.mode)return void this._release();const n="function"==typeof matchMedia&&matchMedia(Zn(3)).matches;try{i.forEach((i,s)=>{e.apply(i,{useCss:(e,t)=>{this._liveCss.set(e,t);const i=this.renderRoot.querySelector("style[data-live]");i&&(i.textContent=[...this._liveCss.values()].join("\n"))},reducedMotion:n,content:()=>this.renderRoot.querySelector(".stage-module")??void 0,docId:this.doc.id,spec:t,period:Ou(this.doc),...1===s?{part:1}:{}})}),this._applied=i}catch{}}_release(){for(const e of this._applied)cm()?.release(e);this._applied=[]}_renderPreview(){const{anim:e,css:t}=this._preview();this._previewCss=t;const i=this._p,s=wu(this.doc),a=i.preset?void 0:this._sim,r=a?this._baking?Zn(95):`${this._multi?Zn(1251,{particles:hm(this.doc),emitters:pm(this.doc)}):Zn(1189,{count:i.count,flow:Zn(Mu[a.flow]).toLowerCase()})} · ${"live"===a.mode?Zn(1145):Zn(1255,{seconds:+Ou(this.doc).toFixed(2)})}`:`${s?(0,N.t)(s.name):i.preset} · ${this.doc.duration} s`,o=!!a&&!!this._stats?.capped,l=!!a&&!o&&!!this._stats?.warn,c=!!a&&!!cm();return n.qy`<div class="preview">
      <div class="stage" data-mc-anim-fx ?data-paused=${this._paused} aria-hidden="true">
        <div class="stage-module"><ha-icon icon="mdi:lightbulb-outline"></ha-icon><span>${Zn(446)}</span></div>
        ${e?function(e){return e.fx.some(e=>e.seasonal)&&window.MagicCard?.loadSeasonal?.(),n.qy`${e.fx.map(e=>e.seasonal?n.qy`<mc-seasonal class="mc-anim-seasonal" data-fx=${e.preset} .scenes=${e.seasonal.scenes} .intensity=${e.seasonal.intensity} .seed=${`pv|${e.preset}`}></mc-seasonal>`:e.ring?n.qy`<mc-ring class="mc-anim-ring" data-fx=${e.preset} style=${e.style} .ring=${e.ring}></mc-ring>`:n.qy`<span class="mc-anim-fx" data-fx=${e.preset} ?data-front=${e.front} style=${e.style} aria-hidden="true">${e.particles.map(t=>{return n.qy`<i data-s=${t.shape??n.s6} style="--mc-anim-x: ${t.x}%; --mc-anim-phase: ${t.phase}; --mc-anim-k: ${t.k}${t.style?`; ${t.style}`:""}"
                >${i=t.symbol??e.symbol,i?"icon"in i?n.qy`<ha-icon .icon=${i.icon}></ha-icon>`:i.text:n.s6}</i
              >`;var i})}</span>`)}`}(e):n.s6}
      </div>
      <div class="preview-foot">
        <span class="sum">${r}</span>
        ${o?n.qy`<span class="chip is-warn trimmed">${Zn(1045)}</span>`:n.s6}
        ${c?n.qy`<button type="button" class="icon-btn sm export" aria-label=${Zn(63)} title=${Zn(785)} ?disabled=${this.disabled} @click=${this._openExport}>
              <ha-icon icon="mdi:motion-play-outline"></ha-icon>
            </button>`:n.s6}
        ${a?n.qy`<button type="button" class="icon-btn sm shuffle" aria-label=${Zn(845)} title=${Zn(846)} ?disabled=${this.disabled} @click=${this._shuffle}>
              <ha-icon icon="mdi:dice-5-outline"></ha-icon>
            </button>`:n.s6}
        <button
          type="button"
          class="icon-btn sm pause"
          aria-pressed=${this._paused?"true":"false"}
          aria-label=${Zn(670)}
          title=${this._paused?Zn(690):Zn(670)}
          @click=${()=>this._paused=!this._paused}
        >
          <ha-icon icon=${this._paused?"mdi:play":"mdi:pause"}></ha-icon>
        </button>
      </div>
      ${o?n.qy`<p class="help cap-note">${Zn(1025)}</p>`:n.s6}
      ${l?n.qy`<p class="help cap-note">${Zn(1026)}</p>`:n.s6}
      <p class="help reduced-note">${Zn(726)}</p>
      ${c?n.qy`<mc-anim-svg-dialog .doc=${this.doc}></mc-anim-svg-dialog>`:n.s6}
    </div>`}_cols(e){if(!e||"function"!=typeof getComputedStyle)return 3;const t=getComputedStyle(e).gridTemplateColumns||"",i=/^repeat\((\d+)/.exec(t);return i?+i[1]:t.split(/\s+/).filter(e=>/px$/.test(e)).length||3}_radioKeys(e,t,i,n,s=0){const a=Math.max(0,t.indexOf(i));let r;if("ArrowRight"===e.key)r=a+1;else if("ArrowLeft"===e.key)r=a-1;else if("ArrowDown"===e.key)r=a+(s||1);else if("ArrowUp"===e.key)r=a-(s||1);else if("Home"===e.key)r=0;else{if("End"!==e.key)return;r=t.length-1}e.preventDefault(),r=(r+t.length)%t.length,n(t[r])}_focus(e){this.updateComplete.then(()=>this.renderRoot.querySelector(e)?.focus())}_pickMode(e,t=!1){this.doc&&this._emit(function(e,t,i){return Bu(e,t).mode===i?e:Wu(e,t,e=>({...e,mode:i}))}(this.doc,this._seed,e),Zn("live"===e?1084:1079)),t&&this._focus(`.mode-seg [data-mode="${e}"]`)}_renderMode(e){const t=[["baked",Zn(94),"mdi:repeat"],["live",Zn(443),"mdi:pulse"]];return n.qy`<section class="group" aria-labelledby="h-mode">
      <div class="group-head"><h3 id="h-mode">${Zn(469)}</h3></div>
      <div
        class="seg full mode-seg"
        role="radiogroup"
        aria-label=${Zn(847)}
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
        ${"live"===e.mode?n.qy`<p class="note is-warn live-warning"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${445}</span></p>`:n.qy`<p class="help">${Zn(1006)}</p>`}
      </div>
    </section>`}_chips(){return Uu(this._sim)}_setShapes(e,t,i=!1){this.doc&&this._emit(this._on(t=>function(e,t,i){const n=1===i.length?i[0].shape:void 0;return Iu(e)||i.length&&(!n||"builtin"in n&&"circle"!==n.builtin)?Wu(e,t,e=>({...e,shapes:i.map(e=>({shape:e.shape,weight:e.weight}))})):function(e,t){const i=xu(e,{});return t?i.particles.shape=t:delete i.particles.shape,i}(e,n&&!("builtin"in n)?n:void 0)}(t,this._seed,e)),t,i)}_setChip(e,t,i,n=!1){const s=this._chips().map((i,n)=>n===e?{shape:t,weight:i.weight}:i);this._setShapes(s,i,n)}_shapeFor(e){return zu(e)?{builtin:e}:this._shapes[e]??lu[e]}_pickKind(e,t=!1){const i=this._chips()[this._chip];i&&qu(i.shape)!==e&&(this._svgDraft=void 0,this._emojiDraft=void 0,this._setChip(this._chip,this._shapeFor(e),`Use ${e}`)),t&&this._focus(`.shapes.main [data-kind="${e}"]`)}_addShape(){const e=this._chips();e.length>=Lu||(this._chip=e.length,this._setShapes([...e,{shape:Qu(e),weight:1}],Zn(34)))}_removeShape(e){const t=this._chips();t.length<=1||(this._chip=Math.max(0,Math.min(e,t.length-2)),this._setShapes(t.filter((t,i)=>i!==e),Zn(739)),this._focus(`.schip[data-i="${this._chip}"]`))}_shapeGrid(e,t,i,s){const a=Au.map(e=>e.id),r=e??a[0];return n.qy`<div
      class="shapes ${t}"
      role="radiogroup"
      aria-label=${i}
      @keydown=${e=>this._radioKeys(e,a,r,e=>s(e,!0),this._cols(e.currentTarget))}
    >
      ${Au.map(t=>n.qy`<button
          type="button"
          class="dir shape-tile"
          role="radio"
          data-kind=${t.id}
          aria-checked=${t.id===e?"true":"false"}
          tabindex=${t.id===r?0:-1}
          @click=${()=>s(t.id,!1)}
        >
          ${Ng(t.id)}<span>${Zn(t.label)}</span>
        </button>`)}
    </div>`}_renderShape(){const e=this._chips(),t=Math.min(this._chip,e.length-1),i=e[t],s=qu(i.shape),a=e.length>1,r=e.length>=Lu;return n.qy`<section class="group" aria-labelledby="h-shape">
      <div class="group-head"><h3 id="h-shape">${Zn(830)}</h3></div>
      <div class="schips" role="group" aria-label=${Zn(831)}>
        ${e.map((e,i)=>{return n.qy`<button
            type="button"
            class="schip"
            data-i=${i}
            aria-pressed=${i===t?"true":"false"}
            aria-label=${a?Zn(837,{n:i+1,shape:Eu(e.shape),weight:e.weight}):Zn(836,{n:i+1,shape:Eu(e.shape)})}
            title=${Eu(e.shape)}
            @click=${()=>this._chip=i}
            @keydown=${e=>{"Delete"!==e.key&&"Backspace"!==e.key||!a||(e.preventDefault(),this._removeShape(i))}}
          >
            ${s=e.shape,"emoji"in s?n.qy`<span class="emo" aria-hidden="true">${s.emoji}</span>`:"icon"in s?n.qy`<ha-icon class="glyph" icon=${s.icon}></ha-icon>`:Ng(qu(s))}${a?n.qy`<span>${e.weight}</span>`:n.s6}
          </button>`;var s})}
        <button type="button" class="schip add" aria-label=${Zn(34)} title=${r?Zn(78,{mAX_SHAPES:Lu}):Zn(34)} ?disabled=${r} @click=${()=>this._addShape()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      <div class="chip-edit">
        <div class="chip-edit-head">
          <span>${Zn(835,{n:t+1})}</span>
          ${a?n.qy`<button type="button" class="icon-btn sm danger remove-shape" aria-label=${Zn(740,{n:t+1})} title=${Zn(739)} @click=${()=>this._removeShape(t)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>`:n.s6}
        </div>
        ${this._shapeGrid(s,"main",Zn(835,{n:t+1}),(e,t)=>this._pickKind(e,t))}
        ${"icon"===s?this._renderIcon(i.shape):"emoji"===s?this._renderEmoji(i.shape):"svg"===s?this._renderSvg(i.shape):n.s6}
        ${a?this._renderWeight(e,t):n.s6}
      </div>
      ${a?n.s6:n.qy`<p class="help">${Zn(24)}</p>`}
    </section>`}_renderWeight(e,t){const i=e[t].weight;return n.qy`<div class="field">
      <div class="field-head"><label for="f-weight">${Zn(1101)}</label></div>
      <input
        id="f-weight"
        class="input"
        type="number"
        inputmode="numeric"
        min=${Hu.weight.min}
        max=${Hu.weight.max}
        step="1"
        .value=${P(String(i))}
        aria-describedby="h-weight"
        @change=${n=>{const s=n.target,a=Du("weight",s.value);void 0!==a&&a!==i?(s.value=String(a),this._setShapes(e.map((e,i)=>i===t?{shape:e.shape,weight:a}:e),Zn(148))):s.value=String(i)}}
      />
      <p class="help" id="h-weight">${Zn(21,{percent:Xu(e,t)})}</p>
    </div>`}_renderIcon(e){const t="icon"in e?e.icon:"";return n.qy`<div class="field">
      <div class="field-head"><span class="lbl" id="l-icon">${Zn(391)}</span></div>
      <mc-icon-picker
        .hass=${this.hass}
        .value=${t}
        label=${Zn(649)}
        aria-labelledby="l-icon"
        @value-changed=${e=>{e.stopPropagation();const i=String(e.detail.value??"").trim();(e=>cu.test(e.trim()))(i)&&i!==t&&this._setChip(this._chip,{icon:i},"Change icon")}}
      ></mc-icon-picker>
    </div>`}_renderEmoji(e){const t="emoji"in e?e.emoji:"",i=this._emojiDraft??t,s=void 0!==this._emojiDraft?du(this._emojiDraft):void 0,a=(e,t,i)=>{du(e)||e.trim()===this._lastEmoji()||this._setChip(this._chip,{emoji:e.trim()},t,i)};return n.qy`<div class="field">
      <div class="field-head"><label for="f-emoji">${Zn(311)}</label></div>
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
          @input=${e=>{const t=e.target.value;this._emojiDraft=t,a(t,"Change emoji",!0)}}
          @change=${()=>{void 0===this._emojiDraft||du(this._emojiDraft)||(this._emojiDraft=void 0),this._settle()}}
        />
      </div>
      ${s?n.qy`<p class="help error" id="e-emoji" role="alert">${s}</p>`:n.s6}
      <div class="emoji-grid" role="group" aria-label=${Zn(187)}>
        ${ou.map(e=>n.qy`<button
            type="button"
            aria-pressed=${e===t?"true":"false"}
            aria-label=${Zn(1087,{emoji:e})}
            @click=${()=>{this._emojiDraft=void 0,e!==t&&this._setChip(this._chip,{emoji:e},"Change emoji")}}
          >
            ${e}
          </button>`)}
      </div>
    </div>`}_lastEmoji(){const e=this._chips()[this._chip]?.shape;return e&&"emoji"in e?e.emoji:""}_renderSvg(e){const t="svg"in e?e.svg:"",i=this._svgDraft??t,s=void 0!==this._svgDraft?pu(this._svgDraft):void 0,a=Tn({...this.doc,particles:{...this._p,sim:void 0,shape:{svg:t}}}),r=/mask: (url\("[^"]*"\))/.exec(a.css)?.[1];return n.qy`<div class="field">
      <div class="field-head"><label for="f-svg">${Zn(637)}</label></div>
      <div class="svg-row">
        <textarea
          id="f-svg"
          class="input"
          rows="4"
          spellcheck="false"
          .value=${i}
          aria-invalid=${s?"true":"false"}
          aria-describedby=${s?"e-svg h-svg":"h-svg"}
          @input=${e=>{const i=e.target.value;this._svgDraft=i,pu(i)||i===t||this._setChip(this._chip,{svg:i},"Edit SVG",!0)}}
          @change=${()=>{void 0===this._svgDraft||pu(this._svgDraft)||(this._svgDraft=void 0),this._settle()}}
        ></textarea>
        <span class="svg-thumb" aria-hidden="true" title=${Zn(1004)}>
          ${r?n.qy`<span style=${`-webkit-mask: ${r} center / contain no-repeat; mask: ${r} center / contain no-repeat;`}></span>`:n.s6}
        </span>
      </div>
      ${s?n.qy`<p class="help error" id="e-svg" role="alert">${s}</p>`:n.s6}
      <p class="help" id="h-svg">${Zn(668)}</p>
    </div>`}_pickFlow(e,t=!1){this.doc&&this._sim.flow!==e&&this._emit(this._on(t=>function(e,t,i){return!Iu(e)&&(n=i,Su.has(n))?xu(e,{direction:i}):Wu(e,t,e=>({...e,flow:i}));var n}(t,this._seed,e)),"Change flow"),t&&this._focus(`.dir[data-dir="${e}"]`)}_number(e,t,i,s){const a=bu[e],r="count"===e?Math.min(a.max,i+um(this.doc)):a.max;return n.qy`<input
      id=${t}
      class="input"
      type="number"
      inputmode="decimal"
      min=${a.min}
      max=${r}
      step=${"speed"===e?.1:1}
      .value=${String(i)}
      @change=${t=>{const n=t.target,a=yu(e,n.value),o=void 0===a?void 0:Math.min(a,r);void 0!==o&&o!==i?(n.value=String(o),this._patch({[e]:o},s)):n.value=String(i)}}
    />`}_unit(e,t,i,s,a,r){return n.qy`<mc-unit-field
      .inputId=${t}
      .value=${`${i}${s}`}
      .units=${[s]}
      noCustom
      .label=${a}
      ?disabled=${this.disabled}
      @value-changed=${t=>{t.stopPropagation();const n=String(t.detail.value??""),s=""===n?r:yu(e,n);void 0!==s&&s!==i?this._patch({[e]:s},a):t.target.revert?.()}}
    ></mc-unit-field>`}_range(e,t,i,s,a,r,o={}){const l=o.scale??1,c=[+(s[0]*l).toFixed(2),+(s[1]*l).toFixed(2)],d=Hu[a].step;return n.qy`<div class="field">
      <div class="field-head"><span class="lbl" id=${`l-${e}`}>${t}</span></div>
      <div class="pair" role="group" aria-labelledby=${`l-${e}`}>
        ${[0,1].map(t=>n.qy`<div>
            <label class="sub-lbl" for=${`f-${e}-${t}`}>${Zn(0===t?361:1034)}</label>
            <input
              id=${`f-${e}-${t}`}
              class="input"
              type="number"
              inputmode="decimal"
              min=${Hu[a].min}
              max=${Hu[a].max}
              step=${d}
              aria-label=${Zn(0===t?459:388,{noun:i})}
              .value=${P(String(c[t]))}
              @change=${e=>{const i=e.target,n=Du(a,i.value);if(void 0===n)return void(i.value=String(c[t]));const s=Tu(0===t?[n,c[1]]:[c[0],n]);s[0]!==c[0]||s[1]!==c[1]?r([+(s[0]/l).toFixed(4),+(s[1]/l).toFixed(4)]):i.value=String(c[t])}}
            />
          </div>`)}
      </div>
      ${o.help?n.qy`<p class="help">${o.help}</p>`:n.s6}
    </div>`}_slider(e,t,i,s,a,r={}){return n.qy`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label><span class="val">${s}</span></div>
      <div class="slider">
        <input
          id=${e}
          type="range"
          min="0"
          max="1"
          step=${Hu.unit.step}
          .value=${P(String(i))}
          aria-valuetext=${s}
          ?disabled=${r.disabled}
          @input=${e=>{const t=Du("unit",e.target.value);void 0!==t&&a(t,!0)}}
          @change=${()=>this._settle()}
        />
      </div>
      ${r.help?n.qy`<p class="help">${r.help}</p>`:n.s6}
    </div>`}_renderTiming(e){return n.qy`<section class="group" aria-labelledby="h-timing">
      <div class="group-head"><h3 id="h-timing">${Zn(1033)}</h3></div>
      <div class="field">
        <div class="field-head"><label for="f-speed">${Zn(457)}</label></div>
        ${this._number("speed","f-speed",e.speed,Zn(145))}
      </div>
    </section>`}_renderMovement(e,t,i=!0){return n.qy`<section class="group" aria-labelledby="h-move">
      <div class="group-head"><h3 id="h-move">${Zn(516)}</h3></div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-dir">${Zn(353)}</span></div>
        <div
          class="dirs"
          role="radiogroup"
          aria-labelledby="l-dir"
          @keydown=${e=>this._radioKeys(e,$u,t.flow,e=>this._pickFlow(e,!0),this._cols(e.currentTarget))}
        >
          ${$u.map(e=>n.qy`<button
              type="button"
              class="dir"
              role="radio"
              data-dir=${e}
              aria-checked=${e===t.flow?"true":"false"}
              tabindex=${e===t.flow?0:-1}
              title=${Zn(Mu[e])}
              @click=${()=>this._pickFlow(e)}
            >
              <span class="dir-pv ${e}" aria-hidden="true"><i></i><i></i><i></i></span>
              <span>${Zn(Mu[e])}</span>
            </button>`)}
        </div>
      </div>
      <div class=${i?"pair":""}>
        ${i?n.qy`<div class="field">
              <div class="field-head"><label for="f-speed">${Zn(457)}</label></div>
              ${this._number("speed","f-speed",e.speed,Zn(145))}
            </div>`:n.s6}
        <div class="field">
          <div class="field-head"><label for="f-spread">${s=t.flow,Cu.has(s)?Zn(720):Zn("drift"===s||"wave"===s||"wander"===s?890:889)}</label></div>
          ${this._unit("spread","f-spread",e.spread,"%",Zn(146),100)}
        </div>
      </div>
      ${"rain"===t.flow?this._renderWind(t):n.s6}
      ${this._range("pspeed",Zn(652),Zn(1159),t.ranges.speed,"pspeed",e=>this._editSim(t=>({...t,ranges:{...t.ranges,speed:e}}),"Change particle speed"),{help:Zn(298)})}
    </section>`;var s}_renderWind(e){const t=(i=e.physics.gravity.angle,fu(-(i>180?i-360:i),Hu.wind.min,Hu.wind.max)||0);var i;return n.qy`<div class="field">
      <div class="field-head"><label for="f-wind">${Zn(1106)}</label></div>
      <input
        id="f-wind"
        class="input"
        type="number"
        inputmode="numeric"
        min=${Hu.wind.min}
        max=${Hu.wind.max}
        step=${Hu.wind.step}
        .value=${P(String(t))}
        aria-describedby="h-wind"
        @change=${e=>{const i=e.target,n=Du("wind",i.value);void 0!==n&&n!==t?(i.value=String(n),this._emit(this._on(e=>function(e,t,i){const n=Bu(e,t).physics.gravity;return Yu(e,t,(360-fu(Math.round(i),Hu.wind.min,Hu.wind.max))%360,n.strength>0?n.strength/Pu:.5)}(e,this._seed,n)),"Change wind angle")):i.value=String(t)}}
      />
      <p class="help" id="h-wind">${Zn(558)}</p>
    </div>`}_setSize(e,t,i){const n=this._p,s=""===t?void 0:parseFloat(t);if(void 0===s||!Number.isFinite(s))return void i.revert?.();const a=function(e,t,i){const n=fu(i,bu.size.min,bu.size.max);return 0===t?[n,Math.max(n,e[1])]:[Math.min(e[0],n),n]}(n.size,e,s);a[0]===n.size[0]&&a[1]===n.size[1]?i.revert?.():this._patch({size:a},"Change size")}_renderLook(e,t){return n.qy`<section class="group" aria-labelledby="h-look">
      <div class="group-head"><h3 id="h-look">${Zn(453)}</h3></div>
      <div class="field">
        <div class="field-head"><label for="f-count">${Zn(206)}</label></div>
        ${this._number("count","f-count",e.count,Zn(142))}
        ${this._multi?n.qy`<p class="help count-help">${Zn(1071,{parentsLeft:e.count+um(this.doc),parents:bo.parents})}</p>`:n.s6}
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-size">${Zn(849)}</span></div>
        <div class="pair" role="group" aria-labelledby="l-size">
          ${[0,1].map(t=>n.qy`<div>
              <label class="sub-lbl" for=${`f-size-${t}`}>${Zn(0===t?361:1034)}</label>
              <mc-unit-field
                compact
                .inputId=${`f-size-${t}`}
                .value=${`${e.size[t]}px`}
                .units=${["px"]}
                noCustom
                .label=${Zn(0===t?856:424)}
                ?disabled=${this.disabled}
                @value-changed=${e=>{e.stopPropagation(),this._setSize(t,String(e.detail.value??""),e.target)}}
              ></mc-unit-field>
            </div>`)}
        </div>
      </div>
      ${this._range("opacity",Zn(628),Zn(1154),t.ranges.opacity,"opacity",e=>this._editSim(t=>({...t,ranges:{...t.ranges,opacity:e}}),"Change opacity"),{scale:100})}
      ${this._renderColors(e)}
      <div class="switch-row">
        <span class="txt" id="l-fade">${Zn(332)}<p class="help">${Zn(655)}</p></span>
        <button
          type="button"
          class="switch fade"
          role="switch"
          aria-labelledby="l-fade"
          aria-checked=${e.fade?"true":"false"}
          @click=${()=>this._patch({fade:!e.fade},e.fade?Zn(1051):Zn(1052))}
        ></button>
      </div>
    </section>`}_pickLayer(e,t=!1){if(this.doc&&xm(this.doc,this._em)!==e){const t=this._name(this._em),i=Zn("front"===e?1137:1122);this._live=Zn(1232,{name:t,where:i}),this._emit(function(e,t,i,n){if(!bm(e,i)||xm(e,i)===n)return e;if(1===pm(e))return xu(e,{layer:n});const s=fm(e,t);return s[i].layer=n,vm(e,t,s)}(this.doc,this._seed,this._em,e),`${t} ${i}`)}t&&this._focus(`.layer-seg [data-layer="${e}"]`)}_renderPlacement(){const e=xm(this.doc,this._em);return n.qy`<div class="field placement">
      <div class="field-head"><span class="lbl" id="l-place">${Zn(683)}</span></div>
      <div
        class="seg full layer-seg"
        role="radiogroup"
        aria-label=${Zn(683)}
        @keydown=${t=>this._radioKeys(t,["back","front"],e,e=>this._pickLayer(e,!0))}
      >
        ${["back","front"].map(t=>n.qy`<button type="button" role="radio" data-layer=${t} aria-checked=${e===t?"true":"false"} tabindex=${e===t?0:-1} aria-describedby="h-place" @click=${()=>this._pickLayer(t)}>
            ${Zn("back"===t?97:407)}
          </button>`)}
      </div>
      <p class="help placement-help" id="h-place">${Zn(408)}</p>
      <p class="em-live" role="status">${this._live}</p>
    </div>`}_addColor(){const e=this._p;if(e.colors.length>=Xe)return;const t=Fg.find(t=>!e.colors.includes(t))??Fg[e.colors.length%Fg.length];this._color=e.colors.length,this._patch({colors:[...e.colors,t]},"Add colour")}_removeColor(e){const t=this._p.colors.filter((t,i)=>i!==e);this._color=t.length?Math.min(e,t.length-1):-1,this._patch({colors:t},"Remove colour"),this.updateComplete.then(()=>(this.renderRoot.querySelector(`.cchip[data-i="${this._color}"]`)??this.renderRoot.querySelector(".cchip.add"))?.focus())}_renderColors(e){const t=this._color>=0&&this._color<e.colors.length?this._color:-1,i=e.colors.length>=Xe;return n.qy`<div class="field">
      <div class="field-head">
        <span class="lbl" id="l-colors">${Zn(186)}</span>
        ${e.colors.length?n.qy`<span class="val">${Zn(1197,{count:e.colors.length,colours:Xe})}</span>`:n.s6}
      </div>
      <div class="chips" role="group" aria-labelledby="l-colors">
        ${e.colors.map((e,i)=>{const s=gu(e).startsWith("entity");return n.qy`<button
            type="button"
            class="cchip"
            data-i=${i}
            aria-pressed=${i===t?"true":"false"}
            aria-label=${s?Zn(183,{n:i+1}):Zn(184,{n:i+1,colour:e})}
            title=${s?Zn(317):e}
            @click=${()=>this._color=i===t?-1:i}
            @keydown=${e=>{"Delete"!==e.key&&"Backspace"!==e.key||(e.preventDefault(),this._removeColor(i))}}
          >
            <span style=${`background: ${s?"var(--mc-text-2)":e}`}></span>
            ${s?n.qy`<ha-icon class="ent" icon="mdi:palette-swatch-variant"></ha-icon>`:n.s6}
          </button>`})}
        <button type="button" class="cchip add" aria-label=${Zn(27)} title=${i?Zn(75,{colours:Xe}):Zn(27)} ?disabled=${i} @click=${()=>this._addColor()}>
          <ha-icon icon="mdi:plus"></ha-icon>
        </button>
      </div>
      ${t>=0?n.qy`<div class="color-edit">
            <div class="color-edit-head">
              <span>${Zn(182,{n:t+1})}</span>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${Zn(732,{n:t+1})}
                title=${Zn(730)}
                @click=${()=>this._removeColor(t)}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            <mc-color-picker
              allowEntity
              .label=${Zn(182,{n:t+1})}
              .value=${gu(e.colors[t])}
              @value-changed=${i=>{i.stopPropagation();const n=mu(String(i.detail.value??""));if(!n||n===e.colors[t])return;const s=[...e.colors];s[t]=n,this._patch({colors:s},"Change colour")}}
            ></mc-color-picker>
          </div>`:n.qy`<p class="help">${e.colors.length?Zn(657):Zn(574)}</p>`}
    </div>`}_sector(e,t,i,s,a){const r=!!this._open[e];return n.qy`<div class="sector" data-sector=${e}>
      <button
        type="button"
        class="sector-btn"
        aria-expanded=${r?"true":"false"}
        aria-controls=${r?`sb-${e}`:n.s6}
        @click=${()=>this._open={...this._open,[e]:!r}}
      >
        <ha-icon icon=${t}></ha-icon>
        <span class="nm">${i}<span class="sr-only">, </span><span class="ssum">${s}</span></span>
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${r?n.qy`<div class="sector-body" id=${`sb-${e}`}>${a()}</div>`:n.s6}
    </div>`}_renderVariation(e){const t=this._vdoc;return n.qy`<div class="field">
        <div class="field-head"><label for="f-seed">${Zn(802)}</label></div>
        <div class="seed-row">
          <input
            id="f-seed"
            class="input"
            type="number"
            inputmode="numeric"
            min="0"
            max=${Hu.seed.max}
            step="1"
            .value=${P(String(e.seed))}
            aria-describedby="h-seed"
            @change=${t=>{const i=t.target,n=Du("seed",i.value);void 0===n||n===e.seed&&this._p?.sim?i.value=String(e.seed):this._editSim(e=>({...e,seed:n}),"Change seed")}}
          />
          <button type="button" class="btn btn-secondary btn-sm shuffle-seed" @click=${this._shuffle}><ha-icon icon="mdi:dice-5-outline"></ha-icon>${Zn(845)}</button>
        </div>
        <p class="help" id="h-seed">${Zn(1002)}</p>
      </div>
      ${this._range("spin",Zn(875),Zn(1160),Gu(t,e),"spin",e=>this._emit(this._on(t=>function(e,t,i){const n=Tu(i);if(!Iu(e)&&n[0]===n[1])return xu(e,{spin:n[0]});const s=Ou(e);return Wu(e,t,e=>({...e,ranges:{...e.ranges,spin:[Nu(n[0]/s),Nu(n[1]/s)]}}))}(t,this._seed,e)),"Change spin"),{help:Zn(299)})}
      ${this._range("delay",Zn(899),Zn(1161),e.ranges.delay,"delay",e=>this._editSim(t=>({...t,ranges:{...t.ranges,delay:e}}),"Change start delay"))}
      ${this._range("life",Zn(437),Zn(1144),e.ranges.lifetime,"lifetime",e=>this._editSim(t=>({...t,ranges:{...t.ranges,lifetime:e}}),"Change lifetime"),{help:Zn(12)})}`}_pickGravityAngle(e,t=!1){const i=this._sim,n=i.physics.gravity.strength/Pu;this.doc&&e!==i.physics.gravity.angle&&this._emit(this._on(t=>Yu(t,this._seed,e,n)),"Change gravity direction"),t&&this._focus(`.compass [data-angle="${e}"]`)}_renderPhysics(e){const t=e.physics.gravity,i=+(t.strength/Pu).toFixed(2),s=+(e.physics.drag/3).toFixed(2),a=+(e.physics.turbulence.strength/150).toFixed(2),r=im.map(e=>String(e.angle)),o=im.some(e=>e.angle===t.angle);return n.qy`${this._slider("f-grav",Zn(368),i,i?i.toFixed(2):Zn(587),(e,i)=>this._emit(this._on(i=>Yu(i,this._seed,t.angle,e)),"Change gravity",i))}
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-gdir">${Zn(369)}</span></div>
        <div
          class="seg full compass"
          role="radiogroup"
          aria-labelledby="l-gdir"
          @keydown=${e=>this._radioKeys(e,r,String(t.angle),e=>this._pickGravityAngle(+e,!0))}
        >
          ${im.map((e,i)=>n.qy`<button
              type="button"
              role="radio"
              data-angle=${e.angle}
              aria-checked=${e.angle===t.angle?"true":"false"}
              aria-label=${Zn(e.name)}
              title=${Zn(e.name)}
              tabindex=${e.angle===t.angle||!o&&0===i?0:-1}
              @click=${()=>this._pickGravityAngle(e.angle)}
            >
              <ha-icon icon=${e.icon}></ha-icon>
            </button>`)}
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="f-gangle">${Zn(61)}</label></div>
        <input
          id="f-gangle"
          class="input"
          type="number"
          inputmode="numeric"
          min="0"
          max="359"
          step="1"
          .value=${P(String(t.angle))}
          aria-describedby="h-gangle"
          @change=${e=>{const n=e.target,s=Du("angle",n.value);void 0!==s&&s!==t.angle?this._emit(this._on(e=>Yu(e,this._seed,s,i)),"Change gravity direction"):n.value=String(t.angle)}}
        />
        <p class="help" id="h-gangle">${Zn(8)}</p>
      </div>
      ${this._slider("f-drag",Zn(262),s,s.toFixed(2),(e,t)=>this._editSim(t=>({...t,physics:{...t.physics,drag:+(3*e).toFixed(2)}}),"Change drag",t),{help:Zn(854)})}
      ${this._slider("f-turb",Zn(1047),a,a.toFixed(2),(e,t)=>this._editSim(t=>({...t,physics:{...t.physics,turbulence:{...t.physics.turbulence,strength:+(150*e).toFixed(2)}}}),"Change turbulence",t),{help:Zn(42)})}`}_setCollider(e,t){this._editSim(i=>({...i,colliders:{...i.colliders,..."content"===e?{content:t?"icon":"none"}:{[e]:t}}}),Zn(t?1050:1049))}_renderCollisions(e){const t=e.colliders,i=em(t);return n.qy`<div class="checks" role="group" aria-label=${Zn(177)}>
        ${rm.map(e=>n.qy`<label class="check">
            <input type="checkbox" data-collider=${e.id} .checked=${om(t,e.id)} @change=${t=>this._setCollider(e.id,t.target.checked)} />
            ${Zn(e.label)}
          </label>`)}
      </div>
      ${"none"!==t.content?n.qy`<div class="field">
            <div class="field-head"><span class="lbl">${Zn(193)}</span></div>
            <div
              class="seg full content-seg"
              role="radiogroup"
              aria-label=${Zn(193)}
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
                  ${Zn("icon"===e?391:941)}
                </button>`)}
            </div>
            <p class="help">${Zn(961)}</p>
          </div>`:n.s6}
      ${this._slider("f-bounce",Zn(114),e.physics.bounce,e.physics.bounce.toFixed(2),(e,t)=>this._editAll(t=>({...t,physics:{...t.physics,bounce:e}}),"Change bounce",t),{help:Zn(9),disabled:!i})}`}_child(e,t){this._editSim(t=>t.children?{...t,children:{...t.children,...e}}:t,t)}_renderChildren(e){const t=e.children,i=em(e.colliders),s=n.qy`<div class="switch-row">
      <span class="txt" id="l-children">${Zn(871)}<p class="help">${Zn(154)}</p></span>
      <button
        type="button"
        class="switch children"
        role="switch"
        aria-labelledby="l-children"
        aria-checked=${t?"true":"false"}
        @click=${()=>{t?this._editSim(e=>{const{children:t,...i}=e;return i},"Turn child particles off"):this._editSim(e=>({...e,children:tm(e)}),"Turn child particles on")}}
      ></button>
    </div>`;if(!t)return s;const a=[["collision",Zn(618)],["death",Zn(73)]],r=(e,n=!1)=>{("collision"!==e||i)&&(e!==t.trigger&&this._child({trigger:e,at:void 0},"Change child trigger"),n&&this._focus(`.trigger-seg [data-trigger="${e}"]`))},o=qu(t.shapes[0]?.shape??{builtin:"circle"}),l=!t.colors.length;return n.qy`${s}
      <div class="field">
        <div class="field-head"><span class="lbl" id="l-trigger">${Zn(870)}</span></div>
        <div
          class="seg full trigger-seg"
          role="radiogroup"
          aria-labelledby="l-trigger"
          @keydown=${e=>this._radioKeys(e,i?["collision","death"]:["death"],t.trigger,e=>r(e,!0))}
        >
          ${a.map(([e,s])=>n.qy`<button
              type="button"
              role="radio"
              data-trigger=${e}
              aria-checked=${t.trigger===e?"true":"false"}
              tabindex=${t.trigger===e||"time"===t.trigger&&"death"===e?0:-1}
              ?disabled=${"collision"===e&&!i}
              @click=${()=>r(e)}
            >
              ${s}
            </button>`)}
        </div>
        ${i?n.s6:n.qy`<p class="help">${Zn(1053)}</p>`}
        ${"time"===t.trigger?n.qy`<p class="help">${Zn(872,{seconds:t.at??0})}</p>`:n.s6}
      </div>
      <div class="field">
        <div class="field-head"><label for="f-ccount">${Zn(207)}</label></div>
        <input
          id="f-ccount"
          class="input"
          type="number"
          inputmode="numeric"
          min="1"
          max=${Hu.childCount.max}
          step="1"
          .value=${P(String(t.count))}
          @change=${e=>{const i=e.target,n=Du("childCount",i.value);void 0!==n&&n!==t.count?(i.value=String(n),this._child({count:n},"Change child count")):i.value=String(t.count)}}
        />
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl">${Zn(153)}</span></div>
        ${this._shapeGrid(o,"child",Zn(153),(e,t)=>{if(e!==o){const t=this._sim.shapes.find(t=>qu(t.shape)===e)?.shape;this._child({shapes:[{shape:t??this._shapeFor(e),weight:1}]},"Change child shape")}t&&this._focus(`.shapes.child [data-kind="${e}"]`)})}
      </div>
      ${this._range("csize",Zn(850),Zn(1123),t.size,"childSize",e=>this._child({size:e},"Change child size"))}
      ${this._range("cspeed",Zn(874),Zn(1124),t.ranges.speed,"pspeed",e=>this._child({ranges:{...t.ranges,speed:e}},"Change child speed"))}
      <div class="field">
        <div class="field-head"><label for="f-clife">${Zn(437)}</label></div>
        <input
          id="f-clife"
          class="input"
          type="number"
          inputmode="decimal"
          min=${Hu.childLife.min}
          max=${Hu.childLife.max}
          step="0.1"
          .value=${P(String(t.ranges.lifetime[1]))}
          @change=${e=>{const i=e.target,n=Du("childLife",i.value);void 0===n||n===t.ranges.lifetime[0]&&n===t.ranges.lifetime[1]?i.value=String(t.ranges.lifetime[1]):this._child({ranges:{...t.ranges,lifetime:[n,n]}},"Change child lifetime")}}
        />
      </div>
      <div class="switch-row">
        <span class="txt" id="l-ccolors">${Zn(1085)}</span>
        <button
          type="button"
          class="switch child-colors"
          role="switch"
          aria-labelledby="l-ccolors"
          aria-checked=${l?"true":"false"}
          @click=${()=>this._child({colors:l?[this._p?.colors[0]??"#ffffff"]:[]},Zn(l?638:1085))}
        ></button>
      </div>
      ${l?n.s6:n.qy`<mc-color-picker
            allowEntity
            label=${Zn(150)}
            .value=${gu(t.colors[0])}
            @value-changed=${e=>{e.stopPropagation();const i=mu(String(e.detail.value??""));i&&i!==t.colors[0]&&this._child({colors:[i]},"Change child colour")}}
          ></mc-color-picker>`}`}_renderSectors(e,t){return n.qy`<div class="sectors">
      ${"all"===t?n.s6:this._sector("variation","mdi:dice-multiple-outline",Zn(1098),function(e,t){return Zn(803,{seed:String(t.seed),span:am(Gu(e,t),"°")})}(this._vdoc,e),()=>this._renderVariation(e))}
      ${"all"===t?n.s6:this._sector("physics","mdi:weight",Zn(674),function(e){const{gravity:t,drag:i,turbulence:n}=e.physics,s=t.strength/Pu,a=[s>0?Zn(370,{strength:s.toFixed(1),direction:nm(t.angle)}):Zn(576)];return i>0&&a.push(Zn(1130,{value:sm(i/3)})),n.strength>0&&a.push(Zn(1170,{value:sm(n.strength/150)})),a.join(", ")}(e),()=>this._renderPhysics(e))}
      ${"emitter"===t?n.s6:this._sector("collisions","mdi:arrow-collapse-down",Zn(178),function(e){const t=rm.filter(t=>om(e.colliders,t.id)).map(e=>Zn(e.label));return t.length?Zn(1220,{list:t.join(", "),bounce:sm(e.physics.bounce)}):Zn(616)}(e),()=>this._renderCollisions(e))}
      ${"all"===t?n.s6:this._sector("children","mdi:creation-outline",Zn(151),function(e){const t=e.children;if(!t)return Zn(616);const i=t.shapes[0]?.shape??{builtin:"circle"},n=qu(i),s="svg"===n?Zn(781):"emoji"===n?Zn(1133):Eu(i).toLowerCase();return Zn(1194,{count:t.count,shape:s,trigger:(a=t,"collision"===a.trigger?Zn(1153):"death"===a.trigger?Zn(1120):Zn(1118,{seconds:sm(a.at??0)}))});var a}(e),()=>n.qy`<div class="sector-body-lk" ?inert=${this._locks.kids.length>0}>${this._renderChildren(e)}</div>`)}
    </div>`}_renderPreset(e){const t=wu(this.doc),i=t?((e,t)=>e.particles?.intensity??t.defaults.intensity)(this.doc,t):void 0;return n.qy`<section class="group preset-card" aria-labelledby="h-preset">
      <div class="preset-name">
        <span class="tile" aria-hidden="true"><ha-icon icon="mdi:shimmer"></ha-icon></span>
        <span class="txt">
          <strong id="h-preset">${t?(0,N.t)(t.name):e.preset}</strong>
          <span class="kind">${t?Zn(96,{kind:_u(t).toLowerCase()}):Zn(1063)}</span>
        </span>
      </div>
      ${t?n.qy`<div class="field">
            <div class="field-head"><label for="f-intensity">${((e,t)=>e.intensity.unit?`${t(e.intensity.label)} (${e.intensity.unit})`:t(e.intensity.label))(t,Zn)}</label></div>
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
              @change=${i=>{const n=i.target.value,s=function(e,t,i){return void 0!==i&&Number.isFinite(i)?xu(e,{intensity:fu(i,t.intensity.min,t.intensity.max)}):xu(e,{intensity:void 0})}(this.doc,t,""===n?void 0:Number(n));s.particles.intensity!==e.intensity?this._emit(s,"Change intensity"):i.target.value=void 0===e.intensity?"":String(e.intensity)}}
            />
            <p class="help">${Zn(98,{min:t.intensity.min,max:t.intensity.max,intensity:t.defaults.intensity})}</p>
          </div>`:n.qy`<p class="help error">${Zn(1029)}</p>`}
      <button type="button" class="btn btn-secondary btn-sm convert" @click=${this._convert}>
        <ha-icon icon="mdi:creation-outline"></ha-icon>${Zn(195)}
      </button>
      <p class="help">
        ${Zn(935)}
        ${!t||"count"!==t.particles||t.ring||t.seasonal?Zn(1014):Zn(982)}
      </p>
    </section>`}get _locks(){const e=this.doc,t=this.layerView;if(!e||!t?.locked.length)return{own:[],kids:[]};const i=e.particles?.sim?Jr(e):["main"],n=this.all&&i.length>1?i:[i[Math.min(this._em,i.length-1)]??"main"];return{own:n.filter(i=>ro(e,t,`emitter:${i}`)).map(e=>`emitter:${e}`),kids:n.filter(i=>ro(e,t,`children:${i}`)).map(e=>`children:${e}`)}}render(){const e=this._p;if(!this.doc||!e)return n.qy`<div class="empty"><ha-icon icon="mdi:shimmer"></ha-icon><p>${Zn(630)}</p></div>`;const t=e.preset?void 0:this._sim;return n.qy`<style data-pv></style>
      <style data-live></style>
      <div class="wrap">
        ${this._renderPreview()}
        <div class="form" ?inert=${this.disabled} @focusout=${this._onFocusOut}>
          ${this._locks.own.length?go(this.doc,this.layerView,this._locks.own):n.s6}
          ${t?this._renderForm(e,t):n.qy`<div class="lk" ?inert=${this._locks.own.length>0}>${this._renderPreset(e)}</div>`}
        </div>
      </div>`}_renderForm(e,t){const i=this._multi,s=i&&this.all;return n.qy`${this._renderBar()}
      <div class="lk" ?inert=${this._locks.own.length>0}>
      ${s?n.qy`<p class="help all-note">${Zn(1013)}</p>
            ${this._renderMode(t)}${this._renderTiming(e)}${this._renderSectors(t,"all")}`:n.qy`${i?this._renderEmitterHead():n.s6}${this._renderPlacement()}
            ${i?n.s6:this._renderMode(t)}${this._renderShape()}${this._renderMovement(e,t,!i)}${this._renderLook(e,t)}${this._renderSectors(t,i?"emitter":void 0)}`}
      </div>`}_renderBar(){const e=this.doc,t=pm(e),i=mm(e),s=this.all?"all":String(this._em),a=["all",...Array.from({length:t},(e,t)=>String(t))];return n.qy`<div class="em-bar">
      ${t>1?n.qy`<div class="em-tabs">${Cd({role:"tablist",label:Zn(309),value:s,items:a.map(e=>({value:e,label:"all"===e?Zn(48):this._name(+e)})),onChange:e=>{"all"===e?this._select(this._em,!0):this._select(+e),this._focus(`.em-tabs [data-val="${e}"]`)}})}</div>`:n.s6}
      <button type="button" class="btn btn-secondary btn-sm em-add" ?disabled=${!i||this.disabled} aria-describedby=${i?n.s6:"h-em-cap"} @click=${this._addEmitter}>
        <ha-icon icon="mdi:plus"></ha-icon>${Zn(28)}
      </button>
      ${i?n.s6:n.qy`<p class="help em-cap" id="h-em-cap">${t>=bo.emitters?Zn(77,{emitters:bo.emitters}):Zn(575)}</p>`}
    </div>`}_renderEmitterHead(){const e=this._em,t=this.doc.particles.sim,i=(0===e?t.name:t.emitters?.[e-1]?.name)??"";return n.qy`<div class="em-head">
      <div class="field em-name-field">
        <div class="field-head"><label for="f-em-name">${Zn(308)}</label></div>
        <input
          id="f-em-name"
          class="input em-name"
          type="text"
          maxlength=${40}
          placeholder=${km(this.doc,this._seed,e)}
          .value=${P(i)}
          @change=${t=>{const i=t.target,n=ym(this.doc,this._seed,e,i.value);i.value=(0===e?n.particles.sim.name:n.particles.sim.emitters?.[e-1]?.name)??"",this._emit(n,"Rename emitter")}}
        />
      </div>
      <button type="button" class="icon-btn sm em-dup" aria-label=${Zn(291)} title=${Zn(291)} ?disabled=${!mm(this.doc)||this.disabled} @click=${this._dupEmitter}>
        <ha-icon icon="mdi:content-copy"></ha-icon>
      </button>
      <button type="button" class="icon-btn sm danger em-remove" aria-label=${Zn(734)} title=${Zn(734)} ?disabled=${this.disabled} @click=${this._removeEmitter}>
        <ha-icon icon="mdi:delete-outline"></ha-icon>
      </button>
    </div>`}};Bg.styles=[Wp,xh,mo,n.AH`
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
    `],Og([(0,s.MZ)({attribute:!1})],Bg.prototype,"doc",void 0),Og([(0,s.MZ)({attribute:!1})],Bg.prototype,"hass",void 0),Og([(0,s.MZ)({attribute:!1})],Bg.prototype,"library",void 0),Og([(0,s.MZ)({attribute:!1})],Bg.prototype,"time",void 0),Og([(0,s.MZ)({type:Boolean,reflect:!0})],Bg.prototype,"disabled",void 0),Og([(0,s.MZ)({attribute:!1})],Bg.prototype,"layerView",void 0),Og([(0,s.MZ)({type:Number})],Bg.prototype,"emitter",void 0),Og([(0,s.wk)()],Bg.prototype,"_shapes",void 0),Og([(0,s.wk)()],Bg.prototype,"_svgDraft",void 0),Og([(0,s.wk)()],Bg.prototype,"_emojiDraft",void 0),Og([(0,s.wk)()],Bg.prototype,"_color",void 0),Og([(0,s.wk)()],Bg.prototype,"_chip",void 0),Og([(0,s.wk)()],Bg.prototype,"_paused",void 0),Og([(0,s.wk)()],Bg.prototype,"_open",void 0),Og([(0,s.wk)()],Bg.prototype,"_stats",void 0),Og([(0,s.wk)()],Bg.prototype,"_baking",void 0),Og([(0,s.MZ)({type:Boolean})],Bg.prototype,"all",void 0),Og([(0,s.wk)()],Bg.prototype,"_live",void 0),Bg=Og([(0,s.EM)("mc-anim-particles-editor")],Bg);var Ig=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Zg=[{value:"element",label:306,icon:"mdi:square-rounded-outline"},{value:"icon",label:391,icon:"mdi:star-outline"},{value:"particles",label:653,icon:"mdi:scatter-plot-outline"}],Kg=[{value:"percent",label:2},{value:"px",label:682}],Wg={count:3,size:[6,12],colors:[]},Ug={d:"",units:"percent",follow_rotation:!1,subject:"element"},Gg=new Map;let Yg=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1}get _spec(){return this.doc?.path??Ug}_locked(e){return!!this.layerView?.locked.includes(e)}_emit(e,t){if(!this.doc||this.disabled)return;const i={...this.doc,path:e};this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:i,label:t}}))}_set(e,t){this._emit({...this._spec,...e},t)}_edit(e,t){this._set({d:or(e(rr(this._spec.d)))},t)}_template(e,t){const i=this._spec;this._set({d:gr(e,fr({subject:i.subject,units:"percent"})),units:"percent"},`Use ${t.toLowerCase()} path`)}_subject(e){const t=this._spec;if(e===t.subject)return;const i={subject:e},n="particles"===t.subject,s="particles"===e;if("percent"===t.units&&n!==s&&t.d){const e=s?50:-50;i.d=or(dr(rr(t.d),e,e))}s&&!t.particles&&(i.particles={...Wg,size:[...Wg.size],colors:[]}),this._set(i,"What moves")}_look(e,t){const i=this._spec.particles??Wg;this._set({particles:{...i,size:[...i.size],colors:[...i.colors],...e}},t)}_seg(e,t,i,s){return n.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=t.findIndex(e=>e.value===i),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const r=t[(n+a[e.key]+t.length)%t.length].value,o=e.currentTarget;s(r),requestAnimationFrame(()=>o.querySelector(`[data-val="${r}"]`)?.focus())}}>
      ${t.map(e=>{const t=e.value===i;return n.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${t?"true":"false"}
          tabindex=${t?"0":"-1"}
          ?disabled=${this.disabled}
          @click=${()=>s(e.value)}
        >
          ${e.icon?n.qy`<ha-icon icon=${e.icon}></ha-icon>`:n.s6}${Zn(e.label)}
        </button>`})}
    </div>`}_switch(e,t,i,s,a,r=!1){return n.qy`<div class="switch-row">
      <div class="txt">
        <span class="lbl">${e}</span>
        <p class="help">${t}</p>
      </div>
      <button
        type="button"
        class="switch ${a}"
        role="switch"
        aria-checked=${i?"true":"false"}
        aria-label=${e}
        ?disabled=${this.disabled||r}
        @click=${s}
      ></button>
    </div>`}_templates(){return n.qy`<div class="tiles">
      ${ur.map(e=>{const t=function(e){let t=Gg.get(e);if(!t){const i=gr(e),n=lr(rr(i))??{x:-40,y:-40,w:80,h:80},s=6;let a=n.w+2*s,r=n.h+2*s;const o=44/30;a/r<o?a=r*o:r=a/o;const l=n.x+n.w/2,c=n.y+n.h/2;t={d:i,box:`${(l-a/2).toFixed(2)} ${(c-r/2).toFixed(2)} ${a.toFixed(2)} ${r.toFixed(2)}`},Gg.set(e,t)}return t}(e.id),i=rr(t.d).anchors[0];return n.qy`<button
          type="button"
          class="tile"
          data-template=${e.id}
          title=${Zn(753,{name:Zn(e.label).toLowerCase()})}
          ?disabled=${this.disabled}
          @click=${()=>this._template(e.id,Zn(e.label))}
        >
          <svg viewBox=${t.box} aria-hidden="true">
            <path d=${t.d}></path>
            ${i?n.JW`<circle cx=${i.x} cy=${i.y} r=${t.box.split(" ").map(Number)[2]/18}></circle>`:n.s6}
          </svg>
          <span>${Zn(e.label)}</span>
        </button>`})}
    </div>`}_pathSection(e){const t=e.anchors.length,i=e.anchors.filter(e=>e.in||e.out).length,s=t>1&&!this.disabled;return n.qy`<section class="sec" aria-label=${Zn(665)}><div class="lk-path" ?inert=${this._locked("path")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${Zn(900)}</span></div>
        ${this._templates()}
      </div>
      <div class="stats" aria-live="polite">
        <span class="chip">${Zn(1190,{count:t})}</span>
        <span class="chip">${e.closed?Zn(173):Zn(629)}</span>
        ${t>1?n.qy`<span class="chip">${Zn(0===i?928:i===t?216:468)}</span>`:n.s6}
      </div>
      <div class="actions">
        <button type="button" class="btn btn-secondary btn-sm smooth-all" ?disabled=${!s} @click=${()=>this._edit(ar.smoothAll,"Smooth all points")}>
          <ha-icon icon="mdi:vector-curve"></ha-icon>${Zn(858)}
        </button>
        <button type="button" class="btn btn-secondary btn-sm straighten-all" ?disabled=${!s} @click=${()=>this._edit(ar.straightenAll,"Straighten all points")}>
          <ha-icon icon="mdi:vector-polyline"></ha-icon>${Zn(929)}
        </button>
        <button type="button" class="btn btn-secondary btn-sm reverse" ?disabled=${!s} @click=${()=>this._edit(cr,"Reverse direction")}>
          <ha-icon icon="mdi:swap-horizontal"></ha-icon>${Zn(765)}
        </button>
      </div>
      ${this._switch(Zn(174),Zn(985),e.closed,()=>{t>1&&this._edit(t=>(0,ar.setClosed)(t,!e.closed),e.closed?Zn(631):Zn(172))},"closed-switch",t<2)}
      <ul class="tips help">
        <li>${Zn(166)}</li>
        <li>${Zn(264)} ${Wn(1206,{key:n.qy`<kbd>Alt</kbd>`})}</li>
        <li>${Zn(259)} ${Wn(1207,{key:n.qy`<kbd>${Zn(233)}</kbd>`})}</li>
        <li>${"px"===this._spec.units?Wn(703,{key:n.qy`<kbd>Shift</kbd>`}):Wn(704,{key:n.qy`<kbd>Shift</kbd>`})}</li>
      </ul>
      <div class="foot">
        <button type="button" class="btn btn-text btn-sm btn-danger clear" ?disabled=${0===t||this.disabled} @click=${()=>this._set({d:""},"Clear path")}>
          <ha-icon icon="mdi:eraser"></ha-icon>${Zn(161)}
        </button>
      </div>
    </div></section>`}_motionSection(){const e=this._spec;return n.qy`<section class="sec" aria-labelledby="pe-motion">
      <h3 id="pe-motion">${Zn(473)}</h3>
      <div class="lk-subject" ?inert=${this._locked("subject")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${Zn(1102)}</span></div>
        ${this._seg(Zn(1102),Zg,e.subject,e=>this._subject(e))}
        <p class="help">
          ${"particles"===e.subject?Zn(658):"icon"===e.subject?Zn(984):Zn(1011)}
        </p>
      </div>
      </div>
      <div class="lk-path" ?inert=${this._locked("path")}>
      <div class="field">
        <div class="field-head"><span class="lbl">${Zn(1062)}</span></div>
        ${this._seg(Zn(1062),Kg,e.units,e=>this._set({units:e},"Units"))}
        <p class="help">${"percent"===e.units?Zn(699):Zn(700)}</p>
      </div>
      ${this._switch(Zn(356),Zn(1054),e.follow_rotation,()=>this._set({follow_rotation:!e.follow_rotation},"Follow rotation"),"follow-switch")}
      </div>
    </section>`}_particlesSection(){const e=this._spec.particles??Wg,[t,i]=e.size,s=(s,a,r)=>n.qy`<div class="field">
      <div class="field-head"><span class="lbl">${a}</span></div>
      <mc-unit-field
        .value=${`${e.size[s]}px`}
        .label=${a}
        .units=${["px"]}
        .noCustom=${!0}
        .inputId=${r}
        .disabled=${this.disabled}
        @value-changed=${e=>{e.stopPropagation();const n=parseFloat(String(e.detail.value));if(!Number.isFinite(n))return;const a=Math.min(200,Math.max(1,Math.round(n))),r=0===s?[a,Math.max(a,i)]:[Math.min(t,a),a];this._look({size:r},"Particle size")}}
      ></mc-unit-field>
    </div>`;return n.qy`<section class="sec particles" aria-labelledby="pe-particles">
      <h3 id="pe-particles">${Zn(653)}</h3>
      <div class="field">
        <div class="field-head"><label for="pe-count">${Zn(206)}</label></div>
        <input
          class="input"
          id="pe-count"
          type="number"
          min="1"
          max=${Je}
          step="1"
          inputmode="numeric"
          .value=${String(e.count)}
          ?disabled=${this.disabled}
          @input=${e=>{const t=e.target.value,i=Number(t);""!==t.trim()&&Number.isInteger(i)&&i>=1&&i<=Je&&this._look({count:i},"Particle count")}}
        />
        <p class="help">${Zn(868,{particles:Je})}</p>
      </div>
      <div class="pair">${s(0,Zn(855),"pe-size-min")} ${s(1,Zn(423),"pe-size-max")}</div>
      <div class="field">
        <div class="field-head"><span class="lbl">${Zn(186)}</span></div>
        <div class="colors">
          ${e.colors.map((t,i)=>n.qy`<div class="color-row">
              <mc-color-picker
                .value=${t}
                .label=${Zn(181,{i:i+1})}
                @value-changed=${t=>{t.stopPropagation();const n=String(t.detail.value??"").trim();if(!n)return;const s=[...e.colors];s[i]=n,this._look({colors:s},"Particle colour")}}
              ></mc-color-picker>
              <button
                type="button"
                class="icon-btn sm danger remove-color"
                aria-label=${Zn(731,{i:i+1})}
                title=${Zn(730)}
                ?disabled=${this.disabled}
                @click=${()=>this._look({colors:e.colors.filter((e,t)=>t!==i)},"Remove particle colour")}
              >
                <ha-icon icon="mdi:close"></ha-icon>
              </button>
            </div>`)}
        </div>
        ${e.colors.length?n.s6:n.qy`<p class="help">${Zn(588)}</p>`}
        ${e.colors.length<Xe?n.qy`<div>
              <button
                type="button"
                class="btn btn-text btn-sm add-color"
                ?disabled=${this.disabled}
                @click=${()=>this._look({colors:[...e.colors,e.colors[e.colors.length-1]??"#ffc107"]},"Add particle colour")}
              >
                <ha-icon icon="mdi:plus"></ha-icon>${Zn(27)}
              </button>
            </div>`:n.s6}
      </div>
    </section>`}render(){const e=rr(this._spec.d),t=["path","subject"].filter(e=>this._locked(e));return n.qy`<div class="ed">
      ${t.length?go(this.doc,this.layerView,t):n.s6}
      ${this._pathSection(e)} ${this._motionSection()} ${"particles"===this._spec.subject?n.qy`<div class="lk-path" ?inert=${this._locked("path")}>${this._particlesSection()}</div>`:n.s6}
    </div>`}};function Jg(){return i.e(575).then(()=>i(9474)).then(e=>e,e=>{console.warn("Magic Card: path canvas not loaded",e)})}Yg.styles=[Wp,mo,n.AH`
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
    `],Ig([(0,s.MZ)({attribute:!1})],Yg.prototype,"doc",void 0),Ig([(0,s.MZ)({attribute:!1})],Yg.prototype,"hass",void 0),Ig([(0,s.MZ)({attribute:!1})],Yg.prototype,"library",void 0),Ig([(0,s.MZ)({type:Number})],Yg.prototype,"time",void 0),Ig([(0,s.MZ)({type:Boolean,reflect:!0})],Yg.prototype,"disabled",void 0),Ig([(0,s.MZ)({attribute:!1})],Yg.prototype,"layerView",void 0),Yg=Ig([(0,s.EM)("mc-anim-path-editor")],Yg);var Xg=i(3706);let Qg=Date.now();const ef={"Add point":31,"Move point":493,"Move points":494,"Move path":490,"Move handle":488,"Delete point":241,"Delete points":242,"Delete handle":238,"Close path":172,"Change point type":144},tf=e=>ef[e]?Zn(ef[e]):e;function nf(e,t){const i=e?.screen;if(!(e&&i&&e.scale>0))return;const n=e.scale;return{left:i.left+t.x*n,top:i.top+t.y*n,width:t.width*n,height:t.height*n}}class sf extends n.WF{constructor(){super(...arguments),this.canvasState="idle",this._again=!1}ensureCanvas(){if("idle"!==this.canvasState||this._loading)return;this.canvasState="loading";const e=this._again;this._again=!1,this._loading=(e?function(){const e=i,t=e.u,n=++Qg;e.u=e=>{const i=t(e);return`${i}${i.includes("?")?"&":"?"}r=${n}`};try{return Jg()}finally{e.u=t}}():Jg()).then(t=>{this._loading=void 0,t?(()=>{const e="undefined"==typeof customElements?void 0:customElements.get(Xg.eo);return(e?.contractRevision??0)>=8})()?(this.chunk=t,this.canvasState="ready",e&&this.updateComplete.then(()=>this.toolsReady())):this.canvasState="old":this.canvasState="failed"})}retry(){this._again=!0,this.canvasState="idle",this.ensureCanvas()}toolsReady(){}_reload(){confirm(Zn(728))&&location.reload()}renderNotice(){return"failed"===this.canvasState?n.qy`<p class="host-notice" role="alert">${Zn(205)}<button type="button" @click=${()=>this.retry()}>${Zn(1046)}</button></p>`:"old"===this.canvasState?n.qy`<p class="host-notice" role="alert">
        ${Zn(965)}<button type="button" @click=${()=>this._reload()}>${Zn(727)}</button>
      </p>`:n.s6}}sf.styles=n.AH`
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
  `,function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);a>3&&r&&Object.defineProperty(t,i,r)}([(0,s.wk)()],sf.prototype,"canvasState",void 0);var af=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const rf=[],of=new Map,lf=(e,t)=>Object.entries(e).every(([e,i])=>Math.abs(t[e]-i)<.005);let cf=class extends sf{constructor(){super(...arguments),this.time=0,this.disabled=!1,this._live={anchors:[],closed:!1},this._list=[],this._path={anchors:[],closed:!1},this._announce="",this._onChange=e=>{e.stopPropagation();const t=e.detail,i=t.paths;if(this._setLive(i[0]??{anchors:[],closed:!1}),!t.commit||!this.doc)return;const n=or(this._live);this._path=this._live,this._d=n;const s=tf(t.label),a={...this.doc,path:{...this.doc.path??{units:"percent",follow_rotation:!1,subject:"element"},d:n}};this._announce=s,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:a,label:s}}))}}willUpdate(e){if(e.has("doc")){const e=this.doc?.path?.d??"";e!==this._d&&(this._path=rr(e),this._d=e,this._setLive(this._path))}"path"===this.doc?.kind&&this.ensureCanvas()}_setLive(e){this._live=e,this._list=e.anchors.length?[e]:[]}_geometry(){const e=this.doc?.path,t=this.stage,i=t?.rect.width??0,n=t?.rect.height??0;if(!(t&&e&&i>0&&n>0))return;const s="px"===e.units,a=this.stage?.subject??this.subjectRect,r="particles"===e.subject,o=!r&&a&&a.width>0&&a.height>0?a:{x:0,y:0,width:i,height:n},l=nf(t,o);if(!l)return;const c=s?o.width:100,d=s?o.height:100,p=r?{x:0,y:0,w:c,h:d}:{x:-c/2,y:-d/2,w:c,h:d},h=s?"px":"%",u=(e=>"px"===e?10:5)(e.units),m=this._geo;return m&&m.units===h&&m.step===u&&lf(m.frame,p)&&lf(m.place,l)?m:this._geo={frame:p,place:l,units:h,step:u}}_px(e,t){return[e.place.left+(t[0]-e.frame.x)*e.place.width/e.frame.w,e.place.top+(t[1]-e.frame.y)*e.place.height/e.frame.h]}toolsReady(){this._announce=Zn(964),this.renderRoot.querySelector("mc-path-canvas")?.focus({preventScroll:!0})}_mapD(e){const t=t=>this._px(e,t);return or({closed:this._path.closed,anchors:this._path.anchors.map(e=>{const[i,n]=t([e.x,e.y]);return{...e,x:i,y:n,in:e.in?t(e.in):void 0,out:e.out?t(e.out):void 0}})})}_arrows(e){const t=this._d??"";return this._path.anchors.length<2||!t?[]:[.25,.5,.75].map(i=>{const s=hr(t,i-.01),a=hr(t,i+.01),r=hr(t,i);if(!s||!a||!r)return n.JW``;const o=this._px(e,[s.x,s.y]),l=this._px(e,[a.x,a.y]),c=this._px(e,[r.x,r.y]);if(Math.hypot(l[0]-o[0],l[1]-o[1])<.5)return n.JW``;const d=180*Math.atan2(l[1]-o[1],l[0]-o[0])/Math.PI;return n.JW`<path class="arrow" d="M-4 -4 L4 0 L-4 4 Z" transform="translate(${c[0].toFixed(1)} ${c[1].toFixed(1)}) rotate(${d.toFixed(1)})"></path>`})}_dot(e,t,i,s,a){const r=hr(t,i);if(!r)return n.s6;const[o,l]=this._px(e,[r.x,r.y]);let c=n.s6;if(s){const s=hr(t,Math.max(0,i-.005)),a=hr(t,Math.min(1,i+.005));if(s&&a){const t=this._px(e,[s.x,s.y]),i=this._px(e,[a.x,a.y]),r=180*Math.atan2(i[1]-t[1],i[0]-t[0])/Math.PI;c=n.JW`<path class="heading" d="M10 -4 L17 0 L10 4 Z" transform="rotate(${r.toFixed(1)})"></path>`}}return n.JW`<g class="subject" data-k=${a} transform="translate(${o.toFixed(1)} ${l.toFixed(1)})">
      <circle class="body" r="9"></circle><circle class="core" r="2.5"></circle>${c}
    </g>`}_subject(e){const t=this._d??"";if(this._path.anchors.length<2)return n.s6;const i=this.doc?.path,s=!!i?.follow_rotation,a=Math.min(1,Math.max(0,Number.isFinite(this.time)?this.time:0)),r="particles"===i?.subject?Math.min(60,Math.max(1,i.particles?.count??3)):1;return Array.from({length:r},(i,n)=>this._dot(e,t,0===n?a:(a+n/r)%1,s,n))}render(){const e=this._geometry();if(!e)return n.qy`${this.renderNotice()}`;const t=this._path.anchors.length,i=this._mapD(e),s=this._px(e,[0,0]),a=t>1?this._px(e,[this._path.anchors[0].x,this._path.anchors[0].y]):void 0,r="ready"===this.canvasState;return n.qy`
      <svg class="layer decor" aria-hidden="true">
        <path class="origin" d="M${s[0]-6} ${s[1]}h12M${s[0]} ${s[1]-6}v12"></path>
        ${i&&t>1?n.JW`<path class="line" d=${i}></path>`:n.s6} ${this._arrows(e)} ${this._subject(e)}
        ${a?n.JW`<text class="tag" x=${a[0]+10} y=${a[1]-9}>${Zn(897)}</text>`:n.s6}
      </svg>
      ${r?n.qy`<mc-path-canvas
            overlay
            .placement=${e.place}
            .frame=${e.frame}
            .units=${e.units}
            .paths=${this._list}
            .paint=${rf}
            .mode=${this.disabled?"view":this._live.closed?"nodes":"add"}
            .maxPaths=${1}
            .gridStep=${e.step}
            .snap=${(e=>{let t=of.get(e);return t||of.set(e,t={enabled:!0,grid:e,anchors:!1,frame:!1}),t})(e.step)}
            .nudge=${1}
            .bigNudge=${e.step}
            .fineNudge=${.1}
            aria-label=${Zn(475)}
            @mc-path-change=${this._onChange}
          ></mc-path-canvas>`:n.s6}
      ${0===t&&r&&!this.disabled?n.qy`<p class="hint">${Zn(169)}</p>`:1===t&&r&&!this.disabled?n.qy`<p class="hint">${Zn(168)}</p>`:n.s6}
      ${this.renderNotice()}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
    `}};cf.styles=[sf.styles,n.AH`
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
    `],af([(0,s.MZ)({attribute:!1})],cf.prototype,"doc",void 0),af([(0,s.MZ)({type:Number})],cf.prototype,"time",void 0),af([(0,s.MZ)({type:Boolean,reflect:!0})],cf.prototype,"disabled",void 0),af([(0,s.MZ)({attribute:!1})],cf.prototype,"stage",void 0),af([(0,s.MZ)({attribute:!1})],cf.prototype,"subjectRect",void 0),af([(0,s.MZ)({attribute:!1})],cf.prototype,"hass",void 0),af([(0,s.MZ)({attribute:!1})],cf.prototype,"library",void 0),af([(0,s.wk)()],cf.prototype,"_live",void 0),af([(0,s.wk)()],cf.prototype,"_path",void 0),af([(0,s.wk)()],cf.prototype,"_announce",void 0),cf=af([(0,s.EM)("mc-anim-path-host")],cf);const df=e=>Math.round(1e3*e)/1e3;function pf(e){return!!e&&("keyframes"===e.kind||"path"===e.kind&&"particles"!==e.path?.subject)}function hf(e){if(!e)return;const t=parseFloat(e);return Number.isFinite(t)?/ms\s*$/i.test(e)?t/1e3:t:void 0}function uf(e,t,i){const n=(e??"").trim();if(!n)return{status:"invalid",name:Zn(568),kind:"",problem:Zn(675)};if(Ke(n)){const e=We(n);if(i&&e===i)return{status:"invalid",name:e,kind:Zn(816),problem:Zn(17)};const s=t?.[e];if(!s)return{status:"missing",name:e,kind:"",problem:Zn(599)};if("keyframes"===s.kind)return{status:"ok",name:s.name||e,kind:Zn(420),defaultDuration:s.duration};if("path"===s.kind)return pf(s)?{status:"ok",name:s.name||e,kind:Zn(665),defaultDuration:s.duration}:{status:"invalid",name:s.name||e,kind:Zn(665),problem:Zn(654)};const a="particles"===s.kind?Zn(653):Zn(816);return{status:"invalid",name:s.name||e,kind:a,problem:Zn(1208,{kind:a})}}const s=te(n);return s?dt.has(s.id)?{status:"ok",name:(0,N.t)(s.name),kind:Zn(707),defaultDuration:hf(s.defaults.duration)}:{status:"invalid",name:(0,N.t)(s.name),kind:Zn(707),problem:Zn(305)}:{status:"missing",name:n,kind:Zn(707),problem:Zn(1064)}}function mf(e,t,i){const n=[...e];if(t<0||t>=n.length||i<0||i>=n.length||t===i)return n;const[s]=n.splice(t,1);return n.splice(i,0,s),n}function gf(e){return`${df(e).toFixed(2).replace(/\.?0+$/,"")} s`}const ff={keyframes:"mdi:chart-bell-curve-cumulative",path:"mdi:vector-curve"},vf=e=>(e?.length??0)<20;var bf=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};function yf(e){const t=String(e??"").trim();if(!t)return;const i=parseFloat(t);return Number.isFinite(i)?/ms$/i.test(t)?i/1e3:i:void 0}const xf=(e,t,i)=>Math.min(i,Math.max(t,e)),wf=e=>Math.round(1e3*e)/1e3;let _f=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this._open=-1,this._query="",this._announce="",this._pick=null,this._trigger=null,this._focusSearch=!1,this._onDragKey=e=>{"Escape"===e.key&&this._drag&&(e.preventDefault(),e.stopPropagation(),this._cancelDrag())}}get _steps(){return this.doc?.steps??[]}_emit(e,t,i=!1){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_remap(e){const t=this.layerView,i=t&&e(t);i&&i!==t&&this.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:i},bubbles:!0,composed:!0}))}_writeSteps(e,t,i=!1){this.doc&&this._emit({...this.doc,steps:e},t,i)}_patchStep(e,t,i){const n=this._steps.map((i,n)=>{if(n!==e)return i;const s={...i,...t};return void 0===t.duration&&"duration"in t&&delete s.duration,s});this._writeSteps(n,i)}_addStep(e){if(!vf(this._steps))return;const t=[...this._steps,{animation:e,delay:0,repeat:1}];this._open=t.length-1,this._focusAfter={index:t.length-1,part:"toggle"},this._writeSteps(t,"Add step"),this._announce=Zn(919,{count:t.length,name:uf(e,this.library,this.doc?.id).name})}_locked(e,t=!1){const i=!!this.layerView?.locked.includes(`step:${e}`);return i&&t&&(this._announce=Zn(924,{i:e+1})),i}_deleteStep(e){if(this._steps.length<=1||this._locked(e,!0))return;const t=this._steps.filter((t,i)=>i!==e);this._open===e?this._open=-1:this._open>e&&this._open--,this._focusAfter=t.length?{index:Math.min(e,t.length-1),part:"toggle"}:void 0,this._writeSteps(t,"Delete step"),this._remap(t=>function(e,t){return uo(e,e=>e===t?-1:e>t?e-1:e)}(t,e)),this._announce=Zn(920,{index:e+1})}_move(e,t,i="handle"){const n=this._steps.length;e===t||t<0||t>=n||this._locked(e,!0)||(this._open=this._followMove(this._open,e,t),this._focusAfter={index:t,part:i},this._writeSteps(mf(this._steps,e,t),"Move step"),this._remap(i=>ho(i,e,t)),this._announce=Zn(918,{to:t+1,n}))}_followMove(e,t,i){return e<0?e:e===t?i:t<e&&e<=i?e-1:i<=e&&e<t?e+1:e}_onHandleDown(e,t){if(this.disabled||0!==e.button||this._steps.length<2||this._locked(t,!0))return;const i=[...this.renderRoot.querySelectorAll(".step")];if(!i[t])return;e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId);const n=i.map(e=>e.getBoundingClientRect()),s=n[t+1]??n[t-1],a=s?Math.abs(t+1<n.length?s.top-n[t].bottom:n[t].top-s.bottom):0;this._drag={from:t,to:t,dy:0,startY:e.clientY,pointerId:e.pointerId,mids:n.map(e=>e.top+e.height/2),shift:n[t].height+a,steps:this._steps,moved:!1},window.addEventListener("keydown",this._onDragKey,!0)}_endDrag(){const e=this._drag;return this._drag=void 0,window.removeEventListener("keydown",this._onDragKey,!0),e}disconnectedCallback(){super.disconnectedCallback(),this._endDrag()}_onHandleMove(e){const t=this._drag;if(!t||e.pointerId!==t.pointerId)return;const i=e.clientY-t.startY,n=e.clientY;let s=t.from;for(let e=t.from+1;e<t.mids.length;e++)n>t.mids[e]&&(s=e);for(let e=t.from-1;e>=0;e--)n<t.mids[e]&&(s=e);const a=s!==t.to;this._drag={...t,dy:i,to:s,moved:t.moved||a},a&&this.doc&&this._emit({...this.doc,steps:mf(t.steps,t.from,s)},"Move step",!0)}_onHandleUp(e){const t=this._drag;t&&e.pointerId===t.pointerId&&(this._endDrag(),t.to!==t.from&&(this._open=this._followMove(this._open,t.from,t.to),this._focusAfter={index:t.to,part:"handle"},this.doc&&this._emit({...this.doc,steps:mf(t.steps,t.from,t.to)},"Move step"),this._remap(e=>ho(e,t.from,t.to)),this._announce=Zn(917,{to:t.to+1,count:t.steps.length})))}_cancelDrag(){const e=this._endDrag();e&&e.moved&&this.doc&&this._emit({...this.doc,steps:e.steps},"Move step")}_onStepKey(e,t){if(!e.altKey||"ArrowUp"!==e.key&&"ArrowDown"!==e.key||this.disabled)return;e.preventDefault();const i=e.target.classList?.contains("handle");this._move(t,t+("ArrowUp"===e.key?-1:1),i?"handle":"toggle")}_dragOffset(e){const t=this._drag;return t?e===t.from?t.dy:t.from<t.to&&e>t.from&&e<=t.to?-t.shift:t.to<t.from&&e>=t.to&&e<t.from?t.shift:0:0}_popover(){return this.renderRoot.querySelector("mc-ui-popover.pick-pop")}_openPicker(e,t){if(this.disabled)return;const i=e.currentTarget;this._pick&&this._trigger===i?this._popover()?.close("action"):(this._trigger=i,this._pick=t,this._query="",this._focusSearch=!0)}_choose(e){const t=this._pick;this._popover()?.close("action"),this._pick=null,t&&("add"===t.mode?this._addStep(e):this._steps[t.index]?.animation!==e&&this._patchStep(t.index,{animation:e},"Change step animation"))}_onPickKey(e){const t="INPUT"===e.target.tagName;if(t&&("Home"===e.key||"End"===e.key))return;const i=[...this.renderRoot.querySelectorAll('.pick-pop [role="menuitem"]')],n=this.renderRoot.querySelector(".pick-pop .pick-search input"),s=i.indexOf(e.target),a=t=>{t&&(e.preventDefault(),t.focus())};"ArrowDown"===e.key?a(t?i[0]:i[Math.min(i.length-1,s+1)]):"ArrowUp"===e.key?a(s<=0?n:i[s-1]):"Home"===e.key?a(i[0]):"End"===e.key&&a(i[i.length-1])}_renderPicker(){const e=this._pick,t="step"===e?.mode?this._steps[e.index]?.animation:void 0,i=function(e,t,i=""){const n=(0,St.A)(i.trim()),s=(...e)=>!n||e.some(e=>e&&(0,St.A)(e).includes(n)),a=[],r=Object.values(e??{}).filter(e=>e.id!==t&&pf(e)).sort((e,t)=>(e.name||e.id).localeCompare(t.name||t.id)).filter(e=>s(e.name,e.id,Zn(1149),e.kind)).map(e=>({value:Ze+e.id,name:e.name||e.id,kind:"path"===e.kind?Zn(665):Zn(420),icon:ff[e.kind],duration:e.duration}));r.length&&a.push({label:Zn(553),items:r});for(const e of X){const t=J.filter(t=>t.group===e&&dt.has(t.id)&&s((0,N.t)(t.name),t.id,e,(0,N.t)(Q[e]))).map(e=>({value:e.id,name:(0,N.t)(e.name),icon:"mdi:motion-play-outline",duration:hf(e.defaults.duration)}));t.length&&a.push({label:(0,N.t)(Q[e]),items:t})}return a}(this.library,this.doc?.id,this._query),s=Zn("add"===e?.mode?36:916);return n.qy`
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
              placeholder=${Zn(796)}
              aria-label=${Zn(796)}
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
                          ${void 0!==e.duration?n.qy`<span class="pick-dur">${gf(e.duration)}</span>`:n.s6}
                          ${e.value===t?n.qy`<ha-icon class="pick-check" icon="mdi:check"></ha-icon>`:n.s6}
                        </button>`)}
                    </div>
                  `):n.qy`<p class="menu-note">${Zn(569,{query:this._query})}</p>`}
          </div>
        </div>
      </mc-ui-popover>
    `}_field(e,t,i){return n.qy`<div class="field">
      <div class="field-head">${i?n.qy`<label for=${i}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}</div>
      ${t}
    </div>`}_renderSchedule(e){const t=e.total,i=function(e,t){if(!e.total)return-1;const i=Math.min(1,Math.max(0,t))*e.total,n=e.entries.find(t=>t.play>0&&i>=t.start&&(i<t.end||i===t.end&&t.end===e.total));return n?n.index:-1}(e,this.time),s=e=>t?e/t*100:0,a=this._steps.length,r=e.entries.filter(e=>"ok"!==e.status).length,o=!1!==this.doc?.loop,l=this._drag?this._followMove(this._open,this._drag.from,this._drag.to):this._open,c=new Map,d=t?Zn(1258,{steps:Zn(1193,{count:a}),total:gf(t),loop:Zn(o?1148:1156),skipped:r?Zn(6,{count:r}):""}):Zn(612);return n.qy`
      <div class="sched">
        <div class="bar" aria-hidden="true">
          ${e.entries.map(e=>{if("ok"!==e.status){const t=c.get(e.start)??0;return c.set(e.start,t+1),n.qy`<span class="mark" style="left:calc(${s(e.start)}% + ${8*t}px)" title=${Zn(921,{index:e.index+1})} @click=${()=>this._reveal(e.index)}></span>`}const t=["blk",e.index===l?"is-open":"",e.index===i?"is-live":""].join(" "),a=s(e.end-e.start);return n.qy`<span
              class=${t}
              style="left:${s(e.start)}%;width:${a}%;--plays:${e.repeat}"
              title=${Zn(922,{index:e.index+1,from:gf(e.start),to:gf(e.end)})}
              @click=${()=>this._reveal(e.index)}
              >${a>=6?e.index+1:""}</span
            >`})}
          ${t?n.qy`<span class="playhead" style="left:${100*xf(this.time,0,1)}%"></span>`:n.s6}
        </div>
        <div class="ruler" aria-hidden="true">
          <span>0 s</span>
          ${o?n.qy`<span class="loop"><ha-icon icon="mdi:repeat"></ha-icon>${Zn(458)}</span>`:n.s6}
          <span>${gf(t)}</span>
        </div>
        <p class="sr-only">${d}</p>
      </div>
    `}_reveal(e){this._open=e,this.updateComplete.then(()=>this.renderRoot.querySelector(`.step[data-i="${e}"]`)?.scrollIntoView({block:"nearest"}))}_renderStep(e,t,i){const s=uf(e.animation,this.library,this.doc?.id),a=this._open===t,r="ok"!==s.status,o=e=>`seq-${t}-${e}`,l=r?"missing"===s.status?Zn(598):Zn(130):function(e,t){const i=[];e.delay>0&&i.push(Zn(1117,{seconds:gf(e.delay)}));const n=e.duration??t.defaultDuration;return void 0!==n&&i.push(gf(n)),e.repeat>1&&i.push(`× ${e.repeat}`),i.join(" · ")}(e,s),c=this._drag?.from===t,d=this._dragOffset(t),p=void 0!==s.defaultDuration?String(wf(s.defaultDuration)):"",h=this._locked(t);return n.qy`
      <li
        class="step ${a?"is-open":""} ${r?"is-bad":""} ${c?"is-dragging":""}"
        data-i=${t}
        style=${d?`transform: translateY(${d}px)`:""}
        @keydown=${e=>this._onStepKey(e,t)}
      >
        <div class="row">
          <button
            type="button"
            class="icon-btn sm handle"
            aria-label=${Zn(498,{i:t+1})}
            aria-describedby="seq-move-hint"
            title=${Zn(269)}
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
            aria-expanded=${a?"true":"false"}
            aria-controls=${o("body")}
            @click=${()=>this._open=a?-1:t}
          >
            <span class="num">${t+1}</span>
            <span class="txt">
              <span class="nm">${s.name}</span>
              <span class="sum ${r?"error":""}">${r?n.qy`<ha-icon icon="mdi:alert-circle-outline"></ha-icon>`:n.s6}${l}</span>
            </span>
            <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
          </button>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${Zn(247,{i:t+1})}
            title=${Zn(i<=1?20:246)}
            ?disabled=${this.disabled||h||i<=1}
            @click=${()=>this._deleteStep(t)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${a?n.qy`<div class="body" id=${o("body")}>
              ${h?go(this.doc,this.layerView,[`step:${t}`]):n.s6}
              ${r?n.qy`<p class="help error problem" role="note">${s.problem}</p>`:n.s6}
              ${this._field(Zn(65),n.qy`<button
                  type="button"
                  class="input pick-btn"
                  id=${o("anim")}
                  aria-haspopup="menu"
                  aria-expanded=${"step"===this._pick?.mode&&this._pick.index===t?"true":"false"}
                  ?disabled=${this.disabled||h}
                  @click=${e=>this._openPicker(e,{mode:"step",index:t})}
                >
                  <span class="pick-val">${s.name}${s.kind&&s.kind!==Zn(707)?n.qy`<span class="pick-kind"> · ${s.kind}</span>`:n.s6}</span>
                  <ha-icon icon="mdi:chevron-down"></ha-icon>
                </button>`,o("anim"))}
              <div class="fields">
                ${this._field(Zn(229),n.qy`<mc-unit-field
                    .value=${e.delay?`${wf(e.delay)}s`:""}
                    .label=${Zn(229)}
                    .units=${["s"]}
                    .noCustom=${!0}
                    .placeholder=${"0"}
                    ?disabled=${this.disabled||h}
                    @value-changed=${e=>{e.stopPropagation(),this._patchStep(t,{delay:xf(wf(yf(e.detail.value)??0),0,600)},"Change step delay")}}
                  ></mc-unit-field>`)}
                ${this._field(Zn(297),n.qy`<mc-unit-field
                    .value=${void 0!==e.duration?`${wf(e.duration)}s`:""}
                    .label=${Zn(297)}
                    .units=${["s"]}
                    .noCustom=${!0}
                    .placeholder=${p}
                    ?disabled=${this.disabled||h}
                    @value-changed=${e=>{e.stopPropagation();const i=yf(e.detail.value);this._patchStep(t,{duration:void 0===i||i<=0?void 0:xf(wf(i),.05,600)},"Change step duration")}}
                  ></mc-unit-field>`)}
                ${this._field(Zn(695),n.qy`<input
                    class="input"
                    id=${o("plays")}
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    inputmode="numeric"
                    .value=${String(e.repeat)}
                    ?disabled=${this.disabled||h}
                    @change=${i=>{const n=i.target,s=Math.round(Number(n.value));if(!n.value.trim()||!Number.isFinite(s))return void(n.value=String(e.repeat));const a=xf(s,1,100);n.value=String(a),a!==e.repeat&&this._patchStep(t,{repeat:a},"Change step plays")}}
                  />`,o("plays"))}
              </div>
              <p class="help">${p?Zn(231,{seconds:p}):Zn(232)}</p>
            </div>`:n.s6}
      </li>
    `}render(){const e=this.doc;if(!e)return n.qy``;const t=this._drag?this._drag.steps:this._steps,i=function(e,t,i){const n=[];let s=0;return(e??[]).forEach((e,a)=>{const r=uf(e.animation,t,i),o="ok"===r.status?e.duration??r.defaultDuration??0:0,l=Math.max(1,Math.round(e.repeat||1));if(!o)return void n.push({index:a,status:"ok"===r.status?"invalid":r.status,start:df(s),play:0,repeat:l,end:df(s)});const c=s+Math.max(0,e.delay||0),d=c+o*l;n.push({index:a,status:"ok",start:df(c),play:df(o),repeat:l,end:df(d)}),s=d}),{entries:n,total:df(s)}}(this._drag?mf(this._drag.steps,this._drag.from,this._drag.to):t,this.library,e.id),s=!1!==e.loop,a=e.stagger??{children:!1,delay:.15},r=!vf(t);return n.qy`
      <div class="wrap">
        <section class="group" aria-label=${Zn(795)}>${this._renderSchedule(i)}</section>

        <section class="group" aria-labelledby="seq-steps-h">
          <div class="group-head">
            <h3 id="seq-steps-h">${Zn(689)}</h3>
            <span class="chip is-count" title=${Zn(85,{steps:20})}>${t.length} / ${20}</span>
          </div>
          <p class="sr-only" id="seq-move-hint">${Zn(271)}</p>
          ${t.length?n.qy`<ol class="steps ${this._drag?"is-sorting":""}">${t.map((e,i)=>this._renderStep(e,i,t.length))}</ol>`:n.qy`<div class="empty">
                <ha-icon icon="mdi:playlist-play"></ha-icon>
                <strong>${Zn(584)}</strong>
                <p>${Zn(37)}</p>
              </div>`}
          <div class="foot">
            <button
              type="button"
              class="btn btn-text btn-sm add"
              aria-haspopup="menu"
              aria-expanded=${"add"===this._pick?.mode?"true":"false"}
              ?disabled=${this.disabled||r}
              @click=${e=>this._openPicker(e,{mode:"add"})}
            >
              <ha-icon icon="mdi:plus"></ha-icon>${Zn(36)}
            </button>
            ${r?n.qy`<span class="help">${Zn(18,{steps:20})}</span>`:n.s6}
          </div>
        </section>

        <section class="group" aria-labelledby="seq-play-h">
          <div class="group-head"><h3 id="seq-play-h">${Zn(692)}</h3></div>
          <div class="switch-row">
            <div class="txt">
              ${Zn(454)}
              <p class="help">${Zn(898)}</p>
            </div>
            <button
              type="button"
              class="switch"
              role="switch"
              aria-checked=${s?"true":"false"}
              aria-label=${Zn(454)}
              ?disabled=${this.disabled}
              @click=${()=>this._emit({...e,loop:!s},Zn(s?455:456))}
            ></button>
          </div>
          <div class="switch-row">
            <div class="txt">
              ${Zn(893)}
              <p class="help">${Zn(688)}</p>
            </div>
            <button
              type="button"
              class="switch stagger"
              role="switch"
              aria-checked=${a.children?"true":"false"}
              aria-label=${Zn(893)}
              ?disabled=${this.disabled}
              @click=${()=>this._emit({...e,stagger:{...a,children:!a.children}},a.children?Zn(894):Zn(895))}
            ></button>
          </div>
          ${a.children?this._field(Zn(230),n.qy`<mc-unit-field
                  class="stagger-delay"
                  .value=${`${wf(a.delay)}s`}
                  .label=${Zn(230)}
                  .units=${["s"]}
                  .noCustom=${!0}
                  .placeholder=${"0"}
                  ?disabled=${this.disabled}
                  @value-changed=${t=>{t.stopPropagation(),this._emit({...e,stagger:{...a,delay:xf(wf(yf(t.detail.value)??0),0,10)}},"Change stagger delay")}}
                ></mc-unit-field>`):n.s6}
        </section>
        <div class="sr-only" aria-live="polite">${this._announce}</div>
        ${this._pick?this._renderPicker():n.s6}
      </div>
    `}willUpdate(e){e.has("doc")&&this._open>=this._steps.length&&(this._open=-1)}updated(){const e=this._pick?this._popover():null;e&&!e.open&&(e.anchor=this._trigger,e.show()),this._focusSearch&&e&&(this._focusSearch=!1,e.updateComplete.then(()=>this.renderRoot.querySelector(".pick-pop .pick-search input")?.focus({preventScroll:!0})));const t=this._focusAfter;t&&(this._focusAfter=void 0,this.renderRoot.querySelector(`.step[data-i="${t.index}"] .${t.part}`)?.focus())}};_f.styles=[Wp,mo,n.AH`
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
    `],bf([(0,s.MZ)({attribute:!1})],_f.prototype,"doc",void 0),bf([(0,s.MZ)({attribute:!1})],_f.prototype,"hass",void 0),bf([(0,s.MZ)({attribute:!1})],_f.prototype,"library",void 0),bf([(0,s.MZ)({type:Number})],_f.prototype,"time",void 0),bf([(0,s.MZ)({type:Boolean,reflect:!0})],_f.prototype,"disabled",void 0),bf([(0,s.MZ)({attribute:!1})],_f.prototype,"layerView",void 0),bf([(0,s.wk)()],_f.prototype,"_open",void 0),bf([(0,s.wk)()],_f.prototype,"_drag",void 0),bf([(0,s.wk)()],_f.prototype,"_query",void 0),bf([(0,s.wk)()],_f.prototype,"_announce",void 0),bf([(0,s.wk)()],_f.prototype,"_pick",void 0),_f=bf([(0,s.EM)("mc-anim-sequence-editor")],_f);const kf={hide:{name:383,tip:[384,843],key:"H",icon:["mdi:eye-outline","mdi:eye-off-outline"]},solo:{name:864,tip:[865,315],key:"S",icon:["mdi:radiobox-blank","mdi:radiobox-marked"]},lock:{name:450,tip:[450,1066],key:"L",icon:["mdi:lock-open-variant-outline","mdi:lock-outline"]}},$f=["hide","solo","lock"],Mf={hide:[1229,1242],solo:[1243,1240],lock:[1234,1244]};let Sf="";function Cf(e,t){const i=t??e.closest(".layers-body");return(i?[...i.querySelectorAll("[data-panel] > *")]:[e]).flatMap(e=>[...e.shadowRoot?.querySelectorAll("[data-lk]")??[]])}function Af(e){const t=Cf(e),i=t.find(e=>e.dataset.lk===Sf)??t.find(e=>"true"===e.getAttribute("aria-pressed"))??t[0];for(const e of t){const t=e===i;e.tabIndex=t?0:-1,e.closest("li")?.querySelectorAll("[data-ctl]").forEach(e=>e.tabIndex=t?0:-1)}}class jf{constructor(e,t){this.host=e,this.actions=t,this._n=0,e.addController(this)}hostUpdated(){Af(this.host);const e=this._focus,t=this.host.renderRoot?.querySelector("mc-ui-menu");t&&this._menu?.first&&(this._menu.first=!1,t.anchor=this.host.renderRoot?.querySelector(`li[data-ref="${this._menu.key}"] [data-ctl="menu"]`)??void 0,t.show()),e&&this._refocus(e)}get view(){return this.host.layerView??Gr}announce(e,t=this.view){this.host.dispatchEvent(new CustomEvent("layer-view-change",{detail:{view:t,announce:e},bubbles:!0,composed:!0}))}locked(e){return!!this.host.doc&&ro(this.host.doc,this.view,e)}refuseLocked(e,t){return!!this.locked(e)&&(this.announce(Zn(1230,{name:t})),!0)}setOpen(e,t){const i=this.view;i.open.includes(e)!==t&&this.announce("",{...i,open:t?[...i.open,e]:i.open.filter(t=>t!==e)})}toggle(e,t,i){const n=function(e,t,i){const n=ao[i];return{...e,[n]:e[n].includes(t)?e[n].filter(e=>e!==t):[...e[n],t]}}(this.view,e,i),s=n["hide"===i?"hidden":"solo"===i?"solo":"locked"].includes(e);this.announce(Zn(Mf[i][s?0:1],{name:t}),n)}focusKey(e,t){this._focus={key:e,ctl:t},this._refocus(this._focus),this.host.requestUpdate()}async _refocus(e,t=0){await this.host.updateComplete;const i=Cf(this.host).find(t=>t.dataset.lk===e.key),n=i?e.ctl?i.closest("li")?.querySelector(`[data-ctl="${e.ctl}"]`):i:void 0;n?(this._focus===e&&(this._focus=void 0),Sf=e.key,n.focus(),n.scrollIntoView?.({block:"nearest"})):t<4&&this._focus===e?setTimeout(()=>{this._refocus(e,t+1)},16):this._focus===e&&(this._focus=void 0)}_key(e,t){const i=e.target;if(!i.matches?.("[data-lk]")||e.ctrlKey||e.metaKey)return;const n=Cf(this.host),s=n.indexOf(i),a=t=>{e.preventDefault(),n[Math.max(0,Math.min(n.length-1,t))]?.focus()};if(e.altKey&&("ArrowUp"===e.key||"ArrowDown"===e.key))return e.preventDefault(),void this._move(t,"ArrowUp"===e.key?"up":"down");if(!e.altKey){if(!e.shiftKey&&"ArrowUp"===e.key)return a(s-1);if(!e.shiftKey&&"ArrowDown"===e.key)return a(s+1);if("Home"===e.key)return a(0);if("End"===e.key)return a(n.length-1);if("ArrowRight"===e.key&&!1===t.expanded)e.preventDefault(),this.actions.open?.(t.key,!0);else if("ArrowLeft"===e.key)if(t.expanded)e.preventDefault(),this.actions.open?.(t.key,!1);else{const i=this.host.doc?so(this.host.doc,t.key):void 0;i&&(e.preventDefault(),this.focusKey(i))}else if("F2"===e.key&&t.renamable&&this.actions.rename)e.preventDefault(),this._rename(t);else if(!e.shiftKey&&1===e.key.length){const i=$f.find(t=>kf[t].key===e.key.toUpperCase());i&&this._toggles(t).includes(i)&&(e.preventDefault(),this.toggle(t.key,t.name,i))}}}_toggles(e){return e.toggles??Ur[e.key.split(":")[0]]??[]}_move(e,t,i){const n="up"===t?e.up:e.down;n?.ok&&this.actions.move&&(this.refuseLocked(e.key,e.name)||(this.actions.move(e.key,t),this.focusKey(e.key,i)))}_rename(e){this.refuseLocked(e.key,e.name)||this.actions.rename?.(e.key)}_openMenu(e,t=!0){this._menu={key:e,first:t},this.host.requestUpdate()}_toggleMenu(e){if(this._menu?.key===e)return this._closeMenu();const t=this._outsideAt;this._outsideAt=void 0,t&&t.key===e&&Date.now()-t.at<400||this._openMenu(e)}_closeMenu(e=!0){const t=this._menu?.key;this._menu=void 0,this.host.requestUpdate(),t&&e&&this.focusKey(t,"menu")}_menuItems(e){const t=this.locked(e.key),i=[];if(this.actions.move)for(const n of["up","down"]){const s="up"===n?e.up:e.down;if(!s)continue;const a=s.menu??s.label,r=t?Zn(451):s.ok?void 0:Zn("up"===n?50:49);i.push({id:`move-${n}`,icon:"up"===n?"mdi:arrow-up":"mdi:arrow-down",label:t?a.replace(/ \(.*\)$/,""):a,reason:r,keys:Zn("up"===n?55:54),run:()=>this._move(e,n,"menu")})}e.renamable&&this.actions.rename&&i.push({id:"rename",icon:"mdi:rename-outline",label:Zn(744),reason:t?Zn(451):void 0,keys:"F2",run:()=>this._rename(e)});const n=this.view;return $f.filter(t=>this._toggles(e).includes(t)).forEach((t,s)=>{const a=n["hide"===t?"hidden":"solo"===t?"solo":"locked"].includes(e.key);i.push({id:t,icon:a?"mdi:checkbox-marked":"mdi:checkbox-blank-outline",label:Zn(kf[t].name),checked:a,keys:kf[t].key,separatorBefore:0===s&&i.length>0,run:()=>this.toggle(e.key,e.name,t)})}),i}_renderMenu(e){const t=this._menuItems(e);return n.qy`<mc-ui-menu
      .items=${t}
      .align=${"end"}
      label=${Zn(428,{name:e.name})}
      @mc-menu-pick=${e=>{e.stopPropagation();const i=t.find(t=>t.id===e.detail.id);this._closeMenu(),i?.run()}}
      @mc-menu-close=${e=>{e.stopPropagation();const t=e.detail.reason;"pick"!==t&&("outside"===t&&this._menu&&(this._outsideAt={key:this._menu.key,at:Date.now()}),this._closeMenu(!1))}}
    ></mc-ui-menu>`}row(e){const t=this.host,i=t.doc,s=this.view,a="compact"===t.density,r=this._toggles(e),o=i?function(e,t,i){if(t.hidden.includes(i))return{kind:"self"};const n=no(e,t);if(n.has(i))return{kind:"solo"};for(let t=so(e,i),s=0;t&&s<4;t=so(e,t),s++)if(n.has(t))return{kind:"parent",by:t}}(i,s,e.key):void 0,l=s.solo.includes(e.key),c=s.locked.includes(e.key),d=!c&&this.locked(e.key),p=i&&!1===e.expanded?function(e,t,i){const n=no(e,t);let s=0;for(const a of to(e).keys())so(e,a)===i&&(n.has(a)||t.solo.includes(a))&&s++;return s}(i,s,e.key):0,h=[e.describe,"self"===o?.kind&&Zn(1136),"solo"===o?.kind&&Zn(1134),"parent"===o?.kind&&Zn(1135,{name:(e=>e?this.actions.nameOf?.(e)??e.split(":").slice(1).join(":"):"")(o.by)}),l&&"solo",c&&"locked",d&&Zn(1147),p>0&&Zn(1179,{below:p})].filter(Boolean),u="ld"+this._n++,m=c||d,g=t=>{const i="up"===t?e.up:e.down;return i?n.qy`<button type="button" class="icon-btn xs lt mv ${t}" data-ctl=${t} tabindex="-1" aria-label=${i.label} title=${i.label} aria-disabled=${i.ok&&!m?n.s6:"true"} @click=${()=>this._move(e,t,t)}>
        <ha-icon icon=${"up"===t?"mdi:chevron-up":"mdi:chevron-down"}></ha-icon>
      </button>`:n.s6},f=r.length>0||!!e.up||!!e.down||e.renamable&&!!this.actions.rename,v=a?n.s6:n.qy`<span class="lfull">${r.length?$f.filter(e=>r.includes(e)).map(t=>{const i="hide"===t?"self"===o?.kind:"solo"===t?l:c,s=!i&&("hide"===t?!!o:"lock"===t&&d),a=kf[t];return n.qy`<button type="button" class="icon-btn xs lt ${s?"soft":""}" data-ctl=${t} data-toggle=${t} tabindex="-1" aria-pressed=${i?"true":"false"} aria-label=${Zn(a.name)} title=${"hide"===t&&!i&&e.key.startsWith("lane:")?Zn(385):Zn(a.tip[i?1:0])} @click=${()=>this.toggle(e.key,e.name,t)}>
        <ha-icon icon=${a.icon[i||s?1:0]}></ha-icon>
      </button>`}):n.s6}${g("up")}${g("down")}</span>`;return n.qy`<li class="lr lvl-${e.level??1} ${a?"compact":""} ${e.selected?"sel":""} ${o?"is-hidden":""} ${m?"is-locked":""}" data-ref=${e.key} data-id=${e.key.slice(e.key.indexOf(":")+1)} @dblclick=${()=>this.actions.dblclick?.(e.key)} @keydown=${t=>this._key(t,e)}>
      <div class="lr-in">
        ${void 0===e.expanded?n.qy`<span class="lcaret-space"></span>`:n.qy`<button type="button" class="icon-btn xs lt lcaret" tabindex="-1" aria-label=${e.expanded?Zn(176,{name:e.name}):Zn(326,{name:e.name})} @click=${()=>this.actions.open?.(e.key,!e.expanded)}>
              <ha-icon icon=${e.expanded?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
            </button>`}
        <button type="button" class="lr-main" data-lk=${e.key} tabindex="-1" aria-pressed=${e.selected?"true":"false"} aria-expanded=${void 0===e.expanded?n.s6:e.expanded?"true":"false"} aria-describedby=${h.length?u:n.s6} aria-keyshortcuts="H S L Alt+ArrowUp Alt+ArrowDown" title=${(e.title??e.name)+(e.badge&&!e.title?` (${e.badge})`:"")} @focus=${e=>(Sf=e.currentTarget.dataset.lk,Af(t))} @click=${t=>this.actions.select(e.key,t)}>
          ${e.thumb??(e.bare?n.s6:n.qy`<ha-icon class="kind" icon=${e.icon??"mdi:layers-outline"}></ha-icon>`)}
          ${e.renaming?n.s6:n.qy`<span class="nm"><span class="nm-t">${e.name}</span>${e.note?n.qy`<small>${e.note}</small>`:n.s6}</span>`}
          ${e.badge?n.qy`<span class="lbadge">${e.badge}</span>`:n.s6}
          ${p>0?n.qy`<span class="lbadge warn" aria-hidden="true">${Zn(1178,{below:p})}</span>`:n.s6}
        </button>
        ${e.renaming?n.qy`<div class="lrename">${e.renaming}</div>`:n.s6}
        <span class="lst" aria-hidden="true">
          ${o?n.qy`<ha-icon icon="mdi:eye-off-outline"></ha-icon>`:n.s6}${l?n.qy`<ha-icon icon="mdi:radiobox-marked"></ha-icon>`:n.s6}${m?n.qy`<ha-icon icon="mdi:lock-outline"></ha-icon>`:n.s6}
        </span>
        ${v}
        ${f?n.qy`<button type="button" class="icon-btn xs lt lm" data-ctl="menu" tabindex="-1" aria-haspopup="menu" aria-expanded=${this._menu?.key===e.key?"true":"false"} aria-label=${Zn(428,{name:e.name})} title=${Zn(427)} @click=${()=>this._toggleMenu(e.key)} @keydown=${t=>{"ArrowDown"!==t.key&&"ArrowUp"!==t.key||(t.preventDefault(),this._openMenu(e.key))}}>
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </button>`:n.s6}
        ${e.extra??n.s6}
      </div>
      ${h.length?n.qy`<span id=${u} class="lr-sr">${h.join(", ")}</span>`:n.s6}
      ${this._menu?.key===e.key?this._renderMenu(e):n.s6}
    </li>`}}const zf=n.AH`
  ${fs}
  ${vs}
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
`;function qf(e){const t=e.lastIndexOf("|");return{target:e.slice(5,t),lane:e.slice(t+1)}}const Ef=e=>zs[qf(e).lane]?Es(qf(e).lane):e,Lf=(e,t,i,n)=>Qr(e,i).length?t.open.includes(n):void 0;function Pf(e,t,i){const{target:n,lane:s}=qf(i),a={kind:"keys",keys:eo(t,n,s).map(e=>({target:n,lane:s,at:e,id:`${s}@${e}`})),target:n,targets:[n]};e.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:a},bubbles:!0,composed:!0}))}function Hf(e,t,i,n,s){return Qr(t,n).map(a=>{const r=((e,t)=>`lane:${e}|${t}`)(n,a),o=eo(t,n,a).length,l="keys"===i?.kind&&!!i.keys?.length&&i.keys.every(e=>e.target===n&&e.lane===a);return e.row({key:r,name:Ef(r),bare:!0,level:s,badge:Zn(1187,{count:o}),describe:Zn(1140),selected:l,title:Zn(1247,{name:Ef(r),count:o})})})}const Vf="0 0 24 24",Df=new Map,Tf=new Map,Of=new Map,Rf=new Set;let Nf,Ff,Bf=0;const If=new Set;let Zf=!1;const Kf=e=>e.includes(":")?e.slice(0,e.indexOf(":")):"",Wf=new Set(["mdi","hass","hassio","hademo"]);function Uf(e){const t="undefined"==typeof window?{}:window,i=t.customIconsets?.[e];if("function"==typeof i)return i;const n=t.customIcons?.[e];return n&&"function"==typeof n.getIcon?e=>n.getIcon(e):void 0}function Gf(e,t){for(Df.delete(e),Df.set(e,{g:t,at:Date.now()});Df.size>200;)Df.delete(Df.keys().next().value);t&&(Rf.delete(e),Of.get(e)?.forEach(e=>{try{e()}catch{}}))}function Yf(e){const t=Df.get(e);if(t?.g)return Df.delete(e),Df.set(e,t),t.g}const Jf=new Map;let Xf=function(e){let t=2166136261;for(let i=0;i<e.length;i++)t^=e.charCodeAt(i),t=Math.imul(t,16777619);return(t>>>0).toString(36)+e.length.toString(36)};function Qf(e,t){t&&Jf.delete(t);const i=t??`svg:${Xf(e)}`;let n=i;for(let t=1;Jf.has(n)&&Jf.get(n).text!==e;t++)n=`${i}.${t}`;const s=function(e){const t=Jf.get(e);return t&&(Jf.delete(e),Jf.set(e,t)),t}(n);if(s)return s.geometry&&!Df.get(n)?.g&&Gf(n,s.geometry),n;const a=function(e){try{return Ne(e)}catch{return De(Ve)}}(e),r={text:e};if(a.error)r.error=a.error;else{const e={paths:a.paths,viewBox:a.viewBox};a.accentPaths.length&&(e.secondary=a.accentPaths),a.strokes.length&&(e.strokes=a.strokes),a.evenodd&&(e.evenodd=a.evenodd),r.markup=a.markup,r.geometry=e}for(Jf.set(n,r);Jf.size>50;){const e=Jf.keys().next().value;Jf.delete(e),Df.delete(e)}return r.geometry&&Gf(n,r.geometry),n}async function ev(e){const t=Uf(Kf(e));if(!t)return;let i;try{i=await t((e=>e.slice(e.indexOf(":")+1))(e))}catch{return}if(!i||"object"!=typeof i)return;if("string"==typeof i.mc_svg){Qf(i.mc_svg,e);const t=Yf(e);if(t)return t}const n="string"==typeof i.path?i.path.trim():"";if("string"==typeof i.svg||n.startsWith("<"))return"markup";if(!n)return;const s={paths:[n],viewBox:"string"==typeof i.viewBox&&i.viewBox.trim()?i.viewBox.trim():Vf},a="string"==typeof i.secondaryPath?i.secondaryPath.trim():"";return a&&!a.startsWith("<")&&(s.secondary=[a]),s}function tv(e,t){return new Promise(i=>{const n=document.createElement("ha-icon");n.setAttribute("icon",e);let s,a=!1;const r=setInterval(()=>{p(),c()},50),o=setTimeout(()=>l(void 0),t),l=e=>{a||(a=!0,If.delete(d),s?.disconnect(),clearInterval(r),clearTimeout(o),n.remove(),Ff&&!Ff.childElementCount&&(Ff.remove(),Ff=void 0),i(e))},c=()=>{if(a)return;const e=n.shadowRoot?.querySelector("ha-svg-icon"),t="string"==typeof e?.path?e.path.trim():"";if(!e||!t)return;const i={paths:[t],viewBox:"string"==typeof e.viewBox&&e.viewBox.trim()?e.viewBox.trim():Vf},s="string"==typeof e.secondaryPath?e.secondaryPath.trim():"";s&&(i.secondary=[s]),l(i)},d=()=>l(void 0);function p(){!s&&n.shadowRoot&&"undefined"!=typeof MutationObserver&&(s=new MutationObserver(c),s.observe(n.shadowRoot,{subtree:!0,childList:!0,attributes:!0}))}If.add(d),(Ff?.isConnected||(Ff=document.createElement("div"),Ff.setAttribute("aria-hidden","true"),Ff.style.cssText="position:fixed;left:-9999px;top:0;width:0;height:0;overflow:hidden;pointer-events:none;",document.body.appendChild(Ff)),Ff).appendChild(n),p();const h=n;h.updateComplete?.then(()=>{p(),c()},()=>{}),c()})}function iv(){for(const e of[...Rf]){if(!Uf(Kf(e))||Tf.has(e))continue;Rf.delete(e);const t=ev(e).then(t=>(Tf.delete(e),Gf(e,t&&"markup"!==t?t:null),t&&"markup"!==t?t:void 0));Tf.set(e,t)}}function nv(e){const t=e.detail;if("icons"===t?.kind)for(const e of t.ids?.length?t.ids.map(e=>`mcu:${e}`):[...Df.keys(),...Of.keys()].filter(e=>e.startsWith("mcu:")))Df.delete(e),Jf.delete(e),Of.get(e)?.forEach(e=>e())}function sv(e,t={}){if(!e||!e.includes(":"))return Promise.resolve(void 0);if(e.startsWith("svg:"))return Promise.resolve(Yf(e));Zf||"undefined"==typeof window||(Zf=!0,window.addEventListener("iconset-registered",iv),window.addEventListener("mcu-library-changed",nv));const i=Df.get(e);if(i){if(i.g)return Promise.resolve(Yf(e));const t=Date.now()-i.at>6e4,n=Rf.has(e)&&!!Uf(Kf(e));if(!t&&!n)return Promise.resolve(void 0);n&&Rf.delete(e),Df.delete(e)}if(e.startsWith("svg:"))return Promise.resolve(void 0);const n=Tf.get(e);if(n)return n;const s=(async()=>{const i=!!Uf(Kf(e)),n=await ev(e);if("markup"===n)return void Gf(e,null);if(n)return Gf(e,n),n;const s=Kf(e);if(!Wf.has(s))return Gf(e,null),void(i||(Rf.add(e),function(){if(Bf=10,Nf||!Rf.size)return;const e=()=>{Nf=void 0,iv(),Rf.size&&--Bf>0&&(Nf=setTimeout(e,500))};Nf=setTimeout(e,500)}()));const a=t.timeoutMs??3e3,r=function(e,t){return"undefined"!=typeof document&&document.body&&"undefined"!=typeof customElements?customElements.get("ha-icon")?tv(e,t):new Promise(i=>{const n=Date.now();let s=!1;const a=()=>!s&&(s=!0,If.delete(r),clearTimeout(o),!0),r=()=>{a()&&i(void 0)},o=setTimeout(r,t);If.add(r),customElements.whenDefined("ha-icon").then(()=>{a()&&tv(e,Math.max(0,t-(Date.now()-n))).then(i)},r)}):Promise.resolve(void 0)}(e,Math.max(a,t.probeMaxMs??15e3));r.then(t=>{t&&(Gf(e,t),iv())});const o=await new Promise(e=>{const t=setTimeout(()=>e(void 0),a);r.then(i=>{clearTimeout(t),e(i)})});if(o)return o;Yf(e)||Gf(e,null)})().finally(()=>Tf.delete(e));return Tf.set(e,s),s}const av=e=>e.slice(e.indexOf(":")+1),rv=e=>`part:${e}`,ov=e=>`group:${e}`,lv=e=>"string"==typeof e&&/^(part|group):/.test(e),cv=e=>!!e.rig&&(e.rig.parts.length>0||!!e.rig.shapes?.length);function dv(e){return new Set([...(e?.parts??[]).map(e=>e.id),...(e?.groups??[]).map(e=>e.id),...(e?.shapes??[]).map(e=>e.id)])}function pv(e,t,i=dv(e)){const n=t.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^[-_]+/,"").slice(0,24)||"part";for(let e=1;;e++){const t=`${n}-${e}`;if(!i.has(t)&&Ji.test(t))return t}}function hv(e,t="icon"){return e.rig?.icon?e.rig.icon:e.rig?.svg?Qf(e.rig.svg):String(es(t,"m",!1).icon??"mdi:bell-ring")}const uv=e=>Yf(e),mv=e=>sv(e),gv=new WeakMap;function fv(e){let t=gv.get(e);return t||gv.set(e,t=(0,Wm.WP)(e)),t}const vv=(e,t)=>!e.tracks?.some(e=>e.target===t)&&(e.tracks?.length??0)>=24,bv=()=>Zn(1017,{tracks:24}),yv=(e,t)=>e.tracks?.find(e=>e.target===t);function xv(e,t,i){const n=(e.tracks??[]).filter(e=>e.target!==t),s=(e.tracks??[]).findIndex(e=>e.target===t);i&&n.splice(s<0?n.length:s,0,{...i,target:t});const a={...e,tracks:n};return n.length||delete a.tracks,a}function wv(e,t){const i={...e};return e.tracks&&(i.tracks=e.tracks.filter(e=>!t.has(e.target)),i.tracks.length||delete i.tracks),e.bindings&&(i.bindings=e.bindings.filter(e=>!t.has(e.target)),i.bindings.length||delete i.bindings),i}const _v=(e,t)=>({...e,rig:t});function kv(e,t,i){const n=e.rig,s=i.trim();if(!n||!s)return e;const a=av(t);return t.startsWith("part:")?_v(e,{...n,parts:n.parts.map(e=>e.id===a?{...e,name:s}:e)}):t.startsWith("group:")?_v(e,{...n,groups:(n.groups??[]).map(e=>e.id===a?{...e,name:s}:e)}):t.startsWith("shape:")?_v(e,{...n,shapes:(n.shapes??[]).map(e=>e.id===a?{...e,name:s}:e)}):e}function $v(e,t){const i=e.rig,n=[];for(const e of t){const t=av(e),s=e.startsWith("group:")?i?.groups?.find(e=>e.id===t)?.parts??[]:e.startsWith("part:")?[t]:[];for(const e of s)!n.includes(e)&&i?.parts.some(t=>t.id===e)&&n.push(e)}return(i?.parts??[]).map(e=>e.id).filter(e=>n.includes(e))}const Mv=(e,t)=>e?.groups?.find(e=>e.parts.includes(t));function Sv(e,t){return $v(e,t).length<2?Zn(808):(e.rig?.groups?.length??0)>=16?Zn(16,{groups:16}):""}function Cv(e,t,i){const n=e.rig;if(!n||Sv(e,t))return{doc:e};const s=$v(e,t),a=pv(n,"group"),r=(n.groups??[]).map(e=>({...e,parts:e.parts.filter(e=>!s.includes(e))})),o=new Set(r.filter(e=>!e.parts.length).map(e=>ov(e.id))),l=[...r.filter(e=>e.parts.length),{id:a,name:i?.trim()||`Group ${(n.groups?.length??0)+1}`,parts:s}];return{doc:_v(wv(e,o),{...n,groups:l}),id:a}}function Av(e,t){const i=e.rig;if(!i?.groups?.some(e=>e.id===t))return e;const n=i.groups.filter(e=>e.id!==t),s={...i,groups:n};return n.length||delete s.groups,_v(wv(e,new Set([ov(t)])),s)}function jv(e,t,i){const n=e.rig;if(!n)return e;const s=av(t),a=e=>Math.round(100*e)/100,r=e=>{if(e.id!==s)return e;const t={...e};return i?t.origin=[a(i[0]),a(i[1])]:delete t.origin,t};return t.startsWith("part:")?_v(e,{...n,parts:n.parts.map(r)}):t.startsWith("group:")?_v(e,{...n,groups:(n.groups??[]).map(r)}):t.startsWith("shape:")?_v(e,{...n,shapes:(n.shapes??[]).map(r)}):e}const zv=e=>/^(part|group|shape):/.test(e),qv=(e,t)=>zv(t)&&!!yv(e,t)?.origin;function Ev(e,t,i){const n=yv(e,t);if(!n||!zv(t))return e;const s={...n},a=e=>Math.round(100*e)/100;return i?s.origin=`${a(i[0])}px ${a(i[1])}px`:delete s.origin,xv(e,t,s.keyframes.length||s.path||s.origin?s:void 0)}function Lv(e,t,i){return qv(e,t)?Ev(e,t,i):jv(e,t,i)}function Pv(e,t,i){const n=e.rig;if(!n)return;const s=$v(e,[t]).flatMap(e=>(n.parts.find(t=>t.id===e)?.from??[]).map(e=>i[e]?.bbox)).filter(e=>!!e);return(0,Wm.Zg)(s)}function Hv(e,t,i,n){const s=function(e,t,i=[0,0,24,24]){const n=zv(t)?yv(e,t)?.origin?.trim():void 0;if(!n)return;const s=(e,t)=>{const n=i[2+t];if(!e||"center"===e)return n/2;if("left"===e||"top"===e)return 0;if("right"===e||"bottom"===e)return n;const s=parseFloat(e);return Number.isFinite(s)?e.endsWith("%")?n*s/100:s:n/2};let[a,r]=n.split(/\s+/);return"top"!==a&&"bottom"!==a&&("left"!==r&&"right"!==r||"center"!==a)||([a,r]=[r,a]),[s(a,0),s(r,1)]}(e,t,n);if(s)return s;const a=e.rig,r=av(t),o=t.startsWith("part:")?a?.parts.find(e=>e.id===r)?.origin:t.startsWith("group:")?a?.groups?.find(e=>e.id===r)?.origin:void 0;if(o)return o;const l=Pv(e,t,i);return l?[l[0]+l[2]/2,l[1]+l[3]/2]:void 0}function Vv(e,t){const i=av(t),n=e.rig;return t.startsWith("part:")?n?.parts.find(e=>e.id===i)?.name??i:t.startsWith("group:")?n?.groups?.find(e=>e.id===i)?.name??i:t.startsWith("shape:")?n?.shapes?.find(e=>e.id===i)?.name??i:t}function Dv(e,t){return(yv(e,t)?.keyframes??[]).filter(e=>void 0!==e.draw).map(e=>[e.at,e.draw])}function Tv(e,t,i){const n=e.map(e=>e.at===t?{...e,...i}:e);return e.some(e=>e.at===t)||n.push({at:t,...i}),n.sort((e,t)=>e.at-t.at)}function Ov(e,t,i,n=0,s=60){if("none"!==i&&vv(e,t))return e;const a=yv(e,t);let r=(a?.keyframes??[]).map(e=>{if(void 0===e.draw)return e;const t={...e};return delete t.draw,t});if(r=r.filter(e=>Object.keys(e).some(e=>"at"!==e&&"easing"!==e&&"easings"!==e)),"none"!==i){const[e,t]="on"===i?[0,1]:[1,0],a=Math.max(0,Math.min(100,n)),o=Math.max(a,Math.min(100,s));r=Tv(r,a,{draw:e}),r=Tv(r,o,{draw:t}),a>0&&(r=Tv(r,0,{draw:e})),o<100&&(r=Tv(r,100,{draw:t}))}return r.length||a?.path?xv(e,t,{...a??{target:t},target:t,keyframes:r.slice(0,40)}):xv(e,t,void 0)}const Rv="M0 0 C 2 -3 4 -3 6 0 S 2 3 0 0";function Nv(e,t,i){const n=yv(e,t);if(!i){if(!n)return e;const i={...n};return delete i.path,xv(e,t,i.keyframes.length?i:void 0)}return vv(e,t)?e:xv(e,t,{...n??{target:t,keyframes:[]},target:t,path:i})}const Fv=/^(part|group|shape):/;function Bv(e){if(!e||"target"!==e.kind&&"keys"!==e.kind)return[];const t=[...e.target?[e.target]:[],...e.targets??[]];return[...new Set(t)].filter(e=>Fv.test(e))}function Iv(e,t){const i=[...new Set(e)];if(!i.length)return{kind:"none"};const n=t&&i.includes(t)?t:i[i.length-1];return{kind:"target",target:n,targets:[n,...i.filter(e=>e!==n)]}}function Zv(e,t){e.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:t},bubbles:!0,composed:!0}))}function Kv(e,t,i,n=!1){e.dispatchEvent(new CustomEvent("doc-change",{detail:{doc:t,label:i,...n?{transient:!0}:{}},bubbles:!0,composed:!0}))}var Wv=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Uv={part:"mdi:vector-square",group:"mdi:folder-outline",shape:"mdi:draw"};let Gv=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this.density="full",this._icon="",this._busy=!1,this._error="",this._confirm=!1,this._resplit=!1,this._collapsed=new Set,this._status="",this._notice="",this._iconTyped=!1,this._list=new jf(this,{select:(e,t)=>{if(e.startsWith("tracks:"))return this._list.setOpen(e.slice(7),!this.layerView?.open.includes(e.slice(7)));if(e.startsWith("lane:"))return this.disabled?void 0:Pf(this,this.doc,e);const i=this._rows(),n=i.find(t=>t.ref===e);n&&t instanceof MouseEvent?this._onRowClick(t,n,i):n&&(this._anchor=n.ref,this._select([n.ref]))},move:(e,t)=>this._move("up"===t?1:-1,e),rename:e=>this._renaming=e,dblclick:e=>!this.disabled&&!this._list.refuseLocked(e,Vv(this.doc,e))&&(this._renaming=e),open:(e,t)=>e.startsWith("group:")?this._setOpen(e.slice(6),t):this._list.setOpen(e.startsWith("tracks:")?e.slice(7):e,t),nameOf:e=>e.startsWith("lane:")?Ef(e):this.doc?Vv(this.doc,e):e})}connectedCallback(){super.connectedCallback(),ws("mc-icon-picker")||"undefined"==typeof customElements||customElements.whenDefined("mc-icon-picker").then(()=>this.requestUpdate())}willUpdate(e){const t=e.get("doc");if(e.has("doc")&&t&&t.id!==this.doc?.id&&(this._icon="",this._iconTyped=!1,this._confirm=!1,this._resplit=!1,this._error="",this._notice=""),(e.has("doc")||e.has("tile"))&&!this._iconTyped&&this.doc){const e=hv(this.doc,this.tile);this._icon=e.startsWith("svg:")?"":e}}get _sel(){return Bv(this.selection)}_rows(){const e=this.doc,t=e?.rig;if(!e||!t)return[];const i=t=>yv(e,t)?.keyframes.length??0,n=[],s=new Set,a=[...t.parts].reverse();for(const e of a){const r=Mv(t,e.id);if(r){if(!s.has(r.id)&&(s.add(r.id),n.push({ref:ov(r.id),level:1,kind:"group",name:r.name,count:r.parts.length,keys:i(ov(r.id))}),!this._collapsed.has(r.id)))for(const e of a.filter(e=>Mv(t,e.id)?.id===r.id))n.push({ref:rv(e.id),level:2,kind:"part",name:e.name,count:e.from?.length??1,keys:i(rv(e.id))})}else n.push({ref:rv(e.id),level:1,kind:"part",name:e.name,count:e.from?.length??1,keys:i(rv(e.id))})}return n}_change(e,t,i=t){this._status=i,Kv(this,e,t)}_select(e,t){Zv(this,Iv(e,t))}async _split(){const e=this.doc;if(!e||this._busy||this.disabled)return;if(cv(e)&&!this._confirm)return void(this._confirm=!0);const t=!this._resplit&&e.rig?.svg?e.rig.svg:void 0,i=t?hv(e,this.tile):this._icon.trim()||hv(e,this.tile);if(t||/^[a-z0-9_-]+:[a-z0-9_-]+$/i.test(i)){this._busy=!0,this._error="";try{const n=await mv(i);if(this.doc?.id!==e.id)return;if(!n)return void(this._error=Zn(1019));const s=fv(n);if(!s.length)return void(this._error=Zn(1021));const a=function(e,t,i){const n=e.rig,s=new Set([...(n?.parts??[]).map(e=>rv(e.id)),...(n?.groups??[]).map(e=>ov(e.id))]),a=function(e,t){const i=e.slice(0,Gi).map((e,t)=>({id:`part-${t+1}`,name:Zn(646,{i:t+1}),from:[e.index]}));return{...t?.svg?{svg:t.svg}:t?.icon?{icon:t.icon}:{},parts:i}}(t,i);if(n?.shapes?.length){const e=new Set(n.shapes.map(e=>e.id));a.parts=a.parts.map(t=>e.has(t.id)?{...t,id:pv(a,"part",new Set([...e,...a.parts.map(e=>e.id)]))}:t),a.shapes=n.shapes}return _v(wv(e,s),a)}(this.doc??e,s,t?{svg:t}:{icon:i}),r=a.rig?.parts.length??0,o=s.length>Gi;this._notice=o?Zn(974,{count:s.length,parts:Gi}):"",this._change(a,"Split icon",o?Zn(883,{count:r,parts:Gi}):Zn(882,{count:r})),this._confirm=!1,this._resplit=!1,this._select([])}finally{this._busy=!1}}else this._error=Zn(1077)}_group(){const e=this.doc;if(!e||this.disabled)return;if(this._lockedSel())return;const t=Sv(e,this._sel);if(t)return void(this._status=t);const i=Cv(e,this._sel);i.id&&(this._change(i.doc,"Group parts",Zn(377,{count:$v(e,this._sel).length})),this._select([ov(i.id)]))}_ungroup(){const e=this.doc,t=this._sel.filter(e=>e.startsWith("group:"));if(!e||!t.length||this.disabled||this._lockedSel())return;let i=e;const n=[];for(const s of t)n.push(...(e.rig?.groups?.find(e=>`group:${e.id}`===s)?.parts??[]).map(rv)),i=Av(i,s.slice(6));this._change(i,"Ungroup",t.length>1?Zn(378):Zn(376)),this._select(n)}_merge(){const e=this.doc;if(!e||this.disabled||this._lockedSel())return;const t=function(e,t){const i=e.rig,n=$v(e,t).filter(e=>i?.parts.find(t=>t.id===e)?.from);if(!i||n.length<2)return{doc:e};const[s,...a]=n,r=[...new Set(n.flatMap(e=>i.parts.find(t=>t.id===e).from??[]))].sort((e,t)=>e-t),o=i.parts.filter(e=>!a.includes(e.id)).map(e=>e.id===s?{...e,from:r}:e),l=(i.groups??[]).map(e=>({...e,parts:e.parts.filter(e=>!a.includes(e))})),c=l.filter(e=>!e.parts.length).map(e=>ov(e.id)),d={...i,parts:o,...i.groups?{groups:l.filter(e=>e.parts.length)}:{}};return d.groups&&!d.groups.length&&delete d.groups,{doc:_v(wv(e,new Set([...a.map(rv),...c])),d),id:s}}(e,this._sel);t.id&&(this._change(t.doc,"Merge parts",Zn(660)),this._select([rv(t.id)]))}_splitBack(){const e=this.doc,t=this._sel.find(e=>e.startsWith("part:"));if(!e||!t||this.disabled||this._lockedSel())return;const i=function(e,t){const i=e.rig,n=i?.parts.find(e=>e.id===t);if(!i||!n?.from||n.from.length<2)return{doc:e,ids:[t]};const s=Gi-i.parts.length+1,a=n.from.slice(0,Math.max(1,s)),r=dv(i),o=a.slice(1).map(e=>{const t=pv(i,"part",r);return r.add(t),{id:t,name:Zn(647,{n:t.slice(5)}),from:[e]}}),l={...n,from:[a[0]]};delete l.origin;const c=i.parts.indexOf(n),d=[...i.parts.slice(0,c),l,...o,...i.parts.slice(c+1)],p=i.groups?.map(e=>e.parts.includes(t)?{...e,parts:[...e.parts,...o.map(e=>e.id)]}:e);return{doc:_v(e,{...i,parts:d,...p?{groups:p}:{}}),ids:[t,...o.map(e=>e.id)]}}(e,t.slice(5));i.ids.length<2||(this._change(i.doc,"Split part",Zn(884,{count:i.ids.length})),this._select(i.ids.map(rv)))}_lockedSel(){const e=this.doc,t=e&&this._sel.find(e=>this._list.locked(e));return!!t&&this._list.refuseLocked(t,Vv(e,t))}_move(e,t){const i=this.doc,n=t??this._sel.find(e=>e.startsWith("part:"));if(!i||!n||!n.startsWith("part:")||this.disabled)return;if(this._list.refuseLocked(n,Vv(i,n)))return;const s=function(e,t,i){const n=e.rig,s=n?.parts.findIndex(e=>e.id===t)??-1,a=s+i;if(!n||s<0||a<0||a>=n.parts.length)return e;const r=[...n.parts];return[r[s],r[a]]=[r[a],r[s]],_v(e,{...n,parts:r})}(i,n.slice(5),e);s!==i&&(this._change(s,"Move part",Zn(e>0?515:514)),this._list.announce(Zn(1237,{name:Vv(i,n),direction:Zn(e>0?1174:1127)})))}_setOpen(e,t){const i=new Set(this._collapsed);t?i.delete(e):i.add(e),this._collapsed=i}_rename(e,t){if(this._renaming!==e)return;this._renaming=void 0;const i=this.doc;i&&t.trim()&&t.trim()!==Vv(i,e)&&!this._list.refuseLocked(e,Vv(i,e))&&this._change(kv(i,e,t),"Rename part",Zn(748))}_onRowClick(e,t,i){if(this._renaming===t.ref)return;const n=this._sel;if(e.shiftKey&&this._anchor){const e=i.findIndex(e=>e.ref===this._anchor),n=i.findIndex(e=>e.ref===t.ref);if(e>=0&&n>=0){const[s,a]=e<n?[e,n]:[n,e];return void this._select(i.slice(s,a+1).map(e=>e.ref),t.ref)}}this._anchor=t.ref,e.ctrlKey||e.metaKey?this._select(n.includes(t.ref)?n.filter(e=>e!==t.ref):[...n,t.ref],t.ref):this._select([t.ref])}_onKey(e){if(this._renaming||this.disabled)return;const t=e.ctrlKey||e.metaKey,i=e.key.toLowerCase();if(t&&"g"===i)return e.preventDefault(),void(e.shiftKey?this._ungroup():this._group());const n=this._rows(),s=n.findIndex(t=>t.ref===(e.target.closest?.("li.lr")?.getAttribute("data-ref")??this.selection.target??this._anchor));if(e.shiftKey&&!e.altKey&&("ArrowDown"===e.key||"ArrowUp"===e.key)&&e.target.matches?.("[data-lk]")){if(/^(lane|tracks):/.test(e.target.dataset.lk??""))return;e.preventDefault();const t=n[Math.max(0,Math.min(n.length-1,s+("ArrowDown"===e.key?1:-1)))];if(!t)return;return s>=0?this._select([...this._sel,t.ref],t.ref):this._select([t.ref]),void this._focusRow(t.ref)}"Escape"===e.key&&this._sel.length&&e.target.matches?.("[data-lk]")&&(e.preventDefault(),this._select([]))}_focusRow(e){this._list.focusKey(e)}_iconBtn(e,t,i,s,a){return n.qy`<button
      type="button"
      class="icon-btn sm"
      title=${a?`${t} (${a})`:t}
      aria-label=${t}
      aria-keyshortcuts=${a??n.s6}
      ?disabled=${this.disabled||!s}
      @click=${i}
    >
      <ha-icon icon=${e}></ha-icon>
    </button>`}_renderSource(e){const t=this.doc,i=!!t.rig?.svg&&!this._resplit;return n.qy`<div class="source">
      ${i?n.qy`<p class="help">${Zn(990)}</p>`:ws("mc-icon-picker")?n.qy`<div class="field">
              <div class="field-head"><span class="lbl" id="pl-icon-l">${Zn(398)}</span></div>
              <mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label=${Zn(398)}
                aria-labelledby="pl-icon-l"
                @value-changed=${e=>{e.stopPropagation(),this._icon=String(e.detail?.value??"").trim(),this._iconTyped=""!==this._icon,this._error="",this._confirm=!1}}
              ></mc-icon-picker>
            </div>`:n.qy`<div class="field">
            <div class="field-head"><label for="pl-icon">${Zn(398)}</label></div>
            <input
              id="pl-icon"
              class="input mono"
              .value=${this._icon}
              placeholder=${hv(t,this.tile)}
              spellcheck="false"
              ?disabled=${this.disabled||this._busy}
              @input=${e=>{this._icon=e.target.value,this._iconTyped=""!==this._icon.trim(),this._error=""}}
              @keydown=${e=>"Enter"===e.key&&void this._split()}
            />
          </div>`}
      ${this._error?n.qy`<p class="help error" role="alert">${this._error}</p>`:n.s6}
      <div class="actions">
        <button type="button" class="btn ${e?"btn-secondary":"btn-primary"} btn-sm" ?disabled=${this.disabled||this._busy} @click=${()=>{this._split()}}>
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy?Zn(887):this._confirm?Zn(755,{count:t.rig?.parts.length??0}):Zn(e?878:881)}
        </button>
        ${e?n.qy`<button
              type="button"
              class="btn btn-text btn-sm"
              @click=${()=>{this._resplit=!1,this._confirm=!1,this._error=""}}
            >
              ${Zn(129)}
            </button>`:n.s6}
      </div>
      ${this._confirm?n.qy`<p class="help">${Zn(886)}</p>`:n.s6}
    </div>`}_renderRow(e,t,i){const s=this.doc,a="group"===e.kind?e.ref.slice(6):"",r=s.rig?.parts??[],o="part"===e.kind?r.findIndex(t=>`part:${t.id}`===e.ref):-1,l=this._list.locked(e.ref),c=Qr(s,e.ref).length>0,d="group"===e.kind?void 0:Lf(s,this.layerView??Gr,e.ref,e.ref),p=this._list.row({key:e.ref,name:e.name,icon:Uv[e.kind],note:"part"===e.kind&&e.count>1?Zn(1199,{count:e.count}):void 0,badge:e.keys?Zn(1187,{count:e.keys}):void 0,level:e.level,expanded:"group"===e.kind?!this._collapsed.has(a):d,selected:i.includes(e.ref)&&!(d&&"part"===e.kind&&"keys"===this.selection.kind),renamable:!0,up:"part"===e.kind?{ok:!this.disabled&&o>=0&&o<r.length-1&&!l,label:Zn(509,{name:e.name}),menu:Zn(502)}:void 0,down:"part"===e.kind?{ok:!this.disabled&&o>0&&!l,label:Zn(507,{name:e.name}),menu:Zn(481)}:void 0,renaming:this._renaming===e.ref?n.qy`<input
              class="input rename"
              aria-label=${Zn(554)}
              .value=${e.name}
              maxlength="80"
              @click=${e=>e.stopPropagation()}
              @keydown=${t=>{t.stopPropagation(),"Enter"===t.key&&(this._rename(e.ref,t.target.value),this._focusRow(e.ref)),"Escape"===t.key&&(this._renaming=void 0,this._focusRow(e.ref))}}
              @blur=${t=>this._rename(e.ref,t.target.value)}
            />`:void 0});if("group"===e.kind){if(!c||this._collapsed.has(a))return[p];const t=!!Lf(s,this.layerView??Gr,e.ref,e.ref),i=this._list.row({key:`tracks:${e.ref}`,name:Zn(1041),bare:!0,level:2,expanded:t,selected:!1,toggles:[],describe:Zn(1141,{name:e.name})});return t?[p,i,...Hf(this._list,s,this.selection,e.ref,3)]:[p,i]}return d?[p,...Hf(this._list,s,this.selection,e.ref,2===e.level?3:2)]:[p]}render(){const e=this.doc;if(!e||"keyframes"!==e.kind)return n.qy``;const t=cv(e),i=this._rows(),s=this._sel,a=$v(e,s),r=1===s.length?s[0]:void 0,o=a.length>=2&&a.every(t=>e.rig?.parts.find(e=>e.id===t)?.from),l=!!r&&r.startsWith("part:")&&(e.rig?.parts.find(e=>`part:${e.id}`===r)?.from?.length??0)>1,c=r?.startsWith("part:")?e.rig.parts.findIndex(e=>`part:${e.id}`===r):-1;return n.qy`<div class="parts" @keydown=${this._onKey}>
      ${!t||this._resplit||this._confirm?n.qy`${t?n.s6:n.qy`<p class="lead">${Zn(885)}</p>`}${this._renderSource(t)}`:n.s6}
      ${t?n.qy`<div class="bar" role="toolbar" aria-label=${Zn(642)}>
              ${this._iconBtn("mdi:group",Zn(373),()=>this._group(),!Sv(e,s),Zn(211))}
              ${this._iconBtn("mdi:ungroup",Zn(1061),()=>this._ungroup(),s.some(e=>e.startsWith("group:")),Zn(212))}
              ${this._iconBtn("mdi:set-merge",Zn(464),()=>this._merge(),o)}
              ${this._iconBtn("mdi:call-split",Zn(880),()=>this._splitBack(),l)}
              ${this._iconBtn("mdi:arrow-up",Zn(502),()=>this._move(1),c>=0&&c<e.rig.parts.length-1,Zn(53))}
              ${this._iconBtn("mdi:arrow-down",Zn(482),()=>this._move(-1),c>0,Zn(52))}
            </div>
            <ul class="tree" aria-label=${Zn(396)}>
              ${i.map(e=>this._renderRow(e,i,s))}
            </ul>
            ${this._notice?n.qy`<p class="help notice" role="note">${this._notice}</p>`:n.s6}
            <p class="help">${Zn(163)}</p>
            ${this._resplit||this._confirm?n.s6:n.qy`<div>
                  <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>(this._resplit=!0,this._confirm=!1)}>
                    <ha-icon icon="mdi:scissors-cutting"></ha-icon>${Zn(878)}
                  </button>
                </div>`}`:n.s6}
      <p class="sr-only" role="status" aria-live="polite">${this._status}</p>
    </div>`}};Gv.styles=[ms,gs,zf,n.AH`
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
    `],Wv([(0,s.MZ)({attribute:!1})],Gv.prototype,"doc",void 0),Wv([(0,s.MZ)({attribute:!1})],Gv.prototype,"hass",void 0),Wv([(0,s.MZ)({attribute:!1})],Gv.prototype,"library",void 0),Wv([(0,s.MZ)({type:Number})],Gv.prototype,"time",void 0),Wv([(0,s.MZ)({type:Boolean})],Gv.prototype,"disabled",void 0),Wv([(0,s.MZ)({attribute:!1})],Gv.prototype,"selection",void 0),Wv([(0,s.MZ)({attribute:!1})],Gv.prototype,"tile",void 0),Wv([(0,s.MZ)({attribute:!1})],Gv.prototype,"stage",void 0),Wv([(0,s.MZ)({attribute:!1})],Gv.prototype,"layerView",void 0),Wv([(0,s.MZ)()],Gv.prototype,"density",void 0),Wv([(0,s.wk)()],Gv.prototype,"_renaming",void 0),Wv([(0,s.wk)()],Gv.prototype,"_icon",void 0),Wv([(0,s.wk)()],Gv.prototype,"_busy",void 0),Wv([(0,s.wk)()],Gv.prototype,"_error",void 0),Wv([(0,s.wk)()],Gv.prototype,"_confirm",void 0),Wv([(0,s.wk)()],Gv.prototype,"_resplit",void 0),Wv([(0,s.wk)()],Gv.prototype,"_collapsed",void 0),Wv([(0,s.wk)()],Gv.prototype,"_status",void 0),Wv([(0,s.wk)()],Gv.prototype,"_notice",void 0),Gv=Wv([(0,s.EM)("mc-anim-parts-layers")],Gv),$s({tag:"mc-anim-parts-layers",place:"layers",title:396,order:20,when:e=>"keyframes"===e.kind});var Yv=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};function Jv(e){const t=(e??"").split(/[\s,]+/).map(Number);return 4===t.length&&t.every(Number.isFinite)&&t[2]>0&&t[3]>0?t:void 0}let Xv=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._vb=[0,0,24,24],this._scale=1,this._watched=new WeakSet}connectedCallback(){super.connectedCallback(),"undefined"!=typeof ResizeObserver&&(this._watched=new WeakSet,this._ro=new ResizeObserver(()=>requestAnimationFrame(()=>this._measure())),this._ro.observe(this))}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}get _pieces(){return this._geom?fv(this._geom):[]}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=hv(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=uv(e),this._geom||mv(e).then(t=>{this._ref===e&&t&&(this._geom=t)}))}e.has("doc")&&!this._drag&&(this._live=void 0)}updated(){requestAnimationFrame(()=>this._measure())}_icon(){return this.iconEl??function(e){let t=e;for(;t;)if(t instanceof Element){const e=t.shadowRoot?.querySelector("magic-card")??t.querySelector("magic-card");if(e)return e.shadowRoot?.querySelector('[data-mc-part="icon"]')??void 0;t=t.parentElement??t.getRootNode().host??null}else t=t.host??null}(this)}_measure(){if(!this.isConnected)return;const e=this._icon(),t=this.getBoundingClientRect(),i=this.offsetWidth>0&&t.width>0?t.width/this.offsetWidth:1;let n,s;for(const t of[e,e?.getRootNode()?.host])t&&this._ro&&!this._watched.has(t)&&(this._watched.add(t),this._ro.observe(t));if(e){const a=e.shadowRoot?.querySelector('svg[part="svg"]'),r=(a??e).getBoundingClientRect();r.width>0&&(n={x:(r.left-t.left)/i,y:(r.top-t.top)/i,w:r.width/i,h:r.height/i}),s=Jv(a?.getAttribute("viewBox"))}if(!n&&this.stage?.subject){const e=this.stage.subject;n={x:e.x,y:e.y,w:e.width,h:e.height}}s??=this.stage?.viewBox??Jv(this._geom?.viewBox)??[0,0,24,24],((e,t)=>!!e&&!!t&&Math.abs(e.x-t.x)<.5&&Math.abs(e.y-t.y)<.5&&Math.abs(e.w-t.w)<.5&&Math.abs(e.h-t.h)<.5)(n,this._box)||!n&&!this._box||(this._box=n),s.join(" ")!==this._vb.join(" ")&&(this._vb=s);const a=this.offsetWidth>0&&t.width>0?i:this.stage&&this.stage.scale>0?this.stage.scale:1;Math.abs(a-this._scale)>.001&&(this._scale=a)}get _unit(){return this._box&&this._box.w>0?this._vb[2]/(this._box.w*(this._scale||1)):.1}_toVb(e){const t=this.renderRoot.querySelector("svg.ov"),i=t?.getBoundingClientRect();return i&&i.width?[this._vb[0]+(e.clientX-i.left)/i.width*this._vb[2],this._vb[1]+(e.clientY-i.top)/i.height*this._vb[3]]:[0,0]}_lk(e){return!!this.doc&&!!this.layerView?.locked.length&&ro(this.doc,this.layerView,e)}get _sel(){return Bv(this.selection)}_pick(e,t){const i=this._sel;t.shiftKey?Zv(this,Iv([...i,e],e)):t.ctrlKey||t.metaKey?Zv(this,Iv(i.includes(e)?i.filter(t=>t!==e):[...i,e],e)):Zv(this,Iv([e],e))}_onDown(e){if(this.disabled||e.button>0||!this.doc)return;const t=e.target,i=t.closest("[data-pivot]")?.getAttribute("data-pivot"),n=t.closest("[data-anchor]")?.getAttribute("data-anchor"),s=t.closest("[data-ref]")?.getAttribute("data-ref"),a=this._toVb(e),r={pointerId:e.pointerId,kind:"band",start:a,startClient:[e.clientX,e.clientY],startDoc:this.doc,moved:!1,additive:e.shiftKey||e.ctrlKey||e.metaKey};if(i){if(this._lk(i))return;this._drag={...r,kind:"pivot",ref:i}}else if(null!=n&&this.selection.target){if(this._lk(this.selection.target))return;const e=yv(this.doc,this.selection.target)?.path?.d;if(!e)return;this._drag={...r,kind:"anchor",ref:this.selection.target,index:Number(n),path:rr(e)}}else{if(s)return void this._pick(s,e);this._drag=r}e.preventDefault(),e.currentTarget.setPointerCapture?.(e.pointerId)}_onMove(e){const t=this._drag;if(!t){const t=e.target.closest?.("[data-ref]")?.getAttribute("data-ref");return void(t!==this._hover&&(this._hover=t))}if(e.pointerId!==t.pointerId)return;if(!t.moved&&Math.hypot(e.clientX-t.startClient[0],e.clientY-t.startClient[1])<3)return;t.moved=!0;const i=this._toVb(e),n=e.shiftKey?0:.25;if("band"===t.kind)this._band=[t.start,i];else if("pivot"===t.kind&&t.ref){const e=[(0,ar.snap)(i[0],n),(0,ar.snap)(i[1],n)];this._live={ref:t.ref,pivot:e},Kv(this,Lv(this.doc,t.ref,e),"Move pivot",!0)}else if("anchor"===t.kind&&t.ref&&t.path&&void 0!==t.index){const e=this._pivotOf(t.ref)??[0,0],s=(0,ar.serialize)((0,ar.moveAnchor)(t.path,t.index,(0,ar.snap)(i[0]-e[0],n),(0,ar.snap)(i[1]-e[1],n)));this._live={ref:t.ref,path:s};const a=yv(this.doc,t.ref);Kv(this,Nv(this.doc,t.ref,{...a.path,d:s}),"Move path point",!0)}}_onUp(e){const t=this._drag;if(!t||e.pointerId!==t.pointerId)return;this._drag=void 0;const i=this.doc,n=this._live;if(this._live=void 0,"band"===t.kind){const e=this._band;if(this._band=void 0,!t.moved||!e)return void(t.additive||Zv(this,{kind:"none"}));const[n,s]=e,a=Math.min(n[0],s[0]),r=Math.max(n[0],s[0]),o=Math.min(n[1],s[1]),l=Math.max(n[1],s[1]),c=(i.rig?.parts??[]).map(e=>rv(e.id)).filter(e=>!this._lk(e)).filter(e=>{const t=Pv(i,e,this._pieces);return!!t&&t[0]>=a&&t[0]+t[2]<=r&&t[1]>=o&&t[1]+t[3]<=l});return void Zv(this,Iv(t.additive?[...this._sel,...c]:c))}if(t.moved&&("pivot"===t.kind&&t.ref&&n?.pivot&&Kv(this,Lv(i,t.ref,n.pivot),"Move pivot"),"anchor"===t.kind&&t.ref&&n?.path)){const e=yv(i,t.ref);e?.path&&Kv(this,Nv(i,t.ref,{...e.path,d:n.path}),"Move path point")}}_onCancel(e){const t=this._drag;t&&e.pointerId===t.pointerId&&(this._drag=void 0,this._band=void 0,this._live=void 0,t.moved&&"band"!==t.kind&&Kv(this,t.startDoc,"pivot"===t.kind?Zn(492):Zn(491)))}_onPivotKey(e,t){const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!i||this.disabled||!this.doc||this._lk(t))return;e.preventDefault();const n=e.shiftKey?1:.25,s=this._pivotOf(t)??[12,12];this._nudge?.ref!==t&&(this._nudge={ref:t,doc:this.doc}),Kv(this,Lv(this.doc,t,[s[0]+i[0]*n,s[1]+i[1]*n]),"Move pivot",!0)}_onKeyUp(e){const t=this._nudge;t&&e.key.startsWith("Arrow")&&this.doc&&(this._nudge=void 0,this.doc!==t.doc&&Kv(this,this.doc,"Move pivot"))}_onKey(e){if(this.doc&&!this.disabled)if(!e.ctrlKey&&!e.metaKey||"g"!==e.key.toLowerCase()||e.shiftKey)"Escape"===e.key&&this._sel.length&&(e.preventDefault(),Zv(this,{kind:"none"}));else{if(this._sel.some(e=>this._lk(e)))return;const t=Cv(this.doc,this._sel);if(!t.id)return;e.preventDefault(),Kv(this,t.doc,"Group parts"),Zv(this,Iv([ov(t.id)]))}}_pivotOf(e){return this._live?.ref===e&&this._live.pivot?this._live.pivot:this.doc?Hv(this.doc,e,this._pieces,this._vb):void 0}_partPaths(e){const t=this.doc,i=this._pieces;return $v(t,[e]).flatMap(e=>(t.rig.parts.find(t=>t.id===e)?.from??[]).map(e=>i[e]?.d).filter(e=>!!e))}_selected(e,t){const i=this.doc;return e.flatMap(e=>{if(!/^(part|group):/.test(e))return[];const s=Pv(i,e,this._pieces),a=this._pivotOf(e),r=e===this.selection.target,o=[];if(o.push(n.JW`${this._partPaths(e).map(e=>n.JW`<path class="sel-outline" d=${e}></path>`)}`),s&&o.push(n.JW`<rect class="bbox" x=${s[0]} y=${s[1]} width=${s[2]} height=${s[3]}></rect>`),a&&r&&!this._lk(e)){const s=Vv(i,e);o.push(n.JW`<g
          class="pivot"
          data-pivot=${e}
          tabindex="0"
          role="slider"
          aria-label=${qv(i,e)?Zn(709,{name:s}):Zn(678,{name:s})}
          aria-valuetext=${`x ${a[0].toFixed(2)}, y ${a[1].toFixed(2)}`}
          @keydown=${t=>this._onPivotKey(t,e)}
        >
          <circle class="pivot-hit" cx=${a[0]} cy=${a[1]} r=${12*t}></circle>
          <circle class="pivot-ring" cx=${a[0]} cy=${a[1]} r=${5*t} style=${"stroke-width: "+2*t}></circle>
          <path class="pivot-cross" d=${`M${a[0]-9*t} ${a[1]}H${a[0]+9*t}M${a[0]} ${a[1]-9*t}V${a[1]+9*t}`} style=${"stroke-width: "+1.5*t}></path>
        </g>`)}return o})}_motionPath(e){const t=this.selection.target;if(!t||!this.doc||!/^(part|group):/.test(t))return n.s6;const i=this._live?.ref===t&&this._live.path?this._live.path:yv(this.doc,t)?.path?.d,s=this._pivotOf(t);if(!i||!s)return n.s6;const a=rr(i);return n.JW`<g class="mpath" transform=${`translate(${s[0]} ${s[1]})`}>
      <path class="mline" d=${i} style=${"stroke-width: "+2*e}></path>
      ${this._lk(t)?n.s6:a.anchors.map((t,i)=>n.JW`<g class="anchor" data-anchor=${i}>
          <circle class="anchor-hit" cx=${t.x} cy=${t.y} r=${12*e}></circle>
          <circle class="anchor-dot" cx=${t.x} cy=${t.y} r=${4.5*e} style=${"stroke-width: "+1.5*e}></circle>
        </g>`)}
    </g>`}render(){const e=this.doc;if(!e||!cv(e))return n.qy``;const t=this._box,i=this._unit,s=this._sel,a=this.layerView,r=a?no(e,a):new Set,o=this._vb,l=this._band,c=this._hover&&!s.includes(this._hover)?this._hover:void 0,d=e.rig.parts.map(e=>rv(e.id)).filter(t=>!(r.has(t)||r.has(ov(Mv(e.rig,t.slice(5))?.id??""))||a&&ro(e,a,t))).map(e=>n.JW`<g class="hit" data-ref=${e}>${this._partPaths(e).map(e=>n.JW`<path d=${e} style=${"stroke-width: "+8*i}></path>`)}</g>`);return n.qy`<div
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
            aria-label=${Zn(397)}
          >
            ${d}
            ${c?n.JW`${this._partPaths(c).map(e=>n.JW`<path class="hover" d=${e} style=${"stroke-width: "+2*i}></path>`)}`:n.s6}
            <g style=${`--u: ${i}`}>${this._selected(s,i)}</g>
            ${this._motionPath(i)}
            ${l?n.JW`<rect class="band" x=${Math.min(l[0][0],l[1][0])} y=${Math.min(l[0][1],l[1][1])}
                  width=${Math.abs(l[1][0]-l[0][0])} height=${Math.abs(l[1][1]-l[0][1])} style=${`stroke-width: ${i}`}></rect>`:n.s6}
          </svg>`:n.s6}
    </div>`}};Xv.styles=n.AH`
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
  `,Yv([(0,s.MZ)({attribute:!1})],Xv.prototype,"doc",void 0),Yv([(0,s.MZ)({attribute:!1})],Xv.prototype,"hass",void 0),Yv([(0,s.MZ)({attribute:!1})],Xv.prototype,"library",void 0),Yv([(0,s.MZ)({type:Number})],Xv.prototype,"time",void 0),Yv([(0,s.MZ)({type:Boolean})],Xv.prototype,"disabled",void 0),Yv([(0,s.MZ)({attribute:!1})],Xv.prototype,"selection",void 0),Yv([(0,s.MZ)({attribute:!1})],Xv.prototype,"tile",void 0),Yv([(0,s.MZ)({attribute:!1})],Xv.prototype,"stage",void 0),Yv([(0,s.MZ)({attribute:!1})],Xv.prototype,"layerView",void 0),Yv([(0,s.MZ)({attribute:!1})],Xv.prototype,"iconEl",void 0),Yv([(0,s.wk)()],Xv.prototype,"_box",void 0),Yv([(0,s.wk)()],Xv.prototype,"_vb",void 0),Yv([(0,s.wk)()],Xv.prototype,"_scale",void 0),Yv([(0,s.wk)()],Xv.prototype,"_hover",void 0),Yv([(0,s.wk)()],Xv.prototype,"_band",void 0),Yv([(0,s.wk)()],Xv.prototype,"_geom",void 0),Yv([(0,s.wk)()],Xv.prototype,"_live",void 0),Xv=Yv([(0,s.EM)("mc-anim-parts-overlay")],Xv),$s({tag:"mc-anim-parts-overlay",place:"stage-tool",title:396,order:20,when:(e,t)=>"keyframes"===e.kind&&cv(e)&&"tool"!==t.kind});var Qv=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const eb=[{fx:0,fy:0,label:1038},{fx:.5,fy:0,label:1037},{fx:1,fy:0,label:1039},{fx:0,fy:.5,label:433},{fx:.5,fy:.5,label:141},{fx:1,fy:.5,label:766},{fx:0,fy:1,label:112},{fx:.5,fy:1,label:111},{fx:1,fy:1,label:113}],tb=e=>Math.round(100*e)/100,ib=(e,t,i)=>[tb(e[0]+e[2]*t),tb(e[1]+e[3]*i)];let nb=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._drawFrom=0,this._drawTo=60}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=hv(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=uv(e),this._geom||mv(e).then(t=>{this._ref===e&&t&&(this._geom=t)}))}const t=this._target;if((e.has("selection")||e.has("doc"))&&t&&this.doc){const e=Dv(this.doc,t);if(e.length>=2){let t=0;for(;t+1<e.length&&e[t+1][1]===e[0][1];)t++;let i=e.length-1;for(;i-1>t&&e[i-1][1]===e[e.length-1][1];)i--;this._drawFrom=e[t][0],this._drawTo=e[i][0]}}}get _target(){const e=this.selection?.target;return lv(e)&&this.doc&&function(e,t){const i=av(t);return t.startsWith("part:")?!!e.rig?.parts.some(e=>e.id===i):t.startsWith("group:")?!!e.rig?.groups?.some(e=>e.id===i):!!t.startsWith("shape:")&&!!e.rig?.shapes?.some(e=>e.id===i)}(this.doc,e)?e:void 0}_drawMode(e){const t=Dv(this.doc,e);if(!t.length)return"none";const i=t[0][1],n=t[t.length-1][1],s=t.every((e,s)=>0===s||(i<n?e[1]>=t[s-1][1]:e[1]<=t[s-1][1]));return s&&0===i&&1===n?"on":s&&1===i&&0===n?"off":"custom"}_emit(e,t){Kv(this,e,t)}_renderName(e){const t=this.doc,i=e.startsWith("group:"),s=$v(t,[e]),a=i?0:t.rig?.parts.find(t=>t.id===av(e))?.from?.length??0,r=i?Zn(374,{count:s.length}):a>1?Zn(643,{pieces:a}):Zn(641);return n.qy`<div class="head">
        <span class="tile-icon"><ha-icon icon=${i?"mdi:folder-outline":"mdi:vector-square"}></ha-icon></span>
        <div class="titles">
          <span class="title">${Vv(t,e)}</span>
          <span class="caption">${r} · <span class="mono">${av(e)}</span></span>
        </div>
      </div>
      <div class="field">
        <div class="field-head"><label for="pi-name">${Zn(554)}</label></div>
        <input
          id="pi-name"
          class="input"
          .value=${Vv(t,e)}
          maxlength="80"
          ?disabled=${this.disabled}
          @change=${n=>{const s=n.target.value;s.trim()&&s.trim()!==Vv(t,e)&&this._emit(kv(t,e,s),Zn(i?745:746))}}
        />
      </div>
      ${i?n.qy`<div class="chips">
            ${s.map(e=>n.qy`<button type="button" class="chip" @click=${()=>Zv(this,Iv([`part:${e}`]))}>${Vv(t,`part:${e}`)}</button>`)}
          </div>`:n.s6}`}_renderPivot(e){const t=this.doc,i=this._geom?fv(this._geom):[],s=Pv(t,e,i),a=e.startsWith("group:"),r=a?t.rig?.groups?.find(t=>t.id===av(e))?.origin:t.rig?.parts.find(t=>t.id===av(e))?.origin,o=qv(t,e),l=Hv(t,e,i,Mr(this._geom?.viewBox))??r,c=(i,n)=>this._emit(Lv(t,e,[i,n]),"Move pivot"),d=()=>this._emit(o?Lv(t,e,ib(s,.5,.5)):jv(t,e,void 0),Zn(o?492:757)),p=(e,t)=>n.qy`<div class="field">
      <div class="field-head"><label for="pi-p${e}">${t}</label></div>
      <div class="unit">
        <input
          id="pi-p${e}"
          class="input"
          type="number"
          step="0.25"
          inputmode="decimal"
          .value=${l?String(tb(l[e])):""}
          placeholder=${Zn(141)}
          ?disabled=${this.disabled}
          @change=${t=>{const i=Number(t.target.value);if(!Number.isFinite(i)||""===t.target.value)return;const n=l??[12,12];0===e?c(i,n[1]):c(n[0],i)}}
        />
        <span class="suffix" aria-hidden="true">${Zn(1172)}</span>
      </div>
    </div>`;return n.qy`<section class="group" aria-labelledby="pi-pivot">
      <div class="group-head">
        <ha-icon icon="mdi:crosshairs-gps"></ha-icon>
        <h3 id="pi-pivot">${Zn(677)}</h3>
        <span class=${o?"src is-preset":"src"} data-pivot-source=${o?"track":"part"}>${Zn(o?708:a?375:644)}</span>
        ${o?n.s6:(h=!!r,u=()=>this._emit(jv(t,e,void 0),"Reset pivot"),h?n.qy`<button
    type="button"
    class="icon-btn sm field-reset"
    aria-label=${(0,N.t)(386,{label:"pivot"})}
    title=${(0,N.t)(385)}
    @click=${e=>{e.stopPropagation(),u()}}
  >
    <ha-icon icon="mdi:backup-restore"></ha-icon>
  </button>`:n.s6)}
      </div>
      <p class="help">
        ${Zn(o?a?996:997:a?994:995)}
      </p>
      <div class="pair">${p(0,"X")} ${p(1,"Y")}</div>
      ${s?n.qy`<div class="grid3" role="group" aria-label=${Zn(a?679:680)}>
            ${eb.map(e=>{const[t,i]=ib(s,e.fx,e.fy),a=!!l&&Math.abs(l[0]-t)<.01&&Math.abs(l[1]-i)<.01;return n.qy`<button
                type="button"
                class="cell"
                aria-label=${Zn(681,{position:Zn(e.label).toLowerCase()})}
                title=${Zn(e.label)}
                aria-pressed=${a?"true":"false"}
                ?disabled=${this.disabled}
                @click=${()=>.5===e.fx&&.5===e.fy?d():c(t,i)}
              >
                <i></i>
              </button>`})}
          </div>`:n.s6}
      ${o?n.qy`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>this._emit(Ev(t,e,void 0),"Reset to part pivot")}>
              ${Zn(a?758:759)}
            </button>
          </div>`:n.s6}
    </section>`;var h,u}_renderDraw(e){const t=this.doc,i=this._drawMode(e),s=vv(t,e),a=i=>this._emit(Ov(t,e,i,this._drawFrom,this._drawTo),Zn("none"===i?733:"on"===i?276:275)),r=[{id:"none",label:Zn(616)},{id:"on",label:Zn(276)},{id:"off",label:Zn(275)}],o=(t,s,a,r)=>n.qy`<div class="field">
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
          .value=${String(a)}
          ?disabled=${this.disabled}
          @change=${t=>{const n=Math.max(0,Math.min(100,Number(t.target.value)));Number.isFinite(n)&&(r(n),"on"!==i&&"off"!==i||this._emit(Ov(this.doc,e,i,this._drawFrom,this._drawTo),"Draw timing"))}}
        />
        <span class="suffix" aria-hidden="true">%</span>
      </div>
    </div>`;return n.qy`<section class="group" aria-labelledby="pi-draw">
      <div class="group-head">
        <ha-icon icon="mdi:draw"></ha-icon>
        <h3 id="pi-draw">${Zn(272)}</h3>
      </div>
      <p class="help">${Zn(988)}</p>
      <div class="seg full" role="radiogroup" aria-label=${Zn(272)}>
        ${r.map(e=>n.qy`<button type="button" role="radio" aria-checked=${i===e.id?"true":"false"} ?disabled=${this.disabled||s&&"none"!==e.id} @click=${()=>a(e.id)}>${e.label}</button>`)}
      </div>
      ${s?n.qy`<p class="help cap">${bv()}</p>`:n.s6}
      ${"custom"===i?n.qy`<p class="help">${Zn(1027)}</p>`:n.s6}
      ${"none"!==i?n.qy`<div class="pair">
            ${o("pi-df",Zn(904),this._drawFrom,e=>this._drawFrom=e)}
            ${o("pi-dt",Zn(188),this._drawTo,e=>this._drawTo=Math.max(e,this._drawFrom))}
          </div>`:n.s6}
    </section>`}_renderPath(e){const t=this.doc,i=yv(t,e)?.path,s=!i&&vv(t,e);return n.qy`<section class="group" aria-labelledby="pi-path">
      <div class="group-head">
        <ha-icon icon="mdi:vector-curve"></ha-icon>
        <h3 id="pi-path">${Zn(474)}</h3>
      </div>
      <div class="switch-row">
        <div class="txt">
          <span class="lbl">${Zn(355)}</span>
          <p class="help">${Zn(520)}</p>
        </div>
        <button type="button" class="switch" role="switch" aria-checked=${i?"true":"false"} aria-label=${Zn(355)} ?disabled=${this.disabled||s} @click=${()=>this._emit(Nv(t,e,i?void 0:{d:Rv}),Zn(i?738:30))}></button>
      </div>
      ${s?n.qy`<p class="help cap">${bv()}</p>`:n.s6}
      ${i?n.qy`<div class="field">
              <div class="field-head"><label for="pi-tpl">${Zn(830)}</label></div>
              <div class="select">
                <select
                  id="pi-tpl"
                  class="input"
                  ?disabled=${this.disabled}
                  @change=${n=>{const s=n.target.value;if(!s)return;const a="arc"===s?Rv:gr(s,[0,0],4);this._emit(Nv(t,e,{...i,d:a}),"Path shape"),n.target.value=""}}
                >
                  <option value="">${Zn(754)}</option>
                  <option value="arc">${Zn(70)}</option>
                  ${ur.map(e=>n.qy`<option value=${e.id}>${Zn(e.label)}</option>`)}
                </select>
                <ha-icon icon="mdi:chevron-down"></ha-icon>
              </div>
            </div>
            <div class="switch-row">
              <div class="txt"><span class="lbl">${Zn(1055)}</span></div>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${i.follow_rotation?"true":"false"}
                aria-label=${Zn(1055)}
                ?disabled=${this.disabled}
                @click=${()=>this._emit(Nv(t,e,{...i,follow_rotation:!i.follow_rotation}),"Path rotation")}
              ></button>
            </div>`:n.s6}
    </section>`}_renderKeys(e){const t=this.doc,i=yv(t,e),s=i?.keyframes.length??0;return n.qy`<section class="group" aria-labelledby="pi-keys">
      <div class="group-head">
        <ha-icon icon="mdi:timeline-outline"></ha-icon>
        <h3 id="pi-keys">${Zn(421)}</h3>
      </div>
      <p class="help">
        ${s?Zn(1188,{count:s}):Zn(579)}
      </p>
      ${i?n.qy`<div>
            <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>this._emit(xv(t,e,void 0),"Remove part animation")}>
              ${Zn(742)}
            </button>
          </div>`:n.s6}
    </section>`}render(){const e=this._target;return this.doc&&e?n.qy`<div class="insp">
      ${this._renderName(e)} ${this._renderPivot(e)} ${this._renderDraw(e)} ${this._renderPath(e)} ${this._renderKeys(e)}
    </div>`:n.qy``}};nb.styles=[ms,gs,n.AH`
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
    `],Qv([(0,s.MZ)({attribute:!1})],nb.prototype,"doc",void 0),Qv([(0,s.MZ)({attribute:!1})],nb.prototype,"hass",void 0),Qv([(0,s.MZ)({attribute:!1})],nb.prototype,"library",void 0),Qv([(0,s.MZ)({type:Number})],nb.prototype,"time",void 0),Qv([(0,s.MZ)({type:Boolean})],nb.prototype,"disabled",void 0),Qv([(0,s.MZ)({attribute:!1})],nb.prototype,"selection",void 0),Qv([(0,s.MZ)({attribute:!1})],nb.prototype,"tile",void 0),Qv([(0,s.MZ)({attribute:!1})],nb.prototype,"stage",void 0),Qv([(0,s.wk)()],nb.prototype,"_geom",void 0),Qv([(0,s.wk)()],nb.prototype,"_drawFrom",void 0),Qv([(0,s.wk)()],nb.prototype,"_drawTo",void 0),nb=Qv([(0,s.EM)("mc-anim-part-inspector")],nb),$s({tag:"mc-anim-part-inspector",place:"inspector",title:641,order:20,when:(e,t)=>"keyframes"===e.kind&&("target"===t.kind||"keys"===t.kind)&&lv(t.target)});const sb=["select","pen","line","rect","ellipse","freehand","erase","motion"],ab=e=>"string"==typeof e&&sb.includes(e),rb=e=>"string"==typeof e&&e.startsWith("shape:"),ob=e=>"string"==typeof e&&/^(part|group|shape):/.test(e);function lb(e,t){return"keyframes"===e.kind&&"tool"===t.kind&&ab(t.tool)}function cb(e){return"target"===e.kind||"tool"===e.kind&&"select"===e.tool?(e=>rb(e)?e.slice(6):void 0)(e.target):void 0}function db(e){return"tool"===e.kind&&ab(e.tool)?e.tool:"select"}const pb={select:{label:804,icon:"mdi:cursor-default-outline",base:"shape",hint:164},pen:{label:671,icon:"mdi:fountain-pen-tip",base:"path",hint:167},line:{label:441,icon:"mdi:vector-line",base:"line",hint:265},rect:{label:722,icon:"mdi:square-rounded-outline",base:"rect",hint:267},ellipse:{label:307,icon:"mdi:ellipse-outline",base:"ellipse",hint:266},freehand:{label:360,icon:"mdi:draw",base:"stroke",hint:273},erase:{label:321,icon:"mdi:eraser",base:"shape",hint:165},motion:{label:474,icon:"mdi:map-marker-path",base:"path",hint:278}},hb={fill:"currentColor",stroke:"",strokeWidth:1.5,linecap:"round",layer:"over",radius:2,tolerance:.4,grid:!0,anchors:!0,follow:!1};function ub(e,t){const i=()=>({stroke:e.stroke||"currentColor",stroke_width:e.strokeWidth,linecap:e.linecap});if(!t)return i();const n={};return e.fill&&(n.fill=e.fill),e.stroke&&Object.assign(n,i()),e.fill||e.stroke||(n.fill="currentColor"),n}const mb=new class{constructor(){this.options={...hb},this.hint="",this._hintListeners=new Set,this._listeners=new Set}setHint(e){if(e!==this.hint){this.hint=e;for(const e of this._hintListeners)e()}}onHint(e){return this._hintListeners.add(e),()=>this._hintListeners.delete(e)}set(e){this.options={...this.options,...e},this._emit()}setLastFreehand(e){this.lastFreehand=e,this._emit()}subscribe(e){return this._listeners.add(e),()=>this._listeners.delete(e)}reset(){this.options={...hb},this.lastFreehand=void 0,this._emit()}_emit(){for(const e of this._listeners)e()}};let gb=e=>(0,Wm.WP)(e).map(e=>({index:e.index,d:e.d,...e.stroke?{stroke:e.stroke}:{},...e.secondary?{accent:!0}:{},...e.evenodd?{evenodd:!0}:{}}));function fb(e){const t=es(e??"icon","m",!1)?.icon;return"string"==typeof t?t:void 0}const vb=new Map;function bb(e,t){return e?.svg?Km(e):Mr(t?.viewBox).join(" ")}function yb(e,t){const i=e.rig;if(i?.svg){const e=function(e){const t=Ne(e);if(t.error)return;const i={paths:t.paths,viewBox:t.viewBox};return t.accentPaths.length&&(i.secondary=t.accentPaths),t.strokes.length&&(i.strokes=t.strokes),t.evenodd&&(i.evenodd=t.evenodd),i}(i.svg);return Promise.resolve(e?{viewBox:e.viewBox,pieces:gb(e)}:void 0)}const n=i?.icon??fb(t);if(!n)return Promise.resolve(void 0);let s=vb.get(n);return s||(s=sv(n,{timeoutMs:4e3}).then(e=>e?{viewBox:e.viewBox,pieces:gb(e)}:void 0).catch(()=>{}),vb.set(n,s),s.then(e=>{e||vb.delete(n)})),s}const xb="important",wb=" !"+xb,_b=(0,z.u$)(class extends z.WL{constructor(e){if(super(e),e.type!==z.OA.ATTRIBUTE||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const n=e[i];return null==n?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const n=t[e];if(null!=n){this.ft.add(e);const t="string"==typeof n&&n.endsWith(wb);e.includes("-")||t?i.setProperty(e,t?n.slice(0,-11):n,t?xb:""):i[e]=n}}return j.c0}});var kb=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};class $b extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._list=new jf(this,{select:(e,t)=>e.startsWith("lane:")?!this.disabled&&Pf(this,this.doc,e):this._pick(e.slice(6),t),move:(e,t)=>this._shift(e.slice(6),t),open:(e,t)=>this._list.setOpen(e,t),nameOf:e=>e.startsWith("lane:")?Ef(e):this.doc?.rig?.shapes?.find(t=>t.id===e.slice(6))?.name??e})}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:e}}))}_pick(e,t){const i=`shape:${e}`;this._select("tool"===this.selection.kind?{kind:"tool",tool:"select",target:i}:{kind:"target",target:i})}_shift(e,t){const i=this.doc,n=i?.rig?.shapes?.find(t=>t.id===e);if(!i||!n)return;const s=Fr(i,e,t);if(s===i)return;const a="under"===this.side,r=i.rig.shapes.filter(e=>"under"===e.layer===a),o="up"===t?a&&r[r.length-1].id===e:!a&&r[0].id===e;this._emit(s,Zn("up"===t?o?119:118:o?811:810)),this._list.announce(Zn(1239,{name:n.name,where:Zn(o?"up"===t?1155:1171:"up"===t?1174:1127)}))}_delete(e){const t=this.doc,i=t?.rig?.shapes?.find(t=>t.id===e);t&&i&&!this.disabled&&!this._list.refuseLocked(`shape:${e}`,i.name)&&(this._emit(Br(t,e),"Delete shape"),cb(this.selection)===e&&this._select({kind:"none"}))}_thumb(e,t){const i=e=>e?Ah(e)??e:"currentColor",s={fill:Ar(e)?i(e.fill):"none",stroke:jr(e)?i(e.stroke):"none","stroke-width":String(Math.max(e.stroke_width??1,1))};return n.qy`<svg class="thumb" viewBox=${t} aria-hidden="true">
      ${n.JW`<path d=${e.d} style=${_b(s)} stroke-linecap="round" stroke-linejoin="round"></path>`}
    </svg>`}render(){const e=this.doc,t=e?.rig?.shapes??[],i="under"===this.side;if(!e||!t.some(e=>"under"===e.layer===i))return n.qy``;const s=cb(this.selection),a=bb(e.rig),r=t.map((e,t)=>({s:e,i:t})).filter(e=>"under"===e.s.layer===i).reverse(),o=r[0].s.id,l=r[r.length-1].s.id;return n.qy`<ul aria-label=${Zn(i?839:838)}>
      ${r.map(({s:t})=>{const r=`shape:${t.id}`,c=e.tracks?.find(e=>e.target===r),d=[Kr(e,r)?Zn(1132):"",c?.path?"moves":""].filter(Boolean).join(", "),p=i&&o===t.id,h=!i&&l===t.id,u=Lf(e,this.layerView??Gr,r,r),m=this._list.row({key:r,expanded:u,name:t.name,thumb:this._thumb(t,a),note:d,describe:d,selected:t.id===s&&!(u&&"keys"===this.selection.kind),up:{ok:!this.disabled&&Fr(e,t.id,"up")!==e,label:Zn(p?121:120,{name:t.name}),menu:Zn(p?117:502)},down:{ok:!this.disabled&&Fr(e,t.id,"down")!==e,label:Zn(h?814:813,{name:t.name}),menu:Zn(h?812:481)},extra:t.id!==s?void 0:n.qy`<button type="button" class="icon-btn sm danger del" data-ctl="del" tabindex="-1" aria-label=${Zn(249,{name:t.name})} title=${Zn(243)} aria-disabled=${this.disabled||this._list.locked(r)?"true":n.s6} @click=${()=>this._delete(t.id)}>
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>`});return u?[m,...Hf(this._list,e,this.selection,r,2)]:[m]})}
    </ul>
    ${t.length>=48?n.qy`<p class="empty-note">${Zn(1001)}</p>`:n.s6}`}}$b.styles=[Wp,zf,n.AH`
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
    `],kb([(0,s.MZ)({attribute:!1})],$b.prototype,"doc",void 0),kb([(0,s.MZ)({attribute:!1})],$b.prototype,"selection",void 0),kb([(0,s.MZ)({type:Boolean})],$b.prototype,"disabled",void 0),kb([(0,s.MZ)({attribute:!1})],$b.prototype,"hass",void 0),kb([(0,s.MZ)({attribute:!1})],$b.prototype,"library",void 0),kb([(0,s.MZ)({type:Number})],$b.prototype,"time",void 0),kb([(0,s.MZ)({attribute:!1})],$b.prototype,"tile",void 0),kb([(0,s.MZ)({attribute:!1})],$b.prototype,"stage",void 0),kb([(0,s.MZ)({attribute:!1})],$b.prototype,"layerView",void 0),kb([(0,s.MZ)()],$b.prototype,"density",void 0);let Mb=class extends $b{constructor(){super(...arguments),this.side="over"}};Mb=kb([(0,s.EM)("mc-anim-shapes-layers")],Mb);let Sb=class extends $b{constructor(){super(...arguments),this.side="under"}};Sb=kb([(0,s.EM)("mc-anim-shapes-under-layers")],Sb),$s({tag:"mc-anim-shapes-layers",place:"layers",when:e=>"keyframes"===e.kind&&!!e.rig?.shapes?.some(e=>"under"!==e.layer),title:838,order:5}),$s({tag:"mc-anim-shapes-under-layers",place:"layers",when:e=>"keyframes"===e.kind&&!!e.rig?.shapes?.some(e=>"under"===e.layer),title:839,order:30});var Cb=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Ab=new Set(["line","rect","ellipse","freehand"]),jb={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]},zb=new Set(["select","line","rect","ellipse","freehand","erase","motion"]),qb=[],Eb=[],Lb=[{fill:"none"}],Pb=new Map,Hb=e=>e?Ah(e)??e:void 0,Vb=(e,t)=>{e.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:t}}))};let Db=class extends sf{constructor(){super(...arguments),this._selection={kind:"none"},this.disabled=!1,this.time=0,this.preview=!1,this._dropping=!1,this._announce="",this._piecesKey="",this._pointsSel=!1,this._onCanvas=e=>{e.stopPropagation();const t=e.detail,i=t.paths[0];if("pen"===db(this.selection))return this._pen=i&&i.anchors.length?i:void 0,void(t.commit&&i?.closed&&this._finishPen(!0));const n=this._live,s=n?this._shapes.find(e=>e.id===n.id):void 0;if(!n||!s||!this.doc)return;if(this._live={...n,list:t.paths},this.requestUpdate(),!t.commit)return;if("Cancel"===t.label)return;if(!i||!i.anchors.length)return this._emitDoc(Br(this.doc,s.id),"Delete shape"),void Vb(this,{kind:"tool",tool:"select"});const a=or(i);this._live={id:s.id,d:a,list:t.paths},mb.lastFreehand?.id===s.id&&mb.setLastFreehand(void 0),this._emitDoc(Rr(this.doc,s.id,{d:a}),tf(t.label))},this._onCanvasSelect=e=>{this._pointsSel=(e.detail?.anchors.length??0)>0},this._endNudge=()=>{const e=this._nudge;if(!e)return;this._nudge=void 0;const t=Math.round(100*e.dx)/100,i=Math.round(100*e.dy)/100;this._emitDoc(Rr(e.base,e.id,{d:wr(e.d,t,i)}),"Nudge shape"),this._followFreehand(e.id,t,i)},this._onKeyUp=e=>{/^Arrow/.test(e.key)&&this._endNudge()},this._onKeyCapture=e=>{const t=this._selectedId;if(this.disabled||!this.doc||!t||this._pen||this._drag)return;const i="Delete"===e.key||"Backspace"===e.key;return i||/^Arrow/.test(e.key)?this._refuseLocked(t)?(e.preventDefault(),void e.stopPropagation()):void(i&&!this._pointsSel&&(e.preventDefault(),e.stopPropagation(),this._emitDoc(Br(this.doc,t),"Delete shape"),Vb(this,{kind:"tool",tool:"select"}))):void 0},this._onKey=e=>{if(this.disabled||!this.doc)return;if(this._drag&&"Escape"===e.key)return e.preventDefault(),e.stopPropagation(),void this._end(!1);if(this._kbKey(e))return;if(/^Arrow/.test(e.key)||this._endNudge(),this._pen)return void("Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._finishPen(!1)));const t=this._selectedId;if("Escape"===e.key&&t)return e.preventDefault(),e.stopPropagation(),void Vb(this,{kind:"tool",tool:"select"});if(!t)return;const i={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];if(!i)return;if(e.preventDefault(),this._nudge&&this._nudge.id!==t&&this._endNudge(),!this._nudge){const e=this._shapes.find(e=>e.id===t);if(!e)return;this._nudge={id:t,base:this.doc,d:e.d,dx:0,dy:0}}const n=this._nudge,s=e.shiftKey?1:.1;n.dx+=i[0]*s,n.dy+=i[1]*s,this._emitDoc(Rr(n.base,t,{d:wr(n.d,Math.round(100*n.dx)/100,Math.round(100*n.dy)/100)}),"Nudge shape",!0)},this._onDragOver=e=>{!this.disabled&&e.dataTransfer?.types?.includes("Files")&&(e.preventDefault(),this._dropping=!0)},this._onDragLeave=()=>{this._dropping=!1},this._onDrop=async e=>{this._dropping=!1;const t=e.dataTransfer?.files?.[0];if(!t||this.disabled)return;e.preventDefault();const i=await Dg(t);if(this._dialog??=this.renderRoot.querySelector("mc-anim-svg-dialog")??void 0,"error"in i)return this._announce=as(i.error),void this._dialog?.openImport("",t.name);this._dialog?.openImport(i.text,t.name)},this._penList={list:qb}}get selection(){return this._selection}set selection(e){const t=e??{kind:"none"};this._pen&&"pen"!==db(t)&&this._finishPen(!1),db(t)!==db(this._selection)&&(this._kb=this._cross=void 0),this._selection=t}get penPath(){return this._pen}connectedCallback(){super.connectedCallback(),this._unsub=mb.subscribe(()=>this.requestUpdate()),this._parent=this.parentNode,this.addEventListener("keydown",this._onKeyCapture,!0),this.addEventListener("keydown",this._onKey),this.addEventListener("keyup",this._onKeyUp),this.addEventListener("blur",this._endNudge),this.addEventListener("dragover",this._onDragOver),this.addEventListener("dragleave",this._onDragLeave),this.addEventListener("drop",this._onDrop)}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.(),this.removeEventListener("keydown",this._onKeyCapture,!0),this.removeEventListener("keydown",this._onKey),this.removeEventListener("keyup",this._onKeyUp),this.removeEventListener("blur",this._endNudge),this.removeEventListener("dragover",this._onDragOver),this.removeEventListener("dragleave",this._onDragLeave),this.removeEventListener("drop",this._onDrop),this._end(!0),this._endNudge(),this._finishPen(!1),mb.setHint("")}firstUpdated(){this.hasAttribute("tabindex")||(this.tabIndex=0)}willUpdate(e){if(e.has("selection")){const t=e.get("selection");t?.target!==this.selection.target&&(this._pointsSel=!1)}if((e.has("doc")||e.has("tile")||e.has("pieces"))&&!this.pieces&&this.doc){const e=`${this.doc.rig?.svg??this.doc.rig?.icon??""}|${this.tile??""}`;e!==this._piecesKey&&(this._piecesKey=e,yb(this.doc,this.tile).then(t=>{this._piecesKey===e&&(this._resolved=t)}))}this.ensureCanvas()}get _viewBox(){return this.viewBox??this.stage?.viewBox?.join(" ")??bb(this.doc?.rig,this._resolved)}_view(){const e=this.stage,t=e?.rect?.width||this.stageRect?.width||360,i=e?.rect?.height||this.stageRect?.height||240,n=Mr(this._viewBox),s=this.iconRect??e?.subject??this.stageRect?.subject??this.subjectRect;let a;if(s&&s.width>8&&s.height>8)a=s;else{const e=Math.max(48,Math.min(t,i)-48);a={x:(t-e)/2,y:(i-e)/2,width:e,height:e}}const r=Math.min(a.width/n[2],a.height/n[3]),o=nf(e,{x:a.x+(a.width-n[2]*r)/2,y:a.y+(a.height-n[3]*r)/2,width:n[2]*r,height:n[3]*r});if(!(o&&r>0))return;const l=this._viewCache;return l&&l.vb.every((e,t)=>e===n[t])&&["left","top","width","height"].every(e=>Math.abs(l.place[e]-o[e])<.005)?l:this._viewCache={vb:n,place:o,ppu:o.width/n[2]}}_toPx(e,t){return[e.place.left+(t[0]-e.vb[0])*e.ppu,e.place.top+(t[1]-e.vb[1])*e.ppu]}_toVB(e,t){return[e.vb[0]+(t[0]-e.place.left)/e.ppu,e.vb[1]+(t[1]-e.place.top)/e.ppu]}_local(e){const t=this.getBoundingClientRect();return[e.clientX-t.left,e.clientY-t.top]}get _previewShapes(){return this.preview||!!this.tile&&!fb(this.tile)}get _shapes(){return this.doc?.rig?.shapes??[]}get _pieceList(){return this.pieces??this._resolved?.pieces??[]}_isLocked(e){return!!this.doc&&!!this.layerView?.locked.length&&ro(this.doc,this.layerView,`shape:${e}`)}_refuseLocked(e){return!!this._isLocked(e)&&(this._announce=Zn(1230,{name:this._shapes.find(t=>t.id===e)?.name??Zn(830)}),!0)}get _selectedId(){return cb(this.selection)}_snapAnchors(e){if(!mb.options.anchors)return[];const t=this._anchorCache,i=this._shapes,n=this._pieceList;if(!t||t.shapes!==i||t.pieces!==n||t.exclude!==e){const t=[];for(const e of n)t.push(..._r(e.d));for(const n of i)n.id!==e&&t.push(..._r(n.d));this._anchorCache={shapes:i,pieces:n,exclude:e,pts:t}}return this._anchorCache.pts}_snap(e,t,i){if(i)return this._snapAt=void 0,[Math.round(100*t[0])/100,Math.round(100*t[1])/100];const n=function(e,t){if(t.anchors?.length&&t.radius){let i,n=t.radius;for(const s of t.anchors){const t=(0,de.xg)(s,e);t<=n&&(n=t,i=s)}if(i)return{p:[i[0],i[1]],kind:"anchor"}}return t.grid&&t.grid>0?{p:[vr(Math.round(e[0]/t.grid)*t.grid),vr(Math.round(e[1]/t.grid)*t.grid)],kind:"grid"}:{p:[vr(e[0]),vr(e[1])],kind:null}}(t,{grid:mb.options.grid?1:0,anchors:this._snapAnchors(),radius:10/e.ppu});return this._snapAt="anchor"===n.kind?n.p:void 0,n.p}_snapConfig(e){const t=mb.options.grid?1:0;let i;if(mb.options.anchors){const t=[this._shapes,this._pieceList,e];if(!this._lines||this._lines.key.some((e,i)=>e!==t[i])){const i=new Set,n=new Set;for(const t of this._snapAnchors(e))i.size<300&&i.add(t[0]),n.size<300&&n.add(t[1]);this._lines={key:t,extra:{x:[...i],y:[...n]}}}i=this._lines.extra}const n=`${t}|${e??""}`,s=Pb.get(n);if(s&&s.extra===i)return s;const a={enabled:!0,grid:t,anchors:!1,frame:!1,extra:i};return Pb.set(n,a),a}_emitDoc(e,t,i=!1){i||(this._announce=t),(this.isConnected?this:this._parent?.isConnected?this._parent:this).dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_commitShape(e,t,i){if(!this.doc||!t)return;if(this._shapes.length>=Yi)return void(this._announce=Zn(76,{count:Yi}));const n=pb[e],s=Hr(Tr(this.doc),n.base),a=this._shapes.filter(e=>e.id.startsWith(`${n.base}-`)).length+1,r={id:s,name:`${Zn("pen"===e?665:"freehand"===e?931:n.label)} ${a}`,d:t,layer:mb.options.layer,...ub(mb.options,i)},o=Or(this.doc,r);return o?(this._emitDoc(o,`Draw ${e}`),this._announce="pen"===e?Zn(1225,{name:r.name,count:_r(t).length}):Zn(1226,{name:r.name}),s):void 0}_finishPen(e){const t=this._pen;if(this._pen=void 0,!t||t.anchors.length<2)return;const i=e?{...t,closed:!0}:t;this._commitShape("pen",or(i),i.closed)}_capture(e){e.preventDefault();try{this.renderRoot.querySelector("svg.tool")?.setPointerCapture(e.pointerId)}catch{}}_onDown(e){const t=this._view();if(this.disabled||e.button>0||!this.doc||this._drag||!t)return;this._endNudge(),this.focus({preventScroll:!0,focusVisible:!1});const i=this._local(e),n=this._toVB(t,i),s=db(this.selection);if(!Ab.has(s)&&"motion"!==s||this.chunk)switch(s){case"select":{const s=Lr(this._shapes.filter(e=>!this._isLocked(e.id)),n,6/t.ppu);if(!s){const e=Lr(this._shapes,n,6/t.ppu);if(e&&this._refuseLocked(e))return;return void(this._selectedId&&Vb(this,{kind:"tool",tool:"select"}))}s!==this._selectedId&&Vb(this,{kind:"tool",tool:"select",target:`shape:${s}`});const a=this._shapes.find(e=>e.id===s);return this._capture(e),void(this._drag={kind:"move",pointerId:e.pointerId,id:s,base:this.doc,d:a.d,start:n,startPx:i,moved:!1,delta:[0,0]})}case"erase":return this._capture(e),this._drag={kind:"erase",pointerId:e.pointerId,base:this.doc,ids:[]},void this._eraseAt(n,t);case"line":case"rect":case"ellipse":{const i=this._snap(t,n,e.shiftKey&&"line"===s);return this._capture(e),void(this._drag={kind:"box",tool:s,pointerId:e.pointerId,a:i,b:i,shift:e.shiftKey,alt:e.altKey})}case"freehand":case"motion":return"motion"!==s||ob(this.selection.target)?"motion"===s&&this.layerView&&ro(this.doc,this.layerView,this.selection.target)?void(this._announce=Zn(944)):(this._capture(e),this._drag={kind:"free",tool:s,pointerId:e.pointerId,raw:[n],poly:`${i[0].toFixed(1)},${i[1].toFixed(1)}`,last:i},void this.requestUpdate()):void(this._announce=Zn(805))}else this._announce=Zn(963)}_boxPath(e,t,i,n,s){const a=this.chunk?.pathDraw;if(!a||Math.hypot(i[0]-t[0],i[1]-t[1])<.2)return;if("line"===e)return a.linePath(t,i);const r=function(e,t,i,n){let s=t[0]-e[0],a=t[1]-e[1];if(i){const e=Math.max(Math.abs(s),Math.abs(a));s=Math.sign(s||1)*e,a=Math.sign(a||1)*e}return n?{x:vr(e[0]-Math.abs(s)),y:vr(e[1]-Math.abs(a)),w:vr(2*Math.abs(s)),h:vr(2*Math.abs(a))}:{x:vr(Math.min(e[0],e[0]+s)),y:vr(Math.min(e[1],e[1]+a)),w:vr(Math.abs(s)),h:vr(Math.abs(a))}}(t,i,n,s);return r.w<.2||r.h<.2?void 0:"rect"===e?a.rectPath(r.x,r.y,r.w,r.h,mb.options.radius):a.ellipsePath(r.x+r.w/2,r.y+r.h/2,r.w/2,r.h/2)}_commitBox(e,t,i,n,s){const a=this._boxPath(e,t,i,n,s);return a&&this._commitShape(e,a,"line"!==e),!!a}_eraseAt(e,t){const i=this._drag;if("erase"!==i?.kind)return;let n=i.base;for(const e of i.ids)n=Br(n,e);const s=Lr((n.rig?.shapes??[]).filter(e=>!this._isLocked(e.id)),e,6/t.ppu);s&&(i.ids.push(s),this._emitDoc(Br(n,s),"Erase shape",!0))}_onMove(e){const t=this._drag,i=this._view();if(!t||!i||e.pointerId!==t.pointerId)return;const n=this._local(e),s=this._toVB(i,n);switch(t.kind){case"box":return t.b=this._snap(i,s,e.shiftKey&&"line"===t.tool),t.shift=e.shiftKey,t.alt=e.altKey,void this.requestUpdate();case"free":{const n="function"==typeof e.getCoalescedEvents?e.getCoalescedEvents():[];let s=!1;for(const a of n.length?n:[e]){if(t.raw.length>=4e3)break;const e=this._local(a);Math.hypot(e[0]-t.last[0],e[1]-t.last[1])<.75||(t.raw.push(this._toVB(i,e)),t.poly+=` ${e[0].toFixed(1)},${e[1].toFixed(1)}`,t.last=e,s=!0)}return void(s&&this.requestUpdate())}case"erase":return void this._eraseAt(s,i);case"move":{if(!t.moved&&Math.hypot(n[0]-t.startPx[0],n[1]-t.startPx[1])<3)return;t.moved=!0;let i=s[0]-t.start[0],a=s[1]-t.start[1];return!e.shiftKey&&mb.options.grid&&(i=Math.round(i),a=Math.round(a)),t.delta=[Math.round(100*i)/100,Math.round(100*a)/100],void this._emitDoc(Rr(t.base,t.id,{d:wr(t.d,t.delta[0],t.delta[1])}),"Move shape",!0)}}}_onUp(e){const t=this._drag;t&&e.pointerId===t.pointerId&&this._end(!0)}_end(e){const t=this._drag;if(!t)return;this._drag=void 0,this._snapAt=void 0;try{const e=this.renderRoot.querySelector("svg.tool");e?.hasPointerCapture?.(t.pointerId)&&e.releasePointerCapture(t.pointerId)}catch{}if(!e||!this.doc)return"move"===t.kind&&t.moved&&this._emitDoc(t.base,"Move shape"),"erase"===t.kind&&t.ids.length&&this._emitDoc(t.base,"Erase shape"),void this.requestUpdate();const i=this.chunk?.pathDraw;switch(t.kind){case"box":this._commitBox(t.tool,t.a,t.b,t.shift,t.alt);break;case"free":{const e=i?.fitFreehand(t.raw,mb.options.tolerance);if(!e?.d)break;if("freehand"===t.tool){const i=this._commitShape("freehand",e.d,e.closed);i&&mb.setLastFreehand({id:i,raw:t.raw})}else{const t=this.selection.target,i=Wr(this.doc,t,e.d,mb.options.follow);i?this._emitDoc(i,"Draw motion path"):this._announce=Zn(86,{tracks:24})}break}case"move":t.moved&&(this._emitDoc(Rr(t.base,t.id,{d:wr(t.d,t.delta[0],t.delta[1])}),"Move shape"),this._followFreehand(t.id,t.delta[0],t.delta[1]));break;case"erase":{if(!t.ids.length)break;let e=t.base;for(const i of t.ids)e=Br(e,i);this._emitDoc(e,1===t.ids.length?Zn(322):Zn(323));break}}this.requestUpdate()}_followFreehand(e,t,i){const n=mb.lastFreehand;n?.id===e&&(t||i)&&mb.setLastFreehand({id:e,raw:n.raw.map(e=>[e[0]+t,e[1]+i])})}_finishButton(){this._kb?this._finishStroke():this._finishPen(!1),this._focusArea()}_focusArea(){this.updateComplete.then(()=>{(("view"!==this._canvasPaths().mode?this.renderRoot.querySelector("mc-path-canvas"):null)??this).focus({preventScroll:!0})})}_finishStroke(){const e=this._kb;this._kb=void 0;const t=this.chunk?.pathDraw;if(!e||!t||e.pts.length<2)return;const i=[e.pts[0]];for(let t=1;t<e.pts.length;t++){const n=e.pts[t-1],s=e.pts[t],a=Math.max(1,Math.ceil(Math.hypot(s[0]-n[0],s[1]-n[1])/.5));for(let e=1;e<=a;e++)i.push([n[0]+(s[0]-n[0])*e/a,n[1]+(s[1]-n[1])*e/a])}const n=t.fitFreehand(i,mb.options.tolerance);if(!n?.d)return;const s=this._commitShape("freehand",n.d,n.closed);s&&mb.setLastFreehand({id:s,raw:i})}_kbKey(e){const t=db(this.selection);if(!Ab.has(t)||this._selectedId||this._pen||e.composedPath()[0]!==this||e.ctrlKey||e.metaKey)return!1;if("Escape"===e.key)return!!this._kb&&(e.preventDefault(),e.stopPropagation(),this._kb=void 0,this._announce=Zn(281),!0);const i=jb[e.key];if(!i&&"Enter"!==e.key)return!1;e.preventDefault(),e.stopPropagation();const n=this._view();if(!n)return!0;if(!this.chunk)return this._announce=Zn(963),!0;const s=t,a=this._cross??[n.vb[0]+n.vb[2]/2,n.vb[1]+n.vb[3]/2],r=e=>String(Math.round(100*e)/100);if(i){const t=e.altKey?.1:e.shiftKey?5:1,o=mb.options.grid&&!e.altKey,l=(e,t,i)=>{const n=Math.min(t+i,Math.max(t,e));return o?Math.round(n):Math.round(100*n)/100},c=[l(a[0]+i[0]*t,n.vb[0],n.vb[2]),l(a[1]+i[1]*t,n.vb[1],n.vb[3])];this._cross=c;const d="freehand"!==s&&!!this._kb,p={x:r(c[0]),y:r(c[1])};return this._announce=Zn("freehand"===s?213:d?214:215,p),!0}this._cross=a;const o=this._kb;if("freehand"===s){const e=o?.pts[o.pts.length-1];if(o&&e&&e[0]===a[0]&&e[1]===a[1])return o.pts.length>1?this._finishStroke():this._announce=Zn(480),!0;const t=[...o?.pts??[],a];return this._kb={tool:s,pts:t},this._announce=Zn(698,{count:t.length}),!0}return o?this._commitBox(s,o.pts[0],a,!1,!1)?this._kb=void 0:this._announce=Zn(480):(this._kb={tool:s,pts:[a]},this._announce=Zn(903,{x:r(a[0]),y:r(a[1])})),!0}toolsReady(){this._announce=Zn(964),this._focusArea()}_grid(e){const t=db(this.selection);if(!mb.options.grid||e.ppu<6||"select"===t||"erase"===t)return n.s6;const[i,s,a,r]=e.vb,o=[];for(let t=0;t<=a;t++)o.push(`M${(e.place.left+t*e.ppu).toFixed(1)} ${e.place.top.toFixed(1)}v${e.place.height.toFixed(1)}`);for(let t=0;t<=r;t++)o.push(`M${e.place.left.toFixed(1)} ${(e.place.top+t*e.ppu).toFixed(1)}h${e.place.width.toFixed(1)}`);return n.JW`<path class="grid" d=${o.join("")}></path>`}_shapesLayer(e){if(!this._previewShapes||!this._shapes.length)return n.s6;const t=this._selectedId;return n.JW`<g class="shapes" transform="translate(${e.place.left-e.vb[0]*e.ppu} ${e.place.top-e.vb[1]*e.ppu}) scale(${e.ppu})">
      ${qr(this._shapes).map(e=>n.JW`<path class="${e.id===t?"sel":""} ${e.layer}" data-id=${e.id} d=${e.d} style=${_b(function(e){return{fill:Ar(e)?Hb(e.fill)??"currentColor":"none",stroke:jr(e)?Hb(e.stroke)??"currentColor":"none","stroke-width":String(e.stroke_width??1),"stroke-linecap":e.linecap??"butt","stroke-linejoin":"round"}}(e))}></path>`)}
    </g>`}_pxD(e,t){return t?(0,de.Mj)(t).map(t=>{if(!t.length)return"";const i=t=>this._toPx(e,t),n=i(t[0][0]);return`M${n[0].toFixed(1)} ${n[1].toFixed(1)}${t.map(e=>`C${[e[1],e[2],e[3]].map(e=>i(e).map(e=>e.toFixed(1)).join(" ")).join(" ")}`).join("")}`}).join(""):""}_selectionBox(e){const t=this._selectedId,i=t?this._shapes.find(e=>e.id===t):void 0,s=i?$r(i.d):void 0;if(!s)return n.s6;const[a,r]=this._toPx(e,[s.x,s.y]);return n.JW`<rect class="bbox" x=${a-4} y=${r-4} width=${s.w*e.ppu+8} height=${s.h*e.ppu+8} rx="2"></rect>`}_dragLayer(e){const t=this._drag,i=this._kb;if(i&&this._cross){if("freehand"===i.tool)return n.JW`<polyline class="draft" points=${[...i.pts,this._cross].map(t=>this._toPx(e,t).map(e=>e.toFixed(1)).join(",")).join(" ")}></polyline>`;const t=this._boxPath(i.tool,i.pts[0],this._cross,!1,!1);return t?n.JW`<path class="draft ${"line"===i.tool?"":"fillable"}" d=${this._pxD(e,t)}></path>`:n.s6}if(!t)return n.s6;if("box"===t.kind){const i=this._boxPath(t.tool,t.a,t.b,t.shift,t.alt);return i?n.JW`<path class="draft ${"line"===t.tool?"":"fillable"}" d=${this._pxD(e,i)}></path>`:n.s6}return"free"===t.kind?n.JW`<polyline class="draft" points=${t.poly}></polyline>`:n.s6}_ghost(e){const t=mb.lastFreehand;if(!t||!this._shapes.some(e=>e.id===t.id))return n.s6;const i=db(this.selection);if(this._selectedId!==t.id&&"freehand"!==i)return n.s6;const s=`${e.ppu}|${e.place.left}|${e.place.top}`;this._ghostCache?.raw===t.raw&&this._ghostCache.key===s||(this._ghostCache={raw:t.raw,key:s,pts:t.raw.map(t=>this._toPx(e,t).map(e=>e.toFixed(1)).join(",")).join(" ")});const a=this._ghostCache.pts;return n.JW`<polyline class="ghost-casing" points=${a}></polyline><polyline class="ghost" points=${a}></polyline>`}_motion(e){const t=this.selection.target;if(!ob(t))return n.s6;const i=this.doc?.tracks?.find(e=>e.target===t);if(!i?.path?.d)return n.s6;const s=this._targetCentre(t);return s?n.JW`<path class="motion" d=${this._pxD(e,wr(i.path.d,s[0],s[1]))}></path>`:n.s6}_targetCentre(e){const[t,i]=e.split(":"),n=this.doc?.rig,s="group"===t?n?.groups?.find(e=>e.id===i)?.parts??[]:[i],a=new Set(s.flatMap(e=>n?.parts.find(t=>t.id===e)?.from??[])),r="shape"===t?this._shapes.find(e=>e.id===i)?.d??"":this._pieceList.filter(e=>a.has(e.index)).map(e=>e.d).join(" "),o=r?$r(r):void 0;if(o)return[o.x+o.w/2,o.y+o.h/2];const l=Mr(this._viewBox);return[l[0]+l[2]/2,l[1]+l[3]/2]}_crossMark(e){if(!this._cross||!Ab.has(db(this.selection)))return n.s6;const[t,i]=this._toPx(e,this._cross),s=`M${t-9} ${i}h18M${t} ${i-9}v18`;return n.JW`<path class="cross-casing" d=${s}></path><path class="cross" d=${s}></path>`}_dots(e){return("box"===this._drag?.kind||this._pen)&&mb.options.anchors?n.JW`<g class="dots">${this._snapAnchors().slice(0,600).map(t=>{const[i,s]=this._toPx(e,t);return n.JW`<circle cx=${i} cy=${s} r="1.5"></circle>`})}</g>`:n.s6}_hint(){const e=db(this.selection);return this._pen?this._pen.anchors.length<2?Zn(168):Zn(pb.pen.hint):"motion"!==e||ob(this.selection.target)?"select"!==e||this._shapes.length?this._drag||this._selectedId?"":Zn(pb[e].hint):Zn(583):Zn(806)}_labelArea(){const e=db(this.selection);if(this.disabled||!zb.has(e)){for(const e of["role","aria-roledescription","aria-label"])this.removeAttribute(e);return}this.setAttribute("role","application"),this.setAttribute("aria-roledescription",Zn(1131));const t=Ab.has(e)?` ${Zn(71)}`:"";this.setAttribute("aria-label",Zn(1217,{label:Zn(pb[e].label),hint:Zn(pb[e].hint)})+t)}updated(){this._labelArea(),mb.setHint(this.disabled?"":this._hint())}_canvasPaths(){if(this.disabled||"ready"!==this.canvasState)return{mode:"view",paths:qb,paint:Eb};if("pen"===db(this.selection))return this._penList.src!==this._pen&&(this._penList={src:this._pen,list:this._pen?[this._pen]:qb}),{mode:"add",paths:this._penList.list,paint:Eb};const e=this._selectedId,t=e?this._shapes.find(t=>t.id===e):void 0;return!t||this._isLocked(t.id)||1!==(0,de.Mj)(t.d).length?{mode:"view",paths:qb,paint:Eb}:(this._live?.id===t.id&&this._live.d===t.d||(this._live={id:t.id,d:t.d,list:[rr(t.d)]}),{mode:"nodes",paths:this._live.list,paint:Lb,exclude:t.id})}render(){const e=this._view();if(!e)return n.qy`${this.renderNotice()}`;const t=db(this.selection),i=this._canvasPaths(),s=zb.has(t)&&!this.disabled,a={x:e.vb[0],y:e.vb[1],w:e.vb[2],h:e.vb[3]};return n.qy`
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
            .frame=${a}
            .paths=${i.paths}
            .paint=${i.paint}
            .mode=${i.mode}
            .maxPaths=${1}
            .gridStep=${1}
            .snap=${this._snapConfig(i.exclude)}
            .nudge=${1}
            .bigNudge=${5}
            .fineNudge=${.1}
            aria-label=${Zn("pen"===t?672:833)}
            @mc-path-change=${this._onCanvas}
            @mc-path-select=${this._onCanvasSelect}
            @mc-path-limit=${()=>this._announce=Zn(992)}
          ></mc-path-canvas>`:n.s6}
      ${this._pen&&this._pen.anchors.length>=2||"freehand"===this._kb?.tool&&this._kb.pts.length>=2?n.qy`<button type="button" class="finish" @click=${()=>this._finishButton()}>${Zn(343)}</button>`:n.s6}
      ${this._dropping?n.qy`<div class="drop">${Zn(289)}</div>`:n.s6} ${this.renderNotice()}
      <span class="sr-only" aria-live="polite">${this._announce}</span>
      <mc-anim-svg-dialog .doc=${this.doc} .pieces=${this._pieceList} .viewBox=${this._viewBox}></mc-anim-svg-dialog>
    `}};Db.styles=[sf.styles,n.AH`
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
    `],Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"doc",void 0),Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"selection",null),Cb([(0,s.MZ)({type:Boolean,reflect:!0})],Db.prototype,"disabled",void 0),Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"layerView",void 0),Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"tile",void 0),Cb([(0,s.MZ)({type:Number})],Db.prototype,"time",void 0),Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"hass",void 0),Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"library",void 0),Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"stage",void 0),Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"stageRect",void 0),Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"subjectRect",void 0),Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"iconRect",void 0),Cb([(0,s.MZ)({attribute:!1})],Db.prototype,"pieces",void 0),Cb([(0,s.MZ)({type:String})],Db.prototype,"viewBox",void 0),Cb([(0,s.MZ)({type:Boolean})],Db.prototype,"preview",void 0),Cb([(0,s.wk)()],Db.prototype,"_resolved",void 0),Cb([(0,s.wk)()],Db.prototype,"_pen",void 0),Cb([(0,s.wk)()],Db.prototype,"_snapAt",void 0),Cb([(0,s.wk)()],Db.prototype,"_dropping",void 0),Cb([(0,s.wk)()],Db.prototype,"_announce",void 0),Cb([(0,s.wk)()],Db.prototype,"_cross",void 0),Cb([(0,s.wk)()],Db.prototype,"_kb",void 0),Db=Cb([(0,s.EM)("mc-anim-draw-host")],Db),$s({tag:"mc-anim-draw-host",place:"stage-tool",when:lb,title:280,order:40,dock:"canvas"});var Tb=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Ob=[{value:"round",label:774},{value:"butt",label:348},{value:"square",label:891}],Rb=[{value:"over",label:636,icon:"mdi:arrange-bring-forward"},{value:"under",label:1058,icon:"mdi:arrange-send-backward"}],Nb=e=>Math.min(100,Math.max(0,Math.round(100*e)/100));let Fb=class extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this._drawLoading=!1,this._refitting=!1}connectedCallback(){super.connectedCallback(),this._unsub=mb.subscribe(()=>this.requestUpdate())}willUpdate(){this._draw||this._drawLoading||(mb.lastFreehand||"freehand"===db(this.selection))&&(this._drawLoading=!0,Jg().then(e=>{this._drawLoading=!1,e&&(this._draw=e.pathDraw)}))}disconnectedCallback(){super.disconnectedCallback(),this._unsub?.()}get _shape(){const e=cb(this.selection);return e?this.doc?.rig?.shapes?.find(t=>t.id===e):void 0}_emit(e,t,i=!1){e&&this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:i?{doc:e,label:t,transient:!0}:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:e}}))}_patch(e,t,i){this.doc&&this._emit(Rr(this.doc,e.id,t),i)}_seg(e,t,i,s,a=""){return n.qy`<div class="field">
      <div class="field-head"><span class="lbl">${e}</span></div>
      <div class="seg full ${a}" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=t.findIndex(e=>e.value===i),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const r=t[(n+a[e.key]+t.length)%t.length].value,o=e.currentTarget;s(r),requestAnimationFrame(()=>o.querySelector(`[data-val="${r}"]`)?.focus())}}>
        ${t.map(e=>{const t=e.value===i;return n.qy`<button
            type="button"
            role="radio"
            data-val=${e.value}
            aria-checked=${t?"true":"false"}
            tabindex=${t?"0":"-1"}
            ?disabled=${this.disabled}
            @click=${()=>t||s(e.value)}
          >
            ${e.icon?n.qy`<ha-icon icon=${e.icon}></ha-icon>`:n.s6}${Zn(e.label)}
          </button>`})}
      </div>
    </div>`}_switch(e,t,i,s,a,r=!1){return n.qy`<div class="switch-row">
      <div class="txt">
        <span class="lbl">${e}</span>
        ${t?n.qy`<p class="help">${t}</p>`:n.s6}
      </div>
      <button
        type="button"
        class="switch ${a}"
        role="switch"
        aria-checked=${i?"true":"false"}
        aria-label=${e}
        ?disabled=${this.disabled||r}
        @click=${s}
      ></button>
    </div>`}_color(e,t,i,s){return n.qy`<mc-color-picker
      class=${s}
      allowEntity
      .label=${e}
      .value=${t}
      ?disabled=${this.disabled}
      @value-changed=${e=>{e.stopPropagation();const n=function(e){const t=e.trim();if(t)return/^entity( \d{1,3}%)?$/.test(t)?t:st(t,"color")}(String(e.detail.value??""));n&&n!==t&&i(n)}}
    ></mc-color-picker>`}_number(e,t,i,s,a,r){return n.qy`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label></div>
      <input
        id=${e}
        class="input"
        type="number"
        inputmode="decimal"
        min="0"
        max=${a}
        step=${s}
        .value=${String(i)}
        ?disabled=${this.disabled}
        @change=${e=>{const t=e.target,n=Number(t.value);if(""===t.value||!Number.isFinite(n))return void(t.value=String(i));const s=Math.min(a,Math.max(0,Math.round(100*n)/100));t.value=String(s),s!==i&&r(s)}}
      />
    </div>`}_paint(e,t){return n.qy`<section class="group" aria-labelledby="h-paint">
      <div class="group-head"><h3 id="h-paint">${Zn(640)}</h3></div>
      ${e.closed?n.qy`<div class="paint">
            ${this._switch(Zn(338),"",void 0!==e.fill,()=>t.fill(void 0!==e.fill?void 0:"currentColor"),"fill-on",void 0!==e.fill&&void 0===e.stroke)}
            ${void 0!==e.fill?this._color(Zn(339),e.fill,e=>t.fill(e),"fill-color"):n.s6}
          </div>`:n.s6}
      <div class="paint">
        ${this._switch(Zn(931),e.closed?"":Zn(58),void 0!==e.stroke,()=>t.stroke(void 0!==e.stroke?void 0:"currentColor"),"stroke-on",!e.closed||void 0!==e.stroke&&void 0===e.fill)}
        ${void 0!==e.stroke?n.qy`${this._color(Zn(932),e.stroke,e=>t.stroke(e),"stroke-color")}
              <div class="two">
                ${this._number("f-width",Zn(933),e.width,.25,100,t.width)}
              </div>
              ${this._seg(Zn(442),Ob,e.cap,t.cap,"caps")}`:n.s6}
      </div>
    </section>`}_smoothing(e,t,i=!1){const s=mb.options.tolerance;return n.qy`<div class="field">
      <div class="field-head"><label for="f-tol">${Zn(859)}</label><span class="val">${s.toFixed(2)}</span></div>
      <div class="slider">
        <span aria-hidden="true">${Zn(252)}</span>
        <input
          id="f-tol"
          type="range"
          min=${.05}
          max=${2}
          step=${.05}
          .value=${String(s)}
          aria-valuetext=${Zn(1257,{size:s.toFixed(2)})}
          ?disabled=${this.disabled||i}
          @input=${t=>e(Number(t.target.value),!1)}
          @change=${t=>e(Number(t.target.value),!0)}
        />
        <span aria-hidden="true">${Zn(857)}</span>
      </div>
      <p class="help">${t}</p>
    </div>`}_refit(e,t){mb.set({tolerance:e});const i=mb.lastFreehand,n=i&&this.doc?.rig?.shapes?.find(e=>e.id===i.id);if(!n||!this.doc)return;const s=this._draw?.fitFreehand(i.raw,e);if(s&&s.d){if(!t){if(s.d===n.d)return;return this._refitting=!0,void this._emit(Rr(this.doc,n.id,{d:s.d}),"Smooth stroke",!0)}(s.d!==n.d||this._refitting)&&this._emit(Rr(this.doc,n.id,{d:s.d}),"Smooth stroke"),this._refitting=!1}}_renderShape(e){const t=this.doc,i=`shape:${e.id}`,s=/[Zz]\s*$/.test(e.d)||Ar(e),a=t.rig?.shapes??[],r=a.findIndex(t=>t.id===e.id),o=t.tracks?.find(e=>e.target===i),l=mb.lastFreehand?.id===e.id;return n.qy`
      <section class="group" aria-labelledby="h-shape">
        <div class="group-head"><h3 id="h-shape">${Zn(830)}</h3><span class="id" title=${Zn(940)}>${i}</span></div>
        <div class="field">
          <div class="field-head"><label for="f-name">${Zn(554)}</label></div>
          <input
            id="f-name"
            class="input"
            .value=${e.name}
            maxlength="80"
            ?disabled=${this.disabled}
            @change=${t=>{const i=t.target,n=i.value.trim();n?n!==e.name&&this._patch(e,{name:n},"Rename shape"):i.value=e.name}}
          />
        </div>
        ${this._seg(Zn(426),Rb,e.layer,t=>this._patch(e,{layer:t},Zn("under"===t?834:832)),"layer")}
        <div class="row">
          <button type="button" class="btn btn-text btn-sm forward" ?disabled=${this.disabled||r>=a.length-1} @click=${()=>this._emit(Nr(t,e.id,r+1),"Bring shape forward")}>
            <ha-icon icon="mdi:arrange-bring-forward"></ha-icon>${Zn(116)}
          </button>
          <button type="button" class="btn btn-text btn-sm backward" ?disabled=${this.disabled||r<=0} @click=${()=>this._emit(Nr(t,e.id,r-1),"Send shape backward")}>
            <ha-icon icon="mdi:arrange-send-backward"></ha-icon>${Zn(809)}
          </button>
        </div>
      </section>
      ${this._paint({fill:Ar(e)?e.fill??"currentColor":void 0,stroke:jr(e)?e.stroke:void 0,width:e.stroke_width??1,cap:e.linecap??"butt",closed:s},{fill:t=>this._patch(e,{fill:t},Zn(t?143:735)),stroke:t=>this._patch(e,t?{stroke:t,stroke_width:e.stroke_width??1}:{stroke:void 0,stroke_width:void 0,linecap:void 0},Zn(t?147:741)),width:t=>this._patch(e,{stroke_width:Nb(t)},"Change stroke width"),cap:t=>this._patch(e,{linecap:t},"Change line ends")})}
      ${l?n.qy`<section class="group" aria-labelledby="h-smooth">
            <div class="group-head"><h3 id="h-smooth">${Zn(360)}</h3></div>
            ${this._smoothing((e,t)=>this._refit(e,t),Zn(472),!this._draw)}
          </section>`:n.s6}
      <section class="group" aria-labelledby="h-anim">
        <div class="group-head"><h3 id="h-anim">${Zn(65)}</h3></div>
        ${this._switch(Zn(276),Ar(e)?Zn(987):Zn(981),Kr(t,i),()=>Kr(t,i)?this._emit(function(e,t){const i=Ir(e,t);if(!i)return e;const n=i.keyframes.map(e=>{const t={...e};return delete t.draw,t}).filter(e=>Object.keys(e).some(e=>"at"!==e&&"easing"!==e)),s={...i,keyframes:n};return Zr(e,n.length||s.path?s:void 0,t)??e}(t,i),"Remove draw on"):this._emit(function(e,t){const i=Ir(e,t),n=(i?.keyframes??[]).map(e=>({...e}));for(const[e,t]of[[0,0],[100,1]]){const i=n.find(t=>t.at===e);i?i.draw=t:n.push({at:e,draw:t})}return n.sort((e,t)=>e.at-t.at),Zr(e,{...i??{target:t},target:t,keyframes:n},t)}(t,i),"Draw on"),"draw-on")}
        <div class="field">
          <div class="field-head"><span class="lbl">${Zn(474)}</span></div>
          <div class="row">
            <button type="button" class="btn btn-secondary btn-sm draw-motion" ?disabled=${this.disabled} @click=${()=>this._select({kind:"tool",tool:"motion",target:i})}>
              <ha-icon icon="mdi:map-marker-path"></ha-icon>${Zn(o?.path?724:274)}
            </button>
            ${o?.path?n.qy`<button type="button" class="btn btn-text btn-sm remove-motion" ?disabled=${this.disabled} @click=${()=>this._emit(Wr(t,i,void 0,!1),"Remove motion path")}>
                  ${Zn(729)}
                </button>`:n.s6}
          </div>
          ${o?.path?this._switch(Zn(357),Zn(1005),!!o.path.follow_rotation,()=>{const e=(t.tracks??[]).map(e=>e===o?{...e,path:{...e.path,follow_rotation:!e.path.follow_rotation}}:e);this._emit({...t,tracks:e},"Follow the path")},"follow"):n.qy`<p class="help">${Zn(277)}</p>`}
        </div>
      </section>
      <section class="group">
        <button type="button" class="btn btn-text btn-sm danger-text delete" ?disabled=${this.disabled} @click=${()=>{this._emit(Br(t,e.id),"Delete shape"),this._select({kind:"tool",tool:"select"})}}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>${Zn(243)}
        </button>
      </section>
    `}_opt(e){mb.set(e)}_renderTool(e){const t=mb.options,i=pb[e],s="pen"===e||"line"===e||"rect"===e||"ellipse"===e||"freehand"===e,a="rect"===e||"ellipse"===e||"pen"===e,r=this.selection.target;return n.qy`
      <section class="group" aria-labelledby="h-tool">
        <div class="group-head tool-head"><ha-icon icon=${i.icon}></ha-icon><h3 id="h-tool">${Zn(i.label)}</h3></div>
        <p class="help lead">${Zn(i.hint)}</p>
        ${"motion"===e?ob(r)?n.qy`<p class="help">${Wn(522,{target:n.qy`<span class="id">${r}</span>`})}</p>
                ${this._switch(Zn(357),Zn(414),t.follow,()=>this._opt({follow:!t.follow}),"follow-opt")}`:n.qy`<p class="help">${Zn(805)}</p>`:n.s6}
        ${"rect"===e?this._number("f-radius",Zn(204),t.radius,.5,12,e=>this._opt({radius:e})):n.s6}
        ${"freehand"===e||"motion"===e?this._smoothing((t,i)=>"freehand"===e?this._refit(t,i):this._opt({tolerance:t}),"freehand"===e&&mb.lastFreehand?Zn(149):Zn(471),"freehand"===e&&!this._draw):n.s6}
      </section>
      ${s?n.qy`${this._paint({fill:a&&t.fill||void 0,stroke:t.stroke||(a?void 0:"currentColor"),width:t.strokeWidth,cap:t.linecap,closed:a},{fill:e=>this._opt({fill:e??""}),stroke:e=>this._opt({stroke:e??""}),width:e=>this._opt({strokeWidth:Nb(e)}),cap:e=>this._opt({linecap:e})})}
            <section class="group" aria-labelledby="h-new">
              <div class="group-head"><h3 id="h-new">${Zn(565)}</h3></div>
              ${this._seg(Zn(426),Rb,t.layer,e=>this._opt({layer:e}),"layer")}
            </section>`:n.s6}
      ${"erase"!==e&&"select"!==e?n.qy`<section class="group" aria-labelledby="h-snap">
            <div class="group-head"><h3 id="h-snap">${Zn(863)}</h3></div>
            ${this._switch(Zn(372),Zn(702),t.grid,()=>this._opt({grid:!t.grid}),"snap-grid")}
            ${this._switch(Zn(59),Zn(701),t.anchors,()=>this._opt({anchors:!t.anchors}),"snap-anchors")}
          </section>`:n.s6}
    `}render(){if(!this.doc)return n.qy``;const e=this._shape;return e?this._renderShape(e):"tool"===this.selection.kind&&ab(this.selection.tool)?this._renderTool(db(this.selection)):n.qy``}};Fb.styles=[Wp,n.AH`
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
    `],Tb([(0,s.MZ)({attribute:!1})],Fb.prototype,"doc",void 0),Tb([(0,s.MZ)({attribute:!1})],Fb.prototype,"selection",void 0),Tb([(0,s.MZ)({type:Boolean})],Fb.prototype,"disabled",void 0),Tb([(0,s.MZ)({attribute:!1})],Fb.prototype,"hass",void 0),Tb([(0,s.MZ)({attribute:!1})],Fb.prototype,"library",void 0),Tb([(0,s.MZ)({type:Number})],Fb.prototype,"time",void 0),Tb([(0,s.MZ)({attribute:!1})],Fb.prototype,"tile",void 0),Tb([(0,s.MZ)({attribute:!1})],Fb.prototype,"stage",void 0),Tb([(0,s.wk)()],Fb.prototype,"_draw",void 0),Fb=Tb([(0,s.EM)("mc-anim-shape-inspector")],Fb),$s({tag:"mc-anim-shape-inspector",place:"inspector",when:function(e,t){return"keyframes"===e.kind&&("tool"===t.kind?ab(t.tool):"target"===t.kind&&rb(t.target)&&!!e.rig?.shapes?.some(e=>`shape:${e.id}`===t.target))},title:280,order:30});var Bb=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Ib=(e,t)=>{e.dispatchEvent(new CustomEvent("selection-change",{bubbles:!0,composed:!0,detail:{selection:t}}))},Zb=["select","pen","line","rect","ellipse","freehand","erase","motion"];let Kb=class extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this._key=""}connectedCallback(){super.connectedCallback(),this._offHint=mb.onHint(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._offHint?.()}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc&&!this.pieces){const e=`${this.doc.rig?.svg??this.doc.rig?.icon??""}|${this.tile??""}`;e!==this._key&&(this._key=e,yb(this.doc,this.tile).then(t=>{this._key===e&&(this._resolved=t)}))}}get _dialog(){return this.renderRoot.querySelector("mc-anim-svg-dialog")}openExport(e=!1){this._dialog?.openExport(e)}openImport(e="",t=""){this._dialog?.openImport(e,t)}_choose(e){const t=this.selection;if((this.doc&&lb(this.doc,t)?db(t):void 0)===e&&"tool"===t.kind)return void Ib(this,{kind:"none"});const i=ob(t.target)?t.target:void 0;Ib(this,{kind:"tool",tool:e,...i?{target:i}:{}})}render(){const e=this.doc;if(!e||"keyframes"!==e.kind)return n.qy``;const t=lb(e,this.selection),i=t?db(this.selection):void 0,s=t?mb.hint:"",a=this.pieces??this._resolved?.pieces??[],r=n.qy`<mc-anim-svg-dialog
      .doc=${e}
      .pieces=${a}
      .viewBox=${bb(this.doc?.rig,this._resolved)}
      ?disabled=${this.disabled}
    ></mc-anim-svg-dialog>`;if(!t)return n.qy`<button type="button" class="btn btn-secondary btn-sm open" ?disabled=${this.disabled} @click=${()=>this._choose("select")}>
          <ha-icon icon="mdi:draw-pen"></ha-icon>${Zn(272)}
        </button>
        ${r}`;const o=ob(this.selection.target);return n.qy`<div class="bar" role="toolbar" aria-label=${Zn(282)}>
        ${Zb.map(e=>{const t=pb[e],s=this.disabled||"motion"===e&&!o;return n.qy`<button
            type="button"
            class="icon-btn tool"
            data-tool=${e}
            aria-pressed=${i===e?"true":"false"}
            aria-label=${Zn(t.label)}
            title=${Zn("motion"!==e||o?t.label:476)}
            ?disabled=${s}
            @click=${()=>this._choose(e)}
          >
            <ha-icon icon=${t.icon}></ha-icon>
          </button>`})}
        <span class="sep" aria-hidden="true"></span>
        <button type="button" class="icon-btn import" aria-label=${Zn(402)} title=${Zn(402)} ?disabled=${this.disabled} @click=${()=>this.openImport()}>
          <ha-icon icon="mdi:file-import-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn export" aria-label=${Zn(786)} title=${Zn(786)} ?disabled=${this.disabled} @click=${()=>this.openExport()}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>
        </button>
        <button type="button" class="icon-btn done" aria-label=${Zn(927)} title=${Zn(927)} @click=${()=>Ib(this,{kind:"none"})}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
      ${s?n.qy`<p class="hint">${s}</p>`:n.s6}
      ${r}`}};Kb.styles=[Wp,n.AH`
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
    `],Bb([(0,s.MZ)({attribute:!1})],Kb.prototype,"doc",void 0),Bb([(0,s.MZ)({attribute:!1})],Kb.prototype,"selection",void 0),Bb([(0,s.MZ)({type:Boolean})],Kb.prototype,"disabled",void 0),Bb([(0,s.MZ)({attribute:!1})],Kb.prototype,"tile",void 0),Bb([(0,s.MZ)({type:Number})],Kb.prototype,"time",void 0),Bb([(0,s.MZ)({attribute:!1})],Kb.prototype,"hass",void 0),Bb([(0,s.MZ)({attribute:!1})],Kb.prototype,"library",void 0),Bb([(0,s.MZ)({attribute:!1})],Kb.prototype,"stage",void 0),Bb([(0,s.MZ)({attribute:!1})],Kb.prototype,"pieces",void 0),Bb([(0,s.wk)()],Kb.prototype,"_resolved",void 0),Kb=Bb([(0,s.EM)("mc-anim-draw-toolbar")],Kb),$s({tag:"mc-anim-draw-toolbar",place:"stage-tool",when:e=>"keyframes"===e.kind,title:272,order:90,dock:"top"});var Wb=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Ub=[{target:"element",label:306,icon:"mdi:square-rounded-outline"},{target:"icon",label:391,icon:"mdi:star-outline"},{target:"name",label:554,icon:"mdi:format-title"},{target:"state",label:905,icon:"mdi:numeric"},{target:"background",label:93,icon:"mdi:rectangle-outline"}];function Gb(e,t){return!!e.tracks?.some(e=>e.target===t&&(e.keyframes.length>0||!!e.path))||("element"===t||"icon"===t)&&(e.target??"element")===t&&(e.keyframes?.length??0)>0}const Yb=Yn;let Jb=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=_s,this.tile="icon",this.density="full",this._list=new jf(this,{select:e=>e.startsWith("lane:")?!this.disabled&&Pf(this,this.doc,e):this._select(e.slice(7)),open:(e,t)=>this._list.setOpen(e,t),nameOf:e=>e.startsWith("lane:")?Ef(e):(e=>{const t=Ub.find(t=>t.target===e)?.label;return void 0===t?void 0:Zn(t)})(e.slice(7))??e})}_select(e){if(this.disabled)return;const t={kind:"target",target:e};this.dispatchEvent(new CustomEvent("selection-change",{detail:{selection:t},bubbles:!0,composed:!0}))}_row(e,t,i){const n=this.doc,s=Gb(n,e.target)?(e.target===n.target&&"keyframes"===n.kind?n.keyframes?.length??0:0)+(n.tracks?.find(t=>t.target===e.target)?.keyframes.length??0):0,a=`target:${e.target}`,r=Lf(n,this.layerView??Gr,e.target,a),o=this._list.row({key:a,expanded:r,name:Zn(e.label),icon:e.icon,note:t?void 0:Zn(602),badge:s?Zn(1187,{count:s}):void 0,describe:[Gb(n,e.target)?Zn(1119):"",t?"":Zn(1150,{tile:Zn(Qn(this.tile).label)})].filter(Boolean).join(", "),selected:i===e.target&&!(r&&"keys"===this.selection.kind),toggles:"element"===e.target?["lock"]:void 0,title:t?Zn(e.label):Zn(1214,{label:Zn(e.label),tile:Zn(Qn(this.tile).label)})});return r?[o,...Hf(this._list,n,this.selection,e.target,2)]:[o]}render(){const e=this.doc;if(!e)return n.s6;const t=Qn(this.tile),i=(s=this.selection,"target"===s?.kind||"keys"===s?.kind?s.target??s.keys?.[0]?.target:void 0);var s;const a=e=>t.targets.includes(e),r=Ub.filter(t=>a(t.target)||Gb(e,t.target)||i===t.target),o=Ub.filter(e=>!a(e.target));return n.qy`
      <ul aria-label=${Zn(136)}>
        ${r.map(e=>this._row(e,a(e.target),i))}
      </ul>
      ${o.length?n.qy`<p class="hint">
            ${Zn(1195,{count:o.length,names:Yb(o.map(e=>Zn(e.label))),tile:Zn(t.label)})}
          </p>`:n.s6}
    `}};Jb.styles=[Wp,zf,n.AH`
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
    `],Wb([(0,s.MZ)({attribute:!1})],Jb.prototype,"doc",void 0),Wb([(0,s.MZ)({attribute:!1})],Jb.prototype,"hass",void 0),Wb([(0,s.MZ)({attribute:!1})],Jb.prototype,"library",void 0),Wb([(0,s.MZ)({type:Number})],Jb.prototype,"time",void 0),Wb([(0,s.MZ)({type:Boolean})],Jb.prototype,"disabled",void 0),Wb([(0,s.MZ)({attribute:!1})],Jb.prototype,"selection",void 0),Wb([(0,s.MZ)({attribute:!1})],Jb.prototype,"tile",void 0),Wb([(0,s.MZ)({attribute:!1})],Jb.prototype,"layerView",void 0),Wb([(0,s.MZ)()],Jb.prototype,"density",void 0),Jb=Wb([(0,s.EM)("mc-anim-targets-layers")],Jb),$s({tag:"mc-anim-targets-layers",place:"layers",when:e=>"keyframes"===e.kind,title:136,order:40});var Xb=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Qb=["lock"],ey=["hide","lock"],ty=[];let iy=class extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this.emitter=0,this.all=!1,this._open=new Map,this._list=new jf(this,{select:e=>this._pick(e),move:(e,t)=>this._move(e,t),rename:e=>this._renaming=e,dblclick:e=>!this.disabled&&/^emitter:/.test(e)&&this._multi&&!this._list.refuseLocked(e,this._nameOfKey(e))&&(this._renaming=e),open:(e,t)=>this._open=new Map(this._open).set(e,t),nameOf:e=>this._nameOfKey(e)})}get _multi(){return!!this.doc&&pm(this.doc)>1}_ems(e){const t=e.particles?.sim?Jr(e):["main"];return Array.from({length:pm(e)},(i,n)=>({i:n,id:t[n]??`e${n+1}`,name:km(e,0,n),side:xm(e,n)}))}_nameOfKey(e){const t=e.slice(e.indexOf(":")+1).replace(/[|/].*$/,""),i=this.doc?this._ems(this.doc).find(e=>e.id===t):void 0;return e.startsWith("children:")?Zn(152,{name:i?.name??t}):i?.name??t}_emit(e,t){this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:e,label:t}}))}_select(e){this.dispatchEvent(new CustomEvent("emitter-change",{bubbles:!0,composed:!0,detail:{index:e,all:!1}}))}_pick(e){if(this.disabled||!this.doc)return;const t=e.slice(e.indexOf(":")+1).replace(/[|/].*$/,""),i=this._ems(this.doc).find(e=>e.id===t);i&&(this._sub=e.startsWith("emitter:")?void 0:e,this._select(i.i))}_side(e,t){return e.filter(e=>e.side===t).reverse()}_move(e,t){const i=this.doc;if(!i||this.disabled)return;const n=this._ems(i),s=n.find(t=>`emitter:${t.id}`===e);if(!s)return;const a=this._side(n,s.side),r=a.indexOf(s),o=n[Math.max(0,Math.min(n.length-1,this.emitter))]?.id;let l,c,d;if("up"===t?"back"===s.side&&0===r:"front"===s.side&&r===a.length-1){const e="back"===s.side?"front":"back";l=function(e,t,i,n){if(!bm(e,i)||xm(e,i)===n)return{doc:e,index:i};if(1===pm(e))return{doc:xu(e,{layer:n}),index:0};const s=fm(e,0),[a]=s.splice(i,1);a.layer=n;let r=Math.min(i,s.length);if("front"===n){const e=s.findIndex(e=>"front"===e.layer);e>=0&&(r=e)}else{const e=s.map(e=>e.layer).lastIndexOf("back");e>=0&&(r=e+1)}return s.splice(r,0,a),{doc:vm(e,0,s),index:r}}(i,0,s.i,e).doc,c=Zn("front"===e?486:484),d=Zn("front"===e?1236:1235,{name:s.name})}else{const e=a["up"===t?r-1:r+1];if(!e)return;l=function(e,t,i,n){if(!bm(e,i)||!bm(e,n)||i===n)return e;const s=fm(e,0);return s.splice(n,0,s.splice(i,1)[0]),vm(e,0,s)}(i,0,s.i,e.i),c=Zn("up"===t?487:485),d=Zn(1238,{name:s.name,direction:Zn("up"===t?1174:1127),position:"up"===t?r:r+2,count:a.length})}if(l===i)return;this._emit(l,c),this._list.announce(d);const p=Jr(l).indexOf(o??"");p>=0&&p!==this.emitter&&l.particles?.sim&&this._select(p)}_rename(e,t){if(this._renaming!==e)return;this._renaming=void 0;const i=this.doc,n=i?this._ems(i).find(t=>`emitter:${t.id}`===e):void 0;if(!i||!n||this._list.refuseLocked(e,n.name))return;const s=ym(i,0,n.i,t);s!==i&&this._emit(s,"Rename emitter")}_moveInfo(e,t,i){const n=i.indexOf(e),s="up"===t?"back"===e.side&&0===n:"front"===e.side&&n===i.length-1,a="up"===t?0===n:n===i.length-1,r=!this.disabled&&(s||!a);if(s){const i=Zn("up"===t?1137:1122);return{ok:r,label:Zn(511,{name:e.name,where:i}),menu:Zn(512,{where:i})}}return"up"===t?{ok:r,label:Zn(509,{name:e.name}),menu:Zn(502)}:{ok:r,label:Zn(506,{name:e.name}),menu:Zn(481)}}_focusRow(e){this._list.focusKey(e)}_renameField(e,t){return n.qy`<input
      class="input rename"
      aria-label=${Zn(429)}
      maxlength=${40}
      .value=${e.name}
      @click=${e=>e.stopPropagation()}
      @keydown=${e=>{e.stopPropagation(),"Enter"===e.key?(this._rename(t,e.target.value),this._focusRow(t)):"Escape"===e.key&&(this._renaming=void 0,this._focusRow(t))}}
      @blur=${e=>this._rename(t,e.target.value)}
    />`}_rowsOf(e,t,i,n){const s=`emitter:${t.id}`,a=Bu(e,0),r=0===t.i?a:a.emitters[t.i-1],o=0===t.i?a.children:a.emitters[t.i-1].children,l=!this.all&&Math.min(this.emitter,i.length-1)===t.i,c=this._open.get(s)??(1===i.length||l),d=this._side(i,t.side),p=[this._list.row({key:s,name:t.name,icon:"mdi:shimmer",selected:l&&!this._sub,expanded:c,toggles:n,up:this._moveInfo(t,"up",d),down:this._moveInfo(t,"down",d),renamable:this._multi,renaming:this._renaming===s?this._renameField(t,s):void 0,describe:"front"===t.side?Zn(1137):Zn(1122),title:"front"===t.side?Zn(1246,{name:t.name}):Zn(1245,{name:t.name})})];if(!c)return p;o&&p.push(this._list.row({key:`children:${t.id}`,name:Zn(151),icon:"mdi:dots-hexagon",level:2,selected:this._sub===`children:${t.id}`,toggles:n}));const h=(e,t,i)=>{Uu({shapes:e}).forEach((e,n)=>{const s=`pshape:${t}|${n}`;p.push(this._list.row({key:s,name:`${i} ${n+1}: ${Eu(e.shape)}`,icon:"mdi:shape-outline",level:2,selected:this._sub===s,toggles:ty}))})};return h(r.shapes,t.id,Zn(830)),o&&h(o.shapes,`${t.id}/c`,Zn(153)),p}updated(e){if((e.has("emitter")&&void 0!==e.get("emitter")||e.has("all")&&void 0!==e.get("all"))&&this.doc&&!this.all){const e=this._ems(this.doc)[Math.min(this.emitter,pm(this.doc)-1)]?.id;this.renderRoot.querySelector(`[data-lk="emitter:${e}"]`)?.scrollIntoView?.({block:"nearest"})}}render(){const e=this.doc;if(!e||"particles"!==e.kind)return n.s6;const t=this._ems(e),i=!!e.particles?.sim,s=i&&!!pd(e),a=i?s?void 0:Qb:ey,r=this._side(t,"front"),o=this._side(t,"back");return n.qy`<ul aria-label=${Zn(650)}>
        ${r.flatMap(i=>this._rowsOf(e,i,t,a))}
        <li class="lcontent" title=${Zn(135)}>
          <ha-icon icon="mdi:card-text-outline" aria-hidden="true"></ha-icon><span>${Zn(134)}</span><span class="sr">${Zn(7)}</span>
        </li>
        ${o.flatMap(i=>this._rowsOf(e,i,t,a))}
      </ul>
      ${i&&!s?n.qy`<p class="note">${Zn(382)}</p>`:n.s6}`}};iy.styles=[Wp,zf,n.AH`
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
    `],Xb([(0,s.MZ)({attribute:!1})],iy.prototype,"doc",void 0),Xb([(0,s.MZ)({attribute:!1})],iy.prototype,"selection",void 0),Xb([(0,s.MZ)({type:Boolean})],iy.prototype,"disabled",void 0),Xb([(0,s.MZ)({attribute:!1})],iy.prototype,"hass",void 0),Xb([(0,s.MZ)({attribute:!1})],iy.prototype,"library",void 0),Xb([(0,s.MZ)({type:Number})],iy.prototype,"time",void 0),Xb([(0,s.MZ)({attribute:!1})],iy.prototype,"tile",void 0),Xb([(0,s.MZ)({attribute:!1})],iy.prototype,"stage",void 0),Xb([(0,s.MZ)({attribute:!1})],iy.prototype,"layerView",void 0),Xb([(0,s.MZ)()],iy.prototype,"density",void 0),Xb([(0,s.MZ)({type:Number})],iy.prototype,"emitter",void 0),Xb([(0,s.MZ)({type:Boolean})],iy.prototype,"all",void 0),Xb([(0,s.wk)()],iy.prototype,"_open",void 0),Xb([(0,s.wk)()],iy.prototype,"_renaming",void 0),Xb([(0,s.wk)()],iy.prototype,"_sub",void 0),iy=Xb([(0,s.EM)("mc-anim-particles-layers")],iy),$s({tag:"mc-anim-particles-layers",place:"layers",when:e=>"particles"===e.kind,title:650,order:10});var ny=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const sy={element:306,icon:391,particles:653};let ay=class extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._sel="path",this._list=new jf(this,{select:e=>this._sel=e,nameOf:e=>"path"===e?Zn(474):Zn(518,{subject:this._subject()})})}_subject(){const e=sy[this.doc?.path?.subject??"element"]??sy.element;return Zn(e)}render(){const e=this.doc;return e&&"path"===e.kind?e.path?.d.trim()?n.qy`<ul aria-label=${Zn(667)}>
      ${this._list.row({key:"path",name:Zn(474),icon:"mdi:vector-curve",selected:"path"===this._sel})}
      ${this._list.row({key:"subject",name:Zn(518,{subject:this._subject()}),icon:"mdi:arrow-right-bold-outline",selected:"subject"===this._sel})}
    </ul>`:n.qy`<p class="empty-note">${Zn(580)}</p>`:n.s6}};ay.styles=[Wp,zf,n.AH`
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
    `],ny([(0,s.MZ)({attribute:!1})],ay.prototype,"doc",void 0),ny([(0,s.MZ)({attribute:!1})],ay.prototype,"selection",void 0),ny([(0,s.MZ)({type:Boolean})],ay.prototype,"disabled",void 0),ny([(0,s.MZ)({attribute:!1})],ay.prototype,"hass",void 0),ny([(0,s.MZ)({attribute:!1})],ay.prototype,"library",void 0),ny([(0,s.MZ)({type:Number})],ay.prototype,"time",void 0),ny([(0,s.MZ)({attribute:!1})],ay.prototype,"tile",void 0),ny([(0,s.MZ)({attribute:!1})],ay.prototype,"stage",void 0),ny([(0,s.MZ)({attribute:!1})],ay.prototype,"layerView",void 0),ny([(0,s.MZ)()],ay.prototype,"density",void 0),ny([(0,s.wk)()],ay.prototype,"_sel",void 0),ay=ny([(0,s.EM)("mc-anim-path-layers")],ay),$s({tag:"mc-anim-path-layers",place:"layers",when:e=>"path"===e.kind,title:666,order:10});var ry=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let oy=class extends n.WF{constructor(){super(...arguments),this.selection={kind:"none"},this.disabled=!1,this.time=0,this.density="full",this._list=new jf(this,{select:e=>this._sel=e,move:(e,t)=>this._move(Number(e.slice(5)),t),nameOf:e=>this._name(Number(e.slice(5)))})}_name(e){const t=this.doc?.steps?.[e];return t?uf(t.animation,this.library,this.doc?.id).name:Zn(923,{i:e+1})}_move(e,t){const i=this.doc,n=i?.steps??[],s="up"===t?e-1:e+1;if(!i||this.disabled||s<0||s>=n.length)return;const a=this._name(e);let r;try{r=this.renderRoot.activeElement?.getAttribute("data-ctl")??void 0}catch{r=void 0}this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:{...i,steps:mf(n,e,s)},label:Zn(497)}})),this._list.announce(Zn(1231,{name:a,to:s+1,count:n.length}),ho(this.layerView??{hidden:[],solo:[],locked:[],open:[]},e,s)),this._sel===`step:${e}`&&(this._sel=`step:${s}`),queueMicrotask(()=>this._list.focusKey(`step:${s}`,r))}render(){const e=this.doc;if(!e||"sequence"!==e.kind)return n.s6;const t=e.steps??[];return t.length?n.qy`<ol aria-label=${Zn(818)}>
      ${t.map((i,s)=>{const a=uf(i.animation,this.library,e.id),r="ok"===a.status?i.duration??a.defaultDuration:void 0,o=`step:${s}`,l=a.name;return this._list.row({key:o,name:l,thumb:n.qy`<span class="num" aria-hidden="true">${s+1}</span>`,note:a.problem,badge:void 0!==r?gf(r):void 0,describe:a.problem?Zn(1164,{i:s+1,count:t.length,problem:a.problem}):Zn(1163,{i:s+1,count:t.length}),selected:this._sel===o,up:{ok:!this.disabled&&s>0,label:Zn(510,{name:l}),menu:Zn(503)},down:{ok:!this.disabled&&s<t.length-1,label:Zn(508,{name:l}),menu:Zn(483)}})})}
    </ol>`:n.qy`<p class="empty-note">${Zn(585)}</p>`}};oy.styles=[Wp,zf,n.AH`
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
    `],ry([(0,s.MZ)({attribute:!1})],oy.prototype,"doc",void 0),ry([(0,s.MZ)({attribute:!1})],oy.prototype,"selection",void 0),ry([(0,s.MZ)({type:Boolean})],oy.prototype,"disabled",void 0),ry([(0,s.MZ)({attribute:!1})],oy.prototype,"hass",void 0),ry([(0,s.MZ)({attribute:!1})],oy.prototype,"library",void 0),ry([(0,s.MZ)({type:Number})],oy.prototype,"time",void 0),ry([(0,s.MZ)({attribute:!1})],oy.prototype,"tile",void 0),ry([(0,s.MZ)({attribute:!1})],oy.prototype,"stage",void 0),ry([(0,s.MZ)({attribute:!1})],oy.prototype,"layerView",void 0),ry([(0,s.MZ)()],oy.prototype,"density",void 0),ry([(0,s.wk)()],oy.prototype,"_sel",void 0),oy=ry([(0,s.EM)("mc-anim-steps-layers")],oy),$s({tag:"mc-anim-steps-layers",place:"layers",when:e=>"sequence"===e.kind,title:817,order:10});const ly=[{id:"state",label:906},{id:"state_not",label:907},{id:"entity_on",label:319},{id:"entity_off",label:318},{id:"above",label:1091},{id:"below",label:1093}],cy=[{id:"cut",label:224,hint:938},{id:"crossfade",label:209,hint:333},{id:"finish",label:342,hint:435}];function dy(e,t){const i=Number(t),n=""!==t.trim()&&Number.isFinite(i)?i:0,s=t.trim()||"on";switch(e){case"state":return{state:s};case"state_not":return{state_not:s};case"entity_on":return{entity_on:!0};case"entity_off":return{entity_on:!1};case"above":return{above:n};case"below":return{below:n}}}function py(e){return e&&"object"==typeof e?(e instanceof Map?[...e.values()]:Array.isArray(e)?e:Object.values(e)).filter(e=>!!e&&"object"==typeof e&&"string"==typeof e.id):[]}const hy=e=>(e?.length??0)<12;var uy=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let my=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=_s,this._announce=""}get _clips(){return Array.isArray(this.doc?.clips)?this.doc.clips:[]}_write(e,t){if(!this.doc)return;const i={...this.doc};e.length?i.clips=e:delete i.clips,this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:i,label:t}}))}_patch(e,t,i){this._write(this._clips.map((i,n)=>n===e?{...i,...t}:i),i)}_add(){if(!hy(this._clips))return;const e=function(e){const t=new Set(e.map(e=>"state"in e.when?e.when.state:""));if(t.has("on")&&t.has("off"))return{when:{above:50},animation:"self",transition:"crossfade"};const i=t.has("on")?"off":"on";return{when:{state:i},animation:"off"===i?"none":"self",transition:"crossfade"}}(this._clips);this._write([...this._clips,e],"Add state"),this._focusAfter=`.clip[data-i="${this._clips.length}"] select.when`,this._announce=Zn(911,{count:this._clips.length+1,when:Nd(e.when)})}_remove(e){const t=this._clips.filter((t,i)=>i!==e);this._write(t,"Delete state"),this._focusAfter=t.length?`.clip[data-i="${Math.min(e,t.length-1)}"] .del`:".add",this._announce=Zn(913,{i:e+1})}_move(e,t){t<0||t>=this._clips.length||(this._write(function(e,t,i){if(t===i||t<0||i<0||t>=e.length||i>=e.length)return[...e];const n=[...e],[s]=n.splice(t,1);return n.splice(i,0,s),n}(this._clips,e,t),"Reorder states"),this._focusAfter=`.clip[data-i="${t}"] .${t<e?"up":"down"}`,this._announce=Zn(910,{to:t+1}))}updated(){const e=this._focusAfter;if(!e)return;this._focusAfter=void 0;const t=this.renderRoot.querySelector(e);(t&&!t.disabled?t:this.renderRoot.querySelector(".add"))?.focus()}_when(e,t){const i="state"in(s=e.when)?"state":"state_not"in s?"state_not":"entity_on"in s?s.entity_on?"entity_on":"entity_off":"above"in s?"above":"below";var s;const a=function(e){return"state"in e?e.state:"state_not"in e?e.state_not:"above"in e?String(e.above):"below"in e?String(e.below):""}(e.when),r=`st-${t}`,o="above"===i||"below"===i;return n.qy`<div class="pair">
      <div class="field">
        <div class="field-head"><label for="${r}-k">${Zn(1104)}</label></div>
        <div class="select">
          <select
            class="input when"
            id="${r}-k"
            ?disabled=${this.disabled}
            @change=${e=>this._patch(t,{when:dy(e.target.value,a)},"Change state condition")}
          >
            ${ly.map(e=>n.qy`<option value=${e.id} ?selected=${e.id===i}>${Zn(e.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>
      ${"entity_on"===i||"entity_off"===i?n.qy`<div class="field"><div class="field-head"><span class="lbl">${Zn(1090)}</span></div><p class="help fill">${Zn(619)}</p></div>`:n.qy`<div class="field">
            <div class="field-head"><label for="${r}-v">${Zn(o?615:905)}</label></div>
            <input
              class="input ${o?"":"mono"}"
              id="${r}-v"
              type=${o?"number":"text"}
              step="any"
              inputmode=${o?"decimal":"text"}
              placeholder=${o?"0":Zn(1152)}
              autocomplete="off"
              spellcheck="false"
              ?disabled=${this.disabled}
              .value=${a}
              @change=${e=>{const n=e.target.value;!o||""!==n.trim()&&Number.isFinite(Number(n))?this._patch(t,{when:dy(i,n)},"Change state value"):e.target.value=a}}
            />
          </div>`}
    </div>`}_play(e,t){const i=`st-${t}-a`,s=function(e,t){const i=[{label:Zn(1015),items:[{value:"self",label:Zn(639)},{value:"none",label:Zn(609)}]}],n=py(e).filter(e=>((e,t)=>!!e&&e.id!==t&&pf(e)&&!(Array.isArray(e.clips)&&e.clips.length>0))(e,t)).sort((e,t)=>(e.name||e.id).localeCompare(t.name||t.id)).map(e=>({value:Ze+e.id,label:e.name||e.id}));n.length&&i.push({label:Zn(553),items:n});for(const e of X){const t=J.filter(t=>t.group===e&&dt.has(t.id)).map(e=>({value:e.id,label:(0,N.t)(e.name)}));t.length&&i.push({label:(0,N.t)(Q[e]),items:t})}return i}(this.library,this.doc?.id),a=s.some(t=>t.items.some(t=>t.value===e.animation));return n.qy`<div class="field">
      <div class="field-head"><label for=${i}>${Zn(685)}</label></div>
      <div class="select">
        <select class="input play" id=${i} ?disabled=${this.disabled} @change=${e=>this._patch(t,{animation:e.target.value},"Change state animation")}>
          ${a?n.s6:n.qy`<option value=${e.animation} selected>${function(e,t,i){if("self"===e)return Zn(639);if("none"===e)return Zn(608);if(Ke(e)){const n=We(e),s=py(t).find(e=>e.id===n);return s?s.name||s.id:n===i?Zn(639):Zn(1203,{id:n})}const n=te(e)?.name;return void 0!==n?(0,N.t)(n):Zn(1177,{animation:e})}(e.animation,this.library,this.doc?.id)}</option>`}
          ${s.map(t=>n.qy`<optgroup label=${t.label}>
              ${t.items.map(t=>n.qy`<option value=${t.value} ?selected=${t.value===e.animation}>${t.label}</option>`)}
            </optgroup>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`}_transition(e,t){const i=e.transition??"cut",s=e=>{e!==i&&this._patch(t,{transition:e},"Change state transition")},a=(cy.find(e=>e.id===i)??cy[0]).hint;return n.qy`<div class="field">
      <div class="field-head"><span class="lbl" id="st-${t}-t">${Zn(1043)}</span></div>
      <div class="seg full" role="radiogroup" aria-labelledby="st-${t}-t" aria-describedby="st-${t}-th" @keydown=${e=>{const n=cy.findIndex(e=>e.id===i),a={ArrowRight:(n+1)%cy.length,ArrowLeft:(n-1+cy.length)%cy.length,Home:0,End:cy.length-1}[e.key];void 0!==a&&(e.preventDefault(),s(cy[a].id),this._focusAfter=`.clip[data-i="${t}"] .seg [aria-checked="true"]`)}}>
        ${cy.map(e=>{const t=e.id===i;return n.qy`<button type="button" role="radio" aria-checked=${t?"true":"false"} tabindex=${t?"0":"-1"} ?disabled=${this.disabled} @click=${()=>s(e.id)}>
            ${Zn(e.label)}
          </button>`})}
      </div>
      <p class="help" id="st-${t}-th">${Zn(a)}.</p>
    </div>`}_clip(e,t,i){const s=function(e,t,i){if(!Ke(e.animation)){if("self"===e.animation||"none"===e.animation)return;return te(e.animation)?dt.has(e.animation)?void 0:Zn(304):Zn(1065)}const n=We(e.animation);if(n===i)return Zn(1074);const s=py(t).find(e=>e.id===n);return s?Array.isArray(s.clips)&&s.clips.length?Zn(943):pf(s)?void 0:Zn(648):Zn(601)}(e,this.library,this.doc?.id);return n.qy`<li class="cond clip" data-i=${t}>
      <div class="cond-head">
        <span class="n">${Zn(912,{i:t+1})} <span class="sub">· ${Nd(e.when)}</span></span>
        <button type="button" class="icon-btn sm up" aria-label=${Zn(496,{i:t+1})} title=${Zn(501)} ?disabled=${this.disabled||0===t} @click=${()=>this._move(t,t-1)}>
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button type="button" class="icon-btn sm down" aria-label=${Zn(495,{i:t+1})} title=${Zn(481)} ?disabled=${this.disabled||t===i-1} @click=${()=>this._move(t,t+1)}>
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button type="button" class="icon-btn sm danger del" aria-label=${Zn(245,{i:t+1})} title=${Zn(244)} ?disabled=${this.disabled} @click=${()=>this._remove(t)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${s?n.qy`<p class="help error">${s}</p>`:n.s6}
      ${this._when(e,t)} ${this._play(e,t)} ${this._transition(e,t)}
    </li>`}render(){const e=this._clips,t=!hy(e);return n.qy`
      <div class="wrap">
        <p class="help lead">
          ${e.length?Zn(971):Zn(691)}
        </p>
        ${e.length?n.qy`<ol class="clips">${e.map((t,i)=>this._clip(t,i,e.length))}</ol>`:n.s6}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm add" ?disabled=${this.disabled||t} @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${Zn(35)}
          </button>
          ${t?n.qy`<span class="help">${Zn(74,{cLIPS_MAX:12})}</span>`:n.s6}
        </div>
        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `}};my.styles=[Wp,n.AH`
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
    `],uy([(0,s.MZ)({attribute:!1})],my.prototype,"doc",void 0),uy([(0,s.MZ)({attribute:!1})],my.prototype,"hass",void 0),uy([(0,s.MZ)({attribute:!1})],my.prototype,"library",void 0),uy([(0,s.MZ)({type:Number})],my.prototype,"time",void 0),uy([(0,s.MZ)({type:Boolean,reflect:!0})],my.prototype,"disabled",void 0),uy([(0,s.MZ)({attribute:!1})],my.prototype,"selection",void 0),uy([(0,s.MZ)({attribute:!1})],my.prototype,"tile",void 0),uy([(0,s.wk)()],my.prototype,"_announce",void 0),my=uy([(0,s.EM)("mc-anim-states-panel")],my),$s({tag:"mc-anim-states-panel",place:"inspector",when:(e,t)=>"none"===t.kind,title:914,order:60});const gy=[{id:"rotate_speed",label:773,unit:"°/s",output:[0,720],step:10,hint:876},{id:"rotate",label:772,unit:"°",output:[0,180],step:5,hint:1056},{id:"x",label:478,unit:"px",output:[0,12],step:1,hint:519},{id:"y",label:479,unit:"px",output:[0,-12],step:1,hint:521},{id:"scale",label:791,unit:"×",output:[.8,1.2],step:.05,hint:379},{id:"opacity",label:627,unit:"0-1",output:[.3,1],step:.05,hint:334},{id:"draw",label:272,unit:"0-1",output:[0,1],step:.05,rigOnly:!0,hint:284},{id:"color_mix",label:180,unit:"",output:["#9e9e9e","#ffb300"],step:1,hint:108},{id:"speed",label:693,unit:"×",output:[.25,2],step:.05,hint:697}],fy=e=>gy.find(t=>t.id===e)??gy[0],vy=e=>gy.filter(t=>!t.rigOnly||(e=>/^(part|group|shape):/.test(e))(e)),by=e=>(e?.bindings?.length??0)<8;function yy(e,t){const i={...e};return t.length?i.bindings=t:delete i.bindings,i}const xy=/^[a-z0-9_][a-z0-9_.-]{0,63}$/i;var wy=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const _y={element:306,icon:391,name:554,state:905,background:93},ky={element:1166,icon:1167,name:1168,state:1169,background:1165},$y=e=>e.target??e.keys?.[0]?.target;let My=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection=_s,this._announce="",this._badAttr=new Set}get _target(){return $y(this.selection)}_write(e,t){this.doc&&this.dispatchEvent(new CustomEvent("doc-change",{bubbles:!0,composed:!0,detail:{doc:yy(this.doc,e),label:t}}))}_patch(e,t,i){this._write((this.doc?.bindings??[]).map((i,n)=>n===e?t:i),i)}_add(){const e=this._target;if(!e||!this.doc||!by(this.doc))return;const t=this.doc.bindings??[],i=function(e){const t=vy(e)[0];return{target:e,property:t.id,input:{min:0,max:100},output:[...t.output],smoothing:.4}}(e);this._write([...t,i],"Add value binding"),this._focusAfter=`.bind[data-i="${t.length}"] select.prop`,this._announce=Zn(100,{property:Zn(fy(i.property).label)})}_remove(e){const t=(this.doc?.bindings??[]).filter((t,i)=>i!==e);this._write(t,"Delete value binding"),this._focusAfter=".add",this._announce=Zn(101)}_checkAttr(e,t){const i=!t.trim()||xy.test(t.trim());if(i!==!this._badAttr.has(e)){const t=new Set(this._badAttr);i?t.delete(e):t.add(e),this._badAttr=t}return i}updated(){const e=this._focusAfter;e&&(this._focusAfter=void 0,this.renderRoot.querySelector(e)?.focus())}_num(e,t,i,s,a){return n.qy`<div class="field">
      <div class="field-head"><label for=${e}>${t}</label></div>
      <input
        class="input"
        id=${e}
        type="number"
        step=${s}
        inputmode="decimal"
        ?disabled=${this.disabled}
        .value=${String(i)}
        @change=${e=>{const t=e.target,n=Number(t.value);""!==t.value.trim()&&Number.isFinite(n)?n!==i&&a(n):t.value=String(i)}}
      />
    </div>`}_output(e,t){const i=fy(e.property),s=`bd-${t}`;if("color_mix"===e.property){const[i,s]=e.output,a=(n,a)=>{if(!a)return;const r=[i,s];r[n]=a,this._patch(t,{...e,output:r},"Change binding colours")};return n.qy`<div class="field">
          <div class="field-head"><span class="lbl">${Zn(363)}</span></div>
          <mc-color-picker .value=${i} .label=${Zn(363)} @value-changed=${e=>a(0,e.detail.value)}></mc-color-picker>
        </div>
        <div class="field">
          <div class="field-head"><span class="lbl">${Zn(1035)}</span></div>
          <mc-color-picker .value=${s} .label=${Zn(1035)} @value-changed=${e=>a(1,e.detail.value)}></mc-color-picker>
        </div>`}const[a,r]=e.output,o=i.unit?` (${i.unit})`:"";return n.qy`<div class="pair">
      ${this._num(`${s}-from`,Zn(364,{unit:o}),a,i.step,i=>this._patch(t,{...e,output:[i,r]},"Change binding output"))}
      ${this._num(`${s}-to`,Zn(1040,{unit:o}),r,i.step,i=>this._patch(t,{...e,output:[a,i]},"Change binding output"))}
    </div>`}_binding(e,t,i){const s=`bd-${t}`,a=fy(e.property),r=vy(e.target),o=function(e){return e.input.min===e.input.max?Zn(466):void 0===e.input.attribute||""===e.input.attribute||xy.test(e.input.attribute)?void 0:Zn(92)}(e),l=function(e,t){if(!e)return;const i="element"===t.target||"icon"===t.target?e.keyframes:e.tracks?.find(e=>e.target===t.target)?.keyframes;if(!i?.length)return;const n=i,s=e=>n.some(t=>void 0!==e(t));switch(t.property){case"opacity":return s(e=>e.opacity)?Zn(1008):void 0;case"draw":return s(e=>e.draw)?Zn(1007):void 0;case"color_mix":return("background"===t.target?s(e=>e.background):s(e=>e.color))?Zn(1009):void 0;case"rotate":case"x":case"y":case"scale":return s(e=>e.transform?.skew_x??e.transform?.skew_y)?Zn(1010):void 0;default:return}}(this.doc,e),c=this._badAttr.has(t);return n.qy`<li class="cond bind" data-i=${t}>
      <div class="cond-head">
        <span class="n">${Zn(102,{n:i+1})} <span class="sub">· ${Zn(a.label)}</span></span>
        <button type="button" class="icon-btn sm danger del" aria-label=${Zn(237,{n:i+1})} title=${Zn(236)} ?disabled=${this.disabled} @click=${()=>this._remove(t)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="${s}-p">${Zn(718)}</label></div>
        <div class="select">
          <select
            class="input prop"
            id="${s}-p"
            aria-describedby="${s}-ph"
            ?disabled=${this.disabled}
            @change=${i=>this._patch(t,function(e,t){return e.property===t?e:{...e,property:t,output:[...fy(t).output]}}(e,i.target.value),"Change bound property")}
          >
            ${r.map(t=>n.qy`<option value=${t.id} ?selected=${t.id===e.property}>${Zn(t.label)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
        <p class="help" id="${s}-ph">${Zn(a.hint)}</p>
      </div>
      <fieldset>
        <legend>${Zn(320)}</legend>
        <div class="field">
          <div class="field-head"><label for="${s}-a">${Zn(90)}</label></div>
          <input
            class="input mono"
            id="${s}-a"
            type="text"
            placeholder=${Zn(1162)}
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
            ${Zn(c?91:313)}
          </p>
        </div>
        <div class="pair">
          ${this._num(`${s}-min`,Zn(465),e.input.min,1,i=>this._patch(t,{...e,input:{...e.input,min:i}},"Change binding range"))}
          ${this._num(`${s}-max`,Zn(461),e.input.max,1,i=>this._patch(t,{...e,input:{...e.input,max:i}},"Change binding range"))}
        </div>
      </fieldset>
      <fieldset>
        <legend>${Zn(635)}</legend>
        ${this._output(e,t)}
        ${this._num(`${s}-s`,Zn(860),e.smoothing??0,.1,i=>{const n={...e};i>0?n.smoothing=Math.min(10,i):delete n.smoothing,this._patch(t,n,"Change binding smoothing")})}
      </fieldset>
      ${l?n.qy`<p class="help warn">${l}</p>`:n.s6}
      ${o?n.qy`<p class="help error" role="alert">${o}</p>`:n.s6}
    </li>`}render(){const e=this._target;if(!e||!this.doc)return n.qy``;const t=function(e,t){return t&&Array.isArray(e?.bindings)?e.bindings.map((e,t)=>({b:e,index:t})).filter(e=>e.b.target===t):[]}(this.doc,e),i=!by(this.doc),s=ky[e]?Zn(ky[e]):`“${function(e,t){if(_y[t])return Zn(_y[t]);const i=/^(part|group|shape):(.+)$/.exec(t);if(!i)return t;const n="part"===i[1]?e?.rig?.parts:"group"===i[1]?e?.rig?.groups:e?.rig?.shapes;return n?.find(e=>e.id===i[2])?.name||i[2]}(this.doc,e)}”`;return n.qy`
      <div class="wrap">
        <p class="help lead">
          ${t.length?n.qy`${Zn(967,{name:s})}`:n.qy`${Zn(286,{name:s})}`}
        </p>
        ${t.length?n.qy`<ol class="binds">${t.map((e,t)=>this._binding(e.b,e.index,t))}</ol>`:n.s6}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm add" ?disabled=${this.disabled||i} @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${Zn(39)}
          </button>
          ${i?n.qy`<span class="help">${Zn(80,{max:8})}</span>`:n.s6}
        </div>
        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `}};My.styles=[Wp,n.AH`
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
    `],wy([(0,s.MZ)({attribute:!1})],My.prototype,"doc",void 0),wy([(0,s.MZ)({attribute:!1})],My.prototype,"hass",void 0),wy([(0,s.MZ)({attribute:!1})],My.prototype,"library",void 0),wy([(0,s.MZ)({type:Number})],My.prototype,"time",void 0),wy([(0,s.MZ)({type:Boolean,reflect:!0})],My.prototype,"disabled",void 0),wy([(0,s.MZ)({attribute:!1})],My.prototype,"selection",void 0),wy([(0,s.MZ)({attribute:!1})],My.prototype,"tile",void 0),wy([(0,s.wk)()],My.prototype,"_announce",void 0),wy([(0,s.wk)()],My.prototype,"_badAttr",void 0),My=wy([(0,s.EM)("mc-anim-bindings-panel")],My),$s({tag:"mc-anim-bindings-panel",place:"inspector",when:(e,t)=>"keyframes"===e.kind&&"target"===t.kind&&!!$y(t),title:1095,order:60});var Sy=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const Cy=[{id:"on",label:617},{id:"off",label:616},{id:"unavailable",label:1057},{id:"value",label:1090,numeric:!0},{id:"custom",label:217}];let Ay=class extends n.WF{constructor(){super(...arguments),this.disabled=!1,this.selection=_s,this.time=0,this._choice="on",this._custom="idle",this._value=Hd.value,this._sent="",this._picked=!1}get detail(){return{state:"value"===this._choice?function(e,t){const[i,n]=Td(e).stateRange??[0,100];return String(Vd(i+(n-i)*Math.min(1,Math.max(0,t))))}(this.doc,this._value):"custom"===this._choice?this._custom.trim()||"idle":this._choice,value:this._value,attributes:Od(this.doc,this._value)}}_emit(){const e=this.detail,t=JSON.stringify(e);t!==this._sent&&(this._sent=t,this.dispatchEvent(new CustomEvent("preview-change",{bubbles:!0,composed:!0,detail:e})))}willUpdate(e){e.has("doc")&&!this._picked&&(this._choice=Td(this.doc).numericState?"value":"on")}updated(e){(e.has("doc")||e.has("_choice")||e.has("_custom")||e.has("_value"))&&this._emit()}_pick(e){this._picked=!0,this._choice=e,"custom"===e&&this.updateComplete.then(()=>this.renderRoot.querySelector(".custom")?.focus())}_states(e){const t=Cy.filter(t=>!t.numeric||e||this._choice===t.id);return n.qy`<div class="seg" role="radiogroup" aria-label=${Zn(713)} @keydown=${e=>{const i=t.findIndex(e=>e.id===this._choice),n={ArrowRight:(i+1)%t.length,ArrowLeft:(i-1+t.length)%t.length,Home:0,End:t.length-1}[e.key];void 0!==n&&(e.preventDefault(),this._picked=!0,this._choice=t[n].id,this.updateComplete.then(()=>this.renderRoot.querySelector('.seg [aria-checked="true"]')?.focus()))}}>
      ${t.map(e=>{const t=e.id===this._choice;return n.qy`<button type="button" role="radio" aria-checked=${t?"true":"false"} tabindex=${t?"0":"-1"} ?disabled=${this.disabled} @click=${()=>this._pick(e.id)}>${Zn(e.label)}</button>`})}
    </div>`}render(){if(!Pd(this.doc))return n.qy``;const e=Td(this.doc),t=Math.round(100*this._value);return n.qy`<div class="bar" role="group" aria-label=${Zn(711)}>
      <span class="lbl" aria-hidden="true"><ha-icon icon="mdi:lightbulb-outline"></ha-icon></span>
      ${this._states(e.numericState)}
      ${"custom"===this._choice?n.qy`<input
            class="input mono custom"
            type="text"
            aria-label=${Zn(220)}
            placeholder=${Zn(905)}
            autocomplete="off"
            spellcheck="false"
            ?disabled=${this.disabled}
            .value=${this._custom}
            @change=${e=>this._custom=e.target.value}
          />`:n.s6}
      ${e.value?n.qy`<label class="value">
            <span class="sr-only">${Zn(715)}</span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              ?disabled=${this.disabled}
              .value=${String(t)}
              aria-valuetext=${Zn(1252,{pct:t})}
              @input=${e=>this._value=Number(e.target.value)/100}
            />
            <output aria-hidden="true">${t}%</output>
          </label>`:n.s6}
    </div>`}};Ay.styles=[Wp,n.AH`
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
    `],Sy([(0,s.MZ)({attribute:!1})],Ay.prototype,"doc",void 0),Sy([(0,s.MZ)({type:Boolean,reflect:!0})],Ay.prototype,"disabled",void 0),Sy([(0,s.MZ)({attribute:!1})],Ay.prototype,"selection",void 0),Sy([(0,s.MZ)({type:Number})],Ay.prototype,"time",void 0),Sy([(0,s.wk)()],Ay.prototype,"_choice",void 0),Sy([(0,s.wk)()],Ay.prototype,"_custom",void 0),Sy([(0,s.wk)()],Ay.prototype,"_value",void 0),Ay=Sy([(0,s.EM)("mc-anim-stage-sim")],Ay),$s({tag:"mc-anim-stage-sim",place:"stage-tool",when:e=>Pd(e),title:711,order:80,dock:"bottom"});var jy=i(5084),zy=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};const qy=e=>!!e&&/^(part|group|shape):/.test(e),Ey=(e,t)=>"intensity"===e.id?`${t}×`:"direction"===e.id?Zn(t<0?764:358):`${t} %`;let Ly=class extends n.WF{constructor(){super(...arguments),this.time=0,this.disabled=!1,this.selection={kind:"none"},this.tile="icon",this._applied=new Map,this._status=""}willUpdate(e){if((e.has("doc")||e.has("tile"))&&this.doc){const e=hv(this.doc,this.tile);e!==this._ref&&(this._ref=e,this._geom=uv(e),this._geom||mv(e).then(t=>{this._ref===e&&(this._geom=t)}))}}get _targets(){const e=Bv(this.selection).filter(qy),t=this.selection.target;qy(t)&&!e.includes(t)&&e.unshift(t);for(const t of this.selection.targets??[])qy(t)&&!e.includes(t)&&e.push(t);return e}get _key(){return this._targets.join(",")}_apply(e,t,i=!1){const n=i?this._dragBase??=this.doc:this._dragBase??this.doc;if(!n)return;const s=this._geom?fv(this._geom):void 0,a=(0,jy.ar)(n,this._targets,e.id,t,{pieces:s});if(i||(this._dragBase=void 0),a===n)return void(i||(this._status=Zn(1016)));const r=new Map(this._applied);r.set(this._key,{preset:e.id,params:t}),this._applied=r;const o=this._targets.map(e=>Vv(n,e));this._status=i?"":Zn(1254,{preset:(0,N.t)(e.name),targets:o.length>2?Zn(1198,{count:o.length}):Yn(o)}),Kv(this,a,`Preset: ${e.id}`,i)}_pickPreset(e,t){const i=jy.tP.find(t=>t.id===e.value);i&&(this._apply(i,t?.preset===i.id?t.params:{}),this._applied.get(this._key)?.preset!==i.id&&(e.value=t?.preset??""))}_clear(){if(!this.doc)return;const e=this._targets.reduce((e,t)=>(0,jy.di)(e,t),this.doc),t=new Map(this._applied);t.delete(this._key),this._applied=t,this._status=Zn(477),Kv(this,e,"Remove motion")}_openSvg(){this.renderRoot.querySelector("mc-anim-svg-dialog")?.openExport(!0)}_renderParams(e,t){const i=(0,jy.Cq)(e.id,t);return n.qy`<div class="params" role="group" aria-label=${Zn(1241,{name:(0,N.t)(e.name)})}>
      ${e.params.map(t=>{const s=i[t.id];if("direction"===t.id)return n.qy`<div class="field">
            <div class="field-head"><span class="lbl" id="pp-dir">${Zn(254)}</span></div>
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
                  <ha-icon icon=${t>0?"mdi:rotate-right":"mdi:rotate-left"}></ha-icon>${Zn(t>0?358:764)}
                </button>`)}
            </div>
          </div>`;const a=`pp-${t.id}`;return n.qy`<div class="field">
          <div class="field-head"><label for=${a}>${(0,N.t)(t.label)}</label><span class="val">${Ey(t,s)}</span></div>
          <input
            id=${a}
            class="range"
            type="range"
            data-param=${t.id}
            min=${t.min}
            max=${t.max}
            step=${t.step}
            .value=${String(s)}
            aria-valuetext=${Ey(t,s)}
            ?disabled=${this.disabled}
            @input=${n=>this._apply(e,{...i,[t.id]:Number(n.target.value)},!0)}
            @change=${n=>this._apply(e,{...i,[t.id]:Number(n.target.value)})}
          />
        </div>`})}
    </div>`}updated(){const e=this.renderRoot.querySelector("select#pp-preset"),t=this._applied.get(this._key)?.preset??"";e&&e.value!==t&&(e.value=t)}render(){const e=this.doc,t=this._targets;if(!e||!t.length)return n.qy``;const i=this._applied.get(this._key),s=i?jy.tP.find(e=>e.id===i.preset):void 0,a=t.some(t=>(yv(e,t)?.keyframes.length??0)>0),r=this._geom?fv(this._geom):[];return n.qy`
      <p class="help">${t.length>1?Zn(1201,{count:t.length}):Zn(620)}</p>
      <div class="field">
        <div class="field-head"><label for="pp-preset">${Zn(707)}</label></div>
        <div class="select">
          <select
            class="input"
            id="pp-preset"
            aria-describedby=${s?.help?"pp-preset-help":n.s6}
            ?disabled=${this.disabled}
            @change=${e=>this._pickPreset(e.target,i)}
          >
            <option value="" ?selected=${!s} ?disabled=${!!s} ?hidden=${!!s}>${Zn(156)}</option>
            ${jy.tP.map(e=>n.qy`<option value=${e.id} data-preset=${e.id} ?selected=${s?.id===e.id}>${(0,N.t)(e.name)}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
        ${s?.help?n.qy`<p class="help" id="pp-preset-help">${(0,N.t)(s.help)}</p>`:n.s6}
      </div>
      ${s?this._renderParams(s,i.params):n.s6}
      <div class="actions">
        ${a?n.qy`<button type="button" class="btn btn-text btn-sm clear" ?disabled=${this.disabled} @click=${()=>this._clear()}>${Zn(737)}</button>`:n.s6}
        <span class="grow"></span>
        <button type="button" class="btn btn-secondary btn-sm export" @click=${()=>this._openSvg()}>
          <ha-icon icon="mdi:motion-play-outline"></ha-icon>${Zn(63)}
        </button>
      </div>
      <p class="status" role="status" aria-live="polite">${this._status}</p>
      <mc-anim-svg-dialog .doc=${e} .pieces=${r} .viewBox=${this._geom?.viewBox??"0 0 24 24"}></mc-anim-svg-dialog>
    `}};function Py(e){const t=(e.includes(":")?e.slice(e.indexOf(":")+1):e).split(/[-_\s]+/).filter(Boolean).join(" ");return t?t.charAt(0).toUpperCase()+t.slice(1):""}Ly.styles=[ms,gs,n.AH`
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
    `],zy([(0,s.MZ)({attribute:!1})],Ly.prototype,"doc",void 0),zy([(0,s.MZ)({attribute:!1})],Ly.prototype,"hass",void 0),zy([(0,s.MZ)({attribute:!1})],Ly.prototype,"library",void 0),zy([(0,s.MZ)({type:Number})],Ly.prototype,"time",void 0),zy([(0,s.MZ)({type:Boolean})],Ly.prototype,"disabled",void 0),zy([(0,s.MZ)({attribute:!1})],Ly.prototype,"selection",void 0),zy([(0,s.MZ)({attribute:!1})],Ly.prototype,"tile",void 0),zy([(0,s.MZ)({attribute:!1})],Ly.prototype,"stage",void 0),zy([(0,s.wk)()],Ly.prototype,"_applied",void 0),zy([(0,s.wk)()],Ly.prototype,"_geom",void 0),zy([(0,s.wk)()],Ly.prototype,"_status",void 0),Ly=zy([(0,s.EM)("mc-anim-part-presets")],Ly),$s({tag:"mc-anim-part-presets",place:"inspector",title:645,order:15,when:(e,t)=>"keyframes"===e.kind&&("target"===t.kind||"keys"===t.kind)&&qy(t.target)}),new Map;var Hy=i(1474);let Vy,Dy;function Ty(){return Vy??=i.e(334).then(()=>i(1935)).then(e=>(0,dp.t)("magic-card-icon-library.js",e)??Promise.reject(new Error("the icon library is from another release"))).then(async e=>await e.iconNamesReady()?e:Promise.reject(new Error("the icon names could not be loaded"))).then(e=>Dy=e,e=>{throw Vy=void 0,console.warn("Magic Card: icon library not loaded",e),e}),Vy}var Oy=function(e,t,i,n){var s,a=arguments.length,r=a<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var o=e.length-1;o>=0;o--)(s=e[o])&&(r=(a<3?s(r):a>3?s(t,i,r):s(t,i))||r);return a>3&&r&&Object.defineProperty(t,i,r),r};let Ry=class extends n.WF{constructor(){super(...arguments),this._visible="undefined"==typeof IntersectionObserver}connectedCallback(){super.connectedCallback(),"undefined"!=typeof IntersectionObserver&&(this._io=new IntersectionObserver(e=>{const t=e.some(e=>e.isIntersecting);t!==this._visible&&(this._visible=t)}),this._io.observe(this)),customElements.get("magic-card")||customElements.whenDefined("magic-card").then(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._io?.disconnect(),this._io=void 0}willUpdate(e){if(e.has("entry")&&(this._card=void 0),this._card)return void(e.has("hass")&&this.hass&&(this._card.hass=this.hass));const t=this.entry;if(!this._visible||!t||!customElements.get("magic-card"))return;const i=t.build(),n=document.createElement("magic-card");try{n.setConfig({type:"custom:magic-card",custom_animations:[i],rows:[{id:"r",columns:[{id:"c",vertical_align:"center",modules:[{id:"m",type:"icon",icon:t.icon,size:"40px",design:{text_align:"center",animations:[{id:"a",preset:`custom:${i.id}`}]}}]}]}]})}catch{return}n.hass=this.hass??Gd(!1),this._card=n}render(){const e=this._visible?this._card:void 0;return n.qy`<div class="box" aria-hidden="true">${e??n.qy`<ha-icon icon=${this.entry?.icon??""}></ha-icon>`}</div>`}};Ry.styles=[ms,n.AH`
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
    `],Oy([(0,s.MZ)({attribute:!1})],Ry.prototype,"entry",void 0),Oy([(0,s.MZ)({attribute:!1})],Ry.prototype,"hass",void 0),Oy([(0,s.wk)()],Ry.prototype,"_visible",void 0),Ry=Oy([(0,s.EM)("mc-anim-icon-thumb")],Ry);const Ny={alarm_control_panel:43,binary_sensor:99,button:126,calendar:127,camera:128,climate:170,cover:208,device_tracker:253,event:324,fan:336,humidifier:390,lawn_mower:425,light:439,lock:450,media_player:463,person:673,plant:684,sensor:815,siren:848,sun:934,switch:937,timer:1032,vacuum:1089,valve:1097,weather:1100,zone:1111},Fy=(e,t)=>t?.localize?.(`component.${e}.title`)||(void 0!==Ny[e]?Zn(Ny[e]):null)||e.replace(/_/g," ").replace(/^./,e=>e.toUpperCase());let By=class extends n.WF{constructor(){super(...arguments),this.lookup=()=>{},this._icon="mdi:bell-ring",this._query="",this._domain="",this._busy=!1,this._error="",this._lib=Dy,this._libFailed=!1}connectedCallback(){super.connectedCallback(),this._lib||this._loadLibrary(),ws("mc-icon-picker")||"undefined"==typeof customElements||customElements.whenDefined("mc-icon-picker").then(()=>this.requestUpdate())}async _loadLibrary(){this._libFailed=!1;try{this._lib=await Ty()}catch{this._libFailed=!0}}_emit(e,t){this.dispatchEvent(new CustomEvent("icon-start",{detail:{doc:e,from:t},bubbles:!0,composed:!0}))}async start(){const e=this._icon.trim();if(ot.test(e)){this._busy=!0,this._error="";try{const t=this._lib??await Ty().catch(()=>{}),i=t?.mdiGeometry(e)??await sv(e);if(!i)return void(this._error=Zn(1019));const n=Zn(1227,{name:Py(e)}),s=(0,Hy.a)(e,i,e.slice(e.indexOf(":")+1),n,{embed:!0});if(!s.rig?.parts.length)return void(this._error=Zn(1020));this._emit(s,"icon")}finally{this._busy=!1}}else this._error=Zn(676)}focusStart(){const e=this.renderRoot.querySelector("mc-icon-picker, .icon-input");(e?.shadowRoot?.querySelector("input")??e)?.focus({preventScroll:!0})}_renderPick(){const e=ws("mc-icon-picker");return n.qy`<section class="pick" aria-labelledby="is-pick">
      <h3 id="is-pick">${Zn(901)}</h3>
      <p class="help">${Zn(975)}</p>
      <div class="pick-row">
        <div class="field grow">
          ${e?n.qy`<mc-icon-picker
                .hass=${this.hass}
                .value=${this._icon}
                label=${Zn(391)}
                @value-changed=${e=>{e.stopPropagation(),this._icon=String(e.detail?.value??"").trim(),this._error=""}}
              ></mc-icon-picker>`:n.qy`<input
                class="input mono icon-input"
                aria-label=${Zn(391)}
                spellcheck="false"
                .value=${P(this._icon)}
                @input=${e=>{this._icon=e.target.value,this._error=""}}
                @keydown=${e=>"Enter"===e.key&&void this.start()}
              />`}
        </div>
        <button type="button" class="btn btn-primary btn-sm start" ?disabled=${this._busy} @click=${()=>{this.start()}}>
          <ha-icon icon="mdi:scissors-cutting"></ha-icon>${this._busy?Zn(887):Zn(879)}
        </button>
      </div>
      ${this._error?n.qy`<p class="help error" role="alert">${this._error}</p>`:n.s6}
    </section>`}_renderLibrary(){const e=this._lib,t=n.qy`<div class="lib-head">
      <h3 id="is-lib">${Zn(632)}</h3>
      ${e?n.qy`<span class="chip is-count">${e.ICON_LIBRARY.length}</span>`:n.s6}
    </div>`;if(!e)return n.qy`<section class="lib" aria-labelledby="is-lib">
        ${t}
        ${this._libFailed?n.qy`<p class="help error lib-error" role="alert">${Zn(976)}</p>
              <div><button type="button" class="btn btn-secondary btn-sm lib-retry" @click=${()=>{this._loadLibrary()}}><ha-icon icon="mdi:refresh"></ha-icon>${Zn(1046)}</button></div>`:n.qy`<p class="help lib-loading" role="status">${Zn(447)}</p>`}
      </section>`;const i=e.searchLibrary(this._query,this._domain||void 0);return n.qy`<section class="lib" aria-labelledby="is-lib">
      ${t}
      <div class="filters">
        <div class="with-icon grow">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            class="input lib-search"
            type="search"
            placeholder=${Zn(797)}
            aria-label=${Zn(799)}
            .value=${P(this._query)}
            @input=${e=>this._query=e.target.value}
          />
        </div>
        <select class="input domain" aria-label=${Zn(256)} .value=${P(this._domain)} @change=${e=>this._domain=e.target.value}>
          <option value="">${Zn(45)}</option>
          ${[...e.LIBRARY_DOMAINS].sort((e,t)=>Fy(e,this.hass).localeCompare(Fy(t,this.hass))).map(e=>n.qy`<option value=${e} ?selected=${e===this._domain}>${Fy(e,this.hass)}</option>`)}
        </select>
      </div>
      ${i.length?n.qy`<ul class="grid" role="list">
            ${i.map(e=>n.qy`<li>
                <button type="button" class="entry" data-id=${e.id} title="${e.name} (${e.icon})" @click=${()=>this._emit(e.build(),"library")}>
                  <mc-anim-icon-thumb .entry=${e} .hass=${this.hass}></mc-anim-icon-thumb>
                  <span class="nm">${e.name}</span>
                  <span class="dm">${Fy(e.domain,this.hass)}</span>
                </button>
              </li>`)}
          </ul>`:n.qy`<p class="help no-results">${Zn(577,{query:this._query})}</p>`}
    </section>`}render(){return n.qy`${this._renderPick()} ${this._renderLibrary()}`}};By.styles=[ms,gs,n.AH`
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
    `],Oy([(0,s.MZ)({attribute:!1})],By.prototype,"hass",void 0),Oy([(0,s.MZ)({attribute:!1})],By.prototype,"lookup",void 0),Oy([(0,s.wk)()],By.prototype,"_icon",void 0),Oy([(0,s.wk)()],By.prototype,"_query",void 0),Oy([(0,s.wk)()],By.prototype,"_domain",void 0),Oy([(0,s.wk)()],By.prototype,"_busy",void 0),Oy([(0,s.wk)()],By.prototype,"_error",void 0),Oy([(0,s.wk)()],By.prototype,"_lib",void 0),Oy([(0,s.wk)()],By.prototype,"_libFailed",void 0),By=Oy([(0,s.EM)("mc-anim-icon-start")],By),function(e){lm=e}(ld),function(e,t){Ie.particles=e,Ie.checkSim=t,Ie.epoch++}(cd,ld.validateSim);const Iy=[["magic-card-animation-studio",Bp],["mcas-stage",Yd],["mcas-thumb",Zp],["mc-preset-grid",cp],["mc-preset-thumb",lp]];for(const[e,t]of Iy)customElements.get(e)||customElements.define(e,t)})();