import type { LogLevel } from '../types';
export declare class Logger {
    private context;
    private logLevel;
    constructor(context?: string, logLevel?: LogLevel);
    debug(message: string, metadata?: Record<string, unknown>): void;
    info(message: string, metadata?: Record<string, unknown>): void;
    warn(message: string, metadata?: Record<string, unknown>): void;
    error(message: string, error?: unknown, metadata?: Record<string, unknown>): void;
    child(childContext: string): Logger;
    setLogLevel(level: LogLevel): void;
    private log;
    private shouldLog;
    private output;
    private parseLogLevel;
    private serializeError;
}
export declare const logger: Logger;
//# sourceMappingURL=Logger.d.ts.map