import type { TransferNote, TransferNoteCode } from '../contracts/preset-transfer';

/** What a per-kind validator returns for one item: the cleaned data, or the reasons it was refused. */
export type KindResult<D = unknown> = { ok: true; data: D; notes: TransferNote[] } | { ok: false; notes: TransferNote[] };

export type Raw = Record<string, unknown>;

export const isObj = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v);

export function note(code: TransferNoteCode, item: number, path: string, message: string, hosts?: string[], unknown?: boolean): TransferNote {
  const n: TransferNote = hosts ? { code, item, path, message, hosts } : { code, item, path, message };
  if (unknown) n.unknown = true;
  return n;
}

export const compactBytes = (v: unknown): number => new TextEncoder().encode(JSON.stringify(v)).length;
