import { Page, Locator } from '@playwright/test';

export class CheckoutStepTwoPage {
  readonly page: Page;
  
  // Selectors in constructor
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize all selectors
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.paymentInfo = page.locator('.summary_value_label').first();
    this.shippingInfo = page.locator('.summary_value_label').last();
    this.cancelButton = page.locator('#cancel');
    this.finishButton = page.locator('#finish');
  }

  // Methods
  async getItemCount() {
    return await this.cartItems.count();
  }

  async getItemByIndex(index: number) {
    const item = this.cartItems.nth(index);
    return {
      element: item,
      name: await item.locator('.inventory_item_name').textContent(),
      price: await item.locator('.inventory_item_price').textContent(),
      quantity: await item.locator('.cart_quantity').textContent()
    };
  }

  async getPricingSummary() {
    const subtotal = await this.subtotalLabel.textContent();
    const tax = await this.taxLabel.textContent();
    const total = await this.totalLabel.textContent();
    
    return {
      subtotal: subtotal || '',
      tax: tax || '',
      total: total || '',
      subtotalAmount: this.extractAmount(subtotal || ''),
      taxAmount: this.extractAmount(tax || ''),
      totalAmount: this.extractAmount(total || '')
    };
  }

  private extractAmount(text: string): number {
    const match = text.match(/\$(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }

  async getPaymentInfo() {
    return await this.paymentInfo.textContent();
  }

  async getShippingInfo() {
    return await this.shippingInfo.textContent();
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async completeOrder() {
    await this.clickFinish();
  }
}
