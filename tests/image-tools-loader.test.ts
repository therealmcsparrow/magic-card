import { afterEach, describe, expect, it, vi } from 'vitest';
import { html, render } from 'lit';
import { BUILD } from '../src/image-tools/chunk';
import { __setImageToolsImportForTests, imageToolsLoaded, loadImageTools, withImageTools } from '../src/editor/image-tools-loader';

const flush = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};

afterEach(() => {
  __setImageToolsImportForTests();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('loadImageTools', () => {
  it('defines the elements from the real chunk and is memoised', async () => {
    __setImageToolsImportForTests();
    const a = loadImageTools();
    expect(loadImageTools()).toBe(a);
    expect(await a).toBe(true);
    expect(imageToolsLoaded()).toBe(true);
    expect(customElements.get('mc-library-image-field')).toBeDefined();
    expect(customElements.get('mc-image-picker')).toBeDefined();
    expect(await loadImageTools()).toBe(true);
  });

  it('fails when the import fails, warns once, and tries again next time', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const install = vi.fn();
    let fail = true;
    __setImageToolsImportForTests(async () => {
      if (fail) throw new Error('404');
      return { BUILD, install };
    });
    expect(await loadImageTools()).toBe(false);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(imageToolsLoaded()).toBe(false);
    fail = false;
    expect(await loadImageTools()).toBe(true);
    expect(install).toHaveBeenCalledTimes(1);
  });

  it('refuses a chunk from another build', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const install = vi.fn();
    __setImageToolsImportForTests(async () => ({ BUILD: 'other', install }));
    expect(await loadImageTools()).toBe(false);
    expect(install).not.toHaveBeenCalled();
  });

  it('fails when install throws', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    __setImageToolsImportForTests(async () => ({
      BUILD,
      install: () => {
        throw new Error('boom');
      },
    }));
    expect(await loadImageTools()).toBe(false);
  });

  it('gives up after the timeout', async () => {
    vi.useFakeTimers();
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    __setImageToolsImportForTests(() => new Promise(() => undefined));
    const p = loadImageTools();
    await vi.advanceTimersByTimeAsync(16_000);
    expect(await p).toBe(false);
  });
});

describe('withImageTools', () => {
  it('shows the fallback while the chunk loads, then the field', async () => {
    let release!: () => void;
    __setImageToolsImportForTests(() => new Promise((r) => (release = () => r({ BUILD, install: () => undefined }))));
    const box = document.createElement('div');
    document.body.append(box);
    render(withImageTools(() => html`<p id="field">field</p>`, () => html`<p id="plain">plain</p>`), box);
    expect(box.querySelector('#plain')).not.toBeNull();
    expect(box.querySelector('#field')).toBeNull();
    release();
    await flush();
    expect(box.querySelector('#field')).not.toBeNull();
    expect(box.querySelector('#plain')).toBeNull();
  });

  it('keeps the fallback when the chunk cannot load', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    __setImageToolsImportForTests(async () => {
      throw new Error('404');
    });
    const box = document.createElement('div');
    document.body.append(box);
    render(withImageTools(() => html`<p id="field">field</p>`, () => html`<p id="plain">plain</p>`), box);
    await flush();
    expect(box.querySelector('#plain')).not.toBeNull();
    expect(box.querySelector('#field')).toBeNull();
  });

  it('renders the field at once when the chunk is already loaded', async () => {
    __setImageToolsImportForTests();
    await loadImageTools();
    const box = document.createElement('div');
    document.body.append(box);
    render(withImageTools(() => html`<p id="field">field</p>`, () => html`<p id="plain">plain</p>`), box);
    expect(box.querySelector('#field')).not.toBeNull();
  });
});
