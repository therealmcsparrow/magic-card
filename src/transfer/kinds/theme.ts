import { CARD_MOD_KEY_RE, contactsOtherHost, decodeCssEscapes, externalHosts, THEME_PRESET_MAX_BYTES, THEME_VALUE_MAX_CHARS } from '../../contracts/preset-transfer';
import type { TransferDataByKind, TransferNote } from '../../contracts/preset-transfer';
import type { ShareKit, ValueRefusal } from '../../contracts/share-kit';
import { THEME_VAR_RE } from '../../contracts/theme-catalogue';
import { t } from '../i18n';
import { compactBytes, isObj, note } from '../types';
import type { KindResult, Raw } from '../types';

/** Host names in a value, as the browser resolves them. */
export function hostsOf(value: string): string[] {
  return externalHosts(value).hosts;
}

/**
 * A theme item: flat variables and/or modes.light / modes.dark. Each value is checked by its key's types; a value
 * that fits none is dropped and listed, a break-out marker refuses the file. card-mod-* keys are kept and listed.
 */
export function readTheme(index: number, data: unknown, kit: ShareKit): KindResult<TransferDataByKind['theme']> {
  if (!isObj(data)) return { ok: false, notes: [note('invalid_item', index, 'data', t('transfer.theme.the-theme-data-is-missing'))] };
  const notes: TransferNote[] = [];
  let kept = 0;
  let refusal: ValueRefusal | undefined;

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
      const verdict = kit.themeValue(k, v);
      if (verdict.verdict === 'refused') {
        refusal ??= { item: index, path, rule: verdict.rule };
        continue;
      }
      if (verdict.verdict === 'dropped') {
        const hosts = typeof v === 'string' && contactsOtherHost(v) ? hostsOf(decodeCssEscapes(v)) : [];
        const text = hosts.length
          ? t('transfer.theme.key-points-to-hosts-so-its-value-was-left-out-rule', { key: k, hosts: hosts.join(', '), rule: verdict.rule })
          : t('transfer.theme.the-value-of-key-fits-no-allowed-type-so-it', { key: k, rule: verdict.rule });
        notes.push({ ...note('dropped_value', index, path, text, hosts.length ? hosts : undefined), rule: verdict.rule });
        continue;
      }
      out[k] = v as string | number;
      kept++;
      if (CARD_MOD_KEY_RE.test(k)) notes.push(note('card_mod', index, path, label ? t('transfer.theme.mode-mode-key-is-a-card-mod-style-it-was', { mode: label, key: k }) : t('transfer.theme.key-is-a-card-mod-style-it-was-kept-with', { key: k })));
      if (typeof v === 'string') {
        if (contactsOtherHost(v, k)) {
          const { hosts, unknown } = CARD_MOD_KEY_RE.test(k) ? { hosts: [], unknown: true } : externalHosts(v);
          const named = unknown || !hosts.length ? t('transfer.theme.another-website') : hosts.join(', ');
          notes.push(note('external_ref', index, path, label ? t('transfer.theme.mode-mode-key-points-to-hosts-it-was', { mode: label, key: k, hosts: named }) : t('transfer.theme.key-points-to-hosts-it-was-kept-every', { key: k, hosts: named }), hosts, unknown));
        } else if (verdict.note === 'local_path') {
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
  if (refusal) return { ok: false, notes, refusal };
  if (!kept) return { ok: false, notes: [...notes, note('invalid_item', index, 'data', t('transfer.theme.the-theme-has-no-variables'))] };
  if (compactBytes(out) > THEME_PRESET_MAX_BYTES) {
    return { ok: false, notes: [note('invalid_item', index, 'data', t('transfer.theme.the-theme-is-larger-than-kb-kb', { kb: THEME_PRESET_MAX_BYTES / 1024 }))] };
  }
  return { ok: true, data: out as TransferDataByKind['theme'], notes };
}
