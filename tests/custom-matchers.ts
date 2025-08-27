/**
 * Custom Jest Matchers
 * Extends Jest with domain-specific matchers
 */

import { expect } from '@jest/globals';

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
}

// Email validation matcher
expect.extend({
  toBeValidEmail(received: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },
});

// URL validation matcher
expect.extend({
  toBeValidUrl(received: string) {
    try {
      new URL(received);
      return {
        message: () => `expected ${received} not to be a valid URL`,
        pass: true,
      };
    } catch {
      return {
        message: () => `expected ${received} to be a valid URL`,
        pass: false,
      };
    }
  },
});

// UUID validation matcher
expect.extend({
  toBeValidUuid(received: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },
});

// ISO date validation matcher
expect.extend({
  toBeValidISODate(received: string) {
    const date = new Date(received);
    const isValidDate = !isNaN(date.getTime());
    const isISOFormat = received === date.toISOString();
    const pass = isValidDate && isISOFormat;

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid ISO date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid ISO date`,
        pass: false,
      };
    }
  },
});

// Range validation matcher
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;

    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Object containing matcher for mock calls
expect.extend({
  toHaveBeenCalledWithObjectContaining(received: any, expected: Record<string, any>) {
    const mockCalls = received.mock?.calls || [];
    const pass = mockCalls.some((call: any[]) =>
      call.some((arg: any) =>
        typeof arg === 'object' &&
        arg !== null &&
        Object.keys(expected).every(key => arg[key] === expected[key])
      )
    );

    if (pass) {
      return {
        message: () => `expected mock not to be called with object containing ${JSON.stringify(expected)}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected mock to be called with object containing ${JSON.stringify(expected)}`,
        pass: false,
      };
    }
  },
});

// Async function matcher
expect.extend({
  toBeAsyncFunction(received: any) {
    const pass = typeof received === 'function' && 
                 received.constructor.name === 'AsyncFunction';

    if (pass) {
      return {
        message: () => `expected function not to be async`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected function to be async`,
        pass: false,
      };
    }
  },
});

// Password validation matcher
expect.extend({
  toBeValidPassword(received: string) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const pass = passwordRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid password`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid password (8+ chars, 1 upper, 1 lower, 1 number, 1 special)`,
        pass: false,
      };
    }
  },
});

export {};