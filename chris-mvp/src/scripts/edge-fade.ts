/**
 * Fade the edges of horizontally scrolling rows so they read as scrollable, not cut off
 * (design rule from docs/design/3d-city-map-learnings.md §3.6). Only fades an edge that has more content.
 * Markup: any element with [data-fade]. CSS lives in base.css.
 */
function sync(el: HTMLElement) {
  const more = el.scrollWidth > el.clientWidth + 2;
  el.toggleAttribute('data-fade-l', more && el.scrollLeft > 4);
  el.toggleAttribute('data-fade-r', more && el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
}

export function initEdgeFades(root: ParentNode = document) {
  root.querySelectorAll<HTMLElement>('[data-fade]').forEach((el) => {
    sync(el);
    if (el.dataset.fadeReady) return;
    el.dataset.fadeReady = '1';
    el.addEventListener('scroll', () => sync(el), { passive: true });
    new ResizeObserver(() => sync(el)).observe(el);
  });
}
