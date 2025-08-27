"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUtils = exports.DateUtils = exports.ValidationUtils = exports.AsyncUtils = exports.isEqual = exports.isEmpty = exports.deepMerge = exports.deepClone = exports.formatDuration = exports.parseDate = exports.formatDate = exports.sanitizeString = exports.validateUrl = exports.validateEmail = exports.timeout = exports.retry = exports.sleep = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./Logger"), exports);
tslib_1.__exportStar(require("./ErrorHandler"), exports);
var AsyncUtils_1 = require("./AsyncUtils");
Object.defineProperty(exports, "sleep", { enumerable: true, get: function () { return AsyncUtils_1.sleep; } });
Object.defineProperty(exports, "retry", { enumerable: true, get: function () { return AsyncUtils_1.retry; } });
Object.defineProperty(exports, "timeout", { enumerable: true, get: function () { return AsyncUtils_1.timeout; } });
var Validation_1 = require("./Validation");
Object.defineProperty(exports, "validateEmail", { enumerable: true, get: function () { return Validation_1.validateEmail; } });
Object.defineProperty(exports, "validateUrl", { enumerable: true, get: function () { return Validation_1.validateUrl; } });
Object.defineProperty(exports, "sanitizeString", { enumerable: true, get: function () { return Validation_1.sanitizeString; } });
var DateUtils_1 = require("./DateUtils");
Object.defineProperty(exports, "formatDate", { enumerable: true, get: function () { return DateUtils_1.formatDate; } });
Object.defineProperty(exports, "parseDate", { enumerable: true, get: function () { return DateUtils_1.parseDate; } });
Object.defineProperty(exports, "formatDuration", { enumerable: true, get: function () { return DateUtils_1.formatDuration; } });
var ObjectUtils_1 = require("./ObjectUtils");
Object.defineProperty(exports, "deepClone", { enumerable: true, get: function () { return ObjectUtils_1.deepClone; } });
Object.defineProperty(exports, "deepMerge", { enumerable: true, get: function () { return ObjectUtils_1.deepMerge; } });
Object.defineProperty(exports, "isEmpty", { enumerable: true, get: function () { return ObjectUtils_1.isEmpty; } });
Object.defineProperty(exports, "isEqual", { enumerable: true, get: function () { return ObjectUtils_1.isEqual; } });
class AsyncUtils {
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    static async retry(fn, maxAttempts = 3, baseDelay = 1000) {
        let lastError;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await fn();
            }
            catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                if (attempt === maxAttempts) {
                    throw lastError;
                }
                const delay = baseDelay * Math.pow(2, attempt - 1);
                await this.sleep(delay);
            }
        }
        throw lastError;
    }
    static timeout(promise, ms) {
        return Promise.race([
            promise,
            new Promise((_, reject) => setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)),
        ]);
    }
}
exports.AsyncUtils = AsyncUtils;
class ValidationUtils {
    static validateEmail(email) {
        return this.emailRegex.test(email);
    }
    static validateUrl(url) {
        return this.urlRegex.test(url);
    }
    static sanitizeString(input) {
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
    static isValidUUID(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}
exports.ValidationUtils = ValidationUtils;
ValidationUtils.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
ValidationUtils.urlRegex = /^https?:\/\/.+/;
class DateUtils {
    static formatDate(date, format = 'iso') {
        switch (format) {
            case 'iso':
                return date.toISOString();
            case 'short':
                return date.toLocaleDateString();
            case 'long':
                return date.toLocaleString();
            default:
                return date.toISOString();
        }
    }
    static parseDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error(`Invalid date string: ${dateString}`);
        }
        return date;
    }
    static formatDuration(ms) {
        if (ms < 1000) {
            return `${ms}ms`;
        }
        if (ms < 60000) {
            return `${Math.round(ms / 1000 * 10) / 10}s`;
        }
        if (ms < 3600000) {
            return `${Math.round(ms / 60000 * 10) / 10}m`;
        }
        return `${Math.round(ms / 3600000 * 10) / 10}h`;
    }
    static isExpired(date) {
        return date.getTime() < Date.now();
    }
}
exports.DateUtils = DateUtils;
class ObjectUtils {
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item));
        }
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }
    static deepMerge(target, ...sources) {
        if (!sources.length)
            return target;
        const source = sources.shift();
        if (this.isObject(target) && this.isObject(source)) {
            for (const key in source) {
                if (this.isObject(source[key])) {
                    if (!target[key])
                        Object.assign(target, { [key]: {} });
                    this.deepMerge(target[key], source[key]);
                }
                else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return this.deepMerge(target, ...sources);
    }
    static isEmpty(obj) {
        if (obj === null || obj === undefined)
            return true;
        if (typeof obj === 'string' || Array.isArray(obj))
            return obj.length === 0;
        if (typeof obj === 'object')
            return Object.keys(obj).length === 0;
        return false;
    }
    static isEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    static isObject(item) {
        return item !== null && typeof item === 'object' && !Array.isArray(item);
    }
}
exports.ObjectUtils = ObjectUtils;
exports.sleep = exports.sleep = AsyncUtils.sleep, exports.retry = exports.retry = AsyncUtils.retry, exports.timeout = exports.timeout = AsyncUtils.timeout;
exports.validateEmail = exports.validateEmail = ValidationUtils.validateEmail, exports.validateUrl = exports.validateUrl = ValidationUtils.validateUrl, exports.sanitizeString = exports.sanitizeString = ValidationUtils.sanitizeString;
exports.formatDate = exports.formatDate = DateUtils.formatDate, exports.parseDate = exports.parseDate = DateUtils.parseDate, exports.formatDuration = exports.formatDuration = DateUtils.formatDuration;
exports.deepClone = exports.deepClone = ObjectUtils.deepClone, exports.deepMerge = exports.deepMerge = ObjectUtils.deepMerge, exports.isEmpty = exports.isEmpty = ObjectUtils.isEmpty, exports.isEqual = exports.isEqual = ObjectUtils.isEqual;
//# sourceMappingURL=index.js.map