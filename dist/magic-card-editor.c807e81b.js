"use strict";export const __webpack_esm_ids__=[8];export const __webpack_esm_modules__={4204(e,t,i){const n=["tube","cable","neon","zigzag"],o=["dot","arrow","chevron","square","diamond","star","comet","spark","bubble","drop","icon"],s=["even","pixels","random"],a=e=>{const t="string"==typeof e&&e.trim()?Number(e):e;return"number"==typeof t&&Number.isFinite(t)?t:void 0};i.d(t,["Rk",0,e=>{const t=e;if(n.includes(t.line_style))return!0;const i=s.includes(t.spacing_mode)?t.spacing_mode:void 0!==t.spacing?"pixels":"even",r=a(t.dots);if("pulse"===t.motion||!("even"!==i||void 0===r||Math.round(r)>0))return!1;const l=t.shape_alternate;return"random"===t.spacing_mode||(a(t.size_variation)??0)>0||"string"==typeof l&&o.includes(l)},"UO",0,a,"cb",0,o,"rz",0,s])},4191(e,t,i){i.d(t,["Ne",0,"mc-slider-look-editor","_6",0,"mc-flow-look-editor","o9",0,["color","idle_color","width","scale_width","glow","dots","dot_size"],"v4",0,["slider_color","track_color"]])},2061(e,t,i){i.d(t,{S8:()=>n.S});var n=i(8726);Object.freeze({path:"",viewBox:"0 0 24 24"}),i.d(t,["dD",0,{iconsList:"magic_card_utils/icons_list",iconsGet:"magic_card_utils/icons_get",iconsSave:"magic_card_utils/icons_save",iconsDelete:"magic_card_utils/icons_delete",shapesList:"magic_card_utils/shapes_list",shapesSave:"magic_card_utils/shapes_save",shapesDelete:"magic_card_utils/shapes_delete",themePresetsList:"magic_card_utils/theme_presets_list",themePresetsSave:"magic_card_utils/theme_presets_save",themePresetsDelete:"magic_card_utils/theme_presets_delete",subscribe:"magic_card_utils/subscribe_library"},"yK",0,/^[a-z0-9][a-z0-9_-]{0,63}$/])},2797(e,t,i){i.d(t,{V:()=>c,_t:()=>o,wT:()=>m});const n=/(?:\b[a-z][a-z0-9+.-]*:\/\/|(?:^|[\s,("'])\/\/[^\s/)"'])/i;function o(e){return e.replace(/\\([0-9a-f]{1,6})[ \t\n\r\f]?|\\([\s\S])/gi,(e,t,i)=>{if(void 0===t)return i??"";const n=parseInt(t,16);return n>0&&n<=1114111&&(n<55296||n>57343)?String.fromCodePoint(n):"�"})}const s=/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s"'()]*))\s*\)|"([^"]*)"|'([^']*)'/gi,a=/[^\x21-\x7e]/,r=["https://invalid.invalid","http://invalid.invalid"],l=String.fromCharCode(92);function c(e){if(e.includes(l)||e.includes("/*"))return{hosts:[],unknown:!0};const t=new Set;let i=!1;const n=e.replace(s,(e,n,o,s,l,c)=>{const d=n??o??s??l??c??"";/[\n\r\f()]/.test(d)&&(i=!0);for(const e of r)try{const n=new URL(d,e);if("data:"===n.protocol&&/^\s*data:image\/(?!svg)/i.test(d))continue;if("invalid.invalid"===n.hostname)continue;"https:"!==n.protocol&&"http:"!==n.protocol||!n.hostname||a.test(n.hostname)?i=!0:t.add(n.hostname)}catch{i=!0}return" "});return/[:/]/.test(n)&&(i=!0),{hosts:[...t],unknown:i}}const d=/\burl\(\s*(?:"([^"\s()\\]*)"|'([^'\s()\\]*)'|([^"'\s()\\]*))\s*\)/gi,h=/^(?:\/local\/[\w\-./%~+=@,]*|#[\w-]+)$/,u=/\burl\(|(?:^|[^a-z0-9-])(?:-webkit-)?(?:image-set|image|src|cross-fade|element)\(|@import/i,p=/"[^"\\:/]*"|'[^'\\:/]*'/g;function m(e,t){if(void 0!==t&&g.test(t))return!0;if(e.length>4096||e.includes("\\")||e.includes("/*"))return!0;if(n.test(e)||/(?:^|[^a-z0-9+.-])(?:https?|wss?|ftp):/i.test(e))return!0;const i=e.replace(d,(e,t,i,n)=>{const o=t??i??n??"";return!h.test(o)||o.includes("//")||o.includes("..")?e:" "});return!!u.test(i)||/["']/.test(i.replace(p," "))}const g=/^card-mod-/i;i.d(t,["Iz",0,"transfer","Lz",0,"magic_card_export","Pu",0,1e6,"XH",0,1048576,"XW",0,1048576,"Y",0,"mc-library-open","Y9",0,g,"Z$",0,2097152,"bi",0,[[31,139],[80,75,3,4],[80,75,5,6],[80,75,7,8],[206,178,207,129],[40,181,47,253]],"hl",0,{"card-editor":["animation","shape","icon","card"],"shape-editor":["shape"],"svg-editor":["icon"],"animation-studio":["animation"],"theme-editor":["theme"],"mcu-panel":["icon","shape","image","animation","theme"]}])},3034(e,t,i){i.d(t,["KV",0,"#ff9800","sh",0,"mc-svg-editor","ty",0,"#44739e","zh",0,"mc-shape-studio"])},5239(e,t,i){const n=8388608,o=Object.freeze({kind:"svg",extensions:Object.freeze([".svg"]),mimeTypes:Object.freeze(["image/svg+xml"])}),s=Object.freeze({types:Object.freeze([Object.freeze({...o,maxBytes:32768})])}),a=Object.freeze({types:Object.freeze([Object.freeze({...o,maxBytes:n})])});i.d(t,["Ie",0,s,"Kg",0,a,"tq",0,n])},6020(e,t,i){i.d(t,["QK",0,"mc-panels:","Sw",0,{"card-studio":["layers","inspector"],"anim-studio":["layers","inspector"],"svg-editor":["side","inspector"],"shape-studio":["side","inspector"],"theme-editor":["variables"]},"UV",0,"mc-panels-hint:","V8",0,"mc-panels-change","vr",0,"data-mc-lips"])},6837(e,t,i){i.d(t,["KB",0,"mc-ui-popover","Mo",0,"mc-ui-disclosure","P8",0,"mc-ui-window","XQ",0,"mc-ui-tile-group","a6",0,"mc-ui-toast","eG",0,"mc-ui-menu","i3",0,"mc-dir-change","zn",0,"mc-ui-chip-group"])},6796(e,t,i){var n=i(6161),o=i(5707),s=i(105),a=i(158),r=i(9788),l=i(9100),c=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let d=class extends n.WF{constructor(){super(...arguments),this.value="",this.entityId="",this.extras=[],this._windowCtrl=new r.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery="",this._selectedAttribute=""}_openModal(){this._selectedAttribute=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_handleSave(){this.value=this._selectedAttribute,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedAttribute},bubbles:!0,composed:!0})),this._closeModal()}_selectAttribute(e){this._selectedAttribute=e}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getAttributes(){if(!this.hass||!this.entityId)return[];const e=this.hass.states[this.entityId];return e?Object.entries(e.attributes).map(([e,t])=>({name:e,value:String(t??"")})).filter(e=>{if(!this._searchQuery)return!0;const t=this._searchQuery.toLowerCase();return e.name.toLowerCase().includes(t)||e.value.toLowerCase().includes(t)}).sort((e,t)=>e.name.localeCompare(t.name)):[]}_getAttributeValue(){if(!this.hass||!this.entityId||!this.value)return null;const e=this.hass.states[this.entityId];if(!e)return null;const t=e.attributes[this.value];return void 0!==t?String(t):null}render(){const e=this.hass&&this.entityId?this.hass.states[this.entityId]:void 0,t=e?Object.keys(e.attributes).filter(e=>!this.extras.some(t=>t.value===e)).sort((e,t)=>e.localeCompare(t)):[];if(!t.length&&!this.extras.length)return n.qy`
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder=${(0,l.t)(1216)}
          aria-label=${(0,l.t)(105)}
          spellcheck="false"
          @input=${this._onInputChange}
        />
        ${this._showModal?this._renderModal():""}
      `;const i=!this.value||t.includes(this.value)||(e=>this.extras.some(t=>t.value===e))(this.value)?t:[this.value,...t];return n.qy`
      <div class="select">
        <select
          class="input"
          aria-label=${(0,l.t)(105)}
          .value=${this.value}
          @change=${e=>{this._onInputChange(e)}}
        >
          <option value="" ?selected=${!this.value}>${(0,l.t)(1002)}</option>
          ${this.extras.map(e=>n.qy`<option value=${e.value} ?selected=${e.value===this.value}>${e.label}</option>`)}
          ${i.map(e=>n.qy`<option value=${e} ?selected=${e===this.value}>${e}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getAttributes();return n.qy`
      ${(0,r.bU)((0,l.t)(893),()=>this._closeModal(),"s",n.qy`
          <div class="mc-picker-search">
            ${(0,r.LW)((0,l.t)(875),this._searchQuery,e=>{this._searchQuery=e})}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${(0,l.t)(106)}>
            ${e.length>0?e.map(e=>n.qy`
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
                `):n.qy`<div class="mc-picker-empty">${(0,l.t)(632)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,l.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${(0,l.t)(865)}</button>
          </div>
      `)}
    `}};d.styles=[a.x,s.fz],c([(0,o.MZ)({attribute:!1})],d.prototype,"hass",void 0),c([(0,o.MZ)({type:String})],d.prototype,"value",void 0),c([(0,o.MZ)({type:String})],d.prototype,"entityId",void 0),c([(0,o.MZ)({attribute:!1})],d.prototype,"extras",void 0),c([(0,o.wk)()],d.prototype,"_showModal",void 0),c([(0,o.wk)()],d.prototype,"_searchQuery",void 0),c([(0,o.wk)()],d.prototype,"_selectedAttribute",void 0),d=c([(0,o.EM)("mc-attribute-picker")],d)},2377(e,t,i){var n=i(6161),o=i(5707),s=i(158),a=(i(7106),i(7681),i(9100)),r=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const l=["top","right","bottom","left"],c=["px","em","rem","%","vw","vh"],d={top:{label:1109,icon:"mdi:border-top-variant"},right:{label:838,icon:"mdi:border-right-variant"},bottom:{label:142,icon:"mdi:border-bottom-variant"},left:{label:516,icon:"mdi:border-left-variant"}},h={top:{label:1110,icon:"mdi:border-top-variant"},right:{label:1111,icon:"mdi:border-right-variant"},bottom:{label:144,icon:"mdi:border-bottom-variant"},left:{label:143,icon:"mdi:border-left-variant"}};function u(e){const[t,i=t,n=t,o=i]=function(e){const t=[];let i=0,n="";for(const o of e.slice(0,256).trim())"("===o?i++:")"===o&&(i=Math.max(0,i-1)),/\s/.test(o)&&0===i?(n&&t.push(n),n=""):n+=o;return n&&t.push(n),t.reduce((e,t)=>/^\d+(?:\.\d+)?%$/.test(t)&&"entity"===e[e.length-1]?[...e.slice(0,-1),`entity ${t}`]:[...e,t],[])}(e).slice(0,4);return void 0===t?void 0:{top:t,right:i,bottom:n,left:o}}const p={length:"0",style:"none",color:"currentcolor"};let m=class extends n.WF{constructor(){super(...arguments),this.design={},this.baseName="padding",this.shorthand=!1,this.value="",this.label="",this.cell="length",this.corners=!1,this.units=c,this.options=[],this.inherited="",this.entity=!1,this.entityColor="",this._linked=!1}willUpdate(e){if(e.has("design")&&this._linked){const e=this._getValue("top");l.some(t=>this._getValue(t)!==e)&&(this._linked=!1)}}_getSuffixKey(e,t){return e?"border_radius"===e&&{top:"border_top_left_radius",right:"border_top_right_radius",bottom:"border_bottom_right_radius",left:"border_bottom_left_radius"}[t]||`${e}_${t}`:t}_shorthandSides(){const e=String(this.design[this.baseName]??"").trim();if(!e)return;const[t,i=t,n=t,o=i]=e.split(/\s+/);return{top:t,right:i,bottom:n,left:o}}_getValue(e){const t=this._shorthandSides();if(t)return t[e];const i=this.design[this._getSuffixKey(this.baseName,e)];return null==i?"":String(i)}_emitSides(e){const t=this.baseName?{[this.baseName]:void 0}:{},i=this._shorthandSides();for(const n of l)void 0!==e[n]?t[this._getSuffixKey(this.baseName,n)]=e[n]:i?.[n]&&(t[this._getSuffixKey(this.baseName,n)]=i[n]);this.onChange(t)}_handleSideChange(e,t){this._linked?this._emitSides({top:t,right:t,bottom:t,left:t}):this._emitSides({[e]:t})}get _sh(){return u(this.value)}get _shLinked(){const e=this._sh;return(!e||e.top===e.right&&e.right===e.bottom&&e.bottom===e.left)&&(this._link??!0)}_shEmit(e){if(l.every(t=>!e[t]))return void this.onChange({[this.baseName]:void 0});const t=u(this.inherited),i=i=>e[i]||t?.[i]||p[this.cell];var n;this.onChange({[this.baseName]:(n={top:i("top"),right:i("right"),bottom:i("bottom"),left:i("left")},n.left===n.right?n.top===n.bottom?n.top===n.right?n.top:`${n.top} ${n.right}`:`${n.top} ${n.right} ${n.bottom}`:`${n.top} ${n.right} ${n.bottom} ${n.left}`)})}_shSide(e,t){"all"===e||this._shLinked?this._shEmit({top:t,right:t,bottom:t,left:t}):this._shEmit({...this._sh??{top:"",right:"",bottom:"",left:""},[e]:t})}_shToggle(){if(this._shLinked)return void(this._link=!1);this._link=!0;const e=this._sh?.top??"";this._shEmit({top:e,right:e,bottom:e,left:e})}_renderCell(e,t,i){const o=this._sh?.[e]??"",s=u(this.inherited)?.[e]??"",r=e=>this._shSide(t,e);if("color"===this.cell)return n.qy`<mc-color-picker data-side=${t} .value=${o} .label=${i} .placeholder=${o?"":s} .allowEntity=${this.entity} .entityColor=${this.entityColor} @value-changed=${e=>{e.stopPropagation(),r(String(e.detail.value??""))}}></mc-color-picker>`;if("style"===this.cell){const e=this.options.find(e=>e.value===s)?.label??s,l=o&&!this.options.some(e=>e.value===o)?[{value:o,label:o}]:[];return n.qy`<div class="select">
        <select class="input side-select" data-side=${t} aria-label=${i} @change=${e=>r(e.target.value)}>
          <option value="" ?selected=${!o}>${s?(0,a.t)(490,{value:e}):(0,a.t)(667)}</option>
          ${[...this.options,...l].map(e=>n.qy`<option value=${e.value} ?selected=${e.value===o}>${e.label}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>`}return n.qy`<mc-unit-field
      compact
      data-side=${t}
      .inputId=${`side-${t}`}
      .label=${i}
      .units=${this.units}
      .value=${o}
      .placeholder=${s.match(/^-?\d*\.?\d+/)?.[0]??"0"}
      @value-changed=${e=>{e.stopPropagation(),r(String(e.detail.value??""))}}
    ></mc-unit-field>`}_toggleLink(){if(this.shorthand)return void this._shToggle();if(this._linked=!this._linked,!this._linked)return;const e=this._getValue("top");e&&l.some(t=>this._getValue(t)!==e)&&this._emitSides({top:e,right:e,bottom:e,left:e})}_renderSide(e){const t="border_radius"===this.baseName||this.corners?h[e]:d[e],i=(0,a.t)(t.label),o=this._linked?"top":e;return n.qy`
      <div class="box-side">
        <span class="box-side-label" @click=${()=>this.renderRoot.querySelector(`[data-side="${e}"]`)?.focus()}>
          <ha-icon icon=${t.icon}></ha-icon>${i}
        </span>
        ${this.shorthand?this._renderCell(e,e,i):n.qy`<mc-unit-field
          compact
          data-side=${e}
          .inputId=${`side-${e}`}
          .label=${i}
          .units=${c}
          .value=${this._getValue(o)}
          @value-changed=${t=>{t.stopPropagation(),this._handleSideChange(e,String(t.detail.value??""))}}
        ></mc-unit-field>`}
      </div>
    `}render(){const e=this.shorthand&&this._shLinked,t=!e&&!!this.label;return n.qy`
      <div class="box" role=${t?"group":n.s6} aria-labelledby=${t?"box-label":n.s6}>
        ${t?n.qy`<span class="box-label" id="box-label">${this.label}</span>`:n.s6}
        ${e?this._renderCell("top","all",this.label):n.qy`<div class="box-grid ${this.shorthand&&"length"!==this.cell?"one-col":""}">${l.map(e=>this._renderSide(e))}</div>`}
        <div class="box-foot">
          <button
            type="button"
            class="btn btn-text btn-sm"
            aria-pressed=${(this.shorthand?this._shLinked:this._linked)?"true":"false"}
            @click=${this._toggleLink}
          >
            <ha-icon icon="mdi:link-variant"></ha-icon>${(0,a.t)(864)}
          </button>
        </div>
      </div>
    `}};m.styles=[s.x,n.AH`
      :host {
        display: block;
        min-width: 0;
        container-type: inline-size;
      }
      .box {
        display: grid;
        gap: 8px;
      }
      .box-label {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
      /* The sides sit where their names say, so the grid reads left to right in any direction */
      .box-grid {
        direction: ltr;
      }
      .box-side-label {
        unicode-bidi: plaintext;
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
    `],r([(0,o.MZ)({attribute:!1})],m.prototype,"design",void 0),r([(0,o.MZ)({attribute:!1})],m.prototype,"onChange",void 0),r([(0,o.MZ)({type:String})],m.prototype,"baseName",void 0),r([(0,o.MZ)({type:Boolean})],m.prototype,"shorthand",void 0),r([(0,o.MZ)({type:String})],m.prototype,"value",void 0),r([(0,o.MZ)({type:String})],m.prototype,"label",void 0),r([(0,o.MZ)({type:String})],m.prototype,"cell",void 0),r([(0,o.MZ)({type:Boolean})],m.prototype,"corners",void 0),r([(0,o.MZ)({attribute:!1})],m.prototype,"units",void 0),r([(0,o.MZ)({attribute:!1})],m.prototype,"options",void 0),r([(0,o.MZ)({type:String})],m.prototype,"inherited",void 0),r([(0,o.MZ)({type:Boolean})],m.prototype,"entity",void 0),r([(0,o.MZ)({type:String})],m.prototype,"entityColor",void 0),r([(0,o.wk)()],m.prototype,"_linked",void 0),r([(0,o.wk)()],m.prototype,"_link",void 0),m=r([(0,o.EM)("mc-box-field")],m)},7681(e,t,i){var n=i(6161),o=i(5707),s=i(105),a=i(158),r=i(9788),l=i(9793),c=i(6990),d=i(9748),h=i(851),u=i(5115);const p=["HEXA","RGBA","HSLA","OKLCH"],m=/^(\d+(?:\.\d+)?|\.\d+)(%|deg)?$/,g=/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/,f=/^(rgba?|hsla?|oklch)\(([^()]*)\)$/,v=(e,t,i)=>Math.min(i,Math.max(t,e));function b(e){const t=e.trim().toLowerCase();if(!t||t.length>80)return null;const i=g.exec(t);if(i){let e=i[1];e.length<=4&&(e=[...e].map(e=>e+e).join(""));const t=t=>parseInt(e.slice(t,t+2),16);return{r:t(0),g:t(2),b:t(4),a:8===e.length?t(6)/255:1,wide:!1}}const n=f.exec(t);if(!n)return null;const o=function(e){const t=e.trim().split(/[\s,/]+/);if(t.length<3||t.length>4)return null;const i=[];for(const e of t){const t=m.exec(e);if(!t)return null;i.push({n:Number(t[1]),unit:t[2]??""})}return i}(n[2]);if(!o)return null;const s=(a=o[3])?v("%"===a.unit?a.n/100:a.n,0,1):1;var a;if(n[1].startsWith("rgb")){const e=e=>v("%"===e.unit?2.55*e.n:e.n,0,255);return{r:e(o[0]),g:e(o[1]),b:e(o[2]),a:s,wide:!1}}if(n[1].startsWith("hsl")){const[e,t,i]=function(e,t,i){const n=t=>(t+e/30)%12,o=t*Math.min(i,1-i);return[0,8,4].map(e=>255*(i-o*Math.max(-1,Math.min(n(e)-3,Math.min(9-n(e),1)))))}(o[0].n%360,v(o[1].n,0,100)/100,v(o[2].n,0,100)/100);return{r:e,g:t,b:i,a:s,wide:!1}}const{rgb:r,wide:l}=function(e,t,i){const n=t*Math.cos(i*Math.PI/180),o=t*Math.sin(i*Math.PI/180),s=(e+.3963377774*n+.2158037573*o)**3,a=(e-.1055613458*n-.0638541728*o)**3,r=(e-.0894841775*n-1.291485548*o)**3,l=[4.0767416621*s-3.3077115913*a+.2309699292*r,-1.2684380046*s+2.6097574011*a-.3413193965*r,-.0041960863*s-.7034186147*a+1.707614701*r],c=l.some(e=>e<-5e-4||e>1.0005);return{rgb:l.map(e=>255*v((e=>e<=.0031308?12.92*e:1.055*e**(1/2.4)-.055)(e),0,1)),wide:c}}(v("%"===o[0].unit?o[0].n/100:o[0].n,0,1),"%"===o[1].unit?.4*o[1].n/100:o[1].n,o[2].n%360);return{r:r[0],g:r[1],b:r[2],a:s,wide:l}}const y=(e,t)=>String(+e.toFixed(t));i(7106);var _=i(9100),w=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const $="magic-card-saved-colors",x=["#ffffff","#f3f4f6","#d1d5db","#9ca3af","#6b7280","#374151","#1f2937","#000000","#ef4444","#f97316","#eab308","#22c55e","#14b8a6","#3b82f6","#8b5cf6","#ec4899","#fecaca","#fed7aa","#fef08a","#bbf7d0","#99f6e4","#bfdbfe","#ddd6fe","#fbcfe8","var(--primary-color)","var(--accent-color)","var(--primary-text-color)","var(--secondary-text-color)","var(--card-background-color)","var(--divider-color)","var(--success-color)","var(--error-color)"];let k=class extends n.WF{constructor(){super(...arguments),this.value="",this.label="",this.placeholder="",this.allowEntity=!1,this.entityColor="",this.allowAttribute=!1,this.gradient="",this.gradientNote="",this._status="",this._isOpen=!1,this._hsva={h:0,s:100,v:100,a:1},this._savedColors=[],this._hexInput="",this._format="HEXA",this._asWritten="",this._windowCtrl=new r.HK(this,()=>this._closeModal()),this._dragging=null,this._refocusToggle=!1,this._handleAreaPointerDown=e=>{this._dragging="area",e.target.setPointerCapture(e.pointerId),this._updateArea(e)},this._handleHuePointerDown=e=>{this._dragging="hue",e.target.setPointerCapture(e.pointerId),this._updateHue(e)},this._handleOpacityPointerDown=e=>{this._dragging="opacity",e.target.setPointerCapture(e.pointerId),this._updateOpacity(e)},this._handlePointerMove=e=>{this._dragging&&("area"===this._dragging?this._updateArea(e):"hue"===this._dragging?this._updateHue(e):"opacity"===this._dragging&&this._updateOpacity(e))},this._handlePointerUp=()=>{this._dragging=null}}connectedCallback(){super.connectedCallback(),this._loadSavedColors(),this._parseValue(this.value)}updated(e){this._refocusToggle&&(this._refocusToggle=!1,this.renderRoot.querySelector(".entity-toggle")?.focus()),e.has("value")&&!this._isOpen&&this._parseValue(this.value)}_loadSavedColors(){try{const e=localStorage.getItem($);this._savedColors=e?JSON.parse(e):[]}catch{this._savedColors=[]}}_saveSavedColors(){try{localStorage.setItem($,JSON.stringify(this._savedColors))}catch{}}_parseValue(e){if(this._asWritten="",!e)return this._hsva={h:0,s:0,v:100,a:1},this._hexInput="",void(this._format="HEXA");if(this._format=function(e){const t=e.trim().slice(0,8).toLowerCase();return t.startsWith("rgb")?"RGBA":t.startsWith("hsl")?"HSLA":t.startsWith("oklch")?"OKLCH":"HEXA"}(e),e.startsWith("var("))return void(this._hexInput=e);const t=this._colorToHsva(e);t?(this._hsva=t,this._hexInput=this._text(t),b(e)?.wide&&(this._asWritten=this._hexInput=e.trim())):this._hexInput=e}_text(e){return function(e,t){const i={r:Math.round(e.r),g:Math.round(e.g),b:Math.round(e.b),a:e.a},n=i.a<1;if("HEXA"===t)return"#"+[i.r,i.g,i.b,...n?[Math.round(255*i.a)]:[]].map(e=>e.toString(16).padStart(2,"0")).join("");if("RGBA"===t)return n?`rgba(${i.r}, ${i.g}, ${i.b}, ${y(i.a,2)})`:`rgb(${i.r}, ${i.g}, ${i.b})`;if("HSLA"===t){const[e,t,o]=function({r:e,g:t,b:i}){const[n,o,s]=[e/255,t/255,i/255],a=Math.max(n,o,s),r=Math.min(n,o,s),l=a-r,c=(a+r)/2;return 0===l?[0,0,100*c]:[60*(a===n?(o-s)/l+(o<s?6:0):a===o?(s-n)/l+2:(n-o)/l+4),l/(1-Math.abs(2*c-1))*100,100*c]}(i),s=`${y(e,1)}, ${y(t,1)}%, ${y(o,1)}%`;return n?`hsla(${s}, ${y(i.a,2)})`:`hsl(${s})`}const[o,s,a]=function({r:e,g:t,b:i}){const[n,o,s]=[e,t,i].map(e=>(e=>e<=.04045?e/12.92:((e+.055)/1.055)**2.4)(e/255)),a=Math.cbrt(.4122214708*n+.5363325363*o+.0514459929*s),r=Math.cbrt(.2119034982*n+.6806995451*o+.1073969566*s),l=Math.cbrt(.0883024619*n+.2817188376*o+.6299787005*s),c=.2104542553*a+.793617785*r-.0040720468*l,d=1.9779984951*a-2.428592205*r+.4505937099*l,h=.0259040371*a+.7827717662*r-.808675766*l,u=Math.hypot(d,h);return[100*c,u,u<1e-4?0:(180*Math.atan2(h,d)/Math.PI+360)%360]}(i);return`oklch(${y(o,2)}% ${y(s,4)} ${y(a,2)}${n?` / ${y(i.a,2)}`:""})`}(this._hsvaToRgb(e),this._format)}_setHsva(e){this._hsva=e,this._asWritten="",this._hexInput=this._text(e)}_setFormat(e){this._format=e,!this._hexInput.startsWith("var(")&&this._colorToHsva(this._hexInput)&&(this._asWritten="",this._hexInput=this._text(this._hsva))}async _pipette(){const e=window.EyeDropper;if(e)try{this._selectPreset((await(new e).open()).sRGBHex)}catch{}}_colorToHsva(e){const t=b(e);return t?this._rgbToHsva(t.r/255,t.g/255,t.b/255,t.a):null}_rgbToHsva(e,t,i,n){const o=Math.max(e,t,i),s=o-Math.min(e,t,i),a=100*o,r=0===o?0:s/o*100;let l=0;if(0!==s)switch(o){case e:l=60*((t-i)/s+(t<i?6:0));break;case t:l=60*((i-e)/s+2);break;case i:l=60*((e-t)/s+4)}return{h:l,s:r,v:a,a:n}}_hsvaToRgb(e){const t=e.h/60,i=e.s/100,n=e.v/100,o=n*i,s=o*(1-Math.abs(t%2-1)),a=n-o;let r=0,l=0,c=0;return t<1?(r=o,l=s):t<2?(r=s,l=o):t<3?(l=o,c=s):t<4?(l=s,c=o):t<5?(r=s,c=o):(r=o,c=s),{r:Math.round(255*(r+a)),g:Math.round(255*(l+a)),b:Math.round(255*(c+a)),a:e.a}}_hsvaToHex(e){const t=this._hsvaToRgb(e),i="#"+t.r.toString(16).padStart(2,"0")+t.g.toString(16).padStart(2,"0")+t.b.toString(16).padStart(2,"0");return e.a<1?i+Math.round(255*e.a).toString(16).padStart(2,"0"):i}_hsvaToRgbaString(e){const t=this._hsvaToRgb(e);return e.a<1?`rgba(${t.r}, ${t.g}, ${t.b}, ${e.a.toFixed(2)})`:`rgb(${t.r}, ${t.g}, ${t.b})`}_getCurrentColor(){return this._hexInput.startsWith("var(")?this._hexInput:this._asWritten||this._text(this._hsva)}_emitChange(){const e=this._getCurrentColor();this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_openModal(){this._parseValue(this.value),this._isOpen=!0}_closeModal(){this._isOpen=!1}_handleSave(){this._emitChange(),this._closeModal()}_updateArea(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),n=Math.max(0,Math.min(1,(e.clientY-t.top)/t.height));this._setHsva({...this._hsva,s:100*i,v:100*(1-n)})}_updateHue(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._setHsva({...this._hsva,h:360*i})}_updateOpacity(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width));this._setHsva({...this._hsva,a:i})}_handleHexInput(e){const t=e.target.value;this._hexInput=t;const i=this._colorToHsva(t);i&&(this._hsva=i,this._asWritten="")}_selectPreset(e){if(e.startsWith("var("))this._hexInput=e;else{const t=this._colorToHsva(e);t&&this._setHsva(t)}}_addSavedColor(){const e=this._getCurrentColor();this._savedColors.includes(e)||(this._savedColors=[e,...this._savedColors].slice(0,12),this._saveSavedColors())}_removeSavedColor(e,t){t.stopPropagation(),this._savedColors=this._savedColors.filter(t=>t!==e),this._saveSavedColors()}_handleTextInput(e){const t=e.target.value;this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:t}}))}_emitValue(e){this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_renderEntityToggle(e){return this.allowEntity?n.qy`<button
      type="button"
      class="icon-btn entity-toggle"
      aria-pressed=${e?"true":"false"}
      aria-label=${(0,_.t)(360,{name:(this.label||(0,_.t)(1219)).toLowerCase()})}
      title=${(0,_.t)(1154)}
      @click=${()=>{this._refocusToggle=!0,this._emitValue(e?"":"entity")}}
    >
      <ha-icon icon="mdi:palette-swatch-variant"></ha-icon>
    </button>`:n.s6}_renderEntity(e,t){let i=this.entityColor||"currentColor";const o=t?(0,l.Rw)(this.entityAttributes,t):void 0;t&&(i=o?`rgb(${o.join(", ")})`:"transparent");const s=e>=100?i:`color-mix(in srgb, ${i} ${e}%, transparent)`,a=this.label||(0,_.t)(1219),r=(e,t)=>this._emitValue(`entity${e?`.${e}`:""}${t<100?` ${+t.toFixed(2)}%`:""}`);return n.qy`
      <div class="color">
        <button type="button" class="swatch" disabled aria-hidden="true" tabindex="-1" title=${(0,_.t)(1053)}>
          <span class="swatch-fill"><span style="background: ${s}"></span></span>
        </button>
        <input class="input" type="text" readonly .value=${(0,_.t)(359)} aria-label=${a} />
        ${this._renderEntityToggle(!0)}
      </div>
      ${this.allowAttribute?this._renderSource(t,t=>r(t,e)):n.s6}
      <div class="field entity-opacity">
        <div class="field-head"><span class="lbl">${(0,_.t)(691)}</span></div>
        <mc-unit-field
          .value=${e>=100?"":`${e}%`}
          .label=${(0,_.t)(1292,{name:a})}
          .units=${["%"]}
          placeholder="100"
          @value-changed=${e=>{e.stopPropagation();const i=parseFloat(String(e.detail.value));r(t,Number.isFinite(i)&&i>=0&&i<100?i:100)}}
        ></mc-unit-field>
      </div>
    `}_renderSource(e,t){const i=this.entityAttributes,o=i?Object.keys(i).filter(e=>/^[a-z0-9_]{1,64}$/.test(e)&&(0,l.Rw)(i,e)).sort():[];return e&&!o.includes(e)&&o.push(e),n.qy`
      <div class="field">
        <label class="lbl" for=${"src"}>${(0,_.t)(207)}</label>
        <select class="input" id=${"src"} aria-label=${(0,_.t)(1296,{name:this.label||(0,_.t)(1219)})} @change=${e=>t(e.target.value||void 0)}>
          <option value="" ?selected=${!e}>${(0,_.t)(1003)}</option>
          ${o.map(t=>n.qy`<option value=${t} ?selected=${t===e}>${t}</option>`)}
        </select>
      </div>
    `}_toSolid(e){this._status=(0,_.t)(1022),this._emitValue(e.stops[0])}_toGradient(){const e=(0,d.wb)(this.value),t=(0,h.f8)(this.value),i=t&&!(0,l.qB)(t)?t:"var(--primary-color)",n="var(--accent-color)"===i?"#ffffff":"var(--accent-color)",o=e?{radial:e.radial&&"css"===this.gradient,angle:e.angle,stops:e.stops.slice(0,5)}:{radial:!1,angle:135,stops:[i,n]};this._status=e?(0,_.t)(432):(0,_.t)(429),this._emitValue((0,u.Pz)(o))}_renderMode(e){const t=this.label||(0,_.t)(1219);return n.qy`${(0,u.iJ)((0,_.t)(1291,{name:t}),e?"gradient":"solid",[{value:"solid",label:(0,_.t)(982)},{value:"gradient",label:(0,_.t)(427)}],t=>{"solid"===t&&e?this._toSolid(e):"gradient"!==t||e||this._toGradient()})}`}_entityValue(){const e=this.value.trim().match(c.z8);return!e||!this.allowAttribute&&e[1]?void 0:{attr:e[1],opacity:Math.min(100,Number(e[2]??100))}}_show(e,t){e.target.value=String(Math.round(t))}render(){const e=this.allowEntity?this._entityValue():void 0,t=this.gradient?(0,u.Tf)(this.value,"css"===this.gradient):void 0,i=!!this.gradient&&!t&&/gradient\(/i.test(this.value),o=e?this._renderEntity(e.opacity,e.attr):t?this._renderGradient(t):this._renderSolid();return n.qy`
      ${this.gradient?this._renderMode(t):n.s6}
      ${o}
      ${i?n.qy`<div class="help">${(0,_.t)(1082)}</div>`:n.s6}
      ${t&&this.gradientNote?n.qy`<div class="help">${this.gradientNote}</div>`:n.s6}
      ${this.gradient?n.qy`<div class="help" role="status" aria-live="polite">${this._status}</div>`:n.s6}
    `}_renderGradient(e){return n.qy`<mc-gradient-editor
      .model=${e}
      .label=${this.label||(0,_.t)(1219)}
      .allowRadial=${"css"===this.gradient}
      @value-changed=${()=>this._status=""}
    ></mc-gradient-editor>`}_renderSolid(){const e=!this.value&&!!this.placeholder,t=this.value||this.placeholder||"transparent",i=this.label||(0,_.t)(1219);return n.qy`
      <div class="color">
        <button
          type="button"
          class="swatch"
          aria-label=${(0,_.t)(751,{name:i.toLowerCase()})}
          title=${(0,_.t)(695)}
          @click=${this._openModal}
        >
          <span class="swatch-fill" data-hint=${e?"":n.s6}><span style="background: ${t}"></span></span>
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
      ${this._isOpen?this._renderModal():n.s6}
    `}_renderModal(){const e=this._hsvaToRgb(this._hsva),t=`hsl(${this._hsva.h}, 100%, 50%)`,i=this._hexInput.startsWith("var(")?this._hexInput:this._hsvaToRgbaString(this._hsva);return n.qy`
      ${(0,r.bU)((0,_.t)(208),()=>this._closeModal(),"s",n.qy`

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
                aria-label=${(0,_.t)(462)}
                .value=${Math.round(this._hsva.h).toString()}
                @input=${e=>{const t=parseInt(e.target.value);if(Number.isNaN(t))return;const i=Math.max(0,Math.min(360,t));this._setHsva({...this._hsva,h:i}),this._show(e,i)}}
                @change=${e=>this._show(e,this._hsva.h)}
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
                aria-label=${(0,_.t)(692)}
                .value=${Math.round(100*this._hsva.a).toString()}
                @input=${e=>{const t=parseInt(e.target.value);if(Number.isNaN(t))return;const i=Math.max(0,Math.min(100,t));this._setHsva({...this._hsva,a:i/100}),this._show(e,i)}}
                @change=${e=>this._show(e,100*this._hsva.a)}
              />
            </div>

            <div class="mc-color-tools">
              ${(0,u.iJ)((0,_.t)(206),this._format,p.map(e=>({value:e,label:e})),e=>this._setFormat(e))}
              ${"EyeDropper"in window?n.qy`<button
                    type="button"
                    class="icon-btn"
                    title=${(0,_.t)(735)}
                    aria-label=${(0,_.t)(735)}
                    @click=${()=>{this._pipette()}}
                  >
                    <ha-icon icon="mdi:eyedropper"></ha-icon>
                  </button>`:n.s6}
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
              <span class="mc-color-section-header">${(0,_.t)(773)}</span>
              <div class="mc-color-grid">
                ${x.map(e=>n.qy`
                  <button
                    type="button"
                    class="mc-color-swatch ${e.startsWith("var(")?"var-color":""}"
                    style="background: ${e}"
                    title=${e}
                    aria-label=${e}
                    @click=${()=>this._selectPreset(e)}
                  >${e.startsWith("var(")?n.qy`<span class="var-tag">${"var"}</span>`:""}</button>
                `)}
              </div>
            </div>

            <div class="mc-color-section">
              <span class="mc-color-section-header">${(0,_.t)(870)}</span>
              <div class="mc-saved-colors">
                ${this._savedColors.map(e=>n.qy`
                  <div class="mc-saved-swatch" style="background: ${e}">
                    <button
                      type="button"
                      class="mc-saved-pick"
                      title=${e}
                      aria-label=${(0,_.t)(1156,{value:e})}
                      @click=${()=>this._selectPreset(e)}
                    ></button>
                    <button
                      type="button"
                      class="mc-remove-btn"
                      aria-label=${(0,_.t)(802,{value:e})}
                      @click=${t=>this._removeSavedColor(e,t)}
                    >
                      <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                  </div>
                `)}
                <button
                  type="button"
                  class="icon-btn sm"
                  title=${(0,_.t)(867)}
                  aria-label=${(0,_.t)(867)}
                  @click=${this._addSavedColor}
                >
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>
              </div>
            </div>
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,_.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${(0,_.t)(865)}</button>
          </div>
      `)}
    `}};k.styles=[a.x,s.fz,s.yg,n.AH`
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
    `],w([(0,o.MZ)({type:String})],k.prototype,"value",void 0),w([(0,o.MZ)({type:String})],k.prototype,"label",void 0),w([(0,o.MZ)({type:String})],k.prototype,"placeholder",void 0),w([(0,o.MZ)({type:Boolean})],k.prototype,"allowEntity",void 0),w([(0,o.MZ)({type:String})],k.prototype,"entityColor",void 0),w([(0,o.MZ)({type:Boolean})],k.prototype,"allowAttribute",void 0),w([(0,o.MZ)({attribute:!1})],k.prototype,"entityAttributes",void 0),w([(0,o.MZ)({type:String})],k.prototype,"gradient",void 0),w([(0,o.MZ)({type:String})],k.prototype,"gradientNote",void 0),w([(0,o.wk)()],k.prototype,"_status",void 0),w([(0,o.wk)()],k.prototype,"_isOpen",void 0),w([(0,o.wk)()],k.prototype,"_hsva",void 0),w([(0,o.wk)()],k.prototype,"_savedColors",void 0),w([(0,o.wk)()],k.prototype,"_hexInput",void 0),w([(0,o.wk)()],k.prototype,"_format",void 0),k=w([(0,o.EM)("mc-color-picker")],k)},2928(e,t,i){i.d(t,{_:()=>r});var n=i(6161),o=i(2074),s=i(9100);const a=["#4caf50","#ff9800","#f44336","#2196f3"];function r(e,t,i,r={}){const l=Array.isArray(t)?t:[],c=e=>i(e.length?e:void 0),d=(e,t)=>c(l.map((i,n)=>n===e?{...i,...t}:i));return n.qy`
    <div class="mc-field mc-color-ranges">
      ${(0,o.XT)(e,r.propertyName,r.syncCtx)}
      ${r.help?n.qy`<p class="help">${r.help}</p>`:n.s6}
      <div class="range-list">
        ${l.map((e,t)=>n.qy`
            <div class="cond">
              <div class="cond-head">
                <span class="n">${(0,s.t)(789,{n:t+1})} <span class="sub">· ${(0,s.t)(1229,{value:e.from})}</span></span>
                <button
                  type="button"
                  class="icon-btn sm danger"
                  aria-label=${(0,s.t)(290,{n:t+1})}
                  title=${(0,s.t)(289)}
                  @click=${()=>c(l.filter((e,i)=>i!==t))}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon>
                </button>
              </div>
              ${void 0!==e.to&&null!==e.to?n.qy`<p class="help">${(0,s.t)(355,{value:e.to})}</p>`:n.s6}
              <div class="two">
                ${(0,o.aA)((0,s.t)(403),e.from,e=>d(t,{from:e}))}
                ${(0,o.Yd)((0,s.t)(205),e.color,e=>d(t,{color:e}))}
              </div>
            </div>
          `)}
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${()=>{const e=l.length?Number(l[l.length-1].from):void 0,t=r.min??0,i=r.max??100,n=void 0!==e&&Number.isFinite(e)?Math.min(i,e+Math.max(1,Math.round((i-t)/4))):t;c([...l,{from:n,color:a[l.length%a.length]}])}}>
            <ha-icon icon="mdi:plus"></ha-icon>${(0,s.t)(49)}
          </button>
        </div>
      </div>
    </div>
  `}},8006(e,t,i){async function n(e,t){try{if(!1!==window.isSecureContext&&navigator.clipboard?.writeText)return await navigator.clipboard.writeText(e),!0}catch{}const i=document.createElement("textarea");i.value=e,i.setAttribute("readonly",""),i.setAttribute("aria-hidden","true"),Object.assign(i.style,{position:"fixed",top:"0",left:"0",width:"1px",height:"1px",opacity:"0",pointerEvents:"none"});try{return t.appendChild(i),i.select(),"function"==typeof document.execCommand&&!0===document.execCommand("copy")}catch{return!1}finally{i.remove()}}i.d(t,{D:()=>n})},4121(e,t,i){var n=i(6161),o=i(5707),s=i(105),a=i(158),r=i(9788),l=i(5369),c=i(9100),d=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let h=class extends n.WF{constructor(){super(...arguments),this.value="",this.label="",this.placeholder="entity_id",this.domain="",this.strict=!1,this.preferred=[],this.help="",this._windowCtrl=new r.HK(this,()=>this._closeModal()),this._showModal=!1,this._typed="",this._searchQuery="",this._selectedEntityId=""}focusInput(){this.renderRoot.querySelector("input")?.focus()}open(){this._openModal()}_openModal(){this._selectedEntityId=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_handleSave(){this.value=this._selectedEntityId,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedEntityId},bubbles:!0,composed:!0})),this._closeModal()}_selectEntity(e){this._selectedEntityId=e}_onInputChange(e){const t=e.target.value;this.strict?this._typed=t:(this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0})))}_getFilteredEntities(){return this.hass?Object.entries(this.hass.states).filter(([e])=>!(this.domain&&!e.startsWith(this.domain+"."))).map(([e,t])=>({id:e,name:t.attributes.friendly_name||e,state:this.hass.formatEntityState(t),icon:(0,l.fq)(this.hass,e)||this._domainIcon(e.split(".")[0])})).filter(e=>{if(!this._searchQuery)return!0;const t=this._searchQuery.toLowerCase();return e.id.toLowerCase().includes(t)||e.name.toLowerCase().includes(t)}).sort((e,t)=>this._rank(e.id)-this._rank(t.id)||e.name.localeCompare(t.name)).slice(0,100):[]}_rank(e){return this.preferred.includes(e.split(".")[0])?0:1}_commit(e){const t=e.target,i=t.value;""===i||this.hass?.states[i]?(this.value=i,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:i},bubbles:!0,composed:!0}))):t.value=this.value}_suggestions(){const e=this._typed.toLowerCase();return Object.keys(this.hass?.states??{}).filter(t=>(!this.domain||t.startsWith(this.domain+"."))&&t.includes(e)).sort((e,t)=>this._rank(e)-this._rank(t)||e.localeCompare(t)).slice(0,20)}_getEntityInfo(){if(!this.hass||!this.value)return null;const e=this.hass.states[this.value];return e?{name:e.attributes.friendly_name||this.value,icon:(0,l.fq)(this.hass,this.value)||this._domainIcon(this.value.split(".")[0]),state:e.state,stateText:this.hass.formatEntityState(e)}:null}_dotClass(e){return"unavailable"===e||"unknown"===e?"dot is-unavailable":"off"===e||"closed"===e||"not_home"===e||"idle"===e?"dot is-off":"dot"}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",sensor:"mdi:eye",binary_sensor:"mdi:checkbox-marked-circle",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",input_text:"mdi:form-textbox",person:"mdi:account",weather:"mdi:weather-partly-cloudy",sun:"mdi:white-balance-sunny",vacuum:"mdi:robot-vacuum",water_heater:"mdi:water-boiler",humidifier:"mdi:air-humidifier",alarm_control_panel:"mdi:shield-home"}[e]||"mdi:help-circle"}render(){const e=this._getEntityInfo(),t=e?.icon||(this.value.includes(".")?this._domainIcon(this.value.split(".")[0]):"mdi:shape-outline");return n.qy`
      <div class="with-icon with-action">
        <ha-icon icon=${t}></ha-icon>
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder=${this.placeholder}
          aria-label=${this.label||(0,c.t)(357)}
          aria-describedby=${this.help?"help":n.s6}
          list=${this.strict?"ids":n.s6}
          spellcheck="false"
          @input=${this._onInputChange}
          @change=${this.strict?this._commit:n.s6}
        />
        ${this.strict?n.qy`<datalist id="ids">${this._suggestions().map(e=>n.qy`<option value=${e}></option>`)}</datalist>`:n.s6}
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
      ${e?n.qy`
            <p class="entity-meta">
              <span class=${this._dotClass(e.state)}></span>
              <span>${e.name} · ${e.stateText}</span>
            </p>
          `:""}
      ${this.help?n.qy`<p class="help" id="help">${this.help}</p>`:n.s6}

      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const e=this._getFilteredEntities();return n.qy`
      ${(0,r.bU)((0,c.t)(895),()=>this._closeModal(),"l",n.qy`
          <div class="mc-picker-search">
            ${(0,r.LW)((0,c.t)(877),this._searchQuery,e=>{this._searchQuery=e})}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${(0,c.t)(356)}>
            ${e.length>0?e.map(e=>n.qy`
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
                `):n.qy`<div class="mc-picker-empty">${(0,c.t)(636)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,c.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${(0,c.t)(865)}</button>
          </div>
      `)}
    `}};h.styles=[a.x,s.fz],d([(0,o.MZ)({attribute:!1})],h.prototype,"hass",void 0),d([(0,o.MZ)({type:String})],h.prototype,"value",void 0),d([(0,o.MZ)({type:String})],h.prototype,"label",void 0),d([(0,o.MZ)({type:String})],h.prototype,"placeholder",void 0),d([(0,o.MZ)({type:String})],h.prototype,"domain",void 0),d([(0,o.MZ)({type:Boolean})],h.prototype,"strict",void 0),d([(0,o.MZ)({attribute:!1})],h.prototype,"preferred",void 0),d([(0,o.MZ)({type:String})],h.prototype,"help",void 0),d([(0,o.wk)()],h.prototype,"_showModal",void 0),d([(0,o.wk)()],h.prototype,"_typed",void 0),d([(0,o.wk)()],h.prototype,"_searchQuery",void 0),d([(0,o.wk)()],h.prototype,"_selectedEntityId",void 0),h=d([(0,o.EM)("mc-entity-picker")],h)},9315(e,t,i){i.d(t,{i:()=>s});var n=i(6161),o=i(201);function s(e,t,i,s){return t?n.qy`<button
    type="button"
    class="icon-btn sm field-reset"
    aria-label=${(0,o.t)(386,{label:e})}
    title=${s??(0,o.t)(385)}
    @click=${e=>{e.stopPropagation(),i()}}
  >
    <ha-icon icon="mdi:backup-restore"></ha-icon>
  </button>`:n.s6}},5115(e,t,i){i.d(t,{Pz:()=>p,Tf:()=>g,iJ:()=>f});var n=i(6161),o=i(5707),s=i(158),a=i(8497),r=i(4313),l=i(9748),c=i(851),d=i(9100),h=i(993),u=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};function p(e){return`${e.radial?"radial":"linear"}-gradient(${e.radial?"circle":`${e.angle}deg`}, ${e.stops.join(", ")})`}const m=e=>e.replace(/\s+/g,"");function g(e,t){const i=(0,l.wb)(e);if(!i||i.stops.length>5||i.radial&&!t)return;const n={radial:i.radial,angle:(0,l.gO)(e)??i.angle,stops:i.stops},o=String(e).replace(/^(\s*linear-gradient\()\s*to\s[a-z\s]+?(?=,)/i,`$1${n.angle}deg`);return m(p(n))===m(o)?n:void 0}function f(e,t,i,o,s=!1){return n.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const n="rtl"===(0,h.k)(e.currentTarget)?-1:1,s={ArrowRight:n,ArrowDown:1,ArrowLeft:-n,ArrowUp:-1};if(!(e.key in s))return;e.preventDefault();const a=i.findIndex(e=>e.value===t),r=i[(a+s[e.key]+i.length)%i.length].value,l=e.currentTarget;o(r),requestAnimationFrame(()=>l.querySelector(`[data-val="${r}"]`)?.focus())}}>
    ${i.map(e=>{const i=e.value===t;return n.qy`<button
        type="button"
        role="radio"
        data-val=${e.value}
        aria-checked=${i?"true":"false"}
        tabindex=${i?"0":"-1"}
        ?disabled=${s}
        @click=${()=>o(e.value)}
      >${e.label}</button>`})}
  </div>`}let v=class extends n.WF{constructor(){super(...arguments),this.model={radial:!1,angle:135,stops:["#ffffff","#000000"]},this.label="",this.allowRadial=!1,this.disabled=!1,this._badStop=-1,this._focusStop=-1}updated(){if(this._focusStop<0)return;const e=this._focusStop;this._focusStop=-1;const t=this.renderRoot.querySelectorAll("mc-color-picker")[e];t?.updateComplete?.then(()=>t.shadowRoot?.querySelector("input.input")?.focus())}_emit(e){this._draft=void 0,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:p(e)}}))}_angle(e){const t=parseFloat(e);return Number.isFinite(t)?Math.round(Math.max(0,Math.min(360,t))):this.model.angle}_setStop(e,t,i){i.stopPropagation();const n=(0,c.f8)(t);this._badStop=n?-1:e,n&&n!==this.model.stops[e]&&this._emit({...this.model,stops:this.model.stops.map((t,i)=>i===e?n:t)})}_add(){const{stops:e}=this.model;if(e.length>=5)return;const t=e.length-1;this._focusStop=t,this._emit({...this.model,stops:[...e.slice(0,t),e[t-1],...e.slice(t)]})}_remove(e){const{stops:t}=this.model;t.length<=2||(this._badStop=-1,this._emit({...this.model,stops:t.filter((t,i)=>i!==e)}))}_renderStop(e,t,i){const o=t+1,s=i<=2;return n.qy`<div class="stop" role="group" aria-label=${(0,d.t)(1012,{num:o,n:i})}>
      <mc-color-picker
        .value=${e}
        .label=${(0,d.t)(1011,{num:o})}
        ?aria-invalid=${this._badStop===t}
        @value-changed=${e=>this._setStop(t,String(e.detail.value),e)}
      ></mc-color-picker>
      <button
        type="button"
        class="icon-btn"
        aria-label=${(0,d.t)(801,{num:o})}
        title=${s?(0,d.t)(14):(0,d.t)(801,{num:o})}
        ?disabled=${s||this.disabled}
        @click=${()=>this._remove(t)}
      >
        <ha-icon icon="mdi:close"></ha-icon>
      </button>
    </div>`}render(){const e=this.model,t=this._draft??e.angle,i=p({...e,angle:t}),o=e.stops.length,s=this.label||(0,d.t)(1219);return n.qy`
      <div class="grad">
        <div class="preview" role="img" aria-label=${(0,d.t)(431)}><span style=${`background: ${i}`}></span></div>
        ${this.allowRadial?n.qy`<div class="row">
              <span class="lbl">${(0,d.t)(1117)}</span>
              ${f((0,d.t)(1290,{name:s}),e.radial?"radial":"linear",[{value:"linear",label:(0,d.t)(526)},{value:"radial",label:(0,d.t)(788)}],t=>t!==(e.radial?"radial":"linear")&&this._emit({...e,radial:"radial"===t}),this.disabled)}
            </div>`:n.s6}
        ${e.radial?n.s6:(0,r.a)({id:"angle",label:(0,d.t)(76),min:0,max:360,step:1,value:t,unit:"deg",valueText:(0,d.t)(1248,{angle:t}),numberLabel:(0,d.t)(78),disabled:this.disabled,onInput:e=>this._draft=this._angle(String(e)),onChange:t=>this._emit({...e,angle:this._angle(String(t))})})}
        <div class="stops">${e.stops.map((e,t)=>this._renderStop(e,t,o))}</div>
        ${this._badStop>=0?n.qy`<div class="help error" role="alert">${(0,d.t)(1139)}</div>`:n.s6}
        <div class="actions">
          <button
            type="button"
            class="btn btn-text btn-sm"
            title=${o>=5?(0,d.t)(1259,{max:5}):(0,d.t)(51)}
            ?disabled=${o>=5||this.disabled}
            @click=${this._add}
          >
            <ha-icon icon="mdi:plus"></ha-icon> ${(0,d.t)(51)}
          </button>
          <button type="button" class="btn btn-text btn-sm" ?disabled=${this.disabled} @click=${()=>this._emit({...e,stops:[...e.stops].reverse()})}>
            <ha-icon icon="mdi:swap-horizontal"></ha-icon> ${(0,d.t)(836)}
          </button>
        </div>
      </div>
    `}};v.styles=[s.x,a.W,n.AH`
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
    `],u([(0,o.MZ)({type:Object})],v.prototype,"model",void 0),u([(0,o.MZ)({type:String})],v.prototype,"label",void 0),u([(0,o.MZ)({type:Boolean})],v.prototype,"allowRadial",void 0),u([(0,o.MZ)({type:Boolean})],v.prototype,"disabled",void 0),u([(0,o.wk)()],v.prototype,"_draft",void 0),u([(0,o.wk)()],v.prototype,"_badStop",void 0),v=u([(0,o.EM)("mc-gradient-editor")],v)},6828(e,t,i){i.d(t,{T9:()=>u});var n=i(6161),o=i(158),s=i(6485),a=i(5512),r=i(8546),l=i(2359);const c={LitElement:n.WF,html:n.qy,css:n.AH,editorSystem:o.x,readAnimations:s.Sd,get library(){return(0,a.T_)()},resolveIcon:(...e)=>(0,r.Si)().resolveIconGeometry(...e),setIcon:(...e)=>(0,r.Si)().setIconGeometry(...e),customIds:l.Gd};let d,h;function u(){return d??=i.e(734).then(()=>i(1706)).then(async e=>{if(!await e.iconNamesReady())throw new Error("icon names");return h=e,e.defineAnimatedIconGrid(c),!0}).catch(e=>(d=void 0,console.warn("Magic Card:",e),!1)),d}i.d(t,["O3",0,(e,t,n,o)=>i.e(734).then(()=>i(1706)).then(i=>i.pickAnimatedIcon(c,e,t,n,o)).catch(e=>(console.warn("Magic Card:",e),!1)),"OP",0,(e,t)=>h?.currentIconPick(c,e,t)??"","Z_",0,(e,t,n,o)=>i.e(734).then(()=>i(1706)).then(i=>i.pickCatalogue(c,e,t,n,o)).catch(e=>(console.warn("Magic Card:",e),!1)),"qB",0,(e,t,n)=>{i.e(734).then(()=>i(1706)).then(i=>{i.followIcons(c,e,t,n),i.pruneCatalogue(c,e)}).catch(()=>{})},"sX",0,(e,t)=>h?.currentIconStyle(c,e,t)??"living"])},6983(e,t,i){var n=i(6161),o=i(5707),s=i(105),a=i(158),r=i(9788),l=i(6828);const c="/static/mdi/iconList.json",d=[["home","house"],["home-outline","house"],["lightbulb","light bulb lamp"],["lightbulb-outline","light bulb lamp"],["lightbulb-group","lights"],["lamp","light"],["floor-lamp","light"],["ceiling-light","lamp"],["led-strip","light"],["fan","ventilation air"],["fan-off","ventilation"],["air-conditioner","ac climate cooling"],["air-purifier","filter"],["air-humidifier","humidity"],["thermometer","temperature"],["thermostat","climate heating"],["radiator","heating"],["fire","flame heat"],["snowflake","cold cool winter"],["water","drop"],["water-percent","humidity"],["water-boiler","heater"],["weather-sunny","sun"],["weather-night","moon"],["weather-cloudy","cloud"],["weather-partly-cloudy","cloud sun"],["weather-rainy","rain"],["weather-pouring","rain"],["weather-snowy","snow"],["weather-windy","wind"],["weather-lightning","storm thunder"],["white-balance-sunny","sun brightness"],["power","on off"],["power-plug","socket outlet"],["power-socket-eu","outlet"],["flash","lightning energy"],["lightning-bolt","energy electricity"],["solar-power","sun energy panel"],["battery","charge"],["battery-charging","charge"],["ev-station","car charger"],["car","vehicle"],["car-electric","vehicle ev"],["garage","car"],["garage-open","car door"],["gate","fence"],["door","entrance"],["door-open","entrance"],["door-closed","entrance"],["window-closed","glass"],["window-open","glass"],["window-shutter","blind cover"],["window-shutter-open","blind cover"],["blinds","cover"],["curtains","cover"],["lock","secure"],["lock-open","unlock"],["key","access"],["shield-home","alarm security"],["alarm-light","siren"],["bell","notification"],["bell-ring","notification doorbell"],["doorbell","bell"],["cctv","camera surveillance"],["camera","photo"],["video","camera"],["motion-sensor","presence pir"],["run","motion person"],["account","person user"],["account-group","people users"],["human","person"],["sofa","couch living room"],["bed","bedroom sleep"],["bed-empty","bedroom"],["silverware-fork-knife","kitchen dining"],["stove","kitchen cooking"],["fridge","refrigerator kitchen"],["dishwasher","kitchen"],["washing-machine","laundry"],["tumble-dryer","laundry"],["coffee","cup"],["coffee-maker","kitchen"],["microwave","kitchen"],["toilet","bathroom wc"],["shower","bathroom"],["bathtub","bathroom"],["robot-vacuum","cleaning"],["robot","automation"],["script-text","script"],["palette","scene colour"],["television","tv"],["television-classic","tv"],["cast","chromecast media"],["speaker","audio sound"],["speaker-wireless","audio"],["music","note audio"],["play","media"],["pause","media"],["stop","media"],["skip-next","media"],["skip-previous","media"],["volume-high","sound"],["volume-off","mute"],["wifi","network wireless"],["router-wireless","network"],["lan","network"],["server","computer"],["laptop","computer"],["monitor","screen display"],["cellphone","phone mobile"],["tablet","ipad"],["gamepad-variant","game console"],["printer","print"],["flower","plant garden"],["sprout","plant"],["tree","garden"],["grass","lawn garden"],["sprinkler","irrigation garden"],["pool","swim"],["dog","pet"],["cat","pet"],["paw","pet"],["trash-can","bin garbage"],["delete","trash remove"],["calendar","date"],["clock-outline","time"],["timer-outline","countdown"],["alarm","clock"],["chart-line","graph history"],["gauge","meter"],["information","info"],["information-outline","info"],["alert","warning"],["alert-circle","warning error"],["check","done ok"],["check-circle","done ok"],["close","cancel"],["plus","add"],["minus","remove"],["cog","settings gear"],["tune","settings"],["menu","hamburger"],["magnify","search"],["heart","favourite love"],["star","favourite"],["map-marker","location"],["earth","globe world"],["sun-clock","sunrise sunset"],["moon-waning-crescent","night"],["toggle-switch","switch"],["toggle-switch-off","switch"],["ray-vertex","number"],["format-list-bulleted","list select"],["eye","sensor view"],["emoticon-outline","smile face"],["shape-outline","shape"],["help-circle","question"]];function h(e){const t=(e.includes(":")?e.slice(e.indexOf(":")+1):e).split(/[-_\s]+/).filter(Boolean).join(" ");return t?t.charAt(0).toUpperCase()+t.slice(1):""}function u(e){return/^[a-z0-9_-]+:[a-z0-9_.-]+$/i.test(e.trim())}function p(e,t){if(!t||"string"!=typeof t.name||!t.name)return;const i=Array.isArray(t.keywords)?t.keywords.filter(e=>"string"==typeof e):[];return{id:`${e}:${t.name}`,name:h(t.name),prefix:e,search:`${e}:${t.name} ${t.name.replace(/-/g," ")} ${i.join(" ")}`.toLowerCase()}}let m;const g=new Map;async function f(e){return m||(m=(async()=>{try{const t=await fetch(e?e(c):c);if(!t.ok)throw new Error(String(t.status));const i=await t.json();if(!Array.isArray(i)||0===i.length)throw new Error("empty");return i.map(e=>p("mdi",e)).filter(e=>!!e)}catch{return m=void 0,d.map(([e,t])=>p("mdi",{name:e,keywords:t.split(" ")}))}})()),m}async function v(){const e=("undefined"==typeof window?{}:window).customIcons??{};return(await Promise.all(Object.keys(e).map(async t=>{const i=g.get(t);if(i)return i;const n=e[t]?.getIconList;if("function"!=typeof n)return[];try{const e=await n(),i=(Array.isArray(e)?e:[]).map(e=>p(t,e)).filter(e=>!!e);return g.set(t,i),i}catch{return[]}}))).flat()}function b(e,t,i){const n=t.trim().toLowerCase();if(!n)return{items:e.slice(0,i),total:e.length};const o=n.replace(/\s+/g,"-"),s=n.replace(/-/g," "),a=[];return e.forEach((e,t)=>{const i=e.id.toLowerCase(),n=i.slice(i.indexOf(":")+1);let r=-1;i===o||n===o?r=0:i.startsWith(o)||n.startsWith(o)?r=1:i.includes(o)?r=2:e.search.includes(s)&&(r=3),r>=0&&a.push([r,t,e])}),a.sort((e,t)=>e[0]-t[0]||e[1]-t[1]),{items:a.slice(0,i).map(e=>e[2]),total:a.length}}i(2061);var y=i(4025),_=i(6562),w=i(9899),$=i(7104),x=i(4951),k=i(9100),C=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let M=class extends n.WF{constructor(){super(...arguments),this.value="",this.label="",this._windowCtrl=new r.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery="",this._selectedIcon="",this._icons=null,this._active=-1,this._tab="icons",this._chunk="loading",this._src="all",this._editorFailed=!1,this._keepFor="",this._fieldWasFocused=!1}async _setTab(e,t=!1){this._tab=e,t&&this.updateComplete.then(()=>this.shadowRoot?.querySelector("[role=tab][aria-selected=true]")?.focus()),"animated"===e&&"ok"!==this._chunk&&(this._chunk="loading",this._chunk=await(0,l.T9)()?"ok":"failed")}_onTabKeydown(e){const t={ArrowRight:"animated",ArrowLeft:"icons",Home:"icons",End:"animated"}[e.key];t&&(e.preventDefault(),this._setTab(t,!0))}_onAnimatedPick(e){const t=this.animated;t&&(e.stopPropagation(),(0,l.O3)(this,t.module,t.onModule,e.detail),e.detail.restyle||this._closeModal())}_renderTabs(){return n.qy`
      <div class="seg" role="tablist" aria-label=${(0,k.t)(473)}>
        ${["icons","animated"].map(e=>n.qy`
          <button type="button" role="tab" aria-selected=${this._tab===e?"true":"false"}
            tabindex=${this._tab===e?"0":"-1"} @click=${()=>this._setTab(e)} @keydown=${this._onTabKeydown}
          >${"icons"===e?(0,k.t)(478):(0,k.t)(81)}</button>
        `)}
      </div>
    `}_renderAnimated(){const e=this.animated;if("loading"===this._chunk)return n.qy`<div class="mc-picker-loading">${(0,k.t)(547)}</div>`;if("failed"===this._chunk)return n.qy`<div class="mc-picker-empty">${(0,k.t)(1043)}
        <button type="button" class="btn btn-secondary" @click=${()=>this._setTab("animated")}>${(0,k.t)(835)}</button></div>`;const t=e.module;return n.qy`<mc-animated-icon-grid .hass=${this.hass} .icon=${this.value} .entity=${t.entity??""}
      .current=${(0,l.OP)(this,e.module)} .iconStyle=${(0,l.sX)(this,e.module)} @animated-icon-pick=${this._onAnimatedPick}></mc-animated-icon-grid>`}_openModal(){this._tab="icons",this._selectedIcon=this.value,this._searchQuery="",this._active=-1,this._src="all",this._keep=void 0,this._editorFailed=!1,this._showModal=!0,this._loadIcons(),(0,_.fZ)(this.hass).then(e=>this._lib=e)}async _loadIcons(){const e=await async function(e){const[t,i]=await Promise.all([v(),f(e)]);return[...t,...i]}(this.hass?.hassUrl?.bind(this.hass));this._showModal&&(this._icons=e)}_closeModal(){this._showModal=!1}_commit(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0}))}_handleSave(){const e=this._selectedIcon.trim(),t=this._keep&&e===`mcu:${this._keep.id}`?this._keep:void 0;this._commit(e);const i=t?(0,y.d)(this):void 0;t&&i&&!1!==i.attached&&i.updateConfig((0,$.QT)(i.getConfig(),t.id,t.on?t.svg:void 0),!1),this._closeModal()}async _fromSaved(e){const t=this.animated,i=this._keep;if(t&&i)return"copy"===e?((e=>{t.onModule((0,$.kH)(t.module,e,this.syncCtx))})({icon:"svg",svg:i.svg}),void this._closeModal()):void("opened"===await this._openEditor({kind:"svg",svg:i.svg})&&this._closeModal())}async _openEditor(e){const t=this.animated;if(!t)return;this._editorFailed=!1;const i=await(0,$.$d)({from:this,hass:this.hass,module:t.module,linked:!!this.syncCtx&&(0,x.rJ)(this.syncCtx),source:e,apply:e=>t.onModule((0,$.kH)(t.module,e,this.syncCtx))});return this._editorFailed="failed"===i,i}async _draw(){"opened"===await this._openEditor({kind:"blank"})&&this._closeModal()}_mine(){return("ok"===this._lib?.state?this._lib.items:[]).map(e=>({id:`mcu:${e.id}`,name:e.name,prefix:"mcu",search:[e.name,...e.keywords??[]].join(" ").toLowerCase()}))}_allIcons(){const e=this._icons;return e?"ok"!==this._lib?.state?e:(this._noMcu?.from===e&&this._noMcu.lib===this._lib||(this._noMcu={from:e,lib:this._lib,list:e.filter(e=>"mcu"!==e.prefix)}),this._noMcu.list):[]}_syncKeep(){const e=this._selectedIcon.startsWith("mcu:")?this._selectedIcon.slice(4):"";e!==this._keepFor&&(this._keepFor=e,this._keep=void 0,e&&(0,_.sW)(this.hass,e).then(t=>{if(!t||this._keepFor!==e)return;const i=(new TextEncoder).encode(t.svg).length,n=!!(0,y.d)(this)?.getConfig().custom_icons?.[e];this._keep={id:e,svg:t.svg,bytes:i,on:n||i<=2048}}))}_handleClear(){this._commit(""),this._closeModal()}_onInputChange(e){this._commit(e.target.value)}_onFieldPointerDown(e){this._fieldWasFocused=this.shadowRoot?.activeElement===e.currentTarget}_onFieldClick(){this._fieldWasFocused||this._showModal||this._openModal()}_onFieldKeydown(e){"ArrowDown"!==e.key||e.altKey||(e.preventDefault(),this._openModal())}_rows(){const e=this._mine();if("mine"===this._src){const t=b(e,this._searchQuery,150);return{rows:t.items,total:t.total,custom:!1,mine:t.items.length}}const t=this._allIcons(),{items:i,total:n}=b(t,this._searchQuery,150),o=b(e,this._searchQuery,6).items,s=this._searchQuery.trim();if(u(s)&&!i.some(e=>e.id.toLowerCase()===s.toLowerCase())&&!o.some(e=>e.id.toLowerCase()===s.toLowerCase())){const e=s.slice(0,s.indexOf(":"));return{rows:[...o,{id:s,name:h(s),prefix:e,search:""},...i],total:n+1,custom:!0,mine:o.length}}return{rows:[...o,...i],total:n,custom:!1,mine:o.length}}_onSearch(e){this._searchQuery=e,this._active=e.trim()?0:-1}_onSearchKeydown(e){const{rows:t}=this._rows();if("ArrowDown"===e.key||"ArrowUp"===e.key){if(e.preventDefault(),!t.length)return;const i="ArrowDown"===e.key?1:-1;this._active=this._active<0?i>0?0:t.length-1:Math.min(t.length-1,Math.max(0,this._active+i)),this._selectedIcon=t[this._active].id}else if("Enter"===e.key){e.preventDefault();const i=this._active>=0?t[this._active]:void 0;i?this._selectedIcon=i.id:u(this._searchQuery)&&(this._selectedIcon=this._searchQuery.trim()),this._handleSave()}}willUpdate(){this._showModal&&this._syncKeep()}updated(e){if(e.has("_showModal")&&this._showModal&&this.shadowRoot?.querySelector(".mc-picker-search input")?.focus(),e.has("_active")&&this._active>=0){const e=this.shadowRoot?.getElementById(`mc-icon-opt-${this._active}`);e?.scrollIntoView?.({block:"nearest"})}}render(){const e=this.value?.trim()??"";return n.qy`
      <div class="with-icon with-action">
        <ha-icon .icon=${e||"mdi:emoticon-outline"}></ha-icon>
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder="mdi:icon"
          aria-label=${this.label||(0,k.t)(466)}
          spellcheck="false"
          @input=${this._onInputChange}
          @keydown=${this._onFieldKeydown}
          @pointerdown=${this._onFieldPointerDown}
          @click=${this._onFieldClick}
        />
        <button
          type="button"
          class="icon-btn sm field-action browse"
          aria-label=${(0,k.t)(149)}
          title=${(0,k.t)(149)}
          data-focus-key="icon-entry"
          @click=${this._openModal}
        >
          <ha-icon icon="mdi:magnify"></ha-icon>
        </button>
      </div>
      ${e?n.qy`<p class="entity-meta icon-meta"><span>${h(e)}</span></p>`:""}

      ${this._showModal?this._renderModal():""}
    `}_renderKeep(){const e=this._keep;if(!e||this._selectedIcon.trim()!==`mcu:${e.id}`)return"";const t=e.bytes<1024?(0,k.t)(1299,{n:e.bytes}):(0,k.t)(1306,{size:(e.bytes/1024).toFixed(1)});return n.qy`<details class="mc-picker-keep">
      <summary>${(0,k.t)(56)}</summary>
      <div class="switch-row">
        <div class="txt">
          <div class="field-head"><label for="mc-keep-copy">${(0,k.t)(499,{size:t})}</label></div>
          <p class="help" id="mc-keep-help">${(0,k.t)(1194)}</p>
        </div>
        <button type="button" class="switch" id="mc-keep-copy" role="switch" aria-checked=${e.on?"true":"false"} aria-describedby="mc-keep-help"
          @click=${()=>this._keep={...e,on:!e.on}}></button>
      </div>
      ${this.animated?n.qy`<div class="mc-picker-keep-actions">
            <button type="button" class="btn btn-text btn-sm" @click=${()=>{this._fromSaved("copy")}}>${(0,k.t)(1141)}</button>
            <button type="button" class="btn btn-text btn-sm" @click=${()=>{this._fromSaved("customise")}}>${(0,k.t)(264)}</button>
          </div>`:""}
    </details>`}_renderModal(){const{rows:e,total:t,mine:i}=this._rows(),o=this._lib,s=this._active>=0&&this._active<e.length?`mc-icon-opt-${this._active}`:void 0,a=this._selectedIcon.trim().toLowerCase(),l=!!this.animated&&"animated"===this._tab;return n.qy`
      ${(0,r.bU)((0,k.t)(897),()=>this._closeModal(),"m",n.qy`
          <div class="mc-picker-stack">
          ${this.animated?this._renderTabs():""}
          ${l?n.qy`<div class="mc-picker-list" role="tabpanel">${this._renderAnimated()}</div>`:n.qy`
          ${"ok"===o?.state?n.qy`<div class="seg full" role="radiogroup" aria-label=${(0,k.t)(479)}>
                ${["all","mine"].map(e=>n.qy`<button type="button" role="radio" aria-checked=${this._src===e?"true":"false"} @click=${()=>{this._src=e,this._active=-1}}>${"all"===e?(0,k.t)(62):(0,k.t)(615,{n:o.items.length})}</button>`)}
              </div>`:""}
          <div class="mc-picker-search">
            ${(0,r.LW)((0,k.t)(879),this._searchQuery,e=>this._onSearch(e),{onKeydown:e=>this._onSearchKeydown(e),listId:"mc-icon-list",activeId:s})}
          </div>
          <p class="sr-only" role="status">${null===this._icons?"":t>0?(0,k.t)(1269,{n:t}):(0,k.t)(642)}</p>
          <div class="mc-picker-list" id="mc-icon-list" role="listbox" aria-label=${(0,k.t)(478)}>
            ${null===this._icons?n.qy`<div class="mc-picker-loading">${(0,k.t)(541)}</div>`:e.length>0?e.map((e,t)=>n.qy`
                    ${0===t&&i>0&&"all"===this._src?n.qy`<div class="mc-picker-category mc-picker-group">${(0,k.t)(614)} <button type="button" class="btn btn-text btn-sm" @click=${()=>{this._src="mine"}}>${(0,k.t)(924)}</button></div>`:""}
                    ${t===i&&i>0&&"all"===this._src?n.qy`<div class="mc-picker-category mc-picker-group">${(0,k.t)(574)}</div>`:""}
                    <button
                      type="button"
                      role="option"
                      id="mc-icon-opt-${t}"
                      tabindex="-1"
                      class="mc-picker-item ${t===this._active?"is-active":""}"
                      aria-selected=${a===e.id.toLowerCase()?"true":"false"}
                      @click=${()=>{this._selectedIcon=e.id,this._active=t}}
                      @dblclick=${()=>{this._selectedIcon=e.id,this._handleSave()}}
                    >
                      <span class="mc-picker-item-icon"><ha-icon .icon=${e.id}></ha-icon></span>
                      <span class="mc-picker-item-content">
                        <span class="mc-picker-item-name">${e.name}</span>
                        <span class="mc-picker-item-id" title=${e.id}>${e.id}</span>
                      </span>
                      ${"mdi"!==e.prefix?n.qy`<span class="chip">${e.prefix}</span>`:""}
                    </button>
                  `):"mine"!==this._src||this._searchQuery.trim()?n.qy`<div class="mc-picker-empty">${(0,k.t)(643)}${this.animated&&"mine"===this._src?n.qy` <button type="button" class="btn btn-secondary" @click=${()=>{this._searchQuery=""}}>${(0,k.t)(191)}</button> <button type="button" class="btn btn-secondary" @click=${()=>{this._draw()}}>${(0,k.t)(317)}</button>`:""}</div>`:n.qy`<div class="mc-picker-empty">${(0,k.t)(652)}${this.animated?n.qy` <button type="button" class="btn btn-secondary" @click=${()=>{this._draw()}}>${(0,k.t)(317)}</button>`:""}</div>`}
            ${t>e.length?n.qy`<div class="mc-picker-more">${(0,k.t)(961,{shown:e.length,total:t})}</div>`:""}
          </div>`}
          ${l?"":this._renderKeep()}
          </div>
          <div class="mc-picker-footer" slot="footer">
            ${l?"":n.qy`<button type="button" class="btn btn-text clear" @click=${this._handleClear}>${(0,k.t)(188)}</button>`}
            ${!l&&this.animated?n.qy`<button type="button" class="btn btn-text" data-focus-key="icon-entry" @click=${()=>{this._draw()}}>${(0,k.t)(317)}</button>`:""}
            ${this.animated?n.qy`<button type="button" class="btn btn-text" @click=${e=>{(0,w.uK)(e.currentTarget,this.hass,"icon")}}>${(0,k.t)(518)}</button>`:""}
            ${!l&&o&&"missing"===o.state?n.qy`<span class="help">${(0,k.t)(501)}</span>`:""}
            ${this._editorFailed?n.qy`<span class="help error" role="alert">${(0,k.t)(1055)}</span>`:""}
            <span class="spacer"></span>
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,k.t)(162)}</button>
            ${l?"":n.qy`<button type="button" class="btn btn-primary" @click=${this._handleSave}>${(0,k.t)(865)}</button>`}
          </div>
      `)}
    `}};M.styles=[a.x,s.fz,s.kx,n.AH`
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
    `],C([(0,o.MZ)({attribute:!1})],M.prototype,"hass",void 0),C([(0,o.MZ)({type:String})],M.prototype,"value",void 0),C([(0,o.MZ)({type:String})],M.prototype,"label",void 0),C([(0,o.MZ)({attribute:!1})],M.prototype,"animated",void 0),C([(0,o.MZ)({attribute:!1})],M.prototype,"syncCtx",void 0),C([(0,o.wk)()],M.prototype,"_showModal",void 0),C([(0,o.wk)()],M.prototype,"_searchQuery",void 0),C([(0,o.wk)()],M.prototype,"_selectedIcon",void 0),C([(0,o.wk)()],M.prototype,"_icons",void 0),C([(0,o.wk)()],M.prototype,"_active",void 0),C([(0,o.wk)()],M.prototype,"_tab",void 0),C([(0,o.wk)()],M.prototype,"_chunk",void 0),C([(0,o.wk)()],M.prototype,"_lib",void 0),C([(0,o.wk)()],M.prototype,"_src",void 0),C([(0,o.wk)()],M.prototype,"_keep",void 0),C([(0,o.wk)()],M.prototype,"_editorFailed",void 0),M=C([(0,o.EM)("mc-icon-picker")],M)},9048(e,t,i){var n=i(6161),o=i(5707),s=i(105),a=i(158),r=i(9788),l=i(9100),c=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let d=class extends n.WF{constructor(){super(...arguments),this.value="",this.mediaType="",this._windowCtrl=new r.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery="",this._items=[],this._loading=!1,this._error="",this._breadcrumbs=[],this._selectedItem=null}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_openModal(){this._showModal=!0,this._searchQuery="",this._selectedItem=null,this._breadcrumbs=[{title:(0,l.t)(578),media_content_id:""}],this._browseMedia("")}_closeModal(){this._showModal=!1,this._items=[],this._error=""}async _browseMedia(e){if(this.hass){this._loading=!0,this._error="",this._selectedItem=null;try{const t={type:"media_source/browse_media"};e&&(t.media_content_id=e);const i=await this.hass.callWS(t);this._items=i.children||[]}catch{this._error=(0,l.t)(645),this._items=[]}this._loading=!1}}_navigateToFolder(e){this._breadcrumbs=[...this._breadcrumbs,{title:e.title,media_content_id:e.media_content_id}],this._searchQuery="",this._browseMedia(e.media_content_id)}_navigateToBreadcrumb(e){const t=this._breadcrumbs[e];this._breadcrumbs=this._breadcrumbs.slice(0,e+1),this._searchQuery="",this._browseMedia(t.media_content_id)}_selectItem(e){this._selectedItem=e}_handleSave(){const e=this._selectedItem;if(e){const t=e.media_content_id;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}this._closeModal()}_getFilteredItems(){let e=this._items;if(this.mediaType&&(e=e.filter(e=>!!e.can_expand||this._matchesMediaType(e.media_class))),this._searchQuery){const t=this._searchQuery.toLowerCase();e=e.filter(e=>e.title.toLowerCase().includes(t))}return e}_matchesMediaType(e){const t=e.toLowerCase();return"image"===this.mediaType?"image"===t||"photo"===t||"picture"===t:"video"!==this.mediaType||"video"===t||"movie"===t||"clip"===t}_getItemIcon(e){if(e.can_expand)return"mdi:folder";const t=e.media_class.toLowerCase();return"image"===t||"photo"===t||"picture"===t?"mdi:image":"video"===t||"movie"===t||"clip"===t?"mdi:video":"music"===t||"audio"===t||"song"===t?"mdi:music":"mdi:file"}render(){return n.qy`
      <div class="with-icon with-action">
        <ha-icon icon=${"video"===this.mediaType?"mdi:video-outline":"mdi:image-outline"}></ha-icon>
        <input
          type="text"
          class="input"
          .value=${this.value}
          placeholder="/local/images/background.jpg"
          aria-label=${(0,l.t)(579)}
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
    `}_renderModal(){const e=this._getFilteredItems();return n.qy`
      ${(0,r.bU)((0,l.t)(900),()=>this._closeModal(),"m",n.qy`

          ${this._renderBreadcrumbs()}

          <div class="mc-picker-search">
            ${(0,r.LW)((0,l.t)(388),this._searchQuery,e=>{this._searchQuery=e})}
          </div>

          <div class="mc-picker-list" role="listbox" aria-label=${(0,l.t)(578)}>
            ${this._loading?n.qy`<div class="mc-picker-loading">${(0,l.t)(546)}</div>`:this._error?n.qy`<div class="mc-picker-empty">${this._error}</div>`:e.length>0?e.map(e=>this._renderItem(e)):n.qy`<div class="mc-picker-empty">${(0,l.t)(644)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,l.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave} ?disabled=${!this._selectedItem}>${(0,l.t)(865)}</button>
          </div>
      `)}
    `}_renderBreadcrumbs(){return this._breadcrumbs.length<=1?n.qy``:n.qy`
      <nav class="mc-picker-breadcrumbs" aria-label=${(0,l.t)(581)}>
        ${this._breadcrumbs.map((e,t)=>t===this._breadcrumbs.length-1?n.qy`<span class="mc-breadcrumb-current" aria-current="page">${e.title}</span>`:n.qy`
            <button type="button" class="btn btn-text btn-sm" @click=${()=>this._navigateToBreadcrumb(t)}>${e.title}</button>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          `)}
      </nav>
    `}_renderItem(e){const t=this._selectedItem?.media_content_id===e.media_content_id,i=this._getItemIcon(e);return n.qy`
      <button
        type="button"
        role="option"
        class="mc-picker-item"
        aria-selected=${t?"true":"false"}
        @click=${()=>{e.can_expand?this._navigateToFolder(e):e.can_play&&this._selectItem(e)}}
      >
        ${e.thumbnail?n.qy`<img class="mc-picker-item-thumb" src=${e.thumbnail} alt="" />`:n.qy`<span class="mc-picker-item-icon"><ha-icon icon=${i}></ha-icon></span>`}
        <span class="mc-picker-item-content">
          <span class="mc-picker-item-name">${e.title}</span>
        </span>
        ${e.can_expand?n.qy`<ha-icon class="mc-picker-item-chev" icon="mdi:chevron-right"></ha-icon>`:n.qy`<span class="chip">${e.media_class}</span>`}
      </button>
    `}};d.styles=[a.x,s.fz],c([(0,o.MZ)({attribute:!1})],d.prototype,"hass",void 0),c([(0,o.MZ)({type:String})],d.prototype,"value",void 0),c([(0,o.MZ)({type:String})],d.prototype,"mediaType",void 0),c([(0,o.wk)()],d.prototype,"_showModal",void 0),c([(0,o.wk)()],d.prototype,"_searchQuery",void 0),c([(0,o.wk)()],d.prototype,"_items",void 0),c([(0,o.wk)()],d.prototype,"_loading",void 0),c([(0,o.wk)()],d.prototype,"_error",void 0),c([(0,o.wk)()],d.prototype,"_breadcrumbs",void 0),c([(0,o.wk)()],d.prototype,"_selectedItem",void 0),d=c([(0,o.EM)("mc-media-picker")],d)},9788(e,t,i){i.d(t,{HK:()=>h,LW:()=>c,bU:()=>d,dt:()=>l});var n=i(6161),o=i(1413),s=i(9100);function a(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e:null}function r(e){const t=e.querySelector(".mc-picker-modal");t&&(t.tabIndex=-1,t.focus({preventScroll:!0}))}class l{constructor(e,t,i={}){this.host=e,this.onClose=t,this._dlg=null,this._downOnBackdrop=!1,this._returnFocus=null,this._onPointerdown=e=>{this._downOnBackdrop=e.target===this._dlg},this._onCancel=e=>{e.preventDefault(),this.onClose()},this._onNativeClose=e=>{e.target!==this._dlg||e.target.open||this.onClose()},this._onKeydown=e=>function(e){return t=>{"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),e())}}(this.onClose)(e),this._selector=i.selector??"dialog.mc-picker-overlay",this._focus=i.focus??r,e.addController(this)}hostUpdated(){const e=this.host.shadowRoot?.querySelector(this._selector)??null;e!==this._dlg&&(this._dlg&&this._closed(),e&&this._open(e))}hostConnected(){this.hostUpdated()}hostDisconnected(){this._dlg&&(this._closed(),this.onClose())}_open(e){if(this._dlg=e,this._returnFocus=a(),e.addEventListener("cancel",this._onCancel),e.addEventListener("close",this._onNativeClose),e.addEventListener("keydown",this._onKeydown),e.addEventListener("pointerdown",this._onPointerdown),e.open){if(function(e){try{return e.matches(":modal")}catch{return!1}}(e))return;e.removeAttribute("open")}if("function"==typeof e.showModal&&e.isConnected)try{return e.showModal(),void this._focus(e)}catch{}e.setAttribute("open","")}_closed(){const e=this._dlg;this._dlg=null,e.removeEventListener("cancel",this._onCancel),e.removeEventListener("close",this._onNativeClose),e.removeEventListener("keydown",this._onKeydown),e.removeEventListener("pointerdown",this._onPointerdown),this._downOnBackdrop=!1;try{e.close()}catch{}e.removeAttribute("open");const t=this._returnFocus;this._returnFocus=null,t?.isConnected&&t.focus({preventScroll:!0})}isBackdropClick(e){const t=e.target===this._dlg&&this._downOnBackdrop;return this._downOnBackdrop=!1,t}}function c(e,t,i,s={}){return n.qy`
    <div class="with-icon">
      <ha-icon icon="mdi:magnify"></ha-icon>
      <input
        id="mc-picker-search"
        class="input"
        type="text"
        placeholder=${e}
        aria-label=${e}
        role=${(0,o.J)(s.listId?"combobox":void 0)}
        aria-expanded=${(0,o.J)(s.listId?"true":void 0)}
        aria-controls=${(0,o.J)(s.listId)}
        aria-activedescendant=${(0,o.J)(s.activeId)}
        spellcheck="false"
        .value=${t}
        @input=${e=>i(e.target.value)}
        @keydown=${e=>s.onKeydown?.(e)}
      />
    </div>
  `}function d(e,t,i,o){return n.qy`<mc-ui-window
    heading=${e}
    closeLabel=${(0,s.t)(197)}
    variant=${"function"==typeof matchMedia&&matchMedia("(max-width: 599px)").matches?"sheet":"picker"}
    size=${i}
    initialFocus="mc-picker-search"
    movable
    resizable
    maximizable
    moveLabel=${(0,s.t)(610)}
    resizeLabel=${(0,s.t)(832)}
    maximizeLabel=${(0,s.t)(577)}
    restoreLabel=${(0,s.t)(833)}
    @mc-window-close=${t}
    >${o}</mc-ui-window>`}class h{constructor(e,t){this.host=e,this.onClose=t,this._shown=!1,this._back=null,e.addController(this)}win(){return this.host.shadowRoot?.querySelector("mc-ui-window")??null}hostUpdated(){const e=this.win();if(!e){const e=this._back;return this._shown=!1,this._back=null,void(e?.isConnected&&e.focus({preventScroll:!0}))}e.open||(this._shown||(this._back=a(),e.opener=this._back??void 0),this._shown=!0,e.show())}hostConnected(){this.hostUpdated()}hostDisconnected(){this._shown&&(this._shown=!1,this.win()?.close("action"),this.onClose())}}},7798(e,t,i){var n=i(6161),o=i(5707),s=i(158),a=i(9100),r=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let l=class extends n.WF{constructor(){super(...arguments),this.synced=!1,this.hasTemplate=!1,this.propertyPath="",this.hideIfNoTemplate=!1}_handleClick(e){e.preventDefault(),e.stopPropagation(),this.dispatchEvent(new CustomEvent("sync-toggle",{detail:{synced:this.synced,propertyPath:this.propertyPath},bubbles:!0,composed:!0}))}render(){return this.hasTemplate?this.synced?n.qy`
        <button
          class="sync"
          type="button"
          title=${(0,a.t)(1024)}
          @click=${this._handleClick}
        >
          <ha-icon icon="mdi:link-variant"></ha-icon><span class="sr-only">${(0,a.t)(1023)}</span>
        </button>
      `:n.qy`
      <button
        class="sync is-over"
        type="button"
        title=${(0,a.t)(712)}
        @click=${this._handleClick}
      >
        <ha-icon icon="mdi:link-variant-off"></ha-icon>
        ${(0,a.t)(711)}
      </button>
    `:this.hideIfNoTemplate?n.s6:n.qy``}};l.styles=[s.x,n.AH`
      :host {
        display: inline-flex;
        align-items: center;
        flex: none;
      }
    `],r([(0,o.MZ)({type:Boolean})],l.prototype,"synced",void 0),r([(0,o.MZ)({type:Boolean})],l.prototype,"hasTemplate",void 0),r([(0,o.MZ)({type:String})],l.prototype,"propertyPath",void 0),r([(0,o.MZ)({type:Boolean})],l.prototype,"hideIfNoTemplate",void 0),l=r([(0,o.EM)("mc-sync-indicator")],l)},7106(e,t,i){var n=i(6161),o=i(5707),s=i(158),a=i(9100),r=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const l=["px","em","rem","%","vw","vh"],c="custom",d=new Set(["px","em","rem","%","vw","vh","vmin","vmax","dvh","dvw","svh","svw","lvh","lvw","ch","ex","lh","rlh","cqw","cqh","cqi","cqb","cqmin","cqmax","cm","mm","q","in","pt","pc","s","ms","deg","rad","grad","turn","fr"]),h="[-+]?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[-+]?\\d+)?",u=new RegExp(`^${h}$`,"i"),p=new RegExp(`^(${h})\\s*([a-z]+|%)?$`,"i");function m(e){if("number"==typeof e)return Number.isFinite(e)?{number:String(e),custom:!1}:{number:"",custom:!1};const t="string"==typeof e?e.trim():"";if(!t)return{number:"",custom:!1};const i=t.match(p);if(!i)return{number:"",custom:!0};const n=i[2]?.toLowerCase();return n&&!d.has(n)?{number:"",custom:!0}:{number:String(Number(i[1])),unit:n,custom:!1}}let g=class extends n.WF{constructor(){super(...arguments),this.value="",this.label="",this.placeholder="",this.disabled=!1,this.compact=!1,this.inputId="",this.noCustom=!1,this._custom=!1}get _units(){return(this.units?.length?this.units:l).filter(e=>"auto"!==e&&e!==c)}willUpdate(e){e.has("value")&&String(this.value??"")!==this._emitted&&(this._custom=!1,this._unit=void 0,this._emitted=void 0)}revert(){this._custom=!1,this._unit=void 0,this._emitted=void 0,this.requestUpdate(),this.updateComplete.then(()=>{const e=this.renderRoot.querySelector("input"),t=m(this.value);e&&(e.value=t.custom?String(this.value??""):t.number)})}focus(){this.renderRoot.querySelector("input")?.focus()}_emit(e){this._emitted=e,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}}))}_shownUnit(e){return e.unit??this._unit??this._units[0]??"px"}_commitNumber(e){const t=m(this.value),i=e.value.trim();if(!i)return e.validity?.badInput?void(e.value=t.number):void(""!==String(this.value??"")&&this._emit(""));u.test(i)&&(i!==t.number||void 0===t.unit&&void 0!==this._unit)&&this._emit(`${i}${this._shownUnit(t)}`)}_commitText(e){const t=e.value.trim();t!==String(this.value??"").trim()&&this._emit(t)}_pickUnit(e){const t=e.value,i=m(this.value),n=this._custom||i.custom;if(t===c){if(n)return;return this._custom=!0,void this.updateComplete.then(()=>this.renderRoot.querySelector("input")?.focus())}if(this._unit=t,n){this._custom=!1;const e=m((this.renderRoot.querySelector("input")?.value??String(this.value??"")).trim());return void(!e.custom&&e.number?this._emit(`${e.number}${t}`):""!==String(this.value??"")&&this._emit(""))}i.number&&i.unit!==t&&this._emit(`${i.number}${t}`)}render(){const e=m(this.value),t=this._custom||e.custom,i=this._shownUnit(e),o=this._units.includes(i)?this._units:[...this._units,i],s=e=>{if("Enter"!==e.key)return;const i=e.target;t?this._commitText(i):this._commitNumber(i)};return n.qy`
      <div class="unit">
        ${t?n.qy`<input
              class="input mono"
              id=${this.inputId||n.s6}
              type="text"
              spellcheck="false"
              autocomplete="off"
              aria-label=${this.label||n.s6}
              placeholder="auto, calc(100% - 8px)"
              .value=${String(this.value??"")}
              ?disabled=${this.disabled}
              @change=${e=>this._commitText(e.target)}
              @keydown=${s}
            />`:n.qy`<input
              class="input"
              id=${this.inputId||n.s6}
              type="number"
              step="any"
              inputmode="decimal"
              aria-label=${this.label||n.s6}
              placeholder=${this.placeholder||"0"}
              .value=${e.number}
              ?disabled=${this.disabled}
              @change=${e=>this._commitNumber(e.target)}
              @keydown=${s}
            />`}
        <div class="select ${t?"is-custom":""}">
          <select class="input" aria-label=${this.label?(0,a.t)(1256,{label:this.label}):(0,a.t)(1122)} ?disabled=${this.disabled} @change=${e=>this._pickUnit(e.target)}>
            ${o.map(e=>n.qy`<option value=${e} ?selected=${!t&&i===e}>${e}</option>`)}
            ${this.noCustom&&!t?n.s6:n.qy`<option value=${c} ?selected=${t}>${(0,a.t)(255)}</option>`}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>
    `}};g.styles=[s.x,n.AH`
      :host {
        display: block;
        min-width: 0;
      }
      /* "Custom" needs a wider select than a unit */
      .unit > .select.is-custom {
        width: 92px;
      }
      .unit > .select.is-custom select {
        padding-right: 28px; /* physical */
      }
      .unit > .select.is-custom > ha-icon {
        right: 6px; /* physical */
      }
      /* compact (box field sides): a narrower unit select */
      :host([compact]) .unit > .input {
        min-width: 5ch;
        padding-left: 10px; /* physical */
        padding-right: 6px; /* physical */
      }
      :host([compact]) .unit > .select {
        width: 64px;
      }
      :host([compact]) .unit > .select.is-custom {
        width: 84px;
      }
      :host([compact]) .unit > .select select {
        padding-left: 8px; /* physical */
        padding-right: 24px; /* physical */
      }
      :host([compact]) .unit > .select > ha-icon {
        right: 4px; /* physical */
      }
    `],r([(0,o.MZ)({attribute:!1})],g.prototype,"value",void 0),r([(0,o.MZ)({type:String})],g.prototype,"label",void 0),r([(0,o.MZ)({type:String})],g.prototype,"placeholder",void 0),r([(0,o.MZ)({type:Boolean})],g.prototype,"disabled",void 0),r([(0,o.MZ)({type:Boolean,reflect:!0})],g.prototype,"compact",void 0),r([(0,o.MZ)({type:String})],g.prototype,"inputId",void 0),r([(0,o.MZ)({attribute:!1})],g.prototype,"units",void 0),r([(0,o.MZ)({type:Boolean})],g.prototype,"noCustom",void 0),r([(0,o.wk)()],g.prototype,"_custom",void 0),r([(0,o.wk)()],g.prototype,"_unit",void 0),g=r([(0,o.EM)("mc-unit-field")],g)},5056(e,t,i){i.d(t,{oS:()=>c,uw:()=>d,yp:()=>r}),i(2061);var n=i(3920),o=i(5512),s=i(2359);const a=e=>(new TextEncoder).encode(JSON.stringify(e)).length;function r(e,t){const i=e.custom_animations;if(i&&!Array.isArray(i))return{...e,custom_animations:{...i,...Object.fromEntries(t.map(e=>[String(e.id),e]))}};const n=new Set(t.map(e=>e.id));return{...e,custom_animations:[...(0,s.B)(i).filter(e=>!n.has(e.id)),...t]}}const l=(e,t)=>(0,s.B)(e?.custom_animations).some(e=>e.id===t);function c(e,t,i,s){if(!e||!1===e.attached)return;const a=e.getConfig();if(i){const i=function(e){const t=new Map,i=[e];for(;i.length;){const e=i.shift(),s=(0,o.T_)().get(e);if(s&&!t.has(e)){t.set(e,s);for(const e of s.steps??[])"string"==typeof e?.animation&&e.animation.startsWith(n.D8)&&i.push((0,n._R)(e.animation))}}return[...t.values()]}(t).filter(e=>!l(a,e.id));i.length&&e.updateConfig(r(a,i),!s)}else if(l(a,t)){const i=a.custom_animations,n=Array.isArray(i)?i.filter(e=>e?.id!==t):Object.fromEntries(Object.entries(i??{}).filter(([e])=>e!==t)),o={...a,custom_animations:n};Object.keys(n).length||delete o.custom_animations,e.updateConfig(o,!s)}}function d(e,t){const i=(0,o.T_)().get(t);i&&a(i)<=8192&&c(e,t,!0,!0)}i.d(t,["Wk",0,a,"av",0,l])},4025(e,t,i){function n(e){const t={};return e.dispatchEvent(new CustomEvent("mc-card-bridge",{bubbles:!0,composed:!0,detail:t})),t.sm}i.d(t,{d:()=>n})},7104(e,t,i){i.d(t,{$d:()=>m,QT:()=>p,kH:()=>d,lm:()=>g});var n=i(3034),o=i(4025),s=i(6562),a=i(5047),r=i(7503),l=i(4951),c=i(9100);function d(e,t,i){const n={...e,...t};for(const e of Object.keys(t))void 0===n[e]&&delete n[e];if(i&&(0,l.rJ)(i)){const o=new Set(e.not_synced??[]);for(const e of Object.keys(t))o.add((0,l.dy)(i,e));n.not_synced=[...o]}return n}const h=e=>"string"==typeof e&&""!==e.trim();function u(e,t,i){e&&!1!==e.attached&&e.updateConfig(t(e.getConfig()),!i)}function p(e,t,i){const n={...e.custom_icons??{}};void 0===i?delete n[t]:n[t]=i;const o={...e};return Object.keys(n).length?o.custom_icons=n:delete o.custom_icons,o}async function m(e){if(!await(0,r.sL)())return"failed";const t=(0,o.d)(e.from),l=await(0,s.fZ)(e.hass),d=document.createElement(n.sh),m="library"===e.source.kind?e.source.id:void 0;d.hass=e.hass,d.source=e.source,d.libraryAvailable="ok"===l.state,m&&"ok"===l.state&&(d.savedId=m),d.module=await async function(e,t,n){const o={icon:h(t.icon)&&"svg"!==t.icon&&!t.use_entity_icon?t.icon:"",hasStateIcons:h(t.icon_on)||h(t.icon_off),pickedAnimation:!1,followsIcon:!1,linked:n},s=t.design;if(e&&Array.isArray(s?.animations)&&s.animations.length)try{const n=await i.e(734).then(()=>i(1706));Object.assign(o,n.iconAnimationFacts(t,e.getConfig(),e.getState().templateAnimations))}catch{}return o}(t,e.module,e.linked),m&&"ok"===l.state&&void 0!==t?.getConfig().custom_icons?.[m]&&(0,s.sW)(e.hass,m).then(e=>{e&&t.getConfig().custom_icons?.[m]!==e.svg&&u(t,t=>p(t,m,e.svg),!0)});let g=()=>{};return d.addEventListener("mc-svg-save",i=>{var n;!function(e,t,i){if("library"===i.target&&i.saved){const n=i.saved.id;e.apply({icon:`mcu:${n}`,svg:void 0});const o=!!t?.getConfig().custom_icons?.[n];(i.keepCopy||o)&&u(t,e=>p(e,n,i.keepCopy?i.svg:void 0),!0)}else e.apply({icon:"svg",svg:i.svg})}(e,t,i.detail),g(),n=(0,c.t)(467),document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:n}}))}),d.addEventListener("mc-svg-close",()=>g()),g=(0,a.c)(d,{from:e.from,key:"icon-entry"}),"opened"}function g(e,t,i){const n=e.icon;if("svg"===n&&h(e.svg))return{kind:"svg",svg:e.svg};if("string"==typeof n&&n.startsWith("mcu:")){const e=n.slice(4),o=t?.custom_icons?.[e];if(i)return{kind:"library",id:e};if(h(o))return{kind:"svg",svg:o}}}},5047(e,t,i){function n(e,t){for(const i of e.querySelectorAll("*")){if(i.matches(t)&&i.textContent?.trim()&&i.getClientRects().length)return i;const e=i.shadowRoot&&n(i.shadowRoot,t);if(e)return e}}function o(e,t,i,o){const s=t?function(e){const t=[];for(let i=e;i;)i=i.parentNode??i.host??null,1===i?.nodeType&&t.push(i);return t}(t.from):[],a=document.createElement("dialog");a.className="mc-editor-layer",o&&a.setAttribute("aria-label",o),a.style.cssText="padding:0;border:0;margin:0;width:100vw;height:100vh;max-width:none;max-height:none;background:transparent;color:inherit;overflow:visible;",a.addEventListener("cancel",e=>e.preventDefault());const r=e=>{e.preventDefault(),e.stopPropagation()};a.addEventListener("keydown",e=>{"Escape"===e.key&&r(e)});const l=e=>{"Escape"!==e.key||e.composedPath().includes(a)||(r(e),i?.(),e.stopImmediatePropagation())};if(window.addEventListener("keydown",l,!0),e.tabIndex=-1,a.append(e),document.body.append(a),"function"==typeof a.showModal)try{a.showModal()}catch{a.setAttribute("open","")}else a.setAttribute("open","");return e.focus({preventScroll:!0}),()=>{if(window.removeEventListener("keydown",l,!0),a.isConnected){try{a.close()}catch{}a.remove(),t&&requestAnimationFrame(()=>requestAnimationFrame(()=>function(e,t){const i=`[data-focus-key="${t}"]`;for(const t of e){if(!t.isConnected)continue;const e=t.shadowRoot&&n(t.shadowRoot,i)||n(t,i);if(e)return e.focus({preventScroll:!0})}}(s,t.key)))}}}i.d(t,{c:()=>o})},9899(e,t,i){i.d(t,{uK:()=>m});var n=i(6161),o=i(5707),s=i(158),a=i(5056),r=i(4025),l=i(5047),c=i(7837),d=i(6562),h=i(9100),u=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let p=class extends n.WF{constructor(){super(...arguments),this.kind="animation",this._import=e=>{e.stopPropagation();const t=this.sm;var i,n,o;t&&!1!==t.attached&&(t.updateConfig((i=t.getConfig(),n=e.detail.kind,o=e.detail.items,"shape"===n?{...i,custom_shapes:{...i.custom_shapes,...Object.fromEntries(o.map(e=>[e.id,e.data]))}}:"icon"===n?{...i,custom_icons:{...i.custom_icons,...Object.fromEntries(o.map(e=>[e.id,e.data.svg]))}}:"animation"!==n?i:(0,a.yp)(i,o.map(e=>({...e.data,id:e.id,name:e.name})))),!0),this._config=t.getConfig())}}willUpdate(){this._config??=this.sm?.getConfig()}firstUpdated(){this.renderRoot.querySelector("mc-ui-window")?.show()}render(){return n.qy`<mc-ui-window .variant=${"function"==typeof matchMedia&&matchMedia("(max-width: 599px)").matches?"sheet":"picker"} heading=${(0,h.t)(518)} closeLabel=${(0,h.t)(197)} movable resizable maximizable moveLabel=${(0,h.t)(610)} resizeLabel=${(0,h.t)(832)} maximizeLabel=${(0,h.t)(577)} restoreLabel=${(0,h.t)(833)} @mc-window-close=${()=>this.onClose?.()}>
      <mc-library-view .hass=${this.hass} .source=${d.Jk} .config=${this._config} .inline=${!0} .startKind=${this.kind} @mc-transfer-import=${this._import}></mc-library-view>
    </mc-ui-window>`}};async function m(e,t,i){try{await(0,c.cs)()}catch{return n=(0,h.t)(1057),void document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:n}}))}var n;const o=document.createElement("mc-library-sheet");o.hass=t,o.kind=i,o.sm=(0,r.d)(e);const s=(0,l.c)(o,void 0,()=>o.onClose?.());o.parentElement?.setAttribute("aria-label",(0,h.t)(518)),o.onClose=()=>{s(),e.focus()}}p.styles=[s.x,n.AH`
      :host {
        display: contents;
      }
      mc-library-view {
        display: block;
      }
    `],u([(0,o.MZ)({attribute:!1})],p.prototype,"hass",void 0),u([(0,o.MZ)({type:String})],p.prototype,"kind",void 0),u([(0,o.MZ)({attribute:!1})],p.prototype,"onClose",void 0),u([(0,o.MZ)({attribute:!1})],p.prototype,"sm",void 0),u([(0,o.wk)()],p.prototype,"_config",void 0),p=u([(0,o.EM)("mc-library-sheet")],p)},6562(e,t,i){i.d(t,{wQ:()=>w,sW:()=>b,Jk:()=>k,fZ:()=>g,Zz:()=>f,$C:()=>x,F7:()=>$,k4:()=>v,VC:()=>y,yR:()=>_});var n=i(2061),o=i(5512),s=i(2359),a=i(3920);const r=/^mcu:([a-z0-9][a-z0-9_-]{0,63})$/,l=e=>String(e?.code??"");let c,d;const h={};let u=!1;async function p(e,t,i){if(u||!e?.callWS)return{state:"missing",items:[]};try{const n=await e.callWS({type:t}),o=Array.isArray(n?.[i])?n[i]:[];return h[i]=new Set(o.map(e=>String(e.id))),{state:"ok",items:o}}catch(e){return"unknown_command"===l(e)&&(u=!0),{state:"unknown_command"===l(e)?"missing":"error",items:[]}}}const m=()=>Promise.resolve({state:"missing",items:[]}),g=e=>e?.callWS?c??=p(e,n.dD.iconsList,"icons"):m(),f=e=>e?.callWS?d??=p(e,n.dD.shapesList,"shapes"):m();function v(e){return d=void 0,f(e)}async function b(e,t){if(e?.callWS)try{const i=await e.callWS({type:n.dD.iconsGet,ids:[t]});return i?.icons?.[0]}catch{return}}async function y(e,t){if(!e?.callWS)return{error:"unreachable"};try{const i=await e.callWS({type:n.dD.shapesSave,shape:t});return d=void 0,h.shapes=new Set([...h.shapes??[],i.shape.id]),{shape:i.shape}}catch(e){const t=l(e);return{error:"unauthorized"===t?"readonly":"library_full"===t?"full":"invalid_format"===t?"invalid":"unreachable"}}}function _(e,t){return e.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60).replace(/-+$/,"")||t}function w(e,t){if(!t.has(e))return e;for(let i=2;;i++)if(!t.has(`${e}-${i}`))return`${e}-${i}`}"undefined"!=typeof window&&window.addEventListener(n.S8,()=>{c=d=void 0});const $=e=>function(e,t){if(e.template)return e;t.animations&&(e=function(e,t){const i=(0,s.B)(e.custom_animations);if(!i.length)return e;const n=new Set((0,s.Gd)(e));for(let e=!0;e;){e=!1;for(const t of i){if(!n.has(String(t.id)))continue;const i=Array.isArray(t.steps)?t.steps:[];for(const t of i){const i="string"==typeof t?.animation&&t.animation.startsWith(a.D8)?(0,a._R)(t.animation):"";i&&!n.has(i)&&(e=!!n.add(i))}}}const o=e=>!n.has(String(e.id))&&t.has(String(e.id));if(!i.some(o))return e;const r=e.custom_animations,l={...e},c=Array.isArray(r)?r.filter(e=>!(e&&"object"==typeof e&&o(e))):Object.fromEntries(Object.entries(r).filter(([e,t])=>!(t&&"object"==typeof t&&o({id:e,...t}))));return Object.keys(c).length?l.custom_animations=c:delete l.custom_animations,l}(e,t.animations));const i=!!e.custom_icons&&"object"==typeof e.custom_icons,n=!!e.custom_shapes&&"object"==typeof e.custom_shapes;if(!(i&&t.icons||n&&t.shapes))return e;const o=function(e){const t=new Set,i=new Set,n=(e,o)=>{if("string"==typeof e){const i=r.exec(e);return void(i&&t.add(i[1]))}if(!e||"object"!=typeof e)return;if(Array.isArray(e)){for(const t of e)n(t,o);return}const s=e;"shape_options"===o&&"string"==typeof s.ref&&i.add(s.ref);for(const[e,t]of Object.entries(s))"custom_icons"!==e&&"custom_shapes"!==e&&n(t,e)};return n(e,""),{icons:t,shapes:i}}(e),l=(e,t,i)=>{const n=Object.entries(e).filter(([e])=>i.has(e)||!t.has(e));return n.length===Object.keys(e).length?void 0:Object.fromEntries(n)};let c=e;const d=i&&t.icons?l(e.custom_icons,t.icons,o.icons):void 0,h=n&&t.shapes?l(e.custom_shapes,t.shapes,o.shapes):void 0;return d&&(c={...c},Object.keys(d).length?c.custom_icons=d:delete c.custom_icons),h&&(c={...c},Object.keys(h).length?c.custom_shapes=h:delete c.custom_shapes),c}(e,{...h,animations:"ready"===(0,o.T_)().status?{has:e=>!!(0,o.T_)().get(e)}:void 0});function x(e){return{icons:!!e.custom_icons&&Object.keys(e.custom_icons).length>0&&!h.icons&&!u&&!c,shapes:!!e.custom_shapes&&Object.keys(e.custom_shapes).length>0&&!h.shapes&&!u&&!d}}const k={listIcons:g,listShapes:f,getIcon:b,isSaved:(e,t)=>!!h[e]?.has(t),reset:function(){c=d=void 0,h.icons=h.shapes=void 0,u=!1}}},7503(e,t,i){i.d(t,{RX:()=>l,sL:()=>r});var n=i(3034);let o,s;var a=i(7837);const r=function(){return customElements.get(n.sh)?Promise.resolve(!0):(o??=Promise.race([i.e(167).then(()=>i(7487)).then(()=>!0),new Promise(e=>setTimeout(()=>e(!1),8e3))]).then(e=>(e||(o=void 0),e),e=>(o=void 0,console.warn("Magic Card: SVG editor not loaded",e),!1)),o)},l=function(){return customElements.get(n.zh)?Promise.resolve(!0):(s??=Promise.race([i.e(820).then(()=>i(4906)).then(()=>!0),new Promise(e=>setTimeout(()=>e(!1),8e3))]).then(e=>(e||(s=void 0),e),e=>(s=void 0,console.warn("Magic Card: shape editor not loaded",e),!1)),s)};"undefined"!=typeof window&&(window.MagicCard=Object.assign(window.MagicCard??{},{loadSvgEditor:r,loadShapeEditor:l,loadTransfer:a.cs}))},7184(e,t,i){i.r(t),i.d(t,{EDITOR_VERSION:()=>xl,labelsReady:()=>Qt.G});var n=i(6161),o=i(5707),s=i(130),a=i(2359),r=i(6643),l=i(158),c=i(9207);class d{constructor(e=50){this.undoStack=[],this.redoStack=[],this.limit=e}push(e){this.undoStack.push((0,c.G)(e)),this.undoStack.length>this.limit&&this.undoStack.shift(),this.redoStack=[]}undo(e){return 0===this.undoStack.length?null:(this.redoStack.push((0,c.G)(e)),this.undoStack.pop())}redo(e){return 0===this.redoStack.length?null:(this.undoStack.push((0,c.G)(e)),this.redoStack.pop())}canUndo(){return this.undoStack.length>0}canRedo(){return this.redoStack.length>0}clear(){this.undoStack=[],this.redoStack=[]}get undoCount(){return this.undoStack.length}get redoCount(){return this.redoStack.length}}var h=i(9100);const u=["horizontal","vertical","row","tabs","slider-layout"];function p(e){const t=e;if(u.includes(e.type)&&(t.share_entity=!0),"row"===e.type&&Array.isArray(t.columns))for(const e of t.columns)e.share_entity=!0;return"text"===e.type&&"Hello World"===t.text?t.text=(0,h.t)(439):"button"===e.type&&"Button"===t.label?t.label=(0,h.t)(156):"tabs"===e.type&&Array.isArray(t.tabs)&&t.tabs.forEach((e,t)=>{e.label===`Tab ${t+1}`&&(e.label=(0,h.t)(1028,{n:t+1}))}),e}var m=i(6828),g=i(6562),f=i(8154);function v(e){const t=(0,f.W8)(e)??"1fr";if("auto"===t)return{value:0,unit:"auto"};const i=t.match(f.TL);return{value:Number(i[1]),unit:i[2]}}function b(e){const t=e.columns?.length||1;return(0,f.SU)(e)?(0,f.M0)(e.column_widths,t):function(e,t){if(!e||/^\d+(?:-\d+)*$/.test(e))return null;const i=e.trim().split(/\s+/).map(f.W8);return i.length===t&&i.every(e=>null!==e)?i:null}(e.layout,t)??function(e,t){if(e&&/^\d+(?:-\d+)*$/.test(e)){const i=e.split("-").map(e=>Math.max(Number(e)||1,1));if(i.length===t)return i}return Array.from({length:Math.max(t,1)},()=>1)}(e.layout,t).map(e=>`${e}fr`)}function y(e,t=360){const i=e.map(v);if(i.every(e=>"fr"===e.unit))return i.map(e=>e.value);let n=0,o=0;for(const e of i)"px"===e.unit?n+=e.value:"%"===e.unit?n+=e.value/100*t:o+="fr"===e.unit?e.value:1;const s=o>0?Math.max(t-n,.1*t*o)/o:0;return i.map(e=>{const i="px"===e.unit?e.value:"%"===e.unit?e.value/100*t:("fr"===e.unit?e.value:1)*s;return Math.max(i,.02*t)})}function _(e,t,i){const n=Math.max(t.split("-").length,1);for(;e.columns.length<n;)e.columns.push(i());for(;e.columns.length>n;){const t=e.columns.pop(),i=e.columns[e.columns.length-1];i.modules=[...i.modules||[],...t.modules||[]]}e.layout=t,delete e.column_widths}var w=i(2861);const $=()=>({id:(0,w.$)("col"),share_entity:!0,modules:[]});function x(e,t){for(const[i,n]of Object.entries(t))void 0===n&&delete e[i];return e}var k=i(7526),C=i(2453),M=i(2502),S=i(5667),A=i(5395),q=i(3920);const E="magic-card:module-clipboard",j=new Set(["__proto__","constructor","prototype"]);function T(e){if(Array.isArray(e))return e.map(e=>T(e));if(!e||"object"!=typeof e)return e;const t={};for(const[i,n]of Object.entries(e))"not_synced"===i||i.startsWith("_")||void 0===n||j.has(i)||(t[i]=T(n));return t}function z(e,t=0){if(!e||"object"!=typeof e||Array.isArray(e)||t>32)return!1;const i=e,n="string"==typeof i.type?k.s.get(i.type):void 0;if(!n)return!1;try{if(n.validate(i).length)return!1}catch{return!1}return((0,M.yZ)(i)??[]).every(e=>e.every(e=>z(e,t+1)))}function L(...e){const t=new Map;for(const i of e)for(const e of(0,a.B)(i))"string"==typeof e.id&&t.set(e.id,e);return t}function O(){try{const e=localStorage.getItem(E);if(!e)return;const t=JSON.parse(e);if(!t||"object"!=typeof t)return;const i=T(t.module&&"object"==typeof t.module?t.module:t);if(!z(i))return;return{module:i,docs:(0,a.B)(T(t.module?t.custom_animations:void 0)).filter(e=>"string"==typeof e.id)}}catch{return}}function R(){return O()?.module}const P=(e,t)=>JSON.stringify(e)===JSON.stringify(t);function H(e,t){const i=(e.startsWith("quick-")?e.replace(/-[a-z0-9]{6}$/,""):e).slice(0,56);for(;;){const e=`${i}-${Math.floor(Math.random()*36**6).toString(36).padStart(6,"0")}`;if(!t.has(e))return e}}function I(e,t){if(Array.isArray(e))return e.forEach(e=>I(e,t));if(!e||"object"!=typeof e)return;const i=e;for(const[e,n]of Object.entries(i))if("preset"!==e&&"animation"!==e||!(0,q.Bl)(n))n&&"object"==typeof n&&I(n,t);else{const o=t.get((0,q._R)(n));o&&(i[e]=`${q.D8}${o}`)}}var V=i(5512),D=i(6485);const F="magic-card:design-clipboard";function N(e){const t=(0,c.G)(e||{});for(const e of Object.keys(t))("not_synced"===e||e.startsWith("_")||void 0===t[e]||""===t[e])&&delete t[e];return t}function Z(e){const t=N(e);try{localStorage.setItem(F,JSON.stringify(t))}catch{}try{navigator.clipboard?.writeText((0,A.fE)(t))?.catch(()=>{})}catch{}return t}function B(){try{const e=localStorage.getItem(F);if(!e)return;const t=JSON.parse(e);return(e=>!!e&&"object"==typeof e&&!Array.isArray(e))(t)?t:void 0}catch{return}}function K(e,t,i){const n=N(t),o=(0,D.Sd)(n).map(e=>({...e,id:(0,w.$)("anim")})),s=(e=>(e||[]).map(e=>({...e,id:(0,w.$)("rule"),conditions:(e.conditions||[]).map(e=>e.id?{...e,id:(0,w.$)("cond")}:e)})))(n.conditional),a="replace"===i?{}:N(e),r={...a,...n},l="replace"===i?o:[...(0,D.Sd)(a),...o];for(const[e,t]of Object.entries((0,D.Tk)(l)))void 0===t?delete r[e]:r[e]=t;const c="replace"===i?s:[...a.conditional||[],...s];return c.length?r.conditional=c:delete r.conditional,r}var W=i(6365);function U(e){return e&&"string"==typeof e.id&&e.id?e.id:void 0}function G(e,t){if(!e.template)return!1;const i=(0,C.cv)(e,t);return!(!i||U(i)||t.child?.length&&U(e.rows[t.row]?.columns[t.col]?.modules[t.module]))}function Y(e,t){const i=[],n=(o,s,a)=>{if(!o||"object"!=typeof o)return;const r=(0,C.Iu)(o),l=function(e,t){const i=(0,C.$N)(e);if(i)return i;const n="string"==typeof e.entity?e.entity.trim():"";if(!n)return;const o=t?.states?.[n]?.attributes?.friendly_name;return"string"==typeof o&&o.trim()?o.trim():n}(o,t),c=U(o);i.push({value:c??`@${(0,C.VC)(s)}`,id:c,label:[...a,r,...l?[l]:[]].join(" · "),name:l??r,..."string"==typeof o.type?{type:o.type}:{},sel:s,...G(e,s)?{locked:!0}:{}}),((0,M.yZ)(o)??[]).forEach((e,t)=>{const i=(0,W.D)(o,t);e.forEach((e,o)=>n(e,(0,C.br)(s.row,s.col,s.module,[...s.child??[],{slot:t,index:o}]),[...a,r,...i?[i]:[]]))})};(e.rows||[]).forEach((e,t)=>(e?.columns||[]).forEach((e,i)=>(e?.modules||[]).forEach((e,o)=>n(e,(0,C.br)(t,i,o),[(0,h.t)(848,{n:t+1}),(0,h.t)(218,{n:i+1})]))));const o=new Map;for(const e of i)o.set(e.label,(o.get(e.label)??0)+1);for(const e of i){if((o.get(e.label)??0)<2)continue;const t=e.sel.child?.[e.sel.child.length-1];e.label=`${e.label} · ${(0,h.t)(599,{n:(t?t.index:e.sel.module)+1})}`}return i}function Q(e,t=new Set){if(!e||"object"!=typeof e)return t;const i=U(e);i&&t.add(i);for(const i of(0,M.yZ)(e)??[])for(const e of i)Q(e,t);return t}function J(e){const t=new Set;for(const i of e.rows||[])for(const e of i?.columns||[])for(const i of e?.modules||[])Q(i,t);return t}function X(e,t){const i=(0,C.cv)(e,t);if(!i)return;const n=U(i);if(n)return n;if(!G(e,t)){if(i.id=(0,w.$)(i.type||"module"),e.template&&t.child?.length){const i=e.rows[t.row]?.columns[t.col]?.modules[t.module],n=(0,M.us)(i),o=i?.not_synced||[];i&&n&&!o.includes(n)&&(i.not_synced=[...o,n])}return i.id}}function ee(e,t,i=Y(e)){if(!t.startsWith("@"))return t;const n=i.find(e=>e.value===t);return n&&!n.locked?X(e,n.sel):void 0}function te(){return{id:(0,w.$)("flow")}}function ie(e){if(!e.template)return;const t=e.not_synced||[];t.includes("flows")||(e.not_synced=[...t,"flows"])}function ne(e,t){const i=t.flows;if(!Array.isArray(i)||!i.length)return!1;const n=J(e),o=J(t),s=e=>"string"==typeof e&&n.has(e)&&!o.has(e),a=i.filter(e=>!(e&&"object"==typeof e&&(s(e.from)||s(e.to))));return a.length!==i.length&&(a.length?t.flows=a:delete t.flows,ie(t),!0)}var oe=i(7173);function se(e,t,i,n){if(!e.template)return;const o=e.rows[t]?.columns[i]?.modules[n],s=(0,M.us)(o);if(!o||!s)return;const a=o.not_synced||[];a.includes(s)||(o.not_synced=[...a,s])}function ae(e,t,i){if(!e.template)return;const n=e.rows[t]?.columns[i];n&&!n.not_synced?.includes("modules")&&(n.not_synced=[...n.not_synced||[],"modules"])}function re(e,t){const i={...e,...t};for(const[e,n]of Object.entries(t))void 0===n&&delete i[e];return i}function le(e){if(e&&"object"==typeof e){delete e.not_synced;for(const t of(0,M.yZ)(e)??[])for(const e of t)le(e)}}function ce(e){if(!e||"object"!=typeof e)return;e.id=(0,w.$)(e.type);const t=e;if("row"===e.type&&Array.isArray(t.columns))for(const e of t.columns)e&&"object"==typeof e&&e.id&&(e.id=(0,w.$)("col"));for(const t of(0,M.yZ)(e)??[])for(const e of t)ce(e)}const de=e=>!!e&&"object"==typeof e&&!Array.isArray(e);function he(e,t){if(!de(e)||!Array.isArray(e.tab_disabled_tabs))return!1;const i=[...new Set(e.tab_disabled_tabs.map(e=>"number"==typeof e?t(e):-1).filter(e=>e>=0))].sort((e,t)=>e-t);return i.length?e.tab_disabled_tabs=i:delete e.tab_disabled_tabs,!0}function ue(e,t){const i=e.design,n=he(i,t);let o=!1;const s=de(i)&&Array.isArray(i.conditional)?i.conditional:[];for(const e of s)de(e)&&he(e.design,t)&&(o=!0);return{base:n,rules:o}}const pe=e=>[...e.base?["design.tab_disabled_tabs"]:[],...e.rules?["design.conditional"]:[]];class me{constructor(e){this.fireEvent=e,this.undoRedo=new d,this.listeners=new Set,this.attached=!0,this.dragEnd=0,this.dragUndone=!1,this._selectionSeq=0,this._selectionReveal=!0,this.state={config:{type:"custom:magic-card",rows:[]},selectedPath:null,activeTab:"general",editorMode:"form",isDirty:!1},this.dispatchConfigChanged=function(e){let t=null,i=null;const n=function(...n){null!==t&&clearTimeout(t),i=()=>e.apply(this,n),t=setTimeout(()=>{t=null;const e=i;i=null,e?.()},200)};return n.cancel=()=>{null!==t&&(clearTimeout(t),t=null),i=null},n.flush=()=>{const e=i;n.cancel(),e?.()},n}(e=>{this.fireEvent(e)})}sendConfig(e){Date.now()<this.dragEnd?(this.dispatchConfigChanged.cancel(),this.dragNext=e,void 0===this.dragPace&&this.dragSend()):this.dispatchConfigChanged(e)}dragSend(e=!0){const t=this.dragNext;this.dragNext=this.dragPace=void 0,t&&(this.fireEvent(t),e&&(this.dragPace=setTimeout(()=>this.dragSend(),100)))}sliderMoved(){Date.now()>=this.dragEnd&&(this.dragUndone=!1),this.dragEnd=Date.now()+250}subscribe(e){return this.listeners.add(e),e(this.state),()=>this.listeners.delete(e)}notify(){this.listeners.forEach(e=>e(this.state))}getState(){return this.state}getConfig(){return this.state.config}getSelectedModule(){return(0,C.cv)(this.state.config,(0,C.c4)(this.state.selectedPath))??null}_moduleList(e,t,i,n,o){const s=e.rows[t]?.columns[i]?.modules;if(!s)return;if(!o?.length)return{list:s,index:n};const a=(0,S.Rv)(s[n],o.slice(0,-1)),r=o[o.length-1],l=a?(0,S.rX)(a,r.slot):void 0;return l?{list:l,index:r.index}:void 0}_pathWithIndex(e,t,i,n,o){if(!n?.length)return{rowIndex:e,columnIndex:t,moduleIndex:o};const s=n.map(e=>({...e}));return s[s.length-1].index=o,{rowIndex:e,columnIndex:t,moduleIndex:i,childPath:s}}_markChildList(e,t,i,n){se(e,t,i,n)}_clampedPath(e,t){return(0,C.bm)((0,C.Sh)(e,(0,C.c4)(t)))}_liveFlow(e){const t=this.state.selectedFlow??null;return t&&(0,oe.rP)(Array.isArray(e.flows)?e.flows:[]).includes(t)?t:null}setConfig(e){const t=(0,c.G)(e);this.state={...this.state,config:t,isDirty:!1,selectedPath:this._clampedPath(t,this.state.selectedPath),selectedFlow:this._liveFlow(t)},this.notify()}setTemplateAnimations(e){this.state={...this.state,templateAnimations:e},this.notify()}updateConfig(e,t=!0){const i=this.state.config;!t||Date.now()<this.dragEnd&&this.dragUndone||(this.undoRedo.push(this.state.config),this.dragUndone=Date.now()<this.dragEnd);const n=(0,c.G)(e),o="yaml"===this.state.editorMode?n:(0,g.F7)(n);this.state={...this.state,config:o,isDirty:!0,selectedPath:this._clampedPath(o,this.state.selectedPath),selectedFlow:this._liveFlow(o)},this.notify(),this.sendConfig(this.state.config);const s=e=>JSON.stringify(e).includes('"custom:cat-');(/"(custom:quick-|anim-icon-)/.test(JSON.stringify(o.rows))||s(i)||s(o))&&(0,m.qB)(this,i,o)}setEditorMode(e){this.state={...this.state,editorMode:"yaml"===e?"yaml":"form"},this.notify()}get selectionSeq(){return this._selectionSeq}get selectionReveal(){return this._selectionReveal}setSelectedPath(e,t={}){this._selectionSeq++,this._selectionReveal=!1!==t.reveal;const i=this._clampedPath(this.state.config,e);this.state={...this.state,selectedPath:i,selectedFlow:i?null:this.state.selectedFlow},this.notify()}selectFlow(e){this.state={...this.state,selectedFlow:e,selectedPath:e?null:this.state.selectedPath},this.notify()}addFlow(e,t){const i=(0,c.G)(this.state.config),n=X(i,e),o=X(i,t);if(!n||!o||n===o)return;const s={...te(),from:n,to:o};return i.flows=[...Array.isArray(i.flows)?i.flows:[],s],ie(i),this.updateConfig(i),this.selectFlow(s.id),s.id}_commitRemoval(e){ne(this.state.config,e),this.updateConfig(e)}setActiveTab(e){this.state={...this.state,activeTab:e},this.notify()}_equalLayout(e){return Array.from({length:Math.max(e,1)},()=>"1").join("-")}addRow(e="1"){const t=(0,c.G)(this.state.config),i=e.split("-").length,n=Array.from({length:i},$);t.rows.push({id:(0,w.$)("row"),share_entity:!0,layout:e,columns:n}),this.updateConfig(t)}deleteRow(e){const t=(0,c.G)(this.state.config);t.rows.splice(e,1),this._commitRemoval(t)}moveRow(e,t){if(e===t)return;const i=(0,c.G)(this.state.config),[n]=i.rows.splice(e,1);i.rows.splice(t,0,n),this.updateConfig(i)}updateRow(e,t){const i=(0,c.G)(this.state.config);i.rows[e]=x({...i.rows[e],...t},t),this.updateConfig(i)}setRowLayout(e,t){const i=(0,c.G)(this.state.config),n=i.rows[e];n&&(_(n,t,$),this._markRowLocal(i,n,"layout","column_widths"),this.updateConfig(i))}setColumnWidths(e,t,i,n=!1){const o=(0,c.G)(this.state.config),s=o.rows[e];s&&(t?.length?s.column_widths=[...t]:delete s.column_widths,i&&(s.layout=i),t?.length||i?this._markRowLocal(o,s,"column_widths",...i?["layout"]:[]):s.not_synced?.includes("column_widths")&&(s.not_synced=s.not_synced.filter(e=>"column_widths"!==e),s.not_synced.length||delete s.not_synced),this.updateConfig(o,!n))}_markRowLocal(e,t,...i){if(!e.template)return;const n=t.not_synced||[],o=i.filter(e=>!n.includes(e));o.length&&(t.not_synced=[...n,...o])}addColumn(e){const t=(0,c.G)(this.state.config),i=t.rows[e];i.columns.push($()),Array.isArray(i.column_widths)&&i.column_widths.length?(i.column_widths=[...(0,f.M0)(i.column_widths,i.columns.length-1),"1fr"],this._markRowLocal(t,i,"column_widths")):(delete i.column_widths,i.layout=this._equalLayout(i.columns.length)),this.updateConfig(t)}deleteColumn(e,t){const i=(0,c.G)(this.state.config),n=i.rows[e];if(n.columns.splice(t,1),0===n.columns.length)i.rows.splice(e,1);else if(n.layout=this._equalLayout(n.columns.length),Array.isArray(n.column_widths)&&n.column_widths.length){const e=(0,f.M0)(n.column_widths,n.columns.length+1);e.splice(t,1),n.columns.length<2?delete n.column_widths:n.column_widths=e,this._markRowLocal(i,n,"column_widths")}this._commitRemoval(i)}updateColumn(e,t,i){const n=(0,c.G)(this.state.config);n.rows[e].columns[t]=x({...n.rows[e].columns[t],...i},i),this.updateConfig(n)}_designItem(e,t){const i=e.rows[t.row],n=void 0!==t.col?i?.columns[t.col]:void 0;if(void 0!==t.module){const e=(0,S.Rv)(n?.modules[t.module],t.child??[]);return void 0===t.slot?e:"row"===e?.type?e.columns?.[t.slot]:void 0}return void 0!==t.col?n:i}copyDesign(e){Z(this._designItem(this.state.config,e)?.design)}pasteDesign(e,t){const i=B();if(!i)return!1;const n=(0,c.G)(this.state.config),o=this._designItem(n,e);if(!o)return!1;const s=o.design||{},a=K(o.design,i,t);if(o.design=a,n.template&&void 0!==e.module&&(e.child?.length||void 0!==e.slot))this._markChildList(n,e.row,e.col,e.module);else if(n.template){const t=new Set(o.not_synced||[]);if(void 0===e.module)t.add("design");else for(const e of new Set([...Object.keys(s),...Object.keys(a)]))JSON.stringify(s[e])!==JSON.stringify(a[e])&&t.add(`design.${e}`);o.not_synced=[...t]}return this.updateConfig(n),!0}addModule(e,t,i){const n=(0,c.G)(this.state.config),o=k.s.createDefault(i);if(!o)return;const s=p(o);n.rows[e].columns[t].modules.push(s);const a=n.rows[e].columns[t].modules.length-1;this.updateConfig(n),this.setSelectedPath({rowIndex:e,columnIndex:t,moduleIndex:a})}deleteModule(e,t,i,n){const o=(0,c.G)(this.state.config);if(n?.length){const s=this._moduleList(o,e,t,i,n);if(!s||!s.list[s.index])return;s.list.splice(s.index,1),this._markChildList(o,e,t,i);const a=n.slice(0,-1),r=(0,S.Rv)(o.rows[e].columns[t].modules[i],a);return this.state={...this.state,selectedPath:s.list.length?this._pathWithIndex(e,t,i,n,Math.min(s.index,s.list.length-1)):(0,S.WA)(r)?this._slotPath(e,t,i,a,n[n.length-1].slot):{rowIndex:e,columnIndex:t,moduleIndex:i,...a.length?{childPath:a.map(e=>({...e}))}:{}}},void this._commitRemoval(o)}o.rows[e].columns[t].modules.splice(i,1);const s=this.state.selectedPath;s?.rowIndex===e&&s.columnIndex===t&&void 0!==s.moduleIndex&&s.moduleIndex>i&&(this.state={...this.state,selectedPath:{...s,moduleIndex:s.moduleIndex-1}}),this._commitRemoval(o)}updateModule(e,t,i,n,o){const s=(0,c.G)(this.state.config),a=this._moduleList(s,e,t,i,o);a&&a.list[a.index]&&(a.list[a.index]={...a.list[a.index],...n},this._commitRemoval(s))}replaceModule(e,t,i,n,o){const s=(0,c.G)(this.state.config),a=this._moduleList(s,e,t,i,o);a&&a.list[a.index]&&(a.list[a.index]=(0,c.G)(n),this._commitRemoval(s))}moveModule(e,t,i,n,o,s){const a=(0,c.G)(this.state.config),[r]=a.rows[e].columns[t].modules.splice(i,1);a.rows[n].columns[o].modules.splice(s,0,r),this.updateConfig(a)}duplicateModule(e,t,i,n){const o=(0,c.G)(this.state.config),s=this._moduleList(o,e,t,i,n);if(!s||!s.list[s.index])return;const a=(0,c.G)(s.list[s.index]);ce(a),s.list.splice(s.index+1,0,a),n?.length&&this._markChildList(o,e,t,i),this.state={...this.state,selectedPath:this._pathWithIndex(e,t,i,n,s.index+1)},this.updateConfig(o)}duplicateRow(e){const t=(0,c.G)(this.state.config),i=(0,c.G)(t.rows[e]);i.id=(0,w.$)("row");for(const e of i.columns){e.id=(0,w.$)("col");for(const t of e.modules)ce(t)}t.rows.splice(e+1,0,i),this.state={...this.state,selectedPath:{rowIndex:e+1}},this.updateConfig(t)}moveModuleBy(e,t,i,n,o){if(o?.length){const s=(0,c.G)(this.state.config),a=this._moduleList(s,e,t,i,o),r=(a?.index??-1)+n;if(!a||!a.list[a.index]||r<0||r>=a.list.length)return!1;const[l]=a.list.splice(a.index,1);return a.list.splice(r,0,l),this._markChildList(s,e,t,i),this.state={...this.state,selectedPath:this._pathWithIndex(e,t,i,o,r)},this.updateConfig(s),!0}const s=this.state.config.rows[e]?.columns[t]?.modules,a=i+n;return!(!s||a<0||a>=s.length||(this.state={...this.state,selectedPath:{rowIndex:e,columnIndex:t,moduleIndex:a}},this.moveModule(e,t,i,e,t,a),0))}moveModuleToColumn(e,t,i,n,o){const s=this.state.config.rows,a=s[n]?.columns[o];if(!s[e]?.columns[t]?.modules?.[i]||!a)return!1;if(e===n&&t===o)return!1;const r=(0,c.G)(this.state.config),[l]=r.rows[e].columns[t].modules.splice(i,1),d=r.rows[n].columns[o];return Array.isArray(d.modules)||(d.modules=[]),d.modules.push(l),this.state={...this.state,selectedPath:{rowIndex:n,columnIndex:o,moduleIndex:d.modules.length-1}},this.updateConfig(r),!0}moveChildToSlot(e,t,i,n,o){if(!n.length)return!1;if(n[n.length-1].slot===o)return!1;const s=(0,c.G)(this.state.config),a=this._moduleList(s,e,t,i,n),r=(0,S.Rv)(s.rows[e]?.columns[t]?.modules[i],n.slice(0,-1)),l=r?(0,S.rX)(r,o):void 0;if(!a||!a.list[a.index]||!l)return!1;const[d]=a.list.splice(a.index,1);l.push(d),this._markChildList(s,e,t,i);const h=n.map(e=>({...e}));return h[h.length-1]={slot:o,index:l.length-1},this.state={...this.state,selectedPath:{rowIndex:e,columnIndex:t,moduleIndex:i,childPath:h}},this.updateConfig(s),!0}_editItem(e,t,i){const n=(0,c.G)(this.state.config),o=(0,C.R9)(n,e);if(!o||!1===i(o))return!1;if(n.template&&"card"!==e.kind)if("slot"===e.kind||"module"===e.kind&&e.child?.length)this._markChildList(n,e.row,e.col,e.module);else{const e=o.not_synced||[];e.includes(t)||(o.not_synced=[...e,t])}return this.updateConfig(n),!0}setHidden(e,t){return"card"!==e.kind&&this._editItem(e,"hidden",e=>{if(!0===e.hidden===t)return!1;t?e.hidden=!0:delete e.hidden})}setLayerName(e,t,i){const n=t.trim();if("card"===e.kind)return this._editItem(e,"name",e=>{if((e.name??"")===n)return!1;n?e.name=n:delete e.name});if("slot"===e.kind&&"tabs"===(0,C.kW)(this.state.config,e)?.type){const t=(0,C.R9)(this.state.config,e);return!(!n||!t||t.label===n||(this.renameTab(e.row,e.col,e.module,e.child?.map(e=>({...e})),e.slot,n),0))}const o=n&&n!==i?n:void 0;return this._editItem(e,"editor_name",e=>{if(e.editor_name===o)return!1;o?e.editor_name=o:delete e.editor_name})}_playedDocs(e){return(0,s.wL)(e,this.state.templateAnimations).custom_animations}copyModule(e){const t=(0,C.cv)(this.state.config,e);if(t)return function(e,t=[]){const i=T(e);try{localStorage.setItem(E,JSON.stringify({module:i,custom_animations:T(t)}))}catch{}try{navigator.clipboard?.writeText((0,A.fE)(i))?.catch(()=>{})}catch{}return i}(t,function(e,t){const i=new Map,n=(0,a.Gd)(e);for(;n.length;){const e=n.shift(),o=t.get(e);if(!o||i.has(e))continue;i.set(e,o);const s=o.steps;for(const e of Array.isArray(s)?s:[])(0,q.Bl)(e?.animation)&&n.push((0,q._R)(e.animation))}return[...i.values()]}(t,L(this._playedDocs(this.state.config))))}pasteModule(e){const t=O();if(!t)return!1;const i=(0,c.G)(t.module);ce(i);const n=(0,c.G)(this.state.config),o=(0,a.B)(n.custom_animations),s=[...(0,a.Gd)(n),...(0,V.T_)().list().map(e=>e.id)],r=function(e,t,i,n){const o=new Set([...n,...i.keys(),...t.map(e=>String(e.id))]),s=new Map,a=[];for(const e of t){const t=String(e.id),n=i.get(t);if(n&&(P(n,e)||t.startsWith("cat-")))continue;const r={...e};n&&(r.id=H(t,o),o.add(r.id),s.set(t,r.id)),a.push(r)}return s.size&&(I(e,s),I(a,s)),a}(i,t.docs,L(this._playedDocs(n)),s);let l;if(r.length&&(n.custom_animations=[...o,...r]),"module"===e.kind){const t=this._moduleList(n,e.row,e.col,e.module,e.child);if(!t||!t.list[t.index])return!1;t.list.splice(t.index+1,0,i),e.child?.length&&this._markChildList(n,e.row,e.col,e.module),l=this._pathWithIndex(e.row,e.col,e.module,e.child,t.index+1)}else if("column"===e.kind){const t=n.rows[e.row]?.columns[e.col];if(!t)return!1;Array.isArray(t.modules)||(t.modules=[]),l={rowIndex:e.row,columnIndex:e.col,moduleIndex:t.modules.push(i)-1}}else{if("slot"!==e.kind)return!1;{const t=this._layoutIn(n,e.row,e.col,e.module,e.child),o=t?(0,S.rX)(t,e.slot):void 0;if(!o)return!1;const s=o.push(i)-1;this._markChildList(n,e.row,e.col,e.module),l={rowIndex:e.row,columnIndex:e.col,moduleIndex:e.module,childPath:[...(e.child??[]).map(e=>({...e})),{slot:e.slot,index:s}]}}}return this.state={...this.state,selectedPath:l},this.updateConfig(n),!0}wrapInLayout(e,t){if("module"!==e.kind)return!1;const i=k.s.createDefault(t),n=i&&p(i),o=n?(0,S.rX)(n,0):void 0;if(!n||!o)return!1;const s=(0,c.G)(this.state.config),a=this._moduleList(s,e.row,e.col,e.module,e.child);return!(!a||!a.list[a.index]||(o.splice(0,o.length,a.list[a.index]),a.list[a.index]=n,e.child?.length?this._markChildList(s,e.row,e.col,e.module):ae(s,e.row,e.col),this.state={...this.state,selectedPath:this._pathWithIndex(e.row,e.col,e.module,e.child,a.index)},this.updateConfig(s),0))}_resetTarget(e,t){if(!e.template||"card"===t.kind)return;if("slot"===t.kind||"module"===t.kind&&t.child?.length){const i=e.rows[t.row]?.columns[t.col]?.modules?.[t.module],n=(0,M.us)(i);return i&&n&&i.not_synced?.includes(n)?{item:i,key:n}:void 0}const i=(0,C.R9)(e,t);if(!i)return;const n=i.not_synced?.length,o="module"===t.kind&&JSON.stringify((0,M.yZ)(i)??[]).includes('"not_synced"');return n||o?{item:i}:void 0}hasOverrides(e){return!!this._resetTarget(this.state.config,e)}ownsModuleList(e){return!("column"!==e.kind||!this.state.config.template||!this.state.config.rows[e.row]?.columns[e.col]?.not_synced?.includes("modules"))}resetItem(e,t=!1){if(this.ownsModuleList(e)&&!t)return!1;const i=(0,c.G)(this.state.config),n=this._resetTarget(i,e);if(!n)return!1;if(n.key){const e=n.item.not_synced.filter(e=>e!==n.key);e.length?n.item.not_synced=e:delete n.item.not_synced}else"module"===e.kind?le(n.item):(t&&"column"===e.kind&&(n.item.modules=[]),delete n.item.not_synced);return this.updateConfig(i),!0}_layoutIn(e,t,i,n,o){return(0,S.Rv)(e.rows[t]?.columns[i]?.modules?.[n],o??[])}_editLayout(e,t,i,n,o=!1){const[s,a,r,l]=e,d=(0,c.G)(this.state.config),h=this._layoutIn(d,s,a,r,l);if(h&&!1!==i(h)){if("row"===h.type&&Array.isArray(h.columns))for(const e of h.columns)e&&"object"==typeof e&&!e.id&&(e.id=(0,w.$)("col"));if(d.template)if(l?.length)this._markChildList(d,s,a,r);else{const e=h.not_synced||[],i=("function"==typeof t?t(h):t).filter(t=>!e.includes(t));i.length&&(h.not_synced=[...e,...i])}n&&(this.state={...this.state,selectedPath:n(h)}),ne(this.state.config,d),this.updateConfig(d,!o)}}_slotPath(e,t,i,n,o){return{rowIndex:e,columnIndex:t,moduleIndex:i,...n?.length?{childPath:n.map(e=>({...e}))}:{},slotIndex:o}}addChildModule(e,t,i,n,o,s){const a=k.s.createDefault(s);if(!a)return;const r=p(a);let l=-1;this._editLayout([e,t,i,n],e=>[(0,M.us)(e)],e=>{const t=(0,S.rX)(e,o);if(!t)return!1;l=t.push(r)-1},()=>({rowIndex:e,columnIndex:t,moduleIndex:i,childPath:[...(n??[]).map(e=>({...e})),{slot:o,index:l}]}))}_tabsEdit(e,t,i,n=()=>[]){this._editLayout(e,()=>["tabs",...n()],e=>"tabs"===e.type&&(Array.isArray(e.tabs)||(e.tabs=[]),t(e.tabs,e)),i)}addTab(e,t,i,n){this._tabsEdit([e,t,i,n],e=>{e.push({label:(0,h.t)(1028,{n:e.length+1}),modules:[]})},o=>this._slotPath(e,t,i,n,o.tabs.length-1))}renameTab(e,t,i,n,o,s){this.updateTab(e,t,i,n,o,{label:s})}updateTab(e,t,i,n,o,s){this._tabsEdit([e,t,i,n],e=>{if(!e[o])return!1;if("label"in s&&!s.label?.trim()){const t=e[o].label?.trim()?e[o].label:(0,h.t)(1028,{n:o+1});if(t===e[o].label&&1===Object.keys(s).length)return!1;s={...s,label:t}}e[o]=re(e[o],s)})}moveTab(e,t,i,n,o,s){const a=o+s;let r={base:!1,rules:!1};this._tabsEdit([e,t,i,n],(e,t)=>{if(!e[o]||a<0||a>=e.length)return!1;const[i]=e.splice(o,1);e.splice(a,0,i);const n=Number(t.active_tab??0);n===o?t.active_tab=a:n===a&&(t.active_tab=o),r=ue(t,e=>e===o?a:e===a?o:e)},()=>this._slotPath(e,t,i,n,a),()=>pe(r))}deleteTab(e,t,i,n,o){let s={base:!1,rules:!1};this._tabsEdit([e,t,i,n],(e,t)=>{if(!e[o]||e.length<=1)return!1;e.splice(o,1);const i=Number(t.active_tab??0);i>o&&(t.active_tab=i-1),Number(t.active_tab??0)>=e.length&&(e.length>1?t.active_tab=e.length-1:delete t.active_tab),s=ue(t,e=>e===o?-1:e>o?e-1:e)},s=>s.tabs.length?this._slotPath(e,t,i,n,Math.min(o,s.tabs.length-1)):{rowIndex:e,columnIndex:t,moduleIndex:i,...n?.length?{childPath:n.map(e=>({...e}))}:{}},()=>pe(s))}_rowEdit(e,t,i,n,o=!1){this._editLayout(e,t,e=>"row"===e.type&&(Array.isArray(e.columns)||(e.columns=[]),i(e.columns,e)),n,o)}addNestedColumn(e,t,i,n){this._rowEdit([e,t,i,n],["columns","layout","column_widths"],(e,t)=>{e.push($()),Array.isArray(t.column_widths)&&t.column_widths.length?t.column_widths=[...(0,f.M0)(t.column_widths,e.length-1),"1fr"]:(delete t.column_widths,t.layout=this._equalLayout(e.length))},o=>this._slotPath(e,t,i,n,o.columns.length-1))}deleteNestedColumn(e,t,i,n,o){this._rowEdit([e,t,i,n],["columns","layout","column_widths"],(e,t)=>{if(e.length<=1||!e[o])return!1;if(e.splice(o,1),t.layout=this._equalLayout(e.length),Array.isArray(t.column_widths)&&t.column_widths.length){const i=(0,f.M0)(t.column_widths,e.length+1);i.splice(o,1),e.length<2?delete t.column_widths:t.column_widths=i}},s=>this._slotPath(e,t,i,n,Math.min(o,s.columns.length-1)))}moveNestedColumn(e,t,i,n,o,s){const a=o+s,r=["columns"];this._rowEdit([e,t,i,n],()=>r,(e,t)=>{if(o<0||o>=e.length||a<0||a>=e.length)return!1;const i=e=>{[e[o],e[a]]=[e[a],e[o]]};if(i(e),Array.isArray(t.column_widths)&&t.column_widths.length){const n=(0,f.M0)(t.column_widths,e.length);i(n),t.column_widths=n,r.push("column_widths")}else if("string"==typeof t.layout){const n=/^\d+(?:-\d+)*$/.test(t.layout),o=n?t.layout.split("-"):t.layout.trim().split(/\s+/);if(o.length===e.length){i(o);const e=o.join(n?"-":" ");e!==t.layout&&(t.layout=e,r.push("layout"))}}},()=>this._slotPath(e,t,i,n,a))}setNestedRowLayout(e,t,i,n,o){const s=["column_widths"];this._rowEdit([e,t,i,n],()=>s,(e,t)=>{const i=e.length,n=t.layout;_({...t,columns:e},o,$),t.layout=o,delete t.column_widths,n!==o&&s.push("layout"),e.length!==i&&s.push("columns")})}setNestedColumnWidths(e,t,i,n,o,s,a=!1){const r=!!o?.length||!!s;this._rowEdit([e,t,i,n],r?["column_widths",...s?["layout"]:[]]:[],(e,t)=>{o?.length?t.column_widths=[...o]:delete t.column_widths,s&&(t.layout=s),r||n?.length||!Array.isArray(t.not_synced)||(t.not_synced=t.not_synced.filter(e=>"column_widths"!==e),t.not_synced.length||delete t.not_synced)},void 0,a)}updateNestedColumn(e,t,i,n,o,s){this._rowEdit([e,t,i,n],["columns"],e=>{if(!e[o])return!1;e[o]=re(e[o],s)})}undo(){const e=this.undoRedo.undo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0,selectedPath:this._clampedPath(e,this.state.selectedPath),selectedFlow:this._liveFlow(e)},this.notify(),this.sendConfig(e))}redo(){const e=this.undoRedo.redo(this.state.config);e&&(this.state={...this.state,config:e,isDirty:!0,selectedPath:this._clampedPath(e,this.state.selectedPath),selectedFlow:this._liveFlow(e)},this.notify(),this.sendConfig(e))}canUndo(){return this.undoRedo.canUndo()}canRedo(){return this.undoRedo.canRedo()}flush(){clearTimeout(this.dragPace),this.dragSend(!1),this.dispatchConfigChanged.flush()}destroy(){clearTimeout(this.dragPace),this.dragNext=this.dragPace=void 0,this.dispatchConfigChanged.cancel(),this.listeners.clear(),this.undoRedo.clear()}}function ge(e){if(e&&"object"==typeof e){delete e.not_synced;for(const t of(0,M.yZ)(e)??[])for(const e of t)ge(e)}}function fe(e){const t=[];e.not_synced?.length&&t.push({location:(0,h.t)(167),paths:[...e.not_synced]});for(let i=0;i<(e.rows||[]).length;i++){const n=e.rows[i];n.not_synced?.length&&t.push({location:(0,h.t)(848,{n:i+1}),paths:[...n.not_synced]});for(let e=0;e<(n.columns||[]).length;e++){const o=n.columns[e];o.not_synced?.length&&t.push({location:(0,h.t)(849,{row:i+1,col:e+1}),paths:[...o.not_synced]});for(let e=0;e<(o.modules||[]).length;e++){const i=o.modules[e];if(i.not_synced?.length){const e=i.label||i.type;t.push({location:`${e}`,paths:[...i.not_synced]})}}}}return t}function ve(e){return fe(e).reduce((e,t)=>e+t.paths.length,0)}function be(e){const t=(0,c.G)(e);delete t.not_synced,delete t.hidden_animations;for(const e of t.rows||[]){delete e.not_synced;for(const t of e.columns||[]){delete t.not_synced;for(const e of t.modules||[])ge(e)}}return t}function ye(e){const t=be(e);delete t.template,delete t.entity;for(const e of s.lC)delete t[e];return t}function _e(e,t,i){const n=new Set(e||[]);return i?n.add(t):n.delete(t),Array.from(n)}function we(e,t){return i=>{const n=new Set(i.not_synced||[]),o=e,s=i,a=new Set(["id","type","not_synced","design","actions","display"]);for(const e of Object.keys(s))a.has(e)||s[e]!==o[e]&&n.add(e);void 0===o.entity||"entity"in s||n.add("entity"),s.not_synced=Array.from(n),t(i)}}const $e=[{label:543,value:"visible"},{label:238,value:"hidden"},{label:411,value:"scroll"},{label:36,value:"auto"}],xe=[{label:321,value:"normal"},{label:69,value:"bold"},{label:0,value:"100"},{label:1,value:"200"},{label:2,value:"300"},{label:4,value:"400"},{label:5,value:"500"},{label:6,value:"600"},{label:7,value:"700"},{label:8,value:"800"},{label:9,value:"900"}],ke=[{label:320,value:"none"},{label:535,value:"uppercase"},{label:298,value:"lowercase"},{label:101,value:"capitalize"}],Ce=[{label:83,value:"border-box"},{label:348,value:"padding-box"},{label:125,value:"content-box"}],Me=[{label:320,value:"none"},{label:439,value:"solid"},{label:131,value:"dashed"},{label:157,value:"dotted"},{label:158,value:"double"},{label:230,value:"groove"},{label:388,value:"ridge"},{label:257,value:"inset"},{label:339,value:"outset"}],Se=Me;function Ae(e,t,i,n,o){return{key:e,cssProperty:t,label:i,type:n,...o?{options:o}:{}}}function qe(e,t,i,n={}){return{key:e,cssProperty:"",label:t,type:i,virtual:!0,...n}}const Ee=(e,t,i,n={})=>qe(e,t,i,n),je=(e,t,i,n={})=>Ee(e,t,i,{hover:!0,tabState:!0,...n}),Te=(e,t,i,n={})=>qe(e,t,i,{hover:!0,...n}),ze={hideForVariant:["icon-only"]},Le=["px","em","rem"],Oe=[...Le,"%"],Re=[{id:"bar",name:53},{id:"text",name:507},{id:"border",name:70},{id:"icon",name:242},{id:"effects",name:177}],Pe={border_length_align:"border_length",border_length_sides:"border_length",icon_background_shape:"icon_background"},He=[{id:"spacing",name:444,icon:"mdi:arrow-expand-all",leading:["padding","margin","width","min_height"],properties:[Ae("margin","margin",300,"box"),Ae("padding","padding",347,"box"),Ae("width","width",552,"unit"),Ae("height","height",237,"unit"),Ae("min_width","min-width",307,"unit"),Ae("min_height","min-height",306,"unit"),Ae("max_width","max-width",304,"unit"),Ae("max_height","max-height",303,"unit"),Ae("box_sizing","box-sizing",90,"select",[{label:125,value:"content-box"},{label:83,value:"border-box"}])]},{id:"borders",name:85,icon:"mdi:border-all",leading:["border_radius","border_width","border_style","border_color","border_length","border_length_align","border_length_sides","box_shadow"],properties:[Ae("border","border",70,"text"),Ae("border_top","border-top",81,"text"),Ae("border_right","border-right",77,"text"),Ae("border_bottom","border-bottom",71,"text"),Ae("border_left","border-left",74,"text"),{...Ae("border_width","border-width",82,"sides"),sides:{cell:"length"},units:["px","em","rem"]},{...Ae("border_style","border-style",80,"sides",Me),sides:{cell:"style"}},{...Ae("border_color","border-color",73,"sides"),sides:{cell:"color"}},qe("border_length",75,"unit",{units:["%","px"],help:424}),qe("border_length_align",17,"segmented",{defaultValue:"center",options:[{label:456,value:"start"},{label:103,value:"center"},{label:180,value:"end"}]}),qe("border_length_sides",425,"select",{emptyLabel:18,options:[{label:517,value:"top"},{label:389,value:"right"},{label:87,value:"bottom"},{label:276,value:"left"}]}),Ae("border_radius","border-radius",76,"box"),Ae("outline","outline",334,"text"),Ae("outline_width","outline-width",338,"unit"),Ae("outline_style","outline-style",337,"select",Se),Ae("outline_color","outline-color",335,"color"),Ae("outline_offset","outline-offset",336,"unit"),Ae("box_shadow","box-shadow",89,"text")]},{id:"shape",name:421,icon:"mdi:hexagon-outline",properties:[qe("shape",421,"shape")]},{id:"value-background",name:537,icon:"mdi:chart-areaspline-variant",properties:[qe("value_background",537,"value_bg")]},{id:"positioning",name:363,icon:"mdi:page-layout-body",properties:[Ae("position","position",362,"select",[{label:460,value:"static"},{label:380,value:"relative"},{label:12,value:"absolute"},{label:193,value:"fixed"},{label:462,value:"sticky"}]),{...Ae("top","top",328,"box"),keys:["top","right","bottom","left"]},{...Ae("right","right",389,"unit"),part:!0},{...Ae("bottom","bottom",87,"unit"),part:!0},{...Ae("left","left",276,"unit"),part:!0},Ae("inset","inset",257,"unit"),Ae("display","display",143,"select",[{label:67,value:"block"},{label:253,value:"inline"},{label:254,value:"inline-block"},{label:196,value:"flex"},{label:255,value:"inline-flex"},{label:228,value:"grid"},{label:256,value:"inline-grid"},{label:320,value:"none"},{label:126,value:"contents"}]),Ae("visibility","visibility",542,"select",[{label:543,value:"visible"},{label:238,value:"hidden"},{label:114,value:"collapse"}]),Ae("opacity","opacity",330,"text"),Ae("z_index","z-index",562,"number"),Ae("overflow","overflow",341,"select",$e),Ae("overflow_x","overflow-x",342,"select",$e),Ae("overflow_y","overflow-y",343,"select",$e),Ae("float","float",206,"select",[{label:320,value:"none"},{label:276,value:"left"},{label:389,value:"right"}]),Ae("clear","clear",107,"select",[{label:320,value:"none"},{label:276,value:"left"},{label:389,value:"right"},{label:86,value:"both"}]),Ae("cursor","cursor",129,"select",[{label:36,value:"auto"},{label:134,value:"default"},{label:358,value:"pointer"},{label:309,value:"move"},{label:507,value:"text"},{label:545,value:"wait"},{label:128,value:"crosshair"},{label:322,value:"not-allowed"},{label:225,value:"grab"},{label:320,value:"none"}]),Ae("pointer_events","pointer-events",359,"select",[{label:36,value:"auto"},{label:320,value:"none"}])]},{id:"typography",name:531,icon:"mdi:format-font",leading:["color","font_family","font_weight","font_size","text_transform"],properties:[Ae("font_family","font-family",209,"font"),Ae("font_size","font-size",210,"unit"),Ae("font_weight","font-weight",213,"select",xe),Ae("font_style","font-style",211,"select",[{label:321,value:"normal"},{label:262,value:"italic"},{label:325,value:"oblique"}]),Ae("font_variant","font-variant",212,"text"),Ae("color","color",115,"color"),Ae("text_align","text-align",508,"select",[{label:276,value:"left"},{label:103,value:"center"},{label:389,value:"right"},{label:265,value:"justify"}]),Ae("text_decoration","text-decoration",509,"select",[{label:320,value:"none"},{label:532,value:"underline"},{label:345,value:"overline"},{label:286,value:"line-through"}]),Ae("text_transform","text-transform",513,"select",ke),Ae("text_indent","text-indent",510,"unit"),Ae("text_overflow","text-overflow",511,"select",[{label:108,value:"clip"},{label:178,value:"ellipsis"}]),Ae("text_shadow","text-shadow",512,"text"),Ae("line_height","line-height",285,"text"),Ae("letter_spacing","letter-spacing",278,"unit"),Ae("word_spacing","word-spacing",559,"unit"),Ae("white_space","white-space",551,"select",[{label:321,value:"normal"},{label:323,value:"nowrap"},{label:365,value:"pre"},{label:367,value:"pre-wrap"},{label:366,value:"pre-line"},{label:92,value:"break-spaces"}]),Ae("word_break","word-break",558,"select",[{label:321,value:"normal"},{label:91,value:"break-all"},{label:267,value:"keep-all"},{label:93,value:"break-word"}]),Ae("overflow_wrap","overflow-wrap",344,"select",[{label:321,value:"normal"},{label:93,value:"break-word"},{label:28,value:"anywhere"}])]},{id:"backgrounds",name:51,icon:"mdi:image-area",properties:[Ae("background","background",42,"text"),Ae("background_color","background-color",45,"color"),Ae("background_image","background-image",46,"image"),Ae("background_position","background-position",48,"text"),Ae("background_size","background-size",50,"select",[{label:36,value:"auto"},{label:127,value:"cover"},{label:123,value:"contain"}]),Ae("background_repeat","background-repeat",49,"select",[{label:382,value:"repeat"},{label:319,value:"no-repeat"},{label:383,value:"repeat-x"},{label:384,value:"repeat-y"},{label:440,value:"space"},{label:399,value:"round"}]),Ae("background_attachment","background-attachment",43,"select",[{label:411,value:"scroll"},{label:193,value:"fixed"},{label:295,value:"local"}]),Ae("background_clip","background-clip",44,"select",Ce),Ae("background_origin","background-origin",47,"select",Ce),Ae("backdrop_filter","backdrop-filter",41,"text")]},{id:"flexbox",name:202,icon:"mdi:view-column",properties:[Ae("flex_direction","flex-direction",140,"select",[{label:401,value:"row"},{label:404,value:"row-reverse"},{label:117,value:"column"},{label:120,value:"column-reverse"}]),Ae("flex_wrap","flex-wrap",560,"select",[{label:323,value:"nowrap"},{label:560,value:"wrap"},{label:561,value:"wrap-reverse"}]),Ae("justify_content","justify-content",266,"select",[{label:201,value:"flex-start"},{label:200,value:"flex-end"},{label:103,value:"center"},{label:442,value:"space-between"},{label:441,value:"space-around"},{label:443,value:"space-evenly"}]),Ae("align_items","align-items",15,"select",[{label:466,value:"stretch"},{label:201,value:"flex-start"},{label:200,value:"flex-end"},{label:103,value:"center"},{label:61,value:"baseline"}]),Ae("align_content","align-content",14,"select",[{label:466,value:"stretch"},{label:201,value:"flex-start"},{label:200,value:"flex-end"},{label:103,value:"center"},{label:442,value:"space-between"},{label:441,value:"space-around"}]),Ae("gap","gap",216,"unit"),Ae("row_gap","row-gap",403,"unit"),Ae("column_gap","column-gap",119,"unit"),Ae("flex","flex",196,"text"),Ae("flex_grow","flex-grow",198,"number"),Ae("flex_shrink","flex-shrink",199,"number"),Ae("flex_basis","flex-basis",197,"unit"),Ae("align_self","align-self",16,"select",[{label:36,value:"auto"},{label:466,value:"stretch"},{label:201,value:"flex-start"},{label:200,value:"flex-end"},{label:103,value:"center"},{label:61,value:"baseline"}]),Ae("order","order",333,"number")]},{id:"grid",name:99,icon:"mdi:grid",properties:[Ae("grid_template_columns","grid-template-columns",505,"text"),Ae("grid_template_rows","grid-template-rows",506,"text"),Ae("grid_template_areas","grid-template-areas",504,"text"),Ae("grid_auto_columns","grid-auto-columns",37,"text"),Ae("grid_auto_rows","grid-auto-rows",39,"text"),Ae("grid_auto_flow","grid-auto-flow",38,"select",[{label:401,value:"row"},{label:117,value:"column"},{label:136,value:"dense"},{label:402,value:"row dense"},{label:118,value:"column dense"}]),Ae("grid_column","grid-column",117,"text"),Ae("grid_row","grid-row",401,"text"),Ae("grid_area","grid-area",30,"text")]},{id:"transitions",name:525,icon:"mdi:animation",leading:["animations"],properties:[qe("animations",27,"animations"),Ae("transition","transition",520,"text"),Ae("transition_property","transition-property",523,"text"),{...Ae("transition_duration","transition-duration",522,"unit"),units:["s","ms"]},Ae("transition_timing_function","transition-timing-function",524,"text"),{...Ae("transition_delay","transition-delay",521,"unit"),units:["s","ms"]},Ae("transform","transform",518,"text"),Ae("transform_origin","transform-origin",519,"text"),Ae("animation_name","animation-name",25,"text"),{...Ae("animation_duration","animation-duration",24,"unit"),units:["s","ms"]},Ae("animation_timing_function","animation-timing-function",26,"text"),{...Ae("animation_delay","animation-delay",22,"unit"),units:["s","ms"]},Ae("animation_iteration_count","animation-iteration-count",263,"text"),Ae("animation_direction","animation-direction",23,"select",[{label:321,value:"normal"},{label:387,value:"reverse"},{label:19,value:"alternate"},{label:20,value:"alternate-reverse"}]),Ae("animation_fill_mode","animation-fill-mode",189,"select",[{label:320,value:"none"},{label:215,value:"forwards"},{label:52,value:"backwards"},{label:86,value:"both"}]),Ae("animation_play_state","animation-play-state",355,"select",[{label:407,value:"running"},{label:351,value:"paused"}]),Ae("filter","filter",190,"text")]},{id:"ring",name:390,icon:"mdi:circle-double",properties:[qe("ring",390,"ring")]},{id:"lists-tables",name:293,icon:"mdi:format-list-bulleted",properties:[Ae("list_style","list-style",289,"text"),Ae("list_style_type","list-style-type",292,"select",[{label:320,value:"none"},{label:142,value:"disc"},{label:106,value:"circle"},{label:451,value:"square"},{label:133,value:"decimal"},{label:296,value:"lower-alpha"},{label:533,value:"upper-alpha"},{label:297,value:"lower-roman"},{label:534,value:"upper-roman"}]),Ae("list_style_position","list-style-position",291,"select",[{label:340,value:"outside"},{label:258,value:"inside"}]),Ae("list_style_image","list-style-image",290,"text"),Ae("border_collapse","border-collapse",72,"select",[{label:414,value:"separate"},{label:114,value:"collapse"}]),Ae("border_spacing","border-spacing",79,"unit"),Ae("table_layout","table-layout",500,"select",[{label:36,value:"auto"},{label:193,value:"fixed"}]),Ae("caption_side","caption-side",102,"select",[{label:517,value:"top"},{label:87,value:"bottom"}])]},{id:"tabs-bar",name:480,icon:"mdi:tab",modules:["tabs"],properties:[Ee("tab_disabled_tabs",141,"tab_list",{help:515,subgroup:"bar"}),Ee("tab_bar_position",59,"segmented",{options:[{label:517,value:"top"},{label:87,value:"bottom"}],defaultValue:"top",subgroup:"bar"}),Ee("tab_align",477,"segmented",{options:[{label:456,value:"start"},{label:103,value:"center"},{label:180,value:"end"},{label:466,value:"stretch"}],defaultValue:"start",subgroup:"bar"}),Ee("tab_bar_background",54,"color",{subgroup:"bar"}),Ee("tab_bar_border_color",55,"sides",{sides:{cell:"color"},subgroup:"bar"}),Ee("tab_bar_border_width",57,"sides",{sides:{cell:"length"},units:["px","em","rem"],subgroup:"bar"}),Ee("tab_bar_border_style",56,"sides",{sides:{cell:"style"},options:[...Me,{label:238,value:"hidden"}],subgroup:"bar"}),Ee("tab_bar_padding",58,"text",{help:329,subgroup:"bar"}),Ee("tab_gap",217,"unit",{units:Oe,subgroup:"bar"}),Ee("tab_animation",496,"segmented",{options:[{label:320,value:"none"},{label:183,value:"fade"},{label:426,value:"slide"}],defaultValue:"none",help:250,subgroup:"bar"}),je("tab_color",497,"color",{subgroup:"text"}),je("tab_font_family",485,"font",{subgroup:"text"}),je("tab_font_size",486,"unit",{units:Oe,subgroup:"text"}),je("tab_font_weight",487,"select",{options:xe.filter(e=>/^(?:normal|bold|[1-9]00)$/.test(e.value)),subgroup:"text"}),je("tab_text_transform",498,"select",{options:ke,subgroup:"text"}),je("tab_letter_spacing",492,"text",{help:566,subgroup:"text"}),je("tab_border_color",481,"sides",{sides:{cell:"color"},subgroup:"border"}),je("tab_border_width",483,"sides",{sides:{cell:"length"},units:["px","em","rem"],subgroup:"border"}),je("tab_border_style",482,"sides",{sides:{cell:"style"},options:[...Me,{label:238,value:"hidden"}],subgroup:"border"}),je("tab_radius",484,"sides",{sides:{cell:"length",corners:!0},units:Oe,subgroup:"border"}),je("tab_padding",494,"text",{help:329,subgroup:"border"}),je("tab_icon_color",489,"color",{subgroup:"icon"}),je("tab_icon_size",491,"unit",{units:["px"],subgroup:"icon"}),Ee("tab_icon_position",490,"segmented",{options:[{label:276,value:"left"},{label:389,value:"right"},{label:11,value:"above"},{label:63,value:"below"}],defaultValue:"left",help:277,subgroup:"icon"}),je("tab_icon_fx",488,"icon_anim",{help:250,subgroup:"icon"}),je("tab_background",479,"color",{subgroup:"effects"}),je("tab_opacity",493,"number",{range:[0,1,.1],subgroup:"effects"}),je("tab_shadow",495,"text",{help:565,subgroup:"effects"}),je("tab_animations",478,"tab_animations",{help:357,subgroup:"effects"})]},{id:"button-content",name:243,icon:"mdi:format-align-center",modules:["button"],properties:[Te("icon_position",248,"segmented",{options:[{label:276,value:"left"},{label:389,value:"right"},{label:11,value:"above"},{label:63,value:"below"}],defaultValue:"left",help:277}),Te("content_align",124,"segmented",{options:[{label:456,value:"start"},{label:103,value:"center"},{label:180,value:"end"}],defaultValue:"center"}),Te("content_vertical_align",539,"segmented",{options:[{label:517,value:"start"},{label:103,value:"center"},{label:87,value:"end"}],defaultValue:"center"}),Te("icon_size",249,"unit",{units:Le}),Te("icon_gap",247,"unit",{units:Le}),Te("icon_color",246,"color"),Te("icon_background",244,"color"),Te("icon_background_shape",245,"segmented",{options:[{label:106,value:"circle"},{label:400,value:"rounded"}],defaultValue:"circle"}),Te("label_overflow",272,"segmented",{options:[{label:560,value:"wrap"},{label:526,value:"truncate"}],defaultValue:"wrap",help:10,...ze}),Te("label_color",268,"color",ze),Te("label_font_family",269,"font",ze),Te("label_font_size",270,"unit",{...ze,units:Oe}),Te("label_font_weight",271,"select",{...ze,options:xe}),Te("label_text_transform",273,"select",{...ze,options:ke}),Te("state_position",459,"segmented",{options:[{label:64,value:"beside"},{label:63,value:"below"}],defaultValue:"beside"}),Te("state_color",457,"color"),Te("state_font_size",458,"unit",{units:Oe})]}],Ie="custom-css",Ve=[{id:"layout",name:275,entries:["spacing","positioning","flexbox","grid"],defaultOpen:!0},{id:"style",name:468,entries:["backgrounds","borders","typography","button-content","tabs-bar","shape","value-background"],defaultOpen:!0},{id:"effects",name:177,entries:["ring","transitions"],defaultOpen:!1},{id:"advanced",name:13,entries:["lists-tables",Ie],defaultOpen:!1}];var De=i(9);const Fe=e=>De.$1.includes(e);function Ne(e){return(Fe(e.type)?De.$1:k.s.types.filter(e=>!Fe(e))).filter(t=>t!==e.type&&k.s.has(t))}const Ze=["__proto__","constructor","prototype"];function Be(e,t,i){if(!e||"object"!=typeof e||Array.isArray(e))return e;const n={};for(const[o,s]of Object.entries(e))t.has(o)||Ze.includes(o)?i.n++:"hover"===o?n[o]=Be(s,t,i):"conditional"===o&&Array.isArray(s)?n[o]=s.map(e=>{if(!e||"object"!=typeof e||Array.isArray(e))return e;const n={};for(const[o,s]of Object.entries(e))Ze.includes(o)?i.n++:n[o]="design"===o?Be(s,t,i):s;return n}):n[o]=s;return n}function Ke(e,t){const i=e.rows?.[t.row]?.columns?.[t.col]?.modules;if(!Array.isArray(i))return;if(!t.child?.length)return i[t.module]?{list:i,index:t.module}:void 0;const n=t.child,o=(0,S.Rv)(i[t.module],n.slice(0,-1)),s=n[n.length-1],a=(0,M.yZ)(o)?.[s.slot];return a?.[s.index]?{list:a,index:s.index}:void 0}function We(e,t,i){const n=Ke(e,t),o=n?.list[n.index];if(!o||!Ne(o).includes(i))return;const s=(0,c.G)(e),a=Ke(s,t),r=k.s.createDefault(i);if(!a||!r)return;const l=a.list[a.index],d=p(r),h={n:0},u=De.iz[i],m=function(e,t){const i=e;if(!(0,M.QN)(i))return[];const n=(0,M.yZ)(i)??[];if(!(0,S.WA)(i))return n.flat();const o=e["row"===i.type?"columns":"tabs"]??[];return n.flatMap((e,i)=>{const n=o[i],s=n&&"object"==typeof n?n:{};for(const e of Object.keys(s))"modules"!==e&&t.n++;return!0===s.hidden?e.map(e=>e&&"object"==typeof e?{...e,hidden:!0}:e):e})}(l,h);for(const[e,t]of Object.entries(l))"type"===e||De.md.includes(e)||(De.uP.includes(e)||u.includes(e)?d[e]=t:h.n++);if(Fe(i)&&Fe(String(l.type))&&!("share_entity"in l)&&delete d.share_entity,Fe(i))if("row"===i){const e=d.columns[0];e.modules=m,d.columns=[e],d.layout="1",delete d.column_widths}else if("tabs"===i){const e=d.tabs[0];e.modules=m,d.tabs=[e],d.active_tab=0}else d.modules=m;const g=function(e){const t=new Set;for(const i of He)if(i.modules&&!i.modules.includes(e))for(const e of i.properties)t.add(e.key);if("tabs"!==e)for(const e of["tab_active","tab_disabled","tab_disabled_tabs","tab_active_color","tab_active_background","tab_indicator_color"])t.add(e);return t}(i);if(d.design&&(d.design=Be(d.design,g,h)),Array.isArray(d.not_synced)){const e=d.not_synced.filter(e=>Object.prototype.hasOwnProperty.call(d,String(e).split(".")[0]));e.length?d.not_synced=e:delete d.not_synced}a.list[a.index]=d,t.child?.length?se(s,t.row,t.col,t.module):ae(s,t.row,t.col);const f=(0,C.bm)(t);return f?{config:s,path:f,dropped:h.n}:void 0}var Ue=i(9788),Ge=i(993),Ye=i(3297);function Qe(){return"undefined"!=typeof HTMLElement&&"function"==typeof HTMLElement.prototype.showPopover}const Je='[role="menuitem"]:not([disabled])';class Xe{constructor(e,t){this.host=e,this.opts=t,this.trigger=null,this._at={},this._shown=null,this._scrollRoots=[],this._raf=0,this.onKeydown=e=>{if("Escape"===e.key)return e.preventDefault(),e.stopPropagation(),void this.close(!0);if("Tab"===e.key)return e.preventDefault(),void this.close(!0);const t=Array.from(this.opts.menu()?.querySelectorAll(Je)||[]),i=this.host.shadowRoot?.activeElement??document.activeElement,n=i?t.indexOf(i):-1;if(1===e.key.length&&/\S/.test(e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){const i=e.key.toLowerCase(),o=t.length,s=Array.from({length:o},(e,i)=>t[(n+1+i)%o]).find(e=>e.textContent?.trim().toLowerCase().startsWith(i));return void(s&&(e.preventDefault(),e.stopPropagation(),s.focus()))}if(!["ArrowDown","ArrowUp","Home","End"].includes(e.key))return;if(e.preventDefault(),e.stopPropagation(),!t.length)return;let o=0;"ArrowDown"===e.key?o=n<0?0:(n+1)%t.length:"ArrowUp"===e.key?o=n<0?t.length-1:(n-1+t.length)%t.length:"End"===e.key&&(o=t.length-1),t[o].focus()},this._onOutside=e=>{this._inMenu(e)||!this._at.point&&this.trigger&&e.composedPath().includes(this.trigger)||this.close(!1)},this._onResize=()=>this.close(!1),this._onScroll=e=>{this._inMenu(e)||(cancelAnimationFrame(this._raf),this._raf=requestAnimationFrame(()=>{const e=this.trigger;if(!e)return;if(this._at.point)return this.close(!1);const t=e.getBoundingClientRect(),i=window.innerHeight||0;!e.isConnected||i&&(t.bottom<0||t.top>i)?this.close(!1):this.position()}))},e.addController(this)}get isOpen(){return!!this.trigger}hostUpdated(){if(!this.trigger)return;const e=this.opts.menu();e&&e!==this._shown&&this._show(e)}hostDisconnected(){this.close(!1)}open(e){this.trigger!==e?this.openAt(e):this.close(!0)}openAt(e,t={}){this.trigger&&this.close(!1),this.trigger=e,this._at=t,document.addEventListener("pointerdown",this._onOutside,!0),window.addEventListener("resize",this._onResize),this._scrollRoots=function(e){const t=[];let i=e;for(;i;)i instanceof ShadowRoot?(t.includes(i)||t.push(i),i=i.host):i=(i instanceof Element||i instanceof Text?i.assignedSlot:null)||i.parentNode;return t.push(window),t}(e);for(const e of this._scrollRoots)e.addEventListener("scroll",this._onScroll,!0);this.host.requestUpdate()}close(e){const t=this.trigger;if(!t)return;const i=this._at.returnFocus??t;this.trigger=null,this._at={},document.removeEventListener("pointerdown",this._onOutside,!0),window.removeEventListener("resize",this._onResize);for(const e of this._scrollRoots)e.removeEventListener("scroll",this._onScroll,!0);this._scrollRoots=[],cancelAnimationFrame(this._raf);const n=this._shown;if(this._shown=null,n&&Qe()&&n.hasAttribute("popover"))try{n.hidePopover()}catch{}this.opts.onClose?.(),this.host.requestUpdate(),e&&i.isConnected&&i.focus({preventScroll:!0})}position(){const e=this._shown,t=this.trigger;if(!e||!t)return;if(!Qe()&&!this.opts.fixedFallback)return;const i=this._at.point,n=i?{left:i.x,right:i.x,top:i.y,bottom:i.y}:t.getBoundingClientRect(),o=window.innerWidth||document.documentElement.clientWidth||0,s=window.innerHeight||document.documentElement.clientHeight||0;e.style.maxHeight="";const a=e.offsetWidth,r=e.offsetHeight,l=s-n.bottom-4-8,c=n.top-4-8,d=s>0&&r>l&&c>l,h=d?c:l;s>0&&r>h&&(e.style.maxHeight=`${Math.max(120,h)}px`);const u=Math.min(r,s>0?Math.max(120,h):r),p=d?Math.max(8,n.top-4-u):n.bottom+4;let m=i?n.left:(0,Ye.i$)(n,a,"end"===this.opts.align?"end":"start","rtl"===(0,Ge.k)(this.host));o>0&&(m=Math.min(m,o-a-8)),m=Math.max(8,m),Object.assign(e.style,{top:`${Math.round(p)}px`,left:`${Math.round(m)}px`,right:"auto",bottom:"auto"}),e.dataset.placement=d?"top":"bottom"}_show(e){if(this._shown=e,Qe()){e.setAttribute("popover","manual");try{e.showPopover()}catch{}}this.position(),e.querySelector(Je)?.focus({preventScroll:!0})}_inMenu(e){const t=this._shown;return!!t&&e.composedPath().includes(t)}}var et=i(8006),tt=i(105),it=i(21),nt=i(802),ot=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};function st(e){if(!e)return{};const{type:t,name:i,template:n,...o}=e;return{type:t,name:i,template:n,...o}}let at=class extends n.WF{constructor(){super(...arguments),this._embed=!0,this._status="",this._libVersion=0,this._suppressUpdate=!1}connectedCallback(){super.connectedCallback(),this.stateManager&&(this._unsubscribe=this.stateManager.subscribe(e=>{this._editorState=e})),this._unsubLibrary??=(0,V.T_)().subscribe(()=>{this._libVersion=(0,V.T_)().version})}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubLibrary?.(),this._unsubLibrary=void 0}willUpdate(e){(e.has("hass")||e.has("_editorState"))&&this._customIds().length&&(0,V.T_)().ensure(this.hass)}_customIds(){return(0,a.Gd)(this._editorState?.config)}async _copy(){const e=this._editorState?.config;if(!e)return;const{yaml:t,missing:i}=function(e,t,i){let n=st(e),o=[];if(t){const t=(0,V.T_)().inlineDocs((0,s.wL)(e,i)),r=(0,a.ux)(n,e=>(0,V.T_)().get(e)??t?.get(e));n=r.config,o=r.missing}return{yaml:(0,A.fE)(JSON.parse(JSON.stringify(n))),missing:o}}(e,this._embed,this._editorState?.templateAnimations);try{await navigator.clipboard.writeText(t),this._status=i.length?(0,h.t)(1201,{ids:i.join(", ")}):this._embed?(0,h.t)(1199):(0,h.t)(1200)}catch{this._status=(0,h.t)(242)}}_renderExport(){const e=this._customIds();if(!e.length)return n.s6;this._libVersion;const t=e.length;return n.qy`
      <div class="export">
        <span class="txt"><strong>${(0,h.t)(1279,{n:t})}</strong> ${(0,h.t)(1277,{n:t})}</span>
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
    `}render(){return n.qy`
      <div class="mc-yaml-container">
        ${this._renderExport()}
        <div class="mc-yaml-editor-wrapper">
          <ha-yaml-editor
            .hass=${this.hass}
            .defaultValue=${st(this._editorState?.config)}
            @value-changed=${this._onYamlChanged}
          ></ha-yaml-editor>
        </div>
      </div>
    `}_onYamlChanged(e){const t=e.detail.value;if(this._editorState){this._suppressUpdate=!0;try{if(t&&"object"==typeof t){const e={...t,type:this._editorState.config.type};this.stateManager.updateConfig(e)}}catch{}finally{this._suppressUpdate=!1}}}};at.styles=[tt.yj,tt.rF,it.e,nt.a,n.AH`
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
    `],ot([(0,o.MZ)({attribute:!1})],at.prototype,"stateManager",void 0),ot([(0,o.MZ)({attribute:!1})],at.prototype,"hass",void 0),ot([(0,o.wk)()],at.prototype,"_editorState",void 0),ot([(0,o.wk)()],at.prototype,"_embed",void 0),ot([(0,o.wk)()],at.prototype,"_status",void 0),ot([(0,o.wk)()],at.prototype,"_libVersion",void 0),at=ot([(0,o.EM)("mc-yaml-editor")],at);var rt=i(4700);function lt(e,t,i){const n=e.getConfig(),o=(0,rt.t8)(n,t),s=o?.list[o.index];return!!s&&(function(e,t,i){const n=e.getConfig(),o=(0,rt.t8)(n,t)?.list[t.child?.length?t.child[t.child.length-1].index:t.module],s=i=>e.replaceModule(t.row,t.col,t.module,i,t.child);n.template&&!t.child?.length&&o?we(o,s)(i):s(i)}(e,t,(0,rt.Ao)(s,i)),!0)}function ct(e,t){if(void 0===t.module)return!1;if(t.row!==e.row||t.col!==e.col||t.module!==e.module)return!1;const i=e.child??[],n=t.child??[];return n.length>=i.length&&(o=n,i.every((e,t)=>o[t]&&o[t].slot===e.slot&&o[t].index===e.index));var o}function dt(e,t,i){if(ct(t,i))return;const n=(0,c.G)(e),o=(e,t,i)=>n.rows[e]?.columns[t]?.modules?.[i],s=o(t.row,t.col,t.module),a=t.child??[];let r,l;if(a.length){const e=(0,S.Rv)(s,a.slice(0,-1)),t=a[a.length-1];r=e&&(0,S.rX)(e,t.slot),l=t.index}else r=n.rows[t.row]?.columns[t.col]?.modules,l=t.module;const d=r?.[l];if(!r||!d)return;const h=void 0===i.module?void 0:o(i.row,i.col,i.module);let u;if(void 0===i.module)u=n.rows[i.row]?.columns[i.col]?.modules;else{const e=(0,S.Rv)(h,i.child??[]);u=e&&(0,S.rX)(e,i.slot??0)}if(!u)return;let p=Math.max(0,Math.min(i.index,u.length));if(u===r&&(l<p&&(p-=1),p===l))return;if(r.splice(l,1),u.splice(p,0,d),n.template){const e=a.length>0,o=void 0!==i.module,r=(e,t,i)=>n.rows[t].columns[i].modules.indexOf(e);e&&se(n,t.row,t.col,r(s,t.row,t.col)),o&&se(n,i.row,i.col,r(h,i.row,i.col)),!e&&o&&ae(n,t.row,t.col),e&&!o&&ae(n,i.row,i.col)}const m=function(e,t){const i=(e,n)=>{for(let o=0;o<e.length;o++){if(e[o]===t)return[...n,{slot:-1,index:o}];const s=(0,M.yZ)(e[o]);for(let e=0;s&&e<s.length;e++){const t=i(s[e],[...n,{slot:e,index:o}]);if(t)return t}}};for(let t=0;t<e.rows.length;t++)for(let n=0;n<e.rows[t].columns.length;n++){const o=i(e.rows[t].columns[n].modules??[],[]);if(!o)continue;const[s,...a]=o,r={rowIndex:t,columnIndex:n,moduleIndex:s.index};if(a.length){const e=[];let t=s.slot;for(const i of a)e.push({slot:t,index:i.index}),t=i.slot;r.childPath=e}return r}}(n,d);return m?{config:n,path:m}:void 0}function ht(e,t,i){if("column"===t.kind)return"inside"===i?{row:t.row,col:t.col,index:0}:void 0;if("slot"===t.kind){if("inside"!==i)return;const n=(0,C.cv)(e,{kind:"module",row:t.row,col:t.col,module:t.module,child:t.child}),o=(0,M.yZ)(n)?.[t.slot]?.length??0;return{row:t.row,col:t.col,module:t.module,...ut(t.child),slot:t.slot,index:o}}if("module"!==t.kind)return;if("inside"===i){const i=(0,C.cv)(e,t);if(!(0,M.QN)(i)||(0,S.WA)(i))return;const n=(0,M.yZ)(i)?.[0]?.length??0;return{row:t.row,col:t.col,module:t.module,...ut(t.child),slot:0,index:n}}const n="after"===i?1:0,o=t.child??[];if(!o.length)return{row:t.row,col:t.col,index:t.module+n};const s=o[o.length-1];return{row:t.row,col:t.col,module:t.module,...ut(o.slice(0,-1)),slot:s.slot,index:s.index+n}}const ut=e=>e?.length?{child:e.map(e=>({...e}))}:{},pt=["vertical","horizontal","row","tabs","slider-layout"],mt=(e,t)=>`${(0,h.t)(848,{n:e+1})} · ${(0,h.t)(218,{n:t+1})}`,gt={rename:["F2","F2"],dup:["Ctrl+D","Control+D"],up:["Alt+↑","Alt+ArrowUp"],down:["Alt+↓","Alt+ArrowDown"],del:["Del","Delete"]};function ft(e){const t="string"==typeof e.editor_name&&e.editor_name.trim();if(t)return t;const i=(0,C.$N)(e),n=(0,C.Iu)(e);return i?`${n} · ${i}`:n}class vt{constructor(e,t){this.host=e,this.opts=t,this.sel=null,this.view="main",this._focusFirst=!1,this._trail=[],this._focusLabel=null,this._copy=null,this._origin=null,this._onKey=e=>{const t=this._trail.length>0,i="rtl"===getComputedStyle(this.host).direction,n=i?"ArrowLeft":"ArrowRight",o=i?"ArrowRight":"ArrowLeft";if(t&&("Escape"===e.key||e.key===o||"Backspace"===e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey)return e.preventDefault(),e.stopPropagation(),void this.back();if(e.key===n){const t=this.host.shadowRoot?.activeElement??null;if("menu"===t?.getAttribute("aria-haspopup")&&!t.hasAttribute("disabled"))return e.preventDefault(),e.stopPropagation(),void t.click()}"Backspace"!==e.key?this._pop.onKeydown(e):e.stopPropagation()},this._closeCopy=()=>{this._copy=null,this.host.requestUpdate(),this._origin?.isConnected&&this._origin.focus({preventScroll:!0})},new Ge.K(e),this._pop=new Xe(e,{menu:()=>e.shadowRoot?.querySelector(".item-menu"),onClose:()=>{this.sel=null,this.view="main",this._trail=[]},align:"tree"===t.surface?"end":"start",fixedFallback:!0}),e.addController(this)}get isOpen(){return this._pop.isOpen&&!!this.sel}get openKey(){return this.isOpen&&this.sel?(0,C.iA)(this.sel):null}get trigger(){return this._pop.trigger}open(e,t,i={},n="main"){i.point||this._pop.trigger!==t||!this.isOpen?(this._pop.close(!1),this.sel=e,this.view=n,this._trail=[],this._origin=i.returnFocus??t,this._pop.openAt(t,i)):this.close(!0)}close(e){this._pop.isOpen?this._pop.close(e):(this.sel=null,this.view="main",this._trail=[])}setView(e,t=""){this._trail.push({view:this.view,opener:t}),this.view=e,this._focusFirst=!0,this._focusLabel=null,this.host.requestUpdate()}back(){const e=this._trail.pop();return e?(this.view=e.view,this._focusFirst=!0,this._focusLabel=e.opener||null,this.host.requestUpdate(),!0):"main"!==this.view&&(this.view="main",this._focusFirst=!0,this.host.requestUpdate(),!0)}hostUpdated(){if(this._focusFirst){this._focusFirst=!1,this._pop.position();const e=Array.from(this.host.shadowRoot?.querySelectorAll('.item-menu [role="menuitem"]:not([disabled])')??[]),t=this._focusLabel;this._focusLabel=null;const i=t?e.find(e=>e.textContent?.trim()===t):void 0,n=e[0]?.hasAttribute("data-back")?e[1]??e[0]:e[0];(i??n)?.focus({preventScroll:!0})}const e=this.host.shadowRoot?.querySelector("dialog.copy-dlg");if(e&&this._copy&&!e.open){try{e.showModal()}catch{e.setAttribute("open","")}e.querySelector("textarea")?.select()}}hostDisconnected(){this._copy=null}get _sm(){return this.host.stateManager}_fire(e,t){this.host.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:t}))}_name(e,t){if("module"===t.kind){const i=(0,C.cv)(e,t);return i?ft(i):(0,h.t)(590)}return"card"===t.kind?e.name?.trim()||(0,h.t)(167):(0,C.e9)(e,t).title}shortcut(e,t,i,n={}){const o=this._sm;if(!o)return!1;const s=(e.ctrlKey||e.metaKey)&&!e.altKey;if("ContextMenu"===e.key||"F10"===e.key&&e.shiftKey)return this.open(t,i,n),!0;if("F2"===e.key&&!s&&!e.altKey)return this.opts.rename(t),!0;if(s&&"d"===e.key.toLowerCase()&&("module"===t.kind||"row"===t.kind))return"row"===t.kind?o.duplicateRow(t.row):o.duplicateModule(t.row,t.col,t.module,t.child),this.opts.focusSelection(),!0;if(("Delete"===e.key||"Backspace"===e.key)&&!s){if("row"===t.kind)return this._deleteRow(t.row),!0;if("column"===t.kind)return(o.getConfig().rows[t.row]?.columns.length??0)<=1?this.open(t,i,n):(o.deleteColumn(t.row,t.col),this.opts.focusSelection()),!0;if("slot"===t.kind){const e=(0,M.yZ)((0,C.kW)(o.getConfig(),t));return!!e?.[t.slot]&&(e.length<=1?this.open(t,i,n):e[t.slot].length?this.open(t,i,n,"delete"):this._deleteSlot(t),!0)}}return!1}_deleteRow(e){if(this.opts.deleteRow)return this.opts.deleteRow(e);this._sm?.deleteRow(e),this.opts.focusSelection()}_moveRow(e,t){if(this.opts.moveRow)return this.opts.moveRow(e,t);const i=this._sm;!i||t<0||t>=i.getConfig().rows.length||(i.moveRow(e,t),i.setSelectedPath({rowIndex:t}),this.opts.focusSelection())}_deleteModule(e){if(this.opts.deleteModule)return this.opts.deleteModule(e);this._sm?.deleteModule(e.row,e.col,e.module,e.child),this.opts.focusSelection()}_deleteSlot(e){const t=this._sm,i=t&&(0,C.kW)(t.getConfig(),e);t&&i&&("tabs"===i.type?t.deleteTab(e.row,e.col,e.module,e.child?.map(e=>({...e})),e.slot):t.deleteNestedColumn(e.row,e.col,e.module,e.child?.map(e=>({...e})),e.slot),this.opts.focusSelection())}_moveSlot(e,t){const i=this._sm,n=i&&(0,C.kW)(i.getConfig(),e);if(!i||!n)return;const o=e.child?.map(e=>({...e}));"tabs"===n.type?i.moveTab(e.row,e.col,e.module,o,e.slot,t):i.moveNestedColumn(e.row,e.col,e.module,o,e.slot,t)}_select(e){this._sm?.setSelectedPath((0,C.bm)(e))}_edit(e){this._select(e),this._fire("mc-edit-module",{path:(0,C.bm)(e)})}_addChild(e,t){this._fire("add-module",{rowIndex:e.row,colIndex:e.col,moduleIndex:e.module,child:e.child,slot:t})}async _copyYaml(e,t){const i=this._sm?.getConfig();if(!i)return;const n="card"===e.kind?st(i):T((0,C.R9)(i,e)),o=(0,A.fE)(JSON.parse(JSON.stringify(n??{}))),s=(0,h.t)(1285,{name:t});await(0,et.D)(o,this.host.shadowRoot??this.host)?this.opts.status((0,h.t)(1286,{name:t})):(this._copy={text:o,title:s},this.host.requestUpdate())}_paste(e,t){const i=this._sm,n=R();i&&n&&i.pasteModule(e)&&this.opts.status((0,h.t)(1262,{module:ft(n),where:t}))}_run(e){e.back?this.back():e.view?this.setView(e.view,e.label):(this._pop.close(void 0===e.focus),e.run(),"selection"===e.focus&&this.opts.focusSelection())}_moveTargets(e,t){const i=this._sm,n=t.child,o=(e,t)=>({icon:"mdi:arrow-right",label:e,run:t,focus:"selection"}),s=[];if(n?.length){const a=(0,S.Rv)(e.rows[t.row]?.columns[t.col]?.modules?.[t.module],n.slice(0,-1)),r=a?(0,M.yZ)(a):void 0,l=n[n.length-1].slot;if(!a||!r)return[];s.push(...r.flatMap((e,s)=>s===l?[]:[o((0,W.D)(a,s)??(0,h.t)(975,{n:s+1}),()=>i.moveChildToSlot(t.row,t.col,t.module,n,s))]))}else s.push(...e.rows.flatMap((e,n)=>e.columns.flatMap((e,s)=>n===t.row&&s===t.col?[]:[o(mt(n,s),()=>i.moveModuleToColumn(t.row,t.col,t.module,n,s))])));const a=(n,o)=>{const s=dt(i.getConfig(),t,n);s&&(i.updateConfig(s.config),i.setSelectedPath(s.path),this.opts.status((0,h.t)(611,{name:ft((0,C.cv)(e,t)),where:o})))},r=[],l=n?.slice(0,-1)??[];e.rows.forEach((e,i)=>e.columns.forEach((e,n)=>{const s=(e,c,d,u)=>{const p=(0,M.yZ)(e);if(!p)return;const m=`${u} > ${ft(e)}`;p.forEach((u,p)=>{const g={row:i,col:n,module:c,...d.length?{child:d.map(e=>({...e}))}:{},slot:p,index:u.length},f=(0,S.WA)(e)?`${m} > ${(0,W.D)(e,p)??""}`:m;var v,b;i===t.row&&n===t.col&&c===t.module&&(b=l,(v=d).length===b.length&&v.every((e,t)=>e.slot===b[t].slot&&e.index===b[t].index))||ct(t,g)||r.push(o((0,h.t)(496,{container:f}),()=>a(g,f))),u.forEach((e,t)=>s(e,c,[...d,{slot:p,index:t}],f))})};(e.modules??[]).forEach((e,t)=>s(e,t,[],mt(i,n)))}));const c=[];if(n?.length){const i={kind:"module",row:t.row,col:t.col,module:t.module,...l.length?{child:l}:{}},n=ht(e,i,"after"),s=(0,C.cv)(e,i);n&&s&&c.push(o((0,h.t)(706,{parent:ft(s)}),()=>a(n,ft(s))))}return[...s,...r,...c]}_model(e,t){const i=this._sm,n=!!e.template,o=this._name(e,t),s={icon:"mdi:arrow-left",label:(0,h.t)(120),run:()=>{},back:!0},a={icon:"mdi:arrow-left",label:(0,h.t)(162),run:()=>{},back:!0},r=(e,t,i,n=!1,o)=>({icon:e,label:t,run:()=>{},view:i,sub:!0,disabled:n,why:o}),l=(e,...t)=>({label:`${(0,h.t)(1287,{name:o})}, ${e}`,groups:[[s],...t]}),c={icon:"mdi:rename-box",label:(0,h.t)(804),run:()=>this.opts.rename(t),kbd:gt.rename,focus:"none"},d={icon:"mdi:code-braces",label:(0,h.t)(233),run:()=>{this._copyYaml(t,o)}},u=!B(),p=!R(),m=e=>{const t=u?(0,h.t)(234):void 0;return[{icon:"mdi:content-copy",label:(0,h.t)(237),run:()=>{i.copyDesign(e),this.opts.status((0,h.t)(1289,{name:o}))}},{icon:"mdi:content-paste",label:(0,h.t)(725),run:()=>i.pasteDesign(e,"replace"),disabled:u,why:t},{icon:"mdi:set-merge",label:(0,h.t)(585),run:()=>i.pasteDesign(e,"merge"),disabled:u,why:t}]},g=(e,i)=>({icon:"mdi:content-paste",label:e,run:()=>this._paste(t,i),disabled:p,why:p?(0,h.t)(235):void 0,focus:"selection"}),f=(0,C.R9)(e,t),v=(0,C.Ak)(f),b=(e=!1)=>({icon:v?"mdi:eye-outline":"mdi:eye-off-outline",label:e?v?(0,h.t)(949):(0,h.t)(447):v?(0,h.t)(943):(0,h.t)(446),run:()=>i.setHidden(t,!v)}),y=i.hasOverrides(t),_=e=>n?[{icon:"mdi:backup-restore",label:e,run:()=>{},view:"reset",disabled:!y,why:y?void 0:(0,h.t)(671)}]:[],w=(0,h.t)(1287,{name:o}),$=e=>({label:w,note:e,groups:[[a,{icon:"mdi:backup-restore",label:(0,h.t)(813),danger:!0,focus:"selection",run:()=>{"card"===t.kind?this._fire("template-resync"):i.ownsModuleList(t)?this._fire("mc-template-reapply",{resetColumn:t}):i.resetItem(t)&&this._fire("mc-template-reapply")}}]]});if("card"===t.kind){if("reset"===this.view)return $((0,h.t)(821));const i=ve(e)>0;return{label:w,groups:[[{icon:"mdi:card-outline",label:(0,h.t)(333),run:()=>this._edit(t),focus:"none"},{icon:"mdi:plus",label:(0,h.t)(50),run:()=>this._fire("request-add-row"),focus:"none"}],[c,d],n?[{icon:"mdi:backup-restore",label:(0,h.t)(814),run:()=>{},view:"reset",disabled:!i,why:i?void 0:(0,h.t)(671)}]:[]]}}const x=e.rows[t.row];if(!x)return null;if("row"===t.kind){if("reset"===this.view)return $((0,h.t)(828,{name:o}));const n=t.row;return"design"===this.view?l((0,h.t)(299),m({row:n}),[b(),d],_((0,h.t)(817))):{label:w,groups:[[{icon:"mdi:table-column-plus-after",label:(0,h.t)(37),run:()=>{i.addColumn(n),this._select({kind:"column",row:n,col:i.getConfig().rows[n].columns.length-1})},focus:"selection"},{icon:"mdi:content-duplicate",label:(0,h.t)(325),run:()=>i.duplicateRow(n),kbd:gt.dup,focus:"selection"},c,{icon:"mdi:arrow-up",label:(0,h.t)(608),run:()=>this._moveRow(n,n-1),disabled:0===n,kbd:gt.up,focus:"none"},{icon:"mdi:arrow-down",label:(0,h.t)(605),run:()=>this._moveRow(n,n+1),disabled:n>=e.rows.length-1,kbd:gt.down,focus:"none"}],[r("mdi:palette-outline",(0,h.t)(299),"design")],[{icon:"mdi:delete-outline",label:(0,h.t)(291),run:()=>this._deleteRow(n),danger:!0,kbd:gt.del,focus:"none"}]]}}if("column"===t.kind){if("reset"===this.view)return $((0,h.t)(828,{name:o}));const e=x.columns.length<=1,n=(0,h.t)(851,{row:t.row+1,column:t.col+1});return"design"===this.view?{label:`${n}, ${(0,h.t)(299)}`,groups:[[s],m({row:t.row,col:t.col}),[b(),d],_((0,h.t)(815))]}:{label:n,groups:[[{icon:"mdi:plus",label:(0,h.t)(45),run:()=>this._fire("add-module",{rowIndex:t.row,colIndex:t.col}),focus:"none"},g((0,h.t)(726),mt(t.row,t.col)),c],[r("mdi:palette-outline",(0,h.t)(299),"design")],[{icon:"mdi:delete-outline",label:(0,h.t)(285),danger:!0,kbd:gt.del,focus:"selection",run:()=>i.deleteColumn(t.row,t.col),disabled:e,why:e?(0,h.t)(17):void 0}]]}}if("slot"===t.kind){const i=(0,C.kW)(e,t),n=(0,M.yZ)(i);if(!i||!n?.[t.slot])return null;const s="tabs"===i.type,u=n[t.slot].length,p=n.length<=1,f=(0,C.tw)(t),v=()=>this._deleteSlot(t);if("delete"===this.view)return{label:w,note:s?(0,h.t)(294,{name:o,n:u}):(0,h.t)(286,{name:o,n:u}),groups:[[a,{icon:"mdi:delete-outline",label:s?(0,h.t)(293):(0,h.t)(285),run:v,danger:!0,focus:"none"}]]};const y={row:t.row,col:t.col,module:t.module,child:t.child,slot:t.slot};return"design"===this.view?l((0,h.t)(299),...s?[]:[m(y)],[b(s),d]):{label:w,groups:[[{icon:"mdi:plus",label:(0,h.t)(45),run:()=>this._addChild(f,t.slot),focus:"none"},g((0,h.t)(726),`${ft(i)} · ${o}`),c,{icon:"mdi:arrow-up",label:(0,h.t)(608),run:()=>this._moveSlot(t,-1),disabled:t.slot<=0,kbd:gt.up,focus:"selection"},{icon:"mdi:arrow-down",label:(0,h.t)(605),run:()=>this._moveSlot(t,1),disabled:t.slot>=n.length-1,kbd:gt.down,focus:"selection"}],[r("mdi:palette-outline",(0,h.t)(299),"design")],[{icon:"mdi:delete-outline",label:s?(0,h.t)(293):(0,h.t)(285),danger:!0,kbd:gt.del,run:v,view:u&&!p?"delete":void 0,focus:"none",disabled:p,why:p?s?(0,h.t)(19):(0,h.t)(17):void 0}]]}}const A=(0,C.cv)(e,t);if(!A)return null;const q=!!t.child?.length,E=e.rows[t.row]?.columns[t.col]?.modules?.[t.module];if("reset"===this.view)return $(q&&E?(0,h.t)(827,{name:ft(E)}):(0,h.t)(828,{name:o}));const j=this._moveTargets(e,t),T=(0,rt.xc)(A),z=[..."background"!==T?[{icon:"mdi:arrange-send-to-back",label:(0,h.t)(784),run:()=>{lt(i,t,"background")},focus:"selection"}]:[],..."overlay"!==T?[{icon:"mdi:arrange-bring-to-front",label:(0,h.t)(785),run:()=>{lt(i,t,"overlay")},focus:"selection"}]:[],..."flow"!==T?[{icon:"mdi:view-sequential-outline",label:(0,h.t)(122),run:()=>{lt(i,t,"flow")},focus:"selection"}]:[]];if("placement"===this.view)return{label:w,groups:[[a],z]};if("move"===this.view)return l((0,h.t)(607),j);if("wrap"===this.view)return l((0,h.t)(1197),pt.map(e=>{const n=k.s.get(e)?.metadata;return{icon:n?.icon||"mdi:view-grid-outline",label:(0,C.Iu)({type:e}),run:()=>i.wrapInLayout(t,e),focus:"selection"}}));const L=q?t.child[t.child.length-1].index:t.module,O=q?(0,M.yZ)((0,S.Rv)(E,t.child.slice(0,-1)))?.[t.child[t.child.length-1].slot]:x.columns[t.col]?.modules,P=O?.length??0,H="tabs"===A.type||"row"===A.type?[{icon:"tabs"===A.type?"mdi:tab-plus":"mdi:table-column-plus-after",label:"tabs"===A.type?(0,h.t)(52):(0,h.t)(37),focus:"selection",run:()=>"tabs"===A.type?i.addTab(t.row,t.col,t.module,t.child?.map(e=>({...e}))):i.addNestedColumn(t.row,t.col,t.module,t.child?.map(e=>({...e})))}]:(0,S.WA)(A)||!(0,M.yZ)(A)?[]:[{icon:"mdi:plus",label:(0,h.t)(45),run:()=>this._addChild(t,0),focus:"none"}],I=G(e,t),V="canvas"===this.opts.surface&&this.opts.connect?[{icon:"mdi:transit-connection-variant",label:(0,h.t)(43),run:()=>this.opts.connect(t),focus:"none",disabled:I,why:I?(0,h.t)(418):void 0}]:[],D=Ne(A).length>0,F={icon:"mdi:swap-horizontal",label:(0,h.t)(810),focus:"none",run:()=>this._fire("replace-module",{sel:t,status:this.opts.status,focus:()=>this.opts.focusSelection()}),disabled:I||!D,why:I?(0,h.t)(418):D?void 0:(0,h.t)(649)},N=q?(0,C.e9)(e,(0,C.tw)(t,e)).title:mt(t.row,t.col),Z=[...H,...V];return"add"===this.view?l((0,h.t)(27),Z):"arrange"===this.view?l((0,h.t)(101),[{icon:"mdi:folder-move-outline",label:(0,h.t)(607),run:()=>{},view:"move",sub:!0,disabled:!j.length,why:j.length?void 0:(0,h.t)(648)},{icon:"mdi:group",label:(0,h.t)(1197),run:()=>{},view:"wrap",sub:!0}],z):"design"===this.view?l((0,h.t)(299),m({row:t.row,col:t.col,module:t.module,child:t.child}),[b(),..._(q?(0,h.t)(816):(0,h.t)(825))]):"clipboard"===this.view?l((0,h.t)(236),[{icon:"mdi:content-copy",label:(0,h.t)(239),run:()=>{i.copyModule(t)&&this.opts.status((0,h.t)(1288,{name:o}))}},g((0,h.t)(727),N),d]):{label:w,groups:[[{icon:"mdi:pencil-outline",label:(0,h.t)(331),run:()=>this._edit(t),focus:"none"},c,{icon:"mdi:content-duplicate",label:(0,h.t)(323),run:()=>i.duplicateModule(t.row,t.col,t.module,t.child),kbd:gt.dup,focus:"selection"},F,{icon:"mdi:arrow-up",label:(0,h.t)(608),run:()=>i.moveModuleBy(t.row,t.col,t.module,-1,t.child),disabled:L<=0,kbd:gt.up,focus:"selection"},{icon:"mdi:arrow-down",label:(0,h.t)(605),run:()=>i.moveModuleBy(t.row,t.col,t.module,1,t.child),disabled:L>=P-1,kbd:gt.down,focus:"selection"}],[...Z.length?[r("mdi:plus",(0,h.t)(27),"add")]:[],r("mdi:arrange-bring-forward",(0,h.t)(101),"arrange"),r("mdi:palette-outline",(0,h.t)(299),"design"),r("mdi:content-copy",(0,h.t)(236),"clipboard")],[{icon:"mdi:delete-outline",label:(0,h.t)(281),run:()=>this._deleteModule(t),danger:!0,kbd:gt.del,focus:"none"}]]}}_renderEntry(e){return n.qy`<button
      type="button"
      role="menuitem"
      class=${e.danger?"danger":""}
      title=${e.why??n.s6}
      aria-description=${e.why??n.s6}
      aria-haspopup=${e.sub?"menu":n.s6}
      aria-keyshortcuts=${e.kbd?.[1]??n.s6}
      data-kbd=${e.kbd?.[0]??n.s6}
      data-arrow=${e.icon.startsWith("mdi:arrow-")?"":n.s6}
      data-back=${e.back&&e.label===(0,h.t)(120)?"":n.s6}
      ?disabled=${e.disabled}
      @click=${()=>this._run(e)}
    ><ha-icon icon=${e.icon}></ha-icon>${e.label}</button>`}render(){const e=this._sm,t=this.sel,i=this.isOpen&&t&&e?this._model(e.getConfig(),t):null,o=i?.groups.filter(e=>e.length)??[],s=i?n.qy`<div class="menu item-menu" role="menu" aria-label=${i.label} aria-describedby=${i.note?"menu-note":n.s6} @keydown=${this._onKey}>
          ${i.note?n.qy`<p class="menu-note" id="menu-note">${i.note}</p>`:n.s6}
          ${o.map((e,t)=>n.qy`${t?n.qy`<hr />`:n.s6}${e.map(e=>this._renderEntry(e))}`)}
        </div>`:n.s6,a=this._copy,r=a?n.qy`<dialog class="copy-dlg" aria-labelledby="copy-dlg-title" aria-describedby="copy-dlg-hint"
          @close=${this._closeCopy}
          @keydown=${e=>{"Escape"===e.key&&e.stopPropagation()}}>
          <h2 id="copy-dlg-title">${(0,h.t)(241)}</h2>
          <p id="copy-dlg-hint">${(0,h.t)(1308,{title:a.title})}</p>
          <textarea readonly rows="12" aria-labelledby="copy-dlg-title" .value=${a.text}></textarea>
          <div class="actions">
            <button type="button" class="btn btn-secondary" @click=${e=>e.currentTarget.closest("dialog")?.close()}>${(0,h.t)(197)}</button>
          </div>
        </dialog>`:n.s6;return n.qy`${s}${r}`}}class bt{constructor(e){this.onFire=e,this._timer=0,this._x=0,this._y=0,this._firedAt=-1/0,this.down=e=>{if(this.cancel(),"touch"!==e.pointerType)return;const t=e.composedPath();this._x=e.clientX,this._y=e.clientY,this._timer=window.setTimeout(()=>{this._timer=0,this._firedAt=Date.now(),this.onFire(t,this._x,this._y)},500)},this.move=e=>{this._timer&&Math.hypot(e.clientX-this._x,e.clientY-this._y)>8&&this.cancel()},this.cancel=()=>{this._timer&&clearTimeout(this._timer),this._timer=0}}get justFired(){return Date.now()-this._firedAt<800}}const yt=n.AH`
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
    margin-inline-start: auto;
    padding-inline-start: 16px;
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
  :host([dir='rtl']) .item-menu button[aria-haspopup]::after {
    content: '‹';
  }
  :host([dir='rtl']) .item-menu button[data-arrow] ha-icon {
    transform: scaleX(-1);
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
`;var _t=i(754);function wt(e,t){const i=e.map(e=>(Number.isFinite(e)&&e>0?+e.toFixed(3):1)+"fr").join(" ");return n.qy`<span class="layout-glyph" aria-hidden="true" style=${(0,_t.W)({gridTemplateColumns:i})}>${e.map((e,i)=>i===t?n.qy`<i class="on"></i>`:n.qy`<i></i>`)}</span>`}let $t;var xt=i(5710),kt=i(2074),Ct=(i(4121),function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a});const Mt={card:1218,row:1238,column:1222,tabs:1240,slides:1239},St=e=>(0,h.t)(Mt[e]),At={camera:1206,light:1210,weather:1215,sensor:1213,binary_sensor:1213,switch:1214,input_select:1211,select:1211,other:1208},qt=e=>(0,h.t)(At[e&&e in At?e:"other"]);function Et(e){const t=e?.inherited;if(e&&"inherit"===e.choice&&t&&e.effective)return(0,h.t)(107,{id:e.effective,source:St(t.from)})}let jt=class extends n.WF{constructor(){super(...arguments),this.domain="",this.layout=!1,this.fieldKey="",this.onChange=()=>{},this._picking=!1,this._live="",this._announced="",this._same=()=>{if(!this._canFollow)return;this._picking=!1,void 0!==this.value&&this.onChange(void 0);const e=this.info.inherited,t=(0,h.t)(673,{name:this._name(e.id),source:St(e.from)});this._say(this.info.mismatch?`${t} ${this._mismatchText()}`:t)},this._pick=()=>{if("pick"===this._pressed)return;this._picking=!0;const e=this.info.inherited;"own"===this.info.choice||!e||this.info.mismatch||this.info.cardModule?void 0!==this.value&&this.onChange(void 0):this.onChange(e.id),this._say("")},this._none=()=>{this._picking=!1,"none"!==this._raw&&this.onChange("none"),this._say((0,h.t)(638))},this._pickAndOpen=()=>{this._pick(),this._picking=!0,this.updateComplete.then(()=>{const e=this.renderRoot.querySelector("mc-entity-picker");e?.focusInput?.(),e?.open?.()})},this._openCardSettings=()=>{this.dispatchEvent(new CustomEvent("mc-open-card-entity",{bubbles:!0,composed:!0}))},this._onPicked=e=>{e.stopPropagation();const t=e.detail.value;this.onChange(""===t?void 0:t),t&&this.hass?.states?.[t]&&t!==this._announced&&(this._announced=t,this._say((0,h.t)(674,{name:this._name(t)})))},this._onKey=e=>{const t=e.currentTarget,i=[...t.querySelectorAll("button")],n=i.indexOf(e.target),o=(0,xt.n)(e.key,n,i.map(()=>({})),"both",!0,"rtl"===(0,Ge.k)(t));n<0||o<0||(e.preventDefault(),i.forEach((e,t)=>e.tabIndex=t===o?0:-1),i[o].focus())},this._onFocusOut=e=>{e.currentTarget.contains(e.relatedTarget)||(this._live="")}}willUpdate(e){e.has("fieldKey")&&(this._picking=!1,this._live="")}get _raw(){return"string"==typeof this.value?this.value:void 0}get _canFollow(){return!this.info.cardModule&&!!this.info.inherited}get _pressed(){const e=this.info;return"own"===e.choice?"pick":"none"===e.choice?"none":this._picking?"pick":this._canFollow?"same":void 0}get _showPicker(){return"pick"===this._pressed||"inherit"===this.info.choice&&!this._canFollow}_name(e){const t=this.hass?.states?.[e];return t?.attributes?.friendly_name||e}_mismatchText(){const e=this.info;if(!e.mismatch||!e.inherited)return"";const t=qt(1===e.domains?.length?e.domains[0]:void 0);return(0,h.t)(1088,{kind:t,source:St(e.inherited.from),thing:qt(e.inherited.id.split(".")[0])})}_say(e){this._live=e}_link(e){const[t,i]=e.split("");return n.qy`${t}<button type="button" class="link" @click=${this._openCardSettings}>${(0,h.t)(177)}</button>${i??""}`}_hint(){const e=this.info;if(e.cardModule)return n.qy`<p class="help" id="hint">${(0,h.t)(174)}</p>`;if("none"===e.choice)return n.qy`<p class="help" id="hint">${this.layout?(0,h.t)(1097):(0,h.t)(1089)}</p>`;if("own"===e.choice)return n.s6;if(this._canFollow&&!this._picking){const t=e.inherited,i=this.hass?.states?.[t.id],o=!this.hass?.states||!!i,s=this._name(t.id),a=o?s:(0,h.t)(1281,{name:s}),r=i?`${t.id} · ${this.hass.formatEntityState?.(i)??i.state}`:"";return n.qy`<p class="line" id="hint"><ha-icon icon="mdi:link-variant" aria-hidden="true"></ha-icon><span>${(0,h.t)(406,{source:St(t.from),name:a})}</span></p>${i?n.qy`<p class="sub mono">${r}</p>`:n.s6} `}if(this._picking||e.cardModule)return n.s6;const t=e.walled?n.qy`${(0,h.t)(18)}`:this._link((0,h.t)(670,{link:""}));return n.qy`<p class="help" id="hint">${t}</p>`}_mismatch(){const e=this.info;if(!e.mismatch||this._picking||"inherit"!==e.choice)return n.s6;const t=1===e.domains?.length;return n.qy`<p class="warn"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${this._mismatchText()}</span></p><div class="acts"><button type="button" class="btn btn-secondary btn-sm" @click=${this._pickAndOpen}>${(0,h.t)(750,{kind:t?qt(e.domains[0]):(0,h.t)(1207)})}</button> <button type="button" class="btn btn-secondary btn-sm" @click=${this._none}>${(0,h.t)(637)}</button></div>`}_invalid(){const e=this.info;if("own"!==e.choice||!e.invalidOwn)return n.s6;const t="none"===(this._raw??"").trim().toLowerCase();return n.qy`<p class="warn"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon><span>${t?(0,h.t)(304):(0,h.t)(1041)}</span></p>${t?n.qy`<div class="acts"><button type="button" class="btn btn-secondary btn-sm" @click=${this._none}>${(0,h.t)(1137)}</button></div>`:n.s6} `}render(){const e=this.info;if(!e)return n.qy``;const t=this._pressed,i=this._canFollow,o=[];e.cardModule||o.push({id:"same",label:(0,h.t)(863,{source:St(e.inherited?.from??"card")}),on:this._same,disabled:!i}),o.push({id:"pick",label:(0,h.t)(746),on:this._pick},{id:"none",label:(0,h.t)(637),on:this._none});const s=o.find(e=>e.id===t)??o.find(e=>!e.disabled)??o[0],a=this._hint();return n.qy`<div class="src"><div class="seg full" role="group" aria-label=${(0,h.t)(368)} @keydown=${this._onKey} @focusout=${this._onFocusOut}> ${o.map(e=>n.qy`<button type="button" data-choice=${e.id} aria-pressed=${t===e.id?"true":"false"} aria-disabled=${e.disabled?"true":n.s6} aria-describedby=${e.disabled&&a!==n.s6?"hint":n.s6} tabindex=${e===s?"0":"-1"} @click=${e.on} >${e.label}</button>`)}</div>${a} ${this._mismatch()} ${this._showPicker?n.qy`<mc-entity-picker .hass=${this.hass} .value=${"own"===e.choice?this._raw??"":""} .domain=${this.domain} .label=${(0,h.t)(716)} .placeholder=${(0,h.t)(736)} @value-changed=${this._onPicked} ></mc-entity-picker>`:n.s6} ${this._invalid()}<div class="sr-only" role="status" aria-live="polite" aria-atomic="true">${this._live}</div></div>`}};jt.styles=[l.x,n.AH`:host{display:block;min-width:0}.src{display:grid;gap:8px;min-width:0}.src .seg>button{white-space:normal;line-height:1.2}.src .seg>button[aria-pressed='true']{background:var(--mc-surface);color:var(--mc-accent-ink)}.src .seg>button[aria-disabled='true']{border:1px dashed var(--mc-text-2);opacity:.55;cursor:default}.src .line,.src .warn{display:flex;gap:6px;margin:0;font-size:.8125rem;overflow-wrap:anywhere}.src .warn{font-size:.875rem;color:var(--mc-warn-ink)}.src ha-icon{--mdc-icon-size:16px;flex:none}.src .sub{margin:0;padding-inline-start:22px;color:var(--mc-text-2);overflow-wrap:anywhere}.src .acts{display:flex;flex-wrap:wrap;gap:8px}.src .link{padding:0;border:0;background:none;color:var(--mc-accent-ink);font:inherit;text-decoration:underline;cursor:pointer}@media (pointer:coarse){.src .seg>button,.src .acts .btn,.src .link{min-height:44px}.src .seg>button{font-size:.875rem}}`],Ct([(0,o.MZ)({attribute:!1})],jt.prototype,"hass",void 0),Ct([(0,o.MZ)({attribute:!1})],jt.prototype,"info",void 0),Ct([(0,o.MZ)({attribute:!1})],jt.prototype,"value",void 0),Ct([(0,o.MZ)({type:String})],jt.prototype,"domain",void 0),Ct([(0,o.MZ)({type:Boolean})],jt.prototype,"layout",void 0),Ct([(0,o.MZ)({type:String})],jt.prototype,"fieldKey",void 0),Ct([(0,o.MZ)({attribute:!1})],jt.prototype,"onChange",void 0),Ct([(0,o.wk)()],jt.prototype,"_picking",void 0),Ct([(0,o.wk)()],jt.prototype,"_live",void 0),jt=Ct([(0,o.EM)("mc-entity-source")],jt);const Tt=["horizontal","vertical","row","tabs","slider-layout"],zt=e=>!e.type||Tt.includes(e.type);function Lt(e,t){const i={...e};return void 0===t?delete i.entity:i.entity=t,i}function Ot(e,t,i,o,s,a={}){const r=a.write??Lt;return s?n.qy`<div class="mc-field">${(0,kt.XT)(e,"entity",a.syncCtx)} <mc-entity-source .hass=${o} .info=${s} .value=${t.entity} .domain=${a.domain??""} .layout=${zt(t)} .fieldKey=${l=t,$t??l.id??""} .onChange=${e=>i(r(t,e))} ></mc-entity-source></div>`:(0,kt.cy)(e,t.entity,e=>i(r(t,e)),o,a.domain,"entity",a.syncCtx);var l}function Rt(e,t,i,o,s){const a=zt(e)&&"own"===o.choice&&!o.invalidOwn;return n.qy`<div class="mc-tab-content">${Ot((0,h.t)(357),e,i,t,o,{syncCtx:s})} ${a?(0,kt.vm)((0,h.t)(916),!0===e.share_entity,t=>i({...e,share_entity:t}),"share_entity",s,(0,h.t)(1096)):n.s6}</div>`}const Pt={horizontal:"row",row:"row",vertical:"column",tabs:"tabs","slider-layout":"slides"},Ht=["general","actions","conditions","design"];var It=i(6665),Vt=i(9948);const Dt=[{key:"tap_action",title:1030,icon:"mdi:gesture-tap"},{key:"hold_action",title:451,icon:"mdi:gesture-tap-hold"},{key:"double_tap_action",title:314,icon:"mdi:gesture-double-tap"}],Ft=[{label:660,value:"none"},{label:1107,value:"toggle"},{label:601,value:"more-info"},{label:623,value:"navigate"},{label:160,value:"perform-action"},{label:1118,value:"url"},{label:103,value:"assist"},{label:697,value:"popup"},{label:198,value:"close-popup"}];function Nt(e,t,i,o,s){return n.qy`${Dt.map(a=>n.qy`
      <section class="group">
        <div class="group-head"><ha-icon icon=${a.icon}></ha-icon><h3>${(0,h.t)(a.title)}</h3></div>
        ${function(e,t,i,o,s,a="action"){const r=e||{action:"none"},l=(0,It.oi)(r.hash),c=l&&!(0,It.BI)(l)?(0,h.t)(1150):"",d=`mc-popup-ids-${a}`,u="more-info"===r.action||"toggle"===r.action,p=!1!==r.use_module_entity,m={...r.data||{}},g="string"==typeof m.entity_id?m.entity_id:"";delete m.entity_id;const f=Object.keys(m).length?(0,A.fE)(m).trimEnd():"",v=e=>t({...r,data:Object.keys(e).length?e:void 0});return n.qy`
    <div class="mc-action-config">
      ${(0,kt.De)((0,h.t)(23),r.action,(0,h.tl)(Ft),e=>t({...r,action:e}),"action",s)}
      ${u&&o?(0,kt.vm)((0,h.t)(1151),p,e=>t({...r,use_module_entity:e,entity:e?void 0:r.entity}),"use_module_entity",s):n.s6}
      ${!u||o&&p?n.s6:(0,kt.cy)((0,h.t)(357),r.entity,e=>t({...r,entity:e}),i,void 0,"entity",s)}
      ${"toggle"===r.action&&o&&p?n.qy`<p class="help">${(0,h.tx)(1108,{entity:n.qy`<span class="mono">${o}</span>`})}</p>`:n.s6}
      ${"navigate"===r.action?(0,kt.Gz)((0,h.t)(626),r.navigation_path,e=>t({...r,navigation_path:e}),"navigation_path",s):n.s6}
      ${"popup"===r.action?n.qy`
            <div class="mc-field">
              ${(0,kt.XT)((0,h.t)(768),"hash",s)}
              <input
                class="input mono"
                type="text"
                spellcheck="false"
                autocomplete="off"
                list=${d}
                placeholder="kitchen"
                aria-label=${(0,h.t)(768)}
                .value=${l}
                @input=${e=>t({...r,hash:(0,It.oi)(e.target.value)||void 0})}
              />
              <datalist id=${d}>
                ${((0,Vt.T)()?.api.knownIds()??[]).map(e=>n.qy`<option value=${e}></option>`)}
              </datalist>
              ${c?n.qy`<p class="help error" role="alert">${c}</p>`:n.qy`<p class="help">${(0,h.tx)(700,{path:n.qy`<span class="mono">#${l||"id"}</span>`})}</p>`}
            </div>
          `:n.s6}
      ${"close-popup"===r.action?n.qy`<p class="help">${(0,h.t)(200)}</p>`:n.s6}
      ${"url"===r.action?(0,kt.Gz)((0,h.t)(1118),r.url_path,e=>t({...r,url_path:e}),"url_path",s):n.s6}
      ${"perform-action"===r.action?n.qy`
            ${(0,kt.M3)((0,h.t)(906),r.service,e=>t({...r,service:e}),i,"service",s)}
            ${(0,kt.Gz)((0,h.t)(1033),g,e=>{const t={...r.data||{}};e.trim()?t.entity_id=e.trim():delete t.entity_id,v(t)},"data",s,{placeholder:"entity_id",mono:!0})}
            <div class="mc-field">
              ${(0,kt.XT)((0,h.t)(907),"data",s)}
              <textarea
                class="input"
                rows="3"
                spellcheck="false"
                .value=${f}
                @input=${e=>{const t=e.target.value,i=t.trim()?(0,A.EA)(t):{};i&&"object"==typeof i&&!Array.isArray(i)&&v(g?{...i,entity_id:g}:{...i})}}
              ></textarea>
              <p class="help">${(0,h.t)(1202)}</p>
            </div>
          `:n.s6}
    </div>
  `}(e?.[a.key],e=>t(a.key,e),i,o,s?.(a.key),a.key)}
      </section>
    `)}`}const Zt=[{label:1001,value:"state"},{label:105,value:"attribute"},{label:1099,value:"time"},{label:1034,value:"template"}],Bt=[{value:"every",label:63},{value:"any",label:91}],Kt=[{label:1225,value:"eq"},{label:1236,value:"ne"}];function Wt(e,t,i){return n.qy`
    <div class="mc-field">
      ${(0,kt.XT)(e)}
      <input class="input" type="time" .value=${t||""} @input=${e=>i(e.target.value)} />
    </div>
  `}function Ut(e,t,i,o,s,a="module"){if(!e.length)return n.qy`
      <div class="empty">
        <ha-icon icon="mdi:eye-check-outline"></ha-icon>
        <strong>${(0,h.t)(68)}</strong>
        <p>${(e=>"rule"===e?(0,h.t)(32):"card"===e?(0,h.t)(28):"row"===e?(0,h.t)(31):"column"===e?(0,h.t)(29):(0,h.t)(30))(a)}</p>
        <button type="button" class="btn btn-secondary btn-sm" @click=${i.onAdd}>
          <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(40)}
        </button>
      </div>
    `;const r=s?.basePath;return n.qy`
    <div class="group">
      <p class="help lead">${(e=>"rule"===e?(0,h.t)(955):"card"===e?(0,h.t)(951):"row"===e?(0,h.t)(954):"column"===e?(0,h.t)(952):(0,h.t)(953))(a)}</p>
      ${function(e,t,i,o=(0,h.t)(566)){return n.qy`
    <div class="field">
      ${o?(0,kt.XT)(o,i?"mode":void 0,i):n.s6}
      <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(223)} @keydown=${i=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(i.key))return;i.preventDefault();const n="every"===e?"any":"every";t(n);const o=i.currentTarget;requestAnimationFrame(()=>o.querySelector(`[data-val="${n}"]`)?.focus())}}>
        ${Bt.map(i=>n.qy`
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
  `}(t,i.onMode,s,"")}
    </div>
    <div class="group cond-list">
      ${e.map((e,t)=>{const a=s?{...s,basePath:r?`${r}.conditions.${t}`:`conditions.${t}`}:void 0,l=e=>i.onUpdate(t,e);return n.qy`
          <div class="cond">
            <div class="cond-head">
              <span class="n">${(0,h.t)(225,{n:t+1})}</span>
              <button
                type="button"
                class="icon-btn sm danger"
                aria-label=${(0,h.t)(798,{n:t+1})}
                title=${(0,h.t)(797)}
                @click=${()=>i.onRemove(t)}
              >
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
            ${(0,kt.De)((0,h.t)(1117),e.type,(0,h.tl)(Zt),e=>l({type:e}),a?"type":void 0,a)}
            ${function(e,t,i,o){const s=e=>o?e:void 0;switch(e.type){case"state":case"attribute":return n.qy`
        ${(0,kt.cy)((0,h.t)(357),e.entity,e=>t({entity:e}),i,void 0,s("entity"),o)}
        ${"attribute"===e.type?(0,kt.Gz)((0,h.t)(105),e.attribute,e=>t({attribute:e}),s("attribute"),o):n.s6}
        ${function(e,t,i,o){const s=!e.state&&!!e.state_not,a=(s?e.state_not:e.state)||"";return n.qy`
    <div class="two">
      ${(0,kt.De)((0,h.t)(702),s?"ne":"eq",(0,h.tl)(Kt),e=>t("ne"===e?{state:void 0,state_not:a}:{state:a,state_not:void 0}))}
      ${(0,kt.Gz)(i,a,e=>t(s?{state_not:e}:{state:e}),o?s?"state_not":"state":void 0,o)}
    </div>
  `}(e,t,"attribute"===e.type?(0,h.t)(1161):(0,h.t)(1001),o)}
      `;case"time":return n.qy`
        <div class="two">
          ${Wt((0,h.t)(57),e.after,e=>t({after:e}))}
          ${Wt((0,h.t)(133),e.before,e=>t({before:e}))}
        </div>
      `;case"template":return(0,kt.fZ)((0,h.t)(1034),e.template,e=>t({template:e}),{rows:3},s("template"),o);default:return n.qy``}}(e,l,o,a)}
          </div>
        `})}
      <div>
        <button type="button" class="btn btn-secondary btn-sm" @click=${i.onAdd}>
          <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(40)}
        </button>
      </div>
    </div>
  `}var Gt=i(1299),Yt=i(8015),Qt=i(201),Jt=(i(5705),i(9315));const Xt={spin:993,glow:420,flame:391,drum:321,swing:1021,pulse:783,snow:980,shake:911,eq:371},ei=[{value:"off",label:680},{value:"auto",label:108},...Object.entries(Xt).map(([e,t])=>({value:e,label:t}))],ti=[{value:"off",label:680},{value:"load",label:683},{value:"change",label:682},{value:"loop",label:554}];var ii=i(5651),ni=i(3992),oi=i(9793),si=(i(7681),i(7106),i(2377),i(9048),i(9004)),ai=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const ri=[{name:"Roboto",family:"Roboto, sans-serif",category:"Sans-serif"},{name:"Open Sans",family:'"Open Sans", sans-serif',category:"Sans-serif"},{name:"Lato",family:"Lato, sans-serif",category:"Sans-serif",weights:[300,400,700]},{name:"Montserrat",family:"Montserrat, sans-serif",category:"Sans-serif"},{name:"Oswald",family:"Oswald, sans-serif",category:"Sans-serif"},{name:"Source Sans Pro",family:'"Source Sans Pro", sans-serif',category:"Sans-serif",weights:[300,400,700]},{name:"Raleway",family:"Raleway, sans-serif",category:"Sans-serif"},{name:"PT Sans",family:'"PT Sans", sans-serif',category:"Sans-serif",weights:[400,700]},{name:"Merriweather",family:"Merriweather, serif",category:"Serif"},{name:"Playfair Display",family:'"Playfair Display", serif',category:"Serif",weights:[400,500,700]},{name:"Lora",family:"Lora, serif",category:"Serif",weights:[400,500,700]},{name:"PT Serif",family:'"PT Serif", serif',category:"Serif",weights:[400,700]},{name:"Noto Sans",family:'"Noto Sans", sans-serif',category:"Sans-serif"},{name:"Ubuntu",family:"Ubuntu, sans-serif",category:"Sans-serif"},{name:"Poppins",family:"Poppins, sans-serif",category:"Sans-serif"},{name:"Nunito",family:"Nunito, sans-serif",category:"Sans-serif"},{name:"Inconsolata",family:"Inconsolata, monospace",category:"Monospace"},{name:"Fira Code",family:'"Fira Code", monospace',category:"Monospace"},{name:"Source Code Pro",family:'"Source Code Pro", monospace',category:"Monospace"},{name:"Dancing Script",family:'"Dancing Script", cursive',category:"Cursive",weights:[400,500,700]}],li=[{name:"Arial",family:"Arial, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Helvetica",family:"Helvetica, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Times New Roman",family:'"Times New Roman", serif',category:"Serif",isLocal:!0},{name:"Georgia",family:"Georgia, serif",category:"Serif",isLocal:!0},{name:"Courier New",family:'"Courier New", monospace',category:"Monospace",isLocal:!0},{name:"Verdana",family:"Verdana, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Tahoma",family:"Tahoma, sans-serif",category:"Sans-serif",isLocal:!0},{name:"Trebuchet MS",family:'"Trebuchet MS", sans-serif',category:"Sans-serif",isLocal:!0},{name:"Comic Sans MS",family:'"Comic Sans MS", cursive',category:"Cursive",isLocal:!0},{name:"Impact",family:"Impact, sans-serif",category:"Sans-serif",isLocal:!0}];let ci=class extends n.WF{constructor(){super(...arguments),this.value="",this._windowCtrl=new Ue.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery="",this._selectedFont=null,this._activeTab="local"}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_openModal(){this._showModal=!0,this._searchQuery="",this._selectedFont=null}_closeModal(){this._showModal=!1}_selectFont(e){this._selectedFont=e}_handleSave(){if(!this._selectedFont)return void this._closeModal();const e=this._selectedFont.family;this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_getFilteredFonts(){"google"===this._activeTab&&(0,si.E$)(ri.map(e=>e.name));const e="local"===this._activeTab?li:ri;if(!this._searchQuery)return e;const t=this._searchQuery.toLowerCase();return e.filter(e=>e.name.toLowerCase().includes(t)||e.category.toLowerCase().includes(t))}_getFontIcon(e){switch(e.toLowerCase()){case"serif":default:return"mdi:format-font";case"sans-serif":return"mdi:format-text";case"monospace":return"mdi:code-tags";case"cursive":return"mdi:script-text"}}render(){return n.qy`
      <div class="mc-picker-row">
        <input
          type="text"
          class="input"
          .value=${this.value}
          placeholder=${(0,h.t)(397)}
          aria-label=${(0,h.t)(397)}
          @input=${this._onInputChange}
        />
        <button type="button" class="btn btn-secondary" @click=${this._openModal}>${(0,h.t)(147)}</button>
      </div>
      ${this._showModal?this._renderModal():n.s6}
    `}_setTab(e){this._activeTab=e,this._searchQuery=""}_renderModal(){const e=this._getFilteredFonts();return n.qy`
      ${(0,Ue.bU)((0,h.t)(896),()=>this._closeModal(),"m",n.qy`

          <div class="mc-picker-search">
            <div class="seg full" role="tablist" aria-label=${(0,h.t)(398)}>
              <button
                type="button"
                role="tab"
                aria-selected=${"local"===this._activeTab?"true":"false"}
                @click=${()=>this._setTab("local")}
              >
                <ha-icon icon="mdi:desktop-classic"></ha-icon>
                ${(0,h.t)(549)}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected=${"google"===this._activeTab?"true":"false"}
                @click=${()=>this._setTab("google")}
              >
                <ha-icon icon="mdi:google"></ha-icon>
                ${(0,h.t)(425)}
              </button>
            </div>
            ${(0,Ue.LW)((0,h.t)(878),this._searchQuery,e=>{this._searchQuery=e})}
          </div>

          ${this._selectedFont?this._renderPreview():n.s6}

          <div class="mc-picker-list" role="listbox" aria-label=${(0,h.t)(399)}>
            ${e.length>0?e.map(e=>this._renderFontItem(e)):n.qy`<div class="mc-picker-empty">${(0,h.t)(640)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,h.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave} ?disabled=${!this._selectedFont}>${(0,h.t)(865)}</button>
          </div>
      `)}
    `}_renderPreview(){return this._selectedFont?n.qy`
      <div class="mc-font-preview">
        <div class="mc-font-preview-text" style="font-family: ${this._selectedFont.family}">
          ${(0,h.t)(1061)}
        </div>
      </div>
    `:n.qy``}_renderFontItem(e){const t=this._selectedFont?.name===e.name;return n.qy`
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
        <span class="chip">${e.isLocal?(0,h.t)(548):(0,h.t)(424)}</span>
      </button>
    `}};ci.styles=[l.x,tt.fz,tt.Qx],ai([(0,o.MZ)({attribute:!1})],ci.prototype,"hass",void 0),ai([(0,o.MZ)({type:String})],ci.prototype,"value",void 0),ai([(0,o.wk)()],ci.prototype,"_showModal",void 0),ai([(0,o.wk)()],ci.prototype,"_searchQuery",void 0),ai([(0,o.wk)()],ci.prototype,"_selectedFont",void 0),ai([(0,o.wk)()],ci.prototype,"_activeTab",void 0),ci=ai([(0,o.EM)("mc-font-picker")],ci),i(7798),i(6796);var di=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const hi=[{value:"state",label:1001},{value:"attribute",label:105},{value:"time",label:1099},{value:"template",label:1034}];let ui=class extends n.WF{render(){if(!this.condition)return n.qy``;const e=this.condition;return n.qy`
      <div class="cond">
        <div class="cond-head">
          <div class="select">
            <select
              class="input"
              aria-label=${(0,h.t)(224)}
              @change=${e=>this.onChange?.({type:e.target.value})}
            >
              ${hi.map(t=>n.qy`<option value=${t.value} ?selected=${e.type===t.value}>${(0,h.t)(t.label)}</option>`)}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
          <button
            type="button"
            class="icon-btn sm danger"
            aria-label=${(0,h.t)(797)}
            title=${(0,h.t)(797)}
            @click=${()=>this.onRemove?.()}
          >
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${this._renderFields(e)}
      </div>
    `}_textField(e,t,i,o="text"){return n.qy`
      <label class="field">
        <span class="field-head"><span class="lbl">${e}</span></span>
        <input
          class="input"
          type=${o}
          .value=${t||""}
          @input=${e=>i(e.target.value)}
        />
      </label>
    `}_renderFields(e){switch(e.type){case"state":case"attribute":{const t=!1!==e.use_module_entity,i=t?this.moduleEntity||e.entity||"":e.entity||"";return n.qy`
          ${this.moduleEntity?n.qy`
                <div class="switch-row">
                  <span class="txt">${(0,h.t)(1151)}</span>
                  <button
                    type="button"
                    class="switch"
                    role="switch"
                    aria-checked=${t?"true":"false"}
                    aria-label=${(0,h.t)(1151)}
                    @click=${()=>this.onChange?.({use_module_entity:!t})}
                  ></button>
                </div>
              `:n.s6}
          ${t&&this.moduleEntity?n.s6:n.qy`
                <div class="field">
                  <div class="field-head"><span class="lbl">${(0,h.t)(357)}</span></div>
                  <mc-entity-picker
                    .hass=${this.hass}
                    .value=${e.entity||""}
                    @value-changed=${e=>this.onChange?.({entity:e.detail.value})}
                  ></mc-entity-picker>
                </div>
              `}
          ${"attribute"===e.type?n.qy`
                <div class="field">
                  <div class="field-head"><span class="lbl">${(0,h.t)(105)}</span></div>
                  <mc-attribute-picker
                    .hass=${this.hass}
                    .value=${e.attribute||""}
                    .entityId=${i}
                    @value-changed=${e=>this.onChange?.({attribute:e.detail.value})}
                  ></mc-attribute-picker>
                </div>
              `:n.s6}
          <div class="two">
            ${this._textField((0,h.t)(372),e.state,e=>this.onChange?.({state:e}))}
            ${this._textField((0,h.t)(663),e.state_not,e=>this.onChange?.({state_not:e}))}
          </div>
        `}case"time":return n.qy`
          <div class="two">
            ${this._textField((0,h.t)(57),e.after,e=>this.onChange?.({after:e}),"time")}
            ${this._textField((0,h.t)(133),e.before,e=>this.onChange?.({before:e}),"time")}
          </div>
        `;case"template":return n.qy`
          <label class="field">
            <span class="field-head"><span class="lbl">${(0,h.t)(1034)}</span></span>
            <textarea
              class="input"
              rows="3"
              placeholder="{{ states('sensor.example') == 'on' }}"
              .value=${e.template||""}
              @input=${e=>this.onChange?.({template:e.target.value})}
            ></textarea>
          </label>
        `;default:return n.qy``}}};ui.styles=[l.x,n.AH`
      :host {
        display: block;
      }
      .cond-head .select {
        flex: 1;
      }
    `],di([(0,o.MZ)({attribute:!1})],ui.prototype,"condition",void 0),di([(0,o.MZ)({attribute:!1})],ui.prototype,"hass",void 0),di([(0,o.MZ)({attribute:!1})],ui.prototype,"moduleEntity",void 0),di([(0,o.MZ)({attribute:!1})],ui.prototype,"onChange",void 0),di([(0,o.MZ)({attribute:!1})],ui.prototype,"onRemove",void 0),ui=di([(0,o.EM)("mc-condition-row")],ui);var pi=i(1437);const mi={rotate:569,translate:568,scale:570,opacity:567,filter:563,"box-shadow":564};function gi(e,t){return e.flatMap(e=>"fx"===e?[]:"glow"===e?[t?"filter":"box-shadow"]:[e])}var fi=i(4959),vi=i(2231);let bi;var yi=i(9899),_i=i(4025),wi=i(5056),$i=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const xi=[{value:"always",label:66},{value:"entity_on",label:1183,entity:!0},{value:"state",label:1185,entity:!0},{value:"tap",label:684}],ki=[{value:"normal",label:661},{value:"reverse",label:836},{value:"alternate",label:64},{value:"alternate-reverse",label:65}],Ci=["infinite","1","2","3","5"],Mi="Light & colour",Si="cat-",Ai=e=>`${q.D8}${Si}${e}`,qi=e=>!(e.channels.includes("fx")||e.particles||e.ring||e.seasonal||"tap"===e.trigger),Ei=new Map,ji=new WeakMap;let Ti=class extends n.WF{constructor(){super(...arguments),this.animations=[],this.allowIcon=!1,this.allowLabel=!1,this.spinIcon=!1,this.motionOnly=!1,this.moduleLabel="",this.defaultEntity="",this.requireTriggerEntity=!1,this.allowEntityColor=!1,this.entityColor="",this._custom=new Set,this._libVersion=0}connectedCallback(){super.connectedCallback(),this._unsubLibrary??=(0,V.T_)().subscribe(()=>{this._libVersion=(0,V.T_)().version}),this._catalogue||this.motionOnly||(bi??=i.e(494).then(()=>i(298)).then(e=>(0,vi.t)("magic-card-preset-catalogue.js",e),e=>{bi=void 0,console.warn("Magic Card: preset catalogue not loaded",e)})).then(e=>{e&&(this._catalogue=e.CATALOGUE)})}disconnectedCallback(){super.disconnectedCallback(),this._unsubLibrary?.(),this._unsubLibrary=void 0}willUpdate(e){e.has("hass")&&!this.motionOnly&&(0,V.T_)().ensure(this.hass)}_mine(){return"ready"===(0,V.T_)().status?(0,V.T_)().list():[]}_doc(e){if(!(0,q.Bl)(e))return;const t=(0,q._R)(e),i="ready"===(0,V.T_)().status?(0,V.T_)().get(t):void 0;if(i||!t.startsWith(Si))return i;const n=this._stored(t);if(n){if(!ji.has(n)){const e=(0,q.H2)(n,{v2:"lenient"});ji.set(n,e.ok?e.doc:void 0)}return ji.get(n)}const o=this._catEntry(e);return o&&!Ei.has(o.id)&&Ei.set(o.id,o.build()),o&&Ei.get(o.id)}_stored(e){const t={};this.dispatchEvent(new CustomEvent("mc-card-bridge",{bubbles:!0,composed:!0,detail:t}));const i=t.sm?.getConfig(),n=(0,a.B)(i?.custom_animations).find(t=>t.id===e);return n||!i?.template||i.not_synced?.includes("custom_animations")||i.hidden_animations?.includes(e)?n:(0,a.B)(t.sm?.getState().templateAnimations).find(t=>t.id===e)}_catEntry(e){return this._catalogue?.find(t=>Ai(t.id)===e)}_pickPreset(e,t){const i=this.animations[e]?.preset??"",n=this.animations.map((i,n)=>n===e?(0,D.Ur)(i,t.value):i),o=this._catEntry(t.value);if(!o)return this._write(n),void((0,q.Bl)(t.value)&&!(0,q._R)(t.value).startsWith(Si)&&(0,wi.uw)((0,_i.d)(this),(0,q._R)(t.value)));(0,m.Z_)(this,o,n,e=>this._write(e)).then(e=>{e||(t.value=i)})}_catOptions(e,t){return(this._catalogue??[]).filter(t=>t.group===e).map(e=>n.qy`<option value=${Ai(e.id)} ?selected=${Ai(e.id)===t}>${e.name}</option>`)}_write(e){this.onChange?.(e)}_update(e,t){this._write(this.animations.map((i,n)=>n===e?t:i))}_patch(e,t){const i={...this.animations[e],...t};for(const[e,n]of Object.entries(t))void 0!==n&&""!==n||delete i[e];this._update(e,i)}_add(){const e=this.motionOnly?pi.u7.find(qi)??pi.u7[0]:pi.u7[0];this._write([...this.animations,(0,D.x_)(e.id,(0,w.$)("anim"),this.spinIcon)])}_remove(e){this._write(this.animations.filter((t,i)=>i!==e))}_field(e,t,i){return n.qy`
      <div class="field">
        <div class="field-head">${i?n.qy`<label for=${i}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}</div>
        ${t}
      </div>
    `}_select(e,t,i,o){return n.qy`
      <div class="select">
        <select class="input" id=${e} @change=${e=>o(e.target.value)}>
          ${i.map(e=>n.qy`<option value=${e.value} ?selected=${e.value===t} ?disabled=${!!e.disabled}>${e.label}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    `}_cardDocs(){const e={};this.dispatchEvent(new CustomEvent("mc-card-bridge",{bubbles:!0,composed:!0,detail:e}));const t=new Set(this._mine().map(e=>e.id));return(0,a.B)(e.sm?.getConfig()?.custom_animations).map(e=>({id:String(e.id??""),name:String(e.name??e.id??"")})).filter(e=>e.id&&!e.id.startsWith(Si)&&!t.has(e.id))}_presetSelect(e,t,i){const o=this.motionOnly,s=o?[]:this._mine(),a=o?[]:this._cardDocs(),r=new Map,l=e=>e.trim().toLowerCase();for(const e of[...s.map(e=>e.name),...a.map(e=>e.name),...pi.u7.map(e=>(0,Qt.t)(e.name))])r.set(l(e),(r.get(l(e))??0)+1);const c=(e,t)=>(r.get(l(e))??0)>1?(0,h.t)(1283,{name:e,id:t}):e,d=(0,q.Bl)(i)&&(0,q._R)(i).startsWith(Si),u=(0,pi.e2)(i),p=(o?!!u&&qi(u):!!u)||!!this._catEntry(i)||!d&&!!this._doc(i)||(0,q.Bl)(i)&&a.some(e=>e.id===(0,q._R)(i)),m=o&&(u||(0,q.Bl)(i))?(0,h.t)(1282,{name:u?(0,Qt.t)(u.name):(0,q._R)(i)}):d?this._doc(i)?.name??(0,q._R)(i):(0,q.Bl)(i)?(0,h.t)(1251,{id:(0,q._R)(i)}):(0,h.t)(1252,{id:i});return n.qy`
      <div class="select">
        <select
          class="input"
          id=${e}
          @change=${e=>this._pickPreset(t,e.target)}
        >
          ${p?n.s6:n.qy`<option value=${i} selected>${m}</option>`}
          ${s.length?n.qy`<optgroup label=${(0,h.t)(613)}>
                ${s.map(e=>n.qy`<option value=${q.D8+e.id} ?selected=${q.D8+e.id===i}>${c(e.name,e.id)}</option>`)}
              </optgroup>`:n.s6}
          ${a.length?n.qy`<optgroup label=${(0,h.t)(1074)}>
                ${a.map(e=>n.qy`<option value=${q.D8+e.id} ?selected=${q.D8+e.id===i}>${c(e.name,e.id)}</option>`)}
              </optgroup>`:n.s6}
          ${pi.id.filter(e=>!o||pi.u7.some(t=>t.group===e&&qi(t))).map(e=>n.qy`<optgroup label=${(0,Qt.t)(pi.Au[e])}>
              ${pi.u7.filter(t=>t.group===e&&(!o||qi(t))).map(e=>n.qy`<option value=${e.id} ?selected=${e.id===i}>${(0,Qt.t)(e.name)}</option>`)}
              ${e!==Mi||o?n.s6:this._catOptions(e,i)}
            </optgroup>`)}
          ${this._catalogue&&!o?[...new Set(this._catalogue.map(e=>e.group))].filter(e=>e!==Mi).map(e=>n.qy`<optgroup label=${e}>${this._catOptions(e,i)}</optgroup>`):n.s6}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    `}_target(e,t,i="module"){const o=[{value:"module",label:this.moduleLabel||(0,h.t)(590)},{value:"icon",label:(0,h.t)(466)},...this.allowLabel?[{value:"label",label:(0,h.t)(503)}]:[]],s=o.some(e=>e.value===t.target)?t.target:i,a=t=>this._patch(e,{target:t});return n.qy`
      <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(1032)} @keydown=${e=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))return;e.preventDefault();const t=o.findIndex(e=>e.value===s),i=o["Home"===e.key?0:"End"===e.key?o.length-1:(t+("ArrowLeft"===e.key||"ArrowUp"===e.key?-1:1)+o.length)%o.length].value,n=e.currentTarget;a(i),requestAnimationFrame(()=>n.querySelector(`[data-val="${i}"]`)?.focus())}}>
        ${o.map(e=>{const t=e.value===s;return n.qy`<button
            type="button"
            role="radio"
            data-val=${e.value}
            aria-checked=${t?"true":"false"}
            tabindex=${t?"0":"-1"}
            @click=${()=>a(e.value)}
          >${e.label}</button>`})}
      </div>
    `}_repeat(e,t,i,n){const o=t.iterations??n??(0,pi.e2)(t.preset)?.defaults.iterations??"infinite",s=this._custom.has(t.id)||!Ci.includes(String(o)),a=[...Ci.map(e=>({value:e,label:"infinite"===e?(0,h.t)(489):e})),{value:"custom",label:(0,h.t)(255)}];return this._field((0,h.t)(806),this._select(i,s?"custom":String(o),a,i=>{const n=new Set(this._custom);if("custom"===i)return n.add(t.id),this._custom=n,void("infinite"===o&&this._patch(e,{iterations:10}));n.delete(t.id),this._custom=n,this._patch(e,{iterations:"infinite"===i?"infinite":Number(i)})}),i)}_seasonalBlock(e,t,i,o){const s=e=>`an-${t}-${e}`,a=e.trigger??"always",r=o.seasonal,l=!!fi.GN[r??""],c=!1!==e.decorations,d="weather"===r?(0,h.t)(396):"daynight"===r?(0,h.t)(998):"";return n.qy`
      <div class="cond">
        <div class="cond-head">
          <span class="n">${(0,h.t)(89,{n:t+1})} <span class="sub">· ${(0,Qt.t)(o.name)}</span></span>
          <button type="button" class="icon-btn sm danger" aria-label=${(0,h.t)(284,{n:t+1})} title=${(0,h.t)(283)} @click=${()=>this._remove(t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${i?n.qy`<p class="help anim-note">${i}</p>`:n.s6}
        ${this._field((0,h.t)(772),this._presetSelect(s("preset"),t,e.preset),s("preset"))}
        ${d?n.qy`<p class="help">${d}</p>`:n.s6}
        ${this._play(t,e,a,s("play"))}
        <div class="two">
          ${this._field((0,h.t)(297),n.qy`<input
              class="input"
              id=${s("int")}
              type="number"
              min="0"
              max="100"
              step="5"
              .value=${String(e.intensity??o.defaults.intensity)}
              @input=${e=>{const i=e.target.value;this._patch(t,{intensity:""===i?void 0:Number(i)})}}
            />`,s("int"))}
          ${this._field((0,h.t)(1014),n.qy`<input
              class="input"
              id=${s("strength")}
              type="number"
              min="0"
              max="100"
              step="5"
              .value=${String(e.strength??100)}
              @input=${e=>{const i=e.target.value;this._patch(t,{strength:""===i?void 0:Number(i)})}}
            />`,s("strength"))}
        </div>
        ${l?n.qy`<div class="switch-row">
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
            </div>`:n.s6}
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm" @click=${()=>this._update(t,(0,D.Q2)(e))}>
            <ha-icon icon="mdi:restore"></ha-icon>${(0,h.t)(823)}
          </button>
        </div>
      </div>
    `}_block(e,t,i){if((0,q.Bl)(e.preset))return this._customBlock(e,t,i);const o=(0,pi.e2)(e.preset);if(o?.seasonal)return this._seasonalBlock(e,t,i,o);const s=o?.defaults,a=e=>`an-${t}-${e}`,r=e.trigger??"always",l=e.iterations??s?.iterations??"infinite",c=this._custom.has(e.id)||!Ci.includes(String(l)),d=e.easing??s?.easing??"ease",u=pi.Z4.map(e=>({value:e.id,label:(0,Qt.t)(e.label)}));return pi.Z4.some(e=>e.id===d)||u.push({value:d,label:d}),n.qy`
      <div class="cond">
        <div class="cond-head">
          <span class="n">${(0,h.t)(89,{n:t+1})} <span class="sub">· ${o?(0,Qt.t)(o.name):e.preset}</span></span>
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
        ${i?n.qy`<p class="help anim-note">${i}</p>`:n.s6}
        ${this._field((0,h.t)(772),this._presetSelect(a("preset"),t,e.preset),a("preset"))}
        ${this.allowIcon?this._field((0,h.t)(1032),this._target(t,e,this.spinIcon&&(0,D.N$)(e,o)?"icon":"module")):n.s6}
        ${this._play(t,e,r,a("play"))}
        ${"state"===r?this._field((0,h.t)(1006),n.qy`<input
                class="input"
                id=${a("state")}
                type="text"
                .value=${e.state||""}
                @input=${e=>this._patch(t,{state:e.target.value})}
              />`,a("state")):n.s6}
        ${this._field((0,h.t)(205),n.qy`<mc-color-picker
            .value=${e.color||""}
            .label=${(0,h.t)(88)}
            .allowEntity=${this.allowEntityColor}
            .entityColor=${this.entityColor}
            @value-changed=${e=>this._patch(t,{color:e.detail.value})}
          ></mc-color-picker>`)}
        ${o&&(0,pi.cq)(o)?this._field((0,h.t)(1014),n.qy`<input
                class="input"
                id=${a("strength")}
                type="number"
                min="0"
                max="100"
                step="5"
                .value=${String(e.strength??100)}
                @input=${e=>{const i=e.target.value;this._patch(t,{strength:""===i?void 0:Number(i)})}}
              />`,a("strength")):n.s6}
        <div class="two">
          ${this._field((0,h.t)(326),this._time(t,"duration",e.duration??s?.duration,s?.duration))}
          ${this._field((0,h.t)(280),this._time(t,"delay",e.delay??s?.delay,s?.delay))}
        </div>
        <div class="two">
          ${this._field((0,h.t)(327),this._select(a("easing"),d,u,e=>this._patch(t,{easing:e})),a("easing"))}
          ${this._repeat(t,e,a("repeat"))}
        </div>
        ${c?this._field((0,h.t)(807),n.qy`<input
                class="input"
                id=${a("count")}
                type="number"
                min="1"
                step="1"
                .value=${"number"==typeof l?String(l):""}
                @input=${e=>{const i=Number(e.target.value);Number.isFinite(i)&&i>0&&this._patch(t,{iterations:i})}}
              />`,a("count")):n.s6}
        <div class="two">
          ${this._field((0,h.t)(305),this._select(a("dir"),e.direction??s?.direction??"normal",(0,h.tl)(ki),e=>this._patch(t,{direction:e})),a("dir"))}
          ${o?this._field((0,pi.sf)(o,Qt.t),n.qy`<input
                  class="input"
                  id=${a("int")}
                  type="number"
                  min=${o.intensity.min}
                  max=${o.intensity.max}
                  step=${o.intensity.step??1}
                  .value=${String(e.intensity??o.defaults.intensity)}
                  @input=${e=>{const i=e.target.value;this._patch(t,{intensity:""===i?void 0:Number(i)})}}
                />`,a("int")):n.s6}
        </div>
        ${o?n.qy`<div class="foot">
              <button type="button" class="btn btn-text btn-sm" @click=${()=>this._update(t,(0,D.Q2)(e))}>
                <ha-icon icon="mdi:restore"></ha-icon>${(0,h.t)(823)}
              </button>
            </div>`:n.s6}
      </div>
    `}_number(e,t,i,o,s,a,r,l){return n.qy`<input
      class="input"
      id=${i}
      type="number"
      min=${a}
      max=${r}
      step=${l}
      placeholder=${s}
      .value=${void 0===o?"":String(o)}
      @input=${i=>{const n=i.target.value;this._patch(e,{[t]:""===n?void 0:Number(n)})}}
    />`}_missingHelp(){switch((0,V.T_)().status){case"unavailable":return(0,h.t)(665);case"ready":return(0,h.t)(664);default:return(0,h.t)(538)}}_keepCopy(e,t){const i=(0,V.T_)().get(e),o=i?(0,_i.d)(this):void 0;if(!i||!o)return n.s6;const s=(0,wi.av)(o.getConfig(),e),a=(0,wi.Wk)(i),r=a<1024?(0,h.t)(1299,{n:a}):(0,h.t)(1306,{size:(a/1024).toFixed(1)});return n.qy`<div class="switch-row">
      <div class="txt">
        <div class="field-head"><label for=${t}>${s?(0,h.t)(500,{size:r}):(0,h.t)(499,{size:r})}</label></div>
        <p class="help" id="${t}-help">${(0,h.t)(1193)}</p>
      </div>
      <button type="button" class="switch" id=${t} role="switch" aria-checked=${s?"true":"false"} aria-describedby="${t}-help"
        @click=${()=>{(0,wi.oS)(o,e,!s,!1),this.requestUpdate()}}></button>
    </div>`}_customBlock(e,t,i){const o=this._doc(e.preset),s=(0,q._R)(e.preset),a=e=>`an-${t}-${e}`,r=e.trigger??"always",l=n.qy`
      <div class="cond-head">
        <span class="n">${(0,h.t)(89,{n:t+1})} <span class="sub">· ${o?.name??s}</span></span>
        <button type="button" class="icon-btn sm danger" aria-label=${(0,h.t)(284,{n:t+1})} title=${(0,h.t)(283)} @click=${()=>this._remove(t)}>
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${i?n.qy`<p class="help anim-note">${i}</p>`:n.s6}
      ${this._field((0,h.t)(772),this._presetSelect(a("preset"),t,e.preset),a("preset"))}
      ${this._keepCopy(s,a("keep"))}
    `;if(!o)return n.qy`<div class="cond">
        ${l}
        <p class="help">
          ${s.startsWith("quick-")?(0,h.t)(70):s.startsWith(Si)?(0,h.t)(16):this._missingHelp()}
        </p>
        ${this._play(t,e,r,a("play"))}
      </div>`;const c="particles"===o.kind||"path"===o.kind&&"particles"===o.path?.subject,d=o.particles?.preset?(0,pi.e2)(o.particles.preset):void 0,u=e.easing??o.easing,p=pi.Z4.map(e=>({value:e.id,label:(0,Qt.t)(e.label)}));pi.Z4.some(e=>e.id===u)||p.push({value:u,label:u});const m=e.iterations??o.iterations,g=this._custom.has(e.id)||!Ci.includes(String(m)),f=!c&&"sequence"!==o.kind,v="path"===o.kind?"icon"===o.path?.subject?"icon":"module":"icon"===o.target?"icon":"module";return n.qy`
      <div class="cond">
        ${l}
        ${this.allowIcon&&!c?this._field((0,h.t)(1032),this._target(t,e,v)):n.s6}
        ${this._play(t,e,r,a("play"))}
        ${o.clips?.length||o.bindings?.length?this._field((0,h.t)(365),n.qy`<mc-entity-picker
                .hass=${this.hass}
                .value=${e.entity||""}
                .label=${(0,h.t)(365)}
                .placeholder=${this.defaultEntity?(0,h.t)(594,{entity:this.defaultEntity}):"entity_id"}
                @value-changed=${e=>this._patch(t,{entity:e.detail.value})}
              ></mc-entity-picker>`):n.s6}
        ${"state"===r?this._field((0,h.t)(1006),n.qy`<input
                class="input"
                id=${a("state")}
                type="text"
                .value=${e.state||""}
                @input=${e=>this._patch(t,{state:e.target.value})}
              />`,a("state")):n.s6}
        ${"sequence"===o.kind?n.s6:this._field((0,h.t)(205),n.qy`<mc-color-picker
                .value=${e.color||""}
                .label=${(0,h.t)(88)}
                .allowEntity=${this.allowEntityColor}
                .entityColor=${this.entityColor}
                @value-changed=${e=>this._patch(t,{color:e.detail.value})}
              ></mc-color-picker>`)}
        ${"sequence"===o.kind?n.s6:this._field((0,h.t)(1014),this._number(t,"strength",a("strength"),e.strength,String(100),0,100,5),a("strength"))}
        <div class="two">
          ${this._field((0,h.t)(326),this._time(t,"duration",e.duration,`${o.duration}s`))}
          ${this._field((0,h.t)(280),this._time(t,"delay",e.delay,"0s"))}
        </div>
        <div class="two">
          ${this._field((0,h.t)(327),this._select(a("easing"),u,p,e=>this._patch(t,{easing:e})),a("easing"))}
          ${this._repeat(t,e,a("repeat"),o.iterations)}
        </div>
        ${g?this._field((0,h.t)(807),n.qy`<input
                class="input"
                id=${a("count")}
                type="number"
                min="1"
                step="1"
                .value=${"number"==typeof m?String(m):""}
                @input=${e=>{const i=Number(e.target.value);Number.isFinite(i)&&i>0&&this._patch(t,{iterations:i})}}
              />`,a("count")):n.s6}
        <div class="two">
          ${this._field((0,h.t)(305),this._select(a("dir"),e.direction??o.direction??"normal",(0,h.tl)(ki),e=>this._patch(t,{direction:e})),a("dir"))}
          ${f?this._field((0,h.t)(69),this._number(t,"intensity",a("int"),e.intensity,"100",0,400,5),a("int")):d?this._field((0,pi.sf)(d,Qt.t),this._number(t,"intensity",a("int"),e.intensity,String(o.particles?.intensity??d.defaults.intensity),d.intensity.min,d.intensity.max,d.intensity.step??1),a("int")):n.s6}
        </div>
        <div class="foot">
          <button type="button" class="btn btn-text btn-sm" @click=${()=>this._update(t,(0,D.Q2)(e))}>
            <ha-icon icon="mdi:restore"></ha-icon>${(0,h.t)(822)}
          </button>
        </div>
      </div>
    `}_play(e,t,i,o){const s=!!(t.trigger_entity||!this.requireTriggerEntity&&this.defaultEntity),a=xi.filter(e=>!this.motionOnly||"tap"!==e.value||"tap"===i).map(e=>({...e,label:(0,h.t)(e.label),disabled:!!e.entity&&!s&&e.value!==i}));return n.qy`
      ${this._field((0,h.t)(363),n.qy`<mc-entity-picker
          .hass=${this.hass}
          .value=${t.trigger_entity||""}
          .label=${this.defaultEntity&&!this.requireTriggerEntity?(0,h.t)(594,{entity:this.defaultEntity}):(0,h.t)(363)}
          @value-changed=${t=>this._patch(e,{trigger_entity:t.detail.value})}
        ></mc-entity-picker>`)}
      ${this._field((0,h.t)(762),this._select(o,i,a,t=>this._patch(e,{trigger:t})),o)}
      ${!s&&"always"!==i&&xi.find(e=>e.value===i)?.entity?n.qy`<p class="help">${(0,h.t)(743)}</p>`:n.s6}
    `}_time(e,t,i,o){return n.qy`<mc-unit-field
      .value=${i??""}
      .label=${"duration"===t?(0,h.t)(326):(0,h.t)(280)}
      .units=${["s","ms"]}
      .placeholder=${(o??"0s").replace(/m?s$/,"")}
      @value-changed=${i=>this._patch(e,{[t]:i.detail.value})}
    ></mc-unit-field>`}render(){const e=function(e,t={}){const i=!1!==t.allowIcon,n=e=>(0,D.Zq)(e,i)||!!t.spinIcon&&(0,D.N$)(e,(0,pi.e2)(e.preset)),o=e=>(0,D._j)(e,i)?2:n(e)?1:0;return e.map((t,i)=>{const s=(0,pi.e2)(t.preset);if(!s)return;const a=gi(s.channels,n(t));for(let r=i-1;r>=0;r--){const i=(0,pi.e2)(e[r].preset);if(!i||o(e[r])!==o(t))continue;const l=gi(i.channels,n(e[r])).find(e=>a.includes(e));if(!l)continue;const c=s.channels.includes("glow")||i.channels.includes("glow"),d="filter"===l&&c?mi["box-shadow"]:mi[l];return{name:i.name,what:d}}})}(this.animations,{allowIcon:this.allowIcon,spinIcon:this.spinIcon}).map(e=>e?(0,Qt.t)(346,{name:(0,Qt.t)(e.name),what:(0,Qt.t)(e.what)}):void 0);return n.qy`
      <div class="list">
        ${this.animations.map((t,i)=>this._block(t,i,e[i]))}
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(34)}
          </button>
          ${this.motionOnly?n.s6:n.qy`<button type="button" class="btn btn-text btn-sm" @click=${e=>{(0,yi.uK)(e.currentTarget,this.hass,"animation")}}>${(0,h.t)(518)}</button>`}
        </div>
      </div>
    `}};Ti.styles=[l.x,n.AH`
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
    `],$i([(0,o.MZ)({attribute:!1})],Ti.prototype,"animations",void 0),$i([(0,o.MZ)({type:Boolean})],Ti.prototype,"allowIcon",void 0),$i([(0,o.MZ)({type:Boolean})],Ti.prototype,"allowLabel",void 0),$i([(0,o.MZ)({type:Boolean})],Ti.prototype,"spinIcon",void 0),$i([(0,o.MZ)({type:Boolean})],Ti.prototype,"motionOnly",void 0),$i([(0,o.MZ)({type:String})],Ti.prototype,"moduleLabel",void 0),$i([(0,o.MZ)({attribute:!1})],Ti.prototype,"hass",void 0),$i([(0,o.MZ)({type:String})],Ti.prototype,"defaultEntity",void 0),$i([(0,o.MZ)({type:Boolean})],Ti.prototype,"requireTriggerEntity",void 0),$i([(0,o.MZ)({type:Boolean})],Ti.prototype,"allowEntityColor",void 0),$i([(0,o.MZ)({type:String})],Ti.prototype,"entityColor",void 0),$i([(0,o.MZ)({attribute:!1})],Ti.prototype,"onChange",void 0),$i([(0,o.wk)()],Ti.prototype,"_custom",void 0),$i([(0,o.wk)()],Ti.prototype,"_libVersion",void 0),$i([(0,o.wk)()],Ti.prototype,"_catalogue",void 0),Ti=$i([(0,o.EM)("mc-animation-list")],Ti);var zi=i(4355),Li=i(2928),Oi=i(3507),Ri=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const Pi=[{value:"off",label:680},{value:"value",label:1161},{value:"animated",label:80}],Hi=[{value:"snake",label:977},{value:"pulse",label:783},{value:"full",label:408},{value:"dots",label:185},{value:"dashes",label:563}],Ii=[{value:"top",label:1109},{value:"top-right",label:1111},{value:"right",label:838},{value:"bottom-right",label:144},{value:"bottom",label:142},{value:"bottom-left",label:143},{value:"left",label:516},{value:"top-left",label:1110}],Vi=[{value:"cw",label:196},{value:"ccw",label:250}],Di=[{value:"round",label:844},{value:"butt",label:392}],Fi=[{value:"inside",label:493},{value:"center",label:182},{value:"outside",label:708}],Ni=[{value:"number",label:676},{value:"entity",label:357}],Zi=[{value:"remaining",label:794},{value:"elapsed",label:342}],Bi=[{value:"always",label:66},{value:"entity_on",label:1183,entity:!0},{value:"state",label:1185,entity:!0}];let Ki=class extends n.WF{constructor(){super(...arguments),this.defaultEntity="",this.requireEntity=!1,this.clipped=!1,this.allowEntityColor=!1,this.entityColor="",this._entityBound={}}get _r(){return this.ring&&"object"==typeof this.ring?this.ring:{}}_emit(e){this._emitted=JSON.stringify(e??null),this.onChange?.(e)}_set(e){const t={...this._r,...e};for(const[e,i]of Object.entries(t))(void 0===i||""===i||"number"==typeof i&&Number.isNaN(i))&&delete t[e];this._emit(t)}_mode(e){"off"===e?this._emit(void 0):this._set({mode:e})}willUpdate(e){e.has("ring")&&JSON.stringify(this.ring??null)!==this._emitted&&(this._entityBound={})}_field(e,t,i,o,s){const a=void 0!==t&&void 0!==this._r[t]&&""!==this._r[t];return n.qy`
      <div class="field">
        <div class="field-head">
          ${o?n.qy`<label for=${o}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}
          ${t?(0,Jt.i)(e,a,s??(()=>this._set({[t]:void 0}))):n.s6}
        </div>
        ${i}
      </div>
    `}_seg(e,t,i,o){return n.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=i.findIndex(e=>e.value===t),s="rtl"===(0,Ge.k)(e.currentTarget)?-1:1,a={ArrowRight:s,ArrowDown:1,ArrowLeft:-s,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const r=i[(n+a[e.key]+i.length)%i.length].value,l=e.currentTarget;o(r),requestAnimationFrame(()=>l.querySelector(`[data-val="${r}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return n.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>o(e.value)}
        >${(0,h.t)(e.label)}</button>`})}
    </div>`}_select(e,t,i,o){return n.qy`<div class="select">
      <select class="input" id=${e} @change=${e=>o(e.target.value)}>
        ${i.map(e=>n.qy`<option value=${e.value} ?selected=${e.value===t} ?disabled=${!!e.disabled}>${(0,h.t)(e.label)}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`}_number(e,t,i,o,s,a=1){const r=this._r[t];return n.qy`<input
      class="input"
      id=${e}
      type="number"
      min=${o??n.s6}
      max=${s??n.s6}
      step=${a}
      placeholder=${String(i)}
      .value=${void 0===r?"":String(r)}
      @input=${e=>{const i=e.target.value,n=Number(i);""!==i.trim()&&Number.isFinite(n)&&this._set({[t]:n})}}
      @change=${e=>{const i=e.target;""!==i.value.trim()||i.validity?.badInput||this._set({[t]:void 0})}}
    />`}_time(e,t,i){return n.qy`<mc-unit-field
      .value=${this._r[e]||""}
      .label=${t}
      .units=${["s","ms"]}
      .placeholder=${i.replace(/m?s$/,"")}
      @value-changed=${t=>this._set({[e]:t.detail.value})}
    ></mc-unit-field>`}_color(e,t){return n.qy`<mc-color-picker
      .value=${this._r[e]||""}
      .label=${t}
      .allowEntity=${this.allowEntityColor}
      .entityColor=${this.entityColor}
      .gradient=${"color"===e?"linear":""}
      @value-changed=${t=>this._set({[e]:t.detail.value})}
    ></mc-color-picker>`}_entity(e,t,i){return n.qy`<mc-entity-picker
      .hass=${this.hass}
      .value=${this._r[e]||""}
      .label=${i}
      @value-changed=${t=>this._set({[e]:t.detail.value})}
    ></mc-entity-picker>`}_bound(e,t){const i=this._r[e],o="object"==typeof i&&null!==i?i:void 0,s=o||this._entityBound[e]?"entity":"number",a=t=>this._set({[e]:t}),r=`ring-${e}`,l=o?.entity||"",c=!!l&&Object.keys(this.hass?.states[l]?.attributes||{}).length>0;return this._field(t,e,n.qy`${this._seg((0,h.t)(1255,{label:t}),s,Ni,t=>{this._entityBound={...this._entityBound,[e]:"entity"===t},"entity"===t!=!!o&&this._set({[e]:void 0})})}
        ${"number"===s?this._number(r,e,zi.Y4[e],void 0,void 0,.1):n.qy`<mc-entity-picker
                .hass=${this.hass}
                .value=${l}
                .label=${(0,h.t)(1254,{label:t})}
                @value-changed=${e=>a(e.detail.value?{entity:e.detail.value}:void 0)}
              ></mc-entity-picker>
              ${c?n.qy`<mc-attribute-picker
                    .hass=${this.hass}
                    .entityId=${l}
                    .value=${o?.attribute||""}
                    @value-changed=${e=>a(e.detail.value?{entity:l,attribute:e.detail.value}:{entity:l})}
                  ></mc-attribute-picker>`:n.s6}`}`,"number"===s?r:void 0,()=>{this._entityBound={...this._entityBound,[e]:!1},a(void 0)})}_value(){const e=this._r,t=e.entity||this.defaultEntity,i=(0,Oi._7)(t)&&!e.attribute,o=(e,t)=>"number"==typeof e?e:t;return n.qy`
      ${this._field((0,h.t)(357),"entity",this._entity("entity",(0,h.t)(357),this.defaultEntity?(0,h.t)(594,{entity:this.defaultEntity}):(0,h.t)(357)))}
      ${t?n.s6:n.qy`<p class="help">${(0,h.t)(742)}</p>`}
      ${!i&&t&&this.hass?.states[t]&&Object.keys(this.hass.states[t].attributes||{}).length?this._field((0,h.t)(105),"attribute",n.qy`<mc-attribute-picker
              .hass=${this.hass}
              .entityId=${t}
              .value=${e.attribute||""}
              @value-changed=${e=>this._set({attribute:e.detail.value})}
            ></mc-attribute-picker>`):n.s6}
      ${i?this._field((0,h.t)(1101),"timer_fill",n.qy`${this._seg((0,h.t)(1101),e.timer_fill??"remaining",Zi,e=>this._set({timer_fill:"remaining"===e?void 0:e}))}
              <p class="help">${(0,h.t)(588)}</p>`):n.qy`<div class=${"object"==typeof e.min||"object"==typeof e.max||this._entityBound.min||this._entityBound.max?"bounds":"two"}>
            ${this._bound("min",(0,h.t)(586))} ${this._bound("max",(0,h.t)(575))}
          </div>`}
      ${this._field((0,h.t)(386),"transition",this._time("transition",(0,h.t)(386),zi.Y4.transition))}
      ${(0,Li._)((0,h.t)(1092),e.thresholds,e=>this._set({thresholds:e}),{min:i?0:o(e.min,zi.Y4.min),max:i?100:o(e.max,zi.Y4.max),help:i?(0,h.t)(841):(0,h.t)(842)})}
    `}_animated(){const e=this._r.animation??zi.Y4.animation;return n.qy`
      ${this._field((0,h.t)(87),"animation",this._select("ring-anim",e,Hi,e=>this._set({animation:e})),"ring-anim")}
      <div class="two">
        ${"snake"===e?this._field((0,h.t)(517),"length",this._number("ring-len","length",zi.Y4.length,1,99),"ring-len"):n.s6}
        ${"full"===e?n.s6:this._field((0,h.t)(991),"speed",this._time("speed",(0,h.t)(991),zi.Y4.speed))}
      </div>
    `}_position(){const e=e=>this._set({position:e}),t=this._r.position??zi.Y4.position;if(!this.clipped)return this._field((0,h.t)(769),"position",this._seg((0,h.t)(769),t,Fi,e));const i=Fi.filter(e=>"outside"!==e.value);return this._field((0,h.t)(769),"position",n.qy`${this._seg((0,h.t)(769),"outside"===t?"inside":t,i,e)}
        <p class="help">${(0,h.t)(1049)}</p>`)}_show(){const e=this._r,t=e.trigger||"always",i=!!(e.trigger_entity||!this.requireEntity&&this.defaultEntity),o=Bi.map(e=>({...e,disabled:!!e.entity&&!i&&e.value!==t}));return n.qy`
      ${this._field((0,h.t)(364),"trigger_entity",this._entity("trigger_entity",(0,h.t)(364),this.defaultEntity&&!this.requireEntity?(0,h.t)(594,{entity:this.defaultEntity}):(0,h.t)(364)))}
      ${this._field((0,h.t)(923),"trigger",this._select("ring-show",t,o,e=>this._set({trigger:"always"===e?void 0:e})),"ring-show")}
      ${i||"always"===t?n.s6:n.qy`<p class="help">${(0,h.t)(744)}</p>`}
      ${"state"===t?this._field((0,h.t)(1006),"state",n.qy`<input class="input" id="ring-state" type="text" .value=${e.state||""} @input=${e=>this._set({state:e.target.value})} />`,"ring-state"):n.s6}
    `}render(){const e=this._r,t="value"===e.mode||"animated"===e.mode?e.mode:"off";return n.qy`
      <div class="ring-ed">
        ${this._field((0,h.t)(589),void 0,this._seg((0,h.t)(843),t,Pi,e=>this._mode(e)))}
        ${"off"===t?n.s6:n.qy`
              ${"value"===t?this._value():this._animated()}
              <div class="two">
                ${this._field((0,h.t)(1189),"width",this._number("ring-width","width",zi.Y4.width,.5,40,.5),"ring-width")}
                ${this._field((0,h.t)(421),"glow",this._number("ring-glow","glow",0,0,40),"ring-glow")}
              </div>
              ${this._field((0,h.t)(205),"color",this._color("color",(0,h.t)(840)))}
              ${this._field((0,h.t)(1112),"track_color",this._color("track_color",(0,h.t)(1112)))}
              ${this._field((0,h.t)(1113),"track_opacity",this._number("ring-track-op","track_opacity",100,0,100,5),"ring-track-op")}
              ${this._field((0,h.t)(999),"start",this._select("ring-start",e.start??zi.Y4.start,Ii,e=>this._set({start:e})),"ring-start")}
              ${this._field((0,h.t)(305),"direction",this._seg((0,h.t)(305),e.direction??"cw",Vi,e=>this._set({direction:e})))}
              ${this._field((0,h.t)(166),"linecap",this._seg((0,h.t)(166),e.linecap??"round",Di,e=>this._set({linecap:e})))}
              ${this._position()}
              ${this._show()}
            `}
      </div>
    `}};Ki.styles=[l.x,n.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .ring-ed,
      .bounds {
        display: grid;
        gap: 16px;
      }
    `],Ri([(0,o.MZ)({attribute:!1})],Ki.prototype,"ring",void 0),Ri([(0,o.MZ)({attribute:!1})],Ki.prototype,"hass",void 0),Ri([(0,o.MZ)({type:String})],Ki.prototype,"defaultEntity",void 0),Ri([(0,o.MZ)({type:Boolean})],Ki.prototype,"requireEntity",void 0),Ri([(0,o.MZ)({type:Boolean})],Ki.prototype,"clipped",void 0),Ri([(0,o.MZ)({type:Boolean})],Ki.prototype,"allowEntityColor",void 0),Ri([(0,o.MZ)({type:String})],Ki.prototype,"entityColor",void 0),Ri([(0,o.MZ)({attribute:!1})],Ki.prototype,"onChange",void 0),Ri([(0,o.wk)()],Ki.prototype,"_entityBound",void 0),Ki=Ri([(0,o.EM)("mc-ring-editor")],Ki);var Wi=i(2061),Ui=i(3034),Gi=i(5047),Yi=i(7503);function Qi(e,t,i){const{custom_shapes:n,...o}=t;if(i(o),n&&Object.keys(n).length&&e&&!1!==e.attached){const t=e.getConfig();e.updateConfig({...t,custom_shapes:{...t.custom_shapes??{},...n}},!1)}}var Ji=i(5483);const Xi=e=>"card"===e?(0,h.t)(1243):"row"===e?(0,h.t)(1246):"column"===e?(0,h.t)(1244):(0,h.t)(1245);var en=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const tn=[{kind:"none",label:660,options:[]},{kind:"squircle",label:995,options:["corner","smoothing"]},{kind:"pill",label:756,options:[]},{kind:"circle",label:187,options:[]},{kind:"hexagon",label:441,options:["corner"]},{kind:"octagon",label:679,options:["corner"]},{kind:"notch",label:669,options:["corner"]},{kind:"ticket",label:1093,options:["corner"]},{kind:"wave",label:1174,options:["edge","amplitude","waves","animate"]},{kind:"blob",label:138,options:["seed","wobble","animate"]},{kind:"custom",label:255,options:[]}],nn=["squircle","pill","circle","hexagon","octagon","notch"],on=["ticket","wave","blob"],sn=[[845,["squircle","pill","circle"]],[266,["hexagon","octagon","notch","ticket"]],[705,["wave","blob"]],[1205,["custom"]]],an=[{value:"top",label:1109},{value:"right",label:838},{value:"bottom",label:142},{value:"left",label:516},{value:"all",label:62}],rn=["px","%"],ln={squircle:"50",notch:String(Ji.JM.corner),ticket:String(Ji.JM.corner),hexagon:"auto",octagon:"auto"},cn={squircle:244,notch:267,ticket:268,hexagon:970,octagon:970},dn=new Map,hn=.35,un={notch:{corner:Ji.JM.corner*hn},ticket:{corner:Ji.JM.corner*hn},wave:{amplitude:Ji.JM.amplitude*hn}};function pn(e){if("string"==typeof e&&e.trim().endsWith("%"))return e;const t="number"==typeof e?e:parseFloat(String(e));return Number.isFinite(t)?t*hn:void 0}const mn=e=>{const t=1+Math.floor(9999*Math.random());return String(t)===String(e)?t%9999+1:t};let gn=class extends n.WF{constructor(){super(...arguments),this.explicitNone=!1,this.target="module",this.hasRadius=!1,this.hasShadow=!1,this.popup=!1,this.label="",this._source="presets",this._opening="",this._status="",this._onLibraryChanged=e=>{const t=e.detail?.kind;void 0!==t&&"shapes"!==t||this._relist()}}async _relist(){if(!this.hass)return;const e=await(0,g.k4)(this.hass);this.isConnected&&(this._lib=e)}connectedCallback(){super.connectedCallback(),window.addEventListener(Wi.S8,this._onLibraryChanged)}disconnectedCallback(){window.removeEventListener(Wi.S8,this._onLibraryChanged),super.disconnectedCallback()}get _kind(){const e=this.shape;return tn.some(t=>t.kind===e)?e:"none"}get _opts(){return this.options&&"object"==typeof this.options?this.options:{}}_clean(e,t){const i=tn.find(t=>t.kind===e)?.options??[],n={};for(const e of i){const i=t[e];void 0===i||""===i||"number"==typeof i&&Number.isNaN(i)||(n[e]=i)}return Object.keys(n).length?n:void 0}_pick(e){if("custom"===e)return"custom"!==this._kind&&this._open(),void this.requestUpdate();"none"!==e?this.onChange?.({shape:e,shape_options:this._clean(e,this._opts)}):this.onChange?.({shape:this.explicitNone?"none":void 0,shape_options:void 0})}_set(e){const t=this._kind;"none"!==t&&this.onChange?.({shape:t,shape_options:this._clean(t,{...this._opts,...e})})}_picker(e){const t=t=>n.qy`<option value=${t.kind} ?selected=${t.kind===e}>${(0,h.t)(t.label)}</option>`,i="none"===e||"custom"===e?"":function(e,t){const i=`${e}|${JSON.stringify(t)}`;let n=dn.get(i);return void 0===n&&(n=(0,Ji.j9)(e,40,28,function(e,t){const i={...un[e],...t,animate:!1};for(const e of["corner","amplitude"])void 0!==t[e]&&(i[e]=pn(t[e]));return i}(e,t))?.d??"",dn.size>64&&dn.clear(),dn.set(i,n)),n}(e,this._opts);return n.qy`<div class="pick">
      <div class="select">
        <select class="input" id="shape-kind" data-focus-key="shape-entry" aria-label=${(0,h.t)(912)} @change=${e=>this._pick(e.target.value)}>
          ${t(tn[0])}
          ${sn.map(([e,i])=>((e,i)=>n.qy`<optgroup label=${(0,h.t)(e)}>${i.map(e=>t(tn.find(t=>t.kind===e)))}</optgroup>`)(e,i))}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
      <svg class="preview" viewBox="-8 -6 ${56} ${40}" aria-hidden="true">
        ${"none"===e?n.JW`<path class="none-mark" d="M2 2H38V26H2Z"></path>`:"custom"===e?n.JW`<path d="M10 2H38V18L30 26H2V10Z"></path>`:n.JW`<path d=${i}></path>`}
      </svg>
    </div>`}_field(e,t,i,o,s){const a=t?this._opts[t]:void 0,r=void 0!==a&&""!==a;return n.qy`
      <div class="field">
        <div class="field-head">
          ${o?n.qy`<label for=${o}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}
          ${t?(0,Jt.i)(e,r,()=>this._set({[t]:void 0})):n.s6}
        </div>
        ${i}
        ${s?n.qy`<p class="help">${s}</p>`:n.s6}
      </div>
    `}_length(e,t,i){const o=this._opts[e];return n.qy`<mc-unit-field
      .value=${void 0===o?"":o}
      .label=${t}
      .units=${rn}
      .noCustom=${!0}
      .placeholder=${i}
      .inputId=${`shape-${e}`}
      @value-changed=${t=>this._set({[e]:t.detail.value||void 0})}
    ></mc-unit-field>`}_number(e,t,i,o,s=1){const a=this._opts[e];return n.qy`<input
      class="input"
      id=${`shape-${e}`}
      type="number"
      min=${i??n.s6}
      max=${o??n.s6}
      step=${s}
      placeholder=${String(t)}
      .value=${void 0===a?"":String(a)}
      @input=${t=>{const i=t.target.value,n=Number(i);""!==i.trim()&&Number.isFinite(n)&&this._set({[e]:n})}}
      @change=${t=>{const i=t.target;""!==i.value.trim()||i.validity?.badInput||this._set({[e]:void 0})}}
    />`}_animate(e){const t=!0===this._opts.animate;return n.qy`<div class="switch-row">
      <div class="txt">
        <div class="field-head">
          <span class="lbl">${(0,h.t)(79)}</span>
          ${(0,Jt.i)((0,h.t)(79),void 0!==this._opts.animate,()=>this._set({animate:void 0}))}
        </div>
        <p class="help">${"wave"===e?(0,h.t)(1069):(0,h.t)(1048)} ${(0,h.t)(732)}</p>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${t?"true":"false"}
        aria-label=${(0,h.t)(79)}
        @click=${()=>this._set({animate:!t||void 0})}
      ></button>
    </div>`}_edge(){const e=this._opts.edge??"bottom";return n.qy`<div class="seg full" role="radiogroup" aria-label=${(0,h.t)(1175)} @keydown=${t=>{const i=an.findIndex(t=>t.value===e),n={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(t.key in n))return;t.preventDefault();const o=an[(i+n[t.key]+an.length)%an.length].value,s=t.currentTarget;this._set({edge:o}),requestAnimationFrame(()=>s.querySelector(`[data-val="${o}"]`)?.focus())}}>
      ${an.map(t=>{const i=t.value===e;return n.qy`<button
          type="button"
          role="radio"
          data-val=${t.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>this._set({edge:t.value})}
        >${(0,h.t)(t.label)}</button>`})}
    </div>`}_options(e){const t=(0,h.t)(487);switch(e){case"squircle":return n.qy`<div class="two">
          ${this._field((0,h.t)(244),"corner",this._length("corner",(0,h.t)(244),ln.squircle),void 0,t)}
          ${this._field((0,h.t)(976),"smoothing",this._number("smoothing",Ji.JM.smoothing,0,1,.05),"shape-smoothing",(0,h.t)(7))}
        </div>`;case"hexagon":case"octagon":case"notch":case"ticket":return this._field((0,h.t)(cn[e]),"corner",this._length("corner",(0,h.t)(cn[e]),ln[e]),void 0,t);case"wave":return n.qy`
          ${this._field((0,h.t)(330),"edge",this._edge())}
          <div class="two">
            ${this._field((0,h.t)(1176),"amplitude",this._length("amplitude",(0,h.t)(1176),String(Ji.JM.amplitude)),void 0,t)}
            ${this._field((0,h.t)(1177),"waves",this._number("waves",Ji.JM.waves,1,50),"shape-waves")}
          </div>
          ${this._animate(e)}
        `;case"blob":return n.qy`
          <div class="two">
            ${this._field((0,h.t)(891),"seed",n.qy`<div class="seed">
                ${this._number("seed",Ji.JM.seed,0,void 0,1)}
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  title=${(0,h.t)(745)}
                  @click=${()=>this._set({seed:mn(this._opts.seed??Ji.JM.seed)})}
                >
                  <ha-icon icon="mdi:dice-5-outline"></ha-icon>${(0,h.t)(969)}
                </button>
              </div>`,"shape-seed")}
            ${this._field((0,h.t)(1196),"wobble",this._number("wobble",Ji.JM.wobble,0,1,.05),"shape-wobble",(0,h.t)(5))}
          </div>
          ${this._animate(e)}
        `;default:return n.s6}}_copies(){return(0,_i.d)(this)?.getConfig().custom_shapes??{}}async _open(e){if("loading"===this._opening)return;this._opening="loading";const t=this._kind,i=await async function(e){if(!await(0,Yi.RX)())return"failed";const t=(0,_i.d)(e.from),i=await(0,g.Zz)(e.hass);let n=t?.getConfig().custom_shapes;if("ok"===i.state){const e=function(e,t){const i={...e??{}};let n=!1;for(const e of t){const t=i[e.id];void 0!==t&&JSON.stringify(t)!==JSON.stringify(e.shape)&&(i[e.id]=e.shape,n=!0)}return{copies:i,changed:n}}(n,i.items);e.changed&&t&&!1!==t.attached&&t.updateConfig({...t.getConfig(),custom_shapes:e.copies},!1),n=e.changed?e.copies:n}const o=document.createElement(Ui.zh);o.hass=e.hass,o.value=e.value,o.customShapes=n,o.libraryAvailable="ok"===i.state,o.preset=e.preset,o.label=e.label;let s=()=>{};return o.addEventListener("mc-shape-change",i=>{const n=i.detail;n.commit&&Qi(t,{shape:"custom",shape_options:n.value.shape_options,...n.customShapes?{custom_shapes:n.customShapes}:{}},t=>e.apply(t))}),o.addEventListener("mc-shape-close",e=>{var t;s(),e.detail?.done&&(t=(0,h.t)(913),document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:t}})))}),s=(0,Gi.c)(o,{from:e.from,key:"shape-entry"}),"opened"}({from:this,hass:this.hass,label:this.label||Xi(this.target),value:"custom"===t?{shape:"custom",shape_options:this._opts}:void 0,preset:e,apply:e=>{this.onChange?.(e),this._relist()}});this._opening="failed"===i?"failed":""}_write(e){Qi((0,_i.d)(this),e,e=>this.onChange?.(e))}_use(e,t){this._write(t?{shape:"custom",shape_options:{...e.shape}}:{shape:"custom",shape_options:{ref:e.id},custom_shapes:{[e.id]:e.shape}}),this._status=t?(0,h.t)(1158,{name:e.name}):(0,h.t)(1159,{name:e.name})}_detach(){const e=this._opts.ref;if(!e)return;const t=this._lib?.items.find(t=>t.id===e)?.shape??this._copies()[e];t&&(this._write({shape:"custom",shape_options:{...t}}),this._status=(0,h.t)(1076))}async _saveAs(){const e=this._saving;if(!e||e.busy)return;const t=e.name.trim();if(!t)return void(this._saving={...e,error:(0,h.t)(417)});if(t.length>80)return void(this._saving={...e,error:(0,h.t)(1142)});this._saving={...e,busy:!0,error:void 0};const i=new Set((this._lib?.items??[]).map(e=>e.id)),n={...this._opts};delete n.ref;const o=await(0,g.VC)(this.hass,{id:(0,g.wQ)((0,g.yR)(t,"shape"),i),name:t,shape:n});if(o.shape)return this._saving=void 0,this._status=(0,h.t)(869,{name:o.shape.name}),void(this._lib=await(0,g.Zz)(this.hass));const s={readonly:(0,h.t)(1204),full:(0,h.t)(1058),invalid:(0,h.t)(1087),unreachable:(0,h.t)(246)}[o.error??"unreachable"];this._saving={...e,busy:!1,error:s}}_sourceChips(){if("ok"!==this._lib?.state)return n.s6;const e=(e,t)=>n.qy`<button type="button" role="radio" aria-checked=${this._source===e?"true":"false"} @click=${()=>this._source=e}>${t}</button>`;return n.qy`<div class="seg full" role="radiogroup" aria-label=${(0,h.t)(914)}>${e("presets",(0,h.t)(773))}${e("mine",(0,h.t)(617,{n:this._lib.items.length}))}</div>`}_mine(){const e=this._lib?.items??[];return e.length?n.qy`<ul class="mine" aria-label=${(0,h.t)(616)}>
      ${e.map(e=>n.qy`<li>
          <span class="nm">${e.name}</span>
          <button type="button" class="btn btn-secondary btn-sm" aria-label=${(0,h.t)(1155,{name:e.name})} @click=${()=>this._use(e,!1)}>${(0,h.t)(1133)}</button>
          <button type="button" class="btn btn-text btn-sm" aria-label=${(0,h.t)(1138,{name:e.name})} @click=${()=>this._use(e,!0)}>${(0,h.t)(1141)}</button>
        </li>`)}
    </ul>
    <p class="help">${(0,h.t)(1149)}</p>`:n.qy`<div class="mine-empty"><p class="help">${(0,h.t)(653)}</p>
        <button type="button" class="btn btn-secondary btn-sm" data-focus-key="shape-entry" @click=${()=>{this._open()}}>${(0,h.t)(558)}</button></div>`}_openButton(e,t){const i="loading"===this._opening;return n.qy`<button type="button" class="btn btn-secondary btn-sm" data-focus-key="shape-entry" aria-busy=${i?"true":"false"} @click=${t}>
      ${e}${i?n.qy`<span class="sr-only"> ${(0,h.t)(537)}</span>`:n.s6}
    </button>`}_actions(e){if("none"===e)return n.s6;const t=[];if("custom"===e){const e=this._opts.ref;if(t.push(this._openButton((0,h.t)(335),()=>{this._open()})),e)t.push(n.qy`<button type="button" class="btn btn-text btn-sm" @click=${()=>this._detach()}>${(0,h.t)(1141)}</button>`);else if(this._lib){const e="ok"!==this._lib.state;t.push(n.qy`<button type="button" class="btn btn-text btn-sm" aria-disabled=${e?"true":"false"} aria-describedby=${e?"shape-lib-hint":n.s6}
            @click=${()=>e?void 0:this._saving={name:(0,h.t)(262)}}>${(0,h.t)(866)}</button>`)}}else nn.includes(e)&&t.push(this._openButton((0,h.t)(332),()=>{this._open({shape:e,shape_options:this._opts})}));const i=[];if(on.includes(e)&&i.push(n.qy`<p class="help">${(0,h.t)(1094)}</p>`),"custom"===e&&this._opts.ref){const e=this._lib?.items.find(e=>e.id===this._opts.ref)?.name??this._opts.ref;i.push(n.qy`<p class="help">${(0,h.t)(528,{name:e})}</p>`)}return"custom"===e&&!this._opts.ref&&this._lib&&"ok"!==this._lib.state&&i.push(n.qy`<p class="help" id="shape-lib-hint">${(0,h.t)(502)}</p>`),"failed"===this._opening&&i.push(n.qy`<p class="help error" role="alert">${(0,h.t)(1063)}</p>`),n.qy`<div class="shape-actions">${t}</div>${i}${this._saveForm()}`}_saveForm(){const e=this._saving;return e?n.qy`<form class="save-form" @submit=${e=>{e.preventDefault(),this._saveAs()}}>
      <label for="shape-save-name">${(0,h.t)(618)}</label>
      <input class="input" id="shape-save-name" .value=${e.name} maxlength="80" aria-invalid=${e.error?"true":"false"} aria-describedby=${e.error?"shape-save-err":n.s6}
        @input=${t=>this._saving={...e,name:t.target.value,error:void 0}}
        @keydown=${e=>{"Escape"===e.key&&(e.stopPropagation(),this._saving=void 0)}} />
      ${e.error?n.qy`<p class="help error" id="shape-save-err" role="alert">${e.error}</p>`:n.s6}
      <div class="shape-actions">
        <button type="submit" class="btn btn-primary btn-sm" ?disabled=${e.busy}>${(0,h.t)(865)}</button>
        <button type="button" class="btn btn-text btn-sm" @click=${()=>this._saving=void 0}>${(0,h.t)(162)}</button>
      </div>
    </form>`:n.s6}willUpdate(){this.hass&&this._listed!==this.hass&&(this._listed=this.hass,(0,g.Zz)(this.hass).then(e=>this._lib=e))}_hints(e){if("none"===e)return n.s6;const t=[];return this.hasRadius&&t.push((0,h.t)(1064)),this.hasShadow&&t.push((0,h.t)(146)),"module"===this.target&&t.push((0,h.t)(1062)),"card"===this.target&&this.popup&&t.push((0,h.t)(74)),t.length?n.qy`<div class="hints">${t.map(e=>n.qy`<p class="help">${e}</p>`)}</div>`:n.s6}updated(){const e=this.renderRoot.querySelector("select#shape-kind");e&&e.value!==this._kind&&(e.value=this._kind)}render(){const e=this._kind;return n.qy`
      <div class="shape-ed">
        ${this._sourceChips()}
        ${"mine"===this._source&&"ok"===this._lib?.state?this._mine():n.qy`${this._picker(e)}${this._actions(e)}${this._hints(e)}${this._options(e)}`}
        <div class="shape-actions"><button type="button" class="btn btn-text btn-sm" @click=${e=>{(0,yi.uK)(e.currentTarget,this.hass,"shape")}}>${(0,h.t)(518)}</button></div>
        <p class="sr-only" role="status">${this._status}</p>
      </div>
    `}};gn.styles=[l.x,n.AH`
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
    `],en([(0,o.MZ)({attribute:!1})],gn.prototype,"shape",void 0),en([(0,o.MZ)({attribute:!1})],gn.prototype,"options",void 0),en([(0,o.MZ)({type:Boolean})],gn.prototype,"explicitNone",void 0),en([(0,o.MZ)({type:String})],gn.prototype,"target",void 0),en([(0,o.MZ)({type:Boolean})],gn.prototype,"hasRadius",void 0),en([(0,o.MZ)({type:Boolean})],gn.prototype,"hasShadow",void 0),en([(0,o.MZ)({type:Boolean})],gn.prototype,"popup",void 0),en([(0,o.MZ)({attribute:!1})],gn.prototype,"onChange",void 0),en([(0,o.MZ)({attribute:!1})],gn.prototype,"hass",void 0),en([(0,o.MZ)({type:String})],gn.prototype,"label",void 0),en([(0,o.wk)()],gn.prototype,"_lib",void 0),en([(0,o.wk)()],gn.prototype,"_source",void 0),en([(0,o.wk)()],gn.prototype,"_opening",void 0),en([(0,o.wk)()],gn.prototype,"_saving",void 0),en([(0,o.wk)()],gn.prototype,"_status",void 0),gn=en([(0,o.EM)("mc-shape-editor")],gn);var fn=i(7068),vn=i(1174),bn=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const yn=[{value:"off",label:680},{value:"fill",label:380},{value:"sparkline",label:990}],_n=[{value:"up",label:1126},{value:"down",label:315},{value:"left",label:516},{value:"right",label:838}],wn={fill:["direction","wave"],sparkline:["hours","line_width","area","smoothing"]};let $n=class extends n.WF{constructor(){super(...arguments),this.defaultEntity="",this.explicitNone=!1}get _v(){return this.value&&"object"==typeof this.value?this.value:{}}get _type(){const e=this._v.type;return"fill"===e||"sparkline"===e?e:"off"}_set(e){const t={...this._v,...e};for(const[e,i]of Object.entries(t))(void 0===i||""===i||"number"==typeof i&&Number.isNaN(i))&&delete t[e];this.onChange?.(t)}_pickType(e){if("off"===e){if(this.explicitNone&&"none"===this._v.type)return;return void this.onChange?.(this.explicitNone?{type:"none"}:void 0)}if(e===this._type)return;const t={...this._v,type:e},i="fill"===e?"sparkline":"fill";for(const e of wn[i])delete t[e];for(const[e,i]of Object.entries(t))void 0!==i&&""!==i||delete t[e];this.onChange?.(t)}_field(e,t,i,o,s){const a=t?this._v[t]:void 0,r=void 0!==a&&""!==a;return n.qy`
      <div class="field">
        <div class="field-head">
          ${o?n.qy`<label for=${o}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}
          ${t?(0,Jt.i)(e,r,()=>this._set({[t]:void 0})):n.s6}
        </div>
        ${i}
        ${s?n.qy`<p class="help">${s}</p>`:n.s6}
      </div>
    `}_seg(e,t,i,o){return n.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=i.findIndex(e=>e.value===t),s={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in s))return;e.preventDefault();const a=i[(n+s[e.key]+i.length)%i.length].value,r=e.currentTarget;o(a),requestAnimationFrame(()=>r.querySelector(`[data-val="${a}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return n.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>o(e.value)}
        >${(0,h.t)(e.label)}</button>`})}
    </div>`}_number(e,t,i,o,s,a="any"){const r=this._v[t];return n.qy`<input
      class="input"
      id=${e}
      type="number"
      min=${o??n.s6}
      max=${s??n.s6}
      step=${a}
      placeholder=${String(i)}
      .value=${void 0===r?"":String(r)}
      @input=${e=>{const i=e.target.value,n=Number(i);""!==i.trim()&&Number.isFinite(n)&&this._set({[t]:n})}}
      @change=${e=>{const i=e.target;""!==i.value.trim()||i.validity?.badInput||this._set({[t]:void 0})}}
    />`}_switch(e,t,i){const o=!1!==this._v[t];return n.qy`<div class="switch-row">
      <div class="txt">
        <div class="field-head">
          <span class="lbl">${e}</span>
          ${(0,Jt.i)(e,void 0!==this._v[t],()=>this._set({[t]:void 0}))}
        </div>
        <p class="help">${i}</p>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${o?"true":"false"}
        aria-label=${e}
        @click=${()=>this._set({[t]:!o&&void 0})}
      ></button>
    </div>`}_entityFields(e){const t=this._v,i=e?this.hass?.states?.[e]:void 0;return n.qy`
      ${this._field((0,h.t)(357),"entity",n.qy`<mc-entity-picker
          .hass=${this.hass}
          .value=${t.entity||""}
          .label=${this.defaultEntity?(0,h.t)(594,{entity:this.defaultEntity}):(0,h.t)(357)}
          @value-changed=${e=>this._set({entity:e.detail.value})}
        ></mc-entity-picker>`)}
      ${e?n.s6:n.qy`<p class="help no-entity">${(0,h.t)(740)}</p>`}
      ${!t.entity&&this.defaultEntity?n.qy`<p class="help">${(0,h.t)(348,{entity:this.defaultEntity})}</p>`:n.s6}
      ${i&&Object.keys(i.attributes||{}).length?this._field((0,h.t)(105),"attribute",n.qy`<mc-attribute-picker
              .hass=${this.hass}
              .entityId=${e}
              .value=${t.attribute||""}
              @value-changed=${e=>this._set({attribute:e.detail.value})}
            ></mc-attribute-picker>`):n.s6}
    `}_look(e,t){const i=this._v,o="fill"===e,s=t?this.hass?.states?.[t]:void 0;return n.qy`
      ${this._field((0,h.t)(205),"color",n.qy`<mc-color-picker
          .value=${i.color||""}
          .label=${o?(0,h.t)(382):(0,h.t)(522)}
          .allowEntity=${!!t}
          .entityColor=${(0,oi.id)(s)??"currentColor"}
          .gradient=${o?"css":""}
          @value-changed=${e=>this._set({color:e.detail.value})}
        ></mc-color-picker>`)}
      ${this._field(o?(0,h.t)(384):(0,h.t)(100),"opacity",n.qy`<mc-unit-field
          .value=${function(e){if(void 0===e||""===e)return"";const t=(0,vn.uM)(e);return void 0===t?"":Math.round(1e3*t)/10+"%"}(i.opacity)}
          .label=${o?(0,h.t)(384):(0,h.t)(100)}
          .units=${["%"]}
          .noCustom=${!0}
          .placeholder=${String(Math.round(100*(o?fn.B.opacity:fn.B.areaOpacity)))}
          .inputId=${"vb-opacity"}
          @value-changed=${e=>this._set({opacity:e.detail.value||void 0})}
        ></mc-unit-field>`,void 0,o?void 0:(0,h.t)(1045,{pct:Math.round(100*fn.B.lineOpacity)}))}
    `}_range(e){return n.qy`<div class="two">
      ${this._field((0,h.t)(586),"min",this._number("vb-min","min",e?0:(0,h.t)(108)),"vb-min")}
      ${this._field((0,h.t)(575),"max",this._number("vb-max","max",e?100:(0,h.t)(108)),"vb-max")}
    </div>`}_fill(){const e=this._v;return n.qy`
      ${this._field((0,h.t)(305),"direction",this._seg((0,h.t)(383),e.direction??"up",_n,e=>this._set({direction:e})))}
      ${this._switch((0,h.t)(1174),"wave",(0,h.t)(71))}
    `}_sparkline(){return n.qy`
      <div class="two">
        ${this._field((0,h.t)(458),"hours",this._number("vb-hours","hours",fn.B.hours,1,fn.B.maxHours,1),"vb-hours",(0,h.t)(1127))}
        ${this._field((0,h.t)(525),"line_width",this._number("vb-line","line_width",fn.B.lineWidth,.5,20,.5),"vb-line")}
      </div>
      ${this._switch((0,h.t)(99),"area",(0,h.t)(385))}
      ${this._switch((0,h.t)(976),"smoothing",(0,h.t)(13))}
      <p class="help">${(0,h.t)(450)}</p>
    `}render(){const e=this._type,t=this._v.entity||this.defaultEntity;return n.qy`
      <div class="vb-ed">
        ${this._field((0,h.t)(1117),void 0,this._seg((0,h.t)(1164),e,yn,e=>this._pickType(e)))}
        ${"off"===e?n.s6:n.qy`
              ${this._entityFields(t)}
              ${this._range("fill"===e)}
              ${this._look(e,t)}
              ${"fill"===e?this._fill():this._sparkline()}
            `}
      </div>
    `}};$n.styles=[l.x,n.AH`
      :host {
        display: block;
        min-width: 0;
      }
      .vb-ed {
        display: grid;
        gap: 16px;
      }
    `],bn([(0,o.MZ)({attribute:!1})],$n.prototype,"value",void 0),bn([(0,o.MZ)({attribute:!1})],$n.prototype,"hass",void 0),bn([(0,o.MZ)({type:String})],$n.prototype,"defaultEntity",void 0),bn([(0,o.MZ)({type:Boolean})],$n.prototype,"explicitNone",void 0),bn([(0,o.MZ)({attribute:!1})],$n.prototype,"onChange",void 0),$n=bn([(0,o.EM)("mc-value-bg-editor")],$n);var xn=i(9748);let kn="default";const Cn=new Set;function Mn(e){if(e!==kn){kn=e;for(const t of[...Cn])t(e)}}const Sn="data-mc-force";function An(e,t){const i=[...e.querySelector(".mc-tabs > .mc-tabs-header")?.querySelectorAll(":scope > .mc-tab-button")??[]];for(const e of i)e.removeAttribute(Sn);if(!t)return null;const n=i.find(e=>!e.classList.contains("active")&&"true"!==e.getAttribute("aria-disabled")),o="disabled"===t&&i.some(e=>"true"===e.getAttribute("aria-disabled")&&!e.classList.contains("active"));return"active"===t||o||n?.setAttribute(Sn,t),t}var qn=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const En=["text","info","markdown"],jn="__hover__",Tn="__tab_active__",zn="__tab_disabled__",Ln=["tab_active","tab_disabled"],On=["tab_active_color","tab_active_background","tab_indicator_color"],Rn=e=>e.keys??(0,Yt.I7)(e.key),Pn=e=>!!e&&"object"==typeof e&&!Array.isArray(e),Hn=e=>"string"==typeof e&&""!==e,In=e=>void 0===e?void 0:(0,Qt.t)(e),Vn=new Set(["animations","icon_anim","ring","shape","value_bg"]),Dn={box_shadow:"0 2px 8px rgba(0, 0, 0, .12)",text_shadow:"0 1px 2px rgba(0, 0, 0, .3)",transition:"all 0.2s ease-out",transform:"scale(1.02)"};let Fn=class extends n.WF{constructor(){super(...arguments),this._direction=new Ge.K(this),this.design={},this.hasTemplate=!1,this.notSynced=[],this.moduleEntity="",this.target="module",this.moduleType="",this.moduleVariant="",this.hoverOnly=!1,this.tabs={labels:[]},this._openSectors=new Set,this._subOpen=new Map,this._subOpenedForValue=new Set,this._groupOpen=new Map,this._openedForValue=new Set,this._searchQuery="",this._activeView="default",this._pasteMenu=!1,this._pastePop=new Xe(this,{menu:()=>this.shadowRoot?.querySelector(".design-clip .menu"),onClose:()=>{this._pasteMenu=!1},align:"start"}),this._clipStatus=""}get _allowEntityColor(){return"module"===this.target&&!!this.moduleEntity}get _entityColor(){return this._allowEntityColor?(0,oi.id)(this.hass?.states?.[this.moduleEntity])??"currentColor":""}willUpdate(){this.hoverOnly?this._activeView=jn:"tabs"!==this.moduleType&&this._viewParts().state&&(this._activeView="default")}updated(e){(e.has("_activeView")||e.has("moduleType"))&&Mn("tabs"!==this.moduleType||this.hoverOnly?"default":this._activeView),e.has("_activeView")&&!this.hoverOnly&&this.dispatchEvent(new CustomEvent("mc-design-view",{bubbles:!0,composed:!0,detail:{view:this._activeView}}))}_viewParts(){const e=this._activeView;if(e===Tn)return{id:"default",state:"tab_active"};if(e===zn)return{id:"default",state:"tab_disabled"};const t=e.lastIndexOf("::"),i=t>0?Ln.find(i=>i===e.slice(t+2)):void 0;return i?{id:e.slice(0,t),state:i}:{id:e}}_getActiveRule(){const{id:e}=this._viewParts();if("default"!==e)return this.design.conditional?.find(t=>t.id===e)}_isHoverView(){return this._activeView===jn}_sub(){const e=this._getActiveRule(),{state:t}=this._viewParts();return t&&(e||"default"===this._viewParts().id)?this._stateSub(t,e):e?{design:e.design,write:t=>this._updateRule(e.id,{design:t})}:this._isHoverView()?{design:this.design.hover||{},write:e=>{const t={...e};for(const e of Object.keys(t))void 0!==t[e]&&""!==t[e]||delete t[e];const i={hover:Object.keys(t).length?t:void 0};this.hasTemplate&&(i._markNotSynced="hover"),this.onChange(i)}}:void 0}_stateSub(e,t){const i=(t?t.design:this.design)??{},n=Pn(i[e])?i[e]:{},o="tab_active"===e?On.filter(e=>void 0!==i[e]):[],s={};o.length&&(Hn(i.tab_active_color)&&(s.tab_color=i.tab_active_color),Hn(i.tab_active_background)&&(s.tab_background=i.tab_active_background)),Object.assign(s,n);const a=o.length?i.tab_indicator_color:void 0;return Hn(a)&&("pills"===this.tabs?.style?s.tab_background??=a:s.tab_border_color??=a),{design:s,write:i=>{const n={...i};for(const e of Object.keys(n))void 0!==n[e]&&""!==n[e]||delete n[e];const s=Object.keys(n).length?n:void 0;if(t){const i={...t.design};for(const e of o)delete i[e];return s?i[e]=s:delete i[e],void this._updateRule(t.id,{design:i})}const a={[e]:s};for(const e of o)a[e]=void 0;this.hasTemplate&&(a._markNotSynced=[e,...o]),this.onChange(a)}}}_getActiveDesign(){return this._sub()?.design??this.design}_stateCount(e,t){return Object.values(this._stateSub(e,t).design).filter(e=>void 0!==e&&""!==e).length}_withCount(e,t){return t>0?(0,h.t)(1284,{name:e,n:t}):e}_viewName(){const{id:e,state:t}=this._viewParts(),i=this._getActiveRule();if(i){const n=i.name||(0,h.t)(855,{n:(this.design.conditional??[]).findIndex(t=>t.id===e)+1});return"tab_active"===t?(0,h.t)(857,{name:n}):"tab_disabled"===t?(0,h.t)(858,{name:n}):(0,h.t)(856,{name:n})}return"tab_active"===t?(0,h.t)(26):"tab_disabled"===t?(0,h.t)(306):this._isHoverView()?(0,h.t)(460):(0,h.t)(276)}_inherited(e){if(!this._viewParts().state&&!this._isHoverView())return;const t=this._getActiveRule(),i=t=>{const i=Pn(t)?t[e]:void 0;return"number"==typeof i?String(i):"string"==typeof i?i:""};return i(t?.design)||i(this.design)}_builtin(e){const t=this._viewParts().state,i="pills"===this.tabs?.style;if("tab_active"===t){if("tab_color"===e)return i?(0,h.t)(1234):(0,h.t)(1242);if("tab_background"===e)return i?(0,h.t)(1242):(0,h.t)(1235)}if("tab_disabled"===t&&"tab_opacity"===e)return"0.5"}_resetState(){const e=this._viewParts().state,t=this._sub();e&&t&&(t.write({}),this._announce((0,h.t)(1307,{state:"tab_active"===e?(0,h.t)(26):(0,h.t)(306)})))}_getValue(e){const t=this._getActiveDesign();if("background_color"===e&&!t.background_color&&(0,xn.wb)(t.background))return t.background;const i=t[e];return"number"==typeof i?String(i):i||""}_fieldValue(e,t){if("tab_opacity"!==e)return t||void 0;const i=Number(t);return""===t.trim()||Number.isNaN(i)?void 0:Math.min(1,Math.max(0,i))}_bgGradientBlock(){const e=this._getActiveDesign(),t=this.design,i=!!this._sub();if((0,xn.wb)(this._getValue("background_color")))return"";const n=e.background??(i?t.background:void 0);return n&&!(0,xn.wb)(n)?(0,h.t)(430):e.background_image||i&&t.background_image?(0,h.t)(12):i&&t.background_color?(0,h.t)(277):""}_handleBackgroundColor(e){const t=this._getActiveDesign(),i=(0,xn.wb)(e)?{background:e,background_color:void 0}:{background_color:e||void 0,...(0,xn.wb)(t.background)?{background:void 0}:{}},n=this._sub();n?n.write({...n.design,...i}):(this.hasTemplate&&(i._markNotSynced=["background_color","background"]),this.onChange(i))}_isSet(e){const t=this._getActiveDesign();return"animations"===e.type?(0,D.Sd)(t).length>0:!("background_color"!==e.key||!this._getValue(e.key))||Rn(e).some(e=>{return!(void 0===(i=t[e])||""===i||i&&"object"==typeof i&&!Array.isArray(i)&&!Object.keys(i).length);var i})}_keysOf(e){return"background_color"===e.key&&this._getValue(e.key)!==(this._getActiveDesign().background_color||"")?["background_color","background"]:"animations"===e.type?Object.keys((0,D.Tk)([])):Rn(e)}_reset(e){const t=e.flatMap(e=>this._keysOf(e)),i=this._sub();if(i){const e={...i.design};for(const i of t)delete e[i];return void i.write(e)}const n=Object.fromEntries(t.map(e=>[e,void 0]));this.hasTemplate&&(n._markNotSynced=1===e.length?e[0].key:e.map(e=>e.key)),this.onChange(n)}_handlePropertyChange(e,t){const i=this._sub();if(i)return void i.write({...i.design,[e]:this._fieldValue(e,t)});const n={[e]:this._fieldValue(e,t)};this.hasTemplate&&(n._markNotSynced=e),this.onChange(n)}_handleAnimationsChange(e){const t=(0,D.Tk)(e),i=this._sub();if(i){const e={...i.design,...t};for(const i of Object.keys(t))void 0===e[i]&&delete e[i];return void i.write(e)}this.hasTemplate&&(t._markNotSynced="animations"),this.onChange(t)}_handleObjectChange(e,t){const i=this._sub();if(i){const n={...i.design};return void 0===t?delete n[e]:n[e]=t,void i.write(n)}const n={[e]:t};this.hasTemplate&&(n._markNotSynced=e),this.onChange(n)}_handleKeysChange(e,t){const i=this._sub();if(i){const t={...i.design};for(const[i,n]of Object.entries(e))void 0===n?delete t[i]:t[i]=n;return void i.write(t)}const n={...e};this.hasTemplate&&(n._markNotSynced=t),this.onChange(n)}_hasRadius(){const e={...this.design,...this._getActiveDesign()};return(0,Yt.I7)("border_radius").some(t=>void 0!==e[t]&&""!==e[t])}_handleSyncToggle(e,t){t?this.onChange({_markNotSynced:"background_color"===e?["background_color","background"]:e}):this.onChange({_markSynced:"background_color"===e?["background_color","background"]:e})}_toggleSector(e){const t=new Set(this._openSectors);t.has(e)?t.delete(e):t.add(e),this._openSectors=t}_isGroupOpen(e,t){return t>0&&this._openedForValue.add(e.id),this._groupOpen.get(e.id)??(e.defaultOpen||this._openedForValue.has(e.id))}_toggleGroup(e,t){this._groupOpen=new Map(this._groupOpen).set(e.id,!t)}_customCssMatches(){const e=(0,h.A)(this._searchQuery);return!e||(0,h.A)((0,h.t)(256)).includes(e)||"css"===e}_countSetProperties(e){const t=this._getActiveDesign();return e.properties.filter(e=>!e.part&&("animations"===e.type?(0,D.Sd)(t).length>0:Rn(e).some(e=>void 0!==t[e]&&""!==t[e]))).length}_isVisible(e){const t={...this.design,...this._getActiveDesign()};return!(e.hideForVariant?.includes(this.moduleVariant)||Pe[e.key]&&!t[Pe[e.key]])}_filterProperties(e){const t=this._isHoverView(),i="default"===this._activeView,n=this._viewParts().state,o=e.filter(e=>!e.part&&this._isVisible(e)&&!(e.baseOnly&&!i)&&!(n&&!e.tabState)&&!(t&&(e.virtual&&!e.hover||Vn.has(e.type))));if(!this._searchQuery)return o;const s=(0,h.A)(this._searchQuery);return o.filter(e=>(0,h.A)((0,Qt.t)(e.label)).includes(s)||e.cssProperty.toLowerCase().includes(s)||e.key.toLowerCase().includes(s)||(e.keys??[]).some(e=>e.includes(s))||e.key.replace(/_/g," ").includes(s)||(Yt.Xr[e.key]||[]).some(e=>e.cssProperty.includes(s)||e.key.includes(s)))}_announce(e){this._clipStatus=e,window.clearTimeout(this._clipTimer),this._clipTimer=window.setTimeout(()=>this._clipStatus="",2500)}_copyDesign(){Z(this.design),this._announce((0,h.t)(300))}_pasteDesign(e){this._closePasteMenu(!0);const t=B();if(!t)return;const i=K(this.design,t,e),n=function(e,t){const i={};for(const n of Object.keys(e||{}))n in t||(i[n]=void 0);return Object.assign(i,t)}(this.design,i),o=this.design,s=Object.keys(n).filter(e=>JSON.stringify(o[e])!==JSON.stringify(n[e]));this.hasTemplate&&s.length&&(n._markNotSynced=s),this._activeView="default",this.onChange(n),this._announce((0,h.t)(301))}_openPasteMenu(e){this._pasteMenu=!0,this._pastePop.open(e)}_closePasteMenu(e){this._pastePop.close(e)}disconnectedCallback(){super.disconnectedCallback(),Mn("default"),window.clearTimeout(this._clipTimer)}_renderClipboard(){const e=!!B();return n.qy`
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
          title=${e?(0,h.t)(728):(0,h.t)(234)}
          @click=${e=>this._openPasteMenu(e.currentTarget)}
        >
          <ha-icon icon="mdi:content-paste"></ha-icon>${(0,h.t)(725)}
        </button>
        <span class="clip-status" role="status" aria-live="polite">${this._clipStatus}</span>
        ${this._pasteMenu?n.qy`<div class="menu" role="menu" aria-label=${(0,h.t)(725)} @keydown=${this._pastePop.onKeydown}>
              <button type="button" role="menuitem" @click=${()=>this._pasteDesign("replace")}>
                <ha-icon icon="mdi:content-paste"></ha-icon>${(0,h.t)(808)}
              </button>
              <button type="button" role="menuitem" @click=${()=>this._pasteDesign("merge")}>
                <ha-icon icon="mdi:set-merge"></ha-icon>${(0,h.t)(584)}
              </button>
            </div>`:n.s6}
      </div>
    `}_addRule(){const e=[...this.design.conditional||[]],t={id:(0,w.$)("rule"),name:(0,h.t)(855,{n:(this.design.conditional?.length??0)+1}),conditions:[],mode:"every",design:{}};e.push(t),this.onChange({conditional:e}),this._activeView=t.id}_removeRule(e){const t=(this.design.conditional||[]).filter(t=>t.id!==e);this.onChange({conditional:t.length?t:void 0}),this._activeView="default"}_updateRule(e,t){const i=(this.design.conditional||[]).map(i=>i.id===e?{...i,...t}:i);this.onChange({conditional:i})}_updateRuleName(e,t){this._updateRule(e,{name:t})}_updateRuleMode(e,t){this._updateRule(e,{mode:t})}_updateRuleConditions(e,t){this._updateRule(e,{conditions:t})}_addConditionToRule(e){const t=[...e.conditions,{id:(0,w.$)("cond"),type:"state"}];this._updateRuleConditions(e.id,t)}_updateCondition(e,t,i){const n=e.conditions.map((e,n)=>n===t?{...e,...i}:e);this._updateRuleConditions(e.id,n)}_removeCondition(e,t){const i=e.conditions.filter((e,i)=>i!==t);this._updateRuleConditions(e.id,i)}_renderField(e,t,i=n.s6,o,s,a=n.s6){return n.qy`
      <div class="field">
        <div class="field-head">
          ${o?n.qy`<label for=${o}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}
          ${a}${i}
        </div>
        ${t}
        ${s?n.qy`<p class="help">${s}</p>`:n.s6}
      </div>
    `}_renderProperty(e){const t=this._getValue(e.key),i="default"!==this._activeView,o=`design.${e.key}`,s=this.hasTemplate&&!this.notSynced.includes(o),a=`dp-${e.key}`,r=this.hasTemplate&&!i?n.qy`
          <mc-sync-indicator
            .synced=${s}
            .hasTemplate=${this.hasTemplate}
            @sync-toggle=${()=>this._handleSyncToggle(e.key,s)}
          ></mc-sync-indicator>
        `:n.s6,l=e.tabState&&!t?this._builtin(e.key):void 0,c=e.tabState&&!t&&void 0===l?this._inherited(e.key):void 0,d=e.tabState&&void 0!==this._inherited(e.key)&&!this._builtin(e.key),u="animations"===e.type||"ring"===e.type||"value_bg"===e.type?n.s6:(0,Jt.i)((0,Qt.t)(e.label),this._isSet(e),()=>this._reset([e]),d?(0,h.t)(1134):void 0),p=(t,i=n.s6,o,s)=>this._renderField((0,Qt.t)(e.label),t,i,o,s,u),m=e=>e??(l?(0,h.t)(155,{value:l}):c?(0,h.t)(492,{value:c}):void 0);switch(e.type){case"animations":{const e="module"===this.target;return p(n.qy`
            <mc-animation-list
              .animations=${(0,D.Sd)(this._getActiveDesign())}
              .allowIcon=${e&&D.J2.includes(this.moduleType)}
              .allowLabel=${e&&"button"===this.moduleType}
              .spinIcon=${e&&"icon"===this.moduleType}
              .hass=${this.hass}
              .defaultEntity=${e?this.moduleEntity:""}
              .requireTriggerEntity=${!e}
              .allowEntityColor=${this._allowEntityColor}
              .entityColor=${this._entityColor}
              .onChange=${e=>this._handleAnimationsChange(e)}
            ></mc-animation-list>
          `,r)}case"tab_animations":{const t=this._getActiveDesign()[e.key],i=Array.isArray(t)?t.filter(Pn):[];return p(n.qy`
            <mc-animation-list
              .animations=${i}
              .allowIcon=${!0}
              .allowLabel=${!0}
              .motionOnly=${!0}
              .moduleLabel=${(0,h.t)(1025)}
              .hass=${this.hass}
              .defaultEntity=${this.moduleEntity}
              .allowEntityColor=${this._allowEntityColor}
              .entityColor=${this._entityColor}
              .onChange=${t=>this._handleObjectChange(e.key,t.length?t:void 0)}
            ></mc-animation-list>
          `,r,void 0,In(e.help))}case"icon_anim":return p(this._renderIconAnim(e.key),r,void 0,In(e.help));case"sides":return p(n.qy`${(0,Gt.D)(this._activeView,n.qy`
            <mc-box-field
              .shorthand=${!0}
              .baseName=${e.key}
              .value=${t}
              .label=${(0,Qt.t)(e.label)}
              .cell=${e.sides?.cell??"length"}
              .corners=${!!e.sides?.corners}
              .entity=${"border_color"===e.key&&this._allowEntityColor&&"tabs"!==this.moduleType}
              .entityColor=${this._entityColor}
              .units=${e.units??["px","em","rem","%"]}
              .options=${(e.options??[]).map(e=>({value:e.value,label:(0,Qt.t)(e.label)}))}
              .inherited=${e.tabState&&!this._builtin(e.key)&&this._inherited(e.key)||("border_width"===e.key&&this._getActiveDesign().border_length?"2px":"")}
              .onChange=${t=>this._handlePropertyChange(e.key,String(t[e.key]??""))}
            ></mc-box-field>
          `)}`,r,void 0,"color"===e.sides?.cell?m(In(e.help)):In(e.help));case"ring":{const e="module"===this.target;return p(n.qy`<mc-ring-editor
            .ring=${this._getActiveDesign().ring}
            .hass=${this.hass}
            .defaultEntity=${e?this.moduleEntity:""}
            .requireEntity=${!e}
            .allowEntityColor=${this._allowEntityColor}
            .entityColor=${this._entityColor}
            .onChange=${e=>this._handleObjectChange("ring",e)}
          ></mc-ring-editor>`,r)}case"shape":{const e=this._getActiveDesign(),t={...this.design,...e},o=!i&&this.hasTemplate||i&&!!this.design.shape&&"none"!==this.design.shape;return p(n.qy`<mc-shape-editor
            .shape=${e.shape}
            .options=${e.shape_options}
            .explicitNone=${o}
            .target=${this.target}
            .hasRadius=${this._hasRadius()}
            .hasShadow=${!!t.box_shadow}
            .hass=${this.hass}
            .onChange=${e=>this._handleKeysChange({...e},"shape")}
          ></mc-shape-editor>`,r)}case"value_bg":{const e="module"===this.target,t=this.design.value_background,o=!i&&this.hasTemplate||i&&!!t?.type&&"none"!==t.type;return p(n.qy`<mc-value-bg-editor
            .value=${this._getActiveDesign().value_background}
            .hass=${this.hass}
            .explicitNone=${o}
            .defaultEntity=${e?this.moduleEntity:""}
            .onChange=${e=>this._handleObjectChange("value_background",e)}
          ></mc-value-bg-editor>`,r)}case"box":if(i){const t=this._sub();return p(n.qy`
              <mc-box-field
                .design=${t.design}
                .label=${(0,Qt.t)(e.label)}
                .onChange=${e=>t.write({...t.design,...e})}
                .baseName=${e.keys?"":e.key}
              ></mc-box-field>
            `)}return p(n.qy`
            <mc-box-field
              .design=${this.design}
              .label=${(0,Qt.t)(e.label)}
              .onChange=${t=>this.onChange(this.hasTemplate?{...t,_markNotSynced:e.key}:t)}
              .baseName=${e.keys?"":e.key}
            ></mc-box-field>
          `,r);case"unit":return p(n.qy`
            <mc-unit-field
              .value=${t}
              .label=${(0,Qt.t)(e.label)}
              .units=${e.units}
              data-key=${e.key}
              .placeholder=${c?.match(/^-?\d*\.?\d+/)?.[0]??(g=e.key,f={...this.design,...this._getActiveDesign()},/^(min_|max_)?(width|height)$/.test(g)||"flex_basis"===g?"auto":"font_size"===g?"inherit":"border_length"===g?"100":"border_width"===g&&f.border_length?"2px".replace("px",""):"0")}
              @value-changed=${t=>this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-unit-field>
          `,r,void 0,In(e.help));case"color":{const i="background_color"===e.key?this._bgGradientBlock():"";return p(n.qy`
            <mc-color-picker
              data-key=${e.key}
              .value=${t}
              .label=${(0,Qt.t)(e.label)}
              .allowEntity=${this._allowEntityColor&&!e.baseOnly&&!e.key.startsWith("tab_")}
              .entityColor=${this._entityColor}
              .gradient=${"background_color"===e.key&&!i||"color"===e.key&&"module"===this.target&&En.includes(this.moduleType)?"css":""}
              .gradientNote=${"color"===e.key?(0,h.t)(1040):""}
              @value-changed=${t=>"background_color"===e.key?this._handleBackgroundColor(t.detail.value):this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-color-picker>
          `,r,void 0,m(i||void 0))}case"image":return p(n.qy`
            <mc-media-picker
              .hass=${this.hass}
              .value=${t}
              .mediaType=${"image"}
              @value-changed=${t=>this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-media-picker>
          `,r);case"font":return p(n.qy`
            <mc-font-picker
              .hass=${this.hass}
              .value=${t}
              @value-changed=${t=>this._handlePropertyChange(e.key,t.detail.value)}
            ></mc-font-picker>
          `,r,void 0,m());case"select":return p(n.qy`
            <div class="select">
              <select
                class="input"
                id=${a}
                @change=${t=>this._handlePropertyChange(e.key,t.target.value)}
              >
                <option value="" ?selected=${!t}>${c?(0,h.t)(490,{value:this._optionLabel(e,c)}):void 0===e.emptyLabel?(0,h.t)(667):(0,Qt.t)(e.emptyLabel)}</option>
                ${this._renderOptions(e.options||[],t)}
              </select>
              <ha-icon icon="mdi:chevron-down"></ha-icon>
            </div>
          `,r,a);case"segmented":{const i=e.options||[],o=i.some(e=>e.value===t)?t:e.defaultValue??i[0]?.value,s=t=>{const n=t.currentTarget,s=(0,xt.n)(t.key,i.findIndex(e=>e.value===o),i.map(()=>({})),"both",!0,"rtl"===(0,Ge.k)(n));s<0||(t.preventDefault(),this._handlePropertyChange(e.key,i[s].value),requestAnimationFrame(()=>n.querySelector(`[data-val="${i[s].value}"]`)?.focus()))};return p(n.qy`
            <div class="seg full" role="radiogroup" aria-label=${(0,Qt.t)(e.label)} @keydown=${s}>
              ${i.map(t=>{const i=t.value===o;return n.qy`<button
                  type="button"
                  role="radio"
                  data-val=${t.value}
                  aria-checked=${i?"true":"false"}
                  tabindex=${i?"0":"-1"}
                  @click=${()=>this._handlePropertyChange(e.key,t.value)}
                >${(0,Qt.t)(t.label)}</button>`})}
            </div>
          `,r)}case"tab_list":{const t=this.tabs?.labels??[];if(!t.length)return n.qy``;const i=this._getActiveDesign()[e.key],o=new Set(Array.isArray(i)?i.filter(e=>"number"==typeof e):[]),s=(t,i)=>{const n=new Set(o);i?n.add(t):n.delete(t);const s=[...n].sort((e,t)=>e-t);this._handleObjectChange(e.key,s.length?s:void 0)};return p(n.qy`<div class="tab-list" role="group" aria-label=${(0,Qt.t)(e.label)}>
            ${t.map((e,t)=>n.qy`<label><input type="checkbox" .checked=${o.has(t)} @change=${e=>s(t,e.target.checked)} /><span>${e||(0,h.t)(1028,{n:t+1})}</span></label>`)}
          </div>`,r,void 0,In(e.help))}case"number":return p(n.qy`
            <input
              class="input"
              id=${a}
              type="number"
              min=${e.range?.[0]??n.s6}
              max=${e.range?.[1]??n.s6}
              step=${e.range?.[2]??n.s6}
              placeholder=${l??(d?c||(0,h.t)(1072):n.s6)}
              .value=${t}
              @input=${t=>this._handlePropertyChange(e.key,t.target.value)}
            />
          `,r,a);default:return p(n.qy`
            <input
              class="input mono"
              id=${a}
              type="text"
              spellcheck="false"
              placeholder=${l??(d?c||(0,h.t)(1072):Dn[e.key]??n.s6)}
              .value=${t}
              @input=${t=>this._handlePropertyChange(e.key,t.target.value)}
            />
          `,r,a,In(e.help))}var g,f}_renderOptions(e,t){const i=e=>n.qy`<option value=${e.value} ?selected=${t===e.value}>${(0,Qt.t)(e.label)}</option>`,o=[...new Set(e.map(e=>e.group))];return 1===o.length&&void 0===o[0]?e.map(i):o.map(t=>n.qy`<optgroup label=${t??""}>${e.filter(e=>e.group===t).map(i)}</optgroup>`)}_optionLabel(e,t){const i=e.options?.find(e=>e.value===t);return i?(0,Qt.t)(i.label):t}_renderIconAnim(e){const t=this._getActiveDesign()[e],i=Pn(t)?t:{},o=!!this._viewParts().state,s="string"==typeof i.device?i.device:"",a="string"==typeof i.draw?i.draw:"",r="string"==typeof i.draw_duration||"number"==typeof i.draw_duration?i.draw_duration:"",l=String(r),c=t=>{const i={},n={device:s,draw:a,draw_duration:"draw_duration"in t?t.draw_duration:r,...t};n.device&&(i.device=n.device),n.draw&&(o||"off"!==n.draw)&&(i.draw=n.draw,"off"!==n.draw&&n.draw_duration&&(i.draw_duration=n.draw_duration)),this._handleObjectChange(e,Object.keys(i).length?i:void 0)},d={value:"",label:o?(0,h.t)(861):(0,h.t)(680)},u=(e,t,i,o,s)=>n.qy`
      <div>
        <label class="sublbl" for=${e}>${t}</label>
        <div class="select">
          <select class="input" id=${e} @change=${e=>s(e.target.value)}>
            ${[d,...o].map(e=>n.qy`<option value=${e.value} ?selected=${e.value===i}>${e.label}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>
    `,p=e=>o||"off"!==e.value,m=ei.filter(e=>p(e)&&("auto"!==e.value||!!this.moduleEntity||"auto"===s)).map(e=>({value:e.value,label:(0,h.t)(e.label)})),g=ti.filter(p).map(e=>({value:e.value,label:(0,h.t)(e.label)}));return n.qy`
      <div class="fx-pair">
        ${u(`dp-${e}-device`,(0,h.t)(302),s,m,e=>c({device:e}))}
        ${u(`dp-${e}-draw`,(0,h.t)(523),a,g,e=>c({draw:e}))}
      </div>
      ${a&&"off"!==a?n.qy`<div>
            <span class="sublbl">${(0,h.t)(318)}</span>
            <mc-unit-field
              data-key="${e}-duration"
              .value=${l}
              .label=${(0,h.t)(318)}
              .units=${["s","ms"]}
              .placeholder=${String(ii._T.drawDuration)}
              @value-changed=${e=>c({draw_duration:e.detail.value||""})}
            ></mc-unit-field>
          </div>`:n.s6}
    `}_renderSector(e){const t=this._filterProperties(function(e){const t=e.leading||[];return[...t.map(t=>e.properties.find(e=>e.key===t)).filter(e=>!!e),...e.properties.filter(e=>!t.includes(e.key))]}(e));if(0===t.length)return n.s6;const i=this._openSectors.has(e.id)||!!this._searchQuery,o=this._countSetProperties(e),s=`sb-${e.id}`;return n.qy`
      <div class="sector">
        <button
          type="button"
          class="sector-btn"
          aria-expanded=${i?"true":"false"}
          aria-controls=${s}
          @click=${()=>this._toggleSector(e.id)}
        >
          <ha-icon icon=${e.icon}></ha-icon>
          <span class="nm">${(0,Qt.t)(e.name)}</span>
          ${o>0?n.qy`<span class="chip is-count">${(0,h.t)(1302,{n:o})}</span>`:n.s6}
          <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        </button>
        ${i?n.qy`<div class="sector-body" id=${s}>
              ${o>0?n.qy`<div class="sector-reset-row">
                    <button
                      type="button"
                      class="btn btn-text btn-sm sector-reset"
                      aria-label=${(0,h.t)(820,{name:(0,Qt.t)(e.name)})}
                      title=${"tabs-bar"===e.id&&"default"===this._activeView?(0,h.t)(830):(0,h.t)(190)}
                      @click=${()=>this._reset(e.properties.filter(e=>this._isSet(e)))}
                    >
                      <ha-icon icon="mdi:backup-restore"></ha-icon>${(0,h.t)(818)}
                    </button>
                  </div>`:n.s6}
              ${"tabs-bar"===e.id?this._renderTabNotes():n.s6}
              ${this._renderPropertyList(t)}
              ${"tabs-bar"===e.id?this._renderStateReset():n.s6}
            </div>`:n.s6}
      </div>
    `}_renderPropertyList(e){return e.some(e=>e.subgroup)?this._renderSubgroups(e):this._renderFlatList(e)}_renderSubgroups(e){const t=[];for(const i of e){const e=t[t.length-1];e&&e.id===i.subgroup?e.props.push(i):t.push({id:i.subgroup,props:[i]})}const i=this._viewParts().state,o=[];let s=!1;for(const e of t){const t=Re.find(t=>t.id===e.id);if(!t){o.push(...this._renderFlatList(e.props));continue}"bar"===e.id||s||(s=!0,o.push(n.qy`<h4 class="subgroup-caption">${(0,h.t)(1029)}</h4>`));const a=e.props.filter(e=>this._isSet(e)),r=a.length;r>0&&this._subOpenedForValue.add(t.id);const l=!!this._searchQuery||(this._subOpen.get(t.id)??("bar"===t.id||"text"===t.id||this._subOpenedForValue.has(t.id))),c=`sg-${t.id}`,d=(0,Qt.t)(t.name);o.push(n.qy`
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
              ${r>0?n.qy`<span class="chip is-count">${(0,h.t)(1302,{n:r})}</span>`:n.s6}
            </button>
            ${r>0?n.qy`<button type="button" class="btn btn-text btn-sm subgroup-reset" aria-label=${(0,h.t)(826,{group:d,state:this._viewName()})} @click=${()=>this._reset(a)}>
                  ${(0,h.t)(813)}
                </button>`:n.s6}
          </div>
          ${l?n.qy`<div class="subgroup-body" id=${c}>
                ${this._renderFlatList(e.props)}
                ${"icon"===t.id&&"tab_active"===i?n.qy`<div class="tree-note">
                      <p class="help">${(0,h.t)(475)}</p>
                      <button type="button" class="btn btn-text btn-sm show-tree" @click=${()=>this.dispatchEvent(new CustomEvent("mc-select-first-tab",{bubbles:!0,composed:!0}))}>${(0,h.t)(939)}</button>
                    </div>`:n.s6}
              </div>`:n.s6}
        </div>
      `)}return o}_renderTabNotes(){const{id:e,state:t}=this._viewParts();if(!t&&!this._isHoverView())return n.s6;const i=this._getActiveRule(),o=this._getActiveDesign(),s=!Object.values(o).some(e=>void 0!==e&&""!==e),a=i?.design?.tab_disabled_tabs??this.design.tab_disabled_tabs,r="tab_disabled"===t&&!(Array.isArray(a)&&a.length);return n.qy`
      <div class="tab-notes">
        <p class="help">${i?(0,h.t)(132):(0,h.t)(131)}</p>
        ${t&&s?n.qy`<p class="help">${(0,h.t)(672)}</p>`:n.s6}
        ${r?n.qy`<p class="help">${(0,h.t)(656)}</p>`:n.s6}
        <div>
          <button
            type="button"
            class="btn btn-text btn-sm go-default"
            @click=${async()=>{this._activeView=i?e:"default",await this.updateComplete,this.shadowRoot?.querySelector(".subgroup-btn")?.focus()}}
          >
            ${i?(0,h.t)(423):(0,h.t)(422)}
          </button>
        </div>
      </div>
    `}_renderStateReset(){const e=this._viewParts().state;if(!e||!Object.values(this._getActiveDesign()).some(e=>void 0!==e&&""!==e))return n.s6;const t="tab_active"===e?(0,h.t)(26):(0,h.t)(306);return n.qy`<div>
      <button type="button" class="btn btn-secondary btn-sm reset-state" @click=${()=>this._resetState()}>
        <ha-icon icon="mdi:backup-restore"></ha-icon>${(0,h.t)(829,{state:t})}
      </button>
    </div>`}_renderFlatList(e){const t=e=>!!e&&("unit"===e.type||"select"===e.type||"number"===e.type),i=[];for(let o=0;o<e.length;o++){const s=e[o];t(s)&&t(e[o+1])?(i.push(n.qy`<div class="two">${this._renderProperty(s)}${this._renderProperty(e[o+1])}</div>`),o++):i.push(this._renderProperty(s))}return i}_renderRulePicker(){const e=this.design.conditional||[],t=e.length,i="tabs"===this.moduleType,o=this._viewParts().state,s=o?"tab_active"===o?(0,h.t)(93):(0,h.t)(95):this._isHoverView()?(0,h.t)(98,{thing:Xi(this.target)}):t?(0,h.t)(1266,{n:t}):(0,h.t)(33);return n.qy`
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
              <option value=${jn} ?selected=${this._isHoverView()}>${i?this._withCount((0,h.t)(460),Object.values(this.design?.hover??{}).filter(e=>void 0!==e&&""!==e).length):(0,h.t)(460)}</option>
              ${i?n.qy`<option value=${Tn} ?selected=${this._activeView===Tn}>${this._withCount((0,h.t)(26),this._stateCount("tab_active",void 0))}</option>
                    <option value=${zn} ?selected=${this._activeView===zn}>${this._withCount((0,h.t)(306),this._stateCount("tab_disabled",void 0))}</option>`:n.s6}
              ${e.map((e,t)=>{const o=e.name||(0,h.t)(855,{n:t+1}),s=t=>t?`${e.id}::${t}`:e.id;return n.qy`<option value=${e.id} ?selected=${this._activeView===e.id}>${(0,h.t)(856,{name:o})}</option>
                  ${i?n.qy`<option value=${s("tab_active")} ?selected=${this._activeView===s("tab_active")}>${this._withCount((0,h.t)(857,{name:o}),this._stateCount("tab_active",e))}</option>
                        <option value=${s("tab_disabled")} ?selected=${this._activeView===s("tab_disabled")}>${this._withCount((0,h.t)(858,{name:o}),this._stateCount("tab_disabled",e))}</option>`:n.s6}`})}
            </select>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </div>
          <p class="help" id="design-view-help">${s}</p>
        </div>
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${()=>this._addRule()}>
            <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(41)}
          </button>
        </div>
      </div>
    `}_renderRuleHeader(e){const t="any"===e.mode?"any":"every",i=[{v:"every",l:(0,h.t)(63)},{v:"any",l:(0,h.t)(91)}];return n.qy`
      <div class="rule-head">
        <h3>${(0,h.t)(853)}</h3>
        <button
          type="button"
          class="btn btn-text btn-sm danger-text"
          @click=${()=>this._removeRule(e.id)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>${(0,h.t)(292)}
        </button>
      </div>
      <div class="field">
        <div class="field-head"><label for="rule-name">${(0,h.t)(854)}</label></div>
        <input
          class="input"
          id="rule-name"
          type="text"
          .value=${e.name||""}
          placeholder=${(0,h.t)(854)}
          @input=${t=>this._updateRuleName(e.id,t.target.value)}
        />
      </div>
      <div class="field">
        <div class="field-head"><span class="lbl">${(0,h.t)(566)}</span></div>
        <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(223)}>
          ${i.map(i=>n.qy`
              <button
                type="button"
                role="radio"
                aria-checked=${t===i.v?"true":"false"}
                @click=${()=>this._updateRuleMode(e.id,i.v)}
              >${i.l}</button>
            `)}
        </div>
      </div>
    `}_renderRuleConditions(e){return n.qy`
      <div class="rule-conds">
        ${e.conditions.length?e.conditions.map((t,i)=>n.qy`
                <mc-condition-row
                  .condition=${t}
                  .hass=${this.hass}
                  .moduleEntity=${this.moduleEntity}
                  .onChange=${t=>this._updateCondition(e,i,t)}
                  .onRemove=${()=>this._removeCondition(e,i)}
                ></mc-condition-row>
              `):n.qy`<p class="help">${(0,h.t)(634)}</p>`}
        <div>
          <button type="button" class="btn btn-secondary btn-sm" @click=${()=>this._addConditionToRule(e)}>
            <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(40)}
          </button>
        </div>
      </div>
    `}_handleCustomCssChange(e){const t=this._sub();t?t.write({...t.design,css:e||void 0}):this.onChange({css:e||void 0})}_getCustomCssValue(){return this._getActiveDesign().css||""}_countGroup(e){return e.entries.reduce((e,t)=>{if(t===Ie)return e+(this._getCustomCssValue()?1:0);const i=He.find(e=>e.id===t);return e+(i?this._countSetProperties(i):0)},0)}_renderGroup(e){const t=e.entries.map(e=>He.find(t=>t.id===e)).filter(e=>!!e&&(!e.modules||e.modules.includes(this.moduleType))&&this._filterProperties(e.properties).length>0),i=e.entries.includes(Ie)&&this._customCssMatches()&&!this._viewParts().state;if(!t.length&&!i)return n.s6;const o=this._countGroup(e),s=!!this._searchQuery||this._isGroupOpen(e,o),a=`dg-${e.id}`;return n.qy`
      <section class="dgroup" data-group=${e.id}>
        <button
          type="button"
          class="dgroup-btn"
          aria-expanded=${s?"true":"false"}
          aria-controls=${a}
          @click=${()=>this._toggleGroup(e,this._isGroupOpen(e,o))}
        >
          <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
          <span class="nm">${(0,Qt.t)(e.name)}</span>
          ${o>0?n.qy`<span class="chip is-count">${(0,h.t)(1302,{n:o})}</span>`:n.s6}
        </button>
        <div class="dgroup-body" id=${a} ?hidden=${!s}>
          ${s?n.qy`${t.length?n.qy`<div class="sectors">${t.map(e=>this._renderSector(e))}</div>`:n.s6}
              ${i?this._renderCustomCss():n.s6}`:n.s6}
        </div>
      </section>
    `}_renderCustomCss(){return n.qy`
      <div class="field">
        <div class="field-head">
          <label for="custom-css">${(0,h.t)(256)}</label>
          ${(0,Jt.i)((0,h.t)(256),!!this._getCustomCssValue(),()=>this._handleCustomCssChange(""))}
        </div>
        <textarea
          class="input"
          id="custom-css"
          spellcheck="false"
          .value=${this._getCustomCssValue()}
          @input=${e=>this._handleCustomCssChange(e.target.value)}
          rows="4"
          placeholder=${(0,h.t)(96,{thing:Xi(this.target)})}
        ></textarea>
      </div>
    `}render(){const e=this._getActiveRule();"default"===this._viewParts().id||this._isHoverView()||e||(this._activeView="default");const t=Ve.map(e=>this._renderGroup(e));return n.qy`
      <div class="panel">
        ${this.hoverOnly?n.s6:n.qy`<div class="group">
          ${this._renderClipboard()}
          ${this._renderRulePicker()}
          ${e?n.qy`
                <div class="rule">
                  ${this._renderRuleHeader(e)}
                  ${this._renderRuleConditions(e)}
                </div>
              `:n.s6}
        </div>`}

        <div class="group">
          <div class="with-icon">
            <ha-icon icon="mdi:magnify"></ha-icon>
            <input
              class="input"
              type="search"
              placeholder=${(0,h.t)(874)}
              aria-label=${(0,h.t)(873)}
              .value=${this._searchQuery}
              @input=${e=>{this._searchQuery=e.target.value}}
            />
          </div>
          ${t.some(e=>e!==n.s6)?n.qy`<div class="dgroups">${t}</div>`:n.qy`<p class="no-results">${(0,h.t)(630,{query:this._searchQuery})}</p>`}
        </div>
      </div>
    `}};function Nn(e,t){if(t)return{templateName:t,notSynced:e.not_synced||[],basePath:""}}function Zn(e,t){return t?t.effective:e.entity}Fn.styles=[l.x,n.AH`
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
        ${(0,ni.E)("inset","0","auto")}
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
        text-align: start;
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
      :host([dir='rtl']) .subgroup-btn[aria-expanded='false'] .chev {
        transform: rotate(90deg);
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
        text-align: start;
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
      :host([dir='rtl']) .dgroup-btn[aria-expanded='false'] .chev {
        transform: rotate(90deg);
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
    `],qn([(0,o.MZ)({attribute:!1})],Fn.prototype,"design",void 0),qn([(0,o.MZ)({attribute:!1})],Fn.prototype,"hass",void 0),qn([(0,o.MZ)({attribute:!1})],Fn.prototype,"onChange",void 0),qn([(0,o.MZ)({type:Boolean})],Fn.prototype,"hasTemplate",void 0),qn([(0,o.MZ)({attribute:!1})],Fn.prototype,"notSynced",void 0),qn([(0,o.MZ)({type:String})],Fn.prototype,"moduleEntity",void 0),qn([(0,o.MZ)({type:String})],Fn.prototype,"target",void 0),qn([(0,o.MZ)({type:String})],Fn.prototype,"moduleType",void 0),qn([(0,o.MZ)({type:String})],Fn.prototype,"moduleVariant",void 0),qn([(0,o.MZ)({type:Boolean})],Fn.prototype,"hoverOnly",void 0),qn([(0,o.MZ)({attribute:!1})],Fn.prototype,"tabs",void 0),qn([(0,o.wk)()],Fn.prototype,"_openSectors",void 0),qn([(0,o.wk)()],Fn.prototype,"_subOpen",void 0),qn([(0,o.wk)()],Fn.prototype,"_groupOpen",void 0),qn([(0,o.wk)()],Fn.prototype,"_searchQuery",void 0),qn([(0,o.wk)()],Fn.prototype,"_activeView",void 0),qn([(0,o.wk)()],Fn.prototype,"_pasteMenu",void 0),qn([(0,o.wk)()],Fn.prototype,"_clipStatus",void 0),Fn=qn([(0,o.EM)("mc-design-panel")],Fn);const Bn={actions:(e,t,i,n,o)=>{const s=e.actions,a=Nn(e,n);return Nt(s,(t,o)=>{const a={...e,actions:{...s,[t]:o}};if(n){const i=new Set(e.not_synced||[]);for(const[e,n]of Object.entries(o))void 0!==n&&i.add(`actions.${t}.${e}`);a.not_synced=Array.from(i)}i(a)},t,Zn(e,o),e=>(e=>{if(a)return{...a,basePath:`actions.${e}`}})(e))},conditions:(e,t,i,n)=>{const o=e.display,s=o?.conditions||[],a=o?.mode||"every",r=Nn(e,n),l=t=>{i({...e,display:{...o,...t}})},c=r?{...r,basePath:"display"}:void 0;return Ut(s,a,{onAdd:()=>{const e={id:(0,w.$)("cond"),type:"state",entity:"",state:""};l({conditions:[...s,e]})},onUpdate:(e,t)=>{l({conditions:s.map((i,n)=>n===e?{...i,...t}:i)})},onRemove:e=>{l({conditions:s.filter((t,i)=>i!==e)})},onMode:e=>l({mode:e})},t,c,"module")},design:(e,t,i,o,s)=>{const a=e.design||{},r=!!o,l=e.not_synced||[];return n.qy`<mc-design-panel
    .design=${a}
    .hass=${t}
    .hasTemplate=${r}
    .notSynced=${l}
    .moduleEntity=${Zn(e,s)||""}
    .moduleType=${e.type||""}
    .moduleVariant=${e.button_style||""}
    .tabs=${"tabs"===e.type?function(e){const t=e;return{labels:(Array.isArray(t.tabs)?t.tabs:[]).map(e=>e&&"object"==typeof e&&"string"==typeof e.label?e.label:""),style:"string"==typeof t.tab_style?t.tab_style:void 0}}(e):void 0}
    .onChange=${t=>{const n={...a},o={...e};if(t._markNotSynced){const i=[].concat(t._markNotSynced),n=new Set(e.not_synced||[]);for(const e of i)n.add(`design.${e}`);o.not_synced=Array.from(n),delete t._markNotSynced}if(t._markSynced){const i=new Set(e.not_synced||[]);for(const e of[].concat(t._markSynced))i.delete(`design.${e}`);o.not_synced=Array.from(i),delete t._markSynced}for(const[e,i]of Object.entries(t))void 0===i||""===i?delete n[e]:n[e]=i;i({...o,design:n})}}
  ></mc-design-panel>`}},Kn=()=>n.qy`<p class="help">${(0,h.t)(655)}</p>`;var Wn=i(7911);const Un=(0,i(4973).Ev)("layer-editor",()=>i.e(708).then(()=>i(1235))),Gn=()=>Un.load(),Yn="margin:0 0 8px;color:var(--secondary-text-color)";function Qn(){if(Un.ready())return n.s6;const e=n.qy`<p role="alert" style=${Yn}>${(0,h.t)(508)}</p>`;if(Un.failed())return e;const t=n.qy`<p role="status" style=${Yn}>${(0,h.t)(542)}</p>`;return n.qy`${(0,Wn.T)(Gn().then(t=>t?n.s6:e),t)}`}const Jn=function(){const e=new Map,t=t=>{const i=e.get(t);return i?[...i.tabs??Ht]:["general"]};return{register(t){e.set(t.type,t)},get:t=>e.get(t),tabs:t,render(i,o,s,a,r,l,c){const d=e.get(o.type);if(!d||!t(o.type).includes(i))return Kn();const h=d[i],u="general"===i?d.general:h??Bn[i];if(!u)return Kn();let p=u(o,s,a,r,l);return"design"===i&&c&&!1!==d.layerGroups&&(p=function(e,t,i,o,s){return n.qy`${Qn()}<mc-layer-design .config=${e} .hass=${t} .onChange=${i} .ctx=${o}>${s??n.s6}</mc-layer-design>`}(o,s,a,c,p)),"general"!==i||!l||d.entityField?p:n.qy`${Rt(o,s,a,l,Nn(o,r))}${p}`}}}();var Xn=i(6874);function eo(e,t,i){const n=(0,Xn.DH)(e.entity),o=(0,Xn.Xu)(e,t.up);return null===n?{up:o,walled:!0}:n&&!0===e.share_entity?{up:o,from:{id:n,from:i}}:{...t,up:o}}function to(e,t,i){const n=(0,Xn.DH)(e.entity),o="string"==typeof n?n:void 0;let s={up:o,from:o?{id:o,from:"card"}:void 0};const a=void 0===t?void 0:e.rows?.[t];a&&(s=eo(a,s,"row"));const r=void 0===i?void 0:a?.columns?.[i];return r?eo(r,s,"column"):s}function io(e,t,i){for(const n of t??[]){if(!e)break;i=eo(e,i,Pt[e.type]??"row");const t="row"===e.type?e.columns?.[n.slot]:void 0;t&&(i=eo(t,i,"column")),e=(0,M.yZ)(e)?.[n.slot]?.[n.index]}return{mod:e,s:i}}function no(e,t,i){const n=(0,Xn.DH)(e?.entity),o={choice:void 0===n?"inherit":null===n?"none":"own"};return o.effective=e?(0,Xn.hY)(e,t.up,i):void 0,!1===i?o.cardModule=!0:(i&&(o.domains=i),t.from&&t.up&&(o.inherited=t.from),t.walled&&!t.up&&(o.walled=!0),o.inherited&&o.domains&&!o.domains.includes(o.inherited.id.split(".")[0])&&(o.mismatch=!0)),"string"!=typeof n||n.includes(".")||(o.invalidOwn=!0),o}function oo(e,t){const i=e.rows?.[t.row]?.columns?.[t.col]?.modules?.[t.module],{mod:n,s:o}=io(i,t.child,to(e,t.row,t.col));return no(n,o,n?k.s.get(n.type)?.metadata.inherit:void 0)}function so(e,t){const i=e.rows?.[t.row];if(void 0===t.slot)return no(void 0===t.col?i:i?.columns?.[t.col],to(e,void 0===t.col?void 0:t.row));const n=i?.columns?.[t.col]?.modules?.[t.module],o=io(n,t.child,to(e,t.row,t.col)),s=o.mod?eo(o.mod,o.s,Pt[o.mod.type]??"row"):o.s;return no(o.mod?.columns?.[t.slot],s)}function ao(e){return!0===Jn.get(e)?.entityField}function ro(e){const t=e;return!("text"!==e.type||t.use_entity||t.use_template&&/entity/.test(t.text??""))}function lo(e){const t={following:0,needing:0,preferred:[]},i="string"==typeof(0,Xn.DH)(e.entity);return function(e,t){const i=(e,n,o,s,a)=>{t(e,{row:n,col:o,module:s,child:a}),(0,M.yZ)(e)?.forEach((e,t)=>e.forEach((e,r)=>i(e,n,o,s,[...a,{slot:t,index:r}])))};(e.rows??[]).forEach((e,t)=>e.columns?.forEach((e,n)=>e.modules?.forEach((e,o)=>i(e,t,n,o,[]))))}(e,(n,o)=>{if(!ao(n.type)||ro(n))return;const s=oo(e,o);s.domains&&t.preferred.push(...s.domains),i&&"inherit"===s.choice&&!s.cardModule&&(s.mismatch?t.needing++:"card"===s.inherited?.from&&t.following++)}),t.preferred=[...new Set(t.preferred)],t}var co=i(15);function ho(e){const t=(0,rt.xc)(e);if("flow"===t)return n.s6;if("background"===t)return n.qy`<span class="lchip" data-layer="background" title=${(0,h.t)(135)}><ha-icon icon="mdi:arrange-send-to-back" aria-hidden="true"></ha-icon>${(0,h.t)(135)}</span>`;const i=(0,rt.ZZ)(e).anchor,o=(0,rt.m4)(i)?i:"top-left",s=(0,co.H)(o).toLowerCase();return n.qy`<span class="lchip" data-layer="overlay" title=${(0,h.t)(687,{anchor:s})}><ha-icon icon="mdi:arrange-bring-to-front" aria-hidden="true"></ha-icon>${(0,h.t)(686)}${a=o,n.qy`<span class="lglyph" aria-hidden="true">${Array.from({length:9},(e,t)=>t===3*(e=>e.includes("top")?0:e.includes("bottom")?2:1)(a)+(e=>e.includes("left")?0:e.includes("right")?2:1)(a)?n.qy`<i class="on"></i>`:n.qy`<i></i>`)}</span>`}<span class="sr-only">, ${s}</span></span>`;var a}function uo(e,t=!1){let i=0;for(const n of e??[])if("flow"!==(0,rt.xc)(n)&&i++,t)for(const e of(0,M.yZ)(n)??[])i+=uo(e,!0);return i}function po(e){return e<=0?n.s6:n.qy`<span class="chip is-count lcount">${(0,h.t)(1270,{n:e})}</span>`}const mo=n.AH`.lchip{display:inline-flex;align-items:center;gap:4px;flex:none;min-height:20px;padding:0 8px;border:1px solid var(--mc-field-border);border-radius:9999px;background:var(--mc-surface);color:var(--mc-text);font-size:.75rem;font-weight:600;line-height:1;white-space:nowrap;--mdc-icon-size:14px}.lglyph{display:inline-grid;grid-template-columns:repeat(3,3px);gap:1px;width:14px;height:14px;flex:none}.lglyph i{border-radius:1px;background:var(--mc-field-border)}.lglyph i.on{background:var(--mc-text)}.lcount{gap:3px}@container mc-outline (max-width:280px){.lchip .lglyph{display:none}.lchip{padding:0 6px}}@media (forced-colors:active){.lchip{border-color:CanvasText}.lglyph i.on{background:CanvasText}}`;var go=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};function fo(e){return e instanceof Element&&(e.matches('input, textarea, select, [contenteditable]:not([contenteditable="false"])')||!0===e.isContentEditable)}let vo=class extends n.WF{constructor(){super(...arguments),this.variant="pane",this._collapsed=new Set,this._focusKey=null,this._renaming=null,this._drop=null,this._pendingFocus=null,this._drag=null,this._ignoreClickUntil=0,this._lastSelKey="",this._renameReturn=null,this._itemMenu=new vt(this,{surface:"tree",focusSelection:()=>this._focusSelection(),rename:e=>this.startRename((0,C.iA)(e)),status:e=>this._status(e),deleteModule:e=>this._deleteModule(e),deleteRow:e=>{this.stateManager?.deleteRow(e),this._pendingFocus=e>0?(0,C.iA)({kind:"row",row:e-1}):"card",this.requestUpdate()},moveRow:(e,t)=>{this._moveRow(e,t),this._focusSelection()}}),this._longPress=new bt((e,t,i)=>this._contextAt(e,t,i)),this._onContextMenu=e=>{const t=e.composedPath();e.shiftKey||fo(t[0])||this._itemOnPath(t)&&(e.preventDefault(),this._longPress.cancel(),this._longPress.justFired||this._contextAt(t,e.clientX,e.clientY))}}connectedCallback(){super.connectedCallback(),this.stateManager&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0,this._subscribedTo=void 0,this._itemMenu.close(!1),this._longPress.cancel()}willUpdate(e){e.has("stateManager")&&this.stateManager!==this._subscribedTo&&this._subscribe()}updated(){const e=this._renaming?this.shadowRoot?.querySelector("input.rename"):null;if(e&&this.shadowRoot?.activeElement!==e&&(e.focus(),e.select()),this._pendingFocus){const e=this._pendingFocus;this._pendingFocus=null;const t=this._item(e)||this._item(this._selectedKey)||this._item("card");t&&(this._focusKey=t.dataset.key||null,t.focus())}}_subscribe(){this._unsubscribe?.(),this._subscribedTo=this.stateManager,this.stateManager?this._unsubscribe=this.stateManager.subscribe(e=>{this._state=e;const t=(0,C.iA)((0,C.c4)(e.selectedPath));t!==this._lastSelKey&&(this._lastSelKey=t,this._revealSelection(t))}):this._unsubscribe=void 0}_revealSelection(e){const t=(0,C.g1)(e);if("module"===t.kind||"column"===t.kind||"slot"===t.kind){const e=this._rowId(t.row);if(e&&this._collapsed.has(e)){const t=new Set(this._collapsed);t.delete(e),this._collapsed=t}}this.updateComplete.then(()=>{const t=this._item(e);this.isConnected&&t&&"function"==typeof t.scrollIntoView&&t.scrollIntoView({block:"nearest"})})}get _rows(){return this._state?.config.rows||[]}get _selectedKey(){return(0,C.iA)((0,C.c4)(this._state?.selectedPath??null))}_rowId(e){const t=this._rows[e];return t?t.id||`#${e}`:void 0}_isOpen(e){return!this._collapsed.has(this._rowId(e)||"")}_item(e){return this.shadowRoot?.querySelector(`[role="treeitem"][data-key="${e}"]`)||null}_visibleItems(){return Array.from(this.shadowRoot?.querySelectorAll('[role="treeitem"][data-key]')||[])}_select(e){this._focusKey=(0,C.iA)(e),this.stateManager?.setSelectedPath((0,C.bm)(e))}_setCollapsed(e,t){const i=this._rowId(e);if(!i||this._collapsed.has(i)===t)return;const n=new Set(this._collapsed);t?n.add(i):n.delete(i),this._collapsed=n}_fire(e,t){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:t}))}_addModule(e,t){this._fire("add-module",{rowIndex:e,colIndex:t})}_addChild(e,t){this._fire("add-module",{rowIndex:e.row,colIndex:e.col,moduleIndex:e.module,child:e.child,slot:t})}_addSlot(e,t){const i=this.stateManager;"tabs"===t?i?.addTab(e.row,e.col,e.module,e.child):i?.addNestedColumn(e.row,e.col,e.module,e.child),this._focusSelection()}_deleteSlot(e){const t=this.stateManager,i=this._state?(0,C.kW)(this._state.config,e):void 0;t&&i&&("tabs"===i.type?t.deleteTab(e.row,e.col,e.module,e.child,e.slot):t.deleteNestedColumn(e.row,e.col,e.module,e.child,e.slot),this._focusSelection())}_moveSlot(e,t){const i=this.stateManager,n=this._state?(0,C.kW)(this._state.config,e):void 0;i&&n&&("tabs"===n.type?i.moveTab(e.row,e.col,e.module,e.child,e.slot,t):i.moveNestedColumn(e.row,e.col,e.module,e.child,e.slot,t),this._focusSelection())}startRename(e,t){const i=(0,C.g1)(e);"card"!==i.kind&&"row"!==i.kind&&this._setCollapsed(i.row,!1),this._renameReturn=t??null,this._focusKey=e,this._renaming=e}_defaultLabel(e){const t=this._state?.config;if(!t)return;if("row"===e.kind)return(0,h.t)(848,{n:e.row+1});if("column"===e.kind)return(0,h.t)(218,{n:e.col+1});if("slot"===e.kind)return(0,h.t)(218,{n:e.slot+1});const i="module"===e.kind?(0,C.cv)(t,e):void 0;return i?ft({...i,editor_name:void 0}):void 0}_renameValue(e){const t=this._state?.config;if(!t)return"";const i=(0,C.R9)(t,e);return"card"===e.kind?t.name??"":"slot"===e.kind&&"tabs"===(0,C.kW)(t,e)?.type?String(i?.label??""):(0,C.Hn)(i)??this._defaultLabel(e)??""}_commitRename(e,t,i=!1){this._renaming===(0,C.iA)(e)&&(this._renaming=null,this.stateManager?.setLayerName(e,t,this._defaultLabel(e)),this._afterRename(e,i))}_afterRename(e,t=!1){const i=this._renameReturn;this._renameReturn=null,t?i?.isConnected&&this._fire("mc-rename-done"):i?.isConnected?(this.updateComplete.then(()=>i.focus({preventScroll:!0})),this._fire("mc-rename-done")):this._pendingFocus=(0,C.iA)(e),this.requestUpdate()}_onRenameKeydown(e,t){e.stopPropagation(),"Enter"===e.key?(e.preventDefault(),this._commitRename(t,e.target.value)):"Escape"===e.key&&(e.preventDefault(),this._renaming=null,this._afterRename(t))}_renderRename(e,t){return n.qy`<input class="rename" aria-label=${t} .value=${this._renameValue(e)}
      @click=${e=>e.stopPropagation()}
      @keydown=${t=>this._onRenameKeydown(t,e)}
      @blur=${t=>this._commitRename(e,t.target.value,!0)} />`}_hiddenMark(e){return(0,C.Ak)(e)?n.qy`<ha-icon class="hid-ico" icon="mdi:eye-off-outline" title=${(0,h.t)(443)}></ha-icon><span class="sr-only">${(0,h.t)(443)}</span>`:n.s6}_status(e){"layers"===this.variant?this._fire("mc-status",{message:e}):document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:e}}))}_itemOnPath(e){for(const t of e){if(t===this)return null;if(t instanceof HTMLElement&&"treeitem"===t.getAttribute("role")&&t.dataset.key)return t}return null}_contextAt(e,t,i){const n=this._itemOnPath(e);if(!n||!this.stateManager)return;const o=(0,C.g1)(n.dataset.key||"card");this._focusKey=(0,C.iA)(o),this.stateManager.setSelectedPath((0,C.bm)(o),{reveal:!1}),this._ignoreClickUntil=Date.now()+400,this._itemMenu.open(o,n,{point:{x:t,y:i},returnFocus:n})}_slotTotal(e){const t=this._state?(0,C.kW)(this._state.config,e):void 0;return(0,M.yZ)(t)?.length??0}_slotCount(e){const t=this._state?(0,C.kW)(this._state.config,e):void 0;return(0,M.yZ)(t)?.[e.slot]?.length??0}_addColumn(e){const t=this.stateManager;t&&this._rows[e]&&(t.addColumn(e),this._select({kind:"column",row:e,col:this._rows[e].columns.length-1}))}_requestAddRow(){this._fire("request-add-row")}_moveRow(e,t){const i=this.stateManager;if(!i||e===t||t<0||t>=this._rows.length)return;const n=i.getState().selectedPath;if(i.moveRow(e,t),n&&void 0!==n.rowIndex){const o=function(e,t,i){return e===t?i:t<e&&e<=i?e-1:i<=e&&e<t?e+1:e}(n.rowIndex,e,t);o!==n.rowIndex&&i.setSelectedPath({...n,rowIndex:o})}}_onButton(e){return e.composedPath().some(e=>e instanceof HTMLButtonElement)}_rename(e,t){this._onButton(e)||this.startRename(t)}_onItemClick(e){if(Date.now()<this._ignoreClickUntil||this._onButton(e))return;const t=e.currentTarget.dataset.key;t&&this._select((0,C.g1)(t))}_onKeydown(e){const t=e.composedPath()[0];if(fo(t))return;if(this._itemMenu.isOpen)return;const i=t instanceof Element?t.closest('[role="treeitem"]'):null;if(!i||i!==t)return;const n=i.dataset.key||"card",o=(0,C.g1)(n);if(!this.stateManager)return;const s=()=>{e.preventDefault(),e.stopPropagation()};if(e.altKey&&("ArrowUp"===e.key||"ArrowDown"===e.key)){const t="ArrowUp"===e.key?-1:1;if("module"===o.kind)s(),this._moveModuleBy(o,t);else if("slot"===o.kind)s(),this._moveSlot(o,t);else if("row"===o.kind){s();const e=o.row+t;e>=0&&e<this._rows.length&&(this._moveRow(o.row,e),this._pendingFocus=(0,C.iA)({kind:"row",row:e}),this.requestUpdate())}return}const a="rtl"===(0,Ge.k)(this);switch("ArrowLeft"===e.key&&a?"ArrowRight":"ArrowRight"===e.key&&a?"ArrowLeft":e.key){case"ArrowDown":case"ArrowUp":case"Home":case"End":{s();const t=this._visibleItems(),n=t.indexOf(i),o="ArrowDown"===e.key?Math.min(t.length-1,n+1):"ArrowUp"===e.key?Math.max(0,n-1):"Home"===e.key?0:t.length-1;return void this._focusItem(t[o])}case"ArrowRight":return void("row"===o.kind&&(s(),this._isOpen(o.row)?this._focusItem(this._item((0,C.iA)({kind:"column",row:o.row,col:0}))):this._setCollapsed(o.row,!1)));case"ArrowLeft":return void("row"===o.kind?(s(),this._setCollapsed(o.row,!0)):"column"!==o.kind&&"module"!==o.kind&&"slot"!==o.kind||(s(),this._focusItem(this._item((0,C.iA)((0,C.tw)(o,this._state?.config))))));case"Enter":case" ":return s(),void this._select(o);case"Delete":case"Backspace":if("module"===o.kind)return s(),void this._deleteModule(o)}const r=i.querySelector(":scope > .more")??i;this._itemMenu.shortcut(e,o,r,{returnFocus:i})&&s()}_moveModuleBy(e,t){const i=this.stateManager;i?.moveModuleBy(e.row,e.col,e.module,t,e.child)&&this._focusSelection()}_deleteModule(e){const t=this.stateManager;if(!t)return;if(e.child?.length)return t.deleteModule(e.row,e.col,e.module,e.child),void this._focusSelection();t.deleteModule(e.row,e.col,e.module);const i=this._rows[e.row]?.columns[e.col]?.modules?.length??0;this._pendingFocus=i?(0,C.iA)({...e,module:Math.min(e.module,i-1)}):(0,C.iA)({kind:"column",row:e.row,col:e.col}),this.requestUpdate()}_focusSelection(){const e=this.stateManager;e&&(this._pendingFocus=(0,C.iA)((0,C.c4)(e.getState().selectedPath)),this.requestUpdate())}_focusItem(e){e&&(this._focusKey=e.dataset.key||null,e.focus())}_openMenuFor(e,t){this._itemMenu.open(e,t.currentTarget)}_menuOpenFor(e){return this._itemMenu.openKey===(0,C.iA)(e)}_onRowDragStart(e,t){this._itemMenu.close(!1),this._longPress.cancel(),this._drag={type:"row",row:t},e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._drag))),e.currentTarget.closest("li")?.classList.add("dragging"),e.stopPropagation()}_onModuleDragStart(e,t){this._itemMenu.close(!1),this._longPress.cancel(),this._drag={type:"module",sel:t},e.dataTransfer&&(e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this._drag))),e.currentTarget.closest("li")?.classList.add("dragging"),e.stopPropagation()}_onDragEnd(e){e.currentTarget.closest("li")?.classList.remove("dragging"),this._drag=null,this._drop=null,this._ignoreClickUntil=Date.now()+250}_dropZone(e){const t=this._drop;return"place"===t?.type&&t.key===e?t.zone:void 0}_zoneClass(e){return"before"===e?"drop-before":"after"===e?"drop-after":"inside"===e?"drop-into":""}_isLowerHalf(e,t){const i=t.getBoundingClientRect();return e.clientY>i.top+i.height/2}_setDrop(e){const t=this._drop;t&&e&&t.type===e.type&&("row"===t.type?t.index===e.index:t.key===e.key&&t.zone===e.zone)||!t&&!e||(this._drop=e)}_onRowDragOver(e,t){"row"===this._drag?.type&&(e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._setDrop({type:"row",index:this._isLowerHalf(e,e.currentTarget)?t+1:t}))}_onRowDrop(e){e.preventDefault();const t=this._drag,i=this._drop;if(this._drag=null,this._drop=null,"row"!==t?.type||"row"!==i?.type)return;const n=i.index>t.row?i.index-1:i.index;this._moveRow(t.row,n)}_onItemDragOver(e,t){const i=this._drag;if("module"!==i?.type||!this._state)return;e.stopPropagation();const n=e.currentTarget;!function(e,t){let i=e;for(;i&&i.scrollHeight<=i.clientHeight+1;)i=i.parentElement??i.getRootNode().host??null;if(!i)return;const n=i.getBoundingClientRect();t<n.top+32?i.scrollTop-=12:t>n.bottom-32&&(i.scrollTop+=12)}(n,e.clientY);const o="module"===t.kind?(0,C.cv)(this._state.config,t):void 0,s=((0,M.QN)(o)&&n.querySelector(":scope > .line")||n).getBoundingClientRect(),a=s.height?(e.clientY-s.top)/s.height:.5,r="module"===t.kind?function(e,t){return!(0,M.QN)(e)||(0,S.WA)(e)?t<.5?"before":"after":t<.25?"before":t>.75?"after":"inside"}(o,a):"inside",l=ht(this._state.config,t,r);if(!l||!function(e,t){return!ct(e,t)&&!function(e,t){if(t.row!==e.row||t.col!==e.col)return!1;const i=e.child??[];if(!i.length)return void 0===t.module&&(t.index===e.module||t.index===e.module+1);const n=i[i.length-1],o=i.slice(0,-1),s=t.child??[];return t.module===e.module&&t.slot===n.slot&&s.length===o.length&&o.every((e,t)=>s[t].slot===e.slot&&s[t].index===e.index)&&(t.index===n.index||t.index===n.index+1)}(e,t)}(i.sel,l))return e.dataTransfer&&(e.dataTransfer.dropEffect="none"),void this._setDrop(null);e.preventDefault(),e.dataTransfer&&(e.dataTransfer.dropEffect="move"),this._setDrop({type:"place",key:(0,C.iA)(t),zone:r,place:l})}_dropModule(e){if("module"!==this._drag?.type)return;e.preventDefault(),e.stopPropagation();const t=this._drag,i=this._drop;if(this._drag=null,this._drop=null,this._ignoreClickUntil=Date.now()+300,"place"!==i?.type||!this.stateManager)return;const n=dt(this.stateManager.getConfig(),t.sel,i.place);n&&(this.stateManager.updateConfig(n.config),this.stateManager.setSelectedPath(n.path),this._status((0,h.t)(611,{name:this._moduleName((0,C.cv)(n.config,(0,C.c4)(n.path))),where:this._placeName(n.config,i.place)})))}_placeName(e,t){const i=(0,h.t)(850,{row:t.row+1,column:t.col+1});if(void 0===t.module)return i;const n=e.rows[t.row]?.columns[t.col]?.modules[t.module],o=(0,S.Rv)(n,t.child??[]);if(!o)return i;const s=(0,W.D)(o,t.slot??0);return s?(0,h.t)(1293,{name:this._moduleName(o),slot:s}):this._moduleName(o)}_onTreeDragLeave(e){const t=e.relatedTarget;t&&e.currentTarget.contains(t)||(this._drop=null)}_itemAttrs(e,t,i){return{current:e===t,tab:e===i?0:-1}}render(){const e=this._rows,t=this._selectedKey,i=this._resolveFocusKey(t),o=this._state?.config.name?.trim()||(0,h.t)(167),s=this._itemAttrs("card",t,i),a="card"===this._renaming;return n.qy`
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
                tabindex=${s.tab}
                aria-selected=${s.current?"true":"false"}
                aria-current=${s.current?"true":n.s6}
                @click=${this._onItemClick}
                @dblclick=${()=>this.startRename("card")}
              >
                <ha-icon icon="mdi:card-outline"></ha-icon>
                ${a?this._renderRename({kind:"card"},(0,h.t)(175)):n.qy`<span class="text"><span class="name">${o}</span></span>`}
              </div>
            </div>
          </li>
          ${e.map((e,n)=>this._renderRow(e,n,t,i))}
        </ul>
        ${e.length?n.qy`
              <div class="foot">
                <button type="button" class="btn btn-secondary btn-sm" @click=${this._requestAddRow}>
                  <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(50)}
                </button>
              </div>
            `:n.qy`
              <div class="empty card-empty">
                <ha-icon icon="mdi:view-sequential-outline"></ha-icon>
                <strong>${(0,h.t)(651)}</strong>
                <p>${(0,h.t)(852)}</p>
                <button type="button" class="btn btn-text btn-sm" @click=${this._requestAddRow}>
                  <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(50)}
                </button>
              </div>
            `}
        ${this._itemMenu.render()}
      </div>
    `}_resolveFocusKey(e){if(this._focusKey&&this._keyRendered(this._focusKey))return this._focusKey;if(this._keyRendered(e))return e;const t=(0,C.g1)(e);return"card"!==t.kind&&this._keyRendered(`r${t.row}`)?`r${t.row}`:"card"}_keyRendered(e){const t=(0,C.g1)(e);if("card"===t.kind)return!0;const i=this._rows[t.row];return!!i&&("row"===t.kind||!!this._isOpen(t.row)&&!!i.columns[t.col]&&("column"===t.kind||("slot"===t.kind?!!this._state&&(0,C.V9)((0,C.Sh)(this._state.config,t),t):!!this._state&&!!(0,C.cv)(this._state.config,t))))}_renderGlyph(e){return wt(y(b(e)))}_renderRow(e,t,i,o){const s=(0,C.iA)({kind:"row",row:t}),a=this._itemAttrs(s,i,o),r=this._isOpen(t),l=this._drop,c="row"===l?.type&&l.index===t,d="row"===l?.type&&t===this._rows.length-1&&l.index===t+1,u={kind:"row",row:t},p=this._menuOpenFor(u),m=(0,C.Hn)(e)??(0,h.t)(848,{n:t+1}),g=this._renaming===s;return n.qy`
      <li
        role="none"
        class="row ${c?"drop-before":""} ${d?"drop-after":""}"
        @dragover=${e=>this._onRowDragOver(e,t)}
        @drop=${this._onRowDrop}
      >
        <div class="line k-row" role="treeitem" aria-level="2" data-key=${s} data-hidden=${(0,C.Ak)(e)?"":n.s6} tabindex=${a.tab} aria-labelledby=${`i-${s}`}
          aria-expanded=${r?"true":"false"} aria-selected=${a.current?"true":"false"} aria-current=${a.current?"true":n.s6}
          draggable="true" @dragstart=${e=>this._onRowDragStart(e,t)} @dragend=${this._onDragEnd}
          @click=${this._onItemClick} @dblclick=${e=>this._rename(e,s)}>
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
            id=${`i-${s}`}
            data-hidden=${(0,C.Ak)(e)?"":n.s6}
            data-current=${a.current?"":n.s6}
          >
            ${g?this._renderRename(u,(0,h.t)(847)):"pane"===this.variant?n.qy`${this._renderGlyph(e)}<span class="text"><span class="name">${m} · ${(0,f.SU)(e)?"custom":e.layout||"1"}</span>${this._containerEntity(e,{row:t})}</span>`:n.qy`<span class="text"><span class="name">${m}</span>${this._containerEntity(e,{row:t})}</span>${this._renderGlyph(e)}`}
            ${this._hiddenMark(e)}
          </div>
          <button
            type="button"
            class="icon-btn sm more"
            aria-label=${(0,h.t)(1287,{name:m})}
            aria-haspopup="menu"
            aria-expanded=${p?"true":"false"}
            @click=${e=>this._openMenuFor(u,e)}
          >
            <ha-icon icon="mdi:dots-vertical"></ha-icon>
          </button>
        </div>
        ${r?n.qy`<ul role="group">
              ${e.columns.map((e,n)=>this._renderColumn(t,n,e.modules??[],i,o))}
              ${this._renderAddColumn(t)}
            </ul>`:n.s6}
      </li>
    `}_renderColumn(e,t,i,o,s){const a=(0,C.iA)({kind:"column",row:e,col:t}),r=this._itemAttrs(a,o,s),l=i.length,c={kind:"column",row:e,col:t},d="inside"===this._dropZone(a),u=this._menuOpenFor(c),p=this._rows[e]?.columns[t],m=(0,C.Hn)(p)??(0,h.t)(218,{n:t+1});return n.qy`
      <li role="none" class="col ${d&&l?"drop-into":""}">
        <div class="line k-column" role="treeitem" aria-level="3" data-key=${a} data-hidden=${(0,C.Ak)(p)?"":n.s6} tabindex=${r.tab} aria-labelledby=${`i-${a}`}
          aria-selected=${r.current?"true":"false"} aria-current=${r.current?"true":n.s6}
          @click=${this._onItemClick} @dblclick=${e=>this._rename(e,a)}
          @dragover=${e=>this._onItemDragOver(e,c)} @drop=${this._dropModule}>
          <div
            class="item col-item k-column"
            id=${`i-${a}`}
            data-hidden=${(0,C.Ak)(p)?"":n.s6}
            data-current=${r.current?"":n.s6}
          >
            ${this._renaming===a?this._renderRename(c,(0,h.t)(215)):n.qy`<span class="text"><span class="name">${m}</span>${this._containerEntity(p,{row:e,col:t})}</span>`}
            ${this._hiddenMark(p)}
            ${this.stateManager?.ownsModuleList(c)?n.qy`<ha-icon class="own-ico" icon="mdi:format-list-bulleted" title=${(0,h.t)(718)}></ha-icon><span class="sr-only">${(0,h.t)(717)}</span>`:n.s6}
            <span class="chip is-count">${l}<span class="sr-only"> ${(0,h.t)(1280,{n:l})}</span></span>
            ${po(uo(i))}
          </div>
          <button
            type="button"
            class="icon-btn sm more"
            aria-label=${(0,h.t)(851,{row:e+1,column:t+1})}
            aria-haspopup="menu"
            aria-expanded=${u?"true":"false"}
            @click=${e=>this._openMenuFor(c,e)}
          >
            <ha-icon icon="mdi:dots-vertical"></ha-icon>
          </button>
        </div>
        ${l?n.qy`<ul role="group">
              ${i.map((i,n)=>this._renderModule(i,e,t,n,o,s))}
              ${"layers"===this.variant?this._renderAddRow(e,t):n.s6}
            </ul>`:n.qy`
              <div
                class="empty col-empty ${d?"drop-into":""}"
                role="treeitem"
                aria-level="4"
                data-empty=${a}
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
    `}_renderAddRow(e,t){return n.qy`
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
    `}_renderAddColumn(e){return n.qy`
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
    `}_followedEntity(e,t){const i=this._state?.config;if(!i||ro(e)||!ao(e.type)&&!(0,M.QN)(e))return n.s6;const o=oo(i,t),s=o.inherited;return"none"===o.choice?n.qy`<span class="sub">${(0,h.t)(637)}</span>`:"inherit"!==o.choice||o.cardModule||!s?n.s6:o.mismatch?n.qy`<span class="sub is-mismatch"><ha-icon icon="mdi:alert-outline" aria-hidden="true"></ha-icon>${(0,h.t)(628,{kind:qt(1===o.domains?.length?o.domains[0]:void 0)})}<span class="sr-only">${(0,h.t)(361)}</span></span>`:n.qy`<span class="sub is-inherited"><ha-icon icon="mdi:link-variant" aria-hidden="true"></ha-icon><span class="sr-only">${(0,h.t)(491)} </span>${"pane"===this.variant?n.qy`${(0,h.t)(863,{source:St(s.from)})} · `:n.s6}${"layers"===this.variant?s.id:(0,C.rb)(s.id)}</span>`}_renderModule(e,t,i,o,s,a){const r=(0,C.br)(t,i,o),l=(0,C.iA)(r),c=this._itemAttrs(l,s,a),d=k.s.get(e.type)?.metadata.icon||"mdi:puzzle-outline",u="string"==typeof e.entity&&C.Y.test(e.entity)?e.entity:void 0,p=u?n.s6:this._followedEntity(e,r),m=!!e.not_synced?.length,g=this._dropZone(l);return n.qy`
      <li
        role="none"
        class="mod ${this._zoneClass(g)}"
        @dragover=${e=>this._onItemDragOver(e,r)}
        @drop=${this._dropModule}
      >
        <div class="line mod-line k-module" role="treeitem" aria-level="4" data-key=${l} data-hidden=${(0,C.Ak)(e)?"":n.s6} tabindex=${c.tab} aria-labelledby=${`i-${l}`}
          aria-selected=${c.current?"true":"false"} aria-current=${c.current?"true":n.s6}
          draggable=${this._renaming===l?"false":"true"} @dragstart=${e=>this._onModuleDragStart(e,r)} @dragend=${this._onDragEnd}
          @click=${this._onItemClick} @dblclick=${e=>this._rename(e,l)}>
          <div
            class="item mod-item k-module"
            id=${`i-${l}`}
            data-hidden=${(0,C.Ak)(e)?"":n.s6}
            data-current=${c.current?"":n.s6}
          >
            <ha-icon icon=${d}></ha-icon>
            ${this._renaming===l?this._renderRename(r,(0,h.t)(595)):n.qy`<span class="text">
                  <span class="name">${ft(e)}</span>
                  ${u?n.qy`<span class="sub is-entity">${(0,C.rb)(u)}</span>`:p}
                </span>`}
            ${ho(e)}
            ${po(uo((0,M.yZ)(e)?.flat()))}
            ${this._hiddenMark(e)}
            ${m?n.qy`<span class="ovr-dot" title=${(0,h.t)(437)}></span><span class="sr-only">${(0,h.t)(437)}</span>`:n.s6}
          </div>
          ${this._renderModuleMore(e,r,c.tab)}
        </div>
        ${this._renderChildren(e,t,i,o,[],5,s,a)}
      </li>
    `}_renderChildren(e,t,i,o,s,a,r,l){const c=(0,M.yZ)(e);if(!c)return n.s6;const d=(0,C.br)(t,i,o,s);if(!(0,S.WA)(e))return n.qy`<ul role="group">
        ${(c[0]??[]).map((e,t)=>this._renderChild(e,d,0,t,a,r,l))}
        ${this._renderAddChild(d,0,this._moduleName(e),a)}
      </ul>`;const u="tabs"===e.type,p=u?[]:y(b(e));return n.qy`<ul role="group">
      ${c.map((c,m)=>{const g=(0,C.r$)(t,i,o,s,m),f=(0,C.iA)(g),v=this._itemAttrs(f,r,l),b=this._state?(0,C.R9)(this._state.config,g):void 0,y=(u?void 0:(0,C.Hn)(b))??(0,W.D)(e,m),_=u?e.tabs?.[m]?.icon||"mdi:tab":"",w=c.length,$=this._menuOpenFor(g),x=this._renaming===f;return n.qy`
          <li role="none" class="col slot ${this._zoneClass(this._dropZone(f))}"
            @dragover=${e=>this._onItemDragOver(e,g)}
            @drop=${this._dropModule}
          >
            <div class="line mod-line k-column" role="treeitem" aria-level=${a} data-key=${f} data-hidden=${(0,C.Ak)(b)?"":n.s6} tabindex=${v.tab} aria-labelledby=${`i-${f}`}
              aria-selected=${v.current?"true":"false"} aria-current=${v.current?"true":n.s6}
              @click=${this._onItemClick} @dblclick=${e=>this._rename(e,f)}>
              <div
                class="item col-item slot-item k-column"
                id=${`i-${f}`}
                data-hidden=${(0,C.Ak)(b)?"":n.s6}
                data-current=${v.current?"":n.s6}
              >
                ${u?n.qy`<ha-icon icon=${_}></ha-icon>`:n.s6}
                ${x?this._renderRename(g,u?(0,h.t)(1026):(0,h.t)(215)):n.qy`<span class="text"><span class="name">${y}</span>${u?n.s6:this._containerEntity(b??{},{row:d.row,col:d.col,module:d.module,child:d.child,slot:m})}</span>`}
                ${this._hiddenMark(b)}
                ${u?n.s6:n.qy`<span class="slot-glyph">${wt(p,m)}</span>`}
                <span class="chip is-count">${w}<span class="sr-only"> ${(0,h.t)(1280,{n:w})}</span></span>
                ${po(uo(c))}
              </div>
              <button
                type="button"
                class="icon-btn sm more"
                tabindex=${v.tab}
                aria-label=${(0,h.t)(1287,{name:y})}
                aria-haspopup="menu"
                aria-expanded=${$?"true":"false"}
                @click=${e=>this._openMenuFor(g,e)}
              >
                <ha-icon icon="mdi:dots-vertical"></ha-icon>
              </button>
            </div>
            <ul role="group">
              ${c.map((e,t)=>this._renderChild(e,d,m,t,a+1,r,l))}
              ${this._renderAddChild(d,m,`${this._moduleName(e)} ${y}`,a+1)}
            </ul>
          </li>
        `})}
      <li role="treeitem" aria-level=${a} class="add-col">
        <button type="button" class="btn btn-text btn-sm" aria-label=${u?(0,h.t)(53,{name:this._moduleName(e)}):(0,h.t)(39,{name:this._moduleName(e)})}
          @click=${()=>this._addSlot(d,e.type)}>
          <ha-icon icon="mdi:plus"></ha-icon>${u?(0,h.t)(52):(0,h.t)(37)}
        </button>
      </li>
    </ul>`}_containerEntity(e,t){const i=this._state?.config;if(!i)return n.s6;if("none"===so(i,t).choice)return n.qy`<span class="sub">${(0,h.t)(637)}</span>`;const o="string"==typeof e.entity&&C.Y.test(e.entity)?e.entity:void 0;return o?n.qy`<span class="sub is-entity">${!0===e.share_entity?n.qy`<ha-icon icon="mdi:link-variant" aria-hidden="true"></ha-icon><span class="sr-only">${(0,h.t)(917)} </span>`:n.s6}${(0,C.rb)(o)}</span>`:n.s6}_renderChild(e,t,i,o,s,a,r){const l=[...t.child??[],{slot:i,index:o}],c=(0,C.br)(t.row,t.col,t.module,l),d=(0,C.iA)(c),u=this._itemAttrs(d,a,r),p=k.s.get(e.type)?.metadata.icon||"mdi:puzzle-outline",m=ft(e),g="string"==typeof e.entity&&C.Y.test(e.entity)?e.entity:void 0,f=g?n.s6:this._followedEntity(e,c);return n.qy`
      <li role="none" class="mod child ${this._zoneClass(this._dropZone(d))}"
        @dragover=${e=>this._onItemDragOver(e,c)}
        @drop=${this._dropModule}
      >
        <div class="line mod-line k-module" role="treeitem" aria-level=${s} data-key=${d} data-hidden=${(0,C.Ak)(e)?"":n.s6} tabindex=${u.tab} aria-labelledby=${`i-${d}`}
          aria-selected=${u.current?"true":"false"} aria-current=${u.current?"true":n.s6}
          draggable=${this._renaming===d?"false":"true"} @dragstart=${e=>this._onModuleDragStart(e,c)} @dragend=${this._onDragEnd}
          title=${"layers"===this.variant?`${m}${g?` · ${g}`:""}`:n.s6}
          @click=${this._onItemClick} @dblclick=${e=>this._rename(e,d)}>
          <div
            class="item mod-item k-module"
            id=${`i-${d}`}
            data-hidden=${(0,C.Ak)(e)?"":n.s6}
            data-current=${u.current?"":n.s6}
          >
            <ha-icon icon=${p}></ha-icon>
            ${this._renaming===d?this._renderRename(c,(0,h.t)(595)):n.qy`<span class="text">
                  <span class="name">${m}</span>
                  ${g?n.qy`<span class="sub is-entity">${"layers"===this.variant?g:(0,C.rb)(g)}</span>`:f}
                </span>`}
            ${ho(e)}
            ${po(uo((0,M.yZ)(e)?.flat()))}
            ${this._hiddenMark(e)}
          </div>
          ${this._renderModuleMore(e,c,u.tab)}
        </div>
        ${this._renderChildren(e,t.row,t.col,t.module,l,s+1,a,r)}
      </li>
    `}_renderAddChild(e,t,i,o){return n.qy`
      <li role="treeitem" aria-level=${o} class="add-mod">
        <button type="button" class="btn btn-text btn-sm" aria-label=${(0,h.t)(47,{where:i})} @click=${()=>this._addChild(e,t)}>
          <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(45)}
        </button>
      </li>
    `}_moduleName(e){return ft(e)}_renderModuleMore(e,t,i){const o=this._menuOpenFor(t);return n.qy`
      <button
        type="button"
        class="icon-btn sm more"
        tabindex=${i}
        aria-label=${(0,h.t)(598,{name:this._moduleName(e)})}
        aria-haspopup="menu"
        aria-expanded=${o?"true":"false"}
        @click=${e=>this._openMenuFor(t,e)}
      >
        <ha-icon icon="mdi:dots-vertical"></ha-icon>
      </button>
    `}};vo.styles=[l.x,yt,mo,n.AH`
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
        padding-inline-start: 12px;
        margin-inline-start: 12px;
        border-inline-start: 1px solid var(--mc-divider);
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
        padding-inline-start: 8px;
        margin-inline-start: 18px;
      }
      .sub .mono {
        font-family: var(--mc-mono);
      }
      :host([variant='pane']) .mod-item {
        padding: 6px 12px;
      }
      .card-item {
        margin-inline-start: 26px;
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
      :host([dir='rtl']) .caret[aria-expanded='false'] ha-icon {
        transform: rotate(90deg);
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
        left: 0; /* physical */
        right: 0; /* physical */
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
        padding-inline-start: 4px;
        margin-inline-start: 12px;
      }

      /* Narrow pane (phone dialog): reclaim indentation so entity ids keep their width. */
      @container mc-outline (max-width: 419px) {
        .row > ul {
          padding-inline-start: 0;
          margin-inline-start: 26px;
          border-inline-start: 0;
        }
        .col > ul {
          padding-inline-start: 6px;
          margin-inline-start: 6px;
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
    `],go([(0,o.MZ)({attribute:!1})],vo.prototype,"stateManager",void 0),go([(0,o.MZ)({reflect:!0})],vo.prototype,"variant",void 0),go([(0,o.wk)()],vo.prototype,"_state",void 0),go([(0,o.wk)()],vo.prototype,"_collapsed",void 0),go([(0,o.wk)()],vo.prototype,"_focusKey",void 0),go([(0,o.wk)()],vo.prototype,"_renaming",void 0),go([(0,o.wk)()],vo.prototype,"_drop",void 0),vo=go([(0,o.EM)("mc-structure-outline")],vo);var bo=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let yo=class extends n.WF{constructor(){super(...arguments),this.compact=!1,this.disabled=!1,this._menuOpen=!1,this._menu=new Xe(this,{menu:()=>this.shadowRoot?.querySelector(".menu"),onClose:()=>{this._menuOpen=!1},align:"start"}),this._toggleMenu=e=>{this._menuOpen=!0,this._menu.open(e.currentTarget)}}_fire(e){this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0}))}_closeMenu(e){this._menu.close(e)}_act(e){this._closeMenu(!0),this._fire(e)}render(){const e=this.config?.template;if(!e)return n.qy`
        <div class="tpl-bar">
          <div class="tpl-text">
            ${this.compact?n.s6:n.qy`<span class="tpl-label">${(0,h.t)(666)}</span>`}
            <button
              type="button"
              class="chip manage"
              aria-haspopup="menu"
              ?disabled=${this.disabled}
              aria-expanded=${this._menuOpen?"true":"false"}
              @click=${this._toggleMenu}
            >
              <ha-icon icon="mdi:link-variant-off"></ha-icon>${(0,h.t)(657)}<ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
          </div>
          ${this._menuOpen?n.qy`
                <div class="menu" role="menu" aria-label=${(0,h.t)(1035)} @keydown=${this._menu.onKeydown}>
                  <button type="button" role="menuitem" @click=${()=>this._act("template-load")}>
                    <ha-icon icon="mdi:folder-open-outline"></ha-icon>${(0,h.t)(536)}
                  </button>
                  <button type="button" role="menuitem" @click=${()=>this._act("template-create")}>
                    <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(253)}
                  </button>
                </div>
              `:n.s6}
        </div>
      `;const t=this.config?fe(this.config):[],i=t.reduce((e,t)=>e+t.paths.length,0),o=(0,h.t)(1272,{n:i});return n.qy`
      <div class="tpl-bar linked">
        <div class="tpl-text">
          ${this.compact?n.s6:n.qy`<span class="tpl-label">${(0,h.t)(1034)}</span>`}
          <span class="chips">
            <button
              type="button"
              class="chip is-accent manage"
              title=${(0,h.t)(1035)}
              aria-haspopup="menu"
              ?disabled=${this.disabled}
              aria-expanded=${this._menuOpen?"true":"false"}
              @click=${this._toggleMenu}
            >
              <ha-icon icon="mdi:link-variant"></ha-icon><span class="nm">${e}</span><ha-icon icon="mdi:chevron-down"></ha-icon>
            </button>
            ${i>0?n.qy`<span class="chip is-warn">${o}</span>`:n.qy`<span class="chip">${(0,h.t)(488)}</span>`}
          </span>
        </div>
        ${!this.compact&&i>0?n.qy`
              <div class="tpl-actions">
                <button type="button" class="btn btn-text btn-sm" @click=${()=>this._fire("template-resync")}>
                  <ha-icon icon="mdi:sync"></ha-icon>${(0,h.t)(790,{overrides:o})}
                </button>
              </div>
            `:n.s6}
        ${this._menuOpen?this._renderMenu(e,t,i):n.s6}
      </div>
    `}_renderMenu(e,t,i){return n.qy`
      <div class="menu" role="menu" aria-label=${(0,h.t)(1035)} @keydown=${this._menu.onKeydown}>
        <p class="menu-note">
          ${(0,h.tx)(527,{name:n.qy`<span class="mono">${e}</span>`})}
          ${i?(0,h.t)(1268,{n:i}):(0,h.t)(410)}
        </p>
        ${t.length?n.qy`
              <ul class="ovr">
                ${t.map(e=>n.qy`<li><span class="loc">${e.location}</span><span class="paths mono">${e.paths.map(e=>e.replace("design.","")).join(", ")}</span></li>`)}
              </ul>
            `:n.s6}
        <button type="button" role="menuitem" ?disabled=${0===i} @click=${()=>this._act("template-resync")}>
          <ha-icon icon="mdi:sync"></ha-icon>${(0,h.t)(790,{overrides:(0,h.t)(1272,{n:i})})}
        </button>
        <button type="button" role="menuitem" @click=${()=>this._act("template-save")}>
          <ha-icon icon="mdi:content-save-outline"></ha-icon>${(0,h.t)(868)}
        </button>
        <hr />
        <button type="button" role="menuitem" class="danger" @click=${()=>this._act("template-unlink")}>
          <ha-icon icon="mdi:link-variant-off"></ha-icon>${(0,h.t)(1124)}
        </button>
      </div>
    `}};yo.styles=[l.x,n.AH`
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
        margin-inline-start: auto;
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
        inset-inline: 0 auto;
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
        margin-inline-start: 0;
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
    `],bo([(0,o.MZ)({attribute:!1})],yo.prototype,"config",void 0),bo([(0,o.MZ)({attribute:!1})],yo.prototype,"hass",void 0),bo([(0,o.MZ)({type:Boolean,reflect:!0})],yo.prototype,"compact",void 0),bo([(0,o.MZ)({type:Boolean,reflect:!0})],yo.prototype,"disabled",void 0),bo([(0,o.wk)()],yo.prototype,"_menuOpen",void 0),yo=bo([(0,o.EM)("mc-template-bar")],yo);const _o={clock:{name:109,description:148,category:"advanced",icon:"mdi:clock-outline"},image:{name:251,description:146,category:"content",icon:"mdi:image-outline"},"custom-card":{name:130,description:179,category:"advanced",icon:"mdi:card-plus-outline"},forecast:{name:214,description:153,category:"advanced",icon:"mdi:calendar-week-outline"},"video-bg":{name:540,description:541,category:"advanced",icon:"mdi:video-outline"},weather:{name:549,description:152,category:"advanced",icon:"mdi:weather-partly-cloudy"},camera:{name:100,description:144,category:"content",icon:"mdi:camera-outline"},graphs:{name:227,description:149,category:"content",icon:"mdi:chart-line"},markdown:{name:301,description:381,category:"content",icon:"mdi:language-markdown"},dropdown:{name:165,description:413,category:"controls",icon:"mdi:form-dropdown"},gauge:{name:218,description:29,category:"controls",icon:"mdi:speedometer"},light:{name:280,description:282,category:"controls",icon:"mdi:lightbulb-outline"},slider:{name:431,description:378,category:"controls",icon:"mdi:tune-vertical"},spinbox:{name:448,description:324,category:"controls",icon:"mdi:numeric"},"slider-layout":{name:432,description:33,category:"layout",icon:"mdi:view-carousel-outline"},tabs:{name:501,description:499,category:"layout",icon:"mdi:tab"}};for(const e of Object.keys(_o)){const t=k.s.get(e);t&&Object.assign(t.metadata,_o[e])}const wo=[{label:1001,value:"state"},{label:618,value:"name"},{label:619,value:"name_state"}],$o=[...wo,{label:794,value:"remaining"}],xo={type:"text",entityField:!0,general(e,t,i,o,s){const a=e,r=Zn(a,s),l=Nn(e,o);return n.qy`
      <div class="mc-tab-content">
        ${a.use_entity?n.s6:n.qy`
              ${(0,kt.Gz)((0,h.t)(1039),a.text,e=>i({...a,text:e}),"text",l)}
              ${(0,kt.vm)((0,h.t)(1153),a.use_template,e=>i({...a,use_template:e}),"use_template",l)}
              ${a.use_template?(0,kt.m1)((0,h.t)(1135,{example:"{{ states(entity) }}, {{ states(card_entity) }}"})):n.s6}
            `}
        ${(0,kt.vm)((0,h.t)(1144),a.use_entity,e=>i({...a,use_entity:e}),"use_entity",l,(0,h.t)(966))}
        ${a.use_template&&!a.use_entity?Ot((0,h.t)(357),a,i,t,s,{syncCtx:l}):n.s6}
        ${a.use_entity?n.qy`
              ${Ot((0,h.t)(357),a,i,t,s,{syncCtx:l})}
              ${(0,kt.FQ)((0,h.t)(105),a.attribute,e=>i({...a,attribute:e||void 0}),t,r,"attribute",l,Et(s))}
              ${(0,kt.Wn)((0,h.t)(307),a.entity_display,(0,h.tl)((0,Oi._7)(r)||"remaining"===a.entity_display?$o:wo),e=>i({...a,entity_display:e}),"entity_display",l)}
            `:n.s6}
      </div>
    `}};var ko=i(5369),Co=i(3231),Mo=i(3585),So=i(8546),Ao=i(5239),qo=i(1079),Eo=i(3386),jo=i(4951),To=i(7104),zo=(i(6983),function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a});const Lo=[{value:"up",label:1126},{value:"down",label:315},{value:"left",label:516},{value:"right",label:838}],Oo=[{value:"solid",label:982},{value:"duotone",label:322},{value:"gradient",label:427},{value:"value",label:1161}];function Ro(e){const t={};for(const[i,n]of Object.entries(e))void 0===n||""===n||"number"==typeof n&&Number.isNaN(n)||(t[i]=n);return Object.keys(t).length?t:void 0}let Po=class extends n.WF{constructor(){super(...arguments),this.entity="",this.icon="",this.moduleIcon="",this.iconOn="",this.iconOff="",this.svg="",this.allowSvg=!1,this.allowStateIcons=!1,this._open=!1,this._svgAlert=!1,this._noShape=!1,this._svgOn=!1,this._editorState="",this._shapeFor=""}get _fx(){return this.fx&&"object"==typeof this.fx?this.fx:{}}get _fill(){const e=this._fx.fill;return e&&"object"==typeof e?e:void 0}get _colors(){const e=this._fx.colors;return e&&"object"==typeof e?e:{}}get _isSvg(){return"svg"===this.icon}get _hasAccent(){return this._isSvg||/^mcu:/.test(this.icon)}get _stateObj(){return this.entity?this.hass?.states?.[this.entity]:void 0}_setFx(e){const t=Ro({...this._fx,...e});"off"===t?.device&&delete t.device,!t||t.draw&&"off"!==t.draw||(delete t.draw,delete t.draw_duration),!1===t?.morph&&delete t.morph,this.onChange?.({icon_fx:t&&Object.keys(t).length?t:void 0})}_setFill(e){this._setFx({fill:Ro({...this._fill??{},...e})??{}})}_setColors(e){const t=Ro({...this._colors,...e});"solid"===t?.style&&delete t.style,t&&"gradient"!==t.style&&"value"!==t.style&&delete t.gradient,t&&"gradient"!==t.style&&delete t.angle,t&&"duotone"!==t.style&&!this._hasAccent&&delete t.secondary,this._setFx({colors:t&&Object.keys(t).length?t:void 0})}_resetAll(){this.onChange?.({icon_fx:void 0})}willUpdate(e){e.has("moduleIcon")&&void 0!==e.get("moduleIcon")&&"svg"!==this.moduleIcon&&(this._svgOn=!1),e.has("svg")&&void 0!==e.get("svg")&&void 0!==this._svgDraft&&this.svg!==this._svgDraft&&(this._svgDraft=void 0,this._svgError=void 0)}async _openEditor(e){if("loading"===this._editorState)return;const t=this.moduleCfg??{icon:this.moduleIcon||void 0,svg:this.svg||void 0,icon_on:this.iconOn||void 0,icon_off:this.iconOff||void 0},i=(0,_i.d)(this)?.getConfig(),n="draw"===e?{kind:"blank"}:"customise"===e?{kind:"icon",icon:this.moduleIcon}:(0,To.lm)(t,i,"ok"===(await(0,g.fZ)(this.hass)).state)??{kind:"blank"};this._editorState="loading";const o=await(0,To.$d)({from:this,hass:this.hass,module:t,linked:!!this.syncCtx&&(0,jo.rJ)(this.syncCtx),source:n,apply:e=>this.onChange?.(e)});this._editorState="failed"===o?"failed":""}_renderIconEditor(){const e=this.moduleIcon,t="svg"===e||e.startsWith("mcu:")?"edit":e.includes(":")?"customise":"draw",i={edit:(0,h.t)(334),customise:(0,h.t)(265),draw:(0,h.t)(317)}[t],o="loading"===this._editorState,s=e.slice(0,e.indexOf(":"));return n.qy`
      <div class="icon-editor">
        <div class="svg-actions">
          <button type="button" class="btn btn-secondary btn-sm" data-focus-key="icon-entry" aria-busy=${o?"true":"false"} @click=${()=>{this._openEditor(t)}}>
            <ha-icon icon="mdi:pencil-ruler"></ha-icon>${i}${o?n.qy`<span class="sr-only"> ${(0,h.t)(537)}</span>`:n.s6}
          </button>
        </div>
        ${"customise"===t?n.qy`<p class="help">${(0,h.t)(559,{pack:"mdi"===s?(0,h.t)(573):s})}</p>`:n.s6}
        ${"failed"===this._editorState?n.qy`<p class="help error" role="alert">${(0,h.t)(1054)}</p>`:n.s6}
        ${this._savedMissing()?n.qy`<p class="help warn" role="status">${(0,h.t)(871,{name:e.slice(4)})}</p>`:n.s6}
      </div>
    `}_savedMissing(){const e=this.moduleIcon;if(!e.startsWith("mcu:")||!this._saved)return!1;const t=e.slice(4);return!((0,_i.d)(this)?.getConfig().custom_icons?.[t]||"ok"===this._saved.state&&this._saved.items.some(e=>e.id===t))}updated(){this.moduleIcon.startsWith("mcu:")&&this.hass&&this._savedFor!==this.hass&&(this._savedFor=this.hass,(0,g.fZ)(this.hass).then(e=>this._saved=e));const e=(0,Co.K)(this._fx)&&this.icon&&!this._isSvg&&this.icon.includes(":")?this.icon:"";e!==this._shapeFor&&(this._shapeFor=e,this._unlisten?.(),this._unlisten=void 0,this._noShape=!1,e&&(this._unlisten=(0,So.Si)().onIconGeometry(e,()=>{this._shapeFor===e&&(this._noShape=!1)}),(0,So.Si)().resolveIconGeometry(e).then(t=>{this._shapeFor===e&&(this._noShape=!t)})))}disconnectedCallback(){super.disconnectedCallback(),this._unlisten?.(),this._unlisten=void 0,this._shapeFor=""}_sync(e){const t=this.syncCtx;return t&&(0,jo.rJ)(t)?n.qy`<mc-sync-indicator
      .synced=${!(0,jo.gJ)(t,e)}
      .hasTemplate=${!0}
      .hideIfNoTemplate=${!0}
      .propertyPath=${(0,jo.dy)(t,e)}
      @sync-toggle=${e=>{e.stopPropagation(),this.dispatchEvent(new CustomEvent("field-sync-toggle",{detail:{propertyPath:e.detail.propertyPath,synced:e.detail.synced},bubbles:!0,composed:!0}))}}
    ></mc-sync-indicator>`:n.s6}_field(e,t,i,o,s,a){return n.qy`
      <div class="field">
        <div class="field-head">
          ${s?n.qy`<label for=${s}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}
          ${i?(0,Jt.i)(e,t,i):n.s6}${a?this._sync(a):n.s6}
        </div>
        ${o}
      </div>
    `}_switch(e,t,i,o){const s=`fx-sw-${e.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`;return n.qy`<div class="switch-row">
      <div class="txt">
        <div class="field-head"><label for=${s}>${e}</label></div>
        ${o?n.qy`<p class="help" id="${s}-help">${o}</p>`:n.s6}
      </div>
      <button
        type="button"
        class="switch"
        id=${s}
        role="switch"
        aria-checked=${t?"true":"false"}
        aria-label=${e}
        aria-describedby=${o?`${s}-help`:n.s6}
        @click=${i}
      ></button>
    </div>`}_seg(e,t,i,o){return n.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=e.currentTarget,s=(0,xt.n)(e.key,i.findIndex(e=>e.value===t),i.map(()=>({})),"both",!0,"rtl"===(0,Ge.k)(n));if(s<0||"Home"===e.key||"End"===e.key)return;e.preventDefault();const a=i[s].value;o(a),requestAnimationFrame(()=>n.querySelector(`[data-val="${a}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return n.qy`<button type="button" role="radio" data-val=${e.value} aria-checked=${i?"true":"false"} tabindex=${i?"0":"-1"} @click=${()=>o(e.value)}>${(0,h.t)(e.label)}</button>`})}
    </div>`}_select(e,t,i,o,s){return n.qy`<div class="select">
      <select class="input" id=${e} aria-describedby=${s||n.s6} @change=${e=>o(e.target.value)}>
        ${i.map(e=>n.qy`<option value=${e.value} ?selected=${e.value===t}>${(0,h.t)(e.label)}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`}_number(e,t,i,o,s,a,r="any"){return n.qy`<input
      class="input"
      id=${e}
      type="number"
      min=${s??n.s6}
      max=${a??n.s6}
      step=${r}
      placeholder=${String(i)}
      .value=${void 0===t?"":String(t)}
      @input=${e=>{const t=e.target.value,i=Number(t);""!==t.trim()&&Number.isFinite(i)&&o(i)}}
      @change=${e=>{const t=e.target;""!==t.value.trim()||t.validity?.badInput||o(void 0)}}
    />`}_color(e,t,i,o){const s=!!this.entity;return n.qy`<mc-color-picker
      data-key=${e}
      .value=${i||""}
      .label=${t}
      .allowEntity=${s}
      .entityColor=${s?(0,oi.id)(this._stateObj)??"currentColor":""}
      @value-changed=${e=>o(e.detail.value||void 0)}
    ></mc-color-picker>`}_applySvg(e,t=!1){const i=e.trim()?function(e){const t=function(e){const t=[];return/<\s*script/i.test(e)&&t.push((0,h.t)(1212)),/\son[a-z]+\s*=/i.test(e)&&t.push((0,h.t)(1226)),/javascript:|vbscript:/i.test(e)&&t.push((0,h.t)(1209)),/<\s*foreignObject/i.test(e)&&t.push("foreignObject"),(/<\s*(?:iframe|embed|object)\b/i.test(e)||/href\s*=\s*(?!["']?\s*#)/i.test(e))&&t.push((0,h.t)(1227)),(/url\(\s*(?!["']?\s*#)/i.test(e)||/@import|data:/i.test(e))&&t.push((0,h.t)(1227)),[...new Set(t)]}(e);if(t.length){const e=t.length>1?(0,h.t)(1258,{list:t.slice(0,-1).join(", "),last:t[t.length-1]}):t[0];return(0,h.t)(1249,{count:t.length,list:e})}return/<\s*(?:use|image)\b/i.test(e)?(0,h.t)(11):(0,qo.OW)(e).error}(e):t?qo.wv:void 0;return i&&t?(this._svgError=i,void(this._svgAlert=!0)):(this._svgDraft=e,this._svgAlert=t,e.trim()?(this._svgError=i,void(i||(this._isSvg?this.onChange?.({svg:e}):this.onChange?.({icon:"svg",svg:e})))):(this._svgError=void 0,void this.onChange?.({svg:void 0})))}_toggleSvg(){if(this._svgDraft=void 0,this._svgError=void 0,this._isSvg){const e=this._prevIcon;this._prevIcon=void 0,this._svgOn=!1,this.onChange?.({icon:e||void 0,svg:void 0})}else this._svgOn?this._svgOn=!1:(this._prevIcon=this.moduleIcon,this._svgOn=!0)}async _upload(e){const t=e.target,i=t.files?.[0];if(!i)return;const n=await(0,Eo.TA)(i,Ao.Ie);n.ok?this._applySvg(n.text,!0):(this._svgError="too_large"===n.code?(0,h.t)(1042):qo.wv,this._svgAlert=!0);try{t.value=""}catch{}}_renderSvg(){if(!this.allowSvg)return n.s6;const e=this._isSvg||this._svgOn,t=this._svgDraft??(this._isSvg?this.svg:"")??"",i=this._svgError?void 0:function(e){if(/<\s*style\b/i.test(e)||/\sstyle\s*=/i.test(e))return(0,h.t)(1018)}(t);return n.qy`
      ${this._renderIconEditor()}
      ${this._switch((0,h.t)(257),e,()=>this._toggleSvg(),e?void 0:(0,h.t)(319))}
      ${e?n.qy`${this._field((0,h.t)(860),!!this.svg,()=>{this._svgDraft=void 0,this._svgError=void 0,this.onChange?.({svg:void 0})},n.qy`<textarea
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
                ${this._svgError?n.qy`<p class="help error" id="fx-svg-error" role=${this._svgAlert?"alert":n.s6}>${this._svgError}</p>`:n.qy`<p class="help" id="fx-svg-help">
                      ${(0,h.t)(1128)}
                    </p>`}
                ${i?n.qy`<p class="help warn" id="fx-svg-warning">${i}</p>`:n.s6}
              </div>
              <div class="svg-actions">
                <input type="file" accept=".svg,image/svg+xml" id="fx-svg-file" @change=${e=>{this._upload(e)}} />
                <button type="button" class="btn btn-secondary btn-sm" @click=${()=>this.renderRoot.querySelector("#fx-svg-file")?.click()}>
                  <ha-icon icon="mdi:upload"></ha-icon>${(0,h.t)(1132)}
                </button>
              </div>`,"fx-svg","svg")}`:n.s6}
    `}_renderFill(){const e=this._fill,t=!!e,i=e?.entity||this.entity,o=i?Object.keys(this.hass?.states?.[i]?.attributes||{}):[],s=e?function(e){if("number"==typeof e&&Number.isFinite(e))return e>1?e:100*e;if("string"==typeof e&&/^\s*\d*\.?\d+\s*%?\s*$/.test(e)){const t=parseFloat(e);return/%/.test(e)||t>1?t:100*t}}(e.empty_color):void 0,a=!!e?.empty_color&&void 0===s;return n.qy`
      ${this._switch((0,h.t)(529),t,()=>this._setFx({fill:t?void 0:{}}),(0,h.t)(387))}
      ${t?n.qy`
            ${this._field((0,h.t)(357),!!e.entity,()=>this._setFill({entity:void 0,attribute:void 0}),n.qy`<mc-entity-picker
                .hass=${this.hass}
                .value=${e.entity||""}
                .label=${this.entity?(0,h.t)(594,{entity:this.entity}):(0,h.t)(357)}
                @value-changed=${e=>this._setFill({entity:e.detail.value||void 0,attribute:void 0})}
              ></mc-entity-picker>`)}
            ${i?e.entity?n.s6:n.qy`<p class="help">${(0,h.t)(351,{entity:this.entity})}</p>`:n.qy`<p class="help">${(0,h.t)(739)}</p>`}
            ${o.length?this._field((0,h.t)(105),!!e.attribute,()=>this._setFill({attribute:void 0}),n.qy`<mc-attribute-picker
                    .hass=${this.hass}
                    .entityId=${i}
                    .value=${e.attribute||""}
                    @value-changed=${e=>this._setFill({attribute:e.detail.value||void 0})}
                  ></mc-attribute-picker>`):n.s6}
            <div class="two">
              ${this._field((0,h.t)(586),void 0!==e.min,()=>this._setFill({min:void 0}),this._number("fx-fill-min",e.min,ii._T.min,e=>this._setFill({min:e})),"fx-fill-min")}
              ${this._field((0,h.t)(575),void 0!==e.max,()=>this._setFill({max:void 0}),this._number("fx-fill-max",e.max,ii._T.max,e=>this._setFill({max:e})),"fx-fill-max")}
            </div>
            ${this._field((0,h.t)(205),!!e.color,()=>this._setFill({color:void 0}),this._color("fill-color",(0,h.t)(382),e.color,e=>this._setFill({color:e})))}
            ${this._field((0,h.t)(347),void 0!==e.empty_color,()=>this._setFill({empty_color:void 0}),n.qy`${this._number("fx-fill-empty",s,100*ii._T.emptyOpacity,e=>this._setFill({empty_color:void 0===e?void 0:`${Math.min(100,Math.max(0,e))}%`}),0,100,5)}
                ${a?n.qy`<p class="help">${(0,h.t)(1052,{colour:String(e.empty_color)})}</p>`:n.s6}`,"fx-fill-empty")}
            ${this._switch((0,h.t)(1174),!1!==e.wave,()=>this._setFill({wave:!1===e.wave&&void 0}))}
            ${this._field((0,h.t)(305),!!e.direction,()=>this._setFill({direction:void 0}),this._seg((0,h.t)(305),e.direction??"up",Lo,e=>this._setFill({direction:"up"===e?void 0:e})))}
          `:n.s6}
    `}_deviceHelp(e){if("auto"!==e)return"off"===e?(0,h.t)(86):(0,h.t)(733);if(!this.entity)return(0,h.t)(738);const t=(0,Mo.k8)(this._stateObj,this.entity);if(!t)return(0,h.t)(112);const i=(0,Mo.bb)(this._stateObj);return(0,h.t)(111,{rule:(0,Qt.t)(t)})+(i?` ${(0,h.t)(675,{device:(0,h.t)(Xt[i.anim])})}`:"")}_renderDevice(){const e="string"==typeof this._fx.device?this._fx.device:"off";return this._field((0,h.t)(302),"off"!==e,()=>this._setFx({device:void 0}),n.qy`${this._select("fx-device",e,this.entity||"auto"===e?ei:ei.filter(e=>"auto"!==e.value),e=>this._setFx({device:e}),"fx-device-help")}
        <p class="help" id="fx-device-help">${this._deviceHelp(e)}</p>`,"fx-device")}_renderDraw(){const e=this._fx.draw??"off";return n.qy`
      ${this._field((0,h.t)(523),"off"!==e,()=>this._setFx({draw:void 0}),this._select("fx-draw",e,ti,e=>this._setFx({draw:e})),"fx-draw")}
      ${"off"!==e?this._field((0,h.t)(318),!!this._fx.draw_duration,()=>this._setFx({draw_duration:void 0}),n.qy`<mc-unit-field
              .value=${this._fx.draw_duration||""}
              .label=${(0,h.t)(318)}
              .units=${["s","ms"]}
              .placeholder=${String(ii._T.drawDuration)}
              @value-changed=${e=>this._setFx({draw_duration:e.detail.value||void 0})}
            ></mc-unit-field>`):n.s6}
    `}_renderStateIcons(){if(!this.allowStateIcons)return n.s6;const e=(e,t,i)=>this._field(e,!!i,()=>this.onChange?.({[t]:void 0}),n.qy`<mc-icon-picker
          data-key=${t}
          .hass=${this.hass}
          .label=${e}
          .value=${i||""}
          @value-changed=${e=>this.onChange?.({[t]:e.detail.value||void 0})}
        ></mc-icon-picker>`,void 0,t);return n.qy`<div class="state-icons" role="group" aria-label=${(0,h.t)(1004)} aria-describedby="fx-state-help">
      <div class="two">${e((0,h.t)(477),"icon_on",this.iconOn)} ${e((0,h.t)(476),"icon_off",this.iconOff)}</div>
      <p class="help" id="fx-state-help">${(0,h.t)(1005)}</p>
    </div>`}_renderMorph(){if(!this.allowStateIcons)return n.s6;const e=!0===this._fx.morph;return n.qy`
      ${this._switch((0,h.t)(602),e,()=>this._setFx({morph:!e||void 0}),(0,h.t)(603))}
      ${!e||this.iconOn||this.iconOff?n.s6:n.qy`<p class="help">${(0,h.t)(749)}</p>`}
    `}_renderColors(){const e=this._colors,t=e.style??"solid",i=Array.isArray(e.gradient)&&e.gradient.length?e.gradient:[...ii._T.stops],o=ii._T.stops,s=e=>this._setColors({gradient:e.length===o.length&&e.every((e,t)=>e===o[t])?void 0:e});return n.qy`
      ${this._field((0,h.t)(210),!!e.style,()=>this._setColors({style:void 0}),this._seg((0,h.t)(210),t,Oo,e=>this._setColors({style:e})))}
      ${"gradient"===t||"value"===t?n.s6:this._field("solid"===t?(0,h.t)(205):(0,h.t)(781),!!e.primary,()=>this._setColors({primary:void 0}),this._color("primary",(0,h.t)(781),e.primary,e=>this._setColors({primary:e})))}
      ${"duotone"===t?this._field((0,h.t)(886),!!e.secondary,()=>this._setColors({secondary:void 0}),n.qy`${this._color("secondary",(0,h.t)(886),e.secondary,e=>this._setColors({secondary:e}))}
              <p class="help">${(0,h.t)(352,{pct:ii._T.secondaryPct})}</p>`):this._hasAccent?this._field((0,h.t)(22),!!e.secondary,()=>this._setColors({secondary:void 0}),n.qy`${this._color("secondary",(0,h.t)(22),e.secondary,e=>this._setColors({secondary:e}))}
                <p class="help">${this._isSvg?(0,h.t)(723):(0,h.t)(724)}</p>`):n.s6}
      ${"gradient"===t||"value"===t?n.qy`
            ${this._field((0,h.t)(428),Array.isArray(e.gradient)&&e.gradient.length>0,()=>this._setColors({gradient:void 0}),n.qy`<div class="stops">
                ${i.map((e,t)=>n.qy`<div class="stop">
                    ${this._color(`stop-${t}`,(0,h.t)(211,{n:t+1}),e,e=>((e,t)=>s(t?i.map((i,n)=>n===e?t:i):i.length>2?i.filter((t,i)=>i!==e):i.map((t,i)=>i===e?o[i]??o[o.length-1]:t)))(t,e))}
                    ${i.length>2?n.qy`<button type="button" class="icon-btn sm danger" aria-label=${(0,h.t)(796,{n:t+1})} title=${(0,h.t)(795)} @click=${()=>s(i.filter((e,i)=>i!==t))}>
                          <ha-icon icon="mdi:delete-outline"></ha-icon>
                        </button>`:n.s6}
                  </div>`)}
                <div><button type="button" class="btn btn-text btn-sm" @click=${()=>s([...i,i[i.length-1]])}><ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(36)}</button></div>
              </div>
              ${"value"===t?n.qy`<p class="help">${(0,h.t)(1050)}</p>`:n.s6}`)}
            ${"gradient"===t?this._field((0,h.t)(77),void 0!==e.angle,()=>this._setColors({angle:void 0}),this._number("fx-angle",e.angle,ii._T.angle,e=>this._setColors({angle:e}),0,360,15),"fx-angle"):n.s6}
          `:n.s6}
    `}_count(){const e=this._fx;let t=0;return this._fill&&t++,e.device&&"off"!==e.device&&t++,e.draw&&"off"!==e.draw&&t++,!0===e.morph&&t++,Object.keys(this._colors).length&&t++,t}render(){const e=this._count();return n.qy`
      ${this._renderSvg()} ${this._renderStateIcons()}
      <div class="sectors">
        <div class="sector">
          <div class="sector-head">
            <button type="button" class="sector-btn" aria-expanded=${this._open?"true":"false"} aria-controls=${this._open?"fx-body":n.s6} @click=${()=>this._open=!this._open}>
              <ha-icon icon="mdi:creation-outline"></ha-icon>
              <span class="nm">${(0,h.t)(469)}</span>
              ${e>0?n.qy`<span class="chip is-count">${(0,h.t)(1302,{n:e})}</span>`:n.s6}
              <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
            </button>
            ${this._sync("icon_fx")}
          </div>
          ${this._open?n.qy`<div class="sector-body" id="fx-body">
                ${e>0?n.qy`<div class="sector-reset-row">
                      <button type="button" class="btn btn-text btn-sm sector-reset" aria-label=${(0,h.t)(819)} title=${(0,h.t)(189)} @click=${()=>this._resetAll()}>
                        <ha-icon icon="mdi:backup-restore"></ha-icon>${(0,h.t)(818)}
                      </button>
                    </div>`:n.s6}
                ${this._noShape?n.qy`<p class="help" id="fx-shape-hint" role="status">
                      ${(0,h.t)(341)}
                    </p>`:n.s6}
                ${this._renderFill()} ${this._renderDevice()} ${this._renderDraw()} ${this._renderMorph()} ${this._renderColors()}
              </div>`:n.s6}
        </div>
      </div>
    `}};function Ho(e){return(0,Co.K)(e)?(0,h.t)(85):(0,h.t)(84)}function Io(e,t,i,o={}){const s=!!o.syncCtx&&(0,jo.rJ)(o.syncCtx);return n.qy`<mc-icon-fx-editor
    .hass=${t}
    .fx=${e.icon_fx}
    .entity=${o.entity??""}
    .icon=${o.icon??e.icon??""}
    .moduleIcon=${e.icon??""}
    .iconOn=${e.icon_on??""}
    .iconOff=${e.icon_off??""}
    .svg=${e.svg??""}
    .moduleCfg=${e}
    .allowSvg=${!!o.allowSvg}
    .allowStateIcons=${!!o.allowStateIcons}
    .syncCtx=${o.syncCtx}
    .onChange=${t=>i((0,To.kH)(e,t,s?o.syncCtx:void 0))}
  ></mc-icon-fx-editor>`}Po.styles=[l.x,n.AH`
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
        margin-inline-end: 8px;
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
    `],zo([(0,o.MZ)({attribute:!1})],Po.prototype,"hass",void 0),zo([(0,o.MZ)({attribute:!1})],Po.prototype,"fx",void 0),zo([(0,o.MZ)({type:String})],Po.prototype,"entity",void 0),zo([(0,o.MZ)({type:String})],Po.prototype,"icon",void 0),zo([(0,o.MZ)({type:String})],Po.prototype,"moduleIcon",void 0),zo([(0,o.MZ)({type:String})],Po.prototype,"iconOn",void 0),zo([(0,o.MZ)({type:String})],Po.prototype,"iconOff",void 0),zo([(0,o.MZ)({type:String})],Po.prototype,"svg",void 0),zo([(0,o.MZ)({type:Boolean})],Po.prototype,"allowSvg",void 0),zo([(0,o.MZ)({type:Boolean})],Po.prototype,"allowStateIcons",void 0),zo([(0,o.MZ)({attribute:!1})],Po.prototype,"onChange",void 0),zo([(0,o.MZ)({attribute:!1})],Po.prototype,"moduleCfg",void 0),zo([(0,o.MZ)({attribute:!1})],Po.prototype,"syncCtx",void 0),zo([(0,o.wk)()],Po.prototype,"_open",void 0),zo([(0,o.wk)()],Po.prototype,"_svgDraft",void 0),zo([(0,o.wk)()],Po.prototype,"_svgError",void 0),zo([(0,o.wk)()],Po.prototype,"_svgAlert",void 0),zo([(0,o.wk)()],Po.prototype,"_noShape",void 0),zo([(0,o.wk)()],Po.prototype,"_svgOn",void 0),zo([(0,o.wk)()],Po.prototype,"_editorState",void 0),zo([(0,o.wk)()],Po.prototype,"_saved",void 0),Po=zo([(0,o.EM)("mc-icon-fx-editor")],Po);const Vo={type:"icon",entityField:!0,general(e,t,i,o,s){const a=e,r=Zn(a,s),l=Nn(e,o);return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),a,i,t,s,{syncCtx:l})}
        ${(0,kt.vm)((0,h.t)(1147),a.use_entity_icon,e=>i({...a,use_entity_icon:e}),"use_entity_icon",l)}
        ${(0,kt.vm)((0,h.t)(1145),a.use_entity_color,e=>i({...a,use_entity_color:e}),"use_entity_color",l,(0,h.t)(212))}
        ${a.use_entity_icon||"svg"===a.icon?n.s6:(0,kt.AJ)((0,h.t)(466),a.icon,e=>i({...a,icon:e}),t,"icon",l,{module:a,onModule:i})}
        ${Io(a,t,i,{entity:r,icon:a.use_entity_icon?(0,ko.fq)(t,r)||a.icon:a.icon||"mdi:help",allowSvg:!a.use_entity_icon,allowStateIcons:!!r,syncCtx:l})}
        ${(0,kt.Yd)((0,h.t)(468),a.icon_color,e=>i({...a,icon_color:e||void 0}),"icon_color",l,"linear",(0,h.t)(1056))}
        ${a.use_entity_color&&a.icon_color?(0,kt.m1)((0,h.t)(1146)):n.s6}
        ${(0,kt.lm)((0,h.t)(972),a.size,e=>i({...a,size:e||void 0}),"size",l,"24")}
      </div>
    `}};var Do=i(215);const Fo={type:"info",entityField:!0,general(e,t,i,o,s){const a=e,r=Zn(a,s),l=Nn(e,o),c=(0,Do.S)(a);return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),a,i,t,s,{syncCtx:l})}
        ${(0,kt.FQ)((0,h.t)(105),a.attribute,e=>i({...a,attribute:e}),t,r,"attribute",l,Et(s))}
        ${(0,kt.vm)((0,h.t)(941),c.name,e=>i({...a,show_name:e,show_state:c.state}),"show_name",l)}
        ${(0,kt.vm)((0,h.t)(948),c.state,e=>i({...a,show_name:c.name,show_state:e}),"show_state",l,c.name||c.state||a.secondary_info?void 0:(0,h.t)(1192))}
        ${c.state?(0,kt.vm)((0,h.t)(956),!1!==a.show_unit,e=>i({...a,show_unit:e}),"show_unit",l):n.s6}
        ${(0,kt.vm)((0,h.t)(938),a.show_icon,e=>i({...a,show_icon:e}),"show_icon",l)}
        ${a.show_icon&&"svg"!==a.icon?(0,kt.AJ)((0,h.t)(466),a.icon,e=>i({...a,icon:e||void 0}),t,"icon",l,{module:a,onModule:i}):n.s6}
        ${a.show_icon?Io(a,t,i,{entity:r,icon:a.icon||(0,ko.fq)(t,r)||"mdi:information-outline",allowSvg:!0,allowStateIcons:!!r,syncCtx:l}):n.s6}
        ${(0,kt.Gz)((0,h.t)(771),a.prefix,e=>i({...a,prefix:e}),"prefix",l)}
        ${(0,kt.Gz)((0,h.t)(1019),a.suffix,e=>i({...a,suffix:e}),"suffix",l)}
        ${(0,kt.FQ)((0,h.t)(887),a.secondary_info,e=>i({...a,secondary_info:e}),t,r,"secondary_info",l,Et(s),[{value:"last-changed",label:(0,h.t)(506)}])}
      </div>
    `}};var No=i(6206),Zo=i(8943);const Bo={type:"image",entityField:!0,general(e,t,i,o,s){const a=e,r=Zn(a,s),l=Nn(e,o),c=!!a.entity_picture||!(!r||!a.attribute);return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),a,i,t,s,{syncCtx:l})}
        ${a.attribute?n.s6:(0,kt.vm)((0,h.t)(1148),a.entity_picture,e=>i({...a,entity_picture:e}),"entity_picture",l,(0,h.t)(967))}
        ${(0,kt.FQ)((0,h.t)(483),a.attribute,e=>i({...a,attribute:e||void 0}),t,r,"attribute",l,Et(s))}
        ${r&&a.attribute?(0,kt.m1)((0,h.t)(1046)):n.s6}
        ${(0,Zo.$L)(()=>n.qy`<div class="mc-field">
            <mc-library-image-field .hass=${t} .value=${a.image??""} .module=${a} .hideSource=${c} .label=${(0,h.t)(481)} @image-change=${e=>i((0,Zo.bS)(a,e.detail.keys))}></mc-library-image-field>
            ${l?(0,kt.pZ)("image",l):n.s6}
          </div>`,()=>c?n.qy``:(0,kt.nZ)((0,h.t)(482),a.image,e=>i({...a,image:e}),t,"image","image",l))}
        ${(0,kt.Gz)((0,h.t)(102),void 0===a.aspect_ratio?void 0:String(a.aspect_ratio),e=>i({...a,aspect_ratio:e}),"aspect_ratio",l,{placeholder:"16:9"})}
        ${void 0!==a.aspect_ratio&&""!==a.aspect_ratio&&""===(0,No.o)(a.aspect_ratio,"")?(0,kt.m1)((0,h.t)(1140)):n.s6}
        ${(0,kt.De)((0,h.t)(390),a.fit,[{label:(0,h.t)(251),value:"cover"},{label:(0,h.t)(230),value:"contain"},{label:(0,h.t)(381),value:"fill"},{label:(0,h.t)(660),value:"none"}],e=>i({...a,fit:e}),"fit",l)}
      </div>
    `}},Ko={type:"markdown",entityField:!0,general(e,t,i,o,s){const a=e,r=Zn(a,s),l=Nn(e,o);return n.qy`
      <div class="mc-tab-content">
        ${(0,kt.fZ)((0,h.t)(231),a.content,e=>i({...a,content:e}),{rows:6,placeholder:(0,h.t)(1)},"content",l)}
        ${(0,kt.m1)((0,h.t)(565,{example:"{{ states('sensor.temperature') }}",entity:"{{ states(entity) }}"}))}
        ${Ot((0,h.t)(358),a,i,t,s,{syncCtx:l})}
        ${(0,kt.FQ)((0,h.t)(105),a.attribute,e=>i({...a,attribute:e}),t,r,"attribute",l,Et(s))}
      </div>
    `}},Wo={type:"bar",entityField:!0,general(e,t,i,o,s){const a=e,r=Zn(a,s),l=Nn(e,o);return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),a,i,t,s,{syncCtx:l})}
        ${(0,kt.FQ)((0,h.t)(105),a.attribute,e=>i({...a,attribute:e}),t,r,"attribute",l,Et(s))}
        ${(0,kt.aA)((0,h.t)(586),a.min,e=>i({...a,min:e}),void 0,"min",l)}
        ${(0,kt.aA)((0,h.t)(575),a.max,e=>i({...a,max:e}),void 0,"max",l)}
        ${(0,kt.lm)((0,h.t)(130),a.bar_height,e=>i({...a,bar_height:e||void 0}),"bar_height",l,"8")}
        ${(0,kt.Yd)((0,h.t)(129),a.bar_color,e=>i({...a,bar_color:e}),"bar_color",l)}
        ${(0,kt.Yd)((0,h.t)(128),a.bar_background,e=>i({...a,bar_background:e}),"bar_background",l)}
        ${(0,Li._)((0,h.t)(209),a.severity,e=>i({...a,severity:e}),{min:a.min??0,max:a.max??100,propertyName:"severity",syncCtx:l,help:(0,h.t)(1047)})}
        ${(0,kt.vm)((0,h.t)(957),!1!==a.show_value,e=>i({...a,show_value:e}),"show_value",l)}
        ${!1!==a.show_value?(0,kt.aA)((0,h.t)(275),a.decimals,e=>i({...a,decimals:Number.isFinite(e)?e:void 0}),{min:0,max:6,optional:!0,placeholder:(0,h.t)(114)},"decimals",l):n.s6}
        ${(0,kt.De)((0,h.t)(305),a.direction,[{label:(0,h.t)(455),value:"horizontal"},{label:(0,h.t)(1166),value:"vertical"}],e=>i({...a,direction:e}),"direction",l)}
      </div>
    `}},Uo={type:"graphs",entityField:!0,general(e,t,i,o,s){const a=e,r=Zn(a,s),l=Nn(e,o);return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),a,i,t,s,{syncCtx:l})}
        ${(0,kt.FQ)((0,h.t)(105),a.attribute,e=>i({...a,attribute:e||void 0}),t,r,"attribute",l,Et(s))}
        ${(0,kt.aA)((0,h.t)(459),a.hours_to_show,e=>i({...a,hours_to_show:e}),{min:1,max:168},"hours_to_show",l)}
        ${a.attribute&&Number(a.hours_to_show)>48?(0,kt.m1)((0,h.t)(72)):n.s6}
        ${(0,kt.aA)((0,h.t)(766),a.points_per_hour,e=>i({...a,points_per_hour:Number.isFinite(e)&&e>0?e:void 0}),{min:.1,max:60,step:.1,optional:!0,placeholder:(0,h.t)(373)},"points_per_hour",l)}
        ${(0,kt.m1)((0,h.t)(1165))}
        ${(0,kt.Yd)((0,h.t)(522),a.line_color,e=>i({...a,line_color:e}),"line_color",l)}
        ${(0,kt.aA)((0,h.t)(524),a.line_width,e=>i({...a,line_width:e}),{min:1,max:10},"line_width",l)}
        ${(0,kt.vm)((0,h.t)(380),!1!==a.fill,e=>i({...a,fill:e}),"fill",l)}
        ${!1!==a.fill?(0,kt.Yd)((0,h.t)(382),a.fill_color,e=>i({...a,fill_color:e}),"fill_color",l):n.s6}
        ${(0,kt.vm)((0,h.t)(945),a.show_points,e=>i({...a,show_points:e}),"show_points",l)}
        ${(0,kt.vm)((0,h.t)(940),!1!==a.show_labels,e=>i({...a,show_labels:e}),"show_labels",l,(0,h.t)(620))}
      </div>
    `}};i(4362);const Go={type:"camera",entityField:!0,general(e,t,i,o,s){const a=e,r=Nn(e,o),l="live"===a.camera_view;return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(161),a,i,t,s,{domain:"camera",syncCtx:r})}
        ${(0,kt.Wn)((0,h.t)(1170),l?"live":"snapshot",[{label:(0,h.t)(531),value:"live"},{label:(0,h.t)(978),value:"snapshot"}],e=>i({...a,camera_view:e}),"camera_view",r)}
        ${l?n.qy`
              ${(0,kt.vm)((0,h.t)(934),!1!==a.show_controls,e=>i({...a,show_controls:e}),"show_controls",r,(0,h.t)(763))}
              ${(0,kt.m1)((0,h.t)(1066))}
            `:n.s6}
        ${(0,kt.aA)(l?(0,h.t)(979):(0,h.t)(793),a.refresh_interval,e=>i({...a,refresh_interval:Number.isFinite(e)&&e>0?e:void 0}),{min:1,max:3600,optional:!0,placeholder:String(10)},"refresh_interval",r)}
        ${l?(0,kt.m1)((0,h.t)(1157)):n.s6}
        ${(0,kt.Gz)((0,h.t)(102),void 0===a.aspect_ratio?void 0:String(a.aspect_ratio),e=>i({...a,aspect_ratio:e}),"aspect_ratio",r,{placeholder:"16:9"})}
      </div>
    `}};var Yo=i(2303);const Qo={type:"button",entityField:!0,general(e,t,i,o,s){const a=Nn(e,o),r=e,l=Zn(r,s);return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),r,i,t,s,{syncCtx:a,write:(e,t)=>function(e,t,i){const n=e;return!i&&void 0===n.actions&&t&&"none"!==t?{...n,entity:t,actions:(0,Yo.rD)(t)}:Lt(n,t)}(e,t,l)})}
        ${(0,kt.Gz)((0,h.t)(503),r.label,e=>i({...r,label:e}),"label",a)}
        ${l?(0,kt.vm)((0,h.t)(1147),r.use_entity_icon,e=>i({...r,use_entity_icon:e}),"use_entity_icon",a):n.s6}
        ${r.use_entity_icon&&l||"svg"===r.icon?n.s6:(0,kt.AJ)((0,h.t)(466),r.icon,e=>i({...r,icon:e}),t,"icon",a,{module:r,onModule:i})}
        ${Io(r,t,i,{entity:l,icon:r.use_entity_icon&&l?(0,ko.fq)(t,l)||r.icon||"mdi:gesture-tap":r.icon,allowSvg:!(r.use_entity_icon&&l),allowStateIcons:!!l,syncCtx:a})}
        ${l?(0,kt.vm)((0,h.t)(1145),r.use_entity_color,e=>i({...r,use_entity_color:e}),"use_entity_color",a,(0,h.t)(212)):n.s6}
        ${(0,kt.Wn)((0,h.t)(157),r.button_style,[{label:(0,h.t)(276),value:"default"},{label:(0,h.t)(707),value:"outline"},{label:(0,h.t)(392),value:"flat"},{label:(0,h.t)(470),value:"icon-only"}],e=>i({...r,button_style:e}),"button_style",a)}
        ${(0,kt.vm)((0,h.t)(948),r.show_state,e=>i({...r,show_state:e}),"show_state",a,(0,h.t)(968))}
        ${r.show_state?(0,kt.FQ)((0,h.t)(105),r.attribute,e=>i({...r,attribute:e||void 0}),t,l,"attribute",a,Et(s)):n.s6}
      </div>
    `}};var Jo=i(4191),Xo=i(8302);const es="magic-card-look-editor.js";let ts,is=!1;function ns(){return is?Promise.resolve(!0):(ts??=new Promise(e=>{let t=!1;const n=(i,n)=>{t||(t=!0,clearTimeout(o),i?is=!0:(ts=void 0,console.warn(`Magic Card: ${es} did not load`,...void 0===n?[]:[n])),e(i))},o=setTimeout(()=>n(!1,"timed out"),15e3);i.e(836).then(()=>i(7447)).then(e=>{const t=e;if(t?.BUILD!==vi.Q)return n(!1,`Magic Card was updated, reload the page (editor ${vi.Q}, ${es} ${String(t?.BUILD)}).`);try{t.install?.()}catch(e){return n(!1,e)}n(!0)},e=>n(!1,e))}),ts)}const os=()=>is;var ss=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const as=new Map;class rs extends n.WF{constructor(){super(...arguments),this._look=os()?"ready":"loading"}connectedCallback(){super.connectedCallback(),"loading"===this._look&&this._load()}_load(e=!1){this._look="loading",ns().then(e=>{this._look=e?"ready":"failed"}),e&&this.updateComplete.then(()=>this.renderRoot.querySelector(".skeleton")?.focus())}get _session(){return(e=>{let t=as.get(e);return t||(as.size>=64&&as.delete(as.keys().next().value),t={open:new Set},as.set(e,t)),t})(`${this.template??""}|${this.config?.id??""}`)}render(){const e=this.config;let t=n.s6;if(!e)return n.qy``;if("ready"===this._look&&customElements.get(Jo.Ne)){const i=this._session;i.undo&&void 0!==i.after&&i.after!==JSON.stringify(e)&&(i.undo=i.after=void 0),t=n.qy`<mc-slider-look-editor
        .config=${e}
        .hass=${this.hass}
        .template=${this.template}
        .entity=${this.entity}
        .open=${new Set(i.open)}
        .onToggle=${e=>{i.open.has(e)?i.open.delete(e):i.open.add(e),this.requestUpdate()}}
        .undo=${i.undo}
        .onUndoChange=${e=>{i.undo=e,i.after=void 0,this.requestUpdate()}}
        .onChange=${e=>{i.undo&&(i.after=JSON.stringify(e)),this.onChange?.(e)}}
      ></mc-slider-look-editor>`}else"failed"===this._look?t=(0,Xo.lm)({tone:"warn",text:(0,h.t)(248),action:{label:(0,h.t)(1114),onClick:()=>this._load(!0)}}):"loading"===this._look&&(t=n.qy`<div class="skeleton" role="status" aria-busy="true" tabindex="-1">
        <span>${(0,h.t)(544)}</span>
        <div class="bar"></div>
      </div>`);return n.qy`<section class="grp" aria-labelledby="look-h">
      <h4 class="grp-h" id="look-h">${(0,h.t)(553)}</h4>
      ${t}
    </section>`}}rs.styles=[l.x,n.AH`
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
    `],ss([(0,o.MZ)({attribute:!1})],rs.prototype,"config",void 0),ss([(0,o.MZ)({attribute:!1})],rs.prototype,"hass",void 0),ss([(0,o.MZ)({attribute:!1})],rs.prototype,"template",void 0),ss([(0,o.MZ)({attribute:!1})],rs.prototype,"entity",void 0),ss([(0,o.MZ)({attribute:!1})],rs.prototype,"onChange",void 0),ss([(0,o.wk)()],rs.prototype,"_look",void 0),customElements.get("mc-slider-look-host")||customElements.define("mc-slider-look-host",rs);const ls=e=>Number.isFinite(e)?e:void 0,cs={type:"slider",entityField:!0,general(e,t,i,o,s){const a=Nn(e,o),r=e,l=Zn(r,s),c=l?t?.states[l]:void 0,d={color:(0,oi.id)(c)??"currentColor",attributes:c?.attributes},u=c?(0,Yo.fR)(t,c,r.attribute):void 0;return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),r,i,t,s,{syncCtx:a})}
        ${(0,kt.FQ)((0,h.t)(105),r.attribute,e=>i({...r,attribute:e||void 0}),t,l,"attribute",a,Et(s))}
        ${c&&u?.readOnly?(0,kt.m1)((0,h.t)(1090)):n.s6}
        ${(0,kt.aA)((0,h.t)(586),r.min,e=>i({...r,min:ls(e)}),{optional:!0,placeholder:u?String(u.min):"0"},"min",a)}
        ${(0,kt.aA)((0,h.t)(575),r.max,e=>i({...r,max:ls(e)}),{optional:!0,placeholder:u?String(u.max):"100"},"max",a)}
        ${(0,kt.aA)((0,h.t)(1010),r.step,e=>i({...r,step:ls(e)}),{optional:!0,min:0,placeholder:u?String(u.step):"1"},"step",a)}
        ${(0,kt.m1)((0,h.t)(349))}
        ${(0,kt.vm)((0,h.t)(957),!1!==r.show_value,e=>i({...r,show_value:e}),"show_value",a)}
        ${(0,kt.m1)((0,h.t)(862))}
        ${(0,kt.De)((0,h.t)(305),r.direction,[{label:(0,h.t)(455),value:"horizontal"},{label:(0,h.t)(1166),value:"vertical"}],e=>i({...r,direction:e}),"direction",a)}
        ${r.use_entity_color?n.qy`<div class="mc-field">
              <div class="field-head"><span class="lbl">${(0,h.t)(973)}</span></div>
              <p class="help">${(0,h.t)(395)} <button type="button" class="btn sm ghost" @click=${()=>i({...r,use_entity_color:void 0})}>${(0,h.t)(1152)}</button></p>
            </div>`:(0,kt.Yd)((0,h.t)(973),r.slider_color,e=>i({...r,slider_color:e||void 0}),"slider_color",a,"","",d)}
        ${(0,kt.Yd)((0,h.t)(1112),r.track_color,e=>i({...r,track_color:e||void 0}),"track_color",a,"","",d)}
        <mc-slider-look-host .config=${r} .hass=${t} .template=${o} .entity=${l} .onChange=${e=>i(e)}></mc-slider-look-host>
      </div>
    `}};var ds=i(7264);const hs=e=>Number.isFinite(e)?e:void 0,us={type:"spinbox",entityField:!0,general(e,t,i,o,s){const a=Nn(e,o),r=e,l=Zn(r,s),c=l?t?.states[l]:void 0,d=c?(0,Yo.fR)(t,c,r.attribute):void 0;return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),r,i,t,s,{syncCtx:a})}
        ${(0,kt.FQ)((0,h.t)(105),r.attribute,e=>i({...r,attribute:e||void 0}),t,l,"attribute",a,Et(s))}
        ${c&&d?.readOnly?(0,kt.m1)((0,h.t)(1091)):n.s6}
        ${(0,ds.H)(c,r.attribute)?(0,kt.m1)((0,h.t)(1067)):n.s6}
        ${(0,kt.aA)((0,h.t)(586),r.min,e=>i({...r,min:hs(e)}),{optional:!0,placeholder:d?String(d.min):"0"},"min",a)}
        ${(0,kt.aA)((0,h.t)(575),r.max,e=>i({...r,max:hs(e)}),{optional:!0,placeholder:d?String(d.max):"100"},"max",a)}
        ${(0,kt.aA)((0,h.t)(1010),r.step,e=>i({...r,step:hs(e)}),{optional:!0,min:0,placeholder:d?String(d.step):"1"},"step",a)}
        ${(0,kt.m1)((0,h.t)(350))}
      </div>
    `}};var ps=i(8199);const ms={type:"dropdown",entityField:!0,general(e,t,i,o,s){const a=Nn(e,o),r=e,l=Zn(r,s),c=(0,ps.a5)(r.options),d=l?t?.states[l]:void 0,u=d?(0,ps.fA)(d,r.attribute):void 0,p=(0,ps.P7)(d,u,c),m=e=>i({...r,options:e.length?e:void 0}),g=(e,t,i)=>m(c.map((n,o)=>o===e?{...n,[t]:i}:n)),f=(0,ps.XZ)(l);return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),r,i,t,s,{syncCtx:a})}
        ${f.length?(0,kt.FQ)((0,h.t)(105),r.attribute,e=>i({...r,attribute:e||void 0}),t,l,"attribute",a,Et(s)):n.s6}
        ${f.length?(0,kt.m1)((0,h.t)(909,{attributes:f.join(", "),fallback:d?.entity_id.startsWith("climate.")?(0,h.t)(1241):f[0]})):n.s6}
        ${d&&!u?(0,kt.m1)((0,h.t)(1080)):n.s6}

        <div class="mc-section">
          <div class="mc-field">${(0,kt.XT)((0,h.t)(260),"options",a)}</div>
          ${(0,kt.m1)((0,h.t)(515),"mc-field-hint-with-margin")}
          <div class="mc-options-list">
            ${c.map((e,t)=>n.qy`
                <div class="mc-option-item mc-option-row">
                  ${(0,kt.Gz)((0,h.t)(503),e.label,e=>g(t,"label",e))}
                  ${(0,kt.Gz)((0,h.t)(1161),e.value,e=>g(t,"value",e))}
                  <button type="button" class="mc-btn-icon" aria-label=${(0,h.t)(799)} title=${(0,h.t)(799)} @click=${()=>{return e=t,m(c.filter((t,i)=>i!==e));var e}}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                </div>
                ${d&&u&&e.value&&!p.includes(e.value)?(0,kt.m1)((0,h.t)(0,{value:e.value})):n.s6}
              `)}
          </div>
          <button type="button" class="mc-btn mc-btn-secondary" @click=${()=>{const e=p.find(e=>!c.some(t=>t.value===e)),t=e??`value_${c.length+1}`;m([...c,{label:e??(0,h.t)(703,{n:c.length+1}),value:t}])}}>${(0,h.t)(48)}</button>
        </div>
      </div>
    `}};var gs=i(1495);const fs={type:"light",entityField:!0,general(e,t,i,o,s){const a=Nn(e,o),r=e,l=Zn(r,s),c=l?t?.states[l]:void 0,d=(e,t,i)=>e&&c&&!t?(0,kt.m1)((0,h.t)(1083,{what:i})):n.s6;return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),r,i,t,s,{domain:"light",syncCtx:a})}
        ${(0,kt.vm)((0,h.t)(927),!1!==r.show_brightness,e=>i({...r,show_brightness:e}),"show_brightness",a)}
        ${d(!1!==r.show_brightness,!c||(0,Yo.c9)(c),(0,h.t)(1217))}
        ${(0,kt.vm)((0,h.t)(932),r.show_color_temp,e=>i({...r,show_color_temp:e}),"show_color_temp",a)}
        ${d(r.show_color_temp,!c||(0,Yo.eI)(c),(0,h.t)(1220))}
        ${(0,kt.vm)((0,h.t)(931),r.show_color,e=>i({...r,show_color:e}),"show_color",a)}
        ${d(r.show_color,!c||(0,Yo.Aw)(c),(0,h.t)(1221))}
        ${(0,kt.vm)((0,h.t)(936),r.show_effect,e=>i({...r,show_effect:e}),"show_effect",a)}
        ${d(r.show_effect,!c||(0,gs.Q)(c),(0,h.t)(1224))}
        ${(0,kt.vm)((0,h.t)(221),r.compact,e=>i({...r,compact:e}),"compact",a)}
        ${(0,kt.m1)((0,h.t)(1031))}
        ${"svg"!==r.icon?(0,kt.AJ)((0,h.t)(466),r.icon,e=>i({...r,icon:e||void 0}),t,"icon",a,{module:r,onModule:i}):n.s6}
        ${Io(r,t,i,{entity:l,icon:r.icon||(0,ko.fq)(t,l)||"mdi:lightbulb",allowStateIcons:!!l,syncCtx:a})}
      </div>
    `}},vs={type:"gauge",entityField:!0,general(e,t,i,o,s){const a=Nn(e,o),r=e,l=Zn(r,s);return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(357),r,i,t,s,{syncCtx:a})}
        ${(0,kt.FQ)((0,h.t)(105),r.attribute,e=>i({...r,attribute:e}),t,l,"attribute",a,Et(s))}
        ${(0,kt.aA)((0,h.t)(586),r.min,e=>i({...r,min:e}),void 0,"min",a)}
        ${(0,kt.aA)((0,h.t)(575),r.max,e=>i({...r,max:e}),void 0,"max",a)}
        ${(0,kt.De)((0,h.t)(414),r.gauge_style,[{label:(0,h.t)(435),value:"half"},{label:(0,h.t)(409),value:"full"},{label:(0,h.t)(786),value:"quarter"}],e=>i({...r,gauge_style:e}),"gauge_style",a)}
        ${(0,kt.vm)((0,h.t)(942),!1!==r.needle,e=>i({...r,needle:e}),"needle",a)}
        ${(0,kt.vm)((0,h.t)(941),!1!==r.show_name,e=>i({...r,show_name:e}),"show_name",a)}
        ${(0,kt.vm)((0,h.t)(956),!1!==r.show_unit,e=>i({...r,show_unit:e}),"show_unit",a)}
        ${(0,kt.aA)((0,h.t)(275),r.decimals,e=>i({...r,decimals:Number.isFinite(e)?e:void 0}),{min:0,max:6,optional:!0,placeholder:(0,h.t)(114)},"decimals",a)}
        ${(0,Li._)((0,h.t)(209),r.severity,e=>i({...r,severity:e}),{min:r.min??0,max:r.max??100,propertyName:"severity",syncCtx:a,help:(0,h.t)(1044)})}
      </div>
    `}},bs={type:"horizontal",general(e,t,i,o){const s=Nn(e,o),a=e;return n.qy`
      <div class="mc-tab-content">
        ${(0,kt.lm)((0,h.t)(411),a.gap,e=>i({...a,gap:e||void 0}),"gap",s,"8")}
        ${(0,kt.De)((0,h.t)(61),a.align,[{label:(0,h.t)(999),value:"start"},{label:(0,h.t)(182),value:"center"},{label:(0,h.t)(353),value:"end"},{label:(0,h.t)(1015),value:"stretch"}],e=>i({...a,align:e}),"align",s)}
        ${(0,kt.De)((0,h.t)(498),a.justify,[{label:(0,h.t)(999),value:"start"},{label:(0,h.t)(182),value:"center"},{label:(0,h.t)(353),value:"end"},{label:(0,h.t)(988),value:"space-between"},{label:(0,h.t)(987),value:"space-around"}],e=>i({...a,justify:e}),"justify",s)}
      </div>
    `}},ys={type:"vertical",general(e,t,i,o){const s=Nn(e,o),a=e;return n.qy`
      <div class="mc-tab-content">
        ${(0,kt.lm)((0,h.t)(411),a.gap,e=>i({...a,gap:e||void 0}),"gap",s,"8")}
        ${(0,kt.De)((0,h.t)(61),a.align,[{label:(0,h.t)(999),value:"start"},{label:(0,h.t)(182),value:"center"},{label:(0,h.t)(353),value:"end"},{label:(0,h.t)(1015),value:"stretch"}],e=>i({...a,align:e}),"align",s)}
      </div>
    `}},_s=e=>Array.from({length:Math.max(e,1)},()=>"1").join("-"),ws=["1","1-1","2-1","1-2","1-1-1"],$s="custom",xs=(e,t,i)=>({row:t,setLayout:t=>i.setRowLayout(e,t),setWidths:(t,n)=>i.setColumnWidths(e,t,n),sync:Ms(e,t,i)});function ks(e){const t=e.row,i=t.columns.length,o=(0,f.SU)(t),s=t.layout||_s(i),a=o?$s:s,r=ws.includes(s)?ws:[...ws,s],l=o?[...r,$s]:r,c=t=>{t!==a&&t!==$s&&e.setLayout(t)};return n.qy`
    <div class="field">
      <div class="field-head"><span class="lbl" id="row-layout-lbl">${(0,h.t)(214)}</span></div>
      <div class="seg full" role="radiogroup" aria-labelledby="row-layout-lbl" @keydown=${e=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(e.key))return;e.preventDefault();const t=l.indexOf(a),i="rtl"===(0,Ge.k)(e.currentTarget)?"ArrowRight":"ArrowLeft",n=e.key===i||"ArrowUp"===e.key?-1:1,o="Home"===e.key?0:"End"===e.key?l.length-1:(t+n+l.length)%l.length,s=l[o];c(s);const r=e.currentTarget;requestAnimationFrame(()=>r.querySelector(`[data-val="${s}"]`)?.focus())}}>
        ${l.map(e=>{const o=e===a,s=e===$s?y(b(t)):function(e,t){const i=t??Math.max(e.split("-").length,1);return function(e,t){if(/^\d+(?:-\d+)*$/.test(e)){const i=e.split("-").map(e=>Math.max(Number(e)||1,1));if(i.length===t)return i}return function(e){return Array.from({length:Math.max(e,1)},()=>1)}(t)}(e||"1",i)}(e),r=e===$s?(0,h.t)(1265,{n:i}):function(e){const t=e.length;if(t<=1)return(0,h.t)(6);const i=e.map(e=>String(+e.toFixed(2))).reduce((e,t)=>(0,h.t)(1250,{from:e,to:t}));return(0,h.t)(1263,{n:t,ratio:i})}(s);return n.qy`
            <button
              type="button"
              role="radio"
              class="layout-opt"
              data-val=${e}
              aria-checked=${o?"true":"false"}
              aria-label=${r}
              title=${r}
              tabindex=${o?"0":"-1"}
              @click=${()=>c(e)}
            >${wt(s)}</button>
          `})}
      </div>
      <p class="help">${(0,h.t)(803)}</p>
    </div>
  `}const Cs=["fr","%","px"];function Ms(e,t,i){if(!i.getConfig().template)return n.s6;const o=!t.not_synced?.includes("column_widths");return n.qy`<mc-sync-indicator
    .synced=${o}
    .hasTemplate=${!0}
    .hideIfNoTemplate=${!0}
    .propertyPath=${"column_widths"}
    @sync-toggle=${n=>{n.stopPropagation(),i.updateRow(e,{not_synced:_e(t.not_synced,"column_widths",o)})}}
  ></mc-sync-indicator>`}function Ss(e,t,i,n){const o=function(e){return""===e.trim()?"1fr":(0,f.W8)(e)}(i),s=b(e.row);!o||(0,f.SU)(e.row)&&s[t]===o?n?.revert?.():(s[t]=o,e.setWidths(s))}function As(e){const t=b(e.row),i=(0,f.SU)(e.row);return n.qy`
    <div class="field col-widths">
      <div class="field-head">
        <span class="lbl" id="row-widths-lbl">${(0,h.t)(216)}</span>
        ${e.sync??n.s6}
        ${(0,Jt.i)((0,h.t)(216),i,()=>e.setWidths(void 0))}
      </div>
      <div class="col-width-list" role="group" aria-labelledby="row-widths-lbl">
        ${t.map((t,i)=>n.qy`
          <div class="col-width">
            <span class="col-width-lbl" aria-hidden="true">${(0,h.t)(218,{n:i+1})}</span>
            <mc-unit-field
              .value=${t}
              .label=${(0,h.t)(219,{n:i+1})}
              .units=${Cs}
              @value-changed=${t=>Ss(e,i,t.detail.value,t.target)}
            ></mc-unit-field>
          </div>
        `)}
      </div>
      <div class="col-widths-foot">
        <button
          type="button"
          class="btn btn-text btn-sm"
          @click=${()=>e.setWidths(void 0,_s(e.row.columns.length))}
        ><ha-icon icon="mdi:arrow-split-vertical"></ha-icon>${(0,h.t)(370)}</button>
      </div>
      <p class="help">${(0,h.t)(1228)}</p>
    </div>
  `}const qs=[{label:1109,value:"start"},{label:182,value:"center"},{label:142,value:"end"},{label:1015,value:"stretch"}];function Es(e,t,i,n,o,s=!0){return Rt(e,n,t=>{const n=t,a={entity:n.entity,share_entity:n.share_entity};if(s&&i.getConfig().template){const t=["entity","share_entity"].filter(t=>a[t]!==e[t]);a.not_synced=Array.from(new Set([...e.not_synced??[],...t]))}o(a)},so(i.getConfig(),t))}function js(e,t,i,o,s=n.s6){const a=o&&o.row.columns.length>1?n.qy`
        <div class="field">
          <div class="field-head">
            <label for="col-width">${(0,h.t)(1188)}</label>
            ${o.sync??n.s6}
            ${(0,Jt.i)((0,h.t)(1188),(0,f.SU)(o.row)&&"1fr"!==b(o.row)[t],()=>Ss(o,t,"1fr"))}
          </div>
          <mc-unit-field
            data-col-width
            inputId="col-width"
            .value=${b(o.row)[t]}
            .label=${(0,h.t)(1188)}
            .units=${Cs}
            @value-changed=${e=>Ss(o,t,e.detail.value,e.target)}
          ></mc-unit-field>
          <p class="help">${(0,h.t)(688)}</p>
        </div>
      `:n.s6;return n.qy`
    ${s}
    <div class="group">
      ${a}
      ${(0,kt.De)((0,h.t)(1167),e.vertical_align||"start",(0,h.tl)(qs),e=>i({vertical_align:e}))}
      ${(0,kt.lm)((0,h.t)(411),e.gap,e=>i({gap:e||void 0}))}
      ${(0,kt.Mg)((0,h.t)(719),e.padding,e=>i({padding:e}),"padding")}
    </div>
  `}function Ts(e,t,i,o){return n.qy`<mc-design-panel .design=${t} .hass=${i} .target=${e} .onChange=${o}></mc-design-panel>`}function zs(e,t,i){const n=!!i.getConfig().template,o={...e.design,...t};for(const e of Object.keys(o))void 0!==o[e]&&""!==o[e]||delete o[e];n&&"value_background"in t&&void 0===t.value_background&&(o.value_background={type:"none"}),n&&"shape"in t&&(void 0===t.shape&&(o.shape="none"),void 0===t.shape_options&&(o.shape_options={}));const s={design:o};return n&&!e.not_synced?.includes("design")&&(s.not_synced=[...e.not_synced||[],"design"]),s}function Ls(e,t,i,o){const s=t.conditions||[];return n.qy`
      ${Ut(s,t.mode||"every",{onAdd:()=>i({...t,conditions:[...s,{id:`cond-${Date.now()}`,type:"state",entity:"",state:""}]}),onUpdate:(e,n)=>i({...t,conditions:s.map((t,i)=>i===e?{...t,...n}:t)}),onRemove:e=>{const n=s.filter((t,i)=>i!==e);i({...t,conditions:n.length?n:void 0})},onMode:e=>i({...t,mode:e})},o,void 0,e)}
  `}const Os={type:"row",general:(e,t,i,o)=>function(e,t,i){const o=e.columns||[],s=(n,o="keep")=>{const s={...e};if(n(s),i&&"keep"!==o){const t=(e.not_synced||[]).filter(e=>"column_widths"!==e);s.not_synced="mark"===o?[...t,"column_widths"]:t}t(s)},a={row:{...e,columns:o},setLayout:e=>s(t=>{const i=o.map(e=>e&&"object"==typeof e?{...e}:$());_({columns:i},e,$),i.length!==o.length&&(t.columns=i),t.layout=e,delete t.column_widths},"mark"),setWidths:(e,t)=>s(i=>{e?.length?i.column_widths=[...e]:delete i.column_widths,t&&(i.layout=t)},e?.length?"keep":t?"mark":"reset"),sync:i?(0,kt.pZ)("column_widths",i):n.s6};return n.qy`
    <div class="group">
      ${ks(a)}
      ${o.length>1?As(a):n.s6}
      ${(0,kt.lm)((0,h.t)(412),e.gap,i=>t({...e,gap:i||void 0}),"gap",i,"8")}
      ${(0,kt.Mg)((0,h.t)(719),e.padding,i=>t({...e,padding:i}),"padding","padding",i)}
    </div>
  `}(e,i,Nn(e,o))},Rs={type:"tabs",general(e,t,i,o){const s=Nn(e,o),a=e,r=a.tabs||[];return n.qy`
      <div class="mc-tab-content">
        ${(0,kt.De)((0,h.t)(1027),a.tab_style,[{label:(0,h.t)(276),value:"default"},{label:(0,h.t)(757),value:"pills"},{label:(0,h.t)(1119),value:"underline"}],e=>i({...a,tab_style:e}),"tab_style",s)}
        ${r.length>1?(0,kt.De)((0,h.t)(278),String(Math.min(a.active_tab??0,r.length-1)),r.map((e,t)=>({label:e.label||(0,h.t)(1028,{n:t+1}),value:String(t)})),e=>i({...a,active_tab:Number(e)}),"active_tab",s):n.s6}
        ${r.some(e=>e.icon)?Io(a,t,i,{icon:r.find(e=>e.icon)?.icon??"",syncCtx:s}):n.s6}
        <p class="help">${(0,h.t)(55)}</p>
      </div>
    `}},Ps={type:"separator",tabs:["general","conditions","design"],general(e,t,i,o){const s=Nn(e,o),a=e;return n.qy`
      <div class="mc-tab-content">
        ${(0,kt.De)((0,h.t)(305),a.direction,[{label:(0,h.t)(455),value:"horizontal"},{label:(0,h.t)(1166),value:"vertical"}],e=>i({...a,direction:e}),"direction",s)}
        ${(0,kt.De)((0,h.t)(1017),a.separator_style,[{label:(0,h.t)(983),value:"solid"},{label:(0,h.t)(271),value:"dashed"},{label:(0,h.t)(313),value:"dotted"},{label:(0,h.t)(660),value:"none"}],e=>i({...a,separator_style:e}),"separator_style",s)}
        ${(0,kt.Yd)((0,h.t)(205),a.separator_color,e=>i({...a,separator_color:e}),"separator_color",s)}
        ${(0,kt.lm)((0,h.t)(1188),a.separator_width,e=>i({...a,separator_width:e||void 0}),"separator_width",s,"1")}
      </div>
    `}},Hs={type:"slider-layout",general(e,t,i,o){const s=Nn(e,o),a=e;return n.qy`
      <div class="mc-tab-content">
        ${(0,kt.vm)((0,h.t)(720),!1!==a.pagination,e=>i({...a,pagination:e}),"pagination",s)}
        ${(0,kt.vm)((0,h.t)(624),!1!==a.navigation,e=>i({...a,navigation:e}),"navigation",s)}
        ${(0,kt.aA)((0,h.t)(974),a.slides_per_view??1,e=>i({...a,slides_per_view:e>0?e:1}),{min:1,max:6,step:.1},"slides_per_view",s)}
        ${(0,kt.aA)((0,h.t)(989),a.space_between??8,e=>i({...a,space_between:e>=0?e:0}),{min:0,step:1},"space_between",s)}
        ${(0,kt.vm)((0,h.t)(554),a.loop,e=>i({...a,loop:e}),"loop",s,(0,h.t)(58))}
        ${(0,kt.vm)((0,h.t)(117),a.autoplay,e=>i({...a,autoplay:e}),"autoplay",s)}
        ${a.autoplay?(0,kt.aA)((0,h.t)(118),a.autoplay_delay??5e3,e=>i({...a,autoplay_delay:e}),{min:1e3,step:500},"autoplay_delay",s):n.s6}
      </div>
    `}};var Is=i(796),Vs=i(9219);const Ds=new Set,Fs={type:"clock",tabs:["general","conditions","design"],general(e,t,i,o){const s=Nn(e,o),a=e,r=void 0===a.format_12h?"auto":a.format_12h?"12":"24",l=(0,Vs.bE)(a.date_format),c=Ds.has(a.id)||!((0,Vs.S1)(l)||"iso"===l),d=new Date,u=e=>(0,Vs.GC)(d,e,t);return n.qy`
      <div class="mc-tab-content">
        ${(0,kt.De)((0,h.t)(1100),r,[{label:(0,h.t)(115,{format:(0,Is.oE)(t)?(0,h.t)(8):(0,h.t)(9)}),value:"auto"},{label:(0,h.t)(8),value:"12"},{label:(0,h.t)(9),value:"24"}],e=>{const t={...a};"auto"===e?delete t.format_12h:t.format_12h="12"===e,i(t)},"format_12h",s)}
        ${(0,kt.vm)((0,h.t)(947),a.show_seconds,e=>i({...a,show_seconds:e}),"show_seconds",s)}
        ${(0,kt.vm)((0,h.t)(935),!1!==a.show_date,e=>i({...a,show_date:e}),"show_date",s)}
        ${!1!==a.show_date?n.qy`
            ${(0,kt.De)((0,h.t)(272),c?"custom":l,[{label:(0,h.t)(921,{example:u("short")}),value:"short"},{label:(0,h.t)(583,{example:u("medium")}),value:"medium"},{label:(0,h.t)(551,{example:u("long")}),value:"long"},{label:(0,h.t)(678,{example:u("numeric")}),value:"numeric"},{label:(0,h.t)(465,{example:u("iso")}),value:"iso"},{label:(0,h.t)(261),value:"custom"}],e=>{"custom"===e?Ds.add(a.id):Ds.delete(a.id),i({...a,date_format:"custom"===e?"ddd D MMM YYYY":e})},"date_format",s)}
            ${c?n.qy`
                ${(0,kt.Gz)((0,h.t)(273),a.date_format,e=>{Ds.add(a.id),i({...a,date_format:e})},"date_format",s,{mono:!0})}
                ${(0,kt.m1)((0,h.t)(1203))}
              `:n.s6}
          `:n.s6}
      </div>
    `}};var Ns=i(98);const Zs={type:"weather",entityField:!0,general(e,t,i,o,s){const a=Nn(e,o),r=e,l=Zn(r,s),c=l?t?.states[l]:void 0,d=c?(0,Ns.lA)(c):[];return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(1179),r,i,t,s,{domain:"weather",syncCtx:a})}
        ${(0,kt.vm)((0,h.t)(950),!1!==r.show_temperature,e=>i({...r,show_temperature:e}),"show_temperature",a)}
        ${(0,kt.vm)((0,h.t)(933),!1!==r.show_condition,e=>i({...r,show_condition:e}),"show_condition",a)}
        ${(0,kt.vm)((0,h.t)(81),!1!==r.animated_icons,e=>i({...r,animated_icons:e}),"animated_icons",a,(0,h.t)(83))}
        ${!1!==r.animated_icons?(0,kt.m1)(Ho(r.icon_fx)):Io(r,t,i,{entity:l,icon:"",syncCtx:a})}
        ${(0,kt.vm)((0,h.t)(937),r.show_forecast,e=>i({...r,show_forecast:e}),"show_forecast",a)}
        ${r.show_forecast?(0,kt.aA)((0,h.t)(400),r.forecast_days,e=>i({...r,forecast_days:e}),{min:1,max:14},"forecast_days",a):n.s6}
        ${r.show_forecast&&c&&d.length&&!d.includes("daily")?(0,kt.m1)((0,h.t)(1079)):n.s6}
      </div>
    `}},Bs={daily:269,hourly:457,twice_daily:1116},Ks={type:"forecast",entityField:!0,general(e,t,i,o,s){const a=Nn(e,o),r=e,l=Zn(r,s),c=l?t?.states[l]:void 0,d=c?(0,Ns.lA)(c):[],u=r.forecast_type??"daily",p=c&&d.length&&!d.includes(u)?d[0]:void 0;return n.qy`
      <div class="mc-tab-content">
        ${Ot((0,h.t)(1179),r,i,t,s,{domain:"weather",syncCtx:a})}
        ${(0,kt.De)((0,h.t)(401),u,["daily","hourly","twice_daily"].map(e=>({label:c&&d.length&&!d.includes(e)?(0,h.t)(1309,{type:(0,h.t)(Bs[e])}):(0,h.t)(Bs[e]),value:e})),e=>i({...r,forecast_type:e}),"forecast_type",a)}
        ${p?(0,kt.m1)((0,h.t)(1081,{type:(0,h.t)(Bs[u]).toLowerCase(),fallback:(0,h.t)(Bs[p]).toLowerCase()})):n.s6}
        ${(0,kt.aA)((0,h.t)(677),r.num_forecasts,e=>i({...r,num_forecasts:e}),{min:1,max:48},"num_forecasts",a)}
        ${(0,kt.vm)((0,h.t)(81),!1!==r.animated_icons,e=>i({...r,animated_icons:e}),"animated_icons",a,(0,h.t)(83))}
        ${!1!==r.animated_icons?(0,kt.m1)(Ho(r.icon_fx)):Io(r,t,i,{entity:l,icon:"",syncCtx:a})}
        ${(0,kt.vm)((0,h.t)(950),!1!==r.show_temperature,e=>i({...r,show_temperature:e}),"show_temperature",a)}
        ${(0,kt.vm)((0,h.t)(946),!1!==r.show_precipitation,e=>i({...r,show_precipitation:e}),"show_precipitation",a)}
        ${(0,kt.vm)((0,h.t)(959),r.show_wind,e=>i({...r,show_wind:e}),"show_wind",a)}
      </div>
    `}},Ws={type:"video-bg",tabs:["general","conditions","design"],general(e,t,i,o){const s=Nn(e,o),a=e;return n.qy`
      <div class="mc-tab-content">
        ${(0,kt.m1)((0,h.t)(764))}
        ${(0,kt.nZ)((0,h.t)(1169),a.url,e=>i({...a,url:e}),t,"video","url",s)}
        ${(0,kt.nZ)((0,h.t)(770),a.poster,e=>i({...a,poster:e}),t,"image","poster",s)}
        ${(0,kt.m1)((0,h.t)(963))}
        ${(0,kt.Wn)((0,h.t)(390),a.fit??"cover",[{label:(0,h.t)(251),value:"cover"},{label:(0,h.t)(230),value:"contain"}],e=>i({...a,fit:e}),"fit",s)}
        ${(0,kt.vm)((0,h.t)(117),!1!==a.autoplay,e=>i({...a,autoplay:e}),"autoplay",s,(0,h.t)(765))}
        ${(0,kt.vm)((0,h.t)(554),!1!==a.loop,e=>i({...a,loop:e}),"loop",s)}
        ${(0,kt.vm)((0,h.t)(612),!1!==a.muted,e=>i({...a,muted:e}),"muted",s,(0,h.t)(152))}
      </div>
    `}};var Us=i(8258),Gs=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const Ys=["entity: sensor.temperature","name: My Sensor","show_state: true"].join("\n");let Qs=class extends n.WF{constructor(){super(...arguments),this.schema=[],this._label=e=>this.computeLabel?.(e,this._localize)||(e.name?this._localize?.(`ui.panel.lovelace.editor.card.generic.${e.name}`):"")||e.name||"",this._helper=e=>this.computeHelper?.(e,this._localize)}createRenderRoot(){return this}setConfig(e){this.assertConfig?.(e),this._config=e}get _localize(){return this.hass?.localize}_changed(e){e.stopPropagation();const t=e.detail?.value;t&&(this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:t}})))}render(){return n.qy`<ha-form
      .hass=${this.hass}
      .data=${this._config}
      .schema=${this.schema}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${this._changed}
    ></ha-form>`}};Gs([(0,o.MZ)({attribute:!1})],Qs.prototype,"hass",void 0),Gs([(0,o.MZ)({attribute:!1})],Qs.prototype,"schema",void 0),Gs([(0,o.wk)()],Qs.prototype,"_config",void 0),Qs=Gs([(0,o.EM)("mc-card-form-editor")],Qs);let Js=class extends n.WF{constructor(){super(...arguments),this._status="idle",this._yamlMode=!1,this._synced="",this._emitted=[],this._generation=0}createRenderRoot(){return this}willUpdate(){const e=this.config?.card_type||void 0;e!==this._editorType&&this._load(e)}updated(){const e=this._editor,t=this.config;if(!e||"ready"!==this._status||!t?.card_type)return;this.hass&&(e.hass=this.hass);const i=(0,Us._Y)((0,Us.k2)(t.card_type,t.card_config)),n=this._emitted.indexOf(i);if(-1===n){if(i!==this._synced){let n;this._emitted=[],this._synced=i;try{e.setConfig?.(JSON.parse(JSON.stringify((0,Us.k2)(t.card_type,t.card_config))))}catch(e){n=e instanceof Error?e.message:String(e)}n!==this._guiError&&(this._guiError=n)}}else this._emitted.splice(0,n+1)}async _load(e){const t=++this._generation;if(this._editorType=e,this._editor=void 0,this._synced="",this._emitted=[],this._guiError=void 0,!e)return void(this._status="idle");let i;this._status="loading";try{i=await this._createEditor(e)}catch{i=void 0}t===this._generation&&(i&&i.addEventListener("config-changed",t=>{if(t.stopPropagation(),i!==this._editor||!this.isConnected)return;const n=t.detail?.config,o=this.config;if(!o||!n||"object"!=typeof n||Array.isArray(n))return;const{type:s,...a}=n;this._synced=(0,Us._Y)((0,Us.k2)(e,a)),this._emitted.push(this._synced),this.onChange?.({...o,card_config:a,card_config_yaml:void 0})}),this._editor=i,this._status="ready")}async _createEditor(e){const t=await async function(e,t){if(e.startsWith("custom:")){const t=e.slice(7);return await(0,Us.IC)(t),customElements.get(t)}const i=`hui-${e}-card`;if(!customElements.get(i)){const e=(0,Us.cy)();if(!e)return;const n=(await e).createCardElement(t);if(!customElements.get(i)&&n.localName!==i)return;await(0,Us.IC)(i)}return customElements.get(i)}(e,(0,Us.k2)(e,this.config?.card_config));let i;return"function"==typeof t?.getConfigElement&&(i=await t.getConfigElement()??void 0,i?.localName?.includes("-")&&await(0,Us.IC)(i.localName)),i||"function"!=typeof t?.getConfigForm||(i=await async function(e){if(!Array.isArray(e?.schema))return;const t=customElements.get("hui-form-editor")?"hui-form-editor":"mc-card-form-editor";if("mc-card-form-editor"===t&&!customElements.get("ha-form"))try{await(0,Us.IC)("ha-form")}catch{return}const i=document.createElement(t);return i.schema=e.schema,e.computeLabel&&(i.computeLabel=e.computeLabel),e.computeHelper&&(i.computeHelper=e.computeHelper),e.assertConfig&&(i.assertConfig=e.assertConfig),i}(await t.getConfigForm())),i&&this.hass&&(i.hass=this.hass),i??void 0}_renderYaml(e,t){const i=e.card_config_yaml??(e.card_config?(0,A.fE)(e.card_config):""),o=(0,A.EA)(i),s=""===i||null!==o;return n.qy`
      <div class="mc-yaml-fallback">
        ${t?n.qy`<div class="mc-yaml-fallback-note">${t}</div>`:n.s6}
        <textarea
          .value=${i}
          @input=${t=>{const i=t.target.value,n=this.config??e,o=(0,A.EA)(i);null===o||"object"!=typeof o||Array.isArray(o)?this.onChange?.({...n,card_config_yaml:i}):this.onChange?.({...n,card_config:o,card_config_yaml:i})}}
          rows="12"
          placeholder=${Ys}
        ></textarea>
        ${s?n.s6:n.qy`<div class="mc-yaml-fallback-error">
              ${(0,h.t)(497)}
            </div>`}
        <div class="mc-yaml-fallback-help">
          ${(0,h.tx)(1070,{key:n.qy`<code>type</code>`})}
        </div>
      </div>
    `}_renderToggle(e){return n.qy`<div class="mc-card-editor-toolbar">
      <button
        type="button"
        class="mc-btn mc-btn-secondary mc-btn-compact mc-card-editor-toggle"
        ?disabled=${!e&&!!this._guiError}
        @click=${()=>{this._yamlMode=e}}
      >
        ${e?(0,h.t)(930):(0,h.t)(958)}
      </button>
    </div>`}render(){const e=this.config;return e?.card_type?"ready"!==this._status?n.qy`<div class="mc-editor-loading">${(0,h.t)(540)}</div>`:this._editor?this._yamlMode||this._guiError?n.qy`${this._renderToggle(!1)}${this._renderYaml(e,this._guiError?(0,h.t)(1068,{error:this._guiError}):void 0)}`:n.qy`${this._renderToggle(!0)}${this._editor}`:this._renderYaml(e,(0,h.t)(659)):n.s6}};Gs([(0,o.MZ)({attribute:!1})],Js.prototype,"config",void 0),Gs([(0,o.MZ)({attribute:!1})],Js.prototype,"hass",void 0),Gs([(0,o.MZ)({attribute:!1})],Js.prototype,"onChange",void 0),Gs([(0,o.wk)()],Js.prototype,"_status",void 0),Gs([(0,o.wk)()],Js.prototype,"_yamlMode",void 0),Gs([(0,o.wk)()],Js.prototype,"_guiError",void 0),Js=Gs([(0,o.EM)("mc-custom-card-editor")],Js);const Xs={type:"custom-card",tabs:["general","conditions","design"],general(e,t,i,o){const s=Nn(e,o),a=e;return n.qy`
      <div class="mc-tab-content">
        ${(0,kt.Gz)((0,h.t)(618),a.name,e=>i({...a,name:e}),"name",s)}
        ${(0,kt.m1)((0,h.t)(75),"mc-field-hint-tight")}
        ${(0,kt.pA)((0,h.t)(180),a.card_type,e=>i({...a,card_type:e}))}
        ${a.card_type?n.qy`
            <div class="mc-card-editor-section">
              <div class="mc-card-editor-header">
                <ha-icon class="mc-card-editor-icon" icon="mdi:cog"></ha-icon>
                ${(0,h.t)(171)}
              </div>
              <div class="mc-card-editor-body">
                <mc-custom-card-editor .config=${a} .hass=${t} .onChange=${i}></mc-custom-card-editor>
              </div>
            </div>
          `:n.s6}
      </div>
    `}};for(const e of[xo,Vo,Fo,Bo,Ko,Wo,Uo,Go,Qo,cs,us,ms,fs,vs,bs,ys,Os,Rs,Ps,Hs,Fs,Zs,Ks,Ws,Xs])Jn.register(e);var ea=i(1987),ta=i(2873),ia=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const na=[{value:"sheet",label:918},{value:"dialog",label:303}];let oa=class extends n.WF{constructor(){super(...arguments),this.canvas=!1,this._status=""}disconnectedCallback(){super.disconnectedCallback(),window.clearTimeout(this._statusTimer)}get _p(){return this.popup&&"object"==typeof this.popup?this.popup:{}}_set(e){const t={...this._p,...e};for(const[e,i]of Object.entries(t))(void 0===i||""===i||"number"==typeof i&&Number.isNaN(i))&&delete t[e];this.onChange?.(t)}_say(e){this._status=e,window.clearTimeout(this._statusTimer),this._statusTimer=window.setTimeout(()=>{this._status=""},2500)}_field(e,t,i,o,s=n.s6){const a=t?this._p[t]:void 0,r=void 0!==a&&""!==a;return n.qy`
      <div class="field">
        <div class="field-head">
          ${o?n.qy`<label for=${o}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}
          ${t?(0,Jt.i)(e,r,()=>this._set({[t]:void 0})):n.s6}
        </div>
        ${i}${s}
      </div>
    `}_text(e,t,i,o=!1){return n.qy`<input
      class="input ${o?"mono":""}"
      id=${e}
      type="text"
      spellcheck=${o?"false":n.s6}
      autocomplete="off"
      placeholder=${i}
      .value=${this._p[t]||""}
      @input=${e=>{const i=e.target.value;this._set({[t]:"hash"===t?(0,It.oi)(i):i})}}
    />`}_unit(e,t,i,o){return n.qy`<mc-unit-field
      .value=${this._p[e]||""}
      .label=${t}
      .units=${i}
      .placeholder=${o}
      @value-changed=${t=>this._set({[e]:t.detail.value})}
    ></mc-unit-field>`}_seg(e,t,i,o){return n.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=i.findIndex(e=>e.value===t),s={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in s))return;e.preventDefault();const a=i[(n+s[e.key]+i.length)%i.length].value,r=e.currentTarget;o(a),requestAnimationFrame(()=>r.querySelector(`[data-val="${a}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return n.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>o(e.value)}
        >${(0,h.t)(e.label)}</button>`})}
    </div>`}_trigger(e,t,i){const o=this._p[e]||{},s=t=>{const i={...this._p[e]||{},...t};for(const[e,t]of Object.entries(i))void 0!==t&&""!==t||delete i[e];this._set({[e]:Object.keys(i).length?i:void 0})},a=`popup-${e}-state`;return n.qy`
      <div class="field">
        <div class="field-head">
          <span class="lbl">${t}</span>
          ${(0,Jt.i)(t,!(!o.entity&&!o.state),()=>this._set({[e]:void 0}))}
        </div>
        <div class="trigger">
          <mc-entity-picker
            .hass=${this.hass}
            .value=${o.entity||""}
            .label=${(0,h.t)(357)}
            @value-changed=${e=>s({entity:e.detail.value})}
          ></mc-entity-picker>
          <input
            class="input"
            id=${a}
            type="text"
            aria-label=${(0,h.t)(1257,{label:t})}
            placeholder=${(0,h.t)(1007)}
            .value=${o.state||""}
            @input=${e=>s({state:e.target.value.trim()})}
          />
        </div>
        <p class="help">${i}</p>
      </div>
    `}async _copy(e){try{await navigator.clipboard.writeText(e),this._say((0,h.t)(627))}catch{this._say((0,h.t)(238))}}async _preview(){await ta.tQ.popup.load(),this._say((0,Vt.T)()?.api.preview(this.canvas)?"":(0,h.t)(650))}render(){const e=this._p,t=(0,It.oi)(e.hash),i=t&&!(0,It.BI)(t)?(0,h.t)(1150):"",o=(0,It.BI)(t)?`#${t}`:"",s=e.backdrop_opacity,a=i?n.qy`<p class="help error" role="alert">${i}</p>`:o?n.qy`
            <div class="path">
              <span class="help">${(0,h.t)(626)}</span>
              <code>${o}</code>
              <button type="button" class="icon-btn sm" aria-label=${(0,h.t)(240)} title=${(0,h.t)(240)} @click=${()=>this._copy(o)}>
                <ha-icon icon="mdi:content-copy"></ha-icon>
              </button>
            </div>
            <p class="help">${(0,h.tx)(696,{path:n.qy`<span class="mono">${o}</span>`})}</p>
          `:n.qy`<p class="help">${(0,h.t)(1195)}</p>`;return n.qy`
      <div class="popup-ed">
        ${this._field((0,h.t)(768),"hash",this._text("popup-hash","hash","kitchen",!0),"popup-hash",a)}
        ${this._field((0,h.t)(1102),"title",this._text("popup-title","title",(0,h.t)(641)),"popup-title")}
        ${this._field((0,h.t)(1017),"style",this._seg((0,h.t)(1017),"dialog"===e.style?"dialog":"sheet",(0,h.tl)(na),e=>this._set({style:e})))}
        <div class="two">
          ${this._field((0,h.t)(1188),"width",this._unit("width",(0,h.t)(1188),["px","%","vw","rem","em"],It.Uh.width.replace("px","")))}
          ${this._field((0,h.t)(576),"max_height",this._unit("max_height",(0,h.t)(576),["vh","px","%","rem"],It.Uh.max_height.replace("vh","")))}
        </div>
        <div class="two">
          ${this._field((0,h.t)(123),"backdrop_blur",this._unit("backdrop_blur",(0,h.t)(123),["px"],It.Uh.backdrop_blur.replace("px","")))}
          ${this._field((0,h.t)(124),"backdrop_opacity",n.qy`<input
              class="input"
              id="popup-opacity"
              type="number"
              min="0"
              max="100"
              step="5"
              placeholder=${String(100*It.Uh.backdrop_opacity)}
              aria-describedby="popup-opacity-unit"
              .value=${void 0===s?"":String(Math.round(100*(s>1?s/100:s)))}
              @input=${e=>{const t=e.target.value;this._set({backdrop_opacity:""===t?void 0:Math.min(100,Math.max(0,Number(t)))/100})}}
            /><p class="help" id="popup-opacity-unit">${(0,h.t)(734)}</p>`,"popup-opacity")}
        </div>
        <div class="switch-row">
          <div class="txt"><div class="field-head"><label>${(0,h.t)(929)}</label></div></div>
          <button
            type="button"
            class="switch"
            role="switch"
            aria-checked=${!1!==e.show_close?"true":"false"}
            aria-label=${(0,h.t)(929)}
            @click=${()=>this._set({show_close:!1===e.show_close&&void 0})}
          ></button>
        </div>
        ${this._field((0,h.t)(110),"auto_close",n.qy`<input
            class="input"
            id="popup-auto"
            type="number"
            min="0"
            step="1"
            placeholder=${(0,h.t)(680)}
            .value=${e.auto_close?String(e.auto_close):""}
            @input=${e=>{const t=e.target.value,i=Number(t);this._set({auto_close:""!==t&&i>0?i:void 0})}}
          /><p class="help">${(0,h.t)(889)}</p>`,"popup-auto")}
        ${this._trigger("open_on",(0,h.t)(699),(0,h.t)(701))}
        ${this._trigger("close_on",(0,h.t)(199),(0,h.t)(201))}
        <div class="actions">
          <button type="button" class="btn btn-secondary btn-sm" @click=${()=>this._preview()}>
            <ha-icon icon="mdi:eye-outline"></ha-icon>${(0,h.t)(778)}
          </button>
          <span class="help" role="status" aria-live="polite">${this._status}</span>
        </div>
      </div>
    `}};oa.styles=[l.x,n.AH`
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
    `],ia([(0,o.MZ)({attribute:!1})],oa.prototype,"popup",void 0),ia([(0,o.MZ)({attribute:!1})],oa.prototype,"hass",void 0),ia([(0,o.MZ)({type:Boolean})],oa.prototype,"canvas",void 0),ia([(0,o.MZ)({attribute:!1})],oa.prototype,"onChange",void 0),ia([(0,o.wk)()],oa.prototype,"_status",void 0),oa=ia([(0,o.EM)("mc-popup-settings")],oa);const sa=["icon","button","info","light","weather","image","camera","gauge"];var aa=i(4204),ra=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const la=e=>{const t=e.replace(/\s*\([^)]*\)$/,"");return t.charAt(0).toLowerCase()+t.slice(1)},ca=[{value:"curve",label:254},{value:"straight",label:1013},{value:"elbow",label:343}],da=[{value:"auto",label:108},{value:"top",label:1109},{value:"right",label:838},{value:"bottom",label:142},{value:"left",label:516}],ha=[{value:"icon",label:471},{value:"box",label:592}],ua=[{value:"none",label:660},{value:"value",label:1161},{value:"template",label:1034}],pa=[{value:"auto",label:108},{value:"line",label:685},{value:"side",label:137},{value:"hidden",label:442}],ma=[{value:"always",label:66},{value:"flowing",label:1184}],ga=[{value:"back",label:120},{value:"front",label:407}];let fa=class extends n.WF{constructor(){super(...arguments),this.expanded=new Set,this._look=os()?"ready":"idle",this._ownSections=new Map,this._ownUndo=new Map}willUpdate(){"idle"===this._look&&this.expanded.size&&this._loadLook()}_loadLook(e=!1){this._look="loading",ns().then(e=>{this._look=e?"ready":"failed"}),e&&this.updateComplete.then(()=>this.renderRoot.querySelector(".skeleton")?.focus())}_sectionOpen(e,t,i){return(this.sections??this._ownSections).get(`${e}|${t}`)??i}_setSection(e,t,i){const n=`${e}|${t}`;this.onSection?this.onSection(n,i):(this._ownSections.set(n,i),this.requestUpdate())}_lookOpen(e){const t=`${e}|look:`,i=new Set;for(const[e,n]of this.sections??this._ownSections)n&&e.startsWith(t)&&i.add(e.slice(t.length));return i}_snapshot(e){return(this.undoSnapshots??this._ownUndo).get(e)}_setSnapshot(e,t){this.onUndoSnapshot?this.onUndoSnapshot(e,t):(t?this._ownUndo.set(e,t):this._ownUndo.delete(e),this.requestUpdate())}get _flows(){const e=this.config?.flows;return Array.isArray(e)?e:[]}_write(e){if(!this.config)return;const t=(0,oe.rP)(this._flows),i=(0,c.G)(this.config),n=e(i,(i.flows??[]).map(e=>({...e})));n.length?i.flows=n:delete i.flows,n.length===t.length&&(0,oe.rP)(n).forEach((e,i)=>{e!==t[i]&&this.onRekey?.(t[i],e)}),this.onChange?.(i)}_patch(e,t,i){this._write((n,o)=>{const s=i?i(n):{},a={...o[e],...t,...s};for(const[e,i]of Object.entries({...t,...s}))(void 0===i||""===i||"number"==typeof i&&Number.isNaN(i))&&delete a[e];return o[e]=a,o})}_replace(e,t){this._write((i,n)=>(n[e]=t,n))}_add(){const e=te();this._write((t,i)=>[...i,e]),this.expanded.has(e.id)||this.onToggle?.(e.id)}_remove(e){const t=(0,oe.rP)(this._flows),i=t[e];this.expanded.has(i)&&this.onToggle?.(i);const n=(0,oe.rP)(this._flows.filter((t,i)=>i!==e));for(let i=e;i<n.length;i++)t[i+1]!==n[i]&&this.onRekey?.(t[i+1],n[i]);this._write((t,i)=>i.filter((t,i)=>i!==e))}_field(e,t,i,o,s){return n.qy`
      <div class="field">
        <div class="field-head">
          ${s?n.qy`<label for=${s}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}
          ${i?(0,Jt.i)(la(e),t,i):n.s6}
        </div>
        ${o}
      </div>
    `}_keyField(e,t,i,n,o,s){const a=t[i];return this._field(n,void 0!==a&&""!==a,()=>this._patch(e,{[i]:void 0}),o,s)}_seg(e,t,i,o,s){return n.qy`<div class="seg full" role="radiogroup" aria-label=${e} aria-describedby=${s||n.s6} @keydown=${e=>{const n=i.findIndex(e=>e.value===t),s="rtl"===(0,Ge.k)(e.currentTarget)?-1:1,a={ArrowRight:s,ArrowDown:1,ArrowLeft:-s,ArrowUp:-1};if(!(e.key in a))return;e.preventDefault();const r=i[(n+a[e.key]+i.length)%i.length].value,l=e.currentTarget;o(r),requestAnimationFrame(()=>l.querySelector(`[data-val="${r}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return n.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>o(e.value)}
        >${e.label}</button>`})}
    </div>`}_select(e,t,i,o,s,a){return n.qy`<div class="select">
      <select class="input" id=${e} aria-label=${a||n.s6} aria-describedby=${s||n.s6} @change=${e=>o(e.target.value)}>
        ${i.map(e=>n.qy`<option value=${e.value} ?selected=${e.value===t} ?disabled=${!!e.disabled} title=${e.title??n.s6}>${e.label}</option>`)}
      </select>
      <ha-icon icon="mdi:chevron-down"></ha-icon>
    </div>`}_number(e,t,i,o,s,a,r,l=1,c){const d=t[i];return n.qy`<input
      class="input"
      id=${o}
      type="number"
      min=${a??n.s6}
      max=${r??n.s6}
      step=${l}
      placeholder=${String(s)}
      aria-describedby=${c||n.s6}
      .value=${void 0===d?"":String(d)}
      @input=${t=>{const n=t.target.value,o=Number(n);""!==n.trim()&&Number.isFinite(o)&&this._patch(e,{[i]:o})}}
      @change=${t=>{const n=t.target;""!==n.value.trim()||n.validity?.badInput||this._patch(e,{[i]:void 0})}}
    />`}_switch(e,t,i,o,s,a){const r=t[i],l=r??s,c=`flow-${e}-${i}-help`;return n.qy`
      <div class="switch-row">
        <div class="txt">
          <div class="field-head">
            <span class="lbl">${o}</span>
            ${(0,Jt.i)(la(o),void 0!==r,()=>this._patch(e,{[i]:void 0}))}
          </div>
          ${a?n.qy`<p class="help" id=${c}>${a}</p>`:n.s6}
        </div>
        <button
          type="button"
          class="switch"
          role="switch"
          aria-checked=${l?"true":"false"}
          aria-label=${o}
          aria-describedby=${a?c:n.s6}
          @click=${()=>this._patch(e,{[i]:l===s?!s:void 0})}
        ></button>
      </div>
    `}_entityColor(e){const t=e.entity||(this.config&&"string"==typeof e.from?(0,oe.kc)(this.config).get(e.from):void 0)||"";return t?(0,oi.id)(this.hass?.states?.[t])??"":""}_color(e,t,i,o){const s=this._entityColor(t);return this._keyField(e,t,i,o,n.qy`<mc-color-picker
        .value=${t[i]||""}
        .label=${o}
        .allowEntity=${"color"===i}
        .entityColor=${s}
        @value-changed=${t=>this._patch(e,{[i]:t.detail.value})}
      ></mc-color-picker>`)}_endpoint(e,t,i,o){const s=`flow-${e}-${i}`,a="from"===i?(0,h.t)(403):(0,h.t)(1103),r="string"==typeof t[i]?t[i]:"",l="from"===i?t.to:t.from,c=!r||o.some(e=>e.id===r),d=o.filter(e=>!l||e.id!==l),u=d.some(e=>e.locked),p=[...r?[]:[{value:"",label:(0,h.t)(737),disabled:!0}],...c?[]:[{value:r,label:(0,h.t)(597,{id:r})}],...d.map(e=>e.locked?{value:e.value,label:(0,h.t)(1253,{label:e.label}),disabled:!0,title:(0,h.t)(418)}:{value:e.value,label:e.label})],m=`${s}-hint`,g=`${s}-locked`,f=[r&&c?"":m,u?g:""].filter(Boolean).join(" ");return n.qy`
      ${this._field(a,!1,void 0,this._select(s,r,p,t=>{t&&this._patch(e,{},e=>({[i]:ee(e,t)}))},f),s)}
      ${r?c?n.s6:n.qy`<p class="help error" id=${m}>${(0,h.t)(596)}</p>`:n.qy`<p class="help" id=${m}>${"from"===i?(0,h.t)(748):(0,h.t)(747)}</p>`}
      ${u?n.qy`<p class="help" id=${g}>${(0,h.t)(600,{hint:(0,h.t)(418)})}</p>`:n.s6}
      ${this._anchorField(e,t,i,o)}
    `}_anchorable(e,t,i){const n=e[t],o="string"==typeof n&&n?i.find(e=>e.value===n)?.type:void 0;return!!o&&sa.includes(o)}_anchorField(e,t,i,o){if(!this._anchorable(t,i,o))return n.s6;const s=`${i}_anchor`,a=`flow-${e}-${i}-anchor`,r=(0,aa.Rk)(t)?"box":"icon",l="box"===t[s]?"box":"icon"===t[s]?"icon":r;return this._keyField(e,t,s,(0,h.t)(104),this._select(a,l,(0,h.tl)(ha),t=>this._patch(e,{[s]:t===r?void 0:t}),`flow-${e}-anchor-help`,"from"===i?(0,h.t)(1e3):(0,h.t)(354)),a)}_lookFallback(e,t){const i=t=>`flow-${e}-${t}`;return n.qy`
      ${this._color(e,t,"color",(0,h.t)(205))} ${this._color(e,t,"idle_color",(0,h.t)(480))}
      <div class="two">
        ${this._keyField(e,t,"width",(0,h.t)(1189),this._number(e,t,"width",i("width"),oe.Y1.width,.5,40,.5),i("width"))}
        ${this._keyField(e,t,"glow",(0,h.t)(421),this._number(e,t,"glow",i("glow"),oe.Y1.glow,0,30),i("glow"))}
      </div>
      ${this._switch(e,t,"scale_width",(0,h.t)(872),oe.Y1.scale_width,(0,h.t)(1129))}
      <div class="two">
        ${this._keyField(e,t,"dots",(0,h.t)(312),this._number(e,t,"dots",i("dots"),oe.Y1.dots,0,8,1,0===t.dots?i("dots-help"):void 0),i("dots"))}
        ${this._keyField(e,t,"dot_size",(0,h.t)(311),this._number(e,t,"dot_size",i("dot-size"),oe.Y1.dot_size,1,40),i("dot-size"))}
      </div>
      ${0===t.dots?n.qy`<p class="help" id=${i("dots-help")}>${(0,h.t)(4)}</p>`:n.s6}
    `}_lookGroup(e,t,i){return"ready"===this._look&&customElements.get(Jo._6)?n.qy`<mc-flow-look-editor
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
      ></mc-flow-look-editor>`:"ready"===this._look?this._lookFallback(e,t):"failed"===this._look?n.qy`
        ${(0,Xo.lm)({tone:"warn",text:(0,h.t)(247),action:{label:(0,h.t)(1114),onClick:()=>this._loadLook(!0)}})}
        ${this._lookFallback(e,t)}
      `:n.qy`<div class="skeleton" role="status" aria-busy="true" tabindex="-1">
      <span>${(0,h.t)(543)}</span>
      <div class="bar"></div>
    </div>`}_fold(e,t,i,o,s,a){return n.qy`<mc-ui-disclosure
      level="5"
      .heading=${i}
      .summary=${o}
      .open=${this._sectionOpen(e,t,s)}
      @mc-toggle=${i=>this._setSection(e,t,i.detail.open)}
    >
      <div class="grp-body">${a}</div>
    </mc-ui-disclosure>`}_body(e,t,i,o){const s=t=>`flow-${e}-${t}`,a=t.label??oe.Y1.label,r=t.entity||"",l=r&&this.hass?.states?.[r]?Object.keys(this.hass.states[r].attributes||{}):[],c=t.route??oe.Y1.route,d=["attribute","min","max","reverse_negative","route","from_side","to_side","speed","min_speed"].some(e=>void 0!==t[e]&&""!==t[e]),u=(e,t)=>((0,h.tl)(e).find(e=>e.value===t)??(0,h.tl)(e)[0]).label;return n.qy`
      <div class="body">
        <section class="grp" aria-labelledby=${s("h-conn")}>
          <h4 class="grp-h" id=${s("h-conn")}>${(0,h.t)(229)}</h4>
          <div class="two">
            <div>${this._endpoint(e,t,"from",i)}</div>
            <div>${this._endpoint(e,t,"to",i)}</div>
          </div>
          ${this._anchorable(t,"from",i)||this._anchorable(t,"to",i)?n.qy`<p class="help" id=${s("anchor-help")}>${(0,h.t)(472)}${(0,aa.Rk)(t)?" "+(0,h.t)(1084):""}</p>`:n.s6}
          ${this._keyField(e,t,"entity",(0,h.t)(357),n.qy`<mc-entity-picker
              .hass=${this.hass}
              .value=${r}
              .label=${(0,h.t)(357)}
              @value-changed=${t=>this._patch(e,{entity:t.detail.value})}
            ></mc-entity-picker>`)}
          ${r?n.s6:n.qy`<p class="help">${(0,h.t)(639)}</p>`}
        </section>
        <section class="grp" aria-labelledby=${s("h-look")}>
          <h4 class="grp-h" id=${s("h-look")}>${(0,h.t)(553)}</h4>
          ${this._lookGroup(e,t,o)}
        </section>
        ${this._fold(o,"value-route",(0,h.t)(1162),`${u(ca,c)} · ${(0,h.t)(1260,{min:String(t.min??oe.Y1.min),max:String(t.max??oe.Y1.max)})}`,d,n.qy`
            ${l.length?this._keyField(e,t,"attribute",(0,h.t)(105),n.qy`<mc-attribute-picker
                    .hass=${this.hass}
                    .entityId=${r}
                    .value=${t.attribute||""}
                    @value-changed=${t=>this._patch(e,{attribute:t.detail.value})}
                  ></mc-attribute-picker>`):n.s6}
            <div class="two">
              ${this._keyField(e,t,"min",(0,h.t)(586),this._number(e,t,"min",s("min"),oe.Y1.min,0,void 0,"any"),s("min"))}
              ${this._keyField(e,t,"max",(0,h.t)(575),this._number(e,t,"max",s("max"),oe.Y1.max,void 0,void 0,"any"),s("max"))}
            </div>
            ${this._switch(e,t,"reverse_negative",(0,h.t)(837),oe.Y1.reverse_negative,(0,h.t)(15))}
            ${this._keyField(e,t,"route",(0,h.t)(846),this._seg((0,h.t)(846),c,(0,h.tl)(ca),t=>this._patch(e,{route:t})))}
            <div class="two">
              ${this._keyField(e,t,"from_side",(0,h.t)(404),this._select(s("from-side"),t.from_side??"auto",(0,h.tl)(da),t=>this._patch(e,{from_side:"auto"===t?void 0:t})),s("from-side"))}
              ${this._keyField(e,t,"to_side",(0,h.t)(1104),this._select(s("to-side"),t.to_side??"auto",(0,h.tl)(da),t=>this._patch(e,{to_side:"auto"===t?void 0:t})),s("to-side"))}
            </div>
            <div class="two">
              ${this._keyField(e,t,"speed",(0,h.t)(992),this._number(e,t,"speed",s("speed"),oe.Y1.speed,.2,void 0,.1,s("speed-help")),s("speed"))}
              ${this._keyField(e,t,"min_speed",(0,h.t)(587),this._number(e,t,"min_speed",s("min-speed"),oe.Y1.min_speed,.2,void 0,.1,s("speed-help")),s("min-speed"))}
            </div>
            <p class="help" id=${s("speed-help")}>${(0,h.t)(888)}</p>
          `)}
        ${this._fold(o,"label",(0,h.t)(503),u(ua,a),void 0!==t.label,n.qy`
            ${this._keyField(e,t,"label",(0,h.t)(503),this._seg((0,h.t)(503),a,(0,h.tl)(ua),t=>this._patch(e,{label:"none"===t?void 0:t}),"value"!==a||r?void 0:s("label-help")))}
            ${"value"!==a||r?n.s6:n.qy`<p class="help" id=${s("label-help")}>${(0,h.t)(741)}</p>`}
            ${"template"===a?this._keyField(e,t,"label_template",(0,h.t)(505),n.qy`<textarea
                    class="input"
                    id=${s("tpl")}
                    rows="2"
                    placeholder="{{ states('sensor.solar_power') | int }} W"
                    .value=${t.label_template||""}
                    @input=${t=>this._patch(e,{label_template:t.target.value})}
                  ></textarea>`,s("tpl")):n.s6}
            ${"none"!==a?this._keyField(e,t,"label_position",(0,h.t)(504),this._select(s("label-pos"),t.label_position??oe.Y1.label_position,(0,h.tl)(pa),t=>this._patch(e,{label_position:"auto"===t?void 0:t})),s("label-pos")):n.s6}
          `)}
        ${this._fold(o,"visibility",(0,h.t)(1173),`${u(ma,t.show_when??oe.Y1.show_when)} · ${u(ga,t.layer??oe.Y1.layer)}`,void 0!==t.show_when||void 0!==t.layer,n.qy`
            ${this._keyField(e,t,"show_when",(0,h.t)(923),this._seg((0,h.t)(923),t.show_when??oe.Y1.show_when,(0,h.tl)(ma),t=>this._patch(e,{show_when:"always"===t?void 0:t})))}
            ${this._keyField(e,t,"layer",(0,h.t)(507),this._seg((0,h.t)(507),t.layer??oe.Y1.layer,(0,h.tl)(ga),t=>this._patch(e,{layer:"back"===t?void 0:t})))}
          `)}
      </div>
    `}_block(e,t,i,o){const s=this.expanded.has(i),a=`flow-body-${t}`,r=e=>"string"==typeof e&&e?o.find(t=>t.id===e):void 0,l=!!r(e.from)&&r(e.from)?.name===r(e.to)?.name,c=e=>{const t=r(e);return t?l?t.label:t.name:"string"==typeof e&&e?(0,h.t)(596):"…"},d=[e.from,e.to].some(e=>"string"==typeof e&&e&&!o.some(t=>t.id===e));return n.qy`
      <div class="cond flow" data-flow=${i} data-selected=${this.selected===i?"":n.s6}>
        <div class="cond-head">
          <button
            type="button"
            class="icon-btn sm toggle"
            aria-expanded=${s?"true":"false"}
            aria-controls=${s?a:n.s6}
            aria-label=${s?(0,h.t)(202,{n:t+1}):(0,h.t)(374,{n:t+1})}
            @click=${()=>this.onToggle?.(i)}
          >
            <ha-icon icon=${s?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
          </button>
          <span class="n">${(0,h.t)(393,{n:t+1})}${e.from||e.to?n.qy` <span class="sub">· ${c(e.from)} → ${c(e.to)}</span>`:n.s6}</span>
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
        ${s?n.qy`<div id=${a}>${this._body(t,e,o,i)}</div>`:e.from&&e.to&&!d?n.s6:n.qy`<div class="hints">
                ${e.from?n.s6:n.qy`<p class="help">${(0,h.t)(748)}</p>`}
                ${e.to?n.s6:n.qy`<p class="help">${(0,h.t)(747)}</p>`}
                ${d?n.qy`<p class="help error">${(0,h.t)(596)}</p>`:n.s6}
              </div>`}
      </div>
    `}render(){const e=this._flows,t=(0,oe.rP)(e),i=this.config?Y(this.config,this.hass):[];return n.qy`
      <div class="list">
        ${e.length?n.s6:n.qy`<p class="help">${(0,h.t)(82)}</p>`}
        ${e.map((e,o)=>e&&"object"==typeof e?this._block(e,o,t[o],i):n.s6)}
        <div>
          <button type="button" class="btn btn-text btn-sm" @click=${()=>this._add()}>
            <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(42)}
          </button>
        </div>
      </div>
    `}};fa.styles=[l.x,n.AH`
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
    `],ra([(0,o.MZ)({attribute:!1})],fa.prototype,"config",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"hass",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"expanded",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"selected",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"onToggle",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"onRekey",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"sections",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"onSection",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"undoSnapshots",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"onUndoSnapshot",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"budget",void 0),ra([(0,o.MZ)({attribute:!1})],fa.prototype,"onChange",void 0),ra([(0,o.wk)()],fa.prototype,"_look",void 0),fa=ra([(0,o.EM)("mc-flows-editor")],fa);var va=i(8100),ba=i(3854),ya=i(2770),_a=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const wa=[{value:"auto",label:108,icon:"mdi:calendar-star"},{value:"winter",label:1190,icon:"mdi:snowflake"},{value:"spring",label:994,icon:"mdi:flower-tulip-outline"},{value:"summer",label:1020,icon:"mdi:white-balance-sunny"},{value:"autumn",label:119,icon:"mdi:leaf-maple"},{value:"christmas",label:186,icon:"mdi:pine-tree"},{value:"new_year",label:629,icon:"mdi:party-popper"},{value:"valentine",label:1160,icon:"mdi:heart-outline"},{value:"easter",label:328,icon:"mdi:egg-easter"},{value:"halloween",label:436,icon:"mdi:halloween"},{value:"weather",label:1178,icon:"mdi:weather-partly-rainy"},{value:"daynight",label:274,icon:"mdi:weather-night"},{value:"none",label:660,icon:"mdi:cancel"}],$a=Object.fromEntries(wa.map(e=>[e.value,e.label])),xa=[{key:"christmas",label:186},{key:"new_year",label:629},{key:"valentine",label:1160},{key:"easter",label:328},{key:"halloween",label:436}],ka=[{value:"back",label:134},{value:"front",label:709}],Ca=[{value:"north",label:662},{value:"south",label:985}];function Ma(e,t){const i=t.trim().toLowerCase();return"off"===i||"easter"===e&&"auto"===i||!!(0,va.RC)(i)}let Sa=class extends n.WF{constructor(){super(...arguments),this.explicitNone=!1,this._calendarOpen=!1,this._draft={},this._preview="",this._onPreviewEvent=()=>{const e=(0,ya.n)()?.seasonalPreviewDate();this._preview=e?(e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`)(e):""}}_setPreview(e){ta.tQ.seasonal.load().then(t=>t&&this.isConnected&&(0,ya.n)()?.setSeasonalPreviewDate(e))}connectedCallback(){super.connectedCallback(),window.addEventListener(fi.HT,this._onPreviewEvent),this._onPreviewEvent()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(fi.HT,this._onPreviewEvent),(0,ya.n)()?.setSeasonalPreviewDate(void 0)}get _cfg(){const e=(0,va.Oo)(this.value)??{};return void 0===e.combine||Array.isArray(e.combine)?e:{...e,combine:(0,va.ws)(e)}}get _scene(){if(void 0===this.value||null===this.value||!1===this.value)return"none";const e=this._cfg.scene??"auto";return wa.some(t=>t.value===e)?e:"none"}_write(e){const t={};for(const[i,n]of Object.entries(e))void 0===n||""===n||Array.isArray(n)&&!n.length||"calendar"===i&&n&&"object"==typeof n&&!Object.keys(n).length||(t[i]=n);this.onChange?.(t)}_set(e){this._write({...this._cfg,...e})}_pick(e){if("none"===e)return void this.onChange?.(this.explicitNone?"none":void 0);const t=(0,va.ws)(this._cfg).filter(t=>t!==e);this._write({...this._cfg,scene:e,combine:t})}_today(){const e=(0,ya.n)()?.seasonalPreviewDate()??(0,va.Z)(new Date,this.hass),t=(0,va.GR)(e,this._cfg),i=ba.Z[t];return void 0===i?void 0===$a[t]?t:(0,h.t)($a[t]):(0,Qt.t)(i)}_picker(e){const t=t=>n.qy`<option value=${t.value} ?selected=${t.value===e}>${"auto"===t.value?(0,h.t)(109,{when:this._preview?(0,h.t)(1237):(0,h.t)(1247),scene:this._today()}):(0,h.t)(t.label)}</option>`,i=e=>wa.find(t=>t.value===e),o=(e,o)=>n.qy`<optgroup label=${e}>${o.map(e=>t(i(e)))}</optgroup>`;return n.qy`<div class="pick">
      <span class="scene-ico" aria-hidden="true"><ha-icon icon=${i(e).icon}></ha-icon></span>
      <div class="select">
        <select class="input" id="seasonal-scene" aria-label=${(0,h.t)(884)} @change=${e=>this._pick(e.target.value)}>
          ${t(i("auto"))}
          ${o((0,h.t)(885),["winter","spring","summer","autumn"])}
          ${o((0,h.t)(453),["christmas","new_year","valentine","easter","halloween"])}
          ${o((0,h.t)(531),["weather","daynight"])}
          ${t(i("none"))}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
    </div>`}_field(e,t,i,o,s){const a=t?this._cfg[t]:void 0,r=void 0!==a&&""!==a&&!(Array.isArray(a)&&!a.length);return n.qy`
      <div class="field">
        <div class="field-head">
          ${o?n.qy`<label for=${o}>${e}</label>`:n.qy`<span class="lbl">${e}</span>`}
          ${t?(0,Jt.i)(e,r,()=>this._set({[t]:void 0})):n.s6}
        </div>
        ${i} ${s?n.qy`<p class="help">${s}</p>`:n.s6}
      </div>
    `}_seg(e,t,i,o){return n.qy`<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const n=i.findIndex(e=>e.value===t),s={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};if(!(e.key in s))return;e.preventDefault();const a=i[(n+s[e.key]+i.length)%i.length].value,r=e.currentTarget;o(a),requestAnimationFrame(()=>r.querySelector(`[data-val="${a}"]`)?.focus())}}>
      ${i.map(e=>{const i=e.value===t;return n.qy`<button
          type="button"
          role="radio"
          data-val=${e.value}
          aria-checked=${i?"true":"false"}
          tabindex=${i?"0":"-1"}
          @click=${()=>o(e.value)}
        >${(0,h.t)(e.label)}</button>`})}
    </div>`}_decorations(){const e=!1!==this._cfg.decorations;return n.qy`<div class="switch-row">
      <div class="txt">
        <div class="field-head">
          <span class="lbl">${(0,h.t)(140)}</span>
          ${(0,Jt.i)((0,h.t)(140),void 0!==this._cfg.decorations,()=>this._set({decorations:void 0}))}
        </div>
        <p class="help">${(0,h.t)(521)}</p>
      </div>
      <button
        type="button"
        class="switch"
        role="switch"
        aria-checked=${e?"true":"false"}
        aria-label=${(0,h.t)(140)}
        @click=${()=>this._set({decorations:!e&&void 0})}
      ></button>
    </div>`}_combine(e){const t=(0,va.ws)(this._cfg),i=e=>this._set({combine:t.includes(e)?t.filter(t=>t!==e):[...t,e]});return this._field((0,h.t)(220),"combine",n.qy`<div class="chips" role="group" aria-label=${(0,h.t)(220)}>
        ${va.MX.filter(t=>t!==e).map(e=>n.qy`<button type="button" class="chip" aria-pressed=${t.includes(e)?"true":"false"} @click=${()=>i(e)}>
            ${void 0===$a[e]?e:(0,h.t)($a[e])}
          </button>`)}
      </div>`,void 0,(0,h.t)(377))}_writeCalendar(e,t){const i={...this._cfg.calendar??{}};void 0===t?delete i[e]:i[e]=t,this._set({calendar:Object.keys(i).length?i:void 0})}_calendarField(e){const t=`seasonal-cal-${e.key}`,i=this._cfg.calendar?.[e.key],o=!1===i?"off":"string"==typeof i?i:"",s=this._draft[e.key],a=s??o,r=void 0!==s&&""!==s.trim()&&!Ma(e.key,s),l=void 0!==i,c=t=>{const i=t.target.value;""===i.trim()?(this._draft={...this._draft,[e.key]:void 0},this._writeCalendar(e.key,void 0)):Ma(e.key,i)?(this._draft={...this._draft,[e.key]:void 0},this._writeCalendar(e.key,"off"===i.trim().toLowerCase()?"off":i.trim())):this._draft={...this._draft,[e.key]:i}},d=()=>{this._draft={...this._draft,[e.key]:void 0},this._writeCalendar(e.key,void 0)},u=`${t}-err`,p=e=>n.qy`<input
      class="input mono"
      id=${t}
      type="text"
      spellcheck="false"
      autocomplete="off"
      placeholder=${e}
      aria-invalid=${r?"true":"false"}
      aria-describedby=${r?u:n.s6}
      .value=${a}
      @input=${c}
    />`,m=r?n.qy`<p class="help error" id=${u} role="alert">${(0,h.t)(1136)}</p>`:n.s6;if("easter"===e.key){const e=!l||"auto"===o.trim().toLowerCase();return n.qy`<div class="field">
        <div class="switch-row">
          <div class="txt">
            <div class="field-head">
              <span class="lbl">${(0,h.t)(328)}</span>
              ${(0,Jt.i)((0,h.t)(328),l,d)}
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
        ${e?n.s6:n.qy`${p("04-01..04-07")}${m}`}
      </div>`}return n.qy`<div class="field">
      <div class="field-head">
        <label for=${t}>${(0,h.t)(e.label)}</label>
        ${(0,Jt.i)((0,h.t)(e.label),l||void 0!==s,d)}
      </div>
      ${p(va.jF[e.key])}${m}
    </div>`}_calendar(){const e=this._calendarOpen,t=Object.keys(this._cfg.calendar??{}).length;return n.qy`<div class="cal">
      <button
        type="button"
        class="sector-btn"
        aria-expanded=${e?"true":"false"}
        aria-controls="seasonal-cal-body"
        @click=${()=>this._calendarOpen=!e}
      >
        <ha-icon icon="mdi:calendar-range"></ha-icon>
        <span class="nm">${(0,h.t)(452)}</span>
        ${t?n.qy`<span class="chip is-count">${(0,h.t)(1300,{n:t})}</span>`:n.s6}
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
      </button>
      ${e?n.qy`<div class="cal-body" id="seasonal-cal-body">
            <p class="help">${(0,h.t)(113)}</p>
            ${xa.map(e=>this._calendarField(e))}
          </div>`:n.s6}
    </div>`}_previewDate(){const e="seasonal-preview-date";return n.qy`<div class="field">
      <div class="field-head">
        <label for=${e}>${(0,h.t)(776)}</label>
        ${(0,Jt.i)((0,h.t)(776),!!this._preview,()=>this._setPreview(void 0))}
      </div>
      <input
        class="input"
        id=${e}
        type="date"
        .value=${this._preview}
        @change=${e=>{const t=e.target.value,i=/^(\d{4})-(\d{2})-(\d{2})$/.exec(t);this._setPreview(i?new Date(Number(i[1]),Number(i[2])-1,Number(i[3]),12):void 0)}}
      />
      <p class="help">${(0,h.t)(965)}</p>
    </div>`}updated(){const e=this.renderRoot.querySelector("select#seasonal-scene");e&&e.value!==this._scene&&(e.value=this._scene)}render(){const e=this._scene,t=this._cfg,i=(0,va.ws)(t),o="none"!==e||!!i.length,s=[e,...i],a=s.includes("auto"),r=s.includes("weather");return n.qy`
      <div class="seasonal-ed">
        ${this._picker(e)}
        ${o?n.qy`
              ${this._field((0,h.t)(507),"layer",this._seg((0,h.t)(507),"front"===t.layer?"front":"back",ka,e=>this._set({layer:"front"===e?"front":void 0})),void 0,"front"===t.layer?(0,h.t)(710):void 0)}
              ${this._field((0,h.t)(495),"intensity",n.qy`<mc-unit-field
                  .value=${function(e){if(null==e||""===e)return"";if("number"==typeof e)return`${e>0&&e<=1?Math.round(100*e):e}%`;const t=String(e).trim();if(/^\d*\.?\d+$/.test(t)){const e=parseFloat(t);return`${e>0&&e<=1?Math.round(100*e):e}%`}return t}(t.intensity)}
                  .label=${(0,h.t)(495)}
                  .units=${["%"]}
                  .noCustom=${!0}
                  .placeholder=${"50"}
                  .inputId=${"seasonal-intensity"}
                  @value-changed=${e=>this._set({intensity:e.detail.value||void 0})}
                ></mc-unit-field>`,void 0,(0,h.t)(461))}
              ${this._decorations()}
              ${r?this._field((0,h.t)(1179),"weather_entity",n.qy`<mc-entity-picker
                      .hass=${this.hass}
                      .value=${t.weather_entity||""}
                      .label=${(0,h.t)(1179)}
                      .domain=${"weather"}
                      @value-changed=${e=>this._set({weather_entity:e.detail.value||void 0})}
                    ></mc-entity-picker>`,void 0,(0,h.t)(981)):n.s6}
              ${this._field((0,h.t)(681),"entity",n.qy`<mc-entity-picker
                  .hass=${this.hass}
                  .value=${t.entity||""}
                  .label=${(0,h.t)(681)}
                  @value-changed=${e=>this._set({entity:e.detail.value||void 0})}
                ></mc-entity-picker>`,void 0,(0,h.t)(73))}
              ${a?this._field((0,h.t)(440),"hemisphere",this._seg((0,h.t)(440),(0,va.ot)(t.hemisphere),Ca,e=>this._set({hemisphere:"south"===e?"south":void 0})),void 0,(0,h.t)(986)):n.s6}
              ${this._combine(e)} ${a?this._calendar():n.s6} ${a?this._previewDate():n.s6}
            `:n.s6}
      </div>
    `}};Sa.styles=[l.x,n.AH`
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
    `],_a([(0,o.MZ)({attribute:!1})],Sa.prototype,"value",void 0),_a([(0,o.MZ)({attribute:!1})],Sa.prototype,"hass",void 0),_a([(0,o.MZ)({type:Boolean})],Sa.prototype,"explicitNone",void 0),_a([(0,o.MZ)({attribute:!1})],Sa.prototype,"onChange",void 0),_a([(0,o.wk)()],Sa.prototype,"_calendarOpen",void 0),_a([(0,o.wk)()],Sa.prototype,"_draft",void 0),_a([(0,o.wk)()],Sa.prototype,"_preview",void 0),Sa=_a([(0,o.EM)("mc-seasonal-editor")],Sa);var Aa=i(7837),qa=i(3795);const Ea=["px","em","rem","vw","vh"];function ja(e){const t=Object.keys(e?.themes?.themes||{}).sort((e,t)=>e.localeCompare(t,void 0,{sensitivity:"base"}));return[{label:(0,h.t)(270),value:"__default__"},...t.map(e=>({label:e,value:e}))]}const Ta=()=>({id:(0,w.$)("cond"),type:"state",entity:"",state:""});async function za(e,t,i,n,o){const s=e.currentTarget.closest("[data-card-share]").querySelector("[data-share-slot]");s.replaceChildren();try{await(0,Aa.cs)()}catch{return void(s.textContent=(0,h.t)(1065))}const a=Object.assign(document.createElement("mc-transfer-panel"),{host:"card-editor",mode:t,accept:["card"],card:(0,Aa.D6)(),entities:o,hasLibrary:!1,exportItems:"export"===t?{kind:"card",items:[{id:"card",name:i.name||"card",data:i}]}:void 0});a.addEventListener("mc-transfer-close",()=>s.replaceChildren()),a.addEventListener("mc-transfer-import",e=>{e.stopPropagation(),s.replaceChildren(),n(e.detail.items[0].data)}),s.append(a)}const La=/(?<![a-z0-9_/-])[a-z][a-z0-9_]{0,63}\.mc_placeholder_[1-9][0-9]{0,5}(?![a-z0-9_])/,Oa="__hover__",Ra={view:"default",set:()=>{},open:new Map,toggle:()=>{}},Pa=["ring","shape","value_background","seasonal","background_layers"],Ha=e=>null!=e&&""!==e&&!(Array.isArray(e)&&!e.length);var Ia=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let Va=class extends n.WF{constructor(){super(...arguments),this.value="",this.label="",this._windowCtrl=new Ue.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery=""}_openModal(){this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_selectService(e){this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:e},bubbles:!0,composed:!0})),this._closeModal()}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getServices(){if(!this.hass?.services)return[];const e=[];for(const[t,i]of Object.entries(this.hass.services))for(const[n,o]of Object.entries(i))e.push({domain:t,service:n,name:o.name||n,description:o.description||""});return e}_getFilteredServices(){const e=this._getServices(),t=this._searchQuery.toLowerCase(),i=t?e.filter(e=>e.domain.includes(t)||e.service.includes(t)||e.name.toLowerCase().includes(t)):e,n=new Map;for(const e of i)n.has(e.domain)||n.set(e.domain,[]),n.get(e.domain).push(e);return Array.from(n.entries()).sort(([e],[t])=>e.localeCompare(t)).slice(0,20).map(([e,t])=>({domain:e,services:t.sort((e,t)=>e.service.localeCompare(t.service))}))}_domainIcon(e){return{light:"mdi:lightbulb",switch:"mdi:toggle-switch",climate:"mdi:thermostat",cover:"mdi:window-shutter",fan:"mdi:fan",media_player:"mdi:cast",camera:"mdi:video",lock:"mdi:lock",automation:"mdi:robot",script:"mdi:script-text",scene:"mdi:palette",input_boolean:"mdi:toggle-switch-outline",input_number:"mdi:ray-vertex",input_select:"mdi:format-list-bulleted",notify:"mdi:bell",tts:"mdi:speaker-message",homeassistant:"mdi:home-assistant",persistent_notification:"mdi:bell-ring",logbook:"mdi:book-open",recorder:"mdi:database",system_log:"mdi:file-document",frontend:"mdi:view-dashboard",group:"mdi:group",vacuum:"mdi:robot-vacuum",counter:"mdi:counter",timer:"mdi:timer"}[e]||"mdi:cog"}render(){return n.qy`
      <div class="with-icon with-action">
        <ha-icon icon="mdi:cog-outline"></ha-icon>
        <input
          type="text"
          class="input mono"
          .value=${this.value}
          placeholder="domain.service"
          aria-label=${this.label||(0,h.t)(906)}
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
    `}_renderModal(){const e=this._getFilteredServices();return n.qy`
      ${(0,Ue.bU)((0,h.t)(901),()=>this._closeModal(),"m",n.qy`
          <div class="mc-picker-search">
            ${(0,Ue.LW)((0,h.t)(881),this._searchQuery,e=>{this._searchQuery=e})}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${(0,h.t)(908)}>
            ${e.length>0?e.map(e=>n.qy`
                  <div class="mc-picker-domain">${e.domain}</div>
                  ${e.services.map(e=>n.qy`
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
                        ${e.description?n.qy`<span class="mc-picker-item-desc">${e.description}</span>`:""}
                      </span>
                    </button>
                  `)}
                `):n.qy`<div class="mc-picker-empty">${(0,h.t)(654)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,h.t)(162)}</button>
          </div>
      `)}
    `}};Va.styles=[l.x,tt.fz],Ia([(0,o.MZ)({attribute:!1})],Va.prototype,"hass",void 0),Ia([(0,o.MZ)({type:String})],Va.prototype,"value",void 0),Ia([(0,o.MZ)({type:String})],Va.prototype,"label",void 0),Ia([(0,o.wk)()],Va.prototype,"_showModal",void 0),Ia([(0,o.wk)()],Va.prototype,"_searchQuery",void 0),Va=Ia([(0,o.EM)("mc-service-picker")],Va);var Da=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const Fa=[{type:"alarm-panel",name:60,description:59,icon:"mdi:shield-home",category:"built-in"},{type:"area",name:99,description:925,icon:"mdi:texture-box",category:"built-in"},{type:"button",name:156,description:24,icon:"mdi:gesture-tap-button",category:"built-in"},{type:"calendar",name:158,description:159,icon:"mdi:calendar",category:"built-in"},{type:"conditional",name:226,description:928,icon:"mdi:eye-check",category:"built-in"},{type:"entities",name:356,description:530,icon:"mdi:format-list-bulleted",category:"built-in"},{type:"entity",name:357,description:971,icon:"mdi:card-text",category:"built-in"},{type:"entity-filter",name:362,description:389,icon:"mdi:filter",category:"built-in"},{type:"gauge",name:413,description:415,icon:"mdi:gauge",category:"built-in"},{type:"glance",name:419,description:787,icon:"mdi:eye",category:"built-in"},{type:"grid",name:433,description:434,icon:"mdi:view-grid",category:"built-in"},{type:"heading",name:438,description:890,icon:"mdi:format-header-1",category:"built-in"},{type:"history-graph",name:449,description:366,icon:"mdi:chart-line",category:"built-in"},{type:"horizontal-stack",name:456,description:996,icon:"mdi:arrow-split-vertical",category:"built-in"},{type:"humidifier",name:463,description:464,icon:"mdi:air-humidifier",category:"built-in"},{type:"iframe",name:"iFrame",description:344,icon:"mdi:web",category:"built-in"},{type:"light",name:519,description:520,icon:"mdi:lightbulb",category:"built-in"},{type:"logbook",name:550,description:367,icon:"mdi:book-open-variant",category:"built-in"},{type:"map",name:560,description:562,icon:"mdi:map",category:"built-in"},{type:"markdown",name:564,description:805,icon:"mdi:language-markdown",category:"built-in"},{type:"media-control",name:580,description:582,icon:"mdi:cast",category:"built-in"},{type:"picture",name:752,description:308,icon:"mdi:image",category:"built-in"},{type:"picture-elements",name:753,description:485,icon:"mdi:image-edit",category:"built-in"},{type:"picture-entity",name:754,description:369,icon:"mdi:image-area",category:"built-in"},{type:"picture-glance",name:755,description:484,icon:"mdi:image-multiple",category:"built-in"},{type:"plant-status",name:761,description:760,icon:"mdi:flower",category:"built-in"},{type:"sensor",name:904,description:905,icon:"mdi:eye",category:"built-in"},{type:"shopping-list",name:919,description:920,icon:"mdi:cart",category:"built-in"},{type:"statistic",name:1008,description:552,icon:"mdi:chart-box",category:"built-in"},{type:"statistics-graph",name:1009,description:1009,icon:"mdi:chart-bell-curve",category:"built-in"},{type:"thermostat",name:1073,description:195,icon:"mdi:thermostat",category:"built-in"},{type:"tile",name:1095,description:222,icon:"mdi:square-rounded",category:"built-in"},{type:"todo-list",name:1105,description:1106,icon:"mdi:checkbox-marked-outline",category:"built-in"},{type:"vertical-stack",name:1168,description:997,icon:"mdi:arrow-split-horizontal",category:"built-in"},{type:"weather-forecast",name:1180,description:1181,icon:"mdi:weather-partly-cloudy",category:"built-in"}];let Na=class extends n.WF{constructor(){super(...arguments),this.value="",this._windowCtrl=new Ue.HK(this,()=>this._closeModal()),this._showModal=!1,this._searchQuery="",this._selectedCardType=""}_openModal(){this._selectedCardType=this.value,this._showModal=!0,this._searchQuery=""}_closeModal(){this._showModal=!1}_handleSave(){this.value=this._selectedCardType,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this._selectedCardType},bubbles:!0,composed:!0})),this._closeModal()}_selectCard(e){this._selectedCardType=e,this._searchQuery=e}_onInputChange(e){const t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:t},bubbles:!0,composed:!0}))}_getCustomCards(){const e=window.customCards;return Array.isArray(e)?e.map(e=>({type:`custom:${e.type}`,name:e.name||e.type,description:e.description||(0,h.t)(258),icon:"mdi:puzzle",category:"custom"})):[]}_getFilteredCards(){const e=(0,h.A)(this._searchQuery),t=t=>!e||t.type.toLowerCase().includes(e)||(0,h.A)(t.name).includes(e)||(0,h.A)(t.description).includes(e);return{builtIn:Fa.map(e=>({...e,name:"string"==typeof e.name?e.name:(0,h.t)(e.name),description:(0,h.t)(e.description)})).filter(t),custom:this._getCustomCards().filter(t)}}render(){return n.qy`
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
        <button type="button" class="btn btn-secondary" @click=${this._openModal}>${(0,h.t)(892)}</button>
      </div>

      ${this._showModal?this._renderModal():""}
    `}_renderModal(){const{builtIn:e,custom:t}=this._getFilteredCards(),i=e.length>0||t.length>0;return n.qy`
      ${(0,Ue.bU)((0,h.t)(894),()=>this._closeModal(),"s",n.qy`
          <div class="mc-picker-search">
            ${(0,Ue.LW)((0,h.t)(876),this._searchQuery,e=>{this._searchQuery=e})}
          </div>
          <div class="mc-picker-list" role="listbox" aria-label=${(0,h.t)(181)}>
            ${i?n.qy`
                  ${e.length>0?n.qy`
                    <div class="mc-picker-category">${(0,h.t)(154)}</div>
                    ${e.map(e=>this._renderCardItem(e))}
                  `:""}
                  ${t.length>0?n.qy`
                    <div class="mc-picker-category">${(0,h.t)(259)}</div>
                    ${t.map(e=>this._renderCardItem(e))}
                  `:""}
                `:n.qy`<div class="mc-picker-empty">${(0,h.t)(633)}</div>`}
          </div>
          <div class="mc-picker-footer" slot="footer">
            <button type="button" class="btn btn-secondary" @click=${this._closeModal}>${(0,h.t)(162)}</button>
            <button type="button" class="btn btn-primary" @click=${this._handleSave}>${(0,h.t)(865)}</button>
          </div>
      `)}
    `}_renderCardItem(e){return n.qy`
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
    `}};Na.styles=[l.x,tt.fz],Da([(0,o.MZ)({type:String})],Na.prototype,"value",void 0),Da([(0,o.wk)()],Na.prototype,"_showModal",void 0),Da([(0,o.wk)()],Na.prototype,"_searchQuery",void 0),Da([(0,o.wk)()],Na.prototype,"_selectedCardType",void 0),Na=Da([(0,o.EM)("mc-card-picker")],Na);var Za=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const Ba={general:{label:416},actions:{label:25},conditions:{label:228},design:{label:299},flows:{label:394}},Ka=["general","actions","conditions","design"],Wa={card:["general","design","conditions","flows"],row:["general","actions","conditions","design"],column:["general","conditions","design"],slot:["general","conditions","design"]};let Ua=class extends n.WF{constructor(){super(...arguments),this._direction=new Ge.K(this),this.variant="pane",this._tabs={card:"general",row:"general",column:"general",module:"general",slot:"general"},this._expandedRules=new Set,this._expandedFlows=new Set,this._flowSections=new Map,this._flowUndo=new Map,this._designView="default",this._designOpen=new Map,this._focusTab=!1,this._seenFlow=null,this._scrollKey="",this._seenSeq=0,this._focusCardEntity=!1,this._openCardEntity=()=>{this._tabs={...this._tabs,card:"general"},this._focusCardEntity=!0,this._goTo({kind:"card"}),this.requestUpdate()},this._showFirstTab=()=>{const e=this._selection();"module"===e.kind&&this._goTo((0,C.r$)(e.row,e.col,e.module,e.child,0))},this._onSyncToggle=e=>{const t=this.stateManager,i=t?.getConfig();if(!t||!i?.template)return;const{propertyPath:n,synced:o}=e.detail,s=this._selection();switch(s.kind){case"card":t.updateConfig({...i,not_synced:_e(i.not_synced,n,o)});break;case"row":t.updateRow(s.row,{not_synced:_e(i.rows[s.row]?.not_synced,n,o)});break;case"column":t.updateColumn(s.row,s.col,{not_synced:_e(i.rows[s.row]?.columns[s.col]?.not_synced,n,o)});break;case"module":{const e=this._module(s);if(!e)return;t.updateModule(s.row,s.col,s.module,{not_synced:_e(e.not_synced,n,o)},s.child);break}}}}connectedCallback(){super.connectedCallback(),this.stateManager&&!this._unsubscribe&&this._subscribe(),this._stopStatus=(0,ea.Wb)(()=>this.requestUpdate())}disconnectedCallback(){super.disconnectedCallback(),this._stopStatus?.(),this._unsubscribe?.(),this._unsubscribe=void 0,this._subscribedTo=void 0}willUpdate(e){e.has("stateManager")&&this.stateManager!==this._subscribedTo&&this._subscribe()}updated(){if(this._syncScroller(),this._focusCardEntity){const e=this.shadowRoot?.querySelector("mc-entity-picker[data-card-entity]");if(e){this._focusCardEntity=!1,e.scrollIntoView?.({block:"nearest"});const t=()=>e.focusInput?.();e.updateComplete.then(t),setTimeout(t,80)}}const e=this.shadowRoot?.querySelector("select#design-view");e&&e.value!==this._designView&&[...e.options].some(e=>e.value===this._designView)&&(e.value=this._designView);const t=this.shadowRoot?.querySelector('[role="tab"][aria-selected="true"]');if(!t)return;const i=t.parentElement,n=t.getBoundingClientRect(),o=i.getBoundingClientRect();n.left<o.left?i.scrollLeft+=n.left-o.left-4:n.right>o.right&&(i.scrollLeft+=n.right-o.right+4),this._focusTab&&(this._focusTab=!1,t.focus())}_syncScroller(){const e=this.shadowRoot?.querySelector(".insp-body");if(!e)return;const t=this._selection(),i=`${this._state?.selectedPath??""}|${this._activeTab(t,this._tabsFor(t))}`,n=this.stateManager?.selectionSeq??0,o=n!==this._seenSeq;this._seenSeq=n;const s=o&&!1===this.stateManager?.selectionReveal;if(i!==this._scrollKey){const t=""!==this._scrollKey;this._scrollKey=i,e.scrollTop=0,t&&!s&&"visible"===getComputedStyle(e).overflowY&&this.shadowRoot?.querySelector(".insp-head")?.scrollIntoView?.({block:"nearest"})}}_subscribe(){this._unsubscribe?.(),this._subscribedTo=this.stateManager,this._unsubscribe=this.stateManager?.subscribe(e=>{if(this._state=e,this._expandedFlows.size){const t=new Set((0,oe.rP)(Array.isArray(e.config.flows)?e.config.flows:[]));[...this._expandedFlows].some(e=>!t.has(e))&&(this._expandedFlows=new Set([...this._expandedFlows].filter(e=>t.has(e))))}const t=e.selectedFlow??null;t&&t!==this._seenFlow&&(this._tabs={...this._tabs,card:"flows"},this._expandedFlows.has(t)||(this._expandedFlows=new Set(this._expandedFlows).add(t))),this._seenFlow=t})}setTab(e){const t=this._selection();this._tabsFor(t).includes(e)&&(this._tabs={...this._tabs,[t.kind]:e})}focusInspector(){this._focusTab=!0,this.requestUpdate()}_selection(){return(0,C.c4)(this._state?.selectedPath??null)}_module(e){const t=this._state?.config;return t?(0,C.cv)(t,e):void 0}_tabsFor(e){if("slot"===e.kind&&this._state&&"tabs"===(0,C.kW)(this._state.config,e)?.type)return["general"];if("module"!==e.kind)return Wa[e.kind];const t=this._module(e);if(!t)return["general"];const i=Jn.tabs(t.type);return Ka.filter(e=>i.includes(e))}_activeTab(e,t){const i=this._tabs[e.kind];return t.includes(i)?i:t[0]}_goTo(e){this.stateManager?.setSelectedPath((0,C.bm)(e))}_onTabKeydown(e,t,i,n){const o=(0,xt.n)(e.key,i.indexOf(n),i.map(()=>({})),"horizontal",!0,"rtl"===(0,Ge.k)(e.currentTarget));o<0||(e.preventDefault(),this._focusTab=!0,this._tabs={...this._tabs,[t.kind]:i[o]})}get _rulesState(){const e=e=>{this._expandedRules=e};return{expanded:this._expandedRules,toggle:t=>{const i=new Set(this._expandedRules);i.has(t)?i.delete(t):i.add(t),e(i)},expand:t=>e(new Set(this._expandedRules).add(t)),collapse:t=>{const i=new Set(this._expandedRules);i.delete(t),e(i)}}}get _designState(){return{view:this._designView,set:e=>{this._designView=e},open:this._designOpen,toggle:(e,t)=>{this._designOpen=new Map(this._designOpen).set(e,t)}}}get _flowsState(){const e=this.stateManager,t=this._state?.selectedFlow??null;return{expanded:this._expandedFlows,selected:t,toggle:i=>{const n=new Set(this._expandedFlows),o=!n.has(i);o?n.add(i):n.delete(i),this._expandedFlows=n,o?e?.selectFlow(i):t===i&&e?.selectFlow(null)},sections:this._flowSections,setSection:(e,t)=>{this._flowSections=new Map(this._flowSections).set(e,t)},undoSnapshots:this._flowUndo,setUndoSnapshot:(e,t)=>{const i=new Map(this._flowUndo);t?i.set(e,t):i.delete(e),this._flowUndo=i},rekey:(i,n)=>{const o=new Map;for(const[e,t]of this._flowSections)o.set(e.startsWith(`${i}|`)?`${n}|${e.slice(i.length+1)}`:e,t);if(this._flowSections=o,this._flowUndo.has(i)){const e=new Map(this._flowUndo);e.delete(i),this._flowUndo=e}if(t===i&&e?.selectFlow(n),!this._expandedFlows.has(i))return;const s=new Set(this._expandedFlows);s.delete(i),s.add(n),this._expandedFlows=s}}}render(){const e=this._state?.config;if(!e||!this.stateManager)return n.qy``;const t=this._selection(),i=this._tabsFor(t),o=this._activeTab(t,i);return n.qy`
      <div class="insp" @field-sync-toggle=${this._onSyncToggle} @mc-open-card-entity=${this._openCardEntity} @mc-select-first-tab=${this._showFirstTab}>
        <div class="insp-head">
          ${this._renderIdentity(e,t)}
          <div class="seg full tabs" role="tablist" aria-label=${(0,h.t)(910)}>
            ${i.map(e=>{const s=e===o;return n.qy`
                <button
                  type="button"
                  role="tab"
                  id="tab-${e}"
                  aria-controls="panel-${e}"
                  aria-selected=${s?"true":"false"}
                  tabindex=${s?"0":"-1"}
                  @click=${()=>this.setTab(e)}
                  @keydown=${e=>this._onTabKeydown(e,t,i,o)}
                >
                  ${(0,h.t)(Ba[e].label)}
                </button>
              `})}
          </div>
        </div>
        <div class="insp-body" role="tabpanel" tabindex="0" id="panel-${o}" aria-labelledby="tab-${o}">
          ${this._renderBody(e,t,o)}
        </div>
      </div>
    `}_renderIdentity(e,t){const i=(0,C.e9)(e,t),o=(0,C.Sh)(e,t),s=(e,t)=>n.qy`<button type="button" class="crumb" title=${(0,h.t)(902,{label:e})} @click=${()=>this._goTo(t)}>${e}</button>`,a=n.qy`<span aria-hidden="true"> · </span>`,r=e=>(0,h.t)(848,{n:e+1}),l=e=>(0,h.t)(218,{n:e+1}),c=e=>(0,h.t)(1271,{n:e});let d,u=i.title,p=i.icon;switch(o.kind){case"card":u=e.name?.trim()?`${(0,h.t)(167)} · ${i.title}`:(0,h.t)(167),d=n.qy`${m=(e.rows||[]).length,(0,h.t)(1273,{n:m})} · ${c((0,C.TV)(e))}`;break;case"row":{const t=e.rows[o.row];p="mdi:table-row",d=n.qy`${(e=>(0,h.t)(1264,{n:e}))(t.columns.length)} · ${(0,f.SU)(t)?(0,h.t)(1223):(0,h.t)(1233,{layout:t.layout||"1"})}`;break}case"column":{const t=e.rows[o.row].columns[o.col].modules?.length??0;d=n.qy`${s(r(o.row),{kind:"row",row:o.row})}${a}${c(t)}`;break}case"slot":{const t=(0,C.tw)(o);d=n.qy`${s(r(o.row),{kind:"row",row:o.row})}${a}${s(l(o.col),{kind:"column",row:o.row,col:o.col})}${(0,C.fN)(e,t).map(e=>n.qy`${a}${s(e.label,e.target)}`)}`;break}case"module":{const t=(0,C.cv)(e,o);if(!t||"object"!=typeof t){d=n.qy`${s(r(o.row),{kind:"row",row:o.row})}`;break}const c=(0,C.$N)(t);c&&!(0,C.Hn)(t)&&(u=`${i.title} · ${c}`);const h="string"==typeof t.entity&&C.Y.test(t.entity)?t.entity:"",p=(0,C.fN)(e,o).slice(0,-1),m=(0,C.tw)(o,e),g="slot"===m.kind?s((0,C.e9)(e,m).title,m):void 0;d=n.qy`${s(r(o.row),{kind:"row",row:o.row})}${a}${s(l(o.col),{kind:"column",row:o.row,col:o.col})}${p.map(e=>n.qy`${a}${s(e.label,e.target)}`)}${g?n.qy`${a}${g}`:n.s6}${h?n.qy`${a}<span class="mono">${(0,C.rb)(h)}</span>`:n.s6}`;break}}var m;return n.qy`
      <div class="insp-id">
        <span class="ico k-${"slot"===o.kind?"column":o.kind}"><ha-icon icon=${p}></ha-icon></span>
        <div class="txt">
          <h2>${u}</h2>
          <p class="path">${d}${(0,C.Ak)((0,C.R9)(e,o))?n.qy`${a}<span class="hidden-note"><ha-icon icon="mdi:eye-off-outline"></ha-icon>${(0,h.t)(443)}</span>`:n.s6}</p>
        </div>
      </div>
    `}_renderBody(e,t,i){const o=this.stateManager;switch(t.kind){case"card":return this._renderCard(e,i);case"row":{const s=e.rows[t.row];return s?"design"===i?function(e,t,i,n){return Ts("row",t.design||{},n,n=>i.updateRow(e,zs(t,n,i)))}(t.row,s,o,this.hass):"conditions"===i?function(e,t,i,n){return Ls("row",t.display||{},t=>i.updateRow(e,{display:t}),n)}(t.row,s,o,this.hass):"actions"===i?function(e,t,i,o){return n.qy`
    ${Nt(t.actions,(n,o)=>{const s=i.getConfig().rows[e]??t,a={...s.actions};o&&"none"!==o.action?a[n]=o:delete a[n];const r={actions:Object.keys(a).length?a:void 0};i.getConfig().template&&!s.not_synced?.includes("actions")&&(r.not_synced=[...s.not_synced||[],"actions"]),i.updateRow(e,r)},o)}
    <p class="help">${(0,h.t)(859)}</p>
    <p class="help">${(0,h.t)(1191)}</p>
  `}(t.row,s,o,this.hass):function(e,t,i,o){const s=t.columns.map(e=>e.vertical_align||"start"),a=xs(e,t,i);return n.qy`
    ${Es(t,{row:e},i,o,t=>i.updateRow(e,t))}
    <div class="group">
      ${ks(a)}
      ${t.columns.length>1?As(a):n.s6}
      ${(0,kt.lm)((0,h.t)(412),t.gap,t=>i.updateRow(e,{gap:t}),void 0,void 0,"12")}
      ${(0,kt.De)((0,h.t)(1167),s[0]||"start",(0,h.tl)(qs),t=>{const n=i.getConfig().rows[e].columns.map(e=>({...e,vertical_align:t}));i.updateRow(e,{columns:n})})}
      ${(0,kt.Mg)((0,h.t)(719),t.padding,t=>i.updateRow(e,{padding:t}),"padding")}
    </div>
  `}(t.row,s,o,this.hass):n.qy``}case"column":{const s=e.rows[t.row]?.columns[t.col];return s?"design"===i?function(e,t,i,n,o){return Ts("column",i.design||{},o,o=>n.updateColumn(e,t,zs(i,o,n)))}(t.row,t.col,s,o,this.hass):"conditions"===i?function(e,t,i,n,o){return Ls("column",i.display||{},i=>n.updateColumn(e,t,{display:i}),o)}(t.row,t.col,s,o,this.hass):function(e,t,i,n,o){const s=n.getConfig().rows[e],a=Es(i,{row:e,col:t},n,o,i=>n.updateColumn(e,t,i));return js(i,t,i=>n.updateColumn(e,t,i),s?xs(e,s,n):void 0,a)}(t.row,t.col,s,o,this.hass):n.qy``}case"module":return this._renderModule(e,t,i);case"slot":return this._renderSlot(e,t,i)}}_renderCard(e,t){const i=this.stateManager,o=e.template?{templateName:e.template,notSynced:e.not_synced||[],basePath:""}:void 0,s=(e,t)=>{const n=i.getConfig(),o={...n,[e]:t};n.template&&(o.not_synced=_e(n.not_synced,e,!0)),i.updateConfig(o)};if("design"===t)return function(e,t,i,o,s,r,l,c=Ra,d){const u=e.conditional_appearance||[],p=c.view===Oa,m=u.find(e=>e.id===c.view),g=e=>t("conditional_appearance",e),f=e=>g(u.map(t=>t===m?{...t,...e}:t)),v=m?.overrides||{},b=e=>{const t={...v};for(const[i,n]of Object.entries(e))Ha(n)?t[i]=n:delete t[i];f({overrides:t})},y=m?{rule:!0,get:e=>v[e],set:(e,t)=>b({[e]:t}),many:b}:{rule:!1,get:t=>e[t],set:(e,i)=>t(e,i),many:e=>{if(s)s(e,"shape");else for(const[i,n]of Object.entries(e))t(i,n)},sync:i},_=y.sync,$=(e,t,i)=>(0,kt.XT)(e,t,_,{forId:i,reset:y.rule?(0,Jt.i)(e,t in v,()=>y.set(t,void 0)):void 0}),x=e=>y.rule&&!(e in v)?n.qy`<p class="help">${(0,h.t)(668)}</p>`:n.s6,k=e=>y.get(e),C={card_height:()=>n.qy`${(0,kt.lm)((0,h.t)(173),k("card_height"),e=>y.set("card_height",e),"card_height",_,"auto")}${x("card_height")}`,padding:()=>n.qy`${(0,kt.Mg)((0,h.t)(719),k("padding"),e=>y.set("padding",e),"padding","padding",_)}${x("padding")}`,margin:()=>n.qy`${(0,kt.Mg)((0,Qt.t)(300),k("margin"),e=>y.set("margin",e),"margin","margin",_)}${x("margin")}`,border_width:()=>n.qy`${(0,kt.lm)((0,Qt.t)(82),k("border_width"),e=>y.set("border_width",e),"border_width",_,(0,h.t)(1072),Ea)}${x("border_width")}`,border_style:()=>n.qy`${(0,kt.De)((0,Qt.t)(80),k("border_style")??"",[{label:(0,h.t)(1072),value:""},...Me.map(e=>({label:(0,Qt.t)(e.label),value:e.value}))],e=>y.set("border_style",e||void 0),"border_style",_)}${x("border_style")}`,border_color:()=>n.qy`${(0,kt.Yd)((0,Qt.t)(73),k("border_color"),e=>y.set("border_color",e),"border_color",_)}${x("border_color")}`,opacity:()=>n.qy`${(0,kt.aA)((0,h.t)(691),y.get("opacity"),e=>y.set("opacity",Number.isFinite(e)?Math.min(1,Math.max(0,e)):void 0),{min:0,max:1,step:.05,placeholder:"1",optional:!0},"opacity",_)}
        <p class="help">${(0,h.t)(136)}</p>${x("opacity")}`,backdrop_filter:()=>n.qy`${(0,kt.Gz)((0,Qt.t)(41),k("backdrop_filter"),e=>y.set("backdrop_filter",e),"backdrop_filter",_,{placeholder:"blur(8px)",mono:!0})}
        <p class="help">${(0,h.t)(139)}</p>${x("backdrop_filter")}`,background:()=>n.qy`${(0,kt.Yd)((0,h.t)(125),k("background"),e=>y.set("background",e),"background",_,"css")}${x("background")}`,background_image:()=>n.qy`${(0,kt.nZ)((0,h.t)(126),k("background_image"),e=>y.set("background_image",e),o,"image","background_image",_)}${x("background_image")}`,border_radius:()=>n.qy`${(0,kt.lm)((0,h.t)(141),k("border_radius"),e=>y.set("border_radius",e),"border_radius",_)}${x("border_radius")}`,box_shadow:()=>n.qy`${(0,kt.Gz)((0,h.t)(145),k("box_shadow"),e=>y.set("box_shadow",e),"box_shadow",_,{placeholder:(0,h.t)(1072),mono:!0})}${x("box_shadow")}`,shape:()=>n.qy`<div class="field">
      ${$((0,h.t)(912),"shape")}
      <mc-shape-editor
        .shape=${y.get("shape")}
        .options=${y.get("shape_options")}
        .explicitNone=${y.rule?!!e.shape:!!e.template}
        .target=${"card"}
        .hasRadius=${!!(y.get("border_radius")||y.rule&&e.border_radius)}
        .hasShadow=${!!(y.get("box_shadow")||y.rule&&e.box_shadow)}
        .popup=${!0===e.popup?.enabled}
        .hass=${o}
        .onChange=${e=>y.many({shape:e.shape,shape_options:e.shape_options})}
      ></mc-shape-editor>
      ${x("shape")}
    </div>`,value_background:()=>n.qy`<div class="field">
      ${$((0,h.t)(1163),"value_background")}
      <mc-value-bg-editor
        .value=${y.get("value_background")}
        .hass=${o}
        .explicitNone=${y.rule?!!e.value_background:!!e.template}
        .onChange=${e=>y.set("value_background",e)}
      ></mc-value-bg-editor>
      ${x("value_background")}
    </div>`,style_hint:()=>!y.rule&&(e.background_layers?.length??0)>0?n.qy`<p class="help" data-hint="backdrop">${(0,h.t)(169)}</p>`:n.s6,backdrop:()=>{const i=!y.rule||"background_layers"in v,s=y.rule?v.background_layers:e.background_layers,a=e=>{y.rule?f({overrides:{...v,background_layers:e}}):t("background_layers",e.length?e:void 0)};return n.qy`<div class="field">
        ${$((0,h.t)(509),"background_layers")}
        ${Qn()}
        <mc-bg-layers
          .layers=${s}
          .hass=${o}
          .rule=${y.rule?{own:i}:void 0}
          .lowPower=${!0===e.layers_low_power}
          .cardEntity=${e.entity}
          .onWrite=${a}
          .onRule=${t=>{if("start"===t)a((0,qa.hN)(e.background_layers));else{const e={...v};delete e.background_layers,f({overrides:e})}}}
          .onLowPower=${()=>t("layers_low_power",!e.layers_low_power||void 0)}
        ></mc-bg-layers>
      </div>`},ring:()=>n.qy`<div class="field">
      ${$((0,h.t)(839),"ring")}
      <mc-ring-editor
        .ring=${y.get("ring")}
        .hass=${o}
        .requireEntity=${!0}
        .clipped=${!0}
        .onChange=${t=>y.set("ring",void 0===t&&y.rule&&e.ring?{}:t)}
      ></mc-ring-editor>
      ${x("ring")}
    </div>`,seasonal:()=>n.qy`<div class="field">
      ${$((0,h.t)(883),"seasonal")}
      <mc-seasonal-editor
        .value=${y.get("seasonal")}
        .hass=${o}
        .explicitNone=${y.rule?!!e.seasonal:!!e.template}
        .onChange=${e=>y.set("seasonal",e)}
      ></mc-seasonal-editor>
      ${x("seasonal")}
    </div>`,animations:()=>y.rule?n.s6:n.qy`<div class="field">
            ${(0,kt.XT)((0,h.t)(90),"animations",i)}
            <mc-animation-list
              .animations=${(0,D.Sd)({animations:e.animations})}
              .hass=${o}
              .requireTriggerEntity=${!0}
              .onChange=${e=>t("animations",e.length?e:void 0)}
            ></mc-animation-list>
          </div>`,template_animations:()=>y.rule||!l?n.s6:function(e,t,i,o){if(!e.template||!t?.length)return n.s6;const s=new Set((0,a.B)(e.custom_animations).map(e=>String(e.id))),r=new Set(e.hidden_animations??[]),l=(e,t)=>n.qy`<button type="button" class="btn btn-text btn-sm" @click=${t}>${e}</button>`;return n.qy`<section class="group tpl-anims"><div class="field">
${(0,kt.XT)((0,h.t)(1036),"custom_animations",o)}
${e.not_synced?.includes("custom_animations")?n.qy`<p class="help">${(0,h.t)(1078)}</p>`:t.map(t=>{const o=String(t.id),c=s.has(o),d=!c&&r.has(o);return n.qy`<div class="cond-head" data-id=${o}><span class="n">${t.name??o}
<span class="chip">${c?(0,h.t)(184):d?(0,h.t)(442):(0,h.t)(405)}</span></span>
${c?l((0,h.t)(1153),()=>i(function(e,t){const i=(0,a.B)(e.custom_animations).filter(e=>e.id!==t),n={...e,custom_animations:i};return i.length||delete n.custom_animations,n}(e,o))):l(d?(0,h.t)(923):(0,h.t)(445),()=>i(function(e,t,i){const n=(e.hidden_animations??[]).filter(e=>e!==t);i&&n.push(t);const o={...e,hidden_animations:n};return n.length||delete o.hidden_animations,o}(e,o,!d)))}</div>`})}</div></section>`}(e,r,l,i),pause_button:()=>{if(y.rule)return n.s6;const o="always"===e.pause_button||"auto"===e.pause_button?e.pause_button:"hidden",s=[["auto",(0,h.t)(114)],["always",(0,h.t)(66)],["hidden",(0,h.t)(442)]],a=e=>t("pause_button","hidden"===e?void 0:e);return n.qy`<div class="field" data-field="pause_button">
        ${(0,kt.XT)((0,h.t)(730),"pause_button",i)}
        <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(730)} aria-describedby="pause-button-help" @keydown=${e=>{const t=e.currentTarget,i="rtl"===getComputedStyle(t).direction?-1:1,n={ArrowRight:i,ArrowDown:1,ArrowLeft:-i,ArrowUp:-1},r=s.findIndex(([e])=>e===o);let l;if("Home"===e.key)l=0;else if("End"===e.key)l=s.length-1;else{if(!Object.prototype.hasOwnProperty.call(n,e.key))return;l=(r+n[e.key]+s.length)%s.length}e.preventDefault();const c=s[l][0];a(c),requestAnimationFrame(()=>t.querySelector(`[data-val="${c}"]`)?.focus())}}>
          ${s.map(([e,t])=>n.qy`<button type="button" role="radio" data-val=${e} tabindex=${o===e?"0":"-1"} aria-checked=${o===e?"true":"false"} @click=${()=>a(e)}>${t}</button>`)}
        </div>
        <p class="help" id="pause-button-help">${"always"===o?(0,h.t)(67):"hidden"===o?(0,h.t)(1172):(0,h.t)(964)}</p>
      </div>`},pause_button_corner:()=>{if(y.rule||"auto"!==e.pause_button&&"always"!==e.pause_button)return n.s6;const i=e.pause_button_corner??"bottom-left",o=[["bottom-left",(0,h.t)(143)],["bottom-right",(0,h.t)(144)],["top-left",(0,h.t)(1110)],["top-right",(0,h.t)(1111)]];return n.qy`<div class="field" data-field="pause_button_corner">
        <div class="field-head"><label for="pause-corner">${(0,h.t)(243)}</label></div>
        <div class="select">
          <select class="input" id="pause-corner" @change=${e=>t("pause_button_corner","bottom-left"===e.target.value?void 0:e.target.value)}>
            ${o.map(([e,t])=>n.qy`<option value=${e} ?selected=${i===e}>${t}</option>`)}
          </select>
          <ha-icon icon="mdi:chevron-down"></ha-icon>
        </div>
      </div>`},css:()=>y.rule?n.s6:n.qy`<div class="field">
            ${(0,kt.XT)((0,h.t)(256),"css",i,{forId:"card-css",reset:(0,Jt.i)((0,h.t)(256),!!e.css,()=>t("css",void 0))})}
            <textarea
              class="input mono"
              id="card-css"
              rows="4"
              spellcheck="false"
              placeholder=${(0,h.t)(94)}
              .value=${e.css||""}
              @input=${e=>t("css",e.target.value||void 0)}
            ></textarea>
          </div>`},M=[["layout",(0,h.t)(512),!0,[["card_height","card_height"],["padding","padding"],["margin","margin"]]],["motion",(0,h.t)(604),!0,[["pause_button","pause_button"],["pause_button_corner"]]],["style",(0,h.t)(1017),!0,[["background","background"],["background_image","background_image"],["style_hint"],["border_radius","border_radius"],["border_width","border_width"],["border_style","border_style"],["border_color","border_color"],["box_shadow","box_shadow"],["opacity","opacity"],["backdrop_filter","backdrop_filter"],["shape","shape"],["value_background","value_background"]]],["backdrop",(0,h.t)(168),!1,[["backdrop","background_layers"]]],["effects",(0,h.t)(340),!1,[["ring","ring"],["seasonal","seasonal"],["animations","animations"],["template_animations"]]],["advanced",(0,h.t)(56),!1,[["css","css"]]]],S=u.length,A=p?(0,h.t)(97):S?(0,h.t)(1267,{n:S}):(0,h.t)(33),q="any"===m?.mode?"any":"every",E=m?.conditions||[],j=n.qy`<div class="rule-pick">
    <div class="field">
      <div class="field-head"><label for="design-view">${(0,h.t)(338)}</label></div>
      <div class="select">
        <select class="input" id="design-view" aria-describedby="design-view-help" @change=${e=>c.set(e.target.value)}>
          <option value="default" ?selected=${!p&&!m}>${(0,h.t)(276)}</option>
          <option value=${Oa} ?selected=${p}>${(0,h.t)(460)}</option>
          ${u.map((e,t)=>n.qy`<option value=${e.id} ?selected=${e===m}>${(0,h.t)(856,{name:e.name||(0,h.t)(855,{n:t+1})})}</option>`)}
        </select>
        <ha-icon icon="mdi:chevron-down"></ha-icon>
      </div>
      <p class="help" id="design-view-help">${A}</p>
    </div>
    <div class="rule-actions">
      <button type="button" class="btn btn-text btn-sm" @click=${()=>{const e=(0,w.$)("appr");g([...u,{id:e,name:(0,h.t)(855,{n:u.length+1}),conditions:[],mode:"every",overrides:{}}]),c.set(e)}}><ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(41)}</button>
      ${S&&d?n.qy`<button type="button" class="btn btn-text btn-sm" data-open-tab="conditions" @click=${()=>d("conditions")}>${(0,h.t)(693)}</button>`:n.s6}
    </div>
  </div>`,T=m?n.qy`<div class="rule">
        <div class="rule-head">
          <h3>${(0,h.t)(853)}</h3>
          <button
            type="button"
            class="btn btn-text btn-sm danger-text"
            @click=${()=>{g(u.filter(e=>e!==m)),c.set("default")}}
          ><ha-icon icon="mdi:delete-outline"></ha-icon>${(0,h.t)(292)}</button>
        </div>
        <div class="field">
          <div class="field-head"><label for="rule-name">${(0,h.t)(854)}</label></div>
          <input class="input" id="rule-name" type="text" placeholder=${(0,h.t)(854)} .value=${m.name||""} @input=${e=>f({name:e.target.value})} />
        </div>
        <div class="field">
          <div class="field-head"><span class="lbl">${(0,h.t)(566)}</span></div>
          <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(223)}>
            ${["every","any"].map(e=>n.qy`<button type="button" role="radio" aria-checked=${q===e?"true":"false"} @click=${()=>f({mode:e})}>${"every"===e?(0,h.t)(63):(0,h.t)(91)}</button>`)}
          </div>
        </div>
        <div class="rule-conds">
          ${E.length?E.map((e,t)=>n.qy`<mc-condition-row
                  .condition=${e}
                  .hass=${o}
                  .onChange=${e=>f({conditions:E.map((i,n)=>n===t?{...i,...e}:i)})}
                  .onRemove=${()=>f({conditions:E.filter((e,i)=>i!==t)})}
                ></mc-condition-row>`):n.qy`<p class="help">${(0,h.t)(634)}</p>`}
          <div>
            <button type="button" class="btn btn-secondary btn-sm" @click=${()=>f({conditions:[...E,Ta()]})}>
              <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(40)}
            </button>
          </div>
        </div>
      </div>`:n.s6;return n.qy`
    <div class="design-tab">
      ${j} ${T}
      ${p?n.qy`<section class="group">
            <div class="field">
              ${(0,kt.XT)((0,h.t)(460),"hover",i,{reset:(0,Jt.i)((0,h.t)(460),!!e.hover,()=>t("hover",void 0))})}
            </div>
            <div class="field" data-hover-backdrop>
              <span class="lbl">${(0,h.t)(168)}</span>
              <p class="help">${(0,h.t)(127)}</p>
            </div>
            <mc-design-panel
              class="card-hover"
              .design=${{hover:e.hover}}
              .hass=${o}
              .target=${"card"}
              .hoverOnly=${!0}
              .onChange=${e=>t("hover",e.hover)}
            ></mc-design-panel>
          </section>`:n.qy`<div class="dgroups">${M.map(([t,i,o,s])=>{const a=s.map(([e])=>C[e]()).filter(e=>e!==n.s6);if(!a.length)return n.s6;const r=s.filter(([,e])=>e&&Ha(y.get(e))).length,l=c.open.get(t)??(o||r>0||"backdrop"===t&&y.rule);return n.qy`<section class="dgroup" data-group=${t}>
      <button type="button" class="dgroup-btn" aria-expanded=${l?"true":"false"} aria-controls=${`dg-${t}`} @click=${()=>c.toggle(t,!l)}>
        <ha-icon class="chev" icon="mdi:chevron-down"></ha-icon>
        <span class="nm">${i}</span>
        ${r>0?n.qy`<span class="chip is-count">${(0,h.t)(1302,{n:r})}</span>`:n.s6}
        ${"backdrop"===t&&!y.rule&&(0,qa.q2)(e.background_layers)?n.qy`<span class="chip is-warn" data-warn="backdrop">⚠ ${(0,h.t)(782)}</span>`:n.s6}
      </button>
      <div class="dgroup-body" id=${`dg-${t}`} ?hidden=${!l}>${a}</div>
    </section>`})}</div>`}
    </div>
  `}(e,s,o,this.hass,(e,t)=>{const n=i.getConfig(),o={...n};for(const[t,i]of Object.entries(e))void 0===i?delete o[t]:o[t]=i;n.template&&(o.not_synced=_e(n.not_synced,t,!0)),i.updateConfig(o)},i.getState().templateAnimations,e=>i.updateConfig(e),this._designState,e=>this.setTab(e));if("conditions"===t)return function(e,t,i,o,s,a,r,l){const c=e.display||{},d=c.conditions||[],u=e=>t({...c,...e});return n.qy`
    ${function(e,t,i,o,s,a){const r=e.conditional_appearance||[],l=e=>t("conditional_appearance",e),c=()=>{const e=(0,w.$)("appr");s.expand(e),l([...r,{id:e,name:(0,h.t)(855,{n:r.length+1}),conditions:[],mode:"every",overrides:{}}])},d=e=>{s.collapse(e),l(r.filter(t=>t.id!==e))},u=(e,t)=>l(r.map(i=>i.id===e?{...i,...t}:i)),p=a?n.qy`<div><button type="button" class="btn btn-text btn-sm" data-open-tab="design" @click=${()=>a("design")}>${(0,h.t)(694)}</button></div>`:n.s6;return n.qy`
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:palette-swatch-outline"></ha-icon>
        <h3>${(0,h.t)(227)}</h3>
      </div>
      ${r.length?n.qy`
            <p class="help">${(0,h.t)(713)}</p>
            ${p}
            ${r.map(e=>function(e,t,i,o,s,a){const r=o.expanded.has(e.id),l=e.conditions||[],c=e.overrides||{},d=`rule-body-${e.id}`,u=(t,i)=>{const n={...c};void 0===i||""===i||null===i?delete n[t]:n[t]=i,s(e.id,{overrides:n})},p=c.use_page_theme,m=Pa.filter(e=>e in c).length;return n.qy`
    <div class="cond rule">
      <div class="cond-head">
        <button
          type="button"
          class="icon-btn sm"
          aria-expanded=${r?"true":"false"}
          aria-controls=${d}
          aria-label=${r?(0,h.t)(204):(0,h.t)(376)}
          @click=${()=>o.toggle(e.id)}
        >
          <ha-icon icon=${r?"mdi:chevron-down":"mdi:chevron-right"}></ha-icon>
        </button>
        <input
          class="input rule-name"
          type="text"
          aria-label=${(0,h.t)(854)}
          placeholder=${(0,h.t)(854)}
          .value=${e.name||""}
          @input=${t=>s(e.id,{name:t.target.value})}
        />
        <span class="chip is-count">${(0,h.t)(1301,{n:l.length})}</span>
        ${m?n.qy`<span class="chip">${(0,h.t)(2,{n:m})}</span>`:n.s6}
        <button
          type="button"
          class="icon-btn sm danger"
          aria-label=${(0,h.t)(800)}
          title=${(0,h.t)(800)}
          @click=${()=>a(e.id)}
        >
          <ha-icon icon="mdi:delete-outline"></ha-icon>
        </button>
      </div>
      ${r?n.qy`
            <div class="rule-body" id=${d}>
              <div class="sub-head">${(0,h.t)(228)}</div>
              ${Ut(l,e.mode||"every",{onAdd:()=>s(e.id,{conditions:[...l,Ta()]}),onUpdate:(t,i)=>s(e.id,{conditions:l.map((e,n)=>n===t?{...e,...i}:e)}),onRemove:t=>s(e.id,{conditions:l.filter((e,i)=>i!==t)}),onMode:t=>s(e.id,{mode:t})},t,void 0,"rule")}
              <div class="sub-head">${(0,h.t)(92)}</div>
              <p class="help">${(0,h.t)(689)}</p>
              ${(0,kt.Yd)((0,h.t)(125),c.background,e=>u("background",e),void 0,void 0,"css")}
              ${(0,kt.nZ)((0,h.t)(126),c.background_image,e=>u("background_image",e),t,"image")}
              ${(0,kt.vm)((0,h.t)(714),!1===p,e=>u("use_page_theme",!e&&void 0))}
              ${!1===p?(0,kt.De)((0,h.t)(179),c.theme||"__default__",i,e=>u("theme","__default__"===e?void 0:e)):n.s6}
              ${(0,kt.lm)((0,h.t)(141),c.border_radius,e=>u("border_radius",e))}
              ${(0,kt.Mg)((0,h.t)(719),c.padding,e=>u("padding",e),"padding")}
              ${(0,kt.Mg)((0,Qt.t)(300),c.margin,e=>u("margin",e),"margin")}
              ${(0,kt.lm)((0,Qt.t)(82),c.border_width,e=>u("border_width",e),void 0,void 0,void 0,Ea)}
              ${(0,kt.De)((0,Qt.t)(80),c.border_style??"",[{label:(0,h.t)(1072),value:""},...Me.map(e=>({label:(0,Qt.t)(e.label),value:e.value}))],e=>u("border_style",e||void 0))}
              ${(0,kt.Yd)((0,Qt.t)(73),c.border_color,e=>u("border_color",e))}
              ${(0,kt.Gz)((0,h.t)(145),c.box_shadow,e=>u("box_shadow",e))}
              ${(0,kt.aA)((0,h.t)(691),c.opacity,e=>u("opacity",Number.isFinite(e)?Math.min(1,Math.max(0,e)):void 0),{min:0,max:1,step:.05,placeholder:"1",optional:!0})}
              ${(0,kt.Gz)((0,Qt.t)(41),c.backdrop_filter,e=>u("backdrop_filter",e),void 0,void 0,{placeholder:"blur(8px)",mono:!0})}
              ${(0,kt.lm)((0,h.t)(173),c.card_height,e=>u("card_height",e))}
            </div>
          `:n.s6}
    </div>
  `}(e,i,o,s,u,d))}
            <div>
              <button type="button" class="btn btn-secondary btn-sm" @click=${c}>
                <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(35)}
              </button>
            </div>
          `:n.qy`
            <div class="empty">
              <ha-icon icon="mdi:palette-swatch-outline"></ha-icon>
              <strong>${(0,h.t)(631)}</strong>
              <p>${(0,h.t)(183)}</p>
              ${p}
              <button type="button" class="btn btn-secondary btn-sm" @click=${c}>
                <ha-icon icon="mdi:plus"></ha-icon>${(0,h.t)(35)}
              </button>
            </div>
          `}
    </section>
  `}(e,s,o,a,r,l)}
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:eye-outline"></ha-icon>
        <h3>${(0,h.t)(309)}</h3>
      </div>
      ${Ut(d,c.mode||"every",{onAdd:()=>u({conditions:[...d,Ta()]}),onUpdate:(e,t)=>u({conditions:d.map((i,n)=>n===e?{...i,...t}:i)}),onRemove:e=>u({conditions:d.filter((t,i)=>i!==e)}),onMode:e=>u({mode:e})},o,i?{...i,basePath:"display"}:void 0,"card")}
    </section>
  `}(e,e=>s("display",e),o,this.hass,s,ja(this.hass),this._rulesState,e=>this.setTab(e));if("flows"===t)return function(e,t,o,s,a){return n.qy`
    <section class="group">
      <div class="field">
        ${(0,kt.XT)((0,h.t)(394),"flows",o)}
        <mc-flows-editor
          .config=${e}
          .hass=${s}
          .expanded=${a.expanded}
          .selected=${a.selected}
          .onToggle=${a.toggle}
          .onRekey=${a.rekey}
          .sections=${a.sections}
          .onSection=${a.setSection}
          .undoSnapshots=${a.undoSnapshots}
          .onUndoSnapshot=${a.setUndoSnapshot}
          .budget=${a.budget}
          .onChange=${e=>{const t={...e};ie(t),i.updateConfig(t)}}
        ></mc-flows-editor>
      </div>
    </section>
  `}(e,0,o,this.hass,this._flowsState);const r={...lo(e),onChange:e=>{const t={...i.getConfig()};void 0===e?delete t.entity:t.entity=e,i.updateConfig(t)}};return function(e,t,i,o,s=!1,a,r){const l=!1!==e.use_page_theme,c=e.popup&&"object"==typeof e.popup?e.popup:void 0,d=!0===c?.enabled;return n.qy`
    <div class="group">
      ${(0,kt.Gz)((0,h.t)(618),e.name,e=>t("name",e),"name",i)}
      ${a?function(e,t,i){return n.qy`
    <div class="mc-field">
      <div class="field-head"><label>${(0,h.t)(172)}</label><span class="help">${(0,h.t)(704)}</span></div>
      <mc-entity-picker
        data-card-entity
        .hass=${t}
        .value=${"string"==typeof e.entity?e.entity:""}
        .label=${(0,h.t)(172)}
        .placeholder=${(0,h.t)(736)}
        .strict=${!0}
        .preferred=${i.preferred}
        .help=${`${(0,h.t)(1051)} ${(0,h.t)(555)}`}
        @value-changed=${e=>i.onChange(""===e.detail.value?void 0:e.detail.value)}
      ></mc-entity-picker>
      ${i.following>0?n.qy`<p class="help follow">${(0,h.t)(1275,{n:i.following})}</p>`:n.s6}
      ${i.needing>0?n.qy`<p class="help follow needs">${(0,h.t)(1276,{n:i.needing})}</p>`:n.s6}
    </div>
  `}(e,o,a):n.s6}
      ${(0,kt.vm)((0,h.t)(1143),l,e=>t("use_page_theme",e),"use_page_theme",i,(0,h.t)(1115))}
      ${(0,kt.De)((0,h.t)(179),l?"__default__":e.theme||"__default__",ja(o),e=>t("theme","__default__"===e?void 0:e),"theme",i,{disabled:l})}
    </div>
    ${r?n.qy`<div class="group" data-card-share>
          <div class="bar">
            <button type="button" class="btn btn-sm" data-share="export" @click=${t=>{za(t,"export",e,r,Object.keys(o?.states??{}))}}><ha-icon icon="mdi:export-variant"></ha-icon>${(0,h.t)(915)}</button>
            <button type="button" class="btn btn-sm" data-share="import" @click=${t=>{za(t,"import",e,r,Object.keys(o?.states??{}))}}><ha-icon icon="mdi:import"></ha-icon>${(0,h.t)(486)}</button>
          </div>
          ${La.test(JSON.stringify(e))?n.qy`<div class="bar" data-map-later>
                <span class="help">${(0,h.t)(1077)}</span>
                <button type="button" class="btn btn-sm" @click=${t=>{!async function(e,t,i,n){const o=e.currentTarget.closest("[data-card-share]").querySelector("[data-share-slot]");o.replaceChildren();try{const e=await(0,Aa.cs)();if(!await customElements.get(e.tags.library).mapStep())throw new Error("map")}catch{return void(o.textContent=(0,h.t)(1065))}const s=Object.assign(document.createElement("mc-map-entities"),{value:t,entities:n});s.addEventListener("mc-map-cancel",()=>o.replaceChildren()),s.addEventListener("mc-map-apply",e=>{o.replaceChildren(),i(e.detail.data)}),o.append(s)}(t,e,r,Object.keys(o?.states??{}))}}><ha-icon icon="mdi:link-variant"></ha-icon>${(0,h.t)(561)}</button>
              </div>`:n.s6}
          <div data-share-slot></div>
        </div>`:n.s6}
    <section class="group">
      <div class="group-head">
        <ha-icon icon="mdi:dock-window"></ha-icon>
        <h3>${(0,h.t)(767)}</h3>
      </div>
      ${(0,kt.vm)((0,h.t)(926),d,e=>t("popup",e?{...c,enabled:!0}:c&&Object.keys(c).length>1?{...c,enabled:!1}:void 0),"popup",i,(0,h.t)(444))}
      ${d?n.qy`<mc-popup-settings
            .popup=${c}
            .hass=${o}
            .canvas=${s}
            .onChange=${e=>t("popup",{...e,enabled:!0})}
          ></mc-popup-settings>`:n.s6}
    </section>
  `}(e,s,o,this.hass,"studio"===this.variant,r,e=>i.updateConfig(e))}_renderSlot(e,t,i){const o=this.stateManager,s=(0,C.kW)(e,t);if(!s)return n.qy``;if("tabs"===s.type)return function(e,t,i,o,s){const a=i.tabs?.[t],r=i=>o.updateTab(e.row,e.col,e.module,e.child,t,i);return n.qy`
    <div class="group">
      <div style="display: contents" @change=${e=>{const t=e.target;t instanceof HTMLInputElement&&!t.value.trim()&&(t.value=a?.label??"")}}>
        ${(0,kt.Gz)((0,h.t)(503),a?.label,e=>{e.trim()&&r({label:e})})}
      </div>
      ${(0,kt.AJ)((0,h.t)(466),a?.icon,e=>r({icon:e||void 0}),s)}
      ${(0,kt.AJ)((0,h.t)(474),a?.active_icon,e=>r({active_icon:e||void 0}),s)}
      <p class="help">${(0,h.t)(514)}</p>
    </div>
  `}(t,t.slot,s,o,this.hass);const a=s;return"design"===i?function(e,t,i,n,o){const s=i.columns?.[t]??{modules:[]};return Ts("column",s.design||{},o,i=>{const{design:o}=zs({...s,not_synced:["design"]},i,n);n.updateNestedColumn(e.row,e.col,e.module,e.child,t,{design:o})})}(t,t.slot,a,o,this.hass):"conditions"===i?function(e,t,i,n,o){const s=i.columns?.[t];return Ls("column",s?.display||{},i=>n.updateNestedColumn(e.row,e.col,e.module,e.child,t,{display:i.conditions?.length||i.mode?i:void 0}),o)}(t,t.slot,a,o,this.hass):function(e,t,i,o,s){const a=i.columns?.[t]??{modules:[]},r=Es(a,{row:e.row,col:e.col,module:e.module,child:e.child,slot:t},o,s,i=>o.updateNestedColumn(e.row,e.col,e.module,e.child,t,i),!1);return js(a,t,i=>o.updateNestedColumn(e.row,e.col,e.module,e.child,t,i),function(e,t,i){const o=!t.not_synced?.includes("column_widths");return{sync:i.getConfig().template&&!e.child?.length?n.qy`<mc-sync-indicator
        .synced=${o}
        .hasTemplate=${!0}
        .hideIfNoTemplate=${!0}
        .propertyPath=${"column_widths"}
        @sync-toggle=${n=>{n.stopPropagation(),i.updateModule(e.row,e.col,e.module,{not_synced:_e(t.not_synced,"column_widths",o)})}}
      ></mc-sync-indicator>`:n.s6,row:{...t,columns:t.columns||[]},setLayout:t=>i.setNestedRowLayout(e.row,e.col,e.module,e.child,t),setWidths:(t,n)=>i.setNestedColumnWidths(e.row,e.col,e.module,e.child,t,n)}}(e,i,o),r)}(t,t.slot,a,o,this.hass)}_renderModule(e,t,i){const o=this._module(t);if(!o)return n.qy``;if(!k.s.get(o.type))return n.qy`
        <div class="empty">
          <ha-icon icon="mdi:puzzle-remove-outline"></ha-icon>
          <strong>${(0,h.t)(1123)}</strong>
          <p class="mono">${o.type}</p>
        </div>
      `;const s=e.template,a=this.stateManager;let r,l=s;if(t.child?.length)if(s){l=void 0;const i=e.rows[t.row].columns[t.col].modules[t.module],n=we(i,e=>a.replaceModule(t.row,t.col,t.module,e));r=e=>n((0,S.O6)(i,t.child,e))}else r=e=>a.replaceModule(t.row,t.col,t.module,e,t.child);else{const e=e=>a.replaceModule(t.row,t.col,t.module,e);r=s?we(o,e):e}const c=function(e,t){const i=$t;$t=e;try{return t()}finally{$t=i}}((0,C.iA)(t),()=>Jn.render(i,o,this.hass,r,l,oo(e,t),(0,rt.Bm)(e,t)));return n.qy`<div class="mod-body" @mc-layer-move=${e=>{a&&function(e,t,i){const n=e.getConfig(),o=(0,rt.t8)(n,t);if(!o)return!1;const s=(0,rt.HR)(o.list,o.index,i);if(void 0===s)return!1;if(!t.child?.length)return e.setSelectedPath({rowIndex:t.row,columnIndex:t.col,moduleIndex:s}),e.moveModule(t.row,t.col,o.index,t.row,t.col,s),!0;const a=s>o.index?1:-1;let r=t;for(let t=o.index;t!==s;t+=a){const t=r.child[r.child.length-1];if(!e.moveModuleBy(r.row,r.col,r.module,a,r.child))return!1;r={...r,child:[...r.child.slice(0,-1),{slot:t.slot,index:t.index+a}]}}}(a,t,e.detail.to)}} @mc-layers-low-power=${()=>{a&&function(e){e.updateConfig({...e.getConfig(),layers_low_power:!0})}(a)}}>${this._renderChildListSync(e,t)}${c}</div>`}_renderChildListSync(e,t){if(!e.template)return n.s6;const i=e.rows[t.row]?.columns[t.col]?.modules[t.module],o=(0,M.us)(i);if(!i||!o)return n.s6;const s=(i.not_synced||[]).includes(o),a=!!t.child?.length;return n.qy`
      <div class="child-list-sync" data-overridden=${s?"":n.s6}>
        <p class="help">${s?a?(0,h.t)(1085):(0,h.t)(1059):a?(0,h.t)(1086):(0,h.t)(1060)}</p>
        ${s?n.qy`<button type="button" class="btn btn-text btn-sm child-list-reset" @click=${()=>this._resetChildList(t.row,t.col,t.module,o)}>
              <ha-icon icon="mdi:backup-restore"></ha-icon>${(0,h.t)(824)}
            </button>`:n.s6}
      </div>
    `}_resetChildList(e,t,i,n){const o=this.stateManager,s=o?.getConfig().rows[e]?.columns[t]?.modules[i];o&&s&&(o.updateModule(e,t,i,{not_synced:_e(s.not_synced,n,!1)}),this.dispatchEvent(new CustomEvent("mc-template-reapply",{bubbles:!0,composed:!0})))}};Ua.styles=[...tt.yj,n.AH`
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
        margin-inline-start: -8px;
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
        text-align: start;
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
      :host([dir='rtl']) .dgroup-btn[aria-expanded='false'] .chev {
        transform: rotate(90deg);
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
    `],Za([(0,o.MZ)({attribute:!1})],Ua.prototype,"stateManager",void 0),Za([(0,o.MZ)({attribute:!1})],Ua.prototype,"hass",void 0),Za([(0,o.MZ)({reflect:!0})],Ua.prototype,"variant",void 0),Za([(0,o.wk)()],Ua.prototype,"_state",void 0),Za([(0,o.wk)()],Ua.prototype,"_tabs",void 0),Za([(0,o.wk)()],Ua.prototype,"_expandedRules",void 0),Za([(0,o.wk)()],Ua.prototype,"_expandedFlows",void 0),Za([(0,o.wk)()],Ua.prototype,"_flowSections",void 0),Za([(0,o.wk)()],Ua.prototype,"_flowUndo",void 0),Za([(0,o.wk)()],Ua.prototype,"_designView",void 0),Za([(0,o.wk)()],Ua.prototype,"_designOpen",void 0),Ua=Za([(0,o.EM)("mc-inspector")],Ua);var Ga=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const Ya=[{id:"form",label:402},{id:"yaml",label:1198}];let Qa=class extends n.WF{constructor(){super(...arguments),this._focusMode=!1}get inspector(){return this.shadowRoot?.querySelector("mc-inspector")??null}connectedCallback(){super.connectedCallback(),this.stateManager&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0,this._subscribedTo=void 0}willUpdate(e){e.has("stateManager")&&this.stateManager!==this._subscribedTo&&this._subscribe()}updated(){this._focusMode&&(this._focusMode=!1,this.shadowRoot?.querySelector('.mode [aria-selected="true"]')?.focus())}_subscribe(){this._unsubscribe?.(),this._subscribedTo=this.stateManager,this._unsubscribe=this.stateManager?.subscribe(e=>{this._state=e})}_onModeKeydown(e,t){const i=Ya.findIndex(e=>e.id===t),n="rtl"===(0,Ge.k)(e.currentTarget),o={[n?"ArrowLeft":"ArrowRight"]:(i+1)%Ya.length,[n?"ArrowRight":"ArrowLeft"]:(i-1+Ya.length)%Ya.length,Home:0,End:Ya.length-1}[e.key];void 0!==o&&(e.preventDefault(),this._focusMode=!0,this.stateManager?.setEditorMode(Ya[o].id))}focusStudioButton(){const e=this.shadowRoot?.querySelector(".studio-cta .btn-primary");e?e.focus():this.shadowRoot?.querySelector('.mode [aria-selected="true"]')?.focus()}_openStudio(){this.dispatchEvent(new CustomEvent("open-studio",{bubbles:!0,composed:!0}))}render(){const e=this._state,t=this.stateManager;if(!e||!t)return n.qy``;const i="yaml"===e.editorMode?"yaml":"form";return n.qy`
      <div class="pane-head">
        <div class="seg mode" role="tablist" aria-label=${(0,h.t)(339)}>
          ${Ya.map(e=>{const o=e.id===i;return n.qy`
              <button
                type="button"
                role="tab"
                aria-selected=${o?"true":"false"}
                tabindex=${o?"0":"-1"}
                @click=${()=>t.setEditorMode(e.id)}
                @keydown=${e=>this._onModeKeydown(e,i)}
              >${(0,h.t)(e.label)}</button>
            `})}
        </div>
        <button type="button" class="icon-btn" title=${(0,h.t)(1120)} aria-label=${(0,h.t)(1120)} ?disabled=${!t.canUndo()} @click=${()=>t.undo()}>
          <ha-icon icon="mdi:undo"></ha-icon>
        </button>
        <button type="button" class="icon-btn" title=${(0,h.t)(791)} aria-label=${(0,h.t)(791)} ?disabled=${!t.canRedo()} @click=${()=>t.redo()}>
          <ha-icon icon="mdi:redo"></ha-icon>
        </button>
      </div>
      <div class="pane-inner">
        <mc-template-bar .config=${e.config} .hass=${this.hass}></mc-template-bar>
        ${"yaml"===i?n.qy`<mc-yaml-editor .stateManager=${t} .hass=${this.hass}></mc-yaml-editor>`:n.qy`
              ${this._renderCta(e)}
              <section aria-labelledby="sec-structure">
                <div class="sec-title">
                  <h3 id="sec-structure">${(0,h.t)(1016)}</h3>
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
    `}_renderCta(e){const t=e.config,i=t.rows||[],o=(0,C.TV)(t);return n.qy`
      <div class="studio-cta">
        <div class="cta-top">
          ${this._renderThumb(t,e)}
          <div class="cta-text">
            <h3>${t.name?.trim()||(0,h.t)(1125)}</h3>
            <p>
              ${(0,h.t)(1305,{rows:i.length,mods:o})}
            </p>
          </div>
        </div>
        <button type="button" class="btn btn-primary" @click=${this._openStudio}>
          <ha-icon icon="mdi:arrow-expand"></ha-icon>${(0,h.t)(698)}
        </button>
      </div>
    `}_renderThumb(e,t){const i=(0,C.c4)(t.selectedPath),o=e.rows||[];return n.qy`
      <div class="thumb" aria-hidden="true">
        ${o.length?o.map((e,t)=>{const o=y(b(e)).map(e=>+e.toFixed(3)+"fr").join(" ");return n.qy`
                <div class="t-row" style="grid-template-columns:${o}">
                  ${e.columns.map((e,o)=>n.qy`
                      <div class="t-col">
                        ${e.modules?.length?e.modules.map((e,s)=>n.qy`<span
                                class="t-mod ${"module"===i.kind&&i.row===t&&i.col===o&&i.module===s?"on":""}"
                              ></span>`):n.qy`<span class="t-mod none"></span>`}
                      </div>
                    `)}
                </div>
              `}):n.qy`<span class="t-mod none"></span>`}
      </div>
    `}};Qa.styles=[l.x,n.AH`
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
        margin-inline-end: auto;
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
    `],Ga([(0,o.MZ)({attribute:!1})],Qa.prototype,"stateManager",void 0),Ga([(0,o.MZ)({attribute:!1})],Qa.prototype,"hass",void 0),Ga([(0,o.wk)()],Qa.prototype,"_state",void 0),Qa=Ga([(0,o.EM)("mc-pane-editor")],Qa);var Ja=i(515),Xa=i(2311),er=i(9125),tr=i(9515);const ir={narrow:621,wide:1186,panel:721},nr={narrow:400,wide:800},or=Object.keys(ir),sr={narrow:622,wide:1187,panel:722},ar=e=>({kind:"unknown",reason:e}),rr=()=>(0,h.t)(249);function lr(e){const t=(e,t,i,n=!1)=>({option:e,px:t,note:i,canMatch:!1,borderless:n});switch(e.kind){case"panel":return t("panel",null,(0,h.t)(569),!0);case"masonry":return t("narrow",nr.narrow,(0,h.t)(568));case"sections":return e.columns?t("narrow",function(e,t=1){const i=400*t+32*(t-1);return Math.round((i-88)/12*e+8*(e-1))}(e.columns,e.span),(0,h.t)(571,{columns:e.columns})):t("narrow",nr.narrow,(0,h.t)(570));case"sidebar":return e.sidebar?t("narrow",380,(0,h.t)(572)):t("wide",nr.wide,(0,h.t)(572));default:return t("narrow",nr.narrow,e.reason||rr())}}const cr="ha-more-info-dialog",dr=["closed","dialog-closed"];function hr(e,t,i){if(mr(e),!customElements.get(cr))return document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:i}})),null;const n=function(){let e=document.activeElement;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e instanceof HTMLElement?e:null}(),o=document.createElement(cr);o.hass=t;for(const e of dr)o.addEventListener(e,t=>{t.stopPropagation(),"dialog-closed"===e&&(o.remove(),n?.isConnected&&n.focus({preventScroll:!0}))});return e.appendChild(o),o.showDialog?.({entityId:i}),pr(o),o}function ur(e){const t=e.querySelector('button, a[href], input, select, textarea, ha-icon-button, [tabindex]:not([tabindex="-1"])');if(t)return t;for(const t of e.querySelectorAll("*")){const e=t.shadowRoot&&ur(t.shadowRoot);if(e)return e}return null}function pr(e,t=20){const i=e.shadowRoot&&ur(e.shadowRoot);i?i.focus({preventScroll:!0}):t>0&&e.isConnected&&setTimeout(()=>pr(e,t-1),50)}function mr(e){e.querySelector(cr)?.remove()}function gr(e,t,i){return Math.max(t,Math.min(e,Math.max(t,i)))}const fr={fr:.05,"%":1,px:4},vr=(e,t)=>"px"===t?Math.round(10*e)/10:Math.round(100*e)/100,br=(e,t)=>`${vr(e,t)}${t}`;function yr(e,t,i){const n=v(e[t]),o=v(e[t+1]),s=Math.max((i[t]??0)+(i[t+1]??0),1);if(n.unit===o.unit&&"auto"!==n.unit)return{unit:n.unit,a:n.value,b:o.value,total:s};let a=0,r=0;e.forEach((e,n)=>{if(n===t||n===t+1)return;const o=v(e);"fr"===o.unit&&(i[n]??0)>0&&(a+=o.value,r+=i[n])});const l=a>0&&r>0?a/r:2/s;return{unit:"fr",a:(i[t]??0)*l,b:(i[t+1]??0)*l,total:s}}function _r(e,t,i,n,o){const s=!1!==o.snap,a=fr[i.unit],r=i.a+i.b,l=o.minPx??40;let c=Math.min(r*l/i.total,r/2);s&&(c=Math.min(Math.ceil(c/a-1e-9)*a,r/2));let d=s?Math.round(n/a)*a:n;d=Math.min(Math.max(d,c),r-c);const h=[...e],u=vr(d,i.unit);return h[t]=br(u,i.unit),h[t+1]=br(r-u,i.unit),h}function wr(e,t,i,n,o={}){const s=yr(e,t,i),a=s.a+s.b;return _r(e,t,s,((i[t]??0)+n)/s.total*a,o)}const $r="__mc_studio_blocked",xr=new Set(["navigate","url"]),kr=new Set(["__proto__","constructor","prototype"]);function Cr(e,t){if(t>40||null===e||"object"!=typeof e)return e;if(Array.isArray(e)){let i;return e.forEach((n,o)=>{const s=Cr(n,t+1);s!==n&&(i??=e.slice(),i[o]=s)}),i??e}const i=e;if("string"==typeof i.action&&xr.has(i.action))return{action:"fire-dom-event",data:{[$r]:i.action}};let n;for(const e of Object.keys(i)){if(kr.has(e))continue;const o=Cr(i[e],t+1);o!==i[e]&&(n??={...i},n[e]=o)}return n??i}function Mr(e){return Cr(e,0)}function Sr(e,t){const i=e.querySelector(t);if(i)return i;for(const i of e.querySelectorAll("*")){const e=i.shadowRoot,n=e&&Sr(e,t);if(n)return n}return null}function Ar(e,t){const i=document.querySelector("home-assistant");(i&&Sr(i.shadowRoot??i,"hui-view")||i||document).dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,detail:t}))}const qr={background:0,flow:1,overlay:2},Er=e=>e.split("/").length,jr=(e,t)=>t.startsWith(`${e}/`);function Tr(e){return e.sort((e,t)=>jr(e.path,t.path)?1:jr(t.path,e.path)?-1:qr[e.placement]!==qr[t.placement]?qr[t.placement]-qr[e.placement]:Er(e.path)!==Er(t.path)?Er(t.path)-Er(e.path):t.order-e.order),e.map(e=>e.path)}function zr(e,t,i=1){if(!e.length)return;const n=void 0===t?-1:e.indexOf(t);return n<0?1===i?e[0]:e[e.length-1]:e[(n+i+e.length)%e.length]}const Lr={flow:661,background:135,overlay:686};function Or(e,t){if(!e)return[];const i=[];let n=0;for(const o of Array.from(e.querySelectorAll("[data-mc-path]"))){const e=o.dataset.mcPath??"",s=(0,C.HT)(e),a=s?(0,C.cv)(t,s):void 0;if(!a)continue;const r=o.getBoundingClientRect();(r.width||r.height)&&i.push({path:e,placement:Rr(a),order:n++,rect:{left:r.left,top:r.top,width:r.width,height:r.height}})}return i}function Rr(e){return"video-bg"===e.type&&void 0===e.placement?"background":(0,rt.xc)(e)}function Pr(e,t,i,n){const o=[],s="x"in n,a=s?function(e,t,i){return Tr(e.filter(e=>function(e,t,i){return t>=e.left&&t<e.left+e.width&&i>=e.top&&i<e.top+e.height}(e.rect,t,i)))}(e,n.x,n.y):function(e,t){return Tr(e.filter(e=>{return i=e.rect,n=t,i.left<n.left+n.width&&n.left<i.left+i.width&&i.top<n.top+n.height&&n.top<i.top+i.height;var i,n}))}(e,n);for(const e of a){const i=(0,C.HT)(e),n=i?(0,C.cv)(t,i):void 0;i&&n&&o.push({key:e,kind:"module",name:(0,rt.AO)(n),detail:(0,h.t)(Lr[Rr(n)]),sel:i})}var r,l,c;return(s?(r=i,l=n.x,c=n.y,!!r&&l>=r.left&&l<r.left+r.width&&c>=r.top&&c<r.top+r.height):!!i&&((e,t)=>e.left<t.left+t.width&&t.left<e.left+e.width&&e.top<t.top+t.height&&t.top<e.top+e.height)(i,n))&&(t.background_layers??[]).slice(0,4).forEach((e,t)=>{if(!0===e?.hidden)return;const i=(0,qa.kk)(e);o.push({key:`backdrop:${t}`,kind:"backdrop",index:t,name:i.detail?`${(0,h.t)(i.type)}, ${i.detail}`:(0,h.t)(i.type),detail:(0,h.t)(170,{n:t+1})})}),o}const Hr=e=>({left:e.left,top:e.top,width:e.width,height:e.height});class Ir{constructor(e){this.host=e,this.measure=e=>{const t=this.host.card()?.shadowRoot,i={};for(const n of e){if(!/^[\d.]+(\/[\d.]+)*$/.test(n))continue;const e=t?.querySelector(`[data-mc-path="${n}"]`)?.getBoundingClientRect();i[n]=e&&(e.width||e.height)?Hr(e):void 0}return i}}here(e,t){const i=this.host.card(),n=this.host.config();if(!i||!n)return[];const o=Or(i.shadowRoot,n),s=i.getBoundingClientRect();return Pr(o,n,s.width||s.height?Hr(s):void 0,{x:e,y:t})}_currentKey(){const e=this.host.selection();return"module"===e.kind?(0,C.VC)(e):void 0}selectionBox(){const e=this.host.selection();if("module"!==e.kind)return;const t=this.host.card()?.shadowRoot?.querySelector(`[data-mc-path="${(0,C.VC)(e)}"]`),i=t?.getBoundingClientRect();return i&&(i.width||i.height)?Hr(i):void 0}hereForSelection(){const e=this.selectionBox(),t=this.host.card(),i=this.host.config();if(!e||!t||!i)return[];const n=t.getBoundingClientRect();return Pr(Or(t.shadowRoot,i),i,n.width||n.height?Hr(n):void 0,e)}pick(e,t){"module"===e.kind&&e.sel?this.host.select(e.sel):"backdrop"===e.kind&&void 0!==e.index&&this.host.openBackdrop(e.index);const i=t.indexOf(e)+1;this.host.announce((0,h.t)(903,{name:e.name,n:Math.max(1,i)}))}altSelect(e,t){const i=this.here(e,t),n=zr(i.map(e=>e.key),this._currentKey(),1),o=i.find(e=>e.key===n);return!!o&&(this.pick(o,i),!0)}step(e){const t=this.hereForSelection(),i=zr(t.map(e=>e.key),this._currentKey(),e),n=t.find(e=>e.key===i);return!!n&&(this.pick(n,t),!0)}sheetItems(e){const t=this._currentKey();return e.map(e=>({key:e.key,name:e.name,detail:e.detail,current:e.key===t}))}}var Vr=i(6355),Dr=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const Fr=["pointerdown","pointerup","mousedown","mouseup","touchstart","touchend","dblclick","contextmenu","keyup"],Nr=new Set(["pointerdown","pointerup","touchstart","touchend"]),Zr=new Set(["render_template","auth/sign_path","camera_thumbnail","weather/subscribe_forecast","magic_card_utils/get_templates","media_source/resolve_media","media_source/browse_media"]),Br=/^recorder\/(clear|import|update|change|adjust|backup|async_)/;function Kr(e){return e.composedPath().some(e=>e instanceof HTMLElement&&e.hasAttribute("data-mc-popup"))}const Wr=e=>e.composedPath().some(e=>e instanceof HTMLElement&&e.classList.contains("mc-pause"));function Ur(e){if("string"!=typeof e||!e)return!1;if(Zr.has(e))return!0;const t=e.slice(e.lastIndexOf("/")+1);return!(!e.startsWith("get")&&!t.startsWith("get")&&"list"!==t&&!e.startsWith("subscribe")&&!t.startsWith("subscribe")&&!e.startsWith("history/")&&(!e.startsWith("recorder/")||Br.test(e)))}const Gr=e=>e&&"object"==typeof e?e.type:void 0;function Yr(e){return new Proxy(e,{get(e,t){const i=Reflect.get(e,t,e);return"function"!=typeof i?i:"sendMessagePromise"===t?(t,...n)=>Ur(Gr(t))?i.call(e,t,...n):Promise.resolve(void 0):"subscribeMessage"===t?(t,n,...o)=>Ur(Gr(n))?i.call(e,t,n,...o):Promise.resolve(()=>{}):"sendMessage"===t?(t,...n)=>{Ur(Gr(t))&&i.call(e,t,...n)}:i.bind(e)}})}function Qr(e){const t=e.callWS?.bind(e),i=e.connection;return{...e,...i?{connection:Yr(i)}:{},callService:async()=>{},callApi:async()=>{},callWS:async e=>Ur(e?.type)&&t?t(e):void 0}}function Jr(e){const t=e.composedPath()[0];return!!(t&&t instanceof HTMLElement)&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable)}function Xr(e){switch(e.kind){case"card":return null;case"row":return`[data-mc-row="${e.row}"]`;case"column":return`[data-mc-col="${e.row}.${e.col}"]`;case"module":return`[data-mc-path="${(0,C.VC)(e)}"]`;case"slot":return`[data-mc-slot="${(0,C.VC)((0,C.tw)(e))}#${e.slot}"]`}}function el(e){const t=e.dataset;if(t.mcPath)return(0,C.HT)(t.mcPath);if(t.mcSlot){const[e,i]=t.mcSlot.split("#"),n=(0,C.HT)(e);return n?(0,C.r$)(n.row,n.col,n.module,n.child,Number(i)):null}if(t.mcCol){const[e,i]=t.mcCol.split(".").map(Number);return{kind:"column",row:e,col:i}}return t.mcRow?{kind:"row",row:Number(t.mcRow)}:null}function tl(e){for(const t of e){if(!(t instanceof HTMLElement))continue;const e=el(t);if(e)return{el:t,sel:e}}return null}function il(e){return tl(e)?.sel??null}function nl(e){return`k-${"slot"===e.kind?"column":e.kind}`}function ol(e){const t=e.getBoundingClientRect(),i=e.offsetWidth>0&&t.width>0?t.width/e.offsetWidth:1,n=e.offsetHeight>0&&t.height>0?t.height/e.offsetHeight:1;return e=>({top:(e.top-t.top)/n,left:(e.left-t.left)/i,width:e.width/i,height:e.height/n})}let sl=class extends n.WF{constructor(){super(...arguments),this.width=lr({kind:"masonry",reason:""}),this.live=!1,this._fillPx=0,this._hoverLabel="",this._tabState=null,this._previewPaused=!1,this._hoverSel=null,this._cardError="",this._connectFrom=null,this._connectNote="",this._cardLive=!1,this._hoverEl=null,this._placeQueued=!1,this._colDrag=null,this._colPreview=null,this._lastKeyResize=null,this._status="",this._statusTimer=0,this._itemMenu=new vt(this,{surface:"canvas",focusSelection:()=>this.focusCanvas(),rename:e=>this._requestRename(e),status:e=>this.showStatus(e),connect:e=>{this._select(e),this._startConnect()}}),this._longPress=new bt((e,t,i)=>this._longPressAt(e,t,i)),this._layers=new Ir({card:()=>this._card,config:()=>this._state?.config,selection:()=>this._sel,select:e=>this._select(e),openBackdrop:e=>{(0,ea.VX)(e),this._select({kind:"card"}),this.stateManager?.setActiveTab("design")},announce:e=>this.showStatus(e)}),this._pressTimer=0,this._hereCount=0,this._docked=!1,this._togglePreviewPause=e=>{e.stopPropagation(),this._previewPaused=!this._previewPaused},this._block=e=>{if(!(this.live||Kr(e)||"keyup"===e.type&&" "===e.key&&Wr(e))){if("contextmenu"===e.type)return e.stopPropagation(),void(e.shiftKey||(e.preventDefault(),this._onContext(e)));"pointerdown"!==e.type&&"mousedown"!==e.type||this.focusCanvas(),e.stopPropagation(),Nr.has(e.type)||e.preventDefault()}},this._stop=e=>{e.stopPropagation()},this._onForwarded=e=>{if(e.stopPropagation(),!this.live)return;const t=e.detail,i=t?.[$r];void 0!==i||"hass-action"===e.type&&function(e){const t=e;if(!t||"string"!=typeof t.action||!t.config)return!1;const i=t.config[`${t.action}_action`]?.action;return"string"==typeof i&&xr.has(i)}(t)?this.showStatus((0,h.t)(625)):Ar(e.type,t)},this._onMoreInfo=e=>{if(e.stopPropagation(),!this.live)return;const t=e.detail?.entityId;"string"==typeof t&&t&&this.dispatchEvent(new CustomEvent("mc-studio-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}))},this._onCardClick=e=>{if(this.live||Kr(e))return;if(Wr(e))return e.preventDefault(),void this._togglePreviewPause(e);if(e.stopPropagation(),e.preventDefault(),this._longPress.justFired)return;if(e.altKey&&!this._connectFrom&&this._layers.altSelect(e.clientX,e.clientY))return void this.focusCanvas();const t=il(e.composedPath())??{kind:"card"};if(this._connectFrom){const e=this._state?.config;if("module"===t.kind&&e&&G(e,t))this._connectNote=(0,h.t)(418);else if("module"===t.kind&&!(0,C.V9)(t,this._connectFrom)){const e=this._connectFrom;this._connectFrom=null,this.stateManager?.addFlow(e,t)}return void this.focusCanvas()}const i="module"===t.kind?void 0:this._flowAt(e);i?this.stateManager?.selectFlow(i):this._select(t),this.focusCanvas()},this._cancelConnect=()=>{this._connectFrom=null,this.focusCanvas()},this._onHintKeydown=e=>{"Escape"===e.key&&(e.preventDefault(),this._cancelConnect())},this._onCardKeydown=e=>{if(this.live||Kr(e))return;if("Tab"===e.key)return;if(e.stopPropagation(),("Enter"===e.key||" "===e.key)&&Wr(e))return;if(Jr(e)&&"Escape"!==e.key)return void e.preventDefault();const t=new KeyboardEvent(e.type,{key:e.key,code:e.code,ctrlKey:e.ctrlKey,metaKey:e.metaKey,altKey:e.altKey,shiftKey:e.shiftKey,repeat:e.repeat,bubbles:!0,composed:!0,cancelable:!0}),i=this.shadowRoot?.querySelector(".canvas");i&&i.dispatchEvent(t),(t.defaultPrevented||"Escape"!==e.key)&&e.preventDefault()},this._onGroundClick=e=>{this.live||e.composedPath().some(e=>e instanceof HTMLElement&&e.classList.contains("float-bar"))||this._longPress.justFired||(this._connectFrom?this._connectFrom=null:(this._state?.selectedFlow&&this.stateManager?.selectFlow(null),this._select({kind:"card"})))},this._onKeydown=e=>{if(this.live||Jr(e)||!this.stateManager)return;if(this._connectFrom&&"Escape"===e.key)return e.preventDefault(),void(this._connectFrom=null);const t=this._sel,i=(e.ctrlKey||e.metaKey)&&!e.altKey,n=!e.altKey||"ArrowUp"!==e.key&&"ArrowDown"!==e.key?0:"ArrowUp"===e.key?-1:1;"module"===t.kind&&n?(e.preventDefault(),this._op(n<0?"up":"down")):"row"!==t.kind&&"slot"!==t.kind||!n?!this._connectFrom&&this._keyboardMenu(e,t)?e.preventDefault():"module"!==t.kind||"Delete"!==e.key&&"Backspace"!==e.key||i?"module"===t.kind&&i&&"d"===e.key.toLowerCase()?(e.preventDefault(),this._op("duplicate")):"Escape"===e.key&&"card"!==t.kind&&(e.preventDefault(),this._select((0,C.tw)(t,this._state?.config))):(e.preventDefault(),this._op("delete")):(e.preventDefault(),this._moveBy(t,n))},this._onGroundContext=e=>{const t=e.composedPath();if(this.live||e.shiftKey||Kr(e))return;if(e.preventDefault(),this._longPress.justFired)return;if(t.some(e=>e instanceof HTMLElement&&e.classList.contains("col-handle")))return;const i=t.some(e=>e instanceof HTMLElement&&e.classList.contains("float-bar"));this._openContext(i?this._sel:{kind:"card"},e.clientX,e.clientY)},this._onLongDown=e=>{const t=e.composedPath();if(!(this.live||Kr(e)||t.some(e=>e instanceof HTMLElement&&(e.classList.contains("col-handle")||e.classList.contains("float-bar"))))&&(this._longPress.down(e),this._clearPress(),"touch"===e.pointerType)){const{clientX:t,clientY:i}=e;this._pressTimer=window.setTimeout(()=>this._press={x:t,y:i},150)}},this._pressMove=e=>{const t=this._press;!this.live&&t&&Math.hypot(e.clientX-t.x,e.clientY-t.y)>8&&this._clearPress()},this._clearPress=()=>{clearTimeout(this._pressTimer),this._pressTimer=0,this._press&&(this._press=void 0)},this._onBgStatus=e=>{(0,ea.Lx)(e.detail)},this._closeSheet=()=>{this._sheet=void 0,this.focusCanvas()},this._pickFromSheet=e=>{const t=this._sheet,i=t?.list.find(t=>t.key===e.detail.key);this._sheet=void 0,t&&i&&this._layers.pick(i,t.list),this.focusCanvas()},this._onPointerMove=e=>{if(this.live)return;const t=e.composedPath(),i=this._card,n=tl(t)??(i&&t.includes(i)?{el:i,sel:{kind:"card"}}:null),o=n?.el??null;if(o===this._hoverEl)return;this._hoverEl=o,this._hoverSel=n?.sel??null;const s=this._state?.config;this._hoverLabel=n&&s&&"card"!==n.sel.kind?(0,C.e9)(s,n.sel).title:"",this._placeHover()},this._onPointerLeave=()=>{this.live||(this._hoverEl=null,this._hoverSel=null,this._placeHover())},this._onLipSlid=e=>{e.target?.classList?.contains("lip")&&this._queuePlace()},this._queuePlace=()=>{if(this._placeQueued)return;this._placeQueued=!0;const e=this._card;(e?e.updateComplete:Promise.resolve(!0)).then(()=>requestAnimationFrame(()=>{this._placeQueued=!1,this._measureFill(),this.live||this._place()}))},this._onHandleDown=e=>{if(this.live)return;const t=this._resizeRow,i=e.currentTarget;if(null===t||0!==e.button||this._colDrag)return;e.preventDefault(),e.stopPropagation();const n=this._measureColumns(t),{rowEl:o}=this._rowEls(t);if(n&&o){try{i.setPointerCapture?.(e.pointerId)}catch{}this._colDrag={row:t,i:Number(i.dataset.i),pointerId:e.pointerId,startX:e.clientX,scale:n.scale,widths:this._widthsOf(t),px:n.px,rowEl:o,template:o.style.gridTemplateColumns,config:this._state?.config},window.addEventListener("pointermove",this._onDragMove),window.addEventListener("pointerup",this._onDragUp),window.addEventListener("pointercancel",this._onDragCancel),window.addEventListener("keydown",this._onDragKey,!0)}},this._onDragMove=e=>{const t=this._colDrag;if(!t||e.pointerId!==t.pointerId)return;e.preventDefault();const i=wr(t.widths,t.i,t.px,(e.clientX-t.startX)/t.scale,{snap:!e.altKey});t.next=i,t.rowEl.style.gridTemplateColumns=(0,f.gp)(i,i.length),this._colPreview=i,this._queuePlace()},this._onDragUp=e=>{this._colDrag&&e.pointerId===this._colDrag.pointerId&&this._endColumnDrag(!0)},this._onDragCancel=e=>{this._colDrag&&e.pointerId===this._colDrag.pointerId&&this._endColumnDrag(!1)},this._onDragKey=e=>{this._colDrag&&"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._endColumnDrag(!1))},this._onHandleKey=e=>{if(this.live||this._colDrag||!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault(),e.stopPropagation();const t=this._resizeRow,i=null===t?null:this._measureColumns(t);if(null===t||!i)return;const n=Number(e.currentTarget.dataset.i),o=this._widthsOf(t),s="Home"===e.key||"End"===e.key?wr(o,n,i.px,1e6*("Home"===e.key?-1:1)):function(e,t,i,n,o={}){const s=yr(e,t,i);return _r(e,t,s,s.a+n*fr[s.unit],{...o,snap:!1})}(o,n,i.px,("ArrowLeft"===e.key?-1:1)*(e.shiftKey?5:1));if(s.join(" ")===o.join(" "))return;const a=Date.now(),r=this._lastKeyResize,l=!!r&&r.row===t.id&&r.i===n&&r.config===this._state?.config&&(e.repeat||a-r.t<500);t.write(s,l),this._lastKeyResize={row:t.id,i:n,t:a,config:this._state?.config}},this._onHandleDblClick=e=>{e.preventDefault(),e.stopPropagation();const t=this._resizeRow,i=null===t?null:this._measureColumns(t);if(null===t||!i)return;const n=this._widthsOf(t);this._commitWidths(t,function(e,t,i){const n=yr(e,t,i),o=(n.a+n.b)/2,s=[...e];return s[t]=br(o,n.unit),s[t+1]=br(o,n.unit),s}(n,Number(e.currentTarget.dataset.i),i.px),n)}}showStatus(e){this._status=e,clearTimeout(this._statusTimer),this._statusTimer=window.setTimeout(()=>{this._status=""},3e3)}focusCanvas(){this.shadowRoot?.querySelector(".canvas")?.focus({preventScroll:!0})}connectedCallback(){super.connectedCallback(),this.stateManager&&!this._unsubscribe&&this._subscribe(),this.hasUpdated&&this._observe(),window.addEventListener("resize",this._queuePlace),this._lipRoot=this.getRootNode(),this._lipRoot.addEventListener("transitionend",this._onLipSlid),(0,Vr.AY)(this._layers.measure),Gn();const e=(0,ea.Wb)(()=>this._applyPreview()),t=(0,ea.Rv)(),i=(n=()=>this._syncTabState(),Cn.add(n),()=>Cn.delete(n));var n;this._stopPreview=()=>{e(),t(),i()}}_applyPreview(){const e=this._card?.shadowRoot?.querySelector("mc-bg-stack"),t=this.live?"play":(0,ea.P3)();e&&e.preview!==t&&(e.preview=t)}_applyLive(){const e=this._card;e&&(this.live?(this._connectFrom=null,this._connectNote="",this._itemMenu.close(!1),this._sheet=void 0,this._endColumnDrag(!1),this._longPress.cancel(),this._clearPress(),this._hoverEl=null,this._hoverSel=null,this._docked=!1,e.selectedPath=void 0,e.selectedFlow=null,e.previewPaused=!1,this.hass&&(e.hass=this.hass),e.editMode=!1):(this.hass&&(e.hass=Qr(this.hass)),e.editMode=!0,e.previewPaused=this._previewPaused,this._syncSelection()),this._syncCard(),this._queuePlace(),e.updateComplete.then(()=>this._applyPreview()),this._applyPreview())}_syncSelection(){const e=this._card;if(!e)return;const t=this._sel;e.selectedPath="module"===t.kind?(0,C.VC)(t):"slot"===t.kind?`${(0,C.VC)((0,C.tw)(t))}#${t.slot}`:void 0,e.selectedFlow=this._state?.selectedFlow??null}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe?.(),this._unsubscribe=void 0,this._subscribedTo=void 0,this._ro?.disconnect(),this._ro=void 0,window.removeEventListener("resize",this._queuePlace),this._lipRoot?.removeEventListener("transitionend",this._onLipSlid),this._lipRoot=void 0,this._endColumnDrag(!1),this._itemMenu.close(!1),this._longPress.cancel(),this._clearPress(),clearTimeout(this._statusTimer),(0,Vr.AY)(void 0),this._stopPreview?.(),this._sheet=void 0}willUpdate(e){e.has("stateManager")&&this.stateManager!==this._subscribedTo&&this._subscribe();const t=this._colDrag;t&&e.has("_state")&&this._state?.config!==t.config&&this._endColumnDrag(!1)}_subscribe(){this._unsubscribe?.(),this._subscribedTo=this.stateManager,this._unsubscribe=this.stateManager?.subscribe(e=>{this._state=e})}firstUpdated(){const e=document.createElement(r.Mp);e.editMode=!this.live,e.previewPaused=!this.live&&this._previewPaused,this._card=e,this.hass&&(e.hass=this.live?this.hass:Qr(this.hass)),this._syncCard();const t=this.shadowRoot.querySelector(".card-host");for(const e of Fr)t.addEventListener(e,this._block,!0);t.addEventListener("click",this._onCardClick,!0),t.addEventListener("keydown",this._onCardKeydown,!0),t.addEventListener("mc-bg-layer-status",this._onBgStatus);const i=this.shadowRoot.querySelector(".canvas");i.addEventListener("pointerdown",this._onLongDown,!0),i.addEventListener("pointermove",this._longPress.move,!0);for(const e of["pointerup","pointercancel","scroll"])i.addEventListener(e,this._longPress.cancel,!0);for(const e of["pointerup","pointercancel","scroll"])i.addEventListener(e,this._clearPress,!0);i.addEventListener("pointermove",this._pressMove,!0),t.addEventListener("hass-action",this._onForwarded),t.addEventListener("ll-custom",this._onForwarded),t.addEventListener("hass-more-info",this._onMoreInfo),t.appendChild(e),this._observe(),document.fonts?.ready.then(this._queuePlace,()=>{})}_observe(){if(this._ro||"undefined"==typeof ResizeObserver)return;this._ro=new ResizeObserver(this._queuePlace);const e=this.shadowRoot?.querySelector(".canvas-inner");e&&this._ro.observe(e),this._card&&this._ro.observe(this._card)}updated(e){if(e.has("live")&&void 0!==e.get("live")?this._applyLive():e.has("hass")&&this._card&&this.hass&&(this._card.hass=this.live?this.hass:Qr(this.hass)),e.has("_previewPaused")&&this._card&&!this.live&&(this._card.previewPaused=this._previewPaused),this._syncTabState(),e.has("_state")){this._syncCard();const e=this._sel;this.live||this._syncSelection(),!this._connectFrom||(0,C.V9)(e,this._connectFrom)&&this._state?.config===this._connectConfig||(this._connectFrom=null)}this._queuePlace()}_syncTabState(){const e=this._card,t=this._sel,i=this._state?.config,n=e&&!this.live&&"module"===t.kind&&i?(0,C.cv)(i,t):void 0,o="tabs"===n?.type?"__hover__"===(s=kn)?"hover":"__tab_active__"===s||s.endsWith("::tab_active")?"active":"__tab_disabled__"===s||s.endsWith("::tab_disabled")?"disabled":null:null;var s;const a=o&&"module"===t.kind?e?.shadowRoot?.querySelector(`[data-mc-path="${(0,C.VC)(t)}"]`):null;this._forcedIn&&this._forcedIn!==a&&An(this._forcedIn,null),this._forcedIn=a??void 0;const r=a?An(a,o):null;r!==this._tabState&&(this._tabState=r)}_syncCard(){const e=this._card,t=this._state?.config;if(!e||!t||t===this._cardConfig&&this._cardLive===this.live)return;t.background_layers!==this._cardConfig?.background_layers&&(0,ea.cj)(),this._cardConfig=t,this._cardLive=this.live;const i={...(0,s.wL)(t,this._state?.templateAnimations)};delete i.template;try{e.setConfig(this.live?Mr(i):i),this._cardError="",e.updateComplete.then(()=>this._syncTabState())}catch(e){this._cardError=e instanceof Error?e.message:String(e)}}get _sel(){return(0,C.c4)(this._state?.selectedPath??null)}_select(e){this.stateManager?.setSelectedPath((0,C.bm)(e))}_flowAt(e){const t=this._card?.shadowRoot?.querySelectorAll("mc-flows");for(const i of t??[]){const t=i.flowAt?.(e.clientX,e.clientY);if(t)return t}}_startConnect(){const e=this._sel,t=this._state?.config;"module"===e.kind&&t&&!G(t,e)&&(this._connectNote="",this._connectConfig=t,this._connectFrom=e,this.focusCanvas())}_moveBy(e,t){const i=this.stateManager,n=this._state?.config;if(i&&n)if("row"===e.kind){const o=e.row+t;if(o<0||o>=n.rows.length)return;i.moveRow(e.row,o),i.setSelectedPath({rowIndex:o})}else if("slot"===e.kind){const o=(0,C.kW)(n,e),s=e.child?.map(e=>({...e}));"tabs"===o?.type?i.moveTab(e.row,e.col,e.module,s,e.slot,t):"row"===o?.type&&i.moveNestedColumn(e.row,e.col,e.module,s,e.slot,t)}}_keyboardMenu(e,t){const i=this.shadowRoot,n=i?.querySelector(".canvas"),o=i?.querySelector(".sel-frame"),s=i?.querySelector(".device");if(!n)return!1;if("card"===t.kind||!o||o.hidden){const i=(s??n).getBoundingClientRect();return this._itemMenu.shortcut(e,t,s??n,{point:{x:i.left,y:i.top},returnFocus:n})}return this._itemMenu.shortcut(e,t,o,{returnFocus:n})}_onContext(e){this._longPress.cancel(),this._longPress.justFired||this._contextAt(e.composedPath(),e.clientX,e.clientY)}_longPressAt(e,t,i){this._clearPress();const n=this._connectFrom?[]:this._layers.here(t,i);n.length>1&&Un.ready()?this._openSheet(n,t,i,!0):this._contextAt(e,t,i)}_openSheet(e,t,i,n=!1){this._itemMenu.close(!1),this._sheet={list:e,x:t,y:i,hold:n}}_openSheetFromBar(e){const t=this._layers.hereForSelection(),i=e.currentTarget.getBoundingClientRect();t.length&&this._openSheet(t,i.left,i.bottom+4)}_openPlacementMenu(e){const t=this.shadowRoot?.querySelector(".canvas"),i=this._sel;t&&"module"===i.kind&&this._itemMenu.open(i,e.currentTarget,{returnFocus:t},"placement")}_stepLayer(e){this._layers.step(e),this.focusCanvas()}_contextAt(e,t,i){this._openContext(il(e)??{kind:"card"},t,i)}_openContext(e,t,i){const n=this.shadowRoot?.querySelector(".canvas");n&&!this._connectFrom&&this.stateManager&&(this.stateManager.setSelectedPath((0,C.bm)(e),{reveal:!1}),this.focusCanvas(),this._itemMenu.open(e,n,{point:{x:t,y:i},returnFocus:n}))}_requestRename(e){const t=this.shadowRoot?.querySelector(".canvas");this.dispatchEvent(new CustomEvent("mc-rename-request",{bubbles:!0,composed:!0,detail:{sel:e,returnFocus:t}}))}_op(e){const t=this.stateManager,i=this._sel;t&&"module"===i.kind&&("up"===e||"down"===e?t.moveModuleBy(i.row,i.col,i.module,"up"===e?-1:1,i.child):"duplicate"===e?t.duplicateModule(i.row,i.col,i.module,i.child):t.deleteModule(i.row,i.col,i.module,i.child))}async _onBarClick(e,t){const i=t.currentTarget;this._op(e),await this.updateComplete,"delete"!==e&&!i.disabled&&i.isConnected&&"module"===this._sel.kind||this.focusCanvas()}_measureFill(){const e=Math.round(this.shadowRoot?.querySelector(".device")?.clientWidth??0);e!==this._fillPx&&(this._fillPx=e)}_rectOf(e){const t=this._card;if(!t)return null;const i=Xr(e),n=i?t.shadowRoot?.querySelector(i)??("slot"===e.kind?t.shadowRoot?.querySelector(Xr((0,C.tw)(e))):null):t;if(!n)return null;const o=n.getBoundingClientRect();return o.width||o.height?o:null}_place(){const e=this.shadowRoot,t=e?.querySelector(".canvas-inner"),i=e?.querySelector(".sel-frame"),n=e?.querySelector(".float-bar");if(!t||!i||!n)return;const o=this._sel,s=this._rectOf(o),a=e?.querySelector(".canvas"),r=ol(t);if(this._placeColumnHandles(r),!s)return this._docked=!1,i.hidden=!0,n.hidden=!0,a?.classList.remove("framed"),void this._placeHover();const l=r(s),c="module"===o.kind&&this._state?(0,C.cv)(this._state.config,o):void 0,d=!!c&&("flow"!==(0,rt.xc)(c)||(0,rt.aI)(c)&&"video-bg"===c.type),h=d?-3:6,u=l.top-h,p=l.left-h,m=l.width+2*h,g=l.height+2*h;if(i.toggleAttribute("data-layered",d),i.hidden=!1,Object.assign(i.style,{top:`${u}px`,left:`${p}px`,width:`${m}px`,height:`${g}px`}),"module"!==o.kind)this._docked=!1,n.hidden=!0;else{n.hidden=!1;const i=a,s=(0,C.VC)(o),l=e=>e===s||s.startsWith(`${e}/`)||e.startsWith(`${s}/`),c=[...this._card?.shadowRoot?.querySelectorAll("[data-mc-path]")??[]].filter(e=>!l(e.dataset.mcPath??"")).map(e=>e.getBoundingClientRect()).filter(e=>e.width||e.height).map(r);c.push(...function(e,t){const i=[];for(const n of e.querySelectorAll(".lip")){const e=n.getBoundingClientRect();if(!e.width||!e.height)continue;const o=getComputedStyle(n,"::after"),s=o.content&&"none"!==o.content&&parseFloat(o.width)||0,a="start"===n.dataset.side!=("rtl"===n.dataset.dir)?e.left:e.left-s,r=e.width+s;i.push(t({left:a,top:e.top,width:r,height:e.height,right:a+r,bottom:e.bottom,x:a,y:e.top,toJSON:()=>({})}))}return i}(this.getRootNode(),r));const d={top:i.scrollTop,left:i.scrollLeft,width:Math.min(i.clientWidth,t.clientWidth),height:i.clientHeight+(e?.querySelector(".bar-dock")?.offsetHeight??0)},h=function(e,t,i,n){const o=n.top+8,s=n.top+n.height-8,a=n.left+8,r=n.left+n.width-8,l=gr(e.left+e.width-t.width,a,r-t.width),c=gr(e.top,o,s-t.height),d=(e,n)=>{const l={top:e,left:n,width:t.width,height:t.height};return!(e<o||e+t.height>s||n<a||n+t.width>r||i.some(e=>{return(t=l).left<(i=e).left+i.width&&i.left<t.left+t.width&&t.top<i.top+i.height&&i.top<t.top+t.height;var t,i}))},h=[[e.top+e.height+8,l],[e.top-28-8-t.height,l],[c,e.left+e.width+8],[c,e.left-8-t.width]];for(const[e,t]of h)if(d(e,t))return{top:e,left:t};return null}({top:u,left:p,width:m,height:g},{width:Math.max(n.offsetWidth,n.scrollWidth),height:n.offsetHeight},c,d),f=!h;if(f!==this._docked){const t=[...n.querySelectorAll("button")].findIndex(t=>t===e?.activeElement);t>=0&&(this._barFocus={index:t,from:n})}this._docked=f,this._barFocus&&this._barFocus.from!==n&&(n.querySelectorAll("button")[this._barFocus.index]?.focus({preventScroll:!0}),this._barFocus=void 0),h&&Object.assign(n.style,{top:`${h.top}px`,left:`${h.left}px`})}a?.classList.toggle("framed",!i.hidden),this._placeHover();const f="module"===o.kind?this._layers.hereForSelection().length:0;f!==this._hereCount&&(this._hereCount=f),(0,Vr.vs)(),this._applyPreview()}get _resizeRow(){const e=this._sel,t=this._state?.config,i=this.stateManager;if(this.live||this._connectFrom||!t||!i)return null;if("row"===e.kind||"column"===e.kind){const n=t.rows[e.row];return n&&n.columns.length>1?{id:`${e.row}`,grid:n,count:n.columns.length,rowQ:`[data-mc-row="${e.row}"]`,colQ:t=>`[data-mc-col="${e.row}.${t}"]`,write:(t,n)=>i.setColumnWidths(e.row,t,void 0,n)}:null}const n="slot"===e.kind?(0,C.tw)(e):"module"===e.kind?e:null,o=n?(0,C.cv)(t,n):void 0,s="row"===o?.type?o.columns?.length??0:0;if(!n||s<2)return null;const a=(0,C.VC)(n);return{id:a,grid:o,count:s,colQ:e=>`[data-mc-slot="${a}#${e}"]`,write:(e,t)=>i.setNestedColumnWidths(n.row,n.col,n.module,n.child,e,void 0,t)}}_rowEls(e){const t=this._card?.shadowRoot,i=[];for(let n=0;n<e.count;n++){const o=t?.querySelector(e.colQ(n));o&&i.push(o)}return{rowEl:(e.rowQ?t?.querySelector(e.rowQ):i[0]?.closest(".mc-nested-row"))??null,cols:i}}_placeColumnHandles(e){const t=this.shadowRoot?.querySelectorAll(".col-handle");if(!t?.length)return;const i=this._resizeRow,{rowEl:n,cols:o}=null===i?{rowEl:null,cols:[]}:this._rowEls(i),s=n?n.getBoundingClientRect():null;for(const i of t){const t=Number(i.dataset.i),n=o[t]?.getBoundingClientRect(),a=o[t+1]?.getBoundingClientRect();if(!s||!n||!a||!s.width&&!s.height){i.hidden=!0;continue}const r=e(s),l=e(n),c=(l.left+l.width+e(a).left)/2;i.hidden=!1,Object.assign(i.style,{left:`${c}px`,top:`${r.top}px`,height:`${r.height}px`})}}_measureColumns(e){const t=this.shadowRoot?.querySelector(".canvas-inner"),{cols:i}=this._rowEls(e);if(!t||!i.length)return null;const n=t.getBoundingClientRect(),o=t.offsetWidth>0&&n.width>0?n.width/t.offsetWidth:1;return{px:i.map(e=>e.getBoundingClientRect().width/o),scale:o}}_widthsOf(e){return b(e.grid)}_commitWidths(e,t,i){t.join(" ")!==i.join(" ")&&e.write(t)}_endColumnDrag(e){const t=this._colDrag;t&&(this._colDrag=null,this._colPreview=null,window.removeEventListener("pointermove",this._onDragMove),window.removeEventListener("pointerup",this._onDragUp),window.removeEventListener("pointercancel",this._onDragCancel),window.removeEventListener("keydown",this._onDragKey,!0),e&&t.next&&t.next.join(" ")!==t.widths.join(" ")?t.row.write(t.next):t.rowEl.style.gridTemplateColumns=t.template,this._queuePlace())}_renderColumnHandles(){const e=this._resizeRow;if(null===e)return n.s6;const t=this._colPreview??this._widthsOf(e),i=y(t);return n.qy`${t.slice(1).map((e,o)=>{const s=Math.round(i[o]/(i[o]+i[o+1]||1)*100);return n.qy`<div
        class="col-handle k-row ${this._colDrag?.i===o?"dragging":""}"
        data-i=${o}
        role="separator"
        aria-orientation="vertical"
        tabindex="0"
        aria-label=${(0,h.t)(831,{a:o+1,b:o+2})}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${s}
        aria-valuetext=${(0,h.t)(217,{a:o+1,wa:t[o],b:o+2,wb:t[o+1]})}
        title=${(0,h.t)(316)}
        hidden
        @pointerdown=${this._onHandleDown}
        @keydown=${this._onHandleKey}
        @dblclick=${this._onHandleDblClick}
        @click=${this._stop}
      ></div>`})}`}_placeHover(){const e=this.shadowRoot,t=e?.querySelector(".canvas-inner"),i=e?.querySelector(".hover-frame");if(!t||!i)return;const n=this._hoverEl,o=!!this._hoverSel&&(0,C.V9)(this._hoverSel,this._sel);if(!n||!n.isConnected||o)return void(i.hidden=!0);const s=ol(t)(n.getBoundingClientRect());i.hidden=!1,Object.assign(i.style,{top:s.top-4+"px",left:s.left-4+"px",width:`${s.width+8}px`,height:`${s.height+8}px`})}render(){const e=this._state,t=this.live,i=this.width,o=i.px??this._fillPx,s=null!==i.px&&this._fillPx>0&&this._fillPx<i.px-1?(0,h.t)(3,{px:this._fillPx}):"",a=this._sel,r=e?.config,l=!!r&&(0,C.Ak)((0,C.R9)(r,a)),c=r?`${(0,C.e9)(r,a).title}${l?` · ${(0,h.t)(1230)}`:""}`:"";let d=0,u=0;if("module"===a.kind&&r){const e=a.child?.[a.child.length-1];if(e){const t=(0,C.cv)(r,(0,C.tw)(a));d=e.index,u=(0,M.yZ)(t)?.[e.slot]?.length??0}else d=a.module,u=r.rows[a.row]?.columns[a.col]?.modules?.length??0}const p="module"===a.kind&&0===d,m="module"===a.kind&&d>=u-1,g="module"===a.kind&&!!r&&G(r,a),f="module"===a.kind&&r?(0,C.cv)(r,a):void 0,v=!!f&&"flow"!==(0,rt.xc)(f),b=n.qy`
          <div class="float-bar" role="toolbar" aria-label=${(0,h.t)(591)} hidden>
            ${this._renderLayerBar(c,v)}
            <button type="button" class="icon-btn sm" aria-label=${(0,h.t)(608)} title=${(0,h.t)(609)} ?disabled=${p}
              @click=${e=>this._onBarClick("up",e)}><ha-icon icon="mdi:arrow-up"></ha-icon></button>
            <button type="button" class="icon-btn sm" aria-label=${(0,h.t)(605)} title=${(0,h.t)(606)} ?disabled=${m}
              @click=${e=>this._onBarClick("down",e)}><ha-icon icon="mdi:arrow-down"></ha-icon></button>
            <span class="sep" aria-hidden="true"></span>
            <button type="button" class="icon-btn sm" aria-label=${(0,h.t)(323)} title=${(0,h.t)(324)}
              @click=${e=>this._onBarClick("duplicate",e)}><ha-icon icon="mdi:content-copy"></ha-icon></button>
            <button type="button" class="icon-btn sm" aria-label=${(0,h.t)(43)}
              title=${g?(0,h.t)(44,{hint:(0,h.t)(418)}):(0,h.t)(43)} ?disabled=${g}
              aria-pressed=${this._connectFrom?"true":"false"}
              @click=${()=>this._connectFrom?this._cancelConnect():this._startConnect()}><ha-icon icon="mdi:transit-connection-variant"></ha-icon></button>
            <button type="button" class="icon-btn sm danger" aria-label=${(0,h.t)(281)} title=${(0,h.t)(282)}
              @click=${e=>this._onBarClick("delete",e)}><ha-icon icon="mdi:delete-outline"></ha-icon></button>
          </div>
    `;return n.qy`
      ${this._docked&&!t?n.qy`<div class="bar-dock">${b}</div>`:n.s6}
      <div
        class="canvas ${this._connectFrom?"connecting":""} ${t?"live":""}"
        tabindex=${t?n.s6:"0"}
        role="region"
        aria-label=${t?(0,h.t)(164):(0,h.t)(165,{label:c})}
        aria-describedby=${t?n.s6:this._connectFrom?"connect-hint":"canvas-hint"}
        @click=${this._onGroundClick}
        @contextmenu=${this._onGroundContext}
        @keydown=${this._onKeydown}
        @scroll=${this._queuePlace}
        @pointermove=${this._onPointerMove}
        @pointerleave=${this._onPointerLeave}
      >
        <div class="canvas-inner">
          <div class="device ${i.borderless?"borderless":""}" style="--device-w:${null===i.px?"100%":`${i.px}px`}" @transitionend=${this._queuePlace}>
            <div class="device-label"><span>${(0,h.t)(ir[i.option])}${o?` · ${o} px${s}`:""}</span>${this._tabState?n.qy`<span class="state-chip" role="status">${(0,h.t)(962,{state:"hover"===this._tabState?(0,h.t)(460):"active"===this._tabState?(0,h.t)(26):(0,h.t)(306)})}</span>`:n.s6}<span class="device-note">${i.canMatch?n.qy`<button type="button" class="btn btn-text btn-sm" @click=${()=>this.dispatchEvent(new CustomEvent("mc-match-view",{bubbles:!0,composed:!0}))}>${(0,h.t)(567)}</button>`:i.note}${i.note||i.canMatch?" · ":""}${(0,h.t)(532)}${t?n.s6:n.qy`<button type="button" class="preview-pause" data-preview-pause aria-pressed=${this._previewPaused?"true":"false"}
                aria-label=${this._previewPaused?(0,h.t)(834):(0,h.t)(731)} @click=${this._togglePreviewPause} @keydown=${this._stop}
                ><ha-icon icon=${this._previewPaused?"mdi:play":"mdi:pause"}></ha-icon></button>`}</span></div>
            ${this._cardError?n.qy`<p class="card-error" role="status">${(0,h.t)(777,{error:this._cardError})}</p>`:n.s6}
            <div class="card-host"></div>
          </div>
          ${t?n.s6:n.qy`<div class="hover-frame ${nl(this._hoverSel??{kind:"module",row:0,col:0,module:0})}"
            hidden aria-hidden="true">${this._hoverLabel?n.qy`<span class="tag">${this._hoverLabel}</span>`:n.s6}</div>
          <div class="sel-frame ${nl(a)}" hidden aria-hidden="true">
            ${"card"===a.kind?n.s6:n.qy`<span class="tag">${c}</span>`}
            ${"module"===a.kind?n.qy`<i class="h tl"></i><i class="h tr"></i><i class="h bl"></i><i class="h br"></i>`:n.s6}
          </div>
          ${this._renderColumnHandles()}
          ${this._docked?n.s6:b}`}
        </div>
      </div>
      ${this._connectFrom?n.qy`<div class="connect-hint" id="connect-hint" @keydown=${this._onHintKeydown}>
            <ha-icon icon="mdi:transit-connection-variant"></ha-icon>
            <span>${this._connectNote?(0,h.tx)(1298,{note:this._connectNote,key:n.qy`<kbd>Esc</kbd>`}):(0,h.tx)(194,{key:n.qy`<kbd>Esc</kbd>`})}</span>
            <button type="button" class="btn btn-text btn-sm" @click=${this._cancelConnect}>${(0,h.t)(162)}</button>
          </div>`:n.s6}
      <p class="sr-only" id="connect-status" role="status">${this._connectFrom?this._connectNote?(0,h.t)(1297,{note:this._connectNote}):(0,h.t)(193):""}</p>
      ${t?n.s6:n.qy`<p class="canvas-hint" id="canvas-hint" ?hidden=${!!this._connectFrom}>
        ${(0,h.tx)(192,{move:n.qy`<kbd>Alt</kbd> + <kbd>${(0,h.t)(1126)}</kbd>/<kbd>${(0,h.t)(315)}</kbd>`,remove:n.qy`<kbd>${(0,h.t)(279)}</kbd>`,menu:n.qy`<kbd>Shift</kbd> + <kbd>F10</kbd>`})}
        ${(0,h.tx)(944,{ctrl:n.qy`<kbd>Ctrl</kbd> + <kbd>\\</kbd>`,cmd:n.qy`<kbd>⌘</kbd> + <kbd>\\</kbd>`})}
      </p>`}
      <p class="status-capsule" role="status" ?data-on=${!!this._status&&!this._connectFrom}>${this._status}</p>
      ${this._itemMenu.render()}
      ${this._press?n.qy`<span class="press-ring" style=${`left:${this._press.x}px;top:${this._press.y}px`} aria-hidden="true"></span>`:n.s6}
      ${this._sheet?n.qy`<mc-layers-sheet .items=${this._layers.sheetItems(this._sheet.list)} .x=${this._sheet.x} .y=${this._sheet.y} .holdOpen=${!!this._sheet.hold} @pick=${this._pickFromSheet} @close=${this._closeSheet}></mc-layers-sheet>`:n.s6}
    `}_renderLayerBar(e,t){if("module"!==this._sel.kind)return n.s6;const i=this._hereCount,o=this._state?(0,C.cv)(this._state.config,this._sel):void 0,s=o?(0,rt.xc)(o):"flow";return n.qy`${t?n.qy`<span class="fb-name">${"background"===s?(0,h.t)(1294,{name:e}):(0,h.t)(1295,{name:e})}</span>`:n.s6}
      ${i>1?n.qy`<button type="button" class="btn btn-text btn-sm" data-act="layers-here" aria-haspopup="dialog" @click=${e=>this._openSheetFromBar(e)}>${(0,h.t)(510,{n:i})}</button>
            <button type="button" class="icon-btn sm" data-act="layer-above" aria-label=${(0,h.t)(898)} title=${(0,h.t)(898)} @click=${()=>this._stepLayer(-1)}><ha-icon icon="mdi:chevron-up-box-outline"></ha-icon></button>
            <button type="button" class="icon-btn sm" data-act="layer-below" aria-label=${(0,h.t)(899)} title=${(0,h.t)(899)} @click=${()=>this._stepLayer(1)}><ha-icon icon="mdi:chevron-down-box-outline"></ha-icon></button>`:n.s6}
      <button type="button" class="icon-btn sm" data-act="placement" aria-haspopup="menu" aria-label=${(0,h.t)(758)} title=${(0,h.t)(759)} @click=${e=>this._openPlacementMenu(e)}><ha-icon icon="mdi:layers-outline"></ha-icon></button>
      <span class="sep" aria-hidden="true"></span>`}};sl.styles=[l.x,yt,n.AH`
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
        direction: ltr; /* frames, handles and drag maths use screen coordinates */
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
        text-align: end;
      }
      /* the device may be wider than a narrow canvas (it scrolls sideways): the label, with the preview-pause toggle at its end, stays within the screen and pinned to the left edge while scrolled */
      .device-label {
        position: sticky;
        left: 24px; /* physical */
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
        left: 50%; /* physical */
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
        left: 50%; /* physical */
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
        left: 0; /* physical */
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
      .sel-frame .h.tl {
        left: -5px; /* physical */
        top: -5px;
      }
      .sel-frame .h.tr {
        right: -5px; /* physical */
        top: -5px;
      }
      .sel-frame .h.bl {
        left: -5px; /* physical */
        bottom: -5px;
      }
      .sel-frame .h.br {
        right: -5px; /* physical */
        bottom: -5px;
      }
      .sel-frame .tag {
        position: absolute;
        left: -2px; /* physical */
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
        margin-left: calc(var(--col-hit) / -2); /* physical */
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
        left: calc(50% - 1px); /* physical */
        width: 2px;
        border-radius: 1px;
        background: color-mix(in srgb, var(--k) 45%, transparent);
        transition: background-color 0.15s ease-out;
      }
      .col-handle::after {
        content: '';
        position: absolute;
        top: 50%;
        left: calc(50% - 4px); /* physical */
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
      :host([dir='rtl']) .float-bar {
        direction: rtl;
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
        inset-inline: 16px auto;
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
    `],Dr([(0,o.MZ)({attribute:!1})],sl.prototype,"stateManager",void 0),Dr([(0,o.MZ)({attribute:!1})],sl.prototype,"hass",void 0),Dr([(0,o.MZ)({attribute:!1})],sl.prototype,"width",void 0),Dr([(0,o.MZ)({type:Boolean,attribute:!1})],sl.prototype,"live",void 0),Dr([(0,o.wk)()],sl.prototype,"_fillPx",void 0),Dr([(0,o.wk)()],sl.prototype,"_state",void 0),Dr([(0,o.wk)()],sl.prototype,"_hoverLabel",void 0),Dr([(0,o.wk)()],sl.prototype,"_tabState",void 0),Dr([(0,o.wk)()],sl.prototype,"_previewPaused",void 0),Dr([(0,o.wk)()],sl.prototype,"_hoverSel",void 0),Dr([(0,o.wk)()],sl.prototype,"_cardError",void 0),Dr([(0,o.wk)()],sl.prototype,"_connectFrom",void 0),Dr([(0,o.wk)()],sl.prototype,"_connectNote",void 0),Dr([(0,o.wk)()],sl.prototype,"_colPreview",void 0),Dr([(0,o.wk)()],sl.prototype,"_status",void 0),Dr([(0,o.wk)()],sl.prototype,"_press",void 0),Dr([(0,o.wk)()],sl.prototype,"_sheet",void 0),Dr([(0,o.wk)()],sl.prototype,"_hereCount",void 0),Dr([(0,o.wk)()],sl.prototype,"_docked",void 0),sl=Dr([(0,o.EM)("mc-studio-canvas")],sl);var al=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const rl=[{id:"form",label:402},{id:"yaml",label:1198}];function ll(){return/Mac|iPhone|iPad/.test(navigator.platform||"")?"⌘\\":"Ctrl+\\"}function cl(){const e=ll();return[{id:"layers",side:"start",controls:"layers",name:(0,h.t)(511),noun:(0,h.t)(1232),hideLabel:(0,h.t)(448,{noun:(0,h.t)(1232),keys:e}),showLabel:(0,h.t)(960,{noun:(0,h.t)(1232),keys:e})},{id:"inspector",side:"end",controls:"inspector",name:(0,h.t)(494),noun:(0,h.t)(1231),hideLabel:(0,h.t)(448,{noun:(0,h.t)(1231),keys:e}),showLabel:(0,h.t)(960,{noun:(0,h.t)(1231),keys:e})}]}function dl(e){const t=(0,h.t)(1071,{noun:"{noun}"});return{locale:e,hidden:(0,h.t)(1303,{panels:"{panels}"}),shown:(0,h.t)(1304,{panels:"{panels}"}),hintOne:t,hintMany:(0,h.t)(984),hintMigrated:t,hintShortcut:(0,h.t)(922,{keys:ll()}),gotIt:(0,h.t)(426)}}function hl(e,t,i,n=!1){return{[n?"ArrowLeft":"ArrowRight"]:(t+1)%i,[n?"ArrowRight":"ArrowLeft"]:(t-1+i)%i,Home:0,End:i-1}[e]}let ul=class extends n.WF{constructor(){super(...arguments),this.open=!1,this._view={kind:"unknown",reason:""},this._override=null,this._showLayers=!1,this._live=!1,this._swallowCancel=!1,this._lips=new er.r(this,{editor:"card-studio",panels:cl(),strings:dl("en")}),this._lipLocale="en",this._bar=new tr.S(this),this._barSig="",this._wideLayers="undefined"!=typeof window?window.matchMedia?.("(min-width: 901px)"):void 0,this._wideInspector="undefined"!=typeof window?window.matchMedia?.("(min-width: 641px)"):void 0,this._onViewport=()=>this.requestUpdate(),this._focusSel=null,this._layersForRename=!1,this._onMatchView=()=>{this._override=null,this._focusSel='.devices [aria-checked="true"]'},this._close=()=>{this.dispatchEvent(new CustomEvent("studio-close",{bubbles:!0,composed:!0}))},this._onEditModule=()=>{this._showLayers&&window.matchMedia?.("(max-width: 900px)").matches&&(this._showLayers=!1),this._lips.isHidden("inspector")?this._lips.reveal("inspector").then(()=>this.inspector?.focusInspector()):this.inspector?.focusInspector()},this._onRenameRequest=async e=>{const t=e.detail;t&&(!this._showLayers&&window.matchMedia?.("(max-width: 900px)").matches&&(this._showLayers=!0,this._layersForRename=!0),this._lips.isHidden("layers")&&await this._lips.reveal("layers"),await this.updateComplete,this.shadowRoot?.querySelector("mc-structure-outline")?.startRename((0,C.iA)(t.sel),t.returnFocus))},this._onRenameDone=()=>{this._layersForRename&&(this._showLayers=!1),this._layersForRename=!1},this._onStatus=e=>{const t=e.detail?.message;t&&this.shadowRoot?.querySelector("mc-studio-canvas")?.showStatus(t)},this._onCancel=e=>{e.preventDefault(),this._live||this._swallowCancel?this._live&&this._setLive(!1):this._close()},this._onMoreInfo=e=>{e.stopPropagation();const t=this._moreInfoHost,i=e.detail?.entityId;this._live&&t&&i&&hr(t,this.hass,i)},this._onNativeClose=e=>{e.target===e.currentTarget&&this.open&&this._close()},this._onKeydown=e=>{e.stopPropagation();const t=this.stateManager;if(!t||e.defaultPrevented)return;const i=e.key.toLowerCase();if((e.ctrlKey||e.metaKey)&&!e.altKey&&("z"===i||"y"===i)){if(function(e){const t=e.composedPath()[0];return t instanceof HTMLElement&&(/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)||t.isContentEditable)}(e))return;if(e.preventDefault(),this._live)return;return void("y"===i||e.shiftKey?t.redo():t.undo())}if("Escape"!==e.key)return;if(!this._live&&this._showLayers&&window.matchMedia?.("(max-width: 900px)").matches)return e.preventDefault(),this._showLayers=!1,void(this._focusSel=".layers-toggle");const n=e.composedPath();n.slice(0,Math.max(0,n.indexOf(e.currentTarget))).some(e=>e instanceof HTMLDialogElement||e instanceof HTMLElement&&"dialog"===e.getAttribute("role"))?e.preventDefault():this._live&&(e.preventDefault(),this._setLive(!1),this._swallowCancel=!0,setTimeout(()=>{this._swallowCancel=!1},0))}}get inspector(){return this.shadowRoot?.querySelector("mc-inspector")??null}get _dialog(){return this.shadowRoot?.querySelector("dialog")??null}connectedCallback(){super.connectedCallback(),this._wideLayers?.addEventListener?.("change",this._onViewport),this._wideInspector?.addEventListener?.("change",this._onViewport),this.stateManager&&!this._unsubscribe&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._wideLayers?.removeEventListener?.("change",this._onViewport),this._wideInspector?.removeEventListener?.("change",this._onViewport),this._unsubscribe?.(),this._unsubscribe=void 0,this._subscribedTo=void 0}willUpdate(e){e.has("stateManager")&&this.stateManager!==this._subscribedTo&&this._subscribe(),(e.has("open")&&this.open||e.has("lovelace"))&&this._detect(),e.has("open")&&(this._live=!1,this.open&&this._lips.restore());const t=this.hass?.locale?.language??"en";t!==this._lipLocale&&(this._lipLocale=t,this._lips.setPanels(cl(),dl(t))),this._lips.suspended=this._live,this._lips.columns({layers:this.open&&(this._wideLayers?.matches??!0),inspector:this.open&&(this._wideInspector?.matches??!0)})}_detect(){const e=this.stateManager?.getState().config;this._view=function(e,t,i){const n=e?.views;if(!Array.isArray(n)||!n.length)return ar(rr());let o;try{o=function(e,t){const i=t.split("/").filter(Boolean);if(i.length<=1)return e[0];const n=decodeURIComponent(i[i.length-1]);return e.find(e=>"string"==typeof e.path&&e.path===n)||(/^\d+$/.test(n)?e[Number(n)]:void 0)}(n,t)}catch{return ar(rr())}if(!o||"object"!=typeof o||o.strategy)return ar(rr());const s="string"==typeof o.type&&o.type?o.type:!0===o.panel?"panel":"masonry";if("panel"===s||"masonry"===s)return{kind:s,reason:""};if("sections"===s){const e=i?.grid_options,t=e?.columns;return{kind:"sections",reason:"",columns:"full"===t?12:"number"==typeof t&&t>=1&&t<=12?Math.round(t):void 0,span:1}}if("sidebar"===s){const e=i?.view_layout?.position;return{kind:"sidebar",reason:"",sidebar:"sidebar"===e}}return ar((0,h.t)(1171,{type:s}))}(this.lovelace,window.location.pathname,e)}get _width(){return this._override?(e=this._override,t=this._view,{option:e,px:"panel"===e?null:nr[e],note:"unknown"===t.kind?t.reason||rr():"",canMatch:"unknown"!==t.kind,borderless:!1}):lr(this._view);var e,t}_subscribe(){this._unsubscribe?.(),this._subscribedTo=this.stateManager,this._unsubscribe=this.stateManager?.subscribe(e=>{this._state=e})}updated(e){if(e.has("open")&&this._syncOpen(),e.has("hass")){const e=this._moreInfoHost;e&&function(e,t){const i=e.querySelector(cr);i&&(i.hass=t)}(e,this.hass)}this._focusSel&&(this.shadowRoot?.querySelector(this._focusSel)?.focus(),this._focusSel=null),this._watchScrollbar()}_lipTokens(){const e=this._lips;return`--mc-lip-at-start: ${e.isHidden("layers")?"0px":"var(--lpw)"}; --mc-lip-at-end: calc(${e.isHidden("inspector")?"0px":"var(--ipw)"} + ${this._bar.width}px)`}_watchScrollbar(e=!0){const t=`${this.open}|${this._state?.editorMode}|${this._live}|${this._lips.state("layers")}|${this._lips.state("inspector")}|${e}`;if(e&&t===this._barSig)return;e&&(this._barSig=t);const i=this.shadowRoot,n=i?.querySelector("mc-studio-canvas"),o=n?.shadowRoot?.querySelector(".canvas");n&&!o&&e&&n.updateComplete.then(()=>this._watchScrollbar(!1));const s=o??i?.querySelector(".center-alt")??null;this._bar.watch(s,i?.querySelector(".workspace")??null)}_syncOpen(){this._closeMoreInfo();const e=this._dialog;if(e)if(this.open&&!e.open){e.showModal(),this._showLayers=!1;const t=this.shadowRoot?.querySelector("mc-studio-canvas");t?.updateComplete.then(()=>t.focusCanvas())}else!this.open&&e.open&&e.close()}_setLive(e){e!==this._live&&(this._live=e,this._focusSel=".preview-toggle",e||this._closeMoreInfo())}get _moreInfoHost(){return this.shadowRoot?.querySelector(".more-info-host")??null}_closeMoreInfo(){const e=this._moreInfoHost;e&&mr(e)}_onModeKeydown(e,t){const i=hl(e.key,rl.findIndex(e=>e.id===t),rl.length,"rtl"===(0,Ge.k)(e.currentTarget));void 0!==i&&(e.preventDefault(),this._focusSel='.mode [aria-selected="true"]',this.stateManager?.setEditorMode(rl[i].id))}_setWidth(e){e!==this._width.option&&(this._override=e)}_onDeviceKeydown(e){const t=hl(e.key,or.indexOf(this._width.option),or.length,"rtl"===(0,Ge.k)(e.currentTarget));void 0!==t&&(e.preventDefault(),this._setWidth(or[t]),this._focusSel='.devices [aria-checked="true"]')}_renderTopbar(e,t){const i=this.stateManager,o=this._live;return n.qy`
      <header class="topbar">
        <div class="grp">
          <button type="button" class="btn btn-secondary btn-sm" @click=${this._close}>
            <ha-icon class="back-arrow" icon="mdi:arrow-left"></ha-icon>${(0,h.t)(121)}
          </button>
          <button
            type="button"
            class="icon-btn layers-toggle"
            aria-label=${(0,h.t)(509)}
            title=${(0,h.t)(509)}
            aria-controls="layers"
            aria-expanded=${this._showLayers?"true":"false"}
            data-open=${this._showLayers?"true":"false"}
            data-dir=${this._lips.dir}
            ?hidden=${o}
            @click=${()=>{this._showLayers=!this._showLayers}}
          >
            <ha-icon icon="mdi:layers-outline"></ha-icon><svg class="opener-chevron" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" fill="currentColor"></path></svg>
          </button>
          <span class="vr" aria-hidden="true"></span>
          <div class="title">
            <strong>${e.config.name?.trim()||(0,h.t)(1125)}</strong>
            <mc-template-bar compact .config=${e.config} .hass=${this.hass} .disabled=${o} class=${o?"dim":""}></mc-template-bar>
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp">
          <div class="seg mode" role="tablist" aria-label=${(0,h.t)(339)}>
            ${rl.map(e=>{const s=e.id===t;return n.qy`<button
                type="button"
                role="tab"
                aria-selected=${s?"true":"false"}
                tabindex=${s?"0":"-1"}
                ?disabled=${o}
                @click=${()=>i.setEditorMode(e.id)}
                @keydown=${e=>this._onModeKeydown(e,t)}
              >${(0,h.t)(e.label)}</button>`})}
          </div>
          <div class="seg devices" role="radiogroup" aria-label=${(0,h.t)(163)} ?hidden=${"form"!==t&&!o}>
            ${or.map(e=>{const t=e===this._width.option;return n.qy`<button
                type="button"
                role="radio"
                aria-checked=${t?"true":"false"}
                tabindex=${t?"0":"-1"}
                aria-label=${(0,h.t)(sr[e])}
                title=${(0,h.t)(sr[e])}
                @click=${()=>this._setWidth(e)}
                @keydown=${this._onDeviceKeydown}
              >${(0,h.t)(ir[e])}</button>`})}
          </div>
        </div>
        <span class="spacer"></span>
        <div class="grp end">
          <button type="button" class="btn btn-secondary btn-sm preview-toggle" aria-pressed=${o?"true":"false"}
            title=${o?(0,h.t)(775):(0,h.t)(779)}
            @click=${()=>this._setLive(!o)}>
            <ha-icon icon=${o?"mdi:play-circle":"mdi:play-circle-outline"}></ha-icon><span class="lbl">${(0,h.t)(774)}</span>
          </button>
          <span class="live-chip" aria-hidden="true" ?hidden=${!o}>
            <ha-icon icon="mdi:flash-outline"></ha-icon>${(0,h.t)(780)}
          </span>
          <span class="sr-only" role="status" aria-live="polite">${o?(0,h.t)(780):""}</span>
          <button type="button" class="icon-btn" aria-label=${(0,h.t)(1121)} title=${(0,h.t)(1121)}
            ?disabled=${o||!i.canUndo()} @click=${()=>i.undo()}><ha-icon icon="mdi:undo"></ha-icon></button>
          <button type="button" class="icon-btn" aria-label=${(0,h.t)(792)} title=${(0,h.t)(792)}
            ?disabled=${o||!i.canRedo()} @click=${()=>i.redo()}><ha-icon icon="mdi:redo"></ha-icon></button>
          <button type="button" class="btn btn-primary btn-sm" @click=${this._close}>
            <ha-icon icon="mdi:check"></ha-icon>${(0,h.t)(310)}
          </button>
        </div>
      </header>
    `}render(){const e=this._state,t=this.stateManager,i="yaml"===e?.editorMode?"yaml":"form",o=e?(0,C.TV)(e.config):0,s=this._live,a=this._lips;return n.qy`
      <dialog
        class="studio ${this._showLayers?"show-layers":""}"
        aria-label=${(0,h.t)(557)}
        @cancel=${this._onCancel}
        @close=${this._onNativeClose}
        @keydown=${this._onKeydown}
      >
        ${this._lips.status()}
        ${e&&t&&this.open?n.qy`
              ${this._renderTopbar(e,i)}
              <div class="workspace ${s?"live":""} ${a.isHidden("layers")?"no-layers":""} ${a.isHidden("inspector")?"no-inspector":""}"
                style=${this._lipTokens()}>
                <nav class="panel layers" id="layers" aria-label=${(0,h.t)(511)} ?hidden=${s} ?inert=${s||a.isHidden("layers")}
                  data-lip=${a.state("layers")} data-dir=${a.dir}>
                  <div class="panel-title">
                    <h2>${(0,h.t)(509)}</h2>
                    <span class="chip is-count">${(0,h.t)(1261,{mods:o})}</span>
                  </div>
                  <mc-structure-outline .stateManager=${t} variant="layers" @mc-edit-module=${this._onEditModule}
                    @mc-status=${this._onStatus} @mc-rename-done=${this._onRenameDone}></mc-structure-outline>
                </nav>
                ${a.lip("layers")}
                <div class="center">
                  ${"form"===i||s?n.qy`<mc-studio-canvas .stateManager=${t} .hass=${this.hass} .width=${this._width} .live=${s} @mc-match-view=${this._onMatchView}
                        @mc-edit-module=${this._onEditModule} @mc-rename-request=${this._onRenameRequest}
                        @mc-studio-more-info=${this._onMoreInfo}></mc-studio-canvas>`:n.s6}
                  ${"yaml"===i?n.qy`
                        <div class="center-alt" ?hidden=${s}>
                          <div class="yaml-view"><mc-yaml-editor .stateManager=${t} .hass=${this.hass}></mc-yaml-editor></div>
                        </div>
                      `:n.s6}
                </div>
                ${a.lip("inspector")}
                <aside class="panel inspector" id="inspector" aria-label=${(0,h.t)(494)} ?hidden=${s} ?inert=${s||a.isHidden("inspector")}
                  data-lip=${a.state("inspector")} data-dir=${a.dir}>
                  <mc-inspector .stateManager=${t} .hass=${this.hass} variant="studio"></mc-inspector>
                </aside>
              </div>
            `:n.qy``}
        <slot></slot>
        <div class="more-info-host"></div>
      </dialog>
    `}};ul.styles=[l.x,Ja.ZN,Xa.g,n.AH`
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

      :host([dir='rtl']) .back-arrow {
        transform: scaleX(-1);
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
      /* the opener's chevron points the way the Layers panel moves, as a lip's does: in when closed, back when open; right to left mirrors both */
      .layers-toggle .opener-chevron {
        flex: none;
        margin-inline-start: 2px;
      }
      .layers-toggle[data-open='true'] .opener-chevron,
      .layers-toggle[data-dir='rtl'] .opener-chevron {
        transform: scaleX(-1);
      }
      .layers-toggle[data-open='true'][data-dir='rtl'] .opener-chevron {
        transform: none;
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
        --lpw: 240px;
        --ipw: 340px;
        position: relative;
        display: grid;
        grid-template-columns: var(--lw, var(--lpw)) minmax(0, 1fr) var(--iw, var(--ipw));
        min-height: 0;
      }
      /*
       * A hidden panel gives its track to the canvas but keeps its own width, so its content never reflows
       * and a nested scroller keeps its place (WebKit loses it in a 0 px item). It slides off its edge.
       */
      .no-layers {
        --lw: 0px;
      }
      .no-inspector {
        --iw: 0px;
      }
      .layers {
        --mc-lip-off: -100%;
      }
      .inspector {
        --mc-lip-off: 100%;
      }
      .layers[data-lip='hidden'] {
        width: var(--lpw);
      }
      .inspector[data-lip='hidden'] {
        width: var(--ipw);
        justify-self: end;
      }
      .panel {
        background: var(--mc-surface);
        min-height: 0;
        min-width: 0;
        overflow-y: auto;
      }
      .layers {
        border-inline-end: 1px solid var(--mc-divider);
        padding: 12px 8px;
      }
      .inspector {
        border-inline-start: 1px solid var(--mc-divider);
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
          --lpw: 220px;
          --ipw: 320px;
        }
      }
      @media (max-width: 900px) {
        .workspace {
          --ipw: 340px;
          grid-template-columns: minmax(0, 1fr) var(--iw, var(--ipw));
        }
        .layers {
          display: none;
          position: absolute;
          z-index: 7;
          left: 0;
          inset-inline: 0 auto;
          top: 0;
          bottom: 0;
          width: 260px;
          box-shadow: var(--mc-shadow-float);
        }
        .show-layers .layers {
          display: block;
        }
        .layers-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          width: auto;
          min-width: 40px;
          padding-inline: 8px;
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
          border-inline-start: 0;
          border-top: 1px solid var(--mc-divider);
          overflow: visible;
        }
        .layers {
          max-width: 100%;
        }
      }
    `],al([(0,o.MZ)({attribute:!1})],ul.prototype,"stateManager",void 0),al([(0,o.MZ)({attribute:!1})],ul.prototype,"hass",void 0),al([(0,o.MZ)({type:Boolean})],ul.prototype,"open",void 0),al([(0,o.MZ)({attribute:!1})],ul.prototype,"lovelace",void 0),al([(0,o.wk)()],ul.prototype,"_state",void 0),al([(0,o.wk)()],ul.prototype,"_view",void 0),al([(0,o.wk)()],ul.prototype,"_override",void 0),al([(0,o.wk)()],ul.prototype,"_showLayers",void 0),al([(0,o.wk)()],ul.prototype,"_live",void 0),ul=al([(0,o.EM)("mc-studio")],ul);var pl=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const ml={content:231,controls:232,layout:512,advanced:56},gl=e=>e in ml?(0,h.t)(ml[e]):e;let fl=class extends n.WF{constructor(){super(...arguments),this._windowCtrl=new Ue.HK(this,()=>this._onClose()),this.mode="add",this._searchQuery="",this._category="all"}render(){const e="replace"===this.mode,t=this._searchQuery?k.s.search((0,h.A)(this._searchQuery),e=>(0,h.A)((0,Qt.t)(e))):k.s.getAll(),i=this.types?t.filter(e=>this.types.includes(e.metadata.type)):t,o=new Map;for(const e of r.cq){if("all"!==this._category&&this._category!==e)continue;const t=i.filter(t=>t.metadata.category===e).map(e=>e.metadata);t.length>0&&o.set(e,t)}const s=["all",...r.cq.filter(e=>!this.types||i.some(t=>t.metadata.category===e))];return n.qy`
      ${(0,Ue.bU)(e?(0,h.t)(810):(0,h.t)(45),()=>this._onClose(),"m",n.qy`
          <div class="mc-picker-search">
            ${(0,Ue.LW)((0,h.t)(880),this._searchQuery,e=>{this._searchQuery=e})}
            <div class="seg full" role="radiogroup" aria-label=${(0,h.t)(593)}>
              ${s.map(e=>n.qy`
                  <button
                    type="button"
                    role="radio"
                    aria-checked=${this._category===e?"true":"false"}
                    @click=${()=>{this._category=e}}
                  >
                    ${"all"===e?(0,h.t)(62):gl(e)}
                  </button>
                `)}
            </div>
          </div>
          <div class="mc-picker-list">
            ${0===o.size?n.qy`
              <div class="mc-picker-empty">
                ${this._searchQuery?(0,h.t)(647,{query:this._searchQuery}):(0,h.t)(646)}
              </div>
            `:Array.from(o.entries()).map(([t,i])=>n.qy`
                ${"all"===this._category?n.qy`<div class="mc-picker-category">${gl(t)}</div>`:""}
                ${i.map(t=>n.qy`
                    <button
                      type="button"
                      class="mc-picker-item"
                      @click=${()=>this._onSelect(t)}
                      aria-label=${e?(0,h.t)(809,{name:(0,Qt.t)(t.name)}):(0,h.t)(54,{name:(0,Qt.t)(t.name)})}
                    >
                      <span class="mc-picker-item-icon"><ha-icon icon=${t.icon}></ha-icon></span>
                      <span class="mc-picker-item-content">
                        <span class="mc-picker-item-name">${(0,Qt.t)(t.name)}</span>
                        <span class="mc-picker-item-desc">${(0,Qt.t)(t.description)}</span>
                      </span>
                    </button>
                  `)}
              `)}
          </div>
      `)}
    `}_onSelect(e){this.dispatchEvent(new CustomEvent("module-selected",{bubbles:!0,composed:!0,detail:{type:e.type}}))}_onClose(){this.dispatchEvent(new CustomEvent("mc-picker-close",{bubbles:!0,composed:!0}))}};fl.styles=[l.x,tt.fz],pl([(0,o.MZ)()],fl.prototype,"mode",void 0),pl([(0,o.MZ)({attribute:!1})],fl.prototype,"types",void 0),pl([(0,o.wk)()],fl.prototype,"_searchQuery",void 0),pl([(0,o.wk)()],fl.prototype,"_category",void 0),fl=pl([(0,o.EM)("mc-module-selector")],fl);var vl=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let bl=class extends n.WF{constructor(){super(...arguments),this._windowCtrl=new Ue.HK(this,()=>this._close()),this.mode="create",this._templateName="",this._templateDescription="",this._searchQuery="",this._error="",this._confirmLoad=null,this._device="",this._showOverwrite=!1,this._templates={},this._loading=!0,this._saving=!1,this._editingTemplate=null,this._editName="",this._editDescription=""}connectedCallback(){super.connectedCallback(),this._loadTemplates()}willUpdate(e){e.has("_confirmLoad")&&(this._device="")}_focusQuestion(){const e=this.shadowRoot?.querySelector(".mc-template-device mc-entity-picker");e?.updateComplete.then(()=>e.focusInput?.())}updated(e){super.updated(e),e.has("_confirmLoad")&&this._confirmLoad&&this._focusQuestion(),e.has("hass")&&this.hass&&0===Object.keys(this._templates).length&&!this._loading&&this._loadTemplates()}async _loadTemplates(){this._loading=!0;try{if(this.hass){const e=await this.hass.callWS({type:"magic_card_utils/get_templates"});this._templates=e.templates||{}}}catch{this._templates={},this._error=(0,h.t)(556)}this._loading=!1}async _saveTemplate(e,t){this._saving=!0;try{return this.hass?(await this.hass.callWS({type:"magic_card_utils/save_template",name:e,template:t}),this._templates={...this._templates,[e]:t},this._saving=!1,!0):(this._error=(0,h.t)(454),this._saving=!1,!1)}catch{return this._error=(0,h.t)(379),this._saving=!1,!1}}async _deleteTemplate(e){try{if(!this.hass)return!1;await this.hass.callWS({type:"magic_card_utils/delete_template",name:e});const t={...this._templates};return delete t[e],this._templates=t,!0}catch{return this._error=(0,h.t)(378),!1}}_close(){this.dispatchEvent(new CustomEvent("mc-picker-close",{bubbles:!0,composed:!0}))}async _handleCreateSave(){const e=this._templateName.trim();if(!e)return void(this._error=(0,h.t)(1038));if(this._templates[e]&&!this._showOverwrite)return void(this._showOverwrite=!0);if(!this.config)return void(this._error=(0,h.t)(635));const t={config:ye(this.config)},i=this._templateDescription.trim();if(i&&(t.description=i),await this._saveTemplate(e,t)){const t=(0,c.G)(this.config);t.template=e,this.dispatchEvent(new CustomEvent("template-selected",{detail:{config:t},bubbles:!0,composed:!0})),this._close()}}_handleLoadConfirm(e){const t=this._templates[e];if(!t)return;const i=(0,c.G)(t.config);delete i.entity;const n={...i,...this.config?(0,s.uU)(this.config):{}};n.type="custom:magic-card",n.template=e,this._device&&(n.entity=this._device),this.dispatchEvent(new CustomEvent("template-selected",{detail:{config:n},bubbles:!0,composed:!0})),this._close()}async _handleDelete(e){await this._deleteTemplate(e),this._confirmLoad===e&&(this._confirmLoad=null),this._editingTemplate===e&&(this._editingTemplate=null)}_startEdit(e){const t=this._templates[e];this._editingTemplate=e,this._editName=e,this._editDescription=t?.description||"",this._confirmLoad=null}_cancelEdit(){this._editingTemplate=null,this._editName="",this._editDescription=""}async _saveEdit(){if(!this._editingTemplate||!this.hass)return;const e=this._editingTemplate,t=this._editName.trim();if(!t)return void(this._error=(0,h.t)(1038));const i=this._templates[e];if(!i)return;const n={...i,description:this._editDescription.trim()||void 0};if(t!==e){if(this._templates[t])return void(this._error=(0,h.t)(20,{name:t}));await this._deleteTemplate(e)}await this._saveTemplate(t,n)&&(this._editingTemplate=null,this._editName="",this._editDescription="",this._error="")}_getFilteredTemplates(){const e=Object.keys(this._templates).sort((e,t)=>e.localeCompare(t));if(!this._searchQuery)return e;const t=this._searchQuery.toLowerCase();return e.filter(e=>e.toLowerCase().includes(t))}render(){const e="create"===this.mode?(0,h.t)(252):(0,h.t)(535);return n.qy`
      ${(0,Ue.bU)(e,()=>this._close(),"s",n.qy`${"create"===this.mode?this._renderCreate():this._renderLink()}`)}
    `}_renderCreate(){return n.qy`
      <div class="mc-template-form">
        <div class="field">
          <div class="field-head"><label for="tpl-name">${(0,h.t)(1037)}</label></div>
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
        ${this._error?n.qy`<div class="mc-template-error" role="alert">${this._error}</div>`:n.s6}
        ${this._showOverwrite?n.qy`
              <div class="mc-template-overwrite">
                ${(0,h.t)(21,{name:this._templateName.trim()})}
              </div>
            `:n.s6}
      </div>
      <div class="mc-picker-footer" slot="footer">
        <button type="button" class="btn btn-secondary" @click=${this._close}>${(0,h.t)(162)}</button>
        ${this._showOverwrite?n.qy`<button type="button" class="btn btn-primary" ?disabled=${this._saving} @click=${this._handleCreateSave}>${(0,h.t)(715)}</button>`:n.qy`<button type="button" class="btn btn-primary" ?disabled=${!this._templateName.trim()||this._saving} @click=${this._handleCreateSave}>${(0,h.t)(865)}</button>`}
      </div>
    `}_renderEditForm(){return n.qy`
      <div class="mc-template-edit-form">
        <div class="field">
          <div class="field-head"><label for="tpl-edit-name">${(0,h.t)(1037)}</label></div>
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
        ${this._error?n.qy`<div class="mc-template-error" role="alert">${this._error}</div>`:n.s6}
        <div class="mc-template-edit-actions">
          <button type="button" class="btn btn-secondary btn-sm" @click=${this._cancelEdit}>${(0,h.t)(162)}</button>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            ?disabled=${!this._editName.trim()||this._saving}
            @click=${this._saveEdit}
          >
            ${(0,h.t)(865)}
          </button>
        </div>
      </div>
    `}_asksDevice(e){const t=this._templates[e]?.config.rows;return!(!this.config||"string"==typeof(0,Xn.DH)(this.config.entity)||!Array.isArray(t))&&function(e){const t=e=>ao(e.type)&&void 0===(0,Xn.DH)(e.entity)&&!1!==k.s.get(e.type)?.metadata.inherit||((0,M.yZ)(e)??[]).some(e=>e.some(t));return e.some(t)}(t.flatMap(e=>(e.columns??[]).flatMap(e=>e.modules??[])))}_domainsOf(e){const t=this._templates[e]?.config.rows;return Array.isArray(t)?function(e){const t=new Set,i=e=>{const n=k.s.get(e.type)?.metadata.inherit;n&&n.forEach(e=>t.add(e)),((0,M.yZ)(e)??[]).forEach(e=>e.forEach(i))};return e.forEach(i),[...t]}(t.flatMap(e=>(e.columns??[]).flatMap(e=>e.modules??[]))):[]}_renderLink(){if(this._loading)return n.qy`<div class="mc-picker-loading">${(0,h.t)(545)}</div>`;const e=this._getFilteredTemplates();return n.qy`
      <div class="mc-picker-search">
        ${(0,Ue.LW)((0,h.t)(882),this._searchQuery,e=>{this._searchQuery=e})}
      </div>
      ${this._confirmLoad?n.qy`
            <div class="mc-template-confirm">
              <div class="mc-template-confirm-text">
                ${(0,h.t)(534,{name:this._confirmLoad})}
              </div>
              ${this._asksDevice(this._confirmLoad)?n.qy`<div class="mc-template-device">
                    <p class="mc-template-confirm-text">${(0,h.t)(1182)}</p>
                    <mc-entity-picker
                      .hass=${this.hass}
                      .value=${this._device}
                      .label=${(0,h.t)(1182)}
                      .placeholder=${(0,h.t)(736)}
                      .strict=${!0}
                      .preferred=${this._domainsOf(this._confirmLoad)}
                      @value-changed=${e=>{this._device=e.detail.value}}
                    ></mc-entity-picker>
                    <p class="help">${(0,h.t)(1098)}</p>
                  </div>`:n.s6}
              <div class="mc-template-confirm-actions">
                <button type="button" class="btn btn-secondary btn-sm" @click=${()=>{this._confirmLoad=null}}>${(0,h.t)(162)}</button>
                <button type="button" class="btn btn-primary btn-sm" @click=${()=>this._handleLoadConfirm(this._confirmLoad)}>${(0,h.t)(533)}</button>
              </div>
            </div>
          `:n.s6}
      ${this._editingTemplate?this._renderEditForm():n.s6}
      <div class="mc-picker-list">
        ${e.length>0?e.map(e=>n.qy`
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
                    ${this._templates[e]?.description?n.qy`<span class="mc-picker-item-meta">${this._templates[e].description}</span>`:n.s6}
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
              `):n.qy`<div class="mc-picker-empty">${(0,h.t)(658)}</div>`}
      </div>
      <div class="mc-picker-footer" slot="footer">
        <button type="button" class="btn btn-secondary" @click=${this._close}>${(0,h.t)(162)}</button>
      </div>
    `}};bl.styles=[l.x,tt.fz,tt.BP,n.AH`
      .mc-template-device {
        display: grid;
        gap: 6px;
      }
      .mc-template-device > p {
        margin: 0;
      }
    `],vl([(0,o.MZ)({type:String})],bl.prototype,"mode",void 0),vl([(0,o.MZ)({attribute:!1})],bl.prototype,"config",void 0),vl([(0,o.MZ)({attribute:!1})],bl.prototype,"hass",void 0),vl([(0,o.wk)()],bl.prototype,"_templateName",void 0),vl([(0,o.wk)()],bl.prototype,"_templateDescription",void 0),vl([(0,o.wk)()],bl.prototype,"_searchQuery",void 0),vl([(0,o.wk)()],bl.prototype,"_error",void 0),vl([(0,o.wk)()],bl.prototype,"_confirmLoad",void 0),vl([(0,o.wk)()],bl.prototype,"_device",void 0),vl([(0,o.wk)()],bl.prototype,"_showOverwrite",void 0),vl([(0,o.wk)()],bl.prototype,"_templates",void 0),vl([(0,o.wk)()],bl.prototype,"_loading",void 0),vl([(0,o.wk)()],bl.prototype,"_saving",void 0),vl([(0,o.wk)()],bl.prototype,"_editingTemplate",void 0),vl([(0,o.wk)()],bl.prototype,"_editName",void 0),vl([(0,o.wk)()],bl.prototype,"_editDescription",void 0),bl=vl([(0,o.EM)("mc-template-picker")],bl);var yl=i(4753),_l=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const wl=["config-changed","GUImode-changed","value-changed","ll-rebuild","ll-custom","hass-more-info","hass-action"];let $l=class extends n.WF{constructor(){super(),this._showModuleSelector=!1,this._showTemplatePicker=null,this._linkedTemplate=null,this._showSyncDialog=!1,this._syncDialogCtrl=new Ue.dt(this,()=>this._cancelSync(),{selector:"dialog.mc-sync-dialog",focus:e=>e.querySelector(".btn-primary")?.focus({preventScroll:!0})}),this._studioOpen=!1,this._studioMounted=!1,this._stateManager=new me(e=>{this.dispatchEvent(new CustomEvent("config-changed",{bubbles:!0,composed:!0,detail:{config:e}}))}),this._initialTemplateFetched=!1,this._tpl=new Map,this._containEvent=e=>{e.composedPath()[0]!==this&&e.stopPropagation()},this._closeStudio=async()=>{this._studioOpen&&(this._studioOpen=!1,await this.updateComplete,await(this.shadowRoot?.querySelector("mc-studio")?.updateComplete),this.shadowRoot?.querySelector("mc-pane-editor")?.focusStudioButton())},this._onTemplateReapply=e=>{e.stopPropagation();const t=this._stateManager,i=t?.getConfig(),n=e.detail?.resetColumn;if(!i?.template)return;const o=n?()=>t.ownsModuleList(n)&&t.resetItem(n,!0)?t.getConfig():void 0:void 0;this._fetchAndApplyTemplate(i.template,i,o).then(e=>{n&&!e&&this._notify((0,h.t)(245))})},this._sync=e=>{const t=e.config.template,i=t?this._tpl.get(t):void 0;e.templateAnimations!==i?this._stateManager.setTemplateAnimations(i):t&&this.hass&&!this._tpl.has(t)&&t!==this._asked&&(this._asked=t,this._docs(t).catch(()=>{}));const n=(0,g.$C)(e.config);this.hass&&n.icons&&(0,g.fZ)(this.hass),this.hass&&n.shapes&&(0,g.Zz)(this.hass),this.hass&&e.config.custom_animations&&(0,V.T_)().ensure(this.hass)},this._handleAddRow=()=>{this._linkedTemplate?(this._pendingSyncAction=()=>this._stateManager.addRow("1"),this._showSyncDialog=!0):this._stateManager.addRow("1")},this._cancelSync=()=>{this._showSyncDialog=!1,this._pendingSyncAction=void 0},this._handleSyncNo=()=>{this._pendingSyncAction?.(),this._showSyncDialog=!1,this._pendingSyncAction=void 0},this._handleSyncYes=async()=>{this._pendingSyncAction?.(),this._showSyncDialog=!1,this._pendingSyncAction=void 0,await this._saveToTemplate()},this._resyncAll=()=>{const e=be(this._stateManager.getConfig());this._stateManager.updateConfig(e),this._linkedTemplate&&this.hass&&(this._initialTemplateFetched=!1,this._fetchAndApplyTemplate(this._linkedTemplate,e))},this._saveToTemplate=async()=>{const e=this._stateManager,t=e.getConfig().template;if(t&&this.hass)try{const i=await this._docs(t),n=ye((0,s.wL)({...e.getConfig(),not_synced:[]},i,!1));await this.hass.callWS({type:"magic_card_utils/save_template",name:t,template:{config:n}});const o=(0,a.B)(n.custom_animations);this._tpl.set(t,o.length?o:void 0),this._sync(e.getState());const r=e.getConfig(),l=new Map(o.map(e=>[e.id,JSON.stringify(e)])),c=(0,a.B)(r.custom_animations),d=c.filter(e=>r.hidden_animations?.includes(e.id)||l.get(e.id)!==JSON.stringify(e)),h=r.template===t&&d.length<c.length;if(r.template!==t||!h&&!ve(r)&&!r.not_synced)return;const u=be(r);r.hidden_animations&&(u.hidden_animations=r.hidden_animations),h&&(u.custom_animations=d.length?d:void 0),e.updateConfig(u)}catch(e){console.warn("Magic Card Editor: Failed to save template",t,e)}},this._unlinkTemplate=async()=>{const e=this._stateManager,t=e.getConfig().template;try{const i=t&&await this._docs(t),n={...(0,s.wL)(e.getConfig(),i)};if(!t||n.template!==t)return;delete n.template,delete n.hidden_animations,e.updateConfig(n)}catch(e){console.warn("Magic Card Editor: Failed to fetch template",t,e)}},this._onTemplateSelected=e=>{const t={...e.detail.config};t.not_synced?.includes("custom_animations")||delete t.custom_animations,delete t.hidden_animations,this._stateManager.updateConfig(t),this._showTemplatePicker=null,t.template&&this._fetchAndApplyTemplate(t.template,t)},this._onAddModule=e=>{this._moduleSelectorTarget=e.detail,this._showModuleSelector=!0},this._onReplaceModule=e=>{this._replaceTarget=e.detail,this._showModuleSelector=!0},this._onPickerClose=()=>{const e=this._replaceTarget;this._showModuleSelector=!1,this._replaceTarget=void 0,this._focusAfterPicker(e)},this._onModuleSelected=e=>{const t=this._replaceTarget;if(t)return this._replaceModule(t,e.detail.type),this._showModuleSelector=!1,this._replaceTarget=void 0,void this._focusAfterPicker(t);const i=this._moduleSelectorTarget;void 0!==i?.moduleIndex?this._stateManager.addChildModule(i.rowIndex,i.colIndex,i.moduleIndex,i.child,i.slot??0,e.detail.type):i&&this._stateManager.addModule(i.rowIndex,i.colIndex,e.detail.type),this._showModuleSelector=!1,this._moduleSelectorTarget=void 0},this.addEventListener("add-module",this._onAddModule),this.addEventListener("replace-module",this._onReplaceModule),this.addEventListener("request-add-row",this._handleAddRow),this.addEventListener("template-create",()=>{this._showTemplatePicker="create"}),this.addEventListener("template-load",()=>{this._showTemplatePicker="link"}),this.addEventListener("template-resync",this._resyncAll),this.addEventListener("template-save",this._saveToTemplate),this.addEventListener("template-unlink",this._unlinkTemplate),this.addEventListener("open-studio",()=>this.openStudio()),this.addEventListener("studio-close",this._closeStudio),this.addEventListener("mc-card-bridge",e=>{const t=e.detail;e.stopPropagation(),t&&(t.sm=this._stateManager)});for(const e of wl)this.addEventListener(e,this._containEvent);this.addEventListener("input",e=>{const t=e.composedPath()[0];"range"!==t.type&&"ha-slider"!==t.localName||this._stateManager.sliderMoved()},!0)}connectedCallback(){super.connectedCallback(),this._stateManager.attached=!0,Gn(),this.addEventListener("mc-template-reapply",this._onTemplateReapply),this._unsubscribe??=this._stateManager.subscribe(e=>{this._editorState=e,this._linkedTemplate=e.config.template??null,this._sync(e)})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mc-template-reapply",this._onTemplateReapply),this._stateManager.flush(),this._stateManager.attached=!1,this._unsubscribe?.(),this._unsubscribe=void 0}setConfig(e){this._stateManager.setConfig(e),e.template&&this.hass&&!this._initialTemplateFetched&&(this._initialTemplateFetched=!0,this._fetchAndApplyTemplate(e.template,e))}selectByKey(e){this._stateManager?.setSelectedPath((0,C.bm)((0,C.g1)(e)))}setInspectorTab(e){const t=this.shadowRoot?.querySelector("mc-pane-editor");t?.inspector?.setTab(e),this.shadowRoot?.querySelector("mc-studio")?.inspector?.setTab(e)}openStudio(){this._studioMounted=!0,this._studioOpen=!0}_notify(e){const t=this._studioOpen?this.shadowRoot?.querySelector("mc-studio")?.shadowRoot?.querySelector("mc-studio-canvas"):null;t?.showStatus?t.showStatus(e):document.querySelector("home-assistant")?.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:e}}))}async _templates(){this._tplAsk??=this.hass.callWS({type:"magic_card_utils/get_templates"}).finally(()=>{this._tplAsk=void 0});const e=(await this._tplAsk).templates??{};for(const[t,i]of Object.entries(e)){const e=(0,a.B)(i.config.custom_animations);this._tpl.set(t,e.length?e:void 0)}return this._sync(this._stateManager.getState()),e}async _docs(e){return this._tpl.has(e)||e in await this._templates()||this._tpl.set(e,void 0),this._tpl.get(e)}async _fetchAndApplyTemplate(e,t,i){if(!this.hass)return!1;try{const n=(await this._templates())[e];if(!n)return!1;const o=i?i():t;return!!o&&(this._stateManager.setConfig((0,s.e5)(n.config,o,!0)),!0)}catch(t){return console.warn("Magic Card Editor: Failed to fetch template",e,t),!1}}willUpdate(e){e.has("hass")&&this.hass&&(0,yl.Zc)(this.hass),this.lang=(0,h.H)()}render(){if(!this._editorState)return n.qy`<div class="loading" aria-busy="true" aria-label=${(0,h.t)(539)}></div>`;const e=this._renderOverlays(this._editorState);return n.qy`<mc-pane-editor .stateManager=${this._stateManager} .hass=${this.hass}></mc-pane-editor>
${this._studioMounted?n.qy`<mc-studio .stateManager=${this._stateManager} .hass=${this.hass} .lovelace=${this.lovelace} .open=${this._studioOpen}>${this._studioOpen?e:n.s6}</mc-studio>`:n.s6}
${this._studioOpen?n.s6:e}`}_renderOverlays(e){return n.qy`${this._showModuleSelector?n.qy`<mc-module-selector .mode=${this._replaceTarget?"replace":"add"} .types=${this._replaceTypes(e.config)} @module-selected=${this._onModuleSelected}
@mc-picker-close=${this._onPickerClose}></mc-module-selector>`:n.s6}
${this._showTemplatePicker?n.qy`<mc-template-picker .mode=${this._showTemplatePicker} .hass=${this.hass}
.config=${(0,s.wL)(e.config,e.templateAnimations)}
@mc-picker-close=${()=>{this._showTemplatePicker=null}}
@template-selected=${this._onTemplateSelected}></mc-template-picker>`:n.s6}
${this._showSyncDialog?this._renderSyncDialog():n.s6}`}_renderSyncDialog(){return n.qy`<dialog class="mc-sync-dialog" aria-labelledby="sync-title" aria-describedby="sync-text"
@click=${e=>{this._syncDialogCtrl.isBackdropClick(e)&&this._cancelSync()}}>
<div class="dialog" @click=${e=>e.stopPropagation()}><h2 id="sync-title">${(0,h.t)(1131)}</h2>
<p id="sync-text">${(0,h.tx)(1075,{name:n.qy`<span class="mono">${this._linkedTemplate}</span>`})}</p><div class="actions">
<button type="button" class="btn btn-secondary" @click=${this._handleSyncNo}>${(0,h.t)(690)}</button>
<button type="button" class="btn btn-primary" @click=${this._handleSyncYes}>${(0,h.t)(1130)}</button></div></div></dialog>`}_replaceTypes(e){const t=this._replaceTarget?.sel,i=t&&(0,C.cv)(e,t);return i?Ne(i):void 0}_replaceModule(e,t){const i=this._stateManager,n=i.getConfig(),o=(0,C.cv)(n,e.sel),s=We(n,e.sel,t);if(!o||!s)return;i.updateConfig(s.config),i.setSelectedPath(s.path);const a=(0,C.Iu)(o),r=(0,C.Iu)({type:t}),l="tabs"===o.type?(0,M.yZ)(o)?.length??0:0;let c=(0,h.t)(811,{old:a,new:r});l>1?c=(0,h.t)(1278,{old:a,new:r,n:l}):"tabs"===t&&((0,M.yZ)(o)?.flat().length??0)>0&&(c=(0,h.t)(812,{old:a,new:r})),s.dropped&&(c+=" "+(0,h.t)(1274,{n:s.dropped})),e.status?.(c)}_focusAfterPicker(e){e?.focus&&this.updateComplete.then(()=>setTimeout(()=>e.focus(),0))}};$l.styles=[l.x,n.AH`
:host { display: block; }
.loading { min-height: 240px; }
.mc-sync-dialog { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; box-sizing: border-box; width: auto; height: auto; max-width: none; max-height: none; margin: 0; border: 0; padding: 16px; overflow: hidden; color: inherit; background: rgba(0, 0, 0, 0.4); overscroll-behavior: contain; }
.mc-sync-dialog:not([open]) { display: none; }
.mc-sync-dialog::backdrop { background: transparent; }
.dialog { width: min(420px, 100%); display: grid; gap: 12px; padding: 24px; border-radius: var(--mc-radius-lg); background: var(--mc-surface); box-shadow: var(--mc-shadow-float); }
.dialog h2 { margin: 0; font-size: 1.125rem; font-weight: 500; }
.dialog p { margin: 0; font-size: 0.875rem; color: var(--mc-text-2); overflow-wrap: anywhere; }
.actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin-top: 8px; }
`],_l([(0,o.MZ)({attribute:!1})],$l.prototype,"hass",void 0),_l([(0,o.MZ)({attribute:!1})],$l.prototype,"lovelace",void 0),_l([(0,o.wk)()],$l.prototype,"_editorState",void 0),_l([(0,o.wk)()],$l.prototype,"_showModuleSelector",void 0),_l([(0,o.wk)()],$l.prototype,"_moduleSelectorTarget",void 0),_l([(0,o.wk)()],$l.prototype,"_replaceTarget",void 0),_l([(0,o.wk)()],$l.prototype,"_showTemplatePicker",void 0),_l([(0,o.wk)()],$l.prototype,"_linkedTemplate",void 0),_l([(0,o.wk)()],$l.prototype,"_showSyncDialog",void 0),_l([(0,o.wk)()],$l.prototype,"_pendingSyncAction",void 0),_l([(0,o.wk)()],$l.prototype,"_studioOpen",void 0),$l=_l([(0,o.EM)(r.z)],$l),(0,Xo.Oi)(),(0,Qt.G)();const xl="2026.10.12-beta.16"},9100(e,t,i){i.d(t,{A:()=>d,H:()=>r,t:()=>o,tl:()=>l,tx:()=>s});var n=i(4753);const{t:o,tx:s,m:a,locale:r}=(0,n.my)("card-editor",["\"{value}\" is not one of the entity's options.|**Bold**, _italic_, `code`|+ {n, plural, one {# design field} other {# design fields}}|, shown at {px} px|0 dots: moving dashes instead.|0 is round, 1 is most irregular.|1 column|1 is rounder, 0 is squarer.|12-hour|24-hour|<svg viewBox=\"0 0 24 24\">…</svg>|<use> and <image> aren't supported. Draw the shapes as paths and try again.|A background image replaces a gradient here. Remove the image to use a gradient.|A curved line instead of straight segments.|A gradient needs at least 2 stops|A negative value runs the dots from the end to the start.|A preset stored in this card.|A row needs one column|A row, column or layout around this tile has No entity, so there is nothing to follow.|A tabs module needs one tab|A template named \"{name}\" already exists.|A template named \"{name}\" already exists. Overwrite?|Accent colour|Action|Action button for an entity|Actions|Active tab|Add|Add a condition to show this card only when it matters.|Add a condition to show this column only when it matters.|Add a condition to show this module only when it matters.|Add a condition to show this row only when it matters.|Add a condition to show this rule only when it matters.|Add a rule to change the look when conditions match.|Add animation|Add appearance rule|Add colour|Add column|Add column to Row {row}|Add column to {name}|Add condition|Add conditional rule|Add flow|Add flow from here|Add flow from here. {hint}|Add module|Add module to Row {row} Column {column}|Add module to {where}|Add option|Add range|Add row|Add stop|Add tab|Add tab to {name}|Add {name} module|Add, rename and order tabs, and add their modules, in the structure tree.|Advanced|After|After the last slide, go back to the first one|Alarm control panel|Alarm panel|Align|All|All match (AND)|Alternate|Alternate reverse|Always|Always shown, even when nothing moves.|Always visible|Amplitude (%)|An animated icon stored in this card.|An animated wave on the surface. Still with reduced motion.|An attribute graph loads every recorded state with all its attributes; long periods can load slowly.|An input_boolean or switch: off hides the scene, on every card that uses it.|An open pop-up keeps a rectangular surface.|An optional label to help you identify this card in the editor.|Angle|Angle (deg)|Angle in degrees|Animate|Animated|Animated icons|Animated lines between two modules, like solar to house. Speed, width and direction can follow an entity value.|Animated weather icons instead of static ones|Animated weather icons replace icon effects.|Animated weather icons replace icon effects. Your icon effects are paused and come back when Animated icons is off.|Animates the icon like the device it shows.|Animation|Animation colour|Animation {n}|Animations|Any matches (OR)|Appearance overrides|Applied to the active tab, on top of Default and matching rules. Only these settings apply to it.|Applied to the card's content, e.g. letter-spacing: 0.5px|Applied to the disabled tabs, on top of Default and matching rules. Only these settings apply to them.|Applied to {thing} only|Applied while the pointer is over this card, on top of Default and matching rules.|Applied while the pointer is over {thing}, on top of Default and matching rules.|Area|Area opacity|Arrange|Aspect ratio|Assist|Attach to|Attribute|Attributes|Attributes of {id} ({source})|Auto|Auto ({when}: {scene})|Auto close|Auto for this entity: {rule}.|Auto has no animation for this entity; pick one.|Auto shows a holiday between these dates (inclusive), else the season. A range may run over the new year. Type off to skip a holiday.|Automatic|Automatic ({format}, from your profile)|Automatic: Palm Sunday to Easter Monday, worked out for each year.|Autoplay|Autoplay delay (ms)|Autumn|Back|Back to dialog|Back to normal|Backdrop blur|Backdrop opacity|Background colour|Background image|Backgrounds do not change on hover.|Bar background|Bar colour|Bar height|Bar settings apply to every tab and live in Default.|Bar settings apply to every tab and live in the rule.|Before|Behind content|Behind others|Below 1 the whole card fades, text included, which lowers contrast.|Beside the line|Blob|Blurs what is behind the card. It only shows through a see-through background, for example rgba(0, 0, 0, 0.3).|Border decorations|Border radius|Bottom|Bottom left|Bottom right|Box shadow|Box shadow follows the shape as a drop shadow (first shadow only).|Browse|Browse entities|Browse icons|Browse media|Browse services|Browsers only autoplay muted videos.|Built-in|Built-in cards|Built-in: {value}|Button|Button style|Calendar|Calendar display|Call service|Camera entity|Cancel|Canvas width|Canvas, live preview|Canvas, {label} selected|Caps|Card|Card backdrop|Card backdrop layers sit on top of this colour and image.|Card backdrop, layer {n}|Card configuration|Card entity|Card height|Card modules do not follow the card's entity.|Card name|Card settings|Card settings > General|Card structure|Card theme|Card type|Cards|Centre|Change card fields, like background colour, while conditions match. For ring, shape and more, use a design rule on the Design tab.|Changed on this card|Chase dots|Christmas|Circle|Clear|Clear every icon effect|Clear every value in this section|Clear search|Click a module to select it. {move} moves it, {remove} removes it, {menu} opens its menu.|Click the module to connect to. Escape cancels.|Click the module to connect to. {key} cancels.|Climate control card|Clockwise|Close|Close pop-up|Close when|Closes the Magic Card pop-up that is open (also from inside it).|Closes when the entity changes to this state.|Collapse flow {n}|Collapse row {n}|Collapse rule|Colour|Colour format|Colour from|Colour picker|Colour ranges|Colour style|Colour {n}|Colours the icon like Home Assistant does for this entity's state.|Column|Column layout|Column name|Column widths|Column {a} {wa}, Column {b} {wb}|Column {n}|Column {n} width|Combine with|Compact mode|Compact tile card|Condition match|Condition type|Condition {n}|Conditional|Conditional appearance|Conditions|Connection|Contain|Content|Controls|Copy YAML|Copy a design first|Copy a module first|Copy and paste|Copy design|Copy failed: select the path and copy it|Copy module|Copy navigation path|Copy this YAML|Copying failed: the browser blocked the clipboard.|Corner|Corner size|Could not load the template, so the column was not reset.|Could not reach Magic Card Utils. Try again.|Couldn't load the line styles.|Couldn't load the slider looks.|Couldn't tell the view type|Counter-clockwise|Cover|Create template|Create template from this card|Curve|Custom|Custom CSS|Custom SVG|Custom card|Custom cards (HACS)|Custom options|Custom pattern|Custom shape|Custom widths|Customise a copy|Customise this icon|Cut corners|Cut size|Cutout size|Daily|Dashboard default|Dashed|Date format|Date pattern|Day and night|Decimals|Default|Default sets a solid colour, so a rule cannot swap it for a gradient. Clear the Default colour first.|Default tab|Del|Delay|Delete|Delete (Del)|Delete animation|Delete animation {n}|Delete column|Delete column \"{name}\" and its {n, plural, one {# module} other {# modules}}?|Delete flow|Delete flow {n}|Delete range|Delete range {n}|Delete row|Delete rule|Delete tab|Delete tab \"{name}\" and its {n, plural, one {# module} other {# modules}}?|Delete template|Delete template {name}|Density (%)|Description (optional)|Design|Design copied|Design pasted|Device animation|Dialog|Did you mean No entity?|Direction|Disabled tab|Display|Display an image|Display conditions|Done|Dot size (px)|Dots|Dotted|Double tap|Down|Drag to resize, double-click for equal widths|Draw an icon|Draw duration|Draw your own SVG icon instead of one from the icon list.|Drawn along the border; the content keeps clear of them.|Drum|Duotone|Duplicate|Duplicate (Ctrl+D)|Duplicate row|Duration|Easing|Easter|Easter dates automatic|Edge|Edit|Edit as custom|Edit card settings|Edit icon|Edit shape|Edit template|Edit template {name}|Editing design for|Editor mode|Effects|Effects need the icon shape; this icon could not be loaded (or is a multi-colour logo), so it is shown as is.|Elapsed|Elbow|Embed a webpage|Embed my animations|Empty column|Empty opacity (%)|Empty uses the module entity ({entity}).|Empty: the entity's own range and step. Min and max can only narrow that range.|Empty: the entity's own range and step. Min and max can only narrow that range; a step that is not a multiple of the entity's step is replaced by the entity's.|Empty: the module's entity ({entity}).|Empty: the primary colour at {pct}%.|End|End: attach to|Ends at {value} (set in YAML).|Entities|Entity|Entity (for templates)|Entity colour|Entity colour for {name}|Entity does not fit this module|Entity filter|Entity for play condition|Entity for show condition|Entity for states and values|Entity history graph|Entity logbook entries|Entity source|Entity with background image|Equal widths|Equalizer|Equals|Every change|Expand flow {n}|Expand row {n}|Expand rule|Extra scenes layered on top, like Day and night during winter.|Failed to delete template.|Failed to save template.|Fill|Fill|Fill colour|Fill direction|Fill opacity|Fill the area under the line.|Fill transition|Fills the icon like a liquid with a value, e.g. a battery level.|Filter items|Filtered entity list|Fit|Flame|Flat|Flow {n}|Flows|Following the light|Follows a weather entity: the module's, or the one picked as Entity for play condition.|Font family|Font source|Fonts|Forecast days|Forecast type|Form|From|From side|From template|From {source}: {name}|Front|Full|Full (circle)|Fully in sync.|Gap|Gap between columns|Gauge|Gauge style|Gauge visualization|General|Give it a name.|Give this module an id in the template|Glance|Glow|Glow (px)|Go to Default|Go to rule|Google|Google Fonts|Got it|Gradient|Gradient colours|Gradient created from your colour.|Gradient needs an empty Background field. Clear it to use a gradient here.|Gradient preview|Gradient replaced with the editor version.|Grid|Grid layout of cards|Half (semicircle)|Halloween|Has local overrides|Heading|Hello World|Hemisphere|Hexagon|Hidden|Hidden on dashboard|Hidden on the dashboard; opens over it from its #ID, a trigger or an Open pop-up action.|Hide|Hide on dashboard|Hide tab on dashboard|Hide {noun} ({keys})|History graph|History that can't be loaded draws nothing.|Hold|Holiday dates|Holidays|Home Assistant connection unavailable.|Horizontal|Horizontal stack|Hourly|Hours|Hours to show|Hover|How many particles: 100% is 24, the most a scene draws.|Hue|Humidifier|Humidifier control|ISO ({example})|Icon|Icon applied.|Icon colour|Icon effects|Icon only|Icon or picture|Icon or picture ends the line at the module's icon, picture or dial. Module box ends it at the module's edge.|Icon source|Icon when active|Icon when active is set per tab in the structure tree.|Icon when off|Icon when on|Icons|Icons from|Idle colour|Image|Image URL|Image from attribute|Image with entity icons|Image with interactive elements|Import a shared card|In px, or % of the shorter side.|In sync|Infinite|Inherit ({value})|Inherited entity|Inherited from Default: {value}|Inside|Inspector panel|Intensity|Into {container}|Invalid YAML - card will use last valid configuration|Justify|Keep a copy in this card (adds {size})|Keep a copy in this card ({size})|Keep your own icons: install the free Magic Card Utils add-on.|Keep your own shapes for every dashboard with the free Magic Card Utils add-on. Until then, this shape is saved in this card only.|Label|Label position|Label template|Last changed|Layer|Layer settings could not load. Reload the page.|Layers|Layers here ({n})|Layers panel|Layout|Layout {layout}|Leave empty to keep the tab icon.|Leave empty to offer the entity's own options. Custom options rename or pick from them; a value the entity does not offer is shown disabled.|Left|Length (%)|Library|Light|Light control card|Lights, icicles, frost, a cobweb, a pumpkin or a flower vine along the border, for the scenes that have them. The content keeps clear of them.|Line colour|Line draw|Line width|Line width (px)|Linear|Linked to template {name}.|Linked to the saved shape {name}. Change it there and every card that uses it changes.|Liquid fill|List of entity rows|Live|Live data|Load|Load \"{name}\"? This will replace your current config.|Load template|Load template…|Loading|Loading My animations…|Loading editor|Loading editor...|Loading icons…|Loading layer settings…|Loading line styles...|Loading slider looks...|Loading templates...|Loading...|Loading…|Local|Local fonts|Logbook|Long ({example})|Long-term statistic|Look|Loop|Magic Card Utils templates never include it. Applying one keeps this card's entity.|Magic Card integration not found. Please install it via HACS and add the integration.|Magic Card studio|Make a custom shape|Makes your own copy. The original stays in {pack}.|Map|Map entities|Map with entity locations|Marching ants|Markdown|Markdown with Home Assistant templates, e.g. {example}. With an entity set, {entity} shows its state.|Match|Match view|Matches this view (masonry)|Matches this view (panel)|Matches this view (sections)|Matches this view (sections, {columns} of 12 columns)|Matches this view (sidebar)|Material Design Icons|Material Design icons|Max|Max height|Maximise|Media|Media URL or path|Media control|Media folders|Media player controls|Medium ({example})|Merge into design|Merge pasted design|Min|Min speed (s)|Min, Max and Attribute do not apply to a timer; thresholds use its remaining %.|Mode|Module|Module actions|Module box|Module category|Module entity ({entity})|Module name|Module not found|Module not found ({id})|Module options for {name}|Module {n}|Modules marked (no id) come from the template. {hint} to connect it.|More info|Morph|Morphs between the state icons when the entity turns on or off.|Motion|Move down|Move down (Alt+Down)|Move to…|Move up|Move up (Alt+Up)|Move window|Moved {name} to {where}|Muted|My animations|My icons|My icons ({n})|My shapes|My shapes ({n})|Name|Name and state|Name, current value and time span under the graph.|Narrow|Narrow, 400 pixels|Navigate|Navigation|Navigation is off in Preview|Navigation path|Navigation path copied|Needs {kind}|New Year|No CSS property matches \"{query}\".|No appearance rules|No attributes found|No cards found|No conditions yet. The rule applies once a condition is added and matches.|No config available to save.|No entities found|No entity|No entity.|No entity: the line always flows at its speed.|No fonts found|No header text|No icons found|No icons found. Type a full id, such as mdi:fan.|No items found|No media sources available|No modules in this category.|No modules match \"{query}\".|No other column to move to|No other module type to replace with|No preview of this card to open yet|No rows yet|No saved icons yet. Draw an icon, then choose Save to library in the editor.|No saved shapes yet. Make a custom shape, then choose Save as shape.|No services found|No settings for this module.|No tab is disabled yet. Tick tabs under Bar > Disabled tabs in Default.|No template|No templates saved|No visual editor available for this card type. Configure using YAML:|None|Normal|North|Not equals|Not found in My animations. The card plays its embedded copy if it has one.|Not found. My animations needs the Magic Card Utils integration; the card plays its embedded copy if it has one.|Not linked to a template|Not set|Not set in this rule: Default applies.|Notch|Nothing chosen yet. To use the card's device, set it in {link}.|Nothing differs from the template|Nothing set. This state looks like Default.|Now using {name} from the {source}.|Now using {name}.|Now: {device}.|Number|Number of forecasts|Numeric ({example})|Octagon|Off|Off switch|On change|On load|On tap|On the line|On top|On top, {anchor}|One of the row's column widths.|Only fields you set override. Leave blank to fall through to the base settings.|Only this card|Opacity|Opacity percent|Open Conditions|Open Design|Open colour picker|Open it from any button: tap action Navigate to {path}, or Open pop-up.|Open pop-up|Open studio|Open when|Opens the Magic Card pop-up with this ID (navigates to {path}).|Opens when the entity changes to this state, e.g. a doorbell turning on.|Operator|Option {n}|Optional|Organic|Out to {parent}|Outline|Outside|Over content|Over the content, dimmed. Taps still reach the content.|Overridden|Overridden locally. Click to re-sync from the template.|Override appearance fields while conditions match. Rules apply in order; later rules win.|Override dashboard theme|Overwrite|Own entity|Own module list, not synced with the template|Own module list: not synced with the template. Reset column restores it.|Padding|Pagination|Panel|Panel, full width|Parts of the SVG with class=\"mc-accent\".|Parts of the icon drawn in Accent in the icon editor.|Paste design|Paste module|Paste module after|Paste the copied design|Pattern|Pause button|Pause preview motion|Paused off-screen and with reduced motion.|Pauses while the entity is off or unavailable.|Percent, 0 is no darkening.|Pick a colour from the screen|Pick a device|Pick a module|Pick an entity: Auto animates the icon from its state.|Pick an entity: a fill without a value stays empty.|Pick an entity: a value background without one draws nothing.|Pick an entity: a value label needs one.|Pick an entity: a value ring without one stays empty.|Pick an entity: this condition never plays without one.|Pick an entity: this condition never shows the ring without one.|Pick another random blob|Pick one|Pick the end module|Pick the start module|Pick the state icons (Icon when on / off) to morph between; unset sides use the module's icon.|Pick {kind}|Pick {name}|Picture|Picture elements|Picture entity|Picture glance|Pill|Pills|Placement|Placement: put behind others, put on top, back to normal|Plant monitor display|Plant status|Play|Play, pause, sound and full screen on the live stream.|Plays behind the other modules in the same column or layout. On its own in a column it shows at its own size.|Plays while the card is visible (not with reduced motion).|Points per hour|Pop-up|Pop-up ID|Position|Poster image URL|Prefix|Preset|Presets|Preview|Preview (Esc to return)|Preview date|Preview not updated: {error}|Preview pop-up|Preview the card with live actions|Preview: actions are live|Primary colour|Problem|Pulse|Put behind others|Put on top|Quarter|Quick overview of entities|Radial|Range {n}|Re-sync {overrides}|Redo|Redo (Ctrl+Y)|Refresh every (seconds)|Remaining|Remove colour|Remove colour {n}|Remove condition|Remove condition {n}|Remove option|Remove rule|Remove stop {num}|Remove {value}|Removing a column moves its modules into the column to its left.|Rename|Rendered Markdown text|Repeat|Repeat count|Replace design|Replace with {name}|Replace with…|Replaced {old} with {new}.|Replaced {old} with {new}. All modules are in the first tab.|Reset|Reset card to template…|Reset column to template…|Reset layout to template…|Reset row to template…|Reset section|Reset section Icon effects|Reset section {name}|Reset the whole card to the template? All your changes are lost.|Reset to animation|Reset to preset|Reset to template|Reset to template…|Reset {group} in {state}|Reset {name} to the template? Changes to all its modules are lost.|Reset {name} to the template? Your changes to it are lost.|Reset {state}|Resets Default values only.|Resize between Column {a} and Column {b}|Resize window|Restore size|Resume preview motion|Retry|Reverse|Reverse when negative|Right|Ring|Ring colour|Ring colour from this remaining % up; overrides Colour.|Ring colour from this value up; overrides Colour.|Ring mode|Round|Rounded|Route|Row name|Row {n}|Row {row} / Col {col}|Row {row} Column {column}|Row {row} column {column} actions|Rows hold columns, columns hold modules.|Rule|Rule name|Rule {n}|Rule: {name}|Rule: {name}, active tab|Rule: {name}, disabled tab|Runs when the row is tapped outside a module with its own action or control.|SVG markup|Same as Default|Same as Where in Look.|Same as {source}|Same on all sides|Save|Save as shape|Save current colour|Save to template|Saved as {name}. Find it under My shapes.|Saved colours|Saved icon \"{name}\" was not found. The card shows the default icon.|Scale width|Search CSS properties|Search CSS properties, e.g. padding|Search attributes|Search cards|Search entities|Search fonts|Search icons|Search modules|Search services|Search templates|Seasonal|Seasonal scene|Seasons|Secondary colour|Secondary info|Seconds for a dot to travel the line: Speed at Max, Min speed just above Min.|Seconds without interaction. Empty: stays open.|Section heading|Seed|Select|Select attribute|Select card|Select entity|Select font|Select icon|Select layer above|Select layer below|Select media|Select service|Select {label}|Selected {name}, {n, select, 1 {1st} 2 {2nd} 3 {3rd} other {{n}th}} from the front here|Sensor|Sensor with graph|Service|Service data|Services|Sets {attributes}; empty: {fallback}.|Settings|Shake|Shape|Shape applied.|Shape source|Share this card|Share with tiles inside|Shared with tiles inside|Sheet|Shopping list|Shopping list card|Short ({example})|Shortcut: {keys}|Show|Show all|Show area devices and entities|Show as pop-up|Show brightness|Show cards based on conditions|Show close button|Show code editor|Show colour picker|Show colour temp|Show condition|Show controls|Show date|Show effects|Show forecast|Show icon|Show in tree|Show labels|Show name|Show needle|Show on dashboard|Show or hide panels: {ctrl} or {cmd}.|Show points|Show precipitation|Show seconds|Show state|Show tab on dashboard|Show temperature|Show this card when…|Show this column when…|Show this module when…|Show this row when…|Show this rule when…|Show unit|Show value|Show visual editor|Show wind|Show {noun} ({keys})|Showing {shown} of {total}. Refine the search to see more.|Showing: {state}|Shown until the video plays, and instead of it when it cannot play.|Shown while the card has motion. Viewers can pause it.|Shows Auto on another day in this preview only. Not saved.|Shows an entity's state or name instead of the text.|Shows the entity's picture (person, image, camera, media player).|Shows the entity's state (or the attribute picked below) next to the label.|Shuffle|Side cut|Single entity display|Size|Slider colour|Slides per view|Slot {n}|Smoothing|Snake|Snapshot|Snapshot refresh (seconds)|Snow|Snow, rain, a storm, sun, clouds, fog or wind, from its state.|Solid|Solid|Some panels are hidden, as you left them. Use the arrows on the edges to show them.|South|South flips the seasons.|Space around|Space between|Space between slides (px)|Sparkline|Speed|Speed (s)|Spin|Spring|Squircle|Stack cards horizontally|Stack cards vertically|Stars and fireflies at night, a warm glow at dusk and dawn (sun.sun), nothing by day.|Start|Start: attach to|State|State (no attribute)|State colour|State icons|State icons: the icon while the entity is on or off. Empty: the module's icon.|State value|State, e.g. on (empty: any change)|Statistic|Statistics graph|Step|Stop {num} colour|Stop {num} of {n}|Straight|Strength (%)|Stretch|Structure|Style|Styles are removed; use fill attributes (for example fill=\"#f44336\") for colours.|Suffix|Summer|Swing|Switched to Solid. Undo brings the gradient back.|Synced with template|Synced with the template. Click to keep a local value that won't sync.|Tab|Tab name|Tab style|Tab {n}|Tabs|Tap|Tap the icon to turn the light on or off. Leave Icon empty to show the light's own icon.|Target|Target entity|Template|Template actions|Template animations|Template name|Template name is required.|Text|Text uses this gradient as its fill. Older tablets show the first colour.|That is not an entity id. It needs a dot, like light.kitchen. To switch the entity off, use No entity.|The SVG is larger than 32 KB.|The animated icons could not be loaded. Try again.|The arc takes the colour of the highest range at or below the value.|The area fades out upwards. The line stays faint ({pct}%) so text over it stays readable.|The attribute holds the image URL; it replaces the entity picture and the image URL.|The bar takes the colour of the highest range at or below the value; the bar colour applies below the first range.|The blob morphs slowly.|The card clips its edge: the ring sits inside it and its glow shows inward.|The colour along these stops follows the value: Liquid fill's entity, min and max, else the module's entity from 0 to 100.|The device this card is for. Tiles follow it unless you set one for them.|The empty part uses the colour {colour} (set in YAML); a value here replaces it.|The entity's state colour|The icon editor could not load. Check your connection and try again.|The icon editor could not load. Try again.|The icon uses this gradient as its fill. Older tablets show the first colour.|The library could not load. Check your connection and try again.|The library is full. Delete a shape first.|The modules inside this layout; the layout's modules differ from the template.|The modules inside this layout; they follow the template as one list.|The quick brown fox jumps over the lazy dog|The shape clips anything that pops out of the module, like dropdowns and tooltips.|The shape editor could not load. Check your connection and try again.|The shape replaces Border radius here.|The sharing tools did not load. Reload the page and try again.|The studio canvas shows a snapshot; the dashboard plays the stream (muted).|The thermostat keeps a range (low / high): pick target_temp_low or target_temp_high as the attribute to set one end.|The visual editor does not support this configuration: {error}|The waves flow along the edge.|The {key} key is set automatically from Card Type. Do not include it here.|The {noun} panel is hidden, as you left it. Use the arrow on the edge to show it.|Theme default|Thermostat|This card|This card is linked to template {name}. Do you want to update all linked cards with this structural change?|This card now has its own copy.|This card still uses placeholders instead of your entities. It will not show live values until you map them.|This card uses only its own custom_animations.|This entity has no daily forecast; its first forecast type is shown. The Forecast module offers more options.|This entity has no options a dropdown can set (use an input select, select, input text or text with custom options, climate, fan, light, media player, water heater or humidifier).|This entity has no {type} forecast; {fallback} is shown.|This is custom gradient CSS. Choose Gradient to replace it with the editor's version.|This light has no {what}; the control is hidden.|This line look is wide, so it attaches to the module box until you pick Icon or picture.|This module is part of its layout; the layout's modules differ from the template.|This module is part of its layout; they follow the template as one list.|This shape can not be saved.|This tile needs {kind}. The {source}'s device is {thing}, so the tile stays empty.|This tile shows no device.|This value can only be shown: the entity (or this attribute) cannot be set from a slider.|This value can only be shown: the entity (or this attribute) cannot be set from a spinbox.|Thresholds|Ticket|Ticket, Wave and Blob can not be edited yet. Use the preset as it is.|Tile|Tiles inside follow this entity unless they pick their own.|Tiles inside get no entity unless they pick one.|Tiles that follow the card will show it.|Time|Time format|Timer fill|Title|To|To side|To-Do List|To-do list card|Toggle|Toggles {entity} (the module entity).|Top|Top left|Top right|Track colour|Track opacity (%)|Try again|Turn off to pick a theme for this card only.|Twice daily|Type|URL|Underline|Undo|Undo (Ctrl+Z)|Unit|Unknown module type|Unlink from template|Untitled card|Up|Up to 168 (a week).|Up to 32 KB. Parts with fill=\"currentColor\" take the icon colour, parts with class=\"mc-accent\" the accent colour.|Up to twice the width at Max.|Update all linked cards|Update linked cards?|Upload SVG|Use|Use Default value|Use Jinja2 templates: {example}|Use MM-DD..MM-DD, like 12-01..12-26, or off.|Use No entity|Use a copy of {name}|Use a hex colour, rgb(a) or var(--name).|Use a ratio like 16:9, 4/3, 1.5 or 56.25%. 16:9 is used until then.|Use as copy|Use at most 80 characters.|Use dashboard theme|Use entity|Use entity colour|Use entity colour wins while the entity has a state colour; this colour applies otherwise.|Use entity icon|Use entity picture|Use follows the library: change a shape and every card that uses it changes. Use as copy makes this card independent.|Use letters, digits, - and _ only (no spaces).|Use module entity|Use own colour|Use template|Use the entity's state colour|Use {name}|Use {value}|Used until the stream player is available.|Using a copy of {name}.|Using {name}. Changes to it reach every card that uses it.|Valentine|Value|Value and route|Value background|Value background type|Values are averaged per period (2 = every 30 minutes). Empty draws every recorded change.|Vertical|Vertical alignment|Vertical stack|Video URL|View|View type {type} isn't supported|Viewers can't pause the motion on this card. Turn the button on if anything moves for more than 5 seconds.|Visibility|Wave|Wave edge|Wave height|Waves|Weather|Weather entity|Weather forecast|Weather forecast card|Which device is this card for?|While entity is on|While flowing|While state equals…|Wide|Wide, 800 pixels|Width|Width (px)|Winter|With no entity of its own, the row uses the card's.|With nothing else shown, the state is shown anyway.|Without a copy, the card plays nothing if Magic Card Utils or this animation is removed.|Without a copy, the card shows the default icon if Magic Card Utils or this icon is removed.|Without an ID it opens only from its triggers.|Wobble|Wrap in layout|YAML|YAML copied with your animations.|YAML copied.|YAML copied. Not embedded (not found): {ids}.|YAML. Leave empty to call the service without data.|YYYY year, MMMM / MMM month name, MM / M month, DD / D day, dddd / ddd weekday. Text in [brackets] is kept as is.|Your account can use the library but not change it. Ask an admin.|Your own|a camera|a device|a different kind of device|a javascript: link|a light|a list of options|a script|a sensor|a switch|a weather source|attribute|brightness|card|colour|colour temperature|colours|column|custom widths|effects|equals|event handlers|external references|fr shares the free space. Use Custom for auto (as wide as the content). % widths plus gap can overflow the row.|from {value}|hidden|inspector|layers|layout {layout}|light text on theme accent|none|not equals|preview|row|slides|tabs|the HVAC mode|theme accent|this card|this column|this module|this row|today|{angle} degrees|{count, plural, one {This SVG contains {list}. Remove it and try again.} other {This SVG contains {list}. Remove them and try again.}}|{from} to {to}|{id} (not found)|{id} (unknown)|{label} (no id)|{label} entity|{label} source|{label} unit|{label}: state|{list} and {last}|{max, plural, one {Up to # stop} other {Up to # stops}}|{min} to {max}|{mods, plural, one {# module} other {# modules}}|{module} pasted into {where}|{n, plural, one {# column, {ratio}} other {# columns, {ratio}}}|{n, plural, one {# column} other {# columns}}|{n, plural, one {# column} other {# columns}}, custom widths|{n, plural, one {# conditional rule} other {# conditional rules}}. Rules override Default only while their conditions match.|{n, plural, one {# conditional rule} other {# conditional rules}}. Same rules as the Conditions tab. Rules override Default only while their conditions match. A later rule wins over an earlier one.|{n, plural, one {# field differs} other {# fields differ}} locally.|{n, plural, one {# icon found} other {# icons found}}|{n, plural, one {# layer} other {# layers}}|{n, plural, one {# module} other {# modules}}|{n, plural, one {# override} other {# overrides}}|{n, plural, one {# row} other {# rows}}|{n, plural, one {# setting it does not support was} other {# settings it does not support were}} removed. Undo to get them back.|{n, plural, one {# tile follows it.} other {# tiles follow it.}}|{n, plural, one {# tile needs another device.} other {# tiles need another device.}}|{n, plural, one {Embed it to share this card with another Home Assistant.} other {Embed them to share this card with another Home Assistant.}}|{n, plural, one {Replaced {old} with {new}. The modules of the only tab are kept in tab order.} other {Replaced {old} with {new}. The modules of all # tabs are kept in tab order.}}|{n, plural, one {Uses # of your animations.} other {Uses # of your animations.}}|{n, plural, one {module} other {modules}}|{name} (not found)|{name} (not played on tabs)|{name} ({id})|{name} ({n} set)|{name} YAML|{name} YAML copied|{name} actions|{name} copied|{name} design copied|{name} gradient type|{name} mode|{name} opacity|{name} {slot}|{name}, Behind others|{name}, On top|{name}: colour from|{note}, or pick another. Escape cancels.|{note}, or pick another. {key} cancels.|{n} B|{n} changed|{n} cond.|{n} set|{panels} hidden|{panels} shown|{rows, plural, one {# row} other {# rows}} · {mods, plural, one {# module} other {# modules}}. Build visually with layers, canvas and the full inspector.|{size} KB|{state} reset|{title}. Press Ctrl+C (⌘C on a Mac) to copy.|{type} (not provided by this entity)",'||||||||||||||||||||||Accent color||||||||||||||Add color||||||||||||||||||||||||||||||||||||||||||||||||||||Animation color|||||||||||||||||||||||||||||||||||||Background color||||Bar color||||||||||||||||||||||||||||||||||||||||Card backdrop layers sit on top of this color and image.|||||||||||||Center|Change card fields, like background color, while conditions match. For ring, shape and more, use a design rule on the Design tab.||||||||||||||||||||||Color|Color format|Color from|Color picker|Color ranges|Color style|Color {n}|Colors the icon like Home Assistant does for this entity\'s state.||||||||||||||||||||||||||||||||||||||||||||||||||||Customize a copy|Customize this icon||||||||||||Default sets a solid color, so a rule cannot swap it for a gradient. Clear the Default color first.||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||Effects need the icon shape; this icon could not be loaded (or is a multi-color logo), so it is shown as is.|||||||||||Empty: the primary color at {pct}%.|||||||Entity color|Entity color for {name}||||||||||||||||||||||Fill color||||||||||||||||||||||||||||||||||||||||||||||Gradient colors|Gradient created from your color.|||||||||||||||||||||||||||||||||||||||Icon color||||||||||||Idle color||||||||||||||||||||||||||||||||||||||||||Line color|||||||||||||||||||||||||||||||||||||||||||||||||||||||Maximize||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||Open color picker||||||||||||||||||||||||||||||||||||||||Pick a color from the screen||||||||||||||||||||||||||||||||||||||||||||||Primary color||||||||||||||Remove color|Remove color {n}||||||||||||||||||||||||||||||||||||||||||||Ring color|Ring color from this remaining % up; overrides Color.|Ring color from this value up; overrides Color.|||||||||||||||||||||||||Save current color|||Saved colors||||||||||||||||Secondary color|||||||||||||||||||||||||||||||||||||||||||||Show color picker|Show color temp|||||||||||||||||||||||||||||||||||||||||Slider color||||||||||||||||||||||||||||||State color||||||||Stop {num} color|||||||Styles are removed; use fill attributes (for example fill="#f44336") for colors.||||||||||||||||||||||Text uses this gradient as its fill. Older tablets show the first color.||||The arc takes the color of the highest range at or below the value.|||The bar takes the color of the highest range at or below the value; the bar color applies below the first range.|||The color along these stops follows the value: Liquid fill\'s entity, min and max, else the module\'s entity from 0 to 100.||The empty part uses the color {colour} (set in YAML); a value here replaces it.|The entity\'s state color|||The icon uses this gradient as its fill. Older tablets show the first color.||||||||||||||||||||||||||||||||||||||||||||||||||||||||Track color||||||||||||||||Up to 32 KB. Parts with fill="currentColor" take the icon color, parts with class="mc-accent" the accent color.|||||||||||Use a hex color, rgb(a) or var(--name).||||||Use entity color|Use entity color wins while the entity has a state color; this color applies otherwise.||||||Use own color||Use the entity\'s state color|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||color|color temperature|colors|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||{name}: color from|||||||||||||','"{value}" is geen van de opties van de entiteit.|**Vet**, _cursief_, `code`|+ {n, plural, one {# ontwerpveld} other {# ontwerpvelden}}|, getoond op {px} px|0 stippen: in plaats daarvan bewegende streepjes.|0 is rond, 1 is het meest onregelmatig.|1 kolom|1 is ronder, 0 is vierkanter.|12-uurs|24-uurs||<use> en <image> worden niet ondersteund. Teken de vormen als paden en probeer het opnieuw.|Een achtergrondafbeelding vervangt hier een kleurverloop. Verwijder de afbeelding om een kleurverloop te gebruiken.|Een gebogen lijn in plaats van rechte stukken.|Een kleurverloop heeft minstens 2 kleurpunten nodig|Een negatieve waarde laat de stippen van het einde naar het begin lopen.|Een voorinstelling die in deze kaart is opgeslagen.|Een rij heeft minstens één kolom nodig|Een rij, kolom of indeling om deze tegel heeft Geen entiteit, dus er valt niets te volgen.|Een tabbladmodule heeft minstens één tabblad nodig|Er bestaat al een sjabloon met de naam "{name}".|Er bestaat al een sjabloon met de naam "{name}". Overschrijven?|Accentkleur|Actie|Actieknop voor een entiteit|Acties|Actief tabblad|Toevoegen|Voeg een voorwaarde toe om deze kaart alleen te tonen wanneer dat nodig is.|Voeg een voorwaarde toe om deze kolom alleen te tonen wanneer dat nodig is.|Voeg een voorwaarde toe om deze module alleen te tonen wanneer dat nodig is.|Voeg een voorwaarde toe om deze rij alleen te tonen wanneer dat nodig is.|Voeg een voorwaarde toe om deze regel alleen te gebruiken wanneer dat nodig is.|Voeg een regel toe om het uiterlijk te wijzigen wanneer aan voorwaarden wordt voldaan.|Animatie toevoegen|Uiterlijkregel toevoegen|Kleur toevoegen|Kolom toevoegen|Kolom toevoegen aan rij {row}|Kolom toevoegen aan {name}|Voorwaarde toevoegen|Voorwaardelijke regel toevoegen|Stroom toevoegen|Stroom vanaf hier toevoegen|Stroom vanaf hier toevoegen. {hint}|Module toevoegen|Module toevoegen aan rij {row}, kolom {column}|Module toevoegen aan {where}|Optie toevoegen|Bereik toevoegen|Rij toevoegen|Kleurpunt toevoegen|Tabblad toevoegen|Tabblad toevoegen aan {name}|Module {name} toevoegen|Voeg tabbladen toe, hernoem en orden ze, en voeg hun modules toe in de structuurboom.|Geavanceerd|Na|Ga na de laatste dia terug naar de eerste|Alarmbedieningspaneel|Alarmpaneel|Uitlijnen|Alle|Alles komt overeen (EN)|Afwisselend|Afwisselend omgekeerd|Altijd|Altijd getoond, ook als er niets beweegt.|Altijd zichtbaar||Een geanimeerd pictogram dat in deze kaart is opgeslagen.|Een geanimeerde golf op het oppervlak. Stil bij verminderde beweging.|Een attribuutgrafiek laadt elke opgeslagen status met al zijn attributen; lange perioden kunnen traag laden.|Een input_boolean of schakelaar: uit verbergt de scène, op elke kaart die hem gebruikt.|Een geopende pop-up behoudt een rechthoekig oppervlak.|Een optioneel label om deze kaart in de editor te herkennen.|Hoek|Hoek (gr.)|Hoek in graden|Animeren|Geanimeerd|Geanimeerde pictogrammen|Geanimeerde lijnen tussen twee modules, bijvoorbeeld van zonnepanelen naar huis. Snelheid, dikte en richting kunnen de waarde van een entiteit volgen.|Geanimeerde weerpictogrammen in plaats van statische|Geanimeerde weerpictogrammen vervangen pictogrameffecten.|Geanimeerde weerpictogrammen vervangen pictogrameffecten. Je pictogrameffecten staan stil en komen terug zodra Geanimeerde pictogrammen uit staat.|Animeert het pictogram zoals het apparaat dat het toont.|Animatie|Animatiekleur|Animatie {n}|Animaties|Eén komt overeen (OF)|Uiterlijk overschrijven|Toegepast op het actieve tabblad, bovenop Standaard en overeenkomende regels. Alleen deze instellingen gelden voor dit tabblad.|Toegepast op de inhoud van de kaart, bijv. letter-spacing: 0.5px|Toegepast op de uitgeschakelde tabbladen, bovenop Standaard en overeenkomende regels. Alleen deze instellingen gelden voor die tabbladen.|Alleen toegepast op {thing}|Toegepast zolang de aanwijzer boven deze kaart staat, bovenop Standaard en overeenkomende regels.|Toegepast zolang de aanwijzer boven {thing} staat, bovenop Standaard en overeenkomende regels.|Gebied|Dekking van het gebied|Ordenen|Beeldverhouding||Koppelen aan|Attribuut|Attributen|Attributen van {id} ({source})|||Automatisch sluiten|Auto voor deze entiteit: {rule}.|Auto heeft geen animatie voor deze entiteit; kies er een.|Auto toont een feestdag tussen deze datums (inclusief), anders het seizoen. Een bereik mag over de jaarwisseling lopen. Typ off om een feestdag over te slaan.|Automatisch|Automatisch ({format}, uit je profiel)|Automatisch: Palmzondag tot Tweede Paasdag, voor elk jaar berekend.|Automatisch afspelen|Vertraging automatisch afspelen (ms)|Herfst|Terug|Terug naar dialoogvenster|Terug naar normaal|Achtergrondvervaging|Dekking van de achtergrond|Achtergrondkleur|Achtergrondafbeelding|Achtergronden veranderen niet bij aanwijzen.|Achtergrond van de balk|Kleur van de balk|Hoogte van de balk|Balkinstellingen gelden voor elk tabblad en staan onder Standaard.|Balkinstellingen gelden voor elk tabblad en staan in de regel.|Voor|Achter de inhoud|Achter andere modules|Onder 1 vervaagt de hele kaart, tekst inbegrepen, en dat verlaagt het contrast.|Naast de lijn||Vervaagt wat achter de kaart zit. Het is alleen te zien door een doorzichtige achtergrond, bijvoorbeeld rgba(0, 0, 0, 0.3).|Randdecoraties|Randafronding|Onder|Linksonder|Rechtsonder|Slagschaduw|De slagschaduw volgt de vorm als valschaduw (alleen de eerste schaduw).|Bladeren|Entiteiten bekijken|Pictogrammen bekijken|Media bekijken|Services bekijken|Browsers spelen alleen video\'s zonder geluid automatisch af.|Ingebouwd|Ingebouwde kaarten|Ingebouwd: {value}|Knop|Knopstijl|Agenda|Agendaweergave|Service aanroepen|Camera-entiteit|Annuleren|Canvasbreedte|Canvas, live voorbeeld|Canvas, {label} geselecteerd|Uiteinden|Kaart|Achtergrond van de kaart|De achtergrondlagen van de kaart liggen bovenop deze kleur en afbeelding.|Achtergrond van de kaart, laag {n}|Kaartconfiguratie|Kaartentiteit|Kaarthoogte|Kaartmodules volgen de entiteit van de kaart niet.|Kaartnaam|Kaartinstellingen|Kaartinstellingen > Algemeen|Kaartstructuur|Kaartthema|Kaarttype|Kaarten|Midden|Wijzig kaartvelden, zoals de achtergrondkleur, zolang aan voorwaarden wordt voldaan. Voor ring, vorm en meer gebruik je een ontwerpregel op het tabblad Ontwerp.|Gewijzigd op deze kaart|Jagende stippen|Kerst|Cirkel|Wissen|Alle pictogrameffecten wissen|Alle waarden in deze sectie wissen|Zoekopdracht wissen|Klik op een module om die te selecteren. {move} verplaatst de module, {remove} verwijdert de module, {menu} opent het menu.|Klik op de module waarmee je wilt verbinden. Escape annuleert.|Klik op de module waarmee je wilt verbinden. {key} annuleert.|Klimaatbedieningskaart|Met de klok mee|Sluiten|Pop-up sluiten|Sluiten wanneer|Sluit de geopende Magic Card-pop-up (ook vanuit de pop-up zelf).|Sluit wanneer de entiteit naar deze status verandert.|Stroom {n} inklappen|Rij {n} inklappen|Regel inklappen|Kleur|Kleurnotatie|Kleur van|Kleurkiezer|Kleurbereiken|Kleurstijl|Kleur {n}|Kleurt het pictogram zoals Home Assistant dat doet voor de status van deze entiteit.|Kolom|Kolomindeling|Kolomnaam|Kolombreedtes|Kolom {a} {wa}, kolom {b} {wb}|Kolom {n}|Breedte van kolom {n}|Combineren met|Compacte modus|Compacte tegelkaart|Overeenkomst van voorwaarden|Type voorwaarde|Voorwaarde {n}|Voorwaardelijk|Voorwaardelijk uiterlijk|Voorwaarden|Verbinding|Passend|Inhoud|Bediening|YAML kopiëren|Kopieer eerst een ontwerp|Kopieer eerst een module|Kopiëren en plakken|Ontwerp kopiëren|Kopiëren mislukt: selecteer het pad en kopieer het|Module kopiëren|Navigatiepad kopiëren|Kopieer deze YAML|Kopiëren mislukt: de browser heeft het klembord geblokkeerd.|Hoek|Hoekgrootte|Het sjabloon kon niet worden geladen, dus de kolom is niet teruggezet.|Magic Card Utils is niet bereikbaar. Probeer het opnieuw.|De lijnstijlen konden niet worden geladen.|De sliderstijlen konden niet worden geladen.|Kan het weergavetype niet bepalen|Tegen de klok in|Vullend|Sjabloon maken|Sjabloon maken van deze kaart||Aangepast|Aangepaste CSS|Eigen SVG|Eigen kaart|Eigen kaarten (HACS)|Eigen opties|Eigen patroon|Eigen vorm|Aangepaste breedtes|Een kopie aanpassen|Dit pictogram aanpassen|Afgesneden hoeken|Snijgrootte|Grootte van de uitsparing|Dagelijks|Standaard van het dashboard|Gestreept|Datumnotatie|Datumpatroon|Dag en nacht|Decimalen|Standaard|Standaard stelt een effen kleur in, dus een regel kan die niet door een kleurverloop vervangen. Wis eerst de standaardkleur.|Standaardtabblad|Verwijderen|Vertraging|Verwijderen|Verwijderen (Del)|Animatie verwijderen|Animatie {n} verwijderen|Kolom verwijderen|Kolom "{name}" en de {n, plural, one {# module} other {# modules}} erin verwijderen?|Stroom verwijderen|Stroom {n} verwijderen|Bereik verwijderen|Bereik {n} verwijderen|Rij verwijderen|Regel verwijderen|Tabblad verwijderen|Tabblad "{name}" en de {n, plural, one {# module} other {# modules}} erin verwijderen?|Sjabloon verwijderen|Sjabloon {name} verwijderen|Dichtheid (%)|Beschrijving (optioneel)|Ontwerp|Ontwerp gekopieerd|Ontwerp geplakt|Apparaatanimatie|Dialoogvenster|Bedoelde je Geen entiteit?|Richting|Uitgeschakeld tabblad|Weergave|Een afbeelding tonen|Weergavevoorwaarden|Klaar|Stipgrootte (px)|Stippen|Gestippeld|Dubbeltikken|Omlaag|Sleep om het formaat te wijzigen, dubbelklik voor gelijke breedtes|Een pictogram tekenen|Tekenduur|Teken je eigen SVG-pictogram in plaats van er een uit de pictogramlijst te kiezen.|Langs de rand getekend; de inhoud blijft ervan vrij.|Trommel||Dupliceren|Dupliceren (Ctrl+D)|Rij dupliceren|Duur|Versnelling|Pasen|Paasdata automatisch|Rand|Bewerken|Bewerken als eigen vorm|Kaartinstellingen bewerken|Pictogram bewerken|Vorm bewerken|Sjabloon bewerken|Sjabloon {name} bewerken|Ontwerp bewerken voor|Editormodus|Effecten|Effecten hebben de vorm van het pictogram nodig; dit pictogram kon niet worden geladen (of is een logo in meerdere kleuren), dus het wordt ongewijzigd getoond.|Verstreken|Haaks|Een webpagina insluiten|Mijn animaties insluiten|Lege kolom|Dekking van het lege deel (%)|Leeg gebruikt de entiteit van de module ({entity}).|Leeg: het eigen bereik en de eigen stap van de entiteit. Min en max kunnen dat bereik alleen verkleinen.|Leeg: het eigen bereik en de eigen stap van de entiteit. Min en max kunnen dat bereik alleen verkleinen; een stap die geen veelvoud is van de stap van de entiteit wordt vervangen door die van de entiteit.|Leeg: de entiteit van de module ({entity}).|Leeg: de primaire kleur op {pct}%.|Einde|Einde: koppelen aan|Eindigt bij {value} (ingesteld in YAML).|Entiteiten|Entiteit|Entiteit (voor sjablonen)|Entiteitskleur|Entiteitskleur voor {name}|De entiteit past niet bij deze module|Entiteitenfilter|Entiteit voor afspeelvoorwaarde|Entiteit voor weergavevoorwaarde|Entiteit voor statussen en waarden|Geschiedenisgrafiek van een entiteit|Logboekregels van een entiteit|Bron van de entiteit|Entiteit met achtergrondafbeelding|Gelijke breedtes||Is gelijk aan|Elke wijziging|Stroom {n} uitklappen|Rij {n} uitklappen|Regel uitklappen|Extra scènes die erbovenop worden gelegd, zoals Dag en nacht tijdens de winter.|Sjabloon verwijderen mislukt.|Sjabloon opslaan mislukt.|Vullen|Uitrekken|Vulkleur|Vulrichting|Dekking van de vulling|Vul het gebied onder de lijn.|Vulovergang|Vult het pictogram als een vloeistof met een waarde, bijvoorbeeld een batterijniveau.|Items filteren|Gefilterde entiteitenlijst|Aanpassing|Vlam|Plat|Stroom {n}|Stromen|Volgt het licht|Volgt een weerentiteit: die van de module, of de entiteit die bij Entiteit voor afspeelvoorwaarde is gekozen.|Lettertypefamilie|Lettertypebron|Lettertypen|Voorspellingsdagen|Type voorspelling|Formulier|Van|Vanaf zijde|Uit sjabloon|Van {source}: {name}|Voor|Vol|Vol (cirkel)|Volledig gesynchroniseerd.|Tussenruimte|Tussenruimte tussen kolommen|Meter|Meterstijl|Meterweergave|Algemeen|Geef het een naam.|Geef deze module een id in het sjabloon|Overzicht|Gloed|Gloed (px)|Naar Standaard|Naar de regel|||Begrepen|Kleurverloop|Kleuren van het verloop|Kleurverloop gemaakt van je kleur.|Een kleurverloop vraagt om een leeg veld Achtergrond. Wis dat om hier een kleurverloop te gebruiken.|Voorbeeld van het kleurverloop|Kleurverloop vervangen door de versie van de editor.|Raster|Rasterindeling van kaarten|Half (halve cirkel)||Heeft lokale afwijkingen|Kop|Hallo wereld|Halfrond|Zeshoek|Verborgen|Verborgen op dashboard|Verborgen op het dashboard; opent erboven via de #ID, een trigger of een actie Pop-up openen.|Verbergen|Verbergen op dashboard|Tabblad verbergen op dashboard|Verberg {noun} ({keys})|Geschiedenisgrafiek|Geschiedenis die niet geladen kan worden, tekent niets.|Vasthouden|Data van feestdagen|Feestdagen|Verbinding met Home Assistant niet beschikbaar.|Horizontaal|Horizontale stapel|Elk uur|Uren|Uren om te tonen||Hoeveel deeltjes: 100% is 24, het maximum dat een scène tekent.|Tint|Luchtbevochtiger|Bediening luchtbevochtiger||Pictogram|Pictogram toegepast.|Pictogramkleur|Pictogrameffecten|Alleen pictogram|Pictogram of afbeelding|Pictogram of afbeelding laat de lijn eindigen bij het pictogram, de afbeelding of de meter van de module. Modulevak laat de lijn eindigen aan de rand van de module.|Pictogrambron|Pictogram als actief|Het pictogram voor actief stel je per tabblad in via de structuurboom.|Pictogram als uit|Pictogram als aan|Pictogrammen|Pictogrammen uit|Kleur bij inactiviteit|Afbeelding|Afbeeldings-URL|Afbeelding uit attribuut|Afbeelding met entiteitspictogrammen|Afbeelding met interactieve elementen|Importeer een gedeelde kaart|In px, of % van de kortste zijde.|Gesynchroniseerd|Oneindig|Overnemen ({value})|Overgenomen entiteit|Overgenomen van Standaard: {value}|Binnen|Inspectorpaneel|Intensiteit|In {container}|Ongeldige YAML - de kaart gebruikt de laatste geldige configuratie|Verdelen|Bewaar een kopie in deze kaart (voegt {size} toe)|Bewaar een kopie in deze kaart ({size})|Bewaar je eigen pictogrammen: installeer de gratis Magic Card Utils-add-on.|Bewaar je eigen vormen voor elk dashboard met de gratis Magic Card Utils-add-on. Tot die tijd wordt deze vorm alleen in deze kaart opgeslagen.||Positie van het label|Labelsjabloon|Laatst gewijzigd|Laag|De laaginstellingen konden niet worden geladen. Laad de pagina opnieuw.|Lagen|Lagen hier ({n})|Lagenpaneel|Indeling|Indeling {layout}|Laat leeg om het pictogram van het tabblad te behouden.|Laat leeg om de eigen opties van de entiteit aan te bieden. Eigen opties hernoemen of kiezen daaruit; een waarde die de entiteit niet aanbiedt wordt uitgeschakeld getoond.|Links|Lengte (%)|Bibliotheek|Lamp|Lampbedieningskaart|Lichtjes, ijspegels, rijp, een spinnenweb, een pompoen of een bloemenranken langs de rand, voor de scènes die ze hebben. De inhoud blijft ervan vrij.|Lijnkleur|Lijn tekenen|Lijndikte|Lijndikte (px)|Lineair|Gekoppeld aan sjabloon {name}.|Gekoppeld aan de opgeslagen vorm {name}. Wijzig hem daar en elke kaart die hem gebruikt verandert mee.|Vloeistofvulling|Lijst met entiteitsrijen||Live gegevens|Laden|"{name}" laden? Dit vervangt je huidige configuratie.|Sjabloon laden|Sjabloon laden…|Laden|Mijn animaties laden…|Editor laden|Editor laden...|Pictogrammen laden…|Laaginstellingen laden…|Lijnstijlen laden...|Sliderstijlen laden...|Sjablonen laden...|Laden...|Laden…|Lokaal|Lokale lettertypen|Logboek|Lang ({example})|Langetermijnstatistiek|Uiterlijk|Herhalen|Magic Card Utils-sjablonen bevatten deze nooit. Een sjabloon toepassen laat de entiteit van deze kaart staan.|Magic Card-integratie niet gevonden. Installeer die via HACS en voeg de integratie toe.|Magic Card-studio|Een eigen vorm maken|Maakt je eigen kopie. Het origineel blijft in {pack}.|Kaart|Entiteiten koppelen|Kaart met entiteitslocaties|Marcherende mieren||Markdown met Home Assistant-sjablonen, bijvoorbeeld {example}. Met een ingestelde entiteit toont {entity} de status ervan.|Overeenkomst|Weergave volgen|Komt overeen met deze weergave (masonry)|Komt overeen met deze weergave (paneel)|Komt overeen met deze weergave (secties)|Komt overeen met deze weergave (secties, {columns} van 12 kolommen)|Komt overeen met deze weergave (zijbalk)||Material Design-pictogrammen||Maximale hoogte|Maximaliseren||Media-URL of pad|Mediabediening|Mediamappen|Mediaspelerbediening|Gemiddeld ({example})|In ontwerp samenvoegen|Geplakt ontwerp samenvoegen||Min. snelheid (s)|Min, Max en Attribuut gelden niet voor een timer; drempels gebruiken het resterende %.|Modus||Module-acties|Modulevak|Modulecategorie|Entiteit van de module ({entity})|Modulenaam|Module niet gevonden|Module niet gevonden ({id})|Module-opties voor {name}||Modules met (geen id) komen uit het sjabloon. {hint} om te verbinden.|Meer info|Overvloeien|Vloeit over tussen de statuspictogrammen wanneer de entiteit aan of uit gaat.|Beweging|Omlaag|Omlaag (Alt+Down)|Verplaatsen naar…|Omhoog|Omhoog (Alt+Up)|Venster verplaatsen|{name} verplaatst naar {where}|Geluid uit|Mijn animaties|Mijn pictogrammen|Mijn pictogrammen ({n})|Mijn vormen|Mijn vormen ({n})|Naam|Naam en status|Naam, huidige waarde en tijdsbereik onder de grafiek.|Smal|Smal, 400 pixels|Navigeren|Navigatie|Navigeren staat uit in het voorbeeld|Navigatiepad|Navigatiepad gekopieerd|Heeft {kind} nodig|Nieuwjaar|Geen CSS-eigenschap komt overeen met "{query}".|Geen uiterlijkregels|Geen attributen gevonden|Geen kaarten gevonden|Nog geen voorwaarden. De regel geldt zodra er een voorwaarde is toegevoegd die overeenkomt.|Geen configuratie beschikbaar om op te slaan.|Geen entiteiten gevonden|Geen entiteit|Geen entiteit.|Geen entiteit: de lijn stroomt altijd met zijn snelheid.|Geen lettertypen gevonden|Geen koptekst|Geen pictogrammen gevonden|Geen pictogrammen gevonden. Typ een volledige id, zoals mdi:fan.|Geen items gevonden|Geen mediabronnen beschikbaar|Geen modules in deze categorie.|Geen modules gevonden voor "{query}".|Geen andere kolom om naartoe te verplaatsen|Er is geen ander moduletype om mee te vervangen|Er is nog geen voorbeeld van deze kaart om te openen|Nog geen rijen|Nog geen opgeslagen pictogrammen. Teken een pictogram en kies in de editor Opslaan in bibliotheek.|Nog geen opgeslagen vormen. Maak een eigen vorm en kies Opslaan als vorm.|Geen services gevonden|Geen instellingen voor deze module.|Er is nog geen tabblad uitgeschakeld. Vink tabbladen aan onder Balk > Uitgeschakelde tabbladen in Standaard.|Geen sjabloon|Geen sjablonen opgeslagen|Geen visuele editor beschikbaar voor dit kaarttype. Configureer met YAML:|Geen|Normaal|Noord|Is niet gelijk aan|Niet gevonden in Mijn animaties. De kaart speelt de ingesloten kopie af als die er is.|Niet gevonden. Mijn animaties heeft de Magic Card Utils-integratie nodig; de kaart speelt de ingesloten kopie af als die er is.|Niet gekoppeld aan een sjabloon|Niet ingesteld|Niet ingesteld in deze regel: Standaard geldt.|Inkeping|Nog niets gekozen. Om het apparaat van de kaart te gebruiken, stel je het in bij {link}.|Niets wijkt af van het sjabloon|Niets ingesteld. Deze status ziet er hetzelfde uit als Standaard.|Gebruikt nu {name} van de {source}.|Gebruikt nu {name}.|Nu: {device}.|Getal|Aantal voorspellingen|Numeriek ({example})|Achthoek|Uit|Uitschakelaar|Bij wijziging|Bij laden|Bij tikken|Op de lijn|Bovenop|Bovenop, {anchor}|Een van de kolombreedtes van de rij.|Alleen velden die je instelt overschrijven. Laat leeg om terug te vallen op de basisinstellingen.|Alleen deze kaart|Dekking|Dekkingspercentage|Voorwaarden openen|Ontwerp openen|Kleurkiezer openen|Open hem vanaf elke knop: tikactie Navigeren naar {path}, of Pop-up openen.|Pop-up openen|Studio openen|Openen wanneer|Opent de Magic Card-pop-up met deze ID (navigeert naar {path}).|Opent wanneer de entiteit naar deze status verandert, bijvoorbeeld een deurbel die aan gaat.||Optie {n}|Optioneel|Organisch|Uit naar {parent}|Omlijnd|Buiten|Over de inhoud|Over de inhoud heen, gedimd. Tikken bereiken de inhoud nog steeds.|Overschreven|Lokaal overschreven. Klik om opnieuw te synchroniseren met het sjabloon.|Overschrijf uiterlijkvelden zolang aan voorwaarden wordt voldaan. Regels gelden op volgorde; latere regels winnen.|Dashboardthema overschrijven|Overschrijven|Eigen entiteit|Eigen modulelijst, niet gesynchroniseerd met het sjabloon|Eigen modulelijst: niet gesynchroniseerd met het sjabloon. Kolom terugzetten herstelt dit.|Opvulling|Paginering|Paneel|Paneel, volledige breedte|Delen van de SVG met class="mc-accent".|Delen van het pictogram die in de pictogrameditor op Accent staan.|Ontwerp plakken|Module plakken|Module hierna plakken|Plak het gekopieerde ontwerp|Patroon|Pauzeknop|Beweging in voorbeeld pauzeren|Gepauzeerd buiten beeld en bij verminderde beweging.|Pauzeert zolang de entiteit uit of niet beschikbaar is.|Procent, 0 is geen verduistering.|Kies een kleur van het scherm|Kies een apparaat|Kies een module|Kies een entiteit: Auto animeert het pictogram op basis van de status.|Kies een entiteit: een vulling zonder waarde blijft leeg.|Kies een entiteit: een waarde-achtergrond zonder entiteit tekent niets.|Kies een entiteit: een waardelabel heeft er een nodig.|Kies een entiteit: een waardering zonder entiteit blijft leeg.|Kies een entiteit: deze voorwaarde speelt nooit af zonder entiteit.|Kies een entiteit: deze voorwaarde toont de ring nooit zonder entiteit.|Kies een andere willekeurige blob|Kies er een|Kies de eindmodule|Kies de startmodule|Kies de statuspictogrammen (Pictogram als aan / uit) om tussen over te vloeien; niet ingestelde kanten gebruiken het pictogram van de module.|Kies {kind}|Kies {name}|Afbeelding|Afbeeldingselementen|Afbeeldingsentiteit|Afbeeldingsoverzicht|Pil|Pillen|Plaatsing|Plaatsing: achter andere modules zetten, bovenop zetten, terug naar normaal|Plantmonitorweergave|Plantstatus|Afspelen|Afspelen, pauzeren, geluid en volledig scherm voor de livestream.|Speelt achter de andere modules in dezelfde kolom of indeling. Alleen in een kolom wordt het op zijn eigen grootte getoond.|Speelt af terwijl de kaart zichtbaar is (niet bij verminderde beweging).|Punten per uur||Pop-up-ID|Positie|URL van de posterafbeelding|Voorvoegsel|Voorinstelling|Voorinstellingen|Voorbeeld|Voorbeeld (Esc om terug te gaan)|Voorbeelddatum|Voorbeeld niet bijgewerkt: {error}|Pop-up bekijken|De kaart bekijken met live acties|Voorbeeld: acties zijn live|Primaire kleur|Probleem|Puls|Achter andere modules zetten|Bovenop zetten|Kwart|Snel overzicht van entiteiten|Radiaal|Bereik {n}|{overrides} opnieuw synchroniseren|Opnieuw|Opnieuw (Ctrl+Y)|Vernieuwen elke (seconden)|Resterend|Kleur verwijderen|Kleur {n} verwijderen|Voorwaarde verwijderen|Voorwaarde {n} verwijderen|Optie verwijderen|Regel verwijderen|Kleurpunt {num} verwijderen|{value} verwijderen|Als je een kolom verwijdert, gaan de modules naar de kolom links ervan.|Hernoemen|Gerenderde Markdown-tekst|Herhalen|Aantal herhalingen|Ontwerp vervangen|Vervangen door {name}|Vervangen door…|{old} vervangen door {new}.|{old} vervangen door {new}. Alle modules staan in het eerste tabblad.|Terugzetten|Kaart terugzetten naar sjabloon…|Kolom terugzetten naar sjabloon…|Indeling terugzetten naar sjabloon…|Rij terugzetten naar sjabloon…|Sectie terugzetten|Sectie Pictogrameffecten terugzetten|Sectie {name} terugzetten|De hele kaart terugzetten naar het sjabloon? Al je wijzigingen gaan verloren.|Terugzetten naar animatie|Terugzetten naar voorinstelling|Terugzetten naar sjabloon|Terugzetten naar sjabloon…|{group} terugzetten in {state}|{name} terugzetten naar het sjabloon? Wijzigingen aan alle modules gaan verloren.|{name} terugzetten naar het sjabloon? Je wijzigingen eraan gaan verloren.|{state} terugzetten|Zet alleen de waarden van Standaard terug.|Formaat wijzigen tussen kolom {a} en kolom {b}|Venstergrootte wijzigen|Oorspronkelijke grootte|Beweging in voorbeeld hervatten|Opnieuw proberen|Omgekeerd|Omkeren bij negatieve waarde|Rechts||Ringkleur|Ringkleur vanaf dit resterende % omhoog; overschrijft Kleur.|Ringkleur vanaf deze waarde omhoog; overschrijft Kleur.|Ringmodus|Rond|Afgerond||Rijnaam|Rij {n}|Rij {row} / Kol. {col}|Rij {row}, kolom {column}|Acties voor rij {row}, kolom {column}|Rijen bevatten kolommen, kolommen bevatten modules.|Regel|Naam van de regel|Regel {n}|Regel: {name}|Regel: {name}, actief tabblad|Regel: {name}, uitgeschakeld tabblad|Wordt uitgevoerd wanneer op de rij wordt getikt buiten een module met een eigen actie of bediening.|SVG-opmaak|Zoals Standaard|Hetzelfde als Waar bij Uiterlijk.|Zelfde als {source}|Aan alle kanten gelijk|Opslaan|Opslaan als vorm|Huidige kleur opslaan|Opslaan in sjabloon|Opgeslagen als {name}. Je vindt hem onder Mijn vormen.|Opgeslagen kleuren|Opgeslagen pictogram "{name}" is niet gevonden. De kaart toont het standaardpictogram.|Dikte schalen|CSS-eigenschappen zoeken|CSS-eigenschappen zoeken, bijv. padding|Attributen zoeken|Kaarten zoeken|Entiteiten zoeken|Lettertypen zoeken|Pictogrammen zoeken|Modules zoeken|Services zoeken|Sjablonen zoeken|Seizoen|Seizoensscène|Seizoenen|Secundaire kleur|Secundaire info|Seconden die een stip nodig heeft voor de lijn: Snelheid bij Max, Min. snelheid net boven Min.|Seconden zonder interactie. Leeg: blijft open.|Sectiekop|Startwaarde|Kiezen|Attribuut kiezen|Kaart kiezen|Entiteit kiezen|Lettertype kiezen|Pictogram kiezen|Laag erboven selecteren|Laag eronder selecteren|Media kiezen|Service kiezen|{label} selecteren|{name} geselecteerd, {n, select, 1 {1e} 2 {2e} 3 {3e} other {{n}e}} van voren hier||Sensor met grafiek||Servicegegevens||Stelt {attributes} in; leeg: {fallback}.|Instellingen|Schudden|Vorm|Vorm toegepast.|Vormbron|Deel deze kaart|Delen met tegels erin|Gedeeld met tegels erin|Paneel|Boodschappenlijst|Boodschappenlijstkaart|Kort ({example})|Sneltoets: {keys}|Tonen|Alles tonen|Apparaten en entiteiten van een gebied tonen|Tonen als pop-up|Helderheid tonen|Kaarten tonen op basis van voorwaarden|Sluitknop tonen|Code-editor tonen|Kleurkiezer tonen|Kleurtemperatuur tonen|Weertype tonen|Bediening tonen|Datum tonen|Effecten tonen|Voorspelling tonen|Pictogram tonen|Tonen in de boom|Labels tonen|Naam tonen|Naald tonen|Tonen op dashboard|Panelen tonen of verbergen: {ctrl} of {cmd}.|Punten tonen|Neerslag tonen|Seconden tonen|Status tonen|Tabblad tonen op dashboard|Temperatuur tonen|Toon deze kaart wanneer…|Toon deze kolom wanneer…|Toon deze module wanneer…|Toon deze rij wanneer…|Gebruik deze regel wanneer…|Eenheid tonen|Waarde tonen|Visuele editor tonen|Wind tonen|Toon {noun} ({keys})|{shown} van {total} getoond. Verfijn de zoekopdracht om meer te zien.|Weergave: {state}|Getoond totdat de video afspeelt, en in plaats daarvan als die niet kan afspelen.|Getoond terwijl de kaart beweegt. Bezoekers kunnen die pauzeren.|Toont Auto alleen in dit voorbeeld op een andere dag. Niet opgeslagen.|Toont de status of naam van een entiteit in plaats van de tekst.|Toont de afbeelding van de entiteit (persoon, afbeelding, camera, mediaspeler).|Toont de status van de entiteit (of het hieronder gekozen attribuut) naast het label.|Willekeurig|Zijsnede|Weergave van één entiteit|Grootte|Kleur van de schuifregelaar|Dia\'s per weergave|Plek {n}|Afvlakking|Slang|Momentopname|Vernieuwing momentopname (seconden)|Sneeuw|Sneeuw, regen, onweer, zon, wolken, mist of wind, afgeleid van de status.|Effen|Doorgetrokken|Een paar panelen zijn verborgen, zoals je ze had achtergelaten. Gebruik de pijlen aan de randen om ze te tonen.|Zuid|Zuid draait de seizoenen om.|Ruimte eromheen|Ruimte ertussen|Ruimte tussen dia\'s (px)||Snelheid|Snelheid (s)|Draaien|Lente||Kaarten horizontaal stapelen|Kaarten verticaal stapelen|Sterren en vuurvliegjes \'s nachts, een warme gloed bij schemering en dageraad (sun.sun), overdag niets.|Begin|Begin: koppelen aan|Status|Status (geen attribuut)|Statuskleur|Statuspictogrammen|Statuspictogrammen: het pictogram terwijl de entiteit aan of uit is. Leeg: het pictogram van de module.|Statuswaarde|Status, bijv. on (leeg: elke wijziging)|Statistiek|Statistiekgrafiek|Stap|Kleur van kleurpunt {num}|Kleurpunt {num} van {n}|Recht|Sterkte (%)|Rekken|Structuur|Stijl|Stijlen worden verwijderd; gebruik fill-attributen (bijvoorbeeld fill="#f44336") voor kleuren.|Achtervoegsel|Zomer|Zwaaien|Omgeschakeld naar Effen. Ongedaan maken brengt het kleurverloop terug.|Gesynchroniseerd met sjabloon|Gesynchroniseerd met het sjabloon. Klik om een lokale waarde te houden die niet wordt gesynchroniseerd.|Tabblad|Naam van het tabblad|Tabbladstijl|Tabblad {n}|Tabbladen|Tikken|Tik op het pictogram om de lamp aan of uit te zetten. Laat Pictogram leeg om het eigen pictogram van de lamp te tonen.|Doel|Doelentiteit|Sjabloon|Sjabloonacties|Sjabloonanimaties|Naam van het sjabloon|Een sjabloonnaam is verplicht.|Tekst|De tekst gebruikt dit kleurverloop als vulling. Oudere tablets tonen de eerste kleur.|Dat is geen entiteits-id. Er hoort een punt in, zoals light.kitchen. Gebruik Geen entiteit om de entiteit uit te zetten.|De SVG is groter dan 32 KB.|De geanimeerde pictogrammen konden niet worden geladen. Probeer het opnieuw.|De boog krijgt de kleur van het hoogste bereik op of onder de waarde.|Het gebied vervaagt naar boven. De lijn blijft zwak zichtbaar ({pct}%), zodat tekst erover leesbaar blijft.|Het attribuut bevat de afbeeldings-URL; die vervangt de entiteitsafbeelding en de afbeeldings-URL.|De balk krijgt de kleur van het hoogste bereik op of onder de waarde; de balkkleur geldt onder het eerste bereik.|De blob verandert langzaam van vorm.|De kaart knipt zijn rand af: de ring zit erbinnen en de gloed schijnt naar binnen.|De kleur langs deze kleurpunten volgt de waarde: de entiteit, min en max van de vloeistofvulling, anders de entiteit van de module van 0 tot 100.|Het apparaat waar deze kaart voor is. Tegels volgen dit, tenzij je er een voor instelt.|Het lege deel gebruikt de kleur {colour} (ingesteld in YAML); een waarde hier vervangt die.|De statuskleur van de entiteit|De pictogrameditor kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.|De pictogrameditor kon niet worden geladen. Probeer het opnieuw.|Het pictogram gebruikt dit kleurverloop als vulling. Oudere tablets tonen de eerste kleur.|De bibliotheek kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.|De bibliotheek is vol. Verwijder eerst een vorm.|De modules in deze indeling; de modules van de indeling wijken af van het sjabloon.|De modules in deze indeling; ze volgen het sjabloon als één lijst.|Pa\'s wijze lynx bezag vroom het fikse aquaduct|De vorm knipt alles af wat buiten de module uitsteekt, zoals keuzelijsten en tooltips.|De vormeditor kon niet worden geladen. Controleer je verbinding en probeer het opnieuw.|De vorm vervangt hier de randafronding.|De deelfuncties zijn niet geladen. Laad de pagina opnieuw en probeer het nog eens.|Het studiocanvas toont een momentopname; het dashboard speelt de stream af (zonder geluid).|De thermostaat houdt een bereik aan (laag / hoog): kies target_temp_low of target_temp_high als attribuut om één kant in te stellen.|De visuele editor ondersteunt deze configuratie niet: {error}|De golven stromen langs de rand.|De sleutel {key} wordt automatisch ingesteld op basis van het kaarttype. Neem hem hier niet op.|Het paneel {noun} is verborgen, zoals je het had achtergelaten. Gebruik de pijl aan de rand om het te tonen.|Standaard van het thema|Thermostaat|Deze kaart|Deze kaart is gekoppeld aan sjabloon {name}. Wil je alle gekoppelde kaarten bijwerken met deze structuurwijziging?|Deze kaart heeft nu zijn eigen kopie.|Deze kaart gebruikt nog plaatshouders in plaats van jouw entiteiten. Pas na het koppelen toont hij live waarden.|Deze kaart gebruikt alleen zijn eigen custom_animations.|Deze entiteit heeft geen dagelijkse voorspelling; het eerste voorspellingstype wordt getoond. De module Voorspelling biedt meer opties.|Deze entiteit heeft geen opties die een keuzelijst kan instellen (gebruik een invoerkeuze, keuze, invoertekst of tekst met eigen opties, klimaat, ventilator, lamp, mediaspeler, boiler of luchtbevochtiger).|Deze entiteit heeft geen {type} voorspelling; {fallback} wordt getoond.|Dit is eigen CSS voor een kleurverloop. Kies Kleurverloop om het te vervangen door de versie van de editor.|Deze lamp heeft geen {what}; de bediening is verborgen.|Deze lijnstijl is breed en hecht daarom aan het modulevak, tot je Pictogram of afbeelding kiest.|Deze module hoort bij een indeling; de modules van de indeling wijken af van het sjabloon.|Deze module hoort bij een indeling; ze volgen het sjabloon als één lijst.|Deze vorm kan niet worden opgeslagen.|Deze tegel heeft {kind} nodig. Het apparaat van de {source} is {thing}, dus de tegel blijft leeg.|Deze tegel toont geen apparaat.|Deze waarde kan alleen worden getoond: de entiteit (of dit attribuut) kan niet met een schuifregelaar worden ingesteld.|Deze waarde kan alleen worden getoond: de entiteit (of dit attribuut) kan niet met een getalkiezer worden ingesteld.|Drempels||Ticket, Golf en Blob kunnen nog niet worden bewerkt. Gebruik de voorinstelling zoals die is.|Tegel|Tegels erin volgen deze entiteit, tenzij ze een eigen kiezen.|Tegels erin krijgen geen entiteit, tenzij ze er een kiezen.|Tegels die de kaart volgen, tonen dit.|Tijd|Tijdnotatie|Timervulling|Titel|Naar|Naar zijde|Takenlijst|Takenlijstkaart|Schakelen|Schakelt {entity} (de entiteit van de module).|Boven|Linksboven|Rechtsboven|Kleur van het spoor|Dekking van het spoor (%)|Probeer opnieuw|Zet uit om alleen voor deze kaart een thema te kiezen.|Tweemaal daags|||Onderstreept|Ongedaan maken|Ongedaan maken (Ctrl+Z)|Eenheid|Onbekend moduletype|Loskoppelen van sjabloon|Kaart zonder titel|Omhoog|Tot 168 (een week).|Tot 32 KB. Delen met fill="currentColor" nemen de pictogramkleur aan, delen met class="mc-accent" de accentkleur.|Tot twee keer zo dik bij Max.|Alle gekoppelde kaarten bijwerken|Gekoppelde kaarten bijwerken?|SVG uploaden|Gebruiken|Waarde van Standaard gebruiken|Gebruik Jinja2-sjablonen: {example}|Gebruik MM-DD..MM-DD, zoals 12-01..12-26, of off.|Gebruik Geen entiteit|Een kopie van {name} gebruiken|Gebruik een hexkleur, rgb(a) of var(--naam).|Gebruik een verhouding zoals 16:9, 4/3, 1.5 of 56.25%. Tot die tijd wordt 16:9 gebruikt.|Als kopie gebruiken|Gebruik hooguit 80 tekens.|Dashboardthema gebruiken|Entiteit gebruiken|Entiteitskleur gebruiken|Entiteitskleur gebruiken wint zolang de entiteit een statuskleur heeft; anders geldt deze kleur.|Entiteitspictogram gebruiken|Entiteitsafbeelding gebruiken|Gebruiken volgt de bibliotheek: wijzig een vorm en elke kaart die hem gebruikt verandert mee. Als kopie gebruiken maakt deze kaart onafhankelijk.|Gebruik alleen letters, cijfers, - en _ (geen spaties).|Entiteit van de module gebruiken|Eigen kleur gebruiken|Sjabloon gebruiken|De statuskleur van de entiteit gebruiken|{name} gebruiken|{value} gebruiken|Gebruikt totdat de streamspeler beschikbaar is.|Een kopie van {name} wordt gebruikt.|{name} wordt gebruikt. Wijzigingen eraan bereiken elke kaart die hem gebruikt.|Valentijn|Waarde|Waarde en route|Waarde-achtergrond|Type waarde-achtergrond|Waarden worden per periode gemiddeld (2 = elke 30 minuten). Leeg tekent elke opgeslagen wijziging.|Verticaal|Verticale uitlijning|Verticale stapel|Video-URL|Weergave|Weergavetype {type} wordt niet ondersteund|Kijkers kunnen de beweging op deze kaart niet pauzeren. Zet de knop aan als er iets langer dan 5 seconden beweegt.|Zichtbaarheid|Golf|Golfrand|Golfhoogte|Golven|Weer|Weerentiteit|Weersverwachting|Weersverwachtingskaart|Voor welk apparaat is deze kaart?|Zolang de entiteit aan is|Tijdens het stromen|Zolang de status gelijk is aan…|Breed|Breed, 800 pixels|Breedte|Breedte (px)||Zonder eigen entiteit gebruikt de rij die van de kaart.|Als er verder niets wordt getoond, wordt de status toch getoond.|Zonder kopie speelt de kaart niets af als Magic Card Utils of deze animatie wordt verwijderd.|Zonder kopie toont de kaart het standaardpictogram als Magic Card Utils of dit pictogram wordt verwijderd.|Zonder ID opent hij alleen via zijn triggers.|Wiebelen|In indeling plaatsen||YAML gekopieerd met je animaties.|YAML gekopieerd.|YAML gekopieerd. Niet ingesloten (niet gevonden): {ids}.|YAML. Laat leeg om de service zonder gegevens aan te roepen.|YYYY jaar, MMMM / MMM maandnaam, MM / M maand, DD / D dag, dddd / ddd weekdag. Tekst tussen [haakjes] blijft ongewijzigd.|Je account kan de bibliotheek gebruiken maar niet wijzigen. Vraag het een beheerder.|Eigen|een camera|een apparaat|een ander soort apparaat|een javascript:-link|een lamp|een lijst met opties|een script|een sensor|een schakelaar|een weerbron|attribuut|helderheid|kaart|kleur|kleurtemperatuur|kleuren|kolom|aangepaste breedtes|effecten|is gelijk aan|gebeurtenishandlers|externe verwijzingen|fr verdeelt de vrije ruimte. Gebruik Aangepast voor auto (zo breed als de inhoud). %-breedtes plus tussenruimte kunnen buiten de rij vallen.|vanaf {value}|verborgen||lagen|indeling {layout}|lichte tekst op de themakleur|geen|is niet gelijk aan|voorbeeld|rij|dia\'s|tabbladen|de HVAC-modus|themakleur|deze kaart|deze kolom|deze module|deze rij|vandaag|{angle} graden|{count, plural, one {Deze SVG bevat {list}. Verwijder het en probeer het opnieuw.} other {Deze SVG bevat {list}. Verwijder ze en probeer het opnieuw.}}|{from} tot {to}|{id} (niet gevonden)|{id} (onbekend)|{label} (geen id)|Entiteit voor {label}|Bron van {label}|Eenheid van {label}|{label}: status|{list} en {last}|{max, plural, one {Tot # kleurpunt} other {Tot # kleurpunten}}|{min} tot {max}||{module} geplakt in {where}|{n, plural, one {# kolom, {ratio}} other {# kolommen, {ratio}}}|{n, plural, one {# kolom} other {# kolommen}}|{n, plural, one {# kolom} other {# kolommen}}, aangepaste breedtes|{n, plural, one {# voorwaardelijke regel} other {# voorwaardelijke regels}}. Regels overschrijven Standaard alleen zolang aan hun voorwaarden wordt voldaan.|{n, plural, one {# voorwaardelijke regel} other {# voorwaardelijke regels}}. Dezelfde regels als op het tabblad Voorwaarden. Regels overschrijven Standaard alleen zolang aan hun voorwaarden wordt voldaan. Een latere regel wint van een eerdere.|{n, plural, one {# veld wijkt} other {# velden wijken}} lokaal af.|{n, plural, one {# pictogram gevonden} other {# pictogrammen gevonden}}|{n, plural, one {# laag} other {# lagen}}||{n, plural, one {# afwijking} other {# afwijkingen}}|{n, plural, one {# rij} other {# rijen}}|{n, plural, one {# instelling die de nieuwe module niet ondersteunt} other {# instellingen die de nieuwe module niet ondersteunen}} verwijderd. Maak ongedaan om ze terug te halen.|{n, plural, one {# tegel volgt deze.} other {# tegels volgen deze.}}|{n, plural, one {# tegel heeft een ander apparaat nodig.} other {# tegels hebben een ander apparaat nodig.}}|{n, plural, one {Sluit de animatie in om deze kaart te delen met een andere Home Assistant.} other {Sluit ze in om deze kaart te delen met een andere Home Assistant.}}|{n, plural, one {{old} vervangen door {new}. De modules van het enige tabblad blijven in tabbladvolgorde staan.} other {{old} vervangen door {new}. De modules van alle # tabbladen blijven in tabbladvolgorde staan.}}|{n, plural, one {Gebruikt # van je animaties.} other {Gebruikt # van je animaties.}}||{name} (niet gevonden)|{name} (niet op tabbladen)||{name} ({n} ingesteld)||{name} YAML gekopieerd|Acties voor {name}|{name} gekopieerd|Ontwerp van {name} gekopieerd|Type kleurverloop van {name}|Modus van {name}|Dekking van {name}|{name}, {slot}|{name}, achter andere modules|{name}, bovenop|{name}: kleur van|{note}, of kies een andere. Escape annuleert.|{note}, of kies een andere. {key} annuleert.||{n} gewijzigd|{n} voorw.|{n} ingesteld|{panels} verborgen|{panels} getoond|{rows, plural, one {# rij} other {# rijen}} · {mods, plural, one {# module} other {# modules}}. Bouw visueel met lagen, canvas en de volledige inspecteur.||{state} teruggezet|{title}. Druk op Ctrl+C (⌘C op een Mac) om te kopiëren.|{type} (niet geleverd door deze entiteit)']),l=e=>e.map(e=>({...e,label:o(e.label)})),c={colour:"color",centre:"center",grey:"gray",customis:"customiz",behaviour:"behavior",favourite:"favorite",maximis:"maximiz",minimis:"minimiz",organis:"organiz"},d=e=>e.toLowerCase().replace(/colour|centre|grey|customis|behaviour|favourite|maximis|minimis|organis/g,e=>c[e])},8943(e,t,i){i.d(t,{$L:()=>c,bS:()=>d});var n=i(6161),o=i(7911),s=i(2231);const a="magic-card-image-tools.js";let r,l=!1;function c(e,t){return l?e():n.qy`${(0,o.T)((l?Promise.resolve(!0):(r??=new Promise(e=>{let t=!1;const n=(i,n)=>{t||(t=!0,clearTimeout(o),i?l=!0:(r=void 0,console.warn(`Magic Card: ${a} did not load`,...void 0===n?[]:[n])),e(i))},o=setTimeout(()=>n(!1,"timed out"),15e3);i.e(900).then(()=>i(4510)).then(e=>{const t=e;if(t?.BUILD!==s.Q)return n(!1,`Magic Card was updated, reload the page (editor ${s.Q}, ${a} ${String(t?.BUILD)}).`);try{t.install?.()}catch(e){return n(!1,e)}n(!0)},e=>n(!1,e))}),r)).then(i=>i?e():t()),t())}`}function d(e,t){const i={...e,...t};for(const e of Object.keys(t))void 0===i[e]&&delete i[e];return i}},6365(e,t,i){i.d(t,{D:()=>o});var n=i(9100);function o(e,t){if("row"===e.type)return(0,n.t)(218,{n:t+1});if("tabs"===e.type){const i=e.tabs?.[t];return i?.label?.trim()||(0,n.t)(1028,{n:t+1})}}},9(e,t,i){var n=i(6200);const o=["icon_fx","icon_on","icon_off","svg"],s={text:["text","use_template","use_entity","entity_display"],icon:["icon","size","icon_color","use_entity_icon","use_entity_color",...o],info:["prefix","suffix","show_name","show_state","show_unit","secondary_info","show_icon","icon",...o],image:["image","entity_picture","aspect_ratio","fit"],markdown:["content"],bar:["min","max","severity","decimals","bar_height","bar_color","bar_background","show_value","direction"],graphs:["hours_to_show","points_per_hour","line_color","line_width","fill","fill_color","show_points","show_labels","height"],camera:["aspect_ratio","camera_view","refresh_interval","show_controls"],button:["label","icon","show_state","use_entity_icon","use_entity_color","button_style",...o],slider:["show_value","min","max","step","slider_color","track_color","direction",...n.h],spinbox:["min","max","step"],dropdown:["options"],light:["icon","show_brightness","show_color_temp","show_color","show_effect","compact",...o],gauge:["min","max","severity","needle","show_name","show_unit","decimals","gauge_style"],horizontal:["modules","gap","align","justify","share_entity"],vertical:["modules","gap","align","justify","share_entity"],row:["columns","layout","column_widths","gap","padding","share_entity"],tabs:["tabs","active_tab","tab_style","share_entity",...o],separator:["separator_style","separator_color","separator_width","direction"],"slider-layout":["modules","pagination","navigation","slides_per_view","space_between","loop","autoplay","autoplay_delay","share_entity"],clock:["format_12h","show_seconds","show_date","date_format"],weather:["animated_icons","show_temperature","show_condition","show_forecast","forecast_days",...o],forecast:["animated_icons","forecast_type","num_forecasts","show_temperature","show_precipitation","show_wind",...o],"video-bg":["url","poster","autoplay","loop","muted","fit"],"custom-card":["name","card_type","card_config","card_config_yaml"]};i.d(t,["$1",0,["vertical","horizontal","row","tabs","slider-layout"],"iz",0,s,"md",0,["modules","columns","tabs"],"uP",0,["id","type","entity","attribute","display","design","actions","hidden","editor_name","not_synced","placement","layer"]])},2453(e,t,i){i.d(t,{$N:()=>T,Ak:()=>y,HT:()=>w,Hn:()=>b,Iu:()=>E,R9:()=>v,Sh:()=>S,TV:()=>q,V9:()=>M,VC:()=>_,bm:()=>x,br:()=>u,c4:()=>$,cv:()=>g,e9:()=>z,fN:()=>A,g1:()=>C,iA:()=>k,kW:()=>f,r$:()=>p,rb:()=>O,tw:()=>m});var n=i(201),o=i(6161),s=i(7526),a=i(2502),r=i(5667),l=i(6365),c=i(8154),d=i(9100);const h=e=>e?.length?{child:e.map(e=>({slot:e.slot,index:e.index}))}:{};function u(e,t,i,n){return{kind:"module",row:e,col:t,module:i,...h(n)}}function p(e,t,i,n,o){return{kind:"slot",row:e,col:t,module:i,...h(n),slot:o}}function m(e,t){switch(e.kind){case"card":return e;case"row":return{kind:"card"};case"column":return{kind:"row",row:e.row};case"slot":return u(e.row,e.col,e.module,e.child);case"module":{if(!e.child?.length)return{kind:"column",row:e.row,col:e.col};const i=e.child.slice(0,-1),n=t?g(t,u(e.row,e.col,e.module,i)):void 0;return(0,r.WA)(n)?p(e.row,e.col,e.module,i,e.child[e.child.length-1].slot):u(e.row,e.col,e.module,i)}}}function g(e,t){if("module"!==t.kind)return;const i=e.rows?.[t.row]?.columns?.[t.col]?.modules?.[t.module];return(0,r.Rv)(i,t.child??[])}function f(e,t){return"slot"===t.kind?g(e,m(t)):void 0}function v(e,t){switch(t.kind){case"card":return e;case"row":return e.rows?.[t.row];case"column":return e.rows?.[t.row]?.columns?.[t.col];case"module":return g(e,t);case"slot":{const i=f(e,t),n="tabs"===i?.type?i.tabs:"row"===i?.type?i.columns:void 0,o=Array.isArray(n)?n[t.slot]:void 0;return o&&"object"==typeof o?o:void 0}}}function b(e){const t=e&&"object"==typeof e?e.editor_name:void 0;return"string"==typeof t&&t.trim()?t.trim():void 0}function y(e){return!!e&&"object"==typeof e&&!0===e.hidden}function _(e){const t=`${e.row}.${e.col}.${e.module}`;return e.child?.length?`${t}/${(0,r.Nk)(e.child)}`:t}function w(e){const[t,...i]=e.split("/"),n=/^(\d+)\.(\d+)\.(\d+)$/.exec(t),o=(0,a.Tu)(i.join("/"));return n&&o?u(Number(n[1]),Number(n[2]),Number(n[3]),o):null}function $(e){return e&&void 0!==e.rowIndex?void 0===e.columnIndex?{kind:"row",row:e.rowIndex}:void 0===e.moduleIndex?{kind:"column",row:e.rowIndex,col:e.columnIndex}:void 0!==e.slotIndex?p(e.rowIndex,e.columnIndex,e.moduleIndex,e.childPath,e.slotIndex):u(e.rowIndex,e.columnIndex,e.moduleIndex,e.childPath):{kind:"card"}}function x(e){switch(e.kind){case"card":return null;case"row":return{rowIndex:e.row};case"column":return{rowIndex:e.row,columnIndex:e.col};case"module":return e.child?.length?{rowIndex:e.row,columnIndex:e.col,moduleIndex:e.module,childPath:e.child.map(e=>({...e}))}:{rowIndex:e.row,columnIndex:e.col,moduleIndex:e.module};case"slot":return{...x(m(e)),slotIndex:e.slot}}}function k(e){switch(e.kind){case"card":return"card";case"row":return`r${e.row}`;case"column":return`r${e.row}.c${e.col}`;case"module":{const t=`r${e.row}.c${e.col}.m${e.module}`;return e.child?.length?`${t}/${(0,r.Nk)(e.child)}`:t}case"slot":return`${k(m(e))}#${e.slot}`}}function C(e){const t=e.indexOf("#");if(t>=0){const i=C(e.slice(0,t)),n=e.slice(t+1);return"module"===i.kind&&/^\d+$/.test(n)?p(i.row,i.col,i.module,i.child,Number(n)):{kind:"card"}}const i=/^r(\d+)(?:\.c(\d+)(?:\.m(\d+)(?:\/(.+))?)?)?$/.exec(e);if(!i)return{kind:"card"};const n=Number(i[1]);if(void 0===i[2])return{kind:"row",row:n};const o=Number(i[2]);if(void 0===i[3])return{kind:"column",row:n,col:o};const s=(0,a.Tu)(i[4]??"");return s?u(n,o,Number(i[3]),s):{kind:"card"}}function M(e,t){return k(e)===k(t)}function S(e,t){const i=e.rows||[];if("card"===t.kind)return t;const n=i[t.row];if(!n)return{kind:"card"};if("row"===t.kind)return t;const o=n.columns?.[t.col];if(!o)return{kind:"row",row:t.row};if("column"===t.kind)return t;if("slot"===t.kind){const i=S(e,m(t)),n=g(e,i);return M(i,m(t))&&(0,r.WA)(n)&&t.slot<(0,a.yZ)(n).length?t:i}const s=o.modules?.length||0;if(0===s)return{kind:"column",row:t.row,col:t.col};const l=Math.min(t.module,s-1),c=[];let d=o.modules[l];for(const e of l===t.module?t.child??[]:[]){const t=(0,a.yZ)(d)?.[e.slot]?.[e.index];if(!t)break;c.push(e),d=t}return u(t.row,t.col,l,c)}function A(e,t){const i=[];let n=e.rows[t.row].columns[t.col].modules[t.module];const o=t.child??[];i.push({label:b(n)??E(n),target:u(t.row,t.col,t.module)});for(const[e,s]of o.entries()){const r=(0,l.D)(n,s.slot),c=(0,a.yZ)(n)?.[s.slot]?.[s.index];if(!c||"object"!=typeof c)break;n=c;const d=b(n)??E(n);i.push({label:r?`${r} · ${d}`:d,target:u(t.row,t.col,t.module,o.slice(0,e+1))})}return i}function q(e){return(e.rows||[]).reduce((e,t)=>e+(t.columns||[]).reduce((e,t)=>e+(t.modules?.length??0),0),0)}function E(e){const t=s.s.get(e.type)?.metadata.name;return void 0===t?e.type:(0,n.t)(t)}function j(e){const t=e;for(const e of["entity","label","text","name"]){const i=t[e];if("string"==typeof i&&i.trim())return i}}function T(e){const t=e;for(const e of["label","text","name"]){if("text"===e&&t.use_entity)continue;const i=t[e];if("string"!=typeof i)continue;const n=i.trim().split("\n")[0];if(n&&!L.test(n))return n.length>40?`${n.slice(0,39)}…`:n}}function z(e,t){const i=e.name?.trim()||(0,d.t)(167),n=S(e,t);if("card"===n.kind)return{title:i,icon:"mdi:card-outline",crumbs:[i]};const o=b(e.rows[n.row])??(0,d.t)(848,{n:n.row+1});if("row"===n.kind)return{title:o,icon:"mdi:view-sequential-outline",crumbs:[i,o],subtitle:(0,c.SU)(e.rows[n.row])?(0,d.t)(263):(0,d.t)(513,{layout:e.rows[n.row].layout||"1"})};const h=b(e.rows[n.row].columns[n.col])??(0,d.t)(218,{n:n.col+1});if("column"===n.kind){const t=e.rows[n.row].columns[n.col].modules?.length??0;return{title:h,icon:"mdi:view-column-outline",crumbs:[i,o,h],subtitle:(0,d.t)(1271,{n:t})}}if("slot"===n.kind){const t=m(n),s=g(e,t),c=(0,a.yZ)(s)?.[n.slot];if(!s||!c||!(0,r.WA)(s))return{title:"tabs"===s?.type?(0,d.t)(1025):(0,d.t)(213),icon:"mdi:view-column-outline",crumbs:[i,o,h]};const u=("row"===s.type?b(s.columns?.[n.slot]):void 0)??(0,l.D)(s,n.slot),p=c.length,f=s.tabs?.[n.slot]?.icon;return{title:u,icon:"tabs"===s.type?f||"mdi:tab":"mdi:view-column-outline",crumbs:[...z(e,t).crumbs,u],subtitle:(0,d.t)(1271,{n:p})}}const u=g(e,n);return u&&"object"==typeof u?{title:b(u)??E(u),icon:s.s.get(u.type)?.metadata.icon||"mdi:puzzle-outline",crumbs:[i,o,h,...A(e,n).map(e=>e.label)],subtitle:j(u)}:{title:(0,d.t)(590),icon:"mdi:puzzle-outline",crumbs:[i,o,h]}}const L=/^[a-z_]+\.[a-z0-9_]+$/;function O(e){const t=e.split(/(?<=[._])/);return o.qy`${t.map((e,t)=>t?o.qy`<wbr>${e}`:e)}`}i.d(t,["Y",0,L])},7837(e,t,i){i.d(t,{D6:()=>c,cs:()=>r});var n=i(2797),o=i(8015),s=i(9);let a;function r(){return a??=new Promise((e,t)=>{const o=setTimeout(()=>t(new Error(`${n.Iz} chunk: timed out`)),8e3);i.e(234).then(()=>i(3e3)).then(i=>{clearTimeout(o);const s=i.TRANSFER;s&&String(s.version).split(".")[0]==="2.0.0".split(".")[0]?e(s):t(new Error(`${n.Iz} chunk: unsupported version ${String(s?.version)}`))},e=>{clearTimeout(o),t(e instanceof Error?e:new Error(String(e)))})}).catch(e=>{throw a=void 0,e}),a}const l=["type","name","template","entity","not_synced","rows","use_page_theme","theme","background","background_image","border_radius","padding","border_width","border_style","border_color","opacity","backdrop_filter","margin","box_shadow","card_height","overflow","css","hover","display","conditional_appearance","animations","custom_animations","hidden_animations","background_layers","layers_low_power","pause_button","pause_button_corner","ring","shape","shape_options","custom_shapes","custom_icons","value_background","popup","flows","seasonal"];function c(){const e=Object.create(null);for(const[t,i]of Object.entries(o.KS))e[t]=["s"===i?"time":"length","number","keyword"];for(const t of o.D$)e[t]=["colour","gradient"];for(const t of o.jw)e[t]=["paint-image","gradient","colour"];return{cardKeys:l,moduleKeys:s.iz,commonModuleKeys:s.uP,designTypes:e}}},201(e,t,i){var n=i(4753);const{t:o,tx:s,m:a,locale:r,ready:l}=(0,n._H)("labels",()=>i.e(249).then(()=>i(2657)));i.d(t,["G",0,l,"t",0,o])},3386(e,t,i){function n(e,t){const i=e.name.lastIndexOf("."),n=e.name.slice(i<0?e.name.length:i).toLowerCase(),o=t.types.find(e=>e.extensions.includes(n))??t.types.find(t=>t.mimeTypes.includes(e.type))??(t.other&&{kind:"other",...t.other});return o?e.size>o.maxBytes?{code:"too_large",maxBytes:o.maxBytes}:o:{code:"wrong_type"}}function o(e,t){const i=n(e,t);return"code"in i?i:void 0}async function s(e,t){const i=n(e,t);if("code"in i)return{ok:!1,...i};try{return{ok:!0,text:await e.text(),kind:i.kind,bytes:e.size,name:e.name}}catch{return{ok:!1,code:"unreadable"}}}function a(e,t){return e.trim()?e.length>t?"too_large":void 0:"empty"}i.d(t,{A:()=>a,TA:()=>s,lv:()=>o})},105(e,t,i){var n=i(6161),o=i(5116),s=i(158),a=i(3992);const r=n.AH`:host{color:var(--primary-text-color,#1a1a2e);font-family:var(--paper-font-body1_-_font-family,'Roboto',sans-serif)}input,select,textarea,button{font-family:inherit;color:inherit}input[type='text'],input[type='number'],input[type='time'],select,textarea{padding:8px 10px;border:1px solid var(--divider-color,#e5e7eb);border-radius:8px;font-size:var(--ha-font-size-s,.875rem);background:var(--card-background-color,#fff);color:var(--primary-text-color,#1a1a2e);outline:none;box-sizing:border-box}input:focus,select:focus,textarea:focus{border-color:var(--primary-color,#6366f1);box-shadow:0 0 0 2px color-mix(in srgb,var(--primary-color,#6366f1) 20%,transparent)}button{border-radius:8px}`,l=n.AH`:host{display:block}.mc-editor{padding:20px;font-family:var(--paper-font-body1_-_font-family,'Roboto',sans-serif);color:var(--mc-text)}.mc-mode-help{margin:0 0 20px;font-size:var(--ha-font-size-xs,.75rem);color:var(--mc-text-secondary);line-height:1.5;max-width:60ch} .mc-editor-toolbar{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:16px}.mc-toolbar-spacer{flex:1}.mc-toolbar-btn{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;border-radius:6px;cursor:pointer;color:var(--mc-text-secondary);transition:all .15s}.mc-toolbar-btn:hover:not(:disabled){background:var(--mc-border);color:var(--mc-text)}.mc-toolbar-btn:disabled{opacity:.3;cursor:default}.mc-editor-toolbar .mc-btn{height:32px;padding:0 12px;display:inline-flex;align-items:center;gap:6px;border-radius:8px;font-size:var(--ha-font-size-s,.875rem)}.mc-linked-indicator{display:flex;align-items:center;gap:6px;padding:4px 10px;height:32px;color:var(--mc-primary);background:var(--mc-primary-light);border-radius:6px;cursor:pointer;transition:all .15s;border:none;font-size:var(--ha-font-size-s,.875rem);font-weight:500}.mc-toolbar-template-name{max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mc-linked-indicator:hover{filter:brightness(.95)}.mc-linked-badge{position:absolute;top:-4px;${(0,a.E)("inset","auto","-4px")} min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:var(--mc-primary);color:var(--text-primary-color,#fff);font-size:10px;font-weight:700;line-height:16px;text-align:center;box-shadow:0 0 0 2px var(--mc-bg)} .mc-linked-popup{position:absolute;top:100%;${(0,a.E)("inset","0","auto")} margin-top:4px;background:var(--card-background-color,#fff);border:1px solid var(--mc-border);border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);padding:12px;min-width:220px;z-index:100}.mc-linked-popup-name{font-size:var(--ha-font-size-s,.875rem);font-weight:600;color:var(--mc-text);margin-bottom:8px;display:flex;align-items:center;gap:6px}.mc-linked-popup-sync-summary{padding:8px 0;margin-bottom:4px;border-top:1px solid var(--mc-border);border-bottom:1px solid var(--mc-border)}.mc-sync-summary-header{font-size:var(--ha-font-size-xs,.75rem);font-weight:600;color:var(--warning-color,#ff9800);display:flex;align-items:center;gap:6px;margin-bottom:4px}.mc-sync-summary-header.synced{color:var(--success-color,#4caf50);margin-bottom:0}.mc-sync-summary-list{display:flex;flex-direction:column;gap:2px;max-height:150px;overflow-y:auto}.mc-sync-summary-item{display:flex;flex-direction:column;padding:3px 0 3px 20px;font-size:var(--ha-font-size-xs,.75rem)}.mc-sync-summary-location{font-weight:600;color:var(--mc-text)}.mc-sync-summary-paths{color:var(--secondary-text-color,#666)}.mc-linked-popup-actions{display:flex;flex-direction:column;gap:4px}.mc-linked-popup-btn{display:flex;align-items:center;gap:8px;padding:10px 12px;border:none;background:none;border-radius:6px;cursor:pointer;font-size:var(--ha-font-size-s,.875rem);color:var(--mc-text);transition:background .15s;width:100%;text-align:start}.mc-linked-popup-btn:hover{background:var(--mc-border)}.mc-linked-popup-btn.danger{color:var(--error-color,#f44336)}.mc-linked-popup-btn.danger:hover{background:color-mix(in srgb,var(--error-color,#f44336) 10%,transparent)} .mc-toolbar-linked-container{position:relative}.mc-selected-context{display:flex;align-items:center;gap:10px;padding:8px 12px;border:none;border-inline-start:3px solid var(--mc-primary);border-radius:6px;background:var(--mc-primary-light);margin-bottom:12px;font-size:var(--ha-font-size-s,.875rem);color:var(--mc-text)}.mc-selected-context ha-icon{color:var(--mc-primary);flex-shrink:0}.mc-selected-context strong{font-weight:600;color:var(--mc-primary)} .mc-settings-panel{border:1px solid var(--mc-border);border-radius:var(--mc-radius-md);overflow:hidden;margin-top:12px}.mc-settings-header{display:flex;align-items:center;gap:10px;padding:14px 16px;background:var(--mc-primary-light);border-bottom:1px solid var(--mc-border);font-size:var(--ha-font-size-s,.875rem);font-weight:500}.mc-settings-tabs{display:flex;border-bottom:1px solid var(--mc-border)}.mc-settings-tab{flex:1;padding:10px;border:none;background:none;cursor:pointer;font-size:var(--ha-font-size-xs,.75rem);font-weight:500;color:var(--mc-text-secondary);border-bottom:2px solid transparent;transition:all .15s;text-align:center}.mc-settings-tab.active{color:var(--mc-primary);border-bottom-color:var(--mc-primary)}.mc-settings-tab:hover:not(.active){color:var(--mc-text)}.mc-settings-content{padding:16px}.mc-bp-xs,.mc-bp-sm{padding:14px}.mc-bp-xs .mc-editor-toolbar,.mc-bp-sm .mc-editor-toolbar{gap:6px;margin-bottom:10px}.mc-bp-xs .mc-btn,.mc-bp-sm .mc-btn{padding:8px 10px} .mc-tab-content{display:flex;flex-direction:column;gap:16px}.mc-section{display:flex;flex-direction:column;gap:10px}.mc-section-header{font-size:var(--ha-font-size-s,.875rem);font-weight:600;color:var(--mc-text);padding-bottom:6px;border-bottom:1px solid var(--mc-border);margin-top:12px}.mc-field{display:flex;flex-direction:column;gap:6px}.mc-field-label{font-size:var(--mc-font-size-xs,.75rem);font-weight:500;color:var(--mc-text-secondary);text-transform:uppercase;letter-spacing:.04em}.mc-field input[type='text'],.mc-field input[type='number'],.mc-field select,.mc-field textarea{padding:10px 12px;border:1px solid var(--mc-border);border-radius:8px;font-size:var(--ha-font-size-s,.875rem);background:var(--mc-bg);color:var(--mc-text);outline:none;transition:border-color .15s;width:100%;box-sizing:border-box}.mc-field input:focus,.mc-field select:focus,.mc-field textarea:focus{border-color:var(--mc-primary)}.mc-field-toggle{flex-direction:row;align-items:center;justify-content:space-between}.mc-field-toggle input[type='checkbox']{width:18px;height:18px;accent-color:var(--mc-primary)}.mc-field-hint{font-size:var(--ha-font-size-xs,.75rem);color:var(--mc-text-secondary);font-style:italic}.mc-field-hint-tight{margin-top:-4px;margin-bottom:8px}.mc-field-hint-with-margin{margin-bottom:8px}.mc-entity-field{position:relative}.mc-entity-field input{width:100%;padding:10px 12px;border:1px solid var(--mc-border);border-radius:8px;font-size:var(--ha-font-size-s,.875rem);background:var(--mc-bg);color:var(--mc-text);outline:none;transition:border-color .15s;box-sizing:border-box}.mc-entity-field input:focus{border-color:var(--mc-primary)} .mc-btn{padding:10px 18px;border-radius:8px;border:none;cursor:pointer;font-size:var(--ha-font-size-s,.875rem);font-weight:500;transition:all .15s}.mc-btn-primary{background:var(--mc-primary);color:var(--text-primary-color,#fff)}.mc-btn-primary:hover{filter:brightness(1.1)}.mc-btn-secondary{background:var(--mc-surface-recessed);color:var(--mc-text)}.mc-btn-secondary:hover{background:color-mix(in srgb,var(--mc-text) 10%,transparent)}.mc-btn-compact{padding:4px 8px;font-size:var(--ha-font-size-xs,.75rem)}.mc-btn-icon{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:1px solid var(--mc-border);border-radius:8px;background:none;cursor:pointer;color:var(--mc-text-secondary);font-size:1rem;transition:all .15s}.mc-btn-icon:hover{background:var(--mc-border);color:var(--mc-text)}.mc-option-row{display:flex;gap:8px;align-items:flex-end;margin-bottom:8px}.mc-option-row .mc-field{flex:1}.mc-card-editor-section{border:1px solid var(--divider-color,#e5e7eb);border-radius:8px;overflow:hidden}.mc-card-editor-header{display:flex;align-items:center;gap:8px;padding:10px 12px;font-size:.8125rem;font-weight:600;color:var(--primary-color,#6366f1);background:color-mix(in srgb,var(--primary-color,#6366f1) 6%,transparent);border-bottom:1px solid var(--divider-color,#e5e7eb)}.mc-card-editor-icon{--mdc-icon-size:16px}.mc-card-editor-body{padding:16px}.mc-card-editor-toolbar{display:flex;justify-content:flex-end;margin-bottom:12px}.mc-card-editor-toggle:disabled{opacity:.5;cursor:not-allowed}.mc-yaml-fallback textarea{width:100%;min-height:200px;font-family:monospace;font-size:.8125rem;resize:vertical;border:1px solid var(--divider-color,#e5e7eb);border-radius:6px;padding:12px;background:var(--card-background-color,#fff);color:var(--primary-text-color,#1a1a2e);box-sizing:border-box}.mc-yaml-fallback textarea:focus{outline:none;border-color:var(--primary-color,#6366f1)}.mc-yaml-fallback-note{margin-bottom:8px;font-size:.8125rem;color:var(--secondary-text-color,#6b7280)}.mc-yaml-fallback-error{color:var(--error-color,#ef4444);font-size:.8125rem;margin-top:4px}.mc-yaml-fallback-help{margin-top:4px;font-size:.75rem;color:var(--secondary-text-color,#6b7280)}.mc-editor-loading{display:flex;align-items:center;justify-content:center;min-height:100px;color:var(--secondary-text-color,#757575);font-size:.875rem} @keyframes mc-skel-shimmer{0%{background-position:-240px 0}100%{background-position:calc(240px + 100%) 0}}.mc-skel{background:linear-gradient( 90deg,color-mix(in srgb,var(--mc-text) 5%,transparent) 25%,color-mix(in srgb,var(--mc-text) 10%,transparent) 50%,color-mix(in srgb,var(--mc-text) 5%,transparent) 75% );background-size:240px 100%;background-repeat:no-repeat;background-color:var(--mc-surface-recessed);border-radius:6px;animation:mc-skel-shimmer 1.4s ease-in-out infinite}.mc-skel-switcher{height:44px;border-radius:var(--mc-radius-md);margin-bottom:8px}.mc-skel-line{height:12px;margin-bottom:20px}.mc-skel-line-short{width:60%}.mc-skel-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:16px}.mc-skel-spacer{flex:1}.mc-skel-icon-btn{width:32px;height:32px;border-radius:6px}.mc-skel-pill{width:100px;height:32px;border-radius:8px}.mc-skel-card-header{height:44px;margin-bottom:12px;border-radius:8px}.mc-skel-row{height:96px;margin-bottom:12px;border-radius:8px} .mc-condition-item{padding:16px;border:1px solid var(--mc-border);border-radius:var(--mc-radius-md);display:flex;flex-direction:column;gap:10px;position:relative}.mc-condition-item .mc-btn-icon{position:absolute;top:8px;${(0,a.E)("inset","auto","8px")}}.mc-conditions-list{display:flex;flex-direction:column;gap:8px;margin:8px 0} .mc-cond-appearance-section{margin-top:20px;padding-top:16px;border-top:1px solid var(--mc-border,var(--divider-color,#e5e7eb));display:flex;flex-direction:column;gap:10px}.mc-cond-appearance-header{display:flex;align-items:center;gap:8px;font-size:.95rem;font-weight:600;color:var(--mc-text,var(--primary-text-color))}.mc-cond-appearance-header ha-icon{--mdc-icon-size:18px;color:var(--primary-color,#6366f1)}.mc-cond-appearance-list{display:flex;flex-direction:column;gap:8px}.mc-cond-appearance-rule{border:1px solid var(--mc-border,var(--divider-color,#e5e7eb));border-radius:8px;background:color-mix(in srgb,var(--primary-color,#6366f1) 4%,transparent);overflow:hidden}.mc-cond-appearance-rule.expanded{border-color:color-mix(in srgb,var(--primary-color,#6366f1) 30%,var(--mc-border,var(--divider-color,#e5e7eb)))}.mc-cond-appearance-rule-header{display:flex;align-items:center;gap:8px;padding:8px 12px;cursor:pointer;user-select:none;background:color-mix(in srgb,var(--primary-color,#6366f1) 6%,transparent)}.mc-cond-appearance-rule-header:hover{background:color-mix(in srgb,var(--primary-color,#6366f1) 10%,transparent)}.mc-cond-appearance-rule-header ha-icon{--mdc-icon-size:18px;color:var(--mc-text-secondary,var(--secondary-text-color))}.mc-cond-appearance-rule-name{flex:1;border:none;background:transparent;font-size:.9rem;font-weight:500;color:var(--mc-text,var(--primary-text-color));padding:4px 6px;border-radius:4px;min-width:0}.mc-cond-appearance-rule-name:hover,.mc-cond-appearance-rule-name:focus{background:var(--mc-bg,var(--card-background-color,#fff));outline:1px solid var(--mc-border,var(--divider-color,#e5e7eb))}.mc-cond-appearance-rule-count{font-size:.7rem;color:var(--mc-text-secondary,var(--secondary-text-color));padding:2px 6px;background:var(--mc-bg,var(--card-background-color,#fff));border-radius:10px;border:1px solid var(--mc-border,var(--divider-color,#e5e7eb))}.mc-cond-appearance-rule-body{padding:12px;display:flex;flex-direction:column;gap:10px;background:var(--mc-bg,var(--card-background-color,#fff))}.mc-cond-appearance-subhead{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:var(--mc-text-secondary,var(--secondary-text-color));margin-top:6px}.mc-cond-appearance-subhead:first-child{margin-top:0} .mc-action-config{display:flex;flex-direction:column;gap:8px;padding:8px;// border:1px solid var(--mc-border);border-radius:6px} .mc-modal{background:var(--card-background-color,#fff);border-radius:12px;box-shadow:0 20px 40px rgba(0,0,0,.3);width:480px;max-width:100%;max-height:85vh;display:flex;flex-direction:column;overflow:hidden}.mc-modal-header{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid var(--divider-color,#e5e7eb);background:var(--card-background-color,#fff)}.mc-modal-header ha-icon{color:var(--primary-color,#6366f1);--mdc-icon-size:24px}.mc-modal-title{flex:1;font-size:var(--ha-font-size-l,1.25rem);font-weight:600;color:var(--primary-text-color,#1a1a2e)}.mc-modal-close{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border:none;background:none;cursor:pointer;color:var(--secondary-text-color,#6b7280);border-radius:6px;font-size:1.5rem;line-height:1}.mc-modal-close:hover{background:var(--divider-color,#e5e7eb);color:var(--primary-text-color,#1a1a2e)}.mc-modal-body{flex:1;overflow-y:auto;padding:24px}.mc-modal-footer{display:flex;justify-content:flex-end;gap:10px;padding:16px 20px;border-top:1px solid var(--divider-color,#e5e7eb)}   .mc-field input:focus-visible,.mc-field select:focus-visible,.mc-field textarea:focus-visible,.mc-entity-field input:focus-visible,.mc-card-name-input:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb,var(--mc-primary) 25%,transparent)}`,c=[o.A,r,l,...s.x],d=n.AH`:host{display:block;min-width:0} .mc-picker-row{display:flex;gap:8px;align-items:stretch;min-width:0}.mc-picker-row>.input,.mc-picker-row>.mc-picker-value{flex:1 1 auto;min-width:0}.mc-picker-row>.btn{flex:none}.mc-picker-value{display:flex;align-items:center;gap:10px;min-height:40px;padding:6px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);text-align:start;transition:border-color .15s ease-out}.mc-picker-value:hover{border-color:var(--mc-text-2)}.mc-picker-value>ha-icon{flex:none;--mdc-icon-size:20px;color:var(--mc-text-2)}.mc-picker-value-text{flex:1;min-width:0;display:grid;line-height:1.35}.mc-picker-value-name{font-size:.875rem;overflow-wrap:anywhere}.mc-picker-value-id{font-family:var(--mc-mono);font-size:.75rem;color:var(--mc-text-2);overflow-wrap:anywhere}.mc-picker-value .dot{background:var(--mc-success)}.mc-picker-value .dot.is-off{background:var(--mc-field-border)}.mc-picker-value .dot.is-unavailable{background:var(--mc-error-ink)}  mc-ui-window::part(body){display:flex;flex-direction:column;padding:0;overflow-x:hidden;overflow-y:auto} .mc-picker-stack{display:flex;flex:1 1 auto;flex-direction:column;min-height:24rem} .mc-picker-search{padding:12px 16px;display:grid;gap:12px;border-bottom:1px solid var(--mc-divider)}.mc-picker-search .input{min-height:40px}@media (max-height:560px){.mc-picker-search{padding:8px 16px}} .mc-picker-list{flex:1;min-height:0;overflow-y:auto;overscroll-behavior:contain;padding:8px;display:grid;align-content:start;grid-auto-rows:max-content;gap:2px} mc-ui-window .mc-picker-list{min-height:11rem}.mc-picker-category,.mc-picker-domain{padding:12px 12px 4px;font-size:.8125rem;font-weight:500;color:var(--mc-text-2)}.mc-picker-category:first-child,.mc-picker-domain:first-child{padding-top:4px} .mc-picker-item{display:flex;align-items:center;gap:12px;width:100%;min-height:48px;padding:6px 12px;border:1px solid transparent;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text);text-align:start;cursor:pointer;transition:background-color .15s ease-out}.mc-picker-item:hover{background:var(--mc-surface-2)}.mc-picker-item.selected,.mc-picker-item[aria-selected='true']{background:var(--mc-accent-tint);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent)}.mc-picker-item:focus-visible{outline-offset:-2px}.mc-picker-item-icon{flex:none;display:grid;place-items:center;width:24px;height:24px;color:var(--mc-text-2);--mdc-icon-size:20px}.mc-picker-item.selected .mc-picker-item-icon,.mc-picker-item[aria-selected='true'] .mc-picker-item-icon{color:var(--mc-accent-ink)}.mc-picker-item-content{flex:1;min-width:0;display:grid;line-height:1.35}.mc-picker-item-name{font-size:.875rem;font-weight:500;overflow-wrap:anywhere}.mc-picker-item-id{font-family:var(--mc-mono);font-size:.75rem;color:var(--mc-text-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mc-picker-item-desc,.mc-picker-item-meta{font-size:.75rem;color:var(--mc-text-2);margin-top:2px}.mc-picker-item-desc{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.mc-picker-item>.chip{flex:none;max-width:40%;overflow:hidden;text-overflow:ellipsis}.mc-picker-item-thumb{flex:none;width:40px;height:40px;border-radius:var(--mc-radius);object-fit:cover;background:var(--mc-surface-2)}.mc-picker-item-actions{display:flex;gap:2px;flex:none}.mc-picker-item-chev{flex:none;--mdc-icon-size:20px;color:var(--mc-text-2)} .mc-picker-breadcrumbs{display:flex;align-items:center;gap:2px;padding:8px 12px;border-bottom:1px solid var(--mc-divider);overflow-x:auto;white-space:nowrap;flex-shrink:0;--mdc-icon-size:16px}.mc-picker-breadcrumbs>ha-icon{color:var(--mc-text-2);flex:none}.mc-breadcrumb-current{padding:0 8px;font-size:.8125rem;font-weight:500} .mc-picker-empty,.mc-picker-loading{padding:32px 16px;text-align:center;font-size:.8125rem;color:var(--mc-text-2)} .mc-picker-footer{display:flex;flex:1;justify-content:flex-end;flex-wrap:wrap;gap:8px}`,h=n.AH`:host{display:block}.mc-yaml-container{display:flex;flex-direction:column;gap:8px;min-height:300px}.mc-yaml-editor-wrapper{border:1px solid var(--divider-color,#e5e7eb);border-radius:8px;overflow:hidden;position:relative}.mc-yaml-textarea{width:100%;min-height:300px;padding:12px;border:none;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace;font-size:var(--ha-font-size-s,.875rem);line-height:1.5;resize:vertical;background:var(--card-background-color,#fff);color:var(--primary-text-color,#1a1a2e);outline:none;tab-size:2;box-sizing:border-box}.mc-yaml-error{padding:8px 12px;background:color-mix(in srgb,var(--error-color,#ef4444) 10%,transparent);color:var(--error-color,#ef4444);border-radius:6px;font-size:var(--ha-font-size-xs,.75rem)}.mc-yaml-status{display:flex;align-items:center;gap:8px;font-size:var(--ha-font-size-xs,.75rem);color:var(--secondary-text-color,#6b7280);padding:4px 0}.mc-yaml-status-dot{width:8px;height:8px;border-radius:50%;background:var(--success-color,#22c55e)}.mc-yaml-status-dot.error{background:var(--error-color,#ef4444)}`,u=n.AH`.mc-template-form{display:grid;gap:16px;padding:16px 20px}.mc-template-error{font-size:.8125rem;color:var(--mc-error-ink)}.mc-template-overwrite{font-size:.8125rem;color:var(--mc-warn-ink)}.mc-template-confirm{display:grid;gap:8px;padding:12px 16px;background:var(--mc-surface-2);border-bottom:1px solid var(--mc-divider)}.mc-template-confirm-text{font-size:.8125rem}.mc-template-confirm-actions,.mc-template-edit-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px}.mc-template-edit-form{display:grid;gap:12px;padding:16px;background:var(--mc-surface-2);border-bottom:1px solid var(--mc-divider)}.mc-template-edit-form textarea.input,.mc-template-form textarea.input{min-height:64px;font-family:inherit;font-size:.875rem}`,p=n.AH`.mc-picker-item.is-active{background:var(--mc-surface-2);border-color:var(--mc-field-border)}.mc-picker-item.is-active[aria-selected='true']{background:var(--mc-accent-tint);border-color:var(--mc-accent)}.mc-picker-more{padding:8px 12px 4px;font-size:.75rem;color:var(--mc-text-2);text-align:center}.mc-picker-footer .spacer{flex:1}.mc-picker-footer .clear{margin-inline-start:-8px}`,m=n.AH`.mc-font-preview{display:flex;align-items:center;justify-content:center;min-height:64px;margin:12px 16px 0;padding:12px;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);background:var(--mc-surface-2);text-align:center}.mc-font-preview-text{font-size:1.5rem;line-height:1.3;color:var(--mc-text);overflow-wrap:anywhere}`,g=n.AH`.swatch{position:relative;overflow:hidden;padding:3px}.swatch-fill{position:absolute;inset:3px;border-radius:5px;background-image:linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%);background-size:8px 8px;background-position:0 0,0 4px,4px -4px,-4px 0}.swatch-fill>span{position:absolute;inset:0;border-radius:inherit}.swatch:disabled{cursor:default} .entity-toggle[aria-pressed='true'],.entity-toggle[aria-pressed='true']:hover{background:var(--mc-accent-tint);color:var(--mc-accent-ink)}.entity-opacity{margin-top:8px} .mc-color-body{display:grid;gap:16px;padding:16px;overflow-y:auto;overscroll-behavior:contain}.mc-color-area{position:relative;width:100%;height:180px;border-radius:var(--mc-radius);cursor:crosshair;touch-action:none}.mc-color-area-gradient{position:absolute;inset:0;border-radius:var(--mc-radius);background:linear-gradient(to right,#fff,transparent),linear-gradient(to top,#000,transparent)}.mc-color-area-pointer,.mc-slider-thumb{position:absolute;width:16px;height:16px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,.3),0 1px 3px rgba(0,0,0,.3);transform:translate(-50%,-50%);pointer-events:none}.mc-slider-row{display:flex;align-items:center;gap:12px}.mc-slider-label{width:16px;flex:none;font-size:.75rem;font-weight:500;color:var(--mc-text-2)}.mc-slider-track{position:relative;flex:1;height:12px;border-radius:9999px;cursor:pointer;touch-action:none}.mc-slider-thumb{top:50%}.mc-hue-track{background:linear-gradient(to right,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)}.mc-opacity-track{background-image:linear-gradient(45deg,#ccc 25%,transparent 25%),linear-gradient(-45deg,#ccc 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#ccc 75%),linear-gradient(-45deg,transparent 75%,#ccc 75%);background-size:8px 8px;background-position:0 0,0 4px,4px -4px,-4px 0}.mc-opacity-gradient{position:absolute;inset:0;border-radius:inherit}.mc-slider-row>.input{flex:none;width:64px;min-height:32px;padding:4px 8px;text-align:center}.mc-input-row{display:grid;grid-template-columns:minmax(0,2fr) repeat(3,minmax(0,1fr));gap:8px}.mc-input-row .field{gap:4px}.mc-input-row .lbl{font-size:.75rem;color:var(--mc-text-2)}.mc-input-row .input{min-width:0;padding:8px;font-family:var(--mc-mono);font-size:.8125rem}.mc-color-section{display:grid;gap:8px}.mc-color-section-header{font-size:.8125rem;font-weight:500}.mc-color-grid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:4px}.mc-color-swatch,.mc-saved-swatch{position:relative;padding:0;border:1px solid var(--mc-divider);border-radius:6px}.mc-color-swatch{aspect-ratio:1}.mc-color-swatch:hover,.mc-saved-swatch:hover{border-color:var(--mc-text-2)}.mc-color-swatch.var-color{display:grid;place-items:center;overflow:hidden} .mc-color-swatch .var-tag{padding:1px 4px;border-radius:3px;background:rgba(0,0,0,.78);color:#fff;font-size:.6875rem;line-height:1.2}.mc-saved-colors{display:flex;flex-wrap:wrap;gap:6px}.mc-saved-swatch{width:32px;height:32px}.mc-saved-pick{position:absolute;inset:0;padding:0;border:0;border-radius:inherit;background:transparent}.mc-saved-pick:focus-visible{outline-offset:1px}.mc-saved-swatch .mc-remove-btn{position:absolute;top:-8px;${(0,a.E)("inset","auto","-8px")} display:none;place-items:center;width:18px;height:18px;padding:0;border:1px solid var(--mc-divider);border-radius:50%;background:var(--mc-surface);color:var(--mc-text-2);--mdc-icon-size:12px}.mc-saved-swatch:hover .mc-remove-btn,.mc-saved-swatch:focus-within .mc-remove-btn{display:grid}.mc-saved-swatch .mc-remove-btn:hover{color:var(--mc-error-ink)}`;i.d(t,["BP",0,u,"Qx",0,m,"fz",0,d,"kx",0,p,"rF",0,h,"yg",0,g,"yj",0,c])},158(e,t,i){var n=i(6161),o=i(21),s=i(802),a=i(6971),r=i(3992);const l=n.AH`:host .seg>button:is([aria-checked=true],[aria-selected=true],[aria-pressed=true]){font-weight:700;box-shadow:inset 0 -3px 0 var(--mc-accent-ink)}`,c=[o.e,s.a,a.$,l,r.a];i.d(t,["x",0,c])},21(e,t,i){const n=i(6161).AH`:host{--mc-accent:var(--primary-color,#03a9f4);--mc-accent-ink:color-mix(in srgb,var(--primary-color,#03a9f4) 60%,var(--primary-text-color,#212121)); --mc-accent-fill:color-mix(in srgb,var(--primary-color,#03a9f4) 70%,#000);--mc-on-accent:#fff;--mc-accent-tint:color-mix(in srgb,var(--primary-color,#03a9f4) 12%,transparent);--mc-surface:var(--card-background-color,#fff);--mc-surface-2:var(--secondary-background-color,#f2f3f5);--mc-ground:var(--primary-background-color,#fafafa);--mc-text:var(--primary-text-color,#212121);--mc-text-2:var(--secondary-text-color,#5f6368);--mc-divider:var(--divider-color,rgba(0,0,0,.12)); --mc-field-border:var(--secondary-text-color,#727272);--mc-warn-ink:color-mix(in srgb,var(--warning-color,#ff9800) 45%,var(--primary-text-color,#212121));--mc-warn-tint:color-mix(in srgb,var(--warning-color,#ff9800) 12%,transparent);--mc-error-ink:color-mix(in srgb,var(--error-color,#db4437) 75%,var(--primary-text-color,#212121));--mc-success:var(--success-color,#43a047); --mc-sel-module:var(--mc-accent);--mc-sel-module-fill:var(--mc-accent-fill);--mc-sel-module-ink:var(--mc-accent-ink);--mc-sel-module-tint:var(--mc-accent-tint);--mc-sel-col:color-mix(in srgb,var(--success-color,#43a047) 85%,var(--primary-text-color,#212121));--mc-sel-col-fill:color-mix(in srgb,var(--success-color,#43a047) 70%,#000);--mc-sel-col-ink:color-mix(in srgb,var(--success-color,#43a047) 60%,var(--primary-text-color,#212121));--mc-sel-col-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-sel-row:color-mix(in srgb,var(--warning-color,#ff9800) 70%,var(--primary-text-color,#212121));--mc-sel-row-fill:color-mix(in srgb,var(--warning-color,#ff9800) 55%,#000);--mc-sel-row-ink:var(--mc-warn-ink);--mc-sel-row-tint:var(--mc-warn-tint);--mc-sel-card:var(--mc-text-2);--mc-sel-card-fill:color-mix(in srgb,var(--secondary-text-color,#5f6368) 70%,#000);--mc-sel-card-ink:color-mix(in srgb,var(--secondary-text-color,#5f6368) 60%,var(--primary-text-color,#212121));--mc-sel-card-tint:color-mix(in srgb,var(--secondary-text-color,#5f6368) 12%,transparent);--mc-canvas:color-mix(in srgb,var(--primary-text-color,#212121) 6%,var(--primary-background-color,#fafafa));--mc-canvas-dot:color-mix(in srgb,var(--primary-text-color,#212121) 16%,transparent);--mc-shadow-float:0 8px 24px rgba(0,0,0,.16),0 2px 6px rgba(0,0,0,.08);--mc-mono:'Roboto Mono',ui-monospace,SFMono-Regular,Consolas,monospace;--mc-radius:8px;--mc-radius-lg:12px; --mc-hit:40px;--mc-font:var(--ha-font-family-body,var(--paper-font-body1_-_font-family,Roboto,system-ui,sans-serif));--mc-focus:var(--mc-accent);--mc-error-tint:color-mix(in srgb,var(--error-color,#db4437) 12%,transparent);--mc-error-fill:color-mix(in srgb,var(--error-color,#db4437) 75%,#000);--mc-success-ink:color-mix(in srgb,var(--success-color,#43a047) 55%,var(--primary-text-color,#212121));--mc-success-tint:color-mix(in srgb,var(--success-color,#43a047) 12%,transparent);--mc-scrim:rgba(0,0,0,.38);font-family:inherit;color:var(--mc-text);caret-color:var(--mc-accent)}@supports (color:color-mix(in srgb,red 50%,blue)){:host{--mc-field-border:color-mix(in srgb,var(--primary-text-color,#212121) 50%,transparent);--mc-focus:color-mix(in srgb,var(--mc-accent) 80%,var(--mc-text))}}@media (pointer:coarse){:host{--mc-hit:44px}}`;i.d(t,["e",0,n])},15(e,t,i){var n=i(9100);const o={"top-left":1110,top:1109,"top-right":1111,left:516,center:182,right:838,"bottom-left":143,bottom:142,"bottom-right":144};i.d(t,["H",0,e=>(0,n.t)(o[e])])},3795(e,t,i){i.d(t,{hN:()=>a,kk:()=>s,q2:()=>r});var n=i(1987);const o=[{value:"image",label:481,icon:"mdi:image-outline"},{value:"gradient",label:427,icon:"mdi:gradient-vertical"},{value:"pattern",label:729,icon:"mdi:dots-grid"},{value:"color",label:205,icon:"mdi:palette-outline"}];function s(e){const t=o.find(t=>t.value===e.type)?.label??481;let i;return"image"===e.type?i=e.entity||(e.image?e.image.split("/").pop():void 0)||void 0:"pattern"===e.type?i=e.pattern:"color"===e.type&&(i=e.color),i?{type:t,detail:i}:{type:t}}function a(e){return e?JSON.parse(JSON.stringify(e)):[]}function r(e){return(e??[]).some((e,t)=>{const i=(0,n.BS)(t);return!!i&&!e.hidden&&"error"===i.status&&"stale"!==i.reason})}i.d(t,["m2",0,o])},1987(e,t,i){i.d(t,{BS:()=>l,DZ:()=>p,Lx:()=>r,P3:()=>f,Rv:()=>g,VX:()=>h,Wb:()=>d,cj:()=>c,hV:()=>u});const n=new Map,o=new Set;let s,a;function r(e){if(!e||"object"!=typeof e)return;const t=Number(e.index);if(!(!Number.isInteger(t)||t<0||t>=4)){n.set(t,{index:t,status:e.status,reason:e.reason,detail:e.detail});for(const e of o)e()}}function l(e){return n.get(e)}function c(){n.clear(),a=void 0;for(const e of o)e()}function d(e){return o.add(e),()=>o.delete(e)}function h(e){s=e;for(const e of o)e()}function u(){const e=s;return s=void 0,e}function p(e){a=e;for(const e of o)e()}let m=0;function g(){m++;let e=!1;return()=>{e||(e=!0,m--,m||p(void 0))}}function f(){return a}i.d(t,["Sb",0,()=>m>0])},6355(e,t,i){let n;i.d(t,{AY:()=>s,Wc:()=>a,vs:()=>r,xr:()=>l});const o=new Set;function s(e){n=e}function a(e){return n?n(e):{}}function r(){for(const e of o)e()}function l(e){return o.add(e),()=>o.delete(e)}},4700(e,t,i){i.d(t,{AO:()=>j,Ao:()=>f,Bm:()=>L,HR:()=>E,J9:()=>A,K9:()=>$,TV:()=>w,XF:()=>x,YZ:()=>C,Z8:()=>M,ZZ:()=>u,aI:()=>h,d6:()=>S,ff:()=>y,so:()=>v,t8:()=>z,ts:()=>q,xc:()=>d});var n=i(5629),o=i(2502),s=i(5667),a=i(5395),r=i(2453);const l=new Set(["top-left","top","top-right","left","center","right","bottom-left","bottom","bottom-right"]),c=e=>"string"==typeof e&&l.has(e);function d(e){const t=e.placement;return"background"===t||"overlay"===t?t:"flow"}function h(e){return"video-bg"===e.type&&void 0===e.placement}function u(e){const t=e.layer;return t&&"object"==typeof t&&!Array.isArray(t)?t:{}}const p=new Set(["__proto__","constructor","prototype"]),m=e=>{const t={};for(const[i,n]of Object.entries(e))void 0===n||p.has(i)||(t[i]=n);return Object.keys(t).length?t:void 0};function g(e,t){const i={...e};return t?i.layer=t:delete i.layer,i}function f(e,t){const i={...u(e)},n={...e};if("flow"===t)return"video-bg"===e.type?n.placement="flow":delete n.placement,g(n,m(i));if(n.placement=t,"overlay"===t){delete i.fill,i.anchor=c(i.anchor)?i.anchor:"top-left";const{anchor:e,...t}=i;return g(n,m({anchor:e,...t}))}return delete i.anchor,delete i.offset_x,delete i.offset_y,g(n,m(i))}function v(e,t){return g(e,m({...u(e),...t}))}const b={style:"bottom",strength:60};function y(e){return e>=60?"readable":e>=45?"large":"tint"}const _=e=>Math.max(0,Math.min(90,Math.round(Number.isFinite(e)?e:b.strength)));function w(e,t){const i=u(e);if("off"===t)return g(e,m({...i,scrim:void 0}));if("on"===t)return g(e,m({...i,scrim:i.scrim??{...b}}));const n={...i.scrim??b,...t};void 0!==t.strength&&(n.strength=_(t.strength));for(const e of Object.keys(n))void 0===n[e]&&delete n[e];return g(e,m({...i,scrim:n}))}function $(e,t){return"x"===t?e.includes("left")||e.includes("right")?"edge":"centre":e.includes("top")||e.includes("bottom")?"edge":"centre"}function x(e,t){return"centre"===$(e,t)?"centre":"x"===t?e.includes("left")?"left":"right":e.includes("top")?"top":"bottom"}const k=/^-?\d{1,4}(\.\d{1,2})?(px|%)$/;function C(e,t,i){const n=e.trim();if(n)return k.test(n)?n.startsWith("-")&&"edge"===$(t,i)?"negative":void 0:"format"}function M(e){return e.count-e.index}function S(e){const t=e.actions,i="string"==typeof e.entity?e.entity:void 0;return[t?.tap_action,t?.hold_action,t?.double_tap_action].some(e=>(0,n.Q)(e,i))}function A(e){const t=u(e).click_through;return"boolean"==typeof t?t:function(e){return"overlay"!==d(e)||!S(e)}(e)}function q(e){const t={};return void 0!==e.placement&&(t.placement=e.placement),void 0!==e.layer&&"flow"!==d(e)&&(t.layer=e.layer),Object.keys(t).length?(0,a.fE)(t).trimEnd():""}function E(e,t,i){const n=e[t];if(!n)return;const o=d(n),s=[];e.forEach((e,t)=>{d(e)===o&&s.push(t)});const a=s.indexOf(t),r="front"===i?s.length-1:"back"===i?0:"forward"===i?a+1:a-1;return r<0||r>=s.length||r===a?void 0:s[r]}function j(e){const t="string"==typeof e.editor_name&&e.editor_name.trim();if(t)return t;const i=(0,r.$N)(e),n=(0,r.Iu)(e);return i?`${n} · ${i}`:n}const T=e=>"flow"===d(e)&&!h(e);function z(e,t){const i=t.child;if(!i?.length){const i=e.rows?.[t.row]?.columns?.[t.col]?.modules;if(!Array.isArray(i))return;return{list:i,index:t.module,pathOf:e=>(0,r.VC)((0,r.br)(t.row,t.col,e))}}const n=e.rows?.[t.row]?.columns?.[t.col]?.modules?.[t.module],a=(0,s.Rv)(n,i.slice(0,-1)),l=i[i.length-1],c=(0,o.yZ)(a)?.[l.slot];if(c&&a)return{list:c,index:l.index,parent:a,pathOf:e=>(0,r.VC)((0,r.br)(t.row,t.col,t.module,[...i.slice(0,-1),{slot:l.slot,index:e}]))}}function L(e,t){const i=z(e,t),n=i?.list[i.index],o=n?d(n):"flow",s=i?.list??[],a=s.filter((e,t)=>t!==i?.index&&T(e)).length,l=s.map((e,t)=>({m:e,i:t})).filter(({m:e})=>d(e)===o&&!("flow"===o)),c=l.findIndex(({i:e})=>e===i?.index),h=s.flatMap((e,t)=>t!==i?.index&&T(e)&&S(e)?[{path:i.pathOf(t),name:j(e)}]:[]);return{siblings:a,canHoist:!t.child?.length||"row"===i?.parent?.type,...c>=0?{rank:{index:c,count:l.length}}:{},path:(0,r.VC)(t),name:n?j(n):"",others:h}}i.d(t,["Fi",0,_,"R7",0,b,"WF",0,[{id:"light",strength:25},{id:"medium",strength:45},{id:"strong",strength:60},{id:"very-strong",strength:75}],"m4",0,c])},3585(e,t,i){i.d(t,{Qt:()=>v,bb:()=>m,k8:()=>g});var n=i(9793),o=i(971);const s=["spin","glow","flame","drum","swing","pulse","snow","shake","eq"],a={spin:1.5,glow:2.4,flame:1.2,drum:1.2,swing:1,pulse:1.5,snow:2.4,shake:1.2,eq:1.2},r="var(--error-color, #db4437)",l=new Set(["problem","smoke","gas","moisture","safety","carbon_monoxide","heat","tamper"]),c=new Set(["door","window","garage_door","opening"]),d=new Set(["run","running","washing","drying","spin","spinning","rinse","wash","dry"]),h=(e,t={})=>({anim:e,speed:a[e],intensity:1,...t}),u=e=>"number"==typeof e&&Number.isFinite(e)?e:void 0,p=e=>Math.min(1,Math.max(0,e));function m(e){if(!e||"string"!=typeof e.entity_id)return;const t=e.entity_id.split(".")[0],i=e.state,n=e.attributes||{},o="string"==typeof n.device_class?n.device_class:"";switch(t){case"fan":{if("on"!==i)return;const e=p((u(n.percentage)??100)/100);return h("spin",{speed:.6+2.4*(1-e)})}case"light":{if("on"!==i)return;const e=n.rgb_color,t=Array.isArray(e)&&e.length>=3&&e.slice(0,3).every(e=>void 0!==u(e))?`rgb(${e[0]}, ${e[1]}, ${e[2]})`:void 0,o=u(n.brightness);return h("glow",{intensity:void 0===o?1:.25+.75*p(o/255),...t?{color:t}:{}})}case"climate":return"heating"===n.hvac_action||"preheating"===n.hvac_action?h("flame"):"cooling"===n.hvac_action?h("snow"):"fan"===n.hvac_action?h("spin",{speed:1.5}):void 0;case"vacuum":return"cleaning"===i?h("drum",{speed:1.2}):void 0;case"sensor":return d.has(i)?h("drum",{speed:1.2}):void 0;case"binary_sensor":if("on"!==i)return;return"running"===o?h("drum",{speed:1.2}):c.has(o)?h("swing",{speed:0,intensity:.3}):l.has(o)?h("pulse",{color:r}):void 0;case"cover":return"opening"===i||"closing"===i?h("swing",{speed:1}):"open"===i?h("swing",{speed:0,intensity:.3}):void 0;case"lock":return"jammed"===i?h("shake"):"locking"===i||"unlocking"===i||"opening"===i?h("pulse"):void 0;case"media_player":return"playing"===i?h("eq"):void 0;case"alarm_control_panel":return"triggered"===i?h("pulse",{color:r}):void 0;case"siren":return"on"===i?h("pulse",{color:r}):void 0;default:return}}function g(e,t=e?.entity_id??""){const i=t.split(".")[0],n=String(e?.attributes?.device_class??"");switch(i){case"fan":return 447;case"light":return 224;case"climate":return 195;case"vacuum":return 166;case"sensor":return 168;case"binary_sensor":return"running"===n?167:c.has(n)?475:l.has(n)?370:void 0;case"cover":return 474;case"lock":return 419;case"media_player":return 182;case"alarm_control_panel":return 371;case"siren":return 370;default:return}}const f=new Set(["alarm_control_panel","automation","binary_sensor","camera","climate","cover","fan","humidifier","input_boolean","lawn_mower","light","lock","media_player","remote","script","siren","switch","timer","vacuum","valve","water_heater"]);function v(e,t){if("auto"===e)return m(t);if(!s.includes(e))return;if(function(e){if(!e||"string"!=typeof e.entity_id)return!1;if((0,o.Pd)(e))return!0;const t=e.entity_id.split(".")[0];return!!f.has(t)&&(!("climate"!==t||!["idle","off"].includes(String(e.attributes?.hvac_action)))||"media_player"===t&&"paused"===e.state||!(0,n.mu)(e))}(t))return;const i=e,a=m(t);return a?.anim===i?{...a,speed:a.speed>0?a.speed:1.5}:{anim:i,speed:1.5,intensity:1}}},5651(e,t,i){i.d(t,{Qh:()=>p});var n=i(851),o=i(3585),s=i(1174);const a={...s.t8,emptyOpacity:.25,angle:90,drawDuration:1.2,secondaryPct:40,stops:["#2196f3","#f44336"]},r=["up","down","left","right"],l=["solid","duotone","gradient","value"],c=["off","load","change","loop"],d=(e,t,i)=>t.includes(e)?e:i;function h(e){const t=e.trim();let i=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(i){const e=3===i[1].length?[...i[1]].map(e=>e+e).join(""):i[1];return{r:parseInt(e.slice(0,2),16),g:parseInt(e.slice(2,4),16),b:parseInt(e.slice(4,6),16)}}return i=/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(t),i?{r:+i[1],g:+i[2],b:+i[3]}:void 0}const u=e=>`rgb(${Math.round(e.r)}, ${Math.round(e.g)}, ${Math.round(e.b)})`;function p(e,t){const i=e&&"object"==typeof e?e:{},n=t.entity?t.hass?.states?.[t.entity]:void 0,p=i.colors&&"object"==typeof i.colors?i.colors:{},g=d(p.style,l,"solid"),f=(0,s.dU)(p.primary,n)??t.baseColor,v=i.fill||"value"===g?function(e,t){const i=e.fill&&"object"==typeof e.fill?e.fill:{},n=i.entity||t.entity;return(0,s.EN)(n?t.hass?.states?.[n]:void 0,i.attribute||void 0,i.min,i.max)}(i,t):void 0,b={style:g,primary:f,angle:(0,s.bu)(p.angle)??a.angle},y="string"==typeof p.secondary&&/%\s*$/.test(p.secondary)?(0,s.uM)(p.secondary):void 0,_=void 0!==y?(0,s.jh)(f,Math.round(100*y)):(0,s.dU)(p.secondary,n);if("duotone"===g?b.secondary=_??(0,s.jh)(f,a.secondaryPct):_&&(b.secondary=_),"gradient"===g||"value"===g){const e=(Array.isArray(p.gradient)?p.gradient:[]).map(e=>(0,s.dU)(e,n)).filter(e=>!!e);b.stops=e.length>=2?e:1===e.length?[e[0],e[0]]:[...a.stops],"value"===g&&(b.valueColor=void 0===v?b.stops[0]:function(e,t){if(!e.length)return"currentColor";const i=(0,s.qE)(Number.isFinite(t)?t:0,0,1)*(e.length-1),n=Math.min(Math.floor(i),e.length-2);if(1===e.length||n<0)return h(e[0])?u(h(e[0])):e[0];const o=i-n,a=h(e[n]),r=h(e[n+1]);return a&&r?u({r:a.r+(r.r-a.r)*o,g:a.g+(r.g-a.g)*o,b:a.b+(r.b-a.b)*o}):o<.5?e[n]:e[n+1]}(b.stops,v),void 0===v&&(b.valueMissing=!0))}const w={colors:b,draw:d(i.draw,c,"off"),drawDuration:m(i.draw_duration)??a.drawDuration,morph:!0===i.morph},$=(0,o.Qt)(i.device,n);if($&&(w.device=$),i.fill&&"object"==typeof i.fill){const e=i.fill,t=(0,s.uM)(e.empty_color),o=void 0===t?(0,s.dU)(e.empty_color,n):void 0;w.fill={level:v,color:(0,s.dU)(e.color,n)??b.valueColor??f,emptyOpacity:o?1:t??a.emptyOpacity,...o?{emptyColor:o}:{},wave:!1!==e.wave,direction:d(e.direction,r,"up")}}return w}function m(e){const t=(0,n.TD)(e);if(!t)return;const i=t.endsWith("ms")?parseFloat(t)/1e3:parseFloat(t);return i>0?i:void 0}i.d(t,["_T",0,a])},9219(e,t,i){i.d(t,{GC:()=>c,RQ:()=>d,bE:()=>l});var n=i(796);const o={short:{weekday:"short",month:"short",day:"numeric"},medium:{month:"short",day:"numeric",year:"numeric"},long:{weekday:"long",month:"long",day:"numeric",year:"numeric"},numeric:{year:"numeric",month:"numeric",day:"numeric"}},s=e=>Object.prototype.hasOwnProperty.call(o,e);function a(e,t,i){const o=(0,n.cj)(e),s=o?{...i,timeZone:o}:i,a=(0,n.XN)(e)??(new Intl.DateTimeFormat).resolvedOptions().locale;try{return new Intl.DateTimeFormat(`${a.split("-u-")[0]}-u-${t}`,s)}catch{return new Intl.DateTimeFormat(`en-u-${t}`,s)}}const r=/\[([^\]]*)\]|YYYY|YY|MMMM|MMM|MM|M|dddd|ddd|DD|D/g;function l(e){const t=(e??"").trim();return"full"===t?"long":s(t)||"iso"===t?t:-1===t.search(r)?"short":t}function c(e,t,i){const c=l(t);return s(c)?(0,n.LE)(i,o[c]).format(e):function(e,t,i){const n=function(e,t){const i={},n=a(t,"ca-gregory-nu-latn",{year:"numeric",month:"numeric",day:"numeric"});for(const t of n.formatToParts(e))i[t.type]=t.value;const o=i=>a(t,"ca-gregory",i).format(e),s=e=>String(Number(e)||0);return{year:s(i.year),month:s(i.month),day:s(i.day),weekdayLong:()=>o({weekday:"long"}),weekdayShort:()=>o({weekday:"short"}),monthLong:()=>o({month:"long"}),monthShort:()=>o({month:"short"})}}(e,i),o=e=>e.padStart(2,"0");return t.replace(r,(e,t)=>{if(void 0!==t)return t;switch(e){case"YYYY":return n.year;case"YY":return n.year.slice(-2);case"MMMM":return n.monthLong();case"MMM":return n.monthShort();case"MM":return o(n.month);case"M":return n.month;case"dddd":return n.weekdayLong();case"ddd":return n.weekdayShort();case"DD":return o(n.day);default:return n.day}})}(e,"iso"===c?"YYYY-MM-DD":c,i)}function d(e,t,i){const o=t.format_12h??(0,n.oE)(i),s={hour:o?"numeric":"2-digit",minute:"2-digit",hourCycle:o?"h12":"h23"};return t.show_seconds&&(s.second="2-digit"),(0,n.LE)(i,s).format(e)}i.d(t,["S1",0,s])},8199(e,t,i){i.d(t,{P7:()=>r,XZ:()=>a,a5:()=>l,fA:()=>s});const n={input_select:{"":{list:"options",service:"select_option",field:"option"}},select:{"":{list:"options",service:"select_option",field:"option"}},input_text:{"":{list:"",service:"set_value",field:"value"}},text:{"":{list:"",service:"set_value",field:"value"}},climate:{"":{list:"hvac_modes",service:"set_hvac_mode",field:"hvac_mode"},preset_mode:{current:"preset_mode",list:"preset_modes",service:"set_preset_mode",field:"preset_mode"},fan_mode:{current:"fan_mode",list:"fan_modes",service:"set_fan_mode",field:"fan_mode"},swing_mode:{current:"swing_mode",list:"swing_modes",service:"set_swing_mode",field:"swing_mode"}},fan:{preset_mode:{current:"preset_mode",list:"preset_modes",service:"set_preset_mode",field:"preset_mode"}},light:{effect:{current:"effect",list:"effect_list",service:"turn_on",field:"effect"}},media_player:{source:{current:"source",list:"source_list",service:"select_source",field:"source"},sound_mode:{current:"sound_mode",list:"sound_mode_list",service:"select_sound_mode",field:"sound_mode"}},water_heater:{operation_mode:{current:"operation_mode",list:"operation_list",service:"set_operation_mode",field:"operation_mode"}},humidifier:{mode:{current:"mode",list:"available_modes",service:"set_mode",field:"mode"}}},o={fan:"preset_mode",light:"effect",media_player:"source",water_heater:"operation_mode",humidifier:"mode"};function s(e,t){const i=n[e.entity_id.split(".")[0]];if(i)return t?i[t]:i[""]??i[o[e.entity_id.split(".")[0]]]}function a(e){return e?Object.keys(n[e.split(".")[0]]??{}).filter(Boolean):[]}function r(e,t,i){if(!e||!t)return[];if(!t.list)return i.map(e=>e.value);const n=e.attributes?.[t.list];return Array.isArray(n)?n.map(String):[]}function l(e){if(!Array.isArray(e))return[];const t=e.map(e=>"string"==typeof e||"number"==typeof e?{label:String(e),value:String(e)}:e&&"object"==typeof e?{label:String(e.label??e.value??""),value:String(e.value??e.label??"")}:void 0).filter(e=>!!e&&""!==e.value);return(e=>3===e.length&&e.every((e,t)=>e.label===`Option ${t+1}`&&e.value===`option_${t+1}`))(t)?[]:t}},1495(e,t,i){function n(e){const t=e.attributes?.effect_list;return Array.isArray(t)&&t.length>0&&!!(4&Number(e.attributes?.supported_features??4))}i.d(t,{Q:()=>n})},7264(e,t,i){function n(e,t){if(!e?.entity_id.startsWith("climate.")||t&&"temperature"!==t)return;const i=e.attributes||{},n="number"==typeof i.target_temp_low?i.target_temp_low:void 0,o="number"==typeof i.target_temp_high?i.target_temp_high:void 0;return void 0!==n&&void 0!==o&&"number"!=typeof i.temperature?[n,o]:void 0}i.d(t,{H:()=>n})},130(e,t,i){i.d(t,{e5:()=>b,uU:()=>p,wL:()=>v});var n=i(9207),o=i(8015),s=i(2502),a=i(2359),r=i(8967);const l=new Set(["icon_fx","icon_on","icon_off","svg","entity"]);function c(e,t,i){for(const n of["hidden","editor_name","entity","share_entity"]){if(!i.has(n))continue;const o=t[n];void 0===o?delete e[n]:e[n]=o}}const d=["use_page_theme","theme","background","background_image","border_radius","padding","border_width","border_style","border_color","opacity","backdrop_filter","margin","box_shadow","card_height","overflow","css","animations","ring","popup","flows","shape","value_background","seasonal","hover","background_layers"],h={shape:["shape_options"]},u=new Set(["type","template","not_synced","name","rows","display","conditional_appearance",...d,"custom_animations","custom_shapes","custom_icons",...Object.values(h).flat()]);function p(e){const t={};for(const[i,o]of Object.entries(e))u.has(i)||void 0===o||(t[i]=(0,n.G)(o));return t}function m(e,t){return"custom"===e.shape&&"custom"===t?.shape&&t.shape_options&&e.shape_options&&e.shape_options!==t.shape_options&&(e.shape_options=(0,r.S)(t.shape_options,e.shape_options)),e}const g=(e,t)=>m({...e,...t},e);function f(e,t,i=!0){const n=new Map,o=(e,t)=>{const i=new Set;for(const o of e){const e=String(o.id);i.has(e)||Array.isArray(t)&&t.includes(e)||n.set(e,o),i.add(e)}};return t.not_synced?.includes("custom_animations")||o((0,a.B)(e),i&&t.hidden_animations),o((0,a.B)(t.custom_animations)),n.size?[...n.values()]:void 0}function v(e,t,i=!0){if(!e.template||!t)return e;const n={...e,custom_animations:f(t,e,i)};return n.custom_animations||delete n.custom_animations,n}function b(e,t,i=!1){const a=(0,n.G)(e);delete a.entity,a.type=t.type,a.template=t.template;const r=new Set(t.not_synced||[]);r.size>0&&(a.not_synced=[...r]),Object.assign(a,p(t));for(const e of["custom_shapes","custom_icons"]){const o={...!i&&!r.has(e)&&a[e],...t[e]};Object.keys(o).length?Object.assign(a,{[e]:(0,n.G)(o)}):delete a[e]}const u=i?t.custom_animations:f(a.custom_animations,t);u?a.custom_animations=(0,n.G)(u):delete a.custom_animations;for(const i of d){const o=h[i];if(o){const s=[i,...o],l=t,c=a;if(!r.has(i)||!s.some(e=>void 0!==l[e]))continue;for(const e of s)void 0===l[e]?delete c[e]:c[e]=(0,n.G)(l[e]);m(c,e);continue}r.has(i)&&void 0!==t[i]&&(a[i]=(0,n.G)(t[i]))}const v=new Map,b=new Map,y=new Map;for(const e of t.rows||[]){e.id&&v.set(e.id,e);for(const t of e.columns||[]){t.id&&b.set(t.id,t);for(const e of t.modules||[])e.id&&y.set(e.id,e)}}const _=new Set((a.rows||[]).map(e=>e.id).filter(Boolean));a.rows=(a.rows||[]).map(e=>{const t=e.id?v.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);i.size>0&&(e.not_synced=[...i]),i.has("layout")&&void 0!==t.layout&&(e.layout=t.layout),i.has("column_widths")&&(void 0!==t.column_widths?e.column_widths=[...t.column_widths]:delete e.column_widths),i.has("design")&&t.design&&(e.design=g(e.design,t.design)),i.has("actions")&&(t.actions?e.actions=t.actions:delete e.actions),i.has("gap")&&void 0!==t.gap&&(e.gap=t.gap),i.has("padding")&&void 0!==t.padding&&(e.padding=t.padding),c(e,t,i)}const i=new Set((e.columns||[]).map(e=>e.id).filter(Boolean));if(e.columns=(e.columns||[]).map(e=>{const t=e.id?b.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);if(i.size>0&&(e.not_synced=[...i]),i.has("design")&&t.design&&(e.design=g(e.design,t.design)),i.has("gap")&&void 0!==t.gap&&(e.gap=t.gap),i.has("padding")&&void 0!==t.padding&&(e.padding=t.padding),i.has("vertical_align")&&void 0!==t.vertical_align&&(e.vertical_align=t.vertical_align),c(e,t,i),i.has("modules")&&Array.isArray(t.modules))return{...e,modules:(0,n.G)(t.modules)}}const i=new Set((e.modules||[]).map(e=>e.id).filter(Boolean));if(e.modules=(e.modules||[]).map(e=>{const t=e.id?y.get(e.id):void 0;if(t){const i=new Set(t.not_synced||[]);i.size>0&&(e.not_synced=[...i]),c(e,t,i);const a=["text","icon","entity","image","content","label","attribute","prefix","suffix","url","service","service_data","data","use_entity","entity_display","use_entity_icon","use_entity_color","icon_color","size","icon_fx","icon_on","icon_off","svg","animated_icons"];for(const o of a)i.has(o)&&void 0!==t[o]?e[o]=(0,n.G)(t[o]):i.has(o)&&l.has(o)&&delete e[o];const r=(0,s.us)(e);if(r&&i.has(r)&&void 0!==t[r]&&(e[r]=(0,n.G)(t[r])),t.design&&i.has("design"))e.design=g(e.design,t.design);else if(t.design){const n=t.design,s={...e.design||{}};let a=!1;for(const e of i){if(!e.startsWith("design."))continue;const t=(0,o.I7)(e.slice(7));if(!(t.length>1)||t.some(e=>void 0!==n[e]))for(const e of t)t.length>1&&delete s[e],void 0!==n[e]&&(s[e]=n[e]),a=!0}a&&(e.design=m(s,e.design))}t.actions&&(i.has("actions")||[...i].some(e=>e.startsWith("actions.")))&&(e.actions={...e.actions,...t.actions})}return e}),t)for(const o of t.modules||[])o.id&&!i.has(o.id)&&e.modules.push((0,n.G)(o));return e}),t)for(const o of t.columns||[])o.id&&!i.has(o.id)&&e.columns.push((0,n.G)(o));return e});for(const e of t.rows||[])e.id&&!_.has(e.id)&&a.rows.push((0,n.G)(e));return a}i.d(t,["lC",0,["grid_options","layout_options","visibility","view_layout"]])},993(e,t,i){i.d(t,{K:()=>s,k:()=>o});var n=i(6837);function o(e){let t=e;for(;t;){const e=t.getAttribute("dir")?.toLowerCase();if("rtl"===e||"ltr"===e)return e;t=t.parentElement??t.getRootNode().host??null}try{return"rtl"===getComputedStyle(document.documentElement).direction?"rtl":"ltr"}catch{return"ltr"}}class s{constructor(e){this.host=e,this.direction="ltr",this.reflected=!1,this.sync=()=>{const e=this.host;if(!this.reflected&&e.hasAttribute("dir"))return void this.set(o(e));this.reflected&&e.removeAttribute("dir");const t=o(e);this.reflected=!1,"rtl"===t&&(e.setAttribute("dir","rtl"),this.reflected=!0),this.set(t)},e.addController(this)}hostConnected(){window.addEventListener(n.i3,this.sync),"function"==typeof MutationObserver&&(this.observer=new MutationObserver(this.sync),this.observer.observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]})),this.sync()}hostDisconnected(){window.removeEventListener(n.i3,this.sync),this.observer?.disconnect(),this.observer=void 0,this.reflected&&(this.host.removeAttribute("dir"),this.reflected=!1)}set(e){e!==this.direction&&(this.direction=e,this.host.requestUpdate())}}},9125(e,t,i){i.d(t,{r:()=>c});var n=i(6161),o=i(1413),s=i(6020),a=i(993);const r=n.JW`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;function l(){try{return window.localStorage??null}catch{return null}}class c{constructor(e,t){this.host=e,this.restoredFrom="none",this.hidden=new Set,this.cols={},this._suspended=!1,this.remembered=null,this.hintDone=!1,this.statusText="",this.frame=0,this.onKeydown=e=>{this.handleKey(e)},this.editor=t.editor,this.panels=t.panels,this.strings=t.strings,this.keys=t.keys??"host",this.fallback=t.fallback,this.direction=new a.K(e),e.addController(this)}get dir(){return this.direction.direction}hostConnected(){this.host.setAttribute(s.vr,""),"host"===this.keys&&this.host.addEventListener("keydown",this.onKeydown,{capture:!0}),this.restore()}hostDisconnected(){this.host.removeAttribute(s.vr),this.host.removeEventListener("keydown",this.onKeydown,{capture:!0}),this.frame&&cancelAnimationFrame(this.frame),this.frame=0}restore(){this.remembered=null,this.direction.sync(),this.readMemory(),this.hintDone=this.readFlag(),this.host.requestUpdate()}setPanels(e,t){this.panels=e,this.strings=t,this.direction.sync(),this.host.requestUpdate()}columns(e){const t=new Set([...Object.keys(this.cols),...Object.keys(e)]);let i=!0;for(const n of t)Boolean(this.cols[n])!==Boolean(e[n])&&(i=!1);i||(this.cols={...e},this.host.requestUpdate())}get suspended(){return this._suspended}set suspended(e){e!==this._suspended&&(this._suspended=e,this.host.requestUpdate())}state(e){return!this._suspended&&this.cols[e]&&this.panels.some(t=>t.id===e)?this.hidden.has(e)?"hidden":"shown":"off"}isHidden(e){return"hidden"===this.state(e)}get active(){return!this._suspended&&this.panels.some(e=>this.cols[e.id])}toggle(e){this.remembered=null,this.apply([e],"shown"===this.state(e),"api")}show(e){this.remembered=null,this.apply([e],!1,"api")}hide(e){this.remembered=null,this.apply([e],!0,"api")}toggleAll(){const e=this.panels.map(e=>e.id).filter(e=>"off"!==this.state(e));if(!e.length)return!1;const t=e.filter(e=>!this.hidden.has(e));let i,n;if(t.length)this.remembered=t,i=t,n=!0;else{const t=(this.remembered??[]).filter(t=>e.includes(t));i=t.length?t:e,n=!1,this.remembered=null}return!!this.apply(i,n,"key")&&(this.announce(i,n),!0)}async reveal(e){"hidden"===this.state(e)&&(this.remembered=null,this.apply([e],!1,"reveal"),await this.host.updateComplete)}handleKey(e){if(e.defaultPrevented||!function(e){return(e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&!e.getModifierState?.("AltGraph")&&("\\"===e.key||"Backslash"===e.code)&&!e.repeat&&!e.isComposing}(e))return!1;const t=e.composedPath(),i=t.indexOf(this.host);for(let e=0;e<(i<0?t.length:i);e++){const i=t[e];if(i instanceof Element&&i.hasAttribute(s.vr))return!1}return e.preventDefault(),this.toggleAll(),!0}apply(e,t,i){const n=this.panels.map(e=>e.id).filter(i=>e.includes(i)&&"off"!==this.state(i)&&this.hidden.has(i)!==t);if(!n.length)return!1;const o=this.root()?.activeElement,a=t?n.filter(e=>{const t=this.panelEl(e);return!!t&&!!o&&t.contains(o)}):[];for(const e of n)t?this.hidden.add(e):this.hidden.delete(e);return t||this.dismissHint(),this.writeMemory(),this.host.requestUpdate(),a.length&&this.host.updateComplete.then(()=>this.lipEl(a[0])?.focus()),this.host.dispatchEvent(new CustomEvent(s.V8,{detail:{editor:this.editor,hidden:this.panels.map(e=>e.id).filter(e=>this.hidden.has(e)),cause:i}})),!0}announce(e,t){const i=this.panels.filter(t=>e.includes(t.id)).map(e=>e.noun),n=t?this.strings.hidden:this.strings.shown,o=this.strings.locale;let s;try{const e=new Intl.ListFormat(o,{type:"conjunction"}).format(i),t=n.replace("{panels}",()=>e);s=t.charAt(0).toLocaleUpperCase(o)+t.slice(1)}catch{const e=n.replace("{panels}",()=>i.join(", "));s=e.charAt(0).toUpperCase()+e.slice(1)}this.statusText="",this.host.requestUpdate(),this.frame&&cancelAnimationFrame(this.frame),this.frame=requestAnimationFrame(()=>{this.frame=0,this.statusText=s,this.host.requestUpdate()})}allowed(e){const t=new Set(s.Sw[this.editor]),i=new Set;for(const n of e)"string"==typeof n&&t.has(n)&&i.add(n);return i}readMemory(){let e;this.hidden=new Set,this.restoredFrom="none";try{const t=l();if(!t)return;e=t.getItem(s.QK+this.editor)}catch{return}if(null===e){let e;try{e=this.fallback?.()??null}catch{e=null}const t=this.allowed(e??[]);return void(t.size&&(this.hidden=t,this.restoredFrom="fallback",this.writeMemory()))}if("string"!=typeof e||e.length>64)return;const t=this.allowed(e.split(","));t.size&&(this.hidden=t,this.restoredFrom="stored")}writeMemory(){try{const e=l();if(!e)return;const t=s.QK+this.editor,i=s.Sw[this.editor].filter(e=>this.hidden.has(e));i.length?e.setItem(t,i.join(",")):e.removeItem(t)}catch{}}readFlag(){try{return"1"===l()?.getItem(s.UV+this.editor)}catch{return!1}}hintPanel(){if(!this.hintDone&&"none"!==this.restoredFrom)return this.panels.find(e=>"hidden"===this.state(e.id))}dismissHint(){if(!this.hintDone){this.hintDone=!0;try{l()?.setItem(s.UV+this.editor,"1")}catch{}}}closeHint(e){const t=this.root(),i=t?.getElementById(`${e.controls}-hint`),n=!!i&&!!t?.activeElement&&i.contains(t.activeElement);this.dismissHint(),this.host.requestUpdate(),n&&this.lipEl(e.id)?.focus()}onLipKey(e,t){"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this.closeHint(t))}hintTemplate(e){const t=this.panels.filter(e=>"hidden"===this.state(e.id)),i=this.strings,o="fallback"===this.restoredFrom?i.hintMigrated:1===t.length?i.hintOne.replace("{noun}",()=>t[0].noun):i.hintMany;return n.qy`<div class="lip-hint" id="${e.controls}-hint" data-side=${e.side} data-dir=${this.dir} @keydown=${t=>{"Escape"===t.key&&(t.preventDefault(),t.stopPropagation(),this.closeHint(e))}}> <p>${o}</p><p class="lip-hint-keys">${i.hintShortcut}</p><button type="button" @click=${()=>this.closeHint(e)}>${i.gotIt}</button></div>`}lip(e){const t=this.panels.find(t=>t.id===e);if(!t)return n.s6;const i=this.state(e);if("off"===i)return n.s6;const s="hidden"===i,a=this.hintPanel()?.id===e;return n.qy`<button type="button" class="lip" data-side=${t.side} data-dir=${this.dir} aria-expanded=${s?"false":"true"} aria-controls=${t.controls} aria-label=${t.name} title=${s?t.showLabel:t.hideLabel} aria-describedby=${(0,o.J)(a?`${t.controls}-hint`:void 0)} @click=${t=>{t.currentTarget?.focus(),this.remembered=null,this.apply([e],"shown"===this.state(e),"lip")}} @keydown=${a?e=>this.onLipKey(e,t):n.s6} >${r}</button>${a?this.hintTemplate(t):n.s6}`}status(){return n.qy`<div class="lip-status" role="status" aria-live="polite" aria-atomic="true">${this.statusText}</div>`}root(){return this.host.renderRoot??this.host.shadowRoot}panelEl(e){const t=this.panels.find(t=>t.id===e);return t?this.root()?.getElementById(t.controls)??null:null}lipEl(e){const t=this.panels.find(t=>t.id===e);if(!t)return null;for(const e of Array.from(this.root()?.querySelectorAll(".lip")??[]))if(e.getAttribute("aria-controls")===t.controls)return e;return null}}},5710(e,t,i){i.d(t,{Y:()=>a,n:()=>s});var n=i(993);const o={horizontal:["ArrowLeft","ArrowRight","Home","End"],vertical:["ArrowUp","ArrowDown","Home","End"],both:["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"]};function s(e,t,i,n="horizontal",s=!0,a=!1){if(!o[n].includes(e)||!i.length)return-1;const r=i.length,l=e=>e>=0&&e<r&&!i[e].disabled,c=(e,t)=>{for(let i=1;i<=r;i++){let n=e+t*i;if(s)n=(n+2*r)%r;else if(n<0||n>=r)return e;if(l(n))return n}return e};if("Home"===e)return l(0)?0:c(0,1);if("End"===e)return l(r-1)?r-1:c(r-1,-1);const d="ArrowUp"===e||e===(a?"ArrowRight":"ArrowLeft");return c(t<0?d?0:-1:t,d?-1:1)}class a{constructor(e){this.opts=e,this.onKeydown=e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const t=e.currentTarget,i=Array.from(t.querySelectorAll(this.opts.items)),o=i.indexOf(e.composedPath().find(e=>i.includes(e))),a=s(e.key,o,i.map(e=>({disabled:e.hasAttribute("disabled")})),this.opts.orientation,this.opts.wrap,"rtl"===(0,n.k)(t));a<0||(e.preventDefault(),e.stopPropagation(),this.focus(i,a),this.opts.onMove?.(i[a],a))}}focus(e,t){e.forEach((e,i)=>e.setAttribute("tabindex",i===t?"0":"-1")),e[t]?.focus()}}},9515(e,t,i){i.d(t,{S:()=>n});class n{constructor(e,t){this.host=e,this.onChange=t,this.width=0,this.watched=[],e.addController(this)}hostDisconnected(){this.observer?.disconnect(),this.observer=void 0,this.watched=[]}watch(e,...t){const i=[e,...t].filter(e=>!!e);if((i.length!==this.watched.length||i.some((e,t)=>e!==this.watched[t]))&&(this.observer?.disconnect(),this.watched=i,"undefined"!=typeof ResizeObserver)){this.observer=new ResizeObserver(()=>this.measure(e));for(const e of i)this.observer.observe(e)}this.measure(e)}measure(e){const t=e?function(e){let t;try{const i=getComputedStyle(e);t=(parseFloat(i.borderLeftWidth)||0)+(parseFloat(i.borderRightWidth)||0)}catch{t=0}return Math.max(0,Math.round(e.offsetWidth-e.clientWidth-t))}(e):0;t!==this.width&&(this.width=t,this.onChange?.(t),this.host.requestUpdate())}}},6081(e,t,i){var n=i(6161);const o=n.AH`:host{display:contents;font-family:var(--mc-font,inherit)}*,*::before,*::after{box-sizing:border-box}`,s=n.AH`${o} .menu{position:fixed;inset:auto;z-index:30;margin:0;min-width:240px;max-width:calc(100vw - 16px);padding:4px;overflow-y:auto;overscroll-behavior:contain;border:1px solid var(--mc-divider,rgba(0,0,0,.12));border-radius:var(--mc-radius-lg,12px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-float,0 4px 16px rgba(0,0,0,.2));font-size:.875rem;line-height:1.3}.item{display:flex;flex-wrap:wrap;align-items:center;gap:2px 12px;min-height:var(--mc-hit,40px);padding:0 12px;border-radius:var(--mc-radius,8px);cursor:pointer;outline:none}.item:hover{background:var(--mc-surface-2,#f2f3f5)}.item:focus-visible{background:var(--mc-surface-2,#f2f3f5);outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:-2px}.item.danger{color:var(--mc-error-ink,#b3261e)}.item[aria-disabled='true']{opacity:.6;cursor:default}.item[aria-disabled='true']:hover{background:transparent}.glyph{display:inline-flex;color:var(--mc-text-2,#5f6368)}.label{flex:1}.item:has(.sub-line){padding-block:6px}.sub-line{flex-basis:100%;font-size:.75rem;color:var(--mc-text-2,#5f6368)}.keys,.why{font-size:.75rem;color:var(--mc-text-2,#5f6368)}.keys{font-family:var(--mc-mono,ui-monospace,monospace)}.why{display:none;flex-basis:100%}.item:focus .why{display:block}.sep{height:1px;margin:4px 0;background:var(--mc-divider,rgba(0,0,0,.12))}@media (pointer:coarse){.item{min-height:var(--mc-hit,44px)}.keys{display:none}}`,a=n.AH`dialog{padding:0;border:0;border-radius:var(--mc-radius-xl,16px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-dialog,0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1));width:min(480px,calc(100vw - 32px));max-height:min(80vh,720px);overflow:hidden}dialog[open]{display:flex}dialog::backdrop{background:var(--mc-scrim,rgba(0,0,0,.38))}dialog.size-s{width:min(420px,calc(100vw - 32px))}dialog.size-m{width:min(480px,calc(100vw - 32px))}dialog.size-l{width:min(640px,calc(100vw - 32px))}dialog.size-xl{width:min(880px,calc(100vw - 32px))}.panel{display:grid;grid-template-rows:auto minmax(0,1fr) auto;width:100%;max-height:inherit}dialog.placed .panel{height:100%}.header{display:flex;align-items:center;gap:8px;padding:12px 12px 12px 20px;border-bottom:1px solid var(--mc-divider,rgba(0,0,0,.12))}.title{flex:1;min-width:0;margin:0;font-size:1rem;font-weight:500}.tool{display:inline-grid;place-items:center;width:32px;height:32px;padding:0;border:0;border-radius:var(--mc-radius,8px);background:transparent;color:var(--mc-text-2,#5f6368);cursor:pointer}.tool:hover{background:var(--mc-surface-2,#f2f3f5);color:var(--mc-text,#212121)}.tool:focus-visible{outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:1px}.tool:disabled{opacity:.45;cursor:not-allowed;background:transparent} .header.movable{padding-inline-start:8px;cursor:grab;touch-action:none;user-select:none}.header.movable:active{cursor:grabbing}.move{cursor:inherit;touch-action:none}.resize{position:absolute;inset-block-end:0;inset-inline-end:0;width:32px;height:32px;z-index:1;cursor:nwse-resize;touch-action:none;border-radius:var(--mc-radius,8px) 0 var(--mc-radius-xl,16px) 0}dialog.rtl .resize{cursor:nesw-resize;border-radius:0 var(--mc-radius,8px) 0 var(--mc-radius-xl,16px)}dialog.rtl .resize svg{transform:scaleX(-1)}.panel.sizable .footer{padding-inline-end:40px}.panel.sizable:not(.has-footer) .body{padding-bottom:36px}.body{min-height:0;padding:16px 20px;overflow:auto;overscroll-behavior:contain}.footer{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding:12px 16px;border-top:1px solid var(--mc-divider,rgba(0,0,0,.12))}.footer[hidden]{display:none} @media (max-width:599px){dialog.sheet{width:100vw;max-width:100vw;margin:auto 0 0;max-height:60vh;border-radius:var(--mc-radius-xl,16px) var(--mc-radius-xl,16px) 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}}@media (pointer:coarse){.tool{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}.panel.sizable .footer{padding-inline-end:52px}}@media (prefers-reduced-motion:reduce){*{transition-duration:0s !important;animation-duration:0s !important}}`,r=n.AH`${o}${a}`,l=n.AH`${o} .panel{position:fixed;inset:auto;z-index:30;margin:0;max-width:min(360px,calc(100vw - 16px));padding:12px;overflow:auto;overscroll-behavior:contain;border:1px solid var(--mc-divider,rgba(0,0,0,.12));border-radius:var(--mc-radius-lg,12px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);box-shadow:var(--mc-shadow-float,0 4px 16px rgba(0,0,0,.2))}`,c=n.AH`${o} .head{margin:0;font:inherit}.btn{display:flex;flex-wrap:wrap;align-items:center;gap:2px 10px;width:100%;min-height:var(--mc-hit,40px);padding:6px 4px;border:0;border-radius:var(--mc-radius,8px);background:transparent;color:var(--mc-text,#212121);font:inherit;font-weight:600;text-align:start;cursor:pointer}@media (hover:hover){.btn:hover{background:var(--mc-surface-2,#f2f3f5)}}.btn:focus-visible{outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:2px}.title{flex:0 0 auto;max-width:100%;overflow-wrap:anywhere}.sum{flex:1 1 8rem;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--mc-text-2,#5f6368);font-size:.8125rem;font-weight:400}.chev{flex:none;width:20px;height:20px;margin-inline-start:auto;color:var(--mc-text-2,#5f6368);transition:transform .15s ease-out}[aria-expanded='true'] .chev{transform:rotate(180deg)}.body{display:grid;gap:16px;padding:4px 4px 12px}.body[hidden]{display:none}@media (prefers-reduced-motion:reduce){.chev{transition:none}}`,d=n.AH`${o} .group{display:grid;gap:8px;padding:2px}.tile-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(104px,45%),1fr));gap:8px}.chip-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(88px,30%),1fr));gap:8px}.opt{display:grid;justify-items:center;align-content:start;gap:4px;min-width:0;min-height:44px;padding:8px 6px;border:1px solid var(--mc-divider,rgba(0,0,0,.12));border-radius:var(--mc-radius,8px);background:var(--mc-surface,#fff);color:var(--mc-text,#212121);font:inherit;font-size:.8125rem;line-height:1.25;text-align:center;overflow-wrap:anywhere;cursor:pointer}.chip-grid .opt{min-height:88px}@media (hover:hover){.opt:hover{border-color:var(--mc-field-border,#8a8f98)}}.opt[aria-pressed='true']{border-color:var(--mc-accent,#03a9f4);box-shadow:inset 0 0 0 1px var(--mc-accent,#03a9f4);background:var(--mc-accent-tint,#e6f4fb)}.opt:focus-visible{outline:2px solid var(--mc-focus,var(--mc-accent,#03a9f4));outline-offset:2px}.pv{display:grid;place-items:center;max-width:100%}.pv svg{max-width:100%;height:auto}.desc{margin:0;font-size:.8125rem;color:var(--mc-text-2,#5f6368)}@media (pointer:coarse){.opt{min-height:var(--mc-hit,44px)}.chip-grid .opt{min-height:88px}}`;i.d(t,["S8",0,r,"Uj",0,d,"bE",0,s,"dk",0,c,"u1",0,l])},515(e,t,i){var n=i(6161),o=i(261),s=i(8497);const a=n.AH`:host{--mc-hit-sm:32px;--mc-hit-xs:24px;--mc-radius-tag:6px;--mc-radius-seg:10px;--mc-radius-xl:16px;--mc-ease:.15s ease-out;--mc-shadow-dialog:0 24px 64px rgba(0,0,0,.22),0 4px 12px rgba(0,0,0,.1)}@media (pointer:coarse){:host{--mc-hit-sm:44px;--mc-hit-xs:44px}}`,r=n.AH`svg.gl{display:block;flex:none}.btn-danger{background:var(--mc-error-fill);color:var(--mc-on-accent)}.btn-danger:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-danger:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent)}.icon-btn[aria-pressed='true']{background:var(--mc-accent-tint);color:var(--mc-accent-ink)} .btn[aria-disabled='true'],.icon-btn[aria-disabled='true']{opacity:.45;cursor:not-allowed;box-shadow:none} .icon-btn.xs{width:var(--mc-hit-xs,24px);height:var(--mc-hit-xs,24px);border-radius:var(--mc-radius-tag,6px);gap:0;--mdc-icon-size:16px}@media (pointer:coarse){.icon-btn.xs{width:var(--mc-hit,44px);height:var(--mc-hit,44px)}}`,l=n.AH`.chip.is-error{color:var(--mc-error-ink);border-color:color-mix(in srgb,var(--mc-error-ink) 40%,transparent);background:var(--mc-error-tint)}`,c=n.AH`.notice{display:flex;align-items:flex-start;gap:10px;padding:10px 12px;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);font-size:.8125rem;color:var(--mc-text)}.notice>.gl,.notice>ha-icon{flex:none;--mdc-icon-size:20px}.notice .body{flex:1;min-width:0;display:grid;gap:6px}.notice .body p{margin:0}.notice .body strong{font-weight:500}.notice .actions{display:flex;flex-wrap:wrap;gap:8px}.notice.info{background:var(--mc-accent-tint);border-color:color-mix(in srgb,var(--mc-accent) 35%,transparent)}.notice.info>.gl,.notice.info>ha-icon{color:var(--mc-accent-ink)}.notice.success{background:var(--mc-success-tint);border-color:color-mix(in srgb,var(--mc-success-ink) 35%,transparent)}.notice.success>.gl,.notice.success>ha-icon{color:var(--mc-success-ink)}.notice.warn{background:var(--mc-warn-tint);border-color:color-mix(in srgb,var(--mc-warn-ink) 35%,transparent)}.notice.warn>.gl,.notice.warn>ha-icon{color:var(--mc-warn-ink)}.notice.error{background:var(--mc-error-tint);border-color:color-mix(in srgb,var(--mc-error-ink) 35%,transparent)}.notice.error>.gl,.notice.error>ha-icon{color:var(--mc-error-ink)}`,d=n.AH`.tiles{display:grid;grid-template-columns:repeat(auto-fill,minmax(116px,1fr));gap:8px;padding:2px}.tile{display:grid;justify-items:center;align-content:start;gap:4px;min-width:0;padding:8px 6px;border:1px solid var(--mc-divider);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font-size:.8125rem;text-align:center;transition:border-color .15s ease-out,background-color .15s ease-out}.tile:hover{border-color:color-mix(in srgb,var(--mc-accent) 60%,transparent)}.tile[aria-pressed='true'],.tile[aria-checked='true']{border-color:var(--mc-accent);background:var(--mc-accent-tint)}.tile .thumb{display:grid;place-items:center;width:100%;aspect-ratio:4 / 3;border-radius:6px;background:var(--mc-canvas);overflow:hidden}.tile .meta{font-size:.75rem;color:var(--mc-text-2)}.tile.glyph-only{min-height:56px;align-content:center}`,h=n.AH`.check{appearance:none;flex:none;width:20px;height:20px;margin:0;border:2px solid var(--mc-field-border);border-radius:5px;background:var(--mc-surface);display:inline-grid;place-items:center;cursor:pointer;transition:background-color .15s ease-out,border-color .15s ease-out}.check:checked,.check:indeterminate{border-color:var(--mc-accent-fill);background:var(--mc-accent-fill)}.check:checked::after{content:'';width:10px;height:5px;border:solid var(--mc-on-accent);border-width:0 0 2px 2px;transform:translateY(-1px) rotate(-45deg)}.check:indeterminate::after{content:'';width:10px;height:2px;background:var(--mc-on-accent)}.check:disabled{opacity:.45;cursor:not-allowed}`,u=n.AH`.toolbar{display:inline-flex;align-items:center;flex-wrap:wrap;gap:2px;padding:2px;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-seg,10px);background:var(--mc-surface);box-shadow:var(--mc-shadow-float)}.toolbar [role='separator']{align-self:stretch;width:1px;margin:4px;background:var(--mc-divider)} .rail{display:flex;flex-direction:column;align-items:center;gap:2px;width:56px;padding:8px 0;background:var(--mc-surface);border-right:1px solid var(--mc-divider);border-inline-width:0 1px;border-inline-style:solid;border-inline-color:var(--mc-divider);overflow-y:auto}.rail [role='separator'][aria-orientation='horizontal']{width:24px;height:1px;margin:4px 0;background:var(--mc-divider)} .toolbar .icon-btn,.rail .icon-btn{border-radius:var(--mc-radius)}.toolbar .icon-btn.sm{width:var(--mc-hit-sm,32px);height:var(--mc-hit-sm,32px)}.toolbar .btn-sm{border-color:transparent;background:transparent}.toolbar .btn-sm:hover{background:var(--mc-surface-2)}@media (max-width:799px){.rail{flex-direction:row;width:auto;border-right:0;border-inline:0;border-bottom:1px solid var(--mc-divider);padding:0 8px;overflow-x:auto}.rail [role='separator'][aria-orientation='horizontal']{width:1px;height:24px;margin:0 4px}}`,p=n.AH`.topbar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;min-height:56px;padding:8px 16px;background:var(--mc-surface);border-bottom:1px solid var(--mc-divider);position:relative;z-index:6}.topbar .title{min-width:0;margin:0;font-size:1rem;font-weight:500;overflow-wrap:anywhere}.topbar .name{width:180px;max-width:40vw;min-width:0}.topbar .spacer{flex:1}`,m=[a,r,l,c,d,h,u,p,n.AH`.sector-head{margin:0;font-size:inherit;font-weight:inherit}.sector-head>.sector-btn{border-radius:var(--mc-radius-lg);font-size:.875rem}.group-head h4{margin:0;font-size:.875rem;font-weight:500;flex:1}`,o.B,s.W];i.d(t,["DG",0,c,"Oj",0,m,"ZN",0,p])},8094(e,t,i){i.d(t,{DG:()=>o.DG,Oj:()=>o.Oj,ah:()=>n.a});var n=i(802),o=i(515);i(6081),i(877),i(8497),i(261),i(2311),i(3992)},6971(e,t,i){var n=i(6161);const o=(0,n.iz)(":is(.mc-field, .mc-act-field, .mc-cond-field) :is(input, select, textarea):not([type='checkbox']):not([type='color']):not([type='range']):not([type='radio'])"),s=n.AH`.mc-tab-content{display:grid;gap:16px}.mc-field{display:grid;gap:6px;min-width:0}.mc-field-label,.mc-field>label,.mc-input-label{display:flex;align-items:center;gap:8px;min-height:24px;font-size:.8125rem;font-weight:500;color:var(--mc-text);text-transform:none;letter-spacing:normal}.mc-field-hint,.mc-mode-help{font-size:.75rem;font-style:normal;color:var(--mc-text-2)} ${o},.mc-input-field.mc-input-field{width:100%;min-height:40px;margin:0;padding:8px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font:inherit;font-size:.875rem;line-height:1.4;outline:none;box-shadow:none;transition:border-color .15s ease-out,box-shadow .15s ease-out}${o}::placeholder,.mc-input-field.mc-input-field::placeholder{color:var(--mc-text-2);opacity:1}${o}:hover,.mc-input-field.mc-input-field:hover{border-color:var(--mc-text-2)}${o}:focus,.mc-input-field.mc-input-field:focus{outline:none;border-color:var(--mc-focus);box-shadow:0 0 0 1px var(--mc-focus)}${o}:disabled{background:var(--mc-surface-2);color:var(--mc-text-2);cursor:not-allowed}${o}.mono{font-family:var(--mc-mono);font-size:.8125rem} ${o}:is(select):not([multiple]):not([size]){appearance:none;-webkit-appearance:none;padding-right:36px;padding-inline:12px 36px;cursor:pointer}${o}:is(select):not(.input):not([multiple]):not([size]){background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%238b919a' d='M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42Z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;background-size:18px 18px}:host([dir='rtl']) ${o}:is(select):not(.input):not([multiple]):not([size]),[dir='rtl'] ${o}:is(select):not(.input):not([multiple]):not([size]){background-position:left 10px center} ${o}:is(textarea){resize:vertical;min-height:88px;line-height:1.5;font-family:var(--mc-mono);font-size:.8125rem} .mc-section{display:grid;gap:16px}.mc-section + .mc-section{padding-top:20px;border-top:1px solid var(--mc-divider)}.mc-section-header{display:flex;align-items:center;gap:8px;margin:0;padding:0;border:0;font-size:.875rem;font-weight:500;color:var(--mc-text)} .mc-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 16px;border-radius:var(--mc-radius);border:1px solid transparent;font-size:.875rem;font-weight:500;white-space:nowrap;filter:none;transform:none;transition:background-color .15s ease-out,border-color .15s ease-out,box-shadow .15s ease-out;--mdc-icon-size:18px}.mc-btn-primary{background:var(--mc-accent-fill);border-color:transparent;color:var(--mc-on-accent)}.mc-btn-primary:hover{filter:none;box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.mc-btn-primary:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.mc-btn-secondary{background:var(--mc-surface);border:1px solid var(--mc-field-border);color:var(--mc-text)}.mc-btn-secondary:hover{background:var(--mc-surface-2)}.mc-btn-small{min-height:32px;padding:0 12px;font-size:.8125rem}.mc-btn-icon{display:inline-grid;place-items:center;width:32px;height:32px;flex:none;padding:0;border:0;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text-2);--mdc-icon-size:18px}.mc-btn-icon:hover:not(:disabled){background:var(--mc-surface-2);color:var(--mc-text)}:is(.mc-btn,.mc-btn-primary,.mc-btn-secondary,.mc-btn-icon):active{opacity:1;transform:none}:is(.mc-btn,.mc-btn-primary,.mc-btn-secondary,.mc-btn-icon):disabled{opacity:.45;cursor:not-allowed;box-shadow:none}:is(.mc-btn,.mc-btn-primary,.mc-btn-secondary,.mc-btn-icon):focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px} .mc-conditions-list{display:grid;gap:12px;margin:0}.mc-condition-item{position:relative;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);padding:12px;display:grid;gap:12px} .mc-tabs-header{display:flex;width:100%;align-items:stretch;gap:2px;padding:3px;margin:0;background:var(--mc-surface-2);border:1px solid var(--mc-divider);border-radius:10px;max-width:100%;overflow-x:auto;scrollbar-width:none}.mc-tab-button{flex:1 0 auto;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;padding:0 10px;border:0;border-radius:7px;background:transparent;white-space:nowrap;font-size:.8125rem;font-weight:500;color:var(--mc-text-2);box-shadow:none;transition:background-color .15s ease-out,color .15s ease-out;--mdc-icon-size:18px}.mc-tab-button:hover{color:var(--mc-text);background:color-mix(in srgb,var(--mc-surface) 55%,transparent)}.mc-tab-button.active,.mc-tab-button[aria-selected='true']{background:var(--mc-surface);color:var(--mc-accent-ink);box-shadow:0 0 0 1px var(--mc-divider),0 1px 2px rgba(0,0,0,.08)}.mc-tab-button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-2px}`;i.d(t,["$",0,s])},2311(e,t,i){const n=i(6161).AH`.lip{position:absolute;z-index:var(--mc-lip-z,4);top:var(--mc-lip-top,50%);transform:translateY(-50%);box-sizing:border-box;display:grid;place-items:center;width:28px;height:72px;margin:0;padding:0;border:1px solid var(--mc-text-2);background:var(--mc-surface);color:var(--mc-text-2);font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:left var(--mc-lip-ms,200ms) ease,right var(--mc-lip-ms,200ms) ease}.lip svg{width:18px;height:18px;pointer-events:none}.lip[aria-expanded='false']{border-color:var(--mc-text-2);background:var(--mc-accent-fill);color:var(--mc-on-accent)} .lip[data-side='start']{left:var(--mc-lip-at-start,0);right:auto;inset-inline:var(--mc-lip-at-start,0) auto;border-left-width:0;border-inline-width:0 1px;border-radius:0 8px 8px 0}.lip[data-side='start'][data-dir='rtl']{border-radius:8px 0 0 8px}.lip[data-side='end']{right:var(--mc-lip-at-end,0);left:auto;inset-inline:auto var(--mc-lip-at-end,0);border-right-width:0;border-inline-width:1px 0;border-radius:8px 0 0 8px}.lip[data-side='end'][data-dir='rtl']{border-radius:0 8px 8px 0} .lip[data-side='start'][aria-expanded='true'] svg,.lip[data-side='end'][aria-expanded='false'] svg{transform:scaleX(-1)}.lip[data-side='start'][aria-expanded='true'][data-dir='rtl'] svg,.lip[data-side='end'][aria-expanded='false'][data-dir='rtl'] svg{transform:none}.lip[data-side='start'][aria-expanded='false'][data-dir='rtl'] svg,.lip[data-side='end'][aria-expanded='true'][data-dir='rtl'] svg{transform:scaleX(-1)} .lip:focus{outline:2px solid var(--mc-focus);outline-offset:-3px}.lip:focus:not(:focus-visible){outline:none}.lip:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-3px}.lip[aria-expanded='false']:focus{outline:2px solid var(--mc-on-accent);outline-offset:-4px}.lip[aria-expanded='false']:focus:not(:focus-visible){outline:none}.lip[aria-expanded='false']:focus-visible{outline:2px solid var(--mc-on-accent);outline-offset:-4px}@media (hover:hover){.lip:hover{background:var(--mc-surface-2);border-color:var(--mc-text);color:var(--mc-text)}.lip[aria-expanded='false']:hover{background:var(--mc-accent-fill);border-color:var(--mc-text-2);color:var(--mc-on-accent);box-shadow:inset 0 0 0 100vmax rgba(0,0,0,.15)}}.lip:active{background:var(--mc-accent-tint);color:var(--mc-accent-ink)}.lip[aria-expanded='false']:active{background:var(--mc-accent-fill);color:var(--mc-on-accent);box-shadow:inset 0 0 0 100vmax rgba(0,0,0,.15)} @media (pointer:coarse){.lip::after{content:'';position:absolute;top:50%;height:72px;transform:translateY(-50%)}.lip[data-side='start']::after{left:100%;right:auto;inset-inline:100% auto;width:17px}.lip[data-side='end']::after{right:100%;left:auto;inset-inline:auto 100%;width:17px}.lip[aria-expanded='false']::after{width:calc(17px + var(--mc-lip-pull,0px))} .lip[aria-expanded='false'][data-side='start']{left:calc(var(--mc-lip-at-start,0px) + var(--mc-lip-edge-gap,0px));right:auto;inset-inline:calc(var(--mc-lip-at-start,0px) + var(--mc-lip-edge-gap,0px)) auto}.lip[aria-expanded='false'][data-side='end']{right:calc(var(--mc-lip-at-end,0px) + var(--mc-lip-edge-gap,0px));left:auto;inset-inline:auto calc(var(--mc-lip-at-end,0px) + var(--mc-lip-edge-gap,0px))}} [data-lip]{transition:transform var(--mc-lip-ms,200ms) ease,visibility 0s linear 0s}[data-lip='hidden']{visibility:hidden;pointer-events:none;transform:translateX(var(--mc-lip-off,0px));transition:transform var(--mc-lip-ms,200ms) ease,visibility 0s linear var(--mc-lip-ms,200ms)}[data-lip='hidden'][data-dir='rtl']{transform:translateX(calc(-1 * var(--mc-lip-off,0px)))}@media (prefers-reduced-motion:reduce){[data-lip],[data-lip='hidden'],.lip{transition:none}} .lip-hint{position:absolute;z-index:var(--mc-lip-z,4);top:var(--mc-lip-top,50%);transform:translateY(-50%);box-sizing:border-box;width:max-content;max-width:min(260px,var(--mc-lip-hint-max,260px));padding:12px;border:1px solid var(--mc-text-2);border-radius:var(--mc-radius,8px);background:var(--mc-surface);color:var(--mc-text);box-shadow:var(--mc-shadow-float);font-size:.8125rem;line-height:1.4;animation:lip-hint-in 160ms ease-out;transition:left var(--mc-lip-ms,200ms) ease,right var(--mc-lip-ms,200ms) ease}.lip-hint p{margin:0 0 8px}.lip-hint .lip-hint-keys{color:var(--mc-text-2)}@media (hover:none){.lip-hint .lip-hint-keys{display:none}}.lip-hint button{min-height:var(--mc-hit,40px);padding:0 12px;border:1px solid var(--mc-text-2);border-radius:var(--mc-radius,8px);background:var(--mc-surface);color:var(--mc-text);font:inherit;cursor:pointer}.lip-hint button:focus{outline:2px solid var(--mc-focus);outline-offset:2px}.lip-hint button:focus:not(:focus-visible){outline:none}.lip-hint button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px}@media (pointer:coarse){.lip-hint button{min-height:44px}} .lip-hint::before{content:'';position:absolute;top:50%;width:10px;height:10px;margin-top:-5px;border:1px solid var(--mc-text-2);background:var(--mc-surface)}.lip-hint[data-side='start']{left:calc(var(--mc-lip-at-start,0px) + 36px);right:auto;inset-inline:calc(var(--mc-lip-at-start,0px) + 36px) auto}.lip-hint[data-side='start']::before{left:-6px;right:auto;inset-inline:-6px auto;border-width:0 0 1px 1px;transform:rotate(45deg)}.lip-hint[data-side='end']{right:calc(var(--mc-lip-at-end,0px) + 36px);left:auto;inset-inline:auto calc(var(--mc-lip-at-end,0px) + 36px)}.lip-hint[data-side='end']::before{right:-6px;left:auto;inset-inline:auto -6px;border-width:1px 1px 0 0;transform:rotate(45deg)}.lip-hint[data-side='start'][data-dir='rtl']::before{border-width:1px 1px 0 0}.lip-hint[data-side='end'][data-dir='rtl']::before{border-width:0 0 1px 1px}@keyframes lip-hint-in{from{opacity:0}to{opacity:1}}@media (prefers-reduced-motion:reduce){.lip-hint{animation:none;transition:none}} .lip-status{position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap}`;i.d(t,["g",0,n])},802(e,t,i){const n=i(6161).AH`*,*::before,*::after{box-sizing:border-box}::selection{background:var(--mc-accent-tint);color:var(--mc-text)}  .k-module{--k:var(--mc-sel-module);--k-fill:var(--mc-sel-module-fill);--k-ink:var(--mc-sel-module-ink);--k-tint:var(--mc-sel-module-tint)}.k-column{--k:var(--mc-sel-col);--k-fill:var(--mc-sel-col-fill);--k-ink:var(--mc-sel-col-ink);--k-tint:var(--mc-sel-col-tint)}.k-row{--k:var(--mc-sel-row);--k-fill:var(--mc-sel-row-fill);--k-ink:var(--mc-sel-row-ink);--k-tint:var(--mc-sel-row-tint)}.k-card{--k:var(--mc-sel-card);--k-fill:var(--mc-sel-card-fill);--k-ink:var(--mc-sel-card-ink);--k-tint:var(--mc-sel-card-tint)}*{scrollbar-width:thin;scrollbar-color:var(--mc-field-border) transparent}::-webkit-scrollbar{width:10px;height:10px}::-webkit-scrollbar-thumb{background:var(--mc-divider);border-radius:9999px;border:2px solid transparent;background-clip:padding-box}::-webkit-scrollbar-thumb:hover{background-color:var(--mc-field-border)}button,input,select,textarea{font:inherit;color:inherit}button{cursor:pointer}:focus-visible{outline:2px solid var(--mc-focus);outline-offset:2px}.mono{font-family:var(--mc-mono);font-size:.8125rem}[hidden]{display:none !important}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap} .seg{display:inline-flex;align-items:stretch;gap:2px;padding:3px;background:var(--mc-surface-2);border:1px solid var(--mc-divider);border-radius:10px;max-width:100%;overflow-x:auto;scrollbar-width:none}.seg::-webkit-scrollbar{display:none}.seg.full{display:flex;width:100%}.seg.full>button{flex:1 0 auto;justify-content:center}.seg>button{display:inline-flex;align-items:center;gap:6px;min-height:32px;padding:0 10px;border:0;border-radius:7px;background:transparent;white-space:nowrap;font-size:.8125rem;font-weight:500;color:var(--mc-text-2);transition:background-color .15s ease-out,color .15s ease-out}.seg>button ha-icon{--mdc-icon-size:18px}.seg>button:hover{color:var(--mc-text);background:color-mix(in srgb,var(--mc-surface) 55%,transparent)}.seg>button[aria-selected='true'],.seg>button[aria-checked='true'],.seg>button.active{background:var(--mc-surface);color:var(--mc-accent-ink);box-shadow:0 0 0 1px var(--mc-divider),0 1px 2px rgba(0,0,0,.08)}.seg>button:focus-visible{outline-offset:-2px} .layout-glyph{display:inline-grid;gap:2px;width:28px;height:14px;flex:none}.layout-glyph i{display:block;min-width:2px;border-radius:2px;background:currentColor;opacity:.45}.seg>button[aria-checked='true'] .layout-glyph i{opacity:.85} .chip{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 10px;border-radius:9999px;border:1px solid var(--mc-divider);background:var(--mc-surface);font-size:.75rem;font-weight:500;line-height:1;color:var(--mc-text-2);white-space:nowrap}.chip ha-icon{--mdc-icon-size:14px}button.chip{min-height:28px}button.chip:hover{border-color:var(--mc-field-border);color:var(--mc-text)}.chip.is-accent{color:var(--mc-accent-ink);border-color:color-mix(in srgb,var(--mc-accent) 45%,transparent);background:var(--mc-accent-tint)}.chip.is-warn{color:var(--mc-warn-ink);border-color:color-mix(in srgb,var(--mc-warn-ink) 40%,transparent);background:var(--mc-warn-tint)}.chip.is-count{min-height:20px;padding:0 8px} .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:0 16px;border-radius:var(--mc-radius);border:1px solid transparent;font-size:.875rem;font-weight:500;white-space:nowrap;transition:background-color .15s ease-out,border-color .15s ease-out,box-shadow .15s ease-out}.btn ha-icon{--mdc-icon-size:18px}.btn-primary{background:var(--mc-accent-fill);color:var(--mc-on-accent)}.btn-primary:hover{box-shadow:inset 0 0 0 999px rgba(255,255,255,.1)}.btn-primary:active{box-shadow:inset 0 0 0 999px rgba(0,0,0,.1)}.btn-secondary{background:var(--mc-surface);border-color:var(--mc-field-border);color:var(--mc-text)}.btn-secondary:hover{background:var(--mc-surface-2)}.btn-text{background:transparent;color:var(--mc-accent-ink);padding:0 12px}.btn-text:hover{background:var(--mc-accent-tint)}.btn-sm{min-height:32px;padding:0 12px;font-size:.8125rem}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:not-allowed;box-shadow:none}.icon-btn{display:inline-grid;place-items:center;width:40px;height:40px;flex:none;padding:0;border:0;border-radius:var(--mc-radius);background:transparent;color:var(--mc-text-2);--mdc-icon-size:20px}.icon-btn:hover:not(:disabled){background:var(--mc-surface-2);color:var(--mc-text)}.icon-btn.sm{width:32px;height:32px;--mdc-icon-size:18px}.icon-btn.danger:hover:not(:disabled){color:var(--mc-error-ink)} .field{display:grid;gap:6px;min-width:0}.field-head{display:flex;align-items:center;gap:8px;min-height:24px}.field-head label,.field-head .lbl{font-size:.8125rem;font-weight:500;color:var(--mc-text);flex:1;min-width:0} .field-reset{margin:-4px -6px -4px 0}.help{margin:0;font-size:.75rem;color:var(--mc-text-2)}.help.error{color:var(--mc-error-ink)}.help.lead{font-size:.875rem}.input{width:100%;min-height:40px;margin:0;padding:8px 12px;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:var(--mc-surface);color:var(--mc-text);font-size:.875rem;font-weight:400;line-height:1.4;transition:border-color .15s ease-out,box-shadow .15s ease-out}.input::placeholder{color:var(--mc-text-2);opacity:1}.input:hover{border-color:var(--mc-text-2)}.input:focus{outline:none;border-color:var(--mc-focus);box-shadow:0 0 0 1px var(--mc-focus)}.input:disabled{background:var(--mc-surface-2);color:var(--mc-text-2);cursor:not-allowed} .input[aria-invalid='true']{border-color:var(--mc-error-ink)}.input[aria-invalid='true']:focus{box-shadow:0 0 0 1px var(--mc-error-ink)}textarea.input{resize:vertical;min-height:88px;line-height:1.5;font-family:var(--mc-mono);font-size:.8125rem}.input.mono{font-family:var(--mc-mono);font-size:.8125rem}.with-icon{position:relative}.with-icon>ha-icon{position:absolute;left:12px;inset-inline:12px auto;top:50%;transform:translateY(-50%);--mdc-icon-size:18px;color:var(--mc-text-2);pointer-events:none}.with-icon>.input{padding-left:40px;padding-inline:40px 12px} .with-action>.input{padding-right:44px;padding-inline:12px 44px}.with-icon.with-action>.input{padding-inline:40px 44px}.with-icon>.field-action{position:absolute;right:4px;inset-inline:auto 4px;top:50%;transform:translateY(-50%)}.with-icon + .entity-meta{margin:6px 0 0}.select{position:relative;display:block;min-width:0}.select select{appearance:none;-webkit-appearance:none;padding-right:36px;padding-inline:12px 36px;cursor:pointer}.select>ha-icon{position:absolute;right:10px;inset-inline:auto 10px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--mc-text-2);--mdc-icon-size:18px}.unit{display:flex;min-width:0;direction:ltr;}.unit>.input{flex:1 1 auto;min-width:7ch;border-radius:var(--mc-radius) 0 0 var(--mc-radius)}.unit>.select{flex:none;width:76px}.unit>.select select{border-radius:0 var(--mc-radius) var(--mc-radius) 0;margin-left:-1px;margin-inline:-1px 0;padding-left:10px;padding-inline:10px 36px}.unit>.input:focus,.unit>.select select:focus{position:relative;z-index:1}.color{display:flex;gap:8px;align-items:center;min-width:0}.color .input{flex:1;min-width:0}.swatch{flex:none;width:40px;height:40px;padding:0;border:1px solid var(--mc-field-border);border-radius:var(--mc-radius);background:none;cursor:pointer}.box-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.box-side{display:grid;gap:4px;min-width:0}.box-side-label{display:flex;align-items:center;gap:4px;font-size:.75rem;color:var(--mc-text-2);--mdc-icon-size:16px}.box-foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px}.box-foot .select{width:96px}.switch-row{display:flex;align-items:center;gap:12px;min-height:40px}.switch-row .txt{flex:1;min-width:0;font-size:.8125rem;font-weight:500}.switch-row .txt .help{margin-top:2px;font-weight:400}.switch{position:relative;flex:none;width:40px;height:24px;border-radius:9999px;border:0;padding:0;background:var(--mc-field-border);transition:background-color .15s ease-out}.switch::after{content:'';position:absolute;top:3px;left:3px;inset-inline:3px auto;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .15s ease-out,inset-inline-start .15s ease-out;box-shadow:0 1px 2px rgba(0,0,0,.3)}.switch[aria-checked='true']{background:var(--mc-accent-fill)}.switch[aria-checked='true']::after{left:19px;inset-inline:19px auto}.switch:disabled{opacity:.45;cursor:not-allowed}.sync{display:inline-flex;align-items:center;gap:4px;min-height:24px;padding:0 6px;border:0;border-radius:6px;background:transparent;color:var(--mc-text-2);font-size:.75rem;font-weight:500;white-space:nowrap;--mdc-icon-size:16px}.sync:hover{background:var(--mc-surface-2);color:var(--mc-text)}.sync.is-over{color:var(--mc-warn-ink)}.sync.is-over:hover{background:var(--mc-warn-tint);color:var(--mc-warn-ink)}.entity-meta{display:flex;align-items:center;gap:6px;font-size:.75rem;color:var(--mc-text-2)}.entity-meta .dot,.dot{width:8px;height:8px;border-radius:50%;background:var(--mc-success);flex:none} .group{display:grid;gap:16px}.group + .group{padding-top:20px;border-top:1px solid var(--mc-divider)}.group-head{display:flex;align-items:center;gap:8px;--mdc-icon-size:18px}.group-head>ha-icon{color:var(--mc-text-2)}.group-head h3{margin:0;font-size:.875rem;font-weight:500;flex:1}.cond{border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);padding:12px;display:grid;gap:12px}.cond-head{display:flex;align-items:center;gap:8px}.cond-head .n{font-size:.8125rem;font-weight:500;flex:1;min-width:0}.cond-head .n .sub{color:var(--mc-text-2);font-weight:400} .range-list{display:grid;gap:12px}.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:16px 12px}.empty{display:grid;justify-items:center;text-align:center;gap:8px;padding:24px 16px;border:1px dashed var(--mc-divider);border-radius:var(--mc-radius-lg)}.empty>ha-icon{--mdc-icon-size:28px;color:var(--mc-text-2)}.empty strong{font-weight:500}.empty p{margin:0;color:var(--mc-text-2);font-size:.8125rem;max-width:32ch}.sectors{display:grid;border:1px solid var(--mc-divider);border-radius:var(--mc-radius-lg);overflow:hidden}.sector + .sector{border-top:1px solid var(--mc-divider)}.sector-btn{width:100%;display:flex;align-items:center;gap:10px;min-height:48px;padding:8px 12px;border:0;background:transparent;text-align:start}.sector-btn:hover{background:var(--mc-surface-2)}.sector-btn:focus-visible{outline-offset:-2px}.sector-btn>ha-icon:first-child{--mdc-icon-size:18px;color:var(--mc-text-2)}.sector-btn .nm{flex:1;min-width:0;font-weight:500}.sector-btn .chev{--mdc-icon-size:20px;color:var(--mc-text-2);transition:transform .15s ease-out}.sector-btn[aria-expanded='true'] .chev{transform:rotate(180deg)}.sector-body{padding:4px 12px 16px;display:grid;gap:16px}.no-results{color:var(--mc-text-2);font-size:.8125rem;padding:12px} .menu{position:absolute;z-index:30;min-width:240px;padding:6px;border-radius:var(--mc-radius-lg);background:var(--mc-surface);border:1px solid var(--mc-divider);box-shadow:var(--mc-shadow-float);display:grid} .menu[popover]{position:fixed;inset:auto;margin:0;color:var(--mc-text);overflow:auto;overscroll-behavior:contain;box-sizing:border-box}.menu button{display:flex;align-items:center;gap:12px;min-height:40px;padding:0 12px;border:0;border-radius:var(--mc-radius);background:transparent;text-align:start}.menu button:hover,.menu button:focus-visible{background:var(--mc-surface-2);outline:none}.menu button:focus-visible{outline:2px solid var(--mc-focus);outline-offset:-2px}.menu button:disabled{opacity:.45;cursor:not-allowed;background:transparent}.menu button.danger,.menu button.danger ha-icon{color:var(--mc-error-ink)}.menu button ha-icon{--mdc-icon-size:18px;color:var(--mc-text-2)}.menu .menu-note{font-size:.75rem;color:var(--mc-text-2);padding:6px 12px 8px}.menu hr{border:0;border-top:1px solid var(--mc-divider);margin:4px 0}@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:0s !important;animation-duration:0s !important}}`;i.d(t,["a",0,n])},261(e,t,i){const n=i(6161).AH`.rows{display:grid;gap:2px;margin:0;padding:0;list-style:none}.row{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;min-height:var(--mc-hit,40px);padding:2px 4px 2px calc(8px + var(--lvl,0) * 16px);border-radius:var(--mc-radius,8px);color:var(--mc-text);font-size:.875rem;transition:background-color var(--mc-ease,.15s ease-out)}.row:hover{background:var(--mc-surface-2)}.row.selected,.row[aria-selected='true']{background:var(--mc-accent-tint)}.row .grip,.row>.gl,.row>ha-icon{flex:none;display:inline-flex;color:var(--mc-text-2);--mdc-icon-size:18px}.row .grip{cursor:grab}.row .name{flex:1 1 120px;min-width:0;margin:0;padding:0;border:0;background:none;color:inherit;font:inherit;text-align:start;overflow-wrap:anywhere;cursor:pointer}.row .name small{display:block;font-family:var(--mc-mono);font-size:.75rem;color:var(--mc-text-2)}.row .input{flex:1 1 140px;width:auto;min-width:0}.row .acts{display:flex;align-items:center;gap:2px;margin-inline-start:auto}.row .help{flex:1 1 100%}`;i.d(t,["B",0,n])},3992(e,t,i){i.d(t,{E:()=>s});var n=i(6161);const o=n.AH`:host([dir='rtl']) .gl[data-dir='mirror']{transform:scaleX(-1)}:host .mono,:host textarea.mono,:host input.mono,:host code,:host pre{direction:ltr;unicode-bidi:isolate}`;function s(e,t,i){const[o,s]="inset"===e?["left","right"]:[`${e}-left`,`${e}-right`],a="inset"===e?"inset-inline":`${e}-inline`;return(0,n.iz)(`${o}:${t};${s}:${i};${a}:${t} ${i};`)}i.d(t,["a",0,o])},8497(e,t,i){const n=i(6161).AH`.slider-row{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}.slider-row>label{flex:0 0 auto;min-width:48px;font-size:.8125rem;font-weight:500;color:var(--mc-text)}.slider-row>input[type='range']{flex:1 1 120px;min-width:0}.slider-row>.input{flex:0 0 64px;width:64px;min-width:0}@container (max-width:239px){.slider-row{flex-direction:column;align-items:stretch}.slider-row>.input{flex-basis:auto;width:100%}}`;i.d(t,["W",0,n])},877(e,t,i){const n=i(6161).AH`.toast{position:fixed;inset:auto;left:50%; bottom:calc(var(--mc-toast-offset,16px) + env(safe-area-inset-bottom,0px));transform:translateX(-50%);margin:0;display:flex;align-items:center;gap:12px;width:max-content;max-width:min(520px,calc(100vw - 32px));padding:10px 10px 10px 16px;padding-inline:16px 10px;border:0;border-radius:var(--mc-radius,8px);background:var(--mc-text);color:var(--mc-surface);box-shadow:var(--mc-shadow-float);font-size:.8125rem;line-height:1.4;overflow:visible}.toast .text{min-width:0;overflow-wrap:anywhere}.toast .action{flex:none;min-height:var(--mc-hit-xs,24px);padding:0 10px;border:1px solid currentColor;border-radius:var(--mc-radius,8px);background:transparent;color:inherit;font:inherit;cursor:pointer}@media (hover:hover){.toast .action:hover{background:color-mix(in srgb,currentColor 14%,transparent)}}.toast .action:focus-visible{outline:2px solid currentColor;outline-offset:2px}@media (pointer:coarse){.toast .action{min-height:var(--mc-hit-sm,44px)}}`;i.d(t,["k",0,n])},9943(e,t,i){var n=i(6161);const o={select:"M6 3l12 8-5.5 1.3L10 18z",node:"M5 19L19 5M3 17h4v4H3zM17 3h4v4h-4z",pen:"M4 20l1-5L16 4l4 4L9 19zM14 6l4 4",rect:"M4 6h16v12H4z",ellipse:"M4 12a8 6 0 1 0 16 0a8 6 0 1 0-16 0",line:"M5 19L19 5",polygon:"M12 3l2.5 6.5H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z",free:"M3 15c3-8 6 4 9-3s6-3 9 0",knife:"M4 20l6-6M9 11l8-8 4 4-8 8z",hand:"M8 13V6a1.5 1.5 0 0 1 3 0v5m0-1V4.5a1.5 1.5 0 0 1 3 0V11m0-3a1.5 1.5 0 0 1 3 0v6c0 4-2 6-5 6s-4-1-6-4l-2-4a1.5 1.5 0 0 1 2.5-1.5L8 14",undo:"M4 9h10a5 5 0 0 1 0 10H8M4 9l4-4M4 9l4 4",redo:"M20 9H10a5 5 0 0 0 0 10h6M20 9l-4-4M20 9l-4 4",eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9.5a2.5 2.5 0 1 0 .01 0z",eyeOff:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM3 3l18 18",lock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",unlock:"M6 11h12v9H6zM8 11V8a4 4 0 0 1 7.5-1.5",plus:"M12 5v14M5 12h14",minus:"M5 12h14",fit:"M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",grid:"M4 4h16v16H4zM4 12h16M12 4v16",snap:"M6 4v8a6 6 0 0 0 12 0V4h-4v8a2 2 0 0 1-4 0V4z",up:"M12 19V5M6 11l6-6 6 6",down:"M12 5v14M6 13l6 6 6-6",left:"M19 12H5M11 6l-6 6 6 6",right:"M5 12h14M13 6l6 6-6 6",back:"M15 5l-7 7 7 7",close:"M6 6l12 12M18 6L6 18",help:"M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.5",file:"M6 3h8l4 4v14H6zM14 3v4h4",paste:"M9 4h6v3H9zM7 5H5v16h14V5h-2",blank:"M4 4h16v16H4z",iconpick:"M12 3l2.7 5.5 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.3 9.4l6-.9z",library:"M5 4h4v16H5zM11 4h4v16h-4zM17 6l3 .8-3.5 13-3-.8",group:"M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M9 9h6v6H9z",copy:"M8 8h12v12H8zM4 16V4h12",trash:"M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13",rotL:"M5 12a7 7 0 1 0 2-5M5 4v4h4",rotR:"M19 12a7 7 0 1 1-2-5M19 4v4h-4",rot90L:"M19 20v-8a5 5 0 0 0-5-5H5M9 3L5 7l4 4",rot90R:"M5 20v-8a5 5 0 0 1 5-5h9M15 3l4 4-4 4",ungroup:"M4 4h6v6H4zM14 14h6v6h-6zM14 10l6-6M15 4h5v5",maximize:"M5 5h14v14H5z",restore:"M8 8h11v11H8zM5 15V5h10",resizeCorner:"M19 9L9 19M19 14l-5 5",grip:"M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",flipH:"M12 3v18M8 7L3 12l5 5zM16 7l5 5-5 5z",flipV:"M3 12h18M7 8l5-5 5 5zM7 16l5 5 5-5z",link:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",save:"M5 4h12l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6",check:"M5 12.5l4.5 4.5L19 7",alignL:"M4 3v18M8 7h12M8 14h8",alignC:"M12 3v18M5 7h14M8 14h8",alignR:"M20 3v18M4 7h12M12 14h8",alignT:"M3 4h18M7 8v12M14 8v8",alignM:"M3 12h18M7 5v14M14 8v8",alignB:"M3 20h18M7 4v12M14 8v8",distH:"M4 3v18M20 3v18M10 8h4v8h-4z",distV:"M3 4h18M3 20h18M8 10h8v4H8z",toFront:"M12 19V6M6 11l6-6 6 6M5 3h14",toBack:"M12 5v13M6 13l6 6 6-6M5 21h14"},s={arrowLeft:"M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",check:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z",chevronDown:"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z",close:"M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",undo:"M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z",redo:"M18.4,10.6C16.55,9 14.15,8 11.5,8C6.85,8 2.92,11.03 1.54,15.22L3.9,16C4.95,12.81 7.95,10.5 11.5,10.5C13.45,10.5 15.23,11.22 16.62,12.38L13,16H22V7L18.4,10.6Z",helpCircle:"M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z",dotsVertical:"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",palette:"M12 3a9 9 0 0 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.4A4.6 4.6 0 0 0 22 10c0-3.9-4.5-7-10-7Zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z",add:"M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z",delete:"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",contentCopy:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",eyeOn:"M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z",alertCircle:"M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z",information:"M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z",dotsHorizontal:"M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z",restart:"M12,5V1L7,6L12,11V7A6,6 0 0,1 18,13A6,6 0 0,1 12,19A6,6 0 0,1 6,13H4A8,8 0 0,0 12,21A8,8 0 0,0 20,13A8,8 0 0,0 12,5Z",cursorDefault:"M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z",vectorPolylineEdit:"M2 3V9H4.95L6.95 15H6V21H12V16.41L17.41 11H22V5H16V9.57L10.59 15H9.06L7.06 9H8V3H2M4 5H6V7H4V5M18 7H20V9H18V7M21.15 13C21 13 20.87 13.05 20.76 13.16L19.75 14.18L21.82 16.25L22.84 15.24C23.05 15.03 23.05 14.67 22.84 14.46L21.54 13.16C21.43 13.05 21.29 13 21.15 13M19.15 14.76L13 20.91V23H15.09L21.23 16.84L19.15 14.76M8 17H10V19H8V17Z",pen:"M20.71,7.04C20.37,7.38 20.04,7.71 20.03,8.04C20,8.36 20.34,8.69 20.66,9C21.14,9.5 21.61,9.95 21.59,10.44C21.57,10.93 21.06,11.44 20.55,11.94L16.42,16.08L15,14.66L19.25,10.42L18.29,9.46L16.87,10.87L13.12,7.12L16.96,3.29C17.35,2.9 18,2.9 18.37,3.29L20.71,5.63C21.1,6 21.1,6.65 20.71,7.04M3,17.25L12.56,7.68L16.31,11.43L6.75,21H3V17.25Z",rectangleOutline:"M4,6V19H20V6H4M18,17H6V8H18V17Z",ellipseOutline:"M12,6C16.41,6 20,8.69 20,12C20,15.31 16.41,18 12,18C7.59,18 4,15.31 4,12C4,8.69 7.59,6 12,6M12,4C6.5,4 2,7.58 2,12C2,16.42 6.5,20 12,20C17.5,20 22,16.42 22,12C22,7.58 17.5,4 12,4Z",vectorLine:"M15,3V7.59L7.59,15H3V21H9V16.42L16.42,9H21V3M17,5H19V7H17M5,17H7V19H5",vectorPolygon:"M2,2V8H4.28L5.57,16H4V22H10V20.06L15,20.05V22H21V16H19.17L20,9H22V3H16V6.53L14.8,8H9.59L8,5.82V2M4,4H6V6H4M18,5H20V7H18M6.31,8H7.11L9,10.59V14H15V10.91L16.57,9H18L17.16,16H15V18.06H10V16H7.6M11,10H13V12H11M6,18H8V20H6M17,18H19V20H17",draw:"M9.75 20.85C11.53 20.15 11.14 18.22 10.24 17C9.35 15.75 8.12 14.89 6.88 14.06C6 13.5 5.19 12.8 4.54 12C4.26 11.67 3.69 11.06 4.27 10.94C4.86 10.82 5.88 11.4 6.4 11.62C7.31 12 8.21 12.44 9.05 12.96L10.06 11.26C8.5 10.23 6.5 9.32 4.64 9.05C3.58 8.89 2.46 9.11 2.1 10.26C1.78 11.25 2.29 12.25 2.87 13.03C4.24 14.86 6.37 15.74 7.96 17.32C8.3 17.65 8.71 18.04 8.91 18.5C9.12 18.94 9.07 18.97 8.6 18.97C7.36 18.97 5.81 18 4.8 17.36L3.79 19.06C5.32 20 7.88 21.47 9.75 20.85M20.84 5.25C21.06 5.03 21.06 4.67 20.84 4.46L19.54 3.16C19.33 2.95 18.97 2.95 18.76 3.16L17.74 4.18L19.82 6.26M11 10.92V13H13.08L19.23 6.85L17.15 4.77L11 10.92Z",contentCut:"M19,3L13,9L15,11L22,4V3M12,12.5A0.5,0.5 0 0,1 11.5,12A0.5,0.5 0 0,1 12,11.5A0.5,0.5 0 0,1 12.5,12A0.5,0.5 0 0,1 12,12.5M6,20A2,2 0 0,1 4,18C4,16.89 4.9,16 6,16A2,2 0 0,1 8,18C8,19.11 7.1,20 6,20M6,8A2,2 0 0,1 4,6C4,4.89 4.9,4 6,4A2,2 0 0,1 8,6C8,7.11 7.1,8 6,8M9.64,7.64C9.87,7.14 10,6.59 10,6A4,4 0 0,0 6,2A4,4 0 0,0 2,6A4,4 0 0,0 6,10C6.59,10 7.14,9.87 7.64,9.64L10,12L7.64,14.36C7.14,14.13 6.59,14 6,14A4,4 0 0,0 2,18A4,4 0 0,0 6,22A4,4 0 0,0 10,18C10,17.41 9.87,16.86 9.64,16.36L12,14L19,21H22V20L9.64,7.64Z",handBackLeftOutline:"M3 16C3 20.42 6.58 24 11 24C14.43 24 17.5 21.91 18.77 18.73L21.33 12.3C21.58 11.66 21.56 10.92 21.18 10.35C20.69 9.61 19.82 9.29 19 9.5L18.22 9.73C17.76 9.85 17.34 10.08 17 10.39V4.5C17 3.12 15.88 2 14.5 2C14.31 2 14.13 2 13.96 2.06C13.75 .89 12.73 0 11.5 0C10.44 0 9.54 .66 9.17 1.59C8.96 1.53 8.73 1.5 8.5 1.5C7.12 1.5 6 2.62 6 4V4.55C5.84 4.5 5.67 4.5 5.5 4.5C4.12 4.5 3 5.62 3 7V16M5 7C5 6.72 5.22 6.5 5.5 6.5S6 6.72 6 7V12H8V4C8 3.72 8.22 3.5 8.5 3.5S9 3.72 9 4V12H11V2.5C11 2.22 11.22 2 11.5 2S12 2.22 12 2.5V12H14V4.5C14 4.22 14.22 4 14.5 4S15 4.22 15 4.5V15H17L18 12.5C18.15 12.05 18.5 11.71 19 11.59L19.5 11.45L16.91 18C15.95 20.41 13.61 22 11 22C7.69 22 5 19.31 5 16V7Z",eyeOffOutline:"M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z",lock:"M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",lockOpenVariant:"M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",minus:"M19,13H5V11H19V13Z",fitToScreenOutline:"M17 4H20C21.1 4 22 4.9 22 6V8H20V6H17V4M4 8V6H7V4H4C2.9 4 2 4.9 2 6V8H4M20 16V18H17V20H20C21.1 20 22 19.1 22 18V16H20M7 18H4V16H2V18C2 19.1 2.9 20 4 20H7V18M16 10V14H8V10H16M18 8H6V16H18V8Z",grid:"M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2Z",magnet:"M3,7V13A9,9 0 0,0 12,22A9,9 0 0,0 21,13V7H17V13A5,5 0 0,1 12,18A5,5 0 0,1 7,13V7M17,5H21V2H17M3,5H7V2H3",arrowUp:"M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",arrowDown:"M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",arrowRight:"M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z",chevronRight:"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z",swapVertical:"M9,3L5,7H8V14H10V7H13M16,17V10H14V17H11L15,21L19,17H16Z",fileOutline:"M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z",contentPaste:"M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z",folderOpenOutline:"M6.1,10L4,18V8H21A2,2 0 0,0 19,6H12L10,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H19C19.9,20 20.7,19.4 20.9,18.5L23.2,10H6.1M19,18H6L7.6,12H20.6L19,18Z",shapeOutline:"M11,13.5V21.5H3V13.5H11M9,15.5H5V19.5H9V15.5M12,2L17.5,11H6.5L12,2M12,5.86L10.08,9H13.92L12,5.86M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13M17.5,15A2.5,2.5 0 0,0 15,17.5A2.5,2.5 0 0,0 17.5,20A2.5,2.5 0 0,0 20,17.5A2.5,2.5 0 0,0 17.5,15Z",bookshelf:"M9 3V18H12V3H9M12 5L16 18L19 17L15 4L12 5M5 5V18H8V5H5M3 19V21H21V19H3Z",group:"M1,1V5H2V19H1V23H5V22H19V23H23V19H22V5H23V1H19V2H5V1M5,4H19V5H20V19H19V20H5V19H4V5H5M6,6V14H9V18H18V9H14V6M8,8H12V12H8M14,11H16V16H11V14H14",ungroup:"M2,2H6V3H13V2H17V6H16V9H18V8H22V12H21V18H22V22H18V21H12V22H8V18H9V16H6V17H2V13H3V6H2V2M18,12V11H16V13H17V17H13V16H11V18H12V19H18V18H19V12H18M13,6V5H6V6H5V13H6V14H9V12H8V8H12V9H14V6H13M12,12H11V14H13V13H14V11H12V12Z",rotateLeft:"M13,4.07V1L8.45,5.55L13,10V6.09C15.84,6.57 18,9.03 18,12C18,14.97 15.84,17.43 13,17.91V19.93C16.95,19.44 20,16.08 20,12C20,7.92 16.95,4.56 13,4.07M7.1,18.32C8.26,19.22 9.61,19.76 11,19.93V17.9C10.13,17.75 9.29,17.41 8.54,16.87L7.1,18.32M6.09,13H4.07C4.24,14.39 4.79,15.73 5.69,16.89L7.1,15.47C6.58,14.72 6.23,13.88 6.09,13M7.11,8.53L5.7,7.11C4.8,8.27 4.24,9.61 4.07,11H6.09C6.23,10.13 6.58,9.28 7.11,8.53Z",rotateRight:"M16.89,15.5L18.31,16.89C19.21,15.73 19.76,14.39 19.93,13H17.91C17.77,13.87 17.43,14.72 16.89,15.5M13,17.9V19.92C14.39,19.75 15.74,19.21 16.9,18.31L15.46,16.87C14.71,17.41 13.87,17.76 13,17.9M19.93,11C19.76,9.61 19.21,8.27 18.31,7.11L16.89,8.53C17.43,9.28 17.77,10.13 17.91,11M15.55,5.55L11,1V4.07C7.06,4.56 4,7.92 4,12C4,16.08 7.05,19.44 11,19.93V17.91C8.16,17.43 6,14.97 6,12C6,9.03 8.16,6.57 11,6.09V10L15.55,5.55Z",rotateLeftVariant:"M4,2H7A2,2 0 0,1 9,4V20A2,2 0 0,1 7,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M20,15A2,2 0 0,1 22,17V20A2,2 0 0,1 20,22H11V15H20M14,4A8,8 0 0,1 22,12L21.94,13H19.92L20,12A6,6 0 0,0 14,6V9L10,5L14,1V4Z",rotateRightVariant:"M10,4V1L14,5L10,9V6A6,6 0 0,0 4,12L4.08,13H2.06L2,12A8,8 0 0,1 10,4M17,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H17A2,2 0 0,1 15,20V4A2,2 0 0,1 17,2M4,15H13V22H4A2,2 0 0,1 2,20V17A2,2 0 0,1 4,15Z",flipHorizontal:"M15 21H17V19H15M19 9H21V7H19M3 5V19C3 20.1 3.9 21 5 21H9V19H5V5H9V3H5C3.9 3 3 3.9 3 5M19 3V5H21C21 3.9 20.1 3 19 3M11 23H13V1H11M19 17H21V15H19M15 5H17V3H15M19 13H21V11H19M19 21C20.1 21 21 20.1 21 19H19Z",flipVertical:"M3 15V17H5V15M15 19V21H17V19M19 3H5C3.9 3 3 3.9 3 5V9H5V5H19V9H21V5C21 3.9 20.1 3 19 3M21 19H19V21C20.1 21 21 20.1 21 19M1 11V13H23V11M7 19V21H9V19M19 15V17H21V15M11 19V21H13V19M3 19C3 20.1 3.9 21 5 21V19Z",arrangeBringToFront:"M2,2H11V6H9V4H4V9H6V11H2V2M22,13V22H13V18H15V20H20V15H18V13H22M8,8H16V16H8V8Z",arrangeBringForward:"M2,2H16V16H2V2M22,8V22H8V18H10V20H20V10H18V8H22Z",arrangeSendBackward:"M2,2H16V16H2V2M22,8V22H8V18H18V8H22M4,4V14H14V4H4Z",arrangeSendToBack:"M2,2H11V11H2V2M9,4H4V9H9V4M22,13V22H13V13H22M15,20H20V15H15V20M16,8V11H13V8H16M11,16H8V13H11V16Z",dragVertical:"M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z",squareOutline:"M3,3H21V21H3V3M5,5V19H19V5H5Z",selectAll:"M9,9H15V15H9M7,17H17V7H7M15,5H17V3H15M15,21H17V19H15M19,17H21V15H19M19,9H21V7H19M19,21A2,2 0 0,0 21,19H19M19,13H21V11H19M11,21H13V19H11M9,3H7V5H9M3,17H5V15H3M5,21V19H3A2,2 0 0,0 5,21M19,3V5H21A2,2 0 0,0 19,3M13,3H11V5H13M3,9H5V7H3M7,21H9V19H7M3,13H5V11H3M3,5H5V3A2,2 0 0,0 3,5Z"},a=e=>Object.prototype.hasOwnProperty.call(s,e),r=["left","right","back","arrowLeft","arrowRight","chevronRight","undo","redo"],l=Object.fromEntries([...Object.keys(o),...Object.keys(s)].map(e=>[e,r.includes(e)?"mirror":"keep"])),c={round:"M4 20V12A8 8 0 0 1 12 4H20",squircle:"M4 20V12C4 6.5 6.5 4 12 4H20",bevel:"M4 20V10L10 4H20",scoop:"M4 20V10A6 6 0 0 0 10 4H20",notch:"M4 20V10H10V4H20",square:"M4 20V4H20"};i.d(t,["Vq",0,(e,t=20)=>{const i="mirror"===l[e]?"mirror":n.s6;return a(e)?n.qy`<svg class="gl" data-dir=${i} viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${s[e]} fill="currentColor"></path></svg>`:n.qy`<svg class="gl" data-dir=${i} viewBox="0 0 24 24" width=${t} height=${t} aria-hidden="true" focusable="false"><path d=${o[e]} fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>`},"ow",0,e=>Object.prototype.hasOwnProperty.call(o,e)||a(e),"w_",0,(e,t=0)=>n.JW`<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true" style=${t?`transform:rotate(${t}deg)`:""}><path d=${c[e]} /></svg>`])},8302(e,t,i){i.d(t,{Y5:()=>l.Y,x6:()=>R.x6,jw:()=>R.jw,Oi:()=>L,ah:()=>O.ah,Ie:()=>R.Ie,ZZ:()=>R.ZZ,Vq:()=>f.Vq,Zj:()=>R.Zj,Oj:()=>O.Oj,Bm:()=>R.Bm,lm:()=>R.lm,nM:()=>R.nM,S1:()=>R.S1,aJ:()=>R.aJ,aw:()=>R.aw,xH:()=>R.xH,KE:()=>R.KE,XV:()=>R.XV});var n=i(6837),o=i(6161),s=i(5707),a=i(5276),r=i(993),l=i(5710),c=i(6081),d=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let h=0;class u extends o.WF{constructor(){super(...arguments),this.label="",this.items=[],this._tab=-1,this._focused="",this._id="mc-choice-"+ ++h,this._keydown=e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const t=Array.from(this.renderRoot.querySelectorAll("button.opt")),i=t.indexOf(e.composedPath()[0]),n=(0,l.n)(e.key,i,t.map(()=>({})),"both",!0,"rtl"===(0,r.k)(this));n<0||(e.preventDefault(),e.stopPropagation(),this._tab=n,t[n]?.focus())}}get _stop(){const e=this.items.length;if(this._tab>=0&&this._tab<e)return this._tab;const t=this.items.findIndex(e=>e.value===this.value);return t>=0?t:0}_pick(e){this.dispatchEvent(new CustomEvent("mc-pick",{detail:{value:e},bubbles:!0,composed:!0}))}render(){const e=this._stop,t=this.items.find(e=>e.value===this._focused)??this.items.find(e=>e.value===this.value),i=`${this._id}-desc`;return o.qy`<div class="group" part="group" role="group" aria-label=${this.label}> <div class=${this.gridClass} @keydown=${this._keydown}> ${this.items.map((n,s)=>o.qy`<button type="button" class="opt" part="option" data-value=${n.value} tabindex=${s===e?"0":"-1"} aria-pressed=${n.value===this.value?"true":"false"} aria-describedby=${n.description&&t===n?i:o.s6} @focus=${()=>{this._focused=n.value,this._tab=s}} @blur=${()=>{this._focused===n.value&&(this._focused="")}} @click=${()=>this._pick(n.value)} > ${n.preview?o.qy`<span class="pv" aria-hidden="true">${(0,a._)(n.preview)}</span>`:o.s6} <span class="nm">${n.label}</span> </button>`)}</div>${t?.description?o.qy`<p class="desc" id=${i} part="description">${t.description}</p>`:o.s6}</div>`}}u.uiKitRevision=6,u.styles=[c.Uj],d([(0,s.MZ)()],u.prototype,"label",void 0),d([(0,s.MZ)({attribute:!1})],u.prototype,"items",void 0),d([(0,s.MZ)()],u.prototype,"value",void 0),d([(0,s.wk)()],u.prototype,"_tab",void 0),d([(0,s.wk)()],u.prototype,"_focused",void 0);var p=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};let m=0;class g extends o.WF{constructor(){super(...arguments),this.heading="",this.open=!1,this.level=3,this._id="mc-disc-"+ ++m,this._toggle=()=>{this.open=!this.open,this.dispatchEvent(new CustomEvent("mc-toggle",{detail:{open:this.open},bubbles:!0,composed:!0}))}}render(){const e=Math.min(6,Math.max(2,Math.round(this.level)||3));return o.qy`<div class="head" role="heading" aria-level=${e}> <button type="button" class="btn" part="button" id=${this._id} aria-expanded=${this.open?"true":"false"} aria-controls="${this._id}-body" @click=${this._toggle}> <span class="title">${this.heading}</span> ${this.summary?o.qy`<span class="sum">${this.summary}</span>`:o.s6} <svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" /></svg> </button></div><div class="body" part="body" id="${this._id}-body" role="region" aria-labelledby=${this._id} ?hidden=${!this.open}><slot></slot></div>`}}g.uiKitRevision=6,g.styles=[c.dk],p([(0,s.MZ)()],g.prototype,"heading",void 0),p([(0,s.MZ)()],g.prototype,"summary",void 0),p([(0,s.MZ)({type:Boolean,reflect:!0})],g.prototype,"open",void 0),p([(0,s.MZ)({type:Number})],g.prototype,"level",void 0);var f=i(9943),v=i(3297),b=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};class y extends o.WF{constructor(){super(...arguments),this.items=[],this.label="",this.align="start",this.touch=!1,this._open=!1,this._sub=-1,this._dir=new r.K(this),this._outside=e=>{const t=e.composedPath();if(!t.includes(this))return this.anchor&&t.includes(this.anchor)?this.close("outside"):void this.close("outside")},this._key=e=>{const t=this.list();if(!t)return;const i=[...t.querySelectorAll("[role^=menuitem]")],n=i.indexOf(e.composedPath()[0]),o=this.entries(),s=i.length,a=e=>i[(e+s)%s]?.focus(),r=e.key,l="rtl"===this._dir.direction;let c=!0;if("ArrowDown"===r)a(n+1);else if("ArrowUp"===r)a(n<0?s-1:n-1);else if("Home"===r)a(0);else if("End"===r)a(s-1);else if("Enter"===r||" "===r)this.pick(n,i[n]);else if(r===(l?"ArrowLeft":"ArrowRight"))this._sub<0&&o[n]?.items&&this.openSub(n,i[n]);else if(r===(l?"ArrowRight":"ArrowLeft")||"Escape"===r)if(this._sub>=0){const e=this._sub;this._sub=-1,this.updateComplete.then(()=>this.focusIn(this.list(),e))}else"Escape"===r&&this.close("escape");else if("Tab"===r)c=!1,this.close("tab");else if(1!==r.length||e.ctrlKey||e.metaKey||e.altKey)c=!1;else{const e=o.map((e,t)=>(n+1+t)%s).find(e=>o[e].label.toLowerCase().startsWith(r.toLowerCase()));void 0!==e&&a(e)}c&&(e.preventDefault(),e.stopPropagation())}}get open(){return this._open}show(){this._open=!0,this._sub=-1,document.addEventListener("pointerdown",this._outside,!0),this.updateComplete.then(()=>{this.placeMain(),this.focusIn(this.list(),this.firstFree(this.items))})}close(e="escape"){this._open&&(this._open=!1,this._sub=-1,document.removeEventListener("pointerdown",this._outside,!0),this.dispatchEvent(new CustomEvent("mc-menu-close",{detail:{reason:e},bubbles:!0,composed:!0})),"pick"!==e&&(this.opener??this.anchor)?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0)}updated(e){for(const e of this.renderRoot.querySelectorAll(".menu[popover]"))(0,v.Vf)(e)}placeMain(){const e=this.renderRoot.querySelector(".menu");e&&((0,v.Vf)(e),this.anchor?(0,v.r4)(e,this.anchor.getBoundingClientRect(),this.align):(0,v.Zk)(e,this.at??[0,0],this.touch?8:0))}list(){return this.renderRoot.querySelector(this._sub>=0?".sub":".menu")}firstFree(e){return Math.max(0,e.findIndex(e=>!e.reason))}focusIn(e,t){e?.querySelectorAll("[role^=menuitem]")[t]?.focus({preventScroll:!0})}entries(){return this._sub>=0?this.items[this._sub]?.items??[]:this.items}openSub(e,t){const i=this.items[e];i?.items?.length&&!i.reason&&(this._sub=e,this._subRow=t,this.updateComplete.then(()=>{const e=this.renderRoot.querySelector(".sub");if(e){(0,v.Vf)(e);const i=t.getBoundingClientRect(),n=e.getBoundingClientRect().width,o="rtl"===this._dir.direction?i.left-n>=8:i.right+n+8>window.innerWidth,s="rtl"===this._dir.direction?o?i.left-n:i.right:o?Math.max(8,i.left-n):i.right;(0,v.Zk)(e,[s,i.top])}this.focusIn(this.list(),this.firstFree(i.items??[]))}))}pick(e,t){const i=this.entries()[e];if(i&&!i.reason){if(i.items)return this.openSub(e,t);this.dispatchEvent(new CustomEvent("mc-menu-pick",{detail:{id:i.id},bubbles:!0,composed:!0})),this.close("pick")}}mark(e){return e.glyph&&(0,f.ow)(e.glyph)?o.qy`<span class="glyph">${(0,f.Vq)(e.glyph,18)}</span>`:e.icon?o.qy`<span class="glyph"><ha-icon icon=${e.icon}></ha-icon></span>`:o.s6}row(e,t){const i=!!e.items,n=void 0===e.checked?"menuitem":"menuitemcheckbox";return o.qy`${e.separatorBefore?o.qy`<div class="sep" role="separator"></div>`:o.s6}<div class="item ${e.danger?"danger":""}" role=${n} tabindex="-1" aria-checked=${void 0===e.checked?o.s6:String(e.checked)} aria-disabled=${e.reason?"true":o.s6} aria-description=${e.reason??e.sub??o.s6} aria-keyshortcuts=${e.keys??o.s6} aria-haspopup=${i?"menu":o.s6} aria-expanded=${i?String(this._sub===t):o.s6} @click=${e=>this.pick(t,e.currentTarget)} > ${this.mark(e)}<span class="label">${e.label}</span>${e.keys?o.qy`<span class="keys">${e.keys}</span>`:o.s6}${i?"rtl"===this._dir.direction?"‹":"›":o.s6}${e.reason?o.qy`<span class="why">${e.reason}</span>`:o.s6}${e.sub?o.qy`<span class="sub-line">${e.sub}</span>`:o.s6}</div>`}render(){if(!this._open)return o.s6;const e=this.items[this._sub];return o.qy`<div class="menu" role="menu" aria-label=${this.label} popover="manual" style=${`max-height:${window.innerHeight-16}px`} @keydown=${this._key}> ${this.items.map((e,t)=>this.row(e,t))}</div>${e?.items?o.qy`<div class="sub menu" role="menu" aria-label=${e.label} popover="manual" @keydown=${this._key}>${e.items.map((e,t)=>this.row(e,t))}</div>`:o.s6}`}}y.uiKitRevision=6,y.styles=c.bE,b([(0,s.MZ)({attribute:!1})],y.prototype,"items",void 0),b([(0,s.MZ)()],y.prototype,"label",void 0),b([(0,s.MZ)({attribute:!1})],y.prototype,"at",void 0),b([(0,s.MZ)({attribute:!1})],y.prototype,"anchor",void 0),b([(0,s.MZ)()],y.prototype,"align",void 0),b([(0,s.MZ)({type:Boolean})],y.prototype,"touch",void 0),b([(0,s.MZ)({attribute:!1})],y.prototype,"opener",void 0),b([(0,s.wk)()],y.prototype,"_open",void 0),b([(0,s.wk)()],y.prototype,"_sub",void 0);var _=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};class w extends o.WF{constructor(){super(...arguments),this.label="",this.align="start",this._open=!1,this._outside=e=>{const t=e.composedPath();t.includes(this)||this.anchor&&t.includes(this.anchor)||this.close("outside")},this._resize=()=>this.close("outside"),this._key=e=>{"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this.close("escape"))},this._focusout=e=>{const t=e.relatedTarget;!t||this.contains(t)||this.renderRoot.contains(t)||t===this.anchor||this.close("tab")}}get open(){return this._open}show(){this._open||(this._open=!0,document.addEventListener("pointerdown",this._outside,!0),window.addEventListener("resize",this._resize),this.updateComplete.then(()=>{const e=this.panel();e&&((0,v.Vf)(e),this.anchor&&(0,v.r4)(e,this.anchor.getBoundingClientRect(),this.align))}))}close(e="action"){this._open&&(this._open=!1,document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize),this.dispatchEvent(new CustomEvent("mc-popover-close",{detail:{reason:e},bubbles:!0,composed:!0})),"outside"!==e&&"tab"!==e&&this.anchor?.focus?.({preventScroll:!0}))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("pointerdown",this._outside,!0),window.removeEventListener("resize",this._resize)}panel(){return this.renderRoot.querySelector(".panel")}render(){return this._open?o.qy`<div class="panel" part="panel" role="group" aria-label=${this.label} popover="manual" @keydown=${this._key} @focusout=${this._focusout}><slot></slot></div>`:o.s6}}w.uiKitRevision=6,w.styles=c.u1,_([(0,s.MZ)({attribute:!1})],w.prototype,"anchor",void 0),_([(0,s.MZ)()],w.prototype,"label",void 0),_([(0,s.MZ)()],w.prototype,"align",void 0),_([(0,s.wk)()],w.prototype,"_open",void 0);var $=i(877),x=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};class k extends o.WF{constructor(){super(...arguments),this.offset=16,this._open=!1,this._text="",this._ms=6e3,this._hold=0,this._pressing=!1,this._listening=!1,this._key=e=>{"Escape"===e.key&&this._open&&(e.composedPath().includes(this)&&e.stopPropagation(),this.close())},this._press=()=>{this._pressing||(this._pressing=!0,this._pause())},this._release=()=>{this._pressing&&(this._pressing=!1,this._resume())},this._pause=()=>{this._hold++,clearTimeout(this._timer)},this._resume=()=>{this._hold=Math.max(0,this._hold-1),this._arm()},this._act=()=>{const e=this._action;e&&(this.dispatchEvent(new CustomEvent("mc-toast-action",{detail:{id:e.id},bubbles:!0,composed:!0})),this.close())}}get open(){return this._open}show(e){this._text=e.text,this._action=e.action,this._ms=e.duration??6e3,this._hold=0,this._pressing=!1,this._open=!0,this._listen(!0),this._arm(),this.updateComplete.then(()=>{const e=this.renderRoot.querySelector(".toast");e&&(0,v.Vf)(e)})}close(){clearTimeout(this._timer),this._timer=void 0,this._hold=0,this._pressing=!1,this._listen(!1),this._open=!1}disconnectedCallback(){super.disconnectedCallback(),clearTimeout(this._timer),this._listen(!1)}_listen(e){if(e===this._listening)return;this._listening=e;const t=e?"addEventListener":"removeEventListener";document[t]("keydown",this._key,!0),window[t]("pointerup",this._release),window[t]("pointercancel",this._release)}_arm(){clearTimeout(this._timer),this._hold>0||(this._timer=setTimeout(()=>this.close(),this._ms))}render(){return o.qy`<div class="live" role="status" aria-live="polite">${this._open?o.qy`<div class="toast ${this.dismissLabel?"big":""}" part="toast" popover="manual" style="--mc-toast-offset:${this.offset}px" @pointerdown=${this._press} @pointerenter=${this._pause} @pointerleave=${this._resume} @focusin=${this._pause} @focusout=${this._resume} > <span class="text" part="text">${this._text}</span> ${this._action?o.qy`<button type="button" class="action" part="action" @click=${this._act}>${this._action.label}</button>`:o.s6} ${this.dismissLabel?o.qy`<button type="button" class="dismiss" part="dismiss" aria-label=${this.dismissLabel} @click=${()=>this.close()}> <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg> </button>`:o.s6}</div>`:o.s6}</div>`}}k.uiKitRevision=6,k.styles=[o.AH`:host{display:contents;font-family:var(--mc-font,inherit)}*,*::before,*::after{box-sizing:border-box}.toast .dismiss{flex:none;display:inline-grid;place-items:center;width:44px;height:44px;margin:-10px;margin-left:-4px;margin-right:-10px;margin-inline:-4px -10px;padding:0;border:0;border-radius:var(--mc-radius,8px);background:transparent;color:inherit;cursor:pointer}@media (hover:hover){.toast .dismiss:hover{background:rgba(128,128,128,.25)}}.toast .dismiss:focus-visible{outline:2px solid currentColor;outline-offset:-4px}.toast .dismiss svg{width:20px;height:20px}.toast.big .action{min-height:44px;min-width:44px}.live{position:absolute;width:0;height:0;overflow:visible}`,$.k],x([(0,s.MZ)({type:Number})],k.prototype,"offset",void 0),x([(0,s.MZ)()],k.prototype,"dismissLabel",void 0),x([(0,s.wk)()],k.prototype,"_open",void 0),x([(0,s.wk)()],k.prototype,"_text",void 0),x([(0,s.wk)()],k.prototype,"_action",void 0);const C=[420,480,640,880];function M(e,t,i){const n=Math.min(Math.max(e.w,320),t-32);return{w:n,h:Math.min(Math.max(e.h,240),i-32),x:Math.min(Math.max(e.x,48-n),t-48),y:Math.min(Math.max(e.y,0),i-48)}}const S=(e,t,i)=>({...e,x:(t-e.w)/2,y:(i-e.h)/2});function A(e,t,i,n,o,s){const a=M({...e,w:e.w+(n?-t:t),h:e.h+i},o,s);return{...a,x:n?e.x+e.w-a.w:e.x}}var q=function(e,t,i,n){var o,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,i,n);else for(var r=e.length-1;r>=0;r--)(o=e[r])&&(a=(s<3?o(a):s>3?o(t,i,a):o(t,i))||a);return s>3&&a&&Object.defineProperty(t,i,a),a};const E=["centre","end","start"],j='button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';class T extends o.WF{constructor(){super(...arguments),this.heading="",this.closeLabel="",this.variant="dialog",this.dismissible=!0,this.movable=!1,this.resizable=!1,this.maximizable=!1,this.maximized=!1,this.moveLabel="",this.resizeLabel="",this.maximizeLabel="",this.restoreLabel="",this._open=!1,this._hasFooter=!1,this._r=null,this._compact=!1,this._dir=new r.K(this),this._drag=null,this._dock=0,this._downScrim=null,this._id=`mc-ui-win-${Math.random().toString(36).slice(2,8)}`,this._isCompact=()=>"function"==typeof matchMedia&&matchMedia("(max-width: 599px)").matches,this._vw=()=>document.documentElement.clientWidth||window.innerWidth,this._vh=()=>window.innerHeight,this._free=()=>"alert"!==this.variant&&!("sheet"===this.variant&&this._compact),this._viewport=()=>{this._compact=this._isCompact(),this._r&&(this._r=M(this._r,this._vw(),this._vh()))},this._cancel=e=>{e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape")},this._key=e=>{if("Tab"===e.key)return this._tab(e);"Escape"===e.key&&(e.preventDefault(),e.stopPropagation(),this._abort()||this.close("escape"))},this._press=e=>{this._downScrim=e.target===e.currentTarget},this._click=e=>{const t=this._downScrim;this._downScrim=null,e.target===e.currentTarget&&!1!==t&&this.dismissible&&"alert"!==this.variant&&this.close("scrim")},this._footer=e=>{this._hasFooter=e.target.assignedNodes().length>0},this._moved=e=>{const t=this._drag;if(!t||e.pointerId!==t.id)return;const i=e.clientX-t.sx,n=e.clientY-t.sy;if(!t.moved&&Math.hypot(i,n)<4)return;t.moved=!0,this._dock=0;const o=t.r0;if("move"===t.mode)return this._set({...o,x:o.x+i,y:o.y+n});this._set(A(o,i,n,this._rtl,this._vw(),this._vh()))},this._released=e=>{const t=this._drag;t&&e.pointerId===t.id&&(this._drag=null,"pointercancel"===e.type?this._r=t.was:!t.moved&&t.grip&&("move"===t.mode?this._dockNext():this._stepWidth()))}}get open(){return this._open}dlg(){return this.renderRoot.querySelector("dialog")}show(){this._open||(this._open=!0,this._hasFooter=!!this.querySelector(':scope > [slot="footer"]'),this._compact=this._isCompact(),window.addEventListener("resize",this._viewport),(this.movable&&!this.moveLabel||this.resizable&&!this.resizeLabel||this.maximizable&&!this.maximizeLabel)&&console.debug("[magic-card] <mc-ui-window> needs moveLabel, resizeLabel and maximizeLabel"),this.updateComplete.then(()=>{const e=this.dlg();if(e){if("function"==typeof e.showModal)try{e.showModal()}catch{e.setAttribute("open","")}else e.setAttribute("open","");this.focusFirst()}}))}close(e="action"){if(!this._open)return;this._open=!1,this._forget();const t=this.dlg();t?.open&&"function"==typeof t.close?t.close():t?.removeAttribute("open"),this.dispatchEvent(new CustomEvent("mc-window-close",{detail:{reason:e},bubbles:!0,composed:!0}));const i=this.opener;i?.isConnected&&i.focus({preventScroll:!0})}disconnectedCallback(){if(super.disconnectedCallback(),this._open){this._open=!1,this._forget();const e=this.dlg();e?.open&&"function"==typeof e.close&&e.close()}}_forget(){window.removeEventListener("resize",this._viewport),this._r=null,this._drag=null,this._dock=0,this.maximized=!1}focusFirst(){const e=(this.initialFocus?this.querySelector(`#${CSS.escape(this.initialFocus)}`):null)??this.querySelector(j);(e??this.renderRoot.querySelector(".close"))?.focus({preventScroll:!0})}get _rtl(){return"rtl"===this._dir.direction||"rtl"===getComputedStyle(this).direction}_now(){return this._r??this._measure()}_measure(){const e=this.dlg()?.getBoundingClientRect();return{x:e?.left??0,y:e?.top??0,w:e?.width??0,h:e?.height??0}}_set(e){this._r=M(e,this._vw(),this._vh())}_abort(){const e=this._drag;return!!e&&(this._drag=null,this._r=e.was,!0)}_tab(e){if(e.defaultPrevented)return;const t=[],i=e=>{if(e instanceof HTMLElement&&!e.hasAttribute("hidden")){if(e instanceof HTMLSlotElement)return e.assignedNodes({flatten:!0}).forEach(i);e.matches(j)&&t.push(e),(e.shadowRoot??e).childNodes.forEach(i)}};this.renderRoot.childNodes.forEach(i);const n=t.indexOf(e.composedPath()[0]),o=e.shiftKey?0===n?t[t.length-1]:void 0:n===t.length-1?t[0]:void 0;o&&(e.preventDefault(),o.focus({preventScroll:!0}))}_begin(e,t,i){if(!(this.maximized||"mouse"===e.pointerType&&0!==e.button)&&(i||!e.composedPath()[0]?.closest?.('button, input, select, textarea, a, [role="button"]'))){this._drag={mode:t,id:e.pointerId,sx:e.clientX,sy:e.clientY,r0:this._now(),was:this._r,grip:i,moved:!1};try{e.target.setPointerCapture?.(e.pointerId)}catch{}}}_dockNext(){this.maximized||(this._dock=(this._dock+1)%E.length,this._set(function(e,t,i,n,o){if("centre"===t)return S(e,n,o);const s="end"===t!==i;return{...e,x:s?n-e.w-16:16}}(this._now(),E[this._dock],this._rtl,this._vw(),this._vh())))}_stepWidth(){this.maximized||this._set(function(e,t){const i=C.find(t=>t>e.w+1)??C[0];return{...e,w:Math.min(i,t-32)}}(this._now(),this._vw()))}_grip(e,t){const i=function(e,t){const i=t?64:16;switch(e){case"ArrowLeft":return[-i,0];case"ArrowRight":return[i,0];case"ArrowUp":return[0,-i];case"ArrowDown":return[0,i];default:return null}}(t.key,t.shiftKey);if(this.maximized||!i&&"Home"!==t.key)return;t.preventDefault(),t.stopPropagation();const n=this._now();if(this._dock=0,!i){if("move"===e)return this._set(S(n,this._vw(),this._vh()));const t=this.dlg(),i=t?.getAttribute("style")??null;t?.removeAttribute("style");const o=this._measure();if(null!==i&&t?.setAttribute("style",i),!this._r)return;return this._set({...n,w:o.w,h:o.h})}if("move"===e)return this._set({...n,x:n.x+i[0],y:n.y+i[1]});this._set(A(n,i[0],i[1],this._rtl,this._vw(),this._vh()))}_style(){const e=this.maximized?{x:16,y:16,w:this._vw()-32,h:this._vh()-32}:this._r;return e?`inset:auto;margin:0;max-width:none;max-height:none;left:${e.x}px;top:${e.y}px;width:${e.w}px;height:${e.h}px`:""}render(){if(!this._open)return o.s6;const e="alert"===this.variant,t=this._free(),i=t&&this.movable,n=t&&this.resizable&&!this.maximized,s=t&&this.maximizable;return o.qy`<dialog class="${this.variant} size-${this.size??(e?"s":"picker"===this.variant?"l":"m")}${this._rtl?" rtl":""}${this.maximized||this._r?" placed":""}" style=${this._style()} role=${e?"alertdialog":"dialog"} aria-labelledby="${this._id}-t" @cancel=${this._cancel} @keydown=${this._key} @pointerdown=${this._press} @click=${this._click} @pointermove=${this._moved} @pointerup=${this._released} @pointercancel=${this._released} > <div class="panel${n?" sizable":""}${this._hasFooter?" has-footer":""}" part="panel"> <div class="header${i?" movable":""}" part="header" @pointerdown=${e=>i&&this._begin(e,"move",!1)}> ${i?o.qy`<button type="button" class="tool move" part="move" aria-label=${this.moveLabel} title=${this.moveLabel} ?disabled=${this.maximized} @pointerdown=${e=>this._begin(e,"move",!0)} @keydown=${e=>this._grip("move",e)} @click=${e=>0===e.detail&&this._dockNext()}>${(0,f.Vq)("grip",20)}</button>`:o.s6}<h2 class="title" id="${this._id}-t" part="title">${this.heading}</h2><slot name="header-actions"></slot> ${s?o.qy`<button type="button" class="tool maximize" part="maximize" aria-pressed=${this.maximized?"true":"false"} aria-label=${this.maximized?this.restoreLabel:this.maximizeLabel} title=${this.maximized?this.restoreLabel:this.maximizeLabel} @click=${()=>this.maximized=!this.maximized}>${(0,f.Vq)(this.maximized?"restore":"maximize",20)}</button>`:o.s6} <button type="button" class="tool close" part="close" aria-label=${this.closeLabel} title=${this.closeLabel} @click=${()=>this.close("close-button")}>${(0,f.Vq)("close",20)}</button></div><div class="body" part="body"><slot></slot></div><div class="footer" part="footer" ?hidden=${!this._hasFooter}><slot name="footer" @slotchange=${this._footer}></slot></div></div>${n?o.qy`<button type="button" class="tool resize" part="resize" aria-label=${this.resizeLabel} title=${this.resizeLabel} @pointerdown=${e=>this._begin(e,"size",!0)} @keydown=${e=>this._grip("size",e)} @click=${e=>0===e.detail&&this._stepWidth()}>${(0,f.Vq)("resizeCorner",20)}</button>`:o.s6}</dialog>`}}T.uiKitRevision=6,T.styles=c.S8,q([(0,s.MZ)()],T.prototype,"heading",void 0),q([(0,s.MZ)()],T.prototype,"closeLabel",void 0),q([(0,s.MZ)()],T.prototype,"variant",void 0),q([(0,s.MZ)({reflect:!0})],T.prototype,"size",void 0),q([(0,s.MZ)()],T.prototype,"initialFocus",void 0),q([(0,s.MZ)({attribute:!1})],T.prototype,"opener",void 0),q([(0,s.MZ)({type:Boolean})],T.prototype,"dismissible",void 0),q([(0,s.MZ)({type:Boolean})],T.prototype,"movable",void 0),q([(0,s.MZ)({type:Boolean})],T.prototype,"resizable",void 0),q([(0,s.MZ)({type:Boolean})],T.prototype,"maximizable",void 0),q([(0,s.MZ)({type:Boolean,reflect:!0})],T.prototype,"maximized",void 0),q([(0,s.MZ)()],T.prototype,"moveLabel",void 0),q([(0,s.MZ)()],T.prototype,"resizeLabel",void 0),q([(0,s.MZ)()],T.prototype,"maximizeLabel",void 0),q([(0,s.MZ)()],T.prototype,"restoreLabel",void 0),q([(0,s.wk)()],T.prototype,"_open",void 0),q([(0,s.wk)()],T.prototype,"_hasFooter",void 0),q([(0,s.wk)()],T.prototype,"_r",void 0),q([(0,s.wk)()],T.prototype,"_compact",void 0);const z=[[n.eG,y],[n.P8,T],[n.KB,w],[n.a6,k],[n.Mo,g],[n.XQ,class extends u{constructor(){super(...arguments),this.gridClass="tile-grid"}}],[n.zn,class extends u{constructor(){super(...arguments),this.gridClass="chip-grid"}}]];function L(){!function(e){for(const[t,i]of e){const e=customElements.get(t);e?(e.uiKitRevision??0)<6&&console.debug(`[magic-card] ${t} is defined by an older ui-kit (revision ${e.uiKitRevision??0}); keeping it`):customElements.define(t,i)}}(z)}var O=i(8094),R=i(619);i(9125)},3297(e,t,i){i.d(t,{Vf:()=>r,Zk:()=>a,i$:()=>o,r4:()=>s});var n=i(993);function o(e,t,i,n){return"end"===i!==n?e.right-t:e.left}function s(e,t,i="start"){const s=window.innerWidth||document.documentElement.clientWidth||0,a=window.innerHeight||document.documentElement.clientHeight||0;e.style.maxHeight="";const r=e.offsetWidth,l=e.offsetHeight,c=a-t.bottom-4-8,d=t.top-4-8,h=a>0&&l>c&&d>c,u=h?d:c;a>0&&l>u&&(e.style.maxHeight=`${Math.max(120,u)}px`);const p=Math.min(l,a>0?Math.max(120,u):l),m=h?Math.max(8,t.top-4-p):t.bottom+4;let g=o(t,r,i,"rtl"===(0,n.k)(e));return s>0&&(g=Math.min(g,s-r-8)),g=Math.max(8,g),Object.assign(e.style,{top:`${Math.round(m)}px`,left:`${Math.round(g)}px`,right:"auto",bottom:"auto"}),e.dataset.placement=h?"top":"bottom",h?"top":"bottom"}function a(e,t,i=0){const n=e.getBoundingClientRect(),o=(e,t,n)=>{let o=e+i;return o+t>n-8&&(o=e-i-t),Math.max(8,Math.min(o,n-8-t))},s=[o(t[0],n.width,window.innerWidth),o(t[1],n.height,window.innerHeight)];return Object.assign(e.style,{left:`${s[0]}px`,top:`${s[1]}px`,right:"auto",bottom:"auto"}),s}function r(e){if("undefined"!=typeof HTMLElement&&"function"==typeof HTMLElement.prototype.showPopover)try{e.matches(":popover-open")||e.showPopover()}catch{}}},3220(e,t,i){i.d(t,{x:()=>s});var n=i(6161),o=i(1141);function s(e){const t=!!e.disabledReason,i=e.iconOnly?"icon-btn"+("sm"===e.size?" sm":""):`btn btn-${e.variant??"secondary"}${"sm"===e.size?" btn-sm":""}`;return n.qy`<button type="button" class=${i} aria-label=${e.iconOnly?e.label:n.s6} title=${e.iconOnly?e.label:n.s6} aria-pressed=${void 0===e.pressed?n.s6:String(e.pressed)} aria-disabled=${t?"true":n.s6} aria-haspopup=${e.haspopup??n.s6} aria-expanded=${void 0===e.expanded?n.s6:String(e.expanded)} aria-controls=${e.controls??n.s6} aria-keyshortcuts=${e.keys??n.s6} ?disabled=${e.disabled} @click=${i=>{t||e.onClick(i)}} >${(0,o.Z)(e,e.iconOnly?20:18)}${e.iconOnly?n.s6:e.label}</button>`}},7795(e,t,i){i.d(t,{aJ:()=>a,jw:()=>r,os:()=>l});var n=i(6161),o=i(5710),s=i(1141);function a(e){const t="tablist"===e.role,i=new o.Y({items:"[data-val]",orientation:"horizontal",onMove:t=>{const i=t.dataset.val;i!==e.value&&e.onChange(i)}});return n.qy`<div class="seg${e.full?" full":""}" role=${e.role} aria-label=${e.label} @keydown=${i.onKeydown}> ${e.items.map(i=>{const o=i.value===e.value,a=!!i.disabledReason;return n.qy`<button type="button" role=${t?"tab":"radio"} data-val=${i.value} aria-selected=${t?String(o):n.s6} aria-checked=${t?n.s6:String(o)} aria-disabled=${a?"true":n.s6} tabindex=${o?"0":"-1"} @click=${()=>{a||e.onChange(i.value)}} >${(0,s.Z)(i)}${i.label}</button>`})}</div>`}function r(e){const t="chip"+(e.tone?` is-${e.tone}`:"");return e.onClick?n.qy`<button type="button" class=${t} aria-pressed=${void 0===e.pressed?n.s6:String(e.pressed)} @click=${e.onClick}>${(0,s.Z)(e)}${e.label}</button>`:n.qy`<span class=${t}>${(0,s.Z)(e)}${e.label}</span>`}function l(e){const t=new o.Y({items:".tile",orientation:"both",onMove:t=>e.onPick(t.dataset.val)});return n.qy`<div class="tiles" role="radiogroup" aria-label=${e.label} @keydown=${t.onKeydown}> ${e.items.map(t=>{const i=t.value===e.value,o=i||void 0===e.value&&t===e.items[0];return n.qy`<button type="button" class="tile" role="radio" data-val=${t.value} aria-checked=${String(i)} tabindex=${o?"0":"-1"} @click=${()=>e.onPick(t.value)}> ${t.preview?n.qy`<span class="thumb">${t.preview}</span>`:(0,s.Z)(t,24)}<span>${t.label}</span> </button>`})}</div>`}},9530(e,t,i){i.d(t,{ZZ:()=>a,xH:()=>r});var n=i(6161),o=i(1141);const s=e=>`${e}-help`;function a(e){return n.qy`<div class="field"><div class="field-head"><label for=${e.id}>${e.label}</label> ${e.onReset?n.qy`<button type="button" class="icon-btn sm field-reset" aria-label=${e.resetLabel??""} title=${e.resetLabel??""} @click=${e.onReset}>${(0,o.Z)({icon:"mdi:restore"})}</button>`:n.s6}</div>${e.control} ${e.error?n.qy`<p class="help error" id=${t=e.id,`${t}-error`} role="alert">${e.error}</p>`:e.help?n.qy`<p class="help" id=${s(e.id)}>${e.help}</p>`:n.s6}</div>`;var t}function r(e){return n.qy`<div class="switch-row"><div class="txt"><div class="field-head"><label for=${e.id}>${e.label}</label></div>${e.help?n.qy`<p class="help" id=${s(e.id)}>${e.help}</p>`:n.s6}</div><button type="button" class="switch" id=${e.id} role="switch" aria-checked=${e.checked?"true":"false"} aria-describedby=${e.help?s(e.id):n.s6} ?disabled=${e.disabled} @click=${()=>e.onChange(!e.checked)} ></button></div>`}i.d(t,["bD",0,e=>"ltr"===e||"rtl"===e?e:"auto","te",0,s])},1141(e,t,i){i.d(t,{Z:()=>s});var n=i(6161),o=i(9943);function s(e,t=18){return e.glyph&&(0,o.ow)(e.glyph)?(0,o.Vq)(e.glyph,t):e.icon?n.qy`<ha-icon icon=${e.icon}></ha-icon>`:n.s6}},619(e,t,i){i.d(t,{x6:()=>n.x,jw:()=>s.jw,Ie:()=>a.I,ZZ:()=>o.ZZ,te:()=>o.te,Zj:()=>y,Bm:()=>_,lm:()=>a.l,nM:()=>b,S1:()=>f,aJ:()=>s.aJ,aw:()=>l.a,xH:()=>o.xH,os:()=>s.os,KE:()=>g,XV:()=>m});var n=i(3220),o=i(9530),s=i(7795),a=i(7634),r=i(1141),l=i(4313),c=i(6161),d=i(4489),h=i(5710),u=i(9943);let p=0;function m(e){const t=e.name?.error?"tb-name-err-"+ ++p:"";return c.qy`<header class="topbar">${(0,n.x)({...e.back,variant:"secondary",glyph:"arrowLeft",iconOnly:!1})}<h1 class="title">${e.title}</h1>${e.name?c.qy`<div class="name"><input class="input" type="text" aria-label=${e.name.label} placeholder=${e.name.placeholder??""} .value=${e.name.value} aria-invalid=${e.name.error?"true":c.s6} aria-describedby=${t||c.s6} @input=${t=>e.name?.onInput(t.target.value)} /> ${e.name.error?c.qy`<p class="help error" id=${t}>${e.name.error}</p>`:c.s6}</div>`:c.s6} <span class="spacer"></span> ${e.undo?(0,n.x)({...e.undo,iconOnly:!0}):c.s6} ${e.redo?(0,n.x)({...e.redo,iconOnly:!0}):c.s6} ${e.actions.map(e=>(0,n.x)(e))} ${e.help?(0,n.x)({...e.help,iconOnly:!0}):c.s6}</header>`}function g(e){const t=new h.Y({items:"button:not([disabled])",orientation:e.orientation}),i=(e,t)=>{if(!e)return;const i=Array.from(e.querySelectorAll("button:not([disabled])")),n=t&&i.includes(t)?t:i[0];for(const e of i)e.tabIndex=e===n?0:-1};return c.qy`<div class=${"rail"===e.kind?"rail":"toolbar"} role="toolbar" aria-label=${e.label} aria-orientation=${e.orientation} @keydown=${t.onKeydown} @focusin=${e=>i(e.currentTarget,e.composedPath()[0])} ${(0,d.K)(e=>{e&&queueMicrotask(()=>i(e,e.contains(document.activeElement)?document.activeElement:void 0))})} > ${e.items.map(t=>"divider"===t?c.qy`<span role="separator" aria-orientation=${"horizontal"===e.orientation?"vertical":"horizontal"}></span>`:(0,n.x)("float"!==e.kind||t.iconOnly?{...t,size:t.iconOnly&&"float"===e.kind?"sm":t.size}:{...t,size:"sm"}))}</div>`}function f(e){const t=4===e.level,i=(0,r.Z)(e,18);if(!e.collapsible){const n=c.qy`${i}${t?c.qy`<h4>${e.title}</h4>`:c.qy`<h3>${e.title}</h3>`}`;return c.qy`<div class="group-head">${n}</div>`}const n=c.qy`<button type="button" class="sector-btn" aria-expanded=${String(!!e.expanded)} @click=${()=>e.onToggle?.()}> ${i}<span class="nm">${e.title}</span><span class="chev">${(0,u.Vq)("chevronDown",20)}</span> </button>`;return t?c.qy`<h4 class="sector-head">${n}</h4>`:c.qy`<h3 class="sector-head">${n}</h3>`}const v=e=>{const t=!!e.disabledReason;return c.qy`<button type="button" class="icon-btn xs${"danger"===e.variant?" danger":""}" aria-label=${e.label} title=${e.label} aria-pressed=${void 0===e.pressed?c.s6:String(e.pressed)} aria-disabled=${t?"true":c.s6} ?disabled=${e.disabled} @click=${i=>{t||e.onClick(i)}} >${(0,r.Z)(e,18)}</button>`};function b(e){const t=void 0!==e.level,i=`row-${e.id}-check`,n=c.qy`<bdi>${e.name}</bdi>${e.sub?c.qy`<small>${e.sub}</small>`:c.s6}`,o=e.content?e.content:e.check?c.qy`<label class="name" for=${i}>${n}</label>`:c.qy`<button type="button" class="name" @click=${t=>e.onSelect?.(t)}>${n}</button>`;return c.qy`<div class="row${e.selected||e.check?.checked?" selected":""}" role=${t?"treeitem":"listitem"} aria-level=${t?String(e.level):c.s6} aria-selected=${t?String(!!e.selected):c.s6} aria-expanded=${void 0===e.expanded?c.s6:String(e.expanded)} style=${t?`--lvl:${Math.max(0,e.level-1)}`:c.s6} > ${e.grip?c.qy`<span class="grip" aria-hidden="true">${(0,u.Vq)("grip",18)}</span>`:c.s6} ${e.check?c.qy`<input type="checkbox" class="check" id=${i} aria-label=${e.check.label} .checked=${e.check.checked} @change=${t=>e.check.onChange(t.target.checked)} />`:c.s6} ${(0,r.Z)(e)}${e.lead??c.s6}${o} ${e.actions?.length?c.qy`<span class="acts">${e.actions.map(v)}</span>`:c.s6}${e.trail??c.s6}</div>`}const y=(e,t)=>t||!/^en(-|$)/i.test(e);function _(e){if(!e.translated)return c.qy`<span class="legal-text" id=${e.id}>${e.text}</span>`;const t=e.showEnglish;return c.qy`<span class="legal-text" id=${e.id} lang=${t?"en":c.s6} dir=${t?"ltr":c.s6}>${t?e.english:e.text}</span> <span class="legal-note">${e.prevailsLabel}</span> ${(0,n.x)({label:e.showLabel,size:"sm",variant:"secondary",expanded:t,controls:e.id,onClick:e.onToggle})}`}},1898(e,t,i){i.d(t,{J:()=>l});var n=i(6161),o=i(7804),s=i(8504),a=i(9530);class r extends o.WL{render(e){return e}update(e,[t]){const i=e,o=i.element,r=i.element;return"value"!==i.name||r.hasAttribute("dir")||r.classList.contains("mono")||"textarea"!==r.localName&&"text"!==r.type||r.setAttribute("dir",(0,a.bD)(void 0)),(1===i.type?i.element.getAttribute(i.name):o[i.name])===t?n.c0:((0,s.mY)(e),t)}}const l=(0,o.u$)(r)},4313(e,t,i){i.d(t,{a:()=>a});var n=i(6161),o=i(1413),s=i(1898);function a(e){const t=(t,i)=>{const n=t.target,o=Number(n.value);if(""===n.value||!Number.isFinite(o))return void(i&&(n.value=String(e.value)));const s=Math.max(e.min,Math.min(e.max,o));[...n.parentElement.querySelectorAll("input")].find(e=>e!==n).value=String(s),i?(n.value=String(s),e.onChange(s)):"range"===n.type&&e.onInput(s)},i=e=>t(e,!1),a=e=>t(e,!0);return n.qy`<div class="slider-row"><label for=${e.id}>${e.label}</label> <input id=${e.id} type="range" min=${e.min} max=${e.max} step=${e.step} .value=${(0,s.J)(String(e.value))} aria-valuetext=${(0,o.J)(e.valueText)} ?disabled=${e.disabled} @input=${i} @change=${a} /> <input class="input" type="number" min=${e.min} max=${e.max} step=${e.step} aria-label=${e.numberLabel??e.label} .value=${(0,s.J)(String(e.value))} ?disabled=${e.disabled} @input=${i} @change=${a} /> ${e.unit?n.qy`<span aria-hidden="true">${e.unit}</span>`:n.s6}</div>`}},7634(e,t,i){i.d(t,{I:()=>c,l:()=>l});var n=i(6161),o=i(9943),s=i(3220),a=i(1141);const r={info:"information",success:"check",warn:"help",error:"close"};function l(e){const t=Array.isArray(e.text)?e.text:[e.text];return n.qy`<div class="notice ${e.tone}${e.transient?" result-note":""}" role=${"error"===e.tone?"alert":"status"}> ${(0,o.Vq)(r[e.tone],20)}<div class="body">${t.map(e=>n.qy`<p>${e}</p>`)} ${e.action?n.qy`<div class="actions">${(0,s.x)({label:e.action.label,size:"sm",variant:"secondary",onClick:e.action.onClick})}</div>`:n.s6}</div></div>`}function c(e){return n.qy`<div class="empty">${(0,a.Z)(e,24)} <strong>${e.title}</strong> ${e.text?n.qy`<p>${e.text}</p>`:n.s6} ${e.action?(0,s.x)({...e.action,variant:e.action.variant??"secondary",size:"sm"}):n.s6}</div>`}},8258(e,t,i){i.d(t,{IC:()=>s,_Y:()=>a,cy:()=>o});var n=i(9851);function o(){const e=window.loadCardHelpers;return"function"==typeof e?Promise.resolve(e()):void 0}function s(e){if(customElements.get(e))return Promise.resolve();let t;return Promise.race([customElements.whenDefined(e),new Promise((i,o)=>{t=setTimeout(()=>o(new Error((0,n.t)(59,{tag:e}))),5e3)})]).finally(()=>clearTimeout(t))}function a(e){const t=e=>Array.isArray(e)?e.map(t):e&&"object"==typeof e?Object.fromEntries(Object.keys(e).sort().map(i=>[i,t(e[i])])):e;return JSON.stringify(t(e))??""}i.d(t,["k2",0,(e,t)=>({...t||{},type:e})])},2359(e,t,i){i.d(t,{B:()=>s,Gd:()=>o,ux:()=>a});var n=i(6511);function o(e){const t=new Set,i=e=>{if(Array.isArray(e))e.forEach(i);else if(e&&"object"==typeof e)for(const[o,s]of Object.entries(e))if("custom_animations"!==o)if("preset"===o&&(0,n.Bl)(s)){const e=(0,n._R)(s);e&&t.add(e)}else s&&"object"==typeof s&&i(s)};return i(e),[...t]}function s(e){return Array.isArray(e)?e.filter(e=>!!e&&"object"==typeof e):e&&"object"==typeof e?Object.entries(e).filter(([,e])=>!!e&&"object"==typeof e).map(([e,t])=>({id:e,...t})):[]}function a(e,t){const i=new Map(s(e.custom_animations).map(e=>[String(e.id),e])),a=new Map,r=[],l=o(e);for(;l.length;){const e=l.shift();if(a.has(e)||r.includes(e))continue;const o=t(e)??i.get(e);if(!o){r.push(e);continue}a.set(e,o);const s=o.steps;for(const e of Array.isArray(s)?s:[])"string"==typeof e?.animation&&e.animation.startsWith(n.D8)&&l.push((0,n._R)(e.animation))}if(!a.size)return{config:e,embedded:[],missing:r};const c=[...a.keys()];for(const[e,t]of i)a.has(e)||a.set(e,t);return{config:{...e,custom_animations:[...a.values()]},embedded:c,missing:r}}},9207(e,t,i){function n(e){if(null===e||"object"!=typeof e)return e;if(Array.isArray(e))return e.map(e=>n(e));const t={};for(const i of Object.keys(e))t[i]=n(e[i]);return t}i.d(t,{G:()=>n})},7173(e,t,i){function n(e){const t=new Set;return(e??[]).map((e,i)=>{const n=e&&"object"==typeof e?e:{},o="string"==typeof n.from?n.from:"",s="string"==typeof n.to?n.to:"";let a="string"==typeof n.id&&n.id?n.id:o&&s?`${o}>${s}`:`flow~${i}`;return t.has(a)&&(a=`${a}~${i}`),t.add(a),a})}i.d(t,{kc:()=>s,rP:()=>n});const o=new WeakMap;function s(e){let t=o.get(e);if(t)return t;const i=new Map,n=e=>{if(!e||"object"!=typeof e)return;if(Array.isArray(e))return void e.forEach(n);const t=e;"string"!=typeof t.id||"string"!=typeof t.type||i.has(t.id)||i.set(t.id,"string"==typeof t.entity&&"none"!==t.entity?t.entity:void 0);for(const e of["columns","modules","tabs"])n(t[e])};return n(e.rows),t=i,o.set(e,t),t}i.d(t,["Y1",0,{route:"curve",min:0,max:1e3,reverse_negative:!0,color:"var(--primary-color)",idle_color:"color-mix(in srgb, var(--secondary-text-color, #727272) 50%, transparent)",width:3,scale_width:!0,dots:3,dot_size:6,speed:2,min_speed:8,glow:0,label:"none",label_position:"auto",show_when:"always",layer:"back"}])},2074(e,t,i){i.d(t,{AJ:()=>w,De:()=>p,FQ:()=>k,Gz:()=>d,M3:()=>v,Mg:()=>_,Wn:()=>m,XT:()=>s,Yd:()=>b,aA:()=>u,cy:()=>f,fZ:()=>h,lm:()=>y,m1:()=>r,nZ:()=>x,pA:()=>$,pZ:()=>a,vm:()=>g});var n=i(6161),o=i(4951);function s(e,t,i,s){const r=t&&i&&(0,o.rJ)(i),l=s?.reset??n.s6;return r?n.qy`<div class="field-head"><label for=${s?.forId??n.s6}>${e}</label> ${l} ${a(t,i)}</div>`:n.qy`<div class="field-head"><label for=${s?.forId??n.s6}>${e}</label>${l}</div>`}function a(e,t){if(!(0,o.rJ)(t))return n.s6;const i=!(0,o.gJ)(t,e),s=(0,o.dy)(t,e);return n.qy` <mc-sync-indicator .synced=${i} .hasTemplate=${!0} .propertyPath=${s} .hideIfNoTemplate=${!0} @sync-toggle=${e=>{const t=new CustomEvent("field-sync-toggle",{detail:{propertyPath:e.detail.propertyPath,synced:e.detail.synced},bubbles:!0,composed:!0});e.target.dispatchEvent(t)}} ></mc-sync-indicator> `}function r(e,t){return n.qy`<div class=${"mc-field-hint"+(t?` ${t}`:"")}>${e}</div>`}function l(e){const t=(e||"").trim();if(!t)return{top:"",right:"",bottom:"",left:""};const i=t.split(/\s+/);return 1===i.length?{top:i[0],right:i[0],bottom:i[0],left:i[0]}:2===i.length?{top:i[0],right:i[1],bottom:i[0],left:i[1]}:3===i.length?{top:i[0],right:i[1],bottom:i[2],left:i[1]}:{top:i[0]||"",right:i[1]||"",bottom:i[2]||"",left:i[3]||""}}function c(e){const{top:t,right:i,bottom:n,left:o}=e;if(t||i||n||o)return t===i&&i===n&&n===o?t||void 0:t===n&&i===o?`${t||"0"} ${i||"0"}`:i===o?`${t||"0"} ${i||"0"} ${n||"0"}`:`${t||"0"} ${i||"0"} ${n||"0"} ${o||"0"}`}function d(e,t,i,o,a,r){return n.qy`<div class="mc-field">${s(e,o,a)} <input class="input ${r?.mono?"mono":""}" type="text" aria-label=${e||n.s6} spellcheck=${r?.mono?"false":n.s6} placeholder=${r?.placeholder??n.s6} .value=${t||""} @input=${e=>i(e.target.value)} /> </div>`}function h(e,t,i,o,a,r){return n.qy`<div class="mc-field">${s(e,a,r)}
      <textarea
        class="input"
        aria-label=${e||n.s6} .value=${t||""} rows=${String(o?.rows??4)} placeholder=${o?.placeholder??n.s6} @input=${e=>i(e.target.value)} ></textarea></div>`}function u(e,t,i,o,a,r){return n.qy`<div class="mc-field">${s(e,a,r)} <input class="input" type="number" aria-label=${e||n.s6} .value=${String(t??"")} min=${o?.min??n.s6} max=${o?.max??n.s6} step=${o?.step??n.s6} placeholder=${o?.placeholder??n.s6} @input=${e=>{const t=e.target.value;i(o?.optional&&""===t.trim()?NaN:Number(t))}} /> </div>`}function p(e,t,i,o,a,r,l){return n.qy`<div class="mc-field">${e?s(e,a,r):n.s6}<div class="select"><select class="input" aria-label=${e||n.s6} ?disabled=${!!l?.disabled} @change=${e=>o(e.target.value)} > ${i.map(e=>n.qy`<option value=${e.value} ?selected=${t===e.value}>${e.label}</option>`)} </select> <ha-icon icon="mdi:chevron-down"></ha-icon></div></div>`}function m(e,t,i,o,a,r){const l=i.some(e=>e.value===t)?t:i[0]?.value;return n.qy`<div class="mc-field">${s(e,a,r)}<div class="seg full" role="radiogroup" aria-label=${e} @keydown=${e=>{const t=i.findIndex(e=>e.value===l),n={ArrowRight:(t+1)%i.length,ArrowDown:(t+1)%i.length,ArrowLeft:(t-1+i.length)%i.length,ArrowUp:(t-1+i.length)%i.length,Home:0,End:i.length-1}[e.key];if(void 0===n)return;e.preventDefault();const s=e.currentTarget;o(i[n].value),requestAnimationFrame(()=>s.querySelector(`[data-val="${i[n].value}"]`)?.focus())}}> ${i.map(e=>{const t=e.value===l;return n.qy`<button type="button" role="radio" data-val=${e.value} aria-checked=${t?"true":"false"} tabindex=${t?"0":"-1"} @click=${()=>o(e.value)} >${e.label}</button>`})}</div></div>`}function g(e,t,i,o,a,r){return n.qy`<div class="switch-row"><div class="txt">${s(e,o,a)} ${r?n.qy`<p class="help">${r}</p>`:n.s6}</div><button type="button" class="switch" role="switch" aria-checked=${t?"true":"false"} aria-label=${e} @click=${()=>i(!t)} ></button></div>`}function f(e,t,i,o,a,r,l){return n.qy`<div class="mc-field">${s(e,r,l)} <mc-entity-picker .hass=${o} .value=${t||""} .domain=${a||""} @value-changed=${e=>i(e.detail.value)} ></mc-entity-picker></div>`}function v(e,t,i,o,a,r){return n.qy`<div class="mc-field">${s(e,a,r)} <mc-service-picker .hass=${o} .value=${t||""} @value-changed=${e=>i(e.detail.value)} ></mc-service-picker></div>`}function b(e,t,i,o,a,r="",l="",c){return n.qy`<div class="mc-field">${s(e,o,a)} <mc-color-picker .value=${t||""} .label=${e} .gradient=${r} .gradientNote=${l} .allowEntity=${!!c} .allowAttribute=${!!c} .entityColor=${c?.color??""} .entityAttributes=${c?.attributes} @value-changed=${e=>i(e.detail.value)} ></mc-color-picker></div>`}function y(e,t,i,o,a,r,l){return n.qy`<div class="mc-field">${s(e,o,a)} <mc-unit-field .units=${l} .value=${t||""} .label=${e} .placeholder=${r||""} @value-changed=${e=>i(e.detail.value)} ></mc-unit-field></div>`}function _(e,t,i,o,a,r){const d={[o]:t||""};return n.qy`<div class="mc-field">${s(e,a,r)} <mc-box-field .design=${d} .onChange=${e=>i(function(e,t,i){const n=l(e);return"string"==typeof i[t]?c(l(i[t])):("string"==typeof i[`${t}_top`]&&(n.top=i[`${t}_top`]),"string"==typeof i[`${t}_right`]&&(n.right=i[`${t}_right`]),"string"==typeof i[`${t}_bottom`]&&(n.bottom=i[`${t}_bottom`]),"string"==typeof i[`${t}_left`]&&(n.left=i[`${t}_left`]),"border_radius"===t&&("string"==typeof i.border_top_left_radius&&(n.top=i.border_top_left_radius),"string"==typeof i.border_top_right_radius&&(n.right=i.border_top_right_radius),"string"==typeof i.border_bottom_right_radius&&(n.bottom=i.border_bottom_right_radius),"string"==typeof i.border_bottom_left_radius&&(n.left=i.border_bottom_left_radius)),c(n))}(t,o,e))} .baseName=${o} .label=${e} ></mc-box-field></div>`}function w(e,t,i,o,a,r,l){return n.qy`<div class="mc-field">${s(e,a,r)} <mc-icon-picker .hass=${o} .animated=${l} .syncCtx=${r} .value=${t||""} @value-changed=${e=>i(e.detail.value||"")} ></mc-icon-picker></div>`}function $(e,t,i,o,a){return n.qy`<div class="mc-field">${s(e,o,a)} <mc-card-picker .value=${t||""} @value-changed=${e=>i(e.detail.value)} ></mc-card-picker></div>`}function x(e,t,i,o,a,r,l){return n.qy`<div class="mc-field">${s(e,r,l)} <mc-media-picker .hass=${o} .value=${t||""} .mediaType=${a||""} @value-changed=${e=>i(e.detail.value)} ></mc-media-picker></div>`}function k(e,t,i,o,a,r,l,c,d){if(!a||!o)return n.qy``;const h=o.states[a];return!h||0===Object.keys(h.attributes).length&&!d?.length?n.qy``:n.qy`<div class="mc-field">${s(e,r,l)} <mc-attribute-picker .hass=${o} .value=${t||""} .entityId=${a} .extras=${d??[]} @value-changed=${e=>i(e.detail.value)} ></mc-attribute-picker>${c?n.qy`<p class="help">${c}</p>`:n.s6}</div>`}i(7798),i(6796),i(2377)},5667(e,t,i){i.d(t,{Nk:()=>l,O6:()=>c,Rv:()=>a,WA:()=>o,rX:()=>r});var n=i(2502);function o(e){return"row"===e?.type||"tabs"===e?.type}function s(e,t){return(0,n.yZ)(e)?.[t.slot]?.[t.index]}function a(e,t){let i=e;for(const e of t)if(i=s(i,e),!i)return;return i}function r(e,t){const i=e;if("row"===e.type||"tabs"===e.type){const n=i["row"===e.type?"columns":"tabs"],o=n?.[t];if(!o)return;return Array.isArray(o.modules)||(o.modules=[]),o.modules}if(0===t&&(0,n.QN)(e))return Array.isArray(i.modules)||(i.modules=[]),i.modules}function l(e){return e.map(e=>`${e.slot}.${e.index}`).join("/")}function c(e,t,i){if(!t.length)return i;const[n,...o]=t,a=s(e,n);if(!a)return e;const r=c(a,o,i),l=e,d=e=>(e||[]).map((e,t)=>t===n.index?r:e);if("row"===e.type||"tabs"===e.type){const t="row"===e.type?"columns":"tabs",i=l[t].map((e,t)=>t===n.slot?{...e,modules:d(e.modules)}:e);return{...e,[t]:i}}return{...e,modules:d(l.modules)}}},6665(e,t,i){i.d(t,{BI:()=>s,WV:()=>r,oi:()=>o,t8:()=>a});const n=/^[A-Za-z0-9][A-Za-z0-9_-]*$/;function o(e){return"string"==typeof e?e.trim().replace(/^#+/,""):""}function s(e){return"string"==typeof e&&n.test(e)}function a(e){const t=o(e?.hash);return s(t)?t:void 0}function r(e,t){const i=e.split("#")[0];return t?`${i}#${t}`:i}i.d(t,["Uh",0,{style:"sheet",width:"600px",max_height:"90vh",backdrop_blur:"8px",backdrop_opacity:.4,show_close:!0,auto_close:0}])},3854(e,t,i){i.d(t,["Z",0,{winter:556,spring:450,summer:469,autumn:40,christmas:105,new_year:316,valentine:536,easter:176,halloween:232,snow:436,rain:374,storm:514,sun:471,clouds:112,fog:207,wind:555,night:317,dusk:170}])},8100(e,t,i){i.d(t,{GR:()=>v,Oo:()=>$,RC:()=>d,Z:()=>y,a0:()=>A,aD:()=>S,ot:()=>f,rG:()=>M,s$:()=>_,ws:()=>x});var n=i(796),o=i(12);const s=["winter","spring","summer","autumn","christmas","new_year","valentine","easter","halloween","weather","daynight"],a={christmas:"12-01..12-26",new_year:"12-31..01-01",valentine:"02-14..02-14",easter:"auto",halloween:"10-24..10-31"},r=["new_year","christmas","valentine","easter","halloween"],l=[31,29,31,30,31,30,31,31,30,31,30,31];function c(e){const t=/^(\d\d)-(\d\d)$/.exec(e.trim());if(!t)return;const i=Number(t[1]),n=Number(t[2]);return i<1||i>12||n<1||n>l[i-1]?void 0:{month:i,day:n}}function d(e){if("string"!=typeof e)return;const t=e.split("..");if(t.length>2)return;const i=c(t[0]),n=2===t.length?c(t[1]):i;return i&&n?{start:i,end:n}:void 0}const h=e=>100*e.month+e.day;function u(e,t){const i=h({month:e.getMonth()+1,day:e.getDate()}),n=h(t.start),o=h(t.end);return n<=o?i>=n&&i<=o:i>=n||i<=o}function p(e){const t=function(e){const t=e%19,i=Math.floor(e/100),n=e%100,o=Math.floor(i/4),s=i%4,a=Math.floor((i+8)/25),r=(19*t+i-o-Math.floor((i-a+1)/3)+15)%30,l=(32+2*s+2*Math.floor(n/4)-r-n%4)%7,c=Math.floor((t+11*r+22*l)/451),d=Math.floor((r+l-7*c+114)/31);return new Date(e,d-1,(r+l-7*c+114)%31+1)}(e),i=e=>{const i=new Date(t.getFullYear(),t.getMonth(),t.getDate()+e);return{month:i.getMonth()+1,day:i.getDate()}};return{start:i(-7),end:i(1)}}const m=["winter","winter","spring","spring","spring","summer","summer","summer","autumn","autumn","autumn","winter"],g={winter:"summer",summer:"winter",spring:"autumn",autumn:"spring"};function f(e){return"string"==typeof e&&"south"===e.trim().toLowerCase()?"south":"north"}function v(e,t={}){return function(e,t){for(const i of r){const n=t?.[i];if(!1===n||"string"==typeof n&&"off"===n.trim().toLowerCase())continue;const o="string"==typeof n&&"auto"!==n.trim().toLowerCase()&&d(n)?n:a[i],s="auto"===o?"easter"===i?p(e.getFullYear()):void 0:d(o);if(s&&u(e,s))return i}}(e,t.calendar)??function(e,t="north"){const i=m[e.getMonth()];return"south"===t?g[i]:i}(e,f(t.hemisphere))}function b(e,t){try{const i=new Intl.DateTimeFormat("en-US",{timeZone:t,hourCycle:"h23",year:"numeric",month:"numeric",day:"numeric",hour:"numeric",minute:"numeric",second:"numeric"}).formatToParts(e),n=e=>Number(i.find(t=>t.type===e)?.value),o={y:n("year"),mo:n("month"),d:n("day"),h:n("hour")%24,mi:n("minute"),s:n("second")};return Object.values(o).every(Number.isFinite)?o:void 0}catch{return}}function y(e,t){const i=(0,n.cj)(t),o=i?b(e,i):void 0;return o?new Date(o.y,o.mo-1,o.d,o.h,o.mi,o.s,e.getMilliseconds()):e}function _(e,t){const i=(0,n.cj)(t),o=i?b(e,i):void 0;if(!o)return new Date(e.getFullYear(),e.getMonth(),e.getDate()+1,0,0,0,0);const s=1e3*(60*(60*o.h+o.mi)+o.s)+e.getMilliseconds();return new Date(e.getTime()+864e5-s)}const w=new Set(s);function $(e){if(null!=e&&!1!==e)return!0===e?{}:"string"==typeof e?{scene:e}:"object"!=typeof e||Array.isArray(e)?void 0:e}function x(e){const t=e?.combine;return(Array.isArray(t)?t:"string"==typeof t?[t]:[]).filter(e=>"string"==typeof e&&""!==e.trim())}function k(e,t,i,n){const s=void 0===e?"auto":e;return"auto"===s?v(i,t):"string"==typeof s&&w.has(s)?"weather"===s?function(e,t){return e.weather_entity?(0,o.J4)(t?.states?.[e.weather_entity]?.state):void 0}(t,n):"daynight"===s?function(e){const t=e?.states?.["sun.sun"],i=t?.attributes?.elevation;return(0,o.p5)(t?.state,"number"==typeof i?i:"string"==typeof i&&""!==i.trim()?Number(i):void 0)}(n):s:void 0}function C(e){const t="string"==typeof e&&e.includes("%");let i="number"==typeof e?e:"string"==typeof e&&/^\s*-?\d*\.?\d+\s*%?\s*$/.test(e)?parseFloat(e):NaN;return Number.isFinite(i)?(!t&&i>0&&i<=1&&(i*=100),Math.round(Math.min(100,Math.max(0,i)))/100):.5}function M(e,t,i,n={}){const o=$(e);if(n.localDay||(t=y(t,i)),!o)return;if(o.entity&&"off"===i?.states?.[o.entity]?.state)return;const s=[],a=e=>{e&&!s.includes(e)&&s.push(e)};a(k(o.scene,o,t,i));for(const e of x(o))a(k(e,o,t,i));return s.length?{scenes:s,layer:"front"===o.layer?"front":"back",intensity:C(o.intensity),decorations:!1!==o.decorations}:void 0}function S(e){const t=$(e);if(!t)return[];const i=A(t),n=[];return t.entity&&n.push(t.entity),t.weather_entity&&i.includes("weather")&&n.push(t.weather_entity),i.includes("daynight")&&n.push("sun.sun"),n}function A(e){return[e.scene??"auto",...x(e)]}i.d(t,["MX",0,s,"jF",0,a])},4951(e,t,i){function n(...e){return e.filter(e=>void 0!==e&&""!==e).map(e=>String(e)).join(".")}function o(e,t){const i=e.basePath?n(e.basePath,t):t;return e.notSynced.includes(i)}function s(e){return!!e.templateName}function a(e,t){return e.basePath?n(e.basePath,t):t}i.d(t,{dy:()=>a,gJ:()=>o,rJ:()=>s})},98(e,t,i){i.d(t,{G:()=>h,cY:()=>c,lA:()=>l,u7:()=>r});const n={daily:1,hourly:2,twice_daily:4},o=["daily","hourly","twice_daily"],s={"clear-night":"mdi:weather-night",cloudy:"mdi:weather-cloudy",exceptional:"mdi:alert-circle-outline",fog:"mdi:weather-fog",hail:"mdi:weather-hail",lightning:"mdi:weather-lightning","lightning-rainy":"mdi:weather-lightning-rainy",partlycloudy:"mdi:weather-partly-cloudy",pouring:"mdi:weather-pouring",rainy:"mdi:weather-rainy",snowy:"mdi:weather-snowy","snowy-rainy":"mdi:weather-snowy-rainy",sunny:"mdi:weather-sunny",windy:"mdi:weather-windy","windy-variant":"mdi:weather-windy-variant"},a={sunny:"mdi:weather-night",partlycloudy:"mdi:weather-night-partly-cloudy"};function r(e,t=!1){const i=e??"";return t&&a[i]||s[i]||"mdi:weather-partly-cloudy"}function l(e){const t=Number(e?.attributes.supported_features)||0;return o.filter(e=>t&n[e])}function c(e,t,i){if("unavailable"===e.state||"unknown"===e.state)return{status:"unavailable"};const n=l(e),o=function(e){const t=e.attributes.forecast;return Array.isArray(t)?t:void 0}(e),s=t??"daily";if(!n.length)return o?{status:"ok",type:s,forecast:o}:{status:"none"};const a=t&&n.includes(t)?t:n[0],r=i?.subscribe?.({type:"weather/subscribe_forecast",entity_id:e.entity_id,forecast_type:a});return"ok"===r?.status?{status:"ok",type:a,forecast:r.data?.forecast??[]}:o?{status:"ok",type:a,forecast:o}:r&&"unavailable"!==r.status?r:{status:"pending"}}const d=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];function h(e){if(null==e||""===e)return"";const t=Number(e);return Number.isNaN(t)?String(e):d[Math.round((t%360+360)%360/22.5)%16]}},5395(e,t,i){i.d(t,{EA:()=>a,fE:()=>s});var n=i(382);const o=n.OU.withTags(n.LJ);function s(e){try{return n.Bh(e,{indent:2,lineWidth:120,noRefs:!0,sortKeys:!1})}catch{return""}}function a(e){try{return n.Hh(e,{schema:o})}catch{return null}}},6505(e,t,i){i.d(t,["E",0,e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)}])},5694(e,t,i){i.d(t,{M:()=>a});var n=i(8760);const o={attribute:!0,type:String,converter:n.W3,reflect:!1,hasChanged:n.Ec},s=(e=o,t,i)=>{const{kind:n,metadata:s}=i;let a=globalThis.litPropertyMetadata.get(s);if(void 0===a&&globalThis.litPropertyMetadata.set(s,a=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),a.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const o=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,o,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const o=this[n];t.call(this,i),this.requestUpdate(n,o,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function a(e){return(t,i)=>"object"==typeof i?s(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}},4290(e,t,i){i.d(t,{w:()=>o});var n=i(5694);function o(e){return(0,n.M)({...e,state:!0,attribute:!1})}},382(e,t,i){i.d(t,{Bh:()=>Ti,Hh:()=>Tt,LJ:()=>I,OU:()=>te});var n=Symbol("NOT_RESOLVED");function o(e,t){return{tagName:e,nodeKind:"scalar",implicit:t.implicit??!1,matchByTagPrefix:t.matchByTagPrefix??!1,implicitFirstChars:t.implicitFirstChars??null,resolve:t.resolve,identify:t.identify,represent:t.represent??(e=>String(e)),representTagName:t.representTagName??(()=>e)}}function s(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"sequence",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addItem:t.addItem,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}function a(e,t){const i=void 0===t.finalize;return{tagName:e,nodeKind:"mapping",implicit:!1,matchByTagPrefix:t.matchByTagPrefix??!1,create:t.create,addPair:t.addPair,has:t.has,keys:t.keys,get:t.get,finalize:t.finalize??(e=>e),carrierIsResult:i,identify:t.identify,represent:t.represent??(e=>e),representTagName:t.representTagName??(()=>e)}}var r=o("tag:yaml.org,2002:str",{resolve:e=>e,identify:e=>"string"==typeof e}),l=["","~","null","Null","NULL"],c=o("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==l.indexOf(e)?null:n,identify:e=>null===e,represent:()=>"null"}),d=o("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["n"],resolve:(e,t)=>"null"===e||t&&""===e?null:n,identify:e=>null===e,represent:()=>"null"}),h=["","~","null","Null","NULL"],u=o("tag:yaml.org,2002:null",{implicit:!0,implicitFirstChars:["","~","n","N"],resolve:e=>-1!==h.indexOf(e)?null:n,identify:e=>null===e,represent:()=>"null"}),p=["true","True","TRUE"],m=["false","False","FALSE"],g=o("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","T","f","F"],resolve:e=>-1!==p.indexOf(e)||-1===m.indexOf(e)&&n,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),f=["true"],v=["false"],b=o("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["t","f"],resolve:e=>-1!==f.indexOf(e)||-1===v.indexOf(e)&&n,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),y=["true","True","TRUE","y","Y","yes","Yes","YES","on","On","ON"],_=["false","False","FALSE","n","N","no","No","NO","off","Off","OFF"],w=o("tag:yaml.org,2002:bool",{implicit:!0,implicitFirstChars:["y","Y","n","N","t","T","f","F","o","O"],resolve:e=>-1!==y.indexOf(e)||-1===_.indexOf(e)&&n,identify:e=>"[object Boolean]"===Object.prototype.toString.call(e),represent:e=>e?"true":"false"}),$=new RegExp("^(?:0o[0-7]+|0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),x=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),k=o("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e,t){if(t){if(!x.test(e))return n}else if(!$.test(e))return n;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:n},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),C=new RegExp("^-?(?:0|[1-9][0-9]*)$"),M=new RegExp("^(?:[-+]?0b[0-1]+|[-+]?0o[0-7]+|[-+]?0x[0-9a-fA-F]+|[-+]?[0-9]+)$"),S=o("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!M.test(e))return n}else if(!C.test(e))return n;const i=function(e){let t=e,i=1;return"-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b")?i*parseInt(t.slice(2),2):t.startsWith("0o")?i*parseInt(t.slice(2),8):t.startsWith("0x")?i*parseInt(t.slice(2),16):i*parseInt(t,10)}(e);return Number.isFinite(i)?i:n},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),A=new RegExp("^(?:[-+]?0b[0-1_]+|[-+]?0[0-7_]+|[-+]?0x[0-9a-fA-F_]+|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+|[-+]?(?:0|[1-9][0-9_]*))$"),q=o("tag:yaml.org,2002:int",{implicit:!0,implicitFirstChars:["-","+",..."0123456789"],resolve:function(e){if(!A.test(e))return n;const t=function(e){let t=e.replace(/_/g,""),i=1;if("-"!==t[0]&&"+"!==t[0]||("-"===t[0]&&(i=-1),t=t.slice(1)),t.startsWith("0b"))return i*parseInt(t.slice(2),2);if(t.startsWith("0x"))return i*parseInt(t.slice(2),16);if(t.includes(":")){let e=0;for(const i of t.split(":"))e=60*e+Number(i);return i*e}return"0"!==t&&"0"===t[0]?i*parseInt(t,8):i*parseInt(t,10)}(e);return Number.isFinite(t)?t:n},identify:e=>Number.isInteger(e)&&!Object.is(e,-0)&&e.toString(10).indexOf("e")<0,represent:e=>e.toString(10)}),E=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),j=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),T=o("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!E.test(e))return n;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const o=i*parseFloat(t);return Number.isFinite(o)||j.test(e)?o:n},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),z=new RegExp("^-?(?:0|[1-9][0-9]*)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$"),L=new RegExp("^(?:[-+]?[0-9]+(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|[-+]?\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),O=o("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-",..."0123456789"],resolve:function(e,t){if(t){if(!L.test(e))return n;let t=e.toLowerCase();const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;const o=i*parseFloat(t);return Number.isFinite(o)?o:n}if(!z.test(e))return n;const i=Number(e);return Number.isFinite(i)?i:n},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),R=new RegExp("^(?:[-+]?(?:(?:[0-9][0-9_]*)?\\.[0-9_]*)(?:[eE][-+][0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),P=new RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"),H=o("tag:yaml.org,2002:float",{implicit:!0,implicitFirstChars:["-","+",".",..."0123456789"],resolve:function(e){if(!R.test(e))return n;let t=e.toLowerCase().replace(/_/g,"");const i="-"===t[0]?-1:1;if("+-".includes(t[0])&&(t=t.slice(1)),".inf"===t)return 1===i?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;if(".nan"===t)return NaN;let o=0;if(t.includes(":")){for(const e of t.split(":"))o=60*o+Number(e);o*=i}else o=i*parseFloat(t);return Number.isFinite(o)||P.test(e)?o:n},identify:e=>"number"==typeof e&&(!Number.isInteger(e)||Object.is(e,-0)||e.toString(10).indexOf("e")>=0),represent:function(e){if(isNaN(e))return".nan";if(e===Number.POSITIVE_INFINITY)return".inf";if(e===Number.NEGATIVE_INFINITY)return"-.inf";if(Object.is(e,-0))return"-0.0";const t=e.toString(10);return/^[-+]?[0-9]+e/.test(t)?t.replace("e",".e"):t}}),I=o("tag:yaml.org,2002:merge",{implicit:!0,implicitFirstChars:["<"],resolve:(e,t)=>"<<"===e||t&&""===e?"<<":n,identify:()=>!1}),V=/^[A-Za-z0-9+/]*={0,2}$/,D=o("tag:yaml.org,2002:binary",{resolve:function(e){const t=e.replace(/\s/g,"");if(t.length%4!=0||!V.test(t))return n;const i=atob(t),o=new Uint8Array(i.length);for(let e=0;e<i.length;e++)o[e]=i.charCodeAt(e);return o},identify:e=>"[object Uint8Array]"===Object.prototype.toString.call(e),represent:function(e){let t="";for(let i=0;i<e.length;i++)t+=String.fromCharCode(e[i]);return btoa(t)}}),F=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),N=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function Z(e,t,i,n=0,o=0,s=0,a=0){const r=new Date(Date.UTC(e,t,i,n,o,s,a));return r.setUTCFullYear(e,t,i),r}var B=o("tag:yaml.org,2002:timestamp",{implicit:!0,implicitFirstChars:[..."0123456789"],resolve:function(e){let t=F.exec(e);if(null===t&&(t=N.exec(e)),null===t)return n;const i=+t[1],o=+t[2]-1,s=+t[3];if(!t[4]){const e=Z(i,o,s);return e.getUTCFullYear()!==i||e.getUTCMonth()!==o||e.getUTCDate()!==s?n:e}const a=+t[4],r=+t[5],l=+t[6];let c=0;if(a>23||r>59||l>59)return n;if(t[7]){let e=t[7].slice(0,3);for(;e.length<3;)e+="0";c=+e}const d=Z(i,o,s,a,r,l,c);if(d.getUTCFullYear()!==i||d.getUTCMonth()!==o||d.getUTCDate()!==s)return n;if(t[9]){const e=+t[10],i=+(t[11]||0);if(e>23||i>59)return n;const o=6e4*(60*e+i);d.setTime(d.getTime()-("-"===t[9]?-o:o))}return d},identify:e=>e instanceof Date,represent:e=>e.toISOString()}),K=s("tag:yaml.org,2002:seq",{create:()=>[],addItem:(e,t)=>{e.push(t)},identify:Array.isArray});function W(e){if(null===e||"object"!=typeof e||Array.isArray(e))return!1;const t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function U(e,t){const i={};for(const n of t)void 0!==e[n]&&(i[n]=e[n]);return i}var G=s("tag:yaml.org,2002:omap",{create:()=>({list:[],seen:new Set}),addItem:(e,t)=>{let i;if(t instanceof Map){if(1!==t.size)return"cannot resolve an ordered map item";i=t.keys().next().value}else{if(!W(t))return"cannot resolve an ordered map item";{const e=Object.keys(t);if(1!==e.length)return"cannot resolve an ordered map item";i=e[0]}}return e.seen.has(i)?"duplicate key in ordered map":(e.seen.add(i),e.list.push(t),"")},finalize:e=>e.list,identify:()=>!1}),Y=s("tag:yaml.org,2002:pairs",{create:()=>[],addItem:(e,t)=>{if(t instanceof Map)return 1!==t.size?"cannot resolve a pairs item":(e.push(t.entries().next().value),"");if("[object Object]"!==Object.prototype.toString.call(t))return"cannot resolve a pairs item";const i=t,n=Object.keys(i);return 1!==n.length?"cannot resolve a pairs item":(e.push([n[0],i[n[0]]]),"")},identify:()=>!1}),Q=a("tag:yaml.org,2002:map",{create:()=>({}),identify:W,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{if(null!==t&&"object"==typeof t)return"object-based map does not support complex keys";const n=String(t);return"__proto__"===n?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,""},has:(e,t)=>(null===t||"object"!=typeof t)&&Object.prototype.hasOwnProperty.call(e,String(t)),keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}}),J=a("tag:yaml.org,2002:set",{create:()=>new Set,identify:e=>e instanceof Set,represent:e=>{const t=new Map;for(const i of e)t.set(i,null);return t},addPair:(e,t,i)=>null!==i?"cannot resolve a set item":(e.add(t),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:()=>null}),X=class e{tags;implicitScalarTags;implicitScalarByFirstChar;implicitScalarAnyFirstChar;defaultScalarTag;defaultSequenceTag;defaultMappingTag;exact;prefix;constructor(e){const t=function(e){const t=[];for(const i of e){let e=t.length;for(let n=0;n<t.length;n++){const o=t[n];if(o.nodeKind===i.nodeKind&&o.tagName===i.tagName&&o.matchByTagPrefix===i.matchByTagPrefix){e=n;break}}t[e]=i}return t}(e),i=[],n={scalar:Object.create(null),sequence:Object.create(null),mapping:Object.create(null)},o={scalar:[],sequence:[],mapping:[]};for(const e of t){if("scalar"===e.nodeKind&&e.implicit){if(e.matchByTagPrefix)throw new Error("Implicit scalar tags cannot match by tag prefix");i.push(e)}switch(e.nodeKind){case"scalar":e.matchByTagPrefix?o.scalar.push(e):n.scalar[e.tagName]=e;break;case"sequence":e.matchByTagPrefix?o.sequence.push(e):n.sequence[e.tagName]=e;break;case"mapping":e.matchByTagPrefix?o.mapping.push(e):n.mapping[e.tagName]=e}}const s=i.filter(e=>null===e.implicitFirstChars),a=new Set;for(const e of i)if(null!==e.implicitFirstChars)for(const t of e.implicitFirstChars)a.add(t);const r=new Map;for(const e of a)r.set(e,i.filter(t=>null===t.implicitFirstChars||-1!==t.implicitFirstChars.indexOf(e)));const l=n.scalar["tag:yaml.org,2002:str"];if(!l)throw new Error("schema does not define the default scalar tag (tag:yaml.org,2002:str)");this.tags=t,this.implicitScalarTags=i,this.implicitScalarByFirstChar=r,this.implicitScalarAnyFirstChar=s,this.defaultScalarTag=l,this.defaultSequenceTag=n.sequence["tag:yaml.org,2002:seq"],this.defaultMappingTag=n.mapping["tag:yaml.org,2002:map"],this.exact=n,this.prefix=o}lookupScalarTag(e){const t=this.exact.scalar[e];if(t)return t;for(const t of this.prefix.scalar)if(e.startsWith(t.tagName))return t}lookupSequenceTag(e){const t=this.exact.sequence[e];if(t)return t;for(const t of this.prefix.sequence)if(e.startsWith(t.tagName))return t}lookupMappingTag(e){const t=this.exact.mapping[e];if(t)return t;for(const t of this.prefix.mapping)if(e.startsWith(t.tagName))return t}resolveImplicitScalarTag(e){const t=this.implicitScalarByFirstChar.get(e.charAt(0))??this.implicitScalarAnyFirstChar;for(const i of t){const t=i.resolve(e,!1,i.tagName);if(t!==n)return{value:t,tag:i}}const i=this.defaultScalarTag;return{value:i.resolve(e,!1,i.tagName),tag:i}}withTags(...t){let i=[];for(const e of t)i=i.concat(e);return new e([...this.tags,...i])}},ee=new X([r,K,Q]),te=(new X([...ee.tags,d,b,S,O]),new X([...ee.tags,c,g,k,T])),ie=new X([...ee.tags,u,w,q,H,B,I,D,G,Y,J]).withTags({...q,resolve:(e,t,i)=>{const o=q.resolve(e,t,i);return o===n?k.resolve(e,t,i):o}},{...H,resolve:(e,t,i)=>{const o=H.resolve(e,t,i);return o===n?T.resolve(e,t,i):o}});function ne(e){if(Array.isArray(e)){const t=Array.prototype.slice.call(e);for(let e=0;e<t.length;e++){if(Array.isArray(t[e]))return null;"object"==typeof t[e]&&"[object Object]"===Object.prototype.toString.call(t[e])&&(t[e]="[object Object]")}return String(t)}return"object"==typeof e&&"[object Object]"===Object.prototype.toString.call(e)?"[object Object]":String(e)}a("tag:yaml.org,2002:map",{create:()=>new Map,addPair:(e,t,i)=>(e.set(t,i),""),has:(e,t)=>e.has(t),keys:e=>e.keys(),get:(e,t)=>e.get(t),identify:e=>e instanceof Map||W(e),represent:e=>{if(e instanceof Map)return e;const t=new Map,i=e;for(const e of Object.keys(i))t.set(e,i[e]);return t}}),a("tag:yaml.org,2002:map",{create:()=>({}),identify:W,represent:e=>{const t=new Map;for(const i of Object.keys(e))t.set(i,e[i]);return t},addPair:(e,t,i)=>{const n=ne(t);return null===n?"nested arrays are not supported inside keys":("__proto__"===n?Object.defineProperty(e,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[n]=i,"")},has:(e,t)=>{const i=ne(t);return null!==i&&Object.prototype.hasOwnProperty.call(e,i)},keys:e=>Object.keys(e),get:(e,t)=>{const i=String(t);return Object.prototype.hasOwnProperty.call(e,i)?e[i]:null}});var oe={maxLength:79,indent:1,linesBefore:3,linesAfter:2};function se(e,t,i,n,o){let s="",a="";const r=Math.floor(o/2)-1;return n-t>r&&(s=" ... ",t=n-r+s.length),i-n>r&&(a=" ...",i=n+r-a.length),{str:s+e.slice(t,i).replace(/\t/g,"→")+a,pos:n-t+s.length}}function ae(e,t){return" ".repeat(Math.max(t-e.length,0))+e}function re(e,t){let i="";return e.mark?(e.mark.name&&(i+=`in "${e.mark.name}" `),i+=`(${e.mark.line+1}:${e.mark.column+1})`,!t&&e.mark.snippet&&(i+=`\n\n${e.mark.snippet}`),`${e.reason} ${i}`):e.reason}var le=class e extends Error{reason;mark;constructor(e,t){super(),this.name="YAMLException",this.reason=e,this.mark=t,this.message=re(this,!1),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}toString(e){return`${this.name}: ${re(this,e)}`}static throwAt(t,i,n,o=""){let s=0,a=0;for(let e=0;e<i;e++){const i=t.charCodeAt(e);10===i?(s++,a=e+1):13===i&&(s++,10===t.charCodeAt(e+1)&&e++,a=e+1)}const r={name:o,buffer:t,position:i,line:s,column:i-a};throw r.snippet=function(e){if(!e.buffer)return null;const t={...oe},i=/\r?\n|\r|\0/g,n=[0],o=[];let s,a=-1;for(;s=i.exec(e.buffer);)o.push(s.index),n.push(s.index+s[0].length),e.position<=s.index&&a<0&&(a=n.length-2);a<0&&(a=n.length-1);let r="";const l=Math.min(e.line+t.linesAfter,o.length).toString().length,c=t.maxLength-(t.indent+l+3);for(let i=1;i<=t.linesBefore&&!(a-i<0);i++){const s=se(e.buffer,n[a-i],o[a-i],e.position-(n[a]-n[a-i]),c);r=`${" ".repeat(t.indent)}${ae((e.line-i+1).toString(),l)} | ${s.str}\n${r}`}const d=se(e.buffer,n[a],o[a],e.position,c);r+=`${" ".repeat(t.indent)}${ae((e.line+1).toString(),l)} | ${d.str}\n`,r+=`${"-".repeat(t.indent+l+3+d.pos)}^\n`;for(let i=1;i<=t.linesAfter&&!(a+i>=o.length);i++){const s=se(e.buffer,n[a+i],o[a+i],e.position-(n[a]-n[a+i]),c);r+=`${" ".repeat(t.indent)}${ae((e.line+i+1).toString(),l)} | ${s.str}\n`}return r.replace(/\n$/,"")}(r),new e(n,r)}};function ce(e){switch(e){case 48:return"\0";case 97:return"";case 98:return"\b";case 116:case 9:return"\t";case 110:return"\n";case 118:return"\v";case 102:return"\f";case 114:return"\r";case 101:return"";case 32:return" ";case 34:return'"';case 47:return"/";case 92:return"\\";case 78:return"";case 95:return" ";case 76:return"\u2028";case 80:return"\u2029";default:return""}}var de=new Array(256),he=new Array(256);for(let e=0;e<256;e++)de[e]=ce(e)?1:0,he[e]=ce(e);function ue(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}function pe(e){return e>=48&&e<=57?e-48:(32|e)-97+10}function me(e){return 120===e?2:117===e?4:8}function ge(e,t,i){let n=0;for(;t<i;){const i=e.charCodeAt(t);if(10===i)n++,t++;else if(13===i)n++,t++,10===e.charCodeAt(t)&&t++;else{if(32!==i&&9!==i)break;t++}}return{position:t,breaks:n}}function fe(e){return 1===e?" ":"\n".repeat(e-1)}function ve(e,t,i,n,o,s){const a=n<0?0:n,r=e.slice(t,i).replace(/\r\n?/g,"\n"),l=""===r?[]:(r.endsWith("\n")?r.slice(0,-1):r).split("\n");let c="",d=!1,h=0,u=!1;for(const e of l){let t=0;for(;t<a&&32===e.charCodeAt(t);)t++;if(n<0||t>=e.length){h++;continue}const i=e.slice(a),o=i.charCodeAt(0);s?32===o||9===o?(u=!0,c+="\n".repeat(d?1+h:h)):u?(u=!1,c+="\n".repeat(h+1)):0===h?d&&(c+=" "):c+="\n".repeat(h):c+="\n".repeat(d?1+h:h),c+=i,d=!0,h=0}return 3===o?c+="\n".repeat(d?1+h:h):2!==o&&d&&(c+="\n"),c}var be=Object.assign(Object.create(null),{"!":"!","!!":"tag:yaml.org,2002:"}),ye="-#;/?:@&=+$_.~*'()",_e=ye+"!,[]",we="0123456789ABCDEF";function $e(e){return"%"+we[e>>4]+we[15&e]}function xe(e,t){const i=t?ye:_e;let n="";for(let t=0;t<e.length;t++){let o=e.charCodeAt(t);o>=48&&o<=57||o>=65&&o<=90||o>=97&&o<=122||i.includes(e[t])?n+=e[t]:(o>=55296&&o<=56319&&(o=65536+((1023&o)<<10)+(1023&e.charCodeAt(++t))),n+=o<128?$e(o):o<2048?$e(192|o>>6)+$e(128|63&o):o<65536?$e(224|o>>12)+$e(128|o>>6&63)+$e(128|63&o):$e(240|o>>18)+$e(128|o>>12&63)+$e(128|o>>6&63)+$e(128|63&o))}return n}function ke(e){let t="",i=0;for(;i<e.length;){if(37!==e.charCodeAt(i)){t+=e[i++];continue}let n=parseInt(e.slice(i+1,i+3),16);if(i+=3,n>=192){let t=n<224?1:n<240?2:3;for(n&=(1<<6-t)-1;t-- >0;)n=n<<6|63&parseInt(e.slice(i+1,i+3),16),i+=3}n<65536?t+=String.fromCharCode(n):(n-=65536,t+=String.fromCharCode(55296|n>>10,56320|1023&n))}return t}function Ce(e,t){if(e.startsWith("!<")&&e.endsWith(">"))return ke(e.slice(2,-1));const i=e.indexOf("!",1),n=-1===i?"!":e.slice(0,i+1);return ke(t?.[n]??be[n]??n)+ke(e.slice(n.length))}function Me(e){let t=e;return 33===t.charCodeAt(0)?(t=t.slice(1),`!${xe(t,!0)}`):"tag:yaml.org,2002:"===t.slice(0,18)?`!!${xe(t.slice(18),!0)}`:`!<${xe(t,!1)}>`}var Se=-1,Ae={filename:"",schema:te,json:!1,maxTotalMergeKeys:1e4,maxAliases:-1};function qe(e){return"tagStart"in e&&e.tagStart!==Se?e.tagStart:"anchorStart"in e&&e.anchorStart!==Se?e.anchorStart:"valueStart"in e&&e.valueStart!==Se?e.valueStart:"start"in e?e.start:0}function Ee(e,t){le.throwAt(e.source,e.position,t,e.filename)}function je(e,t,i,n){try{return i.finalize(n)}catch(i){if(i instanceof le)throw i;le.throwAt(e.source,t,i instanceof Error?i.message:String(i),e.filename)}}function Te(e,t){const i=function(e,t){if(-1===t.valueStart)return"";const{valueStart:i,valueEnd:n}=t;if(t.fast)return e.slice(i,n);switch(t.style){case 2:return function(e,t,i){let n="",o=t,s=t,a=t;for(;o<i;){const t=e.charCodeAt(o);if(39===t)n+=e.slice(s,o)+"'",o+=2,s=a=o;else if(10===t||13===t){n+=e.slice(s,a);const t=ge(e,o,i);n+=fe(t.breaks),o=s=a=t.position}else o++,32!==t&&9!==t&&(a=o)}return n+e.slice(s,i)}(e,i,n);case 3:return function(e,t,i){let n="",o=t,s=t,a=t;for(;o<i;){const t=e.charCodeAt(o);if(92===t){n+=e.slice(s,o),o++;const t=e.charCodeAt(o);if(10===t||13===t)o=ge(e,o,i).position;else if(t<256&&de[t])n+=he[t],o++;else{let i=me(t),s=0;for(;i>0;i--)o++,s=(s<<4)+pe(e.charCodeAt(o));n+=ue(s),o++}s=a=o}else if(10===t||13===t){n+=e.slice(s,a);const t=ge(e,o,i);n+=fe(t.breaks),o=s=a=t.position}else o++,32!==t&&9!==t&&(a=o)}return n+e.slice(s,i)}(e,i,n);case 4:return ve(e,i,n,t.indent,t.chomping,!1);case 5:return ve(e,i,n,t.indent,t.chomping,!0);default:return function(e,t,i){let n="",o=t,s=t,a=t;for(;o<i;){const t=e.charCodeAt(o);if(10===t||13===t){n+=e.slice(s,a);const t=ge(e,o,i);n+=fe(t.breaks),o=s=a=t.position}else o++,32!==t&&9!==t&&(a=o)}return n+e.slice(s,a)}(e,i,n)}}(e.source,t),o=t.tagStart===Se?"":e.source.slice(t.tagStart,t.tagEnd),s=e.schema.defaultScalarTag;if(""!==o){if("!"===o)return{value:i,tag:s};const t=Ce(o,e.tagHandlers),a=e.schema.lookupScalarTag(t);if(a){const o=a.resolve(i,!0,t);return o===n&&Ee(e,`cannot resolve a node with !<${t}> explicit tag`),{value:o,tag:a}}const r=e.schema.lookupMappingTag(t)??e.schema.lookupSequenceTag(t);if(r){""!==i&&Ee(e,`cannot resolve a node with !<${t}> explicit tag`);const n=r.create(t);return{value:r.carrierIsResult?n:je(e,e.position,r,n),tag:r}}Ee(e,`unknown scalar tag !<${t}>`)}return 1===t.style?e.schema.resolveImplicitScalarTag(i):{value:s.resolve(i,!1,s.tagName),tag:s}}function ze(e,t,i){const n=t.tagStart===Se?"":e.source.slice(t.tagStart,t.tagEnd);return""===n||"!"===n?i:Ce(n,e.tagHandlers)}function Le(e){return"mapping"===e.nodeKind}function Oe(e){e.totalMergeKeys++,-1!==e.maxTotalMergeKeys&&e.totalMergeKeys>e.maxTotalMergeKeys&&Ee(e,`merge keys exceeded maxTotalMergeKeys (${e.maxTotalMergeKeys})`)}function Re(e,t,i,n){Oe(e);for(const o of n.keys(i)){if(Oe(e),t.tag.has(t.value,o))continue;const s=t.tag.addPair(t.value,o,n.get(i,o));s&&Ee(e,s),t.overridable??=new Set,t.overridable.add(o)}}function Pe(e,t,i){const n=e.frames[e.frames.length-1];if("document"===n.kind)n.value=t,n.hasValue=!0;else if("sequence"===n.kind){Le(i)&&e.nodeTags.set(t,i);const o=n.tag.addItem(n.value,t,n.index++);o&&Ee(e,o)}else if(n.hasKey){const o=n.key;n.key=void 0,n.hasKey=!1,function(e,t,i,n,o){if(e.position=t.keyPosition,t.keyIsMerge)return void function(e,t,i,n){if(e.position=t.keyPosition,Le(n))Re(e,t,i,n);else if("sequence"===n.nodeKind&&Array.isArray(i)){i.length>100&&Ee(e,"abnormal merge sequence size");for(const n of i){const i=e.nodeTags.get(n);i||Ee(e,"cannot merge mappings; the provided source object is unacceptable"),Re(e,t,n,i)}}else Ee(e,"cannot merge mappings; the provided source object is unacceptable")}(e,t,n,o);e.json||!t.tag.has(t.value,i)||t.overridable?.has(i)||Ee(e,"duplicated mapping key");const s=t.tag.addPair(t.value,i,n);s&&Ee(e,s),t.overridable?.delete(i)}(e,n,o,t,i)}else n.key=t,n.keyPosition=e.position,n.hasKey=!0,n.keyIsMerge="tag:yaml.org,2002:merge"===i.tagName}function He(e,t,i,n,o){if(t.anchorStart!==Se){const s={value:i,tag:n,isValueFinal:o};return e.anchors.set(e.source.slice(t.anchorStart,t.anchorEnd),s),s}return null}var Ie=-1,Ve=Object.prototype.hasOwnProperty,De=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,Fe=/[,\[\]{}]/,Ne=/^(?:!|!!|![0-9A-Za-z-]+!)$/,Ze=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$,_.!~*'()\[\]])`,Be=String.raw`(?:%[0-9A-Fa-f]{2}|[0-9A-Za-z\-#;/?:@&=+$.~*'()_])`,Ke=new RegExp(`^(?:${Ze})*$`),We=new RegExp(`^(?:${Be})+$`),Ue=new RegExp(`^(?:!(?:${Ze})*|${Be}(?:${Ze})*)$`),Ge={filename:"",maxDepth:100};function Ye(e,t,i,n,o,s,a){e.events.push({type:2,start:t,anchorStart:i,anchorEnd:n,tagStart:o,tagEnd:s,style:a})}function Qe(e,t,i,n,o,s,a){e.events.push({type:3,start:t,anchorStart:i,anchorEnd:n,tagStart:o,tagEnd:s,style:a})}function Je(e,t){e.events.splice(t.eventsLength,0,{type:3,start:t.position,anchorStart:Ie,anchorEnd:Ie,tagStart:Ie,tagEnd:Ie,style:2})}function Xe(e,t,i,n,o,s,a,r,l=1,c=-1,d=!1){e.events.push({type:4,valueStart:t,valueEnd:i,anchorStart:n,anchorEnd:o,tagStart:s,tagEnd:a,style:r,chomping:l,indent:c,fast:d})}function et(e){e.events.push({type:6})}function tt(e){Xe(e,Ie,Ie,Ie,Ie,Ie,Ie,1)}function it(){return{anchorStart:Ie,anchorEnd:Ie,tagStart:Ie,tagEnd:Ie}}function nt(e){return{position:e.position,line:e.line,lineStart:e.lineStart,lineIndent:e.lineIndent,firstTabInLine:e.firstTabInLine,eventsLength:e.events.length}}function ot(e,t){e.position=t.position,e.line=t.line,e.lineStart=t.lineStart,e.lineIndent=t.lineIndent,e.firstTabInLine=t.firstTabInLine,e.events.length=t.eventsLength}function st(e,t){le.throwAt(e.input.slice(0,e.length),e.position,t,e.filename)}function at(e){return 10===e||13===e}function rt(e){return 9===e||32===e}function lt(e){return rt(e)||at(e)}function ct(e){return 0===e||lt(e)}function dt(e){return 44===e||91===e||93===e||123===e||125===e}function ht(e){return e>=48&&e<=57?e-48:-1}function ut(e){if(e>=48&&e<=57)return e-48;const t=32|e;return t>=97&&t<=102?t-97+10:-1}function pt(e){return 120===e?2:117===e?4:85===e?8:0}function mt(e){return 48===e||97===e||98===e||116===e||9===e||110===e||118===e||102===e||114===e||101===e||32===e||34===e||47===e||92===e||78===e||95===e||76===e||80===e}function gt(e){10===e.input.charCodeAt(e.position)?e.position++:(e.position++,10===e.input.charCodeAt(e.position)&&e.position++),e.line++,e.lineStart=e.position,e.lineIndent=0,e.firstTabInLine=-1}function ft(e,t){let i=0,n=e.input.charCodeAt(e.position),o=e.position===e.lineStart||lt(e.input.charCodeAt(e.position-1));for(;0!==n;){for(;rt(n);)o=!0,9===n&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),n=e.input.charCodeAt(++e.position);if(t&&o&&35===n)do{n=e.input.charCodeAt(++e.position)}while(!at(n)&&0!==n);if(!at(n))break;for(gt(e),i++,o=!0,n=e.input.charCodeAt(e.position);32===n;)e.lineIndent++,n=e.input.charCodeAt(++e.position)}return i}function vt(e,t=e.position){const i=e.input.charCodeAt(t);if((45===i||46===i)&&i===e.input.charCodeAt(t+1)&&i===e.input.charCodeAt(t+2)){const i=e.input.charCodeAt(t+3);return 0===i||lt(i)}return!1}function bt(e){e.position===e.lineStart&&65279===e.input.charCodeAt(e.position)&&(e.position++,e.lineStart=e.position)}function yt(e){if(e.position!==e.lineStart)return!1;if(vt(e))return!0;if(65279!==e.input.charCodeAt(e.position))return!1;const t=nt(e);bt(e),ft(e,!0);const i=e.input.charCodeAt(e.position),n=e.position===e.lineStart&&(37===i||45===i&&vt(e));return ot(e,t),n}function _t(e){let t=e.input.charCodeAt(e.position);for(;0!==t&&!at(t);)t=e.input.charCodeAt(++e.position)}function wt(e,t,i){const n=De.exec(e.input.slice(t,i));null!==n&&(e.position=t+n.index+n[0].length-1,st(e,"the stream contains non-printable characters"))}function $t(e,t,i){if(33!==e.input.charCodeAt(e.position))return!1;t.tagStart!==Ie&&st(e,"duplication of a tag property");const n=e.position;let o=!1,s=!1,a="!",r=e.input.charCodeAt(++e.position);60===r?(o=!0,r=e.input.charCodeAt(++e.position)):33===r&&(s=!0,a="!!",r=e.input.charCodeAt(++e.position));let l,c=e.position;if(o){for(;0!==r&&62!==r;)r=e.input.charCodeAt(++e.position);62!==r&&st(e,"unexpected end of the stream within a verbatim tag"),l=e.input.slice(c,e.position),e.position++}else{for(;!(0===r||lt(r)||i&&dt(r));)33===r&&(s?st(e,"tag suffix cannot contain exclamation marks"):(a=e.input.slice(c-1,e.position+1),Ne.test(a)||st(e,"named tag handle cannot contain such characters"),s=!0,c=e.position+1)),r=e.input.charCodeAt(++e.position);l=e.input.slice(c,e.position),Fe.test(l)&&st(e,"tag suffix cannot contain flow indicator characters")}return l&&!(o?Ke.test(l):We.test(l))&&st(e,`tag name cannot contain such characters: ${l}`),o||"!"===a||"!!"===a||Ve.call(e.tagHandlers,a)||st(e,`undeclared tag handle "${a}"`),t.tagStart=n,t.tagEnd=e.position,!0}function xt(e,t){if(38!==e.input.charCodeAt(e.position))return!1;t.anchorStart!==Ie&&st(e,"duplication of an anchor property"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!lt(e.input.charCodeAt(e.position))&&!dt(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&st(e,"name of an anchor node must contain at least one character"),t.anchorStart=i,t.anchorEnd=e.position,!0}function kt(e,t){ft(e,!1),e.lineIndent<t&&st(e,"deficient indentation")}function Ct(e,t){const i=e.line;ft(e,!0),(e.line>i&&e.lineIndent<t||-1!==e.firstTabInLine&&e.lineIndent<t)&&st(e,"deficient indentation")}function Mt(e,t,i){if(-1!==e.firstTabInLine||45!==e.input.charCodeAt(e.position)||!ct(e.input.charCodeAt(e.position+1)))return!1;for(Ye(e,e.position,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,1);45===e.input.charCodeAt(e.position)&&ct(e.input.charCodeAt(e.position+1));){-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,st(e,"tab characters must not be used in indentation"));const i=e.line;e.position++;const n=ft(e,!0)>0;if(-1!==e.firstTabInLine&&45===e.input.charCodeAt(e.position)&&ct(e.input.charCodeAt(e.position+1))&&st(e,"bad indentation of a sequence entry"),n&&e.lineIndent<=t?tt(e):At(e,t,3,!1,!0),ft(e,!0),e.lineIndent<t||e.position>=e.length)break;e.lineIndent>t&&st(e,"bad indentation of a sequence entry"),e.line===i&&45===e.input.charCodeAt(e.position)&&ct(e.input.charCodeAt(e.position+1))&&st(e,"bad indentation of a sequence entry")}return et(e),!0}function St(e,t,i,n){let o=!1,s=!1,a=!1,r=!1;if(-1!==e.firstTabInLine)return!1;let l=e.input.charCodeAt(e.position);for(;0!==l;){o||-1===e.firstTabInLine||(e.position=e.firstTabInLine,st(e,"tab characters must not be used in indentation"));const c=e.input.charCodeAt(e.position+1),d=e.line;if(63!==l&&58!==l||!ct(c)){o&&(tt(e),o=!1);const t=nt(e);if(!At(e,i,2,!1,!0))break;if(e.line===d){for(l=e.input.charCodeAt(e.position);rt(l);)l=e.input.charCodeAt(++e.position);if(58===l)l=e.input.charCodeAt(++e.position),ct(l)||st(e,"a whitespace character is expected after the key-value separator within a block mapping"),a||(e.events.splice(t.eventsLength,0,{type:3,start:t.position,anchorStart:n.anchorStart,anchorEnd:n.anchorEnd,tagStart:n.tagStart,tagEnd:n.tagEnd,style:1}),a=!0),s=!0,o=!1,r=!1;else{if(!s)return n.anchorStart===Ie&&n.tagStart===Ie||(ot(e,t),!1);st(e,"expected ':' after a mapping key")}}else{if(!s)return n.anchorStart===Ie&&n.tagStart===Ie||(ot(e,t),!1);st(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else a||(Qe(e,e.position,n.anchorStart,n.anchorEnd,n.tagStart,n.tagEnd,1),a=!0),63===l?(o&&tt(e),s=!0,o=!0):(o||(tt(e),s=!0),o=!1),e.position+=1,r=!0;if(At(e,t,4,!0,r)&&(r=!1),o||r&&(tt(e),r=!1),ft(e,!0),l=e.input.charCodeAt(e.position),(e.line===d||e.lineIndent>t)&&0!==l)st(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return!!s&&(o&&tt(e),a&&et(e),!0)}function At(e,t,i,n,o,s=!0){e.depth>=e.maxDepth&&st(e,`nesting exceeded maxDepth (${e.maxDepth})`),e.depth++;let a=1,r=!1,l=!1,c=null;const d=it();let h=4===i||3===i,u=h;const p=h;if(n&&ft(e,!0)&&(r=!0,a=e.lineIndent>t?1:e.lineIndent===t?0:-1),1===a)for(;;){const n=e.input.charCodeAt(e.position),o=nt(e);if(r&&1!==a&&(33===n||38===n))break;if(r&&p&&(d.tagStart!==Ie||d.anchorStart!==Ie)&&(33===n||38===n)){const i=nt(e),n=t+1;if(St(e,e.position-e.lineStart,n,d)&&3===e.events[i.eventsLength]?.type)return e.depth--,!0;ot(e,i)}if(r&&(33===n&&d.tagStart!==Ie||38===n&&d.anchorStart!==Ie))break;if(!$t(e,d,1===i)&&!xt(e,d))break;null===c&&(c=o),ft(e,!0)?(r=!0,u=p,a=e.lineIndent>t?1:e.lineIndent===t?0:-1):u=!1}if(u&&(u=r||o),1===a||4===i){const n=1===i||2===i?t:t+1,o=e.position-e.lineStart;if(1===a)if(u&&(Mt(e,o,d)||St(e,o,n,d))||function(e,t,i){const n=e.input.charCodeAt(e.position),o=123===n,s=e.position;let a=!0;if(91!==n&&123!==n)return!1;const r=o?125:93;for(o?Qe(e,s,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,2):Ye(e,s,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,2),e.position++;0!==e.input.charCodeAt(e.position);){Ct(e,t);let i=e.input.charCodeAt(e.position);if(i===r)return e.position++,et(e),!0;a?44===i&&st(e,"expected the node content, but found ','"):st(e,"missed comma between flow collection entries");let n=!1,s=!1;63===i&&lt(e.input.charCodeAt(e.position+1))&&(n=s=!0,e.position+=1,Ct(e,t));const l=e.line,c=nt(e),d=At(e,t,1,!1,!0);Ct(e,t),i=e.input.charCodeAt(e.position),(o||s||e.line===l)&&58===i?(n=!0,e.position++,Ct(e,t),o||Je(e,c),d||tt(e),At(e,t,1,!1,!0)||tt(e),Ct(e,t),o||et(e)):o&&n?(d||tt(e),tt(e)):o?tt(e):n&&(Je(e,c),d||tt(e),tt(e),et(e)),i=e.input.charCodeAt(e.position),44===i?(a=!0,e.position++):a=!1}st(e,"unexpected end of the stream within a flow collection")}(e,n,d))l=!0;else{const t=e.input.charCodeAt(e.position);if(null!==c&&s&&p&&!u&&124!==t&&62!==t){const t=nt(e),i=c.position-c.lineStart;ot(e,c),St(e,i,n,it())&&3===e.events[t.eventsLength]?.type?l=!0:ot(e,t)}!l&&(h&&function(e,t,i){const n=e.input.charCodeAt(e.position);let o=1,s=-1,a=!1;if(124!==n&&62!==n)return!1;const r=124===n?4:5;for(e.position++;0!==e.input.charCodeAt(e.position);){const i=e.input.charCodeAt(e.position),n=ht(i);if(43===i||45===i)1!==o&&st(e,"repeat of a chomping mode identifier"),o=43===i?3:2,e.position++;else{if(!(n>=0))break;0===n&&st(e,"bad explicit indentation width of a block scalar; it cannot be less than one"),a&&st(e,"repeat of an indentation width identifier"),s=t+n-1,a=!0,e.position++}}let l=!1;for(;rt(e.input.charCodeAt(e.position));)l=!0,e.position++;l&&35===e.input.charCodeAt(e.position)&&_t(e),at(e.input.charCodeAt(e.position))?gt(e):0!==e.input.charCodeAt(e.position)&&st(e,"a line break is expected");let c=a?s:-1,d=0;const h=e.position;let u=e.position;for(;0!==e.input.charCodeAt(e.position);){const i=e.position;let n=0;for(;32===e.input.charCodeAt(i+n);)n++;const o=e.input.charCodeAt(i+n);if(0===o){c>=0?n>c&&(u=i+n):n>0&&(u=i+n);break}if(yt(e))break;if(!a&&-1===c&&at(o)&&(d=Math.max(d,n)),a||-1!==c||at(o)||(9===o&&n<t&&(e.position=i+n,st(e,"tab characters must not be used in indentation")),n>=t&&n<d&&(e.position=i+n,st(e,"bad indentation of a mapping entry"))),-1===c&&0!==o&&!at(o)&&n<t){e.lineIndent=n,e.position=i+n;break}a||0===o||at(o)||-1!==c||(c=n);const s=-1===c?t+1:c;if(0!==o&&!at(o)&&n<s){e.lineIndent=n,e.position=i+n;break}_t(e),u=e.position,at(e.input.charCodeAt(e.position))&&(gt(e),u=e.position)}return wt(e,h,u),Xe(e,h,u,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,r,o,c),!0}(e,n,d)||function(e,t,i){if(39!==e.input.charCodeAt(e.position))return!1;e.position++;const n=e.position;let o=!0;for(;0!==e.input.charCodeAt(e.position);){const s=e.input.charCodeAt(e.position);if(39===s){if(39===e.input.charCodeAt(e.position+1)){o=!1,e.position+=2;continue}const t=e.position;return e.position++,Xe(e,n,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,2,1,-1,o),!0}at(s)?(o=!1,kt(e,t)):e.position===e.lineStart&&vt(e)?st(e,"unexpected end of the document within a single quoted scalar"):9!==s&&s<32?st(e,"expected valid JSON character"):e.position++}st(e,"unexpected end of the stream within a single quoted scalar")}(e,n,d)||function(e,t,i){if(34!==e.input.charCodeAt(e.position))return!1;e.position++;const n=e.position;let o=!0;for(;0!==e.input.charCodeAt(e.position);){const s=e.input.charCodeAt(e.position);if(34===s){const t=e.position;return e.position++,Xe(e,n,t,i.anchorStart,i.anchorEnd,i.tagStart,i.tagEnd,3,1,-1,o),!0}if(92===s){o=!1;const i=e.input.charCodeAt(++e.position);if(at(i))kt(e,t);else if(mt(i))e.position++;else{let t=pt(i);for(0===t&&st(e,"unknown escape sequence");t-- >0;)e.position++,ut(e.input.charCodeAt(e.position))<0&&st(e,"expected hexadecimal character");e.position++}}else at(s)?(o=!1,kt(e,t)):e.position===e.lineStart&&vt(e)?st(e,"unexpected end of the document within a double quoted scalar"):9!==s&&s<32?st(e,"expected valid JSON character"):e.position++}st(e,"unexpected end of the stream within a double quoted scalar")}(e,n,d)||function(e,t){if(42!==e.input.charCodeAt(e.position))return!1;t.anchorStart===Ie&&t.tagStart===Ie||st(e,"alias node should not have any properties"),e.position++;const i=e.position;for(;0!==e.input.charCodeAt(e.position)&&!lt(e.input.charCodeAt(e.position))&&!dt(e.input.charCodeAt(e.position));)e.position++;return e.position===i&&st(e,"name of an alias node must contain at least one character"),function(e,t,i){e.events.push({type:5,anchorStart:t,anchorEnd:i})}(e,i,e.position),!0}(e,d)||function(e,t,i,n){if(!function(e,t){const i=e.input.charCodeAt(e.position),n=1===t;if(0===i||lt(i)||35===i||38===i||42===i||33===i||124===i||62===i||39===i||34===i||37===i||64===i||96===i||dt(i))return!1;if(63===i||45===i){const t=e.input.charCodeAt(e.position+1);if(ct(t)||n&&dt(t))return!1}return!0}(e,i))return!1;const o=e.position;let s=e.position,a=e.input.charCodeAt(e.position);const r=1===i;let l=!1;for(;0!==a&&!yt(e);){if(58===a){const t=e.input.charCodeAt(e.position+1);if(ct(t)||r&&dt(t))break}else if(35===a){if(lt(e.input.charCodeAt(e.position-1)))break}else{if(r&&dt(a))break;if(at(a)){const i=e.position,n=e.line,o=e.lineStart,s=e.lineIndent;if(ft(e,!1),e.lineIndent>=t){l=!0,a=e.input.charCodeAt(e.position);continue}e.position=i,e.line=n,e.lineStart=o,e.lineIndent=s;break}}rt(a)||(s=e.position+1),a=e.input.charCodeAt(++e.position)}return s!==o&&(wt(e,o,s),Xe(e,o,s,n.anchorStart,n.anchorEnd,n.tagStart,n.tagEnd,1,1,-1,!l),!0)}(e,n,i,d))&&(l=!0)}else 0===a&&(l=u&&Mt(e,o,d))}return h=h&&!l,l||d.anchorStart===Ie&&d.tagStart===Ie&&!h||(Xe(e,Ie,Ie,d.anchorStart,d.anchorEnd,d.tagStart,d.tagEnd,1),l=!0),e.depth--,l||d.anchorStart!==Ie||d.tagStart!==Ie}function qt(e){if(e.lineIndent>0||37!==e.input.charCodeAt(e.position))return!1;e.position++;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!lt(e.input.charCodeAt(e.position));)e.position++;const i=e.input.slice(t,e.position),n=[];for(0===i.length&&st(e,"directive name must not be less than one character in length");0!==e.input.charCodeAt(e.position)&&!at(e.input.charCodeAt(e.position));){for(;rt(e.input.charCodeAt(e.position));)e.position++;if(35===e.input.charCodeAt(e.position)||at(e.input.charCodeAt(e.position))||0===e.input.charCodeAt(e.position))break;const t=e.position;for(;0!==e.input.charCodeAt(e.position)&&!lt(e.input.charCodeAt(e.position));)e.position++;n.push(e.input.slice(t,e.position))}if(at(e.input.charCodeAt(e.position))&&gt(e),"YAML"===i){e.directives.some(e=>"yaml"===e.kind)&&st(e,"duplication of %YAML directive"),1!==n.length&&st(e,"YAML directive accepts exactly one argument");const t=/^([0-9]+)\.([0-9]+)$/.exec(n[0]);null===t&&st(e,"ill-formed argument of the YAML directive"),1!==parseInt(t[1],10)&&st(e,"unacceptable YAML version of the document"),e.directives.push({kind:"yaml",version:n[0]})}else if("TAG"===i){2!==n.length&&st(e,"TAG directive accepts exactly two arguments");const[t,i]=n;Ne.test(t)||st(e,"ill-formed tag handle (first argument) of the TAG directive"),Ve.call(e.tagHandlers,t)&&st(e,`there is a previously declared suffix for "${t}" tag handle`),Ue.test(i)||st(e,"ill-formed tag prefix (second argument) of the TAG directive"),e.tagHandlers[t]=i,e.directives.push({kind:"tag",handle:t,prefix:i})}return!0}function Et(e){e.directives=[],e.tagHandlers=Object.create(null);let t=!1;for(ft(e,!0);qt(e);)t=!0,ft(e,!0);let i=!1,n=!1,o=!0;if(0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)&&ct(e.input.charCodeAt(e.position+3))){i=!0;const t=e.line;e.position+=3,ft(e,!0),o=e.line>t}else t&&st(e,"directives end mark is expected");const s=e.events.length;if(!i&&e.position===e.lineStart&&46===e.input.charCodeAt(e.position)&&vt(e))return e.position+=3,void ft(e,!0);if(function(e,t){e.events.push({type:1,explicitStart:t,explicitEnd:!1,directives:e.directives})}(e,i),At(e,e.lineIndent-1,4,!1,o,o)||tt(e),ft(e,!0),e.position===e.lineStart&&vt(e)&&(n=46===e.input.charCodeAt(e.position),n)){const t=e.line;e.position+=3,ft(e,!0),e.line===t&&e.position<e.length&&st(e,"end of the stream or a document separator is expected")}const a=e.events[s];1===a?.type&&(a.explicitEnd=n),et(e),!n&&e.position<e.length&&!yt(e)&&st(e,"end of the stream or a document separator is expected")}var jt={...Ge,...Ae};function Tt(e,t){const i=function(e,t={}){const i={...jt,...t},n=String(e),o=Object.keys(Ge),s=Object.keys(Ae);return function(e,t){const i={...Ae,...t,events:e,documents:[],eventIndex:0,position:0,frames:[],anchors:new Map,nodeTags:new Map,tagHandlers:Object.create(null),totalMergeKeys:0,aliasCount:0};for(;i.eventIndex<i.events.length;){const e=i.events[i.eventIndex++];switch(i.position=qe(e),e.type){case 1:i.anchors=new Map,i.nodeTags=new Map,i.aliasCount=0,i.tagHandlers=Object.create(null);for(const t of e.directives)"tag"===t.kind&&(i.tagHandlers[t.handle]=t.prefix);i.frames.push({kind:"document",position:i.position,value:void 0,hasValue:!1});break;case 4:{const{value:t,tag:n}=Te(i,e);He(i,e,t,n,!0),Pe(i,t,n);break}case 2:{const t=ze(i,e,"tag:yaml.org,2002:seq"),n=i.schema.lookupSequenceTag(t);n||Ee(i,`unknown sequence tag !<${t}>`);const o=n.create(t),s=He(i,e,o,n,n.carrierIsResult);i.frames.push({kind:"sequence",position:i.position,value:o,tag:n,anchor:s,index:0});break}case 3:{const t=ze(i,e,"tag:yaml.org,2002:map"),n=i.schema.lookupMappingTag(t);n||Ee(i,`unknown mapping tag !<${t}>`);const o=n.create(t),s=He(i,e,o,n,n.carrierIsResult);i.frames.push({kind:"mapping",position:i.position,value:o,tag:n,anchor:s,key:void 0,keyPosition:i.position,hasKey:!1,keyIsMerge:!1,overridable:null});break}case 5:{-1!==i.maxAliases&&++i.aliasCount>i.maxAliases&&Ee(i,`aliases exceeded maxAliases (${i.maxAliases})`);const t=i.source.slice(e.anchorStart,e.anchorEnd),n=i.anchors.get(t);n||Ee(i,`unidentified alias "${t}"`),n.isValueFinal||Ee(i,`recursive alias "${t}" is not supported for tag ${n.tag.tagName} because it uses finalize()`),Pe(i,n.value,n.tag);break}case 6:{const e=i.frames.pop();if("mapping"===e.kind&&e.hasKey&&(i.position=e.keyPosition,Ee(i,"incomplete mapping pair in event stream")),"document"===e.kind)i.documents.push(e.value);else{const t=e.tag.carrierIsResult?e.value:je(i,e.position,e.tag,e.value);e.anchor&&(e.anchor.value=t,e.anchor.isValueFinal=!0),Pe(i,t,e.tag)}break}}}return i.documents}(function(e,t){const i=e.length,n={...Ge,...t,input:`${e}\0`,length:i,position:0,line:0,lineStart:0,lineIndent:0,firstTabInLine:-1,depth:0,directives:[],tagHandlers:Object.create(null),events:[]},o=e.indexOf("\0");for(-1!==o&&le.throwAt(e,o,"null byte is not allowed in input",n.filename);n.position<n.length&&(bt(n),ft(n,!0),!(n.position>=n.length));){const e=n.position;Et(n),n.position===e&&st(n,"can not read a document")}return n.events}(n,U(i,o)),{...U(i,s),source:n})}(e,t);if(0===i.length)throw new le("expected a document, but the input is empty");if(1===i.length)return i[0];throw new le("expected a single document in the stream, but found more")}var zt=Symbol("INVALID");function Lt(e){const t=new Set([e.defaultScalarTag,e.defaultSequenceTag,e.defaultMappingTag].filter(e=>void 0!==e)),i=e.implicitScalarTags,n=e.tags.filter(e=>!("scalar"===e.nodeKind&&e.implicit||t.has(e))),o=e.tags.filter(e=>t.has(e));return[...i.map(e=>({tag:e,implicitTag:!0})),...n.map(e=>({tag:e,implicitTag:!1})),...o.map(e=>({tag:e,implicitTag:!0}))]}function Ot(e,t){if(!e.noRefs&&null!==t&&"object"==typeof t){const i=e.refs.get(t);if(i)return void 0===i.anchor&&(i.anchor="ref_"+e.refCounter++),{kind:"alias",anchor:i.anchor}}const i=function(e,t){for(let i=0,n=e.representTypes.length;i<n;i+=1){const{tag:n,implicitTag:o}=e.representTypes[i];if(n.identify(t)){let e;return e=n.matchByTagPrefix?n.representTagName(t):n.tagName,{tag:n,tagName:e,implicitTag:o}}}return null}(e,t);if(!i){if(void 0===t)return zt;if(e.skipInvalid)return zt;throw new le(`unacceptable kind of an object to dump ${Object.prototype.toString.call(t)}`)}const{tag:n,tagName:o,implicitTag:s}=i,a=s?o:Me(o);if("scalar"===n.nodeKind)return{kind:"scalar",tag:a,tagged:!s,style:1,value:n.represent(t)};if("sequence"===n.nodeKind){const i=n.represent(t),o={kind:"sequence",tag:a,tagged:!s,style:1,items:[]};e.noRefs||e.refs.set(t,o);for(let t=0,n=i.length;t<n;t+=1){let n=Ot(e,i[t]);n===zt&&void 0===i[t]&&(n=Ot(e,null)),n!==zt&&o.items.push(n)}return o}const r=n.represent(t),l={kind:"mapping",tag:a,tagged:!s,style:1,items:[]};e.noRefs||e.refs.set(t,l);for(const[t,i]of r){const n=Ot(e,t);if(n===zt)continue;const o=Ot(e,i);o!==zt&&l.items.push({key:n,value:o})}return l}function Rt(e,t,i={}){const n=Ot({representTypes:Lt(t),noRefs:i.noRefs??!1,skipInvalid:i.skipInvalid??!1,refs:new Map,refCounter:0},e);return[{contents:n===zt?null:n,directives:[]}]}var Pt=Symbol("visit:break"),Ht=Symbol("visit:skip");function It(e,t,i){const n=t(e,i);if(n===Pt)return!0;if(n===Ht)return!1;const o=i.depth+1;switch(e.kind){case"sequence":for(const i of e.items)if(It(i,t,{depth:o,parent:e,isKey:!1}))return!0;break;case"mapping":for(const{key:i,value:n}of e.items){if(It(i,t,{depth:o,parent:e,isKey:!0}))return!0;if(It(n,t,{depth:o,parent:e,isKey:!1}))return!0}}return!1}function Vt(e,t){for(const i of e)if(i.contents&&It(i.contents,t,{depth:0,parent:null,isKey:!1}))return}function Dt(e,t){return!!(e&1<<t)}var Ft={applyQuoteFlowKeysOption:function(e){e.presenterOptions.quoteFlowKeys&&e.isKey&&e.flowOnly&&1===e.style&&(e.style=3)},doubleQuoteForInvisibles:function(e){1===e.style&&/[\t\x7F-\xA0\u2028\u2029\uFEFF\uFFFE\uFFFF]/.test(e.node.value)&&(e.style=3)},doubleQuoteWhitespaceOnly:function(e){1===e.style&&/^\s+$/.test(e.node.value)&&(e.style=3)},applyForceQuotesOption:function(e){e.presenterOptions.forceQuotes&&(e.isKey||1!==e.style||e.node.tag===e.presenterOptions.schema.defaultScalarTag.tagName&&(e.style=e.node.value.includes("\n")?3:Nt(e)))},tryLongOrMultilineAsBlock:function(e){if(1!==e.style||e.isKey)return;const t=e.node.value,i=-1!==t.indexOf("\n");if(!Dt(e.allowedStylesMask,4))return void(i&&(e.style=3));const n=e.presenterOptions.lineWidth;if(-1===n)return void(i&&(e.style=4));const o=Math.max(Math.min(n,40),n-e.shiftOfContent);let s=0,a=!1;for(;s<=t.length;){let e=t.length;const i=t.indexOf("\n",s);-1!==i&&(e=i);const n=t.slice(s,e);if(n.length>o&&" "!==n[0]&&/ [^ \t]/.test(n)&&(a=!0),-1===i)break;s=i+1}a?e.style=5:i&&(e.style=4)},quoteInvalidPlain:function(e){1!==e.style||Dt(e.allowedStylesMask,1)||(e.style=Nt(e))},fallbackToDoubleQuoted:function(e){Dt(e.allowedStylesMask,e.style)||(e.style=3)}};function Nt(e){return"single"===e.presenterOptions.quoteStyle&&Dt(e.allowedStylesMask,2)?2:3}function Zt(e,t){return e|1<<t}var Bt="[ \\t]",Kt="(?:(?!(?:[\\n\\r]|\\uFEFF))[\\x09\\x0A\\x0D\\x20-\\x7E\\x85\\xA0-\\uD7FF\\uE000-\\uFFFD\\u{10000}-\\u{10FFFF}])",Wt=`(?:(?!${Bt})${Kt})`,Ut="[\\x09\\x20-\\uD7FF\\uE000-\\uFFFF\\u{10000}-\\u{10FFFF}]",Gt="[-?:,\\[\\]{}#&*!|>'\"%@`]",Yt=`(?:(?![,\\[\\]{}])${Wt})`,Qt=`(?:(?:(?![:#])${Wt})|:(?=${Wt}))#*`,Jt=`(?:(?:(?![:#])${Yt})|:(?=${Yt}))#*`,Xt=`(?:${Bt}*${Qt})*`,ei=`(?:${Bt}*${Jt})*`,ti=`(?:(?:(?!${Gt})${Wt})|[?:-](?=${Wt}))#*${Xt}`,ii=`(?:(?:(?!${Gt})${Wt})|[?:-](?=${Yt}))#*${ei}`,ni=ti,oi=ii,si=`${ii}(?:\\n+${Jt}${ei})*`,ai=new RegExp(`^(?:${ti}(?:\\n+${Qt}${Xt})*)$`,"u"),ri=new RegExp(`^(?:${si})$`,"u"),li=new RegExp(`^(?:${ni})$`,"u"),ci=new RegExp(`^(?:${oi})$`,"u"),di=new RegExp(`^(?:${Ut})*$`,"u"),hi=new RegExp(`^(?:${Ut}|\\n)*$`,"u"),ui=new RegExp(`^(?:${Kt}|\\n)*$`,"u"),pi=/^(?:---|\.\.\.)(?=$|[ \t\n\r])/,mi=/^(?:---|\.\.\.)(?=$|[ \t\n\r])/m;function gi(e,t){let i=e.indexOf("\n");if(-1===i)return e;const n=" ".repeat(t);let o=e.slice(0,i);const s=/(\n+)([^\n]*)/g;let a;for(s.lastIndex=i;a=s.exec(e);){const e=a[1].length,t=a[2];o+="\n".repeat(e+1)+n+t}return o}function fi(e,t){const i=" ".repeat(t);let n=0,o="";const s=e.length;for(;n<s;){let t;const a=e.indexOf("\n",n);-1===a?(t=e.slice(n),n=s):(t=e.slice(n,a+1),n=a+1),t.length&&"\n"!==t&&(o+=i),o+=t}return o}function vi(e,t,i){const n=function(e){return/^\n* /.test(e)}(e)?String(i-t):"",o="\n"===e[e.length-1];return`${n}${!o||"\n"!==e[e.length-2]&&"\n"!==e?o?"":"-":"+"}\n`}function bi(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function yi(e){return" "===e||"\t"===e}function _i(e,t){if(""===e||yi(e[0]))return e;const i=/ [^ \t]/g;let n,o,s=0,a=0,r=0,l="";for(;n=i.exec(e);)r=n.index,r-s>t&&(o=a>s?a:r,l+=`\n${e.slice(s,o)}`,s=o+1),a=r;return l+="\n",e.length-s>t&&a>s?l+=`${e.slice(s,a)}\n${e.slice(a+1)}`:l+=e.slice(s),l.slice(1)}var wi=/["\\\x00-\x1F\x7F-\xA0\u2028\u2029\uD800-\uDFFF\uFEFF\uFFFE\uFFFF]/gu;function $i(e){switch(e){case"\0":return"\\0";case"":return"\\a";case"\b":return"\\b";case"\t":return"\\t";case"\n":return"\\n";case"\v":return"\\v";case"\f":return"\\f";case"\r":return"\\r";case"":return"\\e";case'"':return'\\"';case"\\":return"\\\\";case"":return"\\N";case" ":return"\\_";case"\u2028":return"\\L";case"\u2029":return"\\P"}const t=e.charCodeAt(0),i=t.toString(16).toUpperCase();return t<=255?`\\x${"0".repeat(2-i.length)}${i}`:`\\u${"0".repeat(4-i.length)}${i}`}var xi={indent:2,seqNoIndent:!1,seqInlineFirst:!0,lineWidth:80,flowBracketPadding:!1,flowSkipCommaSpace:!1,flowSkipColonSpace:!1,quoteFlowKeys:!1,quoteStyle:"single",forceQuotes:!1,scalarStyleRules:Object.keys(Ft).map(e=>Reflect.get(Ft,e)),tagBeforeAnchor:!1};function ki(e,t){return`\n${" ".repeat(e.indent*t)}`}function Ci(e,t,i,n){let o="";for(let s=0,a=i.items.length;s<a;s+=1){const a=Si(e,t+1,i.items[s],i,{block:!0,compact:e.seqInlineFirst,isblockseq:!0}).text;n&&""===o||(o+=ki(e,t)),""===a||10===a.charCodeAt(0)?o+="-":o+="- ",o+=a}return o}function Mi(e,t,i){return"alias"===t.kind||t.tagged||void 0!==t.anchor||e.indent<2&&i>0}function Si(e,t,i,n,o){if("alias"===i.kind)return e.openEnded=!1,{text:`*${i.anchor}`,noBody:!1};const{block:s=!1,iskey:a=!1,isblockseq:r=!1}=o;let l=o.compact??!1;const c=void 0!==i.anchor;let d;Mi(e,i,t)&&(l=!1);let h=i.tagged;const u=s&&("mapping"===i.kind||"sequence"===i.kind)&&1===i.style&&0!==i.items.length;if("mapping"===i.kind)d=u?function(e,t,i,n){let o="";for(let s=0,a=i.items.length;s<a;s+=1){let a="";n&&""===o||(a+=ki(e,t));const{key:r,value:l}=i.items[s],c=("mapping"===r.kind||"sequence"===r.kind)&&1===r.style&&0!==r.items.length||"scalar"===r.kind&&(4===r.style||5===r.style),d=Si(e,t+1,r,i,c?{block:!0,compact:!0,isblockseq:!Mi(e,r,t+1)}:{block:!0,compact:!0,iskey:!0}),h=d.text,u="scalar"===r.kind&&-1!==r.value.indexOf("\n"),p=h.length>1024&&/^[\s\S]{1025}/u.test(h),m=c||u||p;m&&(h&&10===h.charCodeAt(0)?a+="?":a+="? "),a+=h,m&&(a+=ki(e,t));const g=Si(e,t+1,l,i,{block:!0,compact:m,isblockseq:m&&!Mi(e,l,t+1)}).text,f="scalar"===r.kind&&d.noBody&&(r.tagged||void 0!==r.anchor),v=m||"alias"!==r.kind&&!f?"":" ";""===g||10===g.charCodeAt(0)?a+=`${v}:`:a+=`${v}: `,a+=g,o+=a}return o}(e,t,i,l):function(e,t,i){let n="";for(const{key:o,value:s}of i.items){let a="";""!==n&&(a+=","+(e.flowSkipCommaSpace?"":" "));const r=Si(e,t,o,i,{iskey:!0}),l=r.text,c=Si(e,t,s,i,{}).text,d=e.flowSkipColonSpace||""===c?"":" ",h="scalar"===o.kind&&r.noBody&&(o.tagged||void 0!==o.anchor);a+=`${l}${"alias"===o.kind||h?" ":""}:${d}${c}`,n+=a}const o=e.flowBracketPadding&&""!==n?" ":"";return`{${o}${n}${o}}`}(e,t,i);else if("sequence"===i.kind)d=u?e.seqNoIndent&&!r&&t>0?Ci(e,t-1,i,l):Ci(e,t,i,l):function(e,t,i){let n="";for(let o=0,s=i.items.length;o<s;o+=1){const s=Si(e,t,i.items[o],i,{}).text;o>0&&(n+=","+(e.flowSkipCommaSpace?"":" ")),n+=s}const o=e.flowBracketPadding&&i.items.length>0?" ":"";return`[${o}${n}${o}]`}(e,t,i);else{const o=function(e,t,i,n,o,s){return{node:t,parent:i,level:n,isKey:o,flowOnly:s,shiftOfParent:0===n?-1:e.indent*(n-1),shiftOfContent:e.indent*Math.max(1,n),shiftOfFirstLine:0===n?0:e.indent*n,presenterOptions:e,allowedStylesMask:0,style:t.style}}(e,i,n,t,a,!s);!function(e){let t=Zt(0,3);(function(e){const t=e.node.value;if(""!==t){if(!(e.isKey?e.flowOnly?ci:li:e.flowOnly?ri:ai).test(t))return!1;if(0===e.shiftOfFirstLine&&pi.test(t))return!1;if(0===e.shiftOfContent){const e=t.indexOf("\n");if(-1!==e){const i=t.slice(e+1);if(mi.test(i))return!1}}}const i=e.presenterOptions.schema.resolveImplicitScalarTag(t).tag.tagName;return!(!e.node.tagged&&i!==e.node.tag||!e.node.tagged&&"="===t&&i===e.presenterOptions.schema.defaultScalarTag.tagName)})(e)&&(t=Zt(t,1)),function(e){const t=e.node.value;if(!(e.isKey?di:hi).test(t))return!1;if(/[ \t]\n|\n[ \t]/.test(t))return!1;if(!e.isKey&&0===e.shiftOfContent){const e=t.indexOf("\n");if(-1!==e&&mi.test(t.slice(e+1)))return!1}return!0}(e)&&(t=Zt(t,2)),function(e){if(e.flowOnly||!ui.test(e.node.value))return!1;const t=e.shiftOfContent-e.shiftOfParent;return!(t<1||t>9&&/^\n* /.test(e.node.value)||0===e.shiftOfContent&&mi.test(e.node.value))}(e)&&(t=Zt(Zt(t,4),5)),e.allowedStylesMask=t}(o);for(const t of e.scalarStyleRules)t(o);d=function(e){switch(e.style){case 1:return function(e){return gi(e.node.value,e.shiftOfContent)}(e);case 2:return function(e){return`'${gi(e.node.value,e.shiftOfContent).replace(/'/g,"''")}'`}(e);case 4:return function(e){const t=e.node.value;return"|"+vi(t,e.shiftOfParent,e.shiftOfContent)+bi(fi(t,e.shiftOfContent))}(e);case 5:return function(e){const t=e.node.value,i=e.presenterOptions.lineWidth;let n=1/0;return-1!==i&&(n=Math.max(Math.min(i,40),i-e.shiftOfContent)),">"+vi(t,e.shiftOfParent,e.shiftOfContent)+bi(fi(function(e,t){const i=/(\n+)([^\n]*)/g;let n=e.indexOf("\n");-1===n&&(n=e.length),i.lastIndex=n;let o,s,a=_i(e.slice(0,n),t),r="\n"===e[0]||yi(e[0]);for(;s=i.exec(e);){const e=s[1],i=s[2];o=""!==i&&yi(i[0]),a+=e+(r||o||""===i?"":"\n")+_i(i,t),r=o}return a}(t,n),e.shiftOfContent))}(e);case 3:return function(e){return`"${t=e.node.value,t.replace(wi,$i)}"`;var t}(e)}}(o),e.openEnded=(4===o.style||5===o.style)&&("\n"===i.value||i.value.endsWith("\n\n")),h=i.tagged||""===d&&o.flowOnly&&"sequence"===n?.kind&&!c||1!==o.style&&i.tag!==e.defaultScalarTagName}"mapping"!==i.kind&&"sequence"!==i.kind||u||(e.openEnded=!1),u&&l&&t>0&&e.indent>2&&(d=`${" ".repeat(e.indent-2)}${d}`);const p=""===d;let m=d;if(h||c){const t=[],n=h?function(e){return e.tagged?e.tag:Me(e.tag)}(i):null,o=c?`&${i.anchor}`:null;e.tagBeforeAnchor?(null!==n&&t.push(n),null!==o&&t.push(o)):(null!==o&&t.push(o),null!==n&&t.push(n));const s=""===d||10===d.charCodeAt(0)?"":" ";m=`${t.join(" ")}${s}${d}`}return{text:m,noBody:p}}function Ai(e){return("sequence"===e.kind||"mapping"===e.kind)&&1===e.style&&0!==e.items.length&&!e.tagged&&void 0===e.anchor}function qi(e){let t="";for(const i of e.directives){if("yaml"===i.kind){t+=`%YAML ${i.version}\n`;continue}const{handle:e,prefix:n}=i;t+=`%TAG ${e} ${n}\n`}return t}var Ei={...xi,schema:ie,skipInvalid:!1,noRefs:!1,flowLevel:-1,sortKeys:!1,transform:()=>{}};function ji(e,t){const i=String(e),n=String(t);return i<n?-1:i>n?1:0}function Ti(e,t={}){const i={...Ei,...t},n=Rt(e,i.schema,{noRefs:i.noRefs,skipInvalid:i.skipInvalid});if(i.flowLevel>=0&&Vt(n,(e,t)=>{if(!(t.depth<i.flowLevel))return"sequence"!==e.kind&&"mapping"!==e.kind||(e.style=2),Ht}),i.sortKeys){const e=!0===i.sortKeys?ji:i.sortKeys;Vt(n,t=>{"mapping"===t.kind&&t.items.sort((t,i)=>e("scalar"===t.key.kind?t.key.value:"","scalar"===i.key.kind?i.key.value:""))})}return i.transform(n),function(e,t){const i=function(e){const t={...xi,...e};return t.flowSkipColonSpace&&(t.quoteFlowKeys=!0),{...t,defaultScalarTagName:t.schema.defaultScalarTag.tagName,openEnded:!1}}(t);let n="",o=!1;for(let t=0;t<e.length;t+=1){const s=e[t];i.openEnded=!1;const a=qi(s),r=""!==a,l=s.explicitStart||r||t>0&&!o;if(n+=a,null===s.contents)l&&(n+="---\n");else if(l){const e=Si(i,0,s.contents,null,{block:!0,compact:!0}).text;n+=`---${""===e?"":r||Ai(s.contents)?"\n":" "}${e}\n`}else n+=Si(i,0,s.contents,null,{block:!0,compact:!0}).text+"\n";o=s.explicitEnd||i.openEnded,o&&(n+="...\n")}return n}(n,{...U(i,Object.keys(xi)),schema:i.schema})}},4765(e,t,i){var n=i(6752);i.d(t,["J",0,e=>e??n.s6])},7217(e,t,i){var n=i(6752),o=i(6201),s=i(7804);class a{}const r=new WeakMap,l=(0,s.u$)(class extends o.Kq{render(e){return n.s6}update(e,[t]){const i=t!==this.G;return i&&this.rt(void 0),(i||this.lt!==this.ct)&&(this.G=t,this.ht=e.options?.host,this.rt(this.ct=e.element)),n.s6}rt(e){if(void 0!==this.G)if(this.isConnected||(e=void 0),"function"==typeof this.G){const t=this.ht??globalThis;let i=r.get(t);void 0===i&&(i=new WeakMap,r.set(t,i)),void 0!==i.get(this.G)&&this.G.call(this.ht,void 0),i.set(this.G,e),void 0!==e&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return"function"==typeof this.G?r.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});i.d(t,["K",0,l,"_",0,()=>new a])},2378(e,t,i){var n=i(6752),o=i(7804);const s="important",a=" !"+s,r=(0,o.u$)(class extends o.WL{constructor(e){if(super(e),e.type!==o.OA.ATTRIBUTE||"style"!==e.name||e.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(e){return Object.keys(e).reduce((t,i)=>{const n=e[i];return null==n?t:t+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${n};`},"")}update(e,[t]){const{style:i}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(const e of this.ft)null==t[e]&&(this.ft.delete(e),e.includes("-")?i.removeProperty(e):i[e]=null);for(const e in t){const n=t[e];if(null!=n){this.ft.add(e);const t="string"==typeof n&&n.endsWith(a);e.includes("-")||t?i.setProperty(e,t?n.slice(0,-11):n,t?s:""):i[e]=n}}return n.c0}});i.d(t,["W",0,r])},68(e,t,i){i.d(t,{D:()=>s});var n=i(6752),o=i(7804);class s extends o.WL{constructor(e){if(super(e),this.it=n.s6,e.type!==o.OA.CHILD)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===n.s6||null==e)return this._t=void 0,this.it=e;if(e===n.c0)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}s.directiveName="unsafeHTML",s.resultType=1;const a=(0,o.u$)(s);i.d(t,["_",0,a])},5707(e,t,i){i.d(t,{EM:()=>n.E,MZ:()=>o.M,wk:()=>s.w});var n=i(6505),o=i(5694),s=i(4290)},1413(e,t,i){i.d(t,{J:()=>n.J});var n=i(4765)},4489(e,t,i){i.d(t,{K:()=>n.K,_:()=>n._});var n=i(7217)},754(e,t,i){i.d(t,{W:()=>n.W});var n=i(2378)},5276(e,t,i){i.d(t,{_:()=>n._});var n=i(68)},7911(e,t,i){i.d(t,{T:()=>u});var n=i(6752),o=i(8504),s=i(6201);class a{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}}class r{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(e=>this.Z=e)}resume(){this.Z?.(),this.Y=this.Z=void 0}}var l=i(7804);const c=e=>!(0,o.sO)(e)&&"function"==typeof e.then,d=1073741823;class h extends s.Kq{constructor(){super(...arguments),this._$Cwt=d,this._$Cbt=[],this._$CK=new a(this),this._$CX=new r}render(...e){return e.find(e=>!c(e))??n.c0}update(e,t){const i=this._$Cbt;let o=i.length;this._$Cbt=t;const s=this._$CK,a=this._$CX;this.isConnected||this.disconnected();for(let e=0;e<t.length&&!(e>this._$Cwt);e++){const n=t[e];if(!c(n))return this._$Cwt=e,n;e<o&&n===i[e]||(this._$Cwt=d,o=0,Promise.resolve(n).then(async e=>{for(;a.get();)await a.get();const t=s.deref();if(void 0!==t){const i=t._$Cbt.indexOf(n);i>-1&&i<t._$Cwt&&(t._$Cwt=i,t.setValue(e))}}))}return n.c0}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}}const u=(0,l.u$)(h)}};