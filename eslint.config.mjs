import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// lazy-module 1.4.0 "import() sites": a bare import() on the card side fails lint.
// Add a file here only with a Contract change; moving a loader onto lazyChunk() shrinks the list.
const REGISTERED_IMPORT_SITES = [
  'src/utils/lazy-chunks.ts',
  'src/anim-studio/anim-chunk.ts',
  'src/anim-studio/icon-library-loader.ts',
  'src/anim-studio/preset-catalogue-loader.ts',
  'src/editor/components/icon-animator/loader.ts',
  'src/editor/components/preset-catalogue-loader.ts',
  'src/editor/custom/icon-host.ts',
  'src/editor/layers/layer-editor-loader.ts',
  'src/editor/look-editor-loader.ts',
  'src/editor/transfer-loader.ts',
  'src/i18n/labels/index.ts',
  'src/icon-anim/library/i18n/index.ts',
  'src/path-booleans/loader.ts',
  'src/path-canvas/loader.ts',
  'src/path-tools/loader.ts',
  'src/shape-editor/loader.ts',
  'src/svg-editor/loader.ts',
  'src/theme-editor/presets/loader.ts',
];

// The one manifest site (lazy-module 1.4.0): the only file that may carry /* webpackIgnore: true */.
const MANIFEST_SITE = 'src/utils/lazy-chunk.ts';

const noWebpackIgnore = {
  meta: { type: 'problem', schema: [], messages: { ignore: 'webpackIgnore is allowed only in ' + MANIFEST_SITE + '.' } },
  create(context) {
    return {
      Program() {
        for (const c of context.sourceCode.getAllComments()) {
          if (/webpackIgnore/.test(c.value)) context.report({ loc: c.loc, messageId: 'ignore' });
        }
      },
    };
  },
};

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
  {
    files: ['src/**/*.ts'],
    plugins: { mc: { rules: { 'no-webpack-ignore': noWebpackIgnore } } },
    rules: {
      'mc/no-webpack-ignore': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportExpression',
          message: 'Bare import() is not allowed. Use lazyChunk() in src/utils/lazy-chunks.ts, or register the loader in eslint.config.mjs.',
        },
      ],
    },
  },
  {
    files: REGISTERED_IMPORT_SITES,
    rules: { 'no-restricted-syntax': 'off' },
  },
  {
    // The manifest check: its own override, one site, import() plus webpackIgnore.
    files: [MANIFEST_SITE],
    rules: { 'no-restricted-syntax': 'off', 'mc/no-webpack-ignore': 'off' },
  },
);
