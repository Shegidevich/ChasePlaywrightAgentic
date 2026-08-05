# Playwright Test Agents — Lessons Learned & Reference

> Practical guide built from implementing 12 end-to-end tests against [chase.com](https://www.chase.com/) using Playwright Test Agents (planner → generator → healer).

---

## Table of Contents

1. [Project Architecture](#1-project-architecture)
2. [Page Object Model Pattern](#2-page-object-model-pattern)
3. [Locator Strategy — What Actually Works](#3-locator-strategy--what-actually-works)
4. [Flaky Click Fix — The Retry Pattern](#4-flaky-click-fix--the-retry-pattern)
5. [Cookie / Consent Banner Handling](#5-cookie--consent-banner-handling)
6. [Outside-Click Testing](#6-outside-click-testing)
7. [aria-expanded for Menu State Assertions](#7-aria-expanded-for-menu-state-assertions)
8. [Assertion Anti-Patterns to Avoid](#8-assertion-anti-patterns-to-avoid)
9. [Test File Conventions](#9-test-file-conventions)
10. [Configuration Tips](#10-configuration-tips)
11. [Debugging Workflow](#11-debugging-workflow)
12. [Playwright Test Agent Workflow](#12-playwright-test-agent-workflow)
13. [Quick Reference Cheatsheet](#13-quick-reference-cheatsheet)

---

## 1. Project Architecture

```
├── fixtures/
│   └── index.ts              # Custom test/expect extensions
├── tests/
│   ├── seed.spec.ts          # Bootstrap test for Test Agents
│   ├── pages/
│   │   └── home-page.ts      # Page Object Model
│   └── personal-main-menu/   # Feature-organized test suites
│       ├── checking-menu-dropdown.spec.ts
│       ├── ...
│       └── menu-closes-on-outside-click.spec.ts
├── spec/
│   └── chase-main-menu.plan.md   # Test plan (input to planner)
├── playwright.config.ts
└── tsconfig.json
```

**Key decisions:**
- Tests organized by **feature area** (`personal-main-menu/`, `customer-type/`, etc.), not by page.
- One **Page Object** per logical page/section (`HomePage`).
- **Seed test** exists solely to bootstrap the Test Agent environment.
- **Test plan** is a markdown file that drives the planner → generator pipeline.

---

## 2. Page Object Model Pattern

The `HomePage` class encapsulates all selectors and interactions for the Chase.com home page navigation.

### Structure

```ts
export class HomePage {
  readonly page: Page;
  readonly mainMenu: Locator;

  // Stable attribute-based selector for the menubar
  constructor(page: Page) {
    this.page = page;
    this.mainMenu = page
      .locator('ul[role="menubar"]')
      .filter({ has: page.locator('button[data-pt-name="hd_nav_fs_chk"]') });
  }
}
```

### Methods

| Method | Purpose |
|--------|---------|
| `goto()` | Navigate + assert title + dismiss cookie banner |
| `menuItem(name)` | Locate a top-level menu button by data attribute |
| `subMenuItem(name)` | Locate a dropdown submenu item by accessible name |
| `openMenu(name)` | Click menu + retry logic + assert expanded |
| `expectMenuItemsInOrder(names)` | Assert exact count and order of menu items |

### Key lessons:

- **Use `data-pt-name` attributes** over accessible names for menu buttons — Chase exposes empty `aria-label` and trailing whitespace in button text, making `getByRole('menuitem', { name: 'Checking' })` fragile.
- **Filter the menubar** — there are two `ul[role="menubar"]` elements (Customer Service and Main Navigation). Use `.filter({ has: ... })` to disambiguate.
- **One class per section**, not per page — the "home page" has multiple logical sections (header nav, main content, footer). Keep the Page Object scoped to what you test.

---

## 3. Locator Strategy — What Actually Works

### ✅ Stable (use these)

```ts
// data-* attributes (most reliable for Chase)
page.locator('button[data-pt-name="hd_nav_fs_chk"]')

// Role + name for submenu items (stable text)
page.getByRole('menuitem', { name: 'Mortgage rates', exact: true })

// ARIA role for structural elements
page.locator('ul[role="menubar"]').filter({ has: ... })

// Landmark roles
page.locator('main')
```

### ❌ Fragile (avoid these)

```ts
// Chase buttons have empty aria-label
page.getByRole('menuitem', { name: 'Checking' })  // ❌ may match trailing whitespace

// CSS classes change with builds
page.locator('.sc-eb43c12d-0')  // ❌ hash classes

// nth-child without context
page.locator('nav ul li:nth-child(3)')  // ❌ order may change
```

---

## 4. Flaky Click Fix — The Retry Pattern

**Problem:** Chase menu buttons sometimes ignore the first Playwright click due to dynamic initialization, overlay transitions, or event listener attachment timing.

**Solution:** Check `aria-expanded` after click, retry once with `force: true` if needed.

```ts
async openMenu(name: string): Promise<void> {
  const item = this.menuItem(name);
  await item.waitFor({ state: 'visible' });

  await item.click();
  const isExpanded = await item.getAttribute('aria-expanded');
  if (isExpanded !== 'true') {
    await item.click({ force: true });  // bypasses actionability checks
  }
  await expect(item).toHaveAttribute('aria-expanded', 'true');
}
```

**Why this works:**
- `force: true` skips Playwright's built-in actionability checks (visibility, stability, pointer-interception) which can be overly cautious with dynamically rendered overlays.
- The second click succeeds because by then the JS event listeners are attached.
- We only retry **once** — multiple retries would hide real bugs.

**Validation:** This pattern passed 36/36 tests across 3 consecutive runs (12 tests × 3 runs).

---

## 5. Cookie / Consent Banner Handling

**Problem:** Chase.com shows a privacy/cookie consent banner that:
- Appears intermittently (not on every visit)
- Overlays the page and intercepts pointer events
- Causes test timeouts when it blocks menu interactions

**Solution:** Dismiss it in `goto()` with a non-blocking catch:

```ts
async goto(): Promise<void> {
  await this.page.goto('https://www.chase.com/');
  await expect(this.page).toHaveTitle(/Chase/);

  // Dismiss cookie banner if present (may not appear)
  const closeBtn = this.page
    .locator('button')
    .filter({ has: this.page.locator('img[alt="Close Icon"]') });
  await closeBtn.first().click({ timeout: 3000 }).catch(() => {});
}
```

**Key points:**
- `.catch(() => {})` — silently handles the case where the banner doesn't appear.
- `timeout: 3000` — short timeout since the banner either appears quickly or not at all.
- Target the **Close Icon image** inside the button, not the button text (which is empty).
- Place this in the Page Object, not in individual tests.

---

## 6. Outside-Click Testing

**Problem:** Clicking "outside" a dropdown to close it is tricky because:
- The `<h1>` heading is hidden behind a hero overlay (`<div data-placement-id="hero">`)
- Playwright refuses to click elements that are intercepted by other elements
- Using `page.mouse.click(x, y)` is brittle across viewports

**Solution:** Use `force: true` on a large, stable container:

```ts
// Click the <main> landmark to simulate outside-click
await page.locator('main').click({ force: true });
```

**Why not the heading?**
```
element.click()
  → scrolling into view if needed
  → <div lang="en" class="h-100"> from hero subtree intercepts pointer events
  → retrying... timeout
```

**Why `<main>` with `force: true`?**
- `<main>` is a large, always-present landmark
- `force: true` bypasses the interception check
- The click event still bubbles to `document`, which triggers the menu close handler

---

## 7. aria-expanded for Menu State Assertions

The Chase menu uses `aria-expanded` on each menu button to indicate open/closed state.

### Asserting open:

```ts
await expect(homePage.menuItem('Checking')).toHaveAttribute('aria-expanded', 'true');
```

### Asserting closed:

```ts
await expect(homePage.menuItem('Checking')).toHaveAttribute('aria-expanded', 'false');
```

### Asserting mutual exclusion (only one open at a time):

```ts
await homePage.openMenu('Auto');
await expect(homePage.menuItem('Auto')).toHaveAttribute('aria-expanded', 'true');
await expect(homePage.menuItem('Checking')).toHaveAttribute('aria-expanded', 'false');
```

### Verifying submenu items are visible:

```ts
await expect(homePage.subMenuItem('Choose a checking account')).toBeVisible();
await expect(homePage.subMenuItem('Debit card for kids')).toBeVisible();
```

---

## 8. Assertion Anti-Patterns to Avoid

### ❌ Don't match the entire `<body>` with aria snapshots

```ts
// BAD — matches ALL elements, fails on any page difference
await expect(page.locator('body')).toMatchAriaSnapshot(`
- list:
  - listitem: "Choose a savings account"
  - listitem: "CDs"
`);
```

The actual body snapshot is hundreds of lines — the assertion expects an exact match of the *entire* subtree.

### ✅ Assert specific elements instead

```ts
// GOOD — targeted, maintainable
await expect(homePage.menuItem('Savings & CDs')).toHaveAttribute('aria-expanded', 'true');
await expect(homePage.subMenuItem('Choose a savings account')).toBeVisible();
await expect(homePage.subMenuItem('CDs')).toBeVisible();
```

### ❌ Don't use `waitForLoadState()`, `waitForNavigation()`, or `waitForTimeout()`

Playwright's auto-waiting and web-first assertions (`toHaveURL`, `toHaveTitle`, `toBeVisible`) handle timing automatically. Explicit waits are almost always wrong.

---

## 9. Test File Conventions

### Header comments (required for Test Agents)

```ts
// spec: spec/chase-main-menu.plan.md
// seed: tests/seed.spec.ts
```

These tell the generator which plan and seed file are associated with the test.

### Import pattern

```ts
import { test, expect } from '../../fixtures';
import { HomePage } from '../pages/home-page';
```

Always use the custom fixtures from `../../fixtures`, not `@playwright/test` directly.

### Test structure

```ts
test.describe('Feature Area', () => {
  test('Specific behavior', async ({ page }) => {
    const homePage = new HomePage(page);

    // 1. Navigate
    await homePage.goto();

    // 2. Action
    await homePage.openMenu('Checking');

    // 3. Assert state
    await expect(homePage.menuItem('Checking')).toHaveAttribute('aria-expanded', 'true');
    await expect(homePage.subMenuItem('Choose a checking account')).toBeVisible();

    // 4. Action
    await homePage.subMenuItem('Choose a checking account').click();

    // 5. Assert navigation
    await expect(page).toHaveURL(/personal\.chase\.com\/personal\/checking/);
  });
});
```

### Step numbering

Use numbered comments (`// 1.`, `// 2.`, etc.) that correspond to the test plan steps. This makes traceability between plan and implementation clear.

---

## 10. Configuration Tips

From `playwright.config.ts`:

| Setting | Value | Why |
|---------|-------|-----|
| `timeout` | `30_000` | Chase pages load slowly with many third-party scripts |
| `expect.timeout` | `5_000` | Standard assertions need breathing room |
| `fullyParallel` | `true` | Tests are independent, run them fast |
| `retries` (CI) | `2` | Retry flaky tests in CI, not locally |
| `workers` (CI) | `1` | Serialize on CI to avoid rate limiting |
| `reporter` | `'html'` | Rich report for debugging failures |

---

## 11. Debugging Workflow

### 1. Run tests via the Test Runner UI

Use `mcp_playwright_te_test_run` to execute all tests and identify failures.

### 2. Debug a specific failing test

Use `mcp_playwright_te_test_debug` with the test ID — it pauses at the failure point with a full page snapshot.

### 3. Inspect the page state

Use `mcp_playwright_te_browser_snapshot` to get a YAML accessibility tree of the current page. This shows:
- All visible elements with `ref` IDs
- ARIA attributes (`expanded`, `active`, etc.)
- Element roles and accessible names
- URL and page title

### 4. Interact manually

Use `mcp_playwright_te_browser_click`, `mcp_playwright_te_browser_verify_element_visible`, etc. to manually test interactions and find the right locators.

### 5. Read the generated log

Use `mcp_playwright_te_generator_read_log` to see all recorded steps, locators, and best practices from the interactive session.

### 6. Write the test

Use `mcp_playwright_te_generator_write_test` or write directly — incorporating the Page Object pattern and conventions from this document.

---

## 12. Playwright Test Agent Workflow

The recommended workflow for generating tests from a plan:

```
1. PLAN (mcp_playwright_te_planner_save_plan)
   └─ Convert test scenarios into structured plan with steps & expectations

2. SETUP (mcp_playwright_te_generator_setup_page)
   └─ Boot a browser, navigate to the app, pause for interaction

3. EXPLORE (browser tools)
   └─ Click, verify, snapshot — discover the actual UI structure

4. GENERATE (mcp_playwright_te_generator_write_test)
   └─ Write the .spec.ts file using the recorded interaction log

5. RUN (mcp_playwright_te_test_run)
   └─ Execute to validate

6. FIX (mcp_playwright_te_test_debug + edit tools)
   └─ Debug failures, update Page Object or test as needed

7. REPEAT (mcp_playwright_te_generator_setup_page for next test)
```

### Tips for the workflow:

- **Always snapshot before clicking** — element refs change between page loads.
- **Use Page Objects from the start** — don't write raw locators in tests.
- **Verify before clicking** — `verify_element_visible` catches missing elements early.
- **Run after each test** — catch issues incrementally, not after writing 10 tests.
- **The generator log is your friend** — it captures the exact Playwright code that worked.

---

## 13. Quick Reference Cheatsheet

### Locators

| What | Locator |
|------|---------|
| Menu button (stable) | `page.locator('button[data-pt-name="hd_nav_fs_chk"]')` |
| Menu button (by role) | `page.getByRole('menuitem', { name: 'Checking' })` |
| Submenu item | `page.getByRole('menuitem', { name: 'Mortgage rates', exact: true })` |
| Main menubar | `page.locator('ul[role="menubar"]').filter({ has: ... })` |
| Cookie close button | `page.locator('button').filter({ has: page.locator('img[alt="Close Icon"]') })` |
| Main content area | `page.locator('main')` |

### Assertions

| What | Assertion |
|------|-----------|
| Menu is open | `await expect(menuItem).toHaveAttribute('aria-expanded', 'true')` |
| Menu is closed | `await expect(menuItem).toHaveAttribute('aria-expanded', 'false')` |
| Submenu visible | `await expect(subMenuItem('X')).toBeVisible()` |
| Page navigated | `await expect(page).toHaveURL(/pattern/)` |
| Page loaded | `await expect(page).toHaveTitle(/Chase/)` |
| Menu items in order | Use `expectMenuItemsInOrder([...])` helper |

### Actions

| What | Action |
|------|--------|
| Navigate to app | `await homePage.goto()` |
| Open dropdown | `await homePage.openMenu('Checking')` |
| Click submenu | `await homePage.subMenuItem('X').click()` |
| Close menu (outside click) | `await page.locator('main').click({ force: true })` |
| Dismiss cookie banner | Handled automatically in `goto()` |

### Data-pt-name mapping

| Menu Item | data-pt-name |
|-----------|-------------|
| Checking | `hd_nav_fs_chk` |
| Savings & CDs | `hd_nav_fs_sav` |
| Credit cards | `hd_nav_fs_card` |
| Home loans | `hd_nav_fs_hl` |
| Auto | `hd_nav_fs_auto` |
| Investing by J.P. Morgan | `hd_nav_fs_investments` |
| Education & goals | `hd_nav_fs_resources` |
| Travel | `hd_nav_fs_travel` |

---

*Generated from implementing 12 tests across 3 consecutive stable runs (36/36 passing).*
*Project: ChasePlaywrightAgentic — Chase.com Main Menu Test Suite.*
