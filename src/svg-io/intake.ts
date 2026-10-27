import type { IntakeFile, IntakeKind, IntakePolicy, IntakeRead, IntakeRefusal } from '../contracts/svg-intake';

/*
 * File and pasted-text intake for SVG and preset files: the type and the size are checked before anything is read, and
 * the result is a code. The text is not sanitised here, and no message is worded here.
 */

type Matched = { kind: IntakeKind; maxBytes: number };

/** The policy entry for a file (by the last extension of its name, then by its type, then the policy's `other`) or the refusal. */
function check(file: Pick<IntakeFile, 'name' | 'type' | 'size'>, policy: IntakePolicy): Matched | IntakeRefusal {
  const dot = file.name.lastIndexOf('.');
  const ext = file.name.slice(dot < 0 ? file.name.length : dot).toLowerCase();
  const m: Matched | undefined =
    policy.types.find((e) => e.extensions.includes(ext)) ?? policy.types.find((e) => e.mimeTypes.includes(file.type)) ?? (policy.other && { kind: 'other', ...policy.other });
  return !m ? { code: 'wrong_type' } : file.size > m.maxBytes ? { code: 'too_large', maxBytes: m.maxBytes } : m;
}

export function refuseFile(file: Pick<IntakeFile, 'name' | 'type' | 'size'>, policy: IntakePolicy): IntakeRefusal | undefined {
  const m = check(file, policy);
  return 'code' in m ? m : undefined;
}

export async function readFile(file: IntakeFile, policy: IntakePolicy): Promise<IntakeRead> {
  const m = check(file, policy);
  if ('code' in m) return { ok: false, ...m };
  try {
    return { ok: true, text: await file.text(), kind: m.kind, bytes: file.size, name: file.name };
  } catch {
    return { ok: false, code: 'unreadable' };
  }
}

/** Pasted text: nothing but white space, or longer than `maxChars` (a bound before any encode or parse). */
export function refuseText(text: string, maxChars: number): 'empty' | 'too_large' | undefined {
  return text.trim() ? (text.length > maxChars ? 'too_large' : undefined) : 'empty';
}

export { looksLikeSvg } from './looks-like-svg';
