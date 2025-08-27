export interface AppConfig {
    environment: 'development' | 'staging' | 'production';
    logLevel: 'debug' | 'info' | 'warn' | 'error';
    port: number;
    database?: DatabaseConfig | undefined;
    features: FeatureFlags;
}
export interface DatabaseConfig {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: boolean;
}
export interface FeatureFlags {
    enableMetrics: boolean;
    enableCaching: boolean;
    enableDebugMode: boolean;
}
export interface CLICommand {
    name: string;
    description: string;
    options: CLIOption[];
    handler: (args: CLIArgs) => Promise<void>;
}
export interface CLIOption {
    name: string;
    alias?: string;
    description: string;
    type: 'string' | 'number' | 'boolean';
    required?: boolean;
    default?: unknown;
}
export interface CLIArgs {
    [key: string]: unknown;
}
export interface ServiceInterface {
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
    isHealthy(): Promise<boolean>;
}
export interface ServiceConfig {
    name: string;
    version: string;
    dependencies: string[];
}
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    context?: string;
    metadata?: Record<string, unknown> | undefined;
}
export type ErrorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'FATAL';
export interface ErrorContext {
    operation?: string | undefined;
    userId?: string | undefined;
    requestId?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}
export interface Result<T, E = Error> {
    success: boolean;
    data?: T;
    error?: E;
}
export interface AsyncResult<T, E = Error> extends Promise<Result<T, E>> {
}
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export interface Event<T = unknown> {
    type: string;
    payload: T;
    timestamp: Date;
    source: string;
}
export interface EventHandler<T = unknown> {
    handle(event: Event<T>): Promise<void>;
}
export interface HTTPResponse<T = unknown> {
    status: number;
    message: string;
    data?: T;
    errors?: string[];
    timestamp: Date;
}
export interface PaginatedResponse<T> extends HTTPResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=index.d.ts.map