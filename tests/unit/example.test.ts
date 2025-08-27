/**
 * Example Unit Test
 * Demonstrates testing best practices and patterns
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

import { userFixtures, validationFixtures } from '../fixtures/test-data';
import { generateTestData, testSetup, assertions } from '../utils/test-helpers';

// Mock a service for demonstration
class UserService {
  private users: any[] = [];

  async createUser(userData: any) {
    // Validate required fields
    if (!userData.email) {
      throw new Error('Email is required');
    }
    
    if (!userData.password) {
      throw new Error('Password is required');
    }

    // Check for duplicate email
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

  async findUserById(id: string) {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async findUserByEmail(email: string) {
    return this.users.find(u => u.email === email);
  }

  async updateUser(id: string, updates: any) {
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

  async deleteUser(id: string) {
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

describe('UserService', () => {
  let userService: UserService;
  let consoleMock: any;

  beforeEach(() => {
    userService = new UserService();
    consoleMock = testSetup.mockConsole();
  });

  afterEach(() => {
    consoleMock.restore();
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user with valid data', async () => {
      // Arrange
      const userData = generateTestData.user({
        email: 'newuser@example.com',
        name: 'New User'
      });

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result).toMatchObject({
        name: userData.name,
        email: userData.email
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('createdAt');
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeValidISODate();
    });

    it('should throw error when email is missing', async () => {
      // Arrange
      const userData = generateTestData.user({ email: undefined });

      // Act & Assert
      await assertions.expectToThrowAsync(
        () => userService.createUser(userData),
        'Email is required'
      );
    });

    it('should throw error when password is missing', async () => {
      // Arrange
      const userData = generateTestData.user({ password: undefined });

      // Act & Assert
      await assertions.expectToThrowAsync(
        () => userService.createUser(userData),
        'Password is required'
      );
    });

    it('should throw error for duplicate email', async () => {
      // Arrange
      const userData = generateTestData.user({
        email: 'duplicate@example.com'
      });

      // Act
      await userService.createUser(userData);

      // Assert
      await assertions.expectToThrowAsync(
        () => userService.createUser(userData),
        'Email already exists'
      );
    });

    it('should validate email format', async () => {
      for (const validEmail of validationFixtures.validEmails) {
        const userData = generateTestData.user({ email: validEmail });
        const result = await userService.createUser(userData);
        expect(result.email).toBeValidEmail();
      }
    });
  });

  describe('findUserById', () => {
    it('should find user by id', async () => {
      // Arrange
      const userData = generateTestData.user();
      const createdUser = await userService.createUser(userData);

      // Act
      const foundUser = await userService.findUserById(createdUser.id);

      // Assert
      expect(foundUser).toEqual(createdUser);
    });

    it('should throw error when user not found', async () => {
      // Act & Assert
      await assertions.expectToThrowAsync(
        () => userService.findUserById('non-existent-id'),
        'User not found'
      );
    });
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      // Arrange
      const userData = generateTestData.user({
        email: 'findme@example.com'
      });
      const createdUser = await userService.createUser(userData);

      // Act
      const foundUser = await userService.findUserByEmail(userData.email);

      // Assert
      expect(foundUser).toEqual(createdUser);
    });

    it('should return undefined when user not found', async () => {
      // Act
      const result = await userService.findUserByEmail('nonexistent@example.com');

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      // Arrange
      const userData = generateTestData.user();
      const createdUser = await userService.createUser(userData);
      const updates = { name: 'Updated Name' };

      // Act
      const updatedUser = await userService.updateUser(createdUser.id, updates);

      // Assert
      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser).toHaveProperty('updatedAt');
      expect(updatedUser.updatedAt).toBeValidISODate();
    });

    it('should throw error when user not found', async () => {
      // Act & Assert
      await assertions.expectToThrowAsync(
        () => userService.updateUser('non-existent-id', { name: 'Test' }),
        'User not found'
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userData = generateTestData.user();
      const createdUser = await userService.createUser(userData);

      // Act
      const result = await userService.deleteUser(createdUser.id);

      // Assert
      expect(result).toBe(true);
      expect(userService.getUserCount()).toBe(0);
    });

    it('should throw error when user not found', async () => {
      // Act & Assert
      await assertions.expectToThrowAsync(
        () => userService.deleteUser('non-existent-id'),
        'User not found'
      );
    });
  });

  describe('edge cases and boundaries', () => {
    it('should handle maximum email length', async () => {
      // Arrange
      const longEmail = `${'a'.repeat(240)  }@test.com`; // 249 characters
      const userData = generateTestData.user({ email: longEmail });

      // Act & Assert
      const result = await userService.createUser(userData);
      expect(result.email).toBe(longEmail);
    });

    it('should handle special characters in name', async () => {
      // Arrange
      const userData = generateTestData.user({
        name: 'José María O\'Connor-Smith'
      });

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result.name).toBe('José María O\'Connor-Smith');
    });

    it('should handle concurrent user creation', async () => {
      // Arrange
      const userPromises = Array.from({ length: 10 }, (_, i) =>
        userService.createUser(generateTestData.user({
          email: `user${i}@example.com`
        }))
      );

      // Act
      const results = await Promise.all(userPromises);

      // Assert
      expect(results).toHaveLength(10);
      expect(userService.getUserCount()).toBe(10);
      
      // Ensure all users have unique IDs
      const ids = results.map(u => u.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });
  });

  describe('performance tests', () => {
    it('should create user within acceptable time', async () => {
      // Arrange
      const userData = generateTestData.user();

      // Act & Assert
      const start = Date.now();
      await userService.createUser(userData);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    it('should handle bulk operations efficiently', async () => {
      // Arrange
      const userCount = 1000;
      const users = Array.from({ length: userCount }, (_, i) =>
        generateTestData.user({
          email: `bulk${i}@example.com`
        })
      );

      // Act
      const start = Date.now();
      for (const user of users) {
        await userService.createUser(user);
      }
      const duration = Date.now() - start;

      // Assert
      expect(userService.getUserCount()).toBe(userCount);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});