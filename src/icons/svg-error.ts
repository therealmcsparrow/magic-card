import { SVG_MAX_BYTES, TOO_COMPLEX } from './svg-sanitize';

/**
 * What went wrong when `sanitizeSvg` (or the SVG editor's importer) refused an SVG. The sanitiser reports plain
 * British sentences; each place that shows one maps the kind to a message in its own i18n namespace with a literal
 * t() call, so the text follows the user's language.
 */
export type SvgErrorKind = 'size' | 'not-svg' | 'complex' | 'no-shapes' | 'other';

export function svgErrorKind(error: string | undefined): SvgErrorKind {
  if (!error) return 'other';
  if (error === TOO_COMPLEX) return 'complex';
  if (error === 'No <svg> element found.') return 'not-svg';
  if (error === 'The SVG has no shapes to draw.') return 'no-shapes';
  if (error.startsWith('The SVG is larger than') || error.includes(`${SVG_MAX_BYTES / 1024} KB`)) return 'size';
  return 'other';
}
