/** @type {import('jest').Config} */
module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  
  // Test patterns
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.{js,ts}',
    '<rootDir>/tests/integration/**/*.test.{js,ts}',
    '<rootDir>/src/**/__tests__/**/*.{js,ts}',
    '<rootDir>/src/**/?(*.)(spec|test).{js,ts}'
  ],
  
  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
  
  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.js'
  ],
  
  // Watch mode configuration
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
    'jest-watch-select-projects'
  ],
  
  // TDD-focused configurations
  verbose: true,
  bail: false,
  errorOnDeprecated: true,
  
  // Mock configuration
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  
  // Projects for different test types
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.test.{js,ts}']
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/tests/integration/**/*.test.{js,ts}'],
      setupFilesAfterEnv: ['<rootDir>/tests/setup/integration.setup.js']
    }
  ],
  
  // Reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'test-results',
      outputName: 'junit.xml'
    }]
  ]
};