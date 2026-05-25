import { HomeAssistant } from '../types';
import { TEMPLATE_CACHE_TTL_MS } from '../utils/constants';

interface CacheEntry {
  result: string;
  timestamp: number;
}

export class TemplateService {
  private static cache = new Map<string, CacheEntry>();
  private static subscriptions = new Map<string, () => void>();

  static async render(hass: HomeAssistant, template: string): Promise<string> {
    const cached = this.cache.get(template);
    if (cached && Date.now() - cached.timestamp < TEMPLATE_CACHE_TTL_MS) {
      return cached.result;
    }

    try {
      const result = await hass.callWS<{ result: string }>({
        type: 'render_template',
        template,
      });

      this.cache.set(template, {
        result: result.result,
        timestamp: Date.now(),
      });

      return result.result;
    } catch (err) {
      console.warn('Template render failed:', err);
      return `{{ error }}`;
    }
  }

  static subscribe(
    hass: HomeAssistant,
    template: string,
    callback: (result: string) => void,
  ): () => void {
    const key = template;

    if (this.subscriptions.has(key)) {
      this.subscriptions.get(key)!();
    }

    let unsubscribe: (() => void) | null = null;

    hass.connection
      .subscribeMessage<{ result: string }>(
        (msg) => {
          this.cache.set(template, {
            result: msg.result,
            timestamp: Date.now(),
          });
          callback(msg.result);
        },
        {
          type: 'render_template',
          template,
        },
      )
      .then((unsub) => {
        unsubscribe = unsub;
        this.subscriptions.set(key, unsub);
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      this.subscriptions.delete(key);
    };
  }

  static clearCache(): void {
    this.cache.clear();
  }
}
