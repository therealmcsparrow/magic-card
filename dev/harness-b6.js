// Batch 6 harness additions: card animations, the new presets and rings. Loaded after harness.js.
(() => {
  const mc = window.__mc;
  Object.assign(mc.hass.states, {
    'sensor.purifier_filter_life': { entity_id: 'sensor.purifier_filter_life', state: '65', attributes: { friendly_name: 'Filter life', unit_of_measurement: '%' } },
    'fan.purifier': { entity_id: 'fan.purifier', state: 'on', attributes: { friendly_name: 'Air purifier', percentage: 40 } },
  });

  const text = (id, t, design) => ({ id, type: 'text', text: t, ...(design ? { design } : {}) });

  /** Rings: a 50% module with a 65% value ring, a 16px card with a snake, a row with per-corner radii. */
  function ringsConfig() {
    return {
      type: 'custom:magic-card', name: 'Rings',
      border_radius: '16px',
      ring: { mode: 'animated', animation: 'snake', length: 30, color: '#e91e63', width: 3, speed: '4s' },
      rows: [
        { id: 'rr1', layout: '1-1', columns: [
          { id: 'rc1', vertical_align: 'center', modules: [
            { id: 'rm1', type: 'icon', icon: 'mdi:air-purifier', entity: 'fan.purifier', design: {
              border_radius: '50%', width: '96px', height: '96px', display: 'flex', justify_content: 'center', align_items: 'center',
              background_color: '#e8f5e9', font_size: '40px',
              ring: { mode: 'value', entity: 'sensor.purifier_filter_life', width: 4, color: '#2e7d32', track_opacity: 20 } } },
          ] },
          { id: 'rc2', vertical_align: 'center', modules: [
            text('rm2', 'Filter 65%', { border_radius: '50%', padding: '18px 24px', background_color: '#e3f2fd', text_align: 'center',
              ring: { mode: 'animated', animation: 'dots', color: '#1565c0', width: 4, position: 'center', speed: '6s' } }),
            text('rm3', 'Outside, thresholds', { border_radius: '12px', padding: '12px 16px', margin: '8px 4px',
              ring: { mode: 'value', entity: 'fan.purifier', attribute: 'percentage', position: 'outside', width: 3,
                thresholds: [{ from: 0, color: '#f44336' }, { from: 30, color: '#ff9800' }, { from: 60, color: '#4caf50' }] } }),
          ] },
        ] },
        { id: 'rr2', layout: '1', design: {
          border_top_left_radius: '24px', border_top_right_radius: '4px', border_bottom_right_radius: '40px 16px', border_bottom_left_radius: '0px',
          background_color: '#fff3e0', padding: '16px',
          ring: { mode: 'animated', animation: 'full', color: '#ef6c00', width: 3, position: 'center' } },
        columns: [{ id: 'rc3', modules: [text('rm4', 'Row with per-corner radii')] }] },
      ],
    };
  }

  /** Card animations + new presets: a glowing card with aurora, a tap ripple, border snake / power flow. */
  function cardAnimConfig() {
    return {
      type: 'custom:magic-card', name: 'Card animations',
      border_radius: '20px',
      animations: [
        { id: 'ca1', preset: 'aurora', color: '#7c4dff', strength: 70 },
        { id: 'ca2', preset: 'neon-border', color: '#00e5ff' },
        { id: 'ca3', preset: 'tap-ripple', trigger: 'tap', color: '#ffffff' },
      ],
      rows: [
        { id: 'ar1', layout: '1-1', columns: [
          { id: 'ac1', modules: [text('am1', 'Border snake', { border_radius: '14px', padding: '16px', background_color: 'rgba(255,255,255,.7)',
            animations: [{ id: 'x', preset: 'border-snake', color: '#e91e63' }] })] },
          { id: 'ac2', modules: [text('am2', 'Power flow', { border_radius: '50%', padding: '16px', background_color: 'rgba(255,255,255,.7)', text_align: 'center',
            animations: [{ id: 'x', preset: 'power-flow', color: '#ff9800' }] })] },
        ] },
        { id: 'ar2', layout: '1-1-1', columns: [
          { id: 'ac3', modules: [text('am3', 'Starfield', { border_radius: '12px', padding: '20px 12px', background_color: '#0d1b2a', color: '#fff',
            animations: [{ id: 'x', preset: 'starfield', color: '#ffffff' }] })] },
          { id: 'ac4', modules: [text('am4', 'Matrix', { border_radius: '12px', padding: '20px 12px', background_color: '#06140a', color: '#b9f6ca',
            animations: [{ id: 'x', preset: 'matrix-rain', color: '#00e676' }] })] },
          { id: 'ac5', modules: [text('am5', 'Lava lamp', { border_radius: '12px', padding: '20px 12px', background_color: '#311b92', color: '#fff',
            animations: [{ id: 'x', preset: 'lava-lamp', color: '#ff4081' }] })] },
        ] },
      ],
    };
  }

  /** Every batch-6 preset on its own tile (3 per row), for a frozen gallery screenshot. */
  const B6_PRESETS = [
    'pendulum', 'orbit', 'coin-spin', 'rotate-3d', 'squash-stretch', 'wiggle', 'shadow-lift',
    'holographic-shimmer', 'scanline', 'twinkle', 'spotlight',
    'border-snake', 'neon-border', 'power-flow', 'marching-ants', 'color-cycle-bg',
    'aurora', 'lava-lamp', 'plasma-gradient', 'gradient-flow', 'starfield', 'meteor-shower', 'bokeh',
    'matrix-rain', 'smoke', 'clouds-drift', 'water-ripple', 'fireworks', 'tap-ripple', 'press',
  ];
  function galleryConfig() {
    const rows = [];
    for (let i = 0; i < B6_PRESETS.length; i += 3) {
      rows.push({ id: `gr${i}`, layout: '1-1-1', columns: B6_PRESETS.slice(i, i + 3).map((preset) => ({ id: `gc-${preset}`, modules: [
        text(`gm-${preset}`, preset, { border_radius: '12px', padding: '10px 8px', min_height: '30px', background_color: '#263238', color: '#eceff1', font_size: '12px',
          animations: [{ id: 'g', preset, color: '#ffca28', ...(preset === 'tap-ripple' || preset === 'press' ? { trigger: 'always', iterations: 'infinite' } : {}) }] }),
      ] })) });
    }
    return { type: 'custom:magic-card', name: 'Gallery', rows };
  }

  /**
   * For every ring of `root` (a magic-card): the path's bounding box against the parent's border box
   * (inset by half the stroke inside, 0 on the edge, out by half outside) and 160 points along the
   * path against the rounded rectangle CSS draws from the parent's computed radii. Max error in px.
   */
  function ringProbe(root = mc.card) {
    const sr = root.shadowRoot;
    const rings = [...sr.querySelectorAll('mc-ring')];
    const out = { count: rings.length, results: [], error: '' };
    if (!rings.length) { out.error = 'no rings'; return out; }
    for (const ring of rings) {
      const parent = ring.parentElement;
      const r = ring.ring;
      const path = [...ring.shadowRoot.querySelectorAll('path')].pop();
      if (!path) { out.error += `${parent.className}: no path; `; continue; }
      const inset = r.position === 'inside' ? r.width / 2 : r.position === 'outside' ? -r.width / 2 : 0;
      const pr = parent.getBoundingClientRect();
      const svg = ring.shadowRoot.querySelector('svg').getBoundingClientRect();
      const bb = path.getBBox();
      const bbox = { l: svg.left + bb.x, t: svg.top + bb.y, r: svg.left + bb.x + bb.width, b: svg.top + bb.y + bb.height };
      const want = { l: pr.left + inset, t: pr.top + inset, r: pr.right - inset, b: pr.bottom - inset };
      const bboxErr = Math.max(...['l', 't', 'r', 'b'].map((k) => Math.abs(bbox[k] - want[k])));
      // the CSS shape, independently: computed radii (px / %), clamped, inset
      const cs = getComputedStyle(parent);
      const W = parent.offsetWidth; const H = parent.offsetHeight;
      const rad = (v) => { const [a, b = a] = v.split(' '); const f = (s, of) => (s.endsWith('%') ? parseFloat(s) / 100 * of : parseFloat(s) || 0); return [f(a, W), f(b, H)]; };
      let c = { tl: rad(cs.borderTopLeftRadius), tr: rad(cs.borderTopRightRadius), br: rad(cs.borderBottomRightRadius), bl: rad(cs.borderBottomLeftRadius) };
      const fit = (w, h) => {
        const f = Math.min(1, w / (c.tl[0] + c.tr[0] || 1), h / (c.tr[1] + c.br[1] || 1), w / (c.br[0] + c.bl[0] || 1), h / (c.tl[1] + c.bl[1] || 1));
        for (const k in c) c[k] = c[k].map((v) => v * f);
      };
      fit(W, H);
      for (const k in c) c[k] = c[k].map((v) => (inset >= 0 ? Math.max(0, v - inset) : v > 0 ? v - inset : 0));
      const x0 = inset, y0 = inset, x1 = W - inset, y1 = H - inset;
      fit(x1 - x0, y1 - y0);
      const dist = (x, y) => {
        const corners = [
          [c.tl, x0 + c.tl[0], y0 + c.tl[1], x < x0 + c.tl[0] && y < y0 + c.tl[1]],
          [c.tr, x1 - c.tr[0], y0 + c.tr[1], x > x1 - c.tr[0] && y < y0 + c.tr[1]],
          [c.br, x1 - c.br[0], y1 - c.br[1], x > x1 - c.br[0] && y > y1 - c.br[1]],
          [c.bl, x0 + c.bl[0], y1 - c.bl[1], x < x0 + c.bl[0] && y > y1 - c.bl[1]],
        ];
        for (const [[rx, ry], cx, cy, inside] of corners) {
          if (!inside || !rx || !ry) continue;
          const t = Math.atan2((y - cy) / ry, (x - cx) / rx);
          return Math.hypot(x - (cx + rx * Math.cos(t)), y - (cy + ry * Math.sin(t)));
        }
        return Math.min(Math.abs(x - x0), Math.abs(x - x1), Math.abs(y - y0), Math.abs(y - y1));
      };
      const len = path.getTotalLength();
      let outlineErr = 0;
      for (let i = 0; i < 160; i++) {
        const p = path.getPointAtLength((len * i) / 160);
        outlineErr = Math.max(outlineErr, dist(p.x, p.y));
      }
      const name = parent.tagName === 'HA-CARD' ? 'card' : parent.className.split(' ')[0];
      out.results.push({ name, box: `${Math.round(W)}x${Math.round(H)}`, radius: cs.borderRadius, position: r.position, bboxErr: +bboxErr.toFixed(2), outlineErr: +outlineErr.toFixed(2) });
      if (bboxErr > 1 || outlineErr > 1) out.error += `${name}: path off the outline (bbox ${bboxErr.toFixed(2)}px, outline ${outlineErr.toFixed(2)}px); `;
    }
    return out;
  }

  Object.assign(mc, {
    showRings() { mc.card.setConfig(ringsConfig()); mc.editor.setConfig(ringsConfig()); },
    showGallery() { mc.card.setConfig(galleryConfig()); mc.editor.setConfig(galleryConfig()); },
    showCardAnimations() { mc.card.setConfig(cardAnimConfig()); mc.editor.setConfig(cardAnimConfig()); },
    ringProbe,
    /** Pause every animation of the card at `frac` of its cycle (screenshots of a moving effect). */
    freeze(frac = 0.5, root = mc.card) {
      const all = [...root.shadowRoot.getAnimations(), ...[...root.shadowRoot.querySelectorAll('mc-ring')].flatMap((r) => r.shadowRoot.getAnimations())];
      for (const a of all) { a.pause(); a.currentTime = a.effect.getComputedTiming().duration * frac; }
    },
  });
})();
