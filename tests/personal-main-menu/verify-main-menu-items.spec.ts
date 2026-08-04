// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Verify main menu items are displayed', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Locate the main navigation menubar
    await expect(homePage.mainMenu).toBeVisible();

    // 3. Verify the following menu items are present in order
    await homePage.expectMenuItemsInOrder([
      'Checking',
      'Savings & CDs',
      'Credit cards',
      'Home loans',
      'Auto',
      'Investing by J.P. Morgan',
      'Education & goals',
      'Travel',
    ]);
  });
});
