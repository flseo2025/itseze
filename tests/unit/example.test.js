"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const test_helpers_1 = require("../utils/test-helpers");
const test_data_1 = require("../fixtures/test-data");
class UserService {
    constructor() {
        this.users = [];
    }
    async createUser(userData) {
        if (!userData.email) {
            throw new Error('Email is required');
        }
        if (!userData.password) {
            throw new Error('Password is required');
        }
        if (this.users.find(u => u.email === userData.email)) {
            throw new Error('Email already exists');
        }
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            ...userData,
            createdAt: new Date().toISOString()
        };
        this.users.push(user);
        return user;
    }
    async findUserById(id) {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async findUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }
    async updateUser(id, updates) {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        this.users[userIndex] = {
            ...this.users[userIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        return this.users[userIndex];
    }
    async deleteUser(id) {
        const userIndex = this.users.findIndex(u => u.id === id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        this.users.splice(userIndex, 1);
        return true;
    }
    getUserCount() {
        return this.users.length;
    }
}
(0, globals_1.describe)('UserService', () => {
    let userService;
    let consoleMock;
    (0, globals_1.beforeEach)(() => {
        userService = new UserService();
        consoleMock = test_helpers_1.testSetup.mockConsole();
    });
    (0, globals_1.afterEach)(() => {
        consoleMock.restore();
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('createUser', () => {
        (0, globals_1.it)('should create a user with valid data', async () => {
            const userData = test_helpers_1.generateTestData.user({
                email: 'newuser@example.com',
                name: 'New User'
            });
            const result = await userService.createUser(userData);
            (0, globals_1.expect)(result).toMatchObject({
                name: userData.name,
                email: userData.email
            });
            (0, globals_1.expect)(result).toHaveProperty('id');
            (0, globals_1.expect)(result).toHaveProperty('createdAt');
            (0, globals_1.expect)(result.id).toBeDefined();
            (0, globals_1.expect)(result.createdAt).toBeValidISODate();
        });
        (0, globals_1.it)('should throw error when email is missing', async () => {
            const userData = test_helpers_1.generateTestData.user({ email: undefined });
            await test_helpers_1.assertions.expectToThrowAsync(() => userService.createUser(userData), 'Email is required');
        });
        (0, globals_1.it)('should throw error when password is missing', async () => {
            const userData = test_helpers_1.generateTestData.user({ password: undefined });
            await test_helpers_1.assertions.expectToThrowAsync(() => userService.createUser(userData), 'Password is required');
        });
        (0, globals_1.it)('should throw error for duplicate email', async () => {
            const userData = test_helpers_1.generateTestData.user({
                email: 'duplicate@example.com'
            });
            await userService.createUser(userData);
            await test_helpers_1.assertions.expectToThrowAsync(() => userService.createUser(userData), 'Email already exists');
        });
        (0, globals_1.it)('should validate email format', async () => {
            for (const validEmail of test_data_1.validationFixtures.validEmails) {
                const userData = test_helpers_1.generateTestData.user({ email: validEmail });
                const result = await userService.createUser(userData);
                (0, globals_1.expect)(result.email).toBeValidEmail();
            }
        });
    });
    (0, globals_1.describe)('findUserById', () => {
        (0, globals_1.it)('should find user by id', async () => {
            const userData = test_helpers_1.generateTestData.user();
            const createdUser = await userService.createUser(userData);
            const foundUser = await userService.findUserById(createdUser.id);
            (0, globals_1.expect)(foundUser).toEqual(createdUser);
        });
        (0, globals_1.it)('should throw error when user not found', async () => {
            await test_helpers_1.assertions.expectToThrowAsync(() => userService.findUserById('non-existent-id'), 'User not found');
        });
    });
    (0, globals_1.describe)('findUserByEmail', () => {
        (0, globals_1.it)('should find user by email', async () => {
            const userData = test_helpers_1.generateTestData.user({
                email: 'findme@example.com'
            });
            const createdUser = await userService.createUser(userData);
            const foundUser = await userService.findUserByEmail(userData.email);
            (0, globals_1.expect)(foundUser).toEqual(createdUser);
        });
        (0, globals_1.it)('should return undefined when user not found', async () => {
            const result = await userService.findUserByEmail('nonexistent@example.com');
            (0, globals_1.expect)(result).toBeUndefined();
        });
    });
    (0, globals_1.describe)('updateUser', () => {
        (0, globals_1.it)('should update user successfully', async () => {
            const userData = test_helpers_1.generateTestData.user();
            const createdUser = await userService.createUser(userData);
            const updates = { name: 'Updated Name' };
            const updatedUser = await userService.updateUser(createdUser.id, updates);
            (0, globals_1.expect)(updatedUser.name).toBe('Updated Name');
            (0, globals_1.expect)(updatedUser).toHaveProperty('updatedAt');
            (0, globals_1.expect)(updatedUser.updatedAt).toBeValidISODate();
        });
        (0, globals_1.it)('should throw error when user not found', async () => {
            await test_helpers_1.assertions.expectToThrowAsync(() => userService.updateUser('non-existent-id', { name: 'Test' }), 'User not found');
        });
    });
    (0, globals_1.describe)('deleteUser', () => {
        (0, globals_1.it)('should delete user successfully', async () => {
            const userData = test_helpers_1.generateTestData.user();
            const createdUser = await userService.createUser(userData);
            const result = await userService.deleteUser(createdUser.id);
            (0, globals_1.expect)(result).toBe(true);
            (0, globals_1.expect)(userService.getUserCount()).toBe(0);
        });
        (0, globals_1.it)('should throw error when user not found', async () => {
            await test_helpers_1.assertions.expectToThrowAsync(() => userService.deleteUser('non-existent-id'), 'User not found');
        });
    });
    (0, globals_1.describe)('edge cases and boundaries', () => {
        (0, globals_1.it)('should handle maximum email length', async () => {
            const longEmail = 'a'.repeat(240) + '@test.com';
            const userData = test_helpers_1.generateTestData.user({ email: longEmail });
            const result = await userService.createUser(userData);
            (0, globals_1.expect)(result.email).toBe(longEmail);
        });
        (0, globals_1.it)('should handle special characters in name', async () => {
            const userData = test_helpers_1.generateTestData.user({
                name: 'José María O\'Connor-Smith'
            });
            const result = await userService.createUser(userData);
            (0, globals_1.expect)(result.name).toBe('José María O\'Connor-Smith');
        });
        (0, globals_1.it)('should handle concurrent user creation', async () => {
            const userPromises = Array.from({ length: 10 }, (_, i) => userService.createUser(test_helpers_1.generateTestData.user({
                email: `user${i}@example.com`
            })));
            const results = await Promise.all(userPromises);
            (0, globals_1.expect)(results).toHaveLength(10);
            (0, globals_1.expect)(userService.getUserCount()).toBe(10);
            const ids = results.map(u => u.id);
            const uniqueIds = new Set(ids);
            (0, globals_1.expect)(uniqueIds.size).toBe(10);
        });
    });
    (0, globals_1.describe)('performance tests', () => {
        (0, globals_1.it)('should create user within acceptable time', async () => {
            const userData = test_helpers_1.generateTestData.user();
            const start = Date.now();
            await userService.createUser(userData);
            const duration = Date.now() - start;
            (0, globals_1.expect)(duration).toBeLessThan(100);
        });
        (0, globals_1.it)('should handle bulk operations efficiently', async () => {
            const userCount = 1000;
            const users = Array.from({ length: userCount }, (_, i) => test_helpers_1.generateTestData.user({
                email: `bulk${i}@example.com`
            }));
            const start = Date.now();
            for (const user of users) {
                await userService.createUser(user);
            }
            const duration = Date.now() - start;
            (0, globals_1.expect)(userService.getUserCount()).toBe(userCount);
            (0, globals_1.expect)(duration).toBeLessThan(5000);
        });
    });
});
//# sourceMappingURL=example.test.js.map