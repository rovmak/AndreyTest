import { Page, Locator } from '@playwright/test';

export class CheckoutStepOnePage {
  readonly page: Page;
  
  // Selectors in constructor
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize all selectors
    this.pageTitle = page.locator('.title');
    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.cancelButton = page.locator('#cancel');
    this.continueButton = page.locator('#continue');
    this.errorMessage = page.locator('.error-message-container');
  }

  // Methods
  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }

  async completeCheckoutInfo(firstName: string, lastName: string, postalCode: string) {
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.clickContinue();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}
