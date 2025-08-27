# TDD Automation Guide

## Overview

This guide covers the comprehensive TDD automation environment set up for this project, including continuous testing, mutation testing, and e2e testing workflows.

## Quick Start

```bash
# Install dependencies
npm install

# Run tests in watch mode (recommended for TDD)
npm run test:watch

# Generate tests for a file
npm run test:generate src/user.js --style london

# Run all test types
npm run test:all
```

## Test Types & Commands

### Unit Tests (TDD Focus)
```bash
# Standard unit tests
npm run test:unit

# Watch mode for TDD red-green-refactor cycle
npm run test:watch

# With coverage
npm run test:coverage
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration

# With database setup
DATABASE_URL=postgresql://... npm run test:integration
```

### End-to-End Tests
```bash
# Run E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific browser
npm run test:e2e -- --project=chromium
```

### Mutation Testing (Test Quality)
```bash
# Run mutation tests to validate test quality
npm run test:mutation

# Quick mutation test
npm run test:mutation -- --mutate "src/specific-file.js"
```

## TDD Workflow

### 1. Red Phase (Failing Test)
```javascript
// Create failing test first
it('should register new user', () => {
  const result = userService.register(userData);
  expect(result.success).toBe(true);
});
```

### 2. Green Phase (Make it Pass)
```javascript
// Implement minimal code to pass
class UserService {
  register(userData) {
    return { success: true };
  }
}
```

### 3. Refactor Phase (Improve Code)
```javascript
// Refactor with confidence (tests protect you)
class UserService {
  constructor(repository, validator) {
    this.repository = repository;
    this.validator = validator;
  }
  
  async register(userData) {
    this.validator.validate(userData);
    const user = await this.repository.save(userData);
    return { success: true, userId: user.id };
  }
}
```

## London School vs Classic TDD

### London School (Mockist)
- Use mocks for all collaborators
- Focus on behavior and interactions
- Outside-in development
- Template: `tests/templates/london-school.test.js`

### Classic TDD (Detroit School)
- Minimal mocking
- Focus on state verification
- Inside-out development
- Template: `tests/templates/classic-tdd.test.js`

## Test Generation

### Generate Tests Automatically
```bash
# London School style (default)
node scripts/test-generator.js src/user-service.js

# Classic TDD style
node scripts/test-generator.js src/calculator.js --style classic

# Integration test
node scripts/test-generator.js src/api-service.js --type integration
```

## Watch Mode Features

The watch mode (`npm run test:watch`) provides:

- **File change detection**: Automatically runs tests when files change
- **Smart test selection**: Only runs related tests
- **Debounced execution**: Prevents test spam during rapid changes
- **Coverage tracking**: Shows coverage changes in real-time
- **Error highlighting**: Clear feedback on test failures

## Continuous Integration

### GitHub Actions Workflow
- **Unit Tests**: Run on all Node.js versions (16, 18, 20)
- **Integration Tests**: Run with real database
- **E2E Tests**: Run with Playwright on multiple browsers
- **Mutation Testing**: Validates test quality on main branch
- **Quality Gate**: Enforces 90% coverage threshold

### Quality Metrics
- **Code Coverage**: Minimum 90% (lines, functions, branches, statements)
- **Mutation Score**: Minimum 75% (validates test effectiveness)
- **Test Performance**: Monitor test execution time
- **Flaky Test Detection**: Automatically detect unstable tests

## Best Practices

### Test Structure
```javascript
describe('Feature/Component', () => {
  describe('Method/Function', () => {
    it('should do something specific', () => {
      // Arrange - Setup test data
      // Act - Execute the code
      // Assert - Verify results
    });
  });
});
```

### Mock Best Practices (London School)
```javascript
// Create focused, behavioral mocks
const mockRepository = {
  save: jest.fn().mockResolvedValue({ id: '123' }),
  find: jest.fn().mockResolvedValue(null)
};

// Verify interactions, not implementations
expect(mockRepository.save).toHaveBeenCalledWith(expectedData);
expect(mockRepository.save).toHaveBeenCalledBefore(mockNotifier.send);
```

### Test Data Management
```javascript
// Use factories for consistent test data
const user = global.testUtils.generateUser({
  email: 'specific@example.com'
});

// Clean up after each test
afterEach(() => {
  global.testUtils.cleanup();
});
```

## Configuration Files

### Jest Configuration
- **Location**: `config/jest.config.js`
- **Features**: Multi-project setup, coverage thresholds, watch plugins
- **Extensions**: Custom matchers, global utilities

### Mutation Testing
- **Location**: `config/stryker.config.js`
- **Mutators**: Comprehensive mutation operators
- **Thresholds**: High (90%), Low (80%), Break (75%)

### E2E Testing
- **Location**: `tests/e2e/playwright.config.js`
- **Browsers**: Chromium, Firefox, WebKit, Mobile
- **Features**: Screenshots, videos, tracing, parallel execution

## Troubleshooting

### Common Issues

1. **Tests not running in watch mode**
   ```bash
   # Check file permissions
   chmod +x scripts/test-watch.js
   
   # Install missing dependencies
   npm install chokidar
   ```

2. **Coverage thresholds failing**
   ```bash
   # Generate coverage report
   npm run test:coverage
   
   # Check specific files
   open coverage/lcov-report/index.html
   ```

3. **E2E tests timing out**
   ```bash
   # Increase timeout in playwright.config.js
   timeout: 60000
   
   # Run in headed mode to debug
   npm run test:e2e -- --headed
   ```

4. **Mutation tests taking too long**
   ```bash
   # Reduce scope
   npm run test:mutation -- --mutate "src/specific/**/*.js"
   
   # Increase concurrent runners
   # Edit config/stryker.config.js: maxConcurrentTestRunners: 8
   ```

## Performance Optimization

### Test Performance
- Use `beforeAll` for expensive setup
- Mock external dependencies
- Use `test.concurrent` for independent tests
- Implement test data factories

### Watch Mode Performance
- Configure ignore patterns for node_modules
- Use debouncing to prevent rapid re-runs
- Enable findRelatedTests for smart execution

## Integration with IDEs

### VS Code Extensions
- Jest Runner
- Test Explorer UI
- Coverage Gutters
- Playwright Test for VS Code

### WebStorm/IntelliJ
- Built-in Jest support
- Test runner integration
- Coverage visualization
- Playwright plugin

## Metrics and Reporting

### Coverage Reports
- **HTML**: `coverage/lcov-report/index.html`
- **JSON**: `coverage/coverage-summary.json`
- **LCOV**: `coverage/lcov.info`

### Mutation Reports
- **HTML**: `mutation-reports/html/index.html`
- **JSON**: `mutation-reports/mutation-report.json`

### E2E Reports
- **HTML**: `test-results/playwright-report/index.html`
- **JUnit**: `test-results/junit.xml`

## Advanced Features

### Custom Matchers
```javascript
// Example: toBeCalledBefore matcher
expect(mockA.method).toBeCalledBefore(mockB.method);
```

### Snapshot Testing
```javascript
// Component snapshots
expect(component.render()).toMatchSnapshot();

// Configuration snapshots
expect(config).toMatchInlineSnapshot();
```

### Parameterized Tests
```javascript
// Test multiple scenarios
test.each([
  [1, 2, 3],
  [2, 3, 5],
  [3, 5, 8]
])('fibonacci(%i, %i) = %i', (a, b, expected) => {
  expect(fibonacci(a, b)).toBe(expected);
});
```

## Support and Resources

- **Jest Documentation**: https://jestjs.io/docs/
- **Playwright Documentation**: https://playwright.dev/
- **Stryker Documentation**: https://stryker-mutator.io/
- **TDD Best Practices**: https://martinfowler.com/articles/practical-test-pyramid.html