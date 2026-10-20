// Writes <file>.js.br and <file>.js.gz next to every dist/*.js (ADR 0044). Home Assistant's static file server sends a sibling
// .br or .gz when the browser accepts it and the raw file otherwise, so without the siblings every dashboard downloads the raw bundle.
// Deterministic: brotli quality 11, lgwin 22, text mode, size hint = input length; gzip level 9 with the header OS byte fixed to 3
// (zlib writes the host's code, 11 on Windows and 3 on Linux; mtime is already 0). Sorted order, no timestamps, no dependency.
// Usage: node tools/compress-dist.mjs [--dist <dir>]
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

function brotli(buf) {
  return brotliCompressSync(buf, {
    params: {
      [constants.BROTLI_PARAM_QUALITY]: 11,
      [constants.BROTLI_PARAM_LGWIN]: 22,
      [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
      [constants.BROTLI_PARAM_SIZE_HINT]: buf.length,
    },
  });
}

function gzip(buf) {
  const out = gzipSync(buf, { level: 9 });
  out[9] = 3; // OS byte: Unix, whatever the host is
  return out;
}

const args = process.argv.slice(2);
const i = args.indexOf('--dist');
const dist = i === -1 ? fileURLToPath(new URL('../dist/', import.meta.url)) : args[i + 1];
const files = readdirSync(dist).filter((f) => f.endsWith('.js')).sort();
if (files.length === 0) {
  console.error(`compress-dist: no .js files in ${dist}`);
  process.exit(1);
}
for (const f of files) {
  const buf = readFileSync(join(dist, f));
  const br = brotli(buf);
  const gz = gzip(buf);
  writeFileSync(join(dist, `${f}.br`), br);
  writeFileSync(join(dist, `${f}.gz`), gz);
  console.log(`${f}: ${buf.length} B raw, ${gz.length} B gz, ${br.length} B br`);
}
