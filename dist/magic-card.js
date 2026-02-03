(()=>{"use strict";const e="magic-card",t="magic-card-editor",o=["content","controls","layout","advanced"],i=globalThis,r=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),a=new WeakMap;class s{constructor(e,t,o){if(this._$cssResult$=!0,o!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(r&&void 0===e){const o=void 0!==t&&1===t.length;o&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&a.set(t,e))}return e}toString(){return this.cssText}}const l=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,o,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+e[i+1],e[0]);return new s(o,e,n)},c=(e,t)=>{if(r)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const o of t){const t=document.createElement("style"),r=i.litNonce;void 0!==r&&t.setAttribute("nonce",r),t.textContent=o.cssText,e.appendChild(t)}},d=r?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:p,defineProperty:u,getOwnPropertyDescriptor:h,getOwnPropertyNames:m,getOwnPropertySymbols:f,getPrototypeOf:g}=Object,v=globalThis,b=v.trustedTypes,y=b?b.emptyScript:"",x=v.reactiveElementPolyfillSupport,w=(e,t)=>e,_={toAttribute(e,t){switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let o=e;switch(t){case Boolean:o=null!==e;break;case Number:o=null===e?null:Number(e);break;case Object:case Array:try{o=JSON.parse(e)}catch(e){o=null}}return o}},$=(e,t)=>!p(e,t),k={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),v.litPropertyMetadata??=new WeakMap;class S extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=k){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,t);void 0!==i&&u(this.prototype,e,i)}}static getPropertyDescriptor(e,t,o){const{get:i,set:r}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);r?.call(this,t),this.requestUpdate(e,n,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??k}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const e=g(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const e=this.properties,t=[...m(e),...f(e)];for(const o of t)this.createProperty(o,e[o])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,o]of t)this.elementProperties.set(e,o)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const o=this._$Eu(e,t);void 0!==o&&this._$Eh.set(o,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const e of o)t.unshift(d(e))}else void 0!==e&&t.push(d(e));return t}static _$Eu(e,t){const o=t.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return c(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(void 0!==i&&!0===o.reflect){const r=(void 0!==o.converter?.toAttribute?o.converter:_).toAttribute(t,o.type);this._$Em=e,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(e,t){const o=this.constructor,i=o._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=o.getPropertyOptions(i),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:_;this._$Em=i;const n=r.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,o,i=!1,r){if(void 0!==e){const n=this.constructor;if(!1===i&&(r=this[e]),o??=n.getPropertyOptions(e),!((o.hasChanged??$)(r,t)||o.useDefault&&o.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,o))))return;this.C(e,t,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:i,wrapped:r},n){o&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==r||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,o]of e){const{wrapped:e}=o,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,o,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[w("elementProperties")]=new Map,S[w("finalized")]=new Map,x?.({ReactiveElement:S}),(v.reactiveElementVersions??=[]).push("2.1.2");const C=globalThis,A=e=>e,M=C.trustedTypes,E=M?M.createPolicy("lit-html",{createHTML:e=>e}):void 0,T="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,I="?"+D,O=`<${I}>`,P=document,z=()=>P.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,j=Array.isArray,R=e=>j(e)||"function"==typeof e?.[Symbol.iterator],L="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,U=/>/g,B=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),Y=/'/g,W=/"/g,q=/^(?:script|style|textarea|title)$/i,G=e=>(t,...o)=>({_$litType$:e,strings:t,values:o}),X=G(1),V=(G(2),G(3),Symbol.for("lit-noChange")),K=Symbol.for("lit-nothing"),Q=new WeakMap,Z=P.createTreeWalker(P,129);function J(e,t){if(!j(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(t):t}const ee=(e,t)=>{const o=e.length-1,i=[];let r,n=2===t?"<svg>":3===t?"<math>":"",a=H;for(let t=0;t<o;t++){const o=e[t];let s,l,c=-1,d=0;for(;d<o.length&&(a.lastIndex=d,l=a.exec(o),null!==l);)d=a.lastIndex,a===H?"!--"===l[1]?a=F:void 0!==l[1]?a=U:void 0!==l[2]?(q.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=B):void 0!==l[3]&&(a=B):a===B?">"===l[0]?(a=r??H,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,s=l[1],a=void 0===l[3]?B:'"'===l[3]?W:Y):a===W||a===Y?a=B:a===F||a===U?a=H:(a=B,r=void 0);const p=a===B&&e[t+1].startsWith("/>")?" ":"";n+=a===H?o+O:c>=0?(i.push(s),o.slice(0,c)+T+o.slice(c)+D+p):o+D+(-2===c?t:p)}return[J(e,n+(e[o]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class te{constructor({strings:e,_$litType$:t},o){let i;this.parts=[];let r=0,n=0;const a=e.length-1,s=this.parts,[l,c]=ee(e,t);if(this.el=te.createElement(l,o),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=Z.nextNode())&&s.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(T)){const t=c[n++],o=i.getAttribute(e).split(D),a=/([.?@])?(.*)/.exec(t);s.push({type:1,index:r,name:a[2],strings:o,ctor:"."===a[1]?ae:"?"===a[1]?se:"@"===a[1]?le:ne}),i.removeAttribute(e)}else e.startsWith(D)&&(s.push({type:6,index:r}),i.removeAttribute(e));if(q.test(i.tagName)){const e=i.textContent.split(D),t=e.length-1;if(t>0){i.textContent=M?M.emptyScript:"";for(let o=0;o<t;o++)i.append(e[o],z()),Z.nextNode(),s.push({type:2,index:++r});i.append(e[t],z())}}}else if(8===i.nodeType)if(i.data===I)s.push({type:2,index:r});else{let e=-1;for(;-1!==(e=i.data.indexOf(D,e+1));)s.push({type:7,index:r}),e+=D.length-1}r++}}static createElement(e,t){const o=P.createElement("template");return o.innerHTML=e,o}}function oe(e,t,o=e,i){if(t===V)return t;let r=void 0!==i?o._$Co?.[i]:o._$Cl;const n=N(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(e),r._$AT(e,o,i)),void 0!==i?(o._$Co??=[])[i]=r:o._$Cl=r),void 0!==r&&(t=oe(e,r._$AS(e,t.values),r,i)),t}class ie{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,i=(e?.creationScope??P).importNode(t,!0);Z.currentNode=i;let r=Z.nextNode(),n=0,a=0,s=o[0];for(;void 0!==s;){if(n===s.index){let t;2===s.type?t=new re(r,r.nextSibling,this,e):1===s.type?t=new s.ctor(r,s.name,s.strings,this,e):6===s.type&&(t=new ce(r,this,e)),this._$AV.push(t),s=o[++a]}n!==s?.index&&(r=Z.nextNode(),n++)}return Z.currentNode=P,i}p(e){let t=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}}class re{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,o,i){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=oe(this,e,t),N(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):R(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:o}=e,i="number"==typeof o?this._$AC(e):(void 0===o.el&&(o.el=te.createElement(J(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ie(i,this),o=e.u(this.options);e.p(t),this.T(o),this._$AH=e}}_$AC(e){let t=Q.get(e.strings);return void 0===t&&Q.set(e.strings,t=new te(e)),t}k(e){j(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,i=0;for(const r of e)i===t.length?t.push(o=new re(this.O(z()),this.O(z()),this,this.options)):o=t[i],o._$AI(r),i++;i<t.length&&(this._$AR(o&&o._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ne{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,i,r){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=K}_$AI(e,t=this,o,i){const r=this.strings;let n=!1;if(void 0===r)e=oe(this,e,t,0),n=!N(e)||e!==this._$AH&&e!==V,n&&(this._$AH=e);else{const i=e;let a,s;for(e=r[0],a=0;a<r.length-1;a++)s=oe(this,i[o+a],t,a),s===V&&(s=this._$AH[a]),n||=!N(s)||s!==this._$AH[a],s===K?e=K:e!==K&&(e+=(s??"")+r[a+1]),this._$AH[a]=s}n&&!i&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ae extends ne{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class se extends ne{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class le extends ne{constructor(e,t,o,i,r){super(e,t,o,i,r),this.type=5}_$AI(e,t=this){if((e=oe(this,e,t,0)??K)===V)return;const o=this._$AH,i=e===K&&o!==K||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,r=e!==K&&(o===K||i);i&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ce{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){oe(this,e)}}const de=C.litHtmlPolyfillSupport;de?.(te,re),(C.litHtmlVersions??=[]).push("3.3.2");const pe=globalThis;class ue extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,o)=>{const i=o?.renderBefore??t;let r=i._$litPart$;if(void 0===r){const e=o?.renderBefore??null;i._$litPart$=r=new re(t.insertBefore(z(),e),e,void 0,o??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}ue._$litElement$=!0,ue.finalized=!0,pe.litElementHydrateSupport?.({LitElement:ue});const he=pe.litElementPolyfillSupport;he?.({LitElement:ue});(pe.litElementVersions??=[]).push("4.2.2");const me=e=>(t,o)=>{void 0!==o?o.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},fe={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:$},ge=(e=fe,t,o)=>{const{kind:i,metadata:r}=o;let n=globalThis.litPropertyMetadata.get(r);if(void 0===n&&globalThis.litPropertyMetadata.set(r,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(o.name,e),"accessor"===i){const{name:i}=o;return{set(o){const r=t.get.call(this);t.set.call(this,o),this.requestUpdate(i,r,e,!0,o)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=o;return function(o){const r=this[i];t.call(this,o),this.requestUpdate(i,r,e,!0,o)}}throw Error("Unsupported decorator location: "+i)};function ve(e){return(t,o)=>"object"==typeof o?ge(e,t,o):((e,t,o)=>{const i=t.hasOwnProperty(o);return t.constructor.createProperty(o,e),i?Object.getOwnPropertyDescriptor(t,o):void 0})(e,t,o)}function be(e){return ve({...e,state:!0,attribute:!1})}const ye=l`
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
`;const xe=new class{constructor(){this.modules=new Map}register(e){this.modules.set(e.metadata.type,e)}get(e){return this.modules.get(e)}getAll(){return Array.from(this.modules.values())}getByCategory(e){return this.getAll().filter(t=>t.metadata.category===e)}getMetadata(){return this.getAll().map(e=>e.metadata)}search(e){const t=e.toLowerCase();return this.getAll().filter(e=>e.metadata.name.toLowerCase().includes(t)||e.metadata.description.toLowerCase().includes(t)||e.metadata.type.toLowerCase().includes(t))}createDefault(e){const t=this.get(e);return t?t.createDefault():null}has(e){return this.modules.has(e)}get types(){return Array.from(this.modules.keys())}},we={font_size:"font-size",font_weight:"font-weight",font_family:"font-family",line_height:"line-height",text_align:"text-align",text_transform:"text-transform",letter_spacing:"letter-spacing",color:"color",background:"background",opacity:"opacity",padding:"padding",margin:"margin",border:"border",border_radius:"border-radius",border_color:"border-color",box_shadow:"box-shadow",text_shadow:"text-shadow",width:"width",height:"height",min_width:"min-width",min_height:"min-height",max_width:"max-width",max_height:"max-height",overflow:"overflow",flex:"flex",filter:"filter",backdrop_filter:"backdrop-filter",transform:"transform",transition:"transition"};function _e(e){if(!e)return"";const t=[];for(const[o,i]of Object.entries(we)){const r=e[o];void 0!==r&&"string"==typeof r&&t.push(`${i}: ${r}`)}return e.css&&t.push(e.css),t.join("; ")}let $e=0;function ke(e="mc"){$e++;return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}_${$e}`}var Se=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};let Ce=class extends ue{static getConfigElement(){return document.createElement(t)}static getStubConfig(){return{type:`custom:${e}`,rows:[{id:ke("row"),layout:"1",columns:[{id:ke("col"),modules:[{id:ke("text"),type:"text",text:"Welcome to Magic Card"}]}]}]}}setConfig(e){if(!e)throw new Error("No configuration provided");this._config={...e,rows:e.rows||[]},this._config.rows=this._config.rows.map(e=>({...e,id:e.id||ke("row"),columns:(e.columns||[]).map(e=>({...e,id:e.id||ke("col"),modules:(e.modules||[]).map(e=>({...e,id:e.id||ke(e.type)}))}))}))}getCardSize(){return this._config?.rows?Math.max(this._config.rows.length,1):1}render(){if(!this._config)return X`<ha-card><div class="mc-error">No configuration</div></ha-card>`;const e=this._buildCardStyle();return X`
      <ha-card>
        <div class="mc-card-content" style=${e}>
          ${this._config.rows.map(e=>this._renderRow(e))}
        </div>
      </ha-card>
    `}_buildCardStyle(){const e=[],t=this._config;return t.padding&&e.push(`padding: ${t.padding}`),t.background&&e.push(`background: ${t.background}`),t.border_radius&&e.push(`border-radius: ${t.border_radius}`),t.box_shadow&&e.push(`box-shadow: ${t.box_shadow}`),t.card_height&&e.push(`min-height: ${t.card_height}`),t.overflow&&e.push(`overflow: ${t.overflow}`),e.join("; ")}_renderRow(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return X``;var t;const o=`grid-template-columns: ${(t=e.layout||"1")?{1:"1fr","1-1":"1fr 1fr","1-2":"1fr 2fr","2-1":"2fr 1fr","1-1-1":"1fr 1fr 1fr","1-2-1":"1fr 2fr 1fr"}[t]||t:"1fr"}; gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,i=_e(e.design);return X`
      <div class="mc-row" style="${o}; ${i}">
        ${e.columns.map(e=>this._renderColumn(e))}
      </div>
    `}_renderColumn(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return X``;const t=`gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,o=_e(e.design);return X`
      <div
        class="mc-column"
        data-valign=${e.vertical_align||K}
        style="${t}; ${o}"
      >
        ${e.modules.map(e=>this._renderModule(e))}
      </div>
    `}_renderModule(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return X``;const t=xe.get(e.type);if(!t)return X`<div class="mc-error">Unknown module: ${e.type}</div>`;const o=_e(e.design),i=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return X`
      <div
        class="mc-module-wrapper ${i?"mc-hoverable":""}"
        style=${o}
        @click=${i?t=>this._handleAction(t,e,"tap"):K}
        @contextmenu=${i?t=>this._handleAction(t,e,"hold"):K}
        @dblclick=${i?t=>this._handleAction(t,e,"double_tap"):K}
      >
        ${t.renderPreview(e,this.hass)}
      </div>
    `}_evaluateDisplay(e){if(!e.conditions?.length)return!0;if(!this.hass)return!0;const t=e.conditions.map(e=>{switch(e.type){case"state":{if(!e.entity)return!0;const t=this.hass.states[e.entity];return!!t&&(void 0!==e.state&&""!==e.state?t.state===e.state:void 0!==e.state_not&&""!==e.state_not?t.state!==e.state_not:!(void 0!==e.above&&Number(t.state)<=e.above)&&!(void 0!==e.below&&Number(t.state)>=e.below))}case"attribute":{if(!e.entity||!e.attribute)return!0;const t=this.hass.states[e.entity];if(!t)return!1;const o=String(t.attributes[e.attribute]??"");return void 0!==e.state&&""!==e.state?o===e.state:void 0===e.state_not||""===e.state_not||o!==e.state_not}case"time":{const t=new Date,o=60*t.getHours()+t.getMinutes();if(e.after){const[t,i]=e.after.split(":").map(Number);if(o<60*t+i)return!1}if(e.before){const[t,i]=e.before.split(":").map(Number);if(o>=60*t+i)return!1}return!0}default:return!0}});return"any"===e.mode?t.some(Boolean):t.every(Boolean)}_handleAction(e,t,o){"hold"===o&&e.preventDefault();const i=`${o}_action`,r=t.actions?.[i];if(!r||"none"===r.action)return;const n=t.entity;switch(r.action){case"more-info":if(n||r.entity){const e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:r.entity||n}});this.dispatchEvent(e)}break;case"toggle":if(n||r.entity){const e=r.entity||n,t=e.split(".")[0];this.hass?.callService(t,"toggle",{entity_id:e})}break;case"navigate":if(r.navigation_path){history.pushState(null,"",r.navigation_path);const e=new Event("location-changed",{bubbles:!0,composed:!0});window.dispatchEvent(e)}break;case"url":r.url_path&&window.open(r.url_path,"_blank");break;case"perform-action":if(r.service){const[e,t]=r.service.split(".");this.hass?.callService(e,t,{...r.data,...r.service_data})}break;case"assist":this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}}}))}}};Ce.styles=ye,Se([ve({attribute:!1})],Ce.prototype,"hass",void 0),Se([be()],Ce.prototype,"_config",void 0),Ce=Se([me(e)],Ce);const Ae=l`
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
`;function Me(e){if(null===e||"object"!=typeof e)return e;if(Array.isArray(e))return e.map(e=>Me(e));const t={};for(const o of Object.keys(e))t[o]=Me(e[o]);return t}class Ee{constructor(e=50){this.undoStack=[],this.redoStack=[],this.limit=e}push(e){this.undoStack.push(Me(e)),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack=[]}undo(e){return 0===this.undoStack.length?null:(this.redoStack.push(Me(e)),this.undoStack.pop())}redo(e){return 0===this.redoStack.length?null:(this.undoStack.push(Me(e)),this.redoStack.pop())}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}clear(){this.undoStack=[],this.redoStack=[]}get undoCount(){return this.undoStack.length}get redoCount(){return this.redoStack.length}}class Te{constructor(e){this.fireEvent=e,this.undoRedo=new Ee,this.listeners=new Set,this.state={config:{type:"custom:magic-card",rows:[]},selectedPath:null,activeTab:"general",editorMode:"form",isDirty:!1},this.dispatchConfigChanged=function(e,t){let o=null;const i=function(...i){null!==o&&clearTimeout(o),o=setTimeout(()=>{e.apply(this,i),o=null},t)};return i.cancel=()=>{null!==o&&(clearTimeout(o),o=null)},i}(e=>{this.fireEvent(e)},200)}subscribe(e){return this.listeners.add(e),e(this.state),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return this.state}getConfig(){return this.state.config}getSelectedModule(){const e=this.state.selectedPath;return void 0===e?.rowIndex||void 0===e?.columnIndex||void 0===e?.moduleIndex?null:this.state.config.rows[e.rowIndex]?.columns[e.columnIndex]?.modules[e.moduleIndex]??null}setConfig(e){this.state={...this.state,config:Me(e),isDirty:!1},this.notify()}updateConfig(e,t=!0){t&&this.undoRedo.push(this.state.config),this.state={...this.state,config:Me(e),isDirty:!0},this.notify(),this.dispatchConfigChanged(this.state.config)}setEditorMode(e){this.state={...this.state,editorMode:e},this.notify()}setSelectedPath(e){this.state={...this.state,selectedPath:e},this.notify()}setActiveTab(e){this.state={...this.state,activeTab:e},this.notify()}addRow(e="1"){const t=Me(this.state.config),o=e.split("-").length,i=Array.from({length:o},()=>({id:ke("col"),modules:[]}));t.rows.push({id:ke("row"),layout:e,columns:i}),this.updateConfig(t)}deleteRow(e){const t=Me(this.state.config);t.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(t)}moveRow(e,t){if(e===t)return;const o=Me(this.state.config),[i]=o.rows.splice(e,1);o.rows.splice(t,0,i),this.updateConfig(o)}updateRow(e,t){const o=Me(this.state.config);o.rows[e]={...o.rows[e],...t},this.updateConfig(o)}addColumn(e){const t=Me(this.state.config);t.rows[e].columns.push({id:ke("col"),modules:[]}),this.updateConfig(t)}deleteColumn(e,t){const o=Me(this.state.config);o.rows[e].columns.splice(t,1),0===o.rows[e].columns.length&&o.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(o)}addModule(e,t,o){const i=Me(this.state.config),r=xe.createDefault(o);if(!r)return;i.rows[e].columns[t].modules.push(r);const n=i.rows[e].columns[t].modules.length-1;this.updateConfig(i),this.setSelectedPath({rowIndex:e,columnIndex:t,moduleIndex:n})}deleteModule(e,t,o){const i=Me(this.state.config);i.rows[e].columns[t].modules.splice(o,1),this.state.selectedPath=null,this.updateConfig(i)}updateModule(e,t,o,i){const r=Me(this.state.config),n=r.rows[e].columns[t].modules[o];r.rows[e].columns[t].modules[o]={...n,...i},this.updateConfig(r)}moveModule(e,t,o,i,r,n){const a=Me(this.state.config),[s]=a.rows[e].columns[t].modules.splice(o,1);a.rows[i].columns[r].modules.splice(n,0,s),this.updateConfig(a),this.setSelectedPath({rowIndex:i,columnIndex:r,moduleIndex:n})}undo(){const e=this.undoRedo.undo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}redo(){const e=this.undoRedo.redo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}canUndo(){return this.undoRedo.canUndo()}canRedo(){return this.undoRedo.canRedo()}destroy(){this.dispatchConfigChanged.cancel(),this.listeners.clear(),this.undoRedo.clear()}}const De=l`
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

  /* Sortable ghost */
  .mc-sortable-ghost {
    opacity: 0.4;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 20%, transparent);
  }

  /* Sortable fallback (for Shadow DOM support) */
  .sortable-fallback {
    opacity: 0.8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .sortable-drag {
    opacity: 1;
    background: var(--card-background-color, #fff);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  /* Chosen state while dragging */
  .sortable-chosen {
    background: color-mix(in srgb, var(--primary-color, #6366f1) 10%, transparent);
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
`;function Ie(e,t,o){return X`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="text"
        .value=${t||""}
        @input=${e=>o(e.target.value)}
      />
    </div>
  `}function Oe(e,t,o,i){return X`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="number"
        .value=${String(t??"")}
        min=${i?.min??K}
        max=${i?.max??K}
        step=${i?.step??K}
        @input=${e=>o(Number(e.target.value))}
      />
    </div>
  `}function Pe(e,t,o,i){return X`
    <div class="mc-field">
      ${e?X`<label class="mc-field-label">${e}</label>`:K}
      <select @change=${e=>i(e.target.value)}>
        ${o.map(e=>X`<option value=${e.value} ?selected=${t===e.value}>
              ${e.label}
            </option>`)}
      </select>
    </div>
  `}function ze(e,t,o){return X`
    <div class="mc-field mc-field-toggle">
      <label class="mc-field-label">${e}</label>
      <input
        type="checkbox"
        .checked=${t??!1}
        @change=${e=>o(e.target.checked)}
      />
    </div>
  `}function Ne(e,t,o,i){return i?X`
      <div class="mc-field">
        <label class="mc-field-label">${e}</label>
        <ha-entity-picker
          .hass=${i}
          .value=${t||""}
          @value-changed=${e=>o(e.detail.value||"")}
          allow-custom-entity
        ></ha-entity-picker>
      </div>
    `:X`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="text"
        .value=${t||""}
        placeholder="entity_id"
        @input=${e=>o(e.target.value)}
      />
    </div>
  `}function je(e,t,o){return X`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-color-picker
        .value=${t||""}
        .label=${e}
        @value-changed=${e=>o(e.detail.value)}
      ></mc-color-picker>
    </div>
  `}function Re(e,t,o){return X`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-unit-field
        .value=${t||""}
        @value-changed=${e=>o(e.detail.value)}
      ></mc-unit-field>
    </div>
  `}function Le(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,i)}return o}function He(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?Le(Object(o),!0).forEach(function(t){Ue(e,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):Le(Object(o)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))})}return e}function Fe(e){return Fe="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Fe(e)}function Ue(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function Be(){return Be=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(e[i]=o[i])}return e},Be.apply(this,arguments)}function Ye(e,t){if(null==e)return{};var o,i,r=function(e,t){if(null==e)return{};var o,i,r={},n=Object.keys(e);for(i=0;i<n.length;i++)o=n[i],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(i=0;i<n.length;i++)o=n[i],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}function We(e){if("undefined"!=typeof window&&window.navigator)return!!navigator.userAgent.match(e)}var qe=We(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i),Ge=We(/Edge/i),Xe=We(/firefox/i),Ve=We(/safari/i)&&!We(/chrome/i)&&!We(/android/i),Ke=We(/iP(ad|od|hone)/i),Qe=We(/chrome/i)&&We(/android/i),Ze={capture:!1,passive:!1};function Je(e,t,o){e.addEventListener(t,o,!qe&&Ze)}function et(e,t,o){e.removeEventListener(t,o,!qe&&Ze)}function tt(e,t){if(t){if(">"===t[0]&&(t=t.substring(1)),e)try{if(e.matches)return e.matches(t);if(e.msMatchesSelector)return e.msMatchesSelector(t);if(e.webkitMatchesSelector)return e.webkitMatchesSelector(t)}catch(e){return!1}return!1}}function ot(e){return e.host&&e!==document&&e.host.nodeType?e.host:e.parentNode}function it(e,t,o,i){if(e){o=o||document;do{if(null!=t&&(">"===t[0]?e.parentNode===o&&tt(e,t):tt(e,t))||i&&e===o)return e;if(e===o)break}while(e=ot(e))}return null}var rt,nt=/\s+/g;function at(e,t,o){if(e&&t)if(e.classList)e.classList[o?"add":"remove"](t);else{var i=(" "+e.className+" ").replace(nt," ").replace(" "+t+" "," ");e.className=(i+(o?" "+t:"")).replace(nt," ")}}function st(e,t,o){var i=e&&e.style;if(i){if(void 0===o)return document.defaultView&&document.defaultView.getComputedStyle?o=document.defaultView.getComputedStyle(e,""):e.currentStyle&&(o=e.currentStyle),void 0===t?o:o[t];t in i||-1!==t.indexOf("webkit")||(t="-webkit-"+t),i[t]=o+("string"==typeof o?"":"px")}}function lt(e,t){var o="";if("string"==typeof e)o=e;else do{var i=st(e,"transform");i&&"none"!==i&&(o=i+" "+o)}while(!t&&(e=e.parentNode));var r=window.DOMMatrix||window.WebKitCSSMatrix||window.CSSMatrix||window.MSCSSMatrix;return r&&new r(o)}function ct(e,t,o){if(e){var i=e.getElementsByTagName(t),r=0,n=i.length;if(o)for(;r<n;r++)o(i[r],r);return i}return[]}function dt(){var e=document.scrollingElement;return e||document.documentElement}function pt(e,t,o,i,r){if(e.getBoundingClientRect||e===window){var n,a,s,l,c,d,p;if(e!==window&&e.parentNode&&e!==dt()?(a=(n=e.getBoundingClientRect()).top,s=n.left,l=n.bottom,c=n.right,d=n.height,p=n.width):(a=0,s=0,l=window.innerHeight,c=window.innerWidth,d=window.innerHeight,p=window.innerWidth),(t||o)&&e!==window&&(r=r||e.parentNode,!qe))do{if(r&&r.getBoundingClientRect&&("none"!==st(r,"transform")||o&&"static"!==st(r,"position"))){var u=r.getBoundingClientRect();a-=u.top+parseInt(st(r,"border-top-width")),s-=u.left+parseInt(st(r,"border-left-width")),l=a+n.height,c=s+n.width;break}}while(r=r.parentNode);if(i&&e!==window){var h=lt(r||e),m=h&&h.a,f=h&&h.d;h&&(l=(a/=f)+(d/=f),c=(s/=m)+(p/=m))}return{top:a,left:s,bottom:l,right:c,width:p,height:d}}}function ut(e,t,o){for(var i=vt(e,!0),r=pt(e)[t];i;){var n=pt(i)[o];if(!("top"===o||"left"===o?r>=n:r<=n))return i;if(i===dt())break;i=vt(i,!1)}return!1}function ht(e,t,o,i){for(var r=0,n=0,a=e.children;n<a.length;){if("none"!==a[n].style.display&&a[n]!==$o.ghost&&(i||a[n]!==$o.dragged)&&it(a[n],o.draggable,e,!1)){if(r===t)return a[n];r++}n++}return null}function mt(e,t){for(var o=e.lastElementChild;o&&(o===$o.ghost||"none"===st(o,"display")||t&&!tt(o,t));)o=o.previousElementSibling;return o||null}function ft(e,t){var o=0;if(!e||!e.parentNode)return-1;for(;e=e.previousElementSibling;)"TEMPLATE"===e.nodeName.toUpperCase()||e===$o.clone||t&&!tt(e,t)||o++;return o}function gt(e){var t=0,o=0,i=dt();if(e)do{var r=lt(e),n=r.a,a=r.d;t+=e.scrollLeft*n,o+=e.scrollTop*a}while(e!==i&&(e=e.parentNode));return[t,o]}function vt(e,t){if(!e||!e.getBoundingClientRect)return dt();var o=e,i=!1;do{if(o.clientWidth<o.scrollWidth||o.clientHeight<o.scrollHeight){var r=st(o);if(o.clientWidth<o.scrollWidth&&("auto"==r.overflowX||"scroll"==r.overflowX)||o.clientHeight<o.scrollHeight&&("auto"==r.overflowY||"scroll"==r.overflowY)){if(!o.getBoundingClientRect||o===document.body)return dt();if(i||t)return o;i=!0}}}while(o=o.parentNode);return dt()}function bt(e,t){return Math.round(e.top)===Math.round(t.top)&&Math.round(e.left)===Math.round(t.left)&&Math.round(e.height)===Math.round(t.height)&&Math.round(e.width)===Math.round(t.width)}function yt(e,t){return function(){if(!rt){var o=arguments;1===o.length?e.call(this,o[0]):e.apply(this,o),rt=setTimeout(function(){rt=void 0},t)}}}function xt(e,t,o){e.scrollLeft+=t,e.scrollTop+=o}function wt(e){var t=window.Polymer,o=window.jQuery||window.Zepto;return t&&t.dom?t.dom(e).cloneNode(!0):o?o(e).clone(!0)[0]:e.cloneNode(!0)}function _t(e,t,o){var i={};return Array.from(e.children).forEach(function(r){var n,a,s,l;if(it(r,t.draggable,e,!1)&&!r.animated&&r!==o){var c=pt(r);i.left=Math.min(null!==(n=i.left)&&void 0!==n?n:1/0,c.left),i.top=Math.min(null!==(a=i.top)&&void 0!==a?a:1/0,c.top),i.right=Math.max(null!==(s=i.right)&&void 0!==s?s:-1/0,c.right),i.bottom=Math.max(null!==(l=i.bottom)&&void 0!==l?l:-1/0,c.bottom)}}),i.width=i.right-i.left,i.height=i.bottom-i.top,i.x=i.left,i.y=i.top,i}var $t="Sortable"+(new Date).getTime();function kt(){var e,t=[];return{captureAnimationState:function(){(t=[],this.options.animation)&&[].slice.call(this.el.children).forEach(function(e){if("none"!==st(e,"display")&&e!==$o.ghost){t.push({target:e,rect:pt(e)});var o=He({},t[t.length-1].rect);if(e.thisAnimationDuration){var i=lt(e,!0);i&&(o.top-=i.f,o.left-=i.e)}e.fromRect=o}})},addAnimationState:function(e){t.push(e)},removeAnimationState:function(e){t.splice(function(e,t){for(var o in e)if(e.hasOwnProperty(o))for(var i in t)if(t.hasOwnProperty(i)&&t[i]===e[o][i])return Number(o);return-1}(t,{target:e}),1)},animateAll:function(o){var i=this;if(!this.options.animation)return clearTimeout(e),void("function"==typeof o&&o());var r=!1,n=0;t.forEach(function(e){var t=0,o=e.target,a=o.fromRect,s=pt(o),l=o.prevFromRect,c=o.prevToRect,d=e.rect,p=lt(o,!0);p&&(s.top-=p.f,s.left-=p.e),o.toRect=s,o.thisAnimationDuration&&bt(l,s)&&!bt(a,s)&&(d.top-s.top)/(d.left-s.left)===(a.top-s.top)/(a.left-s.left)&&(t=function(e,t,o,i){return Math.sqrt(Math.pow(t.top-e.top,2)+Math.pow(t.left-e.left,2))/Math.sqrt(Math.pow(t.top-o.top,2)+Math.pow(t.left-o.left,2))*i.animation}(d,l,c,i.options)),bt(s,a)||(o.prevFromRect=a,o.prevToRect=s,t||(t=i.options.animation),i.animate(o,d,s,t)),t&&(r=!0,n=Math.max(n,t),clearTimeout(o.animationResetTimer),o.animationResetTimer=setTimeout(function(){o.animationTime=0,o.prevFromRect=null,o.fromRect=null,o.prevToRect=null,o.thisAnimationDuration=null},t),o.thisAnimationDuration=t)}),clearTimeout(e),r?e=setTimeout(function(){"function"==typeof o&&o()},n):"function"==typeof o&&o(),t=[]},animate:function(e,t,o,i){if(i){st(e,"transition",""),st(e,"transform","");var r=lt(this.el),n=r&&r.a,a=r&&r.d,s=(t.left-o.left)/(n||1),l=(t.top-o.top)/(a||1);e.animatingX=!!s,e.animatingY=!!l,st(e,"transform","translate3d("+s+"px,"+l+"px,0)"),this.forRepaintDummy=function(e){return e.offsetWidth}(e),st(e,"transition","transform "+i+"ms"+(this.options.easing?" "+this.options.easing:"")),st(e,"transform","translate3d(0,0,0)"),"number"==typeof e.animated&&clearTimeout(e.animated),e.animated=setTimeout(function(){st(e,"transition",""),st(e,"transform",""),e.animated=!1,e.animatingX=!1,e.animatingY=!1},i)}}}}var St=[],Ct={initializeByDefault:!0},At={mount:function(e){for(var t in Ct)Ct.hasOwnProperty(t)&&!(t in e)&&(e[t]=Ct[t]);St.forEach(function(t){if(t.pluginName===e.pluginName)throw"Sortable: Cannot mount plugin ".concat(e.pluginName," more than once")}),St.push(e)},pluginEvent:function(e,t,o){var i=this;this.eventCanceled=!1,o.cancel=function(){i.eventCanceled=!0};var r=e+"Global";St.forEach(function(i){t[i.pluginName]&&(t[i.pluginName][r]&&t[i.pluginName][r](He({sortable:t},o)),t.options[i.pluginName]&&t[i.pluginName][e]&&t[i.pluginName][e](He({sortable:t},o)))})},initializePlugins:function(e,t,o,i){for(var r in St.forEach(function(i){var r=i.pluginName;if(e.options[r]||i.initializeByDefault){var n=new i(e,t,e.options);n.sortable=e,n.options=e.options,e[r]=n,Be(o,n.defaults)}}),e.options)if(e.options.hasOwnProperty(r)){var n=this.modifyOption(e,r,e.options[r]);void 0!==n&&(e.options[r]=n)}},getEventProperties:function(e,t){var o={};return St.forEach(function(i){"function"==typeof i.eventProperties&&Be(o,i.eventProperties.call(t[i.pluginName],e))}),o},modifyOption:function(e,t,o){var i;return St.forEach(function(r){e[r.pluginName]&&r.optionListeners&&"function"==typeof r.optionListeners[t]&&(i=r.optionListeners[t].call(e[r.pluginName],o))}),i}};function Mt(e){var t=e.sortable,o=e.rootEl,i=e.name,r=e.targetEl,n=e.cloneEl,a=e.toEl,s=e.fromEl,l=e.oldIndex,c=e.newIndex,d=e.oldDraggableIndex,p=e.newDraggableIndex,u=e.originalEvent,h=e.putSortable,m=e.extraEventProperties;if(t=t||o&&o[$t]){var f,g=t.options,v="on"+i.charAt(0).toUpperCase()+i.substr(1);!window.CustomEvent||qe||Ge?(f=document.createEvent("Event")).initEvent(i,!0,!0):f=new CustomEvent(i,{bubbles:!0,cancelable:!0}),f.to=a||o,f.from=s||o,f.item=r||o,f.clone=n,f.oldIndex=l,f.newIndex=c,f.oldDraggableIndex=d,f.newDraggableIndex=p,f.originalEvent=u,f.pullMode=h?h.lastPutMode:void 0;var b=He(He({},m),At.getEventProperties(i,t));for(var y in b)f[y]=b[y];o&&o.dispatchEvent(f),g[v]&&g[v].call(t,f)}}var Et=["evt"],Tt=function(e,t){var o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=o.evt,r=Ye(o,Et);At.pluginEvent.bind($o)(e,t,He({dragEl:It,parentEl:Ot,ghostEl:Pt,rootEl:zt,nextEl:Nt,lastDownEl:jt,cloneEl:Rt,cloneHidden:Lt,dragStarted:Zt,putSortable:Wt,activeSortable:$o.active,originalEvent:i,oldIndex:Ht,oldDraggableIndex:Ut,newIndex:Ft,newDraggableIndex:Bt,hideGhostForTarget:yo,unhideGhostForTarget:xo,cloneNowHidden:function(){Lt=!0},cloneNowShown:function(){Lt=!1},dispatchSortableEvent:function(e){Dt({sortable:t,name:e,originalEvent:i})}},r))};function Dt(e){Mt(He({putSortable:Wt,cloneEl:Rt,targetEl:It,rootEl:zt,oldIndex:Ht,oldDraggableIndex:Ut,newIndex:Ft,newDraggableIndex:Bt},e))}var It,Ot,Pt,zt,Nt,jt,Rt,Lt,Ht,Ft,Ut,Bt,Yt,Wt,qt,Gt,Xt,Vt,Kt,Qt,Zt,Jt,eo,to,oo,io=!1,ro=!1,no=[],ao=!1,so=!1,lo=[],co=!1,po=[],uo="undefined"!=typeof document,ho=Ke,mo=Ge||qe?"cssFloat":"float",fo=uo&&!Qe&&!Ke&&"draggable"in document.createElement("div"),go=function(){if(uo){if(qe)return!1;var e=document.createElement("x");return e.style.cssText="pointer-events:auto","auto"===e.style.pointerEvents}}(),vo=function(e,t){var o=st(e),i=parseInt(o.width)-parseInt(o.paddingLeft)-parseInt(o.paddingRight)-parseInt(o.borderLeftWidth)-parseInt(o.borderRightWidth),r=ht(e,0,t),n=ht(e,1,t),a=r&&st(r),s=n&&st(n),l=a&&parseInt(a.marginLeft)+parseInt(a.marginRight)+pt(r).width,c=s&&parseInt(s.marginLeft)+parseInt(s.marginRight)+pt(n).width;if("flex"===o.display)return"column"===o.flexDirection||"column-reverse"===o.flexDirection?"vertical":"horizontal";if("grid"===o.display)return o.gridTemplateColumns.split(" ").length<=1?"vertical":"horizontal";if(r&&a.float&&"none"!==a.float){var d="left"===a.float?"left":"right";return!n||"both"!==s.clear&&s.clear!==d?"horizontal":"vertical"}return r&&("block"===a.display||"flex"===a.display||"table"===a.display||"grid"===a.display||l>=i&&"none"===o[mo]||n&&"none"===o[mo]&&l+c>i)?"vertical":"horizontal"},bo=function(e){function t(e,o){return function(i,r,n,a){var s=i.options.group.name&&r.options.group.name&&i.options.group.name===r.options.group.name;if(null==e&&(o||s))return!0;if(null==e||!1===e)return!1;if(o&&"clone"===e)return e;if("function"==typeof e)return t(e(i,r,n,a),o)(i,r,n,a);var l=(o?i:r).options.group.name;return!0===e||"string"==typeof e&&e===l||e.join&&e.indexOf(l)>-1}}var o={},i=e.group;i&&"object"==Fe(i)||(i={name:i}),o.name=i.name,o.checkPull=t(i.pull,!0),o.checkPut=t(i.put),o.revertClone=i.revertClone,e.group=o},yo=function(){!go&&Pt&&st(Pt,"display","none")},xo=function(){!go&&Pt&&st(Pt,"display","")};uo&&!Qe&&document.addEventListener("click",function(e){if(ro)return e.preventDefault(),e.stopPropagation&&e.stopPropagation(),e.stopImmediatePropagation&&e.stopImmediatePropagation(),ro=!1,!1},!0);var wo=function(e){if(It){var t=function(e,t){var o;return no.some(function(i){var r=i[$t].options.emptyInsertThreshold;if(r&&!mt(i)){var n=pt(i),a=e>=n.left-r&&e<=n.right+r,s=t>=n.top-r&&t<=n.bottom+r;return a&&s?o=i:void 0}}),o}((e=e.touches?e.touches[0]:e).clientX,e.clientY);if(t){var o={};for(var i in e)e.hasOwnProperty(i)&&(o[i]=e[i]);o.target=o.rootEl=t,o.preventDefault=void 0,o.stopPropagation=void 0,t[$t]._onDragOver(o)}}},_o=function(e){It&&It.parentNode[$t]._isOutsideThisEl(e.target)};function $o(e,t){if(!e||!e.nodeType||1!==e.nodeType)throw"Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(e));this.el=e,this.options=t=Be({},t),e[$t]=this;var o={group:null,sort:!0,disabled:!1,store:null,handle:null,draggable:/^[uo]l$/i.test(e.nodeName)?">li":">*",swapThreshold:1,invertSwap:!1,invertedSwapThreshold:null,removeCloneOnHide:!0,direction:function(){return vo(e,this.options)},ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",ignore:"a, img",filter:null,preventOnFilter:!0,animation:0,easing:null,setData:function(e,t){e.setData("Text",t.textContent)},dropBubble:!1,dragoverBubble:!1,dataIdAttr:"data-id",delay:0,delayOnTouchOnly:!1,touchStartThreshold:(Number.parseInt?Number:window).parseInt(window.devicePixelRatio,10)||1,forceFallback:!1,fallbackClass:"sortable-fallback",fallbackOnBody:!1,fallbackTolerance:0,fallbackOffset:{x:0,y:0},supportPointer:!1!==$o.supportPointer&&"PointerEvent"in window&&(!Ve||Ke),emptyInsertThreshold:5};for(var i in At.initializePlugins(this,e,o),o)!(i in t)&&(t[i]=o[i]);for(var r in bo(t),this)"_"===r.charAt(0)&&"function"==typeof this[r]&&(this[r]=this[r].bind(this));this.nativeDraggable=!t.forceFallback&&fo,this.nativeDraggable&&(this.options.touchStartThreshold=1),t.supportPointer?Je(e,"pointerdown",this._onTapStart):(Je(e,"mousedown",this._onTapStart),Je(e,"touchstart",this._onTapStart)),this.nativeDraggable&&(Je(e,"dragover",this),Je(e,"dragenter",this)),no.push(this.el),t.store&&t.store.get&&this.sort(t.store.get(this)||[]),Be(this,kt())}function ko(e,t,o,i,r,n,a,s){var l,c,d=e[$t],p=d.options.onMove;return!window.CustomEvent||qe||Ge?(l=document.createEvent("Event")).initEvent("move",!0,!0):l=new CustomEvent("move",{bubbles:!0,cancelable:!0}),l.to=t,l.from=e,l.dragged=o,l.draggedRect=i,l.related=r||t,l.relatedRect=n||pt(t),l.willInsertAfter=s,l.originalEvent=a,e.dispatchEvent(l),p&&(c=p.call(d,l,a)),c}function So(e){e.draggable=!1}function Co(){co=!1}function Ao(e){for(var t=e.tagName+e.className+e.src+e.href+e.textContent,o=t.length,i=0;o--;)i+=t.charCodeAt(o);return i.toString(36)}function Mo(e){return setTimeout(e,0)}function Eo(e){return clearTimeout(e)}$o.prototype={constructor:$o,_isOutsideThisEl:function(e){this.el.contains(e)||e===this.el||(Jt=null)},_getDirection:function(e,t){return"function"==typeof this.options.direction?this.options.direction.call(this,e,t,It):this.options.direction},_onTapStart:function(e){if(e.cancelable){var t=this,o=this.el,i=this.options,r=i.preventOnFilter,n=e.type,a=e.touches&&e.touches[0]||e.pointerType&&"touch"===e.pointerType&&e,s=(a||e).target,l=e.target.shadowRoot&&(e.path&&e.path[0]||e.composedPath&&e.composedPath()[0])||s,c=i.filter;if(function(e){po.length=0;var t=e.getElementsByTagName("input"),o=t.length;for(;o--;){var i=t[o];i.checked&&po.push(i)}}(o),!It&&!(/mousedown|pointerdown/.test(n)&&0!==e.button||i.disabled)&&!l.isContentEditable&&(this.nativeDraggable||!Ve||!s||"SELECT"!==s.tagName.toUpperCase())&&!((s=it(s,i.draggable,o,!1))&&s.animated||jt===s)){if(Ht=ft(s),Ut=ft(s,i.draggable),"function"==typeof c){if(c.call(this,e,s,this))return Dt({sortable:t,rootEl:l,name:"filter",targetEl:s,toEl:o,fromEl:o}),Tt("filter",t,{evt:e}),void(r&&e.preventDefault())}else if(c&&(c=c.split(",").some(function(i){if(i=it(l,i.trim(),o,!1))return Dt({sortable:t,rootEl:i,name:"filter",targetEl:s,fromEl:o,toEl:o}),Tt("filter",t,{evt:e}),!0})))return void(r&&e.preventDefault());i.handle&&!it(l,i.handle,o,!1)||this._prepareDragStart(e,a,s)}}},_prepareDragStart:function(e,t,o){var i,r=this,n=r.el,a=r.options,s=n.ownerDocument;if(o&&!It&&o.parentNode===n){var l=pt(o);if(zt=n,Ot=(It=o).parentNode,Nt=It.nextSibling,jt=o,Yt=a.group,$o.dragged=It,qt={target:It,clientX:(t||e).clientX,clientY:(t||e).clientY},Kt=qt.clientX-l.left,Qt=qt.clientY-l.top,this._lastX=(t||e).clientX,this._lastY=(t||e).clientY,It.style["will-change"]="all",i=function(){Tt("delayEnded",r,{evt:e}),$o.eventCanceled?r._onDrop():(r._disableDelayedDragEvents(),!Xe&&r.nativeDraggable&&(It.draggable=!0),r._triggerDragStart(e,t),Dt({sortable:r,name:"choose",originalEvent:e}),at(It,a.chosenClass,!0))},a.ignore.split(",").forEach(function(e){ct(It,e.trim(),So)}),Je(s,"dragover",wo),Je(s,"mousemove",wo),Je(s,"touchmove",wo),a.supportPointer?(Je(s,"pointerup",r._onDrop),!this.nativeDraggable&&Je(s,"pointercancel",r._onDrop)):(Je(s,"mouseup",r._onDrop),Je(s,"touchend",r._onDrop),Je(s,"touchcancel",r._onDrop)),Xe&&this.nativeDraggable&&(this.options.touchStartThreshold=4,It.draggable=!0),Tt("delayStart",this,{evt:e}),!a.delay||a.delayOnTouchOnly&&!t||this.nativeDraggable&&(Ge||qe))i();else{if($o.eventCanceled)return void this._onDrop();a.supportPointer?(Je(s,"pointerup",r._disableDelayedDrag),Je(s,"pointercancel",r._disableDelayedDrag)):(Je(s,"mouseup",r._disableDelayedDrag),Je(s,"touchend",r._disableDelayedDrag),Je(s,"touchcancel",r._disableDelayedDrag)),Je(s,"mousemove",r._delayedDragTouchMoveHandler),Je(s,"touchmove",r._delayedDragTouchMoveHandler),a.supportPointer&&Je(s,"pointermove",r._delayedDragTouchMoveHandler),r._dragStartTimer=setTimeout(i,a.delay)}}},_delayedDragTouchMoveHandler:function(e){var t=e.touches?e.touches[0]:e;Math.max(Math.abs(t.clientX-this._lastX),Math.abs(t.clientY-this._lastY))>=Math.floor(this.options.touchStartThreshold/(this.nativeDraggable&&window.devicePixelRatio||1))&&this._disableDelayedDrag()},_disableDelayedDrag:function(){It&&So(It),clearTimeout(this._dragStartTimer),this._disableDelayedDragEvents()},_disableDelayedDragEvents:function(){var e=this.el.ownerDocument;et(e,"mouseup",this._disableDelayedDrag),et(e,"touchend",this._disableDelayedDrag),et(e,"touchcancel",this._disableDelayedDrag),et(e,"pointerup",this._disableDelayedDrag),et(e,"pointercancel",this._disableDelayedDrag),et(e,"mousemove",this._delayedDragTouchMoveHandler),et(e,"touchmove",this._delayedDragTouchMoveHandler),et(e,"pointermove",this._delayedDragTouchMoveHandler)},_triggerDragStart:function(e,t){t=t||"touch"==e.pointerType&&e,!this.nativeDraggable||t?this.options.supportPointer?Je(document,"pointermove",this._onTouchMove):Je(document,t?"touchmove":"mousemove",this._onTouchMove):(Je(It,"dragend",this),Je(zt,"dragstart",this._onDragStart));try{document.selection?Mo(function(){document.selection.empty()}):window.getSelection().removeAllRanges()}catch(e){}},_dragStarted:function(e,t){if(io=!1,zt&&It){Tt("dragStarted",this,{evt:t}),this.nativeDraggable&&Je(document,"dragover",_o);var o=this.options;!e&&at(It,o.dragClass,!1),at(It,o.ghostClass,!0),$o.active=this,e&&this._appendGhost(),Dt({sortable:this,name:"start",originalEvent:t})}else this._nulling()},_emulateDragOver:function(){if(Gt){this._lastX=Gt.clientX,this._lastY=Gt.clientY,yo();for(var e=document.elementFromPoint(Gt.clientX,Gt.clientY),t=e;e&&e.shadowRoot&&(e=e.shadowRoot.elementFromPoint(Gt.clientX,Gt.clientY))!==t;)t=e;if(It.parentNode[$t]._isOutsideThisEl(e),t)do{if(t[$t]){if(t[$t]._onDragOver({clientX:Gt.clientX,clientY:Gt.clientY,target:e,rootEl:t})&&!this.options.dragoverBubble)break}e=t}while(t=ot(t));xo()}},_onTouchMove:function(e){if(qt){var t=this.options,o=t.fallbackTolerance,i=t.fallbackOffset,r=e.touches?e.touches[0]:e,n=Pt&&lt(Pt,!0),a=Pt&&n&&n.a,s=Pt&&n&&n.d,l=ho&&oo&&gt(oo),c=(r.clientX-qt.clientX+i.x)/(a||1)+(l?l[0]-lo[0]:0)/(a||1),d=(r.clientY-qt.clientY+i.y)/(s||1)+(l?l[1]-lo[1]:0)/(s||1);if(!$o.active&&!io){if(o&&Math.max(Math.abs(r.clientX-this._lastX),Math.abs(r.clientY-this._lastY))<o)return;this._onDragStart(e,!0)}if(Pt){n?(n.e+=c-(Xt||0),n.f+=d-(Vt||0)):n={a:1,b:0,c:0,d:1,e:c,f:d};var p="matrix(".concat(n.a,",").concat(n.b,",").concat(n.c,",").concat(n.d,",").concat(n.e,",").concat(n.f,")");st(Pt,"webkitTransform",p),st(Pt,"mozTransform",p),st(Pt,"msTransform",p),st(Pt,"transform",p),Xt=c,Vt=d,Gt=r}e.cancelable&&e.preventDefault()}},_appendGhost:function(){if(!Pt){var e=this.options.fallbackOnBody?document.body:zt,t=pt(It,!0,ho,!0,e),o=this.options;if(ho){for(oo=e;"static"===st(oo,"position")&&"none"===st(oo,"transform")&&oo!==document;)oo=oo.parentNode;oo!==document.body&&oo!==document.documentElement?(oo===document&&(oo=dt()),t.top+=oo.scrollTop,t.left+=oo.scrollLeft):oo=dt(),lo=gt(oo)}at(Pt=It.cloneNode(!0),o.ghostClass,!1),at(Pt,o.fallbackClass,!0),at(Pt,o.dragClass,!0),st(Pt,"transition",""),st(Pt,"transform",""),st(Pt,"box-sizing","border-box"),st(Pt,"margin",0),st(Pt,"top",t.top),st(Pt,"left",t.left),st(Pt,"width",t.width),st(Pt,"height",t.height),st(Pt,"opacity","0.8"),st(Pt,"position",ho?"absolute":"fixed"),st(Pt,"zIndex","100000"),st(Pt,"pointerEvents","none"),$o.ghost=Pt,e.appendChild(Pt),st(Pt,"transform-origin",Kt/parseInt(Pt.style.width)*100+"% "+Qt/parseInt(Pt.style.height)*100+"%")}},_onDragStart:function(e,t){var o=this,i=e.dataTransfer,r=o.options;Tt("dragStart",this,{evt:e}),$o.eventCanceled?this._onDrop():(Tt("setupClone",this),$o.eventCanceled||((Rt=wt(It)).removeAttribute("id"),Rt.draggable=!1,Rt.style["will-change"]="",this._hideClone(),at(Rt,this.options.chosenClass,!1),$o.clone=Rt),o.cloneId=Mo(function(){Tt("clone",o),$o.eventCanceled||(o.options.removeCloneOnHide||zt.insertBefore(Rt,It),o._hideClone(),Dt({sortable:o,name:"clone"}))}),!t&&at(It,r.dragClass,!0),t?(ro=!0,o._loopId=setInterval(o._emulateDragOver,50)):(et(document,"mouseup",o._onDrop),et(document,"touchend",o._onDrop),et(document,"touchcancel",o._onDrop),i&&(i.effectAllowed="move",r.setData&&r.setData.call(o,i,It)),Je(document,"drop",o),st(It,"transform","translateZ(0)")),io=!0,o._dragStartId=Mo(o._dragStarted.bind(o,t,e)),Je(document,"selectstart",o),Zt=!0,window.getSelection().removeAllRanges(),Ve&&st(document.body,"user-select","none"))},_onDragOver:function(e){var t,o,i,r,n=this.el,a=e.target,s=this.options,l=s.group,c=$o.active,d=Yt===l,p=s.sort,u=Wt||c,h=this,m=!1;if(!co){if(void 0!==e.preventDefault&&e.cancelable&&e.preventDefault(),a=it(a,s.draggable,n,!0),E("dragOver"),$o.eventCanceled)return m;if(It.contains(e.target)||a.animated&&a.animatingX&&a.animatingY||h._ignoreWhileAnimating===a)return D(!1);if(ro=!1,c&&!s.disabled&&(d?p||(i=Ot!==zt):Wt===this||(this.lastPutMode=Yt.checkPull(this,c,It,e))&&l.checkPut(this,c,It,e))){if(r="vertical"===this._getDirection(e,a),t=pt(It),E("dragOverValid"),$o.eventCanceled)return m;if(i)return Ot=zt,T(),this._hideClone(),E("revert"),$o.eventCanceled||(Nt?zt.insertBefore(It,Nt):zt.appendChild(It)),D(!0);var f=mt(n,s.draggable);if(!f||function(e,t,o){var i=pt(mt(o.el,o.options.draggable)),r=_t(o.el,o.options,Pt),n=10;return t?e.clientX>r.right+n||e.clientY>i.bottom&&e.clientX>i.left:e.clientY>r.bottom+n||e.clientX>i.right&&e.clientY>i.top}(e,r,this)&&!f.animated){if(f===It)return D(!1);if(f&&n===e.target&&(a=f),a&&(o=pt(a)),!1!==ko(zt,n,It,t,a,o,e,!!a))return T(),f&&f.nextSibling?n.insertBefore(It,f.nextSibling):n.appendChild(It),Ot=n,I(),D(!0)}else if(f&&function(e,t,o){var i=pt(ht(o.el,0,o.options,!0)),r=_t(o.el,o.options,Pt),n=10;return t?e.clientX<r.left-n||e.clientY<i.top&&e.clientX<i.right:e.clientY<r.top-n||e.clientY<i.bottom&&e.clientX<i.left}(e,r,this)){var g=ht(n,0,s,!0);if(g===It)return D(!1);if(o=pt(a=g),!1!==ko(zt,n,It,t,a,o,e,!1))return T(),n.insertBefore(It,g),Ot=n,I(),D(!0)}else if(a.parentNode===n){o=pt(a);var v,b,y,x=It.parentNode!==n,w=!function(e,t,o){var i=o?e.left:e.top,r=o?e.right:e.bottom,n=o?e.width:e.height,a=o?t.left:t.top,s=o?t.right:t.bottom,l=o?t.width:t.height;return i===a||r===s||i+n/2===a+l/2}(It.animated&&It.toRect||t,a.animated&&a.toRect||o,r),_=r?"top":"left",$=ut(a,"top","top")||ut(It,"top","top"),k=$?$.scrollTop:void 0;if(Jt!==a&&(b=o[_],ao=!1,so=!w&&s.invertSwap||x),v=function(e,t,o,i,r,n,a,s){var l=i?e.clientY:e.clientX,c=i?o.height:o.width,d=i?o.top:o.left,p=i?o.bottom:o.right,u=!1;if(!a)if(s&&to<c*r){if(!ao&&(1===eo?l>d+c*n/2:l<p-c*n/2)&&(ao=!0),ao)u=!0;else if(1===eo?l<d+to:l>p-to)return-eo}else if(l>d+c*(1-r)/2&&l<p-c*(1-r)/2)return function(e){return ft(It)<ft(e)?1:-1}(t);if((u=u||a)&&(l<d+c*n/2||l>p-c*n/2))return l>d+c/2?1:-1;return 0}(e,a,o,r,w?1:s.swapThreshold,null==s.invertedSwapThreshold?s.swapThreshold:s.invertedSwapThreshold,so,Jt===a),0!==v){var S=ft(It);do{S-=v,y=Ot.children[S]}while(y&&("none"===st(y,"display")||y===Pt))}if(0===v||y===a)return D(!1);Jt=a,eo=v;var C=a.nextElementSibling,A=!1,M=ko(zt,n,It,t,a,o,e,A=1===v);if(!1!==M)return 1!==M&&-1!==M||(A=1===M),co=!0,setTimeout(Co,30),T(),A&&!C?n.appendChild(It):a.parentNode.insertBefore(It,A?C:a),$&&xt($,0,k-$.scrollTop),Ot=It.parentNode,void 0===b||so||(to=Math.abs(b-pt(a)[_])),I(),D(!0)}if(n.contains(It))return D(!1)}return!1}function E(s,l){Tt(s,h,He({evt:e,isOwner:d,axis:r?"vertical":"horizontal",revert:i,dragRect:t,targetRect:o,canSort:p,fromSortable:u,target:a,completed:D,onMove:function(o,i){return ko(zt,n,It,t,o,pt(o),e,i)},changed:I},l))}function T(){E("dragOverAnimationCapture"),h.captureAnimationState(),h!==u&&u.captureAnimationState()}function D(t){return E("dragOverCompleted",{insertion:t}),t&&(d?c._hideClone():c._showClone(h),h!==u&&(at(It,Wt?Wt.options.ghostClass:c.options.ghostClass,!1),at(It,s.ghostClass,!0)),Wt!==h&&h!==$o.active?Wt=h:h===$o.active&&Wt&&(Wt=null),u===h&&(h._ignoreWhileAnimating=a),h.animateAll(function(){E("dragOverAnimationComplete"),h._ignoreWhileAnimating=null}),h!==u&&(u.animateAll(),u._ignoreWhileAnimating=null)),(a===It&&!It.animated||a===n&&!a.animated)&&(Jt=null),s.dragoverBubble||e.rootEl||a===document||(It.parentNode[$t]._isOutsideThisEl(e.target),!t&&wo(e)),!s.dragoverBubble&&e.stopPropagation&&e.stopPropagation(),m=!0}function I(){Ft=ft(It),Bt=ft(It,s.draggable),Dt({sortable:h,name:"change",toEl:n,newIndex:Ft,newDraggableIndex:Bt,originalEvent:e})}},_ignoreWhileAnimating:null,_offMoveEvents:function(){et(document,"mousemove",this._onTouchMove),et(document,"touchmove",this._onTouchMove),et(document,"pointermove",this._onTouchMove),et(document,"dragover",wo),et(document,"mousemove",wo),et(document,"touchmove",wo)},_offUpEvents:function(){var e=this.el.ownerDocument;et(e,"mouseup",this._onDrop),et(e,"touchend",this._onDrop),et(e,"pointerup",this._onDrop),et(e,"pointercancel",this._onDrop),et(e,"touchcancel",this._onDrop),et(document,"selectstart",this)},_onDrop:function(e){var t=this.el,o=this.options;Ft=ft(It),Bt=ft(It,o.draggable),Tt("drop",this,{evt:e}),Ot=It&&It.parentNode,Ft=ft(It),Bt=ft(It,o.draggable),$o.eventCanceled||(io=!1,so=!1,ao=!1,clearInterval(this._loopId),clearTimeout(this._dragStartTimer),Eo(this.cloneId),Eo(this._dragStartId),this.nativeDraggable&&(et(document,"drop",this),et(t,"dragstart",this._onDragStart)),this._offMoveEvents(),this._offUpEvents(),Ve&&st(document.body,"user-select",""),st(It,"transform",""),e&&(Zt&&(e.cancelable&&e.preventDefault(),!o.dropBubble&&e.stopPropagation()),Pt&&Pt.parentNode&&Pt.parentNode.removeChild(Pt),(zt===Ot||Wt&&"clone"!==Wt.lastPutMode)&&Rt&&Rt.parentNode&&Rt.parentNode.removeChild(Rt),It&&(this.nativeDraggable&&et(It,"dragend",this),So(It),It.style["will-change"]="",Zt&&!io&&at(It,Wt?Wt.options.ghostClass:this.options.ghostClass,!1),at(It,this.options.chosenClass,!1),Dt({sortable:this,name:"unchoose",toEl:Ot,newIndex:null,newDraggableIndex:null,originalEvent:e}),zt!==Ot?(Ft>=0&&(Dt({rootEl:Ot,name:"add",toEl:Ot,fromEl:zt,originalEvent:e}),Dt({sortable:this,name:"remove",toEl:Ot,originalEvent:e}),Dt({rootEl:Ot,name:"sort",toEl:Ot,fromEl:zt,originalEvent:e}),Dt({sortable:this,name:"sort",toEl:Ot,originalEvent:e})),Wt&&Wt.save()):Ft!==Ht&&Ft>=0&&(Dt({sortable:this,name:"update",toEl:Ot,originalEvent:e}),Dt({sortable:this,name:"sort",toEl:Ot,originalEvent:e})),$o.active&&(null!=Ft&&-1!==Ft||(Ft=Ht,Bt=Ut),Dt({sortable:this,name:"end",toEl:Ot,originalEvent:e}),this.save())))),this._nulling()},_nulling:function(){Tt("nulling",this),zt=It=Ot=Pt=Nt=Rt=jt=Lt=qt=Gt=Zt=Ft=Bt=Ht=Ut=Jt=eo=Wt=Yt=$o.dragged=$o.ghost=$o.clone=$o.active=null,po.forEach(function(e){e.checked=!0}),po.length=Xt=Vt=0},handleEvent:function(e){switch(e.type){case"drop":case"dragend":this._onDrop(e);break;case"dragenter":case"dragover":It&&(this._onDragOver(e),function(e){e.dataTransfer&&(e.dataTransfer.dropEffect="move");e.cancelable&&e.preventDefault()}(e));break;case"selectstart":e.preventDefault()}},toArray:function(){for(var e,t=[],o=this.el.children,i=0,r=o.length,n=this.options;i<r;i++)it(e=o[i],n.draggable,this.el,!1)&&t.push(e.getAttribute(n.dataIdAttr)||Ao(e));return t},sort:function(e,t){var o={},i=this.el;this.toArray().forEach(function(e,t){var r=i.children[t];it(r,this.options.draggable,i,!1)&&(o[e]=r)},this),t&&this.captureAnimationState(),e.forEach(function(e){o[e]&&(i.removeChild(o[e]),i.appendChild(o[e]))}),t&&this.animateAll()},save:function(){var e=this.options.store;e&&e.set&&e.set(this)},closest:function(e,t){return it(e,t||this.options.draggable,this.el,!1)},option:function(e,t){var o=this.options;if(void 0===t)return o[e];var i=At.modifyOption(this,e,t);o[e]=void 0!==i?i:t,"group"===e&&bo(o)},destroy:function(){Tt("destroy",this);var e=this.el;e[$t]=null,et(e,"mousedown",this._onTapStart),et(e,"touchstart",this._onTapStart),et(e,"pointerdown",this._onTapStart),this.nativeDraggable&&(et(e,"dragover",this),et(e,"dragenter",this)),Array.prototype.forEach.call(e.querySelectorAll("[draggable]"),function(e){e.removeAttribute("draggable")}),this._onDrop(),this._disableDelayedDragEvents(),no.splice(no.indexOf(this.el),1),this.el=e=null},_hideClone:function(){if(!Lt){if(Tt("hideClone",this),$o.eventCanceled)return;st(Rt,"display","none"),this.options.removeCloneOnHide&&Rt.parentNode&&Rt.parentNode.removeChild(Rt),Lt=!0}},_showClone:function(e){if("clone"===e.lastPutMode){if(Lt){if(Tt("showClone",this),$o.eventCanceled)return;It.parentNode!=zt||this.options.group.revertClone?Nt?zt.insertBefore(Rt,Nt):zt.appendChild(Rt):zt.insertBefore(Rt,It),this.options.group.revertClone&&this.animate(It,Rt),st(Rt,"display",""),Lt=!1}}else this._hideClone()}},uo&&Je(document,"touchmove",function(e){($o.active||io)&&e.cancelable&&e.preventDefault()}),$o.utils={on:Je,off:et,css:st,find:ct,is:function(e,t){return!!it(e,t,e,!1)},extend:function(e,t){if(e&&t)for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o]);return e},throttle:yt,closest:it,toggleClass:at,clone:wt,index:ft,nextTick:Mo,cancelNextTick:Eo,detectDirection:vo,getChild:ht,expando:$t},$o.get=function(e){return e[$t]},$o.mount=function(){for(var e=arguments.length,t=new Array(e),o=0;o<e;o++)t[o]=arguments[o];t[0].constructor===Array&&(t=t[0]),t.forEach(function(e){if(!e.prototype||!e.prototype.constructor)throw"Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(e));e.utils&&($o.utils=He(He({},$o.utils),e.utils)),At.mount(e)})},$o.create=function(e,t){return new $o(e,t)},$o.version="1.15.6";var To,Do,Io,Oo,Po,zo,No=[],jo=!1;function Ro(){No.forEach(function(e){clearInterval(e.pid)}),No=[]}function Lo(){clearInterval(zo)}var Ho=yt(function(e,t,o,i){if(t.scroll){var r,n=(e.touches?e.touches[0]:e).clientX,a=(e.touches?e.touches[0]:e).clientY,s=t.scrollSensitivity,l=t.scrollSpeed,c=dt(),d=!1;Do!==o&&(Do=o,Ro(),To=t.scroll,r=t.scrollFn,!0===To&&(To=vt(o,!0)));var p=0,u=To;do{var h=u,m=pt(h),f=m.top,g=m.bottom,v=m.left,b=m.right,y=m.width,x=m.height,w=void 0,_=void 0,$=h.scrollWidth,k=h.scrollHeight,S=st(h),C=h.scrollLeft,A=h.scrollTop;h===c?(w=y<$&&("auto"===S.overflowX||"scroll"===S.overflowX||"visible"===S.overflowX),_=x<k&&("auto"===S.overflowY||"scroll"===S.overflowY||"visible"===S.overflowY)):(w=y<$&&("auto"===S.overflowX||"scroll"===S.overflowX),_=x<k&&("auto"===S.overflowY||"scroll"===S.overflowY));var M=w&&(Math.abs(b-n)<=s&&C+y<$)-(Math.abs(v-n)<=s&&!!C),E=_&&(Math.abs(g-a)<=s&&A+x<k)-(Math.abs(f-a)<=s&&!!A);if(!No[p])for(var T=0;T<=p;T++)No[T]||(No[T]={});No[p].vx==M&&No[p].vy==E&&No[p].el===h||(No[p].el=h,No[p].vx=M,No[p].vy=E,clearInterval(No[p].pid),0==M&&0==E||(d=!0,No[p].pid=setInterval(function(){i&&0===this.layer&&$o.active._onTouchMove(Po);var t=No[this.layer].vy?No[this.layer].vy*l:0,o=No[this.layer].vx?No[this.layer].vx*l:0;"function"==typeof r&&"continue"!==r.call($o.dragged.parentNode[$t],o,t,e,Po,No[this.layer].el)||xt(No[this.layer].el,o,t)}.bind({layer:p}),24))),p++}while(t.bubbleScroll&&u!==c&&(u=vt(u,!1)));jo=d}},30),Fo=function(e){var t=e.originalEvent,o=e.putSortable,i=e.dragEl,r=e.activeSortable,n=e.dispatchSortableEvent,a=e.hideGhostForTarget,s=e.unhideGhostForTarget;if(t){var l=o||r;a();var c=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:t,d=document.elementFromPoint(c.clientX,c.clientY);s(),l&&!l.el.contains(d)&&(n("spill"),this.onSpill({dragEl:i,putSortable:o}))}};function Uo(){}function Bo(){}Uo.prototype={startIndex:null,dragStart:function(e){var t=e.oldDraggableIndex;this.startIndex=t},onSpill:function(e){var t=e.dragEl,o=e.putSortable;this.sortable.captureAnimationState(),o&&o.captureAnimationState();var i=ht(this.sortable.el,this.startIndex,this.options);i?this.sortable.el.insertBefore(t,i):this.sortable.el.appendChild(t),this.sortable.animateAll(),o&&o.animateAll()},drop:Fo},Be(Uo,{pluginName:"revertOnSpill"}),Bo.prototype={onSpill:function(e){var t=e.dragEl,o=e.putSortable||this.sortable;o.captureAnimationState(),t.parentNode&&t.parentNode.removeChild(t),o.animateAll()},drop:Fo},Be(Bo,{pluginName:"removeOnSpill"});$o.mount(new function(){function e(){for(var e in this.defaults={scroll:!0,forceAutoScrollFallback:!1,scrollSensitivity:30,scrollSpeed:10,bubbleScroll:!0},this)"_"===e.charAt(0)&&"function"==typeof this[e]&&(this[e]=this[e].bind(this))}return e.prototype={dragStarted:function(e){var t=e.originalEvent;this.sortable.nativeDraggable?Je(document,"dragover",this._handleAutoScroll):this.options.supportPointer?Je(document,"pointermove",this._handleFallbackAutoScroll):t.touches?Je(document,"touchmove",this._handleFallbackAutoScroll):Je(document,"mousemove",this._handleFallbackAutoScroll)},dragOverCompleted:function(e){var t=e.originalEvent;this.options.dragOverBubble||t.rootEl||this._handleAutoScroll(t)},drop:function(){this.sortable.nativeDraggable?et(document,"dragover",this._handleAutoScroll):(et(document,"pointermove",this._handleFallbackAutoScroll),et(document,"touchmove",this._handleFallbackAutoScroll),et(document,"mousemove",this._handleFallbackAutoScroll)),Lo(),Ro(),clearTimeout(rt),rt=void 0},nulling:function(){Po=Do=To=jo=zo=Io=Oo=null,No.length=0},_handleFallbackAutoScroll:function(e){this._handleAutoScroll(e,!0)},_handleAutoScroll:function(e,t){var o=this,i=(e.touches?e.touches[0]:e).clientX,r=(e.touches?e.touches[0]:e).clientY,n=document.elementFromPoint(i,r);if(Po=e,t||this.options.forceAutoScrollFallback||Ge||qe||Ve){Ho(e,this.options,n,t);var a=vt(n,!0);!jo||zo&&i===Io&&r===Oo||(zo&&Lo(),zo=setInterval(function(){var n=vt(document.elementFromPoint(i,r),!0);n!==a&&(a=n,Ro()),Ho(e,o.options,n,t)},10),Io=i,Oo=r)}else{if(!this.options.bubbleScroll||vt(n,!0)===dt())return void Ro();Ho(e,this.options,vt(n,!1),!1)}}},Be(e,{pluginName:"scroll",initializeByDefault:!0})}),$o.mount(Bo,Uo);const Yo=$o;var Wo=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};let qo=class extends ue{constructor(){super(...arguments),this._expandedSections=new Set(["card"]),this._sortableInstances=[]}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._destroySortables()}updated(){this._initSortables()}_destroySortables(){this._sortableInstances.forEach(e=>e.destroy()),this._sortableInstances=[]}_initSortables(){this._destroySortables();const e=this.shadowRoot?.querySelector(".mc-rows-container");e&&this._sortableInstances.push(Yo.create(e,{handle:".mc-drag-handle",animation:150,ghostClass:"mc-sortable-ghost",forceFallback:!0,fallbackOnBody:!1,draggable:".mc-row-item",onEnd:e=>{void 0!==e.oldIndex&&void 0!==e.newIndex&&this.stateManager.moveRow(e.oldIndex,e.newIndex)}})),this.shadowRoot?.querySelectorAll(".mc-modules-container").forEach(e=>{this._sortableInstances.push(Yo.create(e,{group:"modules",handle:".mc-module-drag",animation:150,ghostClass:"mc-sortable-ghost",forceFallback:!0,fallbackOnBody:!1,draggable:".mc-module-item",onEnd:e=>{const t=parseInt(e.from.getAttribute("data-row")||"0"),o=parseInt(e.from.getAttribute("data-col")||"0"),i=parseInt(e.to.getAttribute("data-row")||"0"),r=parseInt(e.to.getAttribute("data-col")||"0");void 0!==e.oldIndex&&void 0!==e.newIndex&&this.stateManager.moveModule(t,o,e.oldIndex,i,r,e.newIndex)}}))})}render(){if(!this._editorState)return X``;const{config:e,selectedPath:t}=this._editorState;return X`
      <div class="mc-form">
        ${this._renderCardSection(e)}
        <div class="mc-rows-container">
          ${e.rows.map((e,o)=>this._renderRow(e,o,t))}
        </div>
      </div>
    `}_renderCardSection(e){const t=this._expandedSections.has("card");return X`
      <div class="mc-card-section">
        <div
          class="mc-card-section-header"
          @click=${()=>this._toggleSection("card")}
        >
          <ha-icon icon="mdi:card-outline" style="--mdc-icon-size:18px"></ha-icon>
          Card Settings
          <span class="mc-chevron ${t?"open":""}">&#9654;</span>
        </div>
        ${t?X`
              <div class="mc-card-section-body">
                ${je("Background",e.background,t=>this.stateManager.updateConfig({...e,background:t}))}
                ${Re("Border Radius",e.border_radius,t=>this.stateManager.updateConfig({...e,border_radius:t}))}
                ${Re("Padding",e.padding,t=>this.stateManager.updateConfig({...e,padding:t}))}
                ${Ie("Box Shadow",e.box_shadow,t=>this.stateManager.updateConfig({...e,box_shadow:t}))}
                ${Re("Card Height",e.card_height,t=>this.stateManager.updateConfig({...e,card_height:t}))}
              </div>
            `:K}
      </div>
    `}_renderRow(e,t,o){return X`
      <div class="mc-row-item" data-row="${t}">
        <div class="mc-row-header">
          <span class="mc-drag-handle" title="Drag to reorder">
            <ha-icon icon="mdi:drag" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          <span class="mc-label">Row ${t+1}</span>
          <div class="mc-row-layout-select">
            ${Pe("",e.layout,[{label:"1 Col",value:"1"},{label:"1-1",value:"1-1"},{label:"1-2",value:"1-2"},{label:"2-1",value:"2-1"},{label:"1-1-1",value:"1-1-1"}],e=>this.stateManager.updateRow(t,{layout:e}))}
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
        <div class="mc-row-body">
          ${e.columns.map((e,i)=>this._renderColumn(e,t,i,o))}
        </div>
      </div>
    `}_renderColumn(e,t,o,i){const r=this._editorState?.config.rows[t],n=r&&r.columns.length>1;return X`
      <div class="mc-col-item">
        <div class="mc-col-header">
          <ha-icon icon="mdi:view-column" style="--mdc-icon-size:14px"></ha-icon>
          <span class="mc-label">Column ${o+1}</span>
          ${n?X`
            <button
              class="mc-btn-icon mc-btn-small"
              @click=${()=>this.stateManager.deleteColumn(t,o)}
              title="Delete column"
            >
              <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
            </button>
          `:K}
        </div>
        <div class="mc-modules-container" data-row="${t}" data-col="${o}">
          ${e.modules.map((e,r)=>{const n=i?.rowIndex===t&&i?.columnIndex===o&&i?.moduleIndex===r,a=xe.get(e.type);return X`
              <div
                class="mc-module-item ${n?"selected":""}"
                @click=${()=>this.stateManager.setSelectedPath({rowIndex:t,columnIndex:o,moduleIndex:r})}
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
                  @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,o,r)}}
                  title="Delete module"
                >
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
                </button>
              </div>
            `})}
        </div>
        <button
          class="mc-add-module-btn"
          @click=${()=>this.dispatchEvent(new CustomEvent("add-module",{bubbles:!0,composed:!0,detail:{rowIndex:t,colIndex:o}}))}
        >
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
          Add Module
        </button>
      </div>
    `}_toggleSection(e){this._expandedSections.has(e)?this._expandedSections.delete(e):this._expandedSections.add(e),this.requestUpdate()}};function Go(e){return null==e}qo.styles=[Ae,De],Wo([ve({attribute:!1})],qo.prototype,"stateManager",void 0),Wo([ve({attribute:!1})],qo.prototype,"hass",void 0),Wo([be()],qo.prototype,"_editorState",void 0),Wo([be()],qo.prototype,"_expandedSections",void 0),qo=Wo([me("mc-form-editor")],qo);var Xo=function(e,t){var o,i,r,n;if(t)for(o=0,i=(n=Object.keys(t)).length;o<i;o+=1)e[r=n[o]]=t[r];return e},Vo={isNothing:Go,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:Go(e)?[]:[e]},repeat:function(e,t){var o,i="";for(o=0;o<t;o+=1)i+=e;return i},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:Xo};function Ko(e,t){var o="",i=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(o+='in "'+e.mark.name+'" '),o+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(o+="\n\n"+e.mark.snippet),i+" "+o):i}function Qo(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=Ko(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}Qo.prototype=Object.create(Error.prototype),Qo.prototype.constructor=Qo,Qo.prototype.toString=function(e){return this.name+": "+Ko(this,e)};var Zo=Qo;function Jo(e,t,o,i,r){var n="",a="",s=Math.floor(r/2)-1;return i-t>s&&(t=i-s+(n=" ... ").length),o-i>s&&(o=i+s-(a=" ...").length),{str:n+e.slice(t,o).replace(/\t/g,"→")+a,pos:i-t+n.length}}function ei(e,t){return Vo.repeat(" ",t-e.length)+e}var ti=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var o,i=/\r?\n|\r|\0/g,r=[0],n=[],a=-1;o=i.exec(e.buffer);)n.push(o.index),r.push(o.index+o[0].length),e.position<=o.index&&a<0&&(a=r.length-2);a<0&&(a=r.length-1);var s,l,c="",d=Math.min(e.line+t.linesAfter,n.length).toString().length,p=t.maxLength-(t.indent+d+3);for(s=1;s<=t.linesBefore&&!(a-s<0);s++)l=Jo(e.buffer,r[a-s],n[a-s],e.position-(r[a]-r[a-s]),p),c=Vo.repeat(" ",t.indent)+ei((e.line-s+1).toString(),d)+" | "+l.str+"\n"+c;for(l=Jo(e.buffer,r[a],n[a],e.position,p),c+=Vo.repeat(" ",t.indent)+ei((e.line+1).toString(),d)+" | "+l.str+"\n",c+=Vo.repeat("-",t.indent+d+3+l.pos)+"^\n",s=1;s<=t.linesAfter&&!(a+s>=n.length);s++)l=Jo(e.buffer,r[a+s],n[a+s],e.position-(r[a]-r[a+s]),p),c+=Vo.repeat(" ",t.indent)+ei((e.line+s+1).toString(),d)+" | "+l.str+"\n";return c.replace(/\n$/,"")},oi=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],ii=["scalar","sequence","mapping"];var ri=function(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===oi.indexOf(t))throw new Zo('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=function(e){var t={};return null!==e&&Object.keys(e).forEach(function(o){e[o].forEach(function(e){t[String(e)]=o})}),t}(t.styleAliases||null),-1===ii.indexOf(this.kind))throw new Zo('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')};function ni(e,t){var o=[];return e[t].forEach(function(e){var t=o.length;o.forEach(function(o,i){o.tag===e.tag&&o.kind===e.kind&&o.multi===e.multi&&(t=i)}),o[t]=e}),o}function ai(e){return this.extend(e)}ai.prototype.extend=function(e){var t=[],o=[];if(e instanceof ri)o.push(e);else if(Array.isArray(e))o=o.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new Zo("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(o=o.concat(e.explicit))}t.forEach(function(e){if(!(e instanceof ri))throw new Zo("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new Zo("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new Zo("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),o.forEach(function(e){if(!(e instanceof ri))throw new Zo("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(ai.prototype);return i.implicit=(this.implicit||[]).concat(t),i.explicit=(this.explicit||[]).concat(o),i.compiledImplicit=ni(i,"implicit"),i.compiledExplicit=ni(i,"explicit"),i.compiledTypeMap=function(){var e,t,o={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function i(e){e.multi?(o.multi[e.kind].push(e),o.multi.fallback.push(e)):o[e.kind][e.tag]=o.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(i);return o}(i.compiledImplicit,i.compiledExplicit),i};var si=ai,li=new ri("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),ci=new ri("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),di=new ri("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),pi=new si({explicit:[li,ci,di]});var ui=new ri("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});var hi=new ri("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function mi(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function fi(e){return 48<=e&&e<=55}function gi(e){return 48<=e&&e<=57}var vi=new ri("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,o=e.length,i=0,r=!1;if(!o)return!1;if("-"!==(t=e[i])&&"+"!==t||(t=e[++i]),"0"===t){if(i+1===o)return!0;if("b"===(t=e[++i])){for(i++;i<o;i++)if("_"!==(t=e[i])){if("0"!==t&&"1"!==t)return!1;r=!0}return r&&"_"!==t}if("x"===t){for(i++;i<o;i++)if("_"!==(t=e[i])){if(!mi(e.charCodeAt(i)))return!1;r=!0}return r&&"_"!==t}if("o"===t){for(i++;i<o;i++)if("_"!==(t=e[i])){if(!fi(e.charCodeAt(i)))return!1;r=!0}return r&&"_"!==t}}if("_"===t)return!1;for(;i<o;i++)if("_"!==(t=e[i])){if(!gi(e.charCodeAt(i)))return!1;r=!0}return!(!r||"_"===t)},construct:function(e){var t,o=e,i=1;if(-1!==o.indexOf("_")&&(o=o.replace(/_/g,"")),"-"!==(t=o[0])&&"+"!==t||("-"===t&&(i=-1),t=(o=o.slice(1))[0]),"0"===o)return 0;if("0"===t){if("b"===o[1])return i*parseInt(o.slice(2),2);if("x"===o[1])return i*parseInt(o.slice(2),16);if("o"===o[1])return i*parseInt(o.slice(2),8)}return i*parseInt(o,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!Vo.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),bi=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var yi=/^[-+]?[0-9]+e/;var xi=new ri("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!bi.test(e)||"_"===e[e.length-1])},construct:function(e){var t,o;return o="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===o?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:o*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||Vo.isNegativeZero(e))},represent:function(e,t){var o;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(Vo.isNegativeZero(e))return"-0.0";return o=e.toString(10),yi.test(o)?o.replace("e",".e"):o},defaultStyle:"lowercase"}),wi=pi.extend({implicit:[ui,hi,vi,xi]}),_i=wi,$i=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),ki=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");var Si=new ri("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==$i.exec(e)||null!==ki.exec(e))},construct:function(e){var t,o,i,r,n,a,s,l,c=0,d=null;if(null===(t=$i.exec(e))&&(t=ki.exec(e)),null===t)throw new Error("Date resolve error");if(o=+t[1],i=+t[2]-1,r=+t[3],!t[4])return new Date(Date.UTC(o,i,r));if(n=+t[4],a=+t[5],s=+t[6],t[7]){for(c=t[7].slice(0,3);c.length<3;)c+="0";c=+c}return t[9]&&(d=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(d=-d)),l=new Date(Date.UTC(o,i,r,n,a,s,c)),d&&l.setTime(l.getTime()-d),l},instanceOf:Date,represent:function(e){return e.toISOString()}});var Ci=new ri("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),Ai="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";var Mi=new ri("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,o,i=0,r=e.length,n=Ai;for(o=0;o<r;o++)if(!((t=n.indexOf(e.charAt(o)))>64)){if(t<0)return!1;i+=6}return i%8==0},construct:function(e){var t,o,i=e.replace(/[\r\n=]/g,""),r=i.length,n=Ai,a=0,s=[];for(t=0;t<r;t++)t%4==0&&t&&(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)),a=a<<6|n.indexOf(i.charAt(t));return 0===(o=r%4*6)?(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)):18===o?(s.push(a>>10&255),s.push(a>>2&255)):12===o&&s.push(a>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,o,i="",r=0,n=e.length,a=Ai;for(t=0;t<n;t++)t%3==0&&t&&(i+=a[r>>18&63],i+=a[r>>12&63],i+=a[r>>6&63],i+=a[63&r]),r=(r<<8)+e[t];return 0===(o=n%3)?(i+=a[r>>18&63],i+=a[r>>12&63],i+=a[r>>6&63],i+=a[63&r]):2===o?(i+=a[r>>10&63],i+=a[r>>4&63],i+=a[r<<2&63],i+=a[64]):1===o&&(i+=a[r>>2&63],i+=a[r<<4&63],i+=a[64],i+=a[64]),i}}),Ei=Object.prototype.hasOwnProperty,Ti=Object.prototype.toString;var Di=new ri("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,o,i,r,n,a=[],s=e;for(t=0,o=s.length;t<o;t+=1){if(i=s[t],n=!1,"[object Object]"!==Ti.call(i))return!1;for(r in i)if(Ei.call(i,r)){if(n)return!1;n=!0}if(!n)return!1;if(-1!==a.indexOf(r))return!1;a.push(r)}return!0},construct:function(e){return null!==e?e:[]}}),Ii=Object.prototype.toString;var Oi=new ri("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,o,i,r,n,a=e;for(n=new Array(a.length),t=0,o=a.length;t<o;t+=1){if(i=a[t],"[object Object]"!==Ii.call(i))return!1;if(1!==(r=Object.keys(i)).length)return!1;n[t]=[r[0],i[r[0]]]}return!0},construct:function(e){if(null===e)return[];var t,o,i,r,n,a=e;for(n=new Array(a.length),t=0,o=a.length;t<o;t+=1)i=a[t],r=Object.keys(i),n[t]=[r[0],i[r[0]]];return n}}),Pi=Object.prototype.hasOwnProperty;var zi=new ri("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,o=e;for(t in o)if(Pi.call(o,t)&&null!==o[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),Ni=_i.extend({implicit:[Si,Ci],explicit:[Mi,Di,Oi,zi]}),ji=Object.prototype.hasOwnProperty,Ri=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Li=/[\x85\u2028\u2029]/,Hi=/[,\[\]\{\}]/,Fi=/^(?:!|!!|![a-z\-]+!)$/i,Ui=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Bi(e){return Object.prototype.toString.call(e)}function Yi(e){return 10===e||13===e}function Wi(e){return 9===e||32===e}function qi(e){return 9===e||32===e||10===e||13===e}function Gi(e){return 44===e||91===e||93===e||123===e||125===e}function Xi(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function Vi(e){return 120===e?2:117===e?4:85===e?8:0}function Ki(e){return 48<=e&&e<=57?e-48:-1}function Qi(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function Zi(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function Ji(e,t,o){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:o}):e[t]=o}for(var er=new Array(256),tr=new Array(256),or=0;or<256;or++)er[or]=Qi(or)?1:0,tr[or]=Qi(or);function ir(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||Ni,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function rr(e,t){var o={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return o.snippet=ti(o),new Zo(t,o)}function nr(e,t){throw rr(e,t)}function ar(e,t){e.onWarning&&e.onWarning.call(null,rr(e,t))}var sr={YAML:function(e,t,o){var i,r,n;null!==e.version&&nr(e,"duplication of %YAML directive"),1!==o.length&&nr(e,"YAML directive accepts exactly one argument"),null===(i=/^([0-9]+)\.([0-9]+)$/.exec(o[0]))&&nr(e,"ill-formed argument of the YAML directive"),r=parseInt(i[1],10),n=parseInt(i[2],10),1!==r&&nr(e,"unacceptable YAML version of the document"),e.version=o[0],e.checkLineBreaks=n<2,1!==n&&2!==n&&ar(e,"unsupported YAML version of the document")},TAG:function(e,t,o){var i,r;2!==o.length&&nr(e,"TAG directive accepts exactly two arguments"),i=o[0],r=o[1],Fi.test(i)||nr(e,"ill-formed tag handle (first argument) of the TAG directive"),ji.call(e.tagMap,i)&&nr(e,'there is a previously declared suffix for "'+i+'" tag handle'),Ui.test(r)||nr(e,"ill-formed tag prefix (second argument) of the TAG directive");try{r=decodeURIComponent(r)}catch(t){nr(e,"tag prefix is malformed: "+r)}e.tagMap[i]=r}};function lr(e,t,o,i){var r,n,a,s;if(t<o){if(s=e.input.slice(t,o),i)for(r=0,n=s.length;r<n;r+=1)9===(a=s.charCodeAt(r))||32<=a&&a<=1114111||nr(e,"expected valid JSON character");else Ri.test(s)&&nr(e,"the stream contains non-printable characters");e.result+=s}}function cr(e,t,o,i){var r,n,a,s;for(Vo.isObject(o)||nr(e,"cannot merge mappings; the provided source object is unacceptable"),a=0,s=(r=Object.keys(o)).length;a<s;a+=1)n=r[a],ji.call(t,n)||(Ji(t,n,o[n]),i[n]=!0)}function dr(e,t,o,i,r,n,a,s,l){var c,d;if(Array.isArray(r))for(c=0,d=(r=Array.prototype.slice.call(r)).length;c<d;c+=1)Array.isArray(r[c])&&nr(e,"nested arrays are not supported inside keys"),"object"==typeof r&&"[object Object]"===Bi(r[c])&&(r[c]="[object Object]");if("object"==typeof r&&"[object Object]"===Bi(r)&&(r="[object Object]"),r=String(r),null===t&&(t={}),"tag:yaml.org,2002:merge"===i)if(Array.isArray(n))for(c=0,d=n.length;c<d;c+=1)cr(e,t,n[c],o);else cr(e,t,n,o);else e.json||ji.call(o,r)||!ji.call(t,r)||(e.line=a||e.line,e.lineStart=s||e.lineStart,e.position=l||e.position,nr(e,"duplicated mapping key")),Ji(t,r,n),delete o[r];return t}function pr(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):nr(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function ur(e,t,o){for(var i=0,r=e.input.charCodeAt(e.position);0!==r;){for(;Wi(r);)9===r&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),r=e.input.charCodeAt(++e.position);if(t&&35===r)do{r=e.input.charCodeAt(++e.position)}while(10!==r&&13!==r&&0!==r);if(!Yi(r))break;for(pr(e),r=e.input.charCodeAt(e.position),i++,e.lineIndent=0;32===r;)e.lineIndent++,r=e.input.charCodeAt(++e.position)}return-1!==o&&0!==i&&e.lineIndent<o&&ar(e,"deficient indentation"),i}function hr(e){var t,o=e.position;return!(45!==(t=e.input.charCodeAt(o))&&46!==t||t!==e.input.charCodeAt(o+1)||t!==e.input.charCodeAt(o+2)||(o+=3,0!==(t=e.input.charCodeAt(o))&&!qi(t)))}function mr(e,t){1===t?e.result+=" ":t>1&&(e.result+=Vo.repeat("\n",t-1))}function fr(e,t){var o,i,r=e.tag,n=e.anchor,a=[],s=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),i=e.input.charCodeAt(e.position);0!==i&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,nr(e,"tab characters must not be used in indentation")),45===i)&&qi(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,ur(e,!0,-1)&&e.lineIndent<=t)a.push(null),i=e.input.charCodeAt(e.position);else if(o=e.line,br(e,t,3,!1,!0),a.push(e.result),ur(e,!0,-1),i=e.input.charCodeAt(e.position),(e.line===o||e.lineIndent>t)&&0!==i)nr(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=r,e.anchor=n,e.kind="sequence",e.result=a,!0)}function gr(e){var t,o,i,r,n=!1,a=!1;if(33!==(r=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&nr(e,"duplication of a tag property"),60===(r=e.input.charCodeAt(++e.position))?(n=!0,r=e.input.charCodeAt(++e.position)):33===r?(a=!0,o="!!",r=e.input.charCodeAt(++e.position)):o="!",t=e.position,n){do{r=e.input.charCodeAt(++e.position)}while(0!==r&&62!==r);e.position<e.length?(i=e.input.slice(t,e.position),r=e.input.charCodeAt(++e.position)):nr(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==r&&!qi(r);)33===r&&(a?nr(e,"tag suffix cannot contain exclamation marks"):(o=e.input.slice(t-1,e.position+1),Fi.test(o)||nr(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),r=e.input.charCodeAt(++e.position);i=e.input.slice(t,e.position),Hi.test(i)&&nr(e,"tag suffix cannot contain flow indicator characters")}i&&!Ui.test(i)&&nr(e,"tag name cannot contain such characters: "+i);try{i=decodeURIComponent(i)}catch(t){nr(e,"tag name is malformed: "+i)}return n?e.tag=i:ji.call(e.tagMap,o)?e.tag=e.tagMap[o]+i:"!"===o?e.tag="!"+i:"!!"===o?e.tag="tag:yaml.org,2002:"+i:nr(e,'undeclared tag handle "'+o+'"'),!0}function vr(e){var t,o;if(38!==(o=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&nr(e,"duplication of an anchor property"),o=e.input.charCodeAt(++e.position),t=e.position;0!==o&&!qi(o)&&!Gi(o);)o=e.input.charCodeAt(++e.position);return e.position===t&&nr(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function br(e,t,o,i,r){var n,a,s,l,c,d,p,u,h,m=1,f=!1,g=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,n=a=s=4===o||3===o,i&&ur(e,!0,-1)&&(f=!0,e.lineIndent>t?m=1:e.lineIndent===t?m=0:e.lineIndent<t&&(m=-1)),1===m)for(;gr(e)||vr(e);)ur(e,!0,-1)?(f=!0,s=n,e.lineIndent>t?m=1:e.lineIndent===t?m=0:e.lineIndent<t&&(m=-1)):s=!1;if(s&&(s=f||r),1!==m&&4!==o||(u=1===o||2===o?t:t+1,h=e.position-e.lineStart,1===m?s&&(fr(e,h)||function(e,t,o){var i,r,n,a,s,l,c,d=e.tag,p=e.anchor,u={},h=Object.create(null),m=null,f=null,g=null,v=!1,b=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=u),c=e.input.charCodeAt(e.position);0!==c;){if(v||-1===e.firstTabInLine||(e.position=e.firstTabInLine,nr(e,"tab characters must not be used in indentation")),i=e.input.charCodeAt(e.position+1),n=e.line,63!==c&&58!==c||!qi(i)){if(a=e.line,s=e.lineStart,l=e.position,!br(e,o,2,!1,!0))break;if(e.line===n){for(c=e.input.charCodeAt(e.position);Wi(c);)c=e.input.charCodeAt(++e.position);if(58===c)qi(c=e.input.charCodeAt(++e.position))||nr(e,"a whitespace character is expected after the key-value separator within a block mapping"),v&&(dr(e,u,h,m,f,null,a,s,l),m=f=g=null),b=!0,v=!1,r=!1,m=e.tag,f=e.result;else{if(!b)return e.tag=d,e.anchor=p,!0;nr(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!b)return e.tag=d,e.anchor=p,!0;nr(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===c?(v&&(dr(e,u,h,m,f,null,a,s,l),m=f=g=null),b=!0,v=!0,r=!0):v?(v=!1,r=!0):nr(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,c=i;if((e.line===n||e.lineIndent>t)&&(v&&(a=e.line,s=e.lineStart,l=e.position),br(e,t,4,!0,r)&&(v?f=e.result:g=e.result),v||(dr(e,u,h,m,f,g,a,s,l),m=f=g=null),ur(e,!0,-1),c=e.input.charCodeAt(e.position)),(e.line===n||e.lineIndent>t)&&0!==c)nr(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return v&&dr(e,u,h,m,f,null,a,s,l),b&&(e.tag=d,e.anchor=p,e.kind="mapping",e.result=u),b}(e,h,u))||function(e,t){var o,i,r,n,a,s,l,c,d,p,u,h,m=!0,f=e.tag,g=e.anchor,v=Object.create(null);if(91===(h=e.input.charCodeAt(e.position)))a=93,c=!1,n=[];else{if(123!==h)return!1;a=125,c=!0,n={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=n),h=e.input.charCodeAt(++e.position);0!==h;){if(ur(e,!0,t),(h=e.input.charCodeAt(e.position))===a)return e.position++,e.tag=f,e.anchor=g,e.kind=c?"mapping":"sequence",e.result=n,!0;m?44===h&&nr(e,"expected the node content, but found ','"):nr(e,"missed comma between flow collection entries"),u=null,s=l=!1,63===h&&qi(e.input.charCodeAt(e.position+1))&&(s=l=!0,e.position++,ur(e,!0,t)),o=e.line,i=e.lineStart,r=e.position,br(e,t,1,!1,!0),p=e.tag,d=e.result,ur(e,!0,t),h=e.input.charCodeAt(e.position),!l&&e.line!==o||58!==h||(s=!0,h=e.input.charCodeAt(++e.position),ur(e,!0,t),br(e,t,1,!1,!0),u=e.result),c?dr(e,n,v,p,d,u,o,i,r):s?n.push(dr(e,null,v,p,d,u,o,i,r)):n.push(d),ur(e,!0,t),44===(h=e.input.charCodeAt(e.position))?(m=!0,h=e.input.charCodeAt(++e.position)):m=!1}nr(e,"unexpected end of the stream within a flow collection")}(e,u)?g=!0:(a&&function(e,t){var o,i,r,n,a=1,s=!1,l=!1,c=t,d=0,p=!1;if(124===(n=e.input.charCodeAt(e.position)))i=!1;else{if(62!==n)return!1;i=!0}for(e.kind="scalar",e.result="";0!==n;)if(43===(n=e.input.charCodeAt(++e.position))||45===n)1===a?a=43===n?3:2:nr(e,"repeat of a chomping mode identifier");else{if(!((r=Ki(n))>=0))break;0===r?nr(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):l?nr(e,"repeat of an indentation width identifier"):(c=t+r-1,l=!0)}if(Wi(n)){do{n=e.input.charCodeAt(++e.position)}while(Wi(n));if(35===n)do{n=e.input.charCodeAt(++e.position)}while(!Yi(n)&&0!==n)}for(;0!==n;){for(pr(e),e.lineIndent=0,n=e.input.charCodeAt(e.position);(!l||e.lineIndent<c)&&32===n;)e.lineIndent++,n=e.input.charCodeAt(++e.position);if(!l&&e.lineIndent>c&&(c=e.lineIndent),Yi(n))d++;else{if(e.lineIndent<c){3===a?e.result+=Vo.repeat("\n",s?1+d:d):1===a&&s&&(e.result+="\n");break}for(i?Wi(n)?(p=!0,e.result+=Vo.repeat("\n",s?1+d:d)):p?(p=!1,e.result+=Vo.repeat("\n",d+1)):0===d?s&&(e.result+=" "):e.result+=Vo.repeat("\n",d):e.result+=Vo.repeat("\n",s?1+d:d),s=!0,l=!0,d=0,o=e.position;!Yi(n)&&0!==n;)n=e.input.charCodeAt(++e.position);lr(e,o,e.position,!1)}}return!0}(e,u)||function(e,t){var o,i,r;if(39!==(o=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(o=e.input.charCodeAt(e.position));)if(39===o){if(lr(e,i,e.position,!0),39!==(o=e.input.charCodeAt(++e.position)))return!0;i=e.position,e.position++,r=e.position}else Yi(o)?(lr(e,i,r,!0),mr(e,ur(e,!1,t)),i=r=e.position):e.position===e.lineStart&&hr(e)?nr(e,"unexpected end of the document within a single quoted scalar"):(e.position++,r=e.position);nr(e,"unexpected end of the stream within a single quoted scalar")}(e,u)||function(e,t){var o,i,r,n,a,s;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,o=i=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return lr(e,o,e.position,!0),e.position++,!0;if(92===s){if(lr(e,o,e.position,!0),Yi(s=e.input.charCodeAt(++e.position)))ur(e,!1,t);else if(s<256&&er[s])e.result+=tr[s],e.position++;else if((a=Vi(s))>0){for(r=a,n=0;r>0;r--)(a=Xi(s=e.input.charCodeAt(++e.position)))>=0?n=(n<<4)+a:nr(e,"expected hexadecimal character");e.result+=Zi(n),e.position++}else nr(e,"unknown escape sequence");o=i=e.position}else Yi(s)?(lr(e,o,i,!0),mr(e,ur(e,!1,t)),o=i=e.position):e.position===e.lineStart&&hr(e)?nr(e,"unexpected end of the document within a double quoted scalar"):(e.position++,i=e.position)}nr(e,"unexpected end of the stream within a double quoted scalar")}(e,u)?g=!0:!function(e){var t,o,i;if(42!==(i=e.input.charCodeAt(e.position)))return!1;for(i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!qi(i)&&!Gi(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&nr(e,"name of an alias node must contain at least one character"),o=e.input.slice(t,e.position),ji.call(e.anchorMap,o)||nr(e,'unidentified alias "'+o+'"'),e.result=e.anchorMap[o],ur(e,!0,-1),!0}(e)?function(e,t,o){var i,r,n,a,s,l,c,d,p=e.kind,u=e.result;if(qi(d=e.input.charCodeAt(e.position))||Gi(d)||35===d||38===d||42===d||33===d||124===d||62===d||39===d||34===d||37===d||64===d||96===d)return!1;if((63===d||45===d)&&(qi(i=e.input.charCodeAt(e.position+1))||o&&Gi(i)))return!1;for(e.kind="scalar",e.result="",r=n=e.position,a=!1;0!==d;){if(58===d){if(qi(i=e.input.charCodeAt(e.position+1))||o&&Gi(i))break}else if(35===d){if(qi(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&hr(e)||o&&Gi(d))break;if(Yi(d)){if(s=e.line,l=e.lineStart,c=e.lineIndent,ur(e,!1,-1),e.lineIndent>=t){a=!0,d=e.input.charCodeAt(e.position);continue}e.position=n,e.line=s,e.lineStart=l,e.lineIndent=c;break}}a&&(lr(e,r,n,!1),mr(e,e.line-s),r=n=e.position,a=!1),Wi(d)||(n=e.position+1),d=e.input.charCodeAt(++e.position)}return lr(e,r,n,!1),!!e.result||(e.kind=p,e.result=u,!1)}(e,u,1===o)&&(g=!0,null===e.tag&&(e.tag="?")):(g=!0,null===e.tag&&null===e.anchor||nr(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===m&&(g=s&&fr(e,h))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&nr(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),l=0,c=e.implicitTypes.length;l<c;l+=1)if((p=e.implicitTypes[l]).resolve(e.result)){e.result=p.construct(e.result),e.tag=p.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(ji.call(e.typeMap[e.kind||"fallback"],e.tag))p=e.typeMap[e.kind||"fallback"][e.tag];else for(p=null,l=0,c=(d=e.typeMap.multi[e.kind||"fallback"]).length;l<c;l+=1)if(e.tag.slice(0,d[l].tag.length)===d[l].tag){p=d[l];break}p||nr(e,"unknown tag !<"+e.tag+">"),null!==e.result&&p.kind!==e.kind&&nr(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+p.kind+'", not "'+e.kind+'"'),p.resolve(e.result,e.tag)?(e.result=p.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):nr(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||g}function yr(e){var t,o,i,r,n=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(r=e.input.charCodeAt(e.position))&&(ur(e,!0,-1),r=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==r));){for(a=!0,r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!qi(r);)r=e.input.charCodeAt(++e.position);for(i=[],(o=e.input.slice(t,e.position)).length<1&&nr(e,"directive name must not be less than one character in length");0!==r;){for(;Wi(r);)r=e.input.charCodeAt(++e.position);if(35===r){do{r=e.input.charCodeAt(++e.position)}while(0!==r&&!Yi(r));break}if(Yi(r))break;for(t=e.position;0!==r&&!qi(r);)r=e.input.charCodeAt(++e.position);i.push(e.input.slice(t,e.position))}0!==r&&pr(e),ji.call(sr,o)?sr[o](e,o,i):ar(e,'unknown document directive "'+o+'"')}ur(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,ur(e,!0,-1)):a&&nr(e,"directives end mark is expected"),br(e,e.lineIndent-1,4,!1,!0),ur(e,!0,-1),e.checkLineBreaks&&Li.test(e.input.slice(n,e.position))&&ar(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&hr(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,ur(e,!0,-1)):e.position<e.length-1&&nr(e,"end of the stream or a document separator is expected")}function xr(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var o=new ir(e,t),i=e.indexOf("\0");for(-1!==i&&(o.position=i,nr(o,"null byte is not allowed in input")),o.input+="\0";32===o.input.charCodeAt(o.position);)o.lineIndent+=1,o.position+=1;for(;o.position<o.length-1;)yr(o);return o.documents}var wr=function(e,t,o){null!==t&&"object"==typeof t&&void 0===o&&(o=t,t=null);var i=xr(e,o);if("function"!=typeof t)return i;for(var r=0,n=i.length;r<n;r+=1)t(i[r])},_r={loadAll:wr,load:function(e,t){var o=xr(e,t);if(0!==o.length){if(1===o.length)return o[0];throw new Zo("expected a single document in the stream, but found more")}}},$r=Object.prototype.toString,kr=Object.prototype.hasOwnProperty,Sr=65279,Cr={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},Ar=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Mr=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function Er(e){var t,o,i;if(t=e.toString(16).toUpperCase(),e<=255)o="x",i=2;else if(e<=65535)o="u",i=4;else{if(!(e<=4294967295))throw new Zo("code point within a string may not be greater than 0xFFFFFFFF");o="U",i=8}return"\\"+o+Vo.repeat("0",i-t.length)+t}function Tr(e){this.schema=e.schema||Ni,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=Vo.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var o,i,r,n,a,s,l;if(null===t)return{};for(o={},r=0,n=(i=Object.keys(t)).length;r<n;r+=1)a=i[r],s=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(l=e.compiledTypeMap.fallback[a])&&kr.call(l.styleAliases,s)&&(s=l.styleAliases[s]),o[a]=s;return o}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Dr(e,t){for(var o,i=Vo.repeat(" ",t),r=0,n=-1,a="",s=e.length;r<s;)-1===(n=e.indexOf("\n",r))?(o=e.slice(r),r=s):(o=e.slice(r,n+1),r=n+1),o.length&&"\n"!==o&&(a+=i),a+=o;return a}function Ir(e,t){return"\n"+Vo.repeat(" ",e.indent*t)}function Or(e){return 32===e||9===e}function Pr(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&e!==Sr||65536<=e&&e<=1114111}function zr(e){return Pr(e)&&e!==Sr&&13!==e&&10!==e}function Nr(e,t,o){var i=zr(e),r=i&&!Or(e);return(o?i:i&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!r)||zr(t)&&!Or(t)&&35===e||58===t&&r}function jr(e,t){var o,i=e.charCodeAt(t);return i>=55296&&i<=56319&&t+1<e.length&&(o=e.charCodeAt(t+1))>=56320&&o<=57343?1024*(i-55296)+o-56320+65536:i}function Rr(e){return/^\n* /.test(e)}function Lr(e,t,o,i,r,n,a,s){var l,c=0,d=null,p=!1,u=!1,h=-1!==i,m=-1,f=function(e){return Pr(e)&&e!==Sr&&!Or(e)&&45!==e&&63!==e&&58!==e&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e&&35!==e&&38!==e&&42!==e&&33!==e&&124!==e&&61!==e&&62!==e&&39!==e&&34!==e&&37!==e&&64!==e&&96!==e}(jr(e,0))&&function(e){return!Or(e)&&58!==e}(jr(e,e.length-1));if(t||a)for(l=0;l<e.length;c>=65536?l+=2:l++){if(!Pr(c=jr(e,l)))return 5;f=f&&Nr(c,d,s),d=c}else{for(l=0;l<e.length;c>=65536?l+=2:l++){if(10===(c=jr(e,l)))p=!0,h&&(u=u||l-m-1>i&&" "!==e[m+1],m=l);else if(!Pr(c))return 5;f=f&&Nr(c,d,s),d=c}u=u||h&&l-m-1>i&&" "!==e[m+1]}return p||u?o>9&&Rr(e)?5:a?2===n?5:2:u?4:3:!f||a||r(e)?2===n?5:2:1}function Hr(e,t,o,i,r){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==Ar.indexOf(t)||Mr.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var n=e.indent*Math.max(1,o),a=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-n),s=i||e.flowLevel>-1&&o>=e.flowLevel;switch(Lr(t,s,e.indent,a,function(t){return function(e,t){var o,i;for(o=0,i=e.implicitTypes.length;o<i;o+=1)if(e.implicitTypes[o].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!i,r)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+Fr(t,e.indent)+Ur(Dr(t,n));case 4:return">"+Fr(t,e.indent)+Ur(Dr(function(e,t){var o,i,r=/(\n+)([^\n]*)/g,n=(s=e.indexOf("\n"),s=-1!==s?s:e.length,r.lastIndex=s,Br(e.slice(0,s),t)),a="\n"===e[0]||" "===e[0];var s;for(;i=r.exec(e);){var l=i[1],c=i[2];o=" "===c[0],n+=l+(a||o||""===c?"":"\n")+Br(c,t),a=o}return n}(t,a),n));case 5:return'"'+function(e){for(var t,o="",i=0,r=0;r<e.length;i>=65536?r+=2:r++)i=jr(e,r),!(t=Cr[i])&&Pr(i)?(o+=e[r],i>=65536&&(o+=e[r+1])):o+=t||Er(i);return o}(t)+'"';default:throw new Zo("impossible error: invalid scalar style")}}()}function Fr(e,t){var o=Rr(e)?String(t):"",i="\n"===e[e.length-1];return o+(i&&("\n"===e[e.length-2]||"\n"===e)?"+":i?"":"-")+"\n"}function Ur(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function Br(e,t){if(""===e||" "===e[0])return e;for(var o,i,r=/ [^ ]/g,n=0,a=0,s=0,l="";o=r.exec(e);)(s=o.index)-n>t&&(i=a>n?a:s,l+="\n"+e.slice(n,i),n=i+1),a=s;return l+="\n",e.length-n>t&&a>n?l+=e.slice(n,a)+"\n"+e.slice(a+1):l+=e.slice(n),l.slice(1)}function Yr(e,t,o,i){var r,n,a,s="",l=e.tag;for(r=0,n=o.length;r<n;r+=1)a=o[r],e.replacer&&(a=e.replacer.call(o,String(r),a)),(qr(e,t+1,a,!0,!0,!1,!0)||void 0===a&&qr(e,t+1,null,!0,!0,!1,!0))&&(i&&""===s||(s+=Ir(e,t)),e.dump&&10===e.dump.charCodeAt(0)?s+="-":s+="- ",s+=e.dump);e.tag=l,e.dump=s||"[]"}function Wr(e,t,o){var i,r,n,a,s,l;for(n=0,a=(r=o?e.explicitTypes:e.implicitTypes).length;n<a;n+=1)if(((s=r[n]).instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(o?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag="?",s.represent){if(l=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===$r.call(s.represent))i=s.represent(t,l);else{if(!kr.call(s.represent,l))throw new Zo("!<"+s.tag+'> tag resolver accepts not "'+l+'" style');i=s.represent[l](t,l)}e.dump=i}return!0}return!1}function qr(e,t,o,i,r,n,a){e.tag=null,e.dump=o,Wr(e,o,!1)||Wr(e,o,!0);var s,l=$r.call(e.dump),c=i;i&&(i=e.flowLevel<0||e.flowLevel>t);var d,p,u="[object Object]"===l||"[object Array]"===l;if(u&&(p=-1!==(d=e.duplicates.indexOf(o))),(null!==e.tag&&"?"!==e.tag||p||2!==e.indent&&t>0)&&(r=!1),p&&e.usedDuplicates[d])e.dump="*ref_"+d;else{if(u&&p&&!e.usedDuplicates[d]&&(e.usedDuplicates[d]=!0),"[object Object]"===l)i&&0!==Object.keys(e.dump).length?(!function(e,t,o,i){var r,n,a,s,l,c,d="",p=e.tag,u=Object.keys(o);if(!0===e.sortKeys)u.sort();else if("function"==typeof e.sortKeys)u.sort(e.sortKeys);else if(e.sortKeys)throw new Zo("sortKeys must be a boolean or a function");for(r=0,n=u.length;r<n;r+=1)c="",i&&""===d||(c+=Ir(e,t)),s=o[a=u[r]],e.replacer&&(s=e.replacer.call(o,a,s)),qr(e,t+1,a,!0,!0,!0)&&((l=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?c+="?":c+="? "),c+=e.dump,l&&(c+=Ir(e,t)),qr(e,t+1,s,!0,l)&&(e.dump&&10===e.dump.charCodeAt(0)?c+=":":c+=": ",d+=c+=e.dump));e.tag=p,e.dump=d||"{}"}(e,t,e.dump,r),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,o){var i,r,n,a,s,l="",c=e.tag,d=Object.keys(o);for(i=0,r=d.length;i<r;i+=1)s="",""!==l&&(s+=", "),e.condenseFlow&&(s+='"'),a=o[n=d[i]],e.replacer&&(a=e.replacer.call(o,n,a)),qr(e,t,n,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),qr(e,t,a,!1,!1)&&(l+=s+=e.dump));e.tag=c,e.dump="{"+l+"}"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else if("[object Array]"===l)i&&0!==e.dump.length?(e.noArrayIndent&&!a&&t>0?Yr(e,t-1,e.dump,r):Yr(e,t,e.dump,r),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,o){var i,r,n,a="",s=e.tag;for(i=0,r=o.length;i<r;i+=1)n=o[i],e.replacer&&(n=e.replacer.call(o,String(i),n)),(qr(e,t,n,!1,!1)||void 0===n&&qr(e,t,null,!1,!1))&&(""!==a&&(a+=","+(e.condenseFlow?"":" ")),a+=e.dump);e.tag=s,e.dump="["+a+"]"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else{if("[object String]"!==l){if("[object Undefined]"===l)return!1;if(e.skipInvalid)return!1;throw new Zo("unacceptable kind of an object to dump "+l)}"?"!==e.tag&&Hr(e,e.dump,t,n,c)}null!==e.tag&&"?"!==e.tag&&(s=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),s="!"===e.tag[0]?"!"+s:"tag:yaml.org,2002:"===s.slice(0,18)?"!!"+s.slice(18):"!<"+s+">",e.dump=s+" "+e.dump)}return!0}function Gr(e,t){var o,i,r=[],n=[];for(Xr(e,r,n),o=0,i=n.length;o<i;o+=1)t.duplicates.push(r[n[o]]);t.usedDuplicates=new Array(i)}function Xr(e,t,o){var i,r,n;if(null!==e&&"object"==typeof e)if(-1!==(r=t.indexOf(e)))-1===o.indexOf(r)&&o.push(r);else if(t.push(e),Array.isArray(e))for(r=0,n=e.length;r<n;r+=1)Xr(e[r],t,o);else for(r=0,n=(i=Object.keys(e)).length;r<n;r+=1)Xr(e[i[r]],t,o)}function Vr(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var Kr={Type:ri,Schema:si,FAILSAFE_SCHEMA:pi,JSON_SCHEMA:wi,CORE_SCHEMA:_i,DEFAULT_SCHEMA:Ni,load:_r.load,loadAll:_r.loadAll,dump:{dump:function(e,t){var o=new Tr(t=t||{});o.noRefs||Gr(e,o);var i=e;return o.replacer&&(i=o.replacer.call({"":i},"",i)),qr(o,0,i,!0,!0)?o.dump+"\n":""}}.dump,YAMLException:Zo,types:{binary:Mi,float:xi,map:di,null:ui,pairs:Oi,set:zi,timestamp:Si,bool:hi,int:vi,merge:Ci,omap:Di,seq:ci,str:li},safeLoad:Vr("safeLoad","load"),safeLoadAll:Vr("safeLoadAll","loadAll"),safeDump:Vr("safeDump","dump")};class Qr{constructor(){this.suppressSync=!1}toYaml(e){const{type:t,...o}=e;return function(e){try{return Kr.dump(e,{indent:2,lineWidth:120,noRefs:!0,sortKeys:!1})}catch{return""}}(o)}fromYaml(e,t){const o=function(e){try{return Kr.load(e)}catch{return null}}(e);return o?{...o,type:t.type}:null}isSuppressed(){return this.suppressSync}suppress(e){this.suppressSync=!0;try{e()}finally{this.suppressSync=!1}}}const Zr=l`
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
`;var Jr=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};let en=class extends ue{constructor(){super(...arguments),this._yaml="",this._error="",this._configSync=new Qr,this._suppressUpdate=!1}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e,this._suppressUpdate||(this._yaml=this._configSync.toYaml(e.config),this._error="")}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){return X`
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

        ${this._error?X`<div class="mc-yaml-error">${this._error}</div>`:K}
      </div>
    `}_onYamlInput(e){const t=e.target.value;this._yaml=t,this._suppressUpdate=!0;try{const e=this._configSync.fromYaml(t,this._editorState.config);e?(this._error="",this.stateManager.updateConfig(e)):this._error="Invalid YAML structure"}catch(e){this._error=e instanceof Error?e.message:"Parse error"}finally{this._suppressUpdate=!1}}};en.styles=[Ae,Zr],Jr([ve({attribute:!1})],en.prototype,"stateManager",void 0),Jr([ve({attribute:!1})],en.prototype,"hass",void 0),Jr([be()],en.prototype,"_yaml",void 0),Jr([be()],en.prototype,"_error",void 0),Jr([be()],en.prototype,"_editorState",void 0),en=Jr([me("mc-yaml-editor")],en);const tn=l`
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
`;var on=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};let rn=class extends ue{constructor(){super(...arguments),this._expandedNodes=new Set(["root"])}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){if(!this._editorState)return X``;const{config:e,selectedPath:t}=this._editorState;return e.rows.length?X`
      <div class="mc-tree">
        ${e.rows.map((e,o)=>this._renderRowNode(e,o,t))}
      </div>
    `:X`<div class="mc-tree-empty">No rows. Add a row to get started.</div>`}_renderRowNode(e,t,o){const i=`row-${t}`,r=this._expandedNodes.has(i);return X`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${()=>this._toggleNode(i)}>
          <span class="mc-tree-toggle ${r?"open":""}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Row ${t+1}</span>
          <span class="mc-tree-type">${e.layout||"1"}</span>
          ${e.display?.conditions?.length?X`<span class="mc-tree-badge condition">C</span>`:K}
          <span class="mc-tree-actions">
            <button class="mc-tree-action-btn" @click=${e=>{e.stopPropagation(),this.stateManager.deleteRow(t)}} title="Delete">&times;</button>
          </span>
        </div>
        ${r?X`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.columns.map((e,i)=>this._renderColumnNode(e,t,i,o))}
              </div>
            `:K}
      </div>
    `}_renderColumnNode(e,t,o,i){const r=`col-${t}-${o}`,n=this._expandedNodes.has(r);return X`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${()=>this._toggleNode(r)}>
          <span class="mc-tree-toggle ${n?"open":""}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-column" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Column ${o+1}</span>
          <span class="mc-tree-type">${e.modules.length} modules</span>
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("add-module",{bubbles:!0,composed:!0,detail:{rowIndex:t,colIndex:o}}))}}
              title="Add module"
            >+</button>
          </span>
        </div>
        ${n?X`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.modules.map((e,r)=>this._renderModuleNode(e,t,o,r,i))}
                ${0===e.modules.length?X`<div style="padding:4px 8px;font-size:0.75rem;color:var(--secondary-text-color)">Empty</div>`:K}
              </div>
            `:K}
      </div>
    `}_renderModuleNode(e,t,o,i,r){const n=r?.rowIndex===t&&r?.columnIndex===o&&r?.moduleIndex===i,a=xe.get(e.type),s=e.display?.conditions?.length,l=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return X`
      <div class="mc-tree-node">
        <div
          class="mc-tree-row ${n?"selected":""}"
          draggable="true"
          @click=${()=>this.stateManager.setSelectedPath({rowIndex:t,columnIndex:o,moduleIndex:i})}
          @dragstart=${e=>this._onDragStart(e,t,o,i)}
          @dragover=${e=>this._onDragOver(e)}
          @drop=${e=>this._onDrop(e,t,o,i)}
        >
          <span class="mc-drag-handle">
            <ha-icon icon="mdi:drag-vertical" style="--mdc-icon-size:14px"></ha-icon>
          </span>
          <span class="mc-tree-icon">
            <ha-icon icon=${a?.metadata.icon||"mdi:puzzle"} style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">${a?.metadata.name||e.type}</span>
          <span class="mc-tree-type">${e.type}</span>
          ${s?X`<span class="mc-tree-badge condition">C</span>`:K}
          ${l?X`<span class="mc-tree-badge action">A</span>`:K}
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,o,i)}}
              title="Delete"
            >&times;</button>
          </span>
        </div>
      </div>
    `}_toggleNode(e){this._expandedNodes.has(e)?this._expandedNodes.delete(e):this._expandedNodes.add(e),this.requestUpdate()}_onDragStart(e,t,o,i){this._dragData={ri:t,ci:o,mi:i},e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify({ri:t,ci:o,mi:i})))}_onDragOver(e){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_onDrop(e,t,o,i){if(e.preventDefault(),!this._dragData)return;const{ri:r,ci:n,mi:a}=this._dragData;r===t&&n===o&&a===i||(this.stateManager.moveModule(r,n,a,t,o,i),this._dragData=void 0)}};rn.styles=[Ae,tn],on([ve({attribute:!1})],rn.prototype,"stateManager",void 0),on([ve({attribute:!1})],rn.prototype,"hass",void 0),on([be()],rn.prototype,"_editorState",void 0),on([be()],rn.prototype,"_expandedNodes",void 0),rn=on([me("mc-tree-editor")],rn);const nn=l`
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
`;var an=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};let sn=class extends ue{constructor(){super(...arguments),this._searchQuery=""}render(){const e=this._searchQuery?xe.search(this._searchQuery):xe.getAll(),t=new Map;for(const i of o){const o=e.filter(e=>e.metadata.category===i).map(e=>e.metadata);o.length>0&&t.set(i,o)}return X`
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
            ${Array.from(t.entries()).map(([e,t])=>X`
                <div class="mc-selector-category">${e}</div>
                ${t.map(e=>X`
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
    `}_onSelect(e){this.dispatchEvent(new CustomEvent("module-selected",{bubbles:!0,composed:!0,detail:{type:e.type}}))}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_onOverlayClick(){this._onClose()}};sn.styles=nn,an([be()],sn.prototype,"_searchQuery",void 0),sn=an([me("mc-module-selector")],sn);var ln=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};const cn="magic-card-saved-colors",dn=["#ffffff","#f3f4f6","#d1d5db","#9ca3af","#6b7280","#374151","#1f2937","#000000","#ef4444","#f97316","#eab308","#22c55e","#14b8a6","#3b82f6","#8b5cf6","#ec4899","#fecaca","#fed7aa","#fef08a","#bbf7d0","#99f6e4","#bfdbfe","#ddd6fe","#fbcfe8","var(--primary-color)","var(--accent-color)","var(--primary-text-color)","var(--secondary-text-color)","var(--card-background-color)","var(--divider-color)","var(--success-color)","var(--error-color)"];let pn=class extends ue{constructor(){super(...arguments),this.value="",this.label="",this._isOpen=!1,this._hsva={h:0,s:100,v:100,a:1},this._savedColors=[],this._hexInput="",this._dragging=null,this._handleAreaPointerDown=e=>{this._dragging="area",e.target.setPointerCapture(e.pointerId),this._updateArea(e)},this._handleHuePointerDown=e=>{this._dragging="hue",e.target.setPointerCapture(e.pointerId),this._updateHue(e)},this._handleOpacityPointerDown=e=>{this._dragging="opacity",e.target.setPointerCapture(e.pointerId),this._updateOpacity(e)},this._handlePointerMove=e=>{this._dragging&&("area"===this._dragging?this._updateArea(e):"hue"===this._dragging?this._updateHue(e):"opacity"===this._dragging&&this._updateOpacity(e))},this._handlePointerUp=()=>{this._dragging=null}}connectedCallback(){super.connectedCallback(),this._loadSavedColors(),this._parseValue(this.value)}updated(e){e.has("value")&&!this._isOpen&&this._parseValue(this.value)}_loadSavedColors(){try{const e=localStorage.getItem(cn);this._savedColors=e?JSON.parse(e):[]}catch{this._savedColors=[]}}_saveSavedColors(){try{localStorage.setItem(cn,JSON.stringify(this._savedColors))}catch{}}_parseValue(e){if(!e)return this._hsva={h:0,s:0,v:100,a:1},void(this._hexInput="");if(e.startsWith("var("))return void(this._hexInput=e);const t=this._colorToHsva(e);t?(this._hsva=t,this._hexInput=this._hsvaToHex(t)):this._hexInput=e}_colorToHsva(e){const t=e.match(/^#([0-9a-f]{3,8})$/i);if(t){let e=t[1];3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),4===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]);const o=parseInt(e.slice(0,2),16)/255,i=parseInt(e.slice(2,4),16)/255,r=parseInt(e.slice(4,6),16)/255,n=8===e.length?parseInt(e.slice(6,8),16)/255:1;return this._rgbToHsva(o,i,r,n)}const o=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(o){const e=parseInt(o[1])/255,t=parseInt(o[2])/255,i=parseInt(o[3])/255,r=o[4]?parseFloat(o[4]):1;return this._rgbToHsva(e,t,i,r)}return null}_rgbToHsva(e,t,o,i){const r=Math.max(e,t,o),n=r-Math.min(e,t,o),a=100*r,s=0===r?0:n/r*100;let l=0;if(0!==n)switch(r){case e:l=60*((t-o)/n+(t<o?6:0));break;case t:l=60*((o-e)/n+2);break;case o:l=60*((e-t)/n+4)}return{h:l,s,v:a,a:i}}_hsvaToRgb(e){const t=e.h/60,o=e.s/100,i=e.v/100,r=i*o,n=r*(1-Math.abs(t%2-1)),a=i-r;let s=0,l=0,c=0;return t<1?(s=r,l=n):t<2?(s=n,l=r):t<3?(l=r,c=n):t<4?(l=n,c=r):t<5?(s=n,c=r):(s=r,c=n),{r:Math.round(255*(s+a)),g:Math.round(255*(l+a)),b:Math.round(255*(c+a)),a:e.a}}_hsvaToHex(e){const t=this._hsvaToRgb(e),o="#"+t.r.toString(16).padStart(2,"0")+t.g.toString(16).padStart(2,"0")+t.b.toString(16).padStart(2,"0");return e.a<1?o+Math.round(255*e.a).toString(16).padStart(2,"0"):o}_hsvaToRgbaString(e){const t=this._hsvaToRgb(e);return e.a<1?`rgba(${t.r}, ${t.g}, ${t.b}, ${e.a.toFixed(2)})`:`rgb(${t.r}, ${t.g}, ${t.b})`}_getCurrentColor(){return this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToHex(this._hsva)}_emitChange(){const e=this._getCurrentColor();this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_openModal(){this._parseValue(this.value),this._isOpen=!0}_closeModal(){this._isOpen=!1}_applyColor(){this._emitChange(),this._closeModal()}_updateArea(e){const t=e.currentTarget.getBoundingClientRect(),o=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),i=Math.max(0,Math.min(1,(e.clientY-t.top)/t.height));this._hsva={...this._hsva,s:100*o,v:100*(1-i)},this._hexInput=this._hsvaToHex(this._hsva)}_updateHue(e){const t=e.currentTarget.getBoundingClientRect(),o=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._hsva={...this._hsva,h:360*o},this._hexInput=this._hsvaToHex(this._hsva)}_updateOpacity(e){const t=e.currentTarget.getBoundingClientRect(),o=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._hsva={...this._hsva,a:o},this._hexInput=this._hsvaToHex(this._hsva)}_handleHexInput(e){const t=e.target.value;this._hexInput=t;const o=this._colorToHsva(t);o&&(this._hsva=o)}_selectPreset(e){if(e.startsWith("var("))this._hexInput=e;else{const t=this._colorToHsva(e);t&&(this._hsva=t,this._hexInput=this._hsvaToHex(t))}}_addSavedColor(){const e=this._getCurrentColor();this._savedColors.includes(e)||(this._savedColors=[e,...this._savedColors].slice(0,12),this._saveSavedColors())}_removeSavedColor(e,t){t.stopPropagation(),this._savedColors=this._savedColors.filter(t=>t!==e),this._saveSavedColors()}_handleTextInput(e){const t=e.target.value;this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){const e=this.value||"transparent";return X`
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
    `}_renderModal(){const e=this._hsvaToRgb(this._hsva),t=`hsl(${this._hsva.h}, 100%, 50%)`,o=this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToRgbaString(this._hsva);return X`
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
                style="left: ${this._hsva.s}%; top: ${100-this._hsva.v}%; background: ${o}"
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
                ${dn.map(e=>X`
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
                ${this._savedColors.map(e=>X`
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
    `}};pn.styles=l`
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
  `,ln([ve({type:String})],pn.prototype,"value",void 0),ln([ve({type:String})],pn.prototype,"label",void 0),ln([be()],pn.prototype,"_isOpen",void 0),ln([be()],pn.prototype,"_hsva",void 0),ln([be()],pn.prototype,"_savedColors",void 0),ln([be()],pn.prototype,"_hexInput",void 0),pn=ln([me("mc-color-picker")],pn);var un=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};const hn=["px","em","rem","%","vw","vh","auto"];let mn=class extends ue{constructor(){super(...arguments),this.value="",this.label="",this.placeholder=""}_parseValue(){if(!this.value)return{number:"",unit:"px"};if("auto"===this.value)return{number:"",unit:"auto"};const e=this.value.match(/^(-?[\d.]+)\s*(px|em|rem|%|vw|vh)?$/);return e?{number:e[1],unit:e[2]||"px"}:{number:this.value,unit:"px"}}_emitChange(e,t){let o="";"auto"===t?o="auto":e&&(o=`${e}${t}`),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:o}}))}render(){const{number:e,unit:t}=this._parseValue();return X`
      <div class="mc-unit-field">
        <input
          class="mc-unit-input"
          type="text"
          .value=${"auto"===t?"":e}
          placeholder=${this.placeholder||"0"}
          ?disabled=${"auto"===t}
          @input=${e=>{const o=e.target.value;this._emitChange(o,t)}}
        />
        <select
          class="mc-unit-select"
          .value=${t}
          @change=${t=>{const o=t.target.value;this._emitChange(e,o)}}
        >
          ${hn.map(e=>X`
            <option value=${e} ?selected=${t===e}>${e}</option>
          `)}
        </select>
      </div>
    `}};mn.styles=l`
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
  `,un([ve({type:String})],mn.prototype,"value",void 0),un([ve({type:String})],mn.prototype,"label",void 0),un([ve({type:String})],mn.prototype,"placeholder",void 0),mn=un([me("mc-unit-field")],mn);var fn=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};const gn={general:{label:"General",icon:"mdi:cog"},actions:{label:"Actions",icon:"mdi:gesture-tap"},logic:{label:"Conditions",icon:"mdi:filter-outline"},design:{label:"Design",icon:"mdi:palette"}};let vn=class extends ue{constructor(){super(...arguments),this.open=!1,this._activeTab="general"}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open||!this.module)return X``;const e=xe.get(this.module.type);if(!e)return X``;const t=e.getAvailableTabs(),o=t.includes(this._activeTab)?this._activeTab:t[0];return X`
      <div class="mc-modal-overlay" @click=${this._close}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-modal-header">
            <ha-icon icon=${e.metadata.icon}></ha-icon>
            <span class="mc-modal-title">${e.metadata.name} Settings</span>
            <button class="mc-modal-close" @click=${this._close}>&times;</button>
          </div>

          <div class="mc-modal-tabs">
            ${t.map(e=>{const t=gn[e];return X`
                <button
                  class="mc-modal-tab ${o===e?"active":""}"
                  @click=${()=>{this._activeTab=e}}
                >
                  <ha-icon icon=${t.icon}></ha-icon>
                  ${t.label}
                </button>
              `})}
          </div>

          <div class="mc-modal-body">
            ${this._renderTabContent(o,e)}
          </div>

          <div class="mc-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${this._close}>Done</button>
          </div>
        </div>
      </div>
    `}_renderTabContent(e,t){if(!this.module||!this.onChange)return X`<p>Loading...</p>`;const o=this.onChange;switch(e){case"general":return t.renderGeneralTab(this.module,this.hass,o);case"actions":return t.renderActionsTab?t.renderActionsTab(this.module,this.hass,o):X`<p>No actions available</p>`;case"logic":return t.renderLogicTab?t.renderLogicTab(this.module,this.hass,o):X`<p>No conditions available</p>`;case"design":return t.renderDesignTab?t.renderDesignTab(this.module,this.hass,o):X`<p>No design options</p>`}}};vn.styles=[Ae,l`
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
  `],fn([ve({attribute:!1})],vn.prototype,"module",void 0),fn([ve({attribute:!1})],vn.prototype,"hass",void 0),fn([ve({type:Boolean})],vn.prototype,"open",void 0),fn([ve({attribute:!1})],vn.prototype,"onChange",void 0),fn([be()],vn.prototype,"_activeTab",void 0),vn=fn([me("mc-settings-modal")],vn);var bn=function(e,t,o,i){var r,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,o,i);else for(var s=e.length-1;s>=0;s--)(r=e[s])&&(a=(n<3?r(a):n>3?r(t,o,a):r(t,o))||a);return n>3&&a&&Object.defineProperty(t,o,a),a};let yn=class extends ue{constructor(){super(...arguments),this._showModuleSelector=!1,this._showSettingsModal=!1,this._onAddModule=e=>{this._moduleSelectorTarget=e.detail,this._showModuleSelector=!0},this._onModuleSelected=e=>{this._moduleSelectorTarget&&this._stateManager.addModule(this._moduleSelectorTarget.rowIndex,this._moduleSelectorTarget.colIndex,e.detail.type),this._showModuleSelector=!1,this._moduleSelectorTarget=void 0}}connectedCallback(){super.connectedCallback(),this._stateManager=new Te(e=>{this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:e}}))}),this._unsubscribe=this._stateManager.subscribe(e=>{this._editorState=e,void 0!==e.selectedPath?.moduleIndex&&(this._showSettingsModal=!0)}),this._pendingConfig&&(this._stateManager.setConfig(this._pendingConfig),this._pendingConfig=void 0)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._stateManager?.destroy()}setConfig(e){this._stateManager?this._stateManager.setConfig(e):this._pendingConfig=e}render(){if(!this._editorState)return X`<div class="mc-editor">Loading...</div>`;const{editorMode:e}=this._editorState;return X`
      <div class="mc-editor">
        ${this._renderModeSwitcher(e)}
        ${this._renderToolbar()}
        ${this._renderEditorMode(e)}
        ${this._showModuleSelector?this._renderModuleSelectorDialog():K}
        ${this._renderSettingsModal()}
      </div>
    `}_renderModeSwitcher(e){return X`
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
    `}_renderToolbar(){return X`
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
    `}_renderEditorMode(e){switch(e){case"form":return X`
          <mc-form-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
          ></mc-form-editor>
        `;case"yaml":return X`
          <mc-yaml-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
          ></mc-yaml-editor>
        `;case"tree":return X`
          <mc-tree-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
          ></mc-tree-editor>
        `}}_renderSettingsModal(){const e=this._stateManager?.getSelectedModule();if(!e||!this._showSettingsModal)return X``;const{selectedPath:t}=this._editorState;return X`
      <mc-settings-modal
        .module=${e}
        .hass=${this.hass}
        .open=${!0}
        .onChange=${e=>{void 0!==t?.rowIndex&&void 0!==t?.columnIndex&&void 0!==t?.moduleIndex&&this._stateManager.updateModule(t.rowIndex,t.columnIndex,t.moduleIndex,e)}}
        @close=${()=>{this._showSettingsModal=!1,this._stateManager.setSelectedPath(null)}}
      ></mc-settings-modal>
    `}_renderModuleSelectorDialog(){return X`
      <mc-module-selector
        @module-selected=${this._onModuleSelected}
        @close=${()=>{this._showModuleSelector=!1}}
      ></mc-module-selector>
    `}};yn.styles=Ae,bn([ve({attribute:!1})],yn.prototype,"hass",void 0),bn([ve({attribute:!1})],yn.prototype,"lovelace",void 0),bn([be()],yn.prototype,"_editorState",void 0),bn([be()],yn.prototype,"_showModuleSelector",void 0),bn([be()],yn.prototype,"_moduleSelectorTarget",void 0),bn([be()],yn.prototype,"_showSettingsModal",void 0),yn=bn([me(t)],yn);class xn{getAvailableTabs(){return["general","actions","logic","design"]}validate(e){return[]}renderActionsTab(e,t,o){const i=e.actions,r=(t,r)=>{o({...e,actions:{...i,[t]:r}})};return X`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Tap Action</div>
          ${this._renderActionConfig(i?.tap_action,e=>r("tap_action",e),t)}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Hold Action</div>
          ${this._renderActionConfig(i?.hold_action,e=>r("hold_action",e),t)}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Double Tap Action</div>
          ${this._renderActionConfig(i?.double_tap_action,e=>r("double_tap_action",e),t)}
        </div>
      </div>
    `}renderLogicTab(e,t,o){const i=e.display,r=i?.conditions||[],n=t=>{o({...e,display:{...i,...t}})},a=(e,t)=>{n({conditions:r.map(o=>o.id===e?{...o,...t}:o)})};return X`
      <div class="mc-tab-content">
        ${Pe("Condition Mode",i?.mode||"every",[{label:"All conditions (AND)",value:"every"},{label:"Any condition (OR)",value:"any"}],e=>n({mode:e}))}

        <div class="mc-conditions-list">
          ${r.map(e=>X`
              <div class="mc-condition-item">
                ${Pe("Type",e.type,[{label:"State",value:"state"},{label:"Attribute",value:"attribute"},{label:"Time",value:"time"},{label:"Template",value:"template"}],t=>a(e.id,{type:t}))}
                ${"state"===e.type||"attribute"===e.type?X`
                      ${Ne("Entity",e.entity,t=>a(e.id,{entity:t}),t)}
                      ${"attribute"===e.type?Ie("Attribute",e.attribute,t=>a(e.id,{attribute:t})):K}
                      ${Ie("State equals",e.state,t=>a(e.id,{state:t}))}
                      ${Ie("State not equals",e.state_not,t=>a(e.id,{state_not:t}))}
                    `:K}
                ${"time"===e.type?X`
                      ${Ie("After (HH:MM)",e.after,t=>a(e.id,{after:t}))}
                      ${Ie("Before (HH:MM)",e.before,t=>a(e.id,{before:t}))}
                    `:K}
                ${"template"===e.type?X`
                      <div class="mc-field">
                        <label class="mc-field-label">Template</label>
                        <textarea
                          .value=${e.template||""}
                          @input=${t=>a(e.id,{template:t.target.value})}
                          rows="3"
                        ></textarea>
                      </div>
                    `:K}
                <button class="mc-btn-icon" @click=${()=>{return t=e.id,void n({conditions:r.filter(e=>e.id!==t)});var t}}>
                  &times;
                </button>
              </div>
            `)}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${()=>{const e={id:ke("cond"),type:"state",entity:"",state:""};n({conditions:[...r,e]})}}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
          Add Condition
        </button>
      </div>
    `}renderDesignTab(e,t,o){const i=e.design||{},r=t=>{o({...e,design:{...i,...t}})};return X`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Typography</div>
          ${Re("Font Size",i.font_size,e=>r({font_size:e}))}
          ${Pe("Font Weight",i.font_weight,[{label:"Normal",value:"normal"},{label:"Bold",value:"bold"},{label:"Light",value:"300"},{label:"Medium",value:"500"},{label:"Semibold",value:"600"}],e=>r({font_weight:e}))}
          ${Pe("Text Align",i.text_align,[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"}],e=>r({text_align:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Colors</div>
          ${je("Color",i.color,e=>r({color:e}))}
          ${je("Background",i.background,e=>r({background:e}))}
          ${Ie("Opacity",i.opacity,e=>r({opacity:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Spacing</div>
          ${Re("Padding",i.padding,e=>r({padding:e}))}
          ${Re("Margin",i.margin,e=>r({margin:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Borders</div>
          ${Ie("Border",i.border,e=>r({border:e}))}
          ${Re("Border Radius",i.border_radius,e=>r({border_radius:e}))}
          ${Ie("Box Shadow",i.box_shadow,e=>r({box_shadow:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Size</div>
          ${Re("Width",i.width,e=>r({width:e}))}
          ${Re("Height",i.height,e=>r({height:e}))}
          ${Re("Min Width",i.min_width,e=>r({min_width:e}))}
          ${Re("Min Height",i.min_height,e=>r({min_height:e}))}
          ${Re("Max Width",i.max_width,e=>r({max_width:e}))}
          ${Re("Max Height",i.max_height,e=>r({max_height:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Custom CSS</div>
          <div class="mc-field">
            <label class="mc-field-label">CSS</label>
            <textarea
              .value=${i.css||""}
              @input=${e=>r({css:e.target.value})}
              rows="4"
              placeholder="color: red; font-size: 20px;"
            ></textarea>
          </div>
        </div>
      </div>
    `}_renderActionConfig(e,t,o){const i=e||{action:"none"};return X`
      <div class="mc-action-config">
        ${Pe("Action",i.action,[{label:"None",value:"none"},{label:"More Info",value:"more-info"},{label:"Toggle",value:"toggle"},{label:"Navigate",value:"navigate"},{label:"URL",value:"url"},{label:"Perform Action",value:"perform-action"},{label:"Assist",value:"assist"}],e=>t({...i,action:e}))}
        ${"more-info"===i.action||"toggle"===i.action?Ne("Entity",i.entity,e=>t({...i,entity:e}),o):K}
        ${"navigate"===i.action?Ie("Navigation Path",i.navigation_path,e=>t({...i,navigation_path:e})):K}
        ${"url"===i.action?Ie("URL",i.url_path,e=>t({...i,url_path:e})):K}
        ${"perform-action"===i.action?X`
              ${Ie("Service",i.service,e=>t({...i,service:e}))}
            `:K}
      </div>
    `}}xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"text",name:"Text",description:"Display static or template text",category:"content",icon:"mdi:format-text"}}createDefault(){return{id:ke("text"),type:"text",text:"Hello World"}}renderPreview(e,t){return X`<div class="mc-module mc-text">${e.text||""}</div>`}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ie("Text",i.text,e=>o({...i,text:e}))}
        ${ze("Use Template",i.use_template,e=>o({...i,use_template:e}))}
        ${i.use_template?X`
              <div class="mc-field-hint">Use Jinja2 templates: {{ states('sensor.temp') }}</div>
            `:X``}
      </div>
    `}validate(e){const t=[],o=e;return o.text||o.use_template||t.push("Text content is required"),t}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"icon",name:"Icon",description:"Display an icon from MDI or entity",category:"content",icon:"mdi:emoticon-outline"}}createDefault(){return{id:ke("icon"),type:"icon",icon:"mdi:home",size:"24px"}}renderPreview(e,t){const o=e;let i=o.icon||"mdi:help";if(o.use_entity_icon&&o.entity&&t){const e=t.states[o.entity];e?.attributes.icon&&(i=e.attributes.icon)}return X`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${o.size||"24px"}; color: ${o.icon_color||"inherit"}">
        <ha-icon .icon=${i}></ha-icon>
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${ze("Use Entity Icon",i.use_entity_icon,e=>o({...i,use_entity_icon:e}))}
        ${i.use_entity_icon?K:Ie("Icon",i.icon,e=>o({...i,icon:e}))}
        ${Ie("Size",i.size,e=>o({...i,size:e}))}
        ${je("Color",i.icon_color,e=>o({...i,icon_color:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"info",name:"Info",description:"Display entity name, state, and attributes",category:"content",icon:"mdi:information-outline"}}createDefault(){return{id:ke("info"),type:"info",show_name:!0,show_state:!0,show_unit:!0}}renderPreview(e,t){const o=e,i=o.entity&&t?t.states[o.entity]:void 0,r=i?.attributes.friendly_name||o.entity||"No entity",n=i?t.formatEntityState(i):"—";return X`
      <div class="mc-module mc-info">
        ${o.show_name?X`<span class="mc-info-name">${r}</span>`:K}
        ${o.show_state?X`<span class="mc-info-state">
              ${o.prefix||""}${o.attribute&&i?String(i.attributes[o.attribute]??"—"):n}${o.suffix||""}
            </span>`:K}
        ${o.secondary_info&&i?X`<span class="mc-info-secondary"
              >${String(i.attributes[o.secondary_info]??"")}</span
            >`:K}
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${Ie("Attribute",i.attribute,e=>o({...i,attribute:e}))}
        ${ze("Show Name",i.show_name,e=>o({...i,show_name:e}))}
        ${ze("Show State",i.show_state,e=>o({...i,show_state:e}))}
        ${ze("Show Unit",i.show_unit,e=>o({...i,show_unit:e}))}
        ${Ie("Prefix",i.prefix,e=>o({...i,prefix:e}))}
        ${Ie("Suffix",i.suffix,e=>o({...i,suffix:e}))}
        ${Ie("Secondary Info (attribute)",i.secondary_info,e=>o({...i,secondary_info:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"image",name:"Image",description:"Display a static image or entity picture",category:"content",icon:"mdi:image"}}createDefault(){return{id:ke("image"),type:"image",image:"",entity_picture:!1,aspect_ratio:"16:9",fit:"cover"}}renderPreview(e,t){const o=e;let i=o.image||"";if(o.entity_picture&&o.entity&&t){const e=t.states[o.entity];e?.attributes.entity_picture&&(i=e.attributes.entity_picture)}const r=o.fit||"cover",n=o.aspect_ratio||"16:9";return X`
      <div
        class="mc-module mc-image"
        style="aspect-ratio: ${n.replace(":","/")}; overflow: hidden;"
      >
        ${i?X`<img
              src=${i}
              style="width: 100%; height: 100%; object-fit: ${r}; display: block;"
              alt=""
            />`:X`<div
              style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--divider-color, #e0e0e0); color: var(--secondary-text-color, #888);"
            >
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${ze("Use Entity Picture",i.entity_picture,e=>o({...i,entity_picture:e}))}
        ${i.entity_picture?K:Ie("Image URL",i.image,e=>o({...i,image:e}))}
        ${Ie("Aspect Ratio",i.aspect_ratio,e=>o({...i,aspect_ratio:e}))}
        ${Pe("Fit",i.fit,[{label:"Cover",value:"cover"},{label:"Contain",value:"contain"},{label:"Fill",value:"fill"},{label:"None",value:"none"}],e=>o({...i,fit:e}))}
      </div>
    `}validate(e){const t=[],o=e;return o.image||o.entity_picture||t.push("An image URL or entity picture source is required"),o.entity_picture&&!o.entity&&t.push("Entity is required when using entity picture"),t}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"markdown",name:"Markdown",description:"Render markdown-formatted content",category:"content",icon:"mdi:language-markdown"}}createDefault(){return{id:ke("markdown"),type:"markdown",content:"**Hello** _World_"}}renderPreview(e,t){const o=(e.content||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/__(.+?)__/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/_(.+?)_/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/\n/g,"<br>");return X`
      <div class="mc-module mc-markdown" .innerHTML=${o}></div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        <div class="mc-field">
          <label class="mc-field-label">Content</label>
          <textarea
            .value=${i.content||""}
            @input=${e=>o({...i,content:e.target.value})}
            rows="6"
            placeholder="**Bold**, _italic_, \`code\`"
          ></textarea>
        </div>
        <div class="mc-field-hint">
          Supports Markdown: **bold**, _italic_, \`code\`, and more.
        </div>
        ${Ie("Entity (for templates)",i.entity,e=>o({...i,entity:e}))}
      </div>
    `}validate(e){const t=[];return e.content||t.push("Markdown content is required"),t}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"bar",name:"Bar",description:"Display a progress bar based on entity state",category:"content",icon:"mdi:chart-bar"}}createDefault(){return{id:ke("bar"),type:"bar",min:0,max:100,bar_height:"8px",bar_color:"var(--primary-color, #03a9f4)",bar_background:"var(--divider-color, #e0e0e0)",show_value:!0,direction:"horizontal"}}renderPreview(e,t){const o=e,i=o.min??0,r=o.max??100,n=o.entity&&t?t.states[o.entity]:void 0,a=n?parseFloat(n.state):i,s=Math.min(Math.max(a,i),r),l=r!==i?(s-i)/(r-i)*100:0;let c=o.bar_color||"var(--primary-color, #03a9f4)";if(o.severity&&o.severity.length>0)for(const e of o.severity)if(s>=e.from&&s<=e.to){c=e.color;break}const d=o.bar_background||"var(--divider-color, #e0e0e0)",p=o.bar_height||"8px";return"vertical"===o.direction?X`
        <div class="mc-module mc-bar mc-bar-vertical" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
          ${o.show_value?X`<span class="mc-bar-value">${n?t.formatEntityState(n):"—"}</span>`:K}
          <div
            style="width: ${p}; height: 100%; min-height: 40px; background: ${d}; border-radius: 4px; position: relative; overflow: hidden;"
          >
            <div
              style="position: absolute; bottom: 0; left: 0; width: 100%; height: ${l}%; background: ${c}; border-radius: 4px; transition: height 0.3s ease;"
            ></div>
          </div>
        </div>
      `:X`
      <div class="mc-module mc-bar mc-bar-horizontal" style="display: flex; align-items: center; gap: 8px; width: 100%;">
        <div
          style="flex: 1; height: ${p}; background: ${d}; border-radius: 4px; overflow: hidden;"
        >
          <div
            style="height: 100%; width: ${l}%; background: ${c}; border-radius: 4px; transition: width 0.3s ease;"
          ></div>
        </div>
        ${o.show_value?X`<span class="mc-bar-value" style="white-space: nowrap;">${n?t.formatEntityState(n):"—"}</span>`:K}
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${Oe("Min",i.min,e=>o({...i,min:e}))}
        ${Oe("Max",i.max,e=>o({...i,max:e}))}
        ${Ie("Bar Height",i.bar_height,e=>o({...i,bar_height:e}))}
        ${je("Bar Color",i.bar_color,e=>o({...i,bar_color:e}))}
        ${je("Bar Background",i.bar_background,e=>o({...i,bar_background:e}))}
        ${ze("Show Value",i.show_value,e=>o({...i,show_value:e}))}
        ${Pe("Direction",i.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>o({...i,direction:e}))}
      </div>
    `}validate(e){const t=[],o=e;return o.entity||t.push("Entity is required for bar module"),void 0!==o.min&&void 0!==o.max&&o.min>=o.max&&t.push("Min must be less than max"),t}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"graphs",name:"Graph",description:"Display entity history as a line graph",category:"content",icon:"mdi:chart-line"}}createDefault(){return{id:ke("graphs"),type:"graphs",hours_to_show:24,points_per_hour:2,line_width:2,fill:!0,show_points:!1,show_labels:!0}}renderPreview(e,t){const o=e,i=o.line_color||"var(--mc-primary)",r=o.fill_color||"var(--mc-primary)";return X`
      <div class="mc-module mc-graphs">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" style="height: 60px">
          ${o.fill?X`<path d="M0,50 Q30,30 60,35 T120,20 T200,30 L200,60 L0,60 Z"
                fill="${r}" opacity="0.15" />`:""}
          <path d="M0,50 Q30,30 60,35 T120,20 T200,30"
            fill="none" stroke="${i}" stroke-width="${o.line_width||2}" />
          ${o.show_points?X`
                <circle cx="0" cy="50" r="3" fill="${i}" />
                <circle cx="60" cy="35" r="3" fill="${i}" />
                <circle cx="120" cy="20" r="3" fill="${i}" />
                <circle cx="200" cy="30" r="3" fill="${i}" />
              `:""}
        </svg>
        ${o.show_labels?X`<div style="font-size:0.75rem; color:var(--mc-text-secondary); margin-top:4px">
              ${o.entity||"No entity"} &mdash; ${o.hours_to_show||24}h
            </div>`:""}
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${Oe("Hours to Show",i.hours_to_show,e=>o({...i,hours_to_show:e}),{min:1,max:168})}
        ${Oe("Points per Hour",i.points_per_hour,e=>o({...i,points_per_hour:e}),{min:1,max:60})}
        ${je("Line Color",i.line_color,e=>o({...i,line_color:e}))}
        ${Oe("Line Width",i.line_width,e=>o({...i,line_width:e}),{min:1,max:10})}
        ${ze("Fill",i.fill,e=>o({...i,fill:e}))}
        ${je("Fill Color",i.fill_color,e=>o({...i,fill_color:e}))}
        ${ze("Show Points",i.show_points,e=>o({...i,show_points:e}))}
        ${ze("Show Labels",i.show_labels,e=>o({...i,show_labels:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"camera",name:"Camera",description:"Display a camera entity stream",category:"content",icon:"mdi:cctv"}}createDefault(){return{id:ke("camera"),type:"camera",aspect_ratio:"16:9",show_controls:!0}}renderPreview(e,t){const o=e,i=o.entity&&t?t.states[o.entity]:void 0,r=i?.attributes.entity_picture,n=i?.attributes.friendly_name||o.entity||"No camera";return X`
      <div class="mc-module mc-camera" style="aspect-ratio: ${(o.aspect_ratio||"16:9").replace(":","/")}">
        ${r?X`<img src="${r}" alt="${n}" />`:X`<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--mc-border);color:var(--mc-text-secondary);font-size:0.875rem;">
              <ha-icon icon="mdi:cctv" style="margin-right:8px"></ha-icon>${n}
            </div>`}
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Camera Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${Ie("Aspect Ratio",i.aspect_ratio,e=>o({...i,aspect_ratio:e}))}
        ${ze("Show Controls",i.show_controls,e=>o({...i,show_controls:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"button",name:"Button",description:"Interactive button with icon, label, and optional state display",category:"controls",icon:"mdi:gesture-tap"}}createDefault(){return{id:ke("button"),type:"button",label:"Button",icon:"mdi:power",show_state:!1,button_style:"default"}}renderPreview(e,t){const o=e,i=o.entity&&t?t.states[o.entity]:void 0,r=i?t.formatEntityState(i):void 0,n=o.label||"Button",a="icon-only"===o.button_style;return X`
      <div class="mc-module mc-button mc-button--${o.button_style||"default"}">
        <button
          class="mc-button-inner"
          style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: ${a?"8px":"8px 16px"};
            border-radius: 8px;
            border: ${"outline"===o.button_style?"1px solid var(--primary-color, #03a9f4)":"none"};
            background: ${"flat"===o.button_style||"outline"===o.button_style?"transparent":"var(--primary-color, #03a9f4)"};
            color: ${"flat"===o.button_style||"outline"===o.button_style?"var(--primary-color, #03a9f4)":"#fff"};
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          "
        >
          ${o.icon?X`<ha-icon .icon=${o.icon} style="--mdc-icon-size: 20px;"></ha-icon>`:K}
          ${a?K:X`<span>${n}</span>`}
          ${o.show_state&&r?X`<span class="mc-button-state" style="opacity: 0.8; font-size: 12px;">${r}</span>`:K}
        </button>
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${Ie("Label",i.label,e=>o({...i,label:e}))}
        ${Ie("Icon",i.icon,e=>o({...i,icon:e}))}
        ${Pe("Button Style",i.button_style,[{label:"Default",value:"default"},{label:"Outline",value:"outline"},{label:"Flat",value:"flat"},{label:"Icon Only",value:"icon-only"}],e=>o({...i,button_style:e}))}
        ${ze("Show State",i.show_state,e=>o({...i,show_state:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"slider",name:"Slider",description:"Range slider for controlling numeric values",category:"controls",icon:"mdi:tune-vertical"}}createDefault(){return{id:ke("slider"),type:"slider",min:0,max:100,step:1,show_value:!0,direction:"horizontal"}}renderPreview(e,t){const o=e,i=o.entity&&t?t.states[o.entity]:void 0,r=o.min??0,n=o.max??100,a=o.step??1,s=i?o.attribute?Number(i.attributes[o.attribute]??r):Number(i.state):Math.round((r+n)/2),l="vertical"===o.direction;return X`
      <div
        class="mc-module mc-slider"
        style="
          display: flex;
          flex-direction: ${l?"column":"row"};
          align-items: center;
          gap: 8px;
          ${l?"height: 120px;":"width: 100%;"}
        "
      >
        <input
          type="range"
          .value=${String(s)}
          min=${r}
          max=${n}
          step=${a}
          style="
            flex: 1;
            accent-color: ${o.slider_color||"var(--primary-color, #03a9f4)"};
            ${l?"writing-mode: vertical-lr; direction: rtl; height: 100%;":"width: 100%;"}
            ${o.track_color?`background: ${o.track_color};`:""}
          "
        />
        ${o.show_value?X`<span class="mc-slider-value" style="font-size: 14px; min-width: 36px; text-align: center;">
              ${s}
            </span>`:K}
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${Ie("Attribute",i.attribute,e=>o({...i,attribute:e}))}
        ${Oe("Min",i.min,e=>o({...i,min:e}))}
        ${Oe("Max",i.max,e=>o({...i,max:e}))}
        ${Oe("Step",i.step,e=>o({...i,step:e}),{min:.01,step:.01})}
        ${ze("Show Value",i.show_value,e=>o({...i,show_value:e}))}
        ${Pe("Direction",i.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>o({...i,direction:e}))}
        ${je("Slider Color",i.slider_color,e=>o({...i,slider_color:e}))}
        ${je("Track Color",i.track_color,e=>o({...i,track_color:e}))}
        ${Ie("Thumb Size",i.thumb_size,e=>o({...i,thumb_size:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"spinbox",name:"Spinbox",description:"Numeric input with increment and decrement buttons",category:"controls",icon:"mdi:numeric"}}createDefault(){return{id:ke("spinbox"),type:"spinbox",min:0,max:100,step:1}}renderPreview(e,t){const o=e,i=o.entity&&t?t.states[o.entity]:void 0,r=o.min??0,n=o.max??100,a=i?o.attribute?Number(i.attributes[o.attribute]??r):Number(i.state):Math.round((r+n)/2),s="\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      width: 32px;\n      height: 32px;\n      border: none;\n      border-radius: 50%;\n      background: var(--primary-color, #03a9f4);\n      color: #fff;\n      font-size: 18px;\n      font-weight: bold;\n      cursor: pointer;\n      line-height: 1;\n    ";return X`
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
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${Ie("Attribute",i.attribute,e=>o({...i,attribute:e}))}
        ${Oe("Min",i.min,e=>o({...i,min:e}))}
        ${Oe("Max",i.max,e=>o({...i,max:e}))}
        ${Oe("Step",i.step,e=>o({...i,step:e}),{min:.01,step:.01})}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"dropdown",name:"Dropdown",description:"Select dropdown for choosing from a list of options",category:"controls",icon:"mdi:form-dropdown"}}createDefault(){return{id:ke("dropdown"),type:"dropdown",options:[{label:"Option 1",value:"option_1"},{label:"Option 2",value:"option_2"},{label:"Option 3",value:"option_3"}]}}renderPreview(e,t){const o=e,i=o.entity&&t?t.states[o.entity]:void 0,r=i?o.attribute?String(i.attributes[o.attribute]??""):i.state:void 0,n=o.options||[];return X`
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
          ${n.length>0?n.map(e=>X`
                  <option value=${e.value} ?selected=${r===e.value}>
                    ${e.label}
                  </option>
                `):X`<option disabled selected>No options</option>`}
        </select>
      </div>
    `}renderGeneralTab(e,t,o){const i=e,r=i.options||[],n=(e,t,n)=>{const a=r.map((o,i)=>i===e?{...o,[t]:n}:o);o({...i,options:a})};return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${Ie("Attribute",i.attribute,e=>o({...i,attribute:e}))}

        <div class="mc-section">
          <div class="mc-section-header">Options</div>
          <div class="mc-options-list">
            ${r.map((e,t)=>X`
                <div class="mc-option-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${Ie("Label",e.label,e=>n(t,"label",e))}
                  ${Ie("Value",e.value,e=>n(t,"value",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=r.filter((t,o)=>o!==e);o({...i,options:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...r,{label:`Option ${r.length+1}`,value:`option_${r.length+1}`}];o({...i,options:e})}}>Add Option</button>
        </div>
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"light",name:"Light",description:"Light control with brightness, color temp, and color options",category:"controls",icon:"mdi:lightbulb"}}createDefault(){return{id:ke("light"),type:"light",show_brightness:!0,show_color_temp:!1,show_color:!1,compact:!1}}renderPreview(e,t){const o=e,i=o.entity&&t?t.states[o.entity]:void 0,r=!!i&&"on"===i.state,n=i?.attributes.brightness,a=void 0!==n?Math.round(n/255*100):void 0,s=i?.attributes.color_temp,l=i?.attributes.friendly_name||o.entity||"Light",c=r?"var(--state-light-active-color, #fdd835)":"var(--state-icon-color, #9e9e9e)";return X`
      <div
        class="mc-module mc-light ${o.compact?"mc-light--compact":""}"
        style="
          display: flex;
          flex-direction: ${o.compact?"row":"column"};
          align-items: ${o.compact?"center":"stretch"};
          gap: ${o.compact?"12px":"8px"};
        "
      >
        <div
          class="mc-light-header"
          style="display: flex; align-items: center; gap: 8px;"
        >
          <ha-icon
            .icon=${"mdi:lightbulb"}
            style="color: ${c}; --mdc-icon-size: ${o.compact?"24px":"32px"};"
          ></ha-icon>
          ${o.compact?X`<span style="font-weight: 500; flex: 1;">${l}</span>`:X`
                <div style="flex: 1;">
                  <div style="font-weight: 500;">${l}</div>
                  <div style="font-size: 12px; opacity: 0.7;">
                    ${r?void 0!==a?`${a}%`:"On":"Off"}
                  </div>
                </div>
              `}
        </div>

        ${o.show_brightness?X`
              <div class="mc-light-brightness" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:brightness-6"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="range"
                  min="0"
                  max="100"
                  .value=${String(a??50)}
                  style="flex: 1; accent-color: var(--state-light-active-color, #fdd835);"
                />
                ${void 0!==a?X`<span style="font-size: 12px; min-width: 32px; text-align: right;">${a}%</span>`:K}
              </div>
            `:K}

        ${o.show_color_temp?X`
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

        ${o.show_color?X`
              <div class="mc-light-color" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:palette"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="color"
                  style="width: 32px; height: 32px; border: none; padding: 0; cursor: pointer;"
                />
              </div>
            `:K}
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${ze("Show Brightness",i.show_brightness,e=>o({...i,show_brightness:e}))}
        ${ze("Show Color Temp",i.show_color_temp,e=>o({...i,show_color_temp:e}))}
        ${ze("Show Color Picker",i.show_color,e=>o({...i,show_color:e}))}
        ${ze("Compact Mode",i.compact,e=>o({...i,compact:e}))}
      </div>
    `}validate(e){const t=[];return e.entity||t.push("Entity is required for light module"),t}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"gauge",name:"Gauge",description:"Arc gauge for displaying numeric sensor values",category:"controls",icon:"mdi:gauge"}}createDefault(){return{id:ke("gauge"),type:"gauge",min:0,max:100,needle:!0,gauge_style:"half"}}renderPreview(e,t){const o=e,i=o.entity&&t?t.states[o.entity]:void 0,r=o.min??0,n=o.max??100,a=i?Number(i.state):Math.round((r+n)/2),s=Math.max(r,Math.min(n,a)),l=(s-r)/(n-r)*100,c=this._getSeverityColor(s,o.severity)||"var(--primary-color, #03a9f4)",d=("half"===o.gauge_style||o.gauge_style,"full"===o.gauge_style),p="quarter"===o.gauge_style;if(d){const e=l/100*360,t=(e-90)*(Math.PI/180),o=40,i=50,r=50+o*Math.cos(t),n=i+o*Math.sin(t);return X`
        <div class="mc-module mc-gauge mc-gauge--full" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${l>0?X`<path
                  d="M 50 10 A 40 40 0 ${e>180?1:0} 1 ${r} ${n}"
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
      `}if(p){const e=l/100*90,t=Math.PI/180*-90,o=(-90+e)*(Math.PI/180),i=44,r=10,n=90,a=r+i*Math.cos(t),d=n+i*Math.sin(t),p=r+i*Math.cos(o),u=n+i*Math.sin(o);return X`
        <div class="mc-module mc-gauge mc-gauge--quarter" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <path d="M 10 46 A 44 44 0 0 1 54 90" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${l>0?X`<path
                  d="M ${a} ${d} A ${i} ${i} 0 0 1 ${p} ${u}"
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
      `}const u=l/100*180,h=(180+u)*(Math.PI/180),m=50+40*Math.cos(h),f=55+40*Math.sin(h);return X`
      <div class="mc-module mc-gauge mc-gauge--half" style="text-align: center;">
        <svg viewBox="0 0 100 70" width="140" height="100">
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="var(--divider-color, #e0e0e0)"
            stroke-width="8"
            stroke-linecap="round"
          />
          ${l>0?X`<path
                d="M 10 55 A 40 40 0 ${u>180?1:0} 1 ${m} ${f}"
                fill="none"
                stroke=${c}
                stroke-width="8"
                stroke-linecap="round"
              />`:""}
          ${o.needle?X`
                <line
                  x1="50"
                  y1="55"
                  x2=${m}
                  y2=${f}
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
          <text x="90" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${n}</text>
        </svg>
      </div>
    `}renderGeneralTab(e,t,o){const i=e,r=i.severity||[],n=(e,t,n)=>{const a=r.map((o,i)=>i===e?{...o,[t]:n}:o);o({...i,severity:a})};return X`
      <div class="mc-tab-content">
        ${Ne("Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${Oe("Min",i.min,e=>o({...i,min:e}))}
        ${Oe("Max",i.max,e=>o({...i,max:e}))}
        ${Pe("Gauge Style",i.gauge_style,[{label:"Half (semicircle)",value:"half"},{label:"Full (circle)",value:"full"},{label:"Quarter",value:"quarter"}],e=>o({...i,gauge_style:e}))}
        ${ze("Show Needle",i.needle,e=>o({...i,needle:e}))}

        <div class="mc-section">
          <div class="mc-section-header">Severity Ranges</div>
          <div class="mc-severity-list">
            ${r.map((e,t)=>X`
                <div class="mc-severity-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${Oe("From",e.from,e=>n(t,"from",e))}
                  ${Oe("To",e.to,e=>n(t,"to",e))}
                  ${je("Color",e.color,e=>n(t,"color",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=r.filter((t,o)=>o!==e);o({...i,severity:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...r,{from:0,to:100,color:"#4caf50"}];o({...i,severity:e})}}>Add Severity Range</button>
        </div>
      </div>
    `}_getSeverityColor(e,t){if(t&&0!==t.length)for(const o of t)if(e>=o.from&&e<=o.to)return o.color}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"horizontal",name:"Horizontal",description:"Arrange child modules in a row",category:"layout",icon:"mdi:arrow-split-vertical"}}createDefault(){return{id:ke("horizontal"),type:"horizontal",modules:[],gap:"8px",align:"center",justify:"start"}}renderPreview(e,t){const o=e,i=o.modules||[];return X`
      <div class="mc-module mc-horizontal"
        style="gap:${o.gap||"8px"}; align-items:${o.align||"center"}; justify-content:${o.justify||"start"}">
        ${i.length>0?i.map(e=>{const o=xe.get(e.type);return o?o.renderPreview(e,t):X`<span class="mc-error">?</span>`}):X`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty row</span>`}
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ie("Gap",i.gap,e=>o({...i,gap:e}))}
        ${Pe("Align",i.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>o({...i,align:e}))}
        ${Pe("Justify",i.justify,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Space Between",value:"space-between"},{label:"Space Around",value:"space-around"}],e=>o({...i,justify:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"vertical",name:"Vertical",description:"Arrange child modules in a column",category:"layout",icon:"mdi:arrow-split-horizontal"}}createDefault(){return{id:ke("vertical"),type:"vertical",modules:[],gap:"8px",align:"stretch"}}renderPreview(e,t){const o=e,i=o.modules||[];return X`
      <div class="mc-module mc-vertical"
        style="gap:${o.gap||"8px"}; align-items:${o.align||"stretch"}">
        ${i.length>0?i.map(e=>{const o=xe.get(e.type);return o?o.renderPreview(e,t):X`<span class="mc-error">?</span>`}):X`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty column</span>`}
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ie("Gap",i.gap,e=>o({...i,gap:e}))}
        ${Pe("Align",i.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>o({...i,align:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"tabs",name:"Tabs",description:"Tabbed container for groups of modules",category:"layout",icon:"mdi:tab"}}createDefault(){return{id:ke("tabs"),type:"tabs",tabs:[{label:"Tab 1",modules:[]},{label:"Tab 2",modules:[]}],active_tab:0,tab_style:"default"}}renderPreview(e,t){const o=e,i=o.tabs||[],r=o.active_tab||0,n=i[r];return X`
      <div class="mc-module mc-tabs">
        <div class="mc-tabs-header">
          ${i.map((e,t)=>X`
              <button class="mc-tab-button ${t===r?"active":""}">
                ${e.icon?X`<ha-icon icon=${e.icon} style="--mdc-icon-size:16px"></ha-icon>`:""}
                ${e.label}
              </button>
            `)}
        </div>
        <div class="mc-tabs-content">
          ${n?.modules?.length?n.modules.map(e=>{const o=xe.get(e.type);return o?o.renderPreview(e,t):X`<span class="mc-error">?</span>`}):X`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty tab</span>`}
        </div>
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Pe("Tab Style",i.tab_style,[{label:"Default",value:"default"},{label:"Pills",value:"pills"},{label:"Underline",value:"underline"}],e=>o({...i,tab_style:e}))}
        <div class="mc-section">
          <div class="mc-section-header">Tabs</div>
          ${(i.tabs||[]).map((e,t)=>X`
              <div class="mc-field" style="display:flex;gap:8px;align-items:center">
                <input type="text" .value=${e.label}
                  @input=${e=>{const r=[...i.tabs||[]];r[t]={...r[t],label:e.target.value},o({...i,tabs:r})}} />
                <button class="mc-btn-icon" @click=${()=>{const e=(i.tabs||[]).filter((e,o)=>o!==t);o({...i,tabs:e})}}>&times;</button>
              </div>
            `)}
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...i.tabs||[],{label:`Tab ${(i.tabs||[]).length+1}`,modules:[]}];o({...i,tabs:e})}}>Add Tab</button>
        </div>
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"separator",name:"Separator",description:"Visual divider between modules",category:"layout",icon:"mdi:minus"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:ke("separator"),type:"separator",separator_style:"solid",separator_color:"var(--divider-color, #e5e7eb)",separator_width:"1px",direction:"horizontal"}}renderPreview(e,t){const o=e;return"vertical"===o.direction?X`
        <div class="mc-module mc-separator-vertical"
          style="border-left-style:${o.separator_style||"solid"}; border-left-color:${o.separator_color||"var(--divider-color)"}; border-left-width:${o.separator_width||"1px"}">
        </div>
      `:X`
      <hr class="mc-module mc-separator"
        style="border-top-style:${o.separator_style||"solid"}; border-top-color:${o.separator_color||"var(--divider-color)"}; border-top-width:${o.separator_width||"1px"}" />
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Pe("Direction",i.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>o({...i,direction:e}))}
        ${Pe("Style",i.separator_style,[{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"None",value:"none"}],e=>o({...i,separator_style:e}))}
        ${je("Color",i.separator_color,e=>o({...i,separator_color:e}))}
        ${Ie("Width",i.separator_width,e=>o({...i,separator_width:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"clock",name:"Clock",description:"Display current time and date",category:"advanced",icon:"mdi:clock-outline"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:ke("clock"),type:"clock",format_12h:!1,show_seconds:!1,show_date:!0,date_format:"short"}}renderPreview(e,t){const o=e,i=new Date,r={hour:"2-digit",minute:"2-digit",hour12:o.format_12h??!1};o.show_seconds&&(r.second="2-digit");const n=i.toLocaleTimeString(void 0,r),a=o.show_date?i.toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric"}):"";return X`
      <div class="mc-module mc-clock">
        <span class="mc-clock-time">${n}</span>
        ${o.show_date?X`<span class="mc-clock-date">${a}</span>`:K}
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${ze("12-Hour Format",i.format_12h,e=>o({...i,format_12h:e}))}
        ${ze("Show Seconds",i.show_seconds,e=>o({...i,show_seconds:e}))}
        ${ze("Show Date",i.show_date,e=>o({...i,show_date:e}))}
        ${Ie("Date Format",i.date_format,e=>o({...i,date_format:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"weather",name:"Weather",description:"Display weather entity information",category:"advanced",icon:"mdi:weather-partly-cloudy"}}createDefault(){return{id:ke("weather"),type:"weather",show_temperature:!0,show_condition:!0,show_forecast:!1,forecast_days:5}}renderPreview(e,t){const o=e,i=o.entity&&t?t.states[o.entity]:void 0,r=i?.attributes.temperature,n=i?.state||"unknown",a=i?.attributes.temperature_unit||"°C",s=this._conditionIcon(n);return X`
      <div class="mc-module mc-weather">
        <ha-icon icon=${s} style="--mdc-icon-size:36px"></ha-icon>
        <div>
          ${o.show_temperature&&void 0!==r?X`<div class="mc-weather-temp">${r}${a}</div>`:K}
          ${o.show_condition?X`<div class="mc-weather-condition">${n}</div>`:K}
        </div>
      </div>
    `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Weather Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${ze("Show Temperature",i.show_temperature,e=>o({...i,show_temperature:e}))}
        ${ze("Show Condition",i.show_condition,e=>o({...i,show_condition:e}))}
        ${ze("Show Forecast",i.show_forecast,e=>o({...i,show_forecast:e}))}
        ${i.show_forecast?Oe("Forecast Days",i.forecast_days,e=>o({...i,forecast_days:e}),{min:1,max:7}):K}
      </div>
    `}_conditionIcon(e){return{"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant",exceptional:"mdi:alert-circle-outline"}[e]||"mdi:weather-partly-cloudy"}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"forecast",name:"Forecast",description:"Display weather forecast data",category:"advanced",icon:"mdi:calendar-week"}}createDefault(){return{id:ke("forecast"),type:"forecast",forecast_type:"daily",num_forecasts:5,show_temperature:!0,show_precipitation:!0,show_wind:!1}}renderPreview(e,t){const o=e,i=o.entity&&t?t.states[o.entity]:void 0,r=(i?.attributes.forecast||[]).slice(0,o.num_forecasts||5);return r.length?X`
      <div class="mc-module mc-forecast">
        ${r.map(e=>X`
            <div class="mc-forecast-item">
              <span style="font-size:0.75rem;color:var(--mc-text-secondary)">
                ${e.datetime?new Date(e.datetime).toLocaleDateString(void 0,{weekday:"short"}):""}
              </span>
              <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
              ${o.show_temperature?X`<span style="font-size:0.875rem">${e.temperature??"--"}°</span>`:K}
              ${o.show_precipitation&&void 0!==e.precipitation?X`<span style="font-size:0.75rem;color:var(--mc-text-secondary)">${e.precipitation}mm</span>`:K}
            </div>
          `)}
      </div>
    `:X`
        <div class="mc-module mc-forecast">
          ${Array.from({length:o.num_forecasts||5}).map((e,t)=>X`
              <div class="mc-forecast-item">
                <span style="font-size:0.75rem;color:var(--mc-text-secondary)">Day ${t+1}</span>
                <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
                <span style="font-size:0.875rem">--°</span>
              </div>
            `)}
        </div>
      `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ne("Weather Entity",i.entity,e=>o({...i,entity:e}),t)}
        ${Pe("Forecast Type",i.forecast_type,[{label:"Daily",value:"daily"},{label:"Hourly",value:"hourly"}],e=>o({...i,forecast_type:e}))}
        ${Oe("Number of Forecasts",i.num_forecasts,e=>o({...i,num_forecasts:e}),{min:1,max:10})}
        ${ze("Show Temperature",i.show_temperature,e=>o({...i,show_temperature:e}))}
        ${ze("Show Precipitation",i.show_precipitation,e=>o({...i,show_precipitation:e}))}
        ${ze("Show Wind",i.show_wind,e=>o({...i,show_wind:e}))}
      </div>
    `}});xe.register(new class extends xn{constructor(){super(...arguments),this.metadata={type:"video-bg",name:"Video Background",description:"Display a video as a background",category:"advanced",icon:"mdi:video-outline"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:ke("video-bg"),type:"video-bg",autoplay:!0,loop:!0,muted:!0}}renderPreview(e,t){const o=e;return o.url?X`
      <div class="mc-module mc-video-bg">
        <video
          src=${o.url}
          poster=${o.poster||K}
          ?autoplay=${o.autoplay}
          ?loop=${o.loop}
          ?muted=${o.muted}
          playsinline
        ></video>
      </div>
    `:X`
        <div class="mc-module mc-video-bg" style="display:flex;align-items:center;justify-content:center;height:120px;background:var(--mc-border);border-radius:8px">
          <ha-icon icon="mdi:video-off-outline" style="--mdc-icon-size:32px;color:var(--mc-text-secondary)"></ha-icon>
        </div>
      `}renderGeneralTab(e,t,o){const i=e;return X`
      <div class="mc-tab-content">
        ${Ie("Video URL",i.url,e=>o({...i,url:e}))}
        ${Ie("Poster Image URL",i.poster,e=>o({...i,poster:e}))}
        ${ze("Autoplay",i.autoplay,e=>o({...i,autoplay:e}))}
        ${ze("Loop",i.loop,e=>o({...i,loop:e}))}
        ${ze("Muted",i.muted,e=>o({...i,muted:e}))}
      </div>
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:e,name:"Magic Card",description:"A fully open-source multi-module card with advanced editor",preview:!0,documentationURL:"https://github.com/your-repo/magic-card"}),console.info("%c MAGIC-CARD %c v0.1.0 ","color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;")})();