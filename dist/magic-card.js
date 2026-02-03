(()=>{"use strict";const e="magic-card",t="magic-card-editor",i=["content","controls","layout","advanced"],r=globalThis,o=r.ShadowRoot&&(void 0===r.ShadyCSS||r.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),a=new WeakMap;class s{constructor(e,t,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(t,e))}return e}toString(){return this.cssText}}const c=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new s(i,e,n)},l=(e,t)=>{if(o)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),o=r.litNonce;void 0!==o&&t.setAttribute("nonce",o),t.textContent=i.cssText,e.appendChild(t)}},d=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:p,defineProperty:u,getOwnPropertyDescriptor:m,getOwnPropertyNames:h,getOwnPropertySymbols:g,getPrototypeOf:f}=Object,v=globalThis,b=v.trustedTypes,y=b?b.emptyScript:"",x=v.reactiveElementPolyfillSupport,_=(e,t)=>e,w={toAttribute(e,t){switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},$=(e,t)=>!p(e,t),k={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),v.litPropertyMetadata??=new WeakMap;class C extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=k){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);void 0!==r&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:o}=m(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){const n=r?.call(this);o?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??k}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=f(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...h(e),...g(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(d(e))}else void 0!==e&&t.push(d(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return l(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:w).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,r=i._$Eh.get(e);if(void 0!==r&&this._$Em!==r){const e=i.getPropertyOptions(r),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:w;this._$Em=r;const n=o.fromAttribute(t,e.type);this[r]=n??this._$Ej?.get(r)??n,this._$Em=null}}requestUpdate(e,t,i,r=!1,o){if(void 0!==e){const n=this.constructor;if(!1===r&&(o=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??$)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:o},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,r=this[t];!0!==e||this._$AL.has(t)||void 0===r||this.C(t,void 0,i,r)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}C.elementStyles=[],C.shadowRootOptions={mode:"open"},C[_("elementProperties")]=new Map,C[_("finalized")]=new Map,x?.({ReactiveElement:C}),(v.reactiveElementVersions??=[]).push("2.1.2");const S=globalThis,A=e=>e,M=S.trustedTypes,z=M?M.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,I="?"+T,O=`<${I}>`,j=document,D=()=>j.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,N=e=>R(e)||"function"==typeof e?.[Symbol.iterator],L="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,F=/>/g,B=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),q=/'/g,G=/"/g,W=/^(?:script|style|textarea|title)$/i,Y=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),Q=Y(1),V=(Y(2),Y(3),Symbol.for("lit-noChange")),K=Symbol.for("lit-nothing"),J=new WeakMap,Z=j.createTreeWalker(j,129);function X(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==z?z.createHTML(t):t}const ee=(e,t)=>{const i=e.length-1,r=[];let o,n=2===t?"<svg>":3===t?"<math>":"",a=U;for(let t=0;t<i;t++){const i=e[t];let s,c,l=-1,d=0;for(;d<i.length&&(a.lastIndex=d,c=a.exec(i),null!==c);)d=a.lastIndex,a===U?"!--"===c[1]?a=H:void 0!==c[1]?a=F:void 0!==c[2]?(W.test(c[2])&&(o=RegExp("</"+c[2],"g")),a=B):void 0!==c[3]&&(a=B):a===B?">"===c[0]?(a=o??U,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,s=c[1],a=void 0===c[3]?B:'"'===c[3]?G:q):a===G||a===q?a=B:a===H||a===F?a=U:(a=B,o=void 0);const p=a===B&&e[t+1].startsWith("/>")?" ":"";n+=a===U?i+O:l>=0?(r.push(s),i.slice(0,l)+E+i.slice(l)+T+p):i+T+(-2===l?t:p)}return[X(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),r]};class te{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let o=0,n=0;const a=e.length-1,s=this.parts,[c,l]=ee(e,t);if(this.el=te.createElement(c,i),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(r=Z.nextNode())&&s.length<a;){if(1===r.nodeType){if(r.hasAttributes())for(const e of r.getAttributeNames())if(e.endsWith(E)){const t=l[n++],i=r.getAttribute(e).split(T),a=/([.?@])?(.*)/.exec(t);s.push({type:1,index:o,name:a[2],strings:i,ctor:"."===a[1]?ae:"?"===a[1]?se:"@"===a[1]?ce:ne}),r.removeAttribute(e)}else e.startsWith(T)&&(s.push({type:6,index:o}),r.removeAttribute(e));if(W.test(r.tagName)){const e=r.textContent.split(T),t=e.length-1;if(t>0){r.textContent=M?M.emptyScript:"";for(let i=0;i<t;i++)r.append(e[i],D()),Z.nextNode(),s.push({type:2,index:++o});r.append(e[t],D())}}}else if(8===r.nodeType)if(r.data===I)s.push({type:2,index:o});else{let e=-1;for(;-1!==(e=r.data.indexOf(T,e+1));)s.push({type:7,index:o}),e+=T.length-1}o++}}static createElement(e,t){const i=j.createElement("template");return i.innerHTML=e,i}}function ie(e,t,i=e,r){if(t===V)return t;let o=void 0!==r?i._$Co?.[r]:i._$Cl;const n=P(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,i,r)),void 0!==r?(i._$Co??=[])[r]=o:i._$Cl=o),void 0!==o&&(t=ie(e,o._$AS(e,t.values),o,r)),t}class re{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??j).importNode(t,!0);Z.currentNode=r;let o=Z.nextNode(),n=0,a=0,s=i[0];for(;void 0!==s;){if(n===s.index){let t;2===s.type?t=new oe(o,o.nextSibling,this,e):1===s.type?t=new s.ctor(o,s.name,s.strings,this,e):6===s.type&&(t=new le(o,this,e)),this._$AV.push(t),s=i[++a]}n!==s?.index&&(o=Z.nextNode(),n++)}return Z.currentNode=j,r}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class oe{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ie(this,e,t),P(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):N(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(j.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,r="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=te.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{const e=new re(r,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=J.get(e.strings);return void 0===t&&J.set(e.strings,t=new te(e)),t}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const o of e)r===t.length?t.push(i=new oe(this.O(D()),this.O(D()),this,this.options)):i=t[r],i._$AI(o),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ne{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,o){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=K}_$AI(e,t=this,i,r){const o=this.strings;let n=!1;if(void 0===o)e=ie(this,e,t,0),n=!P(e)||e!==this._$AH&&e!==V,n&&(this._$AH=e);else{const r=e;let a,s;for(e=o[0],a=0;a<o.length-1;a++)s=ie(this,r[i+a],t,a),s===V&&(s=this._$AH[a]),n||=!P(s)||s!==this._$AH[a],s===K?e=K:e!==K&&(e+=(s??"")+o[a+1]),this._$AH[a]=s}n&&!r&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ae extends ne{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class se extends ne{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class ce extends ne{constructor(e,t,i,r,o){super(e,t,i,r,o),this.type=5}_$AI(e,t=this){if((e=ie(this,e,t,0)??K)===V)return;const i=this._$AH,r=e===K&&i!==K||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==K&&(i===K||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class le{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ie(this,e)}}const de={M:E,P:T,A:I,C:1,L:ee,R:re,D:N,V:ie,I:oe,H:ne,N:se,U:ce,B:ae,F:le},pe=S.litHtmlPolyfillSupport;pe?.(te,oe),(S.litHtmlVersions??=[]).push("3.3.2");const ue=globalThis;class me extends C{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const r=i?.renderBefore??t;let o=r._$litPart$;if(void 0===o){const e=i?.renderBefore??null;r._$litPart$=o=new oe(t.insertBefore(D(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}me._$litElement$=!0,me.finalized=!0,ue.litElementHydrateSupport?.({LitElement:me});const he=ue.litElementPolyfillSupport;he?.({LitElement:me});(ue.litElementVersions??=[]).push("4.2.2");const ge=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},fe={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:$},ve=(e=fe,t,i)=>{const{kind:r,metadata:o}=i;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===r&&((e=Object.create(e)).wrapped=!0),n.set(i.name,e),"accessor"===r){const{name:r}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(r,o,e,!0,i)},init(t){return void 0!==t&&this.C(r,void 0,e,t),t}}}if("setter"===r){const{name:r}=i;return function(i){const o=this[r];t.call(this,i),this.requestUpdate(r,o,e,!0,i)}}throw Error("Unsupported decorator location: "+r)};function be(e){return(t,i)=>"object"==typeof i?ve(e,t,i):((e,t,i)=>{const r=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),r?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ye(e){return be({...e,state:!0,attribute:!1})}const xe=c`
  :host {
    display: block;
    --mc-primary: var(--primary-color, #6366f1);
    --mc-text: var(--primary-text-color, #1a1a2e);
    --mc-text-secondary: var(--secondary-text-color, #6b7280);
    --mc-bg: var(--card-background-color, #ffffff);
    --mc-border: var(--divider-color, #e5e7eb);
    --mc-gap: 8px;
    --mc-padding: 16px;
    --mc-radius: 12px;
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
    font-size: 0.875rem;
    color: var(--mc-text);
  }

  .mc-info-state {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--mc-text);
  }

  .mc-info-secondary {
    font-size: 0.75rem;
    color: var(--mc-text-secondary);
  }

  .mc-image {
    width: 100%;
    overflow: hidden;
  }

  .mc-image img {
    width: 100%;
    height: auto;
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
    height: 8px;
    background: var(--mc-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .mc-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
    background: var(--mc-primary);
  }

  .mc-bar-value {
    font-size: 0.875rem;
    margin-top: 4px;
    color: var(--mc-text-secondary);
  }

  .mc-separator {
    width: 100%;
    border: none;
    border-top: 1px solid var(--mc-border);
    margin: 4px 0;
  }

  .mc-separator-vertical {
    width: auto;
    height: 100%;
    border: none;
    border-left: 1px solid var(--mc-border);
    margin: 0 4px;
  }

  .mc-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid var(--mc-border);
    background: var(--mc-bg);
    color: var(--mc-text);
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s;
  }

  .mc-button:hover {
    background: var(--mc-border);
  }

  .mc-slider-container {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mc-slider {
    flex: 1;
    -webkit-appearance: none;
    height: 6px;
    border-radius: 3px;
    background: var(--mc-border);
    outline: none;
  }

  .mc-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--mc-primary);
    cursor: pointer;
  }

  .mc-slider-value {
    font-size: 0.875rem;
    min-width: 40px;
    text-align: right;
    color: var(--mc-text-secondary);
  }

  .mc-spinbox {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .mc-spinbox-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--mc-border);
    background: var(--mc-bg);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.125rem;
  }

  .mc-spinbox-value {
    font-size: 1.125rem;
    font-weight: 500;
    min-width: 48px;
    text-align: center;
  }

  .mc-dropdown select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--mc-border);
    border-radius: 8px;
    background: var(--mc-bg);
    color: var(--mc-text);
    font-size: 0.875rem;
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
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: -20px;
  }

  .mc-light {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
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
    gap: 4px;
    border-bottom: 1px solid var(--mc-border);
    margin-bottom: 8px;
  }

  .mc-tab-button {
    padding: 8px 16px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--mc-text-secondary);
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  .mc-tab-button.active {
    color: var(--mc-primary);
    border-bottom-color: var(--mc-primary);
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
    font-size: 0.875rem;
    color: var(--mc-text-secondary);
  }

  .mc-weather {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mc-weather-temp {
    font-size: 2rem;
    font-weight: 600;
  }

  .mc-weather-condition {
    font-size: 0.875rem;
    color: var(--mc-text-secondary);
    text-transform: capitalize;
  }

  .mc-forecast {
    display: flex;
    gap: 8px;
    overflow-x: auto;
  }

  .mc-forecast-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px;
    min-width: 60px;
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

  .mc-camera {
    width: 100%;
    overflow: hidden;
  }

  .mc-camera img {
    width: 100%;
    display: block;
  }

  .mc-graphs {
    width: 100%;
  }

  .mc-graphs svg {
    width: 100%;
    height: auto;
  }

  /* Hover effect support */
  .mc-hoverable {
    transition: all 0.2s ease;
  }

  /* Hidden by display condition */
  .mc-hidden {
    display: none !important;
  }

  /* Error state */
  .mc-error {
    color: var(--error-color, #ef4444);
    padding: 8px;
    font-size: 0.875rem;
  }
`;const _e=new class{constructor(){this.modules=new Map}register(e){this.modules.set(e.metadata.type,e)}get(e){return this.modules.get(e)}getAll(){return Array.from(this.modules.values())}getByCategory(e){return this.getAll().filter(t=>t.metadata.category===e)}getMetadata(){return this.getAll().map(e=>e.metadata)}search(e){const t=e.toLowerCase();return this.getAll().filter(e=>e.metadata.name.toLowerCase().includes(t)||e.metadata.description.toLowerCase().includes(t)||e.metadata.type.toLowerCase().includes(t))}createDefault(e){const t=this.get(e);return t?t.createDefault():null}has(e){return this.modules.has(e)}get types(){return Array.from(this.modules.keys())}},we={font_size:"font-size",font_weight:"font-weight",font_family:"font-family",line_height:"line-height",text_align:"text-align",text_transform:"text-transform",letter_spacing:"letter-spacing",color:"color",background:"background",opacity:"opacity",padding:"padding",margin:"margin",border:"border",border_radius:"border-radius",border_color:"border-color",box_shadow:"box-shadow",text_shadow:"text-shadow",width:"width",height:"height",min_width:"min-width",min_height:"min-height",max_width:"max-width",max_height:"max-height",overflow:"overflow",flex:"flex",filter:"filter",backdrop_filter:"backdrop-filter",transform:"transform",transition:"transition"};function $e(e){if(!e)return"";const t=[];for(const[i,r]of Object.entries(we)){const o=e[i];void 0!==o&&"string"==typeof o&&t.push(`${r}: ${o}`)}return e.css&&t.push(e.css),t.join("; ")}let ke=0;function Ce(e="mc"){ke++;return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}_${ke}`}var Se=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let Ae=class extends me{static getConfigElement(){return document.createElement(t)}static getStubConfig(){return{type:`custom:${e}`,rows:[{id:Ce("row"),layout:"1",columns:[{id:Ce("col"),modules:[{id:Ce("text"),type:"text",text:"Welcome to Magic Card"}]}]}]}}setConfig(e){if(!e)throw new Error("No configuration provided");this._config={...e,rows:e.rows||[]},this._config.rows=this._config.rows.map(e=>({...e,id:e.id||Ce("row"),columns:(e.columns||[]).map(e=>({...e,id:e.id||Ce("col"),modules:(e.modules||[]).map(e=>({...e,id:e.id||Ce(e.type)}))}))}))}getCardSize(){return this._config?.rows?Math.max(this._config.rows.length,1):1}render(){if(!this._config)return Q`<ha-card><div class="mc-error">No configuration</div></ha-card>`;const e=this._buildCardStyle();return Q`
      <ha-card>
        <div class="mc-card-content" style=${e}>
          ${this._config.rows.map(e=>this._renderRow(e))}
        </div>
      </ha-card>
    `}_buildCardStyle(){const e=[],t=this._config;return t.padding&&e.push(`padding: ${t.padding}`),t.background&&e.push(`background: ${t.background}`),t.border_radius&&e.push(`border-radius: ${t.border_radius}`),t.box_shadow&&e.push(`box-shadow: ${t.box_shadow}`),t.card_height&&e.push(`min-height: ${t.card_height}`),t.overflow&&e.push(`overflow: ${t.overflow}`),e.join("; ")}_renderRow(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return Q``;var t;const i=`grid-template-columns: ${(t=e.layout||"1")?{1:"1fr","1-1":"1fr 1fr","1-2":"1fr 2fr","2-1":"2fr 1fr","1-1-1":"1fr 1fr 1fr","1-2-1":"1fr 2fr 1fr"}[t]||t:"1fr"}; gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,r=$e(e.design);return Q`
      <div class="mc-row" style="${i}; ${r}">
        ${e.columns.map(e=>this._renderColumn(e))}
      </div>
    `}_renderColumn(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return Q``;const t=`gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,i=$e(e.design);return Q`
      <div
        class="mc-column"
        data-valign=${e.vertical_align||K}
        style="${t}; ${i}"
      >
        ${e.modules.map(e=>this._renderModule(e))}
      </div>
    `}_renderModule(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return Q``;const t=_e.get(e.type);if(!t)return Q`<div class="mc-error">Unknown module: ${e.type}</div>`;const i=$e(e.design),r=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return Q`
      <div
        class="mc-module-wrapper ${r?"mc-hoverable":""}"
        style=${i}
        @click=${r?t=>this._handleAction(t,e,"tap"):K}
        @contextmenu=${r?t=>this._handleAction(t,e,"hold"):K}
        @dblclick=${r?t=>this._handleAction(t,e,"double_tap"):K}
      >
        ${t.renderPreview(e,this.hass)}
      </div>
    `}_evaluateDisplay(e){if(!e.conditions?.length)return!0;if(!this.hass)return!0;const t=e.conditions.map(e=>{switch(e.type){case"state":{if(!e.entity)return!0;const t=this.hass.states[e.entity];return!!t&&(void 0!==e.state&&""!==e.state?t.state===e.state:void 0!==e.state_not&&""!==e.state_not?t.state!==e.state_not:!(void 0!==e.above&&Number(t.state)<=e.above)&&!(void 0!==e.below&&Number(t.state)>=e.below))}case"attribute":{if(!e.entity||!e.attribute)return!0;const t=this.hass.states[e.entity];if(!t)return!1;const i=String(t.attributes[e.attribute]??"");return void 0!==e.state&&""!==e.state?i===e.state:void 0===e.state_not||""===e.state_not||i!==e.state_not}case"time":{const t=new Date,i=60*t.getHours()+t.getMinutes();if(e.after){const[t,r]=e.after.split(":").map(Number);if(i<60*t+r)return!1}if(e.before){const[t,r]=e.before.split(":").map(Number);if(i>=60*t+r)return!1}return!0}default:return!0}});return"any"===e.mode?t.some(Boolean):t.every(Boolean)}_handleAction(e,t,i){"hold"===i&&e.preventDefault();const r=`${i}_action`,o=t.actions?.[r];if(!o||"none"===o.action)return;const n=t.entity;switch(o.action){case"more-info":if(n||o.entity){const e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:o.entity||n}});this.dispatchEvent(e)}break;case"toggle":if(n||o.entity){const e=o.entity||n,t=e.split(".")[0];this.hass?.callService(t,"toggle",{entity_id:e})}break;case"navigate":if(o.navigation_path){history.pushState(null,"",o.navigation_path);const e=new Event("location-changed",{bubbles:!0,composed:!0});window.dispatchEvent(e)}break;case"url":o.url_path&&window.open(o.url_path,"_blank");break;case"perform-action":if(o.service){const[e,t]=o.service.split(".");this.hass?.callService(e,t,{...o.data,...o.service_data})}break;case"assist":this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}}}))}}};Ae.styles=xe,Se([be({attribute:!1})],Ae.prototype,"hass",void 0),Se([ye()],Ae.prototype,"_config",void 0),Ae=Se([ge(e)],Ae);const Me=c`
  :host {
    display: block;
    --mc-editor-bg: var(--card-background-color, #fff);
    --mc-editor-text: var(--primary-text-color, #1a1a2e);
    --mc-editor-text-secondary: var(--secondary-text-color, #6b7280);
    --mc-editor-border: var(--divider-color, #e5e7eb);
    --mc-editor-primary: var(--primary-color, #6366f1);
    --mc-editor-primary-light: color-mix(in srgb, var(--mc-editor-primary) 15%, transparent);
    --mc-editor-radius: 8px;
  }

  .mc-editor {
    padding: 16px;
    font-family: var(--paper-font-body1_-_font-family, 'Roboto', sans-serif);
    color: var(--mc-editor-text);
  }

  /* Mode Switcher */
  .mc-mode-switcher {
    display: flex;
    gap: 4px;
    margin-bottom: 16px;
    background: var(--mc-editor-border);
    border-radius: var(--mc-editor-radius);
    padding: 4px;
  }

  .mc-mode-btn {
    flex: 1;
    padding: 8px 12px;
    border: none;
    background: none;
    border-radius: calc(var(--mc-editor-radius) - 2px);
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--mc-editor-text-secondary);
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .mc-mode-btn.active {
    background: var(--mc-editor-bg);
    color: var(--mc-editor-primary);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .mc-mode-btn:hover:not(.active) {
    color: var(--mc-editor-text);
  }

  /* Toolbar */
  .mc-editor-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
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
    color: var(--mc-editor-text-secondary);
    transition: all 0.15s;
  }

  .mc-toolbar-btn:hover:not(:disabled) {
    background: var(--mc-editor-border);
    color: var(--mc-editor-text);
  }

  .mc-toolbar-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  /* Settings Panel */
  .mc-settings-panel {
    border: 1px solid var(--mc-editor-border);
    border-radius: var(--mc-editor-radius);
    overflow: hidden;
    margin-top: 12px;
  }

  .mc-settings-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--mc-editor-primary-light);
    border-bottom: 1px solid var(--mc-editor-border);
    font-size: 0.875rem;
    font-weight: 500;
  }

  .mc-settings-tabs {
    display: flex;
    border-bottom: 1px solid var(--mc-editor-border);
  }

  .mc-settings-tab {
    flex: 1;
    padding: 8px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--mc-editor-text-secondary);
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
    text-align: center;
  }

  .mc-settings-tab.active {
    color: var(--mc-editor-primary);
    border-bottom-color: var(--mc-editor-primary);
  }

  .mc-settings-tab:hover:not(.active) {
    color: var(--mc-editor-text);
  }

  .mc-settings-content {
    padding: 16px;
  }

  /* Shared Form Styles */
  .mc-tab-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .mc-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-section-header {
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--mc-editor-text);
    padding-bottom: 4px;
    border-bottom: 1px solid var(--mc-editor-border);
    margin-top: 8px;
  }

  .mc-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .mc-field-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--mc-editor-text-secondary);
  }

  .mc-field input[type='text'],
  .mc-field input[type='number'],
  .mc-field select,
  .mc-field textarea {
    padding: 8px 12px;
    border: 1px solid var(--mc-editor-border);
    border-radius: 6px;
    font-size: 0.875rem;
    background: var(--mc-editor-bg);
    color: var(--mc-editor-text);
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    box-sizing: border-box;
  }

  .mc-field input:focus,
  .mc-field select:focus,
  .mc-field textarea:focus {
    border-color: var(--mc-editor-primary);
  }

  .mc-field-toggle {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .mc-field-toggle input[type='checkbox'] {
    width: 18px;
    height: 18px;
    accent-color: var(--mc-editor-primary);
  }

  .mc-field-hint {
    font-size: 0.75rem;
    color: var(--mc-editor-text-secondary);
    font-style: italic;
  }

  .mc-entity-field {
    position: relative;
  }

  .mc-entity-field input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--mc-editor-border);
    border-radius: 6px;
    font-size: 0.875rem;
    background: var(--mc-editor-bg);
    color: var(--mc-editor-text);
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
  }

  .mc-entity-field input:focus {
    border-color: var(--mc-editor-primary);
  }

  /* Buttons */
  .mc-btn {
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-size: 0.8125rem;
    font-weight: 500;
    transition: all 0.15s;
  }

  .mc-btn-primary {
    background: var(--mc-editor-primary);
    color: white;
  }

  .mc-btn-primary:hover {
    filter: brightness(1.1);
  }

  .mc-btn-secondary {
    background: var(--mc-editor-border);
    color: var(--mc-editor-text);
  }

  .mc-btn-secondary:hover {
    filter: brightness(0.95);
  }

  .mc-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: 1px solid var(--mc-editor-border);
    border-radius: 6px;
    background: none;
    cursor: pointer;
    color: var(--mc-editor-text-secondary);
    font-size: 1rem;
    transition: all 0.15s;
  }

  .mc-btn-icon:hover {
    background: var(--mc-editor-border);
    color: var(--mc-editor-text);
  }

  /* Condition items */
  .mc-condition-item {
    padding: 12px;
    border: 1px solid var(--mc-editor-border);
    border-radius: var(--mc-editor-radius);
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
  }

  .mc-condition-item .mc-btn-icon {
    position: absolute;
    top: 8px;
    right: 8px;
  }

  /* Action config */
  .mc-action-config {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    border: 1px solid var(--mc-editor-border);
    border-radius: 6px;
  }
`;function ze(e){if(null===e||"object"!=typeof e)return e;if(Array.isArray(e))return e.map(e=>ze(e));const t={};for(const i of Object.keys(e))t[i]=ze(e[i]);return t}class Ee{constructor(e=50){this.undoStack=[],this.redoStack=[],this.limit=e}push(e){this.undoStack.push(ze(e)),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack=[]}undo(e){return 0===this.undoStack.length?null:(this.redoStack.push(ze(e)),this.undoStack.pop())}redo(e){return 0===this.redoStack.length?null:(this.undoStack.push(ze(e)),this.redoStack.pop())}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}clear(){this.undoStack=[],this.redoStack=[]}get undoCount(){return this.undoStack.length}get redoCount(){return this.redoStack.length}}class Te{constructor(e){this.fireEvent=e,this.undoRedo=new Ee,this.listeners=new Set,this.state={config:{type:"custom:magic-card",rows:[]},selectedPath:null,activeTab:"general",editorMode:"form",isDirty:!1},this.dispatchConfigChanged=function(e,t){let i=null;const r=function(...r){null!==i&&clearTimeout(i),i=setTimeout(()=>{e.apply(this,r),i=null},t)};return r.cancel=()=>{null!==i&&(clearTimeout(i),i=null)},r}(e=>{this.fireEvent(e)},200)}subscribe(e){return this.listeners.add(e),e(this.state),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return this.state}getConfig(){return this.state.config}getSelectedModule(){const e=this.state.selectedPath;return void 0===e?.rowIndex||void 0===e?.columnIndex||void 0===e?.moduleIndex?null:this.state.config.rows[e.rowIndex]?.columns[e.columnIndex]?.modules[e.moduleIndex]??null}setConfig(e){this.state={...this.state,config:ze(e),isDirty:!1},this.notify()}updateConfig(e,t=!0){t&&this.undoRedo.push(this.state.config),this.state={...this.state,config:ze(e),isDirty:!0},this.notify(),this.dispatchConfigChanged(this.state.config)}setEditorMode(e){this.state={...this.state,editorMode:e},this.notify()}setSelectedPath(e){this.state={...this.state,selectedPath:e},this.notify()}setActiveTab(e){this.state={...this.state,activeTab:e},this.notify()}addRow(e="1"){const t=ze(this.state.config),i=e.split("-").length,r=Array.from({length:i},()=>({id:Ce("col"),modules:[]}));t.rows.push({id:Ce("row"),layout:e,columns:r}),this.updateConfig(t)}deleteRow(e){const t=ze(this.state.config);t.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(t)}moveRow(e,t){if(e===t)return;const i=ze(this.state.config),[r]=i.rows.splice(e,1);i.rows.splice(t,0,r),this.updateConfig(i)}updateRow(e,t){const i=ze(this.state.config);i.rows[e]={...i.rows[e],...t},this.updateConfig(i)}addColumn(e){const t=ze(this.state.config);t.rows[e].columns.push({id:Ce("col"),modules:[]}),this.updateConfig(t)}deleteColumn(e,t){const i=ze(this.state.config);i.rows[e].columns.splice(t,1),0===i.rows[e].columns.length&&i.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(i)}addModule(e,t,i){const r=ze(this.state.config),o=_e.createDefault(i);if(!o)return;r.rows[e].columns[t].modules.push(o);const n=r.rows[e].columns[t].modules.length-1;this.updateConfig(r),this.setSelectedPath({rowIndex:e,columnIndex:t,moduleIndex:n})}deleteModule(e,t,i){const r=ze(this.state.config);r.rows[e].columns[t].modules.splice(i,1),this.state.selectedPath=null,this.updateConfig(r)}updateModule(e,t,i,r){const o=ze(this.state.config),n=o.rows[e].columns[t].modules[i];o.rows[e].columns[t].modules[i]={...n,...r},this.updateConfig(o)}moveModule(e,t,i,r,o,n){const a=ze(this.state.config),[s]=a.rows[e].columns[t].modules.splice(i,1);a.rows[r].columns[o].modules.splice(n,0,s),this.updateConfig(a),this.setSelectedPath({rowIndex:r,columnIndex:o,moduleIndex:n})}undo(){const e=this.undoRedo.undo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}redo(){const e=this.undoRedo.redo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}canUndo(){return this.undoRedo.canUndo()}canRedo(){return this.undoRedo.canRedo()}destroy(){this.dispatchConfigChanged.cancel(),this.listeners.clear(),this.undoRedo.clear()}}const Ie=c`
  :host {
    display: block;
  }

  .mc-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-rows-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* Card-level settings */
  .mc-card-section {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
  }

  .mc-card-section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 6%, transparent);
    cursor: pointer;
    user-select: none;
    font-size: 0.8125rem;
    font-weight: 600;
  }

  .mc-card-section-header:hover {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
  }

  .mc-card-section-header .mc-chevron {
    transition: transform 0.2s;
    margin-left: auto;
  }

  .mc-card-section-header .mc-chevron.open {
    transform: rotate(90deg);
  }

  .mc-card-section-body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid var(--divider-color, #e5e7eb);
  }

  /* Row */
  .mc-row-item {
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    overflow: hidden;
  }

  .mc-row-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 4%, transparent);
    font-size: 0.8125rem;
    font-weight: 500;
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
  }

  .mc-row-header-toggle:hover {
    color: var(--primary-color, #6366f1);
  }

  .mc-row-header .mc-chevron {
    font-size: 0.625rem;
    transition: transform 0.2s;
    color: var(--secondary-text-color, #6b7280);
  }

  .mc-row-header .mc-chevron.open {
    transform: rotate(90deg);
  }

  .mc-row-layout-select {
    flex: 1;
    max-width: 100px;
  }

  .mc-row-layout-select .mc-field {
    margin: 0;
  }

  .mc-row-layout-select select {
    padding: 4px 8px;
    font-size: 0.75rem;
  }

  .mc-row-body {
    padding: 8px;
    display: flex;
    gap: 8px;
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

  .mc-module-item.drag-over {
    border-color: var(--primary-color, #6366f1);
    border-style: dashed;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 15%, transparent);
  }

  .mc-modules-container {
    min-height: 40px;
    transition: background 0.15s;
  }

  .mc-modules-container:empty {
    border: 1px dashed var(--divider-color, #e5e7eb);
    border-radius: 6px;
  }

  /* Column */
  .mc-col-item {
    flex: 1;
    border: 1px dashed var(--divider-color, #e5e7eb);
    border-radius: 6px;
    padding: 8px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .mc-col-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--secondary-text-color, #6b7280);
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

  .mc-modules-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-height: 20px;
  }

  /* Module item */
  .mc-module-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 0.8125rem;
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
    font-size: 0.6875rem;
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
    gap: 4px;
    padding: 8px;
    border: 1px dashed var(--divider-color, #e5e7eb);
    border-radius: 6px;
    background: none;
    cursor: pointer;
    font-size: 0.75rem;
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
    width: 28px;
    height: 28px;
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
`;function Oe(e,t,i){return Q`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="text"
        .value=${t||""}
        @input=${e=>i(e.target.value)}
      />
    </div>
  `}function je(e,t,i,r){return Q`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="number"
        .value=${String(t??"")}
        min=${r?.min??K}
        max=${r?.max??K}
        step=${r?.step??K}
        @input=${e=>i(Number(e.target.value))}
      />
    </div>
  `}function De(e,t,i,r){return Q`
    <div class="mc-field">
      ${e?Q`<label class="mc-field-label">${e}</label>`:K}
      <select @change=${e=>r(e.target.value)}>
        ${i.map(e=>Q`<option value=${e.value} ?selected=${t===e.value}>
              ${e.label}
            </option>`)}
      </select>
    </div>
  `}function Pe(e,t,i){return Q`
    <div class="mc-field mc-field-toggle">
      <label class="mc-field-label">${e}</label>
      <input
        type="checkbox"
        .checked=${t??!1}
        @change=${e=>i(e.target.checked)}
      />
    </div>
  `}function Re(e,t,i,r){return Q`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-entity-picker
        .hass=${r}
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-entity-picker>
    </div>
  `}function Ne(e,t,i){return Q`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-color-picker
        .value=${t||""}
        .label=${e}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-color-picker>
    </div>
  `}function Le(e,t,i){return Q`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-unit-field
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-unit-field>
    </div>
  `}function Ue(e,t,i){return Q`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-icon-picker
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value||"")}
      ></mc-icon-picker>
    </div>
  `}var He=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let Fe=class extends me{constructor(){super(...arguments),this._expandedSections=new Set(["card"]),this._collapsedRows=new Set,this._dragOver=null,this._dragState=null}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}_onRowDragStart(e,t){this._dragState={type:"row",rowIndex:t},e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._dragState)),e.target.classList.add("dragging")}_onRowDragEnd(e){e.target.classList.remove("dragging"),this._dragState=null,this._dragOver=null}_onRowDragOver(e,t){this._dragState&&"row"===this._dragState.type&&(e.preventDefault(),e.dataTransfer.dropEffect="move",this._dragOver={type:"row",index:t})}_onRowDragLeave(){this._dragOver=null}_onRowDrop(e,t){if(e.preventDefault(),!this._dragState||"row"!==this._dragState.type)return;const i=this._dragState.rowIndex;i!==t&&this.stateManager.moveRow(i,t),this._dragState=null,this._dragOver=null}_onModuleDragStart(e,t,i,r){this._dragState={type:"module",rowIndex:t,colIndex:i,moduleIndex:r},e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._dragState)),e.target.classList.add("dragging"),e.stopPropagation()}_onModuleDragEnd(e){e.target.classList.remove("dragging"),this._dragState=null,this._dragOver=null}_onModuleDragOver(e,t,i,r){this._dragState&&"module"===this._dragState.type&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="move",this._dragOver={type:"module",index:r,colIndex:i})}_onContainerDragOver(e,t,i){this._dragState&&"module"===this._dragState.type&&(e.preventDefault(),e.dataTransfer.dropEffect="move")}_onModuleDrop(e,t,i,r){if(e.preventDefault(),e.stopPropagation(),!this._dragState||"module"!==this._dragState.type)return;const{rowIndex:o,colIndex:n,moduleIndex:a}=this._dragState;o===t&&n===i&&a===r||this.stateManager.moveModule(o,n,a,t,i,r),this._dragState=null,this._dragOver=null}_onContainerDrop(e,t,i){if(e.preventDefault(),!this._dragState||"module"!==this._dragState.type)return;const{rowIndex:r,colIndex:o,moduleIndex:n}=this._dragState,a=(this._editorState?.config.rows[t]?.columns[i]?.modules||[]).length;this.stateManager.moveModule(r,o,n,t,i,a),this._dragState=null,this._dragOver=null}render(){if(!this._editorState)return Q``;const{config:e,selectedPath:t}=this._editorState;return Q`
      <div class="mc-form">
        ${this._renderCardSection(e)}
        <div class="mc-rows-container">
          ${e.rows.map((e,i)=>this._renderRow(e,i,t))}
        </div>
      </div>
    `}_renderCardSection(e){const t=this._expandedSections.has("card");return Q`
      <div class="mc-card-section">
        <div
          class="mc-card-section-header"
          @click=${()=>this._toggleSection("card")}
        >
          <ha-icon icon="mdi:card-outline" style="--mdc-icon-size:18px"></ha-icon>
          Card Settings
          <span class="mc-chevron ${t?"open":""}">&#9654;</span>
        </div>
        ${t?Q`
              <div class="mc-card-section-body">
                ${Ne("Background",e.background,t=>this.stateManager.updateConfig({...e,background:t}))}
                ${Le("Border Radius",e.border_radius,t=>this.stateManager.updateConfig({...e,border_radius:t}))}
                ${Le("Padding",e.padding,t=>this.stateManager.updateConfig({...e,padding:t}))}
                ${Oe("Box Shadow",e.box_shadow,t=>this.stateManager.updateConfig({...e,box_shadow:t}))}
                ${Le("Card Height",e.card_height,t=>this.stateManager.updateConfig({...e,card_height:t}))}
              </div>
            `:K}
      </div>
    `}_renderRow(e,t,i){const r="row"===this._dragOver?.type&&this._dragOver?.index===t,o=this._collapsedRows.has(t);return Q`
      <div
        class="mc-row-item ${r?"drag-over":""} ${o?"collapsed":""}"
        data-row="${t}"
        draggable="true"
        @dragstart=${e=>this._onRowDragStart(e,t)}
        @dragend=${e=>this._onRowDragEnd(e)}
        @dragover=${e=>this._onRowDragOver(e,t)}
        @dragleave=${()=>this._onRowDragLeave()}
        @drop=${e=>this._onRowDrop(e,t)}
      >
        <div class="mc-row-header">
          <span class="mc-drag-handle" title="Drag to reorder">
            <ha-icon icon="mdi:drag" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span
            class="mc-row-header-toggle"
            @click=${()=>this._toggleRow(t)}
          >
            <span class="mc-chevron ${o?"":"open"}">&#9654;</span>
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
            <span class="mc-label">Row ${t+1}</span>
          </span>
          <div class="mc-row-layout-select">
            ${De("",e.layout,[{label:"1 Col",value:"1"},{label:"1-1",value:"1-1"},{label:"1-2",value:"1-2"},{label:"2-1",value:"2-1"},{label:"1-1-1",value:"1-1-1"}],e=>this.stateManager.updateRow(t,{layout:e}))}
          </div>
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
        </div>
        ${o?K:Q`
            <div class="mc-row-body">
              ${e.columns.map((e,r)=>this._renderColumn(e,t,r,i))}
            </div>
          `}
      </div>
    `}_renderColumn(e,t,i,r){const o=this._editorState?.config.rows[t],n=o&&o.columns.length>1;return Q`
      <div class="mc-col-item">
        <div class="mc-col-header">
          <ha-icon icon="mdi:view-column" style="--mdc-icon-size:14px"></ha-icon>
          <span class="mc-label">Column ${i+1}</span>
          ${n?Q`
            <button
              class="mc-btn-icon mc-btn-small"
              @click=${()=>this.stateManager.deleteColumn(t,i)}
              title="Delete column"
            >
              <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
            </button>
          `:K}
        </div>
        <div
          class="mc-modules-container"
          data-row="${t}"
          data-col="${i}"
          @dragover=${e=>this._onContainerDragOver(e,t,i)}
          @drop=${e=>this._onContainerDrop(e,t,i)}
        >
          ${e.modules.map((e,o)=>{const n=r?.rowIndex===t&&r?.columnIndex===i&&r?.moduleIndex===o,a=_e.get(e.type),s="module"===this._dragOver?.type&&this._dragOver?.index===o&&this._dragOver?.colIndex===i;return Q`
              <div
                class="mc-module-item ${n?"selected":""} ${s?"drag-over":""}"
                draggable="true"
                @dragstart=${e=>this._onModuleDragStart(e,t,i,o)}
                @dragend=${e=>this._onModuleDragEnd(e)}
                @dragover=${e=>this._onModuleDragOver(e,t,i,o)}
                @drop=${e=>this._onModuleDrop(e,t,i,o)}
                @click=${()=>this.stateManager.setSelectedPath({rowIndex:t,columnIndex:i,moduleIndex:o})}
              >
                <span class="mc-module-drag" title="Drag to reorder">
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
                  @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,i,o)}}
                  title="Delete module"
                >
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
                </button>
              </div>
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
    `}_toggleSection(e){this._expandedSections.has(e)?this._expandedSections.delete(e):this._expandedSections.add(e),this.requestUpdate()}_toggleRow(e){this._collapsedRows.has(e)?this._collapsedRows.delete(e):this._collapsedRows.add(e),this.requestUpdate()}};function Be(e){return null==e}Fe.styles=[Me,Ie],He([be({attribute:!1})],Fe.prototype,"stateManager",void 0),He([be({attribute:!1})],Fe.prototype,"hass",void 0),He([ye()],Fe.prototype,"_editorState",void 0),He([ye()],Fe.prototype,"_expandedSections",void 0),He([ye()],Fe.prototype,"_collapsedRows",void 0),He([ye()],Fe.prototype,"_dragOver",void 0),Fe=He([ge("mc-form-editor")],Fe);var qe={isNothing:Be,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:Be(e)?[]:[e]},repeat:function(e,t){var i,r="";for(i=0;i<t;i+=1)r+=e;return r},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:function(e,t){var i,r,o,n;if(t)for(i=0,r=(n=Object.keys(t)).length;i<r;i+=1)e[o=n[i]]=t[o];return e}};function Ge(e,t){var i="",r=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(i+='in "'+e.mark.name+'" '),i+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(i+="\n\n"+e.mark.snippet),r+" "+i):r}function We(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=Ge(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}We.prototype=Object.create(Error.prototype),We.prototype.constructor=We,We.prototype.toString=function(e){return this.name+": "+Ge(this,e)};var Ye=We;function Qe(e,t,i,r,o){var n="",a="",s=Math.floor(o/2)-1;return r-t>s&&(t=r-s+(n=" ... ").length),i-r>s&&(i=r+s-(a=" ...").length),{str:n+e.slice(t,i).replace(/\t/g,"→")+a,pos:r-t+n.length}}function Ve(e,t){return qe.repeat(" ",t-e.length)+e}var Ke=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var i,r=/\r?\n|\r|\0/g,o=[0],n=[],a=-1;i=r.exec(e.buffer);)n.push(i.index),o.push(i.index+i[0].length),e.position<=i.index&&a<0&&(a=o.length-2);a<0&&(a=o.length-1);var s,c,l="",d=Math.min(e.line+t.linesAfter,n.length).toString().length,p=t.maxLength-(t.indent+d+3);for(s=1;s<=t.linesBefore&&!(a-s<0);s++)c=Qe(e.buffer,o[a-s],n[a-s],e.position-(o[a]-o[a-s]),p),l=qe.repeat(" ",t.indent)+Ve((e.line-s+1).toString(),d)+" | "+c.str+"\n"+l;for(c=Qe(e.buffer,o[a],n[a],e.position,p),l+=qe.repeat(" ",t.indent)+Ve((e.line+1).toString(),d)+" | "+c.str+"\n",l+=qe.repeat("-",t.indent+d+3+c.pos)+"^\n",s=1;s<=t.linesAfter&&!(a+s>=n.length);s++)c=Qe(e.buffer,o[a+s],n[a+s],e.position-(o[a]-o[a+s]),p),l+=qe.repeat(" ",t.indent)+Ve((e.line+s+1).toString(),d)+" | "+c.str+"\n";return l.replace(/\n$/,"")},Je=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Ze=["scalar","sequence","mapping"];var Xe=function(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===Je.indexOf(t))throw new Ye('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=function(e){var t={};return null!==e&&Object.keys(e).forEach(function(i){e[i].forEach(function(e){t[String(e)]=i})}),t}(t.styleAliases||null),-1===Ze.indexOf(this.kind))throw new Ye('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')};function et(e,t){var i=[];return e[t].forEach(function(e){var t=i.length;i.forEach(function(i,r){i.tag===e.tag&&i.kind===e.kind&&i.multi===e.multi&&(t=r)}),i[t]=e}),i}function tt(e){return this.extend(e)}tt.prototype.extend=function(e){var t=[],i=[];if(e instanceof Xe)i.push(e);else if(Array.isArray(e))i=i.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new Ye("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(i=i.concat(e.explicit))}t.forEach(function(e){if(!(e instanceof Xe))throw new Ye("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new Ye("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new Ye("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(e){if(!(e instanceof Xe))throw new Ye("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var r=Object.create(tt.prototype);return r.implicit=(this.implicit||[]).concat(t),r.explicit=(this.explicit||[]).concat(i),r.compiledImplicit=et(r,"implicit"),r.compiledExplicit=et(r,"explicit"),r.compiledTypeMap=function(){var e,t,i={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function r(e){e.multi?(i.multi[e.kind].push(e),i.multi.fallback.push(e)):i[e.kind][e.tag]=i.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(r);return i}(r.compiledImplicit,r.compiledExplicit),r};var it=tt,rt=new Xe("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),ot=new Xe("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),nt=new Xe("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),at=new it({explicit:[rt,ot,nt]});var st=new Xe("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});var ct=new Xe("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function lt(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function dt(e){return 48<=e&&e<=55}function pt(e){return 48<=e&&e<=57}var ut=new Xe("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,i=e.length,r=0,o=!1;if(!i)return!1;if("-"!==(t=e[r])&&"+"!==t||(t=e[++r]),"0"===t){if(r+1===i)return!0;if("b"===(t=e[++r])){for(r++;r<i;r++)if("_"!==(t=e[r])){if("0"!==t&&"1"!==t)return!1;o=!0}return o&&"_"!==t}if("x"===t){for(r++;r<i;r++)if("_"!==(t=e[r])){if(!lt(e.charCodeAt(r)))return!1;o=!0}return o&&"_"!==t}if("o"===t){for(r++;r<i;r++)if("_"!==(t=e[r])){if(!dt(e.charCodeAt(r)))return!1;o=!0}return o&&"_"!==t}}if("_"===t)return!1;for(;r<i;r++)if("_"!==(t=e[r])){if(!pt(e.charCodeAt(r)))return!1;o=!0}return!(!o||"_"===t)},construct:function(e){var t,i=e,r=1;if(-1!==i.indexOf("_")&&(i=i.replace(/_/g,"")),"-"!==(t=i[0])&&"+"!==t||("-"===t&&(r=-1),t=(i=i.slice(1))[0]),"0"===i)return 0;if("0"===t){if("b"===i[1])return r*parseInt(i.slice(2),2);if("x"===i[1])return r*parseInt(i.slice(2),16);if("o"===i[1])return r*parseInt(i.slice(2),8)}return r*parseInt(i,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!qe.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),mt=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var ht=/^[-+]?[0-9]+e/;var gt=new Xe("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!mt.test(e)||"_"===e[e.length-1])},construct:function(e){var t,i;return i="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:i*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||qe.isNegativeZero(e))},represent:function(e,t){var i;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(qe.isNegativeZero(e))return"-0.0";return i=e.toString(10),ht.test(i)?i.replace("e",".e"):i},defaultStyle:"lowercase"}),ft=at.extend({implicit:[st,ct,ut,gt]}),vt=ft,bt=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),yt=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");var xt=new Xe("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==bt.exec(e)||null!==yt.exec(e))},construct:function(e){var t,i,r,o,n,a,s,c,l=0,d=null;if(null===(t=bt.exec(e))&&(t=yt.exec(e)),null===t)throw new Error("Date resolve error");if(i=+t[1],r=+t[2]-1,o=+t[3],!t[4])return new Date(Date.UTC(i,r,o));if(n=+t[4],a=+t[5],s=+t[6],t[7]){for(l=t[7].slice(0,3);l.length<3;)l+="0";l=+l}return t[9]&&(d=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(d=-d)),c=new Date(Date.UTC(i,r,o,n,a,s,l)),d&&c.setTime(c.getTime()-d),c},instanceOf:Date,represent:function(e){return e.toISOString()}});var _t=new Xe("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),wt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";var $t=new Xe("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,i,r=0,o=e.length,n=wt;for(i=0;i<o;i++)if(!((t=n.indexOf(e.charAt(i)))>64)){if(t<0)return!1;r+=6}return r%8==0},construct:function(e){var t,i,r=e.replace(/[\r\n=]/g,""),o=r.length,n=wt,a=0,s=[];for(t=0;t<o;t++)t%4==0&&t&&(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)),a=a<<6|n.indexOf(r.charAt(t));return 0===(i=o%4*6)?(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)):18===i?(s.push(a>>10&255),s.push(a>>2&255)):12===i&&s.push(a>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,i,r="",o=0,n=e.length,a=wt;for(t=0;t<n;t++)t%3==0&&t&&(r+=a[o>>18&63],r+=a[o>>12&63],r+=a[o>>6&63],r+=a[63&o]),o=(o<<8)+e[t];return 0===(i=n%3)?(r+=a[o>>18&63],r+=a[o>>12&63],r+=a[o>>6&63],r+=a[63&o]):2===i?(r+=a[o>>10&63],r+=a[o>>4&63],r+=a[o<<2&63],r+=a[64]):1===i&&(r+=a[o>>2&63],r+=a[o<<4&63],r+=a[64],r+=a[64]),r}}),kt=Object.prototype.hasOwnProperty,Ct=Object.prototype.toString;var St=new Xe("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,i,r,o,n,a=[],s=e;for(t=0,i=s.length;t<i;t+=1){if(r=s[t],n=!1,"[object Object]"!==Ct.call(r))return!1;for(o in r)if(kt.call(r,o)){if(n)return!1;n=!0}if(!n)return!1;if(-1!==a.indexOf(o))return!1;a.push(o)}return!0},construct:function(e){return null!==e?e:[]}}),At=Object.prototype.toString;var Mt=new Xe("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,i,r,o,n,a=e;for(n=new Array(a.length),t=0,i=a.length;t<i;t+=1){if(r=a[t],"[object Object]"!==At.call(r))return!1;if(1!==(o=Object.keys(r)).length)return!1;n[t]=[o[0],r[o[0]]]}return!0},construct:function(e){if(null===e)return[];var t,i,r,o,n,a=e;for(n=new Array(a.length),t=0,i=a.length;t<i;t+=1)r=a[t],o=Object.keys(r),n[t]=[o[0],r[o[0]]];return n}}),zt=Object.prototype.hasOwnProperty;var Et=new Xe("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,i=e;for(t in i)if(zt.call(i,t)&&null!==i[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),Tt=vt.extend({implicit:[xt,_t],explicit:[$t,St,Mt,Et]}),It=Object.prototype.hasOwnProperty,Ot=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,jt=/[\x85\u2028\u2029]/,Dt=/[,\[\]\{\}]/,Pt=/^(?:!|!!|![a-z\-]+!)$/i,Rt=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Nt(e){return Object.prototype.toString.call(e)}function Lt(e){return 10===e||13===e}function Ut(e){return 9===e||32===e}function Ht(e){return 9===e||32===e||10===e||13===e}function Ft(e){return 44===e||91===e||93===e||123===e||125===e}function Bt(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function qt(e){return 120===e?2:117===e?4:85===e?8:0}function Gt(e){return 48<=e&&e<=57?e-48:-1}function Wt(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function Yt(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function Qt(e,t,i){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:i}):e[t]=i}for(var Vt=new Array(256),Kt=new Array(256),Jt=0;Jt<256;Jt++)Vt[Jt]=Wt(Jt)?1:0,Kt[Jt]=Wt(Jt);function Zt(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||Tt,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Xt(e,t){var i={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return i.snippet=Ke(i),new Ye(t,i)}function ei(e,t){throw Xt(e,t)}function ti(e,t){e.onWarning&&e.onWarning.call(null,Xt(e,t))}var ii={YAML:function(e,t,i){var r,o,n;null!==e.version&&ei(e,"duplication of %YAML directive"),1!==i.length&&ei(e,"YAML directive accepts exactly one argument"),null===(r=/^([0-9]+)\.([0-9]+)$/.exec(i[0]))&&ei(e,"ill-formed argument of the YAML directive"),o=parseInt(r[1],10),n=parseInt(r[2],10),1!==o&&ei(e,"unacceptable YAML version of the document"),e.version=i[0],e.checkLineBreaks=n<2,1!==n&&2!==n&&ti(e,"unsupported YAML version of the document")},TAG:function(e,t,i){var r,o;2!==i.length&&ei(e,"TAG directive accepts exactly two arguments"),r=i[0],o=i[1],Pt.test(r)||ei(e,"ill-formed tag handle (first argument) of the TAG directive"),It.call(e.tagMap,r)&&ei(e,'there is a previously declared suffix for "'+r+'" tag handle'),Rt.test(o)||ei(e,"ill-formed tag prefix (second argument) of the TAG directive");try{o=decodeURIComponent(o)}catch(t){ei(e,"tag prefix is malformed: "+o)}e.tagMap[r]=o}};function ri(e,t,i,r){var o,n,a,s;if(t<i){if(s=e.input.slice(t,i),r)for(o=0,n=s.length;o<n;o+=1)9===(a=s.charCodeAt(o))||32<=a&&a<=1114111||ei(e,"expected valid JSON character");else Ot.test(s)&&ei(e,"the stream contains non-printable characters");e.result+=s}}function oi(e,t,i,r){var o,n,a,s;for(qe.isObject(i)||ei(e,"cannot merge mappings; the provided source object is unacceptable"),a=0,s=(o=Object.keys(i)).length;a<s;a+=1)n=o[a],It.call(t,n)||(Qt(t,n,i[n]),r[n]=!0)}function ni(e,t,i,r,o,n,a,s,c){var l,d;if(Array.isArray(o))for(l=0,d=(o=Array.prototype.slice.call(o)).length;l<d;l+=1)Array.isArray(o[l])&&ei(e,"nested arrays are not supported inside keys"),"object"==typeof o&&"[object Object]"===Nt(o[l])&&(o[l]="[object Object]");if("object"==typeof o&&"[object Object]"===Nt(o)&&(o="[object Object]"),o=String(o),null===t&&(t={}),"tag:yaml.org,2002:merge"===r)if(Array.isArray(n))for(l=0,d=n.length;l<d;l+=1)oi(e,t,n[l],i);else oi(e,t,n,i);else e.json||It.call(i,o)||!It.call(t,o)||(e.line=a||e.line,e.lineStart=s||e.lineStart,e.position=c||e.position,ei(e,"duplicated mapping key")),Qt(t,o,n),delete i[o];return t}function ai(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):ei(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function si(e,t,i){for(var r=0,o=e.input.charCodeAt(e.position);0!==o;){for(;Ut(o);)9===o&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),o=e.input.charCodeAt(++e.position);if(t&&35===o)do{o=e.input.charCodeAt(++e.position)}while(10!==o&&13!==o&&0!==o);if(!Lt(o))break;for(ai(e),o=e.input.charCodeAt(e.position),r++,e.lineIndent=0;32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position)}return-1!==i&&0!==r&&e.lineIndent<i&&ti(e,"deficient indentation"),r}function ci(e){var t,i=e.position;return!(45!==(t=e.input.charCodeAt(i))&&46!==t||t!==e.input.charCodeAt(i+1)||t!==e.input.charCodeAt(i+2)||(i+=3,0!==(t=e.input.charCodeAt(i))&&!Ht(t)))}function li(e,t){1===t?e.result+=" ":t>1&&(e.result+=qe.repeat("\n",t-1))}function di(e,t){var i,r,o=e.tag,n=e.anchor,a=[],s=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),r=e.input.charCodeAt(e.position);0!==r&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,ei(e,"tab characters must not be used in indentation")),45===r)&&Ht(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,si(e,!0,-1)&&e.lineIndent<=t)a.push(null),r=e.input.charCodeAt(e.position);else if(i=e.line,mi(e,t,3,!1,!0),a.push(e.result),si(e,!0,-1),r=e.input.charCodeAt(e.position),(e.line===i||e.lineIndent>t)&&0!==r)ei(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=o,e.anchor=n,e.kind="sequence",e.result=a,!0)}function pi(e){var t,i,r,o,n=!1,a=!1;if(33!==(o=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&ei(e,"duplication of a tag property"),60===(o=e.input.charCodeAt(++e.position))?(n=!0,o=e.input.charCodeAt(++e.position)):33===o?(a=!0,i="!!",o=e.input.charCodeAt(++e.position)):i="!",t=e.position,n){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&62!==o);e.position<e.length?(r=e.input.slice(t,e.position),o=e.input.charCodeAt(++e.position)):ei(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==o&&!Ht(o);)33===o&&(a?ei(e,"tag suffix cannot contain exclamation marks"):(i=e.input.slice(t-1,e.position+1),Pt.test(i)||ei(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),o=e.input.charCodeAt(++e.position);r=e.input.slice(t,e.position),Dt.test(r)&&ei(e,"tag suffix cannot contain flow indicator characters")}r&&!Rt.test(r)&&ei(e,"tag name cannot contain such characters: "+r);try{r=decodeURIComponent(r)}catch(t){ei(e,"tag name is malformed: "+r)}return n?e.tag=r:It.call(e.tagMap,i)?e.tag=e.tagMap[i]+r:"!"===i?e.tag="!"+r:"!!"===i?e.tag="tag:yaml.org,2002:"+r:ei(e,'undeclared tag handle "'+i+'"'),!0}function ui(e){var t,i;if(38!==(i=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&ei(e,"duplication of an anchor property"),i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!Ht(i)&&!Ft(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&ei(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function mi(e,t,i,r,o){var n,a,s,c,l,d,p,u,m,h=1,g=!1,f=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,n=a=s=4===i||3===i,r&&si(e,!0,-1)&&(g=!0,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)),1===h)for(;pi(e)||ui(e);)si(e,!0,-1)?(g=!0,s=n,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)):s=!1;if(s&&(s=g||o),1!==h&&4!==i||(u=1===i||2===i?t:t+1,m=e.position-e.lineStart,1===h?s&&(di(e,m)||function(e,t,i){var r,o,n,a,s,c,l,d=e.tag,p=e.anchor,u={},m=Object.create(null),h=null,g=null,f=null,v=!1,b=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=u),l=e.input.charCodeAt(e.position);0!==l;){if(v||-1===e.firstTabInLine||(e.position=e.firstTabInLine,ei(e,"tab characters must not be used in indentation")),r=e.input.charCodeAt(e.position+1),n=e.line,63!==l&&58!==l||!Ht(r)){if(a=e.line,s=e.lineStart,c=e.position,!mi(e,i,2,!1,!0))break;if(e.line===n){for(l=e.input.charCodeAt(e.position);Ut(l);)l=e.input.charCodeAt(++e.position);if(58===l)Ht(l=e.input.charCodeAt(++e.position))||ei(e,"a whitespace character is expected after the key-value separator within a block mapping"),v&&(ni(e,u,m,h,g,null,a,s,c),h=g=f=null),b=!0,v=!1,o=!1,h=e.tag,g=e.result;else{if(!b)return e.tag=d,e.anchor=p,!0;ei(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!b)return e.tag=d,e.anchor=p,!0;ei(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===l?(v&&(ni(e,u,m,h,g,null,a,s,c),h=g=f=null),b=!0,v=!0,o=!0):v?(v=!1,o=!0):ei(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,l=r;if((e.line===n||e.lineIndent>t)&&(v&&(a=e.line,s=e.lineStart,c=e.position),mi(e,t,4,!0,o)&&(v?g=e.result:f=e.result),v||(ni(e,u,m,h,g,f,a,s,c),h=g=f=null),si(e,!0,-1),l=e.input.charCodeAt(e.position)),(e.line===n||e.lineIndent>t)&&0!==l)ei(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return v&&ni(e,u,m,h,g,null,a,s,c),b&&(e.tag=d,e.anchor=p,e.kind="mapping",e.result=u),b}(e,m,u))||function(e,t){var i,r,o,n,a,s,c,l,d,p,u,m,h=!0,g=e.tag,f=e.anchor,v=Object.create(null);if(91===(m=e.input.charCodeAt(e.position)))a=93,l=!1,n=[];else{if(123!==m)return!1;a=125,l=!0,n={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=n),m=e.input.charCodeAt(++e.position);0!==m;){if(si(e,!0,t),(m=e.input.charCodeAt(e.position))===a)return e.position++,e.tag=g,e.anchor=f,e.kind=l?"mapping":"sequence",e.result=n,!0;h?44===m&&ei(e,"expected the node content, but found ','"):ei(e,"missed comma between flow collection entries"),u=null,s=c=!1,63===m&&Ht(e.input.charCodeAt(e.position+1))&&(s=c=!0,e.position++,si(e,!0,t)),i=e.line,r=e.lineStart,o=e.position,mi(e,t,1,!1,!0),p=e.tag,d=e.result,si(e,!0,t),m=e.input.charCodeAt(e.position),!c&&e.line!==i||58!==m||(s=!0,m=e.input.charCodeAt(++e.position),si(e,!0,t),mi(e,t,1,!1,!0),u=e.result),l?ni(e,n,v,p,d,u,i,r,o):s?n.push(ni(e,null,v,p,d,u,i,r,o)):n.push(d),si(e,!0,t),44===(m=e.input.charCodeAt(e.position))?(h=!0,m=e.input.charCodeAt(++e.position)):h=!1}ei(e,"unexpected end of the stream within a flow collection")}(e,u)?f=!0:(a&&function(e,t){var i,r,o,n,a=1,s=!1,c=!1,l=t,d=0,p=!1;if(124===(n=e.input.charCodeAt(e.position)))r=!1;else{if(62!==n)return!1;r=!0}for(e.kind="scalar",e.result="";0!==n;)if(43===(n=e.input.charCodeAt(++e.position))||45===n)1===a?a=43===n?3:2:ei(e,"repeat of a chomping mode identifier");else{if(!((o=Gt(n))>=0))break;0===o?ei(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):c?ei(e,"repeat of an indentation width identifier"):(l=t+o-1,c=!0)}if(Ut(n)){do{n=e.input.charCodeAt(++e.position)}while(Ut(n));if(35===n)do{n=e.input.charCodeAt(++e.position)}while(!Lt(n)&&0!==n)}for(;0!==n;){for(ai(e),e.lineIndent=0,n=e.input.charCodeAt(e.position);(!c||e.lineIndent<l)&&32===n;)e.lineIndent++,n=e.input.charCodeAt(++e.position);if(!c&&e.lineIndent>l&&(l=e.lineIndent),Lt(n))d++;else{if(e.lineIndent<l){3===a?e.result+=qe.repeat("\n",s?1+d:d):1===a&&s&&(e.result+="\n");break}for(r?Ut(n)?(p=!0,e.result+=qe.repeat("\n",s?1+d:d)):p?(p=!1,e.result+=qe.repeat("\n",d+1)):0===d?s&&(e.result+=" "):e.result+=qe.repeat("\n",d):e.result+=qe.repeat("\n",s?1+d:d),s=!0,c=!0,d=0,i=e.position;!Lt(n)&&0!==n;)n=e.input.charCodeAt(++e.position);ri(e,i,e.position,!1)}}return!0}(e,u)||function(e,t){var i,r,o;if(39!==(i=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,r=o=e.position;0!==(i=e.input.charCodeAt(e.position));)if(39===i){if(ri(e,r,e.position,!0),39!==(i=e.input.charCodeAt(++e.position)))return!0;r=e.position,e.position++,o=e.position}else Lt(i)?(ri(e,r,o,!0),li(e,si(e,!1,t)),r=o=e.position):e.position===e.lineStart&&ci(e)?ei(e,"unexpected end of the document within a single quoted scalar"):(e.position++,o=e.position);ei(e,"unexpected end of the stream within a single quoted scalar")}(e,u)||function(e,t){var i,r,o,n,a,s;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return ri(e,i,e.position,!0),e.position++,!0;if(92===s){if(ri(e,i,e.position,!0),Lt(s=e.input.charCodeAt(++e.position)))si(e,!1,t);else if(s<256&&Vt[s])e.result+=Kt[s],e.position++;else if((a=qt(s))>0){for(o=a,n=0;o>0;o--)(a=Bt(s=e.input.charCodeAt(++e.position)))>=0?n=(n<<4)+a:ei(e,"expected hexadecimal character");e.result+=Yt(n),e.position++}else ei(e,"unknown escape sequence");i=r=e.position}else Lt(s)?(ri(e,i,r,!0),li(e,si(e,!1,t)),i=r=e.position):e.position===e.lineStart&&ci(e)?ei(e,"unexpected end of the document within a double quoted scalar"):(e.position++,r=e.position)}ei(e,"unexpected end of the stream within a double quoted scalar")}(e,u)?f=!0:!function(e){var t,i,r;if(42!==(r=e.input.charCodeAt(e.position)))return!1;for(r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!Ht(r)&&!Ft(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&ei(e,"name of an alias node must contain at least one character"),i=e.input.slice(t,e.position),It.call(e.anchorMap,i)||ei(e,'unidentified alias "'+i+'"'),e.result=e.anchorMap[i],si(e,!0,-1),!0}(e)?function(e,t,i){var r,o,n,a,s,c,l,d,p=e.kind,u=e.result;if(Ht(d=e.input.charCodeAt(e.position))||Ft(d)||35===d||38===d||42===d||33===d||124===d||62===d||39===d||34===d||37===d||64===d||96===d)return!1;if((63===d||45===d)&&(Ht(r=e.input.charCodeAt(e.position+1))||i&&Ft(r)))return!1;for(e.kind="scalar",e.result="",o=n=e.position,a=!1;0!==d;){if(58===d){if(Ht(r=e.input.charCodeAt(e.position+1))||i&&Ft(r))break}else if(35===d){if(Ht(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&ci(e)||i&&Ft(d))break;if(Lt(d)){if(s=e.line,c=e.lineStart,l=e.lineIndent,si(e,!1,-1),e.lineIndent>=t){a=!0,d=e.input.charCodeAt(e.position);continue}e.position=n,e.line=s,e.lineStart=c,e.lineIndent=l;break}}a&&(ri(e,o,n,!1),li(e,e.line-s),o=n=e.position,a=!1),Ut(d)||(n=e.position+1),d=e.input.charCodeAt(++e.position)}return ri(e,o,n,!1),!!e.result||(e.kind=p,e.result=u,!1)}(e,u,1===i)&&(f=!0,null===e.tag&&(e.tag="?")):(f=!0,null===e.tag&&null===e.anchor||ei(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===h&&(f=s&&di(e,m))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&ei(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),c=0,l=e.implicitTypes.length;c<l;c+=1)if((p=e.implicitTypes[c]).resolve(e.result)){e.result=p.construct(e.result),e.tag=p.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(It.call(e.typeMap[e.kind||"fallback"],e.tag))p=e.typeMap[e.kind||"fallback"][e.tag];else for(p=null,c=0,l=(d=e.typeMap.multi[e.kind||"fallback"]).length;c<l;c+=1)if(e.tag.slice(0,d[c].tag.length)===d[c].tag){p=d[c];break}p||ei(e,"unknown tag !<"+e.tag+">"),null!==e.result&&p.kind!==e.kind&&ei(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+p.kind+'", not "'+e.kind+'"'),p.resolve(e.result,e.tag)?(e.result=p.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):ei(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||f}function hi(e){var t,i,r,o,n=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(o=e.input.charCodeAt(e.position))&&(si(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==o));){for(a=!0,o=e.input.charCodeAt(++e.position),t=e.position;0!==o&&!Ht(o);)o=e.input.charCodeAt(++e.position);for(r=[],(i=e.input.slice(t,e.position)).length<1&&ei(e,"directive name must not be less than one character in length");0!==o;){for(;Ut(o);)o=e.input.charCodeAt(++e.position);if(35===o){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&!Lt(o));break}if(Lt(o))break;for(t=e.position;0!==o&&!Ht(o);)o=e.input.charCodeAt(++e.position);r.push(e.input.slice(t,e.position))}0!==o&&ai(e),It.call(ii,i)?ii[i](e,i,r):ti(e,'unknown document directive "'+i+'"')}si(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,si(e,!0,-1)):a&&ei(e,"directives end mark is expected"),mi(e,e.lineIndent-1,4,!1,!0),si(e,!0,-1),e.checkLineBreaks&&jt.test(e.input.slice(n,e.position))&&ti(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&ci(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,si(e,!0,-1)):e.position<e.length-1&&ei(e,"end of the stream or a document separator is expected")}function gi(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var i=new Zt(e,t),r=e.indexOf("\0");for(-1!==r&&(i.position=r,ei(i,"null byte is not allowed in input")),i.input+="\0";32===i.input.charCodeAt(i.position);)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)hi(i);return i.documents}var fi={loadAll:function(e,t,i){null!==t&&"object"==typeof t&&void 0===i&&(i=t,t=null);var r=gi(e,i);if("function"!=typeof t)return r;for(var o=0,n=r.length;o<n;o+=1)t(r[o])},load:function(e,t){var i=gi(e,t);if(0!==i.length){if(1===i.length)return i[0];throw new Ye("expected a single document in the stream, but found more")}}},vi=Object.prototype.toString,bi=Object.prototype.hasOwnProperty,yi=65279,xi={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},_i=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],wi=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function $i(e){var t,i,r;if(t=e.toString(16).toUpperCase(),e<=255)i="x",r=2;else if(e<=65535)i="u",r=4;else{if(!(e<=4294967295))throw new Ye("code point within a string may not be greater than 0xFFFFFFFF");i="U",r=8}return"\\"+i+qe.repeat("0",r-t.length)+t}function ki(e){this.schema=e.schema||Tt,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=qe.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var i,r,o,n,a,s,c;if(null===t)return{};for(i={},o=0,n=(r=Object.keys(t)).length;o<n;o+=1)a=r[o],s=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(c=e.compiledTypeMap.fallback[a])&&bi.call(c.styleAliases,s)&&(s=c.styleAliases[s]),i[a]=s;return i}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Ci(e,t){for(var i,r=qe.repeat(" ",t),o=0,n=-1,a="",s=e.length;o<s;)-1===(n=e.indexOf("\n",o))?(i=e.slice(o),o=s):(i=e.slice(o,n+1),o=n+1),i.length&&"\n"!==i&&(a+=r),a+=i;return a}function Si(e,t){return"\n"+qe.repeat(" ",e.indent*t)}function Ai(e){return 32===e||9===e}function Mi(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&e!==yi||65536<=e&&e<=1114111}function zi(e){return Mi(e)&&e!==yi&&13!==e&&10!==e}function Ei(e,t,i){var r=zi(e),o=r&&!Ai(e);return(i?r:r&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!o)||zi(t)&&!Ai(t)&&35===e||58===t&&o}function Ti(e,t){var i,r=e.charCodeAt(t);return r>=55296&&r<=56319&&t+1<e.length&&(i=e.charCodeAt(t+1))>=56320&&i<=57343?1024*(r-55296)+i-56320+65536:r}function Ii(e){return/^\n* /.test(e)}function Oi(e,t,i,r,o,n,a,s){var c,l=0,d=null,p=!1,u=!1,m=-1!==r,h=-1,g=function(e){return Mi(e)&&e!==yi&&!Ai(e)&&45!==e&&63!==e&&58!==e&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e&&35!==e&&38!==e&&42!==e&&33!==e&&124!==e&&61!==e&&62!==e&&39!==e&&34!==e&&37!==e&&64!==e&&96!==e}(Ti(e,0))&&function(e){return!Ai(e)&&58!==e}(Ti(e,e.length-1));if(t||a)for(c=0;c<e.length;l>=65536?c+=2:c++){if(!Mi(l=Ti(e,c)))return 5;g=g&&Ei(l,d,s),d=l}else{for(c=0;c<e.length;l>=65536?c+=2:c++){if(10===(l=Ti(e,c)))p=!0,m&&(u=u||c-h-1>r&&" "!==e[h+1],h=c);else if(!Mi(l))return 5;g=g&&Ei(l,d,s),d=l}u=u||m&&c-h-1>r&&" "!==e[h+1]}return p||u?i>9&&Ii(e)?5:a?2===n?5:2:u?4:3:!g||a||o(e)?2===n?5:2:1}function ji(e,t,i,r,o){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==_i.indexOf(t)||wi.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var n=e.indent*Math.max(1,i),a=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-n),s=r||e.flowLevel>-1&&i>=e.flowLevel;switch(Oi(t,s,e.indent,a,function(t){return function(e,t){var i,r;for(i=0,r=e.implicitTypes.length;i<r;i+=1)if(e.implicitTypes[i].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!r,o)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+Di(t,e.indent)+Pi(Ci(t,n));case 4:return">"+Di(t,e.indent)+Pi(Ci(function(e,t){var i,r,o=/(\n+)([^\n]*)/g,n=(s=e.indexOf("\n"),s=-1!==s?s:e.length,o.lastIndex=s,Ri(e.slice(0,s),t)),a="\n"===e[0]||" "===e[0];var s;for(;r=o.exec(e);){var c=r[1],l=r[2];i=" "===l[0],n+=c+(a||i||""===l?"":"\n")+Ri(l,t),a=i}return n}(t,a),n));case 5:return'"'+function(e){for(var t,i="",r=0,o=0;o<e.length;r>=65536?o+=2:o++)r=Ti(e,o),!(t=xi[r])&&Mi(r)?(i+=e[o],r>=65536&&(i+=e[o+1])):i+=t||$i(r);return i}(t)+'"';default:throw new Ye("impossible error: invalid scalar style")}}()}function Di(e,t){var i=Ii(e)?String(t):"",r="\n"===e[e.length-1];return i+(r&&("\n"===e[e.length-2]||"\n"===e)?"+":r?"":"-")+"\n"}function Pi(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function Ri(e,t){if(""===e||" "===e[0])return e;for(var i,r,o=/ [^ ]/g,n=0,a=0,s=0,c="";i=o.exec(e);)(s=i.index)-n>t&&(r=a>n?a:s,c+="\n"+e.slice(n,r),n=r+1),a=s;return c+="\n",e.length-n>t&&a>n?c+=e.slice(n,a)+"\n"+e.slice(a+1):c+=e.slice(n),c.slice(1)}function Ni(e,t,i,r){var o,n,a,s="",c=e.tag;for(o=0,n=i.length;o<n;o+=1)a=i[o],e.replacer&&(a=e.replacer.call(i,String(o),a)),(Ui(e,t+1,a,!0,!0,!1,!0)||void 0===a&&Ui(e,t+1,null,!0,!0,!1,!0))&&(r&&""===s||(s+=Si(e,t)),e.dump&&10===e.dump.charCodeAt(0)?s+="-":s+="- ",s+=e.dump);e.tag=c,e.dump=s||"[]"}function Li(e,t,i){var r,o,n,a,s,c;for(n=0,a=(o=i?e.explicitTypes:e.implicitTypes).length;n<a;n+=1)if(((s=o[n]).instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(i?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag="?",s.represent){if(c=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===vi.call(s.represent))r=s.represent(t,c);else{if(!bi.call(s.represent,c))throw new Ye("!<"+s.tag+'> tag resolver accepts not "'+c+'" style');r=s.represent[c](t,c)}e.dump=r}return!0}return!1}function Ui(e,t,i,r,o,n,a){e.tag=null,e.dump=i,Li(e,i,!1)||Li(e,i,!0);var s,c=vi.call(e.dump),l=r;r&&(r=e.flowLevel<0||e.flowLevel>t);var d,p,u="[object Object]"===c||"[object Array]"===c;if(u&&(p=-1!==(d=e.duplicates.indexOf(i))),(null!==e.tag&&"?"!==e.tag||p||2!==e.indent&&t>0)&&(o=!1),p&&e.usedDuplicates[d])e.dump="*ref_"+d;else{if(u&&p&&!e.usedDuplicates[d]&&(e.usedDuplicates[d]=!0),"[object Object]"===c)r&&0!==Object.keys(e.dump).length?(!function(e,t,i,r){var o,n,a,s,c,l,d="",p=e.tag,u=Object.keys(i);if(!0===e.sortKeys)u.sort();else if("function"==typeof e.sortKeys)u.sort(e.sortKeys);else if(e.sortKeys)throw new Ye("sortKeys must be a boolean or a function");for(o=0,n=u.length;o<n;o+=1)l="",r&&""===d||(l+=Si(e,t)),s=i[a=u[o]],e.replacer&&(s=e.replacer.call(i,a,s)),Ui(e,t+1,a,!0,!0,!0)&&((c=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?l+="?":l+="? "),l+=e.dump,c&&(l+=Si(e,t)),Ui(e,t+1,s,!0,c)&&(e.dump&&10===e.dump.charCodeAt(0)?l+=":":l+=": ",d+=l+=e.dump));e.tag=p,e.dump=d||"{}"}(e,t,e.dump,o),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,i){var r,o,n,a,s,c="",l=e.tag,d=Object.keys(i);for(r=0,o=d.length;r<o;r+=1)s="",""!==c&&(s+=", "),e.condenseFlow&&(s+='"'),a=i[n=d[r]],e.replacer&&(a=e.replacer.call(i,n,a)),Ui(e,t,n,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),Ui(e,t,a,!1,!1)&&(c+=s+=e.dump));e.tag=l,e.dump="{"+c+"}"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else if("[object Array]"===c)r&&0!==e.dump.length?(e.noArrayIndent&&!a&&t>0?Ni(e,t-1,e.dump,o):Ni(e,t,e.dump,o),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,i){var r,o,n,a="",s=e.tag;for(r=0,o=i.length;r<o;r+=1)n=i[r],e.replacer&&(n=e.replacer.call(i,String(r),n)),(Ui(e,t,n,!1,!1)||void 0===n&&Ui(e,t,null,!1,!1))&&(""!==a&&(a+=","+(e.condenseFlow?"":" ")),a+=e.dump);e.tag=s,e.dump="["+a+"]"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else{if("[object String]"!==c){if("[object Undefined]"===c)return!1;if(e.skipInvalid)return!1;throw new Ye("unacceptable kind of an object to dump "+c)}"?"!==e.tag&&ji(e,e.dump,t,n,l)}null!==e.tag&&"?"!==e.tag&&(s=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),s="!"===e.tag[0]?"!"+s:"tag:yaml.org,2002:"===s.slice(0,18)?"!!"+s.slice(18):"!<"+s+">",e.dump=s+" "+e.dump)}return!0}function Hi(e,t){var i,r,o=[],n=[];for(Fi(e,o,n),i=0,r=n.length;i<r;i+=1)t.duplicates.push(o[n[i]]);t.usedDuplicates=new Array(r)}function Fi(e,t,i){var r,o,n;if(null!==e&&"object"==typeof e)if(-1!==(o=t.indexOf(e)))-1===i.indexOf(o)&&i.push(o);else if(t.push(e),Array.isArray(e))for(o=0,n=e.length;o<n;o+=1)Fi(e[o],t,i);else for(o=0,n=(r=Object.keys(e)).length;o<n;o+=1)Fi(e[r[o]],t,i)}function Bi(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var qi={Type:Xe,Schema:it,FAILSAFE_SCHEMA:at,JSON_SCHEMA:ft,CORE_SCHEMA:vt,DEFAULT_SCHEMA:Tt,load:fi.load,loadAll:fi.loadAll,dump:{dump:function(e,t){var i=new ki(t=t||{});i.noRefs||Hi(e,i);var r=e;return i.replacer&&(r=i.replacer.call({"":r},"",r)),Ui(i,0,r,!0,!0)?i.dump+"\n":""}}.dump,YAMLException:Ye,types:{binary:$t,float:gt,map:nt,null:st,pairs:Mt,set:Et,timestamp:xt,bool:ct,int:ut,merge:_t,omap:St,seq:ot,str:rt},safeLoad:Bi("safeLoad","load"),safeLoadAll:Bi("safeLoadAll","loadAll"),safeDump:Bi("safeDump","dump")};function Gi(e){try{return qi.dump(e,{indent:2,lineWidth:120,noRefs:!0,sortKeys:!1})}catch{return""}}function Wi(e){try{return qi.load(e)}catch{return null}}class Yi{constructor(){this.suppressSync=!1}toYaml(e){const{type:t,...i}=e;return Gi(i)}fromYaml(e,t){const i=Wi(e);return i?{...i,type:t.type}:null}isSuppressed(){return this.suppressSync}suppress(e){this.suppressSync=!0;try{e()}finally{this.suppressSync=!1}}}const Qi=c`
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
    font-size: 0.8125rem;
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
    font-size: 0.75rem;
  }

  .mc-yaml-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.75rem;
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
`;var Vi=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let Ki=class extends me{constructor(){super(...arguments),this._yaml="",this._error="",this._configSync=new Yi,this._suppressUpdate=!1}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e,this._suppressUpdate||(this._yaml=this._configSync.toYaml(e.config),this._error="")}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){return Q`
      <div class="mc-yaml-container">
        <div class="mc-yaml-status">
          <span class="mc-yaml-status-dot ${this._error?"error":""}"></span>
          ${this._error?"Invalid YAML":"Valid YAML"}
        </div>

        <div class="mc-yaml-editor-wrapper">
          <textarea
            class="mc-yaml-textarea"
            .value=${this._yaml}
            @input=${this._onYamlInput}
            spellcheck="false"
          ></textarea>
        </div>

        ${this._error?Q`<div class="mc-yaml-error">${this._error}</div>`:K}
      </div>
    `}_onYamlInput(e){const t=e.target.value;this._yaml=t,this._suppressUpdate=!0;try{const e=this._configSync.fromYaml(t,this._editorState.config);e?(this._error="",this.stateManager.updateConfig(e)):this._error="Invalid YAML structure"}catch(e){this._error=e instanceof Error?e.message:"Parse error"}finally{this._suppressUpdate=!1}}};Ki.styles=[Me,Qi],Vi([be({attribute:!1})],Ki.prototype,"stateManager",void 0),Vi([be({attribute:!1})],Ki.prototype,"hass",void 0),Vi([ye()],Ki.prototype,"_yaml",void 0),Vi([ye()],Ki.prototype,"_error",void 0),Vi([ye()],Ki.prototype,"_editorState",void 0),Ki=Vi([ge("mc-yaml-editor")],Ki);const Ji=c`
  :host {
    display: block;
  }

  .mc-tree {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 0.8125rem;
  }

  .mc-tree-node {
    display: flex;
    flex-direction: column;
  }

  .mc-tree-row {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
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
    font-size: 0.6875rem;
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
    font-size: 0.75rem;
  }

  .mc-tree-action-btn:hover {
    background: var(--divider-color, #e5e7eb);
    color: var(--primary-text-color);
  }

  .mc-tree-empty {
    padding: 16px;
    text-align: center;
    color: var(--secondary-text-color, #6b7280);
    font-size: 0.8125rem;
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
`;var Zi=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let Xi=class extends me{constructor(){super(...arguments),this._expandedNodes=new Set(["root"])}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){if(!this._editorState)return Q``;const{config:e,selectedPath:t}=this._editorState;return e.rows.length?Q`
      <div class="mc-tree">
        ${e.rows.map((e,i)=>this._renderRowNode(e,i,t))}
      </div>
    `:Q`<div class="mc-tree-empty">No rows. Add a row to get started.</div>`}_renderRowNode(e,t,i){const r=`row-${t}`,o=this._expandedNodes.has(r);return Q`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${()=>this._toggleNode(r)}>
          <span class="mc-tree-toggle ${o?"open":""}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Row ${t+1}</span>
          <span class="mc-tree-type">${e.layout||"1"}</span>
          ${e.display?.conditions?.length?Q`<span class="mc-tree-badge condition">C</span>`:K}
          <span class="mc-tree-actions">
            <button class="mc-tree-action-btn" @click=${e=>{e.stopPropagation(),this.stateManager.deleteRow(t)}} title="Delete">&times;</button>
          </span>
        </div>
        ${o?Q`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.columns.map((e,r)=>this._renderColumnNode(e,t,r,i))}
              </div>
            `:K}
      </div>
    `}_renderColumnNode(e,t,i,r){const o=`col-${t}-${i}`,n=this._expandedNodes.has(o);return Q`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${()=>this._toggleNode(o)}>
          <span class="mc-tree-toggle ${n?"open":""}">&#9654;</span>
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
        ${n?Q`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.modules.map((e,o)=>this._renderModuleNode(e,t,i,o,r))}
                ${0===e.modules.length?Q`<div style="padding:4px 8px;font-size:0.75rem;color:var(--secondary-text-color)">Empty</div>`:K}
              </div>
            `:K}
      </div>
    `}_renderModuleNode(e,t,i,r,o){const n=o?.rowIndex===t&&o?.columnIndex===i&&o?.moduleIndex===r,a=_e.get(e.type),s=e.display?.conditions?.length,c=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return Q`
      <div class="mc-tree-node">
        <div
          class="mc-tree-row ${n?"selected":""}"
          draggable="true"
          @click=${()=>this.stateManager.setSelectedPath({rowIndex:t,columnIndex:i,moduleIndex:r})}
          @dragstart=${e=>this._onDragStart(e,t,i,r)}
          @dragover=${e=>this._onDragOver(e)}
          @drop=${e=>this._onDrop(e,t,i,r)}
        >
          <span class="mc-drag-handle">
            <ha-icon icon="mdi:drag-vertical" style="--mdc-icon-size:14px"></ha-icon>
          </span>
          <span class="mc-tree-icon">
            <ha-icon icon=${a?.metadata.icon||"mdi:puzzle"} style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">${a?.metadata.name||e.type}</span>
          <span class="mc-tree-type">${e.type}</span>
          ${s?Q`<span class="mc-tree-badge condition">C</span>`:K}
          ${c?Q`<span class="mc-tree-badge action">A</span>`:K}
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,i,r)}}
              title="Delete"
            >&times;</button>
          </span>
        </div>
      </div>
    `}_toggleNode(e){this._expandedNodes.has(e)?this._expandedNodes.delete(e):this._expandedNodes.add(e),this.requestUpdate()}_onDragStart(e,t,i,r){this._dragData={ri:t,ci:i,mi:r},e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify({ri:t,ci:i,mi:r})))}_onDragOver(e){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_onDrop(e,t,i,r){if(e.preventDefault(),!this._dragData)return;const{ri:o,ci:n,mi:a}=this._dragData;o===t&&n===i&&a===r||(this.stateManager.moveModule(o,n,a,t,i,r),this._dragData=void 0)}};Xi.styles=[Me,Ji],Zi([be({attribute:!1})],Xi.prototype,"stateManager",void 0),Zi([be({attribute:!1})],Xi.prototype,"hass",void 0),Zi([ye()],Xi.prototype,"_editorState",void 0),Zi([ye()],Xi.prototype,"_expandedNodes",void 0),Xi=Zi([ge("mc-tree-editor")],Xi);const er=c`
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
    z-index: 999;
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
    padding: 16px;
    border-bottom: 1px solid var(--divider-color, #e5e7eb);
    gap: 12px;
  }

  .mc-selector-header h3 {
    margin: 0;
    font-size: 1rem;
    flex: 1;
  }

  .mc-selector-search {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    font-size: 0.875rem;
    outline: none;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #1a1a2e);
  }

  .mc-selector-search:focus {
    border-color: var(--primary-color, #6366f1);
  }

  .mc-selector-body {
    overflow-y: auto;
    padding: 8px;
    flex: 1;
  }

  .mc-selector-category {
    padding: 4px 12px;
    font-size: 0.6875rem;
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
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s;
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

  .mc-selector-item-info {
    flex: 1;
    min-width: 0;
  }

  .mc-selector-item-name {
    font-size: 0.875rem;
    font-weight: 500;
  }

  .mc-selector-item-desc {
    font-size: 0.75rem;
    color: var(--secondary-text-color, #6b7280);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;var tr=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let ir=class extends me{constructor(){super(...arguments),this._searchQuery=""}render(){const e=this._searchQuery?_e.search(this._searchQuery):_e.getAll(),t=new Map;for(const r of i){const i=e.filter(e=>e.metadata.category===r).map(e=>e.metadata);i.length>0&&t.set(r,i)}return Q`
      <div class="mc-selector-overlay" @click=${this._onOverlayClick}>
        <div class="mc-selector-dialog" @click=${e=>e.stopPropagation()}>
          <div class="mc-selector-header">
            <h3>Add Module</h3>
            <button class="mc-btn-icon" @click=${this._onClose}>&times;</button>
          </div>
          <div style="padding: 8px 16px">
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
            ${Array.from(t.entries()).map(([e,t])=>Q`
                <div class="mc-selector-category">${e}</div>
                ${t.map(e=>Q`
                    <div
                      class="mc-selector-item"
                      @click=${()=>this._onSelect(e)}
                    >
                      <div class="mc-selector-item-icon">
                        <ha-icon icon=${e.icon} style="--mdc-icon-size:20px"></ha-icon>
                      </div>
                      <div class="mc-selector-item-info">
                        <div class="mc-selector-item-name">${e.name}</div>
                        <div class="mc-selector-item-desc">${e.description}</div>
                      </div>
                    </div>
                  `)}
              `)}
          </div>
        </div>
      </div>
    `}_onSelect(e){this.dispatchEvent(new CustomEvent("module-selected",{bubbles:!0,composed:!0,detail:{type:e.type}}))}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_onOverlayClick(){this._onClose()}};ir.styles=er,tr([ye()],ir.prototype,"_searchQuery",void 0),ir=tr([ge("mc-module-selector")],ir);var rr=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};const or="magic-card-saved-colors",nr=["#ffffff","#f3f4f6","#d1d5db","#9ca3af","#6b7280","#374151","#1f2937","#000000","#ef4444","#f97316","#eab308","#22c55e","#14b8a6","#3b82f6","#8b5cf6","#ec4899","#fecaca","#fed7aa","#fef08a","#bbf7d0","#99f6e4","#bfdbfe","#ddd6fe","#fbcfe8","var(--primary-color)","var(--accent-color)","var(--primary-text-color)","var(--secondary-text-color)","var(--card-background-color)","var(--divider-color)","var(--success-color)","var(--error-color)"];let ar=class extends me{constructor(){super(...arguments),this.value="",this.label="",this._isOpen=!1,this._hsva={h:0,s:100,v:100,a:1},this._savedColors=[],this._hexInput="",this._dragging=null,this._handleAreaPointerDown=e=>{this._dragging="area",e.target.setPointerCapture(e.pointerId),this._updateArea(e)},this._handleHuePointerDown=e=>{this._dragging="hue",e.target.setPointerCapture(e.pointerId),this._updateHue(e)},this._handleOpacityPointerDown=e=>{this._dragging="opacity",e.target.setPointerCapture(e.pointerId),this._updateOpacity(e)},this._handlePointerMove=e=>{this._dragging&&("area"===this._dragging?this._updateArea(e):"hue"===this._dragging?this._updateHue(e):"opacity"===this._dragging&&this._updateOpacity(e))},this._handlePointerUp=()=>{this._dragging=null}}connectedCallback(){super.connectedCallback(),this._loadSavedColors(),this._parseValue(this.value)}updated(e){e.has("value")&&!this._isOpen&&this._parseValue(this.value)}_loadSavedColors(){try{const e=localStorage.getItem(or);this._savedColors=e?JSON.parse(e):[]}catch{this._savedColors=[]}}_saveSavedColors(){try{localStorage.setItem(or,JSON.stringify(this._savedColors))}catch{}}_parseValue(e){if(!e)return this._hsva={h:0,s:0,v:100,a:1},void(this._hexInput="");if(e.startsWith("var("))return void(this._hexInput=e);const t=this._colorToHsva(e);t?(this._hsva=t,this._hexInput=this._hsvaToHex(t)):this._hexInput=e}_colorToHsva(e){const t=e.match(/^#([0-9a-f]{3,8})$/i);if(t){let e=t[1];3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),4===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]);const i=parseInt(e.slice(0,2),16)/255,r=parseInt(e.slice(2,4),16)/255,o=parseInt(e.slice(4,6),16)/255,n=8===e.length?parseInt(e.slice(6,8),16)/255:1;return this._rgbToHsva(i,r,o,n)}const i=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(i){const e=parseInt(i[1])/255,t=parseInt(i[2])/255,r=parseInt(i[3])/255,o=i[4]?parseFloat(i[4]):1;return this._rgbToHsva(e,t,r,o)}return null}_rgbToHsva(e,t,i,r){const o=Math.max(e,t,i),n=o-Math.min(e,t,i),a=100*o,s=0===o?0:n/o*100;let c=0;if(0!==n)switch(o){case e:c=60*((t-i)/n+(t<i?6:0));break;case t:c=60*((i-e)/n+2);break;case i:c=60*((e-t)/n+4)}return{h:c,s,v:a,a:r}}_hsvaToRgb(e){const t=e.h/60,i=e.s/100,r=e.v/100,o=r*i,n=o*(1-Math.abs(t%2-1)),a=r-o;let s=0,c=0,l=0;return t<1?(s=o,c=n):t<2?(s=n,c=o):t<3?(c=o,l=n):t<4?(c=n,l=o):t<5?(s=n,l=o):(s=o,l=n),{r:Math.round(255*(s+a)),g:Math.round(255*(c+a)),b:Math.round(255*(l+a)),a:e.a}}_hsvaToHex(e){const t=this._hsvaToRgb(e),i="#"+t.r.toString(16).padStart(2,"0")+t.g.toString(16).padStart(2,"0")+t.b.toString(16).padStart(2,"0");return e.a<1?i+Math.round(255*e.a).toString(16).padStart(2,"0"):i}_hsvaToRgbaString(e){const t=this._hsvaToRgb(e);return e.a<1?`rgba(${t.r}, ${t.g}, ${t.b}, ${e.a.toFixed(2)})`:`rgb(${t.r}, ${t.g}, ${t.b})`}_getCurrentColor(){return this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToHex(this._hsva)}_emitChange(){const e=this._getCurrentColor();this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_openModal(){this._parseValue(this.value),this._isOpen=!0}_closeModal(){this._isOpen=!1}_applyColor(){this._emitChange(),this._closeModal()}_updateArea(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),r=Math.max(0,Math.min(1,(e.clientY-t.top)/t.height));this._hsva={...this._hsva,s:100*i,v:100*(1-r)},this._hexInput=this._hsvaToHex(this._hsva)}_updateHue(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._hsva={...this._hsva,h:360*i},this._hexInput=this._hsvaToHex(this._hsva)}_updateOpacity(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._hsva={...this._hsva,a:i},this._hexInput=this._hsvaToHex(this._hsva)}_handleHexInput(e){const t=e.target.value;this._hexInput=t;const i=this._colorToHsva(t);i&&(this._hsva=i)}_selectPreset(e){if(e.startsWith("var("))this._hexInput=e;else{const t=this._colorToHsva(e);t&&(this._hsva=t,this._hexInput=this._hsvaToHex(t))}}_addSavedColor(){const e=this._getCurrentColor();this._savedColors.includes(e)||(this._savedColors=[e,...this._savedColors].slice(0,12),this._saveSavedColors())}_removeSavedColor(e,t){t.stopPropagation(),this._savedColors=this._savedColors.filter(t=>t!==e),this._saveSavedColors()}_handleTextInput(e){const t=e.target.value;this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){const e=this.value||"transparent";return Q`
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
      ${this._isOpen?this._renderModal():K}
    `}_renderModal(){const e=this._hsvaToRgb(this._hsva),t=`hsl(${this._hsva.h}, 100%, 50%)`,i=this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToRgbaString(this._hsva);return Q`
      <div class="mc-modal-overlay" @click=${this._closeModal}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-modal-header">
            <span class="mc-modal-title">Color Picker</span>
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
                ${nr.map(e=>Q`
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
                ${this._savedColors.map(e=>Q`
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
            <button class="mc-btn mc-btn-secondary" @click=${this._closeModal}>Cancel</button>
            <button class="mc-btn mc-btn-primary" @click=${this._applyColor}>Apply</button>
          </div>
        </div>
      </div>
    `}};ar.styles=c`
    :host {
      display: block;
    }

    .mc-color-field {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mc-color-preview {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      border: 2px solid var(--divider-color, #e5e7eb);
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
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px;
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
      outline: none;
      min-width: 0;
    }

    .mc-color-text:focus {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-color-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 1px solid var(--primary-color, #6366f1);
      border-radius: 6px;
      background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, var(--card-background-color, #fff));
      cursor: pointer;
      color: var(--primary-color, #6366f1);
      transition: all 0.15s;
      flex-shrink: 0;
    }

    .mc-color-btn:hover {
      background: var(--primary-color, #6366f1);
      color: white;
    }

    /* Modal Overlay */
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
      width: 320px;
      max-width: 100%;
      max-height: 90vh;
      overflow: auto;
    }

    .mc-modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid var(--divider-color, #e5e7eb);
    }

    .mc-modal-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color, #1a1a2e);
    }

    .mc-modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #6b7280);
      border-radius: 6px;
      font-size: 1.25rem;
    }

    .mc-modal-close:hover {
      background: var(--divider-color, #e5e7eb);
    }

    .mc-modal-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Color Area */
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

    /* Sliders */
    .mc-slider-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .mc-slider-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--secondary-text-color, #6b7280);
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
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 4px;
      font-size: 0.75rem;
      text-align: center;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
    }

    /* Input Row */
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
      color: var(--secondary-text-color, #6b7280);
      text-transform: uppercase;
    }

    .mc-input-field {
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 4px;
      font-size: 0.75rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
      width: 100%;
      box-sizing: border-box;
    }

    /* Color Sections */
    .mc-color-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .mc-color-section-header {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary-text-color, #1a1a2e);
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
      border-color: var(--primary-color, #6366f1);
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
      border-color: var(--primary-color, #6366f1);
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
      border: 2px dashed var(--divider-color, #e5e7eb);
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #6b7280);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .mc-add-saved-btn:hover {
      border-color: var(--primary-color, #6366f1);
      color: var(--primary-color, #6366f1);
    }

    /* Footer */
    .mc-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px;
      border-top: 1px solid var(--divider-color, #e5e7eb);
    }

    .mc-btn {
      padding: 8px 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 500;
      transition: all 0.15s;
    }

    .mc-btn-primary {
      background: var(--primary-color, #6366f1);
      color: white;
    }

    .mc-btn-primary:hover {
      filter: brightness(1.1);
    }

    .mc-btn-secondary {
      background: var(--divider-color, #e5e7eb);
      color: var(--primary-text-color, #1a1a2e);
    }

    .mc-btn-secondary:hover {
      filter: brightness(0.95);
    }
  `,rr([be({type:String})],ar.prototype,"value",void 0),rr([be({type:String})],ar.prototype,"label",void 0),rr([ye()],ar.prototype,"_isOpen",void 0),rr([ye()],ar.prototype,"_hsva",void 0),rr([ye()],ar.prototype,"_savedColors",void 0),rr([ye()],ar.prototype,"_hexInput",void 0),ar=rr([ge("mc-color-picker")],ar);var sr=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};const cr=["px","em","rem","%","vw","vh","auto"];let lr=class extends me{constructor(){super(...arguments),this.value="",this.label="",this.placeholder=""}_parseValue(){if(!this.value)return{number:"",unit:"px"};if("auto"===this.value)return{number:"",unit:"auto"};const e=this.value.match(/^(-?[\d.]+)\s*(px|em|rem|%|vw|vh)?$/);return e?{number:e[1],unit:e[2]||"px"}:{number:this.value,unit:"px"}}_emitChange(e,t){let i="";"auto"===t?i="auto":e&&(i=`${e}${t}`),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:i}}))}render(){const{number:e,unit:t}=this._parseValue();return Q`
      <div class="mc-unit-field">
        <input
          class="mc-unit-input"
          type="text"
          .value=${"auto"===t?"":e}
          placeholder=${this.placeholder||"0"}
          ?disabled=${"auto"===t}
          @input=${e=>{const i=e.target.value;this._emitChange(i,t)}}
        />
        <select
          class="mc-unit-select"
          .value=${t}
          @change=${t=>{const i=t.target.value;this._emitChange(e,i)}}
        >
          ${cr.map(e=>Q`
            <option value=${e} ?selected=${t===e}>${e}</option>
          `)}
        </select>
      </div>
    `}};lr.styles=c`
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
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #1a1a2e);
      outline: none;
      min-width: 0;
      border-right: none;
    }

    .mc-unit-input:focus {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-unit-select {
      padding: 8px 8px;
      border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 0 6px 6px 0;
      font-size: 0.75rem;
      background: var(--divider-color, #e5e7eb);
      color: var(--primary-text-color, #1a1a2e);
      outline: none;
      cursor: pointer;
      min-width: 55px;
    }

    .mc-unit-select:focus {
      border-color: var(--primary-color, #6366f1);
    }
  `,sr([be({type:String})],lr.prototype,"value",void 0),sr([be({type:String})],lr.prototype,"label",void 0),sr([be({type:String})],lr.prototype,"placeholder",void 0),lr=sr([ge("mc-unit-field")],lr);var dr=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let pr=class extends me{constructor(){super(...arguments),this.value="",this.label="Entity",this.domain="",this._showModal=!1,this._searchQuery=""}_openModal(){this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_selectEntity(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getFilteredEntities(){if(!this.hass)return[];const e=Object.entries(this.hass.states).filter(([e])=>!(this.domain&&!e.startsWith(this.domain+"."))).map(([e,t])=>({id:e,name:t.attributes.friendly_name||e,state:this.hass.formatEntityState(t),icon:t.attributes.icon||this._domainIcon(e.split(".")[0])})).filter(e=>{if(!this._searchQuery)return!0;const t=this._searchQuery.toLowerCase();return e.id.toLowerCase().includes(t)||e.name.toLowerCase().includes(t)}).sort((e,t)=>e.name.localeCompare(t.name));return e.slice(0,100)}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",sensor:"mdi:eye",binary_sensor:"mdi:checkbox-marked-circle",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",person:"mdi:account",weather:"mdi:weather-partly-cloudy",sun:"mdi:white-balance-sunny",vacuum:"mdi:robot-vacuum",water_heater:"mdi:water-boiler",humidifier:"mdi:air-humidifier",alarm_control_panel:"mdi:shield-home"}[e]||"mdi:help-circle"}render(){return Q`
      <div class="mc-picker-row">
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="entity_id"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:form-select"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getFilteredEntities();return Q`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header">
            <ha-icon icon="mdi:form-select"></ha-icon>
            <span class="mc-picker-title">Select Entity</span>
            <button class="mc-picker-close" @click=${this._closeModal}>&times;</button>
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
            ${e.length>0?e.map(e=>Q`
                  <div class="mc-picker-item" @click=${()=>this._selectEntity(e.id)}>
                    <div class="mc-picker-item-icon">
                      <ha-icon icon=${e.icon}></ha-icon>
                    </div>
                    <div class="mc-picker-item-content">
                      <div class="mc-picker-item-name">${e.name}</div>
                      <div class="mc-picker-item-id">${e.id}</div>
                    </div>
                    <span class="mc-picker-item-state">${e.state}</span>
                  </div>
                `):Q`<div class="mc-picker-empty">No entities found</div>`}
          </div>
        </div>
      </div>
    `}};pr.styles=c`
    :host {
      display: block;
    }

    .mc-picker-row {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    .mc-picker-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      outline: none;
      transition: border-color 0.15s;
      min-width: 0;
      box-sizing: border-box;
    }

    .mc-picker-input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border: 1px solid var(--primary-color, #03a9f4);
      border-radius: 6px;
      background: var(--primary-color, #03a9f4);
      color: white;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
      font-size: 0.8125rem;
      font-weight: 500;
      gap: 6px;
    }

    .mc-picker-btn:hover {
      filter: brightness(1.1);
    }

    .mc-picker-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    /* Modal overlay */
    .mc-picker-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
    }

    .mc-picker-modal {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      width: 420px;
      max-width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .mc-picker-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-header ha-icon {
      color: var(--primary-color, #03a9f4);
      --mdc-icon-size: 24px;
    }

    .mc-picker-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #757575);
      border-radius: 6px;
      font-size: 1.25rem;
    }

    .mc-picker-close:hover {
      background: var(--divider-color, #e0e0e0);
    }

    .mc-picker-search {
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    .mc-picker-search input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      box-sizing: border-box;
    }

    .mc-picker-search input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-list {
      flex: 1;
      overflow-y: auto;
      max-height: 400px;
    }

    .mc-picker-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background 0.1s;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    .mc-picker-item:last-child {
      border-bottom: none;
    }

    .mc-picker-item:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-item-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      border-radius: 50%;
      color: var(--primary-color, #03a9f4);
      --mdc-icon-size: 20px;
    }

    .mc-picker-item-content {
      flex: 1;
      min-width: 0;
    }

    .mc-picker-item-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--primary-text-color, #212121);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mc-picker-item-id {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #757575);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mc-picker-item-state {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #757575);
      background: var(--divider-color, #e0e0e0);
      padding: 4px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .mc-picker-empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
    }
  `,dr([be({attribute:!1})],pr.prototype,"hass",void 0),dr([be({type:String})],pr.prototype,"value",void 0),dr([be({type:String})],pr.prototype,"label",void 0),dr([be({type:String})],pr.prototype,"domain",void 0),dr([ye()],pr.prototype,"_showModal",void 0),dr([ye()],pr.prototype,"_searchQuery",void 0),pr=dr([ge("mc-entity-picker")],pr);var ur=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let mr=class extends me{constructor(){super(...arguments),this.value="",this.label="Service",this._showModal=!1,this._searchQuery=""}_openModal(){this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_selectService(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getServices(){if(!this.hass?.services)return[];const e=[];for(const[t,i]of Object.entries(this.hass.services))for(const[r,o]of Object.entries(i))e.push({domain:t,service:r,name:o.name||r,description:o.description||""});return e}_getFilteredServices(){const e=this._getServices(),t=this._searchQuery.toLowerCase(),i=t?e.filter(e=>e.domain.includes(t)||e.service.includes(t)||e.name.toLowerCase().includes(t)):e,r=new Map;for(const e of i)r.has(e.domain)||r.set(e.domain,[]),r.get(e.domain).push(e);const o=Array.from(r.entries()).sort(([e],[t])=>e.localeCompare(t)).slice(0,20).map(([e,t])=>({domain:e,services:t.sort((e,t)=>e.service.localeCompare(t.service))}));return o}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",notify:"mdi:bell",tts:"mdi:speaker-message",homeassistant:"mdi:home-assistant",persistent_notification:"mdi:bell-ring",logbook:"mdi:book-open",recorder:"mdi:database",system_log:"mdi:file-document",frontend:"mdi:view-dashboard",group:"mdi:group",vacuum:"mdi:robot-vacuum",counter:"mdi:counter",timer:"mdi:timer"}[e]||"mdi:cog"}render(){return Q`
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
    `}_renderModal(){const e=this._getFilteredServices();return Q`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header">
            <ha-icon icon="mdi:cog-play"></ha-icon>
            <span class="mc-picker-title">Select Service</span>
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
            ${e.length>0?e.map(e=>Q`
                  <div class="mc-picker-domain">${e.domain}</div>
                  ${e.services.map(e=>Q`
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
                        ${e.description?Q`<div class="mc-picker-item-desc">${e.description}</div>`:""}
                      </div>
                    </div>
                  `)}
                `):Q`<div class="mc-picker-empty">No services found</div>`}
          </div>
        </div>
      </div>
    `}};mr.styles=c`
    :host {
      display: block;
    }

    .mc-picker-row {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    .mc-picker-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      outline: none;
      transition: border-color 0.15s;
      min-width: 0;
      box-sizing: border-box;
    }

    .mc-picker-input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border: 1px solid var(--primary-color, #03a9f4);
      border-radius: 6px;
      background: var(--primary-color, #03a9f4);
      color: white;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
      font-size: 0.8125rem;
      font-weight: 500;
      gap: 6px;
    }

    .mc-picker-btn:hover {
      filter: brightness(1.1);
    }

    .mc-picker-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    .mc-picker-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
    }

    .mc-picker-modal {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      width: 480px;
      max-width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .mc-picker-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-header ha-icon {
      color: var(--primary-color, #03a9f4);
      --mdc-icon-size: 24px;
    }

    .mc-picker-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #757575);
      border-radius: 6px;
      font-size: 1.25rem;
    }

    .mc-picker-close:hover {
      background: var(--divider-color, #e0e0e0);
    }

    .mc-picker-search {
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    .mc-picker-search input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      box-sizing: border-box;
    }

    .mc-picker-search input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-picker-list {
      flex: 1;
      overflow-y: auto;
      max-height: 400px;
    }

    .mc-picker-domain {
      padding: 8px 16px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--secondary-text-color, #757575);
      background: var(--divider-color, #e0e0e0);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: sticky;
      top: 0;
    }

    .mc-picker-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      cursor: pointer;
      transition: background 0.1s;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    .mc-picker-item:last-child {
      border-bottom: none;
    }

    .mc-picker-item:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-item-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      border-radius: 50%;
      color: var(--primary-color, #03a9f4);
      --mdc-icon-size: 20px;
    }

    .mc-picker-item-content {
      flex: 1;
      min-width: 0;
    }

    .mc-picker-item-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-item-id {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #757575);
    }

    .mc-picker-item-desc {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #757575);
      margin-top: 2px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .mc-picker-empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
    }
  `,ur([be({attribute:!1})],mr.prototype,"hass",void 0),ur([be({type:String})],mr.prototype,"value",void 0),ur([be({type:String})],mr.prototype,"label",void 0),ur([ye()],mr.prototype,"_showModal",void 0),ur([ye()],mr.prototype,"_searchQuery",void 0),mr=ur([ge("mc-service-picker")],mr);var hr=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};const gr=["mdi:home","mdi:home-outline","mdi:home-assistant","mdi:floor-plan","mdi:sofa","mdi:bed","mdi:desk","mdi:toilet","mdi:shower","mdi:garage","mdi:door","mdi:door-open","mdi:gate","mdi:lightbulb","mdi:lightbulb-outline","mdi:lightbulb-group","mdi:ceiling-light","mdi:floor-lamp","mdi:desk-lamp","mdi:lamp","mdi:wall-sconce","mdi:led-strip","mdi:led-strip-variant","mdi:lamps","mdi:light-recessed","mdi:track-light","mdi:power","mdi:power-plug","mdi:power-plug-outline","mdi:toggle-switch","mdi:toggle-switch-off","mdi:light-switch","mdi:electric-switch","mdi:power-socket","mdi:outlet","mdi:thermostat","mdi:thermometer","mdi:thermometer-lines","mdi:snowflake","mdi:fire","mdi:air-conditioner","mdi:radiator","mdi:heating-coil","mdi:heat-wave","mdi:fan","mdi:fan-off","mdi:air-humidifier","mdi:water-percent","mdi:coolant-temperature","mdi:lock","mdi:lock-open","mdi:lock-outline","mdi:shield-home","mdi:shield-home-outline","mdi:shield-lock","mdi:shield-check","mdi:alarm-light","mdi:bell","mdi:bell-ring","mdi:cctv","mdi:video","mdi:camera","mdi:webcam","mdi:motion-sensor","mdi:smoke-detector","mdi:play","mdi:pause","mdi:stop","mdi:skip-next","mdi:skip-previous","mdi:volume-high","mdi:volume-medium","mdi:volume-low","mdi:volume-off","mdi:speaker","mdi:speaker-wireless","mdi:cast","mdi:television","mdi:monitor","mdi:projector","mdi:music","mdi:music-note","mdi:playlist-music","mdi:weather-sunny","mdi:weather-partly-cloudy","mdi:weather-cloudy","mdi:weather-rainy","mdi:weather-snowy","mdi:weather-windy","mdi:weather-night","mdi:moon-waning-crescent","mdi:white-balance-sunny","mdi:brightness-5","mdi:water","mdi:water-outline","mdi:leaf","mdi:flower","mdi:tree","mdi:washing-machine","mdi:tumble-dryer","mdi:dishwasher","mdi:fridge","mdi:stove","mdi:microwave","mdi:coffee-maker","mdi:robot-vacuum","mdi:vacuum","mdi:car","mdi:car-electric","mdi:ev-station","mdi:bicycle","mdi:walk","mdi:garage-variant","mdi:car-connected","mdi:battery","mdi:battery-charging","mdi:battery-50","mdi:solar-power","mdi:solar-panel","mdi:flash","mdi:lightning-bolt","mdi:meter-electric","mdi:transmission-tower","mdi:eye","mdi:eye-outline","mdi:gauge","mdi:speedometer","mdi:signal","mdi:wifi","mdi:bluetooth","mdi:access-point","mdi:chart-line","mdi:chart-bar","mdi:pulse","mdi:clock-outline","mdi:calendar","mdi:timer-outline","mdi:account","mdi:account-outline","mdi:account-group","mdi:human-greeting","mdi:run","mdi:sleep","mdi:map-marker","mdi:crosshairs-gps","mdi:cellphone","mdi:cog","mdi:cog-outline","mdi:wrench","mdi:tools","mdi:refresh","mdi:reload","mdi:sync","mdi:restart","mdi:plus","mdi:minus","mdi:close","mdi:check","mdi:arrow-up","mdi:arrow-down","mdi:arrow-left","mdi:arrow-right","mdi:chevron-up","mdi:chevron-down","mdi:chevron-left","mdi:chevron-right","mdi:window-closed","mdi:window-open","mdi:window-shutter","mdi:window-shutter-open","mdi:blinds","mdi:curtains","mdi:roller-shade","mdi:roller-shade-closed","mdi:information","mdi:information-outline","mdi:alert","mdi:alert-outline","mdi:help-circle","mdi:help-circle-outline","mdi:star","mdi:star-outline","mdi:heart","mdi:heart-outline","mdi:emoticon","mdi:emoticon-outline","mdi:puzzle","mdi:puzzle-outline","mdi:script-text","mdi:robot","mdi:palette","mdi:format-paint","mdi:package-variant","mdi:tag","mdi:label","mdi:link"];let fr=class extends me{constructor(){super(...arguments),this.value="",this._showModal=!1,this._searchQuery=""}_openModal(){this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_selectIcon(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getFilteredIcons(){if(!this._searchQuery)return gr;const e=this._searchQuery.toLowerCase().replace(/^mdi:/,"");return gr.filter(t=>t.replace("mdi:","").includes(e))}_iconLabel(e){return e.replace("mdi:","")}render(){const e=!!this.value;return Q`
      <div class="mc-picker-row">
        <div class="mc-picker-preview ${e?"":"empty"}">
          <ha-icon icon=${this.value||"mdi:help"}></ha-icon>
        </div>
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="mdi:icon-name"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:emoticon-outline"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal?this._renderModal():K}
    `}_renderModal(){const e=this._getFilteredIcons();return Q`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header">
            <ha-icon icon="mdi:emoticon-outline"></ha-icon>
            <span class="mc-picker-title">Select Icon</span>
            <button class="mc-picker-close" @click=${this._closeModal}>&times;</button>
          </div>
          <div class="mc-picker-search">
            <input
              type="text"
              placeholder="Search icons..."
              .value=${this._searchQuery}
              @input=${e=>{this._searchQuery=e.target.value}}
            />
          </div>
          <div class="mc-picker-grid">
            ${e.length>0?e.map(e=>Q`
                  <div
                    class="mc-picker-icon-item ${this.value===e?"selected":""}"
                    @click=${()=>this._selectIcon(e)}
                    title=${e}
                  >
                    <ha-icon icon=${e}></ha-icon>
                    <span class="mc-picker-icon-label">${this._iconLabel(e)}</span>
                  </div>
                `):Q`<div class="mc-picker-empty">No icons match your search</div>`}
          </div>
          <div class="mc-picker-hint">
            You can also type any MDI icon name directly in the input field, e.g. <code>mdi:heart</code>
          </div>
        </div>
      </div>
    `}};fr.styles=c`
    :host {
      display: block;
    }

    .mc-picker-row {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    .mc-picker-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      flex-shrink: 0;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      color: var(--primary-color, #6366f1);
      --mdc-icon-size: 22px;
    }

    .mc-picker-preview.empty {
      color: var(--secondary-text-color, #757575);
      opacity: 0.3;
    }

    .mc-picker-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      outline: none;
      transition: border-color 0.15s;
      min-width: 0;
      box-sizing: border-box;
    }

    .mc-picker-input:focus {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-picker-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      border: 1px solid var(--primary-color, #6366f1);
      border-radius: 6px;
      background: var(--primary-color, #6366f1);
      color: white;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
      font-size: 0.8125rem;
      font-weight: 500;
      gap: 6px;
    }

    .mc-picker-btn:hover {
      filter: brightness(1.1);
    }

    .mc-picker-btn ha-icon {
      --mdc-icon-size: 18px;
    }

    /* Modal */
    .mc-picker-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 16px;
    }

    .mc-picker-modal {
      background: var(--card-background-color, #fff);
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      width: 460px;
      max-width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .mc-picker-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
    }

    .mc-picker-header ha-icon {
      color: var(--primary-color, #6366f1);
      --mdc-icon-size: 24px;
    }

    .mc-picker-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--secondary-text-color, #757575);
      border-radius: 6px;
      font-size: 1.25rem;
    }

    .mc-picker-close:hover {
      background: var(--divider-color, #e0e0e0);
    }

    .mc-picker-search {
      padding: 12px 16px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }

    .mc-picker-search input {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      font-size: 0.875rem;
      outline: none;
      box-sizing: border-box;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-search input:focus {
      border-color: var(--primary-color, #6366f1);
    }

    .mc-picker-grid {
      flex: 1;
      overflow-y: auto;
      max-height: 400px;
      padding: 12px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      gap: 4px;
    }

    .mc-picker-icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 4px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.1s;
      border: 2px solid transparent;
    }

    .mc-picker-icon-item:hover {
      background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
      border-color: color-mix(in srgb, var(--primary-color, #6366f1) 30%, transparent);
    }

    .mc-picker-icon-item.selected {
      background: color-mix(in srgb, var(--primary-color, #6366f1) 15%, transparent);
      border-color: var(--primary-color, #6366f1);
    }

    .mc-picker-icon-item ha-icon {
      --mdc-icon-size: 26px;
      color: var(--primary-text-color, #212121);
    }

    .mc-picker-icon-item.selected ha-icon {
      color: var(--primary-color, #6366f1);
    }

    .mc-picker-icon-label {
      font-size: 0.5625rem;
      color: var(--secondary-text-color, #757575);
      text-align: center;
      word-break: break-all;
      line-height: 1.2;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .mc-picker-empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
      grid-column: 1 / -1;
    }

    .mc-picker-hint {
      padding: 8px 16px 12px;
      font-size: 0.75rem;
      color: var(--secondary-text-color, #757575);
      border-top: 1px solid var(--divider-color, #e0e0e0);
    }
  `,hr([be({type:String})],fr.prototype,"value",void 0),hr([ye()],fr.prototype,"_showModal",void 0),hr([ye()],fr.prototype,"_searchQuery",void 0),fr=hr([ge("mc-icon-picker")],fr);var vr=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};const br={general:{label:"General",icon:"mdi:cog"},actions:{label:"Actions",icon:"mdi:gesture-tap"},logic:{label:"Conditions",icon:"mdi:filter-outline"},design:{label:"Design",icon:"mdi:palette"}};let yr=class extends me{constructor(){super(...arguments),this.open=!1,this._activeTab="general"}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open||!this.module)return Q``;const e=_e.get(this.module.type);if(!e)return Q``;const t=e.getAvailableTabs(),i=t.includes(this._activeTab)?this._activeTab:t[0];return Q`
      <div class="mc-modal-overlay" @click=${this._close}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-modal-header">
            <ha-icon icon=${e.metadata.icon}></ha-icon>
            <span class="mc-modal-title">${e.metadata.name} Settings</span>
            <button class="mc-modal-close" @click=${this._close}>&times;</button>
          </div>

          <div class="mc-modal-tabs">
            ${t.map(e=>{const t=br[e];return Q`
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
        </div>
      </div>
    `}_renderTabContent(e,t){if(!this.module||!this.onChange)return Q`<p>Loading...</p>`;const i=this.onChange;switch(e){case"general":return t.renderGeneralTab(this.module,this.hass,i);case"actions":return t.renderActionsTab?t.renderActionsTab(this.module,this.hass,i):Q`<p>No actions available</p>`;case"logic":return t.renderLogicTab?t.renderLogicTab(this.module,this.hass,i):Q`<p>No conditions available</p>`;case"design":return t.renderDesignTab?t.renderDesignTab(this.module,this.hass,i):Q`<p>No design options</p>`}}};yr.styles=[Me,c`
    :host {
      display: block;
    }

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
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e5e7eb);
      background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
    }

    .mc-modal-header ha-icon {
      color: var(--primary-color, #6366f1);
      --mdc-icon-size: 24px;
    }

    .mc-modal-title {
      flex: 1;
      font-size: 1.1rem;
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

    .mc-modal-tabs {
      display: flex;
      border-bottom: 1px solid var(--divider-color, #e5e7eb);
      background: var(--card-background-color, #fff);
    }

    .mc-modal-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 8px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--secondary-text-color, #6b7280);
      border-bottom: 2px solid transparent;
      transition: all 0.15s;
    }

    .mc-modal-tab:hover {
      color: var(--primary-text-color, #1a1a2e);
      background: color-mix(in srgb, var(--primary-color, #6366f1) 5%, transparent);
    }

    .mc-modal-tab.active {
      color: var(--primary-color, #6366f1);
      border-bottom-color: var(--primary-color, #6366f1);
    }

    .mc-modal-tab ha-icon {
      --mdc-icon-size: 18px;
    }

    .mc-modal-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .mc-modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid var(--divider-color, #e5e7eb);
    }

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
      background: var(--primary-color, #6366f1);
      color: white;
    }

    .mc-btn-primary:hover {
      filter: brightness(1.1);
    }
  `],vr([be({attribute:!1})],yr.prototype,"module",void 0),vr([be({attribute:!1})],yr.prototype,"hass",void 0),vr([be({type:Boolean})],yr.prototype,"open",void 0),vr([be({attribute:!1})],yr.prototype,"onChange",void 0),vr([ye()],yr.prototype,"_activeTab",void 0),yr=vr([ge("mc-settings-modal")],yr);var xr=function(e,t,i,r){var o,n=arguments.length,a=n<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,i,a):o(t,i))||a);return n>3&&a&&Object.defineProperty(t,i,a),a};let _r=class extends me{constructor(){super(...arguments),this._showModuleSelector=!1,this._showSettingsModal=!1,this._onAddModule=e=>{this._moduleSelectorTarget=e.detail,this._showModuleSelector=!0},this._onModuleSelected=e=>{this._moduleSelectorTarget&&this._stateManager.addModule(this._moduleSelectorTarget.rowIndex,this._moduleSelectorTarget.colIndex,e.detail.type),this._showModuleSelector=!1,this._moduleSelectorTarget=void 0}}connectedCallback(){super.connectedCallback(),this._stateManager=new Te(e=>{this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:e}}))}),this._unsubscribe=this._stateManager.subscribe(e=>{this._editorState=e,void 0!==e.selectedPath?.moduleIndex&&(this._showSettingsModal=!0)}),this._pendingConfig&&(this._stateManager.setConfig(this._pendingConfig),this._pendingConfig=void 0)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._stateManager?.destroy()}setConfig(e){this._stateManager?this._stateManager.setConfig(e):this._pendingConfig=e}render(){if(!this._editorState)return Q`<div class="mc-editor">Loading...</div>`;const{editorMode:e}=this._editorState;return Q`
      <div class="mc-editor">
        ${this._renderModeSwitcher(e)}
        ${this._renderToolbar()}
        ${this._renderEditorMode(e)}
        ${this._showModuleSelector?this._renderModuleSelectorDialog():K}
        ${this._renderSettingsModal()}
      </div>
    `}_renderModeSwitcher(e){return Q`
      <div class="mc-mode-switcher">
        <button
          class="mc-mode-btn ${"form"===e?"active":""}"
          @click=${()=>this._stateManager.setEditorMode("form")}
        >
          <ha-icon icon="mdi:form-select" style="--mdc-icon-size:16px"></ha-icon>
          Form
        </button>
        <button
          class="mc-mode-btn ${"yaml"===e?"active":""}"
          @click=${()=>this._stateManager.setEditorMode("yaml")}
        >
          <ha-icon icon="mdi:code-braces" style="--mdc-icon-size:16px"></ha-icon>
          YAML
        </button>
        <button
          class="mc-mode-btn ${"tree"===e?"active":""}"
          @click=${()=>this._stateManager.setEditorMode("tree")}
        >
          <ha-icon icon="mdi:file-tree" style="--mdc-icon-size:16px"></ha-icon>
          Tree
        </button>
      </div>
    `}_renderToolbar(){return Q`
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
        <button
          class="mc-btn mc-btn-secondary"
          @click=${()=>this._stateManager.addRow("1")}
          title="Add Row"
        >
          <ha-icon icon="mdi:table-row-plus-after" style="--mdc-icon-size:16px"></ha-icon>
          Add Row
        </button>
      </div>
    `}_renderEditorMode(e){switch(e){case"form":return Q`
          <mc-form-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
          ></mc-form-editor>
        `;case"yaml":return Q`
          <mc-yaml-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
          ></mc-yaml-editor>
        `;case"tree":return Q`
          <mc-tree-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
          ></mc-tree-editor>
        `}}_renderSettingsModal(){const e=this._stateManager?.getSelectedModule();if(!e||!this._showSettingsModal)return Q``;const{selectedPath:t}=this._editorState;return Q`
      <mc-settings-modal
        .module=${e}
        .hass=${this.hass}
        .open=${!0}
        .onChange=${e=>{void 0!==t?.rowIndex&&void 0!==t?.columnIndex&&void 0!==t?.moduleIndex&&this._stateManager.updateModule(t.rowIndex,t.columnIndex,t.moduleIndex,e)}}
        @close=${()=>{this._showSettingsModal=!1,this._stateManager.setSelectedPath(null)}}
      ></mc-settings-modal>
    `}_renderModuleSelectorDialog(){return Q`
      <mc-module-selector
        @module-selected=${this._onModuleSelected}
        @close=${()=>{this._showModuleSelector=!1}}
      ></mc-module-selector>
    `}};_r.styles=Me,xr([be({attribute:!1})],_r.prototype,"hass",void 0),xr([be({attribute:!1})],_r.prototype,"lovelace",void 0),xr([ye()],_r.prototype,"_editorState",void 0),xr([ye()],_r.prototype,"_showModuleSelector",void 0),xr([ye()],_r.prototype,"_moduleSelectorTarget",void 0),xr([ye()],_r.prototype,"_showSettingsModal",void 0),_r=xr([ge(t)],_r);class wr{getAvailableTabs(){return["general","actions","logic","design"]}validate(e){return[]}renderActionsTab(e,t,i){const r=e.actions,o=(t,o)=>{i({...e,actions:{...r,[t]:o}})};return Q`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Tap Action</div>
          ${this._renderActionConfig(r?.tap_action,e=>o("tap_action",e),t)}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Hold Action</div>
          ${this._renderActionConfig(r?.hold_action,e=>o("hold_action",e),t)}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Double Tap Action</div>
          ${this._renderActionConfig(r?.double_tap_action,e=>o("double_tap_action",e),t)}
        </div>
      </div>
    `}renderLogicTab(e,t,i){const r=e.display,o=r?.conditions||[],n=t=>{i({...e,display:{...r,...t}})},a=(e,t)=>{n({conditions:o.map(i=>i.id===e?{...i,...t}:i)})};return Q`
      <div class="mc-tab-content">
        ${De("Condition Mode",r?.mode||"every",[{label:"All conditions (AND)",value:"every"},{label:"Any condition (OR)",value:"any"}],e=>n({mode:e}))}

        <div class="mc-conditions-list">
          ${o.map(e=>Q`
              <div class="mc-condition-item">
                ${De("Type",e.type,[{label:"State",value:"state"},{label:"Attribute",value:"attribute"},{label:"Time",value:"time"},{label:"Template",value:"template"}],t=>a(e.id,{type:t}))}
                ${"state"===e.type||"attribute"===e.type?Q`
                      ${Re("Entity",e.entity,t=>a(e.id,{entity:t}),t)}
                      ${"attribute"===e.type?Oe("Attribute",e.attribute,t=>a(e.id,{attribute:t})):K}
                      ${Oe("State equals",e.state,t=>a(e.id,{state:t}))}
                      ${Oe("State not equals",e.state_not,t=>a(e.id,{state_not:t}))}
                    `:K}
                ${"time"===e.type?Q`
                      ${Oe("After (HH:MM)",e.after,t=>a(e.id,{after:t}))}
                      ${Oe("Before (HH:MM)",e.before,t=>a(e.id,{before:t}))}
                    `:K}
                ${"template"===e.type?Q`
                      <div class="mc-field">
                        <label class="mc-field-label">Template</label>
                        <textarea
                          .value=${e.template||""}
                          @input=${t=>a(e.id,{template:t.target.value})}
                          rows="3"
                        ></textarea>
                      </div>
                    `:K}
                <button class="mc-btn-icon" @click=${()=>{return t=e.id,void n({conditions:o.filter(e=>e.id!==t)});var t}}>
                  &times;
                </button>
              </div>
            `)}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${()=>{const e={id:Ce("cond"),type:"state",entity:"",state:""};n({conditions:[...o,e]})}}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
          Add Condition
        </button>
      </div>
    `}renderDesignTab(e,t,i){const r=e.design||{},o=t=>{i({...e,design:{...r,...t}})};return Q`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Typography</div>
          ${Le("Font Size",r.font_size,e=>o({font_size:e}))}
          ${De("Font Weight",r.font_weight,[{label:"Normal",value:"normal"},{label:"Bold",value:"bold"},{label:"Light",value:"300"},{label:"Medium",value:"500"},{label:"Semibold",value:"600"}],e=>o({font_weight:e}))}
          ${De("Text Align",r.text_align,[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"}],e=>o({text_align:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Colors</div>
          ${Ne("Color",r.color,e=>o({color:e}))}
          ${Ne("Background",r.background,e=>o({background:e}))}
          ${Oe("Opacity",r.opacity,e=>o({opacity:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Spacing</div>
          ${Le("Padding",r.padding,e=>o({padding:e}))}
          ${Le("Margin",r.margin,e=>o({margin:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Borders</div>
          ${Oe("Border",r.border,e=>o({border:e}))}
          ${Le("Border Radius",r.border_radius,e=>o({border_radius:e}))}
          ${Oe("Box Shadow",r.box_shadow,e=>o({box_shadow:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Size</div>
          ${Le("Width",r.width,e=>o({width:e}))}
          ${Le("Height",r.height,e=>o({height:e}))}
          ${Le("Min Width",r.min_width,e=>o({min_width:e}))}
          ${Le("Min Height",r.min_height,e=>o({min_height:e}))}
          ${Le("Max Width",r.max_width,e=>o({max_width:e}))}
          ${Le("Max Height",r.max_height,e=>o({max_height:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Custom CSS</div>
          <div class="mc-field">
            <label class="mc-field-label">CSS</label>
            <textarea
              .value=${r.css||""}
              @input=${e=>o({css:e.target.value})}
              rows="4"
              placeholder="color: red; font-size: 20px;"
            ></textarea>
          </div>
        </div>
      </div>
    `}_renderActionConfig(e,t,i){const r=e||{action:"none"};return Q`
      <div class="mc-action-config">
        ${De("Action",r.action,[{label:"None",value:"none"},{label:"More Info",value:"more-info"},{label:"Toggle",value:"toggle"},{label:"Navigate",value:"navigate"},{label:"URL",value:"url"},{label:"Perform Action",value:"perform-action"},{label:"Assist",value:"assist"}],e=>t({...r,action:e}))}
        ${"more-info"===r.action||"toggle"===r.action?Re("Entity",r.entity,e=>t({...r,entity:e}),i):K}
        ${"navigate"===r.action?Oe("Navigation Path",r.navigation_path,e=>t({...r,navigation_path:e})):K}
        ${"url"===r.action?Oe("URL",r.url_path,e=>t({...r,url_path:e})):K}
        ${"perform-action"===r.action?Q`
              ${function(e,t,i,r){return Q`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-service-picker
        .hass=${r}
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-service-picker>
    </div>
  `}("Service",r.service,e=>t({...r,service:e}),i)}
            `:K}
      </div>
    `}}_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"text",name:"Text",description:"Display static or template text",category:"content",icon:"mdi:format-text"}}createDefault(){return{id:Ce("text"),type:"text",text:"Hello World"}}renderPreview(e,t){return Q`<div class="mc-module mc-text">${e.text||""}</div>`}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Oe("Text",r.text,e=>i({...r,text:e}))}
        ${Pe("Use Template",r.use_template,e=>i({...r,use_template:e}))}
        ${r.use_template?Q`
              <div class="mc-field-hint">Use Jinja2 templates: {{ states('sensor.temp') }}</div>
            `:Q``}
      </div>
    `}validate(e){const t=[],i=e;return i.text||i.use_template||t.push("Text content is required"),t}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"icon",name:"Icon",description:"Display an icon from MDI or entity",category:"content",icon:"mdi:emoticon-outline"}}createDefault(){return{id:Ce("icon"),type:"icon",icon:"mdi:home",size:"24px"}}renderPreview(e,t){const i=e;let r=i.icon||"mdi:help";if(i.use_entity_icon&&i.entity&&t){const e=t.states[i.entity];e?.attributes.icon&&(r=e.attributes.icon)}return Q`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${i.size||"24px"}; color: ${i.icon_color||"inherit"}">
        <ha-icon .icon=${r}></ha-icon>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Pe("Use Entity Icon",r.use_entity_icon,e=>i({...r,use_entity_icon:e}))}
        ${r.use_entity_icon?K:Ue("Icon",r.icon,e=>i({...r,icon:e}))}
        ${Oe("Size",r.size,e=>i({...r,size:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"info",name:"Info",description:"Display entity name, state, and attributes",category:"content",icon:"mdi:information-outline"}}createDefault(){return{id:Ce("info"),type:"info",show_name:!0,show_state:!0,show_unit:!0}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=r?.attributes.friendly_name||i.entity||"No entity",n=r?t.formatEntityState(r):"—";return Q`
      <div class="mc-module mc-info">
        ${i.show_name?Q`<span class="mc-info-name">${o}</span>`:K}
        ${i.show_state?Q`<span class="mc-info-state">
              ${i.prefix||""}${i.attribute&&r?String(r.attributes[i.attribute]??"—"):n}${i.suffix||""}
            </span>`:K}
        ${i.secondary_info&&r?Q`<span class="mc-info-secondary"
              >${String(r.attributes[i.secondary_info]??"")}</span
            >`:K}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Oe("Attribute",r.attribute,e=>i({...r,attribute:e}))}
        ${Pe("Show Name",r.show_name,e=>i({...r,show_name:e}))}
        ${Pe("Show State",r.show_state,e=>i({...r,show_state:e}))}
        ${Pe("Show Unit",r.show_unit,e=>i({...r,show_unit:e}))}
        ${Oe("Prefix",r.prefix,e=>i({...r,prefix:e}))}
        ${Oe("Suffix",r.suffix,e=>i({...r,suffix:e}))}
        ${Oe("Secondary Info (attribute)",r.secondary_info,e=>i({...r,secondary_info:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"image",name:"Image",description:"Display a static image or entity picture",category:"content",icon:"mdi:image"}}createDefault(){return{id:Ce("image"),type:"image",image:"",entity_picture:!1,aspect_ratio:"16:9",fit:"cover"}}renderPreview(e,t){const i=e;let r=i.image||"";if(i.entity_picture&&i.entity&&t){const e=t.states[i.entity];e?.attributes.entity_picture&&(r=e.attributes.entity_picture)}const o=i.fit||"cover",n=i.aspect_ratio||"16:9";return Q`
      <div
        class="mc-module mc-image"
        style="aspect-ratio: ${n.replace(":","/")}; overflow: hidden;"
      >
        ${r?Q`<img
              src=${r}
              style="width: 100%; height: 100%; object-fit: ${o}; display: block;"
              alt=""
            />`:Q`<div
              style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--divider-color, #e0e0e0); color: var(--secondary-text-color, #888);"
            >
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Pe("Use Entity Picture",r.entity_picture,e=>i({...r,entity_picture:e}))}
        ${r.entity_picture?K:Oe("Image URL",r.image,e=>i({...r,image:e}))}
        ${Oe("Aspect Ratio",r.aspect_ratio,e=>i({...r,aspect_ratio:e}))}
        ${De("Fit",r.fit,[{label:"Cover",value:"cover"},{label:"Contain",value:"contain"},{label:"Fill",value:"fill"},{label:"None",value:"none"}],e=>i({...r,fit:e}))}
      </div>
    `}validate(e){const t=[],i=e;return i.image||i.entity_picture||t.push("An image URL or entity picture source is required"),i.entity_picture&&!i.entity&&t.push("Entity is required when using entity picture"),t}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"markdown",name:"Markdown",description:"Render markdown-formatted content",category:"content",icon:"mdi:language-markdown"}}createDefault(){return{id:Ce("markdown"),type:"markdown",content:"**Hello** _World_"}}renderPreview(e,t){const i=(e.content||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/__(.+?)__/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/_(.+?)_/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/\n/g,"<br>");return Q`
      <div class="mc-module mc-markdown" .innerHTML=${i}></div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        <div class="mc-field">
          <label class="mc-field-label">Content</label>
          <textarea
            .value=${r.content||""}
            @input=${e=>i({...r,content:e.target.value})}
            rows="6"
            placeholder="**Bold**, _italic_, \`code\`"
          ></textarea>
        </div>
        <div class="mc-field-hint">
          Supports Markdown: **bold**, _italic_, \`code\`, and more.
        </div>
        ${Oe("Entity (for templates)",r.entity,e=>i({...r,entity:e}))}
      </div>
    `}validate(e){const t=[];return e.content||t.push("Markdown content is required"),t}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"bar",name:"Bar",description:"Display a progress bar based on entity state",category:"content",icon:"mdi:chart-bar"}}createDefault(){return{id:Ce("bar"),type:"bar",min:0,max:100,bar_height:"8px",bar_color:"var(--primary-color, #03a9f4)",bar_background:"var(--divider-color, #e0e0e0)",show_value:!0,direction:"horizontal"}}renderPreview(e,t){const i=e,r=i.min??0,o=i.max??100,n=i.entity&&t?t.states[i.entity]:void 0,a=n?parseFloat(n.state):r,s=Math.min(Math.max(a,r),o),c=o!==r?(s-r)/(o-r)*100:0;let l=i.bar_color||"var(--primary-color, #03a9f4)";if(i.severity&&i.severity.length>0)for(const e of i.severity)if(s>=e.from&&s<=e.to){l=e.color;break}const d=i.bar_background||"var(--divider-color, #e0e0e0)",p=i.bar_height||"8px";return"vertical"===i.direction?Q`
        <div class="mc-module mc-bar mc-bar-vertical" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
          ${i.show_value?Q`<span class="mc-bar-value">${n?t.formatEntityState(n):"—"}</span>`:K}
          <div
            style="width: ${p}; height: 100%; min-height: 40px; background: ${d}; border-radius: 4px; position: relative; overflow: hidden;"
          >
            <div
              style="position: absolute; bottom: 0; left: 0; width: 100%; height: ${c}%; background: ${l}; border-radius: 4px; transition: height 0.3s ease;"
            ></div>
          </div>
        </div>
      `:Q`
      <div class="mc-module mc-bar mc-bar-horizontal" style="display: flex; align-items: center; gap: 8px; width: 100%;">
        <div
          style="flex: 1; height: ${p}; background: ${d}; border-radius: 4px; overflow: hidden;"
        >
          <div
            style="height: 100%; width: ${c}%; background: ${l}; border-radius: 4px; transition: width 0.3s ease;"
          ></div>
        </div>
        ${i.show_value?Q`<span class="mc-bar-value" style="white-space: nowrap;">${n?t.formatEntityState(n):"—"}</span>`:K}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${je("Min",r.min,e=>i({...r,min:e}))}
        ${je("Max",r.max,e=>i({...r,max:e}))}
        ${Oe("Bar Height",r.bar_height,e=>i({...r,bar_height:e}))}
        ${Ne("Bar Color",r.bar_color,e=>i({...r,bar_color:e}))}
        ${Ne("Bar Background",r.bar_background,e=>i({...r,bar_background:e}))}
        ${Pe("Show Value",r.show_value,e=>i({...r,show_value:e}))}
        ${De("Direction",r.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...r,direction:e}))}
      </div>
    `}validate(e){const t=[],i=e;return i.entity||t.push("Entity is required for bar module"),void 0!==i.min&&void 0!==i.max&&i.min>=i.max&&t.push("Min must be less than max"),t}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"graphs",name:"Graph",description:"Display entity history as a line graph",category:"content",icon:"mdi:chart-line"}}createDefault(){return{id:Ce("graphs"),type:"graphs",hours_to_show:24,points_per_hour:2,line_width:2,fill:!0,show_points:!1,show_labels:!0}}renderPreview(e,t){const i=e,r=i.line_color||"var(--mc-primary)",o=i.fill_color||"var(--mc-primary)";return Q`
      <div class="mc-module mc-graphs">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" style="height: 60px">
          ${i.fill?Q`<path d="M0,50 Q30,30 60,35 T120,20 T200,30 L200,60 L0,60 Z"
                fill="${o}" opacity="0.15" />`:""}
          <path d="M0,50 Q30,30 60,35 T120,20 T200,30"
            fill="none" stroke="${r}" stroke-width="${i.line_width||2}" />
          ${i.show_points?Q`
                <circle cx="0" cy="50" r="3" fill="${r}" />
                <circle cx="60" cy="35" r="3" fill="${r}" />
                <circle cx="120" cy="20" r="3" fill="${r}" />
                <circle cx="200" cy="30" r="3" fill="${r}" />
              `:""}
        </svg>
        ${i.show_labels?Q`<div style="font-size:0.75rem; color:var(--mc-text-secondary); margin-top:4px">
              ${i.entity||"No entity"} &mdash; ${i.hours_to_show||24}h
            </div>`:""}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${je("Hours to Show",r.hours_to_show,e=>i({...r,hours_to_show:e}),{min:1,max:168})}
        ${je("Points per Hour",r.points_per_hour,e=>i({...r,points_per_hour:e}),{min:1,max:60})}
        ${Ne("Line Color",r.line_color,e=>i({...r,line_color:e}))}
        ${je("Line Width",r.line_width,e=>i({...r,line_width:e}),{min:1,max:10})}
        ${Pe("Fill",r.fill,e=>i({...r,fill:e}))}
        ${Ne("Fill Color",r.fill_color,e=>i({...r,fill_color:e}))}
        ${Pe("Show Points",r.show_points,e=>i({...r,show_points:e}))}
        ${Pe("Show Labels",r.show_labels,e=>i({...r,show_labels:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"camera",name:"Camera",description:"Display a camera entity stream",category:"content",icon:"mdi:cctv"}}createDefault(){return{id:Ce("camera"),type:"camera",aspect_ratio:"16:9",show_controls:!0}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=r?.attributes.entity_picture,n=r?.attributes.friendly_name||i.entity||"No camera";return Q`
      <div class="mc-module mc-camera" style="aspect-ratio: ${(i.aspect_ratio||"16:9").replace(":","/")}">
        ${o?Q`<img src="${o}" alt="${n}" />`:Q`<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--mc-border);color:var(--mc-text-secondary);font-size:0.875rem;">
              <ha-icon icon="mdi:cctv" style="margin-right:8px"></ha-icon>${n}
            </div>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Camera Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Oe("Aspect Ratio",r.aspect_ratio,e=>i({...r,aspect_ratio:e}))}
        ${Pe("Show Controls",r.show_controls,e=>i({...r,show_controls:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"button",name:"Button",description:"Interactive button with icon, label, and optional state display",category:"controls",icon:"mdi:gesture-tap"}}createDefault(){return{id:Ce("button"),type:"button",label:"Button",icon:"mdi:power",show_state:!1,button_style:"default"}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=r?t.formatEntityState(r):void 0,n=i.label||"Button",a="icon-only"===i.button_style;return Q`
      <div class="mc-module mc-button mc-button--${i.button_style||"default"}">
        <button
          class="mc-button-inner"
          style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: ${a?"8px":"8px 16px"};
            border-radius: 8px;
            border: ${"outline"===i.button_style?"1px solid var(--primary-color, #03a9f4)":"none"};
            background: ${"flat"===i.button_style||"outline"===i.button_style?"transparent":"var(--primary-color, #03a9f4)"};
            color: ${"flat"===i.button_style||"outline"===i.button_style?"var(--primary-color, #03a9f4)":"#fff"};
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          "
        >
          ${i.icon?Q`<ha-icon .icon=${i.icon} style="--mdc-icon-size: 20px;"></ha-icon>`:K}
          ${a?K:Q`<span>${n}</span>`}
          ${i.show_state&&o?Q`<span class="mc-button-state" style="opacity: 0.8; font-size: 12px;">${o}</span>`:K}
        </button>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Oe("Label",r.label,e=>i({...r,label:e}))}
        ${Ue("Icon",r.icon,e=>i({...r,icon:e}))}
        ${De("Button Style",r.button_style,[{label:"Default",value:"default"},{label:"Outline",value:"outline"},{label:"Flat",value:"flat"},{label:"Icon Only",value:"icon-only"}],e=>i({...r,button_style:e}))}
        ${Pe("Show State",r.show_state,e=>i({...r,show_state:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"slider",name:"Slider",description:"Range slider for controlling numeric values",category:"controls",icon:"mdi:tune-vertical"}}createDefault(){return{id:Ce("slider"),type:"slider",min:0,max:100,step:1,show_value:!0,direction:"horizontal"}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=i.min??0,n=i.max??100,a=i.step??1,s=r?i.attribute?Number(r.attributes[i.attribute]??o):Number(r.state):Math.round((o+n)/2),c="vertical"===i.direction;return Q`
      <div
        class="mc-module mc-slider"
        style="
          display: flex;
          flex-direction: ${c?"column":"row"};
          align-items: center;
          gap: 8px;
          ${c?"height: 120px;":"width: 100%;"}
        "
      >
        <input
          type="range"
          .value=${String(s)}
          min=${o}
          max=${n}
          step=${a}
          style="
            flex: 1;
            accent-color: ${i.slider_color||"var(--primary-color, #03a9f4)"};
            ${c?"writing-mode: vertical-lr; direction: rtl; height: 100%;":"width: 100%;"}
            ${i.track_color?`background: ${i.track_color};`:""}
          "
        />
        ${i.show_value?Q`<span class="mc-slider-value" style="font-size: 14px; min-width: 36px; text-align: center;">
              ${s}
            </span>`:K}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Oe("Attribute",r.attribute,e=>i({...r,attribute:e}))}
        ${je("Min",r.min,e=>i({...r,min:e}))}
        ${je("Max",r.max,e=>i({...r,max:e}))}
        ${je("Step",r.step,e=>i({...r,step:e}),{min:.01,step:.01})}
        ${Pe("Show Value",r.show_value,e=>i({...r,show_value:e}))}
        ${De("Direction",r.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...r,direction:e}))}
        ${Ne("Slider Color",r.slider_color,e=>i({...r,slider_color:e}))}
        ${Ne("Track Color",r.track_color,e=>i({...r,track_color:e}))}
        ${Oe("Thumb Size",r.thumb_size,e=>i({...r,thumb_size:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"spinbox",name:"Spinbox",description:"Numeric input with increment and decrement buttons",category:"controls",icon:"mdi:numeric"}}createDefault(){return{id:Ce("spinbox"),type:"spinbox",min:0,max:100,step:1}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=i.min??0,n=i.max??100,a=r?i.attribute?Number(r.attributes[i.attribute]??o):Number(r.state):Math.round((o+n)/2),s="\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      width: 32px;\n      height: 32px;\n      border: none;\n      border-radius: 50%;\n      background: var(--primary-color, #03a9f4);\n      color: #fff;\n      font-size: 18px;\n      font-weight: bold;\n      cursor: pointer;\n      line-height: 1;\n    ";return Q`
      <div
        class="mc-module mc-spinbox"
        style="display: flex; align-items: center; gap: 12px;"
      >
        <button class="mc-spinbox-decrement" style="${s}">
          &minus;
        </button>
        <span
          class="mc-spinbox-value"
          style="font-size: 20px; font-weight: 600; min-width: 40px; text-align: center;"
        >
          ${a}
        </span>
        <button class="mc-spinbox-increment" style="${s}">
          +
        </button>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Oe("Attribute",r.attribute,e=>i({...r,attribute:e}))}
        ${je("Min",r.min,e=>i({...r,min:e}))}
        ${je("Max",r.max,e=>i({...r,max:e}))}
        ${je("Step",r.step,e=>i({...r,step:e}),{min:.01,step:.01})}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"dropdown",name:"Dropdown",description:"Select dropdown for choosing from a list of options",category:"controls",icon:"mdi:form-dropdown"}}createDefault(){return{id:Ce("dropdown"),type:"dropdown",options:[{label:"Option 1",value:"option_1"},{label:"Option 2",value:"option_2"},{label:"Option 3",value:"option_3"}]}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=r?i.attribute?String(r.attributes[i.attribute]??""):r.state:void 0,n=i.options||[];return Q`
      <div class="mc-module mc-dropdown" style="width: 100%;">
        <select
          class="mc-dropdown-select"
          style="
            width: 100%;
            padding: 8px 12px;
            border: 1px solid var(--divider-color, #e0e0e0);
            border-radius: 8px;
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color, #212121);
            font-size: 14px;
            cursor: pointer;
            appearance: auto;
          "
        >
          ${n.length>0?n.map(e=>Q`
                  <option value=${e.value} ?selected=${o===e.value}>
                    ${e.label}
                  </option>
                `):Q`<option disabled selected>No options</option>`}
        </select>
      </div>
    `}renderGeneralTab(e,t,i){const r=e,o=r.options||[],n=(e,t,n)=>{const a=o.map((i,r)=>r===e?{...i,[t]:n}:i);i({...r,options:a})};return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Oe("Attribute",r.attribute,e=>i({...r,attribute:e}))}

        <div class="mc-section">
          <div class="mc-section-header">Options</div>
          <div class="mc-options-list">
            ${o.map((e,t)=>Q`
                <div class="mc-option-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${Oe("Label",e.label,e=>n(t,"label",e))}
                  ${Oe("Value",e.value,e=>n(t,"value",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=o.filter((t,i)=>i!==e);i({...r,options:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...o,{label:`Option ${o.length+1}`,value:`option_${o.length+1}`}];i({...r,options:e})}}>Add Option</button>
        </div>
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"light",name:"Light",description:"Light control with brightness, color temp, and color options",category:"controls",icon:"mdi:lightbulb"}}createDefault(){return{id:Ce("light"),type:"light",show_brightness:!0,show_color_temp:!1,show_color:!1,compact:!1}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=!!r&&"on"===r.state,n=r?.attributes.brightness,a=void 0!==n?Math.round(n/255*100):void 0,s=r?.attributes.color_temp,c=r?.attributes.friendly_name||i.entity||"Light",l=o?"var(--state-light-active-color, #fdd835)":"var(--state-icon-color, #9e9e9e)";return Q`
      <div
        class="mc-module mc-light ${i.compact?"mc-light--compact":""}"
        style="
          display: flex;
          flex-direction: ${i.compact?"row":"column"};
          align-items: ${i.compact?"center":"stretch"};
          gap: ${i.compact?"12px":"8px"};
        "
      >
        <div
          class="mc-light-header"
          style="display: flex; align-items: center; gap: 8px;"
        >
          <ha-icon
            .icon=${"mdi:lightbulb"}
            style="color: ${l}; --mdc-icon-size: ${i.compact?"24px":"32px"};"
          ></ha-icon>
          ${i.compact?Q`<span style="font-weight: 500; flex: 1;">${c}</span>`:Q`
                <div style="flex: 1;">
                  <div style="font-weight: 500;">${c}</div>
                  <div style="font-size: 12px; opacity: 0.7;">
                    ${o?void 0!==a?`${a}%`:"On":"Off"}
                  </div>
                </div>
              `}
        </div>

        ${i.show_brightness?Q`
              <div class="mc-light-brightness" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:brightness-6"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="range"
                  min="0"
                  max="100"
                  .value=${String(a??50)}
                  style="flex: 1; accent-color: var(--state-light-active-color, #fdd835);"
                />
                ${void 0!==a?Q`<span style="font-size: 12px; min-width: 32px; text-align: right;">${a}%</span>`:K}
              </div>
            `:K}

        ${i.show_color_temp?Q`
              <div class="mc-light-color-temp" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:thermometer"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="range"
                  min="153"
                  max="500"
                  .value=${String(s??300)}
                  style="flex: 1; accent-color: #ff9800;"
                />
              </div>
            `:K}

        ${i.show_color?Q`
              <div class="mc-light-color" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:palette"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="color"
                  style="width: 32px; height: 32px; border: none; padding: 0; cursor: pointer;"
                />
              </div>
            `:K}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Pe("Show Brightness",r.show_brightness,e=>i({...r,show_brightness:e}))}
        ${Pe("Show Color Temp",r.show_color_temp,e=>i({...r,show_color_temp:e}))}
        ${Pe("Show Color Picker",r.show_color,e=>i({...r,show_color:e}))}
        ${Pe("Compact Mode",r.compact,e=>i({...r,compact:e}))}
      </div>
    `}validate(e){const t=[];return e.entity||t.push("Entity is required for light module"),t}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"gauge",name:"Gauge",description:"Arc gauge for displaying numeric sensor values",category:"controls",icon:"mdi:gauge"}}createDefault(){return{id:Ce("gauge"),type:"gauge",min:0,max:100,needle:!0,gauge_style:"half"}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=i.min??0,n=i.max??100,a=r?Number(r.state):Math.round((o+n)/2),s=Math.max(o,Math.min(n,a)),c=(s-o)/(n-o)*100,l=this._getSeverityColor(s,i.severity)||"var(--primary-color, #03a9f4)",d=("half"===i.gauge_style||i.gauge_style,"full"===i.gauge_style),p="quarter"===i.gauge_style;if(d){const e=c/100*360,t=(e-90)*(Math.PI/180),i=40,r=50,o=50+i*Math.cos(t),n=r+i*Math.sin(t);return Q`
        <div class="mc-module mc-gauge mc-gauge--full" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${c>0?Q`<path
                  d="M 50 10 A 40 40 0 ${e>180?1:0} 1 ${o} ${n}"
                  fill="none"
                  stroke=${l}
                  stroke-width="8"
                  stroke-linecap="round"
                />`:""}
            <text x="50" y="54" text-anchor="middle" font-size="16" font-weight="600" fill="currentColor">
              ${s}
            </text>
          </svg>
        </div>
      `}if(p){const e=c/100*90,t=Math.PI/180*-90,i=(-90+e)*(Math.PI/180),r=44,o=10,n=90,a=o+r*Math.cos(t),d=n+r*Math.sin(t),p=o+r*Math.cos(i),u=n+r*Math.sin(i);return Q`
        <div class="mc-module mc-gauge mc-gauge--quarter" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <path d="M 10 46 A 44 44 0 0 1 54 90" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${c>0?Q`<path
                  d="M ${a} ${d} A ${r} ${r} 0 0 1 ${p} ${u}"
                  fill="none"
                  stroke=${l}
                  stroke-width="8"
                  stroke-linecap="round"
                />`:""}
            <text x="20" y="80" text-anchor="start" font-size="18" font-weight="600" fill="currentColor">
              ${s}
            </text>
          </svg>
        </div>
      `}const u=c/100*180,m=(180+u)*(Math.PI/180),h=50+40*Math.cos(m),g=55+40*Math.sin(m);return Q`
      <div class="mc-module mc-gauge mc-gauge--half" style="text-align: center;">
        <svg viewBox="0 0 100 70" width="140" height="100">
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="var(--divider-color, #e0e0e0)"
            stroke-width="8"
            stroke-linecap="round"
          />
          ${c>0?Q`<path
                d="M 10 55 A 40 40 0 ${u>180?1:0} 1 ${h} ${g}"
                fill="none"
                stroke=${l}
                stroke-width="8"
                stroke-linecap="round"
              />`:""}
          ${i.needle?Q`
                <line
                  x1="50"
                  y1="55"
                  x2=${h}
                  y2=${g}
                  stroke=${l}
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <circle cx="50" cy="55" r="3" fill=${l} />
              `:""}
          <text x="50" y="50" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">
            ${s}
          </text>
          <text x="10" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${o}</text>
          <text x="90" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${n}</text>
        </svg>
      </div>
    `}renderGeneralTab(e,t,i){const r=e,o=r.severity||[],n=(e,t,n)=>{const a=o.map((i,r)=>r===e?{...i,[t]:n}:i);i({...r,severity:a})};return Q`
      <div class="mc-tab-content">
        ${Re("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${je("Min",r.min,e=>i({...r,min:e}))}
        ${je("Max",r.max,e=>i({...r,max:e}))}
        ${De("Gauge Style",r.gauge_style,[{label:"Half (semicircle)",value:"half"},{label:"Full (circle)",value:"full"},{label:"Quarter",value:"quarter"}],e=>i({...r,gauge_style:e}))}
        ${Pe("Show Needle",r.needle,e=>i({...r,needle:e}))}

        <div class="mc-section">
          <div class="mc-section-header">Severity Ranges</div>
          <div class="mc-severity-list">
            ${o.map((e,t)=>Q`
                <div class="mc-severity-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${je("From",e.from,e=>n(t,"from",e))}
                  ${je("To",e.to,e=>n(t,"to",e))}
                  ${Ne("Color",e.color,e=>n(t,"color",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=o.filter((t,i)=>i!==e);i({...r,severity:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...o,{from:0,to:100,color:"#4caf50"}];i({...r,severity:e})}}>Add Severity Range</button>
        </div>
      </div>
    `}_getSeverityColor(e,t){if(t&&0!==t.length)for(const i of t)if(e>=i.from&&e<=i.to)return i.color}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"horizontal",name:"Horizontal",description:"Arrange child modules in a row",category:"layout",icon:"mdi:arrow-split-vertical"}}createDefault(){return{id:Ce("horizontal"),type:"horizontal",modules:[],gap:"8px",align:"center",justify:"start"}}renderPreview(e,t){const i=e,r=i.modules||[];return Q`
      <div class="mc-module mc-horizontal"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"center"}; justify-content:${i.justify||"start"}">
        ${r.length>0?r.map(e=>{const i=_e.get(e.type);return i?i.renderPreview(e,t):Q`<span class="mc-error">?</span>`}):Q`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty row</span>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Oe("Gap",r.gap,e=>i({...r,gap:e}))}
        ${De("Align",r.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>i({...r,align:e}))}
        ${De("Justify",r.justify,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Space Between",value:"space-between"},{label:"Space Around",value:"space-around"}],e=>i({...r,justify:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"vertical",name:"Vertical",description:"Arrange child modules in a column",category:"layout",icon:"mdi:arrow-split-horizontal"}}createDefault(){return{id:Ce("vertical"),type:"vertical",modules:[],gap:"8px",align:"stretch"}}renderPreview(e,t){const i=e,r=i.modules||[];return Q`
      <div class="mc-module mc-vertical"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"stretch"}">
        ${r.length>0?r.map(e=>{const i=_e.get(e.type);return i?i.renderPreview(e,t):Q`<span class="mc-error">?</span>`}):Q`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty column</span>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Oe("Gap",r.gap,e=>i({...r,gap:e}))}
        ${De("Align",r.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>i({...r,align:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"tabs",name:"Tabs",description:"Tabbed container for groups of modules",category:"layout",icon:"mdi:tab"}}createDefault(){return{id:Ce("tabs"),type:"tabs",tabs:[{label:"Tab 1",modules:[]},{label:"Tab 2",modules:[]}],active_tab:0,tab_style:"default"}}renderPreview(e,t){const i=e,r=i.tabs||[],o=i.active_tab||0,n=r[o];return Q`
      <div class="mc-module mc-tabs">
        <div class="mc-tabs-header">
          ${r.map((e,t)=>Q`
              <button class="mc-tab-button ${t===o?"active":""}">
                ${e.icon?Q`<ha-icon icon=${e.icon} style="--mdc-icon-size:16px"></ha-icon>`:""}
                ${e.label}
              </button>
            `)}
        </div>
        <div class="mc-tabs-content">
          ${n?.modules?.length?n.modules.map(e=>{const i=_e.get(e.type);return i?i.renderPreview(e,t):Q`<span class="mc-error">?</span>`}):Q`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty tab</span>`}
        </div>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${De("Tab Style",r.tab_style,[{label:"Default",value:"default"},{label:"Pills",value:"pills"},{label:"Underline",value:"underline"}],e=>i({...r,tab_style:e}))}
        <div class="mc-section">
          <div class="mc-section-header">Tabs</div>
          ${(r.tabs||[]).map((e,t)=>Q`
              <div class="mc-field" style="display:flex;gap:8px;align-items:center">
                <input type="text" .value=${e.label}
                  @input=${e=>{const o=[...r.tabs||[]];o[t]={...o[t],label:e.target.value},i({...r,tabs:o})}} />
                <button class="mc-btn-icon" @click=${()=>{const e=(r.tabs||[]).filter((e,i)=>i!==t);i({...r,tabs:e})}}>&times;</button>
              </div>
            `)}
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...r.tabs||[],{label:`Tab ${(r.tabs||[]).length+1}`,modules:[]}];i({...r,tabs:e})}}>Add Tab</button>
        </div>
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"separator",name:"Separator",description:"Visual divider between modules",category:"layout",icon:"mdi:minus"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:Ce("separator"),type:"separator",separator_style:"solid",separator_color:"var(--divider-color, #e5e7eb)",separator_width:"1px",direction:"horizontal"}}renderPreview(e,t){const i=e;return"vertical"===i.direction?Q`
        <div class="mc-module mc-separator-vertical"
          style="border-left-style:${i.separator_style||"solid"}; border-left-color:${i.separator_color||"var(--divider-color)"}; border-left-width:${i.separator_width||"1px"}">
        </div>
      `:Q`
      <hr class="mc-module mc-separator"
        style="border-top-style:${i.separator_style||"solid"}; border-top-color:${i.separator_color||"var(--divider-color)"}; border-top-width:${i.separator_width||"1px"}" />
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${De("Direction",r.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...r,direction:e}))}
        ${De("Style",r.separator_style,[{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"None",value:"none"}],e=>i({...r,separator_style:e}))}
        ${Ne("Color",r.separator_color,e=>i({...r,separator_color:e}))}
        ${Oe("Width",r.separator_width,e=>i({...r,separator_width:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"clock",name:"Clock",description:"Display current time and date",category:"advanced",icon:"mdi:clock-outline"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:Ce("clock"),type:"clock",format_12h:!1,show_seconds:!1,show_date:!0,date_format:"short"}}renderPreview(e,t){const i=e,r=new Date,o={hour:"2-digit",minute:"2-digit",hour12:i.format_12h??!1};i.show_seconds&&(o.second="2-digit");const n=r.toLocaleTimeString(void 0,o),a=i.show_date?r.toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric"}):"";return Q`
      <div class="mc-module mc-clock">
        <span class="mc-clock-time">${n}</span>
        ${i.show_date?Q`<span class="mc-clock-date">${a}</span>`:K}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Pe("12-Hour Format",r.format_12h,e=>i({...r,format_12h:e}))}
        ${Pe("Show Seconds",r.show_seconds,e=>i({...r,show_seconds:e}))}
        ${Pe("Show Date",r.show_date,e=>i({...r,show_date:e}))}
        ${Oe("Date Format",r.date_format,e=>i({...r,date_format:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"weather",name:"Weather",description:"Display weather entity information",category:"advanced",icon:"mdi:weather-partly-cloudy"}}createDefault(){return{id:Ce("weather"),type:"weather",show_temperature:!0,show_condition:!0,show_forecast:!1,forecast_days:5}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=r?.attributes.temperature,n=r?.state||"unknown",a=r?.attributes.temperature_unit||"°C",s=this._conditionIcon(n);return Q`
      <div class="mc-module mc-weather">
        <ha-icon icon=${s} style="--mdc-icon-size:36px"></ha-icon>
        <div>
          ${i.show_temperature&&void 0!==o?Q`<div class="mc-weather-temp">${o}${a}</div>`:K}
          ${i.show_condition?Q`<div class="mc-weather-condition">${n}</div>`:K}
        </div>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Weather Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Pe("Show Temperature",r.show_temperature,e=>i({...r,show_temperature:e}))}
        ${Pe("Show Condition",r.show_condition,e=>i({...r,show_condition:e}))}
        ${Pe("Show Forecast",r.show_forecast,e=>i({...r,show_forecast:e}))}
        ${r.show_forecast?je("Forecast Days",r.forecast_days,e=>i({...r,forecast_days:e}),{min:1,max:7}):K}
      </div>
    `}_conditionIcon(e){return{"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant",exceptional:"mdi:alert-circle-outline"}[e]||"mdi:weather-partly-cloudy"}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"forecast",name:"Forecast",description:"Display weather forecast data",category:"advanced",icon:"mdi:calendar-week"}}createDefault(){return{id:Ce("forecast"),type:"forecast",forecast_type:"daily",num_forecasts:5,show_temperature:!0,show_precipitation:!0,show_wind:!1}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=(r?.attributes.forecast||[]).slice(0,i.num_forecasts||5);return o.length?Q`
      <div class="mc-module mc-forecast">
        ${o.map(e=>Q`
            <div class="mc-forecast-item">
              <span style="font-size:0.75rem;color:var(--mc-text-secondary)">
                ${e.datetime?new Date(e.datetime).toLocaleDateString(void 0,{weekday:"short"}):""}
              </span>
              <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
              ${i.show_temperature?Q`<span style="font-size:0.875rem">${e.temperature??"--"}°</span>`:K}
              ${i.show_precipitation&&void 0!==e.precipitation?Q`<span style="font-size:0.75rem;color:var(--mc-text-secondary)">${e.precipitation}mm</span>`:K}
            </div>
          `)}
      </div>
    `:Q`
        <div class="mc-module mc-forecast">
          ${Array.from({length:i.num_forecasts||5}).map((e,t)=>Q`
              <div class="mc-forecast-item">
                <span style="font-size:0.75rem;color:var(--mc-text-secondary)">Day ${t+1}</span>
                <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
                <span style="font-size:0.875rem">--°</span>
              </div>
            `)}
        </div>
      `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Re("Weather Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${De("Forecast Type",r.forecast_type,[{label:"Daily",value:"daily"},{label:"Hourly",value:"hourly"}],e=>i({...r,forecast_type:e}))}
        ${je("Number of Forecasts",r.num_forecasts,e=>i({...r,num_forecasts:e}),{min:1,max:10})}
        ${Pe("Show Temperature",r.show_temperature,e=>i({...r,show_temperature:e}))}
        ${Pe("Show Precipitation",r.show_precipitation,e=>i({...r,show_precipitation:e}))}
        ${Pe("Show Wind",r.show_wind,e=>i({...r,show_wind:e}))}
      </div>
    `}});_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"video-bg",name:"Video Background",description:"Display a video as a background",category:"advanced",icon:"mdi:video-outline"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:Ce("video-bg"),type:"video-bg",autoplay:!0,loop:!0,muted:!0}}renderPreview(e,t){const i=e;return i.url?Q`
      <div class="mc-module mc-video-bg">
        <video
          src=${i.url}
          poster=${i.poster||K}
          ?autoplay=${i.autoplay}
          ?loop=${i.loop}
          ?muted=${i.muted}
          playsinline
        ></video>
      </div>
    `:Q`
        <div class="mc-module mc-video-bg" style="display:flex;align-items:center;justify-content:center;height:120px;background:var(--mc-border);border-radius:8px">
          <ha-icon icon="mdi:video-off-outline" style="--mdc-icon-size:32px;color:var(--mc-text-secondary)"></ha-icon>
        </div>
      `}renderGeneralTab(e,t,i){const r=e;return Q`
      <div class="mc-tab-content">
        ${Oe("Video URL",r.url,e=>i({...r,url:e}))}
        ${Oe("Poster Image URL",r.poster,e=>i({...r,poster:e}))}
        ${Pe("Autoplay",r.autoplay,e=>i({...r,autoplay:e}))}
        ${Pe("Loop",r.loop,e=>i({...r,loop:e}))}
        ${Pe("Muted",r.muted,e=>i({...r,muted:e}))}
      </div>
    `}});const{I:$r}=de,kr=2;class Cr{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const Sr=(e,t)=>{const i=e._$AN;if(void 0===i)return!1;for(const e of i)e._$AO?.(t,!1),Sr(e,t);return!0},Ar=e=>{let t,i;do{if(void 0===(t=e._$AM))break;i=t._$AN,i.delete(e),e=t}while(0===i?.size)},Mr=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),Tr(t)}};function zr(e){void 0!==this._$AN?(Ar(this),this._$AM=e,Mr(this)):this._$AM=e}function Er(e,t=!1,i=0){const r=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(t)if(Array.isArray(r))for(let e=i;e<r.length;e++)Sr(r[e],!1),Ar(r[e]);else null!=r&&(Sr(r,!1),Ar(r));else Sr(this,e)}const Tr=e=>{e.type==kr&&(e._$AP??=Er,e._$AQ??=zr)};class Ir extends Cr{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),Mr(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(Sr(this,e),Ar(this))}setValue(e){if((e=>void 0===e.strings)(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}class Or{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}}class jr{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}}const Dr=e=>!(e=>null===e||"object"!=typeof e&&"function"!=typeof e)(e)&&"function"==typeof e.then,Pr=1073741823;const Rr=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends Ir{constructor(){super(...arguments),this._$Cwt=Pr,this._$Cbt=[],this._$CK=new Or(this),this._$CX=new jr}render(...e){return e.find(e=>!Dr(e))??V}update(e,t){const i=this._$Cbt;let r=i.length;this._$Cbt=t;const o=this._$CK,n=this._$CX;this.isConnected||this.disconnected();for(let e=0;e<t.length&&!(e>this._$Cwt);e++){const a=t[e];if(!Dr(a))return this._$Cwt=e,a;e<r&&a===i[e]||(this._$Cwt=Pr,r=0,Promise.resolve(a).then(async e=>{for(;n.get();)await n.get();const t=o.deref();if(void 0!==t){const i=t._$Cbt.indexOf(a);i>-1&&i<t._$Cwt&&(t._$Cwt=i,t.setValue(e))}}))}return V}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}});let Nr=null,Lr=null;async function Ur(){return Nr||(Lr||(Lr=window.loadCardHelpers()),Nr=await Lr,Nr)}_e.register(new class extends wr{constructor(){super(...arguments),this.metadata={type:"custom-card",name:"Custom Card",description:"Embed any 3rd party Lovelace card",category:"advanced",icon:"mdi:card-plus-outline"},this._elementCache=new Map,this._configureModalOpen=new Set,this._editorCache=new Map}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:Ce("custom-card"),type:"custom-card",name:"",card_type:"",card_config:{}}}renderPreview(e,t){const i=e;return i.card_type?Q`
      <div class="mc-module mc-custom-card">
        ${Rr(this._getOrCreateElement(i,t),Q`
          <div style="
            display: flex; align-items: center; justify-content: center;
            min-height: 60px; color: var(--secondary-text-color, #757575);
          ">Loading card...</div>
        `)}
      </div>
    `:Q`
        <div class="mc-module mc-custom-card" style="
          display: flex; align-items: center; justify-content: center; gap: 8px;
          min-height: 80px; background: var(--divider-color, #e0e0e0);
          border-radius: 8px; color: var(--secondary-text-color, #757575);
          font-size: 0.875rem;
        ">
          <ha-icon icon="mdi:card-plus-outline" style="--mdc-icon-size: 28px;"></ha-icon>
          <span>No card type set</span>
        </div>
      `}async _getOrCreateElement(e,t){const i=this._elementCache.get(e.id),r=(o=e.card_type,n=e.card_config,JSON.stringify({t:o,c:n}));var o,n;let a;if(i&&i.cardType===e.card_type){if(a=i.element,i.hash!==r)try{const t={type:e.card_type,...e.card_config||{}};a.setConfig(t),i.hash=r}catch(e){return Q`<div style="color: var(--error-color, #ef4444); padding: 12px; font-size: 0.875rem;">
            Error updating card config: ${String(e)}
          </div>`}}else try{const t=await Ur(),i={type:e.card_type,...e.card_config||{}};a=t.createCardElement(i),this._elementCache.set(e.id,{element:a,cardType:e.card_type,hash:r})}catch(t){return Q`<div style="color: var(--error-color, #ef4444); padding: 12px; font-size: 0.875rem;">
          Failed to load card "${e.card_type}": ${String(t)}
        </div>`}return t&&(a.hass=t),Q`${a}`}async _getOrCreateEditor(e,t,i){const r=e.card_type;if(!r)return null;const o=this._editorCache.get(e.id);if(o&&o.cardType===r)return o.editor;try{const o=await Ur(),n={type:r,...e.card_config||{}},a=o.createCardElement(n);await customElements.whenDefined(a.localName);const s=a.constructor;if("function"!=typeof s.getConfigElement)return this._editorCache.set(e.id,{editor:null,cardType:r,attempted:!0}),null;const c=s.getConfigElement();c.localName?.includes("-")&&await customElements.whenDefined(c.localName),t&&(c.hass=t);try{c.setConfig(n)}catch{}return c.addEventListener("config-changed",t=>{const r=t.detail?.config;if(r){const{type:t,...o}=r;i({...e,card_config:o,card_config_yaml:void 0})}}),this._editorCache.set(e.id,{editor:c,cardType:r,attempted:!0}),c}catch{return this._editorCache.set(e.id,{editor:null,cardType:r,attempted:!0}),null}}renderGeneralTab(e,t,i){const r=e,o=this._configureModalOpen.has(r.id);return Q`
      <div class="mc-tab-content">
        ${Oe("Name",r.name,e=>i({...r,name:e}))}
        <div class="mc-field-hint" style="margin-top: -4px; margin-bottom: 8px;">
          An optional label to help you identify this card in the editor.
        </div>
        ${Oe("Card Type",r.card_type,e=>{this._editorCache.delete(r.id),i({...r,card_type:e})})}
        <div class="mc-field-hint" style="margin-top: -4px; margin-bottom: 8px;">
          Built-in: entities, button, gauge, markdown, etc.<br>
          Custom: custom:mushroom-light-card, custom:mini-graph-card, etc.
        </div>
        ${r.card_type?Q`
            <button
              class="mc-configure-btn"
              @click=${()=>{this._configureModalOpen.add(r.id),i({...r})}}
            >
              <ha-icon icon="mdi:cog" style="--mdc-icon-size: 18px;"></ha-icon>
              Configure Card
            </button>
          `:K}
      </div>
      ${o?this._renderConfigureModal(r,t,i):K}
      <style>
        .mc-configure-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: 1px solid var(--divider-color, #e5e7eb);
          border-radius: 8px;
          background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
          color: var(--primary-color, #6366f1);
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.15s;
          width: 100%;
          justify-content: center;
        }
        .mc-configure-btn:hover {
          background: color-mix(in srgb, var(--primary-color, #6366f1) 14%, transparent);
          border-color: var(--primary-color, #6366f1);
        }
        .mc-configure-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          padding: 16px;
        }
        .mc-configure-modal {
          background: var(--card-background-color, #fff);
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          width: 500px;
          max-width: 100%;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .mc-configure-modal-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--divider-color, #e5e7eb);
          background: color-mix(in srgb, var(--primary-color, #6366f1) 8%, transparent);
        }
        .mc-configure-modal-header ha-icon {
          color: var(--primary-color, #6366f1);
          --mdc-icon-size: 24px;
        }
        .mc-configure-modal-title {
          flex: 1;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--primary-text-color, #1a1a2e);
        }
        .mc-configure-modal-close {
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
        .mc-configure-modal-close:hover {
          background: var(--divider-color, #e5e7eb);
          color: var(--primary-text-color, #1a1a2e);
        }
        .mc-configure-modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }
        .mc-configure-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          padding: 16px 20px;
          border-top: 1px solid var(--divider-color, #e5e7eb);
        }
        .mc-configure-modal-footer .mc-btn {
          padding: 10px 20px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.15s;
        }
        .mc-configure-modal-footer .mc-btn-primary {
          background: var(--primary-color, #6366f1);
          color: white;
        }
        .mc-configure-modal-footer .mc-btn-primary:hover {
          filter: brightness(1.1);
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
        .mc-editor-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
          color: var(--secondary-text-color, #757575);
          font-size: 0.875rem;
        }
      </style>
    `}_renderConfigureModal(e,t,i){const r=()=>{this._configureModalOpen.delete(e.id),i({...e})};return Q`
      <div class="mc-configure-modal-overlay" @click=${r}>
        <div class="mc-configure-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-configure-modal-header">
            <ha-icon icon="mdi:card-plus-outline"></ha-icon>
            <span class="mc-configure-modal-title">Configure: ${e.card_type}</span>
            <button class="mc-configure-modal-close" @click=${r}>&times;</button>
          </div>
          <div class="mc-configure-modal-body">
            ${Rr(this._renderEditorContent(e,t,i),Q`<div class="mc-editor-loading">Loading editor...</div>`)}
          </div>
          <div class="mc-configure-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${r}>Done</button>
          </div>
        </div>
      </div>
    `}async _renderEditorContent(e,t,i){const r=await this._getOrCreateEditor(e,t,i);if(r)return t&&(r.hass=t),Q`${r}`;const o=e.card_config_yaml??(e.card_config?Gi(e.card_config):""),n=Wi(o);return Q`
      <div class="mc-yaml-fallback">
        <div style="margin-bottom: 8px; font-size: 0.8125rem; color: var(--secondary-text-color, #6b7280);">
          No visual editor available for this card type. Configure using YAML:
        </div>
        <textarea
          .value=${o}
          @input=${t=>{const r=t.target.value,o=Wi(r);i(null!==o?{...e,card_config:o,card_config_yaml:r}:{...e,card_config_yaml:r})}}
          rows="12"
          placeholder="entity: sensor.temperature
name: My Sensor
show_state: true"
        ></textarea>
        ${""===o||null!==n?K:Q`<div style="color: var(--error-color, #ef4444); font-size: 0.8125rem; margin-top: 4px;">
              Invalid YAML - card will use last valid configuration
            </div>`}
        <div style="margin-top: 4px; font-size: 0.75rem; color: var(--secondary-text-color, #6b7280);">
          The <code>type</code> key is set automatically from Card Type. Do not include it here.
        </div>
      </div>
    `}validate(e){const t=[];return e.card_type||t.push("Card type is required"),t}}),window.customCards=window.customCards||[],window.customCards.push({type:e,name:"Magic Card",description:"A fully open-source multi-module card with advanced editor",preview:!0,documentationURL:"https://github.com/your-repo/magic-card"}),console.info("%c MAGIC-CARD %c v0.1.0 ","color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;")})();