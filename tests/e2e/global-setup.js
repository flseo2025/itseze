// Global E2E Test Setup
import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config) {
  console.log('🚀 Setting up E2E test environment...');
  
  // Setup test database
  await setupTestDatabase();
  
  // Setup test server
  await setupTestServer();
  
  // Create shared browser context for authentication
  await setupAuthContext(config);
  
  console.log('✅ E2E test environment ready');
}

async function setupTestDatabase() {
  // Initialize test database
  console.log('📊 Setting up test database...');
  
  // Mock database setup - replace with actual implementation
  global.testDb = {
    isE2EMode: true,
    reset: async () => {
      console.log('🔄 Resetting test database...');
    },
    seed: async () => {
      console.log('🌱 Seeding test database...');
    }
  };
  
  await global.testDb.reset();
  await global.testDb.seed();
}

async function setupTestServer() {
  // Setup test server configuration
  console.log('🌐 Configuring test server...');
  
  process.env.NODE_ENV = 'test';
  process.env.PORT = '3000';
  process.env.DB_URL = 'test-database-url';
}

async function setupAuthContext(config) {
  // Create authenticated browser context
  console.log('🔐 Setting up authentication context...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Perform authentication
  await page.goto('http://localhost:3000/login');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'testpassword');
  await page.click('[data-testid="login-button"]');
  
  // Wait for authentication to complete
  await page.waitForURL('**/dashboard');
  
  // Save authentication state
  await context.storageState({ path: 'tests/e2e/.auth/user.json' });
  
  await browser.close();
}

export default globalSetup;