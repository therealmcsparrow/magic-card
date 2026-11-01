import { LOAD_TIMEOUT_MS, TRANSFER_CHUNK, TRANSFER_CONTRACT_VERSION, type TransferChunk } from '../contracts/preset-transfer';
import type { CardKeyLists, StrictType } from '../contracts/share-kit';
import type { MagicCardConfig } from '../types';
import { COLOR_KEYS, IMAGE_KEYS, NUMBER_UNITS } from '../utils/css-design-map';
import { COMMON_MODULE_KEYS, MODULE_KEYS } from './state/module-keys';

// The only importer of the transfer chunk; set as window.MagicCard.loadTransfer().

let importer = (): Promise<unknown> => import(/* webpackChunkName: "transfer" */ '../transfer/chunk');
let pending: Promise<TransferChunk> | undefined;

export function loadTransfer(): Promise<TransferChunk> {
  pending ??= new Promise<TransferChunk>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${TRANSFER_CHUNK} chunk: timed out`)), LOAD_TIMEOUT_MS);
    importer().then(
      (m) => {
        clearTimeout(timer);
        const api = (m as { TRANSFER?: TransferChunk }).TRANSFER;
        if (api && String(api.version).split('.')[0] === TRANSFER_CONTRACT_VERSION.split('.')[0]) resolve(api);
        else reject(new Error(`${TRANSFER_CHUNK} chunk: unsupported version ${String(api?.version)}`));
      },
      (e: unknown) => {
        clearTimeout(timer);
        reject(e instanceof Error ? e : new Error(String(e)));
      },
    );
  }).catch((e: unknown) => {
    pending = undefined;
    throw e;
  });
  return pending;
}

/** Tests: forget the memo; `load` replaces the import (restored when omitted). */
export function __setTransferImportForTests(load?: () => Promise<unknown>): void {
  pending = undefined;
  importer = load ?? (() => import(/* webpackChunkName: "transfer" */ '../transfer/chunk'));
}

const CARD_KEYS = [
  'type', 'name', 'template', 'entity', 'not_synced', 'rows', 'use_page_theme', 'theme', 'background', 'background_image', 'border_radius', 'padding',
  'border_width', 'border_style', 'border_color', 'opacity', 'backdrop_filter', 'margin', 'box_shadow', 'card_height', 'overflow', 'css', 'hover', 'display',
  'conditional_appearance', 'animations', 'custom_animations', 'hidden_animations', 'background_layers', 'layers_low_power', 'pause_button',
  'pause_button_corner', 'ring', 'shape', 'shape_options', 'custom_shapes', 'custom_icons', 'value_background', 'popup', 'flows', 'seasonal',
] as const satisfies readonly (keyof MagicCardConfig)[];

/** What the share-kit card reader checks a shared card against: its keys, the module keys and the strict type of each design key. */
export function cardKeyLists(): CardKeyLists {
  const designTypes: Record<string, StrictType[]> = {};
  for (const [k, unit] of Object.entries(NUMBER_UNITS)) designTypes[k] = [unit === 's' ? 'time' : 'length', 'number', 'keyword'];
  for (const k of COLOR_KEYS) designTypes[k] = ['colour', 'gradient'];
  for (const k of IMAGE_KEYS) designTypes[k] = ['paint-image', 'gradient', 'colour'];
  return { cardKeys: CARD_KEYS, moduleKeys: MODULE_KEYS, commonModuleKeys: COMMON_MODULE_KEYS, designTypes };
}
