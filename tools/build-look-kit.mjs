// Builds the look kit release asset: dist/look-kit.mjs (src/look-kit/index.ts as one minified ES module with no imports, no DOM
// use and no side effects at import) and dist/look-fixtures.json (a byte copy of the tracked corpus). Then it runs every corpus
// entry through the built module and exits 1 on the first mismatch, so a release can never carry a parser that disagrees with
// the corpus. The output is deterministic: the same sources give the same bytes.
//
// Usage: node tools/build-look-kit.mjs
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const corpusPath = path.join(root, 'src', 'look-kit', 'fixtures', 'corpus.json');
const EXPORTS = ['parseLook', 'lookTraits', 'applyLook', 'verifyIndex', 'acceptIndex', 'sha512Hex'];

const require = createRequire(import.meta.url);

/** Bundles src/look-kit/index.ts into dist/look-kit.mjs. */
function bundle() {
  const webpack = require('webpack');
  const compiler = webpack({
    mode: 'production',
    context: root,
    target: 'es2021',
    entry: path.join(root, 'src', 'look-kit', 'index.ts'),
    experiments: { outputModule: true },
    output: {
      path: dist,
      filename: 'look-kit.mjs',
      clean: false,
      module: true,
      library: { type: 'module' },
    },
    resolve: { extensions: ['.ts', '.js'] },
    module: { rules: [{ test: /\.ts$/, exclude: /node_modules/, use: { loader: 'ts-loader', options: { transpileOnly: true } } }] },
    optimization: { minimize: true, splitChunks: false, runtimeChunk: false, concatenateModules: true },
    performance: { hints: false },
    devtool: false,
  });
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      compiler.close(() => {
        if (err) return reject(err);
        if (stats.hasErrors()) return reject(new Error(stats.toString({ all: false, errors: true })));
        resolve();
      });
    });
  });
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Runs every corpus entry through the built module; returns the mismatch messages. */
function checkCorpus(kit) {
  const problems = [];
  const corpus = JSON.parse(readFileSync(corpusPath, 'utf8'));
  for (const entry of corpus) {
    const r = kit.parseLook(entry.text);
    const want = entry.expect;
    if (r.ok !== want.ok) {
      problems.push(`${entry.name}: expected ok=${want.ok}, got ok=${r.ok}${r.ok ? '' : ' (' + r.code + ')'}`);
      continue;
    }
    if (!r.ok) {
      if (r.code !== want.code) problems.push(`${entry.name}: expected code ${want.code}, got ${r.code}`);
      continue;
    }
    const dropped = r.dropped.map((d) => d.path).sort();
    if (!same(dropped, [...want.dropped].sort())) problems.push(`${entry.name}: dropped paths differ`);
    if (!same(kit.lookTraits(r.look), { animated: want.animated, fonts: want.fonts })) problems.push(`${entry.name}: traits differ`);
  }
  return problems;
}

async function main() {
  mkdirSync(dist, { recursive: true });
  await bundle();
  copyFileSync(corpusPath, path.join(dist, 'look-fixtures.json'));
  const asset = path.join(dist, 'look-kit.mjs');
  if (!existsSync(asset)) throw new Error('look-kit.mjs was not written');
  const kit = await import(pathToFileURL(asset).href);
  const missing = EXPORTS.filter((n) => typeof kit[n] !== 'function');
  if (missing.length) throw new Error(`look-kit.mjs lacks exports: ${missing.join(', ')}`);
  const problems = checkCorpus(kit);
  if (problems.length) {
    for (const p of problems) console.error(`build-look-kit: ${p}`);
    throw new Error(`${problems.length} corpus mismatch(es)`);
  }
  console.log(`build-look-kit: dist/look-kit.mjs ${statSync(asset).size} bytes, corpus ok`);
}

main().catch((e) => {
  console.error(`build-look-kit: ${e.message}`);
  process.exit(1);
});
