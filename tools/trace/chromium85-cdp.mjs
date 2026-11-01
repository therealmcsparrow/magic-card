// Minimal raw DevTools-protocol driver for an old Chromium build (puppeteer cannot launch Chrome 85).
//
//   const browser = await launchChromium({ executablePath });
//   const page = await browser.newPage();           // own browser context, closed with the page
//   await page.send('Network.enable');
//   await page.serve(url, html);                    // answers that one document request, nothing else
//   await page.send('Page.navigate', { url });
//   const value = await page.evaluate(fn, arg);     // fn runs in the page, arg goes in as JSON
//   await browser.close();
//
// The browser starts through spawn with a fixed argument array (no shell), its own throw-away user-data dir
// and a debugging port that listens on 127.0.0.1 only. The endpoint comes from the DevToolsActivePort file
// Chromium writes into that dir, so no port is guessed.

import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForEndpoint(userDataDir, child, timeoutMs) {
  const file = join(userDataDir, 'DevToolsActivePort');
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) {
    if (child.exitCode != null) throw new Error(`Chromium exited with code ${child.exitCode} before it opened the debugging port`);
    try {
      const [port] = readFileSync(file, 'utf8').split('\n');
      if (/^\d{1,5}$/.test(port)) return Number(port);
    } catch { /* the file is not there yet */ }
    await sleep(100);
  }
  throw new Error('Chromium did not open the debugging port in time');
}

function connect(url) {
  // Only the local debugging endpoint is ever dialled.
  const u = new URL(url);
  if (u.protocol !== 'ws:' || u.hostname !== '127.0.0.1') throw new Error('refusing a debugging endpoint that is not on 127.0.0.1');
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.addEventListener('open', () => resolve(ws), { once: true });
    ws.addEventListener('error', () => reject(new Error('could not connect to the debugging endpoint')), { once: true });
  });
}

export async function launchChromium({ executablePath, headless = true, timeoutMs = 30000 }) {
  const userDataDir = mkdtempSync(join(tmpdir(), 'mc-c85-'));
  const args = [
    '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1', `--user-data-dir=${userDataDir}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-background-networking', '--no-sandbox',
  ];
  if (headless) args.push('--headless', '--disable-gpu');
  args.push('about:blank');
  const child = spawn(executablePath, args, { stdio: 'ignore', windowsHide: true });
  let ws;
  const cleanup = () => {
    try { if (child.exitCode == null) child.kill(); } catch { /* already gone */ }
    rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  };
  try {
    const port = await waitForEndpoint(userDataDir, child, timeoutMs);
    const info = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    ws = await connect(info.webSocketDebuggerUrl);
  } catch (e) {
    cleanup();
    throw e;
  }

  let nextId = 0;
  const pending = new Map();
  const listeners = [];
  ws.addEventListener('message', (m) => {
    const msg = JSON.parse(String(m.data));
    if (msg.id != null) {
      const p = pending.get(msg.id);
      if (!p) return;
      pending.delete(msg.id);
      if (msg.error) p.reject(new Error(`${p.method}: ${msg.error.message}`));
      else p.resolve(msg.result);
    } else {
      for (const l of listeners) if (l.sessionId === msg.sessionId && l.method === msg.method) l.fn(msg.params);
    }
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject, method });
    ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });

  async function newPage() {
    const { browserContextId } = await send('Target.createBrowserContext');
    const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const own = [];
    const page = {
      send: (method, params) => send(method, params, sessionId),
      on(method, fn) { const l = { sessionId, method, fn }; listeners.push(l); own.push(l); },
      /** Runs fn(arg) in the page and returns its (awaited) value. arg is serialised as JSON. */
      async evaluate(fn, arg) {
        const expression = `(${fn.toString()})(${JSON.stringify(arg ?? null)})`;
        const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId);
        if (r.exceptionDetails) throw new Error('page evaluation failed: ' + (r.exceptionDetails.exception?.description ?? r.exceptionDetails.text));
        return r.result.value;
      },
      /** Answers the document request for url with html; every other request continues untouched. */
      async serve(url, html) {
        await send('Fetch.enable', { patterns: [{ urlPattern: url, requestStage: 'Request' }] }, sessionId);
        page.on('Fetch.requestPaused', (e) => {
          if (e.request.url === url) {
            send('Fetch.fulfillRequest', {
              requestId: e.requestId, responseCode: 200,
              responseHeaders: [{ name: 'Content-Type', value: 'text/html; charset=utf-8' }],
              body: Buffer.from(html, 'utf8').toString('base64'),
            }, sessionId).catch(() => {});
          } else {
            send('Fetch.continueRequest', { requestId: e.requestId }, sessionId).catch(() => {});
          }
        });
      },
      async close() {
        for (const l of own) listeners.splice(listeners.indexOf(l), 1);
        await send('Target.closeTarget', { targetId }).catch(() => {});
        await send('Target.disposeBrowserContext', { browserContextId }).catch(() => {});
      },
    };
    return page;
  }

  return {
    version: async () => (await send('Browser.getVersion')).product,
    newPage,
    async close() {
      try { await send('Browser.close'); } catch { /* the browser may close the socket first */ }
      try { ws.close(); } catch { /* already closed */ }
      const until = Date.now() + 5000;
      while (child.exitCode == null && Date.now() < until) await sleep(100);
      cleanup();
    },
  };
}
