// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';

test.describe('Personal Main Menu', () => {
  test('Only one dropdown open at a time', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://www.chase.com/
    await homePage.goto();

    // 2. Click the 'Checking' menu item
    await homePage.openMenu('Checking');

    // expect: The Checking dropdown opens
    await expect(homePage.menuItem('Checking')).toHaveAttribute('aria-expanded', 'true');

    // 3. Click the 'Auto' menu item
    await homePage.openMenu('Auto');

    // expect: The Checking dropdown closes and the Auto dropdown opens
    // Only one dropdown should be open at a time
    await expect(homePage.menuItem('Auto')).toHaveAttribute('aria-expanded', 'true');
    await expect(homePage.menuItem('Checking')).toHaveAttribute('aria-expanded', 'false');
  });
});
