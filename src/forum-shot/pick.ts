// Finds the Magic Cards in the user's dashboards (two hass.callWS reads) and supplies the icon library for the three looks.
import type { ForumShotErrorCode, MagicCardRef } from '../contracts/forum-shot';
import type { IconStyle } from '../contracts/icon-library';
import { loadIconLibrary } from '../anim-studio/icon-library-loader';
import { styleDoc } from '../icon-anim/style';
import type { LookSource } from './looks';
import { classifyCard, configGoogleFamilies } from './font-address';
import { findRemoteAssets } from './remote';
import { forumShotError } from './settle';

export interface WsHass {
  callWS?: <T>(msg: Record<string, unknown>) => Promise<T>;
}

type Obj = Record<string, unknown>;
const CARD_TYPE = 'custom:magic-card';
const MAX_CARDS = 200;
const MAX_NODES = 20_000;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown): string => (typeof v === 'string' ? v.trim().slice(0, 80) : '');

/** The nodes below one config node: a config's views; a view's cards then its sections; a section's cards; a stack's cards or single card. */
function childrenOf(node: Obj): unknown[] {
  if (Array.isArray(node.views)) return node.views;
  const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
  return [...list(node.cards), ...list(node.sections), ...(node.card === undefined ? [] : [node.card])];
}

async function read(hass: WsHass, msg: Obj): Promise<unknown> {
  if (typeof hass.callWS !== 'function') throw forumShotError('config_read_failed');
  return hass.callWS<unknown>(msg);
}

/** Dashboards the user may list: the default (null) plus the storage dashboards; only the default when the list is refused. */
async function dashboards(hass: WsHass): Promise<{ path: string | null; title: string }[]> {
  const out: { path: string | null; title: string }[] = [{ path: null, title: '' }];
  try {
    const reply = await read(hass, { type: 'lovelace/dashboards/list' });
    if (Array.isArray(reply)) {
      for (const d of reply) {
        if (isObj(d) && typeof d.url_path === 'string' && d.url_path && d.mode !== 'yaml') out.push({ path: d.url_path, title: text(d.title) });
      }
    }
  } catch {
    // an account that may not list dashboards still gets the default one
  }
  return out;
}

const configOf = (hass: WsHass, path: string | null): Promise<unknown> =>
  read(hass, path === null ? { type: 'lovelace/config', force: false } : { type: 'lovelace/config', url_path: path, force: false });

/** Every Magic Card of the dashboard configs the user can read, default dashboard first. */
export async function listMagicCards(hass: WsHass): Promise<MagicCardRef[]> {
  const refs: MagicCardRef[] = [];
  let readable = 0;
  for (const dash of await dashboards(hass)) {
    let config: unknown;
    try {
      config = await configOf(hass, dash.path);
    } catch {
      continue;
    }
    if (!isObj(config) || !Array.isArray(config.views)) continue;
    readable++;
    let nodes = 0;
    const walk = async (node: unknown, path: number[], view: string): Promise<void> => {
      if (!isObj(node) || ++nodes > MAX_NODES || refs.length >= MAX_CARDS) return;
      if (node.type === CARD_TYPE) {
        const cardName = text(node.name) || `#${refs.filter((r) => r.dashboard === dash.path && r.view === view).length + 1}`;
        const { lock, fontHosts } = await classifyCard(node, location.origin);
        const families = await configGoogleFamilies(node);
        refs.push({
          dashboard: dash.path,
          view,
          path,
          label: [dash.title, view, cardName].filter(Boolean).join(' / '),
          remote: findRemoteAssets(node, location.origin, families),
          lock,
          fontHosts,
          dashboardTitle: dash.title,
          cardName,
        });
        return;
      }
      let i = 0;
      for (const c of childrenOf(node)) await walk(c, [...path, i++], view);
    };
    let v = 0;
    for (const view of config.views as unknown[]) {
      await walk(view, [v], isObj(view) ? text(view.title) || text(view.path) || `View ${v + 1}` : `View ${v + 1}`);
      v++;
    }
  }
  if (!readable) throw forumShotError('config_read_failed');
  if (!refs.length) throw forumShotError('no_cards');
  return refs;
}

/** The card config at `ref`, read again so the picture shows what the dashboard holds now. */
export async function cardConfigOf(hass: WsHass, ref: MagicCardRef): Promise<Obj> {
  let node: unknown;
  try {
    node = await configOf(hass, ref.dashboard);
  } catch {
    throw forumShotError('config_read_failed');
  }
  if (isObj(node)) {
    for (const i of ref.path) {
      const kids = isObj(node) ? childrenOf(node) : [];
      node = kids[i];
    }
  }
  if (!isObj(node) || node.type !== CARD_TYPE) throw forumShotError('config_read_failed');
  return node;
}

/** The error code of a thrown value, 'capture_failed' when it carries none. */
export function codeOf(e: unknown): ForumShotErrorCode {
  const code = e instanceof Error ? (e as { code?: unknown }).code : undefined;
  return typeof code === 'string' ? (code as ForumShotErrorCode) : 'capture_failed';
}

/** The directory of this bundle when it shares the page's origin, else ''. */
function chunkBase(url: string): string {
  try {
    const u = new URL(url);
    return u.origin === location.origin ? new URL('.', u).href : '';
  } catch {
    return '';
  }
}

/** The Quiet, Living and Glow documents: the entries come from the existing lazy icon-library chunk (loaded once, next to this bundle), the derivation from this bundle's own copy of styleDoc. */
export async function iconLibraryLookSource(): Promise<LookSource> {
  const base = chunkBase(import.meta.url);
  if (base && typeof __webpack_public_path__ !== 'undefined') __webpack_public_path__ = base;
  let lib;
  try {
    lib = await loadIconLibrary();
  } catch {
    throw forumShotError('capture_failed');
  }
  return {
    styleDoc(libraryId: string, style: IconStyle, docId: string) {
      const entry = lib.ICON_LIBRARY.find((e) => e.id === libraryId);
      return entry ? (styleDoc(entry, style, { id: docId }) as unknown as Record<string, unknown>) : undefined;
    },
  };
}
