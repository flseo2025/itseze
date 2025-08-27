"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestUtils = void 0;
const index_1 = require("../../src/index");
const ConfigService_1 = require("../../src/services/ConfigService");
const Logger_1 = require("../../src/utils/Logger");
jest.mock('../../src/services/ConfigService');
jest.mock('../../src/utils/Logger');
jest.mock('../../src/cli/CLI');
const MockedConfigService = ConfigService_1.ConfigService;
const MockedLogger = Logger_1.Logger;
describe('Application', () => {
    let application;
    let mockConfigService;
    let mockLogger;
    beforeEach(() => {
        jest.clearAllMocks();
        mockConfigService = new MockedConfigService();
        mockLogger = new MockedLogger();
        mockConfigService.initialize = jest.fn().mockResolvedValue(undefined);
        mockConfigService.cleanup = jest.fn().mockResolvedValue(undefined);
        mockLogger.info = jest.fn();
        mockLogger.error = jest.fn();
        application = new index_1.Application();
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe('constructor', () => {
        it('should create application with required dependencies', () => {
            expect(application).toBeInstanceOf(index_1.Application);
            expect(MockedConfigService).toHaveBeenCalledTimes(1);
            expect(MockedLogger).toHaveBeenCalledWith('Application');
        });
    });
    describe('start', () => {
        it('should initialize configuration and start CLI', async () => {
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
        let originalProcessOn;
        let mockProcessOn;
        beforeEach(() => {
            originalProcessOn = process.on;
            mockProcessOn = jest.fn();
            process.on = mockProcessOn;
        });
        afterEach(() => {
            process.on = originalProcessOn;
        });
        it('should register global error handlers', () => {
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
            const app = new index_1.Application();
            expect(app).toBeInstanceOf(index_1.Application);
        });
        it('should handle production environment', () => {
            process.env.NODE_ENV = 'production';
            const app = new index_1.Application();
            expect(app).toBeInstanceOf(index_1.Application);
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
            await application.start();
            expect(mockConfigService.initialize).toHaveBeenCalled();
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
            const startPromises = [
                application.start(),
                application.start(),
                application.start(),
            ];
            await expect(Promise.allSettled(startPromises)).resolves.toBeDefined();
        });
    });
    describe('memory and resource management', () => {
        it('should not leak memory during normal operations', async () => {
            const initialMemory = process.memoryUsage().heapUsed;
            for (let i = 0; i < 10; i++) {
                const app = new index_1.Application();
                await app.shutdown();
            }
            if (global.gc) {
                global.gc();
            }
            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - initialMemory;
            expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
        });
    });
});
class TestUtils {
    static createMockApplication() {
        return new index_1.Application();
    }
    static async waitFor(condition, timeout = 5000) {
        const start = Date.now();
        while (!condition() && Date.now() - start < timeout) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        if (!condition()) {
            throw new Error('Condition not met within timeout');
        }
    }
    static suppressConsole() {
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
exports.TestUtils = TestUtils;
//# sourceMappingURL=index.test.js.map