// Heights a lazy module's placeholder reserves, estimated from its config, so the page does not
// move when the chunk arrives. Pure and synchronous; estimates, not layout.

/** Heading font scale and its (equal) margin in em of the heading's own size: h1..h6. */
const HEADING = [
  [2, 0.67],
  [1.5, 0.83],
  [1.17, 1],
  [1, 1.33],
  [0.83, 1.67],
  [0.67, 2.33],
];
const LINE = 1.5;
const TABLE_ROW = 1.83;
/** The tab bar in px by style: default, pills, underline. */
const TABS_BAR = [39, 36, 41];

/**
 * Height in em of the markdown text `content` renders to: a line is 1.5 em (line breaks count, long
 * lines are not wrapped), blocks sit 1 em apart, headings and table rows have their own sizes. The first
 * block's top margin and the last block's bottom margin leave the box and are counted, because the module
 * wrapper that holds the box grows by them. Template lines count as one line each; the result is at least one line.
 */
export function markdownMinHeightEm(content: unknown): number {
  const lines = String(content ?? '').split('\n');
  let total = 0;
  let gap = 0; // margin below the block before
  let first = -1; // margin above the first block
  let kind = '';
  let open = false;
  let inCode = false;
  let headings = 0;
  const add = (h: number, top: number, bottom: number, key: string) => {
    if (open && key === kind) {
      total += h;
    } else {
      if (first < 0) first = top;
      total += (total ? Math.max(gap, top) : 0) + h;
      kind = key;
    }
    gap = bottom;
    open = true;
  };
  for (const raw of lines) {
    const l = raw.trim();
    if (l.startsWith('```')) {
      inCode = !inCode;
      open = false;
      continue;
    }
    if (inCode) {
      add(LINE, 1, 1, 'code');
      continue;
    }
    if (!l || /^\{%.*%\}$/.test(l)) {
      open = false;
      continue;
    }
    const head = /^(#{1,6})\s/.exec(l);
    if (head) {
      const [scale, margin] = HEADING[head[1].length - 1];
      add(LINE * scale, margin * scale, margin * scale, 'h' + ++headings);
      open = false;
    } else if (l.startsWith('|')) {
      if (!/^[|\s:-]+$/.test(l)) add(TABLE_ROW, 0, 0, 'table');
      else open = true;
    } else add(LINE, 1, 1, /^([-*+]|\d+\.)\s/.test(l) ? 'list' : 'p');
  }
  return Math.max(LINE, Math.round((total + Math.max(first, 0) + gap) * 100) / 100);
}

/** Height in px of the weather module's current-conditions row: the icon, plus temperature and condition beside it. */
export function weatherMinHeight(config: { show_temperature?: boolean; show_condition?: boolean; show_forecast?: boolean }): number {
  const temp = config.show_temperature !== false;
  const cond = config.show_condition !== false;
  const now = temp && cond ? 67 : temp ? 40 : 36;
  // the forecast row under it: the daily forecast of the weather module shows temperatures, no precipitation
  return config.show_forecast ? now + 14 + forecastMinHeight({ show_temperature: true, show_precipitation: false }) : now;
}

/** Height in px of the forecast module's row of days, from the rows each day shows (label, icon, temperature, low, precipitation). */
export function forecastMinHeight(config: { forecast_type?: string; show_temperature?: boolean; show_precipitation?: boolean }): number {
  const temp = config.show_temperature !== false;
  const label = config.forecast_type === 'twice_daily' ? 36 : 18;
  const low = temp && !config.forecast_type?.match(/hourly|twice/) ? 22 : 0;
  return 16 + label + 29 + (temp ? 23 : 0) + low + (config.show_precipitation !== false ? 19 : 0);
}

/** Height in px of the tabs module's tab bar (it depends on the style); the tab content sits below it and has no reserve. */
export function tabsMinHeight(config: { tab_style?: string; design?: { height?: unknown; min_height?: unknown } | null }): number {
  const d = config.design;
  if (d && (d.height !== undefined || d.min_height !== undefined)) return 0;
  return TABS_BAR[config.tab_style === 'pills' ? 1 : config.tab_style === 'underline' ? 2 : 0];
}

/**
 * The clock module's `min-height` as a CSS length, or '' for none. Time line 2 rem plus date line
 * 0.875 rem, times the line height (a number, numeric string or length; otherwise 1.17).
 */
export function clockMinHeight(config: { show_date?: boolean; design?: { height?: unknown; min_height?: unknown; line_height?: unknown } | null }): string {
  const d = config.design;
  if (d && (d.height !== undefined || d.min_height !== undefined)) return '';
  const date = config.show_date !== false;
  const lh = d?.line_height;
  const lines = date ? 2 : 1;
  // the pattern admits finite non-negative numbers only (NaN and Infinity do not match, nor does a string over
  // 16 characters); the unit is its own alternation, so only a number and px, em or rem reach the style; a percentage becomes em
  const m = /^(\d+(?:\.\d+)?|\.\d+)(px|em|rem|%)?$/.exec(typeof lh === 'number' ? String(lh) : typeof lh === 'string' && lh.length < 17 ? lh.trim() : '');
  const n = m ? +m[1] : 0;
  const unit = m?.[2];
  return n > 0 && unit ? `calc(${unit === '%' ? `${n / 100}em` : n + unit} * ${lines})` : `calc(${date ? '2.875rem' : '2rem'} * ${n > 0 ? n : 1.17})`;
}
