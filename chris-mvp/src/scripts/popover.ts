/**
 * One small tooltip for the whole site (glossary terms, toolkit cards). It opens on hover or keyboard
 * focus, closes on leave, blur or Escape, and is linked to its trigger with aria-describedby. It holds
 * text only (nothing to click), so keyboard users never get trapped in it.
 */
let tip: HTMLDivElement | null = null;
let owner: HTMLElement | null = null;

function ensure() {
  if (tip && document.body.contains(tip)) return tip;
  tip = document.createElement('div');
  tip.id = 'eacp-tip';
  tip.className = 'tip';
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  document.body.append(tip);
  return tip;
}

export function hideTip() {
  if (!tip || tip.hidden) return;
  tip.hidden = true;
  owner?.removeAttribute('aria-describedby');
  owner = null;
}

export function showTip(target: HTMLElement, title: string, body: string) {
  const t = ensure();
  t.replaceChildren();
  if (title) { const h = document.createElement('strong'); h.textContent = title; t.append(h); }
  const p = document.createElement('span');
  p.textContent = body;
  t.append(p);
  t.hidden = false;
  owner = target;
  target.setAttribute('aria-describedby', t.id);
  place();
}

/** Below the trigger if there is room, else above; kept inside the viewport. Follows it on scroll. */
function place() {
  if (!tip || tip.hidden || !owner) return;
  if (!owner.isConnected) { hideTip(); return; }
  const r = owner.getBoundingClientRect();
  const w = tip.offsetWidth, h = tip.offsetHeight, m = 8;
  const left = Math.min(Math.max(m, r.left + r.width / 2 - w / 2), innerWidth - w - m);
  const below = r.bottom + m + h < innerHeight;
  tip.style.left = `${left + scrollX}px`;
  tip.style.top = `${(below ? r.bottom + m : r.top - h - m) + scrollY}px`;
}

/** Show a tooltip for every element matching `selector` inside `root`. Returns a cleanup function. */
export function bindTips(root: HTMLElement, selector: string, content: (el: HTMLElement) => { title?: string; body: string } | null) {
  const open = (e: Event) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>(selector);
    if (!el || !root.contains(el)) return;
    const c = content(el);
    if (c) showTip(el, c.title ?? '', c.body);
  };
  const close = (e: Event) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>(selector);
    if (el && el === owner) hideTip();
  };
  const key = (e: KeyboardEvent) => { if (e.key === 'Escape') hideTip(); };
  root.addEventListener('pointerover', open);
  root.addEventListener('focusin', open);
  root.addEventListener('pointerout', close);
  root.addEventListener('focusout', close);
  document.addEventListener('keydown', key);
  addEventListener('scroll', place, { passive: true });
  return () => {
    root.removeEventListener('pointerover', open);
    root.removeEventListener('focusin', open);
    root.removeEventListener('pointerout', close);
    root.removeEventListener('focusout', close);
    document.removeEventListener('keydown', key);
    removeEventListener('scroll', place);
    hideTip();
  };
}
