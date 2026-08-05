// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Investing menu dropdown', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Click the 'Investing by J.P. Morgan' menu item
    await homePage.openMenu('Investing by J.P. Morgan');

    // expect: A dropdown menu opens with the items 'Explore investing', 'Work with our advisors', and 'Invest on your own'
    await expect(homePage.menuItem('Investing by J.P. Morgan')).toHaveAttribute('aria-expanded', 'true');
    await expect(homePage.subMenuItem('Explore investing')).toBeVisible();
    await expect(homePage.subMenuItem('Work with our advisors')).toBeVisible();
    await expect(homePage.subMenuItem('Invest on your own')).toBeVisible();

    // 3. Click 'Explore investing'
    await homePage.subMenuItem('Explore investing').click();

    // expect: Navigates to the investing page
    await expect(page).toHaveURL(/personal\/investments/);
  });
});
