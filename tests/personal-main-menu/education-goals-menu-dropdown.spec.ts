// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Education & goals menu dropdown', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Click the 'Education & goals' menu item
    await homePage.openMenu('Education & goals');

    // expect: A dropdown menu opens with the items 'Education center' and 'Free credit score'
    await expect(homePage.menuItem('Education & goals')).toHaveAttribute('aria-expanded', 'true');
    await expect(homePage.subMenuItem('Education center')).toBeVisible();
    await expect(homePage.subMenuItem('Free credit score')).toBeVisible();

    // 3. Click 'Free credit score'
    await homePage.subMenuItem('Free credit score').click();

    // expect: Navigates to the free credit score page
    await expect(page).toHaveURL(/free-credit-score/);
  });
});
