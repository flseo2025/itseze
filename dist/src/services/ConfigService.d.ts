import type { ServiceInterface, AppConfig } from '../types';
export declare class ConfigService implements ServiceInterface {
    private logger;
    private configManager;
    private config;
    private watchers;
    constructor();
    initialize(): Promise<void>;
    cleanup(): Promise<void>;
    isHealthy(): Promise<boolean>;
    getConfig(): AppConfig;
    get<K extends keyof AppConfig>(key: K): AppConfig[K];
    isFeatureEnabled(feature: keyof AppConfig['features']): boolean;
    getEnvironmentValue<T>(development: T, staging: T, production: T): T;
    validateConfig(): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    reload(): Promise<void>;
    onConfigChange(callback: (config: AppConfig) => void): () => void;
    toJSON(): Record<string, unknown>;
    private setupEnvironmentWatcher;
    private getConfigChanges;
    private notifyWatchers;
}
//# sourceMappingURL=ConfigService.d.ts.map