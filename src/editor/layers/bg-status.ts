import { MAX_BACKGROUND_LAYERS, type BgLayerStatus } from '../../contracts/bg-stack';

/*
 * Status of the card backdrop layers as the live preview reports them (`mc-bg-layer-status`, bg-stack 1.0.0).
 * The studio canvas feeds this store; the Card backdrop group reads it and shows the sentences
 * on the layer rows. The dashboard ignores the event. Keyed by YAML index, so a status is only shown in
 * the Default view (a rule's list has its own indices).
 */

const statuses = new Map<number, BgLayerStatus>();
const listeners = new Set<() => void>();
let openRequest: number | undefined;

export function setStatus(s: BgLayerStatus): void {
  if (!s || typeof s !== 'object') return;
  const i = Number(s.index);
  if (!Number.isInteger(i) || i < 0 || i >= MAX_BACKGROUND_LAYERS) return;
  statuses.set(i, { index: i, status: s.status, reason: s.reason, detail: s.detail });
  for (const fn of listeners) fn();
}

export function getStatus(index: number): BgLayerStatus | undefined {
  return statuses.get(index);
}

export function clearStatuses(): void {
  statuses.clear();
  preview = undefined;
  for (const fn of listeners) fn();
}

export function onStatus(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** The "Layers here" sheet asks the Card backdrop group to open one layer row. */
export function requestOpenLayer(index: number): void {
  openRequest = index;
  for (const fn of listeners) fn();
}

export function takeOpenLayer(): number | undefined {
  const i = openRequest;
  openRequest = undefined;
  return i;
}

// ── Pan and zoom preview (editor only, never saved) ──

export type PanPreview = 'play' | 'start' | 'end';
let preview: PanPreview | undefined;

/** The Preview seg of the pan and zoom editor; the studio canvas hands it to `<mc-bg-stack>`. */
export function setPreview(p: PanPreview | undefined): void {
  preview = p;
  for (const fn of listeners) fn();
}

/** Live canvases that draw the Preview (the studio canvas). The card dialog of Home Assistant has none: Play would do nothing there. */
let previewHosts = 0;

export function claimPreviewHost(): () => void {
  previewHosts++;
  let done = false;
  return () => {
    if (done) return;
    done = true;
    previewHosts--;
    if (!previewHosts) setPreview(undefined);
  };
}

export const previewAvailable = (): boolean => previewHosts > 0;

export function getPreview(): PanPreview | undefined {
  return preview;
}
