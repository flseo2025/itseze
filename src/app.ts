/**
 * Application factory and lifecycle management
 */

import { config } from '@/config';

import { logger } from './utils/Logger';

export interface App {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export function createApp(): App {
  let isRunning = false;

  return {
    async start(): Promise<void> {
      if (isRunning) {
        throw new Error('Application is already running');
      }

      logger.info('Initializing application...');

      // Initialize services, database connections, etc.
      // This is where you would set up your application components
      
      isRunning = true;
      logger.info(`Application started on port ${config.port || 'N/A'}`);
    },

    async stop(): Promise<void> {
      if (!isRunning) {
        return;
      }

      logger.info('Stopping application...');

      // Cleanup resources, close connections, etc.
      // This is where you would gracefully shut down your application

      isRunning = false;
      logger.info('Application stopped');
    },
  };
}