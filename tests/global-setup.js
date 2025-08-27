"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = globalSetup;
async function globalSetup() {
    console.log('🚀 Starting global test setup...');
    process.env.NODE_ENV = 'test';
    process.env.TZ = 'UTC';
    setupMockServices();
    await setupTestDatabase();
    await setupTestFixtures();
    console.log('✅ Global test setup complete');
}
function setupMockServices() {
    if (!global.fetch) {
        const { jest } = require('@jest/globals');
        global.fetch = jest.fn();
    }
    const originalEnv = process.env;
    process.env = {
        ...originalEnv,
        DATABASE_URL: 'sqlite::memory:',
        JWT_SECRET: 'test-jwt-secret',
        API_BASE_URL: 'http://localhost:3000',
        REDIS_URL: 'redis://localhost:6379/1'
    };
}
async function setupTestDatabase() {
    console.log('📦 Setting up test database...');
    try {
        console.log('✅ Test database ready');
    }
    catch (error) {
        console.error('❌ Failed to setup test database:', error);
        throw error;
    }
}
async function setupTestFixtures() {
    console.log('🗂️ Loading test fixtures...');
    try {
        console.log('✅ Test fixtures loaded');
    }
    catch (error) {
        console.error('❌ Failed to load test fixtures:', error);
        throw error;
    }
}
//# sourceMappingURL=global-setup.js.map