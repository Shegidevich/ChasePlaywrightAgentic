// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Checking menu dropdown', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Click the 'Checking' menu item
    await homePage.openMenu('Checking');

    // expect: A dropdown menu opens with the items 'Choose a checking account' and 'Debit card for kids'
    await expect(homePage.menuItem('Checking')).toHaveAttribute('aria-expanded', 'true');
    await expect(homePage.subMenuItem('Choose a checking account')).toBeVisible();
    await expect(homePage.subMenuItem('Debit card for kids')).toBeVisible();

    // 3. Click 'Choose a checking account'
    await homePage.subMenuItem('Choose a checking account').click();

    // expect: Navigates to the checking accounts page
    await expect(page).toHaveURL(/personal\.chase\.com\/personal\/checking/);
    await expect(page).toHaveTitle(/Compare Checking Accounts/);
  });
});
