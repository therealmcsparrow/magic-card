import { CARD_MOD_KEY_RE, contactsOtherHost, externalHosts, LOCAL_PATH_RE, THEME_PRESET_MAX_BYTES, THEME_VALUE_MAX_CHARS } from '../../contracts/preset-transfer';
import type { TransferDataByKind, TransferNote } from '../../contracts/preset-transfer';
import { THEME_VAR_RE } from '../../contracts/theme-catalogue';
import { t } from '../i18n';
import { compactBytes, isObj, note } from '../types';
import type { KindResult, Raw } from '../types';

/** Host names in a value, as the browser resolves them. */
export function hostsOf(value: string): string[] {
  return externalHosts(value).hosts;
}

/**
 * A theme item: flat variables and/or modes.light / modes.dark. External references and card-mod-*
 * keys are KEPT and listed. The theme editor runs its own docErrors afterwards.
 */
export function readTheme(index: number, data: unknown): KindResult<TransferDataByKind['theme']> {
  if (!isObj(data)) return { ok: false, notes: [note('invalid_item', index, 'data', t('transfer.theme.the-theme-data-is-missing'))] };
  const notes: TransferNote[] = [];
  let kept = 0;

  const vars = (src: Raw, base: string, label: string): Record<string, string | number> => {
    const out: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(src)) {
      const path = `${base}.${k}`;
      if (!THEME_VAR_RE.test(k)) {
        notes.push(note('dropped_key', index, path, t('transfer.theme.key-is-not-a-theme-variable-name-so-it', { key: k })));
        continue;
      }
      if (typeof v === 'string' ? v.length > THEME_VALUE_MAX_CHARS : !(typeof v === 'number' && Number.isFinite(v))) {
        notes.push(
          note(
            'dropped_value',
            index,
            path,
            typeof v === 'string' ? t('transfer.theme.the-value-of-key-is-longer-than-max', { key: k, max: THEME_VALUE_MAX_CHARS }) : t('transfer.theme.the-value-of-key-is-not-text-or-a-number', { key: k }),
          ),
        );
        continue;
      }
      out[k] = v as string | number;
      kept++;
      if (CARD_MOD_KEY_RE.test(k)) notes.push(note('card_mod', index, path, label ? t('transfer.theme.mode-mode-key-is-a-card-mod-style-it-was', { mode: label, key: k }) : t('transfer.theme.key-is-a-card-mod-style-it-was-kept-with', { key: k })));
      if (typeof v === 'string') {
        if (contactsOtherHost(v)) {
          const { hosts: found, unknown } = externalHosts(v);
          const hosts = unknown ? [] : found;
          notes.push(note('external_ref', index, path, label ? t('transfer.theme.mode-mode-key-points-to-hosts-it-was', { mode: label, key: k, hosts: hosts.length ? hosts.join(', ') : t('transfer.theme.another-website') }) : t('transfer.theme.key-points-to-hosts-it-was-kept-every', { key: k, hosts: hosts.length ? hosts.join(', ') : t('transfer.theme.another-website') }), hosts));
        } else if (LOCAL_PATH_RE.test(v)) {
          notes.push(note('local_path', index, path, label ? t('transfer.theme.mode-mode-key-uses-a-file-on-the-sharer', { mode: label, key: k }) : t('transfer.theme.key-uses-a-file-on-the-sharer-s-home', { key: k })));
        }
      }
    }
    return out;
  };

  const out: Raw = {};
  for (const [k, v] of Object.entries(data)) {
    if (k === 'modes') {
      if (!isObj(v)) {
        notes.push(note('dropped_value', index, 'data.modes', t('transfer.theme.modes-must-hold-light-and-dark-so-it-was')));
        continue;
      }
      const modes: Raw = {};
      for (const [m, mv] of Object.entries(v)) {
        if ((m !== 'light' && m !== 'dark') || !isObj(mv)) {
          notes.push(note('dropped_key', index, `data.modes.${m}`, t('transfer.theme.modes-key-is-not-light-or-dark-so-it-was', { key: m })));
          continue;
        }
        modes[m] = vars(mv, `data.modes.${m}`, m === 'light' ? t('transfer.theme.light') : t('transfer.theme.dark'));
      }
      out.modes = modes;
    } else if (isObj(v) || Array.isArray(v)) {
      notes.push(note('dropped_value', index, `data.${k}`, t('transfer.theme.the-value-of-key-is-not-text-or-a-number', { key: k })));
    } else {
      Object.assign(out, vars({ [k]: v }, 'data', ''));
    }
  }
  if (!kept) return { ok: false, notes: [...notes, note('invalid_item', index, 'data', t('transfer.theme.the-theme-has-no-variables'))] };
  if (compactBytes(out) > THEME_PRESET_MAX_BYTES) {
    return { ok: false, notes: [note('invalid_item', index, 'data', t('transfer.theme.the-theme-is-larger-than-kb-kb', { kb: THEME_PRESET_MAX_BYTES / 1024 }))] };
  }
  return { ok: true, data: out as TransferDataByKind['theme'], notes };
}
