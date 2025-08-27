/**
 * Utility Functions Index - SPARC Implementation
 * Centralized exports for all utility functions
 */

// Core utilities
export * from './Logger';
export * from './ErrorHandler';

/**
 * Async utility functions
 */
export class AsyncUtils {
  /**
   * Sleep for specified milliseconds
   */
  static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry function with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === maxAttempts) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Add timeout to promise
   */
  static timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
      ),
    ]);
  }
}

/**
 * Validation utilities
 */
export class ValidationUtils {
  private static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static urlRegex = /^https?:\/\/.+/;

  static validateEmail(email: string): boolean {
    return this.emailRegex.test(email);
  }

  static validateUrl(url: string): boolean {
    return this.urlRegex.test(url);
  }

  static sanitizeString(input: string): string {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

/**
 * Date utilities
 */
export class DateUtils {
  static formatDate(date: Date, format: 'iso' | 'short' | 'long' = 'iso'): string {
    switch (format) {
      case 'iso':
        return date.toISOString();
      case 'short':
        return date.toLocaleDateString();
      case 'long':
        return date.toLocaleString();
      default:
        return date.toISOString();
    }
  }

  static parseDate(dateString: string): Date {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: ${dateString}`);
    }
    return date;
  }

  static formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    if (ms < 60000) {
      return `${Math.round((ms / 1000) * 10) / 10}s`;
    }
    if (ms < 3600000) {
      return `${Math.round((ms / 60000) * 10) / 10}m`;
    }
    return `${Math.round((ms / 3600000) * 10) / 10}h`;
  }

  static isExpired(date: Date): boolean {
    return date.getTime() < Date.now();
  }
}

/**
 * Object utilities
 */
export class ObjectUtils {
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as unknown as T;
    }

    if (obj instanceof Array) {
      return obj.map(item => this.deepClone(item)) as unknown as T;
    }

    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }

    return cloned;
  }

  static deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.deepMerge(
            target[key] as Record<string, unknown>,
            source[key] as Record<string, unknown>
          );
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.deepMerge(target, ...sources);
  }

  static isEmpty(obj: unknown): boolean {
    if (obj === null || obj === undefined) return true;
    if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === 'object') return Object.keys(obj).length === 0;
    return false;
  }

  static isEqual<T>(a: T, b: T): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  private static isObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
  }
}

// Re-export specific functions for convenience
export const { sleep, retry, timeout } = AsyncUtils;
export const { validateEmail, validateUrl, sanitizeString } = ValidationUtils;
export const { formatDate, parseDate, formatDuration } = DateUtils;
export const { deepClone, deepMerge, isEmpty, isEqual } = ObjectUtils;
