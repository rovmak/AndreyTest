import { Page, Locator } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  
  // Selectors in constructor
  readonly pageTitle: Locator;
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly completeImage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize all selectors
    this.pageTitle = page.locator('.title');
    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.completeImage = page.locator('.pony_express');
    this.backHomeButton = page.locator('#back-to-products');
  }

  // Methods
  async getCompleteHeader() {
    return await this.completeHeader.textContent();
  }

  async getCompleteText() {
    return await this.completeText.textContent();
  }

  async isCompleteImageVisible() {
    return await this.completeImage.isVisible();
  }

  async goBackHome() {
    await this.backHomeButton.click();
  }

  async verifyOrderComplete() {
    const header = await this.getCompleteHeader();
    return header === 'Thank you for your order!';
  }
}
