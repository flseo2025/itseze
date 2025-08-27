#!/usr/bin/env node
// TDD Watch Mode Script with enhanced features

const { spawn } = require('child_process');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

class TDDWatcher {
  constructor(options = {}) {
    this.options = {
      testDir: 'tests',
      srcDir: 'src',
      configFile: 'config/jest.config.js',
      debounceMs: 300,
      verbose: true,
      coverage: true,
      ...options
    };
    
    this.testProcess = null;
    this.isRunning = false;
    this.testQueue = new Set();
    this.lastRunTime = 0;
  }
  
  start() {
    console.log('🚀 Starting TDD Watch Mode...');
    
    // Watch source and test files
    const watcher = chokidar.watch([
      `${this.options.srcDir}/**/*.{js,ts,jsx,tsx}`,
      `${this.options.testDir}/**/*.{js,ts,jsx,tsx}`,
      this.options.configFile
    ], {
      ignored: /node_modules/,
      persistent: true,
      ignoreInitial: true
    });
    
    watcher.on('change', (filePath) => {
      this.handleFileChange(filePath);
    });
    
    watcher.on('add', (filePath) => {
      this.handleFileChange(filePath);
    });
    
    // Initial test run
    this.runTests();
    
    console.log('👀 Watching for changes...');
    console.log('Press Ctrl+C to stop');
    
    // Handle cleanup
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping TDD Watch Mode...');
      watcher.close();
      if (this.testProcess) {
        this.testProcess.kill();
      }
      process.exit(0);
    });
  }
  
  handleFileChange(filePath) {
    if (this.options.verbose) {
      console.log(`📝 File changed: ${filePath}`);
    }
    
    this.testQueue.add(filePath);
    this.debounceTestRun();
  }
  
  debounceTestRun() {
    const now = Date.now();
    const timeSinceLastRun = now - this.lastRunTime;
    
    if (timeSinceLastRun < this.options.debounceMs) {
      setTimeout(() => this.debounceTestRun(), this.options.debounceMs - timeSinceLastRun);
      return;
    }
    
    this.runTests();
  }
  
  runTests(specificTest = null) {
    if (this.isRunning) {
      if (this.options.verbose) {
        console.log('⏳ Tests already running, queuing...');
      }
      return;
    }
    
    this.isRunning = true;
    this.lastRunTime = Date.now();
    
    // Kill existing test process
    if (this.testProcess) {
      this.testProcess.kill();
    }
    
    const jestArgs = [
      '--config', this.options.configFile,
      '--watchAll=false',
      '--passWithNoTests'
    ];
    
    if (this.options.coverage) {
      jestArgs.push('--coverage');
    }
    
    if (specificTest) {
      jestArgs.push(specificTest);
    }
    
    if (this.options.verbose) {
      jestArgs.push('--verbose');
    }
    
    console.log('\n🧪 Running tests...');
    console.log('=' * 50);
    
    this.testProcess = spawn('npx', ['jest', ...jestArgs], {
      stdio: 'inherit',
      shell: true
    });
    
    this.testProcess.on('close', (code) => {
      this.isRunning = false;
      const status = code === 0 ? '✅ PASSED' : '❌ FAILED';
      console.log(`\n${status} - Tests completed with exit code: ${code}`);
      console.log('=' * 50);
      console.log('👀 Watching for changes...\n');
      
      // Process queued files
      if (this.testQueue.size > 0) {
        this.testQueue.clear();
        setTimeout(() => this.runTests(), 100);
      }
    });
    
    this.testProcess.on('error', (error) => {
      console.error('❌ Test process error:', error.message);
      this.isRunning = false;
    });
  }
  
  getRelatedTestFile(srcFile) {
    const relativePath = path.relative(this.options.srcDir, srcFile);
    const testFile = relativePath.replace(/\.(js|ts|jsx|tsx)$/, '.test.$1');
    return path.join(this.options.testDir, 'unit', testFile);
  }
}

// CLI interface
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace('--', '');
  const value = args[i + 1];
  
  switch (key) {
    case 'coverage':
      options.coverage = value === 'true';
      break;
    case 'verbose':
      options.verbose = value === 'true';
      break;
    case 'src':
      options.srcDir = value;
      break;
    case 'tests':
      options.testDir = value;
      break;
  }
}

// Start the watcher
const watcher = new TDDWatcher(options);
watcher.start();