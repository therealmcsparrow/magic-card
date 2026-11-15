// Seq floor gate for the release workflow. LOOK_INDEX_MIN_SEQ (src/look-kit/min-seq.ts) is the lowest index seq the card accepts.
// A floor above the newest published `index-<seq>` release of the gallery would make the card refuse every real index, so
// this fails then (and when the floor is above 1 and the gallery has no index release yet). A floor below the newest only warns:
// it is allowed, but it means the floor was not raised after the last index.
//
// Usage: GH_TOKEN=<read-only token> node tools/check-look-min-seq.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MAX_BYTES = 1024 * 1024;
const MAX_PAGES = 10;
const INDEX_TAG = /^index-([1-9][0-9]{0,14})$/;

/**
 * Compares the floor with the newest `index-<seq>` tag. `tags` holds tag names or release objects with a `tag_name`;
 * tags that only look like an index tag are ignored. Returns `{ ok, message, warning? }`.
 */
export function checkMinSeq(minSeq, tags) {
  let newest = 0;
  for (const t of tags) {
    const name = typeof t === 'string' ? t : t && typeof t.tag_name === 'string' ? t.tag_name : '';
    const m = INDEX_TAG.exec(name);
    if (m) newest = Math.max(newest, Number(m[1]));
  }
  if (!Number.isSafeInteger(minSeq) || minSeq < 1) return { ok: false, message: `LOOK_INDEX_MIN_SEQ must be a positive integer, got ${minSeq}` };
  if (newest === 0) {
    if (minSeq > 1) return { ok: false, message: `LOOK_INDEX_MIN_SEQ is ${minSeq} but the gallery has no index-<seq> release (the floor can only be 1)` };
    return { ok: true, message: 'no index release yet, floor is 1' };
  }
  if (minSeq > newest) return { ok: false, message: `LOOK_INDEX_MIN_SEQ is ${minSeq}, above the newest published index-${newest}; the card would refuse every index` };
  if (minSeq < newest) return { ok: true, message: `floor ${minSeq}, newest index-${newest}`, warning: `LOOK_INDEX_MIN_SEQ is ${minSeq}, below the newest published index-${newest}; raise it when the older indexes should be refused` };
  return { ok: true, message: `floor ${minSeq} equals the newest index-${newest}` };
}

/** Reads one response body as JSON, refusing a body over MAX_BYTES before and while reading. */
async function readCappedJson(res) {
  const declared = Number(res.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BYTES) throw new Error('response too large');
  if (!res.body) throw new Error('empty response');
  const reader = res.body.getReader();
  const parts = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BYTES) {
      await reader.cancel();
      throw new Error('response too large');
    }
    parts.push(value);
  }
  return JSON.parse(Buffer.concat(parts).toString('utf8'));
}

/** Lists the tag names of the gallery's releases, newest first, over at most MAX_PAGES pages. */
async function fetchTags(repo, token) {
  const tags = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases?per_page=100&page=${page}`, {
      headers: { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28', authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`GitHub answered ${res.status} for the gallery releases`);
    const list = await readCappedJson(res);
    if (!Array.isArray(list)) throw new Error('unexpected release list');
    for (const r of list) if (r && typeof r.tag_name === 'string') tags.push(r.tag_name);
    if (list.length < 100) break;
  }
  return tags;
}

const read = (file, re, what) => {
  const m = re.exec(readFileSync(path.join(root, file), 'utf8'));
  if (!m) throw new Error(`could not read ${what} from ${file}`);
  return m[1];
};

async function main() {
  const token = process.env.GH_TOKEN;
  if (!token) throw new Error('GH_TOKEN is not set');
  const minSeq = Number(read('src/look-kit/min-seq.ts', /LOOK_INDEX_MIN_SEQ\s*=\s*([0-9]+)/, 'LOOK_INDEX_MIN_SEQ'));
  const repo = read('src/contracts/look-index.ts', /GALLERY_REPO\s*=\s*'([^']+)'/, 'GALLERY_REPO');
  const result = checkMinSeq(minSeq, await fetchTags(repo, token));
  if (result.warning) console.log(`::warning::${result.warning}`);
  if (!result.ok) {
    console.error(`::error::${result.message}`);
    process.exit(1);
  }
  console.log(`check-look-min-seq: ${result.message}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(`::error::check-look-min-seq: ${e.message}`);
    process.exit(1);
  });
}
