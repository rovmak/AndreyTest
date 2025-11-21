import { test, expect } from '@playwright/test';

test('login to Sauce Demo', async ({ page }) => {
  // Navigate to Sauce Demo
  await page.goto('https://www.saucedemo.com/');

  // Fill in the username
  await page.fill('#user-name', 'standard_user');

  // Fill in the password
  await page.fill('#password', 'secret_sauce');

  // Click the login button
  await page.click('#login-button');

  // Wait for navigation and verify login was successful
  await expect(page).toHaveURL(/.*inventory.html/);
  
  // Verify we're on the products page
  await expect(page.locator('.title')).toHaveText('Products');
  
  console.log('Successfully logged in to Sauce Demo!');
});
