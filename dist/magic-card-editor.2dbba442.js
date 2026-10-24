"use strict";export const __webpack_esm_ids__=[8];export const __webpack_esm_modules__={4204(e,t,i){const o=["tube","cable","neon","zigzag"],n=["dot","arrow","chevron","square","diamond","star","comet","spark","bubble","drop","icon"],a=["even","pixels","random"],s=e=>{const t="string"==typeof e&&e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?t:void 0};i.d(t,["Rk",0,e=>{const t=e;if(o.includes(t.line_style))return!0;const i=a.includes(t.spacing_mode)?t.spacing_mode:void 0!==t.spacing?"pixels":"even",r=s(t.dots);if("pulse"===t.motion||!("even"!==i||void 0===r||Math.round(r)>0))return!1;const l=t.shape_alternate;return"random"===t.spacing_mode||(s(t.size_variation)??0)>0||"string"==typeof l&&n.includes(l)},"UO",0,s,"cb",0,n,"rz",0,a])},4191(e,t,i){i.d(t,["Ne",0,"mc-slider-look-editor","_6",0,"mc-flow-look-editor","o9",0,["color","idle_color","width","scale_width","glow","dots","dot_size"],"v4",0,["slider_color","track_color"]])},2061(e,t,i){i.d(t,{S8:()=>o.S});var o=i(8726);Object.freeze({path:"",viewBox:"0 0 24 24"}),i.d(t,["dD",0,{iconsList:"magic_card_utils/icons_list",iconsGet:"magic_card_utils/icons_get",iconsSave:"magic_card_utils/icons_save",iconsDelete:"magic_card_utils/icons_delete",shapesList:"magic_card_utils/shapes_list",shapesSave:"magic_card_utils/shapes_save",shapesDelete:"magic_card_utils/shapes_delete",themePresetsList:"magic_card_utils/theme_presets_list",themePresetsSave:"magic_card_utils/theme_presets_save",themePresetsDelete:"magic_card_utils/theme_presets_delete",subscribe:"magic_card_utils/subscribe_library"},"yK",0,/^[a-z0-9][a-z0-9_-]{0,63}$/])},2797(e,t,i){i.d(t,{_t:()=>n,wT:()=>c});const o=/(?:\b[a-z][a-z0-9+.-]*:\/\/|(?:^|[\s,("'])\/\/[^\s/)"'])/i;function n(e){return e.replace(/\\([0-9a-f]{1,6})[ \t\n\r\f]?|\\([\s\S])/gi,(e,t,i)=>{if(void 0===t)return i??"";const o=parseInt(t,16);return o>0&&o<=1114111&&(o<55296||o>57343)?String.fromCodePoint(o):"�"})}const a=/\burl\(\s*(?:"([^"\s()\\]*)"|'([^'\s()\\]*)'|([^"'\s()\\]*))\s*\)/gi,s=/^(?:\/local\/[\w\-./%~+=@,]*|#[\w-]+)$/,r=/\burl\(|(?:^|[^a-z0-9-])(?:-webkit-)?(?:image-set|image|src|cross-fade|element)\(|@import/i,l=/"[^"\\:/]*"|'[^'\\:/]*'/g;function c(e){if(e.length>4096||e.includes("\\")||e.includes("/*"))return!0;if(o.test(e)||/(?:^|[^a-z0-9+.-])(?:https?|wss?|ftp):/i.test(e))return!0;const t=e.replace(a,(e,t,i,o)=>{const n=t??i??o??"";return!s.test(n)||n.includes("//")||n.includes("..")?e:" "});return!!r.test(t)||/["']/.test(t.replace(l," "))}i.d(t,["Iz",0,"transfer","Lz",0,"magic_card_export","XH",0,1048576,"XW",0,1048576,"Y",0,"mc-library-open","Y9",0,/^card-mod-/i,"Z$",0,2097152,"hl",0,{"card-editor":["animation","shape","icon"],"shape-editor":["shape"],"svg-editor":["icon"],"animation-studio":["animation"],"theme-editor":["theme"],"mcu-panel":["icon","shape","animation","theme"]},"sQ",0,/url\(\s*["']?\/(?!\/)/i])},3034(e,t,i){i.d(t,["KV",0,"#ff9800","sh",0,"mc-svg-editor","ty",0,"#44739e","zh",0,"mc-shape-studio"])},6796(e,t,i){var o=i(6161),n=i(5707),a=i(105),s=i(158),r=i(9788),l=i(9100),c=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let d=class extends o.WF{constructor(){super(...arguments),this.value="",this.entityId="",this._windowCtrl=new r.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery="",this._selectedAttribute=""}_openModal(){this._selectedAttribute=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_handleSave(){this.value=this._selectedAttribute,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedAttribute},bubbles:!0,composed:!0})),this._closeModal()}_selectAttribute(e){this._selectedAttribute=e}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getAttributes(){if(!this.hass||!this.entityId)return[];const e=this.hass.states[this.entityId];return e?Object.entries(e.attributes).map(([e,t])=>({name:e,value:String(t??"")})).filter(e=>{if(!this._searchQuery)return!0;const t=this._searchQuery.toLowerCase();return e.name.toLowerCase().includes(t)||e.value.toLowerCase().includes(t)}).sort((e,t)=>e.name.localeCompare(t.name)):[]}_getAttributeValue(){if(!this.hass||!this.entityId||!this.value)return null;const e=this.hass.states[this.entityId];if(!e)return null;const t=e.attributes[this.value];return void 0!==t?String(t):null}render(){const e=this.hass&&this.entityId?this.hass.states[this.entityId]:void 0,t=e?Object.keys(e.attributes).sort((e,t)=>e.localeCompare(t)):[];if(!t.length)return o.qy`
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder=${(0,l.t)(1206)}
          aria-label=${(0,l.t)(105)}
          spellcheck="false"
          @input=${this._onInputChange}
        />
        ${this._showModal?this._renderModal():""}
      `;const i=this.value&&!t.includes(this.value)?[this.value,...t]:t;return o.qy`
      <div class="select">
        <select
          class="input"
          aria-label=${(0,l.t)(105)}
          .value=${this.value}
          @change=${e=>{this._onInputChange(e)}}
        >
          <option value="" ?selected=${!this.value}>${(0,l.t)(992)}</option>
          ${i.map(e=>o.qy`<option value=${e} ?selected=${e===this.value}>${e}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getAttributes();return o.qy`
      ${(0,r.bU)((0,l.t)(888),()=>this._closeModal(),"s",o.qy`
          <div class="mc-picker-search">
            ${(0,r.LW)((0,l.t)(870),this._searchQuery,e=>{this._searchQuery=e})}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${(0,l.t)(106)}>
            ${e.length>0?e.map(e=>o.qy`
                  <button
                    type="button"
                    role="option"
                    class="mc-picker-item"
                    aria-selected=${this._selectedAttribute===e.name?"true":"false"}
                    @click=${()=>this._selectAttribute(e.name)}
                  >
                    <span class="mc-picker-item-icon"><ha-icon icon="mdi:tag-text-outline"></ha-icon></span>
                    <span class="mc-picker-item-content">
                      <span class="mc-picker-item-name">${e.name}</span>
                      <span class="mc-picker-item-id" title=${e.value.length>500?e.value.slice(0,500)+"...":e.value}>${e.value.length>60?e.value.slice(0,60)+"...":e.value}</span>
                    </span>
                  </button>
                `):o.qy`<div class="mc-picker-empty">${(0,l.t)(626)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,l.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${(0,l.t)(860)}</button>
          </div>
      `)}
    `}};d.styles=[s.x,a.fz],c([(0,n.MZ)({attribute:!1})],d.prototype,"hass",void 0),c([(0,n.MZ)({type:String})],d.prototype,"value",void 0),c([(0,n.MZ)({type:String})],d.prototype,"entityId",void 0),c([(0,n.wk)()],d.prototype,"_showModal",void 0),c([(0,n.wk)()],d.prototype,"_searchQuery",void 0),c([(0,n.wk)()],d.prototype,"_selectedAttribute",void 0),d=c([(0,n.EM)("mc-attribute-picker")],d)},2377(e,t,i){var o=i(6161),n=i(5707),a=i(158),s=(i(7106),i(7681),i(9100)),r=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const l=["top","right","bottom","left"],c=["px","em","rem","%","vw","vh"],d={top:{label:1098,icon:"mdi:border-top-variant"},right:{label:833,icon:"mdi:border-right-variant"},bottom:{label:142,icon:"mdi:border-bottom-variant"},left:{label:511,icon:"mdi:border-left-variant"}},h={top:{label:1099,icon:"mdi:border-top-variant"},right:{label:1100,icon:"mdi:border-right-variant"},bottom:{label:144,icon:"mdi:border-bottom-variant"},left:{label:143,icon:"mdi:border-left-variant"}};function u(e){const[t,i=t,o=t,n=i]=function(e){const t=[];let i=0,o="";for(const n of e.slice(0,256).trim())"("===n?i++:")"===n&&(i=Math.max(0,i-1)),/\s/.test(n)&&0===i?(o&&t.push(o),o=""):o+=n;return o&&t.push(o),t.reduce((e,t)=>/^\d+(?:\.\d+)?%$/.test(t)&&"entity"===e[e.length-1]?[...e.slice(0,-1),`entity ${t}`]:[...e,t],[])}(e).slice(0,4);return void 0===t?void 0:{top:t,right:i,bottom:o,left:n}}const p={length:"0",style:"none",color:"currentcolor"};let m=class extends o.WF{constructor(){super(...arguments),this.design={},this.baseName="padding",this.shorthand=!1,this.value="",this.label="",this.cell="length",this.corners=!1,this.units=c,this.options=[],this.inherited="",this.entity=!1,this.entityColor="",this._linked=!1}_getSuffixKey(e,t){return"border_radius"===e&&{top:"border_top_left_radius",right:"border_top_right_radius",bottom:"border_bottom_right_radius",left:"border_bottom_left_radius"}[t]||`${e}_${t}`}_shorthandSides(){const e=String(this.design[this.baseName]??"").trim();if(!e)return;const[t,i=t,o=t,n=i]=e.split(/\s+/);return{top:t,right:i,bottom:o,left:n}}_getValue(e){const t=this._shorthandSides();if(t)return t[e];const i=this.design[this._getSuffixKey(this.baseName,e)];return null==i?"":String(i)}_emitSides(e){const t={[this.baseName]:void 0},i=this._shorthandSides();for(const o of l)void 0!==e[o]?t[this._getSuffixKey(this.baseName,o)]=e[o]:i?.[o]&&(t[this._getSuffixKey(this.baseName,o)]=i[o]);this.onChange(t)}_handleSideChange(e,t){this._linked?this._emitSides({top:t,right:t,bottom:t,left:t}):this._emitSides({[e]:t})}get _sh(){return u(this.value)}get _shLinked(){const e=this._sh;return(!e||e.top===e.right&&e.right===e.bottom&&e.bottom===e.left)&&(this._link??!0)}_shEmit(e){if(l.every(t=>!e[t]))return void this.onChange({[this.baseName]:void 0});const t=u(this.inherited),i=i=>e[i]||t?.[i]||p[this.cell];var o;this.onChange({[this.baseName]:(o={top:i("top"),right:i("right"),bottom:i("bottom"),left:i("left")},o.left===o.right?o.top===o.bottom?o.top===o.right?o.top:`${o.top} ${o.right}`:`${o.top} ${o.right} ${o.bottom}`:`${o.top} ${o.right} ${o.bottom} ${o.left}`)})}_shSide(e,t){"all"===e||this._shLinked?this._shEmit({top:t,right:t,bottom:t,left:t}):this._shEmit({...this._sh??{top:"",right:"",bottom:"",left:""},[e]:t})}_shToggle(){if(this._shLinked)return void(this._link=!1);this._link=!0;const e=this._sh?.top??"";this._shEmit({top:e,right:e,bottom:e,left:e})}_renderCell(e,t,i){const n=this._sh?.[e]??"",a=u(this.inherited)?.[e]??"",r=e=>this._shSide(t,e);if("color"===this.cell)return o.qy`<mc-color-picker data-side=${t} .value=${n} .label=${i} .placeholder=${n?"":a} .allowEntity=${this.entity} .entityColor=${this.entityColor} @value-changed=${e=>{e.stopPropagation(),r(String(e.detail.value??""))}}></mc-color-picker>`;if("style"===this.cell){const e=this.options.find(e=>e.value===a)?.label??a,l=n&&!this.options.some(e=>e.value===n)?[{value:n,label:n}]:[];return o.qy`<div class="select">
        <select class="input side-select" data-side=${t} aria-label=${i} @change=${e=>r(e.target.value)}>
          <option value="" ?selected=${!n}>${a?(0,s.t)(487,{value:e}):(0,s.t)(661)}</option>
          ${[...this.options,...l].map(e=>o.qy`<option value=${e.value} ?selected=${e.value===n}>${e.label}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>`}return o.qy`<mc-unit-field
      compact
      data-side=${t}
      .inputId=${`side-${t}`}
      .label=${i}
      .units=${this.units}
      .value=${n}
      .placeholder=${a.match(/^-?\d*\.?\d+/)?.[0]??"0"}
      @value-changed=${e=>{e.stopPropagation(),r(String(e.detail.value??""))}}
    ></mc-unit-field>`}_toggleLink(){if(this.shorthand)return void this._shToggle();if(this._linked=!this._linked,!this._linked)return;const e=this._getValue("top");e&&l.some(t=>this._getValue(t)!==e)&&this._emitSides({top:e,right:e,bottom:e,left:e})}_renderSide(e){const t="border_radius"===this.baseName||this.corners?h[e]:d[e],i=(0,s.t)(t.label),n=this._linked?"top":e;return o.qy`
      <div class="box-side">
        <span class="box-side-label" @click=${()=>this.renderRoot.querySelector(`[data-side="${e}"]`)?.focus()}>
          <ha-icon icon=${t.icon}></ha-icon>${i}
        </span>
        ${this.shorthand?this._renderCell(e,e,i):o.qy`<mc-unit-field
          compact
          data-side=${e}
          .inputId=${`side-${e}`}
          .label=${i}
          .units=${c}
          .value=${this._getValue(n)}
          @value-changed=${t=>{t.stopPropagation(),this._handleSideChange(e,String(t.detail.value??""))}}
        ></mc-unit-field>`}
      </div>
    `}render(){const e=this.shorthand&&this._shLinked;return o.qy`
      <div class="box">
        ${e?this._renderCell("top","all",this.label):o.qy`<div class="box-grid ${this.shorthand&&"length"!==this.cell?"one-col":""}">${l.map(e=>this._renderSide(e))}</div>`}
        <div class="box-foot">
          <button
            type="button"
            class="btn btn-text btn-sm"
            aria-pressed=${(this.shorthand?this._shLinked:this._linked)?"true":"false"}
            @click=${this._toggleLink}
          >
            <ha-icon icon="mdi:link-variant"></ha-icon>${(0,s.t)(859)}
          </button>
        </div>
      </div>
    `}};m.styles=[a.x,o.AH`
      :host {
        display: block;
        min-width: 0;
        container-type: inline-size;
      }
      .box {
        display: grid;
        gap: 8px;
      }
      .box-grid.one-col {
        grid-template-columns: minmax(0, 1fr);
      }
      .box-foot .btn[aria-pressed='true'] {
        background: var(--mc-accent-tint);
      }
      /* the 2x2 holds down to ~200px of field width (studio inspector, 360px pane); one column only below */
      @container (max-width: 200px) {
        .box-grid {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `],r([(0,n.MZ)({attribute:!1})],m.prototype,"design",void 0),r([(0,n.MZ)({attribute:!1})],m.prototype,"onChange",void 0),r([(0,n.MZ)({type:String})],m.prototype,"baseName",void 0),r([(0,n.MZ)({type:Boolean})],m.prototype,"shorthand",void 0),r([(0,n.MZ)({type:String})],m.prototype,"value",void 0),r([(0,n.MZ)({type:String})],m.prototype,"label",void 0),r([(0,n.MZ)({type:String})],m.prototype,"cell",void 0),r([(0,n.MZ)({type:Boolean})],m.prototype,"corners",void 0),r([(0,n.MZ)({attribute:!1})],m.prototype,"units",void 0),r([(0,n.MZ)({attribute:!1})],m.prototype,"options",void 0),r([(0,n.MZ)({type:String})],m.prototype,"inherited",void 0),r([(0,n.MZ)({type:Boolean})],m.prototype,"entity",void 0),r([(0,n.MZ)({type:String})],m.prototype,"entityColor",void 0),r([(0,n.wk)()],m.prototype,"_linked",void 0),r([(0,n.wk)()],m.prototype,"_link",void 0),m=r([(0,n.EM)("mc-box-field")],m)},7681(e,t,i){var o=i(6161),n=i(5707),a=i(105),s=i(158),r=i(9788),l=i(3925),c=i(6990),d=i(9136),h=i(7423),u=i(5115);const p=["HEXA","RGBA","HSLA","OKLCH"],m=/^(\d+(?:\.\d+)?|\.\d+)(%|deg)?$/,g=/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/,f=/^(rgba?|hsla?|oklch)\(([^()]*)\)$/,v=(e,t,i)=>Math.min(i,Math.max(t,e));function b(e){const t=e.trim().toLowerCase();if(!t||t.length>80)return null;const i=g.exec(t);if(i){let e=i[1];e.length<=4&&(e=[...e].map(e=>e+e).join(""));const t=t=>parseInt(e.slice(t,t+2),16);return{r:t(0),g:t(2),b:t(4),a:8===e.length?t(6)/255:1,wide:!1}}const o=f.exec(t);if(!o)return null;const n=function(e){const t=e.trim().split(/[\s,/]+/);if(t.length<3||t.length>4)return null;const i=[];for(const e of t){const t=m.exec(e);if(!t)return null;i.push({n:Number(t[1]),unit:t[2]??""})}return i}(o[2]);if(!n)return null;const a=(s=n[3])?v("%"===s.unit?s.n/100:s.n,0,1):1;var s;if(o[1].startsWith("rgb")){const e=e=>v("%"===e.unit?2.55*e.n:e.n,0,255);return{r:e(n[0]),g:e(n[1]),b:e(n[2]),a,wide:!1}}if(o[1].startsWith("hsl")){const[e,t,i]=function(e,t,i){const o=t=>(t+e/30)%12,n=t*Math.min(i,1-i);return[0,8,4].map(e=>255*(i-n*Math.max(-1,Math.min(o(e)-3,Math.min(9-o(e),1)))))}(n[0].n%360,v(n[1].n,0,100)/100,v(n[2].n,0,100)/100);return{r:e,g:t,b:i,a,wide:!1}}const{rgb:r,wide:l}=function(e,t,i){const o=t*Math.cos(i*Math.PI/180),n=t*Math.sin(i*Math.PI/180),a=(e+.3963377774*o+.2158037573*n)**3,s=(e-.1055613458*o-.0638541728*n)**3,r=(e-.0894841775*o-1.291485548*n)**3,l=[4.0767416621*a-3.3077115913*s+.2309699292*r,-1.2684380046*a+2.6097574011*s-.3413193965*r,-.0041960863*a-.7034186147*s+1.707614701*r],c=l.some(e=>e<-5e-4||e>1.0005);return{rgb:l.map(e=>255*v((e=>e<=.0031308?12.92*e:1.055*e**(1/2.4)-.055)(e),0,1)),wide:c}}(v("%"===n[0].unit?n[0].n/100:n[0].n,0,1),"%"===n[1].unit?.4*n[1].n/100:n[1].n,n[2].n%360);return{r:r[0],g:r[1],b:r[2],a,wide:l}}const y=(e,t)=>String(+e.toFixed(t));i(7106);var _=i(9100),w=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const $="magic-card-saved-colors",k=["#ffffff","#f3f4f6","#d1d5db","#9ca3af","#6b7280","#374151","#1f2937","#000000","#ef4444","#f97316","#eab308","#22c55e","#14b8a6","#3b82f6","#8b5cf6","#ec4899","#fecaca","#fed7aa","#fef08a","#bbf7d0","#99f6e4","#bfdbfe","#ddd6fe","#fbcfe8","var(--primary-color)","var(--accent-color)","var(--primary-text-color)","var(--secondary-text-color)","var(--card-background-color)","var(--divider-color)","var(--success-color)","var(--error-color)"];let x=class extends o.WF{constructor(){super(...arguments),this.value="",this.label="",this.placeholder="",this.allowEntity=!1,this.entityColor="",this.allowAttribute=!1,this.gradient="",this.gradientNote="",this._status="",this._isOpen=!1,this._hsva={h:0,s:100,v:100,a:1},this._savedColors=[],this._hexInput="",this._format="HEXA",this._asWritten="",this._windowCtrl=new r.HK(this,()=>this._closeModal()),this._dragging=null,this._refocusToggle=!1,this._handleAreaPointerDown=e=>{this._dragging="area",e.target.setPointerCapture(e.pointerId),this._updateArea(e)},this._handleHuePointerDown=e=>{this._dragging="hue",e.target.setPointerCapture(e.pointerId),this._updateHue(e)},this._handleOpacityPointerDown=e=>{this._dragging="opacity",e.target.setPointerCapture(e.pointerId),this._updateOpacity(e)},this._handlePointerMove=e=>{this._dragging&&("area"===this._dragging?this._updateArea(e):"hue"===this._dragging?this._updateHue(e):"opacity"===this._dragging&&this._updateOpacity(e))},this._handlePointerUp=()=>{this._dragging=null}}connectedCallback(){super.connectedCallback(),this._loadSavedColors(),this._parseValue(this.value)}updated(e){this._refocusToggle&&(this._refocusToggle=!1,this.renderRoot.querySelector(".entity-toggle")?.focus()),e.has("value")&&!this._isOpen&&this._parseValue(this.value)}_loadSavedColors(){try{const e=localStorage.getItem($);this._savedColors=e?JSON.parse(e):[]}catch{this._savedColors=[]}}_saveSavedColors(){try{localStorage.setItem($,JSON.stringify(this._savedColors))}catch{}}_parseValue(e){if(this._asWritten="",!e)return this._hsva={h:0,s:0,v:100,a:1},this._hexInput="",void(this._format="HEXA");if(this._format=function(e){const t=e.trim().slice(0,8).toLowerCase();return t.startsWith("rgb")?"RGBA":t.startsWith("hsl")?"HSLA":t.startsWith("oklch")?"OKLCH":"HEXA"}(e),e.startsWith("var("))return void(this._hexInput=e);const t=this._colorToHsva(e);t?(this._hsva=t,this._hexInput=this._text(t),b(e)?.wide&&(this._asWritten=this._hexInput=e.trim())):this._hexInput=e}_text(e){return function(e,t){const i={r:Math.round(e.r),g:Math.round(e.g),b:Math.round(e.b),a:e.a},o=i.a<1;if("HEXA"===t)return"#"+[i.r,i.g,i.b,...o?[Math.round(255*i.a)]:[]].map(e=>e.toString(16).padStart(2,"0")).join("");if("RGBA"===t)return o?`rgba(${i.r}, ${i.g}, ${i.b}, ${y(i.a,2)})`:`rgb(${i.r}, ${i.g}, ${i.b})`;if("HSLA"===t){const[e,t,n]=function({r:e,g:t,b:i}){const[o,n,a]=[e/255,t/255,i/255],s=Math.max(o,n,a),r=Math.min(o,n,a),l=s-r,c=(s+r)/2;return 0===l?[0,0,100*c]:[60*(s===o?(n-a)/l+(n<a?6:0):s===n?(a-o)/l+2:(o-n)/l+4),l/(1-Math.abs(2*c-1))*100,100*c]}(i),a=`${y(e,1)}, ${y(t,1)}%, ${y(n,1)}%`;return o?`hsla(${a}, ${y(i.a,2)})`:`hsl(${a})`}const[n,a,s]=function({r:e,g:t,b:i}){const[o,n,a]=[e,t,i].map(e=>(e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4)(e/255)),s=Math.cbrt(.4122214708*o+.5363325363*n+.0514459929*a),r=Math.cbrt(.2119034982*o+.6806995451*n+.1073969566*a),l=Math.cbrt(.0883024619*o+.2817188376*n+.6299787005*a),c=.2104542553*s+.793617785*r-.0040720468*l,d=1.9779984951*s-2.428592205*r+.4505937099*l,h=.0259040371*s+.7827717662*r-.808675766*l,u=Math.hypot(d,h);return[100*c,u,u<1e-4?0:(180*Math.atan2(h,d)/Math.PI+360)%360]}(i);return`oklch(${y(n,2)}% ${y(a,4)} ${y(s,2)}${o?` / ${y(i.a,2)}`:""})`}(this._hsvaToRgb(e),this._format)}_setHsva(e){this._hsva=e,this._asWritten="",this._hexInput=this._text(e)}_setFormat(e){this._format=e,!this._hexInput.startsWith("var(")&&this._colorToHsva(this._hexInput)&&(this._asWritten="",this._hexInput=this._text(this._hsva))}async _pipette(){const e=window.EyeDropper;if(e)try{this._selectPreset((await(new e).open()).sRGBHex)}catch{}}_colorToHsva(e){const t=b(e);return t?this._rgbToHsva(t.r/255,t.g/255,t.b/255,t.a):null}_rgbToHsva(e,t,i,o){const n=Math.max(e,t,i),a=n-Math.min(e,t,i),s=100*n,r=0===n?0:a/n*100;let l=0;if(0!==a)switch(n){case e:l=60*((t-i)/a+(t<i?6:0));break;case t:l=60*((i-e)/a+2);break;case i:l=60*((e-t)/a+4)}return{h:l,s:r,v:s,a:o}}_hsvaToRgb(e){const t=e.h/60,i=e.s/100,o=e.v/100,n=o*i,a=n*(1-Math.abs(t%2-1)),s=o-n;let r=0,l=0,c=0;return t<1?(r=n,l=a):t<2?(r=a,l=n):t<3?(l=n,c=a):t<4?(l=a,c=n):t<5?(r=a,c=n):(r=n,c=a),{r:Math.round(255*(r+s)),g:Math.round(255*(l+s)),b:Math.round(255*(c+s)),a:e.a}}_hsvaToHex(e){const t=this._hsvaToRgb(e),i="#"+t.r.toString(16).padStart(2,"0")+t.g.toString(16).padStart(2,"0")+t.b.toString(16).padStart(2,"0");return e.a<1?i+Math.round(255*e.a).toString(16).padStart(2,"0"):i}_hsvaToRgbaString(e){const t=this._hsvaToRgb(e);return e.a<1?`rgba(${t.r}, ${t.g}, ${t.b}, ${e.a.toFixed(2)})`:`rgb(${t.r}, ${t.g}, ${t.b})`}_getCurrentColor(){return this._hexInput.startsWith("var(")?this._hexInput:this._asWritten||this._text(this._hsva)}_emitChange(){const e=this._getCurrentColor();this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_openModal(){this._parseValue(this.value),this._isOpen=!0}_closeModal(){this._isOpen=!1}_handleSave(){this._emitChange(),this._closeModal()}_updateArea(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),o=Math.max(0,Math.min(1,(e.clientY-t.top)/t.height));this._setHsva({...this._hsva,s:100*i,v:100*(1-o)})}_updateHue(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._setHsva({...this._hsva,h:360*i})}_updateOpacity(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._setHsva({...this._hsva,a:i})}_handleHexInput(e){const t=e.target.value;this._hexInput=t;const i=this._colorToHsva(t);i&&(this._hsva=i,this._asWritten="")}_selectPreset(e){if(e.startsWith("var("))this._hexInput=e;else{const t=this._colorToHsva(e);t&&this._setHsva(t)}}_addSavedColor(){const e=this._getCurrentColor();this._savedColors.includes(e)||(this._savedColors=[e,...this._savedColors].slice(0,12),this._saveSavedColors())}_removeSavedColor(e,t){t.stopPropagation(),this._savedColors=this._savedColors.filter(t=>t!==e),this._saveSavedColors()}_handleTextInput(e){const t=e.target.value;this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:t}}))}_emitValue(e){this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_renderEntityToggle(e){return this.allowEntity?o.qy`<button
      type="button"
      class="icon-btn entity-toggle"
      aria-pressed=${e?"true":"false"}
      aria-label=${(0,_.t)(360,{name:(this.label||(0,_.t)(1209)).toLowerCase()})}
      title=${(0,_.t)(1143)}
      @click=${()=>{this._refocusToggle=!0,this._emitValue(e?"":"entity")}}
    >
      <ha-icon icon="mdi:palette-swatch-variant"></ha-icon>
    </button>`:o.s6}_renderEntity(e,t){let i=this.entityColor||"currentColor";const n=t?(0,l.Rw)(this.entityAttributes,t):void 0;t&&(i=n?`rgb(${n.join(", ")})`:"transparent");const a=e>=100?i:`color-mix(in srgb, ${i} ${e}%, transparent)`,s=this.label||(0,_.t)(1209),r=(e,t)=>this._emitValue(`entity${e?`.${e}`:""}${t<100?` ${+t.toFixed(2)}%`:""}`);return o.qy`
      <div class="color">
        <button type="button" class="swatch" disabled aria-hidden="true" tabindex="-1" title=${(0,_.t)(1043)}>
          <span class="swatch-fill"><span style="background: ${a}"></span></span>
        </button>
        <input class="input" type="text" readonly .value=${(0,_.t)(359)} aria-label=${s} />
        ${this._renderEntityToggle(!0)}
      </div>
      ${this.allowAttribute?this._renderSource(t,t=>r(t,e)):o.s6}
      <div class="field entity-opacity">
        <div class="field-head"><span class="lbl">${(0,_.t)(685)}</span></div>
        <mc-unit-field
          .value=${e>=100?"":`${e}%`}
          .label=${(0,_.t)(1277,{name:s})}
          .units=${["%"]}
          placeholder="100"
          @value-changed=${e=>{e.stopPropagation();const i=parseFloat(String(e.detail.value));r(t,Number.isFinite(i)&&i>=0&&i<100?i:100)}}
        ></mc-unit-field>
      </div>
    `}_renderSource(e,t){const i=this.entityAttributes,n=i?Object.keys(i).filter(e=>/^[a-z0-9_]{1,64}$/.test(e)&&(0,l.Rw)(i,e)).sort():[];return e&&!n.includes(e)&&n.push(e),o.qy`
      <div class="field">
        <label class="lbl" for=${"src"}>${(0,_.t)(207)}</label>
        <select class="input" id=${"src"} aria-label=${(0,_.t)(1281,{name:this.label||(0,_.t)(1209)})} @change=${e=>t(e.target.value||void 0)}>
          <option value="" ?selected=${!e}>${(0,_.t)(993)}</option>
          ${n.map(t=>o.qy`<option value=${t} ?selected=${t===e}>${t}</option>`)}
        </select>
      </div>
    `}_toSolid(e){this._status=(0,_.t)(1012),this._emitValue(e.stops[0])}_toGradient(){const e=(0,d.wb)(this.value),t=(0,h.f8)(this.value),i=t&&!(0,l.qB)(t)?t:"var(--primary-color)",o="var(--accent-color)"===i?"#ffffff":"var(--accent-color)",n=e?{radial:e.radial&&"css"===this.gradient,angle:e.angle,stops:e.stops.slice(0,5)}:{radial:!1,angle:135,stops:[i,o]};this._status=e?(0,_.t)(430):(0,_.t)(427),this._emitValue((0,u.Pz)(n))}_renderMode(e){const t=this.label||(0,_.t)(1209);return o.qy`${(0,u.iJ)((0,_.t)(1276,{name:t}),e?"gradient":"solid",[{value:"solid",label:(0,_.t)(974)},{value:"gradient",label:(0,_.t)(425)}],t=>{"solid"===t&&e?this._toSolid(e):"gradient"!==t||e||this._toGradient()})}`}_entityValue(){const e=this.value.trim().match(c.z8);return!e||!this.allowAttribute&&e[1]?void 0:{attr:e[1],opacity:Math.min(100,Number(e[2]??100))}}render(){const e=this.allowEntity?this._entityValue():void 0,t=this.gradient?(0,u.Tf)(this.value,"css"===this.gradient):void 0,i=!!this.gradient&&!t&&/gradient\(/i.test(this.value),n=e?this._renderEntity(e.opacity,e.attr):t?this._renderGradient(t):this._renderSolid();return o.qy`
      ${this.gradient?this._renderMode(t):o.s6}
      ${n}
      ${i?o.qy`<div class="help">${(0,_.t)(1071)}</div>`:o.s6}
      ${t&&this.gradientNote?o.qy`<div class="help">${this.gradientNote}</div>`:o.s6}
      ${this.gradient?o.qy`<div class="help" role="status" aria-live="polite">${this._status}</div>`:o.s6}
    `}_renderGradient(e){return o.qy`<mc-gradient-editor
      .model=${e}
      .label=${this.label||(0,_.t)(1209)}
      .allowRadial=${"css"===this.gradient}
      @value-changed=${()=>this._status=""}
    ></mc-gradient-editor>`}_renderSolid(){const e=!this.value&&!!this.placeholder,t=this.value||this.placeholder||"transparent",i=this.label||(0,_.t)(1209);return o.qy`
      <div class="color">
        <button
          type="button"
          class="swatch"
          aria-label=${(0,_.t)(745,{name:i.toLowerCase()})}
          title=${(0,_.t)(689)}
          @click=${this._openModal}
        >
          <span class="swatch-fill" data-hint=${e?"":o.s6}><span style="background: ${t}"></span></span>
        </button>
        <input
          class="input mono"
          type="text"
          spellcheck="false"
          .value=${this.value||""}
          placeholder=${this.placeholder||"#rrggbb or var(--name)"}
          aria-label=${i}
          @input=${this._handleTextInput}
          @focus=${e=>e.target.select()}
        />
        ${this._renderEntityToggle(!1)}
      </div>
      ${this._isOpen?this._renderModal():o.s6}
    `}_renderModal(){const e=this._hsvaToRgb(this._hsva),t=`hsl(${this._hsva.h}, 100%, 50%)`,i=this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToRgbaString(this._hsva);return o.qy`
      ${(0,r.bU)((0,_.t)(208),()=>this._closeModal(),"s",o.qy`

          <div class="mc-color-body">
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
                class="input"
                type="text"
                inputmode="numeric"
                aria-label=${(0,_.t)(460)}
                .value=${Math.round(this._hsva.h).toString()}
                @input=${e=>{const t=parseInt(e.target.value)||0;this._setHsva({...this._hsva,h:Math.max(0,Math.min(360,t))})}}
              />
            </div>

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
                class="input"
                type="text"
                inputmode="numeric"
                aria-label=${(0,_.t)(686)}
                .value=${Math.round(100*this._hsva.a).toString()}
                @input=${e=>{const t=parseInt(e.target.value)||0;this._setHsva({...this._hsva,a:Math.max(0,Math.min(100,t))/100})}}
              />
            </div>

            <div class="mc-color-tools">
              ${(0,u.iJ)((0,_.t)(206),this._format,p.map(e=>({value:e,label:e})),e=>this._setFormat(e))}
              ${"EyeDropper"in window?o.qy`<button
                    type="button"
                    class="icon-btn"
                    title=${(0,_.t)(729)}
                    aria-label=${(0,_.t)(729)}
                    @click=${()=>{this._pipette()}}
                  >
                    <ha-icon icon="mdi:eyedropper"></ha-icon>
                  </button>`:o.s6}
            </div>

            <div class="mc-input-row">
              <label class="field">
                <span class="lbl">${this._format}</span>
                <input class="input" type="text" spellcheck="false" .value=${this._hexInput} @input=${this._handleHexInput} />
              </label>
              <label class="field">
                <span class="lbl">R</span>
                <input class="input" type="text" .value=${e.r.toString()} readonly />
              </label>
              <label class="field">
                <span class="lbl">G</span>
                <input class="input" type="text" .value=${e.g.toString()} readonly />
              </label>
              <label class="field">
                <span class="lbl">B</span>
                <input class="input" type="text" .value=${e.b.toString()} readonly />
              </label>
            </div>

            <div class="mc-color-section">
              <span class="mc-color-section-header">${(0,_.t)(767)}</span>
              <div class="mc-color-grid">
                ${k.map(e=>o.qy`
                  <button
                    type="button"
                    class="mc-color-swatch ${e.startsWith("var(")?"var-color":""}"
                    style="background: ${e}"
                    title=${e}
                    aria-label=${e}
                    @click=${()=>this._selectPreset(e)}
                  >${e.startsWith("var(")?o.qy`<span class="var-tag">${"var"}</span>`:""}</button>
                `)}
              </div>
            </div>

            <div class="mc-color-section">
              <span class="mc-color-section-header">${(0,_.t)(865)}</span>
              <div class="mc-saved-colors">
                ${this._savedColors.map(e=>o.qy`
                  <div class="mc-saved-swatch" style="background: ${e}">
                    <button
                      type="button"
                      class="mc-saved-pick"
                      title=${e}
                      aria-label=${(0,_.t)(1145,{value:e})}
                      @click=${()=>this._selectPreset(e)}
                    ></button>
                    <button
                      type="button"
                      class="mc-remove-btn"
                      aria-label=${(0,_.t)(796,{value:e})}
                      @click=${t=>this._removeSavedColor(e,t)}
                    >
                      <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                  </div>
                `)}
                <button
                  type="button"
                  class="icon-btn sm"
                  title=${(0,_.t)(862)}
                  aria-label=${(0,_.t)(862)}
                  @click=${this._addSavedColor}
                >
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>
              </div>
            </div>
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,_.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${(0,_.t)(860)}</button>
          </div>
      `)}
    `}};x.styles=[s.x,a.fz,a.yg,o.AH`
      mc-gradient-editor + .help,
      .help + .help {
        margin-top: 6px;
      }
      .mc-color-tools {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .mc-color-tools .seg {
        flex: 1;
      }
      .help:empty {
        display: none;
      }
      /* an empty field that takes this colour from the design below: dimmed, hatched */
      .swatch-fill[data-hint] > span {
        opacity: 0.5;
      }
      .swatch-fill[data-hint] {
        background-image: repeating-linear-gradient(135deg, transparent 0 3px, color-mix(in srgb, var(--mc-text) 35%, transparent) 3px 4px);
      }
    `],w([(0,n.MZ)({type:String})],x.prototype,"value",void 0),w([(0,n.MZ)({type:String})],x.prototype,"label",void 0),w([(0,n.MZ)({type:String})],x.prototype,"placeholder",void 0),w([(0,n.MZ)({type:Boolean})],x.prototype,"allowEntity",void 0),w([(0,n.MZ)({type:String})],x.prototype,"entityColor",void 0),w([(0,n.MZ)({type:Boolean})],x.prototype,"allowAttribute",void 0),w([(0,n.MZ)({attribute:!1})],x.prototype,"entityAttributes",void 0),w([(0,n.MZ)({type:String})],x.prototype,"gradient",void 0),w([(0,n.MZ)({type:String})],x.prototype,"gradientNote",void 0),w([(0,n.wk)()],x.prototype,"_status",void 0),w([(0,n.wk)()],x.prototype,"_isOpen",void 0),w([(0,n.wk)()],x.prototype,"_hsva",void 0),w([(0,n.wk)()],x.prototype,"_savedColors",void 0),w([(0,n.wk)()],x.prototype,"_hexInput",void 0),w([(0,n.wk)()],x.prototype,"_format",void 0),x=w([(0,n.EM)("mc-color-picker")],x)},2928(e,t,i){i.d(t,{_:()=>r});var o=i(6161),n=i(886),a=i(9100);const s=["#4caf50","#ff9800","#f44336","#2196f3"];function r(e,t,i,r={}){const l=Array.isArray(t)?t:[],c=e=>i(e.length?e:void 0),d=(e,t)=>c(l.map((i,o)=>o===e?{...i,...t}:i));return o.qy`
    <div class="mc-field mc-color-ranges">
      ${(0,n.XT)(e,r.propertyName,r.syncCtx)}
      ${r.help?o.qy`<p class="help">${r.help}</p>`:o.s6}
      <div class="range-list">
        ${l.map((e,t)=>o.qy`
            <div class="cond">
              <div class="cond-head">
                <span class="n">${(0,a.t)(783,{n:t+1})} <span class="sub">· ${(0,a.t)(1220,{value:e.from})}</span></span>
                <button
                  type="button"
                  class="icon-btn sm danger"
                  aria-label=${(0,a.t)(290,{n:t+1})}
                  title=${(0,a.t)(289)}
                  @click=${()=>c(l.filter((e,i)=>i!==t))}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>
              </div>
              ${void 0!==e.to&&null!==e.to?o.qy`<p class="help">${(0,a.t)(355,{value:e.to})}</p>`:o.s6}
              <div class="two">
                ${(0,n.aA)((0,a.t)(402),e.from,e=>d(t,{from:e}))}
                ${(0,n.Yd)((0,a.t)(205),e.color,e=>d(t,{color:e}))}
              </div>
            </div>
          `)}
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${()=>{const e=l.length?Number(l[l.length-1].from):void 0,t=r.min??0,i=r.max??100,o=void 0!==e&&Number.isFinite(e)?Math.min(i,e+Math.max(1,Math.round((i-t)/4))):t;c([...l,{from:o,color:s[l.length%s.length]}])}}>
            <ha-icon icon="mdi:plus"></ha-icon>${(0,a.t)(49)}
          </button>
        </div>
      </div>
    </div>
  `}},8006(e,t,i){async function o(e,t){try{if(!1!==window.isSecureContext&&navigator.clipboard?.writeText)return await navigator.clipboard.writeText(e),!0}catch{}const i=document.createElement("textarea");i.value=e,i.setAttribute("readonly",""),i.setAttribute("aria-hidden","true"),Object.assign(i.style,{position:"fixed",top:"0",left:"0",width:"1px",height:"1px",opacity:"0",pointerEvents:"none"});try{return t.appendChild(i),i.select(),"function"==typeof document.execCommand&&!0===document.execCommand("copy")}catch{return!1}finally{i.remove()}}i.d(t,{D:()=>o})},4121(e,t,i){var o=i(6161),n=i(5707),a=i(105),s=i(158),r=i(9788),l=i(8477),c=i(9100),d=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let h=class extends o.WF{constructor(){super(...arguments),this.value="",this.label="",this.placeholder="entity_id",this.domain="",this.strict=!1,this.preferred=[],this.help="",this._windowCtrl=new r.HK(this,()=>this._closeModal()),this._showModal=!1,this._typed="",this._searchQuery="",this._selectedEntityId=""}focusInput(){this.renderRoot.querySelector("input")?.focus()}open(){this._openModal()}_openModal(){this._selectedEntityId=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_handleSave(){this.value=this._selectedEntityId,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedEntityId},bubbles:!0,composed:!0})),this._closeModal()}_selectEntity(e){this._selectedEntityId=e}_onInputChange(e){const t=e.target.value;this.strict?this._typed=t:(this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0})))}_getFilteredEntities(){return this.hass?Object.entries(this.hass.states).filter(([e])=>!(this.domain&&!e.startsWith(this.domain+"."))).map(([e,t])=>({id:e,name:t.attributes.friendly_name||e,state:this.hass.formatEntityState(t),icon:(0,l.fq)(this.hass,e)||this._domainIcon(e.split(".")[0])})).filter(e=>{if(!this._searchQuery)return!0;const t=this._searchQuery.toLowerCase();return e.id.toLowerCase().includes(t)||e.name.toLowerCase().includes(t)}).sort((e,t)=>this._rank(e.id)-this._rank(t.id)||e.name.localeCompare(t.name)).slice(0,100):[]}_rank(e){return this.preferred.includes(e.split(".")[0])?0:1}_commit(e){const t=e.target,i=t.value;""===i||this.hass?.states[i]?(this.value=i,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:i},bubbles:!0,composed:!0}))):t.value=this.value}_suggestions(){const e=this._typed.toLowerCase();return Object.keys(this.hass?.states??{}).filter(t=>(!this.domain||t.startsWith(this.domain+"."))&&t.includes(e)).sort((e,t)=>this._rank(e)-this._rank(t)||e.localeCompare(t)).slice(0,20)}_getEntityInfo(){if(!this.hass||!this.value)return null;const e=this.hass.states[this.value];return e?{name:e.attributes.friendly_name||this.value,icon:(0,l.fq)(this.hass,this.value)||this._domainIcon(this.value.split(".")[0]),state:e.state,stateText:this.hass.formatEntityState(e)}:null}_dotClass(e){return"unavailable"===e||"unknown"===e?"dot is-unavailable":"off"===e||"closed"===e||"not_home"===e||"idle"===e?"dot is-off":"dot"}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",sensor:"mdi:eye",binary_sensor:"mdi:checkbox-marked-circle",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",person:"mdi:account",weather:"mdi:weather-partly-cloudy",sun:"mdi:white-balance-sunny",vacuum:"mdi:robot-vacuum",water_heater:"mdi:water-boiler",humidifier:"mdi:air-humidifier",alarm_control_panel:"mdi:shield-home"}[e]||"mdi:help-circle"}render(){const e=this._getEntityInfo(),t=e?.icon||(this.value.includes(".")?this._domainIcon(this.value.split(".")[0]):"mdi:shape-outline");return o.qy`
      <div class="with-icon with-action">
        <ha-icon icon=${t}></ha-icon>
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder=${this.placeholder}
          aria-label=${this.label||(0,c.t)(357)}
          aria-describedby=${this.help?"help":o.s6}
          list=${this.strict?"ids":o.s6}
          spellcheck="false"
          @input=${this._onInputChange}
          @change=${this.strict?this._commit:o.s6}
        />
        ${this.strict?o.qy`<datalist id="ids">${this._suggestions().map(e=>o.qy`<option value=${e}></option>`)}</datalist>`:o.s6}
        <button
          type="button"
          class="icon-btn sm field-action browse"
          aria-label=${(0,c.t)(148)}
          title=${(0,c.t)(148)}
          @click=${this._openModal}
        >
          <ha-icon icon="mdi:magnify"></ha-icon>
        </button>
      </div>
      ${e?o.qy`
            <p class="entity-meta">
              <span class=${this._dotClass(e.state)}></span>
              <span>${e.name} · ${e.stateText}</span>
            </p>
          `:""}
      ${this.help?o.qy`<p class="help" id="help">${this.help}</p>`:o.s6}

      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getFilteredEntities();return o.qy`
      ${(0,r.bU)((0,c.t)(890),()=>this._closeModal(),"l",o.qy`
          <div class="mc-picker-search">
            ${(0,r.LW)((0,c.t)(872),this._searchQuery,e=>{this._searchQuery=e})}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${(0,c.t)(356)}>
            ${e.length>0?e.map(e=>o.qy`
                  <button
                    type="button"
                    role="option"
                    class="mc-picker-item"
                    aria-selected=${this._selectedEntityId===e.id?"true":"false"}
                    @click=${()=>this._selectEntity(e.id)}
                  >
                    <span class="mc-picker-item-icon"><ha-icon icon=${e.icon}></ha-icon></span>
                    <span class="mc-picker-item-content">
                      <span class="mc-picker-item-name">${e.name}</span>
                      <span class="mc-picker-item-id" title=${e.id}>${e.id}</span>
                    </span>
                    <span class="chip">${e.state}</span>
                  </button>
                `):o.qy`<div class="mc-picker-empty">${(0,c.t)(630)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,c.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${(0,c.t)(860)}</button>
          </div>
      `)}
    `}};h.styles=[s.x,a.fz],d([(0,n.MZ)({attribute:!1})],h.prototype,"hass",void 0),d([(0,n.MZ)({type:String})],h.prototype,"value",void 0),d([(0,n.MZ)({type:String})],h.prototype,"label",void 0),d([(0,n.MZ)({type:String})],h.prototype,"placeholder",void 0),d([(0,n.MZ)({type:String})],h.prototype,"domain",void 0),d([(0,n.MZ)({type:Boolean})],h.prototype,"strict",void 0),d([(0,n.MZ)({attribute:!1})],h.prototype,"preferred",void 0),d([(0,n.MZ)({type:String})],h.prototype,"help",void 0),d([(0,n.wk)()],h.prototype,"_showModal",void 0),d([(0,n.wk)()],h.prototype,"_typed",void 0),d([(0,n.wk)()],h.prototype,"_searchQuery",void 0),d([(0,n.wk)()],h.prototype,"_selectedEntityId",void 0),h=d([(0,n.EM)("mc-entity-picker")],h)},9315(e,t,i){i.d(t,{i:()=>a});var o=i(6161),n=i(201);function a(e,t,i,a){return t?o.qy`<button
    type="button"
    class="icon-btn sm field-reset"
    aria-label=${(0,n.t)(385,{label:e})}
    title=${a??(0,n.t)(384)}
    @click=${e=>{e.stopPropagation(),i()}}
  >
    <ha-icon icon="mdi:backup-restore"></ha-icon>
  </button>`:o.s6}},5115(e,t,i){i.d(t,{Pz:()=>u,Tf:()=>m,iJ:()=>g});var o=i(6161),n=i(5707),a=i(158),s=i(8497),r=i(4313),l=i(9136),c=i(7423),d=i(9100),h=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};function u(e){return`${e.radial?"radial":"linear"}-gradient(${e.radial?"circle":`${e.angle}deg`}, ${e.stops.join(", ")})`}const p=e=>e.replace(/\s+/g,"");function m(e,t){const i=(0,l.wb)(e);if(!i||i.stops.length>5||i.radial&&!t)return;const o={radial:i.radial,angle:(0,l.gO)(e)??i.angle,stops:i.stops},n=String(e).replace(/^(\s*linear-gradient\()\s*to\s[a-z\s]+?(?=,)/i,`$1${o.angle}deg`);return p(u(o))===p(n)?o:void 0}function g(e,t,i,n,a=!1){return o.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const o={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in o))return;e.preventDefault();const a=i.findIndex(e=>e.value===t),s=i[(a+o[e.key]+i.length)%i.length].value,r=e.currentTarget;n(s),requestAnimationFrame(()=>r.querySelector(`[data-val="${s}"]`)?.focus())}}>
    ${i.map(e=>{const i=e.value===t;return o.qy`<button
        type="button"
        role="radio"
        data-val=${e.value}
        aria-checked=${i?"true":"false"}
        tabindex=${i?"0":"-1"}
        ?disabled=${a}
        @click=${()=>n(e.value)}
      >${e.label}</button>`})}
  </div>`}let f=class extends o.WF{constructor(){super(...arguments),this.model={radial:!1,angle:135,stops:["#ffffff","#000000"]},this.label="",this.allowRadial=!1,this.disabled=!1,this._badStop=-1,this._focusStop=-1}updated(){if(this._focusStop<0)return;const e=this._focusStop;this._focusStop=-1;const t=this.renderRoot.querySelectorAll("mc-color-picker")[e];t?.updateComplete?.then(()=>t.shadowRoot?.querySelector("input.input")?.focus())}_emit(e){this._draft=void 0,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:u(e)}}))}_angle(e){const t=parseFloat(e);return Number.isFinite(t)?Math.round(Math.max(0,Math.min(360,t))):this.model.angle}_setStop(e,t,i){i.stopPropagation();const o=(0,c.f8)(t);this._badStop=o?-1:e,o&&o!==this.model.stops[e]&&this._emit({...this.model,stops:this.model.stops.map((t,i)=>i===e?o:t)})}_add(){const{stops:e}=this.model;if(e.length>=5)return;const t=e.length-1;this._focusStop=t,this._emit({...this.model,stops:[...e.slice(0,t),e[t-1],...e.slice(t)]})}_remove(e){const{stops:t}=this.model;t.length<=2||(this._badStop=-1,this._emit({...this.model,stops:t.filter((t,i)=>i!==e)}))}_renderStop(e,t,i){const n=t+1,a=i<=2;return o.qy`<div class="stop" role="group" aria-label=${(0,d.t)(1002,{num:n,n:i})}>
      <mc-color-picker
        .value=${e}
        .label=${(0,d.t)(1001,{num:n})}
        ?aria-invalid=${this._badStop===t}
        @value-changed=${e=>this._setStop(t,String(e.detail.value),e)}
      ></mc-color-picker>
      <button
        type="button"
        class="icon-btn"
        aria-label=${(0,d.t)(795,{num:n})}
        title=${a?(0,d.t)(14):(0,d.t)(795,{num:n})}
        ?disabled=${a||this.disabled}
        @click=${()=>this._remove(t)}
      >
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>`}render(){const e=this.model,t=this._draft??e.angle,i=u({...e,angle:t}),n=e.stops.length,a=this.label||(0,d.t)(1209);return o.qy`
      <div class="grad">
        <div class="preview" role="img" aria-label=${(0,d.t)(429)}><span style=${`background: ${i}`}></span></div>
        ${this.allowRadial?o.qy`<div class="row">
              <span class="lbl">${(0,d.t)(1106)}</span>
              ${g((0,d.t)(1275,{name:a}),e.radial?"radial":"linear",[{value:"linear",label:(0,d.t)(521)},{value:"radial",label:(0,d.t)(782)}],t=>t!==(e.radial?"radial":"linear")&&this._emit({...e,radial:"radial"===t}),this.disabled)}
            </div>`:o.s6}
        ${e.radial?o.s6:(0,r.a)({id:"angle",label:(0,d.t)(76),min:0,max:360,step:1,value:t,unit:"deg",valueText:(0,d.t)(1238,{angle:t}),numberLabel:(0,d.t)(78),disabled:this.disabled,onInput:e=>this._draft=this._angle(String(e)),onChange:t=>this._emit({...e,angle:this._angle(String(t))})})}
        <div class="stops">${e.stops.map((e,t)=>this._renderStop(e,t,n))}</div>
        ${this._badStop>=0?o.qy`<div class="help error" role="alert">${(0,d.t)(1129)}</div>`:o.s6}
        <div class="actions">
          <button
            type="button"
            class="btn btn-text btn-sm"
            title=${n>=5?(0,d.t)(1119,{max:5}):(0,d.t)(51)}
            ?disabled=${n>=5||this.disabled}
            @click=${this._add}
          >
            <ha-icon icon="mdi:plus"></ha-icon> ${(0,d.t)(51)}
          </button>
          <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>this._emit({...e,stops:[...e.stops].reverse()})}>
            <ha-icon icon="mdi:swap-horizontal"></ha-icon> ${(0,d.t)(831)}
          </button>
        </div>
      </div>
    `}};f.styles=[a.x,s.W,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .grad {
        container-type: inline-size;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px;
        min-width: 0;
        border: 1px solid var(--mc-divider, var(--divider-color));
        border-radius: var(--mc-radius-lg, 12px);
      }
      .preview {
        display: block;
        min-height: 32px;
        border: 1px solid var(--mc-divider, var(--divider-color));
        border-radius: var(--mc-radius-md, 8px);
        overflow: hidden;
        background-image: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%);
        background-size: 8px 8px;
        background-position: 0 0, 0 4px, 4px -4px, -4px 0;
      }
      .preview > span {
        display: block;
        min-height: 32px;
      }
      .row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        min-width: 0;
      }
      .row > label,
      .row > .lbl {
        flex: 0 0 auto;
        min-width: 48px;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text);
      }
      .row > .seg {
        flex: 1 1 120px;
        min-width: 0;
      }
      .stops {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
      }
      .stop {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .stop mc-color-picker {
        flex: 1 1 0;
        min-width: 0;
      }
      .stop .icon-btn {
        flex: 0 0 auto;
        min-width: 36px;
        min-height: 36px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      @container (max-width: 239px) {
        .row {
          flex-direction: column;
          align-items: stretch;
        }
        .actions {
          flex-direction: column;
        }
        .actions > button {
          width: 100%;
        }
      }
    `],h([(0,n.MZ)({type:Object})],f.prototype,"model",void 0),h([(0,n.MZ)({type:String})],f.prototype,"label",void 0),h([(0,n.MZ)({type:Boolean})],f.prototype,"allowRadial",void 0),h([(0,n.MZ)({type:Boolean})],f.prototype,"disabled",void 0),h([(0,n.wk)()],f.prototype,"_draft",void 0),h([(0,n.wk)()],f.prototype,"_badStop",void 0),f=h([(0,n.EM)("mc-gradient-editor")],f)},6828(e,t,i){i.d(t,{T9:()=>u});var o=i(6161),n=i(158),a=i(6485),s=i(5556),r=i(9486),l=i(3251);const c={LitElement:o.WF,html:o.qy,css:o.AH,editorSystem:n.x,readAnimations:a.Sd,get library(){return(0,s.T_)()},resolveIcon:(...e)=>(0,r.Si)().resolveIconGeometry(...e),setIcon:(...e)=>(0,r.Si)().setIconGeometry(...e),customIds:l.Gd};let d,h;function u(){return d??=i.e(734).then(()=>i(7353)).then(async e=>{if(!await e.iconNamesReady())throw new Error("icon names");return h=e,e.defineAnimatedIconGrid(c),!0}).catch(e=>(d=void 0,console.warn("Magic Card:",e),!1)),d}i.d(t,["O3",0,(e,t,o,n)=>i.e(734).then(()=>i(7353)).then(i=>i.pickAnimatedIcon(c,e,t,o,n)).catch(e=>(console.warn("Magic Card:",e),!1)),"OP",0,(e,t)=>h?.currentIconPick(c,e,t)??"","Z_",0,(e,t,o,n)=>i.e(734).then(()=>i(7353)).then(i=>i.pickCatalogue(c,e,t,o,n)).catch(e=>(console.warn("Magic Card:",e),!1)),"qB",0,(e,t,o)=>{i.e(734).then(()=>i(7353)).then(i=>{i.followIcons(c,e,t,o),i.pruneCatalogue(c,e)}).catch(()=>{})},"sX",0,(e,t)=>h?.currentIconStyle(c,e,t)??"living"])},1315(e,t,i){var o=i(6161),n=i(5707),a=i(105),s=i(158),r=i(9788),l=i(6828);const c="/static/mdi/iconList.json",d=[["home","house"],["home-outline","house"],["lightbulb","light bulb lamp"],["lightbulb-outline","light bulb lamp"],["lightbulb-group","lights"],["lamp","light"],["floor-lamp","light"],["ceiling-light","lamp"],["led-strip","light"],["fan","ventilation air"],["fan-off","ventilation"],["air-conditioner","ac climate cooling"],["air-purifier","filter"],["air-humidifier","humidity"],["thermometer","temperature"],["thermostat","climate heating"],["radiator","heating"],["fire","flame heat"],["snowflake","cold cool winter"],["water","drop"],["water-percent","humidity"],["water-boiler","heater"],["weather-sunny","sun"],["weather-night","moon"],["weather-cloudy","cloud"],["weather-partly-cloudy","cloud sun"],["weather-rainy","rain"],["weather-pouring","rain"],["weather-snowy","snow"],["weather-windy","wind"],["weather-lightning","storm thunder"],["white-balance-sunny","sun brightness"],["power","on off"],["power-plug","socket outlet"],["power-socket-eu","outlet"],["flash","lightning energy"],["lightning-bolt","energy electricity"],["solar-power","sun energy panel"],["battery","charge"],["battery-charging","charge"],["ev-station","car charger"],["car","vehicle"],["car-electric","vehicle ev"],["garage","car"],["garage-open","car door"],["gate","fence"],["door","entrance"],["door-open","entrance"],["door-closed","entrance"],["window-closed","glass"],["window-open","glass"],["window-shutter","blind cover"],["window-shutter-open","blind cover"],["blinds","cover"],["curtains","cover"],["lock","secure"],["lock-open","unlock"],["key","access"],["shield-home","alarm security"],["alarm-light","siren"],["bell","notification"],["bell-ring","notification doorbell"],["doorbell","bell"],["cctv","camera surveillance"],["camera","photo"],["video","camera"],["motion-sensor","presence pir"],["run","motion person"],["account","person user"],["account-group","people users"],["human","person"],["sofa","couch living room"],["bed","bedroom sleep"],["bed-empty","bedroom"],["silverware-fork-knife","kitchen dining"],["stove","kitchen cooking"],["fridge","refrigerator kitchen"],["dishwasher","kitchen"],["washing-machine","laundry"],["tumble-dryer","laundry"],["coffee","cup"],["coffee-maker","kitchen"],["microwave","kitchen"],["toilet","bathroom wc"],["shower","bathroom"],["bathtub","bathroom"],["robot-vacuum","cleaning"],["robot","automation"],["script-text","script"],["palette","scene colour"],["television","tv"],["television-classic","tv"],["cast","chromecast media"],["speaker","audio sound"],["speaker-wireless","audio"],["music","note audio"],["play","media"],["pause","media"],["stop","media"],["skip-next","media"],["skip-previous","media"],["volume-high","sound"],["volume-off","mute"],["wifi","network wireless"],["router-wireless","network"],["lan","network"],["server","computer"],["laptop","computer"],["monitor","screen display"],["cellphone","phone mobile"],["tablet","ipad"],["gamepad-variant","game console"],["printer","print"],["flower","plant garden"],["sprout","plant"],["tree","garden"],["grass","lawn garden"],["sprinkler","irrigation garden"],["pool","swim"],["dog","pet"],["cat","pet"],["paw","pet"],["trash-can","bin garbage"],["delete","trash remove"],["calendar","date"],["clock-outline","time"],["timer-outline","countdown"],["alarm","clock"],["chart-line","graph history"],["gauge","meter"],["information","info"],["information-outline","info"],["alert","warning"],["alert-circle","warning error"],["check","done ok"],["check-circle","done ok"],["close","cancel"],["plus","add"],["minus","remove"],["cog","settings gear"],["tune","settings"],["menu","hamburger"],["magnify","search"],["heart","favourite love"],["star","favourite"],["map-marker","location"],["earth","globe world"],["sun-clock","sunrise sunset"],["moon-waning-crescent","night"],["toggle-switch","switch"],["toggle-switch-off","switch"],["ray-vertex","number"],["format-list-bulleted","list select"],["eye","sensor view"],["emoticon-outline","smile face"],["shape-outline","shape"],["help-circle","question"]];function h(e){const t=(e.includes(":")?e.slice(e.indexOf(":")+1):e).split(/[-_\s]+/).filter(Boolean).join(" ");return t?t.charAt(0).toUpperCase()+t.slice(1):""}function u(e){return/^[a-z0-9_-]+:[a-z0-9_.-]+$/i.test(e.trim())}function p(e,t){if(!t||"string"!=typeof t.name||!t.name)return;const i=Array.isArray(t.keywords)?t.keywords.filter(e=>"string"==typeof e):[];return{id:`${e}:${t.name}`,name:h(t.name),prefix:e,search:`${e}:${t.name} ${t.name.replace(/-/g," ")} ${i.join(" ")}`.toLowerCase()}}let m;const g=new Map;async function f(e){return m||(m=(async()=>{try{const t=await fetch(e?e(c):c);if(!t.ok)throw new Error(String(t.status));const i=await t.json();if(!Array.isArray(i)||0===i.length)throw new Error("empty");return i.map(e=>p("mdi",e)).filter(e=>!!e)}catch{return m=void 0,d.map(([e,t])=>p("mdi",{name:e,keywords:t.split(" ")}))}})()),m}async function v(){const e=("undefined"==typeof window?{}:window).customIcons??{};return(await Promise.all(Object.keys(e).map(async t=>{const i=g.get(t);if(i)return i;const o=e[t]?.getIconList;if("function"!=typeof o)return[];try{const e=await o(),i=(Array.isArray(e)?e:[]).map(e=>p(t,e)).filter(e=>!!e);return g.set(t,i),i}catch{return[]}}))).flat()}function b(e,t,i){const o=t.trim().toLowerCase();if(!o)return{items:e.slice(0,i),total:e.length};const n=o.replace(/\s+/g,"-"),a=o.replace(/-/g," "),s=[];return e.forEach((e,t)=>{const i=e.id.toLowerCase(),o=i.slice(i.indexOf(":")+1);let r=-1;i===n||o===n?r=0:i.startsWith(n)||o.startsWith(n)?r=1:i.includes(n)?r=2:e.search.includes(a)&&(r=3),r>=0&&s.push([r,t,e])}),s.sort((e,t)=>e[0]-t[0]||e[1]-t[1]),{items:s.slice(0,i).map(e=>e[2]),total:s.length}}i(2061);var y=i(4025),_=i(6562),w=i(9899),$=i(7104),k=i(379),x=i(9100),C=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let S=class extends o.WF{constructor(){super(...arguments),this.value="",this.label="",this._windowCtrl=new r.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery="",this._selectedIcon="",this._icons=null,this._active=-1,this._tab="icons",this._chunk="loading",this._src="all",this._editorFailed=!1,this._keepFor="",this._fieldWasFocused=!1}async _setTab(e,t=!1){this._tab=e,t&&this.updateComplete.then(()=>this.shadowRoot?.querySelector("[role=tab][aria-selected=true]")?.focus()),"animated"===e&&"ok"!==this._chunk&&(this._chunk="loading",this._chunk=await(0,l.T9)()?"ok":"failed")}_onTabKeydown(e){const t={ArrowRight:"animated",ArrowLeft:"icons",Home:"icons",End:"animated"}[e.key];t&&(e.preventDefault(),this._setTab(t,!0))}_onAnimatedPick(e){const t=this.animated;t&&(e.stopPropagation(),(0,l.O3)(this,t.module,t.onModule,e.detail),e.detail.restyle||this._closeModal())}_renderTabs(){return o.qy`
      <div class="seg" role="tablist" aria-label=${(0,x.t)(471)}>
        ${["icons","animated"].map(e=>o.qy`
          <button type="button" role="tab" aria-selected=${this._tab===e?"true":"false"}
            tabindex=${this._tab===e?"0":"-1"} @click=${()=>this._setTab(e)} @keydown=${this._onTabKeydown}
          >${"icons"===e?(0,x.t)(476):(0,x.t)(81)}</button>
        `)}
      </div>
    `}_renderAnimated(){const e=this.animated;if("loading"===this._chunk)return o.qy`<div class="mc-picker-loading">${(0,x.t)(542)}</div>`;if("failed"===this._chunk)return o.qy`<div class="mc-picker-empty">${(0,x.t)(1033)}
        <button type="button" class="btn btn-secondary" @click=${()=>this._setTab("animated")}>${(0,x.t)(830)}</button></div>`;const t=e.module;return o.qy`<mc-animated-icon-grid .hass=${this.hass} .icon=${this.value} .entity=${t.entity??""}
      .current=${(0,l.OP)(this,e.module)} .iconStyle=${(0,l.sX)(this,e.module)} @animated-icon-pick=${this._onAnimatedPick}></mc-animated-icon-grid>`}_openModal(){this._tab="icons",this._selectedIcon=this.value,this._searchQuery="",this._active=-1,this._src="all",this._keep=void 0,this._editorFailed=!1,this._showModal=!0,this._loadIcons(),(0,_.fZ)(this.hass).then(e=>this._lib=e)}async _loadIcons(){const e=await async function(e){const[t,i]=await Promise.all([v(),f(e)]);return[...t,...i]}(this.hass?.hassUrl?.bind(this.hass));this._showModal&&(this._icons=e)}_closeModal(){this._showModal=!1}_commit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_handleSave(){const e=this._selectedIcon.trim(),t=this._keep&&e===`mcu:${this._keep.id}`?this._keep:void 0;this._commit(e);const i=t?(0,y.d)(this):void 0;t&&i&&!1!==i.attached&&i.updateConfig((0,$.QT)(i.getConfig(),t.id,t.on?t.svg:void 0),!1),this._closeModal()}async _fromSaved(e){const t=this.animated,i=this._keep;if(t&&i)return"copy"===e?((e=>{t.onModule((0,$.kH)(t.module,e,this.syncCtx))})({icon:"svg",svg:i.svg}),void this._closeModal()):void("opened"===await this._openEditor({kind:"svg",svg:i.svg})&&this._closeModal())}async _openEditor(e){const t=this.animated;if(!t)return;this._editorFailed=!1;const i=await(0,$.$d)({from:this,hass:this.hass,module:t.module,linked:!!this.syncCtx&&(0,k.rJ)(this.syncCtx),source:e,apply:e=>t.onModule((0,$.kH)(t.module,e,this.syncCtx))});return this._editorFailed="failed"===i,i}async _draw(){"opened"===await this._openEditor({kind:"blank"})&&this._closeModal()}_mine(){return("ok"===this._lib?.state?this._lib.items:[]).map(e=>({id:`mcu:${e.id}`,name:e.name,prefix:"mcu",search:[e.name,...e.keywords??[]].join(" ").toLowerCase()}))}_allIcons(){const e=this._icons;return e?"ok"!==this._lib?.state?e:(this._noMcu?.from===e&&this._noMcu.lib===this._lib||(this._noMcu={from:e,lib:this._lib,list:e.filter(e=>"mcu"!==e.prefix)}),this._noMcu.list):[]}_syncKeep(){const e=this._selectedIcon.startsWith("mcu:")?this._selectedIcon.slice(4):"";e!==this._keepFor&&(this._keepFor=e,this._keep=void 0,e&&(0,_.sW)(this.hass,e).then(t=>{if(!t||this._keepFor!==e)return;const i=(new TextEncoder).encode(t.svg).length,o=!!(0,y.d)(this)?.getConfig().custom_icons?.[e];this._keep={id:e,svg:t.svg,bytes:i,on:o||i<=2048}}))}_handleClear(){this._commit(""),this._closeModal()}_onInputChange(e){this._commit(e.target.value)}_onFieldPointerDown(e){this._fieldWasFocused=this.shadowRoot?.activeElement===e.currentTarget}_onFieldClick(){this._fieldWasFocused||this._showModal||this._openModal()}_onFieldKeydown(e){"ArrowDown"!==e.key||e.altKey||(e.preventDefault(),this._openModal())}_rows(){const e=this._mine();if("mine"===this._src){const t=b(e,this._searchQuery,150);return{rows:t.items,total:t.total,custom:!1,mine:t.items.length}}const t=this._allIcons(),{items:i,total:o}=b(t,this._searchQuery,150),n=b(e,this._searchQuery,6).items,a=this._searchQuery.trim();if(u(a)&&!i.some(e=>e.id.toLowerCase()===a.toLowerCase())&&!n.some(e=>e.id.toLowerCase()===a.toLowerCase())){const e=a.slice(0,a.indexOf(":"));return{rows:[...n,{id:a,name:h(a),prefix:e,search:""},...i],total:o+1,custom:!0,mine:n.length}}return{rows:[...n,...i],total:o,custom:!1,mine:n.length}}_onSearch(e){this._searchQuery=e,this._active=e.trim()?0:-1}_onSearchKeydown(e){const{rows:t}=this._rows();if("ArrowDown"===e.key||"ArrowUp"===e.key){if(e.preventDefault(),!t.length)return;const i="ArrowDown"===e.key?1:-1;this._active=this._active<0?i>0?0:t.length-1:Math.min(t.length-1,Math.max(0,this._active+i)),this._selectedIcon=t[this._active].id}else if("Enter"===e.key){e.preventDefault();const i=this._active>=0?t[this._active]:void 0;i?this._selectedIcon=i.id:u(this._searchQuery)&&(this._selectedIcon=this._searchQuery.trim()),this._handleSave()}}willUpdate(){this._showModal&&this._syncKeep()}updated(e){if(e.has("_showModal")&&this._showModal&&this.shadowRoot?.querySelector(".mc-picker-search input")?.focus(),e.has("_active")&&this._active>=0){const e=this.shadowRoot?.getElementById(`mc-icon-opt-${this._active}`);e?.scrollIntoView?.({block:"nearest"})}}render(){const e=this.value?.trim()??"";return o.qy`
      <div class="with-icon with-action">
        <ha-icon .icon=${e||"mdi:emoticon-outline"}></ha-icon>
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder="mdi:icon"
          aria-label=${this.label||(0,x.t)(464)}
          spellcheck="false"
          @input=${this._onInputChange}
          @keydown=${this._onFieldKeydown}
          @pointerdown=${this._onFieldPointerDown}
          @click=${this._onFieldClick}
        />
        <button
          type="button"
          class="icon-btn sm field-action browse"
          aria-label=${(0,x.t)(149)}
          title=${(0,x.t)(149)}
          data-focus-key="icon-entry"
          @click=${this._openModal}
        >
          <ha-icon icon="mdi:magnify"></ha-icon>
        </button>
      </div>
      ${e?o.qy`<p class="entity-meta icon-meta"><span>${h(e)}</span></p>`:""}

      ${this._showModal?this._renderModal():""}
    `}_renderKeep(){const e=this._keep;if(!e||this._selectedIcon.trim()!==`mcu:${e.id}`)return"";const t=e.bytes<1024?(0,x.t)(1284,{n:e.bytes}):(0,x.t)(1290,{size:(e.bytes/1024).toFixed(1)});return o.qy`<details class="mc-picker-keep">
      <summary>${(0,x.t)(56)}</summary>
      <div class="switch-row">
        <div class="txt">
          <div class="field-head"><label for="mc-keep-copy">${(0,x.t)(496,{size:t})}</label></div>
          <p class="help" id="mc-keep-help">${(0,x.t)(1184)}</p>
        </div>
        <button type="button" class="switch" id="mc-keep-copy" role="switch" aria-checked=${e.on?"true":"false"} aria-describedby="mc-keep-help"
          @click=${()=>this._keep={...e,on:!e.on}}></button>
      </div>
      ${this.animated?o.qy`<div class="mc-picker-keep-actions">
            <button type="button" class="btn btn-text btn-sm" @click=${()=>{this._fromSaved("copy")}}>${(0,x.t)(1131)}</button>
            <button type="button" class="btn btn-text btn-sm" @click=${()=>{this._fromSaved("customise")}}>${(0,x.t)(264)}</button>
          </div>`:""}
    </details>`}_renderModal(){const{rows:e,total:t,mine:i}=this._rows(),n=this._lib,a=this._active>=0&&this._active<e.length?`mc-icon-opt-${this._active}`:void 0,s=this._selectedIcon.trim().toLowerCase(),l=!!this.animated&&"animated"===this._tab;return o.qy`
      ${(0,r.bU)((0,x.t)(892),()=>this._closeModal(),"m",o.qy`
          <div class="mc-picker-stack">
          ${this.animated?this._renderTabs():""}
          ${l?o.qy`<div class="mc-picker-list" role="tabpanel">${this._renderAnimated()}</div>`:o.qy`
          ${"ok"===n?.state?o.qy`<div class="seg full" role="radiogroup" aria-label=${(0,x.t)(477)}>
                ${["all","mine"].map(e=>o.qy`<button type="button" role="radio" aria-checked=${this._src===e?"true":"false"} @click=${()=>{this._src=e,this._active=-1}}>${"all"===e?(0,x.t)(62):(0,x.t)(609,{n:n.items.length})}</button>`)}
              </div>`:""}
          <div class="mc-picker-search">
            ${(0,r.LW)((0,x.t)(874),this._searchQuery,e=>this._onSearch(e),{onKeydown:e=>this._onSearchKeydown(e),listId:"mc-icon-list",activeId:a})}
          </div>
          <p class="sr-only" role="status">${null===this._icons?"":t>0?(0,x.t)(1256,{n:t}):(0,x.t)(636)}</p>
          <div class="mc-picker-list" id="mc-icon-list" role="listbox" aria-label=${(0,x.t)(476)}>
            ${null===this._icons?o.qy`<div class="mc-picker-loading">${(0,x.t)(536)}</div>`:e.length>0?e.map((e,t)=>o.qy`
                    ${0===t&&i>0&&"all"===this._src?o.qy`<div class="mc-picker-category mc-picker-group">${(0,x.t)(608)} <button type="button" class="btn btn-text btn-sm" @click=${()=>{this._src="mine"}}>${(0,x.t)(917)}</button></div>`:""}
                    ${t===i&&i>0&&"all"===this._src?o.qy`<div class="mc-picker-category mc-picker-group">${(0,x.t)(568)}</div>`:""}
                    <button
                      type="button"
                      role="option"
                      id="mc-icon-opt-${t}"
                      tabindex="-1"
                      class="mc-picker-item ${t===this._active?"is-active":""}"
                      aria-selected=${s===e.id.toLowerCase()?"true":"false"}
                      @click=${()=>{this._selectedIcon=e.id,this._active=t}}
                      @dblclick=${()=>{this._selectedIcon=e.id,this._handleSave()}}
                    >
                      <span class="mc-picker-item-icon"><ha-icon .icon=${e.id}></ha-icon></span>
                      <span class="mc-picker-item-content">
                        <span class="mc-picker-item-name">${e.name}</span>
                        <span class="mc-picker-item-id" title=${e.id}>${e.id}</span>
                      </span>
                      ${"mdi"!==e.prefix?o.qy`<span class="chip">${e.prefix}</span>`:""}
                    </button>
                  `):"mine"!==this._src||this._searchQuery.trim()?o.qy`<div class="mc-picker-empty">${(0,x.t)(637)}${this.animated&&"mine"===this._src?o.qy` <button type="button" class="btn btn-secondary" @click=${()=>{this._searchQuery=""}}>${(0,x.t)(191)}</button> <button type="button" class="btn btn-secondary" @click=${()=>{this._draw()}}>${(0,x.t)(317)}</button>`:""}</div>`:o.qy`<div class="mc-picker-empty">${(0,x.t)(646)}${this.animated?o.qy` <button type="button" class="btn btn-secondary" @click=${()=>{this._draw()}}>${(0,x.t)(317)}</button>`:""}</div>`}
            ${t>e.length?o.qy`<div class="mc-picker-more">${(0,x.t)(953,{shown:e.length,total:t})}</div>`:""}
          </div>`}
          ${l?"":this._renderKeep()}
          </div>
          <div class="mc-picker-footer" slot="footer">
            ${l?"":o.qy`<button type="button" class="btn btn-text clear" @click=${this._handleClear}>${(0,x.t)(188)}</button>`}
            ${!l&&this.animated?o.qy`<button type="button" class="btn btn-text" data-focus-key="icon-entry" @click=${()=>{this._draw()}}>${(0,x.t)(317)}</button>`:""}
            ${this.animated?o.qy`<button type="button" class="btn btn-text" @click=${e=>{(0,w.uK)(e.currentTarget,this.hass,"icon")}}>${(0,x.t)(513)}</button>`:""}
            ${!l&&n&&"missing"===n.state?o.qy`<span class="help">${(0,x.t)(498)}</span>`:""}
            ${this._editorFailed?o.qy`<span class="help error" role="alert">${(0,x.t)(1045)}</span>`:""}
            <span class="spacer"></span>
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,x.t)(162)}</button>
            ${l?"":o.qy`<button type="button" class="btn btn-primary" @click=${this._handleSave}>${(0,x.t)(860)}</button>`}
          </div>
      `)}
    `}};S.styles=[s.x,a.fz,a.kx,o.AH`
      .mc-picker-stack > .seg {
        flex-shrink: 0;
        width: auto;
        margin: 8px 16px 0;
      }
      .mc-picker-group {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .mc-picker-keep {
        flex-shrink: 0;
        padding: 0 16px;
        border-top: 1px solid var(--mc-divider);
      }
      .mc-picker-keep > summary {
        min-height: var(--mc-hit, 40px);
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
      }
      .mc-picker-keep[open] {
        display: grid;
        gap: 4px;
        padding-bottom: 8px;
      }
      @media (pointer: coarse) {
        .browse {
          min-width: 44px;
          min-height: 44px;
        }
      }
      .mc-picker-keep-actions {
        display: flex;
        gap: 8px;
      }
      .mc-picker-footer .help {
        flex: 1 1 100%;
        margin: 0;
      }
      /* short screens (200 % zoom, a phone on its side): the quiet install tip makes way for the list */
      @media (max-height: 560px) {
        .mc-picker-footer .help:not(.error) {
          display: none;
        }
        .mc-picker-stack {
          min-height: 0;
        }
      }
    `],C([(0,n.MZ)({attribute:!1})],S.prototype,"hass",void 0),C([(0,n.MZ)({type:String})],S.prototype,"value",void 0),C([(0,n.MZ)({type:String})],S.prototype,"label",void 0),C([(0,n.MZ)({attribute:!1})],S.prototype,"animated",void 0),C([(0,n.MZ)({attribute:!1})],S.prototype,"syncCtx",void 0),C([(0,n.wk)()],S.prototype,"_showModal",void 0),C([(0,n.wk)()],S.prototype,"_searchQuery",void 0),C([(0,n.wk)()],S.prototype,"_selectedIcon",void 0),C([(0,n.wk)()],S.prototype,"_icons",void 0),C([(0,n.wk)()],S.prototype,"_active",void 0),C([(0,n.wk)()],S.prototype,"_tab",void 0),C([(0,n.wk)()],S.prototype,"_chunk",void 0),C([(0,n.wk)()],S.prototype,"_lib",void 0),C([(0,n.wk)()],S.prototype,"_src",void 0),C([(0,n.wk)()],S.prototype,"_keep",void 0),C([(0,n.wk)()],S.prototype,"_editorFailed",void 0),S=C([(0,n.EM)("mc-icon-picker")],S)},9048(e,t,i){var o=i(6161),n=i(5707),a=i(105),s=i(158),r=i(9788),l=i(9100),c=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let d=class extends o.WF{constructor(){super(...arguments),this.value="",this.mediaType="",this._windowCtrl=new r.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery="",this._items=[],this._loading=!1,this._error="",this._breadcrumbs=[],this._selectedItem=null}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_openModal(){this._showModal=!0,this._searchQuery="",this._selectedItem=null,this._breadcrumbs=[{title:(0,l.t)(572),media_content_id:""}],this._browseMedia("")}_closeModal(){this._showModal=!1,this._items=[],this._error=""}async _browseMedia(e){if(this.hass){this._loading=!0,this._error="",this._selectedItem=null;try{const t={type:"media_source/browse_media"};e&&(t.media_content_id=e);const i=await this.hass.callWS(t);this._items=i.children||[]}catch{this._error=(0,l.t)(639),this._items=[]}this._loading=!1}}_navigateToFolder(e){this._breadcrumbs=[...this._breadcrumbs,{title:e.title,media_content_id:e.media_content_id}],this._searchQuery="",this._browseMedia(e.media_content_id)}_navigateToBreadcrumb(e){const t=this._breadcrumbs[e];this._breadcrumbs=this._breadcrumbs.slice(0,e+1),this._searchQuery="",this._browseMedia(t.media_content_id)}_selectItem(e){this._selectedItem=e}_handleSave(){const e=this._selectedItem;if(e){const t=e.media_content_id;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}this._closeModal()}_getFilteredItems(){let e=this._items;if(this.mediaType&&(e=e.filter(e=>!!e.can_expand||this._matchesMediaType(e.media_class))),this._searchQuery){const t=this._searchQuery.toLowerCase();e=e.filter(e=>e.title.toLowerCase().includes(t))}return e}_matchesMediaType(e){const t=e.toLowerCase();return"image"===this.mediaType?"image"===t||"photo"===t||"picture"===t:"video"!==this.mediaType||"video"===t||"movie"===t||"clip"===t}_getItemIcon(e){if(e.can_expand)return"mdi:folder";const t=e.media_class.toLowerCase();return"image"===t||"photo"===t||"picture"===t?"mdi:image":"video"===t||"movie"===t||"clip"===t?"mdi:video":"music"===t||"audio"===t||"song"===t?"mdi:music":"mdi:file"}render(){return o.qy`
      <div class="with-icon with-action">
        <ha-icon icon=${"video"===this.mediaType?"mdi:video-outline":"mdi:image-outline"}></ha-icon>
        <input
          type="text"
          class="input"
          .value=${this.value}
          placeholder="/local/images/background.jpg"
          aria-label=${(0,l.t)(573)}
          spellcheck="false"
          @input=${this._onInputChange}
        />
        <button
          type="button"
          class="icon-btn sm field-action browse"
          aria-label=${(0,l.t)(150)}
          title=${(0,l.t)(150)}
          @click=${this._openModal}
        >
          <ha-icon icon="mdi:folder-open-outline"></ha-icon>
        </button>
      </div>
      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getFilteredItems();return o.qy`
      ${(0,r.bU)((0,l.t)(895),()=>this._closeModal(),"m",o.qy`

          ${this._renderBreadcrumbs()}

          <div class="mc-picker-search">
            ${(0,r.LW)((0,l.t)(387),this._searchQuery,e=>{this._searchQuery=e})}
          </div>

          <div class="mc-picker-list" role="listbox" aria-label=${(0,l.t)(572)}>
            ${this._loading?o.qy`<div class="mc-picker-loading">${(0,l.t)(541)}</div>`:this._error?o.qy`<div class="mc-picker-empty">${this._error}</div>`:e.length>0?e.map(e=>this._renderItem(e)):o.qy`<div class="mc-picker-empty">${(0,l.t)(638)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,l.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave} ?disabled=${!this._selectedItem}>${(0,l.t)(860)}</button>
          </div>
      `)}
    `}_renderBreadcrumbs(){return this._breadcrumbs.length<=1?o.qy``:o.qy`
      <nav class="mc-picker-breadcrumbs" aria-label=${(0,l.t)(575)}>
        ${this._breadcrumbs.map((e,t)=>t===this._breadcrumbs.length-1?o.qy`<span class="mc-breadcrumb-current" aria-current="page">${e.title}</span>`:o.qy`
            <button type="button" class="btn btn-text btn-sm" @click=${()=>this._navigateToBreadcrumb(t)}>${e.title}</button>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          `)}
      </nav>
    `}_renderItem(e){const t=this._selectedItem?.media_content_id===e.media_content_id,i=this._getItemIcon(e);return o.qy`
      <button
        type="button"
        role="option"
        class="mc-picker-item"
        aria-selected=${t?"true":"false"}
        @click=${()=>{e.can_expand?this._navigateToFolder(e):e.can_play&&this._selectItem(e)}}
      >
        ${e.thumbnail?o.qy`<img class="mc-picker-item-thumb" src=${e.thumbnail} alt="" />`:o.qy`<span class="mc-picker-item-icon"><ha-icon icon=${i}></ha-icon></span>`}
        <span class="mc-picker-item-content">
          <span class="mc-picker-item-name">${e.title}</span>
        </span>
        ${e.can_expand?o.qy`<ha-icon class="mc-picker-item-chev" icon="mdi:chevron-right"></ha-icon>`:o.qy`<span class="chip">${e.media_class}</span>`}
      </button>
    `}};d.styles=[s.x,a.fz],c([(0,n.MZ)({attribute:!1})],d.prototype,"hass",void 0),c([(0,n.MZ)({type:String})],d.prototype,"value",void 0),c([(0,n.MZ)({type:String})],d.prototype,"mediaType",void 0),c([(0,n.wk)()],d.prototype,"_showModal",void 0),c([(0,n.wk)()],d.prototype,"_searchQuery",void 0),c([(0,n.wk)()],d.prototype,"_items",void 0),c([(0,n.wk)()],d.prototype,"_loading",void 0),c([(0,n.wk)()],d.prototype,"_error",void 0),c([(0,n.wk)()],d.prototype,"_breadcrumbs",void 0),c([(0,n.wk)()],d.prototype,"_selectedItem",void 0),d=c([(0,n.EM)("mc-media-picker")],d)},9788(e,t,i){i.d(t,{HK:()=>h,LW:()=>c,bU:()=>d,dt:()=>l});var o=i(6161),n=i(1413),a=i(9100);function s(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e:null}function r(e){const t=e.querySelector(".mc-picker-modal");t&&(t.tabIndex=-1,t.focus({preventScroll:!0}))}class l{constructor(e,t,i={}){this.host=e,this.onClose=t,this._dlg=null,this._downOnBackdrop=!1,this._returnFocus=null,this._onPointerdown=e=>{this._downOnBackdrop=e.target===this._dlg},this._onCancel=e=>{e.preventDefault(),this.onClose()},this._onNativeClose=e=>{e.target!==this._dlg||e.target.open||this.onClose()},this._onKeydown=e=>function(e){return t=>{"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),e())}}(this.onClose)(e),this._selector=i.selector??"dialog.mc-picker-overlay",this._focus=i.focus??r,e.addController(this)}hostUpdated(){const e=this.host.shadowRoot?.querySelector(this._selector)??null;e!==this._dlg&&(this._dlg&&this._closed(),e&&this._open(e))}hostConnected(){this.hostUpdated()}hostDisconnected(){this._dlg&&(this._closed(),this.onClose())}_open(e){if(this._dlg=e,this._returnFocus=s(),e.addEventListener("cancel",this._onCancel),e.addEventListener("close",this._onNativeClose),e.addEventListener("keydown",this._onKeydown),e.addEventListener("pointerdown",this._onPointerdown),e.open){if(function(e){try{return e.matches(":modal")}catch{return!1}}(e))return;e.removeAttribute("open")}if("function"==typeof e.showModal&&e.isConnected)try{return e.showModal(),void this._focus(e)}catch{}e.setAttribute("open","")}_closed(){const e=this._dlg;this._dlg=null,e.removeEventListener("cancel",this._onCancel),e.removeEventListener("close",this._onNativeClose),e.removeEventListener("keydown",this._onKeydown),e.removeEventListener("pointerdown",this._onPointerdown),this._downOnBackdrop=!1;try{e.close()}catch{}e.removeAttribute("open");const t=this._returnFocus;this._returnFocus=null,t?.isConnected&&t.focus({preventScroll:!0})}isBackdropClick(e){const t=e.target===this._dlg&&this._downOnBackdrop;return this._downOnBackdrop=!1,t}}function c(e,t,i,a={}){return o.qy`
    <div class="with-icon">
      <ha-icon icon="mdi:magnify"></ha-icon>
      <input
        id="mc-picker-search"
        class="input"
        type="text"
        placeholder=${e}
        aria-label=${e}
        role=${(0,n.J)(a.listId?"combobox":void 0)}
        aria-expanded=${(0,n.J)(a.listId?"true":void 0)}
        aria-controls=${(0,n.J)(a.listId)}
        aria-activedescendant=${(0,n.J)(a.activeId)}
        spellcheck="false"
        .value=${t}
        @input=${e=>i(e.target.value)}
        @keydown=${e=>a.onKeydown?.(e)}
      />
    </div>
  `}function d(e,t,i,n){return o.qy`<mc-ui-window
    heading=${e}
    closeLabel=${(0,a.t)(197)}
    variant=${"function"==typeof matchMedia&&matchMedia("(max-width: 599px)").matches?"sheet":"picker"}
    size=${i}
    initialFocus="mc-picker-search"
    movable
    resizable
    maximizable
    moveLabel=${(0,a.t)(604)}
    resizeLabel=${(0,a.t)(827)}
    maximizeLabel=${(0,a.t)(571)}
    restoreLabel=${(0,a.t)(828)}
    @mc-window-close=${t}
    >${n}</mc-ui-window>`}class h{constructor(e,t){this.host=e,this.onClose=t,this._shown=!1,this._back=null,e.addController(this)}win(){return this.host.shadowRoot?.querySelector("mc-ui-window")??null}hostUpdated(){const e=this.win();if(!e){const e=this._back;return this._shown=!1,this._back=null,void(e?.isConnected&&e.focus({preventScroll:!0}))}e.open||(this._shown||(this._back=s(),e.opener=this._back??void 0),this._shown=!0,e.show())}hostConnected(){this.hostUpdated()}hostDisconnected(){this._shown&&(this._shown=!1,this.win()?.close("action"),this.onClose())}}},7798(e,t,i){var o=i(6161),n=i(5707),a=i(158),s=i(9100),r=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let l=class extends o.WF{constructor(){super(...arguments),this.synced=!1,this.hasTemplate=!1,this.propertyPath="",this.hideIfNoTemplate=!1}_handleClick(e){e.preventDefault(),e.stopPropagation(),this.dispatchEvent(new CustomEvent("sync-toggle",{detail:{synced:this.synced,propertyPath:this.propertyPath},bubbles:!0,composed:!0}))}render(){return this.hasTemplate?this.synced?o.qy`
        <button
          class="sync"
          type="button"
          title=${(0,s.t)(1014)}
          @click=${this._handleClick}
        >
          <ha-icon icon="mdi:link-variant"></ha-icon><span class="sr-only">${(0,s.t)(1013)}</span>
        </button>
      `:o.qy`
      <button
        class="sync is-over"
        type="button"
        title=${(0,s.t)(706)}
        @click=${this._handleClick}
      >
        <ha-icon icon="mdi:link-variant-off"></ha-icon>
        ${(0,s.t)(705)}
      </button>
    `:this.hideIfNoTemplate?o.s6:o.qy``}};l.styles=[a.x,o.AH`
      :host {
        display: inline-flex;
        align-items: center;
        flex: none;
      }
    `],r([(0,n.MZ)({type:Boolean})],l.prototype,"synced",void 0),r([(0,n.MZ)({type:Boolean})],l.prototype,"hasTemplate",void 0),r([(0,n.MZ)({type:String})],l.prototype,"propertyPath",void 0),r([(0,n.MZ)({type:Boolean})],l.prototype,"hideIfNoTemplate",void 0),l=r([(0,n.EM)("mc-sync-indicator")],l)},7106(e,t,i){var o=i(6161),n=i(5707),a=i(158),s=i(9100),r=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const l=["px","em","rem","%","vw","vh"],c="custom",d=new Set(["px","em","rem","%","vw","vh","vmin","vmax","dvh","dvw","svh","svw","lvh","lvw","ch","ex","lh","rlh","cqw","cqh","cqi","cqb","cqmin","cqmax","cm","mm","q","in","pt","pc","s","ms","deg","rad","grad","turn","fr"]),h="[-+]?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[-+]?\\d+)?",u=new RegExp(`^${h}$`,"i"),p=new RegExp(`^(${h})\\s*([a-z]+|%)?$`,"i");function m(e){if("number"==typeof e)return Number.isFinite(e)?{number:String(e),custom:!1}:{number:"",custom:!1};const t="string"==typeof e?e.trim():"";if(!t)return{number:"",custom:!1};const i=t.match(p);if(!i)return{number:"",custom:!0};const o=i[2]?.toLowerCase();return o&&!d.has(o)?{number:"",custom:!0}:{number:String(Number(i[1])),unit:o,custom:!1}}let g=class extends o.WF{constructor(){super(...arguments),this.value="",this.label="",this.placeholder="",this.disabled=!1,this.compact=!1,this.inputId="",this.noCustom=!1,this._custom=!1}get _units(){return(this.units?.length?this.units:l).filter(e=>"auto"!==e&&e!==c)}willUpdate(e){e.has("value")&&String(this.value??"")!==this._emitted&&(this._custom=!1,this._unit=void 0,this._emitted=void 0)}revert(){this._custom=!1,this._unit=void 0,this._emitted=void 0,this.requestUpdate(),this.updateComplete.then(()=>{const e=this.renderRoot.querySelector("input"),t=m(this.value);e&&(e.value=t.custom?String(this.value??""):t.number)})}focus(){this.renderRoot.querySelector("input")?.focus()}_emit(e){this._emitted=e,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_shownUnit(e){return e.unit??this._unit??this._units[0]??"px"}_commitNumber(e){const t=m(this.value),i=e.value.trim();if(!i)return e.validity?.badInput?void(e.value=t.number):void(""!==String(this.value??"")&&this._emit(""));u.test(i)&&(i!==t.number||void 0===t.unit&&void 0!==this._unit)&&this._emit(`${i}${this._shownUnit(t)}`)}_commitText(e){const t=e.value.trim();t!==String(this.value??"").trim()&&this._emit(t)}_pickUnit(e){const t=e.value,i=m(this.value),o=this._custom||i.custom;if(t===c){if(o)return;return this._custom=!0,void this.updateComplete.then(()=>this.renderRoot.querySelector("input")?.focus())}if(this._unit=t,o){this._custom=!1;const e=m((this.renderRoot.querySelector("input")?.value??String(this.value??"")).trim());return void(!e.custom&&e.number?this._emit(`${e.number}${t}`):""!==String(this.value??"")&&this._emit(""))}i.number&&i.unit!==t&&this._emit(`${i.number}${t}`)}render(){const e=m(this.value),t=this._custom||e.custom,i=this._shownUnit(e),n=this._units.includes(i)?this._units:[...this._units,i],a=e=>{if("Enter"!==e.key)return;const i=e.target;t?this._commitText(i):this._commitNumber(i)};return o.qy`
      <div class="unit">
        ${t?o.qy`<input
              class="input mono"
              id=${this.inputId||o.s6}
              type="text"
              spellcheck="false"
              autocomplete="off"
              aria-label=${this.label||o.s6}
              placeholder="auto, calc(100% - 8px)"
              .value=${String(this.value??"")}
              ?disabled=${this.disabled}
              @change=${e=>this._commitText(e.target)}
              @keydown=${a}
            />`:o.qy`<input
              class="input"
              id=${this.inputId||o.s6}
              type="number"
              step="any"
              inputmode="decimal"
              aria-label=${this.label||o.s6}
              placeholder=${this.placeholder||"0"}
              .value=${e.number}
              ?disabled=${this.disabled}
              @change=${e=>this._commitNumber(e.target)}
              @keydown=${a}
            />`}
        <div class="select ${t?"is-custom":""}">
          <select class="input" aria-label=${this.label?(0,s.t)(1245,{label:this.label}):(0,s.t)(1111)} ?disabled=${this.disabled} @change=${e=>this._pickUnit(e.target)}>
            ${n.map(e=>o.qy`<option value=${e} ?selected=${!t&&i===e}>${e}</option>`)}
            ${this.noCustom&&!t?o.s6:o.qy`<option value=${c} ?selected=${t}>${(0,s.t)(255)}</option>`}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>
    `}};g.styles=[a.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      /* "Custom" needs a wider select than a unit */
      .unit > .select.is-custom {
        width: 92px;
      }
      .unit > .select.is-custom select {
        padding-right: 28px;
      }
      .unit > .select.is-custom > ha-icon {
        right: 6px;
      }
      /* compact (box field sides): a narrower unit select */
      :host([compact]) .unit > .input {
        min-width: 5ch;
        padding-left: 10px;
        padding-right: 6px;
      }
      :host([compact]) .unit > .select {
        width: 64px;
      }
      :host([compact]) .unit > .select.is-custom {
        width: 84px;
      }
      :host([compact]) .unit > .select select {
        padding-left: 8px;
        padding-right: 24px;
      }
      :host([compact]) .unit > .select > ha-icon {
        right: 4px;
      }
    `],r([(0,n.MZ)({attribute:!1})],g.prototype,"value",void 0),r([(0,n.MZ)({type:String})],g.prototype,"label",void 0),r([(0,n.MZ)({type:String})],g.prototype,"placeholder",void 0),r([(0,n.MZ)({type:Boolean})],g.prototype,"disabled",void 0),r([(0,n.MZ)({type:Boolean,reflect:!0})],g.prototype,"compact",void 0),r([(0,n.MZ)({type:String})],g.prototype,"inputId",void 0),r([(0,n.MZ)({attribute:!1})],g.prototype,"units",void 0),r([(0,n.MZ)({type:Boolean})],g.prototype,"noCustom",void 0),r([(0,n.wk)()],g.prototype,"_custom",void 0),r([(0,n.wk)()],g.prototype,"_unit",void 0),g=r([(0,n.EM)("mc-unit-field")],g)},5056(e,t,i){i.d(t,{oS:()=>c,uw:()=>d,yp:()=>r}),i(2061);var o=i(3920),n=i(5556),a=i(3251);const s=e=>(new TextEncoder).encode(JSON.stringify(e)).length;function r(e,t){const i=e.custom_animations;if(i&&!Array.isArray(i))return{...e,custom_animations:{...i,...Object.fromEntries(t.map(e=>[String(e.id),e]))}};const o=new Set(t.map(e=>e.id));return{...e,custom_animations:[...(0,a.B)(i).filter(e=>!o.has(e.id)),...t]}}const l=(e,t)=>(0,a.B)(e?.custom_animations).some(e=>e.id===t);function c(e,t,i,a){if(!e||!1===e.attached)return;const s=e.getConfig();if(i){const i=function(e){const t=new Map,i=[e];for(;i.length;){const e=i.shift(),a=(0,n.T_)().get(e);if(a&&!t.has(e)){t.set(e,a);for(const e of a.steps??[])"string"==typeof e?.animation&&e.animation.startsWith(o.D8)&&i.push((0,o._R)(e.animation))}}return[...t.values()]}(t).filter(e=>!l(s,e.id));i.length&&e.updateConfig(r(s,i),!a)}else if(l(s,t)){const i=s.custom_animations,o=Array.isArray(i)?i.filter(e=>e?.id!==t):Object.fromEntries(Object.entries(i??{}).filter(([e])=>e!==t)),n={...s,custom_animations:o};Object.keys(o).length||delete n.custom_animations,e.updateConfig(n,!a)}}function d(e,t){const i=(0,n.T_)().get(t);i&&s(i)<=8192&&c(e,t,!0,!0)}i.d(t,["Wk",0,s,"av",0,l])},4025(e,t,i){function o(e){const t={};return e.dispatchEvent(new CustomEvent("mc-card-bridge",{bubbles:!0,composed:!0,detail:t})),t.sm}i.d(t,{d:()=>o})},7104(e,t,i){i.d(t,{$d:()=>m,QT:()=>p,kH:()=>d,lm:()=>g});var o=i(3034),n=i(4025),a=i(6562),s=i(5047),r=i(7503),l=i(379),c=i(9100);function d(e,t,i){const o={...e,...t};for(const e of Object.keys(t))void 0===o[e]&&delete o[e];if(i&&(0,l.rJ)(i)){const n=new Set(e.not_synced??[]);for(const e of Object.keys(t))n.add((0,l.dy)(i,e));o.not_synced=[...n]}return o}const h=e=>"string"==typeof e&&""!==e.trim();function u(e,t,i){e&&!1!==e.attached&&e.updateConfig(t(e.getConfig()),!i)}function p(e,t,i){const o={...e.custom_icons??{}};void 0===i?delete o[t]:o[t]=i;const n={...e};return Object.keys(o).length?n.custom_icons=o:delete n.custom_icons,n}async function m(e){if(!await(0,r.sL)())return"failed";const t=(0,n.d)(e.from),l=await(0,a.fZ)(e.hass),d=document.createElement(o.sh),m="library"===e.source.kind?e.source.id:void 0;d.hass=e.hass,d.source=e.source,d.libraryAvailable="ok"===l.state,m&&"ok"===l.state&&(d.savedId=m),d.module=await async function(e,t,o){const n={icon:h(t.icon)&&"svg"!==t.icon&&!t.use_entity_icon?t.icon:"",hasStateIcons:h(t.icon_on)||h(t.icon_off),pickedAnimation:!1,followsIcon:!1,linked:o},a=t.design;if(e&&Array.isArray(a?.animations)&&a.animations.length)try{const o=await i.e(734).then(()=>i(7353));Object.assign(n,o.iconAnimationFacts(t,e.getConfig(),e.getState().templateAnimations))}catch{}return n}(t,e.module,e.linked),m&&"ok"===l.state&&void 0!==t?.getConfig().custom_icons?.[m]&&(0,a.sW)(e.hass,m).then(e=>{e&&t.getConfig().custom_icons?.[m]!==e.svg&&u(t,t=>p(t,m,e.svg),!0)});let g=()=>{};return d.addEventListener("mc-svg-save",i=>{var o;!function(e,t,i){if("library"===i.target&&i.saved){const o=i.saved.id;e.apply({icon:`mcu:${o}`,svg:void 0});const n=!!t?.getConfig().custom_icons?.[o];(i.keepCopy||n)&&u(t,e=>p(e,o,i.keepCopy?i.svg:void 0),!0)}else e.apply({icon:"svg",svg:i.svg})}(e,t,i.detail),g(),o=(0,c.t)(465),document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:o}}))}),d.addEventListener("mc-svg-close",()=>g()),g=(0,s.c)(d,{from:e.from,key:"icon-entry"}),"opened"}function g(e,t,i){const o=e.icon;if("svg"===o&&h(e.svg))return{kind:"svg",svg:e.svg};if("string"==typeof o&&o.startsWith("mcu:")){const e=o.slice(4),n=t?.custom_icons?.[e];if(i)return{kind:"library",id:e};if(h(n))return{kind:"svg",svg:n}}}},5047(e,t,i){function o(e,t){for(const i of e.querySelectorAll("*")){if(i.matches(t)&&i.textContent?.trim()&&i.getClientRects().length)return i;const e=i.shadowRoot&&o(i.shadowRoot,t);if(e)return e}}function n(e,t,i){const n=t?function(e){const t=[];for(let i=e;i;)i=i.parentNode??i.host??null,1===i?.nodeType&&t.push(i);return t}(t.from):[],a=document.createElement("dialog");a.className="mc-editor-layer",a.style.cssText="padding:0;border:0;margin:0;width:100vw;height:100vh;max-width:none;max-height:none;background:transparent;color:inherit;overflow:visible;",a.addEventListener("cancel",e=>e.preventDefault());const s=e=>{e.preventDefault(),e.stopPropagation()};a.addEventListener("keydown",e=>{"Escape"===e.key&&s(e)});const r=e=>{"Escape"!==e.key||e.composedPath().includes(a)||(s(e),i?.(),e.stopImmediatePropagation())};if(window.addEventListener("keydown",r,!0),e.tabIndex=-1,a.append(e),document.body.append(a),"function"==typeof a.showModal)try{a.showModal()}catch{a.setAttribute("open","")}else a.setAttribute("open","");return e.focus({preventScroll:!0}),()=>{if(window.removeEventListener("keydown",r,!0),a.isConnected){try{a.close()}catch{}a.remove(),t&&requestAnimationFrame(()=>requestAnimationFrame(()=>function(e,t){const i=`[data-focus-key="${t}"]`;for(const t of e){if(!t.isConnected)continue;const e=t.shadowRoot&&o(t.shadowRoot,i)||o(t,i);if(e)return e.focus({preventScroll:!0})}}(n,t.key)))}}}i.d(t,{c:()=>n})},9899(e,t,i){i.d(t,{uK:()=>m});var o=i(6161),n=i(5707),a=i(158),s=i(5056),r=i(4025),l=i(5047),c=i(7837),d=i(6562),h=i(9100),u=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let p=class extends o.WF{constructor(){super(...arguments),this.kind="animation",this._import=e=>{e.stopPropagation();const t=this.sm;var i,o,n;t&&!1!==t.attached&&(t.updateConfig((i=t.getConfig(),o=e.detail.kind,n=e.detail.items,"shape"===o?{...i,custom_shapes:{...i.custom_shapes,...Object.fromEntries(n.map(e=>[e.id,e.data]))}}:"icon"===o?{...i,custom_icons:{...i.custom_icons,...Object.fromEntries(n.map(e=>[e.id,e.data.svg]))}}:"animation"!==o?i:(0,s.yp)(i,n.map(e=>({...e.data,id:e.id,name:e.name})))),!0),this._config=t.getConfig())}}willUpdate(){this._config??=this.sm?.getConfig()}firstUpdated(){this.renderRoot.querySelector("mc-ui-window")?.show()}render(){return o.qy`<mc-ui-window .variant=${"function"==typeof matchMedia&&matchMedia("(max-width: 599px)").matches?"sheet":"picker"} heading=${(0,h.t)(513)} closeLabel=${(0,h.t)(197)} movable resizable maximizable moveLabel=${(0,h.t)(604)} resizeLabel=${(0,h.t)(827)} maximizeLabel=${(0,h.t)(571)} restoreLabel=${(0,h.t)(828)} @mc-window-close=${()=>this.onClose?.()}>
      <mc-library-view .hass=${this.hass} .source=${d.Jk} .config=${this._config} .inline=${!0} .startKind=${this.kind} @mc-transfer-import=${this._import}></mc-library-view>
    </mc-ui-window>`}};async function m(e,t,i){try{await(0,c.c)()}catch{return o=(0,h.t)(1047),void document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:o}}))}var o;const n=document.createElement("mc-library-sheet");n.hass=t,n.kind=i,n.sm=(0,r.d)(e);const a=(0,l.c)(n,void 0,()=>n.onClose?.());n.parentElement?.setAttribute("aria-label",(0,h.t)(513)),n.onClose=()=>{a(),e.focus()}}p.styles=[a.x,o.AH`
      :host {
        display: contents;
      }
      mc-library-view {
        display: block;
      }
    `],u([(0,n.MZ)({attribute:!1})],p.prototype,"hass",void 0),u([(0,n.MZ)({type:String})],p.prototype,"kind",void 0),u([(0,n.MZ)({attribute:!1})],p.prototype,"onClose",void 0),u([(0,n.MZ)({attribute:!1})],p.prototype,"sm",void 0),u([(0,n.wk)()],p.prototype,"_config",void 0),p=u([(0,n.EM)("mc-library-sheet")],p)},6562(e,t,i){i.d(t,{wQ:()=>w,sW:()=>b,Jk:()=>x,fZ:()=>g,Zz:()=>f,$C:()=>k,F7:()=>$,k4:()=>v,VC:()=>y,yR:()=>_});var o=i(2061),n=i(5556),a=i(3251),s=i(3920);const r=/^mcu:([a-z0-9][a-z0-9_-]{0,63})$/;const l=e=>String(e?.code??"");let c,d;const h={};let u=!1;async function p(e,t,i){if(u||!e?.callWS)return{state:"missing",items:[]};try{const o=await e.callWS({type:t}),n=Array.isArray(o?.[i])?o[i]:[];return h[i]=new Set(n.map(e=>String(e.id))),{state:"ok",items:n}}catch(e){return"unknown_command"===l(e)&&(u=!0),{state:"unknown_command"===l(e)?"missing":"error",items:[]}}}const m=()=>Promise.resolve({state:"missing",items:[]}),g=e=>e?.callWS?c??=p(e,o.dD.iconsList,"icons"):m(),f=e=>e?.callWS?d??=p(e,o.dD.shapesList,"shapes"):m();function v(e){return d=void 0,f(e)}async function b(e,t){if(e?.callWS)try{const i=await e.callWS({type:o.dD.iconsGet,ids:[t]});return i?.icons?.[0]}catch{return}}async function y(e,t){if(!e?.callWS)return{error:"unreachable"};try{const i=await e.callWS({type:o.dD.shapesSave,shape:t});return d=void 0,h.shapes=new Set([...h.shapes??[],i.shape.id]),{shape:i.shape}}catch(e){const t=l(e);return{error:"unauthorized"===t?"readonly":"library_full"===t?"full":"invalid_format"===t?"invalid":"unreachable"}}}function _(e,t){return e.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60).replace(/-+$/,"")||t}function w(e,t){if(!t.has(e))return e;for(let i=2;;i++)if(!t.has(`${e}-${i}`))return`${e}-${i}`}"undefined"!=typeof window&&window.addEventListener(o.S8,()=>{c=d=void 0});const $=e=>function(e,t){if(e.template)return e;t.animations&&(e=function(e,t){const i=(0,a.B)(e.custom_animations);if(!i.length)return e;const o=new Set((0,a.Gd)(e));for(let e=!0;e;){e=!1;for(const t of i){if(!o.has(String(t.id)))continue;const i=Array.isArray(t.steps)?t.steps:[];for(const t of i){const i="string"==typeof t?.animation&&t.animation.startsWith(s.D8)?(0,s._R)(t.animation):"";i&&!o.has(i)&&(e=!!o.add(i))}}}const n=e=>!o.has(String(e.id))&&t.has(String(e.id));if(!i.some(n))return e;const r=e.custom_animations,l={...e},c=Array.isArray(r)?r.filter(e=>!(e&&"object"==typeof e&&n(e))):Object.fromEntries(Object.entries(r).filter(([e,t])=>!(t&&"object"==typeof t&&n({id:e,...t}))));return Object.keys(c).length?l.custom_animations=c:delete l.custom_animations,l}(e,t.animations));const i=!!e.custom_icons&&"object"==typeof e.custom_icons,o=!!e.custom_shapes&&"object"==typeof e.custom_shapes;if(!(i&&t.icons||o&&t.shapes))return e;const n=function(e){const t=new Set,i=new Set,o=(e,n)=>{if("string"==typeof e){const i=r.exec(e);return void(i&&t.add(i[1]))}if(!e||"object"!=typeof e)return;if(Array.isArray(e)){for(const t of e)o(t,n);return}const a=e;"shape_options"===n&&"string"==typeof a.ref&&i.add(a.ref);for(const[e,t]of Object.entries(a))"custom_icons"!==e&&"custom_shapes"!==e&&o(t,e)};return o(e,""),{icons:t,shapes:i}}(e),l=(e,t,i)=>{const o=Object.entries(e).filter(([e])=>i.has(e)||!t.has(e));return o.length===Object.keys(e).length?void 0:Object.fromEntries(o)};let c=e;const d=i&&t.icons?l(e.custom_icons,t.icons,n.icons):void 0,h=o&&t.shapes?l(e.custom_shapes,t.shapes,n.shapes):void 0;return d&&(c={...c},Object.keys(d).length?c.custom_icons=d:delete c.custom_icons),h&&(c={...c},Object.keys(h).length?c.custom_shapes=h:delete c.custom_shapes),c}(e,{...h,animations:"ready"===(0,n.T_)().status?{has:e=>!!(0,n.T_)().get(e)}:void 0});function k(e){return{icons:!!e.custom_icons&&Object.keys(e.custom_icons).length>0&&!h.icons&&!u&&!c,shapes:!!e.custom_shapes&&Object.keys(e.custom_shapes).length>0&&!h.shapes&&!u&&!d}}const x={listIcons:g,listShapes:f,getIcon:b,isSaved:(e,t)=>!!h[e]?.has(t),reset:function(){c=d=void 0,h.icons=h.shapes=void 0,u=!1}}},7503(e,t,i){i.d(t,{RX:()=>l,sL:()=>r});var o=i(3034);let n,a;var s=i(7837);const r=function(){return customElements.get(o.sh)?Promise.resolve(!0):(n??=Promise.race([i.e(167).then(()=>i(7059)).then(()=>!0),new Promise(e=>setTimeout(()=>e(!1),8e3))]).then(e=>(e||(n=void 0),e),e=>(n=void 0,console.warn("Magic Card: SVG editor not loaded",e),!1)),n)},l=function(){return customElements.get(o.zh)?Promise.resolve(!0):(a??=Promise.race([i.e(820).then(()=>i(3094)).then(()=>!0),new Promise(e=>setTimeout(()=>e(!1),8e3))]).then(e=>(e||(a=void 0),e),e=>(a=void 0,console.warn("Magic Card: shape editor not loaded",e),!1)),a)};"undefined"!=typeof window&&(window.MagicCard=Object.assign(window.MagicCard??{},{loadSvgEditor:r,loadShapeEditor:l,loadTransfer:s.c}))},8776(e,t,i){i.r(t),i.d(t,{EDITOR_VERSION:()=>vl,labelsReady:()=>Gt.G});var o=i(6161),n=i(5707),a=i(598),s=i(3251),r=i(9095),l=i(158),c=i(5499);class d{constructor(e=50){this.undoStack=[],this.redoStack=[],this.limit=e}push(e){this.undoStack.push((0,c.G)(e)),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack=[]}undo(e){return 0===this.undoStack.length?null:(this.redoStack.push((0,c.G)(e)),this.undoStack.pop())}redo(e){return 0===this.redoStack.length?null:(this.undoStack.push((0,c.G)(e)),this.redoStack.pop())}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}clear(){this.undoStack=[],this.redoStack=[]}get undoCount(){return this.undoStack.length}get redoCount(){return this.redoStack.length}}var h=i(9100);const u=["horizontal","vertical","row","tabs","slider-layout"];function p(e){const t=e;if(u.includes(e.type)&&(t.share_entity=!0),"row"===e.type&&Array.isArray(t.columns))for(const e of t.columns)e.share_entity=!0;return"text"===e.type&&"Hello World"===t.text?t.text=(0,h.t)(437):"button"===e.type&&"Button"===t.label?t.label=(0,h.t)(156):"tabs"===e.type&&Array.isArray(t.tabs)&&t.tabs.forEach((e,t)=>{e.label===`Tab ${t+1}`&&(e.label=(0,h.t)(1018,{n:t+1}))}),e}var m=i(6828),g=i(6562),f=i(8590),v=i(7137);const b=()=>({id:(0,v.$)("col"),share_entity:!0,modules:[]});function y(e,t){for(const[i,o]of Object.entries(t))void 0===o&&delete e[i];return e}var _=i(7526),w=i(2453),$=i(5746),k=i(2455),x=i(3920);const C="magic-card:module-clipboard",S=new Set(["__proto__","constructor","prototype"]);function M(e){if(Array.isArray(e))return e.map(e=>M(e));if(!e||"object"!=typeof e)return e;const t={};for(const[i,o]of Object.entries(e))"not_synced"===i||i.startsWith("_")||void 0===o||S.has(i)||(t[i]=M(o));return t}function A(e,t=0){if(!e||"object"!=typeof e||Array.isArray(e)||t>32)return!1;const i=e,o="string"==typeof i.type?_.s.get(i.type):void 0;if(!o)return!1;try{if(o.validate(i).length)return!1}catch{return!1}return((0,$.yZ)(i)??[]).every(e=>e.every(e=>A(e,t+1)))}function q(...e){const t=new Map;for(const i of e)for(const e of(0,s.B)(i))"string"==typeof e.id&&t.set(e.id,e);return t}function E(){try{const e=localStorage.getItem(C);if(!e)return;const t=JSON.parse(e);if(!t||"object"!=typeof t)return;const i=M(t.module&&"object"==typeof t.module?t.module:t);if(!A(i))return;return{module:i,docs:(0,s.B)(M(t.module?t.custom_animations:void 0)).filter(e=>"string"==typeof e.id)}}catch{return}}function T(){return E()?.module}const L=(e,t)=>JSON.stringify(e)===JSON.stringify(t);function z(e,t){const i=(e.startsWith("quick-")?e.replace(/-[a-z0-9]{6}$/,""):e).slice(0,56);for(;;){const e=`${i}-${Math.floor(Math.random()*36**6).toString(36).padStart(6,"0")}`;if(!t.has(e))return e}}function j(e,t){if(Array.isArray(e))return e.forEach(e=>j(e,t));if(!e||"object"!=typeof e)return;const i=e;for(const[e,o]of Object.entries(i))if("preset"!==e&&"animation"!==e||!(0,x.Bl)(o))o&&"object"==typeof o&&j(o,t);else{const n=t.get((0,x._R)(o));n&&(i[e]=`${x.D8}${n}`)}}var R=i(5556),O=i(6485);const P="magic-card:design-clipboard";function H(e){const t=(0,c.G)(e||{});for(const e of Object.keys(t))("not_synced"===e||e.startsWith("_")||void 0===t[e]||""===t[e])&&delete t[e];return t}function D(e){const t=H(e);try{localStorage.setItem(P,JSON.stringify(t))}catch{}try{navigator.clipboard?.writeText((0,k.fE)(t))?.catch(()=>{})}catch{}return t}function I(){try{const e=localStorage.getItem(P);if(!e)return;const t=JSON.parse(e);return(e=>!!e&&"object"==typeof e&&!Array.isArray(e))(t)?t:void 0}catch{return}}function F(e,t,i){const o=H(t),n=(0,O.Sd)(o).map(e=>({...e,id:(0,v.$)("anim")})),a=(e=>(e||[]).map(e=>({...e,id:(0,v.$)("rule"),conditions:(e.conditions||[]).map(e=>e.id?{...e,id:(0,v.$)("cond")}:e)})))(o.conditional),s="replace"===i?{}:H(e),r={...s,...o},l="replace"===i?n:[...(0,O.Sd)(s),...n];for(const[e,t]of Object.entries((0,O.Tk)(l)))void 0===t?delete r[e]:r[e]=t;const c="replace"===i?a:[...s.conditional||[],...a];return c.length?r.conditional=c:delete r.conditional,r}var V=i(6365);function N(e){return e&&"string"==typeof e.id&&e.id?e.id:void 0}function Z(e,t){if(!e.template)return!1;const i=(0,w.cv)(e,t);return!(!i||N(i)||t.child?.length&&N(e.rows[t.row]?.columns[t.col]?.modules[t.module]))}function B(e,t){const i=[],o=(n,a,s)=>{if(!n||"object"!=typeof n)return;const r=(0,w.Iu)(n),l=function(e,t){const i=(0,w.$N)(e);if(i)return i;const o="string"==typeof e.entity?e.entity.trim():"";if(!o)return;const n=t?.states?.[o]?.attributes?.friendly_name;return"string"==typeof n&&n.trim()?n.trim():o}(n,t),c=N(n);i.push({value:c??`@${(0,w.VC)(a)}`,id:c,label:[...s,r,...l?[l]:[]].join(" · "),name:l??r,..."string"==typeof n.type?{type:n.type}:{},sel:a,...Z(e,a)?{locked:!0}:{}}),((0,$.yZ)(n)??[]).forEach((e,t)=>{const i=(0,V.D)(n,t);e.forEach((e,n)=>o(e,(0,w.br)(a.row,a.col,a.module,[...a.child??[],{slot:t,index:n}]),[...s,r,...i?[i]:[]]))})};(e.rows||[]).forEach((e,t)=>(e?.columns||[]).forEach((e,i)=>(e?.modules||[]).forEach((e,n)=>o(e,(0,w.br)(t,i,n),[(0,h.t)(843,{n:t+1}),(0,h.t)(218,{n:i+1})]))));const n=new Map;for(const e of i)n.set(e.label,(n.get(e.label)??0)+1);for(const e of i){if((n.get(e.label)??0)<2)continue;const t=e.sel.child?.[e.sel.child.length-1];e.label=`${e.label} · ${(0,h.t)(593,{n:(t?t.index:e.sel.module)+1})}`}return i}function W(e,t=new Set){if(!e||"object"!=typeof e)return t;const i=N(e);i&&t.add(i);for(const i of(0,$.yZ)(e)??[])for(const e of i)W(e,t);return t}function K(e){const t=new Set;for(const i of e.rows||[])for(const e of i?.columns||[])for(const i of e?.modules||[])W(i,t);return t}function U(e,t){const i=(0,w.cv)(e,t);if(!i)return;const o=N(i);if(o)return o;if(!Z(e,t)){if(i.id=(0,v.$)(i.type||"module"),e.template&&t.child?.length){const i=e.rows[t.row]?.columns[t.col]?.modules[t.module],o=(0,$.us)(i),n=i?.not_synced||[];i&&o&&!n.includes(o)&&(i.not_synced=[...n,o])}return i.id}}function G(e,t,i=B(e)){if(!t.startsWith("@"))return t;const o=i.find(e=>e.value===t);return o&&!o.locked?U(e,o.sel):void 0}function Y(){return{id:(0,v.$)("flow")}}function Q(e){if(!e.template)return;const t=e.not_synced||[];t.includes("flows")||(e.not_synced=[...t,"flows"])}function J(e,t){const i=t.flows;if(!Array.isArray(i)||!i.length)return!1;const o=K(e),n=K(t),a=e=>"string"==typeof e&&o.has(e)&&!n.has(e),s=i.filter(e=>!(e&&"object"==typeof e&&(a(e.from)||a(e.to))));return s.length!==i.length&&(s.length?t.flows=s:delete t.flows,Q(t),!0)}var X=i(3057);function ee(e,t,i,o){if(!e.template)return;const n=e.rows[t]?.columns[i]?.modules[o],a=(0,$.us)(n);if(!n||!a)return;const s=n.not_synced||[];s.includes(a)||(n.not_synced=[...s,a])}function te(e,t,i){if(!e.template)return;const o=e.rows[t]?.columns[i];o&&!o.not_synced?.includes("modules")&&(o.not_synced=[...o.not_synced||[],"modules"])}function ie(e,t){const i={...e,...t};for(const[e,o]of Object.entries(t))void 0===o&&delete i[e];return i}function oe(e){if(e&&"object"==typeof e){delete e.not_synced;for(const t of(0,$.yZ)(e)??[])for(const e of t)oe(e)}}function ne(e){if(!e||"object"!=typeof e)return;e.id=(0,v.$)(e.type);const t=e;if("row"===e.type&&Array.isArray(t.columns))for(const e of t.columns)e&&"object"==typeof e&&e.id&&(e.id=(0,v.$)("col"));for(const t of(0,$.yZ)(e)??[])for(const e of t)ne(e)}const ae=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function se(e,t){if(!ae(e)||!Array.isArray(e.tab_disabled_tabs))return!1;const i=[...new Set(e.tab_disabled_tabs.map(e=>"number"==typeof e?t(e):-1).filter(e=>e>=0))].sort((e,t)=>e-t);return i.length?e.tab_disabled_tabs=i:delete e.tab_disabled_tabs,!0}function re(e,t){const i=e.design,o=se(i,t);let n=!1;const a=ae(i)&&Array.isArray(i.conditional)?i.conditional:[];for(const e of a)ae(e)&&se(e.design,t)&&(n=!0);return{base:o,rules:n}}const le=e=>[...e.base?["design.tab_disabled_tabs"]:[],...e.rules?["design.conditional"]:[]];class ce{constructor(e){this.fireEvent=e,this.undoRedo=new d,this.listeners=new Set,this.attached=!0,this._selectionSeq=0,this._selectionReveal=!0,this.state={config:{type:"custom:magic-card",rows:[]},selectedPath:null,activeTab:"general",editorMode:"form",isDirty:!1},this.dispatchConfigChanged=function(e){let t=null,i=null;const o=function(...o){null!==t&&clearTimeout(t),i=()=>e.apply(this,o),t=setTimeout(()=>{t=null;const e=i;i=null,e?.()},200)};return o.cancel=()=>{null!==t&&(clearTimeout(t),t=null),i=null},o.flush=()=>{const e=i;o.cancel(),e?.()},o}(e=>{this.fireEvent(e)})}subscribe(e){return this.listeners.add(e),e(this.state),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return this.state}getConfig(){return this.state.config}getSelectedModule(){return(0,w.cv)(this.state.config,(0,w.c4)(this.state.selectedPath))??null}_moduleList(e,t,i,o,n){const a=e.rows[t]?.columns[i]?.modules;if(!a)return;if(!n?.length)return{list:a,index:o};const s=(0,$.Rv)(a[o],n.slice(0,-1)),r=n[n.length-1],l=s?(0,$.rX)(s,r.slot):void 0;return l?{list:l,index:r.index}:void 0}_pathWithIndex(e,t,i,o,n){if(!o?.length)return{rowIndex:e,columnIndex:t,moduleIndex:n};const a=o.map(e=>({...e}));return a[a.length-1].index=n,{rowIndex:e,columnIndex:t,moduleIndex:i,childPath:a}}_markChildList(e,t,i,o){ee(e,t,i,o)}_clampedPath(e,t){return(0,w.bm)((0,w.Sh)(e,(0,w.c4)(t)))}_liveFlow(e){const t=this.state.selectedFlow??null;return t&&(0,X.rP)(Array.isArray(e.flows)?e.flows:[]).includes(t)?t:null}setConfig(e){const t=(0,c.G)(e);this.state={...this.state,config:t,isDirty:!1,selectedPath:this._clampedPath(t,this.state.selectedPath),selectedFlow:this._liveFlow(t)},this.notify()}setTemplateAnimations(e){this.state={...this.state,templateAnimations:e},this.notify()}updateConfig(e,t=!0){const i=this.state.config;t&&this.undoRedo.push(this.state.config);const o=(0,c.G)(e),n="yaml"===this.state.editorMode?o:(0,g.F7)(o);this.state={...this.state,config:n,isDirty:!0,selectedPath:this._clampedPath(n,this.state.selectedPath),selectedFlow:this._liveFlow(n)},this.notify(),this.dispatchConfigChanged(this.state.config);const a=e=>JSON.stringify(e).includes('"custom:cat-');(/"(custom:quick-|anim-icon-)/.test(JSON.stringify(n.rows))||a(i)||a(n))&&(0,m.qB)(this,i,n)}setEditorMode(e){this.state={...this.state,editorMode:"yaml"===e?"yaml":"form"},this.notify()}get selectionSeq(){return this._selectionSeq}get selectionReveal(){return this._selectionReveal}setSelectedPath(e,t={}){this._selectionSeq++,this._selectionReveal=!1!==t.reveal;const i=this._clampedPath(this.state.config,e);this.state={...this.state,selectedPath:i,selectedFlow:i?null:this.state.selectedFlow},this.notify()}selectFlow(e){this.state={...this.state,selectedFlow:e,selectedPath:e?null:this.state.selectedPath},this.notify()}addFlow(e,t){const i=(0,c.G)(this.state.config),o=U(i,e),n=U(i,t);if(!o||!n||o===n)return;const a={...Y(),from:o,to:n};return i.flows=[...Array.isArray(i.flows)?i.flows:[],a],Q(i),this.updateConfig(i),this.selectFlow(a.id),a.id}_commitRemoval(e){J(this.state.config,e),this.updateConfig(e)}setActiveTab(e){this.state={...this.state,activeTab:e},this.notify()}_equalLayout(e){return Array.from({length:Math.max(e,1)},()=>"1").join("-")}addRow(e="1"){const t=(0,c.G)(this.state.config),i=e.split("-").length,o=Array.from({length:i},b);t.rows.push({id:(0,v.$)("row"),share_entity:!0,layout:e,columns:o}),this.updateConfig(t)}deleteRow(e){const t=(0,c.G)(this.state.config);t.rows.splice(e,1),this._commitRemoval(t)}moveRow(e,t){if(e===t)return;const i=(0,c.G)(this.state.config),[o]=i.rows.splice(e,1);i.rows.splice(t,0,o),this.updateConfig(i)}updateRow(e,t){const i=(0,c.G)(this.state.config);i.rows[e]=y({...i.rows[e],...t},t),this.updateConfig(i)}setRowLayout(e,t){const i=(0,c.G)(this.state.config),o=i.rows[e];o&&((0,f.Hi)(o,t,b),this._markRowLocal(i,o,"layout","column_widths"),this.updateConfig(i))}setColumnWidths(e,t,i,o=!1){const n=(0,c.G)(this.state.config),a=n.rows[e];a&&(t?.length?a.column_widths=[...t]:delete a.column_widths,i&&(a.layout=i),t?.length||i?this._markRowLocal(n,a,"column_widths",...i?["layout"]:[]):a.not_synced?.includes("column_widths")&&(a.not_synced=a.not_synced.filter(e=>"column_widths"!==e),a.not_synced.length||delete a.not_synced),this.updateConfig(n,!o))}_markRowLocal(e,t,...i){if(!e.template)return;const o=t.not_synced||[],n=i.filter(e=>!o.includes(e));n.length&&(t.not_synced=[...o,...n])}addColumn(e){const t=(0,c.G)(this.state.config),i=t.rows[e];i.columns.push(b()),Array.isArray(i.column_widths)&&i.column_widths.length?(i.column_widths=[...(0,f.M0)(i.column_widths,i.columns.length-1),"1fr"],this._markRowLocal(t,i,"column_widths")):(delete i.column_widths,i.layout=this._equalLayout(i.columns.length)),this.updateConfig(t)}deleteColumn(e,t){const i=(0,c.G)(this.state.config),o=i.rows[e];if(o.columns.splice(t,1),0===o.columns.length)i.rows.splice(e,1);else if(o.layout=this._equalLayout(o.columns.length),Array.isArray(o.column_widths)&&o.column_widths.length){const e=(0,f.M0)(o.column_widths,o.columns.length+1);e.splice(t,1),o.columns.length<2?delete o.column_widths:o.column_widths=e,this._markRowLocal(i,o,"column_widths")}this._commitRemoval(i)}updateColumn(e,t,i){const o=(0,c.G)(this.state.config);o.rows[e].columns[t]=y({...o.rows[e].columns[t],...i},i),this.updateConfig(o)}_designItem(e,t){const i=e.rows[t.row],o=void 0!==t.col?i?.columns[t.col]:void 0;if(void 0!==t.module){const e=(0,$.Rv)(o?.modules[t.module],t.child??[]);return void 0===t.slot?e:"row"===e?.type?e.columns?.[t.slot]:void 0}return void 0!==t.col?o:i}copyDesign(e){D(this._designItem(this.state.config,e)?.design)}pasteDesign(e,t){const i=I();if(!i)return!1;const o=(0,c.G)(this.state.config),n=this._designItem(o,e);if(!n)return!1;const a=n.design||{},s=F(n.design,i,t);if(n.design=s,o.template&&void 0!==e.module&&(e.child?.length||void 0!==e.slot))this._markChildList(o,e.row,e.col,e.module);else if(o.template){const t=new Set(n.not_synced||[]);if(void 0===e.module)t.add("design");else for(const e of new Set([...Object.keys(a),...Object.keys(s)]))JSON.stringify(a[e])!==JSON.stringify(s[e])&&t.add(`design.${e}`);n.not_synced=[...t]}return this.updateConfig(o),!0}addModule(e,t,i){const o=(0,c.G)(this.state.config),n=_.s.createDefault(i);if(!n)return;const a=p(n);o.rows[e].columns[t].modules.push(a);const s=o.rows[e].columns[t].modules.length-1;this.updateConfig(o),this.setSelectedPath({rowIndex:e,columnIndex:t,moduleIndex:s})}deleteModule(e,t,i,o){const n=(0,c.G)(this.state.config);if(o?.length){const a=this._moduleList(n,e,t,i,o);if(!a||!a.list[a.index])return;a.list.splice(a.index,1),this._markChildList(n,e,t,i);const s=o.slice(0,-1),r=(0,$.Rv)(n.rows[e].columns[t].modules[i],s);return this.state={...this.state,selectedPath:a.list.length?this._pathWithIndex(e,t,i,o,Math.min(a.index,a.list.length-1)):(0,$.WA)(r)?this._slotPath(e,t,i,s,o[o.length-1].slot):{rowIndex:e,columnIndex:t,moduleIndex:i,...s.length?{childPath:s.map(e=>({...e}))}:{}}},void this._commitRemoval(n)}n.rows[e].columns[t].modules.splice(i,1);const a=this.state.selectedPath;a?.rowIndex===e&&a.columnIndex===t&&void 0!==a.moduleIndex&&a.moduleIndex>i&&(this.state={...this.state,selectedPath:{...a,moduleIndex:a.moduleIndex-1}}),this._commitRemoval(n)}updateModule(e,t,i,o,n){const a=(0,c.G)(this.state.config),s=this._moduleList(a,e,t,i,n);s&&s.list[s.index]&&(s.list[s.index]={...s.list[s.index],...o},this._commitRemoval(a))}replaceModule(e,t,i,o,n){const a=(0,c.G)(this.state.config),s=this._moduleList(a,e,t,i,n);s&&s.list[s.index]&&(s.list[s.index]=(0,c.G)(o),this._commitRemoval(a))}moveModule(e,t,i,o,n,a){const s=(0,c.G)(this.state.config),[r]=s.rows[e].columns[t].modules.splice(i,1);s.rows[o].columns[n].modules.splice(a,0,r),this.updateConfig(s)}duplicateModule(e,t,i,o){const n=(0,c.G)(this.state.config),a=this._moduleList(n,e,t,i,o);if(!a||!a.list[a.index])return;const s=(0,c.G)(a.list[a.index]);ne(s),a.list.splice(a.index+1,0,s),o?.length&&this._markChildList(n,e,t,i),this.state={...this.state,selectedPath:this._pathWithIndex(e,t,i,o,a.index+1)},this.updateConfig(n)}duplicateRow(e){const t=(0,c.G)(this.state.config),i=(0,c.G)(t.rows[e]);i.id=(0,v.$)("row");for(const e of i.columns){e.id=(0,v.$)("col");for(const t of e.modules)ne(t)}t.rows.splice(e+1,0,i),this.state={...this.state,selectedPath:{rowIndex:e+1}},this.updateConfig(t)}moveModuleBy(e,t,i,o,n){if(n?.length){const a=(0,c.G)(this.state.config),s=this._moduleList(a,e,t,i,n),r=(s?.index??-1)+o;if(!s||!s.list[s.index]||r<0||r>=s.list.length)return!1;const[l]=s.list.splice(s.index,1);return s.list.splice(r,0,l),this._markChildList(a,e,t,i),this.state={...this.state,selectedPath:this._pathWithIndex(e,t,i,n,r)},this.updateConfig(a),!0}const a=this.state.config.rows[e]?.columns[t]?.modules,s=i+o;return!(!a||s<0||s>=a.length||(this.state={...this.state,selectedPath:{rowIndex:e,columnIndex:t,moduleIndex:s}},this.moveModule(e,t,i,e,t,s),0))}moveModuleToColumn(e,t,i,o,n){const a=this.state.config.rows,s=a[o]?.columns[n];if(!a[e]?.columns[t]?.modules?.[i]||!s)return!1;if(e===o&&t===n)return!1;const r=(0,c.G)(this.state.config),[l]=r.rows[e].columns[t].modules.splice(i,1),d=r.rows[o].columns[n];return Array.isArray(d.modules)||(d.modules=[]),d.modules.push(l),this.state={...this.state,selectedPath:{rowIndex:o,columnIndex:n,moduleIndex:d.modules.length-1}},this.updateConfig(r),!0}moveChildToSlot(e,t,i,o,n){if(!o.length)return!1;if(o[o.length-1].slot===n)return!1;const a=(0,c.G)(this.state.config),s=this._moduleList(a,e,t,i,o),r=(0,$.Rv)(a.rows[e]?.columns[t]?.modules[i],o.slice(0,-1)),l=r?(0,$.rX)(r,n):void 0;if(!s||!s.list[s.index]||!l)return!1;const[d]=s.list.splice(s.index,1);l.push(d),this._markChildList(a,e,t,i);const h=o.map(e=>({...e}));return h[h.length-1]={slot:n,index:l.length-1},this.state={...this.state,selectedPath:{rowIndex:e,columnIndex:t,moduleIndex:i,childPath:h}},this.updateConfig(a),!0}_editItem(e,t,i){const o=(0,c.G)(this.state.config),n=(0,w.R9)(o,e);if(!n||!1===i(n))return!1;if(o.template&&"card"!==e.kind)if("slot"===e.kind||"module"===e.kind&&e.child?.length)this._markChildList(o,e.row,e.col,e.module);else{const e=n.not_synced||[];e.includes(t)||(n.not_synced=[...e,t])}return this.updateConfig(o),!0}setHidden(e,t){return"card"!==e.kind&&this._editItem(e,"hidden",e=>{if(!0===e.hidden===t)return!1;t?e.hidden=!0:delete e.hidden})}setLayerName(e,t,i){const o=t.trim();if("card"===e.kind)return this._editItem(e,"name",e=>{if((e.name??"")===o)return!1;o?e.name=o:delete e.name});if("slot"===e.kind&&"tabs"===(0,w.kW)(this.state.config,e)?.type){const t=(0,w.R9)(this.state.config,e);return!(!o||!t||t.label===o||(this.renameTab(e.row,e.col,e.module,e.child?.map(e=>({...e})),e.slot,o),0))}const n=o&&o!==i?o:void 0;return this._editItem(e,"editor_name",e=>{if(e.editor_name===n)return!1;n?e.editor_name=n:delete e.editor_name})}_playedDocs(e){return(0,a.wL)(e,this.state.templateAnimations).custom_animations}copyModule(e){const t=(0,w.cv)(this.state.config,e);if(t)return function(e,t=[]){const i=M(e);try{localStorage.setItem(C,JSON.stringify({module:i,custom_animations:M(t)}))}catch{}try{navigator.clipboard?.writeText((0,k.fE)(i))?.catch(()=>{})}catch{}return i}(t,function(e,t){const i=new Map,o=(0,s.Gd)(e);for(;o.length;){const e=o.shift(),n=t.get(e);if(!n||i.has(e))continue;i.set(e,n);const a=n.steps;for(const e of Array.isArray(a)?a:[])(0,x.Bl)(e?.animation)&&o.push((0,x._R)(e.animation))}return[...i.values()]}(t,q(this._playedDocs(this.state.config))))}pasteModule(e){const t=E();if(!t)return!1;const i=(0,c.G)(t.module);ne(i);const o=(0,c.G)(this.state.config),n=(0,s.B)(o.custom_animations),a=[...(0,s.Gd)(o),...(0,R.T_)().list().map(e=>e.id)],r=function(e,t,i,o){const n=new Set([...o,...i.keys(),...t.map(e=>String(e.id))]),a=new Map,s=[];for(const e of t){const t=String(e.id),o=i.get(t);if(o&&(L(o,e)||t.startsWith("cat-")))continue;const r={...e};o&&(r.id=z(t,n),n.add(r.id),a.set(t,r.id)),s.push(r)}return a.size&&(j(e,a),j(s,a)),s}(i,t.docs,q(this._playedDocs(o)),a);let l;if(r.length&&(o.custom_animations=[...n,...r]),"module"===e.kind){const t=this._moduleList(o,e.row,e.col,e.module,e.child);if(!t||!t.list[t.index])return!1;t.list.splice(t.index+1,0,i),e.child?.length&&this._markChildList(o,e.row,e.col,e.module),l=this._pathWithIndex(e.row,e.col,e.module,e.child,t.index+1)}else if("column"===e.kind){const t=o.rows[e.row]?.columns[e.col];if(!t)return!1;Array.isArray(t.modules)||(t.modules=[]),l={rowIndex:e.row,columnIndex:e.col,moduleIndex:t.modules.push(i)-1}}else{if("slot"!==e.kind)return!1;{const t=this._layoutIn(o,e.row,e.col,e.module,e.child),n=t?(0,$.rX)(t,e.slot):void 0;if(!n)return!1;const a=n.push(i)-1;this._markChildList(o,e.row,e.col,e.module),l={rowIndex:e.row,columnIndex:e.col,moduleIndex:e.module,childPath:[...(e.child??[]).map(e=>({...e})),{slot:e.slot,index:a}]}}}return this.state={...this.state,selectedPath:l},this.updateConfig(o),!0}wrapInLayout(e,t){if("module"!==e.kind)return!1;const i=_.s.createDefault(t),o=i&&p(i),n=o?(0,$.rX)(o,0):void 0;if(!o||!n)return!1;const a=(0,c.G)(this.state.config),s=this._moduleList(a,e.row,e.col,e.module,e.child);return!(!s||!s.list[s.index]||(n.splice(0,n.length,s.list[s.index]),s.list[s.index]=o,e.child?.length?this._markChildList(a,e.row,e.col,e.module):te(a,e.row,e.col),this.state={...this.state,selectedPath:this._pathWithIndex(e.row,e.col,e.module,e.child,s.index)},this.updateConfig(a),0))}_resetTarget(e,t){if(!e.template||"card"===t.kind)return;if("slot"===t.kind||"module"===t.kind&&t.child?.length){const i=e.rows[t.row]?.columns[t.col]?.modules?.[t.module],o=(0,$.us)(i);return i&&o&&i.not_synced?.includes(o)?{item:i,key:o}:void 0}const i=(0,w.R9)(e,t);if(!i)return;const o=i.not_synced?.length,n="module"===t.kind&&JSON.stringify((0,$.yZ)(i)??[]).includes('"not_synced"');return o||n?{item:i}:void 0}hasOverrides(e){return!!this._resetTarget(this.state.config,e)}ownsModuleList(e){return!("column"!==e.kind||!this.state.config.template||!this.state.config.rows[e.row]?.columns[e.col]?.not_synced?.includes("modules"))}resetItem(e,t=!1){if(this.ownsModuleList(e)&&!t)return!1;const i=(0,c.G)(this.state.config),o=this._resetTarget(i,e);if(!o)return!1;if(o.key){const e=o.item.not_synced.filter(e=>e!==o.key);e.length?o.item.not_synced=e:delete o.item.not_synced}else"module"===e.kind?oe(o.item):(t&&"column"===e.kind&&(o.item.modules=[]),delete o.item.not_synced);return this.updateConfig(i),!0}_layoutIn(e,t,i,o,n){return(0,$.Rv)(e.rows[t]?.columns[i]?.modules?.[o],n??[])}_editLayout(e,t,i,o,n=!1){const[a,s,r,l]=e,d=(0,c.G)(this.state.config),h=this._layoutIn(d,a,s,r,l);if(h&&!1!==i(h)){if("row"===h.type&&Array.isArray(h.columns))for(const e of h.columns)e&&"object"==typeof e&&!e.id&&(e.id=(0,v.$)("col"));if(d.template)if(l?.length)this._markChildList(d,a,s,r);else{const e=h.not_synced||[],i=("function"==typeof t?t(h):t).filter(t=>!e.includes(t));i.length&&(h.not_synced=[...e,...i])}o&&(this.state={...this.state,selectedPath:o(h)}),J(this.state.config,d),this.updateConfig(d,!n)}}_slotPath(e,t,i,o,n){return{rowIndex:e,columnIndex:t,moduleIndex:i,...o?.length?{childPath:o.map(e=>({...e}))}:{},slotIndex:n}}addChildModule(e,t,i,o,n,a){const s=_.s.createDefault(a);if(!s)return;const r=p(s);let l=-1;this._editLayout([e,t,i,o],e=>[(0,$.us)(e)],e=>{const t=(0,$.rX)(e,n);if(!t)return!1;l=t.push(r)-1},()=>({rowIndex:e,columnIndex:t,moduleIndex:i,childPath:[...(o??[]).map(e=>({...e})),{slot:n,index:l}]}))}_tabsEdit(e,t,i,o=()=>[]){this._editLayout(e,()=>["tabs",...o()],e=>"tabs"===e.type&&(Array.isArray(e.tabs)||(e.tabs=[]),t(e.tabs,e)),i)}addTab(e,t,i,o){this._tabsEdit([e,t,i,o],e=>{e.push({label:(0,h.t)(1018,{n:e.length+1}),modules:[]})},n=>this._slotPath(e,t,i,o,n.tabs.length-1))}renameTab(e,t,i,o,n,a){this.updateTab(e,t,i,o,n,{label:a})}updateTab(e,t,i,o,n,a){this._tabsEdit([e,t,i,o],e=>{if(!e[n])return!1;if("label"in a&&!a.label?.trim()){const t=e[n].label?.trim()?e[n].label:(0,h.t)(1018,{n:n+1});if(t===e[n].label&&1===Object.keys(a).length)return!1;a={...a,label:t}}e[n]=ie(e[n],a)})}moveTab(e,t,i,o,n,a){const s=n+a;let r={base:!1,rules:!1};this._tabsEdit([e,t,i,o],(e,t)=>{if(!e[n]||s<0||s>=e.length)return!1;const[i]=e.splice(n,1);e.splice(s,0,i);const o=Number(t.active_tab??0);o===n?t.active_tab=s:o===s&&(t.active_tab=n),r=re(t,e=>e===n?s:e===s?n:e)},()=>this._slotPath(e,t,i,o,s),()=>le(r))}deleteTab(e,t,i,o,n){let a={base:!1,rules:!1};this._tabsEdit([e,t,i,o],(e,t)=>{if(!e[n]||e.length<=1)return!1;e.splice(n,1);const i=Number(t.active_tab??0);i>n&&(t.active_tab=i-1),Number(t.active_tab??0)>=e.length&&(e.length>1?t.active_tab=e.length-1:delete t.active_tab),a=re(t,e=>e===n?-1:e>n?e-1:e)},a=>a.tabs.length?this._slotPath(e,t,i,o,Math.min(n,a.tabs.length-1)):{rowIndex:e,columnIndex:t,moduleIndex:i,...o?.length?{childPath:o.map(e=>({...e}))}:{}},()=>le(a))}_rowEdit(e,t,i,o,n=!1){this._editLayout(e,t,e=>"row"===e.type&&(Array.isArray(e.columns)||(e.columns=[]),i(e.columns,e)),o,n)}addNestedColumn(e,t,i,o){this._rowEdit([e,t,i,o],["columns","layout","column_widths"],(e,t)=>{e.push(b()),Array.isArray(t.column_widths)&&t.column_widths.length?t.column_widths=[...(0,f.M0)(t.column_widths,e.length-1),"1fr"]:(delete t.column_widths,t.layout=this._equalLayout(e.length))},n=>this._slotPath(e,t,i,o,n.columns.length-1))}deleteNestedColumn(e,t,i,o,n){this._rowEdit([e,t,i,o],["columns","layout","column_widths"],(e,t)=>{if(e.length<=1||!e[n])return!1;if(e.splice(n,1),t.layout=this._equalLayout(e.length),Array.isArray(t.column_widths)&&t.column_widths.length){const i=(0,f.M0)(t.column_widths,e.length+1);i.splice(n,1),e.length<2?delete t.column_widths:t.column_widths=i}},a=>this._slotPath(e,t,i,o,Math.min(n,a.columns.length-1)))}moveNestedColumn(e,t,i,o,n,a){const s=n+a,r=["columns"];this._rowEdit([e,t,i,o],()=>r,(e,t)=>{if(n<0||n>=e.length||s<0||s>=e.length)return!1;const i=e=>{[e[n],e[s]]=[e[s],e[n]]};if(i(e),Array.isArray(t.column_widths)&&t.column_widths.length){const o=(0,f.M0)(t.column_widths,e.length);i(o),t.column_widths=o,r.push("column_widths")}else if("string"==typeof t.layout){const o=/^\d+(?:-\d+)*$/.test(t.layout),n=o?t.layout.split("-"):t.layout.trim().split(/\s+/);if(n.length===e.length){i(n);const e=n.join(o?"-":" ");e!==t.layout&&(t.layout=e,r.push("layout"))}}},()=>this._slotPath(e,t,i,o,s))}setNestedRowLayout(e,t,i,o,n){const a=["column_widths"];this._rowEdit([e,t,i,o],()=>a,(e,t)=>{const i=e.length,o=t.layout;(0,f.Hi)({...t,columns:e},n,b),t.layout=n,delete t.column_widths,o!==n&&a.push("layout"),e.length!==i&&a.push("columns")})}setNestedColumnWidths(e,t,i,o,n,a,s=!1){const r=!!n?.length||!!a;this._rowEdit([e,t,i,o],r?["column_widths",...a?["layout"]:[]]:[],(e,t)=>{n?.length?t.column_widths=[...n]:delete t.column_widths,a&&(t.layout=a),r||o?.length||!Array.isArray(t.not_synced)||(t.not_synced=t.not_synced.filter(e=>"column_widths"!==e),t.not_synced.length||delete t.not_synced)},void 0,s)}updateNestedColumn(e,t,i,o,n,a){this._rowEdit([e,t,i,o],["columns"],e=>{if(!e[n])return!1;e[n]=ie(e[n],a)})}undo(){const e=this.undoRedo.undo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0,selectedPath:this._clampedPath(e,this.state.selectedPath),selectedFlow:this._liveFlow(e)},this.notify(),this.dispatchConfigChanged(e))}redo(){const e=this.undoRedo.redo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0,selectedPath:this._clampedPath(e,this.state.selectedPath),selectedFlow:this._liveFlow(e)},this.notify(),this.dispatchConfigChanged(e))}canUndo(){return this.undoRedo.canUndo()}canRedo(){return this.undoRedo.canRedo()}flush(){this.dispatchConfigChanged.flush()}destroy(){this.dispatchConfigChanged.cancel(),this.listeners.clear(),this.undoRedo.clear()}}function de(e){if(e&&"object"==typeof e){delete e.not_synced;for(const t of(0,$.yZ)(e)??[])for(const e of t)de(e)}}function he(e){const t=[];e.not_synced?.length&&t.push({location:(0,h.t)(167),paths:[...e.not_synced]});for(let i=0;i<(e.rows||[]).length;i++){const o=e.rows[i];o.not_synced?.length&&t.push({location:(0,h.t)(843,{n:i+1}),paths:[...o.not_synced]});for(let e=0;e<(o.columns||[]).length;e++){const n=o.columns[e];n.not_synced?.length&&t.push({location:(0,h.t)(844,{row:i+1,col:e+1}),paths:[...n.not_synced]});for(let e=0;e<(n.modules||[]).length;e++){const i=n.modules[e];if(i.not_synced?.length){const e=i.label||i.type;t.push({location:`${e}`,paths:[...i.not_synced]})}}}}return t}function ue(e){return he(e).reduce((e,t)=>e+t.paths.length,0)}function pe(e){const t=(0,c.G)(e);delete t.not_synced,delete t.hidden_animations;for(const e of t.rows||[]){delete e.not_synced;for(const t of e.columns||[]){delete t.not_synced;for(const e of t.modules||[])de(e)}}return t}function me(e){const t=pe(e);delete t.template,delete t.entity;for(const e of a.lC)delete t[e];return t}function ge(e,t,i){const o=new Set(e||[]);return i?o.add(t):o.delete(t),Array.from(o)}function fe(e,t){return i=>{const o=new Set(i.not_synced||[]),n=e,a=i,s=new Set(["id","type","not_synced","design","actions","display"]);for(const e of Object.keys(a))s.has(e)||a[e]!==n[e]&&o.add(e);void 0===n.entity||"entity"in a||o.add("entity"),a.not_synced=Array.from(o),t(i)}}const ve=[{label:542,value:"visible"},{label:238,value:"hidden"},{label:410,value:"scroll"},{label:36,value:"auto"}],be=[{label:321,value:"normal"},{label:69,value:"bold"},{label:0,value:"100"},{label:1,value:"200"},{label:2,value:"300"},{label:4,value:"400"},{label:5,value:"500"},{label:6,value:"600"},{label:7,value:"700"},{label:8,value:"800"},{label:9,value:"900"}],ye=[{label:320,value:"none"},{label:534,value:"uppercase"},{label:298,value:"lowercase"},{label:101,value:"capitalize"}],_e=[{label:83,value:"border-box"},{label:347,value:"padding-box"},{label:125,value:"content-box"}],we=[{label:320,value:"none"},{label:438,value:"solid"},{label:131,value:"dashed"},{label:157,value:"dotted"},{label:158,value:"double"},{label:230,value:"groove"},{label:387,value:"ridge"},{label:257,value:"inset"},{label:338,value:"outset"}],$e=we;function ke(e,t,i,o,n){return{key:e,cssProperty:t,label:i,type:o,...n?{options:n}:{}}}function xe(e,t,i,o={}){return{key:e,cssProperty:"",label:t,type:i,virtual:!0,...o}}const Ce=(e,t,i,o={})=>xe(e,t,i,o),Se=(e,t,i,o={})=>Ce(e,t,i,{hover:!0,tabState:!0,...o}),Me=(e,t,i,o={})=>xe(e,t,i,{hover:!0,...o}),Ae={hideForVariant:["icon-only"]},qe=["px","em","rem"],Ee=[...qe,"%"],Te=[{id:"bar",name:53},{id:"text",name:506},{id:"border",name:70},{id:"icon",name:242},{id:"effects",name:177}],Le={border_length_align:"border_length",border_length_sides:"border_length",icon_background_shape:"icon_background"},ze=[{id:"spacing",name:443,icon:"mdi:arrow-expand-all",leading:["padding","margin","width","min_height"],properties:[ke("margin","margin",300,"box"),ke("padding","padding",346,"box"),ke("width","width",551,"unit"),ke("height","height",237,"unit"),ke("min_width","min-width",307,"unit"),ke("min_height","min-height",306,"unit"),ke("max_width","max-width",304,"unit"),ke("max_height","max-height",303,"unit"),ke("box_sizing","box-sizing",90,"select",[{label:125,value:"content-box"},{label:83,value:"border-box"}])]},{id:"borders",name:85,icon:"mdi:border-all",leading:["border_radius","border_width","border_style","border_color","border_length","border_length_align","border_length_sides","box_shadow"],properties:[ke("border","border",70,"text"),ke("border_top","border-top",81,"text"),ke("border_right","border-right",77,"text"),ke("border_bottom","border-bottom",71,"text"),ke("border_left","border-left",74,"text"),{...ke("border_width","border-width",82,"sides"),sides:{cell:"length"},units:["px","em","rem"]},{...ke("border_style","border-style",80,"sides",we),sides:{cell:"style"}},{...ke("border_color","border-color",73,"sides"),sides:{cell:"color"}},xe("border_length",75,"unit",{units:["%","px"],help:423}),xe("border_length_align",17,"segmented",{defaultValue:"center",options:[{label:455,value:"start"},{label:103,value:"center"},{label:180,value:"end"}]}),xe("border_length_sides",424,"select",{emptyLabel:18,options:[{label:516,value:"top"},{label:388,value:"right"},{label:87,value:"bottom"},{label:276,value:"left"}]}),ke("border_radius","border-radius",76,"box"),ke("outline","outline",333,"text"),ke("outline_width","outline-width",337,"unit"),ke("outline_style","outline-style",336,"select",$e),ke("outline_color","outline-color",334,"color"),ke("outline_offset","outline-offset",335,"unit"),ke("box_shadow","box-shadow",89,"text")]},{id:"shape",name:420,icon:"mdi:hexagon-outline",properties:[xe("shape",420,"shape")]},{id:"value-background",name:536,icon:"mdi:chart-areaspline-variant",properties:[xe("value_background",536,"value_bg")]},{id:"positioning",name:362,icon:"mdi:page-layout-body",properties:[ke("position","position",361,"select",[{label:459,value:"static"},{label:379,value:"relative"},{label:12,value:"absolute"},{label:193,value:"fixed"},{label:461,value:"sticky"}]),ke("top","top",516,"unit"),ke("right","right",388,"unit"),ke("bottom","bottom",87,"unit"),ke("left","left",276,"unit"),ke("inset","inset",257,"unit"),ke("display","display",143,"select",[{label:67,value:"block"},{label:253,value:"inline"},{label:254,value:"inline-block"},{label:196,value:"flex"},{label:255,value:"inline-flex"},{label:228,value:"grid"},{label:256,value:"inline-grid"},{label:320,value:"none"},{label:126,value:"contents"}]),ke("visibility","visibility",541,"select",[{label:542,value:"visible"},{label:238,value:"hidden"},{label:114,value:"collapse"}]),ke("opacity","opacity",329,"text"),ke("z_index","z-index",561,"number"),ke("overflow","overflow",340,"select",ve),ke("overflow_x","overflow-x",341,"select",ve),ke("overflow_y","overflow-y",342,"select",ve),ke("float","float",206,"select",[{label:320,value:"none"},{label:276,value:"left"},{label:388,value:"right"}]),ke("clear","clear",107,"select",[{label:320,value:"none"},{label:276,value:"left"},{label:388,value:"right"},{label:86,value:"both"}]),ke("cursor","cursor",129,"select",[{label:36,value:"auto"},{label:134,value:"default"},{label:357,value:"pointer"},{label:309,value:"move"},{label:506,value:"text"},{label:544,value:"wait"},{label:128,value:"crosshair"},{label:322,value:"not-allowed"},{label:225,value:"grab"},{label:320,value:"none"}]),ke("pointer_events","pointer-events",358,"select",[{label:36,value:"auto"},{label:320,value:"none"}])]},{id:"typography",name:530,icon:"mdi:format-font",leading:["color","font_family","font_weight","font_size","text_transform"],properties:[ke("font_family","font-family",209,"font"),ke("font_size","font-size",210,"unit"),ke("font_weight","font-weight",213,"select",be),ke("font_style","font-style",211,"select",[{label:321,value:"normal"},{label:262,value:"italic"},{label:325,value:"oblique"}]),ke("font_variant","font-variant",212,"text"),ke("color","color",115,"color"),ke("text_align","text-align",507,"select",[{label:276,value:"left"},{label:103,value:"center"},{label:388,value:"right"},{label:265,value:"justify"}]),ke("text_decoration","text-decoration",508,"select",[{label:320,value:"none"},{label:531,value:"underline"},{label:344,value:"overline"},{label:286,value:"line-through"}]),ke("text_transform","text-transform",512,"select",ye),ke("text_indent","text-indent",509,"unit"),ke("text_overflow","text-overflow",510,"select",[{label:108,value:"clip"},{label:178,value:"ellipsis"}]),ke("text_shadow","text-shadow",511,"text"),ke("line_height","line-height",285,"text"),ke("letter_spacing","letter-spacing",278,"unit"),ke("word_spacing","word-spacing",558,"unit"),ke("white_space","white-space",550,"select",[{label:321,value:"normal"},{label:323,value:"nowrap"},{label:364,value:"pre"},{label:366,value:"pre-wrap"},{label:365,value:"pre-line"},{label:92,value:"break-spaces"}]),ke("word_break","word-break",557,"select",[{label:321,value:"normal"},{label:91,value:"break-all"},{label:267,value:"keep-all"},{label:93,value:"break-word"}]),ke("overflow_wrap","overflow-wrap",343,"select",[{label:321,value:"normal"},{label:93,value:"break-word"},{label:28,value:"anywhere"}])]},{id:"backgrounds",name:51,icon:"mdi:image-area",properties:[ke("background","background",42,"text"),ke("background_color","background-color",45,"color"),ke("background_image","background-image",46,"image"),ke("background_position","background-position",48,"text"),ke("background_size","background-size",50,"select",[{label:36,value:"auto"},{label:127,value:"cover"},{label:123,value:"contain"}]),ke("background_repeat","background-repeat",49,"select",[{label:381,value:"repeat"},{label:319,value:"no-repeat"},{label:382,value:"repeat-x"},{label:383,value:"repeat-y"},{label:439,value:"space"},{label:398,value:"round"}]),ke("background_attachment","background-attachment",43,"select",[{label:410,value:"scroll"},{label:193,value:"fixed"},{label:295,value:"local"}]),ke("background_clip","background-clip",44,"select",_e),ke("background_origin","background-origin",47,"select",_e),ke("backdrop_filter","backdrop-filter",41,"text")]},{id:"flexbox",name:202,icon:"mdi:view-column",properties:[ke("flex_direction","flex-direction",140,"select",[{label:400,value:"row"},{label:403,value:"row-reverse"},{label:117,value:"column"},{label:120,value:"column-reverse"}]),ke("flex_wrap","flex-wrap",559,"select",[{label:323,value:"nowrap"},{label:559,value:"wrap"},{label:560,value:"wrap-reverse"}]),ke("justify_content","justify-content",266,"select",[{label:201,value:"flex-start"},{label:200,value:"flex-end"},{label:103,value:"center"},{label:441,value:"space-between"},{label:440,value:"space-around"},{label:442,value:"space-evenly"}]),ke("align_items","align-items",15,"select",[{label:465,value:"stretch"},{label:201,value:"flex-start"},{label:200,value:"flex-end"},{label:103,value:"center"},{label:61,value:"baseline"}]),ke("align_content","align-content",14,"select",[{label:465,value:"stretch"},{label:201,value:"flex-start"},{label:200,value:"flex-end"},{label:103,value:"center"},{label:441,value:"space-between"},{label:440,value:"space-around"}]),ke("gap","gap",216,"unit"),ke("row_gap","row-gap",402,"unit"),ke("column_gap","column-gap",119,"unit"),ke("flex","flex",196,"text"),ke("flex_grow","flex-grow",198,"number"),ke("flex_shrink","flex-shrink",199,"number"),ke("flex_basis","flex-basis",197,"unit"),ke("align_self","align-self",16,"select",[{label:36,value:"auto"},{label:465,value:"stretch"},{label:201,value:"flex-start"},{label:200,value:"flex-end"},{label:103,value:"center"},{label:61,value:"baseline"}]),ke("order","order",332,"number")]},{id:"grid",name:99,icon:"mdi:grid",properties:[ke("grid_template_columns","grid-template-columns",504,"text"),ke("grid_template_rows","grid-template-rows",505,"text"),ke("grid_template_areas","grid-template-areas",503,"text"),ke("grid_auto_columns","grid-auto-columns",37,"text"),ke("grid_auto_rows","grid-auto-rows",39,"text"),ke("grid_auto_flow","grid-auto-flow",38,"select",[{label:400,value:"row"},{label:117,value:"column"},{label:136,value:"dense"},{label:401,value:"row dense"},{label:118,value:"column dense"}]),ke("grid_column","grid-column",117,"text"),ke("grid_row","grid-row",400,"text"),ke("grid_area","grid-area",30,"text")]},{id:"transitions",name:524,icon:"mdi:animation",leading:["animations"],properties:[xe("animations",27,"animations"),ke("transition","transition",519,"text"),ke("transition_property","transition-property",522,"text"),{...ke("transition_duration","transition-duration",521,"unit"),units:["s","ms"]},ke("transition_timing_function","transition-timing-function",523,"text"),{...ke("transition_delay","transition-delay",520,"unit"),units:["s","ms"]},ke("transform","transform",517,"text"),ke("transform_origin","transform-origin",518,"text"),ke("animation_name","animation-name",25,"text"),{...ke("animation_duration","animation-duration",24,"unit"),units:["s","ms"]},ke("animation_timing_function","animation-timing-function",26,"text"),{...ke("animation_delay","animation-delay",22,"unit"),units:["s","ms"]},ke("animation_iteration_count","animation-iteration-count",263,"text"),ke("animation_direction","animation-direction",23,"select",[{label:321,value:"normal"},{label:386,value:"reverse"},{label:19,value:"alternate"},{label:20,value:"alternate-reverse"}]),ke("animation_fill_mode","animation-fill-mode",189,"select",[{label:320,value:"none"},{label:215,value:"forwards"},{label:52,value:"backwards"},{label:86,value:"both"}]),ke("animation_play_state","animation-play-state",354,"select",[{label:406,value:"running"},{label:350,value:"paused"}]),ke("filter","filter",190,"text")]},{id:"ring",name:389,icon:"mdi:circle-double",properties:[xe("ring",389,"ring")]},{id:"lists-tables",name:293,icon:"mdi:format-list-bulleted",properties:[ke("list_style","list-style",289,"text"),ke("list_style_type","list-style-type",292,"select",[{label:320,value:"none"},{label:142,value:"disc"},{label:106,value:"circle"},{label:450,value:"square"},{label:133,value:"decimal"},{label:296,value:"lower-alpha"},{label:532,value:"upper-alpha"},{label:297,value:"lower-roman"},{label:533,value:"upper-roman"}]),ke("list_style_position","list-style-position",291,"select",[{label:339,value:"outside"},{label:258,value:"inside"}]),ke("list_style_image","list-style-image",290,"text"),ke("border_collapse","border-collapse",72,"select",[{label:413,value:"separate"},{label:114,value:"collapse"}]),ke("border_spacing","border-spacing",79,"unit"),ke("table_layout","table-layout",499,"select",[{label:36,value:"auto"},{label:193,value:"fixed"}]),ke("caption_side","caption-side",102,"select",[{label:516,value:"top"},{label:87,value:"bottom"}])]},{id:"tabs-bar",name:479,icon:"mdi:tab",modules:["tabs"],properties:[Ce("tab_disabled_tabs",141,"tab_list",{help:514,subgroup:"bar"}),Ce("tab_bar_position",59,"segmented",{options:[{label:516,value:"top"},{label:87,value:"bottom"}],defaultValue:"top",subgroup:"bar"}),Ce("tab_align",476,"segmented",{options:[{label:455,value:"start"},{label:103,value:"center"},{label:180,value:"end"},{label:465,value:"stretch"}],defaultValue:"start",subgroup:"bar"}),Ce("tab_bar_background",54,"color",{subgroup:"bar"}),Ce("tab_bar_border_color",55,"sides",{sides:{cell:"color"},subgroup:"bar"}),Ce("tab_bar_border_width",57,"sides",{sides:{cell:"length"},units:["px","em","rem"],subgroup:"bar"}),Ce("tab_bar_border_style",56,"sides",{sides:{cell:"style"},options:[...we,{label:238,value:"hidden"}],subgroup:"bar"}),Ce("tab_bar_padding",58,"text",{help:328,subgroup:"bar"}),Ce("tab_gap",217,"unit",{units:Ee,subgroup:"bar"}),Ce("tab_animation",495,"segmented",{options:[{label:320,value:"none"},{label:183,value:"fade"},{label:425,value:"slide"}],defaultValue:"none",help:250,subgroup:"bar"}),Se("tab_color",496,"color",{subgroup:"text"}),Se("tab_font_family",484,"font",{subgroup:"text"}),Se("tab_font_size",485,"unit",{units:Ee,subgroup:"text"}),Se("tab_font_weight",486,"select",{options:be.filter(e=>/^(?:normal|bold|[1-9]00)$/.test(e.value)),subgroup:"text"}),Se("tab_text_transform",497,"select",{options:ye,subgroup:"text"}),Se("tab_letter_spacing",491,"text",{help:565,subgroup:"text"}),Se("tab_border_color",480,"sides",{sides:{cell:"color"},subgroup:"border"}),Se("tab_border_width",482,"sides",{sides:{cell:"length"},units:["px","em","rem"],subgroup:"border"}),Se("tab_border_style",481,"sides",{sides:{cell:"style"},options:[...we,{label:238,value:"hidden"}],subgroup:"border"}),Se("tab_radius",483,"sides",{sides:{cell:"length",corners:!0},units:Ee,subgroup:"border"}),Se("tab_padding",493,"text",{help:328,subgroup:"border"}),Se("tab_icon_color",488,"color",{subgroup:"icon"}),Se("tab_icon_size",490,"unit",{units:["px"],subgroup:"icon"}),Ce("tab_icon_position",489,"segmented",{options:[{label:276,value:"left"},{label:388,value:"right"},{label:11,value:"above"},{label:63,value:"below"}],defaultValue:"left",help:277,subgroup:"icon"}),Se("tab_icon_fx",487,"icon_anim",{help:250,subgroup:"icon"}),Se("tab_background",478,"color",{subgroup:"effects"}),Se("tab_opacity",492,"number",{range:[0,1,.1],subgroup:"effects"}),Se("tab_shadow",494,"text",{help:564,subgroup:"effects"}),Se("tab_animations",477,"tab_animations",{help:356,subgroup:"effects"})]},{id:"button-content",name:243,icon:"mdi:format-align-center",modules:["button"],properties:[Me("icon_position",248,"segmented",{options:[{label:276,value:"left"},{label:388,value:"right"},{label:11,value:"above"},{label:63,value:"below"}],defaultValue:"left",help:277}),Me("content_align",124,"segmented",{options:[{label:455,value:"start"},{label:103,value:"center"},{label:180,value:"end"}],defaultValue:"center"}),Me("content_vertical_align",538,"segmented",{options:[{label:516,value:"start"},{label:103,value:"center"},{label:87,value:"end"}],defaultValue:"center"}),Me("icon_size",249,"unit",{units:qe}),Me("icon_gap",247,"unit",{units:qe}),Me("icon_color",246,"color"),Me("icon_background",244,"color"),Me("icon_background_shape",245,"segmented",{options:[{label:106,value:"circle"},{label:399,value:"rounded"}],defaultValue:"circle"}),Me("label_overflow",272,"segmented",{options:[{label:559,value:"wrap"},{label:525,value:"truncate"}],defaultValue:"wrap",help:10,...Ae}),Me("label_color",268,"color",Ae),Me("label_font_family",269,"font",Ae),Me("label_font_size",270,"unit",{...Ae,units:Ee}),Me("label_font_weight",271,"select",{...Ae,options:be}),Me("label_text_transform",273,"select",{...Ae,options:ye}),Me("state_position",458,"segmented",{options:[{label:64,value:"beside"},{label:63,value:"below"}],defaultValue:"beside"}),Me("state_color",456,"color"),Me("state_font_size",457,"unit",{units:Ee})]}],je="custom-css",Re=[{id:"layout",name:275,entries:["spacing","positioning","flexbox","grid"],defaultOpen:!0},{id:"style",name:467,entries:["backgrounds","borders","typography","button-content","tabs-bar","shape","value-background"],defaultOpen:!0},{id:"effects",name:177,entries:["ring","transitions"],defaultOpen:!1},{id:"advanced",name:13,entries:["lists-tables",je],defaultOpen:!1}];var Oe=i(6200);const Pe=["vertical","horizontal","row","tabs","slider-layout"],He=["id","type","entity","attribute","display","design","actions","hidden","editor_name","not_synced","placement","layer"],De=["icon_fx","icon_on","icon_off","svg"],Ie={text:["text","use_template","use_entity","entity_display"],icon:["icon","size","icon_color","use_entity_icon","use_entity_color",...De],info:["prefix","suffix","show_name","show_state","show_unit","secondary_info","show_icon","icon",...De],image:["image","entity_picture","aspect_ratio","fit"],markdown:["content"],bar:["min","max","severity","decimals","bar_height","bar_color","bar_background","show_value","direction"],graphs:["hours_to_show","points_per_hour","line_color","line_width","fill","fill_color","show_points","show_labels","height"],camera:["aspect_ratio","camera_view","refresh_interval","show_controls"],button:["label","icon","show_state","use_entity_icon","use_entity_color","button_style",...De],slider:["show_value","min","max","step","slider_color","track_color","direction",...Oe.h],spinbox:["min","max","step"],dropdown:["options"],light:["icon","show_brightness","show_color_temp","show_color","show_effect","compact",...De],gauge:["min","max","severity","needle","show_name","show_unit","decimals","gauge_style"],horizontal:["modules","gap","align","justify","share_entity"],vertical:["modules","gap","align","justify","share_entity"],row:["columns","layout","column_widths","gap","padding","share_entity"],tabs:["tabs","active_tab","tab_style","share_entity",...De],separator:["separator_style","separator_color","separator_width","direction"],"slider-layout":["modules","pagination","navigation","slides_per_view","space_between","loop","autoplay","autoplay_delay","share_entity"],clock:["format_12h","show_seconds","show_date","date_format"],weather:["animated_icons","show_temperature","show_condition","show_forecast","forecast_days",...De],forecast:["animated_icons","forecast_type","num_forecasts","show_temperature","show_precipitation","show_wind",...De],"video-bg":["url","poster","autoplay","loop","muted","fit"],"custom-card":["name","card_type","card_config","card_config_yaml"]},Fe=["modules","columns","tabs"],Ve=e=>Pe.includes(e);function Ne(e){return(Ve(e.type)?Pe:_.s.types.filter(e=>!Ve(e))).filter(t=>t!==e.type&&_.s.has(t))}const Ze=["__proto__","constructor","prototype"];function Be(e,t,i){if(!e||"object"!=typeof e||Array.isArray(e))return e;const o={};for(const[n,a]of Object.entries(e))t.has(n)||Ze.includes(n)?i.n++:"hover"===n?o[n]=Be(a,t,i):"conditional"===n&&Array.isArray(a)?o[n]=a.map(e=>{if(!e||"object"!=typeof e||Array.isArray(e))return e;const o={};for(const[n,a]of Object.entries(e))Ze.includes(n)?i.n++:o[n]="design"===n?Be(a,t,i):a;return o}):o[n]=a;return o}function We(e,t){const i=e.rows?.[t.row]?.columns?.[t.col]?.modules;if(!Array.isArray(i))return;if(!t.child?.length)return i[t.module]?{list:i,index:t.module}:void 0;const o=t.child,n=(0,$.Rv)(i[t.module],o.slice(0,-1)),a=o[o.length-1],s=(0,$.yZ)(n)?.[a.slot];return s?.[a.index]?{list:s,index:a.index}:void 0}function Ke(e,t,i){const o=We(e,t),n=o?.list[o.index];if(!n||!Ne(n).includes(i))return;const a=(0,c.G)(e),s=We(a,t),r=_.s.createDefault(i);if(!s||!r)return;const l=s.list[s.index],d=p(r),h={n:0},u=Ie[i],m=function(e,t){const i=e;if(!(0,$.QN)(i))return[];const o=(0,$.yZ)(i)??[];if(!(0,$.WA)(i))return o.flat();const n=e["row"===i.type?"columns":"tabs"]??[];return o.flatMap((e,i)=>{const o=n[i],a=o&&"object"==typeof o?o:{};for(const e of Object.keys(a))"modules"!==e&&t.n++;return!0===a.hidden?e.map(e=>e&&"object"==typeof e?{...e,hidden:!0}:e):e})}(l,h);for(const[e,t]of Object.entries(l))"type"===e||Fe.includes(e)||(He.includes(e)||u.includes(e)?d[e]=t:h.n++);if(Ve(i)&&Ve(String(l.type))&&!("share_entity"in l)&&delete d.share_entity,Ve(i))if("row"===i){const e=d.columns[0];e.modules=m,d.columns=[e],d.layout="1",delete d.column_widths}else if("tabs"===i){const e=d.tabs[0];e.modules=m,d.tabs=[e],d.active_tab=0}else d.modules=m;const g=function(e){const t=new Set;for(const i of ze)if(i.modules&&!i.modules.includes(e))for(const e of i.properties)t.add(e.key);if("tabs"!==e)for(const e of["tab_active","tab_disabled","tab_disabled_tabs","tab_active_color","tab_active_background","tab_indicator_color"])t.add(e);return t}(i);if(d.design&&(d.design=Be(d.design,g,h)),Array.isArray(d.not_synced)){const e=d.not_synced.filter(e=>Object.prototype.hasOwnProperty.call(d,String(e).split(".")[0]));e.length?d.not_synced=e:delete d.not_synced}s.list[s.index]=d,t.child?.length?ee(a,t.row,t.col,t.module):te(a,t.row,t.col);const f=(0,w.bm)(t);return f?{config:a,path:f,dropped:h.n}:void 0}var Ue=i(9788);function Ge(){return"undefined"!=typeof HTMLElement&&"function"==typeof HTMLElement.prototype.showPopover}const Ye='[role="menuitem"]:not([disabled])';class Qe{constructor(e,t){this.host=e,this.opts=t,this.trigger=null,this._at={},this._shown=null,this._scrollRoots=[],this._raf=0,this.onKeydown=e=>{if("Escape"===e.key)return e.preventDefault(),e.stopPropagation(),void this.close(!0);if("Tab"===e.key)return e.preventDefault(),void this.close(!0);const t=Array.from(this.opts.menu()?.querySelectorAll(Ye)||[]),i=this.host.shadowRoot?.activeElement??document.activeElement,o=i?t.indexOf(i):-1;if(1===e.key.length&&/\S/.test(e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){const i=e.key.toLowerCase(),n=t.length,a=Array.from({length:n},(e,i)=>t[(o+1+i)%n]).find(e=>e.textContent?.trim().toLowerCase().startsWith(i));return void(a&&(e.preventDefault(),e.stopPropagation(),a.focus()))}if(!["ArrowDown","ArrowUp","Home","End"].includes(e.key))return;if(e.preventDefault(),e.stopPropagation(),!t.length)return;let n=0;"ArrowDown"===e.key?n=o<0?0:(o+1)%t.length:"ArrowUp"===e.key?n=o<0?t.length-1:(o-1+t.length)%t.length:"End"===e.key&&(n=t.length-1),t[n].focus()},this._onOutside=e=>{this._inMenu(e)||!this._at.point&&this.trigger&&e.composedPath().includes(this.trigger)||this.close(!1)},this._onResize=()=>this.close(!1),this._onScroll=e=>{this._inMenu(e)||(cancelAnimationFrame(this._raf),this._raf=requestAnimationFrame(()=>{const e=this.trigger;if(!e)return;if(this._at.point)return this.close(!1);const t=e.getBoundingClientRect(),i=window.innerHeight||0;!e.isConnected||i&&(t.bottom<0||t.top>i)?this.close(!1):this.position()}))},e.addController(this)}get isOpen(){return!!this.trigger}hostUpdated(){if(!this.trigger)return;const e=this.opts.menu();e&&e!==this._shown&&this._show(e)}hostDisconnected(){this.close(!1)}open(e){this.trigger!==e?this.openAt(e):this.close(!0)}openAt(e,t={}){this.trigger&&this.close(!1),this.trigger=e,this._at=t,document.addEventListener("pointerdown",this._onOutside,!0),window.addEventListener("resize",this._onResize),this._scrollRoots=function(e){const t=[];let i=e;for(;i;)i instanceof ShadowRoot?(t.includes(i)||t.push(i),i=i.host):i=(i instanceof Element||i instanceof Text?i.assignedSlot:null)||i.parentNode;return t.push(window),t}(e);for(const e of this._scrollRoots)e.addEventListener("scroll",this._onScroll,!0);this.host.requestUpdate()}close(e){const t=this.trigger;if(!t)return;const i=this._at.returnFocus??t;this.trigger=null,this._at={},document.removeEventListener("pointerdown",this._onOutside,!0),window.removeEventListener("resize",this._onResize);for(const e of this._scrollRoots)e.removeEventListener("scroll",this._onScroll,!0);this._scrollRoots=[],cancelAnimationFrame(this._raf);const o=this._shown;if(this._shown=null,o&&Ge()&&o.hasAttribute("popover"))try{o.hidePopover()}catch{}this.opts.onClose?.(),this.host.requestUpdate(),e&&i.isConnected&&i.focus({preventScroll:!0})}position(){const e=this._shown,t=this.trigger;if(!e||!t)return;if(!Ge()&&!this.opts.fixedFallback)return;const i=this._at.point,o=i?{left:i.x,right:i.x,top:i.y,bottom:i.y}:t.getBoundingClientRect(),n=window.innerWidth||document.documentElement.clientWidth||0,a=window.innerHeight||document.documentElement.clientHeight||0;e.style.maxHeight="";const s=e.offsetWidth,r=e.offsetHeight,l=a-o.bottom-4-8,c=o.top-4-8,d=a>0&&r>l&&c>l,h=d?c:l;a>0&&r>h&&(e.style.maxHeight=`${Math.max(120,h)}px`);const u=Math.min(r,a>0?Math.max(120,h):r),p=d?Math.max(8,o.top-4-u):o.bottom+4;let m="end"!==this.opts.align||i?o.left:o.right-s;n>0&&(m=Math.min(m,n-s-8)),m=Math.max(8,m),Object.assign(e.style,{top:`${Math.round(p)}px`,left:`${Math.round(m)}px`,right:"auto",bottom:"auto"}),e.dataset.placement=d?"top":"bottom"}_show(e){if(this._shown=e,Ge()){e.setAttribute("popover","manual");try{e.showPopover()}catch{}}this.position(),e.querySelector(Ye)?.focus({preventScroll:!0})}_inMenu(e){const t=this._shown;return!!t&&e.composedPath().includes(t)}}var Je=i(8006),Xe=i(105),et=i(21),tt=i(802),it=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};function ot(e){if(!e)return{};const{type:t,name:i,template:o,...n}=e;return{type:t,name:i,template:o,...n}}let nt=class extends o.WF{constructor(){super(...arguments),this._embed=!0,this._status="",this._libVersion=0,this._suppressUpdate=!1}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e})),this._unsubLibrary??=(0,R.T_)().subscribe(()=>{this._libVersion=(0,R.T_)().version})}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubLibrary?.(),this._unsubLibrary=void 0}willUpdate(e){(e.has("hass")||e.has("_editorState"))&&this._customIds().length&&(0,R.T_)().ensure(this.hass)}_customIds(){return(0,s.Gd)(this._editorState?.config)}async _copy(){const e=this._editorState?.config;if(!e)return;const{yaml:t,missing:i}=function(e,t,i){let o=ot(e),n=[];if(t){const t=(0,R.T_)().inlineDocs((0,a.wL)(e,i)),r=(0,s.ux)(o,e=>(0,R.T_)().get(e)??t?.get(e));o=r.config,n=r.missing}return{yaml:(0,k.fE)(JSON.parse(JSON.stringify(o))),missing:n}}(e,this._embed,this._editorState?.templateAnimations);try{await navigator.clipboard.writeText(t),this._status=i.length?(0,h.t)(1191,{ids:i.join(", ")}):this._embed?(0,h.t)(1189):(0,h.t)(1190)}catch{this._status=(0,h.t)(242)}}_renderExport(){const e=this._customIds();if(!e.length)return o.s6;this._libVersion;const t=e.length;return o.qy`
      <div class="export">
        <span class="txt"><strong>${(0,h.t)(1147,{n:t})}</strong> ${(0,h.t)(1264,{n:t})}</span>
        <label class="opt">
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${this._embed?"true":"false"}
            aria-label=${(0,h.t)(345)}
            @click=${()=>{this._embed=!this._embed,this._status=""}}
          ></button>
          ${(0,h.t)(345)}
        </label>
        <button type="button" class="btn btn-secondary btn-sm copy-yaml" @click=${()=>this._copy()}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${(0,h.t)(233)}
        </button>
        <p class="status" role="status" aria-live="polite">${this._status}</p>
      </div>
    `}render(){return o.qy`
      <div class="mc-yaml-container">
        ${this._renderExport()}
        <div class="mc-yaml-editor-wrapper">
          <ha-yaml-editor
            .hass=${this.hass}
            .defaultValue=${ot(this._editorState?.config)}
            @value-changed=${this._onYamlChanged}
          ></ha-yaml-editor>
        </div>
      </div>
    `}_onYamlChanged(e){const t=e.detail.value;if(this._editorState){this._suppressUpdate=!0;try{if(t&&"object"==typeof t){const e={...t,type:this._editorState.config.type};this.stateManager.updateConfig(e)}}catch{}finally{this._suppressUpdate=!1}}}};nt.styles=[Xe.yj,Xe.rF,et.e,tt.a,o.AH`
      .export {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        padding: 10px 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface);
      }
      .export .txt {
        flex: 1 1 220px;
        min-width: 0;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
      }
      .export .txt strong {
        color: var(--mc-text);
        font-weight: 500;
      }
      .export .opt {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8125rem;
        cursor: pointer;
      }
      .export .status {
        flex-basis: 100%;
        margin: 0;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .export .status:empty {
        display: none;
      }
    `],it([(0,n.MZ)({attribute:!1})],nt.prototype,"stateManager",void 0),it([(0,n.MZ)({attribute:!1})],nt.prototype,"hass",void 0),it([(0,n.wk)()],nt.prototype,"_editorState",void 0),it([(0,n.wk)()],nt.prototype,"_embed",void 0),it([(0,n.wk)()],nt.prototype,"_status",void 0),it([(0,n.wk)()],nt.prototype,"_libVersion",void 0),nt=it([(0,n.EM)("mc-yaml-editor")],nt);var at=i(4700);function st(e,t,i){const o=e.getConfig(),n=(0,at.t8)(o,t),a=n?.list[n.index];return!!a&&(function(e,t,i){const o=e.getConfig(),n=(0,at.t8)(o,t)?.list[t.child?.length?t.child[t.child.length-1].index:t.module],a=i=>e.replaceModule(t.row,t.col,t.module,i,t.child);o.template&&!t.child?.length&&n?fe(n,a)(i):a(i)}(e,t,(0,at.Ao)(a,i)),!0)}function rt(e,t){if(void 0===t.module)return!1;if(t.row!==e.row||t.col!==e.col||t.module!==e.module)return!1;const i=e.child??[],o=t.child??[];return o.length>=i.length&&(n=o,i.every((e,t)=>n[t]&&n[t].slot===e.slot&&n[t].index===e.index));var n}function lt(e,t,i){if(rt(t,i))return;const o=(0,c.G)(e),n=(e,t,i)=>o.rows[e]?.columns[t]?.modules?.[i],a=n(t.row,t.col,t.module),s=t.child??[];let r,l;if(s.length){const e=(0,$.Rv)(a,s.slice(0,-1)),t=s[s.length-1];r=e&&(0,$.rX)(e,t.slot),l=t.index}else r=o.rows[t.row]?.columns[t.col]?.modules,l=t.module;const d=r?.[l];if(!r||!d)return;const h=void 0===i.module?void 0:n(i.row,i.col,i.module);let u;if(void 0===i.module)u=o.rows[i.row]?.columns[i.col]?.modules;else{const e=(0,$.Rv)(h,i.child??[]);u=e&&(0,$.rX)(e,i.slot??0)}if(!u)return;let p=Math.max(0,Math.min(i.index,u.length));if(u===r&&(l<p&&(p-=1),p===l))return;if(r.splice(l,1),u.splice(p,0,d),o.template){const e=s.length>0,n=void 0!==i.module,r=(e,t,i)=>o.rows[t].columns[i].modules.indexOf(e);e&&ee(o,t.row,t.col,r(a,t.row,t.col)),n&&ee(o,i.row,i.col,r(h,i.row,i.col)),!e&&n&&te(o,t.row,t.col),e&&!n&&te(o,i.row,i.col)}const m=function(e,t){const i=(e,o)=>{for(let n=0;n<e.length;n++){if(e[n]===t)return[...o,{slot:-1,index:n}];const a=(0,$.yZ)(e[n]);for(let e=0;a&&e<a.length;e++){const t=i(a[e],[...o,{slot:e,index:n}]);if(t)return t}}};for(let t=0;t<e.rows.length;t++)for(let o=0;o<e.rows[t].columns.length;o++){const n=i(e.rows[t].columns[o].modules??[],[]);if(!n)continue;const[a,...s]=n,r={rowIndex:t,columnIndex:o,moduleIndex:a.index};if(s.length){const e=[];let t=a.slot;for(const i of s)e.push({slot:t,index:i.index}),t=i.slot;r.childPath=e}return r}}(o,d);return m?{config:o,path:m}:void 0}function ct(e,t,i){if("column"===t.kind)return"inside"===i?{row:t.row,col:t.col,index:0}:void 0;if("slot"===t.kind){if("inside"!==i)return;const o=(0,w.cv)(e,{kind:"module",row:t.row,col:t.col,module:t.module,child:t.child}),n=(0,$.yZ)(o)?.[t.slot]?.length??0;return{row:t.row,col:t.col,module:t.module,...dt(t.child),slot:t.slot,index:n}}if("module"!==t.kind)return;if("inside"===i){const i=(0,w.cv)(e,t);if(!(0,$.QN)(i)||(0,$.WA)(i))return;const o=(0,$.yZ)(i)?.[0]?.length??0;return{row:t.row,col:t.col,module:t.module,...dt(t.child),slot:0,index:o}}const o="after"===i?1:0,n=t.child??[];if(!n.length)return{row:t.row,col:t.col,index:t.module+o};const a=n[n.length-1];return{row:t.row,col:t.col,module:t.module,...dt(n.slice(0,-1)),slot:a.slot,index:a.index+o}}const dt=e=>e?.length?{child:e.map(e=>({...e}))}:{},ht=["vertical","horizontal","row","tabs","slider-layout"],ut=(e,t)=>`${(0,h.t)(843,{n:e+1})} · ${(0,h.t)(218,{n:t+1})}`,pt={rename:["F2","F2"],dup:["Ctrl+D","Control+D"],up:["Alt+↑","Alt+ArrowUp"],down:["Alt+↓","Alt+ArrowDown"],del:["Del","Delete"]};function mt(e){const t="string"==typeof e.editor_name&&e.editor_name.trim();if(t)return t;const i=(0,w.$N)(e),o=(0,w.Iu)(e);return i?`${o} · ${i}`:o}class gt{constructor(e,t){this.host=e,this.opts=t,this.sel=null,this.view="main",this._focusFirst=!1,this._trail=[],this._focusLabel=null,this._copy=null,this._origin=null,this._onKey=e=>{const t=this._trail.length>0,i="rtl"===getComputedStyle(this.host).direction,o=i?"ArrowLeft":"ArrowRight",n=i?"ArrowRight":"ArrowLeft";if(t&&("Escape"===e.key||e.key===n||"Backspace"===e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey)return e.preventDefault(),e.stopPropagation(),void this.back();if(e.key===o){const t=this.host.shadowRoot?.activeElement??null;if("menu"===t?.getAttribute("aria-haspopup")&&!t.hasAttribute("disabled"))return e.preventDefault(),e.stopPropagation(),void t.click()}"Backspace"!==e.key?this._pop.onKeydown(e):e.stopPropagation()},this._closeCopy=()=>{this._copy=null,this.host.requestUpdate(),this._origin?.isConnected&&this._origin.focus({preventScroll:!0})},this._pop=new Qe(e,{menu:()=>e.shadowRoot?.querySelector(".item-menu"),onClose:()=>{this.sel=null,this.view="main",this._trail=[]},align:"tree"===t.surface?"end":"start",fixedFallback:!0}),e.addController(this)}get isOpen(){return this._pop.isOpen&&!!this.sel}get openKey(){return this.isOpen&&this.sel?(0,w.iA)(this.sel):null}get trigger(){return this._pop.trigger}open(e,t,i={},o="main"){i.point||this._pop.trigger!==t||!this.isOpen?(this._pop.close(!1),this.sel=e,this.view=o,this._trail=[],this._origin=i.returnFocus??t,this._pop.openAt(t,i)):this.close(!0)}close(e){this._pop.isOpen?this._pop.close(e):(this.sel=null,this.view="main",this._trail=[])}setView(e,t=""){this._trail.push({view:this.view,opener:t}),this.view=e,this._focusFirst=!0,this._focusLabel=null,this.host.requestUpdate()}back(){const e=this._trail.pop();return e?(this.view=e.view,this._focusFirst=!0,this._focusLabel=e.opener||null,this.host.requestUpdate(),!0):"main"!==this.view&&(this.view="main",this._focusFirst=!0,this.host.requestUpdate(),!0)}hostUpdated(){if(this._focusFirst){this._focusFirst=!1,this._pop.position();const e=Array.from(this.host.shadowRoot?.querySelectorAll('.item-menu [role="menuitem"]:not([disabled])')??[]),t=this._focusLabel;this._focusLabel=null;const i=t?e.find(e=>e.textContent?.trim()===t):void 0,o=e[0]?.hasAttribute("data-back")?e[1]??e[0]:e[0];(i??o)?.focus({preventScroll:!0})}const e=this.host.shadowRoot?.querySelector("dialog.copy-dlg");if(e&&this._copy&&!e.open){try{e.showModal()}catch{e.setAttribute("open","")}e.querySelector("textarea")?.select()}}hostDisconnected(){this._copy=null}get _sm(){return this.host.stateManager}_fire(e,t){this.host.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:t}))}_name(e,t){if("module"===t.kind){const i=(0,w.cv)(e,t);return i?mt(i):(0,h.t)(584)}return"card"===t.kind?e.name?.trim()||(0,h.t)(167):(0,w.e9)(e,t).title}shortcut(e,t,i,o={}){const n=this._sm;if(!n)return!1;const a=(e.ctrlKey||e.metaKey)&&!e.altKey;if("ContextMenu"===e.key||"F10"===e.key&&e.shiftKey)return this.open(t,i,o),!0;if("F2"===e.key&&!a&&!e.altKey)return this.opts.rename(t),!0;if(a&&"d"===e.key.toLowerCase()&&("module"===t.kind||"row"===t.kind))return"row"===t.kind?n.duplicateRow(t.row):n.duplicateModule(t.row,t.col,t.module,t.child),this.opts.focusSelection(),!0;if(("Delete"===e.key||"Backspace"===e.key)&&!a){if("row"===t.kind)return this._deleteRow(t.row),!0;if("column"===t.kind)return(n.getConfig().rows[t.row]?.columns.length??0)<=1?this.open(t,i,o):(n.deleteColumn(t.row,t.col),this.opts.focusSelection()),!0;if("slot"===t.kind){const e=(0,$.yZ)((0,w.kW)(n.getConfig(),t));return!!e?.[t.slot]&&(e.length<=1?this.open(t,i,o):e[t.slot].length?this.open(t,i,o,"delete"):this._deleteSlot(t),!0)}}return!1}_deleteRow(e){if(this.opts.deleteRow)return this.opts.deleteRow(e);this._sm?.deleteRow(e),this.opts.focusSelection()}_moveRow(e,t){if(this.opts.moveRow)return this.opts.moveRow(e,t);const i=this._sm;!i||t<0||t>=i.getConfig().rows.length||(i.moveRow(e,t),i.setSelectedPath({rowIndex:t}),this.opts.focusSelection())}_deleteModule(e){if(this.opts.deleteModule)return this.opts.deleteModule(e);this._sm?.deleteModule(e.row,e.col,e.module,e.child),this.opts.focusSelection()}_deleteSlot(e){const t=this._sm,i=t&&(0,w.kW)(t.getConfig(),e);t&&i&&("tabs"===i.type?t.deleteTab(e.row,e.col,e.module,e.child?.map(e=>({...e})),e.slot):t.deleteNestedColumn(e.row,e.col,e.module,e.child?.map(e=>({...e})),e.slot),this.opts.focusSelection())}_moveSlot(e,t){const i=this._sm,o=i&&(0,w.kW)(i.getConfig(),e);if(!i||!o)return;const n=e.child?.map(e=>({...e}));"tabs"===o.type?i.moveTab(e.row,e.col,e.module,n,e.slot,t):i.moveNestedColumn(e.row,e.col,e.module,n,e.slot,t)}_select(e){this._sm?.setSelectedPath((0,w.bm)(e))}_edit(e){this._select(e),this._fire("mc-edit-module",{path:(0,w.bm)(e)})}_addChild(e,t){this._fire("add-module",{rowIndex:e.row,colIndex:e.col,moduleIndex:e.module,child:e.child,slot:t})}async _copyYaml(e,t){const i=this._sm?.getConfig();if(!i)return;const o="card"===e.kind?ot(i):M((0,w.R9)(i,e)),n=(0,k.fE)(JSON.parse(JSON.stringify(o??{}))),a=(0,h.t)(1270,{name:t});await(0,Je.D)(n,this.host.shadowRoot??this.host)?this.opts.status((0,h.t)(1271,{name:t})):(this._copy={text:n,title:a},this.host.requestUpdate())}_paste(e,t){const i=this._sm,o=T();i&&o&&i.pasteModule(e)&&this.opts.status((0,h.t)(1250,{module:mt(o),where:t}))}_run(e){e.back?this.back():e.view?this.setView(e.view,e.label):(this._pop.close(void 0===e.focus),e.run(),"selection"===e.focus&&this.opts.focusSelection())}_moveTargets(e,t){const i=this._sm,o=t.child,n=(e,t)=>({icon:"mdi:arrow-right",label:e,run:t,focus:"selection"}),a=[];if(o?.length){const s=(0,$.Rv)(e.rows[t.row]?.columns[t.col]?.modules?.[t.module],o.slice(0,-1)),r=s?(0,$.yZ)(s):void 0,l=o[o.length-1].slot;if(!s||!r)return[];a.push(...r.flatMap((e,a)=>a===l?[]:[n((0,V.D)(s,a)??(0,h.t)(967,{n:a+1}),()=>i.moveChildToSlot(t.row,t.col,t.module,o,a))]))}else a.push(...e.rows.flatMap((e,o)=>e.columns.flatMap((e,a)=>o===t.row&&a===t.col?[]:[n(ut(o,a),()=>i.moveModuleToColumn(t.row,t.col,t.module,o,a))])));const s=(o,n)=>{const a=lt(i.getConfig(),t,o);a&&(i.updateConfig(a.config),i.setSelectedPath(a.path),this.opts.status((0,h.t)(605,{name:mt((0,w.cv)(e,t)),where:n})))},r=[],l=o?.slice(0,-1)??[];e.rows.forEach((e,i)=>e.columns.forEach((e,o)=>{const a=(e,c,d,u)=>{const p=(0,$.yZ)(e);if(!p)return;const m=`${u} > ${mt(e)}`;p.forEach((u,p)=>{const g={row:i,col:o,module:c,...d.length?{child:d.map(e=>({...e}))}:{},slot:p,index:u.length},f=(0,$.WA)(e)?`${m} > ${(0,V.D)(e,p)??""}`:m,v=i===t.row&&o===t.col&&c===t.module&&(y=l,(b=d).length===y.length&&b.every((e,t)=>e.slot===y[t].slot&&e.index===y[t].index));var b,y;v||rt(t,g)||r.push(n((0,h.t)(493,{container:f}),()=>s(g,f))),u.forEach((e,t)=>a(e,c,[...d,{slot:p,index:t}],f))})};(e.modules??[]).forEach((e,t)=>a(e,t,[],ut(i,o)))}));const c=[];if(o?.length){const i={kind:"module",row:t.row,col:t.col,module:t.module,...l.length?{child:l}:{}},o=ct(e,i,"after"),a=(0,w.cv)(e,i);o&&a&&c.push(n((0,h.t)(700,{parent:mt(a)}),()=>s(o,mt(a))))}return[...a,...r,...c]}_model(e,t){const i=this._sm,o=!!e.template,n=this._name(e,t),a={icon:"mdi:arrow-left",label:(0,h.t)(120),run:()=>{},back:!0},s={icon:"mdi:arrow-left",label:(0,h.t)(162),run:()=>{},back:!0},r=(e,t,i,o=!1,n)=>({icon:e,label:t,run:()=>{},view:i,sub:!0,disabled:o,why:n}),l=(e,...t)=>({label:`${(0,h.t)(1272,{name:n})}, ${e}`,groups:[[a],...t]}),c={icon:"mdi:rename-box",label:(0,h.t)(798),run:()=>this.opts.rename(t),kbd:pt.rename,focus:"none"},d={icon:"mdi:code-braces",label:(0,h.t)(233),run:()=>{this._copyYaml(t,n)}},u=!I(),p=!T(),m=e=>{const t=u?(0,h.t)(234):void 0;return[{icon:"mdi:content-copy",label:(0,h.t)(237),run:()=>{i.copyDesign(e),this.opts.status((0,h.t)(1274,{name:n}))}},{icon:"mdi:content-paste",label:(0,h.t)(719),run:()=>i.pasteDesign(e,"replace"),disabled:u,why:t},{icon:"mdi:set-merge",label:(0,h.t)(579),run:()=>i.pasteDesign(e,"merge"),disabled:u,why:t}]},g=(e,i)=>({icon:"mdi:content-paste",label:e,run:()=>this._paste(t,i),disabled:p,why:p?(0,h.t)(235):void 0,focus:"selection"}),f=(0,w.R9)(e,t),v=(0,w.Ak)(f),b=(e=!1)=>({icon:v?"mdi:eye-outline":"mdi:eye-off-outline",label:e?v?(0,h.t)(942):(0,h.t)(446):v?(0,h.t)(937):(0,h.t)(445),run:()=>i.setHidden(t,!v)}),y=i.hasOverrides(t),k=e=>o?[{icon:"mdi:backup-restore",label:e,run:()=>{},view:"reset",disabled:!y,why:y?void 0:(0,h.t)(665)}]:[],x=(0,h.t)(1272,{name:n}),C=e=>({label:x,note:e,groups:[[s,{icon:"mdi:backup-restore",label:(0,h.t)(808),danger:!0,focus:"selection",run:()=>{"card"===t.kind?this._fire("template-resync"):i.ownsModuleList(t)?this._fire("mc-template-reapply",{resetColumn:t}):i.resetItem(t)&&this._fire("mc-template-reapply")}}]]});if("card"===t.kind){if("reset"===this.view)return C((0,h.t)(816));const i=ue(e)>0;return{label:x,groups:[[{icon:"mdi:card-outline",label:(0,h.t)(333),run:()=>this._edit(t),focus:"none"},{icon:"mdi:plus",label:(0,h.t)(50),run:()=>this._fire("request-add-row"),focus:"none"}],[c,d],o?[{icon:"mdi:backup-restore",label:(0,h.t)(809),run:()=>{},view:"reset",disabled:!i,why:i?void 0:(0,h.t)(665)}]:[]]}}const S=e.rows[t.row];if(!S)return null;if("row"===t.kind){if("reset"===this.view)return C((0,h.t)(823,{name:n}));const o=t.row;return"design"===this.view?l((0,h.t)(299),m({row:o}),[b(),d],k((0,h.t)(812))):{label:x,groups:[[{icon:"mdi:table-column-plus-after",label:(0,h.t)(37),run:()=>{i.addColumn(o),this._select({kind:"column",row:o,col:i.getConfig().rows[o].columns.length-1})},focus:"selection"},{icon:"mdi:content-duplicate",label:(0,h.t)(325),run:()=>i.duplicateRow(o),kbd:pt.dup,focus:"selection"},c,{icon:"mdi:arrow-up",label:(0,h.t)(602),run:()=>this._moveRow(o,o-1),disabled:0===o,kbd:pt.up,focus:"none"},{icon:"mdi:arrow-down",label:(0,h.t)(599),run:()=>this._moveRow(o,o+1),disabled:o>=e.rows.length-1,kbd:pt.down,focus:"none"}],[r("mdi:palette-outline",(0,h.t)(299),"design")],[{icon:"mdi:delete-outline",label:(0,h.t)(291),run:()=>this._deleteRow(o),danger:!0,kbd:pt.del,focus:"none"}]]}}if("column"===t.kind){if("reset"===this.view)return C((0,h.t)(823,{name:n}));const e=S.columns.length<=1,o=(0,h.t)(846,{row:t.row+1,column:t.col+1});return"design"===this.view?{label:`${o}, ${(0,h.t)(299)}`,groups:[[a],m({row:t.row,col:t.col}),[b(),d],k((0,h.t)(810))]}:{label:o,groups:[[{icon:"mdi:plus",label:(0,h.t)(45),run:()=>this._fire("add-module",{rowIndex:t.row,colIndex:t.col}),focus:"none"},g((0,h.t)(720),ut(t.row,t.col)),c],[r("mdi:palette-outline",(0,h.t)(299),"design")],[{icon:"mdi:delete-outline",label:(0,h.t)(285),danger:!0,kbd:pt.del,focus:"selection",run:()=>i.deleteColumn(t.row,t.col),disabled:e,why:e?(0,h.t)(17):void 0}]]}}if("slot"===t.kind){const i=(0,w.kW)(e,t),o=(0,$.yZ)(i);if(!i||!o?.[t.slot])return null;const a="tabs"===i.type,u=o[t.slot].length,p=o.length<=1,f=(0,w.tw)(t),v=()=>this._deleteSlot(t);if("delete"===this.view)return{label:x,note:a?(0,h.t)(294,{name:n,n:u}):(0,h.t)(286,{name:n,n:u}),groups:[[s,{icon:"mdi:delete-outline",label:a?(0,h.t)(293):(0,h.t)(285),run:v,danger:!0,focus:"none"}]]};const y={row:t.row,col:t.col,module:t.module,child:t.child,slot:t.slot};return"design"===this.view?l((0,h.t)(299),...a?[]:[m(y)],[b(a),d]):{label:x,groups:[[{icon:"mdi:plus",label:(0,h.t)(45),run:()=>this._addChild(f,t.slot),focus:"none"},g((0,h.t)(720),`${mt(i)} · ${n}`),c,{icon:"mdi:arrow-up",label:(0,h.t)(602),run:()=>this._moveSlot(t,-1),disabled:t.slot<=0,kbd:pt.up,focus:"selection"},{icon:"mdi:arrow-down",label:(0,h.t)(599),run:()=>this._moveSlot(t,1),disabled:t.slot>=o.length-1,kbd:pt.down,focus:"selection"}],[r("mdi:palette-outline",(0,h.t)(299),"design")],[{icon:"mdi:delete-outline",label:a?(0,h.t)(293):(0,h.t)(285),danger:!0,kbd:pt.del,run:v,view:u&&!p?"delete":void 0,focus:"none",disabled:p,why:p?a?(0,h.t)(19):(0,h.t)(17):void 0}]]}}const M=(0,w.cv)(e,t);if(!M)return null;const A=!!t.child?.length,q=e.rows[t.row]?.columns[t.col]?.modules?.[t.module];if("reset"===this.view)return C(A&&q?(0,h.t)(822,{name:mt(q)}):(0,h.t)(823,{name:n}));const E=this._moveTargets(e,t),L=(0,at.xc)(M),z=[..."background"!==L?[{icon:"mdi:arrange-send-to-back",label:(0,h.t)(778),run:()=>{st(i,t,"background")},focus:"selection"}]:[],..."overlay"!==L?[{icon:"mdi:arrange-bring-to-front",label:(0,h.t)(779),run:()=>{st(i,t,"overlay")},focus:"selection"}]:[],..."flow"!==L?[{icon:"mdi:view-sequential-outline",label:(0,h.t)(122),run:()=>{st(i,t,"flow")},focus:"selection"}]:[]];if("placement"===this.view)return{label:x,groups:[[s],z]};if("move"===this.view)return l((0,h.t)(601),E);if("wrap"===this.view)return l((0,h.t)(1187),ht.map(e=>{const o=_.s.get(e)?.metadata;return{icon:o?.icon||"mdi:view-grid-outline",label:(0,w.Iu)({type:e}),run:()=>i.wrapInLayout(t,e),focus:"selection"}}));const j=A?t.child[t.child.length-1].index:t.module,R=A?(0,$.yZ)((0,$.Rv)(q,t.child.slice(0,-1)))?.[t.child[t.child.length-1].slot]:S.columns[t.col]?.modules,O=R?.length??0,P="tabs"===M.type||"row"===M.type?[{icon:"tabs"===M.type?"mdi:tab-plus":"mdi:table-column-plus-after",label:"tabs"===M.type?(0,h.t)(52):(0,h.t)(37),focus:"selection",run:()=>"tabs"===M.type?i.addTab(t.row,t.col,t.module,t.child?.map(e=>({...e}))):i.addNestedColumn(t.row,t.col,t.module,t.child?.map(e=>({...e})))}]:(0,$.WA)(M)||!(0,$.yZ)(M)?[]:[{icon:"mdi:plus",label:(0,h.t)(45),run:()=>this._addChild(t,0),focus:"none"}],H=Z(e,t),D="canvas"===this.opts.surface&&this.opts.connect?[{icon:"mdi:transit-connection-variant",label:(0,h.t)(43),run:()=>this.opts.connect(t),focus:"none",disabled:H,why:H?(0,h.t)(417):void 0}]:[],F=Ne(M).length>0,V={icon:"mdi:swap-horizontal",label:(0,h.t)(804),focus:"none",run:()=>this._fire("replace-module",{sel:t,status:this.opts.status,focus:()=>this.opts.focusSelection()}),disabled:H||!F,why:H?(0,h.t)(417):F?void 0:(0,h.t)(643)},N=A?(0,w.e9)(e,(0,w.tw)(t,e)).title:ut(t.row,t.col),B=[...P,...D];return"add"===this.view?l((0,h.t)(27),B):"arrange"===this.view?l((0,h.t)(101),[{icon:"mdi:folder-move-outline",label:(0,h.t)(601),run:()=>{},view:"move",sub:!0,disabled:!E.length,why:E.length?void 0:(0,h.t)(642)},{icon:"mdi:group",label:(0,h.t)(1187),run:()=>{},view:"wrap",sub:!0}],z):"design"===this.view?l((0,h.t)(299),m({row:t.row,col:t.col,module:t.module,child:t.child}),[b(),...k(A?(0,h.t)(811):(0,h.t)(820))]):"clipboard"===this.view?l((0,h.t)(236),[{icon:"mdi:content-copy",label:(0,h.t)(239),run:()=>{i.copyModule(t)&&this.opts.status((0,h.t)(1273,{name:n}))}},g((0,h.t)(721),N),d]):{label:x,groups:[[{icon:"mdi:pencil-outline",label:(0,h.t)(331),run:()=>this._edit(t),focus:"none"},c,{icon:"mdi:content-duplicate",label:(0,h.t)(323),run:()=>i.duplicateModule(t.row,t.col,t.module,t.child),kbd:pt.dup,focus:"selection"},V,{icon:"mdi:arrow-up",label:(0,h.t)(602),run:()=>i.moveModuleBy(t.row,t.col,t.module,-1,t.child),disabled:j<=0,kbd:pt.up,focus:"selection"},{icon:"mdi:arrow-down",label:(0,h.t)(599),run:()=>i.moveModuleBy(t.row,t.col,t.module,1,t.child),disabled:j>=O-1,kbd:pt.down,focus:"selection"}],[...B.length?[r("mdi:plus",(0,h.t)(27),"add")]:[],r("mdi:arrange-bring-forward",(0,h.t)(101),"arrange"),r("mdi:palette-outline",(0,h.t)(299),"design"),r("mdi:content-copy",(0,h.t)(236),"clipboard")],[{icon:"mdi:delete-outline",label:(0,h.t)(281),run:()=>this._deleteModule(t),danger:!0,kbd:pt.del,focus:"none"}]]}}_renderEntry(e){return o.qy`<button
      type="button"
      role="menuitem"
      class=${e.danger?"danger":""}
      title=${e.why??o.s6}
      aria-description=${e.why??o.s6}
      aria-haspopup=${e.sub?"menu":o.s6}
      aria-keyshortcuts=${e.kbd?.[1]??o.s6}
      data-kbd=${e.kbd?.[0]??o.s6}
      data-back=${e.back&&e.label===(0,h.t)(120)?"":o.s6}
      ?disabled=${e.disabled}
      @click=${()=>this._run(e)}
    ><ha-icon icon=${e.icon}></ha-icon>${e.label}</button>`}render(){const e=this._sm,t=this.sel,i=this.isOpen&&t&&e?this._model(e.getConfig(),t):null,n=i?.groups.filter(e=>e.length)??[],a=i?o.qy`<div class="menu item-menu" role="menu" aria-label=${i.label} aria-describedby=${i.note?"menu-note":o.s6} @keydown=${this._onKey}>
          ${i.note?o.qy`<p class="menu-note" id="menu-note">${i.note}</p>`:o.s6}
          ${n.map((e,t)=>o.qy`${t?o.qy`<hr />`:o.s6}${e.map(e=>this._renderEntry(e))}`)}
        </div>`:o.s6,s=this._copy,r=s?o.qy`<dialog class="copy-dlg" aria-labelledby="copy-dlg-title" aria-describedby="copy-dlg-hint"
          @close=${this._closeCopy}
          @keydown=${e=>{"Escape"===e.key&&e.stopPropagation()}}>
          <h2 id="copy-dlg-title">${(0,h.t)(241)}</h2>
          <p id="copy-dlg-hint">${(0,h.t)(1292,{title:s.title})}</p>
          <textarea readonly rows="12" aria-labelledby="copy-dlg-title" .value=${s.text}></textarea>
          <div class="actions">
            <button type="button" class="btn btn-secondary" @click=${e=>e.currentTarget.closest("dialog")?.close()}>${(0,h.t)(197)}</button>
          </div>
        </dialog>`:o.s6;return o.qy`${a}${r}`}}class ft{constructor(e){this.onFire=e,this._timer=0,this._x=0,this._y=0,this._firedAt=-1/0,this.down=e=>{if(this.cancel(),"touch"!==e.pointerType)return;const t=e.composedPath();this._x=e.clientX,this._y=e.clientY,this._timer=window.setTimeout(()=>{this._timer=0,this._firedAt=Date.now(),this.onFire(t,this._x,this._y)},500)},this.move=e=>{this._timer&&Math.hypot(e.clientX-this._x,e.clientY-this._y)>8&&this.cancel()},this.cancel=()=>{this._timer&&clearTimeout(this._timer),this._timer=0}}get justFired(){return Date.now()-this._firedAt<800}}const vt=o.AH`
  .item-menu {
    min-width: 240px;
    max-width: min(320px, calc(100vw - 16px));
  }
  .item-menu button {
    width: 100%;
    font-size: 0.875rem;
    color: var(--mc-text);
    white-space: nowrap;
  }
  .item-menu button[data-kbd]::after,
  .item-menu button[aria-haspopup]::after {
    margin-left: auto;
    padding-left: 16px;
    font-size: 0.75rem;
    color: var(--mc-text-2);
  }
  .item-menu button[data-kbd]::after {
    content: attr(data-kbd);
    font-family: var(--mc-mono);
  }
  .item-menu button[aria-haspopup]::after {
    content: '›';
    font-size: 1rem;
  }
  .item-menu .menu-note {
    margin: 4px 8px 8px;
    max-width: 260px;
    font-size: 0.8125rem;
    color: var(--mc-text-2);
    overflow-wrap: anywhere;
    white-space: normal;
  }
  /* a long module menu fits a 768 px laptop with a mouse */
  @media (pointer: fine) {
    .item-menu button {
      min-height: 36px;
    }
  }
  dialog.copy-dlg {
    width: min(520px, calc(100vw - 32px));
    max-height: calc(100dvh - 32px);
    box-sizing: border-box;
    padding: 20px;
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius-lg);
    background: var(--mc-surface);
    color: var(--mc-text);
    box-shadow: var(--mc-shadow-float);
  }
  dialog.copy-dlg::backdrop {
    background: rgba(0, 0, 0, 0.4);
  }
  dialog.copy-dlg h2 {
    margin: 0 0 4px;
    font-size: 1rem;
    font-weight: 500;
  }
  dialog.copy-dlg p {
    margin: 0 0 12px;
    font-size: 0.8125rem;
    color: var(--mc-text-2);
  }
  dialog.copy-dlg textarea {
    width: 100%;
    box-sizing: border-box;
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
    color: var(--mc-text);
    background: var(--mc-surface-2);
    border: 1px solid var(--mc-divider);
    border-radius: var(--mc-radius);
    padding: 8px;
    resize: vertical;
  }
  dialog.copy-dlg .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 12px;
  }
`;var bt=i(754);function yt(e,t){const i=e.map(e=>(Number.isFinite(e)&&e>0?+e.toFixed(3):1)+"fr").join(" ");return o.qy`<span class="layout-glyph" aria-hidden="true" style=${(0,bt.W)({gridTemplateColumns:i})}>${e.map((e,i)=>i===t?o.qy`<i class="on"></i>`:o.qy`<i></i>`)}</span>`}function _t(e,t){const i=t??Math.max(e.split("-").length,1);return function(e,t){if(/^\d+(?:-\d+)*$/.test(e)){const i=e.split("-").map(e=>Math.max(Number(e)||1,1));if(i.length===t)return i}return function(e){return Array.from({length:Math.max(e,1)},()=>1)}(t)}(e||"1",i)}let wt;var $t=i(886),kt=(i(4121),function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s});const xt={card:1208,row:1228,column:1212,tabs:1230,slides:1229},Ct=e=>(0,h.t)(xt[e]),St={camera:1196,light:1200,weather:1205,sensor:1203,binary_sensor:1203,switch:1204,input_select:1201,select:1201,other:1198},Mt=e=>(0,h.t)(St[e&&e in St?e:"other"]);function At(e){const t=e?.inherited;if(e&&"inherit"===e.choice&&t&&e.effective)return(0,h.t)(107,{id:e.effective,source:Ct(t.from)})}let qt=class extends o.WF{constructor(){super(...arguments),this.domain="",this.layout=!1,this.fieldKey="",this.onChange=()=>{},this._picking=!1,this._live="",this._announced="",this._same=()=>{if(!this._canFollow)return;this._picking=!1,void 0!==this.value&&this.onChange(void 0);const e=this.info.inherited,t=(0,h.t)(667,{name:this._name(e.id),source:Ct(e.from)});this._say(this.info.mismatch?`${t} ${this._mismatchText()}`:t)},this._pick=()=>{if("pick"===this._pressed)return;this._picking=!0;const e=this.info.inherited;"own"===this.info.choice||!e||this.info.mismatch||this.info.cardModule?void 0!==this.value&&this.onChange(void 0):this.onChange(e.id),this._say("")},this._none=()=>{this._picking=!1,"none"!==this._raw&&this.onChange("none"),this._say((0,h.t)(632))},this._pickAndOpen=()=>{this._pick(),this._picking=!0,this.updateComplete.then(()=>{const e=this.renderRoot.querySelector("mc-entity-picker");e?.focusInput?.(),e?.open?.()})},this._openCardSettings=()=>{this.dispatchEvent(new CustomEvent("mc-open-card-entity",{bubbles:!0,composed:!0}))},this._onPicked=e=>{e.stopPropagation();const t=e.detail.value;this.onChange(""===t?void 0:t),t&&this.hass?.states?.[t]&&t!==this._announced&&(this._announced=t,this._say((0,h.t)(668,{name:this._name(t)})))},this._onKey=e=>{if(!["ArrowRight","ArrowDown","ArrowLeft","ArrowUp","Home","End"].includes(e.key))return;const t=[...e.currentTarget.querySelectorAll("button")],i=t.indexOf(e.target);if(i<0)return;e.preventDefault();const o=t.length,n="Home"===e.key?0:"End"===e.key?o-1:(i+("ArrowRight"===e.key||"ArrowDown"===e.key?1:-1)+o)%o;t.forEach((e,t)=>e.tabIndex=t===n?0:-1),t[n].focus()},this._onFocusOut=e=>{e.currentTarget.contains(e.relatedTarget)||(this._live="")}}willUpdate(e){e.has("fieldKey")&&(this._picking=!1,this._live="")}get _raw(){return"string"==typeof this.value?this.value:void 0}get _canFollow(){return!this.info.cardModule&&!!this.info.inherited}get _pressed(){const e=this.info;return"own"===e.choice?"pick":"none"===e.choice?"none":this._picking?"pick":this._canFollow?"same":void 0}get _showPicker(){return"pick"===this._pressed||"inherit"===this.info.choice&&!this._canFollow}_name(e){const t=this.hass?.states?.[e];return t?.attributes?.friendly_name||e}_mismatchText(){const e=this.info;if(!e.mismatch||!e.inherited)return"";const t=Mt(1===e.domains?.length?e.domains[0]:void 0);return(0,h.t)(1077,{kind:t,source:Ct(e.inherited.from),thing:Mt(e.inherited.id.split(".")[0])})}_say(e){this._live=e}_link(e){const[t,i]=e.split("");return o.qy`${t}<button type="button" class="link" @click=${this._openCardSettings}>${(0,h.t)(177)}</button>${i??""}`}_hint(){const e=this.info;if(e.cardModule)return o.qy`<p class="help" id="hint">${(0,h.t)(174)}</p>`;if("none"===e.choice)return o.qy`<p class="help" id="hint">${this.layout?(0,h.t)(1086):(0,h.t)(1078)}</p>`;if("own"===e.choice)return o.s6;if(this._canFollow&&!this._picking){const t=e.inherited,i=this.hass?.states?.[t.id],n=!this.hass?.states||!!i,a=this._name(t.id),s=n?a:(0,h.t)(1266,{name:a}),r=i?`${t.id} · ${this.hass.formatEntityState?.(i)??i.state}`:"";return o.qy`<p class="line" id="hint"><ha-icon icon="mdi:link-variant" aria-hidden="true"></ha-icon><span>${(0,h.t)(405,{source:Ct(t.from),name:s})}</span></p>${i?o.qy`<p class="sub mono">${r}</p>`:o.s6} `}if(this._picking||e.cardModule)return o.s6;const t=e.walled?o.qy`${(0,h.t)(18)}`:this._link((0,h.t)(664,{link:""}));return o.qy`<p class="help" id="hint">${t}</p>`}_mismatch(){const e=this.info;if(!e.mismatch||this._picking||"inherit"!==e.choice)return o.s6;const t=1===e.domains?.length;return o.qy`<p class="warn"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${this._mismatchText()}</span></p><div class="acts"><button type="button" class="btn btn-secondary btn-sm" @click=${this._pickAndOpen}>${(0,h.t)(744,{kind:t?Mt(e.domains[0]):(0,h.t)(1197)})}</button> <button type="button" class="btn btn-secondary btn-sm" @click=${this._none}>${(0,h.t)(631)}</button></div>`}_invalid(){const e=this.info;if("own"!==e.choice||!e.invalidOwn)return o.s6;const t="none"===(this._raw??"").trim().toLowerCase();return o.qy`<p class="warn"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${t?(0,h.t)(304):(0,h.t)(1031)}</span></p>${t?o.qy`<div class="acts"><button type="button" class="btn btn-secondary btn-sm" @click=${this._none}>${(0,h.t)(1127)}</button></div>`:o.s6} `}render(){const e=this.info;if(!e)return o.qy``;const t=this._pressed,i=this._canFollow,n=[];e.cardModule||n.push({id:"same",label:(0,h.t)(858,{source:Ct(e.inherited?.from??"card")}),on:this._same,disabled:!i}),n.push({id:"pick",label:(0,h.t)(740),on:this._pick},{id:"none",label:(0,h.t)(631),on:this._none});const a=n.find(e=>e.id===t)??n.find(e=>!e.disabled)??n[0],s=this._hint();return o.qy`<div class="src"><div class="seg full" role="group" aria-label=${(0,h.t)(368)} @keydown=${this._onKey} @focusout=${this._onFocusOut}> ${n.map(e=>o.qy`<button type="button" data-choice=${e.id} aria-pressed=${t===e.id?"true":"false"} aria-disabled=${e.disabled?"true":o.s6} aria-describedby=${e.disabled&&s!==o.s6?"hint":o.s6} tabindex=${e===a?"0":"-1"} @click=${e.on} >${e.label}</button>`)}</div>${s} ${this._mismatch()} ${this._showPicker?o.qy`<mc-entity-picker .hass=${this.hass} .value=${"own"===e.choice?this._raw??"":""} .domain=${this.domain} .label=${(0,h.t)(710)} .placeholder=${(0,h.t)(730)} @value-changed=${this._onPicked} ></mc-entity-picker>`:o.s6} ${this._invalid()}<div class="sr-only" role="status" aria-live="polite" aria-atomic="true">${this._live}</div></div>`}};qt.styles=[l.x,o.AH`:host{display:block;min-width:0}.src{display:grid;gap:8px;min-width:0}.src .seg>button{white-space:normal;line-height:1.2}.src .seg>button[aria-pressed='true']{background:var(--mc-surface);color:var(--mc-accent-ink)}.src .seg>button[aria-disabled='true']{border:1px dashed var(--mc-text-2);opacity:.55;cursor:default}.src .line,.src .warn{display:flex;gap:6px;margin:0;font-size:.8125rem;overflow-wrap:anywhere}.src .warn{font-size:.875rem;color:var(--mc-warn-ink)}.src ha-icon{--mdc-icon-size:16px;flex:none}.src .sub{margin:0;padding-left:22px;color:var(--mc-text-2);overflow-wrap:anywhere}.src .acts{display:flex;flex-wrap:wrap;gap:8px}.src .link{padding:0;border:0;background:none;color:var(--mc-accent-ink);font:inherit;text-decoration:underline;cursor:pointer}@media (pointer:coarse){.src .seg>button,.src .acts .btn,.src .link{min-height:44px}.src .seg>button{font-size:.875rem}}`],kt([(0,n.MZ)({attribute:!1})],qt.prototype,"hass",void 0),kt([(0,n.MZ)({attribute:!1})],qt.prototype,"info",void 0),kt([(0,n.MZ)({attribute:!1})],qt.prototype,"value",void 0),kt([(0,n.MZ)({type:String})],qt.prototype,"domain",void 0),kt([(0,n.MZ)({type:Boolean})],qt.prototype,"layout",void 0),kt([(0,n.MZ)({type:String})],qt.prototype,"fieldKey",void 0),kt([(0,n.MZ)({attribute:!1})],qt.prototype,"onChange",void 0),kt([(0,n.wk)()],qt.prototype,"_picking",void 0),kt([(0,n.wk)()],qt.prototype,"_live",void 0),qt=kt([(0,n.EM)("mc-entity-source")],qt);const Et=["horizontal","vertical","row","tabs","slider-layout"],Tt=e=>!e.type||Et.includes(e.type);function Lt(e,t){const i={...e};return void 0===t?delete i.entity:i.entity=t,i}function zt(e,t,i,n,a,s={}){const r=s.write??Lt;return a?o.qy`<div class="mc-field">${(0,$t.XT)(e,"entity",s.syncCtx)} <mc-entity-source .hass=${n} .info=${a} .value=${t.entity} .domain=${s.domain??""} .layout=${Tt(t)} .fieldKey=${l=t,wt??l.id??""} .onChange=${e=>i(r(t,e))} ></mc-entity-source></div>`:(0,$t.cy)(e,t.entity,e=>i(r(t,e)),n,s.domain,"entity",s.syncCtx);var l}function jt(e,t,i,n,a){const s=Tt(e)&&"own"===n.choice&&!n.invalidOwn;return o.qy`<div class="mc-tab-content">${zt((0,h.t)(357),e,i,t,n,{syncCtx:a})} ${s?(0,$t.vm)((0,h.t)(910),!0===e.share_entity,t=>i({...e,share_entity:t}),"share_entity",a,(0,h.t)(1085)):o.s6}</div>`}const Rt={horizontal:"row",row:"row",vertical:"column",tabs:"tabs","slider-layout":"slides"},Ot=["general","actions","conditions","design"];var Pt=i(5832),Ht=i(9948);const Dt=[{key:"tap_action",title:1020,icon:"mdi:gesture-tap"},{key:"hold_action",title:449,icon:"mdi:gesture-tap-hold"},{key:"double_tap_action",title:314,icon:"mdi:gesture-double-tap"}],It=[{label:654,value:"none"},{label:1096,value:"toggle"},{label:595,value:"more-info"},{label:617,value:"navigate"},{label:160,value:"perform-action"},{label:1107,value:"url"},{label:103,value:"assist"},{label:691,value:"popup"},{label:198,value:"close-popup"}];function Ft(e,t,i,n,a){return o.qy`${Dt.map(s=>o.qy`
      <section class="group">
        <div class="group-head"><ha-icon icon=${s.icon}></ha-icon><h3>${(0,h.t)(s.title)}</h3></div>
        ${function(e,t,i,n,a,s="action"){const r=e||{action:"none"},l=(0,Pt.oi)(r.hash),c=(0,Pt.NG)(l),d=`mc-popup-ids-${s}`,u="more-info"===r.action||"toggle"===r.action,p=!1!==r.use_module_entity,m={...r.data||{}},g="string"==typeof m.entity_id?m.entity_id:"";delete m.entity_id;const f=Object.keys(m).length?(0,k.fE)(m).trimEnd():"",v=e=>t({...r,data:Object.keys(e).length?e:void 0});return o.qy`
    <div class="mc-action-config">
      ${(0,$t.De)((0,h.t)(23),r.action,(0,h.tl)(It),e=>t({...r,action:e}),"action",a)}
      ${u&&n?(0,$t.vm)((0,h.t)(1140),p,e=>t({...r,use_module_entity:e,entity:e?void 0:r.entity}),"use_module_entity",a):o.s6}
      ${!u||n&&p?o.s6:(0,$t.cy)((0,h.t)(357),r.entity,e=>t({...r,entity:e}),i,void 0,"entity",a)}
      ${"toggle"===r.action&&n&&p?o.qy`<p class="help">${(0,h.tx)(1097,{entity:o.qy`<span class="mono">${n}</span>`})}</p>`:o.s6}
      ${"navigate"===r.action?(0,$t.Gz)((0,h.t)(620),r.navigation_path,e=>t({...r,navigation_path:e}),"navigation_path",a):o.s6}
      ${"popup"===r.action?o.qy`
            <div class="mc-field">
              ${(0,$t.XT)((0,h.t)(762),"hash",a)}
              <input
                class="input mono"
                type="text"
                spellcheck="false"
                autocomplete="off"
                list=${d}
                placeholder="kitchen"
                aria-label=${(0,h.t)(762)}
                .value=${l}
                @input=${e=>t({...r,hash:(0,Pt.oi)(e.target.value)||void 0})}
              />
              <datalist id=${d}>
                ${((0,Ht.T)()?.api.knownIds()??[]).map(e=>o.qy`<option value=${e}></option>`)}
              </datalist>
              ${c?o.qy`<p class="help error" role="alert">${c}</p>`:o.qy`<p class="help">${(0,h.tx)(694,{path:o.qy`<span class="mono">#${l||"id"}</span>`})}</p>`}
            </div>
          `:o.s6}
      ${"close-popup"===r.action?o.qy`<p class="help">${(0,h.t)(200)}</p>`:o.s6}
      ${"url"===r.action?(0,$t.Gz)((0,h.t)(1107),r.url_path,e=>t({...r,url_path:e}),"url_path",a):o.s6}
      ${"perform-action"===r.action?o.qy`
            ${(0,$t.M3)((0,h.t)(901),r.service,e=>t({...r,service:e}),i,"service",a)}
            ${(0,$t.Gz)((0,h.t)(1023),g,e=>{const t={...r.data||{}};e.trim()?t.entity_id=e.trim():delete t.entity_id,v(t)},"data",a,{placeholder:"entity_id",mono:!0})}
            <div class="mc-field">
              ${(0,$t.XT)((0,h.t)(902),"data",a)}
              <textarea
                class="input"
                rows="3"
                spellcheck="false"
                .value=${f}
                @input=${e=>{const t=e.target.value,i=t.trim()?(0,k.EA)(t):{};i&&"object"==typeof i&&!Array.isArray(i)&&v(g?{...i,entity_id:g}:{...i})}}
              ></textarea>
              <p class="help">${(0,h.t)(1192)}</p>
            </div>
          `:o.s6}
    </div>
  `}(e?.[s.key],e=>t(s.key,e),i,n,a?.(s.key),s.key)}
      </section>
    `)}`}const Vt=[{label:991,value:"state"},{label:105,value:"attribute"},{label:1088,value:"time"},{label:1024,value:"template"}],Nt=[{value:"every",label:63},{value:"any",label:91}],Zt=[{label:1215,value:"eq"},{label:1226,value:"ne"}];function Bt(e,t,i){return o.qy`
    <div class="mc-field">
      ${(0,$t.XT)(e)}
      <input class="input" type="time" .value=${t||""} @input=${e=>i(e.target.value)} />
    </div>
  `}function Wt(e,t,i,n,a,s="module"){if(!e.length)return o.qy`
      <div class="empty">
        <ha-icon icon="mdi:eye-check-outline"></ha-icon>
        <strong>${(0,h.t)(68)}</strong>
        <p>${(e=>"rule"===e?(0,h.t)(32):"card"===e?(0,h.t)(28):"row"===e?(0,h.t)(31):"column"===e?(0,h.t)(29):(0,h.t)(30))(s)}</p>
        <button type="button" class="btn btn-secondary btn-sm" @click=${i.onAdd}>
          <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(40)}
        </button>
      </div>
    `;const r=a?.basePath;return o.qy`
    <div class="group">
      <p class="help lead">${(e=>"rule"===e?(0,h.t)(948):"card"===e?(0,h.t)(944):"row"===e?(0,h.t)(947):"column"===e?(0,h.t)(945):(0,h.t)(946))(s)}</p>
      ${function(e,t,i,n=(0,h.t)(560)){return o.qy`
    <div class="field">
      ${n?(0,$t.XT)(n,i?"mode":void 0,i):o.s6}
      <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(223)} @keydown=${i=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(i.key))return;i.preventDefault();const o="every"===e?"any":"every";t(o);const n=i.currentTarget;requestAnimationFrame(()=>n.querySelector(`[data-val="${o}"]`)?.focus())}}>
        ${Nt.map(i=>o.qy`
            <button
              type="button"
              role="radio"
              data-val=${i.value}
              aria-checked=${e===i.value?"true":"false"}
              tabindex=${e===i.value?"0":"-1"}
              @click=${()=>t(i.value)}
            >${(0,h.t)(i.label)}</button>
          `)}
      </div>
    </div>
  `}(t,i.onMode,a,"")}
    </div>
    <div class="group cond-list">
      ${e.map((e,t)=>{const s=a?{...a,basePath:r?`${r}.conditions.${t}`:`conditions.${t}`}:void 0,l=e=>i.onUpdate(t,e);return o.qy`
          <div class="cond">
            <div class="cond-head">
              <span class="n">${(0,h.t)(225,{n:t+1})}</span>
              <button
                type="button"
                class="icon-btn sm danger"
                aria-label=${(0,h.t)(792,{n:t+1})}
                title=${(0,h.t)(791)}
                @click=${()=>i.onRemove(t)}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            ${(0,$t.De)((0,h.t)(1106),e.type,(0,h.tl)(Vt),e=>l({type:e}),s?"type":void 0,s)}
            ${function(e,t,i,n){const a=e=>n?e:void 0;switch(e.type){case"state":case"attribute":return o.qy`
        ${(0,$t.cy)((0,h.t)(357),e.entity,e=>t({entity:e}),i,void 0,a("entity"),n)}
        ${"attribute"===e.type?(0,$t.Gz)((0,h.t)(105),e.attribute,e=>t({attribute:e}),a("attribute"),n):o.s6}
        ${function(e,t,i,n){const a=!e.state&&!!e.state_not,s=(a?e.state_not:e.state)||"";return o.qy`
    <div class="two">
      ${(0,$t.De)((0,h.t)(696),a?"ne":"eq",(0,h.tl)(Zt),e=>t("ne"===e?{state:void 0,state_not:s}:{state:s,state_not:void 0}))}
      ${(0,$t.Gz)(i,s,e=>t(a?{state_not:e}:{state:e}),n?a?"state_not":"state":void 0,n)}
    </div>
  `}(e,t,"attribute"===e.type?(0,h.t)(1151):(0,h.t)(991),n)}
      `;case"time":return o.qy`
        <div class="two">
          ${Bt((0,h.t)(57),e.after,e=>t({after:e}))}
          ${Bt((0,h.t)(133),e.before,e=>t({before:e}))}
        </div>
      `;case"template":return(0,$t.fZ)((0,h.t)(1024),e.template,e=>t({template:e}),{rows:3},a("template"),n);default:return o.qy``}}(e,l,n,s)}
          </div>
        `})}
      <div>
        <button type="button" class="btn btn-secondary btn-sm" @click=${i.onAdd}>
          <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(40)}
        </button>
      </div>
    </div>
  `}var Kt=i(1299),Ut=i(939),Gt=i(201),Yt=(i(757),i(9315));const Qt={spin:983,glow:419,flame:390,drum:321,swing:1011,pulse:777,snow:972,shake:906,eq:371},Jt=[{value:"off",label:674},{value:"auto",label:108},...Object.entries(Qt).map(([e,t])=>({value:e,label:t}))],Xt=[{value:"off",label:674},{value:"load",label:677},{value:"change",label:676},{value:"loop",label:549}];var ei=i(4727),ti=i(3925),ii=(i(7681),i(7106),i(2377),i(9048),i(5112)),oi=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const ni=[{name:"Roboto",family:"Roboto, sans-serif",category:"Sans-serif"},{name:"Open Sans",family:'"Open Sans", sans-serif',category:"Sans-serif"},{name:"Lato",family:"Lato, sans-serif",category:"Sans-serif",weights:[300,400,700]},{name:"Montserrat",family:"Montserrat, sans-serif",category:"Sans-serif"},{name:"Oswald",family:"Oswald, sans-serif",category:"Sans-serif"},{name:"Source Sans Pro",family:'"Source Sans Pro", sans-serif',category:"Sans-serif",weights:[300,400,700]},{name:"Raleway",family:"Raleway, sans-serif",category:"Sans-serif"},{name:"PT Sans",family:'"PT Sans", sans-serif',category:"Sans-serif",weights:[400,700]},{name:"Merriweather",family:"Merriweather, serif",category:"Serif"},{name:"Playfair Display",family:'"Playfair Display", serif',category:"Serif",weights:[400,500,700]},{name:"Lora",family:"Lora, serif",category:"Serif",weights:[400,500,700]},{name:"PT Serif",family:'"PT Serif", serif',category:"Serif",weights:[400,700]},{name:"Noto Sans",family:'"Noto Sans", sans-serif',category:"Sans-serif"},{name:"Ubuntu",family:"Ubuntu, sans-serif",category:"Sans-serif"},{name:"Poppins",family:"Poppins, sans-serif",category:"Sans-serif"},{name:"Nunito",family:"Nunito, sans-serif",category:"Sans-serif"},{name:"Inconsolata",family:"Inconsolata, monospace",category:"Monospace"},{name:"Fira Code",family:'"Fira Code", monospace',category:"Monospace"},{name:"Source Code Pro",family:'"Source Code Pro", monospace',category:"Monospace"},{name:"Dancing Script",family:'"Dancing Script", cursive',category:"Cursive",weights:[400,500,700]}],ai=[{name:"Arial",family:"Arial, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Helvetica",family:"Helvetica, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Times New Roman",family:'"Times New Roman", serif',category:"Serif",isLocal:!0},{name:"Georgia",family:"Georgia, serif",category:"Serif",isLocal:!0},{name:"Courier New",family:'"Courier New", monospace',category:"Monospace",isLocal:!0},{name:"Verdana",family:"Verdana, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Tahoma",family:"Tahoma, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Trebuchet MS",family:'"Trebuchet MS", sans-serif',category:"Sans-serif",isLocal:!0},{name:"Comic Sans MS",family:'"Comic Sans MS", cursive',category:"Cursive",isLocal:!0},{name:"Impact",family:"Impact, sans-serif",category:"Sans-serif",isLocal:!0}];let si=class extends o.WF{constructor(){super(...arguments),this.value="",this._windowCtrl=new Ue.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery="",this._selectedFont=null,this._activeTab="local"}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_openModal(){this._showModal=!0,this._searchQuery="",this._selectedFont=null}_closeModal(){this._showModal=!1}_selectFont(e){this._selectedFont=e}_handleSave(){if(!this._selectedFont)return void this._closeModal();const e=this._selectedFont.family;this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_getFilteredFonts(){"google"===this._activeTab&&(0,ii.E$)(ni.map(e=>e.name));const e="local"===this._activeTab?ai:ni;if(!this._searchQuery)return e;const t=this._searchQuery.toLowerCase();return e.filter(e=>e.name.toLowerCase().includes(t)||e.category.toLowerCase().includes(t))}_getFontIcon(e){switch(e.toLowerCase()){case"serif":default:return"mdi:format-font";case"sans-serif":return"mdi:format-text";case"monospace":return"mdi:code-tags";case"cursive":return"mdi:script-text"}}render(){return o.qy`
      <div class="mc-picker-row">
        <input
          type="text"
          class="input"
          .value=${this.value}
          placeholder=${(0,h.t)(396)}
          aria-label=${(0,h.t)(396)}
          @input=${this._onInputChange}
        />
        <button type="button" class="btn btn-secondary" @click=${this._openModal}>${(0,h.t)(147)}</button>
      </div>
      ${this._showModal?this._renderModal():o.s6}
    `}_setTab(e){this._activeTab=e,this._searchQuery=""}_renderModal(){const e=this._getFilteredFonts();return o.qy`
      ${(0,Ue.bU)((0,h.t)(891),()=>this._closeModal(),"m",o.qy`

          <div class="mc-picker-search">
            <div class="seg full" role="tablist" aria-label=${(0,h.t)(397)}>
              <button
                type="button"
                role="tab"
                aria-selected=${"local"===this._activeTab?"true":"false"}
                @click=${()=>this._setTab("local")}
              >
                <ha-icon icon="mdi:desktop-classic"></ha-icon>
                ${(0,h.t)(544)}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected=${"google"===this._activeTab?"true":"false"}
                @click=${()=>this._setTab("google")}
              >
                <ha-icon icon="mdi:google"></ha-icon>
                ${(0,h.t)(424)}
              </button>
            </div>
            ${(0,Ue.LW)((0,h.t)(873),this._searchQuery,e=>{this._searchQuery=e})}
          </div>

          ${this._selectedFont?this._renderPreview():o.s6}

          <div class="mc-picker-list" role="listbox" aria-label=${(0,h.t)(398)}>
            ${e.length>0?e.map(e=>this._renderFontItem(e)):o.qy`<div class="mc-picker-empty">${(0,h.t)(634)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,h.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave} ?disabled=${!this._selectedFont}>${(0,h.t)(860)}</button>
          </div>
      `)}
    `}_renderPreview(){return this._selectedFont?o.qy`
      <div class="mc-font-preview">
        <div class="mc-font-preview-text" style="font-family: ${this._selectedFont.family}">
          ${(0,h.t)(1051)}
        </div>
      </div>
    `:o.qy``}_renderFontItem(e){const t=this._selectedFont?.name===e.name;return o.qy`
      <button
        type="button"
        role="option"
        class="mc-picker-item"
        aria-selected=${t?"true":"false"}
        @click=${()=>this._selectFont(e)}
      >
        <span class="mc-picker-item-icon"><ha-icon icon=${this._getFontIcon(e.category)}></ha-icon></span>
        <span class="mc-picker-item-content">
          <span class="mc-picker-item-name" style="font-family: ${e.family}">${e.name}</span>
          <span class="mc-picker-item-meta">${e.category}</span>
        </span>
        <span class="chip">${e.isLocal?(0,h.t)(543):(0,h.t)(423)}</span>
      </button>
    `}};si.styles=[l.x,Xe.fz,Xe.Qx],oi([(0,n.MZ)({attribute:!1})],si.prototype,"hass",void 0),oi([(0,n.MZ)({type:String})],si.prototype,"value",void 0),oi([(0,n.wk)()],si.prototype,"_showModal",void 0),oi([(0,n.wk)()],si.prototype,"_searchQuery",void 0),oi([(0,n.wk)()],si.prototype,"_selectedFont",void 0),oi([(0,n.wk)()],si.prototype,"_activeTab",void 0),si=oi([(0,n.EM)("mc-font-picker")],si),i(7798),i(6796);var ri=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const li=[{value:"state",label:991},{value:"attribute",label:105},{value:"time",label:1088},{value:"template",label:1024}];let ci=class extends o.WF{render(){if(!this.condition)return o.qy``;const e=this.condition;return o.qy`
      <div class="cond">
        <div class="cond-head">
          <div class="select">
            <select
              class="input"
              aria-label=${(0,h.t)(224)}
              @change=${e=>this.onChange?.({type:e.target.value})}
            >
              ${li.map(t=>o.qy`<option value=${t.value} ?selected=${e.type===t.value}>${(0,h.t)(t.label)}</option>`)}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${(0,h.t)(791)}
            title=${(0,h.t)(791)}
            @click=${()=>this.onRemove?.()}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${this._renderFields(e)}
      </div>
    `}_textField(e,t,i,n="text"){return o.qy`
      <label class="field">
        <span class="field-head"><span class="lbl">${e}</span></span>
        <input
          class="input"
          type=${n}
          .value=${t||""}
          @input=${e=>i(e.target.value)}
        />
      </label>
    `}_renderFields(e){switch(e.type){case"state":case"attribute":{const t=!1!==e.use_module_entity,i=t?this.moduleEntity||e.entity||"":e.entity||"";return o.qy`
          ${this.moduleEntity?o.qy`
                <div class="switch-row">
                  <span class="txt">${(0,h.t)(1140)}</span>
                  <button
                    type="button"
                    class="switch"
                    role="switch"
                    aria-checked=${t?"true":"false"}
                    aria-label=${(0,h.t)(1140)}
                    @click=${()=>this.onChange?.({use_module_entity:!t})}
                  ></button>
                </div>
              `:o.s6}
          ${t&&this.moduleEntity?o.s6:o.qy`
                <div class="field">
                  <div class="field-head"><span class="lbl">${(0,h.t)(357)}</span></div>
                  <mc-entity-picker
                    .hass=${this.hass}
                    .value=${e.entity||""}
                    @value-changed=${e=>this.onChange?.({entity:e.detail.value})}
                  ></mc-entity-picker>
                </div>
              `}
          ${"attribute"===e.type?o.qy`
                <div class="field">
                  <div class="field-head"><span class="lbl">${(0,h.t)(105)}</span></div>
                  <mc-attribute-picker
                    .hass=${this.hass}
                    .value=${e.attribute||""}
                    .entityId=${i}
                    @value-changed=${e=>this.onChange?.({attribute:e.detail.value})}
                  ></mc-attribute-picker>
                </div>
              `:o.s6}
          <div class="two">
            ${this._textField((0,h.t)(372),e.state,e=>this.onChange?.({state:e}))}
            ${this._textField((0,h.t)(657),e.state_not,e=>this.onChange?.({state_not:e}))}
          </div>
        `}case"time":return o.qy`
          <div class="two">
            ${this._textField((0,h.t)(57),e.after,e=>this.onChange?.({after:e}),"time")}
            ${this._textField((0,h.t)(133),e.before,e=>this.onChange?.({before:e}),"time")}
          </div>
        `;case"template":return o.qy`
          <label class="field">
            <span class="field-head"><span class="lbl">${(0,h.t)(1024)}</span></span>
            <textarea
              class="input"
              rows="3"
              placeholder="{{ states('sensor.example') == 'on' }}"
              .value=${e.template||""}
              @input=${e=>this.onChange?.({template:e.target.value})}
            ></textarea>
          </label>
        `;default:return o.qy``}}};ci.styles=[l.x,o.AH`
      :host {
        display: block;
      }
      .cond-head .select {
        flex: 1;
      }
    `],ri([(0,n.MZ)({attribute:!1})],ci.prototype,"condition",void 0),ri([(0,n.MZ)({attribute:!1})],ci.prototype,"hass",void 0),ri([(0,n.MZ)({attribute:!1})],ci.prototype,"moduleEntity",void 0),ri([(0,n.MZ)({attribute:!1})],ci.prototype,"onChange",void 0),ri([(0,n.MZ)({attribute:!1})],ci.prototype,"onRemove",void 0),ci=ri([(0,n.EM)("mc-condition-row")],ci);var di=i(2641);const hi={rotate:568,translate:567,scale:569,opacity:566,filter:562,"box-shadow":563};function ui(e,t){return e.flatMap(e=>"fx"===e?[]:"glow"===e?[t?"filter":"box-shadow"]:[e])}var pi=i(187),mi=i(1235);let gi;var fi=i(9899),vi=i(4025),bi=i(5056),yi=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const _i=[{value:"always",label:66},{value:"entity_on",label:1173,entity:!0},{value:"state",label:1175,entity:!0},{value:"tap",label:678}],wi=[{value:"normal",label:655},{value:"reverse",label:831},{value:"alternate",label:64},{value:"alternate-reverse",label:65}],$i=["infinite","1","2","3","5"],ki="Light & colour",xi="cat-",Ci=e=>`${x.D8}${xi}${e}`,Si=e=>!(e.channels.includes("fx")||e.particles||e.ring||e.seasonal||"tap"===e.trigger),Mi=new Map,Ai=new WeakMap;let qi=class extends o.WF{constructor(){super(...arguments),this.animations=[],this.allowIcon=!1,this.allowLabel=!1,this.motionOnly=!1,this.moduleLabel="",this.defaultEntity="",this.requireTriggerEntity=!1,this.allowEntityColor=!1,this.entityColor="",this._custom=new Set,this._libVersion=0}connectedCallback(){super.connectedCallback(),this._unsubLibrary??=(0,R.T_)().subscribe(()=>{this._libVersion=(0,R.T_)().version}),this._catalogue||this.motionOnly||(gi??=i.e(494).then(()=>i(298)).then(e=>(0,mi.t)("magic-card-preset-catalogue.js",e),e=>{gi=void 0,console.warn("Magic Card: preset catalogue not loaded",e)})).then(e=>{e&&(this._catalogue=e.CATALOGUE)})}disconnectedCallback(){super.disconnectedCallback(),this._unsubLibrary?.(),this._unsubLibrary=void 0}willUpdate(e){e.has("hass")&&!this.motionOnly&&(0,R.T_)().ensure(this.hass)}_mine(){return"ready"===(0,R.T_)().status?(0,R.T_)().list():[]}_doc(e){if(!(0,x.Bl)(e))return;const t=(0,x._R)(e),i="ready"===(0,R.T_)().status?(0,R.T_)().get(t):void 0;if(i||!t.startsWith(xi))return i;const o=this._stored(t);if(o){if(!Ai.has(o)){const e=(0,x.H2)(o,{v2:"lenient"});Ai.set(o,e.ok?e.doc:void 0)}return Ai.get(o)}const n=this._catEntry(e);return n&&!Mi.has(n.id)&&Mi.set(n.id,n.build()),n&&Mi.get(n.id)}_stored(e){const t={};this.dispatchEvent(new CustomEvent("mc-card-bridge",{bubbles:!0,composed:!0,detail:t}));const i=t.sm?.getConfig(),o=(0,s.B)(i?.custom_animations).find(t=>t.id===e);return o||!i?.template||i.not_synced?.includes("custom_animations")||i.hidden_animations?.includes(e)?o:(0,s.B)(t.sm?.getState().templateAnimations).find(t=>t.id===e)}_catEntry(e){return this._catalogue?.find(t=>Ci(t.id)===e)}_pickPreset(e,t){const i=this.animations[e]?.preset??"",o=this.animations.map((i,o)=>o===e?(0,O.Ur)(i,t.value):i),n=this._catEntry(t.value);if(!n)return this._write(o),void((0,x.Bl)(t.value)&&!(0,x._R)(t.value).startsWith(xi)&&(0,bi.uw)((0,vi.d)(this),(0,x._R)(t.value)));(0,m.Z_)(this,n,o,e=>this._write(e)).then(e=>{e||(t.value=i)})}_catOptions(e,t){return(this._catalogue??[]).filter(t=>t.group===e).map(e=>o.qy`<option value=${Ci(e.id)} ?selected=${Ci(e.id)===t}>${e.name}</option>`)}_write(e){this.onChange?.(e)}_update(e,t){this._write(this.animations.map((i,o)=>o===e?t:i))}_patch(e,t){const i={...this.animations[e],...t};for(const[e,o]of Object.entries(t))void 0!==o&&""!==o||delete i[e];this._update(e,i)}_add(){const e=this.motionOnly?di.u7.find(Si)??di.u7[0]:di.u7[0];this._write([...this.animations,(0,O.x_)(e.id,(0,v.$)("anim"))])}_remove(e){this._write(this.animations.filter((t,i)=>i!==e))}_field(e,t,i){return o.qy`
      <div class="field">
        <div class="field-head">${i?o.qy`<label for=${i}>${e}</label>`:o.qy`<span class="lbl">${e}</span>`}</div>
        ${t}
      </div>
    `}_select(e,t,i,n){return o.qy`
      <div class="select">
        <select class="input" id=${e} @change=${e=>n(e.target.value)}>
          ${i.map(e=>o.qy`<option value=${e.value} ?selected=${e.value===t} ?disabled=${!!e.disabled}>${e.label}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    `}_cardDocs(){const e={};this.dispatchEvent(new CustomEvent("mc-card-bridge",{bubbles:!0,composed:!0,detail:e}));const t=new Set(this._mine().map(e=>e.id));return(0,s.B)(e.sm?.getConfig()?.custom_animations).map(e=>({id:String(e.id??""),name:String(e.name??e.id??"")})).filter(e=>e.id&&!e.id.startsWith(xi)&&!t.has(e.id))}_presetSelect(e,t,i){const n=this.motionOnly,a=n?[]:this._mine(),s=n?[]:this._cardDocs(),r=new Map,l=e=>e.trim().toLowerCase();for(const e of[...a.map(e=>e.name),...s.map(e=>e.name),...di.u7.map(e=>(0,Gt.t)(e.name))])r.set(l(e),(r.get(l(e))??0)+1);const c=(e,t)=>(r.get(l(e))??0)>1?(0,h.t)(1268,{name:e,id:t}):e,d=(0,x.Bl)(i)&&(0,x._R)(i).startsWith(xi),u=(0,di.e2)(i),p=(n?!!u&&Si(u):!!u)||!!this._catEntry(i)||!d&&!!this._doc(i)||(0,x.Bl)(i)&&s.some(e=>e.id===(0,x._R)(i)),m=n&&(u||(0,x.Bl)(i))?(0,h.t)(1267,{name:u?(0,Gt.t)(u.name):(0,x._R)(i)}):d?this._doc(i)?.name??(0,x._R)(i):(0,x.Bl)(i)?(0,h.t)(1240,{id:(0,x._R)(i)}):(0,h.t)(1241,{id:i});return o.qy`
      <div class="select">
        <select
          class="input"
          id=${e}
          @change=${e=>this._pickPreset(t,e.target)}
        >
          ${p?o.s6:o.qy`<option value=${i} selected>${m}</option>`}
          ${a.length?o.qy`<optgroup label=${(0,h.t)(607)}>
                ${a.map(e=>o.qy`<option value=${x.D8+e.id} ?selected=${x.D8+e.id===i}>${c(e.name,e.id)}</option>`)}
              </optgroup>`:o.s6}
          ${s.length?o.qy`<optgroup label=${(0,h.t)(1064)}>
                ${s.map(e=>o.qy`<option value=${x.D8+e.id} ?selected=${x.D8+e.id===i}>${c(e.name,e.id)}</option>`)}
              </optgroup>`:o.s6}
          ${di.id.filter(e=>!n||di.u7.some(t=>t.group===e&&Si(t))).map(e=>o.qy`<optgroup label=${(0,Gt.t)(di.Au[e])}>
              ${di.u7.filter(t=>t.group===e&&(!n||Si(t))).map(e=>o.qy`<option value=${e.id} ?selected=${e.id===i}>${(0,Gt.t)(e.name)}</option>`)}
              ${e!==ki||n?o.s6:this._catOptions(e,i)}
            </optgroup>`)}
          ${this._catalogue&&!n?[...new Set(this._catalogue.map(e=>e.group))].filter(e=>e!==ki).map(e=>o.qy`<optgroup label=${e}>${this._catOptions(e,i)}</optgroup>`):o.s6}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    `}_target(e,t,i="module"){const n=[{value:"module",label:this.moduleLabel||(0,h.t)(584)},{value:"icon",label:(0,h.t)(464)},...this.allowLabel?[{value:"label",label:(0,h.t)(500)}]:[]],a=n.some(e=>e.value===t.target)?t.target:i,s=t=>this._patch(e,{target:t});return o.qy`
      <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(1022)} @keydown=${e=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))return;e.preventDefault();const t=n.findIndex(e=>e.value===a),i=n["Home"===e.key?0:"End"===e.key?n.length-1:(t+("ArrowLeft"===e.key||"ArrowUp"===e.key?-1:1)+n.length)%n.length].value,o=e.currentTarget;s(i),requestAnimationFrame(()=>o.querySelector(`[data-val="${i}"]`)?.focus())}}>
        ${n.map(e=>{const t=e.value===a;return o.qy`<button
            type="button"
            role="radio"
            data-val=${e.value}
            aria-checked=${t?"true":"false"}
            tabindex=${t?"0":"-1"}
            @click=${()=>s(e.value)}
          >${e.label}</button>`})}
      </div>
    `}_repeat(e,t,i,o){const n=t.iterations??o??(0,di.e2)(t.preset)?.defaults.iterations??"infinite",a=this._custom.has(t.id)||!$i.includes(String(n)),s=[...$i.map(e=>({value:e,label:"infinite"===e?(0,h.t)(486):e})),{value:"custom",label:(0,h.t)(255)}];return this._field((0,h.t)(800),this._select(i,a?"custom":String(n),s,i=>{const o=new Set(this._custom);if("custom"===i)return o.add(t.id),this._custom=o,void("infinite"===n&&this._patch(e,{iterations:10}));o.delete(t.id),this._custom=o,this._patch(e,{iterations:"infinite"===i?"infinite":Number(i)})}),i)}_seasonalBlock(e,t,i,n){const a=e=>`an-${t}-${e}`,s=e.trigger??"always",r=n.seasonal,l=!!pi.GN[r??""],c=!1!==e.decorations,d="weather"===r?(0,h.t)(395):"daynight"===r?(0,h.t)(988):"";return o.qy`
      <div class="cond">
        <div class="cond-head">
          <span class="n">${(0,h.t)(89,{n:t+1})} <span class="sub">· ${(0,Gt.t)(n.name)}</span></span>
          <button type="button" class="icon-btn sm danger" aria-label=${(0,h.t)(284,{n:t+1})} title=${(0,h.t)(283)} @click=${()=>this._remove(t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${i?o.qy`<p class="help anim-note">${i}</p>`:o.s6}
        ${this._field((0,h.t)(766),this._presetSelect(a("preset"),t,e.preset),a("preset"))}
        ${d?o.qy`<p class="help">${d}</p>`:o.s6}
        ${this._play(t,e,s,a("play"))}
        <div class="two">
          ${this._field((0,h.t)(297),o.qy`<input
              class="input"
              id=${a("int")}
              type="number"
              min="0"
              max="100"
              step="5"
              .value=${String(e.intensity??n.defaults.intensity)}
              @input=${e=>{const i=e.target.value;this._patch(t,{intensity:""===i?void 0:Number(i)})}}
            />`,a("int"))}
          ${this._field((0,h.t)(1004),o.qy`<input
              class="input"
              id=${a("strength")}
              type="number"
              min="0"
              max="100"
              step="5"
              .value=${String(e.strength??100)}
              @input=${e=>{const i=e.target.value;this._patch(t,{strength:""===i?void 0:Number(i)})}}
            />`,a("strength"))}
        </div>
        ${l?o.qy`<div class="switch-row">
              <div class="txt">
                ${(0,h.t)(140)}
                <p class="help">${(0,h.t)(320)}</p>
              </div>
              <button
                type="button"
                class="switch"
                role="switch"
                aria-checked=${c?"true":"false"}
                aria-label=${(0,h.t)(140)}
                @click=${()=>this._patch(t,{decorations:!c&&void 0})}
              ></button>
            </div>`:o.s6}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm" @click=${()=>this._update(t,(0,O.Q2)(e))}>
            <ha-icon icon="mdi:restore"></ha-icon>${(0,h.t)(818)}
          </button>
        </div>
      </div>
    `}_block(e,t,i){if((0,x.Bl)(e.preset))return this._customBlock(e,t,i);const n=(0,di.e2)(e.preset);if(n?.seasonal)return this._seasonalBlock(e,t,i,n);const a=n?.defaults,s=e=>`an-${t}-${e}`,r=e.trigger??"always",l=e.iterations??a?.iterations??"infinite",c=this._custom.has(e.id)||!$i.includes(String(l)),d=e.easing??a?.easing??"ease",u=di.Z4.map(e=>({value:e.id,label:(0,Gt.t)(e.label)}));return di.Z4.some(e=>e.id===d)||u.push({value:d,label:d}),o.qy`
      <div class="cond">
        <div class="cond-head">
          <span class="n">${(0,h.t)(89,{n:t+1})} <span class="sub">· ${n?.name??e.preset}</span></span>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${(0,h.t)(284,{n:t+1})}
            title=${(0,h.t)(283)}
            @click=${()=>this._remove(t)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${i?o.qy`<p class="help anim-note">${i}</p>`:o.s6}
        ${this._field((0,h.t)(766),this._presetSelect(s("preset"),t,e.preset),s("preset"))}
        ${this.allowIcon?this._field((0,h.t)(1022),this._target(t,e)):o.s6}
        ${this._play(t,e,r,s("play"))}
        ${"state"===r?this._field((0,h.t)(996),o.qy`<input
                class="input"
                id=${s("state")}
                type="text"
                .value=${e.state||""}
                @input=${e=>this._patch(t,{state:e.target.value})}
              />`,s("state")):o.s6}
        ${this._field((0,h.t)(205),o.qy`<mc-color-picker
            .value=${e.color||""}
            .label=${(0,h.t)(88)}
            .allowEntity=${this.allowEntityColor}
            .entityColor=${this.entityColor}
            @value-changed=${e=>this._patch(t,{color:e.detail.value})}
          ></mc-color-picker>`)}
        ${n&&(0,di.cq)(n)?this._field((0,h.t)(1004),o.qy`<input
                class="input"
                id=${s("strength")}
                type="number"
                min="0"
                max="100"
                step="5"
                .value=${String(e.strength??100)}
                @input=${e=>{const i=e.target.value;this._patch(t,{strength:""===i?void 0:Number(i)})}}
              />`,s("strength")):o.s6}
        <div class="two">
          ${this._field((0,h.t)(326),this._time(t,"duration",e.duration??a?.duration,a?.duration))}
          ${this._field((0,h.t)(280),this._time(t,"delay",e.delay??a?.delay,a?.delay))}
        </div>
        <div class="two">
          ${this._field((0,h.t)(327),this._select(s("easing"),d,u,e=>this._patch(t,{easing:e})),s("easing"))}
          ${this._repeat(t,e,s("repeat"))}
        </div>
        ${c?this._field((0,h.t)(801),o.qy`<input
                class="input"
                id=${s("count")}
                type="number"
                min="1"
                step="1"
                .value=${"number"==typeof l?String(l):""}
                @input=${e=>{const i=Number(e.target.value);Number.isFinite(i)&&i>0&&this._patch(t,{iterations:i})}}
              />`,s("count")):o.s6}
        <div class="two">
          ${this._field((0,h.t)(305),this._select(s("dir"),e.direction??a?.direction??"normal",(0,h.tl)(wi),e=>this._patch(t,{direction:e})),s("dir"))}
          ${n?this._field((0,di.sf)(n,Gt.t),o.qy`<input
                  class="input"
                  id=${s("int")}
                  type="number"
                  min=${n.intensity.min}
                  max=${n.intensity.max}
                  step=${n.intensity.step??1}
                  .value=${String(e.intensity??n.defaults.intensity)}
                  @input=${e=>{const i=e.target.value;this._patch(t,{intensity:""===i?void 0:Number(i)})}}
                />`,s("int")):o.s6}
        </div>
        ${n?o.qy`<div class="foot">
              <button type="button" class="btn btn-text btn-sm" @click=${()=>this._update(t,(0,O.Q2)(e))}>
                <ha-icon icon="mdi:restore"></ha-icon>${(0,h.t)(818)}
              </button>
            </div>`:o.s6}
      </div>
    `}_number(e,t,i,n,a,s,r,l){return o.qy`<input
      class="input"
      id=${i}
      type="number"
      min=${s}
      max=${r}
      step=${l}
      placeholder=${a}
      .value=${void 0===n?"":String(n)}
      @input=${i=>{const o=i.target.value;this._patch(e,{[t]:""===o?void 0:Number(o)})}}
    />`}_missingHelp(){switch((0,R.T_)().status){case"unavailable":return(0,h.t)(659);case"ready":return(0,h.t)(658);default:return(0,h.t)(533)}}_keepCopy(e,t){const i=(0,R.T_)().get(e),n=i?(0,vi.d)(this):void 0;if(!i||!n)return o.s6;const a=(0,bi.av)(n.getConfig(),e),s=(0,bi.Wk)(i),r=s<1024?(0,h.t)(1284,{n:s}):(0,h.t)(1290,{size:(s/1024).toFixed(1)});return o.qy`<div class="switch-row">
      <div class="txt">
        <div class="field-head"><label for=${t}>${a?(0,h.t)(497,{size:r}):(0,h.t)(496,{size:r})}</label></div>
        <p class="help" id="${t}-help">${(0,h.t)(1183)}</p>
      </div>
      <button type="button" class="switch" id=${t} role="switch" aria-checked=${a?"true":"false"} aria-describedby="${t}-help"
        @click=${()=>{(0,bi.oS)(n,e,!a,!1),this.requestUpdate()}}></button>
    </div>`}_customBlock(e,t,i){const n=this._doc(e.preset),a=(0,x._R)(e.preset),s=e=>`an-${t}-${e}`,r=e.trigger??"always",l=o.qy`
      <div class="cond-head">
        <span class="n">${(0,h.t)(89,{n:t+1})} <span class="sub">· ${n?.name??a}</span></span>
        <button type="button" class="icon-btn sm danger" aria-label=${(0,h.t)(284,{n:t+1})} title=${(0,h.t)(283)} @click=${()=>this._remove(t)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${i?o.qy`<p class="help anim-note">${i}</p>`:o.s6}
      ${this._field((0,h.t)(766),this._presetSelect(s("preset"),t,e.preset),s("preset"))}
      ${this._keepCopy(a,s("keep"))}
    `;if(!n)return o.qy`<div class="cond">
        ${l}
        <p class="help">
          ${a.startsWith("quick-")?(0,h.t)(70):a.startsWith(xi)?(0,h.t)(16):this._missingHelp()}
        </p>
        ${this._play(t,e,r,s("play"))}
      </div>`;const c="particles"===n.kind||"path"===n.kind&&"particles"===n.path?.subject,d=n.particles?.preset?(0,di.e2)(n.particles.preset):void 0,u=e.easing??n.easing,p=di.Z4.map(e=>({value:e.id,label:(0,Gt.t)(e.label)}));di.Z4.some(e=>e.id===u)||p.push({value:u,label:u});const m=e.iterations??n.iterations,g=this._custom.has(e.id)||!$i.includes(String(m)),f=!c&&"sequence"!==n.kind,v="path"===n.kind?"icon"===n.path?.subject?"icon":"module":"icon"===n.target?"icon":"module";return o.qy`
      <div class="cond">
        ${l}
        ${this.allowIcon&&!c?this._field((0,h.t)(1022),this._target(t,e,v)):o.s6}
        ${this._play(t,e,r,s("play"))}
        ${n.clips?.length||n.bindings?.length?this._field((0,h.t)(365),o.qy`<mc-entity-picker
                .hass=${this.hass}
                .value=${e.entity||""}
                .label=${(0,h.t)(365)}
                .placeholder=${this.defaultEntity?(0,h.t)(588,{entity:this.defaultEntity}):"entity_id"}
                @value-changed=${e=>this._patch(t,{entity:e.detail.value})}
              ></mc-entity-picker>`):o.s6}
        ${"state"===r?this._field((0,h.t)(996),o.qy`<input
                class="input"
                id=${s("state")}
                type="text"
                .value=${e.state||""}
                @input=${e=>this._patch(t,{state:e.target.value})}
              />`,s("state")):o.s6}
        ${"sequence"===n.kind?o.s6:this._field((0,h.t)(205),o.qy`<mc-color-picker
                .value=${e.color||""}
                .label=${(0,h.t)(88)}
                .allowEntity=${this.allowEntityColor}
                .entityColor=${this.entityColor}
                @value-changed=${e=>this._patch(t,{color:e.detail.value})}
              ></mc-color-picker>`)}
        ${"sequence"===n.kind?o.s6:this._field((0,h.t)(1004),this._number(t,"strength",s("strength"),e.strength,String(100),0,100,5),s("strength"))}
        <div class="two">
          ${this._field((0,h.t)(326),this._time(t,"duration",e.duration,`${n.duration}s`))}
          ${this._field((0,h.t)(280),this._time(t,"delay",e.delay,"0s"))}
        </div>
        <div class="two">
          ${this._field((0,h.t)(327),this._select(s("easing"),u,p,e=>this._patch(t,{easing:e})),s("easing"))}
          ${this._repeat(t,e,s("repeat"),n.iterations)}
        </div>
        ${g?this._field((0,h.t)(801),o.qy`<input
                class="input"
                id=${s("count")}
                type="number"
                min="1"
                step="1"
                .value=${"number"==typeof m?String(m):""}
                @input=${e=>{const i=Number(e.target.value);Number.isFinite(i)&&i>0&&this._patch(t,{iterations:i})}}
              />`,s("count")):o.s6}
        <div class="two">
          ${this._field((0,h.t)(305),this._select(s("dir"),e.direction??n.direction??"normal",(0,h.tl)(wi),e=>this._patch(t,{direction:e})),s("dir"))}
          ${f?this._field((0,h.t)(69),this._number(t,"intensity",s("int"),e.intensity,"100",0,400,5),s("int")):d?this._field((0,di.sf)(d,Gt.t),this._number(t,"intensity",s("int"),e.intensity,String(n.particles?.intensity??d.defaults.intensity),d.intensity.min,d.intensity.max,d.intensity.step??1),s("int")):o.s6}
        </div>
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm" @click=${()=>this._update(t,(0,O.Q2)(e))}>
            <ha-icon icon="mdi:restore"></ha-icon>${(0,h.t)(817)}
          </button>
        </div>
      </div>
    `}_play(e,t,i,n){const a=!!(t.trigger_entity||!this.requireTriggerEntity&&this.defaultEntity),s=_i.filter(e=>!this.motionOnly||"tap"!==e.value||"tap"===i).map(e=>({...e,label:(0,h.t)(e.label),disabled:!!e.entity&&!a&&e.value!==i}));return o.qy`
      ${this._field((0,h.t)(363),o.qy`<mc-entity-picker
          .hass=${this.hass}
          .value=${t.trigger_entity||""}
          .label=${this.defaultEntity&&!this.requireTriggerEntity?(0,h.t)(588,{entity:this.defaultEntity}):(0,h.t)(363)}
          @value-changed=${t=>this._patch(e,{trigger_entity:t.detail.value})}
        ></mc-entity-picker>`)}
      ${this._field((0,h.t)(756),this._select(n,i,s,t=>this._patch(e,{trigger:t})),n)}
      ${!a&&"always"!==i&&_i.find(e=>e.value===i)?.entity?o.qy`<p class="help">${(0,h.t)(737)}</p>`:o.s6}
    `}_time(e,t,i,n){return o.qy`<mc-unit-field
      .value=${i??""}
      .label=${"duration"===t?(0,h.t)(326):(0,h.t)(280)}
      .units=${["s","ms"]}
      .placeholder=${(n??"0s").replace(/m?s$/,"")}
      @value-changed=${i=>this._patch(e,{[t]:i.detail.value})}
    ></mc-unit-field>`}render(){const e=function(e,t={}){const i=!1!==t.allowIcon,o=e=>(0,O._j)(e,i)?2:(0,O.Zq)(e,i)?1:0;return e.map((t,n)=>{const a=(0,di.e2)(t.preset);if(!a)return;const s=ui(a.channels,(0,O.Zq)(t,i));for(let r=n-1;r>=0;r--){const n=(0,di.e2)(e[r].preset);if(!n||o(e[r])!==o(t))continue;const l=ui(n.channels,(0,O.Zq)(e[r],i)).find(e=>s.includes(e));if(!l)continue;const c=a.channels.includes("glow")||n.channels.includes("glow"),d="filter"===l&&c?hi["box-shadow"]:hi[l];return{name:n.name,what:d}}})}(this.animations,{allowIcon:this.allowIcon}).map(e=>e?(0,Gt.t)(345,{name:(0,Gt.t)(e.name),what:(0,Gt.t)(e.what)}):void 0);return o.qy`
      <div class="list">
        ${this.animations.map((t,i)=>this._block(t,i,e[i]))}
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(34)}
          </button>
          ${this.motionOnly?o.s6:o.qy`<button type="button" class="btn btn-text btn-sm" @click=${e=>{(0,fi.uK)(e.currentTarget,this.hass,"animation")}}>${(0,h.t)(513)}</button>`}
        </div>
      </div>
    `}};qi.styles=[l.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .list {
        display: grid;
        gap: 12px;
      }
      .cond-head .n .sub {
        font-weight: 400;
        color: var(--mc-text-2);
      }
      .foot {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: 4px 8px;
      }
      a.btn {
        text-decoration: none;
      }
    `],yi([(0,n.MZ)({attribute:!1})],qi.prototype,"animations",void 0),yi([(0,n.MZ)({type:Boolean})],qi.prototype,"allowIcon",void 0),yi([(0,n.MZ)({type:Boolean})],qi.prototype,"allowLabel",void 0),yi([(0,n.MZ)({type:Boolean})],qi.prototype,"motionOnly",void 0),yi([(0,n.MZ)({type:String})],qi.prototype,"moduleLabel",void 0),yi([(0,n.MZ)({attribute:!1})],qi.prototype,"hass",void 0),yi([(0,n.MZ)({type:String})],qi.prototype,"defaultEntity",void 0),yi([(0,n.MZ)({type:Boolean})],qi.prototype,"requireTriggerEntity",void 0),yi([(0,n.MZ)({type:Boolean})],qi.prototype,"allowEntityColor",void 0),yi([(0,n.MZ)({type:String})],qi.prototype,"entityColor",void 0),yi([(0,n.MZ)({attribute:!1})],qi.prototype,"onChange",void 0),yi([(0,n.wk)()],qi.prototype,"_custom",void 0),yi([(0,n.wk)()],qi.prototype,"_libVersion",void 0),yi([(0,n.wk)()],qi.prototype,"_catalogue",void 0),qi=yi([(0,n.EM)("mc-animation-list")],qi);var Ei=i(170),Ti=i(2928),Li=i(1476),zi=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const ji=[{value:"off",label:674},{value:"value",label:1151},{value:"animated",label:80}],Ri=[{value:"snake",label:969},{value:"pulse",label:777},{value:"full",label:407},{value:"dots",label:185},{value:"dashes",label:557}],Oi=[{value:"top",label:1098},{value:"top-right",label:1100},{value:"right",label:833},{value:"bottom-right",label:144},{value:"bottom",label:142},{value:"bottom-left",label:143},{value:"left",label:511},{value:"top-left",label:1099}],Pi=[{value:"cw",label:196},{value:"ccw",label:250}],Hi=[{value:"round",label:839},{value:"butt",label:391}],Di=[{value:"inside",label:490},{value:"center",label:182},{value:"outside",label:702}],Ii=[{value:"number",label:670},{value:"entity",label:357}],Fi=[{value:"remaining",label:788},{value:"elapsed",label:342}],Vi=[{value:"always",label:66},{value:"entity_on",label:1173,entity:!0},{value:"state",label:1175,entity:!0}];let Ni=class extends o.WF{constructor(){super(...arguments),this.defaultEntity="",this.requireEntity=!1,this.clipped=!1,this.allowEntityColor=!1,this.entityColor="",this._entityBound={}}get _r(){return this.ring&&"object"==typeof this.ring?this.ring:{}}_emit(e){this._emitted=JSON.stringify(e??null),this.onChange?.(e)}_set(e){const t={...this._r,...e};for(const[e,i]of Object.entries(t))(void 0===i||""===i||"number"==typeof i&&Number.isNaN(i))&&delete t[e];this._emit(t)}_mode(e){"off"===e?this._emit(void 0):this._set({mode:e})}willUpdate(e){e.has("ring")&&JSON.stringify(this.ring??null)!==this._emitted&&(this._entityBound={})}_field(e,t,i,n,a){const s=void 0!==t&&void 0!==this._r[t]&&""!==this._r[t];return o.qy`
      <div class="field">
        <div class="field-head">
          ${n?o.qy`<label for=${n}>${e}</label>`:o.qy`<span class="lbl">${e}</span>`}
          ${t?(0,Yt.i)(e,s,a??(()=>this._set({[t]:void 0}))):o.s6}
        </div>
        ${i}
      </div>
    `}_seg(e,t,i,n){return o.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const o=i.findIndex(e=>e.value===t),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const s=i[(o+a[e.key]+i.length)%i.length].value,r=e.currentTarget;n(s),requestAnimationFrame(()=>r.querySelector(`[data-val="${s}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return o.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>n(e.value)}
        >${(0,h.t)(e.label)}</button>`})}
    </div>`}_select(e,t,i,n){return o.qy`<div class="select">
      <select class="input" id=${e} @change=${e=>n(e.target.value)}>
        ${i.map(e=>o.qy`<option value=${e.value} ?selected=${e.value===t} ?disabled=${!!e.disabled}>${(0,h.t)(e.label)}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`}_number(e,t,i,n,a,s=1){const r=this._r[t];return o.qy`<input
      class="input"
      id=${e}
      type="number"
      min=${n??o.s6}
      max=${a??o.s6}
      step=${s}
      placeholder=${String(i)}
      .value=${void 0===r?"":String(r)}
      @input=${e=>{const i=e.target.value,o=Number(i);""!==i.trim()&&Number.isFinite(o)&&this._set({[t]:o})}}
      @change=${e=>{const i=e.target;""!==i.value.trim()||i.validity?.badInput||this._set({[t]:void 0})}}
    />`}_time(e,t,i){return o.qy`<mc-unit-field
      .value=${this._r[e]||""}
      .label=${t}
      .units=${["s","ms"]}
      .placeholder=${i.replace(/m?s$/,"")}
      @value-changed=${t=>this._set({[e]:t.detail.value})}
    ></mc-unit-field>`}_color(e,t){return o.qy`<mc-color-picker
      .value=${this._r[e]||""}
      .label=${t}
      .allowEntity=${this.allowEntityColor}
      .entityColor=${this.entityColor}
      .gradient=${"color"===e?"linear":""}
      @value-changed=${t=>this._set({[e]:t.detail.value})}
    ></mc-color-picker>`}_entity(e,t,i){return o.qy`<mc-entity-picker
      .hass=${this.hass}
      .value=${this._r[e]||""}
      .label=${i}
      @value-changed=${t=>this._set({[e]:t.detail.value})}
    ></mc-entity-picker>`}_bound(e,t){const i=this._r[e],n="object"==typeof i&&null!==i?i:void 0,a=n||this._entityBound[e]?"entity":"number",s=t=>this._set({[e]:t}),r=`ring-${e}`,l=n?.entity||"",c=!!l&&Object.keys(this.hass?.states[l]?.attributes||{}).length>0;return this._field(t,e,o.qy`${this._seg((0,h.t)(1244,{label:t}),a,Ii,t=>{this._entityBound={...this._entityBound,[e]:"entity"===t},"entity"===t!=!!n&&this._set({[e]:void 0})})}
        ${"number"===a?this._number(r,e,Ei.Y4[e],void 0,void 0,.1):o.qy`<mc-entity-picker
                .hass=${this.hass}
                .value=${l}
                .label=${(0,h.t)(1243,{label:t})}
                @value-changed=${e=>s(e.detail.value?{entity:e.detail.value}:void 0)}
              ></mc-entity-picker>
              ${c?o.qy`<mc-attribute-picker
                    .hass=${this.hass}
                    .entityId=${l}
                    .value=${n?.attribute||""}
                    @value-changed=${e=>s(e.detail.value?{entity:l,attribute:e.detail.value}:{entity:l})}
                  ></mc-attribute-picker>`:o.s6}`}`,"number"===a?r:void 0,()=>{this._entityBound={...this._entityBound,[e]:!1},s(void 0)})}_value(){const e=this._r,t=e.entity||this.defaultEntity,i=(0,Li._7)(t)&&!e.attribute,n=(e,t)=>"number"==typeof e?e:t;return o.qy`
      ${this._field((0,h.t)(357),"entity",this._entity("entity",(0,h.t)(357),this.defaultEntity?(0,h.t)(588,{entity:this.defaultEntity}):(0,h.t)(357)))}
      ${t?o.s6:o.qy`<p class="help">${(0,h.t)(736)}</p>`}
      ${!i&&t&&this.hass?.states[t]&&Object.keys(this.hass.states[t].attributes||{}).length?this._field((0,h.t)(105),"attribute",o.qy`<mc-attribute-picker
              .hass=${this.hass}
              .entityId=${t}
              .value=${e.attribute||""}
              @value-changed=${e=>this._set({attribute:e.detail.value})}
            ></mc-attribute-picker>`):o.s6}
      ${i?this._field((0,h.t)(1090),"timer_fill",o.qy`${this._seg((0,h.t)(1090),e.timer_fill??"remaining",Fi,e=>this._set({timer_fill:"remaining"===e?void 0:e}))}
              <p class="help">${(0,h.t)(582)}</p>`):o.qy`<div class=${"object"==typeof e.min||"object"==typeof e.max||this._entityBound.min||this._entityBound.max?"bounds":"two"}>
            ${this._bound("min",(0,h.t)(580))} ${this._bound("max",(0,h.t)(569))}
          </div>`}
      ${this._field((0,h.t)(385),"transition",this._time("transition",(0,h.t)(385),Ei.Y4.transition))}
      ${(0,Ti._)((0,h.t)(1081),e.thresholds,e=>this._set({thresholds:e}),{min:i?0:n(e.min,Ei.Y4.min),max:i?100:n(e.max,Ei.Y4.max),help:i?(0,h.t)(836):(0,h.t)(837)})}
    `}_animated(){const e=this._r.animation??Ei.Y4.animation;return o.qy`
      ${this._field((0,h.t)(87),"animation",this._select("ring-anim",e,Ri,e=>this._set({animation:e})),"ring-anim")}
      <div class="two">
        ${"snake"===e?this._field((0,h.t)(512),"length",this._number("ring-len","length",Ei.Y4.length,1,99),"ring-len"):o.s6}
        ${"full"===e?o.s6:this._field((0,h.t)(981),"speed",this._time("speed",(0,h.t)(981),Ei.Y4.speed))}
      </div>
    `}_position(){const e=e=>this._set({position:e}),t=this._r.position??Ei.Y4.position;if(!this.clipped)return this._field((0,h.t)(763),"position",this._seg((0,h.t)(763),t,Di,e));const i=Di.filter(e=>"outside"!==e.value);return this._field((0,h.t)(763),"position",o.qy`${this._seg((0,h.t)(763),"outside"===t?"inside":t,i,e)}
        <p class="help">${(0,h.t)(1039)}</p>`)}_show(){const e=this._r,t=e.trigger||"always",i=!!(e.trigger_entity||!this.requireEntity&&this.defaultEntity),n=Vi.map(e=>({...e,disabled:!!e.entity&&!i&&e.value!==t}));return o.qy`
      ${this._field((0,h.t)(364),"trigger_entity",this._entity("trigger_entity",(0,h.t)(364),this.defaultEntity&&!this.requireEntity?(0,h.t)(588,{entity:this.defaultEntity}):(0,h.t)(364)))}
      ${this._field((0,h.t)(916),"trigger",this._select("ring-show",t,n,e=>this._set({trigger:"always"===e?void 0:e})),"ring-show")}
      ${i||"always"===t?o.s6:o.qy`<p class="help">${(0,h.t)(738)}</p>`}
      ${"state"===t?this._field((0,h.t)(996),"state",o.qy`<input class="input" id="ring-state" type="text" .value=${e.state||""} @input=${e=>this._set({state:e.target.value})} />`,"ring-state"):o.s6}
    `}render(){const e=this._r,t="value"===e.mode||"animated"===e.mode?e.mode:"off";return o.qy`
      <div class="ring-ed">
        ${this._field((0,h.t)(583),void 0,this._seg((0,h.t)(838),t,ji,e=>this._mode(e)))}
        ${"off"===t?o.s6:o.qy`
              ${"value"===t?this._value():this._animated()}
              <div class="two">
                ${this._field((0,h.t)(1179),"width",this._number("ring-width","width",Ei.Y4.width,.5,40,.5),"ring-width")}
                ${this._field((0,h.t)(420),"glow",this._number("ring-glow","glow",0,0,40),"ring-glow")}
              </div>
              ${this._field((0,h.t)(205),"color",this._color("color",(0,h.t)(835)))}
              ${this._field((0,h.t)(1101),"track_color",this._color("track_color",(0,h.t)(1101)))}
              ${this._field((0,h.t)(1102),"track_opacity",this._number("ring-track-op","track_opacity",100,0,100,5),"ring-track-op")}
              ${this._field((0,h.t)(989),"start",this._select("ring-start",e.start??Ei.Y4.start,Oi,e=>this._set({start:e})),"ring-start")}
              ${this._field((0,h.t)(305),"direction",this._seg((0,h.t)(305),e.direction??"cw",Pi,e=>this._set({direction:e})))}
              ${this._field((0,h.t)(166),"linecap",this._seg((0,h.t)(166),e.linecap??"round",Hi,e=>this._set({linecap:e})))}
              ${this._position()}
              ${this._show()}
            `}
      </div>
    `}};Ni.styles=[l.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .ring-ed,
      .bounds {
        display: grid;
        gap: 16px;
      }
    `],zi([(0,n.MZ)({attribute:!1})],Ni.prototype,"ring",void 0),zi([(0,n.MZ)({attribute:!1})],Ni.prototype,"hass",void 0),zi([(0,n.MZ)({type:String})],Ni.prototype,"defaultEntity",void 0),zi([(0,n.MZ)({type:Boolean})],Ni.prototype,"requireEntity",void 0),zi([(0,n.MZ)({type:Boolean})],Ni.prototype,"clipped",void 0),zi([(0,n.MZ)({type:Boolean})],Ni.prototype,"allowEntityColor",void 0),zi([(0,n.MZ)({type:String})],Ni.prototype,"entityColor",void 0),zi([(0,n.MZ)({attribute:!1})],Ni.prototype,"onChange",void 0),zi([(0,n.wk)()],Ni.prototype,"_entityBound",void 0),Ni=zi([(0,n.EM)("mc-ring-editor")],Ni);var Zi=i(2061),Bi=i(3034),Wi=i(5047),Ki=i(7503);function Ui(e,t,i){const{custom_shapes:o,...n}=t;if(i(n),o&&Object.keys(o).length&&e&&!1!==e.attached){const t=e.getConfig();e.updateConfig({...t,custom_shapes:{...t.custom_shapes??{},...o}},!1)}}var Gi=i(9639);const Yi=e=>"card"===e?(0,h.t)(1233):"row"===e?(0,h.t)(1236):"column"===e?(0,h.t)(1234):(0,h.t)(1235);var Qi=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const Ji=[{kind:"none",label:654,options:[]},{kind:"squircle",label:985,options:["corner","smoothing"]},{kind:"pill",label:750,options:[]},{kind:"circle",label:187,options:[]},{kind:"hexagon",label:439,options:["corner"]},{kind:"octagon",label:673,options:["corner"]},{kind:"notch",label:663,options:["corner"]},{kind:"ticket",label:1082,options:["corner"]},{kind:"wave",label:1164,options:["edge","amplitude","waves","animate"]},{kind:"blob",label:138,options:["seed","wobble","animate"]},{kind:"custom",label:255,options:[]}],Xi=["squircle","pill","circle","hexagon","octagon","notch"],eo=["ticket","wave","blob"],to=[[840,["squircle","pill","circle"]],[266,["hexagon","octagon","notch","ticket"]],[699,["wave","blob"]],[1195,["custom"]]],io=[{value:"top",label:1098},{value:"right",label:833},{value:"bottom",label:142},{value:"left",label:511},{value:"all",label:62}],oo=["px","%"],no={squircle:"50",notch:String(Gi.JM.corner),ticket:String(Gi.JM.corner),hexagon:"auto",octagon:"auto"},ao={squircle:244,notch:267,ticket:268,hexagon:962,octagon:962},so=new Map,ro=.35,lo={notch:{corner:Gi.JM.corner*ro},ticket:{corner:Gi.JM.corner*ro},wave:{amplitude:Gi.JM.amplitude*ro}};function co(e){if("string"==typeof e&&e.trim().endsWith("%"))return e;const t="number"==typeof e?e:parseFloat(String(e));return Number.isFinite(t)?t*ro:void 0}const ho=e=>{const t=1+Math.floor(9999*Math.random());return String(t)===String(e)?t%9999+1:t};let uo=class extends o.WF{constructor(){super(...arguments),this.explicitNone=!1,this.target="module",this.hasRadius=!1,this.hasShadow=!1,this.popup=!1,this.label="",this._source="presets",this._opening="",this._status="",this._onLibraryChanged=e=>{const t=e.detail?.kind;void 0!==t&&"shapes"!==t||this._relist()}}async _relist(){if(!this.hass)return;const e=await(0,g.k4)(this.hass);this.isConnected&&(this._lib=e)}connectedCallback(){super.connectedCallback(),window.addEventListener(Zi.S8,this._onLibraryChanged)}disconnectedCallback(){window.removeEventListener(Zi.S8,this._onLibraryChanged),super.disconnectedCallback()}get _kind(){const e=this.shape;return Ji.some(t=>t.kind===e)?e:"none"}get _opts(){return this.options&&"object"==typeof this.options?this.options:{}}_clean(e,t){const i=Ji.find(t=>t.kind===e)?.options??[],o={};for(const e of i){const i=t[e];void 0===i||""===i||"number"==typeof i&&Number.isNaN(i)||(o[e]=i)}return Object.keys(o).length?o:void 0}_pick(e){if("custom"===e)return"custom"!==this._kind&&this._open(),void this.requestUpdate();"none"!==e?this.onChange?.({shape:e,shape_options:this._clean(e,this._opts)}):this.onChange?.({shape:this.explicitNone?"none":void 0,shape_options:void 0})}_set(e){const t=this._kind;"none"!==t&&this.onChange?.({shape:t,shape_options:this._clean(t,{...this._opts,...e})})}_picker(e){const t=t=>o.qy`<option value=${t.kind} ?selected=${t.kind===e}>${(0,h.t)(t.label)}</option>`,i="none"===e||"custom"===e?"":function(e,t){const i=`${e}|${JSON.stringify(t)}`;let o=so.get(i);return void 0===o&&(o=(0,Gi.j9)(e,40,28,function(e,t){const i={...lo[e],...t,animate:!1};for(const e of["corner","amplitude"])void 0!==t[e]&&(i[e]=co(t[e]));return i}(e,t))?.d??"",so.size>64&&so.clear(),so.set(i,o)),o}(e,this._opts);return o.qy`<div class="pick">
      <div class="select">
        <select class="input" id="shape-kind" data-focus-key="shape-entry" aria-label=${(0,h.t)(907)} @change=${e=>this._pick(e.target.value)}>
          ${t(Ji[0])}
          ${to.map(([e,i])=>((e,i)=>o.qy`<optgroup label=${(0,h.t)(e)}>${i.map(e=>t(Ji.find(t=>t.kind===e)))}</optgroup>`)(e,i))}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
      <svg class="preview" viewBox="-8 -6 ${56} ${40}" aria-hidden="true">
        ${"none"===e?o.JW`<path class="none-mark" d="M2 2H38V26H2Z"></path>`:"custom"===e?o.JW`<path d="M10 2H38V18L30 26H2V10Z"></path>`:o.JW`<path d=${i}></path>`}
      </svg>
    </div>`}_field(e,t,i,n,a){const s=t?this._opts[t]:void 0,r=void 0!==s&&""!==s;return o.qy`
      <div class="field">
        <div class="field-head">
          ${n?o.qy`<label for=${n}>${e}</label>`:o.qy`<span class="lbl">${e}</span>`}
          ${t?(0,Yt.i)(e,r,()=>this._set({[t]:void 0})):o.s6}
        </div>
        ${i}
        ${a?o.qy`<p class="help">${a}</p>`:o.s6}
      </div>
    `}_length(e,t,i){const n=this._opts[e];return o.qy`<mc-unit-field
      .value=${void 0===n?"":n}
      .label=${t}
      .units=${oo}
      .noCustom=${!0}
      .placeholder=${i}
      .inputId=${`shape-${e}`}
      @value-changed=${t=>this._set({[e]:t.detail.value||void 0})}
    ></mc-unit-field>`}_number(e,t,i,n,a=1){const s=this._opts[e];return o.qy`<input
      class="input"
      id=${`shape-${e}`}
      type="number"
      min=${i??o.s6}
      max=${n??o.s6}
      step=${a}
      placeholder=${String(t)}
      .value=${void 0===s?"":String(s)}
      @input=${t=>{const i=t.target.value,o=Number(i);""!==i.trim()&&Number.isFinite(o)&&this._set({[e]:o})}}
      @change=${t=>{const i=t.target;""!==i.value.trim()||i.validity?.badInput||this._set({[e]:void 0})}}
    />`}_animate(e){const t=!0===this._opts.animate;return o.qy`<div class="switch-row">
      <div class="txt">
        <div class="field-head">
          <span class="lbl">${(0,h.t)(79)}</span>
          ${(0,Yt.i)((0,h.t)(79),void 0!==this._opts.animate,()=>this._set({animate:void 0}))}
        </div>
        <p class="help">${"wave"===e?(0,h.t)(1058):(0,h.t)(1038)} ${(0,h.t)(726)}</p>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${t?"true":"false"}
        aria-label=${(0,h.t)(79)}
        @click=${()=>this._set({animate:!t||void 0})}
      ></button>
    </div>`}_edge(){const e=this._opts.edge??"bottom";return o.qy`<div class="seg full" role="radiogroup" aria-label=${(0,h.t)(1165)} @keydown=${t=>{const i=io.findIndex(t=>t.value===e),o={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(t.key in o))return;t.preventDefault();const n=io[(i+o[t.key]+io.length)%io.length].value,a=t.currentTarget;this._set({edge:n}),requestAnimationFrame(()=>a.querySelector(`[data-val="${n}"]`)?.focus())}}>
      ${io.map(t=>{const i=t.value===e;return o.qy`<button
          type="button"
          role="radio"
          data-val=${t.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>this._set({edge:t.value})}
        >${(0,h.t)(t.label)}</button>`})}
    </div>`}_options(e){const t=(0,h.t)(484);switch(e){case"squircle":return o.qy`<div class="two">
          ${this._field((0,h.t)(244),"corner",this._length("corner",(0,h.t)(244),no.squircle),void 0,t)}
          ${this._field((0,h.t)(968),"smoothing",this._number("smoothing",Gi.JM.smoothing,0,1,.05),"shape-smoothing",(0,h.t)(7))}
        </div>`;case"hexagon":case"octagon":case"notch":case"ticket":return this._field((0,h.t)(ao[e]),"corner",this._length("corner",(0,h.t)(ao[e]),no[e]),void 0,t);case"wave":return o.qy`
          ${this._field((0,h.t)(330),"edge",this._edge())}
          <div class="two">
            ${this._field((0,h.t)(1166),"amplitude",this._length("amplitude",(0,h.t)(1166),String(Gi.JM.amplitude)),void 0,t)}
            ${this._field((0,h.t)(1167),"waves",this._number("waves",Gi.JM.waves,1,50),"shape-waves")}
          </div>
          ${this._animate(e)}
        `;case"blob":return o.qy`
          <div class="two">
            ${this._field((0,h.t)(886),"seed",o.qy`<div class="seed">
                ${this._number("seed",Gi.JM.seed,0,void 0,1)}
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  title=${(0,h.t)(739)}
                  @click=${()=>this._set({seed:ho(this._opts.seed??Gi.JM.seed)})}
                >
                  <ha-icon icon="mdi:dice-5-outline"></ha-icon>${(0,h.t)(961)}
                </button>
              </div>`,"shape-seed")}
            ${this._field((0,h.t)(1186),"wobble",this._number("wobble",Gi.JM.wobble,0,1,.05),"shape-wobble",(0,h.t)(5))}
          </div>
          ${this._animate(e)}
        `;default:return o.s6}}_copies(){return(0,vi.d)(this)?.getConfig().custom_shapes??{}}async _open(e){if("loading"===this._opening)return;this._opening="loading";const t=this._kind,i=await async function(e){if(!await(0,Ki.RX)())return"failed";const t=(0,vi.d)(e.from),i=await(0,g.Zz)(e.hass);let o=t?.getConfig().custom_shapes;if("ok"===i.state){const e=function(e,t){const i={...e??{}};let o=!1;for(const e of t){const t=i[e.id];void 0!==t&&JSON.stringify(t)!==JSON.stringify(e.shape)&&(i[e.id]=e.shape,o=!0)}return{copies:i,changed:o}}(o,i.items);e.changed&&t&&!1!==t.attached&&t.updateConfig({...t.getConfig(),custom_shapes:e.copies},!1),o=e.changed?e.copies:o}const n=document.createElement(Bi.zh);n.hass=e.hass,n.value=e.value,n.customShapes=o,n.libraryAvailable="ok"===i.state,n.preset=e.preset,n.label=e.label;let a=()=>{};return n.addEventListener("mc-shape-change",i=>{const o=i.detail;o.commit&&Ui(t,{shape:"custom",shape_options:o.value.shape_options,...o.customShapes?{custom_shapes:o.customShapes}:{}},t=>e.apply(t))}),n.addEventListener("mc-shape-close",e=>{var t;a(),e.detail?.done&&(t=(0,h.t)(908),document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:t}})))}),a=(0,Wi.c)(n,{from:e.from,key:"shape-entry"}),"opened"}({from:this,hass:this.hass,label:this.label||Yi(this.target),value:"custom"===t?{shape:"custom",shape_options:this._opts}:void 0,preset:e,apply:e=>{this.onChange?.(e),this._relist()}});this._opening="failed"===i?"failed":""}_write(e){Ui((0,vi.d)(this),e,e=>this.onChange?.(e))}_use(e,t){this._write(t?{shape:"custom",shape_options:{...e.shape}}:{shape:"custom",shape_options:{ref:e.id},custom_shapes:{[e.id]:e.shape}}),this._status=t?(0,h.t)(1148,{name:e.name}):(0,h.t)(1149,{name:e.name})}_detach(){const e=this._opts.ref;if(!e)return;const t=this._lib?.items.find(t=>t.id===e)?.shape??this._copies()[e];t&&(this._write({shape:"custom",shape_options:{...t}}),this._status=(0,h.t)(1066))}async _saveAs(){const e=this._saving;if(!e||e.busy)return;const t=e.name.trim();if(!t)return void(this._saving={...e,error:(0,h.t)(416)});if(t.length>80)return void(this._saving={...e,error:(0,h.t)(1132)});this._saving={...e,busy:!0,error:void 0};const i=new Set((this._lib?.items??[]).map(e=>e.id)),o={...this._opts};delete o.ref;const n=await(0,g.VC)(this.hass,{id:(0,g.wQ)((0,g.yR)(t,"shape"),i),name:t,shape:o});if(n.shape)return this._saving=void 0,this._status=(0,h.t)(864,{name:n.shape.name}),void(this._lib=await(0,g.Zz)(this.hass));const a={readonly:(0,h.t)(1194),full:(0,h.t)(1048),invalid:(0,h.t)(1076),unreachable:(0,h.t)(246)}[n.error??"unreachable"];this._saving={...e,busy:!1,error:a}}_sourceChips(){if("ok"!==this._lib?.state)return o.s6;const e=(e,t)=>o.qy`<button type="button" role="radio" aria-checked=${this._source===e?"true":"false"} @click=${()=>this._source=e}>${t}</button>`;return o.qy`<div class="seg full" role="radiogroup" aria-label=${(0,h.t)(909)}>${e("presets",(0,h.t)(767))}${e("mine",(0,h.t)(611,{n:this._lib.items.length}))}</div>`}_mine(){const e=this._lib?.items??[];return e.length?o.qy`<ul class="mine" aria-label=${(0,h.t)(610)}>
      ${e.map(e=>o.qy`<li>
          <span class="nm">${e.name}</span>
          <button type="button" class="btn btn-secondary btn-sm" aria-label=${(0,h.t)(1144,{name:e.name})} @click=${()=>this._use(e,!1)}>${(0,h.t)(1123)}</button>
          <button type="button" class="btn btn-text btn-sm" aria-label=${(0,h.t)(1128,{name:e.name})} @click=${()=>this._use(e,!0)}>${(0,h.t)(1131)}</button>
        </li>`)}
    </ul>
    <p class="help">${(0,h.t)(1139)}</p>`:o.qy`<div class="mine-empty"><p class="help">${(0,h.t)(647)}</p>
        <button type="button" class="btn btn-secondary btn-sm" data-focus-key="shape-entry" @click=${()=>{this._open()}}>${(0,h.t)(553)}</button></div>`}_openButton(e,t){const i="loading"===this._opening;return o.qy`<button type="button" class="btn btn-secondary btn-sm" data-focus-key="shape-entry" aria-busy=${i?"true":"false"} @click=${t}>
      ${e}${i?o.qy`<span class="sr-only"> ${(0,h.t)(532)}</span>`:o.s6}
    </button>`}_actions(e){if("none"===e)return o.s6;const t=[];if("custom"===e){const e=this._opts.ref;if(t.push(this._openButton((0,h.t)(335),()=>{this._open()})),e)t.push(o.qy`<button type="button" class="btn btn-text btn-sm" @click=${()=>this._detach()}>${(0,h.t)(1131)}</button>`);else if(this._lib){const e="ok"!==this._lib.state;t.push(o.qy`<button type="button" class="btn btn-text btn-sm" aria-disabled=${e?"true":"false"} aria-describedby=${e?"shape-lib-hint":o.s6}
            @click=${()=>e?void 0:this._saving={name:(0,h.t)(262)}}>${(0,h.t)(861)}</button>`)}}else Xi.includes(e)&&t.push(this._openButton((0,h.t)(332),()=>{this._open({shape:e,shape_options:this._opts})}));const i=[];if(eo.includes(e)&&i.push(o.qy`<p class="help">${(0,h.t)(1083)}</p>`),"custom"===e&&this._opts.ref){const e=this._lib?.items.find(e=>e.id===this._opts.ref)?.name??this._opts.ref;i.push(o.qy`<p class="help">${(0,h.t)(523,{name:e})}</p>`)}return"custom"===e&&!this._opts.ref&&this._lib&&"ok"!==this._lib.state&&i.push(o.qy`<p class="help" id="shape-lib-hint">${(0,h.t)(499)}</p>`),"failed"===this._opening&&i.push(o.qy`<p class="help error" role="alert">${(0,h.t)(1053)}</p>`),o.qy`<div class="shape-actions">${t}</div>${i}${this._saveForm()}`}_saveForm(){const e=this._saving;return e?o.qy`<form class="save-form" @submit=${e=>{e.preventDefault(),this._saveAs()}}>
      <label for="shape-save-name">${(0,h.t)(612)}</label>
      <input class="input" id="shape-save-name" .value=${e.name} maxlength="80" aria-invalid=${e.error?"true":"false"} aria-describedby=${e.error?"shape-save-err":o.s6}
        @input=${t=>this._saving={...e,name:t.target.value,error:void 0}}
        @keydown=${e=>{"Escape"===e.key&&(e.stopPropagation(),this._saving=void 0)}} />
      ${e.error?o.qy`<p class="help error" id="shape-save-err" role="alert">${e.error}</p>`:o.s6}
      <div class="shape-actions">
        <button type="submit" class="btn btn-primary btn-sm" ?disabled=${e.busy}>${(0,h.t)(860)}</button>
        <button type="button" class="btn btn-text btn-sm" @click=${()=>this._saving=void 0}>${(0,h.t)(162)}</button>
      </div>
    </form>`:o.s6}willUpdate(){this.hass&&this._listed!==this.hass&&(this._listed=this.hass,(0,g.Zz)(this.hass).then(e=>this._lib=e))}_hints(e){if("none"===e)return o.s6;const t=[];return this.hasRadius&&t.push((0,h.t)(1054)),this.hasShadow&&t.push((0,h.t)(146)),"module"===this.target&&t.push((0,h.t)(1052)),"card"===this.target&&this.popup&&t.push((0,h.t)(74)),t.length?o.qy`<div class="hints">${t.map(e=>o.qy`<p class="help">${e}</p>`)}</div>`:o.s6}updated(){const e=this.renderRoot.querySelector("select#shape-kind");e&&e.value!==this._kind&&(e.value=this._kind)}render(){const e=this._kind;return o.qy`
      <div class="shape-ed">
        ${this._sourceChips()}
        ${"mine"===this._source&&"ok"===this._lib?.state?this._mine():o.qy`${this._picker(e)}${this._actions(e)}${this._hints(e)}${this._options(e)}`}
        <div class="shape-actions"><button type="button" class="btn btn-text btn-sm" @click=${e=>{(0,fi.uK)(e.currentTarget,this.hass,"shape")}}>${(0,h.t)(513)}</button></div>
        <p class="sr-only" role="status">${this._status}</p>
      </div>
    `}};uo.styles=[l.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .shape-ed {
        display: grid;
        gap: 16px;
      }
      .pick {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
        align-items: center;
        container-type: inline-size;
      }
      .pick .select {
        min-width: 0;
      }
      .preview {
        width: 56px;
        height: 40px;
        overflow: visible;
        color: var(--mc-text-2);
        background: var(--mc-surface-2);
        border-radius: var(--mc-radius);
      }
      .preview path {
        fill: color-mix(in srgb, currentColor 14%, transparent);
        stroke: currentColor;
        stroke-width: 1.5;
        stroke-linejoin: round;
      }
      .preview .none-mark {
        fill: none;
        stroke-dasharray: 3 3;
      }
      @container (max-width: 259px) {
        .pick {
          grid-template-columns: 1fr;
        }
      }
      .seed {
        display: flex;
        gap: 8px;
      }
      .seed .input {
        flex: 1;
        min-width: 0;
      }
      .hints {
        display: grid;
        gap: 4px;
      }
      .hints .help {
        margin: 0;
      }
      .shape-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .mine {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 6px;
      }
      .mine li {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .mine .nm {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .save-form {
        display: grid;
        gap: 8px;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
    `],Qi([(0,n.MZ)({attribute:!1})],uo.prototype,"shape",void 0),Qi([(0,n.MZ)({attribute:!1})],uo.prototype,"options",void 0),Qi([(0,n.MZ)({type:Boolean})],uo.prototype,"explicitNone",void 0),Qi([(0,n.MZ)({type:String})],uo.prototype,"target",void 0),Qi([(0,n.MZ)({type:Boolean})],uo.prototype,"hasRadius",void 0),Qi([(0,n.MZ)({type:Boolean})],uo.prototype,"hasShadow",void 0),Qi([(0,n.MZ)({type:Boolean})],uo.prototype,"popup",void 0),Qi([(0,n.MZ)({attribute:!1})],uo.prototype,"onChange",void 0),Qi([(0,n.MZ)({attribute:!1})],uo.prototype,"hass",void 0),Qi([(0,n.MZ)({type:String})],uo.prototype,"label",void 0),Qi([(0,n.wk)()],uo.prototype,"_lib",void 0),Qi([(0,n.wk)()],uo.prototype,"_source",void 0),Qi([(0,n.wk)()],uo.prototype,"_opening",void 0),Qi([(0,n.wk)()],uo.prototype,"_saving",void 0),Qi([(0,n.wk)()],uo.prototype,"_status",void 0),uo=Qi([(0,n.EM)("mc-shape-editor")],uo);var po=i(5520),mo=i(3098),go=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const fo=[{value:"off",label:674},{value:"fill",label:380},{value:"sparkline",label:980}],vo=[{value:"up",label:1115},{value:"down",label:315},{value:"left",label:511},{value:"right",label:833}],bo={fill:["direction","wave"],sparkline:["hours","line_width","area","smoothing"]};let yo=class extends o.WF{constructor(){super(...arguments),this.defaultEntity="",this.explicitNone=!1}get _v(){return this.value&&"object"==typeof this.value?this.value:{}}get _type(){const e=this._v.type;return"fill"===e||"sparkline"===e?e:"off"}_set(e){const t={...this._v,...e};for(const[e,i]of Object.entries(t))(void 0===i||""===i||"number"==typeof i&&Number.isNaN(i))&&delete t[e];this.onChange?.(t)}_pickType(e){if("off"===e){if(this.explicitNone&&"none"===this._v.type)return;return void this.onChange?.(this.explicitNone?{type:"none"}:void 0)}if(e===this._type)return;const t={...this._v,type:e},i="fill"===e?"sparkline":"fill";for(const e of bo[i])delete t[e];for(const[e,i]of Object.entries(t))void 0!==i&&""!==i||delete t[e];this.onChange?.(t)}_field(e,t,i,n,a){const s=t?this._v[t]:void 0,r=void 0!==s&&""!==s;return o.qy`
      <div class="field">
        <div class="field-head">
          ${n?o.qy`<label for=${n}>${e}</label>`:o.qy`<span class="lbl">${e}</span>`}
          ${t?(0,Yt.i)(e,r,()=>this._set({[t]:void 0})):o.s6}
        </div>
        ${i}
        ${a?o.qy`<p class="help">${a}</p>`:o.s6}
      </div>
    `}_seg(e,t,i,n){return o.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const o=i.findIndex(e=>e.value===t),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const s=i[(o+a[e.key]+i.length)%i.length].value,r=e.currentTarget;n(s),requestAnimationFrame(()=>r.querySelector(`[data-val="${s}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return o.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>n(e.value)}
        >${(0,h.t)(e.label)}</button>`})}
    </div>`}_number(e,t,i,n,a,s="any"){const r=this._v[t];return o.qy`<input
      class="input"
      id=${e}
      type="number"
      min=${n??o.s6}
      max=${a??o.s6}
      step=${s}
      placeholder=${String(i)}
      .value=${void 0===r?"":String(r)}
      @input=${e=>{const i=e.target.value,o=Number(i);""!==i.trim()&&Number.isFinite(o)&&this._set({[t]:o})}}
      @change=${e=>{const i=e.target;""!==i.value.trim()||i.validity?.badInput||this._set({[t]:void 0})}}
    />`}_switch(e,t,i){const n=!1!==this._v[t];return o.qy`<div class="switch-row">
      <div class="txt">
        <div class="field-head">
          <span class="lbl">${e}</span>
          ${(0,Yt.i)(e,void 0!==this._v[t],()=>this._set({[t]:void 0}))}
        </div>
        <p class="help">${i}</p>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${n?"true":"false"}
        aria-label=${e}
        @click=${()=>this._set({[t]:!n&&void 0})}
      ></button>
    </div>`}_entityFields(e){const t=this._v,i=e?this.hass?.states?.[e]:void 0;return o.qy`
      ${this._field((0,h.t)(357),"entity",o.qy`<mc-entity-picker
          .hass=${this.hass}
          .value=${t.entity||""}
          .label=${this.defaultEntity?(0,h.t)(588,{entity:this.defaultEntity}):(0,h.t)(357)}
          @value-changed=${e=>this._set({entity:e.detail.value})}
        ></mc-entity-picker>`)}
      ${e?o.s6:o.qy`<p class="help no-entity">${(0,h.t)(734)}</p>`}
      ${!t.entity&&this.defaultEntity?o.qy`<p class="help">${(0,h.t)(348,{entity:this.defaultEntity})}</p>`:o.s6}
      ${i&&Object.keys(i.attributes||{}).length?this._field((0,h.t)(105),"attribute",o.qy`<mc-attribute-picker
              .hass=${this.hass}
              .entityId=${e}
              .value=${t.attribute||""}
              @value-changed=${e=>this._set({attribute:e.detail.value})}
            ></mc-attribute-picker>`):o.s6}
    `}_look(e,t){const i=this._v,n="fill"===e,a=t?this.hass?.states?.[t]:void 0;return o.qy`
      ${this._field((0,h.t)(205),"color",o.qy`<mc-color-picker
          .value=${i.color||""}
          .label=${n?(0,h.t)(381):(0,h.t)(517)}
          .allowEntity=${!!t}
          .entityColor=${(0,ti.id)(a)??"currentColor"}
          .gradient=${n?"css":""}
          @value-changed=${e=>this._set({color:e.detail.value})}
        ></mc-color-picker>`)}
      ${this._field(n?(0,h.t)(383):(0,h.t)(100),"opacity",o.qy`<mc-unit-field
          .value=${function(e){if(void 0===e||""===e)return"";const t=(0,mo.uM)(e);return void 0===t?"":Math.round(1e3*t)/10+"%"}(i.opacity)}
          .label=${n?(0,h.t)(383):(0,h.t)(100)}
          .units=${["%"]}
          .noCustom=${!0}
          .placeholder=${String(Math.round(100*(n?po.BJ.opacity:po.BJ.areaOpacity)))}
          .inputId=${"vb-opacity"}
          @value-changed=${e=>this._set({opacity:e.detail.value||void 0})}
        ></mc-unit-field>`,void 0,n?void 0:(0,h.t)(1035,{pct:Math.round(100*po.BJ.lineOpacity)}))}
    `}_range(e){return o.qy`<div class="two">
      ${this._field((0,h.t)(580),"min",this._number("vb-min","min",e?0:(0,h.t)(108)),"vb-min")}
      ${this._field((0,h.t)(569),"max",this._number("vb-max","max",e?100:(0,h.t)(108)),"vb-max")}
    </div>`}_fill(){const e=this._v;return o.qy`
      ${this._field((0,h.t)(305),"direction",this._seg((0,h.t)(382),e.direction??"up",vo,e=>this._set({direction:e})))}
      ${this._switch((0,h.t)(1164),"wave",(0,h.t)(71))}
    `}_sparkline(){return o.qy`
      <div class="two">
        ${this._field((0,h.t)(456),"hours",this._number("vb-hours","hours",po.BJ.hours,1,po.BJ.maxHours,1),"vb-hours",(0,h.t)(1116))}
        ${this._field((0,h.t)(520),"line_width",this._number("vb-line","line_width",po.BJ.lineWidth,.5,20,.5),"vb-line")}
      </div>
      ${this._switch((0,h.t)(99),"area",(0,h.t)(384))}
      ${this._switch((0,h.t)(968),"smoothing",(0,h.t)(13))}
      <p class="help">${(0,h.t)(448)}</p>
    `}render(){const e=this._type,t=this._v.entity||this.defaultEntity;return o.qy`
      <div class="vb-ed">
        ${this._field((0,h.t)(1106),void 0,this._seg((0,h.t)(1154),e,fo,e=>this._pickType(e)))}
        ${"off"===e?o.s6:o.qy`
              ${this._entityFields(t)}
              ${this._range("fill"===e)}
              ${this._look(e,t)}
              ${"fill"===e?this._fill():this._sparkline()}
            `}
      </div>
    `}};yo.styles=[l.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .vb-ed {
        display: grid;
        gap: 16px;
      }
    `],go([(0,n.MZ)({attribute:!1})],yo.prototype,"value",void 0),go([(0,n.MZ)({attribute:!1})],yo.prototype,"hass",void 0),go([(0,n.MZ)({type:String})],yo.prototype,"defaultEntity",void 0),go([(0,n.MZ)({type:Boolean})],yo.prototype,"explicitNone",void 0),go([(0,n.MZ)({attribute:!1})],yo.prototype,"onChange",void 0),yo=go([(0,n.EM)("mc-value-bg-editor")],yo);var _o=i(9136);let wo="default";const $o=new Set;function ko(e){if(e!==wo){wo=e;for(const t of[...$o])t(e)}}const xo="data-mc-force";function Co(e,t){const i=[...e.querySelector(".mc-tabs > .mc-tabs-header")?.querySelectorAll(":scope > .mc-tab-button")??[]];for(const e of i)e.removeAttribute(xo);if(!t)return null;const o=i.find(e=>!e.classList.contains("active")&&"true"!==e.getAttribute("aria-disabled")),n="disabled"===t&&i.some(e=>"true"===e.getAttribute("aria-disabled")&&!e.classList.contains("active"));return"active"===t||n||o?.setAttribute(xo,t),t}var So=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const Mo=["text","info","markdown"],Ao="__hover__",qo="__tab_active__",Eo="__tab_disabled__",To=["tab_active","tab_disabled"],Lo=["tab_active_color","tab_active_background","tab_indicator_color"],zo=e=>!!e&&"object"==typeof e&&!Array.isArray(e),jo=e=>"string"==typeof e&&""!==e,Ro=e=>void 0===e?void 0:(0,Gt.t)(e),Oo=new Set(["animations","icon_anim","ring","shape","value_bg"]),Po={box_shadow:"0 2px 8px rgba(0, 0, 0, .12)",text_shadow:"0 1px 2px rgba(0, 0, 0, .3)",transition:"all 0.2s ease-out",transform:"scale(1.02)"};let Ho=class extends o.WF{constructor(){super(...arguments),this.design={},this.hasTemplate=!1,this.notSynced=[],this.moduleEntity="",this.target="module",this.moduleType="",this.moduleVariant="",this.hoverOnly=!1,this.tabs={labels:[]},this._openSectors=new Set,this._subOpen=new Map,this._subOpenedForValue=new Set,this._groupOpen=new Map,this._openedForValue=new Set,this._searchQuery="",this._activeView="default",this._pasteMenu=!1,this._pastePop=new Qe(this,{menu:()=>this.shadowRoot?.querySelector(".design-clip .menu"),onClose:()=>{this._pasteMenu=!1},align:"start"}),this._clipStatus=""}get _allowEntityColor(){return"module"===this.target&&!!this.moduleEntity}get _entityColor(){return this._allowEntityColor?(0,ti.id)(this.hass?.states?.[this.moduleEntity])??"currentColor":""}willUpdate(){this.hoverOnly?this._activeView=Ao:"tabs"!==this.moduleType&&this._viewParts().state&&(this._activeView="default")}updated(e){(e.has("_activeView")||e.has("moduleType"))&&ko("tabs"!==this.moduleType||this.hoverOnly?"default":this._activeView),e.has("_activeView")&&!this.hoverOnly&&this.dispatchEvent(new CustomEvent("mc-design-view",{bubbles:!0,composed:!0,detail:{view:this._activeView}}))}_viewParts(){const e=this._activeView;if(e===qo)return{id:"default",state:"tab_active"};if(e===Eo)return{id:"default",state:"tab_disabled"};const t=e.lastIndexOf("::"),i=t>0?To.find(i=>i===e.slice(t+2)):void 0;return i?{id:e.slice(0,t),state:i}:{id:e}}_getActiveRule(){const{id:e}=this._viewParts();if("default"!==e)return this.design.conditional?.find(t=>t.id===e)}_isHoverView(){return this._activeView===Ao}_sub(){const e=this._getActiveRule(),{state:t}=this._viewParts();return t&&(e||"default"===this._viewParts().id)?this._stateSub(t,e):e?{design:e.design,write:t=>this._updateRule(e.id,{design:t})}:this._isHoverView()?{design:this.design.hover||{},write:e=>{const t={...e};for(const e of Object.keys(t))void 0!==t[e]&&""!==t[e]||delete t[e];const i={hover:Object.keys(t).length?t:void 0};this.hasTemplate&&(i._markNotSynced="hover"),this.onChange(i)}}:void 0}_stateSub(e,t){const i=(t?t.design:this.design)??{},o=zo(i[e])?i[e]:{},n="tab_active"===e?Lo.filter(e=>void 0!==i[e]):[],a={};n.length&&(jo(i.tab_active_color)&&(a.tab_color=i.tab_active_color),jo(i.tab_active_background)&&(a.tab_background=i.tab_active_background)),Object.assign(a,o);const s=n.length?i.tab_indicator_color:void 0;return jo(s)&&("pills"===this.tabs?.style?a.tab_background??=s:a.tab_border_color??=s),{design:a,write:i=>{const o={...i};for(const e of Object.keys(o))void 0!==o[e]&&""!==o[e]||delete o[e];const a=Object.keys(o).length?o:void 0;if(t){const i={...t.design};for(const e of n)delete i[e];return a?i[e]=a:delete i[e],void this._updateRule(t.id,{design:i})}const s={[e]:a};for(const e of n)s[e]=void 0;this.hasTemplate&&(s._markNotSynced=[e,...n]),this.onChange(s)}}}_getActiveDesign(){return this._sub()?.design??this.design}_stateCount(e,t){return Object.values(this._stateSub(e,t).design).filter(e=>void 0!==e&&""!==e).length}_withCount(e,t){return t>0?(0,h.t)(1269,{name:e,n:t}):e}_viewName(){const{id:e,state:t}=this._viewParts(),i=this._getActiveRule();if(i){const o=i.name||(0,h.t)(850,{n:(this.design.conditional??[]).findIndex(t=>t.id===e)+1});return"tab_active"===t?(0,h.t)(852,{name:o}):"tab_disabled"===t?(0,h.t)(853,{name:o}):(0,h.t)(851,{name:o})}return"tab_active"===t?(0,h.t)(26):"tab_disabled"===t?(0,h.t)(306):this._isHoverView()?(0,h.t)(458):(0,h.t)(276)}_inherited(e){if(!this._viewParts().state&&!this._isHoverView())return;const t=this._getActiveRule(),i=t=>{const i=zo(t)?t[e]:void 0;return"number"==typeof i?String(i):"string"==typeof i?i:""};return i(t?.design)||i(this.design)}_builtin(e){const t=this._viewParts().state,i="pills"===this.tabs?.style;if("tab_active"===t){if("tab_color"===e)return i?(0,h.t)(1223):(0,h.t)(1232);if("tab_background"===e)return i?(0,h.t)(1232):(0,h.t)(1225)}if("tab_disabled"===t&&"tab_opacity"===e)return"0.5"}_resetState(){const e=this._viewParts().state,t=this._sub();e&&t&&(t.write({}),this._announce((0,h.t)(1291,{state:"tab_active"===e?(0,h.t)(26):(0,h.t)(306)})))}_getValue(e){const t=this._getActiveDesign();if("background_color"===e&&!t.background_color&&(0,_o.wb)(t.background))return t.background;const i=t[e];return"number"==typeof i?String(i):i||""}_fieldValue(e,t){if("tab_opacity"!==e)return t||void 0;const i=Number(t);return""===t.trim()||Number.isNaN(i)?void 0:Math.min(1,Math.max(0,i))}_bgGradientBlock(){const e=this._getActiveDesign(),t=this.design,i=!!this._sub();if((0,_o.wb)(this._getValue("background_color")))return"";const o=e.background??(i?t.background:void 0);return o&&!(0,_o.wb)(o)?(0,h.t)(428):e.background_image||i&&t.background_image?(0,h.t)(12):i&&t.background_color?(0,h.t)(277):""}_handleBackgroundColor(e){const t=this._getActiveDesign(),i=(0,_o.wb)(e)?{background:e,background_color:void 0}:{background_color:e||void 0,...(0,_o.wb)(t.background)?{background:void 0}:{}},o=this._sub();o?o.write({...o.design,...i}):(this.hasTemplate&&(i._markNotSynced=["background_color","background"]),this.onChange(i))}_isSet(e){const t=this._getActiveDesign();return"animations"===e.type?(0,O.Sd)(t).length>0:!("background_color"!==e.key||!this._getValue(e.key))||(0,Ut.I7)(e.key).some(e=>{return!(void 0===(i=t[e])||""===i||i&&"object"==typeof i&&!Array.isArray(i)&&!Object.keys(i).length);var i})}_keysOf(e){return"background_color"===e.key&&this._getValue(e.key)!==(this._getActiveDesign().background_color||"")?["background_color","background"]:"animations"===e.type?Object.keys((0,O.Tk)([])):(0,Ut.I7)(e.key)}_reset(e){const t=e.flatMap(e=>this._keysOf(e)),i=this._sub();if(i){const e={...i.design};for(const i of t)delete e[i];return void i.write(e)}const o=Object.fromEntries(t.map(e=>[e,void 0]));this.hasTemplate&&(o._markNotSynced=1===e.length?e[0].key:e.map(e=>e.key)),this.onChange(o)}_handlePropertyChange(e,t){const i=this._sub();if(i)return void i.write({...i.design,[e]:this._fieldValue(e,t)});const o={[e]:this._fieldValue(e,t)};this.hasTemplate&&(o._markNotSynced=e),this.onChange(o)}_handleAnimationsChange(e){const t=(0,O.Tk)(e),i=this._sub();if(i){const e={...i.design,...t};for(const i of Object.keys(t))void 0===e[i]&&delete e[i];return void i.write(e)}this.hasTemplate&&(t._markNotSynced="animations"),this.onChange(t)}_handleObjectChange(e,t){const i=this._sub();if(i){const o={...i.design};return void 0===t?delete o[e]:o[e]=t,void i.write(o)}const o={[e]:t};this.hasTemplate&&(o._markNotSynced=e),this.onChange(o)}_handleKeysChange(e,t){const i=this._sub();if(i){const t={...i.design};for(const[i,o]of Object.entries(e))void 0===o?delete t[i]:t[i]=o;return void i.write(t)}const o={...e};this.hasTemplate&&(o._markNotSynced=t),this.onChange(o)}_hasRadius(){const e={...this.design,...this._getActiveDesign()};return(0,Ut.I7)("border_radius").some(t=>void 0!==e[t]&&""!==e[t])}_handleSyncToggle(e,t){t?this.onChange({_markNotSynced:"background_color"===e?["background_color","background"]:e}):this.onChange({_markSynced:"background_color"===e?["background_color","background"]:e})}_toggleSector(e){const t=new Set(this._openSectors);t.has(e)?t.delete(e):t.add(e),this._openSectors=t}_isGroupOpen(e,t){return t>0&&this._openedForValue.add(e.id),this._groupOpen.get(e.id)??(e.defaultOpen||this._openedForValue.has(e.id))}_toggleGroup(e,t){this._groupOpen=new Map(this._groupOpen).set(e.id,!t)}_customCssMatches(){const e=(0,h.A)(this._searchQuery);return!e||(0,h.A)((0,h.t)(256)).includes(e)||"css"===e}_countSetProperties(e){const t=this._getActiveDesign();return e.properties.filter(e=>"animations"===e.type?(0,O.Sd)(t).length>0:(0,Ut.I7)(e.key).some(e=>void 0!==t[e]&&""!==t[e])).length}_isVisible(e){const t={...this.design,...this._getActiveDesign()};return!(e.hideForVariant?.includes(this.moduleVariant)||Le[e.key]&&!t[Le[e.key]])}_filterProperties(e){const t=this._isHoverView(),i="default"===this._activeView,o=this._viewParts().state,n=e.filter(e=>this._isVisible(e)&&!(e.baseOnly&&!i)&&!(o&&!e.tabState)&&!(t&&(e.virtual&&!e.hover||Oo.has(e.type))));if(!this._searchQuery)return n;const a=(0,h.A)(this._searchQuery);return n.filter(e=>(0,h.A)((0,Gt.t)(e.label)).includes(a)||e.cssProperty.toLowerCase().includes(a)||e.key.toLowerCase().includes(a)||e.key.replace(/_/g," ").includes(a)||(Ut.Xr[e.key]||[]).some(e=>e.cssProperty.includes(a)||e.key.includes(a)))}_announce(e){this._clipStatus=e,window.clearTimeout(this._clipTimer),this._clipTimer=window.setTimeout(()=>this._clipStatus="",2500)}_copyDesign(){D(this.design),this._announce((0,h.t)(300))}_pasteDesign(e){this._closePasteMenu(!0);const t=I();if(!t)return;const i=F(this.design,t,e),o=function(e,t){const i={};for(const o of Object.keys(e||{}))o in t||(i[o]=void 0);return Object.assign(i,t)}(this.design,i),n=this.design,a=Object.keys(o).filter(e=>JSON.stringify(n[e])!==JSON.stringify(o[e]));this.hasTemplate&&a.length&&(o._markNotSynced=a),this._activeView="default",this.onChange(o),this._announce((0,h.t)(301))}_openPasteMenu(e){this._pasteMenu=!0,this._pastePop.open(e)}_closePasteMenu(e){this._pastePop.close(e)}disconnectedCallback(){super.disconnectedCallback(),ko("default"),window.clearTimeout(this._clipTimer)}_renderClipboard(){const e=!!I();return o.qy`
      <div class="design-clip">
        <button type="button" class="btn btn-text btn-sm" @click=${()=>this._copyDesign()}>
          <ha-icon icon="mdi:content-copy"></ha-icon>${(0,h.t)(237)}
        </button>
        <button
          type="button"
          class="btn btn-text btn-sm paste"
          aria-haspopup="menu"
          aria-expanded=${this._pasteMenu?"true":"false"}
          ?disabled=${!e}
          title=${e?(0,h.t)(722):(0,h.t)(234)}
          @click=${e=>this._openPasteMenu(e.currentTarget)}
        >
          <ha-icon icon="mdi:content-paste"></ha-icon>${(0,h.t)(719)}
        </button>
        <span class="clip-status" role="status" aria-live="polite">${this._clipStatus}</span>
        ${this._pasteMenu?o.qy`<div class="menu" role="menu" aria-label=${(0,h.t)(719)} @keydown=${this._pastePop.onKeydown}>
              <button type="button" role="menuitem" @click=${()=>this._pasteDesign("replace")}>
                <ha-icon icon="mdi:content-paste"></ha-icon>${(0,h.t)(802)}
              </button>
              <button type="button" role="menuitem" @click=${()=>this._pasteDesign("merge")}>
                <ha-icon icon="mdi:set-merge"></ha-icon>${(0,h.t)(578)}
              </button>
            </div>`:o.s6}
      </div>
    `}_addRule(){const e=[...this.design.conditional||[]],t={id:(0,v.$)("rule"),name:(0,h.t)(850,{n:(this.design.conditional?.length??0)+1}),conditions:[],mode:"every",design:{}};e.push(t),this.onChange({conditional:e}),this._activeView=t.id}_removeRule(e){const t=(this.design.conditional||[]).filter(t=>t.id!==e);this.onChange({conditional:t.length?t:void 0}),this._activeView="default"}_updateRule(e,t){const i=(this.design.conditional||[]).map(i=>i.id===e?{...i,...t}:i);this.onChange({conditional:i})}_updateRuleName(e,t){this._updateRule(e,{name:t})}_updateRuleMode(e,t){this._updateRule(e,{mode:t})}_updateRuleConditions(e,t){this._updateRule(e,{conditions:t})}_addConditionToRule(e){const t=[...e.conditions,{id:(0,v.$)("cond"),type:"state"}];this._updateRuleConditions(e.id,t)}_updateCondition(e,t,i){const o=e.conditions.map((e,o)=>o===t?{...e,...i}:e);this._updateRuleConditions(e.id,o)}_removeCondition(e,t){const i=e.conditions.filter((e,i)=>i!==t);this._updateRuleConditions(e.id,i)}_renderField(e,t,i=o.s6,n,a,s=o.s6){return o.qy`
      <div class="field">
        <div class="field-head">
          ${n?o.qy`<label for=${n}>${e}</label>`:o.qy`<span class="lbl">${e}</span>`}
          ${s}${i}
        </div>
        ${t}
        ${a?o.qy`<p class="help">${a}</p>`:o.s6}
      </div>
    `}_renderProperty(e){const t=this._getValue(e.key),i="default"!==this._activeView,n=`design.${e.key}`,a=this.hasTemplate&&!this.notSynced.includes(n),s=`dp-${e.key}`,r=this.hasTemplate&&!i?o.qy`
          <mc-sync-indicator
            .synced=${a}
            .hasTemplate=${this.hasTemplate}
            @sync-toggle=${()=>this._handleSyncToggle(e.key,a)}
          ></mc-sync-indicator>
        `:o.s6,l=e.tabState&&!t?this._builtin(e.key):void 0,c=e.tabState&&!t&&void 0===l?this._inherited(e.key):void 0,d=e.tabState&&void 0!==this._inherited(e.key)&&!this._builtin(e.key),u="animations"===e.type||"ring"===e.type||"value_bg"===e.type?o.s6:(0,Yt.i)((0,Gt.t)(e.label),this._isSet(e),()=>this._reset([e]),d?(0,h.t)(1124):void 0),p=(t,i=o.s6,n,a)=>this._renderField((0,Gt.t)(e.label),t,i,n,a,u),m=e=>e??(l?(0,h.t)(155,{value:l}):c?(0,h.t)(489,{value:c}):void 0);switch(e.type){case"animations":{const e="module"===this.target;return p(o.qy`
            <mc-animation-list
              .animations=${(0,O.Sd)(this._getActiveDesign())}
              .allowIcon=${e&&O.J2.includes(this.moduleType)}
              .allowLabel=${e&&"button"===this.moduleType}
              .hass=${this.hass}
              .defaultEntity=${e?this.moduleEntity:""}
              .requireTriggerEntity=${!e}
              .allowEntityColor=${this._allowEntityColor}
              .entityColor=${this._entityColor}
              .onChange=${e=>this._handleAnimationsChange(e)}
            ></mc-animation-list>
          `,r)}case"tab_animations":{const t=this._getActiveDesign()[e.key],i=Array.isArray(t)?t.filter(zo):[];return p(o.qy`
            <mc-animation-list
              .animations=${i}
              .allowIcon=${!0}
              .allowLabel=${!0}
              .motionOnly=${!0}
              .moduleLabel=${(0,h.t)(1015)}
              .hass=${this.hass}
              .defaultEntity=${this.moduleEntity}
              .allowEntityColor=${this._allowEntityColor}
              .entityColor=${this._entityColor}
              .onChange=${t=>this._handleObjectChange(e.key,t.length?t:void 0)}
            ></mc-animation-list>
          `,r,void 0,Ro(e.help))}case"icon_anim":return p(this._renderIconAnim(e.key),r,void 0,Ro(e.help));case"sides":return p(o.qy`${(0,Kt.D)(this._activeView,o.qy`
            <mc-box-field
              .shorthand=${!0}
              .baseName=${e.key}
              .value=${t}
              .label=${(0,Gt.t)(e.label)}
              .cell=${e.sides?.cell??"length"}
              .corners=${!!e.sides?.corners}
              .entity=${"border_color"===e.key&&this._allowEntityColor&&"tabs"!==this.moduleType}
              .entityColor=${this._entityColor}
              .units=${e.units??["px","em","rem","%"]}
              .options=${(e.options??[]).map(e=>({value:e.value,label:(0,Gt.t)(e.label)}))}
              .inherited=${e.tabState&&!this._builtin(e.key)&&this._inherited(e.key)||("border_width"===e.key&&this._getActiveDesign().border_length?"2px":"")}
              .onChange=${t=>this._handlePropertyChange(e.key,String(t[e.key]??""))}
            ></mc-box-field>
          `)}`,r,void 0,"color"===e.sides?.cell?m(Ro(e.help)):Ro(e.help));case"ring":{const e="module"===this.target;return p(o.qy`<mc-ring-editor
            .ring=${this._getActiveDesign().ring}
            .hass=${this.hass}
            .defaultEntity=${e?this.moduleEntity:""}
            .requireEntity=${!e}
            .allowEntityColor=${this._allowEntityColor}
            .entityColor=${this._entityColor}
            .onChange=${e=>this._handleObjectChange("ring",e)}
          ></mc-ring-editor>`,r)}case"shape":{const e=this._getActiveDesign(),t={...this.design,...e},n=!i&&this.hasTemplate||i&&!!this.design.shape&&"none"!==this.design.shape;return p(o.qy`<mc-shape-editor
            .shape=${e.shape}
            .options=${e.shape_options}
            .explicitNone=${n}
            .target=${this.target}
            .hasRadius=${this._hasRadius()}
            .hasShadow=${!!t.box_shadow}
            .hass=${this.hass}
            .onChange=${e=>this._handleKeysChange({...e},"shape")}
          ></mc-shape-editor>`,r)}case"value_bg":{const e="module"===this.target,t=this.design.value_background,n=!i&&this.hasTemplate||i&&!!t?.type&&"none"!==t.type;return p(o.qy`<mc-value-bg-editor
            .value=${this._getActiveDesign().value_background}
            .hass=${this.hass}
            .explicitNone=${n}
            .defaultEntity=${e?this.moduleEntity:""}
            .onChange=${e=>this._handleObjectChange("value_background",e)}
          ></mc-value-bg-editor>`,r)}case"box":if(i){const t=this._sub();return p(o.qy`
              <mc-box-field
                .design=${t.design}
                .onChange=${e=>t.write({...t.design,...e})}
                .baseName=${e.key}
              ></mc-box-field>
            `)}return p(o.qy`
            <mc-box-field
              .design=${this.design}
              .onChange=${t=>this.onChange(this.hasTemplate?{...t,_markNotSynced:e.key}:t)}
              .baseName=${e.key}
            ></mc-box-field>
          `,r);case"unit":return p(o.qy`
            <mc-unit-field
              .value=${t}
              .label=${(0,Gt.t)(e.label)}
              .units=${e.units}
              data-key=${e.key}
              .placeholder=${c?.match(/^-?\d*\.?\d+/)?.[0]??(g=e.key,f={...this.design,...this._getActiveDesign()},/^(min_|max_)?(width|height)$/.test(g)||"flex_basis"===g?"auto":"font_size"===g?"inherit":"border_length"===g?"100":"border_width"===g&&f.border_length?"2px".replace("px",""):"0")}
              @value-changed=${t=>this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-unit-field>
          `,r,void 0,Ro(e.help));case"color":{const i="background_color"===e.key?this._bgGradientBlock():"";return p(o.qy`
            <mc-color-picker
              data-key=${e.key}
              .value=${t}
              .label=${(0,Gt.t)(e.label)}
              .allowEntity=${this._allowEntityColor&&!e.baseOnly&&!e.key.startsWith("tab_")}
              .entityColor=${this._entityColor}
              .gradient=${"background_color"===e.key&&!i||"color"===e.key&&"module"===this.target&&Mo.includes(this.moduleType)?"css":""}
              .gradientNote=${"color"===e.key?(0,h.t)(1030):""}
              @value-changed=${t=>"background_color"===e.key?this._handleBackgroundColor(t.detail.value):this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-color-picker>
          `,r,void 0,m(i||void 0))}case"image":return p(o.qy`
            <mc-media-picker
              .hass=${this.hass}
              .value=${t}
              .mediaType=${"image"}
              @value-changed=${t=>this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-media-picker>
          `,r);case"font":return p(o.qy`
            <mc-font-picker
              .hass=${this.hass}
              .value=${t}
              @value-changed=${t=>this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-font-picker>
          `,r,void 0,m());case"select":return p(o.qy`
            <div class="select">
              <select
                class="input"
                id=${s}
                @change=${t=>this._handlePropertyChange(e.key,t.target.value)}
              >
                <option value="" ?selected=${!t}>${c?(0,h.t)(487,{value:this._optionLabel(e,c)}):void 0===e.emptyLabel?(0,h.t)(661):(0,Gt.t)(e.emptyLabel)}</option>
                ${this._renderOptions(e.options||[],t)}
              </select>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </div>
          `,r,s);case"segmented":{const i=e.options||[],n=i.some(e=>e.value===t)?t:e.defaultValue??i[0]?.value,a=t=>{const o=i.findIndex(e=>e.value===n),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1},s="Home"===t.key?0:"End"===t.key?i.length-1:void 0!==a[t.key]?(o+a[t.key]+i.length)%i.length:-1;if(s<0)return;t.preventDefault();const r=t.currentTarget;this._handlePropertyChange(e.key,i[s].value),requestAnimationFrame(()=>r.querySelector(`[data-val="${i[s].value}"]`)?.focus())};return p(o.qy`
            <div class="seg full" role="radiogroup" aria-label=${(0,Gt.t)(e.label)} @keydown=${a}>
              ${i.map(t=>{const i=t.value===n;return o.qy`<button
                  type="button"
                  role="radio"
                  data-val=${t.value}
                  aria-checked=${i?"true":"false"}
                  tabindex=${i?"0":"-1"}
                  @click=${()=>this._handlePropertyChange(e.key,t.value)}
                >${(0,Gt.t)(t.label)}</button>`})}
            </div>
          `,r)}case"tab_list":{const t=this.tabs?.labels??[];if(!t.length)return o.qy``;const i=this._getActiveDesign()[e.key],n=new Set(Array.isArray(i)?i.filter(e=>"number"==typeof e):[]),a=(t,i)=>{const o=new Set(n);i?o.add(t):o.delete(t);const a=[...o].sort((e,t)=>e-t);this._handleObjectChange(e.key,a.length?a:void 0)};return p(o.qy`<div class="tab-list" role="group" aria-label=${(0,Gt.t)(e.label)}>
            ${t.map((e,t)=>o.qy`<label><input type="checkbox" .checked=${n.has(t)} @change=${e=>a(t,e.target.checked)} /><span>${e||(0,h.t)(1018,{n:t+1})}</span></label>`)}
          </div>`,r,void 0,Ro(e.help))}case"number":return p(o.qy`
            <input
              class="input"
              id=${s}
              type="number"
              min=${e.range?.[0]??o.s6}
              max=${e.range?.[1]??o.s6}
              step=${e.range?.[2]??o.s6}
              placeholder=${l??(d?c||(0,h.t)(1060):o.s6)}
              .value=${t}
              @input=${t=>this._handlePropertyChange(e.key,t.target.value)}
            />
          `,r,s);default:return p(o.qy`
            <input
              class="input mono"
              id=${s}
              type="text"
              spellcheck="false"
              placeholder=${l??(d?c||(0,h.t)(1060):Po[e.key]??o.s6)}
              .value=${t}
              @input=${t=>this._handlePropertyChange(e.key,t.target.value)}
            />
          `,r,s,Ro(e.help))}var g,f}_renderOptions(e,t){const i=e=>o.qy`<option value=${e.value} ?selected=${t===e.value}>${(0,Gt.t)(e.label)}</option>`,n=[...new Set(e.map(e=>e.group))];return 1===n.length&&void 0===n[0]?e.map(i):n.map(t=>o.qy`<optgroup label=${t??""}>${e.filter(e=>e.group===t).map(i)}</optgroup>`)}_optionLabel(e,t){const i=e.options?.find(e=>e.value===t);return i?(0,Gt.t)(i.label):t}_renderIconAnim(e){const t=this._getActiveDesign()[e],i=zo(t)?t:{},n=!!this._viewParts().state,a="string"==typeof i.device?i.device:"",s="string"==typeof i.draw?i.draw:"",r="string"==typeof i.draw_duration||"number"==typeof i.draw_duration?i.draw_duration:"",l=String(r),c=t=>{const i={},o={device:a,draw:s,draw_duration:"draw_duration"in t?t.draw_duration:r,...t};o.device&&(i.device=o.device),o.draw&&(n||"off"!==o.draw)&&(i.draw=o.draw,"off"!==o.draw&&o.draw_duration&&(i.draw_duration=o.draw_duration)),this._handleObjectChange(e,Object.keys(i).length?i:void 0)},d={value:"",label:n?(0,h.t)(856):(0,h.t)(674)},u=(e,t,i,n,a)=>o.qy`
      <div>
        <label class="sublbl" for=${e}>${t}</label>
        <div class="select">
          <select class="input" id=${e} @change=${e=>a(e.target.value)}>
            ${[d,...n].map(e=>o.qy`<option value=${e.value} ?selected=${e.value===i}>${e.label}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>
    `,p=e=>n||"off"!==e.value,m=Jt.filter(e=>p(e)&&("auto"!==e.value||!!this.moduleEntity||"auto"===a)).map(e=>({value:e.value,label:(0,h.t)(e.label)})),g=Xt.filter(p).map(e=>({value:e.value,label:(0,h.t)(e.label)}));return o.qy`
      <div class="fx-pair">
        ${u(`dp-${e}-device`,(0,h.t)(302),a,m,e=>c({device:e}))}
        ${u(`dp-${e}-draw`,(0,h.t)(518),s,g,e=>c({draw:e}))}
      </div>
      ${s&&"off"!==s?o.qy`<div>
            <span class="sublbl">${(0,h.t)(318)}</span>
            <mc-unit-field
              data-key="${e}-duration"
              .value=${l}
              .label=${(0,h.t)(318)}
              .units=${["s","ms"]}
              .placeholder=${String(ei._T.drawDuration)}
              @value-changed=${e=>c({draw_duration:e.detail.value||""})}
            ></mc-unit-field>
          </div>`:o.s6}
    `}_renderSector(e){const t=this._filterProperties(function(e){const t=e.leading||[];return[...t.map(t=>e.properties.find(e=>e.key===t)).filter(e=>!!e),...e.properties.filter(e=>!t.includes(e.key))]}(e));if(0===t.length)return o.s6;const i=this._openSectors.has(e.id)||!!this._searchQuery,n=this._countSetProperties(e),a=`sb-${e.id}`;return o.qy`
      <div class="sector">
        <button
          type="button"
          class="sector-btn"
          aria-expanded=${i?"true":"false"}
          aria-controls=${a}
          @click=${()=>this._toggleSector(e.id)}
        >
          <ha-icon icon=${e.icon}></ha-icon>
          <span class="nm">${(0,Gt.t)(e.name)}</span>
          ${n>0?o.qy`<span class="chip is-count">${(0,h.t)(1288,{n})}</span>`:o.s6}
          <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        </button>
        ${i?o.qy`<div class="sector-body" id=${a}>
              ${n>0?o.qy`<div class="sector-reset-row">
                    <button
                      type="button"
                      class="btn btn-text btn-sm sector-reset"
                      aria-label=${(0,h.t)(815,{name:(0,Gt.t)(e.name)})}
                      title=${"tabs-bar"===e.id&&"default"===this._activeView?(0,h.t)(825):(0,h.t)(190)}
                      @click=${()=>this._reset(e.properties.filter(e=>this._isSet(e)))}
                    >
                      <ha-icon icon="mdi:backup-restore"></ha-icon>${(0,h.t)(813)}
                    </button>
                  </div>`:o.s6}
              ${"tabs-bar"===e.id?this._renderTabNotes():o.s6}
              ${this._renderPropertyList(t)}
              ${"tabs-bar"===e.id?this._renderStateReset():o.s6}
            </div>`:o.s6}
      </div>
    `}_renderPropertyList(e){return e.some(e=>e.subgroup)?this._renderSubgroups(e):this._renderFlatList(e)}_renderSubgroups(e){const t=[];for(const i of e){const e=t[t.length-1];e&&e.id===i.subgroup?e.props.push(i):t.push({id:i.subgroup,props:[i]})}const i=this._viewParts().state,n=[];let a=!1;for(const e of t){const t=Te.find(t=>t.id===e.id);if(!t){n.push(...this._renderFlatList(e.props));continue}"bar"===e.id||a||(a=!0,n.push(o.qy`<h4 class="subgroup-caption">${(0,h.t)(1019)}</h4>`));const s=e.props.filter(e=>this._isSet(e)),r=s.length;r>0&&this._subOpenedForValue.add(t.id);const l=!!this._searchQuery||(this._subOpen.get(t.id)??("bar"===t.id||"text"===t.id||this._subOpenedForValue.has(t.id))),c=`sg-${t.id}`,d=(0,Gt.t)(t.name);n.push(o.qy`
        <div class="subgroup" data-subgroup=${t.id}>
          <div class="subgroup-head">
            <button
              type="button"
              class="subgroup-btn"
              aria-expanded=${l?"true":"false"}
              aria-controls=${c}
              @click=${()=>{this._subOpen=new Map(this._subOpen).set(t.id,!l)}}
            >
              <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
              <span class="nm">${d}</span>
              ${r>0?o.qy`<span class="chip is-count">${(0,h.t)(1288,{n:r})}</span>`:o.s6}
            </button>
            ${r>0?o.qy`<button type="button" class="btn btn-text btn-sm subgroup-reset" aria-label=${(0,h.t)(821,{group:d,state:this._viewName()})} @click=${()=>this._reset(s)}>
                  ${(0,h.t)(808)}
                </button>`:o.s6}
          </div>
          ${l?o.qy`<div class="subgroup-body" id=${c}>
                ${this._renderFlatList(e.props)}
                ${"icon"===t.id&&"tab_active"===i?o.qy`<div class="tree-note">
                      <p class="help">${(0,h.t)(473)}</p>
                      <button type="button" class="btn btn-text btn-sm show-tree" @click=${()=>this.dispatchEvent(new CustomEvent("mc-select-first-tab",{bubbles:!0,composed:!0}))}>${(0,h.t)(932)}</button>
                    </div>`:o.s6}
              </div>`:o.s6}
        </div>
      `)}return n}_renderTabNotes(){const{id:e,state:t}=this._viewParts();if(!t&&!this._isHoverView())return o.s6;const i=this._getActiveRule(),n=this._getActiveDesign(),a=!Object.values(n).some(e=>void 0!==e&&""!==e),s=i?.design?.tab_disabled_tabs??this.design.tab_disabled_tabs,r="tab_disabled"===t&&!(Array.isArray(s)&&s.length);return o.qy`
      <div class="tab-notes">
        <p class="help">${i?(0,h.t)(132):(0,h.t)(131)}</p>
        ${t&&a?o.qy`<p class="help">${(0,h.t)(666)}</p>`:o.s6}
        ${r?o.qy`<p class="help">${(0,h.t)(650)}</p>`:o.s6}
        <div>
          <button
            type="button"
            class="btn btn-text btn-sm go-default"
            @click=${async()=>{this._activeView=i?e:"default",await this.updateComplete,this.shadowRoot?.querySelector(".subgroup-btn")?.focus()}}
          >
            ${i?(0,h.t)(422):(0,h.t)(421)}
          </button>
        </div>
      </div>
    `}_renderStateReset(){const e=this._viewParts().state;if(!e||!Object.values(this._getActiveDesign()).some(e=>void 0!==e&&""!==e))return o.s6;const t="tab_active"===e?(0,h.t)(26):(0,h.t)(306);return o.qy`<div>
      <button type="button" class="btn btn-secondary btn-sm reset-state" @click=${()=>this._resetState()}>
        <ha-icon icon="mdi:backup-restore"></ha-icon>${(0,h.t)(824,{state:t})}
      </button>
    </div>`}_renderFlatList(e){const t=e=>!!e&&("unit"===e.type||"select"===e.type||"number"===e.type),i=[];for(let n=0;n<e.length;n++){const a=e[n];t(a)&&t(e[n+1])?(i.push(o.qy`<div class="two">${this._renderProperty(a)}${this._renderProperty(e[n+1])}</div>`),n++):i.push(this._renderProperty(a))}return i}_renderRulePicker(){const e=this.design.conditional||[],t=e.length,i="tabs"===this.moduleType,n=this._viewParts().state,a=n?"tab_active"===n?(0,h.t)(93):(0,h.t)(95):this._isHoverView()?(0,h.t)(98,{thing:Yi(this.target)}):t?(0,h.t)(1253,{n:t}):(0,h.t)(33);return o.qy`
      <div class="rule-pick">
        <div class="field">
          <div class="field-head"><label for="design-view">${(0,h.t)(338)}</label></div>
          <div class="select">
            <select
              class="input"
              id="design-view"
              aria-describedby="design-view-help"
              @change=${e=>{this._activeView=e.target.value}}
            >
              <option value="default" ?selected=${"default"===this._activeView}>${(0,h.t)(276)}</option>
              <option value=${Ao} ?selected=${this._isHoverView()}>${i?this._withCount((0,h.t)(458),Object.values(this.design?.hover??{}).filter(e=>void 0!==e&&""!==e).length):(0,h.t)(458)}</option>
              ${i?o.qy`<option value=${qo} ?selected=${this._activeView===qo}>${this._withCount((0,h.t)(26),this._stateCount("tab_active",void 0))}</option>
                    <option value=${Eo} ?selected=${this._activeView===Eo}>${this._withCount((0,h.t)(306),this._stateCount("tab_disabled",void 0))}</option>`:o.s6}
              ${e.map((e,t)=>{const n=e.name||(0,h.t)(850,{n:t+1}),a=t=>t?`${e.id}::${t}`:e.id;return o.qy`<option value=${e.id} ?selected=${this._activeView===e.id}>${(0,h.t)(851,{name:n})}</option>
                  ${i?o.qy`<option value=${a("tab_active")} ?selected=${this._activeView===a("tab_active")}>${this._withCount((0,h.t)(852,{name:n}),this._stateCount("tab_active",e))}</option>
                        <option value=${a("tab_disabled")} ?selected=${this._activeView===a("tab_disabled")}>${this._withCount((0,h.t)(853,{name:n}),this._stateCount("tab_disabled",e))}</option>`:o.s6}`})}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
          <p class="help" id="design-view-help">${a}</p>
        </div>
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${()=>this._addRule()}>
            <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(41)}
          </button>
        </div>
      </div>
    `}_renderRuleHeader(e){const t="any"===e.mode?"any":"every",i=[{v:"every",l:(0,h.t)(63)},{v:"any",l:(0,h.t)(91)}];return o.qy`
      <div class="rule-head">
        <h3>${(0,h.t)(848)}</h3>
        <button
          type="button"
          class="btn btn-text btn-sm danger-text"
          @click=${()=>this._removeRule(e.id)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>${(0,h.t)(292)}
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="rule-name">${(0,h.t)(849)}</label></div>
        <input
          class="input"
          id="rule-name"
          type="text"
          .value=${e.name||""}
          placeholder=${(0,h.t)(849)}
          @input=${t=>this._updateRuleName(e.id,t.target.value)}
        />
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl">${(0,h.t)(560)}</span></div>
        <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(223)}>
          ${i.map(i=>o.qy`
              <button
                type="button"
                role="radio"
                aria-checked=${t===i.v?"true":"false"}
                @click=${()=>this._updateRuleMode(e.id,i.v)}
              >${i.l}</button>
            `)}
        </div>
      </div>
    `}_renderRuleConditions(e){return o.qy`
      <div class="rule-conds">
        ${e.conditions.length?e.conditions.map((t,i)=>o.qy`
                <mc-condition-row
                  .condition=${t}
                  .hass=${this.hass}
                  .moduleEntity=${this.moduleEntity}
                  .onChange=${t=>this._updateCondition(e,i,t)}
                  .onRemove=${()=>this._removeCondition(e,i)}
                ></mc-condition-row>
              `):o.qy`<p class="help">${(0,h.t)(628)}</p>`}
        <div>
          <button type="button" class="btn btn-secondary btn-sm" @click=${()=>this._addConditionToRule(e)}>
            <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(40)}
          </button>
        </div>
      </div>
    `}_handleCustomCssChange(e){const t=this._sub();t?t.write({...t.design,css:e||void 0}):this.onChange({css:e||void 0})}_getCustomCssValue(){return this._getActiveDesign().css||""}_countGroup(e){return e.entries.reduce((e,t)=>{if(t===je)return e+(this._getCustomCssValue()?1:0);const i=ze.find(e=>e.id===t);return e+(i?this._countSetProperties(i):0)},0)}_renderGroup(e){const t=e.entries.map(e=>ze.find(t=>t.id===e)).filter(e=>!!e&&(!e.modules||e.modules.includes(this.moduleType))&&this._filterProperties(e.properties).length>0),i=e.entries.includes(je)&&this._customCssMatches()&&!this._viewParts().state;if(!t.length&&!i)return o.s6;const n=this._countGroup(e),a=!!this._searchQuery||this._isGroupOpen(e,n),s=`dg-${e.id}`;return o.qy`
      <section class="dgroup" data-group=${e.id}>
        <button
          type="button"
          class="dgroup-btn"
          aria-expanded=${a?"true":"false"}
          aria-controls=${s}
          @click=${()=>this._toggleGroup(e,this._isGroupOpen(e,n))}
        >
          <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
          <span class="nm">${(0,Gt.t)(e.name)}</span>
          ${n>0?o.qy`<span class="chip is-count">${(0,h.t)(1288,{n})}</span>`:o.s6}
        </button>
        <div class="dgroup-body" id=${s} ?hidden=${!a}>
          ${a?o.qy`${t.length?o.qy`<div class="sectors">${t.map(e=>this._renderSector(e))}</div>`:o.s6}
              ${i?this._renderCustomCss():o.s6}`:o.s6}
        </div>
      </section>
    `}_renderCustomCss(){return o.qy`
      <div class="field">
        <div class="field-head">
          <label for="custom-css">${(0,h.t)(256)}</label>
          ${(0,Yt.i)((0,h.t)(256),!!this._getCustomCssValue(),()=>this._handleCustomCssChange(""))}
        </div>
        <textarea
          class="input"
          id="custom-css"
          spellcheck="false"
          .value=${this._getCustomCssValue()}
          @input=${e=>this._handleCustomCssChange(e.target.value)}
          rows="4"
          placeholder=${(0,h.t)(96,{thing:Yi(this.target)})}
        ></textarea>
      </div>
    `}render(){const e=this._getActiveRule();"default"===this._viewParts().id||this._isHoverView()||e||(this._activeView="default");const t=Re.map(e=>this._renderGroup(e));return o.qy`
      <div class="panel">
        ${this.hoverOnly?o.s6:o.qy`<div class="group">
          ${this._renderClipboard()}
          ${this._renderRulePicker()}
          ${e?o.qy`
                <div class="rule">
                  ${this._renderRuleHeader(e)}
                  ${this._renderRuleConditions(e)}
                </div>
              `:o.s6}
        </div>`}

        <div class="group">
          <div class="with-icon">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              class="input"
              type="search"
              placeholder=${(0,h.t)(869)}
              aria-label=${(0,h.t)(868)}
              .value=${this._searchQuery}
              @input=${e=>{this._searchQuery=e.target.value}}
            />
          </div>
          ${t.some(e=>e!==o.s6)?o.qy`<div class="dgroups">${t}</div>`:o.qy`<p class="no-results">${(0,h.t)(624,{query:this._searchQuery})}</p>`}
        </div>
      </div>
    `}};function Do(e,t){if(t)return{templateName:t,notSynced:e.not_synced||[],basePath:""}}function Io(e,t){return t?t.effective:e.entity}Ho.styles=[l.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .panel {
        display: grid;
        gap: 20px;
      }
      .rule-pick {
        display: grid;
        gap: 8px;
      }
      .rule {
        display: grid;
        gap: 16px;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .rule-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .rule-head h3 {
        margin: 0;
        flex: 1;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .tab-list {
        display: grid;
        gap: 4px;
      }
      .tab-list label {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 36px;
      }
      .danger-text {
        color: var(--mc-error-ink);
      }
      .danger-text:hover {
        background: color-mix(in srgb, var(--mc-error-ink) 10%, transparent);
      }
      .rule-conds {
        display: grid;
        gap: 12px;
      }
      .no-results {
        margin: 0;
      }
      .design-clip {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px 8px;
      }
      .design-clip .menu {
        top: calc(100% + 4px);
        left: 0;
        min-width: 200px;
      }
      .design-clip .clip-status {
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .sector-reset-row {
        display: flex;
        justify-content: flex-end;
        margin: -4px -8px -8px 0;
      }
      /* the collapsible groups inside the Tab bar sector */
      .subgroup {
        display: grid;
        gap: 12px;
      }
      .subgroup-head {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .subgroup-btn {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        min-height: 32px;
        padding: 0 8px 0 2px;
        border: 0;
        border-radius: var(--mc-radius);
        background: transparent;
        text-align: left;
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--mc-text);
      }
      .subgroup-btn:hover {
        background: var(--mc-surface-2);
      }
      .subgroup-btn .nm {
        flex: 1;
        min-width: 0;
      }
      .subgroup-btn .chev {
        --mdc-icon-size: 18px;
        color: var(--mc-text-2);
        transition: transform 0.15s ease-out;
      }
      .subgroup-btn[aria-expanded='false'] .chev {
        transform: rotate(-90deg);
      }
      .subgroup-body,
      .tab-notes {
        display: grid;
        gap: 16px;
      }
      .tab-notes {
        gap: 4px;
      }
      .subgroup-caption {
        margin: 4px 0 -4px;
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        color: var(--mc-text-2);
      }
      .tree-note {
        display: grid;
        gap: 4px;
        justify-items: start;
      }
      .fx-pair {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 8px;
      }
      .sublbl {
        display: block;
        margin-bottom: 4px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      /* headed groups (Layout, Style, Effects, Advanced) in one scrolling list */
      .dgroups {
        display: grid;
        gap: 12px;
      }
      .dgroup {
        display: grid;
        gap: 8px;
      }
      .dgroup-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        min-height: 40px;
        padding: 0 8px 0 4px;
        border: 0;
        border-radius: var(--mc-radius);
        background: color-mix(in srgb, var(--mc-surface-2) 55%, transparent);
        text-align: left;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--mc-text);
      }
      .dgroup-btn:hover {
        background: var(--mc-surface-2);
      }
      .dgroup-btn .nm {
        flex: 1;
        min-width: 0;
      }
      .dgroup-btn .chev {
        --mdc-icon-size: 20px;
        color: var(--mc-text-2);
        transition: transform 0.15s ease-out;
      }
      .dgroup-btn[aria-expanded='false'] .chev {
        transform: rotate(-90deg);
      }
      .dgroup-body {
        display: grid;
        gap: 16px;
      }
      @media (prefers-reduced-motion: reduce) {
        .dgroup-btn .chev,
        .subgroup-btn .chev {
          transition: none;
        }
      }
    `],So([(0,n.MZ)({attribute:!1})],Ho.prototype,"design",void 0),So([(0,n.MZ)({attribute:!1})],Ho.prototype,"hass",void 0),So([(0,n.MZ)({attribute:!1})],Ho.prototype,"onChange",void 0),So([(0,n.MZ)({type:Boolean})],Ho.prototype,"hasTemplate",void 0),So([(0,n.MZ)({attribute:!1})],Ho.prototype,"notSynced",void 0),So([(0,n.MZ)({type:String})],Ho.prototype,"moduleEntity",void 0),So([(0,n.MZ)({type:String})],Ho.prototype,"target",void 0),So([(0,n.MZ)({type:String})],Ho.prototype,"moduleType",void 0),So([(0,n.MZ)({type:String})],Ho.prototype,"moduleVariant",void 0),So([(0,n.MZ)({type:Boolean})],Ho.prototype,"hoverOnly",void 0),So([(0,n.MZ)({attribute:!1})],Ho.prototype,"tabs",void 0),So([(0,n.wk)()],Ho.prototype,"_openSectors",void 0),So([(0,n.wk)()],Ho.prototype,"_subOpen",void 0),So([(0,n.wk)()],Ho.prototype,"_groupOpen",void 0),So([(0,n.wk)()],Ho.prototype,"_searchQuery",void 0),So([(0,n.wk)()],Ho.prototype,"_activeView",void 0),So([(0,n.wk)()],Ho.prototype,"_pasteMenu",void 0),So([(0,n.wk)()],Ho.prototype,"_clipStatus",void 0),Ho=So([(0,n.EM)("mc-design-panel")],Ho);const Fo={actions:(e,t,i,o,n)=>{const a=e.actions,s=Do(e,o);return Ft(a,(t,n)=>{const s={...e,actions:{...a,[t]:n}};if(o){const i=new Set(e.not_synced||[]);for(const[e,o]of Object.entries(n))void 0!==o&&i.add(`actions.${t}.${e}`);s.not_synced=Array.from(i)}i(s)},t,Io(e,n),e=>(e=>{if(s)return{...s,basePath:`actions.${e}`}})(e))},conditions:(e,t,i,o)=>{const n=e.display,a=n?.conditions||[],s=n?.mode||"every",r=Do(e,o),l=t=>{i({...e,display:{...n,...t}})},c=r?{...r,basePath:"display"}:void 0;return Wt(a,s,{onAdd:()=>{const e={id:(0,v.$)("cond"),type:"state",entity:"",state:""};l({conditions:[...a,e]})},onUpdate:(e,t)=>{l({conditions:a.map((i,o)=>o===e?{...i,...t}:i)})},onRemove:e=>{l({conditions:a.filter((t,i)=>i!==e)})},onMode:e=>l({mode:e})},t,c,"module")},design:(e,t,i,n,a)=>{const s=e.design||{},r=!!n,l=e.not_synced||[];return o.qy`<mc-design-panel
    .design=${s}
    .hass=${t}
    .hasTemplate=${r}
    .notSynced=${l}
    .moduleEntity=${Io(e,a)||""}
    .moduleType=${e.type||""}
    .moduleVariant=${e.button_style||""}
    .tabs=${"tabs"===e.type?function(e){const t=e;return{labels:(Array.isArray(t.tabs)?t.tabs:[]).map(e=>e&&"object"==typeof e&&"string"==typeof e.label?e.label:""),style:"string"==typeof t.tab_style?t.tab_style:void 0}}(e):void 0}
    .onChange=${t=>{const o={...s},n={...e};if(t._markNotSynced){const i=[].concat(t._markNotSynced),o=new Set(e.not_synced||[]);for(const e of i)o.add(`design.${e}`);n.not_synced=Array.from(o),delete t._markNotSynced}if(t._markSynced){const i=new Set(e.not_synced||[]);for(const e of[].concat(t._markSynced))i.delete(`design.${e}`);n.not_synced=Array.from(i),delete t._markSynced}for(const[e,i]of Object.entries(t))void 0===i||""===i?delete o[e]:o[e]=i;i({...n,design:o})}}
  ></mc-design-panel>`}},Vo=()=>o.qy`<p class="help">${(0,h.t)(649)}</p>`;var No=i(6752),Zo=i(8504),Bo=i(6201);class Wo{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}}class Ko{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}}var Uo=i(7804);const Go=e=>!(0,Zo.sO)(e)&&"function"==typeof e.then,Yo=1073741823;class Qo extends Bo.Kq{constructor(){super(...arguments),this._$Cwt=Yo,this._$Cbt=[],this._$CK=new Wo(this),this._$CX=new Ko}render(...e){return e.find(e=>!Go(e))??No.c0}update(e,t){const i=this._$Cbt;let o=i.length;this._$Cbt=t;const n=this._$CK,a=this._$CX;this.isConnected||this.disconnected();for(let e=0;e<t.length&&!(e>this._$Cwt);e++){const s=t[e];if(!Go(s))return this._$Cwt=e,s;e<o&&s===i[e]||(this._$Cwt=Yo,o=0,Promise.resolve(s).then(async e=>{for(;a.get();)await a.get();const t=n.deref();if(void 0!==t){const i=t._$Cbt.indexOf(s);i>-1&&i<t._$Cwt&&(t._$Cwt=i,t.setValue(e))}}))}return No.c0}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}}const Jo=(0,Uo.u$)(Qo),Xo=(0,i(9682).Ev)("layer-editor",()=>i.e(708).then(()=>i(3616))),en=()=>Xo.load(),tn="margin:0 0 8px;color:var(--secondary-text-color)";function on(){if(Xo.ready())return o.s6;const e=o.qy`<p role="alert" style=${tn}>${(0,h.t)(504)}</p>`;if(Xo.failed())return e;const t=o.qy`<p role="status" style=${tn}>${(0,h.t)(537)}</p>`;return o.qy`${Jo(en().then(t=>t?o.s6:e),t)}`}const nn=function(){const e=new Map,t=t=>{const i=e.get(t);return i?[...i.tabs??Ot]:["general"]};return{register(t){e.set(t.type,t)},get:t=>e.get(t),tabs:t,render(i,n,a,s,r,l,c){const d=e.get(n.type);if(!d||!t(n.type).includes(i))return Vo();const h=d[i],u="general"===i?d.general:h??Fo[i];if(!u)return Vo();let p=u(n,a,s,r,l);return"design"===i&&c&&!1!==d.layerGroups&&(p=function(e,t,i,n,a){return o.qy`${on()}<mc-layer-design .config=${e} .hass=${t} .onChange=${i} .ctx=${n}>${a??o.s6}</mc-layer-design>`}(n,a,s,c,p)),"general"!==i||!l||d.entityField?p:o.qy`${jt(n,a,s,l,Do(n,r))}${p}`}}}();var an=i(3686);function sn(e,t,i){const o=(0,an.DH)(e.entity),n=(0,an.Xu)(e,t.up);return null===o?{up:n,walled:!0}:o&&!0===e.share_entity?{up:n,from:{id:o,from:i}}:{...t,up:n}}function rn(e,t,i){const o=(0,an.DH)(e.entity),n="string"==typeof o?o:void 0;let a={up:n,from:n?{id:n,from:"card"}:void 0};const s=void 0===t?void 0:e.rows?.[t];s&&(a=sn(s,a,"row"));const r=void 0===i?void 0:s?.columns?.[i];return r?sn(r,a,"column"):a}function ln(e,t,i){for(const o of t??[]){if(!e)break;i=sn(e,i,Rt[e.type]??"row");const t="row"===e.type?e.columns?.[o.slot]:void 0;t&&(i=sn(t,i,"column")),e=(0,$.yZ)(e)?.[o.slot]?.[o.index]}return{mod:e,s:i}}function cn(e,t,i){const o=(0,an.DH)(e?.entity),n={choice:void 0===o?"inherit":null===o?"none":"own"};return n.effective=e?(0,an.hY)(e,t.up,i):void 0,!1===i?n.cardModule=!0:(i&&(n.domains=i),t.from&&t.up&&(n.inherited=t.from),t.walled&&!t.up&&(n.walled=!0),n.inherited&&n.domains&&!n.domains.includes(n.inherited.id.split(".")[0])&&(n.mismatch=!0)),"string"!=typeof o||o.includes(".")||(n.invalidOwn=!0),n}function dn(e,t){const i=e.rows?.[t.row]?.columns?.[t.col]?.modules?.[t.module],{mod:o,s:n}=ln(i,t.child,rn(e,t.row,t.col));return cn(o,n,o?_.s.get(o.type)?.metadata.inherit:void 0)}function hn(e,t){const i=e.rows?.[t.row];if(void 0===t.slot)return cn(void 0===t.col?i:i?.columns?.[t.col],rn(e,void 0===t.col?void 0:t.row));const o=i?.columns?.[t.col]?.modules?.[t.module],n=ln(o,t.child,rn(e,t.row,t.col)),a=n.mod?sn(n.mod,n.s,Rt[n.mod.type]??"row"):n.s;return cn(n.mod?.columns?.[t.slot],a)}function un(e){return!0===nn.get(e)?.entityField}function pn(e){const t=e;return!("text"!==e.type||t.use_entity||t.use_template&&/entity/.test(t.text??""))}function mn(e){const t={following:0,needing:0,preferred:[]},i="string"==typeof(0,an.DH)(e.entity);return function(e,t){const i=(e,o,n,a,s)=>{t(e,{row:o,col:n,module:a,child:s}),(0,$.yZ)(e)?.forEach((e,t)=>e.forEach((e,r)=>i(e,o,n,a,[...s,{slot:t,index:r}])))};(e.rows??[]).forEach((e,t)=>e.columns?.forEach((e,o)=>e.modules?.forEach((e,n)=>i(e,t,o,n,[]))))}(e,(o,n)=>{if(!un(o.type)||pn(o))return;const a=dn(e,n);a.domains&&t.preferred.push(...a.domains),i&&"inherit"===a.choice&&!a.cardModule&&(a.mismatch?t.needing++:"card"===a.inherited?.from&&t.following++)}),t.preferred=[...new Set(t.preferred)],t}var gn=i(15);function fn(e){const t=(0,at.xc)(e);if("flow"===t)return o.s6;if("background"===t)return o.qy`<span class="lchip" data-layer="background" title=${(0,h.t)(135)}><ha-icon icon="mdi:arrange-send-to-back" aria-hidden="true"></ha-icon>${(0,h.t)(135)}</span>`;const i=(0,at.ZZ)(e).anchor,n=(0,at.m4)(i)?i:"top-left",a=(0,gn.H)(n).toLowerCase();return o.qy`<span class="lchip" data-layer="overlay" title=${(0,h.t)(681,{anchor:a})}><ha-icon icon="mdi:arrange-bring-to-front" aria-hidden="true"></ha-icon>${(0,h.t)(680)}${s=n,o.qy`<span class="lglyph" aria-hidden="true">${Array.from({length:9},(e,t)=>t===3*(e=>e.includes("top")?0:e.includes("bottom")?2:1)(s)+(e=>e.includes("left")?0:e.includes("right")?2:1)(s)?o.qy`<i class="on"></i>`:o.qy`<i></i>`)}</span>`}<span class="sr-only">, ${a}</span></span>`;var s}function vn(e,t=!1){let i=0;for(const o of e??[])if("flow"!==(0,at.xc)(o)&&i++,t)for(const e of(0,$.yZ)(o)??[])i+=vn(e,!0);return i}function bn(e){return e<=0?o.s6:o.qy`<span class="chip is-count lcount">${(0,h.t)(1257,{n:e})}</span>`}const yn=o.AH`.lchip{display:inline-flex;align-items:center;gap:4px;flex:none;min-height:20px;padding:0 8px;border:1px solid var(--mc-field-border);border-radius:9999px;background:var(--mc-surface);color:var(--mc-text);font-size:.75rem;font-weight:600;line-height:1;white-space:nowrap;--mdc-icon-size:14px}.lglyph{display:inline-grid;grid-template-columns:repeat(3,3px);gap:1px;width:14px;height:14px;flex:none}.lglyph i{border-radius:1px;background:var(--mc-field-border)}.lglyph i.on{background:var(--mc-text)}.lcount{gap:3px}@container mc-outline (max-width:280px){.lchip .lglyph{display:none}.lchip{padding:0 6px}}@media (forced-colors:active){.lchip{border-color:CanvasText}.lglyph i.on{background:CanvasText}}`;var _n=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};function wn(e){return e instanceof Element&&(e.matches('input, textarea, select, [contenteditable]:not([contenteditable="false"])')||!0===e.isContentEditable)}let $n=class extends o.WF{constructor(){super(...arguments),this.variant="pane",this._collapsed=new Set,this._focusKey=null,this._renaming=null,this._drop=null,this._pendingFocus=null,this._drag=null,this._ignoreClickUntil=0,this._lastSelKey="",this._renameReturn=null,this._itemMenu=new gt(this,{surface:"tree",focusSelection:()=>this._focusSelection(),rename:e=>this.startRename((0,w.iA)(e)),status:e=>this._status(e),deleteModule:e=>this._deleteModule(e),deleteRow:e=>{this.stateManager?.deleteRow(e),this._pendingFocus=e>0?(0,w.iA)({kind:"row",row:e-1}):"card",this.requestUpdate()},moveRow:(e,t)=>{this._moveRow(e,t),this._focusSelection()}}),this._longPress=new ft((e,t,i)=>this._contextAt(e,t,i)),this._onContextMenu=e=>{const t=e.composedPath();e.shiftKey||wn(t[0])||this._itemOnPath(t)&&(e.preventDefault(),this._longPress.cancel(),this._longPress.justFired||this._contextAt(t,e.clientX,e.clientY))}}connectedCallback(){super.connectedCallback(),this.stateManager&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0,this._subscribedTo=void 0,this._itemMenu.close(!1),this._longPress.cancel()}willUpdate(e){e.has("stateManager")&&this.stateManager!==this._subscribedTo&&this._subscribe()}updated(){const e=this._renaming?this.shadowRoot?.querySelector("input.rename"):null;if(e&&this.shadowRoot?.activeElement!==e&&(e.focus(),e.select()),this._pendingFocus){const e=this._pendingFocus;this._pendingFocus=null;const t=this._item(e)||this._item(this._selectedKey)||this._item("card");t&&(this._focusKey=t.dataset.key||null,t.focus())}}_subscribe(){this._unsubscribe?.(),this._subscribedTo=this.stateManager,this.stateManager?this._unsubscribe=this.stateManager.subscribe(e=>{this._state=e;const t=(0,w.iA)((0,w.c4)(e.selectedPath));t!==this._lastSelKey&&(this._lastSelKey=t,this._revealSelection(t))}):this._unsubscribe=void 0}_revealSelection(e){const t=(0,w.g1)(e);if("module"===t.kind||"column"===t.kind||"slot"===t.kind){const e=this._rowId(t.row);if(e&&this._collapsed.has(e)){const t=new Set(this._collapsed);t.delete(e),this._collapsed=t}}this.updateComplete.then(()=>{const t=this._item(e);this.isConnected&&t&&"function"==typeof t.scrollIntoView&&t.scrollIntoView({block:"nearest"})})}get _rows(){return this._state?.config.rows||[]}get _selectedKey(){return(0,w.iA)((0,w.c4)(this._state?.selectedPath??null))}_rowId(e){const t=this._rows[e];return t?t.id||`#${e}`:void 0}_isOpen(e){return!this._collapsed.has(this._rowId(e)||"")}_item(e){return this.shadowRoot?.querySelector(`[role="treeitem"][data-key="${e}"]`)||null}_visibleItems(){return Array.from(this.shadowRoot?.querySelectorAll('[role="treeitem"][data-key]')||[])}_select(e){this._focusKey=(0,w.iA)(e),this.stateManager?.setSelectedPath((0,w.bm)(e))}_setCollapsed(e,t){const i=this._rowId(e);if(!i||this._collapsed.has(i)===t)return;const o=new Set(this._collapsed);t?o.add(i):o.delete(i),this._collapsed=o}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:t}))}_addModule(e,t){this._fire("add-module",{rowIndex:e,colIndex:t})}_addChild(e,t){this._fire("add-module",{rowIndex:e.row,colIndex:e.col,moduleIndex:e.module,child:e.child,slot:t})}_addSlot(e,t){const i=this.stateManager;"tabs"===t?i?.addTab(e.row,e.col,e.module,e.child):i?.addNestedColumn(e.row,e.col,e.module,e.child),this._focusSelection()}_deleteSlot(e){const t=this.stateManager,i=this._state?(0,w.kW)(this._state.config,e):void 0;t&&i&&("tabs"===i.type?t.deleteTab(e.row,e.col,e.module,e.child,e.slot):t.deleteNestedColumn(e.row,e.col,e.module,e.child,e.slot),this._focusSelection())}_moveSlot(e,t){const i=this.stateManager,o=this._state?(0,w.kW)(this._state.config,e):void 0;i&&o&&("tabs"===o.type?i.moveTab(e.row,e.col,e.module,e.child,e.slot,t):i.moveNestedColumn(e.row,e.col,e.module,e.child,e.slot,t),this._focusSelection())}startRename(e,t){const i=(0,w.g1)(e);"card"!==i.kind&&"row"!==i.kind&&this._setCollapsed(i.row,!1),this._renameReturn=t??null,this._focusKey=e,this._renaming=e}_defaultLabel(e){const t=this._state?.config;if(!t)return;if("row"===e.kind)return(0,h.t)(843,{n:e.row+1});if("column"===e.kind)return(0,h.t)(218,{n:e.col+1});if("slot"===e.kind)return(0,h.t)(218,{n:e.slot+1});const i="module"===e.kind?(0,w.cv)(t,e):void 0;return i?mt({...i,editor_name:void 0}):void 0}_renameValue(e){const t=this._state?.config;if(!t)return"";const i=(0,w.R9)(t,e);return"card"===e.kind?t.name??"":"slot"===e.kind&&"tabs"===(0,w.kW)(t,e)?.type?String(i?.label??""):(0,w.Hn)(i)??this._defaultLabel(e)??""}_commitRename(e,t,i=!1){this._renaming===(0,w.iA)(e)&&(this._renaming=null,this.stateManager?.setLayerName(e,t,this._defaultLabel(e)),this._afterRename(e,i))}_afterRename(e,t=!1){const i=this._renameReturn;this._renameReturn=null,t?i?.isConnected&&this._fire("mc-rename-done"):i?.isConnected?(this.updateComplete.then(()=>i.focus({preventScroll:!0})),this._fire("mc-rename-done")):this._pendingFocus=(0,w.iA)(e),this.requestUpdate()}_onRenameKeydown(e,t){e.stopPropagation(),"Enter"===e.key?(e.preventDefault(),this._commitRename(t,e.target.value)):"Escape"===e.key&&(e.preventDefault(),this._renaming=null,this._afterRename(t))}_renderRename(e,t){return o.qy`<input class="rename" aria-label=${t} .value=${this._renameValue(e)}
      @click=${e=>e.stopPropagation()}
      @keydown=${t=>this._onRenameKeydown(t,e)}
      @blur=${t=>this._commitRename(e,t.target.value,!0)} />`}_hiddenMark(e){return(0,w.Ak)(e)?o.qy`<ha-icon class="hid-ico" icon="mdi:eye-off-outline" title=${(0,h.t)(441)}></ha-icon><span class="sr-only">${(0,h.t)(441)}</span>`:o.s6}_status(e){"layers"===this.variant?this._fire("mc-status",{message:e}):document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:e}}))}_itemOnPath(e){for(const t of e){if(t===this)return null;if(t instanceof HTMLElement&&"treeitem"===t.getAttribute("role")&&t.dataset.key)return t}return null}_contextAt(e,t,i){const o=this._itemOnPath(e);if(!o||!this.stateManager)return;const n=(0,w.g1)(o.dataset.key||"card");this._focusKey=(0,w.iA)(n),this.stateManager.setSelectedPath((0,w.bm)(n),{reveal:!1}),this._ignoreClickUntil=Date.now()+400,this._itemMenu.open(n,o,{point:{x:t,y:i},returnFocus:o})}_slotTotal(e){const t=this._state?(0,w.kW)(this._state.config,e):void 0;return(0,$.yZ)(t)?.length??0}_slotCount(e){const t=this._state?(0,w.kW)(this._state.config,e):void 0;return(0,$.yZ)(t)?.[e.slot]?.length??0}_addColumn(e){const t=this.stateManager;t&&this._rows[e]&&(t.addColumn(e),this._select({kind:"column",row:e,col:this._rows[e].columns.length-1}))}_requestAddRow(){this._fire("request-add-row")}_moveRow(e,t){const i=this.stateManager;if(!i||e===t||t<0||t>=this._rows.length)return;const o=i.getState().selectedPath;if(i.moveRow(e,t),o&&void 0!==o.rowIndex){const n=function(e,t,i){return e===t?i:t<e&&e<=i?e-1:i<=e&&e<t?e+1:e}(o.rowIndex,e,t);n!==o.rowIndex&&i.setSelectedPath({...o,rowIndex:n})}}_onButton(e){return e.composedPath().some(e=>e instanceof HTMLButtonElement)}_rename(e,t){this._onButton(e)||this.startRename(t)}_onItemClick(e){if(Date.now()<this._ignoreClickUntil||this._onButton(e))return;const t=e.currentTarget.dataset.key;t&&this._select((0,w.g1)(t))}_onKeydown(e){const t=e.composedPath()[0];if(wn(t))return;if(this._itemMenu.isOpen)return;const i=t instanceof Element?t.closest('[role="treeitem"]'):null;if(!i||i!==t)return;const o=i.dataset.key||"card",n=(0,w.g1)(o);if(!this.stateManager)return;const a=()=>{e.preventDefault(),e.stopPropagation()};if(e.altKey&&("ArrowUp"===e.key||"ArrowDown"===e.key)){const t="ArrowUp"===e.key?-1:1;if("module"===n.kind)a(),this._moveModuleBy(n,t);else if("slot"===n.kind)a(),this._moveSlot(n,t);else if("row"===n.kind){a();const e=n.row+t;e>=0&&e<this._rows.length&&(this._moveRow(n.row,e),this._pendingFocus=(0,w.iA)({kind:"row",row:e}),this.requestUpdate())}return}switch(e.key){case"ArrowDown":case"ArrowUp":case"Home":case"End":{a();const t=this._visibleItems(),o=t.indexOf(i),n="ArrowDown"===e.key?Math.min(t.length-1,o+1):"ArrowUp"===e.key?Math.max(0,o-1):"Home"===e.key?0:t.length-1;return void this._focusItem(t[n])}case"ArrowRight":return void("row"===n.kind&&(a(),this._isOpen(n.row)?this._focusItem(this._item((0,w.iA)({kind:"column",row:n.row,col:0}))):this._setCollapsed(n.row,!1)));case"ArrowLeft":return void("row"===n.kind?(a(),this._setCollapsed(n.row,!0)):"column"!==n.kind&&"module"!==n.kind&&"slot"!==n.kind||(a(),this._focusItem(this._item((0,w.iA)((0,w.tw)(n,this._state?.config))))));case"Enter":case" ":return a(),void this._select(n);case"Delete":case"Backspace":if("module"===n.kind)return a(),void this._deleteModule(n)}const s=i.querySelector(":scope > .more")??i;this._itemMenu.shortcut(e,n,s,{returnFocus:i})&&a()}_moveModuleBy(e,t){const i=this.stateManager;i?.moveModuleBy(e.row,e.col,e.module,t,e.child)&&this._focusSelection()}_deleteModule(e){const t=this.stateManager;if(!t)return;if(e.child?.length)return t.deleteModule(e.row,e.col,e.module,e.child),void this._focusSelection();t.deleteModule(e.row,e.col,e.module);const i=this._rows[e.row]?.columns[e.col]?.modules?.length??0;this._pendingFocus=i?(0,w.iA)({...e,module:Math.min(e.module,i-1)}):(0,w.iA)({kind:"column",row:e.row,col:e.col}),this.requestUpdate()}_focusSelection(){const e=this.stateManager;e&&(this._pendingFocus=(0,w.iA)((0,w.c4)(e.getState().selectedPath)),this.requestUpdate())}_focusItem(e){e&&(this._focusKey=e.dataset.key||null,e.focus())}_openMenuFor(e,t){this._itemMenu.open(e,t.currentTarget)}_menuOpenFor(e){return this._itemMenu.openKey===(0,w.iA)(e)}_onRowDragStart(e,t){this._itemMenu.close(!1),this._longPress.cancel(),this._drag={type:"row",row:t},e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._drag))),e.currentTarget.closest("li")?.classList.add("dragging"),e.stopPropagation()}_onModuleDragStart(e,t){this._itemMenu.close(!1),this._longPress.cancel(),this._drag={type:"module",sel:t},e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._drag))),e.currentTarget.closest("li")?.classList.add("dragging"),e.stopPropagation()}_onDragEnd(e){e.currentTarget.closest("li")?.classList.remove("dragging"),this._drag=null,this._drop=null,this._ignoreClickUntil=Date.now()+250}_dropZone(e){const t=this._drop;return"place"===t?.type&&t.key===e?t.zone:void 0}_zoneClass(e){return"before"===e?"drop-before":"after"===e?"drop-after":"inside"===e?"drop-into":""}_isLowerHalf(e,t){const i=t.getBoundingClientRect();return e.clientY>i.top+i.height/2}_setDrop(e){const t=this._drop;t&&e&&t.type===e.type&&("row"===t.type?t.index===e.index:t.key===e.key&&t.zone===e.zone)||!t&&!e||(this._drop=e)}_onRowDragOver(e,t){"row"===this._drag?.type&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._setDrop({type:"row",index:this._isLowerHalf(e,e.currentTarget)?t+1:t}))}_onRowDrop(e){e.preventDefault();const t=this._drag,i=this._drop;if(this._drag=null,this._drop=null,"row"!==t?.type||"row"!==i?.type)return;const o=i.index>t.row?i.index-1:i.index;this._moveRow(t.row,o)}_onItemDragOver(e,t){const i=this._drag;if("module"!==i?.type||!this._state)return;e.stopPropagation();const o=e.currentTarget;!function(e,t){let i=e;for(;i&&i.scrollHeight<=i.clientHeight+1;)i=i.parentElement??i.getRootNode().host??null;if(!i)return;const o=i.getBoundingClientRect();t<o.top+32?i.scrollTop-=12:t>o.bottom-32&&(i.scrollTop+=12)}(o,e.clientY);const n="module"===t.kind?(0,w.cv)(this._state.config,t):void 0,a=((0,$.QN)(n)&&o.querySelector(":scope > .line")||o).getBoundingClientRect(),s=a.height?(e.clientY-a.top)/a.height:.5,r="module"===t.kind?function(e,t){return!(0,$.QN)(e)||(0,$.WA)(e)?t<.5?"before":"after":t<.25?"before":t>.75?"after":"inside"}(n,s):"inside",l=ct(this._state.config,t,r);if(!l||!function(e,t){return!rt(e,t)&&!function(e,t){if(t.row!==e.row||t.col!==e.col)return!1;const i=e.child??[];if(!i.length)return void 0===t.module&&(t.index===e.module||t.index===e.module+1);const o=i[i.length-1],n=i.slice(0,-1),a=t.child??[],s=t.module===e.module&&t.slot===o.slot&&a.length===n.length&&n.every((e,t)=>a[t].slot===e.slot&&a[t].index===e.index);return s&&(t.index===o.index||t.index===o.index+1)}(e,t)}(i.sel,l))return e.dataTransfer&&(e.dataTransfer.dropEffect="none"),void this._setDrop(null);e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._setDrop({type:"place",key:(0,w.iA)(t),zone:r,place:l})}_dropModule(e){if("module"!==this._drag?.type)return;e.preventDefault(),e.stopPropagation();const t=this._drag,i=this._drop;if(this._drag=null,this._drop=null,this._ignoreClickUntil=Date.now()+300,"place"!==i?.type||!this.stateManager)return;const o=lt(this.stateManager.getConfig(),t.sel,i.place);o&&(this.stateManager.updateConfig(o.config),this.stateManager.setSelectedPath(o.path),this._status((0,h.t)(605,{name:this._moduleName((0,w.cv)(o.config,(0,w.c4)(o.path))),where:this._placeName(o.config,i.place)})))}_placeName(e,t){const i=(0,h.t)(845,{row:t.row+1,column:t.col+1});if(void 0===t.module)return i;const o=e.rows[t.row]?.columns[t.col]?.modules[t.module],n=(0,$.Rv)(o,t.child??[]);if(!n)return i;const a=(0,V.D)(n,t.slot??0);return a?(0,h.t)(1278,{name:this._moduleName(n),slot:a}):this._moduleName(n)}_onTreeDragLeave(e){const t=e.relatedTarget;t&&e.currentTarget.contains(t)||(this._drop=null)}_itemAttrs(e,t,i){return{current:e===t,tab:e===i?0:-1}}render(){const e=this._rows,t=this._selectedKey,i=this._resolveFocusKey(t),n=this._state?.config.name?.trim()||(0,h.t)(167),a=this._itemAttrs("card",t,i),s="card"===this._renaming;return o.qy`
      <div
        class="outline-root"
        @keydown=${this._onKeydown}
        @contextmenu=${this._onContextMenu}
        @pointerdown=${this._longPress.down}
        @pointermove=${this._longPress.move}
        @pointerup=${this._longPress.cancel}
        @pointercancel=${this._longPress.cancel}
        @dragstart=${this._longPress.cancel}
      >
        <ul
          class="tree"
          role="tree"
          aria-label=${(0,h.t)(178)}
          @dragleave=${this._onTreeDragLeave}
        >
          <li role="none">
            <div class="line">
              <div
                class="item card-item k-card"
                role="treeitem"
                aria-level="1"
                data-key="card"
                tabindex=${a.tab}
                aria-selected=${a.current?"true":"false"}
                aria-current=${a.current?"true":o.s6}
                @click=${this._onItemClick}
                @dblclick=${()=>this.startRename("card")}
              >
                <ha-icon icon="mdi:card-outline"></ha-icon>
                ${s?this._renderRename({kind:"card"},(0,h.t)(175)):o.qy`<span class="text"><span class="name">${n}</span></span>`}
              </div>
            </div>
          </li>
          ${e.map((e,o)=>this._renderRow(e,o,t,i))}
        </ul>
        ${e.length?o.qy`
              <div class="foot">
                <button type="button" class="btn btn-secondary btn-sm" @click=${this._requestAddRow}>
                  <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(50)}
                </button>
              </div>
            `:o.qy`
              <div class="empty card-empty">
                <ha-icon icon="mdi:view-sequential-outline"></ha-icon>
                <strong>${(0,h.t)(645)}</strong>
                <p>${(0,h.t)(847)}</p>
                <button type="button" class="btn btn-text btn-sm" @click=${this._requestAddRow}>
                  <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(50)}
                </button>
              </div>
            `}
        ${this._itemMenu.render()}
      </div>
    `}_resolveFocusKey(e){if(this._focusKey&&this._keyRendered(this._focusKey))return this._focusKey;if(this._keyRendered(e))return e;const t=(0,w.g1)(e);return"card"!==t.kind&&this._keyRendered(`r${t.row}`)?`r${t.row}`:"card"}_keyRendered(e){const t=(0,w.g1)(e);if("card"===t.kind)return!0;const i=this._rows[t.row];return!!i&&("row"===t.kind||!!this._isOpen(t.row)&&(!!i.columns[t.col]&&("column"===t.kind||("slot"===t.kind?!!this._state&&(0,w.V9)((0,w.Sh)(this._state.config,t),t):!!this._state&&!!(0,w.cv)(this._state.config,t)))))}_renderGlyph(e){return yt((0,f.U$)((0,f.JR)(e)))}_renderRow(e,t,i,n){const a=(0,w.iA)({kind:"row",row:t}),s=this._itemAttrs(a,i,n),r=this._isOpen(t),l=this._drop,c="row"===l?.type&&l.index===t,d="row"===l?.type&&t===this._rows.length-1&&l.index===t+1,u={kind:"row",row:t},p=this._menuOpenFor(u),m=(0,w.Hn)(e)??(0,h.t)(843,{n:t+1}),g=this._renaming===a;return o.qy`
      <li
        role="none"
        class="row ${c?"drop-before":""} ${d?"drop-after":""}"
        @dragover=${e=>this._onRowDragOver(e,t)}
        @drop=${this._onRowDrop}
      >
        <div class="line k-row" role="treeitem" aria-level="2" data-key=${a} data-hidden=${(0,w.Ak)(e)?"":o.s6} tabindex=${s.tab} aria-labelledby=${`i-${a}`}
          aria-expanded=${r?"true":"false"} aria-selected=${s.current?"true":"false"} aria-current=${s.current?"true":o.s6}
          draggable="true" @dragstart=${e=>this._onRowDragStart(e,t)} @dragend=${this._onDragEnd}
          @click=${this._onItemClick} @dblclick=${e=>this._rename(e,a)}>
          <button
            type="button"
            class="caret"
            tabindex="-1"
            aria-expanded=${r?"true":"false"}
            aria-label=${r?(0,h.t)(203,{n:t+1}):(0,h.t)(375,{n:t+1})}
            @click=${()=>this._setCollapsed(t,r)}
          >
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <div
            class="item row-item k-row"
            id=${`i-${a}`}
            data-hidden=${(0,w.Ak)(e)?"":o.s6}
            data-current=${s.current?"":o.s6}
          >
            ${g?this._renderRename(u,(0,h.t)(842)):"pane"===this.variant?o.qy`${this._renderGlyph(e)}<span class="text"><span class="name">${m} · ${(0,f.SU)(e)?"custom":e.layout||"1"}</span>${this._containerEntity(e,{row:t})}</span>`:o.qy`<span class="text"><span class="name">${m}</span>${this._containerEntity(e,{row:t})}</span>${this._renderGlyph(e)}`}
            ${this._hiddenMark(e)}
          </div>
          <button
            type="button"
            class="icon-btn sm more"
            aria-label=${(0,h.t)(1272,{name:m})}
            aria-haspopup="menu"
            aria-expanded=${p?"true":"false"}
            @click=${e=>this._openMenuFor(u,e)}
          >
            <ha-icon icon="mdi:dots-vertical"></ha-icon>
          </button>
        </div>
        ${r?o.qy`<ul role="group">
              ${e.columns.map((e,o)=>this._renderColumn(t,o,e.modules??[],i,n))}
              ${this._renderAddColumn(t)}
            </ul>`:o.s6}
      </li>
    `}_renderColumn(e,t,i,n,a){const s=(0,w.iA)({kind:"column",row:e,col:t}),r=this._itemAttrs(s,n,a),l=i.length,c={kind:"column",row:e,col:t},d="inside"===this._dropZone(s),u=this._menuOpenFor(c),p=this._rows[e]?.columns[t],m=(0,w.Hn)(p)??(0,h.t)(218,{n:t+1});return o.qy`
      <li role="none" class="col ${d&&l?"drop-into":""}">
        <div class="line k-column" role="treeitem" aria-level="3" data-key=${s} data-hidden=${(0,w.Ak)(p)?"":o.s6} tabindex=${r.tab} aria-labelledby=${`i-${s}`}
          aria-selected=${r.current?"true":"false"} aria-current=${r.current?"true":o.s6}
          @click=${this._onItemClick} @dblclick=${e=>this._rename(e,s)}
          @dragover=${e=>this._onItemDragOver(e,c)} @drop=${this._dropModule}>
          <div
            class="item col-item k-column"
            id=${`i-${s}`}
            data-hidden=${(0,w.Ak)(p)?"":o.s6}
            data-current=${r.current?"":o.s6}
          >
            ${this._renaming===s?this._renderRename(c,(0,h.t)(215)):o.qy`<span class="text"><span class="name">${m}</span>${this._containerEntity(p,{row:e,col:t})}</span>`}
            ${this._hiddenMark(p)}
            ${this.stateManager?.ownsModuleList(c)?o.qy`<ha-icon class="own-ico" icon="mdi:format-list-bulleted" title=${(0,h.t)(712)}></ha-icon><span class="sr-only">${(0,h.t)(711)}</span>`:o.s6}
            <span class="chip is-count">${l}<span class="sr-only"> ${(0,h.t)(1265,{n:l})}</span></span>
            ${bn(vn(i))}
          </div>
          <button
            type="button"
            class="icon-btn sm more"
            aria-label=${(0,h.t)(846,{row:e+1,column:t+1})}
            aria-haspopup="menu"
            aria-expanded=${u?"true":"false"}
            @click=${e=>this._openMenuFor(c,e)}
          >
            <ha-icon icon="mdi:dots-vertical"></ha-icon>
          </button>
        </div>
        ${l?o.qy`<ul role="group">
              ${i.map((i,o)=>this._renderModule(i,e,t,o,n,a))}
              ${"layers"===this.variant?this._renderAddRow(e,t):o.s6}
            </ul>`:o.qy`
              <div
                class="empty col-empty ${d?"drop-into":""}"
                role="treeitem"
                aria-level="4"
                data-empty=${s}
                @dragover=${e=>this._onItemDragOver(e,c)}
                @drop=${this._dropModule}
              >
                <p>${(0,h.t)(346)}</p>
                <button
                  type="button"
                  class="btn btn-text btn-sm"
                  aria-label=${(0,h.t)(46,{row:e+1,column:t+1})}
                  @click=${()=>this._addModule(e,t)}
                >
                  <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(45)}
                </button>
              </div>
            `}
      </li>
    `}_renderAddRow(e,t){return o.qy`
      <li role="treeitem" aria-level="4" class="add-mod">
        <button
          type="button"
          class="btn btn-text btn-sm"
          aria-label=${(0,h.t)(46,{row:e+1,column:t+1})}
          @click=${()=>this._addModule(e,t)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(45)}
        </button>
      </li>
    `}_renderAddColumn(e){return o.qy`
      <li role="treeitem" aria-level="3" class="add-col">
        <button
          type="button"
          class="btn btn-text btn-sm"
          aria-label=${(0,h.t)(38,{row:e+1})}
          @click=${()=>this._addColumn(e)}
        >
          <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(37)}
        </button>
      </li>
    `}_followedEntity(e,t){const i=this._state?.config;if(!i||pn(e)||!un(e.type)&&!(0,$.QN)(e))return o.s6;const n=dn(i,t),a=n.inherited;return"none"===n.choice?o.qy`<span class="sub">${(0,h.t)(631)}</span>`:"inherit"!==n.choice||n.cardModule||!a?o.s6:n.mismatch?o.qy`<span class="sub is-mismatch"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon>${(0,h.t)(622,{kind:Mt(1===n.domains?.length?n.domains[0]:void 0)})}<span class="sr-only">${(0,h.t)(361)}</span></span>`:o.qy`<span class="sub is-inherited"><ha-icon icon="mdi:link-variant" aria-hidden="true"></ha-icon><span class="sr-only">${(0,h.t)(488)} </span>${"pane"===this.variant?o.qy`${(0,h.t)(858,{source:Ct(a.from)})} · `:o.s6}${"layers"===this.variant?a.id:(0,w.rb)(a.id)}</span>`}_renderModule(e,t,i,n,a,s){const r=(0,w.br)(t,i,n),l=(0,w.iA)(r),c=this._itemAttrs(l,a,s),d=_.s.get(e.type)?.metadata.icon||"mdi:puzzle-outline",u="string"==typeof e.entity&&w.Y.test(e.entity)?e.entity:void 0,p=u?o.s6:this._followedEntity(e,r),m=!!e.not_synced?.length,g=this._dropZone(l);return o.qy`
      <li
        role="none"
        class="mod ${this._zoneClass(g)}"
        @dragover=${e=>this._onItemDragOver(e,r)}
        @drop=${this._dropModule}
      >
        <div class="line mod-line k-module" role="treeitem" aria-level="4" data-key=${l} data-hidden=${(0,w.Ak)(e)?"":o.s6} tabindex=${c.tab} aria-labelledby=${`i-${l}`}
          aria-selected=${c.current?"true":"false"} aria-current=${c.current?"true":o.s6}
          draggable=${this._renaming===l?"false":"true"} @dragstart=${e=>this._onModuleDragStart(e,r)} @dragend=${this._onDragEnd}
          @click=${this._onItemClick} @dblclick=${e=>this._rename(e,l)}>
          <div
            class="item mod-item k-module"
            id=${`i-${l}`}
            data-hidden=${(0,w.Ak)(e)?"":o.s6}
            data-current=${c.current?"":o.s6}
          >
            <ha-icon icon=${d}></ha-icon>
            ${this._renaming===l?this._renderRename(r,(0,h.t)(589)):o.qy`<span class="text">
                  <span class="name">${mt(e)}</span>
                  ${u?o.qy`<span class="sub is-entity">${(0,w.rb)(u)}</span>`:p}
                </span>`}
            ${fn(e)}
            ${bn(vn((0,$.yZ)(e)?.flat()))}
            ${this._hiddenMark(e)}
            ${m?o.qy`<span class="ovr-dot" title=${(0,h.t)(435)}></span><span class="sr-only">${(0,h.t)(435)}</span>`:o.s6}
          </div>
          ${this._renderModuleMore(e,r,c.tab)}
        </div>
        ${this._renderChildren(e,t,i,n,[],5,a,s)}
      </li>
    `}_renderChildren(e,t,i,n,a,s,r,l){const c=(0,$.yZ)(e);if(!c)return o.s6;const d=(0,w.br)(t,i,n,a);if(!(0,$.WA)(e))return o.qy`<ul role="group">
        ${(c[0]??[]).map((e,t)=>this._renderChild(e,d,0,t,s,r,l))}
        ${this._renderAddChild(d,0,this._moduleName(e),s)}
      </ul>`;const u="tabs"===e.type,p=u?[]:(0,f.U$)((0,f.JR)(e));return o.qy`<ul role="group">
      ${c.map((c,m)=>{const g=(0,w.r$)(t,i,n,a,m),f=(0,w.iA)(g),v=this._itemAttrs(f,r,l),b=this._state?(0,w.R9)(this._state.config,g):void 0,y=(u?void 0:(0,w.Hn)(b))??(0,V.D)(e,m),_=u?e.tabs?.[m]?.icon||"mdi:tab":"",$=c.length,k=this._menuOpenFor(g),x=this._renaming===f;return o.qy`
          <li role="none" class="col slot ${this._zoneClass(this._dropZone(f))}"
            @dragover=${e=>this._onItemDragOver(e,g)}
            @drop=${this._dropModule}
          >
            <div class="line mod-line k-column" role="treeitem" aria-level=${s} data-key=${f} data-hidden=${(0,w.Ak)(b)?"":o.s6} tabindex=${v.tab} aria-labelledby=${`i-${f}`}
              aria-selected=${v.current?"true":"false"} aria-current=${v.current?"true":o.s6}
              @click=${this._onItemClick} @dblclick=${e=>this._rename(e,f)}>
              <div
                class="item col-item slot-item k-column"
                id=${`i-${f}`}
                data-hidden=${(0,w.Ak)(b)?"":o.s6}
                data-current=${v.current?"":o.s6}
              >
                ${u?o.qy`<ha-icon icon=${_}></ha-icon>`:o.s6}
                ${x?this._renderRename(g,u?(0,h.t)(1016):(0,h.t)(215)):o.qy`<span class="text"><span class="name">${y}</span>${u?o.s6:this._containerEntity(b??{},{row:d.row,col:d.col,module:d.module,child:d.child,slot:m})}</span>`}
                ${this._hiddenMark(b)}
                ${u?o.s6:o.qy`<span class="slot-glyph">${yt(p,m)}</span>`}
                <span class="chip is-count">${$}<span class="sr-only"> ${(0,h.t)(1265,{n:$})}</span></span>
                ${bn(vn(c))}
              </div>
              <button
                type="button"
                class="icon-btn sm more"
                tabindex=${v.tab}
                aria-label=${(0,h.t)(1272,{name:y})}
                aria-haspopup="menu"
                aria-expanded=${k?"true":"false"}
                @click=${e=>this._openMenuFor(g,e)}
              >
                <ha-icon icon="mdi:dots-vertical"></ha-icon>
              </button>
            </div>
            <ul role="group">
              ${c.map((e,t)=>this._renderChild(e,d,m,t,s+1,r,l))}
              ${this._renderAddChild(d,m,`${this._moduleName(e)} ${y}`,s+1)}
            </ul>
          </li>
        `})}
      <li role="treeitem" aria-level=${s} class="add-col">
        <button type="button" class="btn btn-text btn-sm" aria-label=${u?(0,h.t)(53,{name:this._moduleName(e)}):(0,h.t)(39,{name:this._moduleName(e)})}
          @click=${()=>this._addSlot(d,e.type)}>
          <ha-icon icon="mdi:plus"></ha-icon>${u?(0,h.t)(52):(0,h.t)(37)}
        </button>
      </li>
    </ul>`}_containerEntity(e,t){const i=this._state?.config;if(!i)return o.s6;if("none"===hn(i,t).choice)return o.qy`<span class="sub">${(0,h.t)(631)}</span>`;const n="string"==typeof e.entity&&w.Y.test(e.entity)?e.entity:void 0;return n?o.qy`<span class="sub is-entity">${!0===e.share_entity?o.qy`<ha-icon icon="mdi:link-variant" aria-hidden="true"></ha-icon><span class="sr-only">${(0,h.t)(911)} </span>`:o.s6}${(0,w.rb)(n)}</span>`:o.s6}_renderChild(e,t,i,n,a,s,r){const l=[...t.child??[],{slot:i,index:n}],c=(0,w.br)(t.row,t.col,t.module,l),d=(0,w.iA)(c),u=this._itemAttrs(d,s,r),p=_.s.get(e.type)?.metadata.icon||"mdi:puzzle-outline",m=mt(e),g="string"==typeof e.entity&&w.Y.test(e.entity)?e.entity:void 0,f=g?o.s6:this._followedEntity(e,c);return o.qy`
      <li role="none" class="mod child ${this._zoneClass(this._dropZone(d))}"
        @dragover=${e=>this._onItemDragOver(e,c)}
        @drop=${this._dropModule}
      >
        <div class="line mod-line k-module" role="treeitem" aria-level=${a} data-key=${d} data-hidden=${(0,w.Ak)(e)?"":o.s6} tabindex=${u.tab} aria-labelledby=${`i-${d}`}
          aria-selected=${u.current?"true":"false"} aria-current=${u.current?"true":o.s6}
          draggable=${this._renaming===d?"false":"true"} @dragstart=${e=>this._onModuleDragStart(e,c)} @dragend=${this._onDragEnd}
          title=${"layers"===this.variant?`${m}${g?` · ${g}`:""}`:o.s6}
          @click=${this._onItemClick} @dblclick=${e=>this._rename(e,d)}>
          <div
            class="item mod-item k-module"
            id=${`i-${d}`}
            data-hidden=${(0,w.Ak)(e)?"":o.s6}
            data-current=${u.current?"":o.s6}
          >
            <ha-icon icon=${p}></ha-icon>
            ${this._renaming===d?this._renderRename(c,(0,h.t)(589)):o.qy`<span class="text">
                  <span class="name">${m}</span>
                  ${g?o.qy`<span class="sub is-entity">${"layers"===this.variant?g:(0,w.rb)(g)}</span>`:f}
                </span>`}
            ${fn(e)}
            ${bn(vn((0,$.yZ)(e)?.flat()))}
            ${this._hiddenMark(e)}
          </div>
          ${this._renderModuleMore(e,c,u.tab)}
        </div>
        ${this._renderChildren(e,t.row,t.col,t.module,l,a+1,s,r)}
      </li>
    `}_renderAddChild(e,t,i,n){return o.qy`
      <li role="treeitem" aria-level=${n} class="add-mod">
        <button type="button" class="btn btn-text btn-sm" aria-label=${(0,h.t)(47,{where:i})} @click=${()=>this._addChild(e,t)}>
          <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(45)}
        </button>
      </li>
    `}_moduleName(e){return mt(e)}_renderModuleMore(e,t,i){const n=this._menuOpenFor(t);return o.qy`
      <button
        type="button"
        class="icon-btn sm more"
        tabindex=${i}
        aria-label=${(0,h.t)(592,{name:this._moduleName(e)})}
        aria-haspopup="menu"
        aria-expanded=${n?"true":"false"}
        @click=${e=>this._openMenuFor(t,e)}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    `}};$n.styles=[l.x,vt,yn,o.AH`
      :host {
        display: block;
        container: mc-outline / inline-size;
        --o-item-h: 36px;
        --o-mod-h: 36px;
        --o-icon: 18px;
        --o-gap: 8px;
        --o-font: 0.8125rem;
      }
      :host([variant='pane']) {
        --o-item-h: 40px;
        --o-mod-h: 48px;
        --o-icon: 20px;
        --o-gap: 12px;
        --o-font: 0.875rem;
      }

      .tree,
      .tree ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .tree ul {
        padding-left: 12px;
        margin-left: 12px;
        border-left: 1px solid var(--mc-divider);
      }
      .line {
        display: flex;
        align-items: center;
        gap: 2px;
        min-width: 0;
      }

      .item {
        flex: 1;
        min-width: 0;
        display: flex;
        /* a chip that does not fit drops to the next line instead of squeezing the name to one letter per line */
        flex-wrap: wrap;
        align-items: center;
        gap: var(--o-gap);
        min-height: var(--o-item-h);
        padding: 6px 8px;
        border: 1px solid transparent;
        border-radius: var(--mc-radius);
        font-size: var(--o-font);
        color: var(--mc-text);
        cursor: pointer;
        user-select: none;
        transition: background-color 0.15s ease-out, border-color 0.15s ease-out;
      }
      .item:hover {
        background: var(--mc-surface-2);
      }
      /* The line is the tree item (it owns the caret and the menu button); the plate inside it shows the ring. */
      .line:focus-visible {
        outline: none;
      }
      .line:focus-visible > .item,
      .card-item:focus-visible {
        outline: 2px solid var(--mc-focus);
        outline-offset: -2px;
      }
      /* Selected item: 12% wash + ink of its level (.k-card / .k-row / .k-column / .k-module). */
      .item[data-current] {
        background: var(--k-tint);
        color: var(--k-ink);
      }
      :host([variant='pane']) .item[data-current] {
        border-color: color-mix(in srgb, var(--k) 45%, transparent);
      }
      .item > ha-icon {
        --mdc-icon-size: var(--o-icon);
        color: var(--mc-text-2);
        flex: none;
      }
      .item[data-current] > ha-icon {
        color: var(--k-ink);
      }
      .text {
        flex: 1 1 6ch;
        min-width: min(6ch, 100%);
        display: grid;
      }
      .name {
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .sub {
        font-size: 0.75rem;
        color: var(--mc-text-2);
        overflow-wrap: anywhere;
        line-height: 1.35;
      }
      .sub.is-entity {
        font-family: var(--mc-mono);
      }
      .sub.is-inherited,
      .sub.is-mismatch {
        display: flex;
        align-items: baseline;
        gap: 4px;
      }
      .sub.is-inherited ha-icon,
      .sub.is-mismatch ha-icon {
        --mdc-icon-size: 16px;
        flex: none;
        align-self: center;
      }
      .sub.is-mismatch {
        font-size: 0.8125rem;
        color: var(--mc-warn-ink);
      }
      .mod-item {
        min-height: var(--o-mod-h);
      }
      /* layout children, nested under their layout module */
      .mod > ul {
        padding-left: 8px;
        margin-left: 18px;
      }
      .sub .mono {
        font-family: var(--mc-mono);
      }
      :host([variant='pane']) .mod-item {
        padding: 6px 12px;
      }
      .card-item {
        margin-left: 26px;
      }
      .col-item {
        min-height: 32px;
        padding: 4px 8px;
      }
      .col-item .name {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .col-item[data-current] .name {
        color: var(--k-ink);
      }
      .ovr-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--warning-color, #ff9800);
        flex: none;
      }

      .caret {
        width: 24px;
        height: 24px;
        border: 0;
        padding: 0;
        border-radius: 6px;
        background: transparent;
        display: grid;
        place-items: center;
        color: var(--mc-text-2);
        flex: none;
      }
      .caret:hover {
        background: var(--mc-surface-2);
      }
      .caret ha-icon {
        --mdc-icon-size: 18px;
        transition: transform 0.15s ease-out;
      }
      .caret[aria-expanded='false'] ha-icon {
        transform: rotate(-90deg);
      }
      .more[aria-expanded='true'] {
        background: var(--mc-surface-2);
        color: var(--mc-text);
      }
      /*
       * Module ⋮ keeps its slot (no layout shift). Pointer devices: shown on hover, focus, selection
       * and while its menu is open. Touch (no hover): always shown.
       */
      .mod-line > .more {
        opacity: 0;
        transition: opacity 0.15s ease-out, background-color 0.15s ease-out;
      }
      .mod-line:hover > .more,
      .mod-line:focus-within > .more,
      .mod-line > .item[data-current] + .more,
      .mod-line > .more[aria-expanded='true'] {
        opacity: 1;
      }
      @media (hover: none) {
        .mod-line > .more {
          opacity: 1;
        }
      }

      .add-mod .btn,
      .add-col .btn {
        width: 100%;
        justify-content: flex-start;
        min-height: 28px;
        padding: 0 8px;
        gap: var(--o-gap);
        font-size: 0.75rem;
      }
      .add-mod .btn ha-icon,
      .add-col .btn ha-icon {
        --mdc-icon-size: var(--o-icon);
      }
      /* pane (touch dialog): a taller target */
      :host([variant='pane']) .add-col .btn,
      :host([variant='pane']) .add-mod .btn {
        min-height: 36px;
        font-size: 0.8125rem;
      }

      .col-empty {
        gap: 4px;
        padding: 8px 12px;
        margin: 2px 0 4px;
        border-radius: var(--mc-radius);
      }
      .col-empty p {
        font-size: 0.75rem;
      }

      /* drop indicator: 2px accent insertion line */
      .row,
      .mod {
        position: relative;
      }
      .drop-before::before,
      .drop-after::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        pointer-events: none;
        z-index: 1;
        /* a round dot at the start of the line shows the depth without colour */
        height: 6px;
        background:
          linear-gradient(var(--mc-accent), var(--mc-accent)) 0 50% / 100% 2px no-repeat,
          radial-gradient(circle, var(--mc-accent) 2.5px, transparent 3px) 0 50% / 6px 6px no-repeat;
      }
      .drop-before::before {
        top: -3px;
      }
      .drop-after::after {
        bottom: -3px;
      }
      .col-empty.drop-into {
        border-color: var(--mc-accent);
        background: var(--mc-accent-tint);
      }
      .mod.drop-into > .line,
      .slot.drop-into > .line,
      .col.drop-into > .line {
        outline: 2px dashed var(--mc-accent);
        outline-offset: -2px;
        background: var(--mc-accent-tint);
      }
      .slot {
        position: relative;
      }
      .dragging {
        opacity: 0.5;
      }

      .foot {
        padding: 12px 0 4px;
      }
      .foot .btn {
        width: 100%;
      }
      .card-empty {
        margin-top: 8px;
      }

      .menu {
        position: fixed;
      }
      /* hidden on the dashboard: quieter name and an eye-off mark */
      .item[data-hidden] .name {
        color: var(--mc-text-2);
      }
      .item > ha-icon.hid-ico,
      .item > ha-icon.own-ico {
        --mdc-icon-size: 16px;
        color: var(--mc-text-2);
      }
      /* no iOS callout on a long-press (it opens the item menu) */
      .item {
        -webkit-touch-callout: none;
      }
      /* tab name, renamed in place */
      input.rename {
        flex: 1;
        min-width: 0;
        height: 28px;
        box-sizing: border-box;
        padding: 0 8px;
        border: 1px solid var(--mc-accent);
        border-radius: var(--mc-radius);
        background: var(--mc-surface);
        color: var(--mc-text);
        font: inherit;
        font-size: var(--o-font);
      }
      /* a row module's column: its share of the row */
      .slot-glyph {
        display: inline-flex;
        color: var(--mc-text-2);
      }
      .slot-glyph .layout-glyph i {
        opacity: 0.3;
      }
      .slot-glyph .layout-glyph i.on {
        opacity: 1;
      }
      .slot-item > ha-icon {
        --mdc-icon-size: 16px;
      }
      .slot-item .name,
      :host([variant='layers']) .child > .line .name,
      :host([variant='layers']) .child > .line .sub {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      /* Layers (240px): a tab / column shows its name and glyph; its modules are listed right under it */
      :host([variant='layers']) .slot-item .chip {
        display: none;
      }
      /* layout children nest deep: Layers (240px) indents them less */
      :host([variant='layers']) .mod > ul,
      :host([variant='layers']) .slot > ul {
        padding-left: 4px;
        margin-left: 12px;
      }

      /* Narrow pane (phone dialog): reclaim indentation so entity ids keep their width. */
      @container mc-outline (max-width: 419px) {
        .row > ul {
          padding-left: 0;
          margin-left: 26px;
          border-left: 0;
        }
        .col > ul {
          padding-left: 6px;
          margin-left: 6px;
        }
        :host([variant='pane']) .mod-item {
          padding: 6px 8px;
          gap: 8px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .item,
        .caret ha-icon,
        .mod-line > .more {
          transition: none;
        }
      }
    `],_n([(0,n.MZ)({attribute:!1})],$n.prototype,"stateManager",void 0),_n([(0,n.MZ)({reflect:!0})],$n.prototype,"variant",void 0),_n([(0,n.wk)()],$n.prototype,"_state",void 0),_n([(0,n.wk)()],$n.prototype,"_collapsed",void 0),_n([(0,n.wk)()],$n.prototype,"_focusKey",void 0),_n([(0,n.wk)()],$n.prototype,"_renaming",void 0),_n([(0,n.wk)()],$n.prototype,"_drop",void 0),$n=_n([(0,n.EM)("mc-structure-outline")],$n);var kn=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let xn=class extends o.WF{constructor(){super(...arguments),this.compact=!1,this.disabled=!1,this._menuOpen=!1,this._menu=new Qe(this,{menu:()=>this.shadowRoot?.querySelector(".menu"),onClose:()=>{this._menuOpen=!1},align:"start"}),this._toggleMenu=e=>{this._menuOpen=!0,this._menu.open(e.currentTarget)}}_fire(e){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0}))}_closeMenu(e){this._menu.close(e)}_act(e){this._closeMenu(!0),this._fire(e)}render(){const e=this.config?.template;if(!e)return o.qy`
        <div class="tpl-bar">
          <div class="tpl-text">
            ${this.compact?o.s6:o.qy`<span class="tpl-label">${(0,h.t)(660)}</span>`}
            <button
              type="button"
              class="chip manage"
              aria-haspopup="menu"
              ?disabled=${this.disabled}
              aria-expanded=${this._menuOpen?"true":"false"}
              @click=${this._toggleMenu}
            >
              <ha-icon icon="mdi:link-variant-off"></ha-icon>${(0,h.t)(651)}<ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
          </div>
          ${this._menuOpen?o.qy`
                <div class="menu" role="menu" aria-label=${(0,h.t)(1025)} @keydown=${this._menu.onKeydown}>
                  <button type="button" role="menuitem" @click=${()=>this._act("template-load")}>
                    <ha-icon icon="mdi:folder-open-outline"></ha-icon>${(0,h.t)(531)}
                  </button>
                  <button type="button" role="menuitem" @click=${()=>this._act("template-create")}>
                    <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(253)}
                  </button>
                </div>
              `:o.s6}
        </div>
      `;const t=this.config?he(this.config):[],i=t.reduce((e,t)=>e+t.paths.length,0),n=(0,h.t)(1259,{n:i});return o.qy`
      <div class="tpl-bar linked">
        <div class="tpl-text">
          ${this.compact?o.s6:o.qy`<span class="tpl-label">${(0,h.t)(1024)}</span>`}
          <span class="chips">
            <button
              type="button"
              class="chip is-accent manage"
              title=${(0,h.t)(1025)}
              aria-haspopup="menu"
              ?disabled=${this.disabled}
              aria-expanded=${this._menuOpen?"true":"false"}
              @click=${this._toggleMenu}
            >
              <ha-icon icon="mdi:link-variant"></ha-icon><span class="nm">${e}</span><ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
            ${i>0?o.qy`<span class="chip is-warn">${n}</span>`:o.qy`<span class="chip">${(0,h.t)(485)}</span>`}
          </span>
        </div>
        ${!this.compact&&i>0?o.qy`
              <div class="tpl-actions">
                <button type="button" class="btn btn-text btn-sm" @click=${()=>this._fire("template-resync")}>
                  <ha-icon icon="mdi:sync"></ha-icon>${(0,h.t)(784,{overrides:n})}
                </button>
              </div>
            `:o.s6}
        ${this._menuOpen?this._renderMenu(e,t,i):o.s6}
      </div>
    `}_renderMenu(e,t,i){return o.qy`
      <div class="menu" role="menu" aria-label=${(0,h.t)(1025)} @keydown=${this._menu.onKeydown}>
        <p class="menu-note">
          ${(0,h.tx)(522,{name:o.qy`<span class="mono">${e}</span>`})}
          ${i?(0,h.t)(1255,{n:i}):(0,h.t)(409)}
        </p>
        ${t.length?o.qy`
              <ul class="ovr">
                ${t.map(e=>o.qy`<li><span class="loc">${e.location}</span><span class="paths mono">${e.paths.map(e=>e.replace("design.","")).join(", ")}</span></li>`)}
              </ul>
            `:o.s6}
        <button type="button" role="menuitem" ?disabled=${0===i} @click=${()=>this._act("template-resync")}>
          <ha-icon icon="mdi:sync"></ha-icon>${(0,h.t)(784,{overrides:(0,h.t)(1259,{n:i})})}
        </button>
        <button type="button" role="menuitem" @click=${()=>this._act("template-save")}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>${(0,h.t)(863)}
        </button>
        <hr />
        <button type="button" role="menuitem" class="danger" @click=${()=>this._act("template-unlink")}>
          <ha-icon icon="mdi:link-variant-off"></ha-icon>${(0,h.t)(1113)}
        </button>
      </div>
    `}};xn.styles=[l.x,o.AH`
      :host {
        display: block;
      }
      .tpl-bar {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        padding: 12px;
        border-radius: var(--mc-radius-lg);
        background: var(--mc-surface-2);
      }
      .tpl-text {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        flex: 1 1 200px;
        min-width: 0;
        font-size: 0.8125rem;
        color: var(--mc-text-2);
      }
      .tpl-text .chip .nm {
        overflow-wrap: anywhere;
        white-space: normal;
        line-height: 1.25;
      }
      /* A long template name wraps inside its chip: give the lines room instead of touching the border. */
      .tpl-text .chip:has(.nm) {
        padding-block: 3px;
      }
      .tpl-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-left: auto;
      }
      /* The chips stay together; when space runs out the "Template" label moves above them. */
      .chips {
        display: inline-flex;
        flex-wrap: nowrap;
        align-items: center;
        gap: 8px;
        min-width: 0;
      }
      .manage[aria-expanded='true'] {
        background: var(--mc-surface);
        color: var(--mc-text);
      }
      .manage ha-icon:last-child {
        transition: transform 0.15s ease-out;
      }
      .manage[aria-expanded='true'] ha-icon:last-child {
        transform: rotate(180deg);
      }
      .menu {
        top: calc(100% + 6px);
        left: 0;
        width: min(320px, 100%);
      }
      :host([compact]) .tpl-bar {
        padding: 0;
        background: none;
        border-radius: 0;
        gap: 8px;
      }
      :host([compact]) .tpl-text {
        flex: 0 1 auto;
      }
      :host([compact]) .tpl-actions {
        margin-left: 0;
      }
      :host([compact]) .menu {
        width: 320px;
        max-width: calc(100vw - 32px);
      }
      .menu-note {
        margin: 0;
      }
      .ovr {
        list-style: none;
        margin: 0 0 4px;
        padding: 0 12px 8px;
        display: grid;
        gap: 6px;
        font-size: 0.75rem;
        border-bottom: 1px solid var(--mc-divider);
      }
      .ovr li {
        display: grid;
        gap: 2px;
      }
      .ovr .loc {
        font-weight: 500;
        color: var(--mc-text);
      }
      .ovr .paths {
        font-size: 0.75rem;
        color: var(--mc-warn-ink);
        overflow-wrap: anywhere;
      }
    `],kn([(0,n.MZ)({attribute:!1})],xn.prototype,"config",void 0),kn([(0,n.MZ)({attribute:!1})],xn.prototype,"hass",void 0),kn([(0,n.MZ)({type:Boolean,reflect:!0})],xn.prototype,"compact",void 0),kn([(0,n.MZ)({type:Boolean,reflect:!0})],xn.prototype,"disabled",void 0),kn([(0,n.wk)()],xn.prototype,"_menuOpen",void 0),xn=kn([(0,n.EM)("mc-template-bar")],xn);const Cn={clock:{name:109,description:148,category:"advanced",icon:"mdi:clock-outline"},image:{name:251,description:146,category:"content",icon:"mdi:image-outline"},"custom-card":{name:130,description:179,category:"advanced",icon:"mdi:card-plus-outline"},forecast:{name:214,description:153,category:"advanced",icon:"mdi:calendar-week-outline"},"video-bg":{name:539,description:540,category:"advanced",icon:"mdi:video-outline"},weather:{name:548,description:152,category:"advanced",icon:"mdi:weather-partly-cloudy"},camera:{name:100,description:144,category:"content",icon:"mdi:camera-outline"},graphs:{name:227,description:149,category:"content",icon:"mdi:chart-line"},markdown:{name:301,description:380,category:"content",icon:"mdi:language-markdown"},dropdown:{name:165,description:412,category:"controls",icon:"mdi:form-dropdown"},gauge:{name:218,description:29,category:"controls",icon:"mdi:speedometer"},light:{name:280,description:282,category:"controls",icon:"mdi:lightbulb-outline"},slider:{name:430,description:377,category:"controls",icon:"mdi:tune-vertical"},spinbox:{name:447,description:324,category:"controls",icon:"mdi:numeric"},"slider-layout":{name:431,description:33,category:"layout",icon:"mdi:view-carousel-outline"},tabs:{name:500,description:498,category:"layout",icon:"mdi:tab"}};for(const e of Object.keys(Cn)){const t=_.s.get(e);t&&Object.assign(t.metadata,Cn[e])}const Sn=[{label:991,value:"state"},{label:612,value:"name"},{label:613,value:"name_state"}],Mn=[...Sn,{label:788,value:"remaining"}],An={type:"text",entityField:!0,general(e,t,i,n,a){const s=e,r=Io(s,a),l=Do(e,n);return o.qy`
      <div class="mc-tab-content">
        ${s.use_entity?o.s6:o.qy`
              ${(0,$t.Gz)((0,h.t)(1029),s.text,e=>i({...s,text:e}),"text",l)}
              ${(0,$t.vm)((0,h.t)(1142),s.use_template,e=>i({...s,use_template:e}),"use_template",l)}
              ${s.use_template?(0,$t.m1)((0,h.t)(1125,{example:"{{ states(entity) }}, {{ states(card_entity) }}"})):o.s6}
            `}
        ${(0,$t.vm)((0,h.t)(1134),s.use_entity,e=>i({...s,use_entity:e}),"use_entity",l,(0,h.t)(958))}
        ${s.use_template&&!s.use_entity?zt((0,h.t)(357),s,i,t,a,{syncCtx:l}):o.s6}
        ${s.use_entity?o.qy`
              ${zt((0,h.t)(357),s,i,t,a,{syncCtx:l})}
              ${(0,$t.FQ)((0,h.t)(105),s.attribute,e=>i({...s,attribute:e||void 0}),t,r,"attribute",l,At(a))}
              ${(0,$t.Wn)((0,h.t)(307),s.entity_display,(0,h.tl)((0,Li._7)(r)||"remaining"===s.entity_display?Mn:Sn),e=>i({...s,entity_display:e}),"entity_display",l)}
            `:o.s6}
      </div>
    `}};var qn=i(8477),En=i(7419),Tn=i(3245),Ln=i(9486),zn=i(5171),jn=i(379),Rn=i(7104),On=(i(1315),function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s});const Pn=[{value:"up",label:1115},{value:"down",label:315},{value:"left",label:511},{value:"right",label:833}],Hn=[{value:"solid",label:974},{value:"duotone",label:322},{value:"gradient",label:425},{value:"value",label:1151}];function Dn(e){const t={};for(const[i,o]of Object.entries(e))void 0===o||""===o||"number"==typeof o&&Number.isNaN(o)||(t[i]=o);return Object.keys(t).length?t:void 0}let In=class extends o.WF{constructor(){super(...arguments),this.entity="",this.icon="",this.moduleIcon="",this.iconOn="",this.iconOff="",this.svg="",this.allowSvg=!1,this.allowStateIcons=!1,this._open=!1,this._svgAlert=!1,this._noShape=!1,this._svgOn=!1,this._editorState="",this._shapeFor=""}get _fx(){return this.fx&&"object"==typeof this.fx?this.fx:{}}get _fill(){const e=this._fx.fill;return e&&"object"==typeof e?e:void 0}get _colors(){const e=this._fx.colors;return e&&"object"==typeof e?e:{}}get _isSvg(){return"svg"===this.icon}get _hasAccent(){return this._isSvg||/^mcu:/.test(this.icon)}get _stateObj(){return this.entity?this.hass?.states?.[this.entity]:void 0}_setFx(e){const t=Dn({...this._fx,...e});"off"===t?.device&&delete t.device,!t||t.draw&&"off"!==t.draw||(delete t.draw,delete t.draw_duration),!1===t?.morph&&delete t.morph,this.onChange?.({icon_fx:t&&Object.keys(t).length?t:void 0})}_setFill(e){this._setFx({fill:Dn({...this._fill??{},...e})??{}})}_setColors(e){const t=Dn({...this._colors,...e});"solid"===t?.style&&delete t.style,t&&"gradient"!==t.style&&"value"!==t.style&&delete t.gradient,t&&"gradient"!==t.style&&delete t.angle,t&&"duotone"!==t.style&&!this._hasAccent&&delete t.secondary,this._setFx({colors:t&&Object.keys(t).length?t:void 0})}_resetAll(){this.onChange?.({icon_fx:void 0})}willUpdate(e){e.has("moduleIcon")&&void 0!==e.get("moduleIcon")&&"svg"!==this.moduleIcon&&(this._svgOn=!1),e.has("svg")&&void 0!==e.get("svg")&&void 0!==this._svgDraft&&this.svg!==this._svgDraft&&(this._svgDraft=void 0,this._svgError=void 0)}async _openEditor(e){if("loading"===this._editorState)return;const t=this.moduleCfg??{icon:this.moduleIcon||void 0,svg:this.svg||void 0,icon_on:this.iconOn||void 0,icon_off:this.iconOff||void 0},i=(0,vi.d)(this)?.getConfig(),o="draw"===e?{kind:"blank"}:"customise"===e?{kind:"icon",icon:this.moduleIcon}:(0,Rn.lm)(t,i,"ok"===(await(0,g.fZ)(this.hass)).state)??{kind:"blank"};this._editorState="loading";const n=await(0,Rn.$d)({from:this,hass:this.hass,module:t,linked:!!this.syncCtx&&(0,jn.rJ)(this.syncCtx),source:o,apply:e=>this.onChange?.(e)});this._editorState="failed"===n?"failed":""}_renderIconEditor(){const e=this.moduleIcon,t="svg"===e||e.startsWith("mcu:")?"edit":e.includes(":")?"customise":"draw",i={edit:(0,h.t)(334),customise:(0,h.t)(265),draw:(0,h.t)(317)}[t],n="loading"===this._editorState,a=e.slice(0,e.indexOf(":"));return o.qy`
      <div class="icon-editor">
        <div class="svg-actions">
          <button type="button" class="btn btn-secondary btn-sm" data-focus-key="icon-entry" aria-busy=${n?"true":"false"} @click=${()=>{this._openEditor(t)}}>
            <ha-icon icon="mdi:pencil-ruler"></ha-icon>${i}${n?o.qy`<span class="sr-only"> ${(0,h.t)(532)}</span>`:o.s6}
          </button>
        </div>
        ${"customise"===t?o.qy`<p class="help">${(0,h.t)(554,{pack:"mdi"===a?(0,h.t)(567):a})}</p>`:o.s6}
        ${"failed"===this._editorState?o.qy`<p class="help error" role="alert">${(0,h.t)(1044)}</p>`:o.s6}
        ${this._savedMissing()?o.qy`<p class="help warn" role="status">${(0,h.t)(866,{name:e.slice(4)})}</p>`:o.s6}
      </div>
    `}_savedMissing(){const e=this.moduleIcon;if(!e.startsWith("mcu:")||!this._saved)return!1;const t=e.slice(4);return!((0,vi.d)(this)?.getConfig().custom_icons?.[t]||"ok"===this._saved.state&&this._saved.items.some(e=>e.id===t))}updated(){this.moduleIcon.startsWith("mcu:")&&this.hass&&this._savedFor!==this.hass&&(this._savedFor=this.hass,(0,g.fZ)(this.hass).then(e=>this._saved=e));const e=(0,En.K)(this._fx)&&this.icon&&!this._isSvg&&this.icon.includes(":")?this.icon:"";e!==this._shapeFor&&(this._shapeFor=e,this._unlisten?.(),this._unlisten=void 0,this._noShape=!1,e&&(this._unlisten=(0,Ln.Si)().onIconGeometry(e,()=>{this._shapeFor===e&&(this._noShape=!1)}),(0,Ln.Si)().resolveIconGeometry(e).then(t=>{this._shapeFor===e&&(this._noShape=!t)})))}disconnectedCallback(){super.disconnectedCallback(),this._unlisten?.(),this._unlisten=void 0,this._shapeFor=""}_sync(e){const t=this.syncCtx;return t&&(0,jn.rJ)(t)?o.qy`<mc-sync-indicator
      .synced=${!(0,jn.gJ)(t,e)}
      .hasTemplate=${!0}
      .hideIfNoTemplate=${!0}
      .propertyPath=${(0,jn.dy)(t,e)}
      @sync-toggle=${e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("field-sync-toggle",{detail:{propertyPath:e.detail.propertyPath,synced:e.detail.synced},bubbles:!0,composed:!0}))}}
    ></mc-sync-indicator>`:o.s6}_field(e,t,i,n,a,s){return o.qy`
      <div class="field">
        <div class="field-head">
          ${a?o.qy`<label for=${a}>${e}</label>`:o.qy`<span class="lbl">${e}</span>`}
          ${i?(0,Yt.i)(e,t,i):o.s6}${s?this._sync(s):o.s6}
        </div>
        ${n}
      </div>
    `}_switch(e,t,i,n){const a=`fx-sw-${e.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`;return o.qy`<div class="switch-row">
      <div class="txt">
        <div class="field-head"><label for=${a}>${e}</label></div>
        ${n?o.qy`<p class="help" id="${a}-help">${n}</p>`:o.s6}
      </div>
      <button
        type="button"
        class="switch"
        id=${a}
        role="switch"
        aria-checked=${t?"true":"false"}
        aria-label=${e}
        aria-describedby=${n?`${a}-help`:o.s6}
        @click=${i}
      ></button>
    </div>`}_seg(e,t,i,n){return o.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const o=i.findIndex(e=>e.value===t),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const s=i[(o+a[e.key]+i.length)%i.length].value,r=e.currentTarget;n(s),requestAnimationFrame(()=>r.querySelector(`[data-val="${s}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return o.qy`<button type="button" role="radio" data-val=${e.value} aria-checked=${i?"true":"false"} tabindex=${i?"0":"-1"} @click=${()=>n(e.value)}>${(0,h.t)(e.label)}</button>`})}
    </div>`}_select(e,t,i,n,a){return o.qy`<div class="select">
      <select class="input" id=${e} aria-describedby=${a||o.s6} @change=${e=>n(e.target.value)}>
        ${i.map(e=>o.qy`<option value=${e.value} ?selected=${e.value===t}>${(0,h.t)(e.label)}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`}_number(e,t,i,n,a,s,r="any"){return o.qy`<input
      class="input"
      id=${e}
      type="number"
      min=${a??o.s6}
      max=${s??o.s6}
      step=${r}
      placeholder=${String(i)}
      .value=${void 0===t?"":String(t)}
      @input=${e=>{const t=e.target.value,i=Number(t);""!==t.trim()&&Number.isFinite(i)&&n(i)}}
      @change=${e=>{const t=e.target;""!==t.value.trim()||t.validity?.badInput||n(void 0)}}
    />`}_color(e,t,i,n){const a=!!this.entity;return o.qy`<mc-color-picker
      data-key=${e}
      .value=${i||""}
      .label=${t}
      .allowEntity=${a}
      .entityColor=${a?(0,ti.id)(this._stateObj)??"currentColor":""}
      @value-changed=${e=>n(e.detail.value||void 0)}
    ></mc-color-picker>`}_applySvg(e,t=!1){if(this._svgDraft=e,this._svgAlert=t,!e.trim())return this._svgError=void 0,void this.onChange?.({svg:void 0});const i=function(e){const t=function(e){const t=[];return/<\s*script/i.test(e)&&t.push((0,h.t)(1202)),/\son[a-z]+\s*=/i.test(e)&&t.push((0,h.t)(1216)),/javascript:|vbscript:/i.test(e)&&t.push((0,h.t)(1199)),/<\s*foreignObject/i.test(e)&&t.push("foreignObject"),(/<\s*(?:iframe|embed|object)\b/i.test(e)||/href\s*=\s*(?!["']?\s*#)/i.test(e))&&t.push((0,h.t)(1217)),(/url\(\s*(?!["']?\s*#)/i.test(e)||/@import|data:/i.test(e))&&t.push((0,h.t)(1217)),[...new Set(t)]}(e);if(t.length){const e=t.length>1?(0,h.t)(1247,{list:t.slice(0,-1).join(", "),last:t[t.length-1]}):t[0];return t.length>1?(0,h.t)(1063,{list:e}):(0,h.t)(1062,{list:e})}return/<\s*(?:use|image)\b/i.test(e)?(0,h.t)(11):(0,zn.OW)(e).error}(e);this._svgError=i,i||(this._isSvg?this.onChange?.({svg:e}):this.onChange?.({icon:"svg",svg:e}))}_toggleSvg(){if(this._svgDraft=void 0,this._svgError=void 0,this._isSvg){const e=this._prevIcon;this._prevIcon=void 0,this._svgOn=!1,this.onChange?.({icon:e||void 0,svg:void 0})}else this._svgOn?this._svgOn=!1:(this._prevIcon=this.moduleIcon,this._svgOn=!0)}async _upload(e){const t=e.target,i=t.files?.[0];if(i){i.size>32768?(this._svgError=(0,h.t)(1032),this._svgAlert=!0):this._applySvg(await i.text(),!0);try{t.value=""}catch{}}}_renderSvg(){if(!this.allowSvg)return o.s6;const e=this._isSvg||this._svgOn,t=this._svgDraft??(this._isSvg?this.svg:"")??"",i=this._svgError?void 0:function(e){if(/<\s*style\b/i.test(e)||/\sstyle\s*=/i.test(e))return(0,h.t)(1008)}(t);return o.qy`
      ${this._renderIconEditor()}
      ${this._switch((0,h.t)(257),e,()=>this._toggleSvg(),e?void 0:(0,h.t)(319))}
      ${e?o.qy`${this._field((0,h.t)(855),!!this.svg,()=>{this._svgDraft=void 0,this._svgError=void 0,this.onChange?.({svg:void 0})},o.qy`<textarea
                class="input mono"
                id="fx-svg"
                spellcheck="false"
                placeholder=${(0,h.t)(10)}
                aria-invalid=${this._svgError?"true":"false"}
                aria-describedby=${this._svgError?"fx-svg-error":i?"fx-svg-help fx-svg-warning":"fx-svg-help"}
                .value=${t}
                @input=${e=>this._applySvg(e.target.value)}
              ></textarea>
              <div class="svg-msg" aria-live="polite">
                ${this._svgError?o.qy`<p class="help error" id="fx-svg-error" role=${this._svgAlert?"alert":o.s6}>${this._svgError}</p>`:o.qy`<p class="help" id="fx-svg-help">
                      ${(0,h.t)(1117)}
                    </p>`}
                ${i?o.qy`<p class="help warn" id="fx-svg-warning">${i}</p>`:o.s6}
              </div>
              <div class="svg-actions">
                <input type="file" accept=".svg,image/svg+xml" id="fx-svg-file" @change=${e=>{this._upload(e)}} />
                <button type="button" class="btn btn-secondary btn-sm" @click=${()=>this.renderRoot.querySelector("#fx-svg-file")?.click()}>
                  <ha-icon icon="mdi:upload"></ha-icon>${(0,h.t)(1122)}
                </button>
              </div>`,"fx-svg","svg")}`:o.s6}
    `}_renderFill(){const e=this._fill,t=!!e,i=e?.entity||this.entity,n=i?Object.keys(this.hass?.states?.[i]?.attributes||{}):[],a=e?function(e){if("number"==typeof e&&Number.isFinite(e))return e>1?e:100*e;if("string"==typeof e&&/^\s*\d*\.?\d+\s*%?\s*$/.test(e)){const t=parseFloat(e);return/%/.test(e)||t>1?t:100*t}}(e.empty_color):void 0,s=!!e?.empty_color&&void 0===a;return o.qy`
      ${this._switch((0,h.t)(524),t,()=>this._setFx({fill:t?void 0:{}}),(0,h.t)(386))}
      ${t?o.qy`
            ${this._field((0,h.t)(357),!!e.entity,()=>this._setFill({entity:void 0,attribute:void 0}),o.qy`<mc-entity-picker
                .hass=${this.hass}
                .value=${e.entity||""}
                .label=${this.entity?(0,h.t)(588,{entity:this.entity}):(0,h.t)(357)}
                @value-changed=${e=>this._setFill({entity:e.detail.value||void 0,attribute:void 0})}
              ></mc-entity-picker>`)}
            ${i?e.entity?o.s6:o.qy`<p class="help">${(0,h.t)(351,{entity:this.entity})}</p>`:o.qy`<p class="help">${(0,h.t)(733)}</p>`}
            ${n.length?this._field((0,h.t)(105),!!e.attribute,()=>this._setFill({attribute:void 0}),o.qy`<mc-attribute-picker
                    .hass=${this.hass}
                    .entityId=${i}
                    .value=${e.attribute||""}
                    @value-changed=${e=>this._setFill({attribute:e.detail.value||void 0})}
                  ></mc-attribute-picker>`):o.s6}
            <div class="two">
              ${this._field((0,h.t)(580),void 0!==e.min,()=>this._setFill({min:void 0}),this._number("fx-fill-min",e.min,ei._T.min,e=>this._setFill({min:e})),"fx-fill-min")}
              ${this._field((0,h.t)(569),void 0!==e.max,()=>this._setFill({max:void 0}),this._number("fx-fill-max",e.max,ei._T.max,e=>this._setFill({max:e})),"fx-fill-max")}
            </div>
            ${this._field((0,h.t)(205),!!e.color,()=>this._setFill({color:void 0}),this._color("fill-color",(0,h.t)(381),e.color,e=>this._setFill({color:e})))}
            ${this._field((0,h.t)(347),void 0!==e.empty_color,()=>this._setFill({empty_color:void 0}),o.qy`${this._number("fx-fill-empty",a,100*ei._T.emptyOpacity,e=>this._setFill({empty_color:void 0===e?void 0:`${Math.min(100,Math.max(0,e))}%`}),0,100,5)}
                ${s?o.qy`<p class="help">${(0,h.t)(1042,{colour:String(e.empty_color)})}</p>`:o.s6}`,"fx-fill-empty")}
            ${this._switch((0,h.t)(1164),!1!==e.wave,()=>this._setFill({wave:!1===e.wave&&void 0}))}
            ${this._field((0,h.t)(305),!!e.direction,()=>this._setFill({direction:void 0}),this._seg((0,h.t)(305),e.direction??"up",Pn,e=>this._setFill({direction:"up"===e?void 0:e})))}
          `:o.s6}
    `}_deviceHelp(e){if("auto"!==e)return"off"===e?(0,h.t)(86):(0,h.t)(727);if(!this.entity)return(0,h.t)(732);const t=(0,Tn.k8)(this._stateObj,this.entity);if(!t)return(0,h.t)(112);const i=(0,Tn.bb)(this._stateObj);return(0,h.t)(111,{rule:(0,Gt.t)(t)})+(i?` ${(0,h.t)(669,{device:(0,h.t)(Qt[i.anim])})}`:"")}_renderDevice(){const e="string"==typeof this._fx.device?this._fx.device:"off";return this._field((0,h.t)(302),"off"!==e,()=>this._setFx({device:void 0}),o.qy`${this._select("fx-device",e,this.entity||"auto"===e?Jt:Jt.filter(e=>"auto"!==e.value),e=>this._setFx({device:e}),"fx-device-help")}
        <p class="help" id="fx-device-help">${this._deviceHelp(e)}</p>`,"fx-device")}_renderDraw(){const e=this._fx.draw??"off";return o.qy`
      ${this._field((0,h.t)(518),"off"!==e,()=>this._setFx({draw:void 0}),this._select("fx-draw",e,Xt,e=>this._setFx({draw:e})),"fx-draw")}
      ${"off"!==e?this._field((0,h.t)(318),!!this._fx.draw_duration,()=>this._setFx({draw_duration:void 0}),o.qy`<mc-unit-field
              .value=${this._fx.draw_duration||""}
              .label=${(0,h.t)(318)}
              .units=${["s","ms"]}
              .placeholder=${String(ei._T.drawDuration)}
              @value-changed=${e=>this._setFx({draw_duration:e.detail.value||void 0})}
            ></mc-unit-field>`):o.s6}
    `}_renderStateIcons(){if(!this.allowStateIcons)return o.s6;const e=(e,t,i)=>this._field(e,!!i,()=>this.onChange?.({[t]:void 0}),o.qy`<mc-icon-picker
          data-key=${t}
          .hass=${this.hass}
          .label=${e}
          .value=${i||""}
          @value-changed=${e=>this.onChange?.({[t]:e.detail.value||void 0})}
        ></mc-icon-picker>`,void 0,t);return o.qy`<div class="state-icons" role="group" aria-label=${(0,h.t)(994)} aria-describedby="fx-state-help">
      <div class="two">${e((0,h.t)(475),"icon_on",this.iconOn)} ${e((0,h.t)(474),"icon_off",this.iconOff)}</div>
      <p class="help" id="fx-state-help">${(0,h.t)(995)}</p>
    </div>`}_renderMorph(){if(!this.allowStateIcons)return o.s6;const e=!0===this._fx.morph;return o.qy`
      ${this._switch((0,h.t)(596),e,()=>this._setFx({morph:!e||void 0}),(0,h.t)(597))}
      ${!e||this.iconOn||this.iconOff?o.s6:o.qy`<p class="help">${(0,h.t)(743)}</p>`}
    `}_renderColors(){const e=this._colors,t=e.style??"solid",i=Array.isArray(e.gradient)&&e.gradient.length?e.gradient:[...ei._T.stops],n=ei._T.stops,a=e=>this._setColors({gradient:e.length===n.length&&e.every((e,t)=>e===n[t])?void 0:e});return o.qy`
      ${this._field((0,h.t)(210),!!e.style,()=>this._setColors({style:void 0}),this._seg((0,h.t)(210),t,Hn,e=>this._setColors({style:e})))}
      ${"gradient"===t||"value"===t?o.s6:this._field("solid"===t?(0,h.t)(205):(0,h.t)(775),!!e.primary,()=>this._setColors({primary:void 0}),this._color("primary",(0,h.t)(775),e.primary,e=>this._setColors({primary:e})))}
      ${"duotone"===t?this._field((0,h.t)(881),!!e.secondary,()=>this._setColors({secondary:void 0}),o.qy`${this._color("secondary",(0,h.t)(881),e.secondary,e=>this._setColors({secondary:e}))}
              <p class="help">${(0,h.t)(352,{pct:ei._T.secondaryPct})}</p>`):this._hasAccent?this._field((0,h.t)(22),!!e.secondary,()=>this._setColors({secondary:void 0}),o.qy`${this._color("secondary",(0,h.t)(22),e.secondary,e=>this._setColors({secondary:e}))}
                <p class="help">${this._isSvg?(0,h.t)(717):(0,h.t)(718)}</p>`):o.s6}
      ${"gradient"===t||"value"===t?o.qy`
            ${this._field((0,h.t)(426),Array.isArray(e.gradient)&&e.gradient.length>0,()=>this._setColors({gradient:void 0}),o.qy`<div class="stops">
                ${i.map((e,t)=>o.qy`<div class="stop">
                    ${this._color(`stop-${t}`,(0,h.t)(211,{n:t+1}),e,e=>((e,t)=>a(t?i.map((i,o)=>o===e?t:i):i.length>2?i.filter((t,i)=>i!==e):i.map((t,i)=>i===e?n[i]??n[n.length-1]:t)))(t,e))}
                    ${i.length>2?o.qy`<button type="button" class="icon-btn sm danger" aria-label=${(0,h.t)(790,{n:t+1})} title=${(0,h.t)(789)} @click=${()=>a(i.filter((e,i)=>i!==t))}>
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </button>`:o.s6}
                  </div>`)}
                <div><button type="button" class="btn btn-text btn-sm" @click=${()=>a([...i,i[i.length-1]])}><ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(36)}</button></div>
              </div>
              ${"value"===t?o.qy`<p class="help">${(0,h.t)(1040)}</p>`:o.s6}`)}
            ${"gradient"===t?this._field((0,h.t)(77),void 0!==e.angle,()=>this._setColors({angle:void 0}),this._number("fx-angle",e.angle,ei._T.angle,e=>this._setColors({angle:e}),0,360,15),"fx-angle"):o.s6}
          `:o.s6}
    `}_count(){const e=this._fx;let t=0;return this._fill&&t++,e.device&&"off"!==e.device&&t++,e.draw&&"off"!==e.draw&&t++,!0===e.morph&&t++,Object.keys(this._colors).length&&t++,t}render(){const e=this._count();return o.qy`
      ${this._renderSvg()} ${this._renderStateIcons()}
      <div class="sectors">
        <div class="sector">
          <div class="sector-head">
            <button type="button" class="sector-btn" aria-expanded=${this._open?"true":"false"} aria-controls=${this._open?"fx-body":o.s6} @click=${()=>this._open=!this._open}>
              <ha-icon icon="mdi:creation-outline"></ha-icon>
              <span class="nm">${(0,h.t)(467)}</span>
              ${e>0?o.qy`<span class="chip is-count">${(0,h.t)(1288,{n:e})}</span>`:o.s6}
              <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
            </button>
            ${this._sync("icon_fx")}
          </div>
          ${this._open?o.qy`<div class="sector-body" id="fx-body">
                ${e>0?o.qy`<div class="sector-reset-row">
                      <button type="button" class="btn btn-text btn-sm sector-reset" aria-label=${(0,h.t)(814)} title=${(0,h.t)(189)} @click=${()=>this._resetAll()}>
                        <ha-icon icon="mdi:backup-restore"></ha-icon>${(0,h.t)(813)}
                      </button>
                    </div>`:o.s6}
                ${this._noShape?o.qy`<p class="help" id="fx-shape-hint" role="status">
                      ${(0,h.t)(341)}
                    </p>`:o.s6}
                ${this._renderFill()} ${this._renderDevice()} ${this._renderDraw()} ${this._renderMorph()} ${this._renderColors()}
              </div>`:o.s6}
        </div>
      </div>
    `}};function Fn(e){return(0,En.K)(e)?(0,h.t)(85):(0,h.t)(84)}function Vn(e,t,i,n={}){const a=!!n.syncCtx&&(0,jn.rJ)(n.syncCtx);return o.qy`<mc-icon-fx-editor
    .hass=${t}
    .fx=${e.icon_fx}
    .entity=${n.entity??""}
    .icon=${n.icon??e.icon??""}
    .moduleIcon=${e.icon??""}
    .iconOn=${e.icon_on??""}
    .iconOff=${e.icon_off??""}
    .svg=${e.svg??""}
    .moduleCfg=${e}
    .allowSvg=${!!n.allowSvg}
    .allowStateIcons=${!!n.allowStateIcons}
    .syncCtx=${n.syncCtx}
    .onChange=${t=>i((0,Rn.kH)(e,t,a?n.syncCtx:void 0))}
  ></mc-icon-fx-editor>`}In.styles=[l.x,o.AH`
      :host {
        display: grid;
        gap: 16px;
        min-width: 0;
      }
      .state-icons {
        display: grid;
        gap: 6px;
      }
      .sector-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .sector-head .sector-btn {
        flex: 1;
        min-width: 0;
      }
      .sector-head mc-sync-indicator {
        margin-right: 8px;
      }
      .sector-reset-row {
        display: flex;
        justify-content: flex-end;
        margin-bottom: -8px;
      }
      .stops {
        display: grid;
        gap: 8px;
      }
      .stop {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .stop mc-color-picker {
        flex: 1;
        min-width: 0;
      }
      .svg-actions {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }
      .svg-actions input[type='file'] {
        display: none;
      }
      .svg-msg {
        display: grid;
        gap: 6px;
      }
      .help.warn {
        color: var(--mc-warn-ink);
      }
      .icon-editor {
        display: grid;
        gap: 6px;
      }
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
      textarea.input {
        min-height: 120px;
      }
    `],On([(0,n.MZ)({attribute:!1})],In.prototype,"hass",void 0),On([(0,n.MZ)({attribute:!1})],In.prototype,"fx",void 0),On([(0,n.MZ)({type:String})],In.prototype,"entity",void 0),On([(0,n.MZ)({type:String})],In.prototype,"icon",void 0),On([(0,n.MZ)({type:String})],In.prototype,"moduleIcon",void 0),On([(0,n.MZ)({type:String})],In.prototype,"iconOn",void 0),On([(0,n.MZ)({type:String})],In.prototype,"iconOff",void 0),On([(0,n.MZ)({type:String})],In.prototype,"svg",void 0),On([(0,n.MZ)({type:Boolean})],In.prototype,"allowSvg",void 0),On([(0,n.MZ)({type:Boolean})],In.prototype,"allowStateIcons",void 0),On([(0,n.MZ)({attribute:!1})],In.prototype,"onChange",void 0),On([(0,n.MZ)({attribute:!1})],In.prototype,"moduleCfg",void 0),On([(0,n.MZ)({attribute:!1})],In.prototype,"syncCtx",void 0),On([(0,n.wk)()],In.prototype,"_open",void 0),On([(0,n.wk)()],In.prototype,"_svgDraft",void 0),On([(0,n.wk)()],In.prototype,"_svgError",void 0),On([(0,n.wk)()],In.prototype,"_svgAlert",void 0),On([(0,n.wk)()],In.prototype,"_noShape",void 0),On([(0,n.wk)()],In.prototype,"_svgOn",void 0),On([(0,n.wk)()],In.prototype,"_editorState",void 0),On([(0,n.wk)()],In.prototype,"_saved",void 0),In=On([(0,n.EM)("mc-icon-fx-editor")],In);const Nn={type:"icon",entityField:!0,general(e,t,i,n,a){const s=e,r=Io(s,a),l=Do(e,n);return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),s,i,t,a,{syncCtx:l})}
        ${(0,$t.vm)((0,h.t)(1137),s.use_entity_icon,e=>i({...s,use_entity_icon:e}),"use_entity_icon",l)}
        ${(0,$t.vm)((0,h.t)(1135),s.use_entity_color,e=>i({...s,use_entity_color:e}),"use_entity_color",l,(0,h.t)(212))}
        ${s.use_entity_icon||"svg"===s.icon?o.s6:(0,$t.AJ)((0,h.t)(464),s.icon,e=>i({...s,icon:e}),t,"icon",l,{module:s,onModule:i})}
        ${Vn(s,t,i,{entity:r,icon:s.use_entity_icon?(0,qn.fq)(t,r)||s.icon:s.icon||"mdi:help",allowSvg:!s.use_entity_icon,allowStateIcons:!!r,syncCtx:l})}
        ${(0,$t.Yd)((0,h.t)(466),s.icon_color,e=>i({...s,icon_color:e||void 0}),"icon_color",l,"linear",(0,h.t)(1046))}
        ${s.use_entity_color&&s.icon_color?(0,$t.m1)((0,h.t)(1136)):o.s6}
        ${(0,$t.lm)((0,h.t)(964),s.size,e=>i({...s,size:e||void 0}),"size",l,"24")}
      </div>
    `}};var Zn=i(215);const Bn={type:"info",entityField:!0,general(e,t,i,n,a){const s=e,r=Io(s,a),l=Do(e,n),c=(0,Zn.S)(s);return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),s,i,t,a,{syncCtx:l})}
        ${(0,$t.FQ)((0,h.t)(105),s.attribute,e=>i({...s,attribute:e}),t,r,"attribute",l,At(a))}
        ${(0,$t.vm)((0,h.t)(935),c.name,e=>i({...s,show_name:e,show_state:c.state}),"show_name",l)}
        ${(0,$t.vm)((0,h.t)(941),c.state,e=>i({...s,show_name:c.name,show_state:e}),"show_state",l,c.name||c.state||s.secondary_info?void 0:(0,h.t)(1182))}
        ${c.state?(0,$t.vm)((0,h.t)(949),!1!==s.show_unit,e=>i({...s,show_unit:e}),"show_unit",l):o.s6}
        ${(0,$t.vm)((0,h.t)(931),s.show_icon,e=>i({...s,show_icon:e}),"show_icon",l)}
        ${s.show_icon&&"svg"!==s.icon?(0,$t.AJ)((0,h.t)(464),s.icon,e=>i({...s,icon:e||void 0}),t,"icon",l,{module:s,onModule:i}):o.s6}
        ${s.show_icon?Vn(s,t,i,{entity:r,icon:s.icon||(0,qn.fq)(t,r)||"mdi:information-outline",allowSvg:!0,allowStateIcons:!!r,syncCtx:l}):o.s6}
        ${(0,$t.Gz)((0,h.t)(765),s.prefix,e=>i({...s,prefix:e}),"prefix",l)}
        ${(0,$t.Gz)((0,h.t)(1009),s.suffix,e=>i({...s,suffix:e}),"suffix",l)}
        ${(0,$t.FQ)((0,h.t)(882),s.secondary_info,e=>i({...s,secondary_info:e}),t,r,"secondary_info",l,At(a))}
      </div>
    `}};var Wn=i(4634);const Kn={type:"image",entityField:!0,general(e,t,i,n,a){const s=e,r=Io(s,a),l=Do(e,n);return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),s,i,t,a,{syncCtx:l})}
        ${s.attribute?o.s6:(0,$t.vm)((0,h.t)(1138),s.entity_picture,e=>i({...s,entity_picture:e}),"entity_picture",l,(0,h.t)(959))}
        ${(0,$t.FQ)((0,h.t)(481),s.attribute,e=>i({...s,attribute:e||void 0}),t,r,"attribute",l,At(a))}
        ${r&&s.attribute?(0,$t.m1)((0,h.t)(1036)):o.s6}
        ${s.entity_picture||r&&s.attribute?o.s6:(0,$t.nZ)((0,h.t)(480),s.image,e=>i({...s,image:e}),t,"image","image",l)}
        ${(0,$t.Gz)((0,h.t)(102),void 0===s.aspect_ratio?void 0:String(s.aspect_ratio),e=>i({...s,aspect_ratio:e}),"aspect_ratio",l,{placeholder:"16:9"})}
        ${void 0!==s.aspect_ratio&&""!==s.aspect_ratio&&""===(0,Wn.o)(s.aspect_ratio,"")?(0,$t.m1)((0,h.t)(1130)):o.s6}
        ${(0,$t.De)((0,h.t)(389),s.fit,[{label:(0,h.t)(251),value:"cover"},{label:(0,h.t)(230),value:"contain"},{label:(0,h.tc)("fit",1218),value:"fill"},{label:(0,h.t)(654),value:"none"}],e=>i({...s,fit:e}),"fit",l)}
      </div>
    `}},Un={type:"markdown",entityField:!0,general(e,t,i,n,a){const s=e,r=Io(s,a),l=Do(e,n);return o.qy`
      <div class="mc-tab-content">
        ${(0,$t.fZ)((0,h.t)(231),s.content,e=>i({...s,content:e}),{rows:6,placeholder:(0,h.t)(1)},"content",l)}
        ${(0,$t.m1)((0,h.t)(559,{example:"{{ states('sensor.temperature') }}",entity:"{{ states(entity) }}"}))}
        ${zt((0,h.t)(358),s,i,t,a,{syncCtx:l})}
        ${(0,$t.FQ)((0,h.t)(105),s.attribute,e=>i({...s,attribute:e}),t,r,"attribute",l,At(a))}
      </div>
    `}},Gn={type:"bar",entityField:!0,general(e,t,i,n,a){const s=e,r=Io(s,a),l=Do(e,n);return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),s,i,t,a,{syncCtx:l})}
        ${(0,$t.FQ)((0,h.t)(105),s.attribute,e=>i({...s,attribute:e}),t,r,"attribute",l,At(a))}
        ${(0,$t.aA)((0,h.t)(580),s.min,e=>i({...s,min:e}),void 0,"min",l)}
        ${(0,$t.aA)((0,h.t)(569),s.max,e=>i({...s,max:e}),void 0,"max",l)}
        ${(0,$t.lm)((0,h.t)(130),s.bar_height,e=>i({...s,bar_height:e||void 0}),"bar_height",l,"8")}
        ${(0,$t.Yd)((0,h.t)(129),s.bar_color,e=>i({...s,bar_color:e}),"bar_color",l)}
        ${(0,$t.Yd)((0,h.t)(128),s.bar_background,e=>i({...s,bar_background:e}),"bar_background",l)}
        ${(0,Ti._)((0,h.t)(209),s.severity,e=>i({...s,severity:e}),{min:s.min??0,max:s.max??100,propertyName:"severity",syncCtx:l,help:(0,h.t)(1037)})}
        ${(0,$t.vm)((0,h.t)(950),!1!==s.show_value,e=>i({...s,show_value:e}),"show_value",l)}
        ${!1!==s.show_value?(0,$t.aA)((0,h.t)(275),s.decimals,e=>i({...s,decimals:Number.isFinite(e)?e:void 0}),{min:0,max:6,optional:!0,placeholder:(0,h.t)(114)},"decimals",l):o.s6}
        ${(0,$t.De)((0,h.t)(305),s.direction,[{label:(0,h.t)(453),value:"horizontal"},{label:(0,h.t)(1156),value:"vertical"}],e=>i({...s,direction:e}),"direction",l)}
      </div>
    `}},Yn={type:"graphs",entityField:!0,general(e,t,i,n,a){const s=e,r=Io(s,a),l=Do(e,n);return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),s,i,t,a,{syncCtx:l})}
        ${(0,$t.FQ)((0,h.t)(105),s.attribute,e=>i({...s,attribute:e||void 0}),t,r,"attribute",l,At(a))}
        ${(0,$t.aA)((0,h.t)(457),s.hours_to_show,e=>i({...s,hours_to_show:e}),{min:1,max:168},"hours_to_show",l)}
        ${s.attribute&&Number(s.hours_to_show)>48?(0,$t.m1)((0,h.t)(72)):o.s6}
        ${(0,$t.aA)((0,h.t)(760),s.points_per_hour,e=>i({...s,points_per_hour:Number.isFinite(e)&&e>0?e:void 0}),{min:.1,max:60,step:.1,optional:!0,placeholder:(0,h.t)(373)},"points_per_hour",l)}
        ${(0,$t.m1)((0,h.t)(1155))}
        ${(0,$t.Yd)((0,h.t)(517),s.line_color,e=>i({...s,line_color:e}),"line_color",l)}
        ${(0,$t.aA)((0,h.t)(519),s.line_width,e=>i({...s,line_width:e}),{min:1,max:10},"line_width",l)}
        ${(0,$t.vm)((0,h.t)(380),!1!==s.fill,e=>i({...s,fill:e}),"fill",l)}
        ${!1!==s.fill?(0,$t.Yd)((0,h.t)(381),s.fill_color,e=>i({...s,fill_color:e}),"fill_color",l):o.s6}
        ${(0,$t.vm)((0,h.t)(938),s.show_points,e=>i({...s,show_points:e}),"show_points",l)}
        ${(0,$t.vm)((0,h.t)(933),!1!==s.show_labels,e=>i({...s,show_labels:e}),"show_labels",l,(0,h.t)(614))}
      </div>
    `}};i(4362);const Qn={type:"camera",entityField:!0,general(e,t,i,n,a){const s=e,r=Do(e,n),l="live"===s.camera_view;return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(161),s,i,t,a,{domain:"camera",syncCtx:r})}
        ${(0,$t.Wn)((0,h.t)(1160),l?"live":"snapshot",[{label:(0,h.t)(526),value:"live"},{label:(0,h.t)(970),value:"snapshot"}],e=>i({...s,camera_view:e}),"camera_view",r)}
        ${l?o.qy`
              ${(0,$t.vm)((0,h.t)(927),!1!==s.show_controls,e=>i({...s,show_controls:e}),"show_controls",r,(0,h.t)(757))}
              ${(0,$t.m1)((0,h.t)(1055))}
            `:o.s6}
        ${(0,$t.aA)(l?(0,h.t)(971):(0,h.t)(787),s.refresh_interval,e=>i({...s,refresh_interval:Number.isFinite(e)&&e>0?e:void 0}),{min:1,max:3600,optional:!0,placeholder:String(10)},"refresh_interval",r)}
        ${l?(0,$t.m1)((0,h.t)(1146)):o.s6}
        ${(0,$t.Gz)((0,h.t)(102),void 0===s.aspect_ratio?void 0:String(s.aspect_ratio),e=>i({...s,aspect_ratio:e}),"aspect_ratio",r,{placeholder:"16:9"})}
      </div>
    `}};var Jn=i(8003);const Xn={type:"button",entityField:!0,general(e,t,i,n,a){const s=Do(e,n),r=e,l=Io(r,a);return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),r,i,t,a,{syncCtx:s,write:(e,t)=>function(e,t,i){const o=e;return!i&&void 0===o.actions&&t&&"none"!==t?{...o,entity:t,actions:(0,Jn.rD)(t)}:Lt(o,t)}(e,t,l)})}
        ${(0,$t.Gz)((0,h.t)(500),r.label,e=>i({...r,label:e}),"label",s)}
        ${l?(0,$t.vm)((0,h.t)(1137),r.use_entity_icon,e=>i({...r,use_entity_icon:e}),"use_entity_icon",s):o.s6}
        ${r.use_entity_icon&&l||"svg"===r.icon?o.s6:(0,$t.AJ)((0,h.t)(464),r.icon,e=>i({...r,icon:e}),t,"icon",s,{module:r,onModule:i})}
        ${Vn(r,t,i,{entity:l,icon:r.use_entity_icon&&l?(0,qn.fq)(t,l)||r.icon||"mdi:gesture-tap":r.icon,allowSvg:!(r.use_entity_icon&&l),allowStateIcons:!!l,syncCtx:s})}
        ${l?(0,$t.vm)((0,h.t)(1135),r.use_entity_color,e=>i({...r,use_entity_color:e}),"use_entity_color",s,(0,h.t)(212)):o.s6}
        ${(0,$t.Wn)((0,h.t)(157),r.button_style,[{label:(0,h.t)(276),value:"default"},{label:(0,h.t)(701),value:"outline"},{label:(0,h.t)(391),value:"flat"},{label:(0,h.t)(468),value:"icon-only"}],e=>i({...r,button_style:e}),"button_style",s)}
        ${(0,$t.vm)((0,h.t)(941),r.show_state,e=>i({...r,show_state:e}),"show_state",s,(0,h.t)(960))}
        ${r.show_state?(0,$t.FQ)((0,h.t)(105),r.attribute,e=>i({...r,attribute:e||void 0}),t,l,"attribute",s,At(a)):o.s6}
      </div>
    `}};var ea=i(4191),ta=i(2387);const ia="magic-card-look-editor.js";let oa,na=()=>i.e(836).then(()=>i(7447)),aa=!1;function sa(){return aa?Promise.resolve(!0):(oa??=new Promise(e=>{let t=!1;const i=(i,n)=>{t||(t=!0,clearTimeout(o),i?aa=!0:(oa=void 0,console.warn(`Magic Card: ${ia} did not load`,...void 0===n?[]:[n])),e(i))},o=setTimeout(()=>i(!1,"timed out"),15e3);na().then(e=>{const t=e;if(t?.BUILD!==mi.Q)return i(!1,`Magic Card was updated, reload the page (editor ${mi.Q}, ${ia} ${String(t?.BUILD)}).`);try{t.install?.()}catch(e){return i(!1,e)}i(!0)},e=>i(!1,e))}),oa)}const ra=()=>aa;var la=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const ca=new Map;class da extends o.WF{constructor(){super(...arguments),this._look=ra()?"ready":"loading"}connectedCallback(){super.connectedCallback(),"loading"===this._look&&this._load()}_load(e=!1){this._look="loading",sa().then(e=>{this._look=e?"ready":"failed"}),e&&this.updateComplete.then(()=>this.renderRoot.querySelector(".skeleton")?.focus())}get _session(){return(e=>{let t=ca.get(e);return t||(ca.size>=64&&ca.delete(ca.keys().next().value),t={open:new Set},ca.set(e,t)),t})(`${this.template??""}|${this.config?.id??""}`)}render(){const e=this.config;let t=o.s6;if(!e)return o.qy``;if("ready"===this._look&&customElements.get(ea.Ne)){const i=this._session;i.undo&&void 0!==i.after&&i.after!==JSON.stringify(e)&&(i.undo=i.after=void 0),t=o.qy`<mc-slider-look-editor
        .config=${e}
        .hass=${this.hass}
        .template=${this.template}
        .entity=${this.entity}
        .open=${new Set(i.open)}
        .onToggle=${e=>{i.open.has(e)?i.open.delete(e):i.open.add(e),this.requestUpdate()}}
        .undo=${i.undo}
        .onUndoChange=${e=>{i.undo=e,i.after=void 0,this.requestUpdate()}}
        .onChange=${e=>{i.undo&&(i.after=JSON.stringify(e)),this.onChange?.(e)}}
      ></mc-slider-look-editor>`}else"failed"===this._look?t=(0,ta.lm)({tone:"warn",text:(0,h.t)(248),action:{label:(0,h.t)(1103),onClick:()=>this._load(!0)}}):"loading"===this._look&&(t=o.qy`<div class="skeleton" role="status" aria-busy="true" tabindex="-1">
        <span>${(0,h.t)(539)}</span>
        <div class="bar"></div>
      </div>`);return o.qy`<section class="grp" aria-labelledby="look-h">
      <h4 class="grp-h" id="look-h">${(0,h.t)(548)}</h4>
      ${t}
    </section>`}}da.styles=[l.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .grp {
        display: grid;
        gap: 12px;
        min-width: 0;
      }
      .grp-h {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
      }
      .skeleton {
        display: grid;
        gap: 8px;
      }
      .skeleton .bar {
        height: 56px;
        border-radius: var(--mc-radius, 8px);
        background: var(--mc-surface-2);
      }
      .skeleton:focus {
        outline: none;
      }
    `],la([(0,n.MZ)({attribute:!1})],da.prototype,"config",void 0),la([(0,n.MZ)({attribute:!1})],da.prototype,"hass",void 0),la([(0,n.MZ)({attribute:!1})],da.prototype,"template",void 0),la([(0,n.MZ)({attribute:!1})],da.prototype,"entity",void 0),la([(0,n.MZ)({attribute:!1})],da.prototype,"onChange",void 0),la([(0,n.wk)()],da.prototype,"_look",void 0),customElements.get("mc-slider-look-host")||customElements.define("mc-slider-look-host",da);const ha=e=>Number.isFinite(e)?e:void 0,ua={type:"slider",entityField:!0,general(e,t,i,n,a){const s=Do(e,n),r=e,l=Io(r,a),c=l?t?.states[l]:void 0,d={color:(0,ti.id)(c)??"currentColor",attributes:c?.attributes},u=c?(0,Jn.fR)(t,c,r.attribute):void 0;return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),r,i,t,a,{syncCtx:s})}
        ${(0,$t.FQ)((0,h.t)(105),r.attribute,e=>i({...r,attribute:e||void 0}),t,l,"attribute",s,At(a))}
        ${c&&u?.readOnly?(0,$t.m1)((0,h.t)(1079)):o.s6}
        ${(0,$t.aA)((0,h.t)(580),r.min,e=>i({...r,min:ha(e)}),{optional:!0,placeholder:u?String(u.min):"0"},"min",s)}
        ${(0,$t.aA)((0,h.t)(569),r.max,e=>i({...r,max:ha(e)}),{optional:!0,placeholder:u?String(u.max):"100"},"max",s)}
        ${(0,$t.aA)((0,h.t)(1e3),r.step,e=>i({...r,step:ha(e)}),{optional:!0,min:0,placeholder:u?String(u.step):"1"},"step",s)}
        ${(0,$t.m1)((0,h.t)(349))}
        ${(0,$t.vm)((0,h.t)(950),!1!==r.show_value,e=>i({...r,show_value:e}),"show_value",s)}
        ${(0,$t.m1)((0,h.t)(857))}
        ${(0,$t.De)((0,h.t)(305),r.direction,[{label:(0,h.t)(453),value:"horizontal"},{label:(0,h.t)(1156),value:"vertical"}],e=>i({...r,direction:e}),"direction",s)}
        ${r.use_entity_color?o.qy`<div class="mc-field">
              <div class="field-head"><span class="lbl">${(0,h.t)(965)}</span></div>
              <p class="help">${(0,h.t)(394)} <button type="button" class="btn sm ghost" @click=${()=>i({...r,use_entity_color:void 0})}>${(0,h.t)(1141)}</button></p>
            </div>`:(0,$t.Yd)((0,h.t)(965),r.slider_color,e=>i({...r,slider_color:e||void 0}),"slider_color",s,"","",d)}
        ${(0,$t.Yd)((0,h.t)(1101),r.track_color,e=>i({...r,track_color:e||void 0}),"track_color",s,"","",d)}
        <mc-slider-look-host .config=${r} .hass=${t} .template=${n} .entity=${l} .onChange=${e=>i(e)}></mc-slider-look-host>
      </div>
    `}};var pa=i(7264);const ma=e=>Number.isFinite(e)?e:void 0,ga={type:"spinbox",entityField:!0,general(e,t,i,n,a){const s=Do(e,n),r=e,l=Io(r,a),c=l?t?.states[l]:void 0,d=c?(0,Jn.fR)(t,c,r.attribute):void 0;return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),r,i,t,a,{syncCtx:s})}
        ${(0,$t.FQ)((0,h.t)(105),r.attribute,e=>i({...r,attribute:e||void 0}),t,l,"attribute",s,At(a))}
        ${c&&d?.readOnly?(0,$t.m1)((0,h.t)(1080)):o.s6}
        ${(0,pa.H)(c,r.attribute)?(0,$t.m1)((0,h.t)(1056)):o.s6}
        ${(0,$t.aA)((0,h.t)(580),r.min,e=>i({...r,min:ma(e)}),{optional:!0,placeholder:d?String(d.min):"0"},"min",s)}
        ${(0,$t.aA)((0,h.t)(569),r.max,e=>i({...r,max:ma(e)}),{optional:!0,placeholder:d?String(d.max):"100"},"max",s)}
        ${(0,$t.aA)((0,h.t)(1e3),r.step,e=>i({...r,step:ma(e)}),{optional:!0,min:0,placeholder:d?String(d.step):"1"},"step",s)}
        ${(0,$t.m1)((0,h.t)(350))}
      </div>
    `}};var fa=i(8199);const va={type:"dropdown",entityField:!0,general(e,t,i,n,a){const s=Do(e,n),r=e,l=Io(r,a),c=(0,fa.a5)(r.options),d=l?t?.states[l]:void 0,u=d?(0,fa.fA)(d,r.attribute):void 0,p=(0,fa.P7)(d,u,c),m=e=>i({...r,options:e.length?e:void 0}),g=(e,t,i)=>m(c.map((o,n)=>n===e?{...o,[t]:i}:o)),f=(0,fa.XZ)(l);return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),r,i,t,a,{syncCtx:s})}
        ${f.length?(0,$t.FQ)((0,h.t)(105),r.attribute,e=>i({...r,attribute:e||void 0}),t,l,"attribute",s,At(a)):o.s6}
        ${f.length?(0,$t.m1)((0,h.t)(904,{attributes:f.join(", "),fallback:d?.entity_id.startsWith("climate.")?(0,h.t)(1231):f[0]})):o.s6}
        ${d&&!u?(0,$t.m1)((0,h.t)(1069)):o.s6}

        <div class="mc-section">
          <div class="mc-field">${(0,$t.XT)((0,h.t)(260),"options",s)}</div>
          ${(0,$t.m1)((0,h.t)(510),"mc-field-hint-with-margin")}
          <div class="mc-options-list">
            ${c.map((e,t)=>o.qy`
                <div class="mc-option-item mc-option-row">
                  ${(0,$t.Gz)((0,h.t)(500),e.label,e=>g(t,"label",e))}
                  ${(0,$t.Gz)((0,h.t)(1151),e.value,e=>g(t,"value",e))}
                  <button type="button" class="mc-btn-icon" aria-label=${(0,h.t)(793)} title=${(0,h.t)(793)} @click=${()=>{return e=t,m(c.filter((t,i)=>i!==e));var e}}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                </div>
                ${d&&u&&e.value&&!p.includes(e.value)?(0,$t.m1)((0,h.t)(0,{value:e.value})):o.s6}
              `)}
          </div>
          <button type="button" class="mc-btn mc-btn-secondary" @click=${()=>{const e=p.find(e=>!c.some(t=>t.value===e)),t=e??`value_${c.length+1}`;m([...c,{label:e??(0,h.t)(697,{n:c.length+1}),value:t}])}}>${(0,h.t)(48)}</button>
        </div>
      </div>
    `}};var ba=i(1495);const ya={type:"light",entityField:!0,general(e,t,i,n,a){const s=Do(e,n),r=e,l=Io(r,a),c=l?t?.states[l]:void 0,d=(e,t,i)=>e&&c&&!t?(0,$t.m1)((0,h.t)(1072,{what:i})):o.s6;return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),r,i,t,a,{domain:"light",syncCtx:s})}
        ${(0,$t.vm)((0,h.t)(920),!1!==r.show_brightness,e=>i({...r,show_brightness:e}),"show_brightness",s)}
        ${d(!1!==r.show_brightness,!c||(0,Jn.c9)(c),(0,h.t)(1207))}
        ${(0,$t.vm)((0,h.t)(925),r.show_color_temp,e=>i({...r,show_color_temp:e}),"show_color_temp",s)}
        ${d(r.show_color_temp,!c||(0,Jn.eI)(c),(0,h.t)(1210))}
        ${(0,$t.vm)((0,h.t)(924),r.show_color,e=>i({...r,show_color:e}),"show_color",s)}
        ${d(r.show_color,!c||(0,Jn.Aw)(c),(0,h.t)(1211))}
        ${(0,$t.vm)((0,h.t)(929),r.show_effect,e=>i({...r,show_effect:e}),"show_effect",s)}
        ${d(r.show_effect,!c||(0,ba.Q)(c),(0,h.t)(1214))}
        ${(0,$t.vm)((0,h.t)(221),r.compact,e=>i({...r,compact:e}),"compact",s)}
        ${(0,$t.m1)((0,h.t)(1021))}
        ${"svg"!==r.icon?(0,$t.AJ)((0,h.t)(464),r.icon,e=>i({...r,icon:e||void 0}),t,"icon",s,{module:r,onModule:i}):o.s6}
        ${Vn(r,t,i,{entity:l,icon:r.icon||(0,qn.fq)(t,l)||"mdi:lightbulb",allowStateIcons:!!l,syncCtx:s})}
      </div>
    `}},_a={type:"gauge",entityField:!0,general(e,t,i,n,a){const s=Do(e,n),r=e,l=Io(r,a);return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(357),r,i,t,a,{syncCtx:s})}
        ${(0,$t.FQ)((0,h.t)(105),r.attribute,e=>i({...r,attribute:e}),t,l,"attribute",s,At(a))}
        ${(0,$t.aA)((0,h.t)(580),r.min,e=>i({...r,min:e}),void 0,"min",s)}
        ${(0,$t.aA)((0,h.t)(569),r.max,e=>i({...r,max:e}),void 0,"max",s)}
        ${(0,$t.De)((0,h.t)(413),r.gauge_style,[{label:(0,h.t)(433),value:"half"},{label:(0,h.t)(408),value:"full"},{label:(0,h.t)(780),value:"quarter"}],e=>i({...r,gauge_style:e}),"gauge_style",s)}
        ${(0,$t.vm)((0,h.t)(936),!1!==r.needle,e=>i({...r,needle:e}),"needle",s)}
        ${(0,$t.vm)((0,h.t)(935),!1!==r.show_name,e=>i({...r,show_name:e}),"show_name",s)}
        ${(0,$t.vm)((0,h.t)(949),!1!==r.show_unit,e=>i({...r,show_unit:e}),"show_unit",s)}
        ${(0,$t.aA)((0,h.t)(275),r.decimals,e=>i({...r,decimals:Number.isFinite(e)?e:void 0}),{min:0,max:6,optional:!0,placeholder:(0,h.t)(114)},"decimals",s)}
        ${(0,Ti._)((0,h.t)(209),r.severity,e=>i({...r,severity:e}),{min:r.min??0,max:r.max??100,propertyName:"severity",syncCtx:s,help:(0,h.t)(1034)})}
      </div>
    `}},wa={type:"horizontal",general(e,t,i,n){const a=Do(e,n),s=e;return o.qy`
      <div class="mc-tab-content">
        ${(0,$t.lm)((0,h.t)(410),s.gap,e=>i({...s,gap:e||void 0}),"gap",a,"8")}
        ${(0,$t.De)((0,h.t)(61),s.align,[{label:(0,h.t)(989),value:"start"},{label:(0,h.t)(182),value:"center"},{label:(0,h.t)(353),value:"end"},{label:(0,h.t)(1005),value:"stretch"}],e=>i({...s,align:e}),"align",a)}
        ${(0,$t.De)((0,h.t)(495),s.justify,[{label:(0,h.t)(989),value:"start"},{label:(0,h.t)(182),value:"center"},{label:(0,h.t)(353),value:"end"},{label:(0,h.t)(978),value:"space-between"},{label:(0,h.t)(977),value:"space-around"}],e=>i({...s,justify:e}),"justify",a)}
      </div>
    `}},$a={type:"vertical",general(e,t,i,n){const a=Do(e,n),s=e;return o.qy`
      <div class="mc-tab-content">
        ${(0,$t.lm)((0,h.t)(410),s.gap,e=>i({...s,gap:e||void 0}),"gap",a,"8")}
        ${(0,$t.De)((0,h.t)(61),s.align,[{label:(0,h.t)(989),value:"start"},{label:(0,h.t)(182),value:"center"},{label:(0,h.t)(353),value:"end"},{label:(0,h.t)(1005),value:"stretch"}],e=>i({...s,align:e}),"align",a)}
      </div>
    `}},ka=e=>Array.from({length:Math.max(e,1)},()=>"1").join("-"),xa=["1","1-1","2-1","1-2","1-1-1"],Ca="custom",Sa=(e,t,i)=>({row:t,setLayout:t=>i.setRowLayout(e,t),setWidths:(t,o)=>i.setColumnWidths(e,t,o),sync:qa(e,t,i)});function Ma(e){const t=e.row,i=t.columns.length,n=(0,f.SU)(t),a=t.layout||ka(i),s=n?Ca:a,r=xa.includes(a)?xa:[...xa,a],l=n?[...r,Ca]:r,c=t=>{t!==s&&t!==Ca&&e.setLayout(t)};return o.qy`
    <div class="field">
      <div class="field-head"><span class="lbl" id="row-layout-lbl">${(0,h.t)(214)}</span></div>
      <div class="seg full" role="radiogroup" aria-labelledby="row-layout-lbl" @keydown=${e=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))return;e.preventDefault();const t=l.indexOf(s),i="ArrowLeft"===e.key||"ArrowUp"===e.key?-1:1,o="Home"===e.key?0:"End"===e.key?l.length-1:(t+i+l.length)%l.length,n=l[o];c(n);const a=e.currentTarget;requestAnimationFrame(()=>a.querySelector(`[data-val="${n}"]`)?.focus())}}>
        ${l.map(e=>{const n=e===s,a=e===Ca?(0,f.U$)((0,f.JR)(t)):_t(e),r=e===Ca?(0,h.t)(1252,{n:i}):function(e){const t=e.length;if(t<=1)return(0,h.t)(6);const i=e.map(e=>String(+e.toFixed(2))).reduce((e,t)=>(0,h.t)(1239,{from:e,to:t}));return(0,h.t)(1286,{n:t,ratio:i})}(a);return o.qy`
            <button
              type="button"
              role="radio"
              class="layout-opt"
              data-val=${e}
              aria-checked=${n?"true":"false"}
              aria-label=${r}
              title=${r}
              tabindex=${n?"0":"-1"}
              @click=${()=>c(e)}
            >${yt(a)}</button>
          `})}
      </div>
      <p class="help">${(0,h.t)(797)}</p>
    </div>
  `}const Aa=["fr","%","px"];function qa(e,t,i){if(!i.getConfig().template)return o.s6;const n=!t.not_synced?.includes("column_widths");return o.qy`<mc-sync-indicator
    .synced=${n}
    .hasTemplate=${!0}
    .hideIfNoTemplate=${!0}
    .propertyPath=${"column_widths"}
    @sync-toggle=${o=>{o.stopPropagation(),i.updateRow(e,{not_synced:ge(t.not_synced,"column_widths",n)})}}
  ></mc-sync-indicator>`}function Ea(e,t,i,o){const n=function(e){return""===e.trim()?"1fr":(0,f.W8)(e)}(i),a=(0,f.JR)(e.row);!n||(0,f.SU)(e.row)&&a[t]===n?o?.revert?.():(a[t]=n,e.setWidths(a))}function Ta(e){const t=(0,f.JR)(e.row),i=(0,f.SU)(e.row);return o.qy`
    <div class="field col-widths">
      <div class="field-head">
        <span class="lbl" id="row-widths-lbl">${(0,h.t)(216)}</span>
        ${e.sync??o.s6}
        ${(0,Yt.i)((0,h.t)(216),i,()=>e.setWidths(void 0))}
      </div>
      <div class="col-width-list" role="group" aria-labelledby="row-widths-lbl">
        ${t.map((t,i)=>o.qy`
          <div class="col-width">
            <span class="col-width-lbl" aria-hidden="true">${(0,h.t)(218,{n:i+1})}</span>
            <mc-unit-field
              .value=${t}
              .label=${(0,h.t)(219,{n:i+1})}
              .units=${Aa}
              @value-changed=${t=>Ea(e,i,t.detail.value,t.target)}
            ></mc-unit-field>
          </div>
        `)}
      </div>
      <div class="col-widths-foot">
        <button
          type="button"
          class="btn btn-text btn-sm"
          @click=${()=>e.setWidths(void 0,ka(e.row.columns.length))}
        ><ha-icon icon="mdi:arrow-split-vertical"></ha-icon>${(0,h.t)(370)}</button>
      </div>
      <p class="help">${(0,h.t)(1219)}</p>
    </div>
  `}const La=[{label:1098,value:"start"},{label:182,value:"center"},{label:142,value:"end"},{label:1005,value:"stretch"}];function za(e,t,i,o,n,a=!0){return jt(e,o,t=>{const o=t,s={entity:o.entity,share_entity:o.share_entity};if(a&&i.getConfig().template){const t=["entity","share_entity"].filter(t=>s[t]!==e[t]);s.not_synced=Array.from(new Set([...e.not_synced??[],...t]))}n(s)},hn(i.getConfig(),t))}function ja(e,t,i,n,a=o.s6){const s=n&&n.row.columns.length>1?o.qy`
        <div class="field">
          <div class="field-head">
            <label for="col-width">${(0,h.t)(1178)}</label>
            ${n.sync??o.s6}
            ${(0,Yt.i)((0,h.t)(1178),(0,f.SU)(n.row)&&"1fr"!==(0,f.JR)(n.row)[t],()=>Ea(n,t,"1fr"))}
          </div>
          <mc-unit-field
            data-col-width
            inputId="col-width"
            .value=${(0,f.JR)(n.row)[t]}
            .label=${(0,h.t)(1178)}
            .units=${Aa}
            @value-changed=${e=>Ea(n,t,e.detail.value,e.target)}
          ></mc-unit-field>
          <p class="help">${(0,h.t)(682)}</p>
        </div>
      `:o.s6;return o.qy`
    ${a}
    <div class="group">
      ${s}
      ${(0,$t.De)((0,h.t)(1157),e.vertical_align||"start",(0,h.tl)(La),e=>i({vertical_align:e}))}
      ${(0,$t.lm)((0,h.t)(410),e.gap,e=>i({gap:e||void 0}))}
      ${(0,$t.Mg)((0,h.t)(713),e.padding,e=>i({padding:e}),"padding")}
    </div>
  `}function Ra(e,t,i,n){return o.qy`<mc-design-panel .design=${t} .hass=${i} .target=${e} .onChange=${n}></mc-design-panel>`}function Oa(e,t,i){const o=!!i.getConfig().template,n={...e.design,...t};for(const e of Object.keys(n))void 0!==n[e]&&""!==n[e]||delete n[e];o&&"value_background"in t&&void 0===t.value_background&&(n.value_background={type:"none"}),o&&"shape"in t&&(void 0===t.shape&&(n.shape="none"),void 0===t.shape_options&&(n.shape_options={}));const a={design:n};return o&&!e.not_synced?.includes("design")&&(a.not_synced=[...e.not_synced||[],"design"]),a}function Pa(e,t,i,n){const a=t.conditions||[];return o.qy`
      ${Wt(a,t.mode||"every",{onAdd:()=>i({...t,conditions:[...a,{id:`cond-${Date.now()}`,type:"state",entity:"",state:""}]}),onUpdate:(e,o)=>i({...t,conditions:a.map((t,i)=>i===e?{...t,...o}:t)}),onRemove:e=>{const o=a.filter((t,i)=>i!==e);i({...t,conditions:o.length?o:void 0})},onMode:e=>i({...t,mode:e})},n,void 0,e)}
  `}const Ha={type:"row",general:(e,t,i,n)=>function(e,t,i){const n=e.columns||[],a=(o,n="keep")=>{const a={...e};if(o(a),i&&"keep"!==n){const t=(e.not_synced||[]).filter(e=>"column_widths"!==e);a.not_synced="mark"===n?[...t,"column_widths"]:t}t(a)},s={row:{...e,columns:n},setLayout:e=>a(t=>{const i=n.map(e=>e&&"object"==typeof e?{...e}:b()),o={columns:i};(0,f.Hi)(o,e,b),i.length!==n.length&&(t.columns=i),t.layout=e,delete t.column_widths},"mark"),setWidths:(e,t)=>a(i=>{e?.length?i.column_widths=[...e]:delete i.column_widths,t&&(i.layout=t)},e?.length?"keep":t?"mark":"reset"),sync:i?(0,$t.pZ)("column_widths",i):o.s6};return o.qy`
    <div class="group">
      ${Ma(s)}
      ${n.length>1?Ta(s):o.s6}
      ${(0,$t.lm)((0,h.t)(411),e.gap,i=>t({...e,gap:i||void 0}),"gap",i,"8")}
      ${(0,$t.Mg)((0,h.t)(713),e.padding,i=>t({...e,padding:i}),"padding","padding",i)}
    </div>
  `}(e,i,Do(e,n))},Da={type:"tabs",general(e,t,i,n){const a=Do(e,n),s=e,r=s.tabs||[];return o.qy`
      <div class="mc-tab-content">
        ${(0,$t.De)((0,h.t)(1017),s.tab_style,[{label:(0,h.t)(276),value:"default"},{label:(0,h.t)(751),value:"pills"},{label:(0,h.t)(1108),value:"underline"}],e=>i({...s,tab_style:e}),"tab_style",a)}
        ${r.length>1?(0,$t.De)((0,h.t)(278),String(Math.min(s.active_tab??0,r.length-1)),r.map((e,t)=>({label:e.label||(0,h.t)(1018,{n:t+1}),value:String(t)})),e=>i({...s,active_tab:Number(e)}),"active_tab",a):o.s6}
        ${r.some(e=>e.icon)?Vn(s,t,i,{icon:r.find(e=>e.icon)?.icon??"",syncCtx:a}):o.s6}
        <p class="help">${(0,h.t)(55)}</p>
      </div>
    `}},Ia={type:"separator",tabs:["general","conditions","design"],general(e,t,i,n){const a=Do(e,n),s=e;return o.qy`
      <div class="mc-tab-content">
        ${(0,$t.De)((0,h.t)(305),s.direction,[{label:(0,h.t)(453),value:"horizontal"},{label:(0,h.t)(1156),value:"vertical"}],e=>i({...s,direction:e}),"direction",a)}
        ${(0,$t.De)((0,h.t)(1007),s.separator_style,[{label:(0,h.tc)("line",1224),value:"solid"},{label:(0,h.t)(271),value:"dashed"},{label:(0,h.t)(313),value:"dotted"},{label:(0,h.t)(654),value:"none"}],e=>i({...s,separator_style:e}),"separator_style",a)}
        ${(0,$t.Yd)((0,h.t)(205),s.separator_color,e=>i({...s,separator_color:e}),"separator_color",a)}
        ${(0,$t.lm)((0,h.t)(1178),s.separator_width,e=>i({...s,separator_width:e||void 0}),"separator_width",a,"1")}
      </div>
    `}},Fa={type:"slider-layout",general(e,t,i,n){const a=Do(e,n),s=e;return o.qy`
      <div class="mc-tab-content">
        ${(0,$t.vm)((0,h.t)(714),!1!==s.pagination,e=>i({...s,pagination:e}),"pagination",a)}
        ${(0,$t.vm)((0,h.t)(618),!1!==s.navigation,e=>i({...s,navigation:e}),"navigation",a)}
        ${(0,$t.aA)((0,h.t)(966),s.slides_per_view??1,e=>i({...s,slides_per_view:e>0?e:1}),{min:1,max:6,step:.1},"slides_per_view",a)}
        ${(0,$t.aA)((0,h.t)(979),s.space_between??8,e=>i({...s,space_between:e>=0?e:0}),{min:0,step:1},"space_between",a)}
        ${(0,$t.vm)((0,h.t)(549),s.loop,e=>i({...s,loop:e}),"loop",a,(0,h.t)(58))}
        ${(0,$t.vm)((0,h.t)(117),s.autoplay,e=>i({...s,autoplay:e}),"autoplay",a)}
        ${s.autoplay?(0,$t.aA)((0,h.t)(118),s.autoplay_delay??5e3,e=>i({...s,autoplay_delay:e}),{min:1e3,step:500},"autoplay_delay",a):o.s6}
      </div>
    `}};var Va=i(2016),Na=i(9219);const Za=new Set,Ba={type:"clock",tabs:["general","conditions","design"],general(e,t,i,n){const a=Do(e,n),s=e,r=void 0===s.format_12h?"auto":s.format_12h?"12":"24",l=(0,Na.bE)(s.date_format),c=Za.has(s.id)||!((0,Na.S1)(l)||"iso"===l),d=new Date,u=e=>(0,Na.GC)(d,e,t);return o.qy`
      <div class="mc-tab-content">
        ${(0,$t.De)((0,h.t)(1089),r,[{label:(0,h.t)(115,{format:(0,Va.oE)(t)?(0,h.t)(8):(0,h.t)(9)}),value:"auto"},{label:(0,h.t)(8),value:"12"},{label:(0,h.t)(9),value:"24"}],e=>{const t={...s};"auto"===e?delete t.format_12h:t.format_12h="12"===e,i(t)},"format_12h",a)}
        ${(0,$t.vm)((0,h.t)(940),s.show_seconds,e=>i({...s,show_seconds:e}),"show_seconds",a)}
        ${(0,$t.vm)((0,h.t)(928),!1!==s.show_date,e=>i({...s,show_date:e}),"show_date",a)}
        ${!1!==s.show_date?o.qy`
            ${(0,$t.De)((0,h.t)(272),c?"custom":l,[{label:(0,h.t)(915,{example:u("short")}),value:"short"},{label:(0,h.t)(577,{example:u("medium")}),value:"medium"},{label:(0,h.t)(546,{example:u("long")}),value:"long"},{label:(0,h.t)(672,{example:u("numeric")}),value:"numeric"},{label:(0,h.t)(463,{example:u("iso")}),value:"iso"},{label:(0,h.t)(261),value:"custom"}],e=>{"custom"===e?Za.add(s.id):Za.delete(s.id),i({...s,date_format:"custom"===e?"ddd D MMM YYYY":e})},"date_format",a)}
            ${c?o.qy`
                ${(0,$t.Gz)((0,h.t)(273),s.date_format,e=>{Za.add(s.id),i({...s,date_format:e})},"date_format",a,{mono:!0})}
                ${(0,$t.m1)((0,h.t)(1193))}
              `:o.s6}
          `:o.s6}
      </div>
    `}};var Wa=i(3566);const Ka={type:"weather",entityField:!0,general(e,t,i,n,a){const s=Do(e,n),r=e,l=Io(r,a),c=l?t?.states[l]:void 0,d=c?(0,Wa.lA)(c):[];return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(1169),r,i,t,a,{domain:"weather",syncCtx:s})}
        ${(0,$t.vm)((0,h.t)(943),!1!==r.show_temperature,e=>i({...r,show_temperature:e}),"show_temperature",s)}
        ${(0,$t.vm)((0,h.t)(926),!1!==r.show_condition,e=>i({...r,show_condition:e}),"show_condition",s)}
        ${(0,$t.vm)((0,h.t)(81),!1!==r.animated_icons,e=>i({...r,animated_icons:e}),"animated_icons",s,(0,h.t)(83))}
        ${!1!==r.animated_icons?(0,$t.m1)(Fn(r.icon_fx)):Vn(r,t,i,{entity:l,icon:"",syncCtx:s})}
        ${(0,$t.vm)((0,h.t)(930),r.show_forecast,e=>i({...r,show_forecast:e}),"show_forecast",s)}
        ${r.show_forecast?(0,$t.aA)((0,h.t)(399),r.forecast_days,e=>i({...r,forecast_days:e}),{min:1,max:14},"forecast_days",s):o.s6}
        ${r.show_forecast&&c&&d.length&&!d.includes("daily")?(0,$t.m1)((0,h.t)(1068)):o.s6}
      </div>
    `}},Ua={daily:269,hourly:455,twice_daily:1105},Ga={type:"forecast",entityField:!0,general(e,t,i,n,a){const s=Do(e,n),r=e,l=Io(r,a),c=l?t?.states[l]:void 0,d=c?(0,Wa.lA)(c):[],u=r.forecast_type??"daily",p=c&&d.length&&!d.includes(u)?d[0]:void 0;return o.qy`
      <div class="mc-tab-content">
        ${zt((0,h.t)(1169),r,i,t,a,{domain:"weather",syncCtx:s})}
        ${(0,$t.De)((0,h.t)(400),u,["daily","hourly","twice_daily"].map(e=>({label:c&&d.length&&!d.includes(e)?(0,h.t)(1293,{type:(0,h.t)(Ua[e])}):(0,h.t)(Ua[e]),value:e})),e=>i({...r,forecast_type:e}),"forecast_type",s)}
        ${p?(0,$t.m1)((0,h.t)(1070,{type:(0,h.t)(Ua[u]).toLowerCase(),fallback:(0,h.t)(Ua[p]).toLowerCase()})):o.s6}
        ${(0,$t.aA)((0,h.t)(671),r.num_forecasts,e=>i({...r,num_forecasts:e}),{min:1,max:48},"num_forecasts",s)}
        ${(0,$t.vm)((0,h.t)(81),!1!==r.animated_icons,e=>i({...r,animated_icons:e}),"animated_icons",s,(0,h.t)(83))}
        ${!1!==r.animated_icons?(0,$t.m1)(Fn(r.icon_fx)):Vn(r,t,i,{entity:l,icon:"",syncCtx:s})}
        ${(0,$t.vm)((0,h.t)(943),!1!==r.show_temperature,e=>i({...r,show_temperature:e}),"show_temperature",s)}
        ${(0,$t.vm)((0,h.t)(939),!1!==r.show_precipitation,e=>i({...r,show_precipitation:e}),"show_precipitation",s)}
        ${(0,$t.vm)((0,h.t)(952),r.show_wind,e=>i({...r,show_wind:e}),"show_wind",s)}
      </div>
    `}},Ya={type:"video-bg",tabs:["general","conditions","design"],general(e,t,i,n){const a=Do(e,n),s=e;return o.qy`
      <div class="mc-tab-content">
        ${(0,$t.m1)((0,h.t)(758))}
        ${(0,$t.nZ)((0,h.t)(1159),s.url,e=>i({...s,url:e}),t,"video","url",a)}
        ${(0,$t.nZ)((0,h.t)(764),s.poster,e=>i({...s,poster:e}),t,"image","poster",a)}
        ${(0,$t.m1)((0,h.t)(955))}
        ${(0,$t.Wn)((0,h.t)(389),s.fit??"cover",[{label:(0,h.t)(251),value:"cover"},{label:(0,h.t)(230),value:"contain"}],e=>i({...s,fit:e}),"fit",a)}
        ${(0,$t.vm)((0,h.t)(117),!1!==s.autoplay,e=>i({...s,autoplay:e}),"autoplay",a,(0,h.t)(759))}
        ${(0,$t.vm)((0,h.t)(549),!1!==s.loop,e=>i({...s,loop:e}),"loop",a)}
        ${(0,$t.vm)((0,h.t)(606),!1!==s.muted,e=>i({...s,muted:e}),"muted",a,(0,h.t)(152))}
      </div>
    `}};var Qa=i(4862),Ja=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const Xa=["entity: sensor.temperature","name: My Sensor","show_state: true"].join("\n");let es=class extends o.WF{constructor(){super(...arguments),this.schema=[],this._label=e=>this.computeLabel?.(e,this._localize)||(e.name?this._localize?.(`ui.panel.lovelace.editor.card.generic.${e.name}`):"")||e.name||"",this._helper=e=>this.computeHelper?.(e,this._localize)}createRenderRoot(){return this}setConfig(e){this.assertConfig?.(e),this._config=e}get _localize(){return this.hass?.localize}_changed(e){e.stopPropagation();const t=e.detail?.value;t&&(this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:t}})))}render(){return o.qy`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${this._changed}
    ></ha-form>`}};Ja([(0,n.MZ)({attribute:!1})],es.prototype,"hass",void 0),Ja([(0,n.MZ)({attribute:!1})],es.prototype,"schema",void 0),Ja([(0,n.wk)()],es.prototype,"_config",void 0),es=Ja([(0,n.EM)("mc-card-form-editor")],es);let ts=class extends o.WF{constructor(){super(...arguments),this._status="idle",this._yamlMode=!1,this._synced="",this._emitted=[],this._generation=0}createRenderRoot(){return this}willUpdate(){const e=this.config?.card_type||void 0;e!==this._editorType&&this._load(e)}updated(){const e=this._editor,t=this.config;if(!e||"ready"!==this._status||!t?.card_type)return;this.hass&&(e.hass=this.hass);const i=(0,Qa._Y)((0,Qa.k2)(t.card_type,t.card_config)),o=this._emitted.indexOf(i);if(-1===o){if(i!==this._synced){let o;this._emitted=[],this._synced=i;try{e.setConfig?.(JSON.parse(JSON.stringify((0,Qa.k2)(t.card_type,t.card_config))))}catch(e){o=e instanceof Error?e.message:String(e)}o!==this._guiError&&(this._guiError=o)}}else this._emitted.splice(0,o+1)}async _load(e){const t=++this._generation;if(this._editorType=e,this._editor=void 0,this._synced="",this._emitted=[],this._guiError=void 0,!e)return void(this._status="idle");let i;this._status="loading";try{i=await this._createEditor(e)}catch{i=void 0}t===this._generation&&(i&&i.addEventListener("config-changed",t=>{if(t.stopPropagation(),i!==this._editor||!this.isConnected)return;const o=t.detail?.config,n=this.config;if(!n||!o||"object"!=typeof o||Array.isArray(o))return;const{type:a,...s}=o;this._synced=(0,Qa._Y)((0,Qa.k2)(e,s)),this._emitted.push(this._synced),this.onChange?.({...n,card_config:s,card_config_yaml:void 0})}),this._editor=i,this._status="ready")}async _createEditor(e){const t=await async function(e,t){if(e.startsWith("custom:")){const t=e.slice(7);return await(0,Qa.IC)(t),customElements.get(t)}const i=`hui-${e}-card`;if(!customElements.get(i)){const e=(0,Qa.cy)();if(!e)return;const o=(await e).createCardElement(t);if(!customElements.get(i)&&o.localName!==i)return;await(0,Qa.IC)(i)}return customElements.get(i)}(e,(0,Qa.k2)(e,this.config?.card_config));let i;return"function"==typeof t?.getConfigElement&&(i=await t.getConfigElement()??void 0,i?.localName?.includes("-")&&await(0,Qa.IC)(i.localName)),i||"function"!=typeof t?.getConfigForm||(i=await async function(e){if(!Array.isArray(e?.schema))return;const t=customElements.get("hui-form-editor")?"hui-form-editor":"mc-card-form-editor";if("mc-card-form-editor"===t&&!customElements.get("ha-form"))try{await(0,Qa.IC)("ha-form")}catch{return}const i=document.createElement(t);return i.schema=e.schema,e.computeLabel&&(i.computeLabel=e.computeLabel),e.computeHelper&&(i.computeHelper=e.computeHelper),e.assertConfig&&(i.assertConfig=e.assertConfig),i}(await t.getConfigForm())),i&&this.hass&&(i.hass=this.hass),i??void 0}_renderYaml(e,t){const i=e.card_config_yaml??(e.card_config?(0,k.fE)(e.card_config):""),n=(0,k.EA)(i),a=""===i||null!==n;return o.qy`
      <div class="mc-yaml-fallback">
        ${t?o.qy`<div class="mc-yaml-fallback-note">${t}</div>`:o.s6}
        <textarea
          .value=${i}
          @input=${t=>{const i=t.target.value,o=this.config??e,n=(0,k.EA)(i);null===n||"object"!=typeof n||Array.isArray(n)?this.onChange?.({...o,card_config_yaml:i}):this.onChange?.({...o,card_config:n,card_config_yaml:i})}}
          rows="12"
          placeholder=${Xa}
        ></textarea>
        ${a?o.s6:o.qy`<div class="mc-yaml-fallback-error">
              ${(0,h.t)(494)}
            </div>`}
        <div class="mc-yaml-fallback-help">
          ${(0,h.tx)(1059,{key:o.qy`<code>type</code>`})}
        </div>
      </div>
    `}_renderToggle(e){return o.qy`<div class="mc-card-editor-toolbar">
      <button
        type="button"
        class="mc-btn mc-btn-secondary mc-btn-compact mc-card-editor-toggle"
        ?disabled=${!e&&!!this._guiError}
        @click=${()=>{this._yamlMode=e}}
      >
        ${e?(0,h.t)(923):(0,h.t)(951)}
      </button>
    </div>`}render(){const e=this.config;return e?.card_type?"ready"!==this._status?o.qy`<div class="mc-editor-loading">${(0,h.t)(535)}</div>`:this._editor?this._yamlMode||this._guiError?o.qy`${this._renderToggle(!1)}${this._renderYaml(e,this._guiError?(0,h.t)(1057,{error:this._guiError}):void 0)}`:o.qy`${this._renderToggle(!0)}${this._editor}`:this._renderYaml(e,(0,h.t)(653)):o.s6}};Ja([(0,n.MZ)({attribute:!1})],ts.prototype,"config",void 0),Ja([(0,n.MZ)({attribute:!1})],ts.prototype,"hass",void 0),Ja([(0,n.MZ)({attribute:!1})],ts.prototype,"onChange",void 0),Ja([(0,n.wk)()],ts.prototype,"_status",void 0),Ja([(0,n.wk)()],ts.prototype,"_yamlMode",void 0),Ja([(0,n.wk)()],ts.prototype,"_guiError",void 0),ts=Ja([(0,n.EM)("mc-custom-card-editor")],ts);const is={type:"custom-card",tabs:["general","conditions","design"],general(e,t,i,n){const a=Do(e,n),s=e;return o.qy`
      <div class="mc-tab-content">
        ${(0,$t.Gz)((0,h.t)(612),s.name,e=>i({...s,name:e}),"name",a)}
        ${(0,$t.m1)((0,h.t)(75),"mc-field-hint-tight")}
        ${(0,$t.pA)((0,h.t)(180),s.card_type,e=>i({...s,card_type:e}))}
        ${s.card_type?o.qy`
            <div class="mc-card-editor-section">
              <div class="mc-card-editor-header">
                <ha-icon class="mc-card-editor-icon" icon="mdi:cog"></ha-icon>
                ${(0,h.t)(171)}
              </div>
              <div class="mc-card-editor-body">
                <mc-custom-card-editor .config=${s} .hass=${t} .onChange=${i}></mc-custom-card-editor>
              </div>
            </div>
          `:o.s6}
      </div>
    `}};for(const e of[An,Nn,Bn,Kn,Un,Gn,Yn,Qn,Xn,ua,ga,va,ya,_a,wa,$a,Ha,Da,Ia,Fa,Ba,Ka,Ga,Ya,is])nn.register(e);var os=i(1987),ns=i(8805),as=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const ss=[{value:"sheet",label:912},{value:"dialog",label:303}];let rs=class extends o.WF{constructor(){super(...arguments),this.canvas=!1,this._status=""}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this._statusTimer)}get _p(){return this.popup&&"object"==typeof this.popup?this.popup:{}}_set(e){const t={...this._p,...e};for(const[e,i]of Object.entries(t))(void 0===i||""===i||"number"==typeof i&&Number.isNaN(i))&&delete t[e];this.onChange?.(t)}_say(e){this._status=e,window.clearTimeout(this._statusTimer),this._statusTimer=window.setTimeout(()=>{this._status=""},2500)}_field(e,t,i,n,a=o.s6){const s=t?this._p[t]:void 0,r=void 0!==s&&""!==s;return o.qy`
      <div class="field">
        <div class="field-head">
          ${n?o.qy`<label for=${n}>${e}</label>`:o.qy`<span class="lbl">${e}</span>`}
          ${t?(0,Yt.i)(e,r,()=>this._set({[t]:void 0})):o.s6}
        </div>
        ${i}${a}
      </div>
    `}_text(e,t,i,n=!1){return o.qy`<input
      class="input ${n?"mono":""}"
      id=${e}
      type="text"
      spellcheck=${n?"false":o.s6}
      autocomplete="off"
      placeholder=${i}
      .value=${this._p[t]||""}
      @input=${e=>{const i=e.target.value;this._set({[t]:"hash"===t?(0,Pt.oi)(i):i})}}
    />`}_unit(e,t,i,n){return o.qy`<mc-unit-field
      .value=${this._p[e]||""}
      .label=${t}
      .units=${i}
      .placeholder=${n}
      @value-changed=${t=>this._set({[e]:t.detail.value})}
    ></mc-unit-field>`}_seg(e,t,i,n){return o.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const o=i.findIndex(e=>e.value===t),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const s=i[(o+a[e.key]+i.length)%i.length].value,r=e.currentTarget;n(s),requestAnimationFrame(()=>r.querySelector(`[data-val="${s}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return o.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>n(e.value)}
        >${(0,h.t)(e.label)}</button>`})}
    </div>`}_trigger(e,t,i){const n=this._p[e]||{},a=t=>{const i={...this._p[e]||{},...t};for(const[e,t]of Object.entries(i))void 0!==t&&""!==t||delete i[e];this._set({[e]:Object.keys(i).length?i:void 0})},s=`popup-${e}-state`;return o.qy`
      <div class="field">
        <div class="field-head">
          <span class="lbl">${t}</span>
          ${(0,Yt.i)(t,!(!n.entity&&!n.state),()=>this._set({[e]:void 0}))}
        </div>
        <div class="trigger">
          <mc-entity-picker
            .hass=${this.hass}
            .value=${n.entity||""}
            .label=${(0,h.t)(357)}
            @value-changed=${e=>a({entity:e.detail.value})}
          ></mc-entity-picker>
          <input
            class="input"
            id=${s}
            type="text"
            aria-label=${(0,h.t)(1246,{label:t})}
            placeholder=${(0,h.t)(997)}
            .value=${n.state||""}
            @input=${e=>a({state:e.target.value.trim()})}
          />
        </div>
        <p class="help">${i}</p>
      </div>
    `}async _copy(e){try{await navigator.clipboard.writeText(e),this._say((0,h.t)(621))}catch{this._say((0,h.t)(238))}}async _preview(){await ns.tQ.popup.load(),this._say((0,Ht.T)()?.api.preview(this.canvas)?"":(0,h.t)(644))}render(){const e=this._p,t=(0,Pt.oi)(e.hash),i=(0,Pt.NG)(t),n=(0,Pt.BI)(t)?`#${t}`:"",a=e.backdrop_opacity,s=i?o.qy`<p class="help error" role="alert">${i}</p>`:n?o.qy`
            <div class="path">
              <span class="help">${(0,h.t)(620)}</span>
              <code>${n}</code>
              <button type="button" class="icon-btn sm" aria-label=${(0,h.t)(240)} title=${(0,h.t)(240)} @click=${()=>this._copy(n)}>
                <ha-icon icon="mdi:content-copy"></ha-icon>
              </button>
            </div>
            <p class="help">${(0,h.tx)(690,{path:o.qy`<span class="mono">${n}</span>`})}</p>
          `:o.qy`<p class="help">${(0,h.t)(1185)}</p>`;return o.qy`
      <div class="popup-ed">
        ${this._field((0,h.t)(762),"hash",this._text("popup-hash","hash","kitchen",!0),"popup-hash",s)}
        ${this._field((0,h.t)(1091),"title",this._text("popup-title","title",(0,h.t)(635)),"popup-title")}
        ${this._field((0,h.t)(1007),"style",this._seg((0,h.t)(1007),"dialog"===e.style?"dialog":"sheet",(0,h.tl)(ss),e=>this._set({style:e})))}
        <div class="two">
          ${this._field((0,h.t)(1178),"width",this._unit("width",(0,h.t)(1178),["px","%","vw","rem","em"],Pt.Uh.width.replace("px","")))}
          ${this._field((0,h.t)(570),"max_height",this._unit("max_height",(0,h.t)(570),["vh","px","%","rem"],Pt.Uh.max_height.replace("vh","")))}
        </div>
        <div class="two">
          ${this._field((0,h.t)(123),"backdrop_blur",this._unit("backdrop_blur",(0,h.t)(123),["px"],Pt.Uh.backdrop_blur.replace("px","")))}
          ${this._field((0,h.t)(124),"backdrop_opacity",o.qy`<input
              class="input"
              id="popup-opacity"
              type="number"
              min="0"
              max="100"
              step="5"
              placeholder=${String(100*Pt.Uh.backdrop_opacity)}
              aria-describedby="popup-opacity-unit"
              .value=${void 0===a?"":String(Math.round(100*(a>1?a/100:a)))}
              @input=${e=>{const t=e.target.value;this._set({backdrop_opacity:""===t?void 0:Math.min(100,Math.max(0,Number(t)))/100})}}
            /><p class="help" id="popup-opacity-unit">${(0,h.t)(728)}</p>`,"popup-opacity")}
        </div>
        <div class="switch-row">
          <div class="txt"><div class="field-head"><label>${(0,h.t)(922)}</label></div></div>
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${!1!==e.show_close?"true":"false"}
            aria-label=${(0,h.t)(922)}
            @click=${()=>this._set({show_close:!1===e.show_close&&void 0})}
          ></button>
        </div>
        ${this._field((0,h.t)(110),"auto_close",o.qy`<input
            class="input"
            id="popup-auto"
            type="number"
            min="0"
            step="1"
            placeholder=${(0,h.t)(674)}
            .value=${e.auto_close?String(e.auto_close):""}
            @input=${e=>{const t=e.target.value,i=Number(t);this._set({auto_close:""!==t&&i>0?i:void 0})}}
          /><p class="help">${(0,h.t)(884)}</p>`,"popup-auto")}
        ${this._trigger("open_on",(0,h.t)(693),(0,h.t)(695))}
        ${this._trigger("close_on",(0,h.t)(199),(0,h.t)(201))}
        <div class="actions">
          <button type="button" class="btn btn-secondary btn-sm" @click=${()=>this._preview()}>
            <ha-icon icon="mdi:eye-outline"></ha-icon>${(0,h.t)(772)}
          </button>
          <span class="help" role="status" aria-live="polite">${this._status}</span>
        </div>
      </div>
    `}};rs.styles=[l.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .popup-ed {
        display: grid;
        gap: 16px;
      }
      .path {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-top: 6px;
        min-width: 0;
      }
      .path code {
        font-family: var(--mc-mono, 'Roboto Mono', ui-monospace, monospace);
        font-size: 0.8125rem;
        overflow-wrap: anywhere;
      }
      .two {
        align-items: start;
      }
      .trigger {
        display: grid;
        gap: 12px;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
      }
    `],as([(0,n.MZ)({attribute:!1})],rs.prototype,"popup",void 0),as([(0,n.MZ)({attribute:!1})],rs.prototype,"hass",void 0),as([(0,n.MZ)({type:Boolean})],rs.prototype,"canvas",void 0),as([(0,n.MZ)({attribute:!1})],rs.prototype,"onChange",void 0),as([(0,n.wk)()],rs.prototype,"_status",void 0),rs=as([(0,n.EM)("mc-popup-settings")],rs);const ls=["icon","button","info","light","weather","image","camera","gauge"];var cs=i(4204),ds=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const hs=e=>{const t=e.replace(/\s*\([^)]*\)$/,"");return t.charAt(0).toLowerCase()+t.slice(1)},us=[{value:"curve",label:254},{value:"straight",label:1003},{value:"elbow",label:343}],ps=[{value:"auto",label:108},{value:"top",label:1098},{value:"right",label:833},{value:"bottom",label:142},{value:"left",label:511}],ms=[{value:"icon",label:469},{value:"box",label:586}],gs=[{value:"none",label:654},{value:"value",label:1151},{value:"template",label:1024}],fs=[{value:"auto",label:108},{value:"line",label:679},{value:"side",label:137},{value:"hidden",label:440}],vs=[{value:"always",label:66},{value:"flowing",label:1174}],bs=[{value:"back",label:120},{value:"front",label:406}];let ys=class extends o.WF{constructor(){super(...arguments),this.expanded=new Set,this._look=ra()?"ready":"idle",this._ownSections=new Map,this._ownUndo=new Map}willUpdate(){"idle"===this._look&&this.expanded.size&&this._loadLook()}_loadLook(e=!1){this._look="loading",sa().then(e=>{this._look=e?"ready":"failed"}),e&&this.updateComplete.then(()=>this.renderRoot.querySelector(".skeleton")?.focus())}_sectionOpen(e,t,i){return(this.sections??this._ownSections).get(`${e}|${t}`)??i}_setSection(e,t,i){const o=`${e}|${t}`;this.onSection?this.onSection(o,i):(this._ownSections.set(o,i),this.requestUpdate())}_lookOpen(e){const t=`${e}|look:`,i=new Set;for(const[e,o]of this.sections??this._ownSections)o&&e.startsWith(t)&&i.add(e.slice(t.length));return i}_snapshot(e){return(this.undoSnapshots??this._ownUndo).get(e)}_setSnapshot(e,t){this.onUndoSnapshot?this.onUndoSnapshot(e,t):(t?this._ownUndo.set(e,t):this._ownUndo.delete(e),this.requestUpdate())}get _flows(){const e=this.config?.flows;return Array.isArray(e)?e:[]}_write(e){if(!this.config)return;const t=(0,X.rP)(this._flows),i=(0,c.G)(this.config),o=e(i,(i.flows??[]).map(e=>({...e})));o.length?i.flows=o:delete i.flows,o.length===t.length&&(0,X.rP)(o).forEach((e,i)=>{e!==t[i]&&this.onRekey?.(t[i],e)}),this.onChange?.(i)}_patch(e,t,i){this._write((o,n)=>{const a=i?i(o):{},s={...n[e],...t,...a};for(const[e,i]of Object.entries({...t,...a}))(void 0===i||""===i||"number"==typeof i&&Number.isNaN(i))&&delete s[e];return n[e]=s,n})}_replace(e,t){this._write((i,o)=>(o[e]=t,o))}_add(){const e=Y();this._write((t,i)=>[...i,e]),this.expanded.has(e.id)||this.onToggle?.(e.id)}_remove(e){const t=(0,X.rP)(this._flows),i=t[e];this.expanded.has(i)&&this.onToggle?.(i);const o=(0,X.rP)(this._flows.filter((t,i)=>i!==e));for(let i=e;i<o.length;i++)t[i+1]!==o[i]&&this.onRekey?.(t[i+1],o[i]);this._write((t,i)=>i.filter((t,i)=>i!==e))}_field(e,t,i,n,a){return o.qy`
      <div class="field">
        <div class="field-head">
          ${a?o.qy`<label for=${a}>${e}</label>`:o.qy`<span class="lbl">${e}</span>`}
          ${i?(0,Yt.i)(hs(e),t,i):o.s6}
        </div>
        ${n}
      </div>
    `}_keyField(e,t,i,o,n,a){const s=t[i];return this._field(o,void 0!==s&&""!==s,()=>this._patch(e,{[i]:void 0}),n,a)}_seg(e,t,i,n,a){return o.qy`<div class="seg full" role="radiogroup" aria-label=${e} aria-describedby=${a||o.s6} @keydown=${e=>{const o=i.findIndex(e=>e.value===t),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const s=i[(o+a[e.key]+i.length)%i.length].value,r=e.currentTarget;n(s),requestAnimationFrame(()=>r.querySelector(`[data-val="${s}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return o.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>n(e.value)}
        >${e.label}</button>`})}
    </div>`}_select(e,t,i,n,a,s){return o.qy`<div class="select">
      <select class="input" id=${e} aria-label=${s||o.s6} aria-describedby=${a||o.s6} @change=${e=>n(e.target.value)}>
        ${i.map(e=>o.qy`<option value=${e.value} ?selected=${e.value===t} ?disabled=${!!e.disabled} title=${e.title??o.s6}>${e.label}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`}_number(e,t,i,n,a,s,r,l=1,c){const d=t[i];return o.qy`<input
      class="input"
      id=${n}
      type="number"
      min=${s??o.s6}
      max=${r??o.s6}
      step=${l}
      placeholder=${String(a)}
      aria-describedby=${c||o.s6}
      .value=${void 0===d?"":String(d)}
      @input=${t=>{const o=t.target.value,n=Number(o);""!==o.trim()&&Number.isFinite(n)&&this._patch(e,{[i]:n})}}
      @change=${t=>{const o=t.target;""!==o.value.trim()||o.validity?.badInput||this._patch(e,{[i]:void 0})}}
    />`}_switch(e,t,i,n,a,s){const r=t[i],l=r??a,c=`flow-${e}-${i}-help`;return o.qy`
      <div class="switch-row">
        <div class="txt">
          <div class="field-head">
            <span class="lbl">${n}</span>
            ${(0,Yt.i)(hs(n),void 0!==r,()=>this._patch(e,{[i]:void 0}))}
          </div>
          ${s?o.qy`<p class="help" id=${c}>${s}</p>`:o.s6}
        </div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${l?"true":"false"}
          aria-label=${n}
          aria-describedby=${s?c:o.s6}
          @click=${()=>this._patch(e,{[i]:l===a?!a:void 0})}
        ></button>
      </div>
    `}_entityColor(e){const t=e.entity||(this.config&&"string"==typeof e.from?(0,X.kc)(this.config).get(e.from):void 0)||"";return t?(0,ti.id)(this.hass?.states?.[t])??"":""}_color(e,t,i,n){const a=this._entityColor(t);return this._keyField(e,t,i,n,o.qy`<mc-color-picker
        .value=${t[i]||""}
        .label=${n}
        .allowEntity=${"color"===i}
        .entityColor=${a}
        @value-changed=${t=>this._patch(e,{[i]:t.detail.value})}
      ></mc-color-picker>`)}_endpoint(e,t,i,n){const a=`flow-${e}-${i}`,s="from"===i?(0,h.t)(402):(0,h.t)(1092),r="string"==typeof t[i]?t[i]:"",l="from"===i?t.to:t.from,c=!r||n.some(e=>e.id===r),d=n.filter(e=>!l||e.id!==l),u=d.some(e=>e.locked),p=[...r?[]:[{value:"",label:(0,h.t)(731),disabled:!0}],...c?[]:[{value:r,label:(0,h.t)(591,{id:r})}],...d.map(e=>e.locked?{value:e.value,label:(0,h.t)(1242,{label:e.label}),disabled:!0,title:(0,h.t)(417)}:{value:e.value,label:e.label})],m=`${a}-hint`,g=`${a}-locked`,f=[r&&c?"":m,u?g:""].filter(Boolean).join(" ");return o.qy`
      ${this._field(s,!1,void 0,this._select(a,r,p,t=>{t&&this._patch(e,{},e=>({[i]:G(e,t)}))},f),a)}
      ${r?c?o.s6:o.qy`<p class="help error" id=${m}>${(0,h.t)(590)}</p>`:o.qy`<p class="help" id=${m}>${"from"===i?(0,h.t)(742):(0,h.t)(741)}</p>`}
      ${u?o.qy`<p class="help" id=${g}>${(0,h.t)(594,{hint:(0,h.t)(417)})}</p>`:o.s6}
      ${this._anchorField(e,t,i,n)}
    `}_anchorable(e,t,i){const o=e[t],n="string"==typeof o&&o?i.find(e=>e.value===o)?.type:void 0;return!!n&&ls.includes(n)}_anchorField(e,t,i,n){if(!this._anchorable(t,i,n))return o.s6;const a=`${i}_anchor`,s=`flow-${e}-${i}-anchor`,r=(0,cs.Rk)(t)?"box":"icon",l="box"===t[a]?"box":"icon"===t[a]?"icon":r;return this._keyField(e,t,a,(0,h.t)(104),this._select(s,l,(0,h.tl)(ms),t=>this._patch(e,{[a]:t===r?void 0:t}),`flow-${e}-anchor-help`,"from"===i?(0,h.t)(990):(0,h.t)(354)),s)}_lookFallback(e,t){const i=t=>`flow-${e}-${t}`;return o.qy`
      ${this._color(e,t,"color",(0,h.t)(205))} ${this._color(e,t,"idle_color",(0,h.t)(478))}
      <div class="two">
        ${this._keyField(e,t,"width",(0,h.t)(1179),this._number(e,t,"width",i("width"),X.Y1.width,.5,40,.5),i("width"))}
        ${this._keyField(e,t,"glow",(0,h.t)(420),this._number(e,t,"glow",i("glow"),X.Y1.glow,0,30),i("glow"))}
      </div>
      ${this._switch(e,t,"scale_width",(0,h.t)(867),X.Y1.scale_width,(0,h.t)(1118))}
      <div class="two">
        ${this._keyField(e,t,"dots",(0,h.t)(312),this._number(e,t,"dots",i("dots"),X.Y1.dots,0,8,1,0===t.dots?i("dots-help"):void 0),i("dots"))}
        ${this._keyField(e,t,"dot_size",(0,h.t)(311),this._number(e,t,"dot_size",i("dot-size"),X.Y1.dot_size,1,40),i("dot-size"))}
      </div>
      ${0===t.dots?o.qy`<p class="help" id=${i("dots-help")}>${(0,h.t)(4)}</p>`:o.s6}
    `}_lookGroup(e,t,i){return"ready"===this._look&&customElements.get(ea._6)?o.qy`<mc-flow-look-editor
        .flow=${t}
        .hass=${this.hass}
        .flowKey=${i}
        .entityColor=${this._entityColor(t)}
        .budget=${this.budget}
        .open=${this._lookOpen(i)}
        .onToggle=${e=>this._setSection(i,`look:${e}`,!this._lookOpen(i).has(e))}
        .undo=${this._snapshot(i)}
        .onUndoChange=${e=>this._setSnapshot(i,e)}
        .onChange=${t=>this._replace(e,t)}
      ></mc-flow-look-editor>`:"ready"===this._look?this._lookFallback(e,t):"failed"===this._look?o.qy`
        ${(0,ta.lm)({tone:"warn",text:(0,h.t)(247),action:{label:(0,h.t)(1103),onClick:()=>this._loadLook(!0)}})}
        ${this._lookFallback(e,t)}
      `:o.qy`<div class="skeleton" role="status" aria-busy="true" tabindex="-1">
      <span>${(0,h.t)(538)}</span>
      <div class="bar"></div>
    </div>`}_fold(e,t,i,n,a,s){return o.qy`<mc-ui-disclosure
      level="5"
      .heading=${i}
      .summary=${n}
      .open=${this._sectionOpen(e,t,a)}
      @mc-toggle=${i=>this._setSection(e,t,i.detail.open)}
    >
      <div class="grp-body">${s}</div>
    </mc-ui-disclosure>`}_body(e,t,i,n){const a=t=>`flow-${e}-${t}`,s=t.label??X.Y1.label,r=t.entity||"",l=r&&this.hass?.states?.[r]?Object.keys(this.hass.states[r].attributes||{}):[],c=t.route??X.Y1.route,d=["attribute","min","max","reverse_negative","route","from_side","to_side","speed","min_speed"].some(e=>void 0!==t[e]&&""!==t[e]),u=(e,t)=>((0,h.tl)(e).find(e=>e.value===t)??(0,h.tl)(e)[0]).label;return o.qy`
      <div class="body">
        <section class="grp" aria-labelledby=${a("h-conn")}>
          <h4 class="grp-h" id=${a("h-conn")}>${(0,h.t)(229)}</h4>
          <div class="two">
            <div>${this._endpoint(e,t,"from",i)}</div>
            <div>${this._endpoint(e,t,"to",i)}</div>
          </div>
          ${this._anchorable(t,"from",i)||this._anchorable(t,"to",i)?o.qy`<p class="help" id=${a("anchor-help")}>${(0,h.t)(470)}${(0,cs.Rk)(t)?" "+(0,h.t)(1073):""}</p>`:o.s6}
          ${this._keyField(e,t,"entity",(0,h.t)(357),o.qy`<mc-entity-picker
              .hass=${this.hass}
              .value=${r}
              .label=${(0,h.t)(357)}
              @value-changed=${t=>this._patch(e,{entity:t.detail.value})}
            ></mc-entity-picker>`)}
          ${r?o.s6:o.qy`<p class="help">${(0,h.t)(633)}</p>`}
        </section>
        <section class="grp" aria-labelledby=${a("h-look")}>
          <h4 class="grp-h" id=${a("h-look")}>${(0,h.t)(548)}</h4>
          ${this._lookGroup(e,t,n)}
        </section>
        ${this._fold(n,"value-route",(0,h.t)(1152),`${u(us,c)} · ${(0,h.t)(1248,{min:String(t.min??X.Y1.min),max:String(t.max??X.Y1.max)})}`,d,o.qy`
            ${l.length?this._keyField(e,t,"attribute",(0,h.t)(105),o.qy`<mc-attribute-picker
                    .hass=${this.hass}
                    .entityId=${r}
                    .value=${t.attribute||""}
                    @value-changed=${t=>this._patch(e,{attribute:t.detail.value})}
                  ></mc-attribute-picker>`):o.s6}
            <div class="two">
              ${this._keyField(e,t,"min",(0,h.t)(580),this._number(e,t,"min",a("min"),X.Y1.min,0,void 0,"any"),a("min"))}
              ${this._keyField(e,t,"max",(0,h.t)(569),this._number(e,t,"max",a("max"),X.Y1.max,void 0,void 0,"any"),a("max"))}
            </div>
            ${this._switch(e,t,"reverse_negative",(0,h.t)(832),X.Y1.reverse_negative,(0,h.t)(15))}
            ${this._keyField(e,t,"route",(0,h.t)(841),this._seg((0,h.t)(841),c,(0,h.tl)(us),t=>this._patch(e,{route:t})))}
            <div class="two">
              ${this._keyField(e,t,"from_side",(0,h.t)(403),this._select(a("from-side"),t.from_side??"auto",(0,h.tl)(ps),t=>this._patch(e,{from_side:"auto"===t?void 0:t})),a("from-side"))}
              ${this._keyField(e,t,"to_side",(0,h.t)(1093),this._select(a("to-side"),t.to_side??"auto",(0,h.tl)(ps),t=>this._patch(e,{to_side:"auto"===t?void 0:t})),a("to-side"))}
            </div>
            <div class="two">
              ${this._keyField(e,t,"speed",(0,h.t)(982),this._number(e,t,"speed",a("speed"),X.Y1.speed,.2,void 0,.1,a("speed-help")),a("speed"))}
              ${this._keyField(e,t,"min_speed",(0,h.t)(581),this._number(e,t,"min_speed",a("min-speed"),X.Y1.min_speed,.2,void 0,.1,a("speed-help")),a("min-speed"))}
            </div>
            <p class="help" id=${a("speed-help")}>${(0,h.t)(883)}</p>
          `)}
        ${this._fold(n,"label",(0,h.t)(500),u(gs,s),void 0!==t.label,o.qy`
            ${this._keyField(e,t,"label",(0,h.t)(500),this._seg((0,h.t)(500),s,(0,h.tl)(gs),t=>this._patch(e,{label:"none"===t?void 0:t}),"value"!==s||r?void 0:a("label-help")))}
            ${"value"!==s||r?o.s6:o.qy`<p class="help" id=${a("label-help")}>${(0,h.t)(735)}</p>`}
            ${"template"===s?this._keyField(e,t,"label_template",(0,h.t)(502),o.qy`<textarea
                    class="input"
                    id=${a("tpl")}
                    rows="2"
                    placeholder="{{ states('sensor.solar_power') | int }} W"
                    .value=${t.label_template||""}
                    @input=${t=>this._patch(e,{label_template:t.target.value})}
                  ></textarea>`,a("tpl")):o.s6}
            ${"none"!==s?this._keyField(e,t,"label_position",(0,h.t)(501),this._select(a("label-pos"),t.label_position??X.Y1.label_position,(0,h.tl)(fs),t=>this._patch(e,{label_position:"auto"===t?void 0:t})),a("label-pos")):o.s6}
          `)}
        ${this._fold(n,"visibility",(0,h.t)(1163),`${u(vs,t.show_when??X.Y1.show_when)} · ${u(bs,t.layer??X.Y1.layer)}`,void 0!==t.show_when||void 0!==t.layer,o.qy`
            ${this._keyField(e,t,"show_when",(0,h.t)(916),this._seg((0,h.t)(916),t.show_when??X.Y1.show_when,(0,h.tl)(vs),t=>this._patch(e,{show_when:"always"===t?void 0:t})))}
            ${this._keyField(e,t,"layer",(0,h.t)(503),this._seg((0,h.t)(503),t.layer??X.Y1.layer,(0,h.tl)(bs),t=>this._patch(e,{layer:"back"===t?void 0:t})))}
          `)}
      </div>
    `}_block(e,t,i,n){const a=this.expanded.has(i),s=`flow-body-${t}`,r=e=>"string"==typeof e&&e?n.find(t=>t.id===e):void 0,l=!!r(e.from)&&r(e.from)?.name===r(e.to)?.name,c=e=>{const t=r(e);return t?l?t.label:t.name:"string"==typeof e&&e?(0,h.t)(590):"…"},d=[e.from,e.to].some(e=>"string"==typeof e&&e&&!n.some(t=>t.id===e));return o.qy`
      <div class="cond flow" data-flow=${i} data-selected=${this.selected===i?"":o.s6}>
        <div class="cond-head">
          <button
            type="button"
            class="icon-btn sm toggle"
            aria-expanded=${a?"true":"false"}
            aria-controls=${a?s:o.s6}
            aria-label=${a?(0,h.t)(202,{n:t+1}):(0,h.t)(374,{n:t+1})}
            @click=${()=>this.onToggle?.(i)}
          >
            <ha-icon icon=${a?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
          </button>
          <span class="n">${(0,h.t)(392,{n:t+1})}${e.from||e.to?o.qy` <span class="sub">· ${c(e.from)} → ${c(e.to)}</span>`:o.s6}</span>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${(0,h.t)(288,{n:t+1})}
            title=${(0,h.t)(287)}
            @click=${()=>this._remove(t)}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${a?o.qy`<div id=${s}>${this._body(t,e,n,i)}</div>`:e.from&&e.to&&!d?o.s6:o.qy`<div class="hints">
                ${e.from?o.s6:o.qy`<p class="help">${(0,h.t)(742)}</p>`}
                ${e.to?o.s6:o.qy`<p class="help">${(0,h.t)(741)}</p>`}
                ${d?o.qy`<p class="help error">${(0,h.t)(590)}</p>`:o.s6}
              </div>`}
      </div>
    `}render(){const e=this._flows,t=(0,X.rP)(e),i=this.config?B(this.config,this.hass):[];return o.qy`
      <div class="list">
        ${e.length?o.s6:o.qy`<p class="help">${(0,h.t)(82)}</p>`}
        ${e.map((e,n)=>e&&"object"==typeof e?this._block(e,n,t[n],i):o.s6)}
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(42)}
          </button>
        </div>
      </div>
    `}};ys.styles=[l.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .list {
        display: grid;
        gap: 12px;
      }
      .cond-head .n {
        overflow-wrap: anywhere;
      }
      .cond-head .icon-btn.toggle {
        margin: -4px 0 -4px -6px;
      }
      .cond[data-selected] {
        border-color: var(--mc-accent);
        box-shadow: 0 0 0 1px var(--mc-accent);
      }
      .body {
        display: grid;
        gap: 16px;
      }
      .hints {
        display: grid;
        gap: 4px;
      }
      .grp {
        display: grid;
        gap: 12px;
        min-width: 0;
      }
      .grp-h {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
      }
      .grp-body {
        display: grid;
        gap: 16px;
        min-width: 0;
      }
      .skeleton {
        display: grid;
        gap: 8px;
      }
      .skeleton .bar {
        height: 56px;
        border-radius: var(--mc-radius, 8px);
        background: var(--mc-surface-2);
      }
      .skeleton:focus {
        outline: none;
      }
    `],ds([(0,n.MZ)({attribute:!1})],ys.prototype,"config",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"hass",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"expanded",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"selected",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"onToggle",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"onRekey",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"sections",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"onSection",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"undoSnapshots",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"onUndoSnapshot",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"budget",void 0),ds([(0,n.MZ)({attribute:!1})],ys.prototype,"onChange",void 0),ds([(0,n.wk)()],ys.prototype,"_look",void 0),ys=ds([(0,n.EM)("mc-flows-editor")],ys);var _s=i(5816),ws=i(394),$s=i(2770),ks=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const xs=[{value:"auto",label:108,icon:"mdi:calendar-star"},{value:"winter",label:1180,icon:"mdi:snowflake"},{value:"spring",label:984,icon:"mdi:flower-tulip-outline"},{value:"summer",label:1010,icon:"mdi:white-balance-sunny"},{value:"autumn",label:119,icon:"mdi:leaf-maple"},{value:"christmas",label:186,icon:"mdi:pine-tree"},{value:"new_year",label:623,icon:"mdi:party-popper"},{value:"valentine",label:1150,icon:"mdi:heart-outline"},{value:"easter",label:328,icon:"mdi:egg-easter"},{value:"halloween",label:434,icon:"mdi:halloween"},{value:"weather",label:1168,icon:"mdi:weather-partly-rainy"},{value:"daynight",label:274,icon:"mdi:weather-night"},{value:"none",label:654,icon:"mdi:cancel"}],Cs=Object.fromEntries(xs.map(e=>[e.value,e.label])),Ss=[{key:"christmas",label:186},{key:"new_year",label:623},{key:"valentine",label:1150},{key:"easter",label:328},{key:"halloween",label:434}],Ms=[{value:"back",label:134},{value:"front",label:703}],As=[{value:"north",label:656},{value:"south",label:975}];function qs(e,t){const i=t.trim().toLowerCase();return"off"===i||"easter"===e&&"auto"===i||!!(0,_s.RC)(i)}let Es=class extends o.WF{constructor(){super(...arguments),this.explicitNone=!1,this._calendarOpen=!1,this._draft={},this._preview="",this._onPreviewEvent=()=>{const e=(0,$s.n)()?.seasonalPreviewDate();this._preview=e?(e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`)(e):""}}_setPreview(e){ns.tQ.seasonal.load().then(t=>t&&this.isConnected&&(0,$s.n)()?.setSeasonalPreviewDate(e))}connectedCallback(){super.connectedCallback(),window.addEventListener(pi.HT,this._onPreviewEvent),this._onPreviewEvent()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(pi.HT,this._onPreviewEvent),(0,$s.n)()?.setSeasonalPreviewDate(void 0)}get _cfg(){const e=(0,_s.Oo)(this.value)??{};return void 0===e.combine||Array.isArray(e.combine)?e:{...e,combine:(0,_s.ws)(e)}}get _scene(){if(void 0===this.value||null===this.value||!1===this.value)return"none";const e=this._cfg.scene??"auto";return xs.some(t=>t.value===e)?e:"none"}_write(e){const t={};for(const[i,o]of Object.entries(e))void 0===o||""===o||Array.isArray(o)&&!o.length||"calendar"===i&&o&&"object"==typeof o&&!Object.keys(o).length||(t[i]=o);this.onChange?.(t)}_set(e){this._write({...this._cfg,...e})}_pick(e){if("none"===e)return void this.onChange?.(this.explicitNone?"none":void 0);const t=(0,_s.ws)(this._cfg).filter(t=>t!==e);this._write({...this._cfg,scene:e,combine:t})}_today(){const e=(0,$s.n)()?.seasonalPreviewDate()??(0,_s.Z)(new Date,this.hass),t=(0,_s.GR)(e,this._cfg),i=ws.Z[t];return void 0===i?void 0===Cs[t]?t:(0,h.t)(Cs[t]):(0,Gt.t)(i)}_picker(e){const t=t=>o.qy`<option value=${t.value} ?selected=${t.value===e}>${"auto"===t.value?(0,h.t)(109,{when:this._preview?(0,h.t)(1227):(0,h.t)(1237),scene:this._today()}):(0,h.t)(t.label)}</option>`,i=e=>xs.find(t=>t.value===e),n=(e,n)=>o.qy`<optgroup label=${e}>${n.map(e=>t(i(e)))}</optgroup>`;return o.qy`<div class="pick">
      <span class="scene-ico" aria-hidden="true"><ha-icon icon=${i(e).icon}></ha-icon></span>
      <div class="select">
        <select class="input" id="seasonal-scene" aria-label=${(0,h.t)(879)} @change=${e=>this._pick(e.target.value)}>
          ${t(i("auto"))}
          ${n((0,h.t)(880),["winter","spring","summer","autumn"])}
          ${n((0,h.t)(451),["christmas","new_year","valentine","easter","halloween"])}
          ${n((0,h.t)(526),["weather","daynight"])}
          ${t(i("none"))}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`}_field(e,t,i,n,a){const s=t?this._cfg[t]:void 0,r=void 0!==s&&""!==s&&!(Array.isArray(s)&&!s.length);return o.qy`
      <div class="field">
        <div class="field-head">
          ${n?o.qy`<label for=${n}>${e}</label>`:o.qy`<span class="lbl">${e}</span>`}
          ${t?(0,Yt.i)(e,r,()=>this._set({[t]:void 0})):o.s6}
        </div>
        ${i} ${a?o.qy`<p class="help">${a}</p>`:o.s6}
      </div>
    `}_seg(e,t,i,n){return o.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const o=i.findIndex(e=>e.value===t),a={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const s=i[(o+a[e.key]+i.length)%i.length].value,r=e.currentTarget;n(s),requestAnimationFrame(()=>r.querySelector(`[data-val="${s}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return o.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>n(e.value)}
        >${(0,h.t)(e.label)}</button>`})}
    </div>`}_decorations(){const e=!1!==this._cfg.decorations;return o.qy`<div class="switch-row">
      <div class="txt">
        <div class="field-head">
          <span class="lbl">${(0,h.t)(140)}</span>
          ${(0,Yt.i)((0,h.t)(140),void 0!==this._cfg.decorations,()=>this._set({decorations:void 0}))}
        </div>
        <p class="help">${(0,h.t)(516)}</p>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${e?"true":"false"}
        aria-label=${(0,h.t)(140)}
        @click=${()=>this._set({decorations:!e&&void 0})}
      ></button>
    </div>`}_combine(e){const t=(0,_s.ws)(this._cfg),i=e=>this._set({combine:t.includes(e)?t.filter(t=>t!==e):[...t,e]});return this._field((0,h.t)(220),"combine",o.qy`<div class="chips" role="group" aria-label=${(0,h.t)(220)}>
        ${_s.MX.filter(t=>t!==e).map(e=>o.qy`<button type="button" class="chip" aria-pressed=${t.includes(e)?"true":"false"} @click=${()=>i(e)}>
            ${void 0===Cs[e]?e:(0,h.t)(Cs[e])}
          </button>`)}
      </div>`,void 0,(0,h.t)(377))}_writeCalendar(e,t){const i={...this._cfg.calendar??{}};void 0===t?delete i[e]:i[e]=t,this._set({calendar:Object.keys(i).length?i:void 0})}_calendarField(e){const t=`seasonal-cal-${e.key}`,i=this._cfg.calendar?.[e.key],n=!1===i?"off":"string"==typeof i?i:"",a=this._draft[e.key],s=a??n,r=void 0!==a&&""!==a.trim()&&!qs(e.key,a),l=void 0!==i,c=t=>{const i=t.target.value;""===i.trim()?(this._draft={...this._draft,[e.key]:void 0},this._writeCalendar(e.key,void 0)):qs(e.key,i)?(this._draft={...this._draft,[e.key]:void 0},this._writeCalendar(e.key,"off"===i.trim().toLowerCase()?"off":i.trim())):this._draft={...this._draft,[e.key]:i}},d=()=>{this._draft={...this._draft,[e.key]:void 0},this._writeCalendar(e.key,void 0)},u=`${t}-err`,p=e=>o.qy`<input
      class="input mono"
      id=${t}
      type="text"
      spellcheck="false"
      autocomplete="off"
      placeholder=${e}
      aria-invalid=${r?"true":"false"}
      aria-describedby=${r?u:o.s6}
      .value=${s}
      @input=${c}
    />`,m=r?o.qy`<p class="help error" id=${u} role="alert">${(0,h.t)(1126)}</p>`:o.s6;if("easter"===e.key){const e=!l||"auto"===n.trim().toLowerCase();return o.qy`<div class="field">
        <div class="switch-row">
          <div class="txt">
            <div class="field-head">
              <span class="lbl">${(0,h.t)(328)}</span>
              ${(0,Yt.i)((0,h.t)(328),l,d)}
            </div>
            <p class="help">${(0,h.t)(116)}</p>
          </div>
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${e?"true":"false"}
            aria-label=${(0,h.t)(329)}
            @click=${()=>e?this._writeCalendar("easter","04-01..04-07"):d()}
          ></button>
        </div>
        ${e?o.s6:o.qy`${p("04-01..04-07")}${m}`}
      </div>`}return o.qy`<div class="field">
      <div class="field-head">
        <label for=${t}>${(0,h.t)(e.label)}</label>
        ${(0,Yt.i)((0,h.t)(e.label),l||void 0!==a,d)}
      </div>
      ${p(_s.jF[e.key])}${m}
    </div>`}_calendar(){const e=this._calendarOpen,t=Object.keys(this._cfg.calendar??{}).length;return o.qy`<div class="cal">
      <button
        type="button"
        class="sector-btn"
        aria-expanded=${e?"true":"false"}
        aria-controls="seasonal-cal-body"
        @click=${()=>this._calendarOpen=!e}
      >
        <ha-icon icon="mdi:calendar-range"></ha-icon>
        <span class="nm">${(0,h.t)(450)}</span>
        ${t?o.qy`<span class="chip is-count">${(0,h.t)(1285,{n:t})}</span>`:o.s6}
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${e?o.qy`<div class="cal-body" id="seasonal-cal-body">
            <p class="help">${(0,h.t)(113)}</p>
            ${Ss.map(e=>this._calendarField(e))}
          </div>`:o.s6}
    </div>`}_previewDate(){const e="seasonal-preview-date";return o.qy`<div class="field">
      <div class="field-head">
        <label for=${e}>${(0,h.t)(770)}</label>
        ${(0,Yt.i)((0,h.t)(770),!!this._preview,()=>this._setPreview(void 0))}
      </div>
      <input
        class="input"
        id=${e}
        type="date"
        .value=${this._preview}
        @change=${e=>{const t=e.target.value,i=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t);this._setPreview(i?new Date(Number(i[1]),Number(i[2])-1,Number(i[3]),12):void 0)}}
      />
      <p class="help">${(0,h.t)(957)}</p>
    </div>`}updated(){const e=this.renderRoot.querySelector("select#seasonal-scene");e&&e.value!==this._scene&&(e.value=this._scene)}render(){const e=this._scene,t=this._cfg,i=(0,_s.ws)(t),n="none"!==e||!!i.length,a=[e,...i],s=a.includes("auto"),r=a.includes("weather");return o.qy`
      <div class="seasonal-ed">
        ${this._picker(e)}
        ${n?o.qy`
              ${this._field((0,h.t)(503),"layer",this._seg((0,h.t)(503),"front"===t.layer?"front":"back",Ms,e=>this._set({layer:"front"===e?"front":void 0})),void 0,"front"===t.layer?(0,h.t)(704):void 0)}
              ${this._field((0,h.t)(492),"intensity",o.qy`<mc-unit-field
                  .value=${function(e){if(null==e||""===e)return"";if("number"==typeof e)return`${e>0&&e<=1?Math.round(100*e):e}%`;const t=String(e).trim();if(/^\d*\.?\d+$/.test(t)){const e=parseFloat(t);return`${e>0&&e<=1?Math.round(100*e):e}%`}return t}(t.intensity)}
                  .label=${(0,h.t)(492)}
                  .units=${["%"]}
                  .noCustom=${!0}
                  .placeholder=${"50"}
                  .inputId=${"seasonal-intensity"}
                  @value-changed=${e=>this._set({intensity:e.detail.value||void 0})}
                ></mc-unit-field>`,void 0,(0,h.t)(459))}
              ${this._decorations()}
              ${r?this._field((0,h.t)(1169),"weather_entity",o.qy`<mc-entity-picker
                      .hass=${this.hass}
                      .value=${t.weather_entity||""}
                      .label=${(0,h.t)(1169)}
                      .domain=${"weather"}
                      @value-changed=${e=>this._set({weather_entity:e.detail.value||void 0})}
                    ></mc-entity-picker>`,void 0,(0,h.t)(973)):o.s6}
              ${this._field((0,h.t)(675),"entity",o.qy`<mc-entity-picker
                  .hass=${this.hass}
                  .value=${t.entity||""}
                  .label=${(0,h.t)(675)}
                  @value-changed=${e=>this._set({entity:e.detail.value||void 0})}
                ></mc-entity-picker>`,void 0,(0,h.t)(73))}
              ${s?this._field((0,h.t)(438),"hemisphere",this._seg((0,h.t)(438),(0,_s.ot)(t.hemisphere),As,e=>this._set({hemisphere:"south"===e?"south":void 0})),void 0,(0,h.t)(976)):o.s6}
              ${this._combine(e)} ${s?this._calendar():o.s6} ${s?this._previewDate():o.s6}
            `:o.s6}
      </div>
    `}};Es.styles=[l.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .seasonal-ed {
        display: grid;
        gap: 16px;
      }
      .pick {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 8px;
        align-items: center;
        container-type: inline-size;
      }
      .pick .select {
        min-width: 0;
      }
      .scene-ico {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
        --mdc-icon-size: 20px;
      }
      @container (max-width: 259px) {
        .pick {
          grid-template-columns: 1fr;
        }
        .scene-ico {
          display: none;
        }
      }
      .chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      button.chip[aria-pressed='true'] {
        color: var(--mc-accent-ink);
        border-color: color-mix(in srgb, var(--mc-accent) 45%, transparent);
        background: var(--mc-accent-tint);
      }
      .cal {
        display: grid;
        gap: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .cal > .sector-btn {
        border-radius: var(--mc-radius-lg);
      }
      .cal-body {
        display: grid;
        gap: 16px;
        padding: 0 12px 16px;
      }
      .input[aria-invalid='true'] {
        border-color: var(--mc-error-ink);
      }
      .date-row {
        display: flex;
        gap: 8px;
      }
      .date-row .input {
        flex: 1;
        min-width: 0;
      }
    `],ks([(0,n.MZ)({attribute:!1})],Es.prototype,"value",void 0),ks([(0,n.MZ)({attribute:!1})],Es.prototype,"hass",void 0),ks([(0,n.MZ)({type:Boolean})],Es.prototype,"explicitNone",void 0),ks([(0,n.MZ)({attribute:!1})],Es.prototype,"onChange",void 0),ks([(0,n.wk)()],Es.prototype,"_calendarOpen",void 0),ks([(0,n.wk)()],Es.prototype,"_draft",void 0),ks([(0,n.wk)()],Es.prototype,"_preview",void 0),Es=ks([(0,n.EM)("mc-seasonal-editor")],Es);var Ts=i(3795);const Ls=["px","em","rem","vw","vh"];function zs(e){const t=Object.keys(e?.themes?.themes||{}).sort((e,t)=>e.localeCompare(t,void 0,{sensitivity:"base"}));return[{label:(0,h.t)(270),value:"__default__"},...t.map(e=>({label:e,value:e}))]}const js=()=>({id:(0,v.$)("cond"),type:"state",entity:"",state:""});const Rs="__hover__",Os={view:"default",set:()=>{},open:new Map,toggle:()=>{}},Ps=["ring","shape","value_background","seasonal","background_layers"],Hs=e=>null!=e&&""!==e&&!(Array.isArray(e)&&!e.length);var Ds=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let Is=class extends o.WF{constructor(){super(...arguments),this.value="",this.label="",this._windowCtrl=new Ue.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery=""}_openModal(){this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_selectService(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getServices(){if(!this.hass?.services)return[];const e=[];for(const[t,i]of Object.entries(this.hass.services))for(const[o,n]of Object.entries(i))e.push({domain:t,service:o,name:n.name||o,description:n.description||""});return e}_getFilteredServices(){const e=this._getServices(),t=this._searchQuery.toLowerCase(),i=t?e.filter(e=>e.domain.includes(t)||e.service.includes(t)||e.name.toLowerCase().includes(t)):e,o=new Map;for(const e of i)o.has(e.domain)||o.set(e.domain,[]),o.get(e.domain).push(e);return Array.from(o.entries()).sort(([e],[t])=>e.localeCompare(t)).slice(0,20).map(([e,t])=>({domain:e,services:t.sort((e,t)=>e.service.localeCompare(t.service))}))}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",notify:"mdi:bell",tts:"mdi:speaker-message",homeassistant:"mdi:home-assistant",persistent_notification:"mdi:bell-ring",logbook:"mdi:book-open",recorder:"mdi:database",system_log:"mdi:file-document",frontend:"mdi:view-dashboard",group:"mdi:group",vacuum:"mdi:robot-vacuum",counter:"mdi:counter",timer:"mdi:timer"}[e]||"mdi:cog"}render(){return o.qy`
      <div class="with-icon with-action">
        <ha-icon icon="mdi:cog-outline"></ha-icon>
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder="domain.service"
          aria-label=${this.label||(0,h.t)(901)}
          spellcheck="false"
          @input=${this._onInputChange}
        />
        <button
          type="button"
          class="icon-btn sm field-action browse"
          aria-label=${(0,h.t)(151)}
          title=${(0,h.t)(151)}
          @click=${this._openModal}
        >
          <ha-icon icon="mdi:magnify"></ha-icon>
        </button>
      </div>

      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getFilteredServices();return o.qy`
      ${(0,Ue.bU)((0,h.t)(896),()=>this._closeModal(),"m",o.qy`
          <div class="mc-picker-search">
            ${(0,Ue.LW)((0,h.t)(876),this._searchQuery,e=>{this._searchQuery=e})}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${(0,h.t)(903)}>
            ${e.length>0?e.map(e=>o.qy`
                  <div class="mc-picker-domain">${e.domain}</div>
                  ${e.services.map(e=>o.qy`
                    <button
                      type="button"
                      role="option"
                      class="mc-picker-item"
                      aria-selected=${this.value===`${e.domain}.${e.service}`?"true":"false"}
                      @click=${()=>this._selectService(`${e.domain}.${e.service}`)}
                    >
                      <span class="mc-picker-item-icon"><ha-icon icon=${this._domainIcon(e.domain)}></ha-icon></span>
                      <span class="mc-picker-item-content">
                        <span class="mc-picker-item-name">${e.name}</span>
                        <span class="mc-picker-item-id" title="${e.domain}.${e.service}">${e.domain}.${e.service}</span>
                        ${e.description?o.qy`<span class="mc-picker-item-desc">${e.description}</span>`:""}
                      </span>
                    </button>
                  `)}
                `):o.qy`<div class="mc-picker-empty">${(0,h.t)(648)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,h.t)(162)}</button>
          </div>
      `)}
    `}};Is.styles=[l.x,Xe.fz],Ds([(0,n.MZ)({attribute:!1})],Is.prototype,"hass",void 0),Ds([(0,n.MZ)({type:String})],Is.prototype,"value",void 0),Ds([(0,n.MZ)({type:String})],Is.prototype,"label",void 0),Ds([(0,n.wk)()],Is.prototype,"_showModal",void 0),Ds([(0,n.wk)()],Is.prototype,"_searchQuery",void 0),Is=Ds([(0,n.EM)("mc-service-picker")],Is);var Fs=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const Vs=[{type:"alarm-panel",name:60,description:59,icon:"mdi:shield-home",category:"built-in"},{type:"area",name:99,description:918,icon:"mdi:texture-box",category:"built-in"},{type:"button",name:156,description:24,icon:"mdi:gesture-tap-button",category:"built-in"},{type:"calendar",name:158,description:159,icon:"mdi:calendar",category:"built-in"},{type:"conditional",name:226,description:921,icon:"mdi:eye-check",category:"built-in"},{type:"entities",name:356,description:525,icon:"mdi:format-list-bulleted",category:"built-in"},{type:"entity",name:357,description:963,icon:"mdi:card-text",category:"built-in"},{type:"entity-filter",name:362,description:388,icon:"mdi:filter",category:"built-in"},{type:"gauge",name:412,description:414,icon:"mdi:gauge",category:"built-in"},{type:"glance",name:418,description:781,icon:"mdi:eye",category:"built-in"},{type:"grid",name:431,description:432,icon:"mdi:view-grid",category:"built-in"},{type:"heading",name:436,description:885,icon:"mdi:format-header-1",category:"built-in"},{type:"history-graph",name:447,description:366,icon:"mdi:chart-line",category:"built-in"},{type:"horizontal-stack",name:454,description:986,icon:"mdi:arrow-split-vertical",category:"built-in"},{type:"humidifier",name:461,description:462,icon:"mdi:air-humidifier",category:"built-in"},{type:"iframe",name:"iFrame",description:344,icon:"mdi:web",category:"built-in"},{type:"light",name:514,description:515,icon:"mdi:lightbulb",category:"built-in"},{type:"logbook",name:545,description:367,icon:"mdi:book-open-variant",category:"built-in"},{type:"map",name:555,description:556,icon:"mdi:map",category:"built-in"},{type:"markdown",name:558,description:799,icon:"mdi:language-markdown",category:"built-in"},{type:"media-control",name:574,description:576,icon:"mdi:cast",category:"built-in"},{type:"picture",name:746,description:308,icon:"mdi:image",category:"built-in"},{type:"picture-elements",name:747,description:483,icon:"mdi:image-edit",category:"built-in"},{type:"picture-entity",name:748,description:369,icon:"mdi:image-area",category:"built-in"},{type:"picture-glance",name:749,description:482,icon:"mdi:image-multiple",category:"built-in"},{type:"plant-status",name:755,description:754,icon:"mdi:flower",category:"built-in"},{type:"sensor",name:899,description:900,icon:"mdi:eye",category:"built-in"},{type:"shopping-list",name:913,description:914,icon:"mdi:cart",category:"built-in"},{type:"statistic",name:998,description:547,icon:"mdi:chart-box",category:"built-in"},{type:"statistics-graph",name:999,description:999,icon:"mdi:chart-bell-curve",category:"built-in"},{type:"thermostat",name:1061,description:195,icon:"mdi:thermostat",category:"built-in"},{type:"tile",name:1084,description:222,icon:"mdi:square-rounded",category:"built-in"},{type:"todo-list",name:1094,description:1095,icon:"mdi:checkbox-marked-outline",category:"built-in"},{type:"vertical-stack",name:1158,description:987,icon:"mdi:arrow-split-horizontal",category:"built-in"},{type:"weather-forecast",name:1170,description:1171,icon:"mdi:weather-partly-cloudy",category:"built-in"}];let Ns=class extends o.WF{constructor(){super(...arguments),this.value="",this._windowCtrl=new Ue.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery="",this._selectedCardType=""}_openModal(){this._selectedCardType=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_handleSave(){this.value=this._selectedCardType,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedCardType},bubbles:!0,composed:!0})),this._closeModal()}_selectCard(e){this._selectedCardType=e,this._searchQuery=e}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getCustomCards(){const e=window.customCards;return Array.isArray(e)?e.map(e=>({type:`custom:${e.type}`,name:e.name||e.type,description:e.description||(0,h.t)(258),icon:"mdi:puzzle",category:"custom"})):[]}_getFilteredCards(){const e=(0,h.A)(this._searchQuery),t=t=>!e||t.type.toLowerCase().includes(e)||(0,h.A)(t.name).includes(e)||(0,h.A)(t.description).includes(e),i=Vs.map(e=>({...e,name:(0,h.t)(e.name),description:(0,h.t)(e.description)})).filter(t);return{builtIn:i,custom:this._getCustomCards().filter(t)}}render(){return o.qy`
      <div class="mc-picker-row">
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder="button, custom:mushroom-light-card"
          aria-label=${(0,h.t)(180)}
          spellcheck="false"
          @input=${this._onInputChange}
        />
        <button type="button" class="btn btn-secondary" @click=${this._openModal}>${(0,h.t)(887)}</button>
      </div>

      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const{builtIn:e,custom:t}=this._getFilteredCards(),i=e.length>0||t.length>0;return o.qy`
      ${(0,Ue.bU)((0,h.t)(889),()=>this._closeModal(),"s",o.qy`
          <div class="mc-picker-search">
            ${(0,Ue.LW)((0,h.t)(871),this._searchQuery,e=>{this._searchQuery=e})}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${(0,h.t)(181)}>
            ${i?o.qy`
                  ${e.length>0?o.qy`
                    <div class="mc-picker-category">${(0,h.t)(154)}</div>
                    ${e.map(e=>this._renderCardItem(e))}
                  `:""}
                  ${t.length>0?o.qy`
                    <div class="mc-picker-category">${(0,h.t)(259)}</div>
                    ${t.map(e=>this._renderCardItem(e))}
                  `:""}
                `:o.qy`<div class="mc-picker-empty">${(0,h.t)(627)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,h.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${(0,h.t)(860)}</button>
          </div>
      `)}
    `}_renderCardItem(e){return o.qy`
      <button
        type="button"
        role="option"
        class="mc-picker-item"
        aria-selected=${this._selectedCardType===e.type?"true":"false"}
        @click=${()=>this._selectCard(e.type)}
      >
        <span class="mc-picker-item-icon"><ha-icon icon=${e.icon}></ha-icon></span>
        <span class="mc-picker-item-content">
          <span class="mc-picker-item-name">${e.name}</span>
          <span class="mc-picker-item-id" title=${e.type}>${e.type}</span>
        </span>
        <span class="chip">${"custom"===e.category?(0,h.t)(255):(0,h.t)(153)}</span>
      </button>
    `}};Ns.styles=[l.x,Xe.fz],Fs([(0,n.MZ)({type:String})],Ns.prototype,"value",void 0),Fs([(0,n.wk)()],Ns.prototype,"_showModal",void 0),Fs([(0,n.wk)()],Ns.prototype,"_searchQuery",void 0),Fs([(0,n.wk)()],Ns.prototype,"_selectedCardType",void 0),Ns=Fs([(0,n.EM)("mc-card-picker")],Ns);var Zs=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const Bs={general:{label:415},actions:{label:25},conditions:{label:228},design:{label:299},flows:{label:393}},Ws=["general","actions","conditions","design"],Ks={card:["general","design","conditions","flows"],row:["general","actions","conditions","design"],column:["general","conditions","design"],slot:["general","conditions","design"]};let Us=class extends o.WF{constructor(){super(...arguments),this.variant="pane",this._tabs={card:"general",row:"general",column:"general",module:"general",slot:"general"},this._expandedRules=new Set,this._expandedFlows=new Set,this._flowSections=new Map,this._flowUndo=new Map,this._designView="default",this._designOpen=new Map,this._focusTab=!1,this._seenFlow=null,this._scrollKey="",this._seenSeq=0,this._focusCardEntity=!1,this._openCardEntity=()=>{this._tabs={...this._tabs,card:"general"},this._focusCardEntity=!0,this._goTo({kind:"card"}),this.requestUpdate()},this._showFirstTab=()=>{const e=this._selection();"module"===e.kind&&this._goTo((0,w.r$)(e.row,e.col,e.module,e.child,0))},this._onSyncToggle=e=>{const t=this.stateManager,i=t?.getConfig();if(!t||!i?.template)return;const{propertyPath:o,synced:n}=e.detail,a=this._selection();switch(a.kind){case"card":t.updateConfig({...i,not_synced:ge(i.not_synced,o,n)});break;case"row":t.updateRow(a.row,{not_synced:ge(i.rows[a.row]?.not_synced,o,n)});break;case"column":t.updateColumn(a.row,a.col,{not_synced:ge(i.rows[a.row]?.columns[a.col]?.not_synced,o,n)});break;case"module":{const e=this._module(a);if(!e)return;t.updateModule(a.row,a.col,a.module,{not_synced:ge(e.not_synced,o,n)},a.child);break}}}}connectedCallback(){super.connectedCallback(),this.stateManager&&!this._unsubscribe&&this._subscribe(),this._stopStatus=(0,os.Wb)(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._stopStatus?.(),this._unsubscribe?.(),this._unsubscribe=void 0,this._subscribedTo=void 0}willUpdate(e){e.has("stateManager")&&this.stateManager!==this._subscribedTo&&this._subscribe()}updated(){if(this._syncScroller(),this._focusCardEntity){const e=this.shadowRoot?.querySelector("mc-entity-picker[data-card-entity]");if(e){this._focusCardEntity=!1,e.scrollIntoView?.({block:"nearest"});const t=()=>e.focusInput?.();e.updateComplete.then(t),setTimeout(t,80)}}const e=this.shadowRoot?.querySelector("select#design-view");e&&e.value!==this._designView&&[...e.options].some(e=>e.value===this._designView)&&(e.value=this._designView);const t=this.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]');if(!t)return;const i=t.parentElement;t.offsetLeft<i.scrollLeft?i.scrollLeft=t.offsetLeft-4:t.offsetLeft+t.offsetWidth>i.scrollLeft+i.clientWidth&&(i.scrollLeft=t.offsetLeft+t.offsetWidth-i.clientWidth+4),this._focusTab&&(this._focusTab=!1,t.focus())}_syncScroller(){const e=this.shadowRoot?.querySelector(".insp-body");if(!e)return;const t=this._selection(),i=`${this._state?.selectedPath??""}|${this._activeTab(t,this._tabsFor(t))}`,o=this.stateManager?.selectionSeq??0,n=o!==this._seenSeq;this._seenSeq=o;const a=n&&!1===this.stateManager?.selectionReveal;if(i!==this._scrollKey){const t=""!==this._scrollKey;this._scrollKey=i,e.scrollTop=0,t&&!a&&"visible"===getComputedStyle(e).overflowY&&this.shadowRoot?.querySelector(".insp-head")?.scrollIntoView?.({block:"nearest"})}}_subscribe(){this._unsubscribe?.(),this._subscribedTo=this.stateManager,this._unsubscribe=this.stateManager?.subscribe(e=>{if(this._state=e,this._expandedFlows.size){const t=new Set((0,X.rP)(Array.isArray(e.config.flows)?e.config.flows:[]));[...this._expandedFlows].some(e=>!t.has(e))&&(this._expandedFlows=new Set([...this._expandedFlows].filter(e=>t.has(e))))}const t=e.selectedFlow??null;t&&t!==this._seenFlow&&(this._tabs={...this._tabs,card:"flows"},this._expandedFlows.has(t)||(this._expandedFlows=new Set(this._expandedFlows).add(t))),this._seenFlow=t})}setTab(e){const t=this._selection();this._tabsFor(t).includes(e)&&(this._tabs={...this._tabs,[t.kind]:e})}focusInspector(){this._focusTab=!0,this.requestUpdate()}_selection(){return(0,w.c4)(this._state?.selectedPath??null)}_module(e){const t=this._state?.config;return t?(0,w.cv)(t,e):void 0}_tabsFor(e){if("slot"===e.kind&&this._state&&"tabs"===(0,w.kW)(this._state.config,e)?.type)return["general"];if("module"!==e.kind)return Ks[e.kind];const t=this._module(e);if(!t)return["general"];const i=nn.tabs(t.type);return Ws.filter(e=>i.includes(e))}_activeTab(e,t){const i=this._tabs[e.kind];return t.includes(i)?i:t[0]}_goTo(e){this.stateManager?.setSelectedPath((0,w.bm)(e))}_onTabKeydown(e,t,i,o){const n=i.indexOf(o),a={ArrowRight:(n+1)%i.length,ArrowLeft:(n-1+i.length)%i.length,Home:0,End:i.length-1}[e.key];void 0!==a&&(e.preventDefault(),this._focusTab=!0,this._tabs={...this._tabs,[t.kind]:i[a]})}get _rulesState(){const e=e=>{this._expandedRules=e};return{expanded:this._expandedRules,toggle:t=>{const i=new Set(this._expandedRules);i.has(t)?i.delete(t):i.add(t),e(i)},expand:t=>e(new Set(this._expandedRules).add(t)),collapse:t=>{const i=new Set(this._expandedRules);i.delete(t),e(i)}}}get _designState(){return{view:this._designView,set:e=>{this._designView=e},open:this._designOpen,toggle:(e,t)=>{this._designOpen=new Map(this._designOpen).set(e,t)}}}get _flowsState(){const e=this.stateManager,t=this._state?.selectedFlow??null;return{expanded:this._expandedFlows,selected:t,toggle:i=>{const o=new Set(this._expandedFlows),n=!o.has(i);n?o.add(i):o.delete(i),this._expandedFlows=o,n?e?.selectFlow(i):t===i&&e?.selectFlow(null)},sections:this._flowSections,setSection:(e,t)=>{this._flowSections=new Map(this._flowSections).set(e,t)},undoSnapshots:this._flowUndo,setUndoSnapshot:(e,t)=>{const i=new Map(this._flowUndo);t?i.set(e,t):i.delete(e),this._flowUndo=i},rekey:(i,o)=>{const n=new Map;for(const[e,t]of this._flowSections)n.set(e.startsWith(`${i}|`)?`${o}|${e.slice(i.length+1)}`:e,t);if(this._flowSections=n,this._flowUndo.has(i)){const e=new Map(this._flowUndo);e.delete(i),this._flowUndo=e}if(t===i&&e?.selectFlow(o),!this._expandedFlows.has(i))return;const a=new Set(this._expandedFlows);a.delete(i),a.add(o),this._expandedFlows=a}}}render(){const e=this._state?.config;if(!e||!this.stateManager)return o.qy``;const t=this._selection(),i=this._tabsFor(t),n=this._activeTab(t,i);return o.qy`
      <div class="insp" @field-sync-toggle=${this._onSyncToggle} @mc-open-card-entity=${this._openCardEntity} @mc-select-first-tab=${this._showFirstTab}>
        <div class="insp-head">
          ${this._renderIdentity(e,t)}
          <div class="seg full tabs" role="tablist" aria-label=${(0,h.t)(905)}>
            ${i.map(e=>{const a=e===n;return o.qy`
                <button
                  type="button"
                  role="tab"
                  id="tab-${e}"
                  aria-controls="panel-${e}"
                  aria-selected=${a?"true":"false"}
                  tabindex=${a?"0":"-1"}
                  @click=${()=>this.setTab(e)}
                  @keydown=${e=>this._onTabKeydown(e,t,i,n)}
                >
                  ${(0,h.t)(Bs[e].label)}
                </button>
              `})}
          </div>
        </div>
        <div class="insp-body" role="tabpanel" tabindex="0" id="panel-${n}" aria-labelledby="tab-${n}">
          ${this._renderBody(e,t,n)}
        </div>
      </div>
    `}_renderIdentity(e,t){const i=(0,w.e9)(e,t),n=(0,w.Sh)(e,t),a=(e,t)=>o.qy`<button type="button" class="crumb" title=${(0,h.t)(897,{label:e})} @click=${()=>this._goTo(t)}>${e}</button>`,s=o.qy`<span aria-hidden="true"> · </span>`,r=e=>(0,h.t)(843,{n:e+1}),l=e=>(0,h.t)(218,{n:e+1}),c=e=>(0,h.t)(1258,{n:e});let d,u=i.title,p=i.icon;switch(n.kind){case"card":u=e.name?.trim()?`${(0,h.t)(167)} · ${i.title}`:(0,h.t)(167),d=o.qy`${(e=>(0,h.t)(1260,{n:e}))((e.rows||[]).length)} · ${c((0,w.TV)(e))}`;break;case"row":{const t=e.rows[n.row];p="mdi:table-row",d=o.qy`${(e=>(0,h.t)(1251,{n:e}))(t.columns.length)} · ${(0,f.SU)(t)?(0,h.t)(1213):(0,h.t)(1222,{layout:t.layout||"1"})}`;break}case"column":{const t=e.rows[n.row].columns[n.col].modules?.length??0;d=o.qy`${a(r(n.row),{kind:"row",row:n.row})}${s}${c(t)}`;break}case"slot":{const t=(0,w.tw)(n);d=o.qy`${a(r(n.row),{kind:"row",row:n.row})}${s}${a(l(n.col),{kind:"column",row:n.row,col:n.col})}${(0,w.fN)(e,t).map(e=>o.qy`${s}${a(e.label,e.target)}`)}`;break}case"module":{const t=(0,w.cv)(e,n);if(!t||"object"!=typeof t){d=o.qy`${a(r(n.row),{kind:"row",row:n.row})}`;break}const c=(0,w.$N)(t);c&&!(0,w.Hn)(t)&&(u=`${i.title} · ${c}`);const h="string"==typeof t.entity&&w.Y.test(t.entity)?t.entity:"",p=(0,w.fN)(e,n).slice(0,-1),m=(0,w.tw)(n,e),g="slot"===m.kind?a((0,w.e9)(e,m).title,m):void 0;d=o.qy`${a(r(n.row),{kind:"row",row:n.row})}${s}${a(l(n.col),{kind:"column",row:n.row,col:n.col})}${p.map(e=>o.qy`${s}${a(e.label,e.target)}`)}${g?o.qy`${s}${g}`:o.s6}${h?o.qy`${s}<span class="mono">${(0,w.rb)(h)}</span>`:o.s6}`;break}}return o.qy`
      <div class="insp-id">
        <span class="ico k-${"slot"===n.kind?"column":n.kind}"><ha-icon icon=${p}></ha-icon></span>
        <div class="txt">
          <h2>${u}</h2>
          <p class="path">${d}${(0,w.Ak)((0,w.R9)(e,n))?o.qy`${s}<span class="hidden-note"><ha-icon icon="mdi:eye-off-outline"></ha-icon>${(0,h.t)(441)}</span>`:o.s6}</p>
        </div>
      </div>
    `}_renderBody(e,t,i){const n=this.stateManager;switch(t.kind){case"card":return this._renderCard(e,i);case"row":{const a=e.rows[t.row];return a?"design"===i?function(e,t,i,o){return Ra("row",t.design||{},o,o=>i.updateRow(e,Oa(t,o,i)))}(t.row,a,n,this.hass):"conditions"===i?function(e,t,i,o){return Pa("row",t.display||{},t=>i.updateRow(e,{display:t}),o)}(t.row,a,n,this.hass):"actions"===i?function(e,t,i,n){return o.qy`
    ${Ft(t.actions,(o,n)=>{const a=i.getConfig().rows[e]??t,s={...a.actions};n&&"none"!==n.action?s[o]=n:delete s[o];const r={actions:Object.keys(s).length?s:void 0};i.getConfig().template&&!a.not_synced?.includes("actions")&&(r.not_synced=[...a.not_synced||[],"actions"]),i.updateRow(e,r)},n)}
    <p class="help">${(0,h.t)(854)}</p>
    <p class="help">${(0,h.t)(1181)}</p>
  `}(t.row,a,n,this.hass):function(e,t,i,n){const a=t.columns.map(e=>e.vertical_align||"start"),s=Sa(e,t,i);return o.qy`
    ${za(t,{row:e},i,n,t=>i.updateRow(e,t))}
    <div class="group">
      ${Ma(s)}
      ${t.columns.length>1?Ta(s):o.s6}
      ${(0,$t.lm)((0,h.t)(411),t.gap,t=>i.updateRow(e,{gap:t}),void 0,void 0,"12")}
      ${(0,$t.De)((0,h.t)(1157),a[0]||"start",(0,h.tl)(La),t=>{const o=i.getConfig().rows[e].columns.map(e=>({...e,vertical_align:t}));i.updateRow(e,{columns:o})})}
      ${(0,$t.Mg)((0,h.t)(713),t.padding,t=>i.updateRow(e,{padding:t}),"padding")}
    </div>
  `}(t.row,a,n,this.hass):o.qy``}case"column":{const a=e.rows[t.row]?.columns[t.col];return a?"design"===i?function(e,t,i,o,n){return Ra("column",i.design||{},n,n=>o.updateColumn(e,t,Oa(i,n,o)))}(t.row,t.col,a,n,this.hass):"conditions"===i?function(e,t,i,o,n){return Pa("column",i.display||{},i=>o.updateColumn(e,t,{display:i}),n)}(t.row,t.col,a,n,this.hass):function(e,t,i,o,n){const a=o.getConfig().rows[e],s=za(i,{row:e,col:t},o,n,i=>o.updateColumn(e,t,i));return ja(i,t,i=>o.updateColumn(e,t,i),a?Sa(e,a,o):void 0,s)}(t.row,t.col,a,n,this.hass):o.qy``}case"module":return this._renderModule(e,t,i);case"slot":return this._renderSlot(e,t,i)}}_renderCard(e,t){const i=this.stateManager,n=e.template?{templateName:e.template,notSynced:e.not_synced||[],basePath:""}:void 0,a=(e,t)=>{const o=i.getConfig(),n={...o,[e]:t};o.template&&(n.not_synced=ge(o.not_synced,e,!0)),i.updateConfig(n)};if("design"===t)return function(e,t,i,n,a,r,l,c=Os,d){const u=e.conditional_appearance||[],p=c.view===Rs,m=u.find(e=>e.id===c.view),g=e=>t("conditional_appearance",e),f=e=>g(u.map(t=>t===m?{...t,...e}:t)),b=m?.overrides||{},y=e=>{const t={...b};for(const[i,o]of Object.entries(e))Hs(o)?t[i]=o:delete t[i];f({overrides:t})},_=m?{rule:!0,get:e=>b[e],set:(e,t)=>y({[e]:t}),many:y}:{rule:!1,get:t=>e[t],set:(e,i)=>t(e,i),many:e=>{if(a)a(e,"shape");else for(const[i,o]of Object.entries(e))t(i,o)},sync:i},w=_.sync,$=(e,t,i)=>(0,$t.XT)(e,t,w,{forId:i,reset:_.rule?(0,Yt.i)(e,t in b,()=>_.set(t,void 0)):void 0}),k=e=>_.rule&&!(e in b)?o.qy`<p class="help">${(0,h.t)(662)}</p>`:o.s6,x=e=>_.get(e),C={card_height:()=>o.qy`${(0,$t.lm)((0,h.t)(173),x("card_height"),e=>_.set("card_height",e),"card_height",w,"auto")}${k("card_height")}`,padding:()=>o.qy`${(0,$t.Mg)((0,h.t)(713),x("padding"),e=>_.set("padding",e),"padding","padding",w)}${k("padding")}`,margin:()=>o.qy`${(0,$t.Mg)((0,Gt.t)(300),x("margin"),e=>_.set("margin",e),"margin","margin",w)}${k("margin")}`,border_width:()=>o.qy`${(0,$t.lm)((0,Gt.t)(82),x("border_width"),e=>_.set("border_width",e),"border_width",w,(0,h.t)(1060),Ls)}${k("border_width")}`,border_style:()=>o.qy`${(0,$t.De)((0,Gt.t)(80),x("border_style")??"",[{label:(0,h.t)(1060),value:""},...we.map(e=>({label:(0,Gt.t)(e.label),value:e.value}))],e=>_.set("border_style",e||void 0),"border_style",w)}${k("border_style")}`,border_color:()=>o.qy`${(0,$t.Yd)((0,Gt.t)(73),x("border_color"),e=>_.set("border_color",e),"border_color",w)}${k("border_color")}`,opacity:()=>o.qy`${(0,$t.aA)((0,h.t)(685),_.get("opacity"),e=>_.set("opacity",Number.isFinite(e)?Math.min(1,Math.max(0,e)):void 0),{min:0,max:1,step:.05,placeholder:"1",optional:!0},"opacity",w)}
        <p class="help">${(0,h.t)(136)}</p>${k("opacity")}`,backdrop_filter:()=>o.qy`${(0,$t.Gz)((0,Gt.t)(41),x("backdrop_filter"),e=>_.set("backdrop_filter",e),"backdrop_filter",w,{placeholder:"blur(8px)",mono:!0})}
        <p class="help">${(0,h.t)(139)}</p>${k("backdrop_filter")}`,background:()=>o.qy`${(0,$t.Yd)((0,h.t)(125),x("background"),e=>_.set("background",e),"background",w,"css")}${k("background")}`,background_image:()=>o.qy`${(0,$t.nZ)((0,h.t)(126),x("background_image"),e=>_.set("background_image",e),n,"image","background_image",w)}${k("background_image")}`,border_radius:()=>o.qy`${(0,$t.lm)((0,h.t)(141),x("border_radius"),e=>_.set("border_radius",e),"border_radius",w)}${k("border_radius")}`,box_shadow:()=>o.qy`${(0,$t.Gz)((0,h.t)(145),x("box_shadow"),e=>_.set("box_shadow",e),"box_shadow",w,{placeholder:(0,h.t)(1060),mono:!0})}${k("box_shadow")}`,shape:()=>o.qy`<div class="field">
      ${$((0,h.t)(907),"shape")}
      <mc-shape-editor
        .shape=${_.get("shape")}
        .options=${_.get("shape_options")}
        .explicitNone=${_.rule?!!e.shape:!!e.template}
        .target=${"card"}
        .hasRadius=${!!(_.get("border_radius")||_.rule&&e.border_radius)}
        .hasShadow=${!!(_.get("box_shadow")||_.rule&&e.box_shadow)}
        .popup=${!0===e.popup?.enabled}
        .hass=${n}
        .onChange=${e=>_.many({shape:e.shape,shape_options:e.shape_options})}
      ></mc-shape-editor>
      ${k("shape")}
    </div>`,value_background:()=>o.qy`<div class="field">
      ${$((0,h.t)(1153),"value_background")}
      <mc-value-bg-editor
        .value=${_.get("value_background")}
        .hass=${n}
        .explicitNone=${_.rule?!!e.value_background:!!e.template}
        .onChange=${e=>_.set("value_background",e)}
      ></mc-value-bg-editor>
      ${k("value_background")}
    </div>`,style_hint:()=>!_.rule&&(e.background_layers?.length??0)>0?o.qy`<p class="help" data-hint="backdrop">${(0,h.t)(169)}</p>`:o.s6,backdrop:()=>{const i=!_.rule||"background_layers"in b,a=_.rule?b.background_layers:e.background_layers,s=e=>{_.rule?f({overrides:{...b,background_layers:e}}):t("background_layers",e.length?e:void 0)};return o.qy`<div class="field">
        ${$((0,h.t)(505),"background_layers")}
        ${on()}
        <mc-bg-layers
          .layers=${a}
          .hass=${n}
          .rule=${_.rule?{own:i}:void 0}
          .lowPower=${!0===e.layers_low_power}
          .cardEntity=${e.entity}
          .onWrite=${s}
          .onRule=${t=>{if("start"===t)s((0,Ts.hN)(e.background_layers));else{const e={...b};delete e.background_layers,f({overrides:e})}}}
          .onLowPower=${()=>t("layers_low_power",!e.layers_low_power||void 0)}
        ></mc-bg-layers>
      </div>`},ring:()=>o.qy`<div class="field">
      ${$((0,h.t)(834),"ring")}
      <mc-ring-editor
        .ring=${_.get("ring")}
        .hass=${n}
        .requireEntity=${!0}
        .clipped=${!0}
        .onChange=${t=>_.set("ring",void 0===t&&_.rule&&e.ring?{}:t)}
      ></mc-ring-editor>
      ${k("ring")}
    </div>`,seasonal:()=>o.qy`<div class="field">
      ${$((0,h.t)(878),"seasonal")}
      <mc-seasonal-editor
        .value=${_.get("seasonal")}
        .hass=${n}
        .explicitNone=${_.rule?!!e.seasonal:!!e.template}
        .onChange=${e=>_.set("seasonal",e)}
      ></mc-seasonal-editor>
      ${k("seasonal")}
    </div>`,animations:()=>_.rule?o.s6:o.qy`<div class="field">
            ${(0,$t.XT)((0,h.t)(90),"animations",i)}
            <mc-animation-list
              .animations=${(0,O.Sd)({animations:e.animations})}
              .hass=${n}
              .requireTriggerEntity=${!0}
              .onChange=${e=>t("animations",e.length?e:void 0)}
            ></mc-animation-list>
          </div>`,template_animations:()=>_.rule||!l?o.s6:function(e,t,i,n){if(!e.template||!t?.length)return o.s6;const a=new Set((0,s.B)(e.custom_animations).map(e=>String(e.id))),r=new Set(e.hidden_animations??[]),l=(e,t)=>o.qy`<button type="button" class="btn btn-text btn-sm" @click=${t}>${e}</button>`;return o.qy`<section class="group tpl-anims"><div class="field">
${(0,$t.XT)((0,h.t)(1026),"custom_animations",n)}
${e.not_synced?.includes("custom_animations")?o.qy`<p class="help">${(0,h.t)(1067)}</p>`:t.map(t=>{const n=String(t.id),c=a.has(n),d=!c&&r.has(n);return o.qy`<div class="cond-head" data-id=${n}><span class="n">${t.name??n}
<span class="chip">${c?(0,h.t)(184):d?(0,h.t)(440):(0,h.t)(404)}</span></span>
${c?l((0,h.t)(1142),()=>i(function(e,t){const i=(0,s.B)(e.custom_animations).filter(e=>e.id!==t),o={...e,custom_animations:i};return i.length||delete o.custom_animations,o}(e,n))):l(d?(0,h.t)(916):(0,h.t)(443),()=>i(function(e,t,i){const o=(e.hidden_animations??[]).filter(e=>e!==t);i&&o.push(t);const n={...e,hidden_animations:o};return o.length||delete n.hidden_animations,n}(e,n,!d)))}</div>`})}</div></section>`}(e,r,l,i),pause_button:()=>{if(_.rule)return o.s6;const n="always"===e.pause_button||"auto"===e.pause_button?e.pause_button:"hidden",a=[["auto",(0,h.t)(114)],["always",(0,h.t)(66)],["hidden",(0,h.t)(440)]],s=e=>t("pause_button","hidden"===e?void 0:e);return o.qy`<div class="field" data-field="pause_button">
        ${(0,$t.XT)((0,h.t)(724),"pause_button",i)}
        <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(724)} aria-describedby="pause-button-help" @keydown=${e=>{const t=e.currentTarget,i="rtl"===getComputedStyle(t).direction?-1:1,o={ArrowRight:i,ArrowDown:1,ArrowLeft:-i,ArrowUp:-1},r=a.findIndex(([e])=>e===n);let l;if("Home"===e.key)l=0;else if("End"===e.key)l=a.length-1;else{if(!Object.prototype.hasOwnProperty.call(o,e.key))return;l=(r+o[e.key]+a.length)%a.length}e.preventDefault();const c=a[l][0];s(c),requestAnimationFrame(()=>t.querySelector(`[data-val="${c}"]`)?.focus())}}>
          ${a.map(([e,t])=>o.qy`<button type="button" role="radio" data-val=${e} tabindex=${n===e?"0":"-1"} aria-checked=${n===e?"true":"false"} @click=${()=>s(e)}>${t}</button>`)}
        </div>
        <p class="help" id="pause-button-help">${"always"===n?(0,h.t)(67):"hidden"===n?(0,h.t)(1162):(0,h.t)(956)}</p>
      </div>`},pause_button_corner:()=>{if(_.rule||"auto"!==e.pause_button&&"always"!==e.pause_button)return o.s6;const i=e.pause_button_corner??"bottom-left",n=[["bottom-left",(0,h.t)(143)],["bottom-right",(0,h.t)(144)],["top-left",(0,h.t)(1099)],["top-right",(0,h.t)(1100)]];return o.qy`<div class="field" data-field="pause_button_corner">
        <div class="field-head"><label for="pause-corner">${(0,h.t)(243)}</label></div>
        <div class="select">
          <select class="input" id="pause-corner" @change=${e=>t("pause_button_corner","bottom-left"===e.target.value?void 0:e.target.value)}>
            ${n.map(([e,t])=>o.qy`<option value=${e} ?selected=${i===e}>${t}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>`},css:()=>_.rule?o.s6:o.qy`<div class="field">
            ${(0,$t.XT)((0,h.t)(256),"css",i,{forId:"card-css",reset:(0,Yt.i)((0,h.t)(256),!!e.css,()=>t("css",void 0))})}
            <textarea
              class="input mono"
              id="card-css"
              rows="4"
              spellcheck="false"
              placeholder=${(0,h.t)(94)}
              .value=${e.css||""}
              @input=${e=>t("css",e.target.value||void 0)}
            ></textarea>
          </div>`},S=[["layout",(0,h.t)(507),!0,[["card_height","card_height"],["padding","padding"],["margin","margin"]]],["motion",(0,h.t)(598),!0,[["pause_button","pause_button"],["pause_button_corner"]]],["style",(0,h.t)(1007),!0,[["background","background"],["background_image","background_image"],["style_hint"],["border_radius","border_radius"],["border_width","border_width"],["border_style","border_style"],["border_color","border_color"],["box_shadow","box_shadow"],["opacity","opacity"],["backdrop_filter","backdrop_filter"],["shape","shape"],["value_background","value_background"]]],["backdrop",(0,h.t)(168),!1,[["backdrop","background_layers"]]],["effects",(0,h.t)(340),!1,[["ring","ring"],["seasonal","seasonal"],["animations","animations"],["template_animations"]]],["advanced",(0,h.t)(56),!1,[["css","css"]]]],M=u.length,A=p?(0,h.t)(97):M?(0,h.t)(1254,{n:M}):(0,h.t)(33),q="any"===m?.mode?"any":"every",E=m?.conditions||[],T=o.qy`<div class="rule-pick">
    <div class="field">
      <div class="field-head"><label for="design-view">${(0,h.t)(338)}</label></div>
      <div class="select">
        <select class="input" id="design-view" aria-describedby="design-view-help" @change=${e=>c.set(e.target.value)}>
          <option value="default" ?selected=${!p&&!m}>${(0,h.t)(276)}</option>
          <option value=${Rs} ?selected=${p}>${(0,h.t)(458)}</option>
          ${u.map((e,t)=>o.qy`<option value=${e.id} ?selected=${e===m}>${(0,h.t)(851,{name:e.name||(0,h.t)(850,{n:t+1})})}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
      <p class="help" id="design-view-help">${A}</p>
    </div>
    <div class="rule-actions">
      <button type="button" class="btn btn-text btn-sm" @click=${()=>{const e=(0,v.$)("appr");g([...u,{id:e,name:(0,h.t)(850,{n:u.length+1}),conditions:[],mode:"every",overrides:{}}]),c.set(e)}}><ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(41)}</button>
      ${M&&d?o.qy`<button type="button" class="btn btn-text btn-sm" data-open-tab="conditions" @click=${()=>d("conditions")}>${(0,h.t)(687)}</button>`:o.s6}
    </div>
  </div>`,L=m?o.qy`<div class="rule">
        <div class="rule-head">
          <h3>${(0,h.t)(848)}</h3>
          <button
            type="button"
            class="btn btn-text btn-sm danger-text"
            @click=${()=>{g(u.filter(e=>e!==m)),c.set("default")}}
          ><ha-icon icon="mdi:delete-outline"></ha-icon>${(0,h.t)(292)}</button>
        </div>
        <div class="field">
          <div class="field-head"><label for="rule-name">${(0,h.t)(849)}</label></div>
          <input class="input" id="rule-name" type="text" placeholder=${(0,h.t)(849)} .value=${m.name||""} @input=${e=>f({name:e.target.value})} />
        </div>
        <div class="field">
          <div class="field-head"><span class="lbl">${(0,h.t)(560)}</span></div>
          <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(223)}>
            ${["every","any"].map(e=>o.qy`<button type="button" role="radio" aria-checked=${q===e?"true":"false"} @click=${()=>f({mode:e})}>${"every"===e?(0,h.t)(63):(0,h.t)(91)}</button>`)}
          </div>
        </div>
        <div class="rule-conds">
          ${E.length?E.map((e,t)=>o.qy`<mc-condition-row
                  .condition=${e}
                  .hass=${n}
                  .onChange=${e=>f({conditions:E.map((i,o)=>o===t?{...i,...e}:i)})}
                  .onRemove=${()=>f({conditions:E.filter((e,i)=>i!==t)})}
                ></mc-condition-row>`):o.qy`<p class="help">${(0,h.t)(628)}</p>`}
          <div>
            <button type="button" class="btn btn-secondary btn-sm" @click=${()=>f({conditions:[...E,js()]})}>
              <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(40)}
            </button>
          </div>
        </div>
      </div>`:o.s6;return o.qy`
    <div class="design-tab">
      ${T} ${L}
      ${p?o.qy`<section class="group">
            <div class="field">
              ${(0,$t.XT)((0,h.t)(458),"hover",i,{reset:(0,Yt.i)((0,h.t)(458),!!e.hover,()=>t("hover",void 0))})}
            </div>
            <div class="field" data-hover-backdrop>
              <span class="lbl">${(0,h.t)(168)}</span>
              <p class="help">${(0,h.t)(127)}</p>
            </div>
            <mc-design-panel
              class="card-hover"
              .design=${{hover:e.hover}}
              .hass=${n}
              .target=${"card"}
              .hoverOnly=${!0}
              .onChange=${e=>t("hover",e.hover)}
            ></mc-design-panel>
          </section>`:o.qy`<div class="dgroups">${S.map(([t,i,n,a])=>{const s=a.map(([e])=>C[e]()).filter(e=>e!==o.s6);if(!s.length)return o.s6;const r=a.filter(([,e])=>e&&Hs(_.get(e))).length,l=c.open.get(t)??(n||r>0||"backdrop"===t&&_.rule);return o.qy`<section class="dgroup" data-group=${t}>
      <button type="button" class="dgroup-btn" aria-expanded=${l?"true":"false"} aria-controls=${`dg-${t}`} @click=${()=>c.toggle(t,!l)}>
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        <span class="nm">${i}</span>
        ${r>0?o.qy`<span class="chip is-count">${(0,h.t)(1288,{n:r})}</span>`:o.s6}
        ${"backdrop"===t&&!_.rule&&(0,Ts.q2)(e.background_layers)?o.qy`<span class="chip is-warn" data-warn="backdrop">⚠ ${(0,h.t)(776)}</span>`:o.s6}
      </button>
      <div class="dgroup-body" id=${`dg-${t}`} ?hidden=${!l}>${s}</div>
    </section>`})}</div>`}
    </div>
  `}(e,a,n,this.hass,(e,t)=>{const o=i.getConfig(),n={...o};for(const[t,i]of Object.entries(e))void 0===i?delete n[t]:n[t]=i;o.template&&(n.not_synced=ge(o.not_synced,t,!0)),i.updateConfig(n)},i.getState().templateAnimations,e=>i.updateConfig(e),this._designState,e=>this.setTab(e));if("conditions"===t)return function(e,t,i,n,a,s,r,l){const c=e.display||{},d=c.conditions||[],u=e=>t({...c,...e});return o.qy`
    ${function(e,t,i,n,a,s){const r=e.conditional_appearance||[],l=e=>t("conditional_appearance",e),c=()=>{const e=(0,v.$)("appr");a.expand(e),l([...r,{id:e,name:(0,h.t)(850,{n:r.length+1}),conditions:[],mode:"every",overrides:{}}])},d=e=>{a.collapse(e),l(r.filter(t=>t.id!==e))},u=(e,t)=>l(r.map(i=>i.id===e?{...i,...t}:i)),p=s?o.qy`<div><button type="button" class="btn btn-text btn-sm" data-open-tab="design" @click=${()=>s("design")}>${(0,h.t)(688)}</button></div>`:o.s6;return o.qy`
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:palette-swatch-outline"></ha-icon>
        <h3>${(0,h.t)(227)}</h3>
      </div>
      ${r.length?o.qy`
            <p class="help">${(0,h.t)(707)}</p>
            ${p}
            ${r.map(e=>function(e,t,i,n,a,s){const r=n.expanded.has(e.id),l=e.conditions||[],c=e.overrides||{},d=`rule-body-${e.id}`,u=(t,i)=>{const o={...c};void 0===i||""===i||null===i?delete o[t]:o[t]=i,a(e.id,{overrides:o})},p=c.use_page_theme,m=Ps.filter(e=>e in c).length;return o.qy`
    <div class="cond rule">
      <div class="cond-head">
        <button
          type="button"
          class="icon-btn sm"
          aria-expanded=${r?"true":"false"}
          aria-controls=${d}
          aria-label=${r?(0,h.t)(204):(0,h.t)(376)}
          @click=${()=>n.toggle(e.id)}
        >
          <ha-icon icon=${r?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
        </button>
        <input
          class="input rule-name"
          type="text"
          aria-label=${(0,h.t)(849)}
          placeholder=${(0,h.t)(849)}
          .value=${e.name||""}
          @input=${t=>a(e.id,{name:t.target.value})}
        />
        <span class="chip is-count">${(0,h.t)(1287,{n:l.length})}</span>
        ${m?o.qy`<span class="chip">${(0,h.t)(2,{n:m})}</span>`:o.s6}
        <button
          type="button"
          class="icon-btn sm danger"
          aria-label=${(0,h.t)(794)}
          title=${(0,h.t)(794)}
          @click=${()=>s(e.id)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${r?o.qy`
            <div class="rule-body" id=${d}>
              <div class="sub-head">${(0,h.t)(228)}</div>
              ${Wt(l,e.mode||"every",{onAdd:()=>a(e.id,{conditions:[...l,js()]}),onUpdate:(t,i)=>a(e.id,{conditions:l.map((e,o)=>o===t?{...e,...i}:e)}),onRemove:t=>a(e.id,{conditions:l.filter((e,i)=>i!==t)}),onMode:t=>a(e.id,{mode:t})},t,void 0,"rule")}
              <div class="sub-head">${(0,h.t)(92)}</div>
              <p class="help">${(0,h.t)(683)}</p>
              ${(0,$t.Yd)((0,h.t)(125),c.background,e=>u("background",e),void 0,void 0,"css")}
              ${(0,$t.nZ)((0,h.t)(126),c.background_image,e=>u("background_image",e),t,"image")}
              ${(0,$t.vm)((0,h.t)(708),!1===p,e=>u("use_page_theme",!e&&void 0))}
              ${!1===p?(0,$t.De)((0,h.t)(179),c.theme||"__default__",i,e=>u("theme","__default__"===e?void 0:e)):o.s6}
              ${(0,$t.lm)((0,h.t)(141),c.border_radius,e=>u("border_radius",e))}
              ${(0,$t.Mg)((0,h.t)(713),c.padding,e=>u("padding",e),"padding")}
              ${(0,$t.Mg)((0,Gt.t)(300),c.margin,e=>u("margin",e),"margin")}
              ${(0,$t.lm)((0,Gt.t)(82),c.border_width,e=>u("border_width",e),void 0,void 0,void 0,Ls)}
              ${(0,$t.De)((0,Gt.t)(80),c.border_style??"",[{label:(0,h.t)(1060),value:""},...we.map(e=>({label:(0,Gt.t)(e.label),value:e.value}))],e=>u("border_style",e||void 0))}
              ${(0,$t.Yd)((0,Gt.t)(73),c.border_color,e=>u("border_color",e))}
              ${(0,$t.Gz)((0,h.t)(145),c.box_shadow,e=>u("box_shadow",e))}
              ${(0,$t.aA)((0,h.t)(685),c.opacity,e=>u("opacity",Number.isFinite(e)?Math.min(1,Math.max(0,e)):void 0),{min:0,max:1,step:.05,placeholder:"1",optional:!0})}
              ${(0,$t.Gz)((0,Gt.t)(41),c.backdrop_filter,e=>u("backdrop_filter",e),void 0,void 0,{placeholder:"blur(8px)",mono:!0})}
              ${(0,$t.lm)((0,h.t)(173),c.card_height,e=>u("card_height",e))}
            </div>
          `:o.s6}
    </div>
  `}(e,i,n,a,u,d))}
            <div>
              <button type="button" class="btn btn-secondary btn-sm" @click=${c}>
                <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(35)}
              </button>
            </div>
          `:o.qy`
            <div class="empty">
              <ha-icon icon="mdi:palette-swatch-outline"></ha-icon>
              <strong>${(0,h.t)(625)}</strong>
              <p>${(0,h.t)(183)}</p>
              ${p}
              <button type="button" class="btn btn-secondary btn-sm" @click=${c}>
                <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(35)}
              </button>
            </div>
          `}
    </section>
  `}(e,a,n,s,r,l)}
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:eye-outline"></ha-icon>
        <h3>${(0,h.t)(309)}</h3>
      </div>
      ${Wt(d,c.mode||"every",{onAdd:()=>u({conditions:[...d,js()]}),onUpdate:(e,t)=>u({conditions:d.map((i,o)=>o===e?{...i,...t}:i)}),onRemove:e=>u({conditions:d.filter((t,i)=>i!==e)}),onMode:e=>u({mode:e})},n,i?{...i,basePath:"display"}:void 0,"card")}
    </section>
  `}(e,e=>a("display",e),n,this.hass,a,zs(this.hass),this._rulesState,e=>this.setTab(e));if("flows"===t)return function(e,t,n,a,s){return o.qy`
    <section class="group">
      <div class="field">
        ${(0,$t.XT)((0,h.t)(393),"flows",n)}
        <mc-flows-editor
          .config=${e}
          .hass=${a}
          .expanded=${s.expanded}
          .selected=${s.selected}
          .onToggle=${s.toggle}
          .onRekey=${s.rekey}
          .sections=${s.sections}
          .onSection=${s.setSection}
          .undoSnapshots=${s.undoSnapshots}
          .onUndoSnapshot=${s.setUndoSnapshot}
          .budget=${s.budget}
          .onChange=${e=>{const t={...e};Q(t),i.updateConfig(t)}}
        ></mc-flows-editor>
      </div>
    </section>
  `}(e,0,n,this.hass,this._flowsState);const r={...mn(e),onChange:e=>{const t={...i.getConfig()};void 0===e?delete t.entity:t.entity=e,i.updateConfig(t)}};return function(e,t,i,n,a=!1,s){const r=!1!==e.use_page_theme,l=e.popup&&"object"==typeof e.popup?e.popup:void 0,c=!0===l?.enabled;return o.qy`
    <div class="group">
      ${(0,$t.Gz)((0,h.t)(612),e.name,e=>t("name",e),"name",i)}
      ${s?function(e,t,i){return o.qy`
    <div class="mc-field">
      <div class="field-head"><label>${(0,h.t)(172)}</label><span class="help">${(0,h.t)(698)}</span></div>
      <mc-entity-picker
        data-card-entity
        .hass=${t}
        .value=${"string"==typeof e.entity?e.entity:""}
        .label=${(0,h.t)(172)}
        .placeholder=${(0,h.t)(730)}
        .strict=${!0}
        .preferred=${i.preferred}
        .help=${`${(0,h.t)(1041)} ${(0,h.t)(550)}`}
        @value-changed=${e=>i.onChange(""===e.detail.value?void 0:e.detail.value)}
      ></mc-entity-picker>
      ${i.following>0?o.qy`<p class="help follow">${(0,h.t)(1262,{n:i.following})}</p>`:o.s6}
      ${i.needing>0?o.qy`<p class="help follow needs">${(0,h.t)(1263,{n:i.needing})}</p>`:o.s6}
    </div>
  `}(e,n,s):o.s6}
      ${(0,$t.vm)((0,h.t)(1133),r,e=>t("use_page_theme",e),"use_page_theme",i,(0,h.t)(1104))}
      ${(0,$t.De)((0,h.t)(179),r?"__default__":e.theme||"__default__",zs(n),e=>t("theme","__default__"===e?void 0:e),"theme",i,{disabled:r})}
    </div>
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:dock-window"></ha-icon>
        <h3>${(0,h.t)(761)}</h3>
      </div>
      ${(0,$t.vm)((0,h.t)(919),c,e=>t("popup",e?{...l,enabled:!0}:l&&Object.keys(l).length>1?{...l,enabled:!1}:void 0),"popup",i,(0,h.t)(442))}
      ${c?o.qy`<mc-popup-settings
            .popup=${l}
            .hass=${n}
            .canvas=${a}
            .onChange=${e=>t("popup",{...e,enabled:!0})}
          ></mc-popup-settings>`:o.s6}
    </section>
  `}(e,a,n,this.hass,"studio"===this.variant,r)}_renderSlot(e,t,i){const n=this.stateManager,a=(0,w.kW)(e,t);if(!a)return o.qy``;if("tabs"===a.type)return function(e,t,i,n,a){const s=i.tabs?.[t],r=i=>n.updateTab(e.row,e.col,e.module,e.child,t,i);return o.qy`
    <div class="group">
      <div style="display: contents" @change=${e=>{const t=e.target;t instanceof HTMLInputElement&&!t.value.trim()&&(t.value=s?.label??"")}}>
        ${(0,$t.Gz)((0,h.t)(500),s?.label,e=>{e.trim()&&r({label:e})})}
      </div>
      ${(0,$t.AJ)((0,h.t)(464),s?.icon,e=>r({icon:e||void 0}),a)}
      ${(0,$t.AJ)((0,h.t)(472),s?.active_icon,e=>r({active_icon:e||void 0}),a)}
      <p class="help">${(0,h.t)(509)}</p>
    </div>
  `}(t,t.slot,a,n,this.hass);const s=a;return"design"===i?function(e,t,i,o,n){const a=i.columns?.[t]??{modules:[]};return Ra("column",a.design||{},n,i=>{const{design:n}=Oa({...a,not_synced:["design"]},i,o);o.updateNestedColumn(e.row,e.col,e.module,e.child,t,{design:n})})}(t,t.slot,s,n,this.hass):"conditions"===i?function(e,t,i,o,n){const a=i.columns?.[t];return Pa("column",a?.display||{},i=>o.updateNestedColumn(e.row,e.col,e.module,e.child,t,{display:i.conditions?.length||i.mode?i:void 0}),n)}(t,t.slot,s,n,this.hass):function(e,t,i,n,a){const s=i.columns?.[t]??{modules:[]},r=za(s,{row:e.row,col:e.col,module:e.module,child:e.child,slot:t},n,a,i=>n.updateNestedColumn(e.row,e.col,e.module,e.child,t,i),!1);return ja(s,t,i=>n.updateNestedColumn(e.row,e.col,e.module,e.child,t,i),function(e,t,i){const n=!t.not_synced?.includes("column_widths");return{sync:i.getConfig().template&&!e.child?.length?o.qy`<mc-sync-indicator
        .synced=${n}
        .hasTemplate=${!0}
        .hideIfNoTemplate=${!0}
        .propertyPath=${"column_widths"}
        @sync-toggle=${o=>{o.stopPropagation(),i.updateModule(e.row,e.col,e.module,{not_synced:ge(t.not_synced,"column_widths",n)})}}
      ></mc-sync-indicator>`:o.s6,row:{...t,columns:t.columns||[]},setLayout:t=>i.setNestedRowLayout(e.row,e.col,e.module,e.child,t),setWidths:(t,o)=>i.setNestedColumnWidths(e.row,e.col,e.module,e.child,t,o)}}(e,i,n),r)}(t,t.slot,s,n,this.hass)}_renderModule(e,t,i){const n=this._module(t);if(!n)return o.qy``;if(!_.s.get(n.type))return o.qy`
        <div class="empty">
          <ha-icon icon="mdi:puzzle-remove-outline"></ha-icon>
          <strong>${(0,h.t)(1112)}</strong>
          <p class="mono">${n.type}</p>
        </div>
      `;const a=e.template,s=this.stateManager;let r,l=a;if(t.child?.length)if(a){l=void 0;const i=e.rows[t.row].columns[t.col].modules[t.module],o=fe(i,e=>s.replaceModule(t.row,t.col,t.module,e));r=e=>o((0,$.O6)(i,t.child,e))}else r=e=>s.replaceModule(t.row,t.col,t.module,e,t.child);else{const e=e=>s.replaceModule(t.row,t.col,t.module,e);r=a?fe(n,e):e}const c=function(e,t){const i=wt;wt=e;try{return t()}finally{wt=i}}((0,w.iA)(t),()=>nn.render(i,n,this.hass,r,l,dn(e,t),(0,at.Bm)(e,t)));return o.qy`<div class="mod-body" @mc-layer-move=${e=>{s&&function(e,t,i){const o=e.getConfig(),n=(0,at.t8)(o,t);if(!n)return!1;const a=(0,at.HR)(n.list,n.index,i);if(void 0===a)return!1;if(!t.child?.length)return e.setSelectedPath({rowIndex:t.row,columnIndex:t.col,moduleIndex:a}),e.moveModule(t.row,t.col,n.index,t.row,t.col,a),!0;const s=a>n.index?1:-1;let r=t;for(let t=n.index;t!==a;t+=s){const t=r.child[r.child.length-1];if(!e.moveModuleBy(r.row,r.col,r.module,s,r.child))return!1;r={...r,child:[...r.child.slice(0,-1),{slot:t.slot,index:t.index+s}]}}}(s,t,e.detail.to)}} @mc-layers-low-power=${()=>{s&&function(e){e.updateConfig({...e.getConfig(),layers_low_power:!0})}(s)}}>${this._renderChildListSync(e,t)}${c}</div>`}_renderChildListSync(e,t){if(!e.template)return o.s6;const i=e.rows[t.row]?.columns[t.col]?.modules[t.module],n=(0,$.us)(i);if(!i||!n)return o.s6;const a=(i.not_synced||[]).includes(n),s=!!t.child?.length;return o.qy`
      <div class="child-list-sync" data-overridden=${a?"":o.s6}>
        <p class="help">${a?s?(0,h.t)(1074):(0,h.t)(1049):s?(0,h.t)(1075):(0,h.t)(1050)}</p>
        ${a?o.qy`<button type="button" class="btn btn-text btn-sm child-list-reset" @click=${()=>this._resetChildList(t.row,t.col,t.module,n)}>
              <ha-icon icon="mdi:backup-restore"></ha-icon>${(0,h.t)(819)}
            </button>`:o.s6}
      </div>
    `}_resetChildList(e,t,i,o){const n=this.stateManager,a=n?.getConfig().rows[e]?.columns[t]?.modules[i];n&&a&&(n.updateModule(e,t,i,{not_synced:ge(a.not_synced,o,!1)}),this.dispatchEvent(new CustomEvent("mc-template-reapply",{bubbles:!0,composed:!0})))}};Us.styles=[...Xe.yj,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .insp-head {
        padding: 16px 16px 12px;
        display: grid;
        gap: 12px;
        border-bottom: 1px solid var(--mc-divider);
      }
      .mod-body {
        display: contents;
      }
      .insp-body {
        padding: 16px;
        display: grid;
        gap: 20px;
        align-content: start;
        min-width: 0;
      }
      /* studio: head and tabs stay put, only the body scrolls; sticky when stacked */
      :host([variant='studio']),
      :host([variant='studio']) .insp {
        height: 100%;
      }
      :host([variant='studio']) .insp {
        display: flex;
        flex-direction: column;
      }
      :host([variant='studio']) .insp-head {
        flex: none;
        background: var(--mc-surface);
      }
      :host([variant='studio']) .insp-body {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        overscroll-behavior: contain;
      }
      @media (max-width: 640px), (max-height: 480px) {
        :host([variant='studio']),
        :host([variant='studio']) .insp {
          height: auto;
        }
        :host([variant='studio']) .insp-body {
          overflow: visible;
        }
      }
      @media (max-width: 640px) and (min-height: 481px) {
        :host([variant='studio']) .insp-head {
          position: sticky;
          top: 0;
          z-index: 2;
        }
      }
      :host([variant='pane']) .insp-head {
        padding: 0 0 12px;
      }
      /* row: Column widths (one number + unit per column) */
      .col-width-list {
        display: grid;
        gap: 8px;
      }
      .col-width {
        display: grid;
        grid-template-columns: 72px minmax(0, 1fr);
        align-items: center;
        gap: 8px;
      }
      .col-width-lbl {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .col-widths-foot {
        display: flex;
        justify-content: flex-start;
        margin-left: -8px;
      }
      :host([variant='pane']) .insp-body {
        padding: 16px 0 0;
      }
      .insp-id {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }
      .insp-id .ico {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: grid;
        place-items: center;
        /* level colour (.k-card / .k-row / .k-column / .k-module), matching the canvas frame */
        background: var(--k-tint);
        flex: none;
        color: var(--k-ink);
        --mdc-icon-size: 22px;
      }
      .insp-id .txt {
        flex: 1;
        min-width: 0;
      }
      .insp-id h2 {
        margin: 0;
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.3;
        overflow-wrap: anywhere;
      }
      .path {
        margin: 0;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        overflow-wrap: anywhere;
      }
      .path .mono {
        font-size: 0.75rem;
      }
      .path .hidden-note {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        --mdc-icon-size: 14px;
      }
      /* path segments navigate up, but read as plain path text */
      .crumb {
        border: 0;
        background: transparent;
        padding: 0;
        border-radius: 2px;
        font-size: inherit;
        color: inherit;
      }
      .crumb:hover {
        color: var(--mc-accent-ink);
        text-decoration: underline;
      }
      .tabs {
        position: relative;
      }
      /* studio: fixed 340px panel, tighter padding so all four tabs fit */
      :host([variant='studio']) .tabs > button {
        padding: 0 8px;
      }
      .cond-list {
        display: grid;
        gap: 12px;
      }
      .design-tab {
        display: grid;
        gap: 20px;
      }
      .rule-pick {
        display: grid;
        gap: 8px;
      }
      .rule-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 8px;
      }
      @media (min-height: 520px) {
        .rule-pick {
          position: sticky;
          top: 0;
          z-index: 1;
          padding-bottom: 12px;
          background: var(--mc-surface);
          border-bottom: 1px solid var(--mc-divider);
        }
      }
      .rule-head {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .rule-head h3 {
        margin: 0;
        flex: 1;
        font-size: 0.875rem;
        font-weight: 500;
      }
      .danger-text {
        color: var(--mc-error-ink);
      }
      .rule-conds {
        display: grid;
        gap: 12px;
      }
      .design-tab > .rule {
        display: grid;
        gap: 16px;
        padding: 12px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .dgroups {
        display: grid;
        gap: 12px;
      }
      .dgroup {
        display: grid;
        gap: 8px;
      }
      .dgroup-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        min-height: 40px;
        padding: 0 8px 0 4px;
        border: 0;
        border-radius: var(--mc-radius);
        background: color-mix(in srgb, var(--mc-surface-2) 55%, transparent);
        text-align: left;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--mc-text);
      }
      .dgroup-btn:hover {
        background: var(--mc-surface-2);
      }
      .dgroup-btn .nm {
        flex: 1;
        min-width: 0;
      }
      .dgroup-btn .chev {
        --mdc-icon-size: 20px;
        color: var(--mc-text-2);
        transition: transform 0.15s ease-out;
      }
      .dgroup-btn[aria-expanded='false'] .chev {
        transform: rotate(-90deg);
      }
      .dgroup-body {
        display: grid;
        gap: 16px;
      }
      .dgroup-body[hidden] {
        display: none;
      }
      @media (prefers-reduced-motion: reduce) {
        .dgroup-btn .chev {
          transition: none;
        }
      }
      .rule {
        background: color-mix(in srgb, var(--mc-surface-2) 40%, transparent);
      }
      .rule .cond {
        background: var(--mc-surface);
      }
      .rule .rule-name {
        flex: 1;
        min-width: 0;
        min-height: 32px;
        padding: 4px 8px;
      }
      .rule-body {
        display: grid;
        gap: 16px;
      }
      .rule-body .sub-head {
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text);
      }
      .layout-seg > button {
        justify-content: center;
        min-width: 48px;
      }
      .layout-glyph {
        display: inline-grid;
        gap: 2px;
        width: 28px;
        height: 14px;
        flex: none;
      }
      .layout-glyph i {
        display: block;
        border-radius: 2px;
        background: currentColor;
        opacity: 0.45;
      }
      [aria-checked='true'] > .layout-glyph i {
        opacity: 1;
      }
      p.help {
        margin: 0;
      }
      .child-list-sync {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 12px;
        border: 1px solid var(--mc-divider);
      }
      .child-list-sync[data-overridden] {
        border-color: color-mix(in srgb, var(--warning-color, #ffa600) 40%, transparent);
        background: color-mix(in srgb, var(--warning-color, #ffa600) 12%, transparent);
      }
      .mc-action-config {
        display: grid;
        gap: 16px;
        padding: 0;
      }
    `],Zs([(0,n.MZ)({attribute:!1})],Us.prototype,"stateManager",void 0),Zs([(0,n.MZ)({attribute:!1})],Us.prototype,"hass",void 0),Zs([(0,n.MZ)({reflect:!0})],Us.prototype,"variant",void 0),Zs([(0,n.wk)()],Us.prototype,"_state",void 0),Zs([(0,n.wk)()],Us.prototype,"_tabs",void 0),Zs([(0,n.wk)()],Us.prototype,"_expandedRules",void 0),Zs([(0,n.wk)()],Us.prototype,"_expandedFlows",void 0),Zs([(0,n.wk)()],Us.prototype,"_flowSections",void 0),Zs([(0,n.wk)()],Us.prototype,"_flowUndo",void 0),Zs([(0,n.wk)()],Us.prototype,"_designView",void 0),Zs([(0,n.wk)()],Us.prototype,"_designOpen",void 0),Us=Zs([(0,n.EM)("mc-inspector")],Us);var Gs=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const Ys=[{id:"form",label:401},{id:"yaml",label:1188}];let Qs=class extends o.WF{constructor(){super(...arguments),this._focusMode=!1}get inspector(){return this.shadowRoot?.querySelector("mc-inspector")??null}connectedCallback(){super.connectedCallback(),this.stateManager&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0,this._subscribedTo=void 0}willUpdate(e){e.has("stateManager")&&this.stateManager!==this._subscribedTo&&this._subscribe()}updated(){this._focusMode&&(this._focusMode=!1,this.shadowRoot?.querySelector('.mode [aria-selected="true"]')?.focus())}_subscribe(){this._unsubscribe?.(),this._subscribedTo=this.stateManager,this._unsubscribe=this.stateManager?.subscribe(e=>{this._state=e})}_onModeKeydown(e,t){const i=Ys.findIndex(e=>e.id===t),o={ArrowRight:(i+1)%Ys.length,ArrowLeft:(i-1+Ys.length)%Ys.length,Home:0,End:Ys.length-1}[e.key];void 0!==o&&(e.preventDefault(),this._focusMode=!0,this.stateManager?.setEditorMode(Ys[o].id))}focusStudioButton(){const e=this.shadowRoot?.querySelector(".studio-cta .btn-primary");e?e.focus():this.shadowRoot?.querySelector('.mode [aria-selected="true"]')?.focus()}_openStudio(){this.dispatchEvent(new CustomEvent("open-studio",{bubbles:!0,composed:!0}))}render(){const e=this._state,t=this.stateManager;if(!e||!t)return o.qy``;const i="yaml"===e.editorMode?"yaml":"form";return o.qy`
      <div class="pane-head">
        <div class="seg mode" role="tablist" aria-label=${(0,h.t)(339)}>
          ${Ys.map(e=>{const n=e.id===i;return o.qy`
              <button
                type="button"
                role="tab"
                aria-selected=${n?"true":"false"}
                tabindex=${n?"0":"-1"}
                @click=${()=>t.setEditorMode(e.id)}
                @keydown=${e=>this._onModeKeydown(e,i)}
              >${(0,h.t)(e.label)}</button>
            `})}
        </div>
        <button type="button" class="icon-btn" title=${(0,h.t)(1109)} aria-label=${(0,h.t)(1109)} ?disabled=${!t.canUndo()} @click=${()=>t.undo()}>
          <ha-icon icon="mdi:undo"></ha-icon>
        </button>
        <button type="button" class="icon-btn" title=${(0,h.t)(785)} aria-label=${(0,h.t)(785)} ?disabled=${!t.canRedo()} @click=${()=>t.redo()}>
          <ha-icon icon="mdi:redo"></ha-icon>
        </button>
      </div>
      <div class="pane-inner">
        <mc-template-bar .config=${e.config} .hass=${this.hass}></mc-template-bar>
        ${"yaml"===i?o.qy`<mc-yaml-editor .stateManager=${t} .hass=${this.hass}></mc-yaml-editor>`:o.qy`
              ${this._renderCta(e)}
              <section aria-labelledby="sec-structure">
                <div class="sec-title">
                  <h3 id="sec-structure">${(0,h.t)(1006)}</h3>
                  <button type="button" class="btn btn-text btn-sm" @click=${()=>t.setSelectedPath(null)}>
                    <ha-icon icon="mdi:card-outline"></ha-icon>${(0,h.t)(176)}
                  </button>
                </div>
                <mc-structure-outline
                  .stateManager=${t}
                  variant="pane"
                  @mc-edit-module=${()=>this.inspector?.focusInspector()}
                ></mc-structure-outline>
              </section>
              <div class="insp-wrap">
                <mc-inspector .stateManager=${t} .hass=${this.hass} variant="pane"></mc-inspector>
              </div>
            `}
      </div>
    `}_renderCta(e){const t=e.config,i=t.rows||[],n=(0,w.TV)(t);return o.qy`
      <div class="studio-cta">
        <div class="cta-top">
          ${this._renderThumb(t,e)}
          <div class="cta-text">
            <h3>${t.name?.trim()||(0,h.t)(1114)}</h3>
            <p>
              ${(0,h.t)(1289,{rows:i.length,mods:n})}
            </p>
          </div>
        </div>
        <button type="button" class="btn btn-primary" @click=${this._openStudio}>
          <ha-icon icon="mdi:arrow-expand"></ha-icon>${(0,h.t)(692)}
        </button>
      </div>
    `}_renderThumb(e,t){const i=(0,w.c4)(t.selectedPath),n=e.rows||[];return o.qy`
      <div class="thumb" aria-hidden="true">
        ${n.length?n.map((e,t)=>{const n=(0,f.U$)((0,f.JR)(e)).map(e=>+e.toFixed(3)+"fr").join(" ");return o.qy`
                <div class="t-row" style="grid-template-columns:${n}">
                  ${e.columns.map((e,n)=>o.qy`
                      <div class="t-col">
                        ${e.modules?.length?e.modules.map((e,a)=>o.qy`<span
                                class="t-mod ${"module"===i.kind&&i.row===t&&i.col===n&&i.module===a?"on":""}"
                              ></span>`):o.qy`<span class="t-mod none"></span>`}
                      </div>
                    `)}
                </div>
              `}):o.qy`<span class="t-mod none"></span>`}
      </div>
    `}};Qs.styles=[l.x,o.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .pane-head {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: var(--mc-surface);
        border-bottom: 1px solid var(--mc-divider);
      }
      .pane-head .seg {
        margin-right: auto;
      }
      .pane-inner {
        padding: 16px;
        display: grid;
        gap: 24px;
        min-width: 0;
      }
      .studio-cta {
        display: grid;
        gap: 16px;
        padding: 20px;
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
      }
      .cta-top {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        min-width: 0;
      }
      .cta-text {
        min-width: 0;
      }
      .studio-cta h3 {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 500;
        line-height: 1.3;
        overflow-wrap: anywhere;
      }
      .studio-cta p {
        margin: 4px 0 0;
        color: var(--mc-text-2);
        font-size: 0.875rem;
      }
      .studio-cta .btn {
        justify-self: start;
      }
      .thumb {
        flex: none;
        width: 72px;
        display: grid;
        gap: 4px;
        padding: 6px;
        border-radius: var(--mc-radius);
        background: var(--mc-surface-2);
      }
      .t-row {
        display: grid;
        gap: 4px;
      }
      .t-col {
        display: grid;
        gap: 3px;
        align-content: start;
      }
      .t-mod {
        display: block;
        height: 7px;
        border-radius: 2px;
        background: var(--mc-field-border);
        opacity: 0.55;
      }
      .t-mod.on {
        background: var(--mc-accent);
        opacity: 1;
      }
      .t-mod.none {
        opacity: 0.2;
      }
      .sec-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }
      .sec-title h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 500;
      }
      .insp-wrap {
        padding-top: 20px;
        border-top: 1px solid var(--mc-divider);
        min-width: 0;
      }
    `],Gs([(0,n.MZ)({attribute:!1})],Qs.prototype,"stateManager",void 0),Gs([(0,n.MZ)({attribute:!1})],Qs.prototype,"hass",void 0),Gs([(0,n.wk)()],Qs.prototype,"_state",void 0),Qs=Gs([(0,n.EM)("mc-pane-editor")],Qs);var Js=i(515);const Xs={narrow:615,wide:1176,panel:715},er={narrow:400,wide:800},tr=Object.keys(Xs),ir={narrow:616,wide:1177,panel:716},or=e=>({kind:"unknown",reason:e}),nr=()=>(0,h.t)(249);function ar(e){const t=(e,t,i,o=!1)=>({option:e,px:t,note:i,canMatch:!1,borderless:o});switch(e.kind){case"panel":return t("panel",null,(0,h.t)(563),!0);case"masonry":return t("narrow",er.narrow,(0,h.t)(562));case"sections":return e.columns?t("narrow",function(e,t=1){const i=400*t+32*(t-1);return Math.round((i-88)/12*e+8*(e-1))}(e.columns,e.span),(0,h.t)(565,{columns:e.columns})):t("narrow",er.narrow,(0,h.t)(564));case"sidebar":return e.sidebar?t("narrow",380,(0,h.t)(566)):t("wide",er.wide,(0,h.t)(566));default:return t("narrow",er.narrow,e.reason||nr())}}const sr="ha-more-info-dialog",rr=["closed","dialog-closed"];function lr(e,t,i){if(hr(e),!customElements.get(sr))return document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:i}})),null;const o=function(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e:null}(),n=document.createElement(sr);n.hass=t;for(const e of rr)n.addEventListener(e,t=>{t.stopPropagation(),"dialog-closed"===e&&(n.remove(),o?.isConnected&&o.focus({preventScroll:!0}))});return e.appendChild(n),n.showDialog?.({entityId:i}),dr(n),n}function cr(e){const t=e.querySelector('button, a[href], input, select, textarea, ha-icon-button, [tabindex]:not([tabindex="-1"])');if(t)return t;for(const t of e.querySelectorAll("*")){const e=t.shadowRoot&&cr(t.shadowRoot);if(e)return e}return null}function dr(e,t=20){const i=e.shadowRoot&&cr(e.shadowRoot);i?i.focus({preventScroll:!0}):t>0&&e.isConnected&&setTimeout(()=>dr(e,t-1),50)}function hr(e){e.querySelector(sr)?.remove()}function ur(e,t,i){return Math.max(t,Math.min(e,Math.max(t,i)))}const pr={fr:.05,"%":1,px:4},mr=(e,t)=>"px"===t?Math.round(10*e)/10:Math.round(100*e)/100,gr=(e,t)=>`${mr(e,t)}${t}`;function fr(e,t,i){const o=(0,f.C6)(e[t]),n=(0,f.C6)(e[t+1]),a=Math.max((i[t]??0)+(i[t+1]??0),1);if(o.unit===n.unit&&"auto"!==o.unit)return{unit:o.unit,a:o.value,b:n.value,total:a};let s=0,r=0;e.forEach((e,o)=>{if(o===t||o===t+1)return;const n=(0,f.C6)(e);"fr"===n.unit&&(i[o]??0)>0&&(s+=n.value,r+=i[o])});const l=s>0&&r>0?s/r:2/a;return{unit:"fr",a:(i[t]??0)*l,b:(i[t+1]??0)*l,total:a}}function vr(e,t,i,o,n){const a=!1!==n.snap,s=pr[i.unit],r=i.a+i.b,l=n.minPx??40;let c=Math.min(r*l/i.total,r/2);a&&(c=Math.min(Math.ceil(c/s-1e-9)*s,r/2));let d=a?Math.round(o/s)*s:o;d=Math.min(Math.max(d,c),r-c);const h=[...e],u=mr(d,i.unit);return h[t]=gr(u,i.unit),h[t+1]=gr(r-u,i.unit),h}function br(e,t,i,o,n={}){const a=fr(e,t,i),s=a.a+a.b;return vr(e,t,a,((i[t]??0)+o)/a.total*s,n)}const yr="__mc_studio_blocked",_r=new Set(["navigate","url"]),wr=new Set(["__proto__","constructor","prototype"]);function $r(e,t){if(t>40||null===e||"object"!=typeof e)return e;if(Array.isArray(e)){let i;return e.forEach((o,n)=>{const a=$r(o,t+1);a!==o&&(i??=e.slice(),i[n]=a)}),i??e}const i=e;if("string"==typeof i.action&&_r.has(i.action))return{action:"fire-dom-event",data:{[yr]:i.action}};let o;for(const e of Object.keys(i)){if(wr.has(e))continue;const n=$r(i[e],t+1);n!==i[e]&&(o??={...i},o[e]=n)}return o??i}function kr(e){return $r(e,0)}function xr(e,t){const i=e.querySelector(t);if(i)return i;for(const i of e.querySelectorAll("*")){const e=i.shadowRoot,o=e&&xr(e,t);if(o)return o}return null}function Cr(e,t){const i=document.querySelector("home-assistant");(i&&xr(i.shadowRoot??i,"hui-view")||i||document).dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:t}))}const Sr={background:0,flow:1,overlay:2},Mr=e=>e.split("/").length,Ar=(e,t)=>t.startsWith(`${e}/`);function qr(e){return e.sort((e,t)=>Ar(e.path,t.path)?1:Ar(t.path,e.path)?-1:Sr[e.placement]!==Sr[t.placement]?Sr[t.placement]-Sr[e.placement]:Mr(e.path)!==Mr(t.path)?Mr(t.path)-Mr(e.path):t.order-e.order),e.map(e=>e.path)}function Er(e,t,i=1){if(!e.length)return;const o=void 0===t?-1:e.indexOf(t);return o<0?1===i?e[0]:e[e.length-1]:e[(o+i+e.length)%e.length]}const Tr={flow:655,background:135,overlay:680};function Lr(e,t){if(!e)return[];const i=[];let o=0;for(const n of Array.from(e.querySelectorAll("[data-mc-path]"))){const e=n.dataset.mcPath??"",a=(0,w.HT)(e),s=a?(0,w.cv)(t,a):void 0;if(!s)continue;const r=n.getBoundingClientRect();(r.width||r.height)&&i.push({path:e,placement:zr(s),order:o++,rect:{left:r.left,top:r.top,width:r.width,height:r.height}})}return i}function zr(e){return"video-bg"===e.type&&void 0===e.placement?"background":(0,at.xc)(e)}function jr(e,t,i,o){const n=[],a="x"in o,s=a?function(e,t,i){return qr(e.filter(e=>function(e,t,i){return t>=e.left&&t<e.left+e.width&&i>=e.top&&i<e.top+e.height}(e.rect,t,i)))}(e,o.x,o.y):function(e,t){return qr(e.filter(e=>{return i=e.rect,o=t,i.left<o.left+o.width&&o.left<i.left+i.width&&i.top<o.top+o.height&&o.top<i.top+i.height;var i,o}))}(e,o);for(const e of s){const i=(0,w.HT)(e),o=i?(0,w.cv)(t,i):void 0;i&&o&&n.push({key:e,kind:"module",name:(0,at.AO)(o),detail:(0,h.t)(Tr[zr(o)]),sel:i})}var r,l,c;return(a?(r=i,l=o.x,c=o.y,!!r&&l>=r.left&&l<r.left+r.width&&c>=r.top&&c<r.top+r.height):!!i&&((e,t)=>e.left<t.left+t.width&&t.left<e.left+e.width&&e.top<t.top+t.height&&t.top<e.top+e.height)(i,o))&&(t.background_layers??[]).slice(0,4).forEach((e,t)=>{if(!0===e?.hidden)return;const i=(0,Ts.kk)(e);n.push({key:`backdrop:${t}`,kind:"backdrop",index:t,name:i.detail?`${(0,h.t)(i.type)}, ${i.detail}`:(0,h.t)(i.type),detail:(0,h.t)(170,{n:t+1})})}),n}const Rr=e=>({left:e.left,top:e.top,width:e.width,height:e.height});class Or{constructor(e){this.host=e,this.measure=e=>{const t=this.host.card()?.shadowRoot,i={};for(const o of e){if(!/^[\d.]+(\/[\d.]+)*$/.test(o))continue;const e=t?.querySelector(`[data-mc-path="${o}"]`)?.getBoundingClientRect();i[o]=e&&(e.width||e.height)?Rr(e):void 0}return i}}here(e,t){const i=this.host.card(),o=this.host.config();if(!i||!o)return[];const n=Lr(i.shadowRoot,o),a=i.getBoundingClientRect();return jr(n,o,a.width||a.height?Rr(a):void 0,{x:e,y:t})}_currentKey(){const e=this.host.selection();return"module"===e.kind?(0,w.VC)(e):void 0}selectionBox(){const e=this.host.selection();if("module"!==e.kind)return;const t=this.host.card()?.shadowRoot?.querySelector(`[data-mc-path="${(0,w.VC)(e)}"]`),i=t?.getBoundingClientRect();return i&&(i.width||i.height)?Rr(i):void 0}hereForSelection(){const e=this.selectionBox(),t=this.host.card(),i=this.host.config();if(!e||!t||!i)return[];const o=t.getBoundingClientRect();return jr(Lr(t.shadowRoot,i),i,o.width||o.height?Rr(o):void 0,e)}pick(e,t){"module"===e.kind&&e.sel?this.host.select(e.sel):"backdrop"===e.kind&&void 0!==e.index&&this.host.openBackdrop(e.index);const i=t.indexOf(e)+1;this.host.announce((0,h.t)(898,{name:e.name,n:Math.max(1,i)}))}altSelect(e,t){const i=this.here(e,t),o=Er(i.map(e=>e.key),this._currentKey(),1),n=i.find(e=>e.key===o);return!!n&&(this.pick(n,i),!0)}step(e){const t=this.hereForSelection(),i=Er(t.map(e=>e.key),this._currentKey(),e),o=t.find(e=>e.key===i);return!!o&&(this.pick(o,t),!0)}sheetItems(e){const t=this._currentKey();return e.map(e=>({key:e.key,name:e.name,detail:e.detail,current:e.key===t}))}}var Pr=i(6355),Hr=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const Dr=["pointerdown","pointerup","mousedown","mouseup","touchstart","touchend","dblclick","contextmenu","keyup"],Ir=new Set(["pointerdown","pointerup","touchstart","touchend"]),Fr=new Set(["render_template","auth/sign_path","camera_thumbnail","weather/subscribe_forecast","magic_card_utils/get_templates","media_source/resolve_media","media_source/browse_media"]),Vr=/^recorder\/(clear|import|update|change|adjust|backup|async_)/;function Nr(e){return e.composedPath().some(e=>e instanceof HTMLElement&&e.hasAttribute("data-mc-popup"))}const Zr=e=>e.composedPath().some(e=>e instanceof HTMLElement&&e.classList.contains("mc-pause"));function Br(e){if("string"!=typeof e||!e)return!1;if(Fr.has(e))return!0;const t=e.slice(e.lastIndexOf("/")+1);return!(!e.startsWith("get")&&!t.startsWith("get")&&"list"!==t&&!e.startsWith("subscribe")&&!t.startsWith("subscribe")&&!e.startsWith("history/")&&(!e.startsWith("recorder/")||Vr.test(e)))}const Wr=e=>e&&"object"==typeof e?e.type:void 0;function Kr(e){return new Proxy(e,{get(e,t){const i=Reflect.get(e,t,e);return"function"!=typeof i?i:"sendMessagePromise"===t?(t,...o)=>Br(Wr(t))?i.call(e,t,...o):Promise.resolve(void 0):"subscribeMessage"===t?(t,o,...n)=>Br(Wr(o))?i.call(e,t,o,...n):Promise.resolve(()=>{}):"sendMessage"===t?(t,...o)=>{Br(Wr(t))&&i.call(e,t,...o)}:i.bind(e)}})}function Ur(e){const t=e.callWS?.bind(e),i=e.connection;return{...e,...i?{connection:Kr(i)}:{},callService:async()=>{},callApi:async()=>{},callWS:async e=>Br(e?.type)&&t?t(e):void 0}}function Gr(e){const t=e.composedPath()[0];return!!(t&&t instanceof HTMLElement)&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable)}function Yr(e){switch(e.kind){case"card":return null;case"row":return`[data-mc-row="${e.row}"]`;case"column":return`[data-mc-col="${e.row}.${e.col}"]`;case"module":return`[data-mc-path="${(0,w.VC)(e)}"]`;case"slot":return`[data-mc-slot="${(0,w.VC)((0,w.tw)(e))}#${e.slot}"]`}}function Qr(e){const t=e.dataset;if(t.mcPath)return(0,w.HT)(t.mcPath);if(t.mcSlot){const[e,i]=t.mcSlot.split("#"),o=(0,w.HT)(e);return o?(0,w.r$)(o.row,o.col,o.module,o.child,Number(i)):null}if(t.mcCol){const[e,i]=t.mcCol.split(".").map(Number);return{kind:"column",row:e,col:i}}return t.mcRow?{kind:"row",row:Number(t.mcRow)}:null}function Jr(e){for(const t of e){if(!(t instanceof HTMLElement))continue;const e=Qr(t);if(e)return{el:t,sel:e}}return null}function Xr(e){return Jr(e)?.sel??null}function el(e){return`k-${"slot"===e.kind?"column":e.kind}`}function tl(e){const t=e.getBoundingClientRect(),i=e.offsetWidth>0&&t.width>0?t.width/e.offsetWidth:1,o=e.offsetHeight>0&&t.height>0?t.height/e.offsetHeight:1;return e=>({top:(e.top-t.top)/o,left:(e.left-t.left)/i,width:e.width/i,height:e.height/o})}let il=class extends o.WF{constructor(){super(...arguments),this.width=ar({kind:"masonry",reason:""}),this.live=!1,this._fillPx=0,this._hoverLabel="",this._tabState=null,this._previewPaused=!1,this._hoverSel=null,this._cardError="",this._connectFrom=null,this._connectNote="",this._cardLive=!1,this._hoverEl=null,this._placeQueued=!1,this._colDrag=null,this._colPreview=null,this._lastKeyResize=null,this._status="",this._statusTimer=0,this._itemMenu=new gt(this,{surface:"canvas",focusSelection:()=>this.focusCanvas(),rename:e=>this._requestRename(e),status:e=>this.showStatus(e),connect:e=>{this._select(e),this._startConnect()}}),this._longPress=new ft((e,t,i)=>this._longPressAt(e,t,i)),this._layers=new Or({card:()=>this._card,config:()=>this._state?.config,selection:()=>this._sel,select:e=>this._select(e),openBackdrop:e=>{(0,os.VX)(e),this._select({kind:"card"}),this.stateManager?.setActiveTab("design")},announce:e=>this.showStatus(e)}),this._pressTimer=0,this._hereCount=0,this._docked=!1,this._togglePreviewPause=e=>{e.stopPropagation(),this._previewPaused=!this._previewPaused},this._block=e=>{if(!(this.live||Nr(e)||"keyup"===e.type&&" "===e.key&&Zr(e))){if("contextmenu"===e.type)return e.stopPropagation(),void(e.shiftKey||(e.preventDefault(),this._onContext(e)));"pointerdown"!==e.type&&"mousedown"!==e.type||this.focusCanvas(),e.stopPropagation(),Ir.has(e.type)||e.preventDefault()}},this._stop=e=>{e.stopPropagation()},this._onForwarded=e=>{if(e.stopPropagation(),!this.live)return;const t=e.detail,i=t?.[yr];void 0!==i||"hass-action"===e.type&&function(e){const t=e;if(!t||"string"!=typeof t.action||!t.config)return!1;const i=t.config[`${t.action}_action`]?.action;return"string"==typeof i&&_r.has(i)}(t)?this.showStatus((0,h.t)(619)):Cr(e.type,t)},this._onMoreInfo=e=>{if(e.stopPropagation(),!this.live)return;const t=e.detail?.entityId;"string"==typeof t&&t&&this.dispatchEvent(new CustomEvent("mc-studio-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}))},this._onCardClick=e=>{if(this.live||Nr(e))return;if(Zr(e))return e.preventDefault(),void this._togglePreviewPause(e);if(e.stopPropagation(),e.preventDefault(),this._longPress.justFired)return;if(e.altKey&&!this._connectFrom&&this._layers.altSelect(e.clientX,e.clientY))return void this.focusCanvas();const t=Xr(e.composedPath())??{kind:"card"};if(this._connectFrom){const e=this._state?.config;if("module"===t.kind&&e&&Z(e,t))this._connectNote=(0,h.t)(417);else if("module"===t.kind&&!(0,w.V9)(t,this._connectFrom)){const e=this._connectFrom;this._connectFrom=null,this.stateManager?.addFlow(e,t)}return void this.focusCanvas()}const i="module"===t.kind?void 0:this._flowAt(e);i?this.stateManager?.selectFlow(i):this._select(t),this.focusCanvas()},this._cancelConnect=()=>{this._connectFrom=null,this.focusCanvas()},this._onHintKeydown=e=>{"Escape"===e.key&&(e.preventDefault(),this._cancelConnect())},this._onCardKeydown=e=>{if(this.live||Nr(e))return;if("Tab"===e.key)return;if(e.stopPropagation(),("Enter"===e.key||" "===e.key)&&Zr(e))return;if(Gr(e)&&"Escape"!==e.key)return void e.preventDefault();const t=new KeyboardEvent(e.type,{key:e.key,code:e.code,ctrlKey:e.ctrlKey,metaKey:e.metaKey,altKey:e.altKey,shiftKey:e.shiftKey,repeat:e.repeat,bubbles:!0,composed:!0,cancelable:!0}),i=this.shadowRoot?.querySelector(".canvas");i&&i.dispatchEvent(t),(t.defaultPrevented||"Escape"!==e.key)&&e.preventDefault()},this._onGroundClick=e=>{this.live||e.composedPath().some(e=>e instanceof HTMLElement&&e.classList.contains("float-bar"))||this._longPress.justFired||(this._connectFrom?this._connectFrom=null:(this._state?.selectedFlow&&this.stateManager?.selectFlow(null),this._select({kind:"card"})))},this._onKeydown=e=>{if(this.live||Gr(e)||!this.stateManager)return;if(this._connectFrom&&"Escape"===e.key)return e.preventDefault(),void(this._connectFrom=null);const t=this._sel,i=(e.ctrlKey||e.metaKey)&&!e.altKey,o=!e.altKey||"ArrowUp"!==e.key&&"ArrowDown"!==e.key?0:"ArrowUp"===e.key?-1:1;"module"===t.kind&&o?(e.preventDefault(),this._op(o<0?"up":"down")):"row"!==t.kind&&"slot"!==t.kind||!o?!this._connectFrom&&this._keyboardMenu(e,t)?e.preventDefault():"module"!==t.kind||"Delete"!==e.key&&"Backspace"!==e.key||i?"module"===t.kind&&i&&"d"===e.key.toLowerCase()?(e.preventDefault(),this._op("duplicate")):"Escape"===e.key&&"card"!==t.kind&&(e.preventDefault(),this._select((0,w.tw)(t,this._state?.config))):(e.preventDefault(),this._op("delete")):(e.preventDefault(),this._moveBy(t,o))},this._onGroundContext=e=>{const t=e.composedPath();if(this.live||e.shiftKey||Nr(e))return;if(e.preventDefault(),this._longPress.justFired)return;if(t.some(e=>e instanceof HTMLElement&&e.classList.contains("col-handle")))return;const i=t.some(e=>e instanceof HTMLElement&&e.classList.contains("float-bar"));this._openContext(i?this._sel:{kind:"card"},e.clientX,e.clientY)},this._onLongDown=e=>{const t=e.composedPath();if(!(this.live||Nr(e)||t.some(e=>e instanceof HTMLElement&&(e.classList.contains("col-handle")||e.classList.contains("float-bar"))))&&(this._longPress.down(e),this._clearPress(),"touch"===e.pointerType)){const{clientX:t,clientY:i}=e;this._pressTimer=window.setTimeout(()=>this._press={x:t,y:i},150)}},this._pressMove=e=>{const t=this._press;!this.live&&t&&Math.hypot(e.clientX-t.x,e.clientY-t.y)>8&&this._clearPress()},this._clearPress=()=>{clearTimeout(this._pressTimer),this._pressTimer=0,this._press&&(this._press=void 0)},this._onBgStatus=e=>{(0,os.Lx)(e.detail)},this._closeSheet=()=>{this._sheet=void 0,this.focusCanvas()},this._pickFromSheet=e=>{const t=this._sheet,i=t?.list.find(t=>t.key===e.detail.key);this._sheet=void 0,t&&i&&this._layers.pick(i,t.list),this.focusCanvas()},this._onPointerMove=e=>{if(this.live)return;const t=e.composedPath(),i=this._card,o=Jr(t)??(i&&t.includes(i)?{el:i,sel:{kind:"card"}}:null),n=o?.el??null;if(n===this._hoverEl)return;this._hoverEl=n,this._hoverSel=o?.sel??null;const a=this._state?.config;this._hoverLabel=o&&a&&"card"!==o.sel.kind?(0,w.e9)(a,o.sel).title:"",this._placeHover()},this._onPointerLeave=()=>{this.live||(this._hoverEl=null,this._hoverSel=null,this._placeHover())},this._queuePlace=()=>{if(this._placeQueued)return;this._placeQueued=!0;const e=this._card;(e?e.updateComplete:Promise.resolve(!0)).then(()=>requestAnimationFrame(()=>{this._placeQueued=!1,this._measureFill(),this.live||this._place()}))},this._onHandleDown=e=>{if(this.live)return;const t=this._resizeRow,i=e.currentTarget;if(null===t||0!==e.button||this._colDrag)return;e.preventDefault(),e.stopPropagation();const o=this._measureColumns(t),{rowEl:n}=this._rowEls(t);if(o&&n){try{i.setPointerCapture?.(e.pointerId)}catch{}this._colDrag={row:t,i:Number(i.dataset.i),pointerId:e.pointerId,startX:e.clientX,scale:o.scale,widths:this._widthsOf(t),px:o.px,rowEl:n,template:n.style.gridTemplateColumns,config:this._state?.config},window.addEventListener("pointermove",this._onDragMove),window.addEventListener("pointerup",this._onDragUp),window.addEventListener("pointercancel",this._onDragCancel),window.addEventListener("keydown",this._onDragKey,!0)}},this._onDragMove=e=>{const t=this._colDrag;if(!t||e.pointerId!==t.pointerId)return;e.preventDefault();const i=br(t.widths,t.i,t.px,(e.clientX-t.startX)/t.scale,{snap:!e.altKey});t.next=i,t.rowEl.style.gridTemplateColumns=(0,f.gp)(i,i.length),this._colPreview=i,this._queuePlace()},this._onDragUp=e=>{this._colDrag&&e.pointerId===this._colDrag.pointerId&&this._endColumnDrag(!0)},this._onDragCancel=e=>{this._colDrag&&e.pointerId===this._colDrag.pointerId&&this._endColumnDrag(!1)},this._onDragKey=e=>{this._colDrag&&"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._endColumnDrag(!1))},this._onHandleKey=e=>{if(this.live||this._colDrag||!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault(),e.stopPropagation();const t=this._resizeRow,i=null===t?null:this._measureColumns(t);if(null===t||!i)return;const o=Number(e.currentTarget.dataset.i),n=this._widthsOf(t),a="Home"===e.key||"End"===e.key?br(n,o,i.px,1e6*("Home"===e.key?-1:1)):function(e,t,i,o,n={}){const a=fr(e,t,i);return vr(e,t,a,a.a+o*pr[a.unit],{...n,snap:!1})}(n,o,i.px,("ArrowLeft"===e.key?-1:1)*(e.shiftKey?5:1));if(a.join(" ")===n.join(" "))return;const s=Date.now(),r=this._lastKeyResize,l=!!r&&r.row===t.id&&r.i===o&&r.config===this._state?.config&&(e.repeat||s-r.t<500);t.write(a,l),this._lastKeyResize={row:t.id,i:o,t:s,config:this._state?.config}},this._onHandleDblClick=e=>{e.preventDefault(),e.stopPropagation();const t=this._resizeRow,i=null===t?null:this._measureColumns(t);if(null===t||!i)return;const o=this._widthsOf(t);this._commitWidths(t,function(e,t,i){const o=fr(e,t,i),n=(o.a+o.b)/2,a=[...e];return a[t]=gr(n,o.unit),a[t+1]=gr(n,o.unit),a}(o,Number(e.currentTarget.dataset.i),i.px),o)}}showStatus(e){this._status=e,clearTimeout(this._statusTimer),this._statusTimer=window.setTimeout(()=>{this._status=""},3e3)}focusCanvas(){this.shadowRoot?.querySelector(".canvas")?.focus({preventScroll:!0})}connectedCallback(){super.connectedCallback(),this.stateManager&&!this._unsubscribe&&this._subscribe(),this.hasUpdated&&this._observe(),window.addEventListener("resize",this._queuePlace),(0,Pr.AY)(this._layers.measure),en();const e=(0,os.Wb)(()=>this._applyPreview()),t=(0,os.Rv)(),i=(o=()=>this._syncTabState(),$o.add(o),()=>$o.delete(o));var o;this._stopPreview=()=>{e(),t(),i()}}_applyPreview(){const e=this._card?.shadowRoot?.querySelector("mc-bg-stack"),t=this.live?"play":(0,os.P3)();e&&e.preview!==t&&(e.preview=t)}_applyLive(){const e=this._card;e&&(this.live?(this._connectFrom=null,this._connectNote="",this._itemMenu.close(!1),this._sheet=void 0,this._endColumnDrag(!1),this._longPress.cancel(),this._clearPress(),this._hoverEl=null,this._hoverSel=null,this._docked=!1,e.selectedPath=void 0,e.selectedFlow=null,e.previewPaused=!1,this.hass&&(e.hass=this.hass),e.editMode=!1):(this.hass&&(e.hass=Ur(this.hass)),e.editMode=!0,e.previewPaused=this._previewPaused,this._syncSelection()),this._syncCard(),this._queuePlace(),e.updateComplete.then(()=>this._applyPreview()),this._applyPreview())}_syncSelection(){const e=this._card;if(!e)return;const t=this._sel;e.selectedPath="module"===t.kind?(0,w.VC)(t):"slot"===t.kind?`${(0,w.VC)((0,w.tw)(t))}#${t.slot}`:void 0,e.selectedFlow=this._state?.selectedFlow??null}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0,this._subscribedTo=void 0,this._ro?.disconnect(),this._ro=void 0,window.removeEventListener("resize",this._queuePlace),this._endColumnDrag(!1),this._itemMenu.close(!1),this._longPress.cancel(),this._clearPress(),clearTimeout(this._statusTimer),(0,Pr.AY)(void 0),this._stopPreview?.(),this._sheet=void 0}willUpdate(e){e.has("stateManager")&&this.stateManager!==this._subscribedTo&&this._subscribe();const t=this._colDrag;t&&e.has("_state")&&this._state?.config!==t.config&&this._endColumnDrag(!1)}_subscribe(){this._unsubscribe?.(),this._subscribedTo=this.stateManager,this._unsubscribe=this.stateManager?.subscribe(e=>{this._state=e})}firstUpdated(){const e=document.createElement(r.Mp);e.editMode=!this.live,e.previewPaused=!this.live&&this._previewPaused,this._card=e,this.hass&&(e.hass=this.live?this.hass:Ur(this.hass)),this._syncCard();const t=this.shadowRoot.querySelector(".card-host");for(const e of Dr)t.addEventListener(e,this._block,!0);t.addEventListener("click",this._onCardClick,!0),t.addEventListener("keydown",this._onCardKeydown,!0),t.addEventListener("mc-bg-layer-status",this._onBgStatus);const i=this.shadowRoot.querySelector(".canvas");i.addEventListener("pointerdown",this._onLongDown,!0),i.addEventListener("pointermove",this._longPress.move,!0);for(const e of["pointerup","pointercancel","scroll"])i.addEventListener(e,this._longPress.cancel,!0);for(const e of["pointerup","pointercancel","scroll"])i.addEventListener(e,this._clearPress,!0);i.addEventListener("pointermove",this._pressMove,!0),t.addEventListener("hass-action",this._onForwarded),t.addEventListener("ll-custom",this._onForwarded),t.addEventListener("hass-more-info",this._onMoreInfo),t.appendChild(e),this._observe(),document.fonts?.ready.then(this._queuePlace,()=>{})}_observe(){if(this._ro||"undefined"==typeof ResizeObserver)return;this._ro=new ResizeObserver(this._queuePlace);const e=this.shadowRoot?.querySelector(".canvas-inner");e&&this._ro.observe(e),this._card&&this._ro.observe(this._card)}updated(e){if(e.has("live")&&void 0!==e.get("live")?this._applyLive():e.has("hass")&&this._card&&this.hass&&(this._card.hass=this.live?this.hass:Ur(this.hass)),e.has("_previewPaused")&&this._card&&!this.live&&(this._card.previewPaused=this._previewPaused),this._syncTabState(),e.has("_state")){this._syncCard();const e=this._sel;this.live||this._syncSelection(),!this._connectFrom||(0,w.V9)(e,this._connectFrom)&&this._state?.config===this._connectConfig||(this._connectFrom=null)}this._queuePlace()}_syncTabState(){const e=this._card,t=this._sel,i=this._state?.config,o=e&&!this.live&&"module"===t.kind&&i?(0,w.cv)(i,t):void 0,n="tabs"===o?.type?"__hover__"===(a=wo)?"hover":"__tab_active__"===a||a.endsWith("::tab_active")?"active":"__tab_disabled__"===a||a.endsWith("::tab_disabled")?"disabled":null:null;var a;const s=n&&"module"===t.kind?e?.shadowRoot?.querySelector(`[data-mc-path="${(0,w.VC)(t)}"]`):null;this._forcedIn&&this._forcedIn!==s&&Co(this._forcedIn,null),this._forcedIn=s??void 0;const r=s?Co(s,n):null;r!==this._tabState&&(this._tabState=r)}_syncCard(){const e=this._card,t=this._state?.config;if(!e||!t||t===this._cardConfig&&this._cardLive===this.live)return;t.background_layers!==this._cardConfig?.background_layers&&(0,os.cj)(),this._cardConfig=t,this._cardLive=this.live;const i={...(0,a.wL)(t,this._state?.templateAnimations)};delete i.template;try{e.setConfig(this.live?kr(i):i),this._cardError="",e.updateComplete.then(()=>this._syncTabState())}catch(e){this._cardError=e instanceof Error?e.message:String(e)}}get _sel(){return(0,w.c4)(this._state?.selectedPath??null)}_select(e){this.stateManager?.setSelectedPath((0,w.bm)(e))}_flowAt(e){const t=this._card?.shadowRoot?.querySelectorAll("mc-flows");for(const i of t??[]){const t=i.flowAt?.(e.clientX,e.clientY);if(t)return t}}_startConnect(){const e=this._sel,t=this._state?.config;"module"===e.kind&&t&&!Z(t,e)&&(this._connectNote="",this._connectConfig=t,this._connectFrom=e,this.focusCanvas())}_moveBy(e,t){const i=this.stateManager,o=this._state?.config;if(i&&o)if("row"===e.kind){const n=e.row+t;if(n<0||n>=o.rows.length)return;i.moveRow(e.row,n),i.setSelectedPath({rowIndex:n})}else if("slot"===e.kind){const n=(0,w.kW)(o,e),a=e.child?.map(e=>({...e}));"tabs"===n?.type?i.moveTab(e.row,e.col,e.module,a,e.slot,t):"row"===n?.type&&i.moveNestedColumn(e.row,e.col,e.module,a,e.slot,t)}}_keyboardMenu(e,t){const i=this.shadowRoot,o=i?.querySelector(".canvas"),n=i?.querySelector(".sel-frame"),a=i?.querySelector(".device");if(!o)return!1;if("card"===t.kind||!n||n.hidden){const i=(a??o).getBoundingClientRect();return this._itemMenu.shortcut(e,t,a??o,{point:{x:i.left,y:i.top},returnFocus:o})}return this._itemMenu.shortcut(e,t,n,{returnFocus:o})}_onContext(e){this._longPress.cancel(),this._longPress.justFired||this._contextAt(e.composedPath(),e.clientX,e.clientY)}_longPressAt(e,t,i){this._clearPress();const o=this._connectFrom?[]:this._layers.here(t,i);o.length>1&&Xo.ready()?this._openSheet(o,t,i,!0):this._contextAt(e,t,i)}_openSheet(e,t,i,o=!1){this._itemMenu.close(!1),this._sheet={list:e,x:t,y:i,hold:o}}_openSheetFromBar(e){const t=this._layers.hereForSelection(),i=e.currentTarget.getBoundingClientRect();t.length&&this._openSheet(t,i.left,i.bottom+4)}_openPlacementMenu(e){const t=this.shadowRoot?.querySelector(".canvas"),i=this._sel;t&&"module"===i.kind&&this._itemMenu.open(i,e.currentTarget,{returnFocus:t},"placement")}_stepLayer(e){this._layers.step(e),this.focusCanvas()}_contextAt(e,t,i){this._openContext(Xr(e)??{kind:"card"},t,i)}_openContext(e,t,i){const o=this.shadowRoot?.querySelector(".canvas");o&&!this._connectFrom&&this.stateManager&&(this.stateManager.setSelectedPath((0,w.bm)(e),{reveal:!1}),this.focusCanvas(),this._itemMenu.open(e,o,{point:{x:t,y:i},returnFocus:o}))}_requestRename(e){const t=this.shadowRoot?.querySelector(".canvas");this.dispatchEvent(new CustomEvent("mc-rename-request",{bubbles:!0,composed:!0,detail:{sel:e,returnFocus:t}}))}_op(e){const t=this.stateManager,i=this._sel;t&&"module"===i.kind&&("up"===e||"down"===e?t.moveModuleBy(i.row,i.col,i.module,"up"===e?-1:1,i.child):"duplicate"===e?t.duplicateModule(i.row,i.col,i.module,i.child):t.deleteModule(i.row,i.col,i.module,i.child))}async _onBarClick(e,t){const i=t.currentTarget;this._op(e),await this.updateComplete,"delete"!==e&&!i.disabled&&i.isConnected&&"module"===this._sel.kind||this.focusCanvas()}_measureFill(){const e=Math.round(this.shadowRoot?.querySelector(".device")?.clientWidth??0);e!==this._fillPx&&(this._fillPx=e)}_rectOf(e){const t=this._card;if(!t)return null;const i=Yr(e),o=i?t.shadowRoot?.querySelector(i)??("slot"===e.kind?t.shadowRoot?.querySelector(Yr((0,w.tw)(e))):null):t;if(!o)return null;const n=o.getBoundingClientRect();return n.width||n.height?n:null}_place(){const e=this.shadowRoot,t=e?.querySelector(".canvas-inner"),i=e?.querySelector(".sel-frame"),o=e?.querySelector(".float-bar");if(!t||!i||!o)return;const n=this._sel,a=this._rectOf(n),s=e?.querySelector(".canvas"),r=tl(t);if(this._placeColumnHandles(r),!a)return this._docked=!1,i.hidden=!0,o.hidden=!0,s?.classList.remove("framed"),void this._placeHover();const l=r(a),c="module"===n.kind&&this._state?(0,w.cv)(this._state.config,n):void 0,d=!!c&&("flow"!==(0,at.xc)(c)||(0,at.aI)(c)&&"video-bg"===c.type),h=d?-3:6,u=l.top-h,p=l.left-h,m=l.width+2*h,g=l.height+2*h;if(i.toggleAttribute("data-layered",d),i.hidden=!1,Object.assign(i.style,{top:`${u}px`,left:`${p}px`,width:`${m}px`,height:`${g}px`}),"module"!==n.kind)this._docked=!1,o.hidden=!0;else{o.hidden=!1;const i=s,a=(0,w.VC)(n),l=e=>e===a||a.startsWith(`${e}/`)||e.startsWith(`${a}/`),c=[...this._card?.shadowRoot?.querySelectorAll("[data-mc-path]")??[]].filter(e=>!l(e.dataset.mcPath??"")).map(e=>e.getBoundingClientRect()).filter(e=>e.width||e.height).map(r),d={top:i.scrollTop,left:i.scrollLeft,width:Math.min(i.clientWidth,t.clientWidth),height:i.clientHeight+(e?.querySelector(".bar-dock")?.offsetHeight??0)},h=function(e,t,i,o){const n=o.top+8,a=o.top+o.height-8,s=o.left+8,r=o.left+o.width-8,l=ur(e.left+e.width-t.width,s,r-t.width),c=ur(e.top,n,a-t.height),d=(e,o)=>{const l={top:e,left:o,width:t.width,height:t.height};return!(e<n||e+t.height>a||o<s||o+t.width>r||i.some(e=>{return(t=l).left<(i=e).left+i.width&&i.left<t.left+t.width&&t.top<i.top+i.height&&i.top<t.top+t.height;var t,i}))},h=[[e.top+e.height+8,l],[e.top-28-8-t.height,l],[c,e.left+e.width+8],[c,e.left-8-t.width]];for(const[e,t]of h)if(d(e,t))return{top:e,left:t};return null}({top:u,left:p,width:m,height:g},{width:Math.max(o.offsetWidth,o.scrollWidth),height:o.offsetHeight},c,d),f=!h;if(f!==this._docked){const t=[...o.querySelectorAll("button")].findIndex(t=>t===e?.activeElement);t>=0&&(this._barFocus={index:t,from:o})}this._docked=f,this._barFocus&&this._barFocus.from!==o&&(o.querySelectorAll("button")[this._barFocus.index]?.focus({preventScroll:!0}),this._barFocus=void 0),h&&Object.assign(o.style,{top:`${h.top}px`,left:`${h.left}px`})}s?.classList.toggle("framed",!i.hidden),this._placeHover();const f="module"===n.kind?this._layers.hereForSelection().length:0;f!==this._hereCount&&(this._hereCount=f),(0,Pr.vs)(),this._applyPreview()}get _resizeRow(){const e=this._sel,t=this._state?.config,i=this.stateManager;if(this.live||this._connectFrom||!t||!i)return null;if("row"===e.kind||"column"===e.kind){const o=t.rows[e.row];return o&&o.columns.length>1?{id:`${e.row}`,grid:o,count:o.columns.length,rowQ:`[data-mc-row="${e.row}"]`,colQ:t=>`[data-mc-col="${e.row}.${t}"]`,write:(t,o)=>i.setColumnWidths(e.row,t,void 0,o)}:null}const o="slot"===e.kind?(0,w.tw)(e):"module"===e.kind?e:null,n=o?(0,w.cv)(t,o):void 0,a="row"===n?.type?n.columns?.length??0:0;if(!o||a<2)return null;const s=(0,w.VC)(o);return{id:s,grid:n,count:a,colQ:e=>`[data-mc-slot="${s}#${e}"]`,write:(e,t)=>i.setNestedColumnWidths(o.row,o.col,o.module,o.child,e,void 0,t)}}_rowEls(e){const t=this._card?.shadowRoot,i=[];for(let o=0;o<e.count;o++){const n=t?.querySelector(e.colQ(o));n&&i.push(n)}return{rowEl:(e.rowQ?t?.querySelector(e.rowQ):i[0]?.closest(".mc-nested-row"))??null,cols:i}}_placeColumnHandles(e){const t=this.shadowRoot?.querySelectorAll(".col-handle");if(!t?.length)return;const i=this._resizeRow,{rowEl:o,cols:n}=null===i?{rowEl:null,cols:[]}:this._rowEls(i),a=o?o.getBoundingClientRect():null;for(const i of t){const t=Number(i.dataset.i),o=n[t]?.getBoundingClientRect(),s=n[t+1]?.getBoundingClientRect();if(!a||!o||!s||!a.width&&!a.height){i.hidden=!0;continue}const r=e(a),l=e(o),c=(l.left+l.width+e(s).left)/2;i.hidden=!1,Object.assign(i.style,{left:`${c}px`,top:`${r.top}px`,height:`${r.height}px`})}}_measureColumns(e){const t=this.shadowRoot?.querySelector(".canvas-inner"),{cols:i}=this._rowEls(e);if(!t||!i.length)return null;const o=t.getBoundingClientRect(),n=t.offsetWidth>0&&o.width>0?o.width/t.offsetWidth:1;return{px:i.map(e=>e.getBoundingClientRect().width/n),scale:n}}_widthsOf(e){return(0,f.JR)(e.grid)}_commitWidths(e,t,i){t.join(" ")!==i.join(" ")&&e.write(t)}_endColumnDrag(e){const t=this._colDrag;t&&(this._colDrag=null,this._colPreview=null,window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp),window.removeEventListener("pointercancel",this._onDragCancel),window.removeEventListener("keydown",this._onDragKey,!0),e&&t.next&&t.next.join(" ")!==t.widths.join(" ")?t.row.write(t.next):t.rowEl.style.gridTemplateColumns=t.template,this._queuePlace())}_renderColumnHandles(){const e=this._resizeRow;if(null===e)return o.s6;const t=this._colPreview??this._widthsOf(e),i=(0,f.U$)(t);return o.qy`${t.slice(1).map((e,n)=>{const a=Math.round(i[n]/(i[n]+i[n+1]||1)*100);return o.qy`<div
        class="col-handle k-row ${this._colDrag?.i===n?"dragging":""}"
        data-i=${n}
        role="separator"
        aria-orientation="vertical"
        tabindex="0"
        aria-label=${(0,h.t)(826,{a:n+1,b:n+2})}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${a}
        aria-valuetext=${(0,h.t)(217,{a:n+1,wa:t[n],b:n+2,wb:t[n+1]})}
        title=${(0,h.t)(316)}
        hidden
        @pointerdown=${this._onHandleDown}
        @keydown=${this._onHandleKey}
        @dblclick=${this._onHandleDblClick}
        @click=${this._stop}
      ></div>`})}`}_placeHover(){const e=this.shadowRoot,t=e?.querySelector(".canvas-inner"),i=e?.querySelector(".hover-frame");if(!t||!i)return;const o=this._hoverEl,n=!!this._hoverSel&&(0,w.V9)(this._hoverSel,this._sel);if(!o||!o.isConnected||n)return void(i.hidden=!0);const a=tl(t)(o.getBoundingClientRect());i.hidden=!1,Object.assign(i.style,{top:a.top-4+"px",left:a.left-4+"px",width:`${a.width+8}px`,height:`${a.height+8}px`})}render(){const e=this._state,t=this.live,i=this.width,n=i.px??this._fillPx,a=null!==i.px&&this._fillPx>0&&this._fillPx<i.px-1?(0,h.t)(3,{px:this._fillPx}):"",s=this._sel,r=e?.config,l=!!r&&(0,w.Ak)((0,w.R9)(r,s)),c=r?`${(0,w.e9)(r,s).title}${l?` · ${(0,h.t)(1221)}`:""}`:"";let d=0,u=0;if("module"===s.kind&&r){const e=s.child?.[s.child.length-1];if(e){const t=(0,w.cv)(r,(0,w.tw)(s));d=e.index,u=(0,$.yZ)(t)?.[e.slot]?.length??0}else d=s.module,u=r.rows[s.row]?.columns[s.col]?.modules?.length??0}const p="module"===s.kind&&0===d,m="module"===s.kind&&d>=u-1,g="module"===s.kind&&!!r&&Z(r,s),f="module"===s.kind&&r?(0,w.cv)(r,s):void 0,v=!!f&&"flow"!==(0,at.xc)(f),b=o.qy`
          <div class="float-bar" role="toolbar" aria-label=${(0,h.t)(585)} hidden>
            ${this._renderLayerBar(c,v)}
            <button type="button" class="icon-btn sm" aria-label=${(0,h.t)(602)} title=${(0,h.t)(603)} ?disabled=${p}
              @click=${e=>this._onBarClick("up",e)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
            <button type="button" class="icon-btn sm" aria-label=${(0,h.t)(599)} title=${(0,h.t)(600)} ?disabled=${m}
              @click=${e=>this._onBarClick("down",e)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
            <span class="sep" aria-hidden="true"></span>
            <button type="button" class="icon-btn sm" aria-label=${(0,h.t)(323)} title=${(0,h.t)(324)}
              @click=${e=>this._onBarClick("duplicate",e)}><ha-icon icon="mdi:content-copy"></ha-icon></button>
            <button type="button" class="icon-btn sm" aria-label=${(0,h.t)(43)}
              title=${g?(0,h.t)(44,{hint:(0,h.t)(417)}):(0,h.t)(43)} ?disabled=${g}
              aria-pressed=${this._connectFrom?"true":"false"}
              @click=${()=>this._connectFrom?this._cancelConnect():this._startConnect()}><ha-icon icon="mdi:transit-connection-variant"></ha-icon></button>
            <button type="button" class="icon-btn sm danger" aria-label=${(0,h.t)(281)} title=${(0,h.t)(282)}
              @click=${e=>this._onBarClick("delete",e)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
          </div>
    `;return o.qy`
      ${this._docked&&!t?o.qy`<div class="bar-dock">${b}</div>`:o.s6}
      <div
        class="canvas ${this._connectFrom?"connecting":""} ${t?"live":""}"
        tabindex=${t?o.s6:"0"}
        role="region"
        aria-label=${t?(0,h.t)(164):(0,h.t)(165,{label:c})}
        aria-describedby=${t?o.s6:this._connectFrom?"connect-hint":"canvas-hint"}
        @click=${this._onGroundClick}
        @contextmenu=${this._onGroundContext}
        @keydown=${this._onKeydown}
        @scroll=${this._queuePlace}
        @pointermove=${this._onPointerMove}
        @pointerleave=${this._onPointerLeave}
      >
        <div class="canvas-inner">
          <div class="device ${i.borderless?"borderless":""}" style="--device-w:${null===i.px?"100%":`${i.px}px`}" @transitionend=${this._queuePlace}>
            <div class="device-label"><span>${(0,h.t)(Xs[i.option])}${n?` · ${n} px${a}`:""}</span>${this._tabState?o.qy`<span class="state-chip" role="status">${(0,h.t)(954,{state:"hover"===this._tabState?(0,h.t)(458):"active"===this._tabState?(0,h.t)(26):(0,h.t)(306)})}</span>`:o.s6}<span class="device-note">${i.canMatch?o.qy`<button type="button" class="btn btn-text btn-sm" @click=${()=>this.dispatchEvent(new CustomEvent("mc-match-view",{bubbles:!0,composed:!0}))}>${(0,h.t)(561)}</button>`:i.note}${i.note||i.canMatch?" · ":""}${(0,h.t)(527)}${t?o.s6:o.qy`<button type="button" class="preview-pause" data-preview-pause aria-pressed=${this._previewPaused?"true":"false"}
                aria-label=${this._previewPaused?(0,h.t)(829):(0,h.t)(725)} @click=${this._togglePreviewPause} @keydown=${this._stop}
                ><ha-icon icon=${this._previewPaused?"mdi:play":"mdi:pause"}></ha-icon></button>`}</span></div>
            ${this._cardError?o.qy`<p class="card-error" role="status">${(0,h.t)(771,{error:this._cardError})}</p>`:o.s6}
            <div class="card-host"></div>
          </div>
          ${t?o.s6:o.qy`<div class="hover-frame ${el(this._hoverSel??{kind:"module",row:0,col:0,module:0})}"
            hidden aria-hidden="true">${this._hoverLabel?o.qy`<span class="tag">${this._hoverLabel}</span>`:o.s6}</div>
          <div class="sel-frame ${el(s)}" hidden aria-hidden="true">
            ${"card"===s.kind?o.s6:o.qy`<span class="tag">${c}</span>`}
            ${"module"===s.kind?o.qy`<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i>`:o.s6}
          </div>
          ${this._renderColumnHandles()}
          ${this._docked?o.s6:b}`}
        </div>
      </div>
      ${this._connectFrom?o.qy`<div class="connect-hint" id="connect-hint" @keydown=${this._onHintKeydown}>
            <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
            <span>${this._connectNote?(0,h.tx)(1283,{note:this._connectNote,key:o.qy`<kbd>Esc</kbd>`}):(0,h.tx)(194,{key:o.qy`<kbd>Esc</kbd>`})}</span>
            <button type="button" class="btn btn-text btn-sm" @click=${this._cancelConnect}>${(0,h.t)(162)}</button>
          </div>`:o.s6}
      <p class="sr-only" id="connect-status" role="status">${this._connectFrom?this._connectNote?(0,h.t)(1282,{note:this._connectNote}):(0,h.t)(193):""}</p>
      ${t?o.s6:o.qy`<p class="canvas-hint" id="canvas-hint" ?hidden=${!!this._connectFrom}>
        ${(0,h.tx)(192,{move:o.qy`<kbd>Alt</kbd> + <kbd>${(0,h.t)(1115)}</kbd>/<kbd>${(0,h.t)(315)}</kbd>`,remove:o.qy`<kbd>${(0,h.t)(279)}</kbd>`,menu:o.qy`<kbd>Shift</kbd> + <kbd>F10</kbd>`})}
      </p>`}
      <p class="status-capsule" role="status" ?data-on=${!!this._status&&!this._connectFrom}>${this._status}</p>
      ${this._itemMenu.render()}
      ${this._press?o.qy`<span class="press-ring" style=${`left:${this._press.x}px;top:${this._press.y}px`} aria-hidden="true"></span>`:o.s6}
      ${this._sheet?o.qy`<mc-layers-sheet .items=${this._layers.sheetItems(this._sheet.list)} .x=${this._sheet.x} .y=${this._sheet.y} .holdOpen=${!!this._sheet.hold} @pick=${this._pickFromSheet} @close=${this._closeSheet}></mc-layers-sheet>`:o.s6}
    `}_renderLayerBar(e,t){if("module"!==this._sel.kind)return o.s6;const i=this._hereCount,n=this._state?(0,w.cv)(this._state.config,this._sel):void 0,a=n?(0,at.xc)(n):"flow";return o.qy`${t?o.qy`<span class="fb-name">${"background"===a?(0,h.t)(1279,{name:e}):(0,h.t)(1280,{name:e})}</span>`:o.s6}
      ${i>1?o.qy`<button type="button" class="btn btn-text btn-sm" data-act="layers-here" aria-haspopup="dialog" @click=${e=>this._openSheetFromBar(e)}>${(0,h.t)(506,{n:i})}</button>
            <button type="button" class="icon-btn sm" data-act="layer-above" aria-label=${(0,h.t)(893)} title=${(0,h.t)(893)} @click=${()=>this._stepLayer(-1)}><ha-icon icon="mdi:chevron-up-box-outline"></ha-icon></button>
            <button type="button" class="icon-btn sm" data-act="layer-below" aria-label=${(0,h.t)(894)} title=${(0,h.t)(894)} @click=${()=>this._stepLayer(1)}><ha-icon icon="mdi:chevron-down-box-outline"></ha-icon></button>`:o.s6}
      <button type="button" class="icon-btn sm" data-act="placement" aria-haspopup="menu" aria-label=${(0,h.t)(752)} title=${(0,h.t)(753)} @click=${e=>this._openPlacementMenu(e)}><ha-icon icon="mdi:layers-outline"></ha-icon></button>
      <span class="sep" aria-hidden="true"></span>`}};il.styles=[l.x,vt,o.AH`
      :host {
        position: relative;
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        min-height: 0;
        min-width: 0;
      }
      /* strip above the canvas for the float bar when no spot beside the selection fits; takes room only while docked */
      .bar-dock {
        grid-row: 1;
        display: flex;
        justify-content: safe center;
        padding: 6px 8px;
        overflow-x: auto;
        background: var(--mc-surface);
        border-bottom: 1px solid var(--mc-divider);
      }
      .bar-dock:has(.float-bar[hidden]) {
        display: none;
      }
      .bar-dock .float-bar {
        position: static;
        flex: none;
        max-width: none;
      }
      .canvas {
        grid-row: 2;
        overflow: auto;
        min-height: 0;
        background-color: var(--mc-canvas);
        background-image: radial-gradient(var(--mc-canvas-dot) 1px, transparent 1.2px);
        background-size: 16px 16px;
      }
      /* The canvas always shows a ring when the keyboard is on it; the selection frame inside it marks what is selected. */
      .canvas:focus-visible {
        /* --mc-text-2: non-accent, >= 3:1 against --mc-canvas in light (5.2:1) and dark (6.0:1) */
        outline: 2px solid var(--mc-text-2);
        outline-offset: -2px;
      }
      .canvas-inner {
        position: relative;
        min-height: 100%;
        padding: 56px 24px 96px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .device {
        width: var(--device-w, 400px);
        max-width: 100%;
        transition: width 0.22s ease-out;
      }
      /* panel view: HA draws the card without its border */
      .device.borderless {
        --ha-card-border-width: 0;
      }
      .state-chip {
        padding: 1px 8px;
        border-radius: 999px;
        background: var(--mc-accent-tint);
        color: var(--mc-primary);
        font-weight: 600;
      }
      .device-note {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        text-align: right;
      }
      /* the device may be wider than a narrow canvas (it scrolls sideways): the label, with the preview-pause toggle at its end, stays within the screen and pinned to the left edge while scrolled */
      .device-label {
        position: sticky;
        left: 24px;
        max-width: calc(100vw - 48px);
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
      }
      .preview-pause {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: 44px;
        height: 44px;
        margin: -12px -8px -12px 4px;
        padding: 0;
        border: 0;
        border-radius: 50%;
        background: transparent;
        color: var(--mc-text-2);
        cursor: pointer;
      }
      .preview-pause:hover {
        background: rgba(127, 127, 127, 0.16);
      }
      .preview-pause[aria-pressed='true'] {
        color: var(--mc-text, #212121);
        box-shadow: inset 0 0 0 2px var(--mc-text, #212121);
      }
      .preview-pause:focus-visible {
        outline: 2px solid var(--mc-focus, #03a9f4);
        outline-offset: -2px;
      }
      .card-host {
        cursor: default;
        /* no iOS callout or text selection on a long-press (it opens the item menu) */
        -webkit-touch-callout: none;
        user-select: none;
      }
      /* live: the card behaves as on the dashboard (no menu on a long-press) */
      .canvas.live .card-host {
        -webkit-touch-callout: default;
        user-select: auto;
      }
      /* press and hold cue: a ring under the finger that closes in until the menu opens (500 ms) */
      .press-ring {
        position: fixed;
        z-index: 19;
        width: 64px;
        height: 64px;
        margin: -32px 0 0 -32px;
        box-sizing: border-box;
        border: 3px solid var(--mc-focus, #03a9f4);
        border-radius: 50%;
        background: color-mix(in srgb, var(--mc-focus, #03a9f4) 18%, transparent);
        pointer-events: none;
        animation: mc-press-ring 350ms ease-out forwards;
      }
      @keyframes mc-press-ring {
        from {
          transform: scale(1.5);
          opacity: 0.3;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .press-ring {
          animation: none;
        }
      }
      /* copy / paste feedback: a capsule at the canvas foot (like the connect hint), 3 s */
      .status-capsule {
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 6;
        max-width: calc(100% - 32px);
        margin: 0;
        padding: 6px 12px;
        border-radius: 10px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        box-shadow: var(--mc-shadow-float);
        font-size: 0.8125rem;
        color: var(--mc-text);
        overflow-wrap: anywhere;
      }
      .status-capsule:not([data-on]) {
        /* stays in the tree (a live region must exist before it changes), out of sight */
        clip-path: inset(50%);
        width: 1px;
        height: 1px;
        padding: 0;
        border: 0;
        overflow: hidden;
      }
      .canvas.connecting .card-host {
        cursor: crosshair;
      }
      /* connect mode: a floating capsule at the canvas foot (Float shadow), with Cancel */
      .connect-hint {
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 6;
        display: flex;
        align-items: center;
        gap: 8px;
        max-width: calc(100% - 32px);
        padding: 4px 4px 4px 12px;
        border-radius: 10px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        box-shadow: var(--mc-shadow-float);
        font-size: 0.8125rem;
        color: var(--mc-text);
        --mdc-icon-size: 18px;
      }
      .canvas-hint[hidden] {
        display: none;
      }
      .connect-hint > ha-icon {
        color: var(--mc-accent-ink);
        flex: none;
      }
      .float-bar [aria-pressed='true'] {
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .card-error {
        margin: 0 0 8px;
        font-size: 0.75rem;
        color: var(--mc-error-ink);
        overflow-wrap: anywhere;
      }
      .hover-frame,
      .sel-frame {
        position: absolute;
        pointer-events: none;
      }
      /* Colours per level come from .k-card / .k-row / .k-column / .k-module (--k, --k-fill, --k-ink). */
      .hover-frame {
        z-index: 3;
        border: 1px solid color-mix(in srgb, var(--k) 70%, transparent);
        border-radius: 11px;
      }
      .hover-frame .tag {
        position: absolute;
        left: 0;
        top: -22px;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1.5;
        white-space: nowrap;
        background: var(--mc-surface);
        color: var(--k-ink);
        box-shadow: 0 0 0 1px color-mix(in srgb, var(--k) 55%, transparent);
      }
      .sel-frame {
        z-index: 4;
        border: 2px solid var(--k);
        border-radius: 10px;
        transition: border-color 0.15s ease-out, top 0.2s ease-out, left 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
      }
      .sel-frame .h {
        position: absolute;
        width: 8px;
        height: 8px;
        background: var(--mc-surface);
        border: 2px solid var(--k);
        border-radius: 2px;
      }
      .sel-frame .h.tl { left: -5px; top: -5px; }
      .sel-frame .h.tr { right: -5px; top: -5px; }
      .sel-frame .h.bl { left: -5px; bottom: -5px; }
      .sel-frame .h.br { right: -5px; bottom: -5px; }
      .sel-frame .tag {
        position: absolute;
        left: -2px;
        top: -28px;
        padding: 2px 8px;
        border-radius: 6px;
        background: var(--k-fill);
        color: var(--mc-on-accent);
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1.5;
        white-space: nowrap;
      }
      /* column resize: a 16 px hit strip on the gutter (24 px for touch), a 2 px line and a grip in the row colour */
      .col-handle {
        --col-hit: 16px;
        position: absolute;
        z-index: 5;
        width: var(--col-hit);
        margin-left: calc(var(--col-hit) / -2);
        cursor: col-resize;
        touch-action: none;
        border-radius: 6px;
      }
      .col-handle[hidden] {
        display: none;
      }
      .col-handle::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(50% - 1px);
        width: 2px;
        border-radius: 1px;
        background: color-mix(in srgb, var(--k) 45%, transparent);
        transition: background-color 0.15s ease-out;
      }
      .col-handle::after {
        content: '';
        position: absolute;
        top: 50%;
        left: calc(50% - 4px);
        width: 8px;
        height: 28px;
        margin-top: -14px;
        box-sizing: border-box;
        border-radius: 4px;
        background: var(--mc-surface);
        border: 2px solid var(--k);
      }
      .col-handle:hover::before,
      .col-handle.dragging::before,
      .col-handle:focus-visible::before {
        background: var(--k);
      }
      .col-handle.dragging::after {
        background: var(--k);
      }
      .col-handle:focus-visible {
        outline: 2px solid var(--k);
        outline-offset: 2px;
      }
      @media (pointer: coarse) {
        .col-handle {
          --col-hit: 24px;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .col-handle::before {
          transition: none;
        }
      }
      .float-bar {
        position: absolute;
        z-index: 5;
        display: flex;
        gap: 2px;
        padding: 4px;
        border-radius: 10px;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        box-shadow: var(--mc-shadow-float);
        transition: top 0.2s ease-out, left 0.2s ease-out;
      }
      .float-bar .fb-name {
        align-self: center;
        padding: 0 8px;
        font-size: 0.8125rem;
        font-weight: 600;
        max-width: 240px;
        overflow-wrap: anywhere;
      }
      .float-bar .btn-text {
        white-space: nowrap;
      }
      /* a module behind others or on top: dashed white line over a black inner line, 3:1 on light and dark pictures, no canvas tag */
      .sel-frame[data-layered] {
        border: 2px dashed #fff;
        border-radius: 8px;
        box-shadow: inset 0 0 0 3px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(0, 0, 0, 0.85);
      }
      .sel-frame[data-layered] .tag,
      .sel-frame[data-layered] .h {
        display: none;
      }
      .float-bar .sep {
        width: 1px;
        margin: 4px 2px;
        background: var(--mc-divider);
      }
      .canvas-hint {
        position: absolute;
        left: 16px;
        bottom: 16px;
        z-index: 3;
        max-width: calc(100% - 32px);
        margin: 0;
        padding: 6px 10px;
        font-size: 0.75rem;
        color: var(--mc-text-2);
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius);
      }
      @media (max-width: 640px) {
        .canvas-hint {
          display: none;
        }
        /* Stacked studio: the canvas grows to fit the card; the studio workspace does the scrolling. */
        :host {
          grid-template-rows: auto;
        }
        .canvas {
          overflow: visible;
        }
        .canvas-inner {
          padding: 56px 16px 64px;
        }
      }
      kbd {
        font-family: var(--mc-mono);
        font-size: 0.75rem;
        padding: 0 4px;
        border: 1px solid var(--mc-divider);
        border-radius: 4px;
        background: var(--mc-surface-2);
      }
    `],Hr([(0,n.MZ)({attribute:!1})],il.prototype,"stateManager",void 0),Hr([(0,n.MZ)({attribute:!1})],il.prototype,"hass",void 0),Hr([(0,n.MZ)({attribute:!1})],il.prototype,"width",void 0),Hr([(0,n.MZ)({type:Boolean,attribute:!1})],il.prototype,"live",void 0),Hr([(0,n.wk)()],il.prototype,"_fillPx",void 0),Hr([(0,n.wk)()],il.prototype,"_state",void 0),Hr([(0,n.wk)()],il.prototype,"_hoverLabel",void 0),Hr([(0,n.wk)()],il.prototype,"_tabState",void 0),Hr([(0,n.wk)()],il.prototype,"_previewPaused",void 0),Hr([(0,n.wk)()],il.prototype,"_hoverSel",void 0),Hr([(0,n.wk)()],il.prototype,"_cardError",void 0),Hr([(0,n.wk)()],il.prototype,"_connectFrom",void 0),Hr([(0,n.wk)()],il.prototype,"_connectNote",void 0),Hr([(0,n.wk)()],il.prototype,"_colPreview",void 0),Hr([(0,n.wk)()],il.prototype,"_status",void 0),Hr([(0,n.wk)()],il.prototype,"_press",void 0),Hr([(0,n.wk)()],il.prototype,"_sheet",void 0),Hr([(0,n.wk)()],il.prototype,"_hereCount",void 0),Hr([(0,n.wk)()],il.prototype,"_docked",void 0),il=Hr([(0,n.EM)("mc-studio-canvas")],il);var ol=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const nl=[{id:"form",label:401},{id:"yaml",label:1188}];function al(e,t,i){return{ArrowRight:(t+1)%i,ArrowLeft:(t-1+i)%i,Home:0,End:i-1}[e]}let sl=class extends o.WF{constructor(){super(...arguments),this.open=!1,this._view={kind:"unknown",reason:""},this._override=null,this._showLayers=!1,this._live=!1,this._swallowCancel=!1,this._focusSel=null,this._layersForRename=!1,this._onMatchView=()=>{this._override=null,this._focusSel='.devices [aria-checked="true"]'},this._close=()=>{this.dispatchEvent(new CustomEvent("studio-close",{bubbles:!0,composed:!0}))},this._onEditModule=()=>{this._showLayers&&window.matchMedia?.("(max-width: 900px)").matches&&(this._showLayers=!1),this.inspector?.focusInspector()},this._onRenameRequest=async e=>{const t=e.detail;t&&(!this._showLayers&&window.matchMedia?.("(max-width: 900px)").matches&&(this._showLayers=!0,this._layersForRename=!0),await this.updateComplete,this.shadowRoot?.querySelector("mc-structure-outline")?.startRename((0,w.iA)(t.sel),t.returnFocus))},this._onRenameDone=()=>{this._layersForRename&&(this._showLayers=!1),this._layersForRename=!1},this._onStatus=e=>{const t=e.detail?.message;t&&this.shadowRoot?.querySelector("mc-studio-canvas")?.showStatus(t)},this._onCancel=e=>{e.preventDefault(),this._live||this._swallowCancel?this._live&&this._setLive(!1):this._close()},this._onMoreInfo=e=>{e.stopPropagation();const t=this._moreInfoHost,i=e.detail?.entityId;this._live&&t&&i&&lr(t,this.hass,i)},this._onNativeClose=e=>{e.target===e.currentTarget&&this.open&&this._close()},this._onKeydown=e=>{e.stopPropagation();const t=this.stateManager;if(!t||e.defaultPrevented)return;const i=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&!e.altKey&&("z"===i||"y"===i)){if(function(e){const t=e.composedPath()[0];return t instanceof HTMLElement&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable)}(e))return;if(e.preventDefault(),this._live)return;return void("y"===i||e.shiftKey?t.redo():t.undo())}if("Escape"!==e.key)return;if(!this._live&&this._showLayers&&window.matchMedia?.("(max-width: 900px)").matches)return e.preventDefault(),this._showLayers=!1,void(this._focusSel=".layers-toggle");const o=e.composedPath();o.slice(0,Math.max(0,o.indexOf(e.currentTarget))).some(e=>e instanceof HTMLDialogElement||e instanceof HTMLElement&&"dialog"===e.getAttribute("role"))?e.preventDefault():this._live&&(e.preventDefault(),this._setLive(!1),this._swallowCancel=!0,setTimeout(()=>{this._swallowCancel=!1},0))}}get inspector(){return this.shadowRoot?.querySelector("mc-inspector")??null}get _dialog(){return this.shadowRoot?.querySelector("dialog")??null}connectedCallback(){super.connectedCallback(),this.stateManager&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0,this._subscribedTo=void 0}willUpdate(e){e.has("stateManager")&&this.stateManager!==this._subscribedTo&&this._subscribe(),(e.has("open")&&this.open||e.has("lovelace"))&&this._detect(),e.has("open")&&(this._live=!1)}_detect(){const e=this.stateManager?.getState().config;this._view=function(e,t,i){const o=e?.views;if(!Array.isArray(o)||!o.length)return or(nr());let n;try{n=function(e,t){const i=t.split("/").filter(Boolean);if(i.length<=1)return e[0];const o=decodeURIComponent(i[i.length-1]);return e.find(e=>"string"==typeof e.path&&e.path===o)||(/^\d+$/.test(o)?e[Number(o)]:void 0)}(o,t)}catch{return or(nr())}if(!n||"object"!=typeof n||n.strategy)return or(nr());const a="string"==typeof n.type&&n.type?n.type:!0===n.panel?"panel":"masonry";if("panel"===a||"masonry"===a)return{kind:a,reason:""};if("sections"===a){const e=i?.grid_options,t=e?.columns;return{kind:"sections",reason:"",columns:"full"===t?12:"number"==typeof t&&t>=1&&t<=12?Math.round(t):void 0,span:1}}if("sidebar"===a){const e=i?.view_layout?.position;return{kind:"sidebar",reason:"",sidebar:"sidebar"===e}}return or((0,h.t)(1161,{type:a}))}(this.lovelace,window.location.pathname,e)}get _width(){return this._override?(e=this._override,t=this._view,{option:e,px:"panel"===e?null:er[e],note:"unknown"===t.kind?t.reason||nr():"",canMatch:"unknown"!==t.kind,borderless:!1}):ar(this._view);var e,t}_subscribe(){this._unsubscribe?.(),this._subscribedTo=this.stateManager,this._unsubscribe=this.stateManager?.subscribe(e=>{this._state=e})}updated(e){if(e.has("open")&&this._syncOpen(),e.has("hass")){const e=this._moreInfoHost;e&&function(e,t){const i=e.querySelector(sr);i&&(i.hass=t)}(e,this.hass)}this._focusSel&&(this.shadowRoot?.querySelector(this._focusSel)?.focus(),this._focusSel=null)}_syncOpen(){this._closeMoreInfo();const e=this._dialog;if(e)if(this.open&&!e.open){e.showModal(),this._showLayers=!1;const t=this.shadowRoot?.querySelector("mc-studio-canvas");t?.updateComplete.then(()=>t.focusCanvas())}else!this.open&&e.open&&e.close()}_setLive(e){e!==this._live&&(this._live=e,this._focusSel=".preview-toggle",e||this._closeMoreInfo())}get _moreInfoHost(){return this.shadowRoot?.querySelector(".more-info-host")??null}_closeMoreInfo(){const e=this._moreInfoHost;e&&hr(e)}_onModeKeydown(e,t){const i=al(e.key,nl.findIndex(e=>e.id===t),nl.length);void 0!==i&&(e.preventDefault(),this._focusSel='.mode [aria-selected="true"]',this.stateManager?.setEditorMode(nl[i].id))}_setWidth(e){e!==this._width.option&&(this._override=e)}_onDeviceKeydown(e){const t=al(e.key,tr.indexOf(this._width.option),tr.length);void 0!==t&&(e.preventDefault(),this._setWidth(tr[t]),this._focusSel='.devices [aria-checked="true"]')}_renderTopbar(e,t){const i=this.stateManager,n=this._live;return o.qy`
      <header class="topbar">
        <div class="grp">
          <button type="button" class="btn btn-secondary btn-sm" @click=${this._close}>
            <ha-icon icon="mdi:arrow-left"></ha-icon>${(0,h.t)(121)}
          </button>
          <button
            type="button"
            class="icon-btn layers-toggle"
            aria-label=${this._showLayers?(0,h.t)(444):(0,h.t)(934)}
            title=${(0,h.t)(505)}
            aria-controls="layers"
            aria-expanded=${this._showLayers?"true":"false"}
            ?hidden=${n}
            @click=${()=>{this._showLayers=!this._showLayers}}
          >
            <ha-icon icon="mdi:layers-outline"></ha-icon>
          </button>
          <span class="vr" aria-hidden="true"></span>
          <div class="title">
            <strong>${e.config.name?.trim()||(0,h.t)(1114)}</strong>
            <mc-template-bar compact .config=${e.config} .hass=${this.hass} .disabled=${n} class=${n?"dim":""}></mc-template-bar>
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <div class="seg mode" role="tablist" aria-label=${(0,h.t)(339)}>
            ${nl.map(e=>{const a=e.id===t;return o.qy`<button
                type="button"
                role="tab"
                aria-selected=${a?"true":"false"}
                tabindex=${a?"0":"-1"}
                ?disabled=${n}
                @click=${()=>i.setEditorMode(e.id)}
                @keydown=${e=>this._onModeKeydown(e,t)}
              >${(0,h.t)(e.label)}</button>`})}
          </div>
          <div class="seg devices" role="radiogroup" aria-label=${(0,h.t)(163)} ?hidden=${"form"!==t&&!n}>
            ${tr.map(e=>{const t=e===this._width.option;return o.qy`<button
                type="button"
                role="radio"
                aria-checked=${t?"true":"false"}
                tabindex=${t?"0":"-1"}
                aria-label=${(0,h.t)(ir[e])}
                title=${(0,h.t)(ir[e])}
                @click=${()=>this._setWidth(e)}
                @keydown=${this._onDeviceKeydown}
              >${(0,h.t)(Xs[e])}</button>`})}
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp end">
          <button type="button" class="btn btn-secondary btn-sm preview-toggle" aria-pressed=${n?"true":"false"}
            title=${n?(0,h.t)(769):(0,h.t)(773)}
            @click=${()=>this._setLive(!n)}>
            <ha-icon icon=${n?"mdi:play-circle":"mdi:play-circle-outline"}></ha-icon><span class="lbl">${(0,h.t)(768)}</span>
          </button>
          <span class="live-chip" aria-hidden="true" ?hidden=${!n}>
            <ha-icon icon="mdi:flash-outline"></ha-icon>${(0,h.t)(774)}
          </span>
          <span class="sr-only" role="status" aria-live="polite">${n?(0,h.t)(774):""}</span>
          <button type="button" class="icon-btn" aria-label=${(0,h.t)(1110)} title=${(0,h.t)(1110)}
            ?disabled=${n||!i.canUndo()} @click=${()=>i.undo()}><ha-icon icon="mdi:undo"></ha-icon></button>
          <button type="button" class="icon-btn" aria-label=${(0,h.t)(786)} title=${(0,h.t)(786)}
            ?disabled=${n||!i.canRedo()} @click=${()=>i.redo()}><ha-icon icon="mdi:redo"></ha-icon></button>
          <button type="button" class="btn btn-primary btn-sm" @click=${this._close}>
            <ha-icon icon="mdi:check"></ha-icon>${(0,h.t)(310)}
          </button>
        </div>
      </header>
    `}render(){const e=this._state,t=this.stateManager,i="yaml"===e?.editorMode?"yaml":"form",n=e?(0,w.TV)(e.config):0,a=this._live;return o.qy`
      <dialog
        class="studio ${this._showLayers?"show-layers":""}"
        aria-label=${(0,h.t)(552)}
        @cancel=${this._onCancel}
        @close=${this._onNativeClose}
        @keydown=${this._onKeydown}
      >
        ${e&&t&&this.open?o.qy`
              ${this._renderTopbar(e,i)}
              <div class="workspace ${a?"live":""}">
                <nav class="panel layers" id="layers" aria-label=${(0,h.t)(505)} ?hidden=${a} ?inert=${a}>
                  <div class="panel-title">
                    <h2>${(0,h.t)(505)}</h2>
                    <span class="chip is-count">${(0,h.t)(1249,{mods:n})}</span>
                  </div>
                  <mc-structure-outline .stateManager=${t} variant="layers" @mc-edit-module=${this._onEditModule}
                    @mc-status=${this._onStatus} @mc-rename-done=${this._onRenameDone}></mc-structure-outline>
                </nav>
                <div class="center">
                  ${"form"===i||a?o.qy`<mc-studio-canvas .stateManager=${t} .hass=${this.hass} .width=${this._width} .live=${a} @mc-match-view=${this._onMatchView}
                        @mc-edit-module=${this._onEditModule} @mc-rename-request=${this._onRenameRequest}
                        @mc-studio-more-info=${this._onMoreInfo}></mc-studio-canvas>`:o.s6}
                  ${"yaml"===i?o.qy`
                        <div class="center-alt" ?hidden=${a}>
                          <div class="yaml-view"><mc-yaml-editor .stateManager=${t} .hass=${this.hass}></mc-yaml-editor></div>
                        </div>
                      `:o.s6}
                </div>
                <aside class="panel inspector" aria-label=${(0,h.t)(491)} ?hidden=${a} ?inert=${a}>
                  <mc-inspector .stateManager=${t} .hass=${this.hass} variant="studio"></mc-inspector>
                </aside>
              </div>
            `:o.qy``}
        <slot></slot>
        <div class="more-info-host"></div>
      </dialog>
    `}};sl.styles=[l.x,Js.ZN,o.AH`
      :host {
        display: contents;
      }
      dialog.studio {
        width: 100vw;
        height: 100vh;
        height: 100dvh;
        max-width: none;
        max-height: none;
        margin: 0;
        padding: 0;
        border: 0;
        inset: 0;
        background: var(--mc-ground);
        color: var(--mc-text);
        font-size: 0.875rem;
        line-height: 1.5;
        overflow: hidden;
        opacity: 0;
        transform: scale(0.985);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
      }
      dialog.studio[open] {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        opacity: 1;
        transform: none;
      }
      @starting-style {
        dialog.studio[open] {
          opacity: 0;
          transform: scale(0.985);
        }
      }
      dialog.studio::backdrop {
        background: transparent;
      }
      @media (prefers-reduced-motion: reduce) {
        dialog.studio {
          transition: none;
        }
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
      .title strong {
        font-size: 1rem;
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .vr {
        width: 1px;
        height: 24px;
        background: var(--mc-divider);
      }
      .spacer {
        flex: 1;
      }
      .layers-toggle {
        display: none;
      }
      .more-info-host {
        display: contents;
      }

      /* Preview: the pressed state uses the float bar's accent pair; the icon and the chip carry it too, not colour alone */
      .preview-toggle[aria-pressed='true'] {
        background: var(--mc-accent-tint);
        color: var(--mc-accent-ink);
      }
      .live-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        min-width: 0;
        padding: 2px 10px;
        border-radius: 999px;
        font-size: 0.8125rem;
        font-weight: 500;
        background: var(--mc-warn-tint);
        color: var(--mc-warn-ink);
        --mdc-icon-size: 16px;
      }
      .live-chip[hidden] {
        display: none;
      }
      mc-template-bar.dim,
      .mode button:disabled {
        opacity: 0.5;
      }
      .mode button:disabled {
        cursor: default;
      }

      /* workspace */
      .workspace {
        position: relative;
        display: grid;
        grid-template-columns: 240px minmax(0, 1fr) 340px;
        min-height: 0;
      }
      .panel {
        background: var(--mc-surface);
        min-height: 0;
        min-width: 0;
        overflow-y: auto;
      }
      .layers {
        border-right: 1px solid var(--mc-divider);
        padding: 12px 8px;
      }
      .inspector {
        border-left: 1px solid var(--mc-divider);
        overflow: hidden;
      }
      .panel-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 4px 8px 8px;
      }
      .panel-title h2 {
        margin: 0;
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--mc-text-2);
      }
      .center {
        position: relative;
        display: grid;
        grid-template-rows: minmax(0, 1fr);
        min-height: 0;
        min-width: 0;
      }
      .center-alt {
        padding: 24px;
        overflow: auto;
        min-height: 0;
      }
      .yaml-view {
        max-width: 760px;
        margin: 0 auto;
        background: var(--mc-surface);
        border: 1px solid var(--mc-divider);
        border-radius: var(--mc-radius-lg);
        overflow: hidden;
      }

      /* Preview: one column, the canvas takes the width; layers and inspector stay mounted, out of the layout */
      .workspace.live {
        grid-template-columns: minmax(0, 1fr);
      }
      .workspace.live .layers,
      .workspace.live .inspector,
      .layers-toggle[hidden] {
        display: none;
      }

      @media (max-width: 1180px) {
        .workspace {
          grid-template-columns: 220px minmax(0, 1fr) 320px;
        }
      }
      @media (max-width: 900px) {
        .workspace {
          grid-template-columns: minmax(0, 1fr) min(340px, 100%);
        }
        .layers {
          display: none;
          position: absolute;
          z-index: 7;
          left: 0;
          top: 0;
          bottom: 0;
          width: 260px;
          box-shadow: var(--mc-shadow-float);
        }
        .show-layers .layers {
          display: block;
        }
        .layers-toggle {
          display: inline-grid;
        }
        /* the label drops out of sight, the button keeps its name; the notice takes its own line under the buttons */
        .preview-toggle .lbl {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        .grp.end {
          flex-wrap: wrap;
        }
        .live-chip {
          order: 9;
          flex: 1 0 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      @media (max-height: 480px) {
        .inspector {
          overflow-y: auto;
        }
      }
      @media (max-width: 640px) {
        .workspace {
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: auto auto;
          align-content: start;
          overflow-y: auto;
        }
        .center {
          grid-template-rows: auto;
          min-height: 320px;
        }
        .inspector {
          border-left: 0;
          border-top: 1px solid var(--mc-divider);
          overflow: visible;
        }
        .layers {
          max-width: 100%;
        }
      }
    `],ol([(0,n.MZ)({attribute:!1})],sl.prototype,"stateManager",void 0),ol([(0,n.MZ)({attribute:!1})],sl.prototype,"hass",void 0),ol([(0,n.MZ)({type:Boolean})],sl.prototype,"open",void 0),ol([(0,n.MZ)({attribute:!1})],sl.prototype,"lovelace",void 0),ol([(0,n.wk)()],sl.prototype,"_state",void 0),ol([(0,n.wk)()],sl.prototype,"_view",void 0),ol([(0,n.wk)()],sl.prototype,"_override",void 0),ol([(0,n.wk)()],sl.prototype,"_showLayers",void 0),ol([(0,n.wk)()],sl.prototype,"_live",void 0),sl=ol([(0,n.EM)("mc-studio")],sl);var rl=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const ll={content:231,controls:232,layout:507,advanced:56},cl=e=>e in ll?(0,h.t)(ll[e]):e;let dl=class extends o.WF{constructor(){super(...arguments),this._windowCtrl=new Ue.HK(this,()=>this._onClose()),this.mode="add",this._searchQuery="",this._category="all"}render(){const e="replace"===this.mode,t=this._searchQuery?_.s.search((0,h.A)(this._searchQuery),e=>(0,h.A)((0,Gt.t)(e))):_.s.getAll(),i=this.types?t.filter(e=>this.types.includes(e.metadata.type)):t,n=new Map;for(const e of r.cq){if("all"!==this._category&&this._category!==e)continue;const t=i.filter(t=>t.metadata.category===e).map(e=>e.metadata);t.length>0&&n.set(e,t)}const a=["all",...r.cq.filter(e=>!this.types||i.some(t=>t.metadata.category===e))];return o.qy`
      ${(0,Ue.bU)(e?(0,h.t)(804):(0,h.t)(45),()=>this._onClose(),"m",o.qy`
          <div class="mc-picker-search">
            ${(0,Ue.LW)((0,h.t)(875),this._searchQuery,e=>{this._searchQuery=e})}
            <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(587)}>
              ${a.map(e=>o.qy`
                  <button
                    type="button"
                    role="radio"
                    aria-checked=${this._category===e?"true":"false"}
                    @click=${()=>{this._category=e}}
                  >
                    ${"all"===e?(0,h.t)(62):cl(e)}
                  </button>
                `)}
            </div>
          </div>
          <div class="mc-picker-list">
            ${0===n.size?o.qy`
              <div class="mc-picker-empty">
                ${this._searchQuery?(0,h.t)(641,{query:this._searchQuery}):(0,h.t)(640)}
              </div>
            `:Array.from(n.entries()).map(([t,i])=>o.qy`
                ${"all"===this._category?o.qy`<div class="mc-picker-category">${cl(t)}</div>`:""}
                ${i.map(t=>o.qy`
                    <button
                      type="button"
                      class="mc-picker-item"
                      @click=${()=>this._onSelect(t)}
                      aria-label=${e?(0,h.t)(803,{name:(0,Gt.t)(t.name)}):(0,h.t)(54,{name:(0,Gt.t)(t.name)})}
                    >
                      <span class="mc-picker-item-icon"><ha-icon icon=${t.icon}></ha-icon></span>
                      <span class="mc-picker-item-content">
                        <span class="mc-picker-item-name">${(0,Gt.t)(t.name)}</span>
                        <span class="mc-picker-item-desc">${(0,Gt.t)(t.description)}</span>
                      </span>
                    </button>
                  `)}
              `)}
          </div>
      `)}
    `}_onSelect(e){this.dispatchEvent(new CustomEvent("module-selected",{bubbles:!0,composed:!0,detail:{type:e.type}}))}_onClose(){this.dispatchEvent(new CustomEvent("mc-picker-close",{bubbles:!0,composed:!0}))}};dl.styles=[l.x,Xe.fz],rl([(0,n.MZ)()],dl.prototype,"mode",void 0),rl([(0,n.MZ)({attribute:!1})],dl.prototype,"types",void 0),rl([(0,n.wk)()],dl.prototype,"_searchQuery",void 0),rl([(0,n.wk)()],dl.prototype,"_category",void 0),dl=rl([(0,n.EM)("mc-module-selector")],dl);var hl=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let ul=class extends o.WF{constructor(){super(...arguments),this._windowCtrl=new Ue.HK(this,()=>this._close()),this.mode="create",this._templateName="",this._templateDescription="",this._searchQuery="",this._error="",this._confirmLoad=null,this._device="",this._showOverwrite=!1,this._templates={},this._loading=!0,this._saving=!1,this._editingTemplate=null,this._editName="",this._editDescription=""}connectedCallback(){super.connectedCallback(),this._loadTemplates()}willUpdate(e){e.has("_confirmLoad")&&(this._device="")}_focusQuestion(){const e=this.shadowRoot?.querySelector(".mc-template-device mc-entity-picker");e?.updateComplete.then(()=>e.focusInput?.())}updated(e){super.updated(e),e.has("_confirmLoad")&&this._confirmLoad&&this._focusQuestion(),e.has("hass")&&this.hass&&0===Object.keys(this._templates).length&&!this._loading&&this._loadTemplates()}async _loadTemplates(){this._loading=!0;try{if(this.hass){const e=await this.hass.callWS({type:"magic_card_utils/get_templates"});this._templates=e.templates||{}}}catch{this._templates={},this._error=(0,h.t)(551)}this._loading=!1}async _saveTemplate(e,t){this._saving=!0;try{return this.hass?(await this.hass.callWS({type:"magic_card_utils/save_template",name:e,template:t}),this._templates={...this._templates,[e]:t},this._saving=!1,!0):(this._error=(0,h.t)(452),this._saving=!1,!1)}catch{return this._error=(0,h.t)(379),this._saving=!1,!1}}async _deleteTemplate(e){try{if(!this.hass)return!1;await this.hass.callWS({type:"magic_card_utils/delete_template",name:e});const t={...this._templates};return delete t[e],this._templates=t,!0}catch{return this._error=(0,h.t)(378),!1}}_close(){this.dispatchEvent(new CustomEvent("mc-picker-close",{bubbles:!0,composed:!0}))}async _handleCreateSave(){const e=this._templateName.trim();if(!e)return void(this._error=(0,h.t)(1028));if(this._templates[e]&&!this._showOverwrite)return void(this._showOverwrite=!0);if(!this.config)return void(this._error=(0,h.t)(629));const t={config:me(this.config)},i=this._templateDescription.trim();if(i&&(t.description=i),await this._saveTemplate(e,t)){const t=(0,c.G)(this.config);t.template=e,this.dispatchEvent(new CustomEvent("template-selected",{detail:{config:t},bubbles:!0,composed:!0})),this._close()}}_handleLoadConfirm(e){const t=this._templates[e];if(!t)return;const i=(0,c.G)(t.config);delete i.entity;const o={...i,...this.config?(0,a.uU)(this.config):{}};o.type="custom:magic-card",o.template=e,this._device&&(o.entity=this._device),this.dispatchEvent(new CustomEvent("template-selected",{detail:{config:o},bubbles:!0,composed:!0})),this._close()}async _handleDelete(e){await this._deleteTemplate(e),this._confirmLoad===e&&(this._confirmLoad=null),this._editingTemplate===e&&(this._editingTemplate=null)}_startEdit(e){const t=this._templates[e];this._editingTemplate=e,this._editName=e,this._editDescription=t?.description||"",this._confirmLoad=null}_cancelEdit(){this._editingTemplate=null,this._editName="",this._editDescription=""}async _saveEdit(){if(!this._editingTemplate||!this.hass)return;const e=this._editingTemplate,t=this._editName.trim();if(!t)return void(this._error=(0,h.t)(1028));const i=this._templates[e];if(!i)return;const o={...i,description:this._editDescription.trim()||void 0};if(t!==e){if(this._templates[t])return void(this._error=(0,h.t)(20,{name:t}));await this._deleteTemplate(e)}await this._saveTemplate(t,o)&&(this._editingTemplate=null,this._editName="",this._editDescription="",this._error="")}_getFilteredTemplates(){const e=Object.keys(this._templates).sort((e,t)=>e.localeCompare(t));if(!this._searchQuery)return e;const t=this._searchQuery.toLowerCase();return e.filter(e=>e.toLowerCase().includes(t))}render(){const e="create"===this.mode?(0,h.t)(252):(0,h.t)(530);return o.qy`
      ${(0,Ue.bU)(e,()=>this._close(),"s",o.qy`${"create"===this.mode?this._renderCreate():this._renderLink()}`)}
    `}_renderCreate(){return o.qy`
      <div class="mc-template-form">
        <div class="field">
          <div class="field-head"><label for="tpl-name">${(0,h.t)(1027)}</label></div>
          <input
            id="tpl-name"
            class="input"
            type="text"
            .value=${this._templateName}
            @input=${e=>{this._templateName=e.target.value,this._error="",this._showOverwrite=!1}}
          />
        </div>
        <div class="field">
          <div class="field-head"><label for="tpl-desc">${(0,h.t)(298)}</label></div>
          <textarea
            id="tpl-desc"
            class="input"
            .value=${this._templateDescription}
            @input=${e=>{this._templateDescription=e.target.value}}
          ></textarea>
        </div>
        ${this._error?o.qy`<div class="mc-template-error" role="alert">${this._error}</div>`:o.s6}
        ${this._showOverwrite?o.qy`
              <div class="mc-template-overwrite">
                ${(0,h.t)(21,{name:this._templateName.trim()})}
              </div>
            `:o.s6}
      </div>
      <div class="mc-picker-footer" slot="footer">
        <button type="button" class="btn btn-secondary" @click=${this._close}>${(0,h.t)(162)}</button>
        ${this._showOverwrite?o.qy`<button type="button" class="btn btn-primary" ?disabled=${this._saving} @click=${this._handleCreateSave}>${(0,h.t)(709)}</button>`:o.qy`<button type="button" class="btn btn-primary" ?disabled=${!this._templateName.trim()||this._saving} @click=${this._handleCreateSave}>${(0,h.t)(860)}</button>`}
      </div>
    `}_renderEditForm(){return o.qy`
      <div class="mc-template-edit-form">
        <div class="field">
          <div class="field-head"><label for="tpl-edit-name">${(0,h.t)(1027)}</label></div>
          <input
            id="tpl-edit-name"
            class="input"
            type="text"
            .value=${this._editName}
            @input=${e=>{this._editName=e.target.value,this._error=""}}
            @click=${e=>e.stopPropagation()}
          />
        </div>
        <div class="field">
          <div class="field-head"><label for="tpl-edit-desc">${(0,h.t)(298)}</label></div>
          <textarea
            id="tpl-edit-desc"
            class="input"
            .value=${this._editDescription}
            @input=${e=>{this._editDescription=e.target.value}}
            @click=${e=>e.stopPropagation()}
          ></textarea>
        </div>
        ${this._error?o.qy`<div class="mc-template-error" role="alert">${this._error}</div>`:o.s6}
        <div class="mc-template-edit-actions">
          <button type="button" class="btn btn-secondary btn-sm" @click=${this._cancelEdit}>${(0,h.t)(162)}</button>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            ?disabled=${!this._editName.trim()||this._saving}
            @click=${this._saveEdit}
          >
            ${(0,h.t)(860)}
          </button>
        </div>
      </div>
    `}_asksDevice(e){const t=this._templates[e]?.config.rows;return!(!this.config||"string"==typeof(0,an.DH)(this.config.entity)||!Array.isArray(t))&&function(e){const t=e=>un(e.type)&&void 0===(0,an.DH)(e.entity)&&!1!==_.s.get(e.type)?.metadata.inherit||((0,$.yZ)(e)??[]).some(e=>e.some(t));return e.some(t)}(t.flatMap(e=>(e.columns??[]).flatMap(e=>e.modules??[])))}_domainsOf(e){const t=this._templates[e]?.config.rows;return Array.isArray(t)?function(e){const t=new Set,i=e=>{const o=_.s.get(e.type)?.metadata.inherit;o&&o.forEach(e=>t.add(e)),((0,$.yZ)(e)??[]).forEach(e=>e.forEach(i))};return e.forEach(i),[...t]}(t.flatMap(e=>(e.columns??[]).flatMap(e=>e.modules??[]))):[]}_renderLink(){if(this._loading)return o.qy`<div class="mc-picker-loading">${(0,h.t)(540)}</div>`;const e=this._getFilteredTemplates();return o.qy`
      <div class="mc-picker-search">
        ${(0,Ue.LW)((0,h.t)(877),this._searchQuery,e=>{this._searchQuery=e})}
      </div>
      ${this._confirmLoad?o.qy`
            <div class="mc-template-confirm">
              <div class="mc-template-confirm-text">
                ${(0,h.t)(529,{name:this._confirmLoad})}
              </div>
              ${this._asksDevice(this._confirmLoad)?o.qy`<div class="mc-template-device">
                    <p class="mc-template-confirm-text">${(0,h.t)(1172)}</p>
                    <mc-entity-picker
                      .hass=${this.hass}
                      .value=${this._device}
                      .label=${(0,h.t)(1172)}
                      .placeholder=${(0,h.t)(730)}
                      .strict=${!0}
                      .preferred=${this._domainsOf(this._confirmLoad)}
                      @value-changed=${e=>{this._device=e.detail.value}}
                    ></mc-entity-picker>
                    <p class="help">${(0,h.t)(1087)}</p>
                  </div>`:o.s6}
              <div class="mc-template-confirm-actions">
                <button type="button" class="btn btn-secondary btn-sm" @click=${()=>{this._confirmLoad=null}}>${(0,h.t)(162)}</button>
                <button type="button" class="btn btn-primary btn-sm" @click=${()=>this._handleLoadConfirm(this._confirmLoad)}>${(0,h.t)(528)}</button>
              </div>
            </div>
          `:o.s6}
      ${this._editingTemplate?this._renderEditForm():o.s6}
      <div class="mc-picker-list">
        ${e.length>0?e.map(e=>o.qy`
                <div
                  class="mc-picker-item ${this._confirmLoad===e?"selected":""}"
                  role="button"
                  tabindex="0"
                  @click=${()=>{this._confirmLoad=e}}
                  @keydown=${t=>{t.target!==t.currentTarget||"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._confirmLoad=e)}}
                >
                  <span class="mc-picker-item-icon"><ha-icon icon="mdi:file-document-outline"></ha-icon></span>
                  <span class="mc-picker-item-content">
                    <span class="mc-picker-item-name">${e}</span>
                    ${this._templates[e]?.description?o.qy`<span class="mc-picker-item-meta">${this._templates[e].description}</span>`:o.s6}
                  </span>
                  <span class="mc-picker-item-actions">
                    <button
                      type="button"
                      class="icon-btn sm"
                      title=${(0,h.t)(336)}
                      aria-label=${(0,h.t)(337,{name:e})}
                      @click=${t=>{t.stopPropagation(),this._startEdit(e)}}
                    >
                      <ha-icon icon="mdi:pencil-outline"></ha-icon>
                    </button>
                    <button
                      type="button"
                      class="icon-btn sm danger"
                      title=${(0,h.t)(295)}
                      aria-label=${(0,h.t)(296,{name:e})}
                      @click=${t=>{t.stopPropagation(),this._handleDelete(e)}}
                    >
                      <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </button>
                  </span>
                </div>
              `):o.qy`<div class="mc-picker-empty">${(0,h.t)(652)}</div>`}
      </div>
      <div class="mc-picker-footer" slot="footer">
        <button type="button" class="btn btn-secondary" @click=${this._close}>${(0,h.t)(162)}</button>
      </div>
    `}};ul.styles=[l.x,Xe.fz,Xe.BP,o.AH`
      .mc-template-device {
        display: grid;
        gap: 6px;
      }
      .mc-template-device > p {
        margin: 0;
      }
    `],hl([(0,n.MZ)({type:String})],ul.prototype,"mode",void 0),hl([(0,n.MZ)({attribute:!1})],ul.prototype,"config",void 0),hl([(0,n.MZ)({attribute:!1})],ul.prototype,"hass",void 0),hl([(0,n.wk)()],ul.prototype,"_templateName",void 0),hl([(0,n.wk)()],ul.prototype,"_templateDescription",void 0),hl([(0,n.wk)()],ul.prototype,"_searchQuery",void 0),hl([(0,n.wk)()],ul.prototype,"_error",void 0),hl([(0,n.wk)()],ul.prototype,"_confirmLoad",void 0),hl([(0,n.wk)()],ul.prototype,"_device",void 0),hl([(0,n.wk)()],ul.prototype,"_showOverwrite",void 0),hl([(0,n.wk)()],ul.prototype,"_templates",void 0),hl([(0,n.wk)()],ul.prototype,"_loading",void 0),hl([(0,n.wk)()],ul.prototype,"_saving",void 0),hl([(0,n.wk)()],ul.prototype,"_editingTemplate",void 0),hl([(0,n.wk)()],ul.prototype,"_editName",void 0),hl([(0,n.wk)()],ul.prototype,"_editDescription",void 0),ul=hl([(0,n.EM)("mc-template-picker")],ul);var pl=i(4753),ml=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const gl=["config-changed","GUImode-changed","value-changed","ll-rebuild","ll-custom","hass-more-info","hass-action"];let fl=class extends o.WF{constructor(){super(),this._showModuleSelector=!1,this._showTemplatePicker=null,this._linkedTemplate=null,this._showSyncDialog=!1,this._syncDialogCtrl=new Ue.dt(this,()=>this._cancelSync(),{selector:"dialog.mc-sync-dialog",focus:e=>e.querySelector(".btn-primary")?.focus({preventScroll:!0})}),this._studioOpen=!1,this._studioMounted=!1,this._stateManager=new ce(e=>{this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:e}}))}),this._initialTemplateFetched=!1,this._tpl=new Map,this._containEvent=e=>{e.composedPath()[0]!==this&&e.stopPropagation()},this._closeStudio=async()=>{this._studioOpen&&(this._studioOpen=!1,await this.updateComplete,await(this.shadowRoot?.querySelector("mc-studio")?.updateComplete),this.shadowRoot?.querySelector("mc-pane-editor")?.focusStudioButton())},this._onTemplateReapply=e=>{e.stopPropagation();const t=this._stateManager,i=t?.getConfig(),o=e.detail?.resetColumn;if(!i?.template)return;const n=o?()=>t.ownsModuleList(o)&&t.resetItem(o,!0)?t.getConfig():void 0:void 0;this._fetchAndApplyTemplate(i.template,i,n).then(e=>{o&&!e&&this._notify((0,h.t)(245))})},this._sync=e=>{const t=e.config.template,i=t?this._tpl.get(t):void 0;e.templateAnimations!==i?this._stateManager.setTemplateAnimations(i):t&&this.hass&&!this._tpl.has(t)&&t!==this._asked&&(this._asked=t,this._docs(t).catch(()=>{}));const o=(0,g.$C)(e.config);this.hass&&o.icons&&(0,g.fZ)(this.hass),this.hass&&o.shapes&&(0,g.Zz)(this.hass),this.hass&&e.config.custom_animations&&(0,R.T_)().ensure(this.hass)},this._handleAddRow=()=>{this._linkedTemplate?(this._pendingSyncAction=()=>this._stateManager.addRow("1"),this._showSyncDialog=!0):this._stateManager.addRow("1")},this._cancelSync=()=>{this._showSyncDialog=!1,this._pendingSyncAction=void 0},this._handleSyncNo=()=>{this._pendingSyncAction?.(),this._showSyncDialog=!1,this._pendingSyncAction=void 0},this._handleSyncYes=async()=>{this._pendingSyncAction?.(),this._showSyncDialog=!1,this._pendingSyncAction=void 0,await this._saveToTemplate()},this._resyncAll=()=>{const e=pe(this._stateManager.getConfig());this._stateManager.updateConfig(e),this._linkedTemplate&&this.hass&&(this._initialTemplateFetched=!1,this._fetchAndApplyTemplate(this._linkedTemplate,e))},this._saveToTemplate=async()=>{const e=this._stateManager,t=e.getConfig().template;if(t&&this.hass)try{const i=await this._docs(t),o=me((0,a.wL)({...e.getConfig(),not_synced:[]},i,!1));await this.hass.callWS({type:"magic_card_utils/save_template",name:t,template:{config:o}});const n=(0,s.B)(o.custom_animations);this._tpl.set(t,n.length?n:void 0),this._sync(e.getState());const r=e.getConfig(),l=new Map(n.map(e=>[e.id,JSON.stringify(e)])),c=(0,s.B)(r.custom_animations),d=c.filter(e=>r.hidden_animations?.includes(e.id)||l.get(e.id)!==JSON.stringify(e)),h=r.template===t&&d.length<c.length;if(r.template!==t||!h&&!ue(r)&&!r.not_synced)return;const u=pe(r);r.hidden_animations&&(u.hidden_animations=r.hidden_animations),h&&(u.custom_animations=d.length?d:void 0),e.updateConfig(u)}catch(e){console.warn("Magic Card Editor: Failed to save template",t,e)}},this._unlinkTemplate=async()=>{const e=this._stateManager,t=e.getConfig().template;try{const i=t&&await this._docs(t),o={...(0,a.wL)(e.getConfig(),i)};if(!t||o.template!==t)return;delete o.template,delete o.hidden_animations,e.updateConfig(o)}catch(e){console.warn("Magic Card Editor: Failed to fetch template",t,e)}},this._onTemplateSelected=e=>{const t={...e.detail.config};t.not_synced?.includes("custom_animations")||delete t.custom_animations,delete t.hidden_animations,this._stateManager.updateConfig(t),this._showTemplatePicker=null,t.template&&this._fetchAndApplyTemplate(t.template,t)},this._onAddModule=e=>{this._moduleSelectorTarget=e.detail,this._showModuleSelector=!0},this._onReplaceModule=e=>{this._replaceTarget=e.detail,this._showModuleSelector=!0},this._onPickerClose=()=>{const e=this._replaceTarget;this._showModuleSelector=!1,this._replaceTarget=void 0,this._focusAfterPicker(e)},this._onModuleSelected=e=>{const t=this._replaceTarget;if(t)return this._replaceModule(t,e.detail.type),this._showModuleSelector=!1,this._replaceTarget=void 0,void this._focusAfterPicker(t);const i=this._moduleSelectorTarget;void 0!==i?.moduleIndex?this._stateManager.addChildModule(i.rowIndex,i.colIndex,i.moduleIndex,i.child,i.slot??0,e.detail.type):i&&this._stateManager.addModule(i.rowIndex,i.colIndex,e.detail.type),this._showModuleSelector=!1,this._moduleSelectorTarget=void 0},this.addEventListener("add-module",this._onAddModule),this.addEventListener("replace-module",this._onReplaceModule),this.addEventListener("request-add-row",this._handleAddRow),this.addEventListener("template-create",()=>{this._showTemplatePicker="create"}),this.addEventListener("template-load",()=>{this._showTemplatePicker="link"}),this.addEventListener("template-resync",this._resyncAll),this.addEventListener("template-save",this._saveToTemplate),this.addEventListener("template-unlink",this._unlinkTemplate),this.addEventListener("open-studio",()=>this.openStudio()),this.addEventListener("studio-close",this._closeStudio),this.addEventListener("mc-card-bridge",e=>{const t=e.detail;e.stopPropagation(),t&&(t.sm=this._stateManager)});for(const e of gl)this.addEventListener(e,this._containEvent)}connectedCallback(){super.connectedCallback(),this._stateManager.attached=!0,en(),this.addEventListener("mc-template-reapply",this._onTemplateReapply),this._unsubscribe??=this._stateManager.subscribe(e=>{this._editorState=e,this._linkedTemplate=e.config.template??null,this._sync(e)})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mc-template-reapply",this._onTemplateReapply),this._stateManager.flush(),this._stateManager.attached=!1,this._unsubscribe?.(),this._unsubscribe=void 0}setConfig(e){this._stateManager.setConfig(e),e.template&&this.hass&&!this._initialTemplateFetched&&(this._initialTemplateFetched=!0,this._fetchAndApplyTemplate(e.template,e))}selectByKey(e){this._stateManager?.setSelectedPath((0,w.bm)((0,w.g1)(e)))}setInspectorTab(e){const t=this.shadowRoot?.querySelector("mc-pane-editor");t?.inspector?.setTab(e),this.shadowRoot?.querySelector("mc-studio")?.inspector?.setTab(e)}openStudio(){this._studioMounted=!0,this._studioOpen=!0}_notify(e){const t=this._studioOpen?this.shadowRoot?.querySelector("mc-studio")?.shadowRoot?.querySelector("mc-studio-canvas"):null;t?.showStatus?t.showStatus(e):document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:e}}))}async _templates(){this._tplAsk??=this.hass.callWS({type:"magic_card_utils/get_templates"}).finally(()=>{this._tplAsk=void 0});const e=(await this._tplAsk).templates??{};for(const[t,i]of Object.entries(e)){const e=(0,s.B)(i.config.custom_animations);this._tpl.set(t,e.length?e:void 0)}return this._sync(this._stateManager.getState()),e}async _docs(e){return this._tpl.has(e)||e in await this._templates()||this._tpl.set(e,void 0),this._tpl.get(e)}async _fetchAndApplyTemplate(e,t,i){if(!this.hass)return!1;try{const o=(await this._templates())[e];if(!o)return!1;const n=i?i():t;return!!n&&(this._stateManager.setConfig((0,a.e5)(o.config,n,!0)),!0)}catch(t){return console.warn("Magic Card Editor: Failed to fetch template",e,t),!1}}willUpdate(e){e.has("hass")&&this.hass&&(0,pl.Zc)(this.hass),this.lang=(0,h.H)()}render(){if(!this._editorState)return o.qy`<div class="loading" aria-busy="true" aria-label=${(0,h.t)(534)}></div>`;const e=this._renderOverlays(this._editorState);return o.qy`<mc-pane-editor .stateManager=${this._stateManager} .hass=${this.hass}></mc-pane-editor>
${this._studioMounted?o.qy`<mc-studio .stateManager=${this._stateManager} .hass=${this.hass} .lovelace=${this.lovelace} .open=${this._studioOpen}>${this._studioOpen?e:o.s6}</mc-studio>`:o.s6}
${this._studioOpen?o.s6:e}`}_renderOverlays(e){return o.qy`${this._showModuleSelector?o.qy`<mc-module-selector .mode=${this._replaceTarget?"replace":"add"} .types=${this._replaceTypes(e.config)} @module-selected=${this._onModuleSelected}
@mc-picker-close=${this._onPickerClose}></mc-module-selector>`:o.s6}
${this._showTemplatePicker?o.qy`<mc-template-picker .mode=${this._showTemplatePicker} .hass=${this.hass}
.config=${(0,a.wL)(e.config,e.templateAnimations)}
@mc-picker-close=${()=>{this._showTemplatePicker=null}}
@template-selected=${this._onTemplateSelected}></mc-template-picker>`:o.s6}
${this._showSyncDialog?this._renderSyncDialog():o.s6}`}_renderSyncDialog(){return o.qy`<dialog class="mc-sync-dialog" aria-labelledby="sync-title" aria-describedby="sync-text"
@click=${e=>{this._syncDialogCtrl.isBackdropClick(e)&&this._cancelSync()}}>
<div class="dialog" @click=${e=>e.stopPropagation()}><h2 id="sync-title">${(0,h.t)(1121)}</h2>
<p id="sync-text">${(0,h.tx)(1065,{name:o.qy`<span class="mono">${this._linkedTemplate}</span>`})}</p><div class="actions">
<button type="button" class="btn btn-secondary" @click=${this._handleSyncNo}>${(0,h.t)(684)}</button>
<button type="button" class="btn btn-primary" @click=${this._handleSyncYes}>${(0,h.t)(1120)}</button></div></div></dialog>`}_replaceTypes(e){const t=this._replaceTarget?.sel,i=t&&(0,w.cv)(e,t);return i?Ne(i):void 0}_replaceModule(e,t){const i=this._stateManager,o=i.getConfig(),n=(0,w.cv)(o,e.sel),a=Ke(o,e.sel,t);if(!n||!a)return;i.updateConfig(a.config),i.setSelectedPath(a.path);const s=(0,w.Iu)(n),r=(0,w.Iu)({type:t}),l="tabs"===n.type?(0,$.yZ)(n)?.length??0:0;let c=(0,h.t)(805,{old:s,new:r});l>1?c=(0,h.t)(807,{old:s,new:r,n:l}):"tabs"===t&&((0,$.yZ)(n)?.flat().length??0)>0&&(c=(0,h.t)(806,{old:s,new:r})),a.dropped&&(c+=" "+(0,h.t)(1261,{n:a.dropped})),e.status?.(c)}_focusAfterPicker(e){e?.focus&&this.updateComplete.then(()=>setTimeout(()=>e.focus(),0))}};fl.styles=[l.x,o.AH`
:host { display: block; }
.loading { min-height: 240px; }
.mc-sync-dialog { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; box-sizing: border-box; width: auto; height: auto; max-width: none; max-height: none; margin: 0; border: 0; padding: 16px; overflow: hidden; color: inherit; background: rgba(0, 0, 0, 0.4); overscroll-behavior: contain; }
.mc-sync-dialog:not([open]) { display: none; }
.mc-sync-dialog::backdrop { background: transparent; }
.dialog { width: min(420px, 100%); display: grid; gap: 12px; padding: 24px; border-radius: var(--mc-radius-lg); background: var(--mc-surface); box-shadow: var(--mc-shadow-float); }
.dialog h2 { margin: 0; font-size: 1.125rem; font-weight: 500; }
.dialog p { margin: 0; font-size: 0.875rem; color: var(--mc-text-2); overflow-wrap: anywhere; }
.actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin-top: 8px; }
`],ml([(0,n.MZ)({attribute:!1})],fl.prototype,"hass",void 0),ml([(0,n.MZ)({attribute:!1})],fl.prototype,"lovelace",void 0),ml([(0,n.wk)()],fl.prototype,"_editorState",void 0),ml([(0,n.wk)()],fl.prototype,"_showModuleSelector",void 0),ml([(0,n.wk)()],fl.prototype,"_moduleSelectorTarget",void 0),ml([(0,n.wk)()],fl.prototype,"_replaceTarget",void 0),ml([(0,n.wk)()],fl.prototype,"_showTemplatePicker",void 0),ml([(0,n.wk)()],fl.prototype,"_linkedTemplate",void 0),ml([(0,n.wk)()],fl.prototype,"_showSyncDialog",void 0),ml([(0,n.wk)()],fl.prototype,"_pendingSyncAction",void 0),ml([(0,n.wk)()],fl.prototype,"_studioOpen",void 0),fl=ml([(0,n.EM)(r.z)],fl),(0,ta.Oi)(),(0,Gt.G)();const vl="2026.10.12-beta.6"},9100(e,t,i){i.d(t,{A:()=>h,H:()=>l,t:()=>n,tc:()=>a,tl:()=>c,tx:()=>s});var o=i(4753);const{t:n,tc:a,tx:s,m:r,locale:l}=(0,o.my)("card-editor",["\"{value}\" is not one of the entity's options.|**Bold**, _italic_, `code`|+ {n, plural, one {# design field} other {# design fields}}|, shown at {px} px|0 dots: moving dashes instead.|0 is round, 1 is most irregular.|1 column|1 is rounder, 0 is squarer.|12-hour|24-hour|<svg viewBox=\"0 0 24 24\">…</svg>|<use> and <image> aren't supported. Draw the shapes as paths and try again.|A background image replaces a gradient here. Remove the image to use a gradient.|A curved line instead of straight segments.|A gradient needs at least 2 stops|A negative value runs the dots from the end to the start.|A preset stored in this card.|A row needs one column|A row, column or layout around this tile has No entity, so there is nothing to follow.|A tabs module needs one tab|A template named \"{name}\" already exists.|A template named \"{name}\" already exists. Overwrite?|Accent colour|Action|Action button for an entity|Actions|Active tab|Add|Add a condition to show this card only when it matters.|Add a condition to show this column only when it matters.|Add a condition to show this module only when it matters.|Add a condition to show this row only when it matters.|Add a condition to show this rule only when it matters.|Add a rule to change the look when conditions match.|Add animation|Add appearance rule|Add colour|Add column|Add column to Row {row}|Add column to {name}|Add condition|Add conditional rule|Add flow|Add flow from here|Add flow from here. {hint}|Add module|Add module to Row {row} Column {column}|Add module to {where}|Add option|Add range|Add row|Add stop|Add tab|Add tab to {name}|Add {name} module|Add, rename and order tabs, and add their modules, in the structure tree.|Advanced|After|After the last slide, go back to the first one|Alarm control panel|Alarm panel|Align|All|All match (AND)|Alternate|Alternate reverse|Always|Always shown, even when nothing moves.|Always visible|Amplitude (%)|An animated icon stored in this card.|An animated wave on the surface. Still with reduced motion.|An attribute graph loads every recorded state with all its attributes; long periods can load slowly.|An input_boolean or switch: off hides the scene, on every card that uses it.|An open pop-up keeps a rectangular surface.|An optional label to help you identify this card in the editor.|Angle|Angle (deg)|Angle in degrees|Animate|Animated|Animated icons|Animated lines between two modules, like solar to house. Speed, width and direction can follow an entity value.|Animated weather icons instead of static ones|Animated weather icons replace icon effects.|Animated weather icons replace icon effects. Your icon effects are paused and come back when Animated icons is off.|Animates the icon like the device it shows.|Animation|Animation colour|Animation {n}|Animations|Any matches (OR)|Appearance overrides|Applied to the active tab, on top of Default and matching rules. Only these settings apply to it.|Applied to the card's content, e.g. letter-spacing: 0.5px|Applied to the disabled tabs, on top of Default and matching rules. Only these settings apply to them.|Applied to {thing} only|Applied while the pointer is over this card, on top of Default and matching rules.|Applied while the pointer is over {thing}, on top of Default and matching rules.|Area|Area opacity|Arrange|Aspect ratio|Assist|Attach to|Attribute|Attributes|Attributes of {id} ({source})|Auto|Auto ({when}: {scene})|Auto close|Auto for this entity: {rule}.|Auto has no animation for this entity; pick one.|Auto shows a holiday between these dates (inclusive), else the season. A range may run over the new year. Type off to skip a holiday.|Automatic|Automatic ({format}, from your profile)|Automatic: Palm Sunday to Easter Monday, worked out for each year.|Autoplay|Autoplay delay (ms)|Autumn|Back|Back to dialog|Back to normal|Backdrop blur|Backdrop opacity|Background colour|Background image|Backgrounds do not change on hover.|Bar background|Bar colour|Bar height|Bar settings apply to every tab and live in Default.|Bar settings apply to every tab and live in the rule.|Before|Behind content|Behind others|Below 1 the whole card fades, text included, which lowers contrast.|Beside the line|Blob|Blurs what is behind the card. It only shows through a see-through background, for example rgba(0, 0, 0, 0.3).|Border decorations|Border radius|Bottom|Bottom left|Bottom right|Box shadow|Box shadow follows the shape as a drop shadow (first shadow only).|Browse|Browse entities|Browse icons|Browse media|Browse services|Browsers only autoplay muted videos.|Built-in|Built-in cards|Built-in: {value}|Button|Button style|Calendar|Calendar display|Call service|Camera entity|Cancel|Canvas width|Canvas, live preview|Canvas, {label} selected|Caps|Card|Card backdrop|Card backdrop layers sit on top of this colour and image.|Card backdrop, layer {n}|Card configuration|Card entity|Card height|Card modules do not follow the card's entity.|Card name|Card settings|Card settings > General|Card structure|Card theme|Card type|Cards|Centre|Change card fields, like background colour, while conditions match. For ring, shape and more, use a design rule on the Design tab.|Changed on this card|Chase dots|Christmas|Circle|Clear|Clear every icon effect|Clear every value in this section|Clear search|Click a module to select it. {move} moves it, {remove} removes it, {menu} opens its menu.|Click the module to connect to. Escape cancels.|Click the module to connect to. {key} cancels.|Climate control card|Clockwise|Close|Close pop-up|Close when|Closes the Magic Card pop-up that is open (also from inside it).|Closes when the entity changes to this state.|Collapse flow {n}|Collapse row {n}|Collapse rule|Colour|Colour format|Colour from|Colour picker|Colour ranges|Colour style|Colour {n}|Colours the icon like Home Assistant does for this entity's state.|Column|Column layout|Column name|Column widths|Column {a} {wa}, Column {b} {wb}|Column {n}|Column {n} width|Combine with|Compact mode|Compact tile card|Condition match|Condition type|Condition {n}|Conditional|Conditional appearance|Conditions|Connection|Contain|Content|Controls|Copy YAML|Copy a design first|Copy a module first|Copy and paste|Copy design|Copy failed: select the path and copy it|Copy module|Copy navigation path|Copy this YAML|Copying failed: the browser blocked the clipboard.|Corner|Corner size|Could not load the template, so the column was not reset.|Could not reach Magic Card Utils. Try again.|Couldn't load the line styles.|Couldn't load the slider looks.|Couldn't tell the view type|Counter-clockwise|Cover|Create template|Create template from this card|Curve|Custom|Custom CSS|Custom SVG|Custom card|Custom cards (HACS)|Custom options|Custom pattern|Custom shape|Custom widths|Customise a copy|Customise this icon|Cut corners|Cut size|Cutout size|Daily|Dashboard default|Dashed|Date format|Date pattern|Day and night|Decimals|Default|Default sets a solid colour, so a rule cannot swap it for a gradient. Clear the Default colour first.|Default tab|Del|Delay|Delete|Delete (Del)|Delete animation|Delete animation {n}|Delete column|Delete column \"{name}\" and its {n, plural, one {# module} other {# modules}}?|Delete flow|Delete flow {n}|Delete range|Delete range {n}|Delete row|Delete rule|Delete tab|Delete tab \"{name}\" and its {n, plural, one {# module} other {# modules}}?|Delete template|Delete template {name}|Density (%)|Description (optional)|Design|Design copied|Design pasted|Device animation|Dialog|Did you mean No entity?|Direction|Disabled tab|Display|Display an image|Display conditions|Done|Dot size (px)|Dots|Dotted|Double tap|Down|Drag to resize, double-click for equal widths|Draw an icon|Draw duration|Draw your own SVG icon instead of one from the icon list.|Drawn along the border; the content keeps clear of them.|Drum|Duotone|Duplicate|Duplicate (Ctrl+D)|Duplicate row|Duration|Easing|Easter|Easter dates automatic|Edge|Edit|Edit as custom|Edit card settings|Edit icon|Edit shape|Edit template|Edit template {name}|Editing design for|Editor mode|Effects|Effects need the icon shape; this icon could not be loaded (or is a multi-colour logo), so it is shown as is.|Elapsed|Elbow|Embed a webpage|Embed my animations|Empty column|Empty opacity (%)|Empty uses the module entity ({entity}).|Empty: the entity's own range and step. Min and max can only narrow that range.|Empty: the entity's own range and step. Min and max can only narrow that range; a step that is not a multiple of the entity's step is replaced by the entity's.|Empty: the module's entity ({entity}).|Empty: the primary colour at {pct}%.|End|End: attach to|Ends at {value} (set in YAML).|Entities|Entity|Entity (for templates)|Entity colour|Entity colour for {name}|Entity does not fit this module|Entity filter|Entity for play condition|Entity for show condition|Entity for states and values|Entity history graph|Entity logbook entries|Entity source|Entity with background image|Equal widths|Equalizer|Equals|Every change|Expand flow {n}|Expand row {n}|Expand rule|Extra scenes layered on top, like Day and night during winter.|Failed to delete template.|Failed to save template.|Fill|Fill colour|Fill direction|Fill opacity|Fill the area under the line.|Fill transition|Fills the icon like a liquid with a value, e.g. a battery level.|Filter items|Filtered entity list|Fit|Flame|Flat|Flow {n}|Flows|Following the light|Follows a weather entity: the module's, or the one picked as Entity for play condition.|Font family|Font source|Fonts|Forecast days|Forecast type|Form|From|From side|From template|From {source}: {name}|Front|Full|Full (circle)|Fully in sync.|Gap|Gap between columns|Gauge|Gauge style|Gauge visualization|General|Give it a name.|Give this module an id in the template|Glance|Glow|Glow (px)|Go to Default|Go to rule|Google|Google Fonts|Gradient|Gradient colours|Gradient created from your colour.|Gradient needs an empty Background field. Clear it to use a gradient here.|Gradient preview|Gradient replaced with the editor version.|Grid|Grid layout of cards|Half (semicircle)|Halloween|Has local overrides|Heading|Hello World|Hemisphere|Hexagon|Hidden|Hidden on dashboard|Hidden on the dashboard; opens over it from its #ID, a trigger or an Open pop-up action.|Hide|Hide layers|Hide on dashboard|Hide tab on dashboard|History graph|History that can't be loaded draws nothing.|Hold|Holiday dates|Holidays|Home Assistant connection unavailable.|Horizontal|Horizontal stack|Hourly|Hours|Hours to show|Hover|How many particles: 100% is 24, the most a scene draws.|Hue|Humidifier|Humidifier control|ISO ({example})|Icon|Icon applied.|Icon colour|Icon effects|Icon only|Icon or picture|Icon or picture ends the line at the module's icon, picture or dial. Module box ends it at the module's edge.|Icon source|Icon when active|Icon when active is set per tab in the structure tree.|Icon when off|Icon when on|Icons|Icons from|Idle colour|Image|Image URL|Image from attribute|Image with entity icons|Image with interactive elements|In px, or % of the shorter side.|In sync|Infinite|Inherit ({value})|Inherited entity|Inherited from Default: {value}|Inside|Inspector|Intensity|Into {container}|Invalid YAML - card will use last valid configuration|Justify|Keep a copy in this card (adds {size})|Keep a copy in this card ({size})|Keep your own icons: install the free Magic Card Utils add-on.|Keep your own shapes for every dashboard with the free Magic Card Utils add-on. Until then, this shape is saved in this card only.|Label|Label position|Label template|Layer|Layer settings could not load. Reload the page.|Layers|Layers here ({n})|Layout|Layout {layout}|Leave empty to keep the tab icon.|Leave empty to offer the entity's own options. Custom options rename or pick from them; a value the entity does not offer is shown disabled.|Left|Length (%)|Library|Light|Light control card|Lights, icicles, frost, a cobweb, a pumpkin or a flower vine along the border, for the scenes that have them. The content keeps clear of them.|Line colour|Line draw|Line width|Line width (px)|Linear|Linked to template {name}.|Linked to the saved shape {name}. Change it there and every card that uses it changes.|Liquid fill|List of entity rows|Live|Live data|Load|Load \"{name}\"? This will replace your current config.|Load template|Load template…|Loading|Loading My animations…|Loading editor|Loading editor...|Loading icons…|Loading layer settings…|Loading line styles...|Loading slider looks...|Loading templates...|Loading...|Loading…|Local|Local fonts|Logbook|Long ({example})|Long-term statistic|Look|Loop|Magic Card Utils templates never include it. Applying one keeps this card's entity.|Magic Card integration not found. Please install it via HACS and add the integration.|Magic Card studio|Make a custom shape|Makes your own copy. The original stays in {pack}.|Map|Map with entity locations|Marching ants|Markdown|Markdown with Home Assistant templates, e.g. {example}. With an entity set, {entity} shows its state.|Match|Match view|Matches this view (masonry)|Matches this view (panel)|Matches this view (sections)|Matches this view (sections, {columns} of 12 columns)|Matches this view (sidebar)|Material Design Icons|Material Design icons|Max|Max height|Maximise|Media|Media URL or path|Media control|Media folders|Media player controls|Medium ({example})|Merge into design|Merge pasted design|Min|Min speed (s)|Min, Max and Attribute do not apply to a timer; thresholds use its remaining %.|Mode|Module|Module actions|Module box|Module category|Module entity ({entity})|Module name|Module not found|Module not found ({id})|Module options for {name}|Module {n}|Modules marked (no id) come from the template. {hint} to connect it.|More info|Morph|Morphs between the state icons when the entity turns on or off.|Motion|Move down|Move down (Alt+Down)|Move to…|Move up|Move up (Alt+Up)|Move window|Moved {name} to {where}|Muted|My animations|My icons|My icons ({n})|My shapes|My shapes ({n})|Name|Name and state|Name, current value and time span under the graph.|Narrow|Narrow, 400 pixels|Navigate|Navigation|Navigation is off in Preview|Navigation path|Navigation path copied|Needs {kind}|New Year|No CSS property matches \"{query}\".|No appearance rules|No attributes found|No cards found|No conditions yet. The rule applies once a condition is added and matches.|No config available to save.|No entities found|No entity|No entity.|No entity: the line always flows at its speed.|No fonts found|No header text|No icons found|No icons found. Type a full id, such as mdi:fan.|No items found|No media sources available|No modules in this category.|No modules match \"{query}\".|No other column to move to|No other module type to replace with|No preview of this card to open yet|No rows yet|No saved icons yet. Draw an icon, then choose Save to library in the editor.|No saved shapes yet. Make a custom shape, then choose Save as shape.|No services found|No settings for this module.|No tab is disabled yet. Tick tabs under Bar > Disabled tabs in Default.|No template|No templates saved|No visual editor available for this card type. Configure using YAML:|None|Normal|North|Not equals|Not found in My animations. The card plays its embedded copy if it has one.|Not found. My animations needs the Magic Card Utils integration; the card plays its embedded copy if it has one.|Not linked to a template|Not set|Not set in this rule: Default applies.|Notch|Nothing chosen yet. To use the card's device, set it in {link}.|Nothing differs from the template|Nothing set. This state looks like Default.|Now using {name} from the {source}.|Now using {name}.|Now: {device}.|Number|Number of forecasts|Numeric ({example})|Octagon|Off|Off switch|On change|On load|On tap|On the line|On top|On top, {anchor}|One of the row's column widths.|Only fields you set override. Leave blank to fall through to the base settings.|Only this card|Opacity|Opacity percent|Open Conditions|Open Design|Open colour picker|Open it from any button: tap action Navigate to {path}, or Open pop-up.|Open pop-up|Open studio|Open when|Opens the Magic Card pop-up with this ID (navigates to {path}).|Opens when the entity changes to this state, e.g. a doorbell turning on.|Operator|Option {n}|Optional|Organic|Out to {parent}|Outline|Outside|Over content|Over the content, dimmed. Taps still reach the content.|Overridden|Overridden locally. Click to re-sync from the template.|Override appearance fields while conditions match. Rules apply in order; later rules win.|Override dashboard theme|Overwrite|Own entity|Own module list, not synced with the template|Own module list: not synced with the template. Reset column restores it.|Padding|Pagination|Panel|Panel, full width|Parts of the SVG with class=\"mc-accent\".|Parts of the icon drawn in Accent in the icon editor.|Paste design|Paste module|Paste module after|Paste the copied design|Pattern|Pause button|Pause preview motion|Paused off-screen and with reduced motion.|Pauses while the entity is off or unavailable.|Percent, 0 is no darkening.|Pick a colour from the screen|Pick a device|Pick a module|Pick an entity: Auto animates the icon from its state.|Pick an entity: a fill without a value stays empty.|Pick an entity: a value background without one draws nothing.|Pick an entity: a value label needs one.|Pick an entity: a value ring without one stays empty.|Pick an entity: this condition never plays without one.|Pick an entity: this condition never shows the ring without one.|Pick another random blob|Pick one|Pick the end module|Pick the start module|Pick the state icons (Icon when on / off) to morph between; unset sides use the module's icon.|Pick {kind}|Pick {name}|Picture|Picture elements|Picture entity|Picture glance|Pill|Pills|Placement|Placement: put behind others, put on top, back to normal|Plant monitor display|Plant status|Play|Play, pause, sound and full screen on the live stream.|Plays behind the other modules in the same column or layout. On its own in a column it shows at its own size.|Plays while the card is visible (not with reduced motion).|Points per hour|Pop-up|Pop-up ID|Position|Poster image URL|Prefix|Preset|Presets|Preview|Preview (Esc to return)|Preview date|Preview not updated: {error}|Preview pop-up|Preview the card with live actions|Preview: actions are live|Primary colour|Problem|Pulse|Put behind others|Put on top|Quarter|Quick overview of entities|Radial|Range {n}|Re-sync {overrides}|Redo|Redo (Ctrl+Y)|Refresh every (seconds)|Remaining|Remove colour|Remove colour {n}|Remove condition|Remove condition {n}|Remove option|Remove rule|Remove stop {num}|Remove {value}|Removing a column moves its modules into the column to its left.|Rename|Rendered Markdown text|Repeat|Repeat count|Replace design|Replace with {name}|Replace with…|Replaced {old} with {new}.|Replaced {old} with {new}. All modules are in the first tab.|Replaced {old} with {new}. The modules of all {n} tabs are kept in tab order.|Reset|Reset card to template…|Reset column to template…|Reset layout to template…|Reset row to template…|Reset section|Reset section Icon effects|Reset section {name}|Reset the whole card to the template? All your changes are lost.|Reset to animation|Reset to preset|Reset to template|Reset to template…|Reset {group} in {state}|Reset {name} to the template? Changes to all its modules are lost.|Reset {name} to the template? Your changes to it are lost.|Reset {state}|Resets Default values only.|Resize between Column {a} and Column {b}|Resize window|Restore size|Resume preview motion|Retry|Reverse|Reverse when negative|Right|Ring|Ring colour|Ring colour from this remaining % up; overrides Colour.|Ring colour from this value up; overrides Colour.|Ring mode|Round|Rounded|Route|Row name|Row {n}|Row {row} / Col {col}|Row {row} Column {column}|Row {row} column {column} actions|Rows hold columns, columns hold modules.|Rule|Rule name|Rule {n}|Rule: {name}|Rule: {name}, active tab|Rule: {name}, disabled tab|Runs when the row is tapped outside a module with its own action or control.|SVG markup|Same as Default|Same as Where in Look.|Same as {source}|Same on all sides|Save|Save as shape|Save current colour|Save to template|Saved as {name}. Find it under My shapes.|Saved colours|Saved icon \"{name}\" was not found. The card shows the default icon.|Scale width|Search CSS properties|Search CSS properties, e.g. padding|Search attributes|Search cards|Search entities|Search fonts|Search icons|Search modules|Search services|Search templates|Seasonal|Seasonal scene|Seasons|Secondary colour|Secondary info|Seconds for a dot to travel the line: Speed at Max, Min speed just above Min.|Seconds without interaction. Empty: stays open.|Section heading|Seed|Select|Select attribute|Select card|Select entity|Select font|Select icon|Select layer above|Select layer below|Select media|Select service|Select {label}|Selected {name}, {n, select, 1 {1st} 2 {2nd} 3 {3rd} other {{n}th}} from the front here|Sensor|Sensor with graph|Service|Service data|Services|Sets {attributes}; empty: {fallback}.|Settings|Shake|Shape|Shape applied.|Shape source|Share with tiles inside|Shared with tiles inside|Sheet|Shopping list|Shopping list card|Short ({example})|Show|Show all|Show area devices and entities|Show as pop-up|Show brightness|Show cards based on conditions|Show close button|Show code editor|Show colour picker|Show colour temp|Show condition|Show controls|Show date|Show effects|Show forecast|Show icon|Show in tree|Show labels|Show layers|Show name|Show needle|Show on dashboard|Show points|Show precipitation|Show seconds|Show state|Show tab on dashboard|Show temperature|Show this card when…|Show this column when…|Show this module when…|Show this row when…|Show this rule when…|Show unit|Show value|Show visual editor|Show wind|Showing {shown} of {total}. Refine the search to see more.|Showing: {state}|Shown until the video plays, and instead of it when it cannot play.|Shown while the card has motion. Viewers can pause it.|Shows Auto on another day in this preview only. Not saved.|Shows an entity's state or name instead of the text.|Shows the entity's picture (person, image, camera, media player).|Shows the entity's state (or the attribute picked below) next to the label.|Shuffle|Side cut|Single entity display|Size|Slider colour|Slides per view|Slot {n}|Smoothing|Snake|Snapshot|Snapshot refresh (seconds)|Snow|Snow, rain, a storm, sun, clouds, fog or wind, from its state.|Solid|South|South flips the seasons.|Space around|Space between|Space between slides (px)|Sparkline|Speed|Speed (s)|Spin|Spring|Squircle|Stack cards horizontally|Stack cards vertically|Stars and fireflies at night, a warm glow at dusk and dawn (sun.sun), nothing by day.|Start|Start: attach to|State|State (no attribute)|State colour|State icons|State icons: the icon while the entity is on or off. Empty: the module's icon.|State value|State, e.g. on (empty: any change)|Statistic|Statistics graph|Step|Stop {num} colour|Stop {num} of {n}|Straight|Strength (%)|Stretch|Structure|Style|Styles are removed; use fill attributes (for example fill=\"#f44336\") for colours.|Suffix|Summer|Swing|Switched to Solid. Undo brings the gradient back.|Synced with template|Synced with the template. Click to keep a local value that won't sync.|Tab|Tab name|Tab style|Tab {n}|Tabs|Tap|Tap the icon to turn the light on or off. Leave Icon empty to show the light's own icon.|Target|Target entity|Template|Template actions|Template animations|Template name|Template name is required.|Text|Text uses this gradient as its fill. Older tablets show the first colour.|That is not an entity id. It needs a dot, like light.kitchen. To switch the entity off, use No entity.|The SVG is larger than 32 KB.|The animated icons could not be loaded. Try again.|The arc takes the colour of the highest range at or below the value.|The area fades out upwards. The line stays faint ({pct}%) so text over it stays readable.|The attribute holds the image URL; it replaces the entity picture and the image URL.|The bar takes the colour of the highest range at or below the value; the bar colour applies below the first range.|The blob morphs slowly.|The card clips its edge: the ring sits inside it and its glow shows inward.|The colour along these stops follows the value: Liquid fill's entity, min and max, else the module's entity from 0 to 100.|The device this card is for. Tiles follow it unless you set one for them.|The empty part uses the colour {colour} (set in YAML); a value here replaces it.|The entity's state colour|The icon editor could not load. Check your connection and try again.|The icon editor could not load. Try again.|The icon uses this gradient as its fill. Older tablets show the first colour.|The library could not load. Check your connection and try again.|The library is full. Delete a shape first.|The modules inside this layout; the layout's modules differ from the template.|The modules inside this layout; they follow the template as one list.|The quick brown fox jumps over the lazy dog|The shape clips anything that pops out of the module, like dropdowns and tooltips.|The shape editor could not load. Check your connection and try again.|The shape replaces Border radius here.|The studio canvas shows a snapshot; the dashboard plays the stream (muted).|The thermostat keeps a range (low / high): pick target_temp_low or target_temp_high as the attribute to set one end.|The visual editor does not support this configuration: {error}|The waves flow along the edge.|The {key} key is set automatically from Card Type. Do not include it here.|Theme default|Thermostat|This SVG contains {list}. Remove it and try again.|This SVG contains {list}. Remove them and try again.|This card|This card is linked to template {name}. Do you want to update all linked cards with this structural change?|This card now has its own copy.|This card uses only its own custom_animations.|This entity has no daily forecast; its first forecast type is shown. The Forecast module offers more options.|This entity has no options a dropdown can set (use an input select, select, input text or text with custom options, climate, fan, light, media player, water heater or humidifier).|This entity has no {type} forecast; {fallback} is shown.|This is custom gradient CSS. Choose Gradient to replace it with the editor's version.|This light has no {what}; the control is hidden.|This line look is wide, so it attaches to the module box until you pick Icon or picture.|This module is part of its layout; the layout's modules differ from the template.|This module is part of its layout; they follow the template as one list.|This shape can not be saved.|This tile needs {kind}. The {source}'s device is {thing}, so the tile stays empty.|This tile shows no device.|This value can only be shown: the entity (or this attribute) cannot be set from a slider.|This value can only be shown: the entity (or this attribute) cannot be set from a spinbox.|Thresholds|Ticket|Ticket, Wave and Blob can not be edited yet. Use the preset as it is.|Tile|Tiles inside follow this entity unless they pick their own.|Tiles inside get no entity unless they pick one.|Tiles that follow the card will show it.|Time|Time format|Timer fill|Title|To|To side|To-Do List|To-do list card|Toggle|Toggles {entity} (the module entity).|Top|Top left|Top right|Track colour|Track opacity (%)|Try again|Turn off to pick a theme for this card only.|Twice daily|Type|URL|Underline|Undo|Undo (Ctrl+Z)|Unit|Unknown module type|Unlink from template|Untitled card|Up|Up to 168 (a week).|Up to 32 KB. Parts with fill=\"currentColor\" take the icon colour, parts with class=\"mc-accent\" the accent colour.|Up to twice the width at Max.|Up to {max} stops|Update all linked cards|Update linked cards?|Upload SVG|Use|Use Default value|Use Jinja2 templates: {example}|Use MM-DD..MM-DD, like 12-01..12-26, or off.|Use No entity|Use a copy of {name}|Use a hex colour, rgb(a) or var(--name).|Use a ratio like 16:9, 4/3, 1.5 or 56.25%. 16:9 is used until then.|Use as copy|Use at most 80 characters.|Use dashboard theme|Use entity|Use entity colour|Use entity colour wins while the entity has a state colour; this colour applies otherwise.|Use entity icon|Use entity picture|Use follows the library: change a shape and every card that uses it changes. Use as copy makes this card independent.|Use module entity|Use own colour|Use template|Use the entity's state colour|Use {name}|Use {value}|Used until the stream player is available.|Uses {n} of your animations.|Using a copy of {name}.|Using {name}. Changes to it reach every card that uses it.|Valentine|Value|Value and route|Value background|Value background type|Values are averaged per period (2 = every 30 minutes). Empty draws every recorded change.|Vertical|Vertical alignment|Vertical stack|Video URL|View|View type {type} isn't supported|Viewers can't pause the motion on this card. Turn the button on if anything moves for more than 5 seconds.|Visibility|Wave|Wave edge|Wave height|Waves|Weather|Weather entity|Weather forecast|Weather forecast card|Which device is this card for?|While entity is on|While flowing|While state equals…|Wide|Wide, 800 pixels|Width|Width (px)|Winter|With no entity of its own, the row uses the card's.|With nothing else shown, the state is shown anyway.|Without a copy, the card plays nothing if Magic Card Utils or this animation is removed.|Without a copy, the card shows the default icon if Magic Card Utils or this icon is removed.|Without an ID it opens only from its triggers.|Wobble|Wrap in layout|YAML|YAML copied with your animations.|YAML copied.|YAML copied. Not embedded (not found): {ids}.|YAML. Leave empty to call the service without data.|YYYY year, MMMM / MMM month name, MM / M month, DD / D day, dddd / ddd weekday. Text in [brackets] is kept as is.|Your account can use the library but not change it. Ask an admin.|Your own|a camera|a device|a different kind of device|a javascript: link|a light|a list of options|a script|a sensor|a switch|a weather source|attribute|brightness|card|colour|colour temperature|colours|column|custom widths|effects|equals|event handlers|external references|fitFill|fr shares the free space. Use Custom for auto (as wide as the content). % widths plus gap can overflow the row.|from {value}|hidden|layout {layout}|light text on theme accent|lineSolid|none|not equals|preview|row|slides|tabs|the HVAC mode|theme accent|this card|this column|this module|this row|today|{angle} degrees|{from} to {to}|{id} (not found)|{id} (unknown)|{label} (no id)|{label} entity|{label} source|{label} unit|{label}: state|{list} and {last}|{min} to {max}|{mods, plural, one {# module} other {# modules}}|{module} pasted into {where}|{n, plural, one {# column} other {# columns}}|{n, plural, one {# column} other {# columns}}, custom widths|{n, plural, one {# conditional rule} other {# conditional rules}}. Rules override Default only while their conditions match.|{n, plural, one {# conditional rule} other {# conditional rules}}. Same rules as the Conditions tab. Rules override Default only while their conditions match. A later rule wins over an earlier one.|{n, plural, one {# field differs} other {# fields differ}} locally.|{n, plural, one {# icon found} other {# icons found}}|{n, plural, one {# layer} other {# layers}}|{n, plural, one {# module} other {# modules}}|{n, plural, one {# override} other {# overrides}}|{n, plural, one {# row} other {# rows}}|{n, plural, one {# setting it does not support was} other {# settings it does not support were}} removed. Undo to get them back.|{n, plural, one {# tile follows it.} other {# tiles follow it.}}|{n, plural, one {# tile needs another device.} other {# tiles need another device.}}|{n, plural, one {Embed it to share this card with another Home Assistant.} other {Embed them to share this card with another Home Assistant.}}|{n, plural, one {module} other {modules}}|{name} (not found)|{name} (not played on tabs)|{name} ({id})|{name} ({n} set)|{name} YAML|{name} YAML copied|{name} actions|{name} copied|{name} design copied|{name} gradient type|{name} mode|{name} opacity|{name} {slot}|{name}, Behind others|{name}, On top|{name}: colour from|{note}, or pick another. Escape cancels.|{note}, or pick another. {key} cancels.|{n} B|{n} changed|{n} columns, {ratio}|{n} cond.|{n} set|{rows, plural, one {# row} other {# rows}} · {mods, plural, one {# module} other {# modules}}. Build visually with layers, canvas and the full inspector.|{size} KB|{state} reset|{title}. Press Ctrl+C (⌘C on a Mac) to copy.|{type} (not provided by this entity)","\"{value}\" is not one of the entity's options.|**Bold**, _italic_, `code`|+ {n, plural, one {# design field} other {# design fields}}|, shown at {px} px|0 dots: moving dashes instead.|0 is round, 1 is most irregular.|1 column|1 is rounder, 0 is squarer.|12-hour|24-hour|<svg viewBox=\"0 0 24 24\">…</svg>|<use> and <image> aren't supported. Draw the shapes as paths and try again.|A background image replaces a gradient here. Remove the image to use a gradient.|A curved line instead of straight segments.|A gradient needs at least 2 stops|A negative value runs the dots from the end to the start.|A preset stored in this card.|A row needs one column|A row, column or layout around this tile has No entity, so there is nothing to follow.|A tabs module needs one tab|A template named \"{name}\" already exists.|A template named \"{name}\" already exists. Overwrite?|Accent color|Action|Action button for an entity|Actions|Active tab|Add|Add a condition to show this card only when it matters.|Add a condition to show this column only when it matters.|Add a condition to show this module only when it matters.|Add a condition to show this row only when it matters.|Add a condition to show this rule only when it matters.|Add a rule to change the look when conditions match.|Add animation|Add appearance rule|Add color|Add column|Add column to Row {row}|Add column to {name}|Add condition|Add conditional rule|Add flow|Add flow from here|Add flow from here. {hint}|Add module|Add module to Row {row} Column {column}|Add module to {where}|Add option|Add range|Add row|Add stop|Add tab|Add tab to {name}|Add {name} module|Add, rename and order tabs, and add their modules, in the structure tree.|Advanced|After|After the last slide, go back to the first one|Alarm control panel|Alarm panel|Align|All|All match (AND)|Alternate|Alternate reverse|Always|Always shown, even when nothing moves.|Always visible|Amplitude (%)|An animated icon stored in this card.|An animated wave on the surface. Still with reduced motion.|An attribute graph loads every recorded state with all its attributes; long periods can load slowly.|An input_boolean or switch: off hides the scene, on every card that uses it.|An open pop-up keeps a rectangular surface.|An optional label to help you identify this card in the editor.|Angle|Angle (deg)|Angle in degrees|Animate|Animated|Animated icons|Animated lines between two modules, like solar to house. Speed, width and direction can follow an entity value.|Animated weather icons instead of static ones|Animated weather icons replace icon effects.|Animated weather icons replace icon effects. Your icon effects are paused and come back when Animated icons is off.|Animates the icon like the device it shows.|Animation|Animation color|Animation {n}|Animations|Any matches (OR)|Appearance overrides|Applied to the active tab, on top of Default and matching rules. Only these settings apply to it.|Applied to the card's content, e.g. letter-spacing: 0.5px|Applied to the disabled tabs, on top of Default and matching rules. Only these settings apply to them.|Applied to {thing} only|Applied while the pointer is over this card, on top of Default and matching rules.|Applied while the pointer is over {thing}, on top of Default and matching rules.|Area|Area opacity|Arrange|Aspect ratio|Assist|Attach to|Attribute|Attributes|Attributes of {id} ({source})|Auto|Auto ({when}: {scene})|Auto close|Auto for this entity: {rule}.|Auto has no animation for this entity; pick one.|Auto shows a holiday between these dates (inclusive), else the season. A range may run over the new year. Type off to skip a holiday.|Automatic|Automatic ({format}, from your profile)|Automatic: Palm Sunday to Easter Monday, worked out for each year.|Autoplay|Autoplay delay (ms)|Autumn|Back|Back to dialog|Back to normal|Backdrop blur|Backdrop opacity|Background color|Background image|Backgrounds do not change on hover.|Bar background|Bar color|Bar height|Bar settings apply to every tab and live in Default.|Bar settings apply to every tab and live in the rule.|Before|Behind content|Behind others|Below 1 the whole card fades, text included, which lowers contrast.|Beside the line|Blob|Blurs what is behind the card. It only shows through a see-through background, for example rgba(0, 0, 0, 0.3).|Border decorations|Border radius|Bottom|Bottom left|Bottom right|Box shadow|Box shadow follows the shape as a drop shadow (first shadow only).|Browse|Browse entities|Browse icons|Browse media|Browse services|Browsers only autoplay muted videos.|Built-in|Built-in cards|Built-in: {value}|Button|Button style|Calendar|Calendar display|Call service|Camera entity|Cancel|Canvas width|Canvas, live preview|Canvas, {label} selected|Caps|Card|Card backdrop|Card backdrop layers sit on top of this color and image.|Card backdrop, layer {n}|Card configuration|Card entity|Card height|Card modules do not follow the card's entity.|Card name|Card settings|Card settings > General|Card structure|Card theme|Card type|Cards|Center|Change card fields, like background color, while conditions match. For ring, shape and more, use a design rule on the Design tab.|Changed on this card|Chase dots|Christmas|Circle|Clear|Clear every icon effect|Clear every value in this section|Clear search|Click a module to select it. {move} moves it, {remove} removes it, {menu} opens its menu.|Click the module to connect to. Escape cancels.|Click the module to connect to. {key} cancels.|Climate control card|Clockwise|Close|Close pop-up|Close when|Closes the Magic Card pop-up that is open (also from inside it).|Closes when the entity changes to this state.|Collapse flow {n}|Collapse row {n}|Collapse rule|Color|Color format|Color from|Color picker|Color ranges|Color style|Color {n}|Colors the icon like Home Assistant does for this entity's state.|Column|Column layout|Column name|Column widths|Column {a} {wa}, Column {b} {wb}|Column {n}|Column {n} width|Combine with|Compact mode|Compact tile card|Condition match|Condition type|Condition {n}|Conditional|Conditional appearance|Conditions|Connection|Contain|Content|Controls|Copy YAML|Copy a design first|Copy a module first|Copy and paste|Copy design|Copy failed: select the path and copy it|Copy module|Copy navigation path|Copy this YAML|Copying failed: the browser blocked the clipboard.|Corner|Corner size|Could not load the template, so the column was not reset.|Could not reach Magic Card Utils. Try again.|Couldn't load the line styles.|Couldn't load the slider looks.|Couldn't tell the view type|Counter-clockwise|Cover|Create template|Create template from this card|Curve|Custom|Custom CSS|Custom SVG|Custom card|Custom cards (HACS)|Custom options|Custom pattern|Custom shape|Custom widths|Customize a copy|Customize this icon|Cut corners|Cut size|Cutout size|Daily|Dashboard default|Dashed|Date format|Date pattern|Day and night|Decimals|Default|Default sets a solid color, so a rule cannot swap it for a gradient. Clear the Default color first.|Default tab|Del|Delay|Delete|Delete (Del)|Delete animation|Delete animation {n}|Delete column|Delete column \"{name}\" and its {n, plural, one {# module} other {# modules}}?|Delete flow|Delete flow {n}|Delete range|Delete range {n}|Delete row|Delete rule|Delete tab|Delete tab \"{name}\" and its {n, plural, one {# module} other {# modules}}?|Delete template|Delete template {name}|Density (%)|Description (optional)|Design|Design copied|Design pasted|Device animation|Dialog|Did you mean No entity?|Direction|Disabled tab|Display|Display an image|Display conditions|Done|Dot size (px)|Dots|Dotted|Double tap|Down|Drag to resize, double-click for equal widths|Draw an icon|Draw duration|Draw your own SVG icon instead of one from the icon list.|Drawn along the border; the content keeps clear of them.|Drum|Duotone|Duplicate|Duplicate (Ctrl+D)|Duplicate row|Duration|Easing|Easter|Easter dates automatic|Edge|Edit|Edit as custom|Edit card settings|Edit icon|Edit shape|Edit template|Edit template {name}|Editing design for|Editor mode|Effects|Effects need the icon shape; this icon could not be loaded (or is a multi-color logo), so it is shown as is.|Elapsed|Elbow|Embed a webpage|Embed my animations|Empty column|Empty opacity (%)|Empty uses the module entity ({entity}).|Empty: the entity's own range and step. Min and max can only narrow that range.|Empty: the entity's own range and step. Min and max can only narrow that range; a step that is not a multiple of the entity's step is replaced by the entity's.|Empty: the module's entity ({entity}).|Empty: the primary color at {pct}%.|End|End: attach to|Ends at {value} (set in YAML).|Entities|Entity|Entity (for templates)|Entity color|Entity color for {name}|Entity does not fit this module|Entity filter|Entity for play condition|Entity for show condition|Entity for states and values|Entity history graph|Entity logbook entries|Entity source|Entity with background image|Equal widths|Equalizer|Equals|Every change|Expand flow {n}|Expand row {n}|Expand rule|Extra scenes layered on top, like Day and night during winter.|Failed to delete template.|Failed to save template.|Fill|Fill color|Fill direction|Fill opacity|Fill the area under the line.|Fill transition|Fills the icon like a liquid with a value, e.g. a battery level.|Filter items|Filtered entity list|Fit|Flame|Flat|Flow {n}|Flows|Following the light|Follows a weather entity: the module's, or the one picked as Entity for play condition.|Font family|Font source|Fonts|Forecast days|Forecast type|Form|From|From side|From template|From {source}: {name}|Front|Full|Full (circle)|Fully in sync.|Gap|Gap between columns|Gauge|Gauge style|Gauge visualization|General|Give it a name.|Give this module an id in the template|Glance|Glow|Glow (px)|Go to Default|Go to rule|Google|Google Fonts|Gradient|Gradient colors|Gradient created from your color.|Gradient needs an empty Background field. Clear it to use a gradient here.|Gradient preview|Gradient replaced with the editor version.|Grid|Grid layout of cards|Half (semicircle)|Halloween|Has local overrides|Heading|Hello World|Hemisphere|Hexagon|Hidden|Hidden on dashboard|Hidden on the dashboard; opens over it from its #ID, a trigger or an Open pop-up action.|Hide|Hide layers|Hide on dashboard|Hide tab on dashboard|History graph|History that can't be loaded draws nothing.|Hold|Holiday dates|Holidays|Home Assistant connection unavailable.|Horizontal|Horizontal stack|Hourly|Hours|Hours to show|Hover|How many particles: 100% is 24, the most a scene draws.|Hue|Humidifier|Humidifier control|ISO ({example})|Icon|Icon applied.|Icon color|Icon effects|Icon only|Icon or picture|Icon or picture ends the line at the module's icon, picture or dial. Module box ends it at the module's edge.|Icon source|Icon when active|Icon when active is set per tab in the structure tree.|Icon when off|Icon when on|Icons|Icons from|Idle color|Image|Image URL|Image from attribute|Image with entity icons|Image with interactive elements|In px, or % of the shorter side.|In sync|Infinite|Inherit ({value})|Inherited entity|Inherited from Default: {value}|Inside|Inspector|Intensity|Into {container}|Invalid YAML - card will use last valid configuration|Justify|Keep a copy in this card (adds {size})|Keep a copy in this card ({size})|Keep your own icons: install the free Magic Card Utils add-on.|Keep your own shapes for every dashboard with the free Magic Card Utils add-on. Until then, this shape is saved in this card only.|Label|Label position|Label template|Layer|Layer settings could not load. Reload the page.|Layers|Layers here ({n})|Layout|Layout {layout}|Leave empty to keep the tab icon.|Leave empty to offer the entity's own options. Custom options rename or pick from them; a value the entity does not offer is shown disabled.|Left|Length (%)|Library|Light|Light control card|Lights, icicles, frost, a cobweb, a pumpkin or a flower vine along the border, for the scenes that have them. The content keeps clear of them.|Line color|Line draw|Line width|Line width (px)|Linear|Linked to template {name}.|Linked to the saved shape {name}. Change it there and every card that uses it changes.|Liquid fill|List of entity rows|Live|Live data|Load|Load \"{name}\"? This will replace your current config.|Load template|Load template…|Loading|Loading My animations…|Loading editor|Loading editor...|Loading icons…|Loading layer settings…|Loading line styles...|Loading slider looks...|Loading templates...|Loading...|Loading…|Local|Local fonts|Logbook|Long ({example})|Long-term statistic|Look|Loop|Magic Card Utils templates never include it. Applying one keeps this card's entity.|Magic Card integration not found. Please install it via HACS and add the integration.|Magic Card studio|Make a custom shape|Makes your own copy. The original stays in {pack}.|Map|Map with entity locations|Marching ants|Markdown|Markdown with Home Assistant templates, e.g. {example}. With an entity set, {entity} shows its state.|Match|Match view|Matches this view (masonry)|Matches this view (panel)|Matches this view (sections)|Matches this view (sections, {columns} of 12 columns)|Matches this view (sidebar)|Material Design Icons|Material Design icons|Max|Max height|Maximize|Media|Media URL or path|Media control|Media folders|Media player controls|Medium ({example})|Merge into design|Merge pasted design|Min|Min speed (s)|Min, Max and Attribute do not apply to a timer; thresholds use its remaining %.|Mode|Module|Module actions|Module box|Module category|Module entity ({entity})|Module name|Module not found|Module not found ({id})|Module options for {name}|Module {n}|Modules marked (no id) come from the template. {hint} to connect it.|More info|Morph|Morphs between the state icons when the entity turns on or off.|Motion|Move down|Move down (Alt+Down)|Move to…|Move up|Move up (Alt+Up)|Move window|Moved {name} to {where}|Muted|My animations|My icons|My icons ({n})|My shapes|My shapes ({n})|Name|Name and state|Name, current value and time span under the graph.|Narrow|Narrow, 400 pixels|Navigate|Navigation|Navigation is off in Preview|Navigation path|Navigation path copied|Needs {kind}|New Year|No CSS property matches \"{query}\".|No appearance rules|No attributes found|No cards found|No conditions yet. The rule applies once a condition is added and matches.|No config available to save.|No entities found|No entity|No entity.|No entity: the line always flows at its speed.|No fonts found|No header text|No icons found|No icons found. Type a full id, such as mdi:fan.|No items found|No media sources available|No modules in this category.|No modules match \"{query}\".|No other column to move to|No other module type to replace with|No preview of this card to open yet|No rows yet|No saved icons yet. Draw an icon, then choose Save to library in the editor.|No saved shapes yet. Make a custom shape, then choose Save as shape.|No services found|No settings for this module.|No tab is disabled yet. Tick tabs under Bar > Disabled tabs in Default.|No template|No templates saved|No visual editor available for this card type. Configure using YAML:|None|Normal|North|Not equals|Not found in My animations. The card plays its embedded copy if it has one.|Not found. My animations needs the Magic Card Utils integration; the card plays its embedded copy if it has one.|Not linked to a template|Not set|Not set in this rule: Default applies.|Notch|Nothing chosen yet. To use the card's device, set it in {link}.|Nothing differs from the template|Nothing set. This state looks like Default.|Now using {name} from the {source}.|Now using {name}.|Now: {device}.|Number|Number of forecasts|Numeric ({example})|Octagon|Off|Off switch|On change|On load|On tap|On the line|On top|On top, {anchor}|One of the row's column widths.|Only fields you set override. Leave blank to fall through to the base settings.|Only this card|Opacity|Opacity percent|Open Conditions|Open Design|Open color picker|Open it from any button: tap action Navigate to {path}, or Open pop-up.|Open pop-up|Open studio|Open when|Opens the Magic Card pop-up with this ID (navigates to {path}).|Opens when the entity changes to this state, e.g. a doorbell turning on.|Operator|Option {n}|Optional|Organic|Out to {parent}|Outline|Outside|Over content|Over the content, dimmed. Taps still reach the content.|Overridden|Overridden locally. Click to re-sync from the template.|Override appearance fields while conditions match. Rules apply in order; later rules win.|Override dashboard theme|Overwrite|Own entity|Own module list, not synced with the template|Own module list: not synced with the template. Reset column restores it.|Padding|Pagination|Panel|Panel, full width|Parts of the SVG with class=\"mc-accent\".|Parts of the icon drawn in Accent in the icon editor.|Paste design|Paste module|Paste module after|Paste the copied design|Pattern|Pause button|Pause preview motion|Paused off-screen and with reduced motion.|Pauses while the entity is off or unavailable.|Percent, 0 is no darkening.|Pick a color from the screen|Pick a device|Pick a module|Pick an entity: Auto animates the icon from its state.|Pick an entity: a fill without a value stays empty.|Pick an entity: a value background without one draws nothing.|Pick an entity: a value label needs one.|Pick an entity: a value ring without one stays empty.|Pick an entity: this condition never plays without one.|Pick an entity: this condition never shows the ring without one.|Pick another random blob|Pick one|Pick the end module|Pick the start module|Pick the state icons (Icon when on / off) to morph between; unset sides use the module's icon.|Pick {kind}|Pick {name}|Picture|Picture elements|Picture entity|Picture glance|Pill|Pills|Placement|Placement: put behind others, put on top, back to normal|Plant monitor display|Plant status|Play|Play, pause, sound and full screen on the live stream.|Plays behind the other modules in the same column or layout. On its own in a column it shows at its own size.|Plays while the card is visible (not with reduced motion).|Points per hour|Pop-up|Pop-up ID|Position|Poster image URL|Prefix|Preset|Presets|Preview|Preview (Esc to return)|Preview date|Preview not updated: {error}|Preview pop-up|Preview the card with live actions|Preview: actions are live|Primary color|Problem|Pulse|Put behind others|Put on top|Quarter|Quick overview of entities|Radial|Range {n}|Re-sync {overrides}|Redo|Redo (Ctrl+Y)|Refresh every (seconds)|Remaining|Remove color|Remove color {n}|Remove condition|Remove condition {n}|Remove option|Remove rule|Remove stop {num}|Remove {value}|Removing a column moves its modules into the column to its left.|Rename|Rendered Markdown text|Repeat|Repeat count|Replace design|Replace with {name}|Replace with…|Replaced {old} with {new}.|Replaced {old} with {new}. All modules are in the first tab.|Replaced {old} with {new}. The modules of all {n} tabs are kept in tab order.|Reset|Reset card to template…|Reset column to template…|Reset layout to template…|Reset row to template…|Reset section|Reset section Icon effects|Reset section {name}|Reset the whole card to the template? All your changes are lost.|Reset to animation|Reset to preset|Reset to template|Reset to template…|Reset {group} in {state}|Reset {name} to the template? Changes to all its modules are lost.|Reset {name} to the template? Your changes to it are lost.|Reset {state}|Resets Default values only.|Resize between Column {a} and Column {b}|Resize window|Restore size|Resume preview motion|Retry|Reverse|Reverse when negative|Right|Ring|Ring color|Ring color from this remaining % up; overrides Color.|Ring color from this value up; overrides Color.|Ring mode|Round|Rounded|Route|Row name|Row {n}|Row {row} / Col {col}|Row {row} Column {column}|Row {row} column {column} actions|Rows hold columns, columns hold modules.|Rule|Rule name|Rule {n}|Rule: {name}|Rule: {name}, active tab|Rule: {name}, disabled tab|Runs when the row is tapped outside a module with its own action or control.|SVG markup|Same as Default|Same as Where in Look.|Same as {source}|Same on all sides|Save|Save as shape|Save current color|Save to template|Saved as {name}. Find it under My shapes.|Saved colors|Saved icon \"{name}\" was not found. The card shows the default icon.|Scale width|Search CSS properties|Search CSS properties, e.g. padding|Search attributes|Search cards|Search entities|Search fonts|Search icons|Search modules|Search services|Search templates|Seasonal|Seasonal scene|Seasons|Secondary color|Secondary info|Seconds for a dot to travel the line: Speed at Max, Min speed just above Min.|Seconds without interaction. Empty: stays open.|Section heading|Seed|Select|Select attribute|Select card|Select entity|Select font|Select icon|Select layer above|Select layer below|Select media|Select service|Select {label}|Selected {name}, {n, select, 1 {1st} 2 {2nd} 3 {3rd} other {{n}th}} from the front here|Sensor|Sensor with graph|Service|Service data|Services|Sets {attributes}; empty: {fallback}.|Settings|Shake|Shape|Shape applied.|Shape source|Share with tiles inside|Shared with tiles inside|Sheet|Shopping list|Shopping list card|Short ({example})|Show|Show all|Show area devices and entities|Show as pop-up|Show brightness|Show cards based on conditions|Show close button|Show code editor|Show color picker|Show color temp|Show condition|Show controls|Show date|Show effects|Show forecast|Show icon|Show in tree|Show labels|Show layers|Show name|Show needle|Show on dashboard|Show points|Show precipitation|Show seconds|Show state|Show tab on dashboard|Show temperature|Show this card when…|Show this column when…|Show this module when…|Show this row when…|Show this rule when…|Show unit|Show value|Show visual editor|Show wind|Showing {shown} of {total}. Refine the search to see more.|Showing: {state}|Shown until the video plays, and instead of it when it cannot play.|Shown while the card has motion. Viewers can pause it.|Shows Auto on another day in this preview only. Not saved.|Shows an entity's state or name instead of the text.|Shows the entity's picture (person, image, camera, media player).|Shows the entity's state (or the attribute picked below) next to the label.|Shuffle|Side cut|Single entity display|Size|Slider color|Slides per view|Slot {n}|Smoothing|Snake|Snapshot|Snapshot refresh (seconds)|Snow|Snow, rain, a storm, sun, clouds, fog or wind, from its state.|Solid|South|South flips the seasons.|Space around|Space between|Space between slides (px)|Sparkline|Speed|Speed (s)|Spin|Spring|Squircle|Stack cards horizontally|Stack cards vertically|Stars and fireflies at night, a warm glow at dusk and dawn (sun.sun), nothing by day.|Start|Start: attach to|State|State (no attribute)|State color|State icons|State icons: the icon while the entity is on or off. Empty: the module's icon.|State value|State, e.g. on (empty: any change)|Statistic|Statistics graph|Step|Stop {num} color|Stop {num} of {n}|Straight|Strength (%)|Stretch|Structure|Style|Styles are removed; use fill attributes (for example fill=\"#f44336\") for colors.|Suffix|Summer|Swing|Switched to Solid. Undo brings the gradient back.|Synced with template|Synced with the template. Click to keep a local value that won't sync.|Tab|Tab name|Tab style|Tab {n}|Tabs|Tap|Tap the icon to turn the light on or off. Leave Icon empty to show the light's own icon.|Target|Target entity|Template|Template actions|Template animations|Template name|Template name is required.|Text|Text uses this gradient as its fill. Older tablets show the first color.|That is not an entity id. It needs a dot, like light.kitchen. To switch the entity off, use No entity.|The SVG is larger than 32 KB.|The animated icons could not be loaded. Try again.|The arc takes the color of the highest range at or below the value.|The area fades out upwards. The line stays faint ({pct}%) so text over it stays readable.|The attribute holds the image URL; it replaces the entity picture and the image URL.|The bar takes the color of the highest range at or below the value; the bar color applies below the first range.|The blob morphs slowly.|The card clips its edge: the ring sits inside it and its glow shows inward.|The color along these stops follows the value: Liquid fill's entity, min and max, else the module's entity from 0 to 100.|The device this card is for. Tiles follow it unless you set one for them.|The empty part uses the color {colour} (set in YAML); a value here replaces it.|The entity's state color|The icon editor could not load. Check your connection and try again.|The icon editor could not load. Try again.|The icon uses this gradient as its fill. Older tablets show the first color.|The library could not load. Check your connection and try again.|The library is full. Delete a shape first.|The modules inside this layout; the layout's modules differ from the template.|The modules inside this layout; they follow the template as one list.|The quick brown fox jumps over the lazy dog|The shape clips anything that pops out of the module, like dropdowns and tooltips.|The shape editor could not load. Check your connection and try again.|The shape replaces Border radius here.|The studio canvas shows a snapshot; the dashboard plays the stream (muted).|The thermostat keeps a range (low / high): pick target_temp_low or target_temp_high as the attribute to set one end.|The visual editor does not support this configuration: {error}|The waves flow along the edge.|The {key} key is set automatically from Card Type. Do not include it here.|Theme default|Thermostat|This SVG contains {list}. Remove it and try again.|This SVG contains {list}. Remove them and try again.|This card|This card is linked to template {name}. Do you want to update all linked cards with this structural change?|This card now has its own copy.|This card uses only its own custom_animations.|This entity has no daily forecast; its first forecast type is shown. The Forecast module offers more options.|This entity has no options a dropdown can set (use an input select, select, input text or text with custom options, climate, fan, light, media player, water heater or humidifier).|This entity has no {type} forecast; {fallback} is shown.|This is custom gradient CSS. Choose Gradient to replace it with the editor's version.|This light has no {what}; the control is hidden.|This line look is wide, so it attaches to the module box until you pick Icon or picture.|This module is part of its layout; the layout's modules differ from the template.|This module is part of its layout; they follow the template as one list.|This shape can not be saved.|This tile needs {kind}. The {source}'s device is {thing}, so the tile stays empty.|This tile shows no device.|This value can only be shown: the entity (or this attribute) cannot be set from a slider.|This value can only be shown: the entity (or this attribute) cannot be set from a spinbox.|Thresholds|Ticket|Ticket, Wave and Blob can not be edited yet. Use the preset as it is.|Tile|Tiles inside follow this entity unless they pick their own.|Tiles inside get no entity unless they pick one.|Tiles that follow the card will show it.|Time|Time format|Timer fill|Title|To|To side|To-Do List|To-do list card|Toggle|Toggles {entity} (the module entity).|Top|Top left|Top right|Track color|Track opacity (%)|Try again|Turn off to pick a theme for this card only.|Twice daily|Type|URL|Underline|Undo|Undo (Ctrl+Z)|Unit|Unknown module type|Unlink from template|Untitled card|Up|Up to 168 (a week).|Up to 32 KB. Parts with fill=\"currentColor\" take the icon color, parts with class=\"mc-accent\" the accent color.|Up to twice the width at Max.|Up to {max} stops|Update all linked cards|Update linked cards?|Upload SVG|Use|Use Default value|Use Jinja2 templates: {example}|Use MM-DD..MM-DD, like 12-01..12-26, or off.|Use No entity|Use a copy of {name}|Use a hex color, rgb(a) or var(--name).|Use a ratio like 16:9, 4/3, 1.5 or 56.25%. 16:9 is used until then.|Use as copy|Use at most 80 characters.|Use dashboard theme|Use entity|Use entity color|Use entity color wins while the entity has a state color; this color applies otherwise.|Use entity icon|Use entity picture|Use follows the library: change a shape and every card that uses it changes. Use as copy makes this card independent.|Use module entity|Use own color|Use template|Use the entity's state color|Use {name}|Use {value}|Used until the stream player is available.|Uses {n} of your animations.|Using a copy of {name}.|Using {name}. Changes to it reach every card that uses it.|Valentine|Value|Value and route|Value background|Value background type|Values are averaged per period (2 = every 30 minutes). Empty draws every recorded change.|Vertical|Vertical alignment|Vertical stack|Video URL|View|View type {type} isn't supported|Viewers can't pause the motion on this card. Turn the button on if anything moves for more than 5 seconds.|Visibility|Wave|Wave edge|Wave height|Waves|Weather|Weather entity|Weather forecast|Weather forecast card|Which device is this card for?|While entity is on|While flowing|While state equals…|Wide|Wide, 800 pixels|Width|Width (px)|Winter|With no entity of its own, the row uses the card's.|With nothing else shown, the state is shown anyway.|Without a copy, the card plays nothing if Magic Card Utils or this animation is removed.|Without a copy, the card shows the default icon if Magic Card Utils or this icon is removed.|Without an ID it opens only from its triggers.|Wobble|Wrap in layout|YAML|YAML copied with your animations.|YAML copied.|YAML copied. Not embedded (not found): {ids}.|YAML. Leave empty to call the service without data.|YYYY year, MMMM / MMM month name, MM / M month, DD / D day, dddd / ddd weekday. Text in [brackets] is kept as is.|Your account can use the library but not change it. Ask an admin.|Your own|a camera|a device|a different kind of device|a javascript: link|a light|a list of options|a script|a sensor|a switch|a weather source|attribute|brightness|card|color|color temperature|colors|column|custom widths|effects|equals|event handlers|external references|Fill|fr shares the free space. Use Custom for auto (as wide as the content). % widths plus gap can overflow the row.|from {value}|hidden|layout {layout}|light text on theme accent|Solid|none|not equals|preview|row|slides|tabs|the HVAC mode|theme accent|this card|this column|this module|this row|today|{angle} degrees|{from} to {to}|{id} (not found)|{id} (unknown)|{label} (no id)|{label} entity|{label} source|{label} unit|{label}: state|{list} and {last}|{min} to {max}|{mods, plural, one {# module} other {# modules}}|{module} pasted into {where}|{n, plural, one {# column} other {# columns}}|{n, plural, one {# column} other {# columns}}, custom widths|{n, plural, one {# conditional rule} other {# conditional rules}}. Rules override Default only while their conditions match.|{n, plural, one {# conditional rule} other {# conditional rules}}. Same rules as the Conditions tab. Rules override Default only while their conditions match. A later rule wins over an earlier one.|{n, plural, one {# field differs} other {# fields differ}} locally.|{n, plural, one {# icon found} other {# icons found}}|{n, plural, one {# layer} other {# layers}}|{n, plural, one {# module} other {# modules}}|{n, plural, one {# override} other {# overrides}}|{n, plural, one {# row} other {# rows}}|{n, plural, one {# setting it does not support was} other {# settings it does not support were}} removed. Undo to get them back.|{n, plural, one {# tile follows it.} other {# tiles follow it.}}|{n, plural, one {# tile needs another device.} other {# tiles need another device.}}|{n, plural, one {Embed it to share this card with another Home Assistant.} other {Embed them to share this card with another Home Assistant.}}|{n, plural, one {module} other {modules}}|{name} (not found)|{name} (not played on tabs)|{name} ({id})|{name} ({n} set)|{name} YAML|{name} YAML copied|{name} actions|{name} copied|{name} design copied|{name} gradient type|{name} mode|{name} opacity|{name} {slot}|{name}, Behind others|{name}, On top|{name}: color from|{note}, or pick another. Escape cancels.|{note}, or pick another. {key} cancels.|{n} B|{n} changed|{n} columns, {ratio}|{n} cond.|{n} set|{rows, plural, one {# row} other {# rows}} · {mods, plural, one {# module} other {# modules}}. Build visually with layers, canvas and the full inspector.|{size} KB|{state} reset|{title}. Press Ctrl+C (⌘C on a Mac) to copy.|{type} (not provided by this entity)",'"{value}" is geen van de opties van de entiteit.|**Vet**, _cursief_, `code`|+ {n, plural, one {# ontwerpveld} other {# ontwerpvelden}}|, getoond op {px} px|0 stippen: in plaats daarvan bewegende streepjes.|0 is rond, 1 is het meest onregelmatig.|1 kolom|1 is ronder, 0 is vierkanter.|12-uurs|24-uurs|<svg viewBox="0 0 24 24">…</svg>|<use> en <image> worden niet ondersteund. Teken de vormen als paden en probeer het opnieuw.|Een achtergrondafbeelding vervangt hier een kleurverloop. Verwijder de afbeelding om een kleurverloop te gebruiken.|Een gebogen lijn in plaats van rechte stukken.|Een kleurverloop heeft minstens 2 kleurpunten nodig|Een negatieve waarde laat de stippen van het einde naar het begin lopen.|Een voorinstelling die in deze kaart is opgeslagen.|Een rij heeft minstens één kolom nodig|Een rij, kolom of indeling om deze tegel heeft Geen entiteit, dus er valt niets te volgen.|Een tabbladmodule heeft minstens één tabblad nodig|Er bestaat al een sjabloon met de naam "{name}".|Er bestaat al een sjabloon met de naam "{name}". Overschrijven?|Accentkleur|Actie|Actieknop voor een entiteit|Acties|Actief tabblad|Toevoegen|Voeg een voorwaarde toe om deze kaart alleen te tonen wanneer dat nodig is.|Voeg een voorwaarde toe om deze kolom alleen te tonen wanneer dat nodig is.|Voeg een voorwaarde toe om deze module alleen te tonen wanneer dat nodig is.|Voeg een voorwaarde toe om deze rij alleen te tonen wanneer dat nodig is.|Voeg een voorwaarde toe om deze regel alleen te gebruiken wanneer dat nodig is.|Voeg een regel toe om het uiterlijk te wijzigen wanneer aan voorwaarden wordt voldaan.|Animatie toevoegen|Uiterlijkregel toevoegen|Kleur toevoegen|Kolom toevoegen|Kolom toevoegen aan rij {row}|Kolom toevoegen aan {name}|Voorwaarde toevoegen|Voorwaardelijke regel toevoegen|Stroom toevoegen|Stroom vanaf hier toevoegen|Stroom vanaf hier toevoegen. {hint}|Module toevoegen|Module toevoegen aan rij {row}, kolom {column}|Module toevoegen aan {where}|Optie toevoegen|Bereik toevoegen|Rij toevoegen|Kleurpunt toevoegen|Tabblad toevoegen|Tabblad toevoegen aan {name}|Module {name} toevoegen|Voeg tabbladen toe, hernoem en orden ze, en voeg hun modules toe in de structuurboom.|Geavanceerd|Na|Ga na de laatste dia terug naar de eerste|Alarmbedieningspaneel|Alarmpaneel|Uitlijnen|Alle|Alles komt overeen (EN)|Afwisselend|Afwisselend omgekeerd|Altijd|Altijd getoond, ook als er niets beweegt.|Altijd zichtbaar|Amplitude (%)|Een geanimeerd pictogram dat in deze kaart is opgeslagen.|Een geanimeerde golf op het oppervlak. Stil bij verminderde beweging.|Een attribuutgrafiek laadt elke opgeslagen status met al zijn attributen; lange perioden kunnen traag laden.|Een input_boolean of schakelaar: uit verbergt de scène, op elke kaart die hem gebruikt.|Een geopende pop-up behoudt een rechthoekig oppervlak.|Een optioneel label om deze kaart in de editor te herkennen.|Hoek|Hoek (gr.)|Hoek in graden|Animeren|Geanimeerd|Geanimeerde pictogrammen|Geanimeerde lijnen tussen twee modules, bijvoorbeeld van zonnepanelen naar huis. Snelheid, dikte en richting kunnen de waarde van een entiteit volgen.|Geanimeerde weerpictogrammen in plaats van statische|Geanimeerde weerpictogrammen vervangen pictogrameffecten.|Geanimeerde weerpictogrammen vervangen pictogrameffecten. Je pictogrameffecten staan stil en komen terug zodra Geanimeerde pictogrammen uit staat.|Animeert het pictogram zoals het apparaat dat het toont.|Animatie|Animatiekleur|Animatie {n}|Animaties|Eén komt overeen (OF)|Uiterlijk overschrijven|Toegepast op het actieve tabblad, bovenop Standaard en overeenkomende regels. Alleen deze instellingen gelden voor dit tabblad.|Toegepast op de inhoud van de kaart, bijv. letter-spacing: 0.5px|Toegepast op de uitgeschakelde tabbladen, bovenop Standaard en overeenkomende regels. Alleen deze instellingen gelden voor die tabbladen.|Alleen toegepast op {thing}|Toegepast zolang de aanwijzer boven deze kaart staat, bovenop Standaard en overeenkomende regels.|Toegepast zolang de aanwijzer boven {thing} staat, bovenop Standaard en overeenkomende regels.|Gebied|Dekking van het gebied|Ordenen|Beeldverhouding|Assist|Koppelen aan|Attribuut|Attributen|Attributen van {id} ({source})|Auto|Auto ({when}: {scene})|Automatisch sluiten|Auto voor deze entiteit: {rule}.|Auto heeft geen animatie voor deze entiteit; kies er een.|Auto toont een feestdag tussen deze datums (inclusief), anders het seizoen. Een bereik mag over de jaarwisseling lopen. Typ off om een feestdag over te slaan.|Automatisch|Automatisch ({format}, uit je profiel)|Automatisch: Palmzondag tot Tweede Paasdag, voor elk jaar berekend.|Automatisch afspelen|Vertraging automatisch afspelen (ms)|Herfst|Terug|Terug naar dialoogvenster|Terug naar normaal|Achtergrondvervaging|Dekking van de achtergrond|Achtergrondkleur|Achtergrondafbeelding|Achtergronden veranderen niet bij aanwijzen.|Achtergrond van de balk|Kleur van de balk|Hoogte van de balk|Balkinstellingen gelden voor elk tabblad en staan onder Standaard.|Balkinstellingen gelden voor elk tabblad en staan in de regel.|Voor|Achter de inhoud|Achter andere modules|Onder 1 vervaagt de hele kaart, tekst inbegrepen, en dat verlaagt het contrast.|Naast de lijn|Blob|Vervaagt wat achter de kaart zit. Het is alleen te zien door een doorzichtige achtergrond, bijvoorbeeld rgba(0, 0, 0, 0.3).|Randdecoraties|Randafronding|Onder|Linksonder|Rechtsonder|Slagschaduw|De slagschaduw volgt de vorm als valschaduw (alleen de eerste schaduw).|Bladeren|Entiteiten bekijken|Pictogrammen bekijken|Media bekijken|Services bekijken|Browsers spelen alleen video\'s zonder geluid automatisch af.|Ingebouwd|Ingebouwde kaarten|Ingebouwd: {value}|Knop|Knopstijl|Agenda|Agendaweergave|Service aanroepen|Camera-entiteit|Annuleren|Canvasbreedte|Canvas, live voorbeeld|Canvas, {label} geselecteerd|Uiteinden|Kaart|Achtergrond van de kaart|De achtergrondlagen van de kaart liggen bovenop deze kleur en afbeelding.|Achtergrond van de kaart, laag {n}|Kaartconfiguratie|Kaartentiteit|Kaarthoogte|Kaartmodules volgen de entiteit van de kaart niet.|Kaartnaam|Kaartinstellingen|Kaartinstellingen > Algemeen|Kaartstructuur|Kaartthema|Kaarttype|Kaarten|Midden|Wijzig kaartvelden, zoals de achtergrondkleur, zolang aan voorwaarden wordt voldaan. Voor ring, vorm en meer gebruik je een ontwerpregel op het tabblad Ontwerp.|Gewijzigd op deze kaart|Jagende stippen|Kerst|Cirkel|Wissen|Alle pictogrameffecten wissen|Alle waarden in deze sectie wissen|Zoekopdracht wissen|Klik op een module om die te selecteren. {move} verplaatst de module, {remove} verwijdert de module, {menu} opent het menu.|Klik op de module waarmee je wilt verbinden. Escape annuleert.|Klik op de module waarmee je wilt verbinden. {key} annuleert.|Klimaatbedieningskaart|Met de klok mee|Sluiten|Pop-up sluiten|Sluiten wanneer|Sluit de geopende Magic Card-pop-up (ook vanuit de pop-up zelf).|Sluit wanneer de entiteit naar deze status verandert.|Stroom {n} inklappen|Rij {n} inklappen|Regel inklappen|Kleur|Kleurnotatie|Kleur van|Kleurkiezer|Kleurbereiken|Kleurstijl|Kleur {n}|Kleurt het pictogram zoals Home Assistant dat doet voor de status van deze entiteit.|Kolom|Kolomindeling|Kolomnaam|Kolombreedtes|Kolom {a} {wa}, kolom {b} {wb}|Kolom {n}|Breedte van kolom {n}|Combineren met|Compacte modus|Compacte tegelkaart|Overeenkomst van voorwaarden|Type voorwaarde|Voorwaarde {n}|Voorwaardelijk|Voorwaardelijk uiterlijk|Voorwaarden|Verbinding|Passend|Inhoud|Bediening|YAML kopiëren|Kopieer eerst een ontwerp|Kopieer eerst een module|Kopiëren en plakken|Ontwerp kopiëren|Kopiëren mislukt: selecteer het pad en kopieer het|Module kopiëren|Navigatiepad kopiëren|Kopieer deze YAML|Kopiëren mislukt: de browser heeft het klembord geblokkeerd.|Hoek|Hoekgrootte|Het sjabloon kon niet worden geladen, dus de kolom is niet teruggezet.|Magic Card Utils is niet bereikbaar. Probeer het opnieuw.|De lijnstijlen konden niet worden geladen.|De sliderstijlen konden niet worden geladen.|Kan het weergavetype niet bepalen|Tegen de klok in|Vullend|Sjabloon maken|Sjabloon maken van deze kaart|Curve|Aangepast|Aangepaste CSS|Eigen SVG|Eigen kaart|Eigen kaarten (HACS)|Eigen opties|Eigen patroon|Eigen vorm|Aangepaste breedtes|Een kopie aanpassen|Dit pictogram aanpassen|Afgesneden hoeken|Snijgrootte|Grootte van de uitsparing|Dagelijks|Standaard van het dashboard|Gestreept|Datumnotatie|Datumpatroon|Dag en nacht|Decimalen|Standaard|Standaard stelt een effen kleur in, dus een regel kan die niet door een kleurverloop vervangen. Wis eerst de standaardkleur.|Standaardtabblad|Verwijderen|Vertraging|Verwijderen|Verwijderen (Del)|Animatie verwijderen|Animatie {n} verwijderen|Kolom verwijderen|Kolom "{name}" en de {n, plural, one {# module} other {# modules}} erin verwijderen?|Stroom verwijderen|Stroom {n} verwijderen|Bereik verwijderen|Bereik {n} verwijderen|Rij verwijderen|Regel verwijderen|Tabblad verwijderen|Tabblad "{name}" en de {n, plural, one {# module} other {# modules}} erin verwijderen?|Sjabloon verwijderen|Sjabloon {name} verwijderen|Dichtheid (%)|Beschrijving (optioneel)|Ontwerp|Ontwerp gekopieerd|Ontwerp geplakt|Apparaatanimatie|Dialoogvenster|Bedoelde je Geen entiteit?|Richting|Uitgeschakeld tabblad|Weergave|Een afbeelding tonen|Weergavevoorwaarden|Klaar|Stipgrootte (px)|Stippen|Gestippeld|Dubbeltikken|Omlaag|Sleep om het formaat te wijzigen, dubbelklik voor gelijke breedtes|Een pictogram tekenen|Tekenduur|Teken je eigen SVG-pictogram in plaats van er een uit de pictogramlijst te kiezen.|Langs de rand getekend; de inhoud blijft ervan vrij.|Trommel|Duotone|Dupliceren|Dupliceren (Ctrl+D)|Rij dupliceren|Duur|Versnelling|Pasen|Paasdata automatisch|Rand|Bewerken|Bewerken als eigen vorm|Kaartinstellingen bewerken|Pictogram bewerken|Vorm bewerken|Sjabloon bewerken|Sjabloon {name} bewerken|Ontwerp bewerken voor|Editormodus|Effecten|Effecten hebben de vorm van het pictogram nodig; dit pictogram kon niet worden geladen (of is een logo in meerdere kleuren), dus het wordt ongewijzigd getoond.|Verstreken|Haaks|Een webpagina insluiten|Mijn animaties insluiten|Lege kolom|Dekking van het lege deel (%)|Leeg gebruikt de entiteit van de module ({entity}).|Leeg: het eigen bereik en de eigen stap van de entiteit. Min en max kunnen dat bereik alleen verkleinen.|Leeg: het eigen bereik en de eigen stap van de entiteit. Min en max kunnen dat bereik alleen verkleinen; een stap die geen veelvoud is van de stap van de entiteit wordt vervangen door die van de entiteit.|Leeg: de entiteit van de module ({entity}).|Leeg: de primaire kleur op {pct}%.|Einde|Einde: koppelen aan|Eindigt bij {value} (ingesteld in YAML).|Entiteiten|Entiteit|Entiteit (voor sjablonen)|Entiteitskleur|Entiteitskleur voor {name}|De entiteit past niet bij deze module|Entiteitenfilter|Entiteit voor afspeelvoorwaarde|Entiteit voor weergavevoorwaarde|Entiteit voor statussen en waarden|Geschiedenisgrafiek van een entiteit|Logboekregels van een entiteit|Bron van de entiteit|Entiteit met achtergrondafbeelding|Gelijke breedtes|Equalizer|Is gelijk aan|Elke wijziging|Stroom {n} uitklappen|Rij {n} uitklappen|Regel uitklappen|Extra scènes die erbovenop worden gelegd, zoals Dag en nacht tijdens de winter.|Sjabloon verwijderen mislukt.|Sjabloon opslaan mislukt.|Vullen|Vulkleur|Vulrichting|Dekking van de vulling|Vul het gebied onder de lijn.|Vulovergang|Vult het pictogram als een vloeistof met een waarde, bijvoorbeeld een batterijniveau.|Items filteren|Gefilterde entiteitenlijst|Aanpassing|Vlam|Plat|Stroom {n}|Stromen|Volgt het licht|Volgt een weerentiteit: die van de module, of de entiteit die bij Entiteit voor afspeelvoorwaarde is gekozen.|Lettertypefamilie|Lettertypebron|Lettertypen|Voorspellingsdagen|Type voorspelling|Formulier|Van|Vanaf zijde|Uit sjabloon|Van {source}: {name}|Voor|Vol|Vol (cirkel)|Volledig gesynchroniseerd.|Tussenruimte|Tussenruimte tussen kolommen|Meter|Meterstijl|Meterweergave|Algemeen|Geef het een naam.|Geef deze module een id in het sjabloon|Overzicht|Gloed|Gloed (px)|Naar Standaard|Naar de regel|Google|Google Fonts|Kleurverloop|Kleuren van het verloop|Kleurverloop gemaakt van je kleur.|Een kleurverloop vraagt om een leeg veld Achtergrond. Wis dat om hier een kleurverloop te gebruiken.|Voorbeeld van het kleurverloop|Kleurverloop vervangen door de versie van de editor.|Raster|Rasterindeling van kaarten|Half (halve cirkel)|Halloween|Heeft lokale afwijkingen|Kop|Hallo wereld|Halfrond|Zeshoek|Verborgen|Verborgen op dashboard|Verborgen op het dashboard; opent erboven via de #ID, een trigger of een actie Pop-up openen.|Verbergen|Lagen verbergen|Verbergen op dashboard|Tabblad verbergen op dashboard|Geschiedenisgrafiek|Geschiedenis die niet geladen kan worden, tekent niets.|Vasthouden|Data van feestdagen|Feestdagen|Verbinding met Home Assistant niet beschikbaar.|Horizontaal|Horizontale stapel|Elk uur|Uren|Uren om te tonen|Hover|Hoeveel deeltjes: 100% is 24, het maximum dat een scène tekent.|Tint|Luchtbevochtiger|Bediening luchtbevochtiger|ISO ({example})|Pictogram|Pictogram toegepast.|Pictogramkleur|Pictogrameffecten|Alleen pictogram|Pictogram of afbeelding|Pictogram of afbeelding laat de lijn eindigen bij het pictogram, de afbeelding of de meter van de module. Modulevak laat de lijn eindigen aan de rand van de module.|Pictogrambron|Pictogram als actief|Het pictogram voor actief stel je per tabblad in via de structuurboom.|Pictogram als uit|Pictogram als aan|Pictogrammen|Pictogrammen uit|Kleur bij inactiviteit|Afbeelding|Afbeeldings-URL|Afbeelding uit attribuut|Afbeelding met entiteitspictogrammen|Afbeelding met interactieve elementen|In px, of % van de kortste zijde.|Gesynchroniseerd|Oneindig|Overnemen ({value})|Overgenomen entiteit|Overgenomen van Standaard: {value}|Binnen|Inspecteur|Intensiteit|In {container}|Ongeldige YAML - de kaart gebruikt de laatste geldige configuratie|Verdelen|Bewaar een kopie in deze kaart (voegt {size} toe)|Bewaar een kopie in deze kaart ({size})|Bewaar je eigen pictogrammen: installeer de gratis Magic Card Utils-add-on.|Bewaar je eigen vormen voor elk dashboard met de gratis Magic Card Utils-add-on. Tot die tijd wordt deze vorm alleen in deze kaart opgeslagen.|Label|Positie van het label|Labelsjabloon|Laag|De laaginstellingen konden niet worden geladen. Laad de pagina opnieuw.|Lagen|Lagen hier ({n})|Indeling|Indeling {layout}|Laat leeg om het pictogram van het tabblad te behouden.|Laat leeg om de eigen opties van de entiteit aan te bieden. Eigen opties hernoemen of kiezen daaruit; een waarde die de entiteit niet aanbiedt wordt uitgeschakeld getoond.|Links|Lengte (%)|Bibliotheek|Lamp|Lampbedieningskaart|Lichtjes, ijspegels, rijp, een spinnenweb, een pompoen of een bloemenranken langs de rand, voor de scènes die ze hebben. De inhoud blijft ervan vrij.|Lijnkleur|Lijn tekenen|Lijndikte|Lijndikte (px)|Lineair|Gekoppeld aan sjabloon {name}.|Gekoppeld aan de opgeslagen vorm {name}. Wijzig hem daar en elke kaart die hem gebruikt verandert mee.|Vloeistofvulling|Lijst met entiteitsrijen|Live|Live gegevens|Laden|"{name}" laden? Dit vervangt je huidige configuratie.|Sjabloon laden|Sjabloon laden…|Laden|Mijn animaties laden…|Editor laden|Editor laden...|Pictogrammen laden…|Laaginstellingen laden…|Lijnstijlen laden...|Sliderstijlen laden...|Sjablonen laden...|Laden...|Laden…|Lokaal|Lokale lettertypen|Logboek|Lang ({example})|Langetermijnstatistiek|Uiterlijk|Herhalen|Magic Card Utils-sjablonen bevatten deze nooit. Een sjabloon toepassen laat de entiteit van deze kaart staan.|Magic Card-integratie niet gevonden. Installeer die via HACS en voeg de integratie toe.|Magic Card-studio|Een eigen vorm maken|Maakt je eigen kopie. Het origineel blijft in {pack}.|Kaart|Kaart met entiteitslocaties|Marcherende mieren|Markdown|Markdown met Home Assistant-sjablonen, bijvoorbeeld {example}. Met een ingestelde entiteit toont {entity} de status ervan.|Overeenkomst|Weergave volgen|Komt overeen met deze weergave (masonry)|Komt overeen met deze weergave (paneel)|Komt overeen met deze weergave (secties)|Komt overeen met deze weergave (secties, {columns} van 12 kolommen)|Komt overeen met deze weergave (zijbalk)|Material Design Icons|Material Design-pictogrammen|Max|Maximale hoogte|Maximaliseren|Media|Media-URL of pad|Mediabediening|Mediamappen|Mediaspelerbediening|Gemiddeld ({example})|In ontwerp samenvoegen|Geplakt ontwerp samenvoegen|Min|Min. snelheid (s)|Min, Max en Attribuut gelden niet voor een timer; drempels gebruiken het resterende %.|Modus|Module|Module-acties|Modulevak|Modulecategorie|Entiteit van de module ({entity})|Modulenaam|Module niet gevonden|Module niet gevonden ({id})|Module-opties voor {name}|Module {n}|Modules met (geen id) komen uit het sjabloon. {hint} om te verbinden.|Meer info|Overvloeien|Vloeit over tussen de statuspictogrammen wanneer de entiteit aan of uit gaat.|Beweging|Omlaag|Omlaag (Alt+Down)|Verplaatsen naar…|Omhoog|Omhoog (Alt+Up)|Venster verplaatsen|{name} verplaatst naar {where}|Geluid uit|Mijn animaties|Mijn pictogrammen|Mijn pictogrammen ({n})|Mijn vormen|Mijn vormen ({n})|Naam|Naam en status|Naam, huidige waarde en tijdsbereik onder de grafiek.|Smal|Smal, 400 pixels|Navigeren|Navigatie|Navigeren staat uit in het voorbeeld|Navigatiepad|Navigatiepad gekopieerd|Heeft {kind} nodig|Nieuwjaar|Geen CSS-eigenschap komt overeen met "{query}".|Geen uiterlijkregels|Geen attributen gevonden|Geen kaarten gevonden|Nog geen voorwaarden. De regel geldt zodra er een voorwaarde is toegevoegd die overeenkomt.|Geen configuratie beschikbaar om op te slaan.|Geen entiteiten gevonden|Geen entiteit|Geen entiteit.|Geen entiteit: de lijn stroomt altijd met zijn snelheid.|Geen lettertypen gevonden|Geen koptekst|Geen pictogrammen gevonden|Geen pictogrammen gevonden. Typ een volledige id, zoals mdi:fan.|Geen items gevonden|Geen mediabronnen beschikbaar|Geen modules in deze categorie.|Geen modules gevonden voor "{query}".|Geen andere kolom om naartoe te verplaatsen|Er is geen ander moduletype om mee te vervangen|Er is nog geen voorbeeld van deze kaart om te openen|Nog geen rijen|Nog geen opgeslagen pictogrammen. Teken een pictogram en kies in de editor Opslaan in bibliotheek.|Nog geen opgeslagen vormen. Maak een eigen vorm en kies Opslaan als vorm.|Geen services gevonden|Geen instellingen voor deze module.|Er is nog geen tabblad uitgeschakeld. Vink tabbladen aan onder Balk > Uitgeschakelde tabbladen in Standaard.|Geen sjabloon|Geen sjablonen opgeslagen|Geen visuele editor beschikbaar voor dit kaarttype. Configureer met YAML:|Geen|Normaal|Noord|Is niet gelijk aan|Niet gevonden in Mijn animaties. De kaart speelt de ingesloten kopie af als die er is.|Niet gevonden. Mijn animaties heeft de Magic Card Utils-integratie nodig; de kaart speelt de ingesloten kopie af als die er is.|Niet gekoppeld aan een sjabloon|Niet ingesteld|Niet ingesteld in deze regel: Standaard geldt.|Inkeping|Nog niets gekozen. Om het apparaat van de kaart te gebruiken, stel je het in bij {link}.|Niets wijkt af van het sjabloon|Niets ingesteld. Deze status ziet er hetzelfde uit als Standaard.|Gebruikt nu {name} van de {source}.|Gebruikt nu {name}.|Nu: {device}.|Getal|Aantal voorspellingen|Numeriek ({example})|Achthoek|Uit|Uitschakelaar|Bij wijziging|Bij laden|Bij tikken|Op de lijn|Bovenop|Bovenop, {anchor}|Een van de kolombreedtes van de rij.|Alleen velden die je instelt overschrijven. Laat leeg om terug te vallen op de basisinstellingen.|Alleen deze kaart|Dekking|Dekkingspercentage|Voorwaarden openen|Ontwerp openen|Kleurkiezer openen|Open hem vanaf elke knop: tikactie Navigeren naar {path}, of Pop-up openen.|Pop-up openen|Studio openen|Openen wanneer|Opent de Magic Card-pop-up met deze ID (navigeert naar {path}).|Opent wanneer de entiteit naar deze status verandert, bijvoorbeeld een deurbel die aan gaat.|Operator|Optie {n}|Optioneel|Organisch|Uit naar {parent}|Omlijnd|Buiten|Over de inhoud|Over de inhoud heen, gedimd. Tikken bereiken de inhoud nog steeds.|Overschreven|Lokaal overschreven. Klik om opnieuw te synchroniseren met het sjabloon.|Overschrijf uiterlijkvelden zolang aan voorwaarden wordt voldaan. Regels gelden op volgorde; latere regels winnen.|Dashboardthema overschrijven|Overschrijven|Eigen entiteit|Eigen modulelijst, niet gesynchroniseerd met het sjabloon|Eigen modulelijst: niet gesynchroniseerd met het sjabloon. Kolom terugzetten herstelt dit.|Opvulling|Paginering|Paneel|Paneel, volledige breedte|Delen van de SVG met class="mc-accent".|Delen van het pictogram die in de pictogrameditor op Accent staan.|Ontwerp plakken|Module plakken|Module hierna plakken|Plak het gekopieerde ontwerp|Patroon|Pauzeknop|Beweging in voorbeeld pauzeren|Gepauzeerd buiten beeld en bij verminderde beweging.|Pauzeert zolang de entiteit uit of niet beschikbaar is.|Procent, 0 is geen verduistering.|Kies een kleur van het scherm|Kies een apparaat|Kies een module|Kies een entiteit: Auto animeert het pictogram op basis van de status.|Kies een entiteit: een vulling zonder waarde blijft leeg.|Kies een entiteit: een waarde-achtergrond zonder entiteit tekent niets.|Kies een entiteit: een waardelabel heeft er een nodig.|Kies een entiteit: een waardering zonder entiteit blijft leeg.|Kies een entiteit: deze voorwaarde speelt nooit af zonder entiteit.|Kies een entiteit: deze voorwaarde toont de ring nooit zonder entiteit.|Kies een andere willekeurige blob|Kies er een|Kies de eindmodule|Kies de startmodule|Kies de statuspictogrammen (Pictogram als aan / uit) om tussen over te vloeien; niet ingestelde kanten gebruiken het pictogram van de module.|Kies {kind}|Kies {name}|Afbeelding|Afbeeldingselementen|Afbeeldingsentiteit|Afbeeldingsoverzicht|Pil|Pillen|Plaatsing|Plaatsing: achter andere modules zetten, bovenop zetten, terug naar normaal|Plantmonitorweergave|Plantstatus|Afspelen|Afspelen, pauzeren, geluid en volledig scherm voor de livestream.|Speelt achter de andere modules in dezelfde kolom of indeling. Alleen in een kolom wordt het op zijn eigen grootte getoond.|Speelt af terwijl de kaart zichtbaar is (niet bij verminderde beweging).|Punten per uur|Pop-up|Pop-up-ID|Positie|URL van de posterafbeelding|Voorvoegsel|Voorinstelling|Voorinstellingen|Voorbeeld|Voorbeeld (Esc om terug te gaan)|Voorbeelddatum|Voorbeeld niet bijgewerkt: {error}|Pop-up bekijken|De kaart bekijken met live acties|Voorbeeld: acties zijn live|Primaire kleur|Probleem|Puls|Achter andere modules zetten|Bovenop zetten|Kwart|Snel overzicht van entiteiten|Radiaal|Bereik {n}|{overrides} opnieuw synchroniseren|Opnieuw|Opnieuw (Ctrl+Y)|Vernieuwen elke (seconden)|Resterend|Kleur verwijderen|Kleur {n} verwijderen|Voorwaarde verwijderen|Voorwaarde {n} verwijderen|Optie verwijderen|Regel verwijderen|Kleurpunt {num} verwijderen|{value} verwijderen|Als je een kolom verwijdert, gaan de modules naar de kolom links ervan.|Hernoemen|Gerenderde Markdown-tekst|Herhalen|Aantal herhalingen|Ontwerp vervangen|Vervangen door {name}|Vervangen door…|{old} vervangen door {new}.|{old} vervangen door {new}. Alle modules staan in het eerste tabblad.|{old} vervangen door {new}. De modules van alle {n} tabbladen blijven in tabbladvolgorde staan.|Terugzetten|Kaart terugzetten naar sjabloon…|Kolom terugzetten naar sjabloon…|Indeling terugzetten naar sjabloon…|Rij terugzetten naar sjabloon…|Sectie terugzetten|Sectie Pictogrameffecten terugzetten|Sectie {name} terugzetten|De hele kaart terugzetten naar het sjabloon? Al je wijzigingen gaan verloren.|Terugzetten naar animatie|Terugzetten naar voorinstelling|Terugzetten naar sjabloon|Terugzetten naar sjabloon…|{group} terugzetten in {state}|{name} terugzetten naar het sjabloon? Wijzigingen aan alle modules gaan verloren.|{name} terugzetten naar het sjabloon? Je wijzigingen eraan gaan verloren.|{state} terugzetten|Zet alleen de waarden van Standaard terug.|Formaat wijzigen tussen kolom {a} en kolom {b}|Venstergrootte wijzigen|Oorspronkelijke grootte|Beweging in voorbeeld hervatten|Opnieuw proberen|Omgekeerd|Omkeren bij negatieve waarde|Rechts|Ring|Ringkleur|Ringkleur vanaf dit resterende % omhoog; overschrijft Kleur.|Ringkleur vanaf deze waarde omhoog; overschrijft Kleur.|Ringmodus|Rond|Afgerond|Route|Rijnaam|Rij {n}|Rij {row} / Kol. {col}|Rij {row}, kolom {column}|Acties voor rij {row}, kolom {column}|Rijen bevatten kolommen, kolommen bevatten modules.|Regel|Naam van de regel|Regel {n}|Regel: {name}|Regel: {name}, actief tabblad|Regel: {name}, uitgeschakeld tabblad|Wordt uitgevoerd wanneer op de rij wordt getikt buiten een module met een eigen actie of bediening.|SVG-opmaak|Zoals Standaard|Hetzelfde als Waar bij Uiterlijk.|Zelfde als {source}|Aan alle kanten gelijk|Opslaan|Opslaan als vorm|Huidige kleur opslaan|Opslaan in sjabloon|Opgeslagen als {name}. Je vindt hem onder Mijn vormen.|Opgeslagen kleuren|Opgeslagen pictogram "{name}" is niet gevonden. De kaart toont het standaardpictogram.|Dikte schalen|CSS-eigenschappen zoeken|CSS-eigenschappen zoeken, bijv. padding|Attributen zoeken|Kaarten zoeken|Entiteiten zoeken|Lettertypen zoeken|Pictogrammen zoeken|Modules zoeken|Services zoeken|Sjablonen zoeken|Seizoen|Seizoensscène|Seizoenen|Secundaire kleur|Secundaire info|Seconden die een stip nodig heeft voor de lijn: Snelheid bij Max, Min. snelheid net boven Min.|Seconden zonder interactie. Leeg: blijft open.|Sectiekop|Startwaarde|Kiezen|Attribuut kiezen|Kaart kiezen|Entiteit kiezen|Lettertype kiezen|Pictogram kiezen|Laag erboven selecteren|Laag eronder selecteren|Media kiezen|Service kiezen|{label} selecteren|{name} geselecteerd, {n, select, 1 {1e} 2 {2e} 3 {3e} other {{n}e}} van voren hier|Sensor|Sensor met grafiek|Service|Servicegegevens|Services|Stelt {attributes} in; leeg: {fallback}.|Instellingen|Schudden|Vorm|Vorm toegepast.|Vormbron|Delen met tegels erin|Gedeeld met tegels erin|Paneel|Boodschappenlijst|Boodschappenlijstkaart|Kort ({example})|Tonen|Alles tonen|Apparaten en entiteiten van een gebied tonen|Tonen als pop-up|Helderheid tonen|Kaarten tonen op basis van voorwaarden|Sluitknop tonen|Code-editor tonen|Kleurkiezer tonen|Kleurtemperatuur tonen|Weertype tonen|Bediening tonen|Datum tonen|Effecten tonen|Voorspelling tonen|Pictogram tonen|Tonen in de boom|Labels tonen|Lagen tonen|Naam tonen|Naald tonen|Tonen op dashboard|Punten tonen|Neerslag tonen|Seconden tonen|Status tonen|Tabblad tonen op dashboard|Temperatuur tonen|Toon deze kaart wanneer…|Toon deze kolom wanneer…|Toon deze module wanneer…|Toon deze rij wanneer…|Gebruik deze regel wanneer…|Eenheid tonen|Waarde tonen|Visuele editor tonen|Wind tonen|{shown} van {total} getoond. Verfijn de zoekopdracht om meer te zien.|Weergave: {state}|Getoond totdat de video afspeelt, en in plaats daarvan als die niet kan afspelen.|Getoond terwijl de kaart beweegt. Bezoekers kunnen die pauzeren.|Toont Auto alleen in dit voorbeeld op een andere dag. Niet opgeslagen.|Toont de status of naam van een entiteit in plaats van de tekst.|Toont de afbeelding van de entiteit (persoon, afbeelding, camera, mediaspeler).|Toont de status van de entiteit (of het hieronder gekozen attribuut) naast het label.|Willekeurig|Zijsnede|Weergave van één entiteit|Grootte|Kleur van de schuifregelaar|Dia\'s per weergave|Plek {n}|Afvlakking|Slang|Momentopname|Vernieuwing momentopname (seconden)|Sneeuw|Sneeuw, regen, onweer, zon, wolken, mist of wind, afgeleid van de status.|Effen|Zuid|Zuid draait de seizoenen om.|Ruimte eromheen|Ruimte ertussen|Ruimte tussen dia\'s (px)|Sparkline|Snelheid|Snelheid (s)|Draaien|Lente|Squircle|Kaarten horizontaal stapelen|Kaarten verticaal stapelen|Sterren en vuurvliegjes \'s nachts, een warme gloed bij schemering en dageraad (sun.sun), overdag niets.|Begin|Begin: koppelen aan|Status|Status (geen attribuut)|Statuskleur|Statuspictogrammen|Statuspictogrammen: het pictogram terwijl de entiteit aan of uit is. Leeg: het pictogram van de module.|Statuswaarde|Status, bijv. on (leeg: elke wijziging)|Statistiek|Statistiekgrafiek|Stap|Kleur van kleurpunt {num}|Kleurpunt {num} van {n}|Recht|Sterkte (%)|Rekken|Structuur|Stijl|Stijlen worden verwijderd; gebruik fill-attributen (bijvoorbeeld fill="#f44336") voor kleuren.|Achtervoegsel|Zomer|Zwaaien|Omgeschakeld naar Effen. Ongedaan maken brengt het kleurverloop terug.|Gesynchroniseerd met sjabloon|Gesynchroniseerd met het sjabloon. Klik om een lokale waarde te houden die niet wordt gesynchroniseerd.|Tabblad|Naam van het tabblad|Tabbladstijl|Tabblad {n}|Tabbladen|Tikken|Tik op het pictogram om de lamp aan of uit te zetten. Laat Pictogram leeg om het eigen pictogram van de lamp te tonen.|Doel|Doelentiteit|Sjabloon|Sjabloonacties|Sjabloonanimaties|Naam van het sjabloon|Een sjabloonnaam is verplicht.|Tekst|De tekst gebruikt dit kleurverloop als vulling. Oudere tablets tonen de eerste kleur.|Dat is geen entiteits-id. Er hoort een punt in, zoals light.kitchen. Gebruik Geen entiteit om de entiteit uit te zetten.|De SVG is groter dan 32 KB.|De geanimeerde pictogrammen konden niet worden geladen. Probeer het opnieuw.|De boog krijgt de kleur van het hoogste bereik op of onder de waarde.|Het gebied vervaagt naar boven. De lijn blijft zwak zichtbaar ({pct}%), zodat tekst erover leesbaar blijft.|Het attribuut bevat de afbeeldings-URL; die vervangt de entiteitsafbeelding en de afbeeldings-URL.|De balk krijgt de kleur van het hoogste bereik op of onder de waarde; de balkkleur geldt onder het eerste bereik.|De blob verandert langzaam van vorm.|De kaart knipt zijn rand af: de ring zit erbinnen en de gloed schijnt naar binnen.|De kleur langs deze kleurpunten volgt de waarde: de entiteit, min en max van de vloeistofvulling, anders de entiteit van de module van 0 tot 100.|Het apparaat waar deze kaart voor is. Tegels volgen dit, tenzij je er een voor instelt.|Het lege deel gebruikt de kleur {colour} (ingesteld in YAML); een waarde hier vervangt die.|De statuskleur van de entiteit|De pictogrameditor kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.|De pictogrameditor kon niet worden geladen. Probeer het opnieuw.|Het pictogram gebruikt dit kleurverloop als vulling. Oudere tablets tonen de eerste kleur.|De bibliotheek kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.|De bibliotheek is vol. Verwijder eerst een vorm.|De modules in deze indeling; de modules van de indeling wijken af van het sjabloon.|De modules in deze indeling; ze volgen het sjabloon als één lijst.|Pa\'s wijze lynx bezag vroom het fikse aquaduct|De vorm knipt alles af wat buiten de module uitsteekt, zoals keuzelijsten en tooltips.|De vormeditor kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.|De vorm vervangt hier de randafronding.|Het studiocanvas toont een momentopname; het dashboard speelt de stream af (zonder geluid).|De thermostaat houdt een bereik aan (laag / hoog): kies target_temp_low of target_temp_high als attribuut om één kant in te stellen.|De visuele editor ondersteunt deze configuratie niet: {error}|De golven stromen langs de rand.|De sleutel {key} wordt automatisch ingesteld op basis van het kaarttype. Neem hem hier niet op.|Standaard van het thema|Thermostaat|Deze SVG bevat {list}. Verwijder het en probeer het opnieuw.|Deze SVG bevat {list}. Verwijder ze en probeer het opnieuw.|Deze kaart|Deze kaart is gekoppeld aan sjabloon {name}. Wil je alle gekoppelde kaarten bijwerken met deze structuurwijziging?|Deze kaart heeft nu zijn eigen kopie.|Deze kaart gebruikt alleen zijn eigen custom_animations.|Deze entiteit heeft geen dagelijkse voorspelling; het eerste voorspellingstype wordt getoond. De module Voorspelling biedt meer opties.|Deze entiteit heeft geen opties die een keuzelijst kan instellen (gebruik een invoerkeuze, keuze, invoertekst of tekst met eigen opties, klimaat, ventilator, lamp, mediaspeler, boiler of luchtbevochtiger).|Deze entiteit heeft geen {type} voorspelling; {fallback} wordt getoond.|Dit is eigen CSS voor een kleurverloop. Kies Kleurverloop om het te vervangen door de versie van de editor.|Deze lamp heeft geen {what}; de bediening is verborgen.|Deze lijnstijl is breed en hecht daarom aan het modulevak, tot je Pictogram of afbeelding kiest.|Deze module hoort bij een indeling; de modules van de indeling wijken af van het sjabloon.|Deze module hoort bij een indeling; ze volgen het sjabloon als één lijst.|Deze vorm kan niet worden opgeslagen.|Deze tegel heeft {kind} nodig. Het apparaat van de {source} is {thing}, dus de tegel blijft leeg.|Deze tegel toont geen apparaat.|Deze waarde kan alleen worden getoond: de entiteit (of dit attribuut) kan niet met een schuifregelaar worden ingesteld.|Deze waarde kan alleen worden getoond: de entiteit (of dit attribuut) kan niet met een getalkiezer worden ingesteld.|Drempels|Ticket|Ticket, Golf en Blob kunnen nog niet worden bewerkt. Gebruik de voorinstelling zoals die is.|Tegel|Tegels erin volgen deze entiteit, tenzij ze een eigen kiezen.|Tegels erin krijgen geen entiteit, tenzij ze er een kiezen.|Tegels die de kaart volgen, tonen dit.|Tijd|Tijdnotatie|Timervulling|Titel|Naar|Naar zijde|Takenlijst|Takenlijstkaart|Schakelen|Schakelt {entity} (de entiteit van de module).|Boven|Linksboven|Rechtsboven|Kleur van het spoor|Dekking van het spoor (%)|Probeer opnieuw|Zet uit om alleen voor deze kaart een thema te kiezen.|Tweemaal daags|Type|URL|Onderstreept|Ongedaan maken|Ongedaan maken (Ctrl+Z)|Eenheid|Onbekend moduletype|Loskoppelen van sjabloon|Kaart zonder titel|Omhoog|Tot 168 (een week).|Tot 32 KB. Delen met fill="currentColor" nemen de pictogramkleur aan, delen met class="mc-accent" de accentkleur.|Tot twee keer zo dik bij Max.|Tot {max} kleurpunten|Alle gekoppelde kaarten bijwerken|Gekoppelde kaarten bijwerken?|SVG uploaden|Gebruiken|Waarde van Standaard gebruiken|Gebruik Jinja2-sjablonen: {example}|Gebruik MM-DD..MM-DD, zoals 12-01..12-26, of off.|Gebruik Geen entiteit|Een kopie van {name} gebruiken|Gebruik een hexkleur, rgb(a) of var(--naam).|Gebruik een verhouding zoals 16:9, 4/3, 1.5 of 56.25%. Tot die tijd wordt 16:9 gebruikt.|Als kopie gebruiken|Gebruik hooguit 80 tekens.|Dashboardthema gebruiken|Entiteit gebruiken|Entiteitskleur gebruiken|Entiteitskleur gebruiken wint zolang de entiteit een statuskleur heeft; anders geldt deze kleur.|Entiteitspictogram gebruiken|Entiteitsafbeelding gebruiken|Gebruiken volgt de bibliotheek: wijzig een vorm en elke kaart die hem gebruikt verandert mee. Als kopie gebruiken maakt deze kaart onafhankelijk.|Entiteit van de module gebruiken|Eigen kleur gebruiken|Sjabloon gebruiken|De statuskleur van de entiteit gebruiken|{name} gebruiken|{value} gebruiken|Gebruikt totdat de streamspeler beschikbaar is.|Gebruikt {n} van je animaties.|Een kopie van {name} wordt gebruikt.|{name} wordt gebruikt. Wijzigingen eraan bereiken elke kaart die hem gebruikt.|Valentijn|Waarde|Waarde en route|Waarde-achtergrond|Type waarde-achtergrond|Waarden worden per periode gemiddeld (2 = elke 30 minuten). Leeg tekent elke opgeslagen wijziging.|Verticaal|Verticale uitlijning|Verticale stapel|Video-URL|Weergave|Weergavetype {type} wordt niet ondersteund|Kijkers kunnen de beweging op deze kaart niet pauzeren. Zet de knop aan als er iets langer dan 5 seconden beweegt.|Zichtbaarheid|Golf|Golfrand|Golfhoogte|Golven|Weer|Weerentiteit|Weersverwachting|Weersverwachtingskaart|Voor welk apparaat is deze kaart?|Zolang de entiteit aan is|Tijdens het stromen|Zolang de status gelijk is aan…|Breed|Breed, 800 pixels|Breedte|Breedte (px)|Winter|Zonder eigen entiteit gebruikt de rij die van de kaart.|Als er verder niets wordt getoond, wordt de status toch getoond.|Zonder kopie speelt de kaart niets af als Magic Card Utils of deze animatie wordt verwijderd.|Zonder kopie toont de kaart het standaardpictogram als Magic Card Utils of dit pictogram wordt verwijderd.|Zonder ID opent hij alleen via zijn triggers.|Wiebelen|In indeling plaatsen|YAML|YAML gekopieerd met je animaties.|YAML gekopieerd.|YAML gekopieerd. Niet ingesloten (niet gevonden): {ids}.|YAML. Laat leeg om de service zonder gegevens aan te roepen.|YYYY jaar, MMMM / MMM maandnaam, MM / M maand, DD / D dag, dddd / ddd weekdag. Tekst tussen [haakjes] blijft ongewijzigd.|Je account kan de bibliotheek gebruiken maar niet wijzigen. Vraag het een beheerder.|Eigen|een camera|een apparaat|een ander soort apparaat|een javascript:-link|een lamp|een lijst met opties|een script|een sensor|een schakelaar|een weerbron|attribuut|helderheid|kaart|kleur|kleurtemperatuur|kleuren|kolom|aangepaste breedtes|effecten|is gelijk aan|gebeurtenishandlers|externe verwijzingen|Uitrekken|fr verdeelt de vrije ruimte. Gebruik Aangepast voor auto (zo breed als de inhoud). %-breedtes plus tussenruimte kunnen buiten de rij vallen.|vanaf {value}|verborgen|indeling {layout}|lichte tekst op de themakleur|Doorgetrokken|geen|is niet gelijk aan|voorbeeld|rij|dia\'s|tabbladen|de HVAC-modus|themakleur|deze kaart|deze kolom|deze module|deze rij|vandaag|{angle} graden|{from} tot {to}|{id} (niet gevonden)|{id} (onbekend)|{label} (geen id)|Entiteit voor {label}|Bron van {label}|Eenheid van {label}|{label}: status|{list} en {last}|{min} tot {max}|{mods, plural, one {# module} other {# modules}}|{module} geplakt in {where}|{n, plural, one {# kolom} other {# kolommen}}|{n, plural, one {# kolom} other {# kolommen}}, aangepaste breedtes|{n, plural, one {# voorwaardelijke regel} other {# voorwaardelijke regels}}. Regels overschrijven Standaard alleen zolang aan hun voorwaarden wordt voldaan.|{n, plural, one {# voorwaardelijke regel} other {# voorwaardelijke regels}}. Dezelfde regels als op het tabblad Voorwaarden. Regels overschrijven Standaard alleen zolang aan hun voorwaarden wordt voldaan. Een latere regel wint van een eerdere.|{n, plural, one {# veld wijkt} other {# velden wijken}} lokaal af.|{n, plural, one {# pictogram gevonden} other {# pictogrammen gevonden}}|{n, plural, one {# laag} other {# lagen}}|{n, plural, one {# module} other {# modules}}|{n, plural, one {# afwijking} other {# afwijkingen}}|{n, plural, one {# rij} other {# rijen}}|{n, plural, one {# instelling die de nieuwe module niet ondersteunt} other {# instellingen die de nieuwe module niet ondersteunen}} verwijderd. Maak ongedaan om ze terug te halen.|{n, plural, one {# tegel volgt deze.} other {# tegels volgen deze.}}|{n, plural, one {# tegel heeft een ander apparaat nodig.} other {# tegels hebben een ander apparaat nodig.}}|{n, plural, one {Sluit de animatie in om deze kaart te delen met een andere Home Assistant.} other {Sluit ze in om deze kaart te delen met een andere Home Assistant.}}|{n, plural, one {module} other {modules}}|{name} (niet gevonden)|{name} (niet op tabbladen)|{name} ({id})|{name} ({n} ingesteld)|{name} YAML|{name} YAML gekopieerd|Acties voor {name}|{name} gekopieerd|Ontwerp van {name} gekopieerd|Type kleurverloop van {name}|Modus van {name}|Dekking van {name}|{name}, {slot}|{name}, achter andere modules|{name}, bovenop|{name}: kleur van|{note}, of kies een andere. Escape annuleert.|{note}, of kies een andere. {key} annuleert.|{n} B|{n} gewijzigd|{n} kolommen, {ratio}|{n} voorw.|{n} ingesteld|{rows, plural, one {# rij} other {# rijen}} · {mods, plural, one {# module} other {# modules}}. Bouw visueel met lagen, canvas en de volledige inspecteur.|{size} KB|{state} teruggezet|{title}. Druk op Ctrl+C (⌘C op een Mac) om te kopiëren.|{type} (niet geleverd door deze entiteit)']),c=e=>e.map(e=>({...e,label:n(e.label)})),d={colour:"color",centre:"center",grey:"gray",customis:"customiz",behaviour:"behavior",favourite:"favorite",maximis:"maximiz",minimis:"minimiz",organis:"organiz"},h=e=>e.toLowerCase().replace(/colour|centre|grey|customis|behaviour|favourite|maximis|minimis|organis/g,e=>d[e])},6365(e,t,i){i.d(t,{D:()=>n});var o=i(9100);function n(e,t){if("row"===e.type)return(0,o.t)(218,{n:t+1});if("tabs"===e.type){const i=e.tabs?.[t];return i?.label?.trim()||(0,o.t)(1018,{n:t+1})}}},2453(e,t,i){i.d(t,{$N:()=>T,Ak:()=>b,HT:()=>_,Hn:()=>v,Iu:()=>q,R9:()=>f,Sh:()=>S,TV:()=>A,V9:()=>C,VC:()=>y,bm:()=>$,br:()=>h,c4:()=>w,cv:()=>m,e9:()=>L,fN:()=>M,g1:()=>x,iA:()=>k,kW:()=>g,r$:()=>u,rb:()=>j,tw:()=>p});var o=i(201),n=i(6161),a=i(7526),s=i(5746),r=i(6365),l=i(8590),c=i(9100);const d=e=>e?.length?{child:e.map(e=>({slot:e.slot,index:e.index}))}:{};function h(e,t,i,o){return{kind:"module",row:e,col:t,module:i,...d(o)}}function u(e,t,i,o,n){return{kind:"slot",row:e,col:t,module:i,...d(o),slot:n}}function p(e,t){switch(e.kind){case"card":return e;case"row":return{kind:"card"};case"column":return{kind:"row",row:e.row};case"slot":return h(e.row,e.col,e.module,e.child);case"module":{if(!e.child?.length)return{kind:"column",row:e.row,col:e.col};const i=e.child.slice(0,-1),o=t?m(t,h(e.row,e.col,e.module,i)):void 0;return(0,s.WA)(o)?u(e.row,e.col,e.module,i,e.child[e.child.length-1].slot):h(e.row,e.col,e.module,i)}}}function m(e,t){if("module"!==t.kind)return;const i=e.rows?.[t.row]?.columns?.[t.col]?.modules?.[t.module];return(0,s.Rv)(i,t.child??[])}function g(e,t){return"slot"===t.kind?m(e,p(t)):void 0}function f(e,t){switch(t.kind){case"card":return e;case"row":return e.rows?.[t.row];case"column":return e.rows?.[t.row]?.columns?.[t.col];case"module":return m(e,t);case"slot":{const i=g(e,t),o="tabs"===i?.type?i.tabs:"row"===i?.type?i.columns:void 0,n=Array.isArray(o)?o[t.slot]:void 0;return n&&"object"==typeof n?n:void 0}}}function v(e){const t=e&&"object"==typeof e?e.editor_name:void 0;return"string"==typeof t&&t.trim()?t.trim():void 0}function b(e){return!!e&&"object"==typeof e&&!0===e.hidden}function y(e){const t=`${e.row}.${e.col}.${e.module}`;return e.child?.length?`${t}/${(0,s.Nk)(e.child)}`:t}function _(e){const[t,...i]=e.split("/"),o=/^(\d+)\.(\d+)\.(\d+)$/.exec(t),n=(0,s.Tu)(i.join("/"));return o&&n?h(Number(o[1]),Number(o[2]),Number(o[3]),n):null}function w(e){return e&&void 0!==e.rowIndex?void 0===e.columnIndex?{kind:"row",row:e.rowIndex}:void 0===e.moduleIndex?{kind:"column",row:e.rowIndex,col:e.columnIndex}:void 0!==e.slotIndex?u(e.rowIndex,e.columnIndex,e.moduleIndex,e.childPath,e.slotIndex):h(e.rowIndex,e.columnIndex,e.moduleIndex,e.childPath):{kind:"card"}}function $(e){switch(e.kind){case"card":return null;case"row":return{rowIndex:e.row};case"column":return{rowIndex:e.row,columnIndex:e.col};case"module":return e.child?.length?{rowIndex:e.row,columnIndex:e.col,moduleIndex:e.module,childPath:e.child.map(e=>({...e}))}:{rowIndex:e.row,columnIndex:e.col,moduleIndex:e.module};case"slot":return{...$(p(e)),slotIndex:e.slot}}}function k(e){switch(e.kind){case"card":return"card";case"row":return`r${e.row}`;case"column":return`r${e.row}.c${e.col}`;case"module":{const t=`r${e.row}.c${e.col}.m${e.module}`;return e.child?.length?`${t}/${(0,s.Nk)(e.child)}`:t}case"slot":return`${k(p(e))}#${e.slot}`}}function x(e){const t=e.indexOf("#");if(t>=0){const i=x(e.slice(0,t)),o=e.slice(t+1);return"module"===i.kind&&/^\d+$/.test(o)?u(i.row,i.col,i.module,i.child,Number(o)):{kind:"card"}}const i=/^r(\d+)(?:\.c(\d+)(?:\.m(\d+)(?:\/(.+))?)?)?$/.exec(e);if(!i)return{kind:"card"};const o=Number(i[1]);if(void 0===i[2])return{kind:"row",row:o};const n=Number(i[2]);if(void 0===i[3])return{kind:"column",row:o,col:n};const a=(0,s.Tu)(i[4]??"");return a?h(o,n,Number(i[3]),a):{kind:"card"}}function C(e,t){return k(e)===k(t)}function S(e,t){const i=e.rows||[];if("card"===t.kind)return t;const o=i[t.row];if(!o)return{kind:"card"};if("row"===t.kind)return t;const n=o.columns?.[t.col];if(!n)return{kind:"row",row:t.row};if("column"===t.kind)return t;if("slot"===t.kind){const i=S(e,p(t)),o=m(e,i);return C(i,p(t))&&(0,s.WA)(o)&&t.slot<(0,s.yZ)(o).length?t:i}const a=n.modules?.length||0;if(0===a)return{kind:"column",row:t.row,col:t.col};const r=Math.min(t.module,a-1),l=[];let c=n.modules[r];for(const e of r===t.module?t.child??[]:[]){const t=(0,s.yZ)(c)?.[e.slot]?.[e.index];if(!t)break;l.push(e),c=t}return h(t.row,t.col,r,l)}function M(e,t){const i=[];let o=e.rows[t.row].columns[t.col].modules[t.module];const n=t.child??[];i.push({label:v(o)??q(o),target:h(t.row,t.col,t.module)});for(const[e,a]of n.entries()){const l=(0,r.D)(o,a.slot),c=(0,s.yZ)(o)?.[a.slot]?.[a.index];if(!c||"object"!=typeof c)break;o=c;const d=v(o)??q(o);i.push({label:l?`${l} · ${d}`:d,target:h(t.row,t.col,t.module,n.slice(0,e+1))})}return i}function A(e){return(e.rows||[]).reduce((e,t)=>e+(t.columns||[]).reduce((e,t)=>e+(t.modules?.length??0),0),0)}function q(e){const t=a.s.get(e.type)?.metadata.name;return void 0===t||""===t?e.type:(0,o.t)(t)}function E(e){const t=e;for(const e of["entity","label","text","name"]){const i=t[e];if("string"==typeof i&&i.trim())return i}}function T(e){const t=e;for(const e of["label","text","name"]){if("text"===e&&t.use_entity)continue;const i=t[e];if("string"!=typeof i)continue;const o=i.trim().split("\n")[0];if(o&&!z.test(o))return o.length>40?`${o.slice(0,39)}…`:o}}function L(e,t){const i=e.name?.trim()||(0,c.t)(167),o=S(e,t);if("card"===o.kind)return{title:i,icon:"mdi:card-outline",crumbs:[i]};const n=v(e.rows[o.row])??(0,c.t)(843,{n:o.row+1});if("row"===o.kind)return{title:n,icon:"mdi:view-sequential-outline",crumbs:[i,n],subtitle:(0,l.SU)(e.rows[o.row])?(0,c.t)(263):(0,c.t)(508,{layout:e.rows[o.row].layout||"1"})};const d=v(e.rows[o.row].columns[o.col])??(0,c.t)(218,{n:o.col+1});if("column"===o.kind){const t=e.rows[o.row].columns[o.col].modules?.length??0;return{title:d,icon:"mdi:view-column-outline",crumbs:[i,n,d],subtitle:(0,c.t)(1258,{n:t})}}if("slot"===o.kind){const t=p(o),a=m(e,t),l=(0,s.yZ)(a)?.[o.slot];if(!a||!l||!(0,s.WA)(a))return{title:"tabs"===a?.type?(0,c.t)(1015):(0,c.t)(213),icon:"mdi:view-column-outline",crumbs:[i,n,d]};const h=("row"===a.type?v(a.columns?.[o.slot]):void 0)??(0,r.D)(a,o.slot),u=l.length,g=a.tabs?.[o.slot]?.icon;return{title:h,icon:"tabs"===a.type?g||"mdi:tab":"mdi:view-column-outline",crumbs:[...L(e,t).crumbs,h],subtitle:(0,c.t)(1258,{n:u})}}const h=m(e,o);return h&&"object"==typeof h?{title:v(h)??q(h),icon:a.s.get(h.type)?.metadata.icon||"mdi:puzzle-outline",crumbs:[i,n,d,...M(e,o).map(e=>e.label)],subtitle:E(h)}:{title:(0,c.t)(584),icon:"mdi:puzzle-outline",crumbs:[i,n,d]}}const z=/^[a-z_]+\.[a-z0-9_]+$/;function j(e){const t=e.split(/(?<=[._])/);return n.qy`${t.map((e,t)=>t?n.qy`<wbr>${e}`:e)}`}i.d(t,["Y",0,z])},7837(e,t,i){i.d(t,{c:()=>a});var o=i(2797);let n;function a(){return n??=new Promise((e,t)=>{const n=setTimeout(()=>t(new Error(`${o.Iz} chunk: timed out`)),8e3);i.e(234).then(()=>i(3104)).then(i=>{clearTimeout(n);const a=i.TRANSFER;a&&String(a.version).split(".")[0]==="1.0.0".split(".")[0]?e(a):t(new Error(`${o.Iz} chunk: unsupported version ${String(a?.version)}`))},e=>{clearTimeout(n),t(e instanceof Error?e:new Error(String(e)))})}).catch(e=>{throw n=void 0,e}),n}},201(e,t,i){var o=i(4753);const{t:n,tc:a,tx:s,m:r,locale:l,ready:c}=(0,o._H)("labels",()=>i.e(249).then(()=>i(2657)));i.d(t,["G",0,c,"t",0,n])},3245(e,t,i){i.d(t,{Qt:()=>v,bb:()=>m,k8:()=>g});var o=i(3925),n=i(8983);const a=["spin","glow","flame","drum","swing","pulse","snow","shake","eq"],s={spin:1.5,glow:2.4,flame:1.2,drum:1.2,swing:1,pulse:1.5,snow:2.4,shake:1.2,eq:1.2},r="var(--error-color, #db4437)",l=new Set(["problem","smoke","gas","moisture","safety","carbon_monoxide","heat","tamper"]),c=new Set(["door","window","garage_door","opening"]),d=new Set(["run","running","washing","drying","spin","spinning","rinse","wash","dry"]),h=(e,t={})=>({anim:e,speed:s[e],intensity:1,...t}),u=e=>"number"==typeof e&&Number.isFinite(e)?e:void 0,p=e=>Math.min(1,Math.max(0,e));function m(e){if(!e||"string"!=typeof e.entity_id)return;const t=e.entity_id.split(".")[0],i=e.state,o=e.attributes||{},n="string"==typeof o.device_class?o.device_class:"";switch(t){case"fan":{if("on"!==i)return;const e=p((u(o.percentage)??100)/100);return h("spin",{speed:.6+2.4*(1-e)})}case"light":{if("on"!==i)return;const e=o.rgb_color,t=Array.isArray(e)&&e.length>=3&&e.slice(0,3).every(e=>void 0!==u(e))?`rgb(${e[0]}, ${e[1]}, ${e[2]})`:void 0,n=u(o.brightness);return h("glow",{intensity:void 0===n?1:.25+.75*p(n/255),...t?{color:t}:{}})}case"climate":return"heating"===o.hvac_action||"preheating"===o.hvac_action?h("flame"):"cooling"===o.hvac_action?h("snow"):"fan"===o.hvac_action?h("spin",{speed:1.5}):void 0;case"vacuum":return"cleaning"===i?h("drum",{speed:1.2}):void 0;case"sensor":return d.has(i)?h("drum",{speed:1.2}):void 0;case"binary_sensor":if("on"!==i)return;return"running"===n?h("drum",{speed:1.2}):c.has(n)?h("swing",{speed:0,intensity:.3}):l.has(n)?h("pulse",{color:r}):void 0;case"cover":return"opening"===i||"closing"===i?h("swing",{speed:1}):"open"===i?h("swing",{speed:0,intensity:.3}):void 0;case"lock":return"jammed"===i?h("shake"):"locking"===i||"unlocking"===i||"opening"===i?h("pulse"):void 0;case"media_player":return"playing"===i?h("eq"):void 0;case"alarm_control_panel":return"triggered"===i?h("pulse",{color:r}):void 0;case"siren":return"on"===i?h("pulse",{color:r}):void 0;default:return}}function g(e,t=e?.entity_id??""){const i=t.split(".")[0],o=String(e?.attributes?.device_class??"");switch(i){case"fan":return 446;case"light":return 224;case"climate":return 195;case"vacuum":return 166;case"sensor":return 168;case"binary_sensor":return"running"===o?167:c.has(o)?474:l.has(o)?369:void 0;case"cover":return 473;case"lock":return 418;case"media_player":return 182;case"alarm_control_panel":return 370;case"siren":return 369;default:return}}const f=new Set(["alarm_control_panel","automation","binary_sensor","camera","climate","cover","fan","humidifier","input_boolean","lawn_mower","light","lock","media_player","remote","script","siren","switch","timer","vacuum","valve","water_heater"]);function v(e,t){if("auto"===e)return m(t);if(!a.includes(e))return;if(function(e){if(!e||"string"!=typeof e.entity_id)return!1;if((0,n.Pd)(e))return!0;const t=e.entity_id.split(".")[0];return!!f.has(t)&&(!("climate"!==t||!["idle","off"].includes(String(e.attributes?.hvac_action)))||"media_player"===t&&"paused"===e.state||!(0,o.mu)(e))}(t))return;const i=e,s=m(t);return s?.anim===i?{...s,speed:s.speed>0?s.speed:1.5}:{anim:i,speed:1.5,intensity:1}}},4727(e,t,i){i.d(t,{Qh:()=>p});var o=i(7423),n=i(3245),a=i(3098);const s={...a.t8,emptyOpacity:.25,angle:90,drawDuration:1.2,secondaryPct:40,stops:["#2196f3","#f44336"]},r=["up","down","left","right"],l=["solid","duotone","gradient","value"],c=["off","load","change","loop"],d=(e,t,i)=>t.includes(e)?e:i;function h(e){const t=e.trim();let i=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(i){const e=3===i[1].length?[...i[1]].map(e=>e+e).join(""):i[1];return{r:parseInt(e.slice(0,2),16),g:parseInt(e.slice(2,4),16),b:parseInt(e.slice(4,6),16)}}return i=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t),i?{r:+i[1],g:+i[2],b:+i[3]}:void 0}const u=e=>`rgb(${Math.round(e.r)}, ${Math.round(e.g)}, ${Math.round(e.b)})`;function p(e,t){const i=e&&"object"==typeof e?e:{},o=t.entity?t.hass?.states?.[t.entity]:void 0,p=i.colors&&"object"==typeof i.colors?i.colors:{},g=d(p.style,l,"solid"),f=(0,a.dU)(p.primary,o)??t.baseColor,v=i.fill||"value"===g?function(e,t){const i=e.fill&&"object"==typeof e.fill?e.fill:{},o=i.entity||t.entity;return(0,a.EN)(o?t.hass?.states?.[o]:void 0,i.attribute||void 0,i.min,i.max)}(i,t):void 0,b={style:g,primary:f,angle:(0,a.bu)(p.angle)??s.angle},y="string"==typeof p.secondary&&/%\s*$/.test(p.secondary)?(0,a.uM)(p.secondary):void 0,_=void 0!==y?(0,a.jh)(f,Math.round(100*y)):(0,a.dU)(p.secondary,o);if("duotone"===g?b.secondary=_??(0,a.jh)(f,s.secondaryPct):_&&(b.secondary=_),"gradient"===g||"value"===g){const e=(Array.isArray(p.gradient)?p.gradient:[]).map(e=>(0,a.dU)(e,o)).filter(e=>!!e);b.stops=e.length>=2?e:1===e.length?[e[0],e[0]]:[...s.stops],"value"===g&&(b.valueColor=void 0===v?b.stops[0]:function(e,t){if(!e.length)return"currentColor";const i=(0,a.qE)(Number.isFinite(t)?t:0,0,1)*(e.length-1),o=Math.min(Math.floor(i),e.length-2);if(1===e.length||o<0)return h(e[0])?u(h(e[0])):e[0];const n=i-o,s=h(e[o]),r=h(e[o+1]);return s&&r?u({r:s.r+(r.r-s.r)*n,g:s.g+(r.g-s.g)*n,b:s.b+(r.b-s.b)*n}):n<.5?e[o]:e[o+1]}(b.stops,v),void 0===v&&(b.valueMissing=!0))}const w={colors:b,draw:d(i.draw,c,"off"),drawDuration:m(i.draw_duration)??s.drawDuration,morph:!0===i.morph},$=(0,n.Qt)(i.device,o);if($&&(w.device=$),i.fill&&"object"==typeof i.fill){const e=i.fill,t=(0,a.uM)(e.empty_color),n=void 0===t?(0,a.dU)(e.empty_color,o):void 0;w.fill={level:v,color:(0,a.dU)(e.color,o)??b.valueColor??f,emptyOpacity:n?1:t??s.emptyOpacity,...n?{emptyColor:n}:{},wave:!1!==e.wave,direction:d(e.direction,r,"up")}}return w}function m(e){const t=(0,o.TD)(e);if(!t)return;const i=t.endsWith("ms")?parseFloat(t)/1e3:parseFloat(t);return i>0?i:void 0}i.d(t,["_T",0,s])},598(e,t,i){i.d(t,{e5:()=>b,uU:()=>p,wL:()=>v});var o=i(5499),n=i(939),a=i(5746),s=i(3251),r=i(4243);const l=new Set(["icon_fx","icon_on","icon_off","svg","entity"]);function c(e,t,i){for(const o of["hidden","editor_name","entity","share_entity"]){if(!i.has(o))continue;const n=t[o];void 0===n?delete e[o]:e[o]=n}}const d=["use_page_theme","theme","background","background_image","border_radius","padding","border_width","border_style","border_color","opacity","backdrop_filter","margin","box_shadow","card_height","overflow","css","animations","ring","popup","flows","shape","value_background","seasonal","hover","background_layers"],h={shape:["shape_options"]},u=new Set(["type","template","not_synced","name","rows","display","conditional_appearance",...d,"custom_animations","custom_shapes","custom_icons",...Object.values(h).flat()]);function p(e){const t={};for(const[i,n]of Object.entries(e))u.has(i)||void 0===n||(t[i]=(0,o.G)(n));return t}function m(e,t){return"custom"===e.shape&&"custom"===t?.shape&&t.shape_options&&e.shape_options&&e.shape_options!==t.shape_options&&(e.shape_options=(0,r.S)(t.shape_options,e.shape_options)),e}const g=(e,t)=>m({...e,...t},e);function f(e,t,i=!0){const o=new Map,n=(e,t)=>{const i=new Set;for(const n of e){const e=String(n.id);i.has(e)||Array.isArray(t)&&t.includes(e)||o.set(e,n),i.add(e)}};return t.not_synced?.includes("custom_animations")||n((0,s.B)(e),i&&t.hidden_animations),n((0,s.B)(t.custom_animations)),o.size?[...o.values()]:void 0}function v(e,t,i=!0){if(!e.template||!t)return e;const o={...e,custom_animations:f(t,e,i)};return o.custom_animations||delete o.custom_animations,o}function b(e,t,i=!1){const s=(0,o.G)(e);delete s.entity,s.type=t.type,s.template=t.template;const r=new Set(t.not_synced||[]);r.size>0&&(s.not_synced=[...r]),Object.assign(s,p(t));for(const e of["custom_shapes","custom_icons"]){const n={...!i&&!r.has(e)&&s[e],...t[e]};Object.keys(n).length?Object.assign(s,{[e]:(0,o.G)(n)}):delete s[e]}const u=i?t.custom_animations:f(s.custom_animations,t);u?s.custom_animations=(0,o.G)(u):delete s.custom_animations;for(const i of d){const n=h[i];if(n){const a=[i,...n],l=t,c=s;if(!r.has(i)||!a.some(e=>void 0!==l[e]))continue;for(const e of a)void 0===l[e]?delete c[e]:c[e]=(0,o.G)(l[e]);m(c,e);continue}r.has(i)&&void 0!==t[i]&&(s[i]=(0,o.G)(t[i]))}const v=new Map,b=new Map,y=new Map;for(const e of t.rows||[]){e.id&&v.set(e.id,e);for(const t of e.columns||[]){t.id&&b.set(t.id,t);for(const e of t.modules||[])e.id&&y.set(e.id,e)}}const _=new Set((s.rows||[]).map(e=>e.id).filter(Boolean));s.rows=(s.rows||[]).map(e=>{const t=e.id?v.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);i.size>0&&(e.not_synced=[...i]),i.has("layout")&&void 0!==t.layout&&(e.layout=t.layout),i.has("column_widths")&&(void 0!==t.column_widths?e.column_widths=[...t.column_widths]:delete e.column_widths),i.has("design")&&t.design&&(e.design=g(e.design,t.design)),i.has("actions")&&(t.actions?e.actions=t.actions:delete e.actions),i.has("gap")&&void 0!==t.gap&&(e.gap=t.gap),i.has("padding")&&void 0!==t.padding&&(e.padding=t.padding),c(e,t,i)}const i=new Set((e.columns||[]).map(e=>e.id).filter(Boolean));if(e.columns=(e.columns||[]).map(e=>{const t=e.id?b.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);if(i.size>0&&(e.not_synced=[...i]),i.has("design")&&t.design&&(e.design=g(e.design,t.design)),i.has("gap")&&void 0!==t.gap&&(e.gap=t.gap),i.has("padding")&&void 0!==t.padding&&(e.padding=t.padding),i.has("vertical_align")&&void 0!==t.vertical_align&&(e.vertical_align=t.vertical_align),c(e,t,i),i.has("modules")&&Array.isArray(t.modules))return{...e,modules:(0,o.G)(t.modules)}}const i=new Set((e.modules||[]).map(e=>e.id).filter(Boolean));if(e.modules=(e.modules||[]).map(e=>{const t=e.id?y.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);i.size>0&&(e.not_synced=[...i]),c(e,t,i);const s=["text","icon","entity","image","content","label","attribute","prefix","suffix","url","service","service_data","data","use_entity","entity_display","use_entity_icon","use_entity_color","icon_color","size","icon_fx","icon_on","icon_off","svg","animated_icons"];for(const n of s)i.has(n)&&void 0!==t[n]?e[n]=(0,o.G)(t[n]):i.has(n)&&l.has(n)&&delete e[n];const r=(0,a.us)(e);if(r&&i.has(r)&&void 0!==t[r]&&(e[r]=(0,o.G)(t[r])),t.design&&i.has("design"))e.design=g(e.design,t.design);else if(t.design){const o=t.design,a={...e.design||{}};let s=!1;for(const e of i){if(!e.startsWith("design."))continue;const t=(0,n.I7)(e.slice(7));if(!(t.length>1)||t.some(e=>void 0!==o[e]))for(const e of t)t.length>1&&delete a[e],void 0!==o[e]&&(a[e]=o[e]),s=!0}s&&(e.design=m(a,e.design))}t.actions&&(i.has("actions")||[...i].some(e=>e.startsWith("actions.")))&&(e.actions={...e.actions,...t.actions})}return e}),t)for(const n of t.modules||[])n.id&&!i.has(n.id)&&e.modules.push((0,o.G)(n));return e}),t)for(const n of t.columns||[])n.id&&!i.has(n.id)&&e.columns.push((0,o.G)(n));return e});for(const e of t.rows||[])e.id&&!_.has(e.id)&&s.rows.push((0,o.G)(e));return s}i.d(t,["lC",0,["grid_options","layout_options","visibility","view_layout"]])},3251(e,t,i){i.d(t,{B:()=>a,Gd:()=>n,ux:()=>s});var o=i(2299);function n(e){const t=new Set,i=e=>{if(Array.isArray(e))e.forEach(i);else if(e&&"object"==typeof e)for(const[n,a]of Object.entries(e))if("custom_animations"!==n)if("preset"===n&&(0,o.Bl)(a)){const e=(0,o._R)(a);e&&t.add(e)}else a&&"object"==typeof a&&i(a)};return i(e),[...t]}function a(e){return Array.isArray(e)?e.filter(e=>!!e&&"object"==typeof e):e&&"object"==typeof e?Object.entries(e).filter(([,e])=>!!e&&"object"==typeof e).map(([e,t])=>({id:e,...t})):[]}function s(e,t){const i=new Map(a(e.custom_animations).map(e=>[String(e.id),e])),s=new Map,r=[],l=n(e);for(;l.length;){const e=l.shift();if(s.has(e)||r.includes(e))continue;const n=t(e)??i.get(e);if(!n){r.push(e);continue}s.set(e,n);const a=n.steps;for(const e of Array.isArray(a)?a:[])"string"==typeof e?.animation&&e.animation.startsWith(o.D8)&&l.push((0,o._R)(e.animation))}if(!s.size)return{config:e,embedded:[],missing:r};const c=[...s.keys()];for(const[e,t]of i)s.has(e)||s.set(e,t);return{config:{...e,custom_animations:[...s.values()]},embedded:c,missing:r}}},5499(e,t,i){function o(e){if(null===e||"object"!=typeof e)return e;if(Array.isArray(e))return e.map(e=>o(e));const t={};for(const i of Object.keys(e))t[i]=o(e[i]);return t}i.d(t,{G:()=>o})},3057(e,t,i){function o(e){const t=new Set;return(e??[]).map((e,i)=>{const o=e&&"object"==typeof e?e:{},n="string"==typeof o.from?o.from:"",a="string"==typeof o.to?o.to:"";let s="string"==typeof o.id&&o.id?o.id:n&&a?`${n}>${a}`:`flow~${i}`;return t.has(s)&&(s=`${s}~${i}`),t.add(s),s})}i.d(t,{kc:()=>a,rP:()=>o});const n=new WeakMap;function a(e){let t=n.get(e);if(t)return t;const i=new Map,o=e=>{if(!e||"object"!=typeof e)return;if(Array.isArray(e))return void e.forEach(o);const t=e;"string"!=typeof t.id||"string"!=typeof t.type||i.has(t.id)||i.set(t.id,"string"==typeof t.entity&&"none"!==t.entity?t.entity:void 0);for(const e of["columns","modules","tabs"])o(t[e])};return o(e.rows),t=i,n.set(e,t),t}i.d(t,["Y1",0,{route:"curve",min:0,max:1e3,reverse_negative:!0,color:"var(--primary-color)",idle_color:"color-mix(in srgb, var(--secondary-text-color, #727272) 50%, transparent)",width:3,scale_width:!0,dots:3,dot_size:6,speed:2,min_speed:8,glow:0,label:"none",label_position:"auto",show_when:"always",layer:"back"}])},886(e,t,i){i.d(t,{AJ:()=>w,De:()=>p,FQ:()=>x,Gz:()=>d,M3:()=>v,Mg:()=>_,Wn:()=>m,XT:()=>a,Yd:()=>b,aA:()=>u,cy:()=>f,fZ:()=>h,lm:()=>y,m1:()=>r,nZ:()=>k,pA:()=>$,pZ:()=>s,vm:()=>g});var o=i(6161),n=i(379);function a(e,t,i,a){const r=t&&i&&(0,n.rJ)(i),l=a?.reset??o.s6;return r?o.qy`
    <div class="field-head">
      <label for=${a?.forId??o.s6}>${e}</label>
      ${l}
      ${s(t,i)}
    </div>
  `:o.qy`<div class="field-head"><label for=${a?.forId??o.s6}>${e}</label>${l}</div>`}function s(e,t){if(!(0,n.rJ)(t))return o.s6;const i=!(0,n.gJ)(t,e),a=(0,n.dy)(t,e);return o.qy`
      <mc-sync-indicator
        .synced=${i}
        .hasTemplate=${!0}
        .propertyPath=${a}
        .hideIfNoTemplate=${!0}
        @sync-toggle=${e=>{const t=new CustomEvent("field-sync-toggle",{detail:{propertyPath:e.detail.propertyPath,synced:e.detail.synced},bubbles:!0,composed:!0});e.target.dispatchEvent(t)}}
      ></mc-sync-indicator>
  `}function r(e,t){return o.qy`<div class=${"mc-field-hint"+(t?` ${t}`:"")}>${e}</div>`}function l(e){const t=(e||"").trim();if(!t)return{top:"",right:"",bottom:"",left:""};const i=t.split(/\s+/);return 1===i.length?{top:i[0],right:i[0],bottom:i[0],left:i[0]}:2===i.length?{top:i[0],right:i[1],bottom:i[0],left:i[1]}:3===i.length?{top:i[0],right:i[1],bottom:i[2],left:i[1]}:{top:i[0]||"",right:i[1]||"",bottom:i[2]||"",left:i[3]||""}}function c(e){const{top:t,right:i,bottom:o,left:n}=e;if(t||i||o||n)return t===i&&i===o&&o===n?t||void 0:t===o&&i===n?`${t||"0"} ${i||"0"}`:i===n?`${t||"0"} ${i||"0"} ${o||"0"}`:`${t||"0"} ${i||"0"} ${o||"0"} ${n||"0"}`}function d(e,t,i,n,s,r){return o.qy`
    <div class="mc-field">
      ${a(e,n,s)}
      <input
        class="input ${r?.mono?"mono":""}"
        type="text"
        aria-label=${e||o.s6}
        spellcheck=${r?.mono?"false":o.s6}
        placeholder=${r?.placeholder??o.s6}
        .value=${t||""}
        @input=${e=>i(e.target.value)}
      />
    </div>
  `}function h(e,t,i,n,s,r){return o.qy`
    <div class="mc-field">
      ${a(e,s,r)}
      <textarea
        class="input"
        aria-label=${e||o.s6}
        .value=${t||""}
        rows=${String(n?.rows??4)}
        placeholder=${n?.placeholder??o.s6}
        @input=${e=>i(e.target.value)}
      ></textarea>
    </div>
  `}function u(e,t,i,n,s,r){return o.qy`
    <div class="mc-field">
      ${a(e,s,r)}
      <input
        class="input"
        type="number"
        aria-label=${e||o.s6}
        .value=${String(t??"")}
        min=${n?.min??o.s6}
        max=${n?.max??o.s6}
        step=${n?.step??o.s6}
        placeholder=${n?.placeholder??o.s6}
        @input=${e=>{const t=e.target.value;i(n?.optional&&""===t.trim()?NaN:Number(t))}}
      />
    </div>
  `}function p(e,t,i,n,s,r,l){return o.qy`
    <div class="mc-field">
      ${e?a(e,s,r):o.s6}
      <div class="select">
        <select
          class="input"
          aria-label=${e||o.s6}
          ?disabled=${!!l?.disabled}
          @change=${e=>n(e.target.value)}
        >
          ${i.map(e=>o.qy`<option value=${e.value} ?selected=${t===e.value}>${e.label}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>
  `}function m(e,t,i,n,s,r){const l=i.some(e=>e.value===t)?t:i[0]?.value;return o.qy`
    <div class="mc-field">
      ${a(e,s,r)}
      <div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const t=i.findIndex(e=>e.value===l),o={ArrowRight:(t+1)%i.length,ArrowDown:(t+1)%i.length,ArrowLeft:(t-1+i.length)%i.length,ArrowUp:(t-1+i.length)%i.length,Home:0,End:i.length-1}[e.key];if(void 0===o)return;e.preventDefault();const a=e.currentTarget;n(i[o].value),requestAnimationFrame(()=>a.querySelector(`[data-val="${i[o].value}"]`)?.focus())}}>
        ${i.map(e=>{const t=e.value===l;return o.qy`<button
            type="button"
            role="radio"
            data-val=${e.value}
            aria-checked=${t?"true":"false"}
            tabindex=${t?"0":"-1"}
            @click=${()=>n(e.value)}
          >${e.label}</button>`})}
      </div>
    </div>
  `}function g(e,t,i,n,s,r){return o.qy`
    <div class="switch-row">
      <div class="txt">
        ${a(e,n,s)}
        ${r?o.qy`<p class="help">${r}</p>`:o.s6}
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${t?"true":"false"}
        aria-label=${e}
        @click=${()=>i(!t)}
      ></button>
    </div>
  `}function f(e,t,i,n,s,r,l){return o.qy`
    <div class="mc-field">
      ${a(e,r,l)}
      <mc-entity-picker
        .hass=${n}
        .value=${t||""}
        .domain=${s||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-entity-picker>
    </div>
  `}function v(e,t,i,n,s,r){return o.qy`
    <div class="mc-field">
      ${a(e,s,r)}
      <mc-service-picker
        .hass=${n}
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-service-picker>
    </div>
  `}function b(e,t,i,n,s,r="",l="",c){return o.qy`
    <div class="mc-field">
      ${a(e,n,s)}
      <mc-color-picker
        .value=${t||""}
        .label=${e}
        .gradient=${r}
        .gradientNote=${l}
        .allowEntity=${!!c}
        .allowAttribute=${!!c}
        .entityColor=${c?.color??""}
        .entityAttributes=${c?.attributes}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-color-picker>
    </div>
  `}function y(e,t,i,n,s,r,l){return o.qy`
    <div class="mc-field">
      ${a(e,n,s)}
      <mc-unit-field
        .units=${l}
        .value=${t||""}
        .label=${e}
        .placeholder=${r||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-unit-field>
    </div>
  `}function _(e,t,i,n,s,r){const d={[n]:t||""};return o.qy`
    <div class="mc-field">
      ${a(e,s,r)}
      <mc-box-field
        .design=${d}
        .onChange=${e=>i(function(e,t,i){const o=l(e);return"string"==typeof i[t]?c(l(i[t])):("string"==typeof i[`${t}_top`]&&(o.top=i[`${t}_top`]),"string"==typeof i[`${t}_right`]&&(o.right=i[`${t}_right`]),"string"==typeof i[`${t}_bottom`]&&(o.bottom=i[`${t}_bottom`]),"string"==typeof i[`${t}_left`]&&(o.left=i[`${t}_left`]),"border_radius"===t&&("string"==typeof i.border_top_left_radius&&(o.top=i.border_top_left_radius),"string"==typeof i.border_top_right_radius&&(o.right=i.border_top_right_radius),"string"==typeof i.border_bottom_right_radius&&(o.bottom=i.border_bottom_right_radius),"string"==typeof i.border_bottom_left_radius&&(o.left=i.border_bottom_left_radius)),c(o))}(t,n,e))}
        .baseName=${n}
      ></mc-box-field>
    </div>
  `}function w(e,t,i,n,s,r,l){return o.qy`
    <div class="mc-field">
      ${a(e,s,r)}
      <mc-icon-picker
        .hass=${n}
        .animated=${l}
        .syncCtx=${r}
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value||"")}
      ></mc-icon-picker>
    </div>
  `}function $(e,t,i,n,s){return o.qy`
    <div class="mc-field">
      ${a(e,n,s)}
      <mc-card-picker
        .value=${t||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-card-picker>
    </div>
  `}function k(e,t,i,n,s,r,l){return o.qy`
    <div class="mc-field">
      ${a(e,r,l)}
      <mc-media-picker
        .hass=${n}
        .value=${t||""}
        .mediaType=${s||""}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-media-picker>
    </div>
  `}function x(e,t,i,n,s,r,l,c){if(!s||!n)return o.qy``;const d=n.states[s];return d&&0!==Object.keys(d.attributes).length?o.qy`
    <div class="mc-field">
      ${a(e,r,l)}
      <mc-attribute-picker
        .hass=${n}
        .value=${t||""}
        .entityId=${s}
        @value-changed=${e=>i(e.detail.value)}
      ></mc-attribute-picker>${c?o.qy`<p class="help">${c}</p>`:o.s6}
    </div>
  `:o.qy``}i(7798),i(6796),i(2377)},394(e,t,i){i.d(t,["Z",0,{winter:555,spring:449,summer:468,autumn:40,christmas:105,new_year:316,valentine:535,easter:176,halloween:232,snow:435,rain:373,storm:513,sun:470,clouds:112,fog:207,wind:554,night:317,dusk:170}])},5816(e,t,i){i.d(t,{GR:()=>v,Oo:()=>$,RC:()=>d,Z:()=>y,a0:()=>A,aD:()=>M,ot:()=>f,rG:()=>S,s$:()=>_,ws:()=>k});var o=i(2016),n=i(8016);const a=["winter","spring","summer","autumn","christmas","new_year","valentine","easter","halloween","weather","daynight"],s={christmas:"12-01..12-26",new_year:"12-31..01-01",valentine:"02-14..02-14",easter:"auto",halloween:"10-24..10-31"},r=["new_year","christmas","valentine","easter","halloween"],l=[31,29,31,30,31,30,31,31,30,31,30,31];function c(e){const t=/^(\d\d)-(\d\d)$/.exec(e.trim());if(!t)return;const i=Number(t[1]),o=Number(t[2]);return i<1||i>12||o<1||o>l[i-1]?void 0:{month:i,day:o}}function d(e){if("string"!=typeof e)return;const t=e.split("..");if(t.length>2)return;const i=c(t[0]),o=2===t.length?c(t[1]):i;return i&&o?{start:i,end:o}:void 0}const h=e=>100*e.month+e.day;function u(e,t){const i=h({month:e.getMonth()+1,day:e.getDate()}),o=h(t.start),n=h(t.end);return o<=n?i>=o&&i<=n:i>=o||i<=n}function p(e){const t=function(e){const t=e%19,i=Math.floor(e/100),o=e%100,n=Math.floor(i/4),a=i%4,s=Math.floor((i+8)/25),r=(19*t+i-n-Math.floor((i-s+1)/3)+15)%30,l=(32+2*a+2*Math.floor(o/4)-r-o%4)%7,c=Math.floor((t+11*r+22*l)/451),d=Math.floor((r+l-7*c+114)/31);return new Date(e,d-1,(r+l-7*c+114)%31+1)}(e),i=e=>{const i=new Date(t.getFullYear(),t.getMonth(),t.getDate()+e);return{month:i.getMonth()+1,day:i.getDate()}};return{start:i(-7),end:i(1)}}const m=["winter","winter","spring","spring","spring","summer","summer","summer","autumn","autumn","autumn","winter"],g={winter:"summer",summer:"winter",spring:"autumn",autumn:"spring"};function f(e){return"string"==typeof e&&"south"===e.trim().toLowerCase()?"south":"north"}function v(e,t={}){return function(e,t){for(const i of r){const o=t?.[i];if(!1===o||"string"==typeof o&&"off"===o.trim().toLowerCase())continue;const n="string"==typeof o&&"auto"!==o.trim().toLowerCase()&&d(o)?o:s[i],a="auto"===n?"easter"===i?p(e.getFullYear()):void 0:d(n);if(a&&u(e,a))return i}}(e,t.calendar)??function(e,t="north"){const i=m[e.getMonth()];return"south"===t?g[i]:i}(e,f(t.hemisphere))}function b(e,t){try{const i=new Intl.DateTimeFormat("en-US",{timeZone:t,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}).formatToParts(e),o=e=>Number(i.find(t=>t.type===e)?.value),n={y:o("year"),mo:o("month"),d:o("day"),h:o("hour")%24,mi:o("minute"),s:o("second")};return Object.values(n).every(Number.isFinite)?n:void 0}catch{return}}function y(e,t){const i=(0,o.cj)(t),n=i?b(e,i):void 0;return n?new Date(n.y,n.mo-1,n.d,n.h,n.mi,n.s,e.getMilliseconds()):e}function _(e,t){const i=(0,o.cj)(t),n=i?b(e,i):void 0;if(!n)return new Date(e.getFullYear(),e.getMonth(),e.getDate()+1,0,0,0,0);const a=1e3*(60*(60*n.h+n.mi)+n.s)+e.getMilliseconds();return new Date(e.getTime()+864e5-a)}const w=new Set(a);function $(e){if(null!=e&&!1!==e)return!0===e?{}:"string"==typeof e?{scene:e}:"object"!=typeof e||Array.isArray(e)?void 0:e}function k(e){const t=e?.combine;return(Array.isArray(t)?t:"string"==typeof t?[t]:[]).filter(e=>"string"==typeof e&&""!==e.trim())}function x(e,t,i,o){const a=void 0===e?"auto":e;return"auto"===a?v(i,t):"string"==typeof a&&w.has(a)?"weather"===a?function(e,t){return e.weather_entity?(0,n.J4)(t?.states?.[e.weather_entity]?.state):void 0}(t,o):"daynight"===a?function(e){const t=e?.states?.["sun.sun"],i=t?.attributes?.elevation;return(0,n.p5)(t?.state,"number"==typeof i?i:"string"==typeof i&&""!==i.trim()?Number(i):void 0)}(o):a:void 0}function C(e){const t="string"==typeof e&&e.includes("%");let i="number"==typeof e?e:"string"==typeof e&&/^\s*-?\d*\.?\d+\s*%?\s*$/.test(e)?parseFloat(e):NaN;return Number.isFinite(i)?(!t&&i>0&&i<=1&&(i*=100),Math.round(Math.min(100,Math.max(0,i)))/100):.5}function S(e,t,i,o={}){const n=$(e);if(o.localDay||(t=y(t,i)),!n)return;if(n.entity&&"off"===i?.states?.[n.entity]?.state)return;const a=[],s=e=>{e&&!a.includes(e)&&a.push(e)};s(x(n.scene,n,t,i));for(const e of k(n))s(x(e,n,t,i));return a.length?{scenes:a,layer:"front"===n.layer?"front":"back",intensity:C(n.intensity),decorations:!1!==n.decorations}:void 0}function M(e){const t=$(e);if(!t)return[];const i=A(t),o=[];return t.entity&&o.push(t.entity),t.weather_entity&&i.includes("weather")&&o.push(t.weather_entity),i.includes("daynight")&&o.push("sun.sun"),o}function A(e){return[e.scene??"auto",...k(e)]}i.d(t,["MX",0,a,"jF",0,s])},379(e,t,i){function o(...e){return e.filter(e=>void 0!==e&&""!==e).map(e=>String(e)).join(".")}function n(e,t){const i=e.basePath?o(e.basePath,t):t;return e.notSynced.includes(i)}function a(e){return!!e.templateName}function s(e,t){return e.basePath?o(e.basePath,t):t}i.d(t,{dy:()=>s,gJ:()=>n,rJ:()=>a})},3566(e,t,i){i.d(t,{G:()=>h,cY:()=>c,lA:()=>l,u7:()=>r});const o={daily:1,hourly:2,twice_daily:4},n=["daily","hourly","twice_daily"],a={"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",exceptional:"mdi:alert-circle-outline",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant"},s={sunny:"mdi:weather-night",partlycloudy:"mdi:weather-night-partly-cloudy"};function r(e,t=!1){const i=e??"";return t&&s[i]||a[i]||"mdi:weather-partly-cloudy"}function l(e){const t=Number(e?.attributes.supported_features)||0;return n.filter(e=>t&o[e])}function c(e,t,i){if("unavailable"===e.state||"unknown"===e.state)return{status:"unavailable"};const o=l(e),n=function(e){const t=e.attributes.forecast;return Array.isArray(t)?t:void 0}(e),a=t??"daily";if(!o.length)return n?{status:"ok",type:a,forecast:n}:{status:"none"};const s=t&&o.includes(t)?t:o[0],r=i?.subscribe?.({type:"weather/subscribe_forecast",entity_id:e.entity_id,forecast_type:s});return"ok"===r?.status?{status:"ok",type:s,forecast:r.data?.forecast??[]}:n?{status:"ok",type:s,forecast:n}:r&&"unavailable"!==r.status?r:{status:"pending"}}const d=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];function h(e){if(null==e||""===e)return"";const t=Number(e);return Number.isNaN(t)?String(e):d[Math.round((t%360+360)%360/22.5)%16]}},2455(e,t,i){i.d(t,{EA:()=>s,fE:()=>a});var o=i(382);const n=o.OU.withTags(o.LJ);function a(e){try{return o.Bh(e,{indent:2,lineWidth:120,noRefs:!0,sortKeys:!1})}catch{return""}}function s(e){try{return o.Hh(e,{schema:n})}catch{return null}}},105(e,t,i){var o=i(6161),n=i(5116),a=i(158);const s=o.AH`:host{color:var(--primary-text-color,#1a1a2e);font-family:var(--paper-font-body1_-_font-family,'Roboto',sans-serif)}input,select,textarea,button{font-family:inherit;color:inherit}input[type='text'],input[type='number'],input[type='time'],select,textarea{padding:8px 10px;border:1px solid var(--divider-color,#e5e7eb);border-radius:8px;font-size:var(--ha-font-size-s,.875rem);background:var(--card-background-color,#fff);color:var(--primary-text-color,#1a1a2e);outline:none;box-sizing:border-box}input:focus,select:focus,textarea:focus{border-color:var(--primary-color,#6366f1);box-shadow:0 0 0 2px color-mix(in srgb,var(--primary-color,#6366f1) 20%,transparent)}button{border-radius:8px}`,r=o.AH`:host{display:block}.mc-editor{padding:20px;font-family:var(--paper-font-body1_-_font-family,'Roboto',sans-serif);color:var(--mc-text)}.mc-mode-help{margin:0 0 20px;font-size:var(--ha-font-size-xs,.75rem);color:var(--mc-text-secondary);line-height:1.5;max-width:60ch} .mc-editor-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:16px}.mc-toolbar-spacer{flex:1}.mc-toolbar-btn{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;border-radius:6px;cursor:pointer;color:var(--mc-text-secondary);transition:all .15s}.mc-toolbar-btn:hover:not(:disabled){background:var(--mc-border);color:var(--mc-text)}.mc-toolbar-btn:disabled{opacity:.3;cursor:default}.mc-editor-toolbar .mc-btn{height:32px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;border-radius:8px;font-size:var(--ha-font-size-s,.875rem)}.mc-linked-indicator{display:flex;align-items:center;gap:6px;padding:4px 10px;height:32px;color:var(--mc-primary);background:var(--mc-primary-light);border-radius:6px;cursor:pointer;transition:all .15s;border:none;font-size:var(--ha-font-size-s,.875rem);font-weight:500}.mc-toolbar-template-name{max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mc-linked-indicator:hover{filter:brightness(.95)}.mc-linked-badge{position:absolute;top:-4px;right:-4px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:var(--mc-primary);color:var(--text-primary-color,#fff);font-size:10px;font-weight:700;line-height:16px;text-align:center;box-shadow:0 0 0 2px var(--mc-bg)} .mc-linked-popup{position:absolute;top:100%;left:0;margin-top:4px;background:var(--card-background-color,#fff);border:1px solid var(--mc-border);border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);padding:12px;min-width:220px;z-index:100}.mc-linked-popup-name{font-size:var(--ha-font-size-s,.875rem);font-weight:600;color:var(--mc-text);margin-bottom:8px;display:flex;align-items:center;gap:6px}.mc-linked-popup-sync-summary{padding:8px 0;margin-bottom:4px;border-top:1px solid var(--mc-border);border-bottom:1px solid var(--mc-border)}.mc-sync-summary-header{font-size:var(--ha-font-size-xs,.75rem);font-weight:600;color:var(--warning-color,#ff9800);display:flex;align-items:center;gap:6px;margin-bottom:4px}.mc-sync-summary-header.synced{color:var(--success-color,#4caf50);margin-bottom:0}.mc-sync-summary-list{display:flex;flex-direction:column;gap:2px;max-height:150px;overflow-y:auto}.mc-sync-summary-item{display:flex;flex-direction:column;padding:3px 0 3px 20px;font-size:var(--ha-font-size-xs,.75rem)}.mc-sync-summary-location{font-weight:600;color:var(--mc-text)}.mc-sync-summary-paths{color:var(--secondary-text-color,#666)}.mc-linked-popup-actions{display:flex;flex-direction:column;gap:4px}.mc-linked-popup-btn{display:flex;align-items:center;gap:8px;padding:10px 12px;border:none;background:none;border-radius:6px;cursor:pointer;font-size:var(--ha-font-size-s,.875rem);color:var(--mc-text);transition:background .15s;width:100%;text-align:left}.mc-linked-popup-btn:hover{background:var(--mc-border)}.mc-linked-popup-btn.danger{color:var(--error-color,#f44336)}.mc-linked-popup-btn.danger:hover{background:color-mix(in srgb,var(--error-color,#f44336) 10%,transparent)} .mc-toolbar-linked-container{position:relative}.mc-selected-context{display:flex;align-items:center;gap:10px;padding:8px 12px;border:none;border-left:3px solid var(--mc-primary);border-radius:6px;background:var(--mc-primary-light);margin-bottom:12px;font-size:var(--ha-font-size-s,.875rem);color:var(--mc-text)}.mc-selected-context ha-icon{color:var(--mc-primary);flex-shrink:0}.mc-selected-context strong{font-weight:600;color:var(--mc-primary)} .mc-settings-panel{border:1px solid var(--mc-border);border-radius:var(--mc-radius-md);overflow:hidden;margin-top:12px}.mc-settings-header{display:flex;align-items:center;gap:10px;padding:14px 16px;background:var(--mc-primary-light);border-bottom:1px solid var(--mc-border);font-size:var(--ha-font-size-s,.875rem);font-weight:500}.mc-settings-tabs{display:flex;border-bottom:1px solid var(--mc-border)}.mc-settings-tab{flex:1;padding:10px;border:none;background:none;cursor:pointer;font-size:var(--ha-font-size-xs,.75rem);font-weight:500;color:var(--mc-text-secondary);border-bottom:2px solid transparent;transition:all .15s;text-align:center}.mc-settings-tab.active{color:var(--mc-primary);border-bottom-color:var(--mc-primary)}.mc-settings-tab:hover:not(.active){color:var(--mc-text)}.mc-settings-content{padding:16px}.mc-bp-xs,.mc-bp-sm{padding:14px}.mc-bp-xs .mc-editor-toolbar,.mc-bp-sm .mc-editor-toolbar{gap:6px;margin-bottom:10px}.mc-bp-xs .mc-btn,.mc-bp-sm .mc-btn{padding:8px 10px} .mc-tab-content{display:flex;flex-direction:column;gap:16px}.mc-section{display:flex;flex-direction:column;gap:10px}.mc-section-header{font-size:var(--ha-font-size-s,.875rem);font-weight:600;color:var(--mc-text);padding-bottom:6px;border-bottom:1px solid var(--mc-border);margin-top:12px}.mc-field{display:flex;flex-direction:column;gap:6px}.mc-field-label{font-size:var(--mc-font-size-xs,.75rem);font-weight:500;color:var(--mc-text-secondary);text-transform:uppercase;letter-spacing:.04em}.mc-field input[type='text'],.mc-field input[type='number'],.mc-field select,.mc-field textarea{padding:10px 12px;border:1px solid var(--mc-border);border-radius:8px;font-size:var(--ha-font-size-s,.875rem);background:var(--mc-bg);color:var(--mc-text);outline:none;transition:border-color .15s;width:100%;box-sizing:border-box}.mc-field input:focus,.mc-field select:focus,.mc-field textarea:focus{border-color:var(--mc-primary)}.mc-field-toggle{flex-direction:row;align-items:center;justify-content:space-between}.mc-field-toggle input[type='checkbox']{width:18px;height:18px;accent-color:var(--mc-primary)}.mc-field-hint{font-size:var(--ha-font-size-xs,.75rem);color:var(--mc-text-secondary);font-style:italic}.mc-field-hint-tight{margin-top:-4px;margin-bottom:8px}.mc-field-hint-with-margin{margin-bottom:8px}.mc-entity-field{position:relative}.mc-entity-field input{width:100%;padding:10px 12px;border:1px solid var(--mc-border);border-radius:8px;font-size:var(--ha-font-size-s,.875rem);background:var(--mc-bg);color:var(--mc-text);outline:none;transition:border-color .15s;box-sizing:border-box}.mc-entity-field input:focus{border-color:var(--mc-primary)} .mc-btn{padding:10px 18px;border-radius:8px;border:none;cursor:pointer;font-size:var(--ha-font-size-s,.875rem);font-weight:500;transition:all .15s}.mc-btn-primary{background:var(--mc-primary);color:var(--text-primary-color,#fff)}.mc-btn-primary:hover{filter:brightness(1.1)}.mc-btn-secondary{background:var(--mc-surface-recessed);color:var(--mc-text)}.mc-btn-secondary:hover{background:color-mix(in srgb,var(--mc-text) 10%,transparent)}.mc-btn-compact{padding:4px 8px;font-size:var(--ha-font-size-xs,.75rem)}.mc-btn-icon{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid var(--mc-border);border-radius:8px;background:none;cursor:pointer;color:var(--mc-text-secondary);font-size:1rem;transition:all .15s}.mc-btn-icon:hover{background:var(--mc-border);color:var(--mc-text)}.mc-option-row{display:flex;gap:8px;align-items:flex-end;margin-bottom:8px}.mc-option-row .mc-field{flex:1}.mc-card-editor-section{border:1px solid var(--divider-color,#e5e7eb);border-radius:8px;overflow:hidden}.mc-card-editor-header{display:flex;align-items:center;gap:8px;padding:10px 12px;font-size:.8125rem;font-weight:600;color:var(--primary-color,#6366f1);background:color-mix(in srgb,var(--primary-color,#6366f1) 6%,transparent);border-bottom:1px solid var(--divider-color,#e5e7eb)}.mc-card-editor-icon{--mdc-icon-size:16px}.mc-card-editor-body{padding:16px}.mc-card-editor-toolbar{display:flex;justify-content:flex-end;margin-bottom:12px}.mc-card-editor-toggle:disabled{opacity:.5;cursor:not-allowed}.mc-yaml-fallback textarea{width:100%;min-height:200px;font-family:monospace;font-size:.8125rem;resize:vertical;border:1px solid var(--divider-color,#e5e7eb);border-radius:6px;padding:12px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#1a1a2e);box-sizing:border-box}.mc-yaml-fallback textarea:focus{outline:none;border-color:var(--primary-color,#6366f1)}.mc-yaml-fallback-note{margin-bottom:8px;font-size:.8125rem;color:var(--secondary-text-color,#6b7280)}.mc-yaml-fallback-error{color:var(--error-color,#ef4444);font-size:.8125rem;margin-top:4px}.mc-yaml-fallback-help{margin-top:4px;font-size:.75rem;color:var(--secondary-text-color,#6b7280)}.mc-editor-loading{display:flex;align-items:center;justify-content:center;min-height:100px;color:var(--secondary-text-color,#757575);font-size:.875rem} @keyframes mc-skel-shimmer{0%{background-position:-240px 0}100%{background-position:calc(240px + 100%) 0}}.mc-skel{background:linear-gradient( 90deg,color-mix(in srgb,var(--mc-text) 5%,transparent) 25%,color-mix(in srgb,var(--mc-text) 10%,transparent) 50%,color-mix(in srgb,var(--mc-text) 5%,transparent) 75% );background-size:240px 100%;background-repeat:no-repeat;background-color:var(--mc-surface-recessed);border-radius:6px;animation:mc-skel-shimmer 1.4s ease-in-out infinite}.mc-skel-switcher{height:44px;border-radius:var(--mc-radius-md);margin-bottom:8px}.mc-skel-line{height:12px;margin-bottom:20px}.mc-skel-line-short{width:60%}.mc-skel-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:16px}.mc-skel-spacer{flex:1}.mc-skel-icon-btn{width:32px;height:32px;border-radius:6px}.mc-skel-pill{width:100px;height:32px;border-radius:8px}.mc-skel-card-header{height:44px;margin-bottom:12px;border-radius:8px}.mc-skel-row{height:96px;margin-bottom:12px;border-radius:8px} .mc-condition-item{padding:16px;border:1px solid var(--mc-border);border-radius:var(--mc-radius-md);display:flex;flex-direction:column;gap:10px;position:relative}.mc-condition-item .mc-btn-icon{position:absolute;top:8px;right:8px}.mc-conditions-list{display:flex;flex-direction:column;gap:8px;margin:8px 0} .mc-cond-appearance-section{margin-top:20px;padding-top:16px;border-top:1px solid var(--mc-border,var(--divider-color,#e5e7eb));display:flex;flex-direction:column;gap:10px}.mc-cond-appearance-header{display:flex;align-items:center;gap:8px;font-size:.95rem;font-weight:600;color:var(--mc-text,var(--primary-text-color))}.mc-cond-appearance-header ha-icon{--mdc-icon-size:18px;color:var(--primary-color,#6366f1)}.mc-cond-appearance-list{display:flex;flex-direction:column;gap:8px}.mc-cond-appearance-rule{border:1px solid var(--mc-border,var(--divider-color,#e5e7eb));border-radius:8px;background:color-mix(in srgb,var(--primary-color,#6366f1) 4%,transparent);overflow:hidden}.mc-cond-appearance-rule.expanded{border-color:color-mix(in srgb,var(--primary-color,#6366f1) 30%,var(--mc-border,var(--divider-color,#e5e7eb)))}.mc-cond-appearance-rule-header{display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;user-select:none;background:color-mix(in srgb,var(--primary-color,#6366f1) 6%,transparent)}.mc-cond-appearance-rule-header:hover{background:color-mix(in srgb,var(--primary-color,#6366f1) 10%,transparent)}.mc-cond-appearance-rule-header ha-icon{--mdc-icon-size:18px;color:var(--mc-text-secondary,var(--secondary-text-color))}.mc-cond-appearance-rule-name{flex:1;border:none;background:transparent;font-size:.9rem;font-weight:500;color:var(--mc-text,var(--primary-text-color));padding:4px 6px;border-radius:4px;min-width:0}.mc-cond-appearance-rule-name:hover,.mc-cond-appearance-rule-name:focus{background:var(--mc-bg,var(--card-background-color,#fff));outline:1px solid var(--mc-border,var(--divider-color,#e5e7eb))}.mc-cond-appearance-rule-count{font-size:.7rem;color:var(--mc-text-secondary,var(--secondary-text-color));padding:2px 6px;background:var(--mc-bg,var(--card-background-color,#fff));border-radius:10px;border:1px solid var(--mc-border,var(--divider-color,#e5e7eb))}.mc-cond-appearance-rule-body{padding:12px;display:flex;flex-direction:column;gap:10px;background:var(--mc-bg,var(--card-background-color,#fff))}.mc-cond-appearance-subhead{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--mc-text-secondary,var(--secondary-text-color));margin-top:6px}.mc-cond-appearance-subhead:first-child{margin-top:0} .mc-action-config{display:flex;flex-direction:column;gap:8px;padding:8px;// border:1px solid var(--mc-border);border-radius:6px} .mc-modal{background:var(--card-background-color,#fff);border-radius:12px;box-shadow:0 20px 40px rgba(0,0,0,.3);width:480px;max-width:100%;max-height:85vh;display:flex;flex-direction:column;overflow:hidden}.mc-modal-header{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid var(--divider-color,#e5e7eb);background:var(--card-background-color,#fff)}.mc-modal-header ha-icon{color:var(--primary-color,#6366f1);--mdc-icon-size:24px}.mc-modal-title{flex:1;font-size:var(--ha-font-size-l,1.25rem);font-weight:600;color:var(--primary-text-color,#1a1a2e)}.mc-modal-close{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;cursor:pointer;color:var(--secondary-text-color,#6b7280);border-radius:6px;font-size:1.5rem;line-height:1}.mc-modal-close:hover{background:var(--divider-color,#e5e7eb);color:var(--primary-text-color,#1a1a2e)}.mc-modal-body{flex:1;overflow-y:auto;padding:24px}.mc-modal-footer{display:flex;justify-content:flex-end;gap:10px;padding:16px 20px;border-top:1px solid var(--divider-color,#e5e7eb)}   .mc-field input:focus-visible,.mc-field select:focus-visible,.mc-field textarea:focus-visible,.mc-entity-field input:focus-visible,.mc-card-name-input:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb,var(--mc-primary) 25%,transparent)}`,l=[n.A,s,r,...a.x],c=o.AH`:host{display:block;min-width:0} .mc-picker-row{display:flex;gap:8px;align-items:stretch;min-width:0}.mc-picker-row>.input,.mc-picker-row>.mc-picker-value{flex:1 1 auto;min-width:0}.mc-picker-row>.btn{flex:none}.mc-picker-value{display:flex;align-items:center;gap:10px;min-height:40px;padding:6px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);text-align:left;transition:border-color .15s ease-out}.mc-picker-value:hover{border-color:var(--mc-text-2)}.mc-picker-value>ha-icon{flex:none;--mdc-icon-size:20px;color:var(--mc-text-2)}.mc-picker-value-text{flex:1;min-width:0;display:grid;line-height:1.35}.mc-picker-value-name{font-size:.875rem;overflow-wrap:anywhere}.mc-picker-value-id{font-family:var(--mc-mono);font-size:.75rem;color:var(--mc-text-2);overflow-wrap:anywhere}.mc-picker-value .dot{background:var(--mc-success)}.mc-picker-value .dot.is-off{background:var(--mc-field-border)}.mc-picker-value .dot.is-unavailable{background:var(--mc-error-ink)}  mc-ui-window::part(body){display:flex;flex-direction:column;padding:0;overflow-x:hidden;overflow-y:auto} .mc-picker-stack{display:flex;flex:1 1 auto;flex-direction:column;min-height:24rem} .mc-picker-search{padding:12px 16px;display:grid;gap:12px;border-bottom:1px solid var(--mc-divider)}.mc-picker-search .input{min-height:40px}@media (max-height:560px){.mc-picker-search{padding:8px 16px}} .mc-picker-list{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:8px;display:grid;align-content:start;grid-auto-rows:max-content;gap:2px} mc-ui-window .mc-picker-list{min-height:11rem}.mc-picker-category,.mc-picker-domain{padding:12px 12px 4px;font-size:.8125rem;font-weight:500;color:var(--mc-text-2)}.mc-picker-category:first-child,.mc-picker-domain:first-child{padding-top:4px} .mc-picker-item{display:flex;align-items:center;gap:12px;width:100%;min-height:48px;padding:6px 12px;border:1px solid transparent;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text);text-align:left;cursor:pointer;transition:background-color .15s ease-out}.mc-picker-item:hover{background:var(--mc-surface-2)}.mc-picker-item.selected,.mc-picker-item[aria-selected='true']{background:var(--mc-accent-tint);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent)}.mc-picker-item:focus-visible{outline-offset:-2px}.mc-picker-item-icon{flex:none;display:grid;place-items:center;width:24px;height:24px;color:var(--mc-text-2);--mdc-icon-size:20px}.mc-picker-item.selected .mc-picker-item-icon,.mc-picker-item[aria-selected='true'] .mc-picker-item-icon{color:var(--mc-accent-ink)}.mc-picker-item-content{flex:1;min-width:0;display:grid;line-height:1.35}.mc-picker-item-name{font-size:.875rem;font-weight:500;overflow-wrap:anywhere}.mc-picker-item-id{font-family:var(--mc-mono);font-size:.75rem;color:var(--mc-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mc-picker-item-desc,.mc-picker-item-meta{font-size:.75rem;color:var(--mc-text-2);margin-top:2px}.mc-picker-item-desc{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.mc-picker-item>.chip{flex:none;max-width:40%;overflow:hidden;text-overflow:ellipsis}.mc-picker-item-thumb{flex:none;width:40px;height:40px;border-radius:var(--mc-radius);object-fit:cover;background:var(--mc-surface-2)}.mc-picker-item-actions{display:flex;gap:2px;flex:none}.mc-picker-item-chev{flex:none;--mdc-icon-size:20px;color:var(--mc-text-2)} .mc-picker-breadcrumbs{display:flex;align-items:center;gap:2px;padding:8px 12px;border-bottom:1px solid var(--mc-divider);overflow-x:auto;white-space:nowrap;flex-shrink:0;--mdc-icon-size:16px}.mc-picker-breadcrumbs>ha-icon{color:var(--mc-text-2);flex:none}.mc-breadcrumb-current{padding:0 8px;font-size:.8125rem;font-weight:500} .mc-picker-empty,.mc-picker-loading{padding:32px 16px;text-align:center;font-size:.8125rem;color:var(--mc-text-2)} .mc-picker-footer{display:flex;flex:1;justify-content:flex-end;flex-wrap:wrap;gap:8px}`,d=o.AH`:host{display:block}.mc-yaml-container{display:flex;flex-direction:column;gap:8px;min-height:300px}.mc-yaml-editor-wrapper{border:1px solid var(--divider-color,#e5e7eb);border-radius:8px;overflow:hidden;position:relative}.mc-yaml-textarea{width:100%;min-height:300px;padding:12px;border:none;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace;font-size:var(--ha-font-size-s,.875rem);line-height:1.5;resize:vertical;background:var(--card-background-color,#fff);color:var(--primary-text-color,#1a1a2e);outline:none;tab-size:2;box-sizing:border-box}.mc-yaml-error{padding:8px 12px;background:color-mix(in srgb,var(--error-color,#ef4444) 10%,transparent);color:var(--error-color,#ef4444);border-radius:6px;font-size:var(--ha-font-size-xs,.75rem)}.mc-yaml-status{display:flex;align-items:center;gap:8px;font-size:var(--ha-font-size-xs,.75rem);color:var(--secondary-text-color,#6b7280);padding:4px 0}.mc-yaml-status-dot{width:8px;height:8px;border-radius:50%;background:var(--success-color,#22c55e)}.mc-yaml-status-dot.error{background:var(--error-color,#ef4444)}`,h=o.AH`.mc-template-form{display:grid;gap:16px;padding:16px 20px}.mc-template-error{font-size:.8125rem;color:var(--mc-error-ink)}.mc-template-overwrite{font-size:.8125rem;color:var(--mc-warn-ink)}.mc-template-confirm{display:grid;gap:8px;padding:12px 16px;background:var(--mc-surface-2);border-bottom:1px solid var(--mc-divider)}.mc-template-confirm-text{font-size:.8125rem}.mc-template-confirm-actions,.mc-template-edit-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px}.mc-template-edit-form{display:grid;gap:12px;padding:16px;background:var(--mc-surface-2);border-bottom:1px solid var(--mc-divider)}.mc-template-edit-form textarea.input,.mc-template-form textarea.input{min-height:64px;font-family:inherit;font-size:.875rem}`,u=o.AH`.mc-picker-item.is-active{background:var(--mc-surface-2);border-color:var(--mc-field-border)}.mc-picker-item.is-active[aria-selected='true']{background:var(--mc-accent-tint);border-color:var(--mc-accent)}.mc-picker-more{padding:8px 12px 4px;font-size:.75rem;color:var(--mc-text-2);text-align:center}.mc-picker-footer .spacer{flex:1}.mc-picker-footer .clear{margin-left:-8px}`,p=o.AH`.mc-font-preview{display:flex;align-items:center;justify-content:center;min-height:64px;margin:12px 16px 0;padding:12px;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);background:var(--mc-surface-2);text-align:center}.mc-font-preview-text{font-size:1.5rem;line-height:1.3;color:var(--mc-text);overflow-wrap:anywhere}`,m=o.AH`.swatch{position:relative;overflow:hidden;padding:3px}.swatch-fill{position:absolute;inset:3px;border-radius:5px;background-image:linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%);background-size:8px 8px;background-position:0 0,0 4px,4px -4px,-4px 0}.swatch-fill>span{position:absolute;inset:0;border-radius:inherit}.swatch:disabled{cursor:default} .entity-toggle[aria-pressed='true'],.entity-toggle[aria-pressed='true']:hover{background:var(--mc-accent-tint);color:var(--mc-accent-ink)}.entity-opacity{margin-top:8px} .mc-color-body{display:grid;gap:16px;padding:16px;overflow-y:auto;overscroll-behavior:contain}.mc-color-area{position:relative;width:100%;height:180px;border-radius:var(--mc-radius);cursor:crosshair;touch-action:none}.mc-color-area-gradient{position:absolute;inset:0;border-radius:var(--mc-radius);background:linear-gradient(to right,#fff,transparent),linear-gradient(to top,#000,transparent)}.mc-color-area-pointer,.mc-slider-thumb{position:absolute;width:16px;height:16px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,.3),0 1px 3px rgba(0,0,0,.3);transform:translate(-50%,-50%);pointer-events:none}.mc-slider-row{display:flex;align-items:center;gap:12px}.mc-slider-label{width:16px;flex:none;font-size:.75rem;font-weight:500;color:var(--mc-text-2)}.mc-slider-track{position:relative;flex:1;height:12px;border-radius:9999px;cursor:pointer;touch-action:none}.mc-slider-thumb{top:50%}.mc-hue-track{background:linear-gradient(to right,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)}.mc-opacity-track{background-image:linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%);background-size:8px 8px;background-position:0 0,0 4px,4px -4px,-4px 0}.mc-opacity-gradient{position:absolute;inset:0;border-radius:inherit}.mc-slider-row>.input{flex:none;width:64px;min-height:32px;padding:4px 8px;text-align:center}.mc-input-row{display:grid;grid-template-columns:minmax(0,2fr) repeat(3,minmax(0,1fr));gap:8px}.mc-input-row .field{gap:4px}.mc-input-row .lbl{font-size:.75rem;color:var(--mc-text-2)}.mc-input-row .input{min-width:0;padding:8px;font-family:var(--mc-mono);font-size:.8125rem}.mc-color-section{display:grid;gap:8px}.mc-color-section-header{font-size:.8125rem;font-weight:500}.mc-color-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:4px}.mc-color-swatch,.mc-saved-swatch{position:relative;padding:0;border:1px solid var(--mc-divider);border-radius:6px}.mc-color-swatch{aspect-ratio:1}.mc-color-swatch:hover,.mc-saved-swatch:hover{border-color:var(--mc-text-2)}.mc-color-swatch.var-color{display:grid;place-items:center;overflow:hidden} .mc-color-swatch .var-tag{padding:1px 4px;border-radius:3px;background:rgba(0,0,0,.78);color:#fff;font-size:.6875rem;line-height:1.2}.mc-saved-colors{display:flex;flex-wrap:wrap;gap:6px}.mc-saved-swatch{width:32px;height:32px}.mc-saved-pick{position:absolute;inset:0;padding:0;border:0;border-radius:inherit;background:transparent}.mc-saved-pick:focus-visible{outline-offset:1px}.mc-saved-swatch .mc-remove-btn{position:absolute;top:-8px;right:-8px;display:none;place-items:center;width:18px;height:18px;padding:0;border:1px solid var(--mc-divider);border-radius:50%;background:var(--mc-surface);color:var(--mc-text-2);--mdc-icon-size:12px}.mc-saved-swatch:hover .mc-remove-btn,.mc-saved-swatch:focus-within .mc-remove-btn{display:grid}.mc-saved-swatch .mc-remove-btn:hover{color:var(--mc-error-ink)}`;i.d(t,["BP",0,h,"Qx",0,p,"fz",0,c,"kx",0,u,"rF",0,d,"yg",0,m,"yj",0,l])},158(e,t,i){var o=i(6161),n=i(21),a=i(802),s=i(6971);const r=o.AH`:host .seg>button:is([aria-checked=true],[aria-selected=true],[aria-pressed=true]){font-weight:700;box-shadow:inset 0 -3px 0 var(--mc-accent-ink)}`,l=[n.e,a.a,s.$,r];i.d(t,["x",0,l])},21(e,t,i){const o=i(6161).AH`:host{--mc-accent:var(--primary-color,#03a9f4);--mc-accent-ink:color-mix(in srgb,var(--primary-color,#03a9f4) 60%,var(--primary-text-color,#212121)); --mc-accent-fill:color-mix(in srgb,var(--primary-color,#03a9f4) 70%,#000);--mc-on-accent:#fff;--mc-accent-tint:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,transparent);--mc-surface:var(--card-background-color,#fff);--mc-surface-2:var(--secondary-background-color,#f2f3f5);--mc-ground:var(--primary-background-color,#fafafa);--mc-text:var(--primary-text-color,#212121);--mc-text-2:var(--secondary-text-color,#5f6368);--mc-divider:var(--divider-color,rgba(0,0,0,.12)); --mc-field-border:var(--secondary-text-color,#727272);--mc-warn-ink:color-mix(in srgb,var(--warning-color,#ff9800) 45%,var(--primary-text-color,#212121));--mc-warn-tint:color-mix(in srgb,var(--warning-color,#ff9800) 12%,transparent);--mc-error-ink:color-mix(in srgb,var(--error-color,#db4437) 75%,var(--primary-text-color,#212121));--mc-success:var(--success-color,#43a047); --mc-sel-module:var(--mc-accent);--mc-sel-module-fill:var(--mc-accent-fill);--mc-sel-module-ink:var(--mc-accent-ink);--mc-sel-module-tint:var(--mc-accent-tint);--mc-sel-col:color-mix(in srgb,var(--success-color,#43a047) 85%,var(--primary-text-color,#212121));--mc-sel-col-fill:color-mix(in srgb,var(--success-color,#43a047) 70%,#000);--mc-sel-col-ink:color-mix(in srgb,var(--success-color,#43a047) 60%,var(--primary-text-color,#212121));--mc-sel-col-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-sel-row:color-mix(in srgb,var(--warning-color,#ff9800) 70%,var(--primary-text-color,#212121));--mc-sel-row-fill:color-mix(in srgb,var(--warning-color,#ff9800) 55%,#000);--mc-sel-row-ink:var(--mc-warn-ink);--mc-sel-row-tint:var(--mc-warn-tint);--mc-sel-card:var(--mc-text-2);--mc-sel-card-fill:color-mix(in srgb,var(--secondary-text-color,#5f6368) 70%,#000);--mc-sel-card-ink:color-mix(in srgb,var(--secondary-text-color,#5f6368) 60%,var(--primary-text-color,#212121));--mc-sel-card-tint:color-mix(in srgb,var(--secondary-text-color,#5f6368) 12%,transparent);--mc-canvas:color-mix(in srgb,var(--primary-text-color,#212121) 6%,var(--primary-background-color,#fafafa));--mc-canvas-dot:color-mix(in srgb,var(--primary-text-color,#212121) 16%,transparent);--mc-shadow-float:0 8px 24px rgba(0,0,0,.16),0 2px 6px rgba(0,0,0,.08);--mc-mono:'Roboto Mono',ui-monospace,SFMono-Regular,Consolas,monospace;--mc-radius:8px;--mc-radius-lg:12px; --mc-hit:40px;--mc-font:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif));--mc-focus:var(--mc-accent);--mc-error-tint:color-mix(in srgb,var(--error-color,#db4437) 12%,transparent);--mc-error-fill:color-mix(in srgb,var(--error-color,#db4437) 75%,#000);--mc-success-ink:color-mix(in srgb,var(--success-color,#43a047) 55%,var(--primary-text-color,#212121));--mc-success-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-scrim:rgba(0,0,0,.38);font-family:inherit;color:var(--mc-text);caret-color:var(--mc-accent)}@supports (color:color-mix(in srgb,red 50%,blue)){:host{--mc-field-border:color-mix(in srgb,var(--primary-text-color,#212121) 50%,transparent);--mc-focus:color-mix(in srgb,var(--mc-accent) 80%,var(--mc-text))}}@media (pointer:coarse){:host{--mc-hit:44px}}`;i.d(t,["e",0,o])},15(e,t,i){var o=i(9100);const n={"top-left":1099,top:1098,"top-right":1100,left:511,center:182,right:833,"bottom-left":143,bottom:142,"bottom-right":144};i.d(t,["H",0,e=>(0,o.t)(n[e])])},3795(e,t,i){i.d(t,{hN:()=>s,kk:()=>a,q2:()=>r});var o=i(1987);const n=[{value:"image",label:479,icon:"mdi:image-outline"},{value:"gradient",label:425,icon:"mdi:gradient-vertical"},{value:"pattern",label:723,icon:"mdi:dots-grid"},{value:"color",label:205,icon:"mdi:palette-outline"}];function a(e){const t=n.find(t=>t.value===e.type)?.label??479;let i;return"image"===e.type?i=e.entity||(e.image?e.image.split("/").pop():void 0)||void 0:"pattern"===e.type?i=e.pattern:"color"===e.type&&(i=e.color),i?{type:t,detail:i}:{type:t}}function s(e){return e?JSON.parse(JSON.stringify(e)):[]}function r(e){return(e??[]).some((e,t)=>{const i=(0,o.BS)(t);return!!i&&!e.hidden&&"error"===i.status&&"stale"!==i.reason})}i.d(t,["m2",0,n])},1987(e,t,i){i.d(t,{BS:()=>l,DZ:()=>p,Lx:()=>r,P3:()=>f,Rv:()=>g,VX:()=>h,Wb:()=>d,cj:()=>c,hV:()=>u});const o=new Map,n=new Set;let a,s;function r(e){if(!e||"object"!=typeof e)return;const t=Number(e.index);if(!(!Number.isInteger(t)||t<0||t>=4)){o.set(t,{index:t,status:e.status,reason:e.reason,detail:e.detail});for(const e of n)e()}}function l(e){return o.get(e)}function c(){o.clear(),s=void 0;for(const e of n)e()}function d(e){return n.add(e),()=>n.delete(e)}function h(e){a=e;for(const e of n)e()}function u(){const e=a;return a=void 0,e}function p(e){s=e;for(const e of n)e()}let m=0;function g(){m++;let e=!1;return()=>{e||(e=!0,m--,m||p(void 0))}}function f(){return s}i.d(t,["Sb",0,()=>m>0])},6355(e,t,i){let o;i.d(t,{AY:()=>a,Wc:()=>s,vs:()=>r,xr:()=>l});const n=new Set;function a(e){o=e}function s(e){return o?o(e):{}}function r(){for(const e of n)e()}function l(e){return n.add(e),()=>n.delete(e)}},4700(e,t,i){i.d(t,{AO:()=>E,Ao:()=>g,Bm:()=>z,HR:()=>q,J9:()=>M,K9:()=>w,TV:()=>_,XF:()=>$,YZ:()=>x,Z8:()=>C,ZZ:()=>h,aI:()=>d,d6:()=>S,ff:()=>b,so:()=>f,t8:()=>L,ts:()=>A,xc:()=>c});var o=i(9777),n=i(5746),a=i(2455),s=i(2453);const r=new Set(["top-left","top","top-right","left","center","right","bottom-left","bottom","bottom-right"]),l=e=>"string"==typeof e&&r.has(e);function c(e){const t=e.placement;return"background"===t||"overlay"===t?t:"flow"}function d(e){return"video-bg"===e.type&&void 0===e.placement}function h(e){const t=e.layer;return t&&"object"==typeof t&&!Array.isArray(t)?t:{}}const u=new Set(["__proto__","constructor","prototype"]),p=e=>{const t={};for(const[i,o]of Object.entries(e))void 0===o||u.has(i)||(t[i]=o);return Object.keys(t).length?t:void 0};function m(e,t){const i={...e};return t?i.layer=t:delete i.layer,i}function g(e,t){const i={...h(e)},o={...e};if("flow"===t)return"video-bg"===e.type?o.placement="flow":delete o.placement,m(o,p(i));if(o.placement=t,"overlay"===t){delete i.fill,i.anchor=l(i.anchor)?i.anchor:"top-left";const{anchor:e,...t}=i;return m(o,p({anchor:e,...t}))}return delete i.anchor,delete i.offset_x,delete i.offset_y,m(o,p(i))}function f(e,t){return m(e,p({...h(e),...t}))}const v={style:"bottom",strength:60};function b(e){return e>=60?"readable":e>=45?"large":"tint"}const y=e=>Math.max(0,Math.min(90,Math.round(Number.isFinite(e)?e:v.strength)));function _(e,t){const i=h(e);if("off"===t)return m(e,p({...i,scrim:void 0}));if("on"===t)return m(e,p({...i,scrim:i.scrim??{...v}}));const o={...i.scrim??v,...t};void 0!==t.strength&&(o.strength=y(t.strength));for(const e of Object.keys(o))void 0===o[e]&&delete o[e];return m(e,p({...i,scrim:o}))}function w(e,t){return"x"===t?e.includes("left")||e.includes("right")?"edge":"centre":e.includes("top")||e.includes("bottom")?"edge":"centre"}function $(e,t){return"centre"===w(e,t)?"centre":"x"===t?e.includes("left")?"left":"right":e.includes("top")?"top":"bottom"}const k=/^-?\d{1,4}(\.\d{1,2})?(px|%)$/;function x(e,t,i){const o=e.trim();if(o)return k.test(o)?o.startsWith("-")&&"edge"===w(t,i)?"negative":void 0:"format"}function C(e){return e.count-e.index}function S(e){const t=e.actions,i="string"==typeof e.entity?e.entity:void 0;return[t?.tap_action,t?.hold_action,t?.double_tap_action].some(e=>(0,o.Q)(e,i))}function M(e){const t=h(e).click_through;return"boolean"==typeof t?t:function(e){return"overlay"!==c(e)||!S(e)}(e)}function A(e){const t={};return void 0!==e.placement&&(t.placement=e.placement),void 0!==e.layer&&"flow"!==c(e)&&(t.layer=e.layer),Object.keys(t).length?(0,a.fE)(t).trimEnd():""}function q(e,t,i){const o=e[t];if(!o)return;const n=c(o),a=[];e.forEach((e,t)=>{c(e)===n&&a.push(t)});const s=a.indexOf(t),r="front"===i?a.length-1:"back"===i?0:"forward"===i?s+1:s-1;return r<0||r>=a.length||r===s?void 0:a[r]}function E(e){const t="string"==typeof e.editor_name&&e.editor_name.trim();if(t)return t;const i=(0,s.$N)(e),o=(0,s.Iu)(e);return i?`${o} · ${i}`:o}const T=e=>"flow"===c(e)&&!d(e);function L(e,t){const i=t.child;if(!i?.length){const i=e.rows?.[t.row]?.columns?.[t.col]?.modules;if(!Array.isArray(i))return;return{list:i,index:t.module,pathOf:e=>(0,s.VC)((0,s.br)(t.row,t.col,e))}}const o=e.rows?.[t.row]?.columns?.[t.col]?.modules?.[t.module],a=(0,n.Rv)(o,i.slice(0,-1)),r=i[i.length-1],l=(0,n.yZ)(a)?.[r.slot];if(l&&a)return{list:l,index:r.index,parent:a,pathOf:e=>(0,s.VC)((0,s.br)(t.row,t.col,t.module,[...i.slice(0,-1),{slot:r.slot,index:e}]))}}function z(e,t){const i=L(e,t),o=i?.list[i.index],n=o?c(o):"flow",a=i?.list??[],r=a.filter((e,t)=>t!==i?.index&&T(e)).length,l=a.map((e,t)=>({m:e,i:t})).filter(({m:e})=>c(e)===n&&!("flow"===n)),d=l.findIndex(({i:e})=>e===i?.index),h=a.flatMap((e,t)=>t!==i?.index&&T(e)&&S(e)?[{path:i.pathOf(t),name:E(e)}]:[]);return{siblings:r,canHoist:!t.child?.length||"row"===i?.parent?.type,...d>=0?{rank:{index:d,count:l.length}}:{},path:(0,s.VC)(t),name:o?E(o):"",others:h}}i.d(t,["Fi",0,y,"R7",0,v,"WF",0,[{id:"light",strength:25},{id:"medium",strength:45},{id:"strong",strength:60},{id:"very-strong",strength:75}],"m4",0,l])},9219(e,t,i){i.d(t,{GC:()=>c,RQ:()=>d,bE:()=>l});var o=i(2016);const n={short:{weekday:"short",month:"short",day:"numeric"},medium:{month:"short",day:"numeric",year:"numeric"},long:{weekday:"long",month:"long",day:"numeric",year:"numeric"},numeric:{year:"numeric",month:"numeric",day:"numeric"}},a=e=>Object.prototype.hasOwnProperty.call(n,e);function s(e,t,i){const n=(0,o.cj)(e),a=n?{...i,timeZone:n}:i,s=(0,o.XN)(e)??(new Intl.DateTimeFormat).resolvedOptions().locale;try{return new Intl.DateTimeFormat(`${s.split("-u-")[0]}-u-${t}`,a)}catch{return new Intl.DateTimeFormat(`en-u-${t}`,a)}}const r=/\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D/g;function l(e){const t=(e??"").trim();return"full"===t?"long":a(t)||"iso"===t?t:-1===t.search(r)?"short":t}function c(e,t,i){const c=l(t);return a(c)?(0,o.LE)(i,n[c]).format(e):function(e,t,i){const o=function(e,t){const i={},o=s(t,"ca-gregory-nu-latn",{year:"numeric",month:"numeric",day:"numeric"});for(const t of o.formatToParts(e))i[t.type]=t.value;const n=i=>s(t,"ca-gregory",i).format(e),a=e=>String(Number(e)||0);return{year:a(i.year),month:a(i.month),day:a(i.day),weekdayLong:()=>n({weekday:"long"}),weekdayShort:()=>n({weekday:"short"}),monthLong:()=>n({month:"long"}),monthShort:()=>n({month:"short"})}}(e,i),n=e=>e.padStart(2,"0");return t.replace(r,(e,t)=>{if(void 0!==t)return t;switch(e){case"YYYY":return o.year;case"YY":return o.year.slice(-2);case"MMMM":return o.monthLong();case"MMM":return o.monthShort();case"MM":return n(o.month);case"M":return o.month;case"dddd":return o.weekdayLong();case"ddd":return o.weekdayShort();case"DD":return n(o.day);default:return o.day}})}(e,"iso"===c?"YYYY-MM-DD":c,i)}function d(e,t,i){const n=t.format_12h??(0,o.oE)(i),a={hour:n?"numeric":"2-digit",minute:"2-digit",hourCycle:n?"h12":"h23"};return t.show_seconds&&(a.second="2-digit"),(0,o.LE)(i,a).format(e)}i.d(t,["S1",0,a])},8199(e,t,i){i.d(t,{P7:()=>r,XZ:()=>s,a5:()=>l,fA:()=>a});const o={input_select:{"":{list:"options",service:"select_option",field:"option"}},select:{"":{list:"options",service:"select_option",field:"option"}},input_text:{"":{list:"",service:"set_value",field:"value"}},text:{"":{list:"",service:"set_value",field:"value"}},climate:{"":{list:"hvac_modes",service:"set_hvac_mode",field:"hvac_mode"},preset_mode:{current:"preset_mode",list:"preset_modes",service:"set_preset_mode",field:"preset_mode"},fan_mode:{current:"fan_mode",list:"fan_modes",service:"set_fan_mode",field:"fan_mode"},swing_mode:{current:"swing_mode",list:"swing_modes",service:"set_swing_mode",field:"swing_mode"}},fan:{preset_mode:{current:"preset_mode",list:"preset_modes",service:"set_preset_mode",field:"preset_mode"}},light:{effect:{current:"effect",list:"effect_list",service:"turn_on",field:"effect"}},media_player:{source:{current:"source",list:"source_list",service:"select_source",field:"source"},sound_mode:{current:"sound_mode",list:"sound_mode_list",service:"select_sound_mode",field:"sound_mode"}},water_heater:{operation_mode:{current:"operation_mode",list:"operation_list",service:"set_operation_mode",field:"operation_mode"}},humidifier:{mode:{current:"mode",list:"available_modes",service:"set_mode",field:"mode"}}},n={fan:"preset_mode",light:"effect",media_player:"source",water_heater:"operation_mode",humidifier:"mode"};function a(e,t){const i=o[e.entity_id.split(".")[0]];if(i)return t?i[t]:i[""]??i[n[e.entity_id.split(".")[0]]]}function s(e){return e?Object.keys(o[e.split(".")[0]]??{}).filter(Boolean):[]}function r(e,t,i){if(!e||!t)return[];if(!t.list)return i.map(e=>e.value);const o=e.attributes?.[t.list];return Array.isArray(o)?o.map(String):[]}function l(e){if(!Array.isArray(e))return[];const t=e.map(e=>"string"==typeof e||"number"==typeof e?{label:String(e),value:String(e)}:e&&"object"==typeof e?{label:String(e.label??e.value??""),value:String(e.value??e.label??"")}:void 0).filter(e=>!!e&&""!==e.value);return(e=>3===e.length&&e.every((e,t)=>e.label===`Option ${t+1}`&&e.value===`option_${t+1}`))(t)?[]:t}},1495(e,t,i){function o(e){const t=e.attributes?.effect_list;return Array.isArray(t)&&t.length>0&&!!(4&Number(e.attributes?.supported_features??4))}i.d(t,{Q:()=>o})},7264(e,t,i){function o(e,t){if(!e?.entity_id.startsWith("climate.")||t&&"temperature"!==t)return;const i=e.attributes||{},o="number"==typeof i.target_temp_low?i.target_temp_low:void 0,n="number"==typeof i.target_temp_high?i.target_temp_high:void 0;return void 0!==o&&void 0!==n&&"number"!=typeof i.temperature?[o,n]:void 0}i.d(t,{H:()=>o})},5710(e,t,i){i.d(t,{Y:()=>a,n:()=>n});const o={horizontal:["ArrowLeft","ArrowRight","Home","End"],vertical:["ArrowUp","ArrowDown","Home","End"],both:["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"]};function n(e,t,i,n="horizontal",a=!0){if(!o[n].includes(e)||!i.length)return-1;const s=i.length,r=e=>e>=0&&e<s&&!i[e].disabled,l=(e,t)=>{for(let i=1;i<=s;i++){let o=e+t*i;if(a)o=(o+2*s)%s;else if(o<0||o>=s)return e;if(r(o))return o}return e};if("Home"===e)return r(0)?0:l(0,1);if("End"===e)return r(s-1)?s-1:l(s-1,-1);const c="ArrowLeft"===e||"ArrowUp"===e;return l(t<0?c?0:-1:t,c?-1:1)}class a{constructor(e){this.opts=e,this.onKeydown=e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.currentTarget,i=Array.from(t.querySelectorAll(this.opts.items)),o=i.indexOf(e.composedPath().find(e=>i.includes(e))),a=n(e.key,o,i.map(e=>({disabled:e.hasAttribute("disabled")})),this.opts.orientation,this.opts.wrap);a<0||(e.preventDefault(),e.stopPropagation(),this.focus(i,a),this.opts.onMove?.(i[a],a))}}focus(e,t){e.forEach((e,i)=>e.setAttribute("tabindex",i===t?"0":"-1")),e[t]?.focus()}}},6081(e,t,i){var o=i(6161);const n=o.AH`:host{display:contents;font-family:var(--mc-font,inherit)}*,*::before,*::after{box-sizing:border-box}`,a=o.AH`
  ${n}
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
`,s=o.AH`dialog{padding:0;border:0;border-radius:var(--mc-radius-xl,16px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-dialog,0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1));width:min(480px,calc(100vw - 32px));max-height:min(80vh,720px);overflow:hidden}dialog[open]{display:flex}dialog::backdrop{background:var(--mc-scrim,rgba(0,0,0,.38))}dialog.size-s{width:min(420px,calc(100vw - 32px))}dialog.size-m{width:min(480px,calc(100vw - 32px))}dialog.size-l{width:min(640px,calc(100vw - 32px))}dialog.size-xl{width:min(880px,calc(100vw - 32px))}.panel{display:grid;grid-template-rows:auto minmax(0,1fr) auto;width:100%;max-height:inherit}dialog.placed .panel{height:100%}.header{display:flex;align-items:center;gap:8px;padding:12px 12px 12px 20px;border-bottom:1px solid var(--mc-divider,rgba(0,0,0,.12))}.title{flex:1;min-width:0;margin:0;font-size:1rem;font-weight:500}.tool{display:inline-grid;place-items:center;width:32px;height:32px;padding:0;border:0;border-radius:var(--mc-radius,8px);background:transparent;color:var(--mc-text-2,#5f6368);cursor:pointer}.tool:hover{background:var(--mc-surface-2,#f2f3f5);color:var(--mc-text,#212121)}.tool:focus-visible{outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:1px}.tool:disabled{opacity:.45;cursor:not-allowed;background:transparent} .header.movable{padding-inline-start:8px;cursor:grab;touch-action:none;user-select:none}.header.movable:active{cursor:grabbing}.move{cursor:inherit;touch-action:none}.resize{position:absolute;inset-block-end:0;inset-inline-end:0;width:32px;height:32px;z-index:1;cursor:nwse-resize;touch-action:none;border-radius:var(--mc-radius,8px) 0 var(--mc-radius-xl,16px) 0}dialog.rtl .resize{cursor:nesw-resize;border-radius:0 var(--mc-radius,8px) 0 var(--mc-radius-xl,16px)}dialog.rtl .resize svg{transform:scaleX(-1)}.panel.sizable .footer{padding-inline-end:40px}.panel.sizable:not(.has-footer) .body{padding-bottom:36px}.body{min-height:0;padding:16px 20px;overflow:auto;overscroll-behavior:contain}.footer{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--mc-divider,rgba(0,0,0,.12))}.footer[hidden]{display:none} @media (max-width:599px){dialog.sheet{width:100vw;max-width:100vw;margin:auto 0 0;max-height:60vh;border-radius:var(--mc-radius-xl,16px) var(--mc-radius-xl,16px) 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}}@media (pointer:coarse){.tool{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}.panel.sizable .footer{padding-inline-end:52px}}@media (prefers-reduced-motion:reduce){*{transition-duration:0s !important;animation-duration:0s !important}}`,r=o.AH`${n}${s}`,l=o.AH`
  ${n}
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
`,c=o.AH`
  ${n}
  .head {
    margin: 0;
    font: inherit;
  }
  .btn {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px 10px;
    width: 100%;
    min-height: var(--mc-hit, 40px);
    padding: 6px 4px;
    border: 0;
    border-radius: var(--mc-radius, 8px);
    background: transparent;
    color: var(--mc-text, #212121);
    font: inherit;
    font-weight: 600;
    text-align: start;
    cursor: pointer;
  }
  @media (hover: hover) {
    .btn:hover {
      background: var(--mc-surface-2, #f2f3f5);
    }
  }
  .btn:focus-visible {
    outline: 2px solid var(--mc-focus, var(--mc-accent, #03a9f4));
    outline-offset: 2px;
  }
  .title {
    flex: 0 0 auto;
    max-width: 100%;
    overflow-wrap: anywhere;
  }
  .sum {
    flex: 1 1 8rem;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--mc-text-2, #5f6368);
    font-size: 0.8125rem;
    font-weight: 400;
  }
  .chev {
    flex: none;
    width: 20px;
    height: 20px;
    margin-inline-start: auto;
    color: var(--mc-text-2, #5f6368);
    transition: transform 0.15s ease-out;
  }
  [aria-expanded='true'] .chev {
    transform: rotate(180deg);
  }
  .body {
    display: grid;
    gap: 16px;
    padding: 4px 4px 12px;
  }
  .body[hidden] {
    display: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .chev {
      transition: none;
    }
  }
`,d=o.AH`
  ${n}
  .group {
    display: grid;
    gap: 8px;
    padding: 2px;
  }
  .tile-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(104px, 45%), 1fr));
    gap: 8px;
  }
  .chip-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(88px, 30%), 1fr));
    gap: 8px;
  }
  .opt {
    display: grid;
    justify-items: center;
    align-content: start;
    gap: 4px;
    min-width: 0;
    min-height: 44px;
    padding: 8px 6px;
    border: 1px solid var(--mc-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--mc-radius, 8px);
    background: var(--mc-surface, #fff);
    color: var(--mc-text, #212121);
    font: inherit;
    font-size: 0.8125rem;
    line-height: 1.25;
    text-align: center;
    overflow-wrap: anywhere;
    cursor: pointer;
  }
  .chip-grid .opt {
    min-height: 88px;
  }
  @media (hover: hover) {
    .opt:hover {
      border-color: var(--mc-field-border, #8a8f98);
    }
  }
  .opt[aria-pressed='true'] {
    border-color: var(--mc-accent, #03a9f4);
    box-shadow: inset 0 0 0 1px var(--mc-accent, #03a9f4);
    background: var(--mc-accent-tint, #e6f4fb);
  }
  .opt:focus-visible {
    outline: 2px solid var(--mc-focus, var(--mc-accent, #03a9f4));
    outline-offset: 2px;
  }
  .pv {
    display: grid;
    place-items: center;
    max-width: 100%;
  }
  .pv svg {
    max-width: 100%;
    height: auto;
  }
  .desc {
    margin: 0;
    font-size: 0.8125rem;
    color: var(--mc-text-2, #5f6368);
  }
  @media (pointer: coarse) {
    .opt {
      min-height: var(--mc-hit, 44px);
    }
    .chip-grid .opt {
      min-height: 88px;
    }
  }
`;i.d(t,["S8",0,r,"Uj",0,d,"bE",0,a,"dk",0,c,"u1",0,l])},515(e,t,i){var o=i(6161),n=i(261),a=i(8497);const s=o.AH`:host{--mc-hit-sm:32px;--mc-hit-xs:24px;--mc-radius-tag:6px;--mc-radius-seg:10px;--mc-radius-xl:16px;--mc-ease:.15s ease-out;--mc-shadow-dialog:0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1)}@media (pointer:coarse){:host{--mc-hit-sm:44px;--mc-hit-xs:44px}}`,r=o.AH`svg.gl{display:block;flex:none}.btn-danger{background:var(--mc-error-fill);color:var(--mc-on-accent)}.btn-danger:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-danger:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent)}.icon-btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink)} .btn[aria-disabled='true'],.icon-btn[aria-disabled='true']{opacity:.45;cursor:not-allowed;box-shadow:none} .icon-btn.xs{width:var(--mc-hit-xs,24px);height:var(--mc-hit-xs,24px);border-radius:var(--mc-radius-tag,6px);gap:0;--mdc-icon-size:16px}@media (pointer:coarse){.icon-btn.xs{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}}`,l=o.AH`.chip.is-error{color:var(--mc-error-ink);border-color:color-mix(in srgb,var(--mc-error-ink) 40%,transparent);background:var(--mc-error-tint)}`,c=o.AH`.notice{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);font-size:.8125rem;color:var(--mc-text)}.notice>.gl,.notice>ha-icon{flex:none;--mdc-icon-size:20px}.notice .body{flex:1;min-width:0;display:grid;gap:6px}.notice .body p{margin:0}.notice .body strong{font-weight:500}.notice .actions{display:flex;flex-wrap:wrap;gap:8px}.notice.info{background:var(--mc-accent-tint);border-color:color-mix(in srgb,var(--mc-accent) 35%,transparent)}.notice.info>.gl,.notice.info>ha-icon{color:var(--mc-accent-ink)}.notice.success{background:var(--mc-success-tint);border-color:color-mix(in srgb,var(--mc-success-ink) 35%,transparent)}.notice.success>.gl,.notice.success>ha-icon{color:var(--mc-success-ink)}.notice.warn{background:var(--mc-warn-tint);border-color:color-mix(in srgb,var(--mc-warn-ink) 35%,transparent)}.notice.warn>.gl,.notice.warn>ha-icon{color:var(--mc-warn-ink)}.notice.error{background:var(--mc-error-tint);border-color:color-mix(in srgb,var(--mc-error-ink) 35%,transparent)}.notice.error>.gl,.notice.error>ha-icon{color:var(--mc-error-ink)}`,d=o.AH`.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(116px,1fr));gap:8px;padding:2px}.tile{display:grid;justify-items:center;align-content:start;gap:4px;min-width:0;padding:8px 6px;border:1px solid var(--mc-divider);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font-size:.8125rem;text-align:center;transition:border-color .15s ease-out,background-color .15s ease-out}.tile:hover{border-color:color-mix(in srgb,var(--mc-accent) 60%,transparent)}.tile[aria-pressed='true'],.tile[aria-checked='true']{border-color:var(--mc-accent);background:var(--mc-accent-tint)}.tile .thumb{display:grid;place-items:center;width:100%;aspect-ratio:4 / 3;border-radius:6px;background:var(--mc-canvas);overflow:hidden}.tile .meta{font-size:.75rem;color:var(--mc-text-2)}.tile.glyph-only{min-height:56px;align-content:center}`,h=o.AH`.check{appearance:none;flex:none;width:20px;height:20px;margin:0;border:2px solid var(--mc-field-border);border-radius:5px;background:var(--mc-surface);display:inline-grid;place-items:center;cursor:pointer;transition:background-color .15s ease-out,border-color .15s ease-out}.check:checked,.check:indeterminate{border-color:var(--mc-accent-fill);background:var(--mc-accent-fill)}.check:checked::after{content:'';width:10px;height:5px;border:solid var(--mc-on-accent);border-width:0 0 2px 2px;transform:translateY(-1px) rotate(-45deg)}.check:indeterminate::after{content:'';width:10px;height:2px;background:var(--mc-on-accent)}.check:disabled{opacity:.45;cursor:not-allowed}`,u=o.AH`.toolbar{display:inline-flex;align-items:center;flex-wrap:wrap;gap:2px;padding:2px;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-seg,10px);background:var(--mc-surface);box-shadow:var(--mc-shadow-float)}.toolbar [role='separator']{align-self:stretch;width:1px;margin:4px;background:var(--mc-divider)} .rail{display:flex;flex-direction:column;align-items:center;gap:2px;width:56px;padding:8px 0;background:var(--mc-surface);border-right:1px solid var(--mc-divider);overflow-y:auto}.rail [role='separator'][aria-orientation='horizontal']{width:24px;height:1px;margin:4px 0;background:var(--mc-divider)} .toolbar .icon-btn,.rail .icon-btn{border-radius:var(--mc-radius)}.toolbar .icon-btn.sm{width:var(--mc-hit-sm,32px);height:var(--mc-hit-sm,32px)}.toolbar .btn-sm{border-color:transparent;background:transparent}.toolbar .btn-sm:hover{background:var(--mc-surface-2)}@media (max-width:799px){.rail{flex-direction:row;width:auto;border-right:0;border-bottom:1px solid var(--mc-divider);padding:0 8px;overflow-x:auto}.rail [role='separator'][aria-orientation='horizontal']{width:1px;height:24px;margin:0 4px}}`,p=o.AH`.topbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;min-height:56px;padding:8px 16px;background:var(--mc-surface);border-bottom:1px solid var(--mc-divider);position:relative;z-index:6}.topbar .title{min-width:0;margin:0;font-size:1rem;font-weight:500;overflow-wrap:anywhere}.topbar .name{width:180px;max-width:40vw;min-width:0}.topbar .spacer{flex:1}`,m=[s,r,l,c,d,h,u,p,o.AH`.sector-head{margin:0;font-size:inherit;font-weight:inherit}.sector-head>.sector-btn{border-radius:var(--mc-radius-lg);font-size:.875rem}.group-head h4{margin:0;font-size:.875rem;font-weight:500;flex:1}`,n.B,a.W];i.d(t,["DG",0,c,"Oj",0,m,"ZN",0,p])},8094(e,t,i){i.d(t,{DG:()=>n.DG,Oj:()=>n.Oj,ah:()=>o.a});var o=i(802),n=i(515);i(6081),i(877),i(8497),i(261)},6971(e,t,i){var o=i(6161);const n=(0,o.iz)(":is(.mc-field, .mc-act-field, .mc-cond-field) :is(input, select, textarea):not([type='checkbox']):not([type='color']):not([type='range']):not([type='radio'])"),a=o.AH`
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
  ${n},
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
  ${n}::placeholder,
  .mc-input-field.mc-input-field::placeholder {
    color: var(--mc-text-2);
    opacity: 1;
  }
  ${n}:hover,
  .mc-input-field.mc-input-field:hover {
    border-color: var(--mc-text-2);
  }
  ${n}:focus,
  .mc-input-field.mc-input-field:focus {
    outline: none;
    border-color: var(--mc-focus);
    box-shadow: 0 0 0 1px var(--mc-focus);
  }
  ${n}:disabled {
    background: var(--mc-surface-2);
    color: var(--mc-text-2);
    cursor: not-allowed;
  }
  ${n}.mono {
    font-family: var(--mc-mono);
    font-size: 0.8125rem;
  }
  /* selects: .select look (bare selects get the chevron as a background image) */
  ${n}:is(select):not([multiple]):not([size]) {
    appearance: none;
    -webkit-appearance: none;
    padding-right: 36px;
    cursor: pointer;
  }
  ${n}:is(select):not(.input):not([multiple]):not([size]) {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%238b919a' d='M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42Z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 18px 18px;
  }
  /* textareas: textarea.input */
  ${n}:is(textarea) {
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
`;i.d(t,["$",0,a])},802(e,t,i){const o=i(6161).AH`*,*::before,*::after{box-sizing:border-box}::selection{background:var(--mc-accent-tint);color:var(--mc-text)}  .k-module{--k:var(--mc-sel-module);--k-fill:var(--mc-sel-module-fill);--k-ink:var(--mc-sel-module-ink);--k-tint:var(--mc-sel-module-tint)}.k-column{--k:var(--mc-sel-col);--k-fill:var(--mc-sel-col-fill);--k-ink:var(--mc-sel-col-ink);--k-tint:var(--mc-sel-col-tint)}.k-row{--k:var(--mc-sel-row);--k-fill:var(--mc-sel-row-fill);--k-ink:var(--mc-sel-row-ink);--k-tint:var(--mc-sel-row-tint)}.k-card{--k:var(--mc-sel-card);--k-fill:var(--mc-sel-card-fill);--k-ink:var(--mc-sel-card-ink);--k-tint:var(--mc-sel-card-tint)}*{scrollbar-width:thin;scrollbar-color:var(--mc-field-border) transparent}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--mc-divider);border-radius:9999px;border:2px solid transparent;background-clip:padding-box}::-webkit-scrollbar-thumb:hover{background-color:var(--mc-field-border)}button,input,select,textarea{font:inherit;color:inherit}button{cursor:pointer}:focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px}.mono{font-family:var(--mc-mono);font-size:.8125rem}[hidden]{display:none !important}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap} .seg{display:inline-flex;align-items:stretch;gap:2px;padding:3px;background:var(--mc-surface-2);border:1px solid var(--mc-divider);border-radius:10px;max-width:100%;overflow-x:auto;scrollbar-width:none}.seg::-webkit-scrollbar{display:none}.seg.full{display:flex;width:100%}.seg.full>button{flex:1 0 auto;justify-content:center}.seg>button{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px;border:0;border-radius:7px;background:transparent;white-space:nowrap;font-size:.8125rem;font-weight:500;color:var(--mc-text-2);transition:background-color .15s ease-out,color .15s ease-out}.seg>button ha-icon{--mdc-icon-size:18px}.seg>button:hover{color:var(--mc-text);background:color-mix(in srgb,var(--mc-surface) 55%,transparent)}.seg>button[aria-selected='true'],.seg>button[aria-checked='true'],.seg>button.active{background:var(--mc-surface);color:var(--mc-accent-ink);box-shadow:0 0 0 1px var(--mc-divider),0 1px 2px rgba(0,0,0,.08)}.seg>button:focus-visible{outline-offset:-2px} .layout-glyph{display:inline-grid;gap:2px;width:28px;height:14px;flex:none}.layout-glyph i{display:block;min-width:2px;border-radius:2px;background:currentColor;opacity:.45}.seg>button[aria-checked='true'] .layout-glyph i{opacity:.85} .chip{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 10px;border-radius:9999px;border:1px solid var(--mc-divider);background:var(--mc-surface);font-size:.75rem;font-weight:500;line-height:1;color:var(--mc-text-2);white-space:nowrap}.chip ha-icon{--mdc-icon-size:14px}button.chip{min-height:28px}button.chip:hover{border-color:var(--mc-field-border);color:var(--mc-text)}.chip.is-accent{color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent);background:var(--mc-accent-tint)}.chip.is-warn{color:var(--mc-warn-ink);border-color:color-mix(in srgb,var(--mc-warn-ink) 40%,transparent);background:var(--mc-warn-tint)}.chip.is-count{min-height:20px;padding:0 8px} .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 16px;border-radius:var(--mc-radius);border:1px solid transparent;font-size:.875rem;font-weight:500;white-space:nowrap;transition:background-color .15s ease-out,border-color .15s ease-out,box-shadow .15s ease-out}.btn ha-icon{--mdc-icon-size:18px}.btn-primary{background:var(--mc-accent-fill);color:var(--mc-on-accent)}.btn-primary:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-primary:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn-secondary{background:var(--mc-surface);border-color:var(--mc-field-border);color:var(--mc-text)}.btn-secondary:hover{background:var(--mc-surface-2)}.btn-text{background:transparent;color:var(--mc-accent-ink);padding:0 12px}.btn-text:hover{background:var(--mc-accent-tint)}.btn-sm{min-height:32px;padding:0 12px;font-size:.8125rem}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.icon-btn{display:inline-grid;place-items:center;width:40px;height:40px;flex:none;padding:0;border:0;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text-2);--mdc-icon-size:20px}.icon-btn:hover:not(:disabled){background:var(--mc-surface-2);color:var(--mc-text)}.icon-btn.sm{width:32px;height:32px;--mdc-icon-size:18px}.icon-btn.danger:hover:not(:disabled){color:var(--mc-error-ink)} .field{display:grid;gap:6px;min-width:0}.field-head{display:flex;align-items:center;gap:8px;min-height:24px}.field-head label,.field-head .lbl{font-size:.8125rem;font-weight:500;color:var(--mc-text);flex:1;min-width:0} .field-reset{margin:-4px -6px -4px 0}.help{margin:0;font-size:.75rem;color:var(--mc-text-2)}.help.error{color:var(--mc-error-ink)}.help.lead{font-size:.875rem}.input{width:100%;min-height:40px;margin:0;padding:8px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font-size:.875rem;font-weight:400;line-height:1.4;transition:border-color .15s ease-out,box-shadow .15s ease-out}.input::placeholder{color:var(--mc-text-2);opacity:1}.input:hover{border-color:var(--mc-text-2)}.input:focus{outline:none;border-color:var(--mc-focus);box-shadow:0 0 0 1px var(--mc-focus)}.input:disabled{background:var(--mc-surface-2);color:var(--mc-text-2);cursor:not-allowed} .input[aria-invalid='true']{border-color:var(--mc-error-ink)}.input[aria-invalid='true']:focus{box-shadow:0 0 0 1px var(--mc-error-ink)}textarea.input{resize:vertical;min-height:88px;line-height:1.5;font-family:var(--mc-mono);font-size:.8125rem}.input.mono{font-family:var(--mc-mono);font-size:.8125rem}.with-icon{position:relative}.with-icon>ha-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);--mdc-icon-size:18px;color:var(--mc-text-2);pointer-events:none}.with-icon>.input{padding-left:40px} .with-action>.input{padding-right:44px}.with-icon>.field-action{position:absolute;right:4px;top:50%;transform:translateY(-50%)}.with-icon + .entity-meta{margin:6px 0 0}.select{position:relative;display:block;min-width:0}.select select{appearance:none;-webkit-appearance:none;padding-right:36px;cursor:pointer}.select>ha-icon{position:absolute;right:10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mc-text-2);--mdc-icon-size:18px}.unit{display:flex;min-width:0}.unit>.input{flex:1 1 auto;min-width:7ch;border-radius:var(--mc-radius) 0 0 var(--mc-radius)}.unit>.select{flex:none;width:76px}.unit>.select select{border-radius:0 var(--mc-radius) var(--mc-radius) 0;margin-left:-1px;padding-left:10px}.unit>.input:focus,.unit>.select select:focus{position:relative;z-index:1}.color{display:flex;gap:8px;align-items:center;min-width:0}.color .input{flex:1;min-width:0}.swatch{flex:none;width:40px;height:40px;padding:0;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:none;cursor:pointer}.box-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.box-side{display:grid;gap:4px;min-width:0}.box-side-label{display:flex;align-items:center;gap:4px;font-size:.75rem;color:var(--mc-text-2);--mdc-icon-size:16px}.box-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}.box-foot .select{width:96px}.switch-row{display:flex;align-items:center;gap:12px;min-height:40px}.switch-row .txt{flex:1;min-width:0;font-size:.8125rem;font-weight:500}.switch-row .txt .help{margin-top:2px;font-weight:400}.switch{position:relative;flex:none;width:40px;height:24px;border-radius:9999px;border:0;padding:0;background:var(--mc-field-border);transition:background-color .15s ease-out}.switch::after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s ease-out;box-shadow:0 1px 2px rgba(0,0,0,.3)}.switch[aria-checked='true']{background:var(--mc-accent-fill)}.switch[aria-checked='true']::after{transform:translateX(16px)}.switch:disabled{opacity:.45;cursor:not-allowed}.sync{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 6px;border:0;border-radius:6px;background:transparent;color:var(--mc-text-2);font-size:.75rem;font-weight:500;white-space:nowrap;--mdc-icon-size:16px}.sync:hover{background:var(--mc-surface-2);color:var(--mc-text)}.sync.is-over{color:var(--mc-warn-ink)}.sync.is-over:hover{background:var(--mc-warn-tint);color:var(--mc-warn-ink)}.entity-meta{display:flex;align-items:center;gap:6px;font-size:.75rem;color:var(--mc-text-2)}.entity-meta .dot,.dot{width:8px;height:8px;border-radius:50%;background:var(--mc-success);flex:none} .group{display:grid;gap:16px}.group + .group{padding-top:20px;border-top:1px solid var(--mc-divider)}.group-head{display:flex;align-items:center;gap:8px;--mdc-icon-size:18px}.group-head>ha-icon{color:var(--mc-text-2)}.group-head h3{margin:0;font-size:.875rem;font-weight:500;flex:1}.cond{border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);padding:12px;display:grid;gap:12px}.cond-head{display:flex;align-items:center;gap:8px}.cond-head .n{font-size:.8125rem;font-weight:500;flex:1;min-width:0}.cond-head .n .sub{color:var(--mc-text-2);font-weight:400} .range-list{display:grid;gap:12px}.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:16px 12px}.empty{display:grid;justify-items:center;text-align:center;gap:8px;padding:24px 16px;border:1px dashed var(--mc-divider);border-radius:var(--mc-radius-lg)}.empty>ha-icon{--mdc-icon-size:28px;color:var(--mc-text-2)}.empty strong{font-weight:500}.empty p{margin:0;color:var(--mc-text-2);font-size:.8125rem;max-width:32ch}.sectors{display:grid;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);overflow:hidden}.sector + .sector{border-top:1px solid var(--mc-divider)}.sector-btn{width:100%;display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 12px;border:0;background:transparent;text-align:left}.sector-btn:hover{background:var(--mc-surface-2)}.sector-btn:focus-visible{outline-offset:-2px}.sector-btn>ha-icon:first-child{--mdc-icon-size:18px;color:var(--mc-text-2)}.sector-btn .nm{flex:1;min-width:0;font-weight:500}.sector-btn .chev{--mdc-icon-size:20px;color:var(--mc-text-2);transition:transform .15s ease-out}.sector-btn[aria-expanded='true'] .chev{transform:rotate(180deg)}.sector-body{padding:4px 12px 16px;display:grid;gap:16px}.no-results{color:var(--mc-text-2);font-size:.8125rem;padding:12px} .menu{position:absolute;z-index:30;min-width:240px;padding:6px;border-radius:var(--mc-radius-lg);background:var(--mc-surface);border:1px solid var(--mc-divider);box-shadow:var(--mc-shadow-float);display:grid} .menu[popover]{position:fixed;inset:auto;margin:0;color:var(--mc-text);overflow:auto;overscroll-behavior:contain;box-sizing:border-box}.menu button{display:flex;align-items:center;gap:12px;min-height:40px;padding:0 12px;border:0;border-radius:var(--mc-radius);background:transparent;text-align:left}.menu button:hover,.menu button:focus-visible{background:var(--mc-surface-2);outline:none}.menu button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-2px}.menu button:disabled{opacity:.45;cursor:not-allowed;background:transparent}.menu button.danger,.menu button.danger ha-icon{color:var(--mc-error-ink)}.menu button ha-icon{--mdc-icon-size:18px;color:var(--mc-text-2)}.menu .menu-note{font-size:.75rem;color:var(--mc-text-2);padding:6px 12px 8px}.menu hr{border:0;border-top:1px solid var(--mc-divider);margin:4px 0}@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:0s !important;animation-duration:0s !important}}`;i.d(t,["a",0,o])},261(e,t,i){const o=i(6161).AH`.rows{display:grid;gap:2px;margin:0;padding:0;list-style:none}.row{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;min-height:var(--mc-hit,40px);padding:2px 4px 2px calc(8px + var(--lvl,0) * 16px);border-radius:var(--mc-radius,8px);color:var(--mc-text);font-size:.875rem;transition:background-color var(--mc-ease,.15s ease-out)}.row:hover{background:var(--mc-surface-2)}.row.selected,.row[aria-selected='true']{background:var(--mc-accent-tint)}.row .grip,.row>.gl,.row>ha-icon{flex:none;display:inline-flex;color:var(--mc-text-2);--mdc-icon-size:18px}.row .grip{cursor:grab}.row .name{flex:1 1 120px;min-width:0;margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:start;overflow-wrap:anywhere;cursor:pointer}.row .name small{display:block;font-family:var(--mc-mono);font-size:.75rem;color:var(--mc-text-2)}.row .input{flex:1 1 140px;width:auto;min-width:0}.row .acts{display:flex;align-items:center;gap:2px;margin-inline-start:auto}.row .help{flex:1 1 100%}`;i.d(t,["B",0,o])},8497(e,t,i){const o=i(6161).AH`.slider-row{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}.slider-row>label{flex:0 0 auto;min-width:48px;font-size:.8125rem;font-weight:500;color:var(--mc-text)}.slider-row>input[type='range']{flex:1 1 120px;min-width:0}.slider-row>.input{flex:0 0 64px;width:64px;min-width:0}@container (max-width:239px){.slider-row{flex-direction:column;align-items:stretch}.slider-row>.input{flex-basis:auto;width:100%}}`;i.d(t,["W",0,o])},877(e,t,i){const o=i(6161).AH`.toast{position:fixed;inset:auto;left:50%;bottom:calc(var(--mc-toast-offset,16px) + env(safe-area-inset-bottom,0px));transform:translateX(-50%);margin:0;display:flex;align-items:center;gap:12px;width:max-content;max-width:min(520px,calc(100vw - 32px));padding:10px 10px 10px 16px;border:0;border-radius:var(--mc-radius,8px);background:var(--mc-text);color:var(--mc-surface);box-shadow:var(--mc-shadow-float);font-size:.8125rem;line-height:1.4;overflow:visible}.toast .text{min-width:0;overflow-wrap:anywhere}.toast .action{flex:none;min-height:var(--mc-hit-xs,24px);padding:0 10px;border:1px solid currentColor;border-radius:var(--mc-radius,8px);background:transparent;color:inherit;font:inherit;cursor:pointer}@media (hover:hover){.toast .action:hover{background:color-mix(in srgb,currentColor 14%,transparent)}}.toast .action:focus-visible{outline:2px solid currentColor;outline-offset:2px}@media (pointer:coarse){.toast .action{min-height:var(--mc-hit-sm,44px)}}`;i.d(t,["k",0,o])},9943(e,t,i){var o=i(6161);const n={select:"M6 3l12 8-5.5 1.3L10 18z",node:"M5 19L19 5M3 17h4v4H3zM17 3h4v4h-4z",pen:"M4 20l1-5L16 4l4 4L9 19zM14 6l4 4",rect:"M4 6h16v12H4z",ellipse:"M4 12a8 6 0 1 0 16 0a8 6 0 1 0-16 0",line:"M5 19L19 5",polygon:"M12 3l2.5 6.5H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z",free:"M3 15c3-8 6 4 9-3s6-3 9 0",knife:"M4 20l6-6M9 11l8-8 4 4-8 8z",hand:"M8 13V6a1.5 1.5 0 0 1 3 0v5m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-3a1.5 1.5 0 0 1 3 0v6c0 4-2 6-5 6s-4-1-6-4l-2-4a1.5 1.5 0 0 1 2.5-1.5L8 14",undo:"M4 9h10a5 5 0 0 1 0 10H8M4 9l4-4M4 9l4 4",redo:"M20 9H10a5 5 0 0 0 0 10h6M20 9l-4-4M20 9l-4 4",eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9.5a2.5 2.5 0 1 0 .01 0z",eyeOff:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM3 3l18 18",lock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",unlock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 7.5-1.5",plus:"M12 5v14M5 12h14",minus:"M5 12h14",fit:"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",grid:"M4 4h16v16H4zM4 12h16M12 4v16",snap:"M6 4v8a6 6 0 0 0 12 0V4h-4v8a2 2 0 0 1-4 0V4z",up:"M12 19V5M6 11l6-6 6 6",down:"M12 5v14M6 13l6 6 6-6",left:"M19 12H5M11 6l-6 6 6 6",right:"M5 12h14M13 6l6 6-6 6",back:"M15 5l-7 7 7 7",close:"M6 6l12 12M18 6L6 18",help:"M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.5",file:"M6 3h8l4 4v14H6zM14 3v4h4",paste:"M9 4h6v3H9zM7 5H5v16h14V5h-2",blank:"M4 4h16v16H4z",iconpick:"M12 3l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.4l6-.9z",library:"M5 4h4v16H5zM11 4h4v16h-4zM17 6l3 .8-3.5 13-3-.8",group:"M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 9h6v6H9z",copy:"M8 8h12v12H8zM4 16V4h12",trash:"M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",rotL:"M5 12a7 7 0 1 0 2-5M5 4v4h4",rotR:"M19 12a7 7 0 1 1-2-5M19 4v4h-4",rot90L:"M19 20v-8a5 5 0 0 0-5-5H5M9 3L5 7l4 4",rot90R:"M5 20v-8a5 5 0 0 1 5-5h9M15 3l4 4-4 4",ungroup:"M4 4h6v6H4zM14 14h6v6h-6zM14 10l6-6M15 4h5v5",maximize:"M5 5h14v14H5z",restore:"M8 8h11v11H8zM5 15V5h10",resizeCorner:"M19 9L9 19M19 14l-5 5",grip:"M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",flipH:"M12 3v18M8 7L3 12l5 5zM16 7l5 5-5 5z",flipV:"M3 12h18M7 8l5-5 5 5zM7 16l5 5 5-5z",link:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",save:"M5 4h12l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6",check:"M5 12.5l4.5 4.5L19 7",alignL:"M4 3v18M8 7h12M8 14h8",alignC:"M12 3v18M5 7h14M8 14h8",alignR:"M20 3v18M4 7h12M12 14h8",alignT:"M3 4h18M7 8v12M14 8v8",alignM:"M3 12h18M7 5v14M14 8v8",alignB:"M3 20h18M7 4v12M14 8v8",distH:"M4 3v18M20 3v18M10 8h4v8h-4z",distV:"M3 4h18M3 20h18M8 10h8v4H8z",toFront:"M12 19V6M6 11l6-6 6 6M5 3h14",toBack:"M12 5v13M6 13l6 6 6-6M5 21h14"},a={arrowLeft:"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",check:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",undo:"M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",redo:"M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z",helpCircle:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",dotsVertical:"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",palette:"M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 10c0-3.9-4.5-7-10-7Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z",add:"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",delete:"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",contentCopy:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",eyeOn:"M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z",alertCircle:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",information:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",dotsHorizontal:"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z",restart:"M12,5V1L7,6L12,11V7A6,6 0 0,1 18,13A6,6 0 0,1 12,19A6,6 0 0,1 6,13H4A8,8 0 0,0 12,21A8,8 0 0,0 20,13A8,8 0 0,0 12,5Z",cursorDefault:"M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z",vectorPolylineEdit:"M2 3V9H4.95L6.95 15H6V21H12V16.41L17.41 11H22V5H16V9.57L10.59 15H9.06L7.06 9H8V3H2M4 5H6V7H4V5M18 7H20V9H18V7M21.15 13C21 13 20.87 13.05 20.76 13.16L19.75 14.18L21.82 16.25L22.84 15.24C23.05 15.03 23.05 14.67 22.84 14.46L21.54 13.16C21.43 13.05 21.29 13 21.15 13M19.15 14.76L13 20.91V23H15.09L21.23 16.84L19.15 14.76M8 17H10V19H8V17Z",pen:"M20.71,7.04C20.37,7.38 20.04,7.71 20.03,8.04C20,8.36 20.34,8.69 20.66,9C21.14,9.5 21.61,9.95 21.59,10.44C21.57,10.93 21.06,11.44 20.55,11.94L16.42,16.08L15,14.66L19.25,10.42L18.29,9.46L16.87,10.87L13.12,7.12L16.96,3.29C17.35,2.9 18,2.9 18.37,3.29L20.71,5.63C21.1,6 21.1,6.65 20.71,7.04M3,17.25L12.56,7.68L16.31,11.43L6.75,21H3V17.25Z",rectangleOutline:"M4,6V19H20V6H4M18,17H6V8H18V17Z",ellipseOutline:"M12,6C16.41,6 20,8.69 20,12C20,15.31 16.41,18 12,18C7.59,18 4,15.31 4,12C4,8.69 7.59,6 12,6M12,4C6.5,4 2,7.58 2,12C2,16.42 6.5,20 12,20C17.5,20 22,16.42 22,12C22,7.58 17.5,4 12,4Z",vectorLine:"M15,3V7.59L7.59,15H3V21H9V16.42L16.42,9H21V3M17,5H19V7H17M5,17H7V19H5",vectorPolygon:"M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17",draw:"M9.75 20.85C11.53 20.15 11.14 18.22 10.24 17C9.35 15.75 8.12 14.89 6.88 14.06C6 13.5 5.19 12.8 4.54 12C4.26 11.67 3.69 11.06 4.27 10.94C4.86 10.82 5.88 11.4 6.4 11.62C7.31 12 8.21 12.44 9.05 12.96L10.06 11.26C8.5 10.23 6.5 9.32 4.64 9.05C3.58 8.89 2.46 9.11 2.1 10.26C1.78 11.25 2.29 12.25 2.87 13.03C4.24 14.86 6.37 15.74 7.96 17.32C8.3 17.65 8.71 18.04 8.91 18.5C9.12 18.94 9.07 18.97 8.6 18.97C7.36 18.97 5.81 18 4.8 17.36L3.79 19.06C5.32 20 7.88 21.47 9.75 20.85M20.84 5.25C21.06 5.03 21.06 4.67 20.84 4.46L19.54 3.16C19.33 2.95 18.97 2.95 18.76 3.16L17.74 4.18L19.82 6.26M11 10.92V13H13.08L19.23 6.85L17.15 4.77L11 10.92Z",contentCut:"M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z",handBackLeftOutline:"M3 16C3 20.42 6.58 24 11 24C14.43 24 17.5 21.91 18.77 18.73L21.33 12.3C21.58 11.66 21.56 10.92 21.18 10.35C20.69 9.61 19.82 9.29 19 9.5L18.22 9.73C17.76 9.85 17.34 10.08 17 10.39V4.5C17 3.12 15.88 2 14.5 2C14.31 2 14.13 2 13.96 2.06C13.75 .89 12.73 0 11.5 0C10.44 0 9.54 .66 9.17 1.59C8.96 1.53 8.73 1.5 8.5 1.5C7.12 1.5 6 2.62 6 4V4.55C5.84 4.5 5.67 4.5 5.5 4.5C4.12 4.5 3 5.62 3 7V16M5 7C5 6.72 5.22 6.5 5.5 6.5S6 6.72 6 7V12H8V4C8 3.72 8.22 3.5 8.5 3.5S9 3.72 9 4V12H11V2.5C11 2.22 11.22 2 11.5 2S12 2.22 12 2.5V12H14V4.5C14 4.22 14.22 4 14.5 4S15 4.22 15 4.5V15H17L18 12.5C18.15 12.05 18.5 11.71 19 11.59L19.5 11.45L16.91 18C15.95 20.41 13.61 22 11 22C7.69 22 5 19.31 5 16V7Z",eyeOffOutline:"M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",lock:"M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",lockOpenVariant:"M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",minus:"M19,13H5V11H19V13Z",fitToScreenOutline:"M17 4H20C21.1 4 22 4.9 22 6V8H20V6H17V4M4 8V6H7V4H4C2.9 4 2 4.9 2 6V8H4M20 16V18H17V20H20C21.1 20 22 19.1 22 18V16H20M7 18H4V16H2V18C2 19.1 2.9 20 4 20H7V18M16 10V14H8V10H16M18 8H6V16H18V8Z",grid:"M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2Z",magnet:"M3,7V13A9,9 0 0,0 12,22A9,9 0 0,0 21,13V7H17V13A5,5 0 0,1 12,18A5,5 0 0,1 7,13V7M17,5H21V2H17M3,5H7V2H3",arrowUp:"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",arrowDown:"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",arrowRight:"M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z",chevronRight:"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",swapVertical:"M9,3L5,7H8V14H10V7H13M16,17V10H14V17H11L15,21L19,17H16Z",fileOutline:"M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z",contentPaste:"M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z",folderOpenOutline:"M6.1,10L4,18V8H21A2,2 0 0,0 19,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H19C19.9,20 20.7,19.4 20.9,18.5L23.2,10H6.1M19,18H6L7.6,12H20.6L19,18Z",shapeOutline:"M11,13.5V21.5H3V13.5H11M9,15.5H5V19.5H9V15.5M12,2L17.5,11H6.5L12,2M12,5.86L10.08,9H13.92L12,5.86M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13M17.5,15A2.5,2.5 0 0,0 15,17.5A2.5,2.5 0 0,0 17.5,20A2.5,2.5 0 0,0 20,17.5A2.5,2.5 0 0,0 17.5,15Z",bookshelf:"M9 3V18H12V3H9M12 5L16 18L19 17L15 4L12 5M5 5V18H8V5H5M3 19V21H21V19H3Z",group:"M1,1V5H2V19H1V23H5V22H19V23H23V19H22V5H23V1H19V2H5V1M5,4H19V5H20V19H19V20H5V19H4V5H5M6,6V14H9V18H18V9H14V6M8,8H12V12H8M14,11H16V16H11V14H14",ungroup:"M2,2H6V3H13V2H17V6H16V9H18V8H22V12H21V18H22V22H18V21H12V22H8V18H9V16H6V17H2V13H3V6H2V2M18,12V11H16V13H17V17H13V16H11V18H12V19H18V18H19V12H18M13,6V5H6V6H5V13H6V14H9V12H8V8H12V9H14V6H13M12,12H11V14H13V13H14V11H12V12Z",rotateLeft:"M13,4.07V1L8.45,5.55L13,10V6.09C15.84,6.57 18,9.03 18,12C18,14.97 15.84,17.43 13,17.91V19.93C16.95,19.44 20,16.08 20,12C20,7.92 16.95,4.56 13,4.07M7.1,18.32C8.26,19.22 9.61,19.76 11,19.93V17.9C10.13,17.75 9.29,17.41 8.54,16.87L7.1,18.32M6.09,13H4.07C4.24,14.39 4.79,15.73 5.69,16.89L7.1,15.47C6.58,14.72 6.23,13.88 6.09,13M7.11,8.53L5.7,7.11C4.8,8.27 4.24,9.61 4.07,11H6.09C6.23,10.13 6.58,9.28 7.11,8.53Z",rotateRight:"M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12C4,16.08 7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12C6,9.03 8.16,6.57 11,6.09V10L15.55,5.55Z",rotateLeftVariant:"M4,2H7A2,2 0 0,1 9,4V20A2,2 0 0,1 7,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M20,15A2,2 0 0,1 22,17V20A2,2 0 0,1 20,22H11V15H20M14,4A8,8 0 0,1 22,12L21.94,13H19.92L20,12A6,6 0 0,0 14,6V9L10,5L14,1V4Z",rotateRightVariant:"M10,4V1L14,5L10,9V6A6,6 0 0,0 4,12L4.08,13H2.06L2,12A8,8 0 0,1 10,4M17,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H17A2,2 0 0,1 15,20V4A2,2 0 0,1 17,2M4,15H13V22H4A2,2 0 0,1 2,20V17A2,2 0 0,1 4,15Z",flipHorizontal:"M15 21H17V19H15M19 9H21V7H19M3 5V19C3 20.1 3.9 21 5 21H9V19H5V5H9V3H5C3.9 3 3 3.9 3 5M19 3V5H21C21 3.9 20.1 3 19 3M11 23H13V1H11M19 17H21V15H19M15 5H17V3H15M19 13H21V11H19M19 21C20.1 21 21 20.1 21 19H19Z",flipVertical:"M3 15V17H5V15M15 19V21H17V19M19 3H5C3.9 3 3 3.9 3 5V9H5V5H19V9H21V5C21 3.9 20.1 3 19 3M21 19H19V21C20.1 21 21 20.1 21 19M1 11V13H23V11M7 19V21H9V19M19 15V17H21V15M11 19V21H13V19M3 19C3 20.1 3.9 21 5 21V19Z",arrangeBringToFront:"M2,2H11V6H9V4H4V9H6V11H2V2M22,13V22H13V18H15V20H20V15H18V13H22M8,8H16V16H8V8Z",arrangeBringForward:"M2,2H16V16H2V2M22,8V22H8V18H10V20H20V10H18V8H22Z",arrangeSendBackward:"M2,2H16V16H2V2M22,8V22H8V18H18V8H22M4,4V14H14V4H4Z",arrangeSendToBack:"M2,2H11V11H2V2M9,4H4V9H9V4M22,13V22H13V13H22M15,20H20V15H15V20M16,8V11H13V8H16M11,16H8V13H11V16Z",dragVertical:"M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z",squareOutline:"M3,3H21V21H3V3M5,5V19H19V5H5Z",selectAll:"M9,9H15V15H9M7,17H17V7H7M15,5H17V3H15M15,21H17V19H15M19,17H21V15H19M19,9H21V7H19M19,21A2,2 0 0,0 21,19H19M19,13H21V11H19M11,21H13V19H11M9,3H7V5H9M3,17H5V15H3M5,21V19H3A2,2 0 0,0 5,21M19,3V5H21A2,2 0 0,0 19,3M13,3H11V5H13M3,9H5V7H3M7,21H9V19H7M3,13H5V11H3M3,5H5V3A2,2 0 0,0 3,5Z"},s=e=>Object.prototype.hasOwnProperty.call(a,e),r={round:"M4 20V12A8 8 0 0 1 12 4H20",squircle:"M4 20V12C4 6.5 6.5 4 12 4H20",bevel:"M4 20V10L10 4H20",scoop:"M4 20V10A6 6 0 0 0 10 4H20",notch:"M4 20V10H10V4H20",square:"M4 20V4H20"};i.d(t,["Vq",0,(e,t=20)=>s(e)?o.qy`<svg class="gl" viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${a[e]} fill="currentColor"></path></svg>`:o.qy`<svg class="gl" viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${n[e]} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,"ow",0,e=>Object.prototype.hasOwnProperty.call(n,e)||s(e),"w_",0,(e,t=0)=>o.JW`<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true" style=${t?`transform:rotate(${t}deg)`:""}><path d=${r[e]} /></svg>`])},2387(e,t,i){i.d(t,{Y5:()=>s.Y,x6:()=>j.x6,jw:()=>j.jw,Oi:()=>L,ah:()=>z.ah,Ie:()=>j.Ie,ZZ:()=>j.ZZ,Vq:()=>m.Vq,Oj:()=>z.Oj,lm:()=>j.lm,nM:()=>j.nM,S1:()=>j.S1,aJ:()=>j.aJ,aw:()=>j.aw,xH:()=>j.xH,KE:()=>j.KE,XV:()=>j.XV});var o=i(6161),n=i(5707),a=i(5276),s=i(5710),r=i(6081),l=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let c=0;class d extends o.WF{constructor(){super(...arguments),this.label="",this.items=[],this._tab=-1,this._focused="",this._id="mc-choice-"+ ++c,this._keydown=e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const t=Array.from(this.renderRoot.querySelectorAll("button.opt")),i=t.indexOf(e.composedPath()[0]),o=(0,s.n)(e.key,i,t.map(()=>({})),"both");o<0||(e.preventDefault(),e.stopPropagation(),this._tab=o,t[o]?.focus())}}get _stop(){const e=this.items.length;if(this._tab>=0&&this._tab<e)return this._tab;const t=this.items.findIndex(e=>e.value===this.value);return t>=0?t:0}_pick(e){this.dispatchEvent(new CustomEvent("mc-pick",{detail:{value:e},bubbles:!0,composed:!0}))}render(){const e=this._stop,t=this.items.find(e=>e.value===this._focused)??this.items.find(e=>e.value===this.value),i=`${this._id}-desc`;return o.qy`<div class="group" part="group" role="group" aria-label=${this.label}> <div class=${this.gridClass} @keydown=${this._keydown}> ${this.items.map((n,s)=>o.qy`<button type="button" class="opt" part="option" data-value=${n.value} tabindex=${s===e?"0":"-1"} aria-pressed=${n.value===this.value?"true":"false"} aria-describedby=${n.description&&t===n?i:o.s6} @focus=${()=>{this._focused=n.value,this._tab=s}} @blur=${()=>{this._focused===n.value&&(this._focused="")}} @click=${()=>this._pick(n.value)} > ${n.preview?o.qy`<span class="pv" aria-hidden="true">${(0,a._)(n.preview)}</span>`:o.s6} <span class="nm">${n.label}</span> </button>`)}</div>${t?.description?o.qy`<p class="desc" id=${i} part="description">${t.description}</p>`:o.s6}</div>`}}d.uiKitRevision=5,d.styles=[r.Uj],l([(0,n.MZ)()],d.prototype,"label",void 0),l([(0,n.MZ)({attribute:!1})],d.prototype,"items",void 0),l([(0,n.MZ)()],d.prototype,"value",void 0),l([(0,n.wk)()],d.prototype,"_tab",void 0),l([(0,n.wk)()],d.prototype,"_focused",void 0);var h=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let u=0;class p extends o.WF{constructor(){super(...arguments),this.heading="",this.open=!1,this.level=3,this._id="mc-disc-"+ ++u,this._toggle=()=>{this.open=!this.open,this.dispatchEvent(new CustomEvent("mc-toggle",{detail:{open:this.open},bubbles:!0,composed:!0}))}}render(){const e=Math.min(6,Math.max(2,Math.round(this.level)||3));return o.qy`<div class="head" role="heading" aria-level=${e}> <button type="button" class="btn" part="button" id=${this._id} aria-expanded=${this.open?"true":"false"} aria-controls="${this._id}-body" @click=${this._toggle}> <span class="title">${this.heading}</span> ${this.summary?o.qy`<span class="sum">${this.summary}</span>`:o.s6} <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" /></svg> </button></div><div class="body" part="body" id="${this._id}-body" role="region" aria-labelledby=${this._id} ?hidden=${!this.open}><slot></slot></div>`}}p.uiKitRevision=5,p.styles=[r.dk],h([(0,n.MZ)()],p.prototype,"heading",void 0),h([(0,n.MZ)()],p.prototype,"summary",void 0),h([(0,n.MZ)({type:Boolean,reflect:!0})],p.prototype,"open",void 0),h([(0,n.MZ)({type:Number})],p.prototype,"level",void 0);var m=i(9943);function g(e,t,i="start"){const o=window.innerWidth||document.documentElement.clientWidth||0,n=window.innerHeight||document.documentElement.clientHeight||0;e.style.maxHeight="";const a=e.offsetWidth,s=e.offsetHeight,r=n-t.bottom-4-8,l=t.top-4-8,c=n>0&&s>r&&l>r,d=c?l:r;n>0&&s>d&&(e.style.maxHeight=`${Math.max(120,d)}px`);const h=Math.min(s,n>0?Math.max(120,d):s),u=c?Math.max(8,t.top-4-h):t.bottom+4;let p="end"===i?t.right-a:t.left;return o>0&&(p=Math.min(p,o-a-8)),p=Math.max(8,p),Object.assign(e.style,{top:`${Math.round(u)}px`,left:`${Math.round(p)}px`,right:"auto",bottom:"auto"}),e.dataset.placement=c?"top":"bottom",c?"top":"bottom"}function f(e,t,i=0){const o=e.getBoundingClientRect(),n=(e,t,o)=>{let n=e+i;return n+t>o-8&&(n=e-i-t),Math.max(8,Math.min(n,o-8-t))},a=[n(t[0],o.width,window.innerWidth),n(t[1],o.height,window.innerHeight)];return Object.assign(e.style,{left:`${a[0]}px`,top:`${a[1]}px`,right:"auto",bottom:"auto"}),a}function v(e){if("undefined"!=typeof HTMLElement&&"function"==typeof HTMLElement.prototype.showPopover)try{e.matches(":popover-open")||e.showPopover()}catch{}}var b=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};class y extends o.WF{constructor(){super(...arguments),this.items=[],this.label="",this.align="start",this.touch=!1,this._open=!1,this._sub=-1,this._outside=e=>{const t=e.composedPath();if(!t.includes(this))return this.anchor&&t.includes(this.anchor)?this.close("outside"):void this.close("outside")},this._key=e=>{const t=this.list();if(!t)return;const i=[...t.querySelectorAll("[role^=menuitem]")],o=i.indexOf(e.composedPath()[0]),n=this.entries(),a=i.length,s=e=>i[(e+a)%a]?.focus(),r=e.key;let l=!0;if("ArrowDown"===r)s(o+1);else if("ArrowUp"===r)s(o<0?a-1:o-1);else if("Home"===r)s(0);else if("End"===r)s(a-1);else if("Enter"===r||" "===r)this.pick(o,i[o]);else if("ArrowRight"===r)this._sub<0&&n[o]?.items&&this.openSub(o,i[o]);else if("ArrowLeft"===r||"Escape"===r)if(this._sub>=0){const e=this._sub;this._sub=-1,this.updateComplete.then(()=>this.focusIn(this.list(),e))}else"Escape"===r&&this.close("escape");else if("Tab"===r)l=!1,this.close("tab");else if(1!==r.length||e.ctrlKey||e.metaKey||e.altKey)l=!1;else{const e=n.map((e,t)=>(o+1+t)%a).find(e=>n[e].label.toLowerCase().startsWith(r.toLowerCase()));void 0!==e&&s(e)}l&&(e.preventDefault(),e.stopPropagation())}}get open(){return this._open}show(){this._open=!0,this._sub=-1,document.addEventListener("pointerdown",this._outside,!0),this.updateComplete.then(()=>{this.placeMain(),this.focusIn(this.list(),this.firstFree(this.items))})}close(e="escape"){this._open&&(this._open=!1,this._sub=-1,document.removeEventListener("pointerdown",this._outside,!0),this.dispatchEvent(new CustomEvent("mc-menu-close",{detail:{reason:e},bubbles:!0,composed:!0})),"pick"!==e&&(this.opener??this.anchor)?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0)}updated(e){for(const e of this.renderRoot.querySelectorAll(".menu[popover]"))v(e)}placeMain(){const e=this.renderRoot.querySelector(".menu");e&&(v(e),this.anchor?g(e,this.anchor.getBoundingClientRect(),this.align):f(e,this.at??[0,0],this.touch?8:0))}list(){return this.renderRoot.querySelector(this._sub>=0?".sub":".menu")}firstFree(e){return Math.max(0,e.findIndex(e=>!e.reason))}focusIn(e,t){e?.querySelectorAll("[role^=menuitem]")[t]?.focus({preventScroll:!0})}entries(){return this._sub>=0?this.items[this._sub]?.items??[]:this.items}openSub(e,t){const i=this.items[e];i?.items?.length&&!i.reason&&(this._sub=e,this._subRow=t,this.updateComplete.then(()=>{const e=this.renderRoot.querySelector(".sub");if(e){v(e);const i=t.getBoundingClientRect(),o=e.getBoundingClientRect().width;f(e,[i.right+o+8<=window.innerWidth?i.right:Math.max(8,i.left-o),i.top])}this.focusIn(this.list(),this.firstFree(i.items??[]))}))}pick(e,t){const i=this.entries()[e];if(i&&!i.reason){if(i.items)return this.openSub(e,t);this.dispatchEvent(new CustomEvent("mc-menu-pick",{detail:{id:i.id},bubbles:!0,composed:!0})),this.close("pick")}}mark(e){return e.glyph&&(0,m.ow)(e.glyph)?o.qy`<span class="glyph">${(0,m.Vq)(e.glyph,18)}</span>`:e.icon?o.qy`<span class="glyph"><ha-icon icon=${e.icon}></ha-icon></span>`:o.s6}row(e,t){const i=!!e.items,n=void 0===e.checked?"menuitem":"menuitemcheckbox";return o.qy`${e.separatorBefore?o.qy`<div class="sep" role="separator"></div>`:o.s6}<div class="item ${e.danger?"danger":""}" role=${n} tabindex="-1" aria-checked=${void 0===e.checked?o.s6:String(e.checked)} aria-disabled=${e.reason?"true":o.s6} aria-description=${e.reason??e.sub??o.s6} aria-keyshortcuts=${e.keys??o.s6} aria-haspopup=${i?"menu":o.s6} aria-expanded=${i?String(this._sub===t):o.s6} @click=${e=>this.pick(t,e.currentTarget)} > ${this.mark(e)}<span class="label">${e.label}</span>${e.keys?o.qy`<span class="keys">${e.keys}</span>`:o.s6}${i?"›":o.s6}${e.reason?o.qy`<span class="why">${e.reason}</span>`:o.s6}${e.sub?o.qy`<span class="sub-line">${e.sub}</span>`:o.s6}</div>`}render(){if(!this._open)return o.s6;const e=this.items[this._sub];return o.qy`<div class="menu" role="menu" aria-label=${this.label} popover="manual" style=${`max-height:${window.innerHeight-16}px`} @keydown=${this._key}> ${this.items.map((e,t)=>this.row(e,t))}</div>${e?.items?o.qy`<div class="sub menu" role="menu" aria-label=${e.label} popover="manual" @keydown=${this._key}>${e.items.map((e,t)=>this.row(e,t))}</div>`:o.s6}`}}y.uiKitRevision=5,y.styles=r.bE,b([(0,n.MZ)({attribute:!1})],y.prototype,"items",void 0),b([(0,n.MZ)()],y.prototype,"label",void 0),b([(0,n.MZ)({attribute:!1})],y.prototype,"at",void 0),b([(0,n.MZ)({attribute:!1})],y.prototype,"anchor",void 0),b([(0,n.MZ)()],y.prototype,"align",void 0),b([(0,n.MZ)({type:Boolean})],y.prototype,"touch",void 0),b([(0,n.MZ)({attribute:!1})],y.prototype,"opener",void 0),b([(0,n.wk)()],y.prototype,"_open",void 0),b([(0,n.wk)()],y.prototype,"_sub",void 0);var _=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};class w extends o.WF{constructor(){super(...arguments),this.label="",this.align="start",this._open=!1,this._outside=e=>{const t=e.composedPath();t.includes(this)||this.anchor&&t.includes(this.anchor)||this.close("outside")},this._resize=()=>this.close("outside"),this._key=e=>{"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this.close("escape"))},this._focusout=e=>{const t=e.relatedTarget;!t||this.contains(t)||this.renderRoot.contains(t)||t===this.anchor||this.close("tab")}}get open(){return this._open}show(){this._open||(this._open=!0,document.addEventListener("pointerdown",this._outside,!0),window.addEventListener("resize",this._resize),this.updateComplete.then(()=>{const e=this.panel();e&&(v(e),this.anchor&&g(e,this.anchor.getBoundingClientRect(),this.align))}))}close(e="action"){this._open&&(this._open=!1,document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize),this.dispatchEvent(new CustomEvent("mc-popover-close",{detail:{reason:e},bubbles:!0,composed:!0})),"outside"!==e&&"tab"!==e&&this.anchor?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize)}panel(){return this.renderRoot.querySelector(".panel")}render(){return this._open?o.qy`<div class="panel" part="panel" role="group" aria-label=${this.label} popover="manual" @keydown=${this._key} @focusout=${this._focusout}><slot></slot></div>`:o.s6}}w.uiKitRevision=5,w.styles=r.u1,_([(0,n.MZ)({attribute:!1})],w.prototype,"anchor",void 0),_([(0,n.MZ)()],w.prototype,"label",void 0),_([(0,n.MZ)()],w.prototype,"align",void 0),_([(0,n.wk)()],w.prototype,"_open",void 0);var $=i(877),k=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};class x extends o.WF{constructor(){super(...arguments),this.offset=16,this._open=!1,this._text="",this._ms=6e3,this._hold=0,this._pressing=!1,this._listening=!1,this._key=e=>{"Escape"===e.key&&this._open&&(e.composedPath().includes(this)&&e.stopPropagation(),this.close())},this._press=()=>{this._pressing||(this._pressing=!0,this._pause())},this._release=()=>{this._pressing&&(this._pressing=!1,this._resume())},this._pause=()=>{this._hold++,clearTimeout(this._timer)},this._resume=()=>{this._hold=Math.max(0,this._hold-1),this._arm()},this._act=()=>{const e=this._action;e&&(this.dispatchEvent(new CustomEvent("mc-toast-action",{detail:{id:e.id},bubbles:!0,composed:!0})),this.close())}}get open(){return this._open}show(e){this._text=e.text,this._action=e.action,this._ms=e.duration??6e3,this._hold=0,this._pressing=!1,this._open=!0,this._listen(!0),this._arm(),this.updateComplete.then(()=>{const e=this.renderRoot.querySelector(".toast");e&&v(e)})}close(){clearTimeout(this._timer),this._timer=void 0,this._hold=0,this._pressing=!1,this._listen(!1),this._open=!1}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._timer),this._listen(!1)}_listen(e){if(e===this._listening)return;this._listening=e;const t=e?"addEventListener":"removeEventListener";document[t]("keydown",this._key,!0),window[t]("pointerup",this._release),window[t]("pointercancel",this._release)}_arm(){clearTimeout(this._timer),this._hold>0||(this._timer=setTimeout(()=>this.close(),this._ms))}render(){return o.qy`<div class="live" role="status" aria-live="polite">${this._open?o.qy`<div class="toast ${this.dismissLabel?"big":""}" part="toast" popover="manual" style="--mc-toast-offset:${this.offset}px" @pointerdown=${this._press} @pointerenter=${this._pause} @pointerleave=${this._resume} @focusin=${this._pause} @focusout=${this._resume} > <span class="text" part="text">${this._text}</span> ${this._action?o.qy`<button type="button" class="action" part="action" @click=${this._act}>${this._action.label}</button>`:o.s6} ${this.dismissLabel?o.qy`<button type="button" class="dismiss" part="dismiss" aria-label=${this.dismissLabel} @click=${()=>this.close()}> <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg> </button>`:o.s6}</div>`:o.s6}</div>`}}x.uiKitRevision=5,x.styles=[o.AH`:host{display:contents;font-family:var(--mc-font,inherit)}*,*::before,*::after{box-sizing:border-box}.toast .dismiss{flex:none;display:inline-grid;place-items:center;width:44px;height:44px;margin:-10px -10px -10px -4px;padding:0;border:0;border-radius:var(--mc-radius,8px);background:transparent;color:inherit;cursor:pointer}@media (hover:hover){.toast .dismiss:hover{background:rgba(128,128,128,.25)}}.toast .dismiss:focus-visible{outline:2px solid currentColor;outline-offset:-4px}.toast .dismiss svg{width:20px;height:20px}.toast.big .action{min-height:44px;min-width:44px}.live{position:absolute;width:0;height:0;overflow:visible}`,$.k],k([(0,n.MZ)({type:Number})],x.prototype,"offset",void 0),k([(0,n.MZ)()],x.prototype,"dismissLabel",void 0),k([(0,n.wk)()],x.prototype,"_open",void 0),k([(0,n.wk)()],x.prototype,"_text",void 0),k([(0,n.wk)()],x.prototype,"_action",void 0);const C=[420,480,640,880];function S(e,t,i){const o=Math.min(Math.max(e.w,320),t-32);return{w:o,h:Math.min(Math.max(e.h,240),i-32),x:Math.min(Math.max(e.x,48-o),t-48),y:Math.min(Math.max(e.y,0),i-48)}}const M=(e,t,i)=>({...e,x:(t-e.w)/2,y:(i-e.h)/2});var A=function(e,t,i,o){var n,a=arguments.length,s=a<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,o);else for(var r=e.length-1;r>=0;r--)(n=e[r])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};const q=["centre","end","start"];class E extends o.WF{constructor(){super(...arguments),this.heading="",this.closeLabel="",this.variant="dialog",this.dismissible=!0,this.movable=!1,this.resizable=!1,this.maximizable=!1,this.maximized=!1,this.moveLabel="",this.resizeLabel="",this.maximizeLabel="",this.restoreLabel="",this._open=!1,this._hasFooter=!1,this._r=null,this._compact=!1,this._rtl=!1,this._drag=null,this._dock=0,this._downScrim=null,this._id=`mc-ui-win-${Math.random().toString(36).slice(2,8)}`,this._isCompact=()=>"function"==typeof matchMedia&&matchMedia("(max-width: 599px)").matches,this._vw=()=>document.documentElement.clientWidth||window.innerWidth,this._vh=()=>window.innerHeight,this._free=()=>"alert"!==this.variant&&!("sheet"===this.variant&&this._compact),this._viewport=()=>{this._compact=this._isCompact(),this._r&&(this._r=S(this._r,this._vw(),this._vh()))},this._cancel=e=>{e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape")},this._key=e=>{"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape"))},this._press=e=>{this._downScrim=e.target===e.currentTarget},this._click=e=>{const t=this._downScrim;this._downScrim=null,e.target===e.currentTarget&&!1!==t&&this.dismissible&&"alert"!==this.variant&&this.close("scrim")},this._footer=e=>{this._hasFooter=e.target.assignedNodes().length>0},this._moved=e=>{const t=this._drag;if(!t||e.pointerId!==t.id)return;const i=e.clientX-t.sx,o=e.clientY-t.sy;if(!t.moved&&Math.hypot(i,o)<4)return;t.moved=!0,this._dock=0;const n=t.r0;if("move"===t.mode)return this._set({...n,x:n.x+i,y:n.y+o});const a=this._rtl,s=S({...n,w:n.w+(a?-i:i),h:n.h+o},this._vw(),this._vh());this._set({...s,x:a?n.x+n.w-s.w:n.x})},this._released=e=>{const t=this._drag;t&&e.pointerId===t.id&&(this._drag=null,"pointercancel"===e.type?this._r=t.was:!t.moved&&t.grip&&("move"===t.mode?this._dockNext():this._stepWidth()))}}get open(){return this._open}dlg(){return this.renderRoot.querySelector("dialog")}show(){this._open||(this._open=!0,this._hasFooter=!!this.querySelector(':scope > [slot="footer"]'),this._compact=this._isCompact(),this._rtl="rtl"===getComputedStyle(this).direction,window.addEventListener("resize",this._viewport),(this.movable&&!this.moveLabel||this.resizable&&!this.resizeLabel||this.maximizable&&!this.maximizeLabel)&&console.debug("[magic-card] <mc-ui-window> needs moveLabel, resizeLabel and maximizeLabel"),this.updateComplete.then(()=>{const e=this.dlg();if(e){if("function"==typeof e.showModal)try{e.showModal()}catch{e.setAttribute("open","")}else e.setAttribute("open","");this.focusFirst()}}))}close(e="action"){if(!this._open)return;this._open=!1,this._forget();const t=this.dlg();t?.open&&"function"==typeof t.close?t.close():t?.removeAttribute("open"),this.dispatchEvent(new CustomEvent("mc-window-close",{detail:{reason:e},bubbles:!0,composed:!0}));const i=this.opener;i?.isConnected&&i.focus({preventScroll:!0})}disconnectedCallback(){if(super.disconnectedCallback(),this._open){this._open=!1,this._forget();const e=this.dlg();e?.open&&"function"==typeof e.close&&e.close()}}_forget(){window.removeEventListener("resize",this._viewport),this._r=null,this._drag=null,this._dock=0,this.maximized=!1}focusFirst(){const e=(this.initialFocus?this.querySelector(`#${CSS.escape(this.initialFocus)}`):null)??this.querySelector('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');(e??this.renderRoot.querySelector(".close"))?.focus({preventScroll:!0})}_now(){return this._r??this._measure()}_measure(){const e=this.dlg()?.getBoundingClientRect();return{x:e?.left??0,y:e?.top??0,w:e?.width??0,h:e?.height??0}}_set(e){this._r=S(e,this._vw(),this._vh())}_abort(){const e=this._drag;return!!e&&(this._drag=null,this._r=e.was,!0)}_begin(e,t,i){if(!(this.maximized||"mouse"===e.pointerType&&0!==e.button)&&(i||!e.composedPath()[0]?.closest?.('button, input, select, textarea, a, [role="button"]'))){this._drag={mode:t,id:e.pointerId,sx:e.clientX,sy:e.clientY,r0:this._now(),was:this._r,grip:i,moved:!1};try{e.target.setPointerCapture?.(e.pointerId)}catch{}}}_dockNext(){this.maximized||(this._dock=(this._dock+1)%q.length,this._set(function(e,t,i,o,n){if("centre"===t)return M(e,o,n);const a="end"===t!==i;return{...e,x:a?o-e.w-16:16}}(this._now(),q[this._dock],this._rtl,this._vw(),this._vh())))}_stepWidth(){this.maximized||this._set(function(e,t){const i=C.find(t=>t>e.w+1)??C[0];return{...e,w:Math.min(i,t-32)}}(this._now(),this._vw()))}_grip(e,t){const i=function(e,t){const i=t?64:16;switch(e){case"ArrowLeft":return[-i,0];case"ArrowRight":return[i,0];case"ArrowUp":return[0,-i];case"ArrowDown":return[0,i];default:return null}}(t.key,t.shiftKey);if(this.maximized||!i&&"Home"!==t.key)return;t.preventDefault(),t.stopPropagation();const o=this._now();if(this._dock=0,!i){if("move"===e)return this._set(M(o,this._vw(),this._vh()));const t=this.dlg(),i=t?.getAttribute("style")??null;t?.removeAttribute("style");const n=this._measure();if(null!==i&&t?.setAttribute("style",i),!this._r)return;return this._set({...o,w:n.w,h:n.h})}if("move"===e)return this._set({...o,x:o.x+i[0],y:o.y+i[1]});const n=this._rtl,a=S({...o,w:o.w+(n?-i[0]:i[0]),h:o.h+i[1]},this._vw(),this._vh());this._set({...a,x:n?o.x+o.w-a.w:o.x})}_style(){const e=this.maximized?{x:16,y:16,w:this._vw()-32,h:this._vh()-32}:this._r;return e?`inset:auto;margin:0;max-width:none;max-height:none;left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px`:""}render(){if(!this._open)return o.s6;const e="alert"===this.variant,t=this._free(),i=t&&this.movable,n=t&&this.resizable&&!this.maximized,a=t&&this.maximizable;return o.qy`<dialog class="${this.variant} size-${this.size??(e?"s":"picker"===this.variant?"l":"m")}${this._rtl?" rtl":""}${this.maximized||this._r?" placed":""}" style=${this._style()} role=${e?"alertdialog":"dialog"} aria-labelledby="${this._id}-t" @cancel=${this._cancel} @keydown=${this._key} @pointerdown=${this._press} @click=${this._click} @pointermove=${this._moved} @pointerup=${this._released} @pointercancel=${this._released} > <div class="panel${n?" sizable":""}${this._hasFooter?" has-footer":""}" part="panel"> <div class="header${i?" movable":""}" part="header" @pointerdown=${e=>i&&this._begin(e,"move",!1)}> ${i?o.qy`<button type="button" class="tool move" part="move" aria-label=${this.moveLabel} title=${this.moveLabel} ?disabled=${this.maximized} @pointerdown=${e=>this._begin(e,"move",!0)} @keydown=${e=>this._grip("move",e)} @click=${e=>0===e.detail&&this._dockNext()}>${(0,m.Vq)("grip",20)}</button>`:o.s6}<h2 class="title" id="${this._id}-t" part="title">${this.heading}</h2><slot name="header-actions"></slot> ${a?o.qy`<button type="button" class="tool maximize" part="maximize" aria-pressed=${this.maximized?"true":"false"} aria-label=${this.maximized?this.restoreLabel:this.maximizeLabel} title=${this.maximized?this.restoreLabel:this.maximizeLabel} @click=${()=>this.maximized=!this.maximized}>${(0,m.Vq)(this.maximized?"restore":"maximize",20)}</button>`:o.s6} <button type="button" class="tool close" part="close" aria-label=${this.closeLabel} title=${this.closeLabel} @click=${()=>this.close("close-button")}>${(0,m.Vq)("close",20)}</button></div><div class="body" part="body"><slot></slot></div><div class="footer" part="footer" ?hidden=${!this._hasFooter}><slot name="footer" @slotchange=${this._footer}></slot></div></div>${n?o.qy`<button type="button" class="tool resize" part="resize" aria-label=${this.resizeLabel} title=${this.resizeLabel} @pointerdown=${e=>this._begin(e,"size",!0)} @keydown=${e=>this._grip("size",e)} @click=${e=>0===e.detail&&this._stepWidth()}>${(0,m.Vq)("resizeCorner",20)}</button>`:o.s6}</dialog>`}}E.uiKitRevision=5,E.styles=r.S8,A([(0,n.MZ)()],E.prototype,"heading",void 0),A([(0,n.MZ)()],E.prototype,"closeLabel",void 0),A([(0,n.MZ)()],E.prototype,"variant",void 0),A([(0,n.MZ)({reflect:!0})],E.prototype,"size",void 0),A([(0,n.MZ)()],E.prototype,"initialFocus",void 0),A([(0,n.MZ)({attribute:!1})],E.prototype,"opener",void 0),A([(0,n.MZ)({type:Boolean})],E.prototype,"dismissible",void 0),A([(0,n.MZ)({type:Boolean})],E.prototype,"movable",void 0),A([(0,n.MZ)({type:Boolean})],E.prototype,"resizable",void 0),A([(0,n.MZ)({type:Boolean})],E.prototype,"maximizable",void 0),A([(0,n.MZ)({type:Boolean,reflect:!0})],E.prototype,"maximized",void 0),A([(0,n.MZ)()],E.prototype,"moveLabel",void 0),A([(0,n.MZ)()],E.prototype,"resizeLabel",void 0),A([(0,n.MZ)()],E.prototype,"maximizeLabel",void 0),A([(0,n.MZ)()],E.prototype,"restoreLabel",void 0),A([(0,n.wk)()],E.prototype,"_open",void 0),A([(0,n.wk)()],E.prototype,"_hasFooter",void 0),A([(0,n.wk)()],E.prototype,"_r",void 0),A([(0,n.wk)()],E.prototype,"_compact",void 0),A([(0,n.wk)()],E.prototype,"_rtl",void 0);const T=[["mc-ui-menu",y],["mc-ui-window",E],["mc-ui-popover",w],["mc-ui-toast",x],["mc-ui-disclosure",p],["mc-ui-tile-group",class extends d{constructor(){super(...arguments),this.gridClass="tile-grid"}}],["mc-ui-chip-group",class extends d{constructor(){super(...arguments),this.gridClass="chip-grid"}}]];function L(){!function(e){for(const[t,i]of e){const e=customElements.get(t);e?(e.uiKitRevision??0)<5&&console.debug(`[magic-card] ${t} is defined by an older ui-kit (revision ${e.uiKitRevision??0}); keeping it`):customElements.define(t,i)}}(T)}var z=i(8094),j=i(4182)},3220(e,t,i){i.d(t,{x:()=>a});var o=i(6161),n=i(1141);function a(e){const t=!!e.disabledReason,i=e.iconOnly?"icon-btn"+("sm"===e.size?" sm":""):`btn btn-${e.variant??"secondary"}${"sm"===e.size?" btn-sm":""}`;return o.qy`<button type="button" class=${i} aria-label=${e.iconOnly?e.label:o.s6} title=${e.iconOnly?e.label:o.s6} aria-pressed=${void 0===e.pressed?o.s6:String(e.pressed)} aria-disabled=${t?"true":o.s6} aria-haspopup=${e.haspopup??o.s6} aria-expanded=${void 0===e.expanded?o.s6:String(e.expanded)} aria-controls=${e.controls??o.s6} aria-keyshortcuts=${e.keys??o.s6} ?disabled=${e.disabled} @click=${i=>{t||e.onClick(i)}} >${(0,n.Z)(e,e.iconOnly?20:18)}${e.iconOnly?o.s6:e.label}</button>`}},7795(e,t,i){i.d(t,{aJ:()=>s,jw:()=>r,os:()=>l});var o=i(6161),n=i(5710),a=i(1141);function s(e){const t="tablist"===e.role,i=new n.Y({items:"[data-val]",orientation:"horizontal",onMove:t=>{const i=t.dataset.val;i!==e.value&&e.onChange(i)}});return o.qy`<div class="seg${e.full?" full":""}" role=${e.role} aria-label=${e.label} @keydown=${i.onKeydown}> ${e.items.map(i=>{const n=i.value===e.value,s=!!i.disabledReason;return o.qy`<button type="button" role=${t?"tab":"radio"} data-val=${i.value} aria-selected=${t?String(n):o.s6} aria-checked=${t?o.s6:String(n)} aria-disabled=${s?"true":o.s6} tabindex=${n?"0":"-1"} @click=${()=>{s||e.onChange(i.value)}} >${(0,a.Z)(i)}${i.label}</button>`})}</div>`}function r(e){const t="chip"+(e.tone?` is-${e.tone}`:"");return e.onClick?o.qy`<button type="button" class=${t} aria-pressed=${void 0===e.pressed?o.s6:String(e.pressed)} @click=${e.onClick}>${(0,a.Z)(e)}${e.label}</button>`:o.qy`<span class=${t}>${(0,a.Z)(e)}${e.label}</span>`}function l(e){const t=new n.Y({items:".tile",orientation:"both",onMove:t=>e.onPick(t.dataset.val)});return o.qy`<div class="tiles" role="radiogroup" aria-label=${e.label} @keydown=${t.onKeydown}> ${e.items.map(t=>{const i=t.value===e.value,n=i||void 0===e.value&&t===e.items[0];return o.qy`<button type="button" class="tile" role="radio" data-val=${t.value} aria-checked=${String(i)} tabindex=${n?"0":"-1"} @click=${()=>e.onPick(t.value)}> ${t.preview?o.qy`<span class="thumb">${t.preview}</span>`:(0,a.Z)(t,24)}<span>${t.label}</span> </button>`})}</div>`}},9530(e,t,i){i.d(t,{ZZ:()=>s,xH:()=>r});var o=i(6161),n=i(1141);const a=e=>`${e}-help`;function s(e){return o.qy`<div class="field"><div class="field-head"><label for=${e.id}>${e.label}</label> ${e.onReset?o.qy`<button type="button" class="icon-btn sm field-reset" aria-label=${e.resetLabel??""} title=${e.resetLabel??""} @click=${e.onReset}>${(0,n.Z)({icon:"mdi:restore"})}</button>`:o.s6}</div>${e.control} ${e.error?o.qy`<p class="help error" id=${t=e.id,`${t}-error`} role="alert">${e.error}</p>`:e.help?o.qy`<p class="help" id=${a(e.id)}>${e.help}</p>`:o.s6}</div>`;var t}function r(e){return o.qy`<div class="switch-row"><div class="txt"><div class="field-head"><label for=${e.id}>${e.label}</label></div>${e.help?o.qy`<p class="help" id=${a(e.id)}>${e.help}</p>`:o.s6}</div><button type="button" class="switch" id=${e.id} role="switch" aria-checked=${e.checked?"true":"false"} aria-describedby=${e.help?a(e.id):o.s6} ?disabled=${e.disabled} @click=${()=>e.onChange(!e.checked)} ></button></div>`}},1141(e,t,i){i.d(t,{Z:()=>a});var o=i(6161),n=i(9943);function a(e,t=18){return e.glyph&&(0,n.ow)(e.glyph)?(0,n.Vq)(e.glyph,t):e.icon?o.qy`<ha-icon icon=${e.icon}></ha-icon>`:o.s6}},4182(e,t,i){i.d(t,{x6:()=>o.x,jw:()=>a.jw,Ie:()=>s.I,ZZ:()=>n.ZZ,lm:()=>s.l,nM:()=>b,S1:()=>f,aJ:()=>a.aJ,aw:()=>l.a,xH:()=>n.xH,os:()=>a.os,KE:()=>g,XV:()=>m});var o=i(3220),n=i(9530),a=i(7795),s=i(7634),r=i(1141),l=i(4313),c=i(6161),d=i(4489),h=i(5710),u=i(9943);let p=0;function m(e){const t=e.name?.error?"tb-name-err-"+ ++p:"";return c.qy`<header class="topbar">${(0,o.x)({...e.back,variant:"secondary",glyph:"arrowLeft",iconOnly:!1})}<h1 class="title">${e.title}</h1>${e.name?c.qy`<div class="name"><input class="input" type="text" aria-label=${e.name.label} placeholder=${e.name.placeholder??""} .value=${e.name.value} aria-invalid=${e.name.error?"true":c.s6} aria-describedby=${t||c.s6} @input=${t=>e.name?.onInput(t.target.value)} /> ${e.name.error?c.qy`<p class="help error" id=${t}>${e.name.error}</p>`:c.s6}</div>`:c.s6} <span class="spacer"></span> ${e.undo?(0,o.x)({...e.undo,iconOnly:!0}):c.s6} ${e.redo?(0,o.x)({...e.redo,iconOnly:!0}):c.s6} ${e.actions.map(e=>(0,o.x)(e))} ${e.help?(0,o.x)({...e.help,iconOnly:!0}):c.s6}</header>`}function g(e){const t=new h.Y({items:"button:not([disabled])",orientation:e.orientation}),i=(e,t)=>{if(!e)return;const i=Array.from(e.querySelectorAll("button:not([disabled])")),o=t&&i.includes(t)?t:i[0];for(const e of i)e.tabIndex=e===o?0:-1};return c.qy`<div class=${"rail"===e.kind?"rail":"toolbar"} role="toolbar" aria-label=${e.label} aria-orientation=${e.orientation} @keydown=${t.onKeydown} @focusin=${e=>i(e.currentTarget,e.composedPath()[0])} ${(0,d.K)(e=>{e&&queueMicrotask(()=>i(e,e.contains(document.activeElement)?document.activeElement:void 0))})} > ${e.items.map(t=>"divider"===t?c.qy`<span role="separator" aria-orientation=${"horizontal"===e.orientation?"vertical":"horizontal"}></span>`:(0,o.x)("float"!==e.kind||t.iconOnly?{...t,size:t.iconOnly&&"float"===e.kind?"sm":t.size}:{...t,size:"sm"}))}</div>`}function f(e){const t=4===e.level,i=(0,r.Z)(e,18);if(!e.collapsible){const o=c.qy`${i}${t?c.qy`<h4>${e.title}</h4>`:c.qy`<h3>${e.title}</h3>`}`;return c.qy`<div class="group-head">${o}</div>`}const o=c.qy`<button type="button" class="sector-btn" aria-expanded=${String(!!e.expanded)} @click=${()=>e.onToggle?.()}> ${i}<span class="nm">${e.title}</span><span class="chev">${(0,u.Vq)("chevronDown",20)}</span> </button>`;return t?c.qy`<h4 class="sector-head">${o}</h4>`:c.qy`<h3 class="sector-head">${o}</h3>`}const v=e=>{const t=!!e.disabledReason;return c.qy`<button type="button" class="icon-btn xs${"danger"===e.variant?" danger":""}" aria-label=${e.label} title=${e.label} aria-pressed=${void 0===e.pressed?c.s6:String(e.pressed)} aria-disabled=${t?"true":c.s6} ?disabled=${e.disabled} @click=${i=>{t||e.onClick(i)}} >${(0,r.Z)(e,18)}</button>`};function b(e){const t=void 0!==e.level,i=`row-${e.id}-check`,o=c.qy`${e.name}${e.sub?c.qy`<small>${e.sub}</small>`:c.s6}`,n=e.content?e.content:e.check?c.qy`<label class="name" for=${i}>${o}</label>`:c.qy`<button type="button" class="name" @click=${t=>e.onSelect?.(t)}>${o}</button>`;return c.qy`<div class="row${e.selected||e.check?.checked?" selected":""}" role=${t?"treeitem":"listitem"} aria-level=${t?String(e.level):c.s6} aria-selected=${t?String(!!e.selected):c.s6} aria-expanded=${void 0===e.expanded?c.s6:String(e.expanded)} style=${t?`--lvl:${Math.max(0,e.level-1)}`:c.s6} > ${e.grip?c.qy`<span class="grip" aria-hidden="true">${(0,u.Vq)("grip",18)}</span>`:c.s6} ${e.check?c.qy`<input type="checkbox" class="check" id=${i} aria-label=${e.check.label} .checked=${e.check.checked} @change=${t=>e.check.onChange(t.target.checked)} />`:c.s6} ${(0,r.Z)(e)}${e.lead??c.s6}${n} ${e.actions?.length?c.qy`<span class="acts">${e.actions.map(v)}</span>`:c.s6}${e.trail??c.s6}</div>`}},4313(e,t,i){i.d(t,{a:()=>s});var o=i(6161),n=i(1413);const a=e=>Number(e.target.value);function s(e){return o.qy`<div class="slider-row"><label for=${e.id}>${e.label}</label> <input id=${e.id} type="range" min=${e.min} max=${e.max} step=${e.step} .value=${String(e.value)} aria-valuetext=${(0,n.J)(e.valueText)} ?disabled=${e.disabled} @input=${t=>e.onInput(a(t))} @change=${t=>e.onChange(a(t))} /> <input class="input" type="number" min=${e.min} max=${e.max} step=${e.step} aria-label=${e.numberLabel??e.label} .value=${String(e.value)} ?disabled=${e.disabled} @change=${t=>e.onChange(a(t))} /> ${e.unit?o.qy`<span aria-hidden="true">${e.unit}</span>`:o.s6}</div>`}},7634(e,t,i){i.d(t,{I:()=>c,l:()=>l});var o=i(6161),n=i(9943),a=i(3220),s=i(1141);const r={info:"information",success:"check",warn:"help",error:"close"};function l(e){const t=Array.isArray(e.text)?e.text:[e.text];return o.qy`<div class="notice ${e.tone}${e.transient?" result-note":""}" role=${"error"===e.tone?"alert":"status"}> ${(0,n.Vq)(r[e.tone],20)}<div class="body">${t.map(e=>o.qy`<p>${e}</p>`)} ${e.action?o.qy`<div class="actions">${(0,a.x)({label:e.action.label,size:"sm",variant:"secondary",onClick:e.action.onClick})}</div>`:o.s6}</div></div>`}function c(e){return o.qy`<div class="empty">${(0,s.Z)(e,24)} <strong>${e.title}</strong> ${e.text?o.qy`<p>${e.text}</p>`:o.s6} ${e.action?(0,a.x)({...e.action,variant:e.action.variant??"secondary",size:"sm"}):o.s6}</div>`}},6505(e,t,i){i.d(t,["E",0,e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)}])},5694(e,t,i){i.d(t,{M:()=>s});var o=i(8760);const n={attribute:!0,type:String,converter:o.W3,reflect:!1,hasChanged:o.Ec},a=(e=n,t,i)=>{const{kind:o,metadata:a}=i;let s=globalThis.litPropertyMetadata.get(a);if(void 0===s&&globalThis.litPropertyMetadata.set(a,s=new Map),"setter"===o&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),"accessor"===o){const{name:o}=i;return{set(i){const n=t.get.call(this);t.set.call(this,i),this.requestUpdate(o,n,e,!0,i)},init(t){return void 0!==t&&this.C(o,void 0,e,t),t}}}if("setter"===o){const{name:o}=i;return function(i){const n=this[o];t.call(this,i),this.requestUpdate(o,n,e,!0,i)}}throw Error("Unsupported decorator location: "+o)};function s(e){return(t,i)=>"object"==typeof i?a(e,t,i):((e,t,i)=>{const o=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),o?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}},4290(e,t,i){i.d(t,{w:()=>n});var o=i(5694);function n(e){return(0,o.M)({...e,state:!0,attribute:!1})}},382(e,t,i){i.d(t,{Bh:()=>Li,Hh:()=>Lt,LJ:()=>D,OU:()=>te});var o=Symbol("NOT_RESOLVED");function n(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function a(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function s(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var r=n("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),l=["","~","null","Null","NULL"],c=n("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==l.indexOf(e)?null:o,identify:e=>null===e,represent:()=>"null"}),d=n("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:o,identify:e=>null===e,represent:()=>"null"}),h=["","~","null","Null","NULL"],u=n("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==h.indexOf(e)?null:o,identify:e=>null===e,represent:()=>"null"}),p=["true","True","TRUE"],m=["false","False","FALSE"],g=n("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==p.indexOf(e)||-1===m.indexOf(e)&&o,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),f=["true"],v=["false"],b=n("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==f.indexOf(e)||-1===v.indexOf(e)&&o,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),y=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],_=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],w=n("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==y.indexOf(e)||-1===_.indexOf(e)&&o,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),$=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),k=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),x=n("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!k.test(e))return o}else if(!$.test(e))return o;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:o},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),C=new RegExp("^-?(?:0|[1-9][0-9]*)$"),S=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),M=n("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!S.test(e))return o}else if(!C.test(e))return o;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:o},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),A=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$"),q=n("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!A.test(e))return o;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:o},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),E=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),T=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),L=n("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!E.test(e))return o;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const n=i*parseFloat(t);return Number.isFinite(n)||T.test(e)?n:o},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),z=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),j=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),R=n("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!j.test(e))return o;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const n=i*parseFloat(t);return Number.isFinite(n)?n:o}if(!z.test(e))return o;const i=Number(e);return Number.isFinite(i)?i:o},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),O=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),P=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),H=n("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!O.test(e))return o;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let n=0;if(t.includes(":")){for(const e of t.split(":"))n=60*n+Number(e);n*=i}else n=i*parseFloat(t);return Number.isFinite(n)||P.test(e)?n:o},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),D=n("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":o,identify:()=>!1}),I=/^[A-Za-z0-9+/]*={0,2}$/,F=n("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!I.test(t))return o;const i=atob(t),n=new Uint8Array(i.length);for(let e=0;e<i.length;e++)n[e]=i.charCodeAt(e);return n},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),V=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),N=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Z(e,t,i,o=0,n=0,a=0,s=0){const r=new Date(Date.UTC(e,t,i,o,n,a,s));return r.setUTCFullYear(e,t,i),r}var B=n("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=V.exec(e);if(null===t&&(t=N.exec(e)),null===t)return o;const i=+t[1],n=+t[2]-1,a=+t[3];if(!t[4]){const e=Z(i,n,a);return e.getUTCFullYear()!==i||e.getUTCMonth()!==n||e.getUTCDate()!==a?o:e}const s=+t[4],r=+t[5],l=+t[6];let c=0;if(s>23||r>59||l>59)return o;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";c=+e}const d=Z(i,n,a,s,r,l,c);if(d.getUTCFullYear()!==i||d.getUTCMonth()!==n||d.getUTCDate()!==a)return o;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return o;const n=6e4*(60*e+i);d.setTime(d.getTime()-("-"===t[9]?-n:n))}return d},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),W=a("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function K(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function U(e,t){const i={};for(const o of t)void 0!==e[o]&&(i[o]=e[o]);return i}var G=a("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!K(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),Y=a("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,o=Object.keys(i);return 1!==o.length?"cannot resolve a pairs item":(e.push([o[0],i[o[0]]]),"")},identify:()=>!1}),Q=s("tag:yaml.org,2002:map",{create:()=>({}),identify:K,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const o=String(t);return"__proto__"===o?Object.defineProperty(e,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[o]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),J=s("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null}),X=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let o=0;o<t.length;o++){const n=t[o];if(n.nodeKind===i.nodeKind&&n.tagName===i.tagName&&n.matchByTagPrefix===i.matchByTagPrefix){e=o;break}}t[e]=i}return t}(e),i=[],o={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},n={scalar:[],sequence:[],mapping:[]};for(const e of t){if("scalar"===e.nodeKind&&e.implicit){if(e.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(e)}switch(e.nodeKind){case"scalar":e.matchByTagPrefix?n.scalar.push(e):o.scalar[e.tagName]=e;break;case"sequence":e.matchByTagPrefix?n.sequence.push(e):o.sequence[e.tagName]=e;break;case"mapping":e.matchByTagPrefix?n.mapping.push(e):o.mapping[e.tagName]=e}}const a=i.filter(e=>null===e.implicitFirstChars),s=new Set;for(const e of i)if(null!==e.implicitFirstChars)for(const t of e.implicitFirstChars)s.add(t);const r=new Map;for(const e of s)r.set(e,i.filter(t=>null===t.implicitFirstChars||-1!==t.implicitFirstChars.indexOf(e)));const l=o.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=a,this.defaultScalarTag=l,this.defaultSequenceTag=o.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=o.mapping["tag:yaml.org,2002:map"],this.exact=o,this.prefix=n}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const t of this.prefix.scalar)if(e.startsWith(t.tagName))return t}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const t of this.prefix.sequence)if(e.startsWith(t.tagName))return t}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const t of this.prefix.mapping)if(e.startsWith(t.tagName))return t}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const i of t){const t=i.resolve(e,!1,i.tagName);if(t!==o)return{value:t,tag:i}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},ee=new X([r,W,Q]),te=(new X([...ee.tags,d,b,M,R]),new X([...ee.tags,c,g,x,L])),ie=new X([...ee.tags,u,w,q,H,B,D,F,G,Y,J]).withTags({...q,resolve:(e,t,i)=>{const n=q.resolve(e,t,i);return n===o?x.resolve(e,t,i):n}},{...H,resolve:(e,t,i)=>{const n=H.resolve(e,t,i);return n===o?L.resolve(e,t,i):n}});function oe(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}s("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||K(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const e of Object.keys(i))t.set(e,i[e]);return t}}),s("tag:yaml.org,2002:map",{create:()=>({}),identify:K,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const o=oe(t);return null===o?"nested arrays are not supported inside keys":("__proto__"===o?Object.defineProperty(e,o,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[o]=i,"")},has:(e,t)=>{const i=oe(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}});var ne={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function ae(e,t,i,o,n){let a="",s="";const r=Math.floor(n/2)-1;return o-t>r&&(a=" ... ",t=o-r+a.length),i-o>r&&(s=" ...",i=o+r-s.length),{str:a+e.slice(t,i).replace(/\t/g,"→")+s,pos:o-t+a.length}}function se(e,t){return" ".repeat(Math.max(t-e.length,0))+e}function re(e,t){let i="";return e.mark?(e.mark.name&&(i+=`in "${e.mark.name}" `),i+=`(${e.mark.line+1}:${e.mark.column+1})`,!t&&e.mark.snippet&&(i+=`\n\n${e.mark.snippet}`),`${e.reason} ${i}`):e.reason}var le=class e extends Error{reason;mark;constructor(e,t){super(),this.name="YAMLException",this.reason=e,this.mark=t,this.message=re(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(e){return`${this.name}: ${re(this,e)}`}static throwAt(t,i,o,n=""){let a=0,s=0;for(let e=0;e<i;e++){const i=t.charCodeAt(e);10===i?(a++,s=e+1):13===i&&(a++,10===t.charCodeAt(e+1)&&e++,s=e+1)}const r={name:n,buffer:t,position:i,line:a,column:i-s};throw r.snippet=function(e){if(!e.buffer)return null;const t={...ne},i=/\r?\n|\r|\0/g,o=[0],n=[];let a,s=-1;for(;a=i.exec(e.buffer);)n.push(a.index),o.push(a.index+a[0].length),e.position<=a.index&&s<0&&(s=o.length-2);s<0&&(s=o.length-1);let r="";const l=Math.min(e.line+t.linesAfter,n.length).toString().length,c=t.maxLength-(t.indent+l+3);for(let i=1;i<=t.linesBefore&&!(s-i<0);i++){const a=ae(e.buffer,o[s-i],n[s-i],e.position-(o[s]-o[s-i]),c);r=`${" ".repeat(t.indent)}${se((e.line-i+1).toString(),l)} | ${a.str}\n${r}`}const d=ae(e.buffer,o[s],n[s],e.position,c);r+=`${" ".repeat(t.indent)}${se((e.line+1).toString(),l)} | ${d.str}\n`,r+=`${"-".repeat(t.indent+l+3+d.pos)}^\n`;for(let i=1;i<=t.linesAfter&&!(s+i>=n.length);i++){const a=ae(e.buffer,o[s+i],n[s+i],e.position-(o[s]-o[s+i]),c);r+=`${" ".repeat(t.indent)}${se((e.line+i+1).toString(),l)} | ${a.str}\n`}return r.replace(/\n$/,"")}(r),new e(o,r)}};function ce(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var de=new Array(256),he=new Array(256);for(let e=0;e<256;e++)de[e]=ce(e)?1:0,he[e]=ce(e);function ue(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function pe(e){return e>=48&&e<=57?e-48:(32|e)-97+10}function me(e){return 120===e?2:117===e?4:8}function ge(e,t,i){let o=0;for(;t<i;){const i=e.charCodeAt(t);if(10===i)o++,t++;else if(13===i)o++,t++,10===e.charCodeAt(t)&&t++;else{if(32!==i&&9!==i)break;t++}}return{position:t,breaks:o}}function fe(e){return 1===e?" ":"\n".repeat(e-1)}function ve(e,t,i,o,n,a){const s=o<0?0:o,r=e.slice(t,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let c="",d=!1,h=0,u=!1;for(const e of l){let t=0;for(;t<s&&32===e.charCodeAt(t);)t++;if(o<0||t>=e.length){h++;continue}const i=e.slice(s),n=i.charCodeAt(0);a?32===n||9===n?(u=!0,c+="\n".repeat(d?1+h:h)):u?(u=!1,c+="\n".repeat(h+1)):0===h?d&&(c+=" "):c+="\n".repeat(h):c+="\n".repeat(d?1+h:h),c+=i,d=!0,h=0}return 3===n?c+="\n".repeat(d?1+h:h):2!==n&&d&&(c+="\n"),c}var be=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"}),ye="-#;/?:@&=+$_.~*'()",_e=ye+"!,[]",we="0123456789ABCDEF";function $e(e){return"%"+we[e>>4]+we[15&e]}function ke(e,t){const i=t?ye:_e;let o="";for(let t=0;t<e.length;t++){let n=e.charCodeAt(t);n>=48&&n<=57||n>=65&&n<=90||n>=97&&n<=122||i.includes(e[t])?o+=e[t]:(n>=55296&&n<=56319&&(n=65536+((1023&n)<<10)+(1023&e.charCodeAt(++t))),o+=n<128?$e(n):n<2048?$e(192|n>>6)+$e(128|63&n):n<65536?$e(224|n>>12)+$e(128|n>>6&63)+$e(128|63&n):$e(240|n>>18)+$e(128|n>>12&63)+$e(128|n>>6&63)+$e(128|63&n))}return o}function xe(e){let t="",i=0;for(;i<e.length;){if(37!==e.charCodeAt(i)){t+=e[i++];continue}let o=parseInt(e.slice(i+1,i+3),16);if(i+=3,o>=192){let t=o<224?1:o<240?2:3;for(o&=(1<<6-t)-1;t-- >0;)o=o<<6|63&parseInt(e.slice(i+1,i+3),16),i+=3}o<65536?t+=String.fromCharCode(o):(o-=65536,t+=String.fromCharCode(55296|o>>10,56320|1023&o))}return t}function Ce(e,t){if(e.startsWith("!<")&&e.endsWith(">"))return xe(e.slice(2,-1));const i=e.indexOf("!",1),o=-1===i?"!":e.slice(0,i+1);return xe(t?.[o]??be[o]??o)+xe(e.slice(o.length))}function Se(e){let t=e;return 33===t.charCodeAt(0)?(t=t.slice(1),`!${ke(t,!0)}`):"tag:yaml.org,2002:"===t.slice(0,18)?`!!${ke(t.slice(18),!0)}`:`!<${ke(t,!1)}>`}var Me=-1,Ae={filename:"",schema:te,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function qe(e){return"tagStart"in e&&e.tagStart!==Me?e.tagStart:"anchorStart"in e&&e.anchorStart!==Me?e.anchorStart:"valueStart"in e&&e.valueStart!==Me?e.valueStart:"start"in e?e.start:0}function Ee(e,t){le.throwAt(e.source,e.position,t,e.filename)}function Te(e,t,i,o){try{return i.finalize(o)}catch(i){if(i instanceof le)throw i;le.throwAt(e.source,t,i instanceof Error?i.message:String(i),e.filename)}}function Le(e,t){const i=function(e,t){if(-1===t.valueStart)return"";const{valueStart:i,valueEnd:o}=t;if(t.fast)return e.slice(i,o);switch(t.style){case 2:return function(e,t,i){let o="",n=t,a=t,s=t;for(;n<i;){const t=e.charCodeAt(n);if(39===t)o+=e.slice(a,n)+"'",n+=2,a=s=n;else if(10===t||13===t){o+=e.slice(a,s);const t=ge(e,n,i);o+=fe(t.breaks),n=a=s=t.position}else n++,32!==t&&9!==t&&(s=n)}return o+e.slice(a,i)}(e,i,o);case 3:return function(e,t,i){let o="",n=t,a=t,s=t;for(;n<i;){const t=e.charCodeAt(n);if(92===t){o+=e.slice(a,n),n++;const t=e.charCodeAt(n);if(10===t||13===t)n=ge(e,n,i).position;else if(t<256&&de[t])o+=he[t],n++;else{let i=me(t),a=0;for(;i>0;i--)n++,a=(a<<4)+pe(e.charCodeAt(n));o+=ue(a),n++}a=s=n}else if(10===t||13===t){o+=e.slice(a,s);const t=ge(e,n,i);o+=fe(t.breaks),n=a=s=t.position}else n++,32!==t&&9!==t&&(s=n)}return o+e.slice(a,i)}(e,i,o);case 4:return ve(e,i,o,t.indent,t.chomping,!1);case 5:return ve(e,i,o,t.indent,t.chomping,!0);default:return function(e,t,i){let o="",n=t,a=t,s=t;for(;n<i;){const t=e.charCodeAt(n);if(10===t||13===t){o+=e.slice(a,s);const t=ge(e,n,i);o+=fe(t.breaks),n=a=s=t.position}else n++,32!==t&&9!==t&&(s=n)}return o+e.slice(a,s)}(e,i,o)}}(e.source,t),n=t.tagStart===Me?"":e.source.slice(t.tagStart,t.tagEnd),a=e.schema.defaultScalarTag;if(""!==n){if("!"===n)return{value:i,tag:a};const t=Ce(n,e.tagHandlers),s=e.schema.lookupScalarTag(t);if(s){const n=s.resolve(i,!0,t);return n===o&&Ee(e,`cannot resolve a node with !<${t}> explicit tag`),{value:n,tag:s}}const r=e.schema.lookupMappingTag(t)??e.schema.lookupSequenceTag(t);if(r){""!==i&&Ee(e,`cannot resolve a node with !<${t}> explicit tag`);const o=r.create(t);return{value:r.carrierIsResult?o:Te(e,e.position,r,o),tag:r}}Ee(e,`unknown scalar tag !<${t}>`)}return 1===t.style?e.schema.resolveImplicitScalarTag(i):{value:a.resolve(i,!1,a.tagName),tag:a}}function ze(e,t,i){const o=t.tagStart===Me?"":e.source.slice(t.tagStart,t.tagEnd);return""===o||"!"===o?i:Ce(o,e.tagHandlers)}function je(e){return"mapping"===e.nodeKind}function Re(e){e.totalMergeKeys++,-1!==e.maxTotalMergeKeys&&e.totalMergeKeys>e.maxTotalMergeKeys&&Ee(e,`merge keys exceeded maxTotalMergeKeys (${e.maxTotalMergeKeys})`)}function Oe(e,t,i,o){Re(e);for(const n of o.keys(i)){if(Re(e),t.tag.has(t.value,n))continue;const a=t.tag.addPair(t.value,n,o.get(i,n));a&&Ee(e,a),t.overridable??=new Set,t.overridable.add(n)}}function Pe(e,t,i){const o=e.frames[e.frames.length-1];if("document"===o.kind)o.value=t,o.hasValue=!0;else if("sequence"===o.kind){je(i)&&e.nodeTags.set(t,i);const n=o.tag.addItem(o.value,t,o.index++);n&&Ee(e,n)}else if(o.hasKey){const n=o.key;o.key=void 0,o.hasKey=!1,function(e,t,i,o,n){if(e.position=t.keyPosition,t.keyIsMerge)return void function(e,t,i,o){if(e.position=t.keyPosition,je(o))Oe(e,t,i,o);else if("sequence"===o.nodeKind&&Array.isArray(i)){i.length>100&&Ee(e,"abnormal merge sequence size");for(const o of i){const i=e.nodeTags.get(o);i||Ee(e,"cannot merge mappings; the provided source object is unacceptable"),Oe(e,t,o,i)}}else Ee(e,"cannot merge mappings; the provided source object is unacceptable")}(e,t,o,n);e.json||!t.tag.has(t.value,i)||t.overridable?.has(i)||Ee(e,"duplicated mapping key");const a=t.tag.addPair(t.value,i,o);a&&Ee(e,a),t.overridable?.delete(i)}(e,o,n,t,i)}else o.key=t,o.keyPosition=e.position,o.hasKey=!0,o.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function He(e,t,i,o,n){if(t.anchorStart!==Me){const a={value:i,tag:o,isValueFinal:n};return e.anchors.set(e.source.slice(t.anchorStart,t.anchorEnd),a),a}return null}var De=-1,Ie=Object.prototype.hasOwnProperty,Fe=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Ve=/[,\[\]{}]/,Ne=/^(?:!|!!|![0-9A-Za-z-]+!)$/,Ze=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Be=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,We=new RegExp(`^(?:${Ze})*$`),Ke=new RegExp(`^(?:${Be})+$`),Ue=new RegExp(`^(?:!(?:${Ze})*|${Be}(?:${Ze})*)$`),Ge={filename:"",maxDepth:100};function Ye(e,t,i,o,n,a,s){e.events.push({type:2,start:t,anchorStart:i,anchorEnd:o,tagStart:n,tagEnd:a,style:s})}function Qe(e,t,i,o,n,a,s){e.events.push({type:3,start:t,anchorStart:i,anchorEnd:o,tagStart:n,tagEnd:a,style:s})}function Je(e,t){e.events.splice(t.eventsLength,0,{type:3,start:t.position,anchorStart:De,anchorEnd:De,tagStart:De,tagEnd:De,style:2})}function Xe(e,t,i,o,n,a,s,r,l=1,c=-1,d=!1){e.events.push({type:4,valueStart:t,valueEnd:i,anchorStart:o,anchorEnd:n,tagStart:a,tagEnd:s,style:r,chomping:l,indent:c,fast:d})}function et(e){e.events.push({type:6})}function tt(e){Xe(e,De,De,De,De,De,De,1)}function it(){return{anchorStart:De,anchorEnd:De,tagStart:De,tagEnd:De}}function ot(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,eventsLength:e.events.length}}function nt(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.events.length=t.eventsLength}function at(e,t){le.throwAt(e.input.slice(0,e.length),e.position,t,e.filename)}function st(e){return 10===e||13===e}function rt(e){return 9===e||32===e}function lt(e){return rt(e)||st(e)}function ct(e){return 0===e||lt(e)}function dt(e){return 44===e||91===e||93===e||123===e||125===e}function ht(e){return e>=48&&e<=57?e-48:-1}function ut(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function pt(e){return 120===e?2:117===e?4:85===e?8:0}function mt(e){return 48===e||97===e||98===e||116===e||9===e||110===e||118===e||102===e||114===e||101===e||32===e||34===e||47===e||92===e||78===e||95===e||76===e||80===e}function gt(e){10===e.input.charCodeAt(e.position)?e.position++:(e.position++,10===e.input.charCodeAt(e.position)&&e.position++),e.line++,e.lineStart=e.position,e.lineIndent=0,e.firstTabInLine=-1}function ft(e,t){let i=0,o=e.input.charCodeAt(e.position),n=e.position===e.lineStart||lt(e.input.charCodeAt(e.position-1));for(;0!==o;){for(;rt(o);)n=!0,9===o&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),o=e.input.charCodeAt(++e.position);if(t&&n&&35===o)do{o=e.input.charCodeAt(++e.position)}while(!st(o)&&0!==o);if(!st(o))break;for(gt(e),i++,n=!0,o=e.input.charCodeAt(e.position);32===o;)e.lineIndent++,o=e.input.charCodeAt(++e.position)}return i}function vt(e,t=e.position){const i=e.input.charCodeAt(t);if((45===i||46===i)&&i===e.input.charCodeAt(t+1)&&i===e.input.charCodeAt(t+2)){const i=e.input.charCodeAt(t+3);return 0===i||lt(i)}return!1}function bt(e){e.position===e.lineStart&&65279===e.input.charCodeAt(e.position)&&(e.position++,e.lineStart=e.position)}function yt(e){if(e.position!==e.lineStart)return!1;if(vt(e))return!0;if(65279!==e.input.charCodeAt(e.position))return!1;const t=ot(e);bt(e),ft(e,!0);const i=e.input.charCodeAt(e.position),o=e.position===e.lineStart&&(37===i||45===i&&vt(e));return nt(e,t),o}function _t(e){let t=e.input.charCodeAt(e.position);for(;0!==t&&!st(t);)t=e.input.charCodeAt(++e.position)}function wt(e,t,i){const o=Fe.exec(e.input.slice(t,i));null!==o&&(e.position=t+o.index+o[0].length-1,at(e,"the stream contains non-printable characters"))}function $t(e,t,i){if(33!==e.input.charCodeAt(e.position))return!1;t.tagStart!==De&&at(e,"duplication of a tag property");const o=e.position;let n=!1,a=!1,s="!",r=e.input.charCodeAt(++e.position);60===r?(n=!0,r=e.input.charCodeAt(++e.position)):33===r&&(a=!0,s="!!",r=e.input.charCodeAt(++e.position));let l,c=e.position;if(n){for(;0!==r&&62!==r;)r=e.input.charCodeAt(++e.position);62!==r&&at(e,"unexpected end of the stream within a verbatim tag"),l=e.input.slice(c,e.position),e.position++}else{for(;!(0===r||lt(r)||i&&dt(r));)33===r&&(a?at(e,"tag suffix cannot contain exclamation marks"):(s=e.input.slice(c-1,e.position+1),Ne.test(s)||at(e,"named tag handle cannot contain such characters"),a=!0,c=e.position+1)),r=e.input.charCodeAt(++e.position);l=e.input.slice(c,e.position),Ve.test(l)&&at(e,"tag suffix cannot contain flow indicator characters")}return l&&!(n?We.test(l):Ke.test(l))&&at(e,`tag name cannot contain such characters: ${l}`),n||"!"===s||"!!"===s||Ie.call(e.tagHandlers,s)||at(e,`undeclared tag handle "${s}"`),t.tagStart=o,t.tagEnd=e.position,!0}function kt(e,t){if(38!==e.input.charCodeAt(e.position))return!1;t.anchorStart!==De&&at(e,"duplication of an anchor property"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!lt(e.input.charCodeAt(e.position))&&!dt(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&at(e,"name of an anchor node must contain at least one character"),t.anchorStart=i,t.anchorEnd=e.position,!0}function xt(e,t){ft(e,!1),e.lineIndent<t&&at(e,"deficient indentation")}function Ct(e,t){const i=e.line;ft(e,!0),(e.line>i&&e.lineIndent<t||-1!==e.firstTabInLine&&e.lineIndent<t)&&at(e,"deficient indentation")}function St(e,t,i){if(-1!==e.firstTabInLine||45!==e.input.charCodeAt(e.position)||!ct(e.input.charCodeAt(e.position+1)))return!1;for(Ye(e,e.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,1);45===e.input.charCodeAt(e.position)&&ct(e.input.charCodeAt(e.position+1));){-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,at(e,"tab characters must not be used in indentation"));const i=e.line;e.position++;const o=ft(e,!0)>0;if(-1!==e.firstTabInLine&&45===e.input.charCodeAt(e.position)&&ct(e.input.charCodeAt(e.position+1))&&at(e,"bad indentation of a sequence entry"),o&&e.lineIndent<=t?tt(e):At(e,t,3,!1,!0),ft(e,!0),e.lineIndent<t||e.position>=e.length)break;e.lineIndent>t&&at(e,"bad indentation of a sequence entry"),e.line===i&&45===e.input.charCodeAt(e.position)&&ct(e.input.charCodeAt(e.position+1))&&at(e,"bad indentation of a sequence entry")}return et(e),!0}function Mt(e,t,i,o){let n=!1,a=!1,s=!1,r=!1;if(-1!==e.firstTabInLine)return!1;let l=e.input.charCodeAt(e.position);for(;0!==l;){n||-1===e.firstTabInLine||(e.position=e.firstTabInLine,at(e,"tab characters must not be used in indentation"));const c=e.input.charCodeAt(e.position+1),d=e.line;if(63!==l&&58!==l||!ct(c)){n&&(tt(e),n=!1);const t=ot(e);if(!At(e,i,2,!1,!0))break;if(e.line===d){for(l=e.input.charCodeAt(e.position);rt(l);)l=e.input.charCodeAt(++e.position);if(58===l)l=e.input.charCodeAt(++e.position),ct(l)||at(e,"a whitespace character is expected after the key-value separator within a block mapping"),s||(e.events.splice(t.eventsLength,0,{type:3,start:t.position,anchorStart:o.anchorStart,anchorEnd:o.anchorEnd,tagStart:o.tagStart,tagEnd:o.tagEnd,style:1}),s=!0),a=!0,n=!1,r=!1;else{if(!a)return o.anchorStart===De&&o.tagStart===De||(nt(e,t),!1);at(e,"expected ':' after a mapping key")}}else{if(!a)return o.anchorStart===De&&o.tagStart===De||(nt(e,t),!1);at(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else s||(Qe(e,e.position,o.anchorStart,o.anchorEnd,o.tagStart,o.tagEnd,1),s=!0),63===l?(n&&tt(e),a=!0,n=!0):(n||(tt(e),a=!0),n=!1),e.position+=1,r=!0;if(At(e,t,4,!0,r)&&(r=!1),n||r&&(tt(e),r=!1),ft(e,!0),l=e.input.charCodeAt(e.position),(e.line===d||e.lineIndent>t)&&0!==l)at(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return!!a&&(n&&tt(e),s&&et(e),!0)}function At(e,t,i,o,n,a=!0){e.depth>=e.maxDepth&&at(e,`nesting exceeded maxDepth (${e.maxDepth})`),e.depth++;let s=1,r=!1,l=!1,c=null;const d=it();let h=4===i||3===i,u=h;const p=h;if(o&&ft(e,!0)&&(r=!0,s=e.lineIndent>t?1:e.lineIndent===t?0:-1),1===s)for(;;){const o=e.input.charCodeAt(e.position),n=ot(e);if(r&&1!==s&&(33===o||38===o))break;if(r&&p&&(d.tagStart!==De||d.anchorStart!==De)&&(33===o||38===o)){const i=ot(e),o=t+1;if(Mt(e,e.position-e.lineStart,o,d)&&3===e.events[i.eventsLength]?.type)return e.depth--,!0;nt(e,i)}if(r&&(33===o&&d.tagStart!==De||38===o&&d.anchorStart!==De))break;if(!$t(e,d,1===i)&&!kt(e,d))break;null===c&&(c=n),ft(e,!0)?(r=!0,u=p,s=e.lineIndent>t?1:e.lineIndent===t?0:-1):u=!1}if(u&&(u=r||n),1===s||4===i){const o=1===i||2===i?t:t+1,n=e.position-e.lineStart;if(1===s)if(u&&(St(e,n,d)||Mt(e,n,o,d))||function(e,t,i){const o=e.input.charCodeAt(e.position),n=123===o,a=e.position;let s=!0;if(91!==o&&123!==o)return!1;const r=n?125:93;for(n?Qe(e,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,2):Ye(e,a,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,2),e.position++;0!==e.input.charCodeAt(e.position);){Ct(e,t);let i=e.input.charCodeAt(e.position);if(i===r)return e.position++,et(e),!0;s?44===i&&at(e,"expected the node content, but found ','"):at(e,"missed comma between flow collection entries");let o=!1,a=!1;63===i&&lt(e.input.charCodeAt(e.position+1))&&(o=a=!0,e.position+=1,Ct(e,t));const l=e.line,c=ot(e),d=At(e,t,1,!1,!0);Ct(e,t),i=e.input.charCodeAt(e.position),(n||a||e.line===l)&&58===i?(o=!0,e.position++,Ct(e,t),n||Je(e,c),d||tt(e),At(e,t,1,!1,!0)||tt(e),Ct(e,t),n||et(e)):n&&o?(d||tt(e),tt(e)):n?tt(e):o&&(Je(e,c),d||tt(e),tt(e),et(e)),i=e.input.charCodeAt(e.position),44===i?(s=!0,e.position++):s=!1}at(e,"unexpected end of the stream within a flow collection")}(e,o,d))l=!0;else{const t=e.input.charCodeAt(e.position);if(null!==c&&a&&p&&!u&&124!==t&&62!==t){const t=ot(e),i=c.position-c.lineStart;nt(e,c),Mt(e,i,o,it())&&3===e.events[t.eventsLength]?.type?l=!0:nt(e,t)}!l&&(h&&function(e,t,i){const o=e.input.charCodeAt(e.position);let n=1,a=-1,s=!1;if(124!==o&&62!==o)return!1;const r=124===o?4:5;for(e.position++;0!==e.input.charCodeAt(e.position);){const i=e.input.charCodeAt(e.position),o=ht(i);if(43===i||45===i)1!==n&&at(e,"repeat of a chomping mode identifier"),n=43===i?3:2,e.position++;else{if(!(o>=0))break;0===o&&at(e,"bad explicit indentation width of a block scalar; it cannot be less than one"),s&&at(e,"repeat of an indentation width identifier"),a=t+o-1,s=!0,e.position++}}let l=!1;for(;rt(e.input.charCodeAt(e.position));)l=!0,e.position++;l&&35===e.input.charCodeAt(e.position)&&_t(e),st(e.input.charCodeAt(e.position))?gt(e):0!==e.input.charCodeAt(e.position)&&at(e,"a line break is expected");let c=s?a:-1,d=0;const h=e.position;let u=e.position;for(;0!==e.input.charCodeAt(e.position);){const i=e.position;let o=0;for(;32===e.input.charCodeAt(i+o);)o++;const n=e.input.charCodeAt(i+o);if(0===n){c>=0?o>c&&(u=i+o):o>0&&(u=i+o);break}if(yt(e))break;if(!s&&-1===c&&st(n)&&(d=Math.max(d,o)),s||-1!==c||st(n)||(9===n&&o<t&&(e.position=i+o,at(e,"tab characters must not be used in indentation")),o>=t&&o<d&&(e.position=i+o,at(e,"bad indentation of a mapping entry"))),-1===c&&0!==n&&!st(n)&&o<t){e.lineIndent=o,e.position=i+o;break}s||0===n||st(n)||-1!==c||(c=o);const a=-1===c?t+1:c;if(0!==n&&!st(n)&&o<a){e.lineIndent=o,e.position=i+o;break}_t(e),u=e.position,st(e.input.charCodeAt(e.position))&&(gt(e),u=e.position)}return wt(e,h,u),Xe(e,h,u,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,n,c),!0}(e,o,d)||function(e,t,i){if(39!==e.input.charCodeAt(e.position))return!1;e.position++;const o=e.position;let n=!0;for(;0!==e.input.charCodeAt(e.position);){const a=e.input.charCodeAt(e.position);if(39===a){if(39===e.input.charCodeAt(e.position+1)){n=!1,e.position+=2;continue}const t=e.position;return e.position++,Xe(e,o,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,2,1,-1,n),!0}st(a)?(n=!1,xt(e,t)):e.position===e.lineStart&&vt(e)?at(e,"unexpected end of the document within a single quoted scalar"):9!==a&&a<32?at(e,"expected valid JSON character"):e.position++}at(e,"unexpected end of the stream within a single quoted scalar")}(e,o,d)||function(e,t,i){if(34!==e.input.charCodeAt(e.position))return!1;e.position++;const o=e.position;let n=!0;for(;0!==e.input.charCodeAt(e.position);){const a=e.input.charCodeAt(e.position);if(34===a){const t=e.position;return e.position++,Xe(e,o,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,3,1,-1,n),!0}if(92===a){n=!1;const i=e.input.charCodeAt(++e.position);if(st(i))xt(e,t);else if(mt(i))e.position++;else{let t=pt(i);for(0===t&&at(e,"unknown escape sequence");t-- >0;)e.position++,ut(e.input.charCodeAt(e.position))<0&&at(e,"expected hexadecimal character");e.position++}}else st(a)?(n=!1,xt(e,t)):e.position===e.lineStart&&vt(e)?at(e,"unexpected end of the document within a double quoted scalar"):9!==a&&a<32?at(e,"expected valid JSON character"):e.position++}at(e,"unexpected end of the stream within a double quoted scalar")}(e,o,d)||function(e,t){if(42!==e.input.charCodeAt(e.position))return!1;t.anchorStart===De&&t.tagStart===De||at(e,"alias node should not have any properties"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!lt(e.input.charCodeAt(e.position))&&!dt(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&at(e,"name of an alias node must contain at least one character"),function(e,t,i){e.events.push({type:5,anchorStart:t,anchorEnd:i})}(e,i,e.position),!0}(e,d)||function(e,t,i,o){if(!function(e,t){const i=e.input.charCodeAt(e.position),o=1===t;if(0===i||lt(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||dt(i))return!1;if(63===i||45===i){const t=e.input.charCodeAt(e.position+1);if(ct(t)||o&&dt(t))return!1}return!0}(e,i))return!1;const n=e.position;let a=e.position,s=e.input.charCodeAt(e.position);const r=1===i;let l=!1;for(;0!==s&&!yt(e);){if(58===s){const t=e.input.charCodeAt(e.position+1);if(ct(t)||r&&dt(t))break}else if(35===s){if(lt(e.input.charCodeAt(e.position-1)))break}else{if(r&&dt(s))break;if(st(s)){const i=e.position,o=e.line,n=e.lineStart,a=e.lineIndent;if(ft(e,!1),e.lineIndent>=t){l=!0,s=e.input.charCodeAt(e.position);continue}e.position=i,e.line=o,e.lineStart=n,e.lineIndent=a;break}}rt(s)||(a=e.position+1),s=e.input.charCodeAt(++e.position)}return a!==n&&(wt(e,n,a),Xe(e,n,a,o.anchorStart,o.anchorEnd,o.tagStart,o.tagEnd,1,1,-1,!l),!0)}(e,o,i,d))&&(l=!0)}else 0===s&&(l=u&&St(e,n,d))}return h=h&&!l,l||d.anchorStart===De&&d.tagStart===De&&!h||(Xe(e,De,De,d.anchorStart,d.anchorEnd,d.tagStart,d.tagEnd,1),l=!0),e.depth--,l||d.anchorStart!==De||d.tagStart!==De}function qt(e){if(e.lineIndent>0||37!==e.input.charCodeAt(e.position))return!1;e.position++;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!lt(e.input.charCodeAt(e.position));)e.position++;const i=e.input.slice(t,e.position),o=[];for(0===i.length&&at(e,"directive name must not be less than one character in length");0!==e.input.charCodeAt(e.position)&&!st(e.input.charCodeAt(e.position));){for(;rt(e.input.charCodeAt(e.position));)e.position++;if(35===e.input.charCodeAt(e.position)||st(e.input.charCodeAt(e.position))||0===e.input.charCodeAt(e.position))break;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!lt(e.input.charCodeAt(e.position));)e.position++;o.push(e.input.slice(t,e.position))}if(st(e.input.charCodeAt(e.position))&&gt(e),"YAML"===i){e.directives.some(e=>"yaml"===e.kind)&&at(e,"duplication of %YAML directive"),1!==o.length&&at(e,"YAML directive accepts exactly one argument");const t=/^([0-9]+)\.([0-9]+)$/.exec(o[0]);null===t&&at(e,"ill-formed argument of the YAML directive"),1!==parseInt(t[1],10)&&at(e,"unacceptable YAML version of the document"),e.directives.push({kind:"yaml",version:o[0]})}else if("TAG"===i){2!==o.length&&at(e,"TAG directive accepts exactly two arguments");const[t,i]=o;Ne.test(t)||at(e,"ill-formed tag handle (first argument) of the TAG directive"),Ie.call(e.tagHandlers,t)&&at(e,`there is a previously declared suffix for "${t}" tag handle`),Ue.test(i)||at(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagHandlers[t]=i,e.directives.push({kind:"tag",handle:t,prefix:i})}return!0}function Et(e){e.directives=[],e.tagHandlers=Object.create(null);let t=!1;for(ft(e,!0);qt(e);)t=!0,ft(e,!0);let i=!1,o=!1,n=!0;if(0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)&&ct(e.input.charCodeAt(e.position+3))){i=!0;const t=e.line;e.position+=3,ft(e,!0),n=e.line>t}else t&&at(e,"directives end mark is expected");const a=e.events.length;if(!i&&e.position===e.lineStart&&46===e.input.charCodeAt(e.position)&&vt(e))return e.position+=3,void ft(e,!0);if(function(e,t){e.events.push({type:1,explicitStart:t,explicitEnd:!1,directives:e.directives})}(e,i),At(e,e.lineIndent-1,4,!1,n,n)||tt(e),ft(e,!0),e.position===e.lineStart&&vt(e)&&(o=46===e.input.charCodeAt(e.position),o)){const t=e.line;e.position+=3,ft(e,!0),e.line===t&&e.position<e.length&&at(e,"end of the stream or a document separator is expected")}const s=e.events[a];1===s?.type&&(s.explicitEnd=o),et(e),!o&&e.position<e.length&&!yt(e)&&at(e,"end of the stream or a document separator is expected")}var Tt={...Ge,...Ae};function Lt(e,t){const i=function(e,t={}){const i={...Tt,...t},o=String(e),n=Object.keys(Ge),a=Object.keys(Ae);return function(e,t){const i={...Ae,...t,events:e,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const e=i.events[i.eventIndex++];switch(i.position=qe(e),e.type){case 1:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const t of e.directives)"tag"===t.kind&&(i.tagHandlers[t.handle]=t.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case 4:{const{value:t,tag:o}=Le(i,e);He(i,e,t,o,!0),Pe(i,t,o);break}case 2:{const t=ze(i,e,"tag:yaml.org,2002:seq"),o=i.schema.lookupSequenceTag(t);o||Ee(i,`unknown sequence tag !<${t}>`);const n=o.create(t),a=He(i,e,n,o,o.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:n,tag:o,anchor:a,index:0});break}case 3:{const t=ze(i,e,"tag:yaml.org,2002:map"),o=i.schema.lookupMappingTag(t);o||Ee(i,`unknown mapping tag !<${t}>`);const n=o.create(t),a=He(i,e,n,o,o.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:n,tag:o,anchor:a,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case 5:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&Ee(i,`aliases exceeded maxAliases (${i.maxAliases})`);const t=i.source.slice(e.anchorStart,e.anchorEnd),o=i.anchors.get(t);o||Ee(i,`unidentified alias "${t}"`),o.isValueFinal||Ee(i,`recursive alias "${t}" is not supported for tag ${o.tag.tagName} because it uses finalize()`),Pe(i,o.value,o.tag);break}case 6:{const e=i.frames.pop();if("mapping"===e.kind&&e.hasKey&&(i.position=e.keyPosition,Ee(i,"incomplete mapping pair in event stream")),"document"===e.kind)i.documents.push(e.value);else{const t=e.tag.carrierIsResult?e.value:Te(i,e.position,e.tag,e.value);e.anchor&&(e.anchor.value=t,e.anchor.isValueFinal=!0),Pe(i,t,e.tag)}break}}}return i.documents}(function(e,t){const i=e.length,o={...Ge,...t,input:`${e}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},n=e.indexOf("\0");for(-1!==n&&le.throwAt(e,n,"null byte is not allowed in input",o.filename);o.position<o.length&&(bt(o),ft(o,!0),!(o.position>=o.length));){const e=o.position;Et(o),o.position===e&&at(o,"can not read a document")}return o.events}(o,U(i,n)),{...U(i,a),source:o})}(e,t);if(0===i.length)throw new le("expected a document, but the input is empty");if(1===i.length)return i[0];throw new le("expected a single document in the stream, but found more")}var zt=Symbol("INVALID");function jt(e){const t=new Set([e.defaultScalarTag,e.defaultSequenceTag,e.defaultMappingTag].filter(e=>void 0!==e)),i=e.implicitScalarTags,o=e.tags.filter(e=>!("scalar"===e.nodeKind&&e.implicit||t.has(e))),n=e.tags.filter(e=>t.has(e));return[...i.map(e=>({tag:e,implicitTag:!0})),...o.map(e=>({tag:e,implicitTag:!1})),...n.map(e=>({tag:e,implicitTag:!0}))]}function Rt(e,t){if(!e.noRefs&&null!==t&&"object"==typeof t){const i=e.refs.get(t);if(i)return void 0===i.anchor&&(i.anchor="ref_"+e.refCounter++),{kind:"alias",anchor:i.anchor}}const i=function(e,t){for(let i=0,o=e.representTypes.length;i<o;i+=1){const{tag:o,implicitTag:n}=e.representTypes[i];if(o.identify(t)){let e;return e=o.matchByTagPrefix?o.representTagName(t):o.tagName,{tag:o,tagName:e,implicitTag:n}}}return null}(e,t);if(!i){if(void 0===t)return zt;if(e.skipInvalid)return zt;throw new le(`unacceptable kind of an object to dump ${Object.prototype.toString.call(t)}`)}const{tag:o,tagName:n,implicitTag:a}=i,s=a?n:Se(n);if("scalar"===o.nodeKind)return{kind:"scalar",tag:s,tagged:!a,style:1,value:o.represent(t)};if("sequence"===o.nodeKind){const i=o.represent(t),n={kind:"sequence",tag:s,tagged:!a,style:1,items:[]};e.noRefs||e.refs.set(t,n);for(let t=0,o=i.length;t<o;t+=1){let o=Rt(e,i[t]);o===zt&&void 0===i[t]&&(o=Rt(e,null)),o!==zt&&n.items.push(o)}return n}const r=o.represent(t),l={kind:"mapping",tag:s,tagged:!a,style:1,items:[]};e.noRefs||e.refs.set(t,l);for(const[t,i]of r){const o=Rt(e,t);if(o===zt)continue;const n=Rt(e,i);n!==zt&&l.items.push({key:o,value:n})}return l}function Ot(e,t,i={}){const o=Rt({representTypes:jt(t),noRefs:i.noRefs??!1,skipInvalid:i.skipInvalid??!1,refs:new Map,refCounter:0},e);return[{contents:o===zt?null:o,directives:[]}]}var Pt=Symbol("visit:break"),Ht=Symbol("visit:skip");function Dt(e,t,i){const o=t(e,i);if(o===Pt)return!0;if(o===Ht)return!1;const n=i.depth+1;switch(e.kind){case"sequence":for(const i of e.items)if(Dt(i,t,{depth:n,parent:e,isKey:!1}))return!0;break;case"mapping":for(const{key:i,value:o}of e.items){if(Dt(i,t,{depth:n,parent:e,isKey:!0}))return!0;if(Dt(o,t,{depth:n,parent:e,isKey:!1}))return!0}}return!1}function It(e,t){for(const i of e)if(i.contents&&Dt(i.contents,t,{depth:0,parent:null,isKey:!1}))return}function Ft(e,t){return!!(e&1<<t)}var Vt={applyQuoteFlowKeysOption:function(e){e.presenterOptions.quoteFlowKeys&&e.isKey&&e.flowOnly&&1===e.style&&(e.style=3)},doubleQuoteForInvisibles:function(e){1===e.style&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=3)},doubleQuoteWhitespaceOnly:function(e){1===e.style&&/^\s+$/.test(e.node.value)&&(e.style=3)},applyForceQuotesOption:function(e){e.presenterOptions.forceQuotes&&(e.isKey||1!==e.style||e.node.tag===e.presenterOptions.schema.defaultScalarTag.tagName&&(e.style=e.node.value.includes("\n")?3:Nt(e)))},tryLongOrMultilineAsBlock:function(e){if(1!==e.style||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!Ft(e.allowedStylesMask,4))return void(i&&(e.style=3));const o=e.presenterOptions.lineWidth;if(-1===o)return void(i&&(e.style=4));const n=Math.max(Math.min(o,40),o-e.shiftOfContent);let a=0,s=!1;for(;a<=t.length;){let e=t.length;const i=t.indexOf("\n",a);-1!==i&&(e=i);const o=t.slice(a,e);if(o.length>n&&" "!==o[0]&&/ [^ \t]/.test(o)&&(s=!0),-1===i)break;a=i+1}s?e.style=5:i&&(e.style=4)},quoteInvalidPlain:function(e){1!==e.style||Ft(e.allowedStylesMask,1)||(e.style=Nt(e))},fallbackToDoubleQuoted:function(e){Ft(e.allowedStylesMask,e.style)||(e.style=3)}};function Nt(e){return"single"===e.presenterOptions.quoteStyle&&Ft(e.allowedStylesMask,2)?2:3}function Zt(e,t){return e|1<<t}var Bt="[ \\t]",Wt="(?:(?!(?:[\\n\\r]|\\uFEFF))[\\x09\\x0A\\x0D\\x20-\\x7E\\x85\\xA0-\\uD7FF\\uE000-\\uFFFD\\u{10000}-\\u{10FFFF}])",Kt=`(?:(?!${Bt})${Wt})`,Ut="[\\x09\\x20-\\uD7FF\\uE000-\\uFFFF\\u{10000}-\\u{10FFFF}]",Gt="[-?:,\\[\\]{}#&*!|>'\"%@`]",Yt=`(?:(?![,\\[\\]{}])${Kt})`,Qt=`(?:(?:(?![:#])${Kt})|:(?=${Kt}))#*`,Jt=`(?:(?:(?![:#])${Yt})|:(?=${Yt}))#*`,Xt=`(?:${Bt}*${Qt})*`,ei=`(?:${Bt}*${Jt})*`,ti=`(?:(?:(?!${Gt})${Kt})|[?:-](?=${Kt}))#*${Xt}`,ii=`(?:(?:(?!${Gt})${Kt})|[?:-](?=${Yt}))#*${ei}`,oi=ti,ni=ii,ai=`${ii}(?:\\n+${Jt}${ei})*`,si=new RegExp(`^(?:${ti}(?:\\n+${Qt}${Xt})*)$`,"u"),ri=new RegExp(`^(?:${ai})$`,"u"),li=new RegExp(`^(?:${oi})$`,"u"),ci=new RegExp(`^(?:${ni})$`,"u"),di=new RegExp(`^(?:${Ut})*$`,"u"),hi=new RegExp(`^(?:${Ut}|\\n)*$`,"u"),ui=new RegExp(`^(?:${Wt}|\\n)*$`,"u"),pi=/^(?:---|\.\.\.)(?=$|[ \t\n\r])/,mi=/^(?:---|\.\.\.)(?=$|[ \t\n\r])/m;function gi(e,t){let i=e.indexOf("\n");if(-1===i)return e;const o=" ".repeat(t);let n=e.slice(0,i);const a=/(\n+)([^\n]*)/g;let s;for(a.lastIndex=i;s=a.exec(e);){const e=s[1].length,t=s[2];n+="\n".repeat(e+1)+o+t}return n}function fi(e,t){const i=" ".repeat(t);let o=0,n="";const a=e.length;for(;o<a;){let t;const s=e.indexOf("\n",o);-1===s?(t=e.slice(o),o=a):(t=e.slice(o,s+1),o=s+1),t.length&&"\n"!==t&&(n+=i),n+=t}return n}function vi(e,t,i){const o=function(e){return/^\n* /.test(e)}(e)?String(i-t):"",n="\n"===e[e.length-1];return`${o}${!n||"\n"!==e[e.length-2]&&"\n"!==e?n?"":"-":"+"}\n`}function bi(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function yi(e){return" "===e||"\t"===e}function _i(e,t){if(""===e||yi(e[0]))return e;const i=/ [^ \t]/g;let o,n,a=0,s=0,r=0,l="";for(;o=i.exec(e);)r=o.index,r-a>t&&(n=s>a?s:r,l+=`\n${e.slice(a,n)}`,a=n+1),s=r;return l+="\n",e.length-a>t&&s>a?l+=`${e.slice(a,s)}\n${e.slice(s+1)}`:l+=e.slice(a),l.slice(1)}var wi=/["\\\x00-\x1F\x7F-\xA0\u2028\u2029\uD800-\uDFFF\uFEFF\uFFFE\uFFFF]/gu;function $i(e){switch(e){case"\0":return"\\0";case"":return"\\a";case"\b":return"\\b";case"\t":return"\\t";case"\n":return"\\n";case"\v":return"\\v";case"\f":return"\\f";case"\r":return"\\r";case"":return"\\e";case'"':return'\\"';case"\\":return"\\\\";case"":return"\\N";case" ":return"\\_";case"\u2028":return"\\L";case"\u2029":return"\\P"}const t=e.charCodeAt(0),i=t.toString(16).toUpperCase();return t<=255?`\\x${"0".repeat(2-i.length)}${i}`:`\\u${"0".repeat(4-i.length)}${i}`}var ki={indent:2,seqNoIndent:!1,seqInlineFirst:!0,lineWidth:80,flowBracketPadding:!1,flowSkipCommaSpace:!1,flowSkipColonSpace:!1,quoteFlowKeys:!1,quoteStyle:"single",forceQuotes:!1,scalarStyleRules:Object.keys(Vt).map(e=>Reflect.get(Vt,e)),tagBeforeAnchor:!1};function xi(e,t){return`\n${" ".repeat(e.indent*t)}`}function Ci(e,t,i,o){let n="";for(let a=0,s=i.items.length;a<s;a+=1){const s=Mi(e,t+1,i.items[a],i,{block:!0,compact:e.seqInlineFirst,isblockseq:!0}).text;o&&""===n||(n+=xi(e,t)),""===s||10===s.charCodeAt(0)?n+="-":n+="- ",n+=s}return n}function Si(e,t,i){return"alias"===t.kind||t.tagged||void 0!==t.anchor||e.indent<2&&i>0}function Mi(e,t,i,o,n){if("alias"===i.kind)return e.openEnded=!1,{text:`*${i.anchor}`,noBody:!1};const{block:a=!1,iskey:s=!1,isblockseq:r=!1}=n;let l=n.compact??!1;const c=void 0!==i.anchor;let d;Si(e,i,t)&&(l=!1);let h=i.tagged;const u=a&&("mapping"===i.kind||"sequence"===i.kind)&&1===i.style&&0!==i.items.length;if("mapping"===i.kind)d=u?function(e,t,i,o){let n="";for(let a=0,s=i.items.length;a<s;a+=1){let s="";o&&""===n||(s+=xi(e,t));const{key:r,value:l}=i.items[a],c=("mapping"===r.kind||"sequence"===r.kind)&&1===r.style&&0!==r.items.length||"scalar"===r.kind&&(4===r.style||5===r.style),d=Mi(e,t+1,r,i,c?{block:!0,compact:!0,isblockseq:!Si(e,r,t+1)}:{block:!0,compact:!0,iskey:!0}),h=d.text,u="scalar"===r.kind&&-1!==r.value.indexOf("\n"),p=h.length>1024&&/^[\s\S]{1025}/u.test(h),m=c||u||p;m&&(h&&10===h.charCodeAt(0)?s+="?":s+="? "),s+=h,m&&(s+=xi(e,t));const g=Mi(e,t+1,l,i,{block:!0,compact:m,isblockseq:m&&!Si(e,l,t+1)}).text,f="scalar"===r.kind&&d.noBody&&(r.tagged||void 0!==r.anchor),v=m||"alias"!==r.kind&&!f?"":" ";""===g||10===g.charCodeAt(0)?s+=`${v}:`:s+=`${v}: `,s+=g,n+=s}return n}(e,t,i,l):function(e,t,i){let o="";for(const{key:n,value:a}of i.items){let s="";""!==o&&(s+=","+(e.flowSkipCommaSpace?"":" "));const r=Mi(e,t,n,i,{iskey:!0}),l=r.text,c=Mi(e,t,a,i,{}).text,d=e.flowSkipColonSpace||""===c?"":" ",h="scalar"===n.kind&&r.noBody&&(n.tagged||void 0!==n.anchor);s+=`${l}${"alias"===n.kind||h?" ":""}:${d}${c}`,o+=s}const n=e.flowBracketPadding&&""!==o?" ":"";return`{${n}${o}${n}}`}(e,t,i);else if("sequence"===i.kind)d=u?e.seqNoIndent&&!r&&t>0?Ci(e,t-1,i,l):Ci(e,t,i,l):function(e,t,i){let o="";for(let n=0,a=i.items.length;n<a;n+=1){const a=Mi(e,t,i.items[n],i,{}).text;n>0&&(o+=","+(e.flowSkipCommaSpace?"":" ")),o+=a}const n=e.flowBracketPadding&&i.items.length>0?" ":"";return`[${n}${o}${n}]`}(e,t,i);else{const n=function(e,t,i,o,n,a){return{node:t,parent:i,level:o,isKey:n,flowOnly:a,shiftOfParent:0===o?-1:e.indent*(o-1),shiftOfContent:e.indent*Math.max(1,o),shiftOfFirstLine:0===o?0:e.indent*o,presenterOptions:e,allowedStylesMask:0,style:t.style}}(e,i,o,t,s,!a);!function(e){let t=Zt(0,3);(function(e){const t=e.node.value;if(""!==t){if(!(e.isKey?e.flowOnly?ci:li:e.flowOnly?ri:si).test(t))return!1;if(0===e.shiftOfFirstLine&&pi.test(t))return!1;if(0===e.shiftOfContent){const e=t.indexOf("\n");if(-1!==e){const i=t.slice(e+1);if(mi.test(i))return!1}}}const i=e.presenterOptions.schema.resolveImplicitScalarTag(t).tag.tagName;return!(!e.node.tagged&&i!==e.node.tag||!e.node.tagged&&"="===t&&i===e.presenterOptions.schema.defaultScalarTag.tagName)})(e)&&(t=Zt(t,1)),function(e){const t=e.node.value;if(!(e.isKey?di:hi).test(t))return!1;if(/[ \t]\n|\n[ \t]/.test(t))return!1;if(!e.isKey&&0===e.shiftOfContent){const e=t.indexOf("\n");if(-1!==e&&mi.test(t.slice(e+1)))return!1}return!0}(e)&&(t=Zt(t,2)),function(e){if(e.flowOnly||!ui.test(e.node.value))return!1;const t=e.shiftOfContent-e.shiftOfParent;return!(t<1||t>9&&/^\n* /.test(e.node.value)||0===e.shiftOfContent&&mi.test(e.node.value))}(e)&&(t=Zt(Zt(t,4),5)),e.allowedStylesMask=t}(n);for(const t of e.scalarStyleRules)t(n);d=function(e){switch(e.style){case 1:return function(e){return gi(e.node.value,e.shiftOfContent)}(e);case 2:return function(e){return`'${gi(e.node.value,e.shiftOfContent).replace(/'/g,"''")}'`}(e);case 4:return function(e){const t=e.node.value;return"|"+vi(t,e.shiftOfParent,e.shiftOfContent)+bi(fi(t,e.shiftOfContent))}(e);case 5:return function(e){const t=e.node.value,i=e.presenterOptions.lineWidth;let o=1/0;return-1!==i&&(o=Math.max(Math.min(i,40),i-e.shiftOfContent)),">"+vi(t,e.shiftOfParent,e.shiftOfContent)+bi(fi(function(e,t){const i=/(\n+)([^\n]*)/g;let o=e.indexOf("\n");-1===o&&(o=e.length),i.lastIndex=o;let n,a,s=_i(e.slice(0,o),t),r="\n"===e[0]||yi(e[0]);for(;a=i.exec(e);){const e=a[1],i=a[2];n=""!==i&&yi(i[0]),s+=e+(r||n||""===i?"":"\n")+_i(i,t),r=n}return s}(t,o),e.shiftOfContent))}(e);case 3:return function(e){return`"${t=e.node.value,t.replace(wi,$i)}"`;var t}(e)}}(n),e.openEnded=(4===n.style||5===n.style)&&("\n"===i.value||i.value.endsWith("\n\n")),h=i.tagged||""===d&&n.flowOnly&&"sequence"===o?.kind&&!c||1!==n.style&&i.tag!==e.defaultScalarTagName}"mapping"!==i.kind&&"sequence"!==i.kind||u||(e.openEnded=!1),u&&l&&t>0&&e.indent>2&&(d=`${" ".repeat(e.indent-2)}${d}`);const p=""===d;let m=d;if(h||c){const t=[],o=h?function(e){return e.tagged?e.tag:Se(e.tag)}(i):null,n=c?`&${i.anchor}`:null;e.tagBeforeAnchor?(null!==o&&t.push(o),null!==n&&t.push(n)):(null!==n&&t.push(n),null!==o&&t.push(o));const a=""===d||10===d.charCodeAt(0)?"":" ";m=`${t.join(" ")}${a}${d}`}return{text:m,noBody:p}}function Ai(e){return("sequence"===e.kind||"mapping"===e.kind)&&1===e.style&&0!==e.items.length&&!e.tagged&&void 0===e.anchor}function qi(e){let t="";for(const i of e.directives){if("yaml"===i.kind){t+=`%YAML ${i.version}\n`;continue}const{handle:e,prefix:o}=i;t+=`%TAG ${e} ${o}\n`}return t}var Ei={...ki,schema:ie,skipInvalid:!1,noRefs:!1,flowLevel:-1,sortKeys:!1,transform:()=>{}};function Ti(e,t){const i=String(e),o=String(t);return i<o?-1:i>o?1:0}function Li(e,t={}){const i={...Ei,...t},o=Ot(e,i.schema,{noRefs:i.noRefs,skipInvalid:i.skipInvalid});if(i.flowLevel>=0&&It(o,(e,t)=>{if(!(t.depth<i.flowLevel))return"sequence"!==e.kind&&"mapping"!==e.kind||(e.style=2),Ht}),i.sortKeys){const e=!0===i.sortKeys?Ti:i.sortKeys;It(o,t=>{"mapping"===t.kind&&t.items.sort((t,i)=>e("scalar"===t.key.kind?t.key.value:"","scalar"===i.key.kind?i.key.value:""))})}return i.transform(o),function(e,t){const i=function(e){const t={...ki,...e};return t.flowSkipColonSpace&&(t.quoteFlowKeys=!0),{...t,defaultScalarTagName:t.schema.defaultScalarTag.tagName,openEnded:!1}}(t);let o="",n=!1;for(let t=0;t<e.length;t+=1){const a=e[t];i.openEnded=!1;const s=qi(a),r=""!==s,l=a.explicitStart||r||t>0&&!n;if(o+=s,null===a.contents)l&&(o+="---\n");else if(l){const e=Mi(i,0,a.contents,null,{block:!0,compact:!0}).text;o+=`---${""===e?"":r||Ai(a.contents)?"\n":" "}${e}\n`}else o+=Mi(i,0,a.contents,null,{block:!0,compact:!0}).text+"\n";n=a.explicitEnd||i.openEnded,n&&(o+="...\n")}return o}(o,{...U(i,Object.keys(ki)),schema:i.schema})}},4765(e,t,i){var o=i(6752);i.d(t,["J",0,e=>e??o.s6])},7217(e,t,i){var o=i(6752),n=i(6201),a=i(7804);class s{}const r=new WeakMap,l=(0,a.u$)(class extends n.Kq{render(e){return o.s6}update(e,[t]){const i=t!==this.G;return i&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),o.s6}rt(e){if(void 0!==this.G)if(this.isConnected||(e=void 0),"function"==typeof this.G){const t=this.ht??globalThis;let i=r.get(t);void 0===i&&(i=new WeakMap,r.set(t,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,e),void 0!==e&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return"function"==typeof this.G?r.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});i.d(t,["K",0,l,"_",0,()=>new s])},2378(e,t,i){var o=i(6752),n=i(7804);const a="important",s=" !"+a,r=(0,n.u$)(class extends n.WL{constructor(e){if(super(e),e.type!==n.OA.ATTRIBUTE||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const o=e[i];return null==o?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const o=t[e];if(null!=o){this.ft.add(e);const t="string"==typeof o&&o.endsWith(s);e.includes("-")||t?i.setProperty(e,t?o.slice(0,-11):o,t?a:""):i[e]=o}}return o.c0}});i.d(t,["W",0,r])},68(e,t,i){i.d(t,{D:()=>a});var o=i(6752),n=i(7804);class a extends n.WL{constructor(e){if(super(e),this.it=o.s6,e.type!==n.OA.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===o.s6||null==e)return this._t=void 0,this.it=e;if(e===o.c0)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}a.directiveName="unsafeHTML",a.resultType=1;const s=(0,n.u$)(a);i.d(t,["_",0,s])},5707(e,t,i){i.d(t,{EM:()=>o.E,MZ:()=>n.M,wk:()=>a.w});var o=i(6505),n=i(5694),a=i(4290)},1413(e,t,i){i.d(t,{J:()=>o.J});var o=i(4765)},4489(e,t,i){i.d(t,{K:()=>o.K,_:()=>o._});var o=i(7217)},754(e,t,i){i.d(t,{W:()=>o.W});var o=i(2378)},5276(e,t,i){i.d(t,{_:()=>o._});var o=i(68)}};