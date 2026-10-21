"use strict";export const __webpack_esm_ids__=[199];export const __webpack_esm_modules__={8668(t,e,a){a.d(e,{G3:()=>o,XB:()=>l,fI:()=>f,zu:()=>h});var i=a(9639),s=a(1771);function r(t,e){if(!t)return 0;const a=/^[a-z-]+\(/i.test(t.trim())?function(t,e){const a=t.match(/-?\d*\.?\d+(?:e[+-]?\d+)?(?:px|%)?|[a-z-]+\(|[()+\-*/,]/gi)??[];if(a.join("").replace(/\s+/g,"")!==t.replace(/\s+/g,""))return NaN;let i=0;const s=()=>a[i],r=()=>a[i++],n=()=>{const t=r();if(void 0===t)return NaN;if("("===t){const t=c();return")"===r()?t:NaN}if("-"===t)return-n();const a=/^([a-z-]+)\($/i.exec(t)?.[1].toLowerCase();if(a){const t=(()=>{const t=[c()];for(;","===s();)r(),t.push(c());return")"!==r()?[NaN]:t})();return"calc"===a&&1===t.length?t[0]:"min"===a?Math.min(...t):"max"===a?Math.max(...t):"clamp"===a&&3===t.length?Math.max(t[0],Math.min(t[1],t[2])):NaN}const i=parseFloat(t);return t.endsWith("%")?i/100*e:i},o=()=>{let t=n();for(;"*"===s()||"/"===s();)t="*"===r()?t*n():t/n();return t},c=()=>{let t=o();for(;;){const e=s();if("+"===e||"-"===e)r(),t="+"===e?t+o():t-o();else{if(void 0===e||!/^-\d|^-\./.test(e))return t;t+=o()}}},l=c();return i===a.length?l:NaN}(t.trim(),e):t.trim().endsWith("%")?parseFloat(t)/100*e:parseFloat(t);return Number.isFinite(a)&&a>0?a:0}function n(t,e,a){const[i,s=i]=function(t){const e=[];let a=0,i="";for(const s of t.trim())"("===s&&a++,")"===s&&a--,/\s/.test(s)&&0===a?(i&&e.push(i),i=""):i+=s;return i&&e.push(i),e}(t||"");return{x:r(i,e),y:r(s,a)}}function o(t,e,a){return{tl:n(t.borderTopLeftRadius,e,a),tr:n(t.borderTopRightRadius,e,a),br:n(t.borderBottomRightRadius,e,a),bl:n(t.borderBottomLeftRadius,e,a)}}const c=(t,e)=>({x:t.x*e,y:t.y*e});function l(t,e,a){const i=(t,e)=>e>t?t/e:1,s=Math.min(i(e,t.tl.x+t.tr.x),i(a,t.tr.y+t.br.y),i(e,t.br.x+t.bl.x),i(a,t.tl.y+t.bl.y));return s>=1?t:{tl:c(t.tl,s),tr:c(t.tr,s),br:c(t.br,s),bl:c(t.bl,s)}}function h(t,e){const a=t=>e>=0?{x:Math.max(0,t.x-e),y:Math.max(0,t.y-e)}:{x:t.x>0?t.x-e:0,y:t.y>0?t.y-e:0};return{tl:a(t.tl),tr:a(t.tr),br:a(t.br),bl:a(t.bl)}}const d=["top","top-right","right","bottom-right","bottom","bottom-left","left","top-left"];function f(t,e,a,r,n={}){const o=n.inset??0;let c;if(o>=0){const n=(0,i.q8)(t,e,a,r,o);c=n?(0,s.aM)(n):void 0}else{const n=e-2*o>0&&a-2*o>0?(0,i.j9)(t,e-2*o,a-2*o,r):void 0,l=n&&(0,s.aM)(n.d);c=l&&(0,s.Tl)(l,o,o)}if(!c)return"";const l=Math.max(0,d.indexOf(n.start??"top"))*Math.PI/4;let h=(0,s.dm)(c,[e*(1+Math.round(Math.sin(l)))/2,a*(1-Math.round(Math.cos(l)))/2]);return"ccw"===n.direction&&(h=(0,s.BE)(h)),(0,s.uD)([h])}a.d(e,["$H",0,d])},394(t,e,a){a.d(e,["Z",0,{winter:496,spring:418,summer:434,autumn:38,christmas:95,new_year:288,valentine:477,easter:164,halloween:219,snow:403,rain:343,storm:457,sun:436,clouds:102,fog:195,wind:495,night:289,dusk:158}])},8016(t,e,a){a.d(e,{J4:()=>s,p5:()=>r});const i={snowy:"snow","snowy-rainy":"snow",rainy:"rain",pouring:"rain",hail:"rain",lightning:"storm","lightning-rainy":"storm",sunny:"sun","clear-night":"night",cloudy:"clouds",partlycloudy:"clouds",fog:"fog",windy:"wind","windy-variant":"wind"};function s(t){return t?i[t]:void 0}function r(t,e){if("below_horizon"===t||"above_horizon"===t)return"number"==typeof e&&Number.isFinite(e)&&Math.abs(e)<=6?"dusk":"below_horizon"===t?"night":void 0}},5816(t,e,a){a.d(e,{GR:()=>y,Oo:()=>k,RC:()=>h,Z:()=>w,a0:()=>J,aD:()=>z,ot:()=>g,rG:()=>C,s$:()=>v,ws:()=>$});var i=a(2016),s=a(8016);const r=["winter","spring","summer","autumn","christmas","new_year","valentine","easter","halloween","weather","daynight"],n={christmas:"12-01..12-26",new_year:"12-31..01-01",valentine:"02-14..02-14",easter:"auto",halloween:"10-24..10-31"},o=["new_year","christmas","valentine","easter","halloween"],c=[31,29,31,30,31,30,31,31,30,31,30,31];function l(t){const e=/^(\d\d)-(\d\d)$/.exec(t.trim());if(!e)return;const a=Number(e[1]),i=Number(e[2]);return a<1||a>12||i<1||i>c[a-1]?void 0:{month:a,day:i}}function h(t){if("string"!=typeof t)return;const e=t.split("..");if(e.length>2)return;const a=l(e[0]),i=2===e.length?l(e[1]):a;return a&&i?{start:a,end:i}:void 0}const d=t=>100*t.month+t.day;function f(t,e){const a=d({month:t.getMonth()+1,day:t.getDate()}),i=d(e.start),s=d(e.end);return i<=s?a>=i&&a<=s:a>=i||a<=s}function p(t){const e=function(t){const e=t%19,a=Math.floor(t/100),i=t%100,s=Math.floor(a/4),r=a%4,n=Math.floor((a+8)/25),o=(19*e+a-s-Math.floor((a-n+1)/3)+15)%30,c=(32+2*r+2*Math.floor(i/4)-o-i%4)%7,l=Math.floor((e+11*o+22*c)/451),h=Math.floor((o+c-7*l+114)/31);return new Date(t,h-1,(o+c-7*l+114)%31+1)}(t),a=t=>{const a=new Date(e.getFullYear(),e.getMonth(),e.getDate()+t);return{month:a.getMonth()+1,day:a.getDate()}};return{start:a(-7),end:a(1)}}const m=["winter","winter","spring","spring","spring","summer","summer","summer","autumn","autumn","autumn","winter"],u={winter:"summer",summer:"winter",spring:"autumn",autumn:"spring"};function g(t){return"string"==typeof t&&"south"===t.trim().toLowerCase()?"south":"north"}function y(t,e={}){return function(t,e){for(const a of o){const i=e?.[a];if(!1===i||"string"==typeof i&&"off"===i.trim().toLowerCase())continue;const s="string"==typeof i&&"auto"!==i.trim().toLowerCase()&&h(i)?i:n[a],r="auto"===s?"easter"===a?p(t.getFullYear()):void 0:h(s);if(r&&f(t,r))return a}}(t,e.calendar)??function(t,e="north"){const a=m[t.getMonth()];return"south"===e?u[a]:a}(t,g(e.hemisphere))}function b(t,e){try{const a=new Intl.DateTimeFormat("en-US",{timeZone:e,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}).formatToParts(t),i=t=>Number(a.find(e=>e.type===t)?.value),s={y:i("year"),mo:i("month"),d:i("day"),h:i("hour")%24,mi:i("minute"),s:i("second")};return Object.values(s).every(Number.isFinite)?s:void 0}catch{return}}function w(t,e){const a=(0,i.cj)(e),s=a?b(t,a):void 0;return s?new Date(s.y,s.mo-1,s.d,s.h,s.mi,s.s,t.getMilliseconds()):t}function v(t,e){const a=(0,i.cj)(e),s=a?b(t,a):void 0;if(!s)return new Date(t.getFullYear(),t.getMonth(),t.getDate()+1,0,0,0,0);const r=1e3*(60*(60*s.h+s.mi)+s.s)+t.getMilliseconds();return new Date(t.getTime()+864e5-r)}const x=new Set(r);function k(t){if(null!=t&&!1!==t)return!0===t?{}:"string"==typeof t?{scene:t}:"object"!=typeof t||Array.isArray(t)?void 0:t}function $(t){const e=t?.combine;return(Array.isArray(e)?e:"string"==typeof e?[e]:[]).filter(t=>"string"==typeof t&&""!==t.trim())}function M(t,e,a,i){const r=void 0===t?"auto":t;return"auto"===r?y(a,e):"string"==typeof r&&x.has(r)?"weather"===r?function(t,e){return t.weather_entity?(0,s.J4)(e?.states?.[t.weather_entity]?.state):void 0}(e,i):"daynight"===r?function(t){const e=t?.states?.["sun.sun"],a=e?.attributes?.elevation;return(0,s.p5)(e?.state,"number"==typeof a?a:"string"==typeof a&&""!==a.trim()?Number(a):void 0)}(i):r:void 0}function _(t){const e="string"==typeof t&&t.includes("%");let a="number"==typeof t?t:"string"==typeof t&&/^\s*-?\d*\.?\d+\s*%?\s*$/.test(t)?parseFloat(t):NaN;return Number.isFinite(a)?(!e&&a>0&&a<=1&&(a*=100),Math.round(Math.min(100,Math.max(0,a)))/100):.5}function C(t,e,a,i={}){const s=k(t);if(i.localDay||(e=w(e,a)),!s)return;if(s.entity&&"off"===a?.states?.[s.entity]?.state)return;const r=[],n=t=>{t&&!r.includes(t)&&r.push(t)};n(M(s.scene,s,e,a));for(const t of $(s))n(M(t,s,e,a));return r.length?{scenes:r,layer:"front"===s.layer?"front":"back",intensity:_(s.intensity),decorations:!1!==s.decorations}:void 0}function z(t){const e=k(t);if(!e)return[];const a=J(e),i=[];return e.entity&&i.push(e.entity),e.weather_entity&&a.includes("weather")&&i.push(e.weather_entity),a.includes("daynight")&&i.push("sun.sun"),i}function J(t){return[t.scene??"auto",...$(t)]}a.d(e,["MX",0,r,"jF",0,n])},3632(t,e,a){a.r(e),a.d(e,{BUILD:()=>Mt,api:()=>_t,install:()=>Ct});var i=a(5816),s=a(394);const r={sun:3,dusk:2,flash:5,moon:2},n=["snow"],o=["#e8590c","#f08c00","#d9480f","#c92a2a","#b35a1f","#e0a526","#a8761b"],c=["#ffc9de","#fcc2d7","#f9a8c9","#ffdeeb","#f7a1c4"],l=["#ffd43b","#fcc419","#ffe066"],h=["#fff9db","#e7f5ff","#ffec99","#ffffff"],d=["#5c9ce6","#74a9e6","#4a8bd6"],f=t=>({kind:"snowdot",motion:"fall",weight:t,dur:[9,17],size:[4,8],opacity:[.55,1],palette:n,drift:26}),p=(t,e)=>({kind:"flake",motion:"fall",weight:t,max:e,dur:[11,19],size:[12,22],opacity:[.7,1],palette:n,variants:3,drift:34}),m=t=>({kind:"petal",motion:"tumble",weight:t,dur:[9,15],size:[13,19],opacity:[.8,1],palette:c,drift:60}),u=(t,e="rain")=>({kind:"raindrop",motion:e,weight:t,dur:"rain"===e?[.6,1]:[7,11],size:[18,30],opacity:"rain"===e?[.45,.85]:[.35,.6],palette:d}),g={winter:{id:"winter",label:s.Z.winter,particles:[f(6),p(3,8)],decorations:["frost","icicles"]},spring:{id:"spring",label:s.Z.spring,particles:[m(5),{kind:"blossom",motion:"tumble",weight:1.6,max:4,dur:[11,16],size:[17,24],opacity:[.85,1],palette:c,drift:50}],decorations:["vine"]},summer:{id:"summer",label:s.Z.summer,ambient:["sun"],particles:[{kind:"butterfly",motion:"flutter",weight:1,max:4,dur:[9,15],size:[28,38],palette:[["#f59f00","#ffd43b"],["#339af0","#a5d8ff"],["#fab005","#fff3bf"],["#e64980","#ffdeeb"],["#7950f2","#d0bfff"]],band:[18,78]},{kind:"mote",motion:"flutter",weight:1.4,max:7,dur:[7,12],size:[3,6],opacity:[.5,.9],palette:l,band:[10,90]}]},autumn:{id:"autumn",label:s.Z.autumn,particles:[{kind:"leaf",motion:"tumble",weight:6,dur:[8,14],size:[20,32],opacity:[.85,1],palette:o,variants:3,drift:70},u(1.4,"drizzle")]},christmas:{id:"christmas",label:s.Z.christmas,particles:[f(4),p(1.4,4),{kind:"star",motion:"twinkle",weight:2.4,max:6,dur:[2.2,3.8],size:[13,21],opacity:[.8,1],palette:l,band:[6,62],variants:1}],decorations:["lights"]},new_year:{id:"new_year",label:s.Z.new_year,particles:[{kind:"firework",motion:"burst",weight:2.4,max:5,dur:[2.6,4],size:[64,100],opacity:[.8,.95],palette:[["#ff6b6b","#ffe066"],["#4dabf7","#d0ebff"],["#ffd43b","#fff9db"],["#da77f2","#ffdeeb"],["#51cf66","#ebfbee"],["#ff922b","#fff4e6"]],band:[14,52]},{kind:"confetti",motion:"tumble",weight:5,dur:[5,8],size:[8,13],palette:["#ff6b6b","#ffd43b","#4dabf7","#69db7c","#da77f2","#ff922b","#f783ac","#e9c46a"],variants:3,drift:40}]},valentine:{id:"valentine",label:s.Z.valentine,particles:[{kind:"heart",motion:"rise",weight:1,dur:[8,13],size:[12,24],opacity:[.6,.95],palette:["#e03131","#f03e3e","#e64980","#f06595","#ff6b81","#c2255c"],variants:2,drift:30}]},easter:{id:"easter",label:s.Z.easter,particles:[m(3),{kind:"egg",motion:"bob",weight:1.6,max:6,dur:[2.4,3.6],size:[22,30],palette:[["#ffd8a8","#f76707"],["#b2f2bb","#2b8a3e"],["#a5d8ff","#1864ab"],["#fcc2d7","#c2255c"],["#d0bfff","#5f3dc4"],["#ffec99","#e67700"]],band:[80,92],variants:3}]},halloween:{id:"halloween",label:s.Z.halloween,particles:[{kind:"bat",motion:"fly",weight:1,max:7,dur:[7,12],size:[24,36],opacity:[.8,1],palette:["bat"],band:[8,55]},{kind:"fogband",motion:"drift",weight:.5,max:3,dur:[16,26],size:[260,380],opacity:[.55,.85],palette:["ghost-violet","mist","ghost-green"],band:[70,100]}],decorations:["cobweb","pumpkin"]},snow:{id:"snow",label:s.Z.snow,particles:[f(7),p(3,8)]},rain:{id:"rain",label:s.Z.rain,particles:[u(1)]},storm:{id:"storm",label:s.Z.storm,ambient:["flash"],particles:[u(1)]},sun:{id:"sun",label:s.Z.sun,ambient:["sun"],particles:[{kind:"mote",motion:"flutter",weight:1,max:8,dur:[7,12],size:[3,6],opacity:[.5,.9],palette:l,band:[10,90]}]},clouds:{id:"clouds",label:s.Z.clouds,particles:[{kind:"cloud",motion:"across",weight:1,max:5,dur:[50,90],size:[64,120],opacity:[.55,.95],palette:["cloud"],band:[6,46]}]},fog:{id:"fog",label:s.Z.fog,particles:[{kind:"fogband",motion:"drift",weight:1,max:4,dur:[16,28],size:[280,420],opacity:[.4,.75],palette:["mist"],band:[25,100]}]},wind:{id:"wind",label:s.Z.wind,particles:[{kind:"windline",motion:"gust",weight:2,max:6,dur:[2.4,5],size:[90,160],opacity:[.55,.95],palette:["wind"],band:[12,88],variants:2},{kind:"leaf",motion:"blow",weight:1,max:4,dur:[4,6.5],size:[16,22],palette:o,band:[20,80],variants:3}]},night:{id:"night",label:s.Z.night,ambient:["moon"],particles:[{kind:"sparkle",motion:"twinkle",weight:3,max:10,dur:[2.4,4.6],size:[7,14],opacity:[.6,1],palette:h,band:[4,58]},{kind:"firefly",motion:"firefly",weight:2,max:6,dur:[9,15],size:[10,15],palette:["#d8f5a2","#ffec99","#c0eb75"],band:[45,92]}]},dusk:{id:"dusk",label:s.Z.dusk,ambient:["dusk"],particles:[{kind:"sparkle",motion:"twinkle",weight:1,max:3,dur:[3,5],size:[6,10],opacity:[.45,.8],palette:h,band:[4,30]}]}};function y(t){return"string"==typeof t&&Object.prototype.hasOwnProperty.call(g,t)}function b(t){const e=[];for(const a of t)for(const t of y(a)&&g[a].decorations||[])e.includes(t)||e.push(t);return e}function w(t){let e=function(t){let e=2166136261;for(let a=0;a<t.length;a++)e^=t.charCodeAt(a),e=Math.imul(e,16777619);return e>>>0}(t);return()=>{e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function v(t,e=0){const a=Number.isFinite(t)?Math.min(1,Math.max(0,t)):.5;return Math.max(0,Math.min(24-e,Math.round(24*a)))}function x(t){return t.some(t=>y(t)&&!!g[t].ambient?.includes("flash"))}function k(t,e){const a=new Set;for(const e of t)if(y(e))for(const t of g[e].ambient??[])a.add(t);let i=0;for(const t of a)i+=r[t];return v(e,i)}var $=a(187);let M;function _(){return M}const C=t=>t?JSON.stringify(t):"";function z(t){const e=t.rows?.[0],a=[t.name??"",e?.id??"",e?.columns?.[0]?.modules?.[0]?.id??""].join("|"),i=function(t){const e=[],a=new Set,i=(t,s)=>{if(!(!t||"object"!=typeof t||a.has(t)||s>12))if(a.add(t),Array.isArray(t))for(const e of t)i(e,s+1);else for(const[a,r]of Object.entries(t))"string"!=typeof r||"entity"!==a&&"entity_id"!==a&&!a.endsWith("_entity")||!/^\w+\.\w+/.test(r)||e.includes(r)?i(r,s+1):e.push(r)};return i(t,0),e}(t);return[a,i.length?Math.floor(4294967296*w(i.join(","))()).toString(36):""].filter(t=>t&&"||"!==t).join("|")||"card"}var J=a(6161);const W=t=>Math.round(100*t)/100,Z=(t,e,a)=>t+(e-t)*a;function L(t,e,a="mc"){const i=t.filter(y).filter((t,e,a)=>a.indexOf(t)===e).map(t=>g[t]),s=[];for(const t of i)for(const e of t.ambient??[])s.some(t=>t.kind===e)||s.push({key:`a-${e}`,kind:e});const n=i.flatMap(t=>{const e=t.particles.reduce((t,e)=>t+e.weight,0)||1;return t.particles.map((a,s)=>({scene:t.id,spec:a,index:s,share:a.weight/e/i.length}))}),o=function(t,e){const a=t.map(()=>0);let i=e;for(let e=0;e<4&&i>0;e++){const e=t.map((t,e)=>({e:t,i:e})).filter(({e:t,i:e})=>a[e]<(t.spec.max??1/0)),s=e.reduce((t,{e})=>t+e.share,0);if(!s)break;const r=e.map(({e:t,i:e})=>({i:e,want:i*t.share/s,room:(t.spec.max??1/0)-a[e]}));let n=0;for(const t of r){const e=Math.min(Math.floor(t.want),t.room);a[t.i]+=e,n+=e}const o=r.filter(e=>a[e.i]<(t[e.i].spec.max??1/0)).sort((t,e)=>e.want-Math.floor(e.want)-(t.want-Math.floor(t.want))||t.i-e.i);for(const t of o){if(n>=i)break;a[t.i]++,n++}i-=n}return a}(n,v(e,s.reduce((t,e)=>t+r[e.kind],0))),c=[];return n.forEach(({scene:t,spec:e,index:i},s)=>{const r=o[s],n=w(`${a}|${t}|${i}`)();for(let s=0;s<r;s++){const o=w(`${a}|${t}|${e.kind}|${i}|${s}`),l=o(),h=e.band??[4,96],d=e.palette[(s+Math.floor(n*e.palette.length))%e.palette.length],[f,p]="string"==typeof d?[d,void 0]:d,m="burst"===e.motion||"gust"===e.motion,u=m?Z(e.dur[0],e.dur[1],.5):Z(e.dur[1],e.dur[0],l),g=m?(s+.5+.3*(o()-.5))/r:0,[y,b]=e.opacity??[1,1];c.push({key:`${t}-${i}-${s}`,scene:t,kind:e.kind,motion:e.motion,variant:s%(e.variants??1),x:W(((s+.15+.7*o())/r+n)%1*100*.94+3),y:W(Z(h[0],h[1],o())),size:W(Z(e.size[0],e.size[1],l)),dur:W(u),delay:W(-(m?g:o())*u),color:f,accent:p,opacity:W(Z(y,b,l)),drift:W((2*o()-1)*(e.drift??20)),rotate:Math.round(360*o()),flip:o()<.5})}}),{particles:c,ambient:s}}var j=a(3852),N=a(6383);const S=(t,e,a)=>`@keyframes ${t} {${N.X[e].replace(/\$i/g,String(a))}}`,q=t=>`\n  ${t}.p, ${t}.p *, ${t}.a { animation: none !important; }\n  ${t}.p { top: var(--y) !important; left: var(--x) !important; translate: none !important; }\n  ${t}.m-fall > *, ${t}.m-tumble > *, ${t}.m-blow > * { rotate: var(--r); }\n  ${t}.a-shimmer, ${t}.a-flash, ${t}.a-bolt { display: none; }\n  ${t}.m-burst { opacity: calc(var(--o) * 0.7); }\n`,B=J.AH`
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
  ${(0,J.iz)(S("mc-sn-gust","wind-lines",0))}

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
  ${(0,J.iz)(S("mc-sn-lightning","lightning",60))}
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
  ${(0,J.iz)(q(":host([static]) "))}
  @media (prefers-reduced-motion: reduce) {
    ${(0,J.iz)(q(""))}
  }
`,P=t=>Array.from({length:t},(t,e)=>e),A=t=>String(Math.round(100*t)/100),D=["M0 0V-10.6M0-7.2l-3-2.8M0-7.2l3-2.8M0-3.9l-2.1-1.9M0-3.9l2.1-1.9","M0-2.6V-10M0-6.4l-2.5-1.6M0-6.4l2.5-1.6M0-9.6l1.2 1.4L0-7.6l-1.2-.9z","M0 0V-10.4M0-7.6l-2-2M0-7.6l2-2"],F=P(6).map(t=>{const e=(60*t+30)*Math.PI/180;return`M0 0L${A(4.6*Math.sin(e))} ${A(4.6*-Math.cos(e))}`}).join(""),E=[[13.3,5.2],[15.7,3.9],[15.1,8.5],[17.7,6.2],[18.4,7.9],[21.6,7.2],[20.5,10.4],[22.2,11.3],[17.8,14.9],[18.6,17],[13.5,16],[12.5,17.6]],I=`M12 1.4L${E.map(([t,e])=>`${t} ${e}`).join("L")}L${[...E].reverse().map(([t,e])=>`${A(24-t)} ${e}`).join("L")}Z`,T=(()=>{const t=[[3.6,5.2],[5.6,8.6],[6.6,12.2],[5.2,15.6]];let e="M12 1.8",a="";t.forEach(([e,i],s)=>{const r=t[s+1],n=r?[12+.5*Math.min(e,r[0]),(i+r[1])/2+.2]:[13.2,18.8];a+=`Q${A(12+e+.9)} ${A(i-2)} ${A(12+e)} ${A(i)}Q${A(12+e+.3)} ${A(i+1.8)} ${A(n[0])} ${A(n[1])}`}),e+=a;let i="L10.8 18.8";for(let e=t.length-1;e>=0;e--){const[a,s]=t[e],r=t[e-1],n=r?[12-.5*Math.min(a,r[0]),(s+r[1])/2+.2]:[12,1.8];i+=`Q${A(12-a-.3)} ${A(s+1.8)} ${A(12-a)} ${A(s)}Q${A(12-a-.9)} ${A(s-2)} ${A(n[0])} ${A(n[1])}`}return`${e}${i}Z`})(),O=["M12 17V4M12 9.2L18.6 8.2M12 9.2L5.4 8.2M12 13.2l4.6 2M12 13.2l-4.6 2","M12 18.4V3.4M12 6.4l3.2 -.8M12 6.4l-3.2-.8M12 10l4.6-1.2M12 10l-4.6-1.2M12 13.6l4.4-.8M12 13.6l-4.4-.8","M12 19.4V3.2M12 7.2l3-1.9M12 7.2l-3-1.9M12 10.8l3.8-2.1M12 10.8l-3.8-2.1M12 14.4l3.2-1.8M12 14.4l-3.2-1.8"];function X(){return J.JW`<path d=${"M16 13C17 6.2 22.6 1.6 27.8 2.8 31.6 4.2 30 10.4 24.4 12.8 21.4 14.2 18.2 13.8 16 13Z"} class="wing"></path><path d=${"M16 14C19.6 13.9 24.6 15.4 25.2 19.4 25.6 23 21.6 24.6 19 22.1 17.4 20.6 16.3 17.2 16 14Z"} class="wing"></path>
    <path d=${"M16.6 12.6C18.4 8.4 22 5.4 25.4 5.6 24.6 8.8 21.2 11.6 16.6 12.6Z"} class="wing-in"></path><path d=${"M16.6 14.6C19.6 15 22.6 16.8 22.6 19.4 20.4 19.8 17.8 17.6 16.6 14.6Z"} class="wing-in"></path>
    <circle cx="27.2" cy="4.4" r=".75" class="dot"></circle><circle cx="28.6" cy="7" r=".6" class="dot"></circle>
    <circle cx="22.8" cy="21.6" r=".6" class="dot"></circle>`}const H="M20 9.4C22 6.8 25 5.2 28.2 4.6 31.2 4.1 34.6 4.6 38.4 6.8 36.4 7.5 35.2 8.9 35.1 10.8 33.6 9.9 31.9 10 30.8 11.3 29.8 10.3 28 10.3 27 11.7 26 10.9 24.2 11.1 23.2 12.3 22.4 11.3 21.2 10.8 20 11Z",G="M12 1.6C6.9 1.6 3.2 10.4 3.2 17.4 3.2 23.4 7.2 28.4 12 28.4 16.8 28.4 20.8 23.4 20.8 17.4 20.8 10.4 17.1 1.6 12 1.6Z",Q=`M1 16${P(9).map(t=>`L${A(3.4+2.6*t)} ${t%2?16:12.6}`).join("")}`;const R=(t,e)=>{const a=e*Math.PI/180;return`${A(Math.sin(a)*t)} ${A(-Math.cos(a)*t)}`},U=`M${P(10).map(t=>{const e=t%2?4.6:11,a=36*t*Math.PI/180;return`${A(Math.sin(a)*e)} ${A(-Math.cos(a)*e+.8)}`}).join("L")}Z`,Y=["M2 14C22 14 38 8.4 58 10.2S92 18 104 10C110 6 108.2 1.2 103.2 2.6 99.6 3.8 101 8.2 104.6 7.6","M2 12C18 12 34 15.6 54 13.6S86 8.8 100 11.6"];function V(t,e){switch(t){case"flake":return function(t){const e=D[t%D.length],a=P(6).map(t=>J.JW`<path d=${e} transform="rotate(${60*t})"></path>`),i=2===t?J.JW`<path d=${F}></path>`:1===t?J.JW`<path d="M0-2.6l2.25 1.3v2.6L0 2.6l-2.25-1.3v-2.6z"></path>`:J.s6;return J.JW`<svg viewBox="-12 -12 24 24" class="flake">
    <g class="edge">${a}${i}</g>
    <g class="core">${a}${i}</g>
    <circle r="1.3" class="hub"></circle>
  </svg>`}(e);case"leaf":return function(t){const e=t%3,a=0===e?I:1===e?T:"M12 1.8C17.6 5.8 18.2 12.8 12 19.8 5.8 12.8 6.4 5.8 12 1.8Z";return J.JW`<svg viewBox="0 0 24 24" class="leaf">
    <path d=${a} class="fill"></path>
    ${2===e?J.JW`<path d=${"M12 1.8C17.6 5.8 18.2 12.8 12 19.8Z"} class="shade"></path>`:J.s6}
    <path d=${O[e]} class="vein"></path>
    <path d="M12 17.4L12.5 22.6" class="stem"></path>
  </svg>`}(e);case"petal":return J.JW`<svg viewBox="0 0 24 24" class="petal">
    <path d=${"M12 22C6.6 18.2 5.4 11.2 7.9 5.6 8.9 3.6 10.3 3 11 3.6L12 5.7 13 3.6C13.7 3 15.1 3.6 16.1 5.6 18.6 11.2 17.4 18.2 12 22Z"} class="fill"></path>
    <path d=${"M12 19.6C8.9 16.8 8.2 11.6 9.6 7.4 10.6 8 11.4 8.6 12 9.6Z"} class="light"></path>
    <ellipse cx="12" cy="19.2" rx="1.6" ry="2.2" class="blush"></ellipse>
  </svg>`;case"blossom":return J.JW`<svg viewBox="-12 -12 24 24" class="blossom">
    ${P(5).map(t=>J.JW`<path d=${"M0-1.2C-3-3.2-4.2-7.4-2.6-10.2-1.9-11.2-1-11.4-.6-11L0-9.8.6-11C1-11.4 1.9-11.2 2.6-10.2 4.2-7.4 3-3.2 0-1.2Z"} transform="rotate(${72*t})" class="fill"></path>`)}
    ${P(5).map(t=>J.JW`<path d="M0 0L0-5.4" transform="rotate(${72*t+36})" class="stamen"></path>`)}
    ${P(5).map(t=>{const e=(72*t+36)*Math.PI/180;return J.JW`<circle cx=${A(5.6*Math.sin(e))} cy=${A(5.6*-Math.cos(e))} r=".85" class="pollen"></circle>`})}
    <circle r="2" class="heart"></circle>
  </svg>`;case"butterfly":return J.JW`<svg viewBox="0 0 32 26" class="butterfly">
    <g class="wings">${X()}<g transform="matrix(-1 0 0 1 32 0)">${X()}</g></g>
    <path d="M15.4 8.2C14.6 5 13.2 3.6 11.8 3.2M16.6 8.2C17.4 5 18.8 3.6 20.2 3.2" class="feeler"></path>
    <ellipse cx="16" cy="14.6" rx="1.05" ry="5.6" class="body"></ellipse>
    <circle cx="16" cy="8.4" r="1.3" class="body"></circle>
  </svg>`;case"bat":return J.JW`<svg viewBox="0 0 40 20" class="bat">
    <g class="wings"><path d=${H}></path><path d=${H} transform="matrix(-1 0 0 1 40 0)"></path></g>
    <path d="M18.3 8L18.5 5.1 19.8 7.2 20.2 7.2 21.5 5.1 21.7 8C22.6 8.8 22.7 10.6 22.2 12.2 21.6 13.8 20.6 14.4 20 14.4 19.4 14.4 18.4 13.8 17.8 12.2 17.3 10.6 17.4 8.8 18.3 8Z"></path>
    <circle cx="19.2" cy="9.4" r=".5" class="eye"></circle><circle cx="20.8" cy="9.4" r=".5" class="eye"></circle>
  </svg>`;case"heart":return function(t){return J.JW`<svg viewBox="0 0 24 24" class="heart ${t%2?"outline":""}">
    <path d=${"M12 20.6C12 20.6 2.6 14.6 2.6 8.6 2.6 5.4 5 3.2 8 3.2 9.8 3.2 11.2 4.2 12 5.6 12.8 4.2 14.2 3.2 16 3.2 19 3.2 21.4 5.4 21.4 8.6 21.4 14.6 12 20.6 12 20.6Z"} class="fill"></path>
    <path d="M6.6 6.4C5.3 7 4.8 8.4 5.1 9.7" class="shine"></path>
  </svg>`}(e);case"egg":return function(t){return J.JW`<svg viewBox="0 0 24 30" class="egg">
    <path d=${G} class="fill"></path>
    <g clip-path="url(#mc-sn-egg)">${e=t%3,0===e?J.JW`<path d=${Q} class="pat-line"></path><path d="M1 9.4H23M1 21.2H23" class="pat-thin"></path>`:1===e?J.JW`${[[8,8,1.4],[14.6,10.4,1.6],[9.4,14.4,1.8],[16,16.8,1.4],[6.4,19.6,1.3],[11.8,21.4,1.7],[17,23.2,1.1],[12.6,4.8,1]].map(([t,e,a])=>J.JW`<circle cx=${t} cy=${e} r=${a} class="pat-dot"></circle>`)}`:J.JW`<rect x="0" y="10" width="24" height="3.4" class="pat-band"></rect><rect x="0" y="17.6" width="24" height="3.4" class="pat-band2"></rect>
    <path d="M1 15.3H23" class="pat-thin"></path>`}<ellipse cx="17" cy="19" rx="6" ry="10" class="shade"></ellipse></g>
    <ellipse cx="8.6" cy="9.4" rx="1.6" ry="3" transform="rotate(18 8.6 9.4)" class="shine"></ellipse>
    <path d=${G} class="edge"></path>
  </svg>`;var e}(e);case"firework":return function(){const t=P(14).map(t=>{const e=360*t/14;return`M${R(6,e)}L${R(19.5,e-3.4)}L${R(23,e)}L${R(19.5,e+3.4)}Z`}).join(""),e=(t,e,a,i)=>{const s=e*Math.PI/180;return J.JW`<circle cx=${A(Math.sin(s)*t)} cy=${A(-Math.cos(s)*t)} r=${a} class=${i}></circle>`},a=P(14).map(t=>e(25,360*t/14,1.6,"tip")),i=P(14).map(t=>e(13.5,360*t/14+360/28,.95,"spark"));return J.JW`<svg viewBox="-30 -30 60 60" class="firework"><circle r="16" class="bloom"></circle><path d=${t} class="ray"></path>${a}${i}<circle r="2.6" class="core"></circle></svg>`}();case"star":return J.JW`<svg viewBox="-12 -12 24 24" class="star">
    <circle r="7.5" class="glow"></circle>
    <path d=${U} class="fill"></path>
    <path d="M-1.6-4.2L0-8.4" class="shine"></path>
  </svg>`;case"sparkle":return J.JW`<svg viewBox="-12 -12 24 24" class="sparkle">
    <circle r="5" class="glow"></circle>
    <path d=${"M0-11C.7-3.6 3.6-.7 11 0 3.6.7.7 3.6 0 11-.7 3.6-3.6.7-11 0-3.6-.7-.7-3.6 0-11Z"} class="fill"></path>
    <circle r="1.3" class="core"></circle>
  </svg>`;case"cloud":return J.JW`<svg viewBox="0 0 64 34" class="cloud">
    <path d=${"M14 32C6.6 32 2 27.6 2 22.2 2 16.8 6.4 12.6 12 13 13 6.6 18.6 2 25.2 2 31.6 2 36.6 6 38.2 11.6 40.2 9.9 42.8 9 45.6 9 52 9 56.6 13.6 56.6 19.6 60 20.6 62 23.6 62 26.6 62 29.8 59.6 32 56 32Z"} class="fill"></path>
    <ellipse cx="24" cy="12" rx="7" ry="4.6" class="lit"></ellipse>
  </svg>`;case"windline":return function(t){return J.JW`<svg viewBox="0 0 110 24" preserveAspectRatio="none" class="windline"><path d=${Y[t%2]}></path></svg>`}(e);case"confetti":return 2===e?J.JW`<svg viewBox="0 0 12 6" class="ribbon"><path d="M1 3.4C2.6 .8 3.6 .8 4.6 3s2 2.6 3.2.2S10.2 1 11 3"></path></svg>`:J.qy`<b class="chip ${e?"round":""}"></b>`;default:return J.qy`<b></b>`}}const K=J.JW`<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">
  <defs><clipPath id="mc-sn-egg"><path d=${G}></path></clipPath></defs>
</svg>`,tt=J.JW`<svg viewBox="0 0 40 40" class="moon">
  <circle cx="20" cy="20" r="17" class="halo"></circle>
  <path d="M25.6 6.4A14 14 0 1 0 33.6 26.4 11.2 11.2 0 1 1 25.6 6.4Z" class="fill"></path>
  <circle cx="15.2" cy="23.6" r="1.6" class="crater"></circle><circle cx="19" cy="29" r="1" class="crater"></circle>
</svg>`,et={mist:"var(--mc-sn-mist)",wind:"var(--mc-sn-wind)",bat:"var(--mc-sn-bat)",cloud:"var(--mc-sn-cloud)",snow:"var(--mc-sn-snow)","ghost-violet":"var(--mc-sn-ghost-violet)","ghost-green":"var(--mc-sn-ghost-green)"},at=t=>et[t]??t;class it extends J.WF{constructor(){super(...arguments),this.scenes=[],this.intensity=.5,this.layer="back",this.seed="mc",this.noflash=!1,this._static=!1,this._watching=!1,this._onMedia=()=>{this._static=!!this._media?.matches}}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this._static=!!this._media?.matches}disconnectedCallback(){super.disconnectedCallback(),this._media?.removeEventListener?.("change",this._onMedia),this._unwatch()}get layout(){const t=`${this.scenes.join(",")}|${this.intensity}|${this.seed}`;return this._layout?.key!==t&&(this._layout={key:t,value:L(this.scenes,this.intensity,this.seed)}),this._layout.value}_unwatch(){this._watching&&(this._watching=!1,(0,j.eF)(this))}willUpdate(t){super.willUpdate(t),this.toggleAttribute("static",this._static),this.toggleAttribute("flash",!this.noflash&&this.layout.ambient.some(t=>"flash"===t.kind))}updated(t){super.updated(t);const e=this.layout,a=!this._static&&(e.particles.length>0||e.ambient.length>0);a&&!this._watching&&this.isConnected?this._watching=(0,j.jR)(this,()=>{}):a||this._unwatch()}render(){const t=this.layout;if(!t.particles.length&&!t.ambient.length)return J.s6;const e="front"===this.layer,a=t.particles.some(t=>"egg"===t.kind);return J.qy`<div class="layer ${this._static?"still":""}" style=${e?"opacity:0.55":""}> ${a?K:J.s6} ${t.ambient.map(t=>function(t){switch(t){case"sun":return J.qy`<i class="a a-rays"></i><i class="a a-sun"></i><i class="a a-shimmer"></i>`;case"dusk":return J.qy`<i class="a a-dusk"></i><i class="a a-dusk-sun"></i>`;case"flash":return J.qy`<i class="a a-gloom"></i><i class="a a-flash"></i><i class="a a-bolt"></i><i class="a a-flash f2"></i><i class="a a-bolt b2"></i>`;case"moon":return J.qy`<i class="a a-sky"></i><i class="a a-moon">${tt}</i>`;default:return J.qy``}}(t.kind))} ${t.particles.map(t=>J.qy`<i class="p m-${t.motion} k-${t.kind}${t.flip&&"fly"===t.motion?" rev":""}" data-scene=${t.scene} style=${function(t){const e=Math.max(4,Math.abs(t.drift)/3);let a=t.rotate;"rise"!==t.motion&&"flutter"!==t.motion&&"bob"!==t.motion||(a=t.rotate%30-15),"star"===t.kind&&(a=t.rotate%24-12);const i="butterfly"===t.kind?3.4:"firefly"===t.kind?2.4:"drift"===t.motion?2.2:1.4,s=[`--x:${t.x}%`,`--y:${t.y}%`,`--s:${t.size}px`,`--d:${t.dur}s`,`--dl:${t.delay}s`,`--c:${at(t.color)}`,`--o:${t.opacity}`,`--dx:${t.drift}px`,`--sw:${Math.round(10*e)/10}px`,`--r:${a}deg`,`--wx:${Math.round(t.drift*i)}px`,`--wy:${Math.round(Math.abs(t.drift)*i/2.5+8)}px`];return t.accent&&s.push(`--c2:${at(t.accent)}`),s.join(";")}(t)} >${V(t.kind,t.variant)}</i >`)}</div>`}}it.properties={scenes:{attribute:!1,hasChanged:(t,e)=>!((t,e)=>t===e||!!t&&!!e&&t.length===e.length&&t.every((t,a)=>t===e[a]))(t,e)},intensity:{type:Number},layer:{reflect:!0},seed:{},noflash:{type:Boolean,reflect:!0},_static:{state:!0}},it.styles=B;var st=a(8668),rt=a(1771);const nt=t=>Math.round(100*t)/100,ot=(t,e,a)=>Math.min(a,Math.max(e,t)),ct=(t,e)=>({x:t,y:e}),lt=t=>`${nt(t.x)} ${nt(t.y)}`,ht=(t,e)=>Math.hypot(e.x-t.x,e.y-t.y);function dt(t,e=0){let a;if(t.shape){const i=(0,rt.aM)((0,st.fI)(t.shape.kind,t.w,t.h,t.shape.options,{inset:e}));a=i?(0,rt.Bq)(i,24).map(([t,e])=>({x:t,y:e})):[]}else a=function(t,e,a,i){const s=i,r=i,n=t-i,o=e-i;if(!(n>s&&o>r))return[];const c=(0,st.XB)((0,st.zu)((0,st.XB)(a,t,e),i),n-s,o-r),l=[],h=(t,e,a,i,s)=>{const r=Math.max(1,Math.ceil(Math.max(a,i)*Math.PI/2/1.5));for(let n=0;n<=r;n++){const o=(s+90*n/r)*Math.PI/180;l.push(ct(t+a*Math.cos(o),e+i*Math.sin(o)))}};return h(n-c.tr.x,r+c.tr.y,c.tr.x,c.tr.y,-90),h(n-c.br.x,o-c.br.y,c.br.x,c.br.y,0),h(s+c.bl.x,o-c.bl.y,c.bl.x,c.bl.y,90),h(s+c.tl.x,r+c.tl.y,c.tl.x,c.tl.y,180),l.filter((t,e)=>0===e||ht(t,l[e-1])>1e-6).filter((t,e,a)=>e<a.length-1||ht(t,a[0])>1e-6)}(t.w,t.h,t.radii,e);return a.length>2&&function(t){let e=0;for(let a=0;a<t.length;a++){const i=t[a],s=t[(a+1)%t.length];e+=i.x*s.y-s.x*i.y}return e/2}(a)<0?a.reverse():a}function ft(t,e=!0){let a=0;const i=e?t.length:t.length-1;for(let e=0;e<i;e++)a+=ht(t[e],t[(e+1)%t.length]);return a}function pt(t){const e=[0];for(let a=0;a<t.length;a++)e.push(e[a]+ht(t[a],t[(a+1)%t.length]));const a=e[e.length-1];return{length:a,pointAt:i=>{const s=(i%a+a)%a;let r=0,n=t.length-1;for(;r<n;){const t=r+n+1>>1;e[t]<=s?r=t:n=t-1}const o=t[r],c=t[(r+1)%t.length],l=e[r+1]-e[r]||1,h=(s-e[r])/l,d=(c.x-o.x)/l,f=(c.y-o.y)/l;return{x:o.x+(c.x-o.x)*h,y:o.y+(c.y-o.y)*h,tx:d,ty:f,nx:-f,ny:d}}}}function mt(t,e,a=.5){if(t.length<2||e<=0)return[];const i=pt(t);return Array.from({length:e},(t,s)=>i.pointAt((s+a)*i.length/e))}function ut(t,e){const a=pt(t);let i={s:0,d:1/0},s=0;for(let a=0;a<t.length;a++){const r=t[a],n=t[(a+1)%t.length],o=ht(r,n),c=o?ot(((e.x-r.x)*(n.x-r.x)+(e.y-r.y)*(n.y-r.y))/(o*o),0,1):0,l=Math.hypot(r.x+(n.x-r.x)*c-e.x,r.y+(n.y-r.y)*c-e.y);l<i.d&&(i={s:s+c*o,d:l}),s+=o}return{s:i.s,sample:a.pointAt(i.s)}}const gt=(t,e=!0)=>t.length?`M${t.map(lt).join("L")}${e?"Z":""}`:"";function yt(t){if(t.length<2)return"";let e=`M${lt(t[0])}`;for(let a=0;a+1<t.length;a++){const i=t[Math.max(0,a-1)],s=t[a],r=t[a+1],n=t[Math.min(t.length-1,a+2)],o=ct(s.x+(r.x-i.x)/6,s.y+(r.y-i.y)/6),c=ct(r.x-(n.x-s.x)/6,r.y-(n.y-s.y)/6);e+=`C${lt(o)} ${lt(c)} ${lt(r)}`}return e}const bt={lights:36,icicles:40,frost:32,cobweb:72,pumpkin:72,vine:72},wt=(t,e)=>{let a=0;return t.replace(/-?\d*\.?\d+(?:e-?\d+)?/g,t=>a++%2==0?String(nt(e-Number(t))):t)};var vt=a(7608);const xt=["#ff4040","#ffc61a","#2fbf4f","#2f8cff","#ff5cc8"],kt=(t,e)=>t===e||!!t&&!!e&&t.length===e.length&&t.every((t,a)=>t===e[a]);class $t extends J.WF{constructor(){super(...arguments),this.seed="mc",this.dark=!1,this._static=!1,this._watchingScreen=!1,this._onMedia=()=>{this._static=!!this._media?.matches}}get activeMotifs(){return this.motifs??b(this.scenes??[])}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-hidden","true"),this._media="function"==typeof window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):void 0,this._media?.addEventListener?.("change",this._onMedia),this._static=!!this._media?.matches,this._sync()}disconnectedCallback(){super.disconnectedCallback(),this._unobserve(),this._media?.removeEventListener?.("change",this._onMedia)}_unobserve(){this._observed&&(0,vt.Ed)(this._observed,this),this._mutations?.disconnect(),this._mutations=void 0,void 0!==this._frame&&cancelAnimationFrame(this._frame),this._frame=void 0,this._observed=void 0,this._watchingScreen&&(0,j.eF)(this),this._watchingScreen=!1}_sync(){const t=this.parentElement,e=this.activeMotifs;if(!this.isConnected||!t||!e.length)return this._unobserve(),void(this._box=void 0);t!==this._observed&&(this._unobserve(),this._observed=t,(0,vt.vb)(t,this),"function"==typeof MutationObserver&&(this._mutations=new MutationObserver(()=>this._measureSoon()),this._mutations.observe(t,{attributes:!0,attributeFilter:["style","class"]})),this.measure());const a=e.includes("lights")&&!this._static;a&&!this._watchingScreen?this._watchingScreen=(0,j.jR)(this,()=>{}):!a&&this._watchingScreen&&((0,j.eF)(this),this._watchingScreen=!1)}_measureSoon(){void 0===this._frame&&(this._frame=requestAnimationFrame(()=>{this._frame=void 0,this._mutations&&this.measure()}))}measure(){const t=this.parentElement;if(!t)return;const e=getComputedStyle(t),{w:a,h:i}=(0,vt.Bi)(t),s={w:a,h:i,top:parseFloat(e.borderTopWidth)||0,left:parseFloat(e.borderLeftWidth)||0,radii:(0,st.G3)(e,a,i),shape:this.shape};JSON.stringify(s)!==JSON.stringify(this._box)&&(this._box=s)}willUpdate(t){super.willUpdate(t),this.toggleAttribute("static",this._static),t.has("shape")&&this._box&&JSON.stringify(this._box.shape)!==JSON.stringify(this.shape)&&(this._box={...this._box,shape:this.shape})}updated(t){super.updated(t),this._sync()}get layout(){const t=this._box,e=this.activeMotifs;if(t&&e.length&&t.w>0&&t.h>0)return function(t,e,a="mc"){const i=function(t,e,a){const i=Math.min(e,a);return t.filter(t=>i>=bt[t]&&("lights"!==t||2*(e+a)>=160)&&("icicles"!==t||e>=60))}(t,e.w,e.h),s={clip:gt(dt(e,0))};return i.includes("lights")&&(s.lights=function(t){const e=dt(t,5);if(e.length<3)return;const a=ft(e),i=ot(Math.round(a/30),6,40),s=mt(e,i),r=ot(a/i*.14,1.5,4.5),n=nt(ot(Math.min(t.w,t.h)/110,.6,.9));let o=`M${lt(s[0])}`;s.forEach((t,e)=>{const a=s[(e+1)%i],n=(a.x-t.x)/(ht(t,a)||1),c=(a.y-t.y)/(ht(t,a)||1),l=-c,h=n,d=ct((t.x+a.x)/2+l*r*1.2*Math.abs(c),(t.y+a.y)/2+2*r*Math.abs(n)+h*r*1.2*Math.abs(c));o+=`Q${lt(d)} ${lt(a)}`});const c=s.map((t,e)=>{const a=t.nx,i=t.ny+.8,s=Math.hypot(a,i),r=180*(s<.3?Math.atan2(t.ny,t.nx):Math.atan2(i/s,a/s))/Math.PI-90+(e%2?14:-14);return{x:nt(t.x),y:nt(t.y),angle:Math.round(r),index:e}});return{wire:o,bulbs:c,scale:n,inset:5}}(e)),i.includes("icicles")&&(s.icicles=function(t,e){const a=dt(t,.5);if(a.length<3)return;const i=ft(a),s=mt(a,Math.max(8,Math.round(i/2))),r=w(`${e}|icicles`),n=ot(.2*t.h,6,18),o=s.filter(t=>t.ny>.82);if(!o.length)return;const c=[];let l=-1/0;for(const t of o.sort((t,e)=>t.x-e.x)){if(t.x-l<6.5)continue;l=t.x+2*r();const e=r()<.3,a=nt(n*(e?.7+.3*r():.25+.4*r())),i=nt(ot(.38*a,2.4,5.4)),s=t.x,o=t.y-.5,h=ct(s+1.2*(r()-.5),o+a),d=`M${nt(s-i/2)} ${nt(o)}C${nt(s-i/2)} ${nt(o+.35*a)} ${nt(h.x-.12*i)} ${nt(o+.75*a)} ${lt(h)}C${nt(h.x+.12*i)} ${nt(o+.75*a)} ${nt(s+i/2)} ${nt(o+.35*a)} ${nt(s+i/2)} ${nt(o)}Z`;c.push({d,x:nt(s),y:nt(o),length:a})}return{cap:yt(o.sort((t,e)=>t.x-e.x).filter((t,e)=>e%3==0).map((t,e)=>ct(t.x,t.y+1+(e%2?.8:-.2)*(.6+.6*r())))),icicles:c}}(e,a)),i.includes("frost")&&(s.frost=function(t,e){const a=dt(t,0);if(a.length<3)return;const i=w(`${e}|frost`),s=ot(.32*Math.min(t.w,t.h),14,46),r=ct(t.w/2,t.h/2),n=[ct(0,0),ct(t.w,0),ct(t.w,t.h),ct(0,t.h)].map(t=>{const{sample:e}=ut(a,t),n=ct(r.x-e.x,r.y-e.y),o=Math.hypot(n.x,n.y)||1,c=Math.atan2(n.y/o,n.x/o);let l="";for(const t of[-.55,0,.55]){const a=c+t+.25*(i()-.5),r=s*(0===t?.85:.6)*(.8+.3*i()),n=ct(e.x+1.5*Math.cos(c),e.y+1.5*Math.sin(c)),o=ct(n.x+Math.cos(a)*r,n.y+Math.sin(a)*r);l+=`M${lt(n)}L${lt(o)}`;for(const t of[.35,.6,.82]){const e=ct(n.x+Math.cos(a)*r*t,n.y+Math.sin(a)*r*t),i=r*(1-t)*.55;for(const t of[-1,1]){const s=a+.9*t;l+=`M${lt(e)}L${lt(ct(e.x+Math.cos(s)*i,e.y+Math.sin(s)*i))}`}}}return{x:nt(e.x),y:nt(e.y),radius:nt(1.25*s),crystals:l}});return{outline:gt(a),corners:n}}(e,a)),i.includes("cobweb")&&(s.cobweb=function(t,e){if(!t)return;const a=t.spider;return{threads:wt(t.threads,e),spiral:wt(t.spiral,e),spider:{...a,x:nt(e-a.x),thread:wt(a.thread,e)}}}(function(t){const e=dt(t,0);if(e.length<3)return;const{sample:a}=ut(e,ct(0,0)),i=Math.max(t.radii.tl.x,t.radii.tl.y),s=ot(Math.max(46,2.2*i),30,.45*Math.min(t.w,t.h)),r=Math.min(ht(a,ct(0,0)),.3*s),n=Math.atan2(a.ny,a.nx),o=Math.hypot(a.x,a.y)>1e-6?Math.atan2(a.y,a.x)+Math.PI:n+Math.PI,c=ct(a.x+Math.cos(o)*r,a.y+Math.sin(o)*r),l=Array.from({length:6},(t,e)=>n-Math.PI/4-.1+(Math.PI/2+.2)*e/5);let h="";for(const t of l)h+=`M${lt(c)}L${lt(ct(c.x+Math.cos(t)*s*1.15,c.y+Math.sin(t)*s*1.15))}`;let d="";for(const t of[.2,.36,.53,.7,.86,1]){const e=s*t;for(let t=0;t+1<l.length;t++){const a=l[t],i=l[t+1],s=ct(c.x+Math.cos(a)*e,c.y+Math.sin(a)*e),r=ct(c.x+Math.cos(i)*e,c.y+Math.sin(i)*e),n=(a+i)/2,o=ct(c.x+Math.cos(n)*e*.82,c.y+Math.sin(n)*e*.82);d+=`${0===t?`M${lt(s)}`:""}Q${lt(o)} ${lt(r)}`}}const f=l[Math.floor(3)],p=ct(c.x+Math.cos(f)*s*.62,c.y+Math.sin(f)*s*.62),m=nt(ot(.16*s,5,8)),u=ct(p.x,p.y+.42*s);return{threads:h,spiral:d,spider:{x:nt(u.x),y:nt(u.y),size:m,thread:`M${lt(p)}L${lt(u)}`}}}(function(t){const e=t.radii;return{...t,radii:{tl:e.tr,tr:e.tl,br:e.bl,bl:e.br}}}(e)),e.w)),i.includes("pumpkin")&&(s.pumpkin=function(t){const e=dt(t,1);if(e.length<3)return;const a=nt(ot(.3*Math.min(t.w,t.h),20,36)),i=mt(e,Math.max(8,Math.round(ft(e)/2))).filter(t=>t.ny<-.9);if(!i.length)return;const s=Math.max(...i.map(t=>t.x))-.75*a,r=i.reduce((t,e)=>Math.abs(e.x-s)<Math.abs(t.x-s)?e:t);return{x:nt(r.x),y:nt(r.y),size:a}}(e)),i.includes("vine")&&(s.vine=function(t,e){const a=dt(t,4);if(a.length<3)return;const i=pt(a),s=w(`${e}|vine`),{s:r}=ut(a,ct(0,t.h)),n=ot(.55*t.h,28,100),o=ot(.36*t.w,40,150),c=Math.max(8,Math.round((n+o)/6)),l=[];for(let t=0;t<=c;t++)l.push(i.pointAt(r+n-(n+o)*t/c));const h=l.map((t,e)=>{const a=1.6*Math.sin(e/c*(n+o)/3.5);return ct(t.x+t.nx*a,t.y+t.ny*a)}),d=[],f=[],p=Math.max(2,Math.round(c/14));l.forEach((t,e)=>{if(0===e||e===c||e%p)return;const a=180*Math.atan2(-t.ty,-t.tx)/Math.PI,i=e/p%2?1:-1;d.push({x:nt(h[e].x),y:nt(h[e].y),angle:Math.round(a+55*i),size:nt(7+3*s())})});for(const t of[.12,.38,.62,.88]){const e=Math.round(t*c),a=h[e],i=l[e];f.push({x:nt(a.x+3*i.nx),y:nt(a.y+3*i.ny),size:nt(.38===t?10:7.5+2*s()),rotate:Math.round(72*s())})}const m=(t,e,a)=>{const i=-e.tx*a,s=-e.ty*a,r=ct(t.x+4*i+2*e.nx,t.y+4*s+2*e.ny),n=ct(r.x+3*e.nx,r.y+3*e.ny),o=ct(n.x-2.5*i,n.y-2.5*s);return`M${lt(t)}Q${lt(r)} ${lt(n)}Q${lt(o)} ${lt(ct(o.x-1.4*e.nx,o.y-1.4*e.ny))}`};return{stem:yt(h),tendrils:m(h[0],l[0],-1)+m(h[c],l[c],1),leaves:d,flowers:f}}(e,a)),s}(e,t,this.seed)}render(){const t=this.layout,e=this._box;if(!t||!e||!(t.lights||t.icicles||t.frost||t.cobweb||t.pumpkin||t.vine))return J.s6;const a=`top: ${-e.top}px; left: ${-e.left}px; width: ${e.w}px; height: ${e.h}px`;return J.qy`<svg style=${a} viewBox="0 0 ${e.w} ${e.h}" focusable="false"> <defs> <clipPath id="mc-deco-clip"><path d=${t.clip}></path></clipPath> ${t.icicles?J.JW`<linearGradient id="mc-deco-ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="ice-top"></stop><stop offset="1" class="ice-tip"></stop></linearGradient>`:J.s6} ${t.frost?J.JW`<radialGradient id="mc-deco-frost"><stop offset="0" class="frost-in"></stop><stop offset="1" class="frost-out"></stop></radialGradient>
            <filter id="mc-deco-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="3"></feGaussianBlur></filter>`:J.s6} </defs> ${t.frost?function(t){return J.JW`<g class="frost" clip-path="url(#mc-deco-clip)">
    <path d=${t.outline} class="frost-edge"></path>
    ${t.corners.map(t=>J.JW`<circle cx=${t.x} cy=${t.y} r=${t.radius} fill="url(#mc-deco-frost)"></circle>`)}
    <path d=${t.corners.map(t=>t.crystals).join("")} class="crystal"></path>
  </g>`}(t.frost):J.s6} ${t.vine?function(t){return J.JW`<g class="vine">
    <path d=${t.stem} class="vstem"></path>
    <path d=${t.tendrils} class="tendril"></path>
    ${t.leaves.map((t,e)=>J.JW`<g transform="translate(${t.x} ${t.y}) rotate(${t.angle}) scale(${Math.round(t.size/8*100)/100})">
        <path d="M0 0C2-2.6 6-2.9 8.4 0 6 2.9 2 2.6 0 0Z" class="vleaf v${e%3}"></path><path d="M.6 0H7" class="vrib"></path>
      </g>`)}
    ${t.flowers.map(t=>J.JW`<g transform="translate(${t.x} ${t.y}) rotate(${t.rotate}) scale(${Math.round(t.size/10*100)/100})">
        ${[0,72,144,216,288].map(t=>J.JW`<ellipse cx="0" cy="-3.3" rx="2.3" ry="3.4" transform="rotate(${t})" class="vpetal"></ellipse>`)}
        <circle r="1.7" class="vheart"></circle>
      </g>`)}
  </g>`}(t.vine):J.s6} ${t.cobweb?function(t){const e=t.spider,a=[-1,1].flatMap(t=>[-.5,-.15,.2,.5].map((a,i)=>{const s=e.y+a*e.size*.6,r=e.x+t*e.size*.95,n=`${e.x+t*e.size*.7} ${s-e.size*(.35-.12*i)}`;return`M${e.x} ${s}Q${n} ${r} ${s+e.size*(i-1)*.28}`})).join("");return J.JW`<g class="cobweb">
    <g clip-path="url(#mc-deco-clip)"><path d=${t.threads} class="web"></path><path d=${t.spiral} class="web web-ring"></path></g>
    <path d=${e.thread} class="web"></path>
    <path d=${a} class="leg"></path>
    <circle cx=${e.x} cy=${e.y+.2*e.size} r=${.42*e.size} class="spider"></circle>
    <circle cx=${e.x} cy=${e.y-.32*e.size} r=${.26*e.size} class="spider"></circle>
    <circle cx=${e.x-.1*e.size} cy=${e.y-.36*e.size} r=${.06*e.size} class="eye"></circle>
    <circle cx=${e.x+.1*e.size} cy=${e.y-.36*e.size} r=${.06*e.size} class="eye"></circle>
  </g>`}(t.cobweb):J.s6} ${t.icicles?function(t){return J.JW`<g class="icicles">
    ${t.icicles.map(t=>J.JW`<path d=${t.d} class="ice"></path>`)}
    ${t.icicles.map(t=>J.JW`<path d="M${t.x-.6} ${t.y+1}L${t.x-.3} ${t.y+.6*t.length}" class="ice-hi"></path>`)}
    <path d=${t.cap} class="cap-shade"></path>
    <path d=${t.cap} class="cap"></path>
  </g>`}(t.icicles):J.s6} ${t.pumpkin?function(t){return J.JW`<g class="pumpkin" transform="translate(${t.x} ${t.y}) scale(${Math.round(t.size/32*1e3)/1e3})">
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
  </g>`}(t.pumpkin):J.s6} ${t.lights?function(t){const e=xt.length,a=e=>`translate(${e.x} ${e.y}) rotate(${e.angle}) scale(${t.scale})`;return J.JW`<g class="lights">
    <path d=${t.wire} class="wire"></path>
    ${xt.map((i,s)=>(i=>J.JW`<g class="lc p${i}">
      ${xt.map((s,r)=>J.JW`<g class="tw" style="--k:${r}">${t.bulbs.filter(t=>t.index%e===r).map(t=>J.JW`<g transform=${a(t)} style="color:${xt[(t.index+i)%e]}"><circle cy="7" r="8.5" class="halo"></circle><circle cy="7" r="5.2" class="halo"></circle></g>`)}</g>`)}
      ${t.bulbs.map(t=>J.JW`<path transform=${a(t)} d=${"M0 2.2C2.6 2.6 3.5 5.3 3.1 7.4 2.7 9.6 1.3 11.1 0 11.1-1.3 11.1-2.7 9.6-3.1 7.4-3.5 5.3-2.6 2.6 0 2.2Z"} class="glass" style="color:${xt[(t.index+i)%e]}"></path>`)}
    </g>`)(s))}
    ${t.bulbs.map(t=>J.JW`<g class="bulb" transform=${a(t)}>
        <ellipse cx="-1.15" cy="5.8" rx=".75" ry="1.8" class="hi"></ellipse>
        <rect x="-1.8" y="-.8" width="3.6" height="3.4" rx=".9" class="socket"></rect>
      </g>`)}
  </g>`}(t.lights):J.s6} </svg>`}}$t.properties={motifs:{attribute:!1,hasChanged:(t,e)=>!kt(t,e)},scenes:{attribute:!1,hasChanged:(t,e)=>!kt(t,e)},shape:{attribute:!1,hasChanged:(t,e)=>JSON.stringify(t)!==JSON.stringify(e)},seed:{},dark:{type:Boolean,reflect:!0},_box:{state:!0},_static:{state:!0}},$t.styles=J.AH`
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
    /* one of five colour layers is lit per step; the first is the resting look (reduced motion) */
    .lc {
      opacity: 0;
    }
    .lc.p0 {
      opacity: 1;
    }
    ${(0,J.iz)(xt.map((t,e)=>`.lc.p${e} { animation: mc-deco-on${e} ${2.4*xt.length}s steps(1, end) infinite; }`).join(" "))}
    .tw {
      opacity: 0.73;
      animation: mc-deco-twinkle 1.8s steps(1, end) infinite;
      animation-delay: calc(var(--k) * -0.7s);
    }
    .halo {
      fill: currentColor;
      opacity: 0.22;
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
    ${(0,J.iz)(xt.map((t,e)=>`@keyframes mc-deco-on${e} { ${xt.map((t,a)=>`${100*a/xt.length}% { opacity: ${a===e?1:0}; }`).join(" ")} }`).join(" "))}
    /* halo opacity 0.16 / 0.04 / 0.22 of the 0.22 it is drawn at */
    @keyframes mc-deco-twinkle {
      0% {
        opacity: 0.73;
      }
      40% {
        opacity: 0.18;
      }
      70% {
        opacity: 1;
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
  `;const Mt="2026.10.11",_t={CardSeasonal:class{constructor(t,e){this._host=t,this._opts=e,this._listening=!1,this._connected=!1,this._key="",this._onPreview=()=>this._host.requestUpdate(),t.addController(this)}now(){return this._preview()??new Date}_preview(){const t=this._opts.editorPreview()?_():void 0;return t?new Date(t.getTime()):void 0}_resolve(t,e){const a=this._preview();return(0,i.rG)(t,a??new Date,e,{localDay:!!a})}resolve(){const t=this._opts.config(),e=void 0===t?void 0:this._resolve(t,this._opts.hass());return this._key=C(e),e}changed(t){const e=this._opts.config(),a=this._opts.hass();return!(void 0===e||!a)&&(!!(0,i.aD)(e).some(e=>t?.states?.[e]!==a.states?.[e])&&C(this._resolve(e,a))!==this._key)}seed(t){return z(t)}get timerPending(){return void 0!==this._timer}hostConnected(){this._connected=!0,this._sync()}hostDisconnected(){this._connected=!1,this._sync()}hostUpdated(){this._sync()}_sync(){const t=(0,i.Oo)(this._opts.config()),e=this._connected&&!!t;e&&!this._listening?window.addEventListener($.HT,this._onPreview):!e&&this._listening&&window.removeEventListener($.HT,this._onPreview),this._listening=e;const a=t?(0,i.a0)(t):[],s=e&&!this._opts.idle()&&a.includes("auto");s&&void 0===this._timer?this._schedule():s||void 0===this._timer||(window.clearTimeout(this._timer),this._timer=void 0)}_schedule(){const t=new Date,e=(0,i.s$)(t,this._opts.hass()).getTime()-t.getTime()+500;this._timer=window.setTimeout(()=>{this._timer=void 0,this._host.requestUpdate(),this._sync()},e)}},SeasonalBudget:class{constructor(t=60){this._cap=t,this._left=60,this._flashes=0,this._demand=0,this._known=0}begin(){this._left=this._cap,this._flashes=0,this._demand=0,this._scale=void 0}own(t,e){return this._grant(t,e,1)}preset(t,e){const a=k(t,e);return this._demand+=a,void 0===this._scale&&(this._scale=this._known>this._left?Math.max(0,this._left)/this._known:1),this._grant(t,e,this._scale,a)}settle(){return this._demand!==this._known&&(this._known=this._demand,!0)}_grant(t,e,a,i=k(t,e)){const s=Math.max(0,Math.min(this._left,Math.round(i*a)));this._left-=s;const r=x(t);return r&&this._flashes++,{intensity:s===i?e:s/24,noflash:r&&this._flashes>5}}},sceneDecorations:b,sceneFlashes:x,seasonalSeed:z,seasonalPreviewDate:_,setSeasonalPreviewDate:function(t){const e=t&&Number.isFinite(t.getTime())?new Date(t.getTime()):void 0;(e?.getTime()??null)!==(M?.getTime()??null)&&(M=e,window.dispatchEvent(new CustomEvent($.HT)))}};function Ct(){customElements.get("mc-seasonal")||customElements.define("mc-seasonal",it),customElements.get("mc-seasonal-deco")||customElements.define("mc-seasonal-deco",$t)}},6383(t,e,a){a.d(e,["X",0,{lightning:"0%,89%,100%{opacity:0}90%{opacity:calc($i / 100)}91.5%{opacity:.15}93%{opacity:calc($i / 100)}96%{opacity:0}","wind-lines":"0%{translate:0 0;opacity:0}15%{opacity:1}85%{opacity:.8}100%{translate:calc(100cqw + 100%) 0;opacity:0}"}])}};