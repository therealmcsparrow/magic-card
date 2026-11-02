"use strict";export const __webpack_esm_ids__=[613];export const __webpack_esm_modules__={5792(t,r,o){o.d(r,["kz",0,[{id:"primary-on-card",text:"primary-text-color",background:"card-background-color",optional:!1},{id:"primary-on-page",text:"primary-text-color",background:"primary-background-color",optional:!1},{id:"secondary-on-card",text:"secondary-text-color",background:"card-background-color",optional:!1},{id:"on-primary",text:"text-primary-color",background:"primary-color",optional:!1},{id:"mc-text-on-card",text:"mc-text",background:"mc-card-bg",optional:!0}],"t2",0,{width:1280,height:800}])},3247(t,r,o){o.r(r),o.d(r,{SHARE_TABLET_READY:()=>b});var e=o(6161),a=o(5707),i=o(754),n=o(5792),s=function(t,r,o,e){var a,i=arguments.length,n=i<3?r:null===e?e=Object.getOwnPropertyDescriptor(r,o):e;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,r,o,e);else for(var s=t.length-1;s>=0;s--)(a=t[s])&&(n=(i<3?a(n):i>3?a(r,o,n):a(r,o))||n);return i>3&&n&&Object.defineProperty(r,o,n),n};const c=/^--[A-Za-z0-9_-]+$/,d=/url\(|image-set\(|expression\(|javascript:|[;{}<>@\\]|\/\*/i,l=t=>Array.from(t).some(t=>t.charCodeAt(0)<32);class p extends e.WF{constructor(){super(...arguments),this.vars={},this.labels={frame:"",caption:"",title:"",text:"",value:"",button:""},this._applied=new Set}updated(t){if(!t.has("vars"))return;const r=this.renderRoot.querySelector("[data-tablet]");if(!r)return;const o=function(t){const r={};for(const[o,e]of Object.entries(t))!c.test(o)||"string"!=typeof e||""===e.trim()||d.test(e)||l(e)||(r[o]=e);return r}(this.vars);for(const t of this._applied)t in o||r.style.removeProperty(t);for(const[t,e]of Object.entries(o))r.style.setProperty(t,e);this._applied=new Set(Object.keys(o))}render(){const{width:t,height:r}=n.t2,o=this.labels;return e.qy`
      <div data-frame role="group" tabindex="0" aria-label=${o.frame} style=${(0,i.W)({width:.2*t+"px",height:.2*r+"px"})}>
        <div data-tablet style=${(0,i.W)({width:`${t}px`,height:`${r}px`,transform:"scale(0.2)"})}>
          <div data-card style=${(0,i.W)({width:"412px"})}>
            <h3>${o.title}</h3>
            <div class="tablet-row"><span>${o.text}</span><span class="value">${o.value}</span></div>
            <span class="tablet-button">${o.button}</span>
          </div>
        </div>
      </div>
      <p class="caption">${o.caption}</p>
    `}}p.styles=e.AH`
    :host {
      display: block;
    }
    [data-frame] {
      position: relative;
      overflow: hidden;
      border: 1px solid var(--divider-color, #888);
      border-radius: 4px;
      box-sizing: content-box;
    }
    [data-frame]:focus-visible {
      outline: 2px solid var(--primary-color, #03a9f4);
      outline-offset: 2px;
    }
    [data-tablet] {
      transform-origin: 0 0;
      background: var(--primary-background-color, #fafafa);
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
      padding: 24px;
      box-sizing: border-box;
    }
    [data-card] {
      box-sizing: border-box;
      padding: 16px;
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 1px 3px rgba(0, 0, 0, 0.2));
    }
    h3 {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 500;
    }
    .tablet-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      color: var(--secondary-text-color, #727272);
      font-size: 14px;
    }
    .value {
      color: var(--primary-text-color, #212121);
      font-size: 28px;
    }
    .tablet-button {
      margin-top: 12px;
      padding: 8px 16px;
      border-radius: 18px;
      display: inline-block;
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      font-size: 14px;
    }
    .caption {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
    }
  `,s([(0,a.MZ)({attribute:!1})],p.prototype,"vars",void 0),s([(0,a.MZ)({attribute:!1})],p.prototype,"labels",void 0),customElements.get("mc-wall-tablet")||customElements.define("mc-wall-tablet",p);const b=!0}};