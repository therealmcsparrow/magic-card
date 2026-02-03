(()=>{"use strict";const e="magic-card",t="magic-card-editor",r=["content","controls","layout","advanced"],i=globalThis,o=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),a=new WeakMap;class s{constructor(e,t,r){if(this._$cssResult$=!0,r!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(o&&void 0===e){const r=void 0!==t&&1===t.length;r&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&a.set(t,e))}return e}toString(){return this.cssText}}const c=(e,...t)=>{const r=1===e.length?e[0]:t.reduce((t,r,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[i+1],e[0]);return new s(r,e,n)},l=(e,t)=>{if(o)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const r of t){const t=document.createElement("style"),o=i.litNonce;void 0!==o&&t.setAttribute("nonce",o),t.textContent=r.cssText,e.appendChild(t)}},d=o?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:p,defineProperty:u,getOwnPropertyDescriptor:h,getOwnPropertyNames:m,getOwnPropertySymbols:g,getPrototypeOf:f}=Object,v=globalThis,b=v.trustedTypes,y=b?b.emptyScript:"",x=v.reactiveElementPolyfillSupport,_=(e,t)=>e,w={toAttribute(e,t){switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},$=(e,t)=>!p(e,t),k={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),v.litPropertyMetadata??=new WeakMap;class S extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=k){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(e,r,t);void 0!==i&&u(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){const{get:i,set:o}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);o?.call(this,t),this.requestUpdate(e,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??k}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=f(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...m(e),...g(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const r=this._$Eu(e,t);void 0!==r&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(d(e))}else void 0!==e&&t.push(d(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return l(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(void 0!==i&&!0===r.reflect){const o=(void 0!==r.converter?.toAttribute?r.converter:w).toAttribute(t,r.type);this._$Em=e,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){const r=this.constructor,i=r._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=r.getPropertyOptions(i),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:w;this._$Em=i;const n=o.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,r,i=!1,o){if(void 0!==e){const n=this.constructor;if(!1===i&&(o=this[e]),r??=n.getPropertyOptions(e),!((r.hasChanged??$)(o,t)||r.useDefault&&r.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:i,wrapped:o},n){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==o||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,r,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[_("elementProperties")]=new Map,S[_("finalized")]=new Map,x?.({ReactiveElement:S}),(v.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,C=e=>e,M=A.trustedTypes,T=M?M.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+I,O=`<${z}>`,D=document,P=()=>D.createComment(""),j=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,N=e=>R(e)||"function"==typeof e?.[Symbol.iterator],L="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,F=/>/g,B=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),q=/'/g,G=/"/g,W=/^(?:script|style|textarea|title)$/i,Y=e=>(t,...r)=>({_$litType$:e,strings:t,values:r}),V=Y(1),Q=(Y(2),Y(3),Symbol.for("lit-noChange")),K=Symbol.for("lit-nothing"),J=new WeakMap,Z=D.createTreeWalker(D,129);function X(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==T?T.createHTML(t):t}const ee=(e,t)=>{const r=e.length-1,i=[];let o,n=2===t?"<svg>":3===t?"<math>":"",a=U;for(let t=0;t<r;t++){const r=e[t];let s,c,l=-1,d=0;for(;d<r.length&&(a.lastIndex=d,c=a.exec(r),null!==c);)d=a.lastIndex,a===U?"!--"===c[1]?a=H:void 0!==c[1]?a=F:void 0!==c[2]?(W.test(c[2])&&(o=RegExp("</"+c[2],"g")),a=B):void 0!==c[3]&&(a=B):a===B?">"===c[0]?(a=o??U,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,s=c[1],a=void 0===c[3]?B:'"'===c[3]?G:q):a===G||a===q?a=B:a===H||a===F?a=U:(a=B,o=void 0);const p=a===B&&e[t+1].startsWith("/>")?" ":"";n+=a===U?r+O:l>=0?(i.push(s),r.slice(0,l)+E+r.slice(l)+I+p):r+I+(-2===l?t:p)}return[X(e,n+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class te{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let o=0,n=0;const a=e.length-1,s=this.parts,[c,l]=ee(e,t);if(this.el=te.createElement(c,r),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=Z.nextNode())&&s.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(E)){const t=l[n++],r=i.getAttribute(e).split(I),a=/([.?@])?(.*)/.exec(t);s.push({type:1,index:o,name:a[2],strings:r,ctor:"."===a[1]?ae:"?"===a[1]?se:"@"===a[1]?ce:ne}),i.removeAttribute(e)}else e.startsWith(I)&&(s.push({type:6,index:o}),i.removeAttribute(e));if(W.test(i.tagName)){const e=i.textContent.split(I),t=e.length-1;if(t>0){i.textContent=M?M.emptyScript:"";for(let r=0;r<t;r++)i.append(e[r],P()),Z.nextNode(),s.push({type:2,index:++o});i.append(e[t],P())}}}else if(8===i.nodeType)if(i.data===z)s.push({type:2,index:o});else{let e=-1;for(;-1!==(e=i.data.indexOf(I,e+1));)s.push({type:7,index:o}),e+=I.length-1}o++}}static createElement(e,t){const r=D.createElement("template");return r.innerHTML=e,r}}function re(e,t,r=e,i){if(t===Q)return t;let o=void 0!==i?r._$Co?.[i]:r._$Cl;const n=j(t)?void 0:t._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(e),o._$AT(e,r,i)),void 0!==i?(r._$Co??=[])[i]=o:r._$Cl=o),void 0!==o&&(t=re(e,o._$AS(e,t.values),o,i)),t}class ie{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,i=(e?.creationScope??D).importNode(t,!0);Z.currentNode=i;let o=Z.nextNode(),n=0,a=0,s=r[0];for(;void 0!==s;){if(n===s.index){let t;2===s.type?t=new oe(o,o.nextSibling,this,e):1===s.type?t=new s.ctor(o,s.name,s.strings,this,e):6===s.type&&(t=new le(o,this,e)),this._$AV.push(t),s=r[++a]}n!==s?.index&&(o=Z.nextNode(),n++)}return Z.currentNode=D,i}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class oe{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,i){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=re(this,e,t),j(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==Q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):N(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&j(this._$AH)?this._$AA.nextSibling.data=e:this.T(D.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,i="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=te.createElement(X(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new ie(i,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=J.get(e.strings);return void 0===t&&J.set(e.strings,t=new te(e)),t}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,i=0;for(const o of e)i===t.length?t.push(r=new oe(this.O(P()),this.O(P()),this,this.options)):r=t[i],r._$AI(o),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=C(e).nextSibling;C(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ne{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,o){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=o,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=K}_$AI(e,t=this,r,i){const o=this.strings;let n=!1;if(void 0===o)e=re(this,e,t,0),n=!j(e)||e!==this._$AH&&e!==Q,n&&(this._$AH=e);else{const i=e;let a,s;for(e=o[0],a=0;a<o.length-1;a++)s=re(this,i[r+a],t,a),s===Q&&(s=this._$AH[a]),n||=!j(s)||s!==this._$AH[a],s===K?e=K:e!==K&&(e+=(s??"")+o[a+1]),this._$AH[a]=s}n&&!i&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ae extends ne{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class se extends ne{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class ce extends ne{constructor(e,t,r,i,o){super(e,t,r,i,o),this.type=5}_$AI(e,t=this){if((e=re(this,e,t,0)??K)===Q)return;const r=this._$AH,i=e===K&&r!==K||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,o=e!==K&&(r===K||i);i&&this.element.removeEventListener(this.name,this,r),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class le{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){re(this,e)}}const de=A.litHtmlPolyfillSupport;de?.(te,oe),(A.litHtmlVersions??=[]).push("3.3.2");const pe=globalThis;class ue extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const i=r?.renderBefore??t;let o=i._$litPart$;if(void 0===o){const e=r?.renderBefore??null;i._$litPart$=o=new oe(t.insertBefore(P(),e),e,void 0,r??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Q}}ue._$litElement$=!0,ue.finalized=!0,pe.litElementHydrateSupport?.({LitElement:ue});const he=pe.litElementPolyfillSupport;he?.({LitElement:ue});(pe.litElementVersions??=[]).push("4.2.2");const me=e=>(t,r)=>{void 0!==r?r.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},ge={attribute:!0,type:String,converter:w,reflect:!1,hasChanged:$},fe=(e=ge,t,r)=>{const{kind:i,metadata:o}=r;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===i&&((e=Object.create(e)).wrapped=!0),n.set(r.name,e),"accessor"===i){const{name:i}=r;return{set(r){const o=t.get.call(this);t.set.call(this,r),this.requestUpdate(i,o,e,!0,r)},init(t){return void 0!==t&&this.C(i,void 0,e,t),t}}}if("setter"===i){const{name:i}=r;return function(r){const o=this[i];t.call(this,r),this.requestUpdate(i,o,e,!0,r)}}throw Error("Unsupported decorator location: "+i)};function ve(e){return(t,r)=>"object"==typeof r?fe(e,t,r):((e,t,r)=>{const i=t.hasOwnProperty(r);return t.constructor.createProperty(r,e),i?Object.getOwnPropertyDescriptor(t,r):void 0})(e,t,r)}function be(e){return ve({...e,state:!0,attribute:!1})}const ye=c`
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
`;const xe=new class{constructor(){this.modules=new Map}register(e){this.modules.set(e.metadata.type,e)}get(e){return this.modules.get(e)}getAll(){return Array.from(this.modules.values())}getByCategory(e){return this.getAll().filter(t=>t.metadata.category===e)}getMetadata(){return this.getAll().map(e=>e.metadata)}search(e){const t=e.toLowerCase();return this.getAll().filter(e=>e.metadata.name.toLowerCase().includes(t)||e.metadata.description.toLowerCase().includes(t)||e.metadata.type.toLowerCase().includes(t))}createDefault(e){const t=this.get(e);return t?t.createDefault():null}has(e){return this.modules.has(e)}get types(){return Array.from(this.modules.keys())}},_e={font_size:"font-size",font_weight:"font-weight",font_family:"font-family",line_height:"line-height",text_align:"text-align",text_transform:"text-transform",letter_spacing:"letter-spacing",color:"color",background:"background",opacity:"opacity",padding:"padding",margin:"margin",border:"border",border_radius:"border-radius",border_color:"border-color",box_shadow:"box-shadow",text_shadow:"text-shadow",width:"width",height:"height",min_width:"min-width",min_height:"min-height",max_width:"max-width",max_height:"max-height",overflow:"overflow",flex:"flex",filter:"filter",backdrop_filter:"backdrop-filter",transform:"transform",transition:"transition"};function we(e){if(!e)return"";const t=[];for(const[r,i]of Object.entries(_e)){const o=e[r];void 0!==o&&"string"==typeof o&&t.push(`${i}: ${o}`)}return e.css&&t.push(e.css),t.join("; ")}let $e=0;function ke(e="mc"){$e++;return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}_${$e}`}var Se=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};let Ae=class extends ue{static getConfigElement(){return document.createElement(t)}static getStubConfig(){return{type:`custom:${e}`,rows:[{id:ke("row"),layout:"1",columns:[{id:ke("col"),modules:[{id:ke("text"),type:"text",text:"Welcome to Magic Card"}]}]}]}}setConfig(e){if(!e)throw new Error("No configuration provided");this._config={...e,rows:e.rows||[]},this._config.rows=this._config.rows.map(e=>({...e,id:e.id||ke("row"),columns:(e.columns||[]).map(e=>({...e,id:e.id||ke("col"),modules:(e.modules||[]).map(e=>({...e,id:e.id||ke(e.type)}))}))}))}getCardSize(){return this._config?.rows?Math.max(this._config.rows.length,1):1}render(){if(!this._config)return V`<ha-card><div class="mc-error">No configuration</div></ha-card>`;const e=this._buildCardStyle();return V`
      <ha-card>
        <div class="mc-card-content" style=${e}>
          ${this._config.rows.map(e=>this._renderRow(e))}
        </div>
      </ha-card>
    `}_buildCardStyle(){const e=[],t=this._config;return t.padding&&e.push(`padding: ${t.padding}`),t.background&&e.push(`background: ${t.background}`),t.border_radius&&e.push(`border-radius: ${t.border_radius}`),t.box_shadow&&e.push(`box-shadow: ${t.box_shadow}`),t.card_height&&e.push(`min-height: ${t.card_height}`),t.overflow&&e.push(`overflow: ${t.overflow}`),e.join("; ")}_renderRow(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return V``;var t;const r=`grid-template-columns: ${(t=e.layout||"1")?{1:"1fr","1-1":"1fr 1fr","1-2":"1fr 2fr","2-1":"2fr 1fr","1-1-1":"1fr 1fr 1fr","1-2-1":"1fr 2fr 1fr"}[t]||t:"1fr"}; gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,i=we(e.design);return V`
      <div class="mc-row" style="${r}; ${i}">
        ${e.columns.map(e=>this._renderColumn(e))}
      </div>
    `}_renderColumn(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return V``;const t=`gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,r=we(e.design);return V`
      <div
        class="mc-column"
        data-valign=${e.vertical_align||K}
        style="${t}; ${r}"
      >
        ${e.modules.map(e=>this._renderModule(e))}
      </div>
    `}_renderModule(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return V``;const t=xe.get(e.type);if(!t)return V`<div class="mc-error">Unknown module: ${e.type}</div>`;const r=we(e.design),i=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return V`
      <div
        class="mc-module-wrapper ${i?"mc-hoverable":""}"
        style=${r}
        @click=${i?t=>this._handleAction(t,e,"tap"):K}
        @contextmenu=${i?t=>this._handleAction(t,e,"hold"):K}
        @dblclick=${i?t=>this._handleAction(t,e,"double_tap"):K}
      >
        ${t.renderPreview(e,this.hass)}
      </div>
    `}_evaluateDisplay(e){if(!e.conditions?.length)return!0;if(!this.hass)return!0;const t=e.conditions.map(e=>{switch(e.type){case"state":{if(!e.entity)return!0;const t=this.hass.states[e.entity];return!!t&&(void 0!==e.state&&""!==e.state?t.state===e.state:void 0!==e.state_not&&""!==e.state_not?t.state!==e.state_not:!(void 0!==e.above&&Number(t.state)<=e.above)&&!(void 0!==e.below&&Number(t.state)>=e.below))}case"attribute":{if(!e.entity||!e.attribute)return!0;const t=this.hass.states[e.entity];if(!t)return!1;const r=String(t.attributes[e.attribute]??"");return void 0!==e.state&&""!==e.state?r===e.state:void 0===e.state_not||""===e.state_not||r!==e.state_not}case"time":{const t=new Date,r=60*t.getHours()+t.getMinutes();if(e.after){const[t,i]=e.after.split(":").map(Number);if(r<60*t+i)return!1}if(e.before){const[t,i]=e.before.split(":").map(Number);if(r>=60*t+i)return!1}return!0}default:return!0}});return"any"===e.mode?t.some(Boolean):t.every(Boolean)}_handleAction(e,t,r){"hold"===r&&e.preventDefault();const i=`${r}_action`,o=t.actions?.[i];if(!o||"none"===o.action)return;const n=t.entity;switch(o.action){case"more-info":if(n||o.entity){const e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:o.entity||n}});this.dispatchEvent(e)}break;case"toggle":if(n||o.entity){const e=o.entity||n,t=e.split(".")[0];this.hass?.callService(t,"toggle",{entity_id:e})}break;case"navigate":if(o.navigation_path){history.pushState(null,"",o.navigation_path);const e=new Event("location-changed",{bubbles:!0,composed:!0});window.dispatchEvent(e)}break;case"url":o.url_path&&window.open(o.url_path,"_blank");break;case"perform-action":if(o.service){const[e,t]=o.service.split(".");this.hass?.callService(e,t,{...o.data,...o.service_data})}break;case"assist":this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}}}))}}};Ae.styles=ye,Se([ve({attribute:!1})],Ae.prototype,"hass",void 0),Se([be()],Ae.prototype,"_config",void 0),Ae=Se([me(e)],Ae);const Ce=c`
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
`;function Me(e){if(null===e||"object"!=typeof e)return e;if(Array.isArray(e))return e.map(e=>Me(e));const t={};for(const r of Object.keys(e))t[r]=Me(e[r]);return t}class Te{constructor(e=50){this.undoStack=[],this.redoStack=[],this.limit=e}push(e){this.undoStack.push(Me(e)),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack=[]}undo(e){return 0===this.undoStack.length?null:(this.redoStack.push(Me(e)),this.undoStack.pop())}redo(e){return 0===this.redoStack.length?null:(this.undoStack.push(Me(e)),this.redoStack.pop())}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}clear(){this.undoStack=[],this.redoStack=[]}get undoCount(){return this.undoStack.length}get redoCount(){return this.redoStack.length}}class Ee{constructor(e){this.fireEvent=e,this.undoRedo=new Te,this.listeners=new Set,this.state={config:{type:"custom:magic-card",rows:[]},selectedPath:null,activeTab:"general",editorMode:"form",isDirty:!1},this.dispatchConfigChanged=function(e,t){let r=null;const i=function(...i){null!==r&&clearTimeout(r),r=setTimeout(()=>{e.apply(this,i),r=null},t)};return i.cancel=()=>{null!==r&&(clearTimeout(r),r=null)},i}(e=>{this.fireEvent(e)},200)}subscribe(e){return this.listeners.add(e),e(this.state),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return this.state}getConfig(){return this.state.config}getSelectedModule(){const e=this.state.selectedPath;return void 0===e?.rowIndex||void 0===e?.columnIndex||void 0===e?.moduleIndex?null:this.state.config.rows[e.rowIndex]?.columns[e.columnIndex]?.modules[e.moduleIndex]??null}setConfig(e){this.state={...this.state,config:Me(e),isDirty:!1},this.notify()}updateConfig(e,t=!0){t&&this.undoRedo.push(this.state.config),this.state={...this.state,config:Me(e),isDirty:!0},this.notify(),this.dispatchConfigChanged(this.state.config)}setEditorMode(e){this.state={...this.state,editorMode:e},this.notify()}setSelectedPath(e){this.state={...this.state,selectedPath:e},this.notify()}setActiveTab(e){this.state={...this.state,activeTab:e},this.notify()}addRow(e="1"){const t=Me(this.state.config),r=e.split("-").length,i=Array.from({length:r},()=>({id:ke("col"),modules:[]}));t.rows.push({id:ke("row"),layout:e,columns:i}),this.updateConfig(t)}deleteRow(e){const t=Me(this.state.config);t.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(t)}moveRow(e,t){if(e===t)return;const r=Me(this.state.config),[i]=r.rows.splice(e,1);r.rows.splice(t,0,i),this.updateConfig(r)}updateRow(e,t){const r=Me(this.state.config);r.rows[e]={...r.rows[e],...t},this.updateConfig(r)}addColumn(e){const t=Me(this.state.config);t.rows[e].columns.push({id:ke("col"),modules:[]}),this.updateConfig(t)}deleteColumn(e,t){const r=Me(this.state.config);r.rows[e].columns.splice(t,1),0===r.rows[e].columns.length&&r.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(r)}addModule(e,t,r){const i=Me(this.state.config),o=xe.createDefault(r);if(!o)return;i.rows[e].columns[t].modules.push(o);const n=i.rows[e].columns[t].modules.length-1;this.updateConfig(i),this.setSelectedPath({rowIndex:e,columnIndex:t,moduleIndex:n})}deleteModule(e,t,r){const i=Me(this.state.config);i.rows[e].columns[t].modules.splice(r,1),this.state.selectedPath=null,this.updateConfig(i)}updateModule(e,t,r,i){const o=Me(this.state.config),n=o.rows[e].columns[t].modules[r];o.rows[e].columns[t].modules[r]={...n,...i},this.updateConfig(o)}moveModule(e,t,r,i,o,n){const a=Me(this.state.config),[s]=a.rows[e].columns[t].modules.splice(r,1);a.rows[i].columns[o].modules.splice(n,0,s),this.updateConfig(a),this.setSelectedPath({rowIndex:i,columnIndex:o,moduleIndex:n})}undo(){const e=this.undoRedo.undo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}redo(){const e=this.undoRedo.redo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}canUndo(){return this.undoRedo.canUndo()}canRedo(){return this.undoRedo.canRedo()}destroy(){this.dispatchConfigChanged.cancel(),this.listeners.clear(),this.undoRedo.clear()}}const Ie=c`
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
`;function ze(e,t,r){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="text"
        .value=${t||""}
        @input=${e=>r(e.target.value)}
      />
    </div>
  `}function Oe(e,t,r,i){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="number"
        .value=${String(t??"")}
        min=${i?.min??K}
        max=${i?.max??K}
        step=${i?.step??K}
        @input=${e=>r(Number(e.target.value))}
      />
    </div>
  `}function De(e,t,r,i){return V`
    <div class="mc-field">
      ${e?V`<label class="mc-field-label">${e}</label>`:K}
      <select @change=${e=>i(e.target.value)}>
        ${r.map(e=>V`<option value=${e.value} ?selected=${t===e.value}>
              ${e.label}
            </option>`)}
      </select>
    </div>
  `}function Pe(e,t,r){return V`
    <div class="mc-field mc-field-toggle">
      <label class="mc-field-label">${e}</label>
      <input
        type="checkbox"
        .checked=${t??!1}
        @change=${e=>r(e.target.checked)}
      />
    </div>
  `}function je(e,t,r,i){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-entity-picker
        .hass=${i}
        .value=${t||""}
        @value-changed=${e=>r(e.detail.value)}
      ></mc-entity-picker>
    </div>
  `}function Re(e,t,r){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-color-picker
        .value=${t||""}
        .label=${e}
        @value-changed=${e=>r(e.detail.value)}
      ></mc-color-picker>
    </div>
  `}function Ne(e,t,r){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-unit-field
        .value=${t||""}
        @value-changed=${e=>r(e.detail.value)}
      ></mc-unit-field>
    </div>
  `}var Le=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};let Ue=class extends ue{constructor(){super(...arguments),this._expandedSections=new Set(["card"]),this._dragOver=null,this._dragState=null}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}_onRowDragStart(e,t){this._dragState={type:"row",rowIndex:t},e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._dragState)),e.target.classList.add("dragging")}_onRowDragEnd(e){e.target.classList.remove("dragging"),this._dragState=null,this._dragOver=null}_onRowDragOver(e,t){this._dragState&&"row"===this._dragState.type&&(e.preventDefault(),e.dataTransfer.dropEffect="move",this._dragOver={type:"row",index:t})}_onRowDragLeave(){this._dragOver=null}_onRowDrop(e,t){if(e.preventDefault(),!this._dragState||"row"!==this._dragState.type)return;const r=this._dragState.rowIndex;r!==t&&this.stateManager.moveRow(r,t),this._dragState=null,this._dragOver=null}_onModuleDragStart(e,t,r,i){this._dragState={type:"module",rowIndex:t,colIndex:r,moduleIndex:i},e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._dragState)),e.target.classList.add("dragging"),e.stopPropagation()}_onModuleDragEnd(e){e.target.classList.remove("dragging"),this._dragState=null,this._dragOver=null}_onModuleDragOver(e,t,r,i){this._dragState&&"module"===this._dragState.type&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="move",this._dragOver={type:"module",index:i,colIndex:r})}_onContainerDragOver(e,t,r){this._dragState&&"module"===this._dragState.type&&(e.preventDefault(),e.dataTransfer.dropEffect="move")}_onModuleDrop(e,t,r,i){if(e.preventDefault(),e.stopPropagation(),!this._dragState||"module"!==this._dragState.type)return;const{rowIndex:o,colIndex:n,moduleIndex:a}=this._dragState;o===t&&n===r&&a===i||this.stateManager.moveModule(o,n,a,t,r,i),this._dragState=null,this._dragOver=null}_onContainerDrop(e,t,r){if(e.preventDefault(),!this._dragState||"module"!==this._dragState.type)return;const{rowIndex:i,colIndex:o,moduleIndex:n}=this._dragState,a=(this._editorState?.config.rows[t]?.columns[r]?.modules||[]).length;this.stateManager.moveModule(i,o,n,t,r,a),this._dragState=null,this._dragOver=null}render(){if(!this._editorState)return V``;const{config:e,selectedPath:t}=this._editorState;return V`
      <div class="mc-form">
        ${this._renderCardSection(e)}
        <div class="mc-rows-container">
          ${e.rows.map((e,r)=>this._renderRow(e,r,t))}
        </div>
      </div>
    `}_renderCardSection(e){const t=this._expandedSections.has("card");return V`
      <div class="mc-card-section">
        <div
          class="mc-card-section-header"
          @click=${()=>this._toggleSection("card")}
        >
          <ha-icon icon="mdi:card-outline" style="--mdc-icon-size:18px"></ha-icon>
          Card Settings
          <span class="mc-chevron ${t?"open":""}">&#9654;</span>
        </div>
        ${t?V`
              <div class="mc-card-section-body">
                ${Re("Background",e.background,t=>this.stateManager.updateConfig({...e,background:t}))}
                ${Ne("Border Radius",e.border_radius,t=>this.stateManager.updateConfig({...e,border_radius:t}))}
                ${Ne("Padding",e.padding,t=>this.stateManager.updateConfig({...e,padding:t}))}
                ${ze("Box Shadow",e.box_shadow,t=>this.stateManager.updateConfig({...e,box_shadow:t}))}
                ${Ne("Card Height",e.card_height,t=>this.stateManager.updateConfig({...e,card_height:t}))}
              </div>
            `:K}
      </div>
    `}_renderRow(e,t,r){const i="row"===this._dragOver?.type&&this._dragOver?.index===t;return V`
      <div
        class="mc-row-item ${i?"drag-over":""}"
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
          <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          <span class="mc-label">Row ${t+1}</span>
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
        <div class="mc-row-body">
          ${e.columns.map((e,i)=>this._renderColumn(e,t,i,r))}
        </div>
      </div>
    `}_renderColumn(e,t,r,i){const o=this._editorState?.config.rows[t],n=o&&o.columns.length>1;return V`
      <div class="mc-col-item">
        <div class="mc-col-header">
          <ha-icon icon="mdi:view-column" style="--mdc-icon-size:14px"></ha-icon>
          <span class="mc-label">Column ${r+1}</span>
          ${n?V`
            <button
              class="mc-btn-icon mc-btn-small"
              @click=${()=>this.stateManager.deleteColumn(t,r)}
              title="Delete column"
            >
              <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
            </button>
          `:K}
        </div>
        <div
          class="mc-modules-container"
          data-row="${t}"
          data-col="${r}"
          @dragover=${e=>this._onContainerDragOver(e,t,r)}
          @drop=${e=>this._onContainerDrop(e,t,r)}
        >
          ${e.modules.map((e,o)=>{const n=i?.rowIndex===t&&i?.columnIndex===r&&i?.moduleIndex===o,a=xe.get(e.type),s="module"===this._dragOver?.type&&this._dragOver?.index===o&&this._dragOver?.colIndex===r;return V`
              <div
                class="mc-module-item ${n?"selected":""} ${s?"drag-over":""}"
                draggable="true"
                @dragstart=${e=>this._onModuleDragStart(e,t,r,o)}
                @dragend=${e=>this._onModuleDragEnd(e)}
                @dragover=${e=>this._onModuleDragOver(e,t,r,o)}
                @drop=${e=>this._onModuleDrop(e,t,r,o)}
                @click=${()=>this.stateManager.setSelectedPath({rowIndex:t,columnIndex:r,moduleIndex:o})}
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
                  @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,r,o)}}
                  title="Delete module"
                >
                  <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
                </button>
              </div>
            `})}
        </div>
        <button
          class="mc-add-module-btn"
          @click=${()=>this.dispatchEvent(new CustomEvent("add-module",{bubbles:!0,composed:!0,detail:{rowIndex:t,colIndex:r}}))}
        >
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:14px"></ha-icon>
          Add Module
        </button>
      </div>
    `}_toggleSection(e){this._expandedSections.has(e)?this._expandedSections.delete(e):this._expandedSections.add(e),this.requestUpdate()}};function He(e){return null==e}Ue.styles=[Ce,Ie],Le([ve({attribute:!1})],Ue.prototype,"stateManager",void 0),Le([ve({attribute:!1})],Ue.prototype,"hass",void 0),Le([be()],Ue.prototype,"_editorState",void 0),Le([be()],Ue.prototype,"_expandedSections",void 0),Le([be()],Ue.prototype,"_dragOver",void 0),Ue=Le([me("mc-form-editor")],Ue);var Fe={isNothing:He,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:He(e)?[]:[e]},repeat:function(e,t){var r,i="";for(r=0;r<t;r+=1)i+=e;return i},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:function(e,t){var r,i,o,n;if(t)for(r=0,i=(n=Object.keys(t)).length;r<i;r+=1)e[o=n[r]]=t[o];return e}};function Be(e,t){var r="",i=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(r+='in "'+e.mark.name+'" '),r+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(r+="\n\n"+e.mark.snippet),i+" "+r):i}function qe(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=Be(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}qe.prototype=Object.create(Error.prototype),qe.prototype.constructor=qe,qe.prototype.toString=function(e){return this.name+": "+Be(this,e)};var Ge=qe;function We(e,t,r,i,o){var n="",a="",s=Math.floor(o/2)-1;return i-t>s&&(t=i-s+(n=" ... ").length),r-i>s&&(r=i+s-(a=" ...").length),{str:n+e.slice(t,r).replace(/\t/g,"→")+a,pos:i-t+n.length}}function Ye(e,t){return Fe.repeat(" ",t-e.length)+e}var Ve=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var r,i=/\r?\n|\r|\0/g,o=[0],n=[],a=-1;r=i.exec(e.buffer);)n.push(r.index),o.push(r.index+r[0].length),e.position<=r.index&&a<0&&(a=o.length-2);a<0&&(a=o.length-1);var s,c,l="",d=Math.min(e.line+t.linesAfter,n.length).toString().length,p=t.maxLength-(t.indent+d+3);for(s=1;s<=t.linesBefore&&!(a-s<0);s++)c=We(e.buffer,o[a-s],n[a-s],e.position-(o[a]-o[a-s]),p),l=Fe.repeat(" ",t.indent)+Ye((e.line-s+1).toString(),d)+" | "+c.str+"\n"+l;for(c=We(e.buffer,o[a],n[a],e.position,p),l+=Fe.repeat(" ",t.indent)+Ye((e.line+1).toString(),d)+" | "+c.str+"\n",l+=Fe.repeat("-",t.indent+d+3+c.pos)+"^\n",s=1;s<=t.linesAfter&&!(a+s>=n.length);s++)c=We(e.buffer,o[a+s],n[a+s],e.position-(o[a]-o[a+s]),p),l+=Fe.repeat(" ",t.indent)+Ye((e.line+s+1).toString(),d)+" | "+c.str+"\n";return l.replace(/\n$/,"")},Qe=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Ke=["scalar","sequence","mapping"];var Je=function(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===Qe.indexOf(t))throw new Ge('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=function(e){var t={};return null!==e&&Object.keys(e).forEach(function(r){e[r].forEach(function(e){t[String(e)]=r})}),t}(t.styleAliases||null),-1===Ke.indexOf(this.kind))throw new Ge('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')};function Ze(e,t){var r=[];return e[t].forEach(function(e){var t=r.length;r.forEach(function(r,i){r.tag===e.tag&&r.kind===e.kind&&r.multi===e.multi&&(t=i)}),r[t]=e}),r}function Xe(e){return this.extend(e)}Xe.prototype.extend=function(e){var t=[],r=[];if(e instanceof Je)r.push(e);else if(Array.isArray(e))r=r.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new Ge("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(r=r.concat(e.explicit))}t.forEach(function(e){if(!(e instanceof Je))throw new Ge("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new Ge("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new Ge("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),r.forEach(function(e){if(!(e instanceof Je))throw new Ge("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var i=Object.create(Xe.prototype);return i.implicit=(this.implicit||[]).concat(t),i.explicit=(this.explicit||[]).concat(r),i.compiledImplicit=Ze(i,"implicit"),i.compiledExplicit=Ze(i,"explicit"),i.compiledTypeMap=function(){var e,t,r={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function i(e){e.multi?(r.multi[e.kind].push(e),r.multi.fallback.push(e)):r[e.kind][e.tag]=r.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(i);return r}(i.compiledImplicit,i.compiledExplicit),i};var et=Xe,tt=new Je("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),rt=new Je("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),it=new Je("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),ot=new et({explicit:[tt,rt,it]});var nt=new Je("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});var at=new Je("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function st(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function ct(e){return 48<=e&&e<=55}function lt(e){return 48<=e&&e<=57}var dt=new Je("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,r=e.length,i=0,o=!1;if(!r)return!1;if("-"!==(t=e[i])&&"+"!==t||(t=e[++i]),"0"===t){if(i+1===r)return!0;if("b"===(t=e[++i])){for(i++;i<r;i++)if("_"!==(t=e[i])){if("0"!==t&&"1"!==t)return!1;o=!0}return o&&"_"!==t}if("x"===t){for(i++;i<r;i++)if("_"!==(t=e[i])){if(!st(e.charCodeAt(i)))return!1;o=!0}return o&&"_"!==t}if("o"===t){for(i++;i<r;i++)if("_"!==(t=e[i])){if(!ct(e.charCodeAt(i)))return!1;o=!0}return o&&"_"!==t}}if("_"===t)return!1;for(;i<r;i++)if("_"!==(t=e[i])){if(!lt(e.charCodeAt(i)))return!1;o=!0}return!(!o||"_"===t)},construct:function(e){var t,r=e,i=1;if(-1!==r.indexOf("_")&&(r=r.replace(/_/g,"")),"-"!==(t=r[0])&&"+"!==t||("-"===t&&(i=-1),t=(r=r.slice(1))[0]),"0"===r)return 0;if("0"===t){if("b"===r[1])return i*parseInt(r.slice(2),2);if("x"===r[1])return i*parseInt(r.slice(2),16);if("o"===r[1])return i*parseInt(r.slice(2),8)}return i*parseInt(r,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!Fe.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),pt=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var ut=/^[-+]?[0-9]+e/;var ht=new Je("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!pt.test(e)||"_"===e[e.length-1])},construct:function(e){var t,r;return r="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===r?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:r*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||Fe.isNegativeZero(e))},represent:function(e,t){var r;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(Fe.isNegativeZero(e))return"-0.0";return r=e.toString(10),ut.test(r)?r.replace("e",".e"):r},defaultStyle:"lowercase"}),mt=ot.extend({implicit:[nt,at,dt,ht]}),gt=mt,ft=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),vt=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");var bt=new Je("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==ft.exec(e)||null!==vt.exec(e))},construct:function(e){var t,r,i,o,n,a,s,c,l=0,d=null;if(null===(t=ft.exec(e))&&(t=vt.exec(e)),null===t)throw new Error("Date resolve error");if(r=+t[1],i=+t[2]-1,o=+t[3],!t[4])return new Date(Date.UTC(r,i,o));if(n=+t[4],a=+t[5],s=+t[6],t[7]){for(l=t[7].slice(0,3);l.length<3;)l+="0";l=+l}return t[9]&&(d=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(d=-d)),c=new Date(Date.UTC(r,i,o,n,a,s,l)),d&&c.setTime(c.getTime()-d),c},instanceOf:Date,represent:function(e){return e.toISOString()}});var yt=new Je("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),xt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";var _t=new Je("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,r,i=0,o=e.length,n=xt;for(r=0;r<o;r++)if(!((t=n.indexOf(e.charAt(r)))>64)){if(t<0)return!1;i+=6}return i%8==0},construct:function(e){var t,r,i=e.replace(/[\r\n=]/g,""),o=i.length,n=xt,a=0,s=[];for(t=0;t<o;t++)t%4==0&&t&&(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)),a=a<<6|n.indexOf(i.charAt(t));return 0===(r=o%4*6)?(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)):18===r?(s.push(a>>10&255),s.push(a>>2&255)):12===r&&s.push(a>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,r,i="",o=0,n=e.length,a=xt;for(t=0;t<n;t++)t%3==0&&t&&(i+=a[o>>18&63],i+=a[o>>12&63],i+=a[o>>6&63],i+=a[63&o]),o=(o<<8)+e[t];return 0===(r=n%3)?(i+=a[o>>18&63],i+=a[o>>12&63],i+=a[o>>6&63],i+=a[63&o]):2===r?(i+=a[o>>10&63],i+=a[o>>4&63],i+=a[o<<2&63],i+=a[64]):1===r&&(i+=a[o>>2&63],i+=a[o<<4&63],i+=a[64],i+=a[64]),i}}),wt=Object.prototype.hasOwnProperty,$t=Object.prototype.toString;var kt=new Je("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,r,i,o,n,a=[],s=e;for(t=0,r=s.length;t<r;t+=1){if(i=s[t],n=!1,"[object Object]"!==$t.call(i))return!1;for(o in i)if(wt.call(i,o)){if(n)return!1;n=!0}if(!n)return!1;if(-1!==a.indexOf(o))return!1;a.push(o)}return!0},construct:function(e){return null!==e?e:[]}}),St=Object.prototype.toString;var At=new Je("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,r,i,o,n,a=e;for(n=new Array(a.length),t=0,r=a.length;t<r;t+=1){if(i=a[t],"[object Object]"!==St.call(i))return!1;if(1!==(o=Object.keys(i)).length)return!1;n[t]=[o[0],i[o[0]]]}return!0},construct:function(e){if(null===e)return[];var t,r,i,o,n,a=e;for(n=new Array(a.length),t=0,r=a.length;t<r;t+=1)i=a[t],o=Object.keys(i),n[t]=[o[0],i[o[0]]];return n}}),Ct=Object.prototype.hasOwnProperty;var Mt=new Je("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,r=e;for(t in r)if(Ct.call(r,t)&&null!==r[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),Tt=gt.extend({implicit:[bt,yt],explicit:[_t,kt,At,Mt]}),Et=Object.prototype.hasOwnProperty,It=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,zt=/[\x85\u2028\u2029]/,Ot=/[,\[\]\{\}]/,Dt=/^(?:!|!!|![a-z\-]+!)$/i,Pt=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function jt(e){return Object.prototype.toString.call(e)}function Rt(e){return 10===e||13===e}function Nt(e){return 9===e||32===e}function Lt(e){return 9===e||32===e||10===e||13===e}function Ut(e){return 44===e||91===e||93===e||123===e||125===e}function Ht(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function Ft(e){return 120===e?2:117===e?4:85===e?8:0}function Bt(e){return 48<=e&&e<=57?e-48:-1}function qt(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function Gt(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function Wt(e,t,r){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:r}):e[t]=r}for(var Yt=new Array(256),Vt=new Array(256),Qt=0;Qt<256;Qt++)Yt[Qt]=qt(Qt)?1:0,Vt[Qt]=qt(Qt);function Kt(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||Tt,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Jt(e,t){var r={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return r.snippet=Ve(r),new Ge(t,r)}function Zt(e,t){throw Jt(e,t)}function Xt(e,t){e.onWarning&&e.onWarning.call(null,Jt(e,t))}var er={YAML:function(e,t,r){var i,o,n;null!==e.version&&Zt(e,"duplication of %YAML directive"),1!==r.length&&Zt(e,"YAML directive accepts exactly one argument"),null===(i=/^([0-9]+)\.([0-9]+)$/.exec(r[0]))&&Zt(e,"ill-formed argument of the YAML directive"),o=parseInt(i[1],10),n=parseInt(i[2],10),1!==o&&Zt(e,"unacceptable YAML version of the document"),e.version=r[0],e.checkLineBreaks=n<2,1!==n&&2!==n&&Xt(e,"unsupported YAML version of the document")},TAG:function(e,t,r){var i,o;2!==r.length&&Zt(e,"TAG directive accepts exactly two arguments"),i=r[0],o=r[1],Dt.test(i)||Zt(e,"ill-formed tag handle (first argument) of the TAG directive"),Et.call(e.tagMap,i)&&Zt(e,'there is a previously declared suffix for "'+i+'" tag handle'),Pt.test(o)||Zt(e,"ill-formed tag prefix (second argument) of the TAG directive");try{o=decodeURIComponent(o)}catch(t){Zt(e,"tag prefix is malformed: "+o)}e.tagMap[i]=o}};function tr(e,t,r,i){var o,n,a,s;if(t<r){if(s=e.input.slice(t,r),i)for(o=0,n=s.length;o<n;o+=1)9===(a=s.charCodeAt(o))||32<=a&&a<=1114111||Zt(e,"expected valid JSON character");else It.test(s)&&Zt(e,"the stream contains non-printable characters");e.result+=s}}function rr(e,t,r,i){var o,n,a,s;for(Fe.isObject(r)||Zt(e,"cannot merge mappings; the provided source object is unacceptable"),a=0,s=(o=Object.keys(r)).length;a<s;a+=1)n=o[a],Et.call(t,n)||(Wt(t,n,r[n]),i[n]=!0)}function ir(e,t,r,i,o,n,a,s,c){var l,d;if(Array.isArray(o))for(l=0,d=(o=Array.prototype.slice.call(o)).length;l<d;l+=1)Array.isArray(o[l])&&Zt(e,"nested arrays are not supported inside keys"),"object"==typeof o&&"[object Object]"===jt(o[l])&&(o[l]="[object Object]");if("object"==typeof o&&"[object Object]"===jt(o)&&(o="[object Object]"),o=String(o),null===t&&(t={}),"tag:yaml.org,2002:merge"===i)if(Array.isArray(n))for(l=0,d=n.length;l<d;l+=1)rr(e,t,n[l],r);else rr(e,t,n,r);else e.json||Et.call(r,o)||!Et.call(t,o)||(e.line=a||e.line,e.lineStart=s||e.lineStart,e.position=c||e.position,Zt(e,"duplicated mapping key")),Wt(t,o,n),delete r[o];return t}function or(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):Zt(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function nr(e,t,r){for(var i=0,o=e.input.charCodeAt(e.position);0!==o;){for(;Nt(o);)9===o&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),o=e.input.charCodeAt(++e.position);if(t&&35===o)do{o=e.input.charCodeAt(++e.position)}while(10!==o&&13!==o&&0!==o);if(!Rt(o))break;for(or(e),o=e.input.charCodeAt(e.position),i++,e.lineIndent=0;32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position)}return-1!==r&&0!==i&&e.lineIndent<r&&Xt(e,"deficient indentation"),i}function ar(e){var t,r=e.position;return!(45!==(t=e.input.charCodeAt(r))&&46!==t||t!==e.input.charCodeAt(r+1)||t!==e.input.charCodeAt(r+2)||(r+=3,0!==(t=e.input.charCodeAt(r))&&!Lt(t)))}function sr(e,t){1===t?e.result+=" ":t>1&&(e.result+=Fe.repeat("\n",t-1))}function cr(e,t){var r,i,o=e.tag,n=e.anchor,a=[],s=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),i=e.input.charCodeAt(e.position);0!==i&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,Zt(e,"tab characters must not be used in indentation")),45===i)&&Lt(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,nr(e,!0,-1)&&e.lineIndent<=t)a.push(null),i=e.input.charCodeAt(e.position);else if(r=e.line,pr(e,t,3,!1,!0),a.push(e.result),nr(e,!0,-1),i=e.input.charCodeAt(e.position),(e.line===r||e.lineIndent>t)&&0!==i)Zt(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=o,e.anchor=n,e.kind="sequence",e.result=a,!0)}function lr(e){var t,r,i,o,n=!1,a=!1;if(33!==(o=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&Zt(e,"duplication of a tag property"),60===(o=e.input.charCodeAt(++e.position))?(n=!0,o=e.input.charCodeAt(++e.position)):33===o?(a=!0,r="!!",o=e.input.charCodeAt(++e.position)):r="!",t=e.position,n){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&62!==o);e.position<e.length?(i=e.input.slice(t,e.position),o=e.input.charCodeAt(++e.position)):Zt(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==o&&!Lt(o);)33===o&&(a?Zt(e,"tag suffix cannot contain exclamation marks"):(r=e.input.slice(t-1,e.position+1),Dt.test(r)||Zt(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),o=e.input.charCodeAt(++e.position);i=e.input.slice(t,e.position),Ot.test(i)&&Zt(e,"tag suffix cannot contain flow indicator characters")}i&&!Pt.test(i)&&Zt(e,"tag name cannot contain such characters: "+i);try{i=decodeURIComponent(i)}catch(t){Zt(e,"tag name is malformed: "+i)}return n?e.tag=i:Et.call(e.tagMap,r)?e.tag=e.tagMap[r]+i:"!"===r?e.tag="!"+i:"!!"===r?e.tag="tag:yaml.org,2002:"+i:Zt(e,'undeclared tag handle "'+r+'"'),!0}function dr(e){var t,r;if(38!==(r=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&Zt(e,"duplication of an anchor property"),r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!Lt(r)&&!Ut(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&Zt(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function pr(e,t,r,i,o){var n,a,s,c,l,d,p,u,h,m=1,g=!1,f=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,n=a=s=4===r||3===r,i&&nr(e,!0,-1)&&(g=!0,e.lineIndent>t?m=1:e.lineIndent===t?m=0:e.lineIndent<t&&(m=-1)),1===m)for(;lr(e)||dr(e);)nr(e,!0,-1)?(g=!0,s=n,e.lineIndent>t?m=1:e.lineIndent===t?m=0:e.lineIndent<t&&(m=-1)):s=!1;if(s&&(s=g||o),1!==m&&4!==r||(u=1===r||2===r?t:t+1,h=e.position-e.lineStart,1===m?s&&(cr(e,h)||function(e,t,r){var i,o,n,a,s,c,l,d=e.tag,p=e.anchor,u={},h=Object.create(null),m=null,g=null,f=null,v=!1,b=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=u),l=e.input.charCodeAt(e.position);0!==l;){if(v||-1===e.firstTabInLine||(e.position=e.firstTabInLine,Zt(e,"tab characters must not be used in indentation")),i=e.input.charCodeAt(e.position+1),n=e.line,63!==l&&58!==l||!Lt(i)){if(a=e.line,s=e.lineStart,c=e.position,!pr(e,r,2,!1,!0))break;if(e.line===n){for(l=e.input.charCodeAt(e.position);Nt(l);)l=e.input.charCodeAt(++e.position);if(58===l)Lt(l=e.input.charCodeAt(++e.position))||Zt(e,"a whitespace character is expected after the key-value separator within a block mapping"),v&&(ir(e,u,h,m,g,null,a,s,c),m=g=f=null),b=!0,v=!1,o=!1,m=e.tag,g=e.result;else{if(!b)return e.tag=d,e.anchor=p,!0;Zt(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!b)return e.tag=d,e.anchor=p,!0;Zt(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===l?(v&&(ir(e,u,h,m,g,null,a,s,c),m=g=f=null),b=!0,v=!0,o=!0):v?(v=!1,o=!0):Zt(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,l=i;if((e.line===n||e.lineIndent>t)&&(v&&(a=e.line,s=e.lineStart,c=e.position),pr(e,t,4,!0,o)&&(v?g=e.result:f=e.result),v||(ir(e,u,h,m,g,f,a,s,c),m=g=f=null),nr(e,!0,-1),l=e.input.charCodeAt(e.position)),(e.line===n||e.lineIndent>t)&&0!==l)Zt(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return v&&ir(e,u,h,m,g,null,a,s,c),b&&(e.tag=d,e.anchor=p,e.kind="mapping",e.result=u),b}(e,h,u))||function(e,t){var r,i,o,n,a,s,c,l,d,p,u,h,m=!0,g=e.tag,f=e.anchor,v=Object.create(null);if(91===(h=e.input.charCodeAt(e.position)))a=93,l=!1,n=[];else{if(123!==h)return!1;a=125,l=!0,n={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=n),h=e.input.charCodeAt(++e.position);0!==h;){if(nr(e,!0,t),(h=e.input.charCodeAt(e.position))===a)return e.position++,e.tag=g,e.anchor=f,e.kind=l?"mapping":"sequence",e.result=n,!0;m?44===h&&Zt(e,"expected the node content, but found ','"):Zt(e,"missed comma between flow collection entries"),u=null,s=c=!1,63===h&&Lt(e.input.charCodeAt(e.position+1))&&(s=c=!0,e.position++,nr(e,!0,t)),r=e.line,i=e.lineStart,o=e.position,pr(e,t,1,!1,!0),p=e.tag,d=e.result,nr(e,!0,t),h=e.input.charCodeAt(e.position),!c&&e.line!==r||58!==h||(s=!0,h=e.input.charCodeAt(++e.position),nr(e,!0,t),pr(e,t,1,!1,!0),u=e.result),l?ir(e,n,v,p,d,u,r,i,o):s?n.push(ir(e,null,v,p,d,u,r,i,o)):n.push(d),nr(e,!0,t),44===(h=e.input.charCodeAt(e.position))?(m=!0,h=e.input.charCodeAt(++e.position)):m=!1}Zt(e,"unexpected end of the stream within a flow collection")}(e,u)?f=!0:(a&&function(e,t){var r,i,o,n,a=1,s=!1,c=!1,l=t,d=0,p=!1;if(124===(n=e.input.charCodeAt(e.position)))i=!1;else{if(62!==n)return!1;i=!0}for(e.kind="scalar",e.result="";0!==n;)if(43===(n=e.input.charCodeAt(++e.position))||45===n)1===a?a=43===n?3:2:Zt(e,"repeat of a chomping mode identifier");else{if(!((o=Bt(n))>=0))break;0===o?Zt(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):c?Zt(e,"repeat of an indentation width identifier"):(l=t+o-1,c=!0)}if(Nt(n)){do{n=e.input.charCodeAt(++e.position)}while(Nt(n));if(35===n)do{n=e.input.charCodeAt(++e.position)}while(!Rt(n)&&0!==n)}for(;0!==n;){for(or(e),e.lineIndent=0,n=e.input.charCodeAt(e.position);(!c||e.lineIndent<l)&&32===n;)e.lineIndent++,n=e.input.charCodeAt(++e.position);if(!c&&e.lineIndent>l&&(l=e.lineIndent),Rt(n))d++;else{if(e.lineIndent<l){3===a?e.result+=Fe.repeat("\n",s?1+d:d):1===a&&s&&(e.result+="\n");break}for(i?Nt(n)?(p=!0,e.result+=Fe.repeat("\n",s?1+d:d)):p?(p=!1,e.result+=Fe.repeat("\n",d+1)):0===d?s&&(e.result+=" "):e.result+=Fe.repeat("\n",d):e.result+=Fe.repeat("\n",s?1+d:d),s=!0,c=!0,d=0,r=e.position;!Rt(n)&&0!==n;)n=e.input.charCodeAt(++e.position);tr(e,r,e.position,!1)}}return!0}(e,u)||function(e,t){var r,i,o;if(39!==(r=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=o=e.position;0!==(r=e.input.charCodeAt(e.position));)if(39===r){if(tr(e,i,e.position,!0),39!==(r=e.input.charCodeAt(++e.position)))return!0;i=e.position,e.position++,o=e.position}else Rt(r)?(tr(e,i,o,!0),sr(e,nr(e,!1,t)),i=o=e.position):e.position===e.lineStart&&ar(e)?Zt(e,"unexpected end of the document within a single quoted scalar"):(e.position++,o=e.position);Zt(e,"unexpected end of the stream within a single quoted scalar")}(e,u)||function(e,t){var r,i,o,n,a,s;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,r=i=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return tr(e,r,e.position,!0),e.position++,!0;if(92===s){if(tr(e,r,e.position,!0),Rt(s=e.input.charCodeAt(++e.position)))nr(e,!1,t);else if(s<256&&Yt[s])e.result+=Vt[s],e.position++;else if((a=Ft(s))>0){for(o=a,n=0;o>0;o--)(a=Ht(s=e.input.charCodeAt(++e.position)))>=0?n=(n<<4)+a:Zt(e,"expected hexadecimal character");e.result+=Gt(n),e.position++}else Zt(e,"unknown escape sequence");r=i=e.position}else Rt(s)?(tr(e,r,i,!0),sr(e,nr(e,!1,t)),r=i=e.position):e.position===e.lineStart&&ar(e)?Zt(e,"unexpected end of the document within a double quoted scalar"):(e.position++,i=e.position)}Zt(e,"unexpected end of the stream within a double quoted scalar")}(e,u)?f=!0:!function(e){var t,r,i;if(42!==(i=e.input.charCodeAt(e.position)))return!1;for(i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!Lt(i)&&!Ut(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&Zt(e,"name of an alias node must contain at least one character"),r=e.input.slice(t,e.position),Et.call(e.anchorMap,r)||Zt(e,'unidentified alias "'+r+'"'),e.result=e.anchorMap[r],nr(e,!0,-1),!0}(e)?function(e,t,r){var i,o,n,a,s,c,l,d,p=e.kind,u=e.result;if(Lt(d=e.input.charCodeAt(e.position))||Ut(d)||35===d||38===d||42===d||33===d||124===d||62===d||39===d||34===d||37===d||64===d||96===d)return!1;if((63===d||45===d)&&(Lt(i=e.input.charCodeAt(e.position+1))||r&&Ut(i)))return!1;for(e.kind="scalar",e.result="",o=n=e.position,a=!1;0!==d;){if(58===d){if(Lt(i=e.input.charCodeAt(e.position+1))||r&&Ut(i))break}else if(35===d){if(Lt(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&ar(e)||r&&Ut(d))break;if(Rt(d)){if(s=e.line,c=e.lineStart,l=e.lineIndent,nr(e,!1,-1),e.lineIndent>=t){a=!0,d=e.input.charCodeAt(e.position);continue}e.position=n,e.line=s,e.lineStart=c,e.lineIndent=l;break}}a&&(tr(e,o,n,!1),sr(e,e.line-s),o=n=e.position,a=!1),Nt(d)||(n=e.position+1),d=e.input.charCodeAt(++e.position)}return tr(e,o,n,!1),!!e.result||(e.kind=p,e.result=u,!1)}(e,u,1===r)&&(f=!0,null===e.tag&&(e.tag="?")):(f=!0,null===e.tag&&null===e.anchor||Zt(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===m&&(f=s&&cr(e,h))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&Zt(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),c=0,l=e.implicitTypes.length;c<l;c+=1)if((p=e.implicitTypes[c]).resolve(e.result)){e.result=p.construct(e.result),e.tag=p.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(Et.call(e.typeMap[e.kind||"fallback"],e.tag))p=e.typeMap[e.kind||"fallback"][e.tag];else for(p=null,c=0,l=(d=e.typeMap.multi[e.kind||"fallback"]).length;c<l;c+=1)if(e.tag.slice(0,d[c].tag.length)===d[c].tag){p=d[c];break}p||Zt(e,"unknown tag !<"+e.tag+">"),null!==e.result&&p.kind!==e.kind&&Zt(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+p.kind+'", not "'+e.kind+'"'),p.resolve(e.result,e.tag)?(e.result=p.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):Zt(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||f}function ur(e){var t,r,i,o,n=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(o=e.input.charCodeAt(e.position))&&(nr(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==o));){for(a=!0,o=e.input.charCodeAt(++e.position),t=e.position;0!==o&&!Lt(o);)o=e.input.charCodeAt(++e.position);for(i=[],(r=e.input.slice(t,e.position)).length<1&&Zt(e,"directive name must not be less than one character in length");0!==o;){for(;Nt(o);)o=e.input.charCodeAt(++e.position);if(35===o){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&!Rt(o));break}if(Rt(o))break;for(t=e.position;0!==o&&!Lt(o);)o=e.input.charCodeAt(++e.position);i.push(e.input.slice(t,e.position))}0!==o&&or(e),Et.call(er,r)?er[r](e,r,i):Xt(e,'unknown document directive "'+r+'"')}nr(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,nr(e,!0,-1)):a&&Zt(e,"directives end mark is expected"),pr(e,e.lineIndent-1,4,!1,!0),nr(e,!0,-1),e.checkLineBreaks&&zt.test(e.input.slice(n,e.position))&&Xt(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&ar(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,nr(e,!0,-1)):e.position<e.length-1&&Zt(e,"end of the stream or a document separator is expected")}function hr(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var r=new Kt(e,t),i=e.indexOf("\0");for(-1!==i&&(r.position=i,Zt(r,"null byte is not allowed in input")),r.input+="\0";32===r.input.charCodeAt(r.position);)r.lineIndent+=1,r.position+=1;for(;r.position<r.length-1;)ur(r);return r.documents}var mr={loadAll:function(e,t,r){null!==t&&"object"==typeof t&&void 0===r&&(r=t,t=null);var i=hr(e,r);if("function"!=typeof t)return i;for(var o=0,n=i.length;o<n;o+=1)t(i[o])},load:function(e,t){var r=hr(e,t);if(0!==r.length){if(1===r.length)return r[0];throw new Ge("expected a single document in the stream, but found more")}}},gr=Object.prototype.toString,fr=Object.prototype.hasOwnProperty,vr=65279,br={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},yr=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],xr=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function _r(e){var t,r,i;if(t=e.toString(16).toUpperCase(),e<=255)r="x",i=2;else if(e<=65535)r="u",i=4;else{if(!(e<=4294967295))throw new Ge("code point within a string may not be greater than 0xFFFFFFFF");r="U",i=8}return"\\"+r+Fe.repeat("0",i-t.length)+t}function wr(e){this.schema=e.schema||Tt,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=Fe.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var r,i,o,n,a,s,c;if(null===t)return{};for(r={},o=0,n=(i=Object.keys(t)).length;o<n;o+=1)a=i[o],s=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(c=e.compiledTypeMap.fallback[a])&&fr.call(c.styleAliases,s)&&(s=c.styleAliases[s]),r[a]=s;return r}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function $r(e,t){for(var r,i=Fe.repeat(" ",t),o=0,n=-1,a="",s=e.length;o<s;)-1===(n=e.indexOf("\n",o))?(r=e.slice(o),o=s):(r=e.slice(o,n+1),o=n+1),r.length&&"\n"!==r&&(a+=i),a+=r;return a}function kr(e,t){return"\n"+Fe.repeat(" ",e.indent*t)}function Sr(e){return 32===e||9===e}function Ar(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&e!==vr||65536<=e&&e<=1114111}function Cr(e){return Ar(e)&&e!==vr&&13!==e&&10!==e}function Mr(e,t,r){var i=Cr(e),o=i&&!Sr(e);return(r?i:i&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!o)||Cr(t)&&!Sr(t)&&35===e||58===t&&o}function Tr(e,t){var r,i=e.charCodeAt(t);return i>=55296&&i<=56319&&t+1<e.length&&(r=e.charCodeAt(t+1))>=56320&&r<=57343?1024*(i-55296)+r-56320+65536:i}function Er(e){return/^\n* /.test(e)}function Ir(e,t,r,i,o,n,a,s){var c,l=0,d=null,p=!1,u=!1,h=-1!==i,m=-1,g=function(e){return Ar(e)&&e!==vr&&!Sr(e)&&45!==e&&63!==e&&58!==e&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e&&35!==e&&38!==e&&42!==e&&33!==e&&124!==e&&61!==e&&62!==e&&39!==e&&34!==e&&37!==e&&64!==e&&96!==e}(Tr(e,0))&&function(e){return!Sr(e)&&58!==e}(Tr(e,e.length-1));if(t||a)for(c=0;c<e.length;l>=65536?c+=2:c++){if(!Ar(l=Tr(e,c)))return 5;g=g&&Mr(l,d,s),d=l}else{for(c=0;c<e.length;l>=65536?c+=2:c++){if(10===(l=Tr(e,c)))p=!0,h&&(u=u||c-m-1>i&&" "!==e[m+1],m=c);else if(!Ar(l))return 5;g=g&&Mr(l,d,s),d=l}u=u||h&&c-m-1>i&&" "!==e[m+1]}return p||u?r>9&&Er(e)?5:a?2===n?5:2:u?4:3:!g||a||o(e)?2===n?5:2:1}function zr(e,t,r,i,o){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==yr.indexOf(t)||xr.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var n=e.indent*Math.max(1,r),a=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-n),s=i||e.flowLevel>-1&&r>=e.flowLevel;switch(Ir(t,s,e.indent,a,function(t){return function(e,t){var r,i;for(r=0,i=e.implicitTypes.length;r<i;r+=1)if(e.implicitTypes[r].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!i,o)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+Or(t,e.indent)+Dr($r(t,n));case 4:return">"+Or(t,e.indent)+Dr($r(function(e,t){var r,i,o=/(\n+)([^\n]*)/g,n=(s=e.indexOf("\n"),s=-1!==s?s:e.length,o.lastIndex=s,Pr(e.slice(0,s),t)),a="\n"===e[0]||" "===e[0];var s;for(;i=o.exec(e);){var c=i[1],l=i[2];r=" "===l[0],n+=c+(a||r||""===l?"":"\n")+Pr(l,t),a=r}return n}(t,a),n));case 5:return'"'+function(e){for(var t,r="",i=0,o=0;o<e.length;i>=65536?o+=2:o++)i=Tr(e,o),!(t=br[i])&&Ar(i)?(r+=e[o],i>=65536&&(r+=e[o+1])):r+=t||_r(i);return r}(t)+'"';default:throw new Ge("impossible error: invalid scalar style")}}()}function Or(e,t){var r=Er(e)?String(t):"",i="\n"===e[e.length-1];return r+(i&&("\n"===e[e.length-2]||"\n"===e)?"+":i?"":"-")+"\n"}function Dr(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function Pr(e,t){if(""===e||" "===e[0])return e;for(var r,i,o=/ [^ ]/g,n=0,a=0,s=0,c="";r=o.exec(e);)(s=r.index)-n>t&&(i=a>n?a:s,c+="\n"+e.slice(n,i),n=i+1),a=s;return c+="\n",e.length-n>t&&a>n?c+=e.slice(n,a)+"\n"+e.slice(a+1):c+=e.slice(n),c.slice(1)}function jr(e,t,r,i){var o,n,a,s="",c=e.tag;for(o=0,n=r.length;o<n;o+=1)a=r[o],e.replacer&&(a=e.replacer.call(r,String(o),a)),(Nr(e,t+1,a,!0,!0,!1,!0)||void 0===a&&Nr(e,t+1,null,!0,!0,!1,!0))&&(i&&""===s||(s+=kr(e,t)),e.dump&&10===e.dump.charCodeAt(0)?s+="-":s+="- ",s+=e.dump);e.tag=c,e.dump=s||"[]"}function Rr(e,t,r){var i,o,n,a,s,c;for(n=0,a=(o=r?e.explicitTypes:e.implicitTypes).length;n<a;n+=1)if(((s=o[n]).instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(r?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag="?",s.represent){if(c=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===gr.call(s.represent))i=s.represent(t,c);else{if(!fr.call(s.represent,c))throw new Ge("!<"+s.tag+'> tag resolver accepts not "'+c+'" style');i=s.represent[c](t,c)}e.dump=i}return!0}return!1}function Nr(e,t,r,i,o,n,a){e.tag=null,e.dump=r,Rr(e,r,!1)||Rr(e,r,!0);var s,c=gr.call(e.dump),l=i;i&&(i=e.flowLevel<0||e.flowLevel>t);var d,p,u="[object Object]"===c||"[object Array]"===c;if(u&&(p=-1!==(d=e.duplicates.indexOf(r))),(null!==e.tag&&"?"!==e.tag||p||2!==e.indent&&t>0)&&(o=!1),p&&e.usedDuplicates[d])e.dump="*ref_"+d;else{if(u&&p&&!e.usedDuplicates[d]&&(e.usedDuplicates[d]=!0),"[object Object]"===c)i&&0!==Object.keys(e.dump).length?(!function(e,t,r,i){var o,n,a,s,c,l,d="",p=e.tag,u=Object.keys(r);if(!0===e.sortKeys)u.sort();else if("function"==typeof e.sortKeys)u.sort(e.sortKeys);else if(e.sortKeys)throw new Ge("sortKeys must be a boolean or a function");for(o=0,n=u.length;o<n;o+=1)l="",i&&""===d||(l+=kr(e,t)),s=r[a=u[o]],e.replacer&&(s=e.replacer.call(r,a,s)),Nr(e,t+1,a,!0,!0,!0)&&((c=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?l+="?":l+="? "),l+=e.dump,c&&(l+=kr(e,t)),Nr(e,t+1,s,!0,c)&&(e.dump&&10===e.dump.charCodeAt(0)?l+=":":l+=": ",d+=l+=e.dump));e.tag=p,e.dump=d||"{}"}(e,t,e.dump,o),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,r){var i,o,n,a,s,c="",l=e.tag,d=Object.keys(r);for(i=0,o=d.length;i<o;i+=1)s="",""!==c&&(s+=", "),e.condenseFlow&&(s+='"'),a=r[n=d[i]],e.replacer&&(a=e.replacer.call(r,n,a)),Nr(e,t,n,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),Nr(e,t,a,!1,!1)&&(c+=s+=e.dump));e.tag=l,e.dump="{"+c+"}"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else if("[object Array]"===c)i&&0!==e.dump.length?(e.noArrayIndent&&!a&&t>0?jr(e,t-1,e.dump,o):jr(e,t,e.dump,o),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,r){var i,o,n,a="",s=e.tag;for(i=0,o=r.length;i<o;i+=1)n=r[i],e.replacer&&(n=e.replacer.call(r,String(i),n)),(Nr(e,t,n,!1,!1)||void 0===n&&Nr(e,t,null,!1,!1))&&(""!==a&&(a+=","+(e.condenseFlow?"":" ")),a+=e.dump);e.tag=s,e.dump="["+a+"]"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else{if("[object String]"!==c){if("[object Undefined]"===c)return!1;if(e.skipInvalid)return!1;throw new Ge("unacceptable kind of an object to dump "+c)}"?"!==e.tag&&zr(e,e.dump,t,n,l)}null!==e.tag&&"?"!==e.tag&&(s=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),s="!"===e.tag[0]?"!"+s:"tag:yaml.org,2002:"===s.slice(0,18)?"!!"+s.slice(18):"!<"+s+">",e.dump=s+" "+e.dump)}return!0}function Lr(e,t){var r,i,o=[],n=[];for(Ur(e,o,n),r=0,i=n.length;r<i;r+=1)t.duplicates.push(o[n[r]]);t.usedDuplicates=new Array(i)}function Ur(e,t,r){var i,o,n;if(null!==e&&"object"==typeof e)if(-1!==(o=t.indexOf(e)))-1===r.indexOf(o)&&r.push(o);else if(t.push(e),Array.isArray(e))for(o=0,n=e.length;o<n;o+=1)Ur(e[o],t,r);else for(o=0,n=(i=Object.keys(e)).length;o<n;o+=1)Ur(e[i[o]],t,r)}function Hr(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var Fr={Type:Je,Schema:et,FAILSAFE_SCHEMA:ot,JSON_SCHEMA:mt,CORE_SCHEMA:gt,DEFAULT_SCHEMA:Tt,load:mr.load,loadAll:mr.loadAll,dump:{dump:function(e,t){var r=new wr(t=t||{});r.noRefs||Lr(e,r);var i=e;return r.replacer&&(i=r.replacer.call({"":i},"",i)),Nr(r,0,i,!0,!0)?r.dump+"\n":""}}.dump,YAMLException:Ge,types:{binary:_t,float:ht,map:it,null:nt,pairs:At,set:Mt,timestamp:bt,bool:at,int:dt,merge:yt,omap:kt,seq:rt,str:tt},safeLoad:Hr("safeLoad","load"),safeLoadAll:Hr("safeLoadAll","loadAll"),safeDump:Hr("safeDump","dump")};class Br{constructor(){this.suppressSync=!1}toYaml(e){const{type:t,...r}=e;return function(e){try{return Fr.dump(e,{indent:2,lineWidth:120,noRefs:!0,sortKeys:!1})}catch{return""}}(r)}fromYaml(e,t){const r=function(e){try{return Fr.load(e)}catch{return null}}(e);return r?{...r,type:t.type}:null}isSuppressed(){return this.suppressSync}suppress(e){this.suppressSync=!0;try{e()}finally{this.suppressSync=!1}}}const qr=c`
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
`;var Gr=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};let Wr=class extends ue{constructor(){super(...arguments),this._yaml="",this._error="",this._configSync=new Br,this._suppressUpdate=!1}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e,this._suppressUpdate||(this._yaml=this._configSync.toYaml(e.config),this._error="")}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){return V`
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

        ${this._error?V`<div class="mc-yaml-error">${this._error}</div>`:K}
      </div>
    `}_onYamlInput(e){const t=e.target.value;this._yaml=t,this._suppressUpdate=!0;try{const e=this._configSync.fromYaml(t,this._editorState.config);e?(this._error="",this.stateManager.updateConfig(e)):this._error="Invalid YAML structure"}catch(e){this._error=e instanceof Error?e.message:"Parse error"}finally{this._suppressUpdate=!1}}};Wr.styles=[Ce,qr],Gr([ve({attribute:!1})],Wr.prototype,"stateManager",void 0),Gr([ve({attribute:!1})],Wr.prototype,"hass",void 0),Gr([be()],Wr.prototype,"_yaml",void 0),Gr([be()],Wr.prototype,"_error",void 0),Gr([be()],Wr.prototype,"_editorState",void 0),Wr=Gr([me("mc-yaml-editor")],Wr);const Yr=c`
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
`;var Vr=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};let Qr=class extends ue{constructor(){super(...arguments),this._expandedNodes=new Set(["root"])}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){if(!this._editorState)return V``;const{config:e,selectedPath:t}=this._editorState;return e.rows.length?V`
      <div class="mc-tree">
        ${e.rows.map((e,r)=>this._renderRowNode(e,r,t))}
      </div>
    `:V`<div class="mc-tree-empty">No rows. Add a row to get started.</div>`}_renderRowNode(e,t,r){const i=`row-${t}`,o=this._expandedNodes.has(i);return V`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${()=>this._toggleNode(i)}>
          <span class="mc-tree-toggle ${o?"open":""}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Row ${t+1}</span>
          <span class="mc-tree-type">${e.layout||"1"}</span>
          ${e.display?.conditions?.length?V`<span class="mc-tree-badge condition">C</span>`:K}
          <span class="mc-tree-actions">
            <button class="mc-tree-action-btn" @click=${e=>{e.stopPropagation(),this.stateManager.deleteRow(t)}} title="Delete">&times;</button>
          </span>
        </div>
        ${o?V`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.columns.map((e,i)=>this._renderColumnNode(e,t,i,r))}
              </div>
            `:K}
      </div>
    `}_renderColumnNode(e,t,r,i){const o=`col-${t}-${r}`,n=this._expandedNodes.has(o);return V`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${()=>this._toggleNode(o)}>
          <span class="mc-tree-toggle ${n?"open":""}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-column" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Column ${r+1}</span>
          <span class="mc-tree-type">${e.modules.length} modules</span>
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("add-module",{bubbles:!0,composed:!0,detail:{rowIndex:t,colIndex:r}}))}}
              title="Add module"
            >+</button>
          </span>
        </div>
        ${n?V`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.modules.map((e,o)=>this._renderModuleNode(e,t,r,o,i))}
                ${0===e.modules.length?V`<div style="padding:4px 8px;font-size:0.75rem;color:var(--secondary-text-color)">Empty</div>`:K}
              </div>
            `:K}
      </div>
    `}_renderModuleNode(e,t,r,i,o){const n=o?.rowIndex===t&&o?.columnIndex===r&&o?.moduleIndex===i,a=xe.get(e.type),s=e.display?.conditions?.length,c=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return V`
      <div class="mc-tree-node">
        <div
          class="mc-tree-row ${n?"selected":""}"
          draggable="true"
          @click=${()=>this.stateManager.setSelectedPath({rowIndex:t,columnIndex:r,moduleIndex:i})}
          @dragstart=${e=>this._onDragStart(e,t,r,i)}
          @dragover=${e=>this._onDragOver(e)}
          @drop=${e=>this._onDrop(e,t,r,i)}
        >
          <span class="mc-drag-handle">
            <ha-icon icon="mdi:drag-vertical" style="--mdc-icon-size:14px"></ha-icon>
          </span>
          <span class="mc-tree-icon">
            <ha-icon icon=${a?.metadata.icon||"mdi:puzzle"} style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">${a?.metadata.name||e.type}</span>
          <span class="mc-tree-type">${e.type}</span>
          ${s?V`<span class="mc-tree-badge condition">C</span>`:K}
          ${c?V`<span class="mc-tree-badge action">A</span>`:K}
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,r,i)}}
              title="Delete"
            >&times;</button>
          </span>
        </div>
      </div>
    `}_toggleNode(e){this._expandedNodes.has(e)?this._expandedNodes.delete(e):this._expandedNodes.add(e),this.requestUpdate()}_onDragStart(e,t,r,i){this._dragData={ri:t,ci:r,mi:i},e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify({ri:t,ci:r,mi:i})))}_onDragOver(e){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_onDrop(e,t,r,i){if(e.preventDefault(),!this._dragData)return;const{ri:o,ci:n,mi:a}=this._dragData;o===t&&n===r&&a===i||(this.stateManager.moveModule(o,n,a,t,r,i),this._dragData=void 0)}};Qr.styles=[Ce,Yr],Vr([ve({attribute:!1})],Qr.prototype,"stateManager",void 0),Vr([ve({attribute:!1})],Qr.prototype,"hass",void 0),Vr([be()],Qr.prototype,"_editorState",void 0),Vr([be()],Qr.prototype,"_expandedNodes",void 0),Qr=Vr([me("mc-tree-editor")],Qr);const Kr=c`
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
`;var Jr=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};let Zr=class extends ue{constructor(){super(...arguments),this._searchQuery=""}render(){const e=this._searchQuery?xe.search(this._searchQuery):xe.getAll(),t=new Map;for(const i of r){const r=e.filter(e=>e.metadata.category===i).map(e=>e.metadata);r.length>0&&t.set(i,r)}return V`
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
            ${Array.from(t.entries()).map(([e,t])=>V`
                <div class="mc-selector-category">${e}</div>
                ${t.map(e=>V`
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
    `}_onSelect(e){this.dispatchEvent(new CustomEvent("module-selected",{bubbles:!0,composed:!0,detail:{type:e.type}}))}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_onOverlayClick(){this._onClose()}};Zr.styles=Kr,Jr([be()],Zr.prototype,"_searchQuery",void 0),Zr=Jr([me("mc-module-selector")],Zr);var Xr=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};const ei="magic-card-saved-colors",ti=["#ffffff","#f3f4f6","#d1d5db","#9ca3af","#6b7280","#374151","#1f2937","#000000","#ef4444","#f97316","#eab308","#22c55e","#14b8a6","#3b82f6","#8b5cf6","#ec4899","#fecaca","#fed7aa","#fef08a","#bbf7d0","#99f6e4","#bfdbfe","#ddd6fe","#fbcfe8","var(--primary-color)","var(--accent-color)","var(--primary-text-color)","var(--secondary-text-color)","var(--card-background-color)","var(--divider-color)","var(--success-color)","var(--error-color)"];let ri=class extends ue{constructor(){super(...arguments),this.value="",this.label="",this._isOpen=!1,this._hsva={h:0,s:100,v:100,a:1},this._savedColors=[],this._hexInput="",this._dragging=null,this._handleAreaPointerDown=e=>{this._dragging="area",e.target.setPointerCapture(e.pointerId),this._updateArea(e)},this._handleHuePointerDown=e=>{this._dragging="hue",e.target.setPointerCapture(e.pointerId),this._updateHue(e)},this._handleOpacityPointerDown=e=>{this._dragging="opacity",e.target.setPointerCapture(e.pointerId),this._updateOpacity(e)},this._handlePointerMove=e=>{this._dragging&&("area"===this._dragging?this._updateArea(e):"hue"===this._dragging?this._updateHue(e):"opacity"===this._dragging&&this._updateOpacity(e))},this._handlePointerUp=()=>{this._dragging=null}}connectedCallback(){super.connectedCallback(),this._loadSavedColors(),this._parseValue(this.value)}updated(e){e.has("value")&&!this._isOpen&&this._parseValue(this.value)}_loadSavedColors(){try{const e=localStorage.getItem(ei);this._savedColors=e?JSON.parse(e):[]}catch{this._savedColors=[]}}_saveSavedColors(){try{localStorage.setItem(ei,JSON.stringify(this._savedColors))}catch{}}_parseValue(e){if(!e)return this._hsva={h:0,s:0,v:100,a:1},void(this._hexInput="");if(e.startsWith("var("))return void(this._hexInput=e);const t=this._colorToHsva(e);t?(this._hsva=t,this._hexInput=this._hsvaToHex(t)):this._hexInput=e}_colorToHsva(e){const t=e.match(/^#([0-9a-f]{3,8})$/i);if(t){let e=t[1];3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),4===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]);const r=parseInt(e.slice(0,2),16)/255,i=parseInt(e.slice(2,4),16)/255,o=parseInt(e.slice(4,6),16)/255,n=8===e.length?parseInt(e.slice(6,8),16)/255:1;return this._rgbToHsva(r,i,o,n)}const r=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(r){const e=parseInt(r[1])/255,t=parseInt(r[2])/255,i=parseInt(r[3])/255,o=r[4]?parseFloat(r[4]):1;return this._rgbToHsva(e,t,i,o)}return null}_rgbToHsva(e,t,r,i){const o=Math.max(e,t,r),n=o-Math.min(e,t,r),a=100*o,s=0===o?0:n/o*100;let c=0;if(0!==n)switch(o){case e:c=60*((t-r)/n+(t<r?6:0));break;case t:c=60*((r-e)/n+2);break;case r:c=60*((e-t)/n+4)}return{h:c,s,v:a,a:i}}_hsvaToRgb(e){const t=e.h/60,r=e.s/100,i=e.v/100,o=i*r,n=o*(1-Math.abs(t%2-1)),a=i-o;let s=0,c=0,l=0;return t<1?(s=o,c=n):t<2?(s=n,c=o):t<3?(c=o,l=n):t<4?(c=n,l=o):t<5?(s=n,l=o):(s=o,l=n),{r:Math.round(255*(s+a)),g:Math.round(255*(c+a)),b:Math.round(255*(l+a)),a:e.a}}_hsvaToHex(e){const t=this._hsvaToRgb(e),r="#"+t.r.toString(16).padStart(2,"0")+t.g.toString(16).padStart(2,"0")+t.b.toString(16).padStart(2,"0");return e.a<1?r+Math.round(255*e.a).toString(16).padStart(2,"0"):r}_hsvaToRgbaString(e){const t=this._hsvaToRgb(e);return e.a<1?`rgba(${t.r}, ${t.g}, ${t.b}, ${e.a.toFixed(2)})`:`rgb(${t.r}, ${t.g}, ${t.b})`}_getCurrentColor(){return this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToHex(this._hsva)}_emitChange(){const e=this._getCurrentColor();this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_openModal(){this._parseValue(this.value),this._isOpen=!0}_closeModal(){this._isOpen=!1}_applyColor(){this._emitChange(),this._closeModal()}_updateArea(e){const t=e.currentTarget.getBoundingClientRect(),r=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),i=Math.max(0,Math.min(1,(e.clientY-t.top)/t.height));this._hsva={...this._hsva,s:100*r,v:100*(1-i)},this._hexInput=this._hsvaToHex(this._hsva)}_updateHue(e){const t=e.currentTarget.getBoundingClientRect(),r=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._hsva={...this._hsva,h:360*r},this._hexInput=this._hsvaToHex(this._hsva)}_updateOpacity(e){const t=e.currentTarget.getBoundingClientRect(),r=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._hsva={...this._hsva,a:r},this._hexInput=this._hsvaToHex(this._hsva)}_handleHexInput(e){const t=e.target.value;this._hexInput=t;const r=this._colorToHsva(t);r&&(this._hsva=r)}_selectPreset(e){if(e.startsWith("var("))this._hexInput=e;else{const t=this._colorToHsva(e);t&&(this._hsva=t,this._hexInput=this._hsvaToHex(t))}}_addSavedColor(){const e=this._getCurrentColor();this._savedColors.includes(e)||(this._savedColors=[e,...this._savedColors].slice(0,12),this._saveSavedColors())}_removeSavedColor(e,t){t.stopPropagation(),this._savedColors=this._savedColors.filter(t=>t!==e),this._saveSavedColors()}_handleTextInput(e){const t=e.target.value;this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){const e=this.value||"transparent";return V`
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
    `}_renderModal(){const e=this._hsvaToRgb(this._hsva),t=`hsl(${this._hsva.h}, 100%, 50%)`,r=this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToRgbaString(this._hsva);return V`
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
                style="left: ${this._hsva.s}%; top: ${100-this._hsva.v}%; background: ${r}"
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
                ${ti.map(e=>V`
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
                ${this._savedColors.map(e=>V`
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
    `}};ri.styles=c`
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
  `,Xr([ve({type:String})],ri.prototype,"value",void 0),Xr([ve({type:String})],ri.prototype,"label",void 0),Xr([be()],ri.prototype,"_isOpen",void 0),Xr([be()],ri.prototype,"_hsva",void 0),Xr([be()],ri.prototype,"_savedColors",void 0),Xr([be()],ri.prototype,"_hexInput",void 0),ri=Xr([me("mc-color-picker")],ri);var ii=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};const oi=["px","em","rem","%","vw","vh","auto"];let ni=class extends ue{constructor(){super(...arguments),this.value="",this.label="",this.placeholder=""}_parseValue(){if(!this.value)return{number:"",unit:"px"};if("auto"===this.value)return{number:"",unit:"auto"};const e=this.value.match(/^(-?[\d.]+)\s*(px|em|rem|%|vw|vh)?$/);return e?{number:e[1],unit:e[2]||"px"}:{number:this.value,unit:"px"}}_emitChange(e,t){let r="";"auto"===t?r="auto":e&&(r=`${e}${t}`),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:r}}))}render(){const{number:e,unit:t}=this._parseValue();return V`
      <div class="mc-unit-field">
        <input
          class="mc-unit-input"
          type="text"
          .value=${"auto"===t?"":e}
          placeholder=${this.placeholder||"0"}
          ?disabled=${"auto"===t}
          @input=${e=>{const r=e.target.value;this._emitChange(r,t)}}
        />
        <select
          class="mc-unit-select"
          .value=${t}
          @change=${t=>{const r=t.target.value;this._emitChange(e,r)}}
        >
          ${oi.map(e=>V`
            <option value=${e} ?selected=${t===e}>${e}</option>
          `)}
        </select>
      </div>
    `}};ni.styles=c`
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
  `,ii([ve({type:String})],ni.prototype,"value",void 0),ii([ve({type:String})],ni.prototype,"label",void 0),ii([ve({type:String})],ni.prototype,"placeholder",void 0),ni=ii([me("mc-unit-field")],ni);var ai=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};let si=class extends ue{constructor(){super(...arguments),this.value="",this.label="Entity",this.domain="",this._showModal=!1,this._searchQuery=""}_openModal(){this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_selectEntity(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getFilteredEntities(){if(!this.hass)return[];const e=Object.entries(this.hass.states).filter(([e])=>!(this.domain&&!e.startsWith(this.domain+"."))).map(([e,t])=>({id:e,name:t.attributes.friendly_name||e,state:this.hass.formatEntityState(t),icon:t.attributes.icon||this._domainIcon(e.split(".")[0])})).filter(e=>{if(!this._searchQuery)return!0;const t=this._searchQuery.toLowerCase();return e.id.toLowerCase().includes(t)||e.name.toLowerCase().includes(t)}).sort((e,t)=>e.name.localeCompare(t.name));return e.slice(0,100)}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",sensor:"mdi:eye",binary_sensor:"mdi:checkbox-marked-circle",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",person:"mdi:account",weather:"mdi:weather-partly-cloudy",sun:"mdi:white-balance-sunny",vacuum:"mdi:robot-vacuum",water_heater:"mdi:water-boiler",humidifier:"mdi:air-humidifier",alarm_control_panel:"mdi:shield-home"}[e]||"mdi:help-circle"}render(){return V`
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
    `}_renderModal(){const e=this._getFilteredEntities();return V`
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
            ${e.length>0?e.map(e=>V`
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
                `):V`<div class="mc-picker-empty">No entities found</div>`}
          </div>
        </div>
      </div>
    `}};si.styles=c`
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
  `,ai([ve({attribute:!1})],si.prototype,"hass",void 0),ai([ve({type:String})],si.prototype,"value",void 0),ai([ve({type:String})],si.prototype,"label",void 0),ai([ve({type:String})],si.prototype,"domain",void 0),ai([be()],si.prototype,"_showModal",void 0),ai([be()],si.prototype,"_searchQuery",void 0),si=ai([me("mc-entity-picker")],si);var ci=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};let li=class extends ue{constructor(){super(...arguments),this.value="",this.label="Service",this._showModal=!1,this._searchQuery=""}_openModal(){this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_selectService(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getServices(){if(!this.hass?.services)return[];const e=[];for(const[t,r]of Object.entries(this.hass.services))for(const[i,o]of Object.entries(r))e.push({domain:t,service:i,name:o.name||i,description:o.description||""});return e}_getFilteredServices(){const e=this._getServices(),t=this._searchQuery.toLowerCase(),r=t?e.filter(e=>e.domain.includes(t)||e.service.includes(t)||e.name.toLowerCase().includes(t)):e,i=new Map;for(const e of r)i.has(e.domain)||i.set(e.domain,[]),i.get(e.domain).push(e);const o=Array.from(i.entries()).sort(([e],[t])=>e.localeCompare(t)).slice(0,20).map(([e,t])=>({domain:e,services:t.sort((e,t)=>e.service.localeCompare(t.service))}));return o}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",notify:"mdi:bell",tts:"mdi:speaker-message",homeassistant:"mdi:home-assistant",persistent_notification:"mdi:bell-ring",logbook:"mdi:book-open",recorder:"mdi:database",system_log:"mdi:file-document",frontend:"mdi:view-dashboard",group:"mdi:group",vacuum:"mdi:robot-vacuum",counter:"mdi:counter",timer:"mdi:timer"}[e]||"mdi:cog"}render(){return V`
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
    `}_renderModal(){const e=this._getFilteredServices();return V`
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
            ${e.length>0?e.map(e=>V`
                  <div class="mc-picker-domain">${e.domain}</div>
                  ${e.services.map(e=>V`
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
                        ${e.description?V`<div class="mc-picker-item-desc">${e.description}</div>`:""}
                      </div>
                    </div>
                  `)}
                `):V`<div class="mc-picker-empty">No services found</div>`}
          </div>
        </div>
      </div>
    `}};li.styles=c`
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
  `,ci([ve({attribute:!1})],li.prototype,"hass",void 0),ci([ve({type:String})],li.prototype,"value",void 0),ci([ve({type:String})],li.prototype,"label",void 0),ci([be()],li.prototype,"_showModal",void 0),ci([be()],li.prototype,"_searchQuery",void 0),li=ci([me("mc-service-picker")],li);var di=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};const pi={general:{label:"General",icon:"mdi:cog"},actions:{label:"Actions",icon:"mdi:gesture-tap"},logic:{label:"Conditions",icon:"mdi:filter-outline"},design:{label:"Design",icon:"mdi:palette"}};let ui=class extends ue{constructor(){super(...arguments),this.open=!1,this._activeTab="general"}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open||!this.module)return V``;const e=xe.get(this.module.type);if(!e)return V``;const t=e.getAvailableTabs(),r=t.includes(this._activeTab)?this._activeTab:t[0];return V`
      <div class="mc-modal-overlay" @click=${this._close}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-modal-header">
            <ha-icon icon=${e.metadata.icon}></ha-icon>
            <span class="mc-modal-title">${e.metadata.name} Settings</span>
            <button class="mc-modal-close" @click=${this._close}>&times;</button>
          </div>

          <div class="mc-modal-tabs">
            ${t.map(e=>{const t=pi[e];return V`
                <button
                  class="mc-modal-tab ${r===e?"active":""}"
                  @click=${()=>{this._activeTab=e}}
                >
                  <ha-icon icon=${t.icon}></ha-icon>
                  ${t.label}
                </button>
              `})}
          </div>

          <div class="mc-modal-body">
            ${this._renderTabContent(r,e)}
          </div>

          <div class="mc-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${this._close}>Done</button>
          </div>
        </div>
      </div>
    `}_renderTabContent(e,t){if(!this.module||!this.onChange)return V`<p>Loading...</p>`;const r=this.onChange;switch(e){case"general":return t.renderGeneralTab(this.module,this.hass,r);case"actions":return t.renderActionsTab?t.renderActionsTab(this.module,this.hass,r):V`<p>No actions available</p>`;case"logic":return t.renderLogicTab?t.renderLogicTab(this.module,this.hass,r):V`<p>No conditions available</p>`;case"design":return t.renderDesignTab?t.renderDesignTab(this.module,this.hass,r):V`<p>No design options</p>`}}};ui.styles=[Ce,c`
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
  `],di([ve({attribute:!1})],ui.prototype,"module",void 0),di([ve({attribute:!1})],ui.prototype,"hass",void 0),di([ve({type:Boolean})],ui.prototype,"open",void 0),di([ve({attribute:!1})],ui.prototype,"onChange",void 0),di([be()],ui.prototype,"_activeTab",void 0),ui=di([me("mc-settings-modal")],ui);var hi=function(e,t,r,i){var o,n=arguments.length,a=n<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,i);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(n<3?o(a):n>3?o(t,r,a):o(t,r))||a);return n>3&&a&&Object.defineProperty(t,r,a),a};let mi=class extends ue{constructor(){super(...arguments),this._showModuleSelector=!1,this._showSettingsModal=!1,this._onAddModule=e=>{this._moduleSelectorTarget=e.detail,this._showModuleSelector=!0},this._onModuleSelected=e=>{this._moduleSelectorTarget&&this._stateManager.addModule(this._moduleSelectorTarget.rowIndex,this._moduleSelectorTarget.colIndex,e.detail.type),this._showModuleSelector=!1,this._moduleSelectorTarget=void 0}}connectedCallback(){super.connectedCallback(),this._stateManager=new Ee(e=>{this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:e}}))}),this._unsubscribe=this._stateManager.subscribe(e=>{this._editorState=e,void 0!==e.selectedPath?.moduleIndex&&(this._showSettingsModal=!0)}),this._pendingConfig&&(this._stateManager.setConfig(this._pendingConfig),this._pendingConfig=void 0)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._stateManager?.destroy()}setConfig(e){this._stateManager?this._stateManager.setConfig(e):this._pendingConfig=e}render(){if(!this._editorState)return V`<div class="mc-editor">Loading...</div>`;const{editorMode:e}=this._editorState;return V`
      <div class="mc-editor">
        ${this._renderModeSwitcher(e)}
        ${this._renderToolbar()}
        ${this._renderEditorMode(e)}
        ${this._showModuleSelector?this._renderModuleSelectorDialog():K}
        ${this._renderSettingsModal()}
      </div>
    `}_renderModeSwitcher(e){return V`
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
    `}_renderToolbar(){return V`
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
    `}_renderEditorMode(e){switch(e){case"form":return V`
          <mc-form-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
          ></mc-form-editor>
        `;case"yaml":return V`
          <mc-yaml-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
          ></mc-yaml-editor>
        `;case"tree":return V`
          <mc-tree-editor
            .stateManager=${this._stateManager}
            .hass=${this.hass}
            @add-module=${this._onAddModule}
          ></mc-tree-editor>
        `}}_renderSettingsModal(){const e=this._stateManager?.getSelectedModule();if(!e||!this._showSettingsModal)return V``;const{selectedPath:t}=this._editorState;return V`
      <mc-settings-modal
        .module=${e}
        .hass=${this.hass}
        .open=${!0}
        .onChange=${e=>{void 0!==t?.rowIndex&&void 0!==t?.columnIndex&&void 0!==t?.moduleIndex&&this._stateManager.updateModule(t.rowIndex,t.columnIndex,t.moduleIndex,e)}}
        @close=${()=>{this._showSettingsModal=!1,this._stateManager.setSelectedPath(null)}}
      ></mc-settings-modal>
    `}_renderModuleSelectorDialog(){return V`
      <mc-module-selector
        @module-selected=${this._onModuleSelected}
        @close=${()=>{this._showModuleSelector=!1}}
      ></mc-module-selector>
    `}};mi.styles=Ce,hi([ve({attribute:!1})],mi.prototype,"hass",void 0),hi([ve({attribute:!1})],mi.prototype,"lovelace",void 0),hi([be()],mi.prototype,"_editorState",void 0),hi([be()],mi.prototype,"_showModuleSelector",void 0),hi([be()],mi.prototype,"_moduleSelectorTarget",void 0),hi([be()],mi.prototype,"_showSettingsModal",void 0),mi=hi([me(t)],mi);class gi{getAvailableTabs(){return["general","actions","logic","design"]}validate(e){return[]}renderActionsTab(e,t,r){const i=e.actions,o=(t,o)=>{r({...e,actions:{...i,[t]:o}})};return V`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Tap Action</div>
          ${this._renderActionConfig(i?.tap_action,e=>o("tap_action",e),t)}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Hold Action</div>
          ${this._renderActionConfig(i?.hold_action,e=>o("hold_action",e),t)}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Double Tap Action</div>
          ${this._renderActionConfig(i?.double_tap_action,e=>o("double_tap_action",e),t)}
        </div>
      </div>
    `}renderLogicTab(e,t,r){const i=e.display,o=i?.conditions||[],n=t=>{r({...e,display:{...i,...t}})},a=(e,t)=>{n({conditions:o.map(r=>r.id===e?{...r,...t}:r)})};return V`
      <div class="mc-tab-content">
        ${De("Condition Mode",i?.mode||"every",[{label:"All conditions (AND)",value:"every"},{label:"Any condition (OR)",value:"any"}],e=>n({mode:e}))}

        <div class="mc-conditions-list">
          ${o.map(e=>V`
              <div class="mc-condition-item">
                ${De("Type",e.type,[{label:"State",value:"state"},{label:"Attribute",value:"attribute"},{label:"Time",value:"time"},{label:"Template",value:"template"}],t=>a(e.id,{type:t}))}
                ${"state"===e.type||"attribute"===e.type?V`
                      ${je("Entity",e.entity,t=>a(e.id,{entity:t}),t)}
                      ${"attribute"===e.type?ze("Attribute",e.attribute,t=>a(e.id,{attribute:t})):K}
                      ${ze("State equals",e.state,t=>a(e.id,{state:t}))}
                      ${ze("State not equals",e.state_not,t=>a(e.id,{state_not:t}))}
                    `:K}
                ${"time"===e.type?V`
                      ${ze("After (HH:MM)",e.after,t=>a(e.id,{after:t}))}
                      ${ze("Before (HH:MM)",e.before,t=>a(e.id,{before:t}))}
                    `:K}
                ${"template"===e.type?V`
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

        <button class="mc-btn mc-btn-secondary" @click=${()=>{const e={id:ke("cond"),type:"state",entity:"",state:""};n({conditions:[...o,e]})}}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
          Add Condition
        </button>
      </div>
    `}renderDesignTab(e,t,r){const i=e.design||{},o=t=>{r({...e,design:{...i,...t}})};return V`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Typography</div>
          ${Ne("Font Size",i.font_size,e=>o({font_size:e}))}
          ${De("Font Weight",i.font_weight,[{label:"Normal",value:"normal"},{label:"Bold",value:"bold"},{label:"Light",value:"300"},{label:"Medium",value:"500"},{label:"Semibold",value:"600"}],e=>o({font_weight:e}))}
          ${De("Text Align",i.text_align,[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"}],e=>o({text_align:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Colors</div>
          ${Re("Color",i.color,e=>o({color:e}))}
          ${Re("Background",i.background,e=>o({background:e}))}
          ${ze("Opacity",i.opacity,e=>o({opacity:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Spacing</div>
          ${Ne("Padding",i.padding,e=>o({padding:e}))}
          ${Ne("Margin",i.margin,e=>o({margin:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Borders</div>
          ${ze("Border",i.border,e=>o({border:e}))}
          ${Ne("Border Radius",i.border_radius,e=>o({border_radius:e}))}
          ${ze("Box Shadow",i.box_shadow,e=>o({box_shadow:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Size</div>
          ${Ne("Width",i.width,e=>o({width:e}))}
          ${Ne("Height",i.height,e=>o({height:e}))}
          ${Ne("Min Width",i.min_width,e=>o({min_width:e}))}
          ${Ne("Min Height",i.min_height,e=>o({min_height:e}))}
          ${Ne("Max Width",i.max_width,e=>o({max_width:e}))}
          ${Ne("Max Height",i.max_height,e=>o({max_height:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Custom CSS</div>
          <div class="mc-field">
            <label class="mc-field-label">CSS</label>
            <textarea
              .value=${i.css||""}
              @input=${e=>o({css:e.target.value})}
              rows="4"
              placeholder="color: red; font-size: 20px;"
            ></textarea>
          </div>
        </div>
      </div>
    `}_renderActionConfig(e,t,r){const i=e||{action:"none"};return V`
      <div class="mc-action-config">
        ${De("Action",i.action,[{label:"None",value:"none"},{label:"More Info",value:"more-info"},{label:"Toggle",value:"toggle"},{label:"Navigate",value:"navigate"},{label:"URL",value:"url"},{label:"Perform Action",value:"perform-action"},{label:"Assist",value:"assist"}],e=>t({...i,action:e}))}
        ${"more-info"===i.action||"toggle"===i.action?je("Entity",i.entity,e=>t({...i,entity:e}),r):K}
        ${"navigate"===i.action?ze("Navigation Path",i.navigation_path,e=>t({...i,navigation_path:e})):K}
        ${"url"===i.action?ze("URL",i.url_path,e=>t({...i,url_path:e})):K}
        ${"perform-action"===i.action?V`
              ${function(e,t,r,i){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-service-picker
        .hass=${i}
        .value=${t||""}
        @value-changed=${e=>r(e.detail.value)}
      ></mc-service-picker>
    </div>
  `}("Service",i.service,e=>t({...i,service:e}),r)}
            `:K}
      </div>
    `}}xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"text",name:"Text",description:"Display static or template text",category:"content",icon:"mdi:format-text"}}createDefault(){return{id:ke("text"),type:"text",text:"Hello World"}}renderPreview(e,t){return V`<div class="mc-module mc-text">${e.text||""}</div>`}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${ze("Text",i.text,e=>r({...i,text:e}))}
        ${Pe("Use Template",i.use_template,e=>r({...i,use_template:e}))}
        ${i.use_template?V`
              <div class="mc-field-hint">Use Jinja2 templates: {{ states('sensor.temp') }}</div>
            `:V``}
      </div>
    `}validate(e){const t=[],r=e;return r.text||r.use_template||t.push("Text content is required"),t}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"icon",name:"Icon",description:"Display an icon from MDI or entity",category:"content",icon:"mdi:emoticon-outline"}}createDefault(){return{id:ke("icon"),type:"icon",icon:"mdi:home",size:"24px"}}renderPreview(e,t){const r=e;let i=r.icon||"mdi:help";if(r.use_entity_icon&&r.entity&&t){const e=t.states[r.entity];e?.attributes.icon&&(i=e.attributes.icon)}return V`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${r.size||"24px"}; color: ${r.icon_color||"inherit"}">
        <ha-icon .icon=${i}></ha-icon>
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${Pe("Use Entity Icon",i.use_entity_icon,e=>r({...i,use_entity_icon:e}))}
        ${i.use_entity_icon?K:ze("Icon",i.icon,e=>r({...i,icon:e}))}
        ${ze("Size",i.size,e=>r({...i,size:e}))}
        ${Re("Color",i.icon_color,e=>r({...i,icon_color:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"info",name:"Info",description:"Display entity name, state, and attributes",category:"content",icon:"mdi:information-outline"}}createDefault(){return{id:ke("info"),type:"info",show_name:!0,show_state:!0,show_unit:!0}}renderPreview(e,t){const r=e,i=r.entity&&t?t.states[r.entity]:void 0,o=i?.attributes.friendly_name||r.entity||"No entity",n=i?t.formatEntityState(i):"—";return V`
      <div class="mc-module mc-info">
        ${r.show_name?V`<span class="mc-info-name">${o}</span>`:K}
        ${r.show_state?V`<span class="mc-info-state">
              ${r.prefix||""}${r.attribute&&i?String(i.attributes[r.attribute]??"—"):n}${r.suffix||""}
            </span>`:K}
        ${r.secondary_info&&i?V`<span class="mc-info-secondary"
              >${String(i.attributes[r.secondary_info]??"")}</span
            >`:K}
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${ze("Attribute",i.attribute,e=>r({...i,attribute:e}))}
        ${Pe("Show Name",i.show_name,e=>r({...i,show_name:e}))}
        ${Pe("Show State",i.show_state,e=>r({...i,show_state:e}))}
        ${Pe("Show Unit",i.show_unit,e=>r({...i,show_unit:e}))}
        ${ze("Prefix",i.prefix,e=>r({...i,prefix:e}))}
        ${ze("Suffix",i.suffix,e=>r({...i,suffix:e}))}
        ${ze("Secondary Info (attribute)",i.secondary_info,e=>r({...i,secondary_info:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"image",name:"Image",description:"Display a static image or entity picture",category:"content",icon:"mdi:image"}}createDefault(){return{id:ke("image"),type:"image",image:"",entity_picture:!1,aspect_ratio:"16:9",fit:"cover"}}renderPreview(e,t){const r=e;let i=r.image||"";if(r.entity_picture&&r.entity&&t){const e=t.states[r.entity];e?.attributes.entity_picture&&(i=e.attributes.entity_picture)}const o=r.fit||"cover",n=r.aspect_ratio||"16:9";return V`
      <div
        class="mc-module mc-image"
        style="aspect-ratio: ${n.replace(":","/")}; overflow: hidden;"
      >
        ${i?V`<img
              src=${i}
              style="width: 100%; height: 100%; object-fit: ${o}; display: block;"
              alt=""
            />`:V`<div
              style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--divider-color, #e0e0e0); color: var(--secondary-text-color, #888);"
            >
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${Pe("Use Entity Picture",i.entity_picture,e=>r({...i,entity_picture:e}))}
        ${i.entity_picture?K:ze("Image URL",i.image,e=>r({...i,image:e}))}
        ${ze("Aspect Ratio",i.aspect_ratio,e=>r({...i,aspect_ratio:e}))}
        ${De("Fit",i.fit,[{label:"Cover",value:"cover"},{label:"Contain",value:"contain"},{label:"Fill",value:"fill"},{label:"None",value:"none"}],e=>r({...i,fit:e}))}
      </div>
    `}validate(e){const t=[],r=e;return r.image||r.entity_picture||t.push("An image URL or entity picture source is required"),r.entity_picture&&!r.entity&&t.push("Entity is required when using entity picture"),t}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"markdown",name:"Markdown",description:"Render markdown-formatted content",category:"content",icon:"mdi:language-markdown"}}createDefault(){return{id:ke("markdown"),type:"markdown",content:"**Hello** _World_"}}renderPreview(e,t){const r=(e.content||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/__(.+?)__/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/_(.+?)_/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/\n/g,"<br>");return V`
      <div class="mc-module mc-markdown" .innerHTML=${r}></div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        <div class="mc-field">
          <label class="mc-field-label">Content</label>
          <textarea
            .value=${i.content||""}
            @input=${e=>r({...i,content:e.target.value})}
            rows="6"
            placeholder="**Bold**, _italic_, \`code\`"
          ></textarea>
        </div>
        <div class="mc-field-hint">
          Supports Markdown: **bold**, _italic_, \`code\`, and more.
        </div>
        ${ze("Entity (for templates)",i.entity,e=>r({...i,entity:e}))}
      </div>
    `}validate(e){const t=[];return e.content||t.push("Markdown content is required"),t}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"bar",name:"Bar",description:"Display a progress bar based on entity state",category:"content",icon:"mdi:chart-bar"}}createDefault(){return{id:ke("bar"),type:"bar",min:0,max:100,bar_height:"8px",bar_color:"var(--primary-color, #03a9f4)",bar_background:"var(--divider-color, #e0e0e0)",show_value:!0,direction:"horizontal"}}renderPreview(e,t){const r=e,i=r.min??0,o=r.max??100,n=r.entity&&t?t.states[r.entity]:void 0,a=n?parseFloat(n.state):i,s=Math.min(Math.max(a,i),o),c=o!==i?(s-i)/(o-i)*100:0;let l=r.bar_color||"var(--primary-color, #03a9f4)";if(r.severity&&r.severity.length>0)for(const e of r.severity)if(s>=e.from&&s<=e.to){l=e.color;break}const d=r.bar_background||"var(--divider-color, #e0e0e0)",p=r.bar_height||"8px";return"vertical"===r.direction?V`
        <div class="mc-module mc-bar mc-bar-vertical" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
          ${r.show_value?V`<span class="mc-bar-value">${n?t.formatEntityState(n):"—"}</span>`:K}
          <div
            style="width: ${p}; height: 100%; min-height: 40px; background: ${d}; border-radius: 4px; position: relative; overflow: hidden;"
          >
            <div
              style="position: absolute; bottom: 0; left: 0; width: 100%; height: ${c}%; background: ${l}; border-radius: 4px; transition: height 0.3s ease;"
            ></div>
          </div>
        </div>
      `:V`
      <div class="mc-module mc-bar mc-bar-horizontal" style="display: flex; align-items: center; gap: 8px; width: 100%;">
        <div
          style="flex: 1; height: ${p}; background: ${d}; border-radius: 4px; overflow: hidden;"
        >
          <div
            style="height: 100%; width: ${c}%; background: ${l}; border-radius: 4px; transition: width 0.3s ease;"
          ></div>
        </div>
        ${r.show_value?V`<span class="mc-bar-value" style="white-space: nowrap;">${n?t.formatEntityState(n):"—"}</span>`:K}
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${Oe("Min",i.min,e=>r({...i,min:e}))}
        ${Oe("Max",i.max,e=>r({...i,max:e}))}
        ${ze("Bar Height",i.bar_height,e=>r({...i,bar_height:e}))}
        ${Re("Bar Color",i.bar_color,e=>r({...i,bar_color:e}))}
        ${Re("Bar Background",i.bar_background,e=>r({...i,bar_background:e}))}
        ${Pe("Show Value",i.show_value,e=>r({...i,show_value:e}))}
        ${De("Direction",i.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>r({...i,direction:e}))}
      </div>
    `}validate(e){const t=[],r=e;return r.entity||t.push("Entity is required for bar module"),void 0!==r.min&&void 0!==r.max&&r.min>=r.max&&t.push("Min must be less than max"),t}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"graphs",name:"Graph",description:"Display entity history as a line graph",category:"content",icon:"mdi:chart-line"}}createDefault(){return{id:ke("graphs"),type:"graphs",hours_to_show:24,points_per_hour:2,line_width:2,fill:!0,show_points:!1,show_labels:!0}}renderPreview(e,t){const r=e,i=r.line_color||"var(--mc-primary)",o=r.fill_color||"var(--mc-primary)";return V`
      <div class="mc-module mc-graphs">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" style="height: 60px">
          ${r.fill?V`<path d="M0,50 Q30,30 60,35 T120,20 T200,30 L200,60 L0,60 Z"
                fill="${o}" opacity="0.15" />`:""}
          <path d="M0,50 Q30,30 60,35 T120,20 T200,30"
            fill="none" stroke="${i}" stroke-width="${r.line_width||2}" />
          ${r.show_points?V`
                <circle cx="0" cy="50" r="3" fill="${i}" />
                <circle cx="60" cy="35" r="3" fill="${i}" />
                <circle cx="120" cy="20" r="3" fill="${i}" />
                <circle cx="200" cy="30" r="3" fill="${i}" />
              `:""}
        </svg>
        ${r.show_labels?V`<div style="font-size:0.75rem; color:var(--mc-text-secondary); margin-top:4px">
              ${r.entity||"No entity"} &mdash; ${r.hours_to_show||24}h
            </div>`:""}
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${Oe("Hours to Show",i.hours_to_show,e=>r({...i,hours_to_show:e}),{min:1,max:168})}
        ${Oe("Points per Hour",i.points_per_hour,e=>r({...i,points_per_hour:e}),{min:1,max:60})}
        ${Re("Line Color",i.line_color,e=>r({...i,line_color:e}))}
        ${Oe("Line Width",i.line_width,e=>r({...i,line_width:e}),{min:1,max:10})}
        ${Pe("Fill",i.fill,e=>r({...i,fill:e}))}
        ${Re("Fill Color",i.fill_color,e=>r({...i,fill_color:e}))}
        ${Pe("Show Points",i.show_points,e=>r({...i,show_points:e}))}
        ${Pe("Show Labels",i.show_labels,e=>r({...i,show_labels:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"camera",name:"Camera",description:"Display a camera entity stream",category:"content",icon:"mdi:cctv"}}createDefault(){return{id:ke("camera"),type:"camera",aspect_ratio:"16:9",show_controls:!0}}renderPreview(e,t){const r=e,i=r.entity&&t?t.states[r.entity]:void 0,o=i?.attributes.entity_picture,n=i?.attributes.friendly_name||r.entity||"No camera";return V`
      <div class="mc-module mc-camera" style="aspect-ratio: ${(r.aspect_ratio||"16:9").replace(":","/")}">
        ${o?V`<img src="${o}" alt="${n}" />`:V`<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--mc-border);color:var(--mc-text-secondary);font-size:0.875rem;">
              <ha-icon icon="mdi:cctv" style="margin-right:8px"></ha-icon>${n}
            </div>`}
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Camera Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${ze("Aspect Ratio",i.aspect_ratio,e=>r({...i,aspect_ratio:e}))}
        ${Pe("Show Controls",i.show_controls,e=>r({...i,show_controls:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"button",name:"Button",description:"Interactive button with icon, label, and optional state display",category:"controls",icon:"mdi:gesture-tap"}}createDefault(){return{id:ke("button"),type:"button",label:"Button",icon:"mdi:power",show_state:!1,button_style:"default"}}renderPreview(e,t){const r=e,i=r.entity&&t?t.states[r.entity]:void 0,o=i?t.formatEntityState(i):void 0,n=r.label||"Button",a="icon-only"===r.button_style;return V`
      <div class="mc-module mc-button mc-button--${r.button_style||"default"}">
        <button
          class="mc-button-inner"
          style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: ${a?"8px":"8px 16px"};
            border-radius: 8px;
            border: ${"outline"===r.button_style?"1px solid var(--primary-color, #03a9f4)":"none"};
            background: ${"flat"===r.button_style||"outline"===r.button_style?"transparent":"var(--primary-color, #03a9f4)"};
            color: ${"flat"===r.button_style||"outline"===r.button_style?"var(--primary-color, #03a9f4)":"#fff"};
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          "
        >
          ${r.icon?V`<ha-icon .icon=${r.icon} style="--mdc-icon-size: 20px;"></ha-icon>`:K}
          ${a?K:V`<span>${n}</span>`}
          ${r.show_state&&o?V`<span class="mc-button-state" style="opacity: 0.8; font-size: 12px;">${o}</span>`:K}
        </button>
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${ze("Label",i.label,e=>r({...i,label:e}))}
        ${ze("Icon",i.icon,e=>r({...i,icon:e}))}
        ${De("Button Style",i.button_style,[{label:"Default",value:"default"},{label:"Outline",value:"outline"},{label:"Flat",value:"flat"},{label:"Icon Only",value:"icon-only"}],e=>r({...i,button_style:e}))}
        ${Pe("Show State",i.show_state,e=>r({...i,show_state:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"slider",name:"Slider",description:"Range slider for controlling numeric values",category:"controls",icon:"mdi:tune-vertical"}}createDefault(){return{id:ke("slider"),type:"slider",min:0,max:100,step:1,show_value:!0,direction:"horizontal"}}renderPreview(e,t){const r=e,i=r.entity&&t?t.states[r.entity]:void 0,o=r.min??0,n=r.max??100,a=r.step??1,s=i?r.attribute?Number(i.attributes[r.attribute]??o):Number(i.state):Math.round((o+n)/2),c="vertical"===r.direction;return V`
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
            accent-color: ${r.slider_color||"var(--primary-color, #03a9f4)"};
            ${c?"writing-mode: vertical-lr; direction: rtl; height: 100%;":"width: 100%;"}
            ${r.track_color?`background: ${r.track_color};`:""}
          "
        />
        ${r.show_value?V`<span class="mc-slider-value" style="font-size: 14px; min-width: 36px; text-align: center;">
              ${s}
            </span>`:K}
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${ze("Attribute",i.attribute,e=>r({...i,attribute:e}))}
        ${Oe("Min",i.min,e=>r({...i,min:e}))}
        ${Oe("Max",i.max,e=>r({...i,max:e}))}
        ${Oe("Step",i.step,e=>r({...i,step:e}),{min:.01,step:.01})}
        ${Pe("Show Value",i.show_value,e=>r({...i,show_value:e}))}
        ${De("Direction",i.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>r({...i,direction:e}))}
        ${Re("Slider Color",i.slider_color,e=>r({...i,slider_color:e}))}
        ${Re("Track Color",i.track_color,e=>r({...i,track_color:e}))}
        ${ze("Thumb Size",i.thumb_size,e=>r({...i,thumb_size:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"spinbox",name:"Spinbox",description:"Numeric input with increment and decrement buttons",category:"controls",icon:"mdi:numeric"}}createDefault(){return{id:ke("spinbox"),type:"spinbox",min:0,max:100,step:1}}renderPreview(e,t){const r=e,i=r.entity&&t?t.states[r.entity]:void 0,o=r.min??0,n=r.max??100,a=i?r.attribute?Number(i.attributes[r.attribute]??o):Number(i.state):Math.round((o+n)/2),s="\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      width: 32px;\n      height: 32px;\n      border: none;\n      border-radius: 50%;\n      background: var(--primary-color, #03a9f4);\n      color: #fff;\n      font-size: 18px;\n      font-weight: bold;\n      cursor: pointer;\n      line-height: 1;\n    ";return V`
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
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${ze("Attribute",i.attribute,e=>r({...i,attribute:e}))}
        ${Oe("Min",i.min,e=>r({...i,min:e}))}
        ${Oe("Max",i.max,e=>r({...i,max:e}))}
        ${Oe("Step",i.step,e=>r({...i,step:e}),{min:.01,step:.01})}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"dropdown",name:"Dropdown",description:"Select dropdown for choosing from a list of options",category:"controls",icon:"mdi:form-dropdown"}}createDefault(){return{id:ke("dropdown"),type:"dropdown",options:[{label:"Option 1",value:"option_1"},{label:"Option 2",value:"option_2"},{label:"Option 3",value:"option_3"}]}}renderPreview(e,t){const r=e,i=r.entity&&t?t.states[r.entity]:void 0,o=i?r.attribute?String(i.attributes[r.attribute]??""):i.state:void 0,n=r.options||[];return V`
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
          ${n.length>0?n.map(e=>V`
                  <option value=${e.value} ?selected=${o===e.value}>
                    ${e.label}
                  </option>
                `):V`<option disabled selected>No options</option>`}
        </select>
      </div>
    `}renderGeneralTab(e,t,r){const i=e,o=i.options||[],n=(e,t,n)=>{const a=o.map((r,i)=>i===e?{...r,[t]:n}:r);r({...i,options:a})};return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${ze("Attribute",i.attribute,e=>r({...i,attribute:e}))}

        <div class="mc-section">
          <div class="mc-section-header">Options</div>
          <div class="mc-options-list">
            ${o.map((e,t)=>V`
                <div class="mc-option-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${ze("Label",e.label,e=>n(t,"label",e))}
                  ${ze("Value",e.value,e=>n(t,"value",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=o.filter((t,r)=>r!==e);r({...i,options:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...o,{label:`Option ${o.length+1}`,value:`option_${o.length+1}`}];r({...i,options:e})}}>Add Option</button>
        </div>
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"light",name:"Light",description:"Light control with brightness, color temp, and color options",category:"controls",icon:"mdi:lightbulb"}}createDefault(){return{id:ke("light"),type:"light",show_brightness:!0,show_color_temp:!1,show_color:!1,compact:!1}}renderPreview(e,t){const r=e,i=r.entity&&t?t.states[r.entity]:void 0,o=!!i&&"on"===i.state,n=i?.attributes.brightness,a=void 0!==n?Math.round(n/255*100):void 0,s=i?.attributes.color_temp,c=i?.attributes.friendly_name||r.entity||"Light",l=o?"var(--state-light-active-color, #fdd835)":"var(--state-icon-color, #9e9e9e)";return V`
      <div
        class="mc-module mc-light ${r.compact?"mc-light--compact":""}"
        style="
          display: flex;
          flex-direction: ${r.compact?"row":"column"};
          align-items: ${r.compact?"center":"stretch"};
          gap: ${r.compact?"12px":"8px"};
        "
      >
        <div
          class="mc-light-header"
          style="display: flex; align-items: center; gap: 8px;"
        >
          <ha-icon
            .icon=${"mdi:lightbulb"}
            style="color: ${l}; --mdc-icon-size: ${r.compact?"24px":"32px"};"
          ></ha-icon>
          ${r.compact?V`<span style="font-weight: 500; flex: 1;">${c}</span>`:V`
                <div style="flex: 1;">
                  <div style="font-weight: 500;">${c}</div>
                  <div style="font-size: 12px; opacity: 0.7;">
                    ${o?void 0!==a?`${a}%`:"On":"Off"}
                  </div>
                </div>
              `}
        </div>

        ${r.show_brightness?V`
              <div class="mc-light-brightness" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:brightness-6"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="range"
                  min="0"
                  max="100"
                  .value=${String(a??50)}
                  style="flex: 1; accent-color: var(--state-light-active-color, #fdd835);"
                />
                ${void 0!==a?V`<span style="font-size: 12px; min-width: 32px; text-align: right;">${a}%</span>`:K}
              </div>
            `:K}

        ${r.show_color_temp?V`
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

        ${r.show_color?V`
              <div class="mc-light-color" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:palette"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="color"
                  style="width: 32px; height: 32px; border: none; padding: 0; cursor: pointer;"
                />
              </div>
            `:K}
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${Pe("Show Brightness",i.show_brightness,e=>r({...i,show_brightness:e}))}
        ${Pe("Show Color Temp",i.show_color_temp,e=>r({...i,show_color_temp:e}))}
        ${Pe("Show Color Picker",i.show_color,e=>r({...i,show_color:e}))}
        ${Pe("Compact Mode",i.compact,e=>r({...i,compact:e}))}
      </div>
    `}validate(e){const t=[];return e.entity||t.push("Entity is required for light module"),t}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"gauge",name:"Gauge",description:"Arc gauge for displaying numeric sensor values",category:"controls",icon:"mdi:gauge"}}createDefault(){return{id:ke("gauge"),type:"gauge",min:0,max:100,needle:!0,gauge_style:"half"}}renderPreview(e,t){const r=e,i=r.entity&&t?t.states[r.entity]:void 0,o=r.min??0,n=r.max??100,a=i?Number(i.state):Math.round((o+n)/2),s=Math.max(o,Math.min(n,a)),c=(s-o)/(n-o)*100,l=this._getSeverityColor(s,r.severity)||"var(--primary-color, #03a9f4)",d=("half"===r.gauge_style||r.gauge_style,"full"===r.gauge_style),p="quarter"===r.gauge_style;if(d){const e=c/100*360,t=(e-90)*(Math.PI/180),r=40,i=50,o=50+r*Math.cos(t),n=i+r*Math.sin(t);return V`
        <div class="mc-module mc-gauge mc-gauge--full" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${c>0?V`<path
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
      `}if(p){const e=c/100*90,t=Math.PI/180*-90,r=(-90+e)*(Math.PI/180),i=44,o=10,n=90,a=o+i*Math.cos(t),d=n+i*Math.sin(t),p=o+i*Math.cos(r),u=n+i*Math.sin(r);return V`
        <div class="mc-module mc-gauge mc-gauge--quarter" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <path d="M 10 46 A 44 44 0 0 1 54 90" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${c>0?V`<path
                  d="M ${a} ${d} A ${i} ${i} 0 0 1 ${p} ${u}"
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
      `}const u=c/100*180,h=(180+u)*(Math.PI/180),m=50+40*Math.cos(h),g=55+40*Math.sin(h);return V`
      <div class="mc-module mc-gauge mc-gauge--half" style="text-align: center;">
        <svg viewBox="0 0 100 70" width="140" height="100">
          <path
            d="M 10 55 A 40 40 0 0 1 90 55"
            fill="none"
            stroke="var(--divider-color, #e0e0e0)"
            stroke-width="8"
            stroke-linecap="round"
          />
          ${c>0?V`<path
                d="M 10 55 A 40 40 0 ${u>180?1:0} 1 ${m} ${g}"
                fill="none"
                stroke=${l}
                stroke-width="8"
                stroke-linecap="round"
              />`:""}
          ${r.needle?V`
                <line
                  x1="50"
                  y1="55"
                  x2=${m}
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
    `}renderGeneralTab(e,t,r){const i=e,o=i.severity||[],n=(e,t,n)=>{const a=o.map((r,i)=>i===e?{...r,[t]:n}:r);r({...i,severity:a})};return V`
      <div class="mc-tab-content">
        ${je("Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${Oe("Min",i.min,e=>r({...i,min:e}))}
        ${Oe("Max",i.max,e=>r({...i,max:e}))}
        ${De("Gauge Style",i.gauge_style,[{label:"Half (semicircle)",value:"half"},{label:"Full (circle)",value:"full"},{label:"Quarter",value:"quarter"}],e=>r({...i,gauge_style:e}))}
        ${Pe("Show Needle",i.needle,e=>r({...i,needle:e}))}

        <div class="mc-section">
          <div class="mc-section-header">Severity Ranges</div>
          <div class="mc-severity-list">
            ${o.map((e,t)=>V`
                <div class="mc-severity-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${Oe("From",e.from,e=>n(t,"from",e))}
                  ${Oe("To",e.to,e=>n(t,"to",e))}
                  ${Re("Color",e.color,e=>n(t,"color",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=o.filter((t,r)=>r!==e);r({...i,severity:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...o,{from:0,to:100,color:"#4caf50"}];r({...i,severity:e})}}>Add Severity Range</button>
        </div>
      </div>
    `}_getSeverityColor(e,t){if(t&&0!==t.length)for(const r of t)if(e>=r.from&&e<=r.to)return r.color}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"horizontal",name:"Horizontal",description:"Arrange child modules in a row",category:"layout",icon:"mdi:arrow-split-vertical"}}createDefault(){return{id:ke("horizontal"),type:"horizontal",modules:[],gap:"8px",align:"center",justify:"start"}}renderPreview(e,t){const r=e,i=r.modules||[];return V`
      <div class="mc-module mc-horizontal"
        style="gap:${r.gap||"8px"}; align-items:${r.align||"center"}; justify-content:${r.justify||"start"}">
        ${i.length>0?i.map(e=>{const r=xe.get(e.type);return r?r.renderPreview(e,t):V`<span class="mc-error">?</span>`}):V`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty row</span>`}
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${ze("Gap",i.gap,e=>r({...i,gap:e}))}
        ${De("Align",i.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>r({...i,align:e}))}
        ${De("Justify",i.justify,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Space Between",value:"space-between"},{label:"Space Around",value:"space-around"}],e=>r({...i,justify:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"vertical",name:"Vertical",description:"Arrange child modules in a column",category:"layout",icon:"mdi:arrow-split-horizontal"}}createDefault(){return{id:ke("vertical"),type:"vertical",modules:[],gap:"8px",align:"stretch"}}renderPreview(e,t){const r=e,i=r.modules||[];return V`
      <div class="mc-module mc-vertical"
        style="gap:${r.gap||"8px"}; align-items:${r.align||"stretch"}">
        ${i.length>0?i.map(e=>{const r=xe.get(e.type);return r?r.renderPreview(e,t):V`<span class="mc-error">?</span>`}):V`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty column</span>`}
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${ze("Gap",i.gap,e=>r({...i,gap:e}))}
        ${De("Align",i.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>r({...i,align:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"tabs",name:"Tabs",description:"Tabbed container for groups of modules",category:"layout",icon:"mdi:tab"}}createDefault(){return{id:ke("tabs"),type:"tabs",tabs:[{label:"Tab 1",modules:[]},{label:"Tab 2",modules:[]}],active_tab:0,tab_style:"default"}}renderPreview(e,t){const r=e,i=r.tabs||[],o=r.active_tab||0,n=i[o];return V`
      <div class="mc-module mc-tabs">
        <div class="mc-tabs-header">
          ${i.map((e,t)=>V`
              <button class="mc-tab-button ${t===o?"active":""}">
                ${e.icon?V`<ha-icon icon=${e.icon} style="--mdc-icon-size:16px"></ha-icon>`:""}
                ${e.label}
              </button>
            `)}
        </div>
        <div class="mc-tabs-content">
          ${n?.modules?.length?n.modules.map(e=>{const r=xe.get(e.type);return r?r.renderPreview(e,t):V`<span class="mc-error">?</span>`}):V`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty tab</span>`}
        </div>
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${De("Tab Style",i.tab_style,[{label:"Default",value:"default"},{label:"Pills",value:"pills"},{label:"Underline",value:"underline"}],e=>r({...i,tab_style:e}))}
        <div class="mc-section">
          <div class="mc-section-header">Tabs</div>
          ${(i.tabs||[]).map((e,t)=>V`
              <div class="mc-field" style="display:flex;gap:8px;align-items:center">
                <input type="text" .value=${e.label}
                  @input=${e=>{const o=[...i.tabs||[]];o[t]={...o[t],label:e.target.value},r({...i,tabs:o})}} />
                <button class="mc-btn-icon" @click=${()=>{const e=(i.tabs||[]).filter((e,r)=>r!==t);r({...i,tabs:e})}}>&times;</button>
              </div>
            `)}
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...i.tabs||[],{label:`Tab ${(i.tabs||[]).length+1}`,modules:[]}];r({...i,tabs:e})}}>Add Tab</button>
        </div>
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"separator",name:"Separator",description:"Visual divider between modules",category:"layout",icon:"mdi:minus"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:ke("separator"),type:"separator",separator_style:"solid",separator_color:"var(--divider-color, #e5e7eb)",separator_width:"1px",direction:"horizontal"}}renderPreview(e,t){const r=e;return"vertical"===r.direction?V`
        <div class="mc-module mc-separator-vertical"
          style="border-left-style:${r.separator_style||"solid"}; border-left-color:${r.separator_color||"var(--divider-color)"}; border-left-width:${r.separator_width||"1px"}">
        </div>
      `:V`
      <hr class="mc-module mc-separator"
        style="border-top-style:${r.separator_style||"solid"}; border-top-color:${r.separator_color||"var(--divider-color)"}; border-top-width:${r.separator_width||"1px"}" />
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${De("Direction",i.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>r({...i,direction:e}))}
        ${De("Style",i.separator_style,[{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"None",value:"none"}],e=>r({...i,separator_style:e}))}
        ${Re("Color",i.separator_color,e=>r({...i,separator_color:e}))}
        ${ze("Width",i.separator_width,e=>r({...i,separator_width:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"clock",name:"Clock",description:"Display current time and date",category:"advanced",icon:"mdi:clock-outline"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:ke("clock"),type:"clock",format_12h:!1,show_seconds:!1,show_date:!0,date_format:"short"}}renderPreview(e,t){const r=e,i=new Date,o={hour:"2-digit",minute:"2-digit",hour12:r.format_12h??!1};r.show_seconds&&(o.second="2-digit");const n=i.toLocaleTimeString(void 0,o),a=r.show_date?i.toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric"}):"";return V`
      <div class="mc-module mc-clock">
        <span class="mc-clock-time">${n}</span>
        ${r.show_date?V`<span class="mc-clock-date">${a}</span>`:K}
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${Pe("12-Hour Format",i.format_12h,e=>r({...i,format_12h:e}))}
        ${Pe("Show Seconds",i.show_seconds,e=>r({...i,show_seconds:e}))}
        ${Pe("Show Date",i.show_date,e=>r({...i,show_date:e}))}
        ${ze("Date Format",i.date_format,e=>r({...i,date_format:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"weather",name:"Weather",description:"Display weather entity information",category:"advanced",icon:"mdi:weather-partly-cloudy"}}createDefault(){return{id:ke("weather"),type:"weather",show_temperature:!0,show_condition:!0,show_forecast:!1,forecast_days:5}}renderPreview(e,t){const r=e,i=r.entity&&t?t.states[r.entity]:void 0,o=i?.attributes.temperature,n=i?.state||"unknown",a=i?.attributes.temperature_unit||"°C",s=this._conditionIcon(n);return V`
      <div class="mc-module mc-weather">
        <ha-icon icon=${s} style="--mdc-icon-size:36px"></ha-icon>
        <div>
          ${r.show_temperature&&void 0!==o?V`<div class="mc-weather-temp">${o}${a}</div>`:K}
          ${r.show_condition?V`<div class="mc-weather-condition">${n}</div>`:K}
        </div>
      </div>
    `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Weather Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${Pe("Show Temperature",i.show_temperature,e=>r({...i,show_temperature:e}))}
        ${Pe("Show Condition",i.show_condition,e=>r({...i,show_condition:e}))}
        ${Pe("Show Forecast",i.show_forecast,e=>r({...i,show_forecast:e}))}
        ${i.show_forecast?Oe("Forecast Days",i.forecast_days,e=>r({...i,forecast_days:e}),{min:1,max:7}):K}
      </div>
    `}_conditionIcon(e){return{"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant",exceptional:"mdi:alert-circle-outline"}[e]||"mdi:weather-partly-cloudy"}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"forecast",name:"Forecast",description:"Display weather forecast data",category:"advanced",icon:"mdi:calendar-week"}}createDefault(){return{id:ke("forecast"),type:"forecast",forecast_type:"daily",num_forecasts:5,show_temperature:!0,show_precipitation:!0,show_wind:!1}}renderPreview(e,t){const r=e,i=r.entity&&t?t.states[r.entity]:void 0,o=(i?.attributes.forecast||[]).slice(0,r.num_forecasts||5);return o.length?V`
      <div class="mc-module mc-forecast">
        ${o.map(e=>V`
            <div class="mc-forecast-item">
              <span style="font-size:0.75rem;color:var(--mc-text-secondary)">
                ${e.datetime?new Date(e.datetime).toLocaleDateString(void 0,{weekday:"short"}):""}
              </span>
              <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
              ${r.show_temperature?V`<span style="font-size:0.875rem">${e.temperature??"--"}°</span>`:K}
              ${r.show_precipitation&&void 0!==e.precipitation?V`<span style="font-size:0.75rem;color:var(--mc-text-secondary)">${e.precipitation}mm</span>`:K}
            </div>
          `)}
      </div>
    `:V`
        <div class="mc-module mc-forecast">
          ${Array.from({length:r.num_forecasts||5}).map((e,t)=>V`
              <div class="mc-forecast-item">
                <span style="font-size:0.75rem;color:var(--mc-text-secondary)">Day ${t+1}</span>
                <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
                <span style="font-size:0.875rem">--°</span>
              </div>
            `)}
        </div>
      `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${je("Weather Entity",i.entity,e=>r({...i,entity:e}),t)}
        ${De("Forecast Type",i.forecast_type,[{label:"Daily",value:"daily"},{label:"Hourly",value:"hourly"}],e=>r({...i,forecast_type:e}))}
        ${Oe("Number of Forecasts",i.num_forecasts,e=>r({...i,num_forecasts:e}),{min:1,max:10})}
        ${Pe("Show Temperature",i.show_temperature,e=>r({...i,show_temperature:e}))}
        ${Pe("Show Precipitation",i.show_precipitation,e=>r({...i,show_precipitation:e}))}
        ${Pe("Show Wind",i.show_wind,e=>r({...i,show_wind:e}))}
      </div>
    `}});xe.register(new class extends gi{constructor(){super(...arguments),this.metadata={type:"video-bg",name:"Video Background",description:"Display a video as a background",category:"advanced",icon:"mdi:video-outline"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:ke("video-bg"),type:"video-bg",autoplay:!0,loop:!0,muted:!0}}renderPreview(e,t){const r=e;return r.url?V`
      <div class="mc-module mc-video-bg">
        <video
          src=${r.url}
          poster=${r.poster||K}
          ?autoplay=${r.autoplay}
          ?loop=${r.loop}
          ?muted=${r.muted}
          playsinline
        ></video>
      </div>
    `:V`
        <div class="mc-module mc-video-bg" style="display:flex;align-items:center;justify-content:center;height:120px;background:var(--mc-border);border-radius:8px">
          <ha-icon icon="mdi:video-off-outline" style="--mdc-icon-size:32px;color:var(--mc-text-secondary)"></ha-icon>
        </div>
      `}renderGeneralTab(e,t,r){const i=e;return V`
      <div class="mc-tab-content">
        ${ze("Video URL",i.url,e=>r({...i,url:e}))}
        ${ze("Poster Image URL",i.poster,e=>r({...i,poster:e}))}
        ${Pe("Autoplay",i.autoplay,e=>r({...i,autoplay:e}))}
        ${Pe("Loop",i.loop,e=>r({...i,loop:e}))}
        ${Pe("Muted",i.muted,e=>r({...i,muted:e}))}
      </div>
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:e,name:"Magic Card",description:"A fully open-source multi-module card with advanced editor",preview:!0,documentationURL:"https://github.com/your-repo/magic-card"}),console.info("%c MAGIC-CARD %c v0.1.0 ","color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;")})();