"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const config_1 = require("@/config");
const Logger_1 = require("./utils/Logger");
function createApp() {
    let isRunning = false;
    return {
        async start() {
            if (isRunning) {
                throw new Error('Application is already running');
            }
            Logger_1.logger.info('Initializing application...');
            isRunning = true;
            Logger_1.logger.info(`Application started on port ${config_1.config.port || 'N/A'}`);
        },
        async stop() {
            if (!isRunning) {
                return;
            }
            Logger_1.logger.info('Stopping application...');
            isRunning = false;
            Logger_1.logger.info('Application stopped');
        },
    };
}
//# sourceMappingURL=app.js.map