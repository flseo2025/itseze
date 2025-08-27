/**
 * Error Handling Utilities - SPARC Implementation
 * Centralized error management with context and severity
 */

import { Logger } from './Logger';

import type { ErrorSeverity, ErrorContext } from '../types';

/**
 * Custom application error class
 */
export class AppError extends Error {
  public readonly severity: ErrorSeverity;
  public readonly context?: ErrorContext | undefined;
  public readonly timestamp: Date;
  public override readonly cause?: unknown | undefined;

  constructor(
    message: string,
    severity: ErrorSeverity = 'MEDIUM',
    cause?: unknown,
    context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
    this.severity = severity;
    this.cause = cause;
    this.context = context || undefined;
    this.timestamp = new Date();

    // Maintains proper stack trace for V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  /**
   * Convert to JSON for logging/serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      severity: this.severity,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
      context: this.context,
      cause:
        this.cause instanceof Error
          ? {
              name: this.cause.name,
              message: this.cause.message,
              stack: this.cause.stack,
            }
          : this.cause,
    };
  }
}

/**
 * Validation error for input validation
 */
export class ValidationError extends AppError {
  public readonly field?: string | undefined;
  public readonly value?: unknown | undefined;

  constructor(message: string, field?: string, value?: unknown, context?: ErrorContext) {
    super(message, 'MEDIUM', undefined, context);
    this.name = 'ValidationError';
    this.field = field || undefined;
    this.value = value;
  }
}

/**
 * Network/HTTP error
 */
export class NetworkError extends AppError {
  public readonly statusCode?: number | undefined;
  public readonly url?: string | undefined;

  constructor(message: string, statusCode?: number, url?: string, context?: ErrorContext) {
    super(message, 'HIGH', undefined, context);
    this.name = 'NetworkError';
    this.statusCode = statusCode || undefined;
    this.url = url || undefined;
  }
}

/**
 * Centralized error handler
 */
export class ErrorHandler {
  private static logger = new Logger('ErrorHandler');

  /**
   * Handle any error with appropriate logging and response
   */
  static handle(error: unknown, context?: ErrorContext): void {
    const appError = this.normalizeError(error, context);

    // Log based on severity
    switch (appError.severity) {
      case 'LOW':
        this.logger.debug(appError.message, { error: appError.toJSON() });
        break;
      case 'MEDIUM':
        this.logger.warn(appError.message, { error: appError.toJSON() });
        break;
      case 'HIGH':
      case 'CRITICAL':
        this.logger.error(appError.message, appError.toJSON());
        break;
      case 'FATAL':
        this.logger.error(appError.message, appError.toJSON());
        // Could trigger additional alerting here
        break;
    }

    // Additional handling based on error type
    this.handleSpecificError(appError);
  }

  /**
   * Convert any error to AppError
   */
  static normalizeError(error: unknown, context?: ErrorContext): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError(error.message, 'MEDIUM', error, context);
    }

    // Handle string errors
    if (typeof error === 'string') {
      return new AppError(error, 'MEDIUM', undefined, context);
    }

    // Handle unknown error types
    return new AppError('An unknown error occurred', 'MEDIUM', error, context);
  }

  /**
   * Create a safe error for external APIs (no sensitive info)
   */
  static createSafeError(error: AppError): Record<string, unknown> {
    return {
      message: error.message,
      code: error.name,
      timestamp: error.timestamp.toISOString(),
      ...(error.context?.requestId && { requestId: error.context.requestId }),
    };
  }

  /**
   * Handle specific error types
   */
  private static handleSpecificError(error: AppError): void {
    switch (error.name) {
      case 'ValidationError':
        // Could trigger form validation UI updates
        break;
      case 'NetworkError':
        // Could trigger retry mechanisms
        break;
      default:
        // Default handling
        break;
    }
  }

  /**
   * Async error wrapper for promises
   */
  static async wrapAsync<T>(promise: Promise<T>, context?: ErrorContext): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      const appError = this.normalizeError(error, context);
      this.handle(appError);
      throw appError;
    }
  }

  /**
   * Error boundary for synchronous operations
   */
  static wrapSync<T>(operation: () => T, context?: ErrorContext): T {
    try {
      return operation();
    } catch (error) {
      const appError = this.normalizeError(error, context);
      this.handle(appError);
      throw appError;
    }
  }
}

/**
 * Decorator for automatic error handling
 */
export function HandleErrors(severity: ErrorSeverity = 'MEDIUM') {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } catch (error) {
        const appError = ErrorHandler.normalizeError(error, {
          operation: `${target?.constructor?.name}.${propertyKey}`,
        });
        (appError as any).severity = severity;
        ErrorHandler.handle(appError);
        throw appError;
      }
    };

    return descriptor;
  };
}
