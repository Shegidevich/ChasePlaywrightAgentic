import { test, expect } from '../fixtures';

/**
 * Seed test for Playwright Test Agents.
 *
 * This test sets up the environment necessary for the planner, generator and
 * healer agents to interact with your app. It uses the custom fixtures from
 * `../fixtures` and serves as the example for all generated tests.
 *
 * @see https://playwright.dev/docs/test-agents
 */
test('seed', async ({ page }) => {
  // Navigate to the application under test.
  await page.goto('https://www.chase.com/');

  // A minimal assertion to confirm the page loaded.
  await expect(page).toHaveTitle(/Chase/);
});
