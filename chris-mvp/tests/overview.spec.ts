import { test, expect } from '@playwright/test';

test('overview: technology cards above the 3D world drive the detail panel', async ({ page }) => {
  await page.goto('/sectors/parks-public-space/', { waitUntil: 'load' });
  const cards = page.locator('[data-cards] [data-type]');
  expect(await cards.count()).toBeGreaterThan(5);
  // Cards come before the world on the page.
  await page.locator('[data-world]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-world] canvas')).toBeVisible({ timeout: 30_000 });
  const cardsBox = await page.locator('[data-cards]').boundingBox();
  const worldBox = await page.locator('[data-world]').boundingBox();
  expect(cardsBox!.y).toBeLessThan(worldBox!.y);
  await expect(page.locator('[data-intro]')).toBeVisible();
  // Select a card: the panel shows its facts and sources, the world selects the same type.
  const second = cards.nth(1);
  const id = (await second.getAttribute('data-type'))!;
  await second.click();
  await expect(second).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator(`[data-detail="${id}"]`)).toBeVisible();
  await expect(page.locator(`[data-detail="${id}"] .sources`)).toBeVisible();
  await expect(page.locator('[data-world]')).toHaveAttribute('data-selected', id);
  await expect(page).toHaveURL(new RegExp(`\\?type=${id}$`));
  // Next and Previous walk the cards.
  await page.locator(`[data-detail="${id}"] [data-step="1"]`).click();
  await expect(cards.nth(2)).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-detail]:visible [data-step="-1"]').click();
  await expect(second).toHaveAttribute('aria-pressed', 'true');
  // Reset view clears the selection.
  await page.locator('.world-reset').click();
  await expect(page.locator('[data-intro]')).toBeVisible();
});

test('overview: sectors without a hand-made scene get the tile world', async ({ page }) => {
  await page.goto('/sectors/public-safety/?type=t-robot-dogs-quadrupeds', { waitUntil: 'load' });
  await expect(page.locator('[data-type="t-robot-dogs-quadrupeds"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('[data-world]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-world] canvas')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('[data-world]')).toHaveAttribute('data-selected', 't-robot-dogs-quadrupeds');
});

test('team version: no sign-in, Share, MyEACP or saving anywhere', async ({ page, request }) => {
  for (const route of ['/', '/playbook/', '/sectors/autonomous-mobility/risks/', '/sectors/autonomous-mobility/regulations/', '/map/']) {
    await page.goto(route, { waitUntil: 'load' });
    await expect(page.locator('[data-signin-open], [data-save], [data-share-link], [data-signed]')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(/MyEACP|Sign in|Save to/);
  }
  for (const gone of ['/share/', '/myeacp/']) expect((await request.get(gone)).status()).toBe(404);
});

test('risks: cards across the top, Previous and Next between risks', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/risks/', { waitUntil: 'load' });
  const cards = page.locator('#panel-likely .cats.cards [role=tab]');
  await expect(cards.first()).toHaveAttribute('aria-selected', 'true');
  const detail = page.locator('#panel-likely .detail:visible');
  const firstTitle = await detail.locator('h2').textContent();
  await detail.locator('[data-risk-step="1"]').click();
  await expect(cards.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#panel-likely .detail:visible h2')).not.toHaveText(firstTitle!);
  await page.locator('#panel-likely .detail:visible [data-risk-step="-1"]').click();
  await expect(cards.first()).toHaveAttribute('aria-selected', 'true');
  // The legend sits above the cards.
  const legend = await page.locator('.legend').boundingBox();
  const strip = await page.locator('#panel-likely .cats.cards').boundingBox();
  expect(legend!.y).toBeLessThan(strip!.y);
});
