import { MagicModule, MagicModuleMetadata } from './module-types';
import { CardModule, HomeAssistant, ModuleCategory, ModuleType } from '../types';
import type { LazyChunk, LazyModuleStub, ModuleView } from '../contracts/lazy-module';
import type { MessageId } from '../contracts/i18n';
import { currentRenderContext } from '../services/render-context';

class ModuleRegistryImpl {
  private modules = new Map<ModuleType, MagicModule>();
  private chunks = new Map<string, LazyChunk>();
  private stubs = new Map<string, LazyModuleStub>();
  private views = new Map<string, ModuleView>();

  register(module: MagicModule): void {
    this.modules.set(module.metadata.type, module);
  }

  /**
   * Register the synchronous half of a module whose view lives in a lazy chunk (contract
   * lazy-module 1.0.0). Metadata, defaults, validation and dependencies work at once; rendering
   * uses the view once the chunk has provided it, the stub's placeholder before.
   */
  registerLazy(stub: LazyModuleStub, chunk: LazyChunk): void {
    const type = stub.metadata.type;
    this.chunks.set(type, chunk);
    this.stubs.set(type, stub);
    this.views.delete(type);
    // prototype delegation keeps class-based stubs (their methods, `this`) intact
    const wrapper = Object.create(stub, {
      renderPreview: {
        value: (config: CardModule, hass?: HomeAssistant) => this.renderLazy(stub, chunk, config, hass),
      },
    }) as MagicModule;
    this.modules.set(type, wrapper);
  }

  /** Called by a chunk's install(): the module's view, from now on used by renderPreview. */
  provideView(type: ModuleType, view: ModuleView): void {
    this.views.set(type, view);
  }

  /** The module can render its real output now (always true for a module that is not lazy). */
  isReady(type: ModuleType): boolean {
    const chunk = this.chunks.get(type);
    if (!chunk) return true;
    return this.views.has(type) || (!!this.stubs.get(type)?.renderPreview && chunk.ready());
  }

  /**
   * Start the chunk of every lazy module type in a card config, all at once (nested children
   * included, embedded `card_config` subtrees skipped).
   */
  prefetch(config: unknown): void {
    if (!this.chunks.size) return;
    const needed = new Set<LazyChunk>();
    const seen = new Set<unknown>();
    const walk = (node: unknown): void => {
      if (!node || typeof node !== 'object' || seen.has(node)) return;
      seen.add(node);
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      const rec = node as Record<string, unknown>;
      if (typeof rec.type === 'string') {
        const chunk = this.chunks.get(rec.type);
        if (chunk) needed.add(chunk);
      }
      for (const [key, value] of Object.entries(rec)) if (key !== 'card_config') walk(value);
    };
    walk(config);
    for (const chunk of needed) void chunk.load();
  }

  private renderLazy(stub: LazyModuleStub, chunk: LazyChunk, config: CardModule, hass?: HomeAssistant) {
    const view = this.views.get(stub.metadata.type);
    if (view) return view.renderPreview(config, hass);
    if (stub.renderPreview) {
      void chunk.load();
      return stub.renderPreview(config, hass);
    }
    if (chunk.failed()) return stub.placeholder(config, 'failed');
    void chunk.load();
    const update = currentRenderContext()?.requestUpdate;
    if (update) chunk.whenReady(update);
    return stub.placeholder(config, 'pending');
  }

  get(type: ModuleType): MagicModule | undefined {
    return this.modules.get(type);
  }

  getAll(): MagicModule[] {
    return Array.from(this.modules.values());
  }

  getByCategory(category: ModuleCategory): MagicModule[] {
    return this.getAll().filter((m) => m.metadata.category === category);
  }

  getMetadata(): MagicModuleMetadata[] {
    return this.getAll().map((m) => m.metadata);
  }

  /** `text` turns a name or description into the words the user sees (the labels namespace, which magic-card.js does not carry). */
  search(query: string, text: (id: MessageId) => string = String): MagicModule[] {
    const lower = query.toLowerCase();
    return this.getAll().filter(
      (m) =>
        text(m.metadata.name).toLowerCase().includes(lower) ||
        text(m.metadata.description).toLowerCase().includes(lower) ||
        m.metadata.type.toLowerCase().includes(lower),
    );
  }

  createDefault(type: ModuleType): CardModule | null {
    const module = this.get(type);
    if (!module) return null;
    return module.createDefault();
  }

  has(type: ModuleType): boolean {
    return this.modules.has(type);
  }

  get types(): ModuleType[] {
    return Array.from(this.modules.keys());
  }
}

export const ModuleRegistry = new ModuleRegistryImpl();
