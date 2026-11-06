import type { MessageIndex } from '../../contracts/i18n';
import type { BuiltInThemePreset, ThemeDoc, ThemePresetLibrary } from '../../contracts/theme-editor';
import { m } from './i18n';

// The preset library: themes with a light and a dark mode in one lazy chunk; no UI code.

type Mode = Record<string, string>;

// Text on the primary colour and the four state colours are set in every mode.
const STATES_LIGHT: Mode = {
  'text-primary-color': '#ffffff',
  'app-header-text-color': '#ffffff',
  'error-color': '#b3261e',
  'warning-color': '#8a4b00',
  'info-color': '#0b66a8',
  'success-color': '#1b6e2f',
};
const STATES_DARK: Mode = {
  'text-primary-color': '#000000',
  'app-header-text-color': '#000000',
  'error-color': '#ff8a80',
  'warning-color': '#ffb74d',
  'info-color': '#64b5f6',
  'success-color': '#81c784',
};

/** The seven base colours, then the shared text-on-primary and state colours (extra overrides them). */
const mode = (c: string[], dark = false, extra: Mode = {}): Mode => ({
  'primary-color': c[0],
  'accent-color': c[1],
  'primary-background-color': c[2],
  'card-background-color': c[3],
  'primary-text-color': c[4],
  'secondary-text-color': c[5],
  'divider-color': c[6],
  ...(dark ? STATES_DARK : STATES_LIGHT),
  ...extra,
});

const doc = (light: Mode, dark: Mode, root: Mode = {}): ThemeDoc => ({
  'ha-card-border-radius': '16px',
  ...root,
  modes: { light, dark },
});

/**
 * A plain preset: its 14 base colours (7 light, then 7 dark) as one 84-character string of
 * 6-digit hex, unpacked here into the same resolved objects the long form gives. The `more` argument adds note,
 * inspiredBy or tags; `dark` overrides state colours in the dark mode only.
 */
const P = (id: string, name: MessageIndex, group: BuiltInThemePreset['group'], blurb: MessageIndex, hex: string, more: Partial<BuiltInThemePreset> = {}, dark: Mode = {}): BuiltInThemePreset => {
  const c = (hex.match(/.{6}/g) as string[]).map((h) => '#' + h);
  return { id, name, group, blurb, ...more, doc: doc(mode(c.slice(0, 7)), mode(c.slice(7), true, dark)) };
};

const PRESETS: BuiltInThemePreset[] = [
  P('paper', m('theme-presets.library.paper'), 'original', m('theme-presets.library.clean-light-with-a-calm-blue'), '1d5fd1c2410cf5f6f8ffffff1b1f245a626ce1e4e87aa7ffff9d6614171c1d2128eceff3a2a9b32c323b'),
  P('midnight-oled', m('theme-presets.library.midnight-oled'), 'original', m('theme-presets.library.pure-black-for-wall-tablets'), '0a6fb5b45309f4f4f6ffffff11111155555ddcdce04cc2ffffb4540000000b0b0df2f2f29a9aa21f1f24', { note: m('theme-presets.library.pure-black-in-dark-mode-only-keep-the') }),
  P('ember', m('theme-presets.library.ember'), 'original', m('theme-presets.library.warm-paper-and-terracotta'), 'b93a0b0f766efaf5eefffdf92b21186b5a4aeadfcefb923c5eead41c1511261d17f6ebddbfa98f3a2d23'),
  P('contrast', m('theme-presets.library.contrast'), 'original', m('theme-presets.library.high-contrast-strong-edges'), '0000ccb00020ffffffffffff0000002b2b2b000000ffe50000e5ff000000000000ffffffe6e6e6ffffff'),
  {
    id: 'frost',
    name: m('theme-presets.library.frost'),
    group: 'original',
    blurb: m('theme-presets.library.glass-blurred-translucent-cards-on-a'),
    note: m('theme-presets.library.uses-blur-and-transparency-can-be-slow'),
    doc: doc(
      mode(
        ['#2a58b5', '#a23b8c', '#dfe9f7', 'rgba(255, 255, 255, 0.65)', '#1a2233', '#4a566b', 'rgba(26, 34, 51, 0.14)'],
        false,
        { 'lovelace-background': 'linear-gradient(135deg, #dfe9f7, #f3e8f8)' },
      ),
      mode(
        ['#8fb4ff', '#f0a3e0', '#0f1b33', 'rgba(255, 255, 255, 0.08)', '#eef2fb', '#aab4c8', 'rgba(255, 255, 255, 0.14)'],
        true,
        { 'lovelace-background': 'linear-gradient(135deg, #0f1b33, #2a1740)' },
      ),
      { 'ha-card-backdrop-filter': 'blur(12px)' },
    ),
  },
  P('slate', m('theme-presets.library.slate'), 'original', m('theme-presets.library.neutral-blue-grey-for-any-room'), '3d5a73b4562bf1f3f5ffffff1c232952606cdde2e69ab8d1f0a67a15191d1d2227e8ecefa3adb62b3239'),
  P('sand', m('theme-presets.library.sand'), 'original', m('theme-presets.library.warm-neutral-stone-and-clay'), '8a5a2b3f7a6ef4eee4fffbf52e2a24645b4ee6dcccd9b3827cc4b41a171324201aefe8dcb5a995352f26'),
  P('forest', m('theme-presets.library.forest'), 'original', m('theme-presets.library.deep-greens-with-an-amber-spark'), '2f6b3fa35a14eef3ecfbfdfa17261b4a5d4ed5e0d37bc98ae5b5670f1a1316241ae3efe5a1b8a5243629'),
  P('ocean', m('theme-presets.library.ocean'), 'original', m('theme-presets.library.teal-depths-and-coral'), '0b6a8ac2492feaf3f7fbfeff0f253046606dcfe0e85ac8e8ff9a8508161e0f212be2f1f69fbac61b3541'),
  P('desert', m('theme-presets.library.desert'), 'original', m('theme-presets.library.terracotta-dust-and-oasis-teal'), 'a8431c1f7a7af8efe4fffaf333231a6a5444ead9c4f0956a62c4c01e15112a1e18f7e9dcc3a891402e24'),
  P('arcade', m('theme-presets.library.arcade'), 'original', m('theme-presets.library.neon-magenta-and-cyan-80s-cabinet'), 'a3109b0a7a86f7f1ffffffff1a0f3355477ae1d3f5ff4fd83df5ff0b0620150c33f5f0ffb9a9e82e1a66'),
  P('cassette', m('theme-presets.library.cassette'), 'original', m('theme-presets.library.faded-tape-deck-red-and-cream'), 'c0392b1d6b8af3e9d2fbf4e32c24186a5a40dccfaeff8a5b5fd0c71d1a1429251cf1e7cfbfb28f3d372a'),
  P('sorbet', m('theme-presets.library.sorbet'), 'original', m('theme-presets.library.pastel-raspberry-and-mint'), 'b83d6a278471fff4f6ffffff3a24306d5160f3dce2ffa3c28eead22a1c2235242cffeef3d6b4c14a3540'),
  P('lavender-mist', m('theme-presets.library.lavender-mist'), 'original', m('theme-presets.library.pastel-lilac-and-rose'), '6b4fc0b45582f5f2fcffffff2a23405d5578e3ddf3c3b1ffffb7d51d1930272240f0ecffbab3d83a3360'),
  P('hi-vis', m('theme-presets.library.hi-vis'), 'original', m('theme-presets.library.high-contrast-green-on-black-strong'), '0064008a0000ffffffffffff00000026262600000039ff14ffea00000000000000fffffff0f0f039ff14'),
  P('ink', m('theme-presets.library.ink'), 'original', m('theme-presets.library.black-and-white-nothing-in-between'), '000000b00020f2f2f2ffffff0000001f1f1f000000ffffffff91000a0a0a000000ffffffe0e0e0ffffff'),
  P('spring', m('theme-presets.library.spring'), 'original', m('theme-presets.library.fresh-leaf-green-and-blossom-pink'), '2f7d32c2185bf4faeeffffff1f2e1c4f6549dcebd09be07aff9ec7121c101a2a17eaf6e3a8c29f2a4025'),
  P('summer', m('theme-presets.library.summer'), 'original', m('theme-presets.library.sky-blue-and-sun-yellow'), '0a76c2b25e00fff9e6fffdf51c2a334e5f6bf0e4b8ffd23f4fc3f70e223315324afff7dab3c7d624506f'),
  P('autumn', m('theme-presets.library.autumn'), 'original', m('theme-presets.library.rust-olive-and-warm-paper'), '9c3d105c6b1af7ece0fff8f0321d126b4e3de9d3bdf4a259c9d46a1f130d2c1c13f8e8d8cdae9546301f'),
  P('winter', m('theme-presets.library.winter'), 'original', m('theme-presets.library.icy-blue-with-a-violet-touch'), '1b6a947a3f8fedf2f7ffffff14202c4b5b6bd3dde7b6e3ffd9c2ff0e1620162230eaf3fba8b9ca263a4f'),
  P('oled-amber', m('theme-presets.library.oled-amber'), 'original', m('theme-presets.library.pure-black-with-amber-for-wall-tablets'), '8a5200a63a00f6f1e8ffffff1c18125a5245e4dcccffb000ff6e400000000a0a0af5efe6a89f901c1a16', { note: m('theme-presets.library.pure-black-in-dark-mode-only-keep-the') }),
  P('oled-green', m('theme-presets.library.oled-green'), 'original', m('theme-presets.library.pure-black-with-terminal-green-for-wall'), '17683a0b6478eff5f1ffffff1020164b6154d6e3da3ddc846ee7f9000000090c0ae8f5ec93a89a16201a', { note: m('theme-presets.library.pure-black-in-dark-mode-only-keep-the') }),
  {
    id: 'glass-aqua',
    name: m('theme-presets.library.glass-aqua'),
    group: 'original',
    blurb: m('theme-presets.library.frosted-cards-over-an-aqua-gradient'),
    note: m('theme-presets.library.uses-blur-and-transparency-can-be-slow'),
    doc: doc(
      mode(
        ['#0a6e86', '#b0457a', '#d9f0f2', 'rgba(255, 255, 255, 0.6)', '#0d2a33', '#3f5f6a', 'rgba(13, 42, 51, 0.14)'],
        false,
        { 'lovelace-background': 'linear-gradient(135deg, #d9f0f2, #e3ecfb)' },
      ),
      mode(
        ['#6fe0f0', '#ffa6c9', '#062a33', 'rgba(255, 255, 255, 0.08)', '#e9fbff', '#a8c8d0', 'rgba(255, 255, 255, 0.14)'],
        true,
        { 'lovelace-background': 'linear-gradient(135deg, #062a33, #1a2450)' },
      ),
      { 'ha-card-backdrop-filter': 'blur(12px)' },
    ),
  },
  {
    id: 'glass-rose',
    name: m('theme-presets.library.glass-rose'),
    group: 'original',
    blurb: m('theme-presets.library.frosted-cards-over-a-rose-gradient'),
    note: m('theme-presets.library.uses-blur-and-transparency-can-be-slow'),
    doc: doc(
      mode(
        ['#a8326a', '#1d6f8f', '#fbe3ec', 'rgba(255, 255, 255, 0.62)', '#2e1623', '#664553', 'rgba(46, 22, 35, 0.14)'],
        false,
        { 'lovelace-background': 'linear-gradient(135deg, #fbe3ec, #efe3fb)' },
      ),
      mode(
        ['#ff9cc4', '#8fd8ff', '#2a1020', 'rgba(255, 255, 255, 0.08)', '#ffeef5', '#d2adbd', 'rgba(255, 255, 255, 0.14)'],
        true,
        { 'lovelace-background': 'linear-gradient(135deg, #2a1020, #2b1a47)' },
      ),
      { 'ha-card-backdrop-filter': 'blur(12px)' },
    ),
  },
  {
    id: 'glass-graphite',
    name: m('theme-presets.library.glass-graphite'),
    group: 'original',
    blurb: m('theme-presets.library.frosted-cards-over-a-graphite-gradient'),
    note: m('theme-presets.library.uses-blur-and-transparency-can-be-slow'),
    doc: doc(
      mode(
        ['#3f4a5a', '#a04a1c', '#e6e8ec', 'rgba(255, 255, 255, 0.6)', '#171a1f', '#4a525e', 'rgba(23, 26, 31, 0.14)'],
        false,
        { 'lovelace-background': 'linear-gradient(135deg, #e6e8ec, #d9dde5)' },
      ),
      mode(
        ['#c3ccd9', '#ffb074', '#14161a', 'rgba(255, 255, 255, 0.07)', '#f0f2f5', '#aab2be', 'rgba(255, 255, 255, 0.14)'],
        true,
        { 'lovelace-background': 'linear-gradient(135deg, #14161a, #262b33)' },
      ),
      { 'ha-card-backdrop-filter': 'blur(12px)' },
    ),
  },
  P('ayu', m('theme-presets.library.ayu-mirage'), 'inspired', m('theme-presets.library.amber-on-blue-grey-mirage'), 'a85a00197cacfafafaffffff3b40485f6670e3e5e8ffcc6673d0ff1f2430272d38cccac29ca0ab343b4a', { inspiredBy: { name: 'Ayu', author: 'Ike Ku', url: 'https://github.com/ayu-theme/ayu-colors' } }),
  P('catppuccin', m('theme-presets.library.catppuccin-latte-mocha'), 'inspired', m('theme-presets.library.soft-pastel-accents-latte-by-day-and'), '1e66f58839efeff1f5ffffff4c4f695c5f77ccd0da89b4faf5c2e71e1e2e313244cdd6f4a6adc845475a', { inspiredBy: { name: 'Catppuccin', author: 'Catppuccin', url: 'https://catppuccin.com' } }),
  P('cobalt2', m('theme-presets.library.cobalt-gold'), 'inspired', m('theme-presets.library.cobalt-blue-with-a-gold-primary'), '0b5394b15a00eef4f9ffffff12273844596bcfdce8ffc6009effff15232d193549ffffffb9cbd8234e6d', { inspiredBy: { name: 'Cobalt2', author: 'Wes Bos', url: 'https://github.com/wesbos/cobalt2' } }),
  P('dracula', m('theme-presets.library.dracula-night'), 'inspired', m('theme-presets.library.purple-and-pink-on-deep-indigo'), '6a3fc0b0306ff8f8f2ffffff1f1f2e565a75e2e0eabd93f9ff79c6282a36343746f8f8f2b9bfd844475a', { inspiredBy: { name: 'Dracula', author: 'Zeno Rocha', url: 'https://draculatheme.com' } }),
  P('everforest', m('theme-presets.library.everforest-moss'), 'inspired', m('theme-presets.library.soft-green-forest-tones-easy-on-the-eyes'), '5a7a1fb8562efdf6e3fffbef3c48415c6a72e6e2cca7c080e698752d353b343f44d3c6aaaeb8a6475258', { inspiredBy: { name: 'Everforest', author: 'sainnhe', url: 'https://github.com/sainnhe/everforest' } }),
  P('github', m('theme-presets.library.github-light-dark'), 'inspired', m('theme-presets.library.clean-primer-blues-and-neutral-greys'), '0969dabf3989f6f8faffffff1f232859636ed1d9e058a6fff778ba0d1117161b22e6edf39198a130363d', { inspiredBy: { name: 'GitHub Primer', author: 'GitHub', url: 'https://primer.style' } }),
  P('gruvbox', m('theme-presets.library.gruvbox-retro'), 'inspired', m('theme-presets.library.warm-retro-browns-with-a-teal-link'), '076678af3a03fbf1c7f9f5d73c3836665c54d5c4a183a598fe80192828283c3836ebdbb2bdae93504945', { inspiredBy: { name: 'Gruvbox', author: 'Pavel Pertsev', url: 'https://github.com/morhetz/gruvbox' } }),
  P('kanagawa', m('theme-presets.library.kanagawa-wave'), 'inspired', m('theme-presets.library.ukiyo-e-indigo-and-parchment'), '4d699ba65800f2ecbcf7f2cf43436c5d5d7ad5cea37e9cd8ffa0661f1f282a2a37dcd7baa8a48b363646', { inspiredBy: { name: 'Kanagawa', author: 'rebelot', url: 'https://github.com/rebelot/kanagawa.nvim' } }),
  P('material', m('theme-presets.library.material-violet'), 'inspired', m('theme-presets.library.material-baseline-purple-with-teal'), '6200ee018382fafafaffffff2121215f5f5fe0e0e0bb86fc03dac61212121e1e1ee6e6e6b0b0b02c2c2c', { inspiredBy: { name: 'Material Design', author: 'Google', url: 'https://m3.material.io' } }),
  P('monokai', m('theme-presets.library.monokai-lime'), 'inspired', m('theme-presets.library.lime-and-magenta-on-charcoal'), '4d7a0ac2185bf5f5efffffff2728225e5c4de1e0d4a6e22efa4d8b1e1f1c272822f8f8f2b0ad983e3d32', { inspiredBy: { name: 'Monokai', author: 'Wimer Hazenberg', url: 'https://monokai.pro' } }),
  P('night-owl', m('theme-presets.library.night-owl-navy'), 'inspired', m('theme-presets.library.deep-navy-with-soft-periwinkle'), '3a60b0994cc3f0f0f0fbfbfb403f535a5970d9d9d982aaffc792ea0116270b2942d6deeb99a8c41d3b53', { inspiredBy: { name: 'Night Owl', author: 'Sarah Drasner', url: 'https://github.com/sdras/night-owl-vscode-theme' } }),
  P('nightfox', m('theme-presets.library.nightfox-dayfox'), 'inspired', m('theme-presets.library.dusky-blue-night-warm-fox-white-day'), '2848a9955f61f6f2eefffcf83d2b5a5f5870e4dcd4719cd6dbc074192330212e3fcdcecfa0a7b32b3b51', { inspiredBy: { name: 'Nightfox', author: 'EdenEast', url: 'https://github.com/EdenEast/nightfox.nvim' } }),
  P('nord', m('theme-presets.library.nord-frost'), 'inspired', m('theme-presets.library.cool-arctic-blues-on-polar-night'), '3b6a8fa0613aeceff4f8f9fb2e34404c566ad8dee988c0d0ebcb8b2e34403b4252eceff4b8c2d44c566a', { inspiredBy: { name: 'Nord', author: 'Arctic Ice Studio', url: 'https://www.nordtheme.com' } }, { 'error-color': '#ff9a90' }),
  P('one-dark', m('theme-presets.library.one-dark-pro'), 'inspired', m('theme-presets.library.familiar-editor-greys-with-a-bright-blue'), '3b66c9a626a4eef0f4fafafa383a425b5f6bdcdfe461afefc678dd21252b282c34abb2bf959eae3e4451', { inspiredBy: { name: 'One Dark', author: 'Atom', url: 'https://github.com/atom/atom' } }),
  P('poimandres', m('theme-presets.library.poimandres-mint'), 'inspired', m('theme-presets.library.mint-and-sky-on-ink'), '00695c3f6fb5f4f7f9ffffff1b1e284f5d70d9e1e85de4c7add7ff1b1e28252b37e4f0fba6accd303340', { inspiredBy: { name: 'Poimandres', author: 'drcmda', url: 'https://github.com/drcmda/poimandres-theme' } }),
  P('rose-pine', m('theme-presets.library.rose-pine-bloom'), 'inspired', m('theme-presets.library.muted-rose-and-iris-calm-and-low'), '7a5aa6a75c71faf4edfffaf3575279675f80dfdad9c4a7e7ebbcba1917241f1d2ee0def4a09cb826233a', { inspiredBy: { name: 'Rosé Pine', author: 'Rosé Pine', url: 'https://rosepinetheme.com' } }),
  P('solarized', m('theme-presets.library.solarized-glow'), 'inspired', m('theme-presets.library.balanced-low-glare-cream-and-teal'), '1c6ea49e6900fdf6e3fffdf5073642476268eee8d54aa3e0bc9519002b36073642eee8d5a0b0b017505e', { inspiredBy: { name: 'Solarized', author: 'Ethan Schoonover', url: 'https://ethanschoonover.com/solarized/' } }),
  P('synthwave', m('theme-presets.library.synthwave-sunset'), 'inspired', m('theme-presets.library.hot-pink-and-cyan-on-dark-purple'), 'b3158a0b7f87fbf4ffffffff2b21405e5078e7d9f3ff7edb36f9f6241b2f2a2139f4eefcbcb0d03d3358', { inspiredBy: { name: 'Synthwave 84', author: 'Robb Owen', url: 'https://github.com/robb0wen/synthwave-vscode' } }),
  P('tokyo-night', m('theme-presets.library.tokyo-night-lights'), 'inspired', m('theme-presets.library.neon-lit-city-blues-and-violets'), '3b5fcf8a45e0e1e2e7f2f3f71f23354a5272c4c8da7aa2f7bb9af71a1b2624283bc0caf59aa5ce3b4261', { inspiredBy: { name: 'Tokyo Night', author: 'enkia', url: 'https://github.com/enkia/tokyo-night-vscode-theme' } }),
  P('zenburn', m('theme-presets.library.zenburn-calm'), 'inspired', m('theme-presets.library.low-contrast-sage-on-soft-grey'), '3e6b3ea34a4af3f1e7fffdf43f3f3f5a5a50dedccc8fb28fe0aeae3f3f3f4a4a4adcdccccfcfbf5f5f5f', { inspiredBy: { name: 'Zenburn', author: 'Jani Nurminen', url: 'https://github.com/jnurmine/Zenburn' } }, { 'error-color': '#ffaaa2', 'info-color': '#94cbff', 'success-color': '#a3dba7' }),
  P('amber-console', m('theme-presets.library.amber-console'), 'genre', m('theme-presets.library.lilac-and-amber-on-near-black-like-a'), '5b4fa89a4600efeaf4fbf8fd1d183050476bd9d0e6b4a4ece8963c05060d1a1828f0ecfab3acd03a3664', { tags: 'sci-fi space night' }),
  P('cobalt-prism', m('theme-presets.library.cobalt-prism'), 'genre', m('theme-presets.library.ultramarine-blue-with-an-orange-spark'), '2438c8b55200e3edf8f6f9fd0f223644596ecfdeee6e8de6f09a45050d1a102036e6f3ff9db7d1243e66', { tags: 'sci-fi hologram space' }),
  P('deep-survey', m('theme-presets.library.deep-survey'), 'genre', m('theme-presets.library.off-white-panels-burnt-orange-accent'), '2a2f7ac2410ce9eceff7f8fa14181d4a5563d3d8de637c9ee8944f0d1014171b21e8ebf0a9b2bf2c333d', { tags: 'sci-fi explorer space' }),
  P('dust-duel', m('theme-presets.library.dust-duel'), 'genre', m('theme-presets.library.red-clay-desert-brick-header-red-accent'), '581c12b02a1af0d8c8faeadf2f241866503ddfc3aecdb582e2705d1c16102a2118f5ead6c4b192463a2a', { tags: 'sci-fi space' }),
  P('frontier-freighter', m('theme-presets.library.frontier-freighter'), 'genre', m('theme-presets.library.saddle-tan-and-rust-on-sandy-cream-a'), '8667538a3f1cefe6d6faf4e82b231b5f5444dccfb65fb3a8d98b4f1a161326201beee3d0b9a98f41372d', { tags: 'sci-fi western space calm' }),
  P('neon-rain', m('theme-presets.library.neon-rain'), 'genre', m('theme-presets.library.hot-magenta-and-electric-cyan-neon-on-a'), 'b0159c097a94e8ebf4f8f9fd1a1a2e4d5070d0d4e6d480c23ee6f7070a1c111635eaf2ff9fb2d82b3b78', { tags: 'sci-fi cyberpunk noir' }),
  P('ochre-basin', m('theme-presets.library.ochre-basin'), 'genre', m('theme-presets.library.sun-baked-ochre-olive-header-at-night-an'), '4a4a1c8f5a00eed890f8ecbc2a20105e4d2cd8c070b08a109aa6f20f14261a2038f6ecd2c2b9922f3a63', { tags: 'sci-fi arid desert' }),
  P('orbital-smelter', m('theme-presets.library.orbital-smelter'), 'genre', m('theme-presets.library.deep-petrol-and-steel-grey-with-a'), '0a5b740b6b80cdd2d7eceff21b1f23454d55b4bcc3d9894f4cc3d913181d222a32ecedeea8b0b83a444d', { tags: 'sci-fi space' }),
  P('ashen-keep', m('theme-presets.library.ashen-keep'), 'genre', m('theme-presets.library.charcoal-iron-and-pale-limestone-deep'), '30323a8c1f2be4e1daf6f4ef201e1e55504fcbc6bca49894e0707a16161825252aecebeaaeaaa83b3b41', { tags: 'fantasy medieval winter low-glare night' }),
  P('candlelit-cloister', m('theme-presets.library.candlelit-cloister'), 'genre', m('theme-presets.library.plum-and-old-gold-on-parchment-wine'), '5b2a5e8a6212f1e6d2faf1de2a1a1a5f4a40ddcbaad6a3b8e3b95a1b0d122e1822f3e6d3c0ab9e4a2a38', { tags: 'fantasy magic cozy wine' }),
  P('crimson-pines', m('theme-presets.library.crimson-pines'), 'genre', m('theme-presets.library.oxblood-red-over-a-dark-pine-forest-moss'), '7b22301f6b4ad5e0d3f1f6ee18211b44534ab8c8b8c474886fbf8f0a120d16241be6ece9a3b0aa2c4034', { tags: 'fantasy dusk' }),
  P('silverleaf-glade', m('theme-presets.library.silverleaf-glade'), 'genre', m('theme-presets.library.silvered-jade-leaves-and-gold-touches-by'), '1a7f698a6a10edf1eef9fbfa1c26224a5a55d2dcd8709078e0c06810161519211fe6eeeba7b7b12d3a36', { tags: 'fantasy forest elegant low-glare night' }),
];

export const THEME_PRESET_LIBRARY: ThemePresetLibrary = { version: '1.2.0', presets: PRESETS };
