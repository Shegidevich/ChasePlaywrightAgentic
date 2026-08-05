import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Chase.com home page main navigation menu.
 *
 * The main menu is a menubar containing the top-level product menu items
 * (Checking, Savings & CDs, Credit cards, Home loans, Auto, Investing by
 * J.P. Morgan, Education & goals, Travel). Clicking a menu item opens a
 * dropdown submenu.
 *
 * The top-level menu buttons are identified by stable `data-pt-name`
 * attributes (e.g. `hd_nav_fs_chk` for Checking), which are more reliable
 * than accessible-name matching because the buttons expose an empty
 * `aria-label` and trailing whitespace in their text.
 */
export class HomePage {
  readonly page: Page;
  readonly mainMenu: Locator;

  /** Maps a top-level menu label to its stable data-pt-name attribute. */
  private static readonly MENU_PT_NAMES: Record<string, string> = {
    Checking: 'hd_nav_fs_chk',
    'Savings & CDs': 'hd_nav_fs_sav',
    'Credit cards': 'hd_nav_fs_card',
    'Home loans': 'hd_nav_fs_hl',
    Auto: 'hd_nav_fs_auto',
    'Investing by J.P. Morgan': 'hd_nav_fs_investments',
    'Education & goals': 'hd_nav_fs_resources',
    Travel: 'hd_nav_fs_travel',
  };

  constructor(page: Page) {
    this.page = page;
    // The main navigation menubar is the one containing the 'Checking'
    // top-level menu button.
    this.mainMenu = page
      .locator('ul[role="menubar"]')
      .filter({ has: page.locator('button[data-pt-name="hd_nav_fs_chk"]') });
  }

  /** Navigate to the Chase home page. */
  async goto(): Promise<void> {
    await this.page.goto('https://www.chase.com/');
    await expect(this.page).toHaveTitle(/Chase/);
    // Dismiss the privacy/cookie consent banner if it appears
    const closeBtn = this.page.locator('button').filter({ has: this.page.locator('img[alt="Close Icon"]') });
    await closeBtn.first().click({ timeout: 3000 }).catch(() => {});
  }

  /** The top-level menu item locator for a given name. */
  menuItem(name: string): Locator {
    const ptName = HomePage.MENU_PT_NAMES[name];
    if (!ptName) {
      throw new Error(`Unknown main menu item: ${name}`);
    }
    return this.mainMenu.locator(`button[data-pt-name="${ptName}"]`);
  }

  /** A submenu item locator within the currently open dropdown. */
  subMenuItem(name: string): Locator {
    return this.page.getByRole('menuitem', { name, exact: true });
  }

  /** Open the dropdown for a top-level menu item. */
  async openMenu(name: string): Promise<void> {
    const item = this.menuItem(name);
    await item.waitFor({ state: 'visible' });
    // Click the menu item and retry if aria-expanded doesn't become true.
    // The Chase menu sometimes ignores the first click due to dynamic
    // initialization or overlay transitions.
    await item.click();
    const isExpanded = await item.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      // Retry the click once after a short wait
      await item.click({ force: true });
    }
    await expect(item).toHaveAttribute('aria-expanded', 'true');
  }

  /** Assert that the given top-level menu items are visible in order. */
  async expectMenuItemsInOrder(names: string[]): Promise<void> {
    const items = this.mainMenu.locator('> li > div > [role="menuitem"]');
    await expect(items).toHaveCount(names.length);
    for (let i = 0; i < names.length; i++) {
      await expect(items.nth(i)).toHaveText(names[i]);
    }
  }
}
