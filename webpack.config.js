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

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
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
      // set at run time (src/index.ts, src/anim-studio/public-path.ts); '' keeps webpack's document.currentScript probe out
      publicPath: '',
      // chunks are ES modules loaded with native import() (smallest loader; works from the module
      // script HA loads magic-card.js as); the entries stay plain scripts
      chunkLoading: 'import',
      chunkFormat: 'module',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
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
        // theme editor chunk (160 KB cap), path canvas chunk (44 KiB cap), SVG editor chunk (96 KiB cap) and path tools chunk (20 KiB ceiling): shrink css`` / html`` template text in production builds
        ...(isProduction
          ? [{ test: /\.ts$/, include: [path.resolve(__dirname, 'src/theme-editor'), path.resolve(__dirname, 'src/path-canvas'), path.resolve(__dirname, 'src/svg-editor'), path.resolve(__dirname, 'src/transfer'), path.resolve(__dirname, 'src/path-tools'), path.resolve(__dirname, 'src/ui-kit')], enforce: 'pre', use: path.resolve(__dirname, 'tools/minify-templates-loader.cjs') }]
          : []),
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [new webpack.DefinePlugin({ __MC_BUILD_VERSION__: JSON.stringify(buildVersion()) })],
    devtool: isProduction ? false : 'source-map',
    optimization: {
      minimize: isProduction,
      minimizer: isProduction
        ? [
            new TerserPlugin({
              terserOptions: {
                output: {
                  // only the Material Design Icons attribution (src/icon-anim/mdi-paths.ts, Apache-2.0)
                  comments: (_node, comment) => /^!\s*Material Design Icons/.test(comment.value),
                },
              },
              extractComments: false,
            }),
          ]
        : [],
      // No shared or vendor chunks: every entry is self-contained; only dynamic import() makes a chunk
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
