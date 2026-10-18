import { validateAnimationDoc } from '../../anim-studio/model';
import { validateSim } from '../../particles/validate';
import type { TransferDataByKind } from '../../contracts/preset-transfer';
import { isObj, note } from '../types';
import type { KindResult, Raw } from '../types';

/**
 * An animation item: the document strict-validated with the item's id and name (authoritative).
 * v2 fields are checked when the v2 validators are registered by the host bundle; `particles.sim`
 * is always checked here with validateSim.
 */
export function readAnimation(index: number, id: string, name: string, data: unknown): KindResult<TransferDataByKind['animation']> {
  if (!isObj(data)) return { ok: false, notes: [note('invalid_item', index, 'data', 'The animation data is missing.')] };
  const raw: Raw = { ...data, id, name };
  const r = validateAnimationDoc(raw, { v2: 'strict' });
  const errors = r.ok ? [] : r.errors.map((e) => ({ path: e.path, message: e.message }));
  const particles = isObj(raw.particles) ? raw.particles : undefined;
  if (particles && particles.sim !== undefined && !particles.preset) {
    const s = validateSim(particles.sim, 'strict');
    errors.push(...s.errors.map((e) => ({ path: e.path, message: e.message })));
  }
  if (!r.ok || errors.length) {
    return { ok: false, notes: errors.map((e) => note('invalid_item', index, `data${e.path ? `.${e.path}` : ''}`, e.message)) };
  }
  const rest: Raw = { ...r.doc };
  delete rest.id;
  delete rest.name;
  return { ok: true, data: rest as unknown as TransferDataByKind['animation'], notes: [] };
}
