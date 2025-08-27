#!/usr/bin/env node
// Automated Test Generator for TDD

const fs = require('fs');
const path = require('path');

class TestGenerator {
  constructor() {
    this.templates = {
      london: this.getLondonTemplate(),
      classic: this.getClassicTemplate(),
      integration: this.getIntegrationTemplate()
    };
  }
  
  generateTest(filePath, options = {}) {
    const {
      style = 'london',
      testType = 'unit',
      className = this.extractClassName(filePath),
      methods = this.extractMethods(filePath)
    } = options;
    
    const template = this.templates[style];
    const testContent = template({
      className,
      methods,
      filePath,
      testType
    });
    
    const testFilePath = this.getTestFilePath(filePath, testType);
    
    // Ensure directory exists
    const testDir = path.dirname(testFilePath);
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    
    fs.writeFileSync(testFilePath, testContent);
    console.log(`✅ Generated test: ${testFilePath}`);
    
    return testFilePath;
  }
  
  extractClassName(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const classMatch = content.match(/class\s+(\w+)/);
      const functionMatch = content.match(/(?:export\s+)?(?:function\s+|const\s+)(\w+)/);
      
      return classMatch?.[1] || functionMatch?.[1] || path.basename(filePath, path.extname(filePath));
    } catch {
      return path.basename(filePath, path.extname(filePath));
    }
  }
  
  extractMethods(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const methodRegex = /(?:^\s*|\s+)(\w+)\s*\([^)]*\)\s*{/gm;
      const methods = [];
      let match;
      
      while ((match = methodRegex.exec(content)) !== null) {
        if (!['constructor', 'if', 'for', 'while', 'switch'].includes(match[1])) {
          methods.push(match[1]);
        }
      }
      
      return methods;
    } catch {
      return [];
    }
  }
  
  getTestFilePath(srcPath, testType) {
    const relativePath = path.relative('src', srcPath);
    const parsedPath = path.parse(relativePath);
    const testFileName = `${parsedPath.name}.test${parsedPath.ext}`;
    
    return path.join('tests', testType, parsedPath.dir, testFileName);
  }
  
  getLondonTemplate() {
    return ({ className, methods }) => `// London School TDD Test for ${className}
// Generated automatically - customize as needed

describe('${className}', () => {
  let ${className.toLowerCase()};
  let mockDependency1;
  let mockDependency2;
  
  beforeEach(() => {
    // Create mocks for all collaborators (London School approach)
    mockDependency1 = global.testUtils.createMock('Dependency1', {
      method1: jest.fn().mockResolvedValue('success'),
      method2: jest.fn().mockReturnValue(true)
    });
    
    mockDependency2 = global.testUtils.createMock('Dependency2', {
      save: jest.fn().mockResolvedValue({ id: '123' }),
      find: jest.fn().mockResolvedValue(null)
    });
    
    // Inject mocks into system under test
    ${className.toLowerCase()} = new ${className}(mockDependency1, mockDependency2);
  });
  
${methods.map(method => `  describe('${method}', () => {
    it('should coordinate with collaborators correctly', async () => {
      // Arrange
      const input = {}; // Define test input
      
      // Act
      const result = await ${className.toLowerCase()}.${method}(input);
      
      // Assert - Focus on interactions
      expect(mockDependency1.method1).toHaveBeenCalledWith(input);
      expect(mockDependency2.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
    
    it('should handle error scenarios', async () => {
      // Arrange
      mockDependency1.method1.mockRejectedValue(new Error('Dependency failed'));
      
      // Act & Assert
      await expect(${className.toLowerCase()}.${method}({}))
        .rejects.toThrow('Dependency failed');
    });
  });
`).join('\n')}});
`;
  }
  
  getClassicTemplate() {
    return ({ className, methods }) => `// Classic TDD Test for ${className}
// Generated automatically - customize as needed

describe('${className}', () => {
  let ${className.toLowerCase()};
  
  beforeEach(() => {
    ${className.toLowerCase()} = new ${className}();
  });
  
${methods.map(method => `  describe('${method}', () => {
    it('should return expected result', () => {
      // Arrange
      const input = {}; // Define test input
      const expected = {}; // Define expected output
      
      // Act
      const result = ${className.toLowerCase()}.${method}(input);
      
      // Assert - Focus on state
      expect(result).toEqual(expected);
    });
    
    it('should handle edge cases', () => {
      // Test boundary conditions
      expect(() => ${className.toLowerCase()}.${method}(null))
        .not.toThrow();
    });
    
    it('should maintain object state correctly', () => {
      // Test state changes
      const initialState = ${className.toLowerCase()}.getState?.();
      ${className.toLowerCase()}.${method}({});
      const finalState = ${className.toLowerCase()}.getState?.();
      
      // Assert state changes if applicable
      if (initialState !== undefined) {
        expect(finalState).not.toEqual(initialState);
      }
    });
  });
`).join('\n')}});
`;
  }
  
  getIntegrationTemplate() {
    return ({ className }) => `// Integration Test for ${className}
// Generated automatically - customize as needed

describe('${className} Integration', () => {
  beforeEach(async () => {
    // Setup integration test environment
    await global.integrationUtils.setupTestData();
  });
  
  afterEach(async () => {
    // Cleanup integration test data
    await global.integrationUtils.cleanupTestData();
  });
  
  it('should integrate with real dependencies', async () => {
    // Arrange
    const service = new ${className}();
    const testData = {}; // Define integration test data
    
    // Act
    const result = await service.processIntegration(testData);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
  });
  
  it('should handle real-world error scenarios', async () => {
    // Test with actual error conditions
    const service = new ${className}();
    
    await expect(service.processIntegration(null))
      .rejects.toThrow();
  });
  
  it('should maintain data consistency', async () => {
    // Test data integrity across operations
    const service = new ${className}();
    
    const beforeCount = await global.testDb.count();
    await service.createData({});
    const afterCount = await global.testDb.count();
    
    expect(afterCount).toBe(beforeCount + 1);
  });
});
`;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node test-generator.js <file-path> [options]');
    console.log('Options:');
    console.log('  --style [london|classic] - TDD style (default: london)');
    console.log('  --type [unit|integration] - Test type (default: unit)');
    process.exit(1);
  }
  
  const filePath = args[0];
  const options = {};
  
  for (let i = 1; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    options[key] = value;
  }
  
  const generator = new TestGenerator();
  generator.generateTest(filePath, options);
}

module.exports = TestGenerator;