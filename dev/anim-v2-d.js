// dev/anim-v2-d.html: card-part targets on real magic-cards plus the layers panel.
(() => {
  const params = new URLSearchParams(location.search);
  const theme = params.get('theme') || 'light';
  document.documentElement.dataset.theme = theme;

  const states = {
    'sensor.temp': { entity_id: 'sensor.temp', state: '21.4', attributes: { friendly_name: 'Living room', unit_of_measurement: '°C', device_class: 'temperature' } },
    'sensor.humidity': { entity_id: 'sensor.humidity', state: '62', attributes: { friendly_name: 'Humidity', unit_of_measurement: '%' } },
    'light.kitchen': { entity_id: 'light.kitchen', state: 'on', attributes: { friendly_name: 'Kitchen', brightness: 180, supported_color_modes: ['brightness'], color_mode: 'brightness' } },
    'lock.door': { entity_id: 'lock.door', state: 'locked', attributes: { friendly_name: 'Front door' } },
  };
  const hass = {
    states,
    entities: {},
    language: 'en',
    locale: { language: 'en', number_format: 'language', time_format: 'language' },
    themes: { themes: {}, darkMode: theme === 'dark' },
    connection: { subscribeEvents: async () => () => {}, subscribeMessage: () => Promise.reject({ code: 'unknown_command' }) },
    callWS: () => Promise.reject({ code: 'unknown_command' }),
    callService: async () => undefined,
  };

  const k = (at, v) => ({ at, ...v });
  const PARTS = {
    id: 'parts', name: 'Parts', kind: 'keyframes', duration: 2, easing: 'ease-in-out', iterations: 'infinite', target: 'element', origin: 'center', version: 1,
    keyframes: [k(0, { opacity: 1 }), k(100, { opacity: 1 })],
    tracks: [
      { target: 'icon', keyframes: [k(0, { transform: { rotate: 0 } }), k(50, { transform: { rotate: 30 } }), k(100, { transform: { rotate: 0 } })] },
      { target: 'name', keyframes: [k(0, { transform: { x: 0 } }), k(50, { transform: { x: 12 } }), k(100, { transform: { x: 0 } })] },
      { target: 'state', keyframes: [k(0, { transform: { scale: 1 } }), k(50, { transform: { scale: 1.25 } }), k(100, { transform: { scale: 1 } })] },
      { target: 'background', keyframes: [k(0, { transform: { y: 0 }, opacity: 1 }), k(50, { transform: { y: 10 }, opacity: 0.55 }), k(100, { transform: { y: 0 }, opacity: 1 })] },
    ],
  };
  const anim = { animations: [{ id: 'a', preset: 'custom:parts' }] };
  const surface = { ...anim, background_color: 'var(--secondary-background-color)', border_radius: '12px', padding: '10px 12px' };
  const card = (name, rows) => ({ type: 'custom:magic-card', name, custom_animations: [PARTS], rows });
  const row = (id, modules, layout) => ({ id, ...(layout ? { layout } : {}), columns: modules.map((m, i) => ({ id: `${id}c${i}`, modules: [m] })) });

  const CARDS = [
    ['Info, button, light', card('Modules A', [
      row('a0', [{ id: 'info', type: 'info', entity: 'sensor.temp', show_icon: true, design: surface }]),
      row('a1', [{ id: 'button', type: 'button', entity: 'lock.door', icon: 'mdi:lock', label: 'Front door', show_state: true, design: anim }]),
      row('a2', [{ id: 'light', type: 'light', entity: 'light.kitchen', design: surface }]),
    ])],
    ['Text, bar, gauge, icon', card('Modules B', [
      row('b0', [{ id: 'text', type: 'text', text: 'Good evening', design: { ...surface, font_size: '20px' } }, { id: 'icon', type: 'icon', icon: 'mdi:bell-ring', size: '40px', design: surface }], '1-1'),
      row('b1', [{ id: 'bar', type: 'bar', entity: 'sensor.humidity', design: anim }]),
      row('b2', [{ id: 'gauge', type: 'gauge', entity: 'sensor.humidity', design: anim }]),
    ])],
    ['Shaped, value background, layout', card('Shapes', [
      row('s0', [
        { id: 'hex', type: 'info', entity: 'sensor.temp', show_icon: true, design: { ...anim, shape: 'hexagon', background_color: '#29b6f6', color: '#fff', text_align: 'center', min_height: '96px' } },
        { id: 'vbg', type: 'info', entity: 'sensor.humidity', design: { ...surface, min_height: '72px', value_background: { type: 'fill', color: '#66bb6a', opacity: '40%', wave: false } } },
      ], '1-1'),
      // actions (transition: all on the wrapper) and a hover background
      row('s2', [{ id: 'act', type: 'info', entity: 'sensor.temp', actions: { tap_action: { action: 'more-info' } }, design: { ...surface, hover: { background_color: 'rgb(255, 204, 128)' } } }]),
      // the layout runs the document itself: its child's name must not move
      row('s1', [{ id: 'outer', type: 'vertical', design: surface, modules: [{ id: 'inner', type: 'text', text: 'Inner text (not animated)' }] }]),
    ])],
  ];

  const cardsEl = document.getElementById('cards');
  const cards = [];
  const mount = (title, config, h = hass) => {
    const box = document.createElement('div');
    box.innerHTML = `<h3>${title}</h3>`;
    const el = document.createElement('magic-card');
    el.setConfig(config);
    el.hass = h;
    box.append(el);
    cardsEl.append(box);
    cards.push(el);
  };
  const whenReady = (fn) => (customElements.get('magic-card') && window.__tiles ? fn() : setTimeout(() => whenReady(fn), 20));
  whenReady(() => {
    for (const [title, config] of CARDS) mount(title, config);
    const { tileModule, tileHass } = window.__tiles;
    mount('Card tile (studio)', card('Tile', [{ id: 't', columns: [{ id: 'tc', modules: [tileModule('card', 'tile', false, anim.animations)] }] }]), tileHass('card', hass));

    const layers = document.getElementById('layers');
    for (const [title, tile, selection] of [
      ['Icon tile', 'icon', { kind: 'none' }],
      ['Card tile, Name selected', 'card', { kind: 'target', target: 'name' }],
    ]) {
      const sec = document.createElement('section');
      sec.innerHTML = `<h2>${title}</h2>`;
      const p = document.createElement('mc-anim-targets-layers');
      p.doc = PARTS;
      p.tile = tile;
      p.selection = selection;
      p.addEventListener('selection-change', (e) => (p.selection = e.detail.selection));
      sec.append(p);
      layers.append(sec);
    }
  });

  /** Pause every animation of the cards at `ms`. */
  const pause = (ms) => {
    for (const c of cards) for (const a of c.shadowRoot.getAnimations()) { a.pause(); a.currentTime = ms; }
  };
  /** A state change: every card renders again (the background hand-over must survive it). */
  const bump = () => {
    states['sensor.temp'] = { ...states['sensor.temp'], state: '22.0' };
    // a new theme name too: the runtime reads the wrapper background again (the hand-over under `transition: all`)
    for (const c of cards) {
      c.hass = { ...c.hass, themes: { ...c.hass.themes, theme: 'harness-bump' }, states: { ...c.hass.states, 'sensor.temp': states['sensor.temp'] } };
      c.requestUpdate();
    }
  };
  window.__d = { cards, pause, bump, PARTS };
})();
