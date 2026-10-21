// Dev-only entry for dev/anim-v2-e.html (per-state clips and value bindings). The page loads
// the real magic-card.js (module, with its lazy runtime chunk) first; this bundle adds the studio
// panels for states and value bindings and a tiny shell that feeds them like the studio does (doc-change,
// preview-change, panelsFor). It never defines the card's own elements.
import { panelsFor, NO_SELECTION } from '../src/anim-studio/slots';
import { previewConfig } from '../src/anim-studio/studio-model';
import '../src/anim-studio/model-v2';
import { validateAnimationDoc } from '../src/anim-studio/model';
import '../src/anim-studio/editors/states-panel';
import '../src/anim-studio/editors/bindings-panel';
import '../src/anim-studio/editors/stage-sim';
import { DEFAULT_SIM, SIM_ENTITY, applyPreviewChange, withSimEntity } from '../src/anim-studio/editors/states-sim';

const params = new URLSearchParams(location.search);
const theme = params.get('theme') || 'light';
document.documentElement.dataset.theme = theme;

const ent = (entity_id, state, attributes = {}) => ({ entity_id, state, attributes, last_changed: '', last_updated: '', context: { id: '', parent_id: null, user_id: null } });

/** A fan whose icon spins at its percentage (0-100 % -> 0-720 deg/s). */
const FAN_DOC = {
  id: 'fan_spin', name: 'Fan spin', kind: 'keyframes', version: 1, duration: 2, target: 'icon',
  keyframes: [{ at: 0, opacity: 1 }, { at: 100, opacity: 1 }],
  bindings: [{ target: 'icon', property: 'rotate_speed', input: { attribute: 'percentage', min: 0, max: 100 }, output: [0, 720], smoothing: 0.6 }],
};
/** A lamp: glows while on, rests while off (crossfade), its icon colour follows the brightness. */
const LAMP_DOC = {
  id: 'lamp_glow', name: 'Lamp glow', kind: 'keyframes', version: 1, duration: 2.4, easing: 'ease-in-out', target: 'icon',
  keyframes: [{ at: 0, transform: { scale: 1 } }, { at: 50, transform: { scale: 1.08 } }, { at: 100, transform: { scale: 1 } }],
  clips: [
    { when: { state: 'on' }, animation: 'glow-pulse', transition: 'crossfade' },
    { when: { state: 'off' }, animation: 'none', transition: 'crossfade' },
  ],
  bindings: [{ target: 'icon', property: 'color_mix', input: { attribute: 'brightness', min: 0, max: 255 }, output: ['#9e9e9e', '#ffb300'], smoothing: 0.4 }],
};

const state = {
  fan: ent('fan.office', 'on', { percentage: 60, friendly_name: 'Office fan' }),
  light: ent('light.desk', 'on', { brightness: 200, friendly_name: 'Desk lamp' }),
};

// one connection for every card, like HA (the animation library restarts on a new connection)
const connection = { subscribeEvents: async () => () => {}, subscribeMessage: () => Promise.reject({ code: 'unknown_command' }) };
const callWS = () => Promise.reject({ code: 'unknown_command' });
function baseHass(states) {
  return {
    states,
    entities: {},
    language: 'en',
    locale: { language: 'en', number_format: 'language', time_format: 'language' },
    themes: { themes: {}, darkMode: theme === 'dark' },
    connection,
    callWS,
    callService: async () => undefined,
  };
}
const hass = () => baseHass({ 'fan.office': state.fan, 'light.desk': state.light });

function card(config) {
  const el = document.createElement('magic-card');
  el.setConfig(config);
  el.hass = hass();
  return el;
}

const fanCard = card({
  type: 'custom:magic-card',
  custom_animations: [FAN_DOC],
  rows: [{ id: 'r', columns: [
    { id: 'c1', vertical_align: 'center', modules: [{ id: 'fan', type: 'icon', icon: 'mdi:fan', entity: 'fan.office', size: '72px', design: { animations: [{ id: 'a', preset: 'custom:fan_spin' }] } }] },
    { id: 'c2', vertical_align: 'center', modules: [{ id: 'info', type: 'info', entity: 'fan.office' }] },
  ], layout: '1-2' }],
});
const lampCard = card({
  type: 'custom:magic-card',
  custom_animations: [LAMP_DOC],
  rows: [{ id: 'r', columns: [{ id: 'c', modules: [{ id: 'lamp', type: 'button', icon: 'mdi:lightbulb', label: 'Desk lamp', entity: 'light.desk', design: { animations: [{ id: 'a', preset: 'custom:lamp_glow' }] } }] }] }],
});
if (params.get('only') !== 'lamp') document.getElementById('fan').appendChild(fanCard);
if (params.get('only') !== 'fan') document.getElementById('lamp').appendChild(lampCard);

function push() {
  fanCard.hass = hass();
  lampCard.hass = hass();
}

// ── the studio part: the panels around a preview card driven by the simulated entity ──

let doc = validateAnimationDoc({
  id: 'fan_lamp', name: 'Fan and lamp', kind: 'keyframes', version: 1, duration: 2, easing: 'ease-in-out', target: 'icon',
  keyframes: [{ at: 0, transform: { scale: 1 } }, { at: 50, transform: { scale: 1.06 } }, { at: 100, transform: { scale: 1 } }],
  clips: [
    { when: { state: 'on' }, animation: 'self', transition: 'crossfade' },
    { when: { state: 'off' }, animation: 'none', transition: 'crossfade' },
    { when: { above: 80 }, animation: 'custom:fan_spin', transition: 'finish' },
  ],
  bindings: [{ target: 'icon', property: 'rotate_speed', input: { attribute: 'percentage', min: 0, max: 100 }, output: [0, 360], smoothing: 0.5 }],
}).doc;
const library = { fan_spin: FAN_DOC, lamp_glow: LAMP_DOC };
let sim = { ...DEFAULT_SIM };
let selection = { ...NO_SELECTION };
const lookup = (id) => library[id];

const stage = document.getElementById('stage');
const insp = document.getElementById('insp');
const preview = document.createElement('magic-card');
stage.querySelector('.frame').appendChild(preview);
const previewHass = () => withSimEntity(baseHass({}), sim);

function renderPanels() {
  const sync = (host, place) => {
    const want = panelsFor(place, doc, selection);
    for (const el of [...host.children]) if (el.dataset.panel === '' && !want.some((p) => p.tag === el.localName)) el.remove();
    for (const p of want) {
      let el = host.querySelector(`:scope > ${p.tag}`);
      if (!el) {
        if (place === 'inspector') {
          const h = document.createElement('h3');
          h.textContent = p.title;
          h.dataset.panel = 'title';
          h.dataset.for = p.tag;
          host.appendChild(h);
        }
        el = document.createElement(p.tag);
        el.dataset.panel = '';
        host.appendChild(el);
      }
      Object.assign(el, { doc, library, selection, time: 0, disabled: false, tile: 'icon' });
    }
    for (const h of host.querySelectorAll('h3[data-for]')) if (!want.some((p) => p.tag === h.dataset.for)) h.remove();
  };
  sync(insp, 'inspector');
  sync(stage, 'stage-tool');
}

function renderPreview(configChanged) {
  if (configChanged) preview.setConfig(previewConfig(doc, lookup, { tile: 'icon', entity: SIM_ENTITY }));
  preview.hass = previewHass();
}

document.addEventListener('doc-change', (e) => {
  doc = e.detail.doc;
  window.__e.changes.push(e.detail.label);
  renderPanels();
  renderPreview(true);
});
document.addEventListener('preview-change', (e) => {
  sim = applyPreviewChange(sim, e.detail);
  window.__e.previews.push(e.detail);
  renderPreview(false);
});

if (!['cards', 'fan', 'lamp'].includes(params.get('only'))) {
  if (params.get('only') !== 'preview') renderPanels();
  renderPreview(true);
}

window.__e = {
  fanCard,
  lampCard,
  preview,
  changes: [],
  previews: [],
  get doc() {
    return doc;
  },
  get sim() {
    return sim;
  },
  setFan(pct, s = pct > 0 ? 'on' : 'off') {
    state.fan = ent('fan.office', s, { ...state.fan.attributes, percentage: pct });
    push();
  },
  setLight(s, brightness = state.light.attributes.brightness) {
    state.light = ent('light.desk', s, { ...state.light.attributes, brightness: s === 'on' ? brightness : null });
    push();
  },
  /** Re-send the same states (a render that changes nothing). */
  rerender() {
    push();
  },
  select(sel) {
    selection = sel;
    renderPanels();
  },
  wrapper: (el) => el.shadowRoot.querySelector('.mc-module-wrapper[data-mc-run]'),
  panel: (tag) => document.querySelector(tag),
};
