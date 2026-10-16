// Particle designer harness (dev/anim-particles-editor.html): mounts mc-anim-particles-editor alone
// in a column of ?w= px with a sample document (?doc=), like the studio does. Never shipped.
// The card bundle loads first (it defines the pickers and fields the editor uses by tag); the editor
// bundle is .harness-build/anim-particles-editor.js (scripts/scenarios-anim-particles.mjs builds it).
const q = new URLSearchParams(location.search);
document.documentElement.dataset.theme = q.get('theme') === 'dark' ? 'dark' : 'light';
document.documentElement.style.setProperty('--w', `${Number(q.get('w')) || 360}px`);

const base = { duration: 4, easing: 'linear', iterations: 'infinite', target: 'element', origin: 'center', version: 1, kind: 'particles' };
const look = { count: 12, direction: 'fall', speed: 1, size: [6, 12], colors: [], spin: 0, fade: true, spread: 100, gravity: 0, layer: 'back' };
const DOCS = {
  dot: { ...base, id: 'dots', name: 'Dots', particles: { ...look, colors: ['#ef4444', '#3b82f6', 'var(--mc-entity-color, currentColor)'] } },
  emoji: { ...base, id: 'hearts', name: 'Hearts', duration: 3, particles: { ...look, shape: { emoji: '💖' }, count: 8, direction: 'rise', size: [12, 20], spin: 30 } },
  icon: { ...base, id: 'leaves', name: 'Leaves', duration: 6, particles: { ...look, shape: { icon: 'mdi:leaf' }, count: 9, size: [12, 18], spin: 180, colors: ['#f97316', '#eab308', '#a16207'] } },
  svg: { ...base, id: 'stars', name: 'Stars', duration: 2, particles: { ...look, shape: { svg: '<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>' }, count: 10, direction: 'burst', size: [10, 16], spread: 80, colors: ['#eab308'], layer: 'front' } },
  orbit: { ...base, id: 'orbit', name: 'Orbit', duration: 3, particles: { ...look, count: 6, direction: 'orbit', size: [6, 8], spread: 70, fade: false } },
  preset: { ...base, id: 'snow', name: 'My snow', duration: 5, particles: { ...look, preset: 'snow-fall', intensity: 10 } },
  ring: { ...base, id: 'snake', name: 'Snake', duration: 3, particles: { ...look, preset: 'border-snake' } },
};

window.__events = [];
const el = document.createElement('mc-anim-particles-editor');
el.doc = structuredClone(DOCS[q.get('doc') || 'dot']);
el.addEventListener('doc-change', (e) => {
  window.__events.push({ label: e.detail.label, transient: !!e.detail.transient });
  el.doc = e.detail.doc;
});
document.getElementById('col').appendChild(el);
window.__pe = { el, root: () => el.shadowRoot, DOCS };
