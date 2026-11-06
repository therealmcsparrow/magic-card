import type { MessageIndex } from '../../contracts/i18n';
import type { Keys } from './keys.gen';

/** lm('labels.<file>.<text>'): marks editor-only label data; the build rewrites it to a table number. */
export const lm = ((key: keyof Keys & string) => key) as unknown as <K extends keyof Keys & string>(key: K) => MessageIndex;
