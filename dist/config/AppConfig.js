"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.AppConfigManager = void 0;
const Logger_1 = require("../utils/Logger");
const ErrorHandler_1 = require("../utils/ErrorHandler");
class AppConfigManager {
    constructor() {
        this.config = null;
        this.logger = new Logger_1.Logger('AppConfig');
    }
    async load() {
        try {
            this.logger.info('Loading application configuration...');
            const config = {
                environment: this.getEnvironment(),
                logLevel: this.getLogLevel(),
                port: this.getPort(),
                database: this.getDatabaseConfig(),
                features: this.getFeatureFlags(),
            };
            this.validateConfig(config);
            this.config = config;
            this.logger.info('Configuration loaded successfully', {
                environment: config.environment,
                port: config.port,
                logLevel: config.logLevel,
            });
            return config;
        }
        catch (error) {
            throw new ErrorHandler_1.AppError('Failed to load configuration', 'CRITICAL', error);
        }
    }
    getConfig() {
        if (!this.config) {
            throw new ErrorHandler_1.AppError('Configuration not loaded', 'HIGH');
        }
        return this.config;
    }
    isLoaded() {
        return this.config !== null;
    }
    getEnvironment() {
        const env = process.env.NODE_ENV || 'development';
        if (!['development', 'staging', 'production'].includes(env)) {
            throw new ErrorHandler_1.AppError(`Invalid environment: ${env}`, 'HIGH');
        }
        return env;
    }
    getLogLevel() {
        const level = process.env.LOG_LEVEL || 'info';
        if (!['debug', 'info', 'warn', 'error'].includes(level)) {
            throw new ErrorHandler_1.AppError(`Invalid log level: ${level}`, 'MEDIUM');
        }
        return level;
    }
    getPort() {
        const port = parseInt(process.env.PORT || '3000', 10);
        if (isNaN(port) || port < 1 || port > 65535) {
            throw new ErrorHandler_1.AppError(`Invalid port: ${process.env.PORT}`, 'HIGH');
        }
        return port;
    }
    getDatabaseConfig() {
        if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
            return undefined;
        }
        if (process.env.DATABASE_URL) {
            const url = new URL(process.env.DATABASE_URL);
            return {
                host: url.hostname,
                port: parseInt(url.port, 10) || 5432,
                database: url.pathname.slice(1),
                username: url.username,
                password: url.password,
                ssl: process.env.DB_SSL === 'true',
            };
        }
        return {
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            ssl: process.env.DB_SSL === 'true',
        };
    }
    getFeatureFlags() {
        return {
            enableMetrics: process.env.ENABLE_METRICS === 'true',
            enableCaching: process.env.ENABLE_CACHING !== 'false',
            enableDebugMode: process.env.DEBUG_MODE === 'true',
        };
    }
    validateConfig(config) {
        if (config.database) {
            const required = ['host', 'database', 'username', 'password'];
            for (const field of required) {
                if (!config.database[field]) {
                    throw new ErrorHandler_1.AppError(`Missing required database field: ${field}`, 'HIGH');
                }
            }
        }
        if (config.port < 1024 && process.getuid && process.getuid() !== 0) {
            this.logger.warn(`Port ${config.port} requires root privileges`);
        }
        this.logger.debug('Configuration validation passed');
    }
}
exports.AppConfigManager = AppConfigManager;
exports.appConfig = new AppConfigManager();
//# sourceMappingURL=AppConfig.js.map