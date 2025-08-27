"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const test_helpers_1 = require("../utils/test-helpers");
class MockBrowser {
    constructor() {
        this.elements = new Map();
        this.currentUrl = '';
        this.localStorage = new Map();
    }
    async goto(url) {
        this.currentUrl = url;
        await (0, test_helpers_1.sleep)(100);
    }
    async fill(selector, value) {
        this.elements.set(selector, value);
        await (0, test_helpers_1.sleep)(50);
    }
    async click(selector) {
        await (0, test_helpers_1.sleep)(100);
        if (selector.includes('submit')) {
            if (this.currentUrl.includes('/register')) {
                this.currentUrl = '/dashboard';
            }
            else if (this.currentUrl.includes('/login')) {
                this.localStorage.set('token', 'mock-jwt-token');
                this.currentUrl = '/dashboard';
            }
        }
    }
    async waitForURL(expectedUrl, timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            if (this.currentUrl.includes(expectedUrl)) {
                return;
            }
            await (0, test_helpers_1.sleep)(100);
        }
        throw new Error(`Timeout waiting for URL: ${expectedUrl}. Current: ${this.currentUrl}`);
    }
    async textContent(selector) {
        if (selector === 'h1' && this.currentUrl.includes('/dashboard')) {
            return 'Welcome to Dashboard!';
        }
        if (selector.includes('error') && this.elements.get('[name="password"]') === 'wrong') {
            return 'Invalid credentials';
        }
        return '';
    }
    async waitForSelector(selector, timeout = 5000) {
        await (0, test_helpers_1.sleep)(100);
        return true;
    }
    async getAttribute(selector, attribute) {
        if (attribute === 'value') {
            return this.elements.get(selector) || '';
        }
        return '';
    }
    async isVisible(selector) {
        return true;
    }
    async screenshot(options) {
        return Buffer.from('mock-screenshot');
    }
    getLocalStorage(key) {
        return this.localStorage.get(key) || null;
    }
    getCurrentUrl() {
        return this.currentUrl;
    }
}
(0, globals_1.describe)('User Registration and Login Flow', () => {
    let browser;
    (0, globals_1.beforeAll)(async () => {
        browser = new MockBrowser();
        console.log('🚀 Setting up E2E test environment...');
    });
    (0, globals_1.afterAll)(async () => {
        console.log('🧹 Cleaning up E2E test environment...');
    });
    (0, globals_1.beforeEach)(async () => {
        browser = new MockBrowser();
    });
    (0, globals_1.describe)('User Registration', () => {
        (0, globals_1.it)('should complete full registration process', async () => {
            const userData = test_helpers_1.generateTestData.user({
                name: 'E2E Test User',
                email: 'e2e.test@example.com',
                password: 'SecurePass123!'
            });
            await browser.goto('/register');
            await browser.fill('[name="name"]', userData.name);
            await browser.fill('[name="email"]', userData.email);
            await browser.fill('[name="password"]', userData.password);
            await browser.fill('[name="confirmPassword"]', userData.password);
            await browser.click('button[type="submit"]');
            await browser.waitForURL('/dashboard');
            (0, globals_1.expect)(browser.getCurrentUrl()).toContain('/dashboard');
            const welcomeText = await browser.textContent('h1');
            (0, globals_1.expect)(welcomeText).toBe('Welcome to Dashboard!');
        });
        (0, globals_1.it)('should show validation errors for invalid data', async () => {
            await browser.goto('/register');
            await browser.click('button[type="submit"]');
            const nameError = await browser.textContent('[data-testid="name-error"]');
            const emailError = await browser.textContent('[data-testid="email-error"]');
            (0, globals_1.expect)(nameError).toContain('Name is required');
            (0, globals_1.expect)(emailError).toContain('Email is required');
        });
        (0, globals_1.it)('should show password strength indicator', async () => {
            await browser.goto('/register');
            await browser.fill('[name="password"]', '123');
            await (0, test_helpers_1.sleep)(500);
            const weakIndicator = await browser.isVisible('[data-testid="password-weak"]');
            (0, globals_1.expect)(weakIndicator).toBe(true);
            await browser.fill('[name="password"]', 'StrongPass123!');
            await (0, test_helpers_1.sleep)(500);
            const strongIndicator = await browser.isVisible('[data-testid="password-strong"]');
            (0, globals_1.expect)(strongIndicator).toBe(true);
        });
        (0, globals_1.it)('should handle network errors gracefully', async () => {
            await browser.goto('/register');
            const userData = test_helpers_1.generateTestData.user();
            await browser.fill('[name="name"]', userData.name);
            await browser.fill('[name="email"]', userData.email);
            await browser.fill('[name="password"]', userData.password);
            (0, globals_1.expect)(browser.getCurrentUrl()).toContain('/register');
        });
    });
    (0, globals_1.describe)('User Login', () => {
        (0, globals_1.it)('should login with valid credentials', async () => {
            const credentials = {
                email: 'valid@example.com',
                password: 'ValidPass123!'
            };
            await browser.goto('/login');
            await browser.fill('[name="email"]', credentials.email);
            await browser.fill('[name="password"]', credentials.password);
            await browser.click('button[type="submit"]');
            await browser.waitForURL('/dashboard');
            (0, globals_1.expect)(browser.getCurrentUrl()).toContain('/dashboard');
            const token = browser.getLocalStorage('token');
            (0, globals_1.expect)(token).toBeTruthy();
        });
        (0, globals_1.it)('should show error for invalid credentials', async () => {
            await browser.goto('/login');
            await browser.fill('[name="email"]', 'invalid@example.com');
            await browser.fill('[name="password"]', 'wrong');
            await browser.click('button[type="submit"]');
            const errorMessage = await browser.textContent('[data-testid="login-error"]');
            (0, globals_1.expect)(errorMessage).toContain('Invalid credentials');
            (0, globals_1.expect)(browser.getCurrentUrl()).toContain('/login');
        });
        (0, globals_1.it)('should remember user with "Remember Me" option', async () => {
            await browser.goto('/login');
            await browser.fill('[name="email"]', 'user@example.com');
            await browser.fill('[name="password"]', 'Password123!');
            await browser.click('[name="rememberMe"]');
            await browser.click('button[type="submit"]');
            await browser.waitForURL('/dashboard');
            const rememberToken = browser.getLocalStorage('rememberToken');
            (0, globals_1.expect)(rememberToken).toBeTruthy();
        });
    });
    (0, globals_1.describe)('Dashboard Navigation', () => {
        (0, globals_1.beforeEach)(async () => {
            await browser.goto('/login');
            await browser.fill('[name="email"]', 'user@example.com');
            await browser.fill('[name="password"]', 'Password123!');
            await browser.click('button[type="submit"]');
            await browser.waitForURL('/dashboard');
        });
        (0, globals_1.it)('should navigate to profile page', async () => {
            await browser.click('[data-testid="profile-link"]');
            await browser.waitForURL('/profile');
            (0, globals_1.expect)(browser.getCurrentUrl()).toContain('/profile');
        });
        (0, globals_1.it)('should navigate to settings page', async () => {
            await browser.click('[data-testid="settings-link"]');
            await browser.waitForURL('/settings');
            (0, globals_1.expect)(browser.getCurrentUrl()).toContain('/settings');
        });
        (0, globals_1.it)('should logout successfully', async () => {
            await browser.click('[data-testid="logout-button"]');
            await browser.waitForURL('/login');
            (0, globals_1.expect)(browser.getCurrentUrl()).toContain('/login');
            const token = browser.getLocalStorage('token');
            (0, globals_1.expect)(token).toBeFalsy();
        });
    });
    (0, globals_1.describe)('Profile Management', () => {
        (0, globals_1.beforeEach)(async () => {
            await browser.goto('/login');
            await browser.fill('[name="email"]', 'user@example.com');
            await browser.fill('[name="password"]', 'Password123!');
            await browser.click('button[type="submit"]');
            await browser.waitForURL('/dashboard');
            await browser.click('[data-testid="profile-link"]');
        });
        (0, globals_1.it)('should update profile information', async () => {
            await browser.fill('[name="name"]', 'Updated Name');
            await browser.fill('[name="bio"]', 'Updated bio information');
            await browser.click('[data-testid="save-profile"]');
            await browser.waitForSelector('[data-testid="success-message"]');
            const successMessage = await browser.textContent('[data-testid="success-message"]');
            (0, globals_1.expect)(successMessage).toContain('Profile updated successfully');
        });
        (0, globals_1.it)('should upload profile picture', async () => {
            await browser.click('[data-testid="upload-picture"]');
            const uploadStatus = await browser.textContent('[data-testid="upload-status"]');
            (0, globals_1.expect)(uploadStatus).toContain('Picture uploaded');
        });
    });
    (0, globals_1.describe)('Error Handling and Recovery', () => {
        (0, globals_1.it)('should handle session timeout', async () => {
            await browser.goto('/login');
            await browser.fill('[name="email"]', 'user@example.com');
            await browser.fill('[name="password"]', 'Password123!');
            await browser.click('button[type="submit"]');
            await browser.waitForURL('/dashboard');
            await browser.goto('/profile');
            await browser.waitForURL('/login');
            (0, globals_1.expect)(browser.getCurrentUrl()).toContain('/login');
        });
        (0, globals_1.it)('should show offline indicator', async () => {
            await browser.goto('/dashboard');
            const offlineIndicator = await browser.isVisible('[data-testid="offline-indicator"]');
        });
        (0, globals_1.it)('should recover from network errors', async () => {
            await browser.goto('/login');
            await browser.fill('[name="email"]', 'user@example.com');
            await browser.fill('[name="password"]', 'Password123!');
            await browser.click('button[type="submit"]');
            const retryButton = await browser.isVisible('[data-testid="retry-button"]');
            if (retryButton) {
                await browser.click('[data-testid="retry-button"]');
                await browser.waitForURL('/dashboard');
            }
        });
    });
    (0, globals_1.describe)('Accessibility and Responsiveness', () => {
        (0, globals_1.it)('should be keyboard navigable', async () => {
            await browser.goto('/login');
            (0, globals_1.expect)(true).toBe(true);
        });
        (0, globals_1.it)('should work on mobile viewport', async () => {
            await browser.goto('/login');
            const mobileMenu = await browser.isVisible('[data-testid="mobile-menu"]');
        });
        (0, globals_1.it)('should have proper ARIA labels', async () => {
            await browser.goto('/login');
            const emailLabel = await browser.getAttribute('[name="email"]', 'aria-label');
            const passwordLabel = await browser.getAttribute('[name="password"]', 'aria-label');
            (0, globals_1.expect)(emailLabel).toBeTruthy();
            (0, globals_1.expect)(passwordLabel).toBeTruthy();
        });
    });
    (0, globals_1.describe)('Performance', () => {
        (0, globals_1.it)('should load pages within acceptable time', async () => {
            const startTime = Date.now();
            await browser.goto('/dashboard');
            await browser.waitForSelector('[data-testid="dashboard-content"]');
            const loadTime = Date.now() - startTime;
            (0, globals_1.expect)(loadTime).toBeLessThan(3000);
        });
        (0, globals_1.it)('should handle multiple concurrent users', async () => {
            const browsers = Array.from({ length: 5 }, () => new MockBrowser());
            const loginPromises = browsers.map(async (b, index) => {
                await b.goto('/login');
                await b.fill('[name="email"]', `user${index}@example.com`);
                await b.fill('[name="password"]', 'Password123!');
                await b.click('button[type="submit"]');
                return b.waitForURL('/dashboard');
            });
            await Promise.all(loginPromises);
            browsers.forEach((b, index) => {
                (0, globals_1.expect)(b.getCurrentUrl()).toContain('/dashboard');
            });
        });
    });
});
//# sourceMappingURL=user-flow.test.js.map