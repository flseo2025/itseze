/**
 * Global Types for Test Environment
 * Extends global scope with test utilities and database mocks
 */

declare global {
  /**
   * Global test utilities available in all test files
   */
  var testUtils: {
    /**
     * Creates a mock function with consistent naming
     */
    createMock: (name: string, methods?: Record<string, any>) => jest.MockedFunction<any>;
    
    /**
     * Waits for a condition to be true with timeout
     */
    waitFor: (condition: () => boolean | Promise<boolean>, timeout?: number) => Promise<boolean>;
    
    /**
     * Generates test user data
     */
    generateUser: (overrides?: Partial<TestUser>) => TestUser;
    
    /**
     * Cleans up test data
     */
    cleanup: () => void;
  };

  /**
   * Integration test utilities
   */
  var integrationUtils: {
    /**
     * Creates a test user in the mock database
     */
    createTestUser: (userData?: Partial<TestUser>) => Promise<TestUser>;
    
    /**
     * Makes a mock HTTP request
     */
    makeRequest: (method: string, path: string, data?: any) => Promise<{
      status: number;
      data: any;
      headers: Record<string, string>;
      ok: boolean;
      json: () => Promise<any>;
      text: () => Promise<string>;
    }>;
    
    /**
     * Creates a test service with dependencies
     */
    createTestService: (dependencies?: Record<string, any>) => any;
  };

  /**
   * Mock test database
   */
  var testDb: {
    users: {
      create: jest.MockedFunction<(userData: Partial<TestUser>) => Promise<TestUser>>;
      findById: jest.MockedFunction<(id: string) => Promise<TestUser | null>>;
      findByEmail: jest.MockedFunction<(email: string) => Promise<TestUser | null>>;
      update: jest.MockedFunction<(id: string, updates: Partial<TestUser>) => Promise<TestUser>>;
      delete: jest.MockedFunction<(id: string) => Promise<boolean>>;
    };
    posts: {
      create: jest.MockedFunction<(postData: Partial<TestPost>) => Promise<TestPost>>;
      findById: jest.MockedFunction<(id: string) => Promise<TestPost | null>>;
      delete: jest.MockedFunction<(id: string) => Promise<boolean>>;
    };
    clearData: jest.MockedFunction<() => Promise<boolean>>;
    transaction: jest.MockedFunction<(callback: (db: any) => Promise<any>) => Promise<any>>;
  } | null;

  interface TestUser {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: 'user' | 'admin';
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface TestPost {
    id: string;
    title: string;
    content: string;
    authorId: string;
    published: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }
}

export {};