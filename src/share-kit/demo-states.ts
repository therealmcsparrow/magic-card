import type { DemoState, EntityPlaceholder } from '../contracts/share-kit';

// Made-up states for placeholder entities, shown in the import preview only. They carry no entity_picture and go to no hass.

const BY_DOMAIN: Readonly<Record<string, Pick<DemoState, 'state' | 'attributes'>>> = {
  light: { state: 'on', attributes: { brightness: 204, brightness_pct: 80 } },
  switch: { state: 'on', attributes: {} },
  sensor: { state: '21.5', attributes: { unit_of_measurement: '°C' } },
  binary_sensor: { state: 'on', attributes: {} },
  climate: { state: 'heat', attributes: { temperature: 20.5, current_temperature: 20.5 } },
  cover: { state: 'open', attributes: { current_position: 60 } },
  media_player: { state: 'playing', attributes: {} },
};

/** A demo state per placeholder id, chosen by its domain; any other domain is `on`. */
export function demoStates(placeholders: readonly EntityPlaceholder[]): Record<string, DemoState> {
  const out: Record<string, DemoState> = {};
  for (const p of placeholders) {
    const d = Object.prototype.hasOwnProperty.call(BY_DOMAIN, p.domain) ? BY_DOMAIN[p.domain] : { state: 'on', attributes: {} };
    out[p.id] = { entity_id: p.id, state: d.state, attributes: { ...d.attributes } };
  }
  return out;
}

/** The demo state as short text: `21.5 °C`, `on, 80 %`, `heat, 20.5`. */
export function demoText(d: DemoState): string {
  const a = d.attributes;
  if (a.unit_of_measurement) return `${d.state} ${a.unit_of_measurement}`;
  const pct = a.brightness_pct ?? a.current_position;
  if (pct !== undefined) return `${d.state}, ${pct} %`;
  return a.temperature !== undefined ? `${d.state}, ${a.temperature}` : d.state;
}
