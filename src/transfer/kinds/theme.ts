import { CARD_MOD_KEY_RE, EXTERNAL_REF_RE, LOCAL_PATH_RE, THEME_PRESET_MAX_BYTES, THEME_VALUE_MAX_CHARS } from '../../contracts/preset-transfer';
import type { TransferDataByKind, TransferNote } from '../../contracts/preset-transfer';
import { THEME_VAR_RE } from '../../contracts/theme-catalogue';
import { compactBytes, isObj, note } from '../types';
import type { KindResult, Raw } from '../types';

/** Host names in a value: the part after `://` or a leading `//`. */
export function hostsOf(value: string): string[] {
  const out = new Set<string>();
  for (const m of value.matchAll(/(?:[a-z][a-z0-9+.-]*:)?\/\/(?:[^\s/@)"'\\]*@)?(\[[0-9a-f:]+\]|[^\s/:?#)"'\\,;]+)/gi)) out.add(m[1].toLowerCase());
  return [...out];
}

/**
 * A theme item: flat variables and/or modes.light / modes.dark. External references and card-mod-*
 * keys are KEPT and listed (CEO 2026-10-18). The theme editor runs its own docErrors afterwards.
 */
export function readTheme(index: number, data: unknown): KindResult<TransferDataByKind['theme']> {
  if (!isObj(data)) return { ok: false, notes: [note('invalid_item', index, 'data', 'The theme data is missing.')] };
  const notes: TransferNote[] = [];
  let kept = 0;

  const vars = (src: Raw, base: string, label: string): Record<string, string | number> => {
    const out: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(src)) {
      const path = `${base}.${k}`;
      if (!THEME_VAR_RE.test(k)) {
        notes.push(note('dropped_key', index, path, `"${k}" is not a theme variable name, so it was left out.`));
        continue;
      }
      if (typeof v === 'string' ? v.length > THEME_VALUE_MAX_CHARS : !(typeof v === 'number' && Number.isFinite(v))) {
        notes.push(
          note(
            'dropped_value',
            index,
            path,
            typeof v === 'string' ? `The value of "${k}" is longer than ${THEME_VALUE_MAX_CHARS} characters, so it was left out.` : `The value of "${k}" is not text or a number, so it was left out.`,
          ),
        );
        continue;
      }
      out[k] = v as string | number;
      kept++;
      if (CARD_MOD_KEY_RE.test(k)) notes.push(note('card_mod', index, path, `${label}"${k}" is a card-mod style. It was kept; it runs CSS on your dashboard.`));
      if (typeof v === 'string') {
        if (EXTERNAL_REF_RE.test(v)) {
          const hosts = hostsOf(v);
          notes.push(note('external_ref', index, path, `${label}"${k}" points to ${hosts.length ? hosts.join(', ') : 'another host'}. It was kept; your browser will contact it.`, hosts));
        } else if (LOCAL_PATH_RE.test(v)) {
          notes.push(note('local_path', index, path, `${label}"${k}" uses a file on the sharer's Home Assistant. It may not exist on your system.`));
        }
      }
    }
    return out;
  };

  const out: Raw = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === 'modes') {
      if (!isObj(v)) {
        notes.push(note('dropped_value', index, 'data.modes', '"modes" must hold light and dark, so it was left out.'));
        continue;
      }
      const modes: Raw = {};
      for (const [m, mv] of Object.entries(v)) {
        if ((m !== 'light' && m !== 'dark') || !isObj(mv)) {
          notes.push(note('dropped_key', index, `data.modes.${m}`, `"modes.${m}" is not light or dark, so it was left out.`));
          continue;
        }
        modes[m] = vars(mv, `data.modes.${m}`, `${m} mode: `);
      }
      out.modes = modes;
    } else if (isObj(v) || Array.isArray(v)) {
      notes.push(note('dropped_value', index, `data.${k}`, `The value of "${k}" is not text or a number, so it was left out.`));
    } else {
      Object.assign(out, vars({ [k]: v }, 'data', ''));
    }
  }
  if (!kept) return { ok: false, notes: [...notes, note('invalid_item', index, 'data', 'The theme has no variables.')] };
  if (compactBytes(out) > THEME_PRESET_MAX_BYTES) {
    return { ok: false, notes: [note('invalid_item', index, 'data', `The theme is larger than ${THEME_PRESET_MAX_BYTES / 1024} KB.`)] };
  }
  return { ok: true, data: out as TransferDataByKind['theme'], notes };
}
