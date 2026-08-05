// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Auto menu dropdown', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Click the 'Auto' menu item
    await homePage.openMenu('Auto');

    // expect: A dropdown menu opens with the items 'Explore car financing', 'Refinance your car', and 'See interest rates'
    await expect(homePage.menuItem('Auto')).toHaveAttribute('aria-expanded', 'true');
    await expect(homePage.subMenuItem('Explore car financing')).toBeVisible();
    await expect(homePage.subMenuItem('Refinance your car')).toBeVisible();
    await expect(homePage.subMenuItem('See interest rates')).toBeVisible();

    // 3. Click 'Explore car financing'
    await homePage.subMenuItem('Explore car financing').click();

    // expect: Navigates to the auto financing page
    await expect(page).toHaveURL(/autofinance\.chase\.com/);
  });
});
