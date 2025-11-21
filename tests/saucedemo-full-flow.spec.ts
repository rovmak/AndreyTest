import { test, expect } from '@playwright/test';

test.describe('Sauce Demo - Complete Shopping Flow', () => {
  
  test('login, add products to cart, and checkout', async ({ page }) => {
    // ========== LOGIN ==========
    await page.goto('https://www.saucedemo.com/');
    
    // Locators for login page
    const usernameInput = page.locator('#user-name');
    const passwordInput = page.locator('#password');
    const loginButton = page.locator('#login-button');
    
    await usernameInput.fill('standard_user');
    await passwordInput.fill('secret_sauce');
    await loginButton.click();
    
    // Verify login success
    await expect(page).toHaveURL(/.*inventory.html/);
    console.log('✓ Successfully logged in');
    
    // ========== BROWSE AND ADD PRODUCTS ==========
    
    // Locators for inventory page
    const inventoryItems = page.locator('.inventory_item');
    const cartBadge = page.locator('.shopping_cart_badge');
    
    // Get all product names and add buttons
    const productCount = await inventoryItems.count();
    console.log(`Found ${productCount} products`);
    
    // Loop through first 3 products and add them to cart
    for (let i = 0; i < Math.min(3, productCount); i++) {
      const item = inventoryItems.nth(i);
      
      // Get product details
      const productName = await item.locator('.inventory_item_name').textContent();
      const productPrice = await item.locator('.inventory_item_price').textContent();
      
      console.log(`Adding product ${i + 1}: ${productName} - ${productPrice}`);
      
      // Click add to cart button for this specific item
      await item.locator('button[id^="add-to-cart"]').click();
      
      // Verify button text changed to "Remove"
      await expect(item.locator('button[id^="remove"]')).toBeVisible();
    }
    
    // Verify cart badge shows correct count
    await expect(cartBadge).toHaveText('3');
    console.log('✓ Added 3 products to cart');
    
    // ========== GO TO CART ==========
    
    const cartLink = page.locator('.shopping_cart_link');
    await cartLink.click();
    
    // Verify we're on cart page
    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator('.title')).toHaveText('Your Cart');
    
    // Locators for cart page
    const cartItems = page.locator('.cart_item');
    const checkoutButton = page.locator('#checkout');
    
    // Verify cart has 3 items
    await expect(cartItems).toHaveCount(3);
    console.log('✓ Cart page shows 3 items');
    
    // ========== PROCEED TO CHECKOUT ==========
    
    await checkoutButton.click();
    
    // Verify we're on checkout step one
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
    
    // Locators for checkout step one
    const firstNameInput = page.locator('#first-name');
    const lastNameInput = page.locator('#last-name');
    const postalCodeInput = page.locator('#postal-code');
    const continueButton = page.locator('#continue');
    
    // Fill checkout information
    await firstNameInput.fill('John');
    await lastNameInput.fill('Doe');
    await postalCodeInput.fill('12345');
    await continueButton.click();
    
    console.log('✓ Filled checkout information');
    
    // ========== CHECKOUT OVERVIEW ==========
    
    // Verify we're on checkout step two
    await expect(page).toHaveURL(/.*checkout-step-two.html/);
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    
    // Locators for checkout overview
    const summaryItems = page.locator('.cart_item');
    const subtotalLabel = page.locator('.summary_subtotal_label');
    const taxLabel = page.locator('.summary_tax_label');
    const totalLabel = page.locator('.summary_total_label');
    const finishButton = page.locator('#finish');
    
    // Verify items in overview
    await expect(summaryItems).toHaveCount(3);
    
    // Log pricing information
    const subtotal = await subtotalLabel.textContent();
    const tax = await taxLabel.textContent();
    const total = await totalLabel.textContent();
    
    console.log(`Subtotal: ${subtotal}`);
    console.log(`Tax: ${tax}`);
    console.log(`Total: ${total}`);
    
    // Complete the order
    await finishButton.click();
    
    // ========== ORDER COMPLETE ==========
    
    // Verify we're on checkout complete page
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
    
    // Locators for complete page
    const completeHeader = page.locator('.complete-header');
    const completeText = page.locator('.complete-text');
    const backHomeButton = page.locator('#back-to-products');
    
    // Verify success message
    await expect(completeHeader).toHaveText('Thank you for your order!');
    await expect(completeText).toBeVisible();
    
    console.log('✓ Order completed successfully!');
    
    // Go back to products page
    await backHomeButton.click();
    await expect(page).toHaveURL(/.*inventory.html/);
    
    // Verify cart is now empty
    await expect(cartBadge).not.toBeVisible();
    console.log('✓ Cart is now empty, back on products page');
  });

  test('loop through ALL products and add each to cart individually', async ({ page }) => {
    // Login
    await page.goto('https://www.saucedemo.com/');
    await page.locator('#user-name').fill('standard_user');
    await page.locator('#password').fill('secret_sauce');
    await page.locator('#login-button').click();
    
    // Get all products
    const inventoryItems = page.locator('.inventory_item');
    const productCount = await inventoryItems.count();
    
    console.log(`\n========== TESTING ALL ${productCount} PRODUCTS ==========\n`);
    
    // Loop through each product
    for (let i = 0; i < productCount; i++) {
      const item = inventoryItems.nth(i);
      
      // Product locators
      const productName = item.locator('.inventory_item_name');
      const productDesc = item.locator('.inventory_item_desc');
      const productPrice = item.locator('.inventory_item_price');
      const productImage = item.locator('.inventory_item_img img');
      const addButton = item.locator('button[id^="add-to-cart"]');
      
      // Get product information
      const name = await productName.textContent();
      const description = await productDesc.textContent();
      const price = await productPrice.textContent();
      const imageSrc = await productImage.getAttribute('src');
      
      console.log(`\nProduct ${i + 1}:`);
      console.log(`  Name: ${name}`);
      console.log(`  Price: ${price}`);
      console.log(`  Description: ${description}`);
      console.log(`  Image: ${imageSrc}`);
      
      // Add to cart
      await addButton.click();
      console.log(`  ✓ Added to cart`);
      
      // Verify button changed to remove
      const removeButton = item.locator('button[id^="remove"]');
      await expect(removeButton).toBeVisible();
      
      // Verify cart badge count
      const cartBadge = page.locator('.shopping_cart_badge');
      await expect(cartBadge).toHaveText(String(i + 1));
      
      // Optional: Click on product to see details
      await productName.click();
      
      // Product detail page locators
      const detailName = page.locator('.inventory_details_name');
      const detailDesc = page.locator('.inventory_details_desc');
      const detailPrice = page.locator('.inventory_details_price');
      const backButton = page.locator('#back-to-products');
      
      await expect(detailName).toHaveText(name || '');
      console.log(`  ✓ Verified product detail page`);
      
      // Go back to inventory
      await backButton.click();
      await expect(page).toHaveURL(/.*inventory.html/);
    }
    
    console.log(`\n✓ Successfully added all ${productCount} products to cart!`);
    
    // Verify final cart count
    const finalCartBadge = page.locator('.shopping_cart_badge');
    await expect(finalCartBadge).toHaveText(String(productCount));
  });
});
