// Design key -> CSS property for every key designToStyle writes, in cascade order. A flag after
// `:` marks the key's type and the unit a bare number gets: `c` colour, `i` image, `p` px, `s` s.
const DESIGN_TABLE =
  'margin:p padding:p width:p height:p min_width:p min_height:p max_width:p max_height:p box_sizing ' +
  'border border_top border_right border_bottom border_left border_width:p border_style border_color:c border_radius:p ' +
  'outline outline_width:p outline_style outline_color:c outline_offset:p box_shadow ' +
  'position top:p right:p bottom:p left:p inset:p display visibility opacity z_index overflow overflow_x overflow_y float clear cursor pointer_events ' +
  'font_family font_size:p font_weight font_style font_variant color:c text_align text_decoration text_transform text_indent:p ' +
  'text_overflow text_shadow line_height letter_spacing:p word_spacing:p white_space word_break overflow_wrap ' +
  'background background_color:c background_image:i background_position background_size background_repeat background_attachment ' +
  'background_clip background_origin backdrop_filter ' +
  'flex_direction flex_wrap justify_content align_items align_content gap:p row_gap:p column_gap:p flex flex_grow flex_shrink flex_basis:p align_self order ' +
  'grid_template_columns grid_template_rows grid_template_areas grid_auto_columns grid_auto_rows grid_auto_flow grid_column grid_row grid_area ' +
  'transition transition_property transition_duration:s transition_timing_function transition_delay:s transform transform_origin ' +
  'animation_name animation_duration:s animation_timing_function animation_delay:s animation_iteration_count animation_direction ' +
  'animation_fill_mode animation_play_state filter ' +
  'list_style list_style_type list_style_position list_style_image border_collapse border_spacing:p table_layout caption_side';

const toCss = (key: string): string => key.replace(/_/g, '-');

/**
 * Per-side longhands of the `box` properties, as written by mc-box-field (design key → CSS property).
 * They are not separate fields in the panel (the box field edits them), but they are design keys
 * that must reach the CSS, count as "set" and sync with their box field.
 */
export const BOX_LONGHANDS: Record<string, Array<{ key: string; cssProperty: string }>> = {
  margin: ['top', 'right', 'bottom', 'left'].map((s) => ({ key: `margin_${s}`, cssProperty: `margin-${s}` })),
  padding: ['top', 'right', 'bottom', 'left'].map((s) => ({ key: `padding_${s}`, cssProperty: `padding-${s}` })),
  border_radius: ['top_left', 'top_right', 'bottom_right', 'bottom_left'].map((c) => ({
    key: `border_${c}_radius`,
    cssProperty: `border-${c.replace('_', '-')}-radius`,
  })),
};

/** Design keys edited (and synced with a template) together with another one: the shape and its options. */
const GROUPED_KEYS: Record<string, string[]> = {
  shape: ['shape_options'],
  top: ['right', 'bottom', 'left'],
};

/** Design keys a property covers: itself plus its per-side longhands (box properties) or grouped keys. */
export function propertyKeys(key: string): string[] {
  return [key, ...(BOX_LONGHANDS[key] || []).map((l) => l.key), ...(GROUPED_KEYS[key] || [])];
}

const ENTRIES = DESIGN_TABLE.split(' ').map((token) => {
  const [key, flag = ''] = token.split(':');
  return { key, flag };
});

export function buildDesignToCssMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const { key } of ENTRIES) {
    map[key] = toCss(key);
    // longhands right after their shorthand, so a side overrides the shorthand
    for (const l of BOX_LONGHANDS[key] || []) map[l.key] = l.cssProperty;
  }
  return map;
}

/** Design keys edited as a colour field: the ones that accept `entity` / `entity N%`. */
export const COLOR_KEYS = [...ENTRIES.filter((e) => e.flag === 'c').map((e) => e.key), 'icon_color', 'icon_background', 'label_color', 'state_color'];
/** Design keys edited with the media picker (browsed media is a media-source id resolved at render). */
export const IMAGE_KEYS = new Set(ENTRIES.filter((e) => e.flag === 'i').map((e) => e.key));

/** Unit a bare number gets per length and time key, box sides included. */
export const NUMBER_UNITS: Record<string, string> = Object.fromEntries(
  ENTRIES.filter((e) => e.flag === 'p' || e.flag === 's').flatMap((e) => {
    const unit = e.flag === 's' ? 's' : 'px';
    return [[e.key, unit], ...(BOX_LONGHANDS[e.key] || []).map((l) => [l.key, unit])];
  }),
);
