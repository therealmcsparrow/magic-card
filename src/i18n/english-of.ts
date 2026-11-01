import { fmtIn } from './runtime';

/** English text of a message with its arguments filled in, without a pseudo wrap on the message. */
export const englishOf = (en: string, args: Record<string, string | number> = {}): string => fmtIn('en-GB', en, args).join('');
