// Standalone theme editor for the harness: an in-memory ThemeBackend (the same shape the Utils panel
// builds on theme-files 1.0.0) and a small fake hass. Query: ?theme=light|dark (the page's own HA
// theme), ?include=missing|ok, ?empty=1 (no theme files), ?open=<name>, ?readonly=1, ?w=<px> (host width).
const params = new URLSearchParams(location.search);
document.documentElement.dataset.theme = params.get('theme') || 'light';
if (params.get('w')) document.body.style.width = `${params.get('w')}px`;

const doc = (o) => JSON.parse(JSON.stringify(o));
const FILES = {
  my_theme: {
    'primary-color': '#3b82f6', 'ha-card-border-radius': '16px', 'card-mod-theme': 'my_theme',
    modes: {
      light: { 'primary-color': '#1d5fd1', 'card-background-color': '#ffffff', 'primary-background-color': '#f5f6f8', 'primary-text-color': '#1b1f24', 'secondary-text-color': '#5a626c' },
      dark: { 'primary-color': '#7aa7ff', 'card-background-color': '#1d2128', 'primary-background-color': '#14171c', 'primary-text-color': '#eceff3', 'secondary-text-color': '#a2a9b3' },
    },
  },
  kitchen_dark: { 'primary-color': '#ff7043', 'primary-background-color': '#101214', 'card-background-color': '#1a1d21', 'primary-text-color': '#f1f1f1' },
  ha_core_blue: { 'primary-color': '#0b5fff', 'secondary-text-color': '#555555' },
};

const state = {
  include: params.get('include') === 'missing'
    ? { state: 'missing', dir_exists: false, hint: 'frontend:\n  themes: !include_dir_merge_named themes' }
    : { state: 'ok', dir_exists: true, hint: '' },
  files: params.get('empty') === '1' ? {} : doc(FILES),
  saved: [],
};
const entry = (name) => ({
  name, file: `themes/${name}.yaml`, editable: name !== 'ha_core_blue', reason: name === 'ha_core_blue' ? 'multiple_themes' : undefined,
  has_modes: !!state.files[name].modes, var_count: Object.keys(state.files[name]).filter((k) => k !== 'modes').length + Object.values(state.files[name].modes ?? {}).reduce((n, b) => n + Object.keys(b).length, 0),
  mtime: 1000,
});
const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const backend = {
  async list() {
    await wait();
    return { include: state.include, files: Object.keys(state.files).map(entry), loaded: Object.keys(state.files) };
  },
  async get(name) {
    await wait();
    if (!state.files[name]) throw Object.assign(new Error('Theme not found'), { code: 'not_found' });
    const e = entry(name);
    return { name, file: e.file, editable: e.editable, reason: e.reason, mtime: e.mtime, theme: doc(state.files[name]) };
  },
  async save(req) {
    await wait(200);
    state.saved.push(req);
    state.files[req.name] = doc(req.theme);
    return { name: req.name, file: `themes/${req.name}.yaml`, mtime: 2000, loaded: true };
  },
  async remove(name) {
    await wait();
    delete state.files[name];
  },
};

const hass = {
  themes: { darkMode: document.documentElement.dataset.theme === 'dark', themes: { midnight: { 'primary-color': '#4cc2ff', modes: { dark: { 'card-background-color': '#0b0b0d' } } }, 'Backend-selected': {} } },
  states: {
    'light.living_room': { state: 'on', attributes: { friendly_name: 'Living room' } },
    'light.bedroom': { state: 'off', attributes: { friendly_name: 'Bedroom' } },
    'sensor.temperature': { state: '21', attributes: { friendly_name: 'Temperature', unit_of_measurement: '°C' } },
  },
  entities: {}, devices: {}, areas: {}, config: { unit_system: {} }, language: 'en', locale: { language: 'en' },
  callWS: async (msg) => (msg.type === 'lovelace/resources' ? [] : {}),
  callService: async () => {},
};

// HA's card helpers, reduced: a tile and an entities card drawn from the theme variables
class FakeTile extends HTMLElement {
  setConfig(c) { this._c = c; }
  set hass(h) { this._h = h; this.render(); }
  connectedCallback() { this.render(); }
  render() {
    const st = this._h?.states?.[this._c?.entity];
    const on = st?.state === 'on';
    const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>.t{display:flex;gap:12px;align-items:center;padding:12px;border-radius:var(--ha-card-border-radius,12px);background:var(--ha-card-background,var(--card-background-color));border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--divider-color));box-shadow:var(--ha-card-box-shadow,none);color:var(--primary-text-color)}
      .i{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,${on ? 'var(--state-light-active-color,#ffc107)' : 'var(--state-inactive-color,#9e9e9e)'} 20%,transparent);color:${on ? 'var(--state-light-active-color,#ffc107)' : 'var(--state-inactive-color,#9e9e9e)'}}
      small{color:var(--secondary-text-color)}</style><div class="t"><span class="i">●</span><span><b>${st?.attributes?.friendly_name ?? 'Tile'}</b><br><small>${on ? 'On' : 'Off'}</small></span></div>`;
  }
}
class FakeEntities extends HTMLElement {
  setConfig(c) { this._c = c; }
  set hass(h) { this._h = h; this.render(); }
  connectedCallback() { this.render(); }
  render() {
    const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
    const rows = (this._c?.entities ?? []).map((e) => `<div class="r"><span>${this._h?.states?.[e]?.attributes?.friendly_name ?? e}</span><span class="v">${this._h?.states?.[e]?.state ?? ''}</span></div>`).join('');
    root.innerHTML = `<style>.c{padding:8px 16px;border-radius:var(--ha-card-border-radius,12px);background:var(--ha-card-background,var(--card-background-color));border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--divider-color));color:var(--primary-text-color)}
      h3{margin:8px 0;font-weight:400;font-size:1.25rem}.r{display:flex;justify-content:space-between;padding:10px 0;border-top:1px solid var(--divider-color)}.v{color:var(--primary-color)}</style><div class="c"><h3>${this._c?.title ?? ''}</h3>${rows}</div>`;
  }
}
customElements.define('hui-tile-card', FakeTile);
customElements.define('hui-entities-card', FakeEntities);
window.loadCardHelpers = async () => ({
  createCardElement(config) {
    const el = document.createElement(config.type === 'tile' ? 'hui-tile-card' : 'hui-entities-card');
    el.setConfig(config);
    return el;
  },
});

const el = document.createElement('magic-card-theme-editor');
el.hass = hass;
el.backend = backend;
if (params.get('open')) el.selectedName = params.get('open');
document.body.appendChild(el);
window.__te = { el, backend, state, hass, wait };

// helpers the shoot scenarios call (scripts/scenarios-theme-editor.mjs)
const start = () => el.shadowRoot.querySelector('mcte-start-view');
const editor = () => el.shadowRoot.querySelector('mcte-editor-view');
window.__teh = {
  start, editor,
  openMine: (name = 'my_theme') => [...start().shadowRoot.querySelectorAll('.title')].find((b) => b.textContent.trim() === name).click(),
  newTheme: () => { start().openCreate(); const d = start().shadowRoot.querySelector('dialog'); if (d && !d.open) d.showModal(); },
  createNow: () => start().shadowRoot.querySelector('button[type=submit]').click(),
  group: (id) => { const g = editor().shadowRoot.querySelector(`mcte-field-group[data-id="${id}"]`); if (g && !g.open) g.shadowRoot.querySelector('.sector-btn').click(); },
};
