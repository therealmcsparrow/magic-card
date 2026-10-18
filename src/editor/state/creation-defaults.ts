import type { CardModule } from '../../types';
import { t } from '../i18n';

/*
 * The text a new module is created with ("Hello World", "Tab 1", "Button") is English in magic-card.js: its
 * createDefault() cannot call the editor's tables (the dashboard bundle holds no editor text). The editor
 * writes it in the language of the person editing: the value lands in the config and stays as typed.
 */

type Loose = Record<string, unknown>;

/** The module the registry made, with its default text in the editor's language (same object). */
export function localiseCreationDefaults<M extends CardModule>(mod: M): M {
  const o = mod as unknown as Loose;
  if (mod.type === 'text' && o.text === 'Hello World') o.text = t('Hello World');
  else if (mod.type === 'button' && o.label === 'Button') o.label = t('Button');
  else if (mod.type === 'tabs' && Array.isArray(o.tabs)) {
    (o.tabs as Array<{ label?: string }>).forEach((tab, i) => {
      if (tab.label === `Tab ${i + 1}`) tab.label = t('Tab {n}', { n: i + 1 });
    });
  }
  return mod;
}
