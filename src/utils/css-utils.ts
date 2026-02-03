import { DesignConfig } from '../types';

const DESIGN_TO_CSS: Record<string, string> = {
  font_size: 'font-size',
  font_weight: 'font-weight',
  font_family: 'font-family',
  line_height: 'line-height',
  text_align: 'text-align',
  text_transform: 'text-transform',
  letter_spacing: 'letter-spacing',
  color: 'color',
  background: 'background',
  opacity: 'opacity',
  padding: 'padding',
  margin: 'margin',
  border: 'border',
  border_radius: 'border-radius',
  border_color: 'border-color',
  box_shadow: 'box-shadow',
  text_shadow: 'text-shadow',
  width: 'width',
  height: 'height',
  min_width: 'min-width',
  min_height: 'min-height',
  max_width: 'max-width',
  max_height: 'max-height',
  overflow: 'overflow',
  flex: 'flex',
  filter: 'filter',
  backdrop_filter: 'backdrop-filter',
  transform: 'transform',
  transition: 'transition',
};

export function designToStyle(design?: DesignConfig): string {
  if (!design) return '';

  const parts: string[] = [];

  for (const [key, cssProperty] of Object.entries(DESIGN_TO_CSS)) {
    const value = design[key as keyof DesignConfig];
    if (value !== undefined && typeof value === 'string') {
      parts.push(`${cssProperty}: ${value}`);
    }
  }

  if (design.css) {
    parts.push(design.css);
  }

  return parts.join('; ');
}

export function designToHoverStyle(design?: DesignConfig): string {
  if (!design?.hover) return '';
  return designToStyle(design.hover as DesignConfig);
}

export function layoutToGridTemplate(layout?: string): string {
  if (!layout) return '1fr';

  const presets: Record<string, string> = {
    '1': '1fr',
    '1-1': '1fr 1fr',
    '1-2': '1fr 2fr',
    '2-1': '2fr 1fr',
    '1-1-1': '1fr 1fr 1fr',
    '1-2-1': '1fr 2fr 1fr',
  };

  return presets[layout] || layout;
}
