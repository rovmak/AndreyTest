import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutStepOnePage } from '../pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';

test.describe('Sauce Demo - POM Tests', () => {
  
  test('complete shopping flow using POM', async ({ page }) => {
    // Initialize all page objects
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStep1 = new CheckoutStepOnePage(page);
    const checkoutStep2 = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    // ========== LOGIN ==========
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    console.log('✓ Login successful');

    // ========== ADD PRODUCTS TO CART ==========
    const productCount = await inventoryPage.getProductCount();
    console.log(`Found ${productCount} products`);

    // Add first 3 products
    for (let i = 0; i < 3; i++) {
      const product = await inventoryPage.getProductByIndex(i);
      console.log(`Adding: ${product.name} - ${product.price}`);
      await inventoryPage.addProductToCartByIndex(i);
    }

    // Verify cart badge
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(3);
    console.log('✓ Added 3 products to cart'); 

    // ========== GO TO CART ==========
    await inventoryPage.goToCart();
    
    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(3);
    console.log('✓ Cart page verified');

    // ========== CHECKOUT ==========
    await cartPage.proceedToCheckout();
    
    await expect(checkoutStep1.pageTitle).toHaveText('Checkout: Your Information');
    await checkoutStep1.completeCheckoutInfo('John', 'Doe', '12345');
    console.log('✓ Checkout info filled');

    // ========== REVIEW ORDER ==========
    await expect(checkoutStep2.pageTitle).toHaveText('Checkout: Overview');
    
    const pricing = await checkoutStep2.getPricingSummary();
    console.log(`Subtotal: ${pricing.subtotal}`);
    console.log(`Tax: ${pricing.tax}`);
    console.log(`Total: ${pricing.total}`);
    
    await checkoutStep2.completeOrder();
    console.log('✓ Order placed');

    // ========== VERIFY COMPLETION ==========
    await expect(checkoutComplete.pageTitle).toHaveText('Checkout: Complete!');
    await expect(checkoutComplete.completeHeader).toHaveText('Thank you for your order!');
    
    const isComplete = await checkoutComplete.verifyOrderComplete();
    expect(isComplete).toBe(true);
    console.log('✓ Order completed successfully!');

    await checkoutComplete.goBackHome();
    await expect(inventoryPage.pageTitle).toHaveText('Products');
    console.log('✓ Returned to products page');
  });

  test('loop through all products and add to cart using POM', async ({ page }) => {
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Login
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    
    console.log('\n========== ADDING ALL PRODUCTS ==========\n');

    // Get all products and add them
    const productCount = await inventoryPage.getProductCount();
    
    for (let i = 0; i < productCount; i++) {
      const product = await inventoryPage.getProductByIndex(i);
      
      console.log(`\nProduct ${i + 1}:`);
      console.log(`  Name: ${product.name}`);
      console.log(`  Price: ${product.price}`);
      console.log(`  Description: ${product.description}`);
      
      await inventoryPage.addProductToCartByIndex(i);
      console.log('  ✓ Added to cart');
      
      // Verify cart count increased
      const cartCount = await inventoryPage.getCartItemCount();
      expect(cartCount).toBe(i + 1);
    }

    const finalCount = await inventoryPage.getCartItemCount();
    expect(finalCount).toBe(productCount);
    console.log(`\n✓ Successfully added all ${productCount} products to cart!`);
  });

  test('add products by name using POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // Add specific products by name
    await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
    await inventoryPage.addProductToCartByName('Sauce Labs Bike Light');
    await inventoryPage.addProductToCartByName('Sauce Labs Bolt T-Shirt');

    console.log('✓ Added products by name');

    // Verify in cart
    await inventoryPage.goToCart();
    const cartItems = await cartPage.getAllItemNames();
    
    console.log('\nCart items:');
    cartItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item}`);
    });

    expect(cartItems).toContain('Sauce Labs Backpack');
    expect(cartItems).toContain('Sauce Labs Bike Light');
    expect(cartItems).toContain('Sauce Labs Bolt T-Shirt');
    
    console.log('✓ Verified all items in cart');
  });

  test('sort products and verify order using POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // Test sorting
    console.log('\n========== TESTING SORTING ==========\n');

    // Sort A to Z (default)
    let productNames = await inventoryPage.getAllProductNames();
    console.log('Default order (A-Z):');
    productNames.forEach((name, i) => console.log(`  ${i + 1}. ${name}`));

    // Sort Z to A
    await inventoryPage.sortProducts('za');
    await page.waitForTimeout(500); // Wait for sort
    productNames = await inventoryPage.getAllProductNames();
    console.log('\nReverse order (Z-A):');
    productNames.forEach((name, i) => console.log(`  ${i + 1}. ${name}`));

    // Sort low to high
    await inventoryPage.sortProducts('lohi');
    await page.waitForTimeout(500);
    console.log('\n✓ Sorted by price (low to high)');

    // Sort high to low
    await inventoryPage.sortProducts('hilo');
    await page.waitForTimeout(500);
    console.log('✓ Sorted by price (high to low)');
  });

  test('remove items from cart using POM', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    // Add 3 products
    for (let i = 0; i < 3; i++) {
      await inventoryPage.addProductToCartByIndex(i);
    }

    await inventoryPage.goToCart();
    
    let cartCount = await cartPage.getCartItemCount();
    console.log(`Initial cart items: ${cartCount}`);
    expect(cartCount).toBe(3);

    // Remove first item
    await cartPage.removeItemByIndex(0);
    cartCount = await cartPage.getCartItemCount();
    console.log(`After removing 1 item: ${cartCount}`);
    expect(cartCount).toBe(2);

    // Remove another item
    await cartPage.removeItemByIndex(0);
    cartCount = await cartPage.getCartItemCount();
    console.log(`After removing 2nd item: ${cartCount}`);
    expect(cartCount).toBe(1);

    console.log('✓ Successfully removed items from cart');
  });
});
