/**
 * Logger Utility - SPARC Implementation
 * Structured logging with multiple output formats
 */

import type { LogLevel, LogEntry } from '../types';

export class Logger {
  private context: string;
  private logLevel: LogLevel;

  constructor(context: string = 'App', logLevel: LogLevel = 'info') {
    this.context = context;
    this.logLevel = this.parseLogLevel(process.env.LOG_LEVEL || logLevel);
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log('debug', message, metadata);
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: Record<string, unknown>): void {
    this.log('info', message, metadata);
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log('warn', message, metadata);
  }

  /**
   * Log error message
   */
  error(message: string, error?: unknown, metadata?: Record<string, unknown>): void {
    const errorMetadata: Record<string, unknown> = {
      ...(metadata || {}),
      ...(error ? { error: this.serializeError(error) } : {}),
    };
    this.log('error', message, errorMetadata);
  }

  /**
   * Create child logger with additional context
   */
  child(childContext: string): Logger {
    return new Logger(`${this.context}:${childContext}`, this.logLevel);
  }

  /**
   * Set log level dynamically
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context: this.context,
      metadata: metadata || undefined,
    };

    this.output(entry);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };

    return levels[level] >= levels[this.logLevel];
  }

  private output(entry: LogEntry): void {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      // JSON format for production (machine-readable)
      console.log(JSON.stringify(entry));
    } else {
      // Human-readable format for development
      const timestamp = entry.timestamp.toISOString();
      const level = entry.level.toUpperCase().padEnd(5);
      const context = entry.context ? `[${entry.context}]` : '';

      let output = `${timestamp} ${level} ${context} ${entry.message}`;

      if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        output += `\n${JSON.stringify(entry.metadata, null, 2)}`;
      }

      // Color coding for different log levels
      switch (entry.level) {
        case 'debug':
          console.log(`\x1b[36m${output}\x1b[0m`); // Cyan
          break;
        case 'info':
          console.log(`\x1b[32m${output}\x1b[0m`); // Green
          break;
        case 'warn':
          console.warn(`\x1b[33m${output}\x1b[0m`); // Yellow
          break;
        case 'error':
          console.error(`\x1b[31m${output}\x1b[0m`); // Red
          break;
      }
    }
  }

  private parseLogLevel(level: string): LogLevel {
    const validLevels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const normalizedLevel = level.toLowerCase() as LogLevel;

    if (validLevels.includes(normalizedLevel)) {
      return normalizedLevel;
    }

    console.warn(`Invalid log level "${level}", defaulting to "info"`);
    return 'info';
  }

  private serializeError(error: unknown): Record<string, unknown> {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...((error as any).cause && { cause: this.serializeError((error as any).cause) }),
      };
    }

    if (typeof error === 'object' && error !== null) {
      return { error: JSON.stringify(error) };
    }

    return { error: String(error) };
  }
}

// Default logger instance
export const logger = new Logger();
