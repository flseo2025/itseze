"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const logger_1 = require("@/utils/logger");
const config_1 = require("@/config");
function createApp() {
    let isRunning = false;
    return {
        async start() {
            if (isRunning) {
                throw new Error('Application is already running');
            }
            logger_1.logger.info('Initializing application...');
            isRunning = true;
            logger_1.logger.info(`Application started on port ${config_1.config.port || 'N/A'}`);
        },
        async stop() {
            if (!isRunning) {
                return;
            }
            logger_1.logger.info('Stopping application...');
            isRunning = false;
            logger_1.logger.info('Application stopped');
        },
    };
}
//# sourceMappingURL=app.js.map