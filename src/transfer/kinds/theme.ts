import { CARD_MOD_KEY_RE, contactsOtherHost, decodeCssEscapes, LOCAL_PATH_RE, THEME_PRESET_MAX_BYTES, THEME_VALUE_MAX_CHARS } from '../../contracts/preset-transfer';
import type { TransferDataByKind, TransferNote } from '../../contracts/preset-transfer';
import { THEME_VAR_RE } from '../../contracts/theme-catalogue';
import { t } from '../i18n';
import { compactBytes, isObj, note } from '../types';
import type { KindResult, Raw } from '../types';

/** Host names in a value, after CSS escapes: the part after `://`, a leading `//` or `http:`. */
export function hostsOf(value: string): string[] {
  const re = /(?:\b(?:https?|wss?|ftp):(?!\/)|\/\/)(?:[^\s/@)"'\\]*@)?(\[[0-9a-f:]+\]|[^\s/:?#)"'\\,;]+)/gi;
  return [...new Set([...value.matchAll(re)].map((m) => m[1].toLowerCase()))];
}

/**
 * A theme item: flat variables and/or modes.light / modes.dark. External references and card-mod-*
 * keys are KEPT and listed (CEO 2026-10-18). The theme editor runs its own docErrors afterwards.
 */
export function readTheme(index: number, data: unknown): KindResult<TransferDataByKind['theme']> {
  if (!isObj(data)) return { ok: false, notes: [note('invalid_item', index, 'data', t('The theme data is missing.'))] };
  const notes: TransferNote[] = [];
  let kept = 0;

  const vars = (src: Raw, base: string, label: string): Record<string, string | number> => {
    const out: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(src)) {
      const path = `${base}.${k}`;
      if (!THEME_VAR_RE.test(k)) {
        notes.push(note('dropped_key', index, path, t('"{key}" is not a theme variable name, so it was left out.', { key: k })));
        continue;
      }
      if (typeof v === 'string' ? v.length > THEME_VALUE_MAX_CHARS : !(typeof v === 'number' && Number.isFinite(v))) {
        notes.push(
          note(
            'dropped_value',
            index,
            path,
            typeof v === 'string' ? t('The value of "{key}" is longer than {max} characters, so it was left out.', { key: k, max: THEME_VALUE_MAX_CHARS }) : t('The value of "{key}" is not text or a number, so it was left out.', { key: k }),
          ),
        );
        continue;
      }
      out[k] = v as string | number;
      kept++;
      if (CARD_MOD_KEY_RE.test(k)) notes.push(note('card_mod', index, path, label ? t('{mode} mode: "{key}" is a card-mod style. It was kept; it runs CSS on your dashboard.', { mode: label, key: k }) : t('"{key}" is a card-mod style. It was kept; it runs CSS on your dashboard.', { key: k })));
      if (typeof v === 'string') {
        if (contactsOtherHost(v)) {
          const hosts = hostsOf(decodeCssEscapes(v));
          notes.push(note('external_ref', index, path, label ? t('{mode} mode: "{key}" points to {hosts}. It was kept; your browser will contact it.', { mode: label, key: k, hosts: hosts.length ? hosts.join(', ') : t('another host') }) : t('"{key}" points to {hosts}. It was kept; your browser will contact it.', { key: k, hosts: hosts.length ? hosts.join(', ') : t('another host') }), hosts));
        } else if (LOCAL_PATH_RE.test(v)) {
          notes.push(note('local_path', index, path, label ? t('{mode} mode: "{key}" uses a file on the sharer\'s Home Assistant. It may not exist on your system.', { mode: label, key: k }) : t('"{key}" uses a file on the sharer\'s Home Assistant. It may not exist on your system.', { key: k })));
        }
      }
    }
    return out;
  };

  const out: Raw = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === 'modes') {
      if (!isObj(v)) {
        notes.push(note('dropped_value', index, 'data.modes', t('"modes" must hold light and dark, so it was left out.')));
        continue;
      }
      const modes: Raw = {};
      for (const [m, mv] of Object.entries(v)) {
        if ((m !== 'light' && m !== 'dark') || !isObj(mv)) {
          notes.push(note('dropped_key', index, `data.modes.${m}`, t('"modes.{key}" is not light or dark, so it was left out.', { key: m })));
          continue;
        }
        modes[m] = vars(mv, `data.modes.${m}`, m === 'light' ? t('Light') : t('Dark'));
      }
      out.modes = modes;
    } else if (isObj(v) || Array.isArray(v)) {
      notes.push(note('dropped_value', index, `data.${k}`, t('The value of "{key}" is not text or a number, so it was left out.', { key: k })));
    } else {
      Object.assign(out, vars({ [k]: v }, 'data', ''));
    }
  }
  if (!kept) return { ok: false, notes: [...notes, note('invalid_item', index, 'data', t('The theme has no variables.'))] };
  if (compactBytes(out) > THEME_PRESET_MAX_BYTES) {
    return { ok: false, notes: [note('invalid_item', index, 'data', t('The theme is larger than {kb} KB.', { kb: THEME_PRESET_MAX_BYTES / 1024 }))] };
  }
  return { ok: true, data: out as TransferDataByKind['theme'], notes };
}
