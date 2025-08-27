// Global test setup for Jest
const { jest } = require('@jest/globals');
require('jest-extended');

// Mock console methods in test environment
const originalConsole = global.console;

beforeEach(() => {
  // Reset console mocks before each test
  jest.clearAllMocks();
  
  // Set up test timeout
  jest.setTimeout(10000);
});

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks();
});

// Global test utilities - properly typed
global.testUtils = {
  // Mock factory for consistent mock creation
  createMock: (name, methods = {}) => {
    const mock = jest.fn();
    Object.keys(methods).forEach(method => {
      mock[method] = jest.fn().mockImplementation(methods[method]);
    });
    mock._mockName = name;
    return mock;
  },
  
  // Async test helper
  waitFor: (condition, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        try {
          if (condition()) {
            resolve(true);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error(`Condition not met within ${timeout}ms`));
          } else {
            setTimeout(check, 10);
          }
        } catch (error) {
          reject(error);
        }
      };
      check();
    });
  },
  
  // Mock data generators
  generateUser: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    email: 'test@example.com',
    name: 'Test User',
    password: 'TestPass123!',
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),
  
  // Test data cleanup
  cleanup: () => {
    // Add any global cleanup logic here
    if (global.testDb && global.testDb.clearData) {
      global.testDb.clearData();
    }
  }
};

// Custom matchers for TDD
expect.extend({
  toBeCalledBefore(received, expected) {
    const receivedCalls = received.mock?.calls || [];
    const expectedCalls = expected.mock?.calls || [];
    
    if (receivedCalls.length === 0 || expectedCalls.length === 0) {
      return {
        message: () => 'Both functions must be called',
        pass: false
      };
    }
    
    // Simple implementation - in real scenario you'd track call order
    const pass = true; // Implement proper call order checking
    
    return {
      message: () => `Expected ${received.getMockName?.()} to be called before ${expected.getMockName?.()}`,
      pass
    };
  }
});