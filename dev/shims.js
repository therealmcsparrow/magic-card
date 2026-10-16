// Minimal HA element shims for the local harness. Never shipped.
const MDI_CSS = 'https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css';
// Chrome ignores @font-face inside shadow roots, so register the font once globally.
// The per-shadow-root link below still supplies the .mdi-* class rules.
if (!document.getElementById('mdi-global')) {
  const globalMdi = document.createElement('link');
  globalMdi.id = 'mdi-global';
  globalMdi.rel = 'stylesheet';
  globalMdi.href = MDI_CSS;
  document.head.appendChild(globalMdi);
}
// Mirrors HA's structure: <ha-icon> sets no display (so it is inline) and renders an <ha-svg-icon>
// that is inline-flex, vertical-align: middle, sized by --mdc-icon-size, with a display:block <svg>
// (no text baseline). The glyph is absolutely positioned so the inner box, like the svg, has none.
// Like HA's ha-svg-icon (fill: var(--icon-primary-color, currentcolor)), a theme's --icon-primary-color wins over color.
class HaIcon extends HTMLElement {
  static get observedAttributes() { return ['icon']; }
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  set icon(v) { this.setAttribute('icon', v || ''); }
  get icon() { return this.getAttribute('icon') || ''; }
  attributeChangedCallback() { this.render(); }
  connectedCallback() { this.render(); }
  render() {
    const name = this.icon.replace(/^mdi:/, '');
    this.shadowRoot.innerHTML = `<link rel="stylesheet" href="${MDI_CSS}"><style>:host{fill:currentcolor}.svg{display:var(--ha-icon-display,inline-flex);align-items:center;justify-content:center;position:relative;vertical-align:middle;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}i{position:absolute;inset:0;display:block;text-align:center;font-size:var(--mdc-icon-size,24px);line-height:var(--mdc-icon-size,24px);color:var(--icon-primary-color,currentcolor)}</style><span class="svg"><i class="mdi mdi-${name}"></i></span>`;
  }
}
customElements.define('ha-icon', HaIcon);
class HaCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }).innerHTML = '<style>:host{display:block;background:var(--card-background-color);border-radius:var(--ha-card-border-radius,12px);border:1px solid var(--divider-color)}</style><slot></slot>'; }
}
customElements.define('ha-card', HaCard);
class HaYamlEditor extends HTMLElement {
  set defaultValue(v) { this._v = v; this.render(); }
  connectedCallback() { this.render(); }
  render() {
    this.innerHTML = '';
    const ta = document.createElement('textarea');
    ta.style.cssText = 'width:100%;min-height:420px;font:13px/1.6 Consolas,monospace;box-sizing:border-box';
    ta.value = JSON.stringify(this._v ?? {}, null, 2);
    this.appendChild(ta);
  }
}
customElements.define('ha-yaml-editor', HaYamlEditor);
// HA's ha-dialog (wa-dialog): content sits behind a shadow root in a dialog part with
// `transform: translate(...)` and `overflow: hidden` -> containing block + clip for position: fixed.
class HaMockDialog extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = '<style>.surface{flex:1;min-height:0;display:flex;flex-direction:column;'
      + 'transform:translate(calc(0px + 0px),calc(0px + 0px));overflow:hidden;border-radius:inherit}</style>'
      + '<div class="surface" part="dialog"><slot></slot></div>';
  }
}
customElements.define('ha-mock-dialog', HaMockDialog);
