import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  
  // Selectors in constructor
  readonly pageTitle: Locator;
  readonly inventoryItems: Locator;
  readonly inventoryItemName: Locator;
  readonly inventoryItemDesc: Locator;
  readonly inventoryItemPrice: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize all selectors
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.inventoryItemName = page.locator('.inventory_item_name');
    this.inventoryItemDesc = page.locator('.inventory_item_desc');
    this.inventoryItemPrice = page.locator('.inventory_item_price');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('.product_sort_container');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  // Methods
  async getProductCount() {
    return await this.inventoryItems.count();
  }

  async getProductByIndex(index: number) {
    const item = this.inventoryItems.nth(index);
    return {
      element: item,
      name: await item.locator('.inventory_item_name').textContent(),
      description: await item.locator('.inventory_item_desc').textContent(),
      price: await item.locator('.inventory_item_price').textContent()
    };
  }

  async addProductToCartByIndex(index: number) {
    const item = this.inventoryItems.nth(index);
    await item.locator('button[id^="add-to-cart"]').click();
  }

  async addProductToCartByName(productName: string) {
    const product = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
    await this.page.locator(`#add-to-cart-${product}`).click();
  }

  async removeProductFromCartByIndex(index: number) {
    const item = this.inventoryItems.nth(index);
    await item.locator('button[id^="remove"]').click();
  }

  async clickProductByIndex(index: number) {
    await this.inventoryItems.nth(index).locator('.inventory_item_name').click();
  }

  async getCartItemCount() {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const count = await this.cartBadge.textContent();
    return count ? parseInt(count) : 0;
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getAllProductNames() {
    const names: string[] = [];
    const count = await this.inventoryItems.count();
    for (let i = 0; i < count; i++) {
      const name = await this.inventoryItems.nth(i).locator('.inventory_item_name').textContent();
      if (name) names.push(name);
    }
    return names;
  }

  async logout() {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }
}
