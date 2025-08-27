"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.Logger = void 0;
class Logger {
    constructor(context = 'App', logLevel = 'info') {
        this.context = context;
        this.logLevel = this.parseLogLevel(process.env.LOG_LEVEL || logLevel);
    }
    debug(message, metadata) {
        this.log('debug', message, metadata);
    }
    info(message, metadata) {
        this.log('info', message, metadata);
    }
    warn(message, metadata) {
        this.log('warn', message, metadata);
    }
    error(message, error, metadata) {
        const errorMetadata = {
            ...metadata,
            ...(error && { error: this.serializeError(error) }),
        };
        this.log('error', message, errorMetadata);
    }
    child(childContext) {
        return new Logger(`${this.context}:${childContext}`, this.logLevel);
    }
    setLogLevel(level) {
        this.logLevel = level;
    }
    log(level, message, metadata) {
        if (!this.shouldLog(level)) {
            return;
        }
        const entry = {
            timestamp: new Date(),
            level,
            message,
            context: this.context,
            metadata,
        };
        this.output(entry);
    }
    shouldLog(level) {
        const levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
        };
        return levels[level] >= levels[this.logLevel];
    }
    output(entry) {
        const isProduction = process.env.NODE_ENV === 'production';
        if (isProduction) {
            console.log(JSON.stringify(entry));
        }
        else {
            const timestamp = entry.timestamp.toISOString();
            const level = entry.level.toUpperCase().padEnd(5);
            const context = entry.context ? `[${entry.context}]` : '';
            let output = `${timestamp} ${level} ${context} ${entry.message}`;
            if (entry.metadata && Object.keys(entry.metadata).length > 0) {
                output += `\n${JSON.stringify(entry.metadata, null, 2)}`;
            }
            switch (entry.level) {
                case 'debug':
                    console.log(`\x1b[36m${output}\x1b[0m`);
                    break;
                case 'info':
                    console.log(`\x1b[32m${output}\x1b[0m`);
                    break;
                case 'warn':
                    console.warn(`\x1b[33m${output}\x1b[0m`);
                    break;
                case 'error':
                    console.error(`\x1b[31m${output}\x1b[0m`);
                    break;
            }
        }
    }
    parseLogLevel(level) {
        const validLevels = ['debug', 'info', 'warn', 'error'];
        const normalizedLevel = level.toLowerCase();
        if (validLevels.includes(normalizedLevel)) {
            return normalizedLevel;
        }
        console.warn(`Invalid log level "${level}", defaulting to "info"`);
        return 'info';
    }
    serializeError(error) {
        if (error instanceof Error) {
            return {
                name: error.name,
                message: error.message,
                stack: error.stack,
                ...(error.cause && { cause: this.serializeError(error.cause) }),
            };
        }
        if (typeof error === 'object' && error !== null) {
            return { error: JSON.stringify(error) };
        }
        return { error: String(error) };
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
//# sourceMappingURL=Logger.js.map