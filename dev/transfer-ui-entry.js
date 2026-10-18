// Dev-only entry for dev/transfer-ui.html: the library view and the transfer panel outside HA.
import { defineUiKit } from '../src/ui-kit';
import { TRANSFER } from '../src/transfer/chunk';

defineUiKit();
const icons = ['Lamp', 'Fan', 'Door sensor', 'Kettle', 'Thermostat'].map((n) => ({ id: n.toLowerCase().replace(' ', '_'), name: n, updated_at: 'x' }));
window.__hass = {
  user: { is_admin: true },
  connection: { subscribeMessage: async () => () => {} },
  callWS: async (m) => {
    if (/icons_list/.test(String(m.type))) return { icons };
    if (/shapes_list/.test(String(m.type))) return { shapes: [] };
    return { animations: {} };
  },
};
const svg = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
/** Fills the open panel's textarea with a two-icon file (one clashes with "Lamp") and presses Read. */
window.__paste = (view) => {
  const p = view.shadowRoot.querySelector('mc-transfer-panel');
  const item = (id, name, d) => ({ id, name, data: { svg: svg(d), path: d, view_box: '0 0 24 24' } });
  const ta = p.shadowRoot.querySelector('textarea');
  ta.value = TRANSFER.serialiseTransfer('icon', [item('lamp', 'Lamp', 'M2 2H20V20H2Z'), item('moon', 'Moon', 'M4 4H20V20H4Z')], 'yaml');
  [...p.shadowRoot.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Read').click();
};
