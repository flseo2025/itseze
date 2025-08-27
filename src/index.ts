#!/usr/bin/env node

/**
 * SPARC Application Entry Point
 * 
 * This is the main entry point following SPARC methodology:
 * - Specification: CLI interface with clear commands
 * - Pseudocode: Structured command routing
 * - Architecture: Modular service-based design
 * - Refinement: Type-safe implementation
 * - Completion: Production-ready with error handling
 */

import { CLI } from './cli/CLI';
import { ConfigService } from './services/ConfigService';
import { AppError, ErrorHandler } from './utils/ErrorHandler';
import { Logger } from './utils/Logger';

/**
 * Application bootstrap and initialization
 */
class Application {
  private cli: CLI;
  private configService: ConfigService;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('Application');
    this.configService = new ConfigService();
    this.cli = new CLI(this.configService, this.logger);
  }

  /**
   * Initialize and start the application
   */
  async start(): Promise<void> {
    try {
      this.logger.info('Starting SPARC Application...');
      
      // Initialize configuration
      await this.configService.initialize();
      
      // Start CLI interface
      await this.cli.run(process.argv.slice(2));
      
      this.logger.info('Application started successfully');
    } catch (error) {
      ErrorHandler.handle(error);
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    try {
      this.logger.info('Shutting down application...');
      await this.configService.cleanup();
      this.logger.info('Application shutdown complete');
    } catch (error) {
      this.logger.error('Error during shutdown:', error);
    }
  }
}

// Global error handlers
process.on('uncaughtException', (error: Error) => {
  ErrorHandler.handle(new AppError('Uncaught Exception', 'FATAL', error));
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  ErrorHandler.handle(new AppError('Unhandled Rejection', 'FATAL', reason));
  process.exit(1);
});

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  const app = new Application();
  await app.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  const app = new Application();
  await app.shutdown();
  process.exit(0);
});

// Start application if this file is run directly
if (require.main === module) {
  const app = new Application();
  app.start();
}

export { Application };