const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'itseze API',
    version: '1.0.0',
    description: 'Comprehensive API documentation for itseze project with Claude Code integration',
    contact: {
      name: 'API Support',
      url: 'https://github.com/flseo2025/itseze',
      email: 'support@itseze.com'
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
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
        bearerFormat: 'JWT'
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key'
      }
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            description: 'Error message'
          },
          code: {
            type: 'integer',
            description: 'Error code'
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Error timestamp'
          }
        },
        required: ['error', 'code']
      },
      Success: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Operation success status'
          },
          data: {
            type: 'object',
            description: 'Response data'
          },
          message: {
            type: 'string',
            description: 'Success message'
          }
        }
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
      description: 'User authentication and authorization'
    },
    {
      name: 'Users',
      description: 'User management operations'
    },
    {
      name: 'Data',
      description: 'Data management and retrieval'
    },
    {
      name: 'Admin',
      description: 'Administrative operations'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    './src/**/*.js',
    './src/**/*.ts',
    './routes/**/*.js',
    './controllers/**/*.js',
    './middleware/**/*.js'
  ]
};

module.exports = options;