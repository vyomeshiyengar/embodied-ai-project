import { test, expect } from '@playwright/test';

test('welcome: EACP wordmark and one Start button', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveAccessibleName('Embodied AI City Playbook');
  await expect(h1.locator('[aria-hidden="true"]')).toHaveText('EACP');
  await expect(page.locator('header.site')).toHaveCount(0);
  await expect(page.locator('[data-welcome-pause]')).toBeVisible();
  await page.locator('[data-welcome-pause]').click();
  await expect(page.locator('[data-welcome-pause]')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('.acts').getByRole('button').or(page.locator('.acts').getByRole('link')).allTextContents()).toEqual(['Start']);
  await page.getByRole('link', { name: 'Start' }).click();
  await expect(page).toHaveURL(/\/playbook\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose a sector');
  await expect(page.locator('.tiles a')).toHaveCount(10);
});

test('no extra notes: yellow boxes, sector one-liners and monograms are gone', async ({ page }) => {
  for (const route of ['/playbook/', '/sectors/autonomous-mobility/', '/sectors/autonomous-mobility/risks/']) {
    await page.goto(route, { waitUntil: 'load' });
    await expect(page.locator('.demo-note, .pii, .takeaway, .mono, .blurb, .profile-hint, p.lead')).toHaveCount(0);
  }
  await page.goto('/sectors/autonomous-mobility/', { waitUntil: 'load' });
  await expect(page.locator('.stepnav .next')).toHaveText(/Next:\s*Risks/);
  await expect(page.locator('.stepnav .back')).toHaveText(/Back:\s*Playbook/);
});

test('welcome with reduced motion shows the still image, no animation', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/', { waitUntil: 'load' });
  await expect(page.locator('[data-welcome]')).not.toHaveClass(/live/);
  await expect(page.locator('[data-welcome-pause]')).toBeHidden();
  await ctx.close();
});

test('sector steps run Overview, Risks, Regulations, Map; Next and Back work', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/', { waitUntil: 'load' });
  const labels = await page.locator('.steps li .l').allTextContents();
  expect(labels).toEqual(['Overview', 'Risks', 'Regulations', 'On the map']);
  await page.goto('/sectors/autonomous-mobility/risks/', { waitUntil: 'load' });
  await page.locator('.stepnav .back').click();
  await expect(page).toHaveURL(/\/sectors\/autonomous-mobility\/(\?.*)?$/, { timeout: 15_000 });
  await page.goto('/sectors/public-safety/', { waitUntil: 'load' });
  await expect(page.locator('.stepnav .next .v')).toHaveText('Risks');
});

test('old See it in action, Types and In the city pages redirect to the Overview, keeping the type', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/story/');
  await expect(page).toHaveURL(/\/sectors\/autonomous-mobility\/(#.*)?$/);
  await page.goto('/sectors/autonomous-mobility/city/');
  await expect(page).toHaveURL(/\/sectors\/autonomous-mobility\/(#.*)?$/);
  await page.goto('/sectors/public-safety/types/#t-robot-dogs-quadrupeds');
  await expect(page).toHaveURL(/\/public-safety\//);
  await expect(page.locator('[data-type="t-robot-dogs-quadrupeds"]')).toHaveAttribute('aria-pressed', 'true', { timeout: 15_000 });
});

test('category switchers change panels by click and keyboard', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/risks/', { waitUntil: 'load' });
  await expect(page.locator('#panel-likely')).toBeVisible();
  await page.locator('#tab-black_swan').click();
  await expect(page.locator('#panel-black_swan')).toBeVisible();
  await expect(page.locator('#panel-likely')).toBeHidden();
  await page.locator('#tab-black_swan').press('ArrowRight');
  await expect(page.locator('#panel-outlook')).toBeVisible();
  await expect(page.locator('#tab-outlook')).toBeFocused();
  // The likelihood x severity matrix is gone.
  await expect(page.locator('.matrix, .dot')).toHaveCount(0);
});

test('header: EACP at the top left, then one flat menu (no More)', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/risks/', { waitUntil: 'load' });
  const brand = page.locator('header.site .brand');
  await expect(brand).toHaveAccessibleName('Embodied AI City Playbook');
  await expect(brand).toContainText('EACP');
  expect(await page.locator('header.site nav.primary a').allTextContents()).toEqual(['Playbook', 'Toolkit', 'Map', 'Glossary', 'About']);
  await expect(page.locator('header.site details.more')).toHaveCount(0);
  await expect(page.locator('header.site nav.primary a', { hasText: 'Playbook' })).toHaveAttribute('aria-current', 'page');
  // The sector switcher lives in the Playbook breadcrumb and keeps you on the same step.
  await page.locator('.crumb details.switch summary').click();
  await page.locator('.crumb details.switch a', { hasText: 'Public Safety' }).click();
  await expect(page).toHaveURL(/\/sectors\/public-safety\/risks\/$/);
});

test('/explore/ redirects to /playbook/', async ({ page }) => {
  await page.goto('/explore/');
  await expect(page).toHaveURL(/\/playbook\/$/);
});

test('risks filter by technology, and a type links to its risks', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/risks/', { waitUntil: 'load' });
  const visible = () => page.locator('#panel-likely .cats.cards [role=tab]:visible').count();
  const all = await visible();
  await page.locator('[data-tech="t-driverless-trucks-class-8"]').click();
  await expect(page.locator('[data-tech="t-driverless-trucks-class-8"]')).toHaveAttribute('aria-pressed', 'true');
  const trucks = await visible();
  expect(trucks).toBeGreaterThan(0);
  expect(trucks).toBeLessThan(all);
  // The selected risk is always one that applies.
  const sel = page.locator('#panel-likely .cats.cards [role=tab][aria-selected=true]');
  await expect(sel).toBeVisible();
  // "Applies to" chips set the filter.
  await page.locator('#tab-black_swan').click();
  await page.locator('#panel-black_swan article:visible .tchip').first().click();
  await expect(page.locator('[data-tech][aria-pressed=true]')).not.toHaveAttribute('data-tech', '');
  await page.locator('[data-tech=""]').click();
  await page.locator('#tab-likely').click();
  expect(await visible()).toBe(all);
});

test('old case-study pages redirect to the sector map step', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/cases/');
  await expect(page).toHaveURL(/\/sectors\/autonomous-mobility\/map\/$/);
});
