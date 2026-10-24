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
    // the full parallel run loads every core: heavy shape, path and editor tests can take well over the 5 s default
    testTimeout: 30_000,
    hookTimeout: 30_000,
    include: ['tests/**/*.test.ts'],
    // writes the git-ignored src/<folder>/i18n/messages.gen.ts files the i18n modules import
    globalSetup: ['tools/i18n/vitest-global-setup.mjs'],
    // every lazy chunk installed before a test file runs, so renderPreview keeps its synchronous output
    setupFiles: ['tools/i18n/vitest-setup.ts', 'tests/setup-lazy-chunks.ts'],
  },
});
