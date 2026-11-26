import { test, expect, type Page } from '@playwright/test';

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
  await expect(page.locator('[data-share-link]')).toHaveText('Share a use case');
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

test('the map links to Share and shows shared posts from this browser', async ({ page }) => {
  await page.goto('/map/?sector=05', { waitUntil: 'load' });
  await ready(page);
  await expect(page.locator('[data-share-link]')).toHaveAttribute('href', /\/share\/\?sector=05$/);
  await page.evaluate(() => {
    localStorage.setItem('eacp-workspace-v1', JSON.stringify({ v: 1, posts: [{ id: 'p-maptest', kind: 'tip', lat: -1.29, lng: 36.82, place: 'Nairobi, Kenya', sectorId: '05', text: 'Test tip from the automated test.', outcomes: [], by: { city: 'Nairobi', country: 'KE', department: 'Roads Department' }, createdAt: new Date().toISOString(), mine: true, origin: 'local', seenIn: [], replies: [] }], saved: [], techs: [], contacts: [], seenResearch: [] }));
  });
  await page.goto('/map/?post=p-maptest', { waitUntil: 'load' });
  await ready(page);
  await expect(page.locator('[data-drawer]')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('[data-drawer] .meta')).toContainText('Added by Nairobi, Kenya, Roads Department');
  await expect(page.locator('[data-drawer] .tag.shared')).toHaveText('Unverified');
  await expect(page.locator('[data-sr-list]')).toContainText('Nairobi, Kenya (shared, unverified)');
});

test('map starts with no shared entries', async ({ page }) => {
  await page.goto('/map/', { waitUntil: 'load' });
  await ready(page);
  await expect(page.locator('[data-sr-list]')).not.toContainText('(shared, unverified)');
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
