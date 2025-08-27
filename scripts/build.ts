#!/usr/bin/env tsx

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, rmSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

interface BuildOptions {
  clean?: boolean;
  watch?: boolean;
  production?: boolean;
}

async function runCommand(command: string, description: string): Promise<void> {
  console.log(`🔨 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.warn(stderr);
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error);
    throw error;
  }
}

async function clean(): Promise<void> {
  const distPath = path.resolve(process.cwd(), 'dist');
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true, force: true });
    console.log('🧹 Cleaned dist directory');
  }
}

async function build(options: BuildOptions = {}): Promise<void> {
  console.log('🚀 Starting build process...');
  
  const startTime = Date.now();
  
  try {
    // Clean if requested
    if (options.clean) {
      await clean();
    }
    
    // Type checking
    await runCommand('tsc --noEmit', 'Type checking');
    
    // Linting
    await runCommand('eslint src tests --ext .ts,.tsx', 'Linting');
    
    // Build TypeScript
    const tscCommand = options.watch ? 'tsc --watch' : 'tsc';
    await runCommand(tscCommand, 'Building TypeScript');
    
    // Resolve path aliases
    if (!options.watch) {
      await runCommand('tsc-alias', 'Resolving path aliases');
    }
    
    const duration = Date.now() - startTime;
    console.log(`🎉 Build completed successfully in ${duration}ms`);
    
  } catch (error) {
    console.error('💥 Build failed:', error);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options: BuildOptions = {
  clean: args.includes('--clean'),
  watch: args.includes('--watch'),
  production: args.includes('--production'),
};

// Run build
build(options).catch(error => {
  console.error('Build script failed:', error);
  process.exit(1);
});