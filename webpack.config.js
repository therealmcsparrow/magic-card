const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

// The release src/version.ts holds, as a literal for the editor chunk's EDITOR_VERSION: the chunk must
// carry its own copy so a cached magic-card.js from another release notices (src/utils/editor-loader.ts)
const buildVersion = () => {
  const v = /VERSION\s*=\s*["']([^"']+)["']/.exec(fs.readFileSync(path.resolve(__dirname, 'src/version.ts'), 'utf8'))?.[1];
  if (!v) throw new Error('webpack.config.js: could not read VERSION from src/version.ts');
  return v;
};

// { chunks: [{ id, parents, files, modules }] } with every module name (concatenated ones flattened)
const writeI18nStats = (stats) => {
  const flat = (m) => (m.modules?.length ? m.modules.flatMap(flat) : [m.name]);
  const j = stats.toJson({ all: false, ids: true, chunks: true, chunkRelations: true, modules: true, chunkModules: true, nestedModules: true, dependentModules: true, orphanModules: true, modulesSpace: Infinity, chunkModulesSpace: Infinity, nestedModulesSpace: Infinity });
  const out = { chunks: j.chunks.map((c) => ({ id: c.id, parents: c.parents, files: c.files, modules: [...new Set((c.modules ?? []).flatMap(flat))].filter((n) => n?.startsWith('./src/')) })) };
  const file = path.resolve(__dirname, 'node_modules/.cache/magic-card/i18n-stats.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(out));
  // the same module lists, with the entry flag and names, for tools/check-entry-graph.mjs (proj.M11)
  const graph = { chunks: j.chunks.map((c, i) => ({ id: c.id, names: c.names, entry: c.entry, initial: c.initial, parents: c.parents, files: c.files, modules: out.chunks[i].modules })) };
  fs.writeFileSync(path.resolve(path.dirname(file), 'entry-graph.json'), JSON.stringify(graph));
};

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    // The ES ceiling of the browser floor (Chromium 85, proj.M6): webpack writes its own runtime and chunk loader in ES2021
    // (webpack.M4), and Terser's `ecma` below follows it (terser.M1). tools/check-es-syntax.mjs parses every dist .js at 2021.
    target: ['web', 'es2021'],
    // Three bundles: the card, the animation studio and the theme editor the magic-card-utils panel
    // loads (each defines only its own elements; the theme editor is one file, no chunks). The card editor is a lazy chunk (magic-card-editor.js, ADR 0007,
    // loaded by src/utils/editor-loader.ts). The card's v2 animation runtime is a lazy chunk
    // (magic-card-anim-runtime.js, loaded next to magic-card.js via the public path set from
    // import.meta.url in src/index.ts). The studio's icon library is its lazy chunk
    // (magic-card-icon-library.js, public path: src/anim-studio/public-path.ts). The path canvas of the
    // SVG and shape editors is a lazy chunk too (magic-card-path-canvas.js, src/path-canvas/loader.ts). The release uploads
    // dist/*.js and HACS installs them all.
    entry: {
      'magic-card': './src/index.ts',
      'magic-card-animation-studio': './src/anim-studio/index.ts',
      'magic-card-theme-editor': './src/theme-editor/index.ts',
    },
    output: {
      filename: '[name].js',
      // the query busts caches when the chunk changes (HACS' ?hacstag= only reaches the entry URL)
      chunkFilename: 'magic-card-[name].js?v=[contenthash:8]',
      // set at run time from import.meta.url (src/index.ts, src/*/public-path.ts); '' keeps webpack's document.currentScript probe out
      publicPath: '',
      // chunks are ES modules loaded with native import() (smallest loader; works from the module
      // script HA loads magic-card.js as); the entries stay plain scripts
      chunkLoading: 'import',
      chunkFormat: 'module',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      // Written out in full, next to `target` (webpack.S8): a webpack minor upgrade cannot change the runtime syntax without a
      // config change. These are the flags `['web', 'es2021']` resolves to today. `hasOwn` stays false (Object.hasOwn is Chromium 93),
      // and top-level await is not an `environment` flag (it is rejected by tools/check-es-syntax.mjs).
      environment: {
        arrowFunction: true,
        asyncFunction: true,
        bigIntLiteral: true,
        const: true,
        destructuring: true,
        document: true,
        dynamicImport: true,
        dynamicImportInWorker: true,
        forOf: true,
        globalThis: true,
        hasOwn: false,
        let: true,
        logicalAssignment: true,
        methodShorthand: true,
        module: true,
        optionalChaining: true,
        spread: true,
        symbol: true,
        templateLiteral: true,
      },
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@modules': path.resolve(__dirname, 'src/modules'),
        '@editor': path.resolve(__dirname, 'src/editor'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
    module: {
      rules: [
        {
          // keep import.meta.url as written (it is the entry's own URL at run time, not the source path)
          test: /\.ts$/,
          parser: { importMeta: false },
        },
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        // i18n: t('British text') becomes t(17) per namespace (tools/i18n-loader.cjs, contract i18n 1.0.0 r2); runs before ts-loader and the template minifier
        { test: /\.ts$/, include: path.resolve(__dirname, 'src'), enforce: 'pre', use: path.resolve(__dirname, 'tools/i18n-loader.cjs') },
        // the card (src/card, src/css, src/modules; S1a.1, checked by tools/dom-diff.mjs), the entity source field (editor chunk, card entity), theme editor chunk (160 KB cap), path canvas chunk (44 KiB cap), SVG editor chunk (96 KiB cap) and path tools chunk (20 KiB ceiling): shrink css`` / html`` template text in production builds
        ...(isProduction
          ? [{ test: /\.ts$/, include: [path.resolve(__dirname, 'src/card'), path.resolve(__dirname, 'src/css'), path.resolve(__dirname, 'src/modules'), path.resolve(__dirname, 'src/theme-editor'), path.resolve(__dirname, 'src/path-canvas'), path.resolve(__dirname, 'src/svg-editor'), path.resolve(__dirname, 'src/transfer'), path.resolve(__dirname, 'src/path-tools'), path.resolve(__dirname, 'src/ui-kit'), path.resolve(__dirname, 'src/look-editor'), path.resolve(__dirname, 'src/flow-look'), path.resolve(__dirname, 'src/slider-look'), path.resolve(__dirname, 'src/editor/components/entity-source.ts'), path.resolve(__dirname, 'src/editor/components/mc-anchor-grid.ts'), path.resolve(__dirname, 'src/editor/layers')], enforce: 'pre', use: path.resolve(__dirname, 'tools/minify-templates-loader.cjs') }]
          : []),
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({ __MC_BUILD_VERSION__: JSON.stringify(buildVersion()) }),
      // the module list per built file for the i18n placement check (tools/i18n/placement.mjs, D7); git-ignored cache
      ...(isProduction ? [{ apply: (compiler) => compiler.hooks.done.tap('mc-i18n-stats', writeI18nStats) }] : []),
    ],
    devtool: isProduction ? false : 'source-map',
    optimization: {
      minimize: isProduction,
      minimizer: isProduction
        ? [
            new TerserPlugin({
              // `minimizerOptions` and `format`, not the deprecated `terserOptions` and `output` aliases (terser.S1).
              // No `unsafe*` flag (terser.M2, terser.M-SEC1) and no `mangle.properties` (terser.M3). `module` and `toplevel` are
              // left to the plugin, which sets `module` from the asset's javascriptModule info (terser.M4). `pure_getters` stays at its default (terser.S3).
              minimizerOptions: {
                // the ES ceiling of the floor, at the top level so it covers compress and format (terser.M1); the plugin would derive 2020
                ecma: 2021,
                compress: { passes: 2 },
                format: {
                  // only the Material Design Icons attribution (src/icon-anim/mdi-paths.ts, Apache-2.0)
                  comments: (_node, comment) => /^!\s*Material Design Icons/.test(comment.value),
                },
              },
              extractComments: false,
            }),
          ]
        : [],
      // No shared or vendor chunks: every entry is self-contained; only dynamic import() makes a chunk (ADR 0045: a chunk that always loads after another is its child)
      splitChunks: false,
      runtimeChunk: false,
    },
    devServer: {
      port: 5050,
      static: {
        directory: path.resolve(__dirname, 'dist'),
      },
      hot: true,
    },
  };
};
