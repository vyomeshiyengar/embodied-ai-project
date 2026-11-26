/**
 * Category switcher, used on every page: an ARIA tabs pattern with a sliding indicator and
 * clearly visible directional panel transitions. Markup:
 *   <div class="cats" role="tablist" data-switch> <button role="tab" id aria-controls aria-selected> ... </div>
 *   <section role="tabpanel" id aria-labelledby hidden> ... </section>
 * Any element with data-activate="<tab id>" also selects that tab (e.g. matrix dots).
 * Reduced motion: no animation (handled in CSS through --dur tokens and html[data-motion]).
 */
function setThumb(list: HTMLElement) {
  const sel = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
  if (!sel) return;
  const vertical = list.getAttribute('aria-orientation') === 'vertical';
  list.style.setProperty('--thumb-x', `${sel.offsetLeft}px`);
  list.style.setProperty('--thumb-y', `${sel.offsetTop}px`);
  list.style.setProperty('--thumb-w', `${sel.offsetWidth}px`);
  list.style.setProperty('--thumb-h', `${sel.offsetHeight}px`);
  list.dataset.thumb = vertical ? 'v' : 'h';
}

export function select(tab: HTMLElement, focus = false) {
  const list = tab.closest<HTMLElement>('[data-switch]');
  if (!list) return;
  const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]')].filter((t) => t.closest('[data-switch]') === list);
  const prev = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
  if (prev === tab) { if (focus) tab.focus(); return; }
  const dir = prev && tabs.indexOf(tab) < tabs.indexOf(prev) ? 'from-left' : 'from-right';
  for (const t of tabs) {
    const on = t === tab;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls') || '');
    if (!panel) continue;
    if (on) {
      panel.hidden = false;
      panel.classList.remove('enter', 'from-left', 'from-right');
      void panel.offsetWidth; // restart the animation
      panel.classList.add('enter', dir);
      // Nested tab lists were measured while hidden: measure them again now.
      requestAnimationFrame(() => panel.querySelectorAll<HTMLElement>('[data-switch]').forEach(setThumb));
    } else {
      panel.hidden = true;
    }
  }
  setThumb(list);
  // Rows that scroll sideways on phones keep the chosen tab in view.
  if (list.scrollWidth > list.clientWidth + 2) list.scrollTo({ left: Math.max(0, tab.offsetLeft - 24), behavior: 'smooth' });
  if (focus) tab.focus();
  list.dispatchEvent(new CustomEvent('switch', { detail: { id: tab.id }, bubbles: true }));
}

function onKey(e: KeyboardEvent) {
  const tab = (e.target as HTMLElement).closest<HTMLElement>('[role="tab"]');
  const list = tab?.closest<HTMLElement>('[data-switch]');
  if (!tab || !list) return;
  const tabs = [...list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled]):not([hidden])')].filter((t) => t.closest('[data-switch]') === list);
  const i = tabs.indexOf(tab);
  const vertical = list.getAttribute('aria-orientation') === 'vertical';
  const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
  const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
  let j = -1;
  if (e.key === nextKey) j = (i + 1) % tabs.length;
  else if (e.key === prevKey) j = (i - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home') j = 0;
  else if (e.key === 'End') j = tabs.length - 1;
  if (j < 0) return;
  e.preventDefault();
  select(tabs[j], true);
}

export function initSwitchers(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-switch]').forEach((list) => {
    if (list.dataset.ready) { setThumb(list); return; }
    list.dataset.ready = '1';
    if (list.getAttribute('aria-orientation') !== 'vertical') list.setAttribute('data-fade', '');
    list.querySelectorAll<HTMLElement>('[role="tab"]').forEach((t) => {
      if (t.closest('[data-switch]') !== list) return;
      t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
      t.addEventListener('click', () => select(t));
    });
    list.addEventListener('keydown', onKey);
    requestAnimationFrame(() => setThumb(list));
  });
  root.querySelectorAll<HTMLElement>('[data-activate]').forEach((el) => {
    if (el.dataset.ready) return;
    el.dataset.ready = '1';
    el.addEventListener('click', (e) => {
      const tab = document.getElementById(el.dataset.activate || '');
      if (!tab) return;
      e.preventDefault();
      select(tab, true);
    });
  });
}

let bound = false;
export function bindSwitcherResize() {
  if (bound) return;
  bound = true;
  window.addEventListener('resize', () => document.querySelectorAll<HTMLElement>('[data-switch]').forEach(setThumb));
}

/** Open the tab named in the URL hash (#<item id> selects tab-<item id> and every tab above it). */
export function openFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id || id.includes('=')) return;
  const tab = document.getElementById(`tab-${id}`);
  const target = tab?.getAttribute('role') === 'tab' ? tab : document.getElementById(id);
  if (!target) return;
  const chain: HTMLElement[] = target === tab ? [tab] : [];
  let el: HTMLElement | null = target;
  while ((el = el.parentElement?.closest<HTMLElement>('[role="tabpanel"]') ?? null)) {
    const ctrl = document.getElementById(el.getAttribute('aria-labelledby') || '');
    if (ctrl) chain.unshift(ctrl);
  }
  if (!chain.length) return;
  chain.forEach((t) => select(t));
  target.scrollIntoView({ block: 'center' });
}
