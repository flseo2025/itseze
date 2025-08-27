/**
 * @fileoverview API Documentation Middleware
 * @description Express middleware for serving API documentation with Swagger UI
 * @version 1.0.0
 * @author itseze Development Team
 * @since 2024-01-01
 */

import { readFileSync } from 'fs';
import path from 'path';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * Swagger configuration options
 * @typedef {Object} SwaggerOptions
 * @property {Object} definition - OpenAPI definition
 * @property {string[]} apis - API files to parse
 */

/**
 * OpenAPI 3.0 specification definition
 * @type {SwaggerOptions}
 */
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'itseze API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for itseze project with real-time features and SPARC methodology integration',
      contact: {
        name: 'API Support Team',
        url: 'https://github.com/flseo2025/itseze',
        email: 'support@itseze.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      termsOfService: 'https://itseze.com/terms'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://api-staging.itseze.com',
        description: 'Staging server'
      },
      {
        url: 'https://api.itseze.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for user authentication'
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for server-to-server authentication'
        },
        oAuth2: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://api.itseze.com/oauth/authorize',
              tokenUrl: 'https://api.itseze.com/oauth/token',
              scopes: {
                'read': 'Read access to user data',
                'write': 'Write access to user data',
                'admin': 'Administrative access'
              }
            }
          }
        }
      },
      schemas: {
        Error: {
          type: 'object',
          required: ['error', 'code'],
          properties: {
            error: {
              type: 'string',
              description: 'Human-readable error message',
              example: 'Resource not found'
            },
            code: {
              type: 'string',
              description: 'Machine-readable error code',
              example: 'RESOURCE_NOT_FOUND'
            },
            details: {
              type: 'object',
              description: 'Additional error details',
              additionalProperties: true
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error occurrence timestamp',
              example: '2024-01-15T10:30:00.000Z'
            },
            requestId: {
              type: 'string',
              description: 'Unique request identifier for tracking',
              example: 'req_1234567890abcdef'
            }
          }
        },
        Success: {
          type: 'object',
          required: ['success'],
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response payload',
              additionalProperties: true
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'Operation completed successfully'
            },
            metadata: {
              type: 'object',
              description: 'Additional response metadata',
              properties: {
                totalCount: {
                  type: 'integer',
                  description: 'Total number of items (for paginated responses)'
                },
                page: {
                  type: 'integer',
                  description: 'Current page number'
                },
                pageSize: {
                  type: 'integer',
                  description: 'Number of items per page'
                }
              }
            }
          }
        },
        User: {
          type: 'object',
          required: ['id', 'email'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique user identifier',
              example: 'usr_1234567890'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            name: {
              type: 'string',
              description: 'User display name',
              example: 'John Doe'
            },
            avatar: {
              type: 'string',
              format: 'uri',
              description: 'User avatar URL',
              example: 'https://api.itseze.com/avatars/user123.jpg'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last profile update timestamp'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin', 'moderator'],
              description: 'User role',
              example: 'user'
            },
            verified: {
              type: 'boolean',
              description: 'Email verification status',
              example: true
            }
          }
        },
        DataEntry: {
          type: 'object',
          required: ['id', 'title', 'content'],
          properties: {
            id: {
              type: 'string',
              description: 'Unique entry identifier',
              example: 'ent_1234567890'
            },
            title: {
              type: 'string',
              description: 'Entry title',
              example: 'Sample Data Entry'
            },
            content: {
              type: 'object',
              description: 'Entry content data',
              additionalProperties: true
            },
            category: {
              type: 'string',
              description: 'Entry category',
              example: 'documentation'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Entry tags for categorization',
              example: ['api', 'documentation', 'example']
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Entry creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            },
            userId: {
              type: 'string',
              description: 'ID of the user who created this entry'
            },
            visibility: {
              type: 'string',
              enum: ['public', 'private', 'shared'],
              description: 'Entry visibility level',
              example: 'public'
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'The requested resource was not found',
                code: 'RESOURCE_NOT_FOUND',
                timestamp: '2024-01-15T10:30:00.000Z',
                requestId: 'req_1234567890abcdef'
              }
            }
          }
        },
        Unauthorized: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Authentication is required to access this resource',
                code: 'UNAUTHORIZED',
                timestamp: '2024-01-15T10:30:00.000Z'
              }
            }
          }
        },
        Forbidden: {
          description: 'Access forbidden',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'You do not have permission to access this resource',
                code: 'FORBIDDEN',
                timestamp: '2024-01-15T10:30:00.000Z'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: {
                  email: 'Valid email address is required',
                  password: 'Password must be at least 8 characters'
                }
              }
            }
          }
        },
        RateLimitExceeded: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                error: 'Rate limit exceeded',
                code: 'RATE_LIMIT_EXCEEDED',
                details: {
                  limit: 1000,
                  remaining: 0,
                  resetTime: '2024-01-15T11:00:00.000Z'
                }
              }
            }
          }
        }
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          },
          example: 1
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20
          },
          example: 20
        },
        SortParam: {
          name: 'sort',
          in: 'query',
          description: 'Sort field and direction (field:asc or field:desc)',
          schema: {
            type: 'string'
          },
          example: 'createdAt:desc'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and session management'
      },
      {
        name: 'Users',
        description: 'User profile and account management'
      },
      {
        name: 'Data',
        description: 'Data entry CRUD operations'
      },
      {
        name: 'Files',
        description: 'File upload, download, and management'
      },
      {
        name: 'Search',
        description: 'Search and filtering operations'
      },
      {
        name: 'Analytics',
        description: 'Usage analytics and reporting'
      },
      {
        name: 'Admin',
        description: 'Administrative operations (admin only)'
      }
    ]
  },
  apis: [
    './src/routes/**/*.js',
    './src/controllers/**/*.js',
    './src/middleware/**/*.js',
    './src/models/**/*.js'
  ]
};

/**
 * Generate Swagger specification from JSDoc comments
 * @returns {Object} Generated OpenAPI specification
 */
export function generateSwaggerSpec() {
  try {
    const spec = swaggerJSDoc(swaggerOptions);
    return spec;
  } catch (error) {
    console.error('Error generating Swagger spec:', error);
    throw new Error('Failed to generate API documentation');
  }
}

/**
 * Custom Swagger UI configuration
 * @type {Object}
 */
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { color: #3b82f6; }
  `,
  customSiteTitle: 'itseze API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
    requestInterceptor: (request) => {
      // Add custom request headers
      request.headers['X-API-Client'] = 'swagger-ui';
      return request;
    }
  }
};

/**
 * Setup API documentation middleware
 * @param {Object} app - Express application instance
 * @returns {void}
 */
export function setupApiDocs(app) {
  try {
    const spec = generateSwaggerSpec();
    
    // Serve Swagger UI
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(spec, swaggerUiOptions)
    );
    
    // Serve raw OpenAPI spec
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(spec);
    });
    
    // Serve API documentation homepage
    app.get('/docs', (req, res) => {
      res.redirect('/api-docs');
    });
    
    console.log('✅ API documentation available at /api-docs');
  } catch (error) {
    console.error('❌ Failed to setup API documentation:', error);
  }
}

/**
 * Middleware to add API documentation headers
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
export function addDocumentationHeaders(req, res, next) {
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-API-Docs', 'https://api.itseze.com/api-docs');
  next();
}

/**
 * Generate API documentation in multiple formats
 * @param {string} outputDir - Output directory for generated docs
 * @returns {Promise<void>}
 */
export async function generateStaticDocs(outputDir = './docs/api') {
  try {
    const spec = generateSwaggerSpec();
    
    // Write OpenAPI spec to file
    const specPath = path.join(outputDir, 'swagger.json');
    writeFileSync(specPath, JSON.stringify(spec, null, 2));
    
    console.log(`✅ OpenAPI specification written to ${specPath}`);
    
    // Generate static HTML documentation
    const htmlContent = swaggerUi.generateHTML(spec, swaggerUiOptions);
    const htmlPath = path.join(outputDir, 'index.html');
    writeFileSync(htmlPath, htmlContent);
    
    console.log(`✅ Static HTML documentation generated at ${htmlPath}`);
  } catch (error) {
    console.error('❌ Failed to generate static documentation:', error);
    throw error;
  }
}

export default {
  setupApiDocs,
  generateSwaggerSpec,
  addDocumentationHeaders,
  generateStaticDocs
};