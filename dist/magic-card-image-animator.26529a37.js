"use strict";export const __webpack_esm_ids__=[6892];export const __webpack_esm_modules__={7602(e,t,i){const n=String.raw`[ \t\n\r\f]`;i.d(t,["Lf",0,/^(?:linear|cubic-bezier\((?: ?(?:0(?:\.\d{1,6})?|1(?:\.0{1,6})?|\.\d{1,6}) ?,){3} ?(?:0(?:\.\d{1,6})?|1(?:\.0{1,6})?|\.\d{1,6}) ?\))$/,"TH",0,["<!doctype","<!entity","<?","<![cdata[","url(","@","{","}",";","<",">"],"Z8",0,/^[a-z0-9](?:[a-z0-9-]{0,47})$/,"ZI",0,n,"c2",0,/^[MmLlHhVvCcSsQqTtAaZz0-9.,+\-eE ]+$/,"g7",0,[.05,600],"ym",0,[.01,1e3]])},7087(e,t,i){i.d(t,["D7",0,"mc-image-animator-saved","hW",0,"mc-image-animator"])},1471(e,t,i){i.d(t,["BO",0,"mc-image-reference:","Nu",0,8388608,"Q1",0,/^[a-z0-9](?:[a-z0-9-]{0,47})$/,"QO",0,2097152,"W5",0,["--primary-color","--accent-color","--primary-text-color","--secondary-text-color","--disabled-text-color","--card-background-color","--primary-background-color","--secondary-background-color","--divider-color","--state-icon-color","--error-color","--warning-color","--success-color","--info-color"],"YL",0,[{ratio:"1:1",width:1024,height:1024},{ratio:"4:3",width:1280,height:960},{ratio:"16:9",width:1920,height:1080},{ratio:"9:16",width:1080,height:1920}],"ZG",0,52428800,"aw",0,["image/png","image/jpeg","image/webp","image/gif","image/avif","image/bmp"],"gY",0,67108864,"rx",0,"mc-part"])},760(e,t,i){const n=1048576;i.d(t,["$o",0,n,"HD",0,/^data:image\/(png|webp);base64,[A-Za-z0-9+/]+={0,2}$/,"Lf",0,/^(#[0-9a-fA-F]{3,8}|theme:[a-z0-9][a-z0-9-]{0,63}|main|accent|entity)$/,"Rt",0,e=>{const t=e?.caps?.image_max_bytes;return"number"==typeof t&&Number.isInteger(t)&&t>0&&t<=n?t:262144},"Ve",0,{list:"magic_card_utils/images_list",get:"magic_card_utils/images_get",save:"magic_card_utils/images_save",remove:"magic_card_utils/images_delete"}])},1342(e,t,i){i.d(t,["$o",0,1048576,"LY",0,18e5,"Lc",0,["sans-serif","serif","monospace","system-ui"],"UN",0,/^mcu-image:([a-z0-9][a-z0-9_-]{0,63})$/,"WX",0,["d","cx","cy","r","rx","ry","x","y","x1","y1","x2","y2","dx","dy","fx","fy","fr","width","height","points","fill","stroke","stroke-width","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-dasharray","stroke-dashoffset","opacity","fill-opacity","stroke-opacity","transform","viewBox","id","class","offset","stop-color","stop-opacity","gradientUnits","gradientTransform","spreadMethod","clip-path","clipPathUnits","mask","maskUnits","maskContentUnits","fill-rule","clip-rule","paint-order","vector-effect","visibility","font-size","font-family","font-weight","font-style","text-anchor","dominant-baseline","letter-spacing","preserveAspectRatio","data-name"],"_9",0,["svg","g","path","circle","ellipse","rect","line","polyline","polygon","defs","linearGradient","radialGradient","stop","clipPath","mask","title","text","tspan"],"eX",0,/^[A-Za-z][\w.-]{0,63}$/,"mT",0,/^--[a-z0-9][a-z0-9-]{0,63}$/,"t4",0,"mcu-image:","xL",0,["<!doctype","<!entity","<?","<![cdata["]])},1722(e,t,i){function n(e){const t=e.replace(/[\t\n\r\f]/g," "),i=[],n=/([MmLlHhVvCcSsQqTtAaZz])|[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[ ,]+/y;for(;n.lastIndex<t.length;){const e=n.exec(t);if(!e)return;if(e[1])i.push(e[1],"0");else{if(/^[ ,]/.test(e[0]))continue;if(!i.length)return;i[i.length-1]=String(Number(i[i.length-1])+1)}}return i.length?i.join(" "):void 0}i.d(t,{B:()=>n,M:()=>r});const a=e=>32===e||9===e||10===e||13===e||12===e;function r(e){let t=0,i=e.length;for(;t<i&&a(e.charCodeAt(t));)t++;for(;i>t&&a(e.charCodeAt(i-1));)i--;return e.slice(t,i)}},1081(e,t,i){i.d(t,["KE",0,{attributeName:"d",begin:"indefinite"},"Mk",0,"animate","Vz",0,["id","attributeName","values","dur","begin"],"bQ",0,/^(?:\d{1,6}(?:\.\d{1,6})?|\.\d{1,6})(?:s|ms)$/,"mW",0,/^[0-9. ;]+$/,"of",0,["linear","spline"],"pb",0,/^(?:indefinite|\d{1,6}(?:\.\d{1,6})?|\.\d{1,6})$/,"vc",0,["id","attributeName","values","dur","repeatCount","keyTimes","keySplines","calcMode","fill","begin"],"yC",0,["freeze","remove"]])},2916(e,t,i){i.d(t,{I:()=>c});var n=i(1342),a=i(7602);const r=n.$o,o=/^[A-Za-z0-9_-]{1,64}$/,s=e=>String(+e.toFixed(4));function l(e){if("string"!=typeof e||!e||e.length>r)return;const t=e.replace(/[ \t\n\r\f]+/g," ").replace(/^ | $/g,"");return a.c2.test(t)?t:void 0}function c(e,t,i){const{duration:r,iterations:c}=t,d=t.delay??0,p="infinite"===c?"infinite":"number"==typeof c&&Number.isFinite(c)&&c>0?s(c):"";if(!o.test(i)||!Number.isFinite(r)||r<=0||!Number.isFinite(d)||d<0||!p)return"";const h=[];return e.forEach((e,t)=>{if("string"!=typeof e.target||!n.eX.test(e.target)||!Array.isArray(e.frames)||e.frames.length<2)return;const o=[];for(const t of e.frames){const e=l(t.d),i=void 0===t.easing?"":a.Lf.test(t.easing)?`animation-timing-function:${t.easing};`:void 0;if(!e||void 0===i||"number"!=typeof t.at||!(t.at>=0&&t.at<=100))return;o.push(`${s(t.at)}%{d:path("${e}");${i}}`)}const u=`mcm-${i}-${t}`;h.push(`@keyframes ${u}{${o.join("")}}`,`svg[data-mc-ia="${i}"] [id="${e.target}"]{animation:${u} ${s(r)}s linear ${s(d)}s ${p}${"infinite"===c?"":" forwards"};}`)}),h.join("\n")}},9333(e,t,i){i.r(t),i.d(t,{BUILD:()=>Qe,api:()=>tt,install:()=>Xe,openImageAnimator:()=>et});var n=i(7087),a=i(6161),r=i(5707),o=i(2564),s=i(158),l=i(515),c=i(568),d=i(4059),p=i(1252),h=i(7602),u=i(1081),m=i(1342),f=i(2916),g=i(1722),b=i(201),v=i(1437),y=i(4802);function w(e){const t=e.replace(/calc\(/g,"(").replace(/(\d)(px|deg|%)/g,"$1");let i=0;const n=()=>{for(;" "===t[i];)i++;return t[i]},a=()=>{const r=n();if("("===r){i++;const t=o();if(")"!==n())throw new Error(`Expected ) in "${e}"`);return i++,t}if("-"===r||"+"===r){i++;const e=a();return"-"===r?-e:e}const s=/^\d*\.?\d+(?:e[-+]?\d+)?/i.exec(t.slice(i));if(!s)throw new Error(`Not a number in "${e}"`);return i+=s[0].length,Number(s[0])},r=()=>{let e=a();for(let t=n();"*"===t||"/"===t;t=n()){i++;const n=a();e="*"===t?e*n:e/n}return e},o=()=>{let e=r();for(let t=n();"+"===t||"-"===t;t=n()){i++;const n=r();e="+"===t?e+n:e-n}return e},s=o();if(void 0!==n())throw new Error(`Unexpected "${t.slice(i)}" in "${e}"`);return+s.toFixed(4)}function _(e){const t=[];let i=0,n="";for(const a of e.trim())"("===a&&i++,")"===a&&i--," "===a&&0===i?(n&&t.push(n),n=""):n+=a;return n&&t.push(n),t}i(3920);const k={x:[1,0,0],y:[0,1,0]};function $(e,t,i,n){const a=e.transform??={};switch(t){case"translate":{const[e,t="0"]=_(i);return a.x=w(e),void(a.y=w(t))}case"scale":{const e=_(i).map(w);return void(1===e.length?a.scale=e[0]:(a.scale_x=e[0],a.scale_y=e[1]))}case"rotate":{const e=_(i);return a.rotate=w(e[e.length-1]),void(2===e.length&&k[e[0]]?a.axis=k[e[0]]:4===e.length&&(a.axis=[w(e[0]),w(e[1]),w(e[2])]))}case"opacity":return void(e.opacity=w(i));case"filter":return void(e.filter=i);case"box-shadow":return void(e.shadow=i)}throw new Error(`Preset ${n}: cannot convert "${t}"`)}function x(e){const t=(0,y.fi)(e);if(void 0===t)throw new Error(`Preset ${e} has no keyframes`);const i=new Map;for(const n of(0,y.Gt)(t))for(const t of n.offsets){const a=i.get(t)??{at:t};for(const[t,i]of n.decls)$(a,t,i,e);i.set(t,a)}return[...i.values()].map(e=>e.transform&&!Object.keys(e.transform).length?(({transform:e,...t})=>t)(e):e).sort((e,t)=>e.at-t.at)}var A=i(4753);const{t:S,tx:z,m:E,locale:q}=(0,A.my)("image-animator",["A clip name can be 64 characters at most.|A clip with a morph can only play forwards.|Above|Add an effect to {name}|Add clip|Add morph|Add preset|Added the clip {name}.|Added {effect} to {name}.|Always|An entity reaches a state|An image can hold 16 clips at most.|Animate image|Animate {name}|Animating needs a newer Magic Card Utils. Update it and try again.|Animation data of {size} KiB, over the limit of {limit} KiB|As saved|Attribute (optional)|Back and forth|Back and forth, starting backwards|Backwards|Below|Cancel|Changes into|Choose a name that no other clip has.|Choose two different shapes to morph.|Click a part of the drawing, or choose it from this list.|Clip name|Clips|Close|Close settings|Colour|Condition|Could not reach Magic Card Utils. Your work is safe.|Delete|Deleted the clip {name}.|Direction|Discard|Discard the changes you have not saved?|Discard this image and your changes? It is not in the library yet.|Draw the outline|Duplicate|Duration (seconds)|Enter a name for the clip.|Enter an entity id such as cover.garage and a condition that fits.|Enter path data, for example M0 0 L50 20.|Entity|Fade|Follow a path|Forwards|Glow|Go back to the first shape|Group {id}|Hovering over the image|Idle|Image|Is off|Is on|Keep editing|Keep settings open|Modified only|Morph|Morph one shape into another|Move and turn|Move down|Move up|Name each animation and choose what starts it.|New clip name|Not in the library yet. Save adds it as {name}.|Nothing here differs from the default|Nothing here has an outline to draw.|Opening the image…|Parts of the image|Path data|Preset|Repeat forever|Repeats|Save|Saved.|Saved. Magic Card could not check where this image is used.|Saving…|Saving… The window closes when it is done.|Settings|Shape that changes|Shape {id}|Starts when|State is|State is not|Tapping the image|The duration or the number of repeats is out of range.|The first shape changes into the second. They do not need the same number of points.|The saved animation of this image is not valid, so the image cannot be animated here.|This animation is heavy and may run slowly on older devices. You can still save it.|This change could not be made.|This drawing contains markup that cannot be used.|This effect could not be added to the animation.|This file is not an SVG drawing.|This image has no animations yet.|This image is larger than the library accepts.|This image is not in the library any more.|This image was changed somewhere else. Close this window and open it again.|This morph could not be added.|This name cannot be used.|Updated the clip {name}.|Use this trigger|Used on at least {count, plural, one {# card} other {# cards}}. Magic Card could not check every dashboard. Saving changes how the image looks there.|Used on {count, plural, one {# card} other {# cards}}. Saving changes how the image looks there.|Value|Whole image|Your image library is over 50 MiB. A large library can slow down older devices. You can still save.|Zoom|{count, plural, one {# animated shape} other {# animated shapes}}, over the limit of {limit}|{count, plural, one {# animation} other {# animations}}|{count, plural, one {# morph point} other {# morph points}}, over the limit of {limit}|{count, plural, one {# shape with a blur or colour filter} other {# shapes with a blur or colour filter}}, over the limit of {limit}","|||||||||||||||||||||||||||||||Color|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||{count, plural, one {# shape with a blur or color filter} other {# shapes with a blur or color filter}}, over the limit of {limit}","Een naam mag hoogstens 64 tekens hebben.|Een animatie met een overgang kan alleen vooruit spelen.|Boven|Effect toevoegen aan {name}|Animatie toevoegen|Overgang toevoegen|Voorinstelling toevoegen|De animatie {name} is toegevoegd.|{effect} toegevoegd aan {name}.|Altijd|Een entiteit bereikt een status|Een afbeelding kan hoogstens 16 animaties hebben.|Afbeelding animeren|{name} animeren|Animeren vraagt een nieuwere Magic Card Utils. Werk die bij en probeer het opnieuw.|Animatiegegevens van {size} KiB, meer dan de grens van {limit} KiB|Zoals opgeslagen|Attribuut (optioneel)|Heen en weer|Heen en weer, beginnend achteruit|Achteruit|Onder|Annuleren|Verandert in|Kies een naam die nog niet in gebruik is.|Kies twee verschillende vormen voor de overgang.|Klik op een onderdeel van de tekening of kies het in deze lijst.|Naam van de animatie|Animaties|Sluiten|Instellingen sluiten|Kleur|Voorwaarde|Magic Card Utils is niet bereikbaar. Je werk is veilig.|Verwijderen|De animatie {name} is verwijderd.|Richting|Weggooien|Wijzigingen die niet zijn opgeslagen weggooien?|Deze afbeelding en je wijzigingen weggooien? Ze staat nog niet in de bibliotheek.|Contour tekenen|Dupliceren|Duur (seconden)|Geef de animatie een naam.|Geef een entiteit op, zoals cover.garage, en een passende voorwaarde.|Voer padgegevens in, bijvoorbeeld M0 0 L50 20.|Entiteit|Vervagen|Een pad volgen|Vooruit|Gloed|Terug naar de eerste vorm|Groep {id}|Aanwijzen van de afbeelding|Rust|Afbeelding|Staat uit|Staat aan|Verder bewerken|Instellingen openhouden|Alleen gewijzigd|Overgang|Een vorm in een andere laten overgaan|Verplaatsen en draaien|Omlaag|Omhoog|Geef elke animatie een naam en kies wat hem start.|Naam van de nieuwe animatie|Nog niet in de bibliotheek. Opslaan voegt het toe als {name}.|Niets wijkt hier af van de standaard|Hier is geen contour om te tekenen.|De afbeelding wordt geopend…|Onderdelen van de afbeelding|Padgegevens|Voorinstelling|Eindeloos herhalen|Herhalingen|Opslaan|Opgeslagen.|Opgeslagen. Magic Card kon niet controleren waar deze afbeelding wordt gebruikt.|Bezig met opslaan…|Bezig met opslaan… Het venster sluit zodra dat klaar is.|Instellingen|Vorm die verandert|Vorm {id}|Start bij|Status is|Status is niet|Tikken op de afbeelding|De duur of het aantal herhalingen valt buiten het bereik.|De eerste vorm gaat over in de tweede. Ze hoeven niet evenveel punten te hebben.|De opgeslagen animatie van deze afbeelding is niet geldig, dus je kunt hem hier niet animeren.|Deze animatie is zwaar en kan op oudere apparaten langzaam draaien. Je kunt hem nog steeds opslaan.|Deze wijziging kon niet worden doorgevoerd.|Deze tekening bevat opmaak die niet gebruikt kan worden.|Dit effect kon niet aan de animatie worden toegevoegd.|Dit bestand is geen SVG-tekening.|Deze afbeelding heeft nog geen animaties.|Deze afbeelding is groter dan de bibliotheek accepteert.|Deze afbeelding staat niet meer in de bibliotheek.|Deze afbeelding is elders gewijzigd. Sluit dit venster en open het opnieuw.|Deze overgang kon niet worden toegevoegd.|Deze naam kan niet worden gebruikt.|De animatie {name} is bijgewerkt.|Deze start gebruiken|Gebruikt op minstens {count, plural, one {# kaart} other {# kaarten}}. Magic Card kon niet controleren of alle dashboards gelezen zijn. Opslaan verandert hoe de afbeelding daar eruitziet.|Gebruikt op {count, plural, one {# kaart} other {# kaarten}}. Opslaan verandert hoe de afbeelding daar eruitziet.|Waarde|Hele afbeelding|Je afbeeldingenbibliotheek is groter dan 50 MiB. Een grote bibliotheek kan oudere apparaten vertragen. Je kunt nog steeds opslaan.||{count, plural, one {# geanimeerde vorm} other {# geanimeerde vormen}}, meer dan de grens van {limit}|{count, plural, one {# animatie} other {# animaties}}|{count, plural, one {# morphpunt} other {# morphpunten}}, meer dan de grens van {limit}|{count, plural, one {# vorm met een vervagings- of kleurfilter} other {# vormen met een vervagings- of kleurfilter}}, meer dan de grens van {limit}"]),M=new Set(["g","path","rect","circle","ellipse","line","polyline","polygon","text","use","image"]),N=new Set(["defs","clippath","mask","symbol","pattern","marker","lineargradient","radialgradient","filter","metadata","title","desc"]),C=new WeakMap,T=e=>e.localName.toLowerCase(),O=(e,t)=>{if(!M.has(T(t)))return!1;for(let i=t.parentElement;i&&i!==e;i=i.parentElement)if(N.has(T(i)))return!1;return!0},B=e=>{const t=new Map;for(const i of e.querySelectorAll("[id]")){const e=i.getAttribute("id")??"";t.has(e)||t.set(e,i)}return{first:t,next:1}};function D(e,t,i){const n="g"===T(t)?"group":"element",a=((e,t)=>{const i=t.getAttribute("id");return i&&m.eX.test(i)&&e.first.get(i)===t?i:void 0})(i,t);if(a)return{ref:`part:${a}`,kind:n,id:a,generated:!1,element:t};let r=C.get(e);r||C.set(e,r=new Map);let o=r.get(t);if(!o){const n=i.used??=((e,t)=>{const i=new Set(t.first.keys());for(const t of C.get(e)?.values()??[])i.add(t);return i})(e,i);for(;n.has(`mc-${i.next}`);)i.next+=1;o=`mc-${i.next}`,n.add(o),r.set(t,o)}return{ref:`part:${o}`,kind:n,id:o,generated:!0,element:t}}const I={ref:"element",kind:"image",generated:!1};function j(e){const t=[{...I}],i=B(e);for(const n of e.querySelectorAll("*"))O(e,n)&&t.push(D(e,n,i));return t}function L(e){return!!(e.generated&&e.element&&e.id)&&(e.element.setAttribute("id",e.id),!0)}const R=["transform","opacity","colour","filter","stroke-draw","motion-path","preset"],F=()=>({id:"idle",name:S(54),play:{on:"always"},duration:2,easing:"ease-in-out",iterations:"infinite",tracks:[]}),P={transform:[{at:0,transform:{rotate:0,scale:1}},{at:50,transform:{rotate:12,scale:1.1}},{at:100,transform:{rotate:0,scale:1}}],opacity:[{at:0,opacity:1},{at:50,opacity:.3},{at:100,opacity:1}],colour:[{at:0,color:"#e53935"},{at:50,color:"#fdd835"},{at:100,color:"#e53935"}],filter:[{at:0,filter:"brightness(1)"},{at:50,filter:"brightness(1.6)"},{at:100,filter:"brightness(1)"}],"stroke-draw":[{at:0,draw:0},{at:70,draw:1},{at:100,draw:1}]},K=(e,t=[])=>("string"==typeof e?t.push(e):Array.isArray(e)?e.forEach(e=>K(e,t)):e&&"object"==typeof e&&Object.values(e).forEach(e=>K(e,t)),t),V=e=>{const t=e.getAttribute("stroke")??/(?:^|;)\s*stroke\s*:\s*([^;]+)/.exec(e.getAttribute("style")??"")?.[1];return!!t&&"none"!==t.trim()};function W(e,t){const i=Object.fromEntries(R.map(e=>[e,{ok:!0}])),n=function(e,t){return"element"===t.ref?e:t.element&&e.contains(t.element)?t.element:Array.from(e.querySelectorAll("[id]")).find(e=>e.getAttribute("id")===t.id)}(e,t);let a=!n;if(n){a=V(n)||Array.from(n.querySelectorAll("*")).some(V);for(let e=n.parentElement;e&&!a;e=e.parentElement)a=V(e)}return a||(i["stroke-draw"]={ok:!1,reason:"no-stroke"}),i}var U=i(760),H=i(1771);const J=Math.floor(U.$o/5);function Z(e){const t=e.segs.reduce((e,t)=>e+(t.c1?4:1),0);return{pts:(0,H.Bq)(e,16),closed:e.closed,weight:t}}function G(e){const t=(0,H.Rr)(function(e){const t="string"==typeof e&&e.length<=262144?e.replace(/\s+/g," ").trim():"";if(!t||!h.c2.test(t))throw new Error("Not path data");return t}(e)).map(Z);if(!t.length||t.length>256)throw new Error("No usable subpaths");return t}function Y(e,t,i,n){let a=n;for(;a<e.length-2&&t[a+1]<i;)a+=1;const r=t[a+1]-t[a],o=r>0?Math.min(1,Math.max(0,(i-t[a])/r)):0,s=e[a],l=e[a+1];return{p:[s[0]+(l[0]-s[0])*o,s[1]+(l[1]-s[1])*o],at:a}}const Q=e=>{if(!Number.isFinite(e))throw new Error("Not a finite number");const t=Math.round(100*e)/100;return String(0===t?0:t)},X="0 0 1 1",ee="mc-morph-",te=(e,t=4)=>String(+e.toFixed(t));function ie(e){const{target:t,smil:i,duration:n,iterations:a}=e;if(!m.eX.test(t)||!m.eX.test(i))throw new Error("A morph needs ids");!function(e){if(e.length<2||e.length>32)throw new Error("A morph needs 2 to 32 frames");e.forEach((t,i)=>{if("number"!=typeof t.at||!Number.isFinite(t.at))throw new Error("A frame needs a position");if(0===i?0!==t.at:t.at<=e[i-1].at)throw new Error("Frames must rise from 0");if(i===e.length-1&&100!==t.at)throw new Error("The last frame is at 100");if(void 0!==t.easing&&!h.Lf.test(t.easing))throw new Error("A morph eases linearly or with a cubic-bezier")})}(e.frames),function(e,t){const[i,n]=h.g7,[a,r]=h.ym;if(!(e>=i&&e<=n))throw new Error("The duration is out of range");if("infinite"!==t&&!(t>=a&&t<=r))throw new Error("The iteration count is out of range")}(n,a);const r=e.frames.map(e=>+e.at.toFixed(2));if(r.some((e,t)=>t>0&&e<=r[t-1]))throw new Error("Frames are too close together");const o=e.resampled?e.frames.map(e=>e.d):function(e){const t=e.map(G),i=Math.max(...t.map(e=>e.length)),n=Array.from({length:i},(e,i)=>{const n=t.filter(e=>e[i]).map(e=>e[i]);return{points:Math.max(3,...n.map(e=>e.weight)),closed:n.every(e=>e.closed)}});if(n.reduce((e,t)=>e+t.points,0)*t.length>J)throw new Error("Too many points to morph");return t.map(e=>n.map((t,i)=>function(e,t){const[i,...n]=e;return`M${Q(i[0])} ${Q(i[1])}${n.map(e=>` L${Q(e[0])} ${Q(e[1])}`).join("")}${t?" Z":""}`}(function(e,t,i){const n=e.closed?[...e.pts,e.pts[0]]:e.pts;if(n.length<2)return Array.from({length:t},()=>n[0]);const a=[0];for(let e=1;e<n.length;e++)a.push(a[e-1]+Math.hypot(n[e][0]-n[e-1][0],n[e][1]-n[e-1][1]));const r=a[a.length-1],o=[];let s=0;for(let e=0;e<t;e++){const l=Y(n,a,i?r*e/t:r*e/(t-1),s);s=l.at,o.push(l.p)}return o}(e[i]??function(e){const t=e.flatMap(e=>e.pts),i=t.map(e=>e[0]),n=t.map(e=>e[1]);return{pts:[[(Math.min(...i)+Math.max(...i))/2,(Math.min(...n)+Math.max(...n))/2]],closed:!0,weight:0}}(e),t.points,t.closed),t.closed)).join(" "))}(e.frames.map(e=>e.d)),s=e.frames.length-1,l=e.frames.map((e,t)=>t<s&&void 0!==e.easing?{at:r[t],d:o[t],easing:e.easing}:{at:r[t],d:o[t]}),c=(0,g.B)(l[0].d);if(!c||l.some(e=>!h.c2.test(e.d)||(0,g.B)(e.d)!==c))throw new Error("The frames do not share one structure");const d={target:t,smil:i,frames:l},p=l.slice(0,s).map(e=>function(e){if(void 0===e)return X;if(!h.Lf.test(e))throw new Error("A morph eases linearly or with a cubic-bezier");return"linear"===e?X:e.slice(e.indexOf("(")+1,-1).split(",").map(e=>te(Number(e),6)).join(" ")}(e.easing)),b=p.some(e=>e!==X),v={id:i,attributeName:"d",values:l.map(e=>e.d).join(";"),dur:`${te(n)}s`,repeatCount:"infinite"===a?"indefinite":te(a),keyTimes:r.map(e=>te(e/100)).join(";"),begin:"indefinite"};if(b&&(v.calcMode="spline",v.keySplines=p.join(";")),"infinite"!==a&&(v.fill="freeze"),!u.bQ.test(v.dur)||!u.pb.test(v.repeatCount))throw new Error("The timing cannot be written");if(!u.mW.test(v.keyTimes)||v.keySplines&&!u.mW.test(v.keySplines))throw new Error("The timing cannot be written");if([t,i,...l.flatMap(e=>[e.d,e.easing??""])].some(e=>h.TH.some(t=>e.toLowerCase().includes(t))||/["&]/.test(e)))throw new Error("A morph cannot hold this text");const y=(0,f.I)([d],{duration:n,delay:e.delay,iterations:a},"morph");if(!y)throw new Error("The morph cannot be written");return{morph:d,css:y,smil:`<animate ${Object.entries(v).map(([e,t])=>`${e}="${t}"`).join(" ")}/>`,attributes:v}}const ne=e=>new Set(Array.from(e.querySelectorAll("[id]"),e=>e.getAttribute("id")??"")),ae=/^[a-z0-9_]{1,64}\.[a-z0-9_]{1,128}$/,re=/^[A-Za-z0-9_]{1,64}$/,oe=["id","attributeName","values","dur","repeatCount","keyTimes","keySplines","calcMode","fill","begin"],se=e=>({ok:!1,error:e}),le=e=>{const t=e.toLowerCase();return h.TH.some(e=>t.includes(e))};function ce(e,t,i){const n=t.trim();if(!n)return"name-empty";if([...n].length>64)return"name-too-long";if(le(n))return"name-denied";const a=n.toLowerCase();return e.clips.some(e=>e.id!==i&&e.name.toLowerCase()===a)?"name-taken":{name:n}}function de(e,t){const i=t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,40).replace(/-+$/,"")||"clip",n=new Set(e.clips.map(e=>e.id));let a=i;for(let e=2;n.has(a);e+=1)a=`${i}-${e}`;return h.Z8.test(a)?a:"clip"}const pe=e=>e?JSON.parse(JSON.stringify(e)):{v:1,clips:[]};function he(e){if(!e||"object"!=typeof e)return;const t=e,i=Object.keys(t);if(1!==i.length)return;const n=i[0];return("state"===n||"state_not"===n)&&"string"==typeof(a=t[n])&&a.length<=64&&!le(a)?{[n]:t[n]}:"entity_on"===n&&"boolean"==typeof t[n]?{entity_on:t[n]}:("above"===n||"below"===n)&&"number"==typeof(r=t[n])&&Number.isFinite(r)&&Math.abs(r)<=1e9?{[n]:t[n]}:void 0;var a,r}function ue(e,t,i){const n=pe(e),a=n.clips.find(e=>e.id===t);if(!a)return se("not-found");const r=function(e){if(!e||"object"!=typeof e)return;const t=e;if("always"===t.on||"hover"===t.on||"tap"===t.on)return{on:t.on};if("state"!==t.on)return;if("string"!=typeof t.entity||!ae.test(t.entity))return;const i=he(t.when);if(!i)return;const n={on:"state",entity:t.entity,when:i};if(void 0!==t.attribute){if("string"!=typeof t.attribute||!re.test(t.attribute))return;n.attribute=t.attribute}return n}(i);return r?(a.play=r,{ok:!0,anim:n,id:t}):se("bad-play")}function me(e,t,i){const n=Array.from(e.querySelectorAll("animate")).find(e=>e.getAttribute("id")===t);if(n){for(const e of oe)e in i||n.removeAttribute(e);for(const[e,t]of Object.entries(i))n.setAttribute(e,t)}}const fe=(e,t)=>(e.querySelector(`[name="${t}"]`)?.value??"").trim(),ge=e=>{const t=F();return e.tracks.length>0||!!e.morphs?.length||e.name!==t.name||"always"!==e.play.on||e.duration!==t.duration||0!==(e.delay??0)||e.easing!==t.easing||"infinite"!==e.iterations||"normal"!==(e.direction??"normal")},be=(e,t)=>e.length>1||!!t||e.some(ge);function ve(e,t,i){const n="infinite"===t.iterations,r=!0===e.modifiedOnly,o=!r||t.name!==F().name,s=!r||"always"!==t.play.on||e.drafting===t.id,l=!r||2!==t.duration,c=!r||!n,d=!r||"normal"!==(t.direction??"normal"),p=e.drafting===t.id?"state":t.play.on;if(r&&!(o||s||l||c||d)&&n&&"state"!==p)return a.s6;const h=[["normal",S(49)],["reverse",S(20)],["alternate",S(18)],["alternate-reverse",S(19)]];return a.qy`<div class="clip-details" role="group" aria-labelledby=${o?"clip-name-label":"clips-title"}>
    ${o?a.qy`<div class="ia-row">
      <label id="clip-name-label" for="clip-name">${S(27)}</label>
      <input id="clip-name" type="text" maxlength="64" .value=${t.name} @change=${i=>e.rename(t.id,i.target.value)} />
    </div>`:a.s6}
    ${s?a.qy`<div class="ia-row">
      <label for="clip-trigger">${S(85)}</label>
      <select id="clip-trigger" .value=${p} @change=${i=>e.setTrigger(t.id,i.target.value)}>
        ${["always","hover","tap","state"].map(e=>a.qy`<option value=${e} ?selected=${e===p}>${function(e){switch(e){case"hover":return S(53);case"tap":return S(88);case"state":return S(10);default:return S(9)}}(e)}</option>`)}
      </select>
    </div>`:a.s6}
    ${"state"===p?function(e,t){const i=t.play,n=function(e){if("state"!==e.on)return"state";const t=e.when;return"state_not"in t?"state_not":"entity_on"in t?t.entity_on?"on":"off":"above"in t?"above":"below"in t?"below":"state"}(i),r=[["state",S(86)],["state_not",S(87)],["on",S(57)],["off",S(56)],["above",S(2)],["below",S(21)]];return a.qy`<div class="state-fields">
    <div class="ia-row">
      <label for="clip-entity">${S(46)}</label>
      <input id="clip-entity" name="entity" type="text" autocomplete="off" spellcheck="false" .value=${"state"===i.on?i.entity:""} />
    </div>
    <div class="ia-row">
      <label for="clip-attribute">${S(17)}</label>
      <input id="clip-attribute" name="attribute" type="text" autocomplete="off" spellcheck="false" .value=${"state"===i.on?i.attribute??"":""} />
    </div>
    <div class="ia-row">
      <label for="clip-condition">${S(32)}</label>
      <select id="clip-condition" name="kind" .value=${n}>
        ${r.map(([e,t])=>a.qy`<option value=${e} ?selected=${e===n}>${t}</option>`)}
      </select>
    </div>
    <div class="ia-row">
      <label for="clip-value">${S(107)}</label>
      <input id="clip-value" name="value" type="text" autocomplete="off" .value=${function(e){if("state"!==e.on)return"";const t=e.when;return"state"in t?t.state:"state_not"in t?t.state_not:"above"in t?String(t.above):"below"in t?String(t.below):""}(i)} />
    </div>
    <div class="ia-row">
      <button
        type="button"
        class="btn btn-secondary"
        @click=${i=>{const n=i.target.closest(".state-fields");n&&e.bindState(t.id,{entity:fe(n,"entity"),attribute:fe(n,"attribute"),kind:fe(n,"kind"),value:fe(n,"value")})}}
      >
        ${S(104)}
      </button>
    </div>
  </div>`}(e,t):a.s6}
    ${l?a.qy`<div class="ia-row">
      <label for="clip-duration">${S(42)}</label>
      <input id="clip-duration" type="number" min="0.05" max="600" step="0.05" .value=${String(t.duration)} @change=${i=>e.setTiming(t.id,{duration:Number(i.target.value)})} />
    </div>`:a.s6}
    ${c?a.qy`<div class="ia-row">
      <label for="clip-forever">${S(75)}</label>
      <input id="clip-forever" type="checkbox" .checked=${n} @change=${i=>e.setTiming(t.id,{iterations:i.target.checked?"infinite":1})} />
    </div>`:a.s6}
    ${n?a.s6:a.qy`<div class="ia-row">
          <label for="clip-repeats">${S(76)}</label>
          <input id="clip-repeats" type="number" min="0.01" max="1000" step="1" .value=${String(t.iterations)} @change=${i=>e.setTiming(t.id,{iterations:Number(i.target.value)})} />
        </div>`}
    ${d?a.qy`<div class="ia-row">
      <label for="clip-direction">${S(36)}</label>
      <select id="clip-direction" .value=${t.direction??"normal"} @change=${i=>e.setTiming(t.id,{direction:i.target.value})}>
        ${h.map(([e,i])=>a.qy`<option value=${e} ?selected=${e===(t.direction??"normal")}>${i}</option>`)}
      </select>
    </div>`:a.s6}
    ${r?a.s6:a.qy`<div class="ia-row">
      <button type="button" class="btn btn-secondary" ?disabled=${0===i} @click=${()=>e.move(t.id,-1)}>${S(65)}</button>
      <button type="button" class="btn btn-secondary" ?disabled=${i===e.clips.length-1} @click=${()=>e.move(t.id,1)}>${S(64)}</button>
      <button type="button" class="btn btn-secondary" @click=${()=>e.duplicate(t.id)}>${S(41)}</button>
      <button type="button" class="btn btn-secondary" @click=${()=>e.remove(t.id)}>${S(34)}</button>
    </div>`}
  </div>`}function ye(e){const t=e.clips.findIndex(t=>t.id===e.selected),i=t<0?void 0:e.clips[t];if(!0===e.modifiedOnly){if(!be(e.clips,e.drafting))return a.s6;const n=e.clips.length>1,r=i?ve(e,i,t):a.s6;return n||r!==a.s6?a.qy`<section aria-labelledby="clips-title">
      <h3 id="clips-title">${S(28)}</h3>
      ${n?a.qy`<ul class="clip-list">
            ${e.clips.map(t=>a.qy`<li><button type="button" class="btn btn-secondary" aria-pressed=${t.id===e.selected?"true":"false"} @click=${()=>e.select(t.id)}>${t.name}</button></li>`)}
          </ul>`:a.s6}
      ${r}
    </section>`:a.s6}return a.qy`<section aria-labelledby="clips-title">
    <h3 id="clips-title">${S(28)}</h3>
    <p class="hint">${S(66)}</p>
    <ul class="clip-list">
      ${e.clips.map(t=>a.qy`<li><button type="button" class="btn btn-secondary" aria-pressed=${t.id===e.selected?"true":"false"} @click=${()=>e.select(t.id)}>${t.name}</button></li>`)}
    </ul>
    ${i?ve(e,i,t):a.s6}
    <form
      class="ia-row"
      @submit=${t=>{t.preventDefault();const i=t.target.querySelector("input");i&&(e.create(i.value),i.value="")}}
    >
      <label for="clip-new">${S(67)}</label>
      <input id="clip-new" type="text" maxlength="64" autocomplete="off" />
      <button type="submit" class="btn btn-secondary">${S(4)}</button>
    </form>
    <p class="status" role="status">${e.message}</p>
  </section>`}let we;function _e(){return we??=v.u7.flatMap(e=>{try{return x(e.id),[{id:e.id,name:(0,b.t)(e.name)}]}catch{return[]}}),we}function ke(e){return"image"===e.kind?S(108):"group"===e.kind?S(52,{id:e.id??""}):S(84,{id:e.id??""})}function $e(e){switch(e){case"transform":return S(63);case"opacity":return S(47);case"colour":return S(31);case"filter":return S(50);case"stroke-draw":return S(40);case"motion-path":return S(48);default:return S(74)}}const xe=$e,Ae=["transform","opacity","colour","filter","stroke-draw"];function Se(e){return a.qy`<section aria-labelledby="targets-title">
    <h3 id="targets-title">${S(72)}</h3>
    <p class="hint" id="targets-hint">${S(26)}</p>
    <ul class="targets" aria-describedby="targets-hint">
      ${e.targets.map(t=>a.qy`<li>
          <button type="button" class="target" aria-pressed=${t.ref===e.target.ref?"true":"false"} @click=${()=>e.pick(t.ref)}>${ke(t)}</button>
        </li>`)}
    </ul>
  </section>`}function ze(e){const t=e.availability["stroke-draw"];return a.qy`<section aria-labelledby="effects-title">
    <h3 id="effects-title">${S(3,{name:ke(e.target)})}</h3>
    <div class="effects" role="group" aria-labelledby="effects-title">
      ${Ae.map(t=>{const i=e.availability[t];return a.qy`<button
          type="button"
          class="btn btn-secondary"
          aria-disabled=${i.ok?"false":"true"}
          aria-describedby=${i.ok?a.s6:"no-stroke"}
          @click=${()=>i.ok&&e.add(t)}
        >
          ${$e(t)}
        </button>`})}
    </div>
    ${t.ok?a.s6:a.qy`<p class="hint" id="no-stroke">${S(70)}</p>`}
    <div class="ia-row">
      <label for="preset">${S(74)}</label>
      <select id="preset" .value=${e.presetId} @change=${t=>e.setPreset(t.target.value)}>
        ${e.presets.map(t=>a.qy`<option value=${t.id} ?selected=${t.id===e.presetId}>${t.name}</option>`)}
      </select>
      <button type="button" class="btn btn-secondary" ?disabled=${!e.presetId} @click=${()=>e.add("preset")}>${S(6)}</button>
    </div>
    <div class="ia-row">
      <label for="path">${S(73)}</label>
      <input id="path" type="text" inputmode="text" autocomplete="off" spellcheck="false" .value=${e.path} placeholder="M0 0 L50 20" @input=${t=>e.setPath(t.target.value)} />
      <button type="button" class="btn btn-secondary" @click=${()=>e.add("motion-path")}>${$e("motion-path")}</button>
    </div>
    <p class="status" role="status">${e.message}</p>
  </section>`}var Ee=i(2254);let qe;function Me(){return qe??=async function(){try{const[e,t,n]=await Promise.all([i.e(4771).then(()=>i(6876)),(0,Ee.R3)(),(0,Ee.Dd)()]);if(!t||!n)return;return{api:e.api,check:t.checkImageAnimation,install:e.install,kit:{play:t.api.play,compile:n}}}catch(e){return void console.warn("Magic Card: image animator could not load the image tools",e)}}().then(e=>(e||(qe=void 0),e)),qe}function Ne(e,t){return e.map(e=>a.qy`<option value=${e.ref} ?selected=${e.ref===t}>${(e=>S(84,{id:e.id??""}))(e)}</option>`)}function Ce(e){const t=e.paths.length>=2&&e.from!==e.into;return a.qy`<section aria-labelledby="morph-title">
    <h3 id="morph-title">${S(62)}</h3>
    <p class="hint" id="morph-hint">${S(90)}</p>
    <div class="ia-row">
      <label for="morph-from">${S(83)}</label>
      <select id="morph-from" .value=${e.from} @change=${t=>e.setFrom(t.target.value)}>
        ${Ne(e.paths,e.from)}
      </select>
    </div>
    <div class="ia-row">
      <label for="morph-into">${S(23)}</label>
      <select id="morph-into" .value=${e.into} @change=${t=>e.setInto(t.target.value)}>
        ${Ne(e.paths,e.into)}
      </select>
    </div>
    <div class="ia-row">
      <label for="morph-back">${S(51)}</label>
      <input id="morph-back" type="checkbox" .checked=${e.back} @change=${t=>e.setBack(t.target.checked)} />
    </div>
    <div class="ia-row">
      <button type="button" class="btn btn-secondary" aria-disabled=${t?"false":"true"} aria-describedby=${t?"morph-hint":"morph-need"} @click=${()=>t&&e.add()}>
        ${S(5)}
      </button>
    </div>
    ${t?a.s6:a.qy`<p class="hint" id="morph-need">${S(25)}</p>`}
    <p class="status" role="status">${e.message}</p>
  </section>`}const Te={release:()=>{}},Oe=e=>"undefined"!=typeof TextEncoder?(new TextEncoder).encode(e).length:e.length;async function Be(e){try{const t=await e.callWS({type:U.Ve.list}),i=(0,U.Rt)(t),n=t?.caps;return{maxBytes:i,canSave:!!n&&n.image_max_bytes===i&&1===n.animation,ids:new Set((t?.images??[]).map(e=>e.id))}}catch{return}}function De(e){return"too_large"===e?"too_large":"unsafe_markup"===e||"too_complex"===e?"unsafe_markup":"not_svg"}function Ie(e,t,i){return Oe(e)+(t?.length?Oe(JSON.stringify(t)):0)+(i?Oe(JSON.stringify(i)):0)}function je(e,t){const i=e.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,56).replace(/-+$/,"")||"image";let n=i;for(let e=2;t.has(n);e++)n=`${i}-${e}`;return n}const Le=a.AH`
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
  mc-ui-studio-frame {
    flex: 1 1 auto;
    min-block-size: 0;
    min-inline-size: 0;
  }
  @media (max-width: 1100px) {
    .window {
      inset: 0;
      border: 0;
      border-radius: 0;
    }
  }
  header,
  footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    padding: 8px 12px;
    border-block-end: 1px solid var(--mc-divider);
  }
  footer {
    border-block-start: 1px solid var(--mc-divider);
    border-block-end: 0;
  }
  .bar {
    flex: 1 1 auto;
    min-inline-size: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  h2 {
    flex: 0 1 auto;
    min-inline-size: 0;
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  header h2 {
    flex: 1 1 auto;
  }
  h2:focus {
    outline: none;
  }
  .bar .status {
    flex: 1 1 0;
    min-inline-size: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .bar .btn {
    flex: none;
  }
  .body {
    flex: 1 1 auto;
    min-block-size: 0;
    padding: 12px;
  }
  .stage-wrap {
    display: grid;
    justify-items: start;
    gap: 40px;
  }
  .stage {
    display: block;
    cursor: crosshair;
    touch-action: manipulation;
  }
  .stage svg {
    display: block;
    inline-size: 100%;
    block-size: 100%;
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
    color: var(--bp-mute, var(--mc-text-2));
  }
  .saved mc-svg-image {
    display: block;
    inline-size: 4rem;
    block-size: 4rem;
  }
  .drawer-body {
    display: grid;
    align-content: start;
    gap: 16px;
    padding: 4px 4px 16px;
    color: var(--bp-ink, var(--mc-text));
  }
  .drawer-body h3 {
    margin: 0 0 4px;
    font-size: 0.875rem;
    font-weight: 600;
  }
  .targets {
    list-style: none;
    margin: 0;
    padding: 0;
    max-block-size: 12rem;
    overflow: auto;
    display: grid;
    gap: 2px;
  }
  .target {
    inline-size: 100%;
    min-block-size: 32px;
    padding-inline: 8px;
    text-align: start;
    border: 1px solid transparent;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    cursor: pointer;
    overflow-wrap: anywhere;
  }
  .target[aria-pressed='true'] {
    border-color: var(--bp-acc, var(--mc-accent, currentColor));
    background: var(--bp-acc-soft, var(--mc-ground));
    font-weight: 600;
  }
  .target:focus-visible,
  .effects button:focus-visible,
  .ia-row :is(select, input, button):focus-visible,
  .bar .btn:focus-visible {
    outline: 2px solid var(--bp-acc, var(--mc-accent, currentColor));
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
    color: var(--bp-mute, var(--mc-text-2));
  }
  .ia-row :is(select, input:not([type='checkbox'])) {
    flex: 1 1 8rem;
    min-inline-size: 0;
    min-block-size: 32px;
  }
  p {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--bp-mute, var(--mc-text-2));
  }
  p.problem {
    color: var(--mc-danger-ink, var(--mc-text));
    font-weight: 600;
  }
  .status {
    flex: 1 1 12em;
    min-inline-size: 0;
  }
  .confirm {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px 12px;
    padding: 12px 16px;
    border-block-start: 1px solid var(--mc-border, currentColor);
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
  @media (prefers-reduced-motion: reduce) {
    .window,
    .window * {
      transition: none;
      animation: none;
      scroll-behavior: auto;
    }
  }
`,Re=/[A-Za-z0-9_-]/,Fe=e=>"object"==typeof e&&null!==e;function Pe(e,t){let i=0,n=0;const a=(e,r)=>{if(!(!Fe(e)||r>32||++n>2e5))if(Array.isArray(e)||"custom:magic-card"!==e.type)for(const t of Array.isArray(e)?e:Object.values(e))a(t,r+1);else try{(function(e,t){const i=`mcu-image:${t}`;for(let t=e.indexOf(i);t>=0;t=e.indexOf(i,t+1))if(!Re.test(e.charAt(t+i.length)))return!0;return!1})(JSON.stringify(e),t)&&i++}catch{}};return a(e,0),i}async function Ke(e,t){const{paths:i,complete:n}=await async function(e){try{const t=await e.callWS({type:"lovelace/dashboards/list"}),i=[null];for(const e of Array.isArray(t)?t:[])Fe(e)&&"string"==typeof e.url_path&&"yaml"!==e.mode&&i.length<=200&&i.push(e.url_path);return{paths:i,complete:!0}}catch{return{paths:[null],complete:!1}}}(e),a=await Promise.all(i.map(async i=>{try{return{count:Pe(await e.callWS({type:"lovelace/config",...null===i?{}:{url_path:i}}),t),ok:!0}}catch{return{count:0,ok:!1}}}));return{count:a.reduce((e,t)=>e+t.count,0),complete:n&&a.every(e=>e.ok)}}var Ve=i(1471);const We=/[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g,Ue=e=>"object"==typeof e&&null!==e,He=e=>Array.isArray(e)?e:[];var Je=function(e,t,i,n){var a,r=arguments.length,o=r<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(o=(r<3?a(o):r>3?a(t,i,o):a(t,i))||o);return r>3&&o&&Object.defineProperty(t,i,o),o};const Ze=e=>`${e.svg}\0${JSON.stringify(e.animation??null)}`,Ge='button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';class Ye extends a.WF{constructor(){super(...arguments),this._phase="opening",this._saving=!1,this._libraryBytes=0,this._unchecked=!1,this._note="",this._closeAfterSave=!1,this._target={ref:"element",kind:"image",generated:!1},this._targets=[],this._presetId="",this._path="",this._message="",this._morphFrom="",this._morphInto="",this._morphBack=!1,this._morphMessage="",this._clipId="",this._drafting="",this._clipMessage="",this._view={width:100,height:100,zoom:1},this._drawerOpen=!1,this._narrow=!1,this._modifiedOnly=!1,this._clean="",this._onDocKey=e=>{e.defaultPrevented||this._shortcut(e)}}connectedCallback(){super.connectedCallback(),(0,c.$)([[o.pT,p.Y]]),(0,d.XU)(),document.addEventListener("keydown",this._onDocKey),this._started??=this._open()}_shortcut(e){return!(!e.ctrlKey&&!e.metaKey||e.altKey||e.shiftKey||"\\"!==e.key&&"Backslash"!==e.code||e.repeat||this._ask||this._leaving||(e.preventDefault(),this._drawerOpen?this._frame?.closeDrawer("user"):this._frame?.openDrawer(null,"user"),0))}async _open(){const e=this.source,t=this.hass;if(!e||!t)return this._fail("failed");const i=await Me();if(!i)return this._fail("failed");i.install(),this._kit=i.kit;const n=await function(e,t){return"image"===t.kind?async function(e,t){const i=await Be(e);if(!i)return{ok:!1,reason:"failed"};let n;try{n=(await e.callWS({type:U.Ve.get,ids:[t]})).images?.[0]}catch{return{ok:!1,reason:"failed"}}if(!n)return{ok:!1,reason:"missing"};const a=await Me();if(!a)return{ok:!1,reason:"failed"};const r=a.api.sanitizeImage(n.svg,{animation:n.animation});if(r.error)return{ok:!1,reason:De(r.error)};let o;return void 0===n.animation||(o=a.check(n.animation,new Set(r.ids)),o)?{ok:!0,id:n.id,name:n.name,svg:r.markup,viewBox:r.viewBox||n.view_box,bindings:n.bindings??[],...o?{animation:o}:{},updatedAt:n.updated_at,canSave:i.canSave,maxBytes:i.maxBytes}:{ok:!1,reason:"invalid_animation"}}(e,t.id):async function(e,t){const i=await Be(e);if(!i)return{ok:!1,reason:"failed"};if(!i.canSave)return{ok:!1,reason:"needs_utils"};if(t.size>i.maxBytes)return{ok:!1,reason:"too_large"};let n;try{n=await t.text()}catch{return{ok:!1,reason:"failed"}}const a=await Me();if(!a)return{ok:!1,reason:"failed"};const r=a.api.sanitizeImage(n,{file:!0});if(r.error)return{ok:!1,reason:De(r.error)};if(Ie(r.markup,void 0,void 0)>i.maxBytes)return{ok:!1,reason:"too_large"};const o=t.name.replace(/\.svg$/i,"").replace(/[-_]+/g," ").trim().slice(0,64)||S(55);return{ok:!0,id:je(o,i.ids),name:o,svg:r.markup,viewBox:r.viewBox,bindings:[],canSave:!0,maxBytes:i.maxBytes,isNew:!0}}(e,t.file)}(t,e);if(!n.ok)return this._fail(n.reason);this._opened=n,this._clean=Ze(n),this._presetId=_e()[0]?.id??"",this._phase="ready",this._readLibrary()}async _readLibrary(){const e=function(e){let t=0;for(const i of e)Ue(i)&&"number"==typeof i.bytes&&Number.isFinite(i.bytes)&&i.bytes>0&&(t+=i.bytes);return{show:t>=Ve.ZG,bytes:t}}((this.hass?await async function(e){try{const t=await e.callWS({type:U.Ve.list});return Array.isArray(t?.images)?t.images.map(e=>({bytes:e.bytes})):void 0}catch{return}}(this.hass):void 0)??[]);this._libraryBytes=e.show?e.bytes:0}_confirm(e){return new Promise(t=>{this._ask={notice:e,answer:t},this.updateComplete.then(()=>this.renderRoot.querySelector(".confirm .btn-primary")?.focus())})}_answer(e){const t=this._ask;this._ask=void 0,t?.answer(e)}_fail(e){this._reason=e,this._phase="failed"}_announce(e){const t={id:e};(this.opener??this).dispatchEvent(new CustomEvent(n.D7,{detail:t,bubbles:!0,composed:!0}))}_close(){if(this._ask&&this._answer(!1),!this._leaving)if(this._saving)this._closeAfterSave=!0;else{if(!this._opened||Ze(this._opened)===this._clean)return this._discard();this._leaving={from:this.shadowRoot?.activeElement??null},this.updateComplete.then(()=>this.renderRoot.querySelector(".leave .btn-secondary")?.focus())}}_keepEditing(){const e=this._leaving?.from;this._leaving=void 0,this.updateComplete.then(()=>(e?.isConnected?e:this.renderRoot.querySelector("h2"))?.focus())}_discard(){this._leaving=void 0,this.dispatchEvent(new CustomEvent("close"))}async _save(){const e=this._opened,t=this.hass;if(!e||!t||this._saving)return;let i;this._saving=!0,this._note="",this._reason=void 0,this._unchecked=!1;try{i=await async function(e,t,i){const n=t.isNew?{kind:"none"}:0===(a=await Ke(e,t.id)).count?a.complete?{kind:"none"}:{kind:"unknown"}:{kind:a.complete?"used":"at-least",count:a.count};var a;if(("used"===n.kind||"at-least"===n.kind)&&!await i(n))return{ok:!1,reason:"cancelled"};const r=await async function(e,t){const i=await Be(e);if(!i)return{ok:!1,reason:"failed"};if(!i.canSave)return{ok:!1,reason:"needs_utils"};const n=(e=>{const t=e?.clips;return Array.isArray(t)&&t.length>0})(t.animation)?t.animation:void 0;if(Ie(t.svg,t.bindings,n)>i.maxBytes)return{ok:!1,reason:"too_large"};const a=await Me();if(!a)return{ok:!1,reason:"failed"};const r=a.api.sanitizeImage(t.svg,{animation:n});if(r.error)return{ok:!1,reason:De(r.error)};let o;if(n&&(o=a.check(n,new Set(r.ids)),!o))return{ok:!1,reason:"invalid_animation"};if(Ie(r.markup,t.bindings,o)>i.maxBytes)return{ok:!1,reason:"too_large"};const s=await a.api.thumbnail(r.markup,320,16384).catch(()=>{}),l=t.isNew?(await Be(e))?.ids:i.ids;if(!l)return{ok:!1,reason:"failed"};const c=t.isNew&&l.has(t.id)?je(t.id,l):t.id,d={id:c,name:t.name,view_box:r.viewBox||t.viewBox,svg:r.markup,...t.bindings?.length?{bindings:t.bindings}:{},...o?{animation:o}:{},...s?{thumb:s}:{}};try{const i=await e.callWS({type:U.Ve.save,image:d,...t.baseUpdatedAt&&!t.isNew?{base_updated_at:t.baseUpdatedAt}:{}});return a.api.invalidate([c]),{ok:!0,id:c,summary:i.image}}catch(e){return{ok:!1,reason:"conflict"===e?.code?"conflict":"failed"}}}(e,t);return r.ok?{...r,notice:n}:r}(t,{id:e.id,name:e.name,svg:e.svg,viewBox:e.viewBox,bindings:e.bindings,animation:e.animation,baseUpdatedAt:e.updatedAt,isNew:e.isNew},e=>this._confirm(e))}catch{i={ok:!1,reason:"failed"}}finally{this._saving=!1}i.ok?this._saved(e,i.id,"unknown"===i.notice.kind,i.summary?.updated_at):"cancelled"!==i.reason&&(this._reason=i.reason),this._closeAfterSave&&(this._closeAfterSave=!1,this._close())}_saved(e,t,i,n){this._unchecked=i,this._readLibrary();const a=this._opened??e;this._opened={...a,id:t,isNew:!1,updatedAt:n??a.updatedAt},this._clean=Ze(e),this._note="saved",this._announce(t)}disconnectedCallback(){document.removeEventListener("keydown",this._onDocKey),this._preview?.release(),this._preview=void 0,this._observer?.disconnect(),this._observer=void 0,this._frame=void 0,super.disconnectedCallback()}updated(e){e.has("_phase")&&this.renderRoot.querySelector("h2")?.focus(),"ready"!==this._phase||this._svg||this._mountCanvas(),"ready"===this._phase&&this._watchFrame()}_watchFrame(){const e=this.renderRoot.querySelector(o.pT);if(!e||e===this._frame)return;this._observer?.disconnect(),this._frame=e,this._observer=new ResizeObserver(e=>{const t=e[e.length-1]?.contentRect;t&&this._fit(t.width,t.height)}),this._observer.observe(e);const t=e.getBoundingClientRect();this._fit(t.width,t.height),this._narrow||e.openDrawer(this.renderRoot.querySelector(".settings"),"user")}_fit(e,t){const i=this._narrow;this._narrow=e>0&&e<1024,this._narrow!==i&&this._frame&&(this._narrow?this._frame.closeDrawer("stage"):this._frame.openDrawer(null,"user"));const n=Math.max(160,e-(this._narrow?0:344)-96),a=Math.max(160,(t||640)-56-96-56),{width:r,height:o}=this._view,s=Math.round(100*Math.min(6,Math.max(.25,Math.min(n/r,a/o))))/100;s!==this._view.zoom&&(this._view={...this._view,zoom:s})}_mountCanvas(){const e=this.renderRoot.querySelector(".stage"),t=this._opened;if(!e||!t)return;e.innerHTML=t.svg;const i=e.querySelector("svg");if(!i)return;this._svg=i;const n=(i.getAttribute("viewBox")??"").trim().split(/[\s,]+/).map(Number),[a,r]=4===n.length?[n[2],n[3]]:[Number(i.getAttribute("width")),Number(i.getAttribute("height"))];this._view={...this._view,width:a>0?a:100,height:r>0?r:100},this._fit(this._frame?.clientWidth??0,this._frame?.clientHeight??0),this._targets=j(this._svg),this._replay()}_replay(){this._preview?.release(),this._preview=void 0;const e=this._opened?.animation;this._svg&&this._kit&&e?.clips.length&&(this._preview=function(e,t,i,n){const a=t.clips.find(e=>e.id===i);if(!a)return Te;const r={v:1,clips:[{...a,play:{on:"always"}}]},o=n.play(e,r,{hass:void 0,host:e},n.compile);return{release:()=>o.release()}}(this._svg,e,this._clip(e)?.id??e.clips[0].id,this._kit))}_clip(e){return e?.clips.find(e=>e.id===this._clipId)??e?.clips[0]}_clipError(e){switch(e){case"name-empty":return S(43);case"name-too-long":return S(0);case"name-taken":return S(24);case"name-denied":return S(102);case"limit":return S(11);case"bad-play":return S(44);case"bad-timing":return S(89);case"direction-morph":return S(1);default:return S(93)}}_applyClips(e,t){if(!this._opened)return;if(!e.ok)return void(this._clipMessage=this._clipError(e.error));this._clipId=e.id,this._drafting="",this._commitClips(e.anim);const i=e.anim.clips.find(t=>t.id===e.id)?.name??"";this._clipMessage=S("added"===t?7:103,{name:i})}_commitClips(e){const t=this._opened;t&&(this._preview?.release(),this._preview=void 0,this._svg?.querySelector("[data-mc-picked]")?.removeAttribute("data-mc-picked"),this._opened={...t,animation:e,svg:this._svg?.outerHTML??t.svg},this._mark(this._target),this._replay())}_clipsPanel(){const e=this._opened?.animation,t=(t,i="updated")=>{e&&this._applyClips(t(e),i)};return{clips:e?.clips??[],selected:this._clip(e)?.id??"",drafting:this._drafting,message:this._clipMessage,select:e=>{this._clipId=e,this._drafting="",this._replay()},create:t=>this._applyClips(function(e,t){const i=pe(e);if(i.clips.length>=16)return se("limit");const n=ce(i,t);if("string"==typeof n)return se(n);const a=de(i,n.name);return i.clips.push({id:a,name:n.name,play:{on:"always"},duration:2,easing:"ease-in-out",iterations:"infinite",tracks:[]}),{ok:!0,anim:i,id:a}}(e,t),"added"),rename:(e,i)=>t(t=>function(e,t,i){const n=pe(e),a=n.clips.find(e=>e.id===t);if(!a)return se("not-found");const r=ce(n,i,t);return"string"==typeof r?se(r):(a.name=r.name,{ok:!0,anim:n,id:t})}(t,e,i)),remove:t=>{if(!e)return;const i=e.clips.find(e=>e.id===t),n=new Set((i?.morphs??[]).map(e=>e.smil));this._svg?.querySelectorAll("animate").forEach(e=>{n.has(e.getAttribute("id")??"")&&e.remove()}),this._clipId="",this._drafting="",this._commitClips(function(e,t){const i=pe(e);return i.clips=i.clips.filter(e=>e.id!==t),i.clips.length?i:void 0}(e,t)),this._clipMessage=S(35,{name:i?.name??""})},duplicate:e=>t(t=>function(e,t){const i=pe(e),n=i.clips.findIndex(e=>e.id===t);if(n<0)return se("not-found");if(i.clips.length>=16)return se("limit");const a=i.clips[n];let r="";for(let e=2;!r;e+=1){const t=` ${e}`,n=`${[...a.name].slice(0,64-t.length).join("")}${t}`;"string"!=typeof ce(i,n)&&(r=n)}const o={...JSON.parse(JSON.stringify(a)),id:de(i,r),name:r};return delete o.morphs,i.clips.splice(n+1,0,o),{ok:!0,anim:i,id:o.id}}(t,e),"added"),move:(t,i)=>{e&&this._commitClips(function(e,t,i){const n=pe(e),a=n.clips.findIndex(e=>e.id===t),r=a+i;if(a<0||r<0||r>=n.clips.length)return n;const[o]=n.clips.splice(a,1);return n.clips.splice(r,0,o),n}(e,t,i))},setTrigger:(e,i)=>{"state"!==i?(this._drafting="",t(t=>ue(t,e,{on:i}))):this._drafting=e},bindState:(e,i)=>{const n=function(e,t){const i=t.trim();return"on"===e||"off"===e?{entity_on:"on"===e}:"state"===e||"state_not"===e?he({[e]:i}):"above"!==e&&"below"!==e||""===i?void 0:he({[e]:Number(i)})}(i.kind,i.value);t(t=>n?ue(t,e,{on:"state",entity:i.entity,...i.attribute?{attribute:i.attribute}:{},when:n}):{ok:!1,error:"bad-play"})},setTiming:(e,i)=>t(t=>function(e,t,i,n){const a=pe(e),r=a.clips.find(e=>e.id===i);if(!r)return se("not-found");const o=n.direction??r.direction;if(r.morphs?.length&&void 0!==o&&"normal"!==o)return se("direction-morph");const s=n.duration??r.duration,l=n.iterations??r.iterations,[c,d]=h.g7,[p,u]=h.ym;if(!("number"==typeof s&&s>=c&&s<=d))return se("bad-timing");if("infinite"!==l&&!("number"==typeof l&&l>=p&&l<=u))return se("bad-timing");const m=[];try{for(const e of r.morphs??[])m.push(ie({target:e.target,smil:e.smil,frames:e.frames,duration:s,iterations:l,delay:r.delay,resampled:!0}))}catch{return se("bad-timing")}if(r.duration=s,r.iterations=l,void 0!==n.direction&&(r.direction=n.direction),m.length&&(r.morphs=m.map(e=>e.morph)),t)for(const e of m)me(t,e.morph.smil,e.attributes);return{ok:!0,anim:a,id:i}}(t,this._svg,e,i))}}_mark(e){this._svg?.querySelector("[data-mc-picked]")?.removeAttribute("data-mc-picked"),e.element&&e.element.setAttribute("data-mc-picked","")}_pick(e){e&&(this._target=e,this._mark(e),this._message="")}_onStageClick(e){if(!this._svg)return;const t=this._target?.ref;this._pick(function(e,t){if(null===t||t===e)return{...I};if(((e,t)=>!!t&&t!==e&&e.contains(t)&&1===t.nodeType)(e,t)){for(let i=t;i&&i!==e;i=i.parentElement)if(O(e,i))return D(e,i,B(e));return{...I}}}(this._svg,e.target instanceof Element?e.target:null)),this._target?.ref===t||this._narrow||this._frame?.openDrawer(null,"selection");const i=this.renderRoot.querySelector(".window");i&&!i.contains(this.shadowRoot?.activeElement??null)&&(this.renderRoot.querySelector("#title")??i).focus({preventScroll:!0})}_toggleDrawer(e){this._drawerOpen?this._frame?.closeDrawer("user"):this._frame?.openDrawer(e.currentTarget,"user")}_strings(){return{pin:S(59),modifiedOnly:S(60),noneModified:S(69),close:S(30),drawer:S(82),zoom:S(110)}}_measure(){let e=null;try{const t=this._target.element&&"getBBox"in this._target.element?this._target.element.getBBox():void 0;t&&t.width>0&&t.height>0&&(e={x:t.x,y:t.y,width:t.width,height:t.height})}catch{e=null}const{width:t,height:i,zoom:n}=this._view;return{width:t,height:i,grid:10,selection:e,zoom:n}}_pickRef(e){this._pick(this._targets.find(t=>t.ref===e))}_add(e){const t=this._opened,i=this._svg;if(!t||!i)return;const n=this._target;let a;try{a=function(e,t,i,n={}){const a=e?JSON.parse(JSON.stringify(e)):{v:1,clips:[]};a.clips.length||a.clips.push(F());const r=void 0===n.clipId?a.clips[0]:a.clips.find(e=>e.id===n.clipId);if(!r)throw new Error(`No clip ${n.clipId}`);let o,s;if("preset"===i){if(!n.presetId)throw new Error("A preset needs an id");o=x(n.presetId)}else"motion-path"===i?(s=function(e){const t=e?.trim().replace(/\s+/g," ");if(!t||!h.c2.test(t))throw new Error("A motion path needs path data");return t}(n.path),o=[{at:0},{at:100}]):o=P[i];if(!o.length)throw new Error("This effect has no keyframes");let l=r.tracks.find(e=>e.target===t.ref);if(!l){if(r.tracks.length>=24)throw new Error("This clip already has the most tracks it can hold");l={target:t.ref,keyframes:[]},r.tracks.push(l)}l.keyframes=function(e,t){const i=e.map(e=>({...e}));for(const e of t){const t=i.find(t=>t.at===e.at);t?Object.assign(t,JSON.parse(JSON.stringify(e))):i.push(JSON.parse(JSON.stringify(e)))}if(i.sort((e,t)=>e.at-t.at),i.length>40)throw new Error("Too many keyframes in one track");return i}(l.keyframes,o),void 0!==s&&(l.path={d:s});for(const e of K(o)){const t=e.toLowerCase();if(h.TH.some(e=>t.includes(e)))throw new Error("This effect holds text the animation cannot store")}return a}(t.animation,n,e,{presetId:this._presetId,path:this._path,clipId:this._clip(t.animation)?.id})}catch{return void(this._message=S("motion-path"===e?45:95))}this._preview?.release(),this._preview=void 0,this._svg?.querySelector("[data-mc-picked]")?.removeAttribute("data-mc-picked"),L(n)&&(this._targets=j(i),this._target=this._targets.find(e=>e.ref===n.ref)??n),this._opened={...t,animation:a,svg:i.outerHTML},this._mark(this._target),this._note="",this._message=S(8,{effect:xe(e),name:ke(n)}),this._replay()}_paths(){return this._targets.filter(e=>"path"===e.element?.localName)}_addMorph(){const e=this._opened,t=this._svg,i=this._paths(),n=i.find(e=>e.ref===(this._morphFrom||i[0]?.ref)),a=i.find(e=>e.ref===(this._morphInto||i[1]?.ref)),r=a?.element?.getAttribute("d");if(!(e&&t&&n?.element&&r&&n!==a))return void(this._morphMessage=S(25));const o=n.element.getAttribute("id");try{L(n),this._preview?.release(),this._preview=void 0,t.querySelector("[data-mc-picked]")?.removeAttribute("data-mc-picked");const i=function(e,t,i){const n=i.path.getAttribute("id")??"",a=i.path.getAttribute("d")??"",r=e?JSON.parse(JSON.stringify(e)):{v:1,clips:[]};r.clips.length||r.clips.push(F());const o=r.clips.find(e=>e.id===i.clipId)??r.clips[0];if(void 0!==o.direction&&"normal"!==o.direction)throw new Error("A clip with a morph plays forwards only");let s;for(const e of r.clips){const t=e.morphs?.find(e=>e.target===n);t&&(s=t.smil,e.morphs=e.morphs?.filter(e=>e!==t),e.morphs?.length||delete e.morphs)}const l=new Set([...ne(t),...r.clips.flatMap(e=>(e.morphs??[]).map(e=>e.smil))]);if(!s){let e=1;for(;l.has(`${ee}${e}`);)e+=1;s=`${ee}${e}`}const c=i.back?[{at:0,d:a},{at:50,d:i.into},{at:100,d:a}]:[{at:0,d:a},{at:100,d:i.into}],d=ie({target:n,smil:s,frames:c,duration:o.duration,iterations:o.iterations,delay:o.delay});if(r.clips.flatMap(e=>e.morphs??[]).length>=64)throw new Error("This image already has the most morphs it can hold");(o.morphs??=[]).push(d.morph);for(const e of Array.from(i.path.children))"animate"===e.localName&&e.remove();const p=i.path.ownerDocument.createElementNS("http://www.w3.org/2000/svg","animate");for(const[e,t]of Object.entries(d.attributes))p.setAttribute(e,t);return i.path.append(p),r}(e.animation,t,{path:n.element,into:r,back:this._morphBack,clipId:this._clip(e.animation)?.id});this._targets=j(t),this._opened={...e,animation:i,svg:t.outerHTML},this._morphMessage=S(8,{effect:S(61),name:ke(n)})}catch{n.generated&&!o&&n.element.removeAttribute("id"),this._morphMessage=S(101)}this._mark(this._target),this._replay()}_morphPanel(){const e=this._paths();return{paths:e,from:this._morphFrom||e[0]?.ref||"",into:this._morphInto||e[1]?.ref||"",back:this._morphBack,message:this._morphMessage,setFrom:e=>this._morphFrom=e,setInto:e=>this._morphInto=e,setBack:e=>this._morphBack=e,add:()=>this._addMorph()}}_panel(){const e=this._svg;if(e)return{targets:this._targets,target:this._target,availability:W(e,this._target),presets:_e(),presetId:this._presetId,path:this._path,message:this._message,pick:e=>this._pickRef(e),add:e=>this._add(e),setPreset:e=>this._presetId=e,setPath:e=>this._path=e}}_onKey(e){if(this._shortcut(e))return;if("Escape"===e.key)return e.stopPropagation(),void(this._leaving?this._keepEditing():this._ask?this._answer(!1):this._close());if("Tab"!==e.key||e.defaultPrevented)return;const t=!(!this._leaving&&!this._ask);if(!t&&this._drawerOpen&&this._narrow)return;const i=t?[...this.renderRoot.querySelector(".confirm")?.querySelectorAll(Ge)??[]]:this._tabStops();if(!i.length)return;let n=this.shadowRoot?.activeElement;n&&n===this._frame&&(n=n.shadowRoot?.activeElement??n);const a=i[0],r=i[i.length-1],o=!i.includes(n);e.shiftKey&&(n===a||o)?(e.preventDefault(),r.focus()):e.shiftKey||n!==r&&!o||(e.preventDefault(),a.focus())}_tabStops(){const e=this._frame;if(!e?.shadowRoot)return[];const t=[],i=e=>{e.matches(Ge)&&!e.closest("[inert]")&&t.push(e);for(const i of e.querySelectorAll(Ge))i.closest("[inert]")||t.push(i)};for(const n of e.shadowRoot.querySelectorAll("button, slot"))if(n instanceof HTMLSlotElement)for(const e of n.assignedElements({flatten:!0}))i(e);else n.closest("[inert], [hidden]")||t.push(n);return t}_problem(e){switch(e){case"missing":return S(99);case"too_large":return S(98);case"not_svg":return S(96);case"unsafe_markup":return S(94);case"needs_utils":return S(14);case"invalid_animation":return S(91);case"conflict":return S(100);default:return S(33)}}_stageSlot(e){const{width:t,height:i,zoom:n}=this._view;return a.qy`<div slot="stage" class="stage-wrap">
      <div class="stage" role="group" aria-label=${e.name} style=${`inline-size:${t*n}px;block-size:${i*n}px`} @click=${this._onStageClick}></div>
      ${e.isNew?a.s6:a.qy`<div class="saved">
            <span>${S(16)}</span>
            <mc-svg-image .hass=${this.hass} .ref=${`mcu-image:${e.id}`} .description=${e.name}></mc-svg-image>
          </div>`}
    </div>`}_drawerSlot(e){const t=this._panel(),i=e.animation?.clips.length??0,n=this._saving||!!this._ask||!!this._leaving;if(this._modifiedOnly){const i=t?this._clipsPanel():void 0,r=!!i&&be(i.clips,i.drafting);return a.qy`<div slot="drawer" id="ia-drawer" class="drawer-body" ?inert=${n}>
        ${this._warnings(e)}
        ${t&&i&&(e=>e.some(e=>e.tracks.length>0||!!e.morphs?.length))(i.clips)?a.qy`${Se(t)}${ze(t)}${Ce(this._morphPanel())}`:a.s6}
        ${i&&r?ye({...i,modifiedOnly:!0}):a.s6}
        ${r?a.s6:a.qy`<p class="hint" role="status">${S(69)}</p>`}
      </div>`}return a.qy`<div slot="drawer" id="ia-drawer" class="drawer-body" ?inert=${n}>
      ${this._warnings(e)}
      ${t?a.qy`${Se(t)}${ze(t)}${Ce(this._morphPanel())}${ye(this._clipsPanel())}`:a.s6}
      <p>${i?S(112,{count:i}):S(97)}</p>
    </div>`}_body(){return"opening"===this._phase?a.qy`<p role="status">${S(71)}</p>`:a.qy`<p class="problem" role="alert">${this._problem(this._reason??"failed")}</p>`}_heavyLine(e){switch(e.kind){case"targets":return S(111,{count:e.n,limit:e.limit});case"filters":return S(114,{count:e.n,limit:e.limit});case"morph-points":return S(113,{count:Math.round(e.n),limit:e.limit});default:return S(15,{size:Math.ceil(e.n/1024),limit:Math.round(e.limit/1024)})}}_warnings(e){const t=e.animation?function(e){const t=new Set,i=new Set;let n=0;for(const a of He(Ue(e)?e.clips:void 0))if(Ue(a)){for(const e of He(a.tracks))if(Ue(e)&&"string"==typeof e.target){t.add(e.target);for(const t of He(e.keyframes))!Ue(t)||void 0===t.filter&&void 0===t.blur||i.add(e.target)}for(const e of He(a.morphs))if(Ue(e))for(const t of He(e.frames))Ue(t)&&"string"==typeof t.d&&(n+=t.d.match(We)?.length??0)}const a=n/2;let r;try{r=(new TextEncoder).encode(JSON.stringify(e)??"").length}catch{r=0}const o=[];return t.size>150&&o.push({kind:"targets",n:t.size,limit:150}),i.size>8&&o.push({kind:"filters",n:i.size,limit:8}),a>2e4&&o.push({kind:"morph-points",n:a,limit:2e4}),r>524288&&o.push({kind:"anim-bytes",n:r,limit:524288}),o}(e.animation):[];return t.length||this._libraryBytes?a.qy`<div class="warnings">
      ${t.length?a.qy`<p role="status">${S(92)}</p>
            <ul>${t.map(e=>a.qy`<li>${this._heavyLine(e)}</li>`)}</ul>`:a.s6}
      ${this._libraryBytes?a.qy`<p role="status">${S(109)}</p>`:a.s6}
    </div>`:a.s6}_confirmBox(){const e=this._ask?.notice;if(!e||"used"!==e.kind&&"at-least"!==e.kind)return a.s6;const t="used"===e.kind?S(106,{count:e.count}):S(105,{count:e.count});return a.qy`<div class="confirm" role="alertdialog" aria-labelledby="used-text">
      <p id="used-text">${t}</p>
      <button class="btn btn-secondary" type="button" @click=${()=>this._answer(!1)}>${S(22)}</button>
      <button class="btn btn-primary" type="button" @click=${()=>this._answer(!0)}>${S(77)}</button>
    </div>`}_leaveBox(){if(!this._leaving)return a.s6;const e=this._opened?.isNew?S(39):S(38);return a.qy`<div class="confirm leave" role="alertdialog" aria-labelledby="leave-text">
      <p id="leave-text">${e}</p>
      <button class="btn btn-secondary" type="button" @click=${this._keepEditing}>${S(58)}</button>
      <button class="btn btn-danger" type="button" @click=${this._discard}>${S(37)}</button>
    </div>`}_status(){return this._saving&&this._closeAfterSave?a.qy`<p class="status" role="status">${S(81)}</p>`:this._saving?a.qy`<p class="status" role="status">${S(80)}</p>`:this._reason&&"ready"===this._phase?a.qy`<p class="status problem" role="alert">${this._problem(this._reason)}</p>`:this._opened&&!this._opened.canSave?a.qy`<p class="status" role="status">${this._problem("needs_utils")}</p>`:"saved"===this._note&&this._unchecked?a.qy`<p class="status" role="status">${S(79)}</p>`:"saved"===this._note?a.qy`<p class="status" role="status">${S(78)}</p>`:this._opened?.isNew?a.qy`<p class="status" role="status">${S(68,{name:this._opened.name})}</p>`:a.qy`<p class="status" role="status"></p>`}render(){const e=this._opened,t="ready"===this._phase&&!!e,i=a.qy`<h2 id="title" tabindex="-1">${e?S(13,{name:e.name}):S(12)}</h2>`,n=a.qy`<button class="btn btn-secondary close" type="button" @click=${this._close}>${S(29)}</button>`;return a.qy`<div class="backdrop" @click=${this._close} aria-hidden="true"></div>
      <div class="window" role="dialog" aria-modal="true" aria-labelledby="title" @keydown=${this._onKey}>
        ${t?a.qy`<mc-ui-studio-frame
              studio="image-animator"
              fixed-drawer
              .scheme=${this.hass?.themes?.darkMode?"dark":"light"}
              .strings=${this._strings()}
              .selectionLabel=${ke(this._target)}
              .measure=${this._measure()}
              @mc-frame-drawer=${e=>this._drawerOpen=e.detail.open}
              @mc-frame-modified=${e=>this._modifiedOnly=e.detail.on}
            >
              <div slot="top" class="bar">
                ${i}
                ${this._status()}
                <button
                  class="btn btn-secondary settings"
                  type="button"
                  aria-label=${S(82)}
                  aria-controls="ia-drawer"
                  aria-expanded=${this._drawerOpen?"true":"false"}
                  aria-haspopup=${this._narrow?"dialog":a.s6}
                  @click=${this._toggleDrawer}
                >
                  ${S(82)}
                </button>
                ${n}
                <button class="btn btn-primary" type="button" ?disabled=${!e.canSave||this._saving||!!this._ask||!!this._leaving} @click=${this._save}>${S(77)}</button>
              </div>
              ${this._stageSlot(e)} ${this._drawerSlot(e)}
            </mc-ui-studio-frame>`:a.qy`<header>${i}${n}</header>
              <div class="body">${this._body()}</div>
              <footer>${this._status()}<button class="btn btn-primary" type="button" disabled>${S(77)}</button></footer>`}
        ${this._confirmBox()} ${this._leaveBox()}
      </div>`}}Ye.styles=[s.x,l.uE,Le],Je([(0,r.MZ)({attribute:!1})],Ye.prototype,"hass",void 0),Je([(0,r.MZ)({attribute:!1})],Ye.prototype,"source",void 0),Je([(0,r.wk)()],Ye.prototype,"_phase",void 0),Je([(0,r.wk)()],Ye.prototype,"_opened",void 0),Je([(0,r.wk)()],Ye.prototype,"_reason",void 0),Je([(0,r.wk)()],Ye.prototype,"_saving",void 0),Je([(0,r.wk)()],Ye.prototype,"_ask",void 0),Je([(0,r.wk)()],Ye.prototype,"_libraryBytes",void 0),Je([(0,r.wk)()],Ye.prototype,"_unchecked",void 0),Je([(0,r.wk)()],Ye.prototype,"_note",void 0),Je([(0,r.wk)()],Ye.prototype,"_leaving",void 0),Je([(0,r.wk)()],Ye.prototype,"_closeAfterSave",void 0),Je([(0,r.wk)()],Ye.prototype,"_target",void 0),Je([(0,r.wk)()],Ye.prototype,"_targets",void 0),Je([(0,r.wk)()],Ye.prototype,"_presetId",void 0),Je([(0,r.wk)()],Ye.prototype,"_path",void 0),Je([(0,r.wk)()],Ye.prototype,"_message",void 0),Je([(0,r.wk)()],Ye.prototype,"_morphFrom",void 0),Je([(0,r.wk)()],Ye.prototype,"_morphInto",void 0),Je([(0,r.wk)()],Ye.prototype,"_morphBack",void 0),Je([(0,r.wk)()],Ye.prototype,"_morphMessage",void 0),Je([(0,r.wk)()],Ye.prototype,"_clipId",void 0),Je([(0,r.wk)()],Ye.prototype,"_drafting",void 0),Je([(0,r.wk)()],Ye.prototype,"_clipMessage",void 0),Je([(0,r.wk)()],Ye.prototype,"_view",void 0),Je([(0,r.wk)()],Ye.prototype,"_drawerOpen",void 0),Je([(0,r.wk)()],Ye.prototype,"_narrow",void 0),Je([(0,r.wk)()],Ye.prototype,"_modifiedOnly",void 0);const Qe="2026.11.03-beta.3";function Xe(){customElements.get(n.hW)||customElements.define(n.hW,Ye)}const et=async(e,t)=>{if(!e.hass)return!1;Xe();const i=document.createElement(n.hW);i.hass=e.hass,i.source=t,i.opener=e;const a=e.getRootNode(),r=a instanceof ShadowRoot?a:document.body;return i.addEventListener("close",()=>{i.remove(),e.focus?.()}),r.appendChild(i),await i.updateComplete,!0},tt={version:"1.0.0",openImageAnimator:et,countImageUse:async function(e,t){return(await Ke(e,t)).count}}},2254(e,t,i){i.d(t,{Dd:()=>l,R3:()=>s,Uh:()=>c});var n=i(8518),a=i(4973),r=i(2873);const o=(0,a.Ev)("image-anim",()=>i.e(800).then(()=>i(3852)));function s(){return o.load().then(e=>e?o.module():void 0)}function l(){return(0,n.BR)().then(e=>e?.compileTracks)}function c(e){const t=e?.clips;return Array.isArray(t)&&t.some(e=>Array.isArray(e?.tracks)&&e.tracks.length>0)}i.d(t,["GV",0,()=>r.tQ.pause.load()])}};