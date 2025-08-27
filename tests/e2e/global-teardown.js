// Global E2E Test Teardown
async function globalTeardown() {
  console.log('🧹 Cleaning up E2E test environment...');
  
  // Cleanup test database
  if (global.testDb) {
    await global.testDb.reset();
  }
  
  // Cleanup test files
  await cleanupTestFiles();
  
  // Generate test summary
  await generateTestSummary();
  
  console.log('✅ E2E test cleanup completed');
}

async function cleanupTestFiles() {
  const fs = require('fs');
  const path = require('path');
  
  const cleanupPaths = [
    'tests/e2e/.auth',
    'test-results/screenshots',
    'test-results/videos',
    'test-results/traces'
  ];
  
  for (const cleanupPath of cleanupPaths) {
    if (fs.existsSync(cleanupPath)) {
      console.log(`🗑️  Cleaning up: ${cleanupPath}`);
      fs.rmSync(cleanupPath, { recursive: true, force: true });
    }
  }
}

async function generateTestSummary() {
  console.log('📊 Generating E2E test summary...');
  
  const summary = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    testType: 'e2e',
    cleanup: 'completed'
  };
  
  const fs = require('fs');
  fs.writeFileSync(
    'test-results/e2e-summary.json',
    JSON.stringify(summary, null, 2)
  );
}

export default globalTeardown;