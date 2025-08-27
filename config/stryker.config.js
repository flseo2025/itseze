// Stryker Mutation Testing Configuration
module.exports = {
  packageManager: 'npm',
  
  // Test runner configuration
  testRunner: 'jest',
  testFramework: 'jest',
  
  // Coverage analysis
  coverageAnalysis: 'perTest',
  
  // Files to mutate
  mutate: [
    'src/**/*.js',
    'src/**/*.ts',
    '!src/**/*.test.js',
    '!src/**/*.test.ts',
    '!src/**/*.spec.js',
    '!src/**/*.spec.ts'
  ],
  
  // Test files
  testMatch: [
    'tests/unit/**/*.test.js',
    'tests/unit/**/*.test.ts'
  ],
  
  // Mutation score thresholds
  thresholds: {
    high: 90,
    low: 80,
    break: 75
  },
  
  // Mutators to use
  mutator: {
    // Arithmetic operators
    ArithmeticOperator: true,
    
    // Array declarations
    ArrayDeclaration: true,
    
    // Assignment expressions
    AssignmentExpression: true,
    
    // Block statements
    BlockStatement: true,
    
    // Boolean literals
    BooleanLiteral: true,
    
    // Conditional expressions
    ConditionalExpression: true,
    
    // Equality operators
    EqualityOperator: true,
    
    // Logical operators
    LogicalOperator: true,
    
    // Method expressions
    MethodExpression: true,
    
    // Object literals
    ObjectLiteral: true,
    
    // String literals
    StringLiteral: true,
    
    // Unary operators
    UnaryOperator: true,
    
    // Update expressions
    UpdateExpression: true
  },
  
  // Reporters
  reporters: [
    'progress',
    'clear-text',
    'html',
    'json',
    'dashboard'
  ],
  
  // HTML report options
  htmlReporter: {
    baseDir: 'mutation-reports/html'
  },
  
  // JSON report options
  jsonReporter: {
    fileName: 'mutation-reports/mutation-report.json'
  },
  
  // Dashboard reporter options
  dashboard: {
    reportType: 'full',
    project: 'tdd-project',
    version: process.env.BRANCH_NAME || 'main',
    module: 'core'
  },
  
  // Performance settings
  maxConcurrentTestRunners: 4,
  maxTestRunnerReuse: 3,
  
  // Timeout settings
  timeoutMS: 60000,
  timeoutFactor: 1.5,
  
  // Temporary directory
  tempDirName: '.stryker-tmp',
  
  // Log level
  logLevel: 'info',
  
  // File patterns to ignore
  ignorePatterns: [
    'node_modules',
    'coverage',
    'dist',
    'build',
    '.stryker-tmp'
  ],
  
  // Plugins
  plugins: [
    '@stryker-mutator/core',
    '@stryker-mutator/jest-runner',
    '@stryker-mutator/javascript-mutator'
  ],
  
  // Jest configuration
  jest: {
    configFile: 'config/jest.config.js',
    enableFindRelatedTests: true,
    projectType: 'node'
  }
};