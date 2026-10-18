import { validateAnimationDoc } from '../../anim-studio/model';
import type { TransferDataByKind } from '../../contracts/preset-transfer';
import { t } from '../i18n';
import { isObj, note } from '../types';
import type { KindResult, Raw } from '../types';

/**
 * An animation item: the document strict-validated with the item's id and name (authoritative).
 * v2 fields and `particles.sim` are checked when the host bundle has registered their validators
 * (model-v2.ts, useParticlesValidator): the panel loads the runtime and particles chunks first when a
 * file mentions them (src/transfer/panel.ts), so neither is copied into this chunk.
 */
export function readAnimation(index: number, id: string, name: string, data: unknown): KindResult<TransferDataByKind['animation']> {
  if (!isObj(data)) return { ok: false, notes: [note('invalid_item', index, 'data', t('The animation data is missing.'))] };
  const raw: Raw = { ...data, id, name };
  const r = validateAnimationDoc(raw, { v2: 'strict' });
  if (!r.ok) {
    return { ok: false, notes: r.errors.map((e) => note('invalid_item', index, `data${e.path ? `.${e.path}` : ''}`, e.message)) };
  }
  const rest: Raw = { ...r.doc };
  delete rest.id;
  delete rest.name;
  return { ok: true, data: rest as unknown as TransferDataByKind['animation'], notes: [] };
}
