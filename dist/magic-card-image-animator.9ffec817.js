"use strict";export const __webpack_esm_ids__=[6892];export const __webpack_esm_modules__={7602(e,t,i){const n=String.raw`[ \t\n\r\f]`;i.d(t,["Lf",0,/^(?:linear|cubic-bezier\((?: ?(?:0(?:\.\d{1,6})?|1(?:\.0{1,6})?|\.\d{1,6}) ?,){3} ?(?:0(?:\.\d{1,6})?|1(?:\.0{1,6})?|\.\d{1,6}) ?\))$/,"TH",0,["<!doctype","<!entity","<?","<![cdata[","url(","@","{","}",";","<",">"],"Z8",0,/^[a-z0-9](?:[a-z0-9-]{0,47})$/,"ZI",0,n,"c2",0,/^[MmLlHhVvCcSsQqTtAaZz0-9.,+\-eE ]+$/,"g7",0,[.05,600],"ym",0,[.01,1e3]])},7087(e,t,i){i.d(t,["D7",0,"mc-image-animator-saved","hW",0,"mc-image-animator"])},1471(e,t,i){i.d(t,["BO",0,"mc-image-reference:","Nu",0,8388608,"Q1",0,/^[a-z0-9](?:[a-z0-9-]{0,47})$/,"QO",0,2097152,"W5",0,["--primary-color","--accent-color","--primary-text-color","--secondary-text-color","--disabled-text-color","--card-background-color","--primary-background-color","--secondary-background-color","--divider-color","--state-icon-color","--error-color","--warning-color","--success-color","--info-color"],"YL",0,[{ratio:"1:1",width:1024,height:1024},{ratio:"4:3",width:1280,height:960},{ratio:"16:9",width:1920,height:1080},{ratio:"9:16",width:1080,height:1920}],"ZG",0,52428800,"aw",0,["image/png","image/jpeg","image/webp","image/gif","image/avif","image/bmp"],"gY",0,67108864,"rx",0,"mc-part"])},760(e,t,i){const n=1048576;i.d(t,["$o",0,n,"HD",0,/^data:image\/(png|webp);base64,[A-Za-z0-9+/]+={0,2}$/,"Lf",0,/^(#[0-9a-fA-F]{3,8}|theme:[a-z0-9][a-z0-9-]{0,63}|main|accent|entity)$/,"Rt",0,e=>{const t=e?.caps?.image_max_bytes;return"number"==typeof t&&Number.isInteger(t)&&t>0&&t<=n?t:262144},"Ve",0,{list:"magic_card_utils/images_list",get:"magic_card_utils/images_get",save:"magic_card_utils/images_save",remove:"magic_card_utils/images_delete"}])},1342(e,t,i){i.d(t,["$o",0,1048576,"LY",0,18e5,"Lc",0,["sans-serif","serif","monospace","system-ui"],"UN",0,/^mcu-image:([a-z0-9][a-z0-9_-]{0,63})$/,"WX",0,["d","cx","cy","r","rx","ry","x","y","x1","y1","x2","y2","dx","dy","fx","fy","fr","width","height","points","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-dasharray","stroke-dashoffset","opacity","fill-opacity","stroke-opacity","transform","viewBox","id","class","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","spreadMethod","clip-path","clipPathUnits","mask","maskUnits","maskContentUnits","fill-rule","clip-rule","paint-order","vector-effect","visibility","font-size","font-family","font-weight","font-style","text-anchor","dominant-baseline","letter-spacing","preserveAspectRatio","data-name"],"_9",0,["svg","g","path","circle","ellipse","rect","line","polyline","polygon","defs","linearGradient","radialGradient","stop","clipPath","mask","title","text","tspan"],"eX",0,/^[A-Za-z][\w.-]{0,63}$/,"mT",0,/^--[a-z0-9][a-z0-9-]{0,63}$/,"t4",0,"mcu-image:","xL",0,["<!doctype","<!entity","<?","<![cdata["]])},1722(e,t,i){function n(e){const t=e.replace(/[\t\n\r\f]/g," "),i=[],n=/([MmLlHhVvCcSsQqTtAaZz])|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[ ,]+/y;for(;n.lastIndex<t.length;){const e=n.exec(t);if(!e)return;if(e[1])i.push(e[1],"0");else{if(/^[ ,]/.test(e[0]))continue;if(!i.length)return;i[i.length-1]=String(Number(i[i.length-1])+1)}}return i.length?i.join(" "):void 0}i.d(t,{B:()=>n,M:()=>r});const a=e=>32===e||9===e||10===e||13===e||12===e;function r(e){let t=0,i=e.length;for(;t<i&&a(e.charCodeAt(t));)t++;for(;i>t&&a(e.charCodeAt(i-1));)i--;return e.slice(t,i)}},1081(e,t,i){i.d(t,["KE",0,{attributeName:"d",begin:"indefinite"},"Mk",0,"animate","Vz",0,["id","attributeName","values","dur","begin"],"bQ",0,/^(?:\d{1,6}(?:\.\d{1,6})?|\.\d{1,6})(?:s|ms)$/,"mW",0,/^[0-9. ;]+$/,"of",0,["linear","spline"],"pb",0,/^(?:indefinite|\d{1,6}(?:\.\d{1,6})?|\.\d{1,6})$/,"vc",0,["id","attributeName","values","dur","repeatCount","keyTimes","keySplines","calcMode","fill","begin"],"yC",0,["freeze","remove"]])},2916(e,t,i){i.d(t,{I:()=>c});var n=i(1342),a=i(7602);const r=n.$o,o=/^[A-Za-z0-9_-]{1,64}$/,s=e=>String(+e.toFixed(4));function l(e){if("string"!=typeof e||!e||e.length>r)return;const t=e.replace(/[ \t\n\r\f]+/g," ").replace(/^ | $/g,"");return a.c2.test(t)?t:void 0}function c(e,t,i){const{duration:r,iterations:c}=t,d=t.delay??0,p="infinite"===c?"infinite":"number"==typeof c&&Number.isFinite(c)&&c>0?s(c):"";if(!o.test(i)||!Number.isFinite(r)||r<=0||!Number.isFinite(d)||d<0||!p)return"";const h=[];return e.forEach((e,t)=>{if("string"!=typeof e.target||!n.eX.test(e.target)||!Array.isArray(e.frames)||e.frames.length<2)return;const o=[];for(const t of e.frames){const e=l(t.d),i=void 0===t.easing?"":a.Lf.test(t.easing)?`animation-timing-function:${t.easing};`:void 0;if(!e||void 0===i||"number"!=typeof t.at||!(t.at>=0&&t.at<=100))return;o.push(`${s(t.at)}%{d:path("${e}");${i}}`)}const u=`mcm-${i}-${t}`;h.push(`@keyframes ${u}{${o.join("")}}`,`svg[data-mc-ia="${i}"] [id="${e.target}"]{animation:${u} ${s(r)}s linear ${s(d)}s ${p}${"infinite"===c?"":" forwards"};}`)}),h.join("\n")}},9333(e,t,i){i.r(t),i.d(t,{BUILD:()=>Fe,api:()=>Pe,install:()=>Re,openImageAnimator:()=>Ve});var n=i(7087),a=i(6161),r=i(5707),o=i(158),s=i(515),l=i(7602),c=i(1081),d=i(1342),p=i(2916),h=i(1722),u=i(201),m=i(1437),f=i(4802);function g(e){const t=e.replace(/calc\(/g,"(").replace(/(\d)(px|deg|%)/g,"$1");let i=0;const n=()=>{for(;" "===t[i];)i++;return t[i]},a=()=>{const r=n();if("("===r){i++;const t=o();if(")"!==n())throw new Error(`Expected ) in "${e}"`);return i++,t}if("-"===r||"+"===r){i++;const e=a();return"-"===r?-e:e}const s=/^\d*\.?\d+(?:e[-+]?\d+)?/i.exec(t.slice(i));if(!s)throw new Error(`Not a number in "${e}"`);return i+=s[0].length,Number(s[0])},r=()=>{let e=a();for(let t=n();"*"===t||"/"===t;t=n()){i++;const n=a();e="*"===t?e*n:e/n}return e},o=()=>{let e=r();for(let t=n();"+"===t||"-"===t;t=n()){i++;const n=r();e="+"===t?e+n:e-n}return e},s=o();if(void 0!==n())throw new Error(`Unexpected "${t.slice(i)}" in "${e}"`);return+s.toFixed(4)}function v(e){const t=[];let i=0,n="";for(const a of e.trim())"("===a&&i++,")"===a&&i--," "===a&&0===i?(n&&t.push(n),n=""):n+=a;return n&&t.push(n),t}i(3920);const b={x:[1,0,0],y:[0,1,0]};function y(e,t,i,n){const a=e.transform??={};switch(t){case"translate":{const[e,t="0"]=v(i);return a.x=g(e),void(a.y=g(t))}case"scale":{const e=v(i).map(g);return void(1===e.length?a.scale=e[0]:(a.scale_x=e[0],a.scale_y=e[1]))}case"rotate":{const e=v(i);return a.rotate=g(e[e.length-1]),void(2===e.length&&b[e[0]]?a.axis=b[e[0]]:4===e.length&&(a.axis=[g(e[0]),g(e[1]),g(e[2])]))}case"opacity":return void(e.opacity=g(i));case"filter":return void(e.filter=i);case"box-shadow":return void(e.shadow=i)}throw new Error(`Preset ${n}: cannot convert "${t}"`)}function w(e){const t=(0,f.fi)(e);if(void 0===t)throw new Error(`Preset ${e} has no keyframes`);const i=new Map;for(const n of(0,f.Gt)(t))for(const t of n.offsets){const a=i.get(t)??{at:t};for(const[t,i]of n.decls)y(a,t,i,e);i.set(t,a)}return[...i.values()].map(e=>e.transform&&!Object.keys(e.transform).length?(({transform:e,...t})=>t)(e):e).sort((e,t)=>e.at-t.at)}var _=i(4753);const{t:k,tx:$,m:x,locale:A}=(0,_.my)("image-animator",["A clip name can be 64 characters at most.|A clip with a morph can only play forwards.|Above|Add an effect to {name}|Add clip|Add morph|Add preset|Added the clip {name}.|Added {effect} to {name}.|Always|An entity reaches a state|An image can hold 16 clips at most.|Animate image|Animate {name}|Animating needs a newer Magic Card Utils. Update it and try again.|Animation data of {size} KiB, over the limit of {limit} KiB|As saved|Attribute (optional)|Back and forth|Back and forth, starting backwards|Backwards|Below|Cancel|Changes into|Choose a name that no other clip has.|Choose two different shapes to morph.|Click a part of the drawing, or choose it from this list.|Clip name|Clips|Close|Colour|Condition|Could not reach Magic Card Utils. Your work is safe.|Delete|Deleted the clip {name}.|Direction|Discard|Discard the changes you have not saved?|Discard this image and your changes? It is not in the library yet.|Draw the outline|Duplicate|Duration (seconds)|Enter a name for the clip.|Enter an entity id such as cover.garage and a condition that fits.|Enter path data, for example M0 0 L50 20.|Entity|Fade|Follow a path|Forwards|Glow|Go back to the first shape|Group {id}|Hovering over the image|Idle|Image|Is off|Is on|Keep editing|Morph|Morph one shape into another|Move and turn|Move down|Move up|Name each animation and choose what starts it.|New clip name|Not in the library yet. Save adds it as {name}.|Nothing here has an outline to draw.|Opening the image…|Parts of the image|Path data|Preset|Repeat forever|Repeats|Save|Saved.|Saved. Magic Card could not check where this image is used.|Saving…|Saving… The window closes when it is done.|Shape that changes|Shape {id}|Starts when|State is|State is not|Tapping the image|The duration or the number of repeats is out of range.|The first shape changes into the second. They do not need the same number of points.|The saved animation of this image is not valid, so the image cannot be animated here.|This animation is heavy and may run slowly on older devices. You can still save it.|This change could not be made.|This drawing contains markup that cannot be used.|This effect could not be added to the animation.|This file is not an SVG drawing.|This image has no animations yet.|This image is larger than the library accepts.|This image is not in the library any more.|This image was changed somewhere else. Close this window and open it again.|This morph could not be added.|This name cannot be used.|Updated the clip {name}.|Use this trigger|Used on at least {count, plural, one {# card} other {# cards}}. Magic Card could not check every dashboard. Saving changes how the image looks there.|Used on {count, plural, one {# card} other {# cards}}. Saving changes how the image looks there.|Value|Whole image|Your image library is over 50 MiB. A large library can slow down older devices. You can still save.|{count, plural, one {# animated shape} other {# animated shapes}}, over the limit of {limit}|{count, plural, one {# animation} other {# animations}}|{count, plural, one {# morph point} other {# morph points}}, over the limit of {limit}|{count, plural, one {# shape with a blur or colour filter} other {# shapes with a blur or colour filter}}, over the limit of {limit}","||||||||||||||||||||||||||||||Color||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||{count, plural, one {# shape with a blur or color filter} other {# shapes with a blur or color filter}}, over the limit of {limit}","Een naam mag hoogstens 64 tekens hebben.|Een animatie met een overgang kan alleen vooruit spelen.|Boven|Effect toevoegen aan {name}|Animatie toevoegen|Overgang toevoegen|Voorinstelling toevoegen|De animatie {name} is toegevoegd.|{effect} toegevoegd aan {name}.|Altijd|Een entiteit bereikt een status|Een afbeelding kan hoogstens 16 animaties hebben.|Afbeelding animeren|{name} animeren|Animeren vraagt een nieuwere Magic Card Utils. Werk die bij en probeer het opnieuw.|Animatiegegevens van {size} KiB, meer dan de grens van {limit} KiB|Zoals opgeslagen|Attribuut (optioneel)|Heen en weer|Heen en weer, beginnend achteruit|Achteruit|Onder|Annuleren|Verandert in|Kies een naam die nog niet in gebruik is.|Kies twee verschillende vormen voor de overgang.|Klik op een onderdeel van de tekening of kies het in deze lijst.|Naam van de animatie|Animaties|Sluiten|Kleur|Voorwaarde|Magic Card Utils is niet bereikbaar. Je werk is veilig.|Verwijderen|De animatie {name} is verwijderd.|Richting|Weggooien|Wijzigingen die niet zijn opgeslagen weggooien?|Deze afbeelding en je wijzigingen weggooien? Ze staat nog niet in de bibliotheek.|Contour tekenen|Dupliceren|Duur (seconden)|Geef de animatie een naam.|Geef een entiteit op, zoals cover.garage, en een passende voorwaarde.|Voer padgegevens in, bijvoorbeeld M0 0 L50 20.|Entiteit|Vervagen|Een pad volgen|Vooruit|Gloed|Terug naar de eerste vorm|Groep {id}|Aanwijzen van de afbeelding|Rust|Afbeelding|Staat uit|Staat aan|Verder bewerken|Overgang|Een vorm in een andere laten overgaan|Verplaatsen en draaien|Omlaag|Omhoog|Geef elke animatie een naam en kies wat hem start.|Naam van de nieuwe animatie|Nog niet in de bibliotheek. Opslaan voegt het toe als {name}.|Hier is geen contour om te tekenen.|De afbeelding wordt geopend…|Onderdelen van de afbeelding|Padgegevens|Voorinstelling|Eindeloos herhalen|Herhalingen|Opslaan|Opgeslagen.|Opgeslagen. Magic Card kon niet controleren waar deze afbeelding wordt gebruikt.|Bezig met opslaan…|Bezig met opslaan… Het venster sluit zodra dat klaar is.|Vorm die verandert|Vorm {id}|Start bij|Status is|Status is niet|Tikken op de afbeelding|De duur of het aantal herhalingen valt buiten het bereik.|De eerste vorm gaat over in de tweede. Ze hoeven niet evenveel punten te hebben.|De opgeslagen animatie van deze afbeelding is niet geldig, dus je kunt hem hier niet animeren.|Deze animatie is zwaar en kan op oudere apparaten langzaam draaien. Je kunt hem nog steeds opslaan.|Deze wijziging kon niet worden doorgevoerd.|Deze tekening bevat opmaak die niet gebruikt kan worden.|Dit effect kon niet aan de animatie worden toegevoegd.|Dit bestand is geen SVG-tekening.|Deze afbeelding heeft nog geen animaties.|Deze afbeelding is groter dan de bibliotheek accepteert.|Deze afbeelding staat niet meer in de bibliotheek.|Deze afbeelding is elders gewijzigd. Sluit dit venster en open het opnieuw.|Deze overgang kon niet worden toegevoegd.|Deze naam kan niet worden gebruikt.|De animatie {name} is bijgewerkt.|Deze start gebruiken|Gebruikt op minstens {count, plural, one {# kaart} other {# kaarten}}. Magic Card kon niet controleren of alle dashboards gelezen zijn. Opslaan verandert hoe de afbeelding daar eruitziet.|Gebruikt op {count, plural, one {# kaart} other {# kaarten}}. Opslaan verandert hoe de afbeelding daar eruitziet.|Waarde|Hele afbeelding|Je afbeeldingenbibliotheek is groter dan 50 MiB. Een grote bibliotheek kan oudere apparaten vertragen. Je kunt nog steeds opslaan.|{count, plural, one {# geanimeerde vorm} other {# geanimeerde vormen}}, meer dan de grens van {limit}|{count, plural, one {# animatie} other {# animaties}}|{count, plural, one {# morphpunt} other {# morphpunten}}, meer dan de grens van {limit}|{count, plural, one {# vorm met een vervagings- of kleurfilter} other {# vormen met een vervagings- of kleurfilter}}, meer dan de grens van {limit}"]),S=new Set(["g","path","rect","circle","ellipse","line","polyline","polygon","text","use","image"]),E=new Set(["defs","clippath","mask","symbol","pattern","marker","lineargradient","radialgradient","filter","metadata","title","desc"]),z=new WeakMap,M=e=>e.localName.toLowerCase(),C=(e,t)=>{if(!S.has(M(t)))return!1;for(let i=t.parentElement;i&&i!==e;i=i.parentElement)if(E.has(M(i)))return!1;return!0},N=e=>{const t=new Map;for(const i of e.querySelectorAll("[id]")){const e=i.getAttribute("id")??"";t.has(e)||t.set(e,i)}return{first:t,next:1}};function q(e,t,i){const n="g"===M(t)?"group":"element",a=((e,t)=>{const i=t.getAttribute("id");return i&&d.eX.test(i)&&e.first.get(i)===t?i:void 0})(i,t);if(a)return{ref:`part:${a}`,kind:n,id:a,generated:!1,element:t};let r=z.get(e);r||z.set(e,r=new Map);let o=r.get(t);if(!o){const n=i.used??=((e,t)=>{const i=new Set(t.first.keys());for(const t of z.get(e)?.values()??[])i.add(t);return i})(e,i);for(;n.has(`mc-${i.next}`);)i.next+=1;o=`mc-${i.next}`,n.add(o),r.set(t,o)}return{ref:`part:${o}`,kind:n,id:o,generated:!0,element:t}}const T={ref:"element",kind:"image",generated:!1};function B(e){const t=[{...T}],i=N(e);for(const n of e.querySelectorAll("*"))C(e,n)&&t.push(q(e,n,i));return t}function I(e){return!!(e.generated&&e.element&&e.id)&&(e.element.setAttribute("id",e.id),!0)}const j=["transform","opacity","colour","filter","stroke-draw","motion-path","preset"],O=()=>({id:"idle",name:k(53),play:{on:"always"},duration:2,easing:"ease-in-out",iterations:"infinite",tracks:[]}),D={transform:[{at:0,transform:{rotate:0,scale:1}},{at:50,transform:{rotate:12,scale:1.1}},{at:100,transform:{rotate:0,scale:1}}],opacity:[{at:0,opacity:1},{at:50,opacity:.3},{at:100,opacity:1}],colour:[{at:0,color:"#e53935"},{at:50,color:"#fdd835"},{at:100,color:"#e53935"}],filter:[{at:0,filter:"brightness(1)"},{at:50,filter:"brightness(1.6)"},{at:100,filter:"brightness(1)"}],"stroke-draw":[{at:0,draw:0},{at:70,draw:1},{at:100,draw:1}]},L=(e,t=[])=>("string"==typeof e?t.push(e):Array.isArray(e)?e.forEach(e=>L(e,t)):e&&"object"==typeof e&&Object.values(e).forEach(e=>L(e,t)),t),F=e=>{const t=e.getAttribute("stroke")??/(?:^|;)\s*stroke\s*:\s*([^;]+)/.exec(e.getAttribute("style")??"")?.[1];return!!t&&"none"!==t.trim()};function R(e,t){const i=Object.fromEntries(j.map(e=>[e,{ok:!0}])),n=function(e,t){return"element"===t.ref?e:t.element&&e.contains(t.element)?t.element:Array.from(e.querySelectorAll("[id]")).find(e=>e.getAttribute("id")===t.id)}(e,t);let a=!n;if(n){a=F(n)||Array.from(n.querySelectorAll("*")).some(F);for(let e=n.parentElement;e&&!a;e=e.parentElement)a=F(e)}return a||(i["stroke-draw"]={ok:!1,reason:"no-stroke"}),i}var V=i(760),P=i(1771);const W=Math.floor(V.$o/5);function J(e){const t=e.segs.reduce((e,t)=>e+(t.c1?4:1),0);return{pts:(0,P.Bq)(e,16),closed:e.closed,weight:t}}function U(e){const t=(0,P.Rr)(function(e){const t="string"==typeof e&&e.length<=262144?e.replace(/\s+/g," ").trim():"";if(!t||!l.c2.test(t))throw new Error("Not path data");return t}(e)).map(J);if(!t.length||t.length>256)throw new Error("No usable subpaths");return t}function H(e,t,i,n){let a=n;for(;a<e.length-2&&t[a+1]<i;)a+=1;const r=t[a+1]-t[a],o=r>0?Math.min(1,Math.max(0,(i-t[a])/r)):0,s=e[a],l=e[a+1];return{p:[s[0]+(l[0]-s[0])*o,s[1]+(l[1]-s[1])*o],at:a}}const G=e=>{if(!Number.isFinite(e))throw new Error("Not a finite number");const t=Math.round(100*e)/100;return String(0===t?0:t)},Z="0 0 1 1",K="mc-morph-",Q=(e,t=4)=>String(+e.toFixed(t));function Y(e){const{target:t,smil:i,duration:n,iterations:a}=e;if(!d.eX.test(t)||!d.eX.test(i))throw new Error("A morph needs ids");!function(e){if(e.length<2||e.length>32)throw new Error("A morph needs 2 to 32 frames");e.forEach((t,i)=>{if("number"!=typeof t.at||!Number.isFinite(t.at))throw new Error("A frame needs a position");if(0===i?0!==t.at:t.at<=e[i-1].at)throw new Error("Frames must rise from 0");if(i===e.length-1&&100!==t.at)throw new Error("The last frame is at 100");if(void 0!==t.easing&&!l.Lf.test(t.easing))throw new Error("A morph eases linearly or with a cubic-bezier")})}(e.frames),function(e,t){const[i,n]=l.g7,[a,r]=l.ym;if(!(e>=i&&e<=n))throw new Error("The duration is out of range");if("infinite"!==t&&!(t>=a&&t<=r))throw new Error("The iteration count is out of range")}(n,a);const r=e.frames.map(e=>+e.at.toFixed(2));if(r.some((e,t)=>t>0&&e<=r[t-1]))throw new Error("Frames are too close together");const o=e.resampled?e.frames.map(e=>e.d):function(e){const t=e.map(U),i=Math.max(...t.map(e=>e.length)),n=Array.from({length:i},(e,i)=>{const n=t.filter(e=>e[i]).map(e=>e[i]);return{points:Math.max(3,...n.map(e=>e.weight)),closed:n.every(e=>e.closed)}});if(n.reduce((e,t)=>e+t.points,0)*t.length>W)throw new Error("Too many points to morph");return t.map(e=>n.map((t,i)=>function(e,t){const[i,...n]=e;return`M${G(i[0])} ${G(i[1])}${n.map(e=>` L${G(e[0])} ${G(e[1])}`).join("")}${t?" Z":""}`}(function(e,t,i){const n=e.closed?[...e.pts,e.pts[0]]:e.pts;if(n.length<2)return Array.from({length:t},()=>n[0]);const a=[0];for(let e=1;e<n.length;e++)a.push(a[e-1]+Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]));const r=a[a.length-1],o=[];let s=0;for(let e=0;e<t;e++){const l=H(n,a,i?r*e/t:r*e/(t-1),s);s=l.at,o.push(l.p)}return o}(e[i]??function(e){const t=e.flatMap(e=>e.pts),i=t.map(e=>e[0]),n=t.map(e=>e[1]);return{pts:[[(Math.min(...i)+Math.max(...i))/2,(Math.min(...n)+Math.max(...n))/2]],closed:!0,weight:0}}(e),t.points,t.closed),t.closed)).join(" "))}(e.frames.map(e=>e.d)),s=e.frames.length-1,u=e.frames.map((e,t)=>t<s&&void 0!==e.easing?{at:r[t],d:o[t],easing:e.easing}:{at:r[t],d:o[t]}),m=(0,h.B)(u[0].d);if(!m||u.some(e=>!l.c2.test(e.d)||(0,h.B)(e.d)!==m))throw new Error("The frames do not share one structure");const f={target:t,smil:i,frames:u},g=u.slice(0,s).map(e=>function(e){if(void 0===e)return Z;if(!l.Lf.test(e))throw new Error("A morph eases linearly or with a cubic-bezier");return"linear"===e?Z:e.slice(e.indexOf("(")+1,-1).split(",").map(e=>Q(Number(e),6)).join(" ")}(e.easing)),v=g.some(e=>e!==Z),b={id:i,attributeName:"d",values:u.map(e=>e.d).join(";"),dur:`${Q(n)}s`,repeatCount:"infinite"===a?"indefinite":Q(a),keyTimes:r.map(e=>Q(e/100)).join(";"),begin:"indefinite"};if(v&&(b.calcMode="spline",b.keySplines=g.join(";")),"infinite"!==a&&(b.fill="freeze"),!c.bQ.test(b.dur)||!c.pb.test(b.repeatCount))throw new Error("The timing cannot be written");if(!c.mW.test(b.keyTimes)||b.keySplines&&!c.mW.test(b.keySplines))throw new Error("The timing cannot be written");if([t,i,...u.flatMap(e=>[e.d,e.easing??""])].some(e=>l.TH.some(t=>e.toLowerCase().includes(t))||/["&]/.test(e)))throw new Error("A morph cannot hold this text");const y=(0,p.I)([f],{duration:n,delay:e.delay,iterations:a},"morph");if(!y)throw new Error("The morph cannot be written");return{morph:f,css:y,smil:`<animate ${Object.entries(b).map(([e,t])=>`${e}="${t}"`).join(" ")}/>`,attributes:b}}const X=e=>new Set(Array.from(e.querySelectorAll("[id]"),e=>e.getAttribute("id")??"")),ee=/^[a-z0-9_]{1,64}\.[a-z0-9_]{1,128}$/,te=/^[A-Za-z0-9_]{1,64}$/,ie=["id","attributeName","values","dur","repeatCount","keyTimes","keySplines","calcMode","fill","begin"],ne=e=>({ok:!1,error:e}),ae=e=>{const t=e.toLowerCase();return l.TH.some(e=>t.includes(e))};function re(e,t,i){const n=t.trim();if(!n)return"name-empty";if([...n].length>64)return"name-too-long";if(ae(n))return"name-denied";const a=n.toLowerCase();return e.clips.some(e=>e.id!==i&&e.name.toLowerCase()===a)?"name-taken":{name:n}}function oe(e,t){const i=t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40).replace(/-+$/,"")||"clip",n=new Set(e.clips.map(e=>e.id));let a=i;for(let e=2;n.has(a);e+=1)a=`${i}-${e}`;return l.Z8.test(a)?a:"clip"}const se=e=>e?JSON.parse(JSON.stringify(e)):{v:1,clips:[]};function le(e){if(!e||"object"!=typeof e)return;const t=e,i=Object.keys(t);if(1!==i.length)return;const n=i[0];return("state"===n||"state_not"===n)&&"string"==typeof(a=t[n])&&a.length<=64&&!ae(a)?{[n]:t[n]}:"entity_on"===n&&"boolean"==typeof t[n]?{entity_on:t[n]}:("above"===n||"below"===n)&&"number"==typeof(r=t[n])&&Number.isFinite(r)&&Math.abs(r)<=1e9?{[n]:t[n]}:void 0;var a,r}function ce(e,t,i){const n=se(e),a=n.clips.find(e=>e.id===t);if(!a)return ne("not-found");const r=function(e){if(!e||"object"!=typeof e)return;const t=e;if("always"===t.on||"hover"===t.on||"tap"===t.on)return{on:t.on};if("state"!==t.on)return;if("string"!=typeof t.entity||!ee.test(t.entity))return;const i=le(t.when);if(!i)return;const n={on:"state",entity:t.entity,when:i};if(void 0!==t.attribute){if("string"!=typeof t.attribute||!te.test(t.attribute))return;n.attribute=t.attribute}return n}(i);return r?(a.play=r,{ok:!0,anim:n,id:t}):ne("bad-play")}function de(e,t,i){const n=Array.from(e.querySelectorAll("animate")).find(e=>e.getAttribute("id")===t);if(n){for(const e of ie)e in i||n.removeAttribute(e);for(const[e,t]of Object.entries(i))n.setAttribute(e,t)}}const pe=(e,t)=>(e.querySelector(`[name="${t}"]`)?.value??"").trim();let he;function ue(){return he??=m.u7.flatMap(e=>{try{return w(e.id),[{id:e.id,name:(0,u.t)(e.name)}]}catch{return[]}}),he}function me(e){return"image"===e.kind?k(103):"group"===e.kind?k(51,{id:e.id??""}):k(79,{id:e.id??""})}function fe(e){switch(e){case"transform":return k(60);case"opacity":return k(46);case"colour":return k(30);case"filter":return k(49);case"stroke-draw":return k(39);case"motion-path":return k(47);default:return k(70)}}const ge=fe,ve=["transform","opacity","colour","filter","stroke-draw"];var be=i(2254);let ye;function we(){return ye??=async function(){try{const[e,t,n]=await Promise.all([i.e(4771).then(()=>i(6876)),(0,be.R3)(),(0,be.Dd)()]);if(!t||!n)return;return{api:e.api,check:t.checkImageAnimation,install:e.install,kit:{play:t.api.play,compile:n}}}catch(e){return void console.warn("Magic Card: image animator could not load the image tools",e)}}().then(e=>(e||(ye=void 0),e)),ye}function _e(e,t){return e.map(e=>a.qy`<option value=${e.ref} ?selected=${e.ref===t}>${(e=>k(79,{id:e.id??""}))(e)}</option>`)}const ke={release:()=>{}},$e=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;async function xe(e){try{const t=await e.callWS({type:V.Ve.list}),i=(0,V.Rt)(t),n=t?.caps;return{maxBytes:i,canSave:!!n&&n.image_max_bytes===i&&1===n.animation,ids:new Set((t?.images??[]).map(e=>e.id))}}catch{return}}function Ae(e){return"too_large"===e?"too_large":"unsafe_markup"===e||"too_complex"===e?"unsafe_markup":"not_svg"}function Se(e,t,i){return $e(e)+(t?.length?$e(JSON.stringify(t)):0)+(i?$e(JSON.stringify(i)):0)}function Ee(e,t){const i=e.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,56).replace(/-+$/,"")||"image";let n=i;for(let e=2;t.has(n);e++)n=`${i}-${e}`;return n}const ze=a.AH`
  :host {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: block;
  }
  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .window {
    position: absolute;
    inset: 16px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    border: 1px solid var(--mc-divider);
    background: var(--mc-surface);
    color: var(--mc-text);
    box-shadow: var(--mc-shadow-float);
    overflow: hidden;
  }
  header,
  footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    padding: 8px 12px;
  }
  header {
    border-block-end: 1px solid var(--mc-divider);
  }
  footer {
    border-block-start: 1px solid var(--mc-divider);
  }
  h2 {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  h2:focus {
    outline: none;
  }
  .body {
    flex: 1 1 auto;
    min-height: 0;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 8px;
    padding: 12px;
  }
  .work {
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(14rem, 22rem);
    gap: 12px;
  }
  .canvas {
    min-height: 0;
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto;
    gap: 8px;
  }
  .stage {
    min-height: 12rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: var(--mc-ground);
    overflow: hidden;
    cursor: crosshair;
    touch-action: manipulation;
  }
  .stage svg {
    display: block;
    max-width: 100%;
    max-height: 100%;
  }
  .stage [data-mc-picked] {
    outline: 2px dashed var(--mc-accent, currentColor);
    outline-offset: 2px;
  }
  .saved {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8125rem;
    color: var(--mc-text-2);
  }
  .saved mc-svg-image {
    display: block;
    width: 4rem;
    height: 4rem;
  }
  .side {
    min-height: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    gap: 12px;
  }
  .side h3 {
    margin: 0 0 4px;
    font-size: 0.875rem;
    font-weight: 600;
  }
  .targets {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 12rem;
    overflow: auto;
    display: grid;
    gap: 2px;
  }
  .target {
    width: 100%;
    min-height: 32px;
    padding-inline: 8px;
    text-align: start;
    border: 1px solid transparent;
    border-radius: 6px;
    background: none;
    color: var(--mc-text);
    font: inherit;
    cursor: pointer;
    overflow-wrap: anywhere;
  }
  .target[aria-pressed='true'] {
    border-color: var(--mc-accent, currentColor);
    background: var(--mc-ground);
    font-weight: 600;
  }
  .target:focus-visible,
  .effects button:focus-visible,
  .ia-row :is(select, input, button):focus-visible {
    outline: 2px solid var(--mc-accent, currentColor);
    outline-offset: 2px;
  }
  .effects,
  .ia-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 8px;
    margin-block-start: 8px;
  }
  .effects button[aria-disabled='true'] {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .ia-row label {
    flex: 1 0 100%;
    font-size: 0.8125rem;
    color: var(--mc-text-2);
  }
  .ia-row :is(select, input) {
    flex: 1 1 8rem;
    min-width: 0;
    min-height: 32px;
  }
  @media (max-width: 700px) {
    .work {
      grid-template-columns: minmax(0, 1fr);
      overflow: auto;
    }
  }
  p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--mc-text-2);
  }
  p.problem {
    color: var(--mc-danger-ink, var(--mc-text));
    font-weight: 600;
  }
  .status {
    flex: 1 1 12em;
    min-width: 0;
  }
  .confirm {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px 12px;
    padding: 12px 16px;
    border-top: 1px solid var(--mc-border, currentColor);
  }
  .confirm p {
    flex: 1 1 16em;
    margin: 0;
  }
  .warnings p {
    margin: 0 0 4px;
  }
  .warnings ul {
    margin: 0 0 8px;
    padding-inline-start: 20px;
  }
`,Me=/[A-Za-z0-9_-]/,Ce=e=>"object"==typeof e&&null!==e;function Ne(e,t){let i=0,n=0;const a=(e,r)=>{if(!(!Ce(e)||r>32||++n>2e5))if(Array.isArray(e)||"custom:magic-card"!==e.type)for(const t of Array.isArray(e)?e:Object.values(e))a(t,r+1);else try{(function(e,t){const i=`mcu-image:${t}`;for(let t=e.indexOf(i);t>=0;t=e.indexOf(i,t+1))if(!Me.test(e.charAt(t+i.length)))return!0;return!1})(JSON.stringify(e),t)&&i++}catch{}};return a(e,0),i}async function qe(e,t){const{paths:i,complete:n}=await async function(e){try{const t=await e.callWS({type:"lovelace/dashboards/list"}),i=[null];for(const e of Array.isArray(t)?t:[])Ce(e)&&"string"==typeof e.url_path&&"yaml"!==e.mode&&i.length<=200&&i.push(e.url_path);return{paths:i,complete:!0}}catch{return{paths:[null],complete:!1}}}(e),a=await Promise.all(i.map(async i=>{try{return{count:Ne(await e.callWS({type:"lovelace/config",...null===i?{}:{url_path:i}}),t),ok:!0}}catch{return{count:0,ok:!1}}}));return{count:a.reduce((e,t)=>e+t.count,0),complete:n&&a.every(e=>e.ok)}}var Te=i(1471);const Be=/[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g,Ie=e=>"object"==typeof e&&null!==e,je=e=>Array.isArray(e)?e:[];var Oe=function(e,t,i,n){var a,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(o=(r<3?a(o):r>3?a(t,i,o):a(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};const De=e=>`${e.svg}\0${JSON.stringify(e.animation??null)}`;class Le extends a.WF{constructor(){super(...arguments),this._phase="opening",this._saving=!1,this._libraryBytes=0,this._unchecked=!1,this._note="",this._closeAfterSave=!1,this._target={ref:"element",kind:"image",generated:!1},this._targets=[],this._presetId="",this._path="",this._message="",this._morphFrom="",this._morphInto="",this._morphBack=!1,this._morphMessage="",this._clipId="",this._drafting="",this._clipMessage="",this._clean=""}connectedCallback(){super.connectedCallback(),this._started??=this._open()}async _open(){const e=this.source,t=this.hass;if(!e||!t)return this._fail("failed");const i=await we();if(!i)return this._fail("failed");i.install(),this._kit=i.kit;const n=await function(e,t){return"image"===t.kind?async function(e,t){const i=await xe(e);if(!i)return{ok:!1,reason:"failed"};let n;try{n=(await e.callWS({type:V.Ve.get,ids:[t]})).images?.[0]}catch{return{ok:!1,reason:"failed"}}if(!n)return{ok:!1,reason:"missing"};const a=await we();if(!a)return{ok:!1,reason:"failed"};const r=a.api.sanitizeImage(n.svg,{animation:n.animation});if(r.error)return{ok:!1,reason:Ae(r.error)};let o;return void 0===n.animation||(o=a.check(n.animation,new Set(r.ids)),o)?{ok:!0,id:n.id,name:n.name,svg:r.markup,viewBox:r.viewBox||n.view_box,bindings:n.bindings??[],...o?{animation:o}:{},updatedAt:n.updated_at,canSave:i.canSave,maxBytes:i.maxBytes}:{ok:!1,reason:"invalid_animation"}}(e,t.id):async function(e,t){const i=await xe(e);if(!i)return{ok:!1,reason:"failed"};if(!i.canSave)return{ok:!1,reason:"needs_utils"};if(t.size>i.maxBytes)return{ok:!1,reason:"too_large"};let n;try{n=await t.text()}catch{return{ok:!1,reason:"failed"}}const a=await we();if(!a)return{ok:!1,reason:"failed"};const r=a.api.sanitizeImage(n,{file:!0});if(r.error)return{ok:!1,reason:Ae(r.error)};if(Se(r.markup,void 0,void 0)>i.maxBytes)return{ok:!1,reason:"too_large"};const o=t.name.replace(/\.svg$/i,"").replace(/[-_]+/g," ").trim().slice(0,64)||k(54);return{ok:!0,id:Ee(o,i.ids),name:o,svg:r.markup,viewBox:r.viewBox,bindings:[],canSave:!0,maxBytes:i.maxBytes,isNew:!0}}(e,t.file)}(t,e);if(!n.ok)return this._fail(n.reason);this._opened=n,this._clean=De(n),this._presetId=ue()[0]?.id??"",this._phase="ready",this._readLibrary()}async _readLibrary(){const e=function(e){let t=0;for(const i of e)Ie(i)&&"number"==typeof i.bytes&&Number.isFinite(i.bytes)&&i.bytes>0&&(t+=i.bytes);return{show:t>=Te.ZG,bytes:t}}((this.hass?await async function(e){try{const t=await e.callWS({type:V.Ve.list});return Array.isArray(t?.images)?t.images.map(e=>({bytes:e.bytes})):void 0}catch{return}}(this.hass):void 0)??[]);this._libraryBytes=e.show?e.bytes:0}_confirm(e){return new Promise(t=>{this._ask={notice:e,answer:t},this.updateComplete.then(()=>this.renderRoot.querySelector(".confirm .btn-primary")?.focus())})}_answer(e){const t=this._ask;this._ask=void 0,t?.answer(e)}_fail(e){this._reason=e,this._phase="failed"}_announce(e){const t={id:e};(this.opener??this).dispatchEvent(new CustomEvent(n.D7,{detail:t,bubbles:!0,composed:!0}))}_close(){if(this._ask&&this._answer(!1),!this._leaving)if(this._saving)this._closeAfterSave=!0;else{if(!this._opened||De(this._opened)===this._clean)return this._discard();this._leaving={from:this.shadowRoot?.activeElement??null},this.updateComplete.then(()=>this.renderRoot.querySelector(".leave .btn-secondary")?.focus())}}_keepEditing(){const e=this._leaving?.from;this._leaving=void 0,this.updateComplete.then(()=>(e?.isConnected?e:this.renderRoot.querySelector("h2"))?.focus())}_discard(){this._leaving=void 0,this.dispatchEvent(new CustomEvent("close"))}async _save(){const e=this._opened,t=this.hass;if(!e||!t||this._saving)return;let i;this._saving=!0,this._note="",this._reason=void 0,this._unchecked=!1;try{i=await async function(e,t,i){const n=t.isNew?{kind:"none"}:0===(a=await qe(e,t.id)).count?a.complete?{kind:"none"}:{kind:"unknown"}:{kind:a.complete?"used":"at-least",count:a.count};var a;if(("used"===n.kind||"at-least"===n.kind)&&!await i(n))return{ok:!1,reason:"cancelled"};const r=await async function(e,t){const i=await xe(e);if(!i)return{ok:!1,reason:"failed"};if(!i.canSave)return{ok:!1,reason:"needs_utils"};const n=(e=>{const t=e?.clips;return Array.isArray(t)&&t.length>0})(t.animation)?t.animation:void 0;if(Se(t.svg,t.bindings,n)>i.maxBytes)return{ok:!1,reason:"too_large"};const a=await we();if(!a)return{ok:!1,reason:"failed"};const r=a.api.sanitizeImage(t.svg,{animation:n});if(r.error)return{ok:!1,reason:Ae(r.error)};let o;if(n&&(o=a.check(n,new Set(r.ids)),!o))return{ok:!1,reason:"invalid_animation"};if(Se(r.markup,t.bindings,o)>i.maxBytes)return{ok:!1,reason:"too_large"};const s=await a.api.thumbnail(r.markup,320,16384).catch(()=>{}),l=t.isNew?(await xe(e))?.ids:i.ids;if(!l)return{ok:!1,reason:"failed"};const c=t.isNew&&l.has(t.id)?Ee(t.id,l):t.id,d={id:c,name:t.name,view_box:r.viewBox||t.viewBox,svg:r.markup,...t.bindings?.length?{bindings:t.bindings}:{},...o?{animation:o}:{},...s?{thumb:s}:{}};try{const i=await e.callWS({type:V.Ve.save,image:d,...t.baseUpdatedAt&&!t.isNew?{base_updated_at:t.baseUpdatedAt}:{}});return a.api.invalidate([c]),{ok:!0,id:c,summary:i.image}}catch(e){return{ok:!1,reason:"conflict"===e?.code?"conflict":"failed"}}}(e,t);return r.ok?{...r,notice:n}:r}(t,{id:e.id,name:e.name,svg:e.svg,viewBox:e.viewBox,bindings:e.bindings,animation:e.animation,baseUpdatedAt:e.updatedAt,isNew:e.isNew},e=>this._confirm(e))}catch{i={ok:!1,reason:"failed"}}finally{this._saving=!1}i.ok?this._saved(e,i.id,"unknown"===i.notice.kind,i.summary?.updated_at):"cancelled"!==i.reason&&(this._reason=i.reason),this._closeAfterSave&&(this._closeAfterSave=!1,this._close())}_saved(e,t,i,n){this._unchecked=i,this._readLibrary();const a=this._opened??e;this._opened={...a,id:t,isNew:!1,updatedAt:n??a.updatedAt},this._clean=De(e),this._note="saved",this._announce(t)}disconnectedCallback(){this._preview?.release(),this._preview=void 0,super.disconnectedCallback()}updated(e){e.has("_phase")&&this.renderRoot.querySelector("h2")?.focus(),"ready"!==this._phase||this._svg||this._mountCanvas()}_mountCanvas(){const e=this.renderRoot.querySelector(".stage"),t=this._opened;if(!e||!t)return;e.innerHTML=t.svg;const i=e.querySelector("svg");i&&(this._svg=i,this._targets=B(this._svg),this._replay())}_replay(){this._preview?.release(),this._preview=void 0;const e=this._opened?.animation;this._svg&&this._kit&&e?.clips.length&&(this._preview=function(e,t,i,n){const a=t.clips.find(e=>e.id===i);if(!a)return ke;const r={v:1,clips:[{...a,play:{on:"always"}}]},o=n.play(e,r,{hass:void 0,host:e},n.compile);return{release:()=>o.release()}}(this._svg,e,this._clip(e)?.id??e.clips[0].id,this._kit))}_clip(e){return e?.clips.find(e=>e.id===this._clipId)??e?.clips[0]}_clipError(e){switch(e){case"name-empty":return k(42);case"name-too-long":return k(0);case"name-taken":return k(24);case"name-denied":return k(97);case"limit":return k(11);case"bad-play":return k(43);case"bad-timing":return k(84);case"direction-morph":return k(1);default:return k(88)}}_applyClips(e,t){if(!this._opened)return;if(!e.ok)return void(this._clipMessage=this._clipError(e.error));this._clipId=e.id,this._drafting="",this._commitClips(e.anim);const i=e.anim.clips.find(t=>t.id===e.id)?.name??"";this._clipMessage=k("added"===t?7:98,{name:i})}_commitClips(e){const t=this._opened;t&&(this._preview?.release(),this._preview=void 0,this._svg?.querySelector("[data-mc-picked]")?.removeAttribute("data-mc-picked"),this._opened={...t,animation:e,svg:this._svg?.outerHTML??t.svg},this._mark(this._target),this._replay())}_clipsPanel(){const e=this._opened?.animation,t=(t,i="updated")=>{e&&this._applyClips(t(e),i)};return{clips:e?.clips??[],selected:this._clip(e)?.id??"",drafting:this._drafting,message:this._clipMessage,select:e=>{this._clipId=e,this._drafting="",this._replay()},create:t=>this._applyClips(function(e,t){const i=se(e);if(i.clips.length>=16)return ne("limit");const n=re(i,t);if("string"==typeof n)return ne(n);const a=oe(i,n.name);return i.clips.push({id:a,name:n.name,play:{on:"always"},duration:2,easing:"ease-in-out",iterations:"infinite",tracks:[]}),{ok:!0,anim:i,id:a}}(e,t),"added"),rename:(e,i)=>t(t=>function(e,t,i){const n=se(e),a=n.clips.find(e=>e.id===t);if(!a)return ne("not-found");const r=re(n,i,t);return"string"==typeof r?ne(r):(a.name=r.name,{ok:!0,anim:n,id:t})}(t,e,i)),remove:t=>{if(!e)return;const i=e.clips.find(e=>e.id===t),n=new Set((i?.morphs??[]).map(e=>e.smil));this._svg?.querySelectorAll("animate").forEach(e=>{n.has(e.getAttribute("id")??"")&&e.remove()}),this._clipId="",this._drafting="",this._commitClips(function(e,t){const i=se(e);return i.clips=i.clips.filter(e=>e.id!==t),i.clips.length?i:void 0}(e,t)),this._clipMessage=k(34,{name:i?.name??""})},duplicate:e=>t(t=>function(e,t){const i=se(e),n=i.clips.findIndex(e=>e.id===t);if(n<0)return ne("not-found");if(i.clips.length>=16)return ne("limit");const a=i.clips[n];let r="";for(let e=2;!r;e+=1){const t=` ${e}`,n=`${[...a.name].slice(0,64-t.length).join("")}${t}`;"string"!=typeof re(i,n)&&(r=n)}const o={...JSON.parse(JSON.stringify(a)),id:oe(i,r),name:r};return delete o.morphs,i.clips.splice(n+1,0,o),{ok:!0,anim:i,id:o.id}}(t,e),"added"),move:(t,i)=>{e&&this._commitClips(function(e,t,i){const n=se(e),a=n.clips.findIndex(e=>e.id===t),r=a+i;if(a<0||r<0||r>=n.clips.length)return n;const[o]=n.clips.splice(a,1);return n.clips.splice(r,0,o),n}(e,t,i))},setTrigger:(e,i)=>{"state"!==i?(this._drafting="",t(t=>ce(t,e,{on:i}))):this._drafting=e},bindState:(e,i)=>{const n=function(e,t){const i=t.trim();return"on"===e||"off"===e?{entity_on:"on"===e}:"state"===e||"state_not"===e?le({[e]:i}):"above"!==e&&"below"!==e||""===i?void 0:le({[e]:Number(i)})}(i.kind,i.value);t(t=>n?ce(t,e,{on:"state",entity:i.entity,...i.attribute?{attribute:i.attribute}:{},when:n}):{ok:!1,error:"bad-play"})},setTiming:(e,i)=>t(t=>function(e,t,i,n){const a=se(e),r=a.clips.find(e=>e.id===i);if(!r)return ne("not-found");const o=n.direction??r.direction;if(r.morphs?.length&&void 0!==o&&"normal"!==o)return ne("direction-morph");const s=n.duration??r.duration,c=n.iterations??r.iterations,[d,p]=l.g7,[h,u]=l.ym;if(!("number"==typeof s&&s>=d&&s<=p))return ne("bad-timing");if("infinite"!==c&&!("number"==typeof c&&c>=h&&c<=u))return ne("bad-timing");const m=[];try{for(const e of r.morphs??[])m.push(Y({target:e.target,smil:e.smil,frames:e.frames,duration:s,iterations:c,delay:r.delay,resampled:!0}))}catch{return ne("bad-timing")}if(r.duration=s,r.iterations=c,void 0!==n.direction&&(r.direction=n.direction),m.length&&(r.morphs=m.map(e=>e.morph)),t)for(const e of m)de(t,e.morph.smil,e.attributes);return{ok:!0,anim:a,id:i}}(t,this._svg,e,i))}}_mark(e){this._svg?.querySelector("[data-mc-picked]")?.removeAttribute("data-mc-picked"),e.element&&e.element.setAttribute("data-mc-picked","")}_pick(e){e&&(this._target=e,this._mark(e),this._message="")}_onStageClick(e){this._svg&&this._pick(function(e,t){if(null===t||t===e)return{...T};if(((e,t)=>!!t&&t!==e&&e.contains(t)&&1===t.nodeType)(e,t)){for(let i=t;i&&i!==e;i=i.parentElement)if(C(e,i))return q(e,i,N(e));return{...T}}}(this._svg,e.target instanceof Element?e.target:null))}_pickRef(e){this._pick(this._targets.find(t=>t.ref===e))}_add(e){const t=this._opened,i=this._svg;if(!t||!i)return;const n=this._target;let a;try{a=function(e,t,i,n={}){const a=e?JSON.parse(JSON.stringify(e)):{v:1,clips:[]};a.clips.length||a.clips.push(O());const r=void 0===n.clipId?a.clips[0]:a.clips.find(e=>e.id===n.clipId);if(!r)throw new Error(`No clip ${n.clipId}`);let o,s;if("preset"===i){if(!n.presetId)throw new Error("A preset needs an id");o=w(n.presetId)}else"motion-path"===i?(s=function(e){const t=e?.trim().replace(/\s+/g," ");if(!t||!l.c2.test(t))throw new Error("A motion path needs path data");return t}(n.path),o=[{at:0},{at:100}]):o=D[i];if(!o.length)throw new Error("This effect has no keyframes");let c=r.tracks.find(e=>e.target===t.ref);if(!c){if(r.tracks.length>=24)throw new Error("This clip already has the most tracks it can hold");c={target:t.ref,keyframes:[]},r.tracks.push(c)}c.keyframes=function(e,t){const i=e.map(e=>({...e}));for(const e of t){const t=i.find(t=>t.at===e.at);t?Object.assign(t,JSON.parse(JSON.stringify(e))):i.push(JSON.parse(JSON.stringify(e)))}if(i.sort((e,t)=>e.at-t.at),i.length>40)throw new Error("Too many keyframes in one track");return i}(c.keyframes,o),void 0!==s&&(c.path={d:s});for(const e of L(o)){const t=e.toLowerCase();if(l.TH.some(e=>t.includes(e)))throw new Error("This effect holds text the animation cannot store")}return a}(t.animation,n,e,{presetId:this._presetId,path:this._path,clipId:this._clip(t.animation)?.id})}catch{return void(this._message=k("motion-path"===e?44:90))}this._preview?.release(),this._preview=void 0,this._svg?.querySelector("[data-mc-picked]")?.removeAttribute("data-mc-picked"),I(n)&&(this._targets=B(i),this._target=this._targets.find(e=>e.ref===n.ref)??n),this._opened={...t,animation:a,svg:i.outerHTML},this._mark(this._target),this._note="",this._message=k(8,{effect:ge(e),name:me(n)}),this._replay()}_paths(){return this._targets.filter(e=>"path"===e.element?.localName)}_addMorph(){const e=this._opened,t=this._svg,i=this._paths(),n=i.find(e=>e.ref===(this._morphFrom||i[0]?.ref)),a=i.find(e=>e.ref===(this._morphInto||i[1]?.ref)),r=a?.element?.getAttribute("d");if(!(e&&t&&n?.element&&r&&n!==a))return void(this._morphMessage=k(25));const o=n.element.getAttribute("id");try{I(n),this._preview?.release(),this._preview=void 0,t.querySelector("[data-mc-picked]")?.removeAttribute("data-mc-picked");const i=function(e,t,i){const n=i.path.getAttribute("id")??"",a=i.path.getAttribute("d")??"",r=e?JSON.parse(JSON.stringify(e)):{v:1,clips:[]};r.clips.length||r.clips.push(O());const o=r.clips.find(e=>e.id===i.clipId)??r.clips[0];if(void 0!==o.direction&&"normal"!==o.direction)throw new Error("A clip with a morph plays forwards only");let s;for(const e of r.clips){const t=e.morphs?.find(e=>e.target===n);t&&(s=t.smil,e.morphs=e.morphs?.filter(e=>e!==t),e.morphs?.length||delete e.morphs)}const l=new Set([...X(t),...r.clips.flatMap(e=>(e.morphs??[]).map(e=>e.smil))]);if(!s){let e=1;for(;l.has(`${K}${e}`);)e+=1;s=`${K}${e}`}const c=i.back?[{at:0,d:a},{at:50,d:i.into},{at:100,d:a}]:[{at:0,d:a},{at:100,d:i.into}],d=Y({target:n,smil:s,frames:c,duration:o.duration,iterations:o.iterations,delay:o.delay});if(r.clips.flatMap(e=>e.morphs??[]).length>=64)throw new Error("This image already has the most morphs it can hold");(o.morphs??=[]).push(d.morph);for(const e of Array.from(i.path.children))"animate"===e.localName&&e.remove();const p=i.path.ownerDocument.createElementNS("http://www.w3.org/2000/svg","animate");for(const[e,t]of Object.entries(d.attributes))p.setAttribute(e,t);return i.path.append(p),r}(e.animation,t,{path:n.element,into:r,back:this._morphBack,clipId:this._clip(e.animation)?.id});this._targets=B(t),this._opened={...e,animation:i,svg:t.outerHTML},this._morphMessage=k(8,{effect:k(58),name:me(n)})}catch{n.generated&&!o&&n.element.removeAttribute("id"),this._morphMessage=k(96)}this._mark(this._target),this._replay()}_morphPanel(){const e=this._paths();return{paths:e,from:this._morphFrom||e[0]?.ref||"",into:this._morphInto||e[1]?.ref||"",back:this._morphBack,message:this._morphMessage,setFrom:e=>this._morphFrom=e,setInto:e=>this._morphInto=e,setBack:e=>this._morphBack=e,add:()=>this._addMorph()}}_panel(){const e=this._svg;if(e)return{targets:this._targets,target:this._target,availability:R(e,this._target),presets:ue(),presetId:this._presetId,path:this._path,message:this._message,pick:e=>this._pickRef(e),add:e=>this._add(e),setPreset:e=>this._presetId=e,setPath:e=>this._path=e}}_onKey(e){if("Escape"===e.key)return e.stopPropagation(),void(this._leaving?this._keepEditing():this._ask?this._answer(!1):this._close());if("Tab"!==e.key)return;const t=[...((this._leaving||this._ask?this.renderRoot.querySelector(".confirm"):null)??this.renderRoot).querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(e=>!e.closest("[inert]"));if(!t.length)return;const i=this.shadowRoot?.activeElement,n=t[0],a=t[t.length-1],r=!t.includes(i);e.shiftKey&&(i===n||r)?(e.preventDefault(),a.focus()):e.shiftKey||i!==a&&!r||(e.preventDefault(),n.focus())}_problem(e){switch(e){case"missing":return k(94);case"too_large":return k(93);case"not_svg":return k(91);case"unsafe_markup":return k(89);case"needs_utils":return k(14);case"invalid_animation":return k(86);case"conflict":return k(95);default:return k(32)}}_body(){const e=this._opened;if("opening"===this._phase)return a.qy`<p role="status">${k(67)}</p>`;if("failed"===this._phase||!e)return a.qy`<p class="problem" role="alert">${this._problem(this._reason??"failed")}</p>`;const t=e.animation?.clips.length??0,i=this._panel();return a.qy`<div class="work">
        <div class="canvas">
          <div class="stage" role="group" aria-label=${e.name} @click=${this._onStageClick}></div>
          ${e.isNew?a.s6:a.qy`<div class="saved">
                <span>${k(16)}</span>
                <mc-svg-image .hass=${this.hass} .ref=${`mcu-image:${e.id}`} .description=${e.name}></mc-svg-image>
              </div>`}
        </div>
        <div class="side" ?inert=${this._saving||!!this._ask||!!this._leaving}>${i?a.qy`${n=i,a.qy`<section aria-labelledby="targets-title">
    <h3 id="targets-title">${k(68)}</h3>
    <p class="hint" id="targets-hint">${k(26)}</p>
    <ul class="targets" aria-describedby="targets-hint">
      ${n.targets.map(e=>a.qy`<li>
          <button type="button" class="target" aria-pressed=${e.ref===n.target.ref?"true":"false"} @click=${()=>n.pick(e.ref)}>${me(e)}</button>
        </li>`)}
    </ul>
  </section>`}${function(e){const t=e.availability["stroke-draw"];return a.qy`<section aria-labelledby="effects-title">
    <h3 id="effects-title">${k(3,{name:me(e.target)})}</h3>
    <div class="effects" role="group" aria-labelledby="effects-title">
      ${ve.map(t=>{const i=e.availability[t];return a.qy`<button
          type="button"
          class="btn btn-secondary"
          aria-disabled=${i.ok?"false":"true"}
          aria-describedby=${i.ok?a.s6:"no-stroke"}
          @click=${()=>i.ok&&e.add(t)}
        >
          ${fe(t)}
        </button>`})}
    </div>
    ${t.ok?a.s6:a.qy`<p class="hint" id="no-stroke">${k(66)}</p>`}
    <div class="ia-row">
      <label for="preset">${k(70)}</label>
      <select id="preset" .value=${e.presetId} @change=${t=>e.setPreset(t.target.value)}>
        ${e.presets.map(t=>a.qy`<option value=${t.id} ?selected=${t.id===e.presetId}>${t.name}</option>`)}
      </select>
      <button type="button" class="btn btn-secondary" ?disabled=${!e.presetId} @click=${()=>e.add("preset")}>${k(6)}</button>
    </div>
    <div class="ia-row">
      <label for="path">${k(69)}</label>
      <input id="path" type="text" inputmode="text" autocomplete="off" spellcheck="false" .value=${e.path} placeholder="M0 0 L50 20" @input=${t=>e.setPath(t.target.value)} />
      <button type="button" class="btn btn-secondary" @click=${()=>e.add("motion-path")}>${fe("motion-path")}</button>
    </div>
    <p class="status" role="status">${e.message}</p>
  </section>`}(i)}${function(e){const t=e.paths.length>=2&&e.from!==e.into;return a.qy`<section aria-labelledby="morph-title">
    <h3 id="morph-title">${k(59)}</h3>
    <p class="hint" id="morph-hint">${k(85)}</p>
    <div class="ia-row">
      <label for="morph-from">${k(78)}</label>
      <select id="morph-from" .value=${e.from} @change=${t=>e.setFrom(t.target.value)}>
        ${_e(e.paths,e.from)}
      </select>
    </div>
    <div class="ia-row">
      <label for="morph-into">${k(23)}</label>
      <select id="morph-into" .value=${e.into} @change=${t=>e.setInto(t.target.value)}>
        ${_e(e.paths,e.into)}
      </select>
    </div>
    <div class="ia-row">
      <label for="morph-back">${k(50)}</label>
      <input id="morph-back" type="checkbox" .checked=${e.back} @change=${t=>e.setBack(t.target.checked)} />
    </div>
    <div class="ia-row">
      <button type="button" class="btn btn-secondary" aria-disabled=${t?"false":"true"} aria-describedby=${t?"morph-hint":"morph-need"} @click=${()=>t&&e.add()}>
        ${k(5)}
      </button>
    </div>
    ${t?a.s6:a.qy`<p class="hint" id="morph-need">${k(25)}</p>`}
    <p class="status" role="status">${e.message}</p>
  </section>`}(this._morphPanel())}${function(e){const t=e.clips.findIndex(t=>t.id===e.selected),i=t<0?void 0:e.clips[t];return a.qy`<section aria-labelledby="clips-title">
    <h3 id="clips-title">${k(28)}</h3>
    <p class="hint">${k(63)}</p>
    <ul class="clip-list">
      ${e.clips.map(t=>a.qy`<li><button type="button" class="btn btn-secondary" aria-pressed=${t.id===e.selected?"true":"false"} @click=${()=>e.select(t.id)}>${t.name}</button></li>`)}
    </ul>
    ${i?function(e,t,i){const n="infinite"===t.iterations,r=e.drafting===t.id?"state":t.play.on,o=[["normal",k(48)],["reverse",k(20)],["alternate",k(18)],["alternate-reverse",k(19)]];return a.qy`<div class="clip-details" role="group" aria-labelledby="clip-name-label">
    <div class="ia-row">
      <label id="clip-name-label" for="clip-name">${k(27)}</label>
      <input id="clip-name" type="text" maxlength="64" .value=${t.name} @change=${i=>e.rename(t.id,i.target.value)} />
    </div>
    <div class="ia-row">
      <label for="clip-trigger">${k(80)}</label>
      <select id="clip-trigger" .value=${r} @change=${i=>e.setTrigger(t.id,i.target.value)}>
        ${["always","hover","tap","state"].map(e=>a.qy`<option value=${e} ?selected=${e===r}>${function(e){switch(e){case"hover":return k(52);case"tap":return k(83);case"state":return k(10);default:return k(9)}}(e)}</option>`)}
      </select>
    </div>
    ${"state"===r?function(e,t){const i=t.play,n=function(e){if("state"!==e.on)return"state";const t=e.when;return"state_not"in t?"state_not":"entity_on"in t?t.entity_on?"on":"off":"above"in t?"above":"below"in t?"below":"state"}(i),r=[["state",k(81)],["state_not",k(82)],["on",k(56)],["off",k(55)],["above",k(2)],["below",k(21)]];return a.qy`<div class="state-fields">
    <div class="ia-row">
      <label for="clip-entity">${k(45)}</label>
      <input id="clip-entity" name="entity" type="text" autocomplete="off" spellcheck="false" .value=${"state"===i.on?i.entity:""} />
    </div>
    <div class="ia-row">
      <label for="clip-attribute">${k(17)}</label>
      <input id="clip-attribute" name="attribute" type="text" autocomplete="off" spellcheck="false" .value=${"state"===i.on?i.attribute??"":""} />
    </div>
    <div class="ia-row">
      <label for="clip-condition">${k(31)}</label>
      <select id="clip-condition" name="kind" .value=${n}>
        ${r.map(([e,t])=>a.qy`<option value=${e} ?selected=${e===n}>${t}</option>`)}
      </select>
    </div>
    <div class="ia-row">
      <label for="clip-value">${k(102)}</label>
      <input id="clip-value" name="value" type="text" autocomplete="off" .value=${function(e){if("state"!==e.on)return"";const t=e.when;return"state"in t?t.state:"state_not"in t?t.state_not:"above"in t?String(t.above):"below"in t?String(t.below):""}(i)} />
    </div>
    <div class="ia-row">
      <button
        type="button"
        class="btn btn-secondary"
        @click=${i=>{const n=i.target.closest(".state-fields");n&&e.bindState(t.id,{entity:pe(n,"entity"),attribute:pe(n,"attribute"),kind:pe(n,"kind"),value:pe(n,"value")})}}
      >
        ${k(99)}
      </button>
    </div>
  </div>`}(e,t):a.s6}
    <div class="ia-row">
      <label for="clip-duration">${k(41)}</label>
      <input id="clip-duration" type="number" min="0.05" max="600" step="0.05" .value=${String(t.duration)} @change=${i=>e.setTiming(t.id,{duration:Number(i.target.value)})} />
    </div>
    <div class="ia-row">
      <label for="clip-forever">${k(71)}</label>
      <input id="clip-forever" type="checkbox" .checked=${n} @change=${i=>e.setTiming(t.id,{iterations:i.target.checked?"infinite":1})} />
    </div>
    ${n?a.s6:a.qy`<div class="ia-row">
          <label for="clip-repeats">${k(72)}</label>
          <input id="clip-repeats" type="number" min="0.01" max="1000" step="1" .value=${String(t.iterations)} @change=${i=>e.setTiming(t.id,{iterations:Number(i.target.value)})} />
        </div>`}
    <div class="ia-row">
      <label for="clip-direction">${k(35)}</label>
      <select id="clip-direction" .value=${t.direction??"normal"} @change=${i=>e.setTiming(t.id,{direction:i.target.value})}>
        ${o.map(([e,i])=>a.qy`<option value=${e} ?selected=${e===(t.direction??"normal")}>${i}</option>`)}
      </select>
    </div>
    <div class="ia-row">
      <button type="button" class="btn btn-secondary" ?disabled=${0===i} @click=${()=>e.move(t.id,-1)}>${k(62)}</button>
      <button type="button" class="btn btn-secondary" ?disabled=${i===e.clips.length-1} @click=${()=>e.move(t.id,1)}>${k(61)}</button>
      <button type="button" class="btn btn-secondary" @click=${()=>e.duplicate(t.id)}>${k(40)}</button>
      <button type="button" class="btn btn-secondary" @click=${()=>e.remove(t.id)}>${k(33)}</button>
    </div>
  </div>`}(e,i,t):a.s6}
    <form
      class="ia-row"
      @submit=${t=>{t.preventDefault();const i=t.target.querySelector("input");i&&(e.create(i.value),i.value="")}}
    >
      <label for="clip-new">${k(64)}</label>
      <input id="clip-new" type="text" maxlength="64" autocomplete="off" />
      <button type="submit" class="btn btn-secondary">${k(4)}</button>
    </form>
    <p class="status" role="status">${e.message}</p>
  </section>`}(this._clipsPanel())}`:a.s6}</div>
      </div>
      ${this._warnings(e)}
      <p>${t?k(106,{count:t}):k(92)}</p>`;var n}_heavyLine(e){switch(e.kind){case"targets":return k(105,{count:e.n,limit:e.limit});case"filters":return k(108,{count:e.n,limit:e.limit});case"morph-points":return k(107,{count:Math.round(e.n),limit:e.limit});default:return k(15,{size:Math.ceil(e.n/1024),limit:Math.round(e.limit/1024)})}}_warnings(e){const t=e.animation?function(e){const t=new Set,i=new Set;let n=0;for(const a of je(Ie(e)?e.clips:void 0))if(Ie(a)){for(const e of je(a.tracks))if(Ie(e)&&"string"==typeof e.target){t.add(e.target);for(const t of je(e.keyframes))!Ie(t)||void 0===t.filter&&void 0===t.blur||i.add(e.target)}for(const e of je(a.morphs))if(Ie(e))for(const t of je(e.frames))Ie(t)&&"string"==typeof t.d&&(n+=t.d.match(Be)?.length??0)}const a=n/2;let r;try{r=(new TextEncoder).encode(JSON.stringify(e)??"").length}catch{r=0}const o=[];return t.size>150&&o.push({kind:"targets",n:t.size,limit:150}),i.size>8&&o.push({kind:"filters",n:i.size,limit:8}),a>2e4&&o.push({kind:"morph-points",n:a,limit:2e4}),r>524288&&o.push({kind:"anim-bytes",n:r,limit:524288}),o}(e.animation):[];return t.length||this._libraryBytes?a.qy`<div class="warnings">
      ${t.length?a.qy`<p role="status">${k(87)}</p>
            <ul>${t.map(e=>a.qy`<li>${this._heavyLine(e)}</li>`)}</ul>`:a.s6}
      ${this._libraryBytes?a.qy`<p role="status">${k(104)}</p>`:a.s6}
    </div>`:a.s6}_confirmBox(){const e=this._ask?.notice;if(!e||"used"!==e.kind&&"at-least"!==e.kind)return a.s6;const t="used"===e.kind?k(101,{count:e.count}):k(100,{count:e.count});return a.qy`<div class="confirm" role="alertdialog" aria-labelledby="used-text">
      <p id="used-text">${t}</p>
      <button class="btn btn-secondary" type="button" @click=${()=>this._answer(!1)}>${k(22)}</button>
      <button class="btn btn-primary" type="button" @click=${()=>this._answer(!0)}>${k(73)}</button>
    </div>`}_leaveBox(){if(!this._leaving)return a.s6;const e=this._opened?.isNew?k(38):k(37);return a.qy`<div class="confirm leave" role="alertdialog" aria-labelledby="leave-text">
      <p id="leave-text">${e}</p>
      <button class="btn btn-secondary" type="button" @click=${this._keepEditing}>${k(57)}</button>
      <button class="btn btn-danger" type="button" @click=${this._discard}>${k(36)}</button>
    </div>`}_status(){return this._saving&&this._closeAfterSave?a.qy`<p class="status" role="status">${k(77)}</p>`:this._saving?a.qy`<p class="status" role="status">${k(76)}</p>`:this._reason&&"ready"===this._phase?a.qy`<p class="status problem" role="alert">${this._problem(this._reason)}</p>`:this._opened&&!this._opened.canSave?a.qy`<p class="status" role="status">${this._problem("needs_utils")}</p>`:"saved"===this._note&&this._unchecked?a.qy`<p class="status" role="status">${k(75)}</p>`:"saved"===this._note?a.qy`<p class="status" role="status">${k(74)}</p>`:this._opened?.isNew?a.qy`<p class="status" role="status">${k(65,{name:this._opened.name})}</p>`:a.qy`<p class="status" role="status"></p>`}render(){const e=this._opened;return a.qy`<div class="backdrop" @click=${this._close} aria-hidden="true"></div>
      <div class="window" role="dialog" aria-modal="true" aria-labelledby="title" @keydown=${this._onKey}>
        <header>
          <h2 id="title" tabindex="-1">${e?k(13,{name:e.name}):k(12)}</h2>
          <button class="btn btn-secondary" type="button" @click=${this._close}>${k(29)}</button>
        </header>
        <div class="body">${this._body()}</div>
        ${this._confirmBox()} ${this._leaveBox()}
        <footer>
          ${this._status()}
          <button class="btn btn-primary" type="button" ?disabled=${!e?.canSave||this._saving||!!this._ask||!!this._leaving} @click=${this._save}>${k(73)}</button>
        </footer>
      </div>`}}Le.styles=[o.x,s.uE,ze],Oe([(0,r.MZ)({attribute:!1})],Le.prototype,"hass",void 0),Oe([(0,r.MZ)({attribute:!1})],Le.prototype,"source",void 0),Oe([(0,r.wk)()],Le.prototype,"_phase",void 0),Oe([(0,r.wk)()],Le.prototype,"_opened",void 0),Oe([(0,r.wk)()],Le.prototype,"_reason",void 0),Oe([(0,r.wk)()],Le.prototype,"_saving",void 0),Oe([(0,r.wk)()],Le.prototype,"_ask",void 0),Oe([(0,r.wk)()],Le.prototype,"_libraryBytes",void 0),Oe([(0,r.wk)()],Le.prototype,"_unchecked",void 0),Oe([(0,r.wk)()],Le.prototype,"_note",void 0),Oe([(0,r.wk)()],Le.prototype,"_leaving",void 0),Oe([(0,r.wk)()],Le.prototype,"_closeAfterSave",void 0),Oe([(0,r.wk)()],Le.prototype,"_target",void 0),Oe([(0,r.wk)()],Le.prototype,"_targets",void 0),Oe([(0,r.wk)()],Le.prototype,"_presetId",void 0),Oe([(0,r.wk)()],Le.prototype,"_path",void 0),Oe([(0,r.wk)()],Le.prototype,"_message",void 0),Oe([(0,r.wk)()],Le.prototype,"_morphFrom",void 0),Oe([(0,r.wk)()],Le.prototype,"_morphInto",void 0),Oe([(0,r.wk)()],Le.prototype,"_morphBack",void 0),Oe([(0,r.wk)()],Le.prototype,"_morphMessage",void 0),Oe([(0,r.wk)()],Le.prototype,"_clipId",void 0),Oe([(0,r.wk)()],Le.prototype,"_drafting",void 0),Oe([(0,r.wk)()],Le.prototype,"_clipMessage",void 0);const Fe="2026.11.03-beta.1";function Re(){customElements.get(n.hW)||customElements.define(n.hW,Le)}const Ve=async(e,t)=>{if(!e.hass)return!1;Re();const i=document.createElement(n.hW);i.hass=e.hass,i.source=t,i.opener=e;const a=e.getRootNode(),r=a instanceof ShadowRoot?a:document.body;return i.addEventListener("close",()=>{i.remove(),e.focus?.()}),r.appendChild(i),await i.updateComplete,!0},Pe={version:"1.0.0",openImageAnimator:Ve,countImageUse:async function(e,t){return(await qe(e,t)).count}}},2254(e,t,i){i.d(t,{Dd:()=>l,R3:()=>s,Uh:()=>c});var n=i(8518),a=i(4973),r=i(2873);const o=(0,a.Ev)("image-anim",()=>i.e(800).then(()=>i(3852)));function s(){return o.load().then(e=>e?o.module():void 0)}function l(){return(0,n.BR)().then(e=>e?.compileTracks)}function c(e){const t=e?.clips;return Array.isArray(t)&&t.some(e=>Array.isArray(e?.tracks)&&e.tracks.length>0)}i.d(t,["GV",0,()=>r.tQ.pause.load()])}};