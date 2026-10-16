// Pop-up harness: an HA-like dashboard (sections grid cells -> hui-card -> magic-card inside a
// transformed, overflow-hidden view) with a button card that navigates to #kitchen, and the
// Kitchen pop-up card. Loaded after harness.js.
(() => {
  const mc = window.__mc;

  const tile = (id, entity, label, icon) => ({ id, type: 'button', entity, label, icon, show_state: true,
    actions: { tap_action: { action: 'toggle' } } });

  function kitchenPopup(style = 'sheet', extra = {}) {
    return {
      type: 'custom:magic-card', name: 'Kitchen',
      popup: { enabled: true, hash: 'kitchen', title: 'Kitchen', style, ...extra },
      rows: [
        { id: 'p1', layout: '1-1', columns: [
          { id: 'p1c1', modules: [tile('pk1', 'light.kitchen', 'Kitchen lights', 'mdi:ceiling-light')] },
          { id: 'p1c2', modules: [tile('pk2', 'switch.coffee', 'Coffee machine', 'mdi:coffee-maker')] },
        ] },
        { id: 'p2', layout: '1', columns: [{ id: 'p2c1', modules: [
          { id: 'pk3', type: 'slider', entity: 'light.kitchen', direction: 'horizontal', show_value: true },
          { id: 'pk4', type: 'info', entity: 'media_player.kitchen' },
          { id: 'pk5', type: 'graphs', entity: 'sensor.living_room_temperature', hours_to_show: 12 },
        ] }] },
      ],
    };
  }

  function roomButton() {
    return {
      type: 'custom:magic-card', name: 'Rooms',
      rows: [{ id: 'b1', layout: '1-1', columns: [
        { id: 'b1c1', modules: [{ id: 'bk', type: 'button', label: 'Kitchen', icon: 'mdi:silverware-fork-knife',
          actions: { tap_action: { action: 'navigate', navigation_path: '#kitchen' } } }] },
        { id: 'b1c2', modules: [{ id: 'bt', type: 'info', entity: 'sensor.living_room_temperature' }] },
      ] }],
    };
  }

  const cardsOnDash = [];
  /** A sections-view grid cell (div.card) holding hui-card -> magic-card. */
  function cell(config, span = 12) {
    const div = document.createElement('div');
    div.className = 'card';
    div.style.cssText = `grid-column: span ${span}; position: relative; border-radius: 12px`;
    const hui = document.createElement('hui-card');
    hui.style.display = 'block';
    const el = document.createElement('magic-card');
    el.setConfig(config); el.hass = mc.hass;
    hui.append(el); div.append(hui);
    cardsOnDash.push(el);
    return { div, el };
  }

  const style = document.createElement('style');
  style.textContent = `
    .dash { min-height: 100vh; box-sizing: border-box; background: var(--primary-background-color); color: var(--primary-text-color);
      transform: translateZ(0); overflow: hidden; padding: 16px; }
    .dash h1 { font: 400 1.4rem/1.4 inherit; margin: 4px 4px 16px; }
    .dash .section { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 8px; max-width: 1000px; margin: 0 auto; }
    .dash .section .title { grid-column: 1 / -1; font-weight: 500; padding: 4px; }
  `;
  document.head.append(style);

  Object.assign(mc, {
    kitchenPopup,
    /** Replace the editor dialog with a dashboard: a button card, other cards, the pop-up card (hidden). */
    showPopupDashboard(popupStyle = 'sheet', extra = {}) {
      document.querySelector('ha-mock-dialog').style.display = 'none';
      const dash = document.createElement('div');
      dash.className = 'dash';
      dash.innerHTML = '<h1>Home</h1><div class="section"><div class="title">Living room</div></div>';
      const section = dash.querySelector('.section');
      const btn = cell(roomButton());
      const other = cell({ type: 'custom:magic-card', rows: [{ id: 'o', layout: '1', columns: [{ id: 'oc', modules: [
        { id: 'os', type: 'slider', entity: 'light.living_room', direction: 'horizontal', show_value: true },
        { id: 'og', type: 'graphs', entity: 'sensor.living_room_temperature', hours_to_show: 24 }] }] }] });
      const pop = cell(kitchenPopup(popupStyle, extra));
      section.append(btn.div, pop.div, other.div);
      document.body.append(dash);
      mc.dashButton = btn.el; mc.dashPopup = pop.el; mc.dashCell = pop.div;
    },
    /** Tap the Kitchen button like a user (pointer down / up on its module). */
    tapKitchen() {
      const w = mc.dashButton.shadowRoot.querySelector('.mc-module-wrapper[role="button"]');
      const r = w.getBoundingClientRect();
      w.focus(); // a real tap focuses the (tabindex 0) button
      const o = { bubbles: true, composed: true, isPrimary: true, clientX: r.left + 10, clientY: r.top + 10, pointerId: 1 };
      w.dispatchEvent(new PointerEvent('pointerdown', o));
      w.dispatchEvent(new PointerEvent('pointerup', o));
    },
    /** '' when the dashboard pop-up is right: hidden in the flow, open in the top layer, on top, inside the viewport. */
    popupCheck(expectStyle = 'sheet') {
      const el = mc.dashPopup;
      const out = [];
      const host = el.getBoundingClientRect();
      if (host.width || host.height) out.push(`card in the flow ${host.width}x${host.height}`);
      if (getComputedStyle(mc.dashCell).position !== 'absolute') out.push('sections cell still in the grid');
      if (location.hash !== '#kitchen') out.push(`hash ${location.hash}`);
      const dlg = el.shadowRoot.querySelector('dialog.mc-popup');
      if (!dlg?.matches(':modal')) out.push('dialog not modal (top layer)');
      if (dlg?.dataset.style !== expectStyle) out.push(`style ${dlg?.dataset.style}`);
      const s = el.shadowRoot.querySelector('.mc-popup-surface');
      if (!s) return [...out, 'no surface'].join('; ');
      const r = s.getBoundingClientRect();
      if (r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1 || r.width < 200) {
        out.push(`surface outside viewport ${JSON.stringify([r.left, r.top, r.right, r.bottom].map(Math.round))}`);
      }
      if (expectStyle === 'sheet' && Math.abs(r.bottom - innerHeight) > 1) out.push(`sheet not at the bottom (${Math.round(r.bottom)})`);
      if (expectStyle === 'dialog' && Math.abs((r.top + r.bottom) / 2 - innerHeight / 2) > 2) out.push('dialog not centred');
      const x = r.left + r.width / 2, y = r.top + Math.min(r.height / 2, 120);
      let hit = document.elementFromPoint(x, y);
      while (hit && hit.shadowRoot) { const n = hit.shadowRoot.elementFromPoint(x, y); if (!n || n === hit) break; hit = n; }
      if (!hit || !(s === hit || s.contains(hit) || el.shadowRoot.contains(hit))) out.push(`surface covered by ${hit?.tagName}`);
      if (document.activeElement !== el || el.shadowRoot.activeElement?.className !== 'mc-popup-close') out.push(`focus on ${el.shadowRoot.activeElement?.className}`);
      if (!s.textContent.includes('Kitchen lights')) out.push('content missing');
      return out.join('; ');
    },
    studioCard() { return mc.studio().shadowRoot.querySelector('mc-studio-canvas').shadowRoot.querySelector('magic-card'); },
    studioPopupSettings() { return mc.studio().shadowRoot.querySelector('mc-inspector').shadowRoot.querySelector('mc-popup-settings'); },
    /** The editor showing the pop-up card: preview card in edit mode (badge), card settings General. */
    showPopupEditor() {
      const cfg = kitchenPopup();
      mc.card.preview = true;
      mc.card.setConfig(cfg);
      mc.editor.setConfig(cfg);
    },
  });
})();
