#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const CLI_1 = require("./cli/CLI");
const ConfigService_1 = require("./services/ConfigService");
const ErrorHandler_1 = require("./utils/ErrorHandler");
const Logger_1 = require("./utils/Logger");
class Application {
    cli;
    configService;
    logger;
    constructor() {
        this.logger = new Logger_1.Logger('Application');
        this.configService = new ConfigService_1.ConfigService();
        this.cli = new CLI_1.CLI(this.configService, this.logger);
    }
    async start() {
        try {
            this.logger.info('Starting SPARC Application...');
            await this.configService.initialize();
            await this.cli.run(process.argv.slice(2));
            this.logger.info('Application started successfully');
        }
        catch (error) {
            ErrorHandler_1.ErrorHandler.handle(error);
            process.exit(1);
        }
    }
    async shutdown() {
        try {
            this.logger.info('Shutting down application...');
            await this.configService.cleanup();
            this.logger.info('Application shutdown complete');
        }
        catch (error) {
            this.logger.error('Error during shutdown:', error);
        }
    }
}
exports.Application = Application;
process.on('uncaughtException', (error) => {
    ErrorHandler_1.ErrorHandler.handle(new ErrorHandler_1.AppError('Uncaught Exception', 'FATAL', error));
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    ErrorHandler_1.ErrorHandler.handle(new ErrorHandler_1.AppError('Unhandled Rejection', 'FATAL', reason));
    process.exit(1);
});
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
if (require.main === module) {
    const app = new Application();
    app.start();
}
//# sourceMappingURL=index.js.map