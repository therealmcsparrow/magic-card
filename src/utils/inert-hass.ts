// hass wrapper that keeps a live preview inert: writes are swallowed, reads pass.
import type { HomeAssistant } from '../types';

/** Read-only websocket types allowed by name, besides the get / list / subscribe patterns. */
const WS_READ_ONLY = new Set([
  'render_template',
  'auth/sign_path',
  'camera_thumbnail',
  'weather/subscribe_forecast',
  'magic_card_utils/get_templates',
  'media_source/resolve_media',
  'media_source/browse_media',
]);
/** recorder/* commands that write; everything else under recorder/ only reads statistics. */
const RECORDER_WRITES = /^recorder\/(clear|import|update|change|adjust|backup|async_)/;

/** Whether a websocket message type is read-only and may reach Home Assistant from the live preview. */
export function isReadOnlyWsType(type: unknown): boolean {
  if (typeof type !== 'string' || !type) return false;
  if (WS_READ_ONLY.has(type)) return true;
  const last = type.slice(type.lastIndexOf('/') + 1);
  if (type.startsWith('get') || last.startsWith('get') || last === 'list') return true;
  if (type.startsWith('subscribe') || last.startsWith('subscribe')) return true;
  if (type.startsWith('history/')) return true;
  if (type.startsWith('recorder/')) return !RECORDER_WRITES.test(type);
  return false;
}

const msgType = (msg: unknown): unknown => (msg && typeof msg === 'object' ? (msg as { type?: unknown }).type : undefined);

/** Connection proxy: sendMessage / sendMessagePromise / subscribeMessage only carry read-only types; event subscriptions pass through. */
function inertConnection<T extends object>(connection: T): T {
  return new Proxy(connection, {
    get(target, prop) {
      const value = Reflect.get(target, prop, target) as unknown;
      if (typeof value !== 'function') return value;
      if (prop === 'sendMessagePromise') {
        return (msg: unknown, ...rest: unknown[]) =>
          (isReadOnlyWsType(msgType(msg)) ? value.call(target, msg, ...rest) : Promise.resolve(undefined));
      }
      if (prop === 'subscribeMessage') {
        // a subscription is a message too (execute_script, call_service with return_response, ...)
        return (callback: unknown, msg: unknown, ...rest: unknown[]) =>
          (isReadOnlyWsType(msgType(msg)) ? value.call(target, callback, msg, ...rest) : Promise.resolve(() => undefined));
      }
      if (prop === 'sendMessage') {
        return (msg: unknown, ...rest: unknown[]) => {
          if (isReadOnlyWsType(msgType(msg))) value.call(target, msg, ...rest);
        };
      }
      return value.bind(target);
    },
  });
}

/**
 * hass for the live preview: service calls and every websocket message that is not on the read-only
 * allowlist resolve to undefined without reaching Home Assistant, so modules and embedded cards stay
 * inert whatever the input method (touch, native select `change`, raw connection, ...).
 */
export function inertHass(hass: HomeAssistant): HomeAssistant {
  const callWS = hass.callWS?.bind(hass);
  const connection = (hass as { connection?: object }).connection;
  return {
    ...hass,
    ...(connection ? { connection: inertConnection(connection) } : {}),
    callService: async () => undefined,
    callApi: async () => undefined,
    callWS: async (msg: { type: string }) => (isReadOnlyWsType(msg?.type) && callWS ? callWS(msg) : undefined),
  } as unknown as HomeAssistant;
}
