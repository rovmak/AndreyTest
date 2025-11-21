# Page Object Model (POM) Structure

This project implements the Page Object Model (POM) design pattern for Sauce Demo test automation.

## 📁 Project Structure

```
PLA/
├── pages/
│   ├── index.ts                    # Export all pages
│   ├── LoginPage.ts                # Login page object
│   ├── InventoryPage.ts            # Products/Inventory page object
│   ├── CartPage.ts                 # Shopping cart page object
│   ├── CheckoutStepOnePage.ts      # Checkout information page object
│   ├── CheckoutStepTwoPage.ts      # Checkout overview page object
│   └── CheckoutCompletePage.ts     # Order complete page object
├── tests/
│   └── saucedemo-pom.spec.ts       # Test files using POM
└── README-POM.md                   # This file
```

## 🎯 POM Architecture

### What is Page Object Model?

The Page Object Model is a design pattern where:
- **Page Classes**: Represent web pages/sections with selectors in the constructor
- **Methods**: Encapsulate page interactions and business logic
- **Tests**: Use page objects to perform actions and assertions

### Benefits

✅ **Maintainability**: Change selectors in one place  
✅ **Reusability**: Use page methods across multiple tests  
✅ **Readability**: Tests read like business workflows  
✅ **Reduced Duplication**: No repeated selector definitions

## 📄 Page Objects Overview

### 1. LoginPage (`pages/LoginPage.ts`)

**Selectors in Constructor:**
- `usernameInput`: Username field
- `passwordInput`: Password field
- `loginButton`: Login submit button
- `errorMessage`: Error message container

**Methods:**
- `goto()`: Navigate to login page
- `login(username, password)`: Perform login
- `getErrorMessage()`: Get error text
- `isErrorVisible()`: Check if error is visible

**Usage Example:**
```typescript
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('standard_user', 'secret_sauce');
```

---

### 2. InventoryPage (`pages/InventoryPage.ts`)

**Selectors in Constructor:**
- `pageTitle`: Page title element
- `inventoryItems`: All product items
- `cartLink`: Shopping cart link
- `cartBadge`: Cart item count badge
- `sortDropdown`: Product sort dropdown
- `burgerMenuButton`: Menu button
- `logoutLink`: Logout link

**Methods:**
- `getProductCount()`: Get total products
- `getProductByIndex(index)`: Get product details by index
- `addProductToCartByIndex(index)`: Add product by position
- `addProductToCartByName(name)`: Add product by name
- `removeProductFromCartByIndex(index)`: Remove product
- `clickProductByIndex(index)`: Click product to view details
- `getCartItemCount()`: Get cart badge count
- `goToCart()`: Navigate to cart
- `sortProducts(option)`: Sort products
- `getAllProductNames()`: Get all product names
- `logout()`: Log out user

**Usage Example:**
```typescript
const inventoryPage = new InventoryPage(page);
await inventoryPage.addProductToCartByIndex(0);
await inventoryPage.addProductToCartByName('Sauce Labs Backpack');
await inventoryPage.goToCart();
```

---

### 3. CartPage (`pages/CartPage.ts`)

**Selectors in Constructor:**
- `pageTitle`: Cart page title
- `cartItems`: All cart items
- `continueShoppingButton`: Continue shopping button
- `checkoutButton`: Proceed to checkout button

**Methods:**
- `getCartItemCount()`: Get number of items in cart
- `getCartItemByIndex(index)`: Get cart item details
- `removeItemByIndex(index)`: Remove item from cart
- `getAllItemNames()`: Get all item names
- `continueShopping()`: Go back to products
- `proceedToCheckout()`: Start checkout process

**Usage Example:**
```typescript
const cartPage = new CartPage(page);
const itemCount = await cartPage.getCartItemCount();
await cartPage.proceedToCheckout();
```

---

### 4. CheckoutStepOnePage (`pages/CheckoutStepOnePage.ts`)

**Selectors in Constructor:**
- `pageTitle`: Checkout page title
- `firstNameInput`: First name field
- `lastNameInput`: Last name field
- `postalCodeInput`: Postal code field
- `continueButton`: Continue button
- `cancelButton`: Cancel button
- `errorMessage`: Error message

**Methods:**
- `fillCheckoutInformation(firstName, lastName, postalCode)`: Fill form
- `clickContinue()`: Continue to next step
- `clickCancel()`: Cancel checkout
- `completeCheckoutInfo(...)`: Fill form and continue
- `getErrorMessage()`: Get error text
- `isErrorVisible()`: Check error visibility

**Usage Example:**
```typescript
const checkoutStep1 = new CheckoutStepOnePage(page);
await checkoutStep1.completeCheckoutInfo('John', 'Doe', '12345');
```

---

### 5. CheckoutStepTwoPage (`pages/CheckoutStepTwoPage.ts`)

**Selectors in Constructor:**
- `pageTitle`: Overview page title
- `cartItems`: Items in overview
- `subtotalLabel`: Subtotal amount
- `taxLabel`: Tax amount
- `totalLabel`: Total amount
- `paymentInfo`: Payment information
- `shippingInfo`: Shipping information
- `finishButton`: Finish button
- `cancelButton`: Cancel button

**Methods:**
- `getItemCount()`: Get item count
- `getItemByIndex(index)`: Get item details
- `getPricingSummary()`: Get pricing breakdown
- `getPaymentInfo()`: Get payment details
- `getShippingInfo()`: Get shipping details
- `clickFinish()`: Complete order
- `clickCancel()`: Cancel order
- `completeOrder()`: Finish checkout

**Usage Example:**
```typescript
const checkoutStep2 = new CheckoutStepTwoPage(page);
const pricing = await checkoutStep2.getPricingSummary();
console.log(`Total: ${pricing.total}`);
await checkoutStep2.completeOrder();
```

---

### 6. CheckoutCompletePage (`pages/CheckoutCompletePage.ts`)

**Selectors in Constructor:**
- `pageTitle`: Complete page title
- `completeHeader`: Success header
- `completeText`: Success message
- `completeImage`: Pony express image
- `backHomeButton`: Back to products button

**Methods:**
- `getCompleteHeader()`: Get success header text
- `getCompleteText()`: Get success message
- `isCompleteImageVisible()`: Check image visibility
- `goBackHome()`: Return to products page
- `verifyOrderComplete()`: Verify order success

**Usage Example:**
```typescript
const checkoutComplete = new CheckoutCompletePage(page);
const isComplete = await checkoutComplete.verifyOrderComplete();
await checkoutComplete.goBackHome();
```

---

## 🧪 Test Examples

### Complete Shopping Flow
```typescript
test('complete shopping flow using POM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutStep1 = new CheckoutStepOnePage(page);
  const checkoutStep2 = new CheckoutStepTwoPage(page);
  const checkoutComplete = new CheckoutCompletePage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');
  
  await inventoryPage.addProductToCartByIndex(0);
  await inventoryPage.goToCart();
  
  await cartPage.proceedToCheckout();
  await checkoutStep1.completeCheckoutInfo('John', 'Doe', '12345');
  await checkoutStep2.completeOrder();
  
  await expect(checkoutComplete.completeHeader)
    .toHaveText('Thank you for your order!');
});
```

### Loop Through Products
```typescript
test('add all products to cart', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const productCount = await inventoryPage.getProductCount();
  
  for (let i = 0; i < productCount; i++) {
    const product = await inventoryPage.getProductByIndex(i);
    console.log(`Adding: ${product.name}`);
    await inventoryPage.addProductToCartByIndex(i);
  }
});
```

## 🚀 Running Tests

```bash
# Run all POM tests
npx playwright test tests/saucedemo-pom.spec.ts

# Run with UI
npx playwright test tests/saucedemo-pom.spec.ts --headed

# Run in debug mode
npx playwright test tests/saucedemo-pom.spec.ts --debug

# Run specific test
npx playwright test tests/saucedemo-pom.spec.ts -g "complete shopping flow"
```

## 📦 Importing Pages

### Individual Import
```typescript
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
```

### Bulk Import
```typescript
import { 
  LoginPage, 
  InventoryPage, 
  CartPage, 
  CheckoutStepOnePage,
  CheckoutStepTwoPage,
  CheckoutCompletePage 
} from '../pages';
```

## 🎨 POM Best Practices

1. **Selectors in Constructor**: Always define locators in the constructor
2. **Readonly Properties**: Make page and locators readonly
3. **Method Naming**: Use clear, action-oriented method names
4. **Return Values**: Return useful data from getter methods
5. **Single Responsibility**: Each method should do one thing
6. **Reusability**: Create generic methods that can be reused
7. **Type Safety**: Use TypeScript for type checking
8. **Documentation**: Add comments for complex methods

## 📚 Additional Resources

- [Playwright Page Object Model](https://playwright.dev/docs/pom)
- [Sauce Demo Website](https://www.saucedemo.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
