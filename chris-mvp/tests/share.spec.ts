import { test, expect, type Page } from '@playwright/test';

async function signIn(page: Page) {
  await page.locator('[data-signin-open]:visible').first().click();
  await page.fill('input[name=username]', 'demo');
  await page.fill('input[name=password]', 'demo');
  await page.locator('[data-signin-form] button[type=submit]').click();
  await expect(page.locator('[data-signed]')).toBeVisible();
}

test('share: sign-in gate, any city, five steps, publish, link, add from link, reply, seen, delete', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext();
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/share/', { waitUntil: 'load' });
  await expect(page.locator('[data-gate]')).toBeVisible();
  await expect(page.locator('[data-composer]')).toBeHidden();
  await page.locator('#tab-feed').click();
  await expect(page.locator('[data-feed-empty]')).toBeVisible(); // nothing is seeded
  await page.locator('#tab-compose').click();
  await signIn(page);
  await expect(page.locator('[data-composer]')).toBeVisible();

  // Step 1: a city that is not in the research, from the built-in world list.
  await page.locator('[data-city-input]').fill('Lagos');
  await expect(page.locator('[data-city-list] li').first()).toHaveText('Lagos, Nigeria');
  await page.locator('[data-city-input]').press('Enter');
  await expect(page.locator('[data-place-name]')).toHaveValue('Lagos, Nigeria');
  await expect(page.locator('[data-pin-status]')).toHaveText('Drag the pin to where it happened.');
  // Next without a kind shows an error on step 2.
  await page.locator('[data-next]').click();
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-compose-error]')).toContainText('Choose what kind');
  await page.locator('.kindcard', { hasText: 'A question for other cities' }).click();
  await page.locator('[data-next]').click();
  await page.selectOption('[data-sector-select]', '05');
  await page.selectOption('[data-type-select]', { index: 1 });
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-text-label]')).toHaveText('Your question for other cities');
  await page.fill('textarea[name=text]', 'Call me at 412 555 0100 about robots in bike lanes.');
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-compose-error]')).toContainText('phone numbers');
  await page.fill('textarea[name=text]', 'How do other cities keep delivery robots out of bike lanes?');
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-compose-error]')).toContainText('Add a link');
  await page.fill('input[name=link]', 'https://example.org/council-minutes');
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-preview] .post h3')).toHaveText('Lagos, Nigeria');
  await expect(page.locator('[data-similar] .sim').first()).toBeVisible();
  await page.locator('[data-publish]').click();
  await expect(page.locator('[data-done]')).toBeVisible();

  // Copy the share link, then open it as someone else.
  await page.locator('[data-done-copy]').click();
  await expect(page.locator('[data-done-copy]')).toHaveText('Link copied');
  const url = await page.evaluate(() => navigator.clipboard.readText());
  expect(url).toMatch(/\/share\/#p=z[\w-]+$/);
  await page.locator('[data-done-feed]').click();
  await expect(page.locator('.feed .post')).toHaveCount(1);
  await expect(page.locator('.feed .post .kind')).toContainText('A question for other cities');
  await expect(page.locator('.feed .post .tag', { hasText: 'Approximate location' })).toBeVisible();

  const other = await browser.newContext();
  const p2 = await other.newPage();
  await p2.goto(url, { waitUntil: 'load' });
  await expect(p2.locator('[data-incoming]')).toContainText('A city shared this with you');
  await expect(p2.locator('[data-incoming] .post h3')).toHaveText('Lagos, Nigeria');
  await p2.getByRole('button', { name: 'Add to my map' }).click();
  await expect(p2.locator('.feed .post')).toHaveCount(1);
  await expect(p2.locator('.feed .post .tag', { hasText: 'From a share link' })).toBeVisible();
  // The second city answers.
  await signIn(p2);
  await p2.locator('.feed .post textarea[name=reply]').fill('We added a bike-lane rule to the permit.');
  await p2.getByRole('button', { name: 'Post answer' }).click();
  await expect(p2.locator('.feed .post .replies li')).toHaveCount(1);
  await other.close();

  // Seen this too needs a city profile; without one it says so.
  await page.locator('.feed .post .act.seen').click();
  await expect(page.locator('[data-announce]')).toContainText('Set up your city');
  // Delete
  page.once('dialog', (d) => d.accept());
  await page.locator('.feed .post .act.danger').click();
  await expect(page.locator('[data-feed-empty]')).toBeVisible();
  expect(errors).toEqual([]);
  await ctx.close();
});

test('share: drop a pin anywhere by coordinates (open ocean)', async ({ page }) => {
  await page.goto('/share/', { waitUntil: 'load' });
  await signIn(page);
  await page.fill('[data-lat]', '-48.88');
  await page.fill('[data-lng]', '-123.39');
  await page.locator('[data-coords-go]').click();
  await expect(page.locator('[data-pin-status]')).toContainText('Pin at -48.8800, -123.3900');
  await page.fill('[data-place-name]', 'Point Nemo');
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-step="1"]')).toBeVisible();
});

test('a broken share link explains itself', async ({ page }) => {
  await page.goto('/share/#p=zAAAA', { waitUntil: 'load' });
  await expect(page.locator('[data-incoming]')).toContainText('could not be read');
});

test('share: media by link is checked and embedded; an uploaded photo stays on this device', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext();
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL });
  const page = await ctx.newPage();
  await page.goto('/share/', { waitUntil: 'load' });
  await signIn(page);
  await page.fill('[data-lat]', '35.6595');
  await page.fill('[data-lng]', '139.7005');
  await page.locator('[data-coords-go]').click();
  await page.fill('[data-place-name]', 'Shibuya, Tokyo');
  await page.locator('[data-next]').click();
  await page.locator('.kindcard', { hasText: 'What worked' }).click();
  await page.locator('[data-next]').click();
  await page.selectOption('[data-sector-select]', '05');
  await page.locator('[data-next]').click();
  await page.fill('textarea[name=text]', 'Delivery robots ran on a set route with a remote operator.');
  await page.fill('input[name=link]', 'https://example.org/pilot');
  // A page that is not an image or a video is refused.
  await page.fill('[data-media-url]', 'https://example.org/article');
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-compose-error]')).toContainText('direct image link');
  // A YouTube link becomes a privacy-friendly embed.
  await page.fill('[data-media-url]', 'https://youtu.be/dQw4w9WgXcQ');
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-preview] .media.video iframe')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  await page.locator('[data-publish]').click();
  await expect(page.locator('[data-done]')).toBeVisible();

  // Now a second post with an uploaded photo.
  await page.locator('[data-done-again]').click();
  await page.fill('[data-lat]', '35.6595');
  await page.fill('[data-lng]', '139.7005');
  await page.locator('[data-coords-go]').click();
  await page.fill('[data-place-name]', 'Shibuya, Tokyo');
  await page.locator('[data-next]').click();
  await page.locator('.kindcard', { hasText: 'A tip or contract clause' }).click();
  await page.locator('[data-next]').click();
  await page.selectOption('[data-sector-select]', '05');
  await page.locator('[data-next]').click();
  await page.fill('textarea[name=text]', 'Ask for a remote-stop line in the permit.');
  await page.fill('input[name=link]', 'https://example.org/permit');
  await page.locator('label.check', { hasText: 'Upload a photo' }).click();
  // A tiny PNG made in the page
  const png = await page.evaluate(async () => {
    const c = document.createElement('canvas'); c.width = 40; c.height = 30;
    const g = c.getContext('2d')!; g.fillStyle = '#0077d8'; g.fillRect(0, 0, 40, 30);
    const b: Blob = await new Promise((r) => c.toBlob((x) => r(x!), 'image/png'));
    return Array.from(new Uint8Array(await b.arrayBuffer()));
  });
  await page.locator('[data-media-file]').setInputFiles({ name: 'site.png', mimeType: 'image/png', buffer: Buffer.from(png) });
  await expect(page.locator('[data-media-preview] img')).toBeVisible();
  await page.locator('[data-next]').click();
  await expect(page.locator('[data-compose-error]')).toContainText('Describe the photo');
  await page.fill('input[name=mediaFileAlt]', 'A blue test square');
  await page.locator('[data-next]').click();
  await page.locator('[data-publish]').click();
  await page.locator('[data-done-copy]').click();
  await expect(page.locator('[data-done-copy]')).toHaveText('Link copied');
  const url = await page.evaluate(() => navigator.clipboard.readText());
  await page.locator('[data-done-feed]').click();
  const tip = page.locator('.feed .post', { hasText: 'remote-stop line' });
  await expect(tip.locator('.media img')).toHaveAttribute('alt', 'A blue test square');
  await expect(tip.locator('.media figcaption')).toHaveText('Photo saved on this device only');
  await expect(tip.locator('.tag', { hasText: 'Approximate location' })).toHaveCount(0);

  // Someone else opening the link sees the post without the photo.
  const other = await browser.newContext();
  const p2 = await other.newPage();
  await p2.goto(url, { waitUntil: 'load' });
  await expect(p2.locator('[data-incoming] .post h3')).toHaveText('Shibuya, Tokyo');
  await expect(p2.locator('[data-incoming] .post .media')).toHaveCount(0);
  await other.close();
  await ctx.close();
});
