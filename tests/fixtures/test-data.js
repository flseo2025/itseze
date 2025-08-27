"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFixtures = exports.envFixtures = exports.httpFixtures = exports.validationFixtures = exports.dbFixtures = exports.apiFixtures = exports.authFixtures = exports.userFixtures = void 0;
exports.userFixtures = {
    validUser: {
        id: 'user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'SecurePass123!',
        role: 'user',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    },
    adminUser: {
        id: 'admin-456',
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'AdminPass456!',
        role: 'admin',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    },
    inactiveUser: {
        id: 'user-789',
        name: 'Inactive User',
        email: 'inactive@example.com',
        password: 'InactivePass789!',
        role: 'user',
        isActive: false,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
    }
};
exports.authFixtures = {
    validCredentials: {
        email: 'john.doe@example.com',
        password: 'SecurePass123!'
    },
    invalidCredentials: {
        email: 'nonexistent@example.com',
        password: 'WrongPassword'
    },
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    refreshToken: 'refresh-token-abc123',
    expiredToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIyfQ.invalid-signature'
};
exports.apiFixtures = {
    successResponse: {
        success: true,
        data: { id: '123', message: 'Operation completed successfully' },
        timestamp: '2024-01-01T00:00:00.000Z'
    },
    errorResponse: {
        success: false,
        error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: ['Email is required', 'Password must be at least 8 characters']
        },
        timestamp: '2024-01-01T00:00:00.000Z'
    },
    notFoundResponse: {
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Resource not found',
            details: []
        },
        timestamp: '2024-01-01T00:00:00.000Z'
    },
    unauthorizedResponse: {
        success: false,
        error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
            details: []
        },
        timestamp: '2024-01-01T00:00:00.000Z'
    }
};
exports.dbFixtures = {
    users: [
        exports.userFixtures.validUser,
        exports.userFixtures.adminUser,
        exports.userFixtures.inactiveUser
    ],
    posts: [
        {
            id: 'post-123',
            title: 'First Test Post',
            content: 'This is the content of the first test post.',
            authorId: 'user-123',
            published: true,
            tags: ['test', 'example'],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
            id: 'post-456',
            title: 'Second Test Post',
            content: 'This is the content of the second test post.',
            authorId: 'admin-456',
            published: false,
            tags: ['draft', 'admin'],
            createdAt: '2024-01-02T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z'
        }
    ],
    comments: [
        {
            id: 'comment-123',
            content: 'This is a test comment.',
            authorId: 'user-123',
            postId: 'post-123',
            createdAt: '2024-01-01T12:00:00.000Z',
            updatedAt: '2024-01-01T12:00:00.000Z'
        }
    ]
};
exports.validationFixtures = {
    validEmails: [
        'user@example.com',
        'test.email+tag@example.co.uk',
        'user123@subdomain.example.com'
    ],
    invalidEmails: [
        'invalid-email',
        '@example.com',
        'user@',
        'user@@example.com',
        'user@example',
        ''
    ],
    validPasswords: [
        'SecurePass123!',
        'MyPassword@456',
        'ComplexP@ssw0rd'
    ],
    invalidPasswords: [
        'weak',
        '12345678',
        'password',
        'PASSWORD123',
        'Pass123',
        ''
    ],
    validUuids: [
        '123e4567-e89b-12d3-a456-426614174000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    ],
    invalidUuids: [
        'not-a-uuid',
        '123e4567-e89b-12d3-a456-42661417400',
        '123e4567-e89b-12d3-a456-426614174000-extra',
        '123e4567-e89b-12d3-a456-42661417400g'
    ]
};
exports.httpFixtures = {
    headers: {
        json: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        authenticated: (token) => ({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }),
        formData: {
            'Content-Type': 'multipart/form-data'
        }
    },
    requests: {
        createUser: {
            method: 'POST',
            url: '/api/users',
            body: {
                name: 'New User',
                email: 'newuser@example.com',
                password: 'NewUserPass123!'
            }
        },
        loginUser: {
            method: 'POST',
            url: '/api/auth/login',
            body: {
                email: 'john.doe@example.com',
                password: 'SecurePass123!'
            }
        },
        updateUser: {
            method: 'PUT',
            url: '/api/users/user-123',
            body: {
                name: 'Updated Name',
                email: 'updated@example.com'
            }
        }
    }
};
exports.envFixtures = {
    test: {
        NODE_ENV: 'test',
        DATABASE_URL: 'sqlite::memory:',
        JWT_SECRET: 'test-jwt-secret',
        JWT_EXPIRES_IN: '1h',
        BCRYPT_ROUNDS: '10',
        API_BASE_URL: 'http://localhost:3000'
    },
    production: {
        NODE_ENV: 'production',
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/prod_db',
        JWT_SECRET: 'super-secret-jwt-key',
        JWT_EXPIRES_IN: '24h',
        BCRYPT_ROUNDS: '12',
        API_BASE_URL: 'https://api.example.com'
    }
};
exports.errorFixtures = {
    validationError: {
        name: 'ValidationError',
        message: 'Validation failed',
        details: [
            { field: 'email', message: 'Email is required' },
            { field: 'password', message: 'Password must be at least 8 characters' }
        ]
    },
    notFoundError: {
        name: 'NotFoundError',
        message: 'Resource not found',
        statusCode: 404
    },
    unauthorizedError: {
        name: 'UnauthorizedError',
        message: 'Authentication required',
        statusCode: 401
    },
    forbiddenError: {
        name: 'ForbiddenError',
        message: 'Insufficient permissions',
        statusCode: 403
    },
    internalServerError: {
        name: 'InternalServerError',
        message: 'An unexpected error occurred',
        statusCode: 500
    }
};
//# sourceMappingURL=test-data.js.map