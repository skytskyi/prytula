(() => {
  const bar = document.getElementById('menu-bar');
  if (!bar) return;
  const toggles = [...bar.querySelectorAll('[data-toggle]')];
  const panels = Object.fromEntries([...bar.querySelectorAll('[data-panel]')].map(p => [p.dataset.panel, p]));
  const compact = window.matchMedia('(max-width: 1279px)'); // tablet/mobile: one "Меню" button opens a single combined panel
  let openKeys = [];

  function render() {
    const any = openKeys.length > 0;
    bar.classList.toggle('is-open', any);
    toggles.forEach(t => {
      const key = t.dataset.toggle;
      t.setAttribute('aria-expanded', String(compact.matches ? any && key === 'dirs' : openKeys.includes(key)));
      t.setAttribute('aria-controls', compact.matches ? 'panel-compact' : 'panel-' + key);
    });
    Object.entries(panels).forEach(([key, p]) => {
      const on = openKeys.includes(key);
      if (on) {
        p.hidden = false;
        requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('is-open')));
      } else {
        p.classList.remove('is-open');
        const done = () => { if (!openKeys.includes(key)) p.hidden = true; };
        p.addEventListener('transitionend', done, { once: true });
        setTimeout(done, 400);
      }
    });
  }

  function toggle(key) {
    if (compact.matches) openKeys = openKeys.length ? [] : ['compact'];
    else openKeys = openKeys.includes(key) ? [] : [key];
    render();
  }

  toggles.forEach(t => t.addEventListener('click', () => toggle(t.dataset.toggle)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && openKeys.length) { openKeys = []; render(); } });
  document.addEventListener('click', e => { if (openKeys.length && !bar.contains(e.target)) { openKeys = []; render(); } });
  bar.addEventListener('click', e => { if (e.target.closest('.link-card')) { openKeys = []; render(); } });
  compact.addEventListener('change', () => { openKeys = []; render(); });
})();
