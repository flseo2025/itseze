import type { ErrorSeverity, ErrorContext } from '../types';
export declare class AppError extends Error {
    readonly severity: ErrorSeverity;
    readonly context?: ErrorContext | undefined;
    readonly timestamp: Date;
    readonly cause?: unknown | undefined;
    constructor(message: string, severity?: ErrorSeverity, cause?: unknown, context?: ErrorContext);
    toJSON(): Record<string, unknown>;
}
export declare class ValidationError extends AppError {
    readonly field?: string | undefined;
    readonly value?: unknown | undefined;
    constructor(message: string, field?: string, value?: unknown, context?: ErrorContext);
}
export declare class NetworkError extends AppError {
    readonly statusCode?: number | undefined;
    readonly url?: string | undefined;
    constructor(message: string, statusCode?: number, url?: string, context?: ErrorContext);
}
export declare class ErrorHandler {
    private static logger;
    static handle(error: unknown, context?: ErrorContext): void;
    static normalizeError(error: unknown, context?: ErrorContext): AppError;
    static createSafeError(error: AppError): Record<string, unknown>;
    private static handleSpecificError;
    static wrapAsync<T>(promise: Promise<T>, context?: ErrorContext): Promise<T>;
    static wrapSync<T>(operation: () => T, context?: ErrorContext): T;
}
export declare function HandleErrors(severity?: ErrorSeverity): (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
//# sourceMappingURL=ErrorHandler.d.ts.map