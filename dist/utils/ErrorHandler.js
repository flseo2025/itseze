"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = exports.NetworkError = exports.ValidationError = exports.AppError = void 0;
exports.HandleErrors = HandleErrors;
const Logger_1 = require("./Logger");
class AppError extends Error {
    constructor(message, severity = 'MEDIUM', cause, context) {
        super(message);
        this.name = 'AppError';
        this.severity = severity;
        this.cause = cause;
        this.context = context;
        this.timestamp = new Date();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            severity: this.severity,
            timestamp: this.timestamp.toISOString(),
            stack: this.stack,
            context: this.context,
            cause: this.cause instanceof Error ? {
                name: this.cause.name,
                message: this.cause.message,
                stack: this.cause.stack,
            } : this.cause,
        };
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message, field, value, context) {
        super(message, 'MEDIUM', undefined, context);
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
    }
}
exports.ValidationError = ValidationError;
class NetworkError extends AppError {
    constructor(message, statusCode, url, context) {
        super(message, 'HIGH', undefined, context);
        this.name = 'NetworkError';
        this.statusCode = statusCode;
        this.url = url;
    }
}
exports.NetworkError = NetworkError;
class ErrorHandler {
    static handle(error, context) {
        const appError = this.normalizeError(error, context);
        switch (appError.severity) {
            case 'LOW':
                this.logger.debug(appError.message, { error: appError.toJSON() });
                break;
            case 'MEDIUM':
                this.logger.warn(appError.message, { error: appError.toJSON() });
                break;
            case 'HIGH':
            case 'CRITICAL':
                this.logger.error(appError.message, appError.toJSON());
                break;
            case 'FATAL':
                this.logger.error(appError.message, appError.toJSON());
                break;
        }
        this.handleSpecificError(appError);
    }
    static normalizeError(error, context) {
        if (error instanceof AppError) {
            return error;
        }
        if (error instanceof Error) {
            return new AppError(error.message, 'MEDIUM', error, context);
        }
        if (typeof error === 'string') {
            return new AppError(error, 'MEDIUM', undefined, context);
        }
        return new AppError('An unknown error occurred', 'MEDIUM', error, context);
    }
    static createSafeError(error) {
        return {
            message: error.message,
            code: error.name,
            timestamp: error.timestamp.toISOString(),
            ...(error.context?.requestId && { requestId: error.context.requestId }),
        };
    }
    static handleSpecificError(error) {
        switch (error.name) {
            case 'ValidationError':
                break;
            case 'NetworkError':
                break;
            default:
                break;
        }
    }
    static async wrapAsync(promise, context) {
        try {
            return await promise;
        }
        catch (error) {
            const appError = this.normalizeError(error, context);
            this.handle(appError);
            throw appError;
        }
    }
    static wrapSync(operation, context) {
        try {
            return operation();
        }
        catch (error) {
            const appError = this.normalizeError(error, context);
            this.handle(appError);
            throw appError;
        }
    }
}
exports.ErrorHandler = ErrorHandler;
ErrorHandler.logger = new Logger_1.Logger('ErrorHandler');
function HandleErrors(severity = 'MEDIUM') {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            try {
                const result = await originalMethod.apply(this, args);
                return result;
            }
            catch (error) {
                const appError = ErrorHandler.normalizeError(error, {
                    operation: `${target?.constructor?.name}.${propertyKey}`,
                });
                appError.severity = severity;
                ErrorHandler.handle(appError);
                throw appError;
            }
        };
        return descriptor;
    };
}
//# sourceMappingURL=ErrorHandler.js.map