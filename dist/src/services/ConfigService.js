"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = void 0;
const tslib_1 = require("tslib");
const AppConfig_1 = require("../config/AppConfig");
const ErrorHandler_1 = require("../utils/ErrorHandler");
const Logger_1 = require("../utils/Logger");
class ConfigService {
    logger;
    configManager;
    config = null;
    watchers = [];
    constructor() {
        this.logger = new Logger_1.Logger('ConfigService');
        this.configManager = new AppConfig_1.AppConfigManager();
    }
    async initialize() {
        this.logger.info('Initializing configuration service...');
        try {
            this.config = await this.configManager.load();
            this.setupEnvironmentWatcher();
            this.logger.info('Configuration service initialized successfully');
        }
        catch (error) {
            throw new ErrorHandler_1.AppError('Failed to initialize configuration service', 'CRITICAL', error);
        }
    }
    async cleanup() {
        this.logger.info('Cleaning up configuration service...');
        this.watchers.forEach(cleanup => cleanup());
        this.watchers = [];
        this.logger.info('Configuration service cleanup complete');
    }
    async isHealthy() {
        return this.config !== null && this.configManager.isLoaded();
    }
    getConfig() {
        if (!this.config) {
            throw new ErrorHandler_1.AppError('Configuration not initialized', 'HIGH');
        }
        return this.config;
    }
    get(key) {
        return this.getConfig()[key];
    }
    isFeatureEnabled(feature) {
        return this.getConfig().features[feature];
    }
    getEnvironmentValue(development, staging, production) {
        const env = this.get('environment');
        switch (env) {
            case 'development':
                return development;
            case 'staging':
                return staging;
            case 'production':
                return production;
        }
    }
    async validateConfig() {
        const errors = [];
        const config = this.getConfig();
        try {
            if (!['development', 'staging', 'production'].includes(config.environment)) {
                errors.push(`Invalid environment: ${config.environment}`);
            }
            if (config.port < 1 || config.port > 65535) {
                errors.push(`Invalid port: ${config.port}`);
            }
            if (config.database) {
                if (!config.database.host) {
                    errors.push('Database host is required');
                }
                if (!config.database.database) {
                    errors.push('Database name is required');
                }
                if (!config.database.username) {
                    errors.push('Database username is required');
                }
            }
            if (!['debug', 'info', 'warn', 'error'].includes(config.logLevel)) {
                errors.push(`Invalid log level: ${config.logLevel}`);
            }
            return {
                valid: errors.length === 0,
                errors,
            };
        }
        catch (error) {
            return {
                valid: false,
                errors: [`Configuration validation error: ${error}`],
            };
        }
    }
    async reload() {
        this.logger.info('Reloading configuration...');
        try {
            const newConfig = await this.configManager.load();
            const oldConfig = this.config;
            this.config = newConfig;
            this.logger.info('Configuration reloaded successfully', {
                changes: this.getConfigChanges(oldConfig, newConfig),
            });
            this.notifyWatchers();
        }
        catch (error) {
            throw new ErrorHandler_1.AppError('Failed to reload configuration', 'HIGH', error);
        }
    }
    onConfigChange(callback) {
        const watcher = () => callback(this.getConfig());
        this.watchers.push(watcher);
        return () => {
            const index = this.watchers.indexOf(watcher);
            if (index > -1) {
                this.watchers.splice(index, 1);
            }
        };
    }
    toJSON() {
        const config = this.getConfig();
        const safeConfig = { ...config };
        if (safeConfig.database) {
            safeConfig.database = {
                ...safeConfig.database,
                password: '[REDACTED]',
            };
        }
        return safeConfig;
    }
    setupEnvironmentWatcher() {
        const checkInterval = this.getEnvironmentValue(5000, 30000, 60000);
        const intervalId = setInterval(async () => {
            try {
                const currentEnv = process.env.NODE_ENV;
                const currentPort = process.env.PORT;
                const currentLogLevel = process.env.LOG_LEVEL;
                if (currentEnv !== this.config?.environment ||
                    currentPort !== String(this.config?.port) ||
                    currentLogLevel !== this.config?.logLevel) {
                    this.logger.info('Environment variables changed, reloading configuration');
                    await this.reload();
                }
            }
            catch (error) {
                this.logger.warn('Error checking for configuration changes', error);
            }
        }, checkInterval);
        this.watchers.push(() => clearInterval(intervalId));
    }
    getConfigChanges(oldConfig, newConfig) {
        const changes = {};
        if (!oldConfig) {
            return { initial: { old: null, new: 'loaded' } };
        }
        for (const key in newConfig) {
            const typedKey = key;
            if (JSON.stringify(oldConfig[typedKey]) !== JSON.stringify(newConfig[typedKey])) {
                changes[key] = {
                    old: oldConfig[typedKey],
                    new: newConfig[typedKey],
                };
            }
        }
        return changes;
    }
    notifyWatchers() {
        this.watchers.forEach(watcher => {
            try {
                watcher();
            }
            catch (error) {
                this.logger.warn('Error in configuration watcher', error);
            }
        });
    }
}
exports.ConfigService = ConfigService;
tslib_1.__decorate([
    (0, ErrorHandler_1.HandleErrors)('CRITICAL'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigService.prototype, "initialize", null);
tslib_1.__decorate([
    (0, ErrorHandler_1.HandleErrors)('HIGH'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ConfigService.prototype, "reload", null);
//# sourceMappingURL=ConfigService.js.map