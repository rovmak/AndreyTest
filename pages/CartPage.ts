import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  
  // Selectors in constructor
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly cartItemName: Locator;
  readonly cartItemPrice: Locator;
  readonly cartQuantity: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize all selectors
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.cartItemName = page.locator('.inventory_item_name');
    this.cartItemPrice = page.locator('.inventory_item_price');
    this.cartQuantity = page.locator('.cart_quantity');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
  }

  // Methods
  async getCartItemCount() {
    return await this.cartItems.count();
  }

  async getCartItemByIndex(index: number) {
    const item = this.cartItems.nth(index);
    return {
      element: item,
      name: await item.locator('.inventory_item_name').textContent(),
      price: await item.locator('.inventory_item_price').textContent(),
      quantity: await item.locator('.cart_quantity').textContent()
    };
  }

  async removeItemByIndex(index: number) {
    const item = this.cartItems.nth(index);
    await item.locator('button[id^="remove"]').click();
  }

  async getAllItemNames() {
    const names: string[] = [];
    const count = await this.cartItems.count();
    for (let i = 0; i < count; i++) {
      const name = await this.cartItems.nth(i).locator('.inventory_item_name').textContent();
      if (name) names.push(name);
    }
    return names;
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
