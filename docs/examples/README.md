# Code Examples

This directory contains comprehensive examples demonstrating how to use the itseze API in various scenarios and programming languages.

## Available Examples

### Getting Started Examples
- [Basic Setup](basic-setup.md) - Initial configuration and first API call
- [Authentication Examples](authentication.md) - Different auth methods
- [Error Handling](error-handling.md) - Robust error management

### Language-Specific SDKs
- [JavaScript/Node.js](javascript.md) - Complete JavaScript examples
- [Python](python.md) - Python SDK usage examples
- [cURL](curl.md) - Command-line interface examples
- [Postman](postman.md) - Postman collection setup

### Use Case Examples
- [User Management](use-cases/user-management.md) - User operations
- [Data CRUD Operations](use-cases/data-operations.md) - Create, read, update, delete
- [File Management](use-cases/file-operations.md) - Upload and download files
- [Real-time Features](use-cases/real-time.md) - WebSocket integration
- [Batch Operations](use-cases/batch-processing.md) - Bulk operations

### Advanced Examples
- [Custom Middleware](advanced/middleware.md) - Request/response interceptors
- [Rate Limiting](advanced/rate-limiting.md) - Handling API limits
- [Caching Strategies](advanced/caching.md) - Efficient data caching
- [Testing Integration](advanced/testing.md) - Unit and integration tests

## Quick Reference

### Basic API Call
```javascript
const { ItsezeAPI } = require('itseze');

const client = new ItsezeAPI({
  apiKey: process.env.ITSEZE_API_KEY
});

const result = await client.data.list();
console.log(result);
```

### With Error Handling
```javascript
try {
  const result = await client.data.create({
    title: 'Example Entry',
    content: { message: 'Hello World' }
  });
  console.log('Created:', result.id);
} catch (error) {
  if (error.status === 429) {
    console.log('Rate limited, retrying...');
    // Implement retry logic
  } else {
    console.error('API Error:', error.message);
  }
}
```

### Async/Await Pattern
```javascript
async function getUserData(userId) {
  try {
    const [profile, settings, activity] = await Promise.all([
      client.users.getProfile(userId),
      client.users.getSettings(userId),
      client.users.getActivity(userId)
    ]);
    
    return { profile, settings, activity };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}
```

## Running Examples

### Prerequisites
```bash
npm install itseze
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your API credentials
```

### Run Examples
```bash
# JavaScript examples
node examples/javascript/basic-usage.js

# With ES modules
npm run example:basic

# Python examples
python examples/python/basic_usage.py
```

## Example Categories

### 🏗️ Basic Operations
- Authentication and setup
- Simple CRUD operations
- Basic error handling
- Configuration options

### 🔧 Intermediate Usage
- Pagination and filtering
- File uploads and downloads
- Webhook handling
- Custom headers and middleware

### 🚀 Advanced Integration
- Real-time subscriptions
- Batch processing
- Custom retry strategies
- Performance optimization
- Multi-environment setup

### 🧪 Testing Examples
- Unit testing with mocks
- Integration testing
- Load testing scenarios
- Test data management

## Contributing Examples

We welcome community contributions! To add an example:

1. Create your example file in the appropriate directory
2. Include comprehensive comments
3. Add error handling
4. Provide setup instructions
5. Test thoroughly before submitting

### Example Template
```javascript
/**
 * Example: [Brief Description]
 * 
 * This example demonstrates:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 * 
 * Prerequisites:
 * - Node.js 16+
 * - Valid API key
 * - Required dependencies
 */

const { ItsezeAPI } = require('itseze');

// Configuration
const client = new ItsezeAPI({
  apiKey: process.env.ITSEZE_API_KEY,
  // Additional config options
});

async function exampleFunction() {
  try {
    // Example implementation
    const result = await client.someOperation();
    console.log('Success:', result);
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Run example if executed directly
if (require.main === module) {
  exampleFunction()
    .then(() => console.log('Example completed successfully'))
    .catch(console.error);
}

module.exports = { exampleFunction };
```

## Need Help?

- Check the [API Reference](../api/README.md) for detailed endpoint information
- Review [Getting Started Guide](../getting-started.md) for basic setup
- Join our [Discord community](https://discord.gg/itseze) for support
- Report issues on [GitHub](https://github.com/flseo2025/itseze/issues)

---

Happy coding! 🚀