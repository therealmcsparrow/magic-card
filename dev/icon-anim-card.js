// dev/icon-anim-card.html: icon library entries on real magic-cards. ?theme=light|dark,
// ?sheet=1 every entry small (contact sheet), ?ids=a,b,c only these, ?svg=1 also the animated SVG
// files as <img> (CSS copy) and ?smil=1 their SMIL copy only. window.__ia.pause(f) pauses every
// animation at f (0-1) of its cycle.
(() => {
  const params = new URLSearchParams(location.search);
  const theme = params.get('theme') || 'light';
  document.documentElement.dataset.theme = theme;
  const sheet = params.get('sheet') === '1';
  const hass = {
    states: {},
    entities: {},
    language: 'en',
    locale: { language: 'en', number_format: 'language', time_format: 'language' },
    themes: { themes: {}, darkMode: theme === 'dark' },
    connection: { subscribeEvents: async () => () => {}, subscribeMessage: () => Promise.reject({ code: 'unknown_command' }) },
    callWS: () => Promise.reject({ code: 'unknown_command' }),
    callService: async () => undefined,
  };
  const cards = [];
  const whenReady = (fn) => (customElements.get('magic-card') && window.__iconAnim ? fn() : setTimeout(() => whenReady(fn), 20));
  whenReady(() => {
    const { ICON_LIBRARY, exportAnimatedSvg, geometryOf } = window.__iconAnim;
    const ids = params.get('ids')?.split(',');
    const list = ids ? ICON_LIBRARY.filter((e) => ids.includes(e.id)) : ICON_LIBRARY;
    const main = document.getElementById('cards');
    if (sheet) main.classList.add('sheet');
    // ?strip=1: a film strip per entry (the same animation paused at 0, 1/8 ... 7/8 of its cycle)
    const strip = params.get('strip') === '1';
    if (strip) main.classList.add('strip');
    const frames = strip ? [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875] : [undefined];
    for (const e of list) {
      if (strip) {
        const lbl = document.createElement('div');
        lbl.className = 'lbl';
        lbl.textContent = e.name;
        main.append(lbl);
      }
      for (const f of frames) {
      const doc = e.build();
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.id = e.id;
      cell.innerHTML = strip ? '' : `<h3>${e.name}</h3>`;
      const el = document.createElement('magic-card');
      el.setConfig({
        type: 'custom:magic-card',
        custom_animations: [doc],
        rows: [{ id: 'r', columns: [{ id: 'c', vertical_align: 'center', modules: [
          sheet || strip
            ? { id: 'm', type: 'icon', icon: e.icon, size: strip ? '44px' : '56px', design: { animations: [{ id: 'a', preset: `custom:${doc.id}` }], text_align: 'center' } }
            : { id: 'm', type: 'info', entity: `sensor.${e.id.replace(/-/g, '_')}`, icon: e.icon, show_icon: true, design: { animations: [{ id: 'a', preset: `custom:${doc.id}`, target: 'icon' }] } },
        ] }] }],
      });
      const ent = `sensor.${e.id.replace(/-/g, '_')}`;
      hass.states[ent] = { entity_id: ent, state: e.domain.replace(/_/g, ' '), attributes: { friendly_name: e.name, icon: e.icon } };
      el.hass = hass;
      if (f !== undefined) el.dataset.f = String(f);
      cell.append(el);
      main.append(cell);
      cards.push(el);
      }
    }
    if (params.get('svg') === '1') {
      const box = document.getElementById('svgs');
      for (const e of list) {
        const doc = e.build();
        let { svg } = exportAnimatedSvg(doc, geometryOf(doc), { color: '#03a9f4' });
        // the SMIL copy only: drop the stylesheet (a viewer without CSS)
        if (params.get('smil') === '1') svg = svg.replace(/<style>[\s\S]*?<\/style>/, '').replace(' visibility="hidden"', ' display="none"');
        const f = document.createElement('figure');
        f.innerHTML = `<img alt="" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}"><figcaption>${e.id}</figcaption>`;
        box.append(f);
      }
    }
  });
  /** Pause every animation (also inside the icons' shadow roots) at `f` of its cycle. */
  /** Strip mode: each card at its own fraction. */
  const pauseStrip = () => {
    for (const c of cards) {
      const f = Number(c.dataset.f ?? 0);
      const all = [];
      const walk = (root) => {
        if (root.getAnimations) all.push(...root.getAnimations());
        for (const el of root.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
      };
      walk(c.shadowRoot);
      for (const a of all) {
        const d = Number(a.effect?.getTiming().duration) || 0;
        a.pause();
        a.currentTime = d * f;
      }
    }
  };
  const pause = (f) => {
    // document.getAnimations() leaves out shadow trees: walk every shadow root
    const all = [];
    const walk = (root) => {
      if (root.getAnimations) all.push(...root.getAnimations());
      for (const el of root.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
    };
    walk(document);
    for (const a of all) {
      const d = Number(a.effect?.getTiming().duration) || 0;
      a.pause();
      a.currentTime = d * f;
    }
    return all.length;
  };
  window.__ia = { cards, pause, pauseStrip };
})();
