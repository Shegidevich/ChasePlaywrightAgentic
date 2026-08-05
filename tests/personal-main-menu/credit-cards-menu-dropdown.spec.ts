// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Credit cards menu dropdown', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Click the 'Credit cards' menu item
    await homePage.openMenu('Credit cards');

    // expect: A dropdown menu opens with the item 'Explore credit cards'
    await expect(homePage.menuItem('Credit cards')).toHaveAttribute('aria-expanded', 'true');
    await expect(homePage.subMenuItem('Explore credit cards')).toBeVisible();

    // 3. Click 'Explore credit cards'
    await homePage.subMenuItem('Explore credit cards').click();

    // expect: Navigates to the credit cards page
    await expect(page).toHaveURL(/creditcards\.chase\.com/);
  });
});
