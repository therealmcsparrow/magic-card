(()=>{"use strict";const e="magic-card",t="magic-card-editor",i="magic-card-templates",r=["content","controls","layout","advanced"],o=globalThis,a=o.ShadowRoot&&(void 0===o.ShadyCSS||o.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),s=new WeakMap;class c{constructor(e,t,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(a&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=s.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(t,e))}return e}toString(){return this.cssText}}const l=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,r)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[r+1],e[0]);return new c(i,e,n)},d=(e,t)=>{if(a)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of t){const t=document.createElement("style"),r=o.litNonce;void 0!==r&&t.setAttribute("nonce",r),t.textContent=i.cssText,e.appendChild(t)}},p=a?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new c("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:u,defineProperty:m,getOwnPropertyDescriptor:h,getOwnPropertyNames:g,getOwnPropertySymbols:v,getPrototypeOf:f}=Object,b=globalThis,y=b.trustedTypes,x=y?y.emptyScript:"",_=b.reactiveElementPolyfillSupport,w=(e,t)=>e,$={toAttribute(e,t){switch(t){case Boolean:e=e?x:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},k=(e,t)=>!u(e,t),C={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:k};Symbol.metadata??=Symbol("metadata"),b.litPropertyMetadata??=new WeakMap;class S extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=C){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);void 0!==r&&m(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:o}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(t){const a=r?.call(this);o?.call(this,t),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??C}static _$Ei(){if(this.hasOwnProperty(w("elementProperties")))return;const e=f(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(w("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(w("properties"))){const e=this.properties,t=[...g(e),...v(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(p(e))}else void 0!==e&&t.push(p(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return d(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(void 0!==r&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,r=i._$Eh.get(e);if(void 0!==r&&this._$Em!==r){const e=i.getPropertyOptions(r),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:$;this._$Em=r;const a=o.fromAttribute(t,e.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,i,r=!1,o){if(void 0!==e){const a=this.constructor;if(!1===r&&(o=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??k)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:o},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),!0!==o||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===r&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,r=this[t];!0!==e||this._$AL.has(t)||void 0===r||this.C(t,void 0,i,r)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}}S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[w("elementProperties")]=new Map,S[w("finalized")]=new Map,_?.({ReactiveElement:S}),(b.reactiveElementVersions??=[]).push("2.1.2");const A=globalThis,M=e=>e,z=A.trustedTypes,T=z?z.createPolicy("lit-html",{createHTML:e=>e}):void 0,E="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+I,P=`<${O}>`,j=document,D=()=>j.createComment(""),N=e=>null===e||"object"!=typeof e&&"function"!=typeof e,R=Array.isArray,L=e=>R(e)||"function"==typeof e?.[Symbol.iterator],H="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,B=/>/g,Q=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),G=/'/g,q=/"/g,W=/^(?:script|style|textarea|title)$/i,Y=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),V=Y(1),K=(Y(2),Y(3),Symbol.for("lit-noChange")),J=Symbol.for("lit-nothing"),Z=new WeakMap,X=j.createTreeWalker(j,129);function ee(e,t){if(!R(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==T?T.createHTML(t):t}const te=(e,t)=>{const i=e.length-1,r=[];let o,a=2===t?"<svg>":3===t?"<math>":"",n=F;for(let t=0;t<i;t++){const i=e[t];let s,c,l=-1,d=0;for(;d<i.length&&(n.lastIndex=d,c=n.exec(i),null!==c);)d=n.lastIndex,n===F?"!--"===c[1]?n=U:void 0!==c[1]?n=B:void 0!==c[2]?(W.test(c[2])&&(o=RegExp("</"+c[2],"g")),n=Q):void 0!==c[3]&&(n=Q):n===Q?">"===c[0]?(n=o??F,l=-1):void 0===c[1]?l=-2:(l=n.lastIndex-c[2].length,s=c[1],n=void 0===c[3]?Q:'"'===c[3]?q:G):n===q||n===G?n=Q:n===U||n===B?n=F:(n=Q,o=void 0);const p=n===Q&&e[t+1].startsWith("/>")?" ":"";a+=n===F?i+P:l>=0?(r.push(s),i.slice(0,l)+E+i.slice(l)+I+p):i+I+(-2===l?t:p)}return[ee(e,a+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),r]};class ie{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let o=0,a=0;const n=e.length-1,s=this.parts,[c,l]=te(e,t);if(this.el=ie.createElement(c,i),X.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(r=X.nextNode())&&s.length<n;){if(1===r.nodeType){if(r.hasAttributes())for(const e of r.getAttributeNames())if(e.endsWith(E)){const t=l[a++],i=r.getAttribute(e).split(I),n=/([.?@])?(.*)/.exec(t);s.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?se:"?"===n[1]?ce:"@"===n[1]?le:ne}),r.removeAttribute(e)}else e.startsWith(I)&&(s.push({type:6,index:o}),r.removeAttribute(e));if(W.test(r.tagName)){const e=r.textContent.split(I),t=e.length-1;if(t>0){r.textContent=z?z.emptyScript:"";for(let i=0;i<t;i++)r.append(e[i],D()),X.nextNode(),s.push({type:2,index:++o});r.append(e[t],D())}}}else if(8===r.nodeType)if(r.data===O)s.push({type:2,index:o});else{let e=-1;for(;-1!==(e=r.data.indexOf(I,e+1));)s.push({type:7,index:o}),e+=I.length-1}o++}}static createElement(e,t){const i=j.createElement("template");return i.innerHTML=e,i}}function re(e,t,i=e,r){if(t===K)return t;let o=void 0!==r?i._$Co?.[r]:i._$Cl;const a=N(t)?void 0:t._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(e),o._$AT(e,i,r)),void 0!==r?(i._$Co??=[])[r]=o:i._$Cl=o),void 0!==o&&(t=re(e,o._$AS(e,t.values),o,r)),t}class oe{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??j).importNode(t,!0);X.currentNode=r;let o=X.nextNode(),a=0,n=0,s=i[0];for(;void 0!==s;){if(a===s.index){let t;2===s.type?t=new ae(o,o.nextSibling,this,e):1===s.type?t=new s.ctor(o,s.name,s.strings,this,e):6===s.type&&(t=new de(o,this,e)),this._$AV.push(t),s=i[++n]}a!==s?.index&&(o=X.nextNode(),a++)}return X.currentNode=j,r}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class ae{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=re(this,e,t),N(e)?e===J||null==e||""===e?(this._$AH!==J&&this._$AR(),this._$AH=J):e!==this._$AH&&e!==K&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):L(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==J&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(j.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,r="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=ie.createElement(ee(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{const e=new oe(r,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=Z.get(e.strings);return void 0===t&&Z.set(e.strings,t=new ie(e)),t}k(e){R(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const o of e)r===t.length?t.push(i=new ae(this.O(D()),this.O(D()),this,this.options)):i=t[r],i._$AI(o),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=M(e).nextSibling;M(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ne{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,o){this.type=1,this._$AH=J,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=J}_$AI(e,t=this,i,r){const o=this.strings;let a=!1;if(void 0===o)e=re(this,e,t,0),a=!N(e)||e!==this._$AH&&e!==K,a&&(this._$AH=e);else{const r=e;let n,s;for(e=o[0],n=0;n<o.length-1;n++)s=re(this,r[i+n],t,n),s===K&&(s=this._$AH[n]),a||=!N(s)||s!==this._$AH[n],s===J?e=J:e!==J&&(e+=(s??"")+o[n+1]),this._$AH[n]=s}a&&!r&&this.j(e)}j(e){e===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class se extends ne{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===J?void 0:e}}class ce extends ne{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==J)}}class le extends ne{constructor(e,t,i,r,o){super(e,t,i,r,o),this.type=5}_$AI(e,t=this){if((e=re(this,e,t,0)??J)===K)return;const i=this._$AH,r=e===J&&i!==J||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==J&&(i===J||r);r&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class de{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){re(this,e)}}const pe={M:E,P:I,A:O,C:1,L:te,R:oe,D:L,V:re,I:ae,H:ne,N:ce,U:le,B:se,F:de},ue=A.litHtmlPolyfillSupport;ue?.(ie,ae),(A.litHtmlVersions??=[]).push("3.3.2");const me=globalThis;class he extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const r=i?.renderBefore??t;let o=r._$litPart$;if(void 0===o){const e=i?.renderBefore??null;r._$litPart$=o=new ae(t.insertBefore(D(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return K}}he._$litElement$=!0,he.finalized=!0,me.litElementHydrateSupport?.({LitElement:he});const ge=me.litElementPolyfillSupport;ge?.({LitElement:he});(me.litElementVersions??=[]).push("4.2.2");const ve=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},fe={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:k},be=(e=fe,t,i)=>{const{kind:r,metadata:o}=i;let a=globalThis.litPropertyMetadata.get(o);if(void 0===a&&globalThis.litPropertyMetadata.set(o,a=new Map),"setter"===r&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===r){const{name:r}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(r,o,e,!0,i)},init(t){return void 0!==t&&this.C(r,void 0,e,t),t}}}if("setter"===r){const{name:r}=i;return function(i){const o=this[r];t.call(this,i),this.requestUpdate(r,o,e,!0,i)}}throw Error("Unsupported decorator location: "+r)};function ye(e){return(t,i)=>"object"==typeof i?be(e,t,i):((e,t,i)=>{const r=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),r?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function xe(e){return ye({...e,state:!0,attribute:!1})}const _e=l`
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

  .mc-tile-slider {
    position: relative;
    width: 100%;
    height: 40px;
    border-radius: 12px;
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
    border-radius: 12px;
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
    border-radius: 4px;
    background-color: white;
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
`;const we=new class{constructor(){this.modules=new Map}register(e){this.modules.set(e.metadata.type,e)}get(e){return this.modules.get(e)}getAll(){return Array.from(this.modules.values())}getByCategory(e){return this.getAll().filter(t=>t.metadata.category===e)}getMetadata(){return this.getAll().map(e=>e.metadata)}search(e){const t=e.toLowerCase();return this.getAll().filter(e=>e.metadata.name.toLowerCase().includes(t)||e.metadata.description.toLowerCase().includes(t)||e.metadata.type.toLowerCase().includes(t))}createDefault(e){const t=this.get(e);return t?t.createDefault():null}has(e){return this.modules.has(e)}get types(){return Array.from(this.modules.keys())}},$e={font_size:"font-size",font_weight:"font-weight",font_family:"font-family",line_height:"line-height",text_align:"text-align",text_transform:"text-transform",letter_spacing:"letter-spacing",color:"color",background:"background",opacity:"opacity",padding:"padding",margin:"margin",border:"border",border_radius:"border-radius",border_color:"border-color",box_shadow:"box-shadow",text_shadow:"text-shadow",width:"width",height:"height",min_width:"min-width",min_height:"min-height",max_width:"max-width",max_height:"max-height",overflow:"overflow",flex:"flex",filter:"filter",backdrop_filter:"backdrop-filter",transform:"transform",transition:"transition"};function ke(e){if(!e)return"";const t=[];for(const[i,r]of Object.entries($e)){const o=e[i];void 0!==o&&"string"==typeof o&&t.push(`${r}: ${o}`)}return e.css&&t.push(e.css),t.join("; ")}let Ce=0;function Se(e="mc"){Ce++;return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2,6)}_${Ce}`}var Ae=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Me=class extends he{static getConfigElement(){return document.createElement(t)}static getStubConfig(){return{type:`custom:${e}`,rows:[{id:Se("row"),layout:"1",columns:[{id:Se("col"),modules:[{id:Se("text"),type:"text",text:"Welcome to Magic Card"}]}]}]}}setConfig(e){if(!e)throw new Error("No configuration provided");this._config={...e,rows:e.rows||[]},this._config.rows=this._config.rows.map(e=>({...e,id:e.id||Se("row"),columns:(e.columns||[]).map(e=>({...e,id:e.id||Se("col"),modules:(e.modules||[]).map(e=>({...e,id:e.id||Se(e.type)}))}))}))}getCardSize(){return this._config?.rows?Math.max(this._config.rows.length,1):1}render(){if(!this._config)return V`<ha-card><div class="mc-error">No configuration</div></ha-card>`;const e=this._buildCardStyle();return V`
      <ha-card>
        <div class="mc-card-content" style=${e}>
          ${this._config.rows.map(e=>this._renderRow(e))}
        </div>
      </ha-card>
    `}_buildCardStyle(){const e=[],t=this._config;return t.padding&&e.push(`padding: ${t.padding}`),t.background&&e.push(`background: ${t.background}`),t.border_radius&&e.push(`border-radius: ${t.border_radius}`),t.box_shadow&&e.push(`box-shadow: ${t.box_shadow}`),t.card_height&&e.push(`min-height: ${t.card_height}`),t.overflow&&e.push(`overflow: ${t.overflow}`),e.join("; ")}_renderRow(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return V``;var t;const i=`grid-template-columns: ${(t=e.layout||"1")?{1:"1fr","1-1":"1fr 1fr","1-2":"1fr 2fr","2-1":"2fr 1fr","1-1-1":"1fr 1fr 1fr","1-2-1":"1fr 2fr 1fr"}[t]||t:"1fr"}; gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,r=ke(e.design);return V`
      <div class="mc-row" style="${i}; ${r}">
        ${e.columns.map(e=>this._renderColumn(e))}
      </div>
    `}_renderColumn(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return V``;const t=`gap: ${e.gap||"8px"}${e.padding?`; padding: ${e.padding}`:""}`,i=ke(e.design);return V`
      <div
        class="mc-column"
        data-valign=${e.vertical_align||J}
        style="${t}; ${i}"
      >
        ${e.modules.map(e=>this._renderModule(e))}
      </div>
    `}_renderModule(e){if(e.display?.conditions?.length&&!this._evaluateDisplay(e.display))return V``;const t=we.get(e.type);if(!t)return V`<div class="mc-error">Unknown module: ${e.type}</div>`;const i=ke(e.design),r=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return V`
      <div
        class="mc-module-wrapper ${r?"mc-hoverable":""}"
        style=${i}
        @click=${r?t=>this._handleAction(t,e,"tap"):J}
        @contextmenu=${r?t=>this._handleAction(t,e,"hold"):J}
        @dblclick=${r?t=>this._handleAction(t,e,"double_tap"):J}
      >
        ${t.renderPreview(e,this.hass)}
      </div>
    `}_evaluateDisplay(e){if(!e.conditions?.length)return!0;if(!this.hass)return!0;const t=e.conditions.map(e=>{switch(e.type){case"state":{if(!e.entity)return!0;const t=this.hass.states[e.entity];return!!t&&(void 0!==e.state&&""!==e.state?t.state===e.state:void 0!==e.state_not&&""!==e.state_not?t.state!==e.state_not:!(void 0!==e.above&&Number(t.state)<=e.above)&&!(void 0!==e.below&&Number(t.state)>=e.below))}case"attribute":{if(!e.entity||!e.attribute)return!0;const t=this.hass.states[e.entity];if(!t)return!1;const i=String(t.attributes[e.attribute]??"");return void 0!==e.state&&""!==e.state?i===e.state:void 0===e.state_not||""===e.state_not||i!==e.state_not}case"time":{const t=new Date,i=60*t.getHours()+t.getMinutes();if(e.after){const[t,r]=e.after.split(":").map(Number);if(i<60*t+r)return!1}if(e.before){const[t,r]=e.before.split(":").map(Number);if(i>=60*t+r)return!1}return!0}default:return!0}});return"any"===e.mode?t.some(Boolean):t.every(Boolean)}_handleAction(e,t,i){"hold"===i&&e.preventDefault();const r=`${i}_action`,o=t.actions?.[r];if(!o||"none"===o.action)return;const a=t.entity;switch(o.action){case"more-info":if(a||o.entity){const e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:o.entity||a}});this.dispatchEvent(e)}break;case"toggle":if(a||o.entity){const e=o.entity||a,t=e.split(".")[0];this.hass?.callService(t,"toggle",{entity_id:e})}break;case"navigate":if(o.navigation_path){history.pushState(null,"",o.navigation_path);const e=new Event("location-changed",{bubbles:!0,composed:!0});window.dispatchEvent(e)}break;case"url":o.url_path&&window.open(o.url_path,"_blank");break;case"perform-action":if(o.service){const[e,t]=o.service.split(".");this.hass?.callService(e,t,{...o.data,...o.service_data})}break;case"assist":this.dispatchEvent(new CustomEvent("show-dialog",{bubbles:!0,composed:!0,detail:{dialogTag:"ha-voice-command-dialog",dialogImport:()=>{},dialogParams:{}}}))}}};function ze(e,t,i){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="text"
        .value=${t||""}
        @input=${e=>i(e.target.value)}
      />
    </div>
  `}function Te(e,t,i,r){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <input
        type="number"
        .value=${String(t??"")}
        min=${r?.min??J}
        max=${r?.max??J}
        step=${r?.step??J}
        @input=${e=>i(Number(e.target.value))}
      />
    </div>
  `}function Ee(e,t,i,r){return V`
    <div class="mc-field">
      ${e?V`<label class="mc-field-label">${e}</label>`:J}
      <select @change=${e=>r(e.target.value)}>
        ${i.map(e=>V`<option value=${e.value} ?selected=${t===e.value}>
              ${e.label}
            </option>`)}
      </select>
    </div>
  `}function Ie(e,t,i){return V`
    <div class="mc-field mc-field-toggle">
      <label class="mc-field-label">${e}</label>
      <ha-switch
        .checked=${t??!1}
        @change=${e=>i(e.target.checked)}
      ></ha-switch>
    </div>
  `}function Oe(e,t,i,r,o){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-entity-picker
        .hass=${r}
        .value=${t||""}
        .domain=${o||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-entity-picker>
    </div>
  `}function Pe(e,t,i){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-color-picker
        .value=${t||""}
        .label=${e}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-color-picker>
    </div>
  `}function je(e,t,i){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-unit-field
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-unit-field>
    </div>
  `}function De(e,t,i,r){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-icon-picker
        .hass=${r}
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value||"")}
      ></mc-icon-picker>
    </div>
  `}function Ne(e,t,i,r,o){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-media-picker
        .hass=${r}
        .value=${t||""}
        .mediaType=${o||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-media-picker>
    </div>
  `}Me.styles=_e,Ae([ye({attribute:!1})],Me.prototype,"hass",void 0),Ae([xe()],Me.prototype,"_config",void 0),Me=Ae([ve(e)],Me);const Re=l`
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
`;function Le(e){if(null===e||"object"!=typeof e)return e;if(Array.isArray(e))return e.map(e=>Le(e));const t={};for(const i of Object.keys(e))t[i]=Le(e[i]);return t}class He{constructor(e=50){this.undoStack=[],this.redoStack=[],this.limit=e}push(e){this.undoStack.push(Le(e)),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack=[]}undo(e){return 0===this.undoStack.length?null:(this.redoStack.push(Le(e)),this.undoStack.pop())}redo(e){return 0===this.redoStack.length?null:(this.undoStack.push(Le(e)),this.redoStack.pop())}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}clear(){this.undoStack=[],this.redoStack=[]}get undoCount(){return this.undoStack.length}get redoCount(){return this.redoStack.length}}class Fe{constructor(e){this.fireEvent=e,this.undoRedo=new He,this.listeners=new Set,this.state={config:{type:"custom:magic-card",rows:[]},selectedPath:null,activeTab:"general",editorMode:"form",isDirty:!1},this.dispatchConfigChanged=function(e,t){let i=null;const r=function(...r){null!==i&&clearTimeout(i),i=setTimeout(()=>{e.apply(this,r),i=null},t)};return r.cancel=()=>{null!==i&&(clearTimeout(i),i=null)},r}(e=>{this.fireEvent(e)},200)}subscribe(e){return this.listeners.add(e),e(this.state),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return this.state}getConfig(){return this.state.config}getSelectedModule(){const e=this.state.selectedPath;return void 0===e?.rowIndex||void 0===e?.columnIndex||void 0===e?.moduleIndex?null:this.state.config.rows[e.rowIndex]?.columns[e.columnIndex]?.modules[e.moduleIndex]??null}setConfig(e){this.state={...this.state,config:Le(e),isDirty:!1},this.notify()}updateConfig(e,t=!0){t&&this.undoRedo.push(this.state.config),this.state={...this.state,config:Le(e),isDirty:!0},this.notify(),this.dispatchConfigChanged(this.state.config)}setEditorMode(e){this.state={...this.state,editorMode:e},this.notify()}setSelectedPath(e){this.state={...this.state,selectedPath:e},this.notify()}setActiveTab(e){this.state={...this.state,activeTab:e},this.notify()}addRow(e="1"){const t=Le(this.state.config),i=e.split("-").length,r=Array.from({length:i},()=>({id:Se("col"),modules:[]}));t.rows.push({id:Se("row"),layout:e,columns:r}),this.updateConfig(t)}deleteRow(e){const t=Le(this.state.config);t.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(t)}moveRow(e,t){if(e===t)return;const i=Le(this.state.config),[r]=i.rows.splice(e,1);i.rows.splice(t,0,r),this.updateConfig(i)}updateRow(e,t){const i=Le(this.state.config);i.rows[e]={...i.rows[e],...t},this.updateConfig(i)}addColumn(e){const t=Le(this.state.config);t.rows[e].columns.push({id:Se("col"),modules:[]}),this.updateConfig(t)}deleteColumn(e,t){const i=Le(this.state.config);i.rows[e].columns.splice(t,1),0===i.rows[e].columns.length&&i.rows.splice(e,1),this.state.selectedPath=null,this.updateConfig(i)}addModule(e,t,i){const r=Le(this.state.config),o=we.createDefault(i);if(!o)return;r.rows[e].columns[t].modules.push(o);const a=r.rows[e].columns[t].modules.length-1;this.updateConfig(r),this.setSelectedPath({rowIndex:e,columnIndex:t,moduleIndex:a})}deleteModule(e,t,i){const r=Le(this.state.config);r.rows[e].columns[t].modules.splice(i,1),this.state.selectedPath=null,this.updateConfig(r)}updateModule(e,t,i,r){const o=Le(this.state.config),a=o.rows[e].columns[t].modules[i];o.rows[e].columns[t].modules[i]={...a,...r},this.updateConfig(o)}moveModule(e,t,i,r,o,a){const n=Le(this.state.config),[s]=n.rows[e].columns[t].modules.splice(i,1);n.rows[r].columns[o].modules.splice(a,0,s),this.updateConfig(n),this.setSelectedPath({rowIndex:r,columnIndex:o,moduleIndex:a})}undo(){const e=this.undoRedo.undo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}redo(){const e=this.undoRedo.redo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0},this.notify(),this.dispatchConfigChanged(e))}canUndo(){return this.undoRedo.canUndo()}canRedo(){return this.undoRedo.canRedo()}destroy(){this.dispatchConfigChanged.cancel(),this.listeners.clear(),this.undoRedo.clear()}}const Ue=l`
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

  /* Card header with name + settings button */
  .mc-card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid var(--divider-color, #e5e7eb);
    border-radius: 8px;
    background: color-mix(in srgb, var(--primary-color, #6366f1) 6%, transparent);
  }

  .mc-card-name-input {
    flex: 1;
    border: none;
    background: none;
    font-size: 0.875rem;
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
`;var Be=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Qe=class extends he{constructor(){super(...arguments),this._collapsedRows=new Set,this._dragOver=null,this._dragState=null}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}_onRowDragStart(e,t){this._dragState={type:"row",rowIndex:t},e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._dragState)),e.target.classList.add("dragging")}_onRowDragEnd(e){e.target.classList.remove("dragging"),this._dragState=null,this._dragOver=null}_onRowDragOver(e,t){this._dragState&&"row"===this._dragState.type&&(e.preventDefault(),e.dataTransfer.dropEffect="move",this._dragOver={type:"row",index:t})}_onRowDragLeave(){this._dragOver=null}_onRowDrop(e,t){if(e.preventDefault(),!this._dragState||"row"!==this._dragState.type)return;const i=this._dragState.rowIndex;i!==t&&this.stateManager.moveRow(i,t),this._dragState=null,this._dragOver=null}_onModuleDragStart(e,t,i,r){this._dragState={type:"module",rowIndex:t,colIndex:i,moduleIndex:r},e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._dragState)),e.target.classList.add("dragging"),e.stopPropagation()}_onModuleDragEnd(e){e.target.classList.remove("dragging"),this._dragState=null,this._dragOver=null}_onModuleDragOver(e,t,i,r){this._dragState&&"module"===this._dragState.type&&(e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="move",this._dragOver={type:"module",index:r,colIndex:i})}_onContainerDragOver(e,t,i){this._dragState&&"module"===this._dragState.type&&(e.preventDefault(),e.dataTransfer.dropEffect="move")}_onModuleDrop(e,t,i,r){if(e.preventDefault(),e.stopPropagation(),!this._dragState||"module"!==this._dragState.type)return;const{rowIndex:o,colIndex:a,moduleIndex:n}=this._dragState;o===t&&a===i&&n===r||this.stateManager.moveModule(o,a,n,t,i,r),this._dragState=null,this._dragOver=null}_onContainerDrop(e,t,i){if(e.preventDefault(),!this._dragState||"module"!==this._dragState.type)return;const{rowIndex:r,colIndex:o,moduleIndex:a}=this._dragState,n=(this._editorState?.config.rows[t]?.columns[i]?.modules||[]).length;this.stateManager.moveModule(r,o,a,t,i,n),this._dragState=null,this._dragOver=null}render(){if(!this._editorState)return V``;const{config:e,selectedPath:t}=this._editorState;return V`
      <div class="mc-form">
        ${this._renderCardSection(e)}
        <div class="mc-rows-container">
          ${e.rows.map((e,i)=>this._renderRow(e,i,t))}
        </div>
      </div>
    `}_renderCardSection(e){return V`
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
    `}_renderRow(e,t,i){const r="row"===this._dragOver?.type&&this._dragOver?.index===t,o=this._collapsedRows.has(t);return V`
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
            ${Ee("",e.layout,[{label:"1 Col",value:"1"},{label:"1-1",value:"1-1"},{label:"1-2",value:"1-2"},{label:"2-1",value:"2-1"},{label:"1-1-1",value:"1-1-1"}],e=>this.stateManager.updateRow(t,{layout:e}))}
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
        ${o?J:V`
            <div class="mc-row-body">
              ${e.columns.map((e,r)=>this._renderColumn(e,t,r,i))}
            </div>
          `}
      </div>
    `}_renderColumn(e,t,i,r){const o=this._editorState?.config.rows[t],a=o&&o.columns.length>1;return V`
      <div class="mc-col-item">
        <div class="mc-col-header">
          <ha-icon icon="mdi:view-column" style="--mdc-icon-size:14px"></ha-icon>
          <span class="mc-label">Column ${i+1}</span>
          ${a?V`
            <button
              class="mc-btn-icon mc-btn-small"
              @click=${()=>this.stateManager.deleteColumn(t,i)}
              title="Delete column"
            >
              <ha-icon icon="mdi:close" style="--mdc-icon-size:12px"></ha-icon>
            </button>
          `:J}
        </div>
        <div
          class="mc-modules-container"
          data-row="${t}"
          data-col="${i}"
          @dragover=${e=>this._onContainerDragOver(e,t,i)}
          @drop=${e=>this._onContainerDrop(e,t,i)}
        >
          ${e.modules.map((e,o)=>{const a=r?.rowIndex===t&&r?.columnIndex===i&&r?.moduleIndex===o,n=we.get(e.type),s="module"===this._dragOver?.type&&this._dragOver?.index===o&&this._dragOver?.colIndex===i;return V`
              <div
                class="mc-module-item ${a?"selected":""} ${s?"drag-over":""}"
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
                    icon=${n?.metadata.icon||"mdi:puzzle"}
                    style="--mdc-icon-size:16px"
                  ></ha-icon>
                </span>
                <span class="mc-module-item-name">
                  ${n?.metadata.name||e.type}
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
    `}_toggleRow(e){this._collapsedRows.has(e)?this._collapsedRows.delete(e):this._collapsedRows.add(e),this.requestUpdate()}};function Ge(e){return null==e}Qe.styles=[Re,Ue],Be([ye({attribute:!1})],Qe.prototype,"stateManager",void 0),Be([ye({attribute:!1})],Qe.prototype,"hass",void 0),Be([xe()],Qe.prototype,"_editorState",void 0),Be([xe()],Qe.prototype,"_collapsedRows",void 0),Be([xe()],Qe.prototype,"_dragOver",void 0),Qe=Be([ve("mc-form-editor")],Qe);var qe={isNothing:Ge,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:Ge(e)?[]:[e]},repeat:function(e,t){var i,r="";for(i=0;i<t;i+=1)r+=e;return r},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:function(e,t){var i,r,o,a;if(t)for(i=0,r=(a=Object.keys(t)).length;i<r;i+=1)e[o=a[i]]=t[o];return e}};function We(e,t){var i="",r=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(i+='in "'+e.mark.name+'" '),i+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(i+="\n\n"+e.mark.snippet),r+" "+i):r}function Ye(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=We(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}Ye.prototype=Object.create(Error.prototype),Ye.prototype.constructor=Ye,Ye.prototype.toString=function(e){return this.name+": "+We(this,e)};var Ve=Ye;function Ke(e,t,i,r,o){var a="",n="",s=Math.floor(o/2)-1;return r-t>s&&(t=r-s+(a=" ... ").length),i-r>s&&(i=r+s-(n=" ...").length),{str:a+e.slice(t,i).replace(/\t/g,"→")+n,pos:r-t+a.length}}function Je(e,t){return qe.repeat(" ",t-e.length)+e}var Ze=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var i,r=/\r?\n|\r|\0/g,o=[0],a=[],n=-1;i=r.exec(e.buffer);)a.push(i.index),o.push(i.index+i[0].length),e.position<=i.index&&n<0&&(n=o.length-2);n<0&&(n=o.length-1);var s,c,l="",d=Math.min(e.line+t.linesAfter,a.length).toString().length,p=t.maxLength-(t.indent+d+3);for(s=1;s<=t.linesBefore&&!(n-s<0);s++)c=Ke(e.buffer,o[n-s],a[n-s],e.position-(o[n]-o[n-s]),p),l=qe.repeat(" ",t.indent)+Je((e.line-s+1).toString(),d)+" | "+c.str+"\n"+l;for(c=Ke(e.buffer,o[n],a[n],e.position,p),l+=qe.repeat(" ",t.indent)+Je((e.line+1).toString(),d)+" | "+c.str+"\n",l+=qe.repeat("-",t.indent+d+3+c.pos)+"^\n",s=1;s<=t.linesAfter&&!(n+s>=a.length);s++)c=Ke(e.buffer,o[n+s],a[n+s],e.position-(o[n]-o[n+s]),p),l+=qe.repeat(" ",t.indent)+Je((e.line+s+1).toString(),d)+" | "+c.str+"\n";return l.replace(/\n$/,"")},Xe=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],et=["scalar","sequence","mapping"];var tt=function(e,t){if(t=t||{},Object.keys(t).forEach(function(t){if(-1===Xe.indexOf(t))throw new Ve('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')}),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=function(e){var t={};return null!==e&&Object.keys(e).forEach(function(i){e[i].forEach(function(e){t[String(e)]=i})}),t}(t.styleAliases||null),-1===et.indexOf(this.kind))throw new Ve('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')};function it(e,t){var i=[];return e[t].forEach(function(e){var t=i.length;i.forEach(function(i,r){i.tag===e.tag&&i.kind===e.kind&&i.multi===e.multi&&(t=r)}),i[t]=e}),i}function rt(e){return this.extend(e)}rt.prototype.extend=function(e){var t=[],i=[];if(e instanceof tt)i.push(e);else if(Array.isArray(e))i=i.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new Ve("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(i=i.concat(e.explicit))}t.forEach(function(e){if(!(e instanceof tt))throw new Ve("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new Ve("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new Ve("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")}),i.forEach(function(e){if(!(e instanceof tt))throw new Ve("Specified list of YAML types (or a single Type object) contains a non-Type object.")});var r=Object.create(rt.prototype);return r.implicit=(this.implicit||[]).concat(t),r.explicit=(this.explicit||[]).concat(i),r.compiledImplicit=it(r,"implicit"),r.compiledExplicit=it(r,"explicit"),r.compiledTypeMap=function(){var e,t,i={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function r(e){e.multi?(i.multi[e.kind].push(e),i.multi.fallback.push(e)):i[e.kind][e.tag]=i.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(r);return i}(r.compiledImplicit,r.compiledExplicit),r};var ot=rt,at=new tt("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),nt=new tt("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),st=new tt("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),ct=new ot({explicit:[at,nt,st]});var lt=new tt("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});var dt=new tt("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function pt(e){return 48<=e&&e<=57||65<=e&&e<=70||97<=e&&e<=102}function ut(e){return 48<=e&&e<=55}function mt(e){return 48<=e&&e<=57}var ht=new tt("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,i=e.length,r=0,o=!1;if(!i)return!1;if("-"!==(t=e[r])&&"+"!==t||(t=e[++r]),"0"===t){if(r+1===i)return!0;if("b"===(t=e[++r])){for(r++;r<i;r++)if("_"!==(t=e[r])){if("0"!==t&&"1"!==t)return!1;o=!0}return o&&"_"!==t}if("x"===t){for(r++;r<i;r++)if("_"!==(t=e[r])){if(!pt(e.charCodeAt(r)))return!1;o=!0}return o&&"_"!==t}if("o"===t){for(r++;r<i;r++)if("_"!==(t=e[r])){if(!ut(e.charCodeAt(r)))return!1;o=!0}return o&&"_"!==t}}if("_"===t)return!1;for(;r<i;r++)if("_"!==(t=e[r])){if(!mt(e.charCodeAt(r)))return!1;o=!0}return!(!o||"_"===t)},construct:function(e){var t,i=e,r=1;if(-1!==i.indexOf("_")&&(i=i.replace(/_/g,"")),"-"!==(t=i[0])&&"+"!==t||("-"===t&&(r=-1),t=(i=i.slice(1))[0]),"0"===i)return 0;if("0"===t){if("b"===i[1])return r*parseInt(i.slice(2),2);if("x"===i[1])return r*parseInt(i.slice(2),16);if("o"===i[1])return r*parseInt(i.slice(2),8)}return r*parseInt(i,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!qe.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),gt=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var vt=/^[-+]?[0-9]+e/;var ft=new tt("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!gt.test(e)||"_"===e[e.length-1])},construct:function(e){var t,i;return i="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:i*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||qe.isNegativeZero(e))},represent:function(e,t){var i;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(qe.isNegativeZero(e))return"-0.0";return i=e.toString(10),vt.test(i)?i.replace("e",".e"):i},defaultStyle:"lowercase"}),bt=ct.extend({implicit:[lt,dt,ht,ft]}),yt=bt,xt=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),_t=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");var wt=new tt("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==xt.exec(e)||null!==_t.exec(e))},construct:function(e){var t,i,r,o,a,n,s,c,l=0,d=null;if(null===(t=xt.exec(e))&&(t=_t.exec(e)),null===t)throw new Error("Date resolve error");if(i=+t[1],r=+t[2]-1,o=+t[3],!t[4])return new Date(Date.UTC(i,r,o));if(a=+t[4],n=+t[5],s=+t[6],t[7]){for(l=t[7].slice(0,3);l.length<3;)l+="0";l=+l}return t[9]&&(d=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(d=-d)),c=new Date(Date.UTC(i,r,o,a,n,s,l)),d&&c.setTime(c.getTime()-d),c},instanceOf:Date,represent:function(e){return e.toISOString()}});var $t=new tt("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),kt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";var Ct=new tt("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,i,r=0,o=e.length,a=kt;for(i=0;i<o;i++)if(!((t=a.indexOf(e.charAt(i)))>64)){if(t<0)return!1;r+=6}return r%8==0},construct:function(e){var t,i,r=e.replace(/[\r\n=]/g,""),o=r.length,a=kt,n=0,s=[];for(t=0;t<o;t++)t%4==0&&t&&(s.push(n>>16&255),s.push(n>>8&255),s.push(255&n)),n=n<<6|a.indexOf(r.charAt(t));return 0===(i=o%4*6)?(s.push(n>>16&255),s.push(n>>8&255),s.push(255&n)):18===i?(s.push(n>>10&255),s.push(n>>2&255)):12===i&&s.push(n>>4&255),new Uint8Array(s)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,i,r="",o=0,a=e.length,n=kt;for(t=0;t<a;t++)t%3==0&&t&&(r+=n[o>>18&63],r+=n[o>>12&63],r+=n[o>>6&63],r+=n[63&o]),o=(o<<8)+e[t];return 0===(i=a%3)?(r+=n[o>>18&63],r+=n[o>>12&63],r+=n[o>>6&63],r+=n[63&o]):2===i?(r+=n[o>>10&63],r+=n[o>>4&63],r+=n[o<<2&63],r+=n[64]):1===i&&(r+=n[o>>2&63],r+=n[o<<4&63],r+=n[64],r+=n[64]),r}}),St=Object.prototype.hasOwnProperty,At=Object.prototype.toString;var Mt=new tt("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,i,r,o,a,n=[],s=e;for(t=0,i=s.length;t<i;t+=1){if(r=s[t],a=!1,"[object Object]"!==At.call(r))return!1;for(o in r)if(St.call(r,o)){if(a)return!1;a=!0}if(!a)return!1;if(-1!==n.indexOf(o))return!1;n.push(o)}return!0},construct:function(e){return null!==e?e:[]}}),zt=Object.prototype.toString;var Tt=new tt("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,i,r,o,a,n=e;for(a=new Array(n.length),t=0,i=n.length;t<i;t+=1){if(r=n[t],"[object Object]"!==zt.call(r))return!1;if(1!==(o=Object.keys(r)).length)return!1;a[t]=[o[0],r[o[0]]]}return!0},construct:function(e){if(null===e)return[];var t,i,r,o,a,n=e;for(a=new Array(n.length),t=0,i=n.length;t<i;t+=1)r=n[t],o=Object.keys(r),a[t]=[o[0],r[o[0]]];return a}}),Et=Object.prototype.hasOwnProperty;var It=new tt("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,i=e;for(t in i)if(Et.call(i,t)&&null!==i[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),Ot=yt.extend({implicit:[wt,$t],explicit:[Ct,Mt,Tt,It]}),Pt=Object.prototype.hasOwnProperty,jt=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Dt=/[\x85\u2028\u2029]/,Nt=/[,\[\]\{\}]/,Rt=/^(?:!|!!|![a-z\-]+!)$/i,Lt=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Ht(e){return Object.prototype.toString.call(e)}function Ft(e){return 10===e||13===e}function Ut(e){return 9===e||32===e}function Bt(e){return 9===e||32===e||10===e||13===e}function Qt(e){return 44===e||91===e||93===e||123===e||125===e}function Gt(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function qt(e){return 120===e?2:117===e?4:85===e?8:0}function Wt(e){return 48<=e&&e<=57?e-48:-1}function Yt(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function Vt(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function Kt(e,t,i){"__proto__"===t?Object.defineProperty(e,t,{configurable:!0,enumerable:!0,writable:!0,value:i}):e[t]=i}for(var Jt=new Array(256),Zt=new Array(256),Xt=0;Xt<256;Xt++)Jt[Xt]=Yt(Xt)?1:0,Zt[Xt]=Yt(Xt);function ei(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||Ot,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function ti(e,t){var i={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return i.snippet=Ze(i),new Ve(t,i)}function ii(e,t){throw ti(e,t)}function ri(e,t){e.onWarning&&e.onWarning.call(null,ti(e,t))}var oi={YAML:function(e,t,i){var r,o,a;null!==e.version&&ii(e,"duplication of %YAML directive"),1!==i.length&&ii(e,"YAML directive accepts exactly one argument"),null===(r=/^([0-9]+)\.([0-9]+)$/.exec(i[0]))&&ii(e,"ill-formed argument of the YAML directive"),o=parseInt(r[1],10),a=parseInt(r[2],10),1!==o&&ii(e,"unacceptable YAML version of the document"),e.version=i[0],e.checkLineBreaks=a<2,1!==a&&2!==a&&ri(e,"unsupported YAML version of the document")},TAG:function(e,t,i){var r,o;2!==i.length&&ii(e,"TAG directive accepts exactly two arguments"),r=i[0],o=i[1],Rt.test(r)||ii(e,"ill-formed tag handle (first argument) of the TAG directive"),Pt.call(e.tagMap,r)&&ii(e,'there is a previously declared suffix for "'+r+'" tag handle'),Lt.test(o)||ii(e,"ill-formed tag prefix (second argument) of the TAG directive");try{o=decodeURIComponent(o)}catch(t){ii(e,"tag prefix is malformed: "+o)}e.tagMap[r]=o}};function ai(e,t,i,r){var o,a,n,s;if(t<i){if(s=e.input.slice(t,i),r)for(o=0,a=s.length;o<a;o+=1)9===(n=s.charCodeAt(o))||32<=n&&n<=1114111||ii(e,"expected valid JSON character");else jt.test(s)&&ii(e,"the stream contains non-printable characters");e.result+=s}}function ni(e,t,i,r){var o,a,n,s;for(qe.isObject(i)||ii(e,"cannot merge mappings; the provided source object is unacceptable"),n=0,s=(o=Object.keys(i)).length;n<s;n+=1)a=o[n],Pt.call(t,a)||(Kt(t,a,i[a]),r[a]=!0)}function si(e,t,i,r,o,a,n,s,c){var l,d;if(Array.isArray(o))for(l=0,d=(o=Array.prototype.slice.call(o)).length;l<d;l+=1)Array.isArray(o[l])&&ii(e,"nested arrays are not supported inside keys"),"object"==typeof o&&"[object Object]"===Ht(o[l])&&(o[l]="[object Object]");if("object"==typeof o&&"[object Object]"===Ht(o)&&(o="[object Object]"),o=String(o),null===t&&(t={}),"tag:yaml.org,2002:merge"===r)if(Array.isArray(a))for(l=0,d=a.length;l<d;l+=1)ni(e,t,a[l],i);else ni(e,t,a,i);else e.json||Pt.call(i,o)||!Pt.call(t,o)||(e.line=n||e.line,e.lineStart=s||e.lineStart,e.position=c||e.position,ii(e,"duplicated mapping key")),Kt(t,o,a),delete i[o];return t}function ci(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):ii(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function li(e,t,i){for(var r=0,o=e.input.charCodeAt(e.position);0!==o;){for(;Ut(o);)9===o&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),o=e.input.charCodeAt(++e.position);if(t&&35===o)do{o=e.input.charCodeAt(++e.position)}while(10!==o&&13!==o&&0!==o);if(!Ft(o))break;for(ci(e),o=e.input.charCodeAt(e.position),r++,e.lineIndent=0;32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position)}return-1!==i&&0!==r&&e.lineIndent<i&&ri(e,"deficient indentation"),r}function di(e){var t,i=e.position;return!(45!==(t=e.input.charCodeAt(i))&&46!==t||t!==e.input.charCodeAt(i+1)||t!==e.input.charCodeAt(i+2)||(i+=3,0!==(t=e.input.charCodeAt(i))&&!Bt(t)))}function pi(e,t){1===t?e.result+=" ":t>1&&(e.result+=qe.repeat("\n",t-1))}function ui(e,t){var i,r,o=e.tag,a=e.anchor,n=[],s=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=n),r=e.input.charCodeAt(e.position);0!==r&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,ii(e,"tab characters must not be used in indentation")),45===r)&&Bt(e.input.charCodeAt(e.position+1));)if(s=!0,e.position++,li(e,!0,-1)&&e.lineIndent<=t)n.push(null),r=e.input.charCodeAt(e.position);else if(i=e.line,gi(e,t,3,!1,!0),n.push(e.result),li(e,!0,-1),r=e.input.charCodeAt(e.position),(e.line===i||e.lineIndent>t)&&0!==r)ii(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!s&&(e.tag=o,e.anchor=a,e.kind="sequence",e.result=n,!0)}function mi(e){var t,i,r,o,a=!1,n=!1;if(33!==(o=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&ii(e,"duplication of a tag property"),60===(o=e.input.charCodeAt(++e.position))?(a=!0,o=e.input.charCodeAt(++e.position)):33===o?(n=!0,i="!!",o=e.input.charCodeAt(++e.position)):i="!",t=e.position,a){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&62!==o);e.position<e.length?(r=e.input.slice(t,e.position),o=e.input.charCodeAt(++e.position)):ii(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==o&&!Bt(o);)33===o&&(n?ii(e,"tag suffix cannot contain exclamation marks"):(i=e.input.slice(t-1,e.position+1),Rt.test(i)||ii(e,"named tag handle cannot contain such characters"),n=!0,t=e.position+1)),o=e.input.charCodeAt(++e.position);r=e.input.slice(t,e.position),Nt.test(r)&&ii(e,"tag suffix cannot contain flow indicator characters")}r&&!Lt.test(r)&&ii(e,"tag name cannot contain such characters: "+r);try{r=decodeURIComponent(r)}catch(t){ii(e,"tag name is malformed: "+r)}return a?e.tag=r:Pt.call(e.tagMap,i)?e.tag=e.tagMap[i]+r:"!"===i?e.tag="!"+r:"!!"===i?e.tag="tag:yaml.org,2002:"+r:ii(e,'undeclared tag handle "'+i+'"'),!0}function hi(e){var t,i;if(38!==(i=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&ii(e,"duplication of an anchor property"),i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!Bt(i)&&!Qt(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&ii(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function gi(e,t,i,r,o){var a,n,s,c,l,d,p,u,m,h=1,g=!1,v=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,a=n=s=4===i||3===i,r&&li(e,!0,-1)&&(g=!0,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)),1===h)for(;mi(e)||hi(e);)li(e,!0,-1)?(g=!0,s=a,e.lineIndent>t?h=1:e.lineIndent===t?h=0:e.lineIndent<t&&(h=-1)):s=!1;if(s&&(s=g||o),1!==h&&4!==i||(u=1===i||2===i?t:t+1,m=e.position-e.lineStart,1===h?s&&(ui(e,m)||function(e,t,i){var r,o,a,n,s,c,l,d=e.tag,p=e.anchor,u={},m=Object.create(null),h=null,g=null,v=null,f=!1,b=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=u),l=e.input.charCodeAt(e.position);0!==l;){if(f||-1===e.firstTabInLine||(e.position=e.firstTabInLine,ii(e,"tab characters must not be used in indentation")),r=e.input.charCodeAt(e.position+1),a=e.line,63!==l&&58!==l||!Bt(r)){if(n=e.line,s=e.lineStart,c=e.position,!gi(e,i,2,!1,!0))break;if(e.line===a){for(l=e.input.charCodeAt(e.position);Ut(l);)l=e.input.charCodeAt(++e.position);if(58===l)Bt(l=e.input.charCodeAt(++e.position))||ii(e,"a whitespace character is expected after the key-value separator within a block mapping"),f&&(si(e,u,m,h,g,null,n,s,c),h=g=v=null),b=!0,f=!1,o=!1,h=e.tag,g=e.result;else{if(!b)return e.tag=d,e.anchor=p,!0;ii(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!b)return e.tag=d,e.anchor=p,!0;ii(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===l?(f&&(si(e,u,m,h,g,null,n,s,c),h=g=v=null),b=!0,f=!0,o=!0):f?(f=!1,o=!0):ii(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,l=r;if((e.line===a||e.lineIndent>t)&&(f&&(n=e.line,s=e.lineStart,c=e.position),gi(e,t,4,!0,o)&&(f?g=e.result:v=e.result),f||(si(e,u,m,h,g,v,n,s,c),h=g=v=null),li(e,!0,-1),l=e.input.charCodeAt(e.position)),(e.line===a||e.lineIndent>t)&&0!==l)ii(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return f&&si(e,u,m,h,g,null,n,s,c),b&&(e.tag=d,e.anchor=p,e.kind="mapping",e.result=u),b}(e,m,u))||function(e,t){var i,r,o,a,n,s,c,l,d,p,u,m,h=!0,g=e.tag,v=e.anchor,f=Object.create(null);if(91===(m=e.input.charCodeAt(e.position)))n=93,l=!1,a=[];else{if(123!==m)return!1;n=125,l=!0,a={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),m=e.input.charCodeAt(++e.position);0!==m;){if(li(e,!0,t),(m=e.input.charCodeAt(e.position))===n)return e.position++,e.tag=g,e.anchor=v,e.kind=l?"mapping":"sequence",e.result=a,!0;h?44===m&&ii(e,"expected the node content, but found ','"):ii(e,"missed comma between flow collection entries"),u=null,s=c=!1,63===m&&Bt(e.input.charCodeAt(e.position+1))&&(s=c=!0,e.position++,li(e,!0,t)),i=e.line,r=e.lineStart,o=e.position,gi(e,t,1,!1,!0),p=e.tag,d=e.result,li(e,!0,t),m=e.input.charCodeAt(e.position),!c&&e.line!==i||58!==m||(s=!0,m=e.input.charCodeAt(++e.position),li(e,!0,t),gi(e,t,1,!1,!0),u=e.result),l?si(e,a,f,p,d,u,i,r,o):s?a.push(si(e,null,f,p,d,u,i,r,o)):a.push(d),li(e,!0,t),44===(m=e.input.charCodeAt(e.position))?(h=!0,m=e.input.charCodeAt(++e.position)):h=!1}ii(e,"unexpected end of the stream within a flow collection")}(e,u)?v=!0:(n&&function(e,t){var i,r,o,a,n=1,s=!1,c=!1,l=t,d=0,p=!1;if(124===(a=e.input.charCodeAt(e.position)))r=!1;else{if(62!==a)return!1;r=!0}for(e.kind="scalar",e.result="";0!==a;)if(43===(a=e.input.charCodeAt(++e.position))||45===a)1===n?n=43===a?3:2:ii(e,"repeat of a chomping mode identifier");else{if(!((o=Wt(a))>=0))break;0===o?ii(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):c?ii(e,"repeat of an indentation width identifier"):(l=t+o-1,c=!0)}if(Ut(a)){do{a=e.input.charCodeAt(++e.position)}while(Ut(a));if(35===a)do{a=e.input.charCodeAt(++e.position)}while(!Ft(a)&&0!==a)}for(;0!==a;){for(ci(e),e.lineIndent=0,a=e.input.charCodeAt(e.position);(!c||e.lineIndent<l)&&32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position);if(!c&&e.lineIndent>l&&(l=e.lineIndent),Ft(a))d++;else{if(e.lineIndent<l){3===n?e.result+=qe.repeat("\n",s?1+d:d):1===n&&s&&(e.result+="\n");break}for(r?Ut(a)?(p=!0,e.result+=qe.repeat("\n",s?1+d:d)):p?(p=!1,e.result+=qe.repeat("\n",d+1)):0===d?s&&(e.result+=" "):e.result+=qe.repeat("\n",d):e.result+=qe.repeat("\n",s?1+d:d),s=!0,c=!0,d=0,i=e.position;!Ft(a)&&0!==a;)a=e.input.charCodeAt(++e.position);ai(e,i,e.position,!1)}}return!0}(e,u)||function(e,t){var i,r,o;if(39!==(i=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,r=o=e.position;0!==(i=e.input.charCodeAt(e.position));)if(39===i){if(ai(e,r,e.position,!0),39!==(i=e.input.charCodeAt(++e.position)))return!0;r=e.position,e.position++,o=e.position}else Ft(i)?(ai(e,r,o,!0),pi(e,li(e,!1,t)),r=o=e.position):e.position===e.lineStart&&di(e)?ii(e,"unexpected end of the document within a single quoted scalar"):(e.position++,o=e.position);ii(e,"unexpected end of the stream within a single quoted scalar")}(e,u)||function(e,t){var i,r,o,a,n,s;if(34!==(s=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(s=e.input.charCodeAt(e.position));){if(34===s)return ai(e,i,e.position,!0),e.position++,!0;if(92===s){if(ai(e,i,e.position,!0),Ft(s=e.input.charCodeAt(++e.position)))li(e,!1,t);else if(s<256&&Jt[s])e.result+=Zt[s],e.position++;else if((n=qt(s))>0){for(o=n,a=0;o>0;o--)(n=Gt(s=e.input.charCodeAt(++e.position)))>=0?a=(a<<4)+n:ii(e,"expected hexadecimal character");e.result+=Vt(a),e.position++}else ii(e,"unknown escape sequence");i=r=e.position}else Ft(s)?(ai(e,i,r,!0),pi(e,li(e,!1,t)),i=r=e.position):e.position===e.lineStart&&di(e)?ii(e,"unexpected end of the document within a double quoted scalar"):(e.position++,r=e.position)}ii(e,"unexpected end of the stream within a double quoted scalar")}(e,u)?v=!0:!function(e){var t,i,r;if(42!==(r=e.input.charCodeAt(e.position)))return!1;for(r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!Bt(r)&&!Qt(r);)r=e.input.charCodeAt(++e.position);return e.position===t&&ii(e,"name of an alias node must contain at least one character"),i=e.input.slice(t,e.position),Pt.call(e.anchorMap,i)||ii(e,'unidentified alias "'+i+'"'),e.result=e.anchorMap[i],li(e,!0,-1),!0}(e)?function(e,t,i){var r,o,a,n,s,c,l,d,p=e.kind,u=e.result;if(Bt(d=e.input.charCodeAt(e.position))||Qt(d)||35===d||38===d||42===d||33===d||124===d||62===d||39===d||34===d||37===d||64===d||96===d)return!1;if((63===d||45===d)&&(Bt(r=e.input.charCodeAt(e.position+1))||i&&Qt(r)))return!1;for(e.kind="scalar",e.result="",o=a=e.position,n=!1;0!==d;){if(58===d){if(Bt(r=e.input.charCodeAt(e.position+1))||i&&Qt(r))break}else if(35===d){if(Bt(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&di(e)||i&&Qt(d))break;if(Ft(d)){if(s=e.line,c=e.lineStart,l=e.lineIndent,li(e,!1,-1),e.lineIndent>=t){n=!0,d=e.input.charCodeAt(e.position);continue}e.position=a,e.line=s,e.lineStart=c,e.lineIndent=l;break}}n&&(ai(e,o,a,!1),pi(e,e.line-s),o=a=e.position,n=!1),Ut(d)||(a=e.position+1),d=e.input.charCodeAt(++e.position)}return ai(e,o,a,!1),!!e.result||(e.kind=p,e.result=u,!1)}(e,u,1===i)&&(v=!0,null===e.tag&&(e.tag="?")):(v=!0,null===e.tag&&null===e.anchor||ii(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===h&&(v=s&&ui(e,m))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&ii(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),c=0,l=e.implicitTypes.length;c<l;c+=1)if((p=e.implicitTypes[c]).resolve(e.result)){e.result=p.construct(e.result),e.tag=p.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(Pt.call(e.typeMap[e.kind||"fallback"],e.tag))p=e.typeMap[e.kind||"fallback"][e.tag];else for(p=null,c=0,l=(d=e.typeMap.multi[e.kind||"fallback"]).length;c<l;c+=1)if(e.tag.slice(0,d[c].tag.length)===d[c].tag){p=d[c];break}p||ii(e,"unknown tag !<"+e.tag+">"),null!==e.result&&p.kind!==e.kind&&ii(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+p.kind+'", not "'+e.kind+'"'),p.resolve(e.result,e.tag)?(e.result=p.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):ii(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||v}function vi(e){var t,i,r,o,a=e.position,n=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(o=e.input.charCodeAt(e.position))&&(li(e,!0,-1),o=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==o));){for(n=!0,o=e.input.charCodeAt(++e.position),t=e.position;0!==o&&!Bt(o);)o=e.input.charCodeAt(++e.position);for(r=[],(i=e.input.slice(t,e.position)).length<1&&ii(e,"directive name must not be less than one character in length");0!==o;){for(;Ut(o);)o=e.input.charCodeAt(++e.position);if(35===o){do{o=e.input.charCodeAt(++e.position)}while(0!==o&&!Ft(o));break}if(Ft(o))break;for(t=e.position;0!==o&&!Bt(o);)o=e.input.charCodeAt(++e.position);r.push(e.input.slice(t,e.position))}0!==o&&ci(e),Pt.call(oi,i)?oi[i](e,i,r):ri(e,'unknown document directive "'+i+'"')}li(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,li(e,!0,-1)):n&&ii(e,"directives end mark is expected"),gi(e,e.lineIndent-1,4,!1,!0),li(e,!0,-1),e.checkLineBreaks&&Dt.test(e.input.slice(a,e.position))&&ri(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&di(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,li(e,!0,-1)):e.position<e.length-1&&ii(e,"end of the stream or a document separator is expected")}function fi(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var i=new ei(e,t),r=e.indexOf("\0");for(-1!==r&&(i.position=r,ii(i,"null byte is not allowed in input")),i.input+="\0";32===i.input.charCodeAt(i.position);)i.lineIndent+=1,i.position+=1;for(;i.position<i.length-1;)vi(i);return i.documents}var bi={loadAll:function(e,t,i){null!==t&&"object"==typeof t&&void 0===i&&(i=t,t=null);var r=fi(e,i);if("function"!=typeof t)return r;for(var o=0,a=r.length;o<a;o+=1)t(r[o])},load:function(e,t){var i=fi(e,t);if(0!==i.length){if(1===i.length)return i[0];throw new Ve("expected a single document in the stream, but found more")}}},yi=Object.prototype.toString,xi=Object.prototype.hasOwnProperty,_i=65279,wi={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},$i=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],ki=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function Ci(e){var t,i,r;if(t=e.toString(16).toUpperCase(),e<=255)i="x",r=2;else if(e<=65535)i="u",r=4;else{if(!(e<=4294967295))throw new Ve("code point within a string may not be greater than 0xFFFFFFFF");i="U",r=8}return"\\"+i+qe.repeat("0",r-t.length)+t}function Si(e){this.schema=e.schema||Ot,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=qe.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var i,r,o,a,n,s,c;if(null===t)return{};for(i={},o=0,a=(r=Object.keys(t)).length;o<a;o+=1)n=r[o],s=String(t[n]),"!!"===n.slice(0,2)&&(n="tag:yaml.org,2002:"+n.slice(2)),(c=e.compiledTypeMap.fallback[n])&&xi.call(c.styleAliases,s)&&(s=c.styleAliases[s]),i[n]=s;return i}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Ai(e,t){for(var i,r=qe.repeat(" ",t),o=0,a=-1,n="",s=e.length;o<s;)-1===(a=e.indexOf("\n",o))?(i=e.slice(o),o=s):(i=e.slice(o,a+1),o=a+1),i.length&&"\n"!==i&&(n+=r),n+=i;return n}function Mi(e,t){return"\n"+qe.repeat(" ",e.indent*t)}function zi(e){return 32===e||9===e}function Ti(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&e!==_i||65536<=e&&e<=1114111}function Ei(e){return Ti(e)&&e!==_i&&13!==e&&10!==e}function Ii(e,t,i){var r=Ei(e),o=r&&!zi(e);return(i?r:r&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!o)||Ei(t)&&!zi(t)&&35===e||58===t&&o}function Oi(e,t){var i,r=e.charCodeAt(t);return r>=55296&&r<=56319&&t+1<e.length&&(i=e.charCodeAt(t+1))>=56320&&i<=57343?1024*(r-55296)+i-56320+65536:r}function Pi(e){return/^\n* /.test(e)}function ji(e,t,i,r,o,a,n,s){var c,l=0,d=null,p=!1,u=!1,m=-1!==r,h=-1,g=function(e){return Ti(e)&&e!==_i&&!zi(e)&&45!==e&&63!==e&&58!==e&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e&&35!==e&&38!==e&&42!==e&&33!==e&&124!==e&&61!==e&&62!==e&&39!==e&&34!==e&&37!==e&&64!==e&&96!==e}(Oi(e,0))&&function(e){return!zi(e)&&58!==e}(Oi(e,e.length-1));if(t||n)for(c=0;c<e.length;l>=65536?c+=2:c++){if(!Ti(l=Oi(e,c)))return 5;g=g&&Ii(l,d,s),d=l}else{for(c=0;c<e.length;l>=65536?c+=2:c++){if(10===(l=Oi(e,c)))p=!0,m&&(u=u||c-h-1>r&&" "!==e[h+1],h=c);else if(!Ti(l))return 5;g=g&&Ii(l,d,s),d=l}u=u||m&&c-h-1>r&&" "!==e[h+1]}return p||u?i>9&&Pi(e)?5:n?2===a?5:2:u?4:3:!g||n||o(e)?2===a?5:2:1}function Di(e,t,i,r,o){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==$i.indexOf(t)||ki.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var a=e.indent*Math.max(1,i),n=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-a),s=r||e.flowLevel>-1&&i>=e.flowLevel;switch(ji(t,s,e.indent,n,function(t){return function(e,t){var i,r;for(i=0,r=e.implicitTypes.length;i<r;i+=1)if(e.implicitTypes[i].resolve(t))return!0;return!1}(e,t)},e.quotingType,e.forceQuotes&&!r,o)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+Ni(t,e.indent)+Ri(Ai(t,a));case 4:return">"+Ni(t,e.indent)+Ri(Ai(function(e,t){var i,r,o=/(\n+)([^\n]*)/g,a=(s=e.indexOf("\n"),s=-1!==s?s:e.length,o.lastIndex=s,Li(e.slice(0,s),t)),n="\n"===e[0]||" "===e[0];var s;for(;r=o.exec(e);){var c=r[1],l=r[2];i=" "===l[0],a+=c+(n||i||""===l?"":"\n")+Li(l,t),n=i}return a}(t,n),a));case 5:return'"'+function(e){for(var t,i="",r=0,o=0;o<e.length;r>=65536?o+=2:o++)r=Oi(e,o),!(t=wi[r])&&Ti(r)?(i+=e[o],r>=65536&&(i+=e[o+1])):i+=t||Ci(r);return i}(t)+'"';default:throw new Ve("impossible error: invalid scalar style")}}()}function Ni(e,t){var i=Pi(e)?String(t):"",r="\n"===e[e.length-1];return i+(r&&("\n"===e[e.length-2]||"\n"===e)?"+":r?"":"-")+"\n"}function Ri(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function Li(e,t){if(""===e||" "===e[0])return e;for(var i,r,o=/ [^ ]/g,a=0,n=0,s=0,c="";i=o.exec(e);)(s=i.index)-a>t&&(r=n>a?n:s,c+="\n"+e.slice(a,r),a=r+1),n=s;return c+="\n",e.length-a>t&&n>a?c+=e.slice(a,n)+"\n"+e.slice(n+1):c+=e.slice(a),c.slice(1)}function Hi(e,t,i,r){var o,a,n,s="",c=e.tag;for(o=0,a=i.length;o<a;o+=1)n=i[o],e.replacer&&(n=e.replacer.call(i,String(o),n)),(Ui(e,t+1,n,!0,!0,!1,!0)||void 0===n&&Ui(e,t+1,null,!0,!0,!1,!0))&&(r&&""===s||(s+=Mi(e,t)),e.dump&&10===e.dump.charCodeAt(0)?s+="-":s+="- ",s+=e.dump);e.tag=c,e.dump=s||"[]"}function Fi(e,t,i){var r,o,a,n,s,c;for(a=0,n=(o=i?e.explicitTypes:e.implicitTypes).length;a<n;a+=1)if(((s=o[a]).instanceOf||s.predicate)&&(!s.instanceOf||"object"==typeof t&&t instanceof s.instanceOf)&&(!s.predicate||s.predicate(t))){if(i?s.multi&&s.representName?e.tag=s.representName(t):e.tag=s.tag:e.tag="?",s.represent){if(c=e.styleMap[s.tag]||s.defaultStyle,"[object Function]"===yi.call(s.represent))r=s.represent(t,c);else{if(!xi.call(s.represent,c))throw new Ve("!<"+s.tag+'> tag resolver accepts not "'+c+'" style');r=s.represent[c](t,c)}e.dump=r}return!0}return!1}function Ui(e,t,i,r,o,a,n){e.tag=null,e.dump=i,Fi(e,i,!1)||Fi(e,i,!0);var s,c=yi.call(e.dump),l=r;r&&(r=e.flowLevel<0||e.flowLevel>t);var d,p,u="[object Object]"===c||"[object Array]"===c;if(u&&(p=-1!==(d=e.duplicates.indexOf(i))),(null!==e.tag&&"?"!==e.tag||p||2!==e.indent&&t>0)&&(o=!1),p&&e.usedDuplicates[d])e.dump="*ref_"+d;else{if(u&&p&&!e.usedDuplicates[d]&&(e.usedDuplicates[d]=!0),"[object Object]"===c)r&&0!==Object.keys(e.dump).length?(!function(e,t,i,r){var o,a,n,s,c,l,d="",p=e.tag,u=Object.keys(i);if(!0===e.sortKeys)u.sort();else if("function"==typeof e.sortKeys)u.sort(e.sortKeys);else if(e.sortKeys)throw new Ve("sortKeys must be a boolean or a function");for(o=0,a=u.length;o<a;o+=1)l="",r&&""===d||(l+=Mi(e,t)),s=i[n=u[o]],e.replacer&&(s=e.replacer.call(i,n,s)),Ui(e,t+1,n,!0,!0,!0)&&((c=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?l+="?":l+="? "),l+=e.dump,c&&(l+=Mi(e,t)),Ui(e,t+1,s,!0,c)&&(e.dump&&10===e.dump.charCodeAt(0)?l+=":":l+=": ",d+=l+=e.dump));e.tag=p,e.dump=d||"{}"}(e,t,e.dump,o),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,i){var r,o,a,n,s,c="",l=e.tag,d=Object.keys(i);for(r=0,o=d.length;r<o;r+=1)s="",""!==c&&(s+=", "),e.condenseFlow&&(s+='"'),n=i[a=d[r]],e.replacer&&(n=e.replacer.call(i,a,n)),Ui(e,t,a,!1,!1)&&(e.dump.length>1024&&(s+="? "),s+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),Ui(e,t,n,!1,!1)&&(c+=s+=e.dump));e.tag=l,e.dump="{"+c+"}"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else if("[object Array]"===c)r&&0!==e.dump.length?(e.noArrayIndent&&!n&&t>0?Hi(e,t-1,e.dump,o):Hi(e,t,e.dump,o),p&&(e.dump="&ref_"+d+e.dump)):(!function(e,t,i){var r,o,a,n="",s=e.tag;for(r=0,o=i.length;r<o;r+=1)a=i[r],e.replacer&&(a=e.replacer.call(i,String(r),a)),(Ui(e,t,a,!1,!1)||void 0===a&&Ui(e,t,null,!1,!1))&&(""!==n&&(n+=","+(e.condenseFlow?"":" ")),n+=e.dump);e.tag=s,e.dump="["+n+"]"}(e,t,e.dump),p&&(e.dump="&ref_"+d+" "+e.dump));else{if("[object String]"!==c){if("[object Undefined]"===c)return!1;if(e.skipInvalid)return!1;throw new Ve("unacceptable kind of an object to dump "+c)}"?"!==e.tag&&Di(e,e.dump,t,a,l)}null!==e.tag&&"?"!==e.tag&&(s=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),s="!"===e.tag[0]?"!"+s:"tag:yaml.org,2002:"===s.slice(0,18)?"!!"+s.slice(18):"!<"+s+">",e.dump=s+" "+e.dump)}return!0}function Bi(e,t){var i,r,o=[],a=[];for(Qi(e,o,a),i=0,r=a.length;i<r;i+=1)t.duplicates.push(o[a[i]]);t.usedDuplicates=new Array(r)}function Qi(e,t,i){var r,o,a;if(null!==e&&"object"==typeof e)if(-1!==(o=t.indexOf(e)))-1===i.indexOf(o)&&i.push(o);else if(t.push(e),Array.isArray(e))for(o=0,a=e.length;o<a;o+=1)Qi(e[o],t,i);else for(o=0,a=(r=Object.keys(e)).length;o<a;o+=1)Qi(e[r[o]],t,i)}function Gi(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var qi={Type:tt,Schema:ot,FAILSAFE_SCHEMA:ct,JSON_SCHEMA:bt,CORE_SCHEMA:yt,DEFAULT_SCHEMA:Ot,load:bi.load,loadAll:bi.loadAll,dump:{dump:function(e,t){var i=new Si(t=t||{});i.noRefs||Bi(e,i);var r=e;return i.replacer&&(r=i.replacer.call({"":r},"",r)),Ui(i,0,r,!0,!0)?i.dump+"\n":""}}.dump,YAMLException:Ve,types:{binary:Ct,float:ft,map:st,null:lt,pairs:Tt,set:It,timestamp:wt,bool:dt,int:ht,merge:$t,omap:Mt,seq:nt,str:at},safeLoad:Gi("safeLoad","load"),safeLoadAll:Gi("safeLoadAll","loadAll"),safeDump:Gi("safeDump","dump")};function Wi(e){try{return qi.dump(e,{indent:2,lineWidth:120,noRefs:!0,sortKeys:!1})}catch{return""}}function Yi(e){try{return qi.load(e)}catch{return null}}class Vi{constructor(){this.suppressSync=!1}toYaml(e){const{type:t,...i}=e;return Wi(i)}fromYaml(e,t){const i=Yi(e);return i?{...i,type:t.type}:null}isSuppressed(){return this.suppressSync}suppress(e){this.suppressSync=!0;try{e()}finally{this.suppressSync=!1}}}const Ki=l`
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
`;var Ji=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Zi=class extends he{constructor(){super(...arguments),this._yaml="",this._error="",this._configSync=new Vi,this._suppressUpdate=!1}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e,this._suppressUpdate||(this._yaml=this._configSync.toYaml(e.config),this._error="")}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){return V`
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

        ${this._error?V`<div class="mc-yaml-error">${this._error}</div>`:J}
      </div>
    `}_onYamlInput(e){const t=e.target.value;this._yaml=t,this._suppressUpdate=!0;try{const e=this._configSync.fromYaml(t,this._editorState.config);e?(this._error="",this.stateManager.updateConfig(e)):this._error="Invalid YAML structure"}catch(e){this._error=e instanceof Error?e.message:"Parse error"}finally{this._suppressUpdate=!1}}};Zi.styles=[Re,Ki],Ji([ye({attribute:!1})],Zi.prototype,"stateManager",void 0),Ji([ye({attribute:!1})],Zi.prototype,"hass",void 0),Ji([xe()],Zi.prototype,"_yaml",void 0),Ji([xe()],Zi.prototype,"_error",void 0),Ji([xe()],Zi.prototype,"_editorState",void 0),Zi=Ji([ve("mc-yaml-editor")],Zi);const Xi=l`
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
`;var er=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let tr=class extends he{constructor(){super(...arguments),this._expandedNodes=new Set(["root"])}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e}))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.()}render(){if(!this._editorState)return V``;const{config:e,selectedPath:t}=this._editorState;return e.rows.length?V`
      <div class="mc-tree">
        ${e.rows.map((e,i)=>this._renderRowNode(e,i,t))}
      </div>
    `:V`<div class="mc-tree-empty">No rows. Add a row to get started.</div>`}_renderRowNode(e,t,i){const r=`row-${t}`,o=this._expandedNodes.has(r);return V`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${()=>this._toggleNode(r)}>
          <span class="mc-tree-toggle ${o?"open":""}">&#9654;</span>
          <span class="mc-tree-icon">
            <ha-icon icon="mdi:view-sequential" style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">Row ${t+1}</span>
          <span class="mc-tree-type">${e.layout||"1"}</span>
          ${e.display?.conditions?.length?V`<span class="mc-tree-badge condition">C</span>`:J}
          <span class="mc-tree-actions">
            <button class="mc-tree-action-btn" @click=${e=>{e.stopPropagation(),this.stateManager.deleteRow(t)}} title="Delete">&times;</button>
          </span>
        </div>
        ${o?V`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.columns.map((e,r)=>this._renderColumnNode(e,t,r,i))}
              </div>
            `:J}
      </div>
    `}_renderColumnNode(e,t,i,r){const o=`col-${t}-${i}`,a=this._expandedNodes.has(o);return V`
      <div class="mc-tree-node">
        <div class="mc-tree-row" @click=${()=>this._toggleNode(o)}>
          <span class="mc-tree-toggle ${a?"open":""}">&#9654;</span>
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
        ${a?V`
              <div class="mc-tree-children" style="padding-left: 20px">
                ${e.modules.map((e,o)=>this._renderModuleNode(e,t,i,o,r))}
                ${0===e.modules.length?V`<div style="padding:4px 8px;font-size:0.75rem;color:var(--secondary-text-color)">Empty</div>`:J}
              </div>
            `:J}
      </div>
    `}_renderModuleNode(e,t,i,r,o){const a=o?.rowIndex===t&&o?.columnIndex===i&&o?.moduleIndex===r,n=we.get(e.type),s=e.display?.conditions?.length,c=e.actions?.tap_action||e.actions?.hold_action||e.actions?.double_tap_action;return V`
      <div class="mc-tree-node">
        <div
          class="mc-tree-row ${a?"selected":""}"
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
            <ha-icon icon=${n?.metadata.icon||"mdi:puzzle"} style="--mdc-icon-size:16px"></ha-icon>
          </span>
          <span class="mc-tree-label">${n?.metadata.name||e.type}</span>
          <span class="mc-tree-type">${e.type}</span>
          ${s?V`<span class="mc-tree-badge condition">C</span>`:J}
          ${c?V`<span class="mc-tree-badge action">A</span>`:J}
          <span class="mc-tree-actions">
            <button
              class="mc-tree-action-btn"
              @click=${e=>{e.stopPropagation(),this.stateManager.deleteModule(t,i,r)}}
              title="Delete"
            >&times;</button>
          </span>
        </div>
      </div>
    `}_toggleNode(e){this._expandedNodes.has(e)?this._expandedNodes.delete(e):this._expandedNodes.add(e),this.requestUpdate()}_onDragStart(e,t,i,r){this._dragData={ri:t,ci:i,mi:r},e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify({ri:t,ci:i,mi:r})))}_onDragOver(e){e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move")}_onDrop(e,t,i,r){if(e.preventDefault(),!this._dragData)return;const{ri:o,ci:a,mi:n}=this._dragData;o===t&&a===i&&n===r||(this.stateManager.moveModule(o,a,n,t,i,r),this._dragData=void 0)}};tr.styles=[Re,Xi],er([ye({attribute:!1})],tr.prototype,"stateManager",void 0),er([ye({attribute:!1})],tr.prototype,"hass",void 0),er([xe()],tr.prototype,"_editorState",void 0),er([xe()],tr.prototype,"_expandedNodes",void 0),tr=er([ve("mc-tree-editor")],tr);const ir=l`
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
`;var rr=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let or=class extends he{constructor(){super(...arguments),this._searchQuery=""}render(){const e=this._searchQuery?we.search(this._searchQuery):we.getAll(),t=new Map;for(const i of r){const r=e.filter(e=>e.metadata.category===i).map(e=>e.metadata);r.length>0&&t.set(i,r)}return V`
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
    `}_onSelect(e){this.dispatchEvent(new CustomEvent("module-selected",{bubbles:!0,composed:!0,detail:{type:e.type}}))}_onClose(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_onOverlayClick(){this._onClose()}};or.styles=ir,rr([xe()],or.prototype,"_searchQuery",void 0),or=rr([ve("mc-module-selector")],or);var ar=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};const nr="magic-card-saved-colors",sr=["#ffffff","#f3f4f6","#d1d5db","#9ca3af","#6b7280","#374151","#1f2937","#000000","#ef4444","#f97316","#eab308","#22c55e","#14b8a6","#3b82f6","#8b5cf6","#ec4899","#fecaca","#fed7aa","#fef08a","#bbf7d0","#99f6e4","#bfdbfe","#ddd6fe","#fbcfe8","var(--primary-color)","var(--accent-color)","var(--primary-text-color)","var(--secondary-text-color)","var(--card-background-color)","var(--divider-color)","var(--success-color)","var(--error-color)"];let cr=class extends he{constructor(){super(...arguments),this.value="",this.label="",this._isOpen=!1,this._hsva={h:0,s:100,v:100,a:1},this._savedColors=[],this._hexInput="",this._dragging=null,this._handleAreaPointerDown=e=>{this._dragging="area",e.target.setPointerCapture(e.pointerId),this._updateArea(e)},this._handleHuePointerDown=e=>{this._dragging="hue",e.target.setPointerCapture(e.pointerId),this._updateHue(e)},this._handleOpacityPointerDown=e=>{this._dragging="opacity",e.target.setPointerCapture(e.pointerId),this._updateOpacity(e)},this._handlePointerMove=e=>{this._dragging&&("area"===this._dragging?this._updateArea(e):"hue"===this._dragging?this._updateHue(e):"opacity"===this._dragging&&this._updateOpacity(e))},this._handlePointerUp=()=>{this._dragging=null}}connectedCallback(){super.connectedCallback(),this._loadSavedColors(),this._parseValue(this.value)}updated(e){e.has("value")&&!this._isOpen&&this._parseValue(this.value)}_loadSavedColors(){try{const e=localStorage.getItem(nr);this._savedColors=e?JSON.parse(e):[]}catch{this._savedColors=[]}}_saveSavedColors(){try{localStorage.setItem(nr,JSON.stringify(this._savedColors))}catch{}}_parseValue(e){if(!e)return this._hsva={h:0,s:0,v:100,a:1},void(this._hexInput="");if(e.startsWith("var("))return void(this._hexInput=e);const t=this._colorToHsva(e);t?(this._hsva=t,this._hexInput=this._hsvaToHex(t)):this._hexInput=e}_colorToHsva(e){const t=e.match(/^#([0-9a-f]{3,8})$/i);if(t){let e=t[1];3===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),4===e.length&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]);const i=parseInt(e.slice(0,2),16)/255,r=parseInt(e.slice(2,4),16)/255,o=parseInt(e.slice(4,6),16)/255,a=8===e.length?parseInt(e.slice(6,8),16)/255:1;return this._rgbToHsva(i,r,o,a)}const i=e.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);if(i){const e=parseInt(i[1])/255,t=parseInt(i[2])/255,r=parseInt(i[3])/255,o=i[4]?parseFloat(i[4]):1;return this._rgbToHsva(e,t,r,o)}return null}_rgbToHsva(e,t,i,r){const o=Math.max(e,t,i),a=o-Math.min(e,t,i),n=100*o,s=0===o?0:a/o*100;let c=0;if(0!==a)switch(o){case e:c=60*((t-i)/a+(t<i?6:0));break;case t:c=60*((i-e)/a+2);break;case i:c=60*((e-t)/a+4)}return{h:c,s,v:n,a:r}}_hsvaToRgb(e){const t=e.h/60,i=e.s/100,r=e.v/100,o=r*i,a=o*(1-Math.abs(t%2-1)),n=r-o;let s=0,c=0,l=0;return t<1?(s=o,c=a):t<2?(s=a,c=o):t<3?(c=o,l=a):t<4?(c=a,l=o):t<5?(s=a,l=o):(s=o,l=a),{r:Math.round(255*(s+n)),g:Math.round(255*(c+n)),b:Math.round(255*(l+n)),a:e.a}}_hsvaToHex(e){const t=this._hsvaToRgb(e),i="#"+t.r.toString(16).padStart(2,"0")+t.g.toString(16).padStart(2,"0")+t.b.toString(16).padStart(2,"0");return e.a<1?i+Math.round(255*e.a).toString(16).padStart(2,"0"):i}_hsvaToRgbaString(e){const t=this._hsvaToRgb(e);return e.a<1?`rgba(${t.r}, ${t.g}, ${t.b}, ${e.a.toFixed(2)})`:`rgb(${t.r}, ${t.g}, ${t.b})`}_getCurrentColor(){return this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToHex(this._hsva)}_emitChange(){const e=this._getCurrentColor();this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_openModal(){this._parseValue(this.value),this._isOpen=!0}_closeModal(){this._isOpen=!1}_handleSave(){this._emitChange(),this._closeModal()}_updateArea(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),r=Math.max(0,Math.min(1,(e.clientY-t.top)/t.height));this._hsva={...this._hsva,s:100*i,v:100*(1-r)},this._hexInput=this._hsvaToHex(this._hsva)}_updateHue(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._hsva={...this._hsva,h:360*i},this._hexInput=this._hsvaToHex(this._hsva)}_updateOpacity(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._hsva={...this._hsva,a:i},this._hexInput=this._hsvaToHex(this._hsva)}_handleHexInput(e){const t=e.target.value;this._hexInput=t;const i=this._colorToHsva(t);i&&(this._hsva=i)}_selectPreset(e){if(e.startsWith("var("))this._hexInput=e;else{const t=this._colorToHsva(e);t&&(this._hsva=t,this._hexInput=this._hsvaToHex(t))}}_addSavedColor(){const e=this._getCurrentColor();this._savedColors.includes(e)||(this._savedColors=[e,...this._savedColors].slice(0,12),this._saveSavedColors())}_removeSavedColor(e,t){t.stopPropagation(),this._savedColors=this._savedColors.filter(t=>t!==e),this._saveSavedColors()}_handleTextInput(e){const t=e.target.value;this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){const e=this.value||"transparent";return V`
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
      ${this._isOpen?this._renderModal():J}
    `}_renderModal(){const e=this._hsvaToRgb(this._hsva),t=`hsl(${this._hsva.h}, 100%, 50%)`,i=this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToRgbaString(this._hsva);return V`
      <div class="mc-modal-overlay" @click=${this._closeModal}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-modal-header">
            <span class="mc-modal-title">Color Picker</span>
            <div>
                <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
                <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            </div>
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
                ${sr.map(e=>V`
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
        </div>
      </div>
    `}};cr.styles=l`
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

    .action-btn {
        border-radius: 6px;
        padding: 8px 12px;
        border: none;
        cursor: pointer;
        font-weight: 500;
    }

    .save-btn {
        background-color: #4CAF50;
        color: white;
    }

    .cancel-btn {
        background-color: #f44336;
        color: white;
    }
  `,ar([ye({type:String})],cr.prototype,"value",void 0),ar([ye({type:String})],cr.prototype,"label",void 0),ar([xe()],cr.prototype,"_isOpen",void 0),ar([xe()],cr.prototype,"_hsva",void 0),ar([xe()],cr.prototype,"_savedColors",void 0),ar([xe()],cr.prototype,"_hexInput",void 0),cr=ar([ve("mc-color-picker")],cr);var lr=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};const dr=["px","em","rem","%","vw","vh","auto"];let pr=class extends he{constructor(){super(...arguments),this.value="",this.label="",this.placeholder=""}_parseValue(){if(!this.value)return{number:"",unit:"px"};if("auto"===this.value)return{number:"",unit:"auto"};const e=this.value.match(/^(-?[\d.]+)\s*(px|em|rem|%|vw|vh)?$/);return e?{number:e[1],unit:e[2]||"px"}:{number:this.value,unit:"px"}}_emitChange(e,t){let i="";"auto"===t?i="auto":e&&(i=`${e}${t}`),this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:i}}))}render(){const{number:e,unit:t}=this._parseValue();return V`
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
          ${dr.map(e=>V`
            <option value=${e} ?selected=${t===e}>${e}</option>
          `)}
        </select>
      </div>
    `}};pr.styles=l`
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
      background: var(--card-background-color, #e5e7eb);
      color: var(--primary-text-color, #1a1a2e);
      outline: none;
      cursor: pointer;
      min-width: 55px;
    }

    .mc-unit-select:focus {
      border-color: var(--primary-color, #6366f1);
    }
  `,lr([ye({type:String})],pr.prototype,"value",void 0),lr([ye({type:String})],pr.prototype,"label",void 0),lr([ye({type:String})],pr.prototype,"placeholder",void 0),pr=lr([ve("mc-unit-field")],pr);var ur=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let mr=class extends he{constructor(){super(...arguments),this.value="",this.label="Entity",this.domain="",this._showModal=!1,this._searchQuery="",this._selectedEntityId=""}_openModal(){this._selectedEntityId=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_handleSave(){this.value=this._selectedEntityId,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedEntityId},bubbles:!0,composed:!0})),this._closeModal()}_selectEntity(e){this._selectedEntityId=e,this._searchQuery=e}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getFilteredEntities(){if(!this.hass)return[];const e=Object.entries(this.hass.states).filter(([e])=>!(this.domain&&!e.startsWith(this.domain+"."))).map(([e,t])=>({id:e,name:t.attributes.friendly_name||e,state:this.hass.formatEntityState(t),icon:t.attributes.icon||this._domainIcon(e.split(".")[0])})).filter(e=>{if(!this._searchQuery)return!0;const t=this._searchQuery.toLowerCase();return e.id.toLowerCase().includes(t)||e.name.toLowerCase().includes(t)}).sort((e,t)=>e.name.localeCompare(t.name));return e.slice(0,100)}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",sensor:"mdi:eye",binary_sensor:"mdi:checkbox-marked-circle",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",person:"mdi:account",weather:"mdi:weather-partly-cloudy",sun:"mdi:white-balance-sunny",vacuum:"mdi:robot-vacuum",water_heater:"mdi:water-boiler",humidifier:"mdi:air-humidifier",alarm_control_panel:"mdi:shield-home"}[e]||"mdi:help-circle"}render(){return V`
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
            <div class="mc-picker-header-start">
                <ha-icon icon="mdi:form-select"></ha-icon>
                <span class="mc-picker-title">Select Entity</span>
            </div>
            <div>
                <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
                <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            </div>
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
    `}};mr.styles=l`
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
        justify-content: space-between;
        gap: 10px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }
    
    .mc-picker-header-start {
        display: flex;
        align-items: center;
        gap: 10px;
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

    .action-btn {
        border-radius: 6px;
        padding: 8px 12px;
        border: none;
        cursor: pointer;
        font-weight: 500;
    }

    .save-btn {
        background-color: #4CAF50;
        color: white;
    }

    .cancel-btn {
        background-color: #f44336;
        color: white;
    }
  `,ur([ye({attribute:!1})],mr.prototype,"hass",void 0),ur([ye({type:String})],mr.prototype,"value",void 0),ur([ye({type:String})],mr.prototype,"label",void 0),ur([ye({type:String})],mr.prototype,"domain",void 0),ur([xe()],mr.prototype,"_showModal",void 0),ur([xe()],mr.prototype,"_searchQuery",void 0),ur([xe()],mr.prototype,"_selectedEntityId",void 0),mr=ur([ve("mc-entity-picker")],mr);var hr=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let gr=class extends he{constructor(){super(...arguments),this.value="",this.label="Service",this._showModal=!1,this._searchQuery=""}_openModal(){this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_selectService(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getServices(){if(!this.hass?.services)return[];const e=[];for(const[t,i]of Object.entries(this.hass.services))for(const[r,o]of Object.entries(i))e.push({domain:t,service:r,name:o.name||r,description:o.description||""});return e}_getFilteredServices(){const e=this._getServices(),t=this._searchQuery.toLowerCase(),i=t?e.filter(e=>e.domain.includes(t)||e.service.includes(t)||e.name.toLowerCase().includes(t)):e,r=new Map;for(const e of i)r.has(e.domain)||r.set(e.domain,[]),r.get(e.domain).push(e);const o=Array.from(r.entries()).sort(([e],[t])=>e.localeCompare(t)).slice(0,20).map(([e,t])=>({domain:e,services:t.sort((e,t)=>e.service.localeCompare(t.service))}));return o}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",notify:"mdi:bell",tts:"mdi:speaker-message",homeassistant:"mdi:home-assistant",persistent_notification:"mdi:bell-ring",logbook:"mdi:book-open",recorder:"mdi:database",system_log:"mdi:file-document",frontend:"mdi:view-dashboard",group:"mdi:group",vacuum:"mdi:robot-vacuum",counter:"mdi:counter",timer:"mdi:timer"}[e]||"mdi:cog"}render(){return V`
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
    `}};gr.styles=l`
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
  `,hr([ye({attribute:!1})],gr.prototype,"hass",void 0),hr([ye({type:String})],gr.prototype,"value",void 0),hr([ye({type:String})],gr.prototype,"label",void 0),hr([xe()],gr.prototype,"_showModal",void 0),hr([xe()],gr.prototype,"_searchQuery",void 0),gr=hr([ve("mc-service-picker")],gr);var vr=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let fr=class extends he{constructor(){super(...arguments),this.value="",this.label="Icon",this._showModal=!1,this._searchQuery="",this._selectedIcon=""}_openModal(){this._selectedIcon=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_handleSave(){this.value=this._selectedIcon,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedIcon},bubbles:!0,composed:!0})),this._closeModal()}_selectIcon(e){this._selectedIcon=e.detail.value,this._searchQuery=e.detail.value}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}render(){return V`
      <div class="mc-picker-row">
        ${this.value?V`<div class="mc-picker-preview"><ha-icon .icon=${this.value}></ha-icon></div>`:""}
        <input
          type="text"
          class="mc-picker-input"
          .value=${this.value}
          placeholder="mdi:icon"
          @input=${this._onInputChange}
        />
        <button class="mc-picker-btn" @click=${this._openModal}>
          <ha-icon icon="mdi:emoticon-outline"></ha-icon>
          Select
        </button>
      </div>

      ${this._showModal?this._renderModal():""}
    `}_handleSearchChange(e){this._searchQuery=e.target.value}_renderModal(){return V`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header">
            <div class="mc-picker-header-start">
                <ha-icon icon="mdi:emoticon-outline"></ha-icon>
                <span class="mc-picker-title">Select Icon</span>
            </div>
            <div>
                <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
                <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            </div>
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
        </div>
      </div>
    `}};fr.styles=l`
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
      border-radius: 0 6px 6px 0;
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
    
    .mc-picker-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        flex-shrink: 0;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-right: none;
        border-radius: 6px 0 0 6px;
        color: var(--primary-color, #6366f1);
        --mdc-icon-size: 22px;
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
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        width: 800px;
        max-width: 100%;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .mc-picker-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
        background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }
    
    .mc-picker-header-start {
        display: flex;
        align-items: center;
        gap: 10px;
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

    .action-btn {
        border-radius: 6px;
        padding: 8px 12px;
        border: none;
        cursor: pointer;
        font-weight: 500;
    }

    .save-btn {
        background-color: #4CAF50;
        color: white;
    }

    .cancel-btn {
        background-color: #f44336;
        color: white;
    }
  `,vr([ye({attribute:!1})],fr.prototype,"hass",void 0),vr([ye({type:String})],fr.prototype,"value",void 0),vr([ye({type:String})],fr.prototype,"label",void 0),vr([xe()],fr.prototype,"_showModal",void 0),vr([xe()],fr.prototype,"_searchQuery",void 0),vr([xe()],fr.prototype,"_selectedIcon",void 0),fr=vr([ve("mc-icon-picker")],fr);var br=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let yr=class extends he{constructor(){super(...arguments),this.value="",this.mediaType="",this._showModal=!1,this._searchQuery="",this._items=[],this._loading=!1,this._error="",this._breadcrumbs=[],this._selectedItem=null}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_openModal(){this._showModal=!0,this._searchQuery="",this._selectedItem=null,this._breadcrumbs=[{title:"Media",media_content_id:""}],this._browseMedia("")}_closeModal(){this._showModal=!1,this._items=[],this._error=""}async _browseMedia(e){if(this.hass){this._loading=!0,this._error="",this._selectedItem=null;try{const t={type:"media_source/browse_media"};e&&(t.media_content_id=e);const i=await this.hass.callWS(t);this._items=i.children||[]}catch{this._error="No media sources available",this._items=[]}this._loading=!1}}_navigateToFolder(e){this._breadcrumbs=[...this._breadcrumbs,{title:e.title,media_content_id:e.media_content_id}],this._searchQuery="",this._browseMedia(e.media_content_id)}_navigateToBreadcrumb(e){const t=this._breadcrumbs[e];this._breadcrumbs=this._breadcrumbs.slice(0,e+1),this._searchQuery="",this._browseMedia(t.media_content_id)}_selectItem(e){this._selectedItem=e}async _handleSave(){if(this._selectedItem&&this.hass){try{const e=await this.hass.callWS({type:"media_source/resolve_media",media_content_id:this._selectedItem.media_content_id});this.value=e.url,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e.url},bubbles:!0,composed:!0}))}catch{this.value=this._selectedItem.media_content_id,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedItem.media_content_id},bubbles:!0,composed:!0}))}this._closeModal()}else this._closeModal()}_getFilteredItems(){let e=this._items;if(this.mediaType&&(e=e.filter(e=>!!e.can_expand||this._matchesMediaType(e.media_class))),this._searchQuery){const t=this._searchQuery.toLowerCase();e=e.filter(e=>e.title.toLowerCase().includes(t))}return e}_matchesMediaType(e){const t=e.toLowerCase();return"image"===this.mediaType?"image"===t||"photo"===t||"picture"===t:"video"!==this.mediaType||("video"===t||"movie"===t||"clip"===t)}_getItemIcon(e){if(e.can_expand)return"mdi:folder";const t=e.media_class.toLowerCase();return"image"===t||"photo"===t||"picture"===t?"mdi:image":"video"===t||"movie"===t||"clip"===t?"mdi:video":"music"===t||"audio"===t||"song"===t?"mdi:music":"mdi:file"}render(){return V`
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
    `}_renderModal(){const e=this._getFilteredItems();return V`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header">
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:folder-search"></ha-icon>
              <span class="mc-picker-title">Select Media</span>
            </div>
            <div>
              <button class="action-btn save-btn" @click=${this._handleSave} ?disabled=${!this._selectedItem}>Save</button>
              <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
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
            ${this._loading?V`<div class="mc-picker-loading">Loading...</div>`:this._error?V`<div class="mc-picker-empty">${this._error}</div>`:e.length>0?e.map(e=>this._renderItem(e)):V`<div class="mc-picker-empty">No items found</div>`}
          </div>
        </div>
      </div>
    `}_renderBreadcrumbs(){return this._breadcrumbs.length<=1?V``:V`
      <div class="mc-picker-breadcrumbs">
        ${this._breadcrumbs.map((e,t)=>t===this._breadcrumbs.length-1?V`<span class="mc-breadcrumb-current">${e.title}</span>`:V`
            <button class="mc-breadcrumb" @click=${()=>this._navigateToBreadcrumb(t)}>${e.title}</button>
            <span class="mc-breadcrumb-sep">&rsaquo;</span>
          `)}
      </div>
    `}_renderItem(e){const t=this._selectedItem?.media_content_id===e.media_content_id,i=this._getItemIcon(e);return V`
      <div class="mc-picker-item ${t?"selected":""}" @click=${()=>{e.can_expand?this._navigateToFolder(e):e.can_play&&this._selectItem(e)}}>
        ${e.thumbnail?V`<img class="mc-picker-item-thumb" src=${e.thumbnail} alt="" />`:V`<div class="mc-picker-item-icon"><ha-icon icon=${i}></ha-icon></div>`}
        <div class="mc-picker-item-content">
          <div class="mc-picker-item-name">${e.title}</div>
        </div>
        ${e.can_expand?V`<ha-icon icon="mdi:chevron-right" style="color:var(--secondary-text-color);--mdc-icon-size:20px"></ha-icon>`:V`<span class="mc-picker-item-badge">${e.media_class}</span>`}
      </div>
    `}};yr.styles=l`
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
      justify-content: space-between;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-header-start {
      display: flex;
      align-items: center;
      gap: 10px;
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

    .mc-picker-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      font-size: 0.8125rem;
      overflow-x: auto;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .mc-breadcrumb {
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      border: none;
      background: none;
      padding: 2px 4px;
      border-radius: 4px;
      font-size: 0.8125rem;
      white-space: nowrap;
    }

    .mc-breadcrumb:hover {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
    }

    .mc-breadcrumb-sep {
      color: var(--secondary-text-color, #757575);
    }

    .mc-breadcrumb-current {
      color: var(--primary-text-color, #212121);
      font-weight: 500;
      padding: 2px 4px;
      white-space: nowrap;
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
      padding: 10px 16px;
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

    .mc-picker-item.selected {
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 15%, transparent);
    }

    .mc-picker-item-thumb {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
      background: var(--divider-color, #e0e0e0);
      flex-shrink: 0;
    }

    .mc-picker-item-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 12%, transparent);
      border-radius: 6px;
      color: var(--primary-color, #03a9f4);
      --mdc-icon-size: 20px;
      flex-shrink: 0;
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

    .mc-picker-item-badge {
      font-size: 0.6875rem;
      color: var(--secondary-text-color, #757575);
      background: var(--divider-color, #e0e0e0);
      padding: 2px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .mc-picker-empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
    }

    .mc-picker-loading {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
    }

    .action-btn {
      border-radius: 6px;
      padding: 8px 12px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }

    .save-btn {
      background-color: #4CAF50;
      color: white;
    }

    .cancel-btn {
      background-color: #f44336;
      color: white;
    }
  `,br([ye({attribute:!1})],yr.prototype,"hass",void 0),br([ye({type:String})],yr.prototype,"value",void 0),br([ye({type:String})],yr.prototype,"mediaType",void 0),br([xe()],yr.prototype,"_showModal",void 0),br([xe()],yr.prototype,"_searchQuery",void 0),br([xe()],yr.prototype,"_items",void 0),br([xe()],yr.prototype,"_loading",void 0),br([xe()],yr.prototype,"_error",void 0),br([xe()],yr.prototype,"_breadcrumbs",void 0),br([xe()],yr.prototype,"_selectedItem",void 0),yr=br([ve("mc-media-picker")],yr);var xr=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};const _r={general:{label:"General",icon:"mdi:cog"},actions:{label:"Actions",icon:"mdi:gesture-tap"},conditions:{label:"Conditions",icon:"mdi:filter-outline"},design:{label:"Design",icon:"mdi:palette"}};let wr=class extends he{constructor(){super(...arguments),this.open=!1,this._activeTab="general"}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}render(){if(!this.open||!this.module)return V``;const e=we.get(this.module.type);if(!e)return V``;const t=e.getAvailableTabs(),i=t.includes(this._activeTab)?this._activeTab:t[0];return V`
      <div class="mc-modal-overlay" @click=${this._close}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-modal-header">
            <ha-icon icon=${e.metadata.icon}></ha-icon>
            <span class="mc-modal-title">${e.metadata.name} Settings</span>
            <button class="mc-modal-close" @click=${this._close}>&times;</button>
          </div>

          <div class="mc-modal-tabs">
            ${t.map(e=>{const t=_r[e];return V`
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
    `}_renderTabContent(e,t){if(!this.module||!this.onChange)return V`<p>Loading...</p>`;const i=this.onChange;switch(e){case"general":return t.renderGeneralTab(this.module,this.hass,i);case"actions":return t.renderActionsTab?t.renderActionsTab(this.module,this.hass,i):V`<p>No actions available</p>`;case"conditions":return t.renderConditionsTab?t.renderConditionsTab(this.module,this.hass,i):V`<p>No conditions available</p>`;case"design":return t.renderDesignTab?t.renderDesignTab(this.module,this.hass,i):V`<p>No design options</p>`}}};wr.styles=[Re,l`
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
  `],xr([ye({attribute:!1})],wr.prototype,"module",void 0),xr([ye({attribute:!1})],wr.prototype,"hass",void 0),xr([ye({type:Boolean})],wr.prototype,"open",void 0),xr([ye({attribute:!1})],wr.prototype,"onChange",void 0),xr([xe()],wr.prototype,"_activeTab",void 0),wr=xr([ve("mc-settings-modal")],wr);var $r=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};const kr=[{type:"alarm-panel",name:"Alarm Panel",description:"Alarm control panel",icon:"mdi:shield-home",category:"built-in"},{type:"area",name:"Area",description:"Show area devices and entities",icon:"mdi:texture-box",category:"built-in"},{type:"button",name:"Button",description:"Action button for an entity",icon:"mdi:gesture-tap-button",category:"built-in"},{type:"calendar",name:"Calendar",description:"Calendar display",icon:"mdi:calendar",category:"built-in"},{type:"conditional",name:"Conditional",description:"Show cards based on conditions",icon:"mdi:eye-check",category:"built-in"},{type:"entities",name:"Entities",description:"List of entity rows",icon:"mdi:format-list-bulleted",category:"built-in"},{type:"entity",name:"Entity",description:"Single entity display",icon:"mdi:card-text",category:"built-in"},{type:"entity-filter",name:"Entity Filter",description:"Filtered entity list",icon:"mdi:filter",category:"built-in"},{type:"gauge",name:"Gauge",description:"Gauge visualization",icon:"mdi:gauge",category:"built-in"},{type:"glance",name:"Glance",description:"Quick overview of entities",icon:"mdi:eye",category:"built-in"},{type:"grid",name:"Grid",description:"Grid layout of cards",icon:"mdi:view-grid",category:"built-in"},{type:"heading",name:"Heading",description:"Section heading",icon:"mdi:format-header-1",category:"built-in"},{type:"history-graph",name:"History Graph",description:"Entity history graph",icon:"mdi:chart-line",category:"built-in"},{type:"horizontal-stack",name:"Horizontal Stack",description:"Stack cards horizontally",icon:"mdi:arrow-split-vertical",category:"built-in"},{type:"humidifier",name:"Humidifier",description:"Humidifier control",icon:"mdi:air-humidifier",category:"built-in"},{type:"iframe",name:"iFrame",description:"Embed a webpage",icon:"mdi:web",category:"built-in"},{type:"light",name:"Light",description:"Light control card",icon:"mdi:lightbulb",category:"built-in"},{type:"logbook",name:"Logbook",description:"Entity logbook entries",icon:"mdi:book-open-variant",category:"built-in"},{type:"map",name:"Map",description:"Map with entity locations",icon:"mdi:map",category:"built-in"},{type:"markdown",name:"Markdown",description:"Rendered Markdown text",icon:"mdi:language-markdown",category:"built-in"},{type:"media-control",name:"Media Control",description:"Media player controls",icon:"mdi:cast",category:"built-in"},{type:"picture",name:"Picture",description:"Display an image",icon:"mdi:image",category:"built-in"},{type:"picture-elements",name:"Picture Elements",description:"Image with interactive elements",icon:"mdi:image-edit",category:"built-in"},{type:"picture-entity",name:"Picture Entity",description:"Entity with background image",icon:"mdi:image-area",category:"built-in"},{type:"picture-glance",name:"Picture Glance",description:"Image with entity icons",icon:"mdi:image-multiple",category:"built-in"},{type:"plant-status",name:"Plant Status",description:"Plant monitor display",icon:"mdi:flower",category:"built-in"},{type:"sensor",name:"Sensor",description:"Sensor with graph",icon:"mdi:eye",category:"built-in"},{type:"shopping-list",name:"Shopping List",description:"Shopping list card",icon:"mdi:cart",category:"built-in"},{type:"statistic",name:"Statistic",description:"Long-term statistic",icon:"mdi:chart-box",category:"built-in"},{type:"statistics-graph",name:"Statistics Graph",description:"Statistics graph",icon:"mdi:chart-bell-curve",category:"built-in"},{type:"thermostat",name:"Thermostat",description:"Climate control card",icon:"mdi:thermostat",category:"built-in"},{type:"tile",name:"Tile",description:"Compact tile card",icon:"mdi:square-rounded",category:"built-in"},{type:"todo-list",name:"To-Do List",description:"To-do list card",icon:"mdi:checkbox-marked-outline",category:"built-in"},{type:"vertical-stack",name:"Vertical Stack",description:"Stack cards vertically",icon:"mdi:arrow-split-horizontal",category:"built-in"},{type:"weather-forecast",name:"Weather Forecast",description:"Weather forecast card",icon:"mdi:weather-partly-cloudy",category:"built-in"}];let Cr=class extends he{constructor(){super(...arguments),this.value="",this._showModal=!1,this._searchQuery="",this._selectedCardType=""}_openModal(){this._selectedCardType=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_handleSave(){this.value=this._selectedCardType,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedCardType},bubbles:!0,composed:!0})),this._closeModal()}_selectCard(e){this._selectedCardType=e,this._searchQuery=e}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getCustomCards(){const e=window.customCards;return Array.isArray(e)?e.map(e=>({type:`custom:${e.type}`,name:e.name||e.type,description:e.description||"Custom card",icon:"mdi:puzzle",category:"custom"})):[]}_getFilteredCards(){const e=this._searchQuery.toLowerCase(),t=t=>!e||(t.type.toLowerCase().includes(e)||t.name.toLowerCase().includes(e)||t.description.toLowerCase().includes(e));return{builtIn:kr.filter(t),custom:this._getCustomCards().filter(t)}}render(){return V`
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
    `}_renderModal(){const{builtIn:e,custom:t}=this._getFilteredCards(),i=e.length>0||t.length>0;return V`
      <div class="mc-picker-overlay" @click=${this._closeModal}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-picker-header">
            <div class="mc-picker-header-start">
              <ha-icon icon="mdi:card-plus-outline"></ha-icon>
              <span class="mc-picker-title">Select Card</span>
            </div>
            <div>
              <button class="action-btn save-btn" @click=${this._handleSave}>Save</button>
              <button class="action-btn cancel-btn" @click=${this._closeModal}>Cancel</button>
            </div>
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
            ${i?V`
                  ${e.length>0?V`
                    <div class="mc-picker-category">Built-in Cards</div>
                    ${e.map(e=>this._renderCardItem(e))}
                  `:""}
                  ${t.length>0?V`
                    <div class="mc-picker-category">Custom Cards (HACS)</div>
                    ${t.map(e=>this._renderCardItem(e))}
                  `:""}
                `:V`<div class="mc-picker-empty">No cards found</div>`}
          </div>
        </div>
      </div>
    `}_renderCardItem(e){return V`
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
    `}};Cr.styles=l`
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
      justify-content: space-between;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-header-start {
      display: flex;
      align-items: center;
      gap: 10px;
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

    .mc-picker-category {
      padding: 8px 16px 4px;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--secondary-text-color, #757575);
      background: var(--card-background-color, #fff);
      position: sticky;
      top: 0;
      z-index: 1;
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

    .mc-picker-item-badge {
      font-size: 0.6875rem;
      color: var(--secondary-text-color, #757575);
      background: var(--divider-color, #e0e0e0);
      padding: 3px 8px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .mc-picker-empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
    }

    .action-btn {
      border-radius: 6px;
      padding: 8px 12px;
      border: none;
      cursor: pointer;
      font-weight: 500;
    }

    .save-btn {
      background-color: #4CAF50;
      color: white;
    }

    .cancel-btn {
      background-color: #f44336;
      color: white;
    }
  `,$r([ye({type:String})],Cr.prototype,"value",void 0),$r([xe()],Cr.prototype,"_showModal",void 0),$r([xe()],Cr.prototype,"_searchQuery",void 0),$r([xe()],Cr.prototype,"_selectedCardType",void 0),Cr=$r([ve("mc-card-picker")],Cr);var Sr=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let Ar=class extends he{constructor(){super(...arguments),this.mode="create",this._templateName="",this._searchQuery="",this._error="",this._confirmLoad=null,this._showOverwrite=!1}_getTemplates(){try{const e=localStorage.getItem(i);return e?JSON.parse(e):{}}catch{return{}}}_saveTemplates(e){try{localStorage.setItem(i,JSON.stringify(e))}catch{this._error="Failed to save to localStorage."}}_close(){this.dispatchEvent(new CustomEvent("close",{bubbles:!0,composed:!0}))}_handleCreateSave(){const e=this._templateName.trim();if(!e)return void(this._error="Template name is required.");const t=this._getTemplates();if(t[e]&&!this._showOverwrite)return void(this._showOverwrite=!0);if(!this.config)return void(this._error="No config available to save.");const i=Le(this.config);delete i.type,t[e]=i,this._saveTemplates(t),this._error||this._close()}_handleLoadConfirm(e){const t=this._getTemplates()[e];if(!t)return;const i=Le(t);i.type="custom:magic-card",this.dispatchEvent(new CustomEvent("template-selected",{detail:{config:i},bubbles:!0,composed:!0})),this._close()}_handleDelete(e){const t=this._getTemplates();delete t[e],this._saveTemplates(t),this._confirmLoad===e&&(this._confirmLoad=null),this.requestUpdate()}_getFilteredTemplates(){const e=this._getTemplates(),t=Object.keys(e).sort((e,t)=>e.localeCompare(t));if(!this._searchQuery)return t;const i=this._searchQuery.toLowerCase();return t.filter(e=>e.toLowerCase().includes(i))}render(){return V`
      <div class="mc-picker-overlay" @click=${this._close}>
        <div class="mc-picker-modal" @click=${e=>e.stopPropagation()}>
          ${"create"===this.mode?this._renderCreate():this._renderLink()}
        </div>
      </div>
    `}_renderCreate(){return V`
      <div class="mc-picker-header">
        <div class="mc-picker-header-start">
          <ha-icon icon="mdi:file-document-plus-outline"></ha-icon>
          <span class="mc-picker-title">Create Template</span>
        </div>
        <button class="action-btn cancel-btn" @click=${this._close}>Cancel</button>
      </div>
      <div class="mc-template-form">
        <input
          type="text"
          placeholder="Template name"
          .value=${this._templateName}
          @input=${e=>{this._templateName=e.target.value,this._error="",this._showOverwrite=!1}}
        />
        ${this._error?V`<div class="mc-template-error">${this._error}</div>`:J}
        ${this._showOverwrite?V`
              <div class="mc-template-overwrite">
                A template named "${this._templateName.trim()}" already exists. Overwrite?
              </div>
            `:J}
      </div>
      <div class="mc-template-footer">
        ${this._showOverwrite?V`<button class="action-btn overwrite-btn" @click=${this._handleCreateSave}>Overwrite</button>`:V`<button class="action-btn save-btn" ?disabled=${!this._templateName.trim()} @click=${this._handleCreateSave}>Save</button>`}
      </div>
    `}_renderLink(){const e=this._getFilteredTemplates();return V`
      <div class="mc-picker-header">
        <div class="mc-picker-header-start">
          <ha-icon icon="mdi:file-document-multiple-outline"></ha-icon>
          <span class="mc-picker-title">Load Template</span>
        </div>
        <button class="action-btn cancel-btn" @click=${this._close}>Cancel</button>
      </div>
      <div class="mc-picker-search">
        <input
          type="text"
          placeholder="Search templates..."
          .value=${this._searchQuery}
          @input=${e=>{this._searchQuery=e.target.value}}
        />
      </div>
      ${this._confirmLoad?V`
            <div class="mc-template-confirm">
              <div class="mc-template-confirm-text">
                Load "${this._confirmLoad}"? This will replace your current config.
              </div>
              <div class="mc-template-confirm-actions">
                <button class="action-btn save-btn" @click=${()=>this._handleLoadConfirm(this._confirmLoad)}>Confirm</button>
                <button class="action-btn cancel-btn" @click=${()=>{this._confirmLoad=null}}>Cancel</button>
              </div>
            </div>
          `:J}
      <div class="mc-picker-list">
        ${e.length>0?e.map(e=>V`
                <div class="mc-picker-item" @click=${()=>{this._confirmLoad=e}}>
                  <div class="mc-picker-item-icon">
                    <ha-icon icon="mdi:file-document-outline"></ha-icon>
                  </div>
                  <div class="mc-picker-item-content">
                    <div class="mc-picker-item-name">${e}</div>
                  </div>
                  <button
                    class="mc-template-delete-btn"
                    title="Delete template"
                    @click=${t=>{t.stopPropagation(),this._handleDelete(e)}}
                  >
                    <ha-icon icon="mdi:delete-outline"></ha-icon>
                  </button>
                </div>
              `):V`<div class="mc-picker-empty">No templates saved</div>`}
      </div>
    `}};Ar.styles=l`
    :host {
      display: block;
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
      justify-content: space-between;
      gap: 10px;
      padding: 16px 20px;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
    }

    .mc-picker-header-start {
      display: flex;
      align-items: center;
      gap: 10px;
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

    .mc-picker-item-meta {
      font-size: 0.75rem;
      color: var(--secondary-text-color, #757575);
    }

    .mc-picker-empty {
      padding: 32px;
      text-align: center;
      color: var(--secondary-text-color, #757575);
    }

    .action-btn {
      border-radius: 6px;
      padding: 8px 12px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.8125rem;
    }

    .save-btn {
      background-color: #4CAF50;
      color: white;
    }

    .save-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .cancel-btn {
      background-color: #f44336;
      color: white;
    }

    /* Create mode form */
    .mc-template-form {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .mc-template-form input {
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

    .mc-template-form input:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    .mc-template-error {
      font-size: 0.8125rem;
      color: #f44336;
    }

    .mc-template-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 20px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
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
      color: var(--secondary-text-color, #757575);
      border-radius: 6px;
      transition: all 0.15s;
      --mdc-icon-size: 18px;
    }

    .mc-template-delete-btn:hover {
      background: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }

    /* Confirm bar */
    .mc-template-confirm {
      padding: 12px 16px;
      background: color-mix(in srgb, var(--primary-color, #03a9f4) 8%, transparent);
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .mc-template-confirm-text {
      font-size: 0.8125rem;
      color: var(--primary-text-color, #212121);
    }

    .mc-template-confirm-actions {
      display: flex;
      gap: 8px;
    }

    /* Overwrite confirmation */
    .mc-template-overwrite {
      font-size: 0.8125rem;
      color: #ff9800;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mc-template-overwrite-actions {
      display: flex;
      gap: 8px;
    }

    .overwrite-btn {
      background-color: #ff9800;
      color: white;
    }
  `,Sr([ye({type:String})],Ar.prototype,"mode",void 0),Sr([ye({attribute:!1})],Ar.prototype,"config",void 0),Sr([xe()],Ar.prototype,"_templateName",void 0),Sr([xe()],Ar.prototype,"_searchQuery",void 0),Sr([xe()],Ar.prototype,"_error",void 0),Sr([xe()],Ar.prototype,"_confirmLoad",void 0),Sr([xe()],Ar.prototype,"_showOverwrite",void 0),Ar=Sr([ve("mc-template-picker")],Ar);var Mr=function(e,t,i,r){var o,a=arguments.length,n=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(n=(a<3?o(n):a>3?o(t,i,n):o(t,i))||n);return a>3&&n&&Object.defineProperty(t,i,n),n};let zr=class extends he{constructor(){super(...arguments),this._showModuleSelector=!1,this._showSettingsModal=!1,this._showCardSettingsModal=!1,this._showTemplatePicker=null,this._onTemplateSelected=e=>{this._stateManager.updateConfig(e.detail.config),this._showTemplatePicker=null},this._onAddModule=e=>{this._moduleSelectorTarget=e.detail,this._showModuleSelector=!0},this._onModuleSelected=e=>{this._moduleSelectorTarget&&this._stateManager.addModule(this._moduleSelectorTarget.rowIndex,this._moduleSelectorTarget.colIndex,e.detail.type),this._showModuleSelector=!1,this._moduleSelectorTarget=void 0}}connectedCallback(){super.connectedCallback(),this._stateManager=new Fe(e=>{this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:e}}))}),this._unsubscribe=this._stateManager.subscribe(e=>{this._editorState=e,void 0!==e.selectedPath?.moduleIndex&&(this._showSettingsModal=!0)}),this._pendingConfig&&(this._stateManager.setConfig(this._pendingConfig),this._pendingConfig=void 0)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._stateManager?.destroy()}setConfig(e){this._stateManager?this._stateManager.setConfig(e):this._pendingConfig=e}render(){if(!this._editorState)return V`<div class="mc-editor">Loading...</div>`;const{editorMode:e}=this._editorState;return V`
      <div class="mc-editor">
        ${this._renderModeSwitcher(e)}
        ${this._renderToolbar()}
        ${this._renderEditorMode(e)}
        ${this._showCardSettingsModal?this._renderCardSettingsModal():J}
        ${this._showModuleSelector?this._renderModuleSelectorDialog():J}
        ${this._showTemplatePicker?this._renderTemplatePicker():J}
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
            @open-card-settings=${()=>{this._showCardSettingsModal=!0}}
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
    `}_renderCardSettingsModal(){const e=this._editorState.config,t=t=>{this._stateManager.updateConfig({...e,...t})};return V`
      <div class="mc-modal-overlay" @click=${()=>{this._showCardSettingsModal=!1}}>
        <div class="mc-modal" @click=${e=>e.stopPropagation()}>
          <div class="mc-modal-header">
            <ha-icon icon="mdi:card-outline"></ha-icon>
            <span class="mc-modal-title">Card Settings</span>
            <button class="mc-modal-close" @click=${()=>{this._showCardSettingsModal=!1}}>&times;</button>
          </div>
          <div class="mc-modal-body">
            <div class="mc-tab-content">
              ${Pe("Background",e.background,e=>t({background:e}))}
              ${je("Border Radius",e.border_radius,e=>t({border_radius:e}))}
              ${je("Padding",e.padding,e=>t({padding:e}))}
              ${ze("Box Shadow",e.box_shadow,e=>t({box_shadow:e}))}
              ${je("Card Height",e.card_height,e=>t({card_height:e}))}
            </div>
          </div>
          <div class="mc-modal-footer">
            <button class="mc-btn mc-btn-primary" @click=${()=>{this._showCardSettingsModal=!1}}>Done</button>
          </div>
        </div>
      </div>
    `}_renderModuleSelectorDialog(){return V`
      <mc-module-selector
        @module-selected=${this._onModuleSelected}
        @close=${()=>{this._showModuleSelector=!1}}
      ></mc-module-selector>
    `}_renderTemplatePicker(){return V`
      <mc-template-picker
        .mode=${this._showTemplatePicker}
        .config=${this._editorState.config}
        @close=${()=>{this._showTemplatePicker=null}}
        @template-selected=${this._onTemplateSelected}
      ></mc-template-picker>
    `}};zr.styles=Re,Mr([ye({attribute:!1})],zr.prototype,"hass",void 0),Mr([ye({attribute:!1})],zr.prototype,"lovelace",void 0),Mr([xe()],zr.prototype,"_editorState",void 0),Mr([xe()],zr.prototype,"_showModuleSelector",void 0),Mr([xe()],zr.prototype,"_moduleSelectorTarget",void 0),Mr([xe()],zr.prototype,"_showSettingsModal",void 0),Mr([xe()],zr.prototype,"_showCardSettingsModal",void 0),Mr([xe()],zr.prototype,"_showTemplatePicker",void 0),zr=Mr([ve(t)],zr);class Tr{getAvailableTabs(){return["general","actions","conditions","design"]}validate(e){return[]}renderActionsTab(e,t,i){const r=e.actions,o=(t,o)=>{i({...e,actions:{...r,[t]:o}})};return V`
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
    `}renderConditionsTab(e,t,i){const r=e.display,o=r?.conditions||[],a=t=>{i({...e,display:{...r,...t}})},n=(e,t)=>{a({conditions:o.map(i=>i.id===e?{...i,...t}:i)})};return V`
      <div class="mc-tab-content">
        ${Ee("Condition Mode",r?.mode||"every",[{label:"All conditions (AND)",value:"every"},{label:"Any condition (OR)",value:"any"}],e=>a({mode:e}))}

        <div class="mc-conditions-list">
          ${o.map(e=>V`
              <div class="mc-condition-item">
                ${Ee("Type",e.type,[{label:"State",value:"state"},{label:"Attribute",value:"attribute"},{label:"Time",value:"time"},{label:"Template",value:"template"}],t=>n(e.id,{type:t}))}
                ${"state"===e.type||"attribute"===e.type?V`
                      ${Oe("Entity",e.entity,t=>n(e.id,{entity:t}),t)}
                      ${"attribute"===e.type?ze("Attribute",e.attribute,t=>n(e.id,{attribute:t})):J}
                      ${ze("State equals",e.state,t=>n(e.id,{state:t}))}
                      ${ze("State not equals",e.state_not,t=>n(e.id,{state_not:t}))}
                    `:J}
                ${"time"===e.type?V`
                      ${ze("After (HH:MM)",e.after,t=>n(e.id,{after:t}))}
                      ${ze("Before (HH:MM)",e.before,t=>n(e.id,{before:t}))}
                    `:J}
                ${"template"===e.type?V`
                      <div class="mc-field">
                        <label class="mc-field-label">Template</label>
                        <textarea
                          .value=${e.template||""}
                          @input=${t=>n(e.id,{template:t.target.value})}
                          rows="3"
                        ></textarea>
                      </div>
                    `:J}
                <button class="mc-btn-icon" @click=${()=>{return t=e.id,void a({conditions:o.filter(e=>e.id!==t)});var t}}>
                  &times;
                </button>
              </div>
            `)}
        </div>

        <button class="mc-btn mc-btn-secondary" @click=${()=>{const e={id:Se("cond"),type:"state",entity:"",state:""};a({conditions:[...o,e]})}}>
          <ha-icon icon="mdi:plus" style="--mdc-icon-size:16px"></ha-icon>
          Add Condition
        </button>
      </div>
    `}renderDesignTab(e,t,i){const r=e.design||{},o=t=>{i({...e,design:{...r,...t}})};return V`
      <div class="mc-tab-content">
        <div class="mc-section">
          <div class="mc-section-header">Typography</div>
          ${je("Font Size",r.font_size,e=>o({font_size:e}))}
          ${Ee("Font Weight",r.font_weight,[{label:"Normal",value:"normal"},{label:"Bold",value:"bold"},{label:"Light",value:"300"},{label:"Medium",value:"500"},{label:"Semibold",value:"600"}],e=>o({font_weight:e}))}
          ${Ee("Text Align",r.text_align,[{label:"Left",value:"left"},{label:"Center",value:"center"},{label:"Right",value:"right"}],e=>o({text_align:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Colors</div>
          ${Pe("Color",r.color,e=>o({color:e}))}
          ${Pe("Background",r.background,e=>o({background:e}))}
          ${ze("Opacity",r.opacity,e=>o({opacity:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Spacing</div>
          ${je("Padding",r.padding,e=>o({padding:e}))}
          ${je("Margin",r.margin,e=>o({margin:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Borders</div>
          ${ze("Border",r.border,e=>o({border:e}))}
          ${je("Border Radius",r.border_radius,e=>o({border_radius:e}))}
          ${ze("Box Shadow",r.box_shadow,e=>o({box_shadow:e}))}
        </div>

        <div class="mc-section">
          <div class="mc-section-header">Size</div>
          ${je("Width",r.width,e=>o({width:e}))}
          ${je("Height",r.height,e=>o({height:e}))}
          ${je("Min Width",r.min_width,e=>o({min_width:e}))}
          ${je("Min Height",r.min_height,e=>o({min_height:e}))}
          ${je("Max Width",r.max_width,e=>o({max_width:e}))}
          ${je("Max Height",r.max_height,e=>o({max_height:e}))}
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
    `}_renderActionConfig(e,t,i){const r=e||{action:"none"};return V`
      <div class="mc-action-config">
        ${Ee("Action",r.action,[{label:"None",value:"none"},{label:"More Info",value:"more-info"},{label:"Toggle",value:"toggle"},{label:"Navigate",value:"navigate"},{label:"URL",value:"url"},{label:"Perform Action",value:"perform-action"},{label:"Assist",value:"assist"}],e=>t({...r,action:e}))}
        ${"more-info"===r.action||"toggle"===r.action?Oe("Entity",r.entity,e=>t({...r,entity:e}),i):J}
        ${"navigate"===r.action?ze("Navigation Path",r.navigation_path,e=>t({...r,navigation_path:e})):J}
        ${"url"===r.action?ze("URL",r.url_path,e=>t({...r,url_path:e})):J}
        ${"perform-action"===r.action?V`
              ${function(e,t,i,r){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-service-picker
        .hass=${r}
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-service-picker>
    </div>
  `}("Service",r.service,e=>t({...r,service:e}),i)}
            `:J}
      </div>
    `}}we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"text",name:"Text",description:"Display static or template text",category:"content",icon:"mdi:format-text"}}createDefault(){return{id:Se("text"),type:"text",text:"Hello World"}}renderPreview(e,t){return V`<div class="mc-module mc-text">${e.text||""}</div>`}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${ze("Text",r.text,e=>i({...r,text:e}))}
        ${Ie("Use Template",r.use_template,e=>i({...r,use_template:e}))}
        ${r.use_template?V`
              <div class="mc-field-hint">Use Jinja2 templates: {{ states('sensor.temp') }}</div>
            `:V``}
      </div>
    `}validate(e){const t=[],i=e;return i.text||i.use_template||t.push("Text content is required"),t}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"icon",name:"Icon",description:"Display an icon from MDI or entity",category:"content",icon:"mdi:emoticon-outline"}}createDefault(){return{id:Se("icon"),type:"icon",icon:"mdi:home",size:"24px"}}renderPreview(e,t){const i=e;let r=i.icon||"mdi:help";if(i.use_entity_icon&&i.entity&&t){const e=t.states[i.entity];e?.attributes.icon&&(r=e.attributes.icon)}return V`
      <div class="mc-module mc-icon" style="--mc-icon-size: ${i.size||"24px"}; color: ${i.icon_color||"inherit"}">
        <ha-icon .icon=${r}></ha-icon>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Ie("Use Entity Icon",r.use_entity_icon,e=>i({...r,use_entity_icon:e}))}
        ${r.use_entity_icon?J:De("Icon",r.icon,e=>i({...r,icon:e}),t)}
        ${ze("Size",r.size,e=>i({...r,size:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"info",name:"Info",description:"Display entity name, state, and attributes",category:"content",icon:"mdi:information-outline"}}createDefault(){return{id:Se("info"),type:"info",show_name:!0,show_state:!0,show_unit:!0}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=r?.attributes.friendly_name||i.entity||"No entity",a=r?t.formatEntityState(r):"—";return V`
      <div class="mc-module mc-info">
        ${i.show_name?V`<span class="mc-info-name">${o}</span>`:J}
        ${i.show_state?V`<span class="mc-info-state">
              ${i.prefix||""}${i.attribute&&r?String(r.attributes[i.attribute]??"—"):a}${i.suffix||""}
            </span>`:J}
        ${i.secondary_info&&r?V`<span class="mc-info-secondary"
              >${String(r.attributes[i.secondary_info]??"")}</span
            >`:J}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${ze("Attribute",r.attribute,e=>i({...r,attribute:e}))}
        ${Ie("Show Name",r.show_name,e=>i({...r,show_name:e}))}
        ${Ie("Show State",r.show_state,e=>i({...r,show_state:e}))}
        ${Ie("Show Unit",r.show_unit,e=>i({...r,show_unit:e}))}
        ${ze("Prefix",r.prefix,e=>i({...r,prefix:e}))}
        ${ze("Suffix",r.suffix,e=>i({...r,suffix:e}))}
        ${ze("Secondary Info (attribute)",r.secondary_info,e=>i({...r,secondary_info:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"image",name:"Image",description:"Display a static image or entity picture",category:"content",icon:"mdi:image"}}createDefault(){return{id:Se("image"),type:"image",image:"",entity_picture:!1,aspect_ratio:"16:9",fit:"cover"}}renderPreview(e,t){const i=e;let r=i.image||"";if(i.entity_picture&&i.entity&&t){const e=t.states[i.entity];e?.attributes.entity_picture&&(r=e.attributes.entity_picture)}const o=i.fit||"cover",a=i.aspect_ratio||"16:9";return V`
      <div
        class="mc-module mc-image"
        style="aspect-ratio: ${a.replace(":","/")}; overflow: hidden;"
      >
        ${r?V`<img
              src=${r}
              style="width: 100%; height: 100%; object-fit: ${o}; display: block;"
              alt=""
            />`:V`<div
              style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--divider-color, #e0e0e0); color: var(--secondary-text-color, #888);"
            >
              <ha-icon icon="mdi:image-off"></ha-icon>
            </div>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Ie("Use Entity Picture",r.entity_picture,e=>i({...r,entity_picture:e}))}
        ${r.entity_picture?J:Ne("Image URL",r.image,e=>i({...r,image:e}),t,"image")}
        ${ze("Aspect Ratio",r.aspect_ratio,e=>i({...r,aspect_ratio:e}))}
        ${Ee("Fit",r.fit,[{label:"Cover",value:"cover"},{label:"Contain",value:"contain"},{label:"Fill",value:"fill"},{label:"None",value:"none"}],e=>i({...r,fit:e}))}
      </div>
    `}validate(e){const t=[],i=e;return i.image||i.entity_picture||t.push("An image URL or entity picture source is required"),i.entity_picture&&!i.entity&&t.push("Entity is required when using entity picture"),t}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"markdown",name:"Markdown",description:"Render markdown-formatted content",category:"content",icon:"mdi:language-markdown"}}createDefault(){return{id:Se("markdown"),type:"markdown",content:"**Hello** _World_"}}renderPreview(e,t){const i=(e.content||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/__(.+?)__/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/_(.+?)_/g,"<em>$1</em>").replace(/`(.+?)`/g,"<code>$1</code>").replace(/\n/g,"<br>");return V`
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
        ${ze("Entity (for templates)",r.entity,e=>i({...r,entity:e}))}
      </div>
    `}validate(e){const t=[];return e.content||t.push("Markdown content is required"),t}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"bar",name:"Bar",description:"Display a progress bar based on entity state",category:"content",icon:"mdi:chart-bar"}}createDefault(){return{id:Se("bar"),type:"bar",min:0,max:100,bar_height:"8px",bar_color:"var(--primary-color, #03a9f4)",bar_background:"var(--divider-color, #e0e0e0)",show_value:!0,direction:"horizontal"}}renderPreview(e,t){const i=e,r=i.min??0,o=i.max??100,a=i.entity&&t?t.states[i.entity]:void 0,n=a?parseFloat(a.state):r,s=Math.min(Math.max(n,r),o),c=o!==r?(s-r)/(o-r)*100:0;let l=i.bar_color||"var(--primary-color, #03a9f4)";if(i.severity&&i.severity.length>0)for(const e of i.severity)if(s>=e.from&&s<=e.to){l=e.color;break}const d=i.bar_background||"var(--divider-color, #e0e0e0)",p=i.bar_height||"8px";return"vertical"===i.direction?V`
        <div class="mc-module mc-bar mc-bar-vertical" style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
          ${i.show_value?V`<span class="mc-bar-value">${a?t.formatEntityState(a):"—"}</span>`:J}
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
        ${i.show_value?V`<span class="mc-bar-value" style="white-space: nowrap;">${a?t.formatEntityState(a):"—"}</span>`:J}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Te("Min",r.min,e=>i({...r,min:e}))}
        ${Te("Max",r.max,e=>i({...r,max:e}))}
        ${ze("Bar Height",r.bar_height,e=>i({...r,bar_height:e}))}
        ${Pe("Bar Color",r.bar_color,e=>i({...r,bar_color:e}))}
        ${Pe("Bar Background",r.bar_background,e=>i({...r,bar_background:e}))}
        ${Ie("Show Value",r.show_value,e=>i({...r,show_value:e}))}
        ${Ee("Direction",r.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...r,direction:e}))}
      </div>
    `}validate(e){const t=[],i=e;return i.entity||t.push("Entity is required for bar module"),void 0!==i.min&&void 0!==i.max&&i.min>=i.max&&t.push("Min must be less than max"),t}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"graphs",name:"Graph",description:"Display entity history as a line graph",category:"content",icon:"mdi:chart-line"}}createDefault(){return{id:Se("graphs"),type:"graphs",hours_to_show:24,points_per_hour:2,line_width:2,fill:!0,show_points:!1,show_labels:!0}}renderPreview(e,t){const i=e,r=i.line_color||"var(--mc-primary)",o=i.fill_color||"var(--mc-primary)";return V`
      <div class="mc-module mc-graphs">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" style="height: 60px">
          ${i.fill?V`<path d="M0,50 Q30,30 60,35 T120,20 T200,30 L200,60 L0,60 Z"
                fill="${o}" opacity="0.15" />`:""}
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
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Te("Hours to Show",r.hours_to_show,e=>i({...r,hours_to_show:e}),{min:1,max:168})}
        ${Te("Points per Hour",r.points_per_hour,e=>i({...r,points_per_hour:e}),{min:1,max:60})}
        ${Pe("Line Color",r.line_color,e=>i({...r,line_color:e}))}
        ${Te("Line Width",r.line_width,e=>i({...r,line_width:e}),{min:1,max:10})}
        ${Ie("Fill",r.fill,e=>i({...r,fill:e}))}
        ${Pe("Fill Color",r.fill_color,e=>i({...r,fill_color:e}))}
        ${Ie("Show Points",r.show_points,e=>i({...r,show_points:e}))}
        ${Ie("Show Labels",r.show_labels,e=>i({...r,show_labels:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"camera",name:"Camera",description:"Display a camera entity stream",category:"content",icon:"mdi:cctv"}}createDefault(){return{id:Se("camera"),type:"camera",aspect_ratio:"16:9",show_controls:!0}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=r?.attributes.entity_picture,a=r?.attributes.friendly_name||i.entity||"No camera";return V`
      <div class="mc-module mc-camera" style="aspect-ratio: ${(i.aspect_ratio||"16:9").replace(":","/")}">
        ${o?V`<img src="${o}" alt="${a}" />`:V`<div style="display:flex;align-items:center;justify-content:center;height:100%;background:var(--mc-border);color:var(--mc-text-secondary);font-size:0.875rem;">
              <ha-icon icon="mdi:cctv" style="margin-right:8px"></ha-icon>${a}
            </div>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Camera Entity",r.entity,e=>i({...r,entity:e}),t,"camera")}
        ${ze("Aspect Ratio",r.aspect_ratio,e=>i({...r,aspect_ratio:e}))}
        ${Ie("Show Controls",r.show_controls,e=>i({...r,show_controls:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"button",name:"Button",description:"Interactive button with icon, label, and optional state display",category:"controls",icon:"mdi:gesture-tap"}}createDefault(){return{id:Se("button"),type:"button",label:"Button",icon:"mdi:power",show_state:!1,button_style:"default"}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=r?t.formatEntityState(r):void 0,a=i.label||"Button",n="icon-only"===i.button_style;return V`
      <div class="mc-module mc-button mc-button--${i.button_style||"default"}">
        <button
          class="mc-button-inner"
          style="
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: ${n?"8px":"8px 16px"};
            border-radius: 8px;
            border: ${"outline"===i.button_style?"1px solid var(--primary-color, #03a9f4)":"none"};
            background: ${"flat"===i.button_style||"outline"===i.button_style?"transparent":"var(--primary-color, #03a9f4)"};
            color: ${"flat"===i.button_style||"outline"===i.button_style?"var(--primary-color, #03a9f4)":"#fff"};
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          "
        >
          ${i.icon?V`<ha-icon .icon=${i.icon} style="--mdc-icon-size: 20px;"></ha-icon>`:J}
          ${n?J:V`<span>${a}</span>`}
          ${i.show_state&&o?V`<span class="mc-button-state" style="opacity: 0.8; font-size: 12px;">${o}</span>`:J}
        </button>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${ze("Label",r.label,e=>i({...r,label:e}))}
        ${De("Icon",r.icon,e=>i({...r,icon:e}),t)}
        ${Ee("Button Style",r.button_style,[{label:"Default",value:"default"},{label:"Outline",value:"outline"},{label:"Flat",value:"flat"},{label:"Icon Only",value:"icon-only"}],e=>i({...r,button_style:e}))}
        ${Ie("Show State",r.show_state,e=>i({...r,show_state:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"slider",name:"Slider",description:"Range slider for controlling numeric values",category:"controls",icon:"mdi:tune-vertical"}}createDefault(){return{id:Se("slider"),type:"slider",show_value:!0,direction:"horizontal"}}_getEntityLimits(e,t){if(!e)return{min:0,max:100,step:1};const i=e.entity_id.split(".")[0],r=e.attributes;switch(i){case"input_number":case"number":default:return{min:Number(r.min??0),max:Number(r.max??100),step:Number(r.step??1)};case"light":return"color_temp"===t?{min:Number(r.min_mireds??153),max:Number(r.max_mireds??500),step:1}:{min:0,max:100,step:1};case"fan":return{min:0,max:100,step:Number(r.percentage_step??1)};case"cover":case"media_player":return{min:0,max:100,step:1};case"climate":return{min:Number(r.min_temp??7),max:Number(r.max_temp??35),step:Number(r.target_temp_step??.5)}}}_createSliderHandler(e,t,i,r){const o="vertical"===i.direction,{min:a,max:n,step:s}=r;return r=>{r.stopPropagation();const c=r.currentTarget;c.setPointerCapture(r.pointerId);const l=e=>{const t=c.getBoundingClientRect();return o?Math.max(0,Math.min(1,1-(e.clientY-t.top)/t.height)):Math.max(0,Math.min(1,(e.clientX-t.left)/t.width))};c.style.setProperty("--slider-value",String(l(r)));const d=e=>{c.style.setProperty("--slider-value",String(l(e)))},p=r=>{c.removeEventListener("pointermove",d),c.removeEventListener("pointerup",p);const o=l(r),u=a+o*(n-a),m=Math.round(u/s)*s;this._callEntityService(e,t,m,i.attribute)};c.addEventListener("pointermove",d),c.addEventListener("pointerup",p)}}_callEntityService(e,t,i,r){const o=t.split(".")[0];switch(o){case"input_number":case"number":default:e.callService(o,"set_value",{entity_id:t,value:i});break;case"light":r&&"brightness"!==r?"color_temp"===r&&e.callService("light","turn_on",{entity_id:t,color_temp:Math.round(i)}):e.callService("light","turn_on",{entity_id:t,brightness_pct:Math.round(i)});break;case"fan":e.callService("fan","set_percentage",{entity_id:t,percentage:Math.round(i)});break;case"cover":e.callService("cover","set_cover_position",{entity_id:t,position:Math.round(i)});break;case"media_player":e.callService("media_player","volume_set",{entity_id:t,volume_level:i/100});break;case"climate":e.callService("climate","set_temperature",{entity_id:t,temperature:i})}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,{min:o,max:a}=this._getEntityLimits(r,i.attribute),n=r?i.attribute?Number(r.attributes[i.attribute]??o):Number(r.state):Math.round((o+a)/2),s="vertical"===i.direction,c=a>o?(n-o)/(a-o):0,l=this._getEntityLimits(r,i.attribute),d=i.entity&&t?this._createSliderHandler(t,i.entity,i,l):void 0;return V`
      <div
        class="mc-module mc-slider"
        style="
          display: flex;
          flex-direction: ${s?"column":"row"};
          align-items: center;
          gap: 8px;
          ${s?"height: 120px;":"width: 100%;"}
        "
      >
        <div
          class="mc-tile-slider ${s?"mc-tile-slider--vertical":""}"
          style="--slider-value: ${c}; --mc-slider-color: ${i.slider_color||"var(--primary-color, #03a9f4)"}; ${i.track_color?`--mc-slider-background: ${i.track_color};`:""} touch-action: none;"
          @pointerdown=${d}
          @click=${e=>e.stopPropagation()}
        >
          <div class="mc-tile-slider-background"></div>
          <div class="mc-tile-slider-bar"></div>
        </div>
        ${i.show_value?V`<span class="mc-slider-value" style="font-size: 14px; min-width: 36px; text-align: center;">
              ${n}
            </span>`:J}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${ze("Attribute",r.attribute,e=>i({...r,attribute:e}))}
        ${Ie("Show Value",r.show_value,e=>i({...r,show_value:e}))}
        ${Ee("Direction",r.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...r,direction:e}))}
        ${Pe("Slider Color",r.slider_color,e=>i({...r,slider_color:e}))}
        ${Pe("Track Color",r.track_color,e=>i({...r,track_color:e}))}
        ${ze("Thumb Size",r.thumb_size,e=>i({...r,thumb_size:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"spinbox",name:"Spinbox",description:"Numeric input with increment and decrement buttons",category:"controls",icon:"mdi:numeric"}}createDefault(){return{id:Se("spinbox"),type:"spinbox",min:0,max:100,step:1}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=i.min??0,a=i.max??100,n=r?i.attribute?Number(r.attributes[i.attribute]??o):Number(r.state):Math.round((o+a)/2),s="\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      width: 32px;\n      height: 32px;\n      border: none;\n      border-radius: 50%;\n      background: var(--primary-color, #03a9f4);\n      color: #fff;\n      font-size: 18px;\n      font-weight: bold;\n      cursor: pointer;\n      line-height: 1;\n    ";return V`
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
          ${n}
        </span>
        <button class="mc-spinbox-increment" style="${s}">
          +
        </button>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${ze("Attribute",r.attribute,e=>i({...r,attribute:e}))}
        ${Te("Min",r.min,e=>i({...r,min:e}))}
        ${Te("Max",r.max,e=>i({...r,max:e}))}
        ${Te("Step",r.step,e=>i({...r,step:e}),{min:.01,step:.01})}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"dropdown",name:"Dropdown",description:"Select dropdown for choosing from a list of options",category:"controls",icon:"mdi:form-dropdown"}}createDefault(){return{id:Se("dropdown"),type:"dropdown",options:[{label:"Option 1",value:"option_1"},{label:"Option 2",value:"option_2"},{label:"Option 3",value:"option_3"}]}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=r?i.attribute?String(r.attributes[i.attribute]??""):r.state:void 0,a=i.options||[];return V`
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
          ${a.length>0?a.map(e=>V`
                  <option value=${e.value} ?selected=${o===e.value}>
                    ${e.label}
                  </option>
                `):V`<option disabled selected>No options</option>`}
        </select>
      </div>
    `}renderGeneralTab(e,t,i){const r=e,o=r.options||[],a=(e,t,a)=>{const n=o.map((i,r)=>r===e?{...i,[t]:a}:i);i({...r,options:n})};return V`
      <div class="mc-tab-content">
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${ze("Attribute",r.attribute,e=>i({...r,attribute:e}))}

        <div class="mc-section">
          <div class="mc-section-header">Options</div>
          <div class="mc-options-list">
            ${o.map((e,t)=>V`
                <div class="mc-option-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${ze("Label",e.label,e=>a(t,"label",e))}
                  ${ze("Value",e.value,e=>a(t,"value",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=o.filter((t,i)=>i!==e);i({...r,options:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...o,{label:`Option ${o.length+1}`,value:`option_${o.length+1}`}];i({...r,options:e})}}>Add Option</button>
        </div>
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"light",name:"Light",description:"Light control with brightness, color temp, and color options",category:"controls",icon:"mdi:lightbulb"}}createDefault(){return{id:Se("light"),type:"light",show_brightness:!0,show_color_temp:!1,show_color:!1,compact:!1}}_createSliderHandler(e,t,i){return e=>{e.stopPropagation();const t=e.currentTarget;t.setPointerCapture(e.pointerId);const r=e=>{const i=t.getBoundingClientRect();return Math.max(0,Math.min(1,(e.clientX-i.left)/i.width))};t.style.setProperty("--slider-value",String(r(e)));const o=e=>{t.style.setProperty("--slider-value",String(r(e)))},a=e=>{t.removeEventListener("pointermove",o),t.removeEventListener("pointerup",a),i(r(e))};t.addEventListener("pointermove",o),t.addEventListener("pointerup",a)}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=!!r&&"on"===r.state,a=r?.attributes.brightness,n=void 0!==a?Math.round(a/255*100):void 0,s=r?.attributes.color_temp,c=r?.attributes.min_mireds??153,l=r?.attributes.max_mireds??500,d=r?.attributes.friendly_name||i.entity||"Light",p=o?"var(--state-light-active-color, #fdd835)":"var(--state-icon-color, #9e9e9e)",u=i.entity&&t?this._createSliderHandler(t,i.entity,e=>{t.callService("light","turn_on",{entity_id:i.entity,brightness_pct:Math.round(100*e)})}):void 0,m=i.entity&&t?this._createSliderHandler(t,i.entity,e=>{t.callService("light","turn_on",{entity_id:i.entity,color_temp:Math.round(c+e*(l-c))})}):void 0;return V`
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
            style="color: ${p}; --mdc-icon-size: ${i.compact?"24px":"32px"};"
          ></ha-icon>
          ${i.compact?V`<span style="font-weight: 500; flex: 1;">${d}</span>`:V`
                <div style="flex: 1;">
                  <div style="font-weight: 500;">${d}</div>
                  <div style="font-size: 12px; opacity: 0.7;">
                    ${o?void 0!==n?`${n}%`:"On":"Off"}
                  </div>
                </div>
              `}
        </div>

        ${i.show_brightness?V`
              <div class="mc-light-brightness" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:brightness-6"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <div
                  class="mc-tile-slider"
                  style="--slider-value: ${(n??50)/100}; --mc-slider-color: var(--state-light-active-color, #fdd835); touch-action: none;"
                  @pointerdown=${u}
                  @click=${e=>e.stopPropagation()}
                >
                  <div class="mc-tile-slider-background"></div>
                  <div class="mc-tile-slider-bar"></div>
                </div>
                ${void 0!==n?V`<span style="font-size: 12px; min-width: 32px; text-align: right;">${n}%</span>`:J}
              </div>
            `:J}

        ${i.show_color_temp?V`
              <div class="mc-light-color-temp" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:thermometer"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <div
                  class="mc-tile-slider"
                  style="--slider-value: ${((s??300)-c)/(l-c)}; --mc-slider-color: #ff9800; touch-action: none;"
                  @pointerdown=${m}
                  @click=${e=>e.stopPropagation()}
                >
                  <div class="mc-tile-slider-background"></div>
                  <div class="mc-tile-slider-bar"></div>
                </div>
              </div>
            `:J}

        ${i.show_color?V`
              <div class="mc-light-color" style="display: flex; align-items: center; gap: 8px;">
                <ha-icon .icon=${"mdi:palette"} style="--mdc-icon-size: 18px; opacity: 0.7;"></ha-icon>
                <input
                  type="color"
                  style="width: 32px; height: 32px; border: none; padding: 0; cursor: pointer;"
                  @input=${e=>{if(e.stopPropagation(),!i.entity||!t)return;const r=e.target.value,o=parseInt(r.slice(1,3),16),a=parseInt(r.slice(3,5),16),n=parseInt(r.slice(5,7),16);t.callService("light","turn_on",{entity_id:i.entity,rgb_color:[o,a,n]})}}
                  @click=${e=>e.stopPropagation()}
                />
              </div>
            `:J}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t,"light")}
        ${Ie("Show Brightness",r.show_brightness,e=>i({...r,show_brightness:e}))}
        ${Ie("Show Color Temp",r.show_color_temp,e=>i({...r,show_color_temp:e}))}
        ${Ie("Show Color Picker",r.show_color,e=>i({...r,show_color:e}))}
        ${Ie("Compact Mode",r.compact,e=>i({...r,compact:e}))}
      </div>
    `}validate(e){const t=[];return e.entity||t.push("Entity is required for light module"),t}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"gauge",name:"Gauge",description:"Arc gauge for displaying numeric sensor values",category:"controls",icon:"mdi:gauge"}}createDefault(){return{id:Se("gauge"),type:"gauge",min:0,max:100,needle:!0,gauge_style:"half"}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=i.min??0,a=i.max??100,n=r?Number(r.state):Math.round((o+a)/2),s=Math.max(o,Math.min(a,n)),c=(s-o)/(a-o)*100,l=this._getSeverityColor(s,i.severity)||"var(--primary-color, #03a9f4)",d=("half"===i.gauge_style||i.gauge_style,"full"===i.gauge_style),p="quarter"===i.gauge_style;if(d){const e=c/100*360,t=(e-90)*(Math.PI/180),i=40,r=50,o=50+i*Math.cos(t),a=r+i*Math.sin(t);return V`
        <div class="mc-module mc-gauge mc-gauge--full" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${c>0?V`<path
                  d="M 50 10 A 40 40 0 ${e>180?1:0} 1 ${o} ${a}"
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
      `}if(p){const e=c/100*90,t=Math.PI/180*-90,i=(-90+e)*(Math.PI/180),r=44,o=10,a=90,n=o+r*Math.cos(t),d=a+r*Math.sin(t),p=o+r*Math.cos(i),u=a+r*Math.sin(i);return V`
        <div class="mc-module mc-gauge mc-gauge--quarter" style="text-align: center;">
          <svg viewBox="0 0 100 100" width="120" height="120">
            <path d="M 10 46 A 44 44 0 0 1 54 90" fill="none" stroke="var(--divider-color, #e0e0e0)" stroke-width="8" />
            ${c>0?V`<path
                  d="M ${n} ${d} A ${r} ${r} 0 0 1 ${p} ${u}"
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
      `}const u=c/100*180,m=(180+u)*(Math.PI/180),h=50+40*Math.cos(m),g=55+40*Math.sin(m);return V`
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
                d="M 10 55 A 40 40 0 ${u>180?1:0} 1 ${h} ${g}"
                fill="none"
                stroke=${l}
                stroke-width="8"
                stroke-linecap="round"
              />`:""}
          ${i.needle?V`
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
          <text x="90" y="68" text-anchor="middle" font-size="8" fill="currentColor" opacity="0.6">${a}</text>
        </svg>
      </div>
    `}renderGeneralTab(e,t,i){const r=e,o=r.severity||[],a=(e,t,a)=>{const n=o.map((i,r)=>r===e?{...i,[t]:a}:i);i({...r,severity:n})};return V`
      <div class="mc-tab-content">
        ${Oe("Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Te("Min",r.min,e=>i({...r,min:e}))}
        ${Te("Max",r.max,e=>i({...r,max:e}))}
        ${Ee("Gauge Style",r.gauge_style,[{label:"Half (semicircle)",value:"half"},{label:"Full (circle)",value:"full"},{label:"Quarter",value:"quarter"}],e=>i({...r,gauge_style:e}))}
        ${Ie("Show Needle",r.needle,e=>i({...r,needle:e}))}

        <div class="mc-section">
          <div class="mc-section-header">Severity Ranges</div>
          <div class="mc-severity-list">
            ${o.map((e,t)=>V`
                <div class="mc-severity-item" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
                  ${Te("From",e.from,e=>a(t,"from",e))}
                  ${Te("To",e.to,e=>a(t,"to",e))}
                  ${Pe("Color",e.color,e=>a(t,"color",e))}
                  <button class="mc-btn-icon" @click=${()=>(e=>{const t=o.filter((t,i)=>i!==e);i({...r,severity:t})})(t)}>&times;</button>
                </div>
              `)}
          </div>
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...o,{from:0,to:100,color:"#4caf50"}];i({...r,severity:e})}}>Add Severity Range</button>
        </div>
      </div>
    `}_getSeverityColor(e,t){if(t&&0!==t.length)for(const i of t)if(e>=i.from&&e<=i.to)return i.color}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"horizontal",name:"Horizontal",description:"Arrange child modules in a row",category:"layout",icon:"mdi:arrow-split-vertical"}}createDefault(){return{id:Se("horizontal"),type:"horizontal",modules:[],gap:"8px",align:"center",justify:"start"}}renderPreview(e,t){const i=e,r=i.modules||[];return V`
      <div class="mc-module mc-horizontal"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"center"}; justify-content:${i.justify||"start"}">
        ${r.length>0?r.map(e=>{const i=we.get(e.type);return i?i.renderPreview(e,t):V`<span class="mc-error">?</span>`}):V`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty row</span>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${ze("Gap",r.gap,e=>i({...r,gap:e}))}
        ${Ee("Align",r.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>i({...r,align:e}))}
        ${Ee("Justify",r.justify,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Space Between",value:"space-between"},{label:"Space Around",value:"space-around"}],e=>i({...r,justify:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"vertical",name:"Vertical",description:"Arrange child modules in a column",category:"layout",icon:"mdi:arrow-split-horizontal"}}createDefault(){return{id:Se("vertical"),type:"vertical",modules:[],gap:"8px",align:"stretch"}}renderPreview(e,t){const i=e,r=i.modules||[];return V`
      <div class="mc-module mc-vertical"
        style="gap:${i.gap||"8px"}; align-items:${i.align||"stretch"}">
        ${r.length>0?r.map(e=>{const i=we.get(e.type);return i?i.renderPreview(e,t):V`<span class="mc-error">?</span>`}):V`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty column</span>`}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${ze("Gap",r.gap,e=>i({...r,gap:e}))}
        ${Ee("Align",r.align,[{label:"Start",value:"start"},{label:"Center",value:"center"},{label:"End",value:"end"},{label:"Stretch",value:"stretch"}],e=>i({...r,align:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"tabs",name:"Tabs",description:"Tabbed container for groups of modules",category:"layout",icon:"mdi:tab"}}createDefault(){return{id:Se("tabs"),type:"tabs",tabs:[{label:"Tab 1",modules:[]},{label:"Tab 2",modules:[]}],active_tab:0,tab_style:"default"}}renderPreview(e,t){const i=e,r=i.tabs||[],o=i.active_tab||0,a=r[o];return V`
      <div class="mc-module mc-tabs">
        <div class="mc-tabs-header">
          ${r.map((e,t)=>V`
              <button class="mc-tab-button ${t===o?"active":""}">
                ${e.icon?V`<ha-icon icon=${e.icon} style="--mdc-icon-size:16px"></ha-icon>`:""}
                ${e.label}
              </button>
            `)}
        </div>
        <div class="mc-tabs-content">
          ${a?.modules?.length?a.modules.map(e=>{const i=we.get(e.type);return i?i.renderPreview(e,t):V`<span class="mc-error">?</span>`}):V`<span style="color:var(--mc-text-secondary);font-size:0.75rem">Empty tab</span>`}
        </div>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ee("Tab Style",r.tab_style,[{label:"Default",value:"default"},{label:"Pills",value:"pills"},{label:"Underline",value:"underline"}],e=>i({...r,tab_style:e}))}
        <div class="mc-section">
          <div class="mc-section-header">Tabs</div>
          ${(r.tabs||[]).map((e,t)=>V`
              <div class="mc-field" style="display:flex;gap:8px;align-items:center">
                <input type="text" .value=${e.label}
                  @input=${e=>{const o=[...r.tabs||[]];o[t]={...o[t],label:e.target.value},i({...r,tabs:o})}} />
                <button class="mc-btn-icon" @click=${()=>{const e=(r.tabs||[]).filter((e,i)=>i!==t);i({...r,tabs:e})}}>&times;</button>
              </div>
            `)}
          <button class="mc-btn mc-btn-secondary" @click=${()=>{const e=[...r.tabs||[],{label:`Tab ${(r.tabs||[]).length+1}`,modules:[]}];i({...r,tabs:e})}}>Add Tab</button>
        </div>
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"separator",name:"Separator",description:"Visual divider between modules",category:"layout",icon:"mdi:minus"}}getAvailableTabs(){return["general","conditions","design"]}createDefault(){return{id:Se("separator"),type:"separator",separator_style:"solid",separator_color:"var(--divider-color, #e5e7eb)",separator_width:"1px",direction:"horizontal"}}renderPreview(e,t){const i=e;return"vertical"===i.direction?V`
        <div class="mc-module mc-separator-vertical"
          style="border-left-style:${i.separator_style||"solid"}; border-left-color:${i.separator_color||"var(--divider-color)"}; border-left-width:${i.separator_width||"1px"}">
        </div>
      `:V`
      <hr class="mc-module mc-separator"
        style="border-top-style:${i.separator_style||"solid"}; border-top-color:${i.separator_color||"var(--divider-color)"}; border-top-width:${i.separator_width||"1px"}" />
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ee("Direction",r.direction,[{label:"Horizontal",value:"horizontal"},{label:"Vertical",value:"vertical"}],e=>i({...r,direction:e}))}
        ${Ee("Style",r.separator_style,[{label:"Solid",value:"solid"},{label:"Dashed",value:"dashed"},{label:"Dotted",value:"dotted"},{label:"None",value:"none"}],e=>i({...r,separator_style:e}))}
        ${Pe("Color",r.separator_color,e=>i({...r,separator_color:e}))}
        ${ze("Width",r.separator_width,e=>i({...r,separator_width:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"clock",name:"Clock",description:"Display current time and date",category:"advanced",icon:"mdi:clock-outline"}}getAvailableTabs(){return["general","conditions","design"]}createDefault(){return{id:Se("clock"),type:"clock",format_12h:!1,show_seconds:!1,show_date:!0,date_format:"short"}}renderPreview(e,t){const i=e,r=new Date,o={hour:"2-digit",minute:"2-digit",hour12:i.format_12h??!1};i.show_seconds&&(o.second="2-digit");const a=r.toLocaleTimeString(void 0,o),n=i.show_date?r.toLocaleDateString(void 0,{weekday:"short",month:"short",day:"numeric"}):"";return V`
      <div class="mc-module mc-clock">
        <span class="mc-clock-time">${a}</span>
        ${i.show_date?V`<span class="mc-clock-date">${n}</span>`:J}
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Ie("12-Hour Format",r.format_12h,e=>i({...r,format_12h:e}))}
        ${Ie("Show Seconds",r.show_seconds,e=>i({...r,show_seconds:e}))}
        ${Ie("Show Date",r.show_date,e=>i({...r,show_date:e}))}
        ${ze("Date Format",r.date_format,e=>i({...r,date_format:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"weather",name:"Weather",description:"Display weather entity information",category:"advanced",icon:"mdi:weather-partly-cloudy"}}createDefault(){return{id:Se("weather"),type:"weather",show_temperature:!0,show_condition:!0,show_forecast:!1,forecast_days:5}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=r?.attributes.temperature,a=r?.state||"unknown",n=r?.attributes.temperature_unit||"°C",s=this._conditionIcon(a);return V`
      <div class="mc-module mc-weather">
        <ha-icon icon=${s} style="--mdc-icon-size:36px"></ha-icon>
        <div>
          ${i.show_temperature&&void 0!==o?V`<div class="mc-weather-temp">${o}${n}</div>`:J}
          ${i.show_condition?V`<div class="mc-weather-condition">${a}</div>`:J}
        </div>
      </div>
    `}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${Oe("Weather Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Ie("Show Temperature",r.show_temperature,e=>i({...r,show_temperature:e}))}
        ${Ie("Show Condition",r.show_condition,e=>i({...r,show_condition:e}))}
        ${Ie("Show Forecast",r.show_forecast,e=>i({...r,show_forecast:e}))}
        ${r.show_forecast?Te("Forecast Days",r.forecast_days,e=>i({...r,forecast_days:e}),{min:1,max:7}):J}
      </div>
    `}_conditionIcon(e){return{"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant",exceptional:"mdi:alert-circle-outline"}[e]||"mdi:weather-partly-cloudy"}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"forecast",name:"Forecast",description:"Display weather forecast data",category:"advanced",icon:"mdi:calendar-week"}}createDefault(){return{id:Se("forecast"),type:"forecast",forecast_type:"daily",num_forecasts:5,show_temperature:!0,show_precipitation:!0,show_wind:!1}}renderPreview(e,t){const i=e,r=i.entity&&t?t.states[i.entity]:void 0,o=(r?.attributes.forecast||[]).slice(0,i.num_forecasts||5);return o.length?V`
      <div class="mc-module mc-forecast">
        ${o.map(e=>V`
            <div class="mc-forecast-item">
              <span style="font-size:0.75rem;color:var(--mc-text-secondary)">
                ${e.datetime?new Date(e.datetime).toLocaleDateString(void 0,{weekday:"short"}):""}
              </span>
              <ha-icon icon="mdi:weather-partly-cloudy" style="--mdc-icon-size:20px"></ha-icon>
              ${i.show_temperature?V`<span style="font-size:0.875rem">${e.temperature??"--"}°</span>`:J}
              ${i.show_precipitation&&void 0!==e.precipitation?V`<span style="font-size:0.75rem;color:var(--mc-text-secondary)">${e.precipitation}mm</span>`:J}
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
        ${Oe("Weather Entity",r.entity,e=>i({...r,entity:e}),t)}
        ${Ee("Forecast Type",r.forecast_type,[{label:"Daily",value:"daily"},{label:"Hourly",value:"hourly"}],e=>i({...r,forecast_type:e}))}
        ${Te("Number of Forecasts",r.num_forecasts,e=>i({...r,num_forecasts:e}),{min:1,max:10})}
        ${Ie("Show Temperature",r.show_temperature,e=>i({...r,show_temperature:e}))}
        ${Ie("Show Precipitation",r.show_precipitation,e=>i({...r,show_precipitation:e}))}
        ${Ie("Show Wind",r.show_wind,e=>i({...r,show_wind:e}))}
      </div>
    `}});we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"video-bg",name:"Video Background",description:"Display a video as a background",category:"advanced",icon:"mdi:video-outline"}}getAvailableTabs(){return["general","conditions","design"]}createDefault(){return{id:Se("video-bg"),type:"video-bg",autoplay:!0,loop:!0,muted:!0}}renderPreview(e,t){const i=e;return i.url?V`
      <div class="mc-module mc-video-bg">
        <video
          src=${i.url}
          poster=${i.poster||J}
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
        ${Ne("Video URL",r.url,e=>i({...r,url:e}),t,"video")}
        ${Ne("Poster Image URL",r.poster,e=>i({...r,poster:e}),t,"image")}
        ${Ie("Autoplay",r.autoplay,e=>i({...r,autoplay:e}))}
        ${Ie("Loop",r.loop,e=>i({...r,loop:e}))}
        ${Ie("Muted",r.muted,e=>i({...r,muted:e}))}
      </div>
    `}});const{I:Er}=pe,Ir=2;class Or{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}const Pr=(e,t)=>{const i=e._$AN;if(void 0===i)return!1;for(const e of i)e._$AO?.(t,!1),Pr(e,t);return!0},jr=e=>{let t,i;do{if(void 0===(t=e._$AM))break;i=t._$AN,i.delete(e),e=t}while(0===i?.size)},Dr=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(void 0===i)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),Lr(t)}};function Nr(e){void 0!==this._$AN?(jr(this),this._$AM=e,Dr(this)):this._$AM=e}function Rr(e,t=!1,i=0){const r=this._$AH,o=this._$AN;if(void 0!==o&&0!==o.size)if(t)if(Array.isArray(r))for(let e=i;e<r.length;e++)Pr(r[e],!1),jr(r[e]);else null!=r&&(Pr(r,!1),jr(r));else Pr(this,e)}const Lr=e=>{e.type==Ir&&(e._$AP??=Rr,e._$AQ??=Nr)};class Hr extends Or{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,t,i){super._$AT(e,t,i),Dr(this),this.isConnected=e._$AU}_$AO(e,t=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),t&&(Pr(this,e),jr(this))}setValue(e){if((e=>void 0===e.strings)(this._$Ct))this._$Ct._$AI(e,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=e,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}class Fr{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}}class Ur{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}}const Br=e=>!(e=>null===e||"object"!=typeof e&&"function"!=typeof e)(e)&&"function"==typeof e.then,Qr=1073741823;const Gr=(e=>(...t)=>({_$litDirective$:e,values:t}))(class extends Hr{constructor(){super(...arguments),this._$Cwt=Qr,this._$Cbt=[],this._$CK=new Fr(this),this._$CX=new Ur}render(...e){return e.find(e=>!Br(e))??K}update(e,t){const i=this._$Cbt;let r=i.length;this._$Cbt=t;const o=this._$CK,a=this._$CX;this.isConnected||this.disconnected();for(let e=0;e<t.length&&!(e>this._$Cwt);e++){const n=t[e];if(!Br(n))return this._$Cwt=e,n;e<r&&n===i[e]||(this._$Cwt=Qr,r=0,Promise.resolve(n).then(async e=>{for(;a.get();)await a.get();const t=o.deref();if(void 0!==t){const i=t._$Cbt.indexOf(n);i>-1&&i<t._$Cwt&&(t._$Cwt=i,t.setValue(e))}}))}return K}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}});let qr=null,Wr=null;async function Yr(){return qr||(Wr||(Wr=window.loadCardHelpers()),qr=await Wr,qr)}we.register(new class extends Tr{constructor(){super(...arguments),this.metadata={type:"custom-card",name:"Custom Card",description:"Embed any 3rd party Lovelace card",category:"advanced",icon:"mdi:card-plus-outline"},this._elementCache=new Map,this._editorCache=new Map}getAvailableTabs(){return["general","conditions","design"]}createDefault(){return{id:Se("custom-card"),type:"custom-card",name:"",card_type:"",card_config:{}}}renderPreview(e,t){const i=e;return i.card_type?V`
      <div class="mc-module mc-custom-card">
        ${Gr(this._getOrCreateElement(i,t),V`
          <div style="
            display: flex; align-items: center; justify-content: center;
            min-height: 60px; color: var(--secondary-text-color, #757575);
          ">Loading card...</div>
        `)}
      </div>
    `:V`
        <div class="mc-module mc-custom-card" style="
          display: flex; align-items: center; justify-content: center; gap: 8px;
          min-height: 80px; background: var(--divider-color, #e0e0e0);
          border-radius: 8px; color: var(--secondary-text-color, #757575);
          font-size: 0.875rem;
        ">
          <ha-icon icon="mdi:card-plus-outline" style="--mdc-icon-size: 28px;"></ha-icon>
          <span>No card type set</span>
        </div>
      `}async _getOrCreateElement(e,t){const i=this._elementCache.get(e.id),r=(o=e.card_type,a=e.card_config,JSON.stringify({t:o,c:a}));var o,a;let n;if(i&&i.cardType===e.card_type){if(n=i.element,i.hash!==r)try{const t={type:e.card_type,...e.card_config||{}};n.setConfig(t),i.hash=r}catch(e){return V`<div style="color: var(--error-color, #ef4444); padding: 12px; font-size: 0.875rem;">
            Error updating card config: ${String(e)}
          </div>`}}else try{const t=await Yr(),i={type:e.card_type,...e.card_config||{}};n=t.createCardElement(i),this._elementCache.set(e.id,{element:n,cardType:e.card_type,hash:r})}catch(t){return V`<div style="color: var(--error-color, #ef4444); padding: 12px; font-size: 0.875rem;">
          Failed to load card "${e.card_type}": ${String(t)}
        </div>`}return t&&(n.hass=t),V`${n}`}async _getOrCreateEditor(e,t,i){const r=e.card_type;if(!r)return null;const o=this._editorCache.get(e.id);if(o&&o.cardType===r)return o.editor;try{const o=await Yr(),a={type:r,...e.card_config||{}},n=o.createCardElement(a);await customElements.whenDefined(n.localName);const s=n.constructor;if("function"!=typeof s.getConfigElement)return this._editorCache.set(e.id,{editor:null,cardType:r,attempted:!0}),null;const c=await s.getConfigElement();c.localName?.includes("-")&&await customElements.whenDefined(c.localName),t&&(c.hass=t);try{c.setConfig(a)}catch{}return c.addEventListener("config-changed",t=>{const r=t.detail?.config;if(r){const{type:t,...o}=r;i({...e,card_config:o,card_config_yaml:void 0})}}),this._editorCache.set(e.id,{editor:c,cardType:r,attempted:!0}),c}catch{return this._editorCache.set(e.id,{editor:null,cardType:r,attempted:!0}),null}}renderGeneralTab(e,t,i){const r=e;return V`
      <div class="mc-tab-content">
        ${ze("Name",r.name,e=>i({...r,name:e}))}
        <div class="mc-field-hint" style="margin-top: -4px; margin-bottom: 8px;">
          An optional label to help you identify this card in the editor.
        </div>
        ${function(e,t,i){return V`
    <div class="mc-field">
      <label class="mc-field-label">${e}</label>
      <mc-card-picker
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-card-picker>
    </div>
  `}("Card Type",r.card_type,e=>{this._editorCache.delete(r.id),i({...r,card_type:e})})}
        ${r.card_type?V`
            <div class="mc-card-editor-section">
              <div class="mc-card-editor-header">
                <ha-icon icon="mdi:cog" style="--mdc-icon-size: 16px;"></ha-icon>
                Card Configuration
              </div>
              <div class="mc-card-editor-body">
                ${Gr(this._renderEditorContent(r,t,i),V`<div class="mc-editor-loading">Loading editor...</div>`)}
              </div>
            </div>
          `:J}
      </div>
      <style>
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
        .mc-editor-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
          color: var(--secondary-text-color, #757575);
          font-size: 0.875rem;
        }
      </style>
    `}async _renderEditorContent(e,t,i){const r=await this._getOrCreateEditor(e,t,i);if(r)return t&&(r.hass=t),V`${r}`;const o=e.card_config_yaml??(e.card_config?Wi(e.card_config):""),a=Yi(o);return V`
      <div class="mc-yaml-fallback">
        <div style="margin-bottom: 8px; font-size: 0.8125rem; color: var(--secondary-text-color, #6b7280);">
          No visual editor available for this card type. Configure using YAML:
        </div>
        <textarea
          .value=${o}
          @input=${t=>{const r=t.target.value,o=Yi(r);i(null!==o?{...e,card_config:o,card_config_yaml:r}:{...e,card_config_yaml:r})}}
          rows="12"
          placeholder="entity: sensor.temperature
name: My Sensor
show_state: true"
        ></textarea>
        ${""===o||null!==a?J:V`<div style="color: var(--error-color, #ef4444); font-size: 0.8125rem; margin-top: 4px;">
              Invalid YAML - card will use last valid configuration
            </div>`}
        <div style="margin-top: 4px; font-size: 0.75rem; color: var(--secondary-text-color, #6b7280);">
          The <code>type</code> key is set automatically from Card Type. Do not include it here.
        </div>
      </div>
    `}validate(e){const t=[];return e.card_type||t.push("Card type is required"),t}}),window.customCards=window.customCards||[],window.customCards.push({type:e,name:"Magic Card",description:"A fully open-source multi-module card with advanced editor",preview:!0,documentationURL:"https://github.com/your-repo/magic-card"}),console.info("%c MAGIC-CARD %c v0.0.99-beta4 ","color: white; background: #6366f1; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #6366f1; background: #e0e7ff; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;")})();