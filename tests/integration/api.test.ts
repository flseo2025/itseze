/**
 * Integration Tests Example
 * Tests the interaction between components
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';

import { userFixtures, authFixtures, httpFixtures } from '../fixtures/test-data';
import { generateTestData, dbHelpers } from '../utils/test-helpers';

// Mock Express app for demonstration
const express = require('express');

const createApp = () => {
  const app = express();
  app.use(express.json());
  
  // Mock in-memory storage
  const users: any[] = [];
  let currentId = 1;
  
  // Routes
  app.post('/api/users', (req: any, res: any) => {
    const { name, email, password } = req.body;
    
    // Validation
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
  
  app.get('/api/users/:id', (req: any, res: any) => {
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
  
  app.get('/api/users', (req: any, res: any) => {
    const { page = 1, limit = 10, search } = req.query;
    let filteredUsers = users;
    
    if (search) {
      filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
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
  
  app.put('/api/users/:id', (req: any, res: any) => {
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
  
  app.delete('/api/users/:id', (req: any, res: any) => {
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
  
  // Health check endpoint
  app.get('/api/health', (req: any, res: any) => {
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

describe('User API Integration Tests', () => {
  let app: any;
  
  beforeAll(async () => {
    app = createApp();
    // Initialize database or other services
    console.log('🚀 Setting up integration test environment...');
  });
  
  afterAll(async () => {
    // Clean up resources
    console.log('🧹 Cleaning up integration test environment...');
  });
  
  beforeEach(async () => {
    // Reset state before each test
    await dbHelpers.clearTables('users');
  });

  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!'
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Assert
      expect(response.body).toMatchObject({
        success: true,
        data: {
          name: userData.name,
          email: userData.email,
          id: expect.any(String),
          createdAt: expect.any(String)
        }
      });
      
      expect(response.body.data.createdAt).toBeValidISODate();
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 400 for missing email', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        password: 'SecurePass123!'
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      // Assert
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Email is required'
        }
      });
    });

    it('should return 409 for duplicate email', async () => {
      // Arrange
      const userData = generateTestData.user({
        email: 'duplicate@example.com'
      });

      // Create user first time
      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Act - Try to create again
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);

      // Assert
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'Email already exists'
        }
      });
    });

    it('should handle concurrent user creation', async () => {
      // Arrange
      const userPromises = Array.from({ length: 5 }, (_, i) =>
        request(app)
          .post('/api/users')
          .send(generateTestData.user({
            email: `concurrent${i}@example.com`
          }))
      );

      // Act
      const responses = await Promise.all(userPromises);

      // Assert
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.email).toBe(`concurrent${index}@example.com`);
      });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should retrieve user by id', async () => {
      // Arrange - Create a user first
      const userData = generateTestData.user();
      const createResponse = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.data.id;

      // Act
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: userId,
          name: userData.name,
          email: userData.email
        }
      });
    });

    it('should return 404 for non-existent user', async () => {
      // Act
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      // Assert
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'User not found'
        }
      });
    });
  });

  describe('GET /api/users', () => {
    beforeEach(async () => {
      // Create test users
      const users = Array.from({ length: 15 }, (_, i) =>
        generateTestData.user({
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`
        })
      );

      for (const user of users) {
        await request(app)
          .post('/api/users')
          .send(user);
      }
    });

    it('should retrieve paginated users', async () => {
      // Act
      const response = await request(app)
        .get('/api/users?page=1&limit=10')
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String)
          })
        ]),
        pagination: {
          page: 1,
          limit: 10,
          total: 15,
          totalPages: 2
        }
      });

      expect(response.body.data).toHaveLength(10);
    });

    it('should search users by name', async () => {
      // Act
      const response = await request(app)
        .get('/api/users?search=User 1')
        .expect(200);

      // Assert
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      response.body.data.forEach((user: any) => {
        expect(user.name.toLowerCase()).toContain('user 1');
      });
    });

    it('should handle empty search results', async () => {
      // Act
      const response = await request(app)
        .get('/api/users?search=NonExistentUser')
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        success: true,
        data: [],
        pagination: {
          total: 0,
          totalPages: 0
        }
      });
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update user successfully', async () => {
      // Arrange
      const userData = generateTestData.user();
      const createResponse = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.data.id;
      const updates = { name: 'Updated Name' };

      // Act
      const response = await request(app)
        .put(`/api/users/${userId}`)
        .send(updates)
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: userId,
          name: 'Updated Name',
          email: userData.email,
          updatedAt: expect.any(String)
        }
      });

      expect(response.body.data.updatedAt).toBeValidISODate();
    });

    it('should return 404 for non-existent user', async () => {
      // Act
      const response = await request(app)
        .put('/api/users/non-existent-id')
        .send({ name: 'Updated Name' })
        .expect(404);

      // Assert
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'User not found'
        }
      });
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userData = generateTestData.user();
      const createResponse = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      const userId = createResponse.body.data.id;

      // Act
      await request(app)
        .delete(`/api/users/${userId}`)
        .expect(204);

      // Assert - Verify user is deleted
      await request(app)
        .get(`/api/users/${userId}`)
        .expect(404);
    });

    it('should return 404 for non-existent user', async () => {
      // Act
      const response = await request(app)
        .delete('/api/users/non-existent-id')
        .expect(404);

      // Assert
      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: 'User not found'
        }
      });
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      // Act
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'healthy',
          timestamp: expect.any(String),
          uptime: expect.any(Number)
        }
      });

      expect(response.body.data.timestamp).toBeValidISODate();
      expect(response.body.data.uptime).toBeGreaterThan(0);
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle malformed JSON', async () => {
      // Act
      const response = await request(app)
        .post('/api/users')
        .send('{ invalid json }')
        .set('Content-Type', 'application/json')
        .expect(400);

      // Assert
      expect(response.status).toBe(400);
    });

    it('should handle large request bodies', async () => {
      // Arrange
      const largeString = 'a'.repeat(1000000); // 1MB string
      const userData = generateTestData.user({
        name: largeString
      });

      // Act & Assert
      // This should either succeed or fail gracefully
      const response = await request(app)
        .post('/api/users')
        .send(userData);

      expect([201, 413]).toContain(response.status);
    });
  });
});