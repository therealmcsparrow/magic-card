import { MagicModule, MagicModuleMetadata } from './module-types';
import { CardModule, ModuleCategory, ModuleType } from '../types';

class ModuleRegistryImpl {
  private modules = new Map<ModuleType, MagicModule>();

  register(module: MagicModule): void {
    this.modules.set(module.metadata.type, module);
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

  search(query: string): MagicModule[] {
    const lower = query.toLowerCase();
    return this.getAll().filter(
      (m) =>
        m.metadata.name.toLowerCase().includes(lower) ||
        m.metadata.description.toLowerCase().includes(lower) ||
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
