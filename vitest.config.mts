import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';

const dir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  // Match tsconfig for every file, including tests/ (outside tsconfig's include):
  // legacy decorators + assignment semantics for class fields (useDefineForClassFields: false).
  oxc: {
    decorator: { legacy: true },
    assumptions: { setPublicClassFields: true },
    typescript: { removeClassFieldsWithoutInitializer: true },
  },
  // src/index.ts sets webpack's public path (a free variable only webpack defines): point it at a
  // plain global so importing the card in tests works
  define: { __webpack_public_path__: 'globalThis.__mcPublicPath' },
  resolve: {
    alias: {
      '@': `${dir}src`,
      '@modules': `${dir}src/modules`,
      '@editor': `${dir}src/editor`,
      '@services': `${dir}src/services`,
      '@utils': `${dir}src/utils`,
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/**/*.test.ts'],
  },
});
