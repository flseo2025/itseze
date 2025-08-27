// Database test helpers
const { jest } = require('@jest/globals');

const setupTestDatabase = async () => {
  // Mock database setup for testing
  global.testDb = {
    users: {
      create: jest.fn().mockImplementation(async (userData) => {
        return {
          id: Math.random().toString(36).substr(2, 9),
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }),
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockImplementation(async (id, updates) => {
        return {
          id,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }),
      delete: jest.fn().mockResolvedValue(true)
    },
    
    posts: {
      create: jest.fn().mockImplementation(async (postData) => {
        return {
          id: Math.random().toString(36).substr(2, 9),
          ...postData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }),
      findById: jest.fn().mockResolvedValue(null),
      delete: jest.fn().mockResolvedValue(true)
    },
    
    clearData: jest.fn().mockResolvedValue(true),
    
    transaction: jest.fn().mockImplementation(async (callback) => {
      return await callback(global.testDb);
    })
  };
  
  console.log('Test database initialized');
};

const teardownTestDatabase = async () => {
  if (global.testDb) {
    if (global.testDb.clearData) {
      await global.testDb.clearData();
    }
    global.testDb = null;
  }
  
  console.log('Test database cleaned up');
};

const createTestData = {
  user: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),
  
  post: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    title: 'Test Post',
    content: 'This is test content',
    authorId: Math.random().toString(36).substr(2, 9),
    published: true,
    tags: ['test'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides
  }),
  
  product: (overrides = {}) => ({
    id: Math.random().toString(36).substr(2, 9),
    name: 'Test Product',
    price: 99.99,
    description: 'A test product',
    inStock: true,
    createdAt: new Date().toISOString(),
    ...overrides
  })
};

module.exports = {
  setupTestDatabase,
  teardownTestDatabase,
  createTestData
};