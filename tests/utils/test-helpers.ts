/**
 * Test Utilities and Helpers
 * Common utilities for writing tests
 */

import { jest } from '@jest/globals';

/**
 * Create a mock function with TypeScript support
 */
export const createMockFn = <T extends (...args: any[]) => any>(): jest.MockedFunction<T> => {
  return jest.fn() as jest.MockedFunction<T>;
};

/**
 * Create a partial mock of an object
 */
export const createPartialMock = <T extends Record<string, any>>(
  partial: Partial<T>
): T => {
  return partial as T;
};

/**
 * Wait for a specific condition to be true
 */
export const waitFor = async (
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  interval = 100
): Promise<void> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const result = await condition();
    if (result) {
      return;
    }
    await sleep(interval);
  }
  
  throw new Error(`Condition not met within ${timeout}ms`);
};

/**
 * Sleep for a specific duration
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate test data
 */
export const generateTestData = {
  user: (overrides: Partial<any> = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date().toISOString(),
    ...overrides
  }),
  
  post: (overrides: Partial<any> = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    title: 'Test Post',
    content: 'This is a test post content',
    authorId: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    ...overrides
  }),
  
  randomString: (length = 10) => {
    return Math.random().toString(36).substr(2, length);
  },
  
  randomNumber: (min = 1, max = 100) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  randomEmail: () => {
    const username = Math.random().toString(36).substr(2, 8);
    const domain = Math.random().toString(36).substr(2, 6);
    return `${username}@${domain}.com`;
  }
};

/**
 * Mock HTTP responses
 */
export const mockHttpResponse = {
  success: <T>(data: T, status = 200) => ({
    ok: true,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data)
  }),
  
  error: (message = 'Error', status = 400) => ({
    ok: false,
    status,
    json: async () => ({ error: message }),
    text: async () => JSON.stringify({ error: message })
  })
};

/**
 * Database test helpers
 */
export const dbHelpers = {
  clearTables: async (...tableNames: string[]) => {
    // Implementation would depend on your database setup
    console.log(`Clearing tables: ${tableNames.join(', ')}`);
  },
  
  seedData: async (tableName: string, data: any[]) => {
    // Implementation would depend on your database setup
    console.log(`Seeding ${tableName} with ${data.length} records`);
  }
};

/**
 * Test environment setup
 */
export const testSetup = {
  mockConsole: () => {
    const originalConsole = { ...console };
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
    
    return {
      restore: () => {
        Object.assign(console, originalConsole);
      }
    };
  },
  
  mockDate: (date: string | Date) => {
    const mockDate = new Date(date);
    const originalDate = Date;
    
    global.Date = jest.fn(() => mockDate) as any;
    global.Date.now = jest.fn(() => mockDate.getTime());
    
    return {
      restore: () => {
        global.Date = originalDate;
      }
    };
  },
  
  mockTimers: () => {
    jest.useFakeTimers();
    
    return {
      advanceBy: (ms: number) => jest.advanceTimersByTime(ms),
      runAll: () => jest.runAllTimers(),
      restore: () => jest.useRealTimers()
    };
  }
};

/**
 * Assertion helpers
 */
export const assertions = {
  expectToThrowAsync: async (
    fn: () => Promise<any>,
    expectedError?: string | RegExp
  ) => {
    let error: Error | undefined;
    
    try {
      await fn();
    } catch (e) {
      error = e as Error;
    }
    
    expect(error).toBeDefined();
    if (expectedError) {
      if (typeof expectedError === 'string') {
        expect(error?.message).toContain(expectedError);
      } else {
        expect(error?.message).toMatch(expectedError);
      }
    }
  },
  
  expectArrayToContainObject: (array: any[], object: Record<string, any>) => {
    expect(array).toContainEqual(expect.objectContaining(object));
  }
};

/**
 * Performance testing helpers
 */
export const performance = {
  measureTime: async <T>(fn: () => Promise<T> | T): Promise<{ result: T; duration: number }> => {
    const start = process.hrtime.bigint();
    const result = await fn();
    const end = process.hrtime.bigint();
    
    return {
      result,
      duration: Number(end - start) / 1000000 // Convert to milliseconds
    };
  },
  
  expectToBeFasterThan: async (
    fn: () => Promise<any> | any,
    maxDuration: number
  ) => {
    const { duration } = await performance.measureTime(fn);
    expect(duration).toBeLessThan(maxDuration);
  }
};