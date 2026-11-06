import { t, m, type MessageIndex } from '../i18n';
// Which dashboard view the card sits in, and how wide the studio canvas should be to match.
// Pure helpers; the view comes from the page URL.

export type ViewKind = 'panel' | 'sections' | 'masonry' | 'sidebar' | 'unknown';
export type CanvasWidthOption = 'narrow' | 'wide' | 'panel';

export interface DetectedView {
  kind: ViewKind;
  /** Why the view is unknown: the label's right-hand text. */
  reason: string;
  /** Sections: the card's `grid_options.columns` of HA's 12, when set. */
  columns?: number;
  /** Sections: how many section columns wide the section is (1 when unknown). */
  span?: number;
  /** Sidebar: the card sits in the side column. */
  sidebar?: boolean;
}

/** What the canvas draws: the radio that is checked, its width (null = fill the canvas) and the label's right side. */
export interface CanvasWidth {
  option: CanvasWidthOption;
  px: number | null;
  /** Right-hand label text; empty for an override (the "Match view" button shows instead). */
  note: string;
  /** Show the "Match view" button (an override of a detected view). */
  canMatch: boolean;
  /** Panel view: HA removes the card border. */
  borderless: boolean;
}

export const OPTION_LABELS: Record<CanvasWidthOption, MessageIndex> = { narrow: m('card-editor.view-detect.narrow'), wide: m('card-editor.view-detect.wide'), panel: m('card-editor.view-detect.panel') };
export const OPTION_PX: Record<'narrow' | 'wide', number> = { narrow: 400, wide: 800 };
export const OPTION_IDS = Object.keys(OPTION_LABELS) as CanvasWidthOption[];
/** The radios' accessible names (design: "Narrow, 400 pixels"). */
export const OPTION_NAMES: Record<CanvasWidthOption, MessageIndex> = {
  narrow: m('card-editor.view-detect.narrow-400-pixels'),
  wide: m('card-editor.view-detect.wide-800-pixels'),
  panel: m('card-editor.view-detect.panel-full-width'),
};

interface ViewLike {
  type?: unknown;
  path?: unknown;
  panel?: unknown;
  strategy?: unknown;
}

const unknown = (reason: string): DetectedView => ({ kind: 'unknown', reason });
const unknownReason = (): string => t("card-editor.view-detect.couldn-t-tell-the-view-type");

/** The view the URL points at: its last segment matches a view `path`, else a view index; none = the first view. */
function viewFromPath(views: ViewLike[], pathname: string): ViewLike | undefined {
  const segs = pathname.split('/').filter(Boolean);
  if (segs.length <= 1) return views[0];
  const last = decodeURIComponent(segs[segs.length - 1]);
  const byPath = views.find((v) => typeof v.path === 'string' && v.path === last);
  if (byPath) return byPath;
  return /^\d+$/.test(last) ? views[Number(last)] : undefined;
}

export function detectView(lovelace: unknown, pathname: string, cardConfig?: Record<string, unknown>): DetectedView {
  const views = (lovelace as { views?: unknown } | undefined)?.views;
  if (!Array.isArray(views) || !views.length) return unknown(unknownReason());
  let view: ViewLike | undefined;
  try {
    view = viewFromPath(views as ViewLike[], pathname);
  } catch {
    return unknown(unknownReason());
  }
  if (!view || typeof view !== 'object' || view.strategy) return unknown(unknownReason());
  const type = typeof view.type === 'string' && view.type ? view.type : view.panel === true ? 'panel' : 'masonry';
  if (type === 'panel' || type === 'masonry') return { kind: type, reason: '' };
  if (type === 'sections') {
    const grid = cardConfig?.grid_options as { columns?: unknown } | undefined;
    const c = grid?.columns;
    const columns = c === 'full' ? 12 : typeof c === 'number' && c >= 1 && c <= 12 ? Math.round(c) : undefined;
    return { kind: 'sections', reason: '', columns, span: 1 };
  }
  if (type === 'sidebar') {
    const pos = (cardConfig?.view_layout as { position?: unknown } | undefined)?.position;
    return { kind: 'sidebar', reason: '', sidebar: pos === 'sidebar' };
  }
  return unknown(t("card-editor.view-detect.view-type-type-isn-t-supported", { type }));
}

/** HA's sections grid: 12 columns with 8 px gaps inside a section of `400 x span + 32 x (span - 1)` px. */
export function sectionCardWidth(columns: number, span = 1): number {
  const w = 400 * span + 32 * (span - 1);
  return Math.round(((w - 11 * 8) / 12) * columns + 8 * (columns - 1));
}

/** The width the studio picks for a view (Auto). */
export function autoWidth(view: DetectedView): CanvasWidth {
  const match = (option: CanvasWidthOption, px: number | null, note: string, borderless = false): CanvasWidth =>
    ({ option, px, note, canMatch: false, borderless });
  switch (view.kind) {
    case 'panel':
      return match('panel', null, t('card-editor.view-detect.matches-this-view-panel'), true);
    case 'masonry':
      return match('narrow', OPTION_PX.narrow, t('card-editor.view-detect.matches-this-view-masonry'));
    case 'sections':
      return view.columns
        ? match('narrow', sectionCardWidth(view.columns, view.span), t('card-editor.view-detect.matches-this-view-sections-columns-of-12', { columns: view.columns }))
        : match('narrow', OPTION_PX.narrow, t('card-editor.view-detect.matches-this-view-sections'));
    case 'sidebar':
      return view.sidebar
        ? match('narrow', 380, t('card-editor.view-detect.matches-this-view-sidebar'))
        : match('wide', OPTION_PX.wide, t('card-editor.view-detect.matches-this-view-sidebar'));
    default:
      return match('narrow', OPTION_PX.narrow, view.reason || unknownReason());
  }
}

/** The user's pick (an override of Auto). `detected` decides whether "Match view" makes sense. */
export function overrideWidth(option: CanvasWidthOption, detected: DetectedView): CanvasWidth {
  return {
    option,
    px: option === 'panel' ? null : OPTION_PX[option],
    note: detected.kind === 'unknown' ? detected.reason || unknownReason() : '',
    canMatch: detected.kind !== 'unknown',
    borderless: false,
  };
}
