import { test, expect } from '@playwright/test';

test('MyEACP: gate, city setup, technologies, contacts, saved risk, export and import', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/myeacp/', { waitUntil: 'load' });
  await expect(page.locator('[data-gate]')).toBeVisible();
  await page.locator('[data-gate] [data-signin-open]').click();
  await page.fill('input[name=username]', 'demo');
  await page.fill('input[name=password]', 'demo');
  await page.locator('[data-signin-form] button[type=submit]').click();

  // First visit: set up the city.
  await expect(page.locator('[data-setup]')).toBeVisible();
  await page.locator('[data-setup] button[type=submit]').click();
  await expect(page.locator('[data-setup-error]')).toContainText('Pick your city');
  await page.locator('[data-city-input]').fill('Pittsburgh');
  await expect(page.locator('[data-city-list] li').first()).toContainText('Pittsburgh, PA');
  await page.locator('[data-city-input]').press('Enter');
  await page.fill('input[name=department]', 'Department of Mobility and Infrastructure');
  await page.selectOption('select[name=role]', 'mobility');
  await page.locator('[data-setup] label.check', { hasText: '01 Mobility' }).click();
  await page.locator('[data-setup] button[type=submit]').click();
  await expect(page.locator('[data-idcard] .city')).toHaveText('Pittsburgh, PA');
  await expect(page.locator('[data-who]')).toHaveText('Pittsburgh (demo)');
  await expect(page.locator('[data-my-sectors] a')).toHaveText(['01 Autonomous Mobility']);

  // My city: research nearby, a technology and a role-based contact.
  await page.locator('#tab-city').click();
  await expect(page.locator('[data-near] li').first()).toContainText('km');
  await page.locator('#tab-tech').click();
  await page.fill('[data-tech-form] input[name=name]', 'Robotaxi testing permit');
  await page.selectOption('[data-tech-form] select[name=status]', 'pilot');
  await page.locator('[data-tech-form] button[type=submit]').click();
  await expect(page.locator('.board .col.pilot .tcard')).toContainText('Robotaxi testing permit');
  await page.locator('#tab-contacts').click();
  await page.fill('[data-contact-form] input[name=operator]', 'Robotaxi operator');
  await page.fill('[data-contact-form] input[name=role]', '24/7 fleet desk');
  await page.fill('[data-contact-form] input[name=how]', 'jane.doe@example.com');
  await page.locator('[data-contact-form] button[type=submit]').click();
  await expect(page.locator('[data-contact-error]')).toContainText('personal email');
  await page.fill('[data-contact-form] input[name=how]', 'Desk line listed in the permit');
  await page.locator('[data-contact-form] button[type=submit]').click();
  await expect(page.locator('[data-contacts] li')).toContainText('24/7 fleet desk');

  // Save a risk from the playbook, see it under Saved, and open it again.
  await page.goto('/sectors/autonomous-mobility/risks/', { waitUntil: 'load' });
  const save = page.locator('#panel-likely article:visible [data-save]');
  await save.click();
  await expect(save).toHaveAttribute('aria-pressed', 'true');
  const title = (await page.locator('#panel-likely article:visible h2').textContent())!.trim();
  await page.goto('/myeacp/', { waitUntil: 'load' });
  await page.locator('#tab-saved').click();
  await expect(page.locator('[data-saved]')).toContainText(title);
  await page.locator('[data-saved] a', { hasText: title }).click();
  await expect(page).toHaveURL(/\/risks\/#r01-/);
  await expect(page.locator('[role=tab][aria-selected=true]', { hasText: title })).toBeVisible();

  // Export, clear, import.
  await page.goto('/myeacp/', { waitUntil: 'load' });
  const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('[data-export]').click()]);
  const file = await dl.path();
  page.once('dialog', (d) => d.accept());
  await page.locator('[data-reset]').click();
  await expect(page.locator('[data-setup]')).toBeVisible();
  page.once('dialog', (d) => d.accept());
  await page.locator('[data-import]').setInputFiles(file!);
  await expect(page.locator('[data-idcard] .city')).toHaveText('Pittsburgh, PA');
  expect(errors).toEqual([]);
});
