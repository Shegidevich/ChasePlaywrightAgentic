// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Menu closes when clicking outside', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Click the 'Home loans' menu item
    await homePage.openMenu('Home loans');

    // expect: The Home loans dropdown opens
    await expect(homePage.menuItem('Home loans')).toHaveAttribute('aria-expanded', 'true');

    // 3. Click on the main content area of the page (outside the menu)
    await page.locator('main').click({ force: true });

    // expect: The dropdown menu closes
    await expect(homePage.menuItem('Home loans')).toHaveAttribute('aria-expanded', 'false');
  });
});
