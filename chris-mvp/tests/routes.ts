import fs from 'node:fs';
import path from 'node:path';
/** Every built page, from dist/. Run `npm run build` first. */
export function routes(): string[] {
  const dist = path.resolve('dist');
  const out: string[] = [];
  const walk = (d: string) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (f.name === 'index.html') out.push('/' + path.relative(dist, d).split(path.sep).join('/') + (d === dist ? '' : '/'));
    }
  };
  walk(dist);
  return out.map((r) => r.replace(/^\/\/?/, '/')).sort();
}

/** Waits until a map has its markers and the camera has stopped moving (fly-ins can take a while on CI). */
export async function mapSettled(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const g = (window as unknown as { __gmap?: { map: { getSource: (id: string) => unknown; isMoving: () => boolean; loaded: () => boolean } } }).__gmap;
    return !!g?.map.getSource('pts') && !g.map.isMoving() && document.querySelectorAll('.pin, .cluster').length > 0;
  }, undefined, { timeout: 40_000 });
  // Markers are placed and spread on the frame after the last move.
  await page.waitForTimeout(200);
}
