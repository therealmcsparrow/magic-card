// Standalone animation studio (in-memory library) for the harness: ?theme=light|dark, ?empty=1 for
// an empty library, ?usage=1 for used-by counts, ?missing=1 to show the studio without magic-card,
// ?v2=1 for the studio v2 documents (icon parts, card parts, states, bindings; e2e scenarios).
const params = new URLSearchParams(location.search);
document.documentElement.dataset.theme = params.get('theme') || 'light';

// the harness has no HA icon database: a fake mdi pack serves the real MDI path data (icon parts,
// drawing snaps). Only the icons the v2 documents use.
const MDI_PATHS = {
  'mdi:bell-ring': 'M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21M19.75,3.19L18.33,4.61C20.04,6.3 21,8.6 21,11H23C23,8.07 21.84,5.25 19.75,3.19M1,11H3C3,8.6 3.96,6.3 5.67,4.61L4.25,3.19C2.16,5.25 1,8.07 1,11Z',
  'mdi:bell': 'M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21',
  'mdi:thermometer': 'M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z',
};
// the icon animator's dev bundle (0.0.34, .harness-build/icon-anim): its whole path table too
if (window.__iconAnim) Object.assign(MDI_PATHS, window.__iconAnim.MDI_PATHS);
if (params.get('v2') === '1' || window.__iconAnim) window.customIconsets = { mdi: async (name) => (MDI_PATHS[`mdi:${name}`] ? { path: MDI_PATHS[`mdi:${name}`], viewBox: '0 0 24 24' } : undefined) };

const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2l3 7h7l-5.5 4.5 2 7.5-6.5-4.5-6.5 4.5 2-7.5L2 9h7z"/></svg>';
const LIBRARY = {
  bell: {
    id: 'bell', name: 'Doorbell wiggle', kind: 'keyframes', duration: 1.2, easing: 'ease-in-out', origin: '50% 0',
    keyframes: [
      { at: 0, transform: { rotate: 0 } }, { at: 15, transform: { rotate: 6 } }, { at: 30, transform: { rotate: -5 } },
      { at: 45, transform: { rotate: 3, scale: 1.06 }, filter: 'drop-shadow(0 0 6px var(--mc-anim-c))' }, { at: 60, transform: { rotate: -2 } }, { at: 100, transform: { rotate: 0 } },
    ],
  },
  hearts: { id: 'hearts', name: 'Hearts', kind: 'particles', duration: 3, easing: 'ease-out', particles: { shape: { emoji: '💖' }, count: 7, direction: 'rise', size: [12, 22], spin: 40, layer: 'back' } },
  stars: { id: 'stars', name: 'Falling stars', kind: 'particles', duration: 4, easing: 'linear', particles: { shape: { svg: STAR }, count: 10, direction: 'fall', size: [8, 16], colors: ['#ffc107', '#ff9800', '#fff176'], spin: 180 } },
  burst: { id: 'burst', name: 'Burst', kind: 'particles', duration: 1.6, easing: 'ease-out', particles: { count: 16, direction: 'burst', size: [6, 10], spread: 90, colors: ['#e91e63', '#03a9f4', '#8bc34a'], gravity: 0.4 } },
  loop: { id: 'loop', name: 'Loop the loop', kind: 'path', duration: 2.4, easing: 'linear', path: { d: 'M0 0 C 80 -140 200 140 280 0 S 80 -80 0 0', units: 'percent', follow_rotation: false, subject: 'icon' } },
  wave: { id: 'wave', name: 'Row wave', kind: 'sequence', steps: [{ animation: 'pop', delay: 0 }, { animation: 'custom:bell', delay: 0.1 }, { animation: 'glow-pulse', delay: 0, duration: 0.8 }], loop: true, stagger: { children: true, delay: 0.25 } },
  snowy: { id: 'snowy', name: 'Snowy (from preset)', kind: 'particles', duration: 4, easing: 'linear', particles: { preset: 'snow-fall', intensity: 10 } },
};

const k = (at, v) => ({ at, ...v });
const V2_LIBRARY = {
  // icon parts: a bell to split, rig and animate part by part
  rbell: { id: 'rbell', name: 'Ringing bell', kind: 'keyframes', version: 1, duration: 1.6, easing: 'ease-in-out', target: 'icon', keyframes: [k(0, { opacity: 1 }), k(100, { opacity: 1 })] },
  // card parts: name, state and background move on the card tile
  cardparts: {
    id: 'cardparts', name: 'Card parts', kind: 'keyframes', version: 1, duration: 2, easing: 'ease-in-out', target: 'element', origin: 'center',
    keyframes: [k(0, { opacity: 1 }), k(100, { opacity: 1 })],
    tracks: [
      { target: 'name', keyframes: [k(0, { transform: { x: 0 } }), k(50, { transform: { x: 12 } }), k(100, { transform: { x: 0 } })] },
      { target: 'state', keyframes: [k(0, { transform: { scale: 1 } }), k(50, { transform: { scale: 1.25 } }), k(100, { transform: { scale: 1 } })] },
      { target: 'background', keyframes: [k(0, { opacity: 1 }), k(50, { opacity: 0.55 }), k(100, { opacity: 1 })] },
    ],
  },
  // states: pulse while on, rest while off
  lamp: {
    id: 'lamp', name: 'Lamp states', kind: 'keyframes', version: 1, duration: 1.2, easing: 'ease-in-out', target: 'icon',
    keyframes: [k(0, { transform: { scale: 1 } }), k(50, { transform: { scale: 1.2 } }), k(100, { transform: { scale: 1 } })],
    clips: [
      { when: { state: 'on' }, animation: 'self', transition: 'cut' },
      { when: { state: 'off' }, animation: 'none', transition: 'cut' },
    ],
  },
  // value binding: the icon spins at the fan's percentage
  fan: {
    id: 'fan', name: 'Fan speed', kind: 'keyframes', version: 1, duration: 2, target: 'icon',
    keyframes: [k(0, { opacity: 1 }), k(100, { opacity: 1 })],
    bindings: [{ target: 'icon', property: 'rotate_speed', input: { attribute: 'percentage', min: 0, max: 100 }, output: [0, 720] }],
  },
};
if (params.get('v2') === '1') Object.assign(LIBRARY, V2_LIBRARY);

const studio = document.createElement('magic-card-animation-studio');
studio.standalone = true;
studio.library = params.get('empty') === '1' ? {} : LIBRARY;
if (params.get('usage') === '1') studio.usage = { bell: 3, hearts: 1, wave: 2 };
const events = [];
for (const name of ['mc-anim-save', 'mc-anim-duplicate', 'mc-anim-delete', 'mc-anim-select']) {
  studio.addEventListener(name, (e) => events.push({ name, detail: { ...e.detail } }));
}
document.body.appendChild(studio);
window.__studio = { el: studio, events, LIBRARY };
