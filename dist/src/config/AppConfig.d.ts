import type { AppConfig } from '../types';
export declare class AppConfigManager {
    private logger;
    private config;
    constructor();
    load(): Promise<AppConfig>;
    getConfig(): AppConfig;
    isLoaded(): boolean;
    private getEnvironment;
    private getLogLevel;
    private getPort;
    private getDatabaseConfig;
    private getFeatureFlags;
    private validateConfig;
}
export declare const appConfig: AppConfigManager;
//# sourceMappingURL=AppConfig.d.ts.map