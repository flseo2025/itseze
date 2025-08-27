export * from './Logger';
export * from './ErrorHandler';
export { sleep, retry, timeout } from './AsyncUtils';
export { validateEmail, validateUrl, sanitizeString } from './Validation';
export { formatDate, parseDate, formatDuration } from './DateUtils';
export { deepClone, deepMerge, isEmpty, isEqual } from './ObjectUtils';
export declare class AsyncUtils {
    static sleep(ms: number): Promise<void>;
    static retry<T>(fn: () => Promise<T>, maxAttempts?: number, baseDelay?: number): Promise<T>;
    static timeout<T>(promise: Promise<T>, ms: number): Promise<T>;
}
export declare class ValidationUtils {
    private static emailRegex;
    private static urlRegex;
    static validateEmail(email: string): boolean;
    static validateUrl(url: string): boolean;
    static sanitizeString(input: string): string;
    static isValidUUID(uuid: string): boolean;
}
export declare class DateUtils {
    static formatDate(date: Date, format?: 'iso' | 'short' | 'long'): string;
    static parseDate(dateString: string): Date;
    static formatDuration(ms: number): string;
    static isExpired(date: Date): boolean;
}
export declare class ObjectUtils {
    static deepClone<T>(obj: T): T;
    static deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T;
    static isEmpty(obj: unknown): boolean;
    static isEqual<T>(a: T, b: T): boolean;
    private static isObject;
}
export declare const sleep: typeof AsyncUtils.sleep, retry: typeof AsyncUtils.retry, timeout: typeof AsyncUtils.timeout;
export declare const validateEmail: typeof ValidationUtils.validateEmail, validateUrl: typeof ValidationUtils.validateUrl, sanitizeString: typeof ValidationUtils.sanitizeString;
export declare const formatDate: typeof DateUtils.formatDate, parseDate: typeof DateUtils.parseDate, formatDuration: typeof DateUtils.formatDuration;
export declare const deepClone: typeof ObjectUtils.deepClone, deepMerge: typeof ObjectUtils.deepMerge, isEmpty: typeof ObjectUtils.isEmpty, isEqual: typeof ObjectUtils.isEqual;
//# sourceMappingURL=index.d.ts.map