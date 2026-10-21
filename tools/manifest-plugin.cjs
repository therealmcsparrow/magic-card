// Writes dist/magic-card-manifest.js: `export default { build, chunks }`, where chunks maps the logical chunk name
// (magic-card-<name>.js) to the emitted file (magic-card-<name>.<hash8>.js). The card imports it only after a chunk failed,
// to tell "this entry is from another release" from "the network failed". Entries keep fixed names and are not listed.
const webpack = require('webpack');

const HASHED = /^(magic-card-.+)\.[0-9a-f]{8}\.js$/;

class ManifestPlugin {
  constructor({ build, file = 'magic-card-manifest.js' } = {}) {
    if (!build) throw new Error('ManifestPlugin: build is required');
    this.build = build;
    this.file = file;
  }

  apply(compiler) {
    const { Compilation, sources } = compiler.webpack ?? webpack;
    compiler.hooks.thisCompilation.tap('ManifestPlugin', (compilation) => {
      // ANALYSE comes after OPTIMIZE_HASH, where webpack renames chunks to the hash of their final (minified) content
      compilation.hooks.processAssets.tap({ name: 'ManifestPlugin', stage: Compilation.PROCESS_ASSETS_STAGE_ANALYSE }, () => {
        const chunks = {};
        for (const chunk of compilation.chunks) {
          if (chunk.canBeInitial()) continue;
          for (const f of chunk.files) {
            const m = HASHED.exec(f);
            if (m) chunks[`${m[1]}.js`] = f;
          }
        }
        const sorted = Object.fromEntries(Object.entries(chunks).sort(([a], [b]) => (a < b ? -1 : 1)));
        compilation.emitAsset(this.file, new sources.RawSource(`export default ${JSON.stringify({ build: this.build, chunks: sorted })};\n`));
      });
    });
  }
}

module.exports = { ManifestPlugin };
