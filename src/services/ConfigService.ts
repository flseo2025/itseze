/**
 * Configuration Service - SPARC Implementation
 * Centralized configuration management with hot-reload support
 */

import { AppConfigManager } from '../config/AppConfig';
import { AppError, HandleErrors } from '../utils/ErrorHandler';
import { Logger } from '../utils/Logger';

import type { ServiceInterface, AppConfig } from '../types';

export class ConfigService implements ServiceInterface {
  private logger: Logger;
  private configManager: AppConfigManager;
  private config: AppConfig | null = null;
  private watchers: (() => void)[] = [];

  constructor() {
    this.logger = new Logger('ConfigService');
    this.configManager = new AppConfigManager();
  }

  /**
   * Initialize configuration service
   */
  @HandleErrors('CRITICAL')
  async initialize(): Promise<void> {
    this.logger.info('Initializing configuration service...');

    try {
      this.config = await this.configManager.load();
      this.setupEnvironmentWatcher();

      this.logger.info('Configuration service initialized successfully');
    } catch (error) {
      throw new AppError('Failed to initialize configuration service', 'CRITICAL', error);
    }
  }

  /**
   * Cleanup configuration service
   */
  async cleanup(): Promise<void> {
    this.logger.info('Cleaning up configuration service...');
    this.watchers.forEach(cleanup => cleanup());
    this.watchers = [];
    this.logger.info('Configuration service cleanup complete');
  }

  /**
   * Health check for configuration service
   */
  async isHealthy(): Promise<boolean> {
    return this.config !== null && this.configManager.isLoaded();
  }

  /**
   * Get current configuration
   */
  getConfig(): AppConfig {
    if (!this.config) {
      throw new AppError('Configuration not initialized', 'HIGH');
    }
    return this.config;
  }

  /**
   * Get specific configuration value
   */
  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.getConfig()[key];
  }

  /**
   * Check if feature is enabled
   */
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.getConfig().features[feature];
  }

  /**
   * Get environment-specific value
   */
  getEnvironmentValue<T>(development: T, staging: T, production: T): T {
    const env = this.get('environment');
    switch (env) {
      case 'development':
        return development;
      case 'staging':
        return staging;
      case 'production':
        return production;
    }
  }

  /**
   * Validate configuration against schema
   */
  async validateConfig(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const config = this.getConfig();

    try {
      // Environment validation
      if (!['development', 'staging', 'production'].includes(config.environment)) {
        errors.push(`Invalid environment: ${config.environment}`);
      }

      // Port validation
      if (config.port < 1 || config.port > 65535) {
        errors.push(`Invalid port: ${config.port}`);
      }

      // Database validation (if configured)
      if (config.database) {
        if (!config.database.host) {
          errors.push('Database host is required');
        }
        if (!config.database.database) {
          errors.push('Database name is required');
        }
        if (!config.database.username) {
          errors.push('Database username is required');
        }
      }

      // Log level validation
      if (!['debug', 'info', 'warn', 'error'].includes(config.logLevel)) {
        errors.push(`Invalid log level: ${config.logLevel}`);
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Configuration validation error: ${error}`],
      };
    }
  }

  /**
   * Reload configuration from environment
   */
  @HandleErrors('HIGH')
  async reload(): Promise<void> {
    this.logger.info('Reloading configuration...');

    try {
      const newConfig = await this.configManager.load();
      const oldConfig = this.config;

      this.config = newConfig;

      this.logger.info('Configuration reloaded successfully', {
        changes: this.getConfigChanges(oldConfig, newConfig),
      });

      this.notifyWatchers();
    } catch (error) {
      throw new AppError('Failed to reload configuration', 'HIGH', error);
    }
  }

  /**
   * Add configuration change watcher
   */
  onConfigChange(callback: (config: AppConfig) => void): () => void {
    const watcher = () => callback(this.getConfig());
    this.watchers.push(watcher);

    // Return cleanup function
    return () => {
      const index = this.watchers.indexOf(watcher);
      if (index > -1) {
        this.watchers.splice(index, 1);
      }
    };
  }

  /**
   * Get configuration as JSON (safe for logging)
   */
  toJSON(): Record<string, unknown> {
    const config = this.getConfig();

    // Remove sensitive information
    const safeConfig = { ...config };
    if (safeConfig.database) {
      safeConfig.database = {
        ...safeConfig.database,
        password: '[REDACTED]',
      };
    }

    return safeConfig;
  }

  private setupEnvironmentWatcher(): void {
    // Watch for environment variable changes
    // This is a simple implementation - in production, you might want
    // to use file system watching or external configuration sources

    const checkInterval = this.getEnvironmentValue(
      5000, // development: 5 seconds
      30000, // staging: 30 seconds
      60000 // production: 60 seconds
    );

    const intervalId = setInterval(async () => {
      try {
        // Check if critical environment variables have changed
        const currentEnv = process.env.NODE_ENV;
        const currentPort = process.env.PORT;
        const currentLogLevel = process.env.LOG_LEVEL;

        if (
          currentEnv !== this.config?.environment ||
          currentPort !== String(this.config?.port) ||
          currentLogLevel !== this.config?.logLevel
        ) {
          this.logger.info('Environment variables changed, reloading configuration');
          await this.reload();
        }
      } catch (error) {
        this.logger.warn(
          'Error checking for configuration changes',
          error as Record<string, unknown>
        );
      }
    }, checkInterval);

    // Add cleanup function
    this.watchers.push(() => clearInterval(intervalId));
  }

  private getConfigChanges(
    oldConfig: AppConfig | null,
    newConfig: AppConfig
  ): Record<string, { old: unknown; new: unknown }> {
    const changes: Record<string, { old: unknown; new: unknown }> = {};

    if (!oldConfig) {
      return { initial: { old: null, new: 'loaded' } };
    }

    // Compare top-level properties
    for (const key in newConfig) {
      const typedKey = key as keyof AppConfig;
      if (JSON.stringify(oldConfig[typedKey]) !== JSON.stringify(newConfig[typedKey])) {
        changes[key] = {
          old: oldConfig[typedKey],
          new: newConfig[typedKey],
        };
      }
    }

    return changes;
  }

  private notifyWatchers(): void {
    this.watchers.forEach(watcher => {
      try {
        watcher();
      } catch (error) {
        this.logger.warn('Error in configuration watcher', error as Record<string, unknown>);
      }
    });
  }
}
