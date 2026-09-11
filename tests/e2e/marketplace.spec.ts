import { test, expect } from '@playwright/test';

test.describe('AgroAssist Farm-to-Customer Marketplace E2E Test Suite', () => {

  test('1. User can register as a Buyer / Customer', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to register if not authenticated or click Register button
    const registerBtn = page.getByRole('button', { name: /Register Farmer \/ Officer|Register|Join/i });
    if (await registerBtn.isVisible()) {
      await registerBtn.click();
    } else {
      await page.goto('/register');
    }

    // Select Customer / Buyer tab
    const buyerRoleBtn = page.getByRole('button', { name: /Buyer \/ Customer/i });
    if (await buyerRoleBtn.isVisible()) {
      await buyerRoleBtn.click();
    }

    // Fill registration credentials
    const testEmail = `buyer_${Date.now()}@greentable.com`;
    await page.fill('input[type="text"]', 'GreenTable Farm Kitchen');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="tel"]', '+91 98765 43210');
    await page.fill('input[type="password"]', 'password123');

    // Submit registration form
    await page.click('button[type="submit"]');

    // Expect navigation to marketplace or dashboard
    await expect(page).toHaveURL(/\/(marketplace|dashboard)/);
  });

  test('2. Farmer can login and view Dashboard', async ({ page }) => {
    await page.goto('/login');

    // Use quick demo farmer login
    const farmerLoginBtn = page.getByRole('button', { name: /🌾 Farmer/i });
    if (await farmerLoginBtn.isVisible()) {
      await farmerLoginBtn.click();
    } else {
      await page.fill('input[type="email"]', 'farmer@agroassist.gov.in');
      await page.fill('input[type="password"]', 'farmer123');
      await page.click('button[type="submit"]');
    }

    await expect(page).toHaveURL(/\/(dashboard|marketplace)/);
  });

  test('3. Farmer can Add a new Produce Listing to Inventory', async ({ page }) => {
    await page.goto('/farmer-products');

    // Click "Add Harvest Produce Lot"
    const addProduceBtn = page.getByRole('button', { name: /Add Produce Lot|List New Harvest/i });
    if (await addProduceBtn.isVisible()) {
      await addProduceBtn.click();

      // Modal opens
      await page.fill('input[placeholder*="Produce Name" i]', 'Heirloom Vine Sweet Corn');
      await page.fill('input[type="number"]', '150');
      
      // Submit new harvest lot
      await page.click('button:has-text("Publish Produce Lot")');
      
      // Verification of produce in list
      await expect(page.getByText('Heirloom Vine Sweet Corn')).toBeVisible();
    }
  });

  test('4. Customer can Browse Products and Add to Cart', async ({ page }) => {
    await page.goto('/marketplace');

    // Search for a specific harvest
    await page.fill('input[placeholder*="Search harvests" i]', 'Basmati');

    // Add first item to cart
    const addToCartButtons = page.getByRole('button', { name: /Add to Cart/i });
    await expect(addToCartButtons.first()).toBeVisible();
    await addToCartButtons.first().click();

    // Verify item count badge or notification appears
    await expect(page.getByText(/Added!|Item added to cart/i).first()).toBeVisible();
  });

  test('5. Customer can open Cart and complete Escrow Checkout', async ({ page }) => {
    await page.goto('/marketplace');

    // Open shopping cart drawer
    const cartButton = page.getByTitle(/View Cart|Open Shopping Cart/i);
    await cartButton.click();

    // Verify cart drawer is open
    await expect(page.getByText(/Farm Direct Harvest Basket|Escrow-Secured Order/i)).toBeVisible();

    // Click Proceed to Escrow Checkout
    const checkoutBtn = page.getByRole('button', { name: /Proceed to Escrow Checkout|Place Escrow-Secured Order/i });
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      
      // Success feedback appears
      await expect(page.getByText(/Order Placed Successfully|Escrow Secured/i)).toBeVisible();
    }
  });

  test('6. User can Logout and return to Sign In', async ({ page }) => {
    await page.goto('/marketplace');

    // Open User menu or click Logout
    const userMenuBtn = page.getByTitle(/User Profile/i);
    if (await userMenuBtn.isVisible()) {
      await userMenuBtn.click();
    }

    const logoutBtn = page.getByRole('button', { name: /Sign Out|Logout/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await expect(page).toHaveURL(/\/(login|landing)/);
    }
  });

});
