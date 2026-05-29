(()=>{"use strict";var e={56(e,t,i){e.exports=function(e){var t=i.nc;t&&e.setAttribute("nonce",t)}},72(e){var t=[];function i(e){for(var i=-1,n=0;n<t.length;n++)if(t[n].identifier===e){i=n;break}return i}function n(e,n){for(var o={},a=[],s=0;s<e.length;s++){var l=e[s],c=n.base?l[0]+n.base:l[0],d=o[c]||0,p="".concat(c," ").concat(d);o[c]=d+1;var u=i(p),m={css:l[1],media:l[2],sourceMap:l[3],supports:l[4],layer:l[5]};if(-1!==u)t[u].references++,t[u].updater(m);else{var h=r(m,n);n.byIndex=s,t.splice(s,0,{identifier:p,updater:h,references:1})}a.push(p)}return a}function r(e,t){var i=t.domAPI(t);i.update(e);return function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;i.update(e=t)}else i.remove()}}e.exports=function(e,r){var o=n(e=e||[],r=r||{});return function(e){e=e||[];for(var a=0;a<o.length;a++){var s=i(o[a]);t[s].references--}for(var l=n(e,r),c=0;c<o.length;c++){var d=i(o[c]);0===t[d].references&&(t[d].updater(),t.splice(d,1))}o=l}}},113(e){e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}},124(e,t,i){i.d(t,{A:()=>s});var n=i(601),r=i.n(n),o=i(314),a=i.n(o)()(r());a.push([e.id,":root {\n  /*\n  --swiper-pagination-color: var(--swiper-theme-color);\n  --swiper-pagination-left: auto;\n  --swiper-pagination-right: 8px;\n  --swiper-pagination-bottom: 8px;\n  --swiper-pagination-top: auto;\n  --swiper-pagination-fraction-color: inherit;\n  --swiper-pagination-progressbar-bg-color: rgba(0,0,0,0.25);\n  --swiper-pagination-progressbar-size: 4px;\n  --swiper-pagination-bullet-size: 8px;\n  --swiper-pagination-bullet-width: 8px;\n  --swiper-pagination-bullet-height: 8px;\n  --swiper-pagination-bullet-border-radius: 50%;\n  --swiper-pagination-bullet-inactive-color: #000;\n  --swiper-pagination-bullet-inactive-opacity: 0.2;\n  --swiper-pagination-bullet-opacity: 1;\n  --swiper-pagination-bullet-horizontal-gap: 4px;\n  --swiper-pagination-bullet-vertical-gap: 6px;\n  */\n}\n.swiper-pagination {\n  position: absolute;\n  text-align: center;\n  transition: 300ms opacity;\n  transform: translate3d(0, 0, 0);\n  z-index: 10;\n  &.swiper-pagination-hidden {\n    opacity: 0;\n  }\n  .swiper-pagination-disabled > &,\n  &.swiper-pagination-disabled {\n    display: none !important;\n  }\n}\n/* Common Styles */\n.swiper-pagination-fraction,\n.swiper-pagination-custom,\n.swiper-horizontal > .swiper-pagination-bullets,\n.swiper-pagination-bullets.swiper-pagination-horizontal {\n  bottom: var(--swiper-pagination-bottom, 8px);\n  top: var(--swiper-pagination-top, auto);\n  left: 0;\n  width: 100%;\n}\n/* Bullets */\n.swiper-pagination-bullets-dynamic {\n  overflow: hidden;\n  font-size: 0;\n  .swiper-pagination-bullet {\n    transform: scale(0.33);\n    position: relative;\n  }\n  .swiper-pagination-bullet-active {\n    transform: scale(1);\n  }\n  .swiper-pagination-bullet-active-main {\n    transform: scale(1);\n  }\n  .swiper-pagination-bullet-active-prev {\n    transform: scale(0.66);\n  }\n  .swiper-pagination-bullet-active-prev-prev {\n    transform: scale(0.33);\n  }\n  .swiper-pagination-bullet-active-next {\n    transform: scale(0.66);\n  }\n  .swiper-pagination-bullet-active-next-next {\n    transform: scale(0.33);\n  }\n}\n.swiper-pagination-bullet {\n  width: var(--swiper-pagination-bullet-width, var(--swiper-pagination-bullet-size, 8px));\n  height: var(--swiper-pagination-bullet-height, var(--swiper-pagination-bullet-size, 8px));\n  display: inline-block;\n  border-radius: var(--swiper-pagination-bullet-border-radius, 50%);\n  background: var(--swiper-pagination-bullet-inactive-color, #000);\n  opacity: var(--swiper-pagination-bullet-inactive-opacity, 0.2);\n  button& {\n    border: none;\n    margin: 0;\n    padding: 0;\n    box-shadow: none;\n    appearance: none;\n  }\n  .swiper-pagination-clickable & {\n    cursor: pointer;\n  }\n\n  &:only-child {\n    display: none !important;\n  }\n}\n.swiper-pagination-bullet-active {\n  opacity: var(--swiper-pagination-bullet-opacity, 1);\n  background: var(--swiper-pagination-color, var(--swiper-theme-color));\n}\n\n.swiper-vertical > .swiper-pagination-bullets,\n.swiper-pagination-vertical.swiper-pagination-bullets {\n  right: var(--swiper-pagination-right, 8px);\n  left: var(--swiper-pagination-left, auto);\n  top: 50%;\n  transform: translate3d(0px, -50%, 0);\n  .swiper-pagination-bullet {\n    margin: var(--swiper-pagination-bullet-vertical-gap, 6px) 0;\n    display: block;\n  }\n  &.swiper-pagination-bullets-dynamic {\n    top: 50%;\n    transform: translateY(-50%);\n    width: 8px;\n    .swiper-pagination-bullet {\n      display: inline-block;\n      transition:\n        200ms transform,\n        200ms top;\n    }\n  }\n}\n.swiper-horizontal > .swiper-pagination-bullets,\n.swiper-pagination-horizontal.swiper-pagination-bullets {\n  .swiper-pagination-bullet {\n    margin: 0 var(--swiper-pagination-bullet-horizontal-gap, 4px);\n  }\n  &.swiper-pagination-bullets-dynamic {\n    left: 50%;\n    transform: translateX(-50%);\n    white-space: nowrap;\n    .swiper-pagination-bullet {\n      transition:\n        200ms transform,\n        200ms left;\n    }\n  }\n}\n.swiper-horizontal.swiper-rtl > .swiper-pagination-bullets-dynamic .swiper-pagination-bullet {\n  transition:\n    200ms transform,\n    200ms right;\n}\n/* Fraction */\n.swiper-pagination-fraction {\n  color: var(--swiper-pagination-fraction-color, inherit);\n}\n/* Progress */\n.swiper-pagination-progressbar {\n  background: var(--swiper-pagination-progressbar-bg-color, rgba(0, 0, 0, 0.25));\n  position: absolute;\n  .swiper-pagination-progressbar-fill {\n    background: var(--swiper-pagination-color, var(--swiper-theme-color));\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    transform: scale(0);\n    transform-origin: left top;\n  }\n  .swiper-rtl & .swiper-pagination-progressbar-fill {\n    transform-origin: right top;\n  }\n  .swiper-horizontal > &,\n  &.swiper-pagination-horizontal,\n  .swiper-vertical > &.swiper-pagination-progressbar-opposite,\n  &.swiper-pagination-vertical.swiper-pagination-progressbar-opposite {\n    width: 100%;\n    height: var(--swiper-pagination-progressbar-size, 4px);\n    left: 0;\n    top: 0;\n  }\n  .swiper-vertical > &,\n  &.swiper-pagination-vertical,\n  .swiper-horizontal > &.swiper-pagination-progressbar-opposite,\n  &.swiper-pagination-horizontal.swiper-pagination-progressbar-opposite {\n    width: var(--swiper-pagination-progressbar-size, 4px);\n    height: 100%;\n    left: 0;\n    top: 0;\n  }\n}\n.swiper-pagination-lock {\n  display: none;\n}\n",""]);const s=a},314(e){e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var i="",n=void 0!==t[5];return t[4]&&(i+="@supports (".concat(t[4],") {")),t[2]&&(i+="@media ".concat(t[2]," {")),n&&(i+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),i+=e(t),n&&(i+="}"),t[2]&&(i+="}"),t[4]&&(i+="}"),i}).join("")},t.i=function(e,i,n,r,o){"string"==typeof e&&(e=[[null,e,void 0]]);var a={};if(n)for(var s=0;s<this.length;s++){var l=this[s][0];null!=l&&(a[l]=!0)}for(var c=0;c<e.length;c++){var d=[].concat(e[c]);n&&a[d[0]]||(void 0!==o&&(void 0===d[5]||(d[1]="@layer".concat(d[5].length>0?" ".concat(d[5]):""," {").concat(d[1],"}")),d[5]=o),i&&(d[2]?(d[1]="@media ".concat(d[2]," {").concat(d[1],"}"),d[2]=i):d[2]=i),r&&(d[4]?(d[1]="@supports (".concat(d[4],") {").concat(d[1],"}"),d[4]=r):d[4]="".concat(r)),t.push(d))}},t}},506(e,t,i){i.d(t,{A:()=>s});var n=i(601),r=i.n(n),o=i(314),a=i.n(o)()(r());a.push([e.id,":root {\n  --swiper-navigation-size: 44px;\n  /*\n  --swiper-navigation-top-offset: 50%;\n  --swiper-navigation-sides-offset: 4px;\n  --swiper-navigation-color: var(--swiper-theme-color);\n  */\n}\n.swiper-button-prev,\n.swiper-button-next {\n  position: absolute;\n\n  width: var(--swiper-navigation-size);\n  height: var(--swiper-navigation-size);\n\n  z-index: 10;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--swiper-navigation-color, var(--swiper-theme-color));\n  &.swiper-button-disabled {\n    opacity: 0.35;\n    cursor: auto;\n    pointer-events: none;\n  }\n  &.swiper-button-hidden {\n    opacity: 0;\n    cursor: auto;\n    pointer-events: none;\n  }\n  .swiper-navigation-disabled & {\n    display: none !important;\n  }\n  svg {\n    width: 100%;\n    height: 100%;\n    object-fit: contain;\n    transform-origin: center;\n    fill: currentColor;\n    pointer-events: none;\n  }\n}\n\n.swiper-button-lock {\n  display: none;\n}\n\n.swiper-button-prev,\n.swiper-button-next {\n  top: var(--swiper-navigation-top-offset, 50%);\n  margin-top: calc(0px - (var(--swiper-navigation-size) / 2));\n}\n.swiper-button-prev {\n  left: var(--swiper-navigation-sides-offset, 4px);\n  right: auto;\n  .swiper-navigation-icon {\n    transform: rotate(180deg);\n  }\n}\n.swiper-button-next {\n  right: var(--swiper-navigation-sides-offset, 4px);\n  left: auto;\n}\n.swiper-horizontal {\n  .swiper-button-prev,\n  .swiper-button-next,\n  ~ .swiper-button-prev,\n  ~ .swiper-button-next {\n    top: var(--swiper-navigation-top-offset, 50%);\n    margin-top: calc(0px - (var(--swiper-navigation-size) / 2));\n    margin-left: 0;\n  }\n  .swiper-button-prev,\n  & ~ .swiper-button-prev,\n  &.swiper-rtl .swiper-button-next,\n  &.swiper-rtl ~ .swiper-button-next {\n    left: var(--swiper-navigation-sides-offset, 4px);\n    right: auto;\n  }\n  .swiper-button-next,\n  & ~ .swiper-button-next,\n  &.swiper-rtl .swiper-button-prev,\n  &.swiper-rtl ~ .swiper-button-prev {\n    right: var(--swiper-navigation-sides-offset, 4px);\n    left: auto;\n  }\n  .swiper-button-prev,\n  & ~ .swiper-button-prev,\n  &.swiper-rtl .swiper-button-next,\n  &.swiper-rtl ~ .swiper-button-next {\n    .swiper-navigation-icon {\n      transform: rotate(180deg);\n    }\n  }\n  &.swiper-rtl .swiper-button-prev,\n  &.swiper-rtl ~ .swiper-button-prev {\n    .swiper-navigation-icon {\n      transform: rotate(0deg);\n    }\n  }\n}\n.swiper-vertical {\n  .swiper-button-prev,\n  .swiper-button-next,\n  ~ .swiper-button-prev,\n  ~ .swiper-button-next {\n    left: var(--swiper-navigation-top-offset, 50%);\n    right: auto;\n    margin-left: calc(0px - (var(--swiper-navigation-size) / 2));\n    margin-top: 0;\n  }\n  .swiper-button-prev,\n  ~ .swiper-button-prev {\n    top: var(--swiper-navigation-sides-offset, 4px);\n    bottom: auto;\n    .swiper-navigation-icon {\n      transform: rotate(-90deg);\n    }\n  }\n  .swiper-button-next,\n  ~ .swiper-button-next {\n    bottom: var(--swiper-navigation-sides-offset, 4px);\n    top: auto;\n    .swiper-navigation-icon {\n      transform: rotate(90deg);\n    }\n  }\n}\n",""]);const s=a},540(e){e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},601(e){e.exports=function(e){return e[1]}},659(e){var t={};e.exports=function(e,i){var n=function(e){if(void 0===t[e]){var i=document.querySelector(e);if(window.HTMLIFrameElement&&i instanceof window.HTMLIFrameElement)try{i=i.contentDocument.head}catch(e){i=null}t[e]=i}return t[e]}(e);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");n.appendChild(i)}},825(e){e.exports=function(e){if("undefined"==typeof document)return{update:function(){},remove:function(){}};var t=e.insertStyleElement(e);return{update:function(i){!function(e,t,i){var n="";i.supports&&(n+="@supports (".concat(i.supports,") {")),i.media&&(n+="@media ".concat(i.media," {"));var r=void 0!==i.layer;r&&(n+="@layer".concat(i.layer.length>0?" ".concat(i.layer):""," {")),n+=i.css,r&&(n+="}"),i.media&&(n+="}"),i.supports&&(n+="}");var o=i.sourceMap;o&&"undefined"!=typeof btoa&&(n+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),t.styleTagTransform(n,e,t.options)}(t,e,i)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}},870(e,t,i){i.d(t,{A:()=>s});var n=i(601),r=i.n(n),o=i(314),a=i.n(o)()(r());a.push([e.id,"/**\n * Swiper 12.1.0\n * Most modern mobile touch slider and framework with hardware accelerated transitions\n * https://swiperjs.com\n *\n * Copyright 2014-2026 Vladimir Kharlampidi\n *\n * Released under the MIT License\n *\n * Released on: January 28, 2026\n */\n\n:root {\n  --swiper-theme-color: #007aff;\n  /*\n  --swiper-preloader-color: var(--swiper-theme-color);\n  --swiper-wrapper-transition-timing-function: initial;\n  */\n}\n:host {\n  position: relative;\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n  z-index: 1;\n}\n.swiper {\n  margin-left: auto;\n  margin-right: auto;\n  position: relative;\n  overflow: hidden;\n  list-style: none;\n  padding: 0;\n  /* Fix of Webkit flickering */\n  z-index: 1;\n  display: block;\n}\n.swiper-vertical > .swiper-wrapper {\n  flex-direction: column;\n}\n.swiper-wrapper {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n  display: flex;\n  transition-property: transform;\n  transition-timing-function: var(--swiper-wrapper-transition-timing-function, initial);\n  box-sizing: content-box;\n}\n.swiper-android .swiper-slide,\n.swiper-ios .swiper-slide,\n.swiper-wrapper {\n  transform: translate3d(0px, 0, 0);\n}\n.swiper-horizontal {\n  touch-action: pan-y;\n}\n.swiper-vertical {\n  touch-action: pan-x;\n}\n.swiper-slide {\n  flex-shrink: 0;\n  width: 100%;\n  height: 100%;\n  position: relative;\n  transition-property: transform;\n  display: block;\n}\n.swiper-slide-invisible-blank {\n  visibility: hidden;\n}\n/* Auto Height */\n.swiper-autoheight,\n.swiper-autoheight .swiper-slide {\n  height: auto;\n}\n.swiper-autoheight .swiper-wrapper {\n  align-items: flex-start;\n  transition-property: transform, height;\n}\n.swiper-backface-hidden .swiper-slide {\n  transform: translateZ(0);\n  backface-visibility: hidden;\n}\n/* 3D Effects */\n.swiper-3d.swiper-css-mode .swiper-wrapper {\n  perspective: 1200px;\n}\n.swiper-3d .swiper-wrapper {\n  transform-style: preserve-3d;\n}\n.swiper-3d {\n  perspective: 1200px;\n  .swiper-slide,\n  .swiper-cube-shadow {\n    transform-style: preserve-3d;\n  }\n}\n\n/* CSS Mode */\n.swiper-css-mode {\n  > .swiper-wrapper {\n    overflow: auto;\n    scrollbar-width: none; /* For Firefox */\n    -ms-overflow-style: none; /* For Internet Explorer and Edge */\n    &::-webkit-scrollbar {\n      display: none;\n    }\n  }\n  > .swiper-wrapper > .swiper-slide {\n    scroll-snap-align: start start;\n  }\n  &.swiper-horizontal {\n    > .swiper-wrapper {\n      scroll-snap-type: x mandatory;\n    }\n    > .swiper-wrapper > .swiper-slide:first-child {\n      margin-inline-start: var(--swiper-slides-offset-before);\n      scroll-margin-inline-start: var(--swiper-slides-offset-before);\n    }\n    > .swiper-wrapper > .swiper-slide:last-child {\n      margin-inline-end: var(--swiper-slides-offset-after);\n    }\n  }\n  &.swiper-vertical {\n    > .swiper-wrapper {\n      scroll-snap-type: y mandatory;\n    }\n    > .swiper-wrapper > .swiper-slide:first-child {\n      margin-block-start: var(--swiper-slides-offset-before);\n      scroll-margin-block-start: var(--swiper-slides-offset-before);\n    }\n    > .swiper-wrapper > .swiper-slide:last-child {\n      margin-block-end: var(--swiper-slides-offset-after);\n    }\n  }\n  &.swiper-free-mode {\n    > .swiper-wrapper {\n      scroll-snap-type: none;\n    }\n    > .swiper-wrapper > .swiper-slide {\n      scroll-snap-align: none;\n    }\n  }\n  &.swiper-centered {\n    > .swiper-wrapper::before {\n      content: '';\n      flex-shrink: 0;\n      order: 9999;\n    }\n    > .swiper-wrapper > .swiper-slide {\n      scroll-snap-align: center center;\n      scroll-snap-stop: always;\n    }\n  }\n  &.swiper-centered.swiper-horizontal {\n    > .swiper-wrapper > .swiper-slide:first-child {\n      margin-inline-start: var(--swiper-centered-offset-before);\n    }\n    > .swiper-wrapper::before {\n      height: 100%;\n      min-height: 1px;\n      width: var(--swiper-centered-offset-after);\n    }\n  }\n  &.swiper-centered.swiper-vertical {\n    > .swiper-wrapper > .swiper-slide:first-child {\n      margin-block-start: var(--swiper-centered-offset-before);\n    }\n    > .swiper-wrapper::before {\n      width: 100%;\n      min-width: 1px;\n      height: var(--swiper-centered-offset-after);\n    }\n  }\n}\n\n/* Slide styles start */\n/* 3D Shadows */\n.swiper-3d {\n  .swiper-slide-shadow,\n  .swiper-slide-shadow-left,\n  .swiper-slide-shadow-right,\n  .swiper-slide-shadow-top,\n  .swiper-slide-shadow-bottom,\n  .swiper-slide-shadow,\n  .swiper-slide-shadow-left,\n  .swiper-slide-shadow-right,\n  .swiper-slide-shadow-top,\n  .swiper-slide-shadow-bottom {\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: 100%;\n    height: 100%;\n    pointer-events: none;\n    z-index: 10;\n  }\n  .swiper-slide-shadow {\n    background: rgba(0, 0, 0, 0.15);\n  }\n  .swiper-slide-shadow-left {\n    background-image: linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  }\n  .swiper-slide-shadow-right {\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  }\n  .swiper-slide-shadow-top {\n    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  }\n  .swiper-slide-shadow-bottom {\n    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  }\n}\n.swiper-lazy-preloader {\n  width: 42px;\n  height: 42px;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  margin-left: -21px;\n  margin-top: -21px;\n  z-index: 10;\n  transform-origin: 50%;\n  box-sizing: border-box;\n  border: 4px solid var(--swiper-preloader-color, var(--swiper-theme-color));\n  border-radius: 50%;\n  border-top-color: transparent;\n}\n.swiper:not(.swiper-watch-progress),\n.swiper-watch-progress .swiper-slide-visible {\n  .swiper-lazy-preloader {\n    animation: swiper-preloader-spin 1s infinite linear;\n  }\n}\n.swiper-lazy-preloader-white {\n  --swiper-preloader-color: #fff;\n}\n.swiper-lazy-preloader-black {\n  --swiper-preloader-color: #000;\n}\n@keyframes swiper-preloader-spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n/* Slide styles end */\n",""]);const s=a}},t={};function i(n){var r=t[n];if(void 0!==r)return r.exports;var o=t[n]={id:n,exports:{}};return e[n](o,o.exports,i),o.exports}i.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return i.d(t,{a:t}),t},i.d=(e,t)=>{for(var n in t)i.o(t,n)&&!i.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),i.nc=void 0;const n="magic-card",r="magic-card-editor",o=["content","controls","layout","advanced"],a=480,s=768,l=1024,c=1280,d=globalThis,p=d.ShadowRoot&&(void 0===d.ShadyCSS||d.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,u=Symbol(),m=new WeakMap;class h{constructor(e,t,i){if(this._$cssResult$=!0,i!==u)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(p&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=m.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&m.set(t,e))}return e}toString(){return this.cssText}}const g=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new h(i,e,u)},v=(e,t)=>{if(p)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),n=d.litNonce;void 0!==n&&t.setAttribute("nonce",n),t.textContent=i.cssText,e.appendChild(t)}},f=p?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new h("string"==typeof e?e:e+"",void 0,u))(t)})(e):e,{is:b,defineProperty:y,getOwnPropertyDescriptor:x,getOwnPropertyNames:_,getOwnPropertySymbols:w,getPrototypeOf:k}=Object,$=globalThis,S=$.trustedTypes,C=S?S.emptyScript:"",T=$.reactiveElementPolyfillSupport,M=(e,t)=>e,z={toAttribute(e,t){switch(t){case Boolean:e=e?C:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},A=(e,t)=>!b(e,t),E={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:A};Symbol.metadata??=Symbol("metadata"),$.litPropertyMetadata??=new WeakMap;class P extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=E){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&y(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:r}=x(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const o=n?.call(this);r?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??E}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;const e=k(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){const e=this.properties,t=[..._(e),...w(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(f(e))}else void 0!==e&&t.push(f(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return v(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:z).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:z;this._$Em=n;const o=r.fromAttribute(t,e.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(e,t,i,n=!1,r){if(void 0!==e){const o=this.constructor;if(!1===n&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??A)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==r||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}P.elementStyles=[],P.shadowRootOptions={mode:"open"},P[M("elementProperties")]=new Map,P[M("finalized")]=new Map,T?.({ReactiveElement:P}),($.reactiveElementVersions??=[]).push("2.1.2");const I=globalThis,R=e=>e,L=I.trustedTypes,D=L?L.createPolicy("lit-html",{createHTML:e=>e}):void 0,O="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,j="?"+N,F=`<${j}>`,B=document,H=()=>B.createComment(""),G=e=>null===e||"object"!=typeof e&&"function"!=typeof e,U=Array.isArray,V=e=>U(e)||"function"==typeof e?.[Symbol.iterator],q="[ \t\n\f\r]",W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Q=/-->/g,Y=/>/g,X=RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),K=/'/g,Z=/"/g,J=/^(?:script|style|textarea|title)$/i,ee=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),te=ee(1),ie=(ee(2),ee(3),Symbol.for("lit-noChange")),ne=Symbol.for("lit-nothing"),re=new WeakMap,oe=B.createTreeWalker(B,129);function ae(e,t){if(!U(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==D?D.createHTML(t):t}const se=(e,t)=>{const i=e.length-1,n=[];let r,o=2===t?"<svg>":3===t?"<math>":"",a=W;for(let t=0;t<i;t++){const i=e[t];let s,l,c=-1,d=0;for(;d<i.length&&(a.lastIndex=d,l=a.exec(i),null!==l);)d=a.lastIndex,a===W?"!--"===l[1]?a=Q:void 0!==l[1]?a=Y:void 0!==l[2]?(J.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=X):void 0!==l[3]&&(a=X):a===X?">"===l[0]?(a=r??W,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,s=l[1],a=void 0===l[3]?X:'"'===l[3]?Z:K):a===Z||a===K?a=X:a===Q||a===Y?a=W:(a=X,r=void 0);const p=a===X&&e[t+1].startsWith("/>")?" ":"";o+=a===W?i+F:c>=0?(n.push(s),i.slice(0,c)+O+i.slice(c)+N+p):i+N+(-2===c?t:p)}return[ae(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class le{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let r=0,o=0;const a=e.length-1,s=this.parts,[l,c]=se(e,t);if(this.el=le.createElement(l,i),oe.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=oe.nextNode())&&s.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(O)){const t=c[o++],i=n.getAttribute(e).split(N),a=/([.?@])?(.*)/.exec(t);s.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?me:"?"===a[1]?he:"@"===a[1]?ge:ue}),n.removeAttribute(e)}else e.startsWith(N)&&(s.push({type:6,index:r}),n.removeAttribute(e));if(J.test(n.tagName)){const e=n.textContent.split(N),t=e.length-1;if(t>0){n.textContent=L?L.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],H()),oe.nextNode(),s.push({type:2,index:++r});n.append(e[t],H())}}}else if(8===n.nodeType)if(n.data===j)s.push({type:2,index:r});else{let e=-1;for(;-1!==(e=n.data.indexOf(N,e+1));)s.push({type:7,index:r}),e+=N.length-1}r++}}static createElement(e,t){const i=B.createElement("template");return i.innerHTML=e,i}}function ce(e,t,i=e,n){if(t===ie)return t;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const o=G(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(e),r._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(t=ce(e,r._$AS(e,t.values),r,n)),t}class de{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??B).importNode(t,!0);oe.currentNode=n;let r=oe.nextNode(),o=0,a=0,s=i[0];for(;void 0!==s;){if(o===s.index){let t;2===s.type?t=new pe(r,r.nextSibling,this,e):1===s.type?t=new s.ctor(r,s.name,s.strings,this,e):6===s.type&&(t=new ve(r,this,e)),this._$AV.push(t),s=i[++a]}o!==s?.index&&(r=oe.nextNode(),o++)}return oe.currentNode=B,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class pe{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=ne,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ce(this,e,t),G(e)?e===ne||null==e||""===e?(this._$AH!==ne&&this._$AR(),this._$AH=ne):e!==this._$AH&&e!==ie&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):V(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==ne&&G(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=le.createElement(ae(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new de(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=re.get(e.strings);return void 0===t&&re.set(e.strings,t=new le(e)),t}k(e){U(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const r of e)n===t.length?t.push(i=new pe(this.O(H()),this.O(H()),this,this.options)):i=t[n],i._$AI(r),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=R(e).nextSibling;R(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ue{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,r){this.type=1,this._$AH=ne,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=ne}_$AI(e,t=this,i,n){const r=this.strings;let o=!1;if(void 0===r)e=ce(this,e,t,0),o=!G(e)||e!==this._$AH&&e!==ie,o&&(this._$AH=e);else{const n=e;let a,s;for(e=r[0],a=0;a<r.length-1;a++)s=ce(this,n[i+a],t,a),s===ie&&(s=this._$AH[a]),o||=!G(s)||s!==this._$AH[a],s===ne?e=ne:e!==ne&&(e+=(s??"")+r[a+1]),this._$AH[a]=s}o&&!n&&this.j(e)}j(e){e===ne?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class me extends ue{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===ne?void 0:e}}class he extends ue{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==ne)}}class ge extends ue{constructor(e,t,i,n,r){super(e,t,i,n,r),this.type=5}_$AI(e,t=this){if((e=ce(this,e,t,0)??ne)===ie)return;const i=this._$AH,n=e===ne&&i!==ne||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==ne&&(i===ne||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ve{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ce(this,e)}}const fe={M:O,P:N,A:j,C:1,L:se,R:de,D:V,V:ce,I:pe,H:ue,N:he,U:ge,B:me,F:ve},be=I.litHtmlPolyfillSupport;be?.(le,pe),(I.litHtmlVersions??=[]).push("3.3.2");const ye=globalThis;class xe extends P{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let r=n._$litPart$;if(void 0===r){const e=i?.renderBefore??null;n._$litPart$=r=new pe(t.insertBefore(H(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return ie}}xe._$litElement$=!0,xe.finalized=!0,ye.litElementHydrateSupport?.({LitElement:xe});const _e=ye.litElementPolyfillSupport;_e?.({LitElement:xe});(ye.litElementVersions??=[]).push("4.2.2");const we=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ke={attribute:!0,type:String,converter:z,reflect:!1,hasChanged:A},$e=(e=ke,t,i)=>{const{kind:n,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,r,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const r=this[n];t.call(this,i),this.requestUpdate(n,r,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function Se(e){return(t,i)=>"object"==typeof i?$e(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function Ce(e){return Se({...e,state:!0,attribute:!1})}const Te=g`
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
`,Me=[Te,g`
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

  .mc-row {
    display: grid;
    gap: var(--mc-gap);
    align-items: start;
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
    word-break: break-word;
  }

  .mc-text {
    font-size: var(--mc-font-size, inherit);
  }

  .mc-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .mc-icon ha-icon {
    --mdc-icon-size: var(--mc-icon-size, 24px);
  }

  .mc-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mc-info-name {
    font-weight: 500;
    font-size: var(--mc-font-size-md);
    color: var(--mc-text);
  }

  .mc-info-state {
    font-size: var(--mc-font-size-xl);
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-info-secondary {
    font-size: var(--mc-font-size-sm);
    color: var(--mc-text-secondary);
  }

  .mc-image {
    width: 100%;
    overflow: hidden;
  }

  .mc-image img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
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
    color: var(--mc-text-secondary);
    white-space: nowrap;
  }

  /* Bar horizontal layout */
  .mc-bar-horizontal {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    width: 100%;
  }

  .mc-bar-horizontal .mc-bar-track {
    flex: 1;
    border-radius: var(--mc-bar-radius);
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
    border-radius: var(--mc-bar-radius);
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
    border-radius: var(--mc-button-radius);
    border: 1px solid var(--mc-border);
    background: var(--mc-bg);
    color: var(--mc-text);
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
    border-radius: var(--mc-button-radius);
    border: none;
    background: var(--mc-button-color);
    color: var(--mc-button-text-color);
    cursor: pointer;
    font-size: var(--mc-button-font-size);
    font-weight: 500;
  }

  .mc-button-inner ha-icon {
    --mdc-icon-size: var(--mc-button-icon-size);
  }

  .mc-button-inner--default {
    background: var(--mc-button-color);
    color: var(--mc-button-text-color);
    border: none;
  }

  .mc-button-inner--outline {
    background: transparent;
    color: var(--mc-button-color);
    border: 1px solid var(--mc-button-color);
  }

  .mc-button-inner--flat {
    background: transparent;
    color: var(--mc-button-color);
    border: none;
  }

  .mc-button-inner--icon-only {
    padding: var(--mc-button-padding-icon);
  }

  .mc-button-state {
    opacity: 0.8;
    font-size: var(--mc-font-size-xs);
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
    color: var(--mc-text-secondary);
  }

  /* Slider container layout */
  .mc-slider-container {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
    width: 100%;
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
    color: var(--mc-spinbox-btn-text-color);
    font-size: var(--mc-spinbox-btn-font-size);
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
  }

  .mc-spinbox-value {
    font-size: var(--mc-spinbox-value-font-size);
    font-weight: var(--mc-spinbox-value-font-weight);
    min-width: var(--mc-spinbox-value-min-width);
    text-align: center;
  }

  /* Dropdown */
  .mc-dropdown {
    width: 100%;
  }

  .mc-dropdown select {
    width: 100%;
    padding: var(--mc-dropdown-padding);
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-dropdown-radius);
    background: var(--mc-bg);
    color: var(--mc-text);
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
    align-items: center;
    gap: var(--mc-gap-md);
  }

  .mc-light-header {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-sm);
  }

  .mc-light-header ha-icon {
    --mdc-icon-size: var(--mc-icon-size-lg);
  }

  .mc-light--compact .mc-light-header ha-icon {
    --mdc-icon-size: var(--mc-icon-size-md);
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

  .mc-light-value {
    font-size: var(--mc-font-size-xs);
    min-width: 32px;
    text-align: right;
  }

  .mc-light-color-input {
    width: var(--mc-light-color-input-size);
    height: var(--mc-light-color-input-size);
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .mc-slider {
    width: 100%;
    position: relative;
  }

  .mc-slider .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mc-slider .swiper-button-prev,
  .mc-slider .swiper-button-next {
    color: var(--mc-primary);
    --swiper-navigation-size: 24px;
  }

  .mc-slider .swiper-pagination-bullet-active {
    background: var(--mc-primary);
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
    color: var(--mc-text-secondary);
    border-bottom: 2px solid transparent;
    transition: all var(--mc-transition-duration);
  }

  .mc-tab-button.active {
    color: var(--mc-primary);
    border-bottom-color: var(--mc-primary);
  }

  .mc-tab-button ha-icon {
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
    color: var(--text-primary-color, #fff);
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
    color: var(--mc-text-secondary);
  }

  /* Weather module */
  .mc-weather {
    display: flex;
    align-items: center;
    gap: var(--mc-gap-md);
  }

  .mc-weather > ha-icon {
    --mdc-icon-size: var(--mc-icon-size-xl);
  }

  .mc-weather-temp {
    font-size: 2rem;
    font-weight: 600;
  }

  .mc-weather-condition {
    font-size: var(--mc-font-size-md);
    color: var(--mc-text-secondary);
    text-transform: capitalize;
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

  .mc-forecast-item ha-icon {
    --mdc-icon-size: var(--mc-forecast-icon-size);
  }

  .mc-forecast-label {
    font-size: var(--mc-font-size-xs);
    color: var(--mc-text-secondary);
  }

  .mc-forecast-temp {
    font-size: var(--mc-font-size-md);
  }

  .mc-video-bg {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .mc-video-bg video {
    width: 100%;
    display: block;
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
  }

  .mc-camera img {
    width: 100%;
    display: block;
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
    font-size: var(--mc-font-size-xs);
    color: var(--mc-text-secondary);
    margin-top: var(--mc-gap-xs);
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

  /* Nested row module */
  .mc-nested-row {
    width: 100%;
    min-width: 0;
  }

  .mc-nested-col {
    display: flex;
    flex-direction: column;
    gap: var(--mc-gap);
    min-width: 0;
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

  .mc-module-wrapper[role='button'] {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .mc-module-wrapper[role='button']:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
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
`],ze=g`
  :host {
    color: var(--primary-text-color, #1a1a2e);
    font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
  }

  input,
  select,
  textarea,
  button {
    font-family: inherit;
    color: inherit;
  }

  input[type='text'],
  input[type='number'],
  input[type='time'],
  select,
  textarea {
    padding: 8px 10px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    box-sizing: border-box;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #6366f1) 20%, transparent);
  }

  button {
    border-radius: 8px;
  }
`,Ae=[Te,ze,g`
  :host {
    display: block;
  }

  .mc-editor {
    padding: 20px;
    font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
    color: var(--mc-text);
  }

  /* Mode Switcher */
  .mc-mode-switcher {
    display: flex;
    gap: 4px;
    margin-bottom: 8px;
    background: var(--mc-surface-recessed);
    border-radius: var(--mc-radius-md);
    padding: 4px;
  }

  .mc-mode-btn {
    flex: 1;
    padding: 8px 14px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    transition: background 150ms ease, color 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .mc-mode-btn.active {
    background: var(--mc-bg);
    color: var(--mc-primary);
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.06),
      0 0 0 1px color-mix(in srgb, var(--mc-primary) 10%, transparent);
  }

  .mc-mode-btn:hover:not(.active) {
    color: var(--mc-text);
  }

  .mc-mode-help {
    margin: 0 0 20px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
    line-height: 1.5;
    max-width: 60ch;
  }

  /* Toolbar */
  .mc-editor-toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
  }

  .mc-toolbar-spacer {
    flex: 1;
  }

  .mc-toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    color: var(--mc-text-secondary);
    transition: all 0.15s;
  }

  .mc-toolbar-btn:hover:not(:disabled) {
    background: var(--mc-border);
    color: var(--mc-text);
  }

  .mc-toolbar-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .mc-editor-toolbar .mc-btn {
    height: 32px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  .mc-linked-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 32px;
    height: 32px;
    color: var(--mc-primary);
    background: var(--mc-primary-light);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
  }

  .mc-linked-indicator:hover {
    filter: brightness(0.95);
  }

  .mc-linked-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 8px;
    background: var(--mc-primary);
    color: var(--text-primary-color, #fff);
    font-size: 10px;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
    box-shadow: 0 0 0 2px var(--mc-bg);
  }

  /* Linked template popup */
  .mc-linked-popup {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 4px;
    background: var(--card-background-color, #fff);
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 12px;
    min-width: 220px;
    z-index: 100;
  }

  .mc-linked-popup-name {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mc-linked-popup-sync-summary {
    padding: 8px 0;
    margin-bottom: 4px;
    border-top: 1px solid var(--mc-border);
    border-bottom: 1px solid var(--mc-border);
  }

  .mc-sync-summary-header {
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 600;
    color: var(--warning-color, #ff9800);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .mc-sync-summary-header.synced {
    color: var(--success-color, #4caf50);
    margin-bottom: 0;
  }

  .mc-sync-summary-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    max-height: 150px;
    overflow-y: auto;
  }

  .mc-sync-summary-item {
    display: flex;
    flex-direction: column;
    padding: 3px 0 3px 20px;
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-sync-summary-location {
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-sync-summary-paths {
    color: var(--secondary-text-color, #666);
  }

  .mc-linked-popup-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-linked-popup-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--ha-font-size-s, 0.875rem);
    color: var(--mc-text);
    transition: background 0.15s;
    width: 100%;
    text-align: left;
  }

  .mc-linked-popup-btn:hover {
    background: var(--mc-border);
  }

  .mc-linked-popup-btn.danger {
    color: var(--error-color, #f44336);
  }

  .mc-linked-popup-btn.danger:hover {
    background: color-mix(in srgb, var(--error-color, #f44336) 10%, transparent);
  }

  /* Toolbar container for popup positioning */
  .mc-toolbar-linked-container {
    position: relative;
  }

  .mc-selected-context {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: none;
    border-left: 3px solid var(--mc-primary);
    border-radius: 6px;
    background: var(--mc-primary-light);
    margin-bottom: 12px;
    font-size: var(--ha-font-size-s, 0.875rem);
    color: var(--mc-text);
  }

  .mc-selected-context ha-icon {
    color: var(--mc-primary);
    flex-shrink: 0;
  }

  .mc-selected-context strong {
    font-weight: 600;
    color: var(--mc-primary);
  }

  /* Sync confirmation dialog */
  .mc-sync-dialog {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    padding: 16px;
  }

  .mc-sync-dialog-content {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    width: 360px;
    max-width: 100%;
    padding: 20px;
  }

  .mc-sync-dialog-title {
    font-size: var(--ha-font-size-m, 1rem);
    font-weight: 600;
    color: var(--primary-text-color);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-sync-dialog-text {
    font-size: var(--ha-font-size-s, 0.875rem);
    color: var(--secondary-text-color);
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .mc-sync-dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  /* Settings Panel */
  .mc-settings-panel {
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-md);
    overflow: hidden;
    margin-top: 12px;
  }

  .mc-settings-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    background: var(--mc-primary-light);
    border-bottom: 1px solid var(--mc-border);
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
  }

  .mc-settings-tabs {
    display: flex;
    border-bottom: 1px solid var(--mc-border);
  }

  .mc-settings-tab {
    flex: 1;
    padding: 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
    text-align: center;
  }

  .mc-settings-tab.active {
    color: var(--mc-primary);
    border-bottom-color: var(--mc-primary);
  }

  .mc-settings-tab:hover:not(.active) {
    color: var(--mc-text);
  }

  .mc-settings-content {
    padding: 16px;
  }

  .mc-bp-xs,
  .mc-bp-sm {
    padding: 14px;
  }

  .mc-bp-xs .mc-mode-switcher,
  .mc-bp-sm .mc-mode-switcher {
    margin-bottom: 14px;
  }

  .mc-bp-xs .mc-mode-btn,
  .mc-bp-sm .mc-mode-btn {
    font-size: var(--ha-font-size-xs, 0.75rem);
    padding: 8px 10px;
    gap: 5px;
  }

  .mc-bp-xs .mc-editor-toolbar,
  .mc-bp-sm .mc-editor-toolbar {
    gap: 6px;
    margin-bottom: 10px;
  }

  .mc-bp-xs .mc-btn,
  .mc-bp-sm .mc-btn {
    padding: 8px 10px;
  }

  /* Shared Form Styles */
  .mc-tab-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .mc-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mc-section-header {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
    padding-bottom: 6px;
    border-bottom: 1px solid var(--mc-border);
    margin-top: 12px;
  }

  .mc-section-header-split {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mc-section-header-actions {
    display: flex;
    gap: 4px;
  }

  .mc-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .mc-field-label {
    font-size: var(--mc-font-size-xs, 0.75rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .mc-field input[type='text'],
  .mc-field input[type='number'],
  .mc-field select,
  .mc-field textarea {
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  .mc-field input:focus,
  .mc-field select:focus,
  .mc-field textarea:focus {
    border-color: var(--mc-primary);
  }

  .mc-field-toggle {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .mc-field-toggle input[type='checkbox'] {
    width: 18px;
    height: 18px;
    accent-color: var(--mc-primary);
  }

  .mc-field-hint {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
    font-style: italic;
  }

  .mc-field-hint-tight {
    margin-top: -4px;
    margin-bottom: 8px;
  }

  .mc-field-hint-with-margin {
    margin-bottom: 8px;
  }

  .mc-entity-field {
    position: relative;
  }

  .mc-entity-field input {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .mc-entity-field input:focus {
    border-color: var(--mc-primary);
  }

  /* Buttons */
  .mc-btn {
    padding: 10px 18px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    transition: all 0.15s;
  }

  .mc-btn-primary {
    background: var(--mc-primary);
    color: var(--text-primary-color, #fff);
  }

  .mc-btn-primary:hover {
    filter: brightness(1.1);
  }

  .mc-btn-secondary {
    background: var(--mc-surface-recessed);
    color: var(--mc-text);
  }

  .mc-btn-secondary:hover {
    background: color-mix(in srgb, var(--mc-text) 10%, transparent);
  }

  .mc-btn-compact {
    padding: 4px 8px;
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    font-size: 1rem;
    transition: all 0.15s;
  }

  .mc-btn-icon:hover {
    background: var(--mc-border);
    color: var(--mc-text);
  }

  .mc-inline-field-row {
    flex-direction: row;
    gap: 8px;
    align-items: center;
  }

  .mc-editor-tab-switcher {
    margin-bottom: 8px;
  }

  .mc-child-module-item {
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    margin-bottom: 4px;
    overflow: hidden;
  }

  .mc-child-module-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    cursor: pointer;
    background: var(--secondary-background-color, #f5f5f5);
  }

  .mc-child-module-title {
    flex: 1;
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  .mc-child-module-body {
    padding: 8px;
    border-top: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
  }

  .mc-child-module-add-row {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
  }

  .mc-child-module-select {
    flex: 1;
    padding: 6px 8px;
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  .mc-option-row {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    margin-bottom: 8px;
  }

  .mc-option-row .mc-field {
    flex: 1;
  }

  .mc-card-editor-section {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
  }

  .mc-card-editor-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 6%, transparent);
    border-bottom: 1px solid var(--divider-color, #e5e7eb);
  }

  .mc-card-editor-icon {
    --mdc-icon-size: 16px;
  }

  .mc-card-editor-body {
    padding: 16px;
  }

  .mc-yaml-fallback textarea {
    width: 100%;
    min-height: 200px;
    font-family: monospace;
    font-size: 0.8125rem;
    resize: vertical;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    padding: 12px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    box-sizing: border-box;
  }

  .mc-yaml-fallback textarea:focus {
    outline: none;
    border-color: var(--primary-color, #6366f1);
  }

  .mc-yaml-fallback-note {
    margin-bottom: 8px;
    font-size: 0.8125rem;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-yaml-fallback-error {
    color: var(--error-color, #ef4444);
    font-size: 0.8125rem;
    margin-top: 4px;
  }

  .mc-yaml-fallback-help {
    margin-top: 4px;
    font-size: 0.75rem;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-editor-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
    color: var(--secondary-text-color, #757575);
    font-size: 0.875rem;
  }

  /* Editor skeleton (loading state) */
  @keyframes mc-skel-shimmer {
    0%   { background-position: -240px 0; }
    100% { background-position: calc(240px + 100%) 0; }
  }

  .mc-skel {
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--mc-text) 5%, transparent) 25%,
      color-mix(in srgb, var(--mc-text) 10%, transparent) 50%,
      color-mix(in srgb, var(--mc-text) 5%, transparent) 75%
    );
    background-size: 240px 100%;
    background-repeat: no-repeat;
    background-color: var(--mc-surface-recessed);
    border-radius: 6px;
    animation: mc-skel-shimmer 1.4s ease-in-out infinite;
  }

  .mc-skel-switcher {
    height: 44px;
    border-radius: var(--mc-radius-md);
    margin-bottom: 8px;
  }

  .mc-skel-line {
    height: 12px;
    margin-bottom: 20px;
  }

  .mc-skel-line-short {
    width: 60%;
  }

  .mc-skel-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .mc-skel-spacer {
    flex: 1;
  }

  .mc-skel-icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }

  .mc-skel-pill {
    width: 100px;
    height: 32px;
    border-radius: 8px;
  }

  .mc-skel-card-header {
    height: 44px;
    margin-bottom: 12px;
    border-radius: 8px;
  }

  .mc-skel-row {
    height: 96px;
    margin-bottom: 12px;
    border-radius: 8px;
  }

  /* Condition items */
  .mc-condition-item {
    padding: 16px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-md);
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
  }

  .mc-condition-item .mc-btn-icon {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .mc-conditions-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 8px 0;
  }

  /* Conditional Appearance section */
  .mc-cond-appearance-section {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mc-cond-appearance-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--mc-text, var(--primary-text-color));
  }

  .mc-cond-appearance-header ha-icon {
    --mdc-icon-size: 18px;
    color: var(--primary-color, #6366f1);
  }

  .mc-cond-appearance-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-cond-appearance-rule {
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 4%, transparent);
    overflow: hidden;
  }

  .mc-cond-appearance-rule.expanded {
    border-color: color-mix(in srgb, var(--primary-color, #6366f1) 30%, var(--mc-border, var(--divider-color, #e5e7eb)));
  }

  .mc-cond-appearance-rule-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    cursor: pointer;
    user-select: none;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 6%, transparent);
  }

  .mc-cond-appearance-rule-header:hover {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
  }

  .mc-cond-appearance-rule-header ha-icon {
    --mdc-icon-size: 18px;
    color: var(--mc-text-secondary, var(--secondary-text-color));
  }

  .mc-cond-appearance-rule-name {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--mc-text, var(--primary-text-color));
    padding: 4px 6px;
    border-radius: 4px;
    min-width: 0;
  }

  .mc-cond-appearance-rule-name:hover,
  .mc-cond-appearance-rule-name:focus {
    background: var(--mc-bg, var(--card-background-color, #fff));
    outline: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
  }

  .mc-cond-appearance-rule-count {
    font-size: 0.7rem;
    color: var(--mc-text-secondary, var(--secondary-text-color));
    padding: 2px 6px;
    background: var(--mc-bg, var(--card-background-color, #fff));
    border-radius: 10px;
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
  }

  .mc-cond-appearance-rule-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--mc-bg, var(--card-background-color, #fff));
  }

  .mc-cond-appearance-subhead {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mc-text-secondary, var(--secondary-text-color));
    margin-top: 6px;
  }

  .mc-cond-appearance-subhead:first-child {
    margin-top: 0;
  }

  /* Action config */
  .mc-action-config {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    // border: 1px solid var(--mc-border);
    border-radius: 6px;
  }

  /* Card Settings Modal */
  .mc-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 16px;
  }

  .mc-modal {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    width: 480px;
    max-width: 100%;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .mc-modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--divider-color, #e5e7eb);
    background: var(--card-background-color, #fff);
  }

  .mc-modal-header ha-icon {
    color: var(--primary-color, #6366f1);
    --mdc-icon-size: 24px;
  }

  .mc-modal-title {
    flex: 1;
    font-size: var(--ha-font-size-l, 1.25rem);
    font-weight: 600;
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--secondary-text-color, #6b7280);
    border-radius: 6px;
    font-size: 1.5rem;
    line-height: 1;
  }

  .mc-modal-close:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  .mc-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid var(--divider-color, #e5e7eb);
  }

  /* Interactive feedback — focus-visible, active, tap highlight */
  .mc-btn,
  .mc-btn-primary,
  .mc-btn-secondary,
  .mc-btn-icon,
  .mc-toolbar-btn,
  .mc-mode-btn,
  .mc-settings-tab,
  .mc-linked-popup-btn {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-btn:focus-visible,
  .mc-btn-primary:focus-visible,
  .mc-btn-secondary:focus-visible,
  .mc-btn-icon:focus-visible,
  .mc-toolbar-btn:focus-visible,
  .mc-linked-indicator:focus-visible,
  .mc-mode-btn:focus-visible,
  .mc-settings-tab:focus-visible,
  .mc-linked-popup-btn:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }

  .mc-btn:active,
  .mc-btn-primary:active,
  .mc-btn-secondary:active,
  .mc-btn-icon:active,
  .mc-toolbar-btn:active,
  .mc-mode-btn:active,
  .mc-settings-tab:active,
  .mc-linked-popup-btn:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  /* Font-family inherit */
  .mc-mode-btn {
    font-family: inherit;
  }

  /* Input focus ring enhancement */
  .mc-field input:focus-visible,
  .mc-field select:focus-visible,
  .mc-field textarea:focus-visible,
  .mc-entity-field input:focus-visible,
  .mc-card-name-input:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mc-primary) 25%, transparent);
  }

  /* Modal backdrop blur */
  .mc-modal-overlay {
    backdrop-filter: blur(4px);
  }
`],Ee=[Te,ze,g`
  :host {
    display: block;
  }

  /* ── Inline row (input + select button) ────────────────────────── */
  .mc-picker-row {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }

  .mc-picker-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    min-width: 0;
    box-sizing: border-box;
  }

  .mc-picker-input:focus {
    border-color: var(--mc-primary);
  }

  .mc-picker-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border: 1px solid var(--mc-modal-btn-bg);
    border-radius: var(--mc-modal-btn-radius);
    background: var(--mc-modal-btn-bg);
    color: var(--mc-modal-btn-color);
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    gap: 6px;
  }

  .mc-picker-btn:hover {
    filter: brightness(1.1);
  }

  .mc-picker-btn ha-icon {
    --mdc-icon-size: 18px;
  }

  /* ── Overlay / backdrop ────────────────────────────────────────── */
  .mc-picker-overlay {
    position: fixed;
    inset: 0;
    background: var(--mc-modal-overlay-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--mc-modal-z-index);
    padding: 16px;
  }

  /* ── Modal container ───────────────────────────────────────────── */
  .mc-picker-modal {
    background: var(--mc-bg);
    border-radius: var(--mc-modal-radius);
    box-shadow: var(--mc-modal-shadow);
    width: var(--mc-modal-width);
    max-width: 100%;
    max-height: var(--mc-modal-max-height);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .mc-picker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--mc-border);
    background: var(--mc-modal-header-bg);
    cursor: grab;
    user-select: none;
  }

  .mc-picker-header:active { cursor: grabbing; }
  .mc-picker-header button { cursor: pointer; }

  .mc-picker-header-start {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .mc-picker-header ha-icon {
    color: var(--mc-primary);
    --mdc-icon-size: 24px;
  }

  .mc-picker-title {
    flex: 1;
    font-size: var(--ha-font-size-m, 1rem);
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-picker-close,
  .mc-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    border-radius: var(--mc-modal-input-radius);
    font-size: 1.25rem;
    line-height: 1;
    font-family: inherit;
    flex-shrink: 0;
  }

  .mc-picker-close:hover,
  .mc-modal-close:hover {
    background: var(--mc-border);
    color: var(--mc-text);
  }

  .mc-picker-header-end {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
  }

  /* ── Search bar ────────────────────────────────────────────────── */
  .mc-picker-search {
    padding: 14px 16px;
    border-bottom: 1px solid var(--mc-border);
  }

  .mc-picker-search input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    font-size: var(--ha-font-size-s, 0.875rem);
    outline: none;
    box-sizing: border-box;
    background: var(--mc-bg);
    color: var(--mc-text);
  }

  .mc-picker-search input:focus {
    border-color: var(--mc-primary);
  }

  /* ── Scrollable list ───────────────────────────────────────────── */
  .mc-picker-list {
    flex: 1;
    overflow-y: auto;
    max-height: var(--mc-modal-list-max-height);
  }

  /* ── Category / domain sticky header ───────────────────────────── */
  .mc-picker-category,
  .mc-picker-domain {
    padding: 10px 16px 6px;
    font-size: var(--ha-font-size-xs, 0.7rem);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--mc-text-secondary);
    background: var(--mc-bg);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  /* ── List item ─────────────────────────────────────────────────── */
  .mc-picker-item {
    display: flex;
    align-items: center;
    gap: var(--mc-modal-item-gap);
    padding: var(--mc-modal-item-padding);
    cursor: pointer;
    transition: background 0.1s;
    border-bottom: var(--mc-modal-item-border);
  }

  .mc-picker-item:last-child {
    border-bottom: none;
  }

  .mc-picker-item:hover {
    background: var(--mc-modal-item-hover-bg);
  }

  .mc-picker-item.selected {
    background: color-mix(in srgb, var(--mc-primary) 15%, transparent);
  }

  /* ── Item icon ─────────────────────────────────────────────────── */
  .mc-picker-item-icon {
    width: var(--mc-modal-item-icon-size);
    height: var(--mc-modal-item-icon-size);
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--mc-modal-item-icon-bg);
    border-radius: var(--mc-modal-item-icon-radius);
    color: var(--mc-primary);
    --mdc-icon-size: 20px;
    flex-shrink: 0;
  }

  /* ── Item content ──────────────────────────────────────────────── */
  .mc-picker-item-content {
    flex: 1;
    min-width: 0;
  }

  .mc-picker-item-name {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    color: var(--mc-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-picker-item-id {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-picker-item-desc {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
    margin-top: 2px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .mc-picker-item-meta {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
  }

  /* ── Badges / state chips ──────────────────────────────────────── */
  .mc-picker-item-badge,
  .mc-picker-item-state {
    font-size: var(--ha-font-size-xs, 0.7rem);
    color: var(--mc-text-secondary);
    background: var(--mc-border);
    padding: 3px 8px;
    border-radius: 4px;
    white-space: nowrap;
  }

  /* ── Thumbnails (media picker) ─────────────────────────────────── */
  .mc-picker-item-thumb {
    width: var(--mc-modal-item-icon-size);
    height: var(--mc-modal-item-icon-size);
    border-radius: var(--mc-modal-input-radius);
    object-fit: cover;
    background: var(--mc-border);
    flex-shrink: 0;
  }

  /* ── Breadcrumbs (media picker) ────────────────────────────────── */
  .mc-picker-breadcrumbs {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border-bottom: 1px solid var(--mc-border);
    font-size: var(--ha-font-size-s, 0.875rem);
    overflow-x: auto;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .mc-breadcrumb {
    color: var(--mc-primary);
    cursor: pointer;
    border: none;
    background: none;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: var(--ha-font-size-s, 0.875rem);
    white-space: nowrap;
  }

  .mc-breadcrumb:hover {
    background: color-mix(in srgb, var(--mc-primary) 12%, transparent);
  }

  .mc-breadcrumb-sep {
    color: var(--mc-text-secondary);
  }

  .mc-breadcrumb-current {
    color: var(--mc-text);
    font-weight: 500;
    padding: 2px 4px;
    white-space: nowrap;
  }

  /* ── Empty / loading states ────────────────────────────────────── */
  .mc-picker-empty,
  .mc-picker-loading {
    padding: 32px;
    text-align: center;
    color: var(--mc-text-secondary);
  }

  /* ── Entity info row (entity picker inline preview) ────────────── */
  .mc-picker-entity-info {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    background: var(--mc-bg);
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .mc-picker-entity-info:hover {
    border-color: var(--mc-primary);
  }

  .mc-picker-entity-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--mc-modal-item-icon-bg);
    color: var(--mc-primary);
    flex-shrink: 0;
    --mdc-icon-size: 16px;
  }

  .mc-picker-entity-details {
    flex: 1;
    min-width: 0;
  }

  .mc-picker-entity-name {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    color: var(--mc-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .mc-picker-entity-id {
    font-size: var(--ha-font-size-xs, 0.7rem);
    color: var(--mc-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  /* ── Icon preview (icon picker inline) ─────────────────────────── */
  .mc-picker-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    flex-shrink: 0;
    border: 1px solid var(--mc-border);
    border-right: none;
    border-radius: var(--mc-modal-input-radius) 0 0 var(--mc-modal-input-radius);
    color: var(--mc-primary);
    --mdc-icon-size: 22px;
  }

  /* ── Footer (buttons at bottom) ───────────────────────────────── */
  .mc-picker-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 14px 16px;
    border-top: 1px solid var(--mc-border);
  }

  /* ── Action buttons (save / cancel) ────────────────────────────── */
  .action-btn {
    border-radius: var(--mc-modal-btn-radius);
    padding: 10px 14px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-size: var(--ha-font-size-s, 0.875rem);
    transition: all 0.15s;
  }

  .save-btn {
    background-color: var(--mc-modal-save-bg);
    color: var(--mc-modal-save-color);
  }

  .save-btn:hover {
    filter: brightness(1.1);
  }

  .save-btn:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .cancel-btn {
    background-color: var(--mc-modal-cancel-bg);
    color: var(--mc-modal-cancel-color);
  }

  .cancel-btn:hover {
    filter: brightness(1.1);
  }

  /* ── Item action buttons ───────────────────────────────────────── */
  .mc-picker-item-actions {
    display: flex;
    gap: 4px;
  }

  /* ── Positioned modal (after first drag/resize) ─────────────── */
  .mc-modal--positioned {
    position: fixed;
    margin: 0;
    max-width: none;
    max-height: none;
  }

  /* ── Maximized modal ────────────────────────────────────────── */
  .mc-modal--maximized {
    position: fixed;
    margin: 0;
    max-width: none;
    max-height: none;
    transition: all 0.2s ease;
  }

  /* ── Resize handle ──────────────────────────────────────────── */
  .mc-modal-resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: nwse-resize;
    z-index: 10;
    opacity: 0.3;
    border-radius: 0 0 12px 0;
    background: linear-gradient(135deg, transparent 50%, currentColor 50%);
  }

  .mc-modal-resize-handle:hover { opacity: 0.6; }

  /* ── Maximize button ────────────────────────────────────────── */
  .mc-modal-maximize-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mc-text-secondary, var(--secondary-text-color, #757575));
  }

  .mc-modal-maximize-btn:hover {
    background: var(--mc-border, var(--divider-color, #e0e0e0));
  }

  .mc-modal-maximize-btn ha-icon { --mdc-icon-size: 18px; }

  /* Scrollbar styling */
  .mc-picker-list {
    scrollbar-width: thin;
    scrollbar-color: var(--mc-border) transparent;
  }

  /* Interactive feedback — focus-visible, active, tap highlight */
  .mc-picker-btn,
  .action-btn {
    -webkit-tap-highlight-color: transparent;
    font-family: inherit;
  }

  .mc-picker-btn:focus-visible,
  .action-btn:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }

  .mc-picker-btn:active,
  .action-btn:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  /* Input focus ring enhancement */
  .mc-picker-input:focus-visible,
  .mc-picker-search input:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mc-primary) 25%, transparent);
  }

  /* Backdrop blur */
  .mc-picker-overlay {
    backdrop-filter: blur(4px);
  }
`],Pe=[Te,ze,g`
  :host {
    display: block;
  }

  /* ── Overlay ───────────────────────────────────────────────────── */
  .mc-modal-overlay {
    position: fixed;
    inset: 0;
    background: var(--mc-modal-overlay-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: var(--mc-modal-z-index);
    padding: 16px;
  }

  /* ── Modal container ───────────────────────────────────────────── */
  .mc-modal {
    background: var(--mc-bg);
    border-radius: var(--mc-modal-radius);
    box-shadow: var(--mc-modal-shadow);
    width: var(--mc-modal-width);
    max-width: 100%;
    max-height: var(--mc-modal-max-height);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* ── Header ────────────────────────────────────────────────────── */
  .mc-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 20px;
    border-bottom: 1px solid var(--mc-border);
    background: var(--mc-modal-header-bg);
    cursor: grab;
    user-select: none;
  }

  .mc-modal-header:active { cursor: grabbing; }
  .mc-modal-header button { cursor: pointer; }

  .mc-modal-header ha-icon {
    color: var(--mc-primary);
    --mdc-icon-size: 24px;
  }

  .mc-modal-title {
    flex: 1;
    font-size: var(--ha-font-size-l, 1.25rem);
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    border-radius: 6px;
    font-size: 1.5rem;
    line-height: 1;
  }

  .mc-modal-close:hover {
    background: var(--mc-border);
    color: var(--mc-text);
  }

  /* ── Body ──────────────────────────────────────────────────────── */
  .mc-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
  }

  /* ── Footer ────────────────────────────────────────────────────── */
  .mc-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 16px 20px;
    border-top: 1px solid var(--mc-border);
  }

  /* ── Tabs (inside modal) ───────────────────────────────────────── */
  .mc-modal-tabs {
    display: flex;
    border-bottom: 1px solid var(--mc-border);
    background: var(--mc-bg);
  }

  .mc-modal-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
  }

  .mc-modal-tab:hover {
    color: var(--mc-text);
    background: color-mix(in srgb, var(--mc-primary) 5%, transparent);
  }

  .mc-modal-tab.active {
    color: var(--mc-primary);
    border-bottom-color: var(--mc-primary);
  }

  .mc-modal-tab ha-icon {
    --mdc-icon-size: 18px;
  }

  /* ── Action buttons (reusable inside modals) ───────────────────── */
  .action-btn {
    border-radius: 6px;
    padding: 10px 14px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    font-size: var(--ha-font-size-s, 0.875rem);
    transition: all 0.15s;
  }

  .save-btn {
    background-color: var(--success-color, #4caf50);
    color: var(--text-primary-color, #fff);
  }

  .save-btn:hover {
    filter: brightness(1.1);
  }

  .cancel-btn {
    background-color: var(--error-color, #f44336);
    color: var(--text-primary-color, #fff);
  }

  .cancel-btn:hover {
    filter: brightness(1.1);
  }

  /* ── Positioned modal (after first drag/resize) ─────────────── */
  .mc-modal--positioned {
    position: fixed;
    margin: 0;
    max-width: none;
    max-height: none;
  }

  /* ── Maximized modal ────────────────────────────────────────── */
  .mc-modal--maximized {
    position: fixed;
    margin: 0;
    max-width: none;
    max-height: none;
    transition: all 0.2s ease;
  }

  /* ── Resize handle ──────────────────────────────────────────── */
  .mc-modal-resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    cursor: nwse-resize;
    z-index: 10;
    opacity: 0.3;
    border-radius: 0 0 12px 0;
    background: linear-gradient(135deg, transparent 50%, currentColor 50%);
  }

  .mc-modal-resize-handle:hover { opacity: 0.6; }

  /* ── Maximize button ────────────────────────────────────────── */
  .mc-modal-maximize-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--mc-text-secondary, var(--secondary-text-color, #757575));
  }

  .mc-modal-maximize-btn:hover {
    background: var(--mc-border, var(--divider-color, #e0e0e0));
  }

  .mc-modal-maximize-btn ha-icon { --mdc-icon-size: 18px; }

  /* Interactive feedback — focus-visible, active, tap highlight */
  .mc-modal-tab,
  .action-btn {
    -webkit-tap-highlight-color: transparent;
    font-family: inherit;
  }

  .mc-modal-tab:focus-visible,
  .action-btn:focus-visible {
    outline: 2px solid var(--mc-primary);
    outline-offset: 2px;
  }

  .mc-modal-tab:active,
  .action-btn:active {
    opacity: 0.85;
    transform: scale(0.98);
  }

  /* Backdrop blur */
  .mc-modal-overlay {
    backdrop-filter: blur(4px);
  }
`],Ie=[Te,ze,g`
  :host {
    display: block;
  }

  .mc-design-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Search */
  .mc-design-search {
    position: relative;
    margin-bottom: 4px;
  }

  .mc-design-search ha-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--mc-text-secondary);
    --mdc-icon-size: 18px;
    pointer-events: none;
  }

  .mc-design-search input {
    width: 100%;
    padding: 8px 12px 8px 34px;
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .mc-design-search input:focus {
    border-color: var(--mc-primary);
  }

  .mc-design-search input::placeholder {
    color: var(--mc-text-secondary);
  }

  /* Sectors */
  .mc-design-sector {
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-md);
    overflow: hidden;
  }

  .mc-design-sector-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    cursor: pointer;
    user-select: none;
    background: none;
    border: none;
    width: 100%;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
    transition: background 0.15s;
  }

  .mc-design-sector-header:hover {
    background: var(--mc-primary-light);
  }

  .mc-design-sector-header ha-icon {
    --mdc-icon-size: 18px;
    color: var(--mc-text-secondary);
  }

  .mc-design-sector-header .sector-name {
    flex: 1;
    text-align: left;
  }

  .mc-design-sector-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: var(--mc-primary);
    color: var(--text-primary-color, #fff);
    font-size: var(--ha-font-size-xs, 0.7rem);
    font-weight: 600;
    line-height: 1;
  }

  .mc-design-sector-chevron {
    --mdc-icon-size: 18px;
    color: var(--mc-text-secondary);
    transition: transform 0.2s ease;
  }

  .mc-design-sector.open .mc-design-sector-chevron {
    transform: rotate(180deg);
  }

  .mc-design-sector-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.25s ease;
  }

  .mc-design-sector.open .mc-design-sector-body {
    max-height: 2000px;
  }

  .mc-design-sector-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border-top: 1px solid var(--mc-border);
  }

  /* Property fields - inherit .mc-field patterns */
  .mc-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .mc-field-label {
    font-size: var(--mc-font-size-xs, 0.75rem);
    font-weight: 500;
    color: var(--mc-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .mc-field input[type='text'],
  .mc-field input[type='number'],
  .mc-field select,
  .mc-field textarea {
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  .mc-field input:focus,
  .mc-field select:focus,
  .mc-field textarea:focus {
    border-color: var(--mc-primary);
  }

  /* Custom CSS section at bottom */
  .mc-design-custom-css {
    margin-top: 4px;
  }

  .mc-design-custom-css textarea {
    padding: 8px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-family: 'Roboto Mono', 'Courier New', monospace;
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
  }

  .mc-design-custom-css textarea:focus {
    border-color: var(--mc-primary);
  }

  .mc-design-custom-css label {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
    margin-bottom: 6px;
    display: block;
  }

  /* Empty state when search yields no results */
  .mc-design-empty {
    text-align: center;
    padding: 24px 16px;
    color: var(--mc-text-secondary);
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  /* Conditional design views */
  .mc-design-views {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-bottom: 4px;
    scrollbar-width: thin;
  }

  .mc-design-views::-webkit-scrollbar {
    height: 4px;
  }

  .mc-design-views::-webkit-scrollbar-thumb {
    background: var(--mc-border);
    border-radius: 2px;
  }

  .mc-design-view-tab {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 16px;
    background: none;
    color: var(--mc-text-secondary);
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
  }

  .mc-design-view-tab:hover {
    border-color: var(--mc-primary);
    color: var(--mc-primary);
  }

  .mc-design-view-tab.active {
    background: var(--mc-primary);
    border-color: var(--mc-primary);
    color: var(--text-primary-color, #fff);
  }

  .mc-design-view-tab .tab-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    color: inherit;
    font-size: 10px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .mc-design-view-tab .tab-remove:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  .mc-design-add-rule-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border: 1px dashed var(--mc-border);
    border-radius: 16px;
    background: none;
    color: var(--mc-text-secondary);
    font-size: var(--ha-font-size-xs, 0.75rem);
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
  }

  .mc-design-add-rule-btn:hover {
    border-color: var(--mc-primary);
    color: var(--mc-primary);
  }

  .mc-design-rule-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-radius-md);
    margin-bottom: 8px;
  }

  .mc-design-rule-header .rule-name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-design-rule-header .rule-name-row input {
    flex: 1;
    padding: 6px 10px;
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    box-sizing: border-box;
  }

  .mc-design-rule-header .rule-name-row input:focus {
    border-color: var(--mc-primary);
  }

  .mc-design-rule-header .rule-mode-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--mc-text-secondary);
  }

  .mc-design-rule-header .rule-mode-row select {
    padding: 4px 8px;
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
  }

  .mc-design-rule-conditions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 8px;
  }

  .mc-design-rule-conditions .conditions-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-design-rule-conditions .add-condition-btn {
    padding: 4px 10px;
    border: 1px dashed var(--mc-border);
    border-radius: 6px;
    background: none;
    color: var(--mc-text-secondary);
    font-size: var(--ha-font-size-xs, 0.75rem);
    cursor: pointer;
    transition: all 0.15s;
  }

  .mc-design-rule-conditions .add-condition-btn:hover {
    border-color: var(--mc-primary);
    color: var(--mc-primary);
  }

  .mc-design-remove-rule {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px;
    margin-top: 8px;
    border: 1px solid var(--error-color, #ef4444);
    border-radius: 6px;
    background: none;
    color: var(--error-color, #ef4444);
    font-size: var(--ha-font-size-s, 0.875rem);
    cursor: pointer;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.15s;
  }

  .mc-design-remove-rule:hover {
    background: color-mix(in srgb, var(--error-color, #ef4444) 10%, transparent);
  }

  /* Smooth rotation for chevron */
  .mc-design-sector-chevron {
    will-change: transform;
  }

  /* Input focus ring enhancement */
  .mc-design-search input:focus-visible,
  .mc-field input:focus-visible,
  .mc-field select:focus-visible,
  .mc-field textarea:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mc-primary) 25%, transparent);
  }
`],Re=g`
  :host {
    display: block;
  }

  .mc-selector-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mc-selector-dialog {
    background: var(--card-background-color, #fff);
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .mc-selector-header {
    display: flex;
    align-items: center;
    padding: 18px;
    border-bottom: 1px solid var(--divider-color, #e5e7eb);
    gap: 14px;
  }

  .mc-selector-header h3 {
    margin: 0;
    font-size: var(--ha-font-size-m, 1rem);
    flex: 1;
  }

  .mc-selector-search-wrap {
    padding: 8px 16px;
  }

  .mc-selector-search {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    font-size: var(--ha-font-size-s, 0.875rem);
    outline: none;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-selector-search:focus {
    border-color: var(--primary-color, #6366f1);
  }

  .mc-selector-body {
    overflow-y: auto;
    padding: 10px;
    flex: 1;
  }

  .mc-selector-category {
    padding: 4px 12px;
    font-size: var(--ha-font-size-xs, 0.7rem);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-text-color, #6b7280);
    margin-top: 8px;
  }

  .mc-selector-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
    width: 100%;
    border: none;
    background: transparent;
    text-align: left;
    font-family: inherit;
  }

  .mc-selector-item:hover {
    background: var(--divider-color, #e5e7eb);
  }

  .mc-selector-item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 12%, transparent);
    color: var(--primary-color, #6366f1);
  }

  .mc-selector-item-icon ha-icon {
    --mdc-icon-size: 20px;
  }

  .mc-selector-item-info {
    flex: 1;
    min-width: 0;
  }

  .mc-selector-item-name {
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
  }

  .mc-selector-item-desc {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-selector-empty {
    padding: 16px;
    color: var(--secondary-text-color, #6b7280);
    font-size: var(--ha-font-size-s, 0.875rem);
    text-align: center;
  }

  /* Scrollbar styling */
  .mc-selector-body {
    scrollbar-width: thin;
    scrollbar-color: var(--divider-color, #e5e7eb) transparent;
  }

  /* Search font-family */
  .mc-selector-search {
    font-family: inherit;
  }

  /* Focus ring for search */
  .mc-selector-search:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #6366f1) 25%, transparent);
  }

  /* Interactive feedback */
  .mc-selector-item {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-selector-item:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: 2px;
  }

  /* Hover lift for selector items */
  .mc-selector-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  /* Backdrop blur */
  .mc-selector-overlay {
    backdrop-filter: blur(4px);
  }
`,Le=g`
  :host {
    display: block;
  }

  .mc-tree {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  .mc-kbd-hint {
    margin-bottom: 8px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-kbd-hint kbd {
    font-family: inherit;
    font-size: 0.7rem;
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid var(--divider-color, #e5e7eb);
    background: var(--card-background-color, #fff);
  }

  .mc-tree-node {
    display: flex;
    flex-direction: column;
  }

  .mc-tree-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.1s;
    user-select: none;
  }

  .mc-tree-row:hover {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 5%, transparent);
  }

  .mc-tree-row.selected {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 12%, transparent);
  }

  .mc-tree-row:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: -2px;
  }

  .mc-tree-row.drop-target {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: -2px;
  }

  .mc-tree-indent {
    display: inline-block;
    width: 20px;
    flex-shrink: 0;
  }

  .mc-tree-toggle {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--secondary-text-color, #6b7280);
    font-size: 0.625rem;
    flex-shrink: 0;
    transition: transform 0.15s;
  }

  .mc-tree-toggle.open {
    transform: rotate(90deg);
  }

  .mc-tree-icon {
    color: var(--primary-color, #6366f1);
    flex-shrink: 0;
  }

  .mc-tree-label {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
  }

  .mc-tree-type {
    font-size: var(--ha-font-size-xs, 0.7rem);
    color: var(--secondary-text-color, #6b7280);
    background: var(--divider-color, #e5e7eb);
    padding: 1px 6px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .mc-tree-badge {
    font-size: 0.625rem;
    padding: 1px 5px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .mc-tree-badge.condition {
    background: color-mix(in srgb, var(--warning-color, #f59e0b) 15%, transparent);
    color: var(--warning-color, #f59e0b);
  }

  .mc-tree-badge.action {
    background: color-mix(in srgb, var(--info-color, #3b82f6) 15%, transparent);
    color: var(--info-color, #3b82f6);
  }

  .mc-tree-children {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .mc-tree-actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.1s;
  }

  .mc-tree-row:hover .mc-tree-actions {
    opacity: 1;
  }

  .mc-tree-action-btn {
    width: 20px;
    height: 20px;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color, #6b7280);
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-tree-action-btn:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color);
  }

  .mc-tree-empty {
    padding: 16px;
    text-align: center;
    color: var(--secondary-text-color, #6b7280);
    font-size: var(--ha-font-size-s, 0.875rem);
  }

  /* Drag handle */
  .mc-drag-handle {
    cursor: grab;
    color: var(--secondary-text-color, #6b7280);
    opacity: 0;
    transition: opacity 0.1s;
  }

  .mc-tree-row:hover .mc-drag-handle {
    opacity: 0.5;
  }

  .mc-drag-handle:hover {
    opacity: 1 !important;
  }

  /* Smooth rotation for tree toggle */
  .mc-tree-toggle {
    will-change: transform;
  }

  /* Interactive feedback */
  .mc-tree-action-btn {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-tree-action-btn:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: 2px;
  }
`,De=g`
  :host {
    display: block;
  }

  .mc-yaml-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 300px;
  }

  .mc-yaml-editor-wrapper {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .mc-yaml-textarea {
    width: 100%;
    min-height: 300px;
    padding: 12px;
    border: none;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: var(--ha-font-size-s, 0.875rem);
    line-height: 1.5;
    resize: vertical;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    tab-size: 2;
    box-sizing: border-box;
  }

  .mc-yaml-error {
    padding: 8px 12px;
    background: color-mix(in srgb, var(--error-color, #ef4444) 10%, transparent);
    color: var(--error-color, #ef4444);
    border-radius: 6px;
    font-size: var(--ha-font-size-xs, 0.75rem);
  }

  .mc-yaml-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
    padding: 4px 0;
  }

  .mc-yaml-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success-color, #22c55e);
  }

  .mc-yaml-status-dot.error {
    background: var(--error-color, #ef4444);
  }
`,Oe=g`
  :host {
    display: block;
  }

  .mc-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mc-rows-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mc-kbd-hint {
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-kbd-hint kbd {
    font-family: inherit;
    font-size: 0.7rem;
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid var(--divider-color, #e5e7eb);
    background: var(--card-background-color, #fff);
  }

  /* Card header with name + settings button */
  .mc-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1px solid var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    background: var(--mc-bg);
  }

  .mc-card-name-input {
    flex: 1;
    border: none;
    background: none;
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    padding: 4px 0;
  }

  .mc-card-name-input::placeholder {
    color: var(--secondary-text-color, #6b7280);
    font-weight: 400;
  }

  /* Row */
  .mc-row-item {
    border: 1px solid color-mix(in srgb, var(--primary-color, #6366f1) 25%, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    overflow: hidden;
  }

  .mc-row-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
    font-size: var(--ha-font-size-s, 0.875rem);
    font-weight: 500;
  }

  .mc-row-header.selected {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 15%, transparent);
  }

  .mc-row-header:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: -2px;
  }

  .mc-row-header .mc-label {
    min-width: 50px;
  }

  /* Row collapse toggle */
  .mc-row-header-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
    flex: 1;
  }

  .mc-row-header-toggle:hover {
    color: var(--primary-color, #6366f1);
  }

  /* Collapse button far right */
  .mc-row-collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.15s;
  }

  .mc-row-collapse-btn:hover {
    background: var(--divider-color, #e5e7eb);
  }

  .mc-row-collapse-btn .mc-chevron {
    font-size: 0.625rem;
    transition: transform 0.2s;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-row-collapse-btn .mc-chevron.open {
    transform: rotate(90deg);
  }

  .mc-row-body {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mc-layout-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
    gap: 8px;
  }

  .mc-layout-grid-option {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    background: var(--card-background-color, #fff);
    padding: 9px 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: stretch;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    font-family: inherit;
  }

  .mc-layout-grid-option:hover {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.09);
  }

  .mc-layout-grid-option.active {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, var(--card-background-color, #fff));
  }

  .mc-layout-grid-option:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: 2px;
  }

  .mc-layout-grid-preview {
    height: 16px;
    display: flex;
    gap: 3px;
    align-items: stretch;
  }

  .mc-layout-grid-preview > span {
    border-radius: 4px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 65%, #ffffff);
  }

  .mc-layout-grid-label {
    font-size: 0.68rem;
    text-align: center;
    color: var(--secondary-text-color, #6b7280);
    line-height: 1.1;
  }

  /* Drag handles */
  .mc-drag-handle,
  .mc-module-drag {
    cursor: grab;
    color: var(--secondary-text-color, #6b7280);
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 4px;
  }

  .mc-drag-handle:hover,
  .mc-module-drag:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-drag-handle:active,
  .mc-module-drag:active {
    cursor: grabbing;
  }

  /* Drag and drop states */
  .mc-row-item.dragging,
  .mc-module-item.dragging {
    opacity: 0.5;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
  }

  .mc-row-item.drag-over {
    border-color: var(--primary-color, #6366f1);
    border-style: dashed;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
  }

  .mc-modules-container {
    min-height: 40px;
    transition: background 0.15s;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-drop-slot {
    height: 10px;
    border-radius: 6px;
    border: 1px dashed transparent;
    transition: all 0.12s;
  }

  .mc-drop-slot.empty {
    height: 34px;
    border-color: var(--divider-color, #e5e7eb);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 3%, transparent);
  }

  .mc-drop-slot.active {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 16%, transparent);
  }

  /* Column — different color from row */
  .mc-col-item {
    flex: 1;
    border: 1px dashed color-mix(in srgb, var(--success-color, #22c55e) 40%, var(--divider-color, #e5e7eb));
    border-radius: 6px;
    padding: 10px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: color-mix(in srgb, var(--success-color, #22c55e) 3%, transparent);
  }

  .mc-col-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 500;
    color: color-mix(in srgb, var(--success-color, #22c55e) 70%, var(--secondary-text-color, #6b7280));
  }

  /* Column collapse toggle */
  .mc-col-header-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
    flex: 1;
    min-width: 0;
  }

  .mc-col-header-toggle:hover {
    color: color-mix(in srgb, var(--success-color, #22c55e) 90%, var(--primary-text-color));
  }

  .mc-col-collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    transition: background 0.15s;
    color: color-mix(in srgb, var(--success-color, #22c55e) 70%, var(--secondary-text-color, #6b7280));
  }

  .mc-col-collapse-btn:hover {
    background: color-mix(in srgb, var(--success-color, #22c55e) 15%, transparent);
  }

  .mc-col-collapse-btn .mc-chevron {
    font-size: 0.625rem;
    transition: transform 0.2s;
  }

  .mc-col-collapse-btn .mc-chevron.open {
    transform: rotate(90deg);
  }

  .mc-col-item.collapsed .mc-modules-container,
  .mc-col-item.collapsed .mc-add-module-btn {
    display: none;
  }

  .mc-col-header .mc-label {
    flex: 1;
  }

  .mc-col-header .mc-btn-small {
    opacity: 0;
    transition: opacity 0.15s;
  }

  .mc-col-item:hover .mc-col-header .mc-btn-small {
    opacity: 1;
  }

  /* Module item */
  .mc-module-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--card-background-color, #fff);
  }

  .mc-module-item:hover {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 5%, transparent);
  }

  .mc-module-item.selected {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
  }

  .mc-module-item-icon {
    color: var(--primary-color, #6366f1);
  }

  .mc-module-item-name {
    flex: 1;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mc-module-item-type {
    font-size: var(--ha-font-size-xs, 0.7rem);
    color: var(--secondary-text-color, #6b7280);
    background: var(--divider-color, #e5e7eb);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .mc-module-item .mc-btn-small {
    opacity: 0;
    transition: opacity 0.15s;
  }

  .mc-module-item:hover .mc-btn-small {
    opacity: 1;
  }

  .mc-add-module-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    border: 1px dashed var(--divider-color, #e5e7eb);
    border-radius: 6px;
    background: none;
    cursor: pointer;
    font-size: var(--ha-font-size-xs, 0.75rem);
    color: var(--secondary-text-color, #6b7280);
    transition: all 0.15s;
    width: 100%;
  }

  .mc-add-module-btn:hover {
    border-color: var(--primary-color, #6366f1);
    color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 5%, transparent);
  }

  /* Button variants */
  .mc-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    background: none;
    cursor: pointer;
    color: var(--secondary-text-color, #6b7280);
    transition: all 0.15s;
  }

  .mc-btn-icon:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-btn-small {
    width: 22px;
    height: 22px;
  }

  .mc-btn-add-col {
    color: var(--success-color, #22c55e);
  }

  .mc-btn-add-col:hover {
    background: color-mix(in srgb, var(--success-color, #22c55e) 15%, transparent);
    color: var(--success-color, #22c55e);
  }

  .mc-btn-delete {
    color: var(--error-color, #ef4444);
  }

  .mc-btn-delete:hover {
    background: color-mix(in srgb, var(--error-color, #ef4444) 15%, transparent);
    color: var(--error-color, #ef4444);
  }

  /* Row settings modal — smaller variant */
  .mc-modal-sm {
    max-width: 500px;
    width: 90%;
  }

  /* Interactive feedback */
  .mc-add-module-btn,
  .mc-module-item {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-add-module-btn:focus-visible,
  .mc-module-item:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: 2px;
  }

  .mc-add-module-btn:active,
  .mc-module-item:active {
    opacity: 0.85;
  }

  /* Hover lift for module items */
  .mc-module-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  /* Empty state */
  .mc-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    border: 1px dashed var(--mc-border, var(--divider-color, #e5e7eb));
    border-radius: 8px;
    background: var(--mc-surface-recessed);
  }

  .mc-empty-state-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--mc-primary-light);
    color: var(--mc-primary);
    margin-bottom: 16px;
    --mdc-icon-size: 28px;
  }

  .mc-empty-state-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-empty-state-desc {
    margin: 6px 0 20px;
    max-width: 320px;
    font-size: 0.8125rem;
    color: var(--secondary-text-color, #6b7280);
    line-height: 1.5;
  }

  .mc-empty-state-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  /* Layout bar in row header */
  .mc-row-layout-bar {
    display: flex;
    gap: 2px;
    margin-left: 8px;
    height: 12px;
    align-items: center;
    padding: 0 6px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
    border-radius: 4px;
  }

  .mc-layout-bar {
    display: flex;
    gap: 2px;
    height: 8px;
    min-width: 32px;
  }

  .mc-layout-bar-seg {
    border-radius: 2px;
    background: var(--primary-color, #6366f1);
    opacity: 0.5;
    min-width: 3px;
  }

  /* Settings button on row/col header */
  .mc-btn-settings {
    color: var(--mc-text-secondary);
  }

  .mc-btn-settings:hover {
    color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 12%, transparent);
  }

  /* Column badge */
  .mc-col-badge {
    font-size: 0.625rem;
    font-weight: 600;
    padding: 1px 5px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--success-color, #22c55e) 20%, transparent);
    color: color-mix(in srgb, var(--success-color, #22c55e) 80%, var(--secondary-text-color));
  }
`,Ne=g`
  :host {
    display: block;
  }

  .mc-cond {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    position: relative;
  }

  .mc-cond-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-cond-type {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .mc-cond-remove {
    margin-left: auto;
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--secondary-text-color, #6b7280);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mc-cond-remove:hover {
    background: var(--divider-color);
    color: var(--error-color, #ef4444);
  }

  .mc-cond-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .mc-cond-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-cond-field label {
    font-size: 0.6875rem;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-cond-field input,
  .mc-cond-field select,
  .mc-cond-field textarea {
    padding: 8px 10px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 4px;
    font-size: 0.8125rem;
    font-family: inherit;
    outline: none;
  }

  .mc-cond-template {
    resize: vertical;
    min-height: 72px;
  }

  .mc-cond-field input[type='time'] {
    padding: 5px 8px;
  }

  .mc-cond-field.full {
    grid-column: 1 / -1;
  }

  .mc-cond-entity-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.6875rem;
    color: var(--secondary-text-color, #6b7280);
    grid-column: 1 / -1;
  }

  .mc-cond-entity-toggle label {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .mc-cond-entity-toggle input[type='checkbox'] {
    margin: 0;
    cursor: pointer;
  }
`,je=g`
  /* ── Template-specific styles ────────────────────────────────── */

  /* Create mode form */
  .mc-template-form {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .mc-template-form input,
  .mc-template-form textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    font-size: 0.875rem;
    outline: none;
    box-sizing: border-box;
    background: var(--mc-bg);
    color: var(--mc-text);
    font-family: inherit;
  }

  .mc-template-form textarea {
    resize: vertical;
    min-height: 60px;
  }

  .mc-template-form input:focus,
  .mc-template-form textarea:focus {
    border-color: var(--mc-primary);
  }

  .mc-template-error {
    font-size: 0.8125rem;
    color: var(--error-color, #f44336);
  }

  /* Delete button */
  .mc-template-delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    border-radius: var(--mc-modal-input-radius);
    transition: all 0.15s;
    --mdc-icon-size: 18px;
  }

  .mc-template-delete-btn:hover {
    background: color-mix(in srgb, var(--error-color, #f44336) 10%, transparent);
    color: var(--error-color, #f44336);
  }

  /* Confirm bar */
  .mc-template-confirm {
    padding: 12px 16px;
    background: var(--mc-modal-item-hover-bg);
    border-bottom: 1px solid var(--mc-border);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-template-confirm-text {
    font-size: 0.8125rem;
    color: var(--mc-text);
  }

  .mc-template-confirm-actions {
    display: flex;
    gap: 8px;
  }

  /* Overwrite confirmation */
  .mc-template-overwrite {
    font-size: 0.8125rem;
    color: var(--warning-color, #ff9800);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-template-overwrite-actions {
    display: flex;
    gap: 8px;
  }

  .overwrite-btn {
    background-color: var(--warning-color, #ff9800);
    color: var(--text-primary-color, #fff);
  }

  /* Edit button */
  .mc-template-edit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    border-radius: var(--mc-modal-input-radius);
    transition: all 0.15s;
    --mdc-icon-size: 18px;
  }

  .mc-template-edit-btn:hover {
    background: color-mix(in srgb, var(--mc-primary) 15%, transparent);
    color: var(--mc-primary);
  }

  /* Edit form inline */
  .mc-template-edit-form {
    padding: 16px;
    border-bottom: 1px solid var(--mc-border);
    background: color-mix(in srgb, var(--mc-primary) 5%, transparent);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mc-template-edit-form input,
  .mc-template-edit-form textarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    font-size: 0.875rem;
    outline: none;
    box-sizing: border-box;
    background: var(--mc-bg);
    color: var(--mc-text);
    font-family: inherit;
  }

  .mc-template-edit-form textarea {
    resize: vertical;
    min-height: 50px;
  }

  .mc-template-edit-form input:focus,
  .mc-template-edit-form textarea:focus {
    border-color: var(--mc-primary);
  }

  .mc-template-edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
`,Fe=g`
  :host {
    --mc-modal-width: 800px;
  }
`,Be=g`
  :host {
    --mc-modal-width: 480px;
    --mc-modal-item-icon-radius: var(--mc-modal-input-radius);
  }
`,He=g`
  .mc-btn {
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.15s;
  }

  .mc-btn-primary {
    background: var(--mc-primary);
    color: var(--text-primary-color, #fff);
  }

  .mc-btn-primary:hover {
    filter: brightness(1.1);
  }
`,Ge=g`
  :host {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .mc-sync-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 8px;
    border-radius: 4px;
    font-size: var(--ha-font-size-xs, 0.7rem);
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    transition: all 0.15s;
    border: none;
    gap: 4px;
  }

  .mc-sync-btn.synced {
    background: color-mix(in srgb, var(--success-color, #4caf50) 12%, transparent);
    color: var(--success-color, #4caf50);
  }

  .mc-sync-btn.synced:hover {
    background: color-mix(in srgb, var(--success-color, #4caf50) 20%, transparent);
  }

  .mc-sync-btn.not-synced {
    background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
    color: var(--warning-color, #ff9800);
  }

  .mc-sync-btn.not-synced:hover {
    background: color-mix(in srgb, var(--warning-color, #ff9800) 20%, transparent);
  }

  .mc-sync-btn ha-icon {
    --mdc-icon-size: 14px;
  }

  .mc-sync-btn:active {
    transform: scale(0.95);
  }
`,Ue=g`
  :host {
    --mc-modal-width: 500px;
  }
  .mc-font-preview {
    padding: 12px;
    border: 1px solid var(--mc-border);
    border-radius: var(--mc-modal-input-radius);
    margin-top: 8px;
    text-align: center;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .mc-font-preview-text {
    font-size: 24px;
    color: var(--mc-text);
  }
  .mc-picker-item-name {
    flex: 1;
  }
`,Ve=g`
  :host {
    display: block;
  }

  .mc-unit-field {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .mc-unit-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px 0 0 6px;
    font-size: var(--ha-font-size-s, 0.875rem);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    min-width: 0;
    border-right: none;
  }

  .mc-unit-input:focus {
    border-color: var(--primary-color, #6366f1);
  }

  .mc-unit-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: var(--divider-color, #e5e7eb);
  }

  .mc-unit-select {
    padding: 8px 8px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 0 6px 6px 0;
    font-size: var(--ha-font-size-xs, 0.75rem);
    background: var(--card-background-color, #e5e7eb);
    color: var(--primary-text-color, #1a1a2e);
    outline: none;
    cursor: pointer;
    min-width: 55px;
  }

  .mc-unit-select:focus {
    border-color: var(--primary-color, #6366f1);
  }

  .mc-unit-select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Input focus ring enhancement */
  .mc-unit-input:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color, #6366f1) 25%, transparent);
  }
`,qe=g`
  .mc-box-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-box-toolbar {
    display: flex;
    justify-content: flex-end;
  }

  .mc-box-inputs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--mc-modal-input-radius, 6px);
    padding: 8px;
  }

  .mc-box-input {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-box-input mc-unit-field {
    width: 100%;
  }

  .mc-box-input.disabled mc-unit-field {
    opacity: 0.55;
    pointer-events: none;
  }

  .mc-box-input label {
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 600;
    color: var(--secondary-text-color);
  }

  .mc-box-link-btn {
    border: 1px solid var(--divider-color);
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.15s;
    min-height: 32px;
  }

  .mc-box-link-btn span {
    font-size: var(--ha-font-size-xs, 0.75rem);
    font-weight: 600;
  }

  .mc-box-link-btn ha-icon {
    --mdc-icon-size: 14px;
  }

  .mc-box-link-btn:hover {
    background: var(--divider-color);
    color: var(--primary-text-color);
  }
  .mc-box-link-btn.linked {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 15%, transparent);
    border-color: var(--primary-color, #6366f1);
    color: var(--primary-color, #6366f1);
  }

  @media (max-width: 640px) {
    .mc-box-inputs {
      grid-template-columns: 1fr;
    }
  }
`,We=g`
  :host {
    --mc-modal-width: 480px;
  }
`,Qe=g`
  :host {
    --mc-modal-width: 320px;
    --mc-modal-max-height: 90vh;
  }

  /* ── Color field (inline row) ──────────────────────────────── */
  .mc-color-field {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-color-preview {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    border: 2px solid var(--mc-border);
    cursor: pointer;
    flex-shrink: 0;
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
    position: relative;
    overflow: hidden;
  }

  .mc-color-preview-inner {
    position: absolute;
    inset: 0;
  }

  .mc-color-text {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 6px;
    font-size: 0.875rem;
    background: var(--mc-bg);
    color: var(--mc-text);
    outline: none;
    min-width: 0;
  }

  .mc-color-text:focus {
    border-color: var(--mc-primary);
  }

  .mc-color-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid var(--mc-primary);
    border-radius: 6px;
    background: color-mix(in srgb, var(--mc-primary) 10%, var(--mc-bg));
    cursor: pointer;
    color: var(--mc-primary);
    transition: all 0.15s;
    flex-shrink: 0;
  }

  .mc-color-btn:hover {
    background: var(--mc-primary);
    color: white;
  }

  /* ── Modal overrides ───────────────────────────────────────── */
  .mc-modal {
    overflow: auto;
  }

  .mc-modal-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .mc-modal-header {
    padding: 16px;
  }

  /* ── Color Area ────────────────────────────────────────────── */
  .mc-color-area {
    position: relative;
    width: 100%;
    height: 180px;
    border-radius: 8px;
    cursor: crosshair;
    touch-action: none;
  }

  .mc-color-area-gradient {
    position: absolute;
    inset: 0;
    border-radius: 8px;
    background: linear-gradient(to right, #fff, transparent),
      linear-gradient(to top, #000, transparent);
  }

  .mc-color-area-pointer {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  /* ── Sliders ───────────────────────────────────────────────── */
  .mc-slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mc-slider-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--mc-text-secondary);
    width: 20px;
    flex-shrink: 0;
  }

  .mc-slider-track {
    flex: 1;
    height: 12px;
    border-radius: 6px;
    position: relative;
    cursor: pointer;
    touch-action: none;
  }

  .mc-hue-track {
    background: linear-gradient(
      to right,
      #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000
    );
  }

  .mc-opacity-track {
    background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
  }

  .mc-opacity-gradient {
    position: absolute;
    inset: 0;
    border-radius: 6px;
  }

  .mc-slider-thumb {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -50%);
    top: 50%;
    pointer-events: none;
  }

  .mc-slider-value {
    width: 48px;
    padding: 4px 8px;
    border: 1px solid var(--mc-border);
    border-radius: 4px;
    font-size: 0.75rem;
    text-align: center;
    background: var(--mc-bg);
    color: var(--mc-text);
  }

  /* ── Input Row ─────────────────────────────────────────────── */
  .mc-input-row {
    display: flex;
    gap: 8px;
  }

  .mc-input-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-input-label {
    font-size: 0.625rem;
    font-weight: 500;
    color: var(--mc-text-secondary);
    text-transform: uppercase;
  }

  .mc-input-field {
    padding: 6px 8px;
    border: 1px solid var(--mc-border);
    border-radius: 4px;
    font-size: 0.75rem;
    background: var(--mc-bg);
    color: var(--mc-text);
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Color Sections ────────────────────────────────────────── */
  .mc-color-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-color-section-header {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-color-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
  }

  .mc-color-swatch {
    aspect-ratio: 1;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.15s;
    position: relative;
  }

  .mc-color-swatch:hover {
    transform: scale(1.1);
    z-index: 1;
  }

  .mc-color-swatch.selected {
    border-color: var(--mc-primary);
  }

  .mc-color-swatch.var-color {
    font-size: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }

  .mc-saved-colors {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .mc-saved-swatch {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    cursor: pointer;
    border: 2px solid transparent;
    position: relative;
  }

  .mc-saved-swatch:hover {
    border-color: var(--mc-primary);
  }

  .mc-saved-swatch .mc-remove-btn {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--error-color, #ef4444);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 0.625rem;
    display: none;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .mc-saved-swatch:hover .mc-remove-btn {
    display: flex;
  }

  .mc-add-saved-btn {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 2px dashed var(--mc-border);
    background: none;
    cursor: pointer;
    color: var(--mc-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  .mc-add-saved-btn:hover {
    border-color: var(--mc-primary);
    color: var(--mc-primary);
  }

  /* ── Footer ────────────────────────────────────────────────── */
  .mc-modal-footer {
    padding: 16px;
  }

  /* Input focus ring enhancement */
  .mc-color-text:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--mc-primary) 25%, transparent);
  }
`;g`
  :host {
    display: block;
  }

  .mc-preview {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    padding: 16px;
    background: var(--card-background-color, #fff);
    min-height: 60px;
  }

  .mc-preview-muted {
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-preview-label {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-text-color, #6b7280);
    margin-bottom: 8px;
  }
`,g`
  :host {
    display: block;
  }

  .mc-layout-presets {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    padding: 8px 0;
  }

  .mc-layout-preset {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 0.75rem;
  }

  .mc-layout-preset:hover {
    border-color: var(--primary-color, #6366f1);
  }

  .mc-layout-preset.active {
    border-color: var(--primary-color, #6366f1);
    background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
  }

  .mc-layout-preview {
    display: flex;
    gap: 2px;
    height: 20px;
    width: 100%;
  }

  .mc-layout-col {
    background: var(--primary-color, #6366f1);
    opacity: 0.3;
    border-radius: 2px;
    flex: 1;
  }

  /* Interactive feedback */
  .mc-layout-preset {
    -webkit-tap-highlight-color: transparent;
  }

  .mc-layout-preset:focus-visible {
    outline: 2px solid var(--primary-color, #6366f1);
    outline-offset: 2px;
  }
`,g`
  :host {
    display: block;
  }

  .mc-act {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
  }

  .mc-act-header {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .mc-act-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-act-field label {
    font-size: 0.6875rem;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-act-field input,
  .mc-act-field select {
    padding: 8px 10px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 4px;
    font-size: 0.8125rem;
    font-family: inherit;
    outline: none;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
  }
`,g`
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: grab;
    color: var(--secondary-text-color, #6b7280);
    opacity: 0.5;
    transition: opacity 0.15s;
    padding: 2px;
  }

  :host(:hover) {
    opacity: 1;
  }

  :host(:active) {
    cursor: grabbing;
  }
`;const Ye=new class{constructor(){this.modules=new Map}register(e){this.modules.set(e.metadata.type,e)}get(e){return this.modules.get(e)}getAll(){return Array.from(this.modules.values())}getByCategory(e){return this.getAll().filter(t=>t.metadata.category===e)}getMetadata(){return this.getAll().map(e=>e.metadata)}search(e){const t=e.toLowerCase();return this.getAll().filter(e=>e.metadata.name.toLowerCase().includes(t)||e.metadata.description.toLowerCase().includes(t)||e.metadata.type.toLowerCase().includes(t))}createDefault(e){const t=this.get(e);return t?t.createDefault():null}has(e){return this.modules.has(e)}get types(){return Array.from(this.modules.keys())}};function Xe(e,t,i,n,r){return{key:e,cssProperty:t,label:i,type:n,...r?{options:r}:{}}}const Ke=[{label:"Visible",value:"visible"},{label:"Hidden",value:"hidden"},{label:"Scroll",value:"scroll"},{label:"Auto",value:"auto"}],Ze=[{label:"Border-box",value:"border-box"},{label:"Padding-box",value:"padding-box"},{label:"Content-box",value:"content-box"}],Je=[{label:"None",value:"none"},{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"Double",value:"double"},{label:"Groove",value:"groove"},{label:"Ridge",value:"ridge"},{label:"Inset",value:"inset"},{label:"Outset",value:"outset"}],et=Je,tt=[{id:"spacing",name:"Spacing & Box Model",icon:"mdi:arrow-expand-all",properties:[Xe("margin","margin","Margin","box"),Xe("padding","padding","Padding","box"),Xe("width","width","Width","unit"),Xe("height","height","Height","unit"),Xe("min_width","min-width","Min Width","unit"),Xe("min_height","min-height","Min Height","unit"),Xe("max_width","max-width","Max Width","unit"),Xe("max_height","max-height","Max Height","unit"),Xe("box_sizing","box-sizing","Box Sizing","select",[{label:"Content-box",value:"content-box"},{label:"Border-box",value:"border-box"}])]},{id:"borders",name:"Borders & Outlines",icon:"mdi:border-all",properties:[Xe("border","border","Border","text"),Xe("border_top","border-top","Border Top","text"),Xe("border_right","border-right","Border Right","text"),Xe("border_bottom","border-bottom","Border Bottom","text"),Xe("border_left","border-left","Border Left","text"),Xe("border_width","border-width","Border Width","unit"),Xe("border_style","border-style","Border Style","select",Je),Xe("border_color","border-color","Border Color","color"),Xe("border_radius","border-radius","Border Radius","box"),Xe("outline","outline","Outline","text"),Xe("outline_width","outline-width","Outline Width","unit"),Xe("outline_style","outline-style","Outline Style","select",et),Xe("outline_color","outline-color","Outline Color","color"),Xe("outline_offset","outline-offset","Outline Offset","unit"),Xe("box_shadow","box-shadow","Box Shadow","text")]},{id:"positioning",name:"Positioning & Layout",icon:"mdi:page-layout-body",properties:[Xe("position","position","Position","select",[{label:"Static",value:"static"},{label:"Relative",value:"relative"},{label:"Absolute",value:"absolute"},{label:"Fixed",value:"fixed"},{label:"Sticky",value:"sticky"}]),Xe("top","top","Top","unit"),Xe("right","right","Right","unit"),Xe("bottom","bottom","Bottom","unit"),Xe("left","left","Left","unit"),Xe("inset","inset","Inset","unit"),Xe("display","display","Display","select",[{label:"Block",value:"block"},{label:"Inline",value:"inline"},{label:"Inline-block",value:"inline-block"},{label:"Flex",value:"flex"},{label:"Inline-flex",value:"inline-flex"},{label:"Grid",value:"grid"},{label:"Inline-grid",value:"inline-grid"},{label:"None",value:"none"},{label:"Contents",value:"contents"}]),Xe("visibility","visibility","Visibility","select",[{label:"Visible",value:"visible"},{label:"Hidden",value:"hidden"},{label:"Collapse",value:"collapse"}]),Xe("opacity","opacity","Opacity","text"),Xe("z_index","z-index","Z-Index","number"),Xe("overflow","overflow","Overflow","select",Ke),Xe("overflow_x","overflow-x","Overflow X","select",Ke),Xe("overflow_y","overflow-y","Overflow Y","select",Ke),Xe("float","float","Float","select",[{label:"None",value:"none"},{label:"Left",value:"left"},{label:"Right",value:"right"}]),Xe("clear","clear","Clear","select",[{label:"None",value:"none"},{label:"Left",value:"left"},{label:"Right",value:"right"},{label:"Both",value:"both"}]),Xe("cursor","cursor","Cursor","select",[{label:"Auto",value:"auto"},{label:"Default",value:"default"},{label:"Pointer",value:"pointer"},{label:"Move",value:"move"},{label:"Text",value:"text"},{label:"Wait",value:"wait"},{label:"Crosshair",value:"crosshair"},{label:"Not-allowed",value:"not-allowed"},{label:"Grab",value:"grab"},{label:"None",value:"none"}]),Xe("pointer_events","pointer-events","Pointer Events","select",[{label:"Auto",value:"auto"},{label:"None",value:"none"}])]},{id:"typography",name:"Typography",icon:"mdi:format-font",properties:[Xe("font_family","font-family","Font Family","font"),Xe("font_size","font-size","Font Size","unit"),Xe("font_weight","font-weight","Font Weight","select",[{label:"Normal",value:"normal"},{label:"Bold",value:"bold"},{label:"100",value:"100"},{label:"200",value:"200"},{label:"300",value:"300"},{label:"400",value:"400"},{label:"500",value:"500"},{label:"600",value:"600"},{label:"700",value:"700"},{label:"800",value:"800"},{label:"900",value:"900"}]),Xe("font_style","font-style","Font Style","select",[{label:"Normal",value:"normal"},{label:"Italic",value:"italic"},{label:"Oblique",value:"oblique"}]),Xe("font_variant","font-variant","Font Variant","text"),Xe("color","color","Color","color"),Xe("text_align","text-align","Text Align","select",[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"},{label:"Justify",value:"justify"}]),Xe("text_decoration","text-decoration","Text Decoration","select",[{label:"None",value:"none"},{label:"Underline",value:"underline"},{label:"Overline",value:"overline"},{label:"Line-through",value:"line-through"}]),Xe("text_transform","text-transform","Text Transform","select",[{label:"None",value:"none"},{label:"Uppercase",value:"uppercase"},{label:"Lowercase",value:"lowercase"},{label:"Capitalize",value:"capitalize"}]),Xe("text_indent","text-indent","Text Indent","unit"),Xe("text_overflow","text-overflow","Text Overflow","select",[{label:"Clip",value:"clip"},{label:"Ellipsis",value:"ellipsis"}]),Xe("text_shadow","text-shadow","Text Shadow","text"),Xe("line_height","line-height","Line Height","text"),Xe("letter_spacing","letter-spacing","Letter Spacing","unit"),Xe("word_spacing","word-spacing","Word Spacing","unit"),Xe("white_space","white-space","White Space","select",[{label:"Normal",value:"normal"},{label:"Nowrap",value:"nowrap"},{label:"Pre",value:"pre"},{label:"Pre-wrap",value:"pre-wrap"},{label:"Pre-line",value:"pre-line"},{label:"Break-spaces",value:"break-spaces"}]),Xe("word_break","word-break","Word Break","select",[{label:"Normal",value:"normal"},{label:"Break-all",value:"break-all"},{label:"Keep-all",value:"keep-all"},{label:"Break-word",value:"break-word"}]),Xe("overflow_wrap","overflow-wrap","Overflow Wrap","select",[{label:"Normal",value:"normal"},{label:"Break-word",value:"break-word"},{label:"Anywhere",value:"anywhere"}])]},{id:"backgrounds",name:"Backgrounds",icon:"mdi:image-area",properties:[Xe("background","background","Background","text"),Xe("background_color","background-color","Background Color","color"),Xe("background_image","background-image","Background Image","image"),Xe("background_position","background-position","Background Position","text"),Xe("background_size","background-size","Background Size","select",[{label:"Auto",value:"auto"},{label:"Cover",value:"cover"},{label:"Contain",value:"contain"}]),Xe("background_repeat","background-repeat","Background Repeat","select",[{label:"Repeat",value:"repeat"},{label:"No-repeat",value:"no-repeat"},{label:"Repeat-x",value:"repeat-x"},{label:"Repeat-y",value:"repeat-y"},{label:"Space",value:"space"},{label:"Round",value:"round"}]),Xe("background_attachment","background-attachment","Background Attachment","select",[{label:"Scroll",value:"scroll"},{label:"Fixed",value:"fixed"},{label:"Local",value:"local"}]),Xe("background_clip","background-clip","Background Clip","select",Ze),Xe("background_origin","background-origin","Background Origin","select",Ze),Xe("backdrop_filter","backdrop-filter","Backdrop Filter","text")]},{id:"flexbox",name:"Flexbox",icon:"mdi:view-column",properties:[Xe("flex_direction","flex-direction","Direction","select",[{label:"Row",value:"row"},{label:"Row-reverse",value:"row-reverse"},{label:"Column",value:"column"},{label:"Column-reverse",value:"column-reverse"}]),Xe("flex_wrap","flex-wrap","Wrap","select",[{label:"Nowrap",value:"nowrap"},{label:"Wrap",value:"wrap"},{label:"Wrap-reverse",value:"wrap-reverse"}]),Xe("justify_content","justify-content","Justify Content","select",[{label:"Flex-start",value:"flex-start"},{label:"Flex-end",value:"flex-end"},{label:"Center",value:"center"},{label:"Space-between",value:"space-between"},{label:"Space-around",value:"space-around"},{label:"Space-evenly",value:"space-evenly"}]),Xe("align_items","align-items","Align Items","select",[{label:"Stretch",value:"stretch"},{label:"Flex-start",value:"flex-start"},{label:"Flex-end",value:"flex-end"},{label:"Center",value:"center"},{label:"Baseline",value:"baseline"}]),Xe("align_content","align-content","Align Content","select",[{label:"Stretch",value:"stretch"},{label:"Flex-start",value:"flex-start"},{label:"Flex-end",value:"flex-end"},{label:"Center",value:"center"},{label:"Space-between",value:"space-between"},{label:"Space-around",value:"space-around"}]),Xe("gap","gap","Gap","unit"),Xe("row_gap","row-gap","Row Gap","unit"),Xe("column_gap","column-gap","Column Gap","unit"),Xe("flex","flex","Flex","text"),Xe("flex_grow","flex-grow","Flex Grow","number"),Xe("flex_shrink","flex-shrink","Flex Shrink","number"),Xe("flex_basis","flex-basis","Flex Basis","unit"),Xe("align_self","align-self","Align Self","select",[{label:"Auto",value:"auto"},{label:"Stretch",value:"stretch"},{label:"Flex-start",value:"flex-start"},{label:"Flex-end",value:"flex-end"},{label:"Center",value:"center"},{label:"Baseline",value:"baseline"}]),Xe("order","order","Order","number")]},{id:"grid",name:"CSS Grid",icon:"mdi:grid",properties:[Xe("grid_template_columns","grid-template-columns","Template Columns","text"),Xe("grid_template_rows","grid-template-rows","Template Rows","text"),Xe("grid_template_areas","grid-template-areas","Template Areas","text"),Xe("grid_auto_columns","grid-auto-columns","Auto Columns","text"),Xe("grid_auto_rows","grid-auto-rows","Auto Rows","text"),Xe("grid_auto_flow","grid-auto-flow","Auto Flow","select",[{label:"Row",value:"row"},{label:"Column",value:"column"},{label:"Dense",value:"dense"},{label:"Row dense",value:"row dense"},{label:"Column dense",value:"column dense"}]),Xe("grid_column","grid-column","Column","text"),Xe("grid_row","grid-row","Row","text"),Xe("grid_area","grid-area","Area","text")]},{id:"transitions",name:"Transitions & Animations",icon:"mdi:animation",properties:[Xe("transition","transition","Transition","text"),Xe("transition_property","transition-property","Transition Property","text"),Xe("transition_duration","transition-duration","Transition Duration","text"),Xe("transition_timing_function","transition-timing-function","Transition Timing","text"),Xe("transition_delay","transition-delay","Transition Delay","text"),Xe("transform","transform","Transform","text"),Xe("transform_origin","transform-origin","Transform Origin","text"),Xe("animation_name","animation-name","Animation Name","text"),Xe("animation_duration","animation-duration","Animation Duration","text"),Xe("animation_timing_function","animation-timing-function","Animation Timing","text"),Xe("animation_delay","animation-delay","Animation Delay","text"),Xe("animation_iteration_count","animation-iteration-count","Iteration Count","text"),Xe("animation_direction","animation-direction","Animation Direction","select",[{label:"Normal",value:"normal"},{label:"Reverse",value:"reverse"},{label:"Alternate",value:"alternate"},{label:"Alternate-reverse",value:"alternate-reverse"}]),Xe("animation_fill_mode","animation-fill-mode","Fill Mode","select",[{label:"None",value:"none"},{label:"Forwards",value:"forwards"},{label:"Backwards",value:"backwards"},{label:"Both",value:"both"}]),Xe("animation_play_state","animation-play-state","Play State","select",[{label:"Running",value:"running"},{label:"Paused",value:"paused"}]),Xe("filter","filter","Filter","text")]},{id:"lists-tables",name:"Lists & Tables",icon:"mdi:format-list-bulleted",properties:[Xe("list_style","list-style","List Style","text"),Xe("list_style_type","list-style-type","List Style Type","select",[{label:"None",value:"none"},{label:"Disc",value:"disc"},{label:"Circle",value:"circle"},{label:"Square",value:"square"},{label:"Decimal",value:"decimal"},{label:"Lower-alpha",value:"lower-alpha"},{label:"Upper-alpha",value:"upper-alpha"},{label:"Lower-roman",value:"lower-roman"},{label:"Upper-roman",value:"upper-roman"}]),Xe("list_style_position","list-style-position","List Style Position","select",[{label:"Outside",value:"outside"},{label:"Inside",value:"inside"}]),Xe("list_style_image","list-style-image","List Style Image","text"),Xe("border_collapse","border-collapse","Border Collapse","select",[{label:"Separate",value:"separate"},{label:"Collapse",value:"collapse"}]),Xe("border_spacing","border-spacing","Border Spacing","unit"),Xe("table_layout","table-layout","Table Layout","select",[{label:"Auto",value:"auto"},{label:"Fixed",value:"fixed"}]),Xe("caption_side","caption-side","Caption Side","select",[{label:"Top",value:"top"},{label:"Bottom",value:"bottom"}])]}];class it{static evaluate(e,t){if(!e?.conditions?.length)return!0;if(!t)return!0;const i=e.conditions.map(e=>it.evaluateCondition(e,t));return"any"===e.mode?i.some(Boolean):i.every(Boolean)}static evaluateCondition(e,t){switch(e.type){case"state":return it.evaluateStateCondition(e,t);case"attribute":return it.evaluateAttributeCondition(e,t);case"time":return it.evaluateTimeCondition(e);default:return!0}}static evaluateStateCondition(e,t){if(!e.entity)return!0;const i=t.states[e.entity];if(!i)return!1;const n=i.state;if(void 0!==e.state&&""!==e.state)return n===e.state;if(void 0!==e.state_not&&""!==e.state_not)return n!==e.state_not;const r=Number(n);if(!isNaN(r)){if(void 0!==e.above&&r<=e.above)return!1;if(void 0!==e.below&&r>=e.below)return!1}return!0}static evaluateAttributeCondition(e,t){if(!e.entity||!e.attribute)return!0;const i=t.states[e.entity];if(!i)return!1;const n=String(i.attributes[e.attribute]??"");if(void 0!==e.state&&""!==e.state)return n===e.state;if(void 0!==e.state_not&&""!==e.state_not)return n!==e.state_not;const r=Number(n);if(!isNaN(r)){if(void 0!==e.above&&r<=e.above)return!1;if(void 0!==e.below&&r>=e.below)return!1}return!0}static evaluateTimeCondition(e){const t=new Date,i=60*t.getHours()+t.getMinutes();if(e.after){const t=e.after.split(":").map(Number);if(t.length>=2){if(i<60*t[0]+t[1])return!1}}if(e.before){const t=e.before.split(":").map(Number);if(t.length>=2){if(i>=60*t[0]+t[1])return!1}}return!0}}const nt=function(){const e={};for(const t of tt)for(const i of t.properties)e[i.key]=i.cssProperty;return e}();function rt(e){if(!e)return"";const t=[],i=e;for(const[e,n]of Object.entries(nt)){const r=i[e];void 0!==r&&"string"==typeof r&&""!==r&&t.push(`${n}: ${r}`)}return e.css&&t.push(e.css),t.join("; ")}function ot(e,t,i){if(!e?.conditional?.length||!t)return e;const{conditional:n,...r}=e,o={...r};for(const e of n){const n=e.conditions.map(e=>!1!==e.use_module_entity&&i&&!e.entity?{...e,entity:i}:e),r={conditions:n,mode:e.mode};if(it.evaluate(r,t)){const t=e.design;for(const[e,i]of Object.entries(t))void 0!==i&&(o[e]=i)}}return o}function at(e){return Array.from({length:Math.max(e,1)},()=>"1fr").join(" ")}function st(e){return/^\d+(?:-\d+)*$/.test(e)?e.split("-").length:null}function lt(e,t){if(!e)return at(t??1);const i={1:"1fr","1-1":"1fr 1fr","1-2":"1fr 2fr","2-1":"2fr 1fr","1-1-1":"1fr 1fr 1fr","1-2-1":"1fr 2fr 1fr"};if(i[e])return t&&st(e)&&st(e)!==t?at(t):i[e];if(/^\d+(?:-\d+)+$/.test(e)){const i=e.split("-").length;return t&&i!==t?at(t):e.split("-").map(e=>`${Math.max(Number(e)||1,1)}fr`).join(" ")}return e}let ct=0;function dt(e="mc"){ct++;return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}_${ct}`}function pt(e){if(null===e||"object"!=typeof e)return e;if(Array.isArray(e))return e.map(e=>pt(e));const t={};for(const i of Object.keys(e))t[i]=pt(e[i]);return t}function ut(e,t){const i=pt(e);i.type=t.type,i.template=t.template;const n=new Set(t.not_synced||[]);n.size>0&&(i.not_synced=[...n]);const r=["use_page_theme","theme","background","background_image","border_radius","padding","box_shadow","card_height","overflow","css"];for(const e of r)n.has(e)&&void 0!==t[e]&&(i[e]=t[e]);const o=new Map,a=new Map,s=new Map;for(const e of t.rows||[]){e.id&&o.set(e.id,e);for(const t of e.columns||[]){t.id&&a.set(t.id,t);for(const e of t.modules||[])e.id&&s.set(e.id,e)}}const l=new Set((i.rows||[]).map(e=>e.id).filter(Boolean));i.rows=(i.rows||[]).map(e=>{const t=e.id?o.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);i.size>0&&(e.not_synced=[...i]),i.has("layout")&&void 0!==t.layout&&(e.layout=t.layout),i.has("design")&&t.design&&(e.design={...e.design,...t.design}),i.has("gap")&&void 0!==t.gap&&(e.gap=t.gap),i.has("padding")&&void 0!==t.padding&&(e.padding=t.padding)}const i=new Set((e.columns||[]).map(e=>e.id).filter(Boolean));if(e.columns=(e.columns||[]).map(e=>{const t=e.id?a.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);i.size>0&&(e.not_synced=[...i]),i.has("design")&&t.design&&(e.design={...e.design,...t.design}),i.has("gap")&&void 0!==t.gap&&(e.gap=t.gap),i.has("padding")&&void 0!==t.padding&&(e.padding=t.padding),i.has("vertical_align")&&void 0!==t.vertical_align&&(e.vertical_align=t.vertical_align)}const i=new Set((e.modules||[]).map(e=>e.id).filter(Boolean));if(e.modules=(e.modules||[]).map(e=>{const t=e.id?s.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);i.size>0&&(e.not_synced=[...i]);const n=["text","icon","entity","image","content","label","attribute","prefix","suffix","url","service","service_data","data"];for(const r of n)i.has(r)&&void 0!==t[r]&&(e[r]=t[r]);if(t.design&&i.has("design"))e.design={...e.design,...t.design};else if(t.design){const n={};for(const e of i)if(e.startsWith("design.")){const i=e.slice(7);void 0!==t.design[i]&&(n[i]=t.design[i])}Object.keys(n).length>0&&(e.design={...e.design,...n})}t.actions&&(i.has("actions")||[...i].some(e=>e.startsWith("actions.")))&&(e.actions={...e.actions,...t.actions})}return e}),t)for(const n of t.modules||[])n.id&&!i.has(n.id)&&e.modules.push(pt(n));return e}),t)for(const n of t.columns||[])n.id&&!i.has(n.id)&&e.columns.push(pt(n));return e});for(const e of t.rows||[])e.id&&!l.has(e.id)&&i.rows.push(pt(e));return i}class mt{static validate(e){const t=[],i=[];if(!e||"object"!=typeof e)return{valid:!1,errors:["Config must be an object"],warnings:i};const n=e;return n.type&&"string"==typeof n.type||t.push("Config must have a type"),Array.isArray(n.rows)?(n.rows.forEach((e,n)=>{e.columns&&Array.isArray(e.columns)?e.columns.forEach((e,r)=>{e.modules&&Array.isArray(e.modules)?e.modules.forEach((e,o)=>{if(e.type)if(Ye.has(e.type)){const i=Ye.get(e.type);if(i){const a=i.validate(e);t.push(...a.map(t=>`Row ${n}, Col ${r}, Module ${o} (${e.type}): ${t}`))}}else i.push(`Row ${n}, Col ${r}, Module ${o}: unknown type "${e.type}"`);else t.push(`Row ${n}, Col ${r}, Module ${o}: missing type`)}):t.push(`Row ${n}, Column ${r} must have a modules array`)}):t.push(`Row ${n} must have a columns array`)}),{valid:0===t.length,errors:t,warnings:i}):(t.push("Config must have a rows array"),{valid:!1,errors:t,warnings:i})}}const ht={en:JSON.parse('{"card":{"name":"Magic Card","description":"A fully open-source multi-module card"},"editor":{"mode_form":"Form","mode_yaml":"YAML","mode_tree":"Tree","add_row":"Add Row","add_module":"Add Module","delete":"Delete","undo":"Undo","redo":"Redo"},"tabs":{"general":"General","actions":"Actions","conditions":"Conditions","design":"Design"},"modules":{"text":"Text","icon":"Icon","info":"Info","image":"Image","markdown":"Markdown","bar":"Bar","graphs":"Graph","camera":"Camera","button":"Button","slider":"Slider","spinbox":"Spinbox","dropdown":"Dropdown","light":"Light","gauge":"Gauge","horizontal":"Horizontal","vertical":"Vertical","tabs":"Tabs","separator":"Separator","clock":"Clock","weather":"Weather","forecast":"Forecast","video-bg":"Video Background"},"actions_config":{"tap_action":"Tap Action","hold_action":"Hold Action","double_tap_action":"Double Tap Action","action_none":"None","action_more_info":"More Info","action_toggle":"Toggle","action_navigate":"Navigate","action_url":"URL","action_perform_action":"Perform Action","action_assist":"Assist"},"conditions":{"mode_every":"All conditions (AND)","mode_any":"Any condition (OR)","type_state":"State","type_attribute":"Attribute","type_time":"Time","type_template":"Template","add_condition":"Add Condition"}}'),nl:JSON.parse('{"card":{"name":"Magic Card","description":"Een volledig open-source multi-module kaart"},"editor":{"mode_form":"Formulier","mode_yaml":"YAML","mode_tree":"Boom","add_row":"Rij toevoegen","add_module":"Module toevoegen","delete":"Verwijderen","undo":"Ongedaan maken","redo":"Opnieuw"},"tabs":{"general":"Algemeen","actions":"Acties","conditions":"Conditionsa","design":"Ontwerp"},"modules":{"text":"Tekst","icon":"Icoon","info":"Info","image":"Afbeelding","markdown":"Markdown","bar":"Balk","graphs":"Grafiek","camera":"Camera","button":"Knop","slider":"Schuifregelaar","spinbox":"Spinbox","dropdown":"Dropdown","light":"Lamp","gauge":"Meter","horizontal":"Horizontaal","vertical":"Verticaal","tabs":"Tabbladen","separator":"Scheidingslijn","clock":"Klok","weather":"Weer","forecast":"Weersvoorspelling","video-bg":"Video achtergrond"},"actions_config":{"tap_action":"Tik actie","hold_action":"Vasthoud actie","double_tap_action":"Dubbeltik actie","action_none":"Geen","action_more_info":"Meer info","action_toggle":"Schakel","action_navigate":"Navigeer","action_url":"URL","action_perform_action":"Actie uitvoeren","action_assist":"Assistent"},"conditions":{"mode_every":"Alle condities (EN)","mode_any":"Elke conditie (OF)","type_state":"Status","type_attribute":"Attribuut","type_time":"Tijd","type_template":"Template","add_condition":"Conditie toevoegen"}}')};let gt="en";var vt,ft=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let bt=vt=class extends xe{constructor(){super(...arguments),this._templateFetched=!1,this._boundRequestUpdate=()=>this.requestUpdate(),this._holdTimers=new Map,this._cardInstanceId=dt("cardinst")}static getConfigElement(){return document.createElement(r)}static getStubConfig(){return{type:`custom:${n}`,rows:[{id:dt("row"),layout:"1",columns:[{id:dt("col"),modules:[{id:dt("text"),type:"text",text:"Welcome to Magic Card"}]}]}]}}setConfig(e){if(!e)throw new Error("No configuration provided");const t=mt.validate(e);if(!t.valid)throw new Error(`Invalid configuration: ${t.errors.join("; ")}`);const i=this._config?.template;this._config={...e,rows:e.rows||[]},e.template!==i&&(this._templateFetched=!1,this._resolvedConfig=void 0),this._config.rows=this._config.rows.map(e=>({...e,id:e.id||dt("row"),columns:(e.columns||[]).map(e=>({...e,id:e.id||dt("col"),modules:(e.modules||[]).map(e=>({...e,id:e.id||dt(e.type)}))}))}))}getCardSize(){return this._config?.rows?Math.max(this._config.rows.length,1):1}connectedCallback(){super.connectedCallback(),this.addEventListener("mc-request-update",this._boundRequestUpdate)}shouldUpdate(e){if(e.has("_config")||e.has("_resolvedConfig"))return!0;if(e.has("hass")&&this.hass){const i=e.get("hass");if(!i)return!0;if(i.language!==this.hass.language)return t=this.hass.language,gt=ht[t]?t:"en",!0;return this._getUsedEntities().some(e=>i.states[e]!==this.hass.states[e])}var t;return!0}updated(e){super.updated(e),this._reconcileInstanceRegistration(),this.hass&&this._config?.template&&(this._templateFetched||(this._templateFetched=!0,this._fetchTemplate(this._config.template),this._subscribeTemplateEvents()))}_isEditorPreview(){return!!this.closest("hui-card-preview, hui-card-editor, hui-dialog-edit-card, hui-element-editor")}_cancelPendingRegister(){void 0!==this._pendingRegisterTimer&&(window.clearTimeout(this._pendingRegisterTimer),this._pendingRegisterTimer=void 0)}_reconcileInstanceRegistration(){if(!this.hass)return;const e=this.isConnected&&!!this._config?.template&&!this._isEditorPreview()?this._config.template:void 0;if(e!==this._registeredTemplate||void 0!==this._pendingRegisterTimer){if(this._cancelPendingRegister(),this._registeredTemplate&&this._registeredTemplate!==e){const e=this._registeredTemplate;this._registeredTemplate=void 0,this.hass.callWS({type:"magic_card_utils/unregister_card_instance",name:e,card_id:this._cardInstanceId}).catch(()=>{})}e&&this._registeredTemplate!==e&&(this._pendingRegisterTimer=window.setTimeout(()=>{if(this._pendingRegisterTimer=void 0,!this.hass)return;if(!this.isConnected)return;if(this._isEditorPreview())return;(this._config?.template||void 0)===e&&this._registeredTemplate!==e&&(this._registeredTemplate=e,this.hass.callWS({type:"magic_card_utils/register_card_instance",name:e,card_id:this._cardInstanceId}).catch(()=>{}))},vt._REGISTER_DEBOUNCE_MS))}}_getUsedEntities(){const e=this._resolvedConfig??this._config;if(!e)return[];const t=new Set;this._collectEntities(e.display,t);for(const i of e.conditional_appearance||[])for(const e of i.conditions||[])e.entity&&t.add(e.entity);for(const i of e.rows||[]){this._collectEntities(i.display,t);for(const e of i.columns||[]){this._collectEntities(e.display,t);for(const i of e.modules||[])i.entity&&t.add(i.entity),this._collectEntities(i.display,t),i.actions?.tap_action?.entity&&t.add(i.actions.tap_action.entity),i.actions?.hold_action?.entity&&t.add(i.actions.hold_action.entity),i.actions?.double_tap_action?.entity&&t.add(i.actions.double_tap_action.entity)}}return Array.from(t)}_collectEntities(e,t){if(e?.conditions)for(const i of e.conditions)i.entity&&t.add(i.entity)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mc-request-update",this._boundRequestUpdate),this._unsubTemplateEvents?.(),this._unsubTemplateEvents=void 0,this._cancelPendingRegister(),this._reconcileInstanceRegistration()}async _fetchTemplate(e){if(this.hass&&this._config)try{const t=await this.hass.callWS({type:"magic_card_utils/get_templates"}),i=t.templates?.[e];i&&(this._resolvedConfig=ut(i.config,this._config))}catch(t){console.warn("Magic Card: Failed to fetch template",e,t)}}_subscribeTemplateEvents(){!this._unsubTemplateEvents&&this.hass&&this.hass.connection.subscribeEvents(e=>{this._config?.template&&e.data.name===this._config.template&&this._fetchTemplate(this._config.template)},"magic_card_utils_template_updated").then(e=>{this._unsubTemplateEvents=e})}render(){const e=this._resolvedConfig??this._config;if(!e)return te`<ha-card><div class="mc-error">No configuration</div></ha-card>`;if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return te``;const t=this._resolveCardAppearance(e),i=this._buildCardStyle(t),n=this._buildThemeStyle(t);return te`
      <ha-card style=${n||ne}>
        <div class="mc-card-content" style=${i}>
          ${e.rows.map(e=>this._renderRow(e))}
        </div>
      </ha-card>
    `}_resolveCardAppearance(e){const t=e.conditional_appearance;if(!t?.length)return e;let i=e;for(const e of t){const t={conditions:e.conditions,mode:e.mode};if(!this._evaluateDisplay(t))continue;const n=e.overrides||{},r={};for(const[e,t]of Object.entries(n))void 0!==t&&""!==t&&null!==t&&(r[e]=t);i={...i,...r}}return i}_buildThemeStyle(e){if(!this.hass)return"";if(!1!==e.use_page_theme)return"";const t=e.theme||this.hass.themes?.default_theme;if(!t)return"";const i=this.hass.themes?.themes?.[t];return i?Object.entries(i).map(([e,t])=>`${e.startsWith("--")?e:`--${e}`}: ${String(t)}`).join("; "):""}_buildCardStyle(e){const t=[];e.padding&&t.push(`padding: ${e.padding}`);const i=[];return e.background_image&&i.push(e.background_image),e.background&&i.push(e.background),i.length>0&&t.push(`background: ${i.join(" ")}`),e.background_image&&(t.push("background-size: cover"),t.push("background-position: center"),t.push("background-repeat: no-repeat")),e.border_radius&&t.push(`border-radius: ${e.border_radius}`),e.box_shadow&&t.push(`box-shadow: ${e.box_shadow}`),e.card_height&&t.push(`min-height: ${e.card_height}`),e.overflow&&t.push(`overflow: ${e.overflow}`),t.join("; ")}_renderRow(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return te``;const t=`grid-template-columns: ${lt(e.layout||"1",e.columns?.length||1)}; gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,i=rt(ot(e.design,this.hass));return te`
      <div class="mc-row" style="${t}; ${i}">
        ${e.columns.map(e=>this._renderColumn(e))}
      </div>
    `}_renderColumn(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return te``;const t=`gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,i=rt(ot(e.design,this.hass));return te`
      <div
        class="mc-column"
        data-valign=${e.vertical_align||ne}
        style="${t}; ${i}"
      >
        ${e.modules.map(e=>this._renderModule(e))}
      </div>
    `}_renderModule(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return te``;const t=Ye.get(e.type);if(!t)return te`<div class="mc-error">Unknown module: ${e.type}</div>`;const i=rt(ot(e.design,this.hass,e.entity)),n=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return te`
      <div
        class="mc-module-wrapper ${n?"mc-hoverable":""}"
        role=${n?"button":ne}
        tabindex=${n?0:ne}
        aria-label=${n?this._getActionLabel(e):ne}
        style=${i}
        @pointerdown=${n?t=>this._onPointerDown(t,e):ne}
        @pointerup=${n?t=>this._onPointerUp(t,e):ne}
        @pointercancel=${n?e=>this._onPointerCancel(e):ne}
        @contextmenu=${n?e=>e.preventDefault():ne}
        @dblclick=${n?t=>this._handleAction(t,e,"double_tap"):ne}
        @keydown=${n?t=>this._onKeyDown(t,e):ne}
      >
        ${t.renderPreview(e,this.hass)}
      </div>
    `}_getActionLabel(e){const t=e.label||e.name;return t?`Activate ${t}`:`Activate ${e.type} module`}_onPointerDown(e,t){const i=e.currentTarget,n=window.setTimeout(()=>{this._holdTimers.delete(i),this._handleAction(e,t,"hold")},500);this._holdTimers.set(i,n)}_onPointerUp(e,t){const i=e.currentTarget,n=this._holdTimers.get(i);void 0!==n&&(window.clearTimeout(n),this._holdTimers.delete(i),this._handleAction(e,t,"tap"))}_onPointerCancel(e){const t=e.currentTarget,i=this._holdTimers.get(t);void 0!==i&&(window.clearTimeout(i),this._holdTimers.delete(t))}_onKeyDown(e,t){if("Enter"===e.key||" "===e.key){if(e.preventDefault(),e.ctrlKey||e.metaKey)return void this._handleAction(e,t,"double_tap");if(e.shiftKey)return void this._handleAction(e,t,"hold");this._handleAction(e,t,"tap")}}_evaluateDisplay(e){if(!e.conditions?.length)return!0;if(!this.hass)return!0;const t=e.conditions.map(e=>{switch(e.type){case"state":{if(!e.entity)return!0;const t=this.hass.states[e.entity];return!!t&&(void 0!==e.state&&""!==e.state?t.state===e.state:void 0!==e.state_not&&""!==e.state_not?t.state!==e.state_not:!(void 0!==e.above&&Number(t.state)<=e.above)&&!(void 0!==e.below&&Number(t.state)>=e.below))}case"attribute":{if(!e.entity||!e.attribute)return!0;const t=this.hass.states[e.entity];if(!t)return!1;const i=String(t.attributes[e.attribute]??"");return void 0!==e.state&&""!==e.state?i===e.state:void 0===e.state_not||""===e.state_not||i!==e.state_not}case"time":{const t=new Date,i=60*t.getHours()+t.getMinutes();if(e.after){const[t,n]=e.after.split(":").map(Number);if(i<60*t+n)return!1}if(e.before){const[t,n]=e.before.split(":").map(Number);if(i>=60*t+n)return!1}return!0}default:return!0}});return"any"===e.mode?t.some(Boolean):t.every(Boolean)}_handleAction(e,t,i){const n=`${i}_action`,r=t.actions?.[n];if(!r||"none"===r.action)return;r.haptic&&this.dispatchEvent(new CustomEvent("haptic",{bubbles:!0,composed:!0,detail:r.haptic}));const o=!1!==r.use_module_entity?r.entity||t.entity:r.entity;switch(r.action){case"more-info":o&&this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:o}}));break;case"toggle":if(o){const e=o.split(".")[0];this.hass?.callService(e,"toggle",{entity_id:o})}break;case"navigate":r.navigation_path&&(history.pushState(null,"",r.navigation_path),window.dispatchEvent(new Event("location-changed",{bubbles:!0,composed:!0})));break;case"url":if(r.url_path)try{const e=new URL(r.url_path,window.location.href);"http:"===e.protocol||"https:"===e.protocol?window.open(e.href,"_blank","noopener,noreferrer"):console.warn("Magic Card: Blocked unsafe URL protocol:",e.protocol)}catch{console.warn("Magic Card: Invalid URL:",r.url_path)}break;case"perform-action":if(r.service){const[e,t]=r.service.split(".");this.hass?.callService(e,t,{...r.data,...r.service_data})}break;case"assist":this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}}}));break;case"fire-dom-event":this.dispatchEvent(new CustomEvent("ll-custom",{bubbles:!0,composed:!0,detail:r.data||{}}))}}};function yt(...e){return e.filter(e=>void 0!==e&&""!==e).map(e=>String(e)).join(".")}function xt(e,t){return e.basePath?yt(e.basePath,t):t}bt.styles=Me,bt._REGISTER_DEBOUNCE_MS=1500,ft([Se({attribute:!1})],bt.prototype,"hass",void 0),ft([Ce()],bt.prototype,"_config",void 0),ft([Ce()],bt.prototype,"_resolvedConfig",void 0),bt=vt=ft([we(n)],bt);var _t=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let wt=class extends xe{constructor(){super(...arguments),this.synced=!1,this.hasTemplate=!1,this.propertyPath="",this.hideIfNoTemplate=!1}_handleClick(e){e.preventDefault(),e.stopPropagation(),this.dispatchEvent(new CustomEvent("sync-toggle",{detail:{synced:this.synced,propertyPath:this.propertyPath},bubbles:!0,composed:!0}))}render(){return this.hasTemplate?this.synced?te`
        <button
          class="mc-sync-btn synced"
          type="button"
          title="Synced with template '${this.hasTemplate}'. Click to make local changes that won't sync."
          @click=${this._handleClick}
        >
          <ha-icon icon="mdi:link-variant"></ha-icon>
        </button>
      `:te`
      <button
        class="mc-sync-btn not-synced"
        type="button"
        title="Not synced - has local changes. Click to re-sync from template."
        @click=${this._handleClick}
      >
        <ha-icon icon="mdi:link-variant-off"></ha-icon>
      </button>
    `:this.hideIfNoTemplate?ne:te``}};wt.styles=Ge,_t([Se({type:Boolean})],wt.prototype,"synced",void 0),_t([Se({type:Boolean})],wt.prototype,"hasTemplate",void 0),_t([Se({type:String})],wt.prototype,"propertyPath",void 0),_t([Se({type:Boolean})],wt.prototype,"hideIfNoTemplate",void 0),wt=_t([we("mc-sync-indicator")],wt);class kt{constructor(e,t={}){this._modal=null,this._positioned=!1,this._maximized=!1,this._dragged=!1,this._preMaxRect=null,this._dragStartX=0,this._dragStartY=0,this._dragStartLeft=0,this._dragStartTop=0,this._isDragging=!1,this._resizeStartX=0,this._resizeStartY=0,this._resizeStartW=0,this._resizeStartH=0,this._isResizing=!1,this._onPointerMoveBound=this._onPointerMove.bind(this),this._onPointerUpBound=this._onPointerUp.bind(this),this._onTouchMoveBound=this._onTouchMove.bind(this),this._onTouchEndBound=this._onTouchEnd.bind(this),this._host=e,this._minWidth=t.minWidth??320,this._minHeight=t.minHeight??240,e.addController(this)}hostDisconnected(){this._removeGlobalListeners()}get isMaximized(){return this._maximized}consumeDragFlag(){return!!this._dragged&&(this._dragged=!1,!0)}reset(){this._removeGlobalListeners(),this._modal&&(this._modal.classList.remove("mc-modal--positioned","mc-modal--maximized"),this._modal.style.removeProperty("left"),this._modal.style.removeProperty("top"),this._modal.style.removeProperty("width"),this._modal.style.removeProperty("height"),this._modal.style.removeProperty("position"),this._modal.style.removeProperty("margin"),this._modal.style.removeProperty("max-width"),this._modal.style.removeProperty("max-height")),this._modal=null,this._positioned=!1,this._maximized=!1,this._dragged=!1,this._preMaxRect=null,this._isDragging=!1,this._isResizing=!1}bindModal(e){this._modal=e}handleHeaderPointerDown(e){this._shouldIgnoreTarget(e.target)||(e.preventDefault(),this._ensureModal(e),this._modal&&(this._ensurePositioned(),this._isDragging=!0,this._dragStartX=e.clientX,this._dragStartY=e.clientY,this._dragStartLeft=parseInt(this._modal.style.left)||0,this._dragStartTop=parseInt(this._modal.style.top)||0,document.addEventListener("pointermove",this._onPointerMoveBound),document.addEventListener("pointerup",this._onPointerUpBound)))}handleHeaderTouchStart(e){if(this._shouldIgnoreTarget(e.target))return;if(1!==e.touches.length)return;if(this._ensureModalFromTouch(e),!this._modal)return;this._ensurePositioned();const t=e.touches[0];this._isDragging=!0,this._dragStartX=t.clientX,this._dragStartY=t.clientY,this._dragStartLeft=parseInt(this._modal.style.left)||0,this._dragStartTop=parseInt(this._modal.style.top)||0,document.addEventListener("touchmove",this._onTouchMoveBound,{passive:!1}),document.addEventListener("touchend",this._onTouchEndBound)}handleResizePointerDown(e){e.preventDefault(),e.stopPropagation(),this._ensureModal(e),this._modal&&(this._ensurePositioned(),this._isResizing=!0,this._resizeStartX=e.clientX,this._resizeStartY=e.clientY,this._resizeStartW=this._modal.offsetWidth,this._resizeStartH=this._modal.offsetHeight,document.addEventListener("pointermove",this._onPointerMoveBound),document.addEventListener("pointerup",this._onPointerUpBound))}handleResizeTouchStart(e){if(1!==e.touches.length)return;if(e.stopPropagation(),this._ensureModalFromTouch(e),!this._modal)return;this._ensurePositioned();const t=e.touches[0];this._isResizing=!0,this._resizeStartX=t.clientX,this._resizeStartY=t.clientY,this._resizeStartW=this._modal.offsetWidth,this._resizeStartH=this._modal.offsetHeight,document.addEventListener("touchmove",this._onTouchMoveBound,{passive:!1}),document.addEventListener("touchend",this._onTouchEndBound)}toggleMaximize(){if(this._modal){if(this._maximized)this._modal.classList.remove("mc-modal--maximized"),this._preMaxRect&&(this._modal.style.left=this._preMaxRect.left+"px",this._modal.style.top=this._preMaxRect.top+"px",this._modal.style.width=this._preMaxRect.width+"px",this._modal.style.height=this._preMaxRect.height+"px"),this._maximized=!1;else{this._ensurePositioned(),this._preMaxRect={left:parseInt(this._modal.style.left)||0,top:parseInt(this._modal.style.top)||0,width:this._modal.offsetWidth,height:this._modal.offsetHeight};const e=16;this._modal.style.left=e+"px",this._modal.style.top=e+"px",this._modal.style.width=window.innerWidth-2*e+"px",this._modal.style.height=window.innerHeight-2*e+"px",this._modal.classList.add("mc-modal--maximized"),this._maximized=!0}this._host.requestUpdate()}}_shouldIgnoreTarget(e){const t=e.tagName.toLowerCase();return"button"===t||"input"===t||"select"===t||"textarea"===t||"ha-icon"===t||null!==e.closest("button")}_ensureModal(e){if(!this._modal){const t=e.currentTarget;this._modal=t.closest(".mc-modal, .mc-picker-modal")}}_ensureModalFromTouch(e){if(!this._modal){const t=e.currentTarget;this._modal=t.closest(".mc-modal, .mc-picker-modal")}}_ensurePositioned(){if(this._positioned||!this._modal)return;const e=this._modal.getBoundingClientRect();this._modal.style.position="fixed",this._modal.style.left=e.left+"px",this._modal.style.top=e.top+"px",this._modal.style.width=e.width+"px",this._modal.style.height=e.height+"px",this._modal.style.margin="0",this._modal.style.maxWidth="none",this._modal.style.maxHeight="none",this._modal.classList.add("mc-modal--positioned"),this._positioned=!0}_onPointerMove(e){this._handleMove(e.clientX,e.clientY)}_onPointerUp(){this._handleEnd(),document.removeEventListener("pointermove",this._onPointerMoveBound),document.removeEventListener("pointerup",this._onPointerUpBound)}_onTouchMove(e){if(1!==e.touches.length)return;e.preventDefault();const t=e.touches[0];this._handleMove(t.clientX,t.clientY)}_onTouchEnd(){this._handleEnd(),document.removeEventListener("touchmove",this._onTouchMoveBound),document.removeEventListener("touchend",this._onTouchEndBound)}_handleMove(e,t){if(this._modal){if(this._isDragging){const i=e-this._dragStartX,n=t-this._dragStartY;this._modal.style.left=this._dragStartLeft+i+"px",this._modal.style.top=this._dragStartTop+n+"px",this._dragged=!0}if(this._isResizing){const i=e-this._resizeStartX,n=t-this._resizeStartY,r=Math.max(this._minWidth,this._resizeStartW+i),o=Math.max(this._minHeight,this._resizeStartH+n);this._modal.style.width=r+"px",this._modal.style.height=o+"px",this._dragged=!0}}}_handleEnd(){this._isDragging=!1,this._isResizing=!1}_removeGlobalListeners(){document.removeEventListener("pointermove",this._onPointerMoveBound),document.removeEventListener("pointerup",this._onPointerUpBound),document.removeEventListener("touchmove",this._onTouchMoveBound),document.removeEventListener("touchend",this._onTouchEndBound)}}var $t=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let St=class extends xe{constructor(){super(...arguments),this.value="",this.entityId="",this._modalCtrl=new kt(this),this._showModal=!1,this._searchQuery="",this._selectedAttribute=""}_openModal(){this._selectedAttribute=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._modalCtrl.reset(),this._showModal=!1}_handleSave(){this.value=this._selectedAttribute,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedAttribute},bubbles:!0,composed:!0})),this._closeModal()}_selectAttribute(e){this._selectedAttribute=e}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_clearValue(){this.value="",this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:""},bubbles:!0,composed:!0}))}_getAttributes(){if(!this.hass||!this.entityId)return[];const e=this.hass.states[this.entityId];return e?Object.entries(e.attributes).map(([e,t])=>({name:e,value:String(t??"")})).filter(e=>{if(!this._searchQuery)return!0;const t=this._searchQuery.toLowerCase();return e.name.toLowerCase().includes(t)||e.value.toLowerCase().includes(t)}).sort((e,t)=>e.name.localeCompare(t.name)):[]}_getAttributeValue(){if(!this.hass||!this.entityId||!this.value)return null;const e=this.hass.states[this.entityId];if(!e)return null;const t=e.attributes[this.value];return void 0!==t?String(t):null}render(){const e=this._getAttributeValue();return te`
      <div class="mc-picker-row">
        ${this.value&&null!==e?te`
            <div class="mc-picker-entity-info" @click=${this._openModal} title=${this.value}>
              <div class="mc-picker-entity-icon">
                <ha-icon icon="mdi:tag-text-outline"></ha-icon>
              </div>
              <div class="mc-picker-entity-details">
                <div class="mc-picker-entity-name">${this.value}</div>
                <div class="mc-picker-entity-id">${e}</div>
              </div>
            </div>
          `:te`
            <input
              type="text"
              class="mc-picker-input"
              .value=${this.value}
              placeholder="attribute"
              @input=${this._onInputChange}
            />
          `}
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getAttributes();return te`
      <div class="mc-picker-overlay" @click=${()=>{this._modalCtrl.consumeDragFlag()||this._closeModal()}}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
              <span class="mc-picker-title">Select Attribute</span>
            </div>
            <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
          </div>
          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search attributes..."
              .value=${this._searchQuery}
              @input=${e=>{this._searchQuery=e.target.value}}
            />
          </div>
          <div class="mc-picker-list">
            ${e.length>0?e.map(e=>te`
                  <div class="mc-picker-item ${this._selectedAttribute===e.name?"selected":""}"
                       @click=${()=>this._selectAttribute(e.name)}>
                    <div class="mc-picker-item-icon">
                      <ha-icon icon="mdi:tag-text-outline"></ha-icon>
                    </div>
                    <div class="mc-picker-item-content">
                      <div class="mc-picker-item-name">${e.name}</div>
                    </div>
                    <span class="mc-picker-item-state">${e.value.length>30?e.value.slice(0,30)+"...":e.value}</span>
                  </div>
                `):te`<div class="mc-picker-empty">No attributes found</div>`}
          </div>
          <div class="mc-picker-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${e=>this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `}};St.styles=[Ee],$t([Se({attribute:!1})],St.prototype,"hass",void 0),$t([Se({type:String})],St.prototype,"value",void 0),$t([Se({type:String})],St.prototype,"entityId",void 0),$t([Ce()],St.prototype,"_showModal",void 0),$t([Ce()],St.prototype,"_searchQuery",void 0),$t([Ce()],St.prototype,"_selectedAttribute",void 0),St=$t([we("mc-attribute-picker")],St);var Ct=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};const Tt=["px","em","rem","%","vw","vh","auto"];let Mt=class extends xe{constructor(){super(...arguments),this.value="",this.label="",this.placeholder="",this.disabled=!1}_parseValue(){if(!this.value)return{number:"",unit:"px"};if("auto"===this.value)return{number:"",unit:"auto"};const e=this.value.match(/^(-?[\d.]+)\s*(px|em|rem|%|vw|vh)?$/);return e?{number:e[1],unit:e[2]||"px"}:{number:this.value,unit:"px"}}_emitChange(e,t){let i="";"auto"===t?i="auto":e&&(i=`${e}${t}`),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:i}}))}render(){const{number:e,unit:t}=this._parseValue();return te`
      <div class="mc-unit-field">
        <input
          class="mc-unit-input"
          type="text"
          .value=${"auto"===t?"":e}
          placeholder=${this.placeholder||"0"}
          ?disabled=${this.disabled||"auto"===t}
          @input=${e=>{const i=e.target.value;this._emitChange(i,t)}}
        />
        <select
          class="mc-unit-select"
          .value=${t}
          ?disabled=${this.disabled}
          @change=${t=>{const i=t.target.value;this._emitChange(e,i)}}
        >
          ${Tt.map(e=>te`
            <option value=${e} ?selected=${t===e}>${e}</option>
          `)}
        </select>
      </div>
    `}};Mt.styles=[ze,Ve],Ct([Se({type:String})],Mt.prototype,"value",void 0),Ct([Se({type:String})],Mt.prototype,"label",void 0),Ct([Se({type:String})],Mt.prototype,"placeholder",void 0),Ct([Se({type:Boolean})],Mt.prototype,"disabled",void 0),Mt=Ct([we("mc-unit-field")],Mt);var zt=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let At=class extends xe{constructor(){super(...arguments),this.design={},this.baseName="padding",this._linked=!1}_getSuffixKey(e,t){if("border_radius"===e){return{top:"border_top_left_radius",right:"border_top_right_radius",bottom:"border_bottom_right_radius",left:"border_bottom_left_radius"}[t]||`${e}_${t}`}return`${e}_${t}`}_getValue(e){const t=this._getSuffixKey(this.baseName,e),i=this.design;if(this.design[this.baseName]){const t=String(this.design[this.baseName]).split(" ");if(1===t.length)return t[0];if(2===t.length)return"top"===e||"bottom"===e?t[0]:t[1];if(3===t.length){if("top"===e)return t[0];if("right"===e||"left"===e)return t[1];if("bottom"===e)return t[2]}if(4===t.length){if("top"===e)return t[0];if("right"===e)return t[1];if("bottom"===e)return t[2];if("left"===e)return t[3]}}return i[t]||""}_handleValueChange(e,t){const i={},n=this._getSuffixKey(this.baseName,"top"),r=this._getSuffixKey(this.baseName,"right"),o=this._getSuffixKey(this.baseName,"bottom"),a=this._getSuffixKey(this.baseName,"left");if(i[this.baseName]=void 0,this._linked&&"top"===e)i[n]=t,i[r]=t,i[o]=t,i[a]=t;else if(!this._linked){i[this._getSuffixKey(this.baseName,e)]=t}this.onChange(i)}_toggleLink(){if(this._linked=!this._linked,this._linked){const e=this._getValue("top");if(e){const t={};t[this.baseName]=void 0,t[this._getSuffixKey(this.baseName,"top")]=e,t[this._getSuffixKey(this.baseName,"right")]=e,t[this._getSuffixKey(this.baseName,"bottom")]=e,t[this._getSuffixKey(this.baseName,"left")]=e,this.onChange(t)}}}_getLabel(e){if("border_radius"===this.baseName){return{top:"TL",right:"TR",bottom:"BR",left:"BL"}[e]||e}return e.charAt(0).toUpperCase()}_renderInput(e){const t=this._linked&&"top"!==e,i=this._linked?this._getValue("top"):this._getValue(e);return te`
      <div class="mc-box-input ${t?"disabled":""}">
        <label>${this._getLabel(e)}</label>
        <mc-unit-field
          .value=${i}
          ?disabled=${t}
          @value-changed=${t=>this._handleValueChange(e,t.detail.value)}
        ></mc-unit-field>
      </div>
    `}render(){return te`
      <div class="mc-box-field">
        <div class="mc-box-toolbar">
          <button
            class="mc-box-link-btn ${this._linked?"linked":""}"
            title="${this._linked?"Unlink values":"Link values"}"
            @click=${this._toggleLink}
          >
            <ha-icon icon="${this._linked?"mdi:link":"mdi:link-off"}"></ha-icon>
            <span>${this._linked?"Linked":"Per side"}</span>
          </button>
        </div>
        <div class="mc-box-inputs">
          ${this._renderInput("top")}
          ${this._renderInput("right")}
          ${this._renderInput("bottom")}
          ${this._renderInput("left")}
        </div>
      </div>
    `}};function Et(e,t,i){if(!(t&&i&&!!i.templateName))return te`<label class="mc-field-label">${e}</label>`;const n=!function(e,t){const i=e.basePath?yt(e.basePath,t):t;return e.notSynced.includes(i)}(i,t),r=xt(i,t);return te`
    <label class="mc-field-label">
      ${e}
      <mc-sync-indicator
        .synced=${n}
        .hasTemplate=${!0}
        .propertyPath=${r}
        .hideIfNoTemplate=${!0}
        @sync-toggle=${e=>{const t=new CustomEvent("field-sync-toggle",{detail:{propertyPath:e.detail.propertyPath,synced:e.detail.synced},bubbles:!0,composed:!0});e.target.dispatchEvent(t)}}
      ></mc-sync-indicator>
    </label>
  `}function Pt(e,t){return te`<div class=${"mc-field-hint"+(t?` ${t}`:"")}>${e}</div>`}function It(e){const t=(e||"").trim();if(!t)return{top:"",right:"",bottom:"",left:""};const i=t.split(/\s+/);return 1===i.length?{top:i[0],right:i[0],bottom:i[0],left:i[0]}:2===i.length?{top:i[0],right:i[1],bottom:i[0],left:i[1]}:3===i.length?{top:i[0],right:i[1],bottom:i[2],left:i[1]}:{top:i[0]||"",right:i[1]||"",bottom:i[2]||"",left:i[3]||""}}function Rt(e){const{top:t,right:i,bottom:n,left:r}=e;if(t||i||n||r)return t===i&&i===n&&n===r?t||void 0:t===n&&i===r?`${t||"0"} ${i||"0"}`:i===r?`${t||"0"} ${i||"0"} ${n||"0"}`:`${t||"0"} ${i||"0"} ${n||"0"} ${r||"0"}`}function Lt(e,t,i,n,r){return te`
    <div class="mc-field">
      ${Et(e,n,r)}
      <input
        type="text"
        .value=${t||""}
        @input=${e=>i(e.target.value)}
      />
    </div>
  `}function Dt(e,t,i,n,r,o){return te`
    <div class="mc-field">
      ${Et(e,r,o)}
      <textarea
        .value=${t||""}
        rows=${String(n?.rows??4)}
        placeholder=${n?.placeholder??ne}
        @input=${e=>i(e.target.value)}
      ></textarea>
    </div>
  `}function Ot(e,t,i,n,r,o){return te`
    <div class="mc-field">
      ${Et(e,r,o)}
      <input
        type="number"
        .value=${String(t??"")}
        min=${n?.min??ne}
        max=${n?.max??ne}
        step=${n?.step??ne}
        @input=${e=>i(Number(e.target.value))}
      />
    </div>
  `}function Nt(e,t,i,n,r,o){return te`
    <div class="mc-field">
     ${e?Et(e,r,o):ne}
      <select @change=${e=>n(e.target.value)}>
        ${i.map(e=>te`<option value=${e.value} ?selected=${t===e.value}>
              ${e.label}
            </option>`)}
      </select>
    </div>
  `}function jt(e,t,i,n,r){return te`
    <div class="mc-field mc-field-toggle">
      ${Et(e,n,r)}
      <ha-switch
        .checked=${t??!1}
        @change=${e=>i(e.target.checked)}
      ></ha-switch>
    </div>
  `}function Ft(e,t,i,n,r,o,a){return te`
    <div class="mc-field">
      ${Et(e,o,a)}
      <mc-entity-picker
        .hass=${n}
        .value=${t||""}
        .domain=${r||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-entity-picker>
    </div>
  `}function Bt(e,t,i,n,r){return te`
    <div class="mc-field">
      ${Et(e,n,r)}
      <mc-color-picker
        .value=${t||""}
        .label=${e}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-color-picker>
    </div>
  `}function Ht(e,t,i,n,r){return te`
    <div class="mc-field">
      ${Et(e,n,r)}
      <mc-unit-field
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-unit-field>
    </div>
  `}function Gt(e,t,i,n,r,o){const a={[n]:t||""};return te`
    <div class="mc-field">
      ${Et(e,r,o)}
      <mc-box-field
        .design=${a}
        .onChange=${e=>i(function(e,t,i){const n=It(e);return"string"==typeof i[t]?Rt(It(i[t])):("string"==typeof i[`${t}_top`]&&(n.top=i[`${t}_top`]),"string"==typeof i[`${t}_right`]&&(n.right=i[`${t}_right`]),"string"==typeof i[`${t}_bottom`]&&(n.bottom=i[`${t}_bottom`]),"string"==typeof i[`${t}_left`]&&(n.left=i[`${t}_left`]),"border_radius"===t&&("string"==typeof i.border_top_left_radius&&(n.top=i.border_top_left_radius),"string"==typeof i.border_top_right_radius&&(n.right=i.border_top_right_radius),"string"==typeof i.border_bottom_right_radius&&(n.bottom=i.border_bottom_right_radius),"string"==typeof i.border_bottom_left_radius&&(n.left=i.border_bottom_left_radius)),Rt(n))}(t,n,e))}
        .baseName=${n}
      ></mc-box-field>
    </div>
  `}function Ut(e,t,i,n,r,o){return te`
    <div class="mc-field">
      ${Et(e,r,o)}
      <mc-icon-picker
        .hass=${n}
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value||"")}
      ></mc-icon-picker>
    </div>
  `}function Vt(e,t,i,n,r,o,a){return te`
    <div class="mc-field">
      ${Et(e,o,a)}
      <mc-media-picker
        .hass=${n}
        .value=${t||""}
        .mediaType=${r||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-media-picker>
    </div>
  `}function qt(e,t,i,n,r,o,a){if(!r||!n)return te``;const s=n.states[r];return s&&0!==Object.keys(s.attributes).length?te`
    <div class="mc-field">
      ${Et(e,o,a)}
      <mc-attribute-picker
        .hass=${n}
        .value=${t||""}
        .entityId=${r}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-attribute-picker>
    </div>
  `:te``}At.styles=[ze,qe],zt([Se({attribute:!1})],At.prototype,"design",void 0),zt([Se({attribute:!1})],At.prototype,"onChange",void 0),zt([Se({type:String})],At.prototype,"baseName",void 0),zt([Ce()],At.prototype,"_linked",void 0),At=zt([we("mc-box-field")],At);class Wt{constructor(e=50){this.undoStack=[],this.redoStack=[],this.limit=e}push(e){this.undoStack.push(pt(e)),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack=[]}undo(e){return 0===this.undoStack.length?null:(this.redoStack.push(pt(e)),this.undoStack.pop())}redo(e){return 0===this.redoStack.length?null:(this.undoStack.push(pt(e)),this.redoStack.pop())}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}clear(){this.undoStack=[],this.redoStack=[]}get undoCount(){return this.undoStack.length}get redoCount(){return this.redoStack.length}}class Qt{constructor(e){this.fireEvent=e,this.undoRedo=new Wt,this.listeners=new Set,this.state={config:{type:"custom:magic-card",rows:[]},selectedPath:null,activeTab:"general",editorMode:"form",isDirty:!1},this.dispatchConfigChanged=function(e,t){let i=null;const n=function(...n){null!==i&&clearTimeout(i),i=setTimeout(()=>{e.apply(this,n),i=null},t)};return n.cancel=()=>{null!==i&&(clearTimeout(i),i=null)},n}(e=>{this.fireEvent(e)},200)}subscribe(e){return this.listeners.add(e),e(this.state),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return this.state}getConfig(){return this.state.config}getSelectedModule(){const e=this.state.selectedPath;return void 0===e?.rowIndex||void 0===e?.columnIndex||void 0===e?.moduleIndex?null:this.state.config.rows[e.rowIndex]?.columns[e.columnIndex]?.modules[e.moduleIndex]??null}setConfig(e){this.state={...this.state,config:pt(e),isDirty:!1},this.notify()}updateConfig(e,t=!0){t&&this.undoRedo.push(this.state.config),this.state={...this.state,config:pt(e),isDirty:!0},this.notify(),this.dispatchConfigChanged(this.state.config)}setEditorMode(e){this.state={...this.state,editorMode:e},this.notify()}setSelectedPath(e){this.state={...this.state,selectedPath:e},this.notify()}setActiveTab(e){this.state={...this.state,activeTab:e},this.notify()}_equalLayout(e){return Array.from({length:Math.max(e,1)},()=>"1").join("-")}addRow(e="1"){const t=pt(this.state.config),i=e.split("-").length,n=Array.from({length:i},()=>({id:dt("col"),modules:[]}));t.rows.push({id:dt("row"),layout:e,columns:n}),this.updateConfig(t)}deleteRow(e){const t=pt(this.state.config);t.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(t)}moveRow(e,t){if(e===t)return;const i=pt(this.state.config),[n]=i.rows.splice(e,1);i.rows.splice(t,0,n),this.updateConfig(i)}updateRow(e,t){const i=pt(this.state.config);i.rows[e]={...i.rows[e],...t},this.updateConfig(i)}addColumn(e){const t=pt(this.state.config),i=t.rows[e];i.columns.push({id:dt("col"),modules:[]}),i.layout=this._equalLayout(i.columns.length),this.updateConfig(t)}deleteColumn(e,t){const i=pt(this.state.config),n=i.rows[e];n.columns.splice(t,1),0===n.columns.length?i.rows.splice(e,1):n.layout=this._equalLayout(n.columns.length),this.state.selectedPath=null,this.updateConfig(i)}updateColumn(e,t,i){const n=pt(this.state.config);n.rows[e].columns[t]={...n.rows[e].columns[t],...i},this.updateConfig(n)}addModule(e,t,i){const n=pt(this.state.config),r=Ye.createDefault(i);if(!r)return;n.rows[e].columns[t].modules.push(r);const o=n.rows[e].columns[t].modules.length-1;this.updateConfig(n),this.setSelectedPath({rowIndex:e,columnIndex:t,moduleIndex:o})}deleteModule(e,t,i){const n=pt(this.state.config);n.rows[e].columns[t].modules.splice(i,1),this.state.selectedPath=null,this.updateConfig(n)}updateModule(e,t,i,n){const r=pt(this.state.config),o=r.rows[e].columns[t].modules[i];r.rows[e].columns[t].modules[i]={...o,...n},this.updateConfig(r)}moveModule(e,t,i,n,r,o){const a=pt(this.state.config),[s]=a.rows[e].columns[t].modules.splice(i,1);a.rows[n].columns[r].modules.splice(o,0,s),this.updateConfig(a)}undo(){const e=this.undoRedo.undo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}redo(){const e=this.undoRedo.redo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}canUndo(){return this.undoRedo.canUndo()}canRedo(){return this.undoRedo.canRedo()}destroy(){this.dispatchConfigChanged.cancel(),this.listeners.clear(),this.undoRedo.clear()}}class Yt{constructor(){this.observer=null,this.currentBreakpoint="md",this.callbacks=[]}observe(e){this.observer=new ResizeObserver(e=>{for(const t of e){const e=t.contentRect.width,i=this.getBreakpoint(e);i!==this.currentBreakpoint&&(this.currentBreakpoint=i,this.callbacks.forEach(e=>e(i)))}}),this.observer.observe(e)}disconnect(){this.observer?.disconnect(),this.observer=null}onBreakpointChange(e){return this.callbacks.push(e),()=>{this.callbacks=this.callbacks.filter(t=>t!==e)}}getBreakpoint(e){return e>=c?"xl":e>=l?"lg":e>=s?"md":e>=a?"sm":"xs"}getCurrentBreakpoint(){return this.currentBreakpoint}}var Xt=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};const Kt="magic-card-saved-colors",Zt=["#ffffff","#f3f4f6","#d1d5db","#9ca3af","#6b7280","#374151","#1f2937","#000000","#ef4444","#f97316","#eab308","#22c55e","#14b8a6","#3b82f6","#8b5cf6","#ec4899","#fecaca","#fed7aa","#fef08a","#bbf7d0","#99f6e4","#bfdbfe","#ddd6fe","#fbcfe8","var(--primary-color)","var(--accent-color)","var(--primary-text-color)","var(--secondary-text-color)","var(--card-background-color)","var(--divider-color)","var(--success-color)","var(--error-color)"];let Jt=class extends xe{constructor(){super(...arguments),this.value="",this.label="",this._isOpen=!1,this._hsva={h:0,s:100,v:100,a:1},this._savedColors=[],this._hexInput="",this._modalCtrl=new kt(this),this._dragging=null,this._handleAreaPointerDown=e=>{this._dragging="area",e.target.setPointerCapture(e.pointerId),this._updateArea(e)},this._handleHuePointerDown=e=>{this._dragging="hue",e.target.setPointerCapture(e.pointerId),this._updateHue(e)},this._handleOpacityPointerDown=e=>{this._dragging="opacity",e.target.setPointerCapture(e.pointerId),this._updateOpacity(e)},this._handlePointerMove=e=>{this._dragging&&("area"===this._dragging?this._updateArea(e):"hue"===this._dragging?this._updateHue(e):"opacity"===this._dragging&&this._updateOpacity(e))},this._handlePointerUp=()=>{this._dragging=null}}connectedCallback(){super.connectedCallback(),this._loadSavedColors(),this._parseValue(this.value)}updated(e){e.has("value")&&!this._isOpen&&this._parseValue(this.value)}_loadSavedColors(){try{const e=localStorage.getItem(Kt);this._savedColors=e?JSON.parse(e):[]}catch{this._savedColors=[]}}_saveSavedColors(){try{localStorage.setItem(Kt,JSON.stringify(this._savedColors))}catch{}}_parseValue(e){if(!e)return this._hsva={h:0,s:0,v:100,a:1},void(this._hexInput="");if(e.startsWith("var("))return void(this._hexInput=e);const t=this._colorToHsva(e);t?(this._hsva=t,this._hexInput=this._hsvaToHex(t)):this._hexInput=e}_colorToHsva(e){const t=e.match(/^#([0-9a-f]{3,8})$/i);if(t){let e=t[1];3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),4===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]);const i=parseInt(e.slice(0,2),16)/255,n=parseInt(e.slice(2,4),16)/255,r=parseInt(e.slice(4,6),16)/255,o=8===e.length?parseInt(e.slice(6,8),16)/255:1;return this._rgbToHsva(i,n,r,o)}const i=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(i){const e=parseInt(i[1])/255,t=parseInt(i[2])/255,n=parseInt(i[3])/255,r=i[4]?parseFloat(i[4]):1;return this._rgbToHsva(e,t,n,r)}return null}_rgbToHsva(e,t,i,n){const r=Math.max(e,t,i),o=r-Math.min(e,t,i),a=100*r,s=0===r?0:o/r*100;let l=0;if(0!==o)switch(r){case e:l=60*((t-i)/o+(t<i?6:0));break;case t:l=60*((i-e)/o+2);break;case i:l=60*((e-t)/o+4)}return{h:l,s,v:a,a:n}}_hsvaToRgb(e){const t=e.h/60,i=e.s/100,n=e.v/100,r=n*i,o=r*(1-Math.abs(t%2-1)),a=n-r;let s=0,l=0,c=0;return t<1?(s=r,l=o):t<2?(s=o,l=r):t<3?(l=r,c=o):t<4?(l=o,c=r):t<5?(s=o,c=r):(s=r,c=o),{r:Math.round(255*(s+a)),g:Math.round(255*(l+a)),b:Math.round(255*(c+a)),a:e.a}}_hsvaToHex(e){const t=this._hsvaToRgb(e),i="#"+t.r.toString(16).padStart(2,"0")+t.g.toString(16).padStart(2,"0")+t.b.toString(16).padStart(2,"0");return e.a<1?i+Math.round(255*e.a).toString(16).padStart(2,"0"):i}_hsvaToRgbaString(e){const t=this._hsvaToRgb(e);return e.a<1?`rgba(${t.r}, ${t.g}, ${t.b}, ${e.a.toFixed(2)})`:`rgb(${t.r}, ${t.g}, ${t.b})`}_getCurrentColor(){return this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToHex(this._hsva)}_emitChange(){const e=this._getCurrentColor();this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_openModal(){this._parseValue(this.value),this._isOpen=!0}_closeModal(){this._modalCtrl.reset(),this._isOpen=!1}_handleSave(){this._emitChange(),this._closeModal()}_updateArea(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),n=Math.max(0,Math.min(1,(e.clientY-t.top)/t.height));this._hsva={...this._hsva,s:100*i,v:100*(1-n)},this._hexInput=this._hsvaToHex(this._hsva)}_updateHue(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._hsva={...this._hsva,h:360*i},this._hexInput=this._hsvaToHex(this._hsva)}_updateOpacity(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._hsva={...this._hsva,a:i},this._hexInput=this._hsvaToHex(this._hsva)}_handleHexInput(e){const t=e.target.value;this._hexInput=t;const i=this._colorToHsva(t);i&&(this._hsva=i)}_selectPreset(e){if(e.startsWith("var("))this._hexInput=e;else{const t=this._colorToHsva(e);t&&(this._hsva=t,this._hexInput=this._hsvaToHex(t))}}_addSavedColor(){const e=this._getCurrentColor();this._savedColors.includes(e)||(this._savedColors=[e,...this._savedColors].slice(0,12),this._saveSavedColors())}_removeSavedColor(e,t){t.stopPropagation(),this._savedColors=this._savedColors.filter(t=>t!==e),this._saveSavedColors()}_handleTextInput(e){const t=e.target.value;this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){const e=this.value||"transparent";return te`
      <div class="mc-color-field">
        <div
          class="mc-color-preview"
          @click=${this._openModal}
          title="Click to open color picker"
        >
          <div class="mc-color-preview-inner" style="background: ${e}"></div>
        </div>
        <input
          class="mc-color-text"
          type="text"
          .value=${this.value||""}
          placeholder=${this.label||"Color value"}
          @input=${this._handleTextInput}
        />
        <button class="mc-color-btn" @click=${this._openModal} title="Open color picker">
          <ha-icon icon="mdi:palette" style="--mdc-icon-size: 18px"></ha-icon>
        </button>
      </div>
      ${this._isOpen?this._renderModal():ne}
    `}_renderModal(){const e=this._hsvaToRgb(this._hsva),t=`hsl(${this._hsva.h}, 100%, 50%)`,i=this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToRgbaString(this._hsva);return te`
      <div class="mc-modal-overlay" @click=${()=>{this._modalCtrl.consumeDragFlag()||this._closeModal()}}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-modal-header"
               @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
            <span class="mc-modal-title">Color Picker</span>
            <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
          </div>

          <div class="mc-modal-body">
            <!-- Color Area -->
            <div
              class="mc-color-area"
              style="background: ${t}"
              @pointerdown=${this._handleAreaPointerDown}
              @pointermove=${this._handlePointerMove}
              @pointerup=${this._handlePointerUp}
            >
              <div class="mc-color-area-gradient"></div>
              <div
                class="mc-color-area-pointer"
                style="left: ${this._hsva.s}%; top: ${100-this._hsva.v}%; background: ${i}"
              ></div>
            </div>

            <!-- Hue Slider -->
            <div class="mc-slider-row">
              <span class="mc-slider-label">H</span>
              <div
                class="mc-slider-track mc-hue-track"
                @pointerdown=${this._handleHuePointerDown}
                @pointermove=${this._handlePointerMove}
                @pointerup=${this._handlePointerUp}
              >
                <div
                  class="mc-slider-thumb"
                  style="left: ${this._hsva.h/360*100}%; background: ${t}"
                ></div>
              </div>
              <input
                class="mc-slider-value"
                type="text"
                .value=${Math.round(this._hsva.h).toString()}
                @input=${e=>{const t=parseInt(e.target.value)||0;this._hsva={...this._hsva,h:Math.max(0,Math.min(360,t))},this._hexInput=this._hsvaToHex(this._hsva)}}
              />
            </div>

            <!-- Opacity Slider -->
            <div class="mc-slider-row">
              <span class="mc-slider-label">A</span>
              <div
                class="mc-slider-track mc-opacity-track"
                @pointerdown=${this._handleOpacityPointerDown}
                @pointermove=${this._handlePointerMove}
                @pointerup=${this._handlePointerUp}
              >
                <div
                  class="mc-opacity-gradient"
                  style="background: linear-gradient(to right, transparent, ${this._hsvaToHex({...this._hsva,a:1})})"
                ></div>
                <div
                  class="mc-slider-thumb"
                  style="left: ${100*this._hsva.a}%"
                ></div>
              </div>
              <input
                class="mc-slider-value"
                type="text"
                .value=${Math.round(100*this._hsva.a).toString()}
                @input=${e=>{const t=parseInt(e.target.value)||0;this._hsva={...this._hsva,a:Math.max(0,Math.min(100,t))/100},this._hexInput=this._hsvaToHex(this._hsva)}}
              />
            </div>

            <!-- Input Row -->
            <div class="mc-input-row">
              <div class="mc-input-group" style="flex: 2">
                <span class="mc-input-label">Hex</span>
                <input
                  class="mc-input-field"
                  type="text"
                  .value=${this._hexInput}
                  @input=${this._handleHexInput}
                />
              </div>
              <div class="mc-input-group">
                <span class="mc-input-label">R</span>
                <input class="mc-input-field" type="text" .value=${e.r.toString()} readonly />
              </div>
              <div class="mc-input-group">
                <span class="mc-input-label">G</span>
                <input class="mc-input-field" type="text" .value=${e.g.toString()} readonly />
              </div>
              <div class="mc-input-group">
                <span class="mc-input-label">B</span>
                <input class="mc-input-field" type="text" .value=${e.b.toString()} readonly />
              </div>
            </div>

            <!-- Presets -->
            <div class="mc-color-section">
              <span class="mc-color-section-header">Presets</span>
              <div class="mc-color-grid">
                ${Zt.map(e=>te`
                  <div
                    class="mc-color-swatch ${e.startsWith("var(")?"var-color":""}"
                    style="background: ${e}"
                    @click=${()=>this._selectPreset(e)}
                    title=${e}
                  >${e.startsWith("var(")?"var":""}</div>
                `)}
              </div>
            </div>

            <!-- Saved Colors -->
            <div class="mc-color-section">
              <span class="mc-color-section-header">Saved Colors</span>
              <div class="mc-saved-colors">
                ${this._savedColors.map(e=>te`
                  <div
                    class="mc-saved-swatch"
                    style="background: ${e}"
                    @click=${()=>this._selectPreset(e)}
                    title=${e}
                  >
                    <button class="mc-remove-btn" @click=${t=>this._removeSavedColor(e,t)}>&times;</button>
                  </div>
                `)}
                <button class="mc-add-saved-btn" @click=${this._addSavedColor} title="Save current color">+</button>
              </div>
            </div>
          </div>
          <div class="mc-modal-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${e=>this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `}};Jt.styles=[Pe,Qe],Xt([Se({type:String})],Jt.prototype,"value",void 0),Xt([Se({type:String})],Jt.prototype,"label",void 0),Xt([Ce()],Jt.prototype,"_isOpen",void 0),Xt([Ce()],Jt.prototype,"_hsva",void 0),Xt([Ce()],Jt.prototype,"_savedColors",void 0),Xt([Ce()],Jt.prototype,"_hexInput",void 0),Jt=Xt([we("mc-color-picker")],Jt);var ei=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let ti=class extends xe{constructor(){super(...arguments),this.value="",this.mediaType="",this._modalCtrl=new kt(this),this._showModal=!1,this._searchQuery="",this._items=[],this._loading=!1,this._error="",this._breadcrumbs=[],this._selectedItem=null}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_openModal(){this._showModal=!0,this._searchQuery="",this._selectedItem=null,this._breadcrumbs=[{title:"Media",media_content_id:""}],this._browseMedia("")}_closeModal(){this._modalCtrl.reset(),this._showModal=!1,this._items=[],this._error=""}async _browseMedia(e){if(this.hass){this._loading=!0,this._error="",this._selectedItem=null;try{const t={type:"media_source/browse_media"};e&&(t.media_content_id=e);const i=await this.hass.callWS(t);this._items=i.children||[]}catch{this._error="No media sources available",this._items=[]}this._loading=!1}}_navigateToFolder(e){this._breadcrumbs=[...this._breadcrumbs,{title:e.title,media_content_id:e.media_content_id}],this._searchQuery="",this._browseMedia(e.media_content_id)}_navigateToBreadcrumb(e){const t=this._breadcrumbs[e];this._breadcrumbs=this._breadcrumbs.slice(0,e+1),this._searchQuery="",this._browseMedia(t.media_content_id)}_selectItem(e){this._selectedItem=e}async _handleSave(){if(this._selectedItem&&this.hass){try{const e=`url('${(await this.hass.callWS({type:"media_source/resolve_media",media_content_id:this._selectedItem.media_content_id})).url}')`;this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}catch{const e=`url('${this._selectedItem.media_content_id}')`;this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}this._closeModal()}else this._closeModal()}_getFilteredItems(){let e=this._items;if(this.mediaType&&(e=e.filter(e=>!!e.can_expand||this._matchesMediaType(e.media_class))),this._searchQuery){const t=this._searchQuery.toLowerCase();e=e.filter(e=>e.title.toLowerCase().includes(t))}return e}_matchesMediaType(e){const t=e.toLowerCase();return"image"===this.mediaType?"image"===t||"photo"===t||"picture"===t:"video"!==this.mediaType||("video"===t||"movie"===t||"clip"===t)}_getItemIcon(e){if(e.can_expand)return"mdi:folder";const t=e.media_class.toLowerCase();return"image"===t||"photo"===t||"picture"===t?"mdi:image":"video"===t||"movie"===t||"clip"===t?"mdi:video":"music"===t||"audio"===t||"song"===t?"mdi:music":"mdi:file"}render(){return te`
      <div class="mc-picker-row">
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="URL or media path"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:folder-search"></ha-icon>
          Browse
        </button>
      </div>
      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getFilteredItems();return te`
      <div class="mc-picker-overlay" @click=${()=>{this._modalCtrl.consumeDragFlag()||this._closeModal()}}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:folder-search"></ha-icon>
              <span class="mc-picker-title">Select Media</span>
            </div>
            <div class="mc-picker-header-end">
              <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
                <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
              </button>
              <button class="mc-picker-close" @click=${this._closeModal} aria-label="Close">&times;</button>
            </div>
          </div>

          ${this._renderBreadcrumbs()}

          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Filter items..."
              .value=${this._searchQuery}
              @input=${e=>{this._searchQuery=e.target.value}}
            />
          </div>

          <div class="mc-picker-list">
            ${this._loading?te`<div class="mc-picker-loading">Loading...</div>`:this._error?te`<div class="mc-picker-empty">${this._error}</div>`:e.length>0?e.map(e=>this._renderItem(e)):te`<div class="mc-picker-empty">No items found</div>`}
          </div>
          <div class="mc-picker-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave} ?disabled=${!this._selectedItem}>Save</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${e=>this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `}_renderBreadcrumbs(){return this._breadcrumbs.length<=1?te``:te`
      <div class="mc-picker-breadcrumbs">
        ${this._breadcrumbs.map((e,t)=>t===this._breadcrumbs.length-1?te`<span class="mc-breadcrumb-current">${e.title}</span>`:te`
            <button class="mc-breadcrumb" @click=${()=>this._navigateToBreadcrumb(t)}>${e.title}</button>
            <span class="mc-breadcrumb-sep">&rsaquo;</span>
          `)}
      </div>
    `}_renderItem(e){const t=this._selectedItem?.media_content_id===e.media_content_id,i=this._getItemIcon(e);return te`
      <div class="mc-picker-item ${t?"selected":""}" @click=${()=>{e.can_expand?this._navigateToFolder(e):e.can_play&&this._selectItem(e)}}>
        ${e.thumbnail?te`<img class="mc-picker-item-thumb" src=${e.thumbnail} alt="" />`:te`<div class="mc-picker-item-icon"><ha-icon icon=${i}></ha-icon></div>`}
        <div class="mc-picker-item-content">
          <div class="mc-picker-item-name">${e.title}</div>
        </div>
        ${e.can_expand?te`<ha-icon icon="mdi:chevron-right" style="color:var(--secondary-text-color);--mdc-icon-size:20px"></ha-icon>`:te`<span class="mc-picker-item-badge">${e.media_class}</span>`}
      </div>
    `}};ti.styles=[Ee,Be],ei([Se({attribute:!1})],ti.prototype,"hass",void 0),ei([Se({type:String})],ti.prototype,"value",void 0),ei([Se({type:String})],ti.prototype,"mediaType",void 0),ei([Ce()],ti.prototype,"_showModal",void 0),ei([Ce()],ti.prototype,"_searchQuery",void 0),ei([Ce()],ti.prototype,"_items",void 0),ei([Ce()],ti.prototype,"_loading",void 0),ei([Ce()],ti.prototype,"_error",void 0),ei([Ce()],ti.prototype,"_breadcrumbs",void 0),ei([Ce()],ti.prototype,"_selectedItem",void 0),ti=ei([we("mc-media-picker")],ti);var ii=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};const ni=[{name:"Arial",family:"Arial, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Helvetica",family:"Helvetica, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Times New Roman",family:'"Times New Roman", serif',category:"Serif",isLocal:!0},{name:"Georgia",family:"Georgia, serif",category:"Serif",isLocal:!0},{name:"Courier New",family:'"Courier New", monospace',category:"Monospace",isLocal:!0},{name:"Verdana",family:"Verdana, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Tahoma",family:"Tahoma, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Trebuchet MS",family:'"Trebuchet MS", sans-serif',category:"Sans-serif",isLocal:!0},{name:"Comic Sans MS",family:'"Comic Sans MS", cursive',category:"Cursive",isLocal:!0},{name:"Impact",family:"Impact, sans-serif",category:"Sans-serif",isLocal:!0}],ri=[{name:"Roboto",family:"Roboto, sans-serif",category:"Sans-serif"},{name:"Open Sans",family:'"Open Sans", sans-serif',category:"Sans-serif"},{name:"Lato",family:"Lato, sans-serif",category:"Sans-serif"},{name:"Montserrat",family:"Montserrat, sans-serif",category:"Sans-serif"},{name:"Oswald",family:"Oswald, sans-serif",category:"Sans-serif"},{name:"Source Sans Pro",family:'"Source Sans Pro", sans-serif',category:"Sans-serif"},{name:"Raleway",family:"Raleway, sans-serif",category:"Sans-serif"},{name:"PT Sans",family:'"PT Sans", sans-serif',category:"Sans-serif"},{name:"Merriweather",family:"Merriweather, serif",category:"Serif"},{name:"Playfair Display",family:'"Playfair Display", serif',category:"Serif"},{name:"Lora",family:"Lora, serif",category:"Serif"},{name:"PT Serif",family:'"PT Serif", serif',category:"Serif"},{name:"Noto Sans",family:'"Noto Sans", sans-serif',category:"Sans-serif"},{name:"Ubuntu",family:"Ubuntu, sans-serif",category:"Sans-serif"},{name:"Poppins",family:"Poppins, sans-serif",category:"Sans-serif"},{name:"Nunito",family:"Nunito, sans-serif",category:"Sans-serif"},{name:"Inconsolata",family:"Inconsolata, monospace",category:"Monospace"},{name:"Fira Code",family:'"Fira Code", monospace',category:"Monospace"},{name:"Source Code Pro",family:'"Source Code Pro", monospace',category:"Monospace"},{name:"Dancing Script",family:'"Dancing Script", cursive',category:"Cursive"}];let oi=class extends xe{constructor(){super(...arguments),this.value="",this._modalCtrl=new kt(this),this._showModal=!1,this._searchQuery="",this._selectedFont=null,this._activeTab="local"}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_openModal(){this._showModal=!0,this._searchQuery="",this._selectedFont=null}_closeModal(){this._modalCtrl.reset(),this._showModal=!1}_selectFont(e){this._selectedFont=e}_handleSave(){if(!this._selectedFont)return void this._closeModal();const e=this._selectedFont.family;this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_getFilteredFonts(){const e="local"===this._activeTab?ni:ri;if(!this._searchQuery)return e;const t=this._searchQuery.toLowerCase();return e.filter(e=>e.name.toLowerCase().includes(t)||e.category.toLowerCase().includes(t))}_getFontIcon(e){switch(e.toLowerCase()){case"serif":default:return"mdi:format-font";case"sans-serif":return"mdi:format-text";case"monospace":return"mdi:code-tags";case"cursive":return"mdi:script-text"}}render(){return te`
      <div class="mc-picker-row">
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="Font family"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:format-font"></ha-icon>
          Browse
        </button>
      </div>
      ${this._showModal?this._renderModal():ne}
    `}_renderModal(){const e=this._getFilteredFonts();return te`
      <div class="mc-picker-overlay" @click=${()=>{this._modalCtrl.consumeDragFlag()||this._closeModal()}}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:format-font"></ha-icon>
              <span class="mc-picker-title">Select Font</span>
            </div>
            <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
          </div>

          <div class="mc-modal-tabs">
            <button
              class="mc-modal-tab ${"local"===this._activeTab?"active":""}"
              @click=${()=>{this._activeTab="local",this._searchQuery=""}}
            >
              <ha-icon icon="mdi:desktop-classic"></ha-icon>
              Local Fonts
            </button>
            <button
              class="mc-modal-tab ${"google"===this._activeTab?"active":""}"
              @click=${()=>{this._activeTab="google",this._searchQuery=""}}
            >
              <ha-icon icon="mdi:google"></ha-icon>
              Google Fonts
            </button>
          </div>

          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search fonts..."
              .value=${this._searchQuery}
              @input=${e=>{this._searchQuery=e.target.value}}
            />
          </div>

          ${this._selectedFont?this._renderPreview():ne}

          <div class="mc-picker-list">
            ${e.length>0?e.map(e=>this._renderFontItem(e)):te`<div class="mc-picker-empty">No fonts found</div>`}
          </div>
          <div class="mc-picker-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave} ?disabled=${!this._selectedFont}>Save</button>
          </div>

          <div class="mc-modal-resize-handle"
               @pointerdown=${e=>this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `}_renderPreview(){return this._selectedFont?te`
      <div class="mc-font-preview">
        <div class="mc-font-preview-text" style="font-family: ${this._selectedFont.family}">
          The quick brown fox jumps over the lazy dog
        </div>
      </div>
    `:te``}_renderFontItem(e){const t=this._selectedFont?.name===e.name;return te`
      <div class="mc-picker-item ${t?"selected":""}" @click=${()=>this._selectFont(e)}>
        <div class="mc-picker-item-icon">
          <ha-icon icon=${this._getFontIcon(e.category)}></ha-icon>
        </div>
        <div class="mc-picker-item-content">
          <div class="mc-picker-item-name" style="font-family: ${e.family}">
            ${e.name}
          </div>
          <div class="mc-picker-item-id">${e.category}</div>
        </div>
        ${e.isLocal?te`<span class="mc-picker-item-badge">Local</span>`:te`<span class="mc-picker-item-badge" style="background: #4285f4; color: white;">Google</span>`}
      </div>
    `}};oi.styles=[Ee,Ue],ii([Se({attribute:!1})],oi.prototype,"hass",void 0),ii([Se({type:String})],oi.prototype,"value",void 0),ii([Ce()],oi.prototype,"_showModal",void 0),ii([Ce()],oi.prototype,"_searchQuery",void 0),ii([Ce()],oi.prototype,"_selectedFont",void 0),ii([Ce()],oi.prototype,"_activeTab",void 0),oi=ii([we("mc-font-picker")],oi);var ai=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let si=class extends xe{constructor(){super(...arguments),this.value="",this.label="Entity",this.domain="",this._modalCtrl=new kt(this),this._showModal=!1,this._searchQuery="",this._selectedEntityId=""}_openModal(){this._selectedEntityId=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._modalCtrl.reset(),this._showModal=!1}_handleSave(){this.value=this._selectedEntityId,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedEntityId},bubbles:!0,composed:!0})),this._closeModal()}_selectEntity(e){this._selectedEntityId=e,this._searchQuery=e}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getFilteredEntities(){if(!this.hass)return[];const e=Object.entries(this.hass.states).filter(([e])=>!(this.domain&&!e.startsWith(this.domain+"."))).map(([e,t])=>({id:e,name:t.attributes.friendly_name||e,state:this.hass.formatEntityState(t),icon:t.attributes.icon||this._domainIcon(e.split(".")[0])})).filter(e=>{if(!this._searchQuery)return!0;const t=this._searchQuery.toLowerCase();return e.id.toLowerCase().includes(t)||e.name.toLowerCase().includes(t)}).sort((e,t)=>e.name.localeCompare(t.name));return e.slice(0,100)}_getEntityInfo(){if(!this.hass||!this.value)return null;const e=this.hass.states[this.value];if(!e)return null;return{name:e.attributes.friendly_name||this.value,icon:e.attributes.icon||this._domainIcon(this.value.split(".")[0])}}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",sensor:"mdi:eye",binary_sensor:"mdi:checkbox-marked-circle",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",person:"mdi:account",weather:"mdi:weather-partly-cloudy",sun:"mdi:white-balance-sunny",vacuum:"mdi:robot-vacuum",water_heater:"mdi:water-boiler",humidifier:"mdi:air-humidifier",alarm_control_panel:"mdi:shield-home"}[e]||"mdi:help-circle"}render(){const e=this._getEntityInfo();return te`
      <div class="mc-picker-row">
        ${e?te`
            <div class="mc-picker-entity-info" @click=${this._openModal} title=${this.value}>
              <div class="mc-picker-entity-icon">
                <ha-icon icon=${e.icon}></ha-icon>
              </div>
              <div class="mc-picker-entity-details">
                <div class="mc-picker-entity-name">${e.name}</div>
                <div class="mc-picker-entity-id">${this.value}</div>
              </div>
            </div>
          `:te`
            <input
              type="text"
              class="mc-picker-input"
              .value=${this.value}
              placeholder="entity_id"
              @input=${this._onInputChange}
            />
          `}
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:form-select"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getFilteredEntities();return te`
      <div class="mc-picker-overlay" @click=${()=>{this._modalCtrl.consumeDragFlag()||this._closeModal()}}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
                <ha-icon icon="mdi:form-select"></ha-icon>
                <span class="mc-picker-title">Select Entity</span>
            </div>
            <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
          </div>
          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search entities..."
              .value=${this._searchQuery}
              @input=${e=>{this._searchQuery=e.target.value}}
            />
          </div>
          <div class="mc-picker-list">
            ${e.length>0?e.map(e=>te`
                  <div class="mc-picker-item ${this._selectedEntityId===e.id?"selected":""}"
                       @click=${()=>this._selectEntity(e.id)}>
                    <div class="mc-picker-item-icon">
                      <ha-icon icon=${e.icon}></ha-icon>
                    </div>
                    <div class="mc-picker-item-content">
                      <div class="mc-picker-item-name">${e.name}</div>
                      <div class="mc-picker-item-id">${e.id}</div>
                    </div>
                    <span class="mc-picker-item-state">${e.state}</span>
                  </div>
                `):te`<div class="mc-picker-empty">No entities found</div>`}
          </div>
          <div class="mc-picker-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${e=>this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `}};si.styles=[Ee],ai([Se({attribute:!1})],si.prototype,"hass",void 0),ai([Se({type:String})],si.prototype,"value",void 0),ai([Se({type:String})],si.prototype,"label",void 0),ai([Se({type:String})],si.prototype,"domain",void 0),ai([Ce()],si.prototype,"_showModal",void 0),ai([Ce()],si.prototype,"_searchQuery",void 0),ai([Ce()],si.prototype,"_selectedEntityId",void 0),si=ai([we("mc-entity-picker")],si);var li=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let ci=class extends xe{render(){if(!this.condition)return te``;const e=this.condition;return te`
      <div class="mc-cond">
        <div class="mc-cond-header">
          <span class="mc-cond-type">${e.type}</span>
          <select @change=${e=>this.onChange?.({type:e.target.value})}>
            <option value="state" ?selected=${"state"===e.type}>State</option>
            <option value="attribute" ?selected=${"attribute"===e.type}>Attribute</option>
            <option value="time" ?selected=${"time"===e.type}>Time</option>
            <option value="template" ?selected=${"template"===e.type}>Template</option>
          </select>
          <button class="mc-cond-remove" @click=${()=>this.onRemove?.()}>&times;</button>
        </div>
        <div class="mc-cond-fields">
          ${this._renderFields(e)}
        </div>
      </div>
    `}_renderFields(e){switch(e.type){case"state":case"attribute":{const t=!1!==e.use_module_entity,i=t?this.moduleEntity||e.entity||"":e.entity||"";return te`
          ${this.moduleEntity?te`
                <div class="mc-cond-entity-toggle">
                  <label>
                    <input
                      type="checkbox"
                      .checked=${t}
                      @change=${e=>this.onChange?.({use_module_entity:e.target.checked})}
                    />
                    Use module entity
                  </label>
                </div>
              `:ne}
          ${t&&this.moduleEntity?ne:te`
                <div class="mc-cond-field full">
                  <label>Entity</label>
                  <mc-entity-picker
                    .hass=${this.hass}
                    .value=${e.entity||""}
                    @value-changed=${e=>this.onChange?.({entity:e.detail.value})}
                  ></mc-entity-picker>
                </div>
              `}
          ${"attribute"===e.type?te`
                <div class="mc-cond-field full">
                  <label>Attribute</label>
                  <mc-attribute-picker
                    .hass=${this.hass}
                    .value=${e.attribute||""}
                    .entityId=${i}
                    @value-changed=${e=>this.onChange?.({attribute:e.detail.value})}
                  ></mc-attribute-picker>
                </div>
              `:ne}
          <div class="mc-cond-field">
            <label>Equals</label>
            <input type="text" .value=${e.state||""}
              @input=${e=>this.onChange?.({state:e.target.value})} />
          </div>
          <div class="mc-cond-field">
            <label>Not equals</label>
            <input type="text" .value=${e.state_not||""}
              @input=${e=>this.onChange?.({state_not:e.target.value})} />
          </div>
        `}case"time":return te`
          <div class="mc-cond-field">
            <label>After</label>
            <input type="time" .value=${e.after||""}
              @input=${e=>this.onChange?.({after:e.target.value})} />
          </div>
          <div class="mc-cond-field">
            <label>Before</label>
            <input type="time" .value=${e.before||""}
              @input=${e=>this.onChange?.({before:e.target.value})} />
          </div>
        `;case"template":return te`
          <div class="mc-cond-field full">
            <label>Template</label>
            <textarea .value=${e.template||""} rows="3" placeholder="{{ states('sensor.example') == 'on' }}"
              @input=${e=>this.onChange?.({template:e.target.value})}
              class="mc-cond-template"
            ></textarea>
          </div>
        `;default:return te``}}};ci.styles=[ze,Ne],li([Se({attribute:!1})],ci.prototype,"condition",void 0),li([Se({attribute:!1})],ci.prototype,"hass",void 0),li([Se({attribute:!1})],ci.prototype,"moduleEntity",void 0),li([Se({attribute:!1})],ci.prototype,"onChange",void 0),li([Se({attribute:!1})],ci.prototype,"onRemove",void 0),ci=li([we("mc-condition-row")],ci);var di=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let pi=class extends xe{constructor(){super(...arguments),this.design={},this.hasTemplate=!1,this.notSynced=[],this.moduleEntity="",this._openSectors=new Set,this._searchQuery="",this._activeView="default"}_getActiveRule(){if("default"!==this._activeView)return this.design.conditional?.find(e=>e.id===this._activeView)}_getActiveDesign(){const e=this._getActiveRule();return e?e.design:this.design}_getValue(e){return this._getActiveDesign()[e]||""}_handlePropertyChange(e,t){const i=this._getActiveRule();if(i){const n={...i.design,[e]:t||void 0};return void this._updateRule(i.id,{design:n})}const n={[e]:t||void 0};this.hasTemplate&&(n._markNotSynced=e),this.onChange(n)}_handleSyncToggle(e,t){t?this.onChange({_markNotSynced:e}):this.onChange({_markSynced:e})}_toggleSector(e){const t=new Set(this._openSectors);t.has(e)?t.delete(e):t.add(e),this._openSectors=t}_countSetProperties(e){const t=this._getActiveDesign();return e.properties.filter(e=>{const i=t[e.key];return void 0!==i&&""!==i}).length}_filterProperties(e){if(!this._searchQuery)return e;const t=this._searchQuery.toLowerCase();return e.filter(e=>e.label.toLowerCase().includes(t)||e.cssProperty.toLowerCase().includes(t)||e.key.toLowerCase().includes(t))}_addRule(){const e=[...this.design.conditional||[]],t={id:dt("rule"),name:"New Rule",conditions:[],mode:"every",design:{}};e.push(t),this.onChange({conditional:e}),this._activeView=t.id}_removeRule(e){const t=(this.design.conditional||[]).filter(t=>t.id!==e);this.onChange({conditional:t.length?t:void 0}),this._activeView="default"}_updateRule(e,t){const i=(this.design.conditional||[]).map(i=>i.id===e?{...i,...t}:i);this.onChange({conditional:i})}_updateRuleName(e,t){this._updateRule(e,{name:t})}_updateRuleMode(e,t){this._updateRule(e,{mode:t})}_updateRuleConditions(e,t){this._updateRule(e,{conditions:t})}_addConditionToRule(e){const t=[...e.conditions,{id:dt("cond"),type:"state"}];this._updateRuleConditions(e.id,t)}_updateCondition(e,t,i){const n=e.conditions.map(e=>e.id===t?{...e,...i}:e);this._updateRuleConditions(e.id,n)}_removeCondition(e,t){const i=e.conditions.filter(e=>e.id!==t);this._updateRuleConditions(e.id,i)}_renderField(e,t,i=ne){return te`
      <div class="mc-field">
        <label class="mc-field-label">${e} ${i}</label>
        ${t}
      </div>
    `}_renderProperty(e){const t=this._getValue(e.key),i="default"!==this._activeView,n=`design.${e.key}`,r=this.hasTemplate&&!this.notSynced.includes(n),o=this.hasTemplate&&!i?te`
          <mc-sync-indicator
            .synced=${r}
            .hasTemplate=${this.hasTemplate}
            @sync-toggle=${()=>this._handleSyncToggle(e.key,r)}
          ></mc-sync-indicator>
        `:ne;switch(e.type){case"box":if(i){const t=this._getActiveRule(),i=t.design;return this._renderField(e.label,te`
              <mc-box-field
                .design=${i}
                .onChange=${e=>{const i={...t.design,...e};this._updateRule(t.id,{design:i})}}
                .baseName=${e.key}
              ></mc-box-field>
            `)}return this._renderField(e.label,te`
            <mc-box-field
              .design=${this.design}
              .onChange=${this.onChange}
              .baseName=${e.key}
            ></mc-box-field>
          `,o);case"unit":return this._renderField(e.label,te`
            <mc-unit-field
              .value=${t}
              @value-changed=${t=>this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-unit-field>
          `,o);case"color":return this._renderField(e.label,te`
            <mc-color-picker
              .value=${t}
              .label=${e.label}
              @value-changed=${t=>this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-color-picker>
          `,o);case"image":return this._renderField(e.label,te`
            <mc-media-picker
              .hass=${this.hass}
              .value=${t}
              .mediaType=${"image"}
              @value-changed=${t=>this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-media-picker>
          `,o);case"font":return this._renderField(e.label,te`
            <mc-font-picker
              .hass=${this.hass}
              .value=${t}
              @value-changed=${t=>this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-font-picker>
          `,o);case"select":return this._renderField(e.label,te`
            <select
              @change=${t=>this._handlePropertyChange(e.key,t.target.value)}
            >
              <option value="" ?selected=${!t}></option>
              ${(e.options||[]).map(e=>te`<option value=${e.value} ?selected=${t===e.value}>${e.label}</option>`)}
            </select>
          `,o);case"number":return this._renderField(e.label,te`
            <input
              type="number"
              .value=${t}
              @input=${t=>this._handlePropertyChange(e.key,t.target.value)}
            />
          `,o);default:return this._renderField(e.label,te`
            <input
              type="text"
              .value=${t}
              @input=${t=>this._handlePropertyChange(e.key,t.target.value)}
            />
          `,o)}}_renderSector(e){const t=this._filterProperties(e.properties);if(0===t.length)return ne;const i=this._openSectors.has(e.id),n=this._countSetProperties(e);return te`
      <div class="mc-design-sector ${i?"open":""}">
        <button
          class="mc-design-sector-header"
          @click=${()=>this._toggleSector(e.id)}
        >
          <ha-icon icon=${e.icon}></ha-icon>
          <span class="sector-name">${e.name}</span>
          ${n>0?te`<span class="mc-design-sector-badge">${n}</span>`:ne}
          <ha-icon class="mc-design-sector-chevron" icon="mdi:chevron-down"></ha-icon>
        </button>
        <div class="mc-design-sector-body">
          <div class="mc-design-sector-content">
            ${t.map(e=>this._renderProperty(e))}
          </div>
        </div>
      </div>
    `}_renderViewTabs(){const e=this.design.conditional||[];return te`
      <div class="mc-design-views">
        <button
          class="mc-design-view-tab ${"default"===this._activeView?"active":""}"
          @click=${()=>{this._activeView="default"}}
        >
          Default
        </button>
        ${e.map(e=>te`
            <button
              class="mc-design-view-tab ${this._activeView===e.id?"active":""}"
              @click=${()=>{this._activeView=e.id}}
            >
              ${e.name||"Rule"}
              <span
                class="tab-remove"
                @click=${t=>{t.stopPropagation(),this._removeRule(e.id)}}
              >&times;</span>
            </button>
          `)}
        <button class="mc-design-add-rule-btn" @click=${()=>this._addRule()}>
          + Add Rule
        </button>
      </div>
    `}_renderRuleHeader(e){return te`
      <div class="mc-design-rule-header">
        <div class="rule-name-row">
          <input
            type="text"
            .value=${e.name||""}
            placeholder="Rule name..."
            @input=${t=>this._updateRuleName(e.id,t.target.value)}
          />
        </div>
        <div class="rule-mode-row">
          <span>Match</span>
          <select
            @change=${t=>this._updateRuleMode(e.id,t.target.value)}
          >
            <option value="every" ?selected=${"any"!==e.mode}>All conditions (AND)</option>
            <option value="any" ?selected=${"any"===e.mode}>Any condition (OR)</option>
          </select>
        </div>
      </div>
    `}_renderRuleConditions(e){return te`
      <div class="mc-design-rule-conditions">
        <div class="conditions-header">
          <span>Conditions</span>
          <button class="add-condition-btn" @click=${()=>this._addConditionToRule(e)}>
            + Add
          </button>
        </div>
        ${e.conditions.map(t=>te`
            <mc-condition-row
              .condition=${t}
              .hass=${this.hass}
              .moduleEntity=${this.moduleEntity}
              .onChange=${i=>this._updateCondition(e,t.id,i)}
              .onRemove=${()=>this._removeCondition(e,t.id)}
            ></mc-condition-row>
          `)}
      </div>
    `}_handleCustomCssChange(e){const t=this._getActiveRule();if(t){const i={...t.design,css:e||void 0};return void this._updateRule(t.id,{design:i})}this.onChange({css:e||void 0})}_getCustomCssValue(){const e=this._getActiveRule();return e?e.design.css||"":this.design.css||""}render(){const e=tt.filter(e=>this._filterProperties(e.properties).length>0),t=this._getActiveRule();return"default"===this._activeView||t||(this._activeView="default"),te`
      <div class="mc-design-panel">
        ${this._renderViewTabs()}

        ${t?te`
              ${this._renderRuleHeader(t)}
              ${this._renderRuleConditions(t)}
            `:ne}

        <div class="mc-design-search">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            placeholder="Search CSS properties..."
            .value=${this._searchQuery}
            @input=${e=>{this._searchQuery=e.target.value}}
          />
        </div>

        ${0===e.length?te`<div class="mc-design-empty">No properties match "${this._searchQuery}"</div>`:e.map(e=>this._renderSector(e))}

        <div class="mc-design-custom-css">
          <label>Custom CSS</label>
          <textarea
            .value=${this._getCustomCssValue()}
            @input=${e=>this._handleCustomCssChange(e.target.value)}
            rows="4"
            placeholder="color: red; font-size: 20px;"
          ></textarea>
        </div>

        ${t?te`
              <button
                class="mc-design-remove-rule"
                @click=${()=>this._removeRule(t.id)}
              >
                Remove Rule
              </button>
            `:ne}
      </div>
    `}};pi.styles=[Ie],di([Se({attribute:!1})],pi.prototype,"design",void 0),di([Se({attribute:!1})],pi.prototype,"hass",void 0),di([Se({attribute:!1})],pi.prototype,"onChange",void 0),di([Se({type:Boolean})],pi.prototype,"hasTemplate",void 0),di([Se({attribute:!1})],pi.prototype,"notSynced",void 0),di([Se({type:String})],pi.prototype,"moduleEntity",void 0),di([Ce()],pi.prototype,"_openSectors",void 0),di([Ce()],pi.prototype,"_searchQuery",void 0),di([Ce()],pi.prototype,"_activeView",void 0),pi=di([we("mc-design-panel")],pi);var ui=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let mi=class extends xe{constructor(){super(...arguments),this._collapsedRows=new Set,this._collapsedCols=new Set,this._dragOver=null,this._rowSettings=null,this._dragState=null,this._ignoreModuleClickUntil=0}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}_onRowDragStart(e,t){this._dragState={type:"row",rowIndex:t},e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._dragState));const i=e.target.closest(".mc-row-item");i?.classList.add("dragging")}_onRowDragEnd(e){const t=e.target.closest(".mc-row-item");t?.classList.remove("dragging"),this._dragState=null,this._dragOver=null}_onRowDragOver(e,t){this._dragState&&"row"===this._dragState.type&&(e.preventDefault(),e.dataTransfer.dropEffect="move",this._dragOver={type:"row",index:t})}_onRowDragLeave(){this._dragOver=null}_onRowDrop(e,t){if(e.preventDefault(),!this._dragState||"row"!==this._dragState.type)return;const i=this._dragState.rowIndex;i!==t&&this.stateManager.moveRow(i,t),this._dragState=null,this._dragOver=null}_onModuleDragStart(e,t,i,n){this._dragState={type:"module",rowIndex:t,colIndex:i,moduleIndex:n},e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._dragState));const r=e.target.closest(".mc-module-item");r?.classList.add("dragging"),e.stopPropagation(),this._ignoreModuleClickUntil=Date.now()+250}_onModuleDragEnd(e){const t=e.target.closest(".mc-module-item");t?.classList.remove("dragging"),this._dragState=null,this._dragOver=null,this._ignoreModuleClickUntil=Date.now()+250}_onModuleDragOver(e,t,i,n){this._dragState&&"module"===this._dragState.type&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="move",this._dragOver={type:"slot",index:n,colIndex:i})}_onContainerDragOver(e,t,i){this._dragState&&"module"===this._dragState.type&&(e.preventDefault(),e.dataTransfer.dropEffect="move")}_dropModuleAtIndex(e,t,i,n){if(e.preventDefault(),e.stopPropagation(),!this._dragState||"module"!==this._dragState.type)return;const{rowIndex:r,colIndex:o,moduleIndex:a}=this._dragState;let s=n;r===t&&o===i&&a<s&&(s-=1),r===t&&o===i&&a===s||this.stateManager.moveModule(r,o,a,t,i,s),this._dragState=null,this._dragOver=null,this._ignoreModuleClickUntil=Date.now()+300}_onContainerDrop(e,t,i){const n=this._editorState?.config.rows[t]?.columns[i]?.modules||[];this._dropModuleAtIndex(e,t,i,n.length)}_onModuleClick(e,t,i){Date.now()<this._ignoreModuleClickUntil||this.stateManager.setSelectedPath({rowIndex:e,columnIndex:t,moduleIndex:i})}_moveRowBy(e,t){const i=this._editorState?.config.rows??[],n=Math.min(Math.max(e+t,0),i.length-1);n!==e&&this.stateManager.moveRow(e,n)}_moveModuleVertical(e,t,i,n){const r=this._editorState?.config.rows[e]?.columns[t]?.modules??[],o=Math.min(Math.max(i+n,0),r.length-1);o!==i&&this.stateManager.moveModule(e,t,i,e,t,o)}_moveModuleHorizontal(e,t,i,n){const r=this._editorState?.config.rows[e];if(!r)return;const o=t+n;if(o<0||o>=r.columns.length)return;const a=r.columns[o].modules,s=Math.min(i,a.length);this.stateManager.moveModule(e,t,i,e,o,s)}_onRowHeaderKeyDown(e,t){if(e.altKey&&"ArrowUp"===e.key)return e.preventDefault(),void this._moveRowBy(t,-1);e.altKey&&"ArrowDown"===e.key&&(e.preventDefault(),this._moveRowBy(t,1))}_onModuleKeyDown(e,t,i,n){return"Enter"===e.key||" "===e.key?(e.preventDefault(),void this.stateManager.setSelectedPath({rowIndex:t,columnIndex:i,moduleIndex:n})):e.altKey?"ArrowUp"===e.key?(e.preventDefault(),void this._moveModuleVertical(t,i,n,-1)):"ArrowDown"===e.key?(e.preventDefault(),void this._moveModuleVertical(t,i,n,1)):"ArrowLeft"===e.key?(e.preventDefault(),void this._moveModuleHorizontal(t,i,n,-1)):void("ArrowRight"===e.key&&(e.preventDefault(),this._moveModuleHorizontal(t,i,n,1))):void 0}_layoutFromWeights(e){return e.map(e=>Math.max(1,Math.round(e))).join("-")}_equalWeights(e){return Array.from({length:Math.max(e,1)},()=>1)}_getLayoutOptions(e){const t=[],i=new Set,n=(n,r)=>{if(r.length!==e)return;const o=this._layoutFromWeights(r);i.has(o)||(i.add(o),t.push({label:n,value:o}))};if(n("Balanced",this._equalWeights(e)),e>1&&(n("Left Focus",[2,...Array.from({length:e-1},()=>1)]),n("Right Focus",[...Array.from({length:e-1},()=>1),2])),e>=3){const t=Math.floor(e/2),i=this._equalWeights(e);i[t]=2,n("Center Focus",i)}if(e>=4){const t=this._equalWeights(e);t[0]=2,t[e-1]=2,n("Dual Focus",t)}return t}_layoutToWeights(e,t){return/^\d+(?:-\d+)*$/.test(e)?e.split("-").map(e=>Math.max(Number(e)||1,1)):this._equalWeights(t)}_renderLayoutBar(e){const t=e.columns.length,i=this._layoutToWeights(e.layout||this._layoutFromWeights(this._equalWeights(t)),t);return te`
      <span class="mc-layout-bar" aria-label="Layout: ${e.layout||"balanced"}">
        ${i.map(e=>te`<span class="mc-layout-bar-seg" style="flex:${e}"></span>`)}
      </span>
    `}_renderLayoutGrid(e,t){const i=t.columns.length,n=this._getLayoutOptions(i),r=t.layout||this._layoutFromWeights(this._equalWeights(i)),o=n.some(e=>e.value===r)?n:[{label:"Current",value:r},...n];return te`
      <div class="mc-field">
        <label>Column Layout</label>
        <div class="mc-layout-grid" role="radiogroup" aria-label="Row layout options">
          ${o.map(t=>{const n=t.value===r,o=this._layoutToWeights(t.value,i);return te`
              <button
                type="button"
                class="mc-layout-grid-option ${n?"active":""}"
                role="radio"
                aria-checked=${n?"true":"false"}
                @click=${()=>this.stateManager.updateRow(e,{layout:t.value})}
              >
                <span class="mc-layout-grid-preview" aria-hidden="true">
                  ${o.map(e=>te`<span style=${`flex:${e}`}></span>`)}
                </span>
                <span class="mc-layout-grid-label">${t.label}</span>
              </button>
            `})}
        </div>
      </div>
    `}render(){if(!this._editorState)return te``;const{config:e,selectedPath:t}=this._editorState,i=!e.rows||0===e.rows.length;return te`
      <div class="mc-form">
        ${this._renderCardSection(e)}
        ${i?this._renderEmptyState():te`
              <div class="mc-kbd-hint">
                Keyboard: <kbd>Alt</kbd> + <kbd>Arrow</kbd> to move rows/modules, <kbd>Enter</kbd> to edit.
              </div>
              <div class="mc-rows-container">
                ${e.rows.map((e,i)=>this._renderRow(e,i,t))}
              </div>
            `}
      </div>
      ${this._rowSettings?this._renderContainerSettingsModal():ne}
    `}_renderEmptyState(){return te`
      <div class="mc-empty-state">
        <div class="mc-empty-state-icon">
          <ha-icon icon="mdi:view-grid-plus-outline"></ha-icon>
        </div>
        <h3 class="mc-empty-state-title">Start building your card</h3>
        <p class="mc-empty-state-desc">
          Add a row to begin laying out columns and modules.
        </p>
        <button
          type="button"
          class="mc-btn mc-btn-primary mc-empty-state-cta"
          @click=${()=>this.dispatchEvent(new CustomEvent("request-add-row",{bubbles:!0,composed:!0}))}
        >
          <ha-icon icon="mdi:table-row-plus-after" style="--mdc-icon-size:18px"></ha-icon>
          Add First Row
        </button>
      </div>
    `}_renderCardSection(e){return te`
      <div class="mc-card-header">
        <ha-icon icon="mdi:card-outline" style="--mdc-icon-size:18px; color: var(--primary-color, #6366f1);"></ha-icon>
        <input
          class="mc-card-name-input"
          type="text"
          placeholder="Card name"
          .value=${e.name||""}
          @input=${t=>this.stateManager.updateConfig({...e,name:t.target.value})}
        />
        <button
          class="mc-btn-icon"
          @click=${()=>this.dispatchEvent(new CustomEvent("open-card-settings",{bubbles:!0,composed:!0}))}
          title="Card settings"
        >
          <ha-icon icon="mdi:cog" style="--mdc-icon-size:18px"></ha-icon>
        </button>
      </div>
    `}_renderRow(e,t,i){const n="row"===this._dragOver?.type&&this._dragOver?.index===t,r=this._collapsedRows.has(t);return te`
      <div
        class="mc-row-item ${n?"drag-over":""} ${r?"collapsed":""}"
        data-row="${t}"
        @dragover=${e=>this._onRowDragOver(e,t)}
        @dragleave=${()=>this._onRowDragLeave()}
        @drop=${e=>this._onRowDrop(e,t)}
      >
        <div
          class="mc-row-header ${this._rowSettings?.rowIndex===t?"selected":""}"
          tabindex="0"
          @keydown=${e=>this._onRowHeaderKeyDown(e,t)}
          aria-label=${`Row ${t+1}. Press Alt+ArrowUp or Alt+ArrowDown to reorder.`}
        >
          <span
            class="mc-drag-handle"
            title="Drag to reorder"
            draggable="true"
            @dragstart=${e=>this._onRowDragStart(e,t)}
            @dragend=${e=>this._onRowDragEnd(e)}
          >
            <ha-icon icon="mdi:drag" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span
            class="mc-row-header-toggle"
            @click=${()=>{this._rowSettings={rowIndex:t,colIndex:void 0,tab:"general"}}}
          >
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
            <span class="mc-label">Row ${t+1}</span>
            <span class="mc-row-layout-bar" title="Column layout">
              ${this._renderLayoutBar(e)}
            </span>
          </span>
          <button
            class="mc-btn-icon mc-btn-add-col"
            @click=${()=>this.stateManager.addColumn(t)}
            title="Add column"
          >
            <ha-icon icon="mdi:table-column-plus-after" style="--mdc-icon-size:16px"></ha-icon>
          </button>
          <button
            class="mc-btn-icon mc-btn-delete"
            @click=${()=>this.stateManager.deleteRow(t)}
            title="Delete row"
          >
            <ha-icon icon="mdi:delete-outline" style="--mdc-icon-size:16px"></ha-icon>
          </button>
          <button
            class="mc-btn-icon mc-btn-settings"
            @click=${()=>{this._rowSettings={rowIndex:t,colIndex:void 0,tab:"general"}}}
            title="Row settings"
          >
            <ha-icon icon="mdi:cog" style="--mdc-icon-size:16px"></ha-icon>
          </button>
          <span
            class="mc-row-collapse-btn"
            @click=${()=>this._toggleRow(t)}
            title="${r?"Expand":"Collapse"}"
          >
            <span class="mc-chevron ${r?"":"open"}">&#9654;</span>
          </span>
        </div>
        ${r?ne:te`
            <div class="mc-row-body">
              ${e.columns.map((e,n)=>this._renderColumn(e,t,n,i))}
            </div>
          `}
      </div>
    `}_renderColumn(e,t,i,n){const r=this._editorState?.config.rows[t],o=r&&r.columns.length>1,a=this._collapsedCols.has(`${t}:${i}`);return te`
      <div class="mc-col-item ${a?"collapsed":""}">
        <div class="mc-col-header">
          <span
            class="mc-col-header-toggle"
            @click=${()=>{this._rowSettings={rowIndex:t,colIndex:i,tab:"general"}}}
          >
            <ha-icon icon="mdi:view-column" style="--mdc-icon-size:14px"></ha-icon>
            <span class="mc-label">Col ${i+1}</span>
            ${e.modules.length>0?te`<span class="mc-col-badge">${e.modules.length}</span>`:ne}
          </span>
          <button
            class="mc-btn-icon mc-btn-small mc-btn-settings"
            @click=${()=>{this._rowSettings={rowIndex:t,colIndex:i,tab:"general"}}}
            title="Column settings"
          >
            <ha-icon icon="mdi:cog" style="--mdc-icon-size:12px"></ha-icon>
          </button>
          <span
            class="mc-col-collapse-btn"
            @click=${()=>this._toggleCol(t,i)}
            title="${a?"Expand":"Collapse"}"
          >
            <ha-icon icon="${a?"mdi:chevron-right":"mdi:chevron-down"}" style="--mdc-icon-size:12px"></ha-icon>
          </span>
          ${o?te`
            <button
              class="mc-btn-icon mc-btn-small mc-btn-delete"
              @click=${()=>this.stateManager.deleteColumn(t,i)}
              title="Delete column"
            >
              <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
            </button>
          `:ne}
        </div>
        <div
          class="mc-modules-container"
          data-row="${t}"
          data-col="${i}"
          @dragover=${e=>this._onContainerDragOver(e,t,i)}
          @drop=${e=>this._onContainerDrop(e,t,i)}
        >
          ${this._renderDropSlot(t,i,0,0===e.modules.length)}
          ${e.modules.map((e,r)=>{const o=n?.rowIndex===t&&n?.columnIndex===i&&n?.moduleIndex===r,a=Ye.get(e.type);return te`
              <div
                class="mc-module-item ${o?"selected":""}"
                tabindex="0"
                role="button"
                aria-label=${`${a?.metadata.name||e.type} module. Press Enter to edit. Press Alt plus Arrow keys to move.`}
                @keydown=${e=>this._onModuleKeyDown(e,t,i,r)}
                @click=${()=>this._onModuleClick(t,i,r)}
              >
                <span
                  class="mc-module-drag"
                  title="Drag to reorder"
                  draggable="true"
                  @dragstart=${e=>this._onModuleDragStart(e,t,i,r)}
                  @dragend=${e=>this._onModuleDragEnd(e)}
                >
                  <ha-icon icon="mdi:drag" style="--mdc-icon-size:14px"></ha-icon>
                </span>
                <span class="mc-module-item-icon">
                  <ha-icon
                    icon=${a?.metadata.icon||"mdi:puzzle"}
                    style="--mdc-icon-size:16px"
                  ></ha-icon>
                </span>
                <span class="mc-module-item-name">
                  ${a?.metadata.name||e.type}
                </span>
                <span class="mc-module-item-type">${e.type}</span>
                <button
                  class="mc-btn-icon mc-btn-small"
                  @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,i,r)}}
                  title="Delete module"
                >
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
                </button>
              </div>
              ${this._renderDropSlot(t,i,r+1)}
            `})}
        </div>
        <button
          class="mc-add-module-btn"
          @click=${()=>this.dispatchEvent(new CustomEvent("add-module",{bubbles:!0,composed:!0,detail:{rowIndex:t,colIndex:i}}))}
        >
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
          Add Module
        </button>
      </div>
    `}_renderContainerSettingsModal(){if(!this._rowSettings)return te``;const{rowIndex:e,colIndex:t}=this._rowSettings,i=this._editorState?.config.rows[e];if(!i)return te``;const n=void 0!==t,r=n?i.columns[t]:null,o=(n?this._collapsedCols.has(`${e}:${t}`):this._collapsedRows.has(e),[{id:"general",label:"General",icon:"mdi:cog"},{id:"design",label:"Design",icon:"mdi:palette"},{id:"conditions",label:"Conditions",icon:"mdi:filter-outline"},...n?[]:[{id:"actions",label:"Actions",icon:"mdi:gesture-tap"}]]);return te`
      <div class="mc-modal-overlay" @click=${()=>{this._rowSettings=null}}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-modal-header">
            <ha-icon icon=${n?"mdi:view-column":"mdi:view-sequential"}></ha-icon>
            <span class="mc-modal-title">${n?`Column ${t+1} Settings`:`Row ${e+1} Settings`}</span>
            <button class="mc-modal-close" @click=${()=>{this._rowSettings=null}}>&times;</button>
          </div>
          <div class="mc-modal-tabs">
            ${o.map(e=>te`
              <button
                class="mc-modal-tab ${this._rowSettings.tab===e.id?"active":""}"
                @click=${()=>{this._rowSettings={...this._rowSettings,tab:e.id}}}
              >
                <ha-icon icon=${e.icon} style="--mdc-icon-size:16px"></ha-icon>
                ${e.label}
              </button>
            `)}
          </div>
          <div class="mc-modal-body">
            ${"general"===this._rowSettings.tab?this._renderContainerGeneralTab(i,r,e,t):ne}
            ${"design"===this._rowSettings.tab?this._renderContainerDesignTab(i,r,e,t):ne}
            ${"conditions"===this._rowSettings.tab?this._renderContainerConditionsTab(i,r,e,t):ne}
            ${n||"actions"!==this._rowSettings.tab?ne:this._renderContainerActionsTab(i,r,e,t)}
          </div>
          <div class="mc-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${()=>{this._rowSettings=null}}>Done</button>
          </div>
        </div>
      </div>
    `}_renderContainerGeneralTab(e,t,i,n){return t?te`
        <div class="mc-tab-content">
          <div class="mc-field">
            <label>Vertical Align</label>
            <select
              .value=${t.vertical_align||"start"}
              @change=${e=>{const t=e.target.value;this.stateManager.updateColumn(i,n,{vertical_align:t})}}
            >
              <option value="start">Top</option>
              <option value="center">Center</option>
              <option value="end">Bottom</option>
              <option value="stretch">Stretch</option>
            </select>
          </div>
          ${Ht("Gap",t.gap,e=>this.stateManager.updateColumn(i,n,{gap:e}))}
          ${Gt("Padding",t.padding,e=>this.stateManager.updateColumn(i,n,{padding:e}),"padding")}
        </div>
      `:te`
      <div class="mc-tab-content">
        ${this._renderLayoutGrid(i,e)}
        ${Ht("Gap",e.gap,e=>this.stateManager.updateRow(i,{gap:e}))}
        ${Gt("Padding",e.padding,e=>this.stateManager.updateRow(i,{padding:e}),"padding")}
      </div>
    `}_renderContainerDesignTab(e,t,i,n){const r=t?t.design||{}:e.design||{};return te`
      <mc-design-panel
        .design=${r}
        .hass=${this.hass}
        .onChange=${r=>{t?this.stateManager.updateColumn(i,n,{design:{...t.design,...r}}):this.stateManager.updateRow(i,{design:{...e.design,...r}})}}
      ></mc-design-panel>
    `}_renderContainerConditionsTab(e,t,i,n){const r=t?t.display||{}:e.display||{},o=r.conditions||[],a=r.mode||"every";this._editorState;return te`
      <div class="mc-tab-content">
        <div class="mc-mode-help">When conditions are not met, this ${t?"column":"row"} is hidden.</div>
        ${o.length>1?te`
          <div class="mc-field">
            <label>Condition Mode</label>
            <select
              .value=${a}
              @change=${r=>{const o=r.target.value,a=t?{display:{...t.display,mode:o}}:{display:{...e.display,mode:o}};t?this.stateManager.updateColumn(i,n,a):this.stateManager.updateRow(i,a)}}
            >
              <option value="every">All conditions (AND)</option>
              <option value="any">Any condition (OR)</option>
            </select>
          </div>
        `:ne}
        <div class="mc-conditions-list">
          ${o.map((r,a)=>this._renderDisplayConditionRow(r,a,r=>{const s=[...o];s[a]={...s[a],...r};const l=t?{display:{...t.display,conditions:s}}:{display:{...e.display,conditions:s}};t?this.stateManager.updateColumn(i,n,l):this.stateManager.updateRow(i,l)},()=>{const r=o.filter((e,t)=>t!==a),s=t?{display:{...t.display,conditions:r.length?r:void 0}}:{display:{...e.display,conditions:r.length?r:void 0}};t?this.stateManager.updateColumn(i,n,s):this.stateManager.updateRow(i,s)}))}
        </div>
        <button class="mc-btn mc-btn-secondary" @click=${()=>{const r={id:`cond-${Date.now()}`,type:"state",entity:"",state:""},a=[...o,r],s=t?{display:{...t.display,conditions:a}}:{display:{...e.display,conditions:a}};t?this.stateManager.updateColumn(i,n,s):this.stateManager.updateRow(i,s)}}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
          Add Condition
        </button>
      </div>
    `}_renderDisplayConditionRow(e,t,i,n){return te`
      <div class="mc-condition-item">
        <div class="mc-field">
          <label>Type</label>
          <select .value=${e.type} @change=${e=>i({type:e.target.value})}>
            <option value="state">State</option>
            <option value="attribute">Attribute</option>
            <option value="time">Time</option>
            <option value="template">Template</option>
          </select>
        </div>
        ${"state"===e.type||"attribute"===e.type?te`
          <div class="mc-field">
            <label>Entity</label>
            <input type="text" .value=${e.entity||""} @input=${e=>i({entity:e.target.value})} placeholder="sensor.temp" />
          </div>
          ${"attribute"===e.type?te`
            <div class="mc-field">
              <label>Attribute</label>
              <input type="text" .value=${e.attribute||""} @input=${e=>i({attribute:e.target.value})} />
            </div>
          `:ne}
          <div class="mc-field">
            <label>State equals</label>
            <input type="text" .value=${e.state||""} @input=${e=>i({state:e.target.value})} />
          </div>
          <div class="mc-field">
            <label>State not equals</label>
            <input type="text" .value=${e.state_not||""} @input=${e=>i({state_not:e.target.value})} />
          </div>
        `:ne}
        ${"time"===e.type?te`
          <div class="mc-field">
            <label>After (HH:MM)</label>
            <input type="time" .value=${e.after||""} @input=${e=>i({after:e.target.value})} />
          </div>
          <div class="mc-field">
            <label>Before (HH:MM)</label>
            <input type="time" .value=${e.before||""} @input=${e=>i({before:e.target.value})} />
          </div>
        `:ne}
        ${"template"===e.type?te`
          <div class="mc-field">
            <label>Template</label>
            <textarea rows="3" .value=${e.template||""} @input=${e=>i({template:e.target.value})}></textarea>
          </div>
        `:ne}
        <button class="mc-btn-icon" @click=${n} title="Remove condition">
          <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
        </button>
      </div>
    `}_renderContainerActionsTab(e,t,i,n){const r=e.actions||{};return te`
      <div class="mc-tab-content">
        <div class="mc-mode-help">Define tap/hold/double-tap actions for this ${t?"column":"row"}.</div>
        <div class="mc-field">
          <label>Tap Action</label>
          <select .value=${r.tap_action?.action||"none"} @change=${t=>{const n=t.target.value,r={actions:{...e.actions,tap_action:"none"===n?void 0:{action:n}}};this.stateManager.updateRow(i,r)}}>
            <option value="none">None</option>
            <option value="toggle">Toggle</option>
            <option value="perform-action">Perform Action</option>
            <option value="navigate">Navigate</option>
            <option value="url">URL</option>
            <option value="more-info">More Info</option>
          </select>
        </div>
                <div class="mc-field">
          <label>Hold Action</label>
          <select .value=${r.hold_action?.action||"none"} @change=${t=>{const n=t.target.value,r={actions:{...e.actions,hold_action:"none"===n?void 0:{action:n}}};this.stateManager.updateRow(i,r)}}>
            <option value="none">None</option>
            <option value="toggle">Toggle</option>
            <option value="perform-action">Perform Action</option>
            <option value="navigate">Navigate</option>
            <option value="url">URL</option>
            <option value="more-info">More Info</option>
          </select>
        </div>
        <div class="mc-field">
          <label>Double Tap Action</label>
          <select .value=${r.double_tap_action?.action||"none"} @change=${t=>{const n=t.target.value,r={actions:{...e.actions,double_tap_action:"none"===n?void 0:{action:n}}};this.stateManager.updateRow(i,r)}}>
            <option value="none">None</option>
            <option value="toggle">Toggle</option>
            <option value="perform-action">Perform Action</option>
            <option value="navigate">Navigate</option>
            <option value="url">URL</option>
            <option value="more-info">More Info</option>
          </select>
        </div>
      </div>
    `}_renderDropSlot(e,t,i,n=!1){const r="slot"===this._dragOver?.type&&this._dragOver?.index===i&&this._dragOver?.colIndex===t;return te`
      <div
        class="mc-drop-slot ${r?"active":""} ${n?"empty":""}"
        @dragover=${n=>this._onModuleDragOver(n,e,t,i)}
        @drop=${n=>this._dropModuleAtIndex(n,e,t,i)}
      ></div>
    `}_toggleRow(e){this._collapsedRows.has(e)?this._collapsedRows.delete(e):this._collapsedRows.add(e),this.requestUpdate()}_toggleCol(e,t){const i=`${e}:${t}`;this._collapsedCols.has(i)?this._collapsedCols.delete(i):this._collapsedCols.add(i),this.requestUpdate()}};mi.styles=[Ae,Oe],ui([Se({attribute:!1})],mi.prototype,"stateManager",void 0),ui([Se({attribute:!1})],mi.prototype,"hass",void 0),ui([Ce()],mi.prototype,"_editorState",void 0),ui([Ce()],mi.prototype,"_collapsedRows",void 0),ui([Ce()],mi.prototype,"_collapsedCols",void 0),ui([Ce()],mi.prototype,"_dragOver",void 0),ui([Ce()],mi.prototype,"_rowSettings",void 0),mi=ui([we("mc-form-editor")],mi);var hi=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let gi=class extends xe{constructor(){super(...arguments),this._suppressUpdate=!1}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{if(this._editorState=e,!this._suppressUpdate){const{type:t,...i}=e.config;this._configObj=i}}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){return te`
      <div class="mc-yaml-container">
        <div class="mc-yaml-editor-wrapper">
          <ha-yaml-editor
            .hass=${this.hass}
            .defaultValue=${this._configObj}
            @value-changed=${this._onYamlChanged}
          ></ha-yaml-editor>
        </div>
      </div>
    `}_onYamlChanged(e){const t=e.detail.value;if(this._editorState){this._suppressUpdate=!0;try{if(t&&"object"==typeof t){const e={...t,type:this._editorState.config.type};this.stateManager.updateConfig(e)}}catch(e){}finally{this._suppressUpdate=!1}}}};gi.styles=[Ae,De],hi([Se({attribute:!1})],gi.prototype,"stateManager",void 0),hi([Se({attribute:!1})],gi.prototype,"hass",void 0),hi([Ce()],gi.prototype,"_configObj",void 0),hi([Ce()],gi.prototype,"_editorState",void 0),gi=hi([we("mc-yaml-editor")],gi);var vi=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let fi=class extends xe{constructor(){super(...arguments),this._expandedNodes=new Set(["root"])}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){if(!this._editorState)return te``;const{config:e,selectedPath:t}=this._editorState;return e.rows.length?te`
      <div class="mc-tree">
        <div class="mc-kbd-hint">
          Keyboard: <kbd>Alt</kbd> + <kbd>Arrow</kbd> to move rows/modules, <kbd>Enter</kbd> to toggle/select.
        </div>
        ${e.rows.map((e,i)=>this._renderRowNode(e,i,t))}
      </div>
    `:te`<div class="mc-tree-empty">No rows. Add a row to get started.</div>`}_renderRowNode(e,t,i){const n=`row-${t}`,r=this._expandedNodes.has(n);return te`
      <div class="mc-tree-node">
        <div
          class="mc-tree-row"
          tabindex="0"
          role="button"
          aria-label=${`Row ${t+1}. Press Enter to expand or collapse. Alt+ArrowUp or Alt+ArrowDown to reorder.`}
          @click=${()=>this._toggleNode(n)}
          @keydown=${e=>this._onRowKeyDown(e,n,t)}
        >
          <span class="mc-tree-toggle ${r?"open":""}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Row ${t+1}</span>
          <span class="mc-tree-type">${e.layout||"1"}</span>
          ${e.display?.conditions?.length?te`<span class="mc-tree-badge condition">C</span>`:ne}
          <span class="mc-tree-actions">
            <button class="mc-tree-action-btn" @click=${e=>{e.stopPropagation(),this.stateManager.deleteRow(t)}} title="Delete">&times;</button>
          </span>
        </div>
        ${r?te`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.columns.map((e,n)=>this._renderColumnNode(e,t,n,i))}
              </div>
            `:ne}
      </div>
    `}_renderColumnNode(e,t,i,n){const r=`col-${t}-${i}`,o=this._expandedNodes.has(r);return te`
      <div class="mc-tree-node">
        <div
          class="mc-tree-row"
          tabindex="0"
          role="button"
          aria-label=${`Column ${i+1}. Press Enter to expand or collapse.`}
          @click=${()=>this._toggleNode(r)}
          @keydown=${e=>this._onToggleKeyDown(e,r)}
        >
          <span class="mc-tree-toggle ${o?"open":""}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-column" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Column ${i+1}</span>
          <span class="mc-tree-type">${e.modules.length} modules</span>
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("add-module",{bubbles:!0,composed:!0,detail:{rowIndex:t,colIndex:i}}))}}
              title="Add module"
            >+</button>
          </span>
        </div>
        ${o?te`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.modules.map((e,r)=>this._renderModuleNode(e,t,i,r,n))}
                ${0===e.modules.length?te`<div style="padding:4px 8px;font-size:0.75rem;color:var(--secondary-text-color)">Empty</div>`:ne}
              </div>
            `:ne}
      </div>
    `}_renderModuleNode(e,t,i,n,r){const o=r?.rowIndex===t&&r?.columnIndex===i&&r?.moduleIndex===n,a=Ye.get(e.type),s=e.display?.conditions?.length,l=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return te`
      <div class="mc-tree-node">
        <div
          class="mc-tree-row ${o?"selected":""}"
          draggable="true"
          tabindex="0"
          role="button"
          aria-label=${`${a?.metadata.name||e.type} module. Press Enter to edit. Press Alt plus Arrow keys to move.`}
          @click=${()=>this.stateManager.setSelectedPath({rowIndex:t,columnIndex:i,moduleIndex:n})}
          @keydown=${e=>this._onModuleKeyDown(e,t,i,n)}
          @dragstart=${e=>this._onDragStart(e,t,i,n)}
          @dragover=${e=>this._onDragOver(e)}
          @drop=${e=>this._onDrop(e,t,i,n)}
        >
          <span class="mc-drag-handle">
            <ha-icon icon="mdi:drag-vertical" style="--mdc-icon-size:14px"></ha-icon>
          </span>
          <span class="mc-tree-icon">
            <ha-icon icon=${a?.metadata.icon||"mdi:puzzle"} style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">${a?.metadata.name||e.type}</span>
          <span class="mc-tree-type">${e.type}</span>
          ${s?te`<span class="mc-tree-badge condition">C</span>`:ne}
          ${l?te`<span class="mc-tree-badge action">A</span>`:ne}
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,i,n)}}
              title="Delete"
            >&times;</button>
          </span>
        </div>
      </div>
    `}_toggleNode(e){this._expandedNodes.has(e)?this._expandedNodes.delete(e):this._expandedNodes.add(e),this.requestUpdate()}_onToggleKeyDown(e,t){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._toggleNode(t))}_onRowKeyDown(e,t,i){return e.altKey&&"ArrowUp"===e.key?(e.preventDefault(),void this._moveRowBy(i,-1)):e.altKey&&"ArrowDown"===e.key?(e.preventDefault(),void this._moveRowBy(i,1)):void this._onToggleKeyDown(e,t)}_onModuleKeyDown(e,t,i,n){return"Enter"===e.key||" "===e.key?(e.preventDefault(),void this.stateManager.setSelectedPath({rowIndex:t,columnIndex:i,moduleIndex:n})):e.altKey?"ArrowUp"===e.key?(e.preventDefault(),void this._moveModuleVertical(t,i,n,-1)):"ArrowDown"===e.key?(e.preventDefault(),void this._moveModuleVertical(t,i,n,1)):"ArrowLeft"===e.key?(e.preventDefault(),void this._moveModuleHorizontal(t,i,n,-1)):void("ArrowRight"===e.key&&(e.preventDefault(),this._moveModuleHorizontal(t,i,n,1))):void 0}_moveRowBy(e,t){const i=this._editorState?.config.rows??[],n=Math.min(Math.max(e+t,0),i.length-1);n!==e&&this.stateManager.moveRow(e,n)}_moveModuleVertical(e,t,i,n){const r=this._editorState?.config.rows[e]?.columns[t]?.modules??[],o=Math.min(Math.max(i+n,0),r.length-1);o!==i&&this.stateManager.moveModule(e,t,i,e,t,o)}_moveModuleHorizontal(e,t,i,n){const r=this._editorState?.config.rows[e];if(!r)return;const o=t+n;if(o<0||o>=r.columns.length)return;const a=r.columns[o].modules,s=Math.min(i,a.length);this.stateManager.moveModule(e,t,i,e,o,s)}_onDragStart(e,t,i,n){this._dragData={ri:t,ci:i,mi:n},e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify({ri:t,ci:i,mi:n})))}_onDragOver(e){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_onDrop(e,t,i,n){if(e.preventDefault(),!this._dragData)return;const{ri:r,ci:o,mi:a}=this._dragData;r===t&&o===i&&a===n||(this.stateManager.moveModule(r,o,a,t,i,n),this._dragData=void 0)}};fi.styles=[Ae,Le],vi([Se({attribute:!1})],fi.prototype,"stateManager",void 0),vi([Se({attribute:!1})],fi.prototype,"hass",void 0),vi([Ce()],fi.prototype,"_editorState",void 0),vi([Ce()],fi.prototype,"_expandedNodes",void 0),fi=vi([we("mc-tree-editor")],fi);var bi=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let yi=class extends xe{constructor(){super(...arguments),this._searchQuery=""}render(){const e=this._searchQuery?Ye.search(this._searchQuery):Ye.getAll(),t=new Map;for(const i of o){const n=e.filter(e=>e.metadata.category===i).map(e=>e.metadata);n.length>0&&t.set(i,n)}return te`
      <div class="mc-selector-overlay" @click=${this._onOverlayClick}>
        <div
          class="mc-selector-dialog"
          @click=${e=>e.stopPropagation()}
          @keydown=${this._onDialogKeyDown}
        >
          <div class="mc-selector-header">
            <h3>Add Module</h3>
            <button class="mc-btn-icon" @click=${this._onClose}>&times;</button>
          </div>
          <div class="mc-selector-search-wrap">
            <input
              class="mc-selector-search"
              type="text"
              placeholder="Search modules..."
              .value=${this._searchQuery}
              @input=${e=>{this._searchQuery=e.target.value}}
              autofocus
            />
          </div>
          <div class="mc-selector-body">
            ${0===t.size?te`
              <div class="mc-selector-empty">No modules match "${this._searchQuery}".</div>
            `:Array.from(t.entries()).map(([e,t])=>te`
                <div class="mc-selector-category">${e}</div>
                ${t.map(e=>te`
                    <button
                      type="button"
                      class="mc-selector-item"
                      @click=${()=>this._onSelect(e)}
                      aria-label=${`Add ${e.name} module`}
                    >
                      <div class="mc-selector-item-icon">
                        <ha-icon icon=${e.icon}></ha-icon>
                      </div>
                      <div class="mc-selector-item-info">
                        <div class="mc-selector-item-name">${e.name}</div>
                        <div class="mc-selector-item-desc">${e.description}</div>
                      </div>
                    </button>
                  `)}
              `)}
          </div>
        </div>
      </div>
    `}_onSelect(e){this.dispatchEvent(new CustomEvent("module-selected",{bubbles:!0,composed:!0,detail:{type:e.type}}))}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_onOverlayClick(){this._onClose()}_onDialogKeyDown(e){"Escape"===e.key&&(e.preventDefault(),this._onClose())}};yi.styles=[ze,Re],bi([Ce()],yi.prototype,"_searchQuery",void 0),yi=bi([we("mc-module-selector")],yi);var xi=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let _i=class extends xe{constructor(){super(...arguments),this.value="",this.label="Service",this._modalCtrl=new kt(this),this._showModal=!1,this._searchQuery=""}_openModal(){this._showModal=!0,this._searchQuery=""}_closeModal(){this._modalCtrl.reset(),this._showModal=!1}_selectService(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getServices(){if(!this.hass?.services)return[];const e=[];for(const[t,i]of Object.entries(this.hass.services))for(const[n,r]of Object.entries(i))e.push({domain:t,service:n,name:r.name||n,description:r.description||""});return e}_getFilteredServices(){const e=this._getServices(),t=this._searchQuery.toLowerCase(),i=t?e.filter(e=>e.domain.includes(t)||e.service.includes(t)||e.name.toLowerCase().includes(t)):e,n=new Map;for(const e of i)n.has(e.domain)||n.set(e.domain,[]),n.get(e.domain).push(e);const r=Array.from(n.entries()).sort(([e],[t])=>e.localeCompare(t)).slice(0,20).map(([e,t])=>({domain:e,services:t.sort((e,t)=>e.service.localeCompare(t.service))}));return r}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",notify:"mdi:bell",tts:"mdi:speaker-message",homeassistant:"mdi:home-assistant",persistent_notification:"mdi:bell-ring",logbook:"mdi:book-open",recorder:"mdi:database",system_log:"mdi:file-document",frontend:"mdi:view-dashboard",group:"mdi:group",vacuum:"mdi:robot-vacuum",counter:"mdi:counter",timer:"mdi:timer"}[e]||"mdi:cog"}render(){return te`
      <div class="mc-picker-row">
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="domain.service"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:cog-play"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getFilteredServices();return te`
      <div class="mc-picker-overlay" @click=${()=>{this._modalCtrl.consumeDragFlag()||this._closeModal()}}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
            <ha-icon icon="mdi:cog-play"></ha-icon>
            <span class="mc-picker-title">Select Service</span>
            <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
            </button>
            <button class="mc-picker-close" @click=${this._closeModal}>&times;</button>
          </div>
          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search services..."
              .value=${this._searchQuery}
              @input=${e=>{this._searchQuery=e.target.value}}
            />
          </div>
          <div class="mc-picker-list">
            ${e.length>0?e.map(e=>te`
                  <div class="mc-picker-domain">${e.domain}</div>
                  ${e.services.map(e=>te`
                    <div
                      class="mc-picker-item"
                      @click=${()=>this._selectService(`${e.domain}.${e.service}`)}
                    >
                      <div class="mc-picker-item-icon">
                        <ha-icon icon=${this._domainIcon(e.domain)}></ha-icon>
                      </div>
                      <div class="mc-picker-item-content">
                        <div class="mc-picker-item-name">${e.name}</div>
                        <div class="mc-picker-item-id">${e.domain}.${e.service}</div>
                        ${e.description?te`<div class="mc-picker-item-desc">${e.description}</div>`:""}
                      </div>
                    </div>
                  `)}
                `):te`<div class="mc-picker-empty">No services found</div>`}
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${e=>this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `}};_i.styles=[Ee,We],xi([Se({attribute:!1})],_i.prototype,"hass",void 0),xi([Se({type:String})],_i.prototype,"value",void 0),xi([Se({type:String})],_i.prototype,"label",void 0),xi([Ce()],_i.prototype,"_showModal",void 0),xi([Ce()],_i.prototype,"_searchQuery",void 0),_i=xi([we("mc-service-picker")],_i);var wi=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let ki=class extends xe{constructor(){super(...arguments),this.value="",this.label="Icon",this._modalCtrl=new kt(this),this._showModal=!1,this._searchQuery="",this._selectedIcon=""}_openModal(){this._selectedIcon=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._modalCtrl.reset(),this._showModal=!1}_handleSave(){this.value=this._selectedIcon,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedIcon},bubbles:!0,composed:!0})),this._closeModal()}_selectIcon(e){this._selectedIcon=e.detail.value,this._searchQuery=e.detail.value}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}render(){return te`
      <div class="mc-picker-row">
        ${this.value?te`
            <div class="mc-picker-entity-info" @click=${this._openModal} title=${this.value}>
              <div class="mc-picker-entity-icon">
                <ha-icon .icon=${this.value}></ha-icon>
              </div>
              <div class="mc-picker-entity-details">
                <div class="mc-picker-entity-name">${this.value}</div>
              </div>
            </div>
          `:te`
            <input
              type="text"
              class="mc-picker-input"
              .value=${this.value}
              placeholder="mdi:icon"
              @input=${this._onInputChange}
            />
          `}
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:emoticon-outline"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal?this._renderModal():""}
    `}_handleSearchChange(e){this._searchQuery=e.target.value}_renderModal(){return te`
      <div class="mc-picker-overlay" @click=${()=>{this._modalCtrl.consumeDragFlag()||this._closeModal()}}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
                <ha-icon icon="mdi:emoticon-outline"></ha-icon>
                <span class="mc-picker-title">Select Icon</span>
            </div>
            <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
          </div>
          <div class="mc-picker-search">
            <input
                type="text"
                placeholder="Search icons..."
               .value=${this._searchQuery}
               @input=${this._handleSearchChange}
            />
          </div>
          <div class="mc-picker-list">
            <ha-icon-picker
              .hass=${this.hass}
              .value=${this._selectedIcon}
              .search=${this._searchQuery}
              @value-changed=${this._selectIcon}
            ></ha-icon-picker>
          </div>
          <div class="mc-picker-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${e=>this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `}};ki.styles=[Ee,Fe],wi([Se({attribute:!1})],ki.prototype,"hass",void 0),wi([Se({type:String})],ki.prototype,"value",void 0),wi([Se({type:String})],ki.prototype,"label",void 0),wi([Ce()],ki.prototype,"_showModal",void 0),wi([Ce()],ki.prototype,"_searchQuery",void 0),wi([Ce()],ki.prototype,"_selectedIcon",void 0),ki=wi([we("mc-icon-picker")],ki);var $i=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};const Si={general:{label:"General",icon:"mdi:cog"},actions:{label:"Actions",icon:"mdi:gesture-tap"},conditions:{label:"Conditions",icon:"mdi:filter-outline"},design:{label:"Design",icon:"mdi:palette"}};let Ci=class extends xe{constructor(){super(...arguments),this.open=!1,this._activeTab="general",this._modalCtrl=new kt(this)}_close(){this._modalCtrl.reset(),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_handleFieldSyncToggle(e){if(!this.module||!this.onChange||!this.template)return;const{propertyPath:t,synced:i}=e.detail,n=new Set(this.module.not_synced||[]);i?n.add(t):n.delete(t),this.onChange({...this.module,not_synced:Array.from(n)})}render(){if(!this.open||!this.module)return te``;const e=Ye.get(this.module.type);if(!e)return te``;const t=e.getAvailableTabs(),i=t.includes(this._activeTab)?this._activeTab:t[0];return te`
      <div class="mc-modal-overlay" @click=${()=>{this._modalCtrl.consumeDragFlag()||this._close()}}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}
             @field-sync-toggle=${this._handleFieldSyncToggle}>
          <div class="mc-modal-header"
               @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
            <ha-icon icon=${e.metadata.icon}></ha-icon>
            <span class="mc-modal-title">${e.metadata.name} Settings</span>
            <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._close}>&times;</button>
          </div>

          <div class="mc-modal-tabs">
            ${t.map(e=>{const t=Si[e];return te`
                <button
                  class="mc-modal-tab ${i===e?"active":""}"
                  @click=${()=>{this._activeTab=e}}
                >
                  <ha-icon icon=${t.icon}></ha-icon>
                  ${t.label}
                </button>
              `})}
          </div>

          <div class="mc-modal-body">
            ${this._renderTabContent(i,e)}
          </div>

          <div class="mc-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${this._close}>Done</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${e=>this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `}_renderTabContent(e,t){if(!this.module||!this.onChange)return te`<p>Loading...</p>`;const i=this.template?this._wrapOnChangeWithSync(this.module,this.onChange):this.onChange;switch(e){case"general":return t.renderGeneralTab(this.module,this.hass,i,this.template);case"actions":return t.renderActionsTab?t.renderActionsTab(this.module,this.hass,i,this.template):te`<p>No actions available</p>`;case"conditions":return t.renderConditionsTab?t.renderConditionsTab(this.module,this.hass,i,this.template):te`<p>No conditions available</p>`;case"design":return t.renderDesignTab?t.renderDesignTab(this.module,this.hass,i,this.template):te`<p>No design options</p>`}}_wrapOnChangeWithSync(e,t){return i=>{const n=new Set(i.not_synced||[]),r=e,o=i,a=new Set(["id","type","not_synced","design","actions","display"]);for(const e of Object.keys(o))a.has(e)||o[e]!==r[e]&&n.add(e);i.not_synced=Array.from(n),t(i)}}};Ci.styles=[Ae,Pe,He],$i([Se({attribute:!1})],Ci.prototype,"module",void 0),$i([Se({attribute:!1})],Ci.prototype,"hass",void 0),$i([Se({type:Boolean})],Ci.prototype,"open",void 0),$i([Se({type:String})],Ci.prototype,"template",void 0),$i([Se({attribute:!1})],Ci.prototype,"onChange",void 0),$i([Ce()],Ci.prototype,"_activeTab",void 0),Ci=$i([we("mc-settings-modal")],Ci);var Ti=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};const Mi=[{type:"alarm-panel",name:"Alarm Panel",description:"Alarm control panel",icon:"mdi:shield-home",category:"built-in"},{type:"area",name:"Area",description:"Show area devices and entities",icon:"mdi:texture-box",category:"built-in"},{type:"button",name:"Button",description:"Action button for an entity",icon:"mdi:gesture-tap-button",category:"built-in"},{type:"calendar",name:"Calendar",description:"Calendar display",icon:"mdi:calendar",category:"built-in"},{type:"conditional",name:"Conditional",description:"Show cards based on conditions",icon:"mdi:eye-check",category:"built-in"},{type:"entities",name:"Entities",description:"List of entity rows",icon:"mdi:format-list-bulleted",category:"built-in"},{type:"entity",name:"Entity",description:"Single entity display",icon:"mdi:card-text",category:"built-in"},{type:"entity-filter",name:"Entity Filter",description:"Filtered entity list",icon:"mdi:filter",category:"built-in"},{type:"gauge",name:"Gauge",description:"Gauge visualization",icon:"mdi:gauge",category:"built-in"},{type:"glance",name:"Glance",description:"Quick overview of entities",icon:"mdi:eye",category:"built-in"},{type:"grid",name:"Grid",description:"Grid layout of cards",icon:"mdi:view-grid",category:"built-in"},{type:"heading",name:"Heading",description:"Section heading",icon:"mdi:format-header-1",category:"built-in"},{type:"history-graph",name:"History Graph",description:"Entity history graph",icon:"mdi:chart-line",category:"built-in"},{type:"horizontal-stack",name:"Horizontal Stack",description:"Stack cards horizontally",icon:"mdi:arrow-split-vertical",category:"built-in"},{type:"humidifier",name:"Humidifier",description:"Humidifier control",icon:"mdi:air-humidifier",category:"built-in"},{type:"iframe",name:"iFrame",description:"Embed a webpage",icon:"mdi:web",category:"built-in"},{type:"light",name:"Light",description:"Light control card",icon:"mdi:lightbulb",category:"built-in"},{type:"logbook",name:"Logbook",description:"Entity logbook entries",icon:"mdi:book-open-variant",category:"built-in"},{type:"map",name:"Map",description:"Map with entity locations",icon:"mdi:map",category:"built-in"},{type:"markdown",name:"Markdown",description:"Rendered Markdown text",icon:"mdi:language-markdown",category:"built-in"},{type:"media-control",name:"Media Control",description:"Media player controls",icon:"mdi:cast",category:"built-in"},{type:"picture",name:"Picture",description:"Display an image",icon:"mdi:image",category:"built-in"},{type:"picture-elements",name:"Picture Elements",description:"Image with interactive elements",icon:"mdi:image-edit",category:"built-in"},{type:"picture-entity",name:"Picture Entity",description:"Entity with background image",icon:"mdi:image-area",category:"built-in"},{type:"picture-glance",name:"Picture Glance",description:"Image with entity icons",icon:"mdi:image-multiple",category:"built-in"},{type:"plant-status",name:"Plant Status",description:"Plant monitor display",icon:"mdi:flower",category:"built-in"},{type:"sensor",name:"Sensor",description:"Sensor with graph",icon:"mdi:eye",category:"built-in"},{type:"shopping-list",name:"Shopping List",description:"Shopping list card",icon:"mdi:cart",category:"built-in"},{type:"statistic",name:"Statistic",description:"Long-term statistic",icon:"mdi:chart-box",category:"built-in"},{type:"statistics-graph",name:"Statistics Graph",description:"Statistics graph",icon:"mdi:chart-bell-curve",category:"built-in"},{type:"thermostat",name:"Thermostat",description:"Climate control card",icon:"mdi:thermostat",category:"built-in"},{type:"tile",name:"Tile",description:"Compact tile card",icon:"mdi:square-rounded",category:"built-in"},{type:"todo-list",name:"To-Do List",description:"To-do list card",icon:"mdi:checkbox-marked-outline",category:"built-in"},{type:"vertical-stack",name:"Vertical Stack",description:"Stack cards vertically",icon:"mdi:arrow-split-horizontal",category:"built-in"},{type:"weather-forecast",name:"Weather Forecast",description:"Weather forecast card",icon:"mdi:weather-partly-cloudy",category:"built-in"}];let zi=class extends xe{constructor(){super(...arguments),this.value="",this._modalCtrl=new kt(this),this._showModal=!1,this._searchQuery="",this._selectedCardType=""}_openModal(){this._selectedCardType=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._modalCtrl.reset(),this._showModal=!1}_handleSave(){this.value=this._selectedCardType,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedCardType},bubbles:!0,composed:!0})),this._closeModal()}_selectCard(e){this._selectedCardType=e,this._searchQuery=e}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getCustomCards(){const e=window.customCards;return Array.isArray(e)?e.map(e=>({type:`custom:${e.type}`,name:e.name||e.type,description:e.description||"Custom card",icon:"mdi:puzzle",category:"custom"})):[]}_getFilteredCards(){const e=this._searchQuery.toLowerCase(),t=t=>!e||(t.type.toLowerCase().includes(e)||t.name.toLowerCase().includes(e)||t.description.toLowerCase().includes(e));return{builtIn:Mi.filter(t),custom:this._getCustomCards().filter(t)}}render(){return te`
      <div class="mc-picker-row">
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="card type (e.g. button, custom:mushroom-light-card)"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:form-select"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const{builtIn:e,custom:t}=this._getFilteredCards(),i=e.length>0||t.length>0;return te`
      <div class="mc-picker-overlay" @click=${()=>{this._modalCtrl.consumeDragFlag()||this._closeModal()}}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header"
               @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:card-plus-outline"></ha-icon>
              <span class="mc-picker-title">Select Card</span>
            </div>
            <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
              <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
            </button>
            <button class="mc-modal-close" @click=${this._closeModal}>&times;</button>
          </div>
          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search cards..."
              .value=${this._searchQuery}
              @input=${e=>{this._searchQuery=e.target.value}}
            />
          </div>
          <div class="mc-picker-list">
            ${i?te`
                  ${e.length>0?te`
                    <div class="mc-picker-category">Built-in Cards</div>
                    ${e.map(e=>this._renderCardItem(e))}
                  `:""}
                  ${t.length>0?te`
                    <div class="mc-picker-category">Custom Cards (HACS)</div>
                    ${t.map(e=>this._renderCardItem(e))}
                  `:""}
                `:te`<div class="mc-picker-empty">No cards found</div>`}
          </div>
          <div class="mc-picker-footer">
            <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
          </div>
          <div class="mc-modal-resize-handle"
               @pointerdown=${e=>this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `}_renderCardItem(e){return te`
      <div class="mc-picker-item" @click=${()=>this._selectCard(e.type)}>
        <div class="mc-picker-item-icon">
          <ha-icon icon=${e.icon}></ha-icon>
        </div>
        <div class="mc-picker-item-content">
          <div class="mc-picker-item-name">${e.name}</div>
          <div class="mc-picker-item-id">${e.type}</div>
        </div>
        <span class="mc-picker-item-badge">${"custom"===e.category?"Custom":"Built-in"}</span>
      </div>
    `}};zi.styles=[Ee],Ti([Se({type:String})],zi.prototype,"value",void 0),Ti([Ce()],zi.prototype,"_showModal",void 0),Ti([Ce()],zi.prototype,"_searchQuery",void 0),Ti([Ce()],zi.prototype,"_selectedCardType",void 0),zi=Ti([we("mc-card-picker")],zi);var Ai=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let Ei=class extends xe{constructor(){super(...arguments),this._modalCtrl=new kt(this),this.mode="create",this._templateName="",this._templateDescription="",this._searchQuery="",this._error="",this._confirmLoad=null,this._showOverwrite=!1,this._templates={},this._loading=!0,this._saving=!1,this._editingTemplate=null,this._editName="",this._editDescription=""}connectedCallback(){super.connectedCallback(),this._loadTemplates()}updated(e){super.updated(e),e.has("hass")&&this.hass&&0===Object.keys(this._templates).length&&!this._loading&&this._loadTemplates()}async _loadTemplates(){this._loading=!0;try{if(this.hass){const e=await this.hass.callWS({type:"magic_card_utils/get_templates"});this._templates=e.templates||{}}}catch{this._templates={},this._error="Magic Card integration not found. Please install it via HACS and add the integration."}this._loading=!1}async _saveTemplate(e,t){this._saving=!0;try{return this.hass?(await this.hass.callWS({type:"magic_card_utils/save_template",name:e,template:t}),this._templates={...this._templates,[e]:t},this._saving=!1,!0):(this._error="Home Assistant connection unavailable.",this._saving=!1,!1)}catch{return this._error="Failed to save template.",this._saving=!1,!1}}async _deleteTemplate(e){try{if(!this.hass)return!1;await this.hass.callWS({type:"magic_card_utils/delete_template",name:e});const t={...this._templates};return delete t[e],this._templates=t,!0}catch{return this._error="Failed to delete template.",!1}}_close(){this._modalCtrl.reset(),this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}async _handleCreateSave(){const e=this._templateName.trim();if(!e)return void(this._error="Template name is required.");if(this._templates[e]&&!this._showOverwrite)return void(this._showOverwrite=!0);if(!this.config)return void(this._error="No config available to save.");const t={config:pt(this.config)},i=this._templateDescription.trim();i&&(t.description=i);if(await this._saveTemplate(e,t)){const t=pt(this.config);t.template=e,this.dispatchEvent(new CustomEvent("template-selected",{detail:{config:t},bubbles:!0,composed:!0})),this._close()}}_handleLoadConfirm(e){const t=this._templates[e];if(!t)return;const i=pt(t.config);i.type="custom:magic-card",i.template=e,this.dispatchEvent(new CustomEvent("template-selected",{detail:{config:i},bubbles:!0,composed:!0})),this._close()}async _handleDelete(e){await this._deleteTemplate(e),this._confirmLoad===e&&(this._confirmLoad=null),this._editingTemplate===e&&(this._editingTemplate=null)}_startEdit(e){const t=this._templates[e];this._editingTemplate=e,this._editName=e,this._editDescription=t?.description||"",this._confirmLoad=null}_cancelEdit(){this._editingTemplate=null,this._editName="",this._editDescription=""}async _saveEdit(){if(!this._editingTemplate||!this.hass)return;const e=this._editingTemplate,t=this._editName.trim();if(!t)return void(this._error="Template name is required.");const i=this._templates[e];if(!i)return;const n={...i,description:this._editDescription.trim()||void 0};if(t!==e){if(this._templates[t])return void(this._error=`A template named "${t}" already exists.`);await this._deleteTemplate(e)}await this._saveTemplate(t,n)&&(this._editingTemplate=null,this._editName="",this._editDescription="",this._error="")}_getFilteredTemplates(){const e=Object.keys(this._templates).sort((e,t)=>e.localeCompare(t));if(!this._searchQuery)return e;const t=this._searchQuery.toLowerCase();return e.filter(e=>e.toLowerCase().includes(t))}render(){return te`
      <div class="mc-picker-overlay" @click=${()=>{this._modalCtrl.consumeDragFlag()||this._close()}}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          ${"create"===this.mode?this._renderCreate():this._renderLink()}
          <div class="mc-modal-resize-handle"
               @pointerdown=${e=>this._modalCtrl.handleResizePointerDown(e)}
               @touchstart=${e=>this._modalCtrl.handleResizeTouchStart(e)}></div>
        </div>
      </div>
    `}_renderCreate(){return te`
      <div class="mc-picker-header"
           @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
           @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
        <div class="mc-picker-header-start">
          <ha-icon icon="mdi:file-document-plus-outline"></ha-icon>
          <span class="mc-picker-title">Create Template</span>
        </div>
        <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
          <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
        </button>
        <button class="mc-modal-close" @click=${this._close}>&times;</button>
      </div>
      <div class="mc-template-form">
        <input
          type="text"
          placeholder="Template name"
          .value=${this._templateName}
          @input=${e=>{this._templateName=e.target.value,this._error="",this._showOverwrite=!1}}
        />
        <textarea
          placeholder="Description (optional)"
          .value=${this._templateDescription}
          @input=${e=>{this._templateDescription=e.target.value}}
        ></textarea>
        ${this._error?te`<div class="mc-template-error">${this._error}</div>`:ne}
        ${this._showOverwrite?te`
              <div class="mc-template-overwrite">
                A template named "${this._templateName.trim()}" already exists. Overwrite?
              </div>
            `:ne}
      </div>
      <div class="mc-picker-footer">
        <button class="action-btn cancel-btn" @click=${this._close}>Cancel</button>
        ${this._showOverwrite?te`<button class="action-btn overwrite-btn" ?disabled=${this._saving} @click=${this._handleCreateSave}>Overwrite</button>`:te`<button class="action-btn save-btn" ?disabled=${!this._templateName.trim()||this._saving} @click=${this._handleCreateSave}>Save</button>`}
      </div>
    `}_renderEditForm(){return te`
      <div class="mc-template-edit-form">
        <input
          type="text"
          placeholder="Template name"
          .value=${this._editName}
          @input=${e=>{this._editName=e.target.value,this._error=""}}
          @click=${e=>e.stopPropagation()}
        />
        <textarea
          placeholder="Description (optional)"
          .value=${this._editDescription}
          @input=${e=>{this._editDescription=e.target.value}}
          @click=${e=>e.stopPropagation()}
        ></textarea>
        ${this._error?te`<div class="mc-template-error">${this._error}</div>`:ne}
        <div class="mc-template-edit-actions">
          <button class="action-btn cancel-btn" @click=${this._cancelEdit}>Cancel</button>
          <button
            class="action-btn save-btn"
            ?disabled=${!this._editName.trim()||this._saving}
            @click=${this._saveEdit}
          >
            Save
          </button>
        </div>
      </div>
    `}_renderLink(){if(this._loading)return te`
        <div class="mc-picker-header"
             @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
             @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
          <div class="mc-picker-header-start">
            <ha-icon icon="mdi:file-document-multiple-outline"></ha-icon>
            <span class="mc-picker-title">Load Template</span>
          </div>
          <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
            <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
          </button>
          <button class="mc-modal-close" @click=${this._close}>&times;</button>
        </div>
        <div class="mc-picker-loading">Loading templates...</div>
      `;const e=this._getFilteredTemplates();return te`
      <div class="mc-picker-header"
           @pointerdown=${e=>this._modalCtrl.handleHeaderPointerDown(e)}
           @touchstart=${e=>this._modalCtrl.handleHeaderTouchStart(e)}>
        <div class="mc-picker-header-start">
          <ha-icon icon="mdi:file-document-multiple-outline"></ha-icon>
          <span class="mc-picker-title">Load Template</span>
        </div>
        <button class="mc-modal-maximize-btn" @click=${()=>this._modalCtrl.toggleMaximize()}>
          <ha-icon icon=${this._modalCtrl.isMaximized?"mdi:window-restore":"mdi:window-maximize"}></ha-icon>
        </button>
        <button class="mc-modal-close" @click=${this._close}>&times;</button>
      </div>
      <div class="mc-picker-search">
        <input
          type="text"
          placeholder="Search templates..."
          .value=${this._searchQuery}
          @input=${e=>{this._searchQuery=e.target.value}}
        />
      </div>
      ${this._confirmLoad?te`
            <div class="mc-template-confirm">
              <div class="mc-template-confirm-text">
                Load "${this._confirmLoad}"? This will replace your current config.
              </div>
              <div class="mc-template-confirm-actions">
                <button class="action-btn save-btn" @click=${()=>this._handleLoadConfirm(this._confirmLoad)}>Confirm</button>
                <button class="action-btn cancel-btn" @click=${()=>{this._confirmLoad=null}}>Cancel</button>
              </div>
            </div>
          `:ne}
      ${this._editingTemplate?this._renderEditForm():ne}
      <div class="mc-picker-list">
        ${e.length>0?e.map(e=>te`
                <div class="mc-picker-item" @click=${()=>{this._confirmLoad=e}}>
                  <div class="mc-picker-item-icon">
                    <ha-icon icon="mdi:file-document-outline"></ha-icon>
                  </div>
                  <div class="mc-picker-item-content">
                    <div class="mc-picker-item-name">${e}</div>
                    ${this._templates[e]?.description?te`<div class="mc-picker-item-meta">${this._templates[e].description}</div>`:ne}
                  </div>
                  <div class="mc-picker-item-actions">
                    <button
                      class="mc-template-edit-btn"
                      title="Edit template"
                      @click=${t=>{t.stopPropagation(),this._startEdit(e)}}
                    >
                      <ha-icon icon="mdi:pencil-outline"></ha-icon>
                    </button>
                    <button
                      class="mc-template-delete-btn"
                      title="Delete template"
                      @click=${t=>{t.stopPropagation(),this._handleDelete(e)}}
                    >
                      <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </button>
                  </div>
                </div>
              `):te`<div class="mc-picker-empty">No templates saved</div>`}
      </div>
      <div class="mc-picker-footer">
        <button class="action-btn cancel-btn" @click=${this._close}>Cancel</button>
      </div>
    `}};Ei.styles=[Ee,je],Ai([Se({type:String})],Ei.prototype,"mode",void 0),Ai([Se({attribute:!1})],Ei.prototype,"config",void 0),Ai([Se({attribute:!1})],Ei.prototype,"hass",void 0),Ai([Ce()],Ei.prototype,"_templateName",void 0),Ai([Ce()],Ei.prototype,"_templateDescription",void 0),Ai([Ce()],Ei.prototype,"_searchQuery",void 0),Ai([Ce()],Ei.prototype,"_error",void 0),Ai([Ce()],Ei.prototype,"_confirmLoad",void 0),Ai([Ce()],Ei.prototype,"_showOverwrite",void 0),Ai([Ce()],Ei.prototype,"_templates",void 0),Ai([Ce()],Ei.prototype,"_loading",void 0),Ai([Ce()],Ei.prototype,"_saving",void 0),Ai([Ce()],Ei.prototype,"_editingTemplate",void 0),Ai([Ce()],Ei.prototype,"_editName",void 0),Ai([Ce()],Ei.prototype,"_editDescription",void 0),Ei=Ai([we("mc-template-picker")],Ei);var Pi=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let Ii=class extends xe{constructor(){super(...arguments),this._showModuleSelector=!1,this._showSettingsModal=!1,this._showCardSettingsModal=!1,this._cardSettingsTab="appearance",this._expandedAppearanceRules=new Set,this._showTemplatePicker=null,this._linkedTemplate=null,this._showLinkedPopup=!1,this._showSyncDialog=!1,this._breakpoint="md",this._initialTemplateFetched=!1,this._responsive=new Yt,this._handleSyncNo=()=>{this._pendingSyncAction?.(),this._showSyncDialog=!1,this._pendingSyncAction=void 0},this._handleSyncYes=async()=>{this._pendingSyncAction?.(),this._showSyncDialog=!1,this._pendingSyncAction=void 0,await this._saveToTemplate()},this._onTemplateSelected=e=>{this._stateManager.updateConfig(e.detail.config),this._showTemplatePicker=null},this._onAddModule=e=>{this._moduleSelectorTarget=e.detail,this._showModuleSelector=!0},this._onModuleSelected=e=>{this._moduleSelectorTarget&&this._stateManager.addModule(this._moduleSelectorTarget.rowIndex,this._moduleSelectorTarget.colIndex,e.detail.type),this._showModuleSelector=!1,this._moduleSelectorTarget=void 0}}connectedCallback(){super.connectedCallback(),this._stateManager=new Qt(e=>{this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:e}}))}),this._unsubscribe=this._stateManager.subscribe(e=>{this._editorState=e,this._linkedTemplate=e.config.template??null,void 0!==e.selectedPath?.moduleIndex&&(this._showSettingsModal=!0)}),this._pendingConfig&&(this._stateManager.setConfig(this._pendingConfig),this._pendingConfig=void 0)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._stateManager?.destroy(),this._responsive.disconnect()}firstUpdated(){const e=this.renderRoot.querySelector(".mc-editor");e&&(this._responsive.observe(e),this._breakpoint=this._responsive.getCurrentBreakpoint(),this._responsive.onBreakpointChange(e=>{this._breakpoint=e}))}setConfig(e){this._stateManager?(this._stateManager.setConfig(e),e.template&&this.hass&&!this._initialTemplateFetched&&(this._initialTemplateFetched=!0,this._fetchAndApplyTemplate(e.template,e))):this._pendingConfig=e}async _fetchAndApplyTemplate(e,t){if(this.hass)try{const i=await this.hass.callWS({type:"magic_card_utils/get_templates"}),n=i.templates?.[e];if(n){const e=ut(n.config,t);this._stateManager.setConfig(e)}}catch(t){console.warn("Magic Card Editor: Failed to fetch template",e,t)}}render(){if(!this._editorState)return te`
        <div class="mc-editor mc-editor-skeleton" aria-busy="true" aria-label="Loading editor">
          <div class="mc-skel mc-skel-switcher"></div>
          <div class="mc-skel mc-skel-line mc-skel-line-short"></div>
          <div class="mc-skel-toolbar">
            <div class="mc-skel mc-skel-icon-btn"></div>
            <div class="mc-skel mc-skel-icon-btn"></div>
            <div class="mc-skel-spacer"></div>
            <div class="mc-skel mc-skel-pill"></div>
          </div>
          <div class="mc-skel mc-skel-card-header"></div>
          <div class="mc-skel mc-skel-row"></div>
          <div class="mc-skel mc-skel-row"></div>
        </div>
      `;const{editorMode:e}=this._editorState;return te`
      <div class="mc-editor mc-bp-${this._breakpoint}">
        ${this._renderModeSwitcher(e)}
        ${this._renderModeHelp(e)}
        ${this._renderToolbar()}
        ${this._renderSelectionContext()}
        ${this._renderEditorMode(e)}
        ${this._showCardSettingsModal?this._renderCardSettingsModal():ne}
        ${this._showModuleSelector?this._renderModuleSelectorDialog():ne}
        ${this._showTemplatePicker?this._renderTemplatePicker():ne}
        ${this._renderSettingsModal()}
      </div>
    `}_renderModeSwitcher(e){return te`
      <div class="mc-mode-switcher">
        <button
          class="mc-mode-btn ${"form"===e?"active":""}"
          @click=${()=>this._stateManager.setEditorMode("form")}
          aria-label="Switch to Form mode"
        >
          <ha-icon icon="mdi:form-select" style="--mdc-icon-size:16px"></ha-icon>
          Form
        </button>
        <button
          class="mc-mode-btn ${"yaml"===e?"active":""}"
          @click=${()=>this._stateManager.setEditorMode("yaml")}
          aria-label="Switch to YAML mode"
        >
          <ha-icon icon="mdi:code-braces" style="--mdc-icon-size:16px"></ha-icon>
          YAML
        </button>
        <button
          class="mc-mode-btn ${"tree"===e?"active":""}"
          @click=${()=>this._stateManager.setEditorMode("tree")}
          aria-label="Switch to Tree mode"
        >
          <ha-icon icon="mdi:file-tree-outline" style="--mdc-icon-size:16px"></ha-icon>
          Tree
        </button>
      </div>
    `}_renderModeHelp(e){return te`<div class="mc-mode-help">${"form"===e?"Form mode: visual layout editing with drag/drop and quick actions.":"yaml"===e?"YAML mode: direct config editing with instant sync.":"Tree mode: structure-first editing for large cards."}</div>`}_renderToolbar(){return te`
      <div class="mc-editor-toolbar">
        <button
          class="mc-toolbar-btn"
          ?disabled=${!this._stateManager.canUndo()}
          @click=${()=>this._stateManager.undo()}
          title="Undo"
        >
          <ha-icon icon="mdi:undo" style="--mdc-icon-size:18px"></ha-icon>
        </button>
        <button
          class="mc-toolbar-btn"
          ?disabled=${!this._stateManager.canRedo()}
          @click=${()=>this._stateManager.redo()}
          title="Redo"
        >
          <ha-icon icon="mdi:redo" style="--mdc-icon-size:18px"></ha-icon>
        </button>
        <span class="mc-toolbar-spacer"></span>
        ${this._linkedTemplate?te`
              <div class="mc-toolbar-linked-container">
                <button
                  type="button"
                  class="mc-linked-indicator"
                  title="Linked to template '${this._linkedTemplate}'"
                  aria-label="Open template link details"
                  @click=${()=>{this._showLinkedPopup=!this._showLinkedPopup}}
                >
                  <ha-icon icon="mdi:link-variant" style="--mdc-icon-size:18px"></ha-icon>
                  ${this._getTotalNotSyncedCount()>0?te`
                    <span class="mc-linked-badge">${this._getTotalNotSyncedCount()}</span>
                  `:ne}
                </button>
                ${this._showLinkedPopup?this._renderLinkedPopup():ne}
              </div>
            `:te`
              <button
                class="mc-toolbar-btn"
                @click=${()=>{this._showTemplatePicker="create"}}
                title="Create Template"
              >
                <ha-icon icon="mdi:file-document-plus-outline" style="--mdc-icon-size:18px"></ha-icon>
              </button>
              <button
                class="mc-toolbar-btn"
                @click=${()=>{this._showTemplatePicker="link"}}
                title="Load Template"
              >
                <ha-icon icon="mdi:file-document-multiple-outline" style="--mdc-icon-size:18px"></ha-icon>
              </button>
            `}
        <button
          class="mc-btn mc-btn-secondary"
          @click=${()=>this._handleAddRow()}
          title="Add Row"
        >
          <ha-icon icon="mdi:table-row-plus-after" style="--mdc-icon-size:16px"></ha-icon>
          Add Row
        </button>
      </div>
      ${this._showSyncDialog?this._renderSyncDialog():ne}
    `}_renderSelectionContext(){const e=this._editorState?.selectedPath;if(!e||void 0===e.rowIndex||void 0===e.columnIndex||void 0===e.moduleIndex)return te``;const t=this._stateManager.getSelectedModule();if(!t)return te``;const i=Ye.get(t.type)?.metadata,n=i?.name||t.type;return te`
      <div class="mc-selected-context" aria-live="polite">
        <ha-icon icon="mdi:target" style="--mdc-icon-size:16px"></ha-icon>
        <span>
          Editing <strong>${n}</strong>
          at Row ${e.rowIndex+1}, Column ${e.columnIndex+1}, Position ${e.moduleIndex+1}
        </span>
      </div>
    `}_collectNotSyncedEntries(){const e=this._editorState.config,t=[];e.not_synced?.length&&t.push({location:"Card",paths:[...e.not_synced]});for(let i=0;i<(e.rows||[]).length;i++){const n=e.rows[i];n.not_synced?.length&&t.push({location:`Row ${i+1}`,paths:[...n.not_synced]});for(let e=0;e<(n.columns||[]).length;e++){const r=n.columns[e];r.not_synced?.length&&t.push({location:`Row ${i+1} / Col ${e+1}`,paths:[...r.not_synced]});for(let e=0;e<(r.modules||[]).length;e++){const i=r.modules[e];if(i.not_synced?.length){const e=i.label||i.type;t.push({location:`${e}`,paths:[...i.not_synced]})}}}}return t}_getTotalNotSyncedCount(){return this._collectNotSyncedEntries().reduce((e,t)=>e+t.paths.length,0)}_resyncAll(){const e=pt(this._editorState.config);delete e.not_synced;for(const t of e.rows||[]){delete t.not_synced;for(const e of t.columns||[]){delete e.not_synced;for(const t of e.modules||[])delete t.not_synced}}this._stateManager.updateConfig(e),this._linkedTemplate&&this.hass&&(this._initialTemplateFetched=!1,this._fetchAndApplyTemplate(this._linkedTemplate,e)),this._showLinkedPopup=!1}_renderLinkedPopup(){const e=this._collectNotSyncedEntries(),t=e.reduce((e,t)=>e+t.paths.length,0);return te`
      <div class="mc-linked-popup">
        <div class="mc-linked-popup-name">
          <ha-icon icon="mdi:file-document-outline" style="--mdc-icon-size:18px"></ha-icon>
          ${this._linkedTemplate}
        </div>

        ${t>0?te`
          <div class="mc-linked-popup-sync-summary">
            <div class="mc-sync-summary-header">
              <ha-icon icon="mdi:link-variant-off" style="--mdc-icon-size:14px; color: var(--warning-color);"></ha-icon>
              ${t} local override${t>1?"s":""}
            </div>
            <div class="mc-sync-summary-list">
              ${e.map(e=>te`
                <div class="mc-sync-summary-item">
                  <span class="mc-sync-summary-location">${e.location}</span>
                  <span class="mc-sync-summary-paths">${e.paths.map(e=>e.replace("design.","")).join(", ")}</span>
                </div>
              `)}
            </div>
          </div>
        `:te`
          <div class="mc-linked-popup-sync-summary">
            <div class="mc-sync-summary-header synced">
              <ha-icon icon="mdi:check-circle-outline" style="--mdc-icon-size:14px; color: var(--success-color);"></ha-icon>
              Fully synced
            </div>
          </div>
        `}

        <div class="mc-linked-popup-actions">
          ${t>0?te`
            <button class="mc-linked-popup-btn" @click=${()=>this._resyncAll()}>
              <ha-icon icon="mdi:sync" style="--mdc-icon-size:16px"></ha-icon>
              Re-sync All
            </button>
          `:ne}
          <button class="mc-linked-popup-btn" @click=${this._saveToTemplate}>
            <ha-icon icon="mdi:content-save-outline" style="--mdc-icon-size:16px"></ha-icon>
            Save to Template
          </button>
          <button class="mc-linked-popup-btn danger" @click=${this._unlinkTemplate}>
            <ha-icon icon="mdi:link-variant-off" style="--mdc-icon-size:16px"></ha-icon>
            Unlink
          </button>
        </div>
      </div>
    `}_renderSyncDialog(){return te`
      <div class="mc-sync-dialog" @click=${()=>{this._showSyncDialog=!1,this._pendingSyncAction=void 0}}>
        <div class="mc-sync-dialog-content" @click=${e=>e.stopPropagation()}>
          <div class="mc-sync-dialog-title">
            <ha-icon icon="mdi:sync" style="--mdc-icon-size:20px; color: var(--primary-color)"></ha-icon>
            Update Linked Cards?
          </div>
          <div class="mc-sync-dialog-text">
            This card is linked to template "${this._linkedTemplate}". Do you want to update all linked cards with this structural change?
          </div>
          <div class="mc-sync-dialog-actions">
            <button class="mc-btn mc-btn-secondary" @click=${this._handleSyncNo}>
              No, only this card
            </button>
            <button class="mc-btn mc-btn-primary" @click=${this._handleSyncYes}>
              Yes, update all
            </button>
          </div>
        </div>
      </div>
    `}_handleAddRow(){this._linkedTemplate?(this._pendingSyncAction=()=>this._stateManager.addRow("1"),this._showSyncDialog=!0):this._stateManager.addRow("1")}_renderEditorMode(e){switch(e){case"tree":return te`
          <mc-tree-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
          ></mc-tree-editor>
        `;case"yaml":return te`
          <mc-yaml-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
          ></mc-yaml-editor>
        `;default:return te`
          <mc-form-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
            @open-card-settings=${()=>{this._showCardSettingsModal=!0}}
            @request-add-row=${()=>this._handleAddRow()}
          ></mc-form-editor>
        `}}_renderSettingsModal(){const e=this._stateManager?.getSelectedModule();if(!e||!this._showSettingsModal)return te``;const{selectedPath:t}=this._editorState;return te`
      <mc-settings-modal
        .module=${e}
        .hass=${this.hass}
        .open=${!0}
        .template=${this._editorState.config.template}
        .onChange=${e=>{void 0!==t?.rowIndex&&void 0!==t?.columnIndex&&void 0!==t?.moduleIndex&&this._stateManager.updateModule(t.rowIndex,t.columnIndex,t.moduleIndex,e)}}
        @close=${()=>{this._showSettingsModal=!1,this._stateManager.setSelectedPath(null)}}
      ></mc-settings-modal>
    `}_renderCardSettingsModal(){const e=this._editorState.config,t=!!e.template,i=t?{templateName:e.template,notSynced:e.not_synced||[],basePath:""}:void 0,n=this._cardSettingsTab;return te`
      <div class="mc-modal-overlay" @click=${()=>{this._showCardSettingsModal=!1}}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}
             @field-sync-toggle=${i=>{if(!t)return;const{propertyPath:n,synced:r}=i.detail,o=new Set(e.not_synced||[]);r?o.add(n):o.delete(n),this._stateManager.updateConfig({...e,not_synced:Array.from(o)})}}>
          <div class="mc-modal-header">
            <ha-icon icon="mdi:card-outline"></ha-icon>
            <span class="mc-modal-title">Card Settings</span>
            <button class="mc-modal-close" @click=${()=>{this._showCardSettingsModal=!1}}>&times;</button>
          </div>

          <div class="mc-modal-tabs">
            <button
              class="mc-modal-tab ${"appearance"===n?"active":""}"
              @click=${()=>{this._cardSettingsTab="appearance"}}
            >
              <ha-icon icon="mdi:palette"></ha-icon>
              Appearance
            </button>
            <button
              class="mc-modal-tab ${"conditions"===n?"active":""}"
              @click=${()=>{this._cardSettingsTab="conditions"}}
            >
              <ha-icon icon="mdi:filter-outline"></ha-icon>
              Conditions
            </button>
          </div>

          <div class="mc-modal-body">
            ${"appearance"===n?this._renderCardAppearanceTab(e,(i,n)=>{const r={[i]:n};if(t){const t=new Set(e.not_synced||[]);t.add(i),r.not_synced=Array.from(t)}this._stateManager.updateConfig({...e,...r})},i):this._renderCardConditionsTab(e,i)}
          </div>
          <div class="mc-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${()=>{this._showCardSettingsModal=!1}}>Done</button>
          </div>
        </div>
      </div>
    `}_renderCardAppearanceTab(e,t,i){const n=Object.keys(this.hass?.themes?.themes||{}).sort((e,t)=>e.localeCompare(t,void 0,{sensitivity:"base"})),r=e.theme||"__default__",o=!1!==e.use_page_theme,a=[{label:"Home Assistant Default",value:"__default__"},...n.map(e=>({label:e,value:e}))];return te`
      <div class="mc-tab-content">
        ${Bt("Background Color",e.background,e=>t("background",e),"background",i)}
        ${Vt("Background Image",e.background_image,e=>t("background_image",e),this.hass,"image","background_image",i)}
        ${jt("Use Dashboard Theme",o,e=>t("use_page_theme",e),"use_page_theme",i)}
        ${o?ne:Nt("Card Theme",r,a,e=>t("theme","__default__"===e?void 0:e),"theme",i)}
        ${Ht("Border Radius",e.border_radius,e=>t("border_radius",e),"border_radius",i)}
        ${Gt("Padding",e.padding,e=>t("padding",e),"padding","padding",i)}
        ${Lt("Box Shadow",e.box_shadow,e=>t("box_shadow",e),"box_shadow",i)}
        ${Ht("Card Height",e.card_height,e=>t("card_height",e),"card_height",i)}

        ${this._renderConditionalAppearanceSection(e,a)}
      </div>
    `}_renderConditionalAppearanceSection(e,t){const i=e.conditional_appearance||[],n=t=>{const i={conditional_appearance:t};if(e.template){const t=new Set(e.not_synced||[]);t.add("conditional_appearance"),i.not_synced=Array.from(t)}this._stateManager.updateConfig({...e,...i})},r=e=>{this._expandedAppearanceRules.delete(e),n(i.filter(t=>t.id!==e))},o=(e,t)=>{n(i.map(i=>i.id===e?{...i,...t}:i))},a=e=>{this._expandedAppearanceRules.has(e)?this._expandedAppearanceRules.delete(e):this._expandedAppearanceRules.add(e),this.requestUpdate()};return te`
      <div class="mc-cond-appearance-section">
        <div class="mc-cond-appearance-header">
          <ha-icon icon="mdi:filter-variant"></ha-icon>
          <span>Conditional Appearance</span>
        </div>
        <div class="mc-mode-help">
          Override appearance fields when conditions are met. Rules apply in order; later rules win.
        </div>

        <div class="mc-cond-appearance-list">
          ${i.map(e=>this._renderAppearanceRule(e,t,a,o,r))}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=dt("appr"),t={id:e,name:`Rule ${i.length+1}`,conditions:[],mode:"every",overrides:{}};this._expandedAppearanceRules.add(e),n([...i,t])}}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
          Add Rule
        </button>
      </div>
    `}_renderAppearanceRule(e,t,i,n,r){const o=this._expandedAppearanceRules.has(e.id),a=e.conditions||[],s=e.mode||"every",l=e.overrides||{},c=(t,i)=>{n(e.id,{conditions:a.map(e=>e.id===t?{...e,...i}:e)})},d=(t,i)=>{const r={...l};void 0===i||""===i||null===i?delete r[t]:r[t]=i,n(e.id,{overrides:r})},p=l.use_page_theme,u=l.theme||"__default__";return te`
      <div class="mc-cond-appearance-rule ${o?"expanded":""}">
        <div class="mc-cond-appearance-rule-header" @click=${()=>i(e.id)}>
          <ha-icon icon=${o?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
          <input
            class="mc-cond-appearance-rule-name"
            type="text"
            .value=${e.name||""}
            placeholder="Rule name"
            @click=${e=>e.stopPropagation()}
            @input=${t=>n(e.id,{name:t.target.value})}
          />
          <span class="mc-cond-appearance-rule-count">${a.length} cond.</span>
          <button
            class="mc-btn-icon"
            @click=${t=>{t.stopPropagation(),r(e.id)}}
            title="Remove rule"
          >
            <ha-icon icon="mdi:delete-outline" style="--mdc-icon-size:14px"></ha-icon>
          </button>
        </div>

        ${o?te`
          <div class="mc-cond-appearance-rule-body">
            <div class="mc-cond-appearance-subhead">Conditions</div>
            ${a.length>1?Nt("Mode",s,[{label:"All conditions (AND)",value:"every"},{label:"Any condition (OR)",value:"any"}],t=>n(e.id,{mode:t})):ne}

            <div class="mc-conditions-list">
              ${a.map(t=>te`
                <div class="mc-condition-item">
                  ${Nt("Type",t.type,[{label:"State",value:"state"},{label:"Attribute",value:"attribute"},{label:"Time",value:"time"},{label:"Template",value:"template"}],e=>c(t.id,{type:e}))}
                  ${"state"===t.type||"attribute"===t.type?te`
                        ${Ft("Entity",t.entity,e=>c(t.id,{entity:e}),this.hass)}
                        ${"attribute"===t.type?Lt("Attribute",t.attribute,e=>c(t.id,{attribute:e})):ne}
                        ${Lt("State equals",t.state,e=>c(t.id,{state:e}))}
                        ${Lt("State not equals",t.state_not,e=>c(t.id,{state_not:e}))}
                      `:ne}
                  ${"time"===t.type?te`
                        ${Lt("After (HH:MM)",t.after,e=>c(t.id,{after:e}))}
                        ${Lt("Before (HH:MM)",t.before,e=>c(t.id,{before:e}))}
                      `:ne}
                  ${"template"===t.type?Dt("Template",t.template,e=>c(t.id,{template:e}),{rows:3}):ne}
                  <button class="mc-btn-icon" @click=${()=>{return i=t.id,void n(e.id,{conditions:a.filter(e=>e.id!==i)});var i}} title="Remove condition">
                    <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
                  </button>
                </div>
              `)}
            </div>

            <button class="mc-btn mc-btn-secondary mc-btn-small" @click=${()=>{const t={id:dt("cond"),type:"state",entity:"",state:""};n(e.id,{conditions:[...a,t]})}}>
              <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
              Add Condition
            </button>

            <div class="mc-cond-appearance-subhead">Appearance Overrides</div>
            <div class="mc-mode-help">
              Only fields you set will override. Leave blank to fall through to base settings.
            </div>

            ${Bt("Background Color",l.background,e=>d("background",e))}
            ${Vt("Background Image",l.background_image,e=>d("background_image",e),this.hass,"image")}
            ${jt("Override Dashboard Theme",!1===p,e=>d("use_page_theme",!e&&void 0))}
            ${!1===p?Nt("Card Theme",u,t,e=>d("theme","__default__"===e?void 0:e)):ne}
            ${Ht("Border Radius",l.border_radius,e=>d("border_radius",e))}
            ${Gt("Padding",l.padding,e=>d("padding",e),"padding")}
            ${Lt("Box Shadow",l.box_shadow,e=>d("box_shadow",e))}
            ${Ht("Card Height",l.card_height,e=>d("card_height",e))}
          </div>
        `:ne}
      </div>
    `}_renderCardConditionsTab(e,t){const i=e.display||{},n=i.conditions||[],r=i.mode||"every",o=t?{...t,basePath:"display"}:void 0,a=i=>{const n={display:i};if(t){const t=new Set(e.not_synced||[]);t.add("display"),n.not_synced=Array.from(t)}this._stateManager.updateConfig({...e,...n})},s=e=>a({...i,...e}),l=(e,t)=>{s({conditions:n.map(i=>i.id===e?{...i,...t}:i)})};return te`
      <div class="mc-tab-content">
        <div class="mc-mode-help">
          When conditions are not met, the entire card is hidden.
        </div>

        ${n.length>1?Nt("Condition Mode",r,[{label:"All conditions (AND)",value:"every"},{label:"Any condition (OR)",value:"any"}],e=>s({mode:e}),"mode",o):ne}

        <div class="mc-conditions-list">
          ${n.map((e,t)=>{const i=o?{...o,basePath:`display.conditions.${t}`}:void 0;return te`
              <div class="mc-condition-item">
                ${Nt("Type",e.type,[{label:"State",value:"state"},{label:"Attribute",value:"attribute"},{label:"Time",value:"time"},{label:"Template",value:"template"}],t=>l(e.id,{type:t}),"type",i)}
                ${"state"===e.type||"attribute"===e.type?te`
                      ${Ft("Entity",e.entity,t=>l(e.id,{entity:t}),this.hass,void 0,"entity",i)}
                      ${"attribute"===e.type?Lt("Attribute",e.attribute,t=>l(e.id,{attribute:t}),"attribute",i):ne}
                      ${Lt("State equals",e.state,t=>l(e.id,{state:t}),"state",i)}
                      ${Lt("State not equals",e.state_not,t=>l(e.id,{state_not:t}),"state_not",i)}
                    `:ne}
                ${"time"===e.type?te`
                      ${Lt("After (HH:MM)",e.after,t=>l(e.id,{after:t}),"after",i)}
                      ${Lt("Before (HH:MM)",e.before,t=>l(e.id,{before:t}),"before",i)}
                    `:ne}
                ${"template"===e.type?Dt("Template",e.template,t=>l(e.id,{template:t}),{rows:3},"template",i):ne}
                <button class="mc-btn-icon" @click=${()=>{return t=e.id,void s({conditions:n.filter(e=>e.id!==t)});var t}} title="Remove condition">
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:14px"></ha-icon>
                </button>
              </div>
            `})}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${()=>{const e={id:dt("cond"),type:"state",entity:"",state:""};s({conditions:[...n,e]})}}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
          Add Condition
        </button>
      </div>
    `}_renderModuleSelectorDialog(){return te`
      <mc-module-selector
        @module-selected=${this._onModuleSelected}
        @close=${()=>{this._showModuleSelector=!1}}
      ></mc-module-selector>
    `}_renderTemplatePicker(){return te`
      <mc-template-picker
        .mode=${this._showTemplatePicker}
        .config=${this._editorState.config}
        .hass=${this.hass}
        @close=${()=>{this._showTemplatePicker=null}}
        @template-selected=${this._onTemplateSelected}
      ></mc-template-picker>
    `}_stripNotSynced(e){const t={...e};return delete t.not_synced,Array.isArray(t.rows)&&(t.rows=t.rows.map(e=>{const t={...e};return delete t.not_synced,Array.isArray(t.columns)&&(t.columns=t.columns.map(e=>{const t={...e};return delete t.not_synced,Array.isArray(t.modules)&&(t.modules=t.modules.map(e=>{const t={...e};return delete t.not_synced,t})),t})),t})),t}async _saveToTemplate(){if(!this._linkedTemplate||!this.hass)return;const e=this._stateManager.getConfig(),t=this._stripNotSynced({...e});delete t.template;try{await this.hass.callWS({type:"magic_card_utils/save_template",name:this._linkedTemplate,template:{config:t}})}catch(e){console.warn("Magic Card Editor: Failed to save template",this._linkedTemplate,e)}this._showLinkedPopup=!1}_unlinkTemplate(){const e={...this._stateManager.getConfig()};delete e.template,this._stateManager.updateConfig(e),this._showLinkedPopup=!1}};Ii.styles=[Ae,Pe],Pi([Se({attribute:!1})],Ii.prototype,"hass",void 0),Pi([Se({attribute:!1})],Ii.prototype,"lovelace",void 0),Pi([Ce()],Ii.prototype,"_editorState",void 0),Pi([Ce()],Ii.prototype,"_showModuleSelector",void 0),Pi([Ce()],Ii.prototype,"_moduleSelectorTarget",void 0),Pi([Ce()],Ii.prototype,"_showSettingsModal",void 0),Pi([Ce()],Ii.prototype,"_showCardSettingsModal",void 0),Pi([Ce()],Ii.prototype,"_cardSettingsTab",void 0),Pi([Ce()],Ii.prototype,"_expandedAppearanceRules",void 0),Pi([Ce()],Ii.prototype,"_showTemplatePicker",void 0),Pi([Ce()],Ii.prototype,"_linkedTemplate",void 0),Pi([Ce()],Ii.prototype,"_showLinkedPopup",void 0),Pi([Ce()],Ii.prototype,"_showSyncDialog",void 0),Pi([Ce()],Ii.prototype,"_pendingSyncAction",void 0),Pi([Ce()],Ii.prototype,"_breakpoint",void 0),Ii=Pi([we(r)],Ii);class Ri{getAvailableTabs(){return["general","actions","conditions","design"]}validate(e){return[]}_buildSyncContext(e,t){if(t)return{templateName:t,notSynced:e.not_synced||[],basePath:""}}_syncedOnChange(e,t,i){return(n,r)=>{if(i){const t=new Set(e.not_synced||[]);t.add(n),r.not_synced=Array.from(t)}t(r)}}renderActionsTab(e,t,i,n){const r=e.actions,o=this._buildSyncContext(e,n),a=(t,o)=>{const a={...e,actions:{...r,[t]:o}};if(n){const i=new Set(e.not_synced||[]);for(const[e,n]of Object.entries(o))void 0!==n&&i.add(`actions.${t}.${e}`);a.not_synced=Array.from(i)}i(a)},s=e=>{if(o)return{...o,basePath:`actions.${e}`}},l=e.entity;return te`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Tap Action</div>
          ${this._renderActionConfig(r?.tap_action,e=>a("tap_action",e),t,l,s("tap_action"))}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Hold Action</div>
          ${this._renderActionConfig(r?.hold_action,e=>a("hold_action",e),t,l,s("hold_action"))}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Double Tap Action</div>
          ${this._renderActionConfig(r?.double_tap_action,e=>a("double_tap_action",e),t,l,s("double_tap_action"))}
        </div>
      </div>
    `}renderConditionsTab(e,t,i,n){const r=e.display,o=r?.conditions||[],a=r?.mode||"every",s=this._buildSyncContext(e,n),l=t=>{i({...e,display:{...r,...t}})},c=(e,t)=>{l({conditions:o.map(i=>i.id===e?{...i,...t}:i)})},d=s?{...s,basePath:"display"}:void 0;return te`
      <div class="mc-tab-content">
        ${Nt("Condition Mode",a,[{label:"All conditions (AND)",value:"every"},{label:"Any condition (OR)",value:"any"}],e=>l({mode:e}),"mode",d)}

        <div class="mc-conditions-list">
          ${o.map((e,i)=>{const n=d?{...d,basePath:`display.conditions.${i}`}:void 0;return te`
              <div class="mc-condition-item">
                ${Nt("Type",e.type,[{label:"State",value:"state"},{label:"Attribute",value:"attribute"},{label:"Time",value:"time"},{label:"Template",value:"template"}],t=>c(e.id,{type:t}),"type",n)}
                ${"state"===e.type||"attribute"===e.type?te`
                      ${Ft("Entity",e.entity,t=>c(e.id,{entity:t}),t,void 0,"entity",n)}
                      ${"attribute"===e.type?Lt("Attribute",e.attribute,t=>c(e.id,{attribute:t}),"attribute",n):ne}
                      ${Lt("State equals",e.state,t=>c(e.id,{state:t}),"state",n)}
                      ${Lt("State not equals",e.state_not,t=>c(e.id,{state_not:t}),"state_not",n)}
                    `:ne}
                ${"time"===e.type?te`
                      ${Lt("After (HH:MM)",e.after,t=>c(e.id,{after:t}),"after",n)}
                      ${Lt("Before (HH:MM)",e.before,t=>c(e.id,{before:t}),"before",n)}
                    `:ne}
                ${"template"===e.type?te`
                      ${Dt("Template",e.template,t=>c(e.id,{template:t}),{rows:3},"template",n)}
                    `:ne}
                <button class="mc-btn-icon" @click=${()=>{return t=e.id,void l({conditions:o.filter(e=>e.id!==t)});var t}}>
                  &times;
                </button>
              </div>
            `})}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${()=>{const e={id:dt("cond"),type:"state",entity:"",state:""};l({conditions:[...o,e]})}}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
          Add Condition
        </button>
      </div>
    `}renderDesignTab(e,t,i,n){const r=e.design||{},o=!!n,a=e.not_synced||[];return te`<mc-design-panel
      .design=${r}
      .hass=${t}
      .hasTemplate=${o}
      .notSynced=${a}
      .moduleEntity=${e.entity||""}
      .onChange=${t=>{const n={...r},o={...e};if(t._markNotSynced){const i=`design.${t._markNotSynced}`,n=new Set(e.not_synced||[]);n.add(i),o.not_synced=Array.from(n),delete t._markNotSynced}if(t._markSynced){const i=`design.${t._markSynced}`,n=new Set(e.not_synced||[]);n.delete(i),o.not_synced=Array.from(n),delete t._markSynced}for(const[e,i]of Object.entries(t))void 0===i||""===i?delete n[e]:n[e]=i;i({...o,design:n})}}
    ></mc-design-panel>`}_renderActionConfig(e,t,i,n,r){const o=e||{action:"none"},a="more-info"===o.action||"toggle"===o.action,s=!1!==o.use_module_entity;return te`
      <div class="mc-action-config">
        ${Nt("",o.action,[{label:"None",value:"none"},{label:"More Info",value:"more-info"},{label:"Toggle",value:"toggle"},{label:"Navigate",value:"navigate"},{label:"URL",value:"url"},{label:"Perform Action",value:"perform-action"},{label:"Assist",value:"assist"}],e=>t({...o,action:e}),"action",r)}
        ${a&&n?jt("Use module entity",s,e=>t({...o,use_module_entity:e,entity:e?void 0:o.entity}),"use_module_entity",r):ne}
        ${!a||n&&s?ne:Ft("Entity",o.entity,e=>t({...o,entity:e}),i,void 0,"entity",r)}
        ${"navigate"===o.action?Lt("Navigation Path",o.navigation_path,e=>t({...o,navigation_path:e}),"navigation_path",r):ne}
        ${"url"===o.action?Lt("URL",o.url_path,e=>t({...o,url_path:e}),"url_path",r):ne}
        ${"perform-action"===o.action?te`
              ${function(e,t,i,n,r,o){return te`
    <div class="mc-field">
      ${Et(e,r,o)}
      <mc-service-picker
        .hass=${n}
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-service-picker>
    </div>
  `}("Service",o.service,e=>t({...o,service:e}),i,"service",r)}
            `:ne}
      </div>
    `}}Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"text",name:"Text",description:"Display static or template text",category:"content",icon:"mdi:format-text"}}createDefault(){return{id:dt("text"),type:"text",text:"Hello World"}}renderPreview(e,t){return te`<div class="mc-module mc-text">${e.text||""}</div>`}renderGeneralTab(e,t,i,n){const r=e,o=this._buildSyncContext(e,n);return te`
      <div class="mc-tab-content">
        ${Lt("Text",r.text,e=>i({...r,text:e}),"text",o)}
        ${jt("Use Template",r.use_template,e=>i({...r,use_template:e}),"use_template",o)}
        ${r.use_template?Pt("Use Jinja2 templates: {{ states('sensor.temp') }}"):te``}
      </div>
    `}validate(e){const t=[],i=e;return i.text||i.use_template||t.push("Text content is required"),t}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"icon",name:"Icon",description:"Display an icon from MDI or entity",category:"content",icon:"mdi:emoticon-outline"}}createDefault(){return{id:dt("icon"),type:"icon",icon:"mdi:home",size:"24px"}}renderPreview(e,t){const i=e;let n=i.icon||"mdi:help";if(i.use_entity_icon&&i.entity&&t){const e=t.states[i.entity];e?.attributes.icon&&(n=e.attributes.icon)}return te`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${i.size||"24px"}; color: ${i.icon_color||"inherit"}">
        <ha-icon .icon=${n}></ha-icon>
      </div>
    `}renderGeneralTab(e,t,i,n){const r=e,o=this._buildSyncContext(e,n);return te`
      <div class="mc-tab-content">
        ${Ft("Entity",r.entity,e=>i({...r,entity:e}),t,void 0,"entity",o)}
        ${qt("Attribute",r.attribute,e=>i({...r,attribute:e}),t,r.entity,"attribute",o)}
        ${jt("Use Entity Icon",r.use_entity_icon,e=>i({...r,use_entity_icon:e}),"use_entity_icon",o)}
        ${r.use_entity_icon?ne:Ut("Icon",r.icon,e=>i({...r,icon:e}),t,"icon",o)}
        ${Lt("Size",r.size,e=>i({...r,size:e}),"size",o)}
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"info",name:"Info",description:"Display entity name, state, and attributes",category:"content",icon:"mdi:information-outline"}}createDefault(){return{id:dt("info"),type:"info",show_name:!0,show_state:!0,show_unit:!0}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=n?.attributes.friendly_name||i.entity||"No entity",o=n?t.formatEntityState(n):"—";return te`
      <div class="mc-module mc-info">
        ${i.show_name?te`<span class="mc-info-name">${r}</span>`:ne}
        ${i.show_state?te`<span class="mc-info-state">
              ${i.prefix||""}${i.attribute&&n?String(n.attributes[i.attribute]??"—"):o}${i.suffix||""}
            </span>`:ne}
        ${i.secondary_info&&n?te`<span class="mc-info-secondary"
              >${String(n.attributes[i.secondary_info]??"")}</span
            >`:ne}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=e,o=this._buildSyncContext(e,n);return te`
      <div class="mc-tab-content">
        ${Ft("Entity",r.entity,e=>i({...r,entity:e}),t,void 0,"entity",o)}
        ${qt("Attribute",r.attribute,e=>i({...r,attribute:e}),t,r.entity,"attribute",o)}
        ${jt("Show Name",r.show_name,e=>i({...r,show_name:e}),"show_name",o)}
        ${jt("Show State",r.show_state,e=>i({...r,show_state:e}),"show_state",o)}
        ${jt("Show Unit",r.show_unit,e=>i({...r,show_unit:e}),"show_unit",o)}
        ${Lt("Prefix",r.prefix,e=>i({...r,prefix:e}),"prefix",o)}
        ${Lt("Suffix",r.suffix,e=>i({...r,suffix:e}),"suffix",o)}
        ${qt("Secondary Info",r.secondary_info,e=>i({...r,secondary_info:e}),t,r.entity,"secondary_info",o)}
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"image",name:"Image",description:"Display a static image or entity picture",category:"content",icon:"mdi:image"}}createDefault(){return{id:dt("image"),type:"image",image:"",entity_picture:!1,aspect_ratio:"16:9",fit:"cover"}}renderPreview(e,t){const i=e;let n=i.image||"";if(i.entity_picture&&i.entity&&t){const e=t.states[i.entity];e?.attributes.entity_picture&&(n=e.attributes.entity_picture)}const r=i.fit||"cover",o=i.aspect_ratio||"16:9";return te`
      <div
        class="mc-module mc-image"
        style="aspect-ratio: ${o.replace(":","/")};"
      >
        ${n?te`<img
              src=${n}
              style="object-fit: ${r};"
              alt=""
            />`:te`<div class="mc-image-fallback">
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=e,o=this._buildSyncContext(e,n);return te`
      <div class="mc-tab-content">
        ${Ft("Entity",r.entity,e=>i({...r,entity:e}),t,void 0,"entity",o)}
        ${qt("Attribute",r.attribute,e=>i({...r,attribute:e}),t,r.entity,"attribute",o)}
        ${jt("Use Entity Picture",r.entity_picture,e=>i({...r,entity_picture:e}),"entity_picture",o)}
        ${r.entity_picture?ne:Vt("Image URL",r.image,e=>i({...r,image:e}),t,"image","image",o)}
        ${Lt("Aspect Ratio",r.aspect_ratio,e=>i({...r,aspect_ratio:e}),"aspect_ratio",o)}
        ${Nt("Fit",r.fit,[{label:"Cover",value:"cover"},{label:"Contain",value:"contain"},{label:"Fill",value:"fill"},{label:"None",value:"none"}],e=>i({...r,fit:e}),"fit",o)}
      </div>
    `}validate(e){const t=[],i=e;return i.image||i.entity_picture||t.push("An image URL or entity picture source is required"),i.entity_picture&&!i.entity&&t.push("Entity is required when using entity picture"),t}});const Li=2,Di=e=>(...t)=>({_$litDirective$:e,values:t});class Oi{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}class Ni extends Oi{constructor(e){if(super(e),this.it=ne,e.type!==Li)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===ne||null==e)return this._t=void 0,this.it=e;if(e===ie)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}Ni.directiveName="unsafeHTML",Ni.resultType=1;const ji=Di(Ni);function Fi(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}let Bi={async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null};function Hi(e){Bi=e}const Gi=/[&<>"']/,Ui=new RegExp(Gi.source,"g"),Vi=/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,qi=new RegExp(Vi.source,"g"),Wi={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},Qi=e=>Wi[e];function Yi(e,t){if(t){if(Gi.test(e))return e.replace(Ui,Qi)}else if(Vi.test(e))return e.replace(qi,Qi);return e}const Xi=/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;function Ki(e){return e.replace(Xi,(e,t)=>"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):"")}const Zi=/(^|[^\[])\^/g;function Ji(e,t){let i="string"==typeof e?e:e.source;t=t||"";const n={replace:(e,t)=>{let r="string"==typeof t?t:t.source;return r=r.replace(Zi,"$1"),i=i.replace(e,r),n},getRegex:()=>new RegExp(i,t)};return n}function en(e){try{e=encodeURI(e).replace(/%25/g,"%")}catch(e){return null}return e}const tn={exec:()=>null};function nn(e,t){const i=e.replace(/\|/g,(e,t,i)=>{let n=!1,r=t;for(;--r>=0&&"\\"===i[r];)n=!n;return n?"|":" |"}),n=i.split(/ \|/);let r=0;if(n[0].trim()||n.shift(),n.length>0&&!n[n.length-1].trim()&&n.pop(),t)if(n.length>t)n.splice(t);else for(;n.length<t;)n.push("");for(;r<n.length;r++)n[r]=n[r].trim().replace(/\\\|/g,"|");return n}function rn(e,t,i){const n=e.length;if(0===n)return"";let r=0;for(;r<n;){const o=e.charAt(n-r-1);if(o!==t||i){if(o===t||!i)break;r++}else r++}return e.slice(0,n-r)}function on(e,t,i,n){const r=t.href,o=t.title?Yi(t.title):null,a=e[1].replace(/\\([\[\]])/g,"$1");if("!"!==e[0].charAt(0)){n.state.inLink=!0;const e={type:"link",raw:i,href:r,title:o,text:a,tokens:n.inlineTokens(a)};return n.state.inLink=!1,e}return{type:"image",raw:i,href:r,title:o,text:Yi(a)}}class an{options;rules;lexer;constructor(e){this.options=e||Bi}space(e){const t=this.rules.block.newline.exec(e);if(t&&t[0].length>0)return{type:"space",raw:t[0]}}code(e){const t=this.rules.block.code.exec(e);if(t){const e=t[0].replace(/^ {1,4}/gm,"");return{type:"code",raw:t[0],codeBlockStyle:"indented",text:this.options.pedantic?e:rn(e,"\n")}}}fences(e){const t=this.rules.block.fences.exec(e);if(t){const e=t[0],i=function(e,t){const i=e.match(/^(\s+)(?:```)/);if(null===i)return t;const n=i[1];return t.split("\n").map(e=>{const t=e.match(/^\s+/);if(null===t)return e;const[i]=t;return i.length>=n.length?e.slice(n.length):e}).join("\n")}(e,t[3]||"");return{type:"code",raw:e,lang:t[2]?t[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):t[2],text:i}}}heading(e){const t=this.rules.block.heading.exec(e);if(t){let e=t[2].trim();if(/#$/.test(e)){const t=rn(e,"#");this.options.pedantic?e=t.trim():t&&!/ $/.test(t)||(e=t.trim())}return{type:"heading",raw:t[0],depth:t[1].length,text:e,tokens:this.lexer.inline(e)}}}hr(e){const t=this.rules.block.hr.exec(e);if(t)return{type:"hr",raw:t[0]}}blockquote(e){const t=this.rules.block.blockquote.exec(e);if(t){let e=t[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,"\n    $1");e=rn(e.replace(/^ *>[ \t]?/gm,""),"\n");const i=this.lexer.state.top;this.lexer.state.top=!0;const n=this.lexer.blockTokens(e);return this.lexer.state.top=i,{type:"blockquote",raw:t[0],tokens:n,text:e}}}list(e){let t=this.rules.block.list.exec(e);if(t){let i=t[1].trim();const n=i.length>1,r={type:"list",raw:"",ordered:n,start:n?+i.slice(0,-1):"",loose:!1,items:[]};i=n?`\\d{1,9}\\${i.slice(-1)}`:`\\${i}`,this.options.pedantic&&(i=n?i:"[*+-]");const o=new RegExp(`^( {0,3}${i})((?:[\t ][^\\n]*)?(?:\\n|$))`);let a="",s="",l=!1;for(;e;){let i=!1;if(!(t=o.exec(e)))break;if(this.rules.block.hr.test(e))break;a=t[0],e=e.substring(a.length);let n=t[2].split("\n",1)[0].replace(/^\t+/,e=>" ".repeat(3*e.length)),c=e.split("\n",1)[0],d=0;this.options.pedantic?(d=2,s=n.trimStart()):(d=t[2].search(/[^ ]/),d=d>4?1:d,s=n.slice(d),d+=t[1].length);let p=!1;if(!n&&/^ *$/.test(c)&&(a+=c+"\n",e=e.substring(c.length+1),i=!0),!i){const t=new RegExp(`^ {0,${Math.min(3,d-1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))`),i=new RegExp(`^ {0,${Math.min(3,d-1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`),r=new RegExp(`^ {0,${Math.min(3,d-1)}}(?:\`\`\`|~~~)`),o=new RegExp(`^ {0,${Math.min(3,d-1)}}#`);for(;e;){const l=e.split("\n",1)[0];if(c=l,this.options.pedantic&&(c=c.replace(/^ {1,4}(?=( {4})*[^ ])/g,"  ")),r.test(c))break;if(o.test(c))break;if(t.test(c))break;if(i.test(e))break;if(c.search(/[^ ]/)>=d||!c.trim())s+="\n"+c.slice(d);else{if(p)break;if(n.search(/[^ ]/)>=4)break;if(r.test(n))break;if(o.test(n))break;if(i.test(n))break;s+="\n"+c}p||c.trim()||(p=!0),a+=l+"\n",e=e.substring(l.length+1),n=c.slice(d)}}r.loose||(l?r.loose=!0:/\n *\n *$/.test(a)&&(l=!0));let u,m=null;this.options.gfm&&(m=/^\[[ xX]\] /.exec(s),m&&(u="[ ] "!==m[0],s=s.replace(/^\[[ xX]\] +/,""))),r.items.push({type:"list_item",raw:a,task:!!m,checked:u,loose:!1,text:s,tokens:[]}),r.raw+=a}r.items[r.items.length-1].raw=a.trimEnd(),r.items[r.items.length-1].text=s.trimEnd(),r.raw=r.raw.trimEnd();for(let e=0;e<r.items.length;e++)if(this.lexer.state.top=!1,r.items[e].tokens=this.lexer.blockTokens(r.items[e].text,[]),!r.loose){const t=r.items[e].tokens.filter(e=>"space"===e.type),i=t.length>0&&t.some(e=>/\n.*\n/.test(e.raw));r.loose=i}if(r.loose)for(let e=0;e<r.items.length;e++)r.items[e].loose=!0;return r}}html(e){const t=this.rules.block.html.exec(e);if(t){return{type:"html",block:!0,raw:t[0],pre:"pre"===t[1]||"script"===t[1]||"style"===t[1],text:t[0]}}}def(e){const t=this.rules.block.def.exec(e);if(t){const e=t[1].toLowerCase().replace(/\s+/g," "),i=t[2]?t[2].replace(/^<(.*)>$/,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",n=t[3]?t[3].substring(1,t[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):t[3];return{type:"def",tag:e,raw:t[0],href:i,title:n}}}table(e){const t=this.rules.block.table.exec(e);if(!t)return;if(!/[:|]/.test(t[2]))return;const i=nn(t[1]),n=t[2].replace(/^\||\| *$/g,"").split("|"),r=t[3]&&t[3].trim()?t[3].replace(/\n[ \t]*$/,"").split("\n"):[],o={type:"table",raw:t[0],header:[],align:[],rows:[]};if(i.length===n.length){for(const e of n)/^ *-+: *$/.test(e)?o.align.push("right"):/^ *:-+: *$/.test(e)?o.align.push("center"):/^ *:-+ *$/.test(e)?o.align.push("left"):o.align.push(null);for(const e of i)o.header.push({text:e,tokens:this.lexer.inline(e)});for(const e of r)o.rows.push(nn(e,o.header.length).map(e=>({text:e,tokens:this.lexer.inline(e)})));return o}}lheading(e){const t=this.rules.block.lheading.exec(e);if(t)return{type:"heading",raw:t[0],depth:"="===t[2].charAt(0)?1:2,text:t[1],tokens:this.lexer.inline(t[1])}}paragraph(e){const t=this.rules.block.paragraph.exec(e);if(t){const e="\n"===t[1].charAt(t[1].length-1)?t[1].slice(0,-1):t[1];return{type:"paragraph",raw:t[0],text:e,tokens:this.lexer.inline(e)}}}text(e){const t=this.rules.block.text.exec(e);if(t)return{type:"text",raw:t[0],text:t[0],tokens:this.lexer.inline(t[0])}}escape(e){const t=this.rules.inline.escape.exec(e);if(t)return{type:"escape",raw:t[0],text:Yi(t[1])}}tag(e){const t=this.rules.inline.tag.exec(e);if(t)return!this.lexer.state.inLink&&/^<a /i.test(t[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&/^<\/a>/i.test(t[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(t[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:t[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:t[0]}}link(e){const t=this.rules.inline.link.exec(e);if(t){const e=t[2].trim();if(!this.options.pedantic&&/^</.test(e)){if(!/>$/.test(e))return;const t=rn(e.slice(0,-1),"\\");if((e.length-t.length)%2==0)return}else{const e=function(e,t){if(-1===e.indexOf(t[1]))return-1;let i=0;for(let n=0;n<e.length;n++)if("\\"===e[n])n++;else if(e[n]===t[0])i++;else if(e[n]===t[1]&&(i--,i<0))return n;return-1}(t[2],"()");if(e>-1){const i=(0===t[0].indexOf("!")?5:4)+t[1].length+e;t[2]=t[2].substring(0,e),t[0]=t[0].substring(0,i).trim(),t[3]=""}}let i=t[2],n="";if(this.options.pedantic){const e=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(i);e&&(i=e[1],n=e[3])}else n=t[3]?t[3].slice(1,-1):"";return i=i.trim(),/^</.test(i)&&(i=this.options.pedantic&&!/>$/.test(e)?i.slice(1):i.slice(1,-1)),on(t,{href:i?i.replace(this.rules.inline.anyPunctuation,"$1"):i,title:n?n.replace(this.rules.inline.anyPunctuation,"$1"):n},t[0],this.lexer)}}reflink(e,t){let i;if((i=this.rules.inline.reflink.exec(e))||(i=this.rules.inline.nolink.exec(e))){const e=t[(i[2]||i[1]).replace(/\s+/g," ").toLowerCase()];if(!e){const e=i[0].charAt(0);return{type:"text",raw:e,text:e}}return on(i,e,i[0],this.lexer)}}emStrong(e,t,i=""){let n=this.rules.inline.emStrongLDelim.exec(e);if(!n)return;if(n[3]&&i.match(/[\p{L}\p{N}]/u))return;if(!(n[1]||n[2]||"")||!i||this.rules.inline.punctuation.exec(i)){const i=[...n[0]].length-1;let r,o,a=i,s=0;const l="*"===n[0][0]?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(l.lastIndex=0,t=t.slice(-1*e.length+i);null!=(n=l.exec(t));){if(r=n[1]||n[2]||n[3]||n[4]||n[5]||n[6],!r)continue;if(o=[...r].length,n[3]||n[4]){a+=o;continue}if((n[5]||n[6])&&i%3&&!((i+o)%3)){s+=o;continue}if(a-=o,a>0)continue;o=Math.min(o,o+a+s);const t=[...n[0]][0].length,l=e.slice(0,i+n.index+t+o);if(Math.min(i,o)%2){const e=l.slice(1,-1);return{type:"em",raw:l,text:e,tokens:this.lexer.inlineTokens(e)}}const c=l.slice(2,-2);return{type:"strong",raw:l,text:c,tokens:this.lexer.inlineTokens(c)}}}}codespan(e){const t=this.rules.inline.code.exec(e);if(t){let e=t[2].replace(/\n/g," ");const i=/[^ ]/.test(e),n=/^ /.test(e)&&/ $/.test(e);return i&&n&&(e=e.substring(1,e.length-1)),e=Yi(e,!0),{type:"codespan",raw:t[0],text:e}}}br(e){const t=this.rules.inline.br.exec(e);if(t)return{type:"br",raw:t[0]}}del(e){const t=this.rules.inline.del.exec(e);if(t)return{type:"del",raw:t[0],text:t[2],tokens:this.lexer.inlineTokens(t[2])}}autolink(e){const t=this.rules.inline.autolink.exec(e);if(t){let e,i;return"@"===t[2]?(e=Yi(t[1]),i="mailto:"+e):(e=Yi(t[1]),i=e),{type:"link",raw:t[0],text:e,href:i,tokens:[{type:"text",raw:e,text:e}]}}}url(e){let t;if(t=this.rules.inline.url.exec(e)){let e,i;if("@"===t[2])e=Yi(t[0]),i="mailto:"+e;else{let n;do{n=t[0],t[0]=this.rules.inline._backpedal.exec(t[0])?.[0]??""}while(n!==t[0]);e=Yi(t[0]),i="www."===t[1]?"http://"+t[0]:t[0]}return{type:"link",raw:t[0],text:e,href:i,tokens:[{type:"text",raw:e,text:e}]}}}inlineText(e){const t=this.rules.inline.text.exec(e);if(t){let e;return e=this.lexer.state.inRawBlock?t[0]:Yi(t[0]),{type:"text",raw:t[0],text:e}}}}const sn=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,ln=/(?:[*+-]|\d{1,9}[.)])/,cn=Ji(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g,ln).replace(/blockCode/g,/ {4}/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).getRegex(),dn=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,pn=/(?!\s*\])(?:\\.|[^\[\]\\])+/,un=Ji(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label",pn).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),mn=Ji(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g,ln).getRegex(),hn="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",gn=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,vn=Ji("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))","i").replace("comment",gn).replace("tag",hn).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),fn=Ji(dn).replace("hr",sn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",hn).getRegex(),bn={blockquote:Ji(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",fn).getRegex(),code:/^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,def:un,fences:/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,heading:/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,hr:sn,html:vn,lheading:cn,list:mn,newline:/^(?: *(?:\n|$))+/,paragraph:fn,table:tn,text:/^[^\n]+/},yn=Ji("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",sn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code"," {4}[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",hn).getRegex(),xn={...bn,table:yn,paragraph:Ji(dn).replace("hr",sn).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",yn).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)]) ").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",hn).getRegex()},_n={...bn,html:Ji("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",gn).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:tn,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:Ji(dn).replace("hr",sn).replace("heading"," *#{1,6} *[^\n]").replace("lheading",cn).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},wn=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,kn=/^( {2,}|\\)\n(?!\s*$)/,$n="\\p{P}\\p{S}",Sn=Ji(/^((?![*_])[\spunctuation])/,"u").replace(/punctuation/g,$n).getRegex(),Cn=Ji(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/,"u").replace(/punct/g,$n).getRegex(),Tn=Ji("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])","gu").replace(/punct/g,$n).getRegex(),Mn=Ji("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])","gu").replace(/punct/g,$n).getRegex(),zn=Ji(/\\([punct])/,"gu").replace(/punct/g,$n).getRegex(),An=Ji(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),En=Ji(gn).replace("(?:--\x3e|$)","--\x3e").getRegex(),Pn=Ji("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",En).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),In=/(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/,Rn=Ji(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label",In).replace("href",/<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Ln=Ji(/^!?\[(label)\]\[(ref)\]/).replace("label",In).replace("ref",pn).getRegex(),Dn=Ji(/^!?\[(ref)\](?:\[\])?/).replace("ref",pn).getRegex(),On={_backpedal:tn,anyPunctuation:zn,autolink:An,blockSkip:/\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g,br:kn,code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,del:tn,emStrongLDelim:Cn,emStrongRDelimAst:Tn,emStrongRDelimUnd:Mn,escape:wn,link:Rn,nolink:Dn,punctuation:Sn,reflink:Ln,reflinkSearch:Ji("reflink|nolink(?!\\()","g").replace("reflink",Ln).replace("nolink",Dn).getRegex(),tag:Pn,text:/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,url:tn},Nn={...On,link:Ji(/^!?\[(label)\]\((.*?)\)/).replace("label",In).getRegex(),reflink:Ji(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",In).getRegex()},jn={...On,escape:Ji(wn).replace("])","~|])").getRegex(),url:Ji(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,"i").replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,text:/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/},Fn={...jn,br:Ji(kn).replace("{2,}","*").getRegex(),text:Ji(jn.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Bn={normal:bn,gfm:xn,pedantic:_n},Hn={normal:On,gfm:jn,breaks:Fn,pedantic:Nn};class Gn{tokens;options;state;tokenizer;inlineQueue;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||Bi,this.options.tokenizer=this.options.tokenizer||new an,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};const t={block:Bn.normal,inline:Hn.normal};this.options.pedantic?(t.block=Bn.pedantic,t.inline=Hn.pedantic):this.options.gfm&&(t.block=Bn.gfm,this.options.breaks?t.inline=Hn.breaks:t.inline=Hn.gfm),this.tokenizer.rules=t}static get rules(){return{block:Bn,inline:Hn}}static lex(e,t){return new Gn(t).lex(e)}static lexInline(e,t){return new Gn(t).inlineTokens(e)}lex(e){e=e.replace(/\r\n|\r/g,"\n"),this.blockTokens(e,this.tokens);for(let e=0;e<this.inlineQueue.length;e++){const t=this.inlineQueue[e];this.inlineTokens(t.src,t.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[]){let i,n,r,o;for(e=this.options.pedantic?e.replace(/\t/g,"    ").replace(/^ +$/gm,""):e.replace(/^( *)(\t+)/gm,(e,t,i)=>t+"    ".repeat(i.length));e;)if(!(this.options.extensions&&this.options.extensions.block&&this.options.extensions.block.some(n=>!!(i=n.call({lexer:this},e,t))&&(e=e.substring(i.raw.length),t.push(i),!0))))if(i=this.tokenizer.space(e))e=e.substring(i.raw.length),1===i.raw.length&&t.length>0?t[t.length-1].raw+="\n":t.push(i);else if(i=this.tokenizer.code(e))e=e.substring(i.raw.length),n=t[t.length-1],!n||"paragraph"!==n.type&&"text"!==n.type?t.push(i):(n.raw+="\n"+i.raw,n.text+="\n"+i.text,this.inlineQueue[this.inlineQueue.length-1].src=n.text);else if(i=this.tokenizer.fences(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.heading(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.hr(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.blockquote(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.list(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.html(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.def(e))e=e.substring(i.raw.length),n=t[t.length-1],!n||"paragraph"!==n.type&&"text"!==n.type?this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title}):(n.raw+="\n"+i.raw,n.text+="\n"+i.raw,this.inlineQueue[this.inlineQueue.length-1].src=n.text);else if(i=this.tokenizer.table(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.lheading(e))e=e.substring(i.raw.length),t.push(i);else{if(r=e,this.options.extensions&&this.options.extensions.startBlock){let t=1/0;const i=e.slice(1);let n;this.options.extensions.startBlock.forEach(e=>{n=e.call({lexer:this},i),"number"==typeof n&&n>=0&&(t=Math.min(t,n))}),t<1/0&&t>=0&&(r=e.substring(0,t+1))}if(this.state.top&&(i=this.tokenizer.paragraph(r)))n=t[t.length-1],o&&"paragraph"===n.type?(n.raw+="\n"+i.raw,n.text+="\n"+i.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=n.text):t.push(i),o=r.length!==e.length,e=e.substring(i.raw.length);else if(i=this.tokenizer.text(e))e=e.substring(i.raw.length),n=t[t.length-1],n&&"text"===n.type?(n.raw+="\n"+i.raw,n.text+="\n"+i.text,this.inlineQueue.pop(),this.inlineQueue[this.inlineQueue.length-1].src=n.text):t.push(i);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){let i,n,r,o,a,s,l=e;if(this.tokens.links){const e=Object.keys(this.tokens.links);if(e.length>0)for(;null!=(o=this.tokenizer.rules.inline.reflinkSearch.exec(l));)e.includes(o[0].slice(o[0].lastIndexOf("[")+1,-1))&&(l=l.slice(0,o.index)+"["+"a".repeat(o[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex))}for(;null!=(o=this.tokenizer.rules.inline.blockSkip.exec(l));)l=l.slice(0,o.index)+"["+"a".repeat(o[0].length-2)+"]"+l.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);for(;null!=(o=this.tokenizer.rules.inline.anyPunctuation.exec(l));)l=l.slice(0,o.index)+"++"+l.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);for(;e;)if(a||(s=""),a=!1,!(this.options.extensions&&this.options.extensions.inline&&this.options.extensions.inline.some(n=>!!(i=n.call({lexer:this},e,t))&&(e=e.substring(i.raw.length),t.push(i),!0))))if(i=this.tokenizer.escape(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.tag(e))e=e.substring(i.raw.length),n=t[t.length-1],n&&"text"===i.type&&"text"===n.type?(n.raw+=i.raw,n.text+=i.text):t.push(i);else if(i=this.tokenizer.link(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.reflink(e,this.tokens.links))e=e.substring(i.raw.length),n=t[t.length-1],n&&"text"===i.type&&"text"===n.type?(n.raw+=i.raw,n.text+=i.text):t.push(i);else if(i=this.tokenizer.emStrong(e,l,s))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.codespan(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.br(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.del(e))e=e.substring(i.raw.length),t.push(i);else if(i=this.tokenizer.autolink(e))e=e.substring(i.raw.length),t.push(i);else if(this.state.inLink||!(i=this.tokenizer.url(e))){if(r=e,this.options.extensions&&this.options.extensions.startInline){let t=1/0;const i=e.slice(1);let n;this.options.extensions.startInline.forEach(e=>{n=e.call({lexer:this},i),"number"==typeof n&&n>=0&&(t=Math.min(t,n))}),t<1/0&&t>=0&&(r=e.substring(0,t+1))}if(i=this.tokenizer.inlineText(r))e=e.substring(i.raw.length),"_"!==i.raw.slice(-1)&&(s=i.raw.slice(-1)),a=!0,n=t[t.length-1],n&&"text"===n.type?(n.raw+=i.raw,n.text+=i.text):t.push(i);else if(e){const t="Infinite loop on byte: "+e.charCodeAt(0);if(this.options.silent){console.error(t);break}throw new Error(t)}}else e=e.substring(i.raw.length),t.push(i);return t}}class Un{options;constructor(e){this.options=e||Bi}code(e,t,i){const n=(t||"").match(/^\S*/)?.[0];return e=e.replace(/\n$/,"")+"\n",n?'<pre><code class="language-'+Yi(n)+'">'+(i?e:Yi(e,!0))+"</code></pre>\n":"<pre><code>"+(i?e:Yi(e,!0))+"</code></pre>\n"}blockquote(e){return`<blockquote>\n${e}</blockquote>\n`}html(e,t){return e}heading(e,t,i){return`<h${t}>${e}</h${t}>\n`}hr(){return"<hr>\n"}list(e,t,i){const n=t?"ol":"ul";return"<"+n+(t&&1!==i?' start="'+i+'"':"")+">\n"+e+"</"+n+">\n"}listitem(e,t,i){return`<li>${e}</li>\n`}checkbox(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox">'}paragraph(e){return`<p>${e}</p>\n`}table(e,t){return t&&(t=`<tbody>${t}</tbody>`),"<table>\n<thead>\n"+e+"</thead>\n"+t+"</table>\n"}tablerow(e){return`<tr>\n${e}</tr>\n`}tablecell(e,t){const i=t.header?"th":"td";return(t.align?`<${i} align="${t.align}">`:`<${i}>`)+e+`</${i}>\n`}strong(e){return`<strong>${e}</strong>`}em(e){return`<em>${e}</em>`}codespan(e){return`<code>${e}</code>`}br(){return"<br>"}del(e){return`<del>${e}</del>`}link(e,t,i){const n=en(e);if(null===n)return i;let r='<a href="'+(e=n)+'"';return t&&(r+=' title="'+t+'"'),r+=">"+i+"</a>",r}image(e,t,i){const n=en(e);if(null===n)return i;let r=`<img src="${e=n}" alt="${i}"`;return t&&(r+=` title="${t}"`),r+=">",r}text(e){return e}}class Vn{strong(e){return e}em(e){return e}codespan(e){return e}del(e){return e}html(e){return e}text(e){return e}link(e,t,i){return""+i}image(e,t,i){return""+i}br(){return""}}class qn{options;renderer;textRenderer;constructor(e){this.options=e||Bi,this.options.renderer=this.options.renderer||new Un,this.renderer=this.options.renderer,this.renderer.options=this.options,this.textRenderer=new Vn}static parse(e,t){return new qn(t).parse(e)}static parseInline(e,t){return new qn(t).parseInline(e)}parse(e,t=!0){let i="";for(let n=0;n<e.length;n++){const r=e[n];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[r.type]){const e=r,t=this.options.extensions.renderers[e.type].call({parser:this},e);if(!1!==t||!["space","hr","heading","code","table","blockquote","list","html","paragraph","text"].includes(e.type)){i+=t||"";continue}}switch(r.type){case"space":continue;case"hr":i+=this.renderer.hr();continue;case"heading":{const e=r;i+=this.renderer.heading(this.parseInline(e.tokens),e.depth,Ki(this.parseInline(e.tokens,this.textRenderer)));continue}case"code":{const e=r;i+=this.renderer.code(e.text,e.lang,!!e.escaped);continue}case"table":{const e=r;let t="",n="";for(let t=0;t<e.header.length;t++)n+=this.renderer.tablecell(this.parseInline(e.header[t].tokens),{header:!0,align:e.align[t]});t+=this.renderer.tablerow(n);let o="";for(let t=0;t<e.rows.length;t++){const i=e.rows[t];n="";for(let t=0;t<i.length;t++)n+=this.renderer.tablecell(this.parseInline(i[t].tokens),{header:!1,align:e.align[t]});o+=this.renderer.tablerow(n)}i+=this.renderer.table(t,o);continue}case"blockquote":{const e=r,t=this.parse(e.tokens);i+=this.renderer.blockquote(t);continue}case"list":{const e=r,t=e.ordered,n=e.start,o=e.loose;let a="";for(let t=0;t<e.items.length;t++){const i=e.items[t],n=i.checked,r=i.task;let s="";if(i.task){const e=this.renderer.checkbox(!!n);o?i.tokens.length>0&&"paragraph"===i.tokens[0].type?(i.tokens[0].text=e+" "+i.tokens[0].text,i.tokens[0].tokens&&i.tokens[0].tokens.length>0&&"text"===i.tokens[0].tokens[0].type&&(i.tokens[0].tokens[0].text=e+" "+i.tokens[0].tokens[0].text)):i.tokens.unshift({type:"text",text:e+" "}):s+=e+" "}s+=this.parse(i.tokens,o),a+=this.renderer.listitem(s,r,!!n)}i+=this.renderer.list(a,t,n);continue}case"html":{const e=r;i+=this.renderer.html(e.text,e.block);continue}case"paragraph":{const e=r;i+=this.renderer.paragraph(this.parseInline(e.tokens));continue}case"text":{let o=r,a=o.tokens?this.parseInline(o.tokens):o.text;for(;n+1<e.length&&"text"===e[n+1].type;)o=e[++n],a+="\n"+(o.tokens?this.parseInline(o.tokens):o.text);i+=t?this.renderer.paragraph(a):a;continue}default:{const e='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(e),"";throw new Error(e)}}}return i}parseInline(e,t){t=t||this.renderer;let i="";for(let n=0;n<e.length;n++){const r=e[n];if(this.options.extensions&&this.options.extensions.renderers&&this.options.extensions.renderers[r.type]){const e=this.options.extensions.renderers[r.type].call({parser:this},r);if(!1!==e||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(r.type)){i+=e||"";continue}}switch(r.type){case"escape":{const e=r;i+=t.text(e.text);break}case"html":{const e=r;i+=t.html(e.text);break}case"link":{const e=r;i+=t.link(e.href,e.title,this.parseInline(e.tokens,t));break}case"image":{const e=r;i+=t.image(e.href,e.title,e.text);break}case"strong":{const e=r;i+=t.strong(this.parseInline(e.tokens,t));break}case"em":{const e=r;i+=t.em(this.parseInline(e.tokens,t));break}case"codespan":{const e=r;i+=t.codespan(e.text);break}case"br":i+=t.br();break;case"del":{const e=r;i+=t.del(this.parseInline(e.tokens,t));break}case"text":{const e=r;i+=t.text(e.text);break}default:{const e='Token with "'+r.type+'" type was not found.';if(this.options.silent)return console.error(e),"";throw new Error(e)}}}return i}}class Wn{options;constructor(e){this.options=e||Bi}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(e){return e}postprocess(e){return e}processAllTokens(e){return e}}const Qn=new class{defaults={async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null};options=this.setOptions;parse=this.#e(Gn.lex,qn.parse);parseInline=this.#e(Gn.lexInline,qn.parseInline);Parser=qn;Renderer=Un;TextRenderer=Vn;Lexer=Gn;Tokenizer=an;Hooks=Wn;constructor(...e){this.use(...e)}walkTokens(e,t){let i=[];for(const n of e)switch(i=i.concat(t.call(this,n)),n.type){case"table":{const e=n;for(const n of e.header)i=i.concat(this.walkTokens(n.tokens,t));for(const n of e.rows)for(const e of n)i=i.concat(this.walkTokens(e.tokens,t));break}case"list":{const e=n;i=i.concat(this.walkTokens(e.items,t));break}default:{const e=n;this.defaults.extensions?.childTokens?.[e.type]?this.defaults.extensions.childTokens[e.type].forEach(n=>{const r=e[n].flat(1/0);i=i.concat(this.walkTokens(r,t))}):e.tokens&&(i=i.concat(this.walkTokens(e.tokens,t)))}}return i}use(...e){const t=this.defaults.extensions||{renderers:{},childTokens:{}};return e.forEach(e=>{const i={...e};if(i.async=this.defaults.async||i.async||!1,e.extensions&&(e.extensions.forEach(e=>{if(!e.name)throw new Error("extension name required");if("renderer"in e){const i=t.renderers[e.name];t.renderers[e.name]=i?function(...t){let n=e.renderer.apply(this,t);return!1===n&&(n=i.apply(this,t)),n}:e.renderer}if("tokenizer"in e){if(!e.level||"block"!==e.level&&"inline"!==e.level)throw new Error("extension level must be 'block' or 'inline'");const i=t[e.level];i?i.unshift(e.tokenizer):t[e.level]=[e.tokenizer],e.start&&("block"===e.level?t.startBlock?t.startBlock.push(e.start):t.startBlock=[e.start]:"inline"===e.level&&(t.startInline?t.startInline.push(e.start):t.startInline=[e.start]))}"childTokens"in e&&e.childTokens&&(t.childTokens[e.name]=e.childTokens)}),i.extensions=t),e.renderer){const t=this.defaults.renderer||new Un(this.defaults);for(const i in e.renderer){if(!(i in t))throw new Error(`renderer '${i}' does not exist`);if("options"===i)continue;const n=i,r=e.renderer[n],o=t[n];t[n]=(...e)=>{let i=r.apply(t,e);return!1===i&&(i=o.apply(t,e)),i||""}}i.renderer=t}if(e.tokenizer){const t=this.defaults.tokenizer||new an(this.defaults);for(const i in e.tokenizer){if(!(i in t))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;const n=i,r=e.tokenizer[n],o=t[n];t[n]=(...e)=>{let i=r.apply(t,e);return!1===i&&(i=o.apply(t,e)),i}}i.tokenizer=t}if(e.hooks){const t=this.defaults.hooks||new Wn;for(const i in e.hooks){if(!(i in t))throw new Error(`hook '${i}' does not exist`);if("options"===i)continue;const n=i,r=e.hooks[n],o=t[n];Wn.passThroughHooks.has(i)?t[n]=e=>{if(this.defaults.async)return Promise.resolve(r.call(t,e)).then(e=>o.call(t,e));const i=r.call(t,e);return o.call(t,i)}:t[n]=(...e)=>{let i=r.apply(t,e);return!1===i&&(i=o.apply(t,e)),i}}i.hooks=t}if(e.walkTokens){const t=this.defaults.walkTokens,n=e.walkTokens;i.walkTokens=function(e){let i=[];return i.push(n.call(this,e)),t&&(i=i.concat(t.call(this,e))),i}}this.defaults={...this.defaults,...i}}),this}setOptions(e){return this.defaults={...this.defaults,...e},this}lexer(e,t){return Gn.lex(e,t??this.defaults)}parser(e,t){return qn.parse(e,t??this.defaults)}#e(e,t){return(i,n)=>{const r={...n},o={...this.defaults,...r};!0===this.defaults.async&&!1===r.async&&(o.silent||console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."),o.async=!0);const a=this.#t(!!o.silent,!!o.async);if(null==i)return a(new Error("marked(): input parameter is undefined or null"));if("string"!=typeof i)return a(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(i)+", string expected"));if(o.hooks&&(o.hooks.options=o),o.async)return Promise.resolve(o.hooks?o.hooks.preprocess(i):i).then(t=>e(t,o)).then(e=>o.hooks?o.hooks.processAllTokens(e):e).then(e=>o.walkTokens?Promise.all(this.walkTokens(e,o.walkTokens)).then(()=>e):e).then(e=>t(e,o)).then(e=>o.hooks?o.hooks.postprocess(e):e).catch(a);try{o.hooks&&(i=o.hooks.preprocess(i));let n=e(i,o);o.hooks&&(n=o.hooks.processAllTokens(n)),o.walkTokens&&this.walkTokens(n,o.walkTokens);let r=t(n,o);return o.hooks&&(r=o.hooks.postprocess(r)),r}catch(e){return a(e)}}}#t(e,t){return i=>{if(i.message+="\nPlease report this to https://github.com/markedjs/marked.",e){const e="<p>An error occurred:</p><pre>"+Yi(i.message+"",!0)+"</pre>";return t?Promise.resolve(e):e}if(t)return Promise.reject(i);throw i}}};function Yn(e,t){return Qn.parse(e,t)}Yn.options=Yn.setOptions=function(e){return Qn.setOptions(e),Yn.defaults=Qn.defaults,Hi(Yn.defaults),Yn},Yn.getDefaults=Fi,Yn.defaults=Bi,Yn.use=function(...e){return Qn.use(...e),Yn.defaults=Qn.defaults,Hi(Yn.defaults),Yn},Yn.walkTokens=function(e,t){return Qn.walkTokens(e,t)},Yn.parseInline=Qn.parseInline,Yn.Parser=qn,Yn.parser=qn.parse,Yn.Renderer=Un,Yn.TextRenderer=Vn,Yn.Lexer=Gn,Yn.lexer=Gn.lex,Yn.Tokenizer=an,Yn.Hooks=Wn,Yn.parse=Yn;Yn.options,Yn.setOptions,Yn.use,Yn.walkTokens,Yn.parseInline,qn.parse,Gn.lex;Yn.setOptions({breaks:!0,gfm:!0});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"markdown",name:"Markdown",description:"Render markdown-formatted content",category:"content",icon:"mdi:language-markdown"}}createDefault(){return{id:dt("markdown"),type:"markdown",content:"**Hello** _World_"}}_resolveContent(e,t,i,n){if(!t||!i)return e;const r=t.states[i];if(!r)return e;const o=r.state,a=n?String(r.attributes[n]??""):"";return e.replace(/\{\{\s*state\s*\}\}/g,o).replace(/\{\{\s*attribute\s*\}\}/g,a).replace(/\{\{\s*entity\s*\}\}/g,i)}renderPreview(e,t){const i=e,n=this._resolveContent(i.content||"",t,i.entity,i.attribute),r=Yn.parse(n);return te`
      <div class="mc-module mc-markdown">${ji(r)}</div>
    `}renderGeneralTab(e,t,i,n){const r=e,o=this._buildSyncContext(e,n);return te`
      <div class="mc-tab-content">
        ${Dt("Content",r.content,e=>i({...r,content:e}),{rows:6,placeholder:"**Bold**, _italic_, `code`"},"content",o)}
        ${Pt("Supports full Markdown. Use {{ state }}, {{ attribute }}, {{ entity }} for dynamic values.")}
        ${Ft("Entity (for templates)",r.entity,e=>i({...r,entity:e}),t,void 0,"entity",o)}
        ${qt("Attribute",r.attribute,e=>i({...r,attribute:e}),t,r.entity,"attribute",o)}
      </div>
    `}validate(e){const t=[];return e.content||t.push("Markdown content is required"),t}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"bar",name:"Bar",description:"Display a progress bar based on entity state",category:"content",icon:"mdi:chart-bar"}}createDefault(){return{id:dt("bar"),type:"bar",min:0,max:100,bar_height:"8px",bar_color:"var(--primary-color, #03a9f4)",bar_background:"var(--divider-color, #e0e0e0)",show_value:!0,direction:"horizontal"}}renderPreview(e,t){const i=e,n=i.min??0,r=i.max??100,o=i.entity&&t?t.states[i.entity]:void 0,a=o?parseFloat(o.state):n,s=Math.min(Math.max(a,n),r),l=r!==n?(s-n)/(r-n)*100:0;let c=i.bar_color||"var(--primary-color, #03a9f4)";if(i.severity&&i.severity.length>0)for(const e of i.severity)if(s>=e.from&&s<=e.to){c=e.color;break}const d=i.bar_background||"var(--divider-color, #e0e0e0)",p=i.bar_height||"8px";return"vertical"===i.direction?te`
        <div class="mc-module mc-bar mc-bar-vertical">
          ${i.show_value?te`<span class="mc-bar-value">${o?t.formatEntityState(o):"—"}</span>`:ne}
          <div
            class="mc-bar-track"
            style="width: ${p}; height: 100%; background: ${d};"
          >
            <div
              class="mc-bar-fill"
              style="height: ${l}%; background: ${c};"
            ></div>
          </div>
        </div>
      `:te`
      <div class="mc-module mc-bar mc-bar-horizontal">
        <div
          class="mc-bar-track"
          style="height: ${p}; background: ${d};"
        >
          <div
            class="mc-bar-fill"
            style="width: ${l}%; background: ${c};"
          ></div>
        </div>
        ${i.show_value?te`<span class="mc-bar-value">${o?t.formatEntityState(o):"—"}</span>`:ne}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=e,o=this._buildSyncContext(e,n);return te`
      <div class="mc-tab-content">
        ${Ft("Entity",r.entity,e=>i({...r,entity:e}),t,void 0,"entity",o)}
        ${qt("Attribute",r.attribute,e=>i({...r,attribute:e}),t,r.entity,"attribute",o)}
        ${Ot("Min",r.min,e=>i({...r,min:e}),void 0,"min",o)}
        ${Ot("Max",r.max,e=>i({...r,max:e}),void 0,"max",o)}
        ${Lt("Bar Height",r.bar_height,e=>i({...r,bar_height:e}),"bar_height",o)}
        ${Bt("Bar Color",r.bar_color,e=>i({...r,bar_color:e}),"bar_color",o)}
        ${Bt("Bar Background",r.bar_background,e=>i({...r,bar_background:e}),"bar_background",o)}
        ${jt("Show Value",r.show_value,e=>i({...r,show_value:e}),"show_value",o)}
        ${Nt("Direction",r.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...r,direction:e}),"direction",o)}
      </div>
    `}validate(e){const t=[],i=e;return i.entity||t.push("Entity is required for bar module"),void 0!==i.min&&void 0!==i.max&&i.min>=i.max&&t.push("Min must be less than max"),t}});const Xn=new Map,Kn=new Set;Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"graphs",name:"Graph",description:"Display entity history as a line graph",category:"content",icon:"mdi:chart-line"}}createDefault(){return{id:dt("graphs"),type:"graphs",hours_to_show:24,points_per_hour:2,line_width:2,fill:!0,show_points:!1,show_labels:!0}}_fetchHistory(e,t,i,n,r){if(Kn.has(t))return;Kn.add(t);const o=new Date,a=new Date(o.getTime()-36e5*n);e.callWS({type:"history/history_during_period",start_time:a.toISOString(),end_time:o.toISOString(),entity_ids:[i],minimal_response:!0,significant_changes_only:!0}).then(e=>{const o=(e[i]||[]).map(e=>{const t=Number(r?e.a?.[r]:e.s);return isNaN(t)?null:t}).filter(e=>null!==e);Xn.set(t,{points:o,timestamp:Date.now(),entityId:i,hours:n})}).catch(e=>{console.warn("magic-card: failed to fetch history for",i,e)}).finally(()=>{Kn.delete(t)})}_buildPath(e,t,i){if(0===e.length)return"";const n=Math.min(...e),r=Math.max(...e)-n||1,o=i-8;return e.map((i,a)=>{const s=1===e.length?t/2:a/(e.length-1)*t,l=4+o-(i-n)/r*o;return`${0===a?"M":"L"}${s.toFixed(1)},${l.toFixed(1)}`}).join(" ")}renderPreview(e,t){const i=e,n=i.line_color||"var(--mc-primary)",r=i.fill_color||"var(--mc-primary)",o=i.hours_to_show||24,a=200,s=60;let l=null;if(i.entity&&t){const e=Xn.get(i.id);(!e||e.entityId!==i.entity||e.hours!==o||Date.now()-e.timestamp>3e5)&&this._fetchHistory(t,i.id,i.entity,o,i.attribute),e&&e.entityId===i.entity&&(l=e.points)}const c=null!==l&&l.length>1,d=c?l:null,p=d?this._buildPath(d,a,s):"M0,50 Q30,30 60,35 T120,20 T200,30",u=d?`${this._buildPath(d,a,s)} L200,60 L0,60 Z`:"M0,50 Q30,30 60,35 T120,20 T200,30 L200,60 L0,60 Z",m=d&&i.show_points?d.map((e,t)=>{const i=Math.min(...d),n=Math.max(...d)-i||1;return{x:1===d.length?100:t/(d.length-1)*a,y:56-(e-i)/n*52}}):[];return te`
      <div class="mc-module mc-graphs">
        <svg viewBox="0 0 ${a} ${s}" preserveAspectRatio="none" style="height: 60px">
          ${i.fill?te`<path d="${u}" fill="${r}" opacity="0.15" />`:""}
          <path d="${p}"
            fill="none" stroke="${n}" stroke-width="${i.line_width||2}" />
          ${i.show_points&&!c?te`
                <circle cx="0" cy="50" r="3" fill="${n}" />
                <circle cx="60" cy="35" r="3" fill="${n}" />
                <circle cx="120" cy="20" r="3" fill="${n}" />
                <circle cx="200" cy="30" r="3" fill="${n}" />
              `:""}
          ${m.map(e=>te`<circle cx="${e.x}" cy="${e.y}" r="3" fill="${n}" />`)}
        </svg>
        ${i.show_labels?te`<div class="mc-graphs-label">
              ${i.entity||"No entity"} &mdash; ${o}h
              ${i.entity?c?"":te` <span style="opacity:0.5">(loading...)</span>`:""}
            </div>`:""}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=e,o=this._buildSyncContext(e,n);return te`
      <div class="mc-tab-content">
        ${Ft("Entity",r.entity,e=>i({...r,entity:e}),t,void 0,"entity",o)}
        ${qt("Attribute",r.attribute,e=>i({...r,attribute:e}),t,r.entity,"attribute",o)}
        ${Ot("Hours to Show",r.hours_to_show,e=>i({...r,hours_to_show:e}),{min:1,max:168},"hours_to_show",o)}
        ${Ot("Points per Hour",r.points_per_hour,e=>i({...r,points_per_hour:e}),{min:1,max:60},"points_per_hour",o)}
        ${Bt("Line Color",r.line_color,e=>i({...r,line_color:e}),"line_color",o)}
        ${Ot("Line Width",r.line_width,e=>i({...r,line_width:e}),{min:1,max:10},"line_width",o)}
        ${jt("Fill",r.fill,e=>i({...r,fill:e}),"fill",o)}
        ${Bt("Fill Color",r.fill_color,e=>i({...r,fill_color:e}),"fill_color",o)}
        ${jt("Show Points",r.show_points,e=>i({...r,show_points:e}),"show_points",o)}
        ${jt("Show Labels",r.show_labels,e=>i({...r,show_labels:e}),"show_labels",o)}
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"camera",name:"Camera",description:"Display a camera entity stream",category:"content",icon:"mdi:cctv"}}createDefault(){return{id:dt("camera"),type:"camera",aspect_ratio:"16:9",show_controls:!0}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=n?.attributes.entity_picture,o=n?.attributes.friendly_name||i.entity||"No camera";return te`
      <div class="mc-module mc-camera" style="aspect-ratio: ${(i.aspect_ratio||"16:9").replace(":","/")}">
        ${r?te`<img src="${r}" alt="${o}" />`:te`<div class="mc-camera-fallback">
              <ha-icon icon="mdi:cctv"></ha-icon>${o}
            </div>`}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=e,o=this._buildSyncContext(e,n);return te`
      <div class="mc-tab-content">
        ${Ft("Camera Entity",r.entity,e=>i({...r,entity:e}),t,"camera","entity",o)}
        ${qt("Attribute",r.attribute,e=>i({...r,attribute:e}),t,r.entity,"attribute",o)}
        ${Lt("Aspect Ratio",r.aspect_ratio,e=>i({...r,aspect_ratio:e}),"aspect_ratio",o)}
        ${jt("Show Controls",r.show_controls,e=>i({...r,show_controls:e}),"show_controls",o)}
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"slider",name:"Slider",description:"Range slider for controlling numeric values",category:"controls",icon:"mdi:tune-vertical"}}createDefault(){return{id:dt("slider"),type:"slider",show_value:!0,direction:"horizontal"}}_toNumber(e){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e){const t=Number(e);if(Number.isFinite(t))return t}}_clamp(e,t,i){return Math.max(t,Math.min(i,e))}_getCurrentValue(e,t,i){const{min:n,max:r}=i;if(!e)return Math.round((n+r)/2);const o=e.attributes,a=e.entity_id.split(".")[0];if(t){const e=this._toNumber(o[t]);if(void 0!==e)return this._clamp(e,n,r)}let s;switch(a){case"light":{const e=this._toNumber(o.brightness),t=this._toNumber(o.brightness_pct);void 0!==t?s=t:void 0!==e&&(s=Math.round(e/255*100));break}case"fan":s=this._toNumber(o.percentage);break;case"cover":s=this._toNumber(o.current_position);break;case"media_player":{const e=this._toNumber(o.volume_level);s=void 0!==e?Math.round(100*e):void 0;break}case"climate":s=this._toNumber(o.temperature);break;default:s=void 0}return void 0===s&&(s=this._toNumber(e.state)),void 0===s?Math.round((n+r)/2):this._clamp(s,n,r)}_getEntityLimits(e,t){if(!e)return{min:0,max:100,step:1};const i=e.entity_id.split(".")[0],n=e.attributes;switch(i){case"input_number":case"number":default:return{min:Number(n.min??0),max:Number(n.max??100),step:Number(n.step??1)};case"light":return"color_temp"===t?{min:Number(n.min_mireds??153),max:Number(n.max_mireds??500),step:1}:{min:0,max:100,step:1};case"fan":return{min:0,max:100,step:Number(n.percentage_step??1)};case"cover":case"media_player":return{min:0,max:100,step:1};case"climate":return{min:Number(n.min_temp??7),max:Number(n.max_temp??35),step:Number(n.target_temp_step??.5)}}}_createSliderHandler(e,t,i,n){const r="vertical"===i.direction,{min:o,max:a,step:s}=n;return n=>{n.stopPropagation();const l=n.currentTarget;l.setPointerCapture(n.pointerId);const c=e=>{const t=l.getBoundingClientRect();return r?Math.max(0,Math.min(1,1-(e.clientY-t.top)/t.height)):Math.max(0,Math.min(1,(e.clientX-t.left)/t.width))};l.style.setProperty("--slider-value",String(c(n)));const d=e=>{l.style.setProperty("--slider-value",String(c(e)))},p=n=>{l.removeEventListener("pointermove",d),l.removeEventListener("pointerup",p);const r=c(n),u=o+r*(a-o),m=Math.round(u/s)*s;this._callEntityService(e,t,m,i.attribute)};l.addEventListener("pointermove",d),l.addEventListener("pointerup",p)}}_callEntityService(e,t,i,n){const r=t.split(".")[0];switch(r){case"input_number":case"number":default:e.callService(r,"set_value",{entity_id:t,value:i});break;case"light":n&&"brightness"!==n?"color_temp"===n&&e.callService("light","turn_on",{entity_id:t,color_temp:Math.round(i)}):e.callService("light","turn_on",{entity_id:t,brightness_pct:Math.round(i)});break;case"fan":e.callService("fan","set_percentage",{entity_id:t,percentage:Math.round(i)});break;case"cover":e.callService("cover","set_cover_position",{entity_id:t,position:Math.round(i)});break;case"media_player":e.callService("media_player","volume_set",{entity_id:t,volume_level:i/100});break;case"climate":e.callService("climate","set_temperature",{entity_id:t,temperature:i})}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=this._getEntityLimits(n,i.attribute),{min:o,max:a,step:s}=r,l=this._getCurrentValue(n,i.attribute,r),c="vertical"===i.direction,d=this._clamp(a>o?(l-o)/(a-o):0,0,1),p=i.design||{},u=p.color||i.slider_color||"var(--primary-color, #03a9f4)",m=p.background||i.track_color,h=String(s<1?Math.round(l/s)*s:Math.round(l)),g=i.entity&&t?this._createSliderHandler(t,i.entity,i,r):void 0;return te`
      <div
        class="mc-module mc-slider mc-slider-container ${c?"mc-slider-container--vertical":"mc-slider-container--horizontal"}"
      >
        <div
          class="mc-tile-slider ${c?"mc-tile-slider--vertical":""}"
          style="--slider-value: ${d}; --mc-slider-color: ${u}; ${m?`--mc-slider-background: ${m};`:""} touch-action: none;"
          @pointerdown=${g}
          @click=${e=>e.stopPropagation()}
        >
          <div class="mc-tile-slider-background"></div>
          <div class="mc-tile-slider-bar"></div>
        </div>
        ${i.show_value?te`<span class="mc-slider-value">
              ${h}
            </span>`:ne}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${Ft("Entity",o.entity,e=>i({...o,entity:e}),t,void 0,"entity",r)}
        ${qt("Attribute",o.attribute,e=>i({...o,attribute:e}),t,o.entity,"attribute",r)}
        ${jt("Show Value",o.show_value,e=>i({...o,show_value:e}),"show_value",r)}
        ${Nt("Direction",o.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...o,direction:e}),"direction",r)}
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"button",name:"Button",description:"Interactive button with icon, label, and optional state display",category:"controls",icon:"mdi:gesture-tap"}}createDefault(){return{id:dt("button"),type:"button",label:"Button",icon:"mdi:power",show_state:!1,button_style:"default"}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=n?t.formatEntityState(n):void 0,o=i.label||"Button",a="icon-only"===i.button_style;return te`
      <div class="mc-module mc-button mc-button--${i.button_style||"default"}">
        <button
          class="mc-button-inner mc-button-inner--${i.button_style||"default"} ${a?"mc-button-inner--icon-only":""}"
        >
          ${i.icon?te`<ha-icon .icon=${i.icon}></ha-icon>`:ne}
          ${a?ne:te`<span>${o}</span>`}
          ${i.show_state&&r?te`<span class="mc-button-state">${r}</span>`:ne}
        </button>
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${Ft("Entity",o.entity,e=>i({...o,entity:e}),t,void 0,"entity",r)}
        ${qt("Attribute",o.attribute,e=>i({...o,attribute:e}),t,o.entity,"attribute",r)}
        ${Lt("Label",o.label,e=>i({...o,label:e}),"label",r)}
        ${Ut("Icon",o.icon,e=>i({...o,icon:e}),t,"icon",r)}
        ${Nt("Button Style",o.button_style,[{label:"Default",value:"default"},{label:"Outline",value:"outline"},{label:"Flat",value:"flat"},{label:"Icon Only",value:"icon-only"}],e=>i({...o,button_style:e}),"button_style",r)}
        ${jt("Show State",o.show_state,e=>i({...o,show_state:e}),"show_state",r)}
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"slider",name:"Slider",description:"Range slider for controlling numeric values",category:"controls",icon:"mdi:tune-vertical"}}createDefault(){return{id:dt("slider"),type:"slider",show_value:!0,direction:"horizontal"}}_toNumber(e){if("number"==typeof e&&Number.isFinite(e))return e;if("string"==typeof e){const t=Number(e);if(Number.isFinite(t))return t}}_clamp(e,t,i){return Math.max(t,Math.min(i,e))}_getCurrentValue(e,t,i){const{min:n,max:r}=i;if(!e)return Math.round((n+r)/2);const o=e.attributes,a=e.entity_id.split(".")[0];if(t){const e=this._toNumber(o[t]);if(void 0!==e)return this._clamp(e,n,r)}let s;switch(a){case"light":{const e=this._toNumber(o.brightness),t=this._toNumber(o.brightness_pct);void 0!==t?s=t:void 0!==e&&(s=Math.round(e/255*100));break}case"fan":s=this._toNumber(o.percentage);break;case"cover":s=this._toNumber(o.current_position);break;case"media_player":{const e=this._toNumber(o.volume_level);s=void 0!==e?Math.round(100*e):void 0;break}case"climate":s=this._toNumber(o.temperature);break;default:s=void 0}return void 0===s&&(s=this._toNumber(e.state)),void 0===s?Math.round((n+r)/2):this._clamp(s,n,r)}_getEntityLimits(e,t){if(!e)return{min:0,max:100,step:1};const i=e.entity_id.split(".")[0],n=e.attributes;switch(i){case"input_number":case"number":default:return{min:Number(n.min??0),max:Number(n.max??100),step:Number(n.step??1)};case"light":return"color_temp"===t?{min:Number(n.min_mireds??153),max:Number(n.max_mireds??500),step:1}:{min:0,max:100,step:1};case"fan":return{min:0,max:100,step:Number(n.percentage_step??1)};case"cover":case"media_player":return{min:0,max:100,step:1};case"climate":return{min:Number(n.min_temp??7),max:Number(n.max_temp??35),step:Number(n.target_temp_step??.5)}}}_createSliderHandler(e,t,i,n){const r="vertical"===i.direction,{min:o,max:a,step:s}=n;return n=>{n.stopPropagation();const l=n.currentTarget;l.setPointerCapture(n.pointerId);const c=e=>{const t=l.getBoundingClientRect();return r?Math.max(0,Math.min(1,1-(e.clientY-t.top)/t.height)):Math.max(0,Math.min(1,(e.clientX-t.left)/t.width))};l.style.setProperty("--slider-value",String(c(n)));const d=e=>{l.style.setProperty("--slider-value",String(c(e)))},p=n=>{l.removeEventListener("pointermove",d),l.removeEventListener("pointerup",p);const r=c(n),u=o+r*(a-o),m=Math.round(u/s)*s;this._callEntityService(e,t,m,i.attribute)};l.addEventListener("pointermove",d),l.addEventListener("pointerup",p)}}_callEntityService(e,t,i,n){const r=t.split(".")[0];switch(r){case"input_number":case"number":default:e.callService(r,"set_value",{entity_id:t,value:i});break;case"light":n&&"brightness"!==n?"color_temp"===n&&e.callService("light","turn_on",{entity_id:t,color_temp:Math.round(i)}):e.callService("light","turn_on",{entity_id:t,brightness_pct:Math.round(i)});break;case"fan":e.callService("fan","set_percentage",{entity_id:t,percentage:Math.round(i)});break;case"cover":e.callService("cover","set_cover_position",{entity_id:t,position:Math.round(i)});break;case"media_player":e.callService("media_player","volume_set",{entity_id:t,volume_level:i/100});break;case"climate":e.callService("climate","set_temperature",{entity_id:t,temperature:i})}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=this._getEntityLimits(n,i.attribute),{min:o,max:a,step:s}=r,l=this._getCurrentValue(n,i.attribute,r),c="vertical"===i.direction,d=this._clamp(a>o?(l-o)/(a-o):0,0,1),p=i.design||{},u=p.color||i.slider_color||"var(--primary-color, #03a9f4)",m=p.background||i.track_color,h=String(s<1?Math.round(l/s)*s:Math.round(l)),g=i.entity&&t?this._createSliderHandler(t,i.entity,i,r):void 0;return te`
      <div
        class="mc-module mc-slider mc-slider-container ${c?"mc-slider-container--vertical":"mc-slider-container--horizontal"}"
      >
        <div
          class="mc-tile-slider ${c?"mc-tile-slider--vertical":""}"
          style="--slider-value: ${d}; --mc-slider-color: ${u}; ${m?`--mc-slider-background: ${m};`:""} touch-action: none;"
          @pointerdown=${g}
          @click=${e=>e.stopPropagation()}
        >
          <div class="mc-tile-slider-background"></div>
          <div class="mc-tile-slider-bar"></div>
        </div>
        ${i.show_value?te`<span class="mc-slider-value">
              ${h}
            </span>`:ne}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${Ft("Entity",o.entity,e=>i({...o,entity:e}),t,void 0,"entity",r)}
        ${qt("Attribute",o.attribute,e=>i({...o,attribute:e}),t,o.entity,"attribute",r)}
        ${jt("Show Value",o.show_value,e=>i({...o,show_value:e}),"show_value",r)}
        ${Nt("Direction",o.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...o,direction:e}),"direction",r)}
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"spinbox",name:"Spinbox",description:"Numeric input with increment and decrement buttons",category:"controls",icon:"mdi:numeric"}}createDefault(){return{id:dt("spinbox"),type:"spinbox",min:0,max:100,step:1}}_callEntityService(e,t,i,n){const r=t.split(".")[0];switch(r){case"input_number":case"number":default:e.callService(r,"set_value",{entity_id:t,value:i});break;case"light":n&&"brightness"!==n?"color_temp"===n&&e.callService("light","turn_on",{entity_id:t,color_temp:Math.round(i)}):e.callService("light","turn_on",{entity_id:t,brightness_pct:Math.round(i)});break;case"fan":e.callService("fan","set_percentage",{entity_id:t,percentage:Math.round(i)});break;case"climate":e.callService("climate","set_temperature",{entity_id:t,temperature:i})}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=i.min??0,o=i.max??100,a=i.step??1,s=n?i.attribute?Number(n.attributes[i.attribute]??r):Number(n.state):Math.round((r+o)/2);return te`
      <div class="mc-module mc-spinbox">
        <button class="mc-spinbox-btn mc-spinbox-decrement" @click=${e=>{if(e.stopPropagation(),!i.entity||!t)return;const n=Math.max(r,s-a);this._callEntityService(t,i.entity,n,i.attribute)}}>
          &minus;
        </button>
        <span class="mc-spinbox-value">
          ${s}
        </span>
        <button class="mc-spinbox-btn mc-spinbox-increment" @click=${e=>{if(e.stopPropagation(),!i.entity||!t)return;const n=Math.min(o,s+a);this._callEntityService(t,i.entity,n,i.attribute)}}>
          +
        </button>
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${Ft("Entity",o.entity,e=>i({...o,entity:e}),t,void 0,"entity",r)}
        ${qt("Attribute",o.attribute,e=>i({...o,attribute:e}),t,o.entity,"attribute",r)}
        ${Ot("Min",o.min,e=>i({...o,min:e}),void 0,"min",r)}
        ${Ot("Max",o.max,e=>i({...o,max:e}),void 0,"max",r)}
        ${Ot("Step",o.step,e=>i({...o,step:e}),{min:.01,step:.01},"step",r)}
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"dropdown",name:"Dropdown",description:"Select dropdown for choosing from a list of options",category:"controls",icon:"mdi:form-dropdown"}}createDefault(){return{id:dt("dropdown"),type:"dropdown",options:[{label:"Option 1",value:"option_1"},{label:"Option 2",value:"option_2"},{label:"Option 3",value:"option_3"}]}}_callEntityService(e,t,i){const n=t.split(".")[0];switch(n){case"input_select":e.callService("input_select","select_option",{entity_id:t,option:i});break;case"select":e.callService("select","select_option",{entity_id:t,option:i});break;case"input_text":e.callService("input_text","set_value",{entity_id:t,value:i});break;default:e.callService(n,"select_option",{entity_id:t,option:i})}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=n?i.attribute?String(n.attributes[i.attribute]??""):n.state:void 0,o=n?.attributes.options,a=i.options||[],s=a.length>0?a:(o||[]).map(e=>({label:e,value:e}));return te`
      <div class="mc-module mc-dropdown">
        <select @change=${e=>{if(e.stopPropagation(),!i.entity||!t)return;const n=e.target.value;this._callEntityService(t,i.entity,n)}} @click=${e=>e.stopPropagation()}>
          ${s.length>0?s.map(e=>te`
                  <option value=${e.value} ?selected=${r===e.value}>
                    ${e.label}
                  </option>
                `):te`<option disabled selected>No options</option>`}
        </select>
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e,a=o.options||[],s=(e,t,n)=>{const r=a.map((i,r)=>r===e?{...i,[t]:n}:i);i({...o,options:r})};return te`
      <div class="mc-tab-content">
        ${Ft("Entity",o.entity,e=>i({...o,entity:e}),t,void 0,"entity",r)}
        ${qt("Attribute",o.attribute,e=>i({...o,attribute:e}),t,o.entity,"attribute",r)}

        <div class="mc-section">
          <div class="mc-section-header">Custom Options</div>
          ${Pt("Leave empty to use entity's built-in options (input_select/select entities).","mc-field-hint-with-margin")}
          <div class="mc-options-list">
            ${a.map((e,t)=>te`
                <div class="mc-option-item mc-option-row">
                  ${Lt("Label",e.label,e=>s(t,"label",e))}
                  ${Lt("Value",e.value,e=>s(t,"value",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=a.filter((t,i)=>i!==e);i({...o,options:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...a,{label:`Option ${a.length+1}`,value:`option_${a.length+1}`}];i({...o,options:e})}}>Add Option</button>
        </div>
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"light",name:"Light",description:"Light control with brightness, color temp, and color options",category:"controls",icon:"mdi:lightbulb"}}createDefault(){return{id:dt("light"),type:"light",show_brightness:!0,show_color_temp:!1,show_color:!1,compact:!1}}_createSliderHandler(e,t,i){return e=>{e.stopPropagation();const t=e.currentTarget;t.setPointerCapture(e.pointerId);const n=e=>{const i=t.getBoundingClientRect();return Math.max(0,Math.min(1,(e.clientX-i.left)/i.width))};t.style.setProperty("--slider-value",String(n(e)));const r=e=>{t.style.setProperty("--slider-value",String(n(e)))},o=e=>{t.removeEventListener("pointermove",r),t.removeEventListener("pointerup",o),i(n(e))};t.addEventListener("pointermove",r),t.addEventListener("pointerup",o)}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=!!n&&"on"===n.state,o=n?.attributes.brightness,a=void 0!==o?Math.round(o/255*100):void 0,s=n?.attributes.color_temp,l=n?.attributes.min_mireds??153,c=n?.attributes.max_mireds??500,d=n?.attributes.friendly_name||i.entity||"Light",p=r?"var(--state-light-active-color, #fdd835)":"var(--state-icon-color, #9e9e9e)",u=i.entity&&t?this._createSliderHandler(t,i.entity,e=>{t.callService("light","turn_on",{entity_id:i.entity,brightness_pct:Math.round(100*e)})}):void 0,m=i.entity&&t?this._createSliderHandler(t,i.entity,e=>{t.callService("light","turn_on",{entity_id:i.entity,color_temp:Math.round(l+e*(c-l))})}):void 0;return te`
      <div
        class="mc-module mc-light ${i.compact?"mc-light--compact":""}"
      >
        <div class="mc-light-header">
          <ha-icon
            .icon=${"mdi:lightbulb"}
            style="color: ${p};"
          ></ha-icon>
          ${i.compact?te`<span class="mc-light-name--compact">${d}</span>`:te`
                <div class="mc-light-info">
                  <div class="mc-light-name">${d}</div>
                  <div class="mc-light-secondary">
                    ${r?void 0!==a?`${a}%`:"On":"Off"}
                  </div>
                </div>
              `}
        </div>

        ${i.show_brightness?te`
              <div class="mc-light-control mc-light-brightness">
                <ha-icon .icon=${"mdi:brightness-6"}></ha-icon>
                <div
                  class="mc-tile-slider"
                  style="--slider-value: ${(a??50)/100}; --mc-slider-color: var(--state-light-active-color, #fdd835); touch-action: none;"
                  @pointerdown=${u}
                  @click=${e=>e.stopPropagation()}
                >
                  <div class="mc-tile-slider-background"></div>
                  <div class="mc-tile-slider-bar"></div>
                </div>
                ${void 0!==a?te`<span class="mc-light-value">${a}%</span>`:ne}
              </div>
            `:ne}

        ${i.show_color_temp?te`
              <div class="mc-light-control mc-light-color-temp">
                <ha-icon .icon=${"mdi:thermometer"}></ha-icon>
                <div
                  class="mc-tile-slider"
                  style="--slider-value: ${((s??300)-l)/(c-l)}; --mc-slider-color: var(--mc-light-color-temp); touch-action: none;"
                  @pointerdown=${m}
                  @click=${e=>e.stopPropagation()}
                >
                  <div class="mc-tile-slider-background"></div>
                  <div class="mc-tile-slider-bar"></div>
                </div>
              </div>
            `:ne}

        ${i.show_color?te`
              <div class="mc-light-control mc-light-color">
                <ha-icon .icon=${"mdi:palette"}></ha-icon>
                <input
                  type="color"
                  class="mc-light-color-input"
                  @input=${e=>{if(e.stopPropagation(),!i.entity||!t)return;const n=e.target.value,r=parseInt(n.slice(1,3),16),o=parseInt(n.slice(3,5),16),a=parseInt(n.slice(5,7),16);t.callService("light","turn_on",{entity_id:i.entity,rgb_color:[r,o,a]})}}
                  @click=${e=>e.stopPropagation()}
                />
              </div>
            `:ne}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${Ft("Entity",o.entity,e=>i({...o,entity:e}),t,"light","entity",r)}
        ${qt("Attribute",o.attribute,e=>i({...o,attribute:e}),t,o.entity,"attribute",r)}
        ${jt("Show Brightness",o.show_brightness,e=>i({...o,show_brightness:e}),"show_brightness",r)}
        ${jt("Show Color Temp",o.show_color_temp,e=>i({...o,show_color_temp:e}),"show_color_temp",r)}
        ${jt("Show Color Picker",o.show_color,e=>i({...o,show_color:e}),"show_color",r)}
        ${jt("Compact Mode",o.compact,e=>i({...o,compact:e}),"compact",r)}
      </div>
    `}validate(e){const t=[];return e.entity||t.push("Entity is required for light module"),t}});function Zn(){return Ye.getAll().map(e=>({label:e.metadata.name,value:e.metadata.type}))}function Jn(e){const{ownerId:t,scopeId:i,children:n,hass:r,template:o,expandedState:a,moduleTypes:s,onRefresh:l,onRemoveChild:c,onUpdateChild:d,onAddChild:p,addButtonLabel:u="Add",getItemLabel:m}=e,h=`mc-add-child-${t}-${i}`;return te`
    <div class="mc-child-module-list">
      ${n.map((e,n)=>{const s=Ye.get(e.type),p=`${t}:${i}:${n}`,u=a.get(p)??!1,h=s?.metadata.name||e.type,g=m?m(e,n,h):h;return te`
          <div class="mc-child-module-item">
            <div class="mc-child-module-head" @click=${()=>(e=>{const n=`${t}:${i}:${e}`;a.set(n,!a.get(n)),l()})(n)}>
              ${s?.metadata.icon?te`<ha-icon icon=${s.metadata.icon} style="--mdc-icon-size:18px"></ha-icon>`:ne}
              <span class="mc-child-module-title">${g}</span>
              <button
                class="mc-btn-icon mc-btn-small"
                @click=${e=>{e.stopPropagation(),c(n)}}
              >
                &times;
              </button>
            </div>
            ${u&&s?te`<div class="mc-child-module-body">
                  ${s.renderGeneralTab(e,r,e=>d(n,e),o)}
                </div>`:ne}
          </div>
        `})}

      <div class="mc-child-module-add-row">
        <select id=${h} class="mc-child-module-select">
          ${s.map(e=>te`<option value=${e.value}>${e.label}</option>`)}
        </select>
        <button
          class="mc-btn mc-btn-secondary"
          @click=${e=>{const t=e.currentTarget.parentElement,i=t?.querySelector("select");i&&p(i.value)}}
        >
          ${u}
        </button>
      </div>
    </div>
  `}Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"gauge",name:"Gauge",description:"Arc gauge for displaying numeric sensor values",category:"controls",icon:"mdi:gauge"}}createDefault(){return{id:dt("gauge"),type:"gauge",min:0,max:100,needle:!0,gauge_style:"half"}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=i.min??0,o=i.max??100,a=n?Number(n.state):Math.round((r+o)/2),s=Math.max(r,Math.min(o,a)),l=(s-r)/(o-r)*100,c=this._getSeverityColor(s,i.severity)||"var(--primary-color, #03a9f4)",d=("half"===i.gauge_style||i.gauge_style,"full"===i.gauge_style),p="quarter"===i.gauge_style;if(d){const e=l/100*360,t=(e-90)*(Math.PI/180),i=40,n=50,r=50+i*Math.cos(t),o=n+i*Math.sin(t);return te`
        <div class="mc-module mc-gauge mc-gauge--full" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${l>0?te`<path
                  d="M 50 10 A 40 40 0 ${e>180?1:0} 1 ${r} ${o}"
                  fill="none"
                  stroke=${c}
                  stroke-width="8"
                  stroke-linecap="round"
                />`:""}
            <text x="50" y="54" text-anchor="middle" font-size="16" font-weight="600" fill="currentColor">
              ${s}
            </text>
          </svg>
        </div>
      `}if(p){const e=l/100*90,t=Math.PI/180*-90,i=(-90+e)*(Math.PI/180),n=44,r=10,o=90,a=r+n*Math.cos(t),d=o+n*Math.sin(t),p=r+n*Math.cos(i),u=o+n*Math.sin(i);return te`
        <div class="mc-module mc-gauge mc-gauge--quarter" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <path d="M 10 46 A 44 44 0 0 1 54 90" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${l>0?te`<path
                  d="M ${a} ${d} A ${n} ${n} 0 0 1 ${p} ${u}"
                  fill="none"
                  stroke=${c}
                  stroke-width="8"
                  stroke-linecap="round"
                />`:""}
            <text x="20" y="80" text-anchor="start" font-size="18" font-weight="600" fill="currentColor">
              ${s}
            </text>
          </svg>
        </div>
      `}const u=l/100*180,m=(180+u)*(Math.PI/180),h=50+40*Math.cos(m),g=55+40*Math.sin(m);return te`
      <div class="mc-module mc-gauge mc-gauge--half" style="text-align: center;">
        <svg viewBox="0 0 100 70" width="140" height="100">
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="var(--divider-color, #e0e0e0)"
            stroke-width="8"
            stroke-linecap="round"
          />
          ${l>0?te`<path
                d="M 10 55 A 40 40 0 ${u>180?1:0} 1 ${h} ${g}"
                fill="none"
                stroke=${c}
                stroke-width="8"
                stroke-linecap="round"
              />`:""}
          ${i.needle?te`
                <line
                  x1="50"
                  y1="55"
                  x2=${h}
                  y2=${g}
                  stroke=${c}
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <circle cx="50" cy="55" r="3" fill=${c} />
              `:""}
          <text x="50" y="50" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">
            ${s}
          </text>
          <text x="10" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${r}</text>
          <text x="90" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${o}</text>
        </svg>
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e,a=o.severity||[],s=(e,t,n)=>{const r=a.map((i,r)=>r===e?{...i,[t]:n}:i);i({...o,severity:r})};return te`
      <div class="mc-tab-content">
        ${Ft("Entity",o.entity,e=>i({...o,entity:e}),t,void 0,"entity",r)}
        ${qt("Attribute",o.attribute,e=>i({...o,attribute:e}),t,o.entity,"attribute",r)}
        ${Ot("Min",o.min,e=>i({...o,min:e}),void 0,"min",r)}
        ${Ot("Max",o.max,e=>i({...o,max:e}),void 0,"max",r)}
        ${Nt("Gauge Style",o.gauge_style,[{label:"Half (semicircle)",value:"half"},{label:"Full (circle)",value:"full"},{label:"Quarter",value:"quarter"}],e=>i({...o,gauge_style:e}),"gauge_style",r)}
        ${jt("Show Needle",o.needle,e=>i({...o,needle:e}),"needle",r)}

        <div class="mc-section">
          <div class="mc-section-header">Severity Ranges</div>
          <div class="mc-severity-list">
            ${a.map((e,t)=>te`
                <div class="mc-severity-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${Ot("From",e.from,e=>s(t,"from",e))}
                  ${Ot("To",e.to,e=>s(t,"to",e))}
                  ${Bt("Color",e.color,e=>s(t,"color",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=a.filter((t,i)=>i!==e);i({...o,severity:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...a,{from:0,to:100,color:"#4caf50"}];i({...o,severity:e})}}>Add Severity Range</button>
        </div>
      </div>
    `}_getSeverityColor(e,t){if(t&&0!==t.length)for(const i of t)if(e>=i.from&&e<=i.to)return i.color}});const er=new Map;Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"horizontal",name:"Horizontal",description:"Arrange child modules in a row",category:"layout",icon:"mdi:arrow-split-vertical"}}createDefault(){return{id:dt("horizontal"),type:"horizontal",modules:[],gap:"8px",align:"center",justify:"start"}}renderPreview(e,t){const i=e,n=i.modules||[];return te`
      <div class="mc-module mc-horizontal"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"center"}; justify-content:${i.justify||"start"}">
        ${n.length>0?n.map(e=>{const i=Ye.get(e.type);return i?i.renderPreview(e,t):te`<span class="mc-error">?</span>`}):te`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty row</span>`}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e,a=o.modules||[],s=Zn();return te`
      <div class="mc-tab-content">
        ${Lt("Gap",o.gap,e=>i({...o,gap:e}),"gap",r)}
        ${Nt("Align",o.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>i({...o,align:e}),"align",r)}
        ${Nt("Justify",o.justify,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Space Between",value:"space-between"},{label:"Space Around",value:"space-around"}],e=>i({...o,justify:e}),"justify",r)}

        <div class="mc-section">
          <div class="mc-section-header">Child Modules (${a.length})</div>
          ${this._renderChildModuleList(o,t,i,s,n)}
        </div>
      </div>
    `}_renderChildModuleList(e,t,i,n,r){const o=e.modules||[],a=t=>{i({...e,modules:t})};return te`
      ${Jn({ownerId:e.id,scopeId:"root",children:o,hass:t,template:r,expandedState:er,moduleTypes:n,onRefresh:()=>i({...e}),onRemoveChild:e=>{a(o.filter((t,i)=>i!==e))},onUpdateChild:(e,t)=>{const i=[...o];i[e]=t,a(i)},onAddChild:e=>{const t=Ye.createDefault(e);t&&a([...o,t])}})}
    `}});const tr=new Map;Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"vertical",name:"Vertical",description:"Arrange child modules in a column",category:"layout",icon:"mdi:arrow-split-horizontal"}}createDefault(){return{id:dt("vertical"),type:"vertical",modules:[],gap:"8px",align:"stretch"}}renderPreview(e,t){const i=e,n=i.modules||[];return te`
      <div class="mc-module mc-vertical"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"stretch"}">
        ${n.length>0?n.map(e=>{const i=Ye.get(e.type);return i?i.renderPreview(e,t):te`<span class="mc-error">?</span>`}):te`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty column</span>`}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e,a=o.modules||[],s=Zn();return te`
      <div class="mc-tab-content">
        ${Lt("Gap",o.gap,e=>i({...o,gap:e}),"gap",r)}
        ${Nt("Align",o.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>i({...o,align:e}),"align",r)}

        <div class="mc-section">
          <div class="mc-section-header">Child Modules (${a.length})</div>
          ${this._renderChildModuleList(o,t,i,s,n)}
        </div>
      </div>
    `}_renderChildModuleList(e,t,i,n,r){const o=e.modules||[],a=t=>{i({...e,modules:t})};return te`
      ${Jn({ownerId:e.id,scopeId:"root",children:o,hass:t,template:r,expandedState:tr,moduleTypes:n,onRefresh:()=>i({...e}),onRemoveChild:e=>{a(o.filter((t,i)=>i!==e))},onUpdateChild:(e,t)=>{const i=[...o];i[e]=t,a(i)},onAddChild:e=>{const t=Ye.createDefault(e);t&&a([...o,t])}})}
    `}});const ir={1:[{label:"1 Col",value:"1"}],2:[{label:"1-1",value:"1-1"},{label:"1-2",value:"1-2"},{label:"2-1",value:"2-1"}],3:[{label:"1-1-1",value:"1-1-1"},{label:"1-2-1",value:"1-2-1"}]},nr=new Map,rr=new Map;Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"row",name:"Row",description:"Grid row with columns, nestable inside any column",category:"layout",icon:"mdi:view-sequential"}}createDefault(){return{id:dt("row"),type:"row",columns:[{modules:[]},{modules:[]}],layout:"1-1",gap:"8px"}}renderPreview(e,t){const i=e,n=i.columns||[],r=lt(i.layout||"1");return te`
      <div class="mc-module mc-nested-row" style="display:grid; grid-template-columns:${r}; gap:${i.gap||"8px"}">
        ${n.map(e=>te`
          <div class="mc-nested-col">
            ${e.modules?.length?e.modules.map(e=>{const i=Ye.get(e.type);return i?i.renderPreview(e,t):te`<span class="mc-error">?</span>`}):te`<span class="mc-placeholder-text">Empty</span>`}
          </div>
        `)}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e,a=o.columns||[],s=a.length,l=ir[s]||ir[1],c=nr.get(o.id)??0,d=Math.min(c,Math.max(s-1,0)),p=Zn();return te`
      <div class="mc-tab-content">
        ${Nt("Column Layout",o.layout,l,e=>i({...o,layout:e}),"layout",r)}
        ${Ht("Gap",o.gap,e=>i({...o,gap:e}),"gap",r)}

        <!-- Column management -->
        <div class="mc-section">
          <div class="mc-section-header mc-section-header-split">
            <span>Columns (${s})</span>
            <div class="mc-section-header-actions">
              <button class="mc-btn mc-btn-secondary mc-btn-compact" @click=${()=>{const e=[...a,{modules:[]}];i({...o,columns:e})}}>+ Column</button>
              ${s>1?te`
                <button class="mc-btn mc-btn-secondary mc-btn-compact" @click=${()=>{const e=a.slice(0,-1);d>=e.length&&nr.set(o.id,e.length-1),i({...o,columns:e})}}>- Column</button>
              `:ne}
            </div>
          </div>
        </div>

        <!-- Per-column child module management -->
        ${s>0?te`
            <div class="mc-section">
              <div class="mc-section-header">Column Content</div>
              <div class="mc-tabs-header mc-editor-tab-switcher">
                ${a.map((e,t)=>te`
                    <button
                      class="mc-tab-button ${t===d?"active":""}"
                      @click=${()=>{nr.set(o.id,t),i({...o})}}
                    >Col ${t+1}</button>
                  `)}
              </div>
              ${this._renderChildModuleList(o,d,t,i,p,n)}
            </div>
          `:ne}
      </div>
    `}_renderChildModuleList(e,t,i,n,r,o){const a=e.columns[t].modules||[],s=i=>{const r=[...e.columns||[]];r[t]={...r[t],modules:i},n({...e,columns:r})};return te`
      ${Jn({ownerId:e.id,scopeId:`col-${t}`,children:a,hass:i,template:o,expandedState:rr,moduleTypes:r,onRefresh:()=>n({...e}),onRemoveChild:e=>{s(a.filter((t,i)=>i!==e))},onUpdateChild:(e,t)=>{const i=[...a];i[e]=t,s(i)},onAddChild:e=>{const t=Ye.createDefault(e);t&&s([...a,t])}})}
    `}});const or=new Map,ar=new Map,sr=new Map;Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"tabs",name:"Tabs",description:"Tabbed container for groups of modules",category:"layout",icon:"mdi:tab"}}createDefault(){return{id:dt("tabs"),type:"tabs",tabs:[{label:"Tab 1",modules:[]},{label:"Tab 2",modules:[]}],active_tab:0,tab_style:"default"}}renderPreview(e,t){const i=e,n=i.tabs||[],r=or.get(i.id)??i.active_tab??0,o=n[r];return te`
      <div class="mc-module mc-tabs" data-style=${i.tab_style||"default"}>
        <div class="mc-tabs-header">
          ${n.map((e,t)=>te`
              <button class="mc-tab-button ${t===r?"active":""}"
                @click=${(e=>t=>{t.stopPropagation(),or.set(i.id,e),t.target.dispatchEvent(new CustomEvent("mc-request-update",{bubbles:!0,composed:!0}))})(t)}>
                ${e.icon?te`<ha-icon icon=${e.icon}></ha-icon>`:""}
                ${e.label}
              </button>
            `)}
        </div>
        <div class="mc-tabs-content">
          ${o?.modules?.length?o.modules.map(e=>{const i=Ye.get(e.type);return i?i.renderPreview(e,t):te`<span class="mc-error">?</span>`}):te`<span class="mc-placeholder-text">Empty tab</span>`}
        </div>
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e,a=o.tabs||[],s=ar.get(o.id)??0,l=Math.min(s,Math.max(a.length-1,0)),c=a[l],d=Zn();return te`
      <div class="mc-tab-content">
        ${Nt("Tab Style",o.tab_style,[{label:"Default",value:"default"},{label:"Pills",value:"pills"},{label:"Underline",value:"underline"}],e=>i({...o,tab_style:e}),"tab_style",r)}

        <!-- Tab label list -->
        <div class="mc-section">
          <div class="mc-section-header">Tabs</div>
          ${a.map((e,t)=>te`
              <div class="mc-field mc-inline-field-row">
                <input type="text" .value=${e.label}
                  @input=${e=>{const n=[...a];n[t]={...n[t],label:e.target.value},i({...o,tabs:n})}} />
                <button class="mc-btn-icon" @click=${()=>{const e=a.filter((e,i)=>i!==t);l>=e.length&&e.length>0&&ar.set(o.id,e.length-1),i({...o,tabs:e})}}>&times;</button>
              </div>
            `)}
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...a,{label:`Tab ${a.length+1}`,modules:[]}];i({...o,tabs:e})}}>Add Tab</button>
        </div>

        <!-- Per-tab child module management -->
        ${a.length>0?te`
            <div class="mc-section">
              <div class="mc-section-header">Tab Content</div>
              <div class="mc-tabs-header mc-editor-tab-switcher">
                ${a.map((e,t)=>te`
                    <button
                      class="mc-tab-button ${t===l?"active":""}"
                      @click=${()=>{ar.set(o.id,t),i({...o})}}
                    >${e.label}</button>
                  `)}
              </div>
              ${c?this._renderChildModuleList(o,l,t,i,d,n):ne}
            </div>
          `:ne}
      </div>
    `}_renderChildModuleList(e,t,i,n,r,o){const a=e.tabs[t].modules||[],s=i=>{const r=[...e.tabs||[]];r[t]={...r[t],modules:i},n({...e,tabs:r})};return te`
      ${Jn({ownerId:e.id,scopeId:`tab-${t}`,children:a,hass:i,template:o,expandedState:sr,moduleTypes:r,onRefresh:()=>n({...e}),onRemoveChild:e=>{s(a.filter((t,i)=>i!==e))},onUpdateChild:(e,t)=>{const i=[...a];i[e]=t,s(i)},onAddChild:e=>{const t=Ye.createDefault(e);t&&s([...a,t])}})}
    `}});function lr(e){return null!==e&&"object"==typeof e&&"constructor"in e&&e.constructor===Object}function cr(e={},t={}){const i=["__proto__","constructor","prototype"];Object.keys(t).filter(e=>i.indexOf(e)<0).forEach(i=>{void 0===e[i]?e[i]=t[i]:lr(t[i])&&lr(e[i])&&Object.keys(t[i]).length>0&&cr(e[i],t[i])})}Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"separator",name:"Separator",description:"Visual divider between modules",category:"layout",icon:"mdi:minus"}}getAvailableTabs(){return["general","conditions","design"]}createDefault(){return{id:dt("separator"),type:"separator",separator_style:"solid",separator_color:"var(--divider-color, #e5e7eb)",separator_width:"1px",direction:"horizontal"}}renderPreview(e,t){const i=e;return"vertical"===i.direction?te`
        <div class="mc-module mc-separator-vertical"
          style="border-left-style:${i.separator_style||"solid"}; border-left-color:${i.separator_color||"var(--divider-color)"}; border-left-width:${i.separator_width||"1px"}">
        </div>
      `:te`
      <hr class="mc-module mc-separator"
        style="border-top-style:${i.separator_style||"solid"}; border-top-color:${i.separator_color||"var(--divider-color)"}; border-top-width:${i.separator_width||"1px"}" />
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${Nt("Direction",o.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...o,direction:e}),"direction",r)}
        ${Nt("Style",o.separator_style,[{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"None",value:"none"}],e=>i({...o,separator_style:e}),"separator_style",r)}
        ${Bt("Color",o.separator_color,e=>i({...o,separator_color:e}),"separator_color",r)}
        ${Lt("Width",o.separator_width,e=>i({...o,separator_width:e}),"separator_width",r)}
      </div>
    `}});const dr={body:{},addEventListener(){},removeEventListener(){},activeElement:{blur(){},nodeName:""},querySelector:()=>null,querySelectorAll:()=>[],getElementById:()=>null,createEvent:()=>({initEvent(){}}),createElement:()=>({children:[],childNodes:[],style:{},setAttribute(){},getElementsByTagName:()=>[]}),createElementNS:()=>({}),importNode:()=>null,location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""}};function pr(){const e="undefined"!=typeof document?document:{};return cr(e,dr),e}const ur={document:dr,navigator:{userAgent:""},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""},history:{replaceState(){},pushState(){},go(){},back(){}},CustomEvent:function(){return this},addEventListener(){},removeEventListener(){},getComputedStyle:()=>({getPropertyValue:()=>""}),Image(){},Date(){},screen:{},setTimeout(){},clearTimeout(){},matchMedia:()=>({}),requestAnimationFrame:e=>"undefined"==typeof setTimeout?(e(),null):setTimeout(e,0),cancelAnimationFrame(e){"undefined"!=typeof setTimeout&&clearTimeout(e)}};function mr(){const e="undefined"!=typeof window?window:{};return cr(e,ur),e}function hr(e,t=0){return setTimeout(e,t)}function gr(){return Date.now()}function vr(e,t="x"){const i=mr();let n,r,o;const a=function(e){const t=mr();let i;return t.getComputedStyle&&(i=t.getComputedStyle(e,null)),!i&&e.currentStyle&&(i=e.currentStyle),i||(i=e.style),i}(e);return i.WebKitCSSMatrix?(r=a.transform||a.webkitTransform,r.split(",").length>6&&(r=r.split(", ").map(e=>e.replace(",",".")).join(", ")),o=new i.WebKitCSSMatrix("none"===r?"":r)):(o=a.MozTransform||a.OTransform||a.MsTransform||a.msTransform||a.transform||a.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,"),n=o.toString().split(",")),"x"===t&&(r=i.WebKitCSSMatrix?o.m41:16===n.length?parseFloat(n[12]):parseFloat(n[4])),"y"===t&&(r=i.WebKitCSSMatrix?o.m42:16===n.length?parseFloat(n[13]):parseFloat(n[5])),r||0}function fr(e){return"object"==typeof e&&null!==e&&e.constructor&&"Object"===Object.prototype.toString.call(e).slice(8,-1)}function br(e){return"undefined"!=typeof window&&void 0!==window.HTMLElement?e instanceof HTMLElement:e&&(1===e.nodeType||11===e.nodeType)}function yr(...e){const t=Object(e[0]),i=["__proto__","constructor","prototype"];for(let n=1;n<e.length;n+=1){const r=e[n];if(null!=r&&!br(r)){const e=Object.keys(Object(r)).filter(e=>i.indexOf(e)<0);for(let i=0,n=e.length;i<n;i+=1){const n=e[i],o=Object.getOwnPropertyDescriptor(r,n);void 0!==o&&o.enumerable&&(fr(t[n])&&fr(r[n])?r[n].__swiper__?t[n]=r[n]:yr(t[n],r[n]):!fr(t[n])&&fr(r[n])?(t[n]={},r[n].__swiper__?t[n]=r[n]:yr(t[n],r[n])):t[n]=r[n])}}}return t}function xr(e,t,i){e.style.setProperty(t,i)}function _r({swiper:e,targetPosition:t,side:i}){const n=mr(),r=-e.translate;let o,a=null;const s=e.params.speed;e.wrapperEl.style.scrollSnapType="none",n.cancelAnimationFrame(e.cssModeFrameID);const l=t>r?"next":"prev",c=(e,t)=>"next"===l&&e>=t||"prev"===l&&e<=t,d=()=>{o=(new Date).getTime(),null===a&&(a=o);const l=Math.max(Math.min((o-a)/s,1),0),p=.5-Math.cos(l*Math.PI)/2;let u=r+p*(t-r);if(c(u,t)&&(u=t),e.wrapperEl.scrollTo({[i]:u}),c(u,t))return e.wrapperEl.style.overflow="hidden",e.wrapperEl.style.scrollSnapType="",setTimeout(()=>{e.wrapperEl.style.overflow="",e.wrapperEl.scrollTo({[i]:u})}),void n.cancelAnimationFrame(e.cssModeFrameID);e.cssModeFrameID=n.requestAnimationFrame(d)};d()}function wr(e,t=""){const i=mr(),n=[...e.children];return i.HTMLSlotElement&&e instanceof HTMLSlotElement&&n.push(...e.assignedElements()),t?n.filter(e=>e.matches(t)):n}function kr(e){try{return void console.warn(e)}catch(e){}}function $r(e,t=[]){const i=document.createElement(e);return i.classList.add(...Array.isArray(t)?t:function(e=""){return e.trim().split(" ").filter(e=>!!e.trim())}(t)),i}function Sr(e,t){return mr().getComputedStyle(e,null).getPropertyValue(t)}function Cr(e){let t,i=e;if(i){for(t=0;null!==(i=i.previousSibling);)1===i.nodeType&&(t+=1);return t}}function Tr(e,t){const i=[];let n=e.parentElement;for(;n;)t?n.matches(t)&&i.push(n):i.push(n),n=n.parentElement;return i}function Mr(e,t,i){const n=mr();return i?e["width"===t?"offsetWidth":"offsetHeight"]+parseFloat(n.getComputedStyle(e,null).getPropertyValue("width"===t?"margin-right":"margin-top"))+parseFloat(n.getComputedStyle(e,null).getPropertyValue("width"===t?"margin-left":"margin-bottom")):e.offsetWidth}function zr(e){return(Array.isArray(e)?e:[e]).filter(e=>!!e)}function Ar(e,t=""){"undefined"!=typeof trustedTypes?e.innerHTML=trustedTypes.createPolicy("html",{createHTML:e=>e}).createHTML(t):e.innerHTML=t}let Er,Pr,Ir;function Rr(){return Er||(Er=function(){const e=mr(),t=pr();return{smoothScroll:t.documentElement&&t.documentElement.style&&"scrollBehavior"in t.documentElement.style,touch:!!("ontouchstart"in e||e.DocumentTouch&&t instanceof e.DocumentTouch)}}()),Er}function Lr(e={}){return Pr||(Pr=function({userAgent:e}={}){const t=Rr(),i=mr(),n=i.navigator.platform,r=e||i.navigator.userAgent,o={ios:!1,android:!1},a=i.screen.width,s=i.screen.height,l=r.match(/(Android);?[\s\/]+([\d.]+)?/);let c=r.match(/(iPad)(?!\1).*OS\s([\d_]+)/);const d=r.match(/(iPod)(.*OS\s([\d_]+))?/),p=!c&&r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),u="Win32"===n;let m="MacIntel"===n;return!c&&m&&t.touch&&["1024x1366","1366x1024","834x1194","1194x834","834x1112","1112x834","768x1024","1024x768","820x1180","1180x820","810x1080","1080x810"].indexOf(`${a}x${s}`)>=0&&(c=r.match(/(Version)\/([\d.]+)/),c||(c=[0,1,"13_0_0"]),m=!1),l&&!u&&(o.os="android",o.android=!0),(c||p||d)&&(o.os="ios",o.ios=!0),o}(e)),Pr}function Dr(){return Ir||(Ir=function(){const e=mr(),t=Lr();let i=!1;function n(){const t=e.navigator.userAgent.toLowerCase();return t.indexOf("safari")>=0&&t.indexOf("chrome")<0&&t.indexOf("android")<0}if(n()){const t=String(e.navigator.userAgent);if(t.includes("Version/")){const[e,n]=t.split("Version/")[1].split(" ")[0].split(".").map(e=>Number(e));i=e<16||16===e&&n<2}}const r=/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(e.navigator.userAgent),o=n();return{isSafari:i||o,needPerspectiveFix:i,need3dFix:o||r&&t.ios,isWebView:r}}()),Ir}var Or={on(e,t,i){const n=this;if(!n.eventsListeners||n.destroyed)return n;if("function"!=typeof t)return n;const r=i?"unshift":"push";return e.split(" ").forEach(e=>{n.eventsListeners[e]||(n.eventsListeners[e]=[]),n.eventsListeners[e][r](t)}),n},once(e,t,i){const n=this;if(!n.eventsListeners||n.destroyed)return n;if("function"!=typeof t)return n;function r(...i){n.off(e,r),r.__emitterProxy&&delete r.__emitterProxy,t.apply(n,i)}return r.__emitterProxy=t,n.on(e,r,i)},onAny(e,t){const i=this;if(!i.eventsListeners||i.destroyed)return i;if("function"!=typeof e)return i;const n=t?"unshift":"push";return i.eventsAnyListeners.indexOf(e)<0&&i.eventsAnyListeners[n](e),i},offAny(e){const t=this;if(!t.eventsListeners||t.destroyed)return t;if(!t.eventsAnyListeners)return t;const i=t.eventsAnyListeners.indexOf(e);return i>=0&&t.eventsAnyListeners.splice(i,1),t},off(e,t){const i=this;return!i.eventsListeners||i.destroyed?i:i.eventsListeners?(e.split(" ").forEach(e=>{void 0===t?i.eventsListeners[e]=[]:i.eventsListeners[e]&&i.eventsListeners[e].forEach((n,r)=>{(n===t||n.__emitterProxy&&n.__emitterProxy===t)&&i.eventsListeners[e].splice(r,1)})}),i):i},emit(...e){const t=this;if(!t.eventsListeners||t.destroyed)return t;if(!t.eventsListeners)return t;let i,n,r;"string"==typeof e[0]||Array.isArray(e[0])?(i=e[0],n=e.slice(1,e.length),r=t):(i=e[0].events,n=e[0].data,r=e[0].context||t),n.unshift(r);return(Array.isArray(i)?i:i.split(" ")).forEach(e=>{t.eventsAnyListeners&&t.eventsAnyListeners.length&&t.eventsAnyListeners.forEach(t=>{t.apply(r,[e,...n])}),t.eventsListeners&&t.eventsListeners[e]&&t.eventsListeners[e].forEach(e=>{e.apply(r,n)})}),t}};const Nr=(e,t,i)=>{t&&!e.classList.contains(i)?e.classList.add(i):!t&&e.classList.contains(i)&&e.classList.remove(i)};const jr=(e,t,i)=>{t&&!e.classList.contains(i)?e.classList.add(i):!t&&e.classList.contains(i)&&e.classList.remove(i)};const Fr=(e,t)=>{if(!e||e.destroyed||!e.params)return;const i=t.closest(e.isElement?"swiper-slide":`.${e.params.slideClass}`);if(i){let t=i.querySelector(`.${e.params.lazyPreloaderClass}`);!t&&e.isElement&&(i.shadowRoot?t=i.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`):requestAnimationFrame(()=>{i.shadowRoot&&(t=i.shadowRoot.querySelector(`.${e.params.lazyPreloaderClass}`),t&&!t.lazyPreloaderManaged&&t.remove())})),t&&!t.lazyPreloaderManaged&&t.remove()}},Br=(e,t)=>{if(!e.slides[t])return;const i=e.slides[t].querySelector('[loading="lazy"]');i&&i.removeAttribute("loading")},Hr=e=>{if(!e||e.destroyed||!e.params)return;let t=e.params.lazyPreloadPrevNext;const i=e.slides.length;if(!i||!t||t<0)return;t=Math.min(t,i);const n="auto"===e.params.slidesPerView?e.slidesPerViewDynamic():Math.ceil(e.params.slidesPerView),r=e.activeIndex;if(e.params.grid&&e.params.grid.rows>1){const i=r,o=[i-t];return o.push(...Array.from({length:t}).map((e,t)=>i+n+t)),void e.slides.forEach((t,i)=>{o.includes(t.column)&&Br(e,i)})}const o=r+n-1;if(e.params.rewind||e.params.loop)for(let n=r-t;n<=o+t;n+=1){const t=(n%i+i)%i;(t<r||t>o)&&Br(e,t)}else for(let n=Math.max(r-t,0);n<=Math.min(o+t,i-1);n+=1)n!==r&&(n>o||n<r)&&Br(e,n)};var Gr={updateSize:function(){const e=this;let t,i;const n=e.el;t=void 0!==e.params.width&&null!==e.params.width?e.params.width:n.clientWidth,i=void 0!==e.params.height&&null!==e.params.height?e.params.height:n.clientHeight,0===t&&e.isHorizontal()||0===i&&e.isVertical()||(t=t-parseInt(Sr(n,"padding-left")||0,10)-parseInt(Sr(n,"padding-right")||0,10),i=i-parseInt(Sr(n,"padding-top")||0,10)-parseInt(Sr(n,"padding-bottom")||0,10),Number.isNaN(t)&&(t=0),Number.isNaN(i)&&(i=0),Object.assign(e,{width:t,height:i,size:e.isHorizontal()?t:i}))},updateSlides:function(){const e=this;function t(t,i){return parseFloat(t.getPropertyValue(e.getDirectionLabel(i))||0)}const i=e.params,{wrapperEl:n,slidesEl:r,rtlTranslate:o,wrongRTL:a}=e,s=e.virtual&&i.virtual.enabled,l=s?e.virtual.slides.length:e.slides.length,c=wr(r,`.${e.params.slideClass}, swiper-slide`),d=s?e.virtual.slides.length:c.length;let p=[];const u=[],m=[];let h=i.slidesOffsetBefore;"function"==typeof h&&(h=i.slidesOffsetBefore.call(e));let g=i.slidesOffsetAfter;"function"==typeof g&&(g=i.slidesOffsetAfter.call(e));const v=e.snapGrid.length,f=e.slidesGrid.length,b=e.size-h-g;let y=i.spaceBetween,x=-h,_=0,w=0;if(void 0===b)return;"string"==typeof y&&y.indexOf("%")>=0?y=parseFloat(y.replace("%",""))/100*b:"string"==typeof y&&(y=parseFloat(y)),e.virtualSize=-y-h-g,c.forEach(e=>{o?e.style.marginLeft="":e.style.marginRight="",e.style.marginBottom="",e.style.marginTop=""}),i.centeredSlides&&i.cssMode&&(xr(n,"--swiper-centered-offset-before",""),xr(n,"--swiper-centered-offset-after","")),i.cssMode&&(xr(n,"--swiper-slides-offset-before",`${h}px`),xr(n,"--swiper-slides-offset-after",`${g}px`));const k=i.grid&&i.grid.rows>1&&e.grid;let $;k?e.grid.initSlides(c):e.grid&&e.grid.unsetSlides();const S="auto"===i.slidesPerView&&i.breakpoints&&Object.keys(i.breakpoints).filter(e=>void 0!==i.breakpoints[e].slidesPerView).length>0;for(let n=0;n<d;n+=1){$=0;const r=c[n];if(!r||(k&&e.grid.updateSlide(n,r,c),"none"!==Sr(r,"display"))){if(s&&"auto"===i.slidesPerView)i.virtual.slidesPerViewAutoSlideSize&&($=i.virtual.slidesPerViewAutoSlideSize),$&&r&&(i.roundLengths&&($=Math.floor($)),r.style[e.getDirectionLabel("width")]=`${$}px`);else if("auto"===i.slidesPerView){S&&(r.style[e.getDirectionLabel("width")]="");const n=getComputedStyle(r),o=r.style.transform,a=r.style.webkitTransform;if(o&&(r.style.transform="none"),a&&(r.style.webkitTransform="none"),i.roundLengths)$=e.isHorizontal()?Mr(r,"width",!0):Mr(r,"height",!0);else{const e=t(n,"width"),i=t(n,"padding-left"),o=t(n,"padding-right"),a=t(n,"margin-left"),s=t(n,"margin-right"),l=n.getPropertyValue("box-sizing");if(l&&"border-box"===l)$=e+a+s;else{const{clientWidth:t,offsetWidth:n}=r;$=e+i+o+a+s+(n-t)}}o&&(r.style.transform=o),a&&(r.style.webkitTransform=a),i.roundLengths&&($=Math.floor($))}else $=(b-(i.slidesPerView-1)*y)/i.slidesPerView,i.roundLengths&&($=Math.floor($)),r&&(r.style[e.getDirectionLabel("width")]=`${$}px`);r&&(r.swiperSlideSize=$),m.push($),i.centeredSlides?(x=x+$/2+_/2+y,0===_&&0!==n&&(x=x-b/2-y),0===n&&(x=x-b/2-y),Math.abs(x)<.001&&(x=0),i.roundLengths&&(x=Math.floor(x)),w%i.slidesPerGroup===0&&p.push(x),u.push(x)):(i.roundLengths&&(x=Math.floor(x)),(w-Math.min(e.params.slidesPerGroupSkip,w))%e.params.slidesPerGroup===0&&p.push(x),u.push(x),x=x+$+y),e.virtualSize+=$+y,_=$,w+=1}}if(e.virtualSize=Math.max(e.virtualSize,b)+g,o&&a&&("slide"===i.effect||"coverflow"===i.effect)&&(n.style.width=`${e.virtualSize+y}px`),i.setWrapperSize&&(n.style[e.getDirectionLabel("width")]=`${e.virtualSize+y}px`),k&&e.grid.updateWrapperSize($,p),!i.centeredSlides){const t="auto"!==i.slidesPerView&&i.slidesPerView%1!=0,n=i.snapToSlideEdge&&!i.loop&&("auto"===i.slidesPerView||t);let r=p.length;if(n){let e;if("auto"===i.slidesPerView){e=1;let t=0;for(let i=m.length-1;i>=0&&(t+=m[i]+(i<m.length-1?y:0),t<=b);i-=1)e=m.length-i}else e=Math.floor(i.slidesPerView);r=Math.max(d-e,0)}const o=[];for(let t=0;t<p.length;t+=1){let a=p[t];i.roundLengths&&(a=Math.floor(a)),n?t<=r&&o.push(a):p[t]<=e.virtualSize-b&&o.push(a)}p=o,Math.floor(e.virtualSize-b)-Math.floor(p[p.length-1])>1&&(n||p.push(e.virtualSize-b))}if(s&&i.loop){const t=m[0]+y;if(i.slidesPerGroup>1){const n=Math.ceil((e.virtual.slidesBefore+e.virtual.slidesAfter)/i.slidesPerGroup),r=t*i.slidesPerGroup;for(let e=0;e<n;e+=1)p.push(p[p.length-1]+r)}for(let n=0;n<e.virtual.slidesBefore+e.virtual.slidesAfter;n+=1)1===i.slidesPerGroup&&p.push(p[p.length-1]+t),u.push(u[u.length-1]+t),e.virtualSize+=t}if(0===p.length&&(p=[0]),0!==y){const t=e.isHorizontal()&&o?"marginLeft":e.getDirectionLabel("marginRight");c.filter((e,t)=>!(i.cssMode&&!i.loop)||t!==c.length-1).forEach(e=>{e.style[t]=`${y}px`})}if(i.centeredSlides&&i.centeredSlidesBounds){let e=0;m.forEach(t=>{e+=t+(y||0)}),e-=y;const t=e>b?e-b:0;p=p.map(e=>e<=0?-h:e>t?t+g:e)}if(i.centerInsufficientSlides){let e=0;m.forEach(t=>{e+=t+(y||0)}),e-=y;const t=(h||0)+(g||0);if(e+t<b){const i=(b-e-t)/2;p.forEach((e,t)=>{p[t]=e-i}),u.forEach((e,t)=>{u[t]=e+i})}}if(Object.assign(e,{slides:c,snapGrid:p,slidesGrid:u,slidesSizesGrid:m}),i.centeredSlides&&i.cssMode&&!i.centeredSlidesBounds){xr(n,"--swiper-centered-offset-before",-p[0]+"px"),xr(n,"--swiper-centered-offset-after",e.size/2-m[m.length-1]/2+"px");const t=-e.snapGrid[0],i=-e.slidesGrid[0];e.snapGrid=e.snapGrid.map(e=>e+t),e.slidesGrid=e.slidesGrid.map(e=>e+i)}if(d!==l&&e.emit("slidesLengthChange"),p.length!==v&&(e.params.watchOverflow&&e.checkOverflow(),e.emit("snapGridLengthChange")),u.length!==f&&e.emit("slidesGridLengthChange"),i.watchSlidesProgress&&e.updateSlidesOffset(),e.emit("slidesUpdated"),!(s||i.cssMode||"slide"!==i.effect&&"fade"!==i.effect)){const t=`${i.containerModifierClass}backface-hidden`,n=e.el.classList.contains(t);d<=i.maxBackfaceHiddenSlides?n||e.el.classList.add(t):n&&e.el.classList.remove(t)}},updateAutoHeight:function(e){const t=this,i=[],n=t.virtual&&t.params.virtual.enabled;let r,o=0;"number"==typeof e?t.setTransition(e):!0===e&&t.setTransition(t.params.speed);const a=e=>n?t.slides[t.getSlideIndexByData(e)]:t.slides[e];if("auto"!==t.params.slidesPerView&&t.params.slidesPerView>1)if(t.params.centeredSlides)(t.visibleSlides||[]).forEach(e=>{i.push(e)});else for(r=0;r<Math.ceil(t.params.slidesPerView);r+=1){const e=t.activeIndex+r;if(e>t.slides.length&&!n)break;i.push(a(e))}else i.push(a(t.activeIndex));for(r=0;r<i.length;r+=1)if(void 0!==i[r]){const e=i[r].offsetHeight;o=e>o?e:o}(o||0===o)&&(t.wrapperEl.style.height=`${o}px`)},updateSlidesOffset:function(){const e=this,t=e.slides,i=e.isElement?e.isHorizontal()?e.wrapperEl.offsetLeft:e.wrapperEl.offsetTop:0;for(let n=0;n<t.length;n+=1)t[n].swiperSlideOffset=(e.isHorizontal()?t[n].offsetLeft:t[n].offsetTop)-i-e.cssOverflowAdjustment()},updateSlidesProgress:function(e=this&&this.translate||0){const t=this,i=t.params,{slides:n,rtlTranslate:r,snapGrid:o}=t;if(0===n.length)return;void 0===n[0].swiperSlideOffset&&t.updateSlidesOffset();let a=-e;r&&(a=e),t.visibleSlidesIndexes=[],t.visibleSlides=[];let s=i.spaceBetween;"string"==typeof s&&s.indexOf("%")>=0?s=parseFloat(s.replace("%",""))/100*t.size:"string"==typeof s&&(s=parseFloat(s));for(let e=0;e<n.length;e+=1){const l=n[e];let c=l.swiperSlideOffset;i.cssMode&&i.centeredSlides&&(c-=n[0].swiperSlideOffset);const d=(a+(i.centeredSlides?t.minTranslate():0)-c)/(l.swiperSlideSize+s),p=(a-o[0]+(i.centeredSlides?t.minTranslate():0)-c)/(l.swiperSlideSize+s),u=-(a-c),m=u+t.slidesSizesGrid[e],h=u>=0&&u<=t.size-t.slidesSizesGrid[e],g=u>=0&&u<t.size-1||m>1&&m<=t.size||u<=0&&m>=t.size;g&&(t.visibleSlides.push(l),t.visibleSlidesIndexes.push(e)),Nr(l,g,i.slideVisibleClass),Nr(l,h,i.slideFullyVisibleClass),l.progress=r?-d:d,l.originalProgress=r?-p:p}},updateProgress:function(e){const t=this;if(void 0===e){const i=t.rtlTranslate?-1:1;e=t&&t.translate&&t.translate*i||0}const i=t.params,n=t.maxTranslate()-t.minTranslate();let{progress:r,isBeginning:o,isEnd:a,progressLoop:s}=t;const l=o,c=a;if(0===n)r=0,o=!0,a=!0;else{r=(e-t.minTranslate())/n;const i=Math.abs(e-t.minTranslate())<1,s=Math.abs(e-t.maxTranslate())<1;o=i||r<=0,a=s||r>=1,i&&(r=0),s&&(r=1)}if(i.loop){const i=t.getSlideIndexByData(0),n=t.getSlideIndexByData(t.slides.length-1),r=t.slidesGrid[i],o=t.slidesGrid[n],a=t.slidesGrid[t.slidesGrid.length-1],l=Math.abs(e);s=l>=r?(l-r)/a:(l+a-o)/a,s>1&&(s-=1)}Object.assign(t,{progress:r,progressLoop:s,isBeginning:o,isEnd:a}),(i.watchSlidesProgress||i.centeredSlides&&i.autoHeight)&&t.updateSlidesProgress(e),o&&!l&&t.emit("reachBeginning toEdge"),a&&!c&&t.emit("reachEnd toEdge"),(l&&!o||c&&!a)&&t.emit("fromEdge"),t.emit("progress",r)},updateSlidesClasses:function(){const e=this,{slides:t,params:i,slidesEl:n,activeIndex:r}=e,o=e.virtual&&i.virtual.enabled,a=e.grid&&i.grid&&i.grid.rows>1,s=e=>wr(n,`.${i.slideClass}${e}, swiper-slide${e}`)[0];let l,c,d;if(o)if(i.loop){let t=r-e.virtual.slidesBefore;t<0&&(t=e.virtual.slides.length+t),t>=e.virtual.slides.length&&(t-=e.virtual.slides.length),l=s(`[data-swiper-slide-index="${t}"]`)}else l=s(`[data-swiper-slide-index="${r}"]`);else a?(l=t.find(e=>e.column===r),d=t.find(e=>e.column===r+1),c=t.find(e=>e.column===r-1)):l=t[r];l&&(a||(d=function(e,t){const i=[];for(;e.nextElementSibling;){const n=e.nextElementSibling;t?n.matches(t)&&i.push(n):i.push(n),e=n}return i}(l,`.${i.slideClass}, swiper-slide`)[0],i.loop&&!d&&(d=t[0]),c=function(e,t){const i=[];for(;e.previousElementSibling;){const n=e.previousElementSibling;t?n.matches(t)&&i.push(n):i.push(n),e=n}return i}(l,`.${i.slideClass}, swiper-slide`)[0],i.loop&&0===!c&&(c=t[t.length-1]))),t.forEach(e=>{jr(e,e===l,i.slideActiveClass),jr(e,e===d,i.slideNextClass),jr(e,e===c,i.slidePrevClass)}),e.emitSlidesClasses()},updateActiveIndex:function(e){const t=this,i=t.rtlTranslate?t.translate:-t.translate,{snapGrid:n,params:r,activeIndex:o,realIndex:a,snapIndex:s}=t;let l,c=e;const d=e=>{let i=e-t.virtual.slidesBefore;return i<0&&(i=t.virtual.slides.length+i),i>=t.virtual.slides.length&&(i-=t.virtual.slides.length),i};if(void 0===c&&(c=function(e){const{slidesGrid:t,params:i}=e,n=e.rtlTranslate?e.translate:-e.translate;let r;for(let e=0;e<t.length;e+=1)void 0!==t[e+1]?n>=t[e]&&n<t[e+1]-(t[e+1]-t[e])/2?r=e:n>=t[e]&&n<t[e+1]&&(r=e+1):n>=t[e]&&(r=e);return i.normalizeSlideIndex&&(r<0||void 0===r)&&(r=0),r}(t)),n.indexOf(i)>=0)l=n.indexOf(i);else{const e=Math.min(r.slidesPerGroupSkip,c);l=e+Math.floor((c-e)/r.slidesPerGroup)}if(l>=n.length&&(l=n.length-1),c===o&&!t.params.loop)return void(l!==s&&(t.snapIndex=l,t.emit("snapIndexChange")));if(c===o&&t.params.loop&&t.virtual&&t.params.virtual.enabled)return void(t.realIndex=d(c));const p=t.grid&&r.grid&&r.grid.rows>1;let u;if(t.virtual&&r.virtual.enabled)u=r.loop?d(c):c;else if(p){const e=t.slides.find(e=>e.column===c);let i=parseInt(e.getAttribute("data-swiper-slide-index"),10);Number.isNaN(i)&&(i=Math.max(t.slides.indexOf(e),0)),u=Math.floor(i/r.grid.rows)}else if(t.slides[c]){const e=t.slides[c].getAttribute("data-swiper-slide-index");u=e?parseInt(e,10):c}else u=c;Object.assign(t,{previousSnapIndex:s,snapIndex:l,previousRealIndex:a,realIndex:u,previousIndex:o,activeIndex:c}),t.initialized&&Hr(t),t.emit("activeIndexChange"),t.emit("snapIndexChange"),(t.initialized||t.params.runCallbacksOnInit)&&(a!==u&&t.emit("realIndexChange"),t.emit("slideChange"))},updateClickedSlide:function(e,t){const i=this,n=i.params;let r=e.closest(`.${n.slideClass}, swiper-slide`);!r&&i.isElement&&t&&t.length>1&&t.includes(e)&&[...t.slice(t.indexOf(e)+1,t.length)].forEach(e=>{!r&&e.matches&&e.matches(`.${n.slideClass}, swiper-slide`)&&(r=e)});let o,a=!1;if(r)for(let e=0;e<i.slides.length;e+=1)if(i.slides[e]===r){a=!0,o=e;break}if(!r||!a)return i.clickedSlide=void 0,void(i.clickedIndex=void 0);i.clickedSlide=r,i.virtual&&i.params.virtual.enabled?i.clickedIndex=parseInt(r.getAttribute("data-swiper-slide-index"),10):i.clickedIndex=o,n.slideToClickedSlide&&void 0!==i.clickedIndex&&i.clickedIndex!==i.activeIndex&&i.slideToClickedSlide()}};var Ur={getTranslate:function(e=(this.isHorizontal()?"x":"y")){const{params:t,rtlTranslate:i,translate:n,wrapperEl:r}=this;if(t.virtualTranslate)return i?-n:n;if(t.cssMode)return n;let o=vr(r,e);return o+=this.cssOverflowAdjustment(),i&&(o=-o),o||0},setTranslate:function(e,t){const i=this,{rtlTranslate:n,params:r,wrapperEl:o,progress:a}=i;let s,l=0,c=0;i.isHorizontal()?l=n?-e:e:c=e,r.roundLengths&&(l=Math.floor(l),c=Math.floor(c)),i.previousTranslate=i.translate,i.translate=i.isHorizontal()?l:c,r.cssMode?o[i.isHorizontal()?"scrollLeft":"scrollTop"]=i.isHorizontal()?-l:-c:r.virtualTranslate||(i.isHorizontal()?l-=i.cssOverflowAdjustment():c-=i.cssOverflowAdjustment(),o.style.transform=`translate3d(${l}px, ${c}px, 0px)`);const d=i.maxTranslate()-i.minTranslate();s=0===d?0:(e-i.minTranslate())/d,s!==a&&i.updateProgress(e),i.emit("setTranslate",i.translate,t)},minTranslate:function(){return-this.snapGrid[0]},maxTranslate:function(){return-this.snapGrid[this.snapGrid.length-1]},translateTo:function(e=0,t=this.params.speed,i=!0,n=!0,r){const o=this,{params:a,wrapperEl:s}=o;if(o.animating&&a.preventInteractionOnTransition)return!1;const l=o.minTranslate(),c=o.maxTranslate();let d;if(d=n&&e>l?l:n&&e<c?c:e,o.updateProgress(d),a.cssMode){const e=o.isHorizontal();if(0===t)s[e?"scrollLeft":"scrollTop"]=-d;else{if(!o.support.smoothScroll)return _r({swiper:o,targetPosition:-d,side:e?"left":"top"}),!0;s.scrollTo({[e?"left":"top"]:-d,behavior:"smooth"})}return!0}return 0===t?(o.setTransition(0),o.setTranslate(d),i&&(o.emit("beforeTransitionStart",t,r),o.emit("transitionEnd"))):(o.setTransition(t),o.setTranslate(d),i&&(o.emit("beforeTransitionStart",t,r),o.emit("transitionStart")),o.animating||(o.animating=!0,o.onTranslateToWrapperTransitionEnd||(o.onTranslateToWrapperTransitionEnd=function(e){o&&!o.destroyed&&e.target===this&&(o.wrapperEl.removeEventListener("transitionend",o.onTranslateToWrapperTransitionEnd),o.onTranslateToWrapperTransitionEnd=null,delete o.onTranslateToWrapperTransitionEnd,o.animating=!1,i&&o.emit("transitionEnd"))}),o.wrapperEl.addEventListener("transitionend",o.onTranslateToWrapperTransitionEnd))),!0}};function Vr({swiper:e,runCallbacks:t,direction:i,step:n}){const{activeIndex:r,previousIndex:o}=e;let a=i;a||(a=r>o?"next":r<o?"prev":"reset"),e.emit(`transition${n}`),t&&"reset"===a?e.emit(`slideResetTransition${n}`):t&&r!==o&&(e.emit(`slideChangeTransition${n}`),"next"===a?e.emit(`slideNextTransition${n}`):e.emit(`slidePrevTransition${n}`))}var qr={setTransition:function(e,t){const i=this;i.params.cssMode||(i.wrapperEl.style.transitionDuration=`${e}ms`,i.wrapperEl.style.transitionDelay=0===e?"0ms":""),i.emit("setTransition",e,t)},transitionStart:function(e=!0,t){const i=this,{params:n}=i;n.cssMode||(n.autoHeight&&i.updateAutoHeight(),Vr({swiper:i,runCallbacks:e,direction:t,step:"Start"}))},transitionEnd:function(e=!0,t){const i=this,{params:n}=i;i.animating=!1,n.cssMode||(i.setTransition(0),Vr({swiper:i,runCallbacks:e,direction:t,step:"End"}))}};var Wr={slideTo:function(e=0,t,i=!0,n,r){"string"==typeof e&&(e=parseInt(e,10));const o=this;let a=e;a<0&&(a=0);const{params:s,snapGrid:l,slidesGrid:c,previousIndex:d,activeIndex:p,rtlTranslate:u,wrapperEl:m,enabled:h}=o;if(!h&&!n&&!r||o.destroyed||o.animating&&s.preventInteractionOnTransition)return!1;void 0===t&&(t=o.params.speed);const g=Math.min(o.params.slidesPerGroupSkip,a);let v=g+Math.floor((a-g)/o.params.slidesPerGroup);v>=l.length&&(v=l.length-1);const f=-l[v];if(s.normalizeSlideIndex)for(let e=0;e<c.length;e+=1){const t=-Math.floor(100*f),i=Math.floor(100*c[e]),n=Math.floor(100*c[e+1]);void 0!==c[e+1]?t>=i&&t<n-(n-i)/2?a=e:t>=i&&t<n&&(a=e+1):t>=i&&(a=e)}if(o.initialized&&a!==p){if(!o.allowSlideNext&&(u?f>o.translate&&f>o.minTranslate():f<o.translate&&f<o.minTranslate()))return!1;if(!o.allowSlidePrev&&f>o.translate&&f>o.maxTranslate()&&(p||0)!==a)return!1}let b;a!==(d||0)&&i&&o.emit("beforeSlideChangeStart"),o.updateProgress(f),b=a>p?"next":a<p?"prev":"reset";const y=o.virtual&&o.params.virtual.enabled;if(!(y&&r)&&(u&&-f===o.translate||!u&&f===o.translate))return o.updateActiveIndex(a),s.autoHeight&&o.updateAutoHeight(),o.updateSlidesClasses(),"slide"!==s.effect&&o.setTranslate(f),"reset"!==b&&(o.transitionStart(i,b),o.transitionEnd(i,b)),!1;if(s.cssMode){const e=o.isHorizontal(),i=u?f:-f;if(0===t)y&&(o.wrapperEl.style.scrollSnapType="none",o._immediateVirtual=!0),y&&!o._cssModeVirtualInitialSet&&o.params.initialSlide>0?(o._cssModeVirtualInitialSet=!0,requestAnimationFrame(()=>{m[e?"scrollLeft":"scrollTop"]=i})):m[e?"scrollLeft":"scrollTop"]=i,y&&requestAnimationFrame(()=>{o.wrapperEl.style.scrollSnapType="",o._immediateVirtual=!1});else{if(!o.support.smoothScroll)return _r({swiper:o,targetPosition:i,side:e?"left":"top"}),!0;m.scrollTo({[e?"left":"top"]:i,behavior:"smooth"})}return!0}const x=Dr().isSafari;return y&&!r&&x&&o.isElement&&o.virtual.update(!1,!1,a),o.setTransition(t),o.setTranslate(f),o.updateActiveIndex(a),o.updateSlidesClasses(),o.emit("beforeTransitionStart",t,n),o.transitionStart(i,b),0===t?o.transitionEnd(i,b):o.animating||(o.animating=!0,o.onSlideToWrapperTransitionEnd||(o.onSlideToWrapperTransitionEnd=function(e){o&&!o.destroyed&&e.target===this&&(o.wrapperEl.removeEventListener("transitionend",o.onSlideToWrapperTransitionEnd),o.onSlideToWrapperTransitionEnd=null,delete o.onSlideToWrapperTransitionEnd,o.transitionEnd(i,b))}),o.wrapperEl.addEventListener("transitionend",o.onSlideToWrapperTransitionEnd)),!0},slideToLoop:function(e=0,t,i=!0,n){if("string"==typeof e){e=parseInt(e,10)}const r=this;if(r.destroyed)return;void 0===t&&(t=r.params.speed);const o=r.grid&&r.params.grid&&r.params.grid.rows>1;let a=e;if(r.params.loop)if(r.virtual&&r.params.virtual.enabled)a+=r.virtual.slidesBefore;else{let e;if(o){const t=a*r.params.grid.rows;e=r.slides.find(e=>1*e.getAttribute("data-swiper-slide-index")===t).column}else e=r.getSlideIndexByData(a);const t=o?Math.ceil(r.slides.length/r.params.grid.rows):r.slides.length,{centeredSlides:i,slidesOffsetBefore:s,slidesOffsetAfter:l}=r.params,c=i||!!s||!!l;let d=r.params.slidesPerView;"auto"===d?d=r.slidesPerViewDynamic():(d=Math.ceil(parseFloat(r.params.slidesPerView,10)),c&&d%2==0&&(d+=1));let p=t-e<d;if(c&&(p=p||e<Math.ceil(d/2)),n&&c&&"auto"!==r.params.slidesPerView&&!o&&(p=!1),p){const i=c?e<r.activeIndex?"prev":"next":e-r.activeIndex-1<r.params.slidesPerView?"next":"prev";r.loopFix({direction:i,slideTo:!0,activeSlideIndex:"next"===i?e+1:e-t+1,slideRealIndex:"next"===i?r.realIndex:void 0})}if(o){const e=a*r.params.grid.rows;a=r.slides.find(t=>1*t.getAttribute("data-swiper-slide-index")===e).column}else a=r.getSlideIndexByData(a)}return requestAnimationFrame(()=>{r.slideTo(a,t,i,n)}),r},slideNext:function(e,t=!0,i){const n=this,{enabled:r,params:o,animating:a}=n;if(!r||n.destroyed)return n;void 0===e&&(e=n.params.speed);let s=o.slidesPerGroup;"auto"===o.slidesPerView&&1===o.slidesPerGroup&&o.slidesPerGroupAuto&&(s=Math.max(n.slidesPerViewDynamic("current",!0),1));const l=n.activeIndex<o.slidesPerGroupSkip?1:s,c=n.virtual&&o.virtual.enabled;if(o.loop){if(a&&!c&&o.loopPreventsSliding)return!1;if(n.loopFix({direction:"next"}),n._clientLeft=n.wrapperEl.clientLeft,n.activeIndex===n.slides.length-1&&o.cssMode)return requestAnimationFrame(()=>{n.slideTo(n.activeIndex+l,e,t,i)}),!0}return o.rewind&&n.isEnd?n.slideTo(0,e,t,i):n.slideTo(n.activeIndex+l,e,t,i)},slidePrev:function(e,t=!0,i){const n=this,{params:r,snapGrid:o,slidesGrid:a,rtlTranslate:s,enabled:l,animating:c}=n;if(!l||n.destroyed)return n;void 0===e&&(e=n.params.speed);const d=n.virtual&&r.virtual.enabled;if(r.loop){if(c&&!d&&r.loopPreventsSliding)return!1;n.loopFix({direction:"prev"}),n._clientLeft=n.wrapperEl.clientLeft}function p(e){return e<0?-Math.floor(Math.abs(e)):Math.floor(e)}const u=p(s?n.translate:-n.translate),m=o.map(e=>p(e)),h=r.freeMode&&r.freeMode.enabled;let g=o[m.indexOf(u)-1];if(void 0===g&&(r.cssMode||h)){let e;o.forEach((t,i)=>{u>=t&&(e=i)}),void 0!==e&&(g=h?o[e]:o[e>0?e-1:e])}let v=0;if(void 0!==g&&(v=a.indexOf(g),v<0&&(v=n.activeIndex-1),"auto"===r.slidesPerView&&1===r.slidesPerGroup&&r.slidesPerGroupAuto&&(v=v-n.slidesPerViewDynamic("previous",!0)+1,v=Math.max(v,0))),r.rewind&&n.isBeginning){const r=n.params.virtual&&n.params.virtual.enabled&&n.virtual?n.virtual.slides.length-1:n.slides.length-1;return n.slideTo(r,e,t,i)}return r.loop&&0===n.activeIndex&&r.cssMode?(requestAnimationFrame(()=>{n.slideTo(v,e,t,i)}),!0):n.slideTo(v,e,t,i)},slideReset:function(e,t=!0,i){const n=this;if(!n.destroyed)return void 0===e&&(e=n.params.speed),n.slideTo(n.activeIndex,e,t,i)},slideToClosest:function(e,t=!0,i,n=.5){const r=this;if(r.destroyed)return;void 0===e&&(e=r.params.speed);let o=r.activeIndex;const a=Math.min(r.params.slidesPerGroupSkip,o),s=a+Math.floor((o-a)/r.params.slidesPerGroup),l=r.rtlTranslate?r.translate:-r.translate;if(l>=r.snapGrid[s]){const e=r.snapGrid[s];l-e>(r.snapGrid[s+1]-e)*n&&(o+=r.params.slidesPerGroup)}else{const e=r.snapGrid[s-1];l-e<=(r.snapGrid[s]-e)*n&&(o-=r.params.slidesPerGroup)}return o=Math.max(o,0),o=Math.min(o,r.slidesGrid.length-1),r.slideTo(o,e,t,i)},slideToClickedSlide:function(){const e=this;if(e.destroyed)return;const{params:t,slidesEl:i}=e,n="auto"===t.slidesPerView?e.slidesPerViewDynamic():t.slidesPerView;let r,o=e.getSlideIndexWhenGrid(e.clickedIndex);const a=e.isElement?"swiper-slide":`.${t.slideClass}`,s=e.grid&&e.params.grid&&e.params.grid.rows>1;if(t.loop){if(e.animating)return;r=parseInt(e.clickedSlide.getAttribute("data-swiper-slide-index"),10),t.centeredSlides?e.slideToLoop(r):o>(s?(e.slides.length-n)/2-(e.params.grid.rows-1):e.slides.length-n)?(e.loopFix(),o=e.getSlideIndex(wr(i,`${a}[data-swiper-slide-index="${r}"]`)[0]),hr(()=>{e.slideTo(o)})):e.slideTo(o)}else e.slideTo(o)}};var Qr={loopCreate:function(e,t){const i=this,{params:n,slidesEl:r}=i;if(!n.loop||i.virtual&&i.params.virtual.enabled)return;const o=()=>{wr(r,`.${n.slideClass}, swiper-slide`).forEach((e,t)=>{e.setAttribute("data-swiper-slide-index",t)})},a=i.grid&&n.grid&&n.grid.rows>1;n.loopAddBlankSlides&&(n.slidesPerGroup>1||a)&&(()=>{const e=wr(r,`.${n.slideBlankClass}`);e.forEach(e=>{e.remove()}),e.length>0&&(i.recalcSlides(),i.updateSlides())})();const s=n.slidesPerGroup*(a?n.grid.rows:1),l=i.slides.length%s!==0,c=a&&i.slides.length%n.grid.rows!==0,d=e=>{for(let t=0;t<e;t+=1){const e=i.isElement?$r("swiper-slide",[n.slideBlankClass]):$r("div",[n.slideClass,n.slideBlankClass]);i.slidesEl.append(e)}};if(l){if(n.loopAddBlankSlides){d(s-i.slides.length%s),i.recalcSlides(),i.updateSlides()}else kr("Swiper Loop Warning: The number of slides is not even to slidesPerGroup, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");o()}else if(c){if(n.loopAddBlankSlides){d(n.grid.rows-i.slides.length%n.grid.rows),i.recalcSlides(),i.updateSlides()}else kr("Swiper Loop Warning: The number of slides is not even to grid.rows, loop mode may not function properly. You need to add more slides (or make duplicates, or empty slides)");o()}else o();const p=n.centeredSlides||!!n.slidesOffsetBefore||!!n.slidesOffsetAfter;i.loopFix({slideRealIndex:e,direction:p?void 0:"next",initial:t})},loopFix:function({slideRealIndex:e,slideTo:t=!0,direction:i,setTranslate:n,activeSlideIndex:r,initial:o,byController:a,byMousewheel:s}={}){const l=this;if(!l.params.loop)return;l.emit("beforeLoopFix");const{slides:c,allowSlidePrev:d,allowSlideNext:p,slidesEl:u,params:m}=l,{centeredSlides:h,slidesOffsetBefore:g,slidesOffsetAfter:v,initialSlide:f}=m,b=h||!!g||!!v;if(l.allowSlidePrev=!0,l.allowSlideNext=!0,l.virtual&&m.virtual.enabled)return t&&(b||0!==l.snapIndex?b&&l.snapIndex<m.slidesPerView?l.slideTo(l.virtual.slides.length+l.snapIndex,0,!1,!0):l.snapIndex===l.snapGrid.length-1&&l.slideTo(l.virtual.slidesBefore,0,!1,!0):l.slideTo(l.virtual.slides.length,0,!1,!0)),l.allowSlidePrev=d,l.allowSlideNext=p,void l.emit("loopFix");let y=m.slidesPerView;"auto"===y?y=l.slidesPerViewDynamic():(y=Math.ceil(parseFloat(m.slidesPerView,10)),b&&y%2==0&&(y+=1));const x=m.slidesPerGroupAuto?y:m.slidesPerGroup;let _=b?Math.max(x,Math.ceil(y/2)):x;_%x!==0&&(_+=x-_%x),_+=m.loopAdditionalSlides,l.loopedSlides=_;const w=l.grid&&m.grid&&m.grid.rows>1;c.length<y+_||"cards"===l.params.effect&&c.length<y+2*_?kr("Swiper Loop Warning: The number of slides is not enough for loop mode, it will be disabled or not function properly. You need to add more slides (or make duplicates) or lower the values of slidesPerView and slidesPerGroup parameters"):w&&"row"===m.grid.fill&&kr("Swiper Loop Warning: Loop mode is not compatible with grid.fill = `row`");const k=[],$=[],S=w?Math.ceil(c.length/m.grid.rows):c.length,C=o&&S-f<y&&!b;let T=C?f:l.activeIndex;void 0===r?r=l.getSlideIndex(c.find(e=>e.classList.contains(m.slideActiveClass))):T=r;const M="next"===i||!i,z="prev"===i||!i;let A=0,E=0;const P=(w?c[r].column:r)+(b&&void 0===n?-y/2+.5:0);if(P<_){A=Math.max(_-P,x);for(let e=0;e<_-P;e+=1){const t=e-Math.floor(e/S)*S;if(w){const e=S-t-1;for(let t=c.length-1;t>=0;t-=1)c[t].column===e&&k.push(t)}else k.push(S-t-1)}}else if(P+y>S-_){E=Math.max(P-(S-2*_),x),C&&(E=Math.max(E,y-S+f+1));for(let e=0;e<E;e+=1){const t=e-Math.floor(e/S)*S;w?c.forEach((e,i)=>{e.column===t&&$.push(i)}):$.push(t)}}if(l.__preventObserver__=!0,requestAnimationFrame(()=>{l.__preventObserver__=!1}),"cards"===l.params.effect&&c.length<y+2*_&&($.includes(r)&&$.splice($.indexOf(r),1),k.includes(r)&&k.splice(k.indexOf(r),1)),z&&k.forEach(e=>{c[e].swiperLoopMoveDOM=!0,u.prepend(c[e]),c[e].swiperLoopMoveDOM=!1}),M&&$.forEach(e=>{c[e].swiperLoopMoveDOM=!0,u.append(c[e]),c[e].swiperLoopMoveDOM=!1}),l.recalcSlides(),"auto"===m.slidesPerView?l.updateSlides():w&&(k.length>0&&z||$.length>0&&M)&&l.slides.forEach((e,t)=>{l.grid.updateSlide(t,e,l.slides)}),m.watchSlidesProgress&&l.updateSlidesOffset(),t)if(k.length>0&&z){if(void 0===e){const e=l.slidesGrid[T],t=l.slidesGrid[T+A]-e;s?l.setTranslate(l.translate-t):(l.slideTo(T+Math.ceil(A),0,!1,!0),n&&(l.touchEventsData.startTranslate=l.touchEventsData.startTranslate-t,l.touchEventsData.currentTranslate=l.touchEventsData.currentTranslate-t))}else if(n){const e=w?k.length/m.grid.rows:k.length;l.slideTo(l.activeIndex+e,0,!1,!0),l.touchEventsData.currentTranslate=l.translate}}else if($.length>0&&M)if(void 0===e){const e=l.slidesGrid[T],t=l.slidesGrid[T-E]-e;s?l.setTranslate(l.translate-t):(l.slideTo(T-E,0,!1,!0),n&&(l.touchEventsData.startTranslate=l.touchEventsData.startTranslate-t,l.touchEventsData.currentTranslate=l.touchEventsData.currentTranslate-t))}else{const e=w?$.length/m.grid.rows:$.length;l.slideTo(l.activeIndex-e,0,!1,!0)}if(l.allowSlidePrev=d,l.allowSlideNext=p,l.controller&&l.controller.control&&!a){const o={slideRealIndex:e,direction:i,setTranslate:n,activeSlideIndex:r,byController:!0};Array.isArray(l.controller.control)?l.controller.control.forEach(e=>{!e.destroyed&&e.params.loop&&e.loopFix({...o,slideTo:e.params.slidesPerView===m.slidesPerView&&t})}):l.controller.control instanceof l.constructor&&l.controller.control.params.loop&&l.controller.control.loopFix({...o,slideTo:l.controller.control.params.slidesPerView===m.slidesPerView&&t})}l.emit("loopFix")},loopDestroy:function(){const e=this,{params:t,slidesEl:i}=e;if(!t.loop||!i||e.virtual&&e.params.virtual.enabled)return;e.recalcSlides();const n=[];e.slides.forEach(e=>{const t=void 0===e.swiperSlideIndex?1*e.getAttribute("data-swiper-slide-index"):e.swiperSlideIndex;n[t]=e}),e.slides.forEach(e=>{e.removeAttribute("data-swiper-slide-index")}),n.forEach(e=>{i.append(e)}),e.recalcSlides(),e.slideTo(e.realIndex,0)}};var Yr={setGrabCursor:function(e){const t=this;if(!t.params.simulateTouch||t.params.watchOverflow&&t.isLocked||t.params.cssMode)return;const i="container"===t.params.touchEventsTarget?t.el:t.wrapperEl;t.isElement&&(t.__preventObserver__=!0),i.style.cursor="move",i.style.cursor=e?"grabbing":"grab",t.isElement&&requestAnimationFrame(()=>{t.__preventObserver__=!1})},unsetGrabCursor:function(){const e=this;e.params.watchOverflow&&e.isLocked||e.params.cssMode||(e.isElement&&(e.__preventObserver__=!0),e["container"===e.params.touchEventsTarget?"el":"wrapperEl"].style.cursor="",e.isElement&&requestAnimationFrame(()=>{e.__preventObserver__=!1}))}};function Xr(e,t,i){const n=mr(),{params:r}=e,o=r.edgeSwipeDetection,a=r.edgeSwipeThreshold;return!o||!(i<=a||i>=n.innerWidth-a)||"prevent"===o&&(t.preventDefault(),!0)}function Kr(e){const t=this,i=pr();let n=e;n.originalEvent&&(n=n.originalEvent);const r=t.touchEventsData;if("pointerdown"===n.type){if(null!==r.pointerId&&r.pointerId!==n.pointerId)return;r.pointerId=n.pointerId}else"touchstart"===n.type&&1===n.targetTouches.length&&(r.touchId=n.targetTouches[0].identifier);if("touchstart"===n.type)return void Xr(t,n,n.targetTouches[0].pageX);const{params:o,touches:a,enabled:s}=t;if(!s)return;if(!o.simulateTouch&&"mouse"===n.pointerType)return;if(t.animating&&o.preventInteractionOnTransition)return;!t.animating&&o.cssMode&&o.loop&&t.loopFix();let l=n.target;if("wrapper"===o.touchEventsTarget&&!function(e,t){const i=mr();let n=t.contains(e);!n&&i.HTMLSlotElement&&t instanceof HTMLSlotElement&&(n=[...t.assignedElements()].includes(e),n||(n=function(e,t){const i=[t];for(;i.length>0;){const t=i.shift();if(e===t)return!0;i.push(...t.children,...t.shadowRoot?t.shadowRoot.children:[],...t.assignedElements?t.assignedElements():[])}}(e,t)));return n}(l,t.wrapperEl))return;if("which"in n&&3===n.which)return;if("button"in n&&n.button>0)return;if(r.isTouched&&r.isMoved)return;const c=!!o.noSwipingClass&&""!==o.noSwipingClass,d=n.composedPath?n.composedPath():n.path;c&&n.target&&n.target.shadowRoot&&d&&(l=d[0]);const p=o.noSwipingSelector?o.noSwipingSelector:`.${o.noSwipingClass}`,u=!(!n.target||!n.target.shadowRoot);if(o.noSwiping&&(u?function(e,t=this){return function t(i){if(!i||i===pr()||i===mr())return null;i.assignedSlot&&(i=i.assignedSlot);const n=i.closest(e);return n||i.getRootNode?n||t(i.getRootNode().host):null}(t)}(p,l):l.closest(p)))return void(t.allowClick=!0);if(o.swipeHandler&&!l.closest(o.swipeHandler))return;a.currentX=n.pageX,a.currentY=n.pageY;const m=a.currentX,h=a.currentY;if(!Xr(t,n,m))return;Object.assign(r,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),a.startX=m,a.startY=h,r.touchStartTime=gr(),t.allowClick=!0,t.updateSize(),t.swipeDirection=void 0,o.threshold>0&&(r.allowThresholdMove=!1);let g=!0;l.matches(r.focusableElements)&&(g=!1,"SELECT"===l.nodeName&&(r.isTouched=!1)),i.activeElement&&i.activeElement.matches(r.focusableElements)&&i.activeElement!==l&&("mouse"===n.pointerType||"mouse"!==n.pointerType&&!l.matches(r.focusableElements))&&i.activeElement.blur();const v=g&&t.allowTouchMove&&o.touchStartPreventDefault;!o.touchStartForcePreventDefault&&!v||l.isContentEditable||n.preventDefault(),o.freeMode&&o.freeMode.enabled&&t.freeMode&&t.animating&&!o.cssMode&&t.freeMode.onTouchStart(),t.emit("touchStart",n)}function Zr(e){const t=pr(),i=this,n=i.touchEventsData,{params:r,touches:o,rtlTranslate:a,enabled:s}=i;if(!s)return;if(!r.simulateTouch&&"mouse"===e.pointerType)return;let l,c=e;if(c.originalEvent&&(c=c.originalEvent),"pointermove"===c.type){if(null!==n.touchId)return;if(c.pointerId!==n.pointerId)return}if("touchmove"===c.type){if(l=[...c.changedTouches].find(e=>e.identifier===n.touchId),!l||l.identifier!==n.touchId)return}else l=c;if(!n.isTouched)return void(n.startMoving&&n.isScrolling&&i.emit("touchMoveOpposite",c));const d=l.pageX,p=l.pageY;if(c.preventedByNestedSwiper)return o.startX=d,void(o.startY=p);if(!i.allowTouchMove)return c.target.matches(n.focusableElements)||(i.allowClick=!1),void(n.isTouched&&(Object.assign(o,{startX:d,startY:p,currentX:d,currentY:p}),n.touchStartTime=gr()));if(r.touchReleaseOnEdges&&!r.loop)if(i.isVertical()){if(p<o.startY&&i.translate<=i.maxTranslate()||p>o.startY&&i.translate>=i.minTranslate())return n.isTouched=!1,void(n.isMoved=!1)}else{if(a&&(d>o.startX&&-i.translate<=i.maxTranslate()||d<o.startX&&-i.translate>=i.minTranslate()))return;if(!a&&(d<o.startX&&i.translate<=i.maxTranslate()||d>o.startX&&i.translate>=i.minTranslate()))return}if(t.activeElement&&t.activeElement.matches(n.focusableElements)&&t.activeElement!==c.target&&"mouse"!==c.pointerType&&t.activeElement.blur(),t.activeElement&&c.target===t.activeElement&&c.target.matches(n.focusableElements))return n.isMoved=!0,void(i.allowClick=!1);n.allowTouchCallbacks&&i.emit("touchMove",c),o.previousX=o.currentX,o.previousY=o.currentY,o.currentX=d,o.currentY=p;const u=o.currentX-o.startX,m=o.currentY-o.startY;if(i.params.threshold&&Math.sqrt(u**2+m**2)<i.params.threshold)return;if(void 0===n.isScrolling){let e;i.isHorizontal()&&o.currentY===o.startY||i.isVertical()&&o.currentX===o.startX?n.isScrolling=!1:u*u+m*m>=25&&(e=180*Math.atan2(Math.abs(m),Math.abs(u))/Math.PI,n.isScrolling=i.isHorizontal()?e>r.touchAngle:90-e>r.touchAngle)}if(n.isScrolling&&i.emit("touchMoveOpposite",c),void 0===n.startMoving&&(o.currentX===o.startX&&o.currentY===o.startY||(n.startMoving=!0)),n.isScrolling||"touchmove"===c.type&&n.preventTouchMoveFromPointerMove)return void(n.isTouched=!1);if(!n.startMoving)return;i.allowClick=!1,!r.cssMode&&c.cancelable&&c.preventDefault(),r.touchMoveStopPropagation&&!r.nested&&c.stopPropagation();let h=i.isHorizontal()?u:m,g=i.isHorizontal()?o.currentX-o.previousX:o.currentY-o.previousY;r.oneWayMovement&&(h=Math.abs(h)*(a?1:-1),g=Math.abs(g)*(a?1:-1)),o.diff=h,h*=r.touchRatio,a&&(h=-h,g=-g);const v=i.touchesDirection;i.swipeDirection=h>0?"prev":"next",i.touchesDirection=g>0?"prev":"next";const f=i.params.loop&&!r.cssMode,b="next"===i.touchesDirection&&i.allowSlideNext||"prev"===i.touchesDirection&&i.allowSlidePrev;if(!n.isMoved){if(f&&b&&i.loopFix({direction:i.swipeDirection}),n.startTranslate=i.getTranslate(),i.setTransition(0),i.animating){const e=new window.CustomEvent("transitionend",{bubbles:!0,cancelable:!0,detail:{bySwiperTouchMove:!0}});i.wrapperEl.dispatchEvent(e)}n.allowMomentumBounce=!1,!r.grabCursor||!0!==i.allowSlideNext&&!0!==i.allowSlidePrev||i.setGrabCursor(!0),i.emit("sliderFirstMove",c)}if((new Date).getTime(),!1!==r._loopSwapReset&&n.isMoved&&n.allowThresholdMove&&v!==i.touchesDirection&&f&&b&&Math.abs(h)>=1)return Object.assign(o,{startX:d,startY:p,currentX:d,currentY:p,startTranslate:n.currentTranslate}),n.loopSwapReset=!0,void(n.startTranslate=n.currentTranslate);i.emit("sliderMove",c),n.isMoved=!0,n.currentTranslate=h+n.startTranslate;let y=!0,x=r.resistanceRatio;if(r.touchReleaseOnEdges&&(x=0),h>0?(f&&b&&n.allowThresholdMove&&n.currentTranslate>(r.centeredSlides?i.minTranslate()-i.slidesSizesGrid[i.activeIndex+1]-("auto"!==r.slidesPerView&&i.slides.length-r.slidesPerView>=2?i.slidesSizesGrid[i.activeIndex+1]+i.params.spaceBetween:0)-i.params.spaceBetween:i.minTranslate())&&i.loopFix({direction:"prev",setTranslate:!0,activeSlideIndex:0}),n.currentTranslate>i.minTranslate()&&(y=!1,r.resistance&&(n.currentTranslate=i.minTranslate()-1+(-i.minTranslate()+n.startTranslate+h)**x))):h<0&&(f&&b&&n.allowThresholdMove&&n.currentTranslate<(r.centeredSlides?i.maxTranslate()+i.slidesSizesGrid[i.slidesSizesGrid.length-1]+i.params.spaceBetween+("auto"!==r.slidesPerView&&i.slides.length-r.slidesPerView>=2?i.slidesSizesGrid[i.slidesSizesGrid.length-1]+i.params.spaceBetween:0):i.maxTranslate())&&i.loopFix({direction:"next",setTranslate:!0,activeSlideIndex:i.slides.length-("auto"===r.slidesPerView?i.slidesPerViewDynamic():Math.ceil(parseFloat(r.slidesPerView,10)))}),n.currentTranslate<i.maxTranslate()&&(y=!1,r.resistance&&(n.currentTranslate=i.maxTranslate()+1-(i.maxTranslate()-n.startTranslate-h)**x))),y&&(c.preventedByNestedSwiper=!0),!i.allowSlideNext&&"next"===i.swipeDirection&&n.currentTranslate<n.startTranslate&&(n.currentTranslate=n.startTranslate),!i.allowSlidePrev&&"prev"===i.swipeDirection&&n.currentTranslate>n.startTranslate&&(n.currentTranslate=n.startTranslate),i.allowSlidePrev||i.allowSlideNext||(n.currentTranslate=n.startTranslate),r.threshold>0){if(!(Math.abs(h)>r.threshold||n.allowThresholdMove))return void(n.currentTranslate=n.startTranslate);if(!n.allowThresholdMove)return n.allowThresholdMove=!0,o.startX=o.currentX,o.startY=o.currentY,n.currentTranslate=n.startTranslate,void(o.diff=i.isHorizontal()?o.currentX-o.startX:o.currentY-o.startY)}r.followFinger&&!r.cssMode&&((r.freeMode&&r.freeMode.enabled&&i.freeMode||r.watchSlidesProgress)&&(i.updateActiveIndex(),i.updateSlidesClasses()),r.freeMode&&r.freeMode.enabled&&i.freeMode&&i.freeMode.onTouchMove(),i.updateProgress(n.currentTranslate),i.setTranslate(n.currentTranslate))}function Jr(e){const t=this,i=t.touchEventsData;let n,r=e;r.originalEvent&&(r=r.originalEvent);if("touchend"===r.type||"touchcancel"===r.type){if(n=[...r.changedTouches].find(e=>e.identifier===i.touchId),!n||n.identifier!==i.touchId)return}else{if(null!==i.touchId)return;if(r.pointerId!==i.pointerId)return;n=r}if(["pointercancel","pointerout","pointerleave","contextmenu"].includes(r.type)){if(!(["pointercancel","contextmenu"].includes(r.type)&&(t.browser.isSafari||t.browser.isWebView)))return}i.pointerId=null,i.touchId=null;const{params:o,touches:a,rtlTranslate:s,slidesGrid:l,enabled:c}=t;if(!c)return;if(!o.simulateTouch&&"mouse"===r.pointerType)return;if(i.allowTouchCallbacks&&t.emit("touchEnd",r),i.allowTouchCallbacks=!1,!i.isTouched)return i.isMoved&&o.grabCursor&&t.setGrabCursor(!1),i.isMoved=!1,void(i.startMoving=!1);o.grabCursor&&i.isMoved&&i.isTouched&&(!0===t.allowSlideNext||!0===t.allowSlidePrev)&&t.setGrabCursor(!1);const d=gr(),p=d-i.touchStartTime;if(t.allowClick){const e=r.path||r.composedPath&&r.composedPath();t.updateClickedSlide(e&&e[0]||r.target,e),t.emit("tap click",r),p<300&&d-i.lastClickTime<300&&t.emit("doubleTap doubleClick",r)}if(i.lastClickTime=gr(),hr(()=>{t.destroyed||(t.allowClick=!0)}),!i.isTouched||!i.isMoved||!t.swipeDirection||0===a.diff&&!i.loopSwapReset||i.currentTranslate===i.startTranslate&&!i.loopSwapReset)return i.isTouched=!1,i.isMoved=!1,void(i.startMoving=!1);let u;if(i.isTouched=!1,i.isMoved=!1,i.startMoving=!1,u=o.followFinger?s?t.translate:-t.translate:-i.currentTranslate,o.cssMode)return;if(o.freeMode&&o.freeMode.enabled)return void t.freeMode.onTouchEnd({currentPos:u});const m=u>=-t.maxTranslate()&&!t.params.loop;let h=0,g=t.slidesSizesGrid[0];for(let e=0;e<l.length;e+=e<o.slidesPerGroupSkip?1:o.slidesPerGroup){const t=e<o.slidesPerGroupSkip-1?1:o.slidesPerGroup;void 0!==l[e+t]?(m||u>=l[e]&&u<l[e+t])&&(h=e,g=l[e+t]-l[e]):(m||u>=l[e])&&(h=e,g=l[l.length-1]-l[l.length-2])}let v=null,f=null;o.rewind&&(t.isBeginning?f=o.virtual&&o.virtual.enabled&&t.virtual?t.virtual.slides.length-1:t.slides.length-1:t.isEnd&&(v=0));const b=(u-l[h])/g,y=h<o.slidesPerGroupSkip-1?1:o.slidesPerGroup;if(p>o.longSwipesMs){if(!o.longSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&(b>=o.longSwipesRatio?t.slideTo(o.rewind&&t.isEnd?v:h+y):t.slideTo(h)),"prev"===t.swipeDirection&&(b>1-o.longSwipesRatio?t.slideTo(h+y):null!==f&&b<0&&Math.abs(b)>o.longSwipesRatio?t.slideTo(f):t.slideTo(h))}else{if(!o.shortSwipes)return void t.slideTo(t.activeIndex);t.navigation&&(r.target===t.navigation.nextEl||r.target===t.navigation.prevEl)?r.target===t.navigation.nextEl?t.slideTo(h+y):t.slideTo(h):("next"===t.swipeDirection&&t.slideTo(null!==v?v:h+y),"prev"===t.swipeDirection&&t.slideTo(null!==f?f:h))}}function eo(){const e=this,{params:t,el:i}=e;if(i&&0===i.offsetWidth)return;t.breakpoints&&e.setBreakpoint();const{allowSlideNext:n,allowSlidePrev:r,snapGrid:o}=e,a=e.virtual&&e.params.virtual.enabled;e.allowSlideNext=!0,e.allowSlidePrev=!0,e.updateSize(),e.updateSlides(),e.updateSlidesClasses();const s=a&&t.loop;!("auto"===t.slidesPerView||t.slidesPerView>1)||!e.isEnd||e.isBeginning||e.params.centeredSlides||s?e.params.loop&&!a?e.slideToLoop(e.realIndex,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0):e.slideTo(e.slides.length-1,0,!1,!0),e.autoplay&&e.autoplay.running&&e.autoplay.paused&&(clearTimeout(e.autoplay.resizeTimeout),e.autoplay.resizeTimeout=setTimeout(()=>{e.autoplay&&e.autoplay.running&&e.autoplay.paused&&e.autoplay.resume()},500)),e.allowSlidePrev=r,e.allowSlideNext=n,e.params.watchOverflow&&o!==e.snapGrid&&e.checkOverflow()}function to(e){const t=this;t.enabled&&(t.allowClick||(t.params.preventClicks&&e.preventDefault(),t.params.preventClicksPropagation&&t.animating&&(e.stopPropagation(),e.stopImmediatePropagation())))}function io(){const e=this,{wrapperEl:t,rtlTranslate:i,enabled:n}=e;if(!n)return;let r;e.previousTranslate=e.translate,e.isHorizontal()?e.translate=-t.scrollLeft:e.translate=-t.scrollTop,0===e.translate&&(e.translate=0),e.updateActiveIndex(),e.updateSlidesClasses();const o=e.maxTranslate()-e.minTranslate();r=0===o?0:(e.translate-e.minTranslate())/o,r!==e.progress&&e.updateProgress(i?-e.translate:e.translate),e.emit("setTranslate",e.translate,!1)}function no(e){const t=this;Fr(t,e.target),t.params.cssMode||"auto"!==t.params.slidesPerView&&!t.params.autoHeight||t.update()}function ro(){const e=this;e.documentTouchHandlerProceeded||(e.documentTouchHandlerProceeded=!0,e.params.touchReleaseOnEdges&&(e.el.style.touchAction="auto"))}const oo=(e,t)=>{const i=pr(),{params:n,el:r,wrapperEl:o,device:a}=e,s=!!n.nested,l="on"===t?"addEventListener":"removeEventListener",c=t;r&&"string"!=typeof r&&(i[l]("touchstart",e.onDocumentTouchStart,{passive:!1,capture:s}),r[l]("touchstart",e.onTouchStart,{passive:!1}),r[l]("pointerdown",e.onTouchStart,{passive:!1}),i[l]("touchmove",e.onTouchMove,{passive:!1,capture:s}),i[l]("pointermove",e.onTouchMove,{passive:!1,capture:s}),i[l]("touchend",e.onTouchEnd,{passive:!0}),i[l]("pointerup",e.onTouchEnd,{passive:!0}),i[l]("pointercancel",e.onTouchEnd,{passive:!0}),i[l]("touchcancel",e.onTouchEnd,{passive:!0}),i[l]("pointerout",e.onTouchEnd,{passive:!0}),i[l]("pointerleave",e.onTouchEnd,{passive:!0}),i[l]("contextmenu",e.onTouchEnd,{passive:!0}),(n.preventClicks||n.preventClicksPropagation)&&r[l]("click",e.onClick,!0),n.cssMode&&o[l]("scroll",e.onScroll),n.updateOnWindowResize?e[c](a.ios||a.android?"resize orientationchange observerUpdate":"resize observerUpdate",eo,!0):e[c]("observerUpdate",eo,!0),r[l]("load",e.onLoad,{capture:!0}))};var ao={attachEvents:function(){const e=this,{params:t}=e;e.onTouchStart=Kr.bind(e),e.onTouchMove=Zr.bind(e),e.onTouchEnd=Jr.bind(e),e.onDocumentTouchStart=ro.bind(e),t.cssMode&&(e.onScroll=io.bind(e)),e.onClick=to.bind(e),e.onLoad=no.bind(e),oo(e,"on")},detachEvents:function(){oo(this,"off")}};const so=(e,t)=>e.grid&&t.grid&&t.grid.rows>1;var lo={setBreakpoint:function(){const e=this,{realIndex:t,initialized:i,params:n,el:r}=e,o=n.breakpoints;if(!o||o&&0===Object.keys(o).length)return;const a=pr(),s="window"!==n.breakpointsBase&&n.breakpointsBase?"container":n.breakpointsBase,l=["window","container"].includes(n.breakpointsBase)||!n.breakpointsBase?e.el:a.querySelector(n.breakpointsBase),c=e.getBreakpoint(o,s,l);if(!c||e.currentBreakpoint===c)return;const d=(c in o?o[c]:void 0)||e.originalParams,p=so(e,n),u=so(e,d),m=e.params.grabCursor,h=d.grabCursor,g=n.enabled;p&&!u?(r.classList.remove(`${n.containerModifierClass}grid`,`${n.containerModifierClass}grid-column`),e.emitContainerClasses()):!p&&u&&(r.classList.add(`${n.containerModifierClass}grid`),(d.grid.fill&&"column"===d.grid.fill||!d.grid.fill&&"column"===n.grid.fill)&&r.classList.add(`${n.containerModifierClass}grid-column`),e.emitContainerClasses()),m&&!h?e.unsetGrabCursor():!m&&h&&e.setGrabCursor(),["navigation","pagination","scrollbar"].forEach(t=>{if(void 0===d[t])return;const i=n[t]&&n[t].enabled,r=d[t]&&d[t].enabled;i&&!r&&e[t].disable(),!i&&r&&e[t].enable()});const v=d.direction&&d.direction!==n.direction,f=n.loop&&(d.slidesPerView!==n.slidesPerView||v),b=n.loop;v&&i&&e.changeDirection(),yr(e.params,d);const y=e.params.enabled,x=e.params.loop;Object.assign(e,{allowTouchMove:e.params.allowTouchMove,allowSlideNext:e.params.allowSlideNext,allowSlidePrev:e.params.allowSlidePrev}),g&&!y?e.disable():!g&&y&&e.enable(),e.currentBreakpoint=c,e.emit("_beforeBreakpoint",d),i&&(f?(e.loopDestroy(),e.loopCreate(t),e.updateSlides()):!b&&x?(e.loopCreate(t),e.updateSlides()):b&&!x&&e.loopDestroy()),e.emit("breakpoint",d)},getBreakpoint:function(e,t="window",i){if(!e||"container"===t&&!i)return;let n=!1;const r=mr(),o="window"===t?r.innerHeight:i.clientHeight,a=Object.keys(e).map(e=>{if("string"==typeof e&&0===e.indexOf("@")){const t=parseFloat(e.substr(1));return{value:o*t,point:e}}return{value:e,point:e}});a.sort((e,t)=>parseInt(e.value,10)-parseInt(t.value,10));for(let e=0;e<a.length;e+=1){const{point:o,value:s}=a[e];"window"===t?r.matchMedia(`(min-width: ${s}px)`).matches&&(n=o):s<=i.clientWidth&&(n=o)}return n||"max"}};var co={addClasses:function(){const e=this,{classNames:t,params:i,rtl:n,el:r,device:o}=e,a=function(e,t){const i=[];return e.forEach(e=>{"object"==typeof e?Object.keys(e).forEach(n=>{e[n]&&i.push(t+n)}):"string"==typeof e&&i.push(t+e)}),i}(["initialized",i.direction,{"free-mode":e.params.freeMode&&i.freeMode.enabled},{autoheight:i.autoHeight},{rtl:n},{grid:i.grid&&i.grid.rows>1},{"grid-column":i.grid&&i.grid.rows>1&&"column"===i.grid.fill},{android:o.android},{ios:o.ios},{"css-mode":i.cssMode},{centered:i.cssMode&&i.centeredSlides},{"watch-progress":i.watchSlidesProgress}],i.containerModifierClass);t.push(...a),r.classList.add(...t),e.emitContainerClasses()},removeClasses:function(){const{el:e,classNames:t}=this;e&&"string"!=typeof e&&(e.classList.remove(...t),this.emitContainerClasses())}};var po={checkOverflow:function(){const e=this,{isLocked:t,params:i}=e,{slidesOffsetBefore:n}=i;if(n){const t=e.slides.length-1,i=e.slidesGrid[t]+e.slidesSizesGrid[t]+2*n;e.isLocked=e.size>i}else e.isLocked=1===e.snapGrid.length;!0===i.allowSlideNext&&(e.allowSlideNext=!e.isLocked),!0===i.allowSlidePrev&&(e.allowSlidePrev=!e.isLocked),t&&t!==e.isLocked&&(e.isEnd=!1),t!==e.isLocked&&e.emit(e.isLocked?"lock":"unlock")}},uo={init:!0,direction:"horizontal",oneWayMovement:!1,swiperElementNodeName:"SWIPER-CONTAINER",touchEventsTarget:"wrapper",initialSlide:0,speed:300,cssMode:!1,updateOnWindowResize:!0,resizeObserver:!0,nested:!1,createElements:!1,eventsPrefix:"swiper",enabled:!0,focusableElements:"input, select, option, textarea, button, video, label",width:null,height:null,preventInteractionOnTransition:!1,userAgent:null,url:null,edgeSwipeDetection:!1,edgeSwipeThreshold:20,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,breakpointsBase:"window",spaceBetween:0,slidesPerView:1,slidesPerGroup:1,slidesPerGroupSkip:0,slidesPerGroupAuto:!1,centeredSlides:!1,centeredSlidesBounds:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,snapToSlideEdge:!1,watchOverflow:!0,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:5,touchMoveStopPropagation:!1,touchStartPreventDefault:!0,touchStartForcePreventDefault:!1,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,loop:!1,loopAddBlankSlides:!0,loopAdditionalSlides:0,loopPreventsSliding:!0,rewind:!1,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,maxBackfaceHiddenSlides:10,containerModifierClass:"swiper-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-blank",slideActiveClass:"swiper-slide-active",slideVisibleClass:"swiper-slide-visible",slideFullyVisibleClass:"swiper-slide-fully-visible",slideNextClass:"swiper-slide-next",slidePrevClass:"swiper-slide-prev",wrapperClass:"swiper-wrapper",lazyPreloaderClass:"swiper-lazy-preloader",lazyPreloadPrevNext:0,runCallbacksOnInit:!0,_emitClasses:!1};function mo(e,t){return function(i={}){const n=Object.keys(i)[0],r=i[n];"object"==typeof r&&null!==r?(!0===e[n]&&(e[n]={enabled:!0}),"navigation"===n&&e[n]&&e[n].enabled&&!e[n].prevEl&&!e[n].nextEl&&(e[n].auto=!0),["pagination","scrollbar"].indexOf(n)>=0&&e[n]&&e[n].enabled&&!e[n].el&&(e[n].auto=!0),n in e&&"enabled"in r?("object"!=typeof e[n]||"enabled"in e[n]||(e[n].enabled=!0),e[n]||(e[n]={enabled:!1}),yr(t,i)):yr(t,i)):yr(t,i)}}const ho={eventsEmitter:Or,update:Gr,translate:Ur,transition:qr,slide:Wr,loop:Qr,grabCursor:Yr,events:ao,breakpoints:lo,checkOverflow:po,classes:co},go={};class vo{constructor(...e){let t,i;1===e.length&&e[0].constructor&&"Object"===Object.prototype.toString.call(e[0]).slice(8,-1)?i=e[0]:[t,i]=e,i||(i={}),i=yr({},i),t&&!i.el&&(i.el=t);const n=pr();if(i.el&&"string"==typeof i.el&&n.querySelectorAll(i.el).length>1){const e=[];return n.querySelectorAll(i.el).forEach(t=>{const n=yr({},i,{el:t});e.push(new vo(n))}),e}const r=this;r.__swiper__=!0,r.support=Rr(),r.device=Lr({userAgent:i.userAgent}),r.browser=Dr(),r.eventsListeners={},r.eventsAnyListeners=[],r.modules=[...r.__modules__],i.modules&&Array.isArray(i.modules)&&r.modules.push(...i.modules);const o={};r.modules.forEach(e=>{e({params:i,swiper:r,extendParams:mo(i,o),on:r.on.bind(r),once:r.once.bind(r),off:r.off.bind(r),emit:r.emit.bind(r)})});const a=yr({},uo,o);return r.params=yr({},a,go,i),r.originalParams=yr({},r.params),r.passedParams=yr({},i),r.params&&r.params.on&&Object.keys(r.params.on).forEach(e=>{r.on(e,r.params.on[e])}),r.params&&r.params.onAny&&r.onAny(r.params.onAny),Object.assign(r,{enabled:r.params.enabled,el:t,classNames:[],slides:[],slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal:()=>"horizontal"===r.params.direction,isVertical:()=>"vertical"===r.params.direction,activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,cssOverflowAdjustment(){return Math.trunc(this.translate/2**23)*2**23},allowSlideNext:r.params.allowSlideNext,allowSlidePrev:r.params.allowSlidePrev,touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,focusableElements:r.params.focusableElements,lastClickTime:0,clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,startMoving:void 0,pointerId:null,touchId:null},allowClick:!0,allowTouchMove:r.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),r.emit("_swiper"),r.params.init&&r.init(),r}getDirectionLabel(e){return this.isHorizontal()?e:{width:"height","margin-top":"margin-left","margin-bottom ":"margin-right","margin-left":"margin-top","margin-right":"margin-bottom","padding-left":"padding-top","padding-right":"padding-bottom",marginRight:"marginBottom"}[e]}getSlideIndex(e){const{slidesEl:t,params:i}=this,n=Cr(wr(t,`.${i.slideClass}, swiper-slide`)[0]);return Cr(e)-n}getSlideIndexByData(e){return this.getSlideIndex(this.slides.find(t=>1*t.getAttribute("data-swiper-slide-index")===e))}getSlideIndexWhenGrid(e){return this.grid&&this.params.grid&&this.params.grid.rows>1&&("column"===this.params.grid.fill?e=Math.floor(e/this.params.grid.rows):"row"===this.params.grid.fill&&(e%=Math.ceil(this.slides.length/this.params.grid.rows))),e}recalcSlides(){const{slidesEl:e,params:t}=this;this.slides=wr(e,`.${t.slideClass}, swiper-slide`)}enable(){const e=this;e.enabled||(e.enabled=!0,e.params.grabCursor&&e.setGrabCursor(),e.emit("enable"))}disable(){const e=this;e.enabled&&(e.enabled=!1,e.params.grabCursor&&e.unsetGrabCursor(),e.emit("disable"))}setProgress(e,t){const i=this;e=Math.min(Math.max(e,0),1);const n=i.minTranslate(),r=(i.maxTranslate()-n)*e+n;i.translateTo(r,void 0===t?0:t),i.updateActiveIndex(),i.updateSlidesClasses()}emitContainerClasses(){const e=this;if(!e.params._emitClasses||!e.el)return;const t=e.el.className.split(" ").filter(t=>0===t.indexOf("swiper")||0===t.indexOf(e.params.containerModifierClass));e.emit("_containerClasses",t.join(" "))}getSlideClasses(e){const t=this;return t.destroyed?"":e.className.split(" ").filter(e=>0===e.indexOf("swiper-slide")||0===e.indexOf(t.params.slideClass)).join(" ")}emitSlidesClasses(){const e=this;if(!e.params._emitClasses||!e.el)return;const t=[];e.slides.forEach(i=>{const n=e.getSlideClasses(i);t.push({slideEl:i,classNames:n}),e.emit("_slideClass",i,n)}),e.emit("_slideClasses",t)}slidesPerViewDynamic(e="current",t=!1){const{params:i,slides:n,slidesGrid:r,slidesSizesGrid:o,size:a,activeIndex:s}=this;let l=1;if("number"==typeof i.slidesPerView)return i.slidesPerView;if(i.centeredSlides){let e,t=n[s]?Math.ceil(n[s].swiperSlideSize):0;for(let i=s+1;i<n.length;i+=1)n[i]&&!e&&(t+=Math.ceil(n[i].swiperSlideSize),l+=1,t>a&&(e=!0));for(let i=s-1;i>=0;i-=1)n[i]&&!e&&(t+=n[i].swiperSlideSize,l+=1,t>a&&(e=!0))}else if("current"===e)for(let e=s+1;e<n.length;e+=1){(t?r[e]+o[e]-r[s]<a:r[e]-r[s]<a)&&(l+=1)}else for(let e=s-1;e>=0;e-=1){r[s]-r[e]<a&&(l+=1)}return l}update(){const e=this;if(!e||e.destroyed)return;const{snapGrid:t,params:i}=e;function n(){const t=e.rtlTranslate?-1*e.translate:e.translate,i=Math.min(Math.max(t,e.maxTranslate()),e.minTranslate());e.setTranslate(i),e.updateActiveIndex(),e.updateSlidesClasses()}let r;if(i.breakpoints&&e.setBreakpoint(),[...e.el.querySelectorAll('[loading="lazy"]')].forEach(t=>{t.complete&&Fr(e,t)}),e.updateSize(),e.updateSlides(),e.updateProgress(),e.updateSlidesClasses(),i.freeMode&&i.freeMode.enabled&&!i.cssMode)n(),i.autoHeight&&e.updateAutoHeight();else{if(("auto"===i.slidesPerView||i.slidesPerView>1)&&e.isEnd&&!i.centeredSlides){const t=e.virtual&&i.virtual.enabled?e.virtual.slides:e.slides;r=e.slideTo(t.length-1,0,!1,!0)}else r=e.slideTo(e.activeIndex,0,!1,!0);r||n()}i.watchOverflow&&t!==e.snapGrid&&e.checkOverflow(),e.emit("update")}changeDirection(e,t=!0){const i=this,n=i.params.direction;return e||(e="horizontal"===n?"vertical":"horizontal"),e===n||"horizontal"!==e&&"vertical"!==e||(i.el.classList.remove(`${i.params.containerModifierClass}${n}`),i.el.classList.add(`${i.params.containerModifierClass}${e}`),i.emitContainerClasses(),i.params.direction=e,i.slides.forEach(t=>{"vertical"===e?t.style.width="":t.style.height=""}),i.emit("changeDirection"),t&&i.update()),i}changeLanguageDirection(e){const t=this;t.rtl&&"rtl"===e||!t.rtl&&"ltr"===e||(t.rtl="rtl"===e,t.rtlTranslate="horizontal"===t.params.direction&&t.rtl,t.rtl?(t.el.classList.add(`${t.params.containerModifierClass}rtl`),t.el.dir="rtl"):(t.el.classList.remove(`${t.params.containerModifierClass}rtl`),t.el.dir="ltr"),t.update())}mount(e){const t=this;if(t.mounted)return!0;let i=e||t.params.el;if("string"==typeof i&&(i=document.querySelector(i)),!i)return!1;i.swiper=t,i.parentNode&&i.parentNode.host&&i.parentNode.host.nodeName===t.params.swiperElementNodeName.toUpperCase()&&(t.isElement=!0);const n=()=>`.${(t.params.wrapperClass||"").trim().split(" ").join(".")}`;let r=(()=>{if(i&&i.shadowRoot&&i.shadowRoot.querySelector){return i.shadowRoot.querySelector(n())}return wr(i,n())[0]})();return!r&&t.params.createElements&&(r=$r("div",t.params.wrapperClass),i.append(r),wr(i,`.${t.params.slideClass}`).forEach(e=>{r.append(e)})),Object.assign(t,{el:i,wrapperEl:r,slidesEl:t.isElement&&!i.parentNode.host.slideSlots?i.parentNode.host:r,hostEl:t.isElement?i.parentNode.host:i,mounted:!0,rtl:"rtl"===i.dir.toLowerCase()||"rtl"===Sr(i,"direction"),rtlTranslate:"horizontal"===t.params.direction&&("rtl"===i.dir.toLowerCase()||"rtl"===Sr(i,"direction")),wrongRTL:"-webkit-box"===Sr(r,"display")}),!0}init(e){const t=this;if(t.initialized)return t;if(!1===t.mount(e))return t;t.emit("beforeInit"),t.params.breakpoints&&t.setBreakpoint(),t.addClasses(),t.updateSize(),t.updateSlides(),t.params.watchOverflow&&t.checkOverflow(),t.params.grabCursor&&t.enabled&&t.setGrabCursor(),t.params.loop&&t.virtual&&t.params.virtual.enabled?t.slideTo(t.params.initialSlide+t.virtual.slidesBefore,0,t.params.runCallbacksOnInit,!1,!0):t.slideTo(t.params.initialSlide,0,t.params.runCallbacksOnInit,!1,!0),t.params.loop&&t.loopCreate(void 0,!0),t.attachEvents();const i=[...t.el.querySelectorAll('[loading="lazy"]')];return t.isElement&&i.push(...t.hostEl.querySelectorAll('[loading="lazy"]')),i.forEach(e=>{e.complete?Fr(t,e):e.addEventListener("load",e=>{Fr(t,e.target)})}),Hr(t),t.initialized=!0,Hr(t),t.emit("init"),t.emit("afterInit"),t}destroy(e=!0,t=!0){const i=this,{params:n,el:r,wrapperEl:o,slides:a}=i;return void 0===i.params||i.destroyed||(i.emit("beforeDestroy"),i.initialized=!1,i.detachEvents(),n.loop&&i.loopDestroy(),t&&(i.removeClasses(),r&&"string"!=typeof r&&r.removeAttribute("style"),o&&o.removeAttribute("style"),a&&a.length&&a.forEach(e=>{e.classList.remove(n.slideVisibleClass,n.slideFullyVisibleClass,n.slideActiveClass,n.slideNextClass,n.slidePrevClass),e.removeAttribute("style"),e.removeAttribute("data-swiper-slide-index")})),i.emit("destroy"),Object.keys(i.eventsListeners).forEach(e=>{i.off(e)}),!1!==e&&(i.el&&"string"!=typeof i.el&&(i.el.swiper=null),function(e){const t=e;Object.keys(t).forEach(e=>{try{t[e]=null}catch(e){}try{delete t[e]}catch(e){}})}(i)),i.destroyed=!0),null}static extendDefaults(e){yr(go,e)}static get extendedDefaults(){return go}static get defaults(){return uo}static installModule(e){vo.prototype.__modules__||(vo.prototype.__modules__=[]);const t=vo.prototype.__modules__;"function"==typeof e&&t.indexOf(e)<0&&t.push(e)}static use(e){return Array.isArray(e)?(e.forEach(e=>vo.installModule(e)),vo):(vo.installModule(e),vo)}}function fo(e,t,i,n){return e.params.createElements&&Object.keys(n).forEach(r=>{if(!i[r]&&!0===i.auto){let o=wr(e.el,`.${n[r]}`)[0];o||(o=$r("div",n[r]),o.className=n[r],e.el.append(o)),i[r]=o,t[r]=o}}),i}Object.keys(ho).forEach(e=>{Object.keys(ho[e]).forEach(t=>{vo.prototype[t]=ho[e][t]})}),vo.use([function({swiper:e,on:t,emit:i}){const n=mr();let r=null,o=null;const a=()=>{e&&!e.destroyed&&e.initialized&&(i("beforeResize"),i("resize"))},s=()=>{e&&!e.destroyed&&e.initialized&&i("orientationchange")};t("init",()=>{e.params.resizeObserver&&void 0!==n.ResizeObserver?e&&!e.destroyed&&e.initialized&&(r=new ResizeObserver(t=>{o=n.requestAnimationFrame(()=>{const{width:i,height:n}=e;let r=i,o=n;t.forEach(({contentBoxSize:t,contentRect:i,target:n})=>{n&&n!==e.el||(r=i?i.width:(t[0]||t).inlineSize,o=i?i.height:(t[0]||t).blockSize)}),r===i&&o===n||a()})}),r.observe(e.el)):(n.addEventListener("resize",a),n.addEventListener("orientationchange",s))}),t("destroy",()=>{o&&n.cancelAnimationFrame(o),r&&r.unobserve&&e.el&&(r.unobserve(e.el),r=null),n.removeEventListener("resize",a),n.removeEventListener("orientationchange",s)})},function({swiper:e,extendParams:t,on:i,emit:n}){const r=[],o=mr(),a=(t,i={})=>{const a=new(o.MutationObserver||o.WebkitMutationObserver)(t=>{if(e.__preventObserver__)return;if(1===t.length)return void n("observerUpdate",t[0]);const i=function(){n("observerUpdate",t[0])};o.requestAnimationFrame?o.requestAnimationFrame(i):o.setTimeout(i,0)});a.observe(t,{attributes:void 0===i.attributes||i.attributes,childList:e.isElement||(void 0===i.childList||i).childList,characterData:void 0===i.characterData||i.characterData}),r.push(a)};t({observer:!1,observeParents:!1,observeSlideChildren:!1}),i("init",()=>{if(e.params.observer){if(e.params.observeParents){const t=Tr(e.hostEl);for(let e=0;e<t.length;e+=1)a(t[e])}a(e.hostEl,{childList:e.params.observeSlideChildren}),a(e.wrapperEl,{attributes:!1})}}),i("destroy",()=>{r.forEach(e=>{e.disconnect()}),r.splice(0,r.length)})}]);const bo='<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"/></svg>';function yo({swiper:e,extendParams:t,on:i,emit:n}){function r(t){let i;return t&&"string"==typeof t&&e.isElement&&(i=e.el.querySelector(t)||e.hostEl.querySelector(t),i)?i:(t&&("string"==typeof t&&(i=[...document.querySelectorAll(t)]),e.params.uniqueNavElements&&"string"==typeof t&&i&&i.length>1&&1===e.el.querySelectorAll(t).length?i=e.el.querySelector(t):i&&1===i.length&&(i=i[0])),t&&!i?t:i)}function o(t,i){const n=e.params.navigation;(t=zr(t)).forEach(t=>{t&&(t.classList[i?"add":"remove"](...n.disabledClass.split(" ")),"BUTTON"===t.tagName&&(t.disabled=i),e.params.watchOverflow&&e.enabled&&t.classList[e.isLocked?"add":"remove"](n.lockClass))})}function a(){const{nextEl:t,prevEl:i}=e.navigation;if(e.params.loop)return o(i,!1),void o(t,!1);o(i,e.isBeginning&&!e.params.rewind),o(t,e.isEnd&&!e.params.rewind)}function s(t){t.preventDefault(),(!e.isBeginning||e.params.loop||e.params.rewind)&&(e.slidePrev(),n("navigationPrev"))}function l(t){t.preventDefault(),(!e.isEnd||e.params.loop||e.params.rewind)&&(e.slideNext(),n("navigationNext"))}function c(){const t=e.params.navigation;if(e.params.navigation=fo(e,e.originalParams.navigation,e.params.navigation,{nextEl:"swiper-button-next",prevEl:"swiper-button-prev"}),!t.nextEl&&!t.prevEl)return;let i=r(t.nextEl),n=r(t.prevEl);Object.assign(e.navigation,{nextEl:i,prevEl:n}),i=zr(i),n=zr(n);const o=(i,n)=>{if(i){if(t.addIcons&&i.matches(".swiper-button-next,.swiper-button-prev")&&!i.querySelector("svg")){const e=document.createElement("div");Ar(e,bo),i.appendChild(e.querySelector("svg")),e.remove()}i.addEventListener("click","next"===n?l:s)}!e.enabled&&i&&i.classList.add(...t.lockClass.split(" "))};i.forEach(e=>o(e,"next")),n.forEach(e=>o(e,"prev"))}function d(){let{nextEl:t,prevEl:i}=e.navigation;t=zr(t),i=zr(i);const n=(t,i)=>{t.removeEventListener("click","next"===i?l:s),t.classList.remove(...e.params.navigation.disabledClass.split(" "))};t.forEach(e=>n(e,"next")),i.forEach(e=>n(e,"prev"))}t({navigation:{nextEl:null,prevEl:null,addIcons:!0,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock",navigationDisabledClass:"swiper-navigation-disabled"}}),e.navigation={nextEl:null,prevEl:null,arrowSvg:bo},i("init",()=>{!1===e.params.navigation.enabled?p():(c(),a())}),i("toEdge fromEdge lock unlock",()=>{a()}),i("destroy",()=>{d()}),i("enable disable",()=>{let{nextEl:t,prevEl:i}=e.navigation;t=zr(t),i=zr(i),e.enabled?a():[...t,...i].filter(e=>!!e).forEach(t=>t.classList.add(e.params.navigation.lockClass))}),i("click",(t,i)=>{let{nextEl:r,prevEl:o}=e.navigation;r=zr(r),o=zr(o);const a=i.target;let s=o.includes(a)||r.includes(a);if(e.isElement&&!s){const e=i.path||i.composedPath&&i.composedPath();e&&(s=e.find(e=>r.includes(e)||o.includes(e)))}if(e.params.navigation.hideOnClick&&!s){if(e.pagination&&e.params.pagination&&e.params.pagination.clickable&&(e.pagination.el===a||e.pagination.el.contains(a)))return;let t;r.length?t=r[0].classList.contains(e.params.navigation.hiddenClass):o.length&&(t=o[0].classList.contains(e.params.navigation.hiddenClass)),n(!0===t?"navigationShow":"navigationHide"),[...r,...o].filter(e=>!!e).forEach(t=>t.classList.toggle(e.params.navigation.hiddenClass))}});const p=()=>{e.el.classList.add(...e.params.navigation.navigationDisabledClass.split(" ")),d()};Object.assign(e.navigation,{enable:()=>{e.el.classList.remove(...e.params.navigation.navigationDisabledClass.split(" ")),c(),a()},disable:p,update:a,init:c,destroy:d})}function xo(e=""){return`.${e.trim().replace(/([\.:!+\/()[\]#>~*^$|=,'"@{}\\])/g,"\\$1").replace(/ /g,".")}`}function _o({swiper:e,extendParams:t,on:i,emit:n}){const r="swiper-pagination";let o;t({pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:e=>e,formatFractionTotal:e=>e,bulletClass:`${r}-bullet`,bulletActiveClass:`${r}-bullet-active`,modifierClass:`${r}-`,currentClass:`${r}-current`,totalClass:`${r}-total`,hiddenClass:`${r}-hidden`,progressbarFillClass:`${r}-progressbar-fill`,progressbarOppositeClass:`${r}-progressbar-opposite`,clickableClass:`${r}-clickable`,lockClass:`${r}-lock`,horizontalClass:`${r}-horizontal`,verticalClass:`${r}-vertical`,paginationDisabledClass:`${r}-disabled`}}),e.pagination={el:null,bullets:[]};let a=0;function s(){return!e.params.pagination.el||!e.pagination.el||Array.isArray(e.pagination.el)&&0===e.pagination.el.length}function l(t,i){const{bulletActiveClass:n}=e.params.pagination;t&&(t=t[("prev"===i?"previous":"next")+"ElementSibling"])&&(t.classList.add(`${n}-${i}`),(t=t[("prev"===i?"previous":"next")+"ElementSibling"])&&t.classList.add(`${n}-${i}-${i}`))}function c(t){const i=t.target.closest(xo(e.params.pagination.bulletClass));if(!i)return;t.preventDefault();const n=Cr(i)*e.params.slidesPerGroup;if(e.params.loop){if(e.realIndex===n)return;const t=(r=e.realIndex,o=n,a=e.slides.length,(o%=a)===1+(r%=a)?"next":o===r-1?"previous":void 0);"next"===t?e.slideNext():"previous"===t?e.slidePrev():e.slideToLoop(n)}else e.slideTo(n);var r,o,a}function d(){const t=e.rtl,i=e.params.pagination;if(s())return;let r,c,d=e.pagination.el;d=zr(d);const p=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.slides.length,u=e.params.loop?Math.ceil(p/e.params.slidesPerGroup):e.snapGrid.length;if(e.params.loop?(c=e.previousRealIndex||0,r=e.params.slidesPerGroup>1?Math.floor(e.realIndex/e.params.slidesPerGroup):e.realIndex):void 0!==e.snapIndex?(r=e.snapIndex,c=e.previousSnapIndex):(c=e.previousIndex||0,r=e.activeIndex||0),"bullets"===i.type&&e.pagination.bullets&&e.pagination.bullets.length>0){const n=e.pagination.bullets;let s,p,u;if(i.dynamicBullets&&(o=Mr(n[0],e.isHorizontal()?"width":"height",!0),d.forEach(t=>{t.style[e.isHorizontal()?"width":"height"]=o*(i.dynamicMainBullets+4)+"px"}),i.dynamicMainBullets>1&&void 0!==c&&(a+=r-(c||0),a>i.dynamicMainBullets-1?a=i.dynamicMainBullets-1:a<0&&(a=0)),s=Math.max(r-a,0),p=s+(Math.min(n.length,i.dynamicMainBullets)-1),u=(p+s)/2),n.forEach(e=>{const t=[...["","-next","-next-next","-prev","-prev-prev","-main"].map(e=>`${i.bulletActiveClass}${e}`)].map(e=>"string"==typeof e&&e.includes(" ")?e.split(" "):e).flat();e.classList.remove(...t)}),d.length>1)n.forEach(t=>{const n=Cr(t);n===r?t.classList.add(...i.bulletActiveClass.split(" ")):e.isElement&&t.setAttribute("part","bullet"),i.dynamicBullets&&(n>=s&&n<=p&&t.classList.add(...`${i.bulletActiveClass}-main`.split(" ")),n===s&&l(t,"prev"),n===p&&l(t,"next"))});else{const t=n[r];if(t&&t.classList.add(...i.bulletActiveClass.split(" ")),e.isElement&&n.forEach((e,t)=>{e.setAttribute("part",t===r?"bullet-active":"bullet")}),i.dynamicBullets){const e=n[s],t=n[p];for(let e=s;e<=p;e+=1)n[e]&&n[e].classList.add(...`${i.bulletActiveClass}-main`.split(" "));l(e,"prev"),l(t,"next")}}if(i.dynamicBullets){const r=Math.min(n.length,i.dynamicMainBullets+4),a=(o*r-o)/2-u*o,s=t?"right":"left";n.forEach(t=>{t.style[e.isHorizontal()?s:"top"]=`${a}px`})}}d.forEach((t,o)=>{if("fraction"===i.type&&(t.querySelectorAll(xo(i.currentClass)).forEach(e=>{e.textContent=i.formatFractionCurrent(r+1)}),t.querySelectorAll(xo(i.totalClass)).forEach(e=>{e.textContent=i.formatFractionTotal(u)})),"progressbar"===i.type){let n;n=i.progressbarOpposite?e.isHorizontal()?"vertical":"horizontal":e.isHorizontal()?"horizontal":"vertical";const o=(r+1)/u;let a=1,s=1;"horizontal"===n?a=o:s=o,t.querySelectorAll(xo(i.progressbarFillClass)).forEach(t=>{t.style.transform=`translate3d(0,0,0) scaleX(${a}) scaleY(${s})`,t.style.transitionDuration=`${e.params.speed}ms`})}"custom"===i.type&&i.renderCustom?(Ar(t,i.renderCustom(e,r+1,u)),0===o&&n("paginationRender",t)):(0===o&&n("paginationRender",t),n("paginationUpdate",t)),e.params.watchOverflow&&e.enabled&&t.classList[e.isLocked?"add":"remove"](i.lockClass)})}function p(){const t=e.params.pagination;if(s())return;const i=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.grid&&e.params.grid.rows>1?e.slides.length/Math.ceil(e.params.grid.rows):e.slides.length;let r=e.pagination.el;r=zr(r);let o="";if("bullets"===t.type){let n=e.params.loop?Math.ceil(i/e.params.slidesPerGroup):e.snapGrid.length;e.params.freeMode&&e.params.freeMode.enabled&&n>i&&(n=i);for(let i=0;i<n;i+=1)t.renderBullet?o+=t.renderBullet.call(e,i,t.bulletClass):o+=`<${t.bulletElement} ${e.isElement?'part="bullet"':""} class="${t.bulletClass}"></${t.bulletElement}>`}"fraction"===t.type&&(o=t.renderFraction?t.renderFraction.call(e,t.currentClass,t.totalClass):`<span class="${t.currentClass}"></span> / <span class="${t.totalClass}"></span>`),"progressbar"===t.type&&(o=t.renderProgressbar?t.renderProgressbar.call(e,t.progressbarFillClass):`<span class="${t.progressbarFillClass}"></span>`),e.pagination.bullets=[],r.forEach(i=>{"custom"!==t.type&&Ar(i,o||""),"bullets"===t.type&&e.pagination.bullets.push(...i.querySelectorAll(xo(t.bulletClass)))}),"custom"!==t.type&&n("paginationRender",r[0])}function u(){e.params.pagination=fo(e,e.originalParams.pagination,e.params.pagination,{el:"swiper-pagination"});const t=e.params.pagination;if(!t.el)return;let i;"string"==typeof t.el&&e.isElement&&(i=e.el.querySelector(t.el)),i||"string"!=typeof t.el||(i=[...document.querySelectorAll(t.el)]),i||(i=t.el),i&&0!==i.length&&(e.params.uniqueNavElements&&"string"==typeof t.el&&Array.isArray(i)&&i.length>1&&(i=[...e.el.querySelectorAll(t.el)],i.length>1&&(i=i.find(t=>Tr(t,".swiper")[0]===e.el))),Array.isArray(i)&&1===i.length&&(i=i[0]),Object.assign(e.pagination,{el:i}),i=zr(i),i.forEach(i=>{"bullets"===t.type&&t.clickable&&i.classList.add(...(t.clickableClass||"").split(" ")),i.classList.add(t.modifierClass+t.type),i.classList.add(e.isHorizontal()?t.horizontalClass:t.verticalClass),"bullets"===t.type&&t.dynamicBullets&&(i.classList.add(`${t.modifierClass}${t.type}-dynamic`),a=0,t.dynamicMainBullets<1&&(t.dynamicMainBullets=1)),"progressbar"===t.type&&t.progressbarOpposite&&i.classList.add(t.progressbarOppositeClass),t.clickable&&i.addEventListener("click",c),e.enabled||i.classList.add(t.lockClass)}))}function m(){const t=e.params.pagination;if(s())return;let i=e.pagination.el;i&&(i=zr(i),i.forEach(i=>{i.classList.remove(t.hiddenClass),i.classList.remove(t.modifierClass+t.type),i.classList.remove(e.isHorizontal()?t.horizontalClass:t.verticalClass),t.clickable&&(i.classList.remove(...(t.clickableClass||"").split(" ")),i.removeEventListener("click",c))})),e.pagination.bullets&&e.pagination.bullets.forEach(e=>e.classList.remove(...t.bulletActiveClass.split(" ")))}i("changeDirection",()=>{if(!e.pagination||!e.pagination.el)return;const t=e.params.pagination;let{el:i}=e.pagination;i=zr(i),i.forEach(i=>{i.classList.remove(t.horizontalClass,t.verticalClass),i.classList.add(e.isHorizontal()?t.horizontalClass:t.verticalClass)})}),i("init",()=>{!1===e.params.pagination.enabled?h():(u(),p(),d())}),i("activeIndexChange",()=>{void 0===e.snapIndex&&d()}),i("snapIndexChange",()=>{d()}),i("snapGridLengthChange",()=>{p(),d()}),i("destroy",()=>{m()}),i("enable disable",()=>{let{el:t}=e.pagination;t&&(t=zr(t),t.forEach(t=>t.classList[e.enabled?"remove":"add"](e.params.pagination.lockClass)))}),i("lock unlock",()=>{d()}),i("click",(t,i)=>{const r=i.target,o=zr(e.pagination.el);if(e.params.pagination.el&&e.params.pagination.hideOnClick&&o&&o.length>0&&!r.classList.contains(e.params.pagination.bulletClass)){if(e.navigation&&(e.navigation.nextEl&&r===e.navigation.nextEl||e.navigation.prevEl&&r===e.navigation.prevEl))return;const t=o[0].classList.contains(e.params.pagination.hiddenClass);n(!0===t?"paginationShow":"paginationHide"),o.forEach(t=>t.classList.toggle(e.params.pagination.hiddenClass))}});const h=()=>{e.el.classList.add(e.params.pagination.paginationDisabledClass);let{el:t}=e.pagination;t&&(t=zr(t),t.forEach(t=>t.classList.add(e.params.pagination.paginationDisabledClass))),m()};Object.assign(e.pagination,{enable:()=>{e.el.classList.remove(e.params.pagination.paginationDisabledClass);let{el:t}=e.pagination;t&&(t=zr(t),t.forEach(t=>t.classList.remove(e.params.pagination.paginationDisabledClass))),u(),p(),d()},disable:h,render:p,update:d,init:u,destroy:m})}var wo=i(72),ko=i.n(wo),$o=i(825),So=i.n($o),Co=i(659),To=i.n(Co),Mo=i(56),zo=i.n(Mo),Ao=i(540),Eo=i.n(Ao),Po=i(113),Io=i.n(Po),Ro=i(870),Lo={};Lo.styleTagTransform=Io(),Lo.setAttributes=zo(),Lo.insert=To().bind(null,"head"),Lo.domAPI=So(),Lo.insertStyleElement=Eo();ko()(Ro.A,Lo);Ro.A&&Ro.A.locals&&Ro.A.locals;var Do=i(506),Oo={};Oo.styleTagTransform=Io(),Oo.setAttributes=zo(),Oo.insert=To().bind(null,"head"),Oo.domAPI=So(),Oo.insertStyleElement=Eo();ko()(Do.A,Oo);Do.A&&Do.A.locals&&Do.A.locals;var No=i(124),jo={};jo.styleTagTransform=Io(),jo.setAttributes=zo(),jo.insert=To().bind(null,"head"),jo.domAPI=So(),jo.insertStyleElement=Eo();ko()(No.A,jo);No.A&&No.A.locals&&No.A.locals;const{I:Fo}=fe,Bo=(e,t)=>{const i=e._$AN;if(void 0===i)return!1;for(const e of i)e._$AO?.(t,!1),Bo(e,t);return!0},Ho=e=>{let t,i;do{if(void 0===(t=e._$AM))break;i=t._$AN,i.delete(e),e=t}while(0===i?.size)},Go=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),qo(t)}};function Uo(e){void 0!==this._$AN?(Ho(this),this._$AM=e,Go(this)):this._$AM=e}function Vo(e,t=!1,i=0){const n=this._$AH,r=this._$AN;if(void 0!==r&&0!==r.size)if(t)if(Array.isArray(n))for(let e=i;e<n.length;e++)Bo(n[e],!1),Ho(n[e]);else null!=n&&(Bo(n,!1),Ho(n));else Bo(this,e)}const qo=e=>{e.type==Li&&(e._$AP??=Vo,e._$AQ??=Uo)};class Wo extends Oi{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),Go(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(Bo(this,e),Ho(this))}setValue(e){if((e=>void 0===e.strings)(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}class Qo{}const Yo=new WeakMap,Xo=Di(class extends Wo{render(e){return ne}update(e,[t]){const i=t!==this.G;return i&&void 0!==this.G&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),ne}rt(e){if(this.isConnected||(e=void 0),"function"==typeof this.G){const t=this.ht??globalThis;let i=Yo.get(t);void 0===i&&(i=new WeakMap,Yo.set(t,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,e),void 0!==e&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return"function"==typeof this.G?Yo.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});class Ko{static render(e,t){if(t&&!it.evaluate(e.display,t))return te``;const i=Ye.get(e.type);if(!i)return te`<div class="mc-error">Unknown module: ${e.type}</div>`;const n=rt(e.design);return te`
      <div class="mc-module-wrapper" style=${n}>
        ${i.renderPreview(e,t)}
      </div>
    `}static renderAll(e,t){return e.map(e=>this.render(e,t))}}const Zo=new Map;Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"slider-layout",name:"Slider Layout",description:"Arrange child modules in a slider",category:"layout",icon:"mdi:view-carousel"}}createDefault(){return{id:dt("slider-layout"),type:"slider-layout",modules:[],pagination:!0,navigation:!0}}renderCard(e,t){const i=e,n=i.modules||[],r=new Qo,o=`swiper-${i.id}`;return setTimeout(()=>{const e=r.value;e&&!e.swiper&&new vo(e,{modules:[yo,_o],pagination:!!i.pagination&&{el:".swiper-pagination"},navigation:!!i.navigation&&{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}})}),te`
      <div class="mc-module mc-slider">
        <div class="swiper ${o}" ${Xo(r)}>
          <div class="swiper-wrapper">
            ${n.map(e=>te`
              <div class="swiper-slide">
                ${Ko.render(e,t)}
              </div>
            `)}
          </div>
          ${i.pagination?te`<div class="swiper-pagination"></div>`:""}
          ${i.navigation?te`
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          `:""}
        </div>
      </div>
    `}renderPreview(e,t){const i=e,n=i.modules||[];return te`
      <div class="mc-module mc-slider" style="padding: 16px; border: 1px dashed #ccc; position: relative;">
        <div style="display: flex; gap: 8px; overflow: hidden;">
            ${n.length>0?n.map(e=>{const i=Ye.get(e.type);return te`
                    <div style="flex-shrink: 0; width: 100px; height: 100px; border: 1px solid #eee; display: flex; align-items: center; justify-content: center;">
                        ${i?i.renderPreview(e,t):te`<span class="mc-error">?</span>`}
                    </div>
                  `}):te`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty slider</span>`}
        </div>
        ${i.navigation?te`
            <div style="position: absolute; top: 50%; left: 8px; transform: translateY(-50%);">&#10094;</div>
            <div style="position: absolute; top: 50%; right: 8px; transform: translateY(-50%);">&#10095;</div>
        `:""}
        ${i.pagination?te`<div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); display: flex; gap: 4px;">
            ${n.map(()=>te`<div style="width: 8px; height: 8px; border-radius: 50%; background: #ccc;"></div>`)}
        </div>`:""}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e,a=o.modules||[],s=Zn();return te`
      <div class="mc-tab-content">
        ${jt("Pagination",o.pagination,e=>i({...o,pagination:e}),"pagination",r)}
        ${jt("Navigation",o.navigation,e=>i({...o,navigation:e}),"navigation",r)}

        <div class="mc-section">
          <div class="mc-section-header">Slides (${a.length})</div>
          ${this._renderChildModuleList(o,t,i,s,n)}
        </div>
      </div>
    `}_renderChildModuleList(e,t,i,n,r){const o=e.modules||[],a=t=>{i({...e,modules:t})};return te`
      ${Jn({ownerId:e.id,scopeId:"slides",children:o,hass:t,template:r,expandedState:Zo,moduleTypes:n,onRefresh:()=>i({...e}),onRemoveChild:e=>{a(o.filter((t,i)=>i!==e))},onUpdateChild:(e,t)=>{const i=[...o];i[e]=t,a(i)},onAddChild:e=>{const t=Ye.createDefault(e);t&&a([...o,t])},addButtonLabel:"Add Slide",getItemLabel:(e,t,i)=>`${i} (Slide ${t+1})`})}
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"clock",name:"Clock",description:"Display current time and date",category:"advanced",icon:"mdi:clock-outline"}}getAvailableTabs(){return["general","conditions","design"]}createDefault(){return{id:dt("clock"),type:"clock",format_12h:!1,show_seconds:!1,show_date:!0,date_format:"short"}}renderPreview(e,t){const i=e,n=new Date,r={hour:"2-digit",minute:"2-digit",hour12:i.format_12h??!1};i.show_seconds&&(r.second="2-digit");const o=n.toLocaleTimeString(void 0,r),a=i.show_date?n.toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric"}):"";return te`
      <div class="mc-module mc-clock">
        <span class="mc-clock-time">${o}</span>
        ${i.show_date?te`<span class="mc-clock-date">${a}</span>`:ne}
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${jt("12-Hour Format",o.format_12h,e=>i({...o,format_12h:e}),"format_12h",r)}
        ${jt("Show Seconds",o.show_seconds,e=>i({...o,show_seconds:e}),"show_seconds",r)}
        ${jt("Show Date",o.show_date,e=>i({...o,show_date:e}),"show_date",r)}
        ${Lt("Date Format",o.date_format,e=>i({...o,date_format:e}),"date_format",r)}
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"weather",name:"Weather",description:"Display weather entity information",category:"advanced",icon:"mdi:weather-partly-cloudy"}}createDefault(){return{id:dt("weather"),type:"weather",show_temperature:!0,show_condition:!0,show_forecast:!1,forecast_days:5}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=n?.attributes.temperature,o=n?.state||"unknown",a=n?.attributes.temperature_unit||"°C",s=this._conditionIcon(o);return te`
      <div class="mc-module mc-weather">
        <ha-icon icon=${s}></ha-icon>
        <div>
          ${i.show_temperature&&void 0!==r?te`<div class="mc-weather-temp">${r}${a}</div>`:ne}
          ${i.show_condition?te`<div class="mc-weather-condition">${o}</div>`:ne}
        </div>
      </div>
    `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${Ft("Weather Entity",o.entity,e=>i({...o,entity:e}),t,void 0,"entity",r)}
        ${qt("Attribute",o.attribute,e=>i({...o,attribute:e}),t,o.entity,"attribute",r)}
        ${jt("Show Temperature",o.show_temperature,e=>i({...o,show_temperature:e}),"show_temperature",r)}
        ${jt("Show Condition",o.show_condition,e=>i({...o,show_condition:e}),"show_condition",r)}
        ${jt("Show Forecast",o.show_forecast,e=>i({...o,show_forecast:e}),"show_forecast",r)}
        ${o.show_forecast?Ot("Forecast Days",o.forecast_days,e=>i({...o,forecast_days:e}),{min:1,max:7},"forecast_days",r):ne}
      </div>
    `}_conditionIcon(e){return{"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant",exceptional:"mdi:alert-circle-outline"}[e]||"mdi:weather-partly-cloudy"}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"forecast",name:"Forecast",description:"Display weather forecast data",category:"advanced",icon:"mdi:calendar-week"}}createDefault(){return{id:dt("forecast"),type:"forecast",forecast_type:"daily",num_forecasts:5,show_temperature:!0,show_precipitation:!0,show_wind:!1}}renderPreview(e,t){const i=e,n=i.entity&&t?t.states[i.entity]:void 0,r=(n?.attributes.forecast||[]).slice(0,i.num_forecasts||5);return r.length?te`
      <div class="mc-module mc-forecast">
        ${r.map(e=>te`
            <div class="mc-forecast-item">
              <span class="mc-forecast-label">
                ${e.datetime?new Date(e.datetime).toLocaleDateString(void 0,{weekday:"short"}):""}
              </span>
              <ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>
              ${i.show_temperature?te`<span class="mc-forecast-temp">${e.temperature??"--"}°</span>`:ne}
              ${i.show_precipitation&&void 0!==e.precipitation?te`<span class="mc-forecast-label">${e.precipitation}mm</span>`:ne}
            </div>
          `)}
      </div>
    `:te`
        <div class="mc-module mc-forecast">
          ${Array.from({length:i.num_forecasts||5}).map((e,t)=>te`
              <div class="mc-forecast-item">
                <span class="mc-forecast-label">Day ${t+1}</span>
                <ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>
                <span class="mc-forecast-temp">--°</span>
              </div>
            `)}
        </div>
      `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${Ft("Weather Entity",o.entity,e=>i({...o,entity:e}),t,void 0,"entity",r)}
        ${qt("Attribute",o.attribute,e=>i({...o,attribute:e}),t,o.entity,"attribute",r)}
        ${Nt("Forecast Type",o.forecast_type,[{label:"Daily",value:"daily"},{label:"Hourly",value:"hourly"}],e=>i({...o,forecast_type:e}),"forecast_type",r)}
        ${Ot("Number of Forecasts",o.num_forecasts,e=>i({...o,num_forecasts:e}),{min:1,max:10},"num_forecasts",r)}
        ${jt("Show Temperature",o.show_temperature,e=>i({...o,show_temperature:e}),"show_temperature",r)}
        ${jt("Show Precipitation",o.show_precipitation,e=>i({...o,show_precipitation:e}),"show_precipitation",r)}
        ${jt("Show Wind",o.show_wind,e=>i({...o,show_wind:e}),"show_wind",r)}
      </div>
    `}});Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"video-bg",name:"Video Background",description:"Display a video as a background",category:"advanced",icon:"mdi:video-outline"}}getAvailableTabs(){return["general","conditions","design"]}createDefault(){return{id:dt("video-bg"),type:"video-bg",autoplay:!0,loop:!0,muted:!0}}renderPreview(e,t){const i=e;return i.url?te`
      <div class="mc-module mc-video-bg">
        <video
          src=${i.url}
          poster=${i.poster||ne}
          ?autoplay=${i.autoplay}
          ?loop=${i.loop}
          ?muted=${i.muted}
          playsinline
        ></video>
      </div>
    `:te`
        <div class="mc-module mc-video-bg mc-video-bg-placeholder">
          <ha-icon icon="mdi:video-off-outline"></ha-icon>
        </div>
      `}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${Vt("Video URL",o.url,e=>i({...o,url:e}),t,"video","url",r)}
        ${Vt("Poster Image URL",o.poster,e=>i({...o,poster:e}),t,"image","poster",r)}
        ${jt("Autoplay",o.autoplay,e=>i({...o,autoplay:e}),"autoplay",r)}
        ${jt("Loop",o.loop,e=>i({...o,loop:e}),"loop",r)}
        ${jt("Muted",o.muted,e=>i({...o,muted:e}),"muted",r)}
      </div>
    `}});class Jo{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}}class ea{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}}const ta=e=>!(e=>null===e||"object"!=typeof e&&"function"!=typeof e)(e)&&"function"==typeof e.then,ia=1073741823;const na=Di(class extends Wo{constructor(){super(...arguments),this._$Cwt=ia,this._$Cbt=[],this._$CK=new Jo(this),this._$CX=new ea}render(...e){return e.find(e=>!ta(e))??ie}update(e,t){const i=this._$Cbt;let n=i.length;this._$Cbt=t;const r=this._$CK,o=this._$CX;this.isConnected||this.disconnected();for(let e=0;e<t.length&&!(e>this._$Cwt);e++){const a=t[e];if(!ta(a))return this._$Cwt=e,a;e<n&&a===i[e]||(this._$Cwt=ia,n=0,Promise.resolve(a).then(async e=>{for(;o.get();)await o.get();const t=r.deref();if(void 0!==t){const i=t._$Cbt.indexOf(a);i>-1&&i<t._$Cwt&&(t._$Cwt=i,t.setValue(e))}}))}return ie}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}});function ra(e){return null==e}var oa={isNothing:ra,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:ra(e)?[]:[e]},repeat:function(e,t){var i,n="";for(i=0;i<t;i+=1)n+=e;return n},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:function(e,t){var i,n,r,o;if(t)for(i=0,n=(o=Object.keys(t)).length;i<n;i+=1)e[r=o[i]]=t[r];return e}};function aa(e,t){var i="",n=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(i+='in "'+e.mark.name+'" '),i+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(i+="\n\n"+e.mark.snippet),n+" "+i):n}function sa(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=aa(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}sa.prototype=Object.create(Error.prototype),sa.prototype.constructor=sa,sa.prototype.toString=function(e){return this.name+": "+aa(this,e)};var la=sa;function ca(e,t,i,n,r){var o="",a="",s=Math.floor(r/2)-1;return n-t>s&&(t=n-s+(o=" ... ").length),i-n>s&&(i=n+s-(a=" ...").length),{str:o+e.slice(t,i).replace(/\t/g,"→")+a,pos:n-t+o.length}}function da(e,t){return oa.repeat(" ",t-e.length)+e}var pa=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var i,n=/\r?\n|\r|\0/g,r=[0],o=[],a=-1;i=n.exec(e.buffer);)o.push(i.index),r.push(i.index+i[0].length),e.position<=i.index&&a<0&&(a=r.length-2);a<0&&(a=r.length-1);var s,l,c="",d=Math.min(e.line+t.linesAfter,o.length).toString().length,p=t.maxLength-(t.indent+d+3);for(s=1;s<=t.linesBefore&&!(a-s<0);s++)l=ca(e.buffer,r[a-s],o[a-s],e.position-(r[a]-r[a-s]),p),c=oa.repeat(" ",t.indent)+da((e.line-s+1).toString(),d)+" | "+l.str+"\n"+c;for(l=ca(e.buffer,r[a],o[a],e.position,p),c+=oa.repeat(" ",t.indent)+da((e.line+1).toString(),d)+" | "+l.str+"\n",c+=oa.repeat("-",t.indent+d+3+l.pos)+"^\n",s=1;s<=t.linesAfter&&!(a+s>=o.length);s++)l=ca(e.buffer,r[a+s],o[a+s],e.position-(r[a]-r[a+s]),p),c+=oa.repeat(" ",t.indent)+da((e.line+s+1).toString(),d)+" | "+l.str+"\n";return c.replace(/\n$/,"")},ua=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],ma=["scalar","sequence","mapping"];var ha=function(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===ua.indexOf(t))throw new la('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=function(e){var t={};return null!==e&&Object.keys(e).forEach(function(i){e[i].forEach(function(e){t[String(e)]=i})}),t}(t.styleAliases||null),-1===ma.indexOf(this.kind))throw new la('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')};function ga(e,t){var i=[];return e[t].forEach(function(e){var t=i.length;i.forEach(function(i,n){i.tag===e.tag&&i.kind===e.kind&&i.multi===e.multi&&(t=n)}),i[t]=e}),i}function va(e){return this.extend(e)}va.prototype.extend=function(e){var t=[],i=[];if(e instanceof ha)i.push(e);else if(Array.isArray(e))i=i.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new la("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(i=i.concat(e.explicit))}t.forEach(function(e){if(!(e instanceof ha))throw new la("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new la("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new la("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(e){if(!(e instanceof ha))throw new la("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var n=Object.create(va.prototype);return n.implicit=(this.implicit||[]).concat(t),n.explicit=(this.explicit||[]).concat(i),n.compiledImplicit=ga(n,"implicit"),n.compiledExplicit=ga(n,"explicit"),n.compiledTypeMap=function(){var e,t,i={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function n(e){e.multi?(i.multi[e.kind].push(e),i.multi.fallback.push(e)):i[e.kind][e.tag]=i.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(n);return i}(n.compiledImplicit,n.compiledExplicit),n};var fa=va,ba=new ha("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),ya=new ha("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),xa=new ha("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),_a=new fa({explicit:[ba,ya,xa]});var wa=new ha("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});var ka=new ha("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function $a(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function Sa(e){return 48<=e&&e<=55}function Ca(e){return 48<=e&&e<=57}var Ta=new ha("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,i=e.length,n=0,r=!1;if(!i)return!1;if("-"!==(t=e[n])&&"+"!==t||(t=e[++n]),"0"===t){if(n+1===i)return!0;if("b"===(t=e[++n])){for(n++;n<i;n++)if("_"!==(t=e[n])){if("0"!==t&&"1"!==t)return!1;r=!0}return r&&"_"!==t}if("x"===t){for(n++;n<i;n++)if("_"!==(t=e[n])){if(!$a(e.charCodeAt(n)))return!1;r=!0}return r&&"_"!==t}if("o"===t){for(n++;n<i;n++)if("_"!==(t=e[n])){if(!Sa(e.charCodeAt(n)))return!1;r=!0}return r&&"_"!==t}}if("_"===t)return!1;for(;n<i;n++)if("_"!==(t=e[n])){if(!Ca(e.charCodeAt(n)))return!1;r=!0}return!(!r||"_"===t)},construct:function(e){var t,i=e,n=1;if(-1!==i.indexOf("_")&&(i=i.replace(/_/g,"")),"-"!==(t=i[0])&&"+"!==t||("-"===t&&(n=-1),t=(i=i.slice(1))[0]),"0"===i)return 0;if("0"===t){if("b"===i[1])return n*parseInt(i.slice(2),2);if("x"===i[1])return n*parseInt(i.slice(2),16);if("o"===i[1])return n*parseInt(i.slice(2),8)}return n*parseInt(i,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!oa.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Ma=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var za=/^[-+]?[0-9]+e/;var Aa=new ha("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!Ma.test(e)||"_"===e[e.length-1])},construct:function(e){var t,i;return i="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:i*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||oa.isNegativeZero(e))},represent:function(e,t){var i;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(oa.isNegativeZero(e))return"-0.0";return i=e.toString(10),za.test(i)?i.replace("e",".e"):i},defaultStyle:"lowercase"}),Ea=_a.extend({implicit:[wa,ka,Ta,Aa]}),Pa=Ea,Ia=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),Ra=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");var La=new ha("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==Ia.exec(e)||null!==Ra.exec(e))},construct:function(e){var t,i,n,r,o,a,s,l,c=0,d=null;if(null===(t=Ia.exec(e))&&(t=Ra.exec(e)),null===t)throw new Error("Date resolve error");if(i=+t[1],n=+t[2]-1,r=+t[3],!t[4])return new Date(Date.UTC(i,n,r));if(o=+t[4],a=+t[5],s=+t[6],t[7]){for(c=t[7].slice(0,3);c.length<3;)c+="0";c=+c}return t[9]&&(d=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(d=-d)),l=new Date(Date.UTC(i,n,r,o,a,s,c)),d&&l.setTime(l.getTime()-d),l},instanceOf:Date,represent:function(e){return e.toISOString()}});var Da=new ha("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),Oa="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";var Na=new ha("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,i,n=0,r=e.length,o=Oa;for(i=0;i<r;i++)if(!((t=o.indexOf(e.charAt(i)))>64)){if(t<0)return!1;n+=6}return n%8==0},construct:function(e){var t,i,n=e.replace(/[\r\n=]/g,""),r=n.length,o=Oa,a=0,s=[];for(t=0;t<r;t++)t%4==0&&t&&(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)),a=a<<6|o.indexOf(n.charAt(t));return 0===(i=r%4*6)?(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)):18===i?(s.push(a>>10&255),s.push(a>>2&255)):12===i&&s.push(a>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,i,n="",r=0,o=e.length,a=Oa;for(t=0;t<o;t++)t%3==0&&t&&(n+=a[r>>18&63],n+=a[r>>12&63],n+=a[r>>6&63],n+=a[63&r]),r=(r<<8)+e[t];return 0===(i=o%3)?(n+=a[r>>18&63],n+=a[r>>12&63],n+=a[r>>6&63],n+=a[63&r]):2===i?(n+=a[r>>10&63],n+=a[r>>4&63],n+=a[r<<2&63],n+=a[64]):1===i&&(n+=a[r>>2&63],n+=a[r<<4&63],n+=a[64],n+=a[64]),n}}),ja=Object.prototype.hasOwnProperty,Fa=Object.prototype.toString;var Ba=new ha("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,i,n,r,o,a=[],s=e;for(t=0,i=s.length;t<i;t+=1){if(n=s[t],o=!1,"[object Object]"!==Fa.call(n))return!1;for(r in n)if(ja.call(n,r)){if(o)return!1;o=!0}if(!o)return!1;if(-1!==a.indexOf(r))return!1;a.push(r)}return!0},construct:function(e){return null!==e?e:[]}}),Ha=Object.prototype.toString;var Ga=new ha("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,i,n,r,o,a=e;for(o=new Array(a.length),t=0,i=a.length;t<i;t+=1){if(n=a[t],"[object Object]"!==Ha.call(n))return!1;if(1!==(r=Object.keys(n)).length)return!1;o[t]=[r[0],n[r[0]]]}return!0},construct:function(e){if(null===e)return[];var t,i,n,r,o,a=e;for(o=new Array(a.length),t=0,i=a.length;t<i;t+=1)n=a[t],r=Object.keys(n),o[t]=[r[0],n[r[0]]];return o}}),Ua=Object.prototype.hasOwnProperty;var Va=new ha("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,i=e;for(t in i)if(Ua.call(i,t)&&null!==i[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),qa=Pa.extend({implicit:[La,Da],explicit:[Na,Ba,Ga,Va]}),Wa=Object.prototype.hasOwnProperty,Qa=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Ya=/[\x85\u2028\u2029]/,Xa=/[,\[\]\{\}]/,Ka=/^(?:!|!!|![a-z\-]+!)$/i,Za=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Ja(e){return Object.prototype.toString.call(e)}function es(e){return 10===e||13===e}function ts(e){return 9===e||32===e}function is(e){return 9===e||32===e||10===e||13===e}function ns(e){return 44===e||91===e||93===e||123===e||125===e}function rs(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function os(e){return 120===e?2:117===e?4:85===e?8:0}function as(e){return 48<=e&&e<=57?e-48:-1}function ss(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function ls(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function cs(e,t,i){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:i}):e[t]=i}for(var ds=new Array(256),ps=new Array(256),us=0;us<256;us++)ds[us]=ss(us)?1:0,ps[us]=ss(us);function ms(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||qa,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function hs(e,t){var i={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return i.snippet=pa(i),new la(t,i)}function gs(e,t){throw hs(e,t)}function vs(e,t){e.onWarning&&e.onWarning.call(null,hs(e,t))}var fs={YAML:function(e,t,i){var n,r,o;null!==e.version&&gs(e,"duplication of %YAML directive"),1!==i.length&&gs(e,"YAML directive accepts exactly one argument"),null===(n=/^([0-9]+)\.([0-9]+)$/.exec(i[0]))&&gs(e,"ill-formed argument of the YAML directive"),r=parseInt(n[1],10),o=parseInt(n[2],10),1!==r&&gs(e,"unacceptable YAML version of the document"),e.version=i[0],e.checkLineBreaks=o<2,1!==o&&2!==o&&vs(e,"unsupported YAML version of the document")},TAG:function(e,t,i){var n,r;2!==i.length&&gs(e,"TAG directive accepts exactly two arguments"),n=i[0],r=i[1],Ka.test(n)||gs(e,"ill-formed tag handle (first argument) of the TAG directive"),Wa.call(e.tagMap,n)&&gs(e,'there is a previously declared suffix for "'+n+'" tag handle'),Za.test(r)||gs(e,"ill-formed tag prefix (second argument) of the TAG directive");try{r=decodeURIComponent(r)}catch(t){gs(e,"tag prefix is malformed: "+r)}e.tagMap[n]=r}};function bs(e,t,i,n){var r,o,a,s;if(t<i){if(s=e.input.slice(t,i),n)for(r=0,o=s.length;r<o;r+=1)9===(a=s.charCodeAt(r))||32<=a&&a<=1114111||gs(e,"expected valid JSON character");else Qa.test(s)&&gs(e,"the stream contains non-printable characters");e.result+=s}}function ys(e,t,i,n){var r,o,a,s;for(oa.isObject(i)||gs(e,"cannot merge mappings; the provided source object is unacceptable"),a=0,s=(r=Object.keys(i)).length;a<s;a+=1)o=r[a],Wa.call(t,o)||(cs(t,o,i[o]),n[o]=!0)}function xs(e,t,i,n,r,o,a,s,l){var c,d;if(Array.isArray(r))for(c=0,d=(r=Array.prototype.slice.call(r)).length;c<d;c+=1)Array.isArray(r[c])&&gs(e,"nested arrays are not supported inside keys"),"object"==typeof r&&"[object Object]"===Ja(r[c])&&(r[c]="[object Object]");if("object"==typeof r&&"[object Object]"===Ja(r)&&(r="[object Object]"),r=String(r),null===t&&(t={}),"tag:yaml.org,2002:merge"===n)if(Array.isArray(o))for(c=0,d=o.length;c<d;c+=1)ys(e,t,o[c],i);else ys(e,t,o,i);else e.json||Wa.call(i,r)||!Wa.call(t,r)||(e.line=a||e.line,e.lineStart=s||e.lineStart,e.position=l||e.position,gs(e,"duplicated mapping key")),cs(t,r,o),delete i[r];return t}function _s(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):gs(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function ws(e,t,i){for(var n=0,r=e.input.charCodeAt(e.position);0!==r;){for(;ts(r);)9===r&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),r=e.input.charCodeAt(++e.position);if(t&&35===r)do{r=e.input.charCodeAt(++e.position)}while(10!==r&&13!==r&&0!==r);if(!es(r))break;for(_s(e),r=e.input.charCodeAt(e.position),n++,e.lineIndent=0;32===r;)e.lineIndent++,r=e.input.charCodeAt(++e.position)}return-1!==i&&0!==n&&e.lineIndent<i&&vs(e,"deficient indentation"),n}function ks(e){var t,i=e.position;return!(45!==(t=e.input.charCodeAt(i))&&46!==t||t!==e.input.charCodeAt(i+1)||t!==e.input.charCodeAt(i+2)||(i+=3,0!==(t=e.input.charCodeAt(i))&&!is(t)))}function $s(e,t){1===t?e.result+=" ":t>1&&(e.result+=oa.repeat("\n",t-1))}function Ss(e,t){var i,n,r=e.tag,o=e.anchor,a=[],s=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),n=e.input.charCodeAt(e.position);0!==n&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,gs(e,"tab characters must not be used in indentation")),45===n)&&is(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,ws(e,!0,-1)&&e.lineIndent<=t)a.push(null),n=e.input.charCodeAt(e.position);else if(i=e.line,Ms(e,t,3,!1,!0),a.push(e.result),ws(e,!0,-1),n=e.input.charCodeAt(e.position),(e.line===i||e.lineIndent>t)&&0!==n)gs(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=r,e.anchor=o,e.kind="sequence",e.result=a,!0)}function Cs(e){var t,i,n,r,o=!1,a=!1;if(33!==(r=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&gs(e,"duplication of a tag property"),60===(r=e.input.charCodeAt(++e.position))?(o=!0,r=e.input.charCodeAt(++e.position)):33===r?(a=!0,i="!!",r=e.input.charCodeAt(++e.position)):i="!",t=e.position,o){do{r=e.input.charCodeAt(++e.position)}while(0!==r&&62!==r);e.position<e.length?(n=e.input.slice(t,e.position),r=e.input.charCodeAt(++e.position)):gs(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==r&&!is(r);)33===r&&(a?gs(e,"tag suffix cannot contain exclamation marks"):(i=e.input.slice(t-1,e.position+1),Ka.test(i)||gs(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),r=e.input.charCodeAt(++e.position);n=e.input.slice(t,e.position),Xa.test(n)&&gs(e,"tag suffix cannot contain flow indicator characters")}n&&!Za.test(n)&&gs(e,"tag name cannot contain such characters: "+n);try{n=decodeURIComponent(n)}catch(t){gs(e,"tag name is malformed: "+n)}return o?e.tag=n:Wa.call(e.tagMap,i)?e.tag=e.tagMap[i]+n:"!"===i?e.tag="!"+n:"!!"===i?e.tag="tag:yaml.org,2002:"+n:gs(e,'undeclared tag handle "'+i+'"'),!0}function Ts(e){var t,i;if(38!==(i=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&gs(e,"duplication of an anchor property"),i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!is(i)&&!ns(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&gs(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function Ms(e,t,i,n,r){var o,a,s,l,c,d,p,u,m,h=1,g=!1,v=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,o=a=s=4===i||3===i,n&&ws(e,!0,-1)&&(g=!0,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)),1===h)for(;Cs(e)||Ts(e);)ws(e,!0,-1)?(g=!0,s=o,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)):s=!1;if(s&&(s=g||r),1!==h&&4!==i||(u=1===i||2===i?t:t+1,m=e.position-e.lineStart,1===h?s&&(Ss(e,m)||function(e,t,i){var n,r,o,a,s,l,c,d=e.tag,p=e.anchor,u={},m=Object.create(null),h=null,g=null,v=null,f=!1,b=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=u),c=e.input.charCodeAt(e.position);0!==c;){if(f||-1===e.firstTabInLine||(e.position=e.firstTabInLine,gs(e,"tab characters must not be used in indentation")),n=e.input.charCodeAt(e.position+1),o=e.line,63!==c&&58!==c||!is(n)){if(a=e.line,s=e.lineStart,l=e.position,!Ms(e,i,2,!1,!0))break;if(e.line===o){for(c=e.input.charCodeAt(e.position);ts(c);)c=e.input.charCodeAt(++e.position);if(58===c)is(c=e.input.charCodeAt(++e.position))||gs(e,"a whitespace character is expected after the key-value separator within a block mapping"),f&&(xs(e,u,m,h,g,null,a,s,l),h=g=v=null),b=!0,f=!1,r=!1,h=e.tag,g=e.result;else{if(!b)return e.tag=d,e.anchor=p,!0;gs(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!b)return e.tag=d,e.anchor=p,!0;gs(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===c?(f&&(xs(e,u,m,h,g,null,a,s,l),h=g=v=null),b=!0,f=!0,r=!0):f?(f=!1,r=!0):gs(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,c=n;if((e.line===o||e.lineIndent>t)&&(f&&(a=e.line,s=e.lineStart,l=e.position),Ms(e,t,4,!0,r)&&(f?g=e.result:v=e.result),f||(xs(e,u,m,h,g,v,a,s,l),h=g=v=null),ws(e,!0,-1),c=e.input.charCodeAt(e.position)),(e.line===o||e.lineIndent>t)&&0!==c)gs(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return f&&xs(e,u,m,h,g,null,a,s,l),b&&(e.tag=d,e.anchor=p,e.kind="mapping",e.result=u),b}(e,m,u))||function(e,t){var i,n,r,o,a,s,l,c,d,p,u,m,h=!0,g=e.tag,v=e.anchor,f=Object.create(null);if(91===(m=e.input.charCodeAt(e.position)))a=93,c=!1,o=[];else{if(123!==m)return!1;a=125,c=!0,o={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=o),m=e.input.charCodeAt(++e.position);0!==m;){if(ws(e,!0,t),(m=e.input.charCodeAt(e.position))===a)return e.position++,e.tag=g,e.anchor=v,e.kind=c?"mapping":"sequence",e.result=o,!0;h?44===m&&gs(e,"expected the node content, but found ','"):gs(e,"missed comma between flow collection entries"),u=null,s=l=!1,63===m&&is(e.input.charCodeAt(e.position+1))&&(s=l=!0,e.position++,ws(e,!0,t)),i=e.line,n=e.lineStart,r=e.position,Ms(e,t,1,!1,!0),p=e.tag,d=e.result,ws(e,!0,t),m=e.input.charCodeAt(e.position),!l&&e.line!==i||58!==m||(s=!0,m=e.input.charCodeAt(++e.position),ws(e,!0,t),Ms(e,t,1,!1,!0),u=e.result),c?xs(e,o,f,p,d,u,i,n,r):s?o.push(xs(e,null,f,p,d,u,i,n,r)):o.push(d),ws(e,!0,t),44===(m=e.input.charCodeAt(e.position))?(h=!0,m=e.input.charCodeAt(++e.position)):h=!1}gs(e,"unexpected end of the stream within a flow collection")}(e,u)?v=!0:(a&&function(e,t){var i,n,r,o,a=1,s=!1,l=!1,c=t,d=0,p=!1;if(124===(o=e.input.charCodeAt(e.position)))n=!1;else{if(62!==o)return!1;n=!0}for(e.kind="scalar",e.result="";0!==o;)if(43===(o=e.input.charCodeAt(++e.position))||45===o)1===a?a=43===o?3:2:gs(e,"repeat of a chomping mode identifier");else{if(!((r=as(o))>=0))break;0===r?gs(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):l?gs(e,"repeat of an indentation width identifier"):(c=t+r-1,l=!0)}if(ts(o)){do{o=e.input.charCodeAt(++e.position)}while(ts(o));if(35===o)do{o=e.input.charCodeAt(++e.position)}while(!es(o)&&0!==o)}for(;0!==o;){for(_s(e),e.lineIndent=0,o=e.input.charCodeAt(e.position);(!l||e.lineIndent<c)&&32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position);if(!l&&e.lineIndent>c&&(c=e.lineIndent),es(o))d++;else{if(e.lineIndent<c){3===a?e.result+=oa.repeat("\n",s?1+d:d):1===a&&s&&(e.result+="\n");break}for(n?ts(o)?(p=!0,e.result+=oa.repeat("\n",s?1+d:d)):p?(p=!1,e.result+=oa.repeat("\n",d+1)):0===d?s&&(e.result+=" "):e.result+=oa.repeat("\n",d):e.result+=oa.repeat("\n",s?1+d:d),s=!0,l=!0,d=0,i=e.position;!es(o)&&0!==o;)o=e.input.charCodeAt(++e.position);bs(e,i,e.position,!1)}}return!0}(e,u)||function(e,t){var i,n,r;if(39!==(i=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,n=r=e.position;0!==(i=e.input.charCodeAt(e.position));)if(39===i){if(bs(e,n,e.position,!0),39!==(i=e.input.charCodeAt(++e.position)))return!0;n=e.position,e.position++,r=e.position}else es(i)?(bs(e,n,r,!0),$s(e,ws(e,!1,t)),n=r=e.position):e.position===e.lineStart&&ks(e)?gs(e,"unexpected end of the document within a single quoted scalar"):(e.position++,r=e.position);gs(e,"unexpected end of the stream within a single quoted scalar")}(e,u)||function(e,t){var i,n,r,o,a,s;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=n=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return bs(e,i,e.position,!0),e.position++,!0;if(92===s){if(bs(e,i,e.position,!0),es(s=e.input.charCodeAt(++e.position)))ws(e,!1,t);else if(s<256&&ds[s])e.result+=ps[s],e.position++;else if((a=os(s))>0){for(r=a,o=0;r>0;r--)(a=rs(s=e.input.charCodeAt(++e.position)))>=0?o=(o<<4)+a:gs(e,"expected hexadecimal character");e.result+=ls(o),e.position++}else gs(e,"unknown escape sequence");i=n=e.position}else es(s)?(bs(e,i,n,!0),$s(e,ws(e,!1,t)),i=n=e.position):e.position===e.lineStart&&ks(e)?gs(e,"unexpected end of the document within a double quoted scalar"):(e.position++,n=e.position)}gs(e,"unexpected end of the stream within a double quoted scalar")}(e,u)?v=!0:!function(e){var t,i,n;if(42!==(n=e.input.charCodeAt(e.position)))return!1;for(n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!is(n)&&!ns(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&gs(e,"name of an alias node must contain at least one character"),i=e.input.slice(t,e.position),Wa.call(e.anchorMap,i)||gs(e,'unidentified alias "'+i+'"'),e.result=e.anchorMap[i],ws(e,!0,-1),!0}(e)?function(e,t,i){var n,r,o,a,s,l,c,d,p=e.kind,u=e.result;if(is(d=e.input.charCodeAt(e.position))||ns(d)||35===d||38===d||42===d||33===d||124===d||62===d||39===d||34===d||37===d||64===d||96===d)return!1;if((63===d||45===d)&&(is(n=e.input.charCodeAt(e.position+1))||i&&ns(n)))return!1;for(e.kind="scalar",e.result="",r=o=e.position,a=!1;0!==d;){if(58===d){if(is(n=e.input.charCodeAt(e.position+1))||i&&ns(n))break}else if(35===d){if(is(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&ks(e)||i&&ns(d))break;if(es(d)){if(s=e.line,l=e.lineStart,c=e.lineIndent,ws(e,!1,-1),e.lineIndent>=t){a=!0,d=e.input.charCodeAt(e.position);continue}e.position=o,e.line=s,e.lineStart=l,e.lineIndent=c;break}}a&&(bs(e,r,o,!1),$s(e,e.line-s),r=o=e.position,a=!1),ts(d)||(o=e.position+1),d=e.input.charCodeAt(++e.position)}return bs(e,r,o,!1),!!e.result||(e.kind=p,e.result=u,!1)}(e,u,1===i)&&(v=!0,null===e.tag&&(e.tag="?")):(v=!0,null===e.tag&&null===e.anchor||gs(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===h&&(v=s&&Ss(e,m))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&gs(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),l=0,c=e.implicitTypes.length;l<c;l+=1)if((p=e.implicitTypes[l]).resolve(e.result)){e.result=p.construct(e.result),e.tag=p.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(Wa.call(e.typeMap[e.kind||"fallback"],e.tag))p=e.typeMap[e.kind||"fallback"][e.tag];else for(p=null,l=0,c=(d=e.typeMap.multi[e.kind||"fallback"]).length;l<c;l+=1)if(e.tag.slice(0,d[l].tag.length)===d[l].tag){p=d[l];break}p||gs(e,"unknown tag !<"+e.tag+">"),null!==e.result&&p.kind!==e.kind&&gs(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+p.kind+'", not "'+e.kind+'"'),p.resolve(e.result,e.tag)?(e.result=p.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):gs(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||v}function zs(e){var t,i,n,r,o=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(r=e.input.charCodeAt(e.position))&&(ws(e,!0,-1),r=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==r));){for(a=!0,r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!is(r);)r=e.input.charCodeAt(++e.position);for(n=[],(i=e.input.slice(t,e.position)).length<1&&gs(e,"directive name must not be less than one character in length");0!==r;){for(;ts(r);)r=e.input.charCodeAt(++e.position);if(35===r){do{r=e.input.charCodeAt(++e.position)}while(0!==r&&!es(r));break}if(es(r))break;for(t=e.position;0!==r&&!is(r);)r=e.input.charCodeAt(++e.position);n.push(e.input.slice(t,e.position))}0!==r&&_s(e),Wa.call(fs,i)?fs[i](e,i,n):vs(e,'unknown document directive "'+i+'"')}ws(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,ws(e,!0,-1)):a&&gs(e,"directives end mark is expected"),Ms(e,e.lineIndent-1,4,!1,!0),ws(e,!0,-1),e.checkLineBreaks&&Ya.test(e.input.slice(o,e.position))&&vs(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&ks(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,ws(e,!0,-1)):e.position<e.length-1&&gs(e,"end of the stream or a document separator is expected")}function As(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var i=new ms(e,t),n=e.indexOf("\0");for(-1!==n&&(i.position=n,gs(i,"null byte is not allowed in input")),i.input+="\0";32===i.input.charCodeAt(i.position);)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)zs(i);return i.documents}var Es=function(e,t,i){null!==t&&"object"==typeof t&&void 0===i&&(i=t,t=null);var n=As(e,i);if("function"!=typeof t)return n;for(var r=0,o=n.length;r<o;r+=1)t(n[r])},Ps=function(e,t){var i=As(e,t);if(0!==i.length){if(1===i.length)return i[0];throw new la("expected a single document in the stream, but found more")}},Is={loadAll:Es,load:Ps},Rs=Object.prototype.toString,Ls=Object.prototype.hasOwnProperty,Ds=65279,Os={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},Ns=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],js=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function Fs(e){var t,i,n;if(t=e.toString(16).toUpperCase(),e<=255)i="x",n=2;else if(e<=65535)i="u",n=4;else{if(!(e<=4294967295))throw new la("code point within a string may not be greater than 0xFFFFFFFF");i="U",n=8}return"\\"+i+oa.repeat("0",n-t.length)+t}function Bs(e){this.schema=e.schema||qa,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=oa.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var i,n,r,o,a,s,l;if(null===t)return{};for(i={},r=0,o=(n=Object.keys(t)).length;r<o;r+=1)a=n[r],s=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(l=e.compiledTypeMap.fallback[a])&&Ls.call(l.styleAliases,s)&&(s=l.styleAliases[s]),i[a]=s;return i}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Hs(e,t){for(var i,n=oa.repeat(" ",t),r=0,o=-1,a="",s=e.length;r<s;)-1===(o=e.indexOf("\n",r))?(i=e.slice(r),r=s):(i=e.slice(r,o+1),r=o+1),i.length&&"\n"!==i&&(a+=n),a+=i;return a}function Gs(e,t){return"\n"+oa.repeat(" ",e.indent*t)}function Us(e){return 32===e||9===e}function Vs(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&e!==Ds||65536<=e&&e<=1114111}function qs(e){return Vs(e)&&e!==Ds&&13!==e&&10!==e}function Ws(e,t,i){var n=qs(e),r=n&&!Us(e);return(i?n:n&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!r)||qs(t)&&!Us(t)&&35===e||58===t&&r}function Qs(e,t){var i,n=e.charCodeAt(t);return n>=55296&&n<=56319&&t+1<e.length&&(i=e.charCodeAt(t+1))>=56320&&i<=57343?1024*(n-55296)+i-56320+65536:n}function Ys(e){return/^\n* /.test(e)}function Xs(e,t,i,n,r,o,a,s){var l,c=0,d=null,p=!1,u=!1,m=-1!==n,h=-1,g=function(e){return Vs(e)&&e!==Ds&&!Us(e)&&45!==e&&63!==e&&58!==e&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e&&35!==e&&38!==e&&42!==e&&33!==e&&124!==e&&61!==e&&62!==e&&39!==e&&34!==e&&37!==e&&64!==e&&96!==e}(Qs(e,0))&&function(e){return!Us(e)&&58!==e}(Qs(e,e.length-1));if(t||a)for(l=0;l<e.length;c>=65536?l+=2:l++){if(!Vs(c=Qs(e,l)))return 5;g=g&&Ws(c,d,s),d=c}else{for(l=0;l<e.length;c>=65536?l+=2:l++){if(10===(c=Qs(e,l)))p=!0,m&&(u=u||l-h-1>n&&" "!==e[h+1],h=l);else if(!Vs(c))return 5;g=g&&Ws(c,d,s),d=c}u=u||m&&l-h-1>n&&" "!==e[h+1]}return p||u?i>9&&Ys(e)?5:a?2===o?5:2:u?4:3:!g||a||r(e)?2===o?5:2:1}function Ks(e,t,i,n,r){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==Ns.indexOf(t)||js.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var o=e.indent*Math.max(1,i),a=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-o),s=n||e.flowLevel>-1&&i>=e.flowLevel;switch(Xs(t,s,e.indent,a,function(t){return function(e,t){var i,n;for(i=0,n=e.implicitTypes.length;i<n;i+=1)if(e.implicitTypes[i].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!n,r)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+Zs(t,e.indent)+Js(Hs(t,o));case 4:return">"+Zs(t,e.indent)+Js(Hs(function(e,t){var i,n,r=/(\n+)([^\n]*)/g,o=(s=e.indexOf("\n"),s=-1!==s?s:e.length,r.lastIndex=s,el(e.slice(0,s),t)),a="\n"===e[0]||" "===e[0];var s;for(;n=r.exec(e);){var l=n[1],c=n[2];i=" "===c[0],o+=l+(a||i||""===c?"":"\n")+el(c,t),a=i}return o}(t,a),o));case 5:return'"'+function(e){for(var t,i="",n=0,r=0;r<e.length;n>=65536?r+=2:r++)n=Qs(e,r),!(t=Os[n])&&Vs(n)?(i+=e[r],n>=65536&&(i+=e[r+1])):i+=t||Fs(n);return i}(t)+'"';default:throw new la("impossible error: invalid scalar style")}}()}function Zs(e,t){var i=Ys(e)?String(t):"",n="\n"===e[e.length-1];return i+(n&&("\n"===e[e.length-2]||"\n"===e)?"+":n?"":"-")+"\n"}function Js(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function el(e,t){if(""===e||" "===e[0])return e;for(var i,n,r=/ [^ ]/g,o=0,a=0,s=0,l="";i=r.exec(e);)(s=i.index)-o>t&&(n=a>o?a:s,l+="\n"+e.slice(o,n),o=n+1),a=s;return l+="\n",e.length-o>t&&a>o?l+=e.slice(o,a)+"\n"+e.slice(a+1):l+=e.slice(o),l.slice(1)}function tl(e,t,i,n){var r,o,a,s="",l=e.tag;for(r=0,o=i.length;r<o;r+=1)a=i[r],e.replacer&&(a=e.replacer.call(i,String(r),a)),(nl(e,t+1,a,!0,!0,!1,!0)||void 0===a&&nl(e,t+1,null,!0,!0,!1,!0))&&(n&&""===s||(s+=Gs(e,t)),e.dump&&10===e.dump.charCodeAt(0)?s+="-":s+="- ",s+=e.dump);e.tag=l,e.dump=s||"[]"}function il(e,t,i){var n,r,o,a,s,l;for(o=0,a=(r=i?e.explicitTypes:e.implicitTypes).length;o<a;o+=1)if(((s=r[o]).instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(i?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag="?",s.represent){if(l=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===Rs.call(s.represent))n=s.represent(t,l);else{if(!Ls.call(s.represent,l))throw new la("!<"+s.tag+'> tag resolver accepts not "'+l+'" style');n=s.represent[l](t,l)}e.dump=n}return!0}return!1}function nl(e,t,i,n,r,o,a){e.tag=null,e.dump=i,il(e,i,!1)||il(e,i,!0);var s,l=Rs.call(e.dump),c=n;n&&(n=e.flowLevel<0||e.flowLevel>t);var d,p,u="[object Object]"===l||"[object Array]"===l;if(u&&(p=-1!==(d=e.duplicates.indexOf(i))),(null!==e.tag&&"?"!==e.tag||p||2!==e.indent&&t>0)&&(r=!1),p&&e.usedDuplicates[d])e.dump="*ref_"+d;else{if(u&&p&&!e.usedDuplicates[d]&&(e.usedDuplicates[d]=!0),"[object Object]"===l)n&&0!==Object.keys(e.dump).length?(!function(e,t,i,n){var r,o,a,s,l,c,d="",p=e.tag,u=Object.keys(i);if(!0===e.sortKeys)u.sort();else if("function"==typeof e.sortKeys)u.sort(e.sortKeys);else if(e.sortKeys)throw new la("sortKeys must be a boolean or a function");for(r=0,o=u.length;r<o;r+=1)c="",n&&""===d||(c+=Gs(e,t)),s=i[a=u[r]],e.replacer&&(s=e.replacer.call(i,a,s)),nl(e,t+1,a,!0,!0,!0)&&((l=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?c+="?":c+="? "),c+=e.dump,l&&(c+=Gs(e,t)),nl(e,t+1,s,!0,l)&&(e.dump&&10===e.dump.charCodeAt(0)?c+=":":c+=": ",d+=c+=e.dump));e.tag=p,e.dump=d||"{}"}(e,t,e.dump,r),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,i){var n,r,o,a,s,l="",c=e.tag,d=Object.keys(i);for(n=0,r=d.length;n<r;n+=1)s="",""!==l&&(s+=", "),e.condenseFlow&&(s+='"'),a=i[o=d[n]],e.replacer&&(a=e.replacer.call(i,o,a)),nl(e,t,o,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),nl(e,t,a,!1,!1)&&(l+=s+=e.dump));e.tag=c,e.dump="{"+l+"}"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else if("[object Array]"===l)n&&0!==e.dump.length?(e.noArrayIndent&&!a&&t>0?tl(e,t-1,e.dump,r):tl(e,t,e.dump,r),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,i){var n,r,o,a="",s=e.tag;for(n=0,r=i.length;n<r;n+=1)o=i[n],e.replacer&&(o=e.replacer.call(i,String(n),o)),(nl(e,t,o,!1,!1)||void 0===o&&nl(e,t,null,!1,!1))&&(""!==a&&(a+=","+(e.condenseFlow?"":" ")),a+=e.dump);e.tag=s,e.dump="["+a+"]"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else{if("[object String]"!==l){if("[object Undefined]"===l)return!1;if(e.skipInvalid)return!1;throw new la("unacceptable kind of an object to dump "+l)}"?"!==e.tag&&Ks(e,e.dump,t,o,c)}null!==e.tag&&"?"!==e.tag&&(s=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),s="!"===e.tag[0]?"!"+s:"tag:yaml.org,2002:"===s.slice(0,18)?"!!"+s.slice(18):"!<"+s+">",e.dump=s+" "+e.dump)}return!0}function rl(e,t){var i,n,r=[],o=[];for(ol(e,r,o),i=0,n=o.length;i<n;i+=1)t.duplicates.push(r[o[i]]);t.usedDuplicates=new Array(n)}function ol(e,t,i){var n,r,o;if(null!==e&&"object"==typeof e)if(-1!==(r=t.indexOf(e)))-1===i.indexOf(r)&&i.push(r);else if(t.push(e),Array.isArray(e))for(r=0,o=e.length;r<o;r+=1)ol(e[r],t,i);else for(r=0,o=(n=Object.keys(e)).length;r<o;r+=1)ol(e[n[r]],t,i)}var al=function(e,t){var i=new Bs(t=t||{});i.noRefs||rl(e,i);var n=e;return i.replacer&&(n=i.replacer.call({"":n},"",n)),nl(i,0,n,!0,!0)?i.dump+"\n":""};function sl(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var ll={Type:ha,Schema:fa,FAILSAFE_SCHEMA:_a,JSON_SCHEMA:Ea,CORE_SCHEMA:Pa,DEFAULT_SCHEMA:qa,load:Is.load,loadAll:Is.loadAll,dump:{dump:al}.dump,YAMLException:la,types:{binary:Na,float:Aa,map:xa,null:wa,pairs:Ga,set:Va,timestamp:La,bool:ka,int:Ta,merge:Da,omap:Ba,seq:ya,str:ba},safeLoad:sl("safeLoad","load"),safeLoadAll:sl("safeLoadAll","loadAll"),safeDump:sl("safeDump","dump")};function cl(e){try{return ll.load(e)}catch{return null}}var dl=function(e,t,i,n){var r,o=arguments.length,a=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(o<3?r(a):o>3?r(t,i,a):r(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let pl=null,ul=null;async function ml(){return pl||(ul||(ul=window.loadCardHelpers()),pl=await ul,pl)}let hl=class extends xe{constructor(){super(...arguments),this._loading=!1}updated(e){if(e.has("cardType")&&this.cardType!==this._currentCardType)this._createElement();else{if(e.has("cardConfig")&&this._element){const e=JSON.stringify(this.cardConfig);if(e!==this._configHash){this._configHash=e;try{this._element.setConfig({type:this.cardType,...this.cardConfig||{}})}catch{}}}this._element&&this.hass&&(this._element.hass=this.hass)}}async _createElement(){if(this._loading)return;const e=this.renderRoot.querySelector(".mc-embedded-container");if(e){if(!this.cardType)return this._element=void 0,this._currentCardType=void 0,void(e.innerHTML="");this._loading=!0,this._currentCardType=this.cardType;try{const t=await ml(),i={type:this.cardType,...this.cardConfig||{}},n=t.createCardElement(i);this.hass&&(n.hass=this.hass),this._configHash=JSON.stringify(this.cardConfig),this._element=n,e.innerHTML="",e.appendChild(n)}catch(t){e.innerHTML="";const i=document.createElement("div");i.className="mc-embedded-error",i.textContent=`Failed to load "${this.cardType}": ${String(t)}`,e.appendChild(i)}finally{this._loading=!1}}}firstUpdated(){this.cardType&&this._createElement()}render(){return te`<div class="mc-embedded-container">
      ${!this._element&&this.cardType?te`<div class="mc-embedded-loading">Loading card...</div>`:ne}
    </div>`}};hl.styles=g`
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
  `,dl([Se({attribute:!1})],hl.prototype,"hass",void 0),dl([Se({type:String,attribute:"card-type"})],hl.prototype,"cardType",void 0),dl([Se({attribute:!1})],hl.prototype,"cardConfig",void 0),hl=dl([we("mc-embedded-card")],hl);Ye.register(new class extends Ri{constructor(){super(...arguments),this.metadata={type:"custom-card",name:"Custom Card",description:"Embed any 3rd party Lovelace card",category:"advanced",icon:"mdi:card-plus-outline"},this._editorCache=new Map}getAvailableTabs(){return["general","conditions","design"]}createDefault(){return{id:dt("custom-card"),type:"custom-card",name:"",card_type:"",card_config:{}}}renderPreview(e,t){const i=e;return i.card_type?te`
      <div class="mc-module mc-custom-card">
        <mc-embedded-card
          card-type=${i.card_type}
          .cardConfig=${i.card_config||{}}
          .hass=${t}
        ></mc-embedded-card>
      </div>
    `:te`
        <div class="mc-module mc-custom-card mc-custom-card-placeholder">
          <ha-icon icon="mdi:card-plus-outline"></ha-icon>
          <span>No card type set</span>
        </div>
      `}async _getOrCreateEditor(e,t,i){const n=e.card_type;if(!n)return null;const r=this._editorCache.get(e.id);if(r&&r.cardType===n)return r.editor;try{const r=await ml(),o={type:n,...e.card_config||{}},a=r.createCardElement(o),s=a.localName;await Promise.race([customElements.whenDefined(s),new Promise((e,t)=>setTimeout(()=>t(new Error(`Timeout waiting for ${s}`)),5e3))]);const l=a.constructor;if("function"!=typeof l.getConfigElement)return this._editorCache.set(e.id,{editor:null,cardType:n,attempted:!0}),null;const c=await l.getConfigElement();c.localName?.includes("-")&&await Promise.race([customElements.whenDefined(c.localName),new Promise((e,t)=>setTimeout(()=>t(new Error(`Timeout waiting for ${c.localName}`)),5e3))]),t&&(c.hass=t);try{c.setConfig(o)}catch{}return c.addEventListener("config-changed",t=>{const n=t.detail?.config;if(n){const{type:t,...r}=n;i({...e,card_config:r,card_config_yaml:void 0})}}),this._editorCache.set(e.id,{editor:c,cardType:n,attempted:!0}),c}catch{return this._editorCache.set(e.id,{editor:null,cardType:n,attempted:!0}),null}}renderGeneralTab(e,t,i,n){const r=this._buildSyncContext(e,n),o=e;return te`
      <div class="mc-tab-content">
        ${Lt("Name",o.name,e=>i({...o,name:e}),"name",r)}
        ${Pt("An optional label to help you identify this card in the editor.","mc-field-hint-tight")}
        ${function(e,t,i,n,r){return te`
    <div class="mc-field">
      ${Et(e,n,r)}
      <mc-card-picker
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-card-picker>
    </div>
  `}("Card Type",o.card_type,e=>{this._editorCache.delete(o.id),i({...o,card_type:e})})}
        ${o.card_type?te`
            <div class="mc-card-editor-section">
              <div class="mc-card-editor-header">
                <ha-icon class="mc-card-editor-icon" icon="mdi:cog"></ha-icon>
                Card Configuration
              </div>
              <div class="mc-card-editor-body">
                ${na(this._renderEditorContent(o,t,i),te`<div class="mc-editor-loading">Loading editor...</div>`)}
              </div>
            </div>
          `:ne}
      </div>
    `}async _renderEditorContent(e,t,i){const n=await this._getOrCreateEditor(e,t,i);if(n)return t&&(n.hass=t),te`${n}`;const r=e.card_config_yaml??(e.card_config?function(e){try{return ll.dump(e,{indent:2,lineWidth:120,noRefs:!0,sortKeys:!1})}catch{return""}}(e.card_config):""),o=cl(r);return te`
      <div class="mc-yaml-fallback">
        <div class="mc-yaml-fallback-note">
          No visual editor available for this card type. Configure using YAML:
        </div>
        <textarea
          .value=${r}
          @input=${t=>{const n=t.target.value,r=cl(n);i(null!==r?{...e,card_config:r,card_config_yaml:n}:{...e,card_config_yaml:n})}}
          rows="12"
          placeholder="entity: sensor.temperature
name: My Sensor
show_state: true"
        ></textarea>
        ${""===r||null!==o?ne:te`<div class="mc-yaml-fallback-error">
              Invalid YAML - card will use last valid configuration
            </div>`}
        <div class="mc-yaml-fallback-help">
          The <code>type</code> key is set automatically from Card Type. Do not include it here.
        </div>
      </div>
    `}validate(e){const t=[];return e.card_type||t.push("Card type is required"),t}}),window.customCards=window.customCards||[],window.customCards.push({type:n,name:"Magic Card",description:"A fully open-source multi-module card with advanced editor",preview:!0,documentationURL:"https://github.com/therealmcsparrow/magic-card"}),console.info("%c MAGIC-CARD %c v0.0.2-beta ","color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;")})();