import { test, expect } from '@playwright/test';

test('welcome: EACP wordmark, Sign in or Continue as guest', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toHaveAccessibleName('Embodied AI City Playbook');
  await expect(h1.locator('[aria-hidden="true"]')).toHaveText('EACP');
  await expect(page.locator('header.site')).toHaveCount(0);
  await expect(page.locator('[data-welcome-pause]')).toBeVisible();
  await page.locator('[data-welcome-pause]').click();
  await expect(page.locator('[data-welcome-pause]')).toHaveAttribute('aria-pressed', 'true');
  expect(await page.locator('.acts').getByRole('button').or(page.locator('.acts').getByRole('link')).allTextContents()).toEqual(['Sign in', 'Continue as guest']);
  await page.getByRole('link', { name: 'Continue as guest' }).click();
  await expect(page).toHaveURL(/\/playbook\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Choose a sector');
  await expect(page.locator('.tiles a')).toHaveCount(10);
});

test('welcome: guests can sign in with demo / demo or keep browsing', async ({ page }) => {
  await page.goto('/', { waitUntil: 'load' });
  await page.locator('.acts [data-signin-open]').click();
  await expect(page.locator('[data-signin-dialog]')).toBeVisible();
  await expect(page.locator('[data-signin-dialog]')).not.toContainText('Not secure');
  await page.getByRole('button', { name: 'Continue as guest' }).click();
  await expect(page.locator('[data-signin-dialog]')).toBeHidden();
  await page.locator('.acts [data-signin-open]').click();
  await page.fill('input[name=username]', 'demo');
  await page.fill('input[name=password]', 'demo');
  await page.locator('[data-signin-form] button[type=submit]').click();
  // The page slide waits for the welcome 3D scene to wind down, which is slow on CI's software GL.
  await expect(page).toHaveURL(/\/playbook\/$/, { timeout: 15_000 });
  await expect(page.locator('[data-signed]')).toBeVisible({ timeout: 15_000 });
});

test('no extra notes: yellow boxes, sector one-liners and monograms are gone', async ({ page }) => {
  for (const route of ['/share/', '/myeacp/', '/playbook/', '/sectors/autonomous-mobility/', '/sectors/autonomous-mobility/risks/']) {
    await page.goto(route, { waitUntil: 'load' });
    await expect(page.locator('.demo-note, .pii, .takeaway, .mono, .blurb, .profile-hint, p.lead')).toHaveCount(0);
  }
  await page.goto('/sectors/autonomous-mobility/', { waitUntil: 'load' });
  await expect(page.locator('.stepnav .next')).toHaveText(/Next:\s*In the city/);
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

test('sector steps run Overview, In the city, Risks, Regulations, Map; Next and Back work', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/', { waitUntil: 'load' });
  const labels = await page.locator('.steps li .l').allTextContents();
  expect(labels).toEqual(['Overview', 'In the city', 'Risks', 'Regulations', 'On the map']);
  await page.goto('/sectors/autonomous-mobility/risks/', { waitUntil: 'load' });
  await page.locator('.stepnav .back').click();
  await expect(page).toHaveURL(/\/city\/(\?.*)?$/, { timeout: 15_000 });
  await page.goto('/sectors/public-safety/', { waitUntil: 'load' });
  await expect(page.locator('.stepnav .next .v')).toHaveText('In the city');
});

test('old See it in action and Types pages redirect to In the city, keeping the type', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/story/');
  await expect(page).toHaveURL(/\/autonomous-mobility\/city\//);
  await page.goto('/sectors/public-safety/types/#t-robot-dogs-quadrupeds');
  await expect(page).toHaveURL(/\/public-safety\/city\//);
  await expect(page.locator('[data-uc="t-robot-dogs-quadrupeds"]')).toBeVisible({ timeout: 20_000 });
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

test('header: EACP at the top left, then Playbook, Map, Share, MyEACP', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/risks/', { waitUntil: 'load' });
  const brand = page.locator('header.site .brand');
  await expect(brand).toHaveAccessibleName('Embodied AI City Playbook');
  await expect(brand).toContainText('EACP');
  expect(await page.locator('header.site nav.primary a').allTextContents()).toEqual(['Playbook', 'Map', 'Share', 'MyEACP']);
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
  const visible = () => page.locator('#panel-likely .cats.vert [role=tab]:visible').count();
  const all = await visible();
  await page.locator('[data-tech="t-driverless-trucks-class-8"]').click();
  await expect(page.locator('[data-tech="t-driverless-trucks-class-8"]')).toHaveAttribute('aria-pressed', 'true');
  const trucks = await visible();
  expect(trucks).toBeGreaterThan(0);
  expect(trucks).toBeLessThan(all);
  // The selected risk is always one that applies.
  const sel = page.locator('#panel-likely .cats.vert [role=tab][aria-selected=true]');
  await expect(sel).toBeVisible();
  // "Applies to" chips set the filter.
  await page.locator('#tab-black_swan').click();
  await page.locator('#panel-black_swan article:visible .tchip').first().click();
  await expect(page.locator('[data-tech][aria-pressed=true]')).not.toHaveAttribute('data-tech', '');
  await page.locator('[data-tech=""]').click();
  await page.locator('#tab-likely').click();
  expect(await visible()).toBe(all);
  // A technology in the city twin links to its filtered risks.
  await page.goto('/sectors/autonomous-mobility/city/?city=tokyo&item=t-driverless-trucks-class-8&lowfx=1', { waitUntil: 'load' });
  await page.waitForFunction(() => !!(window as unknown as { __twin?: unknown }).__twin, undefined, { timeout: 30_000 });
  await page.locator('[data-uc="t-driverless-trucks-class-8"] .risklink a').click();
  // Leaving a 3D page waits for the scene to wind down, which is slow on CI's software GPU.
  await expect(page).toHaveURL(/\/risks\/\?tech=/, { timeout: 15_000 });
  await expect(page.locator('[data-tech][aria-pressed=true]')).not.toHaveAttribute('data-tech', '');
});

test('old case-study pages redirect to the filtered global map', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/cases/');
  await expect(page).toHaveURL(/\/map\/\?sector=01$/);
});
