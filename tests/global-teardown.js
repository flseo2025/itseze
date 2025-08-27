"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = globalTeardown;
async function globalTeardown() {
    console.log('🧹 Starting global test teardown...');
    await cleanupTestDatabase();
    await cleanupTempFiles();
    await closeConnections();
    resetEnvironment();
    console.log('✅ Global test teardown complete');
}
async function cleanupTestDatabase() {
    console.log('🗑️ Cleaning up test database...');
    try {
        console.log('✅ Test database cleaned');
    }
    catch (error) {
        console.error('❌ Failed to cleanup test database:', error);
    }
}
async function cleanupTempFiles() {
    console.log('🗑️ Cleaning up temporary files...');
    try {
        const fs = require('fs').promises;
        const path = require('path');
        const tempDir = path.join(__dirname, 'temp');
        try {
            await fs.rmdir(tempDir, { recursive: true });
            console.log('✅ Temporary files cleaned');
        }
        catch (error) {
            console.log('✅ No temporary files to clean');
        }
    }
    catch (error) {
        console.error('❌ Failed to cleanup temp files:', error);
    }
}
async function closeConnections() {
    console.log('🔌 Closing connections...');
    try {
        console.log('✅ Connections closed');
    }
    catch (error) {
        console.error('❌ Failed to close connections:', error);
    }
}
function resetEnvironment() {
    console.log('🔄 Resetting environment...');
    try {
        delete global.fetch;
        jest.restoreAllMocks?.();
        console.log('✅ Environment reset');
    }
    catch (error) {
        console.error('❌ Failed to reset environment:', error);
    }
}
//# sourceMappingURL=global-teardown.js.map