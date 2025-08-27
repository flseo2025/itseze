/**
 * Global Test Setup
 * Runs before each test file
 */

import { jest } from '@jest/globals';

// Extend Jest matchers
import 'jest-extended';

// Mock console methods in tests to reduce noise
const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset modules to ensure clean state
  jest.resetModules();
  
  // Mock console methods to track calls
  console.error = jest.fn();
  console.warn = jest.fn();
  console.log = jest.fn();
});

afterEach(() => {
  // Restore console methods
  console.error = originalError;
  console.warn = originalWarn;
  console.log = originalLog;
  
  // Clear timers
  jest.clearAllTimers();
  jest.useRealTimers();
});

// Global test timeout
jest.setTimeout(10000);

// Suppress React warnings in tests
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};

// Global error handler for unhandled promises
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

// Environment setup
process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC';

// Mock fetch if not available
if (!global.fetch) {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => '',
    headers: new Headers(),
    redirected: false,
    statusText: 'OK',
    type: 'basic',
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData()
  });
}

// Mock localStorage and sessionStorage only if window exists (browser environment)
if (typeof window !== 'undefined') {
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn()
  };
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock
  });
}

// Global test data cleanup
afterAll(() => {
  // Clean up any test data (only if in browser environment)
  if (typeof window !== 'undefined') {
    localStorage.clear();
    sessionStorage.clear();
  }
});