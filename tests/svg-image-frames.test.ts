import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { drawStep, heavyStep, __resetFramesForTests } from '../src/svg-image/frames';

beforeEach(() => {
  vi.useFakeTimers();
  __resetFramesForTests();
});
afterEach(() => {
  __resetFramesForTests();
  vi.useRealTimers();
});

describe('heavy steps', () => {
  it('run one per frame, in order, and nothing before the first frame', async () => {
    const seen: number[] = [];
    heavyStep(() => seen.push(1));
    heavyStep(() => seen.push(2));
    heavyStep(() => seen.push(3));
    expect(seen).toEqual([]);
    await vi.advanceTimersByTimeAsync(20);
    expect(seen).toEqual([1]);
    await vi.advanceTimersByTimeAsync(20);
    expect(seen).toEqual([1, 2]);
    await vi.advanceTimersByTimeAsync(20);
    expect(seen).toEqual([1, 2, 3]);
  });

  it('skip a cancelled step without losing a frame, and leave no timer behind', async () => {
    const seen: number[] = [];
    const cancel = heavyStep(() => seen.push(1));
    heavyStep(() => seen.push(2));
    cancel();
    await vi.advanceTimersByTimeAsync(20);
    expect(seen).toEqual([2]);
    await vi.advanceTimersByTimeAsync(200);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('keep going when a step throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const seen: number[] = [];
    heavyStep(() => {
      throw new Error('x');
    });
    heavyStep(() => seen.push(2));
    await vi.advanceTimersByTimeAsync(20);
    await vi.advanceTimersByTimeAsync(20);
    expect(seen).toEqual([2]);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});

describe('draw steps', () => {
  it('wait for a frame like any heavy step when no heavy step just ran', async () => {
    const seen: number[] = [];
    drawStep(() => seen.push(1));
    expect(seen).toEqual([]);
    await vi.advanceTimersByTimeAsync(20);
    expect(seen).toEqual([1]);
  });

  it('continue at once, in the same task, after the heavy step that made their data; only one does', async () => {
    const seen: string[] = [];
    heavyStep(() => {
      queueMicrotask(() => {
        drawStep(() => seen.push('a'));
        drawStep(() => seen.push('b'));
        drawStep(() => seen.push('c'));
        seen.push('queued');
      });
    });
    await vi.advanceTimersByTimeAsync(20);
    expect(seen).toEqual(['a', 'queued']);
    await vi.advanceTimersByTimeAsync(20);
    expect(seen).toEqual(['a', 'queued', 'b']);
    await vi.advanceTimersByTimeAsync(20);
    expect(seen).toEqual(['a', 'queued', 'b', 'c']);
  });

  it('do not continue at once in a later task', async () => {
    const seen: string[] = [];
    heavyStep(() => undefined);
    await vi.advanceTimersByTimeAsync(20);
    drawStep(() => seen.push('late'));
    expect(seen).toEqual([]);
    await vi.advanceTimersByTimeAsync(20);
    expect(seen).toEqual(['late']);
  });
});
