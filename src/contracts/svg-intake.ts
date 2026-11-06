// Contract: SVG and preset file intake. Version 1.1.0 (SVG_INTAKE_CONTRACT). One front door for files and pasted
// text that end up in an SVG sanitiser or the preset parser. It checks type and size before anything is read,
// reads the text, and returns codes.

export const SVG_INTAKE_CONTRACT = '1.1.0';

/** Same number as src/icons/svg-sanitize.ts SVG_MAX_BYTES (a test keeps them equal). */
export const ICON_SVG_MAX_FILE_BYTES = 32 * 1024;

/** Same number as MAX_IMAGE_IMPORT_BYTES in src/contracts/image-editor.ts (a test keeps them equal; a value import would carry that whole file into every chunk that reads an icon file). */
export const IMAGE_SVG_MAX_FILE_BYTES = 8 * 1024 * 1024;

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

/** Library images: the 8 MB file gate (IMAGE_SVG_MAX_FILE_BYTES); sanitizeImage's IMAGE_MAX_BYTES still applies after it. */
export const IMAGE_SVG_INTAKE: IntakePolicy = Object.freeze({
  types: Object.freeze([Object.freeze({ ...SVG_TYPE, maxBytes: IMAGE_SVG_MAX_FILE_BYTES })]),
});

/** What src/svg-io/intake.ts exports. */
export interface SvgIntake {
  refuseFile(file: Pick<IntakeFile, 'name' | 'type' | 'size'>, policy: IntakePolicy): IntakeRefusal | undefined;
  readFile(file: IntakeFile, policy: IntakePolicy): Promise<IntakeRead>;
  refuseText(text: string, maxChars: number): 'empty' | 'too_large' | undefined;
  looksLikeSvg(text: string, fileName?: string): boolean;
}
