/**
 * Application Configuration Management
 * SPARC Implementation: Centralized configuration with validation
 */

import { AppError } from '../utils/ErrorHandler';
import { Logger } from '../utils/Logger';

import type { AppConfig, DatabaseConfig, FeatureFlags } from '../types';

export class AppConfigManager {
  private logger: Logger;
  private config: AppConfig | null = null;

  constructor() {
    this.logger = new Logger('AppConfig');
  }

  /**
   * Load and validate configuration from environment variables
   */
  public async load(): Promise<AppConfig> {
    try {
      this.logger.info('Loading application configuration...');

      const config: AppConfig = {
        environment: this.getEnvironment(),
        logLevel: this.getLogLevel(),
        port: this.getPort(),
        database: this.getDatabaseConfig(),
        features: this.getFeatureFlags(),
      };

      this.validateConfig(config);
      this.config = config;

      this.logger.info('Configuration loaded successfully', {
        environment: config.environment,
        port: config.port,
        logLevel: config.logLevel,
      });

      return config;
    } catch (error) {
      throw new AppError('Failed to load configuration', 'CRITICAL', error);
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): AppConfig {
    if (!this.config) {
      throw new AppError('Configuration not loaded', 'HIGH');
    }
    return this.config;
  }

  /**
   * Check if configuration is loaded
   */
  public isLoaded(): boolean {
    return this.config !== null;
  }

  private getEnvironment(): 'development' | 'staging' | 'production' {
    const env = process.env.NODE_ENV || 'development';
    if (!['development', 'staging', 'production'].includes(env)) {
      throw new AppError(`Invalid environment: ${env}`, 'HIGH');
    }
    return env as 'development' | 'staging' | 'production';
  }

  private getLogLevel(): 'debug' | 'info' | 'warn' | 'error' {
    const level = process.env.LOG_LEVEL || 'info';
    if (!['debug', 'info', 'warn', 'error'].includes(level)) {
      throw new AppError(`Invalid log level: ${level}`, 'MEDIUM');
    }
    return level as 'debug' | 'info' | 'warn' | 'error';
  }

  private getPort(): number {
    const port = parseInt(process.env.PORT || '3000', 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new AppError(`Invalid port: ${process.env.PORT}`, 'HIGH');
    }
    return port;
  }

  private getDatabaseConfig(): DatabaseConfig | undefined {
    if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
      return undefined;
    }

    if (process.env.DATABASE_URL) {
      // Parse DATABASE_URL format: postgres://user:pass@host:port/db
      const url = new URL(process.env.DATABASE_URL);
      return {
        host: url.hostname,
        port: parseInt(url.port, 10) || 5432,
        database: url.pathname.slice(1),
        username: url.username,
        password: url.password,
        ssl: process.env.DB_SSL === 'true',
      };
    }

    return {
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      database: process.env.DB_NAME!,
      username: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
      ssl: process.env.DB_SSL === 'true',
    };
  }

  private getFeatureFlags(): FeatureFlags {
    return {
      enableMetrics: process.env.ENABLE_METRICS === 'true',
      enableCaching: process.env.ENABLE_CACHING !== 'false', // Default true
      enableDebugMode: process.env.DEBUG_MODE === 'true',
    };
  }

  private validateConfig(config: AppConfig): void {
    // Validate database config if present
    if (config.database) {
      const required = ['host', 'database', 'username', 'password'];
      for (const field of required) {
        if (!config.database[field as keyof DatabaseConfig]) {
          throw new AppError(`Missing required database field: ${field}`, 'HIGH');
        }
      }
    }

    // Validate port range
    if (config.port < 1024 && process.getuid && process.getuid() !== 0) {
      this.logger.warn(`Port ${config.port} requires root privileges`);
    }

    this.logger.debug('Configuration validation passed');
  }
}

// Singleton instance
export const appConfig = new AppConfigManager();
