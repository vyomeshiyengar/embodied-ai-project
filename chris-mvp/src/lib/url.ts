/** Build an internal link that respects the configured base path. */
export function href(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return (base + p).replace(/\/{2,}/g, '/');
}
export const sectorHref = (slug: string, page = '') => href(`/sectors/${slug}/${page ? page + '/' : ''}`);


export function fmtDate(d?: string | null): string {
  if (!d) return '';
  const [y, m, day] = d.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (!m) return String(y);
  return day ? `${months[m - 1]} ${day}, ${y}` : `${months[m - 1]} ${y}`;
}
