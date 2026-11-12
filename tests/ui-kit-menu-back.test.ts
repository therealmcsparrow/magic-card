// A submenu of <mc-ui-menu> starts with a row that leads back to the main menu.
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import type { LitElement } from 'lit';
import { defineUiKit } from '../src/ui-kit';
import type { UiMenuElement, UiMenuEntry } from '../src/contracts/ui-kit';
import { UI_MENU_TAG } from '../src/contracts/ui-kit';

beforeAll(() => defineUiKit());
afterEach(() => {
  document.body.innerHTML = '';
});

const flush = async (el: HTMLElement & { updateComplete?: Promise<unknown> }): Promise<void> => {
  await el.updateComplete;
  await Promise.resolve();
};

const items: UiMenuEntry[] = [
  { id: 'copy', label: 'Copy' },
  { id: 'arrange', label: 'Arrange', items: [{ id: 'front', label: 'Bring to front' }, { id: 'back', label: 'Send to back' }] },
  { id: 'delete', label: 'Delete' },
];

const mount = async (backLabel?: string) => {
  const m = document.createElement(UI_MENU_TAG) as UiMenuElement & { backLabel: string };
  m.items = items;
  m.label = 'Shape actions';
  m.at = [10, 10];
  if (backLabel !== undefined) m.backLabel = backLabel;
  document.body.append(m);
  m.show();
  await flush(m as unknown as LitElement);
  const root = (m as unknown as LitElement).renderRoot as ShadowRoot;
  const picks: string[] = [];
  m.addEventListener('mc-menu-pick', (e) => picks.push((e as CustomEvent<{ id: string }>).detail.id));
  const openSub = async () => {
    (root.querySelectorAll('.menu:not(.sub) [role^=menuitem]')[1] as HTMLElement).click();
    await flush(m as unknown as LitElement);
  };
  return { m, root, picks, openSub };
};

describe('<mc-ui-menu> submenu', () => {
  it('the first row of a submenu is Back, with the given label, and it returns to the main menu', async () => {
    const { m, root, openSub } = await mount('Back');
    await openSub();
    const back = root.querySelector('.sub [role=menuitem]') as HTMLElement;
    expect(back.classList.contains('back')).toBe(true);
    expect(back.textContent).toContain('Back');
    back.click();
    await flush(m as unknown as LitElement);
    expect(root.querySelector('.sub')).toBeNull();
    expect(m.open).toBe(true);
  });

  it('without a label the Back row names the parent entry', async () => {
    const { root, openSub } = await mount();
    await openSub();
    expect((root.querySelector('.sub .back') as HTMLElement).textContent).toContain('Arrange');
  });

  it('submenu rows pick their own entries; main menu rows pick theirs while the submenu is open', async () => {
    const { m, root, picks, openSub } = await mount('Back');
    await openSub();
    (root.querySelectorAll('.sub [role^=menuitem]')[2] as HTMLElement).click();
    expect(picks).toEqual(['back']);
    m.show();
    await flush(m as unknown as LitElement);
    await openSub();
    (root.querySelectorAll('.menu:not(.sub) [role^=menuitem]')[0] as HTMLElement).click();
    expect(picks).toEqual(['back', 'copy']);
  });
});
