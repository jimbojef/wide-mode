// Injected into the page. One click turns "Wide Mode" on, the next click turns it off.
// Applies to the current tab only, until reload or the next click.
function toggleWide() {
  const KEY = '__breitModus';
  const root = document.documentElement;
  const old = window[KEY];

  // OFF: restore everything
  if (old && old.on) {
    for (let i = old.restore.length - 1; i >= 0; i--) {
      const [el, prop, val, prio] = old.restore[i];
      if (val) el.style.setProperty(prop, val, prio);
      else el.style.removeProperty(prop);
    }
    old.restore.length = 0;
    old.timers.forEach(clearTimeout);
    if (old.origZoom) root.style.setProperty('zoom', old.origZoom);
    else root.style.removeProperty('zoom');
    old.on = false;
    return 'off';
  }

  // ON
  const state = (window[KEY] = {
    on: true,
    restore: [],
    timers: [],
    done: new WeakSet(),
    frozen: new WeakSet(),
    origZoom: root.style.getPropertyValue('zoom'),
  });

  const set = (el, prop, val) => {
    state.restore.push([el, prop, el.style.getPropertyValue(prop), el.style.getPropertyPriority(prop)]);
    el.style.setProperty(prop, val, 'important');
  };

  const SKIP = new Set(['IMG', 'SVG', 'VIDEO', 'CANVAS', 'IFRAME', 'PICTURE', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA']);

  function unlock() {
    const vw = window.innerWidth;
    const actions = [];
    // Read first, write afterwards (avoids many layout recalculations)
    for (const el of document.body.querySelectorAll('*')) {
      if (state.done.has(el) || SKIP.has(el.tagName.toUpperCase())) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.position === 'fixed' || cs.position === 'absolute') continue;
      const w = el.offsetWidth;
      const parent = el.parentElement;
      const pcs = parent ? getComputedStyle(parent) : null;
      const inFlex = pcs && (pcs.display.includes('flex') || pcs.display.includes('grid'));

      // 1) Remove fixed max-width
      if (cs.maxWidth.endsWith('px') && w >= 0.3 * vw) {
        actions.push([el, 'max-width', 'none']);
        state.done.add(el);
      }
      // 2) Centered container with fixed width
      const ml = parseFloat(cs.marginLeft);
      const mr = parseFloat(cs.marginRight);
      if (!inFlex && parent && ml > 16 && Math.abs(ml - mr) < 2 && w >= 0.3 * vw && w < parent.clientWidth - 2 * ml + 4) {
        actions.push([el, 'width', 'auto'], [el, 'max-width', 'none']);
        state.done.add(el);
      }
      // 3) Expand scroll containers (e.g. table wrappers).
      //    Their children (columns) keep their original width.
      if ((cs.overflowX === 'auto' || cs.overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 2) {
        actions.push([el, 'overflow-x', 'visible'], [el, 'max-width', 'none']);
        state.done.add(el);
        for (const c of el.children) {
          if (state.frozen.has(c) || SKIP.has(c.tagName.toUpperCase())) continue;
          const cw = c.offsetWidth;
          actions.push([c, 'width', cw + 'px'], [c, 'min-width', cw + 'px'], [c, 'max-width', 'none'], [c, 'flex', '0 0 auto']);
          state.frozen.add(c);
        }
      }
      // 4) Tables: freeze the original width
      //    so columns do not grow with the page
      if (el.tagName === 'TABLE' && !state.frozen.has(el) && w > 0) {
        actions.push([el, 'width', w + 'px'], [el, 'min-width', w + 'px'], [el, 'max-width', 'none']);
        state.frozen.add(el);
      }
    }
    actions.forEach(([el, p, v]) => set(el, p, v));
  }

  // Shrink the page until nothing scrolls sideways (never below 40 %)
  function fit() {
    let z = parseFloat(root.style.getPropertyValue('zoom')) || 1;
    for (let i = 0; i < 6; i++) {
      const ratio = root.scrollWidth / root.clientWidth;
      if (ratio <= 1.005 || z <= 0.4) break;
      z = Math.max(0.4, z / ratio);
      root.style.setProperty('zoom', String(z), 'important');
    }
  }

  const run = () => { if (state.on) { unlock(); fit(); } };
  run();
  // Handle content that loads later
  state.timers.push(setTimeout(run, 800), setTimeout(run, 2500));
  return 'on';
}
