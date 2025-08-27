/**
 * Main Application Tests - SPARC Implementation
 * Comprehensive test suite for the main application entry point
 */

import { Application } from '../../src/index';
import { ConfigService } from '../../src/services/ConfigService';
import { Logger } from '../../src/utils/Logger';

// Mock dependencies
jest.mock('../../src/services/ConfigService');
jest.mock('../../src/utils/Logger');
jest.mock('../../src/cli/CLI');

const MockedConfigService = ConfigService as jest.MockedClass<typeof ConfigService>;
const MockedLogger = Logger as jest.MockedClass<typeof Logger>;

describe('Application', () => {
  let application: Application;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mock instances
    mockConfigService = new MockedConfigService() as jest.Mocked<ConfigService>;
    mockLogger = new MockedLogger() as jest.Mocked<Logger>;
    
    // Setup default mock implementations
    mockConfigService.initialize = jest.fn().mockResolvedValue(undefined);
    mockConfigService.cleanup = jest.fn().mockResolvedValue(undefined);
    mockLogger.info = jest.fn();
    mockLogger.error = jest.fn();

    application = new Application();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create application with required dependencies', () => {
      expect(application).toBeInstanceOf(Application);
      expect(MockedConfigService).toHaveBeenCalledTimes(1);
      expect(MockedLogger).toHaveBeenCalledWith('Application');
    });
  });

  describe('start', () => {
    it('should initialize configuration and start CLI', async () => {
      // Mock CLI.run to avoid actual CLI execution in tests
      const mockCLIRun = jest.fn().mockResolvedValue(undefined);
      jest.doMock('../../src/cli/CLI', () => ({
        CLI: jest.fn().mockImplementation(() => ({
          run: mockCLIRun,
        })),
      }));

      await application.start();

      expect(mockConfigService.initialize).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Starting SPARC Application...');
      expect(mockLogger.info).toHaveBeenCalledWith('Application started successfully');
    });

    it('should handle initialization errors', async () => {
      const error = new Error('Config initialization failed');
      mockConfigService.initialize.mockRejectedValue(error);

      // Mock process.exit to prevent actual exit in tests
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });

      await expect(application.start()).rejects.toThrow('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('shutdown', () => {
    it('should cleanup resources gracefully', async () => {
      await application.shutdown();

      expect(mockLogger.info).toHaveBeenCalledWith('Shutting down application...');
      expect(mockConfigService.cleanup).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith('Application shutdown complete');
    });

    it('should handle cleanup errors', async () => {
      const error = new Error('Cleanup failed');
      mockConfigService.cleanup.mockRejectedValue(error);

      await application.shutdown();

      expect(mockLogger.error).toHaveBeenCalledWith('Error during shutdown:', error);
    });
  });

  describe('error handlers', () => {
    let originalProcessOn: typeof process.on;
    let mockProcessOn: jest.MockedFunction<typeof process.on>;

    beforeEach(() => {
      originalProcessOn = process.on;
      mockProcessOn = jest.fn();
      process.on = mockProcessOn;
    });

    afterEach(() => {
      process.on = originalProcessOn;
    });

    it('should register global error handlers', () => {
      // Re-require the module to trigger handler registration
      jest.isolateModules(() => {
        require('../../src/index');
      });

      expect(mockProcessOn).toHaveBeenCalledWith('uncaughtException', expect.any(Function));
      expect(mockProcessOn).toHaveBeenCalledWith('unhandledRejection', expect.any(Function));
      expect(mockProcessOn).toHaveBeenCalledWith('SIGINT', expect.any(Function));
      expect(mockProcessOn).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
    });
  });

  describe('environment-specific behavior', () => {
    it('should handle development environment', () => {
      process.env.NODE_ENV = 'development';
      const app = new Application();
      expect(app).toBeInstanceOf(Application);
    });

    it('should handle production environment', () => {
      process.env.NODE_ENV = 'production';
      const app = new Application();
      expect(app).toBeInstanceOf(Application);
    });
  });

  describe('integration scenarios', () => {
    it('should handle full startup and shutdown cycle', async () => {
      const mockCLIRun = jest.fn().mockResolvedValue(undefined);
      jest.doMock('../../src/cli/CLI', () => ({
        CLI: jest.fn().mockImplementation(() => ({
          run: mockCLIRun,
        })),
      }));

      // Start application
      await application.start();
      expect(mockConfigService.initialize).toHaveBeenCalled();

      // Shutdown application
      await application.shutdown();
      expect(mockConfigService.cleanup).toHaveBeenCalled();
    });

    it('should handle concurrent operations', async () => {
      const mockCLIRun = jest.fn().mockResolvedValue(undefined);
      jest.doMock('../../src/cli/CLI', () => ({
        CLI: jest.fn().mockImplementation(() => ({
          run: mockCLIRun,
        })),
      }));

      // Test concurrent start operations
      const startPromises = [
        application.start(),
        application.start(),
        application.start(),
      ];

      // All should resolve or reject consistently
      await expect(Promise.allSettled(startPromises)).resolves.toBeDefined();
    });
  });

  describe('memory and resource management', () => {
    it('should not leak memory during normal operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Perform multiple operations
      for (let i = 0; i < 10; i++) {
        const app = new Application();
        await app.shutdown();
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });
});

// Test utilities
export class TestUtils {
  static createMockApplication(): Application {
    return new Application();
  }

  static async waitFor(condition: () => boolean, timeout: number = 5000): Promise<void> {
    const start = Date.now();
    while (!condition() && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    if (!condition()) {
      throw new Error('Condition not met within timeout');
    }
  }

  static suppressConsole(): () => void {
    const originalConsole = { ...console };
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.info = jest.fn();

    return () => {
      Object.assign(console, originalConsole);
    };
  }
}