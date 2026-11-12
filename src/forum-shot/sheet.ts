// The sheet: one PNG of settled frames in a fixed grid, one column per mode (light left) and one row per look.
import { FORUM_SHOT_MAX_PIXELS, FORUM_SHOT_SCALE } from '../contracts/forum-shot';
import type { ForumShotLook, ForumShotMode, ForumShotNotice, ForumShotRequest, ForumShotSheet } from '../contracts/forum-shot';
import { captureFrame, FONT_STYLE_MARK } from './capture';
import type { CaptureSeams } from './capture';
import { faceRules, prepareCard } from './font-address';
import { prepareFonts } from './font-fetch';
import type { FontSeams } from './font-fetch';
import { withLook } from './looks';
import type { LookSource } from './looks';
import { modeWrapper } from './modes';
import { forumShotError, settleCard } from './settle';

/** Gap between frames in CSS px. */
export const SHEET_GAP = 16;
/** The fixed file name; nothing about the card goes into it. */
export const SHEET_FILE_NAME = 'magic-card-forum-shot.png';
const MODE_ORDER: ForumShotMode[] = ['light', 'dark'];
const LOOK_ORDER: ForumShotLook[] = ['as-configured', 'quiet', 'living', 'glow'];

/** One captured frame and where it goes, in device pixels. */
export interface Placed {
  blob: Blob;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** The browser steps of the sheet; tests replace them because happy-dom has no canvas. */
export interface SheetSeams {
  capture?: CaptureSeams;
  /** Draws the placed frames onto one canvas of the given size and returns the PNG. */
  compose?: (frames: Placed[], width: number, height: number) => Promise<Blob>;
  /** Supplies the library for the Quiet, Living and Glow looks; without it those looks leave icons as they are. */
  lookSource?: () => Promise<LookSource | undefined>;
  settleMs?: number;
  /** Replaces the network and the font loader of the font step. */
  fonts?: FontSeams;
}

/** Draws the frames onto a canvas with no text and returns a plain PNG (no metadata chunks are written by the canvas encoder). */
async function composeOnCanvas(frames: Placed[], width: number, height: number): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw forumShotError('capture_failed');
  for (const f of frames) {
    const bitmap = await createImageBitmap(f.blob);
    ctx.drawImage(bitmap, f.x, f.y, f.width, f.height);
    bitmap.close();
  }
  return new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(forumShotError('capture_failed'))), 'image/png'));
}

const inOrder = <T>(order: T[], wanted: T[]): T[] => order.filter((v) => wanted.includes(v));

/**
 * Renders the request's frames one at a time (each card paused before its first render and removed after its capture) and joins them
 * into one PNG. Throws `remote_asset` before any card mounts, and `too_large` before the frames are drawn together.
 */
export async function renderSheet(hass: object, request: ForumShotRequest, seams: SheetSeams = {}): Promise<ForumShotSheet> {
  const kit = await prepareCard(request.config, location.origin, request.imageFonts);
  if (kit.lock) throw forumShotError('remote_asset');
  const shown = request.fontHosts ?? [];
  if (kit.plan.fontHosts.some((h) => !shown.includes(h))) throw forumShotError('hosts_changed');
  const modes = inOrder(MODE_ORDER, request.modes);
  const looks = inOrder(LOOK_ORDER, request.looks);
  if (!modes.length || !looks.length) throw forumShotError('capture_failed');
  const needsSource = looks.some((l) => l !== 'as-configured');
  const source = needsSource ? await seams.lookSource?.() : undefined;

  let fontStyle: HTMLStyleElement | undefined;
  const prepared = new Set<string>();
  if (kit.plan.sheets.length) {
    const fonts = await prepareFonts(kit.plan, seams.fonts);
    if (!fonts.ok) throw forumShotError(fonts.code);
    for (const f of fonts.faces) prepared.add(f.family.toLowerCase());
    for (const family of kit.aliases.keys()) if (!prepared.has(family)) throw forumShotError('font_unavailable');
    const rules = faceRules(fonts.faces, kit.aliases);
    if (rules === null) throw forumShotError('font_unavailable');
    fontStyle = document.createElement('style');
    fontStyle.setAttribute(FONT_STYLE_MARK, '');
    fontStyle.textContent = rules;
    document.head.append(fontStyle);
  }
  try {
    return await draw();
  } finally {
    fontStyle?.remove();
  }

  async function draw(): Promise<ForumShotSheet> {
    const notices = new Set<ForumShotNotice>();
    const shots: { mode: ForumShotMode; look: ForumShotLook; blob: Blob; width: number; height: number }[] = [];
    for (const look of looks) {
      for (const mode of modes) {
        const wrap = modeWrapper(hass, mode, () => notices.add('remote_placeholder'));
        document.body.append(wrap);
        let settled;
        try {
          settled = await settleCard(hass, withLook(kit.mount, look, source), { container: wrap, settleMs: seams.settleMs, preparedFamilies: prepared });
          const shot = await captureFrame(settled.card, seams.capture);
          for (const n of settled.notices) notices.add(n);
          if (shot.replaced) notices.add('remote_placeholder');
          shots.push({ mode, look, blob: shot.blob, width: shot.width, height: shot.height });
        } finally {
          settled?.dispose();
          wrap.remove();
        }
      }
    }

    const gap = SHEET_GAP * FORUM_SHOT_SCALE;
    const cellW = Math.max(...shots.map((s) => s.width));
    const cellH = Math.max(...shots.map((s) => s.height));
    const width = modes.length * cellW + (modes.length - 1) * gap;
    const height = looks.length * cellH + (looks.length - 1) * gap;
    if (width * height > FORUM_SHOT_MAX_PIXELS) throw forumShotError('too_large');
    const placed: Placed[] = shots.map((s) => ({
      blob: s.blob,
      x: modes.indexOf(s.mode) * (cellW + gap),
      y: looks.indexOf(s.look) * (cellH + gap),
      width: s.width,
      height: s.height,
    }));
    let blob: Blob;
    try {
      blob = await (seams.compose ?? composeOnCanvas)(placed, width, height);
    } catch (e) {
      throw (e as { code?: string }).code ? e : forumShotError('capture_failed');
    }
    return {
      blob,
      width,
      height,
      fileName: SHEET_FILE_NAME,
      frames: shots.map(({ mode, look }) => ({ mode, look })),
      notices: [...notices],
    };
  }
}
