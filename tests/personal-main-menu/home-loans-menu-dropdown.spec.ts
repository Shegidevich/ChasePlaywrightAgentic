// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Home loans menu dropdown', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Click the 'Home loans' menu item
    await homePage.openMenu('Home loans');

    // expect: A dropdown menu opens with the items: Explore Home Lending, Mortgage rates, Apply for a mortgage, Buy a home, Refinance, Home equity, Mortgage calculators, Manage accounts
    await expect(homePage.menuItem('Home loans')).toHaveAttribute('aria-expanded', 'true');
    await expect(homePage.subMenuItem('Explore Home Lending')).toBeVisible();
    await expect(homePage.subMenuItem('Mortgage rates')).toBeVisible();
    await expect(homePage.subMenuItem('Apply for a mortgage')).toBeVisible();
    await expect(homePage.subMenuItem('Buy a home')).toBeVisible();
    await expect(homePage.subMenuItem('Refinance')).toBeVisible();
    await expect(homePage.subMenuItem('Home equity')).toBeVisible();
    await expect(homePage.subMenuItem('Mortgage calculators')).toBeVisible();
    await expect(homePage.subMenuItem('Manage accounts')).toBeVisible();

    // 3. Click 'Mortgage rates'
    await homePage.subMenuItem('Mortgage rates').click();

    // expect: Navigates to the mortgage rates page
    await expect(page).toHaveURL(/personal\/mortgage\/mortgage-rates/);
  });
});
