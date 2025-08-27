# Getting Started with itseze API

This guide will help you get started with the itseze API quickly and efficiently.

## Prerequisites

Before you begin, make sure you have:

- Node.js 16.0 or higher
- npm or yarn package manager
- An itseze account (sign up at [itseze.com](https://itseze.com))
- API credentials (available in your dashboard)

## Installation

### npm

```bash
npm install itseze
```

### yarn

```bash
yarn add itseze
```

### CDN (Browser)

```html
<script src="https://cdn.jsdelivr.net/npm/itseze@latest/dist/itseze.min.js"></script>
```

## Quick Setup

### 1. Initialize the Client

```javascript
const { ItsezeAPI } = require('itseze');

const client = new ItsezeAPI({
  apiKey: process.env.ITSEZE_API_KEY,
  baseURL: 'https://api.itseze.com',
  version: 'v1',
  timeout: 10000
});
```

### 2. Environment Configuration

Create a `.env` file in your project root:

```env
ITSEZE_API_KEY=your_api_key_here
ITSEZE_BASE_URL=https://api.itseze.com
ITSEZE_ENVIRONMENT=development
```

### 3. Basic Configuration

```javascript
const config = {
  apiKey: process.env.ITSEZE_API_KEY,
  baseURL: process.env.ITSEZE_BASE_URL || 'https://api.itseze.com',
  retries: 3,
  retryDelay: 1000,
  timeout: 30000,
  headers: {
    'User-Agent': 'itseze-client/1.0.0'
  }
};

const client = new ItsezeAPI(config);
```

## Your First API Call

### Authenticate and Get User Profile

```javascript
async function getUserProfile() {
  try {
    // Authenticate (if needed)
    await client.authenticate();
    
    // Get user profile
    const profile = await client.users.getProfile();
    console.log('User Profile:', profile);
    
    return profile;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

// Usage
getUserProfile()
  .then(profile => console.log('Success!', profile))
  .catch(error => console.error('Failed:', error));
```

### Create Your First Data Entry

```javascript
async function createDataEntry() {
  try {
    const newEntry = await client.data.create({
      title: 'My First Entry',
      category: 'getting-started',
      content: {
        description: 'This is my first API call!',
        tags: ['tutorial', 'first-steps'],
        metadata: {
          source: 'getting-started-guide'
        }
      }
    });
    
    console.log('Created entry:', newEntry);
    return newEntry;
  } catch (error) {
    console.error('Failed to create entry:', error);
    throw error;
  }
}
```

## Error Handling

Always implement proper error handling:

```javascript
const client = new ItsezeAPI({
  apiKey: process.env.ITSEZE_API_KEY,
  onError: (error) => {
    console.error('API Error:', error);
    // Custom error handling logic
  }
});

async function safeApiCall() {
  try {
    const result = await client.data.list({
      limit: 10,
      offset: 0
    });
    return result;
  } catch (error) {
    if (error.status === 401) {
      console.error('Authentication failed');
      // Handle auth error
    } else if (error.status === 429) {
      console.error('Rate limit exceeded');
      // Handle rate limiting
    } else {
      console.error('Unexpected error:', error);
      // Handle other errors
    }
    throw error;
  }
}
```

## Common Use Cases

### 1. List and Filter Data

```javascript
// Get all data entries
const allEntries = await client.data.list();

// Filter by category
const filteredEntries = await client.data.list({
  filters: {
    category: 'important'
  },
  limit: 50,
  sort: 'created_at:desc'
});

// Search entries
const searchResults = await client.data.search({
  query: 'documentation',
  fields: ['title', 'content']
});
```

### 2. File Upload and Management

```javascript
// Upload a file
const fileUpload = await client.files.upload({
  file: fileBuffer,
  filename: 'document.pdf',
  mimeType: 'application/pdf',
  metadata: {
    category: 'documents'
  }
});

// Get file info
const fileInfo = await client.files.getInfo(fileUpload.id);

// Download file
const fileData = await client.files.download(fileUpload.id);
```

### 3. Batch Operations

```javascript
// Batch create multiple entries
const entries = [
  { title: 'Entry 1', category: 'batch' },
  { title: 'Entry 2', category: 'batch' },
  { title: 'Entry 3', category: 'batch' }
];

const batchResult = await client.data.batchCreate(entries);
console.log(`Created ${batchResult.success.length} entries`);
```

## Advanced Configuration

### Custom Interceptors

```javascript
const client = new ItsezeAPI({
  apiKey: process.env.ITSEZE_API_KEY,
  interceptors: {
    request: (config) => {
      console.log('Making request:', config.url);
      config.headers['X-Client-Version'] = '1.0.0';
      return config;
    },
    response: (response) => {
      console.log('Response received:', response.status);
      return response;
    }
  }
});
```

### Retry Configuration

```javascript
const client = new ItsezeAPI({
  apiKey: process.env.ITSEZE_API_KEY,
  retry: {
    attempts: 3,
    delay: 1000,
    exponentialBackoff: true,
    retryOn: [408, 429, 500, 502, 503, 504]
  }
});
```

## Testing Your Integration

### Unit Test Example

```javascript
const { ItsezeAPI } = require('itseze');

describe('itseze API Integration', () => {
  let client;
  
  beforeEach(() => {
    client = new ItsezeAPI({
      apiKey: 'test-api-key',
      baseURL: 'https://api-test.itseze.com'
    });
  });
  
  test('should fetch user profile', async () => {
    const profile = await client.users.getProfile();
    expect(profile).toHaveProperty('id');
    expect(profile).toHaveProperty('email');
  });
  
  test('should create data entry', async () => {
    const entry = await client.data.create({
      title: 'Test Entry',
      category: 'test'
    });
    expect(entry).toHaveProperty('id');
    expect(entry.title).toBe('Test Entry');
  });
});
```

## Next Steps

Now that you have the basics working:

1. **[Explore the API Reference](api/README.md)** - Detailed endpoint documentation
2. **[Read the Developer Guides](guides/README.md)** - In-depth tutorials
3. **[Check out Examples](examples/README.md)** - Real-world use cases
4. **[Learn about Authentication](authentication.md)** - Security best practices

## Need Help?

- **Documentation**: Browse this documentation site
- **GitHub Issues**: [Report bugs or request features](https://github.com/flseo2025/itseze/issues)
- **Community Support**: Join our [Discord server](https://discord.gg/itseze)
- **Email Support**: contact our team at support@itseze.com

---

**Tip**: Keep your API keys secure and never commit them to version control. Use environment variables or a secure key management system.