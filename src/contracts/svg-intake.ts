import { MAX_IMAGE_IMPORT_BYTES } from './image-editor';

/*
 * Contract: SVG and preset file intake. Version 1.0.0 (SVG_INTAKE_CONTRACT).
 * One front door for files and pasted text that end up in an SVG sanitiser or the preset parser. It checks type and
 * size before anything is read, reads the text, and returns codes. It never sanitises, never parses markup and never
 * words a message: every caller sends the text on to its own sanitiser and words the codes in its own i18n namespace,
 * with the words that caller already uses.
 *
 * ── Module ──
 * src/svg-io/intake.ts. Stateless (no module-level `let`, no cache, policies frozen), so its copies in several chunks
 * hold no state. No DOM access, no element, no SVG sink. Imports src/contracts/** only.
 * Callers and their policy:
 *   - <mc-svg-editor> start window, Open file (icon profile)        ICON_SVG_INTAKE, then sanitizeSvg
 *   - <mc-svg-editor> image start window, Open file (image profile) IMAGE_SVG_INTAKE, then the image-svg source
 *   - image-editor Import (into the open drawing)                   IMAGE_SVG_INTAKE, then sanitizeImage file mode
 *   - animation studio Draw, Import SVG                             ICON_SVG_INTAKE, then sanitizeSvg
 *   - card editor icon effects, upload                              ICON_SVG_INTAKE, then sanitizeSvg
 *   - <mc-transfer-panel>                                           transferIntake(accept) in the transfer chunk
 *                                                                   (preset-transfer "Safe parsing"), then parseTransfer
 * There is no shared default policy: every call names one.
 *
 * ── refuseFile(file, policy) ──
 * Order, all before file.text():
 *   1. type: the policy entry whose extensions hold the file name's last extension (case-insensitive); else the first
 *      entry whose mimeTypes hold file.type (lower-case, exact); else `other` when the policy has it; else
 *      'wrong_type'. An empty file.type with an extension no entry lists is 'wrong_type' unless `other` is set.
 *   2. size: file.size over the matched entry's maxBytes -> 'too_large'.
 * The returned refusal carries the matched maxBytes for the message ("over 8 MB").
 *
 * ── readFile(file, policy) ──
 * refuseFile first; then file.text() (a rejection is 'unreadable'). Returns the text, the matched kind and the size.
 * The text is untrusted and goes to a sanitiser or the safe parser in the same code path.
 *
 * ── refuseText(text, maxChars) ──
 * Pasted text: '' after trim -> 'empty'; text.length over maxChars -> 'too_large' (a cheap bound before any encode or
 * parse; the sanitiser's own byte cap follows).
 *
 * ── File names decide ──
 * A file's name decides what its text must be: a file named .svg must hold SVG, and a file named .json must hold JSON.
 * Only pasted text, which has no file name, is detected by its content. A .svg file whose trimmed text starts with
 * `{` or `[` holds JSON, and a .json file whose text looksLikeSvg holds SVG: the caller refuses either one with its own
 * words ("This file is named .svg but holds JSON, not SVG.", "This file is named .json but holds SVG, not JSON."),
 * saves nothing, and never reads the text as the other kind. The check runs on the read text, before any parser or
 * sanitiser sees it. A .svg file that holds neither goes to the sanitiser, which refuses it as not SVG.
 *
 * ── looksLikeSvg(text, fileName?) ──
 * True for a .svg file name (case-insensitive). Otherwise true when the text's first element is <svg after optional
 * whitespace, a byte order mark, an XML declaration, a doctype and comments; the scan is linear in the text length.
 * Callers apply "File names decide" first, so a .json file never reaches a sanitiser through this test.
 *
 * ── Hostile tests (first) ──
 * A .svg file of policy maxBytes + 1 is refused without file.text() being called; JSON in a file named .svg and SVG
 * in a file named .json are refused with the name message and reach no parser and no sanitiser; pasted SVG text and
 * pasted JSON text are read as their content says; an unreadable file gives 'unreadable'; a refused file leaves the
 * caller's document unchanged.
 */

export const SVG_INTAKE_CONTRACT = '1.0.0';

/** Same number as src/icons/svg-sanitize.ts SVG_MAX_BYTES (a test keeps them equal). */
export const ICON_SVG_MAX_FILE_BYTES = 32 * 1024;

export type IntakeKind = 'svg' | 'json' | 'yaml' | 'other';

export interface IntakeType {
  readonly kind: Exclude<IntakeKind, 'other'>;
  /** Lower-case, with the dot. */
  readonly extensions: readonly string[];
  readonly mimeTypes: readonly string[];
  readonly maxBytes: number;
}

export interface IntakePolicy {
  readonly types: readonly IntakeType[];
  /** Files no entry matches are still taken as kind 'other' up to this size (the transfer panel; the parser decides). */
  readonly other?: { readonly maxBytes: number };
}

export type IntakeRefusal = { code: 'wrong_type' } | { code: 'too_large'; maxBytes: number };

export type IntakeRead =
  | { ok: true; text: string; kind: IntakeKind; bytes: number; name: string }
  | ({ ok: false } & (IntakeRefusal | { code: 'unreadable' }));

/** The File fields intake reads (a File passes). */
export interface IntakeFile {
  readonly name: string;
  readonly type: string;
  readonly size: number;
  text(): Promise<string>;
}

export const SVG_TYPE: Omit<IntakeType, 'maxBytes'> = Object.freeze({
  kind: 'svg',
  extensions: Object.freeze(['.svg']),
  mimeTypes: Object.freeze(['image/svg+xml']),
});

/** Own icons: the icon sanitiser's size. */
export const ICON_SVG_INTAKE: IntakePolicy = Object.freeze({
  types: Object.freeze([Object.freeze({ ...SVG_TYPE, maxBytes: ICON_SVG_MAX_FILE_BYTES })]),
});

/** Library images: the 8 MB file gate (MAX_IMAGE_IMPORT_BYTES); sanitizeImage's IMAGE_MAX_BYTES still applies after it. */
export const IMAGE_SVG_INTAKE: IntakePolicy = Object.freeze({
  types: Object.freeze([Object.freeze({ ...SVG_TYPE, maxBytes: MAX_IMAGE_IMPORT_BYTES })]),
});

/** What src/svg-io/intake.ts exports. */
export interface SvgIntake {
  refuseFile(file: Pick<IntakeFile, 'name' | 'type' | 'size'>, policy: IntakePolicy): IntakeRefusal | undefined;
  readFile(file: IntakeFile, policy: IntakePolicy): Promise<IntakeRead>;
  refuseText(text: string, maxChars: number): 'empty' | 'too_large' | undefined;
  looksLikeSvg(text: string, fileName?: string): boolean;
}
