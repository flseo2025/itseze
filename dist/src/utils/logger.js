"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const config_1 = require("@/config");
class ConsoleLogger {
    shouldLog(level) {
        const levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
        };
        const currentLevel = levels[config_1.config.logLevel] ?? levels.info;
        const messageLevel = levels[level];
        return messageLevel >= currentLevel;
    }
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        const levelTag = level.toUpperCase().padStart(5);
        return `[${timestamp}] ${levelTag}: ${message}`;
    }
    debug(message, ...args) {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', message), ...args);
        }
    }
    info(message, ...args) {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message), ...args);
        }
    }
    warn(message, ...args) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message), ...args);
        }
    }
    error(message, ...args) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message), ...args);
        }
    }
}
exports.logger = new ConsoleLogger();
//# sourceMappingURL=logger.js.map