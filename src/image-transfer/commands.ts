import { THUMB_SIDE_PX } from '../contracts/image-editor';
import { IMAGE_CMD, MAX_IMAGE_GET_IDS, THUMB_MAX_BYTES, THUMB_RE } from '../contracts/mcu-library-images';
import type { ImageSummary, SavedImage } from '../contracts/mcu-library-images';
import type { ImageTransfer, ImageTransferHass, ImageTransferKit, LibraryListing, TransferItem } from '../contracts/preset-transfer';
import type { SvgImageApi } from '../contracts/svg-image';

type Commands = Pick<ImageTransfer, 'list' | 'exportItems' | 'rename' | 'duplicate' | 'remove' | 'save' | 'invalidate'>;

/** A saved image without what the server sets itself and what the caller names. */
const rest = (o: SavedImage): Omit<SavedImage, 'id' | 'name' | 'created_at' | 'updated_at'> => {
  const { id: _i, name: _n, created_at: _c, updated_at: _u, ...r } = o;
  void [_i, _n, _c, _u];
  return r;
};

const meta = (m: { author?: string; description?: string }): { author?: string; description?: string } => ({ ...(m.author ? { author: m.author } : {}), ...(m.description ? { description: m.description } : {}) });

/** The images_* calls. A failed call rejects with the server's error unchanged (its `code` kept). */
export function imageCommands(api: SvgImageApi, kit: ImageTransferKit): Commands {
  const ws = (hass: ImageTransferHass, msg: Record<string, unknown>): Promise<Record<string, unknown>> => hass.callWS(msg) as Promise<Record<string, unknown>>;

  const getMany = async (hass: ImageTransferHass, ids: readonly string[]): Promise<SavedImage[]> => {
    const out: SavedImage[] = [];
    for (let i = 0; i < ids.length; i += MAX_IMAGE_GET_IDS) out.push(...(((await ws(hass, { type: IMAGE_CMD.get, ids: ids.slice(i, i + MAX_IMAGE_GET_IDS) }))?.images ?? []) as SavedImage[]));
    return out;
  };
  const getOne = async (hass: ImageTransferHass, id: string): Promise<SavedImage> => {
    const full = (await getMany(hass, [id]))[0];
    if (!full) throw new Error('gone');
    return full;
  };

  return {
    async list(hass): Promise<LibraryListing<ImageSummary>> {
      try {
        return { state: 'ok', items: ((await ws(hass, { type: IMAGE_CMD.list }))?.images ?? []) as ImageSummary[] };
      } catch (e) {
        return { state: String((e as { code?: string })?.code ?? '') === 'unknown_command' || !hass?.callWS ? 'missing' : 'error', items: [] };
      }
    },

    async exportItems(hass, ids): Promise<TransferItem<'image'>[]> {
      const byId = new Map((await getMany(hass, ids)).map((f) => [f.id, f]));
      const items: TransferItem<'image'>[] = [];
      for (const id of ids) {
        const f = byId.get(id);
        if (f) items.push({ id: f.id, name: f.name, ...meta(f), ...(f.keywords?.length ? { keywords: f.keywords } : {}), data: { svg: f.svg, view_box: f.view_box, ...(f.bindings?.length ? { bindings: f.bindings } : {}) } });
      }
      return items;
    },

    async rename(hass, id, name): Promise<void> {
      const full = await getOne(hass, id);
      await ws(hass, { type: IMAGE_CMD.save, image: { ...rest(full), id, name }, base_updated_at: full.updated_at });
      api.invalidate([id]);
    },

    async duplicate(hass, id, name, taken): Promise<string> {
      const full = await getOne(hass, id);
      const copy = kit.uniqueId(kit.slug(name, 'image'), taken);
      await ws(hass, { type: IMAGE_CMD.save, image: { ...rest(full), id: copy, name } });
      api.invalidate([copy]);
      return copy;
    },

    async remove(hass, id): Promise<void> {
      await ws(hass, { type: IMAGE_CMD.remove, image_id: id });
      api.invalidate([id]);
    },

    async save(hass, item, baseUpdatedAt): Promise<void> {
      const { svg, view_box, bindings } = item.data;
      const thumb = await api.thumbnail(svg, THUMB_SIDE_PX, THUMB_MAX_BYTES).catch(() => undefined);
      await ws(hass, {
        type: IMAGE_CMD.save,
        image: { id: item.id, name: item.name, ...meta(item), ...(item.keywords ? { keywords: item.keywords } : {}), view_box, svg, ...(bindings ? { bindings } : {}), ...(thumb && THUMB_RE.test(thumb) ? { thumb } : {}) },
        ...(baseUpdatedAt ? { base_updated_at: baseUpdatedAt } : {}),
      });
      api.invalidate([item.id]);
    },

    invalidate: (ids) => api.invalidate([...ids]),
  };
}
