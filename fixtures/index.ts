import { test as base, expect } from '@playwright/test';

/**
 * Custom fixtures for the Chase Playwright Agentic project.
 *
 * Playwright Test Agents (planner, generator, healer) rely on a `seed.spec.ts`
 * that uses these fixtures to bootstrap the environment before generating tests.
 *
 * @see https://playwright.dev/docs/test-fixtures
 */
export const test = base.extend<{
  // Add custom fixtures here, e.g.:
  // todoPage: TodoPage;
}>({
  // Example fixture:
  // todoPage: async ({ page }, use) => {
  //   const todoPage = new TodoPage(page);
  //   await todoPage.goto();
  //   await use(todoPage);
  // },
});

export { expect };
