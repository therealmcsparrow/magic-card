(()=>{"use strict";const e="magic-card",t="magic-card-editor",i=["content","controls","layout","advanced"],r=globalThis,n=r.ShadowRoot&&(void 0===r.ShadyCSS||r.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),a=new WeakMap;class s{constructor(e,t,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(n&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(t,e))}return e}toString(){return this.cssText}}const c=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new s(i,e,o)},l=(e,t)=>{if(n)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),n=r.litNonce;void 0!==n&&t.setAttribute("nonce",n),t.textContent=i.cssText,e.appendChild(t)}},d=n?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,o))(t)})(e):e,{is:p,defineProperty:u,getOwnPropertyDescriptor:h,getOwnPropertyNames:m,getOwnPropertySymbols:f,getPrototypeOf:g}=Object,b=globalThis,v=b.trustedTypes,y=v?v.emptyScript:"",x=b.reactiveElementPolyfillSupport,w=(e,t)=>e,_={toAttribute(e,t){switch(t){case Boolean:e=e?y:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},$=(e,t)=>!p(e,t),A={attribute:!0,type:String,converter:_,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),b.litPropertyMetadata??=new WeakMap;class k extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=A){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);void 0!==r&&u(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:n}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){const o=r?.call(this);n?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??A}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const e=g(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const e=this.properties,t=[...m(e),...f(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(d(e))}else void 0!==e&&t.push(d(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return l(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(void 0!==r&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:_).toAttribute(t,i.type);this._$Em=e,null==n?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,r=i._$Eh.get(e);if(void 0!==r&&this._$Em!==r){const e=i.getPropertyOptions(r),n="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:_;this._$Em=r;const o=n.fromAttribute(t,e.type);this[r]=o??this._$Ej?.get(r)??o,this._$Em=null}}requestUpdate(e,t,i,r=!1,n){if(void 0!==e){const o=this.constructor;if(!1===r&&(n=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??$)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:n},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==n||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,r=this[t];!0!==e||this._$AL.has(t)||void 0===r||this.C(t,void 0,i,r)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[w("elementProperties")]=new Map,k[w("finalized")]=new Map,x?.({ReactiveElement:k}),(b.reactiveElementVersions??=[]).push("2.1.2");const S=globalThis,C=e=>e,M=S.trustedTypes,T=M?M.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+I,z=`<${O}>`,j=document,P=()=>j.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,D=Array.isArray,R=e=>D(e)||"function"==typeof e?.[Symbol.iterator],L="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,H=/>/g,B=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),q=/'/g,G=/"/g,Y=/^(?:script|style|textarea|title)$/i,W=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=W(1),K=(W(2),W(3),Symbol.for("lit-noChange")),Q=Symbol.for("lit-nothing"),Z=new WeakMap,J=j.createTreeWalker(j,129);function X(e,t){if(!D(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==T?T.createHTML(t):t}const ee=(e,t)=>{const i=e.length-1,r=[];let n,o=2===t?"<svg>":3===t?"<math>":"",a=U;for(let t=0;t<i;t++){const i=e[t];let s,c,l=-1,d=0;for(;d<i.length&&(a.lastIndex=d,c=a.exec(i),null!==c);)d=a.lastIndex,a===U?"!--"===c[1]?a=F:void 0!==c[1]?a=H:void 0!==c[2]?(Y.test(c[2])&&(n=RegExp("</"+c[2],"g")),a=B):void 0!==c[3]&&(a=B):a===B?">"===c[0]?(a=n??U,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,s=c[1],a=void 0===c[3]?B:'"'===c[3]?G:q):a===G||a===q?a=B:a===F||a===H?a=U:(a=B,n=void 0);const p=a===B&&e[t+1].startsWith("/>")?" ":"";o+=a===U?i+z:l>=0?(r.push(s),i.slice(0,l)+E+i.slice(l)+I+p):i+I+(-2===l?t:p)}return[X(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),r]};class te{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let n=0,o=0;const a=e.length-1,s=this.parts,[c,l]=ee(e,t);if(this.el=te.createElement(c,i),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(r=J.nextNode())&&s.length<a;){if(1===r.nodeType){if(r.hasAttributes())for(const e of r.getAttributeNames())if(e.endsWith(E)){const t=l[o++],i=r.getAttribute(e).split(I),a=/([.?@])?(.*)/.exec(t);s.push({type:1,index:n,name:a[2],strings:i,ctor:"."===a[1]?ae:"?"===a[1]?se:"@"===a[1]?ce:oe}),r.removeAttribute(e)}else e.startsWith(I)&&(s.push({type:6,index:n}),r.removeAttribute(e));if(Y.test(r.tagName)){const e=r.textContent.split(I),t=e.length-1;if(t>0){r.textContent=M?M.emptyScript:"";for(let i=0;i<t;i++)r.append(e[i],P()),J.nextNode(),s.push({type:2,index:++n});r.append(e[t],P())}}}else if(8===r.nodeType)if(r.data===O)s.push({type:2,index:n});else{let e=-1;for(;-1!==(e=r.data.indexOf(I,e+1));)s.push({type:7,index:n}),e+=I.length-1}n++}}static createElement(e,t){const i=j.createElement("template");return i.innerHTML=e,i}}function ie(e,t,i=e,r){if(t===K)return t;let n=void 0!==r?i._$Co?.[r]:i._$Cl;const o=N(t)?void 0:t._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(e),n._$AT(e,i,r)),void 0!==r?(i._$Co??=[])[r]=n:i._$Cl=n),void 0!==n&&(t=ie(e,n._$AS(e,t.values),n,r)),t}class re{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??j).importNode(t,!0);J.currentNode=r;let n=J.nextNode(),o=0,a=0,s=i[0];for(;void 0!==s;){if(o===s.index){let t;2===s.type?t=new ne(n,n.nextSibling,this,e):1===s.type?t=new s.ctor(n,s.name,s.strings,this,e):6===s.type&&(t=new le(n,this,e)),this._$AV.push(t),s=i[++a]}o!==s?.index&&(n=J.nextNode(),o++)}return J.currentNode=j,r}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class ne{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=Q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ie(this,e,t),N(e)?e===Q||null==e||""===e?(this._$AH!==Q&&this._$AR(),this._$AH=Q):e!==this._$AH&&e!==K&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):R(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==Q&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(j.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,r="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=te.createElement(X(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{const e=new re(r,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Z.get(e.strings);return void 0===t&&Z.set(e.strings,t=new te(e)),t}k(e){D(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const n of e)r===t.length?t.push(i=new ne(this.O(P()),this.O(P()),this,this.options)):i=t[r],i._$AI(n),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=C(e).nextSibling;C(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class oe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,n){this.type=1,this._$AH=Q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Q}_$AI(e,t=this,i,r){const n=this.strings;let o=!1;if(void 0===n)e=ie(this,e,t,0),o=!N(e)||e!==this._$AH&&e!==K,o&&(this._$AH=e);else{const r=e;let a,s;for(e=n[0],a=0;a<n.length-1;a++)s=ie(this,r[i+a],t,a),s===K&&(s=this._$AH[a]),o||=!N(s)||s!==this._$AH[a],s===Q?e=Q:e!==Q&&(e+=(s??"")+n[a+1]),this._$AH[a]=s}o&&!r&&this.j(e)}j(e){e===Q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ae extends oe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===Q?void 0:e}}class se extends oe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==Q)}}class ce extends oe{constructor(e,t,i,r,n){super(e,t,i,r,n),this.type=5}_$AI(e,t=this){if((e=ie(this,e,t,0)??Q)===K)return;const i=this._$AH,r=e===Q&&i!==Q||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==Q&&(i===Q||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class le{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ie(this,e)}}const de=S.litHtmlPolyfillSupport;de?.(te,ne),(S.litHtmlVersions??=[]).push("3.3.2");const pe=globalThis;class ue extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const r=i?.renderBefore??t;let n=r._$litPart$;if(void 0===n){const e=i?.renderBefore??null;r._$litPart$=n=new ne(t.insertBefore(P(),e),e,void 0,i??{})}return n._$AI(e),n})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}}ue._$litElement$=!0,ue.finalized=!0,pe.litElementHydrateSupport?.({LitElement:ue});const he=pe.litElementPolyfillSupport;he?.({LitElement:ue});(pe.litElementVersions??=[]).push("4.2.2");const me=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},fe={attribute:!0,type:String,converter:_,reflect:!1,hasChanged:$},ge=(e=fe,t,i)=>{const{kind:r,metadata:n}=i;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===r&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===r){const{name:r}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(r,n,e,!0,i)},init(t){return void 0!==t&&this.C(r,void 0,e,t),t}}}if("setter"===r){const{name:r}=i;return function(i){const n=this[r];t.call(this,i),this.requestUpdate(r,n,e,!0,i)}}throw Error("Unsupported decorator location: "+r)};function be(e){return(t,i)=>"object"==typeof i?ge(e,t,i):((e,t,i)=>{const r=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),r?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function ve(e){return be({...e,state:!0,attribute:!1})}const ye=c`
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
`;const xe=new class{constructor(){this.modules=new Map}register(e){this.modules.set(e.metadata.type,e)}get(e){return this.modules.get(e)}getAll(){return Array.from(this.modules.values())}getByCategory(e){return this.getAll().filter(t=>t.metadata.category===e)}getMetadata(){return this.getAll().map(e=>e.metadata)}search(e){const t=e.toLowerCase();return this.getAll().filter(e=>e.metadata.name.toLowerCase().includes(t)||e.metadata.description.toLowerCase().includes(t)||e.metadata.type.toLowerCase().includes(t))}createDefault(e){const t=this.get(e);return t?t.createDefault():null}has(e){return this.modules.has(e)}get types(){return Array.from(this.modules.keys())}},we={font_size:"font-size",font_weight:"font-weight",font_family:"font-family",line_height:"line-height",text_align:"text-align",text_transform:"text-transform",letter_spacing:"letter-spacing",color:"color",background:"background",opacity:"opacity",padding:"padding",margin:"margin",border:"border",border_radius:"border-radius",border_color:"border-color",box_shadow:"box-shadow",text_shadow:"text-shadow",width:"width",height:"height",min_width:"min-width",min_height:"min-height",max_width:"max-width",max_height:"max-height",overflow:"overflow",flex:"flex",filter:"filter",backdrop_filter:"backdrop-filter",transform:"transform",transition:"transition"};function _e(e){if(!e)return"";const t=[];for(const[i,r]of Object.entries(we)){const n=e[i];void 0!==n&&"string"==typeof n&&t.push(`${r}: ${n}`)}return e.css&&t.push(e.css),t.join("; ")}let $e=0;function Ae(e="mc"){$e++;return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}_${$e}`}var ke=function(e,t,i,r){var n,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let Se=class extends ue{static getConfigElement(){return t}static getStubConfig(){return{type:`custom:${e}`,rows:[{id:Ae("row"),layout:"1",columns:[{id:Ae("col"),modules:[{id:Ae("text"),type:"text",text:"Welcome to Magic Card"}]}]}]}}setConfig(e){if(!e)throw new Error("No configuration provided");this._config={...e,rows:e.rows||[]},this._config.rows=this._config.rows.map(e=>({...e,id:e.id||Ae("row"),columns:(e.columns||[]).map(e=>({...e,id:e.id||Ae("col"),modules:(e.modules||[]).map(e=>({...e,id:e.id||Ae(e.type)}))}))}))}getCardSize(){return this._config?.rows?Math.max(this._config.rows.length,1):1}render(){if(!this._config)return V`<ha-card><div class="mc-error">No configuration</div></ha-card>`;const e=this._buildCardStyle();return V`
      <ha-card>
        <div class="mc-card-content" style=${e}>
          ${this._config.rows.map(e=>this._renderRow(e))}
        </div>
      </ha-card>
    `}_buildCardStyle(){const e=[],t=this._config;return t.padding&&e.push(`padding: ${t.padding}`),t.background&&e.push(`background: ${t.background}`),t.border_radius&&e.push(`border-radius: ${t.border_radius}`),t.box_shadow&&e.push(`box-shadow: ${t.box_shadow}`),t.card_height&&e.push(`min-height: ${t.card_height}`),t.overflow&&e.push(`overflow: ${t.overflow}`),e.join("; ")}_renderRow(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return V``;var t;const i=`grid-template-columns: ${(t=e.layout||"1")?{1:"1fr","1-1":"1fr 1fr","1-2":"1fr 2fr","2-1":"2fr 1fr","1-1-1":"1fr 1fr 1fr","1-2-1":"1fr 2fr 1fr"}[t]||t:"1fr"}; gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,r=_e(e.design);return V`
      <div class="mc-row" style="${i}; ${r}">
        ${e.columns.map(e=>this._renderColumn(e))}
      </div>
    `}_renderColumn(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return V``;const t=`gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,i=_e(e.design);return V`
      <div
        class="mc-column"
        data-valign=${e.vertical_align||Q}
        style="${t}; ${i}"
      >
        ${e.modules.map(e=>this._renderModule(e))}
      </div>
    `}_renderModule(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return V``;const t=xe.get(e.type);if(!t)return V`<div class="mc-error">Unknown module: ${e.type}</div>`;const i=_e(e.design),r=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return V`
      <div
        class="mc-module-wrapper ${r?"mc-hoverable":""}"
        style=${i}
        @click=${r?t=>this._handleAction(t,e,"tap"):Q}
        @contextmenu=${r?t=>this._handleAction(t,e,"hold"):Q}
        @dblclick=${r?t=>this._handleAction(t,e,"double_tap"):Q}
      >
        ${t.renderPreview(e,this.hass)}
      </div>
    `}_evaluateDisplay(e){if(!e.conditions?.length)return!0;if(!this.hass)return!0;const t=e.conditions.map(e=>{switch(e.type){case"state":{if(!e.entity)return!0;const t=this.hass.states[e.entity];return!!t&&(void 0!==e.state&&""!==e.state?t.state===e.state:void 0!==e.state_not&&""!==e.state_not?t.state!==e.state_not:!(void 0!==e.above&&Number(t.state)<=e.above)&&!(void 0!==e.below&&Number(t.state)>=e.below))}case"attribute":{if(!e.entity||!e.attribute)return!0;const t=this.hass.states[e.entity];if(!t)return!1;const i=String(t.attributes[e.attribute]??"");return void 0!==e.state&&""!==e.state?i===e.state:void 0===e.state_not||""===e.state_not||i!==e.state_not}case"time":{const t=new Date,i=60*t.getHours()+t.getMinutes();if(e.after){const[t,r]=e.after.split(":").map(Number);if(i<60*t+r)return!1}if(e.before){const[t,r]=e.before.split(":").map(Number);if(i>=60*t+r)return!1}return!0}default:return!0}});return"any"===e.mode?t.some(Boolean):t.every(Boolean)}_handleAction(e,t,i){"hold"===i&&e.preventDefault();const r=`${i}_action`,n=t.actions?.[r];if(!n||"none"===n.action)return;const o=t.entity;switch(n.action){case"more-info":if(o||n.entity){const e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:n.entity||o}});this.dispatchEvent(e)}break;case"toggle":if(o||n.entity){const e=n.entity||o,t=e.split(".")[0];this.hass?.callService(t,"toggle",{entity_id:e})}break;case"navigate":if(n.navigation_path){history.pushState(null,"",n.navigation_path);const e=new Event("location-changed",{bubbles:!0,composed:!0});window.dispatchEvent(e)}break;case"url":n.url_path&&window.open(n.url_path,"_blank");break;case"perform-action":if(n.service){const[e,t]=n.service.split(".");this.hass?.callService(e,t,{...n.data,...n.service_data})}break;case"assist":this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}}}))}}};Se.styles=ye,ke([be({attribute:!1})],Se.prototype,"hass",void 0),ke([ve()],Se.prototype,"_config",void 0),Se=ke([me(e)],Se);const Ce=c`
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
`;function Me(e){if(null===e||"object"!=typeof e)return e;if(Array.isArray(e))return e.map(e=>Me(e));const t={};for(const i of Object.keys(e))t[i]=Me(e[i]);return t}class Te{constructor(e=50){this.undoStack=[],this.redoStack=[],this.limit=e}push(e){this.undoStack.push(Me(e)),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack=[]}undo(e){return 0===this.undoStack.length?null:(this.redoStack.push(Me(e)),this.undoStack.pop())}redo(e){return 0===this.redoStack.length?null:(this.undoStack.push(Me(e)),this.redoStack.pop())}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}clear(){this.undoStack=[],this.redoStack=[]}get undoCount(){return this.undoStack.length}get redoCount(){return this.redoStack.length}}class Ee{constructor(e){this.fireEvent=e,this.undoRedo=new Te,this.listeners=new Set,this.state={config:{type:"custom:magic-card",rows:[]},selectedPath:null,activeTab:"general",editorMode:"form",isDirty:!1},this.dispatchConfigChanged=function(e,t){let i=null;const r=function(...r){null!==i&&clearTimeout(i),i=setTimeout(()=>{e.apply(this,r),i=null},t)};return r.cancel=()=>{null!==i&&(clearTimeout(i),i=null)},r}(e=>{this.fireEvent(e)},200)}subscribe(e){return this.listeners.add(e),e(this.state),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return this.state}getConfig(){return this.state.config}getSelectedModule(){const e=this.state.selectedPath;return void 0===e?.rowIndex||void 0===e?.columnIndex||void 0===e?.moduleIndex?null:this.state.config.rows[e.rowIndex]?.columns[e.columnIndex]?.modules[e.moduleIndex]??null}setConfig(e){this.state={...this.state,config:Me(e),isDirty:!1},this.notify()}updateConfig(e,t=!0){t&&this.undoRedo.push(this.state.config),this.state={...this.state,config:Me(e),isDirty:!0},this.notify(),this.dispatchConfigChanged(this.state.config)}setEditorMode(e){this.state={...this.state,editorMode:e},this.notify()}setSelectedPath(e){this.state={...this.state,selectedPath:e},this.notify()}setActiveTab(e){this.state={...this.state,activeTab:e},this.notify()}addRow(e="1"){const t=Me(this.state.config),i=e.split("-").length,r=Array.from({length:i},()=>({id:Ae("col"),modules:[]}));t.rows.push({id:Ae("row"),layout:e,columns:r}),this.updateConfig(t)}deleteRow(e){const t=Me(this.state.config);t.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(t)}moveRow(e,t){if(e===t)return;const i=Me(this.state.config),[r]=i.rows.splice(e,1);i.rows.splice(t,0,r),this.updateConfig(i)}updateRow(e,t){const i=Me(this.state.config);i.rows[e]={...i.rows[e],...t},this.updateConfig(i)}addColumn(e){const t=Me(this.state.config);t.rows[e].columns.push({id:Ae("col"),modules:[]}),this.updateConfig(t)}deleteColumn(e,t){const i=Me(this.state.config);i.rows[e].columns.splice(t,1),0===i.rows[e].columns.length&&i.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(i)}addModule(e,t,i){const r=Me(this.state.config),n=xe.createDefault(i);if(!n)return;r.rows[e].columns[t].modules.push(n);const o=r.rows[e].columns[t].modules.length-1;this.updateConfig(r),this.setSelectedPath({rowIndex:e,columnIndex:t,moduleIndex:o})}deleteModule(e,t,i){const r=Me(this.state.config);r.rows[e].columns[t].modules.splice(i,1),this.state.selectedPath=null,this.updateConfig(r)}updateModule(e,t,i,r){const n=Me(this.state.config),o=n.rows[e].columns[t].modules[i];n.rows[e].columns[t].modules[i]={...o,...r},this.updateConfig(n)}moveModule(e,t,i,r,n,o){const a=Me(this.state.config),[s]=a.rows[e].columns[t].modules.splice(i,1);a.rows[r].columns[n].modules.splice(o,0,s),this.updateConfig(a),this.setSelectedPath({rowIndex:r,columnIndex:n,moduleIndex:o})}undo(){const e=this.undoRedo.undo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}redo(){const e=this.undoRedo.redo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}canUndo(){return this.undoRedo.canUndo()}canRedo(){return this.undoRedo.canRedo()}destroy(){this.dispatchConfigChanged.cancel(),this.listeners.clear(),this.undoRedo.clear()}}const Ie=c`
  :host {
    display: block;
  }

  .mc-form {
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
    flex: 1;
  }

  .mc-row-body {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  /* Column */
  .mc-col-item {
    border: 1px dashed var(--divider-color, #e5e7eb);
    border-radius: 6px;
    padding: 8px;
  }

  .mc-col-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--secondary-text-color, #6b7280);
    margin-bottom: 6px;
  }

  .mc-col-header .mc-label {
    flex: 1;
  }

  /* Module item */
  .mc-module-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 0.8125rem;
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
  }

  .mc-module-item-type {
    font-size: 0.6875rem;
    color: var(--secondary-text-color, #6b7280);
    background: var(--divider-color, #e5e7eb);
    padding: 2px 6px;
    border-radius: 4px;
  }

  .mc-add-module-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px;
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
  }
`;function Oe(e,t,i){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="text"
        .value=${t||""}
        @input=${e=>i(e.target.value)}
      />
    </div>
  `}function ze(e,t,i,r){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="number"
        .value=${String(t??"")}
        min=${r?.min??Q}
        max=${r?.max??Q}
        step=${r?.step??Q}
        @input=${e=>i(Number(e.target.value))}
      />
    </div>
  `}function je(e,t,i,r){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <select @change=${e=>r(e.target.value)}>
        ${i.map(e=>V`<option value=${e.value} ?selected=${t===e.value}>
              ${e.label}
            </option>`)}
      </select>
    </div>
  `}function Pe(e,t,i){return V`
    <div class="mc-field mc-field-toggle">
      <label class="mc-field-label">${e}</label>
      <input
        type="checkbox"
        .checked=${t??!1}
        @change=${e=>i(e.target.checked)}
      />
    </div>
  `}function Ne(e,t,i){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="text"
        .value=${t||""}
        placeholder="entity_id"
        @input=${e=>i(e.target.value)}
      />
    </div>
  `}var De=function(e,t,i,r){var n,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let Re=class extends ue{constructor(){super(...arguments),this._expandedSections=new Set(["card"])}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){if(!this._editorState)return V``;const{config:e,selectedPath:t}=this._editorState;return V`
      <div class="mc-form">
        ${this._renderCardSection(e)}
        ${e.rows.map((e,i)=>this._renderRow(e,i,t))}
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
                ${Oe("Background",e.background,t=>this.stateManager.updateConfig({...e,background:t}))}
                ${Oe("Border Radius",e.border_radius,t=>this.stateManager.updateConfig({...e,border_radius:t}))}
                ${Oe("Padding",e.padding,t=>this.stateManager.updateConfig({...e,padding:t}))}
                ${Oe("Box Shadow",e.box_shadow,t=>this.stateManager.updateConfig({...e,box_shadow:t}))}
                ${Oe("Card Height",e.card_height,t=>this.stateManager.updateConfig({...e,card_height:t}))}
              </div>
            `:Q}
      </div>
    `}_renderRow(e,t,i){return V`
      <div class="mc-row-item">
        <div class="mc-row-header">
          <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          <span class="mc-label">Row ${t+1}</span>
          ${je("",e.layout,[{label:"1 Col",value:"1"},{label:"1-1",value:"1-1"},{label:"1-2",value:"1-2"},{label:"2-1",value:"2-1"},{label:"1-1-1",value:"1-1-1"}],e=>this.stateManager.updateRow(t,{layout:e}))}
          <button
            class="mc-btn-icon"
            @click=${()=>this.stateManager.deleteRow(t)}
            title="Delete row"
          >
            &times;
          </button>
        </div>
        <div class="mc-row-body">
          ${e.columns.map((e,r)=>this._renderColumn(e,t,r,i))}
        </div>
      </div>
    `}_renderColumn(e,t,i,r){return V`
      <div class="mc-col-item">
        <div class="mc-col-header">
          <span class="mc-label">Column ${i+1}</span>
        </div>
        ${e.modules.map((e,n)=>{const o=r?.rowIndex===t&&r?.columnIndex===i&&r?.moduleIndex===n,a=xe.get(e.type);return V`
            <div
              class="mc-module-item ${o?"selected":""}"
              @click=${()=>this.stateManager.setSelectedPath({rowIndex:t,columnIndex:i,moduleIndex:n})}
            >
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
                class="mc-btn-icon"
                @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,i,n)}}
              >
                &times;
              </button>
            </div>
          `})}
        <button
          class="mc-add-module-btn"
          @click=${()=>this.dispatchEvent(new CustomEvent("add-module",{bubbles:!0,composed:!0,detail:{rowIndex:t,colIndex:i}}))}
        >
          + Add Module
        </button>
      </div>
    `}_toggleSection(e){this._expandedSections.has(e)?this._expandedSections.delete(e):this._expandedSections.add(e),this.requestUpdate()}};function Le(e){return null==e}Re.styles=[Ce,Ie],De([be({attribute:!1})],Re.prototype,"stateManager",void 0),De([be({attribute:!1})],Re.prototype,"hass",void 0),De([ve()],Re.prototype,"_editorState",void 0),De([ve()],Re.prototype,"_expandedSections",void 0),Re=De([me("mc-form-editor")],Re);var Ue={isNothing:Le,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:Le(e)?[]:[e]},repeat:function(e,t){var i,r="";for(i=0;i<t;i+=1)r+=e;return r},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:function(e,t){var i,r,n,o;if(t)for(i=0,r=(o=Object.keys(t)).length;i<r;i+=1)e[n=o[i]]=t[n];return e}};function Fe(e,t){var i="",r=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(i+='in "'+e.mark.name+'" '),i+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(i+="\n\n"+e.mark.snippet),r+" "+i):r}function He(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=Fe(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}He.prototype=Object.create(Error.prototype),He.prototype.constructor=He,He.prototype.toString=function(e){return this.name+": "+Fe(this,e)};var Be=He;function qe(e,t,i,r,n){var o="",a="",s=Math.floor(n/2)-1;return r-t>s&&(t=r-s+(o=" ... ").length),i-r>s&&(i=r+s-(a=" ...").length),{str:o+e.slice(t,i).replace(/\t/g,"→")+a,pos:r-t+o.length}}function Ge(e,t){return Ue.repeat(" ",t-e.length)+e}var Ye=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var i,r=/\r?\n|\r|\0/g,n=[0],o=[],a=-1;i=r.exec(e.buffer);)o.push(i.index),n.push(i.index+i[0].length),e.position<=i.index&&a<0&&(a=n.length-2);a<0&&(a=n.length-1);var s,c,l="",d=Math.min(e.line+t.linesAfter,o.length).toString().length,p=t.maxLength-(t.indent+d+3);for(s=1;s<=t.linesBefore&&!(a-s<0);s++)c=qe(e.buffer,n[a-s],o[a-s],e.position-(n[a]-n[a-s]),p),l=Ue.repeat(" ",t.indent)+Ge((e.line-s+1).toString(),d)+" | "+c.str+"\n"+l;for(c=qe(e.buffer,n[a],o[a],e.position,p),l+=Ue.repeat(" ",t.indent)+Ge((e.line+1).toString(),d)+" | "+c.str+"\n",l+=Ue.repeat("-",t.indent+d+3+c.pos)+"^\n",s=1;s<=t.linesAfter&&!(a+s>=o.length);s++)c=qe(e.buffer,n[a+s],o[a+s],e.position-(n[a]-n[a+s]),p),l+=Ue.repeat(" ",t.indent)+Ge((e.line+s+1).toString(),d)+" | "+c.str+"\n";return l.replace(/\n$/,"")},We=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],Ve=["scalar","sequence","mapping"];var Ke=function(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===We.indexOf(t))throw new Be('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=function(e){var t={};return null!==e&&Object.keys(e).forEach(function(i){e[i].forEach(function(e){t[String(e)]=i})}),t}(t.styleAliases||null),-1===Ve.indexOf(this.kind))throw new Be('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')};function Qe(e,t){var i=[];return e[t].forEach(function(e){var t=i.length;i.forEach(function(i,r){i.tag===e.tag&&i.kind===e.kind&&i.multi===e.multi&&(t=r)}),i[t]=e}),i}function Ze(e){return this.extend(e)}Ze.prototype.extend=function(e){var t=[],i=[];if(e instanceof Ke)i.push(e);else if(Array.isArray(e))i=i.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new Be("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(i=i.concat(e.explicit))}t.forEach(function(e){if(!(e instanceof Ke))throw new Be("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new Be("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new Be("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(e){if(!(e instanceof Ke))throw new Be("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var r=Object.create(Ze.prototype);return r.implicit=(this.implicit||[]).concat(t),r.explicit=(this.explicit||[]).concat(i),r.compiledImplicit=Qe(r,"implicit"),r.compiledExplicit=Qe(r,"explicit"),r.compiledTypeMap=function(){var e,t,i={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function r(e){e.multi?(i.multi[e.kind].push(e),i.multi.fallback.push(e)):i[e.kind][e.tag]=i.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(r);return i}(r.compiledImplicit,r.compiledExplicit),r};var Je=Ze,Xe=new Ke("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),et=new Ke("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),tt=new Ke("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),it=new Je({explicit:[Xe,et,tt]});var rt=new Ke("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});var nt=new Ke("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function ot(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function at(e){return 48<=e&&e<=55}function st(e){return 48<=e&&e<=57}var ct=new Ke("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,i=e.length,r=0,n=!1;if(!i)return!1;if("-"!==(t=e[r])&&"+"!==t||(t=e[++r]),"0"===t){if(r+1===i)return!0;if("b"===(t=e[++r])){for(r++;r<i;r++)if("_"!==(t=e[r])){if("0"!==t&&"1"!==t)return!1;n=!0}return n&&"_"!==t}if("x"===t){for(r++;r<i;r++)if("_"!==(t=e[r])){if(!ot(e.charCodeAt(r)))return!1;n=!0}return n&&"_"!==t}if("o"===t){for(r++;r<i;r++)if("_"!==(t=e[r])){if(!at(e.charCodeAt(r)))return!1;n=!0}return n&&"_"!==t}}if("_"===t)return!1;for(;r<i;r++)if("_"!==(t=e[r])){if(!st(e.charCodeAt(r)))return!1;n=!0}return!(!n||"_"===t)},construct:function(e){var t,i=e,r=1;if(-1!==i.indexOf("_")&&(i=i.replace(/_/g,"")),"-"!==(t=i[0])&&"+"!==t||("-"===t&&(r=-1),t=(i=i.slice(1))[0]),"0"===i)return 0;if("0"===t){if("b"===i[1])return r*parseInt(i.slice(2),2);if("x"===i[1])return r*parseInt(i.slice(2),16);if("o"===i[1])return r*parseInt(i.slice(2),8)}return r*parseInt(i,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!Ue.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),lt=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var dt=/^[-+]?[0-9]+e/;var pt=new Ke("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!lt.test(e)||"_"===e[e.length-1])},construct:function(e){var t,i;return i="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:i*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||Ue.isNegativeZero(e))},represent:function(e,t){var i;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(Ue.isNegativeZero(e))return"-0.0";return i=e.toString(10),dt.test(i)?i.replace("e",".e"):i},defaultStyle:"lowercase"}),ut=it.extend({implicit:[rt,nt,ct,pt]}),ht=ut,mt=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),ft=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");var gt=new Ke("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==mt.exec(e)||null!==ft.exec(e))},construct:function(e){var t,i,r,n,o,a,s,c,l=0,d=null;if(null===(t=mt.exec(e))&&(t=ft.exec(e)),null===t)throw new Error("Date resolve error");if(i=+t[1],r=+t[2]-1,n=+t[3],!t[4])return new Date(Date.UTC(i,r,n));if(o=+t[4],a=+t[5],s=+t[6],t[7]){for(l=t[7].slice(0,3);l.length<3;)l+="0";l=+l}return t[9]&&(d=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(d=-d)),c=new Date(Date.UTC(i,r,n,o,a,s,l)),d&&c.setTime(c.getTime()-d),c},instanceOf:Date,represent:function(e){return e.toISOString()}});var bt=new Ke("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),vt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";var yt=new Ke("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,i,r=0,n=e.length,o=vt;for(i=0;i<n;i++)if(!((t=o.indexOf(e.charAt(i)))>64)){if(t<0)return!1;r+=6}return r%8==0},construct:function(e){var t,i,r=e.replace(/[\r\n=]/g,""),n=r.length,o=vt,a=0,s=[];for(t=0;t<n;t++)t%4==0&&t&&(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)),a=a<<6|o.indexOf(r.charAt(t));return 0===(i=n%4*6)?(s.push(a>>16&255),s.push(a>>8&255),s.push(255&a)):18===i?(s.push(a>>10&255),s.push(a>>2&255)):12===i&&s.push(a>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,i,r="",n=0,o=e.length,a=vt;for(t=0;t<o;t++)t%3==0&&t&&(r+=a[n>>18&63],r+=a[n>>12&63],r+=a[n>>6&63],r+=a[63&n]),n=(n<<8)+e[t];return 0===(i=o%3)?(r+=a[n>>18&63],r+=a[n>>12&63],r+=a[n>>6&63],r+=a[63&n]):2===i?(r+=a[n>>10&63],r+=a[n>>4&63],r+=a[n<<2&63],r+=a[64]):1===i&&(r+=a[n>>2&63],r+=a[n<<4&63],r+=a[64],r+=a[64]),r}}),xt=Object.prototype.hasOwnProperty,wt=Object.prototype.toString;var _t=new Ke("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,i,r,n,o,a=[],s=e;for(t=0,i=s.length;t<i;t+=1){if(r=s[t],o=!1,"[object Object]"!==wt.call(r))return!1;for(n in r)if(xt.call(r,n)){if(o)return!1;o=!0}if(!o)return!1;if(-1!==a.indexOf(n))return!1;a.push(n)}return!0},construct:function(e){return null!==e?e:[]}}),$t=Object.prototype.toString;var At=new Ke("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,i,r,n,o,a=e;for(o=new Array(a.length),t=0,i=a.length;t<i;t+=1){if(r=a[t],"[object Object]"!==$t.call(r))return!1;if(1!==(n=Object.keys(r)).length)return!1;o[t]=[n[0],r[n[0]]]}return!0},construct:function(e){if(null===e)return[];var t,i,r,n,o,a=e;for(o=new Array(a.length),t=0,i=a.length;t<i;t+=1)r=a[t],n=Object.keys(r),o[t]=[n[0],r[n[0]]];return o}}),kt=Object.prototype.hasOwnProperty;var St=new Ke("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,i=e;for(t in i)if(kt.call(i,t)&&null!==i[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),Ct=ht.extend({implicit:[gt,bt],explicit:[yt,_t,At,St]}),Mt=Object.prototype.hasOwnProperty,Tt=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Et=/[\x85\u2028\u2029]/,It=/[,\[\]\{\}]/,Ot=/^(?:!|!!|![a-z\-]+!)$/i,zt=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function jt(e){return Object.prototype.toString.call(e)}function Pt(e){return 10===e||13===e}function Nt(e){return 9===e||32===e}function Dt(e){return 9===e||32===e||10===e||13===e}function Rt(e){return 44===e||91===e||93===e||123===e||125===e}function Lt(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function Ut(e){return 120===e?2:117===e?4:85===e?8:0}function Ft(e){return 48<=e&&e<=57?e-48:-1}function Ht(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function Bt(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function qt(e,t,i){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:i}):e[t]=i}for(var Gt=new Array(256),Yt=new Array(256),Wt=0;Wt<256;Wt++)Gt[Wt]=Ht(Wt)?1:0,Yt[Wt]=Ht(Wt);function Vt(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||Ct,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function Kt(e,t){var i={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return i.snippet=Ye(i),new Be(t,i)}function Qt(e,t){throw Kt(e,t)}function Zt(e,t){e.onWarning&&e.onWarning.call(null,Kt(e,t))}var Jt={YAML:function(e,t,i){var r,n,o;null!==e.version&&Qt(e,"duplication of %YAML directive"),1!==i.length&&Qt(e,"YAML directive accepts exactly one argument"),null===(r=/^([0-9]+)\.([0-9]+)$/.exec(i[0]))&&Qt(e,"ill-formed argument of the YAML directive"),n=parseInt(r[1],10),o=parseInt(r[2],10),1!==n&&Qt(e,"unacceptable YAML version of the document"),e.version=i[0],e.checkLineBreaks=o<2,1!==o&&2!==o&&Zt(e,"unsupported YAML version of the document")},TAG:function(e,t,i){var r,n;2!==i.length&&Qt(e,"TAG directive accepts exactly two arguments"),r=i[0],n=i[1],Ot.test(r)||Qt(e,"ill-formed tag handle (first argument) of the TAG directive"),Mt.call(e.tagMap,r)&&Qt(e,'there is a previously declared suffix for "'+r+'" tag handle'),zt.test(n)||Qt(e,"ill-formed tag prefix (second argument) of the TAG directive");try{n=decodeURIComponent(n)}catch(t){Qt(e,"tag prefix is malformed: "+n)}e.tagMap[r]=n}};function Xt(e,t,i,r){var n,o,a,s;if(t<i){if(s=e.input.slice(t,i),r)for(n=0,o=s.length;n<o;n+=1)9===(a=s.charCodeAt(n))||32<=a&&a<=1114111||Qt(e,"expected valid JSON character");else Tt.test(s)&&Qt(e,"the stream contains non-printable characters");e.result+=s}}function ei(e,t,i,r){var n,o,a,s;for(Ue.isObject(i)||Qt(e,"cannot merge mappings; the provided source object is unacceptable"),a=0,s=(n=Object.keys(i)).length;a<s;a+=1)o=n[a],Mt.call(t,o)||(qt(t,o,i[o]),r[o]=!0)}function ti(e,t,i,r,n,o,a,s,c){var l,d;if(Array.isArray(n))for(l=0,d=(n=Array.prototype.slice.call(n)).length;l<d;l+=1)Array.isArray(n[l])&&Qt(e,"nested arrays are not supported inside keys"),"object"==typeof n&&"[object Object]"===jt(n[l])&&(n[l]="[object Object]");if("object"==typeof n&&"[object Object]"===jt(n)&&(n="[object Object]"),n=String(n),null===t&&(t={}),"tag:yaml.org,2002:merge"===r)if(Array.isArray(o))for(l=0,d=o.length;l<d;l+=1)ei(e,t,o[l],i);else ei(e,t,o,i);else e.json||Mt.call(i,n)||!Mt.call(t,n)||(e.line=a||e.line,e.lineStart=s||e.lineStart,e.position=c||e.position,Qt(e,"duplicated mapping key")),qt(t,n,o),delete i[n];return t}function ii(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):Qt(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function ri(e,t,i){for(var r=0,n=e.input.charCodeAt(e.position);0!==n;){for(;Nt(n);)9===n&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),n=e.input.charCodeAt(++e.position);if(t&&35===n)do{n=e.input.charCodeAt(++e.position)}while(10!==n&&13!==n&&0!==n);if(!Pt(n))break;for(ii(e),n=e.input.charCodeAt(e.position),r++,e.lineIndent=0;32===n;)e.lineIndent++,n=e.input.charCodeAt(++e.position)}return-1!==i&&0!==r&&e.lineIndent<i&&Zt(e,"deficient indentation"),r}function ni(e){var t,i=e.position;return!(45!==(t=e.input.charCodeAt(i))&&46!==t||t!==e.input.charCodeAt(i+1)||t!==e.input.charCodeAt(i+2)||(i+=3,0!==(t=e.input.charCodeAt(i))&&!Dt(t)))}function oi(e,t){1===t?e.result+=" ":t>1&&(e.result+=Ue.repeat("\n",t-1))}function ai(e,t){var i,r,n=e.tag,o=e.anchor,a=[],s=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),r=e.input.charCodeAt(e.position);0!==r&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,Qt(e,"tab characters must not be used in indentation")),45===r)&&Dt(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,ri(e,!0,-1)&&e.lineIndent<=t)a.push(null),r=e.input.charCodeAt(e.position);else if(i=e.line,li(e,t,3,!1,!0),a.push(e.result),ri(e,!0,-1),r=e.input.charCodeAt(e.position),(e.line===i||e.lineIndent>t)&&0!==r)Qt(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=n,e.anchor=o,e.kind="sequence",e.result=a,!0)}function si(e){var t,i,r,n,o=!1,a=!1;if(33!==(n=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&Qt(e,"duplication of a tag property"),60===(n=e.input.charCodeAt(++e.position))?(o=!0,n=e.input.charCodeAt(++e.position)):33===n?(a=!0,i="!!",n=e.input.charCodeAt(++e.position)):i="!",t=e.position,o){do{n=e.input.charCodeAt(++e.position)}while(0!==n&&62!==n);e.position<e.length?(r=e.input.slice(t,e.position),n=e.input.charCodeAt(++e.position)):Qt(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==n&&!Dt(n);)33===n&&(a?Qt(e,"tag suffix cannot contain exclamation marks"):(i=e.input.slice(t-1,e.position+1),Ot.test(i)||Qt(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),n=e.input.charCodeAt(++e.position);r=e.input.slice(t,e.position),It.test(r)&&Qt(e,"tag suffix cannot contain flow indicator characters")}r&&!zt.test(r)&&Qt(e,"tag name cannot contain such characters: "+r);try{r=decodeURIComponent(r)}catch(t){Qt(e,"tag name is malformed: "+r)}return o?e.tag=r:Mt.call(e.tagMap,i)?e.tag=e.tagMap[i]+r:"!"===i?e.tag="!"+r:"!!"===i?e.tag="tag:yaml.org,2002:"+r:Qt(e,'undeclared tag handle "'+i+'"'),!0}function ci(e){var t,i;if(38!==(i=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&Qt(e,"duplication of an anchor property"),i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!Dt(i)&&!Rt(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&Qt(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function li(e,t,i,r,n){var o,a,s,c,l,d,p,u,h,m=1,f=!1,g=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,o=a=s=4===i||3===i,r&&ri(e,!0,-1)&&(f=!0,e.lineIndent>t?m=1:e.lineIndent===t?m=0:e.lineIndent<t&&(m=-1)),1===m)for(;si(e)||ci(e);)ri(e,!0,-1)?(f=!0,s=o,e.lineIndent>t?m=1:e.lineIndent===t?m=0:e.lineIndent<t&&(m=-1)):s=!1;if(s&&(s=f||n),1!==m&&4!==i||(u=1===i||2===i?t:t+1,h=e.position-e.lineStart,1===m?s&&(ai(e,h)||function(e,t,i){var r,n,o,a,s,c,l,d=e.tag,p=e.anchor,u={},h=Object.create(null),m=null,f=null,g=null,b=!1,v=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=u),l=e.input.charCodeAt(e.position);0!==l;){if(b||-1===e.firstTabInLine||(e.position=e.firstTabInLine,Qt(e,"tab characters must not be used in indentation")),r=e.input.charCodeAt(e.position+1),o=e.line,63!==l&&58!==l||!Dt(r)){if(a=e.line,s=e.lineStart,c=e.position,!li(e,i,2,!1,!0))break;if(e.line===o){for(l=e.input.charCodeAt(e.position);Nt(l);)l=e.input.charCodeAt(++e.position);if(58===l)Dt(l=e.input.charCodeAt(++e.position))||Qt(e,"a whitespace character is expected after the key-value separator within a block mapping"),b&&(ti(e,u,h,m,f,null,a,s,c),m=f=g=null),v=!0,b=!1,n=!1,m=e.tag,f=e.result;else{if(!v)return e.tag=d,e.anchor=p,!0;Qt(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!v)return e.tag=d,e.anchor=p,!0;Qt(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===l?(b&&(ti(e,u,h,m,f,null,a,s,c),m=f=g=null),v=!0,b=!0,n=!0):b?(b=!1,n=!0):Qt(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,l=r;if((e.line===o||e.lineIndent>t)&&(b&&(a=e.line,s=e.lineStart,c=e.position),li(e,t,4,!0,n)&&(b?f=e.result:g=e.result),b||(ti(e,u,h,m,f,g,a,s,c),m=f=g=null),ri(e,!0,-1),l=e.input.charCodeAt(e.position)),(e.line===o||e.lineIndent>t)&&0!==l)Qt(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return b&&ti(e,u,h,m,f,null,a,s,c),v&&(e.tag=d,e.anchor=p,e.kind="mapping",e.result=u),v}(e,h,u))||function(e,t){var i,r,n,o,a,s,c,l,d,p,u,h,m=!0,f=e.tag,g=e.anchor,b=Object.create(null);if(91===(h=e.input.charCodeAt(e.position)))a=93,l=!1,o=[];else{if(123!==h)return!1;a=125,l=!0,o={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=o),h=e.input.charCodeAt(++e.position);0!==h;){if(ri(e,!0,t),(h=e.input.charCodeAt(e.position))===a)return e.position++,e.tag=f,e.anchor=g,e.kind=l?"mapping":"sequence",e.result=o,!0;m?44===h&&Qt(e,"expected the node content, but found ','"):Qt(e,"missed comma between flow collection entries"),u=null,s=c=!1,63===h&&Dt(e.input.charCodeAt(e.position+1))&&(s=c=!0,e.position++,ri(e,!0,t)),i=e.line,r=e.lineStart,n=e.position,li(e,t,1,!1,!0),p=e.tag,d=e.result,ri(e,!0,t),h=e.input.charCodeAt(e.position),!c&&e.line!==i||58!==h||(s=!0,h=e.input.charCodeAt(++e.position),ri(e,!0,t),li(e,t,1,!1,!0),u=e.result),l?ti(e,o,b,p,d,u,i,r,n):s?o.push(ti(e,null,b,p,d,u,i,r,n)):o.push(d),ri(e,!0,t),44===(h=e.input.charCodeAt(e.position))?(m=!0,h=e.input.charCodeAt(++e.position)):m=!1}Qt(e,"unexpected end of the stream within a flow collection")}(e,u)?g=!0:(a&&function(e,t){var i,r,n,o,a=1,s=!1,c=!1,l=t,d=0,p=!1;if(124===(o=e.input.charCodeAt(e.position)))r=!1;else{if(62!==o)return!1;r=!0}for(e.kind="scalar",e.result="";0!==o;)if(43===(o=e.input.charCodeAt(++e.position))||45===o)1===a?a=43===o?3:2:Qt(e,"repeat of a chomping mode identifier");else{if(!((n=Ft(o))>=0))break;0===n?Qt(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):c?Qt(e,"repeat of an indentation width identifier"):(l=t+n-1,c=!0)}if(Nt(o)){do{o=e.input.charCodeAt(++e.position)}while(Nt(o));if(35===o)do{o=e.input.charCodeAt(++e.position)}while(!Pt(o)&&0!==o)}for(;0!==o;){for(ii(e),e.lineIndent=0,o=e.input.charCodeAt(e.position);(!c||e.lineIndent<l)&&32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position);if(!c&&e.lineIndent>l&&(l=e.lineIndent),Pt(o))d++;else{if(e.lineIndent<l){3===a?e.result+=Ue.repeat("\n",s?1+d:d):1===a&&s&&(e.result+="\n");break}for(r?Nt(o)?(p=!0,e.result+=Ue.repeat("\n",s?1+d:d)):p?(p=!1,e.result+=Ue.repeat("\n",d+1)):0===d?s&&(e.result+=" "):e.result+=Ue.repeat("\n",d):e.result+=Ue.repeat("\n",s?1+d:d),s=!0,c=!0,d=0,i=e.position;!Pt(o)&&0!==o;)o=e.input.charCodeAt(++e.position);Xt(e,i,e.position,!1)}}return!0}(e,u)||function(e,t){var i,r,n;if(39!==(i=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,r=n=e.position;0!==(i=e.input.charCodeAt(e.position));)if(39===i){if(Xt(e,r,e.position,!0),39!==(i=e.input.charCodeAt(++e.position)))return!0;r=e.position,e.position++,n=e.position}else Pt(i)?(Xt(e,r,n,!0),oi(e,ri(e,!1,t)),r=n=e.position):e.position===e.lineStart&&ni(e)?Qt(e,"unexpected end of the document within a single quoted scalar"):(e.position++,n=e.position);Qt(e,"unexpected end of the stream within a single quoted scalar")}(e,u)||function(e,t){var i,r,n,o,a,s;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return Xt(e,i,e.position,!0),e.position++,!0;if(92===s){if(Xt(e,i,e.position,!0),Pt(s=e.input.charCodeAt(++e.position)))ri(e,!1,t);else if(s<256&&Gt[s])e.result+=Yt[s],e.position++;else if((a=Ut(s))>0){for(n=a,o=0;n>0;n--)(a=Lt(s=e.input.charCodeAt(++e.position)))>=0?o=(o<<4)+a:Qt(e,"expected hexadecimal character");e.result+=Bt(o),e.position++}else Qt(e,"unknown escape sequence");i=r=e.position}else Pt(s)?(Xt(e,i,r,!0),oi(e,ri(e,!1,t)),i=r=e.position):e.position===e.lineStart&&ni(e)?Qt(e,"unexpected end of the document within a double quoted scalar"):(e.position++,r=e.position)}Qt(e,"unexpected end of the stream within a double quoted scalar")}(e,u)?g=!0:!function(e){var t,i,r;if(42!==(r=e.input.charCodeAt(e.position)))return!1;for(r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!Dt(r)&&!Rt(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&Qt(e,"name of an alias node must contain at least one character"),i=e.input.slice(t,e.position),Mt.call(e.anchorMap,i)||Qt(e,'unidentified alias "'+i+'"'),e.result=e.anchorMap[i],ri(e,!0,-1),!0}(e)?function(e,t,i){var r,n,o,a,s,c,l,d,p=e.kind,u=e.result;if(Dt(d=e.input.charCodeAt(e.position))||Rt(d)||35===d||38===d||42===d||33===d||124===d||62===d||39===d||34===d||37===d||64===d||96===d)return!1;if((63===d||45===d)&&(Dt(r=e.input.charCodeAt(e.position+1))||i&&Rt(r)))return!1;for(e.kind="scalar",e.result="",n=o=e.position,a=!1;0!==d;){if(58===d){if(Dt(r=e.input.charCodeAt(e.position+1))||i&&Rt(r))break}else if(35===d){if(Dt(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&ni(e)||i&&Rt(d))break;if(Pt(d)){if(s=e.line,c=e.lineStart,l=e.lineIndent,ri(e,!1,-1),e.lineIndent>=t){a=!0,d=e.input.charCodeAt(e.position);continue}e.position=o,e.line=s,e.lineStart=c,e.lineIndent=l;break}}a&&(Xt(e,n,o,!1),oi(e,e.line-s),n=o=e.position,a=!1),Nt(d)||(o=e.position+1),d=e.input.charCodeAt(++e.position)}return Xt(e,n,o,!1),!!e.result||(e.kind=p,e.result=u,!1)}(e,u,1===i)&&(g=!0,null===e.tag&&(e.tag="?")):(g=!0,null===e.tag&&null===e.anchor||Qt(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===m&&(g=s&&ai(e,h))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&Qt(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),c=0,l=e.implicitTypes.length;c<l;c+=1)if((p=e.implicitTypes[c]).resolve(e.result)){e.result=p.construct(e.result),e.tag=p.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(Mt.call(e.typeMap[e.kind||"fallback"],e.tag))p=e.typeMap[e.kind||"fallback"][e.tag];else for(p=null,c=0,l=(d=e.typeMap.multi[e.kind||"fallback"]).length;c<l;c+=1)if(e.tag.slice(0,d[c].tag.length)===d[c].tag){p=d[c];break}p||Qt(e,"unknown tag !<"+e.tag+">"),null!==e.result&&p.kind!==e.kind&&Qt(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+p.kind+'", not "'+e.kind+'"'),p.resolve(e.result,e.tag)?(e.result=p.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):Qt(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||g}function di(e){var t,i,r,n,o=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(n=e.input.charCodeAt(e.position))&&(ri(e,!0,-1),n=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==n));){for(a=!0,n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!Dt(n);)n=e.input.charCodeAt(++e.position);for(r=[],(i=e.input.slice(t,e.position)).length<1&&Qt(e,"directive name must not be less than one character in length");0!==n;){for(;Nt(n);)n=e.input.charCodeAt(++e.position);if(35===n){do{n=e.input.charCodeAt(++e.position)}while(0!==n&&!Pt(n));break}if(Pt(n))break;for(t=e.position;0!==n&&!Dt(n);)n=e.input.charCodeAt(++e.position);r.push(e.input.slice(t,e.position))}0!==n&&ii(e),Mt.call(Jt,i)?Jt[i](e,i,r):Zt(e,'unknown document directive "'+i+'"')}ri(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,ri(e,!0,-1)):a&&Qt(e,"directives end mark is expected"),li(e,e.lineIndent-1,4,!1,!0),ri(e,!0,-1),e.checkLineBreaks&&Et.test(e.input.slice(o,e.position))&&Zt(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&ni(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,ri(e,!0,-1)):e.position<e.length-1&&Qt(e,"end of the stream or a document separator is expected")}function pi(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var i=new Vt(e,t),r=e.indexOf("\0");for(-1!==r&&(i.position=r,Qt(i,"null byte is not allowed in input")),i.input+="\0";32===i.input.charCodeAt(i.position);)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)di(i);return i.documents}var ui={loadAll:function(e,t,i){null!==t&&"object"==typeof t&&void 0===i&&(i=t,t=null);var r=pi(e,i);if("function"!=typeof t)return r;for(var n=0,o=r.length;n<o;n+=1)t(r[n])},load:function(e,t){var i=pi(e,t);if(0!==i.length){if(1===i.length)return i[0];throw new Be("expected a single document in the stream, but found more")}}},hi=Object.prototype.toString,mi=Object.prototype.hasOwnProperty,fi=65279,gi={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},bi=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],vi=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function yi(e){var t,i,r;if(t=e.toString(16).toUpperCase(),e<=255)i="x",r=2;else if(e<=65535)i="u",r=4;else{if(!(e<=4294967295))throw new Be("code point within a string may not be greater than 0xFFFFFFFF");i="U",r=8}return"\\"+i+Ue.repeat("0",r-t.length)+t}function xi(e){this.schema=e.schema||Ct,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=Ue.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var i,r,n,o,a,s,c;if(null===t)return{};for(i={},n=0,o=(r=Object.keys(t)).length;n<o;n+=1)a=r[n],s=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(c=e.compiledTypeMap.fallback[a])&&mi.call(c.styleAliases,s)&&(s=c.styleAliases[s]),i[a]=s;return i}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function wi(e,t){for(var i,r=Ue.repeat(" ",t),n=0,o=-1,a="",s=e.length;n<s;)-1===(o=e.indexOf("\n",n))?(i=e.slice(n),n=s):(i=e.slice(n,o+1),n=o+1),i.length&&"\n"!==i&&(a+=r),a+=i;return a}function _i(e,t){return"\n"+Ue.repeat(" ",e.indent*t)}function $i(e){return 32===e||9===e}function Ai(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&e!==fi||65536<=e&&e<=1114111}function ki(e){return Ai(e)&&e!==fi&&13!==e&&10!==e}function Si(e,t,i){var r=ki(e),n=r&&!$i(e);return(i?r:r&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!n)||ki(t)&&!$i(t)&&35===e||58===t&&n}function Ci(e,t){var i,r=e.charCodeAt(t);return r>=55296&&r<=56319&&t+1<e.length&&(i=e.charCodeAt(t+1))>=56320&&i<=57343?1024*(r-55296)+i-56320+65536:r}function Mi(e){return/^\n* /.test(e)}function Ti(e,t,i,r,n,o,a,s){var c,l=0,d=null,p=!1,u=!1,h=-1!==r,m=-1,f=function(e){return Ai(e)&&e!==fi&&!$i(e)&&45!==e&&63!==e&&58!==e&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e&&35!==e&&38!==e&&42!==e&&33!==e&&124!==e&&61!==e&&62!==e&&39!==e&&34!==e&&37!==e&&64!==e&&96!==e}(Ci(e,0))&&function(e){return!$i(e)&&58!==e}(Ci(e,e.length-1));if(t||a)for(c=0;c<e.length;l>=65536?c+=2:c++){if(!Ai(l=Ci(e,c)))return 5;f=f&&Si(l,d,s),d=l}else{for(c=0;c<e.length;l>=65536?c+=2:c++){if(10===(l=Ci(e,c)))p=!0,h&&(u=u||c-m-1>r&&" "!==e[m+1],m=c);else if(!Ai(l))return 5;f=f&&Si(l,d,s),d=l}u=u||h&&c-m-1>r&&" "!==e[m+1]}return p||u?i>9&&Mi(e)?5:a?2===o?5:2:u?4:3:!f||a||n(e)?2===o?5:2:1}function Ei(e,t,i,r,n){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==bi.indexOf(t)||vi.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var o=e.indent*Math.max(1,i),a=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-o),s=r||e.flowLevel>-1&&i>=e.flowLevel;switch(Ti(t,s,e.indent,a,function(t){return function(e,t){var i,r;for(i=0,r=e.implicitTypes.length;i<r;i+=1)if(e.implicitTypes[i].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!r,n)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+Ii(t,e.indent)+Oi(wi(t,o));case 4:return">"+Ii(t,e.indent)+Oi(wi(function(e,t){var i,r,n=/(\n+)([^\n]*)/g,o=(s=e.indexOf("\n"),s=-1!==s?s:e.length,n.lastIndex=s,zi(e.slice(0,s),t)),a="\n"===e[0]||" "===e[0];var s;for(;r=n.exec(e);){var c=r[1],l=r[2];i=" "===l[0],o+=c+(a||i||""===l?"":"\n")+zi(l,t),a=i}return o}(t,a),o));case 5:return'"'+function(e){for(var t,i="",r=0,n=0;n<e.length;r>=65536?n+=2:n++)r=Ci(e,n),!(t=gi[r])&&Ai(r)?(i+=e[n],r>=65536&&(i+=e[n+1])):i+=t||yi(r);return i}(t)+'"';default:throw new Be("impossible error: invalid scalar style")}}()}function Ii(e,t){var i=Mi(e)?String(t):"",r="\n"===e[e.length-1];return i+(r&&("\n"===e[e.length-2]||"\n"===e)?"+":r?"":"-")+"\n"}function Oi(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function zi(e,t){if(""===e||" "===e[0])return e;for(var i,r,n=/ [^ ]/g,o=0,a=0,s=0,c="";i=n.exec(e);)(s=i.index)-o>t&&(r=a>o?a:s,c+="\n"+e.slice(o,r),o=r+1),a=s;return c+="\n",e.length-o>t&&a>o?c+=e.slice(o,a)+"\n"+e.slice(a+1):c+=e.slice(o),c.slice(1)}function ji(e,t,i,r){var n,o,a,s="",c=e.tag;for(n=0,o=i.length;n<o;n+=1)a=i[n],e.replacer&&(a=e.replacer.call(i,String(n),a)),(Ni(e,t+1,a,!0,!0,!1,!0)||void 0===a&&Ni(e,t+1,null,!0,!0,!1,!0))&&(r&&""===s||(s+=_i(e,t)),e.dump&&10===e.dump.charCodeAt(0)?s+="-":s+="- ",s+=e.dump);e.tag=c,e.dump=s||"[]"}function Pi(e,t,i){var r,n,o,a,s,c;for(o=0,a=(n=i?e.explicitTypes:e.implicitTypes).length;o<a;o+=1)if(((s=n[o]).instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(i?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag="?",s.represent){if(c=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===hi.call(s.represent))r=s.represent(t,c);else{if(!mi.call(s.represent,c))throw new Be("!<"+s.tag+'> tag resolver accepts not "'+c+'" style');r=s.represent[c](t,c)}e.dump=r}return!0}return!1}function Ni(e,t,i,r,n,o,a){e.tag=null,e.dump=i,Pi(e,i,!1)||Pi(e,i,!0);var s,c=hi.call(e.dump),l=r;r&&(r=e.flowLevel<0||e.flowLevel>t);var d,p,u="[object Object]"===c||"[object Array]"===c;if(u&&(p=-1!==(d=e.duplicates.indexOf(i))),(null!==e.tag&&"?"!==e.tag||p||2!==e.indent&&t>0)&&(n=!1),p&&e.usedDuplicates[d])e.dump="*ref_"+d;else{if(u&&p&&!e.usedDuplicates[d]&&(e.usedDuplicates[d]=!0),"[object Object]"===c)r&&0!==Object.keys(e.dump).length?(!function(e,t,i,r){var n,o,a,s,c,l,d="",p=e.tag,u=Object.keys(i);if(!0===e.sortKeys)u.sort();else if("function"==typeof e.sortKeys)u.sort(e.sortKeys);else if(e.sortKeys)throw new Be("sortKeys must be a boolean or a function");for(n=0,o=u.length;n<o;n+=1)l="",r&&""===d||(l+=_i(e,t)),s=i[a=u[n]],e.replacer&&(s=e.replacer.call(i,a,s)),Ni(e,t+1,a,!0,!0,!0)&&((c=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?l+="?":l+="? "),l+=e.dump,c&&(l+=_i(e,t)),Ni(e,t+1,s,!0,c)&&(e.dump&&10===e.dump.charCodeAt(0)?l+=":":l+=": ",d+=l+=e.dump));e.tag=p,e.dump=d||"{}"}(e,t,e.dump,n),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,i){var r,n,o,a,s,c="",l=e.tag,d=Object.keys(i);for(r=0,n=d.length;r<n;r+=1)s="",""!==c&&(s+=", "),e.condenseFlow&&(s+='"'),a=i[o=d[r]],e.replacer&&(a=e.replacer.call(i,o,a)),Ni(e,t,o,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),Ni(e,t,a,!1,!1)&&(c+=s+=e.dump));e.tag=l,e.dump="{"+c+"}"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else if("[object Array]"===c)r&&0!==e.dump.length?(e.noArrayIndent&&!a&&t>0?ji(e,t-1,e.dump,n):ji(e,t,e.dump,n),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,i){var r,n,o,a="",s=e.tag;for(r=0,n=i.length;r<n;r+=1)o=i[r],e.replacer&&(o=e.replacer.call(i,String(r),o)),(Ni(e,t,o,!1,!1)||void 0===o&&Ni(e,t,null,!1,!1))&&(""!==a&&(a+=","+(e.condenseFlow?"":" ")),a+=e.dump);e.tag=s,e.dump="["+a+"]"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else{if("[object String]"!==c){if("[object Undefined]"===c)return!1;if(e.skipInvalid)return!1;throw new Be("unacceptable kind of an object to dump "+c)}"?"!==e.tag&&Ei(e,e.dump,t,o,l)}null!==e.tag&&"?"!==e.tag&&(s=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),s="!"===e.tag[0]?"!"+s:"tag:yaml.org,2002:"===s.slice(0,18)?"!!"+s.slice(18):"!<"+s+">",e.dump=s+" "+e.dump)}return!0}function Di(e,t){var i,r,n=[],o=[];for(Ri(e,n,o),i=0,r=o.length;i<r;i+=1)t.duplicates.push(n[o[i]]);t.usedDuplicates=new Array(r)}function Ri(e,t,i){var r,n,o;if(null!==e&&"object"==typeof e)if(-1!==(n=t.indexOf(e)))-1===i.indexOf(n)&&i.push(n);else if(t.push(e),Array.isArray(e))for(n=0,o=e.length;n<o;n+=1)Ri(e[n],t,i);else for(n=0,o=(r=Object.keys(e)).length;n<o;n+=1)Ri(e[r[n]],t,i)}function Li(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var Ui={Type:Ke,Schema:Je,FAILSAFE_SCHEMA:it,JSON_SCHEMA:ut,CORE_SCHEMA:ht,DEFAULT_SCHEMA:Ct,load:ui.load,loadAll:ui.loadAll,dump:{dump:function(e,t){var i=new xi(t=t||{});i.noRefs||Di(e,i);var r=e;return i.replacer&&(r=i.replacer.call({"":r},"",r)),Ni(i,0,r,!0,!0)?i.dump+"\n":""}}.dump,YAMLException:Be,types:{binary:yt,float:pt,map:tt,null:rt,pairs:At,set:St,timestamp:gt,bool:nt,int:ct,merge:bt,omap:_t,seq:et,str:Xe},safeLoad:Li("safeLoad","load"),safeLoadAll:Li("safeLoadAll","loadAll"),safeDump:Li("safeDump","dump")};class Fi{constructor(){this.suppressSync=!1}toYaml(e){const{type:t,...i}=e;return function(e){try{return Ui.dump(e,{indent:2,lineWidth:120,noRefs:!0,sortKeys:!1})}catch{return""}}(i)}fromYaml(e,t){const i=function(e){try{return Ui.load(e)}catch{return null}}(e);return i?{...i,type:t.type}:null}isSuppressed(){return this.suppressSync}suppress(e){this.suppressSync=!0;try{e()}finally{this.suppressSync=!1}}}const Hi=c`
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
`;var Bi=function(e,t,i,r){var n,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let qi=class extends ue{constructor(){super(...arguments),this._yaml="",this._error="",this._configSync=new Fi,this._suppressUpdate=!1}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e,this._suppressUpdate||(this._yaml=this._configSync.toYaml(e.config),this._error="")}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){return V`
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

        ${this._error?V`<div class="mc-yaml-error">${this._error}</div>`:Q}
      </div>
    `}_onYamlInput(e){const t=e.target.value;this._yaml=t,this._suppressUpdate=!0;try{const e=this._configSync.fromYaml(t,this._editorState.config);e?(this._error="",this.stateManager.updateConfig(e)):this._error="Invalid YAML structure"}catch(e){this._error=e instanceof Error?e.message:"Parse error"}finally{this._suppressUpdate=!1}}};qi.styles=[Ce,Hi],Bi([be({attribute:!1})],qi.prototype,"stateManager",void 0),Bi([be({attribute:!1})],qi.prototype,"hass",void 0),Bi([ve()],qi.prototype,"_yaml",void 0),Bi([ve()],qi.prototype,"_error",void 0),Bi([ve()],qi.prototype,"_editorState",void 0),qi=Bi([me("mc-yaml-editor")],qi);const Gi=c`
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
`;var Yi=function(e,t,i,r){var n,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let Wi=class extends ue{constructor(){super(...arguments),this._expandedNodes=new Set(["root"])}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){if(!this._editorState)return V``;const{config:e,selectedPath:t}=this._editorState;return e.rows.length?V`
      <div class="mc-tree">
        ${e.rows.map((e,i)=>this._renderRowNode(e,i,t))}
      </div>
    `:V`<div class="mc-tree-empty">No rows. Add a row to get started.</div>`}_renderRowNode(e,t,i){const r=`row-${t}`,n=this._expandedNodes.has(r);return V`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${()=>this._toggleNode(r)}>
          <span class="mc-tree-toggle ${n?"open":""}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Row ${t+1}</span>
          <span class="mc-tree-type">${e.layout||"1"}</span>
          ${e.display?.conditions?.length?V`<span class="mc-tree-badge condition">C</span>`:Q}
          <span class="mc-tree-actions">
            <button class="mc-tree-action-btn" @click=${e=>{e.stopPropagation(),this.stateManager.deleteRow(t)}} title="Delete">&times;</button>
          </span>
        </div>
        ${n?V`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.columns.map((e,r)=>this._renderColumnNode(e,t,r,i))}
              </div>
            `:Q}
      </div>
    `}_renderColumnNode(e,t,i,r){const n=`col-${t}-${i}`,o=this._expandedNodes.has(n);return V`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${()=>this._toggleNode(n)}>
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
        ${o?V`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.modules.map((e,n)=>this._renderModuleNode(e,t,i,n,r))}
                ${0===e.modules.length?V`<div style="padding:4px 8px;font-size:0.75rem;color:var(--secondary-text-color)">Empty</div>`:Q}
              </div>
            `:Q}
      </div>
    `}_renderModuleNode(e,t,i,r,n){const o=n?.rowIndex===t&&n?.columnIndex===i&&n?.moduleIndex===r,a=xe.get(e.type),s=e.display?.conditions?.length,c=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return V`
      <div class="mc-tree-node">
        <div
          class="mc-tree-row ${o?"selected":""}"
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
          ${s?V`<span class="mc-tree-badge condition">C</span>`:Q}
          ${c?V`<span class="mc-tree-badge action">A</span>`:Q}
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,i,r)}}
              title="Delete"
            >&times;</button>
          </span>
        </div>
      </div>
    `}_toggleNode(e){this._expandedNodes.has(e)?this._expandedNodes.delete(e):this._expandedNodes.add(e),this.requestUpdate()}_onDragStart(e,t,i,r){this._dragData={ri:t,ci:i,mi:r},e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify({ri:t,ci:i,mi:r})))}_onDragOver(e){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_onDrop(e,t,i,r){if(e.preventDefault(),!this._dragData)return;const{ri:n,ci:o,mi:a}=this._dragData;n===t&&o===i&&a===r||(this.stateManager.moveModule(n,o,a,t,i,r),this._dragData=void 0)}};Wi.styles=[Ce,Gi],Yi([be({attribute:!1})],Wi.prototype,"stateManager",void 0),Yi([be({attribute:!1})],Wi.prototype,"hass",void 0),Yi([ve()],Wi.prototype,"_editorState",void 0),Yi([ve()],Wi.prototype,"_expandedNodes",void 0),Wi=Yi([me("mc-tree-editor")],Wi);var Vi=function(e,t,i,r){var n,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let Ki=class extends ue{render(){if(!this.module||!this.onChange)return V`<p>No module selected</p>`;const e=xe.get(this.module.type);return e?e.renderGeneralTab(this.module,this.hass,this.onChange):V`<p>Unknown module type: ${this.module.type}</p>`}};Ki.styles=Ce,Vi([be({attribute:!1})],Ki.prototype,"module",void 0),Vi([be({attribute:!1})],Ki.prototype,"hass",void 0),Vi([be({attribute:!1})],Ki.prototype,"onChange",void 0),Ki=Vi([me("mc-general-tab")],Ki);var Qi=function(e,t,i,r){var n,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let Zi=class extends ue{render(){if(!this.module||!this.onChange)return V`<p>No module selected</p>`;const e=xe.get(this.module.type);return e?.renderActionsTab?e.renderActionsTab(this.module,this.hass,this.onChange):V`<p>No actions available for this module</p>`}};Zi.styles=Ce,Qi([be({attribute:!1})],Zi.prototype,"module",void 0),Qi([be({attribute:!1})],Zi.prototype,"hass",void 0),Qi([be({attribute:!1})],Zi.prototype,"onChange",void 0),Zi=Qi([me("mc-actions-tab")],Zi);var Ji=function(e,t,i,r){var n,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let Xi=class extends ue{render(){if(!this.module||!this.onChange)return V`<p>No module selected</p>`;const e=xe.get(this.module.type);return e?.renderLogicTab?e.renderLogicTab(this.module,this.hass,this.onChange):V`<p>No logic options for this module</p>`}};Xi.styles=Ce,Ji([be({attribute:!1})],Xi.prototype,"module",void 0),Ji([be({attribute:!1})],Xi.prototype,"hass",void 0),Ji([be({attribute:!1})],Xi.prototype,"onChange",void 0),Xi=Ji([me("mc-logic-tab")],Xi);var er=function(e,t,i,r){var n,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let tr=class extends ue{render(){if(!this.module||!this.onChange)return V`<p>No module selected</p>`;const e=xe.get(this.module.type);return e?.renderDesignTab?e.renderDesignTab(this.module,this.hass,this.onChange):V`<p>No design options for this module</p>`}};tr.styles=Ce,er([be({attribute:!1})],tr.prototype,"module",void 0),er([be({attribute:!1})],tr.prototype,"hass",void 0),er([be({attribute:!1})],tr.prototype,"onChange",void 0),tr=er([me("mc-design-tab")],tr);const ir=c`
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
`;var rr=function(e,t,i,r){var n,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let nr=class extends ue{constructor(){super(...arguments),this._searchQuery=""}render(){const e=this._searchQuery?xe.search(this._searchQuery):xe.getAll(),t=new Map;for(const r of i){const i=e.filter(e=>e.metadata.category===r).map(e=>e.metadata);i.length>0&&t.set(r,i)}return V`
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
    `}_onSelect(e){this.dispatchEvent(new CustomEvent("module-selected",{bubbles:!0,composed:!0,detail:{type:e.type}}))}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_onOverlayClick(){this._onClose()}};nr.styles=ir,rr([ve()],nr.prototype,"_searchQuery",void 0),nr=rr([me("mc-module-selector")],nr);var or=function(e,t,i,r){var n,o=arguments.length,a=o<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(n=e[s])&&(a=(o<3?n(a):o>3?n(t,i,a):n(t,i))||a);return o>3&&a&&Object.defineProperty(t,i,a),a};let ar=class extends ue{constructor(){super(...arguments),this._showModuleSelector=!1,this._onAddModule=e=>{this._moduleSelectorTarget=e.detail,this._showModuleSelector=!0},this._onModuleSelected=e=>{this._moduleSelectorTarget&&this._stateManager.addModule(this._moduleSelectorTarget.rowIndex,this._moduleSelectorTarget.colIndex,e.detail.type),this._showModuleSelector=!1,this._moduleSelectorTarget=void 0}}connectedCallback(){super.connectedCallback(),this._stateManager=new Ee(e=>{this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:e}}))}),this._unsubscribe=this._stateManager.subscribe(e=>{this._editorState=e})}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._stateManager?.destroy()}setConfig(e){this._stateManager&&this._stateManager.setConfig(e)}render(){if(!this._editorState)return V`<div class="mc-editor">Loading...</div>`;const{editorMode:e,selectedPath:t}=this._editorState,i=this._stateManager.getSelectedModule();return V`
      <div class="mc-editor">
        ${this._renderModeSwitcher(e)}
        ${this._renderToolbar()}
        ${this._renderEditorMode(e)}
        ${i?this._renderSettingsPanel(i):Q}
        ${this._showModuleSelector?this._renderModuleSelectorDialog():Q}
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
          + Row
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
        `}}_renderSettingsPanel(e){const t=xe.get(e.type);if(!t)return V``;const i=t.getAvailableTabs(),{activeTab:r,selectedPath:n}=this._editorState,o=i.includes(r)?r:i[0];return V`
      <div class="mc-settings-panel">
        <div class="mc-settings-header">
          <ha-icon icon=${t.metadata.icon} style="--mdc-icon-size:18px"></ha-icon>
          ${t.metadata.name}
          <span class="mc-toolbar-spacer"></span>
          <button class="mc-btn-icon" @click=${()=>this._stateManager.setSelectedPath(null)}>
            &times;
          </button>
        </div>

        <div class="mc-settings-tabs">
          ${i.map(e=>V`
              <button
                class="mc-settings-tab ${o===e?"active":""}"
                @click=${()=>this._stateManager.setActiveTab(e)}
              >
                ${e.charAt(0).toUpperCase()+e.slice(1)}
              </button>
            `)}
        </div>

        <div class="mc-settings-content">
          ${this._renderTabContent(o,e,t,e=>{void 0!==n?.rowIndex&&void 0!==n?.columnIndex&&void 0!==n?.moduleIndex&&this._stateManager.updateModule(n.rowIndex,n.columnIndex,n.moduleIndex,e)})}
        </div>
      </div>
    `}_renderTabContent(e,t,i,r){switch(e){case"general":return i.renderGeneralTab(t,this.hass,r);case"actions":return i.renderActionsTab?i.renderActionsTab(t,this.hass,r):V`<p>No actions available</p>`;case"logic":return i.renderLogicTab?i.renderLogicTab(t,this.hass,r):V`<p>No logic available</p>`;case"design":return i.renderDesignTab?i.renderDesignTab(t,this.hass,r):V`<p>No design options</p>`}}_renderModuleSelectorDialog(){return V`
      <mc-module-selector
        @module-selected=${this._onModuleSelected}
        @close=${()=>{this._showModuleSelector=!1}}
      ></mc-module-selector>
    `}};ar.styles=Ce,or([be({attribute:!1})],ar.prototype,"hass",void 0),or([be({attribute:!1})],ar.prototype,"lovelace",void 0),or([ve()],ar.prototype,"_editorState",void 0),or([ve()],ar.prototype,"_showModuleSelector",void 0),or([ve()],ar.prototype,"_moduleSelectorTarget",void 0),ar=or([me(t)],ar);class sr{getAvailableTabs(){return["general","actions","logic","design"]}validate(e){return[]}renderActionsTab(e,t,i){const r=e.actions,n=(t,n)=>{i({...e,actions:{...r,[t]:n}})};return V`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Tap Action</div>
          ${this._renderActionConfig(r?.tap_action,e=>n("tap_action",e))}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Hold Action</div>
          ${this._renderActionConfig(r?.hold_action,e=>n("hold_action",e))}
        </div>
        <div class="mc-section">
          <div class="mc-section-header">Double Tap Action</div>
          ${this._renderActionConfig(r?.double_tap_action,e=>n("double_tap_action",e))}
        </div>
      </div>
    `}renderLogicTab(e,t,i){const r=e.display,n=r?.conditions||[],o=t=>{i({...e,display:{...r,...t}})},a=(e,t)=>{o({conditions:n.map(i=>i.id===e?{...i,...t}:i)})};return V`
      <div class="mc-tab-content">
        ${je("Condition Mode",r?.mode||"every",[{label:"All conditions (AND)",value:"every"},{label:"Any condition (OR)",value:"any"}],e=>o({mode:e}))}

        <div class="mc-conditions-list">
          ${n.map(e=>V`
              <div class="mc-condition-item">
                ${je("Type",e.type,[{label:"State",value:"state"},{label:"Attribute",value:"attribute"},{label:"Time",value:"time"},{label:"Template",value:"template"}],t=>a(e.id,{type:t}))}
                ${"state"===e.type||"attribute"===e.type?V`
                      ${Ne("Entity",e.entity,t=>a(e.id,{entity:t}))}
                      ${"attribute"===e.type?Oe("Attribute",e.attribute,t=>a(e.id,{attribute:t})):Q}
                      ${Oe("State equals",e.state,t=>a(e.id,{state:t}))}
                      ${Oe("State not equals",e.state_not,t=>a(e.id,{state_not:t}))}
                    `:Q}
                ${"time"===e.type?V`
                      ${Oe("After (HH:MM)",e.after,t=>a(e.id,{after:t}))}
                      ${Oe("Before (HH:MM)",e.before,t=>a(e.id,{before:t}))}
                    `:Q}
                ${"template"===e.type?V`
                      <div class="mc-field">
                        <label class="mc-field-label">Template</label>
                        <textarea
                          .value=${e.template||""}
                          @input=${t=>a(e.id,{template:t.target.value})}
                          rows="3"
                        ></textarea>
                      </div>
                    `:Q}
                <button class="mc-btn-icon" @click=${()=>{return t=e.id,void o({conditions:n.filter(e=>e.id!==t)});var t}}>
                  &times;
                </button>
              </div>
            `)}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${()=>{const e={id:Ae("cond"),type:"state",entity:"",state:""};o({conditions:[...n,e]})}}>Add Condition</button>
      </div>
    `}renderDesignTab(e,t,i){const r=e.design||{},n=t=>{i({...e,design:{...r,...t}})};return V`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Typography</div>
          ${Oe("Font Size",r.font_size,e=>n({font_size:e}))}
          ${je("Font Weight",r.font_weight,[{label:"Normal",value:"normal"},{label:"Bold",value:"bold"},{label:"Light",value:"300"},{label:"Medium",value:"500"},{label:"Semibold",value:"600"}],e=>n({font_weight:e}))}
          ${je("Text Align",r.text_align,[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"}],e=>n({text_align:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Colors</div>
          ${Oe("Color",r.color,e=>n({color:e}))}
          ${Oe("Background",r.background,e=>n({background:e}))}
          ${Oe("Opacity",r.opacity,e=>n({opacity:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Spacing</div>
          ${Oe("Padding",r.padding,e=>n({padding:e}))}
          ${Oe("Margin",r.margin,e=>n({margin:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Borders</div>
          ${Oe("Border",r.border,e=>n({border:e}))}
          ${Oe("Border Radius",r.border_radius,e=>n({border_radius:e}))}
          ${Oe("Box Shadow",r.box_shadow,e=>n({box_shadow:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Size</div>
          ${Oe("Width",r.width,e=>n({width:e}))}
          ${Oe("Height",r.height,e=>n({height:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Custom CSS</div>
          <div class="mc-field">
            <label class="mc-field-label">CSS</label>
            <textarea
              .value=${r.css||""}
              @input=${e=>n({css:e.target.value})}
              rows="4"
              placeholder="color: red; font-size: 20px;"
            ></textarea>
          </div>
        </div>
      </div>
    `}_renderActionConfig(e,t){const i=e||{action:"none"};return V`
      <div class="mc-action-config">
        ${je("Action",i.action,[{label:"None",value:"none"},{label:"More Info",value:"more-info"},{label:"Toggle",value:"toggle"},{label:"Navigate",value:"navigate"},{label:"URL",value:"url"},{label:"Perform Action",value:"perform-action"},{label:"Assist",value:"assist"}],e=>t({...i,action:e}))}
        ${"navigate"===i.action?Oe("Navigation Path",i.navigation_path,e=>t({...i,navigation_path:e})):Q}
        ${"url"===i.action?Oe("URL",i.url_path,e=>t({...i,url_path:e})):Q}
        ${"perform-action"===i.action?V`
              ${Oe("Service",i.service,e=>t({...i,service:e}))}
            `:Q}
      </div>
    `}}xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"text",name:"Text",description:"Display static or template text",category:"content",icon:"mdi:format-text"}}createDefault(){return{id:Ae("text"),type:"text",text:"Hello World"}}renderPreview(e,t){return V`<div class="mc-module mc-text">${e.text||""}</div>`}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Text",r.text,e=>i({...r,text:e}))}
        ${Pe("Use Template",r.use_template,e=>i({...r,use_template:e}))}
        ${r.use_template?V`
              <div class="mc-field-hint">Use Jinja2 templates: {{ states('sensor.temp') }}</div>
            `:V``}
      </div>
    `}validate(e){const t=[],i=e;return i.text||i.use_template||t.push("Text content is required"),t}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"icon",name:"Icon",description:"Display an icon from MDI or entity",category:"content",icon:"mdi:emoticon-outline"}}createDefault(){return{id:Ae("icon"),type:"icon",icon:"mdi:home",size:"24px"}}renderPreview(e,t){const i=e;let r=i.icon||"mdi:help";if(i.use_entity_icon&&i.entity&&t){const e=t.states[i.entity];e?.attributes.icon&&(r=e.attributes.icon)}return V`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${i.size||"24px"}; color: ${i.icon_color||"inherit"}">
        <ha-icon .icon=${r}></ha-icon>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${Pe("Use Entity Icon",r.use_entity_icon,e=>i({...r,use_entity_icon:e}))}
        ${r.use_entity_icon?Q:Oe("Icon",r.icon,e=>i({...r,icon:e}))}
        ${Oe("Size",r.size,e=>i({...r,size:e}))}
        ${Oe("Color",r.icon_color,e=>i({...r,icon_color:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"info",name:"Info",description:"Display entity name, state, and attributes",category:"content",icon:"mdi:information-outline"}}createDefault(){return{id:Ae("info"),type:"info",show_name:!0,show_state:!0,show_unit:!0}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,n=r?.attributes.friendly_name||i.entity||"No entity",o=r?t.formatEntityState(r):"—";return V`
      <div class="mc-module mc-info">
        ${i.show_name?V`<span class="mc-info-name">${n}</span>`:Q}
        ${i.show_state?V`<span class="mc-info-state">
              ${i.prefix||""}${i.attribute&&r?String(r.attributes[i.attribute]??"—"):o}${i.suffix||""}
            </span>`:Q}
        ${i.secondary_info&&r?V`<span class="mc-info-secondary"
              >${String(r.attributes[i.secondary_info]??"")}</span
            >`:Q}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${Oe("Attribute",r.attribute,e=>i({...r,attribute:e}))}
        ${Pe("Show Name",r.show_name,e=>i({...r,show_name:e}))}
        ${Pe("Show State",r.show_state,e=>i({...r,show_state:e}))}
        ${Pe("Show Unit",r.show_unit,e=>i({...r,show_unit:e}))}
        ${Oe("Prefix",r.prefix,e=>i({...r,prefix:e}))}
        ${Oe("Suffix",r.suffix,e=>i({...r,suffix:e}))}
        ${Oe("Secondary Info (attribute)",r.secondary_info,e=>i({...r,secondary_info:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"image",name:"Image",description:"Display a static image or entity picture",category:"content",icon:"mdi:image"}}createDefault(){return{id:Ae("image"),type:"image",image:"",entity_picture:!1,aspect_ratio:"16:9",fit:"cover"}}renderPreview(e,t){const i=e;let r=i.image||"";if(i.entity_picture&&i.entity&&t){const e=t.states[i.entity];e?.attributes.entity_picture&&(r=e.attributes.entity_picture)}const n=i.fit||"cover",o=i.aspect_ratio||"16:9";return V`
      <div
        class="mc-module mc-image"
        style="aspect-ratio: ${o.replace(":","/")}; overflow: hidden;"
      >
        ${r?V`<img
              src=${r}
              style="width: 100%; height: 100%; object-fit: ${n}; display: block;"
              alt=""
            />`:V`<div
              style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--divider-color, #e0e0e0); color: var(--secondary-text-color, #888);"
            >
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${Pe("Use Entity Picture",r.entity_picture,e=>i({...r,entity_picture:e}))}
        ${r.entity_picture?Q:Oe("Image URL",r.image,e=>i({...r,image:e}))}
        ${Oe("Aspect Ratio",r.aspect_ratio,e=>i({...r,aspect_ratio:e}))}
        ${je("Fit",r.fit,[{label:"Cover",value:"cover"},{label:"Contain",value:"contain"},{label:"Fill",value:"fill"},{label:"None",value:"none"}],e=>i({...r,fit:e}))}
      </div>
    `}validate(e){const t=[],i=e;return i.image||i.entity_picture||t.push("An image URL or entity picture source is required"),i.entity_picture&&!i.entity&&t.push("Entity is required when using entity picture"),t}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"markdown",name:"Markdown",description:"Render markdown-formatted content",category:"content",icon:"mdi:language-markdown"}}createDefault(){return{id:Ae("markdown"),type:"markdown",content:"**Hello** _World_"}}renderPreview(e,t){const i=(e.content||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/__(.+?)__/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/_(.+?)_/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/\n/g,"<br>");return V`
      <div class="mc-module mc-markdown" .innerHTML=${i}></div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
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
    `}validate(e){const t=[];return e.content||t.push("Markdown content is required"),t}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"bar",name:"Bar",description:"Display a progress bar based on entity state",category:"content",icon:"mdi:chart-bar"}}createDefault(){return{id:Ae("bar"),type:"bar",min:0,max:100,bar_height:"8px",bar_color:"var(--primary-color, #03a9f4)",bar_background:"var(--divider-color, #e0e0e0)",show_value:!0,direction:"horizontal"}}renderPreview(e,t){const i=e,r=i.min??0,n=i.max??100,o=i.entity&&t?t.states[i.entity]:void 0,a=o?parseFloat(o.state):r,s=Math.min(Math.max(a,r),n),c=n!==r?(s-r)/(n-r)*100:0;let l=i.bar_color||"var(--primary-color, #03a9f4)";if(i.severity&&i.severity.length>0)for(const e of i.severity)if(s>=e.from&&s<=e.to){l=e.color;break}const d=i.bar_background||"var(--divider-color, #e0e0e0)",p=i.bar_height||"8px";return"vertical"===i.direction?V`
        <div class="mc-module mc-bar mc-bar-vertical" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
          ${i.show_value?V`<span class="mc-bar-value">${o?t.formatEntityState(o):"—"}</span>`:Q}
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
        ${i.show_value?V`<span class="mc-bar-value" style="white-space: nowrap;">${o?t.formatEntityState(o):"—"}</span>`:Q}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${ze("Min",r.min,e=>i({...r,min:e}))}
        ${ze("Max",r.max,e=>i({...r,max:e}))}
        ${Oe("Bar Height",r.bar_height,e=>i({...r,bar_height:e}))}
        ${Oe("Bar Color",r.bar_color,e=>i({...r,bar_color:e}))}
        ${Oe("Bar Background",r.bar_background,e=>i({...r,bar_background:e}))}
        ${Pe("Show Value",r.show_value,e=>i({...r,show_value:e}))}
        ${je("Direction",r.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...r,direction:e}))}
      </div>
    `}validate(e){const t=[],i=e;return i.entity||t.push("Entity is required for bar module"),void 0!==i.min&&void 0!==i.max&&i.min>=i.max&&t.push("Min must be less than max"),t}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"graphs",name:"Graph",description:"Display entity history as a line graph",category:"content",icon:"mdi:chart-line"}}createDefault(){return{id:Ae("graphs"),type:"graphs",hours_to_show:24,points_per_hour:2,line_width:2,fill:!0,show_points:!1,show_labels:!0}}renderPreview(e,t){const i=e,r=i.line_color||"var(--mc-primary)",n=i.fill_color||"var(--mc-primary)";return V`
      <div class="mc-module mc-graphs">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" style="height: 60px">
          ${i.fill?V`<path d="M0,50 Q30,30 60,35 T120,20 T200,30 L200,60 L0,60 Z"
                fill="${n}" opacity="0.15" />`:""}
          <path d="M0,50 Q30,30 60,35 T120,20 T200,30"
            fill="none" stroke="${r}" stroke-width="${i.line_width||2}" />
          ${i.show_points?V`
                <circle cx="0" cy="50" r="3" fill="${r}" />
                <circle cx="60" cy="35" r="3" fill="${r}" />
                <circle cx="120" cy="20" r="3" fill="${r}" />
                <circle cx="200" cy="30" r="3" fill="${r}" />
              `:""}
        </svg>
        ${i.show_labels?V`<div style="font-size:0.75rem; color:var(--mc-text-secondary); margin-top:4px">
              ${i.entity||"No entity"} &mdash; ${i.hours_to_show||24}h
            </div>`:""}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${ze("Hours to Show",r.hours_to_show,e=>i({...r,hours_to_show:e}),{min:1,max:168})}
        ${ze("Points per Hour",r.points_per_hour,e=>i({...r,points_per_hour:e}),{min:1,max:60})}
        ${Oe("Line Color",r.line_color,e=>i({...r,line_color:e}))}
        ${ze("Line Width",r.line_width,e=>i({...r,line_width:e}),{min:1,max:10})}
        ${Pe("Fill",r.fill,e=>i({...r,fill:e}))}
        ${Oe("Fill Color",r.fill_color,e=>i({...r,fill_color:e}))}
        ${Pe("Show Points",r.show_points,e=>i({...r,show_points:e}))}
        ${Pe("Show Labels",r.show_labels,e=>i({...r,show_labels:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"camera",name:"Camera",description:"Display a camera entity stream",category:"content",icon:"mdi:cctv"}}createDefault(){return{id:Ae("camera"),type:"camera",aspect_ratio:"16:9",show_controls:!0}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,n=r?.attributes.entity_picture,o=r?.attributes.friendly_name||i.entity||"No camera";return V`
      <div class="mc-module mc-camera" style="aspect-ratio: ${(i.aspect_ratio||"16:9").replace(":","/")}">
        ${n?V`<img src="${n}" alt="${o}" />`:V`<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--mc-border);color:var(--mc-text-secondary);font-size:0.875rem;">
              <ha-icon icon="mdi:cctv" style="margin-right:8px"></ha-icon>${o}
            </div>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Camera Entity",r.entity,e=>i({...r,entity:e}))}
        ${Oe("Aspect Ratio",r.aspect_ratio,e=>i({...r,aspect_ratio:e}))}
        ${Pe("Show Controls",r.show_controls,e=>i({...r,show_controls:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"button",name:"Button",description:"Interactive button with icon, label, and optional state display",category:"controls",icon:"mdi:gesture-tap"}}createDefault(){return{id:Ae("button"),type:"button",label:"Button",icon:"mdi:power",show_state:!1,button_style:"default"}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,n=r?t.formatEntityState(r):void 0,o=i.label||"Button",a="icon-only"===i.button_style;return V`
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
          ${i.icon?V`<ha-icon .icon=${i.icon} style="--mdc-icon-size: 20px;"></ha-icon>`:Q}
          ${a?Q:V`<span>${o}</span>`}
          ${i.show_state&&n?V`<span class="mc-button-state" style="opacity: 0.8; font-size: 12px;">${n}</span>`:Q}
        </button>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${Oe("Label",r.label,e=>i({...r,label:e}))}
        ${Oe("Icon",r.icon,e=>i({...r,icon:e}))}
        ${je("Button Style",r.button_style,[{label:"Default",value:"default"},{label:"Outline",value:"outline"},{label:"Flat",value:"flat"},{label:"Icon Only",value:"icon-only"}],e=>i({...r,button_style:e}))}
        ${Pe("Show State",r.show_state,e=>i({...r,show_state:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"slider",name:"Slider",description:"Range slider for controlling numeric values",category:"controls",icon:"mdi:tune-vertical"}}createDefault(){return{id:Ae("slider"),type:"slider",min:0,max:100,step:1,show_value:!0,direction:"horizontal"}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,n=i.min??0,o=i.max??100,a=i.step??1,s=r?i.attribute?Number(r.attributes[i.attribute]??n):Number(r.state):Math.round((n+o)/2),c="vertical"===i.direction;return V`
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
          min=${n}
          max=${o}
          step=${a}
          style="
            flex: 1;
            accent-color: ${i.slider_color||"var(--primary-color, #03a9f4)"};
            ${c?"writing-mode: vertical-lr; direction: rtl; height: 100%;":"width: 100%;"}
            ${i.track_color?`background: ${i.track_color};`:""}
          "
        />
        ${i.show_value?V`<span class="mc-slider-value" style="font-size: 14px; min-width: 36px; text-align: center;">
              ${s}
            </span>`:Q}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${Oe("Attribute",r.attribute,e=>i({...r,attribute:e}))}
        ${ze("Min",r.min,e=>i({...r,min:e}))}
        ${ze("Max",r.max,e=>i({...r,max:e}))}
        ${ze("Step",r.step,e=>i({...r,step:e}),{min:.01,step:.01})}
        ${Pe("Show Value",r.show_value,e=>i({...r,show_value:e}))}
        ${je("Direction",r.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...r,direction:e}))}
        ${Oe("Slider Color",r.slider_color,e=>i({...r,slider_color:e}))}
        ${Oe("Track Color",r.track_color,e=>i({...r,track_color:e}))}
        ${Oe("Thumb Size",r.thumb_size,e=>i({...r,thumb_size:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"spinbox",name:"Spinbox",description:"Numeric input with increment and decrement buttons",category:"controls",icon:"mdi:numeric"}}createDefault(){return{id:Ae("spinbox"),type:"spinbox",min:0,max:100,step:1}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,n=i.min??0,o=i.max??100,a=r?i.attribute?Number(r.attributes[i.attribute]??n):Number(r.state):Math.round((n+o)/2),s="\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      width: 32px;\n      height: 32px;\n      border: none;\n      border-radius: 50%;\n      background: var(--primary-color, #03a9f4);\n      color: #fff;\n      font-size: 18px;\n      font-weight: bold;\n      cursor: pointer;\n      line-height: 1;\n    ";return V`
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
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${Oe("Attribute",r.attribute,e=>i({...r,attribute:e}))}
        ${ze("Min",r.min,e=>i({...r,min:e}))}
        ${ze("Max",r.max,e=>i({...r,max:e}))}
        ${ze("Step",r.step,e=>i({...r,step:e}),{min:.01,step:.01})}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"dropdown",name:"Dropdown",description:"Select dropdown for choosing from a list of options",category:"controls",icon:"mdi:form-dropdown"}}createDefault(){return{id:Ae("dropdown"),type:"dropdown",options:[{label:"Option 1",value:"option_1"},{label:"Option 2",value:"option_2"},{label:"Option 3",value:"option_3"}]}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,n=r?i.attribute?String(r.attributes[i.attribute]??""):r.state:void 0,o=i.options||[];return V`
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
          ${o.length>0?o.map(e=>V`
                  <option value=${e.value} ?selected=${n===e.value}>
                    ${e.label}
                  </option>
                `):V`<option disabled selected>No options</option>`}
        </select>
      </div>
    `}renderGeneralTab(e,t,i){const r=e,n=r.options||[],o=(e,t,o)=>{const a=n.map((i,r)=>r===e?{...i,[t]:o}:i);i({...r,options:a})};return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${Oe("Attribute",r.attribute,e=>i({...r,attribute:e}))}

        <div class="mc-section">
          <div class="mc-section-header">Options</div>
          <div class="mc-options-list">
            ${n.map((e,t)=>V`
                <div class="mc-option-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${Oe("Label",e.label,e=>o(t,"label",e))}
                  ${Oe("Value",e.value,e=>o(t,"value",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=n.filter((t,i)=>i!==e);i({...r,options:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...n,{label:`Option ${n.length+1}`,value:`option_${n.length+1}`}];i({...r,options:e})}}>Add Option</button>
        </div>
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"light",name:"Light",description:"Light control with brightness, color temp, and color options",category:"controls",icon:"mdi:lightbulb"}}createDefault(){return{id:Ae("light"),type:"light",show_brightness:!0,show_color_temp:!1,show_color:!1,compact:!1}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,n=!!r&&"on"===r.state,o=r?.attributes.brightness,a=void 0!==o?Math.round(o/255*100):void 0,s=r?.attributes.color_temp,c=r?.attributes.friendly_name||i.entity||"Light",l=n?"var(--state-light-active-color, #fdd835)":"var(--state-icon-color, #9e9e9e)";return V`
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
          ${i.compact?V`<span style="font-weight: 500; flex: 1;">${c}</span>`:V`
                <div style="flex: 1;">
                  <div style="font-weight: 500;">${c}</div>
                  <div style="font-size: 12px; opacity: 0.7;">
                    ${n?void 0!==a?`${a}%`:"On":"Off"}
                  </div>
                </div>
              `}
        </div>

        ${i.show_brightness?V`
              <div class="mc-light-brightness" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:brightness-6"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="range"
                  min="0"
                  max="100"
                  .value=${String(a??50)}
                  style="flex: 1; accent-color: var(--state-light-active-color, #fdd835);"
                />
                ${void 0!==a?V`<span style="font-size: 12px; min-width: 32px; text-align: right;">${a}%</span>`:Q}
              </div>
            `:Q}

        ${i.show_color_temp?V`
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
            `:Q}

        ${i.show_color?V`
              <div class="mc-light-color" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:palette"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="color"
                  style="width: 32px; height: 32px; border: none; padding: 0; cursor: pointer;"
                />
              </div>
            `:Q}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${Pe("Show Brightness",r.show_brightness,e=>i({...r,show_brightness:e}))}
        ${Pe("Show Color Temp",r.show_color_temp,e=>i({...r,show_color_temp:e}))}
        ${Pe("Show Color Picker",r.show_color,e=>i({...r,show_color:e}))}
        ${Pe("Compact Mode",r.compact,e=>i({...r,compact:e}))}
      </div>
    `}validate(e){const t=[];return e.entity||t.push("Entity is required for light module"),t}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"gauge",name:"Gauge",description:"Arc gauge for displaying numeric sensor values",category:"controls",icon:"mdi:gauge"}}createDefault(){return{id:Ae("gauge"),type:"gauge",min:0,max:100,needle:!0,gauge_style:"half"}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,n=i.min??0,o=i.max??100,a=r?Number(r.state):Math.round((n+o)/2),s=Math.max(n,Math.min(o,a)),c=(s-n)/(o-n)*100,l=this._getSeverityColor(s,i.severity)||"var(--primary-color, #03a9f4)",d=("half"===i.gauge_style||i.gauge_style,"full"===i.gauge_style),p="quarter"===i.gauge_style;if(d){const e=c/100*360,t=(e-90)*(Math.PI/180),i=40,r=50,n=50+i*Math.cos(t),o=r+i*Math.sin(t);return V`
        <div class="mc-module mc-gauge mc-gauge--full" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${c>0?V`<path
                  d="M 50 10 A 40 40 0 ${e>180?1:0} 1 ${n} ${o}"
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
      `}if(p){const e=c/100*90,t=Math.PI/180*-90,i=(-90+e)*(Math.PI/180),r=44,n=10,o=90,a=n+r*Math.cos(t),d=o+r*Math.sin(t),p=n+r*Math.cos(i),u=o+r*Math.sin(i);return V`
        <div class="mc-module mc-gauge mc-gauge--quarter" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <path d="M 10 46 A 44 44 0 0 1 54 90" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${c>0?V`<path
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
      `}const u=c/100*180,h=(180+u)*(Math.PI/180),m=50+40*Math.cos(h),f=55+40*Math.sin(h);return V`
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
                d="M 10 55 A 40 40 0 ${u>180?1:0} 1 ${m} ${f}"
                fill="none"
                stroke=${l}
                stroke-width="8"
                stroke-linecap="round"
              />`:""}
          ${i.needle?V`
                <line
                  x1="50"
                  y1="55"
                  x2=${m}
                  y2=${f}
                  stroke=${l}
                  stroke-width="2"
                  stroke-linecap="round"
                />
                <circle cx="50" cy="55" r="3" fill=${l} />
              `:""}
          <text x="50" y="50" text-anchor="middle" font-size="14" font-weight="600" fill="currentColor">
            ${s}
          </text>
          <text x="10" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${n}</text>
          <text x="90" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${o}</text>
        </svg>
      </div>
    `}renderGeneralTab(e,t,i){const r=e,n=r.severity||[],o=(e,t,o)=>{const a=n.map((i,r)=>r===e?{...i,[t]:o}:i);i({...r,severity:a})};return V`
      <div class="mc-tab-content">
        ${Ne("Entity",r.entity,e=>i({...r,entity:e}))}
        ${ze("Min",r.min,e=>i({...r,min:e}))}
        ${ze("Max",r.max,e=>i({...r,max:e}))}
        ${je("Gauge Style",r.gauge_style,[{label:"Half (semicircle)",value:"half"},{label:"Full (circle)",value:"full"},{label:"Quarter",value:"quarter"}],e=>i({...r,gauge_style:e}))}
        ${Pe("Show Needle",r.needle,e=>i({...r,needle:e}))}

        <div class="mc-section">
          <div class="mc-section-header">Severity Ranges</div>
          <div class="mc-severity-list">
            ${n.map((e,t)=>V`
                <div class="mc-severity-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${ze("From",e.from,e=>o(t,"from",e))}
                  ${ze("To",e.to,e=>o(t,"to",e))}
                  ${Oe("Color",e.color,e=>o(t,"color",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=n.filter((t,i)=>i!==e);i({...r,severity:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...n,{from:0,to:100,color:"#4caf50"}];i({...r,severity:e})}}>Add Severity Range</button>
        </div>
      </div>
    `}_getSeverityColor(e,t){if(t&&0!==t.length)for(const i of t)if(e>=i.from&&e<=i.to)return i.color}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"horizontal",name:"Horizontal",description:"Arrange child modules in a row",category:"layout",icon:"mdi:arrow-split-vertical"}}createDefault(){return{id:Ae("horizontal"),type:"horizontal",modules:[],gap:"8px",align:"center",justify:"start"}}renderPreview(e,t){const i=e,r=i.modules||[];return V`
      <div class="mc-module mc-horizontal"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"center"}; justify-content:${i.justify||"start"}">
        ${r.length>0?r.map(e=>{const i=xe.get(e.type);return i?i.renderPreview(e,t):V`<span class="mc-error">?</span>`}):V`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty row</span>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Gap",r.gap,e=>i({...r,gap:e}))}
        ${je("Align",r.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>i({...r,align:e}))}
        ${je("Justify",r.justify,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Space Between",value:"space-between"},{label:"Space Around",value:"space-around"}],e=>i({...r,justify:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"vertical",name:"Vertical",description:"Arrange child modules in a column",category:"layout",icon:"mdi:arrow-split-horizontal"}}createDefault(){return{id:Ae("vertical"),type:"vertical",modules:[],gap:"8px",align:"stretch"}}renderPreview(e,t){const i=e,r=i.modules||[];return V`
      <div class="mc-module mc-vertical"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"stretch"}">
        ${r.length>0?r.map(e=>{const i=xe.get(e.type);return i?i.renderPreview(e,t):V`<span class="mc-error">?</span>`}):V`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty column</span>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Gap",r.gap,e=>i({...r,gap:e}))}
        ${je("Align",r.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>i({...r,align:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"tabs",name:"Tabs",description:"Tabbed container for groups of modules",category:"layout",icon:"mdi:tab"}}createDefault(){return{id:Ae("tabs"),type:"tabs",tabs:[{label:"Tab 1",modules:[]},{label:"Tab 2",modules:[]}],active_tab:0,tab_style:"default"}}renderPreview(e,t){const i=e,r=i.tabs||[],n=i.active_tab||0,o=r[n];return V`
      <div class="mc-module mc-tabs">
        <div class="mc-tabs-header">
          ${r.map((e,t)=>V`
              <button class="mc-tab-button ${t===n?"active":""}">
                ${e.icon?V`<ha-icon icon=${e.icon} style="--mdc-icon-size:16px"></ha-icon>`:""}
                ${e.label}
              </button>
            `)}
        </div>
        <div class="mc-tabs-content">
          ${o?.modules?.length?o.modules.map(e=>{const i=xe.get(e.type);return i?i.renderPreview(e,t):V`<span class="mc-error">?</span>`}):V`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty tab</span>`}
        </div>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${je("Tab Style",r.tab_style,[{label:"Default",value:"default"},{label:"Pills",value:"pills"},{label:"Underline",value:"underline"}],e=>i({...r,tab_style:e}))}
        <div class="mc-section">
          <div class="mc-section-header">Tabs</div>
          ${(r.tabs||[]).map((e,t)=>V`
              <div class="mc-field" style="display:flex;gap:8px;align-items:center">
                <input type="text" .value=${e.label}
                  @input=${e=>{const n=[...r.tabs||[]];n[t]={...n[t],label:e.target.value},i({...r,tabs:n})}} />
                <button class="mc-btn-icon" @click=${()=>{const e=(r.tabs||[]).filter((e,i)=>i!==t);i({...r,tabs:e})}}>&times;</button>
              </div>
            `)}
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...r.tabs||[],{label:`Tab ${(r.tabs||[]).length+1}`,modules:[]}];i({...r,tabs:e})}}>Add Tab</button>
        </div>
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"separator",name:"Separator",description:"Visual divider between modules",category:"layout",icon:"mdi:minus"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:Ae("separator"),type:"separator",separator_style:"solid",separator_color:"var(--divider-color, #e5e7eb)",separator_width:"1px",direction:"horizontal"}}renderPreview(e,t){const i=e;return"vertical"===i.direction?V`
        <div class="mc-module mc-separator-vertical"
          style="border-left-style:${i.separator_style||"solid"}; border-left-color:${i.separator_color||"var(--divider-color)"}; border-left-width:${i.separator_width||"1px"}">
        </div>
      `:V`
      <hr class="mc-module mc-separator"
        style="border-top-style:${i.separator_style||"solid"}; border-top-color:${i.separator_color||"var(--divider-color)"}; border-top-width:${i.separator_width||"1px"}" />
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${je("Direction",r.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...r,direction:e}))}
        ${je("Style",r.separator_style,[{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"None",value:"none"}],e=>i({...r,separator_style:e}))}
        ${Oe("Color",r.separator_color,e=>i({...r,separator_color:e}))}
        ${Oe("Width",r.separator_width,e=>i({...r,separator_width:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"clock",name:"Clock",description:"Display current time and date",category:"advanced",icon:"mdi:clock-outline"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:Ae("clock"),type:"clock",format_12h:!1,show_seconds:!1,show_date:!0,date_format:"short"}}renderPreview(e,t){const i=e,r=new Date,n={hour:"2-digit",minute:"2-digit",hour12:i.format_12h??!1};i.show_seconds&&(n.second="2-digit");const o=r.toLocaleTimeString(void 0,n),a=i.show_date?r.toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric"}):"";return V`
      <div class="mc-module mc-clock">
        <span class="mc-clock-time">${o}</span>
        ${i.show_date?V`<span class="mc-clock-date">${a}</span>`:Q}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Pe("12-Hour Format",r.format_12h,e=>i({...r,format_12h:e}))}
        ${Pe("Show Seconds",r.show_seconds,e=>i({...r,show_seconds:e}))}
        ${Pe("Show Date",r.show_date,e=>i({...r,show_date:e}))}
        ${Oe("Date Format",r.date_format,e=>i({...r,date_format:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"weather",name:"Weather",description:"Display weather entity information",category:"advanced",icon:"mdi:weather-partly-cloudy"}}createDefault(){return{id:Ae("weather"),type:"weather",show_temperature:!0,show_condition:!0,show_forecast:!1,forecast_days:5}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,n=r?.attributes.temperature,o=r?.state||"unknown",a=r?.attributes.temperature_unit||"°C",s=this._conditionIcon(o);return V`
      <div class="mc-module mc-weather">
        <ha-icon icon=${s} style="--mdc-icon-size:36px"></ha-icon>
        <div>
          ${i.show_temperature&&void 0!==n?V`<div class="mc-weather-temp">${n}${a}</div>`:Q}
          ${i.show_condition?V`<div class="mc-weather-condition">${o}</div>`:Q}
        </div>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Weather Entity",r.entity,e=>i({...r,entity:e}))}
        ${Pe("Show Temperature",r.show_temperature,e=>i({...r,show_temperature:e}))}
        ${Pe("Show Condition",r.show_condition,e=>i({...r,show_condition:e}))}
        ${Pe("Show Forecast",r.show_forecast,e=>i({...r,show_forecast:e}))}
        ${r.show_forecast?ze("Forecast Days",r.forecast_days,e=>i({...r,forecast_days:e}),{min:1,max:7}):Q}
      </div>
    `}_conditionIcon(e){return{"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant",exceptional:"mdi:alert-circle-outline"}[e]||"mdi:weather-partly-cloudy"}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"forecast",name:"Forecast",description:"Display weather forecast data",category:"advanced",icon:"mdi:calendar-week"}}createDefault(){return{id:Ae("forecast"),type:"forecast",forecast_type:"daily",num_forecasts:5,show_temperature:!0,show_precipitation:!0,show_wind:!1}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,n=(r?.attributes.forecast||[]).slice(0,i.num_forecasts||5);return n.length?V`
      <div class="mc-module mc-forecast">
        ${n.map(e=>V`
            <div class="mc-forecast-item">
              <span style="font-size:0.75rem;color:var(--mc-text-secondary)">
                ${e.datetime?new Date(e.datetime).toLocaleDateString(void 0,{weekday:"short"}):""}
              </span>
              <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
              ${i.show_temperature?V`<span style="font-size:0.875rem">${e.temperature??"--"}°</span>`:Q}
              ${i.show_precipitation&&void 0!==e.precipitation?V`<span style="font-size:0.75rem;color:var(--mc-text-secondary)">${e.precipitation}mm</span>`:Q}
            </div>
          `)}
      </div>
    `:V`
        <div class="mc-module mc-forecast">
          ${Array.from({length:i.num_forecasts||5}).map((e,t)=>V`
              <div class="mc-forecast-item">
                <span style="font-size:0.75rem;color:var(--mc-text-secondary)">Day ${t+1}</span>
                <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
                <span style="font-size:0.875rem">--°</span>
              </div>
            `)}
        </div>
      `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ne("Weather Entity",r.entity,e=>i({...r,entity:e}))}
        ${je("Forecast Type",r.forecast_type,[{label:"Daily",value:"daily"},{label:"Hourly",value:"hourly"}],e=>i({...r,forecast_type:e}))}
        ${ze("Number of Forecasts",r.num_forecasts,e=>i({...r,num_forecasts:e}),{min:1,max:10})}
        ${Pe("Show Temperature",r.show_temperature,e=>i({...r,show_temperature:e}))}
        ${Pe("Show Precipitation",r.show_precipitation,e=>i({...r,show_precipitation:e}))}
        ${Pe("Show Wind",r.show_wind,e=>i({...r,show_wind:e}))}
      </div>
    `}});xe.register(new class extends sr{constructor(){super(...arguments),this.metadata={type:"video-bg",name:"Video Background",description:"Display a video as a background",category:"advanced",icon:"mdi:video-outline"}}getAvailableTabs(){return["general","logic","design"]}createDefault(){return{id:Ae("video-bg"),type:"video-bg",autoplay:!0,loop:!0,muted:!0}}renderPreview(e,t){const i=e;return i.url?V`
      <div class="mc-module mc-video-bg">
        <video
          src=${i.url}
          poster=${i.poster||Q}
          ?autoplay=${i.autoplay}
          ?loop=${i.loop}
          ?muted=${i.muted}
          playsinline
        ></video>
      </div>
    `:V`
        <div class="mc-module mc-video-bg" style="display:flex;align-items:center;justify-content:center;height:120px;background:var(--mc-border);border-radius:8px">
          <ha-icon icon="mdi:video-off-outline" style="--mdc-icon-size:32px;color:var(--mc-text-secondary)"></ha-icon>
        </div>
      `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Video URL",r.url,e=>i({...r,url:e}))}
        ${Oe("Poster Image URL",r.poster,e=>i({...r,poster:e}))}
        ${Pe("Autoplay",r.autoplay,e=>i({...r,autoplay:e}))}
        ${Pe("Loop",r.loop,e=>i({...r,loop:e}))}
        ${Pe("Muted",r.muted,e=>i({...r,muted:e}))}
      </div>
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:e,name:"Magic Card",description:"A fully open-source multi-module card with advanced editor",preview:!0,documentationURL:"https://github.com/your-repo/magic-card"}),console.info("%c MAGIC-CARD %c v0.1.0 ","color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;")})();