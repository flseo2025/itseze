/**
 * Global Type Declarations
 * Extends global namespace with custom types and declarations
 */

// Extend Jest matchers globally
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidEmail(): R;
      toBeValidUrl(): R;
      toBeValidUuid(): R;
      toBeValidISODate(): R;
      toBeWithinRange(floor: number, ceiling: number): R;
      toHaveBeenCalledWithObjectContaining(expected: Record<string, any>): R;
      toBeAsyncFunction(): R;
      toBeValidPassword(): R;
    }
  }

  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      BCRYPT_ROUNDS: string;
      API_BASE_URL: string;
      REDIS_URL?: string;
      LOG_LEVEL?: 'error' | 'warn' | 'info' | 'debug';
    }
  }

  // Window object extensions (for browser tests)
  interface Window {
    __TEST_ENV__?: boolean;
    __MOCK_API__?: boolean;
  }

  // Console extensions for testing
  interface Console {
    _log: typeof console.log;
    _error: typeof console.error;
    _warn: typeof console.warn;
  }
}

// Module declarations for packages without types
declare module 'jest-extended' {
  // This module extends Jest with additional matchers
  // Types are handled by @types/jest-extended if available
}

declare module 'supertest' {
  import { Application } from 'express';
  import { Server } from 'http';
  
  interface Response {
    status: number;
    body: any;
    headers: Record<string, string>;
    text: string;
  }

  interface Test {
    get(url: string): Test;
    post(url: string): Test;
    put(url: string): Test;
    delete(url: string): Test;
    patch(url: string): Test;
    send(data: any): Test;
    expect(status: number): Promise<Response>;
    expect(body: any): Promise<Response>;
    set(header: string, value: string): Test;
    query(params: Record<string, any>): Test;
    attach(field: string, file: string): Test;
    field(name: string, value: string): Test;
  }

  function request(app: Application | Server): Test;
  export = request;
}

// Custom utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer U)[]
    ? readonly DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export type MockFunction<T extends (...args: any[]) => any> = jest.MockedFunction<T>;

export type TestFixture<T> = {
  [K in keyof T]: T[K];
} & {
  __type: 'fixture';
};

// Database types for tests
export interface TestUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TestComment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details: string[];
  };
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Test utilities types
export interface TestHelpers {
  createMockFn: <T extends (...args: any[]) => any>() => jest.MockedFunction<T>;
  createPartialMock: <T extends Record<string, any>>(partial: Partial<T>) => T;
  waitFor: (condition: () => boolean | Promise<boolean>, timeout?: number) => Promise<void>;
  sleep: (ms: number) => Promise<void>;
}

// Configuration types
export interface TestConfig {
  database: {
    url: string;
    reset: boolean;
    seed: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  browser: {
    headless: boolean;
    viewport: {
      width: number;
      height: number;
    };
  };
}

// Error types
export interface TestError extends Error {
  code?: string;
  statusCode?: number;
  details?: string[];
}

export {};