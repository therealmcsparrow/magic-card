import { DesignConfig, DisplayCondition, HomeAssistant } from '../types';
import { buildDesignToCssMap } from './css-properties';
import { ConditionsService } from '../services/conditions-service';

const ALL_CSS_MAP = buildDesignToCssMap();

export function designToStyle(design?: DesignConfig): string {
  if (!design) return '';

  const parts: string[] = [];
  const rec = design as Record<string, unknown>;

  for (const [key, cssProperty] of Object.entries(ALL_CSS_MAP)) {
    const value = rec[key];
    if (value !== undefined && typeof value === 'string' && value !== '') {
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

export function resolveConditionalDesign(
  design: DesignConfig | undefined,
  hass: HomeAssistant | undefined,
  moduleEntity?: string,
): DesignConfig | undefined {
  if (!design?.conditional?.length || !hass) return design;

  const { conditional, ...base } = design;
  const merged = { ...base } as Record<string, unknown>;

  for (const rule of conditional) {
    const resolved = rule.conditions.map((c: DisplayCondition) =>
      c.use_module_entity !== false && moduleEntity && !c.entity
        ? { ...c, entity: moduleEntity }
        : c,
    );
    const display = { conditions: resolved, mode: rule.mode };
    if (ConditionsService.evaluate(display, hass)) {
      const overrides = rule.design as Record<string, unknown>;
      for (const [key, value] of Object.entries(overrides)) {
        if (value !== undefined) {
          merged[key] = value;
        }
      }
    }
  }

  return merged as DesignConfig;
}

function buildEqualTemplate(columnCount: number): string {
  return Array.from({ length: Math.max(columnCount, 1) }, () => '1fr').join(' ');
}

function countPresetColumns(layout: string): number | null {
  if (/^\d+(?:-\d+)*$/.test(layout)) {
    return layout.split('-').length;
  }
  return null;
}

export function layoutToGridTemplate(layout?: string, columnCount?: number): string {
  if (!layout) {
    return buildEqualTemplate(columnCount ?? 1);
  }

  const presets: Record<string, string> = {
    '1': '1fr',
    '1-1': '1fr 1fr',
    '1-2': '1fr 2fr',
    '2-1': '2fr 1fr',
    '1-1-1': '1fr 1fr 1fr',
    '1-2-1': '1fr 2fr 1fr',
  };

  if (presets[layout]) {
    if (columnCount && countPresetColumns(layout) && countPresetColumns(layout)! !== columnCount) {
      return buildEqualTemplate(columnCount);
    }
    return presets[layout];
  }

  if (/^\d+(?:-\d+)+$/.test(layout)) {
    const count = layout.split('-').length;
    if (columnCount && count !== columnCount) {
      return buildEqualTemplate(columnCount);
    }
    return layout
      .split('-')
      .map((segment) => `${Math.max(Number(segment) || 1, 1)}fr`)
      .join(' ');
  }

  return layout;
}
