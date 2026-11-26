import { test, expect, type Page } from '@playwright/test';
import cities from '../src/data/twin-cities.json' with { type: 'json' };

const ready = (page: Page) => page.waitForFunction(() => !!(window as unknown as { __twin?: unknown }).__twin, undefined, { timeout: 30_000 });

test('the twin loads every sample city with one canvas and a pin per use case', async ({ page }) => {
  test.setTimeout(240_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/sectors/autonomous-mobility/city/?lowfx=1', { waitUntil: 'load' });
  await ready(page);
  for (const c of cities.cities) {
    await page.locator(`[data-city="${c.id}"]`).click();
    await page.waitForFunction((id) => (window as any).__twin?.city === id, c.id, { timeout: 30_000 });
    await expect(page.locator('[data-status]')).toBeHidden();
    expect(await page.locator('canvas').count()).toBe(1);
    const types = await page.locator('[data-pin]:not(.doc)').count();
    expect(types).toBe(7); // sector 01 has seven technology types
    await expect(page.locator('[data-city-title]')).toHaveText(c.name);
  }
  expect(errors).toEqual([]);
});

test('twin: pick a use case, read it, step through, go back to the city', async ({ page }) => {
  await page.goto('/sectors/public-safety/city/?city=london&lowfx=1', { waitUntil: 'load' });
  await ready(page);
  await expect(page.locator('[data-uclist] button')).toHaveCount(await page.locator('[data-pin]').count());
  await page.locator('[data-uclist] button').first().click();
  const open = page.locator('[data-uc]:visible');
  await expect(open).toHaveCount(1);
  await expect(open.locator('.badge')).toHaveText('Illustrative scene');
  await expect(page).toHaveURL(/item=t-/);
  const firstTitle = (await open.locator('h2').textContent()) ?? '';
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-uc]:visible h2')).not.toHaveText(firstTitle);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-panel-intro]')).toBeVisible();
  await expect(page.locator('[data-home]')).toBeHidden();
  // Pins are keyboard reachable buttons (use one that is in view right now)
  await page.locator('[data-pin]:visible').first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-uc]:visible')).toHaveCount(1);
});

test('twin: documented research cases appear at their real location in that city', async ({ page }) => {
  // Sector 01 has sourced San Francisco cases; Kyiv has none for this sector.
  await page.goto('/sectors/autonomous-mobility/city/?city=san-francisco&lowfx=1', { waitUntil: 'load' });
  await ready(page);
  expect(await page.locator('[data-uclist] button', { hasText: 'Documented' }).count()).toBeGreaterThan(0);
  await page.locator('[data-uclist] button', { hasText: 'Documented' }).first().click();
  const panel = page.locator('[data-uc]:visible');
  await expect(panel.locator('.badge')).toHaveText('Documented case');
  await expect(panel.locator('.asof')).toContainText('As of');
  await page.locator('[data-city="kyiv"]').click();
  await page.waitForFunction(() => (window as any).__twin?.city === 'kyiv', undefined, { timeout: 30_000 });
  await expect(page.locator('[data-uclist] button', { hasText: 'Documented' })).toHaveCount(0);
});

test('twin: reduced motion keeps the scene still and still works', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/sectors/urban-logistics-delivery/city/?city=nairobi&lowfx=1', { waitUntil: 'load' });
  await ready(page);
  await page.locator('[data-uclist] button').first().click();
  await expect(page.locator('[data-uc]:visible')).toHaveCount(1);
  await ctx.close();
});

test('twin: new global cases count as documented in their sample city', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/city/?city=madrid&lowfx=1', { waitUntil: 'load' });
  await ready(page);
  await expect(page.locator('[data-uclist] button', { hasText: 'driverless minibus' })).toBeVisible();
});
