// Integration test setup
const { setupTestDatabase, teardownTestDatabase } = require('../helpers/database');
const { jest } = require('@jest/globals');

// Global setup for integration tests
beforeAll(async () => {
  // Setup test database
  await setupTestDatabase();
  
  // Set longer timeout for integration tests
  jest.setTimeout(30000);
});

afterAll(async () => {
  // Cleanup test database
  await teardownTestDatabase();
});

// Per-test cleanup
afterEach(async () => {
  // Clear test data between tests
  if (global.testDb && global.testDb.clearData) {
    await global.testDb.clearData();
  }
});

// Integration test utilities
global.integrationUtils = {
  // Database helpers
  createTestUser: async (userData = {}) => {
    if (!global.testUtils) {
      throw new Error('testUtils not available - ensure jest.setup.js is loaded');
    }
    const user = global.testUtils.generateUser(userData);
    if (global.testDb && global.testDb.users) {
      return await global.testDb.users.create(user);
    }
    return user;
  },
  
  // API helpers
  makeRequest: async (method, path, data = {}) => {
    // Mock HTTP request for testing
    return {
      status: 200,
      data: data,
      headers: {},
      ok: true,
      json: async () => data,
      text: async () => JSON.stringify(data)
    };
  },
  
  // Service helpers
  createTestService: (dependencies = {}) => {
    return {
      ...dependencies,
      _isTestService: true,
      _dependencies: dependencies
    };
  }
};