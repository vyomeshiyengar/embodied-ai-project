import { test, expect } from '@playwright/test';

test('toolkit: the cycle filters tools, a tool shows its sources, and ?tool= deep-links', async ({ page }) => {
  await page.goto('/toolkit/', { waitUntil: 'load' });
  await expect(page.locator('[data-cycle] [role="tab"]')).toHaveCount(4);
  const all = await page.locator('[data-tools] > li:visible').count();
  expect(all).toBeGreaterThan(10);
  // Step 4 in the cycle shows its points and narrows the tools.
  await page.locator('#tab-step-4').click();
  await expect(page.locator('#panel-step-4')).toBeVisible();
  await expect(page.locator('#panel-step-4 li')).toHaveCount(3);
  const four = await page.locator('[data-tools] > li:visible').count();
  expect(four).toBeLessThan(all);
  for (const li of await page.locator('[data-tools] > li:visible').all()) expect((await li.getAttribute('data-steps'))!.split(' ')).toContain('4');
  // Focus shows the one-liner tooltip; selecting shows examples with sources.
  const tool = page.locator('[data-tool="roll-back"]');
  await tool.focus();
  await expect(page.locator('#eacp-tip')).toBeVisible();
  await expect(tool).toHaveAttribute('aria-describedby', 'eacp-tip');
  await tool.click();
  const detail = page.locator('#tool-roll-back');
  await expect(detail).toBeVisible();
  await expect(detail.locator('.srcs a').first()).toHaveAttribute('href', /^https:\/\//);
  await expect(detail.locator('.chip.review')).toHaveText('Pending team review');
  await expect(page).toHaveURL(/\?tool=roll-back$/);
  // Status filter: the team's proposals.
  await page.locator('[data-fstep=""]').click();
  await page.locator('[data-fstatus="proposed"]').click();
  await expect(page.locator('[data-tools] > li:visible')).toHaveCount(3);
  // Deep link
  await page.goto('/toolkit/?tool=emergency-geofencing', { waitUntil: 'load' });
  await expect(page.locator('#tool-emergency-geofencing')).toBeVisible();
});

test('old Recommendations page redirects to the Toolkit', async ({ page }) => {
  await page.goto('/recommendations/');
  await expect(page).toHaveURL(/\/toolkit\/$/);
});

test('regulations: a Global layer with sourced rules tagged for review', async ({ page }) => {
  await page.goto('/sectors/urban-logistics-delivery/regulations/', { waitUntil: 'load' });
  const tab = page.locator('#tab-international');
  await expect(tab).toContainText('Global');
  await tab.click();
  const panel = page.locator('#panel-international');
  await expect(panel).toBeVisible();
  await expect(panel.locator('.rule')).not.toHaveCount(0);
  await expect(panel.locator('.chip.review').first()).toHaveText('Pending team review');
  await expect(panel.locator('.where').first()).not.toBeEmpty();
});

test('On the map stays inside the playbook, locked to the sector', async ({ page }) => {
  await page.goto('/sectors/public-safety/regulations/', { waitUntil: 'load' });
  await page.locator('.stepnav .next').click();
  await expect(page).toHaveURL(/\/sectors\/public-safety\/map\/$/);
  await expect(page.locator('.flow-head h1')).toHaveText('On the map');
  await expect(page.locator('header.site nav.primary a', { hasText: 'Playbook' })).toHaveAttribute('aria-current', 'page');
  const map = page.locator('[data-gmap]');
  await expect(map).toHaveAttribute('data-sector', '02');
  await expect(map.locator('.chips[aria-label="Show sector"]')).toBeHidden();
  await expect(page.locator('a', { hasText: 'Open the full map' })).toHaveAttribute('href', /\/map\/\?sector=02$/);
});

test('glossary terms in page text show their definition on hover and focus', async ({ page }) => {
  await page.goto('/sectors/autonomous-mobility/risks/', { waitUntil: 'load' });
  const term = page.locator('main a.term:visible').first();
  await expect(term).toBeVisible({ timeout: 10_000 });
  await term.hover();
  const tip = page.locator('#eacp-tip');
  await expect(tip).toBeVisible();
  await expect(tip.locator('strong')).toHaveText((await term.getAttribute('data-gterm'))!);
  await page.keyboard.press('Escape');
  await expect(tip).toBeHidden();
  await expect(term).toHaveAttribute('href', /\/glossary\/#g\d\d-/);
  // Never inside headings or tabs.
  await expect(page.locator('main h1 a.term, main h2 a.term, main [role="tab"] a.term')).toHaveCount(0);
  // The link opens the glossary on that term's sector tab.
  const href = (await term.getAttribute('href'))!;
  await page.goto(href);
  await expect(page.locator(new URL(href).hash)).toBeVisible();
});
