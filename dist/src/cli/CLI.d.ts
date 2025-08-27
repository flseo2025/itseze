import type { ConfigService } from '../services/ConfigService';
import type { Logger } from '../utils/Logger';
export declare class CLI {
    private configService;
    private logger;
    private commands;
    constructor(configService: ConfigService, logger: Logger);
    run(args: string[]): Promise<void>;
    private setupCommands;
    private addCommand;
    private parseArgs;
    private parseValue;
    private validateArgs;
    private showHelp;
    private showCommandHelp;
    private handleConfigCommand;
    private handleHealthCommand;
    private handleVersionCommand;
    private handleStartCommand;
    private handleDevCommand;
}
//# sourceMappingURL=CLI.d.ts.map