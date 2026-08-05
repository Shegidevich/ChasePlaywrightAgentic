// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Travel menu dropdown', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Click the 'Travel' menu item
    await homePage.openMenu('Travel');

    // expect: A dropdown menu opens with the item 'Book with Chase Travel'
    await expect(homePage.menuItem('Travel')).toHaveAttribute('aria-expanded', 'true');
    await expect(homePage.subMenuItem('Book with Chase Travel')).toBeVisible();

    // 3. Click 'Book with Chase Travel'
    await homePage.subMenuItem('Book with Chase Travel').click();

    // expect: Navigates to the Chase Travel page
    await expect(page).toHaveURL(/travel/);
  });
});
