import { MagicModule, MagicModuleMetadata } from './module-types';
import { CardModule, HomeAssistant, ModuleCategory, ModuleType } from '../types';
import { html } from 'lit';
import type { LazyModuleStub, ModuleView, RetryableLazyChunk } from '../contracts/lazy-module';
import type { MessageId } from '../contracts/i18n';
import { currentRenderContext } from '../services/render-context';
import '../card/chunk-notice';

class ModuleRegistryImpl {
  private modules = new Map<ModuleType, MagicModule>();
  private chunks = new Map<string, RetryableLazyChunk>();
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
  registerLazy(stub: LazyModuleStub, chunk: RetryableLazyChunk): void {
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

  private renderLazy(stub: LazyModuleStub, chunk: RetryableLazyChunk, config: CardModule, hass?: HomeAssistant) {
    const view = this.views.get(stub.metadata.type);
    if (view) return view.renderPreview(config, hass);
    // the notice (lazy-module 1.4.0 "Failure"): after the stub's own box, so the slot keeps the size its config gives it
    const notice = () => html`<mc-chunk-notice .chunk=${chunk}></mc-chunk-notice>`;
    if (stub.renderPreview) {
      void chunk.load();
      const preview = stub.renderPreview(config, hass);
      return chunk.failed() ? html`${preview}${notice()}` : preview;
    }
    void chunk.load();
    const update = currentRenderContext()?.requestUpdate;
    // kept through a failure: a retry that succeeds later renders the module
    if (update) chunk.whenReady(update);
    return chunk.failed() ? html`${stub.placeholder(config, 'failed')}${notice()}` : stub.placeholder(config, 'pending');
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
