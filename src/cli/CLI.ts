/**
 * CLI Interface - SPARC Implementation
 * Command-line interface with structured command handling
 */

import { AppError, HandleErrors } from '../utils/ErrorHandler';

import type { ConfigService } from '../services/ConfigService';
import type { CLICommand, CLIArgs } from '../types';
import type { Logger } from '../utils/Logger';

export class CLI {
  private configService: ConfigService;
  private logger: Logger;
  private commands: Map<string, CLICommand> = new Map();

  constructor(configService: ConfigService, logger: Logger) {
    this.configService = configService;
    this.logger = logger.child('CLI');
    this.setupCommands();
  }

  /**
   * Run CLI with provided arguments
   */
  @HandleErrors('HIGH')
  async run(args: string[]): Promise<void> {
    try {
      if (args.length === 0) {
        this.showHelp();
        return;
      }

      const commandName = args[0];
      const commandArgs = this.parseArgs(args.slice(1));

      if (commandName === 'help' || commandName === '-h' || commandName === '--help') {
        if (commandArgs.command) {
          this.showCommandHelp(commandArgs.command as string);
        } else {
          this.showHelp();
        }
        return;
      }

      const command = this.commands.get(commandName!);
      if (!command) {
        throw new AppError(`Unknown command: ${commandName}`, 'MEDIUM');
      }

      this.logger.debug(`Executing command: ${commandName}`, { args: commandArgs });

      // Validate required options
      this.validateArgs(command, commandArgs);

      await command.handler(commandArgs);

      this.logger.debug(`Command completed: ${commandName}`);
    } catch (error) {
      if (error instanceof AppError) {
        console.error(`Error: ${error.message}`);
        if (error.severity === 'MEDIUM') {
          console.log('\nUse --help to see available commands');
        }
      } else {
        console.error('An unexpected error occurred:', error);
      }
      throw error;
    }
  }

  private setupCommands(): void {
    // Config commands
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

    // Health check command
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

    // Version command
    this.addCommand({
      name: 'version',
      description: 'Show application version',
      options: [],
      handler: this.handleVersionCommand.bind(this),
    });

    // Start command (for server mode)
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

    // Development commands
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

  private addCommand(command: CLICommand): void {
    this.commands.set(command.name, command);
  }

  private parseArgs(args: string[]): CLIArgs {
    const parsed: CLIArgs = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (arg && arg.startsWith('--')) {
        // Long option: --option=value or --option value
        const [key, value] = arg.slice(2).split('=', 2);
        if (key && value !== undefined) {
          parsed[key] = this.parseValue(value);
        } else if (key && i + 1 < args.length && args[i + 1] && !args[i + 1]!.startsWith('-')) {
          parsed[key] = this.parseValue(args[++i]!);
        } else if (key) {
          parsed[key] = true; // Boolean flag
        }
      } else if (arg && arg.startsWith('-') && arg.length > 1) {
        // Short option: -o value or -o=value
        const key = arg.slice(1);
        if (key.includes('=')) {
          const [shortKey, value] = key.split('=', 2);
          if (shortKey && value) {
            parsed[shortKey] = this.parseValue(value);
          }
        } else if (i + 1 < args.length && args[i + 1] && !args[i + 1]!.startsWith('-')) {
          parsed[key] = this.parseValue(args[++i]!);
        } else {
          parsed[key] = true; // Boolean flag
        }
      } else {
        // Positional argument
        if (!parsed._positional) {
          parsed._positional = [];
        }
        (parsed._positional as string[]).push(arg!);
      }
    }

    return parsed;
  }

  private parseValue(value: string): string | number | boolean {
    // Try to parse as number
    if (/^\d+$/.test(value)) {
      return parseInt(value, 10);
    }
    if (/^\d+\.\d+$/.test(value)) {
      return parseFloat(value);
    }

    // Parse boolean
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;

    // Return as string
    return value;
  }

  private validateArgs(command: CLICommand, args: CLIArgs): void {
    for (const option of command.options) {
      if (option.required && !(option.name in args) && !(option.alias && option.alias in args)) {
        throw new AppError(`Missing required option: --${option.name}`, 'MEDIUM');
      }
    }
  }

  private showHelp(): void {
    console.log('SPARC Application CLI\n');
    console.log('Usage: app <command> [options]\n');
    console.log('Commands:');

    for (const [name, command] of this.commands) {
      console.log(`  ${name.padEnd(12)} ${command.description}`);
    }

    console.log('\nUse "app help <command>" for more information about a command.');
  }

  private showCommandHelp(commandName: string): void {
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

  // Command handlers
  private async handleConfigCommand(args: CLIArgs): Promise<void> {
    const config = this.configService.getConfig();
    const format = (args.format as string) || 'table';

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
          console.log(
            `  Database: ${config.database.host}:${config.database.port}/${config.database.database}`
          );
        }
        break;
      default:
        throw new AppError(`Unsupported format: ${format}`, 'MEDIUM');
    }
  }

  private async handleHealthCommand(args: CLIArgs): Promise<void> {
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

  private async handleVersionCommand(): Promise<void> {
    // In a real application, you'd read this from package.json
    console.log('SPARC Application v1.0.0');
    console.log(`Node.js: ${process.version}`);
    console.log(`Platform: ${process.platform}`);
  }

  private async handleStartCommand(args: CLIArgs): Promise<void> {
    const port = (args.port as number) || this.configService.get('port');
    const isDaemon = args.daemon as boolean;

    this.logger.info(`Starting server on port ${port}${isDaemon ? ' (daemon mode)' : ''}`);

    if (isDaemon) {
      console.log(`Server starting in daemon mode on port ${port}`);
      // In a real application, you'd implement daemon mode here
    } else {
      console.log(`Server starting on port ${port}`);
      console.log('Press Ctrl+C to stop');
      // In a real application, you'd start the HTTP server here
    }
  }

  private async handleDevCommand(args: CLIArgs): Promise<void> {
    console.log('Development mode');

    if (args.watch) {
      console.log('Watching for changes...');
      // Implement file watching
    }

    if (args.debug) {
      console.log('Debug mode enabled');
      this.logger.setLogLevel('debug');
    }
  }
}
