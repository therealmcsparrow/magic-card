import type { ThemeDoc, ThemePreset, ThemePresetLibrary } from '../../contracts/theme-editor';

/*
 * The preset library (Contract theme-presets 1.0.0, ADR 0014): 45 themes, each with a light and a
 * dark mode, in one lazy chunk (magic-card-theme-presets.js) that the create dialog loads on first
 * open. Only `import type` here: Node can load this file with type stripping, and the chunk holds
 * no UI code. The first 5 are the original starters (ids and values unchanged since 2026.10.06).
 * Inspired presets use their own colours and names; the credit names the palette that sparked them.
 * Every mode passes 4.5 to 1 for text, secondary text, text on primary and the state colours
 * (tests/theme-presets.contract.test.ts). Order: display order within a group.
 */

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

const PRESETS: ThemePreset[] = [
  {
    id: 'paper',
    name: 'Paper',
    group: 'original',
    blurb: 'Clean light with a calm blue.',
    doc: doc(
      mode(['#1d5fd1', '#c2410c', '#f5f6f8', '#ffffff', '#1b1f24', '#5a626c', '#e1e4e8']),
      mode(['#7aa7ff', '#ff9d66', '#14171c', '#1d2128', '#eceff3', '#a2a9b3', '#2c323b'], true),
    ),
  },
  {
    id: 'midnight-oled',
    name: 'Midnight OLED',
    group: 'original',
    blurb: 'Pure black for wall tablets.',
    note: 'Pure black in dark mode only. Keep the screen in dark mode.',
    doc: doc(
      mode(['#0a6fb5', '#b45309', '#f4f4f6', '#ffffff', '#111111', '#55555d', '#dcdce0']),
      mode(['#4cc2ff', '#ffb454', '#000000', '#0b0b0d', '#f2f2f2', '#9a9aa2', '#1f1f24'], true),
    ),
  },
  {
    id: 'ember',
    name: 'Ember',
    group: 'original',
    blurb: 'Warm paper and terracotta.',
    doc: doc(
      mode(['#b93a0b', '#0f766e', '#faf5ee', '#fffdf9', '#2b2118', '#6b5a4a', '#eadfce']),
      mode(['#fb923c', '#5eead4', '#1c1511', '#261d17', '#f6ebdd', '#bfa98f', '#3a2d23'], true),
    ),
  },
  {
    id: 'contrast',
    name: 'Contrast',
    group: 'original',
    blurb: 'High contrast, strong edges.',
    doc: doc(
      mode(['#0000cc', '#b00020', '#ffffff', '#ffffff', '#000000', '#2b2b2b', '#000000']),
      mode(['#ffe500', '#00e5ff', '#000000', '#000000', '#ffffff', '#e6e6e6', '#ffffff'], true),
    ),
  },
  {
    id: 'frost',
    name: 'Frost',
    group: 'original',
    blurb: 'Glass: blurred, translucent cards on a soft gradient.',
    note: 'Uses blur and transparency. Can be slow on old tablets.',
    doc: doc(
      mode(
        [
          '#2a58b5',
          '#a23b8c',
          '#dfe9f7',
          'rgba(255, 255, 255, 0.65)',
          '#1a2233',
          '#4a566b',
          'rgba(26, 34, 51, 0.14)',
        ],
        false,
        { 'lovelace-background': 'linear-gradient(135deg, #dfe9f7, #f3e8f8)' },
      ),
      mode(
        [
          '#8fb4ff',
          '#f0a3e0',
          '#0f1b33',
          'rgba(255, 255, 255, 0.08)',
          '#eef2fb',
          '#aab4c8',
          'rgba(255, 255, 255, 0.14)',
        ],
        true,
        { 'lovelace-background': 'linear-gradient(135deg, #0f1b33, #2a1740)' },
      ),
      { 'ha-card-backdrop-filter': 'blur(12px)' },
    ),
  },
  {
    id: 'slate',
    name: 'Slate',
    group: 'original',
    blurb: 'Neutral blue-grey for any room.',
    doc: doc(
      mode(['#3d5a73', '#b4562b', '#f1f3f5', '#ffffff', '#1c2329', '#52606c', '#dde2e6']),
      mode(['#9ab8d1', '#f0a67a', '#15191d', '#1d2227', '#e8ecef', '#a3adb6', '#2b3239'], true),
    ),
  },
  {
    id: 'sand',
    name: 'Sand',
    group: 'original',
    blurb: 'Warm neutral stone and clay.',
    doc: doc(
      mode(['#8a5a2b', '#3f7a6e', '#f4eee4', '#fffbf5', '#2e2a24', '#645b4e', '#e6dccc']),
      mode(['#d9b382', '#7cc4b4', '#1a1713', '#24201a', '#efe8dc', '#b5a995', '#352f26'], true),
    ),
  },
  {
    id: 'forest',
    name: 'Forest',
    group: 'original',
    blurb: 'Deep greens with an amber spark.',
    doc: doc(
      mode(['#2f6b3f', '#a35a14', '#eef3ec', '#fbfdfa', '#17261b', '#4a5d4e', '#d5e0d3']),
      mode(['#7bc98a', '#e5b567', '#0f1a13', '#16241a', '#e3efe5', '#a1b8a5', '#243629'], true),
    ),
  },
  {
    id: 'ocean',
    name: 'Ocean',
    group: 'original',
    blurb: 'Teal depths and coral.',
    doc: doc(
      mode(['#0b6a8a', '#c2492f', '#eaf3f7', '#fbfeff', '#0f2530', '#46606d', '#cfe0e8']),
      mode(['#5ac8e8', '#ff9a85', '#08161e', '#0f212b', '#e2f1f6', '#9fbac6', '#1b3541'], true),
    ),
  },
  {
    id: 'desert',
    name: 'Desert',
    group: 'original',
    blurb: 'Terracotta, dust and oasis teal.',
    doc: doc(
      mode(['#a8431c', '#1f7a7a', '#f8efe4', '#fffaf3', '#33231a', '#6a5444', '#ead9c4']),
      mode(['#f0956a', '#62c4c0', '#1e1511', '#2a1e18', '#f7e9dc', '#c3a891', '#402e24'], true),
    ),
  },
  {
    id: 'arcade',
    name: 'Arcade',
    group: 'original',
    blurb: 'Neon magenta and cyan, 80s cabinet.',
    doc: doc(
      mode(['#a3109b', '#0a7a86', '#f7f1ff', '#ffffff', '#1a0f33', '#55477a', '#e1d3f5']),
      mode(['#ff4fd8', '#3df5ff', '#0b0620', '#150c33', '#f5f0ff', '#b9a9e8', '#2e1a66'], true),
    ),
  },
  {
    id: 'cassette',
    name: 'Cassette',
    group: 'original',
    blurb: 'Faded tape-deck red and cream.',
    doc: doc(
      mode(['#c0392b', '#1d6b8a', '#f3e9d2', '#fbf4e3', '#2c2418', '#6a5a40', '#dccfae']),
      mode(['#ff8a5b', '#5fd0c7', '#1d1a14', '#29251c', '#f1e7cf', '#bfb28f', '#3d372a'], true),
    ),
  },
  {
    id: 'sorbet',
    name: 'Sorbet',
    group: 'original',
    blurb: 'Pastel raspberry and mint.',
    doc: doc(
      mode(['#b83d6a', '#278471', '#fff4f6', '#ffffff', '#3a2430', '#6d5160', '#f3dce2']),
      mode(['#ffa3c2', '#8eead2', '#2a1c22', '#35242c', '#ffeef3', '#d6b4c1', '#4a3540'], true),
    ),
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    group: 'original',
    blurb: 'Pastel lilac and rose.',
    doc: doc(
      mode(['#6b4fc0', '#b45582', '#f5f2fc', '#ffffff', '#2a2340', '#5d5578', '#e3ddf3']),
      mode(['#c3b1ff', '#ffb7d5', '#1d1930', '#272240', '#f0ecff', '#bab3d8', '#3a3360'], true),
    ),
  },
  {
    id: 'hi-vis',
    name: 'Hi-Vis',
    group: 'original',
    blurb: 'High contrast green on black, strong edges.',
    doc: doc(
      mode(['#006400', '#8a0000', '#ffffff', '#ffffff', '#000000', '#262626', '#000000']),
      mode(['#39ff14', '#ffea00', '#000000', '#000000', '#ffffff', '#f0f0f0', '#39ff14'], true),
    ),
  },
  {
    id: 'ink',
    name: 'Ink',
    group: 'original',
    blurb: 'Black and white, nothing in between.',
    doc: doc(
      mode(['#000000', '#b00020', '#f2f2f2', '#ffffff', '#000000', '#1f1f1f', '#000000']),
      mode(['#ffffff', '#ff9100', '#0a0a0a', '#000000', '#ffffff', '#e0e0e0', '#ffffff'], true),
    ),
  },
  {
    id: 'spring',
    name: 'Spring',
    group: 'original',
    blurb: 'Fresh leaf green and blossom pink.',
    doc: doc(
      mode(['#2f7d32', '#c2185b', '#f4faee', '#ffffff', '#1f2e1c', '#4f6549', '#dcebd0']),
      mode(['#9be07a', '#ff9ec7', '#121c10', '#1a2a17', '#eaf6e3', '#a8c29f', '#2a4025'], true),
    ),
  },
  {
    id: 'summer',
    name: 'Summer',
    group: 'original',
    blurb: 'Sky blue and sun yellow.',
    doc: doc(
      mode(['#0a76c2', '#b25e00', '#fff9e6', '#fffdf5', '#1c2a33', '#4e5f6b', '#f0e4b8']),
      mode(['#ffd23f', '#4fc3f7', '#0e2233', '#15324a', '#fff7da', '#b3c7d6', '#24506f'], true),
    ),
  },
  {
    id: 'autumn',
    name: 'Autumn',
    group: 'original',
    blurb: 'Rust, olive and warm paper.',
    doc: doc(
      mode(['#9c3d10', '#5c6b1a', '#f7ece0', '#fff8f0', '#321d12', '#6b4e3d', '#e9d3bd']),
      mode(['#f4a259', '#c9d46a', '#1f130d', '#2c1c13', '#f8e8d8', '#cdae95', '#46301f'], true),
    ),
  },
  {
    id: 'winter',
    name: 'Winter',
    group: 'original',
    blurb: 'Icy blue with a violet touch.',
    doc: doc(
      mode(['#1b6a94', '#7a3f8f', '#edf2f7', '#ffffff', '#14202c', '#4b5b6b', '#d3dde7']),
      mode(['#b6e3ff', '#d9c2ff', '#0e1620', '#162230', '#eaf3fb', '#a8b9ca', '#263a4f'], true),
    ),
  },
  {
    id: 'oled-amber',
    name: 'OLED Amber',
    group: 'original',
    blurb: 'Pure black with amber, for wall tablets.',
    note: 'Pure black in dark mode only. Keep the screen in dark mode.',
    doc: doc(
      mode(['#8a5200', '#a63a00', '#f6f1e8', '#ffffff', '#1c1812', '#5a5245', '#e4dccc']),
      mode(['#ffb000', '#ff6e40', '#000000', '#0a0a0a', '#f5efe6', '#a89f90', '#1c1a16'], true),
    ),
  },
  {
    id: 'oled-green',
    name: 'OLED Green',
    group: 'original',
    blurb: 'Pure black with terminal green, for wall tablets.',
    note: 'Pure black in dark mode only. Keep the screen in dark mode.',
    doc: doc(
      mode(['#17683a', '#0b6478', '#eff5f1', '#ffffff', '#102016', '#4b6154', '#d6e3da']),
      mode(['#3ddc84', '#6ee7f9', '#000000', '#090c0a', '#e8f5ec', '#93a89a', '#16201a'], true),
    ),
  },
  {
    id: 'glass-aqua',
    name: 'Glass Aqua',
    group: 'original',
    blurb: 'Frosted cards over an aqua gradient.',
    note: 'Uses blur and transparency. Can be slow on old tablets.',
    doc: doc(
      mode(
        [
          '#0a6e86',
          '#b0457a',
          '#d9f0f2',
          'rgba(255, 255, 255, 0.6)',
          '#0d2a33',
          '#3f5f6a',
          'rgba(13, 42, 51, 0.14)',
        ],
        false,
        { 'lovelace-background': 'linear-gradient(135deg, #d9f0f2, #e3ecfb)' },
      ),
      mode(
        [
          '#6fe0f0',
          '#ffa6c9',
          '#062a33',
          'rgba(255, 255, 255, 0.08)',
          '#e9fbff',
          '#a8c8d0',
          'rgba(255, 255, 255, 0.14)',
        ],
        true,
        { 'lovelace-background': 'linear-gradient(135deg, #062a33, #1a2450)' },
      ),
      { 'ha-card-backdrop-filter': 'blur(12px)' },
    ),
  },
  {
    id: 'glass-rose',
    name: 'Glass Rose',
    group: 'original',
    blurb: 'Frosted cards over a rose gradient.',
    note: 'Uses blur and transparency. Can be slow on old tablets.',
    doc: doc(
      mode(
        [
          '#a8326a',
          '#1d6f8f',
          '#fbe3ec',
          'rgba(255, 255, 255, 0.62)',
          '#2e1623',
          '#664553',
          'rgba(46, 22, 35, 0.14)',
        ],
        false,
        { 'lovelace-background': 'linear-gradient(135deg, #fbe3ec, #efe3fb)' },
      ),
      mode(
        [
          '#ff9cc4',
          '#8fd8ff',
          '#2a1020',
          'rgba(255, 255, 255, 0.08)',
          '#ffeef5',
          '#d2adbd',
          'rgba(255, 255, 255, 0.14)',
        ],
        true,
        { 'lovelace-background': 'linear-gradient(135deg, #2a1020, #2b1a47)' },
      ),
      { 'ha-card-backdrop-filter': 'blur(12px)' },
    ),
  },
  {
    id: 'glass-graphite',
    name: 'Glass Graphite',
    group: 'original',
    blurb: 'Frosted cards over a graphite gradient.',
    note: 'Uses blur and transparency. Can be slow on old tablets.',
    doc: doc(
      mode(
        [
          '#3f4a5a',
          '#a04a1c',
          '#e6e8ec',
          'rgba(255, 255, 255, 0.6)',
          '#171a1f',
          '#4a525e',
          'rgba(23, 26, 31, 0.14)',
        ],
        false,
        { 'lovelace-background': 'linear-gradient(135deg, #e6e8ec, #d9dde5)' },
      ),
      mode(
        [
          '#c3ccd9',
          '#ffb074',
          '#14161a',
          'rgba(255, 255, 255, 0.07)',
          '#f0f2f5',
          '#aab2be',
          'rgba(255, 255, 255, 0.14)',
        ],
        true,
        { 'lovelace-background': 'linear-gradient(135deg, #14161a, #262b33)' },
      ),
      { 'ha-card-backdrop-filter': 'blur(12px)' },
    ),
  },
  {
    id: 'ayu',
    name: 'Ayu Mirage',
    group: 'inspired',
    blurb: 'Amber on blue-grey mirage.',
    inspiredBy: { name: 'Ayu', author: 'Ike Ku', url: 'https://github.com/ayu-theme/ayu-colors' },
    doc: doc(
      mode(['#a85a00', '#197cac', '#fafafa', '#ffffff', '#3b4048', '#5f6670', '#e3e5e8']),
      mode(['#ffcc66', '#73d0ff', '#1f2430', '#272d38', '#cccac2', '#9ca0ab', '#343b4a'], true),
    ),
  },
  {
    id: 'catppuccin',
    name: 'Catppuccin Latte & Mocha',
    group: 'inspired',
    blurb: 'Soft pastel accents, latte by day and mocha by night.',
    inspiredBy: { name: 'Catppuccin', author: 'Catppuccin', url: 'https://catppuccin.com' },
    doc: doc(
      mode(['#1e66f5', '#8839ef', '#eff1f5', '#ffffff', '#4c4f69', '#5c5f77', '#ccd0da']),
      mode(['#89b4fa', '#f5c2e7', '#1e1e2e', '#313244', '#cdd6f4', '#a6adc8', '#45475a'], true),
    ),
  },
  {
    id: 'cobalt2',
    name: 'Cobalt Gold',
    group: 'inspired',
    blurb: 'Cobalt blue with a gold primary.',
    inspiredBy: { name: 'Cobalt2', author: 'Wes Bos', url: 'https://github.com/wesbos/cobalt2' },
    doc: doc(
      mode(['#0b5394', '#b15a00', '#eef4f9', '#ffffff', '#122738', '#44596b', '#cfdce8']),
      mode(['#ffc600', '#9effff', '#15232d', '#193549', '#ffffff', '#b9cbd8', '#234e6d'], true),
    ),
  },
  {
    id: 'dracula',
    name: 'Dracula Night',
    group: 'inspired',
    blurb: 'Purple and pink on deep indigo.',
    inspiredBy: { name: 'Dracula', author: 'Zeno Rocha', url: 'https://draculatheme.com' },
    doc: doc(
      mode(['#6a3fc0', '#b0306f', '#f8f8f2', '#ffffff', '#1f1f2e', '#565a75', '#e2e0ea']),
      mode(['#bd93f9', '#ff79c6', '#282a36', '#343746', '#f8f8f2', '#b9bfd8', '#44475a'], true),
    ),
  },
  {
    id: 'everforest',
    name: 'Everforest Moss',
    group: 'inspired',
    blurb: 'Soft green forest tones, easy on the eyes.',
    inspiredBy: {
      name: 'Everforest',
      author: 'sainnhe',
      url: 'https://github.com/sainnhe/everforest',
    },
    doc: doc(
      mode(['#5a7a1f', '#b8562e', '#fdf6e3', '#fffbef', '#3c4841', '#5c6a72', '#e6e2cc']),
      mode(['#a7c080', '#e69875', '#2d353b', '#343f44', '#d3c6aa', '#aeb8a6', '#475258'], true),
    ),
  },
  {
    id: 'github',
    name: 'GitHub Light & Dark',
    group: 'inspired',
    blurb: 'Clean Primer blues and neutral greys.',
    inspiredBy: { name: 'GitHub Primer', author: 'GitHub', url: 'https://primer.style' },
    doc: doc(
      mode(['#0969da', '#bf3989', '#f6f8fa', '#ffffff', '#1f2328', '#59636e', '#d1d9e0']),
      mode(['#58a6ff', '#f778ba', '#0d1117', '#161b22', '#e6edf3', '#9198a1', '#30363d'], true),
    ),
  },
  {
    id: 'gruvbox',
    name: 'Gruvbox Retro',
    group: 'inspired',
    blurb: 'Warm retro browns with a teal link.',
    inspiredBy: {
      name: 'Gruvbox',
      author: 'Pavel Pertsev',
      url: 'https://github.com/morhetz/gruvbox',
    },
    doc: doc(
      mode(['#076678', '#af3a03', '#fbf1c7', '#f9f5d7', '#3c3836', '#665c54', '#d5c4a1']),
      mode(['#83a598', '#fe8019', '#282828', '#3c3836', '#ebdbb2', '#bdae93', '#504945'], true),
    ),
  },
  {
    id: 'kanagawa',
    name: 'Kanagawa Wave',
    group: 'inspired',
    blurb: 'Ukiyo-e indigo and parchment.',
    inspiredBy: {
      name: 'Kanagawa',
      author: 'rebelot',
      url: 'https://github.com/rebelot/kanagawa.nvim',
    },
    doc: doc(
      mode(['#4d699b', '#a65800', '#f2ecbc', '#f7f2cf', '#43436c', '#5d5d7a', '#d5cea3']),
      mode(['#7e9cd8', '#ffa066', '#1f1f28', '#2a2a37', '#dcd7ba', '#a8a48b', '#363646'], true),
    ),
  },
  {
    id: 'material',
    name: 'Material Violet',
    group: 'inspired',
    blurb: 'Material baseline purple with teal.',
    inspiredBy: { name: 'Material Design', author: 'Google', url: 'https://m3.material.io' },
    doc: doc(
      mode(['#6200ee', '#018382', '#fafafa', '#ffffff', '#212121', '#5f5f5f', '#e0e0e0']),
      mode(['#bb86fc', '#03dac6', '#121212', '#1e1e1e', '#e6e6e6', '#b0b0b0', '#2c2c2c'], true),
    ),
  },
  {
    id: 'monokai',
    name: 'Monokai Lime',
    group: 'inspired',
    blurb: 'Lime and magenta on charcoal.',
    inspiredBy: { name: 'Monokai', author: 'Wimer Hazenberg', url: 'https://monokai.pro' },
    doc: doc(
      mode(['#4d7a0a', '#c2185b', '#f5f5ef', '#ffffff', '#272822', '#5e5c4d', '#e1e0d4']),
      mode(['#a6e22e', '#fa4d8b', '#1e1f1c', '#272822', '#f8f8f2', '#b0ad98', '#3e3d32'], true),
    ),
  },
  {
    id: 'night-owl',
    name: 'Night Owl Navy',
    group: 'inspired',
    blurb: 'Deep navy with soft periwinkle.',
    inspiredBy: {
      name: 'Night Owl',
      author: 'Sarah Drasner',
      url: 'https://github.com/sdras/night-owl-vscode-theme',
    },
    doc: doc(
      mode(['#3a60b0', '#994cc3', '#f0f0f0', '#fbfbfb', '#403f53', '#5a5970', '#d9d9d9']),
      mode(['#82aaff', '#c792ea', '#011627', '#0b2942', '#d6deeb', '#99a8c4', '#1d3b53'], true),
    ),
  },
  {
    id: 'nightfox',
    name: 'Nightfox & Dayfox',
    group: 'inspired',
    blurb: 'Dusky blue night, warm fox-white day.',
    inspiredBy: {
      name: 'Nightfox',
      author: 'EdenEast',
      url: 'https://github.com/EdenEast/nightfox.nvim',
    },
    doc: doc(
      mode(['#2848a9', '#955f61', '#f6f2ee', '#fffcf8', '#3d2b5a', '#5f5870', '#e4dcd4']),
      mode(['#719cd6', '#dbc074', '#192330', '#212e3f', '#cdcecf', '#a0a7b3', '#2b3b51'], true),
    ),
  },
  {
    id: 'nord',
    name: 'Nord Frost',
    group: 'inspired',
    blurb: 'Cool arctic blues on polar night.',
    inspiredBy: { name: 'Nord', author: 'Arctic Ice Studio', url: 'https://www.nordtheme.com' },
    doc: doc(
      mode(['#3b6a8f', '#a0613a', '#eceff4', '#f8f9fb', '#2e3440', '#4c566a', '#d8dee9']),
      mode(['#88c0d0', '#ebcb8b', '#2e3440', '#3b4252', '#eceff4', '#b8c2d4', '#4c566a'], true, {
        'error-color': '#ff9a90',
      }),
    ),
  },
  {
    id: 'one-dark',
    name: 'One Dark Pro',
    group: 'inspired',
    blurb: 'Familiar editor greys with a bright blue.',
    inspiredBy: { name: 'One Dark', author: 'Atom', url: 'https://github.com/atom/atom' },
    doc: doc(
      mode(['#3b66c9', '#a626a4', '#eef0f4', '#fafafa', '#383a42', '#5b5f6b', '#dcdfe4']),
      mode(['#61afef', '#c678dd', '#21252b', '#282c34', '#abb2bf', '#959eae', '#3e4451'], true),
    ),
  },
  {
    id: 'poimandres',
    name: 'Poimandres Mint',
    group: 'inspired',
    blurb: 'Mint and sky on ink.',
    inspiredBy: {
      name: 'Poimandres',
      author: 'drcmda',
      url: 'https://github.com/drcmda/poimandres-theme',
    },
    doc: doc(
      mode(['#00695c', '#3f6fb5', '#f4f7f9', '#ffffff', '#1b1e28', '#4f5d70', '#d9e1e8']),
      mode(['#5de4c7', '#add7ff', '#1b1e28', '#252b37', '#e4f0fb', '#a6accd', '#303340'], true),
    ),
  },
  {
    id: 'rose-pine',
    name: 'Rose Pine Bloom',
    group: 'inspired',
    blurb: 'Muted rose and iris, calm and low contrast.',
    inspiredBy: { name: 'Rosé Pine', author: 'Rosé Pine', url: 'https://rosepinetheme.com' },
    doc: doc(
      mode(['#7a5aa6', '#a75c71', '#faf4ed', '#fffaf3', '#575279', '#675f80', '#dfdad9']),
      mode(['#c4a7e7', '#ebbcba', '#191724', '#1f1d2e', '#e0def4', '#a09cb8', '#26233a'], true),
    ),
  },
  {
    id: 'solarized',
    name: 'Solarized Glow',
    group: 'inspired',
    blurb: 'Balanced low-glare cream and teal.',
    inspiredBy: {
      name: 'Solarized',
      author: 'Ethan Schoonover',
      url: 'https://ethanschoonover.com/solarized/',
    },
    doc: doc(
      mode(['#1c6ea4', '#9e6900', '#fdf6e3', '#fffdf5', '#073642', '#476268', '#eee8d5']),
      mode(['#4aa3e0', '#bc9519', '#002b36', '#073642', '#eee8d5', '#a0b0b0', '#17505e'], true),
    ),
  },
  {
    id: 'synthwave',
    name: 'Synthwave Sunset',
    group: 'inspired',
    blurb: 'Hot pink and cyan on dark purple.',
    inspiredBy: {
      name: 'Synthwave 84',
      author: 'Robb Owen',
      url: 'https://github.com/robb0wen/synthwave-vscode',
    },
    doc: doc(
      mode(['#b3158a', '#0b7f87', '#fbf4ff', '#ffffff', '#2b2140', '#5e5078', '#e7d9f3']),
      mode(['#ff7edb', '#36f9f6', '#241b2f', '#2a2139', '#f4eefc', '#bcb0d0', '#3d3358'], true),
    ),
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night Lights',
    group: 'inspired',
    blurb: 'Neon-lit city blues and violets.',
    inspiredBy: {
      name: 'Tokyo Night',
      author: 'enkia',
      url: 'https://github.com/enkia/tokyo-night-vscode-theme',
    },
    doc: doc(
      mode(['#3b5fcf', '#8a45e0', '#e1e2e7', '#f2f3f7', '#1f2335', '#4a5272', '#c4c8da']),
      mode(['#7aa2f7', '#bb9af7', '#1a1b26', '#24283b', '#c0caf5', '#9aa5ce', '#3b4261'], true),
    ),
  },
  {
    id: 'zenburn',
    name: 'Zenburn Calm',
    group: 'inspired',
    blurb: 'Low-contrast sage on soft grey.',
    inspiredBy: {
      name: 'Zenburn',
      author: 'Jani Nurminen',
      url: 'https://github.com/jnurmine/Zenburn',
    },
    doc: doc(
      mode(['#3e6b3e', '#a34a4a', '#f3f1e7', '#fffdf4', '#3f3f3f', '#5a5a50', '#dedccc']),
      mode(['#8fb28f', '#e0aeae', '#3f3f3f', '#4a4a4a', '#dcdccc', '#cfcfbf', '#5f5f5f'], true, {
        'error-color': '#ffaaa2',
        'info-color': '#94cbff',
        'success-color': '#a3dba7',
      }),
    ),
  },
];

export const THEME_PRESET_LIBRARY: ThemePresetLibrary = { version: '1.0.0', presets: PRESETS };
