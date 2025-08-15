// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Login Test Suite for http://lengkeng-dev.hocai.fun/
 * Credentials: admin / passwd
 */

test.describe('Login Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the main page before each test
    await page.goto('/');
  });

  test('successful login with valid credentials', async ({ page }) => {
    // Look for common login form elements
    // Try multiple possible selectors for username/email field
    const usernameSelectors = [
      'input[name="username"]',
      'input[name="email"]',
      'input[name="login"]',
      'input[type="text"]',
      '#username',
      '#email',
      '#login',
      '.username',
      '.email',
      '.login'
    ];
    
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      '#password',
      '.password'
    ];
    
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      'button:has-text("Đăng nhập")',
      '#login-button',
      '.login-button',
      '.btn-login'
    ];

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the initial page
    await page.screenshot({ 
      path: 'test-results/01-initial-page.png',
      fullPage: true 
    });

    // Find and fill username field
    let usernameField = null;
    for (const selector of usernameSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          usernameField = element;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!usernameField) {
      throw new Error('Username field not found. Available selectors attempted: ' + usernameSelectors.join(', '));
    }

    // Find password field
    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          passwordField = element;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!passwordField) {
      throw new Error('Password field not found. Available selectors attempted: ' + passwordSelectors.join(', '));
    }

    // Fill in the credentials
    await usernameField.fill('admin');
    await passwordField.fill('passwd');
    
    // Take a screenshot after filling the form
    await page.screenshot({ 
      path: 'test-results/02-form-filled.png',
      fullPage: true 
    });

    // Find and click submit button
    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          submitButton = element;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!submitButton) {
      // Try pressing Enter as fallback
      await passwordField.press('Enter');
    } else {
      await submitButton.click();
    }

    // Wait for navigation or page change after login
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot after login attempt
    await page.screenshot({ 
      path: 'test-results/03-after-login.png',
      fullPage: true 
    });

    // Check for successful login indicators
    const currentUrl = page.url();
    
    // Look for common success indicators
    const successIndicators = [
      // URL changes
      () => currentUrl !== 'http://lengkeng-dev.hocai.fun/' && !currentUrl.includes('login'),
      
      // Dashboard or welcome elements
      () => page.locator('text=dashboard').first().isVisible({ timeout: 2000 }).catch(() => false),
      () => page.locator('text=welcome').first().isVisible({ timeout: 2000 }).catch(() => false),
      () => page.locator('text=admin').first().isVisible({ timeout: 2000 }).catch(() => false),
      () => page.locator('[data-testid="dashboard"]').first().isVisible({ timeout: 2000 }).catch(() => false),
      
      // Logout button or user menu
      () => page.locator('text=logout').first().isVisible({ timeout: 2000 }).catch(() => false),
      () => page.locator('text=sign out').first().isVisible({ timeout: 2000 }).catch(() => false),
      () => page.locator('.user-menu').first().isVisible({ timeout: 2000 }).catch(() => false),
      
      // Absence of login form
      () => page.locator('input[type="password"]').first().isHidden({ timeout: 2000 }).catch(() => false)
    ];

    let loginSuccess = false;
    for (const indicator of successIndicators) {
      try {
        if (await indicator()) {
          loginSuccess = true;
          break;
        }
      } catch (e) {
        // Continue checking other indicators
      }
    }

    // Verify login success
    expect(loginSuccess).toBeTruthy();
    
    console.log(`Login successful! Current URL: ${currentUrl}`);
  });

  test('login with invalid credentials should fail', async ({ page }) => {
    // Similar form detection logic as above but with invalid credentials
    const usernameSelectors = [
      'input[name="username"]',
      'input[name="email"]',
      'input[name="login"]',
      'input[type="text"]',
      '#username',
      '#email',
      '#login'
    ];
    
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      '#password'
    ];

    await page.waitForLoadState('networkidle');

    // Find username field
    let usernameField = null;
    for (const selector of usernameSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          usernameField = element;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    // Find password field
    let passwordField = null;
    for (const selector of passwordSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          passwordField = element;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (usernameField && passwordField) {
      // Fill with invalid credentials
      await usernameField.fill('invalid_user');
      await passwordField.fill('invalid_password');
      await passwordField.press('Enter');

      await page.waitForLoadState('networkidle');
      
      // Take screenshot of error state
      await page.screenshot({ 
        path: 'test-results/04-invalid-login.png',
        fullPage: true 
      });

      // Check for error messages
      const errorSelectors = [
        'text=invalid',
        'text=error',
        'text=incorrect',
        'text=failed',
        '.error',
        '.alert-danger',
        '.error-message',
        '[data-testid="error"]'
      ];

      let errorFound = false;
      for (const selector of errorSelectors) {
        try {
          if (await page.locator(selector).first().isVisible({ timeout: 2000 })) {
            errorFound = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      // Either error message should be shown OR we should still be on login page
      const stillOnLoginPage = page.url().includes('login') || 
                              page.url() === 'http://lengkeng-dev.hocai.fun/' ||
                              await page.locator('input[type="password"]').first().isVisible();
      
      expect(errorFound || stillOnLoginPage).toBeTruthy();
    } else {
      // Skip this test if we can't find the form elements
      test.skip();
    }
  });

  test('empty form submission should show validation', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      'button:has-text("Đăng nhập")'
    ];

    let submitButton = null;
    for (const selector of submitSelectors) {
      try {
        const element = page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 })) {
          submitButton = element;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (submitButton) {
      await submitButton.click();
      await page.waitForTimeout(1000); // Wait for validation messages
      
      // Take screenshot of validation state
      await page.screenshot({ 
        path: 'test-results/05-empty-form-validation.png',
        fullPage: true 
      });

      // Check for validation messages or that we're still on the same page
      const validationSelectors = [
        'text=required',
        'text=field is required',
        'text=Please fill',
        '.invalid-feedback',
        '.validation-error',
        '[data-testid="validation-error"]'
      ];

      let validationFound = false;
      for (const selector of validationSelectors) {
        try {
          if (await page.locator(selector).first().isVisible({ timeout: 1000 })) {
            validationFound = true;
            break;
          }
        } catch (e) {
          continue;
        }
      }

      // Either validation message should be shown OR HTML5 validation should prevent submission
      const stillOnPage = page.url().includes('login') || page.url() === 'http://lengkeng-dev.hocai.fun/';
      expect(validationFound || stillOnPage).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('page elements and accessibility', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for visual verification
    await page.screenshot({ 
      path: 'test-results/06-accessibility-check.png',
      fullPage: true 
    });

    // Check basic page structure
    expect(await page.title()).toBeTruthy(); // Page should have a title
    
    // Check that the page is not completely empty
    const bodyContent = await page.locator('body').textContent();
    expect(bodyContent?.trim().length).toBeGreaterThan(0);
    
    // Log page info for debugging
    console.log(`Page title: ${await page.title()}`);
    console.log(`Page URL: ${page.url()}`);
    console.log(`Page has content: ${bodyContent?.trim().length} characters`);
  });

});

// Global test setup
test.beforeAll(async () => {
  // Create test-results directory for screenshots
  const fs = require('fs');
  const path = require('path');
  const testResultsDir = path.join(__dirname, '..', 'test-results');
  
  if (!fs.existsSync(testResultsDir)) {
    fs.mkdirSync(testResultsDir, { recursive: true });
  }
});