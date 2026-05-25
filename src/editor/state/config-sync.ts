import { MagicCardConfig } from '../../types';
import { toYaml, fromYaml } from '../../utils/yaml-utils';

export class ConfigSync {
  private suppressSync = false;

  toYaml(config: MagicCardConfig): string {
    // Remove 'type' from YAML since it's managed by HA
    const { type, ...rest } = config;
    return toYaml(rest);
  }

  fromYaml(yaml: string, originalConfig: MagicCardConfig): MagicCardConfig | null {
    const parsed = fromYaml<Record<string, unknown>>(yaml);
    if (!parsed) return null;

    return {
      ...parsed,
      type: originalConfig.type,
    } as MagicCardConfig;
  }

  isSuppressed(): boolean {
    return this.suppressSync;
  }

  suppress(fn: () => void): void {
    this.suppressSync = true;
    try {
      fn();
    } finally {
      this.suppressSync = false;
    }
  }
}
