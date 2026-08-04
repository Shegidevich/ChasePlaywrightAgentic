# Chase.com Main Menu Test Plan

## Application Overview

This test plan covers the main navigation menu on chase.com for both the Personal and Business customer types. The main menu is a menubar with dropdown submenus that appear on click. The Personal menu contains: Checking, Savings & CDs, Credit cards, Home loans, Auto, Investing by J.P. Morgan, Education & goals, and Travel. The Business menu contains: Checking & more, Loans & financing, Accept credit/debit cards, Business credit cards, Business services, and Resource center. The plan also covers the Customer Type switcher (Personal/Business/Commercial) and the Customer service utilities (Schedule a meeting, Español, Search).

## Test Scenarios

### 1. Personal Main Menu

**Seed:** `tests/seed.spec.ts`

#### 1.1. Verify main menu items are displayed

**File:** `tests/personal-main-menu/verify-main-menu-items.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Locate the main navigation menubar
    - expect: The menubar is visible in the header
  3. Verify the following menu items are present in order: Checking, Savings & CDs, Credit cards, Home loans, Auto, Investing by J.P. Morgan, Education & goals, Travel
    - expect: All 8 menu items are displayed in the correct order

#### 1.2. Checking menu dropdown

**File:** `tests/personal-main-menu/checking-menu-dropdown.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Checking' menu item
    - expect: A dropdown menu opens with the items 'Choose a checking account' and 'Debit card for kids'
  3. Click 'Choose a checking account'
    - expect: Navigates to the checking accounts page

#### 1.3. Savings & CDs menu dropdown

**File:** `tests/personal-main-menu/savings-cds-menu-dropdown.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Savings & CDs' menu item
    - expect: A dropdown menu opens with the items 'Choose a savings account' and 'CDs'
  3. Click 'Choose a savings account'
    - expect: Navigates to the savings accounts page

#### 1.4. Credit cards menu dropdown

**File:** `tests/personal-main-menu/credit-cards-menu-dropdown.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Credit cards' menu item
    - expect: A dropdown menu opens with the item 'Explore credit cards'
  3. Click 'Explore credit cards'
    - expect: Navigates to the credit cards page

#### 1.5. Home loans menu dropdown

**File:** `tests/personal-main-menu/home-loans-menu-dropdown.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Home loans' menu item
    - expect: A dropdown menu opens with the items: Explore Home Lending, Mortgage rates, Apply for a mortgage, Buy a home, Refinance, Home equity, Mortgage calculators, Manage accounts
  3. Click 'Mortgage rates'
    - expect: Navigates to the mortgage rates page

#### 1.6. Auto menu dropdown

**File:** `tests/personal-main-menu/auto-menu-dropdown.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Auto' menu item
    - expect: A dropdown menu opens with the items 'Explore car financing', 'Refinance your car', and 'See interest rates'
  3. Click 'Explore car financing'
    - expect: Navigates to the auto financing page

#### 1.7. Investing menu dropdown

**File:** `tests/personal-main-menu/investing-menu-dropdown.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Investing by J.P. Morgan' menu item
    - expect: A dropdown menu opens with the items 'Explore investing', 'Work with our advisors', and 'Invest on your own'
  3. Click 'Explore investing'
    - expect: Navigates to the investing page

#### 1.8. Education & goals menu dropdown

**File:** `tests/personal-main-menu/education-goals-menu-dropdown.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Education & goals' menu item
    - expect: A dropdown menu opens with the items 'Education center' and 'Free credit score'
  3. Click 'Free credit score'
    - expect: Navigates to the free credit score page

#### 1.9. Travel menu dropdown

**File:** `tests/personal-main-menu/travel-menu-dropdown.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Travel' menu item
    - expect: A dropdown menu opens with the item 'Book with Chase Travel'
  3. Click 'Book with Chase Travel'
    - expect: Navigates to the Chase Travel page

#### 1.10. Only one dropdown open at a time

**File:** `tests/personal-main-menu/only-one-dropdown-open.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Checking' menu item
    - expect: The Checking dropdown opens
  3. Click the 'Auto' menu item
    - expect: The Checking dropdown closes and the Auto dropdown opens
  4. Verify only the Auto dropdown is visible
    - expect: Only one dropdown is open at a time

#### 1.11. Menu closes when clicking outside

**File:** `tests/personal-main-menu/menu-closes-on-outside-click.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Home loans' menu item
    - expect: The Home loans dropdown opens
  3. Click on the main content area of the page (outside the menu)
    - expect: The dropdown menu closes

### 2. Customer Type Navigation

**Seed:** `tests/seed.spec.ts`

#### 2.1. Switch to Business customer type

**File:** `tests/customer-type/switch-to-business.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Business' link in the Customer Type navigation
    - expect: Navigates to https://www.chase.com/business
  3. Verify the Business main menu is displayed
    - expect: The Business menu items are shown: Checking & more, Loans & financing, Accept credit/debit cards, Business credit cards, Business services, Resource center

#### 2.2. Switch back to Personal customer type

**File:** `tests/customer-type/switch-to-personal.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/business
    - expect: The Business page loads successfully
  2. Click the 'Personal' link in the Customer Type navigation
    - expect: Navigates back to https://www.chase.com/
  3. Verify the Personal main menu is displayed
    - expect: The Personal menu items are shown: Checking, Savings & CDs, Credit cards, Home loans, Auto, Investing by J.P. Morgan, Education & goals, Travel

#### 2.3. Commercial customer type link

**File:** `tests/customer-type/commercial-link.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Commercial' link in the Customer Type navigation
    - expect: Navigates to the J.P. Morgan commercial banking site

### 3. Customer Service Utilities

**Seed:** `tests/seed.spec.ts`

#### 3.1. Search menu navigates to search page

**File:** `tests/customer-service/search-menu.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Search' menu item in the Customer service navigation
    - expect: Navigates to the Chase search results page

#### 3.2. Schedule a meeting menu

**File:** `tests/customer-service/schedule-meeting.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Schedule a meeting' menu item in the Customer service navigation
    - expect: Navigates to the meeting scheduler get started page

#### 3.3. Español menu

**File:** `tests/customer-service/espanol-menu.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/
    - expect: The Chase home page loads successfully
  2. Click the 'Español' menu item in the Customer service navigation
    - expect: Navigates to the Spanish version of the Chase site

### 4. Business Main Menu

**Seed:** `tests/seed.spec.ts`

#### 4.1. Verify Business menu items are displayed

**File:** `tests/business-main-menu/verify-business-menu-items.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/business
    - expect: The Chase for Business page loads successfully
  2. Locate the Business main navigation menubar
    - expect: The menubar is visible in the header
  3. Verify the following menu items are present: Checking & more, Loans & financing, Accept credit/debit cards, Business credit cards, Business services, Resource center
    - expect: All 6 menu items are displayed

#### 4.2. Checking & more menu dropdown

**File:** `tests/business-main-menu/checking-more-menu-dropdown.spec.ts`

**Steps:**
  1. Navigate to https://www.chase.com/business
    - expect: The Chase for Business page loads successfully
  2. Click the 'Checking & more' menu item
    - expect: A dropdown menu opens with the items 'Checking', 'Savings', and 'Retirement'
  3. Click 'Checking'
    - expect: Navigates to the business checking page
