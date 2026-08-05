// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Savings & CDs menu dropdown', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Click the 'Savings & CDs' menu item
    await homePage.openMenu('Savings & CDs');

    // expect: A dropdown menu opens with the items 'Choose a savings account' and 'CDs'
    await expect(homePage.menuItem('Savings & CDs')).toHaveAttribute('aria-expanded', 'true');
    await expect(homePage.subMenuItem('Choose a savings account')).toBeVisible();
    await expect(homePage.subMenuItem('CDs')).toBeVisible();

    // 3. Click 'Choose a savings account'
    await homePage.subMenuItem('Choose a savings account').click();

    // expect: Navigates to the savings accounts page
    await expect(page).toHaveURL(/personal\.chase\.com\/personal\/savings/);
  });
});
