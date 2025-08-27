#!/usr/bin/env tsx

import { spawn, ChildProcess } from 'child_process';
import { watch } from 'chokidar';
import path from 'path';

interface DevServerOptions {
  port?: number;
  host?: string;
  open?: boolean;
}

class DevServer {
  private processes: ChildProcess[] = [];
  private isRestarting = false;

  constructor(private options: DevServerOptions = {}) {
    this.setupGracefulShutdown();
  }

  private setupGracefulShutdown(): void {
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
    process.on('exit', () => this.shutdown());
  }

  private shutdown(): void {
    console.log('\n🔄 Shutting down development server...');
    this.processes.forEach(proc => {
      if (!proc.killed) {
        proc.kill();
      }
    });
    process.exit(0);
  }

  private async startTypeScript(): Promise<void> {
    console.log('🔨 Starting TypeScript compiler in watch mode...');
    const tsc = spawn('npx', ['tsc', '--watch'], {
      stdio: 'pipe',
      shell: true,
    });

    tsc.stdout?.on('data', data => {
      const output = data.toString();
      if (output.includes('Found 0 errors')) {
        console.log('✅ TypeScript compilation successful');
      } else if (output.includes('error')) {
        console.error('❌ TypeScript compilation failed');
      }
      process.stdout.write(`[TSC] ${output}`);
    });

    tsc.stderr?.on('data', data => {
      process.stderr.write(`[TSC ERROR] ${data}`);
    });

    this.processes.push(tsc);
  }

  private async startMainProcess(): Promise<void> {
    if (this.isRestarting) return;
    
    console.log('🚀 Starting main application...');
    const main = spawn('node', ['dist/index.js'], {
      stdio: 'inherit',
      shell: true,
    });

    main.on('close', code => {
      if (code !== null && code !== 0 && !this.isRestarting) {
        console.error(`❌ Application exited with code ${code}`);
      }
    });

    this.processes.push(main);
  }

  private async restartMainProcess(): Promise<void> {
    if (this.isRestarting) return;
    
    this.isRestarting = true;
    console.log('🔄 Restarting application...');
    
    // Kill existing main process
    const mainProcess = this.processes.find(p => p.spawnargs.includes('dist/index.js'));
    if (mainProcess && !mainProcess.killed) {
      mainProcess.kill();
    }
    
    // Wait a bit before restarting
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await this.startMainProcess();
    this.isRestarting = false;
  }

  private setupFileWatcher(): void {
    console.log('👀 Setting up file watcher...');
    
    const watcher = watch(['src/**/*.ts', 'src/**/*.tsx'], {
      ignored: /node_modules/,
      persistent: true,
    });

    watcher.on('change', async filePath => {
      console.log(`📝 File changed: ${path.relative(process.cwd(), filePath)}`);
      // TypeScript compiler will handle recompilation
    });

    // Watch dist directory for compiled changes
    const distWatcher = watch(['dist/**/*.js'], {
      ignored: /node_modules/,
      persistent: true,
    });

    distWatcher.on('change', async () => {
      await this.restartMainProcess();
    });
  }

  async start(): Promise<void> {
    console.log('🚀 Starting development server...');
    console.log(`📁 Working directory: ${process.cwd()}`);
    console.log(`🔧 Options:`, this.options);
    
    try {
      // Start TypeScript compiler
      await this.startTypeScript();
      
      // Wait for initial compilation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Start main application
      await this.startMainProcess();
      
      // Setup file watching
      this.setupFileWatcher();
      
      console.log('✅ Development server started successfully!');
      console.log('Press Ctrl+C to stop the server');
      
    } catch (error) {
      console.error('❌ Failed to start development server:', error);
      process.exit(1);
    }
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: DevServerOptions = {};

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  switch (arg) {
    case '--port':
      options.port = parseInt(args[++i]) || 3000;
      break;
    case '--host':
      options.host = args[++i] || 'localhost';
      break;
    case '--open':
      options.open = true;
      break;
  }
}

// Start development server
const devServer = new DevServer(options);
devServer.start().catch(error => {
  console.error('Development server failed to start:', error);
  process.exit(1);
});