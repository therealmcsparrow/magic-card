// What the Copy my setup button reads from the page: the live card config, the card version, Utils, the needs table and the
// chunk states. Contracts diagnostics 1.0.0 and setup-block 1.0.0.

import type { ChunkState, SnapshotInput } from '../../contracts/diagnostics';
import { VERSION } from '../../version';
import { buildSnapshot } from '../../diagnostics/snapshot';
import { formatSetupBlock } from '../../diagnostics/format';
import { LAZY_FEATURES } from '../../utils/lazy-features';
import { lazyChunks, onDemandChunks } from '../../utils/lazy-chunks';

type Control = { ready(): boolean; failed(): boolean; failure(): 'load' | 'mismatch' | undefined };

const controlOf = (name: string): Control | undefined => {
  const own = Object.prototype.hasOwnProperty;
  if (own.call(lazyChunks, name)) return (lazyChunks as unknown as Record<string, Control>)[name];
  if (own.call(onDemandChunks, name)) return (onDemandChunks as unknown as Record<string, Control>)[name];
  return undefined;
};

const chunkState = (name: string): ChunkState | 'idle' => {
  const c = controlOf(name);
  if (!c) return 'idle';
  if (c.ready()) return 'loaded';
  if (c.failed()) return c.failure() === 'mismatch' ? 'other-release' : 'failed';
  return 'idle';
};

/** Reads the page at click time; `config` is only read, never changed. */
export function readSnapshotInput(config: unknown): SnapshotInput {
  const needs: Record<string, (config: unknown) => boolean> = {};
  for (const name of Object.keys(LAZY_FEATURES)) needs[name] = LAZY_FEATURES[name as keyof typeof LAZY_FEATURES].needs;
  return {
    config,
    cardVersion: VERSION,
    utils: (window as unknown as { magicCardUtils?: unknown }).magicCardUtils,
    needs,
    onDemand: Object.keys(onDemandChunks),
    chunkState,
    secure: typeof window.isSecureContext === 'boolean' ? window.isSecureContext : undefined,
  };
}

/** The block for the clipboard and the fallback box: both get the same text. */
export const buildSetupBlock = (config: unknown): string => formatSetupBlock(buildSnapshot(readSnapshotInput(config)));
