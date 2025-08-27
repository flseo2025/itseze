"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const globals_1 = require("@jest/globals");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const test_helpers_1 = require("../utils/test-helpers");
const express = require('express');
const createApp = () => {
    const app = express();
    app.use(express.json());
    let users = [];
    let currentId = 1;
    app.post('/api/users', (req, res) => {
        const { name, email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                error: { message: 'Email is required' }
            });
        }
        if (users.find(u => u.email === email)) {
            return res.status(409).json({
                success: false,
                error: { message: 'Email already exists' }
            });
        }
        const user = {
            id: (currentId++).toString(),
            name,
            email,
            createdAt: new Date().toISOString()
        };
        users.push(user);
        res.status(201).json({
            success: true,
            data: user
        });
    });
    app.get('/api/users/:id', (req, res) => {
        const user = users.find(u => u.id === req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }
        res.json({
            success: true,
            data: user
        });
    });
    app.get('/api/users', (req, res) => {
        const { page = 1, limit = 10, search } = req.query;
        let filteredUsers = users;
        if (search) {
            filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()));
        }
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        res.json({
            success: true,
            data: paginatedUsers,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredUsers.length,
                totalPages: Math.ceil(filteredUsers.length / parseInt(limit))
            }
        });
    });
    app.put('/api/users/:id', (req, res) => {
        const userIndex = users.findIndex(u => u.id === req.params.id);
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }
        users[userIndex] = {
            ...users[userIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        res.json({
            success: true,
            data: users[userIndex]
        });
    });
    app.delete('/api/users/:id', (req, res) => {
        const userIndex = users.findIndex(u => u.id === req.params.id);
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' }
            });
        }
        users.splice(userIndex, 1);
        res.status(204).send();
    });
    app.get('/api/health', (req, res) => {
        res.json({
            success: true,
            data: {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            }
        });
    });
    return app;
};
(0, globals_1.describe)('User API Integration Tests', () => {
    let app;
    (0, globals_1.beforeAll)(async () => {
        app = createApp();
        console.log('🚀 Setting up integration test environment...');
    });
    (0, globals_1.afterAll)(async () => {
        console.log('🧹 Cleaning up integration test environment...');
    });
    (0, globals_1.beforeEach)(async () => {
        await test_helpers_1.dbHelpers.clearTables('users');
    });
    (0, globals_1.describe)('POST /api/users', () => {
        (0, globals_1.it)('should create a new user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'SecurePass123!'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send(userData)
                .expect(201);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: true,
                data: {
                    name: userData.name,
                    email: userData.email,
                    id: globals_1.expect.any(String),
                    createdAt: globals_1.expect.any(String)
                }
            });
            (0, globals_1.expect)(response.body.data.createdAt).toBeValidISODate();
            (0, globals_1.expect)(response.body.data).not.toHaveProperty('password');
        });
        (0, globals_1.it)('should return 400 for missing email', async () => {
            const userData = {
                name: 'John Doe',
                password: 'SecurePass123!'
            };
            const response = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send(userData)
                .expect(400);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: false,
                error: {
                    message: 'Email is required'
                }
            });
        });
        (0, globals_1.it)('should return 409 for duplicate email', async () => {
            const userData = test_helpers_1.generateTestData.user({
                email: 'duplicate@example.com'
            });
            await (0, supertest_1.default)(app)
                .post('/api/users')
                .send(userData)
                .expect(201);
            const response = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send(userData)
                .expect(409);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: false,
                error: {
                    message: 'Email already exists'
                }
            });
        });
        (0, globals_1.it)('should handle concurrent user creation', async () => {
            const userPromises = Array.from({ length: 5 }, (_, i) => (0, supertest_1.default)(app)
                .post('/api/users')
                .send(test_helpers_1.generateTestData.user({
                email: `concurrent${i}@example.com`
            })));
            const responses = await Promise.all(userPromises);
            responses.forEach((response, index) => {
                (0, globals_1.expect)(response.status).toBe(201);
                (0, globals_1.expect)(response.body.success).toBe(true);
                (0, globals_1.expect)(response.body.data.email).toBe(`concurrent${index}@example.com`);
            });
        });
    });
    (0, globals_1.describe)('GET /api/users/:id', () => {
        (0, globals_1.it)('should retrieve user by id', async () => {
            const userData = test_helpers_1.generateTestData.user();
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send(userData)
                .expect(201);
            const userId = createResponse.body.data.id;
            const response = await (0, supertest_1.default)(app)
                .get(`/api/users/${userId}`)
                .expect(200);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: true,
                data: {
                    id: userId,
                    name: userData.name,
                    email: userData.email
                }
            });
        });
        (0, globals_1.it)('should return 404 for non-existent user', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/users/non-existent-id')
                .expect(404);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: false,
                error: {
                    message: 'User not found'
                }
            });
        });
    });
    (0, globals_1.describe)('GET /api/users', () => {
        (0, globals_1.beforeEach)(async () => {
            const users = Array.from({ length: 15 }, (_, i) => test_helpers_1.generateTestData.user({
                name: `User ${i + 1}`,
                email: `user${i + 1}@example.com`
            }));
            for (const user of users) {
                await (0, supertest_1.default)(app)
                    .post('/api/users')
                    .send(user);
            }
        });
        (0, globals_1.it)('should retrieve paginated users', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/users?page=1&limit=10')
                .expect(200);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: true,
                data: globals_1.expect.arrayContaining([
                    globals_1.expect.objectContaining({
                        id: globals_1.expect.any(String),
                        name: globals_1.expect.any(String),
                        email: globals_1.expect.any(String)
                    })
                ]),
                pagination: {
                    page: 1,
                    limit: 10,
                    total: 15,
                    totalPages: 2
                }
            });
            (0, globals_1.expect)(response.body.data).toHaveLength(10);
        });
        (0, globals_1.it)('should search users by name', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/users?search=User 1')
                .expect(200);
            (0, globals_1.expect)(response.body.success).toBe(true);
            (0, globals_1.expect)(response.body.data.length).toBeGreaterThan(0);
            response.body.data.forEach((user) => {
                (0, globals_1.expect)(user.name.toLowerCase()).toContain('user 1');
            });
        });
        (0, globals_1.it)('should handle empty search results', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/users?search=NonExistentUser')
                .expect(200);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: true,
                data: [],
                pagination: {
                    total: 0,
                    totalPages: 0
                }
            });
        });
    });
    (0, globals_1.describe)('PUT /api/users/:id', () => {
        (0, globals_1.it)('should update user successfully', async () => {
            const userData = test_helpers_1.generateTestData.user();
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send(userData)
                .expect(201);
            const userId = createResponse.body.data.id;
            const updates = { name: 'Updated Name' };
            const response = await (0, supertest_1.default)(app)
                .put(`/api/users/${userId}`)
                .send(updates)
                .expect(200);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: true,
                data: {
                    id: userId,
                    name: 'Updated Name',
                    email: userData.email,
                    updatedAt: globals_1.expect.any(String)
                }
            });
            (0, globals_1.expect)(response.body.data.updatedAt).toBeValidISODate();
        });
        (0, globals_1.it)('should return 404 for non-existent user', async () => {
            const response = await (0, supertest_1.default)(app)
                .put('/api/users/non-existent-id')
                .send({ name: 'Updated Name' })
                .expect(404);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: false,
                error: {
                    message: 'User not found'
                }
            });
        });
    });
    (0, globals_1.describe)('DELETE /api/users/:id', () => {
        (0, globals_1.it)('should delete user successfully', async () => {
            const userData = test_helpers_1.generateTestData.user();
            const createResponse = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send(userData)
                .expect(201);
            const userId = createResponse.body.data.id;
            await (0, supertest_1.default)(app)
                .delete(`/api/users/${userId}`)
                .expect(204);
            await (0, supertest_1.default)(app)
                .get(`/api/users/${userId}`)
                .expect(404);
        });
        (0, globals_1.it)('should return 404 for non-existent user', async () => {
            const response = await (0, supertest_1.default)(app)
                .delete('/api/users/non-existent-id')
                .expect(404);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: false,
                error: {
                    message: 'User not found'
                }
            });
        });
    });
    (0, globals_1.describe)('GET /api/health', () => {
        (0, globals_1.it)('should return health status', async () => {
            const response = await (0, supertest_1.default)(app)
                .get('/api/health')
                .expect(200);
            (0, globals_1.expect)(response.body).toMatchObject({
                success: true,
                data: {
                    status: 'healthy',
                    timestamp: globals_1.expect.any(String),
                    uptime: globals_1.expect.any(Number)
                }
            });
            (0, globals_1.expect)(response.body.data.timestamp).toBeValidISODate();
            (0, globals_1.expect)(response.body.data.uptime).toBeGreaterThan(0);
        });
    });
    (0, globals_1.describe)('Error handling and edge cases', () => {
        (0, globals_1.it)('should handle malformed JSON', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send('{ invalid json }')
                .set('Content-Type', 'application/json')
                .expect(400);
            (0, globals_1.expect)(response.status).toBe(400);
        });
        (0, globals_1.it)('should handle large request bodies', async () => {
            const largeString = 'a'.repeat(1000000);
            const userData = test_helpers_1.generateTestData.user({
                name: largeString
            });
            const response = await (0, supertest_1.default)(app)
                .post('/api/users')
                .send(userData);
            (0, globals_1.expect)([201, 413]).toContain(response.status);
        });
    });
});
//# sourceMappingURL=api.test.js.map