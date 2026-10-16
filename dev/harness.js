const params = new URLSearchParams(location.search);
document.documentElement.style.setProperty('--w', (params.get('w') || '560') + 'px');
document.documentElement.dataset.theme = params.get('theme') || 'light';
const longEntity = params.get('long') === '1';
const tplName = params.get('tpl') || 'room-card';

const states = {
  'light.living_room': { entity_id: 'light.living_room', state: 'on', attributes: { friendly_name: 'Living Room Light', brightness: 184 } },
  'sensor.living_room_temperature': { entity_id: 'sensor.living_room_temperature', state: '21.4', attributes: { friendly_name: 'Living Room Temperature', unit_of_measurement: '°C' } },
  'sensor.living_room_temperature_corrected_average': { entity_id: 'sensor.living_room_temperature_corrected_average', state: '21.2', attributes: { friendly_name: 'Living Room Temperature (corrected average)', unit_of_measurement: '°C' } },
  // Modern weather entity: no forecast attribute, forecasts via weather/subscribe_forecast (daily | hourly | twice daily).
  'weather.home': { entity_id: 'weather.home', state: 'partlycloudy', attributes: { friendly_name: 'Home', temperature: 18, temperature_unit: '°C',
    precipitation_unit: 'mm', wind_speed_unit: 'km/h', supported_features: 7 } },
  'input_select.scene': { entity_id: 'input_select.scene', state: 'Relax', attributes: { friendly_name: 'Scene', options: ['Relax', 'Read'] } },
  // A state carrying markup: must show as text, never run.
  'input_text.note': { entity_id: 'input_text.note', state: '<img src=x onerror="window.__xss=1">', attributes: { friendly_name: 'Note' } },
  'sun.sun': { entity_id: 'sun.sun', state: 'above_horizon', attributes: { friendly_name: 'Sun' } },
  // Batch 4 (content modules): attributes, non-numeric states, pictures, a camera.
  'climate.living_room': { entity_id: 'climate.living_room', state: 'heat', attributes: { friendly_name: 'Living Room Thermostat',
    current_temperature: 20.46, temperature: 21, current_humidity: 48, hvac_action: 'heating',
    min_temp: 7, max_temp: 30, target_temp_step: 0.5, hvac_modes: ['off', 'heat', 'auto'], preset_mode: 'eco', preset_modes: ['eco', 'comfort', 'away'] } },
  'sensor.humidity': { entity_id: 'sensor.humidity', state: '45.27', attributes: { friendly_name: 'Humidity', unit_of_measurement: '%' } },
  'sensor.power': { entity_id: 'sensor.power', state: 'unavailable', attributes: { friendly_name: 'Power', unit_of_measurement: 'W' } },
  'sensor.washer': { entity_id: 'sensor.washer', state: 'running', attributes: { friendly_name: 'Washer' } },
  'camera.front_door': { entity_id: 'camera.front_door', state: 'idle', attributes: { friendly_name: 'Front Door',
    entity_picture: '/api/camera_proxy/camera.front_door?token=abc', access_token: 'abc' } },
  'image.doorbell': { entity_id: 'image.doorbell', state: '2026-10-14T08:00:00+00:00', attributes: { friendly_name: 'Doorbell',
    entity_picture: '/api/image_proxy/image.doorbell?token=xyz' } },
  'media_player.kitchen': { entity_id: 'media_player.kitchen', state: 'playing', attributes: { friendly_name: 'Kitchen speaker',
    cover_url: '/local/cover.svg', volume_level: 0.35, supported_features: 4 | 2048, source: 'Radio', source_list: ['Radio', 'Spotify', 'TV'] } },
  // Batch 5 (controls): colour-mode lights in kelvin, selects, numbers, fan, cover, an unavailable thermostat.
  'light.desk': { entity_id: 'light.desk', state: 'on', attributes: { friendly_name: 'Desk lamp', brightness: 128, supported_color_modes: ['color_temp', 'hs'],
    color_mode: 'hs', color_temp_kelvin: null, min_color_temp_kelvin: 2200, max_color_temp_kelvin: 6500, hs_color: [30, 60], rgb_color: [255, 170, 102],
    effect_list: ['None', 'Rainbow', 'Candle'], effect: 'None', supported_features: 4 } },
  'light.hall': { entity_id: 'light.hall', state: 'off', attributes: { friendly_name: 'Hall', supported_color_modes: ['brightness'], supported_features: 0 } },
  'light.kitchen': { entity_id: 'light.kitchen', state: 'on', attributes: { friendly_name: 'Kitchen lights', brightness: 230, supported_color_modes: ['color_temp'],
    color_mode: 'color_temp', color_temp_kelvin: 3400, min_color_temp_kelvin: 2700, max_color_temp_kelvin: 6000 } },
  'switch.coffee': { entity_id: 'switch.coffee', state: 'off', attributes: { friendly_name: 'Coffee machine' } },
  'select.fan_speed': { entity_id: 'select.fan_speed', state: 'medium', attributes: { friendly_name: 'Fan speed', options: ['low', 'medium', 'high'] } },
  'input_number.target_temp': { entity_id: 'input_number.target_temp', state: '20.5', attributes: { friendly_name: 'Target temperature', min: 15, max: 25, step: 0.5, unit_of_measurement: '°C' } },
  'number.volume': { entity_id: 'number.volume', state: '0.3', attributes: { friendly_name: 'Volume', min: 0, max: 1, step: 0.1 } },
  'fan.ceiling': { entity_id: 'fan.ceiling', state: 'on', attributes: { friendly_name: 'Ceiling fan', percentage: 66, percentage_step: 33.333333333333336, supported_features: 1 | 8, preset_modes: ['breeze'], preset_mode: null } },
  'cover.blinds': { entity_id: 'cover.blinds', state: 'open', attributes: { friendly_name: 'Blinds', current_position: 40, supported_features: 15 } },
  'climate.office': { entity_id: 'climate.office', state: 'unavailable', attributes: { friendly_name: 'Office thermostat' } },
  'climate.bedroom': { entity_id: 'climate.bedroom', state: 'heat_cool', attributes: { friendly_name: 'Bedroom thermostat', temperature: null,
    target_temp_low: 19, target_temp_high: 23, min_temp: 7, max_temp: 30, target_temp_step: 0.5, hvac_modes: ['off', 'heat_cool'] } },
};

/** Units HA shows for these attributes (formatEntityAttributeValue). */
const ATTRIBUTE_UNITS = { current_temperature: '°C', temperature: '°C', current_humidity: '%', humidity: '%', battery_level: '%' };
/** HA's value / unit parts: no space before % and °, one otherwise. */
const toParts = (value, unit) => (unit ? [{ type: 'value', value }, ...(/^(%|°)$/.test(unit) ? [] : [{ type: 'literal', value: ' ' }]), { type: 'unit', value: unit }] : [{ type: 'value', value }]);
const fmtNumber = (v) => new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(v);
const STATE_NAMES = { unavailable: 'Unavailable', unknown: 'Unknown', heat: 'Heat', idle: 'Idle', running: 'Running', on: 'On', off: 'Off', playing: 'Playing', heating: 'Heating',
  auto: 'Auto', eco: 'Eco', comfort: 'Comfort', away: 'Away', low: 'Low', medium: 'Medium', high: 'High', open: 'Open' };
function stateParts(s, state) {
  const v = state ?? s.state;
  const unit = s.attributes.unit_of_measurement;
  if (v !== '' && !Number.isNaN(Number(v))) return toParts(fmtNumber(Number(v)), unit);
  return [{ type: 'value', value: STATE_NAMES[v] ?? v }];
}
function attributeParts(s, attr, value) {
  const v = value === undefined ? s.attributes[attr] : value;
  if (typeof v === 'number') return toParts(fmtNumber(v), ATTRIBUTE_UNITS[attr]);
  return [{ type: 'value', value: v === undefined || v === null ? '' : STATE_NAMES[v] ?? String(v) }];
}
/**
 * history/history_during_period stand-in (HA's compressed format): numeric sensors wander every
 * 10 minutes; attributes only come with minimal_response false (like HA, which drops them after the
 * first state otherwise).
 */
function fakeHistory(msg) {
  const start = Date.parse(msg.start_time), end = Date.parse(msg.end_time);
  const out = {};
  for (const id of msg.entity_ids) {
    const st = states[id];
    if (!st) continue;
    const base = id === 'sensor.humidity' ? 45 : 21;
    const list = [];
    for (let t = start, i = 0; t < end; t += 600e3, i++) {
      const wave = Math.sin(i / 12) * 2 + Math.sin(i / 3.3) * 0.4;
      const entry = { s: id.startsWith('climate.') ? 'heat' : (base + wave).toFixed(1), lu: t / 1000 };
      if (!msg.no_attributes && (!msg.minimal_response || i === 0)) entry.a = { ...st.attributes, current_temperature: +(20 + wave).toFixed(2) };
      list.push(entry);
    }
    out[id] = list;
  }
  historyRequests.push(msg);
  return out;
}
const historyRequests = [];
const serviceCalls = [];
/** media_source/resolve_media requests (ids), answered like HA with a signed URL that expires in 30 s. */
const mediaResolves = [];
const b64url = (o) => btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
function resolveMedia(id) {
  mediaResolves.push(id);
  const m = /^media-source:\/\/media_source\/local\/(.+)$/.exec(id);
  if (!m) throw new Error('Unknown media source');
  const now = Math.floor(Date.now() / 1000);
  // a relative fixture path (the harness is a file:// page); HA answers /media/local/...?authSig=...
  return { url: `fixtures/${m[1]}?authSig=${b64url({ alg: 'HS256' })}.${b64url({ iss: 'harness', iat: now, exp: now + 30 })}.sig${mediaResolves.length}`, mime_type: 'image/svg+xml' };
}
/** hass.hassUrl stand-in: the proxy URLs map to local fixture pictures. */
const PROXIED = { '/api/camera_proxy/camera.front_door': 'fixtures/camera.svg', '/api/image_proxy/image.doorbell': 'fixtures/doorbell.svg', '/local/cover.svg': 'fixtures/cover.svg' };
function hassUrl(path = '') {
  const [p, q] = path.split('?');
  return PROXIED[p] ? `${PROXIED[p]}${q ? `?${q}` : ''}` : path;
}

/**
 * Tiny stand-in for HA's render_template: states('id'), states(entity), state_attr(id, 'a'),
 * is_state('id', 'v'), plain literals. Anything else is a template error, like HA reports it.
 */
function renderTemplate(template, variables = {}) {
  const arg = (a) => { a = a.trim(); return /^['"]/.test(a) ? a.slice(1, -1) : variables[a]; };
  return template.replace(/\{\{\s*([\s\S]*?)\s*\}\}/g, (_m, expr) => {
    let m;
    if ((m = /^states\(([^)]*)\)$/.exec(expr))) return hass.states[arg(m[1])]?.state ?? 'unknown';
    if ((m = /^state_attr\(([^,]*),([^)]*)\)$/.exec(expr))) return String(hass.states[arg(m[1])]?.attributes[arg(m[2])] ?? 'None');
    if ((m = /^is_state\(([^,]*),([^)]*)\)$/.exec(expr))) return hass.states[arg(m[1])]?.state === arg(m[2]) ? 'True' : 'False';
    if (/^(true|false|\d+)$/i.test(expr)) return expr;
    if (expr in variables) return String(variables[expr]);
    throw new Error(`TemplateSyntaxError: unexpected '${expr}'`);
  });
}
/** weather/subscribe_forecast stand-in: a week of days, 24 hours, or day / night parts, from now. */
const CONDITIONS = ['sunny', 'partlycloudy', 'rainy', 'cloudy', 'pouring', 'lightning-rainy', 'snowy', 'fog'];
function fakeForecast(type) {
  const start = new Date(); start.setMinutes(0, 0, 0);
  if (type === 'hourly') {
    return Array.from({ length: 24 }, (_, i) => ({ datetime: new Date(start.getTime() + (i + 1) * 3600e3).toISOString(),
      condition: CONDITIONS[Math.floor(i / 3) % CONDITIONS.length], temperature: 14 + Math.round(4 * Math.sin(i / 4)), precipitation: i % 5 === 2 ? 0.4 : 0, wind_speed: 8 + i % 6, wind_bearing: 200 + i * 5 }));
  }
  if (type === 'twice_daily') {
    return Array.from({ length: 10 }, (_, i) => ({ datetime: new Date(start.getTime() + (i + 1) * 12 * 3600e3).toISOString(), is_daytime: i % 2 === 0,
      condition: ['partlycloudy', 'sunny', 'rainy'][i % 3], temperature: i % 2 ? 8 : 16, precipitation_probability: (i * 15) % 90 }));
  }
  return Array.from({ length: 7 }, (_, i) => ({ datetime: new Date(start.getTime() + (i + 1) * 86400e3).toISOString(),
    condition: CONDITIONS[i % CONDITIONS.length], temperature: 15 + i, templow: 7 + (i % 3), precipitation: [0, 0.5, 3.2, 0, 12, 1, 0][i], wind_speed: 10 + 2 * i, wind_bearing: 45 * i }));
}
const forecastSubs = new Set();
const templateSubs = new Set();
const connection = {
  subscribeEvents: async () => () => {},
  async subscribeMessage(cb, msg) {
    if (msg.type === 'weather/subscribe_forecast') {
      const sub = { cb, msg };
      forecastSubs.add(sub);
      setTimeout(() => forecastSubs.has(sub) && cb({ type: msg.forecast_type, forecast: fakeForecast(msg.forecast_type) }), 0);
      return () => forecastSubs.delete(sub);
    }
    if (msg.type !== 'render_template') return () => {};
    const sub = { cb, msg };
    const send = () => {
      try { cb({ result: renderTemplate(msg.template, msg.variables), listeners: {} }); } catch (e) { cb({ error: String(e.message), level: 'ERROR' }); }
    };
    sub.send = send;
    templateSubs.add(sub);
    setTimeout(send, 0);
    return () => templateSubs.delete(sub);
  },
};
// Entity registry display entries (HA's hass.entities): a user-set icon for the living room light.
const entities = { 'light.living_room': { entity_id: 'light.living_room', icon: 'mdi:ceiling-light' } };
const hass = {
  states, entities, themes: { themes: { 'Nord': {}, 'Catppuccin': {} }, darkMode: document.documentElement.dataset.theme === 'dark' }, language: 'en',
  locale: { language: 'en', number_format: 'language', time_format: 'language', time_zone: 'local' },
  config: { time_zone: 'Europe/Amsterdam', unit_system: { temperature: '°C', length: 'km', wind_speed: 'km/h', accumulated_precipitation: 'mm' } },
  callWS: async (msg) => {
    if (msg.type === 'magic_card_utils/get_templates') return { templates: { [tplName]: { config: config0(), description: 'Room card' } } };
    if (msg.type === 'history/history_during_period') return fakeHistory(msg);
    if (msg.type === 'media_source/resolve_media') return resolveMedia(msg.media_content_id);
    return {};
  },
  hassUrl,
  // Like HA: an optional state overrides the entity's own (weather conditions are translated).
  formatEntityState: (s, state) => {
    if (!s) return '';
    const v = state ?? s.state;
    if (s.entity_id.startsWith('weather.')) return { partlycloudy: 'Partly cloudy', 'lightning-rainy': 'Lightning, rainy', sunny: 'Sunny', rainy: 'Rainy', cloudy: 'Cloudy', pouring: 'Pouring', snowy: 'Snowy', fog: 'Fog', 'clear-night': 'Clear, night' }[v] ?? v;
    return stateParts(s, state).map((p) => p.value).join('');
  },
  formatEntityStateToParts: (s, state) => stateParts(s, state),
  formatEntityAttributeValue: (s, attr, value) => attributeParts(s, attr, value).map((p) => p.value).join(''),
  formatEntityAttributeValueToParts: (s, attr, value) => attributeParts(s, attr, value),
  formatEntityAttributeName: (_s, attr) => attr.charAt(0).toUpperCase() + attr.slice(1).replace(/_/g, ' '),
  // Service calls are recorded (window.__mc.serviceCalls) so scenarios can check what a control sent.
  callService: async (domain, service, data) => { serviceCalls.push({ domain, service, data }); },
  connection,
};
function config0() {
  return {
    type: 'custom:magic-card', name: 'Living Room', template: tplName, not_synced: [],
    rows: [
      { id: 'r1', layout: '1-1', columns: [
        { id: 'c1', modules: [
          { id: 'm1', type: 'icon', entity: 'light.living_room', icon: 'mdi:sofa-outline' },
          { id: 'm2', type: 'text', text: 'Living Room' } ] },
        { id: 'c2', modules: [
          { id: 'm3', type: 'button', entity: 'light.living_room', label: 'Toggle', icon: 'mdi:lightbulb', show_state: true, not_synced: ['label', 'button_style', 'design.padding'] },
          { id: 'm4', type: 'info', entity: longEntity ? 'sensor.living_room_temperature_corrected_average' : 'sensor.living_room_temperature' } ] } ] },
      { id: 'r2', layout: '1', columns: [ { id: 'c3', modules: [
        { id: 'm5', type: 'slider', entity: 'light.living_room' },
        { id: 'm6', type: 'graphs', entity: 'sensor.living_room_temperature', hours_to_show: 24 } ] } ] },
    ],
  };
}
/**
 * HA's card helpers stand-in (window.loadCardHelpers): type 'entity' is a small entity card with a
 * visual editor (getConfigElement); unknown types give an error card, like HA.
 */
class HarnessEntityCard extends HTMLElement {
  static async getConfigElement() { return document.createElement('hui-entity-card-editor'); }
  setConfig(c) {
    if (!c.entity) throw new Error('Entity required');
    this._config = c; this._render();
  }
  set hass(h) { this._hass = h; this._render(); }
  _render() {
    if (!this._config) return;
    const st = this._hass?.states[this._config.entity];
    this.innerHTML = '';
    const card = document.createElement('ha-card');
    card.style.cssText = 'display:block;padding:12px 16px';
    const name = document.createElement('div'); name.className = 'inner-name'; name.style.cssText = 'font-size:.85rem;color:var(--secondary-text-color)';
    name.textContent = this._config.name || st?.attributes.friendly_name || this._config.entity;
    const value = document.createElement('div'); value.className = 'inner-state'; value.style.cssText = 'font-size:1.4rem;font-weight:500';
    value.textContent = st ? this._hass.formatEntityState(st) : 'unavailable';
    card.append(name, value);
    if (this._config.show_icon !== false && this._config.icon) {
      const icon = document.createElement('ha-icon'); icon.setAttribute('icon', this._config.icon); card.prepend(icon);
    }
    this.append(card);
  }
}
customElements.define('hui-entity-card', HarnessEntityCard);
class HarnessEntityCardEditor extends HTMLElement {
  setConfig(c) { this._config = c; this._render(); }
  set hass(h) { this._hass = h; }
  _field(key, label) {
    const wrap = document.createElement('label'); wrap.style.cssText = 'display:grid;gap:4px;margin-bottom:10px;font-size:.8rem';
    wrap.textContent = label;
    const input = document.createElement('input'); input.name = key; input.value = this._config[key] ?? '';
    input.style.cssText = 'padding:6px 8px;border:1px solid var(--divider-color);border-radius:6px;background:var(--card-background-color);color:var(--primary-text-color)';
    input.addEventListener('input', () => this._change({ [key]: input.value }));
    wrap.append(input); return wrap;
  }
  _change(patch) {
    this._config = { ...this._config, ...patch };
    this.dispatchEvent(new CustomEvent('config-changed', { bubbles: true, composed: true, detail: { config: this._config } }));
  }
  _render() {
    if (this._rendered) { for (const i of this.querySelectorAll('input')) i.value = this._config[i.name] ?? ''; return; }
    this._rendered = true;
    this.append(this._field('entity', 'Entity'), this._field('name', 'Name'), this._field('icon', 'Icon'));
  }
}
customElements.define('hui-entity-card-editor', HarnessEntityCardEditor);
/**
 * HA's <ha-camera-stream> stand-in: only defined once a picture card loaded (like HA's lazy chunk).
 * Shows the snapshot with a LIVE badge, and a control bar when `controls` is set.
 */
function defineCameraStream() {
  if (customElements.get('ha-camera-stream')) return;
  class HarnessCameraStream extends HTMLElement {
    set hass(h) { this._hass = h; this._render(); }
    set stateObj(s) { this._stateObj = s; this._render(); }
    set controls(v) { this._controls = !!v; this._render(); }
    get controls() { return this._controls; }
    set muted(v) { this._muted = !!v; this._render(); }
    get muted() { return this._muted; }
    _render() {
      if (!this._stateObj) return;
      this.dataset.controls = this._controls ? 'on' : 'off';
      this.dataset.muted = this._muted ? 'on' : 'off';
      this.style.position = 'relative';
      this.innerHTML = `<img src="${hassUrl(this._stateObj.attributes.entity_picture)}" style="width:100%;height:100%;object-fit:cover;display:block" alt="">`
        + '<span style="position:absolute;top:8px;right:8px;background:#e53935;color:#fff;font:600 11px sans-serif;padding:2px 6px;border-radius:4px">LIVE</span>'
        + (this._controls ? '<div class="harness-controls" style="position:absolute;left:0;right:0;bottom:0;height:28px;background:rgba(0,0,0,.55);color:#fff;font:12px sans-serif;display:flex;align-items:center;gap:12px;padding:0 10px">play · pause · sound · full screen</div>' : '');
    }
  }
  customElements.define('ha-camera-stream', HarnessCameraStream);
}
/** HA's hui-error-card: what HA's card helpers give for a config a card refuses or an unknown type. */
class HarnessErrorCard extends HTMLElement {
  setConfig(c) {
    this._config = c;
    this.style.cssText = 'display:block;padding:8px;color:var(--error-color);border:1px solid var(--error-color);border-radius:8px';
    this.textContent = c.error;
  }
}
customElements.define('hui-error-card', HarnessErrorCard);
/** HA's entities card: refuses a config without entities (HA then shows its error card); visual editor. */
class HarnessEntitiesCard extends HTMLElement {
  static async getConfigElement() { return document.createElement('hui-entities-card-editor'); }
  setConfig(c) {
    if (!Array.isArray(c.entities)) throw new Error('Entities must be specified');
    this._config = c; this._render();
  }
  set hass(h) { this._hass = h; this._render(); }
  _render() {
    if (!this._config) return;
    const card = document.createElement('ha-card');
    card.style.cssText = 'display:block;padding:12px 16px';
    if (this._config.title) { const t = document.createElement('div'); t.className = 'inner-title'; t.style.cssText = 'font-weight:500;margin-bottom:6px'; t.textContent = this._config.title; card.append(t); }
    for (const id of this._config.entities) {
      const st = this._hass?.states[id];
      const row = document.createElement('div'); row.className = 'inner-row'; row.style.cssText = 'display:flex;justify-content:space-between;gap:8px';
      row.innerHTML = '<span></span><span></span>';
      row.children[0].textContent = st?.attributes.friendly_name || id;
      row.children[1].textContent = st ? this._hass.formatEntityState(st) : 'unavailable';
      card.append(row);
    }
    this.replaceChildren(card);
  }
}
customElements.define('hui-entities-card', HarnessEntitiesCard);
class HarnessEntitiesCardEditor extends HarnessEntityCardEditor {
  setConfig(c) { this._config = { ...c, entities: (c.entities || []).join(', ') }; this._render(); }
  _change(patch) {
    this._config = { ...this._config, ...patch };
    const entities = String(this._config.entities || '').split(',').map((s) => s.trim()).filter(Boolean);
    this.dispatchEvent(new CustomEvent('config-changed', { bubbles: true, composed: true, detail: { config: { ...this._config, entities } } }));
  }
  _render() {
    if (this._rendered) { for (const i of this.querySelectorAll('input')) i.value = this._config[i.name] ?? ''; return; }
    this._rendered = true;
    this.append(this._field('title', 'Title'), this._field('entities', 'Entities (comma separated)'));
  }
}
customElements.define('hui-entities-card-editor', HarnessEntitiesCardEditor);
/** HA's ha-form stand-in: text / entity / boolean selectors, labels and helpers, value-changed. */
class HarnessHaForm extends HTMLElement {
  set data(d) { this._data = d || {}; this._render(); }
  get data() { return this._data; }
  set schema(s) { this._schema = s || []; this._built = false; this._render(); }
  get schema() { return this._schema; }
  set computeLabel(f) { this._label = f; this._built = false; this._render(); }
  set computeHelper(f) { this._helper = f; this._built = false; this._render(); }
  set hass(h) { this._hass = h; }
  _emit(name, value) {
    this._data = { ...this._data, [name]: value };
    this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true, detail: { value: this._data } }));
  }
  _render() {
    if (!this._schema || !this._data) return;
    if (this._built) {
      for (const i of this.querySelectorAll('input')) { if (i.type === 'checkbox') i.checked = !!this._data[i.name]; else i.value = this._data[i.name] ?? ''; }
      return;
    }
    this._built = true;
    this.replaceChildren();
    for (const s of this._schema) {
      const wrap = document.createElement('label'); wrap.className = 'harness-form-field'; wrap.style.cssText = 'display:grid;gap:4px;margin-bottom:10px;font-size:.8rem';
      const label = document.createElement('span'); label.textContent = this._label ? this._label(s) : s.name;
      const input = document.createElement('input'); input.name = s.name;
      if (s.selector?.boolean) { input.type = 'checkbox'; input.checked = !!this._data[s.name]; input.addEventListener('change', () => this._emit(s.name, input.checked)); wrap.style.cssText += ';grid-template-columns:auto 1fr;align-items:center'; wrap.append(input, label); }
      else {
        input.value = this._data[s.name] ?? '';
        input.style.cssText = 'padding:6px 8px;border:1px solid var(--divider-color);border-radius:6px;background:var(--card-background-color);color:var(--primary-text-color)';
        input.addEventListener('input', () => this._emit(s.name, input.value));
        wrap.append(label, input);
      }
      const help = this._helper?.(s);
      if (help) { const h = document.createElement('span'); h.className = 'harness-form-helper'; h.style.cssText = 'color:var(--secondary-text-color);font-size:.72rem'; h.textContent = help; wrap.append(h); }
      this.append(wrap);
    }
  }
}
customElements.define('ha-form', HarnessHaForm);
/** A custom card whose editor is a schema (static getConfigForm), defined late like a slow resource. */
class HarnessFormCard extends HarnessEntityCard {
  // No editor element (like HA's hui-element-editor, the form is used then).
  static getConfigElement() { return undefined; }
  static getConfigForm() {
    return {
      schema: [
        { name: 'entity', required: true, selector: { entity: {} } },
        { name: 'name', selector: { text: {} } },
        { name: 'icon', selector: { icon: {} } },
        { name: 'show_icon', selector: { boolean: {} } },
      ],
      computeLabel: (s) => ({ entity: 'Entity', name: 'Name', icon: 'Icon', show_icon: 'Show icon' })[s.name],
      computeHelper: (s) => (s.name === 'name' ? 'Shown above the state' : undefined),
    };
  }
}
setTimeout(() => customElements.define('harness-form-card', HarnessFormCard), 300);
/**
 * HA's card helpers (create-element-base.ts): built-in `hui-<type>-card` classes (always loaded or
 * lazy), `custom:` elements, HA's error card for a config a card refuses or an unknown type.
 */
const ALWAYS_LOADED = new Set(['entity', 'entities', 'error']);
const LAZY_TYPES = {
  // HA loads its picture cards (and with them ha-camera-stream) when one is created.
  'picture-glance': () => setTimeout(defineCameraStream, 50),
};
function errorCardElement(message, origConfig) {
  const el = document.createElement('hui-error-card');
  el.setConfig({ type: 'error', error: message, origConfig });
  return el;
}
window.loadCardHelpers = async () => ({
  createCardElement(config) {
    const create = (tag) => { const el = document.createElement(tag); el.setConfig(config); return el; };
    try {
      const type = String(config.type);
      if (type.startsWith('custom:')) {
        const tag = type.slice(7);
        if (customElements.get(tag)) return create(tag);
        const el = document.createElement(tag);
        customElements.whenDefined(tag).then(() => { customElements.upgrade(el); try { el.setConfig(config); } catch { el.dispatchEvent(new Event('ll-rebuild')); } });
        return el;
      }
      if (type === 'picture-glance') { LAZY_TYPES[type](); const el = document.createElement('div'); el.className = 'harness-picture-glance'; return el; }
      if (ALWAYS_LOADED.has(type)) return create(`hui-${type}-card`);
      throw new Error(`Unknown type encountered: ${type}`);
    } catch (e) {
      return errorCardElement(e.message, config);
    }
  },
});

/** Batch 3 of the module audit: clock, forecast (daily / hourly / twice daily), custom card with an inner card. */
function advancedConfig() {
  return {
    type: 'custom:magic-card',
    rows: [
      { id: 'a1', layout: '1-1', columns: [
        { id: 'a1c1', modules: [
          { id: 'clk', type: 'clock', show_seconds: true, show_date: true, date_format: 'long' },
          { id: 'clk12', type: 'clock', format_12h: true, show_date: true, date_format: 'dddd D MMMM [week of] YYYY' },
        ] },
        { id: 'a1c2', modules: [
          { id: 'cc', type: 'custom-card', name: 'Inner', card_type: 'entity', card_config: { entity: 'sensor.living_room_temperature', name: 'Inner card', icon: 'mdi:thermometer' } },
        ] },
      ] },
      { id: 'a2', layout: '1', columns: [ { id: 'a2c1', modules: [
        { id: 'fd', type: 'forecast', entity: 'weather.home', forecast_type: 'daily', num_forecasts: 7, show_temperature: true, show_precipitation: true, show_wind: true },
        { id: 'fh', type: 'forecast', entity: 'weather.home', forecast_type: 'hourly', num_forecasts: 8, show_temperature: true, show_precipitation: false },
        { id: 'ft', type: 'forecast', entity: 'weather.home', forecast_type: 'twice_daily', num_forecasts: 6, show_temperature: true, show_precipitation: true },
      ] } ] },
    ],
  };
}

/**
 * Batch 3 review: custom cards whose editor comes from the card class like in HA: a built-in
 * entities card with an incomplete config (HA gives its error card, the editor stays visual) and a
 * custom card with a getConfigForm schema.
 */
function customCardsConfig() {
  return {
    type: 'custom:magic-card',
    rows: [
      { id: 'k1', layout: '1-1', columns: [
        { id: 'k1c1', modules: [ { id: 'ents', type: 'custom-card', name: 'Entities', card_type: 'entities', card_config: {} } ] },
        { id: 'k1c2', modules: [ { id: 'form', type: 'custom-card', name: 'Form', card_type: 'custom:harness-form-card', card_config: { entity: 'sensor.living_room_temperature', icon: 'mdi:thermometer', show_icon: true } } ] },
      ] },
    ],
  };
}

const editor = document.createElement('magic-card-editor');
editor.hass = hass;
document.getElementById('pane').appendChild(editor);
editor.setConfig(config0());
const card = document.createElement('magic-card');
card.setConfig(config0()); card.hass = hass;
document.getElementById('preview').appendChild(card);
/** Every config the editor sent to HA (config-changed), newest last. */
const emitted = [];
editor.addEventListener('config-changed', (e) => { emitted.push(e.detail.config); card.setConfig(e.detail.config); });

/** Batch 1 of the module audit: refresh, inline validation, templates, sanitised markdown. */
function modulesConfig() {
  return {
    type: 'custom:magic-card',
    rows: [
      { id: 'b1', layout: '1-1', columns: [
        { id: 'b1c1', modules: [
          { id: 'md', type: 'markdown', content: "### Living room\nIt is **{{ states('sensor.living_room_temperature') }} °C**." },
          // Legacy placeholder: the state is text. Jinja output is HTML, sanitised (no handlers survive).
          { id: 'md-note', type: 'markdown', content: 'Note: {{ state }}', entity: 'input_text.note' },
          { id: 'md-raw', type: 'markdown', content: "Raw: {{ states('input_text.note') }}" },
          { id: 'tt', type: 'text', use_template: true, text: "Light is {{ states('light.living_room') }}" },
          { id: 'day', type: 'text', text: 'Shown while the sun is up (template condition)',
            display: { conditions: [{ id: 'q1', type: 'template', template: "{{ is_state('sun.sun', 'above_horizon') }}" }] } },
          { id: 'night', type: 'text', text: 'NIGHT (must be hidden)',
            display: { conditions: [{ id: 'q2', type: 'template', template: "{{ is_state('sun.sun', 'below_horizon') }}" }] } },
        ] },
        { id: 'b1c2', modules: [
          { id: 'hz', type: 'horizontal', modules: [
            { type: 'text', use_entity: true, entity: 'sensor.living_room_temperature', entity_display: 'name_state' } ] },
          { id: 'bar', type: 'bar', min: 0, max: 100, bar_height: '8px', show_value: true, direction: 'horizontal' },
          { id: 'cc', type: 'custom-card', name: '', card_type: '', card_config: {} },
          { id: 'bad', type: 'bar', entity: 'sensor.living_room_temperature', min: 50, max: 10 },
          { id: 'tpl-err', type: 'text', use_template: true, text: '{{ nope( }}' },
        ] },
      ] },
    ],
  };
}

/** Batch 2 of the module audit: layout children with their own design / actions / conditions, tabs, real slider. */
function layoutsConfig() {
  const tile = (id, text, extra = {}) => ({ id, type: 'text', text, ...extra });
  return {
    type: 'custom:magic-card',
    rows: [
      { id: 'l1', layout: '1', columns: [ { id: 'l1c1', modules: [
        { id: 'hz2', type: 'horizontal', gap: '8px', justify: 'space-between', modules: [
          tile('hz-a', 'Styled child', { design: { color: '#4e342e', background_color: '#ffe0b2', border_radius: '8px', padding: '4px 8px', border_width: '2px', border_style: 'solid', border_color: '#ff9800' } }),
          tile('hz-b', 'HIDDEN child (must not show)', { display: { conditions: [{ id: 'hc', type: 'state', entity: 'light.living_room', state: 'off' }] } }),
          { id: 'hz-c', type: 'button', entity: 'light.living_room', label: 'Child action', icon: 'mdi:lightbulb', actions: { tap_action: { action: 'toggle' } } },
        ] },
        { id: 'tb', type: 'tabs', tab_style: 'pills', active_tab: 0, tabs: [
          { label: 'Climate', icon: 'mdi:thermometer', modules: [ { id: 'tb-i', type: 'info', entity: 'sensor.living_room_temperature' } ] },
          { label: 'Lights', icon: 'mdi:lightbulb-group', modules: [ tile('tb-t', 'Lights tab content', { design: { color: '#1976d2' } }) ] },
        ] },
        { id: 'sl', type: 'slider-layout', pagination: true, navigation: true, slides_per_view: 1.3, space_between: 8, modules: [
          tile('s1', 'Slide one', { design: { color: '#263238', background_color: '#c8e6c9', padding: '16px', border_radius: '12px' } }),
          tile('s2', 'Slide two', { design: { color: '#263238', background_color: '#bbdefb', padding: '16px', border_radius: '12px' } }),
          tile('s3', 'Slide three', { design: { color: '#263238', background_color: '#f8bbd0', padding: '16px', border_radius: '12px' } }),
        ] },
        { id: 'rw', type: 'row', layout: '1-1-1', gap: '6px', columns: [
          { modules: [tile('rw1', 'Col 1')] }, { modules: [tile('rw2', 'Col 2')] }, { modules: [tile('rw3', 'Col 3')] },
        ] },
      ] } ] },
    ],
  };
}

/** Full-width modules (bar, separator, slider) inside a horizontal and a centred vertical layout. */
function layoutWidthsConfig() {
  const wide = (p) => [
    { id: `${p}-bar`, type: 'bar', entity: 'sensor.living_room_temperature', min: 0, max: 40, direction: 'horizontal', show_value: true },
    { id: `${p}-sep`, type: 'separator' },
    { id: `${p}-sld`, type: 'slider', entity: 'light.living_room', direction: 'horizontal', show_value: true },
  ];
  return {
    type: 'custom:magic-card',
    rows: [
      { id: 'w1', layout: '1', columns: [ { id: 'w1c1', modules: [
        { id: 'whz', type: 'horizontal', gap: '8px', modules: [{ id: 'whz-t', type: 'text', text: 'Label' }, ...wide('whz')] },
        { id: 'wvc', type: 'vertical', gap: '8px', align: 'center', modules: [{ id: 'wvc-t', type: 'text', text: 'Centred' }, ...wide('wvc')] },
      ] } ] },
    ],
  };
}

/** Batch 4 review: a narrow card with three gauges and a nested row (text + bar) in a horizontal layout. */
function narrowRowConfig() {
  return {
    type: 'custom:magic-card',
    rows: [
      { id: 'n1', layout: '1', columns: [ { id: 'n1c1', modules: [
        { id: 'nhz-g', type: 'horizontal', gap: '8px', modules: [
          { id: 'ng1', type: 'gauge', entity: 'sensor.living_room_temperature', min: 0, max: 40, show_name: true },
          { id: 'ng2', type: 'gauge', entity: 'sensor.humidity', min: 0, max: 100, show_name: true, gauge_style: 'full' },
          { id: 'ng3', type: 'gauge', entity: 'sensor.power', min: 0, max: 3000, show_name: true, gauge_style: 'quarter' },
        ] },
        { id: 'nhz-n', type: 'horizontal', gap: '8px', modules: [
          { id: 'nhz-t', type: 'text', text: 'Living room' },
          { id: 'nhz-in', type: 'horizontal', gap: '8px', modules: [
            { id: 'nhz-in-t', type: 'text', text: 'Humidity level' },
            { id: 'nhz-in-b', type: 'bar', entity: 'sensor.humidity', min: 0, max: 100, show_value: true },
          ] },
          { id: 'nhz-v', type: 'vertical', gap: '4px', modules: [
            { id: 'nhz-v-t', type: 'text', text: 'Temperature' },
            { id: 'nhz-v-b', type: 'bar', entity: 'sensor.living_room_temperature', min: 0, max: 40 },
          ] },
        ] },
      ] } ] },
    ],
  };
}

/** Batch 4 of the module audit: info, icon, gauge, image, camera, bar, graphs, a short text in a row. */
function contentConfig() {
  const ranges = [{ from: 10, color: '#1e88e5' }, { from: 20, color: '#fb8c00' }, { from: 25, color: '#e53935' }];
  return {
    type: 'custom:magic-card',
    rows: [
      { id: 'c4r1', layout: '1-1', columns: [
        { id: 'c4r1c1', modules: [
          { id: 'i-unit', type: 'info', entity: 'sensor.humidity', show_name: true, show_state: true, show_unit: false },
          { id: 'i-attr', type: 'info', entity: 'climate.living_room', attribute: 'current_temperature', secondary_info: 'hvac_action' },
          { id: 'i-off', type: 'info', entity: 'sensor.living_room_temperature', show_name: false, show_state: false },
          { id: 'i-yaml', type: 'info', entity: 'sensor.washer' },
        ] },
        { id: 'c4r1c2', modules: [
          { id: 'hz-icons', type: 'horizontal', gap: '12px', modules: [
            { id: 'ic-color', type: 'icon', icon: 'mdi:fan', size: '32px', icon_color: '#e91e63' },
            { id: 'ic-entity', type: 'icon', entity: 'light.living_room', use_entity_icon: true, use_entity_color: true, icon_color: '#e91e63', size: '32px' },
          ] },
          { id: 'g-attr', type: 'gauge', entity: 'climate.living_room', attribute: 'current_temperature', min: 10, max: 30, decimals: 1, show_name: true, needle: true, gauge_style: 'half', severity: ranges },
          { id: 'g-na', type: 'gauge', entity: 'sensor.power', min: 0, max: 3000, show_name: true, gauge_style: 'full' },
        ] },
      ] },
      { id: 'c4r2', layout: '1-1', columns: [
        { id: 'c4r2c1', modules: [
          { id: 'im-ent', type: 'image', entity: 'image.doorbell', entity_picture: true, aspect_ratio: '4/3' },
          { id: 'im-attr', type: 'image', entity: 'media_player.kitchen', attribute: 'cover_url', aspect_ratio: 1, fit: 'cover' },
        ] },
        { id: 'c4r2c2', modules: [
          { id: 'cam-live', type: 'camera', entity: 'camera.front_door', camera_view: 'live', show_controls: true, aspect_ratio: 1.78 },
          { id: 'cam-snap', type: 'camera', entity: 'camera.front_door', camera_view: 'snapshot', refresh_interval: 5, aspect_ratio: '16:9' },
        ] },
      ] },
      { id: 'c4r3', layout: '1', columns: [ { id: 'c4r3c1', modules: [
        { id: 'b-attr', type: 'bar', entity: 'climate.living_room', attribute: 'current_temperature', min: 10, max: 30, show_value: true, decimals: 1, severity: ranges },
        { id: 'b-na', type: 'bar', entity: 'sensor.washer', min: 0, max: 100, show_value: true },
        { id: 'gr-state', type: 'graphs', entity: 'sensor.living_room_temperature', hours_to_show: 24, points_per_hour: 2, fill: true, show_labels: true },
        { id: 'gr-attr', type: 'graphs', entity: 'climate.living_room', attribute: 'current_temperature', hours_to_show: 12, points_per_hour: 1, fill: false, show_points: true, show_labels: true, line_color: '#fb8c00' },
        { id: 'hz-text', type: 'horizontal', gap: '8px', modules: [
          { id: 'hz-label', type: 'text', text: 'Label' },
          { id: 'hz-bar', type: 'bar', entity: 'sensor.humidity', min: 0, max: 100, show_value: true },
        ] },
      ] } ] },
    ],
  };
}

/** Batch 5 of the module audit: buttons, dropdowns, spinboxes, sliders, lights, weather, a video background. */
function controlsConfig(videoUrl = '') {
  return {
    type: 'custom:magic-card',
    rows: [
      { id: 'c5r1', layout: '1-1', columns: [
        { id: 'c5r1c1', modules: [
          { id: 'bt-def', type: 'button', entity: 'switch.coffee', label: 'Coffee', use_entity_icon: true, use_entity_color: true, show_state: true,
            actions: { tap_action: { action: 'toggle' }, hold_action: { action: 'more-info' } } },
          { id: 'bt-attr', type: 'button', entity: 'climate.living_room', label: 'Room', icon: 'mdi:thermometer', show_state: true, attribute: 'current_temperature', button_style: 'outline' },
          { id: 'dd-sel', type: 'dropdown', entity: 'input_select.scene' },
          { id: 'dd-preset', type: 'dropdown', entity: 'climate.living_room', attribute: 'preset_mode' },
          { id: 'dd-custom', type: 'dropdown', entity: 'select.fan_speed', options: [{ label: 'Quiet', value: 'low' }, { label: 'Normal', value: 'medium' }, { label: 'Turbo', value: 'turbo' }] },
          { id: 'bt-yaml', type: 'button', entity: 'light.desk', label: 'No actions (YAML)', icon: 'mdi:lightbulb' },
        ] },
        { id: 'c5r1c2', modules: [
          { id: 'sp-clim', type: 'spinbox', entity: 'climate.living_room' },
          { id: 'sp-light', type: 'spinbox', entity: 'light.living_room' },
          { id: 'sp-num', type: 'spinbox', entity: 'number.volume' },
          { id: 'sp-na', type: 'spinbox', entity: 'climate.office' },
        ] },
      ] },
      { id: 'c5r2', layout: '1', columns: [ { id: 'c5r2c1', modules: [
        { id: 'sl-off', type: 'slider', entity: 'light.hall', show_value: true },
        { id: 'sl-cover', type: 'slider', entity: 'cover.blinds', show_value: true },
        { id: 'sl-vol', type: 'slider', entity: 'media_player.kitchen', show_value: true, slider_color: '#8e24aa' },
        { id: 'sl-fan', type: 'slider', entity: 'fan.ceiling', show_value: true },
        { id: 'sl-num', type: 'slider', entity: 'input_number.target_temp', show_value: true },
        { id: 'sl-k', type: 'slider', entity: 'light.kitchen', attribute: 'color_temp', show_value: true },
      ] } ] },
      { id: 'c5r3', layout: '1-1', columns: [
        { id: 'c5r3c1', modules: [
          { id: 'li-desk', type: 'light', entity: 'light.desk', show_brightness: true, show_color_temp: true, show_color: true, show_effect: true },
        ] },
        { id: 'c5r3c2', modules: [
          { id: 'li-hall', type: 'light', entity: 'light.hall', show_brightness: true, show_color_temp: true, show_color: true },
          { id: 'li-kit', type: 'light', entity: 'light.kitchen', show_brightness: true, show_color_temp: true, compact: true },
        ] },
      ] },
      { id: 'c5r4', layout: '1-1', columns: [
        { id: 'c5r4c1', modules: [
          { id: 'we', type: 'weather', entity: 'weather.home', show_temperature: true, show_condition: true, show_forecast: true, forecast_days: 4 },
        ] },
        { id: 'c5r4c2', modules: [
          { id: 'vid', type: 'video-bg', url: videoUrl, poster: '/local/cover.svg', autoplay: true, loop: true, muted: true },
          { id: 'vid-text', type: 'text', text: 'Over the video', design: { color: '#ffffff', font_weight: '600' } },
          { id: 'vid-info', type: 'info', entity: 'sensor.living_room_temperature', design: { color: '#ffffff' } },
        ] },
      ] },
    ],
  };
}

/**
 * Batch 5 review: browsed media as media-source ids (images, an old signed URL, design and card
 * backgrounds, a video poster), a heat_cool thermostat spinbox with its low / high ends, an old
 * dropdown with the dummy default options, a new button without entity, a slider that lets the
 * page scroll.
 */
function reviewConfig() {
  const dummy = [1, 2, 3].map((i) => ({ label: `Option ${i}`, value: `option_${i}` }));
  return {
    type: 'custom:magic-card',
    background_image: 'media-source://media_source/local/camera.svg',
    rows: [
      { id: 'b5r1', layout: '1-1', columns: [
        { id: 'b5r1c1', modules: [
          { id: 'm-img', type: 'image', image: 'media-source://media_source/local/cover.svg', aspect_ratio: '16:9' },
          { id: 'm-old', type: 'image', image: "url('/media/local/doorbell.svg?authSig=expired.old.sig')", aspect_ratio: '16:9' },
        ] },
        { id: 'b5r1c2', modules: [
          { id: 'm-bg', type: 'text', text: 'Design background (browsed)', design: { background_image: 'media-source://media_source/local/cover.svg', color: '#ffffff', padding: '24px 12px', font_weight: '600' } },
          { id: 'm-vid', type: 'video-bg', poster: 'media-source://media_source/local/doorbell.svg' },
        ] },
      ] },
      { id: 'b5r2', layout: '1-1', design: { background_color: 'var(--card-background-color, #fff)' }, columns: [
        { id: 'b5r2c1', modules: [
          { id: 'sp-range', type: 'spinbox', entity: 'climate.bedroom' },
          { id: 'sp-lo', type: 'spinbox', entity: 'climate.bedroom', attribute: 'target_temp_low' },
          { id: 'sp-hi', type: 'spinbox', entity: 'climate.bedroom', attribute: 'target_temp_high' },
        ] },
        { id: 'b5r2c2', modules: [
          { id: 'dd-old', type: 'dropdown', entity: 'input_select.scene', options: dummy },
          { id: 'bt-new', type: 'button', label: 'New button', icon: 'mdi:power' },
          { id: 'sl-scroll', type: 'slider', entity: 'cover.blinds', show_value: true },
        ] },
      ] },
    ],
  };
}

/** A 1 s looping WebM made in the page (canvas + MediaRecorder): the harness has no video file. */
async function makeVideo() {
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 180;
  const ctx = cv.getContext('2d');
  const rec = new MediaRecorder(cv.captureStream(30), { mimeType: 'video/webm' });
  const chunks = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  let f = 0;
  const draw = () => {
    const g = ctx.createLinearGradient(0, 0, 320, 180);
    g.addColorStop(0, `hsl(${200 + f * 2}, 70%, 35%)`); g.addColorStop(1, `hsl(${260 + f * 2}, 60%, 25%)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 320, 180); f++;
  };
  draw();
  const iv = setInterval(draw, 33);
  rec.start();
  await new Promise((r) => setTimeout(r, 1000));
  const stopped = new Promise((r) => { rec.onstop = r; });
  rec.stop(); await stopped; clearInterval(iv);
  return URL.createObjectURL(new Blob(chunks, { type: 'video/webm' }));
}

window.__mc = {
  editor, card, hass, historyRequests, serviceCalls, mediaResolves, emitted,
  /**
   * HA's card dialog Layout tab (hui-card-element-editor): only the selected tab is rendered, so the
   * editor is detached, gets setConfig() with the new grid_options, and comes back on the Config tab.
   */
  async haLayoutTab(gridOptions) {
    const pane = document.getElementById('pane');
    editor.remove();
    const next = { ...editor._stateManager.getConfig(), grid_options: gridOptions };
    editor.setConfig(next); card.setConfig(next);
    await new Promise((r) => setTimeout(r, 50));
    pane.appendChild(editor);
    await editor.updateComplete;
  },
  /** Show the batch-5 review card in the preview and the editor. */
  showReview() {
    card.setConfig(reviewConfig());
    editor.setConfig(reviewConfig());
  },
  /** '' when the batch-5 review card renders as fixed (see reviewConfig). */
  reviewCheck(root = card) {
    const sr = root.shadowRoot;
    const out = [];
    const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '<missing>');
    // ids may be kept in data attributes (to resolve again on errors), never in a src / poster / style
    for (const el of sr.querySelectorAll('[src], [poster], [style]')) {
      for (const a of ['src', 'poster', 'style']) if (el.getAttribute(a)?.includes('media-source://')) out.push(`media-source id in ${a}`);
    }
    const imgs = [...sr.querySelectorAll('.mc-image img')];
    if (imgs.length !== 2) out.push(`images: ${imgs.length}`);
    for (const im of imgs) if (!/authSig=/.test(im.getAttribute('src')) || !im.complete || !im.naturalWidth) out.push(`image not resolved / loaded: ${im.getAttribute('src')}`);
    if (!/doorbell\.svg\?authSig=.*\.sig\d+$/.test(imgs[1]?.getAttribute('src') ?? '')) out.push(`old signed URL not migrated: ${imgs[1]?.getAttribute('src')}`);
    const ids = [...new Set(mediaResolves)].sort().join();
    if (ids !== 'media-source://media_source/local/camera.svg,media-source://media_source/local/cover.svg,media-source://media_source/local/doorbell.svg') out.push(`resolved ids: ${ids}`);
    if (mediaResolves.length !== 3) out.push(`resolves: ${mediaResolves.length} (want one per id)`);
    if (!/background: url\("fixtures\/camera\.svg\?authSig=/.test(sr.querySelector('.mc-card-content')?.getAttribute('style') ?? '')) out.push('card background image not resolved');
    const bgText = [...sr.querySelectorAll('.mc-module-wrapper')].find((w) => /Design background/.test(w.textContent));
    if (!/fixtures\/cover\.svg\?authSig=/.test(bgText ? getComputedStyle(bgText).backgroundImage : '')) out.push(`design background: ${bgText && getComputedStyle(bgText).backgroundImage}`);
    const poster = sr.querySelector('mc-bg-video img');
    if (!poster || !/doorbell\.svg\?authSig=/.test(poster.getAttribute('src'))) out.push(`video poster: ${poster?.getAttribute('src')}`);
    const spins = [...sr.querySelectorAll('.mc-spinbox')];
    if (txt(spins[0]?.querySelector('.mc-spinbox-value')) !== '19.0 – 23.0 °C') out.push(`heat_cool spinbox: ${txt(spins[0])}`);
    if (!spins[0] || ![...spins[0].querySelectorAll('button')].every((b) => b.disabled)) out.push('heat_cool +/- not disabled');
    if (spins.slice(1).some((s) => [...s.querySelectorAll('button')].some((b) => b.disabled))) out.push('low / high spinboxes disabled');
    const dd = sr.querySelector('.mc-dropdown select');
    const opts = dd ? [...dd.options].filter((o) => !o.hidden).map((o) => o.textContent.trim()).join(',') : '<missing>';
    if (opts !== 'Relax,Read' || dd.value !== 'Relax' || dd.disabled) out.push(`old dropdown: ${opts}`);
    const newBtn = [...sr.querySelectorAll('.mc-module-wrapper')].find((w) => /New button/.test(w.textContent));
    if (!newBtn || newBtn.getAttribute('role') !== null) out.push('new button without entity is not inert');
    const sl = sr.querySelector('.mc-slider .mc-tile-slider');
    if (sl?.style.touchAction !== 'pan-y') out.push(`slider touch-action: ${sl?.style.touchAction}`);
    return out.join('; ');
  },
  /** The review card's new button: pick its first entity in the General tab (the editor writes default actions). */
  pickNewButtonEntity(entity) {
    const ins = this.inspector().shadowRoot;
    ins.querySelector('mc-entity-picker').dispatchEvent(new CustomEvent('value-changed', { detail: { value: entity }, bubbles: true, composed: true }));
  },
  /** Show the batch-5 controls card in the preview and the editor (with a generated video). */
  async showControls() {
    const url = await makeVideo();
    card.setConfig(controlsConfig(url));
    editor.setConfig(controlsConfig(url));
  },
  /** '' when the batch-5 card renders every control as configured. `canvas`: the studio canvas card. */
  controlsCheck(root = card, canvas = false) {
    const sr = root.shadowRoot;
    const out = [];
    const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '<missing>');
    if (/NaN/.test(sr.innerHTML)) out.push('NaN in the card');
    const wrappers = [...sr.querySelectorAll('.mc-module-wrapper')];
    const btn = wrappers.find((w) => w.querySelector('.mc-button'));
    if (!canvas && btn?.getAttribute('role') !== 'button') out.push('button without its configured action');
    const yamlBtn = wrappers.find((w) => /No actions/.test(w.textContent));
    if (!yamlBtn || yamlBtn.getAttribute('role') !== null) out.push('button without actions is not inert');
    if (!/Coffee\s*Off/.test(txt(btn))) out.push(`button state: ${txt(btn)}`);
    const bAttr = sr.querySelectorAll('.mc-button')[1];
    if (!/Room\s*20\.46\s*°C/.test(txt(bAttr))) out.push(`button attribute: ${txt(bAttr)}`);
    const selects = [...sr.querySelectorAll('.mc-dropdown select')];
    const opts = (s) => (s ? [...s.options].filter((o) => !o.hidden).map((o) => `${o.textContent.trim()}${o.disabled ? '(x)' : ''}`).join(',') : '<missing>');
    if (opts(selects[0]) !== 'Relax,Read' || selects[0].value !== 'Relax') out.push(`input_select: ${opts(selects[0])}`);
    if (opts(selects[1]) !== 'Eco,Comfort,Away' || selects[1].value !== 'eco') out.push(`preset: ${opts(selects[1])} ${selects[1]?.value}`);
    if (opts(selects[2]) !== 'Quiet,Normal,Turbo(x)' || selects[2].value !== 'medium') out.push(`custom options: ${opts(selects[2])}`);
    const spins = [...sr.querySelectorAll('.mc-spinbox-value')].map(txt).join('|');
    if (spins !== '21.0 °C|72%|0.3|Unavailable') out.push(`spinboxes: ${spins}`);
    const sliders = [...sr.querySelectorAll('.mc-slider .mc-tile-slider')].map((t) => Number(t.style.getPropertyValue('--slider-value')).toFixed(2)).join('|');
    if (sliders !== '0.00|0.40|0.35|0.66|0.55|0.21') out.push(`sliders: ${sliders}`);
    const slVals = [...sr.querySelectorAll('.mc-slider-value')].map(txt).join('|');
    if (slVals !== '0%|40%|35%|66%|20.5 °C|3,400 K') out.push(`slider values: ${slVals}`);
    const lights = [...sr.querySelectorAll('.mc-light')];
    const ctrls = (l) => (l ? [...l.querySelectorAll('.mc-light-control')].map((c) => c.className.replace('mc-light-control mc-light-', '')).join(',') : '<missing>');
    if (ctrls(lights[0]) !== 'brightness,color-temp,color,effect') out.push(`desk controls: ${ctrls(lights[0])}`);
    if (ctrls(lights[1]) !== 'brightness') out.push(`hall controls: ${ctrls(lights[1])}`);
    if (lights[1]?.querySelector('.mc-tile-slider')?.style.getPropertyValue('--slider-value').trim() !== '0') out.push('hall (off) brightness not 0');
    if (lights[0]?.querySelector('.mc-light-color-input')?.value !== '#ffaa66') out.push(`desk colour: ${lights[0]?.querySelector('.mc-light-color-input')?.value}`);
    const we = sr.querySelector('.mc-weather');
    if (txt(we?.querySelector('.mc-weather-condition')) !== 'Partly cloudy' || txt(we?.querySelector('.mc-weather-temp')) !== '18°C') out.push(`weather: ${txt(we)}`);
    if (we?.querySelectorAll('.mc-forecast-item').length !== 4) out.push(`weather forecast items: ${we?.querySelectorAll('.mc-forecast-item').length}`);
    const vw = sr.querySelector('.mc-video-bg')?.closest('.mc-module-wrapper');
    const video = vw?.querySelector('video');
    if (!vw || getComputedStyle(vw).position !== 'absolute' || getComputedStyle(vw).zIndex !== '-1') out.push(`video is not a background layer: ${vw && getComputedStyle(vw).position}`);
    // plays while on screen, paused while scrolled out of view (IntersectionObserver)
    const r = vw?.getBoundingClientRect();
    const visible = !!r && r.bottom > 0 && r.top < innerHeight && (() => { const pr = document.getElementById('preview')?.getBoundingClientRect(); return !pr || (r.bottom > pr.top && r.top < pr.bottom); })();
    if (!video || !video.muted || !video.loop || video.paused === visible) out.push(`video (${visible ? 'visible' : 'hidden'}): ${video ? JSON.stringify({ muted: video.muted, loop: video.loop, paused: video.paused, err: video.error?.code }) : 'missing'}`);
    const col = vw?.parentElement;
    if (vw && col && Math.abs(vw.getBoundingClientRect().height - col.getBoundingClientRect().height) > 1) out.push('video does not fill its column');
    return out.join('; ');
  },
  /** Forget the recorded service calls. */
  resetCalls() { serviceCalls.length = 0; },

  /** Show the batch-4 content module card in the preview and the editor. */
  showContent() {
    card.setConfig(contentConfig());
    editor.setConfig(contentConfig());
  },
  /** '' when the batch-4 card renders every option (see contentConfig). `canvas`: studio rules (snapshot camera). */
  contentCheck(root = card, canvas = false) {
    const sr = root.shadowRoot;
    const out = [];
    const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '<missing>');
    const infos = [...sr.querySelectorAll('.mc-info')];
    const want = ['Humidity 45.27', 'Living Room Thermostat 20.46 °C Heating', '21.4 °C', 'Washer Running'];
    infos.slice(0, 4).forEach((el, i) => { if (txt(el) !== want[i]) out.push(`info ${i}: "${txt(el)}" != "${want[i]}"`); });
    const icons = [...sr.querySelectorAll('.mc-icon')];
    if (!icons[0] || getComputedStyle(icons[0]).color !== 'rgb(233, 30, 99)') out.push(`icon colour: ${icons[0] && getComputedStyle(icons[0]).color}`);
    if (icons[1] && getComputedStyle(icons[1]).color === 'rgb(233, 30, 99)') out.push('entity colour does not win over icon colour');
    const gauges = [...sr.querySelectorAll('.mc-gauge')];
    if (!gauges[0] || !/^20\.5\s*°C$/.test(txt(gauges[0].querySelector('.mc-gauge-text')))) out.push(`gauge value: ${txt(gauges[0]?.querySelector('.mc-gauge-text'))}`);
    if (!gauges[0] || txt(gauges[0].querySelector('.mc-gauge-name')) !== 'Living Room Thermostat') out.push('gauge name missing');
    if (gauges[0] && ![...gauges[0].querySelectorAll('path')].some((p) => p.getAttribute('stroke') === '#fb8c00')) out.push('gauge range colour not applied');
    if (!gauges[1] || !gauges[1].classList.contains('mc-gauge--unavailable') || !/Unavailable/.test(txt(gauges[1]))) out.push(`unavailable gauge: ${txt(gauges[1])}`);
    if (/NaN/.test(sr.innerHTML)) out.push('NaN in the card');
    const imgs = [...sr.querySelectorAll('.mc-image')];
    const ar = (el) => el && getComputedStyle(el).aspectRatio;
    if (!imgs[0] || !/fixtures\/doorbell\.svg/.test(imgs[0].querySelector('img')?.src) || ar(imgs[0]) !== '4 / 3') out.push(`entity picture image: ${imgs[0]?.querySelector('img')?.src} ${ar(imgs[0])}`);
    if (!imgs[1] || !/fixtures\/cover\.svg/.test(imgs[1].querySelector('img')?.src) || ar(imgs[1]) !== '1 / 1') out.push(`attribute image: ${imgs[1]?.querySelector('img')?.src} ${ar(imgs[1])}`);
    for (const im of sr.querySelectorAll('.mc-image img, .mc-camera img')) if (!im.complete || !im.naturalWidth) out.push(`image not loaded: ${im.src}`);
    const cams = [...sr.querySelectorAll('.mc-camera')];
    const stream = cams[0]?.querySelector('ha-camera-stream');
    if (canvas) {
      if (stream || !cams[0]?.querySelector('img.mc-camera-snapshot')) out.push('canvas camera is not a snapshot');
    } else if (!stream || stream.dataset.controls !== 'on' || stream.dataset.muted !== 'on') out.push(`live camera: ${stream ? JSON.stringify(stream.dataset) : 'no ha-camera-stream'}`);
    if (Math.abs(cams[0]?.getBoundingClientRect().width / cams[0]?.getBoundingClientRect().height - 1.78) > 0.03) out.push('numeric camera aspect ratio ignored');
    const snap = cams[1]?.querySelector('img');
    if (!snap || !/fixtures\/camera\.svg\?token=abc&mc_t=\d+/.test(snap.src)) out.push(`snapshot camera: ${snap?.src}`);
    const bars = [...sr.querySelectorAll('.mc-bar')];
    const fill = bars[0]?.querySelector('.mc-bar-fill');
    if (!fill || getComputedStyle(fill).backgroundColor !== 'rgb(251, 140, 0)' || Math.abs(parseFloat(fill.style.width) - 52.3) > 0.2) out.push(`attribute bar: ${fill?.style.cssText}`);
    if (txt(bars[0]?.querySelector('.mc-bar-value')) !== '20.5 °C') out.push(`attribute bar value: ${txt(bars[0]?.querySelector('.mc-bar-value'))}`);
    if (!bars[1]?.classList.contains('mc-bar--unavailable') || txt(bars[1].querySelector('.mc-bar-value')) !== 'Running') out.push('non-numeric bar not shown as unavailable');
    const graphs = [...sr.querySelectorAll('.mc-graphs')];
    graphs.forEach((g, i) => { if (!g.querySelector('.mc-graphs-line') || g.querySelector('.mc-graphs-empty')) out.push(`graph ${i}: no line (${txt(g)})`); });
    const segs = (g) => (g?.querySelector('.mc-graphs-line')?.getAttribute('d').match(/[ML]/g) || []).length;
    if (Math.abs(segs(graphs[0]) - 48) > 1) out.push(`graph 0: ${segs(graphs[0])} points, want 48 (2 per hour)`);
    if (Math.abs(segs(graphs[1]) - 12) > 1) out.push(`graph 1: ${segs(graphs[1])} points, want 12 (1 per hour)`);
    const attrReq = historyRequests.find((m) => m.entity_ids[0] === 'climate.living_room');
    if (!attrReq || attrReq.minimal_response !== false || attrReq.no_attributes !== false) out.push(`attribute history request: ${JSON.stringify(attrReq)}`);
    const label = sr.querySelector('.mc-horizontal .mc-text');
    if (!label) out.push('row label missing');
    else if (label.getBoundingClientRect().height > parseFloat(getComputedStyle(label).fontSize) * 2 || label.getBoundingClientRect().width < 30) out.push(`short text squeezed in a row: ${Math.round(label.getBoundingClientRect().width)}x${Math.round(label.getBoundingClientRect().height)}`);
    return out.join('; ');
  },
  /** Batch 3 review: custom cards with an entities card (incomplete config) and a getConfigForm card. */
  showCustomCards() {
    card.setConfig(customCardsConfig());
    editor.setConfig(customCardsConfig());
  },
  /** The selected custom card module's editor in the pane or studio inspector: '' when it is the visual one. */
  customCardEditorCheck(where, tag) {
    const host = where === 'studio' ? this.studio() : this.pane();
    const ins = host.shadowRoot.querySelector('mc-inspector').shadowRoot;
    const out = [];
    if (!ins.querySelector(tag)) out.push(`no ${tag} in the ${where}`);
    if (ins.querySelector('.mc-yaml-fallback')) out.push(`YAML editor in the ${where}`);
    if (!ins.querySelector('.mc-card-editor-toggle')) out.push('no code editor toggle');
    return out.join('; ');
  },
  /** Show the batch-3 advanced module card in the preview and the editor. */
  showAdvanced() {
    card.setConfig(advancedConfig());
    editor.setConfig(advancedConfig());
  },
  /**
   * '' when the batch-3 card renders: clocks with time and date, every forecast with real items
   * (no "Day 1" placeholder, condition names, units), the custom card with its inner card.
   */
  advancedCheck(root = card) {
    const sr = root.shadowRoot;
    const out = [];
    const clocks = [...sr.querySelectorAll('.mc-clock')];
    if (clocks.length !== 2) out.push(`clocks: ${clocks.length}`);
    if (clocks[0] && !/^\d{1,2}:\d{2}:\d{2}(\sAM|\sPM)?$/.test(clocks[0].querySelector('.mc-clock-time').textContent.trim())) out.push(`clock 1 time: ${clocks[0].textContent.trim()}`);
    if (clocks[1] && !/(AM|PM)$/.test(clocks[1].querySelector('.mc-clock-time').textContent.trim())) out.push('clock 2 not 12-hour');
    if (clocks[1] && !/week of \d{4}$/.test(clocks[1].querySelector('.mc-clock-date').textContent.trim())) out.push(`clock 2 date: ${clocks[1].querySelector('.mc-clock-date').textContent}`);
    const want = { daily: 7, hourly: 8, twice_daily: 6 };
    for (const [type, n] of Object.entries(want)) {
      const f = sr.querySelector(`.mc-forecast[data-forecast-type="${type}"]`);
      if (!f) { out.push(`no ${type} forecast`); continue; }
      const items = f.querySelectorAll('.mc-forecast-item');
      if (items.length !== n) out.push(`${type}: ${items.length} items`);
      if (/Day 1/.test(f.textContent)) out.push(`${type}: placeholder`);
      if (!/°C/.test(f.textContent)) out.push(`${type}: no unit`);
      if (!items[0]?.title) out.push(`${type}: no condition name`);
    }
    const inner = sr.querySelector('mc-embedded-card')?.shadowRoot?.querySelector('hui-entity-card');
    if (!inner || !/21\.4/.test(inner.textContent)) out.push('custom card: inner card missing');
    return out.join('; ');
  },
  /** The inner card editor shown in the pane or studio inspector. */
  innerEditor(where = 'pane', tag = 'hui-entity-card-editor') {
    const host = where === 'studio' ? this.studio() : this.pane();
    return host.shadowRoot.querySelector('mc-inspector').shadowRoot.querySelector(tag);
  },
  /** Type into one of the inner card editor's inputs (fires config-changed per keystroke). */
  typeInner(where, name, text, tag = 'hui-entity-card-editor') {
    const input = this.innerEditor(where, tag).querySelector(`input[name="${name}"]`);
    input.value = '';
    for (const ch of text) { input.value += ch; input.dispatchEvent(new Event('input')); }
  },
  /** Batch 4 review: the narrow-row card at `width` px. */
  showNarrowRow(width = 320) {
    card.style.width = `${width}px`;
    card.setConfig(narrowRowConfig());
    editor.setConfig(narrowRowConfig());
  },
  /** '' when nothing in the card's layouts sticks out of the card (no min-content overflow). */
  narrowRowCheck() {
    const sr = card.shadowRoot;
    const box = sr.querySelector('ha-card').getBoundingClientRect();
    const out = [];
    for (const el of sr.querySelectorAll('.mc-horizontal, .mc-vertical, .mc-module-wrapper, .mc-gauge svg, .mc-text, .mc-bar')) {
      const r = el.getBoundingClientRect();
      if (r.right > box.right + 1 || r.left < box.left - 1) out.push(`${typeof el.className === 'string' ? el.className : el.tagName} sticks out (${Math.round(r.left - box.left)}..${Math.round(r.right - box.left)} of ${Math.round(box.width)})`);
    }
    for (const t of sr.querySelectorAll('.mc-text')) {
      if (t.getBoundingClientRect().height > parseFloat(getComputedStyle(t).fontSize) * 3.2) out.push(`text "${t.textContent.trim()}" squeezed`);
    }
    return [...new Set(out)].slice(0, 6).join('; ');
  },
  showLayoutWidths() {
    card.setConfig(layoutWidthsConfig());
    editor.setConfig(layoutWidthsConfig());
  },
  /**
   * '' when every child of the card's horizontal / vertical layouts is as wide as it was before
   * layout children got a module wrapper: a clone of each layout with the wrappers unwrapped (the
   * module roots as the flex items, like before) is measured next to the real one.
   */
  layoutWidthCheck() {
    const sr = card.shadowRoot;
    const out = [];
    for (const layout of sr.querySelectorAll('.mc-horizontal, .mc-vertical')) {
      const clone = layout.cloneNode(true);
      // A wrapper that keeps its min-content width in a row (short text, icons) gives the same
      // minimum to the unwrapped root, so the full-width siblings are compared on equal terms.
      const realWrappers = [...layout.children].filter((c) => c.classList.contains('mc-module-wrapper'));
      [...clone.children].filter((c) => c.classList.contains('mc-module-wrapper')).forEach((w, i) => {
        const root = w.querySelector(':scope > .mc-module');
        const minW = realWrappers[i] && getComputedStyle(realWrappers[i]).minWidth;
        if (root && minW && /min-content/.test(minW)) root.style.minWidth = minW;
        if (root) w.replaceWith(root); else w.remove();
      });
      layout.after(clone);
      const now = [...layout.querySelectorAll(':scope > .mc-module-wrapper > .mc-module')];
      const old = [...clone.querySelectorAll(':scope > .mc-module')];
      now.forEach((el, i) => {
        const a = el.getBoundingClientRect().width, b = old[i] ? old[i].getBoundingClientRect().width : -1;
        if (Math.abs(a - b) > 1) out.push(`${layout.classList.contains('mc-horizontal') ? 'horizontal' : 'vertical'} child ${i} (${el.className.replace('mc-module ', '')}) ${Math.round(a)}px, was ${Math.round(b)}px`);
      });
      clone.remove();
    }
    // A short text next to full-width siblings stays on one line (was squeezed to a letter per line).
    for (const t of sr.querySelectorAll('.mc-horizontal > .mc-module-wrapper > .mc-text')) {
      if (t.getBoundingClientRect().height > parseFloat(getComputedStyle(t).fontSize) * 2) out.push(`text "${t.textContent.trim()}" squeezed (${Math.round(t.getBoundingClientRect().width)}px wide)`);
    }
    return out.join('; ');
  },
  /** Show the batch-2 layout card in the preview and the editor. */
  showLayouts() {
    card.setConfig(layoutsConfig());
    editor.setConfig(layoutsConfig());
  },
  /** Show the batch-1 module card in the preview (and the editor, for the studio). */
  showModules() {
    card.setConfig(modulesConfig());
    editor.setConfig(modulesConfig());
  },
  /** Change one entity state the way HA does (new hass object) and re-render live templates. */
  setState(id, state) {
    const next = { ...hass, states: { ...hass.states, [id]: { ...hass.states[id], state } } };
    Object.assign(hass, { states: next.states });
    card.hass = next; editor.hass = next;
    for (const sub of templateSubs) sub.send();
  },
  select(key) { editor.selectByKey(key); },
  /** Open the studio the way a user does: the pane's "Open studio" button. */
  async openStudio() { this.pane().shadowRoot.querySelector('.studio-cta .btn-primary').click(); await new Promise((r) => setTimeout(r, 400)); },
  setTab(tab) { editor.setInspectorTab(tab); },
  setMode(mode) { editor._stateManager.setEditorMode(mode); },
  pane() { return editor.shadowRoot.querySelector('mc-pane-editor'); },
  studio() { return editor.shadowRoot.querySelector('mc-studio'); },
  outline(where = 'pane') { return (where === 'studio' ? this.studio() : this.pane()).shadowRoot.querySelector('mc-structure-outline'); },
  /** The ⋮ (module options) button of the outline item with selection key `key`. */
  modMore(key, where = 'pane') { return this.outline(where).shadowRoot.querySelector(`[data-key="${key}"]`).parentElement.querySelector(':scope > .more'); },
  tplBar(where = 'pane') { return (where === 'studio' ? this.studio() : this.pane()).shadowRoot.querySelector('mc-template-bar'); },
  /**
   * '' when the open role=menu inside `host`'s shadow root is really visible: in the top layer
   * (:popover-open), fully inside the viewport, next to its trigger, and the topmost element at its
   * first item (deep elementFromPoint through shadow roots), even inside the transformed HA-like dialog.
   */
  menuCheck(host, trigger) {
    const menu = host.shadowRoot.querySelector('[role="menu"]');
    if (!menu) return 'menu not open';
    const out = [];
    if (!menu.matches(':popover-open')) out.push('menu not in the top layer');
    const m = menu.getBoundingClientRect();
    if (m.left < 0 || m.top < 0 || m.right > innerWidth || m.bottom > innerHeight || !m.width || !m.height) {
      out.push(`menu outside viewport ${JSON.stringify([m.left, m.top, m.right, m.bottom].map(Math.round))}`);
    }
    if (trigger) {
      const t = trigger.getBoundingClientRect();
      if (Math.abs(m.top - (t.bottom + 4)) > 1 && Math.abs(m.bottom - (t.top - 4)) > 1) {
        out.push(`menu not next to its trigger (menu ${Math.round(m.top)}-${Math.round(m.bottom)}, trigger ${Math.round(t.top)}-${Math.round(t.bottom)})`);
      }
    }
    const item = menu.querySelector('[role="menuitem"]');
    const r = (item || menu).getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    let hit = document.elementFromPoint(x, y);
    while (hit && hit.shadowRoot) {
      const next = hit.shadowRoot.elementFromPoint(x, y);
      if (!next || next === hit) break;
      hit = next;
    }
    if (!hit || !(hit === menu || menu.contains(hit))) out.push(`menu covered by ${hit ? hit.tagName.toLowerCase() + '.' + hit.className : 'nothing'}`);
    return out.join('; ');
  },
  /**
   * '' when `picker`'s open window is really visible: its overlay is a modal <dialog> in the top
   * layer, the window lies fully inside the viewport, and it is the topmost element at its centre.
   */
  pickerCheck(picker) {
    const overlay = picker?.shadowRoot.querySelector('.mc-picker-overlay');
    return this.topLayerCheck(overlay, overlay?.querySelector('.mc-picker-modal'), 'picker');
  },
  /** '' when the editor's "Update linked cards?" confirm is a modal, on-screen, topmost window. */
  syncDialogCheck() {
    const overlay = editor.shadowRoot.querySelector('dialog.mc-sync-dialog');
    return this.topLayerCheck(overlay, overlay?.querySelector('.dialog'), 'sync dialog');
  },
  /** Shared by pickerCheck / syncDialogCheck: `overlay` is a modal <dialog>, `win` inside the viewport and topmost. */
  topLayerCheck(overlay, win, what) {
    if (!win) return `${what} not open`;
    const out = [];
    if (!overlay.matches(':modal')) out.push(`${what} not in the top layer`);
    const m = win.getBoundingClientRect();
    if (m.left < 0 || m.top < 0 || m.right > innerWidth || m.bottom > innerHeight || !m.width || !m.height) {
      out.push(`${what} outside viewport ${innerWidth}x${innerHeight}: ${JSON.stringify([m.left, m.top, m.right, m.bottom].map(Math.round))}`);
    }
    const x = m.left + m.width / 2;
    const y = m.top + Math.min(30, m.height / 2);
    let hit = document.elementFromPoint(x, y);
    while (hit && hit.shadowRoot) {
      const next = hit.shadowRoot.elementFromPoint(x, y);
      if (!next || next === hit) break;
      hit = next;
    }
    if (!hit || !(hit === win || win.contains(hit))) out.push(`${what} covered by ${hit ? hit.tagName.toLowerCase() + '.' + hit.className : 'nothing'}`);
    return out.join('; ');
  },
  inspector() { return this.pane().shadowRoot.querySelector('mc-inspector'); },
  /** Scroll the dialog pane so the inspector starts right under the sticky pane head. */
  scrollToInspector() {
    const pane = document.getElementById('pane');
    const root = this.pane().shadowRoot;
    const wrap = root.querySelector('.insp-wrap');
    const head = root.querySelector('.pane-head');
    if (!wrap) return;
    pane.scrollTop += wrap.getBoundingClientRect().top - pane.getBoundingClientRect().top - (head ? head.offsetHeight : 0);
  },
};
