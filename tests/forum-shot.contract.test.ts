import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import * as contract from '../src/contracts/forum-shot';
import type { ForumShotErrorCode, ForumShotLockReason } from '../src/contracts/forum-shot';
import { HA_DARK_DEFAULTS, HA_DARK_DEFAULTS_VERSION } from '../src/contracts/ha-dark-defaults';
import { I18N_MODULES, I18N_CONTRACT_VERSION } from '../src/contracts/i18n';
import { MagicCardForumShot } from '../src/forum-shot';

const ROOT = path.resolve(__dirname, '..');
const read = (rel: string) => readFileSync(path.join(ROOT, rel), 'utf8');
const walk = (d: string): string[] =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.ts') ? [path.join(d, e.name)] : []));
const specs = (src: string) => [...src.matchAll(/^\s*(?:import|export)\s+(?:type\s+)?(?:[^'";]*?\sfrom\s+)?['"]([^'"]+)['"]/gm)].map((m) => m[1]);
/** The string members of an exported union, in source order; types do not exist at run time. */
const unionOf = (name: string): string[] => {
  const body = read('src/contracts/forum-shot.ts').match(new RegExp(`export type ${name} =([^;]+);`))?.[1] ?? '';
  return [...body.matchAll(/'([^']+)'/g)].map((m) => m[1]);
};

describe('forum-shot 1.1.0 constants', () => {
  it('holds the Contract values', () => {
    expect(contract.FORUM_SHOT_CONTRACT_VERSION).toBe('1.1.0');
    expect(contract.FORUM_SHOT_FILE).toBe('magic-card-forum-shot.js');
    expect(contract.FORUM_SHOT_TAG).toBe('magic-card-forum-shot');
    expect(contract.FORUM_SHOT_WIDTH).toBe(420);
    expect(contract.FORUM_SHOT_SCALE).toBe(2);
    expect(contract.FORUM_SHOT_MAX_PIXELS).toBe(16_777_216);
  });

  it('keeps the six old error codes and adds font_unavailable and hosts_changed', () => {
    const codes: ForumShotErrorCode[] = ['no_cards', 'config_read_failed', 'card_not_defined', 'remote_asset', 'capture_failed', 'too_large', 'font_unavailable', 'hosts_changed'];
    expect(unionOf('ForumShotErrorCode')).toEqual(codes);
  });

  it('adds the disclosed hosts to the request as an optional member', () => {
    expect(read('src/contracts/forum-shot.ts')).toMatch(/interface ForumShotRequest \{[^}]*fontHosts\?: string\[\];/);
  });

  it('names the lock reasons in priority order', () => {
    const reasons: ForumShotLockReason[] = ['custom_card', 'limit', 'outside_address', 'cannot_judge'];
    expect(unionOf('ForumShotLockReason')).toEqual(reasons);
  });

  it('exports constants only and imports nothing', () => {
    const src = read('src/contracts/forum-shot.ts');
    expect(specs(src)).toEqual([]);
    expect(src).not.toMatch(/\bfunction\b|=>|\bclass\b/);
    expect(Object.keys(contract).every((k) => k.startsWith('FORUM_SHOT_'))).toBe(true);
  });
});

describe('forum-shot font decision records', () => {
  it('points the Remote assets section of 0085 at 0086', () => {
    const section = read('docs/adr/0085-forum-shot-is-its-own-lazy-entry.md').split('## Remote assets')[1];
    expect(section.trimStart().split('\n')[0]).toContain('0086-forum-shot-fetches-fonts-from-any-https-host.md');
  });

  it('records the new contract and error code in 0086', () => {
    const adr = read('docs/adr/0086-forum-shot-fetches-fonts-from-any-https-host.md');
    expect(adr).toContain(`forum-shot ${contract.FORUM_SHOT_CONTRACT_VERSION}`);
    expect(adr).toContain('`font_unavailable`');
  });
});

describe('ha-dark-defaults 1.0.0', () => {
  it('is a leaf with the moved data', () => {
    expect(HA_DARK_DEFAULTS_VERSION).toBe('1.0.0');
    expect(specs(read('src/contracts/ha-dark-defaults.ts'))).toEqual([]);
    expect(HA_DARK_DEFAULTS['primary-background-color']).toBe('#111111');
    expect(HA_DARK_DEFAULTS['bar-box-shadow']).toBe('0 2px 12px var(--shadow-color)');
    expect(Object.keys(HA_DARK_DEFAULTS).length).toBeGreaterThan(30);
  });

  it('left src/theme-editor, whose trial reads it from the Contract', () => {
    expect(existsSync(path.join(ROOT, 'src/theme-editor/dark-defaults.ts'))).toBe(false);
    expect(read('src/theme-editor/trial.ts')).toContain("from '../contracts/ha-dark-defaults'");
  });
});

describe('forum-shot entry', () => {
  it('defines its element once, guarded, and reads hass and narrow', () => {
    const el = customElements.get(contract.FORUM_SHOT_TAG);
    expect(el).toBe(MagicCardForumShot);
    expect(MagicCardForumShot.contractVersion).toBe(contract.FORUM_SHOT_CONTRACT_VERSION);
    expect(Object.keys(MagicCardForumShot.properties)).toEqual(['hass', 'narrow']);
    expect(read('src/forum-shot/index.ts')).toMatch(/if \(!customElements\.get\(FORUM_SHOT_TAG\)\)/);
  });

  it('renders a named region in the forum-shot namespace', async () => {
    const node = document.createElement(contract.FORUM_SHOT_TAG) as MagicCardForumShot;
    node.hass = { language: 'nl' };
    document.body.append(node);
    await node.updateComplete;
    expect(node.shadowRoot?.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe('Forumafbeelding');
    node.remove();
  });

  it('imports nothing from src/theme-editor or the card', () => {
    for (const f of walk(path.join(ROOT, 'src/forum-shot'))) {
      for (const s of specs(readFileSync(f, 'utf8'))) {
        expect(s, path.relative(ROOT, f)).not.toMatch(/theme-editor/);
      }
    }
  });
});

describe('build wiring', () => {
  it('adds the entry to webpack and nothing of it to the card entry', () => {
    expect(read('webpack.config.js')).toContain("'magic-card-forum-shot': './src/forum-shot/index.ts'");
    expect(read('src/index.ts')).not.toMatch(/forum-shot/);
  });

  it('registers the namespace and the fixed-name entry', () => {
    expect(I18N_CONTRACT_VERSION).toBe('2.1.0');
    expect(I18N_MODULES['forum-shot'].bundle).toBe(contract.FORUM_SHOT_FILE);
    expect(read('tools/check-manifest.mjs')).toContain(`'${contract.FORUM_SHOT_FILE}'`);
    expect(read('tools/i18n/placement.mjs')).toContain(`'${contract.FORUM_SHOT_FILE}'`);
  });

  it('caps the new file at or below 107,520 B', () => {
    const caps = JSON.parse(read('tools/size-caps.json'));
    const e = caps.files[contract.FORUM_SHOT_FILE];
    expect(e).toBeTruthy();
    expect(e.ceiling).toBeLessThanOrEqual(107_520);
    expect(e.raw).toBeLessThanOrEqual(e.ceiling);
  });
});
