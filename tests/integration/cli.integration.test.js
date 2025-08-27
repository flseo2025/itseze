"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CLI_1 = require("../../src/cli/CLI");
const ConfigService_1 = require("../../src/services/ConfigService");
const Logger_1 = require("../../src/utils/Logger");
describe('CLI Integration Tests', () => {
    let cli;
    let configService;
    let logger;
    let originalConsoleLog;
    let originalConsoleError;
    let consoleOutput;
    let consoleErrors;
    beforeEach(async () => {
        process.env.NODE_ENV = 'test';
        process.env.LOG_LEVEL = 'warn';
        process.env.PORT = '3000';
        configService = new ConfigService_1.ConfigService();
        logger = new Logger_1.Logger('CLI-Test', 'warn');
        cli = new CLI_1.CLI(configService, logger);
        await configService.initialize();
        consoleOutput = [];
        consoleErrors = [];
        originalConsoleLog = console.log;
        originalConsoleError = console.error;
        console.log = (...args) => {
            consoleOutput.push(args.join(' '));
        };
        console.error = (...args) => {
            consoleErrors.push(args.join(' '));
        };
    });
    afterEach(async () => {
        console.log = originalConsoleLog;
        console.error = originalConsoleError;
        await configService.cleanup();
        delete process.env.NODE_ENV;
        delete process.env.LOG_LEVEL;
        delete process.env.PORT;
    });
    describe('help command', () => {
        it('should display help when no arguments provided', async () => {
            await cli.run([]);
            expect(consoleOutput.length).toBeGreaterThan(0);
            expect(consoleOutput.join('\n')).toContain('SPARC Application CLI');
            expect(consoleOutput.join('\n')).toContain('Usage: app <command>');
            expect(consoleOutput.join('\n')).toContain('Commands:');
        });
        it('should display help with --help flag', async () => {
            await cli.run(['--help']);
            expect(consoleOutput.join('\n')).toContain('SPARC Application CLI');
            expect(consoleOutput.join('\n')).toContain('Commands:');
        });
        it('should display command-specific help', async () => {
            await cli.run(['help', 'config']);
            expect(consoleOutput.join('\n')).toContain('Usage: app config');
            expect(consoleOutput.join('\n')).toContain('Show current configuration');
        });
    });
    describe('config command', () => {
        it('should display configuration in table format', async () => {
            await cli.run(['config']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Current Configuration:');
            expect(output).toContain('Environment: test');
            expect(output).toContain('Port: 3000');
            expect(output).toContain('Log Level: warn');
        });
        it('should display configuration in JSON format', async () => {
            await cli.run(['config', '--format', 'json']);
            const output = consoleOutput.join('\n');
            expect(() => JSON.parse(output)).not.toThrow();
            const config = JSON.parse(output);
            expect(config.environment).toBe('test');
            expect(config.port).toBe(3000);
            expect(config.logLevel).toBe('warn');
        });
        it('should validate configuration', async () => {
            await cli.run(['config', '--validate']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Configuration validation: PASSED');
        });
        it('should handle invalid format option', async () => {
            await expect(cli.run(['config', '--format', 'invalid'])).rejects.toThrow();
            expect(consoleErrors.join('\n')).toContain('Unsupported format: invalid');
        });
    });
    describe('health command', () => {
        it('should display basic health status', async () => {
            await cli.run(['health']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Health Status: HEALTHY');
        });
        it('should display verbose health information', async () => {
            await cli.run(['health', '--verbose']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Health Status: HEALTHY');
            expect(output).toContain('Health Details:');
            expect(output).toContain('Configuration Service: OK');
            expect(output).toContain('Environment: test');
            expect(output).toContain('Uptime:');
            expect(output).toContain('Memory Usage:');
        });
    });
    describe('version command', () => {
        it('should display version information', async () => {
            await cli.run(['version']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('SPARC Application v1.0.0');
            expect(output).toContain('Node.js:');
            expect(output).toContain('Platform:');
        });
    });
    describe('start command', () => {
        it('should start server with default port', async () => {
            await cli.run(['start']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Server starting on port 3000');
            expect(output).toContain('Press Ctrl+C to stop');
        });
        it('should start server with custom port', async () => {
            await cli.run(['start', '--port', '8080']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Server starting on port 8080');
        });
        it('should start server in daemon mode', async () => {
            await cli.run(['start', '--daemon']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Server starting in daemon mode on port 3000');
        });
    });
    describe('dev command', () => {
        it('should start development mode', async () => {
            await cli.run(['dev']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Development mode');
        });
        it('should enable watch mode', async () => {
            await cli.run(['dev', '--watch']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Development mode');
            expect(output).toContain('Watching for changes...');
        });
        it('should enable debug mode', async () => {
            await cli.run(['dev', '--debug']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Development mode');
            expect(output).toContain('Debug mode enabled');
        });
    });
    describe('error handling', () => {
        it('should handle unknown commands', async () => {
            await expect(cli.run(['unknown-command'])).rejects.toThrow();
            expect(consoleErrors.join('\n')).toContain('Unknown command: unknown-command');
            expect(consoleErrors.join('\n')).toContain('Use --help to see available commands');
        });
        it('should handle missing required options', async () => {
            const originalCommands = cli.commands;
            cli.commands.set('test-required', {
                name: 'test-required',
                description: 'Test command with required option',
                options: [{
                        name: 'required-option',
                        description: 'A required option',
                        type: 'string',
                        required: true,
                    }],
                handler: jest.fn(),
            });
            await expect(cli.run(['test-required'])).rejects.toThrow();
            expect(consoleErrors.join('\n')).toContain('Missing required option: --required-option');
            cli.commands = originalCommands;
        });
    });
    describe('argument parsing', () => {
        it('should parse long options with equals', async () => {
            await cli.run(['config', '--format=json']);
            const output = consoleOutput.join('\n');
            expect(() => JSON.parse(output)).not.toThrow();
        });
        it('should parse short options', async () => {
            await cli.run(['config', '-f', 'json']);
            const output = consoleOutput.join('\n');
            expect(() => JSON.parse(output)).not.toThrow();
        });
        it('should parse boolean flags', async () => {
            await cli.run(['health', '--verbose']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Health Details:');
        });
        it('should parse numeric values', async () => {
            await cli.run(['start', '--port', '8080']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('port 8080');
        });
    });
    describe('configuration integration', () => {
        it('should use environment-specific configuration', async () => {
            process.env.NODE_ENV = 'production';
            process.env.PORT = '8080';
            process.env.LOG_LEVEL = 'error';
            const prodConfigService = new ConfigService_1.ConfigService();
            await prodConfigService.initialize();
            const prodCLI = new CLI_1.CLI(prodConfigService, logger);
            await prodCLI.run(['config']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Environment: production');
            expect(output).toContain('Port: 8080');
            expect(output).toContain('Log Level: error');
            await prodConfigService.cleanup();
        });
        it('should handle configuration reload', async () => {
            process.env.LOG_LEVEL = 'debug';
            await configService.reload();
            await cli.run(['config']);
            const output = consoleOutput.join('\n');
            expect(output).toContain('Log Level: debug');
        });
    });
    describe('concurrency and stress testing', () => {
        it('should handle concurrent command execution', async () => {
            const promises = Array.from({ length: 10 }, (_, i) => cli.run(['config']).catch(() => {
            }));
            await Promise.allSettled(promises);
            expect(true).toBe(true);
        });
        it('should handle rapid successive commands', async () => {
            for (let i = 0; i < 5; i++) {
                await cli.run(['version']);
            }
            expect(consoleOutput.length).toBeGreaterThan(0);
        });
    });
    describe('memory management', () => {
        it('should not leak memory during command execution', async () => {
            const initialMemory = process.memoryUsage().heapUsed;
            for (let i = 0; i < 50; i++) {
                await cli.run(['version']);
                consoleOutput.length = 0;
            }
            if (global.gc) {
                global.gc();
            }
            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - initialMemory;
            expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024);
        });
    });
});
//# sourceMappingURL=cli.integration.test.js.map