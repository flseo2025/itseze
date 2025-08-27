"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const tslib_1 = require("tslib");
const ErrorHandler_1 = require("../utils/ErrorHandler");
class CLI {
    constructor(configService, logger) {
        this.commands = new Map();
        this.configService = configService;
        this.logger = logger.child('CLI');
        this.setupCommands();
    }
    async run(args) {
        try {
            if (args.length === 0) {
                this.showHelp();
                return;
            }
            const commandName = args[0];
            const commandArgs = this.parseArgs(args.slice(1));
            if (commandName === 'help' || commandName === '-h' || commandName === '--help') {
                if (commandArgs.command) {
                    this.showCommandHelp(commandArgs.command);
                }
                else {
                    this.showHelp();
                }
                return;
            }
            const command = this.commands.get(commandName);
            if (!command) {
                throw new ErrorHandler_1.AppError(`Unknown command: ${commandName}`, 'MEDIUM');
            }
            this.logger.debug(`Executing command: ${commandName}`, { args: commandArgs });
            this.validateArgs(command, commandArgs);
            await command.handler(commandArgs);
            this.logger.debug(`Command completed: ${commandName}`);
        }
        catch (error) {
            if (error instanceof ErrorHandler_1.AppError) {
                console.error(`Error: ${error.message}`);
                if (error.severity === 'MEDIUM') {
                    console.log('\nUse --help to see available commands');
                }
            }
            else {
                console.error('An unexpected error occurred:', error);
            }
            throw error;
        }
    }
    setupCommands() {
        this.addCommand({
            name: 'config',
            description: 'Show current configuration',
            options: [
                {
                    name: 'format',
                    alias: 'f',
                    description: 'Output format (json|yaml|table)',
                    type: 'string',
                    default: 'table',
                },
                {
                    name: 'validate',
                    alias: 'v',
                    description: 'Validate configuration',
                    type: 'boolean',
                },
            ],
            handler: this.handleConfigCommand.bind(this),
        });
        this.addCommand({
            name: 'health',
            description: 'Check application health',
            options: [
                {
                    name: 'verbose',
                    alias: 'v',
                    description: 'Show detailed health information',
                    type: 'boolean',
                },
            ],
            handler: this.handleHealthCommand.bind(this),
        });
        this.addCommand({
            name: 'version',
            description: 'Show application version',
            options: [],
            handler: this.handleVersionCommand.bind(this),
        });
        this.addCommand({
            name: 'start',
            description: 'Start the application server',
            options: [
                {
                    name: 'port',
                    alias: 'p',
                    description: 'Port to listen on',
                    type: 'number',
                },
                {
                    name: 'daemon',
                    alias: 'd',
                    description: 'Run as daemon',
                    type: 'boolean',
                },
            ],
            handler: this.handleStartCommand.bind(this),
        });
        this.addCommand({
            name: 'dev',
            description: 'Development utilities',
            options: [
                {
                    name: 'watch',
                    alias: 'w',
                    description: 'Watch for changes',
                    type: 'boolean',
                },
                {
                    name: 'debug',
                    description: 'Enable debug mode',
                    type: 'boolean',
                },
            ],
            handler: this.handleDevCommand.bind(this),
        });
    }
    addCommand(command) {
        this.commands.set(command.name, command);
    }
    parseArgs(args) {
        const parsed = {};
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (arg.startsWith('--')) {
                const [key, value] = arg.slice(2).split('=', 2);
                if (value !== undefined) {
                    parsed[key] = this.parseValue(value);
                }
                else if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
                    parsed[key] = this.parseValue(args[++i]);
                }
                else {
                    parsed[key] = true;
                }
            }
            else if (arg.startsWith('-') && arg.length > 1) {
                const key = arg.slice(1);
                if (key.includes('=')) {
                    const [shortKey, value] = key.split('=', 2);
                    parsed[shortKey] = this.parseValue(value);
                }
                else if (i + 1 < args.length && !args[i + 1].startsWith('-')) {
                    parsed[key] = this.parseValue(args[++i]);
                }
                else {
                    parsed[key] = true;
                }
            }
            else {
                if (!parsed._positional) {
                    parsed._positional = [];
                }
                parsed._positional.push(arg);
            }
        }
        return parsed;
    }
    parseValue(value) {
        if (/^\d+$/.test(value)) {
            return parseInt(value, 10);
        }
        if (/^\d+\.\d+$/.test(value)) {
            return parseFloat(value);
        }
        if (value.toLowerCase() === 'true')
            return true;
        if (value.toLowerCase() === 'false')
            return false;
        return value;
    }
    validateArgs(command, args) {
        for (const option of command.options) {
            if (option.required && !(option.name in args) && !(option.alias && option.alias in args)) {
                throw new ErrorHandler_1.AppError(`Missing required option: --${option.name}`, 'MEDIUM');
            }
        }
    }
    showHelp() {
        console.log('SPARC Application CLI\n');
        console.log('Usage: app <command> [options]\n');
        console.log('Commands:');
        for (const [name, command] of this.commands) {
            console.log(`  ${name.padEnd(12)} ${command.description}`);
        }
        console.log('\nUse "app help <command>" for more information about a command.');
    }
    showCommandHelp(commandName) {
        const command = this.commands.get(commandName);
        if (!command) {
            console.error(`Unknown command: ${commandName}`);
            return;
        }
        console.log(`Usage: app ${command.name} [options]\n`);
        console.log(`${command.description}\n`);
        if (command.options.length > 0) {
            console.log('Options:');
            for (const option of command.options) {
                const short = option.alias ? `-${option.alias}, ` : '    ';
                const long = `--${option.name}`;
                const required = option.required ? ' (required)' : '';
                const defaultValue = option.default !== undefined ? ` (default: ${option.default})` : '';
                console.log(`  ${short}${long.padEnd(20)} ${option.description}${required}${defaultValue}`);
            }
        }
    }
    async handleConfigCommand(args) {
        const config = this.configService.getConfig();
        const format = args.format || 'table';
        if (args.validate) {
            const validation = await this.configService.validateConfig();
            console.log('Configuration validation:', validation.valid ? 'PASSED' : 'FAILED');
            if (!validation.valid) {
                console.log('Errors:');
                validation.errors.forEach(error => console.log(`  - ${error}`));
            }
            return;
        }
        switch (format) {
            case 'json':
                console.log(JSON.stringify(this.configService.toJSON(), null, 2));
                break;
            case 'table':
                console.log('Current Configuration:');
                console.log(`  Environment: ${config.environment}`);
                console.log(`  Port: ${config.port}`);
                console.log(`  Log Level: ${config.logLevel}`);
                console.log(`  Features: ${JSON.stringify(config.features, null, 2)}`);
                if (config.database) {
                    console.log(`  Database: ${config.database.host}:${config.database.port}/${config.database.database}`);
                }
                break;
            default:
                throw new ErrorHandler_1.AppError(`Unsupported format: ${format}`, 'MEDIUM');
        }
    }
    async handleHealthCommand(args) {
        const isHealthy = await this.configService.isHealthy();
        console.log(`Health Status: ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);
        if (args.verbose) {
            console.log('Health Details:');
            console.log(`  Configuration Service: ${isHealthy ? 'OK' : 'ERROR'}`);
            console.log(`  Environment: ${this.configService.get('environment')}`);
            console.log(`  Uptime: ${process.uptime()}s`);
            console.log(`  Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
        }
    }
    async handleVersionCommand() {
        console.log('SPARC Application v1.0.0');
        console.log(`Node.js: ${process.version}`);
        console.log(`Platform: ${process.platform}`);
    }
    async handleStartCommand(args) {
        const port = args.port || this.configService.get('port');
        const isDaemon = args.daemon;
        this.logger.info(`Starting server on port ${port}${isDaemon ? ' (daemon mode)' : ''}`);
        if (isDaemon) {
            console.log(`Server starting in daemon mode on port ${port}`);
        }
        else {
            console.log(`Server starting on port ${port}`);
            console.log('Press Ctrl+C to stop');
        }
    }
    async handleDevCommand(args) {
        console.log('Development mode');
        if (args.watch) {
            console.log('Watching for changes...');
        }
        if (args.debug) {
            console.log('Debug mode enabled');
            this.logger.setLogLevel('debug');
        }
    }
}
exports.CLI = CLI;
tslib_1.__decorate([
    (0, ErrorHandler_1.HandleErrors)('HIGH'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Array]),
    tslib_1.__metadata("design:returntype", Promise)
], CLI.prototype, "run", null);
//# sourceMappingURL=CLI.js.map