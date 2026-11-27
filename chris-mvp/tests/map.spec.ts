import { test, expect, type Page } from '@playwright/test';
import { mapSettled } from './routes';

const ready = (page: Page) => page.waitForFunction(() => {
  const g = (window as unknown as { __gmap?: { map: { getSource: (id: string) => unknown } } }).__gmap;
  return !!g?.map.getSource('pts') && document.querySelectorAll('.pin, .cluster').length > 0;
}, undefined, { timeout: 40_000 });

test('global map: pins, sector filter from the URL, hover card and drawer', async ({ page }) => {
  await page.goto('/map/?sector=01', { waitUntil: 'load' });
  await ready(page);
  await expect(page.locator('[data-count]')).toHaveText('25 places');
  await expect(page.locator('[data-sector="01"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-toggle="pgh"]')).toHaveCount(0);
  await expect(page.locator('[data-share-link], [data-toggle]')).toHaveCount(0);
  await expect(page.locator('[data-sr-list] li')).toHaveCount(25);
  const pin = page.locator('.pin').first();
  await pin.hover();
  await expect(page.locator('[data-hover]')).toBeVisible();
  await pin.click();
  await expect(page.locator('[data-drawer]')).toBeVisible();
  await expect(page.locator('[data-drawer] .src')).toContainText('As of');
  await expect(page.locator('[data-drawer]')).not.toContainText('Added by');
  // No case-study lists or boxes on screen: the place list stays collapsed.
  await expect(page.locator('.sr-places')).not.toHaveAttribute('open', '');
});

test('global cases outside the US are on the map with sources and a review tag', async ({ page }) => {
  await page.goto('/map/?place=02-p-g02-singapore-xavier', { waitUntil: 'load' });
  await ready(page);
  await expect(page.locator('[data-drawer]')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('[data-drawer] h2')).toHaveText('Toa Payoh Central, Singapore');
  await expect(page.locator('[data-drawer] .tag', { hasText: 'Pending team review' })).toBeVisible();
  await expect(page.locator('[data-drawer] .src a').first()).toHaveAttribute('href', /htx\.gov\.sg/);
  await expect(page.locator('[data-drawer] .tag', { hasText: 'Approximate location' })).toHaveCount(0);
  // An openly licensed image shows with its credit.
  await page.goto('/map/?place=01-p-g01-wuhan-apollo-go', { waitUntil: 'load' });
  await ready(page);
  await expect(page.locator('[data-drawer] .pmedia figcaption')).toContainText('CC BY 4.0', { timeout: 15_000 });
});

test('map markers never overlap, so each keeps a clear tap target', async ({ page }) => {
  for (const url of ['/sectors/parks-public-space/map/', '/sectors/autonomous-mobility/map/', '/sectors/environmental-monitoring/map/', '/map/']) {
    await page.goto(url, { waitUntil: 'load' });
    await ready(page);
    await mapSettled(page);
    const overlaps = await page.$$eval('.maplibregl-marker.pin, .maplibregl-marker.cluster', (els) => {
      const rs = els.map((e) => ({ l: (e as HTMLElement).getAttribute('aria-label'), r: e.getBoundingClientRect() }));
      const out: string[] = [];
      for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
        const a = rs[i].r, b = rs[j].r;
        if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) out.push(`${rs[i].l} / ${rs[j].l}`);
      }
      return out;
    });
    expect(overlaps, url).toEqual([]);
  }
});
